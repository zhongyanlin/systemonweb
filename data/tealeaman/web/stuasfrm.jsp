<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
int  orgnum =  Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = (User)(session.getAttribute("User"));
CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
if ( (user = User.authorize(orgnum,Systemroles.TA|Systemroles.ASSESSER|Systemroles.SYSTEMADMIN| Systemroles.INSTRUCTOR|Systemroles.STUDENT,application,session,request, response, "stuasfrm.jsp", true)) == null|| !Toolbox.verifytoken(request)) 
 return;
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>"> 
 
<head> <%= Toolbox.getMeta(orgnum) %></head>        
<%
 String ways = Toolbox.defaultParam(orgnum,request, "ways", null, "*,%=",20);
 if (ways!=null && (ways.indexOf("row") < 0 && ways.indexOf("col") < 0)) ways = ways.replaceFirst("r","rows=\"").replace("c","cols=\"") + "\"";
 String ways2 = Toolbox.defaultParam(orgnum,request, "ways2", "", "*,%=",20); 
 if ( ways2.indexOf("row") < 0 && ways2.indexOf("col") < 0) ways2 = ways2.replace("r","rows=\"").replace("c","cols=\"") + "\"";
 String orderi = Toolbox.defaultParam(orgnum,request, "orderi", "",null,20);
 
 if (ways==null){
%>
<body>
<form rel=opener  name="form3"  method="POST" action="assigndoc.jsp"  target="_self">
<input name="assignname"  type="hidden"  value="" >
<input name="course"      type="hidden"  value="">
<input name="option"      type="hidden"  value="destest" >
<input name="semester"    type="hidden"  value="" >
<input name="sessionname" type="hidden"  value="" >
<input name="subdb"       type="hidden"  value="">
<input name="coursetitle" type="hidden"  value="">
<input name="sid"         type="hidden"  value="">
<input name="rdap"        type="hidden"  value="" >
<input name="code"        type="hidden"  value="" >
<input name="extension"   type="hidden"  value="0" >
<input name="makescript"  type="hidden"  value="makesubmission" >
 </form>
<script type="text/javascript" >
<%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken = "<%=Toolbox.gentoken("stuasfrm.jsp","form3")%>";
</script>
 <script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script>
 <script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
 <script type=text/javascript  src=cookie.js></script>
 <link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
 <script  type="text/javascript" >
 if (parent!=null 
 && typeof(parent.opener) !='undefined'
 && typeof(parent.opener.document.form3) != 'undefined')
 {
     var f = parent.opener.document.form3;
     for (var i=f.elements.length-1; i >=0; i--)
     {
         if ( document.form3.elements[i] != null && f.elements[i] != null)
         document.form3.elements[i].value = f.elements[i].value;
     }
     parent.title = f.elements[0].value;
     formnewaction(document.form3);//, "Echo");
     visual(document.form3);
     myprompt("Open " + f.elements[0].value, null, "if(v)opendoc()");
 }
 else if (parent!=null && typeof(parent.parent)!='undefined'
 && typeof(parent.parent.opener) !='undefined'
 && typeof(parent.parent.opener.document.form3) != 'undefined')
 {
     var titlename = "";
     var f = parent.parent.opener.document.form3;
     for (var i=f.elements.length-1; i >=0; i--)
     {
         if (f.elements[i].value == 'assignname')
         titlename = f.elements[i].value;
         else if (f.elements[i].value == 'course')
         { 
             titlename += f.elements[i].value;
             parent.parent.title = titlename;
         }
         document.form3.elements[i].value = f.elements[i].value;
     }
     parent.parent.title = f.elements[0].value;
     formnewaction(document.form3 );
     visual(document.form3);
     myprompt("Open " + f.elements[0].value, null, "if(v)opendoc()");
}
function opendoc()
{
    document.form3.submit();
}
onload = opendoc;
</script>
</body> 
 <%}
 else if (ways.indexOf("80,*") >=0)
{
%>
 <head><title> </title></head>
 <frameset <%=ways%> >
 <frame name="lowerwin<%=orderi%>"  />
 <frameset <%=ways2%> >
 <frame   scrolling="auto"  name="upleft<%=orderi%>"   onunload="parent.parent.frames[1].doleave();parent.parent.opener.nullme(<%=orderi%>)" src="stuasfrm.jsp" />
 <frame   scrolling="auto"  name="uprig<%=orderi%>" />
 </frameset>
 </frameset>
 
<%
} else if (ways.equals("latex"))
{
user =  User.authorize(orgnum, Systemroles.INSTRUCTOR|Systemroles.STUDENT,application,session,request, response, "assigndoc.jsp", true);
if (user == null) user = new User(orgnum);
orgnum=user.orgnum;
String name = Toolbox.makeFullName(user.lastname, " ", user.firstname);

%>

 
<head> 
<title><%=Toolbox.emsgs(orgnum,51)%></title>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("stuasfrm.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>

<script type="text/javascript" src="checkHTML.js"></script>
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({
    extensions: ["tex2jax.js"],
    jax: ["input/TeX", "output/HTML-CSS"],
    tex2jax: {
      inlineMath: [ ['$','$'], ["\\(","\\)"] ],
      displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
      processEscapes: true
    },
    "HTML-CSS": { availableFonts: ["TeX"] }
  });
</script>

<%=cachedstyle.toString()%><link   rel="stylesheet" type="text/css" href="stylea.css" />
<link   rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script  type="text/javascript" >
var needtranslator = true;
var openmewin = null;
var ht = "";
function finduprig()
{
    var xx = parent.frames;
    for (var i=0; i < xx.length && xx[i].name.indexOf("lower")<0; i++);
    if (i < xx.length)
    {
        openmewin = xx[i];
    }
}

function writeit(first)
{
    if (first != null) LaTexHTML.reset();
    var x = checkh(openmewin.document.form0.Content.value, true);
    var dv = document.getElementById('mathcode');
    dv.innerHTML = x;
    LaTexHTML.reformat(dv);
}

function init()
{
    finduprig();
    ht = "<center><h2>"
    ht +=   openmewin.getMat(0,7);
    ht +=  " " + openmewin.getMat(0,0);
    ht +=  "</h2><h4> <%=name%><br>";
    ht +=  openmewin.timestr(Math.round( (new Date()).getTime()/1000));
    ht +=  "</h4></center>";
    document.getElementById('titleline').innerHTML = ht;
    writeit('1');
}
window.onunload = function () {openmewin.hasnolatexpage();}
</script>

</head>
<body style="background-color:<%=cachedstyle.DBGCOLOR%>;color:black;"> 
<div id="titleline" class=outset1 style="margin:4px 4x 4px 4px; padding:2px 2px 2px 2px"> </div>
<div id=mathcode class=outset1 style="margin:4px 4x 4px 4px; padding:2px 2px 2px 2px"> </div>  
<script type=text/javascript  src=curve.js?sn=40&dn=30></script>
<script> init();</script>
</body>
<%}
 else 
{
  
   String x =  request.getHeader("user-agent"); if (x==null) x="";  x =x.toLowerCase();
   if (x.equals("ipad") || x.equals("iphone") || x.equals("android"))
      x = "mobile";
   
%>
 <head> <title><%=Toolbox.emsgs(orgnum,51)%></title></head>
 <!--frameset <%=((ways==null)?"":ways)%> -->
 <frameset cols="<%=x.equals("mobile")?"90":"70"%>%,*" >
 <frame   scrolling="auto"  name="upleft<%=orderi%>"  src="stuasfrm.jsp" />
 <frame   scrolling="auto"  name="uprig<%=orderi%>" />
 </frameset>
 <!--frame name="lowerwin<%=orderi%>" />
 </frameset-->
<%
}
%>

</html>