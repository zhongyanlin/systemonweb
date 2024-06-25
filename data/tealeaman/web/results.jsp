 
<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<!DOCTYPE html>
 <% int orgnum = Toolbox.setcharset(request, response);%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
        <% String message = (String)(request.getAttribute("messsage")); %>
        <script>parent.document.getElementById('show').innerHTML += '"<%=message%>"';</script> 
    </body>
</html>
