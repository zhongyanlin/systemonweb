<%@page  import="telaman.*" contentType="text/html" pageEncoding="UTF-8"%>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
%>
<!DOCTYPE html>
<%
   String up = Toolbox.defaultParam(orgnum,request, ("up"), null);
   if (up == null)
       up = "";
   String low = Toolbox.defaultParam(orgnum,request, ("low"), null);
   if (low == null)
       low = "";
   User user = null;
   
   up =  Toolbox.validate(up, "?=", 30);
   
   low = Toolbox.validate(low, "?=", 30);
 
   
if ( (user = User.authorize(orgnum, -1,application,session,request, response, "webwframes.jsp", true)) == null|| !Toolbox.verifytoken(request))
    return;
orgnum=user.orgnum;

%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title>Webform Design</title>
</head>
<frameset rows="<%=85 +   cachedstyle.fontsize %>,*" border="0">
<frame name="upwin"  scrolling="no" src="<%=up%>" />
<frame name="subwin" src="<%=low%>" src="blank.html" />
</frameset>
</html>