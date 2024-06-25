<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*" %>

<% 
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.SYSTEMADMIN,application,session,request, response, "cfgunitname.jsp", true)) == null|| !Toolbox.verifytoken(request)) 
    return;
orgnum = user.orgnum; 
String un = Toolbox.defaultParam(orgnum,request, ("un"), null);
if (un != null)
{
    Toolbox.dbadmin[orgnum%65536].unitname[orgnum>>16] = un;
    JDBCAdapter adapter =  Toolbox.getSysAdapter(orgnum); 
    int n = adapter.executeUpdate("CREATE Table UnitName(unitname varchar(50))");
    n = adapter.executeUpdate("INSERT INTO UnitName(unitname) VALUES('" + un.replaceAll("'","''")+"')");
    n = adapter.executeUpdate("UPDATE UnitName SET unitname='" + un.replaceAll("'","''") + "'");
    adapter.close();
    if (adapter.error().length()==0) 
    {
%>
   <script type="text/javascript" > var win=window.open('','_top','',true);win.opener=true;win.close();</script>
<%
   } else
   {
      out.print("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body><font color=red>" + adapter.error() +"</font>");
   }
  return;
}
else
{
%>

<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><title><%=Toolbox.emsgs(orgnum,910)%></title>
<%=Toolbox.getMeta(orgnum)%>
<style type="text/css"> 
 
    A:link
    {
    COLOR: blue;
    TEXT-DECORATION: none
    }
    A:visited
    {
    COLOR: blue;
    TEXT-DECORATION: none
    }
    A:hover
    {
    COLOR: #ff0000;
    TEXT-DECORATION: underline
    }
    input.BG {background-color:<%=cachedstyle.TBGCOLOR%>;border:0}
    input.BG1 {background-color:<%=cachedstyle.TBGCOLOR%>; border:0;text-align:right}
      
</style>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />

</head>
 
<body bgcolor=<%=cachedstyle.DBGCOLOR%> leftmargin=6 rightmargin=6 bottommargin=6 topmargin=6>
<center> 
<%=Toolbox.title(Toolbox.emsgs(orgnum,910))%> 

<form rel=opener name=f1 method=post action=cfgunitname.jsp  > <table><tr>
<%=Toolbox.fields(Toolbox.emsgs(orgnum,14),orgnum,cachedstyle)%> <td> <input name=un size=40 value="<%=Toolbox.dbadmin[orgnum%65536].unitname%>"> </td></tr>
<tr><td colspan=2 align=center> <input class=RedButton type=button onclick=setname() value=<%=Toolbox.emsgs(orgnum,36)%>>
</td></tr></table>

</form>
<script type="text/javascript" >
function setname()
{
  var  popstr = 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=280,height=200,left=300,top=200';
  var  nav2 = window.open('', 'configur', popstr);
  document.f1.target='configur';
  if (nav2!=null) nav2.focus();
  formnewaction(f1);
  
  visual(document.f1);
document.f1.submit();
} 
</script>
</body></html>

<%}%>
 



