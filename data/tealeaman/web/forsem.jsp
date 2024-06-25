<%@ page  import="telaman.*,java.sql.*,java.util.*,java.io.*,java.util.regex.*,java.net.*" contentType="text/html;charset=utf-8"%>
<!DOCTYPE html>
<%
int orgnum = Toolbox.setcharset(request, response);
   
%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
        <meta http-equiv="Content-Type" content="text/html; charset=GBK">
        <title>JSP Page</title>
    </head>
    <body>
<%
 
JDBCAdapter adapter  = Toolbox.getSysAdapter(orgnum); 
Toolbox.dbadmin[orgnum%65536].buildSemesterMap(adapter);
BackRoutine.updateselects(adapter,orgnum); 
adapter.close();            
%>
    </body>
</html>
