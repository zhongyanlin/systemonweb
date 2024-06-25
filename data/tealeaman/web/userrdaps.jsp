<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
    String encoding = Toolbox.encodings[orgnum>>16];
    String langcode =  Toolbox.langs[orgnum>>16];
    CachedStyle cachedstyle = new CachedStyle(request,orgnum); 
%>

<%!
String trim(String x)
{
    if (x == null) return null; 
    return x.replaceFirst("^[\n|\r| |\t]*","").replaceFirst("[\n|\r| |\t]*$","");
} 

String trimcsv(String x)
{
    CSVParse parse = new CSVParse(x, '\'', new String[]{",","\r\n"});
    String [][] p = parse.nextMatrix(true);
    x = "";
    for (int i=0; i < p.length; i++)
    for (int j =0; j < p[i].length; j++)
    {
        x +=  round(trim(p[i][j]));
        if (j < p[i].length-1)
            x += ",";
        else if ( i < p.length -1)
            x += "\r\n"; 
    }     
    return x; 
}

String round(String x)
{
    if (x == null) return ""; 
    String q = ""; 
    if (x.indexOf("'")>=0 || x.indexOf(",") >= 0 || x.indexOf("\n") >=0 || x.indexOf("\r") >=0)
        q = "'";
    return q + x.replaceAll("'", "''") + q;
} 
String fields2(String str,int orgnum, CachedStyle cachedstyle){return "<table cellspacing=0 cellpadding=0><tr ><td style=\"background-image:linear-gradient(to right," + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ");color:#DDCC11;text-shadow:-1px -1px #060606\"><b><NOBR>" + str +"</NOBR></b></td></tr></table>";}
String fields(StringBuffer labelbuf, int i, String str, int orgnum, CachedStyle cachedstyle){labelbuf.append(str + "','");return "<table  cellspacing=0 cellpadding=0 width=100% ><tr   width=100% ><td width=100%   style=\"background:linear-gradient(to right," + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ");height:" + (i+8) + "px;width:" + Toolbox.charwidthrate()*i +"px\"    bgcolor=" + cachedstyle.IBGCOLOR + " valign=middle ><span style=\"padding:0px 2px 0px 4px;text-shadow:-1px -1px #060606;color:#DDCC11\" id=\"" + str.replaceAll(" ","") + "\"><b><NOBR>" + str +"</NOBR></b></span></td></tr></table>";}

%>

<%

User user = null;
if (  (user = User.authorize(orgnum, Systemroles.SYSTEMANALYST,application,session,request, response, "userrdaps.jsp", true)) == null|| !Toolbox.verifytoken(request))
    return;
orgnum=user.orgnum;
if ( (user = User.dbauthorize(application,session,request, response, "userrdaps.jsp", false)) == null)
{
     out.print("You have no database now. A system analyst  should have one. Ask the System Administrator to create one for you");
     return;
}
 
long tstmp = System.currentTimeMillis()%10000000;
String subdb = Toolbox.defaultParam(orgnum,request, "subdb", user.id, null, 30);
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum ); //user.dbinfo);

if (adapter.error().length() > 0)
{
    adapter.close();
    User.dberrorRelogin(application,session,request,response,"userrdaps.jsp");
    return;
}
if (Systemroles.roles==null || Systemroles.roles[0] == null || Systemroles.roles[0][0] == null ||Systemroles.roles.length >0 && Systemroles.roles[Systemroles.roles.length-1] == null || Systemroles.roles.length >0 && Systemroles.roles[Systemroles.roles.length-1][0] == null)
{
    JDBCAdapter adapter0 = Toolbox.getSysAdapter(orgnum);
    Systemroles.readRoles(adapter0);
    adapter0.close();
} //user.dbinfo);
String rdapfields = "name,title, query, insertQuery, updateQuery, deleteQuery,webService, format,help,roles, insertroles, updateroles, deleteroles,jscript,preop,postop,options,permits";
String sql = "";
String mode =   Toolbox.defaultParam(orgnum,request, "mode", null, "#", 12);
String initone =   Toolbox.defaultParam(orgnum,request, "initone", null, null, 12);
String style = "font-size:" + cachedstyle.fontsize + "px;width:" + (Toolbox.charwidthrate()*cachedstyle.fontsize) + "px";
StringBuffer labelbuf = new StringBuffer(); 
if (mode == null || mode.equals("new") || mode.equals("search"))
{
%>

<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head> 
<%=Toolbox.getMeta(orgnum)%>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("userrdaps.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript"   src=findrep.js></script>
<title> <%= Toolbox.emsgs(orgnum,1066) %> </title>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
<link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
 
<%
String thisdb="";
if (user.mydb &&  DBAdmin.server2admin(user.getDBConnectInfo().server) == null)
   thisdb = "&subdb=" + user.id +"&cdrdap=1";
String tk = Toolbox.defaultParam(orgnum,request, ("rdap"), null);
tk = Toolbox.validate(tk, null, 20);
String tastyle= "Times New Roman;"+ cachedstyle.fontsize;


%>
<style type="text/css">
body {background-color:<%=cachedstyle.DBGCOLOR%>;margin:6px 6px 0px 6px}
form {margin:5px 0px 0px 0px}
.thehint{background:#DDDDAA;border:1px solid #991020;color:green;font-size:16px;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>}
td.fixed {font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:<%=cachedstyle.fontsize%>px;width:<%=(int)Math.ceil(cachedstyle.fontsize*Toolbox.charwidthrate())%>px}
td,table,tr,td.fixed {font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:<%=cachedstyle.fontsize%>px}
select {font-family:<%=tastyle.replaceFirst(";",";font-size:")%>px;border:1px #b0b0b0 solid}
textarea {font-family:<%=tastyle.replaceFirst(";",";font-size:")%>px;border:1px #b0b0b0 solid; font-family:courier}
input.box {font-family:<%=tastyle.replaceFirst(";",";font-size:")%>px;border:1px #b0b0b0 solid}

</style>
<%
String err = "";
boolean bb = adapter.executeQuery2("select lastupdate," + rdapfields +"  from  Task where not format='Merge' and not format='Web'  order by name",false); 
int nt;
if (bb == false)
{
     err = adapter.error();
     Toolbox.print(1,err);
     nt = 0;
}
int numrdaps; 
String dbn = adapter.dbname();
int l =dbn.lastIndexOf("/");
dbn = dbn.substring(l+1).replaceFirst("\\?.*$", "");
%>


<script type="text/javascript"    src=hints.js></script>
</head>
<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px"  >
<%=Toolbox.title( Toolbox.emsgs(orgnum,1066))%>
 
<form rel=opener name="thisform" METHOD="POST" action=DataTable onsubmit="return validate()"  style="margin:0px 0px 0px 0px"  >
 <center><table cellspacing=0 cellpadding=3  align=center style="margin:4px 0 4px 0">
<tr> <td  align=center>
<!--input   style="<%=style%>" class="GreenButton" type="button"  name="submit1"     value="<%=Toolbox.emsgs(orgnum,226)%>"  onclick="javascript:new1()"
><input  style="<%=style%>" class="GreenButton"  TYPE="Button" NAME="submit7"     value="<%=Toolbox.emsgs(orgnum,37)%>"   onclick="javascript:search()"
--><input  style="<%=style%>;width:<%=2*cachedstyle.fontsize%>px" class="GreenButton"  TYPE="Button" NAME="submi1t12"   value="<"                      onclick="javascript:next(-1)"
><input  style="<%=style%>;width:<%=2*cachedstyle.fontsize%>px" class="GreenButton"  TYPE="Button" NAME="submi1t11"   value=">"                       onclick="javascript:next(1)"
<% if (thisdb.equals("")){%>><input  style="<%=style%>" class="GreenButton"  TYPE="Button" NAME="submit20"    value="<%=Toolbox.emsgs(orgnum,960)%>"  onclick="javascript:display()"
<%}%>><input  style="<%=style%>" class="GreenButton"  type="button" name=test          value=<%=Toolbox.emsgs(orgnum,975)%>    onclick=javascript:verify()
><input  style="<%=style%>" class="BlueButton"  TYPE="button" NAME="submit0"     value="<%=Toolbox.emsgs(orgnum,33)%>"  onclick="javascript:exec()"
><input  style="<%=style%>" class="OrangeButton"  TYPE="Submit" NAME="submit3"     value="<%=Toolbox.emsgs(orgnum,36)%>" onclick="javascript:save()"
><input  style="<%=style%>" class="GreenButton"  TYPE="button" NAME="submit2"     value="<%=Toolbox.emsgs(orgnum,35)%>" onclick="javascript:saveAs()"
><input  style="<%=style%>" class="GreenButton"  TYPE="Button" NAME="submit4"     value="<%=Toolbox.emsgs(orgnum,923)%>" onclick="javascript:buildURL()"
><input  style="<%=style%>" class="RedButton"   TYPE="button" NAME="submit10"    value="<%=Toolbox.emsgs(orgnum,30)%>" onclick="javascript:deletet()"
><input  style="<%=style%>;display:none" class="GreenButton"  TYPE="button" name=submit9    value=Setting    onclick=javascript:setting()
><input  style="<%=style%>" class="GreenButton"  TYPE="button" NAME="submit6"     value="<%=Toolbox.emsgs(orgnum,32)%>" onclick="javascript:showhelp()"
><input name=subdb type=hidden value="<%=(user.subdb==null)?"":user.subdb%>">
</td></tr>
 </table></center>
 <script type="text/javascript" >document.write(round1('100%'));</script>
 <table cellpadding=0 cellspacing=1 width=100% class=outset3 align=center border="0">
  <tr>
  <td   class=fixed ><%=fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,67), orgnum, cachedstyle)%></td>
  <td colspan="2">
  <select name="rdap" style="width:200px"  onchange="javascript:fill()" >
  <option value="Unnamed" selected><%=Toolbox.emsgs(orgnum,935)%></option>
  </select>
  </td>
  <td  class=fixed  ><%=fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,15), orgnum, cachedstyle)%></td>
  <td colspan="2" > <input name="title" class=box style=width:200px ></td>
  <td align=left>
  <input name="old" class=box style="background-color:<%=cachedstyle.TBGCOLOR%>;color:#aaaaaa"  onblur="textboxhint(this,1,'<%=Toolbox.emsgs(orgnum,1247)%>')" onfocus="textboxhint(this,0)" size=12>
  </td>
  <td align=left  >
  <input type=button  style="<%=style%>" class="GreenButton"  name=btn1 value="<%=Toolbox.emsgs(orgnum,1113)%>" onclick="relarge();findstrintextarea1(document.thisform.old.value)">
  </td>


  <td  class=fixed ><%=fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,173), orgnum, cachedstyle)%></td><td><div onmouseover="showmyhint(15)" onmouseout="hidemyhint()"><a href="javascript:dbinfo1()"> <%=dbn%></a> 
  |<a href=switchdb.jsp?page=userrdaps.jsp><%=Toolbox.emsgs(orgnum,936)%></a> </div></td>
</tr>
<tr>

<td class=fixed ><%=fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,1115), orgnum, cachedstyle)%></td>
<td align=left><input name="jscript" class=box size=8></td>
<td class=fixed  aling=right><%=fields(labelbuf, cachedstyle.fontsize,Toolbox.emsgs(orgnum,1116), orgnum, cachedstyle)%></td> 
<td align=left><input name="preop"  class=box size=8></td>
<td class=fixed  aling=right><%=fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,1117), orgnum, cachedstyle)%></td>
<td align=left><input name="postop" class=box size=6></td>

 <td >
  <input name=newone class=box   class=box style="background-color:<%=cachedstyle.TBGCOLOR%>;color:#aaaaaa"  onblur="textboxhint(this,1,'<%=Toolbox.emsgs(orgnum,34)%>')" onfocus="textboxhint(this,0)" size=12>
  </td>
  <td align=left>
  <input type=button   style="<%=style%>" class="OrangeButton"  name=btn2 value="<%=Toolbox.emsgs(orgnum,1114)%>" onclick="replacestrintextarea(document.thisform.newone.value)">
  </td>

<td  class=fixed ><%=fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,21), orgnum, cachedstyle)%></td>
<td>
<select name="format" style="width:150px;" tabindex="2">
<option value="" selected><%=Toolbox.emsgs(orgnum,499)%></option>    
<option value="Table" ><%=Toolbox.emsgs(orgnum,22)%></option>
<option value="Form" ><%=Toolbox.emsgs(orgnum,23)%></option>
<option value="LongForm" ><%=Toolbox.emsgs(orgnum,26)%></option>
<option value="HTML" >HTML <%=Toolbox.emsgs(orgnum,22)%></option>
<option value="FormHTML" >HTML<%=Toolbox.emsgs(orgnum,23)%></option>
<option value="Text" ><%=Toolbox.emsgs(orgnum,24)%></option>
<option value="LaTex">LaTex</option>
<option value="XML" >XML</option>
<option value="CSV" >CSV</option>
<option value="Picker" ><%=Toolbox.emsgs(orgnum,25)%></option>
<option value=Update><%=Toolbox.emsgs(orgnum,29)%></option>
<option value=Search><%=Toolbox.emsgs(orgnum,37)%></option>
<option value=Web>Web<%=Toolbox.emsgs(orgnum,23)%></option>
 
</select>
</td>
</tr>

<tr>
<td class=fixed valign=top><%=fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,27), orgnum, cachedstyle)%>
    <a href="javascript:tables()"><%=Toolbox.emsgs(orgnum,38)%></a>
    
<!--input name=temp0 class=buttonstyle style=background-color:#00BBBB   type=submit value="<%=Toolbox.emsgs(orgnum,38)%>"  onclick="javascript:tables()"><br>
<input name=temp1 class=buttonstyle style=background-color:#00BBBB   type=button value="Convert" onclick="convert()"><br>
<input name=temp2 class=buttonstyle style=background-color:#00BBBB   type=button value="Heading" onclick="translate()"><br>
<input name=temp4 class=buttonstyle style=background-color:#00BBBB   type=button value="Fields" onclick="getfields(labelbuf,cachedstyle.fontsize,, orgnum)"><br>

<input name=temp3 class=buttonstyle style=background-color:#00BBBB   type=button value="Tranword" onclick="openWindow('trans.jsp','trans')"--></td>
<td valign=top colspan=7 ><textarea onfocus="javascript:large(this,0,5)" onblur="checksyntax(0)"  onkeypress="return alarge(this,event,0)"  rows="5" name="query"   cols="55"  ><%=err%></textarea></td>
<td  class=fixed  valign=top><%=fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,1057), orgnum, cachedstyle)%>

<input type=button  style="<%=style%>" class="GreenButton"  name=btn3 onclick="userlevel()" value="<%=Toolbox.emsgs(orgnum,1283)%>" >
</td><td valign=top>
<select size=5 style=width:150px name=rolesel multiple=true   onchange=trans(this,document.thisform.roles)>
</select><input name=roles type=hidden>
</td>
</tr>

<tr>
<td   class=fixed    valign=top><%=fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,28), orgnum, cachedstyle)%>

<input name=temp2  style="<%=style%>" class="GreenButton"  type=button width=60 value="<%=Toolbox.emsgs(orgnum,1093)%>" onclick="insertupdate()"> </td>
<td   valign=top colspan=7 ><textarea onfocus="javascript:large(this,1,6)"  onblur="checksyntax(1)"  onkeypress="return alarge(this,event,1)" name="insertQuery"  cols="55" rows=5  ></textarea></td>
<td   class=fixed  valign=top><%=fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,1058), orgnum, cachedstyle)%></td><td valign=top>
<select style=width:150px name=insertrolesel multiple=true size=5 onchange=trans(this,document.thisform.insertroles)>
</select>  <input name=insertroles type=hidden>
</td>
</tr>

<tr>
<td   class=fixed    valign=top><%=fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,29), orgnum, cachedstyle)%>

<input name=temp3  style="<%=style%>" class="GreenButton"  type=button width=60 value="<%=Toolbox.emsgs(orgnum,1093)%>" onclick="defaultupdate()"> </td>
<td valign=top colspan=7><textarea onfocus="javascript:large(this,2,6)"  onblur="checksyntax(2)"   onkeypress="return alarge(this,event,2)" name="updateQuery"  cols="55" rows=5  ></textarea></td>
<td class=fixed  valign=top><%=fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,1059), orgnum, cachedstyle)%></td>
<td valign=top><select style=width:150px  name=updaterolesel multiple=true  size=5  onchange=trans(this,document.thisform.updateroles)>
</select>  <input name=updateroles type=hidden>
</td>
</tr>
<tr>
<td   class=fixed   valign=top><%=fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,1090), orgnum, cachedstyle)%>

<input name=temp4   style="<%=style%>" class="GreenButton"   width=60 type=button value="<%=Toolbox.emsgs(orgnum,30)%>" onclick="defaultdelete()"> </td>
<td   valign=top colspan=7><textarea onfocus="javascript:large(this,3,4)"  onblur="checksyntax(3)"   onkeypress="return alarge(this,event,3)" rows="4" name="deleteQuery"   cols="55"  ></textarea></td>
<td   class=fixed  valign=top> <%=fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,1060), orgnum, cachedstyle)%></td><td valign=top>
  <select style=width:150px name=deleterolesel multiple=true size=4   onchange=trans(this,document.thisform.deleteroles)>
</select> <input name=deleteroles type=hidden>
</td>
</tr>


<tr>
    <td  class=fixed   valign=top><%=fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,1456), orgnum, cachedstyle)%> 
<input name=temp3  style="<%=style%>" class="GreenButton"  type=submit width=60 value="<%=Toolbox.emsgs(orgnum,642)%>" onclick="attr()">
</td>
<td  valign=top colspan=7><textarea onfocus="javascript:large(this,4,5)"  onblur="checksyntax(4)"   onkeypress="return alarge(this,event,4)" rows="4" name="help" cols="55"  ></textarea></td>
<td  class=fixed   valign=top><%=fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,31), orgnum, cachedstyle)%>

<a href="javascript:picktool()"><%=Toolbox.emsgs(orgnum,760)%></a>
</td><td>
<textarea rows="5" name="webService" style=width:150px onfocus="javascript:large(this,5,5)"  onblur="checksyntax(5)"   onkeypress="return alarge(this,event,4)"></textarea>
</td>
</tr>
</table>
<script type="text/javascript" >document.write(round2);</script>
<table cellspacing=4 cellpadding=0 align=center>

<tr >
<td  align=center   style="color:<%=cachedstyle.IBGCOLOR%>;font-size:12px" >
  <nobr> <%= Toolbox.copyright[orgnum>>16]%> </nobr>
</td>
</tr></table>

<input type=hidden name=mode>
<input type=hidden name=rdappostop value=repository >
<input type=hidden name=options value="" >
<input type=hidden name=oldrdap value="" >
<input type=hidden name="securitytoken" value="<%=Toolbox.gentoken("userrdaps.jsp","thisform")%>" >
</form>
<div id="edittool" style="margin:0px 0px 0px 0px;position:absolute;visibility:hidden;border:1px #b0b0b0 outset;z-index:3">
  <form rel=opener name="ftt"  ><table cellpadding="1" cellspacing="0">
  <tr><td>
  <input name="old" class=box  class=box style="background-color:<%=cachedstyle.TBGCOLOR%>;color:#aaaaaa"  onblur="textboxhint(this,1,'<%=Toolbox.emsgs(orgnum,1247)%>')" onfocus="textboxhint(this,0)" size=12>
  </td> <td align=left>
  <input type=button  style="<%=style%>" class="GreenButton"  name=btn1 value="<%=Toolbox.emsgs(orgnum,1113)%>" onclick="relarge();findstrintextarea1(document.ftt.old.value)">
  </td>
  </tr>
  <tr>
  <td >
  <input name=newone class=box  class=box style="background-color:<%=cachedstyle.TBGCOLOR%>;color:#aaaaaa"  onblur="textboxhint(this,1,'<%=Toolbox.emsgs(orgnum,34)%>')" onfocus="textboxhint(this,0)" size=12>
  </td> <td align=left>
  <input type=button   style="<%=style%>" class="OrangeButton"  name=btn2 value="<%=Toolbox.emsgs(orgnum,1114)%>" onclick="replacestrintextarea(document.ftt.newone.value)">
  </td>
  </tr>
  </table>
  <input type=hidden name="securitytoken" value="<%=Toolbox.gentoken("userrdaps.jsp","ftt")%>" >
  </form>
</div>
<iframe name="w<%=tstmp%>" width="1" height="1"></iframe>
</body>
  <script type="text/javascript"  src=queryparse.js></script>
<script type="text/javascript" >
  
var tstmp = <%=tstmp%>;
var subdb = "<%=subdb%>";
var sysrdaps = [<%
if (null == DBAdmin.server2admin(user.getDBConnectInfo().server) )
{
    Set<String> e = Generic.storedProc.keySet();
  for (String nm: e)
   out.print("\"" + nm +"\",");
}
%>''];
function dbinfo1()
{
   myprompt('<nobr>Server: <%=user.dbinfo.server.replaceAll("\\\\","/")%></nobr><br><nobr>Driver: <%=user.dbinfo.driver%></nobr>',null,null);
}
var allroles = <%=Arrays.toString(Systemroles.roles[orgnum>>16]).replaceAll(", null","").replaceAll(", ","\",\"").replaceFirst("\\[","[\"").replaceFirst("\\]","\"]")%>; 
var rdapin = "<%=(tk==null)?"":tk%>";
var theurl = "<%=Toolbox1.geturl(request)%>"; 
var browser = "<%=Toolbox.browser(request)%>";
var encoding='<%= encoding%>';
var langcode = "<%= Toolbox.langs[orgnum>>16]%>";
var font_size = <%=cachedstyle.fontsize%>;
var thisdb = '<%=thisdb%>';
var iamsystemadmin = <%=(user.roles & Systemroles.SYSTEMADMIN) > 0%>;

var hints = new Array();
var allabels = ['<%=labelbuf%>'];
var permitstr = '<%=Toolbox.emsgs(orgnum,1283)%>';
var msg29 = "<%= Toolbox.emsgs(orgnum,29)%>";
var msg1090 = "<%= Toolbox.emsgs(orgnum,1090)%>";
var msg1332 = "<%= Toolbox.emsgs(orgnum,1332)%>";
var msg797 = "<%= Toolbox.emsgs(orgnum,797)%>";
hints[15] = '<%=adapter.url()%>';

var names = new Array();
var titles = new Array();
var jscripts = new Array();
var preops = new Array();
var postops = new Array();
var querys = new Array();
var insertQuerys =  new Array();
var updateQuerys =  new Array();
var deleteQuerys =  new Array();
var webServices =  new Array();
var formats =  new Array();
var helps =  new Array();
var roles =  new Array();
var insertroles =  new Array();
var updateroles =  new Array();
var deleteroles =  new Array();
var options =  new Array();
var fieldnames = new Array();
var permits = new Array();
 
var bufferedaction = "";
var lastupdates = new Array();

<%
int sqlsn = 0; 
String sqla[] = new String[1000];
 
for (int i = 1;  ; i++)
{
    String [][] zz = new String[100][];
     
    String tt =  adapter.getValueAt(i-1,0);
    if (tt == null) 
    {
        nt = i-1;
        numrdaps = i;
%>var nq = <%= nt %>;
var numrdaps = <%=numrdaps%>;
var N = <%=numrdaps+20%>;
<%
        break;
    }
    out.println("lastupdates["+i+"]=" +tt +";");
    
    tt =  adapter.getValueAt(i-1,1);
    out.println("names["+i+"]=\"" + Generic.handle(tt) +"\";");
    String rdap = trim(tt);
    tt =  adapter.getValueAt(i-1,2);
    out.println("titles["+i+"]=\"" + Generic.handle(tt) +"\";");

    tt = adapter.getValueAt(i-1,3); if (tt == null) tt = "";
    out.println("querys["+i+"]=\"" + Generic.handle(tt) +"\";");
    Webform wf = new Webform("zzz","zzz",tt, "","","","","",adapter.getValueAt(i-1,8),1,1,1,1,"","","","");
    wf.parseQuery(); 
    String [] fields = wf.fields;
    tt = adapter.getValueAt(i-1,4); if (tt == null) tt = "";
    out.println("insertQuerys["+i+"]=\"" + Generic.handle(tt) +"\";");
     
     
    
    /*
    int m = 0;
    for (; m < 100; m++)
        zz[m] = new String[5];
    m = 0;
    
    {
        defaultstr = trim(defaultstr);
        
        if (defaultstr!=null && defaultstr.equals("") == false)
        { 
            
            String vs[] = defaultstr.split("\n");
            for (int l =0; l < vs.length; l++)
            {
                vs[l] = trim(vs[l]);
                if (vs[l] == null) continue;
                int ll = vs[l].indexOf("=");
                if (ll==-1 || ll == vs[l].length()-1)
                    continue;
                String xx[] = new String[2];
                xx[0] = vs[l].substring(0,ll);
                xx[1] = vs[l].substring(ll+1);
                zz[m][0] = trim(xx[0]);
                zz[m][1] = trim(xx[1]).indexOf("!")==0?"1":"";
                zz[m][2] = trim(xx[1]).replaceFirst("^!","");
                m++;
            } 
        } 
    }
    */  
    tt = adapter.getValueAt(i-1,5); if (tt == null) tt = "";
    out.println("updateQuerys["+i+"]=\"" + Generic.handle(tt) +"\";");

    tt = adapter.getValueAt(i-1,6); if (tt == null) tt = "";
    out.println("deleteQuerys["+i+"]=\"" + Generic.handle(tt) +"\";");

     tt = adapter.getValueAt(i-1,7); if (tt == null) tt = "";
    out.println("webServices["+i+"]=\"" + Generic.handle(tt) +"\";");

    tt = adapter.getValueAt(i-1,8); if (tt == null) tt = "Table";
    out.println("formats["+i+"]=\"" + Generic.handle(tt) +"\";");

     tt = trim(adapter.getValueAt(i-1,9));  if (tt == null) tt = "";
    out.println("helps["+i+"]=\"" + Generic.handle(tt) +"\";");
    
    /*
   
    if ( !trim(tt).equals("") && fields!=null && fields.length > 0 && !adapter.getValueAt(i-1,8).equals("Web"))
    {
        CSVParse parse = new CSVParse(tt, '\'', new String[]{",","\r\n"}); 
    String [][] a = parse.nextMatrix(true);
    for (int j=0; j < a.length; j++)
    {
        String fd = a[j][0];
        if (fd == null ) continue;
        int k = 0; 
        while (k < fields.length && (fields[k]==null ||  !fields[k].toLowerCase().equals(fd.replaceAll(" ","").toLowerCase())))
            k++;
        if (k < fields.length)
        {
             
             a[j][0] = fields[k];
             for (int z=j+1; z < a.length; z++)
             {
                  if (a[z][0] == null)continue;
                  if (fields[k].toLowerCase().equals(a[z][0].replaceAll(" ","").toLowerCase()))
                  {
                     
                      for (int l=1; l < 5; l++) 
                      if ( (a[j][l]==null || a[j][l].equals("")) && a[z][l]!=null && !a[z][l].equals(""))
                          a[j][l] = a[z][l];
                      a[z][0] = null;
                  }
             }
        }
        else 
        {
             
          
            a[j][0] = null;
        }
    }
     
    String help = "";
    for (int j=0; j < a.length; j++)
    {
        if (a[j][0] == null) continue; 
        for (int k=0; k < a[j].length; k++)
        {
             help += round(a[j][k]);
             if (k < 4) 
                 help += ",";
             else  
                 help += "\n"; 
        }
    }
    help = help.replaceFirst("\n$","");
    if (!help.equals(tt)) sqla[sqlsn++] = "UPDATE Task  set help='" + help.replaceAll("'", "''") + "' WHERE name='" + rdap + "'";
    }
     
    if (tt.equals("") == false)
    {
        Pattern p = Pattern.compile("\n[^:]+:");
        int k = 0, l=0;
        tt = "\n" + tt;
        Matcher mt = p.matcher(tt); 
        Vector<String> vv = new Vector();
        while ( mt.find(k))
        {
            int s = mt.start();
            if (k>0) vv.addElement(trim(tt.substring(k,s)));
            int e = mt.end();
            String xx = trim(tt.substring(s,e).replace(':',' '));
           
            vv.addElement(xx);
            k = e;
        }
        vv.addElement(trim(tt.substring(k)));
        for (int r =0; r < vv.size()/2; r++)
        {
            String xx[] = new String[2];
            xx[0] = trim(vv.elementAt(2*r));
            xx[1] = trim(vv.elementAt(2*r+1));
            if (xx.length < 2 || xx[0]==null || xx[1] == null) continue;
            int s=0;
            
            while (s < m && !zz[s][0].equals(xx[0])) s++;
            
            if (s < m) 
            {
                zz[s][4] =  xx[1];
            }
            else if (m < zz.length)
            {
                zz[m][0] =  xx[0];
                zz[m][4] =  xx[1];
                m++;
            }
             
        } 
    }
    
    if (m > 0)
    {
        String x = "";
        for (int s=0; s < m; s++)
        {
            try{
            x += zz[s][0]  + "," + round(zz[s][1]) + "," + round(zz[s][2]) + "," + round(zz[s][3])+ "," + round(zz[s][4]);
            if (s < m-1) x += "\n";
            }catch(Exception e){ }
        }
        
        sqla[sqlsn++] = "UPDATE Task  set help='" + x.replaceAll("'", "''") + "' WHERE name='" + rdap + "'";
    }
            */
    tt = adapter.getValueAt(i-1,10);  if (tt == null) tt = "0";
    out.println("roles["+i+"]=" + tt  +";");

     tt = adapter.getValueAt(i-1,11);  if (tt == null) tt = "0";
    out.println("insertroles["+i+"]=" + tt  +";");
    tt = adapter.getValueAt(i-1,12);  if (tt == null) tt = "0";
    out.println("updateroles["+i+"]=" + tt  +";");

    tt = adapter.getValueAt(i-1,13);  if (tt == null) tt = "0";
    out.println("deleteroles["+i+"]=" + tt  +";");
    //name,title, query, insertQuery, updateQuery, deleteQuery,webService, format, help,   roles, insertroles, updateroles, deleteroles,jscript,preop,postop,options,perpmits
   tt =  adapter.getValueAt(i-1,14);
    if (tt==null)tt="";
    out.println("jscripts["+i+"]=\"" + Generic.handle(tt) +"\";");

    tt =  adapter.getValueAt(i-1,15);if (tt==null)tt="";
    out.println("preops["+i+"]=\"" + Generic.handle(tt) +"\";");

    tt =  adapter.getValueAt(i-1,16);if (tt==null)tt="";
    out.println("postops["+i+"]=\"" + Generic.handle(tt) +"\";");
    
    tt = adapter.getValueAt(i-1,17);
    if (tt == null || tt.equals("")==false && tt.charAt(0)!='&')
        tt = "";
    out.println("options["+i+"]='" + tt  +"';");
    
    tt = adapter.getValueAt(i-1,18);
    if (tt == null)
        tt = "";
    out.println("permits["+i+"]='" + tt  +"';");
    
}
 
out.println("var dbms='" + adapter.dbInfo().substring(0,15).replace('\n',' ') + "';");
try{adapter.transacte(sqla, 0, sqlsn);}catch(Exception e1){} 
adapter.close();
%>

var newlabel = textmsg[406];
var toolmsg960 = "<%=Toolbox.emsgs(orgnum,960)%>",toolmsg990 = "<%=Toolbox.emsgs(orgnum,990)%>", toolmsg924="<%=Toolbox.emsgs(orgnum,924)%>";
var toolmsg33 = "<%=Toolbox.emsgs(orgnum,33)%>",toolmsg37 = "<%=Toolbox.emsgs(orgnum,37)%>";
var toolmsg38 = "<%=Toolbox.emsgs(orgnum,38)%>",toolmsg36 = "<%=Toolbox.emsgs(orgnum,36)%>";

var encoding1 = "<%= encoding %>";
var langcode1 = "<%= Toolbox.langs[orgnum>>16]%>";
<%=Toolbox.msgjspout((orgnum%65536)+user.id, true) %>
</script>
<script type="text/javascript"    src=userrdaps.js></script>
<script type="text/javascript"    src=curve.js></script>

</html>
<%
return;
////////////////////////////////// END of front-end
}
%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>"><head> 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
<link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
</head>
<body  style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:6px 6px 0px 6px" >
<%
String s[]  = rdapfields.split("[ ]*,[ ]*");

String rdap = Toolbox.defaultParam(orgnum,request,"rdap",null,"#|",30);
int n = 1;

if (request.getMethod().equals("GET")) return;
if (mode.equals("new"))
{

}
else if (mode.equals("new"))
{

}
else if (mode.equals("exec"))
{
    adapter.close();
    String passformat = Toolbox.defaultParam(orgnum,request, "format","");
    String err = ""; 
    String query = Toolbox.defaultParam(orgnum,request, "query","");
    
    Webform w = new Webform(user.id + "test",
            Toolbox.defaultParam(orgnum,request, "title",""),
            query,
            Toolbox.defaultParam(orgnum,request, "insertQuery",""),
            Toolbox.defaultParam(orgnum,request, "updateQuery",""),
            Toolbox.defaultParam(orgnum,request, "deleteQuery",""),
            Toolbox.defaultParam(orgnum,request, "webService",""),
            trimcsv(Toolbox.defaultParam(orgnum,request, "help","")),
            passformat,
            Long.parseLong(Toolbox.defaultParam(orgnum,request, "roles","-1")),
            Long.parseLong(Toolbox.defaultParam(orgnum,request, "insertroles","-1")),
            Long.parseLong(Toolbox.defaultParam(orgnum,request, "updateroles","-1")),
            Long.parseLong(Toolbox.defaultParam(orgnum,request, "deleteroles","-1")),
            Toolbox.defaultParam(orgnum,request, "jscript",""),
            Toolbox.defaultParam(orgnum,request, "preop",""),
            Toolbox.defaultParam(orgnum,request, "postop",""),
            Toolbox.defaultParam(orgnum,request, "permits","")
            
            );
            w.parseQuery();
            boolean valid = true;
            


            if ( w.format.equals("Table") || w.format.equals("Form") || w.format.equals("LongForm") || w.format.equals("Picker"))
             {
             String x[] = new String[2];
             String y[] = new String[2];
             String z[] = new String[2];
             if (
            (w.updateQuery.equals("")|| w.compile(w.updateQuery, x, false)) &&
            (w.insertQuery.equals("")|| w.compile(w.insertQuery, y, true )) &&
            (w.deleteQuery.equals("")|| w.compile(w.deleteQuery, z, false)) )
             {
                w.updateQuery = x[0];
                w.insertQuery = y[0];
                w.deleteQuery = z[0];
                if ( x[1] != null || y[1] !=null || z[1] != null)
                {
                    Generic.storedProc.remove(w.name+"$");
                    Generic.storedProc.put( w.name+"$", new Webform( w.name+"$",w.title,null,y[1],x[1],z[1],null,null,"Update",w.roles, w.insertroles, w.updateroles, w.deleteroles,"","",w.postop, w.permits));
                }
                Generic.storedProc.remove(w.name);
                Generic.storedProc.put(w.name, w);
             }
             else
             {
                 err = w.error();
                 valid = false;
             }
           }
           else
           {
               Generic.storedProc.remove(w.name);
               Generic.storedProc.put(w.name, w);
           }

           if (valid)
           {
              
              session.removeAttribute("savedDBRequest");
              RequestDispatcher dispat = getServletConfig().getServletContext().getRequestDispatcher("/Data" + passformat +"?rdap=" + user.id + "test&subdb=" + subdb  );
              dispat.forward(request, response);
               
           }
           else
           {
               out.println(Toolbox.title( Toolbox.emsgs(orgnum,75)));
               out.println(err +"<br><br>" +  query );
           }
           sql = "";
}
else if (mode.equals("insert"))
{
   if (rdap!=null)
   {

   out.println(Toolbox.title( Toolbox.emsgs(orgnum,777)));
   String fs="lastupdate,name";
   String vs= "" + (System.currentTimeMillis()/1000)
                 + ",'" + rdap.replaceAll("'","''")+"'";
   String permitv = "";
   if (Toolbox.defaultParam(orgnum,request, "rolesel","").equals("-1")) 
      permitv += ",1+*";
   if (Toolbox.defaultParam(orgnum,request, "insertrolesel","").equals("-1")) 
      permitv += ",2+*";
   if (Toolbox.defaultParam(orgnum,request, "updaterolesel","").equals("-1")) 
      permitv += ",3+*";
   if (Toolbox.defaultParam(orgnum,request, "deleterolesel","").equals("-1")) 
      permitv += ",4+*";
   if (!permitv.equals("")) 
      permitv = permitv.substring(1);   
   for (int i=1; i < s.length-2; i++)
   {
    fs +="," + s[i];
    if (s[i].indexOf("roles")>=0)
    {
        String y = Toolbox.defaultParam(orgnum,request,s[i],"0");
        vs += ","+ y;
    }
    else
       vs += ",'" + Toolbox.defaultParam(orgnum,request,s[i],"").replaceAll("'","''")+"'";
   }
   String oldrdap = Toolbox.defaultParam(orgnum,request,"oldrdap","");
   
   if (oldrdap.equals(""))
     sql = "INSERT INTO Task(" + fs +",permits) VALUES (" + vs +",'" + permitv + "')";
   else
     sql = "INSERT INTO Task(" + fs +",permits) SELECT " + vs +",Task.permits FROM Task WHERE name='" + oldrdap +"'";
   }
}
else if (mode.equals("update"))
{
   if (rdap!=null)
   {

   out.println(Toolbox.title( Toolbox.emsgs(orgnum,777)));
   sql = "UPDATE Task SET lastupdate=" + (System.currentTimeMillis()/1000);
   for (int i=1; i < s.length-1; i++)
   {
     sql +=",";
     if (s[i].indexOf("roles")>=0)
       sql += (s[i] +"=" + Toolbox.defaultParam(orgnum,request,s[i],"0"));
     else
       sql += (s[i] +"='" + Toolbox.defaultParam(orgnum,request,s[i],"").replaceAll("'","''")+"'");
   }
   sql += (" WHERE name='" + rdap.replaceAll("'","''")+"'");
 
   }
}
else if (mode.equals("delete"))
{
   if (rdap!=null)
   {
   out.println(Toolbox.title( Toolbox.emsgs(orgnum,777)));
   String sqls[] = { "DELETE FROM Task WHERE name='" + rdap.replaceAll("'","''")+"'",
    "DELETE FROM TaskLang WHERE language='" + langcode + "' AND rdapname='" + rdap.replaceAll("'","''") + "'"};
   adapter.transacte1(sqls, 0,2);
    
   out.println("<script>parent.blankthis();</script>");
   }
   sql = "";

}
else if (mode.equals("regex"))
{
   if (rdap!=null)
   {
       String help =  Toolbox.defaultParam(orgnum,request, "help", "");
       String format =  Toolbox.defaultParam(orgnum,request, "format", "");
     //  help =  help.replaceAll("[ ]+,", ",");
       String query =  Toolbox.defaultParam(orgnum,request, "query", "");
       Webform wf = new Webform("zzz","zzz",query, "","","","","",format,1,1,1,1,"","","","");
       wf.parseQuery(); 
       
       CSVParse parse = new CSVParse(help, '\'', new String[]{",","\r\n"}); 
       String [][] x = parse.nextMatrix(true);
      
       adapter.executeUpdate("DELETE FROM Taskopt");
       if (x!=null && trim(help).equals("") == false)
       {
           int jj = 1;
           
           //sqls[0] = "DELETE FROM Taskopt";
           for (int i=0; i < x.length; i++)
           {  
               if (x[i] ==null ||  x[i].length == 0)continue;
              
               for (int l=0; l < x[i].length; l++) 
                   if (x[i][l]==null) 
                       x[i][l] = "";
                   else
                       x[i][l] = trim(x[i][l]);
               int min=1000, l=0;
               for (int k=0; k < wf.fields.length; k++)
               {
                   int m = Math.abs(trim(wf.fields[k].toLowerCase()).compareTo(trim(x[i][0].toLowerCase())));
                   if (m < min)
                   {
                       l = k; min = m; 
                   }
               }
               String x1 = ""; if (x[i].length>1) x1 = x[i][1];
               String x2 = ""; if (x[i].length>2) x2 = x[i][2];
               String x3 = ""; if (x[i].length>3) x3 = x[i][3];
               String x4 = ""; if (x[i].length>4) x4 = x[i][4];
              
               String xx = "INSERT INTO Taskopt (lastupdate,col, required, initvalue, regex, help) VALUES (" + i + ",'" + wf.fields[l] + "'," + ((x1.equals("")||x1.equals("0"))?0:1) + ",'" + x2.replaceAll("'", "''") + "','" + x3.replaceAll("'", "''")+ "','" + x4.replaceAll("'", "''") + "')";
              
               int ll=adapter.executeUpdate(xx);
             
           }
       }
        else
           { 
               for (int i=0; i < wf.fields.length; i++)
               {
                   String xx = "INSERT INTO Taskopt (lastupdate,col, required, initvalue, regex, help) VALUES (" + i + ",'" + wf.fields[i] + "',0,'','','')";
                  
                   adapter.executeUpdate(xx);
               }
                   
           } 
           out.println(adapter.error() + "<script>parent.getattr(" + x.length + ");</script>");
        
   }
}
else 
{

    out.println(Toolbox.title( Toolbox.emsgs(orgnum,777)));
    sql = "";

}

if (sql.equals("")==false)
{

   n = adapter.executeUpdate(sql);
   if (n != 1 || rdap==null)
   {
      out.println("Error:" +  adapter.error());
   }
   else
   {
   String oldrdap = Toolbox.defaultParam(orgnum,request,"oldrdap","");
  
   if ( mode.equals("insert") &&  !oldrdap.equals(""))
   {
       String fields = "lastupdate,rdapname,fieldlabels,ctypes,orders,title,help,keywords,defaultv,language";
       for(int j=0; j < Toolbox.langs.length; j++)
       {
       sql = "INSERT INTO TaskLang"
           + "(" + fields +") SELECT "
           + fields.replaceFirst("rdapname","'" + rdap +"'") +" FROM TaskLang"
           + " WHERE  rdapname='" + oldrdap +"' AND language='" + Toolbox.langs[j] + "'";
       int nn = adapter.executeUpdate(sql);
       }

   }
   else if (mode.equals("update"))
   {
       String sql2 = "SELECT permits FROM Task WHERE name='" + rdap.replaceAll("'","''")+"'";
       int nn = adapter.executeQuery(sql2);
       if (nn == 1)
       {
           String permits = adapter.getValueAt(0,0);
           if (Toolbox.defaultParam(orgnum,request, "rolesel","").equals("-1") && !permits.contains("1+*")) 
              permits += ",1+*";
           if (Toolbox.defaultParam(orgnum,request, "insertrolesel","").equals("-1") && !permits.contains("2+*")) 
                permits += ",2+*";
           if (Toolbox.defaultParam(orgnum,request, "updaterolesel","").equals("-1") && !permits.contains("3+*")) 
                permits += ",3+*";
           if (Toolbox.defaultParam(orgnum,request, "deleterolesel","").equals("-1") && !permits.contains("4+*")) 
                permits += ",4+*";
           permits = permits.replace("^,","");
           if (!permits.equals(adapter.getValueAt(0,0)))
           {
               sql2 = "UPDATE Task set permits='" + permits + "' WHERE name='" + rdap.replaceAll("'","''")+"'";
               adapter.executeUpdate(sql2);
           }
       }
   }
           
   out.println("<script type=text/javascript >var i=parent.syn(" + n +");if (i==0);");
    
   if ((user.roles & Systemroles.SYSTEMADMIN) > 0)
   {
      
      out.println("else{var url='follows.jsp?x=repository&rdap='+encodeURIComponent('"  + rdap +"')+'&mode="  + mode +"';");
      out.println("document.location.href=url;}");
   }
   
   out.println("</script>");
   }
}
adapter.close();
%>

</body>
</html>

