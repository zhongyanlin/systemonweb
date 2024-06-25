<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %><% 
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.SYSTEMANALYST,application,session,request, response, "tables.jsp", false)) == null)
    return;
orgnum=user.orgnum;
orgnum=user.orgnum;
String title =   Toolbox.emsgs(orgnum,531);
String tname = Toolbox.defaultParam(orgnum,request, "tname",  "", null, 30);
if (tname.equals("") == false) tname = "?tname=" + tname;
%><!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<%=Toolbox.getMeta(orgnum)%> 
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<title><%=title%></title>
<script type="text/javascript" ><%=Toolbox.dimloc(880, 700 )%></script> 
</head>

<frameset cols="228,*" border=0px>
<frame name=leftwintb scrolling="no"   src="tableindex.jsp<%=tname%>"  />
 
<frame name=rightwintb   scrolling="auto"    />
</frameset>
 
</html>
