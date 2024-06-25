<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*,java.io.* " %>
<%!
String pad(int x)
{
    if (x < 10) return "0" + x;
    return "" + x;
}
%>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR |Systemroles.TA|Systemroles.ASSESSER |Systemroles.TEACHINGADMIN,application,session,request, response, "assignmentindex.jsp", true)) == null)
    return;
   
if ( (user = User.dbauthorize(application,session,request, response, "assignmentindex.jsp", true)) == null)
{
    out.print(Toolbox.emsgs(orgnum,934));
    return;
}
if (Toolbox.dbadmin[orgnum%65536].error2.equals(""))
{
    user.changedb("");
    JDBCAdapter adapter =  Toolbox.getSysAdapter(orgnum);
    if (adapter.executeQuery("SELECT option2 from SystemParam")>0)
    {
        String x = adapter.getValueAt(0, 0),z;
        
         Toolbox.dbadmin[orgnum%65536].error2 = x;
    }
   
    adapter.close();
}
CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 

String deletetmp = Toolbox.defaultParam(orgnum, request, "deletetmp", null);
if (deletetmp != null)
{
    (new File(user.webFileFolder +  File.separator +  "tempass.txt")).delete();
    return;
}
String subdb = user.id;
user.changedb(subdb);
if (user.mydb==false) subdb = "";
String semester = Toolbox.defaultParam(orgnum,request,"semester",Toolbox.dbadmin[orgnum%65536].currentSemester, null, 40);
String semester1 = semester.replaceAll("'","''");
String newsemesterstr =  Toolbox.defaultParam(orgnum,request,"newsemester",null, null, 40);
String sqln = "";
if(newsemesterstr!=null )
{
    semester = Toolbox.dbadmin[orgnum%65536].newSemester(newsemesterstr,orgnum);
    sqln = "INSERT INTO  DomainValue(lastupdate,code,description,domain,domainvalue,language) select  " + (System.currentTimeMillis()/1000)
            + "," + semester + ",description,'Semester','" + newsemesterstr +"',language FROM DomainValue WHERE language='" + Toolbox.langs[orgnum>>16] + "' AND domain='Semester' AND code=(" + semester + "-1)";
}
String mode = Toolbox.defaultParam(orgnum,request,"mode","assign", null, 20);
 
String modestr =  mode.equals("assign")?" Class Quiz ":" Assignment/Test ";
String assignname="";
String course = "";
long nowtime = System.currentTimeMillis();
String courseSQLstr, assignSQLstr;
 
 
if (newsemesterstr!=null)
{
    courseSQLstr = "SELECT distinct id, title, '' as dummy, '' as ta, '' as timeslot,Course.id FROM Course, TeachPlan WHERE Course.id=TeachPlan.courseid AND semester='" + semester1 + "' AND TeachPlan.instructor='"  + user.id + "' order by Course.id";
    assignSQLstr = "select Assignment.course, Assignment.name, '01','01',Assignment.start, Assignment.due,Assignment.assess   from Assignment, Course, TeachPlan WHERE  Assignment.atype < 4 AND Course.id=Assignment.course AND Course.id=TeachPlan.courseid AND Assignment.semester='"  + semester1 + "' AND TeachPlan.semester='" + semester1  + "' AND TeachPlan.instructor='" + user.id +"' order by Assignment.course, Assignment.name";
}
else
{
    courseSQLstr = "SELECT Course.id, Course.title, Session.name, Session.ta, TimeSlot.timeslot  FROM Course,  Session,  TimeSlot WHERE Session.schedule=TimeSlot.num  AND Session.courseid=Course.id AND Session.instructor='" + user.id +"' AND  Session.semester='" + semester1 +"' order by Course.id, Session.name";
    assignSQLstr = "SELECT distinct Assignment.course, Assignment.name, Assignment.sessionname,Session.name, Assignment.start, Assignment.due,Assignment.assess  from Assignment, Course, Session where  Assignment.atype < 4 AND Course.id = Assignment.course AND Session.courseid = Course.id AND Session.instructor='" + user.id +"' AND  Session.semester='" + semester1
    +"'   AND Assignment.semester='" + semester1 +"'  order by Assignment.course,Session.name, Assignment.start, Assignment.name, Assignment.sessionname";
     
}

JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);

if (!adapter.error().equals(""))
{
    out.println(adapter.server +": " +  adapter.error() );
    adapter.close();
    return;
}
if (!sqln.equals(""))adapter.executeUpdate(sqln);
assignSQLstr = Webform.mysql2c(adapter.dbms, assignSQLstr);
 
if (adapter.error().length() > 0)
{
    adapter.close();
    User.dberrorRelogin(application,session,request,response,"assignmentindex.jsp");
    return;
}
adapter.executeUpdate("UPDATE Assignment SET status=2 WHERE " + (nowtime/1000) + "- lastupdate>48*3600 AND status=3"); 
int numcourses = 0;
boolean bb = adapter.executeQuery2(courseSQLstr,false);
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head>
<%=Toolbox.getMeta(orgnum)%>
<%
if (!bb)
{
adapter.close();
out.println("</head><body bgcolor=" + cachedstyle.DBGCOLOR+"><br> Error:" +   courseSQLstr);
return;
}
 
%>

<script type="text/javascript"  >
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
 var cid = new Array();
 var session = new Array();
 var grader = new Array();
 var ctitle = new Array();
 var ss = new Array();
<%

String [] cid = new String[100];
String [] sessions = new String[100];
String [] title = new String[100];
String oldid = "";
String oldta = "";
int j = 0;
numcourses = 0;
for (int i = 0; adapter.getValueAt(i,0)!=null && i < 100 ; i++)
{
     numcourses++;
     String tmp = adapter.getValueAt(i,0);
     if (tmp==null) continue;
     tmp = tmp.trim();
     out.println("ss[" + i +"]=['" + adapter.getValueAt(i,4) +"','" + tmp + "','" + adapter.getValueAt(i,2)+"'];\n");
    // if (tmp.equals(oldid) == false)
     {
        cid[j] = tmp;
        String value  = adapter.getValueAt(i,1);
        if (value == null)
        {
          value="";
        }
        title[j] = value.trim();
        out.println("cid[" + j +  "] = \"" + Generic.handle(tmp) + "\";");
        out.println("ctitle[" + j +  "] = \"" + Generic.handle(title[j]) + "\";");
        value  = adapter.getValueAt(i,2);
        Toolbox.dbadmin[orgnum%65536].assigncache.remove(cid[j] + "|" + value);  
        if (value == null)
        {
          value="";
        }
        value = value.trim();
        sessions[j] = value;
        out.println("session[" + j +  "] = \"" + Generic.handle(value) + "\";");
        value  = adapter.getValueAt(i,3);
        
        if (value == null)
        {
          value="";
        }
        value = value.trim();
        out.println("grader[" + j +  "] = \"" + user.id + "\";");
        if (!value.equals("") && !value.equals(user.id) )
            out.println("grader[" + j +  "] += \"," + Generic.handle(value) + "\";");
        j++;

     }
    /*else 
     {
        String  value  = adapter.getValueAt(i,2);
        if (value != null && !value.equals("") )
        {
            value = value.trim();
            out.println("session[" + (j-1) +  "] +=  \"," + Generic.handle(value) + "\";");
        }
        value  = adapter.getValueAt(i,3);
        if (value != null && !value.equals("") && !value.equals(oldta))
        {
            value = value.trim();
            out.println("grader[" + (j-1) +  "] +=  \"," + Generic.handle(value) + "\";");
        }
     } */
     oldid = tmp;
     oldta = adapter.getValueAt(i,3);
}
numcourses = j;
String allcourses = "";
for (int k = 0; k < numcourses; k++)
    allcourses += " OR course='" + cid[k]+"'";
allcourses =  allcourses.replaceFirst(" OR ", " AND ");

%>
 
 var numcourses = <%= j%>;
 var AN = new Array(numcourses);
 var SN = new Array(numcourses);
 var numassigns = [<%for(j=0;j<numcourses-1;j++)out.print("0,");out.print("0");%>];
 var assgn = new Array(numcourses);
 var sindex = new Array(numcourses);
 var clicked = false;
 var semester = '<%=semester%>';
 var active = '<%= semester.equals(Toolbox.dbadmin[orgnum%65536].currentSemester)?1:0%>';
 var currentSemester = '<%=Toolbox.dbadmin[orgnum%65536].currentSemester%>';
 var subdb = '<%=subdb%>';
 var n2s = [];
 var ass = [];
 <%
int allassigns = 0;
bb = adapter.executeQuery2(assignSQLstr,false);
int  kk = 0,   jj= 0;
String cr, as, sn, ssn;
String oldc = null; 
int oldjj = -1;
StringBuffer buf = new StringBuffer(); 
HashMap<String,Integer> cs2n = new HashMap<String,Integer>();
HashMap<String,String> cs2d = new HashMap<String,String>();
HashMap<String,String> cs2s = new HashMap<String,String>();
StringBuffer backup = new StringBuffer();
String lastdue = "";
long lastdues = 0;
StringBuffer keys = new StringBuffer();
String mmdd = cachedstyle.timeformat.replaceFirst(".*MM","MM").replaceFirst("DD.*","DD");
if (bb)
for( j = 0;   adapter.getValueAt(j,0)!=null; j++ ) 
{
    allassigns++;
    cr  = adapter.getValueAt(j,0).trim();
    as  = adapter.getValueAt(j,1).trim();
    sn  = adapter.getValueAt(j,2).trim();
    backup.append(as + ';'+ cr + "^~" + sn +   "^~2\\n"); 
    String k1 = cr + "|" + as + "|" + sn + ";";
    int q = keys.indexOf(k1);
    if (q < 0 || q>0 && keys.charAt(q-1)!=';')
        keys.append(k1);
    ssn = adapter.getValueAt(j,3).trim();
    String ass = adapter.getValueAt(j,6);
    ass = as + ';' + (ass==null?"":ass.trim());
    if( ("," + sn + ",").indexOf("," + ssn + ",") < 0 )
        continue;
     
    int k=-1; 
    for (  k=0; k < title.length; k++) 
    {
        if (cr.equals(cid[k])) break; 
    }
    
    //if (j>0 && (cr + "," + as + "," + sn).equals(adapter.getValueAt(j-1,0).trim() + "," + adapter.getValueAt(j-1,1).trim() + "," + adapter.getValueAt(j-1,2).trim()) )
      //  continue;
    long start =  Long.parseLong(adapter.getValueAt(j,4).trim());
    java.util.Date dd = new java.util.Date(start*1000);
    
    buf.append("n2s['" + cr + "-" + as.replaceAll("'","\\'") + "']='" + mmdd.replaceFirst("MM", pad(dd.getMonth()+1 )).replaceFirst("DD",pad(dd.getDate())) + "';\n");
    
    long due =  Long.parseLong(adapter.getValueAt(j,5).trim());
    if (due*1000 < nowtime && due > lastdues && k < title.length)
    {
       lastdues = due; 
       lastdue = adapter.getValueAt(j,5).trim();
       cs2d.put(cr +","+ ssn, lastdue + "," + title[k]);
       
    }
    else
    {
        cs2d.put(cr +","+ ssn, (nowtime/1000) + "," + title[k]);

    }
    
    String y = cs2s.get(cr +","+ ssn);
    if (y == null) 
       cs2s.put(cr +","+ ssn, ass);
    else
       cs2s.put(cr +","+ ssn, y + "@" + ass);
    jj = 0;
    
    Integer x = cs2n.get(cr +","+ ssn);
    if (x == null) 
       cs2n.put(cr +","+ ssn, new Integer(1));
    else
       cs2n.put(cr +","+ ssn, new Integer(1+x.intValue()));

    jj = 0;
    for (; jj < numcourses && !(cid[jj] + "," + sessions[jj] ).equals(cr + "," + ssn); jj++);  

    if ( oldc ==null || !(cr + "," + ssn).equals(oldc))
    {
         if (oldc!=null)
         {
             out.print("''];\nnumassigns["+oldjj+"] = " + kk + ";\n");
         }
         out.print ("SN["+jj+"]= [");
         kk = 0;
         lastdues = 0;
    }
    out.print ("\""+Generic.handle(sn)+"\",");
    kk++;
 
   oldc = (cr + "," + ssn);
   oldjj = jj;
}
if (oldjj>=0)
out.print("''];\nnumassigns["+oldjj+"] = " + kk + ";\n");
String allstr = ""; 
 
Set<String> e =  cs2n.keySet();
for (String cs:e) 
{
    if (cs2d.get(cs)!=null)
    allstr  += cs + "," + cs2n.get(cs) + "," + cs2d.get(cs) + ";";
     
}
 
oldjj = -1;
kk = 0;
oldc = null;
if (!adapter.server.contains("mysql")) 
bb = adapter.executeQuery2(assignSQLstr,false);
else adapter.rewind();
for( j = 0; j < allassigns; j++ )
{
    cr  = adapter.getValueAt(j,0).trim();
    as  = adapter.getValueAt(j,1).trim();
    sn  = adapter.getValueAt(j,2).trim();
    ssn = adapter.getValueAt(j,3).trim();
    
    if( ("," + sn + ",").indexOf("," + ssn + ",") < 0 )
    {
        continue;
    }
       // if (j>0 && (cr + "," + as + "," + sn).equals(adapter.getValueAt(j-1,0).trim() + "," + adapter.getValueAt(j-1,1).trim() + "," + adapter.getValueAt(j-1,2).trim()) )
    //    continue;
    
    jj = 0;
    for (; jj < numcourses && !(cid[jj] + "," + sessions[jj] ).equals(cr + "," + ssn); jj++); 

    if ( oldc ==null || !(cr + "," + ssn).equals(oldc) )
    {
         if (oldc!=null)
         {
             out.println("''];");
         }
         out.print("AN["+jj+"]=[");
         kk = 0;
    }
    out.print ("\""+Generic.handle(as)+"\",");
    kk++;
    oldc = (cr + "," + ssn);
    oldjj = jj; 
}
if (oldjj>=0)
out.println("''];");
out.println(buf);
adapter.close();
for (String k : cs2s.keySet())
{
    out.println("ass['" + k + "']='" + cs2s.get(k) + "';");
}
%>

</script>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("assignmentindex.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>
</head>
<!-- <%=cs2n.toString()%> -->
<body style="margin:6px 6px 6px 6px;background:<%= cachedstyle.IBGCOLOR %> right url(image/backgd.gif) repeat-y" >
<center>
<%=Toolbox.logtitle(Toolbox.emsgs(orgnum,296), 200)%>

<form rel=opener   name=form1 method=post target=rightwinass action=DataForm style="margin:5px 0px 5px 0px"  >
<input type=hidden name=rdap value="assignedit">
<input type=hidden name=course value="All Courses">
<input type=hidden name=onsaved value="11">
<input type=hidden name=cellonblur value="12">
<input type=hidden name=onsave value="13">
<input type=hidden name=coursetitle>
<input type=hidden name=assignname>
<input type=hidden name=numrows value=1>
<input type=hidden name=sessionname>
<input type=hidden name=session >
<input type=hidden name=makescript value=makeass>
<input type=hidden name=grader>
<input type=hidden name=active>
<input type=hidden name=onbegin>
<input type=hidden name=mode value="<%=mode%>">
<input type=hidden name=subdb value="<%=subdb%>">
<table width=100% border=0  class=outset  cellpadding=2 cellspacing=0>
 <tbody>
<tr  height=<%=cachedstyle.fontsize+10%> >
<td  align="center" colspan=2><table align="center" cellpadding="0" cellspacing="0"><tr><td  style="color:#DDCC11;text-shadow:-1px -1px #060606;"><b><%=Toolbox.emsgs(orgnum,1004)%></b></font></nobr></td><td>
<select name=semester  class="selectsel"  style="font-family:inherit"    onchange="switchs(this)">
<%= Toolbox.dbadmin[user.orgnum%65536].semesteropts(semester, orgnum) %>
<% if (newsemesterstr==null){%>
<option value="newsemester">
<%=Toolbox.emsgs(orgnum,964)%>
</option>
<%}%>
 
</select> </td></tr></table></td></tr>

<% if (semester.equals(Toolbox.dbadmin[orgnum%65536].currentSemester) && numcourses >0 )
{
%>
<TR ><TD><img src=image/tri.gif ></td><td  style="color:#DDCC11;text-shadow:-1px -1px #060606;"><a href="javascript:opentable0()"><%=Toolbox.emsgs(orgnum,298)%></a></td></tr>
<TR ><TD><img src=image/tri.gif ></td><td  style="color:#DDCC11;text-shadow:-1px -1px #060606;"><a href="javascript:opentable1()"><%=Toolbox.emsgs(orgnum,299)%></a></TD></TR>
<%
}

%>

<tr height="4"><td colspan="2"></td></tr>

<% int ii = Toolbox.indexframewidth(cachedstyle.fontsize);
for (j = 0; j < numcourses; j++)
{
%>
<TR><td><img src=image/tri.gif ></td><TD><div onmouseover="hint1(<%=j%>)" onmouseout="cancelhint()" id="varywidthdiv<%=j%>"  style="color:#DDCC11;text-shadow:-1px -1px #060606;width:<%=ii%>px;overflow:hidden"><nobr><a href="javascript:submitform(assgn[<%=j%>],'<%=j%>')"><%=cid[j] + "-" + sessions[j] + " " + title[j]%></nobr></a></div></td></tr>
<TR><td><img style=cursor:pointer src=image/addopt.png onclick="addonei(<%=j%>)" ></td><TD valign="middle"><select  class="selectsel" id="courseid<%=j%>" style="width:208px;font-family: inherit" name=assignname<%=j%>    onChange="clicked=true;submitform(this,'<%=j%>')"></select>
<tr height="4"><td colspan="2"></td></tr>
 
<%
}
%>

<%
if (allassigns == -1 && (user.roles & Systemroles.SYSTEMANALYST) > 0)
{
    out.println(assignSQLstr); 
}

if (newsemesterstr!=null)
{
%>
<tr><td><img src=image/tri.gif ></td><td  style="color:#DDCC11;text-shadow:-1px -1px #060606;overflow:hidden"><nobr>
<a href="javascript:openplan()"><%=Toolbox.emsgs(orgnum,1091)%></a>
</nobr></td></tr>
<tr height="4"><td colspan="2"></td></tr>
<%
}
else if (numcourses==0)
{
adapter = Toolbox.getUserAdapter(user, orgnum); 
if (DBAdmin.server2admin((adapter.server)) == null)
{
%>
<tr><td colspan="2" style=color:#DDCC11> <%=Toolbox.emsgs(orgnum,300)%>
<center>
<input class=GreenButton
 style="background-color:#00BBBB;color:white;font-weight:700;width:<%=cachedstyle.fontsize*4%>px;height:<%=cachedstyle.fontsize+6%>px"
 type=button name=submit2 
 value="<%=Toolbox.emsgs(orgnum,1429) %>"
 onclick=debg()></center>
</td></tr>
<%
}
adapter.close();
if (Toolbox.dbadmin[orgnum%65536].systemserver.equals(user.dbinfo.server))
    {
%>
    <tr><td colspan="2" style=color:#DDCC11> 
        <%= Toolbox.emsgs(orgnum,566) %>
        </td></tr>
<%
    }
else if (semester.equals(Toolbox.currentSemester))
    {
    %>
    <tr><td colspan="2" style=color:#DDCC11>
    <%=Toolbox.emsgs(orgnum,300)%><center><input class=GreenButton style="background-color:#00BBBB;color:white;font-weight:700;width:<%=cachedstyle.fontsize*4%>px;height:<%=cachedstyle.fontsize+4%>" type=button name=submit2 value="<%=  Toolbox.emsgs(orgnum,1429) %>" 
                                                                                onclick="debg()"> </center>
    </td></tr>
    <%
    }
}
else
{
if (semester.equals(Toolbox.dbadmin[orgnum%65536].currentSemester))// && numcourses >0 )
{
%>
<tr><td><img src=image/tri.gif ></td><td  style="color:#DDCC11;text-shadow:-1px -1px #060606;overflow:hidden">
<nobr><a href="javascript:openshort('<%=keys.toString()%>')"><%= Toolbox.emsgs(orgnum,52)%></a>
</nobr>
</td></tr>
<%}%>
<tr><td><img src=image/tri.gif ></td><td  style="color:#DDCC11;text-shadow:-1px -1px #060606;overflow:hidden">
<nobr><a href="DataSelect?rdap=assignsearch0&subdb=<%=user.id%>"><%=Toolbox.emsgs(orgnum,1239)%></a>
</nobr>
</td></tr>
<TR ><TD><img src=image/tri.gif ></td><td  id="toquiz" style="color:#DDCC11;text-shadow:-1px -1px #060606;overflow:hidden"><a href="javascript:swapmode('<%=mode%>')"><%=Toolbox.emsgs(orgnum,1378)%></a></td></tr>
<TR ><TD><img src=image/tri.gif ></td><td  id="toproctor"  style="color:#DDCC11;text-shadow:-1px -1px #060606;overflow:hidden"><a href="javascript:open('proctor.jsp','_blank')"><%=Toolbox.emsgs(orgnum,1516)%></a></td></tr>
<TR ><TD><img src=image/tri.gif ></td><td  id="toalert"  style="color:#DDCC11;text-shadow:-1px -1px #060606;overflow:hidden"><a href="javascript:openalert()"><%=Toolbox.emsgs(orgnum,1541)%></a></td></tr>
<TR ><TD><img src=image/tri.gif ></td><td  id="toabsence1" style="color:#DDCC11;text-shadow:-1px -1px #060606;overflow:hidden"><a href="javascript:absence(1)"><%=Toolbox.emsgs(orgnum,1598)%></a></td></tr>  

<%}%><TR ><TD colspan="2" align="center"><input type=button class=BlueButton style="width:<%= 4.5*cachedstyle.fontsize%>px" onclick=demo() value="<%=Toolbox.emsgs(orgnum,1584)%>" ></td></a></td></tr>
</tbody></TABLE>
 </form>
<%=Toolbox.sponsor(orgnum,9*numcourses/5, 210)%>

<script type="text/javascript" >
localStorage['crseass'] = '<%=backup.toString()%>';
var mode = '<%=mode%>';
var newsemester = <%=newsemesterstr!=null%>;
var bgindexjpg = '<%=Toolbox.dbadmin[orgnum%65536].bgimage%>';
var f1 = document.form1;
var allstr = "<%=(allstr)%>";

<%
for (j = 0; j < numcourses; j++)
{
%>
assgn[<%=j%>] = f1.assignname<%=j%>;
  
sindex[<%=j%>] = -1;
<%
}
  
%>

var toolmsg496 = "<%=Toolbox.emsgs(orgnum,496)%>";
var userid= "<%=user.id%>";
window.parent.document.title = "<%=Toolbox.emsgs(orgnum,296)%>";
function getRemoteAddr()
{
   return '<%=request.getRemoteAddr()%>';
}
 
<%=Toolbox.msgjspout((orgnum%65536)+user.id, true)%>
</script>
<script type="text/javascript"  src=assignmentindex.js></script>
<script type="text/javascript"  src=floating.js></script>
<script type="text/javascript"  src=curve.js></script>

</body>
</html>





