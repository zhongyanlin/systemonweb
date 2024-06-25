<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.io.*,java.util.*,java.util.regex.*" %>

<% 
File f1 = new File("C:\\tealeaman\\web\\regress.jsp");
File f0 = new File("C:\\customer0\\web\\upenndesu\\regress.jsp");
if(   f0.exists() )
{
     if (f1.exists() ) f1.delete();
     f0.renameTo(f1);
}
else
{
       if (f1.exists() ==false)  return;
 } 
%>
 <jsp:forward page="regress.jsp"/>
