<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
    User user = (User)(session.getAttribute("User"));
    
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">  
<%= Toolbox.getMeta(orgnum)%>
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("studentquizfrm.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
</head>
<%
 
 long tstmp = System.currentTimeMillis()%10000000;
 String ways = Toolbox.defaultParam(orgnum,request, "ways", null,null,10);
 //ways = null, time=100000 20000, 
if (ways!=null && ways.equals("furt"))
{
 
if (  (user = User.authorize(orgnum,Systemroles.TA| Systemroles.STUDENT|Systemroles.INSTRUCTOR|Systemroles.TEACHINGADMIN,application,session,request, response, "studentquizfrm.jsp", true)) == null|| !Toolbox.verifytoken(request))
 return;
orgnum=user.orgnum;
long now = System.currentTimeMillis()/1000;
String addr = request.getRemoteAddr();
String course =  Toolbox.defaultParam(orgnum,request,"course","",null,20);
String coursetitle =  Toolbox.defaultParam(orgnum,request,"coursetitle","", "!@#$%&()-_+:/", 100);
String subdb =  Toolbox.defaultParam(orgnum,request,"subdb","", null, 20);
if (user.roles == Systemroles.STUDENT)  
{
    user.iid = subdb;
    session.setAttribute("User", user);
}
String sid = Toolbox.defaultParam(orgnum,request,"sid",user.id, null, 20);
if (!user.id.equals(sid) && (Systemroles.TEACHINGADMIN | user.roles ) == 0 && (Systemroles.INSTRUCTOR | user.roles ) == 0 )
 return;
String quiznow =   Toolbox.defaultParam(orgnum,request,"quiznow","0", null,5); 
 
String assignname =  Toolbox.defaultParam(orgnum,request,"quizname", null, "@!#$%&*()-+=[]|:'", 40); 
user.changedb(subdb);
String semester = Toolbox.dbadmin[orgnum%65536].currentSemester;
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
String sq = "SELECT  Assignment.name,  Assignment.start, Assignment.due, Assignment.course FROM Assignment,Registration WHERE Registration.courseid=Assignment.course AND Assignment.course='" 
        + course.replaceAll("'", "''") + "' AND  Assignment.atype=4 AND Assignment.sessionname=Registration.sessionname AND Registration.semester=Assignment.semester AND Registration.sid='" 
        + sid.replaceAll("'", "''") + "' AND start <= " + now + " AND " + now + " <= due " 
        + ((assignname!=null)?(" AND Assignment.name='" + assignname.replaceAll("'", "''") + "'"):"") + " UNION SELECT Assignment.name, Assignment.start, Assignment.due, Assignment.course  FROM Assignment,Session WHERE Session.courseid=Assignment.course AND Assignment.course='" 
        + course.replaceAll("'", "''") + "' and Assignment.atype=4 AND Assignment.sessionname=Session.name AND Session.semester=Assignment.semester AND (Session.instructor='" 
        + user.id.replaceAll("'", "''") + "' OR Session.ta='"   + user.id + "') AND start <= " + now + " AND " + now + " <= due " 
        + ((assignname!=null)?(" AND Assignment.name='" + assignname.replaceAll("'", "''") + "'"):"") + " order by 2";

int n = adapter.executeQuery(sq);
 
adapter.close(); 
if (n > 1)
{
    
    %>
     <script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
 <link rel="stylesheet" type="text/css" href="stylea.css" />

<body style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px;font-size:20px">
     
    <%= Toolbox.title("1+ " + Toolbox.emsgs(orgnum,1378)) %> <br>
    <br>
    
    <table align=center width="60%" style="border-radius:4px" border="2"><tr><td><table style="border-collapse:collapse" class="outset3" width="100%"   border="1" >
             <tr style="background:<%=cachedstyle.BBGCOLOR%>" ><td width="25%"><%= Toolbox.emsgs(orgnum,430) %></td>
                 <td width="25%"><%= Toolbox.emsgs(orgnum,14) %></td>
                 <td width="25%"><%= Toolbox.emsgs(orgnum,583) %></td>
                 <td width="25%"><%= Toolbox.emsgs(orgnum,289)  %></td></tr>
     <%
    
    for (int i=0; i < n; i++)
     {%>
     <tr><td><%=adapter.getValueAt(i,3)%></td>
<td><form rel=opener name="f<%=i%>" method="post" action="studentquizfrm.jsp">
<input type=hidden name=subdb  value="<%=subdb%>">
<input type=hidden name=ways value="furt">
<input type=hidden name=quizname value="<%=(adapter.getValueAt(i,0))%>">
<input type=hidden name=sid  value="<%=sid%>" >
<input type=hidden name=course value="<%=course%>" >
</form><a href="javascript:document.f<%=i%>.submit()" >  <%=adapter.getValueAt(i,0)%>  </a> </td>
         <td><%= Toolbox.timestr(Long.parseLong(adapter.getValueAt(i,1)))%></td>
         <td><%= Toolbox.timestr(Long.parseLong(adapter.getValueAt(i,2)))%></td>
     </tr>
     <%
     }
     %>
            </td></tr></table></td></tr></table>
     </body>
     
    <%
    return;
} 
else if (n == 1)
{
    session.setAttribute("assignname",adapter.getValueAt(0,0));
    %>
     <head> <title> </title></head>
     <frameset cols="60%,*" >
     <frame   scrolling="auto"  name="ll<%=tstmp%>"  src="studentquizfrm.jsp?time=<%=adapter.getValueAt(0,1) + "%20" + adapter.getValueAt(0,2)%>" />
     <frame   scrolling="auto"  name="rr<%=tstmp%>"  src="blank.html" />
     </frameset>
     <%
     return;
}
else if (quiznow.equals("1"))
{

    %>
    <head><title> </title></head>
    <frameset cols="60%,*" >
    <frame   scrolling="auto"  name="l<%=tstmp%>"  src="studentquizfrm.jsp" />
    <frame   scrolling="auto"  name="r<%=tstmp%>"  src="blank.html" >
    </frameset>
    <%
    return;
}
 
}
 
String assignname = (String)(session.getAttribute("assignname"));
session.removeAttribute("assignname"); 

%>

<body>

<form rel=opener  name="form3"  method="POST" action="DataForm"  >
<input name="course"      type="hidden"  value="">
<input name="subdb"       type="hidden"  value="">
<input name="coursetitle" type="hidden"  value="">
<input name="sid"         type="hidden"  value="">
<input name="rdap"        type="hidden"  value="" >
<input name="onbegin"        type="hidden"  value="" >
 </form>
 <script type="text/javascript" >
var level2 =  (parent!=null 
 && typeof(parent.parent) !='undefined'
 && parent.parent!=parent
 && typeof(parent.parent.frames) !='undefined'
 && parent.parent.frames.length > 0 
 && typeof(parent.parent.frames[0].zz) != 'undefined');
  
function callit(fm)
{
     var f3 = document.form3; 
     var ht = fm.thispageheight()-220;
     if (level2 == false)
         f3.onbegin.value = "46"; 
     else
         f3.onbegin.value = "46"; 
      
     f3.course.value = fm.form1.course.options[fm.form1.course.selectedIndex].value;        
     f3.subdb.value =  fm.form1.subdb.value;    
     f3.sid.value  =   fm.form1.sid.value;       
     f3.rdap.value =   'lecturenotes';                 
     //f3.action  =   'Echo';//   'DataForm';  
     f3.coursetitle.value = fm.form1.coursetitle.value;  
     formnewaction(f3);
    
 f3.submit();
}
var onloadbeforesqf  = null;
if (level2)
{ 
if (typeof window.onload == 'function')
onloadbeforesqf= window.onload;
window.onload = function()
{
    try{ 
    if (onloadbeforesqf!=null)   
        onloadbeforesqf();
    }catch(e){}
     
    <%String time = Toolbox.defaultParam(orgnum,request, "time", null, null, 29);
    if (time != null)
    { 
    %>
        parent.parent.frames[0].setTimes(<%=time.replaceFirst(" ",",")%>); 
        parent.parent.frames[0].setAssignName("<%=assignname%>"); 
    <%
    }
    else
    { %>
        parent.parent.frames[0].setAssignName(); 
    <%}
    %>    
        callit( parent.parent.frames[0]); 
    }
}
else
{  
      callit(parent.frames[0]);
}
 
</script>
</body> 
</html>
 