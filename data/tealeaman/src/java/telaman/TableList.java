 
package telaman;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import telaman.DBConnectInfo;
import telaman.Generic;
import telaman.JDBCAdapter;
import telaman.Toolbox;
import telaman.User;
@WebServlet(name = "TableList", urlPatterns = {"/TableList"},   asyncSupported = false)
public class TableList
extends HttpServlet {
    protected boolean isget = false;

    

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
       HttpSession session = request.getSession(true);
       int orgnum = Toolbox.setcharset(request, response);
        if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        PrintWriter out = response.getWriter();
        String table = Toolbox.defaultParam(orgnum,request, "exist", null);
        
        Object current = session.getAttribute("User");
        if (current == null) {
            out.println("No active session. Please login");
            return;
        }
        User user = (User)current;
        if (orgnum!=user.orgnum || !(user.mydb || (user.roles & 8) != 0)) {
            out.println("Not Authorized.");
            return;
        }
        JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
        String[] tables = adapter.tableList();
        adapter.close();
        if (table != null) {
            int i;
            for (i = 0; !(i >= tables.length || table.equals(tables[i])); ++i) {
            }
            out.println("<script  type=text/javascript>opener.syn('" + (i < tables.length ? 1 : -1) + "');var win=window.open('','_top','',true);win.opener=true;win.close();</script>");
            return;
        }
        out.println("<script  type=text/javascript>function openit(a, b){window.open(a,b,'toolbar=0,menubar=0,location=0,resizable=1,scrollbars=1');}</script>");
        out.print(cachedstyle.toString() + "<link rel=stylesheet  type=text/css  href=styleb" + (orgnum) + ".css />");
        out.println("<TABLE cellpadding=1 cellspacing=1 align=center class=outset1 >\n" + Toolbox.title("Tables in the Database", 3));
        out.println("<tr style=background:url(image/bheading.gif)><td width=150>Table Name</td> <td>Definition</td>  <td>Data</td> </tr>");
        for (int i = tables.length - 1; i >= 0; --i) {
            out.println("<tr bgcolor=" + cachedstyle.TBGCOLOR + "><td>" + tables[i] + "<td align=center>");
            out.println("<a href=\"javascript:openit('TableDef?title=" + tables[i] + "','" + tables[i] + "')\">Definition</a><td align=center> ");
            out.println("<a href=\"javascript:openit('DataTable?title=" + tables[i] + "&query=select%20*%20from%20" + tables[i] + "','" + tables[i] + "')\">Data</a>");
        }
        out.println("</TABLE>" + Generic.height(tables.length * 30 + 150));
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.isget = true;
        this.processRequest(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.isget = false;
        this.processRequest(request, response);
    }

    public void init(ServletConfig config) throws ServletException {
        super.init(config);
    }

    public void destroy() {
    }
}
