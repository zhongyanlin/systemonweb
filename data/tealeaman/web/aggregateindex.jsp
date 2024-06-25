<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR | Systemroles.TEACHINGADMIN |Systemroles.ASSESSER,application,session,request, response, "aggregateindex.jsp", true)) == null) 
    return;
orgnum = user.orgnum; 
/*String sql= "Course;SELECT Course.lastupdate,Course.id,Course.title, 1 as c, editable  FROM Course,  Session  WHERE Course.id=Session.courseid AND Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester+"' AND Session.instructor='" + user.id + "';"
          + "Session;SELECT Session.lastupdate, Session.name, Session.courseid, Session.semester,Session.allowadd,Session.allowdrop,Session.schedule,Session.room,Session.notes,Session.textbook,Session.evaluationrule,Session.seats,Session.instructor,Session.ta,Session.progress  FROM  Session  WHERE   Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester+"' AND Session.instructor='" + user.id +"';" 
          + "User;SELECT AppUser.lastupdate, AppUser.id, AppUser.roles,AppUser.firstname, AppUser.middlename,AppUser.lastname,AppUser.title,AppUser.department, AppUser.photourl FROM AppUser, Registration, Session WHERE Registration.sid=AppUser.id AND Session.name=Registration.sessionname AND Registration.courseid=Session.courseid AND Registration.semester=Session.semester AND Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester+"' AND Session.instructor='" + user.id +"';" 
          + "Registration;SELECT Registration.lastupdate, Registration.sid, Registration.courseid, Registration.sessionname, Registration.semester,evaltime, Registration.status, Registration.grade, Registration.evaluation, Registration.attendance, Registration.target,decision FROM Registration, Session WHERE Registration.semester=Session.semester And Registration.courseid=Session.courseid And Registration.sessionname=Session.name AND Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester +"' AND Session.instructor = '"+ user.id +"';";
sql = DataMove.importdata(user, sql, "backup", ""); 
 */
if ( (user = User.dbauthorize(application,session,request, response, "aggregateindex.jsp", true)) == null) 
{
    out.print("</center><font color=white><b>You don't have a database now. A instructor should have one. Ask the System Administrator to create one for you"); 
    return;
}

String semester = Toolbox.defaultParam(orgnum,request,"semester",Toolbox.dbadmin[orgnum%65536].currentSemester, null, 40);
 

String assignname="";   //count(Assignment.name)
String course = "";
String courseSQLstr = "select   Course.id, Course.title, count(Assignment.name)  as third, Session.name,Session.absentdeduct from Course, Assignment,Session  WHERE Session.courseid=Course.id AND Session.instructor='" + user.id +"' AND Assignment.course=Course.id and Assignment.semester=Session.semester AND Session.semester='" + semester.replaceAll("'", "''") +"' GROUP by Course.id, Course.title, Session.name order by Course.id, Course.title, Session.name ";
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
 
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><%=Toolbox.getMeta(orgnum)%>
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
      mypromt(txt);
      window.onerror = handleErr;
      return true;
}
window.onerror = handleErr;
}
</script>
<%
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum); 
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
String sql = "SELECT  courseid,grouping FROM Aggregation WHERE   semester='" + semester.replaceFirst("'","''") + "' AND uid='" + user.id +"'";
boolean numcourses1 = adapter.executeQuery2(sql,false); 
String courseid;
HashMap<String,String> ht = new HashMap<String,String>(4);
for (int i=0; (courseid = adapter.getValueAt(i,0))!=null ; i++)
{
     
    String gp = adapter.getValueAt(i,1);
    ht.put(courseid,gp);  
}    
int numcourses = 0;
boolean bn = adapter.executeQuery2(courseSQLstr,false);
if (bn==false)
{
adapter.close();
out.println("</head><body bgcolor=" + cachedstyle.DBGCOLOR+"><br> There was an error:" + courseSQLstr + adapter.error()); 
return;
}
 
java.util.ArrayList<String> title = new java.util.ArrayList();
if (bn)
{
out.println("<script type=\"text/javascript\" >\nvar cids = new Array( );");
out.println("var titles = new Array( );");
out.println("var selects = new Array( );");
out.println("var sessions = new Array( );");
out.println("var grouping = new Array( );");
out.println("var absentdeduct = new Array( );");
String   cid ; 
//title = new String[numcourses];
int jj=0;
for (int i = 0;   adapter.getValueAt(i,0)!=null; i++) 
{
     numcourses++;
     if (adapter.getValueAt(i,2).equals("0")==false)
     {
         cid   = adapter.getValueAt(i,0).trim();
         String tt = adapter.getValueAt(i,3); 
         String absentdeduct = adapter.getValueAt(i,4);
         if (absentdeduct == null) absentdeduct = "";
         else
             absentdeduct = absentdeduct.replaceAll("<[^>]+>","");
         if (tt==null) tt = "";
         tt = cid +"-" + tt +":" + adapter.getValueAt(i,1).trim();
         if (tt.length() > 40)
             tt = tt.substring(0,41);
         String x = ht.get(cid);
         if (x == null || x.equals("null")) x = "0"; 
         
         out.print("grouping[" + jj +"] = \"" + x  +"\";\n");
         out.print("cids[" + jj +"] = \"" + cid  +"\";\n");
         out.print("titles[" + jj +"] = \"" + tt  +"\";\n");
         out.print("sessions[" + jj +"] = \"" + adapter.getValueAt(i,3).trim()  +"\";\n");
         out.print("absentdeduct[" + jj +"] = \"" + absentdeduct  +"\";\n");
         title.add(tt);
         jj++;
     }
}
numcourses = jj;
}


adapter.close();
%>
</script>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("aggregateindex.jsp","f1")%>";</script>

<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>
<style> 
     center form table tr td table tr td select option{background-color:<%=cachedstyle.IBGCOLOR %>;color:white;}
     center form table tr td table tr td select{background-color:transparent;color:white;border:1px #c0c0c0 solid}
     center form table tr td select{background-color:transparent;color:white;border:1px #c0c0c0 solid}
     center form table tr td select option{background-color:<%=cachedstyle.IBGCOLOR %>;color:white;}
 </style>
</head>
<body style="margin:6px 12px 6px 6px;background:<%= cachedstyle.IBGCOLOR %> right url(image/backgd.gif) repeat-y">
<center> 
<%=Toolbox.logtitle(Toolbox.emsgs(orgnum,228), 200)%>
<form rel=opener   name=form1 method=post target=rightwinagg action=aggregate2.jsp style="margin:5px 0px 5px 0px"  > 
<input type=hidden name=cid>
<input type=hidden name=title>
<input type=hidden name=grouping>
<input type=hidden name=sessionname>
<input type=hidden name=absentdeduct>
<input type="hidden" name="scale" value="20,40,60,80">
                                                           
<TABLE width=100% border=0 cellpadding=2 cellspacing=1  class=outset >
<tbody> 
<tr><td  colspan=2 align="center" >
<table  align="center" cellpadding="2" cellspacing="0">
   <tr>
      <td style="color:#DDCC11;font-weight:700">
         <nobr><%=Toolbox.emsgs(orgnum,1004)%></nobr>
    </td><td>
        <select  name=semester style="font-family:inherit"  onchange="switchs(this)"><%= Toolbox.dbadmin[user.orgnum%65536].semesteropts(semester, orgnum) %>
 
</select></td></tr></table></td></tr>

<TR><td colspan=2  style="height:1px;background-color:<%=cachedstyle.IBGCOLOR%>"></td></tr>
<TR><td colspan="2" align="center" style="color:#DDCC11;font-weight:700"> <%=Toolbox.emsgs(orgnum,228)%>
</td></tr>

<% 
if (numcourses==0)
{

%>
<tr><td colspan="2" style=color:#DDCC11> <%=Toolbox.emsgs(orgnum,300)%>
<% if ( DBAdmin.server2admin(user.getDBConnectInfo().server) == null ) {%>
<center>
<input class=GreenButton  style="background-color:#00BBBB;color:white;font-weight:700;width:<%=cachedstyle.fontsize*4%>px;height:<%=cachedstyle.fontsize+6%>px"
 type=button name=submit2  value="<%=Toolbox.emsgs(orgnum,1429) %>"  onclick=debg()>
</center>
<%}%>
</td></tr>

<%
}
else {
for (int j = 0; j < numcourses; j++)
{
int ii = Toolbox.indexframewidth(cachedstyle.fontsize);
%>
<TR><TD><img src=image/tri.gif ></td>
<td><div id="varywidthdiv<%=j%>" style="width:<%=ii%>px;overflow:hidden"><nobr><a href="javascript:submitform(<%=j%>,'aggregate2.jsp')"><font  color=white><%=title.get(j)%></font> </a>  </nobr></div>
</td></tr>
<%
}
%>
<TR><td colspan=2  style="height:1px;background-color:<%=cachedstyle.IBGCOLOR%>"></td></tr>
<TR><td colspan="2" align="center" style="color:#DDCC11;font-weight:700"> <%=Toolbox.emsgs(orgnum,1372)%>
</td></tr>

<%
for (int j = 0; j < numcourses; j++)
{
int ii = Toolbox.indexframewidth(cachedstyle.fontsize);
%>
<TR><TD><img src=image/tri.gif ></td>
<td><div id="varywidthdi<%=j%>" style="width:<%=ii%>px;overflow:hidden"><nobr><a href="javascript:submitform(<%=j%>,'assessdata.jsp')"><font  color=white><%=title.get(j)%></font> </a>  </nobr></div>
</td></tr>
<%
}
%>
<TR><td colspan=2  style="height:1px;background-color:<%=cachedstyle.IBGCOLOR%>"></td></tr>
<TR><td colspan="2" align="center" style="color:#DDCC11;font-weight:700"> <%=Toolbox.emsgs(orgnum,1436)%>
</td></tr>

<%
for (int j = 0; j < numcourses; j++)
{
int ii = Toolbox.indexframewidth(cachedstyle.fontsize);
%>
<TR><TD><img src=image/tri.gif ></td>
<td><div id="varywidthdi<%=j%>" style="width:<%=ii%>px;overflow:hidden"><nobr><a href="javascript:submitform(<%=j%>,'analyzedata.jsp')"><font  color=white><%=title.get(j)%></font> </a>  </nobr></div>
</td></tr>
<%
}
}
%>
</tbody></TABLE> 
</form>
<%=Toolbox.sponsor(orgnum,numcourses*9/5, 210)%>

<script type="text/javascript" >
var ll = 0;
var f = document.form1;
for (; ll < f.semester.options.length &&
f.semester.options[ll].value!='<%=semester%>';ll++);
f.semester.selectedIndex = ll;

<% for (int j = 0; j < numcourses; j++)
{
%>
selects[<%=j%>] = document.form1.eval<%=j%>;
<%
}

 
%>

var J = 0;
function redo()
{
    grouping[J] = 1 - grouping[J];
    submitform(J, 'aggregate2.jsp');
}
function submitform(j,s)
{
   if (typeof changeFlag == 'function')
   {
      changeFlag(cids[j],false);
   }
   J = j;
   document.form1.cid.value = cids[j];
   document.form1.title.value = titles[j];
   document.form1.sessionname.value = sessions[j];
   document.form1.grouping.value = grouping[j];
   document.form1.absentdeduct.value = absentdeduct[j];
   formnewaction(document.form1,s);
   
   visual(document.form1);
document.form1.submit();
}

function cust(scale)
{
   document.form1.scale.value = scale; 
   submitform(J,'assessdata.jsp');
}

function checkgrouping(tt)
{
  // document.form1.grouping.checked = tt;
}



function switchs(sel)
{
   postopen("aggregateindex.jsp",['semester'],[sel.options[sel.selectedIndex].value],"_self");
   //document.location.href = "aggregateindex.jsp?semester=" + sel.options[sel.selectedIndex].value;
}
</script>
<script type="text/javascript"  src=floating.js></script>

<script type="text/javascript"  src=curve.js></script>
<script>
function setGrouping(g)
{
    grouping[J] = g;
}
 function debg()
{
    open('follows.jsp?x=mycourse',parent.frames[1].name);
}
<% if (semester.equals(Toolbox.dbadmin[orgnum%65536].currentSemester))
{
%>
var onloadbeforagg = null;
if (typeof window.onload == 'function')
    onloadbeforagg = window.onload;
window.onload = function()
{
    if (onloadbeforagg != null) 
        onloadbeforagg();
    var x = parent.frames[1].document.createElement('div');
    x.innerHTML = "<%=Toolbox.emsgs(orgnum,840)%>";
    parent.frames[1].document.body.appendChild(x);
}

<%
}
%>
var txtbuff = [];
function setm(c,s,j,t)
{
    txtbuff[c + '_' + s + '_' + j] = t;
}
function getm(c,s,j)
{
    return txtbuff[c + '_' + s + '_' + j];
}
</script>
</body>
</html>
