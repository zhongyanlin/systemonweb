<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*" %>

<%
int orgnum = Toolbox.setcharset(request, response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.SYSTEMADMIN | Systemroles.SYSTEMANALYST, application, session, request, response, "customize.jsp", true)) == null || !Toolbox.verifytoken(request)) 
{
    return;
}
  
user.changedb(null);             
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<style type="text/css">
            input.micro {background:url("image/find.gif");width:28px} 
</style>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("customize.jsp","f1")%>";</script>
<script type="text/javascript"  src=textmsgsr.js></script>
 
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>)); 
    document.write("<title>" + textmsg[785]+"</title>");
</script> 
</head>
<%
String all = Toolbox.defaultParam(orgnum,request, "mody", "", null, 30);
boolean genattr = false;
String style=Toolbox.butstyle(cachedstyle.fontsize);

if (all.equals("G"))
{
   JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);

   Task t = new Task();
   String b = t.Listing(adapter,orgnum);
     
   if (b==null|| b.equals(""))
   {
      out.print("<script type=\"text/javascript\" >document.location.href='DataHTML?rdap=morewords&exbut=h&subdb='; opener.document.location.href='customize.jsp';</script>");
   }
   else
   {
      out.print("<body> Failed to generate maintain.js:<br>"+ b + " </body>");
   }
   
   adapter.close();
    if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
   
}
else if (all.equals("D"))
{
   boolean b = (new File(Toolbox.installpath + File.separator + "maintain" + Toolbox.langs[orgnum>>16] + ".js")).delete();
   if (b)
   {
      out.print("<script type=\"text/javascript\" > opener.document.location.href='customize.jsp';close();</script>");
   }
   else
   {
      out.print("<body> Failed to delete maintain.js </body>");
   }
}
else 
{
%>
<script type="text/javascript" >
if (document.location.toString().indexOf("localhost") >= 0
    && typeof (handleErr) == 'undefined')
{
function handleErr(msg, url, l)
{
      var txt= "There was an error on this page.\n\n"
       + "Error: " + msg + "\n"
       + "URL:   " + url + "\n"
       + "Line:  " + l + "\n\n"
       + "Click OK to continue.\n\n";
        
      window.onerror = handleErr;
      return true;
}
window.onerror = handleErr;
}
var nav4 = null;
var popstr = 'Toolbar=0,location=0,directories=0,status=0,menubar=0,alwaysRaised=1,scrollbars=1,resizable=1,width=512,height=500,top='+ ((screen.height - 500)/2) +',left='+ ((screen.width-550)/2);
function openit1(url,popwin)
{
   //if (nav4!=null) nav4.close();
   var nav3 = window.open(url, popwin, popstr);
   nav3.focus();
   return nav3;
}

var font_size = <%=cachedstyle.fontsize%>;
var toolmsg14 = '<%=Toolbox.emsgs(orgnum,14)%>';
var style='<%=style%>';
</script>
<body bgcolor=<%=cachedstyle.DBGCOLOR%> >
<center>
<% if (all.equals("")) 
{%>
<script type="text/javascript" >
var h = new Array(),m=new Array(), hp = new Array();
</script>

<script type="text/javascript"  id="maintainjs" src="maintain<%=Toolbox.langs[orgnum>>16]%>.js" ></script>
<script type="text/javascript" >
  var jsc = document.getElementById("maintainjs");
  jsc.src = "maintain<%=Toolbox.langs[orgnum>>16]%>.js";
</script>
<form rel=opener name=form1 method=post  >
<table>
 <%=Toolbox.title(Toolbox.emsgs(orgnum,1220), 1)%>
 <script type="text/javascript"  src=customall.js></script>
</table>
<input name=mody type=hidden>
<input name=c class=OrangeButton <%=style%> type=button value="<%=Toolbox.emsgs(orgnum,93)%>"   onClick=gen()>  
<!--input name=d class=RedButton <%=style%> type=button value="<%=Toolbox.emsgs(orgnum,1223)%>"   ONCLICK="clearm()"--> 
</form>
<br>
<br>

<script type="text/javascript" >
  // window.moveTo(screen.width/10,0);window.resizeTo(screen.width*0.8,screen.height);
</script>


<%} else {%>
<script type="text/javascript" >

var Toolmsg1053 = '<%=Toolbox.emsgs(orgnum,1053)%>';
var Toolmsg1054 = '<%=Toolbox.emsgs(orgnum,1054)%>';
var Toolmsg1055 = '<%=Toolbox.emsgs(orgnum,1055)%>';
var Toolmsg1061 = '<%=Toolbox.emsgs(orgnum,1061)%>';
var Toolmsg1214 = '<%=Toolbox.emsgs(orgnum,1214)%>';
var Toolmsg1215 = '<%=Toolbox.emsgs(orgnum,1215)%>';
var Toolmsg1216 = '<%=Toolbox.emsgs(orgnum,1216)%>';
var Toolmsg1217 = '<%=Toolbox.emsgs(orgnum,1217)%>';
var Toolmsg1218 = '<%=Toolbox.emsgs(orgnum,1218)%>';
var Toolmsg1219 = '<%=Toolbox.emsgs(orgnum,1219)%>';
var Toolmsg1224 = '<%=Toolbox.emsgs(orgnum,1224)%>';
var Toolmsg1225 = '<%=Toolbox.emsgs(orgnum,1225)%>';
var Toolmsg1344 = '<%=Toolbox.emsgs(orgnum,1344)%>';
var Toolmsg1345 = '<%=Toolbox.emsgs(orgnum,1345)%>';
var Toolmsg1346 = '<%=Toolbox.emsgs(orgnum,1346)%>';
var Toolmsg1347 = '<%=Toolbox.emsgs(orgnum,1347)%>';
</script>

<script type="text/javascript"  src=customlist.js></script>     
<script type="text/javascript" >
build([<%=all%>]);
fillDefaultv([<%=all%>]);
//window.moveTo(0,0);
//window.resizeTo(screen.width/2,screen.height);
</script> 
<%} 
%> 
<nobr><font style="font-size:12px" color=<%=cachedstyle.IBGCOLOR%> > <%= Toolbox.copyright[orgnum>>16]%></font></nobr>
 
</center>
<script type="text/javascript"  src=curve.js></script>     

</body>
<%
}%>
</html>
