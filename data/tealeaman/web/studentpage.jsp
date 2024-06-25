<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*" %>
<%
int orgnum = Toolbox.setcharset(request,response);
if (orgnum == -1) return;
User user = (User)(session.getAttribute("User")); 
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum,Systemroles.STUDENT | Systemroles.TA |  Systemroles.INSTRUCTOR|Systemroles.TEACHINGADMIN |Systemroles.ASSESSER,application,session,request, response, "studentpage.jsp", true)) == null) 
    return; 
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>"> 
<%=(user!=null)?Toolbox.getMeta(orgnum):""%>
<%
int j = -1; 
String  id   =   Toolbox.defaultParam(orgnum,request,"subdb","", null,30);
String  mode =  Toolbox.defaultParam(orgnum,request,"mode", null, null,30);
String  sid = Toolbox.defaultParam(orgnum,request,"sid",null, null,30);
if (sid==null)
    sid = Toolbox.defaultParam(orgnum,request,"SID","", null,30); 
String  click  =   Toolbox.defaultParam(orgnum,request,"click","", null,2);
if (!click.equals("")) click = "&click=" + click;
if (request.getParameter("surl")!=null)
   click += "&surl=" + request.getParameter("surl"); 
String  semester = Toolbox.defaultParam(orgnum,request, "Semester", null ); 
String  mobile = Toolbox.defaultParam(orgnum,request, "mobile", null, null, 1);
if (semester==null  )
{
    semester = Toolbox.dbadmin[orgnum%65536].currentSemester;
}
try{ 
    j = Integer.parseInt(semester);
}
catch(Exception e1)
{ 
        String tt = Toolbox.dbadmin[orgnum%65536].domainValue(Toolbox.langs[orgnum>>16], "Semester",1,0);
        j = tt.indexOf(semester);
        if (j>=0)
        try
        {
            j = Integer.parseInt(tt.substring(j+1 + semester.length()).replaceFirst(";.*","" ));
        }
        catch(Exception e)
        { }  
}

%>
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<% if (mode != null) {%> 
<title><%=Toolbox.emsgs(orgnum,692)%></title>  
<%  } else { %>
<title><%=Toolbox.emsgs(orgnum,696)%></title> 
<%  }%>
</head>
 
<!-- <%=sid%>, <%=mode%> -->
 
<frameset  <%= mobile==null?"cols=\"228,*\"":"rows=\"150,*\"" %>  border="0px" >
<% 
 
String frm; 
if (mode!=null) 
   frm =  "studentmonitor.jsp?semestercode=" + j + "&sid=" + Toolbox.urlencode(sid) + "&mode=" + mode +  click;   
else if (mobile==null) 
{
    frm = "studentindex.jsp?semestercode=" + j + "&id=" + Toolbox.urlencode(id) + click;
}
else  
{
    frm = "studentindex.jsp?semestercode=" + j + "&id=" + Toolbox.urlencode(id) + click;
}
 
%>
<frame name=leftwinmoniter scrolling="no"  src="<%=frm%>"   />
<frame name=rightwinmoniter  scrolling="auto" src="blank.html" />
</frameset>
<script type="text/javascript" >
var crosssite;
function getPassed(str)
{
    frames[0].getPassed(str);
}
function setcrosssite(s)
{
    crosssite=s;
    frames[0].setcrosssite(s);
}
</script> 
</html>
