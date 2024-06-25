 
package telaman;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.HashMap;
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

@WebServlet(name = "DataImport", urlPatterns = {"/DataImport"},   asyncSupported = false)
public class DataImport
extends HttpServlet {
    boolean isget = true;

   
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        PrintWriter out = response.getWriter();
        Object current = session.getAttribute("User");
        User user = (User)current;
        HashMap<String, String> saved = (HashMap<String, String>)session.getAttribute("savedBackRequest");
        if (saved == null) {
            saved = new HashMap<String, String>();
        }
        if (user!=null) orgnum=user.orgnum;
        Enumeration e = request.getParameterNames();
        while (e.hasMoreElements()) {
            String na = (String)e.nextElement();
            String va = Toolbox.defaultParam(orgnum,request, (na), null);
            /*if (!Toolbox.encoding.equals("utf-8") && this.isget) {
                na = Toolbox.c2c(na);
                va = Toolbox.c2c(va);
            }*/
            if (saved.containsKey(na)) {
                saved.remove(na);
            }
            saved.put(na, va);
        }
        if (user == null) 
        {
            session.setAttribute("savedBackRequest", saved);
            RequestDispatcher dispat = this.getServletConfig().getServletContext().getRequestDispatcher("/login.jsp?follow=DataImport&error=generic");
            dispat.forward((ServletRequest)request, (ServletResponse)response);
            return;
        }
        
        String sql = (String)saved.get("selectsql");
        String overlap = "backup";
        String err = DataMove.importdata(user, sql, overlap, false);
        session.removeAttribute("savedBackRequest");
        out.print(err);
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
