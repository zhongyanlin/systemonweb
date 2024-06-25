/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package telaman;

import java.io.*;
import java.util.*;
import java.util.regex.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
 
@WebServlet(name = "Everify", urlPatterns = {"/Everify"},   asyncSupported = false)
public class Everify extends HttpServlet 
{
     
     public void doPost(HttpServletRequest  request, HttpServletResponse  response)  throws ServletException, IOException
     { 
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum < 0) return;
        User user = (User)(session.getAttribute("User"));
        response.setContentType("text/html;charset=" + Toolbox.encodings[orgnum>>16]);
        PrintWriter out = response.getWriter();
        CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >" + Toolbox.getMeta(orgnum) +"<head><title>" + Toolbox.dbadmin[orgnum%65536].unitname[orgnum>>16] +"</title></head><body bgcolor=" + cachedstyle.DBGCOLOR + ">");
       
        String msg = "";
       if ( CaptchaServlet.passed(request) == false)
       {
          msg = Toolbox.emsgs(orgnum,1463); 
       }
       else
       {
            String message = Toolbox.defaultParam(orgnum,request, ("message"), null);
            if (message==null )
            {
                msg = "No message";
            }
            else if ( message.length() > 20000)
            {
                msg = "too long";
            }
            else
            {
                
                 message = message.trim();
                 String digest = message.substring(message.length()-40);
                 message = message.substring(0,message.length()-40);
                 message = message.replaceAll("<[a-z][^>]+>", "").replaceAll("<\\/[a-z][^>]*>", "").replaceAll("\r","").replaceAll("\n","").replaceAll(" ","").replaceAll("\t",  "");
                 msg = Sha1.hash1( Esign.signrsastr + message);
                 msg = msg.equals(digest)? Toolbox.emsgs(orgnum,1295) : Toolbox.emsgs(orgnum,1296);
            }

       }
        out.println("<script>parent.myprompt('" + msg + "');</script>");
        out.println("</body></html>");
        out.flush();
        out.close();     
    } 

    
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        
    } 
 
   
    public String getServletInfo() {
        return "Short description";
    } 

}

