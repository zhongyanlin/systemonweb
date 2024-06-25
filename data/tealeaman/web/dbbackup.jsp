<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*" %>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (  (user = User.dbauthorize(application,session,request, response, "dbbackup.jsp", false)) == null|| !Toolbox.verifytoken(request)) 
    return;
boolean backupset = true;
String backupinfo0 = Toolbox.dbadmin[orgnum%65536].error2;
if (backupinfo0!=null && !backupinfo0.equals("")) 
{   
    String xx = Sha1.hash(user.firstname + user.lastname + user.id);
    backupinfo0 = backupinfo0+ "?id=" + user.id + "&passcode=" + xx;
    try{Toolbox1.SetCookie(response, "backupinfo", backupinfo0); }catch(Exception e){backupset = false;}
} 
CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
String style= Toolbox.butstyle(cachedstyle.fontsize);
long tstmp = System.currentTimeMillis() % 10000000;
String tbl = Toolbox.defaultParam(orgnum,request, "tbl", null);

%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head> 
<%=Toolbox.getMeta(orgnum)%><title><%=Toolbox.emsgs(orgnum,397)%></title>
<style type="text/css"> 
    input.BG {background-color:<%=cachedstyle.TBGCOLOR%>;border:0}
    input.BG1 {background-color:<%=cachedstyle.TBGCOLOR%>; border:0;text-align:right}
  
</style>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("dbbackup.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>

<% 
JDBCAdapter adapter = null;
if (tbl!=null)
{
    String sql = Toolbox.defaultParam(orgnum,request, "sql", "").trim();
    if (sql.equals(""))
        sql =  "select * from " + tbl;
    else if (sql.toLowerCase().indexOf("select ")!=0)
    {
        sql = "select * from " + tbl + " where " + sql.replaceFirst("^(?i)where ","");  
    }
    sql += " order by lastupdate";
        adapter = Toolbox.getUserAdapter(user, orgnum);
     
    boolean bb =adapter.executeQuery2(sql,true);
%>
</head>
<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px" >
<center> 
 
    <%=Toolbox.title("" + Toolbox.defaultParam(orgnum,request, "tblname", ""))%> 
 
<table cellpadding="4" id="data" cellspacing="1" border="1" align="center" style="margin:5px 2px 2px 2px;border-color:#ddcc88;border-collapse:collapse;border-radius:3px">

<tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>" >
<%
     if (bb)  
     for (int j=0; j  < adapter.getColumnCount(); j++)
     {
         out.print("<td onclick=sort(" + j + ") align=\"");
         if (adapter.colIsNum[j])
             out.print("right");
         else
             out.print("left");
         out.println("\">" + adapter.columnNames[j] + "</td>");
     }
     out.println("</tr>");
     int i=0;
     while (true)
     {
         String x = adapter.getValueAt(i,0);
         if (adapter.cursor< 0) break;
         out.println("<tr bgcolor=\"" + cachedstyle.TBGCOLOR + "\">");
         for (int j=0; j  < adapter.getColumnCount(); j++)
         {
             x = adapter.getValueAt(i,j); 
             int tt = 0; try{tt = adapter.metaData.getColumnType(j + 1); }catch(Exception e){}
             //if (tt== java.sql.Types.LONGVARCHAR || tt == java.sql.Types.LONGVARBINARY || 
             if (tt==java.sql.Types.CLOB || tt== java.sql.Types.BLOB)
             {
                 out.print("<td align=center valign=top ");
                 if (x!=null && !x.equals(""))
                 {
                     out.print("onclick=showbigdata(this)>>><!--" + x.replaceAll("<", "&lt;").replaceAll(">", "&gt;") + "-->");
                 }
                 out.print("</td>");
             }
             else if (adapter.isnum(j))
             {
                 out.print("<td align=right  valign=top >" + (x==null?"":x) + "</td>");
             }
             else
             {
                 out.print("<td align=left  valign=top >" + (x==null?"":x.replaceAll("<", "&lt;").replaceAll(">", "&gt;")) + "</td>");
             }
         }
         out.println("</tr>");
         i++;
     }
     out.println("</table>");
 

 adapter.close();
%>
<script type="text/javascript" >
let d =[];

let dbms = '<%=adapter.dbms%>';
function sort(k)
{
   var K = k;
   var d = [];
   let t = document.getElementById('data');
   var a = [];
   for (let i=0; i < t.rows[0].cells.length; i++)
   {
       a.push(t.rows[0].cells[i].align.toLowerCase() === 'right'); 
   }
   var c = [];
   for (let i=1; i < t.rows.length; i++)
   {
       let r = [];
       for (let j=0; j < t.rows[i].cells.length; j++)
       {
           r.push(t.rows[i].cells[j].innerHTML);
       }
       d.push(r);
       c.push(i-1);
   }
   c.sort(function(x,y){let X = d[x][K], Y=d[y][K];if (X === Y){return x - y;} if (a[K])return parseFloat(X) - parseFloat(Y); return X > Y?1:-1;});
   for (let i=1; i < t.rows.length; i++)
   {
       let dt = d[c[i-1]];
       for (let j=0; j < a.length; j++)
           t.rows[i].cells[j].innerHTML = dt[j];
   }
   
}
let tbl = '<%=tbl%>';
function download()
{
    let sel = document.getElementById('sel');
    let t = document.getElementById('data');
    let f = [];
    let a = [];
    let sql = [];
    let mime_type, contents,fname;
    
    if (sel.selectedIndex == 0)
    {
        for (let j=0; j < t.rows.length; j++)
        { 
            f = [];
            for (let i=0; i < t.rows[0].cells.length; i++)
            {
                f.push('"' + t.rows[j].cells[i].innerHTML.replace(/"/g,'""') + '"');
            }
            sql.push(f.join(','));
        }
        
        let mime_type =  "text/csv";
        contents = sql.join('\n'); 
        fname = tbl + ".csv";
    }
    else if (sel.selectedIndex == 1)
    {
        let mime_type =  "text/html";
        contents = "<html><body><center>" + tbl + "</center>" + t.outerHTML + '</body></html>';
        fname = tbl + ".html";
    }
    if (sel.selectedIndex == 2)
    {
        for (let j=0; j < t.rows.length; j++)
        { 
            f = [];
            for (let i=0; i < t.rows[0].cells.length; i++)
            {
                f.push("'" + t.rows[j].cells[i].innerHTML.replace(/'/g,"''") + "'");
               
            }
            sql.push(f.join(','));
        }
        
        let mime_type =  "text/plain";
        contents = dbms + '/CREATE TABLE ' + tbl + '\n'+ sql.join('\n'); 
        fname = tbl + ".bak";
    }
    else{
        let sql0 = 'INSERT INTO ' + tbl + ' (';
        for (let i=0; i < t.rows[0].cells.length; i++)
        {
            f.push(t.rows[0].cells[i].innerHTML);
            a.push(t.rows[0].cells[i].align.toLowerCase() == 'left'?"'":""); 
        }
        sql0 += f.join(",") + ") VALUES(";
        for (let j=1; j < t.rows.length; j++)
        {
           f = [];
           for (let i=0; i < t.rows[0].cells.length; i++)
           {
              f.push(a[i] + t.rows[j].cells[i].innerHTML.replace(/'/g, "''")  + a[i]); 
           }
           sql.push(sql0 + f.join(",") + ")");
        }
        let mime_type =  "text/plain";
        contents = sql.join(';\n');
        fname = tbl +".sql";
    }
    var blob = new Blob([contents], {type: mime_type});
    var dlink = document.createElement('a');
    dlink.download = fname;
    dlink.href = window.URL.createObjectURL(blob);
    dlink.onclick = function(e) {
        var that = this;
        setTimeout(function() {
            window.URL.revokeObjectURL(that.href);
        }, 1500);
    };
    dlink.click();
    dlink.remove();
}
function showbigdata(td)
{
    var t =   '<div class=outset3 style=\"width:500px;height:500px\">' +  td.innerHTML.replace(/>>/,'').replace(/<.../,'').replace(/..>$/,'').replace(/\n/g,'<br>')+ '</div>';
    myprompt(t);
}
</script>
<select id="sel"><option selected value="0" onchange="download()">CSV</option><option value="1">HTML</option><option  value="2"><%=Toolbox.emsgs(orgnum,78)%></option><option  value="3">SQL</option></select><input type="button" class="OrangeButton" style="width:80px;margin:5px 0px 5px 0px" value="<%=Toolbox.emsgs(orgnum,1228)%>" onclick="download()" >
 </center>

</body></html>
<% return;}%>
    
<script type="text/javascript" >
function showbigdata(td)
{
    var t = document.createElement('div');
    t.id='bigdata';
    t.style.cssText = 'position:absolute;z-index:10;left:100px;top:100px;width:500px;height:500px;border:1px #606060 outset;padding:3px 3px 3px 3px';
    t.innerHTML = td.innerHTML.replace(/^>><!../,'').replace(/..>$/,'');
    document.body.appendChild(t);
}
var theurl = "<%=Toolbox1.geturl(request)%>";
var tstmp = <%=tstmp%>;
var font_size = <%=cachedstyle.fontsize%>;
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
var starttime = 0;
var endtime= <%=System.currentTimeMillis()/1000%>;
var timeformat = '<%=cachedstyle.timeformat%>';var haswebfolder=<%=user.websitename != null && !user.websitename.equals("")
||user.webFileFolder != null && !user.webFileFolder.equals("") %>;
var numtables = parent.frames[0].passNumtables();
 
var  tables = new Array(numtables);
parent.frames[0].passTables(tables);
let subdb = '<%=user.id%>';
<% if(backupset == false){%>var backupinfo = '<%=backupinfo0%>';<%}%> 
</script>
</head>
<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px" >
<center> 
<%=Toolbox.title(Toolbox.emsgs(orgnum,440))%> 

<form rel=opener  style="margin:5px 0px 0px 0px" name="form1" method="post" action="DBTableBackup"    >
<input type=hidden name=wcds> 
<input type=hidden name=overlap value="">
<input type=hidden name=newrecord value="">
<script type="text/javascript" >document.write(round1('100%'));</script>
<table width=100% cellpadding=0 cellspacing=0 border=0 bgcolor="#c0c0c0" ><tr><td>
<table width=100% cellpadding=1 cellspacing=1 border=1 style="border-collapse:collapse">  
<tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>" >
<td width=<%=5+cachedstyle.fontsize%> align=center> 
<input type=checkbox style="background-color:<%= cachedstyle.BBGCOLOR%>" name=check1 onclick="checkall()">
</td>
 <td width=150  style="color:' + IBGCOLOR + ';white-space:nowrap;padding:2px 4px 2px 4px"> 
   <%=Toolbox.emsgs(orgnum,398)%> 
  </td> 
  <td  style="color:' + IBGCOLOR + ';white-space:nowrap;padding:2px 4px 2px 4px"> 
   <%=Toolbox.emsgs(orgnum,399)%>
   <input size="30" style="border:1px #b0b0b0 solid" name="apply2all" onblur="toall(this)">
  </td>
  <td width=70  style="color:' + IBGCOLOR + ';white-space:nowrap;padding:2px 4px 2px 4px"> 
<nobr><%=Toolbox.emsgs(orgnum,704)%></nobr>
  </td>
  </tr>  
<script type="text/javascript" >
for (var i = 0; i < numtables; i++)
{  
  
   document.write('<tr bgcolor=<%=cachedstyle.TBGCOLOR%>>' + 
   '<td width=' + (5+ font_size) +' align=center  style="color:' + IBGCOLOR + ';white-space:nowrap;padding:2px 4px 2px 4px" > <input type=checkbox name=checkbox' + i + ' value=' + tables[i] + ' > </td>' + 
   '<td onmouseover=showtn(this,' + i + ') onmouseout=hidetn(this,' + i + ') style="color:' + IBGCOLOR + ';white-space:nowrap;padding:2px 4px 2px 4px">' + parent.frames[0].name2label( tables[i]) + ' </td>' +
   '<td  style="color:' + IBGCOLOR + ';white-space:nowrap;padding:2px 4px 2px 4px" ><input class=BG name=rest' + i + ' size=40 onblur=selectit('+i+',this)></td><td onclick=browsedata(this) align=center> >> </td></tr>' );
}
function hidetn(td,i)
{
   td.innerHTML = '<nobr><font color=' + IBGCOLOR + '>' + parent.frames[0].name2label( tables[i]) + ' </font></nobr>'; 
}
function showtn(td,i)
{
   td.innerHTML = '<nobr><font color=' + IBGCOLOR + '>' +  ( tables[i]) + ' </font></nobr>'; 
}
var iid = '<%=  user.id%>';
var uid = '<%= (Systemroles.SYSTEMADMIN & user.roles ) == 0 ?"": user.id%>';
var sysonwebdb = <%=DBAdmin.sysonwebdb?"true":"false"%>;
function basicdata()
 {
     var tablenameens = ",Acalender, ,Absence,1=2,Department, ,Acmmap, ,Announcement,1=2,Applicant,1=2,Apptables, ,AppUser,id='admin' or id='D10045678',Course,id='20-101',Assignment,course='20-101',Backupfolder,1=2,Chatmsg,1=2,Classroom, ,College, ,Commandline, ,Assessmap, ,Curriculum, ,DBOwner,id='admin',DistinctCode, ,Faculty,id='admin',DomainValue, ,EvalQuestion, ,EvalSelDetail, ,EvalSelection, ,Evaluation,1=2,Major, ,Faq, ,Fee, ,FeeCharge, ,FeeCollect, ,Feediscount, ,Feepolicy, ,Feeprice, ,Formmodel,1=2,Forum,1=2,Funblock, ,Funlink, ,Gradethresh, ,Hint, ,Lecturenotes,1=2,Acaprogram, ,Message,1=2,Operation, ,OperationCourse, ,OperationType, ,Outlook, ,Permits, ,Registration,1=2, Role, ,Scheduler, ,Scherror, ,Schfixed, ,Schroom, ,Schtime, ,Schuser, ,Session,courseid='20-101',SessionSum, ,SigninPolicy, ,Staff,1=2,Student,id='D10045678',Studentgroup, ,Studygroup, ,Submission,course='20-101',SystemParam,1=2,Task,name='task10' or name='systemparameter',TeachPlan,1=2,Textbook, ,TimeSlot, ,Transferred,1=2,userform,1=2,Vender,1=2,Assgroup,1=2,Taskopt,1=2,Project,1=2,Projectmem,1=2,Docslang, ,TaskLang, ,Userkeys,1=2,Schman, ,Aggregation, ,Role, ,Subactivity, ,";
     var allts = tablenameens.replace(/1=2,/g,'').replace(/[a-z]+='[^']+'/g, '').replace(/ or /g, '').replace(/, ,/g,',').replace(/,$/,'').replace(/,/g, "' or tname='");
     
        var ml = document.form1;
     var len = ml.elements.length;  
  var res = new Array( numtables ); 
  for (var i = 0; i < len; i++)  
  {                              
      var e = ml.elements[i];    
      if (e.name.indexOf("rest") == 0) 
      { 
          res[parseInt(e.name.substring(4))] = i;  
      }
  } 
  
  for (var i = 0; i < numtables; i++)
  { 
      var x = ml.elements[res[i]].parentNode.parentNode.cells[0].getElementsByTagName('input')[0];
      var j = tablenameens.indexOf(',' + x.value + ",");
      var k = j + x.value.length + 2;
      var l = tablenameens.indexOf(',',k);
      x.checked = ( j>=0);
      if (j < 0) continue;
         ml.elements[res[i]].value  = tablenameens.substring(k, l).trim();
      if (x.value == 'Apptables') 
          ml.elements[res[i]].value  = allts.substring(4) + "'";
  } 
  ml.needzip.checked = true;
  ml.extname.value = '.zip';
  ml.needdef.checked = true;
  ml.filename.value = 'sysadmin';
 }
 function browsedata(td)
 {
     var tr = td.parentNode;
     var tbl = tr.childNodes[0].getElementsByTagName("input")[0].value;
     var sql = tr.childNodes[2].getElementsByTagName("input")[0].value;  
    
     postopen('dbbackup.jsp?tbl=' + tbl + '&tblname=' + encodeURIComponent(tr.childNodes[1].innerHTML.replace(/<[^>]+>/g,'')) +  '&sql=' + encodeURIComponent(sql), '_blank');
 }
function goodleng()
{
   var ml = document.form1;
   var len = ml.elements.length;  
    
   for (var i = 0; i < len; i++)  
   {                              
      var e = ml.elements[i];    
      if (e.name.indexOf("rest") == 0) 
      { 
          e.style.width = (thispagewidth() - 280) + 'px';
      }
   } 
}
var sysadmin = <%= (user.roles & (Systemroles.SYSTEMADMIN )) > 0 %>; 
var teachadmin = <%= (user.roles & ( Systemroles.TEACHINGADMIN)) > 0 %>; 
var warn = "<%=Toolbox.emsgs(orgnum,426)%>";//+user.dbinfo.server.replaceFirst("(.*)[:|/|=]([a-z|A-Z|0-9]+$)", "$2")%>";
<%  Encode6b  zz = new Encode6b(orgnum); String xx = ""; try{xx = zz.to6b("parent.dodelete()");}catch(Exception e){} %>
var followstr = "<%= xx %>";
let backupinfo ='<%=backupinfo0%>';
</script>
</table> 
</td></tr></table>
<script type="text/javascript" >document.write(round2);</script>
<table class="outset1"  style="margin:2px 0px 4px 0px" cellpadding="3">
<%if (DBAdmin.sysonwebdb){%>
<tr><td><table>
<tr><td><%=Toolbox.emsgs(orgnum,400)%></td>
<td><input  style="background-color:<%=cachedstyle.TBGCOLOR%>;border:1px #b0b0b0 solid"  name=start size=14 onchange=chq(this,1) onblur=chq(this,1) onfocus=setv(this)>
</td>
<td><%=Toolbox.emsgs(orgnum,402)%></td>
<td><input  style="background-color:<%=cachedstyle.TBGCOLOR%>;border:1px #b0b0b0 solid"  name=end size=14 onchange=chq(this,2) onblur=chq(this,2) onfocus=setv1(this)>
</td></tr>
</table></td></tr>
<%}%>
<tr><td><table cellspacing="0" style="margin:2px 0px 4px 0px" cellpadding="3">
<tr>
<td>  
        <%=Toolbox.emsgs(orgnum,531)%>
</td>
<td  >
    <input  name=needdef  type=checkbox style="background-color:<%=cachedstyle.TBGCOLOR%>"   >
</td>
<td>&nbsp;&nbsp;&nbsp;&nbsp;<%=Toolbox.emsgs(orgnum,21)%>
</td>
<td  style="background-color:<%=cachedstyle.TBGCOLOR%>">
    <select name=needzip onchange="chext(this)"  style="background-color:<%=cachedstyle.TBGCOLOR%>">
        <option value="zip" selected > <%=Toolbox.emsgs(orgnum,641)%> </option>
        <option value="bak"  > <%=Toolbox.emsgs(orgnum,78)%> </option>
        <option value="sql"  > SQL script </option>
    </select>
    <!--input  name=needzip  type=checkbox style="background-color:<%=cachedstyle.TBGCOLOR%>" checked="yes" onclick="chext(this)"-->
</td>
<td >&nbsp;&nbsp;&nbsp;&nbsp;<%=Toolbox.emsgs(orgnum,1475)%></td>
<td  >
    <input  name=saveweb  type=checkbox style="background-color:<%=cachedstyle.TBGCOLOR%>"   >
</td><td >&nbsp;&nbsp;&nbsp;<%=Toolbox.emsgs(orgnum,661)%><%=Toolbox.emsgs(orgnum,67)%></td>
<td>
    <input  name=filename  type=text style="background-color:<%=cachedstyle.TBGCOLOR%>;text-align:right;border:1px #b0b0b0 solid" size="11" value="<%="tlm" + Toolbox.timestr("YYYYMMDD")%>">
</td>
<td ><input  name=extname  type=text readonly style="background-color:<%=cachedstyle.TBGCOLOR%>;text-align:left;border:1px #b0b0b0 solid" size="4" value=".zip">
</td>
</tr></table>     
</td>
</tr></table> 

<input type=hidden name=selectsql > 
<input name=backupbtn type="button"  onclick="openwin()"    class=BlueButton  <%=style%>  value="<%=Toolbox.emsgs(orgnum,839)%>"   >
<input name=removebtn type="button"  onclick="myprompt(textmsg[1732])"   class=OrangeButton  <%=style%>  value="<%=Toolbox.emsgs(orgnum,442)%>"   >
<input name=deletebtn type="button"  onclick="confirmd()"   class=RedButton  <%=style%>  value="<%=Toolbox.emsgs(orgnum,30)%>"   >
<input type=reset   class=GreenButton  <%=style%>  value="<%=Toolbox.emsgs(orgnum,192)%>" >  
<input class=GreenButton  type=button  <%=style%>  value="<%=Toolbox.emsgs(orgnum,32)%>" onclick=showhelp() tabindex=10> 
&nbsp;&nbsp;&nbsp;<a href="javascript:basicdata()" ><%=Toolbox.emsgs(orgnum,1470)%></a> &nbsp;&nbsp;&nbsp;<a href="javascript:outerback(<%=user.roles & Systemroles.SYSTEMADMIN%>)" >Outer Backup</a>
</form>
<br>
<script type="text/javascript" >
var helpstr = "<%=Toolbox.emsgs(orgnum,404)%>   \"courseid='eng101' AND grade > -1\"<!---->";
</script>
<script type="text/javascript"  src="timeformat.js"></script>
<script type="text/javascript"  src="helpformat.js"></script>
<script type="text/javascript"  src="dbbackup.js"></script>
<script type="text/javascript" >
helpstr +="<br><br><b><font color=purple>" + textmsg[51] +"</font></b><br>";
helpstr +="<table><tr><td valign=top> <input style=background-color:#0000FF;color:white;width:60px type=button value=Backup> </td><td><%=Toolbox.emsgs(orgnum,406)%></td></tr></table>";
<%=Toolbox.msgjspout((orgnum%65536)+user.id,true)%>
 
</script>
<script type="text/javascript"   src=curve.js></script>     
</center>
<div id="copyright" style="text-align:center;color:#4d5ddd;font-size:12px"> 
<%= Toolbox.copyright[orgnum>>16]%> 
</div>
<iframe name="w<%=tstmp%>" width="1" height="1" scrolling="no"  style="visibility:hidden" />

</body>
</html>
