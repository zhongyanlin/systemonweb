<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%!
void mydb(User user, int orgnum)
{
    JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
    String sql1 = "SELECT server,driver, dbuserid, dbpassword, timeformat FROM DBOwner WHERE id='" + user.id+ "'";
    int nb = adapter.executeQuery(sql1);
    if (nb == 1) 
    {
        DBConnectInfo dbinfo = new DBConnectInfo(adapter.getValueAt(0, 0), adapter.getValueAt(0, 1), adapter.getValueAt(0, 2), adapter.getValueAt(0, 3),adapter.orgnum);
        if (dbinfo.user == null ||  dbinfo.user.equals("")) 
        {
            if (Toolbox.dbadmin[orgnum%65536].ownpassword) 
            {
                 dbinfo.user = user.id;
                 dbinfo.password = user.password;
            } else 
            {
                dbinfo.user = Toolbox.dbadmin[orgnum%65536].systemuser;
                dbinfo.password = Toolbox.dbadmin[orgnum%65536].systempassword;
            }
        }
        user.mydb = true;
        user.subdb = user.id;
        synchronized(this){Toolbox.dbadmin[orgnum%65536].dbinfocache.put(user.id,  dbinfo);}
    } 
   adapter.close();
}
%>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.dbauthorize(application,session,request, response, "dboperationindex.jsp", false)) == null) 
{
    out.print(Toolbox.emsgs(orgnum,590));
    return;
}
String mydb = Toolbox.defaultParam(orgnum, request, "mydb", null);
if ( (Systemroles.SYSTEMADMIN & user.roles) > 0 && mydb==null)
    user.changedb(null);
else 
    user.changedb(user.id);
 
String urllink = "";
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
String dbn = adapter.dbname();
int l =dbn.lastIndexOf("/");
dbn = dbn.substring(l+1).replaceFirst("\\?.*$", "");
if (adapter.error().length() > 0)
{
    adapter.close();
    User.dberrorRelogin(application,session,request,response,"dboperationindex.jsp");
    return;
}
DbTable dbtable = new DbTable(adapter, user ,"dependency");
dbtable.init();
int i = 0;
CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
int ii = Toolbox.indexframewidth(cachedstyle.fontsize);
%> 
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head> 
<%=Toolbox.getMeta(orgnum)%><title><%=Toolbox.emsgs(orgnum,439)%></title>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("dboperationindex.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript"  src=stab.js></script>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
 <%=Toolbox.unifontstyle(cachedstyle.fontsize,orgnum)%>
</head>
<body style="margin:6px 12px 6px 6px;background:<%= cachedstyle.IBGCOLOR %> right url(image/backgd.gif) repeat-y">
<center>
<%=Toolbox.logtitle(Toolbox.emsgs(orgnum,445), 210)%>
<form rel=opener name=f1 style="margin:5px 0px 5px 0px"  >

<TABLE class=outset width=100% cellpadding=2 cellspacing=0>
                                                
<tr><td><img src=image/tri.gif></td><td align="left"><div id="varywidthdiv0" style="width:<%=ii%>px;overflow:hidden"><nobr><a href=dbinfo.jsp target=rightwintb><%=Toolbox.emsgs(orgnum,434)%></a></nobr></div></td></tr>
<tr><td><img src=image/tri.gif></td><td align="left"><div id="varywidthdiv1" style="width:<%=ii%>px;overflow:hidden"><nobr><a href=dbbackup.jsp target=rightwintb><%=Toolbox.emsgs(orgnum,440)%></a></nobr></div></td></tr>
<tr><td><img src=image/tri.gif></td><td align="left"><div id="varywidthdiv2" style="width:<%=ii%>px;overflow:hidden"><nobr><a href=dbrestore.jsp target=rightwintb><%=Toolbox.emsgs(orgnum,441)%></a></nobr></div></td></tr>
<tr><td><img src=image/tri.gif></td><td align="left"><div id="varywidthdiv3" style="width:<%=ii%>px;overflow:hidden"><nobr><a href=dbparse.jsp target=rightwintb><%=Toolbox.emsgs(orgnum,1240)%></a></nobr></div></td></tr>
<!--tr><td><img src=image/tri.gif></td><td align="left"><div id="varywidthdiv3" style="width:<%=ii%>px;overflow:hidden"><nobr><a href=csvtodb.jsp target=rightwintb><%=Toolbox.emsgs(orgnum,1410)%></a></nobr></div></td></tr-->

<!--tr><td><img src=image/tri.gif></td><td align="left"><div id="varywidthdiv4" style="width:<%=ii%>px;overflow:hidden"><nobr><a href=dbdataclear.jsp target=rightwintb><%=Toolbox.emsgs(orgnum,442)%></a></nobr></div></td></tr-->
 
<tr><td><img src=image/tri.gif></td><td align="left"><div id="varywidthdiv5" style="width:<%=ii%>px;overflow:hidden"><nobr><a href=dbinfo.jsp?item=migrate  target=rightwintb><%=Toolbox.emsgs(orgnum,435)%></a></nobr></div></td></tr>
</TABLE>                                                
 
</form>
<a href="javascript:dbinfo1()">  <%=dbn%>  </a> <font color=#DDCC11> | </font> <a href="dboperationindex.jsp<%=mydb==null?"?mydb=1":""%>" > <%=Toolbox.emsgs(orgnum, 936)%></a>  
<% 
adapter.close();
%>
</center>
<%=Toolbox.sponsor(orgnum,6, 210)%>
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
       myprompt(txt);
      window.onerror = handleErr;
      return true;
}
window.onerror = handleErr;
}
var i =0;
serCharSize(<%=Toolbox.locales[orgnum>>16].charsize%>); 
var securitytoken="<%=Toolbox.gentoken("dbrestore.jsp","f1")%>";
var numtables = <%=dbtable.numTables%>;
var tables = [<%for (i = 0; i < dbtable.numTables; i++){out.print("'" + dbtable.tables[i]+"'");if (i <dbtable.numTables-1)out.print(",");}%>];
var definitions = [<%for (i = 0; i < dbtable.numTables; i++){out.print("\"" + MyRSA.encryptString0(dbtable.defs[i].replaceFirst("[^\\(]*", ""),orgnum>>16) +"\"");if (i <dbtable.numTables-1)out.println(",");}%>];
var owner = [<%for (i = 0; i < dbtable.numTables; i++){out.print( dbtable.owner[i]);if (i <dbtable.numTables-1)out.print(",");}%>];
var ab = new RegExp("[a-z|A-Z][^ ]*");
function dbinfo1()
{
   myprompt('<nobr>Server: <%=user.dbinfo.server.replaceAll("\\\\","/")%></nobr><br><nobr>Driver: <%=user.dbinfo.driver%></nobr>',null,null);
}
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
var did = false;
window.open("dbbackup.jsp", "rightwintb"); 
var tmp = [];
function settmp(x,v){tmp[x] = v;}
function gettmp(x){return tmp[x];}
var onloaddbi   = null;
if (typeof window.onload == 'function')
   onloaddbi = window.onload;
window.onload = function()
{
    if (onloaddbi!=null) 
       onloaddbi();
    Msg.init({stoken:securitytoken,
    app:"chat",
    tid:'',
    sid:"<%=user.id%>",
    sname:"<%=user.id%>",
    rid:'',
    code:'',
    msg:'',
    sendhandle:"Msgretrive", 
    key:"<%=SessionCount.enq(session.getId()) + "_"+ DataRestore.chatcourse%>",
    sek:"<%=SessionCount.enq(session.getId())%>"}); 
}     
function quitm(td)
{
    if (td!='')
    Msg.send({code:'quit'});
}
let fieldEntries = [];
function getFieldEntries(tbl)
{
   return fieldEntries[tbl];
}
function setFieldEntries(tbl,x)
{
   fieldEntries[tbl] = x;
}
</script>

<script type="text/javascript"  src=floating.js></script>
<script type="text/javascript"  src=curve.js></script>
<iframe name="w<%=System.currentTimeMillis()%10000000%>" width="1" height="1" style="visibility:hidden"/>  
</body>
</html>
 

