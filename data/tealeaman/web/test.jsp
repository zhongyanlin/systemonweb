
<%@ page  contentType="text/html; charset=utf-8" import="telaman.*"%>
<!DOCTYPE html>
 <% int orgnum = Toolbox.setcharset(request, response);%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
        <meta http-equiv="Content-Type" content="text/html; charset=GBK">
        <title>JSP Page</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        Refresh to send a message to the queue
        <%
      
        %>
    </body>
</html>
