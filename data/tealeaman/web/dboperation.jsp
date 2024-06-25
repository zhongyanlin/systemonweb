<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
    User user = null;
if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR,application,session,request, response, "assignment.jsp", false)) == null) 
    return;
orgnum = user.orgnum; 
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,438)%></title>
<script type="text/javascript" ><%=Toolbox.dimloc(880, 700 )%></script> 
</head>
<% 
 
 
if ( (user = User.dbauthorize( application,session,request, response, "dboperation.jsp", false)) == null|| !Toolbox.verifytoken(request)) 
{
    out.print("<body bgcolor=" +  cachedstyle.DBGCOLOR +">" + Toolbox.emsgs(orgnum,590));   
    return;
}
%>
<frameset cols="228,*" border=0px>
<frame name=leftwintb scrolling="no"  src="dboperationindex.jsp" />
 
<frame name=rightwintb   scrolling="auto"    />
</frameset>
 
</html>
