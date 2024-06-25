<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*" %>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
long tstmp = System.currentTimeMillis()%10000000; 
User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.dbauthorize(application,session,request, response, "dbrestore.jsp", false)) == null) 
    return;
CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
String style= Toolbox.butstyle(cachedstyle.fontsize);
int sek = SessionCount.enq(session.getId());
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head>
    <title><%=Toolbox.emsgs(orgnum,447)%></title>
<%=Toolbox.getMeta(orgnum)%>
<style type="text/css"> 
    
    input.BG {background-color:<%=cachedstyle.DBGCOLOR%>}
    input.BG1 {background-color:<%=cachedstyle.TBGCOLOR%>; border:0;text-align:right}
    
</style>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("dbrestore.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<%=Toolbox.unifontstyle(cachedstyle.fontsize,orgnum)%>
</head>
 
 
<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px" >


<%=Toolbox.title(Toolbox.emsgs(orgnum,441) ) %>

<table>
 <tr height=5>
  <td valign="TOP"> </td>
 </tr>
</table>
<script type="text/javascript" >document.write(round1('100%'));</script>
<table border="0" cellspacing=1 width=100% class=outset3 >
<TR><TD valign=TOP>
<ol  type=A > 
<form rel=opener name=form1 style="margin:0 0 0 0" method=post action=DBTableRestore target=dbbackup enctype="multipart/form-data"  >
<input type=hidden name=langcode value="<%=Toolbox.langs[orgnum>>16]%>"><input type=hidden name=overlap><input type=hidden name=totable><input type=hidden name=sek  disabled="false"  value=<%=sek%> >
<li  style="padding:0px 0px 10px 0px" ><nobr><%=Toolbox.emsgs(orgnum,448)%></nobr> 
  <table><tr>
    <td>
    <input type=radio class=radchk  name=isupload value=0  ></td>
    <td><nobr><%=Toolbox.emsgs(orgnum,695)%></nobr></td>
    <td  >
    <table cellpadding="0" cellspacing="0"><tr><td>  <input class=OrangeButton style=width:70px type=button name=b1 value="<%=Toolbox.emsgs(orgnum,206)%>" onclick="selfile()">
     </td><td><input type=text name=webfile class="left"  style="border:1px #b0b0b0 solid;width:380px" >
      </td> </tr> </table>
  </td></tr>
  <tr><td>
    <input type=radio  class=radchk name=isupload value=1 checked  ></td>
      <td><nobr><%=Toolbox.emsgs(orgnum,155)%></nobr></td>
    <td  >
    <input type=file name=localpath onchange="markit(this);document.form1.isupload[1].checked=true"  value="<%=Toolbox.emsgs(orgnum,458)%>" class="left" style="border:1px #b0b0b0 solid;width:450px;font-size:<%=cachedstyle.fontsize-2%>px" >
  </td></tr>
  <tr><td>
          <input type=radio  class=radchk name=isupload value=2   ></td>
      <td><nobr>dropbox.com</td><td colspan="2">
        <table width="450" cellpadding="0" cellspacing="0"><tr><td>
            <nobr><%=Toolbox.emsgs(orgnum,400).replaceFirst(".*[ ]([^ ]*)$","$1")%></nobr></td><td>
          <input   class="left" style="border:1px #b0b0b0 solid;width:<%=10.2*cachedstyle.timeformat.length()%>px" value="<%= Toolbox.timestr(System.currentTimeMillis()/1000-100*24*3600,cachedstyle.timeformat)%>"  name=start   >
</td>
<td><%=Toolbox.emsgs(orgnum,402)%></td>
<td><input   class="left" style="border:1px #b0b0b0 solid;width:<%=10.2*cachedstyle.timeformat.length()%>px"  name=end   value="<%= Toolbox.timestr(System.currentTimeMillis()/1000,cachedstyle.timeformat)%>">
</td> </tr> </table></td> </tr> </table>
</form>

<form rel=opener name=form2  >

<li><%=Toolbox.emsgs(orgnum,449)%>(<input type=checkbox  class=radchk   name=check1 onclick="checkall()"><b><%=Toolbox.emsgs(orgnum,450)%></b>)<br>
<table border=0 width=100%> <tr>    
    <script type="text/javascript" >
     var font_size = <%=cachedstyle.fontsize%>;
     var wd = thispagewidth();
     var het = thispageheight();
     var cls = Math.floor(wd/10/font_size);
      
    var numtables = parent.frames[0].passNumtables();
    var  tables = new Array(numtables);
    parent.frames[0].passTables(tables);
    tables.sort();
    for (var i = 0; i < numtables; i++)
    { 
       if ((i % cls) == cls-1 )
          document.write("</tr><tr>");
       document.write(  '<td><nobr><input type=checkbox class=radchk  name=checkbox' + i + ' value=' + tables[i] + '> ' + parent.frames[0].name2label(tables[i]) + '</td>');
    }
    var msg460 = "<%=Toolbox.emsgs(orgnum,460)%>";
    
    var filechoose = null;
    function markit(t){filechoose = t;}
    var tstmp = <%=tstmp%>;
    var uid = "<%=user.id%>";
    var sek = "<%=sek%>";
    var dbrescourse = "<%=DataRestore.chatcourse%>";
   
    </script>
</tr></table>
<br>
 
<li><%=Toolbox.emsgs(orgnum,451)%><br> 
<input type=radio name=overlap  class=radchk   value=drop> <%=Toolbox.emsgs(orgnum,452)%><br>
<input type=radio name=overlap  class=radchk   value=buckup > <%=Toolbox.emsgs(orgnum,455)%><br>
<input type=radio name=overlap  class=radchk   value=timestamp checked> <%=Toolbox.emsgs(orgnum,454)%><br>
<input type=radio name=overlap  class=radchk   value=keep> <%=Toolbox.emsgs(orgnum,456)%><br>
<li  id="mqoption"   style="padding:10px 0px 0px 0px"><input type="checkbox" id="ms" onclick="enablebm(this)"> <%=Toolbox.emsgs(orgnum,1542)%></li>
</ol>


<center><input type=button name=submit <%=style%> class=GreenButton value="<%=Toolbox.emsgs(orgnum,459)%>" onclick="if (filechoose!=null)clickedhere(filechoose);submitform1()">
</form> 
</td></tr></table>
<script type="text/javascript" >document.write(round2);</script>

<table><tr height=5><td></td></tr></table>

<div id="errmsg"></div>
</center>


<script type="text/javascript"  src=dbrestore.js></script>
<script type="text/javascript"  src=curve.js></script>     
<script type="text/javascript" >
resizebut(document.form2,<%=cachedstyle.fontsize%>);
</script>
<div id="copyright" style="text-align:center;color:#4d5ddd;font-size:12px"> 
<%= Toolbox.copyright[orgnum>>16]%> 
</div>
<iframe name="w<%=tstmp%>" width="1" height="1" />  
</body>
</html>
