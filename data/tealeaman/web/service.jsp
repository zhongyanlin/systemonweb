<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.dbauthorize(application,session,request, response, "service.jsp", false)) == null) 
    return;
%>

<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<title><%=Toolbox.emsgs(orgnum,857)%></title>
<script type="text/javascript" ><%=Toolbox.dimloc(1000, 680 )%></script>
</head>

 
<frameset cols="228,*" border=0>

<frame name=leftwinservice scrolling="no"  src=servicecriterias.jsp />
<frame name=rightwinservice  scrolling="auto"  />

</frameset>
 
</html>
