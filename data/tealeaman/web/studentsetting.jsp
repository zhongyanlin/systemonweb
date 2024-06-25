<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*" %>
<% 
 int orgnum = Toolbox.setcharset(request, response);
    if (orgnum == -1) return;
 long tstmp = System.currentTimeMillis()%10000000;
 User user = null;
 if ((user = User.authorize(orgnum, Systemroles.STUDENT| Systemroles.TA| Systemroles.ASSESSER| Systemroles.INSTRUCTOR | Systemroles.TEACHINGADMIN , application, session, request, response, "studentsetting.jsp", true)) == null) {
     return;
 }
 orgnum=user.orgnum;
 CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
 %>
 <!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head> 
     
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,669)%></title>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("studentindex.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script>
<script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
<script type=text/javascript  src=cookie.js></script>
</head>
<body style="margin:6px 12px 6px 6px;background:<%=cachedstyle.DBGCOLOR%>;font-family:<%=cachedstyle.fontname%>;font-size:<%=cachedstyle.fontsize%>px ">
<script  type="text/javascript">
var theurl = "<%=Toolbox1.geturl(request)%>";
var click = "<%=Toolbox.defaultParam(orgnum,request,"click","-1",null,2)%>";
var font_size = <%= cachedstyle.fontsize%>; 
var cachedfontname = '<%=cachedstyle.fontname%>';
var allfonts = '<%=Toolbox.emsgs(orgnum,1497)%>'.split(/;/);
var backup = '<%=Toolbox.emsgs(orgnum,839)%>';
var timeformat = "<%=cachedstyle.timeformat%>";
</script>
<script  type="text/javascript" src="setting.js"></script>
<script> onload = studentsetting;</script>
<script  type="text/javascript" src=curve.js></script>
</body>
</html>
