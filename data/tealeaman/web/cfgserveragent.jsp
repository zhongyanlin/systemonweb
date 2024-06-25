<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*" %>
<% 
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.SYSTEMADMIN,application,session,request, response, "cfgserveragent.jsp", true)) == null) 
    return;
orgnum = user.orgnum;
CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
String style = Toolbox.butstyle(cachedstyle.fontsize).replaceFirst("background:[^\\)]*\\);","");
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head> 
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,336)%></title>
 
<style type="text/css"> 
    input.BG {background-color:<%=cachedstyle.TBGCOLOR%>;border:0}
    input.BG1 {background-color:<%=cachedstyle.TBGCOLOR%>; border:0;text-align:right}
     
</style>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("cfgserveragent.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>  

</head>
 
 
<body style="margin:5px 5px 5px 5px;background-color:<%=cachedstyle.DBGCOLOR%>"  >
<center> 
 <table cellpadding=0 cellspacing=0>
     <%=Toolbox.title(Toolbox.emsgs(orgnum,133),1)%> 
     <tr height=5><td></td></tr>
     <tr><td><script type="text/javascript" >document.write(round1('100%'));</script>
     <TABLE width=100%  cellpadding=1 cellspacing=1 class=outset3  >
        <tr><td align=center>
            <form rel=opener name=form1 style="margin-bottom:0pt;margin-top:0pt;" method=post action=ServerAgent target=configuration onsubmit="return openit()"  >
                 <input name=command type=hidden value=configure>
                <input name=ext type=hidden value=serveragent>
                <a href=cfgfolders.jsp><%=Toolbox.emsgs(orgnum,408)%></a> <br>
                <%=Toolbox.emsgs(orgnum,407)%><br>
            <textarea name=content rows=25 cols=54><%=ServerAgent.coms%></textarea><br><br>
           </form>
       </td></tr>
     </table>
     <script type="text/javascript" >document.write(round2);</script>
     </td></tr>
     <tr height=5><td></td></tr>
     <tr><td align=center>   <input type=submit class=OrangeButton   <%=style%>  name=s1 value=<%=Toolbox.emsgs(orgnum,46)%>>
     <input type=button class=GreenButton <%=style%> name=s1 value=<%=Toolbox.emsgs(orgnum,32)%> onclick=showhelp()>
     </td></tr>
</table>
 
<nobr><font style="font-size:12px" color=<%=cachedstyle.IBGCOLOR%> > <%= Toolbox.copyright[orgnum>>16]%></font></nobr>

</center>
 <script type="text/javascript" >
<%=Toolbox.dimloc(600,600)%>
var helpstr="";
</script>
<script type="text/javascript"  src="helpformatf.js"></script>
<script type="text/javascript" >
helpstr = "<font color=purple><b><%=Toolbox.emsgs(orgnum,409)%></b></font><%=Toolbox.emsgs(orgnum,410)%><br>"+
"<table border=1><tr><td><%=Toolbox.emsgs(orgnum,14)%><td><%=Toolbox.emsgs(orgnum,220)%><td><nobr><%=Toolbox.emsgs(orgnum,411)%></nobr><td><%=Toolbox.emsgs(orgnum,412)%></td></tr>" +
"<tr><td valign=top>command<td  valign=top><%=Toolbox.emsgs(orgnum,414)%></td><td valign=top><%=Toolbox.emsgs(orgnum,415)%><td valign=top> sort, sort -n, C:\\Programs\\cooktext.exe" +
"<tr><td valign=top>feed<td valign=top><%=Toolbox.emsgs(orgnum,417)%><td valign=top><%=Toolbox.emsgs(orgnum,418)%><td valign=top>x q"+
"<tr><td valign=top>content<td valign=top><%=Toolbox.emsgs(orgnum,421)%><td valign=top><%=Toolbox.emsgs(orgnum,418)%><td valign=top> <%=Toolbox.emsgs(orgnum,420)%>"+
"<tr><td valign=top>ext<td valign=top><%=Toolbox.emsgs(orgnum,422)%><td valign=top><%=Toolbox.emsgs(orgnum,418)%><td valign=top> 'cpp,exe' <%=Toolbox.emsgs(orgnum,419)%>"+
"</td></tr></table>" ;
var popwin1 = "helpwin";
var font_size = <%=cachedstyle.fontsize%>;
function openit()
{
  var  popstr = 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=480,height=500,left=200,top=100';
  var  nav2 = window.open('', 'configur', popstr);
  if (nav2!=null) nav2.focus();
  document.form1.target='configur';
  return true;
} 
function resizeCont()
{
      var wd = thispagewidth();
      var het = thispageheight();
      
      het -= 145 +  3 * font_size ;
      het = Math.floor(het);
      if (wd < 100)  wd = 100;
      if (het < 100) het = 100;
      document.form1.content.style.width= ""  + wd+  "px";
      document.form1.content.style.height="" + het+ "px"; 
    
}
 
resizeCont();
window.onresize = resizeCont;
 
</script>
</body>

 
</html>

