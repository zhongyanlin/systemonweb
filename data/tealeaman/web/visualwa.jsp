<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum,  Systemroles.INSTRUCTOR|Systemroles.TEACHINGADMIN |Systemroles.ASSESSER,application,session,request, response, "visualwa.jsp", true)) == null) 
    return;
orgnum = user.orgnum; 
 
String course =  (Toolbox.defaultParam(orgnum,request,"course",null, null, 30)); 
if (course == null) return;
String sessionname =  (Toolbox.defaultParam(orgnum,request,"sessionname","", "-._", 30));
String assignname =  (Toolbox.defaultParam(orgnum,request,"assignname",null, "-._", 50));
String subdb =  (Toolbox.defaultParam(orgnum,request,"subdb","", null, 30));
String sid  =  (Toolbox.defaultParam(orgnum,request,"sid",null,  null, 30));
String semester  =   Toolbox.defaultParam(orgnum,request,"semester",Toolbox.dbadmin[orgnum%65536].currentSemester, null, 40);
String normal = (Toolbox.defaultParam(orgnum,request,"normal","true", null, 10));
String questionnum = (Toolbox.defaultParam(orgnum,request,"questionnum",null, null, 10));
user.changedb(subdb);
 
String str = "checkgrades.jsp?subdb="+Toolbox.urlencode(subdb)  + "&course=" +  Toolbox.urlencode(course) +"&sid=" + sid +"&assignname=" + Toolbox.urlencode(assignname)+"&semester=" + Toolbox.urlencode(semester)+"&sessions=" + Toolbox.urlencode(sessionname);
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);


if (!adapter.error().equals(""))
{
   out.print(Toolbox.emsgs(orgnum,113) + ":" + adapter.error());
   adapter.close();
   return;
}
String way = "";
if (course!=null)
course = course.replaceAll("'","''");
if (sessionname!=null) 
sessionname = sessionname.replaceAll("'","''");
if (assignname!=null)
assignname = assignname.replaceAll("'","''");
String query="";
if (sid == null && assignname!=null)
{
way = "group"; 
query =  "SELECT Registration.sid,Subactivity.activities FROM Registration, Subactivity where Registration.sid=Subactivity.sid" 
        + " AND Registration.semester=Subactivity.semester AND Registration.semester='" 
        + semester.replaceAll("'","''") +"' AND Registration.courseid=Subactivity.course  AND Registration.courseid='" 
        + course.replaceAll("'","''") +"' and Registration.sessionname = '" 
        + sessionname.replaceAll("'","''")+"' and Subactivity.assignname = '" 
        + assignname.replaceAll("'","''")+"' ORDER BY 1;";
}
else if (assignname == null && sid!=null) 
{
    way = "all";
     query =  "SELECT Subactivity.assignname,Subactivity.activities FROM Subactivity where " 
        + " Subactivity.semester='" 
        + semester.replaceAll("'","''") +"' AND Subactivity.course='" 
        + course.replaceAll("'","''") +"'  and   Subactivity.sid = '" 
        + sid.replaceAll("'","''")+"' ORDER BY 1"; 
}
else if (assignname != null && sid!=null) 
{
    String deleteit =  (Toolbox.defaultParam(orgnum,request,"deleteit",null));
    if (deleteit == null)
    {
        query =  "DELETE FROM Subactivity WHERE  semester='" 
        + semester.replaceAll("'","''") +"' AND course='" 
        + course.replaceAll("'","''") +"' AND assignname = '" 
        + assignname.replaceAll("'","''")+"' AND sid = '" 
        + sid.replaceAll("'","''")+"'";
        adapter.executeUpdate(query);
        adapter.close();
  
 %>

<jsp:forward  page="visualwa.jsp">
<jsp:param name="course"  value="<%=course%>" />
<jsp:param name="semester"  value="<%=semester%>" />
<jsp:param name="sessionname"   value="<%= sessionname%>" />
<jsp:param name="assignname"  value="<%= assignname%>" />
<jsp:param name="sid"  value="<%=sid%>" />
<jsp:param name="normal"  value="<%=normal%>" />
<jsp:param name="subdb"   value="<%=subdb%>" />
</jsp:forward>
    <%       
        return;
    }
    else
    {
        way = "single";
        query =  "SELECT Subactivity.assignname,Subactivity.activities FROM Subactivity where " 
        + "  Subactivity.semester='" 
        + semester.replaceAll("'","''") +"' AND Subactivity.course='" 
        + course.replaceAll("'","''") +"' and   Subactivity.assignname = '" 
        + assignname.replaceAll("'","''")+"' and   Subactivity.sid = '" 
        + sid.replaceAll("'","''")+"';";
    }
}
else
{
    adapter.close();
    return;
}
boolean bb = adapter.executeQuery2(query,false); 
StringBuffer sids = new StringBuffer();
StringBuffer acts = new StringBuffer();
String xx;
if (bb)
for (int i=0; (xx = adapter.getValueAt(i,0))!=null; i++)
{
    if (i>0){sids.append(";");acts.append(";");}
    sids.append(xx);
    acts.append(adapter.getValueAt(i,1));
}
adapter.close();
 
%>
<!DOCTYPE html> 
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>

<title>Windows Activities</title>

<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script>
<script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
<script type=text/javascript  src=cookie.js></script>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("visualwa.jsp","f1")%>";</script>
<script>
    var font_size = <%=user.fontsize%>;
    var course = '<%=course%>';
    var assignname = '<%=assignname%>';
    var sid = "<%=sid%>";
    var sessionname = "<%=sessionname%>";
    var normal = <%=normal%>;
    var subdb = "<%=subdb%>";
    var timeformat = "<%=cachedstyle.timeformat%>";
    var questionnum = <%=""+questionnum%>;
    var wd = screen.width-40;
    if (parent!=window) wd -= 230;
    var semester = "<%=semester%>";
    var msg1583 = "<%=Toolbox.emsgs(orgnum,1583)%>";
    var msg238 = "<%=Toolbox.emsgs(orgnum,238)%>";
    var msg386 = "<%=Toolbox.emsgs(orgnum,386)%>";
    var way = '<%=way%>';
</script>


<style> div.dotmark{width:16px;height:16px;border-radius:8px;margin:0px 0px 0px 0px}</style>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
<link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type=text/javascript  src=goweb.js></script>
<script type=text/javascript  src=viewactivity.js></script>
<script type=text/javascript  src=timeformat.js></script>
<style> .label1{padding:4px 4px 4px 4px;background:linear-gradient(<%=cachedstyle.IBGCOLOR%>,<%=Toolbox.headercl(cachedstyle.IBGCOLOR)%>) <%=cachedstyle.IBGCOLOR%> repeat-x;font-size:20px;color:#DDCC11;text-shadow:#707070 -1px -1px;margin:0px 0px 5px 0px;border-radius:3px;width:100%}</style>
</head> 

<body style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px" >
   
<%if (acts.length() == 0){%>
  <%=Toolbox.emsgs(orgnum,1583)%> = 0
<%} else  if (way.equals("group")){%>
<script> viewgroup('session',course,assignname,"<%=sids%>".split(/;/),"<%=acts%>".split(/;/),wd,30);</script>
<% } else if (way.equals("all")){%>
<script> viewgroup('sid',course, sid,"<%=sids%>".split(/;/),"<%=acts%>".split(/;/),wd,30);</script> 
<% } else if (way.equals("single")){%>
<script> viewsingle(course,assignname,sid,"<%=acts%>",wd, 30,normal);</script>
<% }else{}%> 
<div id="end"><!----></div>
<script type=text/javascript  src=curve.js></script>
</body>
</html>        
 
