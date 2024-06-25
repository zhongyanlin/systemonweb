<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
 
User user = null;
if ( (user = User.authorize(orgnum,Systemroles.ASSESSER |  Systemroles.STUDENT|Systemroles.TEACHINGADMIN|Systemroles.INSTRUCTOR,application,session,request, response, "insservice.jsp", true)) == null) 
    return;
orgnum = user.orgnum; 
String iid = Toolbox.defaultParam(orgnum,request, ("iid"), null);
if (iid==null) return;
iid = Toolbox.validate(iid, null, 30);
user.changedb(iid);
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
String sql = "SELECT title, format, name FROM Task where name LIKE '#%'";
int nt = adapter.executeQuery(sql);
StringBuffer buf = new StringBuffer();
for (int k = 0;k < nt; k++) 
{
      String title = adapter.getValueAt(k, 0).trim();
      if (title.equals(""))continue;
      String rdap = adapter.getValueAt(k,2);
      String format = adapter.getValueAt(k,1);
      buf.append( 
     "<a href=\"javascript:openit3('Data" + format 
     +"','" + rdap +"','" + iid +"')\"><nobr>" + title +"</nobr></a><br>");
}
adapter.close();
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<script type="text/javascript" > 
      <% if (nt>0){%>parent.frames[0].rewrite("<%=Generic.handle(buf.toString())%>");
     <%}%>
</script>   
</head>
<body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 5px 5px">
      <% if (nt<=0){%>  No extra services provided at this time <%}%> 
</body>
</html>
