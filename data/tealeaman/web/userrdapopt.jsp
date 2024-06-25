<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
%>
<%!
String fields2(String str, int orgnum, CachedStyle cachedstyle){return "<table cellspacing=0 cellpadding=0><tr height=22><td  style=\"background:linear-gradient(to right," + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ")\" ><font color=#DDCC11><b><NOBR>" + str +"</NOBR></b></font></td></tr></table>";}
String fields(String str, int orgnum, CachedStyle cachedstyle){return "<table  cellspacing=0 cellpadding=0 width=100% ><tr height=22 width=100% ><td width=100% style=\"background:linear-gradient(to right," + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ")\"><font color=#DDCC11><b><NOBR>" + str +"</NOBR></b></font></td></tr></table>";}
%>
<%!
String codemean(String code, int orgnum)
{

   int i = -1;
   if (code.length()==1)
       i =  "acdhklnprsu".indexOf(code);
   
   if (i>=0)
      return Toolbox.emsgs(orgnum,1304 + i);
   if (code.equals("subdb"))         return Toolbox.emsgs(orgnum,1299);
   else if (code.equals("cdrdap"))   return Toolbox.emsgs(orgnum,1300);
   else if (code.equals("extraline")) return Toolbox.emsgs(orgnum,1301);
   else if (code.equals("numrows"))  return Toolbox.emsgs(orgnum,1302);
   else if (code.equals("rsacode"))  return Toolbox.emsgs(orgnum,1303);

   else if (code.equals("onbegin"))  return Toolbox.emsgs(orgnum,1315);
   else if (code.equals("cellonfocus")) return Toolbox.emsgs(orgnum,1316);
   else if (code.equals("cellonblur")) return Toolbox.emsgs(orgnum,1317);
   else if (code.equals("onsave"))   return Toolbox.emsgs(orgnum,1318);
   else if (code.equals("onsaved"))  return Toolbox.emsgs(orgnum,1319);
   else if (code.equals("m"))        return Toolbox.emsgs(orgnum,1326);
   else if (code.equals("onclose"))  return Toolbox.emsgs(orgnum,1320);
   else if (code.equals("which"))    return Toolbox.emsgs(orgnum,1321);
   else if (code.equals("existing")) return "Initial selection";
   else if (code.equals("titlebar")) return "The title bar";
   else if (code.equals("dim"))      return "Dimension of the window";
   else if (code.equals("colsfed"))  return "Dimension of the window";
   return "";
}
%>
<%
User user = null;
if (  (user = User.authorize(orgnum, Systemroles.SYSTEMANALYST,application,session,request, response, "userrdapopt.jsp", true)) == null|| !Toolbox.verifytoken(request))
    return;
orgnum=user.orgnum;
if ( (user = User.dbauthorize(application,session,request, response, "userrdapopt.jsp", true)) == null)
{
     out.print("You have no database now. A system analyst should have one. Ask the System Administrator to create one for you");
     return;
}
long tstmp = System.currentTimeMillis() % 10000000;
CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
String jscode = Toolbox.defaultParam(orgnum,request, "jscode", null);
if (jscode!=null)
{
    jscode = MyRSA.encryptString0(jscode,orgnum>>16);
    out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body><script type=text/javascript >parent.setjscode('" + jscode +"'); </script></body></html>");
    return;
}

String url = Toolbox.defaultParam(orgnum,request, "url", null,  "@#$%+:/-_&", 250);
if (url!=null)
{
   String wh = Toolbox.defaultParam(orgnum,request, "zipit","", "$", 250);
   if (wh.equals(Toolbox.emsgs(orgnum,1323)))
   {
      int i = url.indexOf("?");
      String ziptobe = "&" + url.substring(i+1);
      out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body  >" + ziptobe +"<script type=text/javascript >opener.setzipped('" + Encode6b.zip64(ziptobe) +"'); </script></body></html>");
   }
   else if (wh.equals(Toolbox.emsgs(orgnum,73)))
   {
      int i = url.indexOf("=");
      String rzipped = "broken";
      String ziptobe = url.substring(i+1).trim();
      try
      {
         rzipped = Encode6b.rzip64(ziptobe);
      }
      catch(Exception e)
      {

      }
      out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body>" + ziptobe +"<script type=text/javascript >opener.setunzipped('" +  rzipped +"'); </script></body></html>");
   }
   return;
}
String rdap = Toolbox.defaultParam(orgnum,request, "rdap", "", null, 30);
String tastyle= "Times New Roman;"+ cachedstyle.fontsize;
String format = Toolbox.defaultParam(orgnum,request, "format", null, null, 30);
if (format==null) return;

HashMap nm = new HashMap();

nm.put("Table", new String[]{"subdb","cdrdap","extraline","numrows","rsacode","c","d","h", "l", "p","r","s","u","onbegin", "cellonfocus","cellonblur","onsave","onsaved","onclose"});
                                                                          //acdhklnprsu
nm.put("Form",new String[]{"subdb","cdrdap","extraline","numrows","rsacode","a","d","h","l","n","p","r","u","onbegin", "cellonfocus","cellonblur","onsave","onsaved","onclose"});

nm.put("LongForm",new String[]{"subdb","cdrdap","extraline","numrows","rsacode","d","h","p","u","onbegin", "cellonfocus","cellonblur","onsave","onsaved","onclose"});

nm.put("HTML",new String[]{"subdb","cdrdap","rsacode","l","r"});

nm.put("FormHTML",new String[]{"subdb","cdrdap","rsacode"});

nm.put("Text",new String[]{"subdb","cdrdap","rsacode"});

nm.put("LaTex",new String[]{"subdb","cdrdap","rsacode"});

nm.put("XML",new String[]{"subdb","cdrdap","rsacode"});

nm.put("Picker",new String[]{ "subdb","cdrdap","extraline","numrows","rsacode","colsfed","m","existing","k","onbegin", "cellonfocus","cellonblur","onsave","onsaved","onclose"});

nm.put("Update",new String[]{"subdb","cdrdap"});

nm.put("Search",new String[]{"subdb","cdrdap","titlebar", "dim","onbegin", "cellonfocus","cellonblur","onsave","onsaved","onclose"});

nm.put("Web",new String[]{"subdb","cdrdap","which"});

nm.put("Merge",new String[]{"subdb","cdrdap"});

String params[] = (String[])(nm.get(format)); //{"subdb","cdrdap","extraline","NUMROWS","rsacode","exbut","onbegin", "cellonfocus","cellonblur","onsave","onsaved","onclose"};
if (params==null) return;
HashMap values = new HashMap();
HashMap checks = new HashMap();
int rsapos = -1;
String rsavalue = "";
for (int i=0; i < params.length; i++)
{
     String vl = Toolbox.defaultParam(orgnum,request, (params[i]), null);
      
     if (params[i].length()!=1)
        checks.put(params[i], ((vl!=null)?"checked":"") );
     else
     {
        vl = Toolbox.defaultParam(orgnum,request, ("exbut"), null);
        if (vl!=null && vl.indexOf(params[i])>=0)
           vl = "";
        else vl = null;
     }
     checks.put(params[i], ((vl!=null)?"checked":"") );
     values.put(params[i], ((vl==null)?"":vl) );
}

if (null != DBAdmin.server2admin(user.getDBConnectInfo().server))
{

   if (values.get(params[0]).equals(""))
   {
        values.put(params[0],user.id);
        checks.put(params[0],"checked");
   }
   if (values.get(params[1]).equals(""))
   {
        values.put(params[1],"1");
        checks.put(params[1],"checked");
   }
}

%>

<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head> 
<%=Toolbox.getMeta(orgnum)%>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("userrdapopt.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript"   src=findrep.js></script>
<title> <%= Toolbox.emsgs(orgnum,1322) %> </title>

<style type="text/css">
body {background:<%=cachedstyle.DBGCOLOR%>;margin:6px 6px 0px 6px;font-size:<%=cachedstyle.fontsize%>px}
form {margin:5px 0px 0px 0px}
.thehint{background:#DDDDAA;border:1px solid #991020;color:green;font-size:16px;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>}
/*table tr td table tr td {background:<%=cachedstyle.TBGCOLOR%>} */
td.header {background:<%=cachedstyle.BBGCOLOR%>;font-weight:700}
textarea {font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:<%=cachedstyle.fontsize%>px;width:350px;border:1px #b0b0b0 solid}
input.box {font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:<%=cachedstyle.fontsize%>px;border:1px #b0b0b0  solid}
select.box1 {font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:<%=cachedstyle.fontsize%>px;border:1px  #b0b0b0  solid}
input.trans {background-color:transparent}

</style>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
<link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
</head>
<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px" >
 
<table   align=center bgcolor="grey" cellspacing=0 cellpadding=0 cellspacing=0 class=outset3>
    <%=Toolbox.title(Toolbox.emsgs(orgnum,1322),1).replaceFirst("2px", "0px")%> 
<tr><td width="100%">
<form rel=opener name="thisform" style="margin:0px 0px 0px 0px" METHOD="POST" action="userrdapopt.jsp" onsubmit="return enzipcrpt()" target="w<%=tstmp%>">

<table cellspacing="0" cellpadding="0" width="100%" >
<tr>
<td class="header"><%=Toolbox.emsgs(orgnum,923)%></td>
<td><input type="text"   name="url"   size="30"> </td>
<td><input type="submit" name="zipit" class="GreenButton" value="<%=Toolbox.emsgs(orgnum,1323)%>" ></td>
<td><input type="button" name="test"  class="GreenButton" value="<%=Toolbox.emsgs(orgnum,321)%>"  onclick="openit()"> </td>
</tr>
</table>
</form>
</td></tr>
<style type="text/css">table>tr>td>div>table>tr>td{background-color:white}</style>
<tr><td  width="100%"  align=center><div><TABLE cellpadding=1 cellspacing=1 border=0  width="100%" >
<tr style="background:<%=cachedstyle.BBGCOLOR%>">
<td align="center" class="header"><img src="image/addopt.png"></td>
<td  class="header" align=center colspan="2" width="90">
 <%=Toolbox.emsgs(orgnum,1215)%>
 </td><td  class="header" width="100">
 <%=Toolbox.emsgs(orgnum,867)%>
 </td>
 <td class="header" width="370">
 <%=Toolbox.emsgs(orgnum,1324)%>
 </td>
 <td  class="header"  >
 <%=Toolbox.emsgs(orgnum,1325)%>
 </td>
</tr>
<%
int i1=0, i2=0, i3= 0;
for (int i=0; i < params.length; i++)
{

    if (  params[i].equals("subdb")    ||params[i].equals("cdrdap")
      ||params[i].equals("extraline")||params[i].equals("numrows")
      ||params[i].equals("rsacode")  ||params[i].equals("titlebar")
      ||params[i].equals("dim")      ||params[i].equals("existing")
      ||params[i].equals("which") || params[i].equals("colsfed")
       )
  {
   i1++;
   %>
<tr>
<td valian="top"><input class="trans" name="checkall" type="checkbox" <%=(String)(checks.get(params[i]))%>
onclick="<%
if(params[i].equals("extraline")||params[i].equals("numrows"))
   out.print("mutex");
else if (params[i].equals("rsacode") || params[i].equals("which"))
   out.print("sets");
else out.print("set");%>(this)"></td>
<td valian="top"><%=params[i]%></td>
<td valian="top" align="center">=</td>
<td valian="top" width="100">
<% if ( params[i].equals("subdb")|| params[i].equals("titlebar")
      ||params[i].equals("dim")  || params[i].equals("existing")|| params[i].equals("colsfed"))
{%>
<input class="box" name="<%=params[i]%>" size="9" value="<%=(String)(values.get(params[i]))%>" onblur="set(this);">
<%} else if (params[i].equals("cdrdap")) {%>
<input name="cdrdap" type="hidden" value="1">1
<%} else if (params[i].equals("extraline")||params[i].equals("numrows")) {%>
<input class="box" name="<%=params[i]%>" size="1" value="<%=(String)(values.get(params[i]))%>" onblur="seti(this)">
<%} else if (params[i].equals("rsacode") ||params[i].equals("which")) {
   rsavalue += "buildrsa(" + i +",'" + params[i] +"','" + (String)(values.get(params[i])) +"');";
   %>
<select class="box1"  name="<%=params[i]%>" onchange="sets(this)"></select>
<%}

%>
</td>
<td valian="top" width="370"><%=codemean(params[i],orgnum) %></td>
<td valian="top"> </td>
</tr>

<%} else

  if (params[i].length()==1) {%>
<tr>
<td valian="top"><input name="checkbox" class="trans" type="checkbox"  <%=(String)(checks.get(params[i]))%>   onclick="setc(this)"></td>
<td valian="top" >exbut</td>
<td valian="top" >&supe;</td>
<td valian="top"><%=params[i]%></td>
<td valian="top"  width="370"><%=codemean(params[i], orgnum)%></td>
<% if (i2 == 0){while(i+i2 < params.length && params[i+i2].length()==1)i2++;%><td valian="top" rowspan="<%=i2%>"></td><%}%>
</tr>
<%}
else
{
i3++;
%>
<tr>
<td valian="top"><input name="checkbox" class="trans" type="checkbox"  <%=(String)(checks.get(params[i]))%>  onclick="setj(this)"></td>
<td valian="top"><%=params[i]%></td>
<td valian="top" align="center">=</td>
<td valian="top" colspan="2" width="470">
   <table cellpadding=0 cellspacing=0>
      <tr><td width="350" valign="top"><textarea name="onbegin" rows="6" onfocus="large(this)"  onkeypress="return alarge(this)" onblur="setjj(<%=i%>,this)"><%=(String)(values.get(params[i]))%></textarea></td>
          <td width="5"  style="width:5px" ></td>
          <td style="width:115px" valign="top">
          <%=codemean(params[i],orgnum)%><br>
          <input type="checkbox" name="codetype" >Hex
          <img src="image/blank.gif" width="115px" height="1px">
          </td>

      </tr>
   </table>
</td>
<td  valian="top"></td>
</tr>
<%
}
}
%>

</table></div>
</td></tr></table>
 

<br>
<table align="center">
<tr><td colspan="3" align="center">URL Encode and Decode</td></tr>
<tr><td><textarea cols="30" rows="6" id="sourcecodes"></textarea></td>
<td>
   <input type="checkbox"  id="urlhex" name="hex">Hex<br>
   <input class="GreenButton" style="width:65px;height:24px" name="urlencode" value="Encode>>" onclick="encode()"><br>
   <input class="GreenButton" style="width:65px;height:24px" name="urldecode" value="<<Decode" onclick="decode()">
</td>
<td><textarea cols="30" rows="6" id="urlcodes"></textarea></td>
</tr>
</table>
<form rel=opener name="f4" target="w<%=tstmp%>" method="post" action="userrdapopt.jsp">
   <input name="jscode" type="hidden">
</form>
<script type="text/javascript"  src="encryption.js"></script>
<script type="text/javascript" >
var tstmp = <%=tstmp%>;
serCharSize(<%=Toolbox.locales[orgnum>>16].charsize%>);
var whichjsbax = 0;
function setjscode(jscode)
{
   if (whichjsbox==0)
      document.getElementById("urlcodes").value = jscode;
   else resumev(jscode);
}

var encode = function()
{
   var tet =  document.getElementById("sourcecodes").value;
   if (document.getElementById("urlhex").checked == false)
   {
      document.getElementById("urlcodes").value = encodeURIComponent(tet);
   }
   else
   {
      hexcode(null,0,tet);
   }
}
var decode = function()
{
   var tet =  document.getElementById("urlcodes").value;
   if (document.getElementById("urlhex").checked == false)
   {
      tet = decodeURIComponent(tet);
   }
   else
   {
      tet = decryptString0(tet);
   }
   document.getElementById("sourcecodes").value = tet;
}
 
var i1=<%=i1%>, i2=<%=i2+i1%>,i3=<%=i1+i2+i3%>, rsapos=<%=rsapos%>;

var font_size = <%=cachedstyle.fontsize%>;
var rdap = "<%=rdap%>";
var format = "<%=format%>";
var j = <%=Toolbox.defaultParam(orgnum,request, "j", "1") %>;
var decrypt = "<%=Toolbox.emsgs(orgnum,73)%>";
var encrypt = "<%=Toolbox.emsgs(orgnum,1323)%>";
var str = "";
onbeforeunload = saveall;
var startlive = false;
var tb0 = document.getElementsByTagName("table")[0];

var tb1 = tb0.rows[2].cells[0].getElementsByTagName("table")[0];

var rdapurl = '';
var urllinewidth = 100;
var synwidth = 20;

function buildrsa(i,para,vl)
{
   var sel = tb1.rows[i+1].cells[3].getElementsByTagName("select")[0];
   sel.options[0] = new Option("","");
   if (para == 'rsacode')
   {
   sel.options[1] = new Option("Server to User","1");
   sel.options[2] = new Option("User to Server","2");
   sel.options[3] = new Option("Both way","3");
   }
   else
   {
   sel.options[1] = new Option("Insert","insert");
   sel.options[2] = new Option("Update","update");
   sel.options[3] = new Option("Delete","delete");
   }
   i=0;
   for (; i < 4 && vl!=sel.options[i].value; i++);
   sel.selectedIndex = i;
}
<%=rsavalue%>
function saveall(){opener.setOptions(j,str);}

function init()
{
   for (var i=0; i < i1; i++)
      if (tb1.rows[i+1].cells[3].innerHTML.indexOf("sets(") > 0)
         sets(tb1.rows[i+1].cells[0].getElementsByTagName("input")[0]);
      else
         set(tb1.rows[i+1].cells[0].getElementsByTagName("input")[0]);
   for (var i=i1; i <  i2; i++)
      setc(tb1.rows[i+1].cells[0].getElementsByTagName("input")[0]);
   for (var i= i2; i < i3; i++)
      setj(tb1.rows[i+1].cells[0].getElementsByTagName("input")[0]);
   startlive = true;
   var loct = '' + document.location;
   rdapurl = loct.replace(/userrdapopt.jsp.*$/, 'Data' + format +"?rdap="+ encodeURIComponent(rdap));
}
function unfold(v){return v.replace(/<br>/ig,'').replace(/&amp;/ig,'&');}
function fold(v,n)
{
   var z = "", y = unescape(v);
   if (y.indexOf("+")>0||y.indexOf("-")>0||y.indexOf("*")>0
    ||y.indexOf(")")>0 || y.indexOf("(")>0
   ||y.indexOf("[")>0||y.indexOf("]")>0 || y.indexOf("{")>0
   ||y.indexOf("}")>0||y.indexOf("%")>0 || y.indexOf("@")>0)
   {
     
      z = v;
   }
   else
   for (var i=0; i < v.length; i++)
   {
      z += v.charAt(i);
      if (i % n == 0 && i > 0)
         z += "<br>";
   }
   return z.replace(/&amp;/ig,'&');
}
function set(t)
{
   var pp = t.parentNode.parentNode;
   var v = '';
   var x = pp.cells[3].getElementsByTagName("input")[0].value.replace(/ /g,'');

   if (pp.cells[0].getElementsByTagName("input")[0].checked && x!='')
   {
      if (pp.cells[1].innerHTML == 'cdrdap' &&
            pp.parentNode.rows[1].cells[0].getElementsByTagName("input")[0].checked == false)
      {
         pp.cells[0].getElementsByTagName("input")[0].checked = false;
         myprompt('subdb has to be set because a non-system rdap can not access the system database');
      }
      else
         v = '&amp;' + pp.cells[1].innerHTML  + '=' + x;
   }

   pp.cells[5].innerHTML = fold(v,synwidth);
   if (v=='' && t.name!='checkall')
      pp.cells[0].getElementsByTagName("input")[0].checked = false;

   if (startlive) updateurl();
}

function sets(t)
{
   var pp = t.parentNode.parentNode;
   var v = '', x='';
   
   var xs = pp.cells[3].getElementsByTagName("select");
   if (xs!=null && xs[0].selectedIndex > 0)
      x = xs[0].options[xs[0].selectedIndex].value.replace(/ /g,'');

   if (pp.cells[0].getElementsByTagName("input")[0].checked && x!='')
      v = '&amp;' + pp.cells[1].innerHTML  + '=' + x;
   pp.cells[5].innerHTML = fold(v,synwidth);
   if (v=='' && t.name!='checkall')
   {
       pp.cells[0].getElementsByTagName("input")[0].checked = false;
   }
   else if (v=='' && t.name=='checkall' && startlive)
   {
       var yy = pp.cells[3].getElementsByTagName("select")[0];
       yy.focus();
   }
   if (startlive) updateurl();
}

function seti(t)
{
   if (t.value!='' && isNaN(t.value))
   {
      myprompt('Enter a number');
      return;
   }
   set(t);
}


function mutex(t)
{
   var ppp = t.parentNode.parentNode.parentNode;
   var xx = t.parentNode.parentNode.cells[3].getElementsByTagName("input")[0];
   var n = 3; if (xx.name=='extraline') n = 4;
   var other = ppp.rows[n].cells[0].getElementsByTagName("input")[0];
   if (t.checked && other.checked)
   {
      myprompt('Only one from extraline and numrows can be presented. Uncheck the other one first');
      t.checked = false;
   }
   set(t);
}

function setc(t)
{
   var ppp = t.parentNode.parentNode.parentNode;
   var v = '';
   for (var n = i1; n < i2; n++)
   {
      if (ppp.rows[n+1].cells[0].getElementsByTagName("input")[0].checked)
         v += ppp.rows[n+1].cells[3].innerHTML;
   }
   if (v!='') v = "&amp;exbut=" + v;
   ppp.rows[i1+1].cells[5].innerHTML = fold(v,synwidth);
   if (startlive) updateurl();
}

function setj(t)
{
   var pp = t.parentNode.parentNode;
   var v = '';
   var x = pp.cells[3].getElementsByTagName("table")[0].rows[0].cells[0].getElementsByTagName("textarea")[0].value;

   if (pp.cells[0].getElementsByTagName("input")[0].checked && x!='')
   {
       var y = pp.cells[3].getElementsByTagName("table")[0].rows[0].cells[2].getElementsByTagName("input")[0].checked;
       if (y==false)
       {
          v = encodeURIComponent(x);
       }
       else
       {
          hexcode(pp,1,x);
          return;
       }
       v = '&amp;' + pp.cells[1].innerHTML  + '=' + v;
   }

   pp.cells[4].innerHTML = fold(v,synwidth);
   if (startlive) updateurl();
}
var resume2t = null;
function hexcode(t,j,x)
{
   whichjsbox = j;
   resume2t = t;
   document.f4.jscode.value = x;
   visual(document.f4);
document.f4.submit();
}
function resumev(v)
{
   if (whichjsbox == 1)
   { 
       v = '&amp;' + resume2t.cells[1].innerHTML  + '=' + v;
       resume2t.cells[4].innerHTML = fold(v,synwidth);
   }
   else
   {
       v = '&amp;' + resume2t.cells[1].innerHTML  + '=' + v;
       resume2t.cells[4].innerHTML = fold(v,synwidth);
       if (v=='')
       resume2t.cells[0].getElementsByTagName("input")[0].checked = false;
   }
   if (startlive) updateurl();
}

function setjj(i,t)
{
   var pp = tb1.rows[i+1];
   var v = '';
   var x = t.value;

   if (pp.cells[0].getElementsByTagName("input")[0].checked && x!='')
   {
      var y = pp.cells[3].getElementsByTagName("table")[0].rows[0].cells[2].getElementsByTagName("input")[0].checked;
      if (y==false)
      {
         v= encodeURIComponent(x);
      }
      else
      {
          hexcode(pp,2,x);
          return;

      }

       v = '&amp;' + pp.cells[1].innerHTML  + '=' + v;
   }

   pp.cells[4].innerHTML = fold(v,synwidth);
   if (v=='')
      pp.cells[0].getElementsByTagName("input")[0].checked = false;
   if (startlive) updateurl();
}


function updateurl()
{
   str = "";
   for (var i = 0; i < i1; i++)
   {
      str += tb1.rows[i+1].cells[5].innerHTML;
      
   }
   if (i2 > i1)
      str += tb1.rows[i1+1].cells[5].innerHTML;

   for (var i = i2; i < i3; i++)
   {
      str += tb1.rows[i+1].cells[4].innerHTML;
   }
   str = unfold(str);
   var loct = '' + document.location;
   document.thisform.url.value  =  loct.replace(/userrdapopt.jsp.*$/, 'Data' + format) + "?rdap=" + encodeURIComponent(rdap) + str;
  // tdurl.innerHTML = "<b>URL</b> <a href=\"" + rdapurl + str +"\">" + fold(rdapurl + str,urllinewidth) +"</a>";
   showzip(true);
}
var numlines = 0;
function setzipped(str)
{
   var loct = '' + document.location;

   str = loct.replace(/userrdapopt.jsp.*$/, 'Data') + format +"?zpcrpt="+ str;

   document.thisform.url.value = str;

    showzip(false);
}
function setunzipped(str)
{
   var loct = '' + document.location;
   document.thisform.url.value = loct.replace(/userrdapopt.jsp.*$/, 'Data' + format + str.replace(/./,'?'));
   //tdurl.innerHTML = "<b>URL</b> <a href=\"" +zipped +"\">" + fold(zipped,urllinewidth) +"</a>";
   showzip(true);
}
function enzipcrpt()
{
   window.open("","w" + tstmp);
   return true;
}
function large(t)
{
   numlines = 0;
   for (var i=0; i < t.value.length; i++)
      if (t.value.charAt(i)=='\n')
         numlines++;

   if (numlines  > 5)
   {
      t.rows = numlines;
   }
}

function alarge(t,evt)
{
    var e = evt? evt : window.event;
    if(!e) return true;
    var key = 0;
    if (e.keyCode) { key = e.keyCode; } // for moz/fb, if keyCode==0 use 'which'
    else if (typeof(e.which)!= 'undefined') { key = e.which; }
    if (key == 13)
    {
       numlines++;
       if (numlines >= 5)
       {
          t.rows = numlines+1;
       }
    }
    return true;
}

function resz()
{
  var wd = thispagewidth();
  urllinewidth = Math.floor(wd/font_size*1.9);
  synwidth = Math.floor( (wd-590)/font_size*1.9);
  document.thisform.url.style.width = (wd - 180) + 'px';
  for (var i = i2; i < i3; i++)
  {
     tb1.rows[i+1].cells[4].innerHTML = fold(unfold(tb1.rows[i+1].cells[4].innerHTML),synwidth);
  }
  updateurl();
}

function showzip(tf)
{
   document.thisform.zipit.value = tf?encrypt:decrypt;
}

function openit()
{
   var tt = document.thisform.url.value;
   open(tt, "_blank");
}

init();
var het = 600;
if (typeof window.innerHeight != 'undefined')
   het = window.innerHeight;
else het = document.body.offsetHeight;
if (tb0.offsetHeight <  het - 100)
{
   window.resizeTo(tb0.offsetWidth + 30, tb0.offsetHeight + 100);
}
resz();
onresize = resz;

</script>
<script type="text/javascript"  src="curve.js"></script>
<iframe name="w<%=tstmp%>" frameborder="0" width="500" height="30" scrolling="no" />
</body>
</html>
