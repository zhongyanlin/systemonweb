<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.zip.*,java.io.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
%>
<%
User user = null;
JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
 
int n = adapter.executeQuery("select  * from AppUser where id='" + user.id +"'");
String fn = Toolbox.makeFullName(
       Toolbox.validate(adapter.getParameter("lastname"), null, 30),
       Toolbox.validate(adapter.getParameter("middlename"), null, 30),
       Toolbox.validate(adapter.getParameter("firstname"), null,30)
        );
String did = adapter.getParameter("department");
did = Toolbox.validate(did, null, 20);
%>

<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<title><%=fn%></title>
<style>
A:link {  COLOR: #FFFFFF;TEXT-DECORATION: none}
A:visited {COLOR: #FFFFFF;TEXT-DECORATION: none}
A:hover{COLOR: #DDCC11;TEXT-DECORATION: underline}
BODY {background-color:<%=cachedstyle.IBGCOLOR%>;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-weight:680}
select {margin:0px;padding:0px;background-color:<%=cachedstyle.TBGCOLOR%>;color:black;border-width:0px;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>}
input{margin:0px;padding:0px;background-color:<%=cachedstyle.TBGCOLOR%>;color:black;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;vertical-align:middle;}
</style>
</head>

<body topmargin="8" leftmargin="8" rightmargin=8 bottommargin=8  bgcolor=<%=cachedstyle.DBGCOLOR%>>
<center>
<h1><font color=red> <%=fn%></font></h1>

<table border="1" cellpadding="1" cellspacing="1" width="90%" algin=center>
<tr><td>

<table border="0" cellpadding="3" cellspacing="3" width="100%" algin=center>

    <tr>
      <td valign=top><b>Address</b></td>

      <td ><%=
Toolbox.dbadmin[orgnum%65536].unitname[orgnum>>16] + "<br>" +
Toolbox.validate(adapter.getParameter("city"), null, 40) + ", " +
Toolbox.validate(adapter.getParameter("state"), null, 40) + " " +
Toolbox.validate(adapter.getParameter("zip"),null, 11) + "<br>" %>
</td><td rowspan=5 valign=top align=left><img src="<%=Toolbox.validate(adapter.getParameter("photourl"), "?@#$%", 100) %>"></td></tr>
<tr><td valign=top><b>Telephone</b></td> <td ><%=Toolbox.validate(adapter.getParameter("phone"), null, 14) %> </td></tr>
<tr><td valign=top><b>Email</b></td> <td ><%=Toolbox.validate(adapter.getParameter("email"), "@", 40) %> </td></tr>


<tr><td valign=top width=130><b>Research Area</b></td> <td colspan=2><%=Toolbox.validate(adapter.getParameter("website"), "?!@#$%", 100)%> </td></tr>

<tr><td align=left colspan=3>&nbsp;</td></tr>

<tr><td align=left colspan=3><h3>Publications</h3></td></tr>
<tr><td align=left colspan=3> <ol>
<%
n = adapter.executeQuery("select  * from Publication where authors like '%" + adapter.getParameter("lastname") + "%' and authors like '%" + adapter.getParameter("firstname") + "%'");
for (int i = 0; i < n ;i++)
{
   if ( adapter.getValueAt(i, 5) == null || adapter.getValueAt(i, 5).equals(""))
     out.print("<li>" +  adapter.getValueAt(i, 0) + ", <em>" +   adapter.getValueAt(i, 1)
    +"</em>, <b>" +  adapter.getValueAt(i, 2) + "</b>, " + adapter.getValueAt(i, 3) +"</li>");
else
    out.print("<li>" +  adapter.getValueAt(i, 0) + ",  <a href=\"" +
     adapter.getValueAt(i, 5) + "\" target=blank> <em>" +   adapter.getValueAt(i, 1)
     +"</em></a>, <b>" +  adapter.getValueAt(i, 2) + "</b>, " + adapter.getValueAt(i, 3) +"</li>");
}
 %>
</ol></td></tr>

<tr><td align=left colspan=3></td></tr>
<tr><td align=left colspan=3><h3>Vita</h3></td></tr>
<tr><td align=left colspan=3></td></tr>
<tr><td align=left colspan=3><h3>Projects</h3></td></tr>

<tr><td align=left colspan=3></td></tr>
<tr><td align=left colspan=3><h3>Forms and Tables</h3></td></tr>
<tr><td align=left colspan=3>
<%

adapter.close();
%>
</td></tr>
</table>
</td></tr></table>

</body>
</html>

