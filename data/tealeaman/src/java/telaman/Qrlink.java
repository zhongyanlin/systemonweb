 
package telaman;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import static telaman.FileOperation.typedes;
@WebServlet(name = "Qrlink", urlPatterns = {"/Qrlink"},   asyncSupported = false) 
public class Qrlink extends HttpServlet {

    
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
            HttpSession session = request.getSession(true);
            int orgnum = Toolbox.setcharset(request, response);
            if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
                
            ServletOutputStream stream = null;
            BufferedInputStream buf = null;
            String url = Toolbox.defaultParam(orgnum,request, ("url"), null); 
            String nologin = Toolbox.defaultParam(orgnum,request, ("nlg"), null);
            
            User user = (User) session.getAttribute("User");
           // RequestDispatcher dispat = this.getServletConfig().getServletContext().getRequestDispatcher("/login.jsp?orgnum=" + orgnum + "&follow=Qrlink&error=generic&zpcrpt=" +  Encode6b.zip64("url=" + url) );
             
            url = Msgsend.back(url);
    
            if (url.indexOf("http://localhost")==0) 
            {
                String x = Toolbox1.geturl(request).replaceFirst("(.*//[^/]+).*", "$1");
               
                url = url.replaceFirst("http://localhost",x);
               
            }    
            long now = System.currentTimeMillis();
            String entry = null;
            int i=0;
            if (nologin == null && user!=null) 
            {    
                entry = now +   "." + user.id + "." +   Math.random() ;
                for ( ; i < Toolbox.pins.size(); i++)
                {
                    String q = Toolbox.pins.elementAt(i);
                    if (q==null || Long.parseLong(q.replaceFirst("\\..*","")) + 2000000 < now)
                        break;
                }
                if ( i < Toolbox.pins.size())
                     Toolbox.pins.setElementAt(entry,i);
                else 
                     Toolbox.pins.addElement(entry);
                if (url.indexOf("?")>0)
                url +=   "&qrqlpin=" + entry;
                else url += "?qrqlpin=" + entry;
            }
            if (url.indexOf("&orgnum=")<0 && url.indexOf("?orgnum=")<0)
            {
                if (url.indexOf("?")>0)
                    url +="&orgnum=" + orgnum;
                else
                    url +="?orgnum=" + orgnum;
            }
            String des = "inline";
            String filetypes[] = typedes(des, "qrcode.jpg").split(",");
            String filetype = filetypes[1];
            des = filetypes[0];
            try {
                response.setContentType(filetype);
                response.addHeader("Content-Disposition", des + ";filename=qrcode.jpg" );
                stream = response.getOutputStream();
                     
                Toolbox1.makeqrcode(url, stream);
            } catch (IOException ioe) {
                throw new ServletException(ioe.getMessage());
            } finally {
                if (stream != null) {
                    stream.close();
                }
                if (buf != null) {
                    buf.close();
                }
            }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
