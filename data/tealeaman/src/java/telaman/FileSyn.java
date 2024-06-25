/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.*;
 

public class FileSyn {
    public static String os = System.getProperty("os.name");

    public static int syn(String source, String dir, String filter, int seconds, boolean both) {
        File b = new File(dir);
        if (b.exists()) b.mkdir();
        boolean newloc = false;
        if (!(dir.equals("") || b.exists())) {
           // b.mkdir();
            mkdir(dir);
            newloc = true;
        }
        if (dir.equals("") || !b.exists() || b.isFile()) {
            return 0;
        }
        int n = 0;
        TreeSet severtree = new TreeSet();
        Filetri.listing("", b, new FileHas(filter), severtree);
        File c = new File(source);
        TreeSet localtree = new TreeSet();
        Filetri.listing("", c, new FileHas(filter), localtree);
        String folder = "";
        String s2t = "";
        Iterator i = localtree.iterator();
        Iterator j = severtree.iterator();
        StringBuffer up = new StringBuffer();
        Filetri x = null;
        Filetri y = null;
        if (i.hasNext()) {
            x = (Filetri)i.next();
        }
        if (j.hasNext()) {
            y = (Filetri)j.next();
        }
        while (x != null && y != null) {
            int k;
            long m;
            if ((k = x.compareTo(y)) < 0) {
                s2t = FileSyn.copy(source, x, dir, s2t);
                ++n;
                if (i.hasNext()) {
                    x = (Filetri)i.next();
                    continue;
                }
                x = null;
                continue;
            }
            if (k > 0) {
                if (both) {
                    ++n;
                    folder = FileSyn.copy(dir, y, source, folder);
                }
                if (j.hasNext()) {
                    y = (Filetri)j.next();
                    continue;
                }
                y = null;
                continue;
            }
            if ((m = x.lastupdate - y.lastupdate) < (long)(- seconds)) {
                if (both) {
                    ++n;
                    folder = FileSyn.copy(dir, y, source, folder);
                }
            } else if (m > (long)seconds) {
                ++n;
                s2t = FileSyn.copy(source, x, dir, s2t);
            }
            x = i.hasNext() ? (Filetri)i.next() : null;
            if (j.hasNext()) {
                y = (Filetri)j.next();
                continue;
            }
            y = null;
        }
        while (x != null) {
            ++n;
            s2t = FileSyn.copy(source, x, dir, s2t);
            if (i.hasNext()) {
                x = (Filetri)i.next();
                continue;
            }
            x = null;
        }
        while (y != null) {
            if (both) {
                ++n;
                folder = FileSyn.copy(dir, y, source, folder);
            } else {
                new File(dir + File.separator + y.name).delete();
            }
            if (j.hasNext()) {
                y = (Filetri)j.next();
                continue;
            }
            y = null;
        }
        return n;
    }

    public static String userdir(String uid, int orgnum) {
        String sql;
        int n;
        JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
        boolean j = false;
         
        sql = "SELECT webFileFolder, roles FROM AppUser WHERE id='" + uid.replaceAll("'", "''") + "'";
        if (adapter.executeQuery2(sql,false)==false || adapter.getValueAt(0,0)==null) {
            adapter.close();
            return null;
        }
        long roles = 0;
        String webFileFolder = adapter.getValueAt(0, 0);
        try {
            roles = Long.parseLong(adapter.getValueAt(0, 1));
        }
        catch (Exception e) {
            roles = 0;
        }
        adapter.close();
        if (webFileFolder == null) {
            return null;
        }
        if (webFileFolder.equals("")) {
            return null;
        }
        if (!webFileFolder.equals("/")) {
            return webFileFolder;
        }
        if (!(roles <= 1 || Toolbox.dbadmin[orgnum%65536].webFileFolder == null || Toolbox.dbadmin[orgnum%65536].webFileFolder.equals(""))) {
            return Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + uid;
        }
        if (!((roles & 1) != 1 || Toolbox.dbadmin[orgnum%65536].webFileFolder1 == null || Toolbox.dbadmin[orgnum%65536].webFileFolder1.equals(""))) {
            return Toolbox.dbadmin[orgnum%65536].webFileFolder1 + File.separator + uid;
        }
        return null;
    }

    public static int synfolders(int orgnum) {
        JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
        int j = 0;
          {
            int i;
            String sql = "SELECT folder, backup FROM Backupfolder";
            int n = 0;
            boolean bn = adapter.executeQuery2(sql,false);
            ArrayList<String>  fd = new ArrayList();
            ArrayList<String>  bp = new ArrayList();
            for (i = 0; bn&&adapter.getValueAt(i, 0)!=null; ++i) {
                fd.add(adapter.getValueAt(i, 0));
                bp.add(adapter.getValueAt(i, 1));
            }
            
            for (i = 0; i < n; ++i) {
                j+=FileSyn.syn(fd.get(i), bp.get(i), "", 300000, false);
            }
        }
        adapter.close();
        return j;
    }

    public static String schedulerun(String time, String days) {
        String[] daystr = new String[]{"su", "m", "t", "w", "r", "f", "s", "0", "1", "2", "3", "4", "5", "6"};
        if (FileSyn.os.indexOf("Window") >= 0) {
            if (!(days == null || days.equals(""))) {
                String[] daysa = days.split(",");
                for (int i = 0; i < daysa.length; ++i) {
                    int j;
                    for (j = 0; j < 14; ++j) {
                        if (daysa[i].equals(daystr[j])) break;
                    }
                    if (j != 14) continue;
                    return "Incorrect days format: " + daysa[i] + ".  The days should contains digits in (0 1 2 3 4 5 6) separated by \",\"  e.g. 1,3,6 for m, w, s";
                }
                days = days.replaceFirst("1", "m").replaceFirst("2", "t").replaceFirst("3", "w").replaceFirst("4", "th").replaceFirst("5", "f").replaceFirst("6", "s").replaceFirst("7", "su").replaceFirst("0", "su").replaceAll(" ", "");
            }
            String atcom = "at  11:11 echo \" \"";
            try {
                Runtime runtime = Runtime.getRuntime();
                Process proc = runtime.exec(atcom);
                int recode = proc.waitFor();
                atcom = "at";
                proc = runtime.exec(atcom);
                String err = "";
                String aline = null;
                String bline = null;
                String cline = null;
                InputStream stderr = proc.getInputStream();
                InputStreamReader isr = new InputStreamReader(stderr);
                BufferedReader br = new BufferedReader(isr);
                while ((aline = br.readLine()) != null) {
                    if (aline.indexOf("telaman.FileSyn") > 0) {
                        bline = aline;
                    } else if (aline.indexOf("echo ") > 0 && aline.indexOf("11:11") > 0) {
                        cline = aline;
                    }
                    if (bline == null || cline == null) continue;
                }
                recode = proc.waitFor();
                if (bline != null) {
                    aline = bline.replaceFirst("^[ ]+", "").replaceFirst(" .*", "");
                    atcom = "at " + aline + " /delete /yes";
                    proc = runtime.exec(atcom);
                    recode = proc.waitFor();
                }
                if (cline != null) {
                    aline = cline.replaceFirst("^[ ]+", "").replaceFirst(" .*", "");
                    atcom = "at " + aline + " /delete /yes";
                    proc = runtime.exec(atcom);
                    recode = proc.waitFor();
                }
                if (time == null || time.trim().equals("") || days == null || days.trim().equals("")) {
                    return "The scheduled file synchronization as been canceled because time or days are missing. The time format should be hh:mm (hh in 0~23), and  the days format 0,1,2,3,4,5,6  e.g. 1,3,6";
                }
                if (!time.replaceFirst("[ ]*[0-2][0-9]:[0-5][0-9][ ]*", "").equals("")) {
                    return "Incorrect time: " + time + ". Time format should be hh:mm  (hh in 0~23) e.g 23:01 01:59";
                }
                atcom = "at " + time + " /every:" + days + " java -classpath " + Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "classes telaman.FileSyn";
                proc = runtime.exec(atcom);
                recode = proc.waitFor();
                return err + " <br>" + atcom;
            }
            catch (Exception e) {
                return e.toString();
            }
        }
        String[] daysarr = days.replaceFirst("m", "1").replaceFirst("t", "2").replaceFirst("w", "3").replaceFirst("r", "4").replaceFirst("f", "5").replaceFirst("s", "6").replaceFirst("su", "0").split(",");
        String tt = "To set the scheduled task, please edit the /etc/crontab to contain lines:<br><br>";
        for (int j = 0; j < daysarr.length; ++j) {
            tt = tt + time.replaceFirst("[0-9]+.", "") + " " + time.replaceFirst(".[0-9]+", "") + " * * " + daysarr[j] + " yourUserId java -classpath " + Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "classes telaman.FileSyn<br>";
        }
        return tt;
    }

    public static void main(String[] args) {
        String source = null;
        String target = null;
        if (args.length < 2) {
           // FileSyn.synfolders();
           // return;
           args = new String[]{"C:\\customer0\\db","C:\\customer0\\db1"};
        }
        source = args[0];
        target = args[1];
        int second = 3000;
        boolean both = false;
        String filter = "";
        if (args.length > 2) {
            try {
                second = Integer.parseInt(args[2]);
            }
            catch (Exception e) {
                // empty catch block
            }
        }
        if (args.length > 3) {
            both = args[3].equals("true");
        }
        if (args.length > 4) {
            filter = args[4];
        }
        int k = FileSyn.syn(source, target, filter, second, both);
    }

    public static void mkdir(String path) {
        int j = 0;
        File f = null;
        while ((j = path.indexOf(File.separator, j + 1)) > 0) {
            if ((f = new File(path.substring(0, j))).exists()) continue;
            f.mkdir();
        }
        if (!(f = new File(path)).exists()) {
            f.mkdir();
        }
    }

    public static void del(File f) {
        if (f.isDirectory()) {
            File[] l = f.listFiles();
            for (int i = 0; i < l.length; ++i) {
                FileSyn.del(l[i]);
            }
        }
        f.delete();
    }

    public static String copy(String dir, Filetri source, String dest, String prev) {
        int i = source.name.lastIndexOf(File.separator );
        String curr = "";
        if (i > 0) {
            curr = source.name.substring(0, i);
        }
        if (!curr.equals(prev)) {
            FileSyn.mkdir(dest + File.separator + curr);
        }
        File f = new File(dir + File.separator + source.name);
        dest = dest + File.separator + source.name;
        dest = File.separator.equals("\\") ? dest.replace('/', '\\') : dest.replace('\\', '/');
        File t = new File(dest);
        if (f.isFile()) {
            int jj = 0;
            byte[] buf = new byte[1024];
            try {
                FileInputStream fin = new FileInputStream(f);
                FileOutputStream fout = new FileOutputStream(t);
                while ((jj = fin.read(buf)) > 0) {
                    fout.write(buf, 0, jj);
                }
                fin.close();
                fout.close();
            }
            catch (Exception e) {
                // empty catch block
            }
        }
        boolean b = t.setLastModified(f.lastModified());
        return curr;
    }
}
