<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*,java.util.regex.*" %>
<%!
String  butwidth(String str, int font_size)
{
   int leng = (str.length() * font_size)/2 + 4;
   int upper = (int)(4.5 * font_size);
       
   if (leng <  upper) 
       leng =  upper;
   return  "style=width:" + leng +"px";
}
%> 
<% int orgnum = Toolbox.setcharset(request,response);  
    if (orgnum == -1) return;
    User user = (User)(session.getAttribute("User"));
%> 
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<title><%=Toolbox.emsgs(orgnum,1257)%></title>
<%=Toolbox.getMeta(orgnum)%>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("snapshut1.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<style type="text/css"> 
td  {font-family:"Times New Roman";font-size:12pt} 
select {font-family:"Times New Roman";font-size:12pt} 
textarea {font-family:"Times New Roman";font-size:12pt}
input.box {font-family:"Times New Roman";font-size:12pt}
input.buttonstyle {color:antiquewhite;font-weight:700;width:65px;font-family:"Arial"}
</style>
<body style="font-size:20px">
<form rel=opener name=f1  ><input type=hidden name=t 
value="tn_supper.jpg Explicit Menu(1)
tn_supper2.jpg Explicit Menu(2)
tn_supper3.jpg Explicit Menu(3)
tn_announce.jpg Announcement Containing Scientific Notations
tn_email.jpg Internal Email
tn_msn.jpg Instant Messager
tn_grades.jpg  Grading with Course-specific Tool
tn_aggret.jpg  Grade Aggregation
tn_instant.jpg Take Notes in Class
tn_mody.jpg  Make an Assignment or Test
tn_mysession.jpg Information of Course Sessions
tn_registration.jpg Advising and Registrations
tn_schedule.jpg Optimized Course Scheduling
tn_webdb.jpg Web Database Development
tn_webfile.jpg Web File Management
tn_webservice.jpg Collection of Web Services" ></form>

<%=Toolbox.title("Snapshots of Major TeaLeaMan Functions")%> 
<!--TeaLeaMan has 360 routines for accessing and presenting data and many web services. 200 of them have graphic user interface. Here is a small part of them. Click a picture to enlarge it. 
-->
<table align=center cellspacing=1 class=outset1>
 
<script type="text/javascript" >
if (document.location.toString().indexOf("localhost") >= 0
    && typeof (handleErr) == 'undefined')
{
function handleErr(msg, url, l)
{
      var txt= "There was an error on this page.\n\n"
       + "Error: " + msg + "\n"
       + "URL:   " + url + "\n"
       + "Line:  " + l + "\n\n"
       + "Click OK to continue.\n\n";
       alert(txt);
      window.onerror = handleErr;
      return true;
}
window.onerror = handleErr;
}
 
var t = document.f1.t.value.split(/\n/); 
 
 
for (var i = 0; i < t.length/4; i++)
{ 
   document.write("<tr>");
   for (var j=0; j < 4; j++)
   {
       var k = t[i*4+j].indexOf(" ");
      var file = t[i*4+j].substring(0,k); 
      var capt = t[i*4+j].substring(k+1);  
      
      document.write(
       "<td align=center valign=center width=240><a href=\"javascript:openit('image/slide/"
     + file.substring(3) 
     +"','" + capt.replace(/'/g,"\\'") +"'," + (i*4+j) +")\"><center>" + capt +"<br><img src=image/models/" 
     + file 
     + "></a></td>");  
   }
   document.write("</tr>");
}
</script>
<table>
<script type="text/javascript" >
var nav = null;
function next(j)
{
    
     j = (j+1)%(t.length);  
     var k = t[j].indexOf(" ");
     var x = t[j].substring(3,k); 
     var capt = t[j].substring(k+1); 
    openit('image/slide/'+x,capt,j);
   
    //nav.document.images['p'].src = x; 
    //nav.document.images['p'].src = x; 
    //nav.document.getElementByTagName("div")[0].innerHTML = capt;
}

function openit(x,capt,k)
{
    var msg = "<center>" + capt +"<a href=javascript:opener.next(" + k +")> &gt;&gt; </a><br><img name=p src=" + x +">";
    
    if (nav==null||nav.closed)
    {
      nav = window.open("", "_blank");//tabledef", 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,left=0,top=0,width=' + (screen.width-10) +',height=1200');
      
      nav.document.write("<htMl><body style=color:purple;font-size:20px margin=\"0 0 0 0\")>" + msg +"</body></html>");
    }
    else
    {
        nav.document.getElementsByTagName("body")[0].innerHTML = msg ;
        nav.focus();
    }
     var w = nav.document.getElementsByTagName("img")[0].width + 50; 
 
     //if (w >=screen.width) w = screen.width;
     //var h = nav.document.getElementsByTagName("img")[0].height + 50;
     //if (h >=screen.height) h = screen.height;
     //nav.moveTo((screen.width-w)/2,(screen.height-h)/2);
     //nav.resizeTo(w, h); 
     
}  
</script>
<script type="text/javascript"  src=curve.js></script>
</body>
</html>