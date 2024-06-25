<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
    User user = null;
    if ( (user = User.authorize(orgnum,Systemroles.TOTAL,application,session,request, response, "dbapplication.jsp", true)) == null|| !Toolbox.verifytoken(request)) 
 return;

%>
<!DOCTYPE html> 
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
     
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%= Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,605)%></title>
<!--script type="text/javascript" ><%=Toolbox.dimloc(880, 700 )%></script--> 
</head>

<frameset cols="228,*" border=0px>
<frame name=dbappl scrolling="no"  src="dbappindex.jsp" />
 
<frame name=dbappr  scrolling="auto"   src="blank.html" />
</frameset>
 
</html>
