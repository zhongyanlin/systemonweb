 
package telaman;

import java.io.*;
import java.util.Iterator;
import java.util.TreeSet;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import telaman.FileHas;
import telaman.FileSyn;
import telaman.FileSynweb;
import telaman.Filetri;
import telaman.Sha1;
import telaman.Toolbox;
@WebServlet(name = "FileSynweb1", urlPatterns = {"/FileSynweb1"},   asyncSupported = false)
public class FileSynweb1
extends HttpServlet {
    
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out = response.getWriter();
        boolean reach = false;
        try {
            String fileset;
            String filter;
            String direct;
            String uid;
            String userdir;
            String str;
            String second;
            String shacode;
            ServletInputStream servletinputstream = request.getInputStream();
            BufferedReader ds = new BufferedReader(new InputStreamReader((InputStream)servletinputstream));
           // DataInputStream ds = new DataInputStream((InputStream)servletinputstream);
            String dir = ds.readLine();
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
            if ((direct = ds.readLine()) == null) {
                return;
            }
            if ((uid = ds.readLine()) == null) {
                return;
            }
            if ((shacode = ds.readLine()) == null) {
                return;
            }
            if ((fileset = ds.readLine()) == null) {
                return;
            }
            if (!Sha1.hash(FileSynweb.webfilekey + uid).equals(shacode)) {
                out.println("!User not authenticated. You may need to ownload the updated version \n");
                return;
            }
            if ((userdir = FileSyn.userdir(uid,0)) == null || userdir.equals("") || !new File(userdir).exists()) {
                out.println("!User not exists\n");
                return;
            }
            String fname = "z";
            if (dir.equals(File.separator)) {
                dir = "";
            } else if (dir.charAt(0) == File.separator.charAt(0)) {
                dir = dir.substring(1);
            }
            dir = userdir + File.separator + dir;
            if (!new File(dir).exists()) {
                FileSyn.mkdir(dir);
            }
            while (new File(userdir + File.separator + fname + ".jar").exists() || new File(userdir + File.separator + fname).exists()) {
                fname = fname + "z";
            }
            File f = new File(userdir + File.separator + fname + ".jar");
            new File(userdir + File.separator + fname).mkdir();
            FileOutputStream fout = new FileOutputStream(f);
            byte[] bb = new byte[2048];
            int k = 0;
            while ((k = servletinputstream.read(bb)) > 0) {
                fout.write(bb, 0, k);
            }
            servletinputstream.close();
            fout.close();
            Runtime r = Runtime.getRuntime();
            Process proc = r.exec("jar xf .." + File.separator + fname + ".jar", (String[])null, new File(userdir + File.separator + fname));
            InputStream is = proc.getInputStream();
            DataInputStream bs = new DataInputStream(is);
            while ((str = bs.readLine()) != null) {
                out.println(str);
            }
            k = proc.waitFor();
            f.delete();
            TreeSet severtree = new TreeSet();
            String ff = userdir + File.separator + fname;
            f = new File(ff + File.separator + filter);
            if (!f.exists()) {
                out.println("!" + f.getAbsolutePath() + " " + Toolbox.emsg(1531));
                out.close();
            } else if (!f.isDirectory()) {
                out.println("!" + f.getAbsolutePath() + " is not a folder");
                out.close();
            } else if (k == 0) {
                Filetri.listing("", f, new FileHas(""), severtree);
                Iterator j = severtree.iterator();
                Filetri y = null;
                String folder = "";
                int n = 0;
                while (j.hasNext()) {
                    y = (Filetri)j.next();
                    folder = FileSyn.copy(f.getAbsolutePath(), y, dir, folder);
                    ++n;
                }
                out.println(dir + " uploaded: " + n);
                FileSyn.del(new File(userdir + File.separator + fname));
            }
        }
        catch (Exception e) {
            out.println("!Error" + e.toString());
            out.close();
        }
    }

    String readPara(ServletInputStream s) {
        byte[] num = new byte[20];
        try {
            if (20 == s.read(num)) {
                String str = new String(num);
                int k = Integer.parseInt(str);
                num = new byte[k];
                s.read(num);
                return new String(num);
            }
        }
        catch (Exception e) {
            // empty catch block
        }
        return null;
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
