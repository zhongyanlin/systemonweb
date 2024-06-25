<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
String pages = Toolbox.defaultParam(orgnum,request, ("page"), null);
pages = Toolbox.validate(pages, "?/#%", 100);
User user = null;
 
if (  (user = User.authorize(orgnum, Systemroles.SYSTEMANALYST|Systemroles.SYSTEMADMIN, application,session,request, response, "switchdb.jsp", false)) != null|| !Toolbox.verifytoken(request)) 
{

    boolean bb = false;
if (user.mydb) 
    bb = user.changedb(null);
else 
    bb = user.changedb(user.id);
orgnum=user.orgnum;
String contextPath = request.getContextPath();
response.sendRedirect(contextPath + "/" + pages);
}
%>
 


