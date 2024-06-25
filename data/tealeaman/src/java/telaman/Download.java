 
package telaman;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
 
@WebServlet(name = "Download", urlPatterns = {"/Download"},   asyncSupported = false)
public class Download extends HttpServlet {
    
     protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        File f;
        if (!Toolbox.verifytoken(request)) {
            PrintWriter out = response.getWriter();
            out.println(Toolbox.emsgs(orgnum,1404));
            out.close();
            return;
        }
        if (Upload.attachedFolder == null) {
            Upload.attachedFolder = ServerAgent.workingFolder.replaceFirst("\\\\[^\\\\]+$", "").replaceFirst("/[^/]+$", "") + File.separator + "attached";
        }
        User user = (User)( session.getAttribute("User"));
        
        String dir0 = "";
        String file = "newfile";
        String des = "";
        Object operation = null;
        dir0 = Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "attach";
        file = Toolbox.defaultParam(orgnum,request, ("filedir"), null);
        if (!(f = new File(dir0 + File.separator + (file = Toolbox.validate(file, ":/\\#@$-", 200).replace('/', File.separatorChar)))).exists()) {
            PrintWriter out = response.getWriter();
            out.println(dir0 + File.separator + " NOT exist");
            return;
        }
        ServletOutputStream stream = null;
        BufferedInputStream buf = null;
        if (des == null || des.equals("")) {
            des = "inline";
        }
        String[] filetypes = Download.typedes(des, file).split(",");
        String filetype = filetypes[1];
        des = filetypes[0];
        try {
            response.setContentType(filetype);
            response.addHeader("Content-Disposition", des + ";filename=" + file);
            stream = response.getOutputStream();
            response.setContentLength((int)f.length());
            FileInputStream input = new FileInputStream(f);
            buf = new BufferedInputStream(input);
            int readBytes = 0;
            while ((readBytes = buf.read()) != -1) {
                stream.write(readBytes);
            }
            input.close();
        }
        catch (IOException ioe) {
            throw new ServletException(ioe.getMessage());
        }
        finally {
            if (stream != null) {
                stream.close();
            }
            if (buf != null) {
                buf.close();
            }
        }
    }

    
    public static String slashs(String dir) {
        if (File.separator.equals("/")) {
            return dir.replace((CharSequence)"\\", (CharSequence)File.separator);
        }
        return dir.replace((CharSequence)"/", (CharSequence)File.separator);
    }

    public static String stdfn(String fn) {
        return fn;
    }

    public static String typedes(String des, String file) {
        if (des == null || des.equals("")) {
            des = "inline";
        }
        String fnl = file.toLowerCase();
        String filetype = "";
        if (fnl.indexOf(".mp3") > 0 || fnl.indexOf(".wma") > 0) {
            filetype = "audio/mpeg";
        } else if (fnl.indexOf(".doc") > 0) {
            filetype = "application/msword";
        } else if (fnl.indexOf(".pdf") > 0) {
            filetype = "application/pdf";
        } else if (fnl.indexOf(".xls") > 0) {
            filetype = "application/vnd.ms-excel";
        } else if (fnl.indexOf(".ppt") > 0) {
            filetype = "application/vnd.ms-ppt";
        } else if (fnl.indexOf(".htm") > 0) {
            filetype = "text/HTML";
        } else if (fnl.indexOf(".xml") > 0) {
            filetype = "text/xml";
        } else if (fnl.indexOf(".jpg") > 0) {
            filetype = "image/JPEG";
        } else if (fnl.indexOf(".gif") > 0) {
            filetype = "image/GIF";
        } else if (fnl.indexOf(".png") > 0) {
            filetype = "image/PNG";
        } else if (fnl.indexOf(".jar") > 0) {
            filetype = "application/java";
        } else if (fnl.indexOf(".txt") > 0 || fnl.indexOf(".tex") > 0 || fnl.indexOf(".java") > 0 || fnl.indexOf(".cpp") > 0 || fnl.indexOf(".js") > 0 || fnl.indexOf(".tex") > 0) {
            filetype = "text/plain";
        } else if (fnl.indexOf(".zip") > 0) {
            filetype = "application/zip";
            des = "attachment";
        } else {
            filetype = "application/x-download";
            des = "attachment";
        }
        return des + "," + filetype;
    }

    public void init(ServletConfig config) throws ServletException {
        super.init(config);
    }

    public void destroy() {
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
