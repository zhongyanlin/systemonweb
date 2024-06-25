<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
int orgnum = Toolbox.setcharset(request,response);
if (orgnum == -1) return;
 
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR |Systemroles.TA|Systemroles.TEACHINGADMIN |Systemroles.ASSESSER ,application,session,request, response, "assignment.jsp", false)) == null) 
    return;
  
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,296)%></title>

</head>
<frameset cols="228,*" border=0px>
<frame name=leftwinass  scrolling="no"    src=assignmentindex.jsp />
<frame name=rightwinass    scrolling="auto" src=blank.html />
</frameset>
</html>
