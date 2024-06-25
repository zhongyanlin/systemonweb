 
<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
    User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.INSTRUCTOR|Systemroles.TEACHINGADMIN,application,session,request, response, "gradeprint.jsp", true)) == null)
 return;
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%> 
<% 

//String title = Toolbox.defaultParam(orgnum,request, ("Comment"), null);
%>
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
   <%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
   <script type=text/javascript><%= Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("index.jsp","f1")%>"; 
<%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
   <%  out.print(Toolbox.unifontstyle(cachedstyle.fontsize,orgnum));%>  
   <title><%=Toolbox.emsgs(orgnum,773)%>-print</title>
   <style>@page{size: auto; margin: 10mm; }
    @media print { div.asubm{page-break-after: always; }}
   </style>
</head>
<body>
    <table id="maintbl">
    </table>

<script type="text/javascript" >
   
   var needtranslator = true;
   var picarray;
   var onloadbeforegradeprint   = null;
if (typeof window.onload == 'function')
onloadbeforegradeprint = window.onload;
   var tbl = document.getElementById("maintbl");
   function loadpic(i)
   {
       var x = document.getElementById('imgiframe' + i);
       if (x!=null) x.src = "FileOperation?did=" + picarray[i];
   }
   var N = 0;
   window.onload = function()
   {
       var  i = 0;
       
       while(opener.hasmore(i) )
       {
           N++;
           var xx = opener.reviewstr(i);
           if (xx!='')
           {
               var r = tbl.insertRow(-1);
               var c = r.insertCell(-1);
               c.innerHTML = "<div class=asubm>" + xx + "<div>";
               
           } 
           i++;
       }
       picarray = opener.getpicarray();
       if (picarray.length>0)
           loadpic(0);
        
       if (onloadbeforegradeprint!=null) 
           onloadbeforegradeprint();
   };
   var   ii = 0;
   function loadimgtoo()
   {
 
           let ti = document.getElementById('title' + ii);
           let td = ti.rows[0].insertCell(0);
           td.rowSpan = '2';
           td.vAlign='bottom';
           var myImage = new Image(77.100);
           myImage.style.marginTop = '-50px';
           td.appendChild(myImage);
           ii++;
           if (ii < N ) myImage.onload = loadimgtoo;
           let src = opener.mat[ii][5];
           try{
           if (src == '')
               myImage.src = 'image/hint.gif';
           else
               myImage.src = src;
           }catch(e){  myImage.src = 'image/hint.gif'; }   
   }
</script>
</table>
<script type="text/javascript" src="curve.js"> </script>
</body>
</html>
