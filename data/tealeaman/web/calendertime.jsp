<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum,  (Systemroles.TOTAL>>1) << 1,application,session,request, response, "announcepage.jsp", true)) == null) 
    return;
orgnum = user.orgnum; 
JDBCAdapter  adapter = Toolbox.getSysAdapter(user.orgnum); adapter.orgnum = orgnum;

String rolesql = "";
int m = 1;
for(; user.roles >= m; m *= 2)
{
    if ((user.roles & m) == 0) continue;
    if (rolesql.equals("")==false) rolesql += " OR ";
    rolesql += " (roles mod  " + (2 * m) + ") >= " + m;
}
if (rolesql.equals("")==false) 
    rolesql = " AND (" + rolesql + ")";
 
String timefor = Toolbox.defaultParam(orgnum,request,"time","", null, 20);
if (timefor.equals("")==false) 
    rolesql += " AND cdate >= " + timefor;
String sql= " WHERE  (department='' or  department='" + user.department +"')"   + rolesql;
HashMap saved = new HashMap();
saved.put("wcds", sql);
session.setAttribute("savedDBRequest", saved);
adapter.close();
RequestDispatcher dispat = getServletConfig().getServletContext().getRequestDispatcher("/DataHTML?rdap=acalender2&subdb=");
    dispat.forward(request, response);
 
%>
