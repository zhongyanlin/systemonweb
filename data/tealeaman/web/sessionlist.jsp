<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR,application,session,request, response, "sessionlist.jsp", true)) == null) 
    return;
orgnum=user.orgnum;
if ( (user = User.dbauthorize(application,session,request, response, "sessionlist.jsp", true)) == null) 
{
    out.print("</center><font color=white><b>" + Toolbox.emsgs(orgnum,934)); 
    return;
}
CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
String sql="Course;SELECT DISTINCT Course.lastupdate, Course.id, Course.title, 1 as c  FROM Course,  Session  WHERE Course.id=Session.courseid AND Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester+"' AND Session.instructor='" + user.id +"'";

sql = DataMove.importdata(user, sql, "backup", true);
String onbegin =  "73"; 
HashMap saved = new HashMap();
saved.put("subdb",user.id);
saved.put("onbegin",onbegin);
saved.put("semester", Toolbox.dbadmin[orgnum%65536].currentSemester);
saved.put("rdap","mysession");
session.setAttribute("savedDBRequest", saved);
RequestDispatcher dispat = getServletConfig().getServletContext().getRequestDispatcher("/DataTable");
dispat.forward(request, response);
%>
 
