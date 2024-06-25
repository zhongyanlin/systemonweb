<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
String course = Toolbox.defaultParam(orgnum,request,"course","", null, 30);
String which = Toolbox.defaultParam(orgnum,request,"which","", null, 30); 
User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.INSTRUCTOR,application,session,request, response, "servicecourse.jsp", true)) == null) 
    return;
orgnum=user.orgnum;
%>

<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title>Association: TeaLeaMan Web Service Associating with Courses</title>
<script type="text/javascript" ><%=Toolbox.dimloc(750, 600 )%></script>
</head>

 
<frameset cols="228,*" border=0>

<frame name=leftwin scrolling="no"  src=serviceIndex.jsp?course=<%=course%>&which=<%=which%> />
<% if (course.equals("")||course.indexOf(",")>0) {%>
  <frame name=rightwinservicecourse src=""   scrolling="auto"  />
  <script type="text/javascript" >rightwinservicecourse.document.write("Click a course title")</script>
<%} else { %>
  <frame name=rightwinservicecourse src="DataTable?subdb=&rdap=courseservice&course=<%=Toolbox.urlencode(course)%>&courseTitle=<%=Toolbox.urlencode(course)%>" />
  
<%}
%>

</frameset>

 
</html>

