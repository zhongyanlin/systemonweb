<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (  (user = User.authorize(orgnum, Systemroles.TEACHINGADMIN | Systemroles.ASSESSER | Systemroles.SYSTEMADMIN,application,session,request, response, "scheduler.jsp", true)) == null || !Toolbox.verifytoken(request)) 
    return;
orgnum=user.orgnum;
%>

<html lang="<%=Toolbox.langs[orgnum>>16]%>"><head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,911)%></title>
<script type="text/javascript" >window.resizeTo(screen.width-10,screen.height-30);window.moveTo(0,0)</script> 
</head>

 
<frameset cols="228,*" border=0px>
<frame name=leftwsch scrolling="no"    src="schedulerindex.jsp" />
<frame name=righwsch  scrolling="auto"   />
</frameset>

</html>
