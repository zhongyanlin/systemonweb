<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.io.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
 CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
 User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.SYSTEMANALYST,application,session,request, response, "sessioninfo.jsp", false)) == null) 
    return;
orgnum=user.orgnum;
String sid = session.getId();
sid = sid.substring(0,17) +"<br>"+ sid.substring(17);
long st =session.getCreationTime()/1000;
long lt = session.getLastAccessedTime()/1000;
long v = session.getMaxInactiveInterval()/60;
String ss = Toolbox.timestr(st, cachedstyle.timeformat);
String sl = Toolbox.timestr(lt, cachedstyle.timeformat);

 
%>

<html lang="<%=Toolbox.langs[orgnum>>16]%>">

<head> <%=Toolbox.getMeta(orgnum)%><title><%=Toolbox.emsgs(orgnum,581)%></title>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
</head>
<style type="text/css">
  .special {background-color:#8000ff;color:white}
</style> 
<body bgcolor=<%= cachedstyle.DBGCOLOR %> >
<script type="text/javascript" >
 <%=Toolbox.dimloc(350,380)%>
</script>
<center>
<%=Toolbox.title(Toolbox.emsgs(orgnum,581))%> <br>
<table cellpadding="0"  border="0"  cellspacing="1"  bgcolor=<%=cachedstyle.IBGCOLOR%>  width=100% align=center> 
<tr><td align=center bgcolor=<%=cachedstyle.DBGCOLOR%> >
<table  align=center  cellpadding=1  cellspacing=1 border=0 bgcolor=<%=cachedstyle.DBGCOLOR%> >
 <tr> <td > &nbsp; </td>   <td >   </td> </tr>
<tr> <%=Toolbox.fields(Toolbox.emsgs(orgnum,190),orgnum, cachedstyle)%>
<td><%=user.id%></td></tr>

<tr> <%=Toolbox.fields(Toolbox.emsgs(orgnum,582),orgnum, cachedstyle)%>  
<td><%=sid%></td></tr>

<tr> <%=Toolbox.fields(Toolbox.emsgs(orgnum,583),orgnum, cachedstyle)%>  
<td><%=ss%></td></tr>

<tr><%=Toolbox.fields(Toolbox.emsgs(orgnum,584),orgnum, cachedstyle)%> 
<td><%=sl%></td></tr>

<tr><%=Toolbox.fields(Toolbox.emsgs(orgnum,585),orgnum, cachedstyle)%> 
<td><%=v%> minutes</td></tr>

 
 <tr> <td colspan=2> &nbsp; </td> </tr>
<tr> <td colspan=2 align=center> <input class=RedButton type=button value=<%=Toolbox.emsgs(orgnum,82)%> onClick="var win=window.open('','_top','',true);win.opener=true;win.close();">  </td> </tr>
</table></td></tr></table>
<script type="text/javascript" >
function send()
{
   if (document.f1.ch.checked)
      document.f1.debug.value = "1";
   visual(document.f1);
document.f1.submit();
}
window.focus();
</script>
</body>
</html>
