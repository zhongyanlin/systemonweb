 
package telaman;

import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import telaman.Toolbox;
@WebServlet(name = "NextPage", urlPatterns = {"/NextPage"},   asyncSupported = false)
public class NextPage
extends HttpServlet 
{
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        String formatrdap = Toolbox.defaultParam(orgnum,request, ("id"), null);
        formatrdap = Toolbox.validate(formatrdap, "%$#?:", 500);
        if (formatrdap != null) {
            Object x = session.getAttribute(formatrdap);
            session.setAttribute("savedDBRequest", x);
            session.removeAttribute(formatrdap);
            String url = "/Data" + formatrdap.replaceFirst(":.*", "");
            
            RequestDispatcher dispat = this.getServletConfig().getServletContext().getRequestDispatcher(url);
            dispat.forward((ServletRequest)request, (ServletResponse)response);
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
