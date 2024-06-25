<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% int orgnum = Toolbox.setcharset(request,response); 
    if (orgnum == -1) return;
    User user = (User)(session.getAttribute("User"));
 %>
<!DOCTYPE html> 
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%><title> <%=Toolbox.emsgs(orgnum,1166)%></title> </head>
<%
    
   if (  (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request, response, "studentprogress.jsp", true)) == null|| !Toolbox.verifytoken(request)) 
    return;
   orgnum=user.orgnum;
  // String majorprogram = Toolbox.defaultParam(orgnum,request,"majorprogram","");  
  // String minorprogram = Toolbox.defaultParam(orgnum,request,"minorprogram","");
   String r = Toolbox.defaultParam(orgnum,request,"role", "a", null, 1);
   String sid = Toolbox.defaultParam(orgnum,request,"sid", "", null,30);
    
%>
   <frameset cols="50%,*">
       <frameset  name="left" rows="85,*" border=0   >
           <frame name="z11"  scrolling="no" src="blank.html" />
           <frame name="z21"   src="blank.html" />
       </frameset>
       <frameset name="right" rows="85,*"  border=0 >
           <frame name="z12"   src="studentadvising.jsp?role=<%=r%>&sid=<%=sid%>" scrolling="no" />
           <frame name="z22"  scrolling="auto" src="blank.html" />
       </frameset>
   </frameset>
</html>
