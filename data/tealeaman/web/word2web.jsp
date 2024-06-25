 
<%@page contentType="text/html" import="telaman.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
%>
<!DOCTYPE html>
<% 
User user = null;

if (  (user = User.authorize(orgnum, -1,application,session,request, response, "word2web.jsp", true)) == null|| !Toolbox.verifytoken(request))
    return;
%>
    <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><title>Webform Design</title></head>
<frameset rows="<%=85 +   cachedstyle.fontsize %>,*" border="0">
<frame name="upwin" src="webwizard.jsp?mode=9&fromm=0&rdap=<%=Toolbox.defaultParam(orgnum,request,"rdap","", null, 30)%>" />
<frame name="subwin"  scrolling="auto"   src="webwizard.jsp?mode=4&rdap=<%=Toolbox.defaultParam(orgnum,request,"rdap","", null, 30)%>" />" />
</frameset>
</html>
