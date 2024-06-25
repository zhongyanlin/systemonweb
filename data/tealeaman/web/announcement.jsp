<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum,  (Systemroles.TOTAL >> 1) << 1,application,session,request, response, "announcement.jsp", true)) == null) 
    return;
orgnum = user.orgnum; 
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <%= Toolbox.getMeta(orgnum) + Toolbox.jaxhead %>
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<title><%=Toolbox.emsgs(orgnum,269)%></title>
<script type="text/javascript" ><%=Toolbox.dimloc(800,600)%></script>
</head>

 
<frameset cols="228,*" border=0px>

<frame name=tlmrann  scrolling="no"    src=announcementindex.jsp />
 
<frame name=tlmlann  scrolling="auto"  />

</frameset>
 
</html>
