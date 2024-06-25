<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
 
if (  (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request, response, "webfiles.jsp", false)) == null) 
    return;
String title =  Toolbox.emsgs(orgnum,695);
if ( user.webFileFolder == null ||   user.webFileFolder.equals(""))
{
%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>"><head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><%=Toolbox.getMeta(orgnum)%></head><body>
<%=Toolbox.emsgs(orgnum,763)%>
<%
return;
}
%>

<html lang="<%=Toolbox.langs[orgnum>>16]%>">
 <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title><%=title%></title>
 
</head>

 
<frameset cols="228,*" border=0px>

<frame name=leftwinw src=webfileindex.jsp scrolling=no />
 
<frame name=rightwinw   scrolling="auto"  src="blank.html"/>

</frameset>
 
</html>

