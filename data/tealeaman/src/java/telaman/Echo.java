/*
 *  
 */
package telaman;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import telaman.Toolbox;
@WebServlet(name = "Echo", urlPatterns = {"/Echo"},   asyncSupported = false)
public class Echo
extends HttpServlet {
    boolean isget = false;

    static public void echo(HttpServletRequest request)
    {
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request,null);
        Enumeration e = request.getParameterNames();
        boolean isget = request.getMethod().toLowerCase().equals("GET"); 
         
        while (e.hasMoreElements()) 
        {
            String na = (String)e.nextElement();
            if ( isget) 
            {
                na = Toolbox.c2c(na,orgnum);
            }
            String va = Toolbox.defaultParam(orgnum,request, (na), null);
            if ( isget) 
            {
              //  va = Toolbox.c2c(va);
            }
            if  (na.length() < 30) na = na + "                                 ".substring(0, 30-na.length());
            Toolbox.println(0,na + va.replaceAll("\r\n", "\n").replaceAll("\r", "\n").replaceAll("\n", "\n                                 "));
        }
    }

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
       HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
    if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        User user = (User)(session.getAttribute("User"));
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE><html lang=\""+Toolbox.langs[orgnum>>16]+"\" >");
        out.print(Toolbox.getMeta(orgnum));
        out.println("<head>");
        out.println(cachedstyle.toString() + "<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\" />\n<title>echo</title>");
        out.println("</head>");
        out.println("<body><table align=center>");
        out.println(Toolbox.title(Toolbox.emsgs(orgnum,1451), 1));
        out.println("<tr><td>&nbsp;</td></tr><tr><td><table align=center  style=\"border-radius:4px;border:1px #b0b0b0 outset;background-color:" + cachedstyle.DBGCOLOR + ";\" cellspacing=3 cellpadding=3 >");
        out.println("<tr><td valign=top style=\"background-color:" + cachedstyle.BBGCOLOR + ";font-size:16px;font-family:" + Toolbox.fontsnamestr(orgnum>>16) + "\">" + Toolbox.emsgs(orgnum,14) 
                + "</td><td bgcolor=white  style=\"background-color:" + cachedstyle.BBGCOLOR + ";font-size:16px;font-family:" + Toolbox.fontsnamestr(orgnum>>16) + "\">" + Toolbox.emsgs(orgnum,867) + "</td></tr>");
        
        Enumeration e = request.getParameterNames();
        while (e.hasMoreElements()) {
            String na = (String)e.nextElement();
            if (this.isget) {
              //  na = Toolbox.c2c(na);
            }
            String va = Toolbox.defaultParam(orgnum,request, (na), null);
            if (this.isget) {
                va = Toolbox.c2c(va,orgnum);
              
            }
            out.println("<tr><td valign=top style=\"background-color:" + cachedstyle.BBGCOLOR + ";font-size:16px;font-family:" + Toolbox.fontsnamestr(orgnum>>16) + "\">" + na + "</td><td bgcolor=white>" + va + "</td></tr>");
        }
        out.println("</table></td></tr><tr><td>&nbsp;</td></tr><tr><td align=center><script>if(parent==window)document.write('<input type=button style=width:70px;text-align:center class=GreenButton value=\"" + Toolbox.emsgs(orgnum,82) + "\" onclick=\"window.close()\" >'); </script></td></tr></table></body>");
        out.println("</html>");
        out.close();
    }
    
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
    }

    public void destroy() {
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.isget = true;
        this.processRequest(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.isget = false;
        this.processRequest(request, response);
    }

    public String getServletInfo() {
        return "Short description";
    }
}
