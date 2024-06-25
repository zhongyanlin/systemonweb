<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.net.*" %>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.dbauthorize(application,session,request, response, "servicecriterias.jsp", false)) == null) 
    return;
orgnum = user.orgnum;
%>

<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<%=Toolbox.getMeta(orgnum)%>

<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><title>TeaLeaMan: Selecting  Services</title> 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
</head>

<body bgcolor=<%= cachedstyle.IBGCOLOR %>  leftmargin=6 rightmargin=6 bottommargin=6 topmargin=6 >
 <Center>
<%=Toolbox.logtitle(Toolbox.emsgs(orgnum,815), 210)%>
 
<form rel=opener   name=form1 method=post target=rightwinservice action=DataTable style="margin-bottom:0pt;margin-top:0pt;margin-left:0pt;margin-right:0pt;" onsubmit="return validate(this)"  > 
<input type=hidden name=rdap value=webservices>
<input type=hidden name=whereclause>  
<TABLE width=210 border=0 bgcolor=#DDCC11 cellpadding=1 cellspacing=0>                                                
<TR><TD valign=TOP> 
<TABLE width=100% border=0 cellpadding=3 cellspacing=1 bgcolor=<%= cachedstyle.IBGCOLOR %>>    

<tr> <td ><font color=#DDCC11><%=Toolbox.emsgs(orgnum,67)%></font></td><td><font color=#DDCC11><%=Toolbox.emsgs(orgnum,202)%></font></td><td> <input  name="name" size=10  maxlength="20"></td> </tr>
<tr> <td ><font color=#DDCC11><%=Toolbox.emsgs(orgnum,220)%></font>  </td><td><font color=#DDCC11><%=Toolbox.emsgs(orgnum,202)%></font></td><td><input  name="des" size=10  maxlength="50"> </td></tr>
<tr> <td ><font color=#DDCC11><%=Toolbox.emsgs(orgnum,816)%></font>    </td><td><font color=#DDCC11><%=Toolbox.emsgs(orgnum,203)%></font></td><td> 
<select  name="category"> <option value=""><%=Toolbox.emsgs(orgnum,499)%>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
<% 
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
int n = adapter.executeQuery("select distinct category from Operation order by category");
for (int i = 0; i < n; i++)
  out.println("<option value=\"" + Generic.handle(adapter.getValueAt(i,0)) + "\">" + adapter.getValueAt(i,0) + "</option>");
adapter.close();
%>
</select> </td></tr>
<tr> <td colspan=3 align=center> 
<input type="submit" class=RedButton  name="submit" value="<%=Toolbox.emsgs(orgnum,206)%>" size="8">  
<input type="reset"  class=RedButton  name="Reset" value="<%=Toolbox.emsgs(orgnum,192)%>"> 
</form>  
</TD></TR>
</TABLE>                                                
</TD></TR></TABLE> 
<%=Toolbox.sponsor(orgnum,4, 210)%>
</body>
<script type="text/javascript" > 

function validate(f)
{
    var name = f.name.value, 
    des = f.des.value, 
    category=f.category.options[f.category.selectedIndex].value; 
          
var whc = "";
if (name != null &&  name != '')
{ 
    whc += "AND name like '%" + name +"%' ";
}
if (des != null &&  des != '')
{
    whc += "AND des like '%" + des +"%' ";
}
if (category != null &&  category != "" )
{
    whc += "AND category = '" + category +"' ";
}
 
if ( whc != '')
{
   f.whereclause.value = " WHERE " + whc.substring(3);
}
else
f.whereclause.value = '';
 
return true;
}
parent.rightwinservice.document.writeln('<html><body bgcolor=<%=cachedstyle.DBGCOLOR%>>Enter selecting criterias then click the "Select" button.'); 

</script>
</html>
