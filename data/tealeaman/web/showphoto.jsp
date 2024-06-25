<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
%>
<% 
 
String file = Toolbox.defaultParam(orgnum,request, ("file"), null);  
file = Toolbox.validate(file, "?/#%", 100);
User user = (User)(session.getAttribute("User"));
%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title> <%= file%> </title>
<style type="text/css">
.img-shadow {float:left;background: url(image/trans-shadow.png) no-repeat bottom right;}  
.img-shadow img {display: block;  position: relative;  padding: 5px; background-color: #fff;  border: 1px solid #cecece; margin: -6px 6px 6px -6px;}
</style>
<script type="text/javascript" ><%=Toolbox.dimloc(450, 500 )%></script>
</head>
    <body>
        <table align=center>
            <tr><td>
        <span class="img-shadow">
           <img src="<%= file%>" name="pic">
        </span>
</td></tr></table>
   
<script type="text/javascript" >
 
 function res(){
 var twidth =  Math.floor(document.images["pic"].width ) + 40;
 var theight = Math.floor(document.images["pic"].height*10/9) + 60;
 //document.write("" + twidth +", " + theight);
 window.resizeTo(twidth,theight);
 window.moveTo((screen.width - twidth)/2, (screen.height - theight)/2);
 }
 onload=res;
</script>
 </body>
 </html>
