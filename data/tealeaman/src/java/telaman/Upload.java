 
package telaman;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import telaman.FileOperation;
import telaman.ServerAgent;
import telaman.Toolbox;
@WebServlet(name = "Upload", urlPatterns = {"/Upload"},   asyncSupported = false)
public class Upload extends HttpServlet 
{
    public static String attachedFolder = null;

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (Upload.attachedFolder == null) {
            Upload.attachedFolder = ServerAgent.workingFolder.replaceFirst("\\\\[^\\\\]+$", "").replaceFirst("/[^/]+$", "") + File.separator + "attached";
        }
        if (!new File(Upload.attachedFolder).exists()) {
            new File(Upload.attachedFolder).mkdir();
        }
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        User user = (User)(session.getAttribute("User"));
        PrintWriter out = response.getWriter();
        response.setContentType("text/html;charset=" + Toolbox.encodings[orgnum>>16]);
        out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >");
        out.println(Toolbox.getMeta(orgnum) + "<head>");
        out.println("<title></title>");
        out.println(cachedstyle.toString() + "<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\"></head><body>");
        String boundary = request.getContentType();
        String filename = null;
        String dir = null;
        int i = 0;
        if (boundary != null && (i = boundary.indexOf("boundary=")) != -1) {
            int k;
            boundary = boundary.substring(i + 9);
            boundary = "--" + boundary;
            int B = boundary.length() + 2;
            long length = 0;
            ServletInputStream sin = request.getInputStream();
            int L = 2048;
            byte[] b = new byte[2048];
            int j = 0;
            boolean dofile = false;
            String override = "0";
            FileOutputStream binout = null;
            String aline = null;
            byte[] crlf = new byte[2];
            boolean left = false;
            String token = null;
            String path = null;
            while ((k = sin.readLine(b, 0, 2048)) > 0) {
                if (!dofile) {
                    if ((aline = new String(b, 0, k)).indexOf("dir") >= 0) {
                        k = sin.readLine(b, 0, 2048);
                        k = sin.readLine(b, 0, 2048);
                        aline = new String(b, 0, k);
                        dir = aline.replaceAll("\n", "").trim();
                    }
                    if (aline.indexOf("securitytoken") >= 0) {
                        k = sin.readLine(b, 0, 2048);
                        k = sin.readLine(b, 0, 2048);
                        if ((token = (aline = new String(b, 0, k)).replaceAll("\n", "").trim()) == null || Toolbox.verifytoken(token)) continue;
                        out.println(Toolbox.emsgs(orgnum,1404));
                        sin.close();
                        out.close();
                        return;
                    }
                    if (aline.indexOf("override") >= 0) {
                        k = sin.readLine(b, 0, 2048);
                        k = sin.readLine(b, 0, 2048);
                        aline = new String(b, 0, k);
                        override = aline.replaceAll("\n", "").trim();
                        continue;
                    }
                    if (aline.indexOf("filename") < 0) continue;
                    aline = aline.replaceAll("\n", "").trim();
                    j = aline.lastIndexOf("\"");
                    aline = aline.substring(0, j);
                    int jj = aline.lastIndexOf("\\");
                    i = jj < 0 && (j = aline.lastIndexOf("/")) < 0 ? aline.lastIndexOf("\"") : (jj >= 0 && j < 0 ? jj : (jj < 0 && j >= 0 ? j : (j > jj ? j : jj)));
                    filename = aline.substring(i + 1);
                    filename = Toolbox.validate(filename, null, 20);
                    filename = FileOperation.getFileName(filename);
                    try {
                        String dir1;
                        if (dir == null) {
                            dir = "photo";
                        }
                        if (!new File(dir1 = Upload.attachedFolder + File.separator + dir).exists()) {
                            new File(dir1).mkdir();
                        }
                        while (override.equals("0") && new File(dir1, filename).exists()) {
                            filename = addone(filename);
                        }
                        binout = new FileOutputStream(new File(dir1, filename));
                        path = dir1 + File.separator + filename;
                    }
                    catch (Exception e) {
                        binout = null;
                        out.println("<script  type=text/javascript>if (parent.myprompt)parent.myprompt('" + path.replace('\\', '/') + "');</script>");
                        out.println("System error: fail to create file " + path);
                        e.printStackTrace();
                        sin.close();
                        out.close();
                        return;
                    }
                    k = sin.readLine(b, 0, 2048);
                    k = sin.readLine(b, 0, 2048);
                    dofile = true;
                    continue;
                }
                if (binout == null) continue;
                if (k == B && (aline = new String(b, 0, k)).indexOf(boundary) == 0) {
                    dofile = false;
                    continue;
                }
                if (left) {
                    binout.write(crlf, 0, 2);
                    length+=2;
                }
                if (k < 2) {
                    binout.write(b, 0, k);
                    left = false;
                    continue;
                }
                if (k > 2) {
                    binout.write(b, 0, k - 2);
                    length+=(long)(k - 2);
                }
                crlf[0] = b[k - 2];
                crlf[1] = b[k - 1];
                left = true;
            }
            if (token == null && path != null) {
                new File(path).delete();
            }
            if (binout != null) {
                binout.close();
                out.println("File length=" + length + " bytes");
                sin.close();
                String d = "Download?filedir=" + dir + "/" + filename;
                if (token != null) {
                    out.println("<script  type=text/javascript>if (opener.onlinetooltextarea!=null){opener.onlinetooltextarea.value = opener.onlinetooltextarea.value +\"\\n" + d + "\";close();} else if (parent.uploadsyn){parent.uploadsyn('" + d + "'); } else if (typeof(opener.document.form1.attach)!='undefined'){opener.document.form1.attach.value=opener.document.form1.attach.value+';" + d + "';close();}</script><a href=\"" + d + "\">" + d + "</a>");
                }
            }
            out.println("</body></html>");
        }
        out.close();
    }

    public String addone(String sn) {
        int j;
        int i = sn.indexOf(".");
        if (i == -1) {
            i = sn.length();
        }
        for (j = i - 1; j >= 0 && sn.charAt(j) <= '9' && sn.charAt(j) >= '0'; --j) {
        }
        String t = "";
        if (j + 1 == i) {
            t = sn.substring(0, i) + '1';
        } else {
            if ((t = sn.substring(j + 1, i).replaceFirst("^0+", "")).equals("")) {
                t = "0";
            }
            int k = Integer.parseInt(t) + 1;
            t = "" + k;
            while (t.length() < i - j - 1) {
                t = t + '0' + t;
            }
            if (j + 1 > 0) {
                t = sn.substring(0, j + 1) + t;
            }
        }
        if (i < sn.length()) {
            t = t + sn.substring(i);
        }
        return t;
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }
}
