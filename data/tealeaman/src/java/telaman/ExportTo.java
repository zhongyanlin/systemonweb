 
package telaman;

import java.io.IOException;
import java.io.PrintWriter;
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
import telaman.DataMove;
import telaman.Toolbox;
import telaman.User;
@WebServlet(name = "ExportTo", urlPatterns = {"/ExportTo"},   asyncSupported = false)
public class ExportTo
extends HttpServlet {
    boolean isget = true;

    
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        User c;
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum < 0) return;
        CachedStyle cachedstyle = new CachedStyle(request,orgnum);
        String whom = Toolbox.defaultParam(orgnum,request, ("whom"), null);
        whom = Toolbox.validate(whom, null, 30);
        if (this.isget) {
         //   whom = Toolbox.c2c(whom);
        }
        String sql = Toolbox.defaultParam(orgnum,request, ("selectsql"), null);
        String overlap = Toolbox.defaultParam(orgnum,request, ("overlap"), null);
        if ((c = (User)session.getAttribute("User")) == null || orgnum!=c.orgnum ) {
            RequestDispatcher requestdispatcher1 = this.getServletConfig().getServletContext().getRequestDispatcher("/login.jsp?orgnum=" + orgnum);
            requestdispatcher1.forward((ServletRequest)request, (ServletResponse)response);
            return;
        }
         
        PrintWriter out = response.getWriter();
        String err = DataMove.exportdata(c, sql, overlap, false);
        out.println(err);
        out.close();
    }
    
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
    }

    public void destroy() {
    }


    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest(request, response);
        this.isget = true;
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.isget = false;
        this.processRequest(request, response);
    }

    public String getServletInfo() {
        return "Short description";
    }
}
