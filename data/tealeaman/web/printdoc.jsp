<%@ page contentType="text/html; charset=utf-8" import="telaman.*" %>
<% int orgnum = Toolbox.setcharset(request,response); 
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request, response, "printdoc.jsp", true)) == null|| !Toolbox.verifytoken(request)) 
 return;
 
 %>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
    <%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>  
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script>
<script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
<script type=text/javascript  src=cookie.js></script>
<style>.MathJax nobr>span.math>span{border-left-width:0 !important};</style>
<%
String text = Toolbox.defaultParam(orgnum,request, "wcds", "");
out.println(text.replaceFirst("true$", "<script>var needtranslator=true;</script>"));//.replaceFirst("<body [^>]+>", ""));
%>
</body>
</html>
