<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.io.*,java.util.*,java.util.regex.*" %>
<% 
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
long tstmp = System.currentTimeMillis()%10000000;
if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR,application,session,request, response, "talkindex.jsp", true)) == null) 
    return;
orgnum=user.orgnum;
if ( (user = User.dbauthorize(application,session,request, response, "talkindex.jsp", true)) == null) 
{
   
}

String semester = Toolbox.defaultParam(orgnum,request,"semester",Toolbox.dbadmin[orgnum%65536].currentSemester, null, 40);
 

String assignname="";   //count(Assignment.name)
String course = "";
String courseSQLstr = "select   Course.id, Course.title, Session.name from Course, Session  WHERE Session.courseid=Course.id AND (Session.instructor='" + user.id +"' or Session.ta='" + user.id +"')  AND Session.semester='" + semester  +"' UNION "
 + "SELECT Project.id, Project.title,'' FROM Project, ProjectMem WHERE Project.id=ProjectMem.pid and ProjectMem.uid='" + user.id + "' Order by 1, 2, 3";
%>
<!-- <%=courseSQLstr %> -->
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<style type="text/css"> 
a:link
{
    color: #FFFFFF;
    text-decoration: none
}
a:visited
{
    color: #FFFFFF;
    text-decoration: none
}
a:hover
{
    color: #DDCC11;
    text-decoration: underline
}
</style>
<%
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum); 
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
int numcourses = adapter.executeQuery(courseSQLstr);
if (numcourses < 0)
{
adapter.close();
//out.println("</head><body bgcolor=" + cachedstyle.DBGCOLOR+"><br> There was an error:" + courseSQLstr + adapter.error()); 
numcourses = 0;
//return;
}
/*else if (numcourses==0)
{
    out.println("</head><body bgcolor=" + cachedstyle.DBGCOLOR+"><br>Number of Courses that have assignments:0");
    adapter.close();
    return;
}*/
String [] title =null;
String count [] = null;
out.println("<script type=text/javascript >");
out.println("var titles = new Array();");
long tnow = System.currentTimeMillis()-24*3600000;
File f = new File(user.webFileFolder + File.separator+ UploadFile.pfolders[7]);
 File [] lt = f.listFiles();
 if (lt!=null && lt.length>0)
 for (int j=0; j < lt.length; j++)
 {
     if (lt[j].lastModified() < tnow )
         lt[j].delete();
 }
if (numcourses>0)
{
    String   cid ; 
    title = new String[numcourses];
    count = new String[numcourses];
    int jj=0;
    for (int i = 0; i < numcourses; i++) 
    {
         cid   = adapter.getValueAt(i,0).trim();
         String tt = adapter.getValueAt(i,2); 
         if (!tt.equals("")) tt = "-" + tt;
         String ctitle = adapter.getValueAt(i,1);
         //if (ctitle.length() > 27)  ctitle = ctitle.substring(0,27);
         title[jj] = cid + tt + ":" + ctitle;
         if (title[jj].length() > 33)  
             title[jj] = title[jj].substring(0,33);
         if (tt==null) tt = ""; 
         count[jj]  =  "0";
         String bs = null;
         MsgTopic mq = MsgTopic.search(orgnum,"chat", title[jj]);
             if (mq !=null)
                 count[jj]  = "" + mq.subscribes.size();
         out.print("titles[" + jj +"] = \"" + title[jj]  +"\";\n");
         jj++;
    }
    numcourses = jj;
}
adapter.close();
int ii = Toolbox.indexframewidth(cachedstyle.fontsize)-10;
String advising = Toolbox.makeFullName(user.lastname,"",user.firstname)+':' + Toolbox.emsgs(orgnum,1407);
String ad = null;
MsgTopic mq = MsgTopic.search(orgnum,"chat", advising);
    if (mq !=null)
        ad = mq.subscribes.toString().replace("[", "").replace("]", "");
 
int nad = (ad==null || ad.equals(""))?  0  : ad.split(",").length;
%>
titles[titles.length] = ['<!--<%=user.id%>--><%=Toolbox.makeFullName(user.lastname,"",user.firstname) + ':' + Toolbox.emsgs(orgnum,1407)%>'];
function  getdivwidth(){ return <%=ii%>;}
</script>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("talkindex.jsp","f1")%>";</script>

<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>

</head>
<body style="font-size:<%=cachedstyle.fontsize-1%>px;margin:6px 12px 6px 6px;background:<%= cachedstyle.IBGCOLOR %> right url(image/backgd.gif) repeat-y">
<center> 
<%=Toolbox.logtitle(Toolbox.emsgs(orgnum,58), 200)%>
<form rel=opener   name=form1 method=post target=rightwinagg action=aggregate2.jsp style="margin:3px 0px 2px 0px"  > 
<input type=hidden name=cid>
<input type=hidden name=title>
<input type=hidden name=sessionname>
<input type="hidden" name="scale" value="20,40,60,80">
                                                           
<table width=100% border=0 cellpadding=2 cellspacing=1  class=outset id="menu"   >
<tr><td></td><td></td><td></td></tr>
<% 
int j = 0;
for ( j = 0; j < numcourses; j++)
{
%>
<tr>
<td><img src="image/tri.gif" ></td>
<td align="left"  id="varywidthdiv<%=j%>" style="white-space:nowrap;width:<%=ii%>px;overflow:hidden;color:white" onclick="starttalk(<%=j%>)" ><%=title[j]%> 
</td>
<td id="count<%=j%>" style="color:white">(<%= count[j] %>)</td>
</tr>
<%
}
%>
<tr>
<td><img src="image/tri.gif" ></td>
<td align="left" id="varywidthdiv<%=j%>" 
    style="white-space:nowrap;width:<%=ii%>px;overflow:hidden;color:white" 
    onclick="starttalk(<%=j%>)"> <!--<%=user.id%>--><%=advising%>
</td>
<td  id="count<%=j%>" style="color:white">(<%= nad  %>)</td>
</TABLE>


<TABLE width=100% border=0 cellpadding=0 cellspacing=1  class=outset > 
<tr><td colspan=3  ></td></tr>
<tr><td><input type="checkbox" onclick="parent.frames[1].Chat.setSupress(this)"></td><td colspan=2 align=left style="width:<%=ii%>px !important;overflow:hidden !important;color:white"  ><nobr><%=Toolbox.emsgs(orgnum,1408)%></nobr></td></tr>
<TR><TD><img src="image/tri.gif" ></td><td><input name="newtopic" style="font-size:<%=cachedstyle.fontsize-2%>px;width:150px" size="18"></td><td onclick="startnew(this)" style="color:white"><b><img style="board:0px" src="image/addopt.png"></b></td></tr>        
</table>
</form>

</center>
    <%=Toolbox.sponsor(orgnum,numcourses*9/5, 210)%>
 

<script type="text/javascript" >
<% if (numcourses>=0) {%>
function starttalk(j)
{
   parent.frames[1].start(titles[j],titles);
}

<%}%>

function starttalk1(a)
{
    parent.frames[1].start(parent.frames[1].Chat.trim(a.innerHTML),titles);
}
var lastnews = '';
function lastnew()
{
   return lastnews; 
}
function passtitle(){return titles;}

function startnew()
{
    if (document.form1.newtopic.value == 'go game' || document.form1.newtopic.value == 'weiqi')
    {
        window.open('go.jsp', parent.frames[1].name);
        return;
    }
    lastnews = document.form1.newtopic.value;
    lastnews = parent.frames[1].Chat.trim(lastnews);
    alert(lastnews + "|" + titles);
    parent.frames[1].start(lastnews,titles);
    document.form1.newtopic.value = '';
}
function closeallchat(sek)
{
   document.form3.sek.value=sek;
   visual(document.form3);
document.form3.submit();
}

function modifycell(i,n,s,notcourse)
{
    var tbl = document.getElementById("menu");
    if (tbl == null || tbl.tagName.toLowerCase() != 'table')
        return;
    let c2 = document.getElementById('count' + i);
    if (i < 0|| i>= tbl.rows.length)
        return;
    if (s != null && c2!=null)
    {
        c2.innerHTML = "(" + n + ")<" + "!" + "--" + s + "--" + ">";
        c2.onclick = function()
        {
             parent.frames[1].Chat.viewinfo(this);
        }
     }
     else if (n == '0' && notcourse)
     {
          tbl.deleteRow(i);
     }
     else if (c2!=null)
     {
          c2.innerHTML = c2.innerHTML.replace(/[0-9]+/, "" + n);
     }
}

var onloadbeforetkindex = null;
if (typeof window.onload == 'function')
    onloadbeforetkindex = window.onload;
window.onload = function()
{
    if (onloadbeforetkindex!=null)
        onloadbeforetkindex();
    var sek = '<%= SessionCount.enq(session.getId())%>';
    Msg.init({app:'chat',sek:sek}); 
}
 
</script>
<script type="text/javascript"  src=floating.js></script>
<script type="text/javascript"  src=curve.js></script>
<iframe name="w<%=tstmp%>" width="1" height="1"  style="visibility:hidden" src="" />
</body>
</html>

