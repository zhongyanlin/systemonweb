 
package telaman;

import java.io.BufferedInputStream;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.TreeSet;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import telaman.FileHas;
import telaman.FileSyn;
import telaman.Filetri;
import telaman.Sha1;
import telaman.Toolbox;
@WebServlet(name = "FileSynweb", urlPatterns = {"/FileSynweb"},   asyncSupported = false)
public class FileSynweb
extends HttpServlet {
    public static String webfilekey = "43sc*2^1_gf-1ew,hm@@%e6421~3412 dfa*)-";

    

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        File f;
        File f1;
        File b;
        boolean newloc;
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum < 0) return;
        block57 : {
            boolean d;
            StringBuffer err = new StringBuffer();
            String dir = "";
            String filter = "";
            String second = "";
            String direct = "s";
            String uid = null;
            String shacode = "";
            long seconds = 3600000;
            boolean keepfile = true;
            TreeSet<Filetri> localtree = new TreeSet<Filetri>();
            try {
                ServletInputStream servletinputstream = request.getInputStream();
                
                DataInputStream ds = new DataInputStream((InputStream)servletinputstream);
                dir = ds.readLine();
                if (dir == null) {
                    return;
                }
                dir = dir.replace('/', File.separator.charAt(0)).replace('\\', File.separator.charAt(0));
                if ((filter = ds.readLine()) == null) {
                    return;
                }
                if ((second = ds.readLine()) == null) {
                    return;
                }
                try {
                    seconds = Long.parseLong(second);
                }
                catch (Exception e) {
                    return;
                }
                direct = ds.readLine();
                if (direct == null) {
                    return;
                }
                if ((uid = ds.readLine()) == null) {
                    return;
                }
                if ((shacode = ds.readLine()) == null) {
                    return;
                }
                try {
                    keepfile = Boolean.parseBoolean(ds.readLine());
                }
                catch (Exception e) {
                    return;
                }
                if (!Sha1.hash(FileSynweb.webfilekey + uid).equals(shacode)) {
                    err.append("User not authenticated. You may need to download the updated version \n");
                    ds.close();
                    this.outerr(response, err);
                    return;
                }
                String aline = "";
                while ((aline = ds.readLine()) != null) {
                    Filetri ft = new Filetri(aline);
                    if (!ft.good) continue;
                    localtree.add(ft);
                }
                ds.close();
            }
            catch (Exception e) {
                err.append(e.toString() + "\n");
            }
            err.append("web dir=" + dir + "\n");
            err.append("filter =" + filter + "\n");
            err.append("seconds=" + second + "\n");
            String userdir = FileSyn.userdir(uid, 0);
            if (userdir == null || userdir.equals("") || !new File(userdir).exists()) {
                err.append(uid + " " + Toolbox.emsgs(orgnum,695) + " " + Toolbox.emsgs(orgnum,1531));
                this.outerr(response, err);
                return;
            }
            b = new File(userdir + File.separator + (dir.equals("/") ? "" : dir));
            newloc = false;
            if (!(dir.equals("") || b.exists())) {
                if (direct.equals("d") || direct.endsWith("s")) {
                    err.append(dir + " " + Toolbox.emsgs(orgnum,1531));
                    this.outerr(response, err);
                    return;
                }
                FileSyn.mkdir(b.getAbsolutePath());
                newloc = true;
            }
            if (dir.equals("") || !b.exists() || b.isFile()) {
                err.append(dir + " invalid");
                this.outerr(response, err);
                return;
            }
            dir = userdir + File.separator + (dir.equals("/") ? "" : dir);
            TreeSet severtree = new TreeSet();
            if (!keepfile) {
                Filetri.listing("", b, new FileHas(filter), severtree);
            } else if (localtree.size() == 1 && ((Filetri)localtree.first()).name.equals("fs" + uid + ".txt")) {
                severtree = localtree;
            } else {
                Filetri.listing(b, severtree, localtree);
            }
            String file = "z";
            while (new File(userdir + File.separator + file).exists() || new File(dir + File.separator + file + ".txt").exists() || new File(userdir + File.separator + file + ".jar").exists()) {
                file = file + "z";
            }
            String dir1 = userdir + File.separator + file;
            String tt = "";
            boolean xx = false;
            f1 = new File(dir1);
            f1.mkdir();
            String folder = "";
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
            boolean bl = d = direct.equals("d") || direct.equals("s");
            while (x != null && y != null) {
                long m;
                int k;
                if ((k = x.compareTo(y)) < 0) {
                    if (!keepfile) {
                        up.append("" + x + "\n");
                    }
                    if (i.hasNext()) {
                        x = (Filetri)i.next();
                        continue;
                    }
                    x = null;
                    continue;
                }
                if (k > 0) {
                    if (d && !keepfile) {
                        folder = FileSyn.copy(dir, y, dir1, folder);
                    }
                    if (j.hasNext()) {
                        y = (Filetri)j.next();
                        continue;
                    }
                    y = null;
                    continue;
                }
                if ((m = x.lastupdate - y.lastupdate) < - seconds) {
                    if (d) {
                        folder = FileSyn.copy(dir, y, dir1, folder);
                    }
                } else if (m > seconds) {
                    up.append("" + x + "\n");
                }
                x = i.hasNext() ? (Filetri)i.next() : null;
                if (j.hasNext()) {
                    y = (Filetri)j.next();
                    continue;
                }
                y = null;
            }
            while (x != null) {
                if (!keepfile) {
                    up.append("" + x + "\n");
                }
                if (i.hasNext()) {
                    x = (Filetri)i.next();
                    continue;
                }
                x = null;
            }
            while (y != null) {
                if (d && !keepfile) {
                    folder = FileSyn.copy(dir, y, dir1, folder);
                }
                if (j.hasNext()) {
                    y = (Filetri)j.next();
                    continue;
                }
                y = null;
            }
            f = null;
            if (up.length() > 0) {
                FileWriter upf = new FileWriter(userdir + File.separator + file + File.separator + file + ".txt", true);
                err.append(up.toString());
                upf.write(up.toString());
                upf.close();
            }
            StringBuffer sb = new StringBuffer();
            Runtime r = Runtime.getRuntime();
            Process proc = null;
            ServletOutputStream stream = null;
            BufferedInputStream buf = null;
            FileInputStream input = null;
            if (f1.list() == null) {
                err.append(Toolbox.emsgs(orgnum,611));
                this.outerr(response, err);
                return;
            }
            try {
                int k;
                String str;
                proc = r.exec("jar cf " + file + ".jar " + file, (String[])null, new File(userdir));
                InputStream is = proc.getInputStream();
                DataInputStream bs = new DataInputStream(is);
                while ((str = bs.readLine()) != null) {
                    err.append(str);
                }
                if (0 == (k = proc.waitFor())) {
                    if (!(f = new File(userdir, file + ".jar")).exists()) {
                        err.append(file + " does not exist or it is held by other user");
                        this.outerr(response, err);
                    } else {
                        response.setContentType("application/zip");
                        response.addHeader("Content-Disposition", "attachment;filename=" + file + ".jar");
                        stream = response.getOutputStream();
                        response.setContentLength((int)f.length());
                        input = new FileInputStream(f);
                        buf = new BufferedInputStream(input);
                        int readBytes = 0;
                        while ((readBytes = buf.read()) != -1) {
                            stream.write(readBytes);
                        }
                        input.close();
                        stream.close();
                    }
                } else {
                    this.outerr(response, err);
                }
            }
            catch (Exception e) {
                this.outerr(response, err);
                if (stream != null) {
                    stream.close();
                }
                if (buf != null) {
                    buf.close();
                }
                if (input == null) break block57;
                input.close();
            }
        }
        f.delete();
        FileSyn.del(f1);
        if (newloc) {
            FileSyn.del(b);
        }
    }

    void outerr(HttpServletResponse response, StringBuffer err) {
        try {
            PrintWriter out = response.getWriter();
            out.print("!" + err);
            out.close();
        }
        catch (Exception e) {
            // empty catch block
        }
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest(request, response);
    }

    public String getServletInfo() {
        return "Short description";
    }
}
