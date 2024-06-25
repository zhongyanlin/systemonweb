 
package telaman;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.InetAddress;
import java.util.Enumeration;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import telaman.Toolbox;
@WebServlet(name = "UpdateFile", urlPatterns = {"/UpdateFile"},   asyncSupported = false)
public class UpdateFile extends HttpServlet 
{
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        block10 : {
            int orgnum = Toolbox.setcharset(request, response);
            String ip = request.getRemoteAddr();
           
            InetAddress inetAddress = InetAddress.getByName(ip);
            String ipAddress = inetAddress.getHostName();
            String attr = "";
            Enumeration e = request.getAttributeNames();
            while (e.hasMoreElements()) {
                String nm = (String)e.nextElement();
                attr = attr + nm + "=" + (String)request.getAttribute(nm);
            }
            
            String id = Toolbox.defaultParam(orgnum,request, ("cid"), null);
            id = Toolbox.validate(id, null, 20);
            String version = Toolbox.defaultParam(orgnum,request, ("version"), null);
            version = Toolbox.validate(version, null, 30);
            String product = Toolbox.defaultParam(orgnum,request, ("product"), null);
            product = Toolbox.validate(product, "@~", 30);
            String act = Toolbox.defaultParam(orgnum,request, ("act"), null);
            act = Toolbox.validate(act, null, 30);
            String encoding = Toolbox.defaultParam(orgnum,request, ("encoding"), null);
            encoding = Toolbox.validate(encoding, null, 20);
            String filetype = "application/x-download";
            String des = "attachment";
            ServletOutputStream stream = null;
            BufferedInputStream buf = null;
            String filename = "routines.zip";
            try {
                response.setContentType(filetype);
                response.addHeader("Content-Disposition", des + ";filename=");
                stream = response.getOutputStream();
                File f = new File(Toolbox.installpath + File.separator + "WIN-INF" + File.separator + "conf" + File.separator + filename);
                if (!f.exists()) {
                    stream.println(f.getAbsolutePath() + " does not exist");
                    break block10;
                }
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
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest(request, response);
    }
}
