<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
boolean student = false;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR,application,session,request, response, "alert.jsp", true)) == null) 
    return;
orgnum = user.orgnum; 
 
String cid =  Toolbox.defaultParam(orgnum,request,"CourseIDEvaluating","", null, 30);
String title =  Toolbox.defaultParam(orgnum,request,"CourseTitleEvaluting","", "-_&@#$+:()", 200);
String eval =  Toolbox.defaultParam(orgnum,request,"GradeComputing","", null, 30);

 
CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
String msg = Toolbox.emsgs(orgnum,315) + " \"" + title + "\" "+Toolbox.emsgs(orgnum,316);
String style=    "width:" + Math.round(cachedstyle.fontsize*5) + "px;font-size:" + cachedstyle.fontsize +"px";

%>
<!DOCTYPE html> 
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,246)%></title> 
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle) %>, securitytoken="<%=Toolbox.gentoken("alert.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>)); 
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
var flag = 0;
<%=Toolbox.dimloc(600,500)%>
var course = '<%=cid%>';
var title='<%=title%>';
var eval='<%=eval%>';
var font_size = <%=cachedstyle.fontsize%>;
</script> 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />  
</head>

<body   >
<center>
 

<% String txt = Toolbox.defaultParam(orgnum,request, "txt", null, "&-_@#$%!+{}[]\";';,/", 1000);

if (txt==null) {%>

<form rel=opener name="thisform" method="POST" action="alert.jsp" style="margin:5px 0px 0px 0px" onsubmit="return submitform()"   >
<%=Toolbox.emsgs(orgnum,307)%> <b><%=Toolbox.emsgs(orgnum,309)%></b> 
<input name=thresh size=2 onblur=fill() value=60 tabindex=0  onkeypress="return hit()"> <%=Toolbox.emsgs(orgnum,308)%>   <br>
 
<table>
<tr>
 <%=Toolbox.fields(Toolbox.emsgs(orgnum,310),orgnum,cachedstyle).replaceAll("<td", "<td align=center")%> 
<%=Toolbox.fields(Toolbox.emsgs(orgnum,306),orgnum,cachedstyle).replaceAll("<td", "<td align=center")%> 
</tr>
<tr>
<td width=150>
  <textarea name=ids rows=17 cols=20 tabindex=1></textarea>
</td><td>
<input type=hidden name="CourseIDEvaluating">
<input type=hidden name="CourseTitleEvaluting">
<textarea name=txt cols=40 rows=17 tabindex=2></textarea>
</td>
</tr>
<tr>
<td colspan=2 align=center>
<input class=RedButton  style="<%=style%>"   type="submit" name=submit value="<%=Toolbox.emsgs(orgnum,317)%>"  tabindex=3>
<input class=GreenButton style="<%=style%>"   type="button" name=submit2 value=<%=Toolbox.emsgs(orgnum,169)%> onclick="parent.closeprompt()" tabindex=5>
</td>
</tr>
</table></form>
 
<script type="text/javascript" > 

function fill()
{
   var th = parseInt(document.thisform.thresh.value);
   document.thisform.ids.value = parent.passinfo(th);
}
function g()
{
 
}
function  hit()
{
    if(event.keyCode == 13) 
    {
       return  fill();
    }
     return (event.keyCode == 46 || (event.keyCode >47 && event.keyCode < 58))
} 
 
function resizeCont()
{    
   var winW = screen.width - 12, winH = screen.height - 260, areacols,arearows;
   if (winW < 20 || winH < 260) 
   {
       window.resizeTo(400, 400);
       return;
   }
   if (parseInt(navigator.appVersion)>3)
   {
       var wd = thispagewidth();
       var het = thispageheight();
       if (arearows < 1) arearows = 1;
       if (areacols < 1) areacols = 1;
       document.thisform.ids.style.width="" + Math.floor(100) +"px";
       //document.thisform.ids.rows=arearows ;
       document.thisform.txt.style.width="" + Math.floor(wd-140) +"px";
       document.thisform.ids.style.height="" + Math.floor(het-160) +"px";
       //document.thisform.ids.rows=arearows ;
       document.thisform.txt.style.height="" + Math.floor(het-160) +"px";
       //document.thisform.txt.rows=arearows ;
    }
}

 

 
var nav1 = null;
var popstr;
function submitform()
{ 
    if (document.thisform.txt.value.length < 2)
    {
        document.thisform.txt.value = "<%=Generic.handle(msg)%>";
    }
    localStorage["alertmessage"] = document.thisform.txt.value;
    return true;
}
 function syn( result){}
 window.onresize=resizeCont; 
 fill();
 var xx = localStorage["alertmessage"];
 if (xx == '' || xx == null || xx.length < 4)
     xx = "<%=Generic.handle(msg)%>";
 document.thisform.txt.value = "<%=Generic.handle(msg)%>";

function makebtn(cl,wt,vl)
{
   return "<input type=button class=" + cl+" style=color:white;width:"+wt+"px;font-weight:700  value=\"" + vl +"\" > ";
}
var helpstr = "<%=Generic.handle(Toolbox.emsgs(orgnum,314))%>";

helpstr += "<!----><tr><td colspan=2><b><font color=purple>" + textmsg[51]+"</font></td></tr>"
+"<tr><td valign=top>" + makebtn("RedButton",70, "<%=Toolbox.emsgs(orgnum,246)%>") 
    +" </td><td><%=Toolbox.emsgs(orgnum,312)%></td></tr><tr><td valign=top>"
    +makebtn("GreenButton", 70, "<%=Toolbox.emsgs(orgnum,36)%>")
        +"</td><td><%=Toolbox.emsgs(orgnum,313)%></td></tr>";
resizeCont();
 
</script>
<% } else {
out.println("<table>");
String sql = "";
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
String ida[] = Toolbox.defaultParam(orgnum,request, "ids", "", null, 300).split("\n");
long pd =  System.currentTimeMillis()/1000; 
for (int i = 0; i < ida.length; i++)
{
    ida[i] = ida[i].replaceAll("\n","").replaceAll("\r","").replace(" ","");
    if (ida[i].equals("")) continue;
    if (ida[i].length() > 0)
    sql = 
    "INSERT INTO Message(lastupdate,rid, postdate,subject, content,suppress,sid,format,subdb) VALUES(" +pd +",'" 
    + ida[i]
    +"', " 
    + pd 
    + ", '" 
    + title.replaceAll("'","''") 
    + " " + Toolbox.emsgs(orgnum,246) 
    +"', '" + txt.replaceAll("'", "''") + "',0,'" + user.id +"','0','" + user.id +"');";
    if (1==adapter.executeUpdate(sql))
        out.println("<tr><td>" + ida[i] + " " + Toolbox.emsgs(orgnum,71) +"</td></tr>");
    else out.println("<tr><td>" +ida[i] + " " + Toolbox.emsgs(orgnum,701) +"</td></tr>");
}
    out.println("</table>");
    adapter.close();
}


%>
<script type="text/javascript"     src=curve.js></script>
<script type="text/javascript"     src=helpformat.js></script>
</center>
</body>
</html>

 


