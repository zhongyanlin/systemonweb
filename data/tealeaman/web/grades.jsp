<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR,application,session,request, response, "grades.jsp", true)) == null) 
    return;
orgnum = user.orgnum; 
if ( (user = User.dbauthorize(application,session,request, response, "grades.jsp", true)) == null) 
{
    out.print("</center><font color=white><b>You don't have a database now. A instructor should have one. Ask the System Administrator to create one for you"); 
    return;
}
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,489)%></title>
<script type="text/javascript" ><%=Toolbox.dimloc(720, 700 )%></script>
</head>

 
<frameset cols="228,*" border=0px>

<frame name=leftwingrades scrolling="no"  src=gradeindex.jsp />
 
<frame name=rightwingrades  scrolling="auto" src="blank.html"  />

</frameset>
 
</html>
