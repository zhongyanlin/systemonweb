<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR,application,session,request, response, "embedquizindex.jsp", true)) == null)
    return;
orgnum = user.orgnum; 
if ( (user = User.dbauthorize(application,session,request, response, "embedquizindex.jsp", true)) == null)
{
    out.print("</center><font color=white><b>You don't have a database now. A instructor should have one. Ask the System Administrator to create one for you");
    return;
}
String subdb = user.id;
user.changedb(subdb);

String semester =  Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("semester"), null), null, 30);
if (semester==null) semester = Toolbox.dbadmin[orgnum%65536].currentSemester;
String newsemesterstr =  Toolbox.defaultParam(orgnum,request,"newsemester",null);
boolean newsemester =  (newsemesterstr!=null && newsemesterstr.equals("1"));
String mode = Toolbox.defaultParam(orgnum,request,"mode","quiz");

String assignname="";
String course = "";
String sessionname = "";
String courseTitle = "";




JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (adapter.error().length() > 0)
{
    adapter.close();
    User.dberrorRelogin(application,session,request,response,"gradeindex.jsp");
    return;
}


String courseSQLstr = "select distinct Course.id, Course.title,Session.name, TimeSlot.timeslot from Course, Session, TimeSlot  WHERE session.schedule=TimeSlot.num AND  Session.courseid=Course.id AND Session.instructor='" + user.id +"' AND  Session.semester='" + semester.replaceAll("'","''") +"' order by Course.id, Session.name";
//String assignSQLstr = "select distinct Assignment.course, Assignment.name,Session.name,Assignment.sessionname, due from Assignment, Course,Session where Session.name=Assignment.sessionname AND Course.id=Assignment.course AND Session.courseid=Course.id AND Session.instructor='" + user.id +"' AND Session.semester=Assignment.semester AND  Session.semester='" + semester.replaceAll("'","''") +"' AND atype=4   order by Assignment.course, Session.name,Assignment.name";
//out.println("<!--" + courseSQLstr +"-->");
//out.println("<!--" + assignSQLstr +"-->");
int numcourses = 0;
boolean bb = adapter.executeQuery2(courseSQLstr,false); 
out.println("<!--" + numcourses +"-->");
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%><title><%=Toolbox.emsgs(orgnum,461)%></title>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<style>
A:link {  COLOR: #FFFFFF;TEXT-DECORATION: none}
A:visited {COLOR: #FFFFFF;TEXT-DECORATION: none}
A:hover{COLOR: #DDCC11;TEXT-DECORATION: underline}
BODY {background-color:<%=cachedstyle.IBGCOLOR%>;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-weight:680}
select {margin:0px;padding:0px;background-color:transparent;color:black;border-width:0px;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>}
input{margin:0px;padding:0px;background-color:<%=cachedstyle.TBGCOLOR%>;color:black;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;vertical-align:middle;}
</style>
 

<%
if (!bb)
{
adapter.close();
out.println("<body bgcolor=" + cachedstyle.DBGCOLOR+"><br> There is no courses:" + adapter.error()+ courseSQLstr) ;
return;
}
String [] sessa = new String[100];
String [] cid =   new String[100];
String [] title = new String[100];
String [] timeslot = new String[100];
int j = 0;
String sess = "";
String allcourses = "";
String allcoursesession = "";
for (int i = 0; bb && adapter.getValueAt(i,0)!=null; i++)
{
     numcourses++;
     String sa = adapter.getValueAt(i,0).trim();
     if (allcourses.indexOf("'" + sa + "'") < 0 )
         allcourses += ",'" + sa + "'";
     String value  = adapter.getValueAt(i,1);
     sess += "," + adapter.getValueAt(i,2);
     if (value == null)
     {
        value="";
     }
    // if (i==numcourses-1 || !adapter.getValueAt(i+1,0).trim().equals(sa))
     {
         cid[i] = sa;
         title[i] = value.trim();
         sessa[i] =  adapter.getValueAt(i,2); //sess.substring(1);
         timeslot[i] = adapter.getValueAt(i,3);
        // sess="";
         j++;
     }
     allcoursesession += " OR course='" + sa + "' AND sessionname='" + sessa[i] + "'";
}
numcourses = j;

Vector<String> sqs = new Vector();
String sql0 = "SELECT course,name,sessionname FROM Assignment where atype=4 and sessionname LIKE '%,%' and semester='" + semester +"' AND course IN (" + allcourses.substring(1) + ")";
int n = 0;
bb = adapter.executeQuery2(sql0,false);
for ( j=0; bb && adapter.getValueAt(j,0)!=null; j++)  
{
    String cd =  adapter.getValueAt(j, 0); 
    String an =  adapter.getValueAt(j, 1); 
    String ss =  adapter.getValueAt(j, 2); 
    if (ss.indexOf(",") < 0 || an == null) break;
    String sn[] = ss.trim().split(",");
    for (int i=0; i < sn.length-1; i++)
    {
        StringBuffer sb = new StringBuffer(300);
        sb.append("INSERT INTO Assignment (lastupdate,name,course,semester,sessionname,start,due,question,answer,format,atype,options,status,scale,weight,assgroup,grader,assess) SELECT FROM lastupdate,name,course,semester,'");
        sb.append( sn[i]); sb.append("',start,due,question,answer,format,atype,options,status,scale,weight,assgroup,grader,assess FROM Assignment where course='" );
        sb.append( cd);    sb.append("' and name='" );
        sb.append( an);    sb.append("' and sessionname='" );
        sb.append( ss);    sb.append("' and semester='"  );
        sb.append( semester +"'" );
        sqs.addElement(sb.toString());
    }
    StringBuffer sb = new StringBuffer(300);
    sb.append("UPDATE  Assignment SET sessionname='");   sb.append(sn[sn.length-1]); 
    sb.append("' WHERE course='");   sb.append(cd); 
    sb.append("' AND name='");   sb.append(an); 
    sb.append("' AND sessionname='"); sb.append(ss); 
    sb.append("' AND semester='"); sb.append(semester); sb.append("'" );
    sqs.addElement(sb.toString());
}
for (int i=0; i < sqs.size(); i++)
    adapter.executeUpdate(sqs.elementAt(i));
%>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("embedquizindex.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
 <script type="text/javascript" >
     
 var currentSemester = '<%=Toolbox.dbadmin[orgnum%65536].currentSemester %>';
 document.write(unifontstyle(<%=cachedstyle.fontsize%>));
 var semester = '<%=semester%>';
 var numcourses = <%= numcourses %>;
 var AN = new Array(numcourses);
 var cid =   [<%for(j=0;j<numcourses;j++)out.print("\""+ Generic.handle(cid[j])+"\",");%>''];
 var ctitle= [<%for(j=0;j<numcourses;j++)out.print("\""+ Generic.handle(title[j])+"\",");%>''];
 var sess=   [<%for(j=0;j<numcourses;j++)out.print("\""+ Generic.handle(sessa[j])+"\",");%>''];
 var timeslot = [<%for(j=0;j<numcourses;j++)out.print("\""+ Generic.handle(timeslot[j])+"\",");%>''];
 var numassigns = [<%for(j=0;j<numcourses-1;j++)out.print("0,");out.print("0");%>];
 var encoding = "<%= Toolbox.encodings[orgnum>>16] %>";
 var langcode = "<%= Toolbox.langs[orgnum>>16]%>";
 var timenowsec = <%=System.currentTimeMillis()%> - (new Date()).getTime() ;
 <%
int allassigns = 0;
String assignSQLstr = "select distinct Assignment.course, Assignment.name,  Assignment.sessionname, Assignment.due FROM Assignment  WHERE semester='" + semester.replaceAll("'","''") +"' AND atype=4 AND (" + allcoursesession.substring(3) + ") order by Assignment.course, Assignment.name";
bb = adapter.executeQuery2(assignSQLstr,false);
int  kk = 0,    jj= 0;
String cr="", as, ss;
HashMap<String,Integer> cs2n = new HashMap<String,Integer>();
HashMap<String,String> cs2d = new HashMap<String,String>();
long nowtime = System.currentTimeMillis();
long lastdues = 0;
String lastdue;
for( j = 0;  ; j++ ) 
{
    String s1 = adapter.getValueAt(j,0);
    String s2 = adapter.getValueAt(j,2);
    if (s1!=null) s1=s1.trim();
    if (s2!=null) s2=s2.trim();
    
    if (j>0 &&  !cr.equals(s1 + "-" + s2)  )
   {
      out.println("''];");
      out.print("numassigns["+jj+"] = " + kk + ";\n");
      lastdues = 0;
   }
    if (s1==null | s2==null) break;
    if (j == 0  || !cr.equals(s1 + "-" + s2) )
    {
         for (jj=0; jj < numcourses && !( cid[jj] + '-' + sessa[jj] ).equals(s1 + "-" + s2); jj++);
         out.print("AN[" + jj + "]=[");
         kk = 0;
    }
    
    allassigns++;
    cr  = s1 + '-' + s2; 
    as  = adapter.getValueAt(j,1).trim();
    ss  = adapter.getValueAt(j,2).trim();
    
    String cr1 = cr.replaceFirst("\\-([^\\-]+)$",",$1");
    Integer x = cs2n.get(cr1 );
    if (x == null) 
       cs2n.put(cr1  , new Integer(1));
    else
       cs2n.put(cr1  , new Integer(1+x.intValue()));
    long due =  Long.parseLong(adapter.getValueAt(j,3).trim());
    
    if (due*1000 < nowtime && due > lastdues)
    {
       lastdues = due; 
       lastdue = adapter.getValueAt(j,1).trim();
       int k=0; 
       for (; k < title.length; k++) 
       {
           if (adapter.getValueAt(j,0).trim().equals(cid[k])) break; 
       }
       cs2d.put(cr1  , lastdue + "," + title[k]);
    }
    
    if (("," + ss + ",").indexOf("," + sessa[jj] +",") >=0)
   {
        out.print ("\""+Generic.handle(as)+"\",");
        kk++;
   }
   
}
adapter.close();
String allstr = ""; 
java.util.Set<String> e = cs2n.keySet();
for (String cs:e) 
{
    if (cs2d.get(cs)!=null)
    allstr  += cs + "," + cs2n.get(cs) + "," + cs2d.get(cs) + ";";
}
 
long y = (new java.util.Date()).getTime()/1000;
%>
var allstr = "<%=Toolbox1.tonum(allstr)%>";
</script>
 <%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
 <style> 
     center form table tr td table tr td select option{background-color:<%=cachedstyle.IBGCOLOR %>;color:white;}
     center form table tr td table tr td select{background-color:transparent;color:white;border:1px #c0c0c0 solid}
     center form table tr td select{background-color:transparent;color:white;border:1px #c0c0c0 solid}
 </style>
</head>

<body style="margin:6px 12px 6px 6px;background:<%= cachedstyle.IBGCOLOR %> right url(image/backgd.gif) repeat-y">
<Center>
 
<%=Toolbox.logtitle(Toolbox.emsgs(orgnum,1378), 200)%>

<form rel=opener   name=form1 method=post target=rightwingrades action=DataTable style="margin:5px 0px 5px 0px"  >
<input type=hidden name=rdap value="allembedquiz">
<input type=hidden name=course>
<input type=hidden name=mode value="make">
<input type=hidden name=start>
<input type=hidden name=assignname>
<input type=hidden name=sessionname>
<input type=hidden name=coursetitle>
<input type="hidden" name="quizdue">
<input type=hidden name=subdb value="<%=subdb%>">
<TABLE width=100% class=outset bgcolor=#DDCC11 cellpadding=1 cellspacing=0>
<tr height=28><td  colspan=2 align="center" >
<table  align="center" cellpadding="0" cellspacing="0"><tr><td style="color:#DDCC11;font-weight:700;text-shadow:-1px -1px #060606;overflow:hidden"><nobr><%=Toolbox.emsgs(orgnum,1004)%></nobr>
</td><td><select name=semester  style="font-family:inherit"   onchange="switchs(this)"><%= Toolbox.dbadmin[user.orgnum%65536].semesteropts(semester, orgnum) %>
</select> </td></tr></table></td></tr>

<%
 
if (numcourses==0 && !Toolbox.dbadmin[orgnum%65536].systemserver.equals( user.dbinfo.server) )
{ 
%>
<tr><td colspan="2"   style=color:#DDCC11><%=Toolbox.emsgs(orgnum,300)%>
<center><input class=GreenButton style="background-color:#00BBBB;color:white;font-weight:700;width:<%=cachedstyle.fontsize*4%>px;height:<%=cachedstyle.fontsize+6%>px" type=button name=submit2 value="<%=  Toolbox.emsgs(orgnum,1429) %>" onclick=debg()>
</center>
</td></tr>
<%
}
long tstmp = System.currentTimeMillis()/1000;
int ii = Toolbox.indexframewidth(cachedstyle.fontsize);
for (j = 0; j < numcourses; j++)
{ 
%><TR height="3"><TD colspan="2"> </TD></tr>
<TR><TD  ><img src=image/tri.gif></td><td  style="color:#DDCC11;font-weight:700;text-shadow:-1px -1px #060606;overflow:hidden"><div id="varywidthdiv<%=j%>" style="width:<%=ii%>px;overflow:hidden"><nobr><a href="javascript:submitform(document.form1.assignname<%=j%>,<%=j%>)"><%=cid[j] +'-' + sessa[j] + ' ' + title[j]%></a></nobr></div></td></tr>
<TR><TD  >&nbsp;</td><td  ><select style="width:208px;font-family: inherit" name=assignname<%=j%>   onClick ="javascript:clicked=true"  onchange="submitform(this,<%=j%>)"></select>
</TD></TR>
<TR height="6"><TD colspan="2"></TD></tr>
<%
}
%>
<TR height="4"><TD colspan="2"></td></tr>
<TR ><TD><img src=image/tri.gif ></td><td  style="font-weight:700;text-shadow:-1px -1px #060606;overflow:hidden"><a href="javascript:swapmode()"><%=Toolbox.emsgs(orgnum,296)%></a></td></tr>
<TR ><TD><img src=image/tri.gif ></td><td  style="font-weight:700;text-shadow:-1px -1px #060606;overflow:hidden"><a href="javascript:openalert()"><%=Toolbox.emsgs(orgnum,1541)%></a></td></tr>
</TABLE>
</form>

<%=Toolbox.sponsor(orgnum,numcourses*9/5, 210)%>


<script type="text/javascript" >
var assign = new Array(numcourses);
var sindex = new Array(numcourses);
<% for (j = 0; j < numcourses; j++)
{
%>   assign[<%=j%>] = document.form1.assignname<%=j%>;
    sindex[<%=j%>] = -1;
<%
}
%>  
function getSubdb(){return '<%=subdb%>';}
var msg468 = "<%=Toolbox.emsgs(orgnum,468)%>";
var textmsg496 = '<%=Toolbox.emsgs(orgnum,496)%>';
 
</script> 
<script type="text/javascript"  src=embedquizindex.js></script>
<script type="text/javascript"  src=floating.js></script>
<script type="text/javascript" >
function openalert()
{
   open("alerta.jsp?coursesessiontimes=" + allstr + "&x=1", parent.frames[1].name);
} 
<% 
assignname = Toolbox.defaultParam(orgnum,request, "assignname", null,"#,'!@$%^&*-+",50);
course = Toolbox.defaultParam(orgnum,request, "course", null,",'-",20);

if (assignname!=null && course!=null && !course.equals("All Courses"))
{
%>
    var onloadbeforeembq  = null;
    if (typeof window.onload == 'function')
       onloadbeforeembq = window.onload;
    window.onload=function()
    {
        if (onloadbeforeembq!=null) onloadbeforeembq();
        openinit('<%=course%>','<%=assignname%>');
    } 
<%
} 
else
{%>
  onload = openalert;
<%}
%> 
</script>
 <script type="text/javascript"  src=curve.js></script>
 
</body>
</html>
