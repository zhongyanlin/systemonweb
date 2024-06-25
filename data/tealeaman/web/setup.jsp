<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = (User)session.getAttribute("User");
CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
String pge = "unauthorize.jsp?roles=" +  Systemroles.SYSTEMADMIN;
if (user != null && (user.roles & Systemroles.SYSTEMADMIN) == 0 && Toolbox.dbadmin[orgnum%65536].phase==3)
{
 %>
   <jsp:forward page="<%=pge%>" />
 <%
 return;
}
orgnum = user.orgnum;
if ( Toolbox.dbadmin[orgnum%65536].phase< 3 && user==null)
{    
    user = new User(orgnum); 
    user.roles = Systemroles.SYSTEMADMIN;
    
}
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head> 
<%=Toolbox.getMeta(orgnum)%>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("setup.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" src=serviceitem.js></script>
<title><%=Toolbox.emsgs(orgnum,515)%></title>
</head>
<body bgcolor="<%=cachedstyle.DBGCOLOR%>">
 
 <%=Toolbox.title(Toolbox.emsgs(orgnum,909))%> 
<%
  
  int t = Toolbox.dbadmin[orgnum%65536].hasSysDB();
  
  if (t == 0)
 {
   String str = Toolbox.dbadmin[orgnum%65536].error(); 
   if (str.length()>400) str = str.substring(0,400) +"...";
   out.print("<font color=red> Error: " + str +"</font>");
%>
  <h1>Phase 1: Set Up System Database </h1>
The software has to work with a relational database management system (DBMS). You can let the system to create an MS Access database (Windows
platform only) or set up a database and a JDBC driver using free or commercial DBMS package such as MySQL, Postgress, SQL Server and Oracle. 
Consult with those DBMS  vendors for setting up databases.<br><br>
    
 If the web server and database server are on the same host, you may 
 use ODBC to avoid using commerical JDBC driver.<br><br>

 While MS Access is a convinent, easy-to-use DBMS, it is not powerful enough to support many users. Therefore, we strongly recommend you to use
 other DBMS such as MySQL and Oracle. If you choose the first option, just click the "Create MS Access" button below. Otherwise, go ahead to set up your database
and get a JDBC driver then come back to click the "Enter Database Info" below.<br><br>

   TeaLeaMn is able to work with many DBMS and it provides convinent utility for you to migrate databases to other DBMS.
<br>
<form rel=opener name=f1 method=post   >
<input type=button class=Redbutton style=background-color:#00BBBB;color:white;font-weight:680 value="Create MS Access" name=a1 onclick="javascript:choose('setupaccess.jsp')"> &nbsp;&nbsp;
or  <input type=button class=Redbutton style=background-color:#00BBBB;color:white;font-weight:680  value="Enter Database Info" name=a2 onclick="javascript:choose('setupother.jsp')">
</form>

<script type="text/javascript" >
function choose(act)
{
   formnewaction(document.f1,act);
   visual(document.f1);
document.f1.submit();
}
</script>

<%
}
else if (t==1) 
{
 if (Toolbox.dbadmin[orgnum%65536].fillSysDB(user.id,cachedstyle) == false) 
 {
 %>
 <h1>Phase 2: Create System Database Schema and Procedures </h1>
 This step of initial setting up process is to create system database schema.
 Examine the following error message to locate and resolve the problem.
 <br><br>
<center><table><%=Toolbox.dbadmin[orgnum%65536].error()%></table></center>
<br><br>

Note that if this page is shown during the operation mode, it implies the User table is callapsed. 
Restore the User table from backup file.
<br>
    
 
 <%
 } 
else 
 {
   t=2; 
   Toolbox.dbadmin[orgnum%65536].phase=2;
 }
}

if (t == 2)
{
   String savestr = Toolbox.urlencode("document.location.href='setup.jsp'");
   String pg = "DataForm?subdb=&numrows=1&rdap=register1&role="
               + Systemroles.SYSTEMADMIN
               + "&onsaved="
               + savestr;
%>
<h1>Phase 3: Create the System Adminstrator User Account </h1>
System Administrator User is a user who have the priviledges of configure, manage the <%=Toolbox.appname%> and associate database management systems.
It is the very first user. Further configuration requires this account.
(Note that if this page is shown during the operation mode for system diagnose, it implies that the System Admin User is missing from the User table.) 
 
<jsp:include page="<%=pg%>" />
 
<%
}

if (Toolbox.dbadmin[orgnum%65536].phase >=3)
{
%>
   <jsp:forward page="index.jsp" />
<%
}
%>
</body></html>
 
