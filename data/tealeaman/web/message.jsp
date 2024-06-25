<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>

<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<title><%=Toolbox.emsgs(orgnum,559)%></title>
<script type="text/javascript" ><%=Toolbox.dimloc(900, 670 )%></script>
</head>

 
<frameset cols="228,*" border=0px>

<frame name=leftwinmsg  scrolling="no"    src=messageindex.jsp />
 
<frame name=rightwinmsg    scrolling="auto" />

</frameset>
 
</html>
