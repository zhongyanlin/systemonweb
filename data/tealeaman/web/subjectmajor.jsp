<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
String rdap = "subject"; 
String title = "Subject and Major";
String dim = Toolbox.defaultParam(orgnum,request, ("dim"), null);
int width = 800;
int height = 600;
try{ width=Integer.parseInt(dim.substring(0,3)); height = Integer.parseInt(dim.substring(3));} catch(Exception e){}
String left = "tlml" +  rdap;
String  right = "tlmr" + rdap;

%>

<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<title><%=title%></title>
<script type="text/javascript" ><%=Toolbox.dimloc(width, height)%></script> 
</head>

 
<frameset cols="350,*" border=3px>
<frame name="tlmlsubject"  scrolling="auto"   src="DataTable?exbut=cp&rdap=subject&onbegin=30" />
<frame name="tlmrsubject"  scrolling="auto"  src="blank.html"  />
</frameset>
</html>
