<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
 
User user = null;
if ( !Toolbox.verifytoken(request) || (user = User.authorize(orgnum, Systemroles.SYSTEMANALYST,application,session,request, response, "querymake.jsp", true)) == null) 
    return;
orgnum=user.orgnum;
long tstmp = System.currentTimeMillis() % 10000000;
String subdb = Toolbox.defaultParam(orgnum,request,"subdb", user.id, null, 30); 
user.changedb(subdb);
String query =  Toolbox.defaultParam(orgnum,request, "queryname", Toolbox.defaultParam(orgnum,request,"rdap",""), null, 30);

int maxroleslen = 0;
  for (int i = 0; i < Systemroles.numRoles; i++)
  {
      if ( maxroleslen < Systemroles.roles[orgnum>>16][i].length())
           maxroleslen = Systemroles.roles[orgnum>>16][i].length();
  }

%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,718)%></title>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
<style type="text/css"> 
.tdbutton{width:<%=Math.round(4*cachedstyle.fontsize)%>px;border:1px green outset;color:white;font-family:<%=Toolbox.fontsnamestr(orgnum>>16) %>;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#606060 -1px -1px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:3px;margin:3px 3px 3px 3px;}
   
.buttong {background:url(image/GreenButton.gif);color:white;width:<%=4*cachedstyle.fontsize%>px;border:1px #EEEEEE outset;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#707070 -1px -1px }
.buttonr {background:url(image/RedButton.gif);color:white;width:<%=4*cachedstyle.fontsize%>px;border:1px #EEEEEE outset;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#707070 -1px -1px}
.buttono {background:url(image/OrangeButton.gif);color:white;width:<%=4*cachedstyle.fontsize%>px;border:1px #EEEEEE outset;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#707070 -1px -1px}
.buttonb {background:url(image/BlueButton.gif);color:white;width:<%=4*cachedstyle.fontsize%>px;border:1px #EEEEEE outset;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#707070 -1px -1px}
td.fixed {font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:12pt}
input {font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:12pt} 
select {font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:12pt} 
textarea {font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:12pt}
input.box {font-family:"Times New Roman";font-size:12pt}
input.buttonstyle {font-size:12pt;color:antiquewhite;font-weight:700;width:65px;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>}
</style>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("querymake.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>
<script type="text/javascript" >
var theurl = "<%=Toolbox1.geturl(request)%>";
var tstmp = <%=tstmp%>;
var tablename="";
var queryname = "<%=query%>";
var font_size = <%=cachedstyle.fontsize%>;
var checks = "";
var STNEVE = ["","","","","","",""];
var viewonly = false; 
 
var msg71 = "<%=Toolbox.emsgs(orgnum,71)%>";

 
</script>
 
<script type="text/javascript"  src=queryparse.js></script>
<script type="text/javascript"  src=tableparse.js></script>
<script type="text/javascript"  src=querysetup.js></script>
<script type="text/javascript"  src=tablestruct.js></script>
</head>
<body  style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 0px 5px" >

<table width=100% cellpadding="0" cellspacing="0">

<tr   BGCOLOR=<%=cachedstyle.IBGCOLOR%> height=42>
<td>
<%=Toolbox.title( query  )%>
</td>
</tr>

<tr><td  ALIGN=center >
<form rel=opener name=thisform  method=POST  target="w<%=tstmp%>" action=Save style="margin:4px 0px 0px 0px">
<table cellpadding="0" cellspacing="1">
<tr><td>
<input type=HIDDEN   name=subdb>
<input type=HIDDEN   name=rdap>
<input type=HIDDEN   name=query>
<input type=HIDDEN   name=title>
<input type=HIDDEN   name=iid>
<input type=HIDDEN   name=wcds>
</td>
<td id="bn1" class="tdbutton GreenButton"  align="center" nowrap="noWrap" ONCLICK="sinkbut(this);fmove(-1)"> <%=Toolbox.emsgs(orgnum,1053)%> </td>
<td id="bn2" class="tdbutton GreenButton"  align="center" nowrap="noWrap" ONCLICK="sinkbut(this);fmove(1)">  <%=Toolbox.emsgs(orgnum,1054)%> </td>
<td id="bn3" class="tdbutton RedButton"  align="center" nowrap="noWrap" ONCLICK="sinkbut(this);removerows()" > <%=Toolbox.emsgs(orgnum,30)%> </td>
<td id="bn4" class="tdbutton GreenButton"  align="center" nowrap="noWrap" ONCLICK="sinkbut(this);genaccess(this)" >  <%=Toolbox.emsgs(orgnum,36)%> </td>
<td id="bn5" class="tdbutton GreenButton"  align="center" nowrap="noWrap" ONCLICK="sinkbut(this);showhelp()"> <%=Toolbox.emsgs(orgnum,32)%> </td>
</tr></table>
</form>
</td></tr>

<tr><td ALIGN=left width="100%" >

<form rel=opener name=form1 method=post action=Echo style="margin:2px 2px 2px 2px"  >

<script type="text/javascript"  >document.write(round1('100%'));</script>
<table cellpadding=0 cellspacing=0 class=outset3 width="100%"><tr><td>
<TABLE cellpadding=3 cellspacing=1 border=1 style="border-collapse: collapse"   width="100%">
<TR style="background:<%=cachedstyle.BBGCOLOR%>">
 <TD width=25><input type=checkbox name=check1 onclick=checkall()  style="background-color:<%=cachedstyle.BBGCOLOR%>"></TD>
 <!--TD align=right><%=Toolbox.emsgs(orgnum,231)%></TD--><td>N</td>
 <TD align=left><NOBR><%=Toolbox.emsgs(orgnum,719)%></NOBR</TD>
 <TD align=left><NOBR><%=Toolbox.emsgs(orgnum,720)%></NOBR</TD>
 <TD align=right><NOBR><%=Toolbox.emsgs(orgnum,721)%></NOBR</TD>
 <TD align=left ><NOBR><%=Toolbox.emsgs(orgnum,722)%></NOBR</TD>
 <TD align=left><NOBR><%=Toolbox.emsgs(orgnum,723)%></NOBR</TD>
 <TD align=left><NOBR><%=Toolbox.emsgs(orgnum,724)%></NOBR</TD>
 <TD align=left ><NOBR><%=Toolbox.emsgs(orgnum,725)%></NOBR</TD>
 <TD align=left colspan=2><NOBR><%=Toolbox.emsgs(orgnum,726)%></NOBR></TD>
 <TD align=left><NOBR><%=Toolbox.emsgs(orgnum,960)%></NOBR></TD>
</TR>
<script type="text/javascript"  >

var selectedTypeIndex = 0;
for (var Z = 0; Z < NUMROWS; Z++) 
{
    document.writeln('<TR bgcolor=<%=cachedstyle.TBGCOLOR%> valign=center><TD align=center width=25>'+
    '<INPUT type=checkbox NAME=checkbox value='+Z+'></td><td>' + Z +
'<INPUT type=hidden class=right size=2  NAME='+Z+'_0 onfocus=S('+Z+',0) onblur=U('+Z+',0)></TD><TD>' +
'<INPUT class=left  size=13 NAME='+Z+'_1 onfocus=S('+Z+',1) onblur=U01(this)></TD><TD>' +
'<select NAME='+Z+'_2 onfocus=S('+Z+',2);fillopts('+Z+',2)  onblur=U('+Z+',2) onchange=V(this,'+Z+')></select></TD><TD width=40  align=right>' +
'<INPUT class=right size=3  NAME='+Z+'_3 onfocus=S('+Z+',3) onblur=U('+Z+',3) onkeypress="return allowenter11('+Z+')"></TD><TD align=center>' +
'<INPUT type=checkbox       NAME='+Z+'_4 onfocus=S('+Z+',4) onblur=U('+Z+',4) onclick=exclusive('+Z+',this,7)>&nbsp;</TD><TD  align=center>' +
'<INPUT type=checkbox       NAME='+Z+'_5 onfocus=S('+Z+',5) onblur=U('+Z+',5)></TD><TD>' +
'<INPUT class=left size=9   NAME='+Z+'_6 onfocus=S('+Z+',6) onblur=U('+Z+',6)></TD><TD align=center>' +
'<input type=checkbox       NAME='+Z+'_7 onfocus=S('+Z+',7) onblur=U('+Z+',7) onclick=exclusive('+Z+',this,4)></TD><TD>' +
'<select NAME='+Z+'_8 onfocus=fillopts('+Z+',8);S('+Z+',8)  onblur=U('+Z+',8) onchange=refill('+Z+')><option value=""></option></select></td><td>' +
'<select style="border:0"   NAME='+Z+'_9 onfocus=S('+Z+',9) onblur=U('+Z+',9)></select></TD><td>' +
'<input name='+  Z + '_10 size=8></td></tr>');
 
}
</script>
</TABLE>
</td></tr></table>  
<script type="text/javascript"  >document.write(round2);</script>

<script type="text/javascript"  >document.write(round1('100%'));</script>

<table cellpadding="0" cellspacing="0">
<tr>
    <td style="background:url(image/bheading.gif)"  > <%=Toolbox.emsgs(orgnum,16)%></td>
    <td><input type=hidden   name=total  value=14  ></td>
    <td style="background:url(image/bheading.gif)" >WHERE <%=Toolbox.emsgs(orgnum,961)%></td>
</tr>
<tr>

<td>
<select name=rolesel multiple=true  size=5>
<%  
  for (int i = 0; i < Systemroles.numRoles; i++)
  {
      out.println("<option value=" +  i  +">" + Systemroles.roles[orgnum>>16][i] +"</option>");
  }
%>
</select>
</td>

<td><input name=check type=hidden value=''></td>

<td>
<textarea name=whereclause rows=5 style=font-size:12 cols=50></textarea></td>
</tr>
</table>
<script type="text/javascript"  >document.write(round2);</script>
</form>
</td></tr>
</table> 
<script type="text/javascript"  src=multipleselect.js></script>
<script type="text/javascript"  src=helpformat.js></script>

<script type="text/javascript"  src=commonused.js></script>
<script type="text/javascript"  src=maketabledu.js></script>
<script type="text/javascript"  src=tabledefedit.js></script>
<script type="text/javascript"  >
function fillopts(z,j)
{
   if (typeof ele == 'undefined') return;
   var st = ele(z,j);
   if (st==null || st.tagName.toLowerCase()!='select') return;
   var so = st.options;
   if (so!=null && so.length  > 2) return;
   var t = retrv(z,j);  
   var i = 0; 

   var ll = 1; 
   if (j==2) ll = 0;
   for (i = 0; i < captions[j].length; i++)
   {
        st.options[i+ll] = new Option(captions[j][i], options[j][i]);
   }  
} 

function allowenter11(Z)
{
   var el = ele(Z,2);
   return ( el.selectedIndex >= 6 && el.selectedIndex <= 7);
}
function V(sel,z)
{
   if (sel.selectedIndex == 6 )
       defaultRecord[3] = '9';
   else if(sel.selectedIndex == 7) 
       defaultRecord[3] = '50';
   else defaultRecord[3] = null;
   
}
function opendef()
{
     window.open("TableDef?tablename="+tablename, "tabledef", 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=300,height=400');   
}

fillSelect(document.form1.rolesel,parseInt(owner), true);

document.form1.whereclause.value = whereclause;

var mt = null;;

function addmore(tabledef,m,tbn)
{
        mt = new Array(m);
        for (var i=0;  i < m; i++)
        { 
           mt[i] = new Array(numCols);   
           for (var j =0; j < numCols; j++)
                mt[i][j] = null;
        }
        var nn = parse(tabledef, mt, tbn+".");
        addone(nn,0,tbn);
}

function addone(nn,i,tbn)
{
        var k = numRows; 
        var ll =0; 
        while (ll < numRows && retrv(ll,1) != mt[i][1])
               ll++;
        if (ll < numRows) 
        {
           if (i+1 < nn) addone(nn,i+1,tbn);
           return;
        }
        myprompt('Add ' + mt[i][1] + "  to the query?<br><input type=checkbox onclick=\"closeprompt()\"> Don't ask me again.",null, "goaddone(v," + nn + "," + i +"," + k +",'" + tbn +"')");
}

function goaddone(v, nn, i, k, tbn)
{
     if (v)
     {
        mt[i][0] = '' +(k+1);
        for (var j = 0; j < numCols; j++)
        {
             setv(k, j, mt[i][j]); 
             mat[k][j] = mt[i][j]; 
        }
        k++;
        if ( (","+tablename+',').indexOf(','+tbn+',') < 0)
        {    if (tablename!='')
               tablename  = tablename + ','+ tbn  ;
             else  tablename = tbn  ;
        }
     }
     numRows=k;
     if (i+1 < nn) addone(nn,i+1,tbn);
}
 
 

function resizeCont()
{
    var h =  document.form1.rolesel.offsetHeight;
    var w =  document.form1.rolesel.offsetWidth-20;
    document.form1.whereclause.style.height= h + 'px';
    document.form1.whereclause.style.width= (200) + 'px';
    document.form1.whereclause.style.width = (thispagewidth() - w  ) + 'px';
} 
window.onresize = resizeCont;
resizeCont();

</script>
<script type="text/javascript"  src=curve.js></script>
<iframe name="w<%=tstmp%>" width="1" height="1" style="visibility: hidden" />
</body>
</html>
