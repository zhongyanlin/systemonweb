<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*" %>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (  (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request, response, "quickstart.jsp", false)) == null) 
    return;
orgnum=user.orgnum;
CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
String style= Toolbox.butstyle(cachedstyle.fontsize);
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><title><%=Toolbox.emsgs(orgnum,447)%></title>
<%=Toolbox.getMeta(orgnum)%>
<style type="text/css"> 
    
    input.BG {background-color:<%=cachedstyle.DBGCOLOR%>}
    input.BG1 {background-color:<%=cachedstyle.TBGCOLOR%>; border:0;text-align:right}
    
</style>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("quickstart.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<%=Toolbox.unifontstyle(cachedstyle.fontsize,orgnum)%>
</head>
 
 
<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px" >



<% 
 
String [] xs = Toolbox.emsgs(orgnum,1441).split("\n");
 
%>
<%=Toolbox.title(xs[0]) %>
 
         <div class="outset3" style="margin:5px 0px 0px 0px">
             <table>
                 
                 <%
                 for (int ii=1; ii < xs.length; ii++)
                 {
                 %>
                 <tr><td align="left" valign=top width="2%"> <div class=circle><%=ii%></div></td><td width=98% align="left"> <%= xs[ii] %> </td></tr>
                 <%
                 }
                 
                 %>
             </table>
         </div>
                 <br><br>
<%

if (!Toolbox.edition.contains("Personal"))
{
xs = Toolbox.emsgs(orgnum,1445).split("\n");
 
%>
<%=Toolbox.title(xs[0]) %>
 
         <div class="outset3"  style="margin:5px 0px 0px 0px">
             <table>
                 
                 <%
                 for (int ii=1; ii < xs.length; ii++)
                 {
                 %>
                 <tr><td align="left" valign=top width="2%"> <div class=circle><%=ii%></div></td><td width=98% align="left"> <%= xs[ii] %> </td></tr>
                 <%
                 }
                 
                 %>
             </table>
         </div>
        
 <%}%>
   
   
    </body>
</html>
