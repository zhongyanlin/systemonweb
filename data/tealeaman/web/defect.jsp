<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
 User user = null;
 if ((user = User.authorize(orgnum, Systemroles.TOTAL, application, session, request, response, "defect.jsp", false)) == null) 
 {
     return;
 }
orgnum = user.orgnum; 
%>
<!DOCTYPE html> 
<html lang="<%=Toolbox.langs[orgnum>>16]%>">

<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,893)%></title> 
 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />  
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("defect.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" ><%=Toolbox.dimloc(500, 680 )%></script>
</head>
<body  style="margin:5px 5px 5px 5px;background-color:<%= cachedstyle.DBGCOLOR %>" >
<center>
<%=Toolbox.title(Toolbox.emsgs(orgnum,546)).replaceAll("\n","")%>

<%
String mode = Toolbox.removescript(Toolbox.defaultParam(orgnum,request, ("description"), null));

if (mode!=null)
{
   if (mode.length() > 20000) 
       mode = mode.substring(0,20000);
   JDBCAdapter adapter =  Toolbox.getSysAdapter(orgnum);

   String str = "SELECT email FROM AppUser WHERE id='" + user.id +"'";
   int n = 0;
   boolean bb = adapter.executeQuery2(str,false);
   if (!bb && !adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
   String emailaddr = null;
   if (  (emailaddr = adapter.getValueAt(0,0)) == null)
   {
      out.print(" You don't have an email address");
      emailaddr = "tealeaman@gmail.com";
   }
   adapter.close();
   String tos[] = new String[1];
   tos[0] = "tealeaman@gmail.com";
   try{
      telaman.Email.postMail(tos, "Defect and suggestion", mode, emailaddr,null, orgnum);
      out.println("An email has been sent to the TeaLeaMan development team");
   }catch(Exception e)
   {
      out.println(e.toString());
   }
}
else
{
%>
<form rel=opener name=thisform method="POST" action="defect.jsp" onsubmit="return submitform()"  >
<script type="text/javascript" >document.write(round1('100%'));</script>
<table  width=100% border=0 class=outset3 cellpadding=1 cellspacing=1>
<tr><td width=100% ><%=Toolbox.emsgs(orgnum,894)%>  </td></tr>
<tr><td align=center width=100% >
<textarea name=description cols=50 rows=25></textarea></td></tr>
<tr><td align=center>
<input type=hidden name=defect>
</td></tr>
</table>
<script type="text/javascript" >document.write(round2);</script>
<center>
    <input type=submit class=GreenButton name=submit style=width:68px value=<%=Toolbox.emsgs(orgnum,51)%> >
</center>
 </form>
<script type="text/javascript" >
function submitform()
{
   if (document.thisform.description.value.length > 10000)
   {
       myprompt("The description is too long");
       document.thisform.description.focus();
       return false;
   }
   return true;
}
function resizeCont()
{    
      var wd = thispagewidth();
      var het = thispageheight();
      wd -= 40;
      het -= 150;
      if (wd < 50)   wd = 50;
      if (het < 50) het = 50;
      document.thisform.description.style.width= ""  + wd+  "px";
      document.thisform.description.style.height="" + het+ "px"; 
 } 
resizeCont();
window.onresize = resizeCont;
</script>

<%}%>
<script type="text/javascript"  src=curve.js></script>     

</body>
</html>

