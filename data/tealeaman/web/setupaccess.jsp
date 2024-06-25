<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = (User)session.getAttribute("User");
if (user != null && (user.roles & Systemroles.SYSTEMADMIN) == 0 )
{
 %>
    <jsp:forward page="userindex.jsp" />
<%
return;
}
else if (  user==null && Toolbox.dbadmin[orgnum%65536].phase >=1 )
{
%> 
Setting up reached the phase 1
<%
return;
}
 
 String dbFolder = Toolbox.defaultParam(orgnum,request, ("dbFolder"), null);
dbFolder = Toolbox.validate(dbFolder, null, 15);

if (dbFolder == null)
{ 
 
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
    </head>
<body bgcolor="<%=cachedstyle.DBGCOLOR%>">
<%=Toolbox.title("Create MS Access Database for the software")%>
<form rel=opener name=f1 method=post action=setupaccess.jsp onsubmit="return validate()"   >
Enter the path of the file folder on the web server that will contain the Access Database files:<br>
<input name=dbFolder size=50 value="<%=Toolbox.dbadmin[orgnum%65536].dbFileFolder%>" > 
<input type=submit name=submit style=background-color:#00CCCC;color:white;font-weight:700 value="Create MS Access">
</form>

<script type="text/javascript" >
function validate()
{
  document.f1.dbFolder.value = document.f1.dbFolder.value.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
  var path = document.f1.dbFolder.value;
  if ( path.replace(/[A-Z]:\\/,'QQQQ').indexOf("QQQQ") != 0)
  {
     myprompt('Enter the full path, such as  <%=Toolbox.dbadmin[orgnum%65536].dbFileFolder.replaceAll("\\\\","\\\\\\\\")%> ');
     document.f1.dbFolder.focus();
     return false;
  }
  return true;
}
</script>

<%} else {  
if (Toolbox.dbadmin[orgnum%65536].odbc(dbFolder).equals(""))
 {
   Toolbox.dbadmin[orgnum%65536].phase = 1;
   %>
<jsp:forward page="setup.jsp" />
<%} else  
{ 
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
    <%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
</head>
<body bgcolor="<%=cachedstyle.DBGCOLOR%>">
<%=Toolbox.title("Create MS Access for the software")%>

The system Set Up failed to create a MS Access. Read the following error message and fix the problem.
<br><br><pre><font color=red> <%=Toolbox.dbadmin[orgnum%65536].error3%> </font></pre>
<br><br>

</body>
</html>

<%}}%>


