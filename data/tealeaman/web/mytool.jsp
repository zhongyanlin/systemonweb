<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% int orgnum = Toolbox.setcharset(request,response); 
    if (orgnum == -1) return;
    User user = (User)(session.getAttribute("User"));
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">  
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
 <%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
    <title>TeaLeaMan design</title>
    <style>.tdbtns{width:68px;border:1px #b0b0b0 outset;background-color:#ddd;color:#111;text-align:center}</style>
    <script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>; var needtranslator = true.tstmp=(new Date()).getTime()%10000000;</script>
    <script type="text/javascript" src="/tealeaman/<%=Toolbox.getUserLang(orgnum)%>"></script>
    <script type="text/javascript" src="/tealeaman/cookie.js"></script>
    <script type="text/javascript" src="/tealeaman/tabletooledit.js"></script>
    <script type="text/javascript" src="/tealeaman/curve.js?dn=1&sn=30"></script>
</head>
<body></body>
</html>
