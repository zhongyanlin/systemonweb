<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
    User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.SYSTEMADMIN,application,session,request, response, "refresh.jsp", true)) == null) 
    return;
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
 
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><%=Toolbox.getMeta(orgnum)%><title>TeaLeaMan: Table index</title> </head>
<body bgcolor=<%= cachedstyle.IBGCOLOR %>  leftmargin=6 rightmargin=6 bottommargin=6 topmargin=6 >
<Center>
<%=Toolbox.title("Refresh Data")%>
<%

orgnum=user.orgnum;
 
 JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
 
 
adapter.close();
%>
Data Refreshed
</body>
</html>
