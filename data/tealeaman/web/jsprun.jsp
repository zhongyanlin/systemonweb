<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.io.*,java.util.regex.*" %>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.SYSTEMADMIN,getServletConfig().getServletContext(),session,request, response, "jsprun.jsp", false)) == null)
{
   return;
}
orgnum = user.orgnum; 
 
String content = null;
content = Toolbox.defaultParam(orgnum,request,"source",null);
if (content==null)
content = Toolbox.defaultParam(orgnum,request,"content",null);

FileWriter f = new FileWriter(Toolbox.installpath + File.separator+ "temp" + File.separator + user.id + ".jsp");
f.write(content);
f.close();
String url = "/temp/" + user.id + ".jsp";
String contextPath = request.getContextPath();
		response.sendRedirect(contextPath + url);
%>
 
