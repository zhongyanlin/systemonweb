
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
 User user = (User)(session.getAttribute("User"));
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <%= Toolbox.getMeta(orgnum) %> 
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<title> </title><%@ page contentType="text/html; charset=utf-8" import="telaman.*" %>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<link rel="stylesheet" type="text/css" href="stylea.css" />
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
</head>

<body  style="background:<%=Toolbox.dbadmin[orgnum%65536].bgimage%>">
    <div id="content" ></div>  
</body>
<script>
var callingframe;
onload = function()
{
    var xx = parent.frames;
    var y = '';
    for (var i=0; i < xx.length ; i++) 
    if ( typeof(xx[i].ResizeUploaded) != 'undefined' 
        &&  typeof(xx[i].ResizeUploaded.gettobewritten) != 'undefined'  
        && (y = xx[i].ResizeUploaded.gettobewritten()) != '')
    {
        document.getElementById("content").innerHTML= y;
        callingframe = xx[i];
    }
}
var ResizeUploaded = 
{
    urlAttachedFile : function(pathcode)
    {
        var showarea = document.getElementById('codeshow');
        showarea.style.border = "1px #b0b0b0 outset";
        showarea.innerHTML = document.location.toString().replace( /[^\\/]+$/, "FileOperation?did=" + pathcode );
    },
    codeAttachedFile : function(pathcode)
    {
        var showarea = document.getElementById('codeshow');
        showarea.style.border = "1px #b0b0b0 outset";
        showarea.innerHTML = "&lt;img src=\"" + document.location.toString().replace(/[^\\/]+$/, "FileOperation?did=" + pathcode ) + "\" &gt;";
    } 
}
</script>
    <script type=text/javascript  src=curve.js></script>
</html>
