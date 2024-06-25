<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
 User user = (User)(session.getAttribute("User"));
%> 
<!DOCTYPE HTML >
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,175)%></title> 
 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
</head>
<body bottommargin=0 bgcolor=<%= cachedstyle.DBGCOLOR %> >
<%
String rolestr = Toolbox.defaultParam(orgnum,request, ("roles"), null);
rolestr = Toolbox.validate(rolestr, null, 12);
if (rolestr == null) 
{
    out.print("Unauthorized access");
}
else
{
    String  rolestr1 = (new Systemroles(Long.parseLong(rolestr))).toString();
   
    out.print(" This page is designated for " + rolestr);
 
%>
<br>
<br>
Login as another user that is of these roles or apply to the system administrator for the access.

<%}%>
</body>
</html>
