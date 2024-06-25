<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
String semester = Toolbox.defaultParam(orgnum,request,"semester",Toolbox.dbadmin[orgnum%65536].currentSemester, null, 30);
if (semester.equals("")) semester = Toolbox.dbadmin[orgnum%65536].currentSemester;
String title = Toolbox.defaultParam(orgnum,request,"title","TeaLeaMan", null, 50);
String dim = Toolbox.defaultParam(orgnum,request,"dim","800600", null, 10);
int width = 800;
int height = 600;
User user = null;
if (  (user = User.authorize(orgnum,  (Systemroles.TOTAL>>1) << 1,application,session,request, response, "statuschange.jsp", true)) == null || !Toolbox.verifytoken(request)) 
    return; 
%>

<html lang="<%=Toolbox.langs[orgnum>>16]%>">
     
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,996)+Toolbox.dbadmin[orgnum%65536].currentSemester%></title>
<script type="text/javascript" >
   <%=Toolbox.dimloc(width, height)%>
   </script>
</head>

 
<frameset rows="<%=height/2%>,*" border=2px>
    <frame name="tlmlstatus"  scrolling="auto"   src="DataTable?subdb=&rdap=statuschange&subdb=&semester=<%=Toolbox.urlencode(semester)%>" />
<frame name="tlmrstatus"  scrolling="auto"     />
</frameset>
</html>
