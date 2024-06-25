<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
%>
<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
User user = null;
if (  (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request, response, "talk.jsp", true)) == null ) 
    return;
orgnum=user.orgnum;
%>

<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <%= Toolbox.getMeta(orgnum) %>
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<title><%=Toolbox.emsgs(orgnum,730)%></title>
<script type="text/javascript" ><%=Toolbox.dimloc(800, 700 )%></script>
</head>

<frameset cols="228,*" border=0px>

<frame name=lefttalk scrolling="no"  src=talkindex.jsp />
 
<frame name=righttalk  scrolling="auto"  src=talkpage.jsp?teacher=1 />

</frameset>
 
</html>
