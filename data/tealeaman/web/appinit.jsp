<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
    User user = null;
if (  (user = User.authorize(orgnum,  (Systemroles.TOTAL>>1) << 1,application,session,request, response, "appinit.jsp", true)) == null || !Toolbox.verifytoken(request)) 
    return;
%>

<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <%=Toolbox.getMeta(orgnum)%>
    <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
        
        <title>JSP Page</title>
    </head>
    <body  style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 0px 5px">

     <%
      String encode = application.getInitParameter("encoding");
      if (encode == null ) 
           encode="utf-8";
      String err = Toolbox.setCoding(encode, application.getRealPath(""));
    

orgnum = user.orgnum; 
     /*
      DBAdmin.config(
                         application.getInitParameter("webFileFolder"),
                         application.getInitParameter("webFileFolder1"),
                         application.getInitParameter("dbFileFolder"),
                         application.getInitParameter("workingFolder"), 
                         application.getRealPath(""),
                         application.getInitParameter("unitname")); 
      */
      int p = Toolbox.dbadmin[user.orgnum%65536].hasSysDB();
      if (p < 3)
          Toolbox.println(1,"There was an error when making database connection: " + Toolbox.dbadmin[user.orgnum%65536].error() + "\nPhase: " +p);
      %> 
    </body>
</html>
