<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
 User user = (User)(session.getAttribute("User"));
 %>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <%= Toolbox.getMeta(orgnum) %>
    <body style="background:<%=Toolbox.dbadmin[orgnum%65536].bgimage%>" >
    <%=Toolbox.emsgs(orgnum,1044)%>
   </body>
</html>
