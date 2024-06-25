<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (  (user = User.authorize(orgnum,  Systemroles.TOTAL,application,session,request, response, "discussion.jsp", true)) == null|| !Toolbox.verifytoken(request)) 
    return;
orgnum = user.orgnum;  
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <%= Toolbox.getMeta(orgnum) + Toolbox.jaxhead %>
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<title><%=Toolbox.emsgs(orgnum,898)%></title>
<script type="text/javascript" ><%=Toolbox.dimloc(900, 670 )%></script>
</head>

 
<frameset cols="228,*" border=0px>

<frame name=leftwindis  scrolling="no"    src=discussionindex.jsp />
 
<frame name=rightwindis    scrolling="auto"     />
 
 

</frameset>
 
</html>
