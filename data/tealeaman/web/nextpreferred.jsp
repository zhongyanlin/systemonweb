<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.INSTRUCTOR,application,session,request, response, "nextpreferrred.jsp", true)) == null) 
    return;
orgnum = user.orgnum; 
int next = Toolbox.dbadmin[orgnum%65536].getDomainValueCode("Semester", Toolbox.dbadmin[orgnum%65536].currentSemester) + 1;
String nexts = Toolbox.dbadmin[orgnum%65536].getDomainValueByCode("Semester", next,Toolbox.langs[orgnum>>16]);
String str = Toolbox.urlencode("if (numRows==0) opener.hints1();");
if (nexts==null) return;
HashMap saved = new HashMap();
saved.put("subdb","");
saved.put("onbegin",str);
saved.put("semester", nexts);
saved.put("semesterName", nexts);
saved.put("rdap","schedulenext");
session.setAttribute("savedDBRequest", saved);
RequestDispatcher dispat = getServletConfig().getServletContext().getRequestDispatcher("/DataTable");
dispat.forward(request, response);
%>
 
 
