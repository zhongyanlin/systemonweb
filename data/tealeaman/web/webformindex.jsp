<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>

<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request, response, "webformindex.jsp", false)) == null)
{
    out.print(Toolbox.emsgs(orgnum,590));
    return;
}
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (adapter.error().length() > 0)
{
    adapter.close();
    User.dberrorRelogin(application,session,request,response,"webformindex.jsp");
    return;
}
CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
String fontsize = Toolbox.defaultParam(orgnum,request, ("fontsize"), null);
fontsize = Toolbox.validate(fontsize, null, 20);
if (fontsize!=null)
{
   int j = adapter.executeUpdate("UPDATE AppUser SET fontsize=" + fontsize + " WHERE id='" + user.id + "'");
   cachedstyle.fontsize = Integer.parseInt(fontsize);
}

DbTable dbtable = new DbTable(adapter,user,"dependency");
dbtable.init();
int i = 0;
long tstmp = System.currentTimeMillis() % 10000000;

%> 
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head>
<%=Toolbox.getMeta(orgnum)%><title><%=Toolbox.emsgs(orgnum,439)%></title> 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<%=Toolbox.unifontstyle(cachedstyle.fontsize,orgnum)%>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("webformindex.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript"  src="formlist<%=(orgnum%65536)%>.js"></script>
<script type="text/javascript"  src=stab.js></script>

<script type="text/javascript" >
 try{
     document.getElementById('formassociated').src = 'formassociated<%=(orgnum)%>.js';
 }catch(e){}
var iamsystemadmin = <%= (user.roles & Systemroles.SYSTEMADMIN) > 0 %>;
var n = z.length;
var menus = [textmsg[1580], '<%=((user.roles & Systemroles.SYSTEMADMIN) == 0)?"":Toolbox.emsgs(orgnum,883)%>', 
   '<%=(user.mydb ||(user.roles & Systemroles.SYSTEMADMIN) != 0)?Toolbox.emsgs(orgnum,481):""%>'];
var m = new Array();
var N = 0;
m[N++] = ["mytool.jsp",textmsg[1581],menus[0],""];
m[N++] = ["webdiv.html",textmsg[1582],menus[0],""];
m[N++] = ["editcss.html",textmsg[1583],menus[0],""];
 
m[N++] = ["DataForm?rdap=systemparameter&extraline=0&subdb=","<%=Toolbox.emsgs(orgnum,922)%>",menus[1],""];
m[N++] = ["cfgdb.jsp","<%=Toolbox.emsgs(orgnum,328)%>",menus[1],""];
m[N++] = ["DataTable?rdap=role&subdb=","<%=Toolbox.emsgs(orgnum,17)%> <%=Toolbox.emsgs(orgnum,16)%>",menus[1],""];
m[N++] = ["DataSearch?rdap=userlist0&subdb=","<%=Toolbox.emsgs(orgnum,823)%>",menus[1],""];
m[N++] = ["DataSearch?rdap=dbowner0&subdb=","<%=Toolbox.emsgs(orgnum,823)%> <%=Toolbox.emsgs(orgnum,173)%>",menus[1],""];
//z[N++] = ["wordform.jsp?mode=1","<%=Toolbox.emsgs(orgnum,1269)%>",menus[1],""];
m[N++] = ["dbinfo.jsp","<%=Toolbox.emsgs(orgnum,434)%>",menus[2],""];
m[N++] = ["dbbackup.jsp","<%=Toolbox.emsgs(orgnum,440)%>",menus[2],""];
m[N++] = ["dbrestore.jsp","<%=Toolbox.emsgs(orgnum,441)%>",menus[2],""];
m[N++] = ["dbparse.jsp","<%=Toolbox.emsgs(orgnum,1240)%>",menus[2],""];
m[N++] = ["datatransfer<%=(user.roles & Systemroles.SYSTEMADMIN)==0?"1":""%>.jsp","<%=Toolbox.emsgs(orgnum,875)%>",menus[2],""];
m[N++] = ["dbdataclear.jsp","<%=Toolbox.emsgs(orgnum,442)%>",menus[2],""];
var act = [textmsg[841],textmsg[842],textmsg[843],textmsg[846],textmsg[844],textmsg[845]];
var acs = ['','s','r','r','u','d'];

function menu(arr)
{
   for (var i=0; i < arr.length; i++)
   {
    if (arr[i]=='') continue;
      document.write("<tr height=22 id=tr + " + i +"><td width=15><a href=javascript:expandmenu(" + i +")><img  width=<%=cachedstyle.fontsize%>    style=\"border:0px\" id=menu" + i +" src=image/menuc.gif></a></td><td  width=15><img  width=<%=cachedstyle.fontsize%>    style=\"border:0px\" id=menud" + i +" src=image/menudc.gif></td><td  colspan=3 valign=center style=color:gold><nobr>" + arr[i] +"</nobr></td></tr>");
   }
}
function forms(arr)
{
   if (typeof cats=='undefined') return ;
   for (var i=0; i < arr.length; i++)
   {
      if (arr[i]=='') continue;
      document.write("<tr  height=22 valign=center id=tr + " + i +"><td  width=15><a href=javascript:expand(" + i +")><img  width=<%=cachedstyle.fontsize%>   style=\"border:0px\" id=sign" + i +" src=image/menuc.gif></a></td><td  width=15><img  width=<%=cachedstyle.fontsize%>     style=\"border:0px\" id=signd" + i +" src=image/menudc.gif></td><td  colspan=3 valign=center style=color:gold><nobr>" + arr[i] +"</nobr></td></tr>");
   }
}
</script>
</head>
<body style="margin:6px 12px 6px 6px;background:<%= cachedstyle.IBGCOLOR %> right url(image/backgd.gif) repeat-y">
<Center>

<%=Toolbox.logtitle(Toolbox.emsgs(orgnum,1287), 210)%>
<form rel=opener name=f1 style="margin:5px 0px 5px 0px"  >
<TABLE id="table1" class=outset   cellpadding=0 cellspacing=0 border="0">

<tr>
<td align=left valign=middle  colspan="1" width=15></td>
<td colspan="4">
<table cellpadding="0" cellpadding="0"><tr><td>
<input id="pat"   style="width:80px" name=pat></td><td>
<input type=button  class=GreenButton
 name=patbut value="<%=Toolbox.emsgs(orgnum,37)%>" onclick="javascript:searchit()">
</td>
<td>
   <select name="fontsize" onchange="changefont(this)">
<% for (int j= 8; j < 36; j++){ %>
<option value="<%=j%>" <%= (j==cachedstyle.fontsize)?"selected":"" %> ><%=j%></option>
<%}%>
   </select>
</td>



</tr></table>
</td>
</tr>


<tr height="22"><td valign=center  width=15>
<img  width=<%=cachedstyle.fontsize%>
style="border:0px" src=image/menuf0.gif></td><td  width=15><img  width=<%=cachedstyle.fontsize%>
 style="border:0px" src=image/menuf.gif></td>
<td align=left colspan="3"  valign="middle"><a href="javascript:openpage('wordform.jsp?mode=1','')" target="rightwinta"><nobr><%=Toolbox.emsgs(orgnum,4)%></nobr></a>
</td></tr>



<tr  height="22"><td valign=center  width=15>
<img  width=<%=cachedstyle.fontsize%>
style="border:0px" src=image/menuf0.gif></td><td  width=15><img  width=<%=cachedstyle.fontsize%>
 style="border:0px" src=image/menuf.gif></td>
<td align=left colspan="3"  valign="middle"><a href="javascript:openpage('webwizard.jsp?mode=1','')" target="rightwinta"><nobr><%=Toolbox.emsgs(orgnum,359)%></nobr></a>
</td></tr>
<script type="text/javascript" >
menu(menus);
if (typeof(cats)!='undefined')
forms(cats);
</script>
<tr  height="22"><td valign=center  width=15><img  width=<%=cachedstyle.fontsize%>
 style="border:0px" src=image/menuf0.gif></td><td  width=15><img  width=<%=cachedstyle.fontsize%>
 style="border:0px" src=image/menuf.gif></td>
<td align=left valign="middle" colspan="3"><a href="DataForm?rdap=userself"  target="rightwinta"><nobr><%=Toolbox.emsgs(orgnum,1354)%></nobr></a>
</td></tr>
<tr  height="22"><td valign=center  width=15><img  width=<%=cachedstyle.fontsize%>
 style="border:0px" src=image/menuf0.gif></td><td  width=15><img  width=<%=cachedstyle.fontsize%>
 style="border:0px" src=image/menuf.gif></td>
<td align=left valign="middle" colspan="3"><a href="login.jsp?follow=logout"><nobr><%=Toolbox.emsgs(orgnum,870)%></nobr></a>
</td></tr>
</TABLE>
</form>
<font color=#DDCC11>  <%=adapter.dbname()%>  </font>
<% if ( (user.roles & Systemroles.SYSTEMADMIN) > 0 ) {%>
<a href=switchdb.jsp?page=webformindex.jsp>Switch</a>
<%}
adapter.close();
%>  
<%=Toolbox.sponsor(orgnum,6, 210)%>
<script>
var i =0;
serCharSize(<%=Toolbox.locales[orgnum>>16].charsize%>);
var numtables = <%=dbtable.numTables%>;
var tables = [<%for (i = 0; i < dbtable.numTables; i++){out.print("'" + dbtable.tables[i]+"'");if (i <dbtable.numTables-1)out.print(",");}%>];
var definitions = [<%for (i = 0; i < dbtable.numTables; i++){out.print("\"" + MyRSA.encryptString0(dbtable.defs[i].replaceFirst("[^\\(]*", ""),orgnum>>16) +"\"");if (i <dbtable.numTables-1)out.println(",");}%>];
var owner = [<%for (i = 0; i < dbtable.numTables; i++){out.print( dbtable.owner[i]);if (i <dbtable.numTables-1)out.print(",");}%>];
var ab = new RegExp("[a-z|A-Z][^ ]*");
function findfds(s)
{
   s = s.replace(/'[^']*'/g,'');
   var k = s.indexOf("("); 
   if (k==-1) return "";
   var fds = "";
   while (true)
   {
      var m = ab.exec(s.substring(k));
      if (m==null) return fds;
      var fd = "" + m;
      var lfd = fd.toLowerCase();
      if (lfd=='check' || lfd=='primary' || lfd=='foreign')
         return fds;
      if (fds!='')fds+=",";
      fds += fd;
      k += m.index + fd.length;
      k = s.indexOf(",",k);
      if (k==-1) return fds;
   }
   return fds;
}
var  tfields = new Array(numtables);
var  numfields = new Array(numtables);
for (i=0; i < numtables; i++)
{
   var x0 = decryptString0(definitions[i]);
   var x = findfds(x0);
   if (x=='')
   {
      numfields[i] = 0;
      tfields[i] = null;
   }
   else
   {
      tfields[i] = x.split(",");
      numfields[i] = tfields[i].length;
   }
}
function passNumtables(){return numtables;}
function passTables(ts){for (var i = 0; i < numtables; i++) ts[i] = tables[i];}
function passNumfields(ts){ for (var i = 0 ; i < numtables; i++) ts[i] = numfields[i];}
function passTFields( ts ) 
{
   for (var i = 0; i < numtables; i++)
      for (var j = 0; j < numfields[i]; j++)
      ts[i][j] = tfields[i][j];
}
function passdef(tn)
{
   var j = 0;
   for (; j < numtables && tn !=  tables[j]; j++);
   if (j < numtables)
   {
       return owner[j] + '|CREATE TABLE ' +  tables[j]   + decryptString0(definitions[j]);
   }
   return '';
}
 
var langlabels = "<%=Toolbox.emsgs(orgnum,1432)%>".split(/,/);
var tablenameens = "Acalender,Department,Acmmap,Announcement,Applicant,Apptables,AppUser,Course,Assignment,Backupfolder,Chatmsg,Classroom,College,Commandline,ComputerAccount,Assessmap,Curriculum,DBOwner,DistinctCode,Faculty,DomainValue,EvalQuestion,EvalSelDetail,EvalSelection,Evaluation,Major,Faq,Fee,FeeCharge,FeeCollect,Feediscount,Feepolicy,Feeprice,Formmodel,Forum,Funblock,Funlink,Gradethresh,Hint,Lecturenotes,Acaprogram,Message,Operation,OperationCourse,OperationType,Outlook,Permits,Registration,Role,Scheduler,Scherror,Schfixed,Schroom,Schtime,Schuser,Session,SessionSum,SigninPolicy,Staff,Student,Studentgroup,Studygroup,Submission,SystemParam,Task,TeachPlan,Textbook,TimeSlot,Transferred,userform,Vender,Assgroup,Taskopt,Project,Projectmem,Userkeys,TaskLang,Docslang,Subactivity,Absence".split(/,/);
var mapname2label=new Array();
for (var jj=0; jj < tablenameens.length; jj++)
    mapname2label[tablenameens[jj]] = langlabels[jj];
function name2label(nm)
{
    var xx = mapname2label[nm];
    if (xx == null) return nm;
    return xx;
}
var font_size = <%=cachedstyle.fontsize%>;
 
var ibgcolor = "<%=cachedstyle.IBGCOLOR%>";
var norexiststr = '<%=Toolbox.emsgs(orgnum,1531)%>';
function getFontSize(){return <%=cachedstyle.fontsize%>;}
var tmp = '';
function settmp(x){tmp = x;}
function gettmp(){return tmp;}
</script>

<script type="text/javascript"  src=webformindex.js></script>
<script type="text/javascript"  src=floating.js></script>
<script type="text/javascript"  src=curve.js></script>
<script type="text/javascript" >
<% if (fontsize!=null){%>
   parent.document.body.cols =   "228,*";
   fitmenu();
<%}%>
   
if (parent.frames[1].document.all.length <=4)
{
var inst=open("", parent.frames[1].name);
inst.document.write("<html><body bgcolor=<%=cachedstyle.DBGCOLOR%> ><ul><li>"
+ textmsg[862].replace( /\n/g,"</li><li>") +"</li></ul></body></html>");
}
function changefont(sel)
{
   document.location.href = document.location.toString().replace(/.fontsize=.*$/,'') + "?fontsize=" + sel.options[sel.selectedIndex].value;
}
resizebut(document.f1,<%=cachedstyle.fontsize%>,true);

</script>
</body>
</html>
 

