<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request, response, "alive.jsp", true)) == null)
    return;

orgnum = user.orgnum; 
String rwindow = "parent";
String x = request.getParameter("target"); 
if (x == null)
    return;
else if (x.equals("_self"))
    rwindow = "parent";
else if (x.equals("_blank"))
    rwindow = "opener";
else if (x.equals("child"))
    rwindow = "parent";
else if (x.equals("pf0"))
    rwindow = "parent.frames[1]";
else if (x.equals("pf1"))
    rwindow = "parent.frames[0]";
else if (x.equals("parent"))
    rwindow = request.getParameter("cwindow");
     
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<body>

<script type="text/javascript"> 
var x =<%=rwindow%>;
if (typeof(x.resumehalted) != 'undefined')
   x.resumehalted('<%=session.getId()%>');
 
</script>
Please refresh the index page.
</body>
</html>

