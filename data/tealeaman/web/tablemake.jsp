<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (  (user = User.authorize(orgnum, Systemroles.SYSTEMANALYST,application,session,request, response, "tablemake.jsp", true)) == null|| !Toolbox.verifytoken(request))
    return;
orgnum=user.orgnum;
long tstmp = System.currentTimeMillis() % 10000000;
String tablename =  Toolbox.defaultParam(orgnum,request,"tablename","newTable", null, 30);
String subdb = Toolbox.defaultParam(orgnum,request,"subdb", user.id, null, 30);
user.changedb(subdb);
int maxroleslen = 0;
for (int i = 0; i < Systemroles.numRoles; i++)
{
    if (Systemroles.roles[orgnum>>16][i]!=null && maxroleslen < Systemroles.roles[orgnum>>16][i].length())
         maxroleslen = Systemroles.roles[orgnum>>16][i].length();
    
}

%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">

<%
   out.println("<META HTTP-EQUIV=\"Pragma\" CONTENT=\"no-cache\"><meta http-equiv=\"Content-Type\" content=\"text/html; charset=" + Toolbox.encodings[orgnum>>16] +"\">");
   String code= Toolbox.defaultParam(orgnum,request, ("code"), null);
   code = Toolbox.validate(code, null, 12);
   if (code!=null && (user.roles & Systemroles.SYSTEMADMIN) >=0)
   {
       JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
       
       if (1==adapter.executeUpdate("UPDATE Apptables SET  roles=" + code + " WHERE tname='" + tablename +"'") )
       {out.println("<body style=\"margin:0px 0px 0px 0px\"><script type=text/javascript >");
       out.println("var hasleft = false; if (typeof(parent.frames[0]) != 'undefined' && typeof(parent.frames[0].passNumtables)!='undefined') hasleft = true;");
       out.println("if (hasleft)parent.parent.frames[0].passbackOwner('"  + tablename +"'," + code +");");
       out.println("</script>");
       }
       else
       { 
       out.println("<body style=\"margin:0px 0px 0px 0px\"><script type=text/javascript >");
       out.println("var hasleft = false; if (typeof(parent.frames[0]) != 'undefined' && typeof(parent.frames[0].passNumtables)!='undefined') hasleft = true;");
       out.println("parent.mypropmt('"  + adapter.error().replaceAll("'", "\\'") + "');</script>");
       }
       out.println(  "</body></html>");
       adapter.close();
       return;
   }
%>
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,718)%></title>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("tablemake.jsp","f1")%>"; 
    var hasleft = false; if (typeof(parent.frames[0]) != 'undefined' && typeof(parent.frames[0].passNumtables)!='undefined') hasleft = true;</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>

<style type="text/css">
.tdbutton{width:<%=Math.round(4*cachedstyle.fontsize)%>px;border:1px green outset;color:white;font-family:<%=Toolbox.fontsnamestr(orgnum>>16) %>;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#606060 -1px -1px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:3px;margin:3px 3px 3px 3px;}
            
.buttong {background:url(image/GreenButton.gif);color:white;width:<%=4*cachedstyle.fontsize%>px;border:1px green outset;color:white;font-family:<%=Toolbox.fontsnamestr(orgnum>>16) %>;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#606060 -1px -1px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:3px;margin:3px 3px 3px 3px;}
.buttonr {background:url(image/RedButton.gif);color:white;width:<%=4*cachedstyle.fontsize%>px;border:1px green outset;color:white;font-family:<%=Toolbox.fontsnamestr(orgnum>>16) %>;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#606060 -1px -1px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:3px;margin:3px 3px 3px 3px;}
.buttono {background:url(image/OrangeButton.gif);color:white;width:<%=4*cachedstyle.fontsize%>px;border:1px green outset;color:white;font-family:<%=Toolbox.fontsnamestr(orgnum>>16) %>;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#606060 -1px -1px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:3px;margin:3px 3px 3px 3px;}
.buttonb {background:url(image/BlueButton.gif);color:white;width:<%=4*cachedstyle.fontsize%>px;border:1px green outset;color:white;font-family:<%=Toolbox.fontsnamestr(orgnum>>16) %>;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#606060 -1px -1px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:3px;margin:3px 3px 3px 3px;}
td  {font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:<%=cachedstyle.fontsize%>px}
select {font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:<%=cachedstyle.fontsize%>px}
input {font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:<%=cachedstyle.fontsize%>px}
textarea {font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:<%=cachedstyle.fontsize%>px}
input.box {font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:<%=cachedstyle.fontsize%>px}
input.buttonstyle {font-size:<%=cachedstyle.fontsize%>px;color:white;font-weight:700;width:65px;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>}
</style>
<script type="text/javascript">
var theurl = "<%=Toolbox1.geturl(request)%>";
var tstmp = <%=tstmp%>;
var font_size =  <%=cachedstyle.fontsize%>;
var tablename = "<%=tablename%>";
var encoding = "<%=Toolbox.encodings[orgnum>>16]%>";
var langcode = "<%= Toolbox.langs[orgnum>>16]%>";

var exists = false; if (hasleft)  exists = parent.frames[0].passexists(tablename);
var queryname = "";
var checks = "";
var dbms = 'mysql';if (hasleft) dbms = parent.frames[0].passdbinfo();
var msg71 = "<%=Toolbox.emsgs(orgnum,71)%>";
var pubkeys = ""; 
var viewonly = false;

var STNEVE = ["","","","","","",""];
</script>
<script type="text/javascript"  src=stab.js></script>
<script type="text/javascript"  src=tableparse.js></script>
<script type="text/javascript"  src=tablesetup.js></script>
<script type="text/javascript"  src=tablestruct.js></script>
</head>
<body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 0px 5px">

<table width="100%" >
<tr align="center" height="42"><td><%=Toolbox.title( tablename + Toolbox.emsgs(orgnum,166))%></td></tr>

<tr><td  ALIGN=center colspan=2    >

<form rel=opener name=thisform  method=POST  target="w<%=tstmp%>" action=Save style="margin:0px 0px 0px 0px">
<table cellpadding="0" cellspacing="1" border="0" >
<tr><td>
<INPUT type=HIDDEN   name=subdb value="<%=subdb%>" >
<INPUT type=HIDDEN   name=rdap>
<INPUT type=HIDDEN   name=query>
<INPUT type=HIDDEN   name=title>
<INPUT type=HIDDEN   name=iid>
<INPUT type=HIDDEN   name=wcds>
</td><td>
<INPUT name="ch0"   style="background:transparent"  type=checkbox onchange=setbox(this) >
</td><!--td   style="background:url(image/bgindex.jpg) <%=cachedstyle.DBGCOLOR%>" ><%=Toolbox.emsgs(orgnum,1055)%></td-->
<td id="bn1"  class="tdbutton GreenButton"  align="center" nowrap="noWrap" onclick="fmove(-1);sinkbut(this)">     <%=Toolbox.emsgs(orgnum,1053)%> </td>
<td id="bn2"  class="tdbutton GreenButton"  align="center" nowrap="noWrap" onclick="fmove(1);sinkbut(this)" >     <%=Toolbox.emsgs(orgnum,1054)%></td>
<td id="bn3"  class="tdbutton RedButton"  align="center" nowrap="noWrap" onclick="removerows();sinkbut(this)"> <%=Toolbox.emsgs(orgnum,30)%></td>
<td id="bn4"  class="tdbutton GreenButton"  align="center" nowrap="noWrap" onclick="opendef();sinkbut(this)" > <%=Toolbox.emsgs(orgnum,1055)%></td>
<td id="bn5"  class="tdbutton GreenButton"  align="center" nowrap="noWrap" onclick="refreshthis();sinkbut(this)" >  <%=Toolbox.emsgs(orgnum,93)%></td>
<td id="bn6"  class="tdbutton RedButton"  align="center" nowrap="noWrap" onclick="exec();sinkbut(this)" >  <%=Toolbox.emsgs(orgnum,727)%> </td>
<td id="bn7"  class="tdbutton OrangeButton"  align="center" nowrap="noWrap" onclick="save();sinkbut(this)" >  <%=Toolbox.emsgs(orgnum,36)%> </td>
<td id="bn8"  class="tdbutton BlueButton"  align="center" nowrap="noWrap" onclick="genaccess();sinkbut(this)" >  <%=Toolbox.emsgs(orgnum,728)%> </td>
<td id="bn9"  class="tdbutton GreenButton"  align="center" nowrap="noWrap" onclick="showhelp();sinkbut(this)" >  <%=Toolbox.emsgs(orgnum,32)%> </td>
<% if ( (user.roles & Systemroles.SYSTEMADMIN) > 0 &&
        (user.roles & Systemroles.SYSTEMANALYST) > 0 ){%>
        <td id="bn10" class="tdbutton RedButton"   align="center" nowrap="noWrap" onclick="doforall();sinkbut(this)" ><nobr> <%=Toolbox.emsgs(orgnum,1453)%></nobr> </td>
<%}%>
<td id="bn10" class="tdbutton GreenButton"   align="center" nowrap="noWrap" onclick="settarget(0);printing();sinkbut(this);settarget(1)" id="printtd"> <script type="text/javascript">document.write(textmsg[409]);</script> </td>
</tr></table>
</form>
</td></tr>


<tr><td align="left">


<form rel=opener name="form1" method="post" action="Echo" style="margin:0px 0px 0px 0px"  >


<script type="text/javascript"> document.write(round1("100%")); </script>

<table width=100% cellpadding=0 cellspacing=0 class=outset3 >   <!--1-->
    <tr><td bgcolor="#b0b0b0">

<TABLE cellpadding=3 cellspacing=0 border=1 style="border-collapse:collapse"  width=100% id="maintable">
<tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>">
 <td width=25><input type=checkbox name=check1 onclick=checkall()  style="background-color:<%=cachedstyle.BBGCOLOR%>" ></td>
   <td align="right">N</td>
 <td align=left><%=Toolbox.emsgs(orgnum,719)%></td>
 <td align=left><nobr><%=Toolbox.emsgs(orgnum,720)%></nobr></td>
 <td align=right><nobr><%=Toolbox.emsgs(orgnum,721)%></nobr></td>
 <td align=left><nobr><%=Toolbox.emsgs(orgnum,722)%></nobr></td>
 <td align=left><nobr><%=Toolbox.emsgs(orgnum,723)%></nobr></td>
 <td align=left><nobr><%=Toolbox.emsgs(orgnum,724)%></nobr></td>
 <td align=left><nobr><%=Toolbox.emsgs(orgnum,725)%></nobr></td>
 <td align=left colspan=2><nobr><%=Toolbox.emsgs(orgnum,726)%></nobr></td>
 <td align=left><nobr><%=Toolbox.emsgs(orgnum,960)%></nobr></td>
</tr>
<script type="text/javascript" >
function fillopts1(z,j){}
var fsize = ['10','20','10','5','2','20','3','10','10','20'];
 
for (var Z = 0; Z < NUMROWS; Z++)
{
    document.write('<tr bgcolor=<%=cachedstyle.TBGCOLOR%> valign=center> <td align=center width=25>'+
    '<INPUT type=checkbox NAME=checkbox value='+Z+'></td><td align=right>' + (Z+1)+
'<INPUT type=hidden class=right size=2  NAME='+Z+'_0 onfocus=rownum(this,'+Z+');S('+Z+',0);rownum(this,'+Z+') onblur=U('+Z+',0)></td><td>' +
'<INPUT class=left  size=13 NAME='+Z+'_1 onfocus=S('+Z+',1) onblur=U01(this,'+Z+',2)></td><td>' +
'<select style="border:0"   NAME='+Z+'_2 onfocus=S('+Z+',2);fillopts1('+Z+',2) onblur=U('+Z+',2) onchange=V(this,'+Z+')>');
// for (var j = 0; j < options[2].length;j++)
//    document.write('<OPTION value=' + options[2][j] + '>' + captions[2][j] + '</OPTION>');
document.write('</select></td><td width=40 align=right>' +
'<INPUT class=right size=3  NAME='+Z+'_3 onfocus=S('+Z+',3) onblur=U('+Z+',3) onkeypress="return allowenter11('+Z+')"></td> <td align=center>' +
'<INPUT type=checkbox NAME='+Z+'_4 onfocus=S('+Z+',4) onblur=U('+Z+',4) onclick=exclusive('+Z+',this,7)></td> <td  align=center>' +
'<INPUT type=checkbox NAME='+Z+'_5 onfocus=S('+Z+',5) onblur=U('+Z+',5)></td> <td>' +
'<INPUT class=left size=9  NAME='+Z+'_6 onfocus=S('+Z+',6) onblur=U('+Z+',6)></td> <td align=center>' +
'<INPUT type=checkbox NAME='+Z+'_7 onfocus=S('+Z+',7) onblur=U('+Z+',7) onclick=exclusive('+Z+',this,4)></td> <td>' +
'<select style="border:0;width:100px"   NAME='+Z+'_8 onfocus=S('+Z+',8);fillopts1('+Z+',8) onblur=U('+Z+',8) onchange=refill('+Z+')>' +
'<option value="" ></option>');
// for (var j = 0; j < options[8].length;j++)
//  document.write('<OPTION value=' + options[8][j] + '>' + captions[8][j] + '</OPTION>');
document.write('</select></td><td>' +
'<select style="border:0"   NAME='+Z+'_9 onfocus=S('+Z+',9) onblur=U('+Z+',9)><option value=""></option></select></td><td>' +
'<INPUT class=left size=8   NAME='+Z+'_10></td> </tr>' );

}
   
datapresentformat = 'DataTable';

</script>
</TABLE>
</td></tr></table>   <!--1-->
<script type="text/javascript" >document.write(round2);</script>

<script type="text/javascript" >document.write(round1('100%'));</script>
<table cellpadding=1 cellspacing=1 border=0 class=outset3 width=100% >
               <tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>">
                   <td style="background:url(image/bheading.gif)" width=<%=maxroleslen*6+35%> >
                       <%=Toolbox.emsgs(orgnum,16)%>
                   <INPUT type=hidden   name=total  value=14></td><td style="background:url(image/bheading.gif)">Check <%=Toolbox.emsgs(orgnum,961)%></td></tr>
               <tr><td bgcolor=<%=cachedstyle.DBGCOLOR%> >

                       <select <% if ((user.roles & Systemroles.SYSTEMADMIN) > 0){%> onblur="javascript:saverol(this)" <%}%>   style="border:1px #b0b0b0 solid" name=rolesel multiple=true  size=5>
                           <%
                           for (int i = 0; i < Systemroles.numRoles  ; i++)
                           {
                              out.println("<option value=" +  i  +">" + Systemroles.roles[orgnum>>16][i] +"</option>");
                           }
                           %>
                       </select>
                   </td><td  bgcolor=<%=cachedstyle.DBGCOLOR%> >
                       <INPUT name=whereclause type=hidden value=''>
                       <textarea name=check style="font-size:12px;border:1px  #b0b0b0  solid" rows=5 cols=50></textarea>
                   </td>
               </tr>
 </table>
<script type="text/javascript" >document.write(round2);</script>
</form>
</td></tr>
</table>

<script type="text/javascript"  src=multipleselect.js></script>
<script type="text/javascript"  src=helpformat.js></script>

<script type="text/javascript"  src=commonused.js></script>
<script type="text/javascript"  src=maketabledu.js></script>
<script type="text/javascript"  src=tabledefedit.js></script>
<script type="text/javascript" >
fillopts1 = function(z,j)
{
   var st =  ele(z,j);
   var l = st.options.length;
   if ( l > 2) return;
   var t = retrv(z,j);
   var i = 0;

   var ll = 1;
   if (j==2) ll = 0;
   for (i = 0; i < captions[j].length; i++)
   {
        st.options[i+ll] = new Option(captions[j][i], options[j][i]);
   }

   //setv(z,j,t);
}

//resizebut(document.thisform,<%=cachedstyle.fontsize%>, true);
for (var i=0; i < NUMROWS; i++)
valuechanged[i] = false;
document.thisform.ch0.checked = exists;
function setbox(xx){exists = xx.checked;}

function allowenter11(Z)
{
   var el =retrv(Z,2);
   var i = 0;
   for (; i < options[2].length && options[2][i] != el;i++);
   return ( i == 6 ||  i == 7);
}

function V(sel,z)
{

   if (sel.selectedIndex >= 0 && sel.options[sel.selectedIndex].value.toLowerCase() == 'char' )
   {
      defaultRecord[3] = '9';
      sel.parentNode.parentNode.cells[4].getElementsByTagName("input")[0].value = '9';
   }
   else if(sel.selectedIndex >= 0 && sel.options[sel.selectedIndex].value.toLowerCase() == 'varchar')
   {
      defaultRecord[3] = '50';
      sel.parentNode.parentNode.cells[4].getElementsByTagName("input")[0].value = '50';
   }
   else
   {
      defaultRecord[3] = nullvalue[3];
      sel.parentNode.parentNode.cells[4].getElementsByTagName("input")[0].value = '';
   }


}
function opendef()
{
    var nav = window.open("TableDef?tablename="+tablename,
    "w<%=tstmp%>"); //tabledef", 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=300,height=400');
    //nav.onload = function (){alter(nav.document.body.innerHTML)}
}

fillSelect(document.form1.rolesel, parseInt(owner), true);
function saverol(sel)
{
  if (document.thisform.ch0.checked==false || tablename=='') return;
  var code = '' + fromSelect(sel, true);
  if (code!=owner)
   {
      var nav = open("tablemake.jsp?code=" + code + "&tablename=" + tablename, "dummy");
      owner = code;
   }
}

function resizeCont()
{
    var h = document.form1.rolesel.offsetHeight;
    
    document.form1.check.style.width= (200) + 'px';
    document.form1.check.style.height= (h) + 'px';
    var w = document.form1.rolesel.offsetWidth;
    document.form1.check.style.width= ( thispagewidth() - w-40) + 'px';
}
function parse1(sql)
{
   if (confirm("Synchronize the current definition with the real table in the database?"))
   {
      definition = sql;
      numRows  = parse(definition, mat, "");
      populate(true);
   }
}

window.onresize = resizeCont;
resizeCont();
<%= Toolbox.msgjspout((orgnum%65536)+user.id, true)%>
datapresentformat = 'DataTable';
var maintbl = document.getElementById("maintable");
var hasroworder = false;
var oldtarget = '';
function settarget(jj)
{
    if (jj == 0)
    {
        oldtarget = document.thisform.target = oldtarget;
         
    }
    else
        document.thisform.target = oldtarget;
    
}
</script>
<script type="text/javascript"  src=curve.js></script>
<div id="copyright" style="text-align:center;color:#4d5ddd;font-size:12px"> 
<%= Toolbox.copyright[orgnum>>16]%> 
</div>
<iframe name="w<%=tstmp%>" style="visibility:hidden" width="1" height="1"  />
</body>
</html>
