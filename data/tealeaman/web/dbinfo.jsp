<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*" %>
<%!
String field(String str, int font_size, int orgnum,CachedStyle cachedstyle) 
{
    return "<table cellspacing=1 cellpadding=2 width=" 
            +  (font_size*7) +"><tr><td bgcolor="
            + cachedstyle.IBGCOLOR 
            + " width=90 BACKGROUND=header2.gif><font color=#DDCC11><b><NOBR>"
            + str +"</NOBR></b></font></td></tr></table>";
}
%>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.dbauthorize(application,session,request, response, "dbinfo.jsp", false)) == null) 
    return;
String item = Toolbox.validate( Toolbox.defaultParam(orgnum,request, ("item"), null), null, 20);
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><%=Toolbox.getMeta(orgnum)%><title><%=Toolbox.emsgs(orgnum,428)%></title>
 
<style type="text/css"> 
  
    input.BG {background-color:<%=cachedstyle.TBGCOLOR%>;border:0}
    input.BG1 {background-color:<%=cachedstyle.TBGCOLOR%>; border:0;text-align:right}
   
</style>

<%=Toolbox.unifontstyle(cachedstyle.fontsize,orgnum)%>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("dbinfo.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
</head>
 
 
<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px" >
<%  if ( item==null || item.equals("info") )
   out.print(Toolbox.title(Toolbox.emsgs(orgnum,434)));
    else if (item==null || item.equals("migrate") )
     out.print(Toolbox.title(Toolbox.emsgs(orgnum,435)));
   else
   out.print(Toolbox.title(Toolbox.emsgs(orgnum,436)));
%> 
<TABLE> <tr height=5px ><td></td></tr></table > 

<script type="text/javascript" >document.write(round1('100%'));</script>
<TABLE BORDER=0 cellspacing=1 width=100% class=outset3 >
<TR><TD valign=TOP> 
<% if ( item==null || item.equals("info") )
{
  
   JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
   if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
   String str = adapter.dbInfo();
   String [] strs = str.split("\n");
   out.print( "<table><tr><td>" + field(Toolbox.emsgs(orgnum,173) + Toolbox.emsgs(orgnum,67), cachedstyle.fontsize, orgnum, cachedstyle) + "</td><td>" + strs[0] + "</td></tr>");
   out.print( "<tr><td>" + field("<script>document.write(textmsg[669]);</script>", cachedstyle.fontsize,orgnum,  cachedstyle ) + "</td><td>" + strs[1]+ "</td></tr>");
   out.print("<tr><td>" + field(Toolbox.emsgs(orgnum,339), cachedstyle.fontsize, orgnum, cachedstyle) + "</td><td>" + adapter.userName());
   out.print("<tr><td>" + field(Toolbox.emsgs(orgnum,341), cachedstyle.fontsize, orgnum,cachedstyle) + "</td><td>"  + adapter.url());
   out.print("<tr><td>" + field(Toolbox.emsgs(orgnum,343), cachedstyle.fontsize, orgnum, cachedstyle) + "</td><td>" + adapter.driverName());
    out.print( "</table>");
    adapter.close();
}
else if (item.equals("migrate") )
{
%>
<br>
<%=Toolbox.emsgs(orgnum,146)%> 
<form name=f1 
<%
}
else
{
   
%>
<br>
<%=Toolbox.emsgs(orgnum,429)%>
<br><br> 

<script type="text/javascript" >
 
function syn(x){return 1;}
</script>
<script type="text/javascript" >
var timeformat = '<%=cachedstyle.timeformat%>';var haswebfolder=<%=user.websitename != null && !user.websitename.equals("")
||user.webFileFolder != null && !user.webFileFolder.equals("") %>;
</script>
<script type="text/javascript"  src=timeformat.js></script>
<script type="text/javascript" >
var f= document.form1;
function getPassed(str)
{
   f.course.value=str;
}
function dodate()
{
   var olddate = parseTime(f.old.value); 
   if (olddate == 'NaN') { myprompt("<%=Toolbox.emsgs(orgnum,437)%> "  + timeformat); f.old.focus(); return false;}
    var newdate = parseTime(f.newd.value); 
   if (newdate == 'NaN') { myprompt("Enter datatime in the format " + timeformat); f.newd.focus(); return false;}
   if (olddate == newdate) return;
   var tt = newdate-olddate;
   f.wcds.value="UPDATE Assignment SET start=start + " + tt +", due=due+"+tt+" where course='"+f.course.value.replace(",", "' or course='") + "'";
   var  popstr = 'toolbar=0,location=0,directories=0,status=0,menubar=0,alwaysRaised=1,scrollbars=1,resizable=1,width= 360,height= 280';
   var nav1 = window.open('', 'transplant' ,popstr);
   return true;
}
</script>

<%  
}
%>
</td></tr></table>
<script type="text/javascript" >document.write(round2);</script>
<script type="text/javascript"  src=curve.js></script>     

</body>
</html>
