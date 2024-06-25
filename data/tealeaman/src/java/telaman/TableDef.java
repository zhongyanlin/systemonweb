 
package telaman;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
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

@WebServlet(name = "TableDef", urlPatterns = {"/TableDef"},   asyncSupported = false)
public class TableDef extends HttpServlet {
    protected boolean isget = false;

    

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String table;
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
    if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
      
        Object current = session.getAttribute("User");
        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html>\n<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >" + Toolbox.getMeta(orgnum)); 
        if (!Toolbox.verifytoken(request)) {
            out.println("<body>NOT verified<script>onload=function(){parent.myprompt(document.body.innerHTML.replace(/<script.*script>/i,''));}</script>;</body></html>");
            out.close();
            return;
        }
        if (current == null ) {
            out.println("<body  style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\">No active session. Please login.<script>onload=function(){parent.myprompt(document.body.innerHTML.replace(/<script.*script>/i,''));}</script>;</body></html>");
            return;
        }
        User user = (User)current;
        if ((table = Toolbox.defaultParam(orgnum,request, "tablename", null)) == null) {
            out.println("<body  style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\">Empty table name.<script>onload=function(){parent.myprompt(document.body.innerHTML.replace(/<script.*script>/i,''));}</script>;</body></html>");
            return;
        }
        if (orgnum!=user.orgnum || !(user.mydb || (user.roles & 8) != 0)) {
            out.println("<body  style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\">Not Authorized.<script>onload=function(){parent.myprompt(document.body.innerHTML.replace(/<script.*script>/i,''));}</script>;</body></html>");
            return;
        }
        orgnum=user.orgnum;
        out.print(Toolbox.unifontstyle(cachedstyle.fontsize,orgnum));
        JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
        ResultSetMetaData rs = adapter.tableMeta(table);
        out.println("<head>" + cachedstyle.toString() + "<link rel=stylesheet  type=text/css  href=styleb" + (orgnum) + ".css /></head><body>");
        if (rs == null) {
            adapter.close();
            out.println(adapter.error() + "<script>onload=function(){parent.myprompt(document.body.innerHTML.replace(/<script.*script>/i,''));}</script></body></html>");
            return;
        }
        out.println(Toolbox.title(table) + "<br>");
        out.println("<TABLE cellpadding=1 cellspacing=1 align=center class=outset1 >\n");
        out.println("<TR  style=\"background:"+ Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle) + "\"><td align=right><nobr>" + Toolbox.emsgs(orgnum,231) + "</td><td><nobr>" + Toolbox.emsgs(orgnum,719) + "</td><td><nobr>" + Toolbox.emsgs(orgnum,720) + "</td><td align=right><nobr>" + Toolbox.emsgs(orgnum,721) + "</td><td>" + Toolbox.emsgs(orgnum,722) + "</td><td>" + Toolbox.emsgs(orgnum,725) + "</td></tr>\n");
        int kk = 0;
        String ans = "CREATE TABLE " + table + "(\n";
        String keyfields = adapter.keyFields(table);
        if (rs != null) {
            try {
                kk = rs.getColumnCount();
                for (int i = 0; i < kk; ++i) {
                    boolean iskey;
                    ans = ans + rs.getColumnName(i + 1) + " " + rs.getColumnTypeName(i + 1);
                    out.print("<TR height=25 bgcolor=" + cachedstyle.TBGCOLOR + "> <TD align=right>" + (i + 1) + "</td><TD>" + rs.getColumnName(i + 1) + "</td><TD>" + rs.getColumnTypeName(i + 1) + "</td><TD align=right>");
                    int ll = rs.getColumnDisplaySize(i + 1);
                    if (!(ll >= 10000 || this.isnum(i, rs))) {
                        out.println("" + ll);
                        ans = ans + "(" + ll + ")";
                    } else {
                        out.println("  ");
                    }
                    if (rs.isNullable(i + 1) != 1) {
                        ans = ans + " NOT NULL ";
                    }
                    boolean bl = iskey = ("," + keyfields + ",").indexOf("," + rs.getColumnName(i + 1) + ",") >= 0;
                    ans = i < kk - 1 ? ans + ",\n" : (!keyfields.equals("") ? ans + ",\nPRIMARY KEY(" + keyfields + ")\n)" : ans + "\n)");
                    out.println("</td><TD>" + (rs.isNullable(i + 1) == 1 ? "Yes" : "No") + "</td><TD>" + (iskey ? "Yes" : "No") + "</td></tr>");
                }
                if (kk == 0) {
                    ans = "";
                }
            }
            catch (Exception e) {
                // empty catch block
            }
        }
        out.println("</TABLE><br><center><input type=button  class=GreenButton  style=width:65px onclick=\"javascript:window.frames[0].alertsql()\" value=SQL><input type=button class=GreenButton style=width:65px onclick=\"javascript:window.frames[0].parse2()\" value=Parse></center><script>function alertsql(){parent.myprompt(\"" + Generic.handle(ans.replaceAll("\n", "<br>")) + "\");} ");
        out.println("function parse2(){parent.parse1(\"" + Generic.handle(ans) + "\");}");
        out.println("onload=function(){parent.myprompt(document.body.innerHTML.replace(/<script.*script>/i,''));}</script>");
        out.println("</body></html>");
        adapter.close();
        out.flush();
        out.close();
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

    boolean isnum(int column, ResultSetMetaData metaData) {
        int type;
        try {
            type = metaData.getColumnType(column + 1);
        }
        catch (SQLException e) {
            return false;
        }
        switch (type) {
            case -7: 
            case -6: 
            case -5: 
            case 1: 
            case 2: 
            case 3: 
            case 4: 
            case 5: 
            case 6: 
            case 7: 
            case 8: {
                return true;
            }
        }
        return false;
    }
}
