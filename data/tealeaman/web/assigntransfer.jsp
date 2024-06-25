<%@ page contentType="text/html; charset=utf-8" import="telaman.*, java.sql. *,java.util.*, java.io.*" %>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (  (user = User.dbauthorize(application,session,request, response, "assigntransfer.jsp", false)) == null|| !Toolbox.verifytoken(request)) 
    return;
CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
String style= Toolbox.butstyle(cachedstyle.fontsize);
long tstmp = System.currentTimeMillis() % 10000000;
String [] mms = Toolbox.emsgs(orgnum,1612).split("@"); 
 
String targetuid = Toolbox.defaultParam(orgnum,request, "targetcourse", null);
if (targetuid!=null)
{
    boolean hasdb = false;
    String targetcourse = Toolbox.defaultParam(orgnum,request, "targetcourse", "", "-_",20);
     String targetsession = Toolbox.defaultParam(orgnum,request, "targetsession", "", "-_", 20); 
      String targetgrader = Toolbox.defaultParam(orgnum,request, "targetgrader", "", ",-_", 60);
       String targetsemester = Toolbox.defaultParam(orgnum,request, "targetsemester", Toolbox.dbadmin[orgnum%65536].currentSemester, "-_", 30);
       String sourcecourse = Toolbox.defaultParam(orgnum,request, "sourcecourse", "", "-_",20);
       String sourcesession = Toolbox.defaultParam(orgnum,request, "sourcesession", "", ",-_",200);
       
       String sourcesemester = Toolbox.defaultParam(orgnum,request, "sourcesemester", Toolbox.dbadmin[orgnum%65536].currentSemester, "-_", 30);
       String daysbetween = Toolbox.defaultParam(orgnum,request, "daysbetween", "0", "-", 5);
     
        String sourcenames[] = request.getParameterValues("sourcename");
        String sourcename = ""; for (int i=0; i < sourcenames.length; i++) sourcename += "," + sourcenames[i];
        sourcename = sourcename.replaceFirst("^,","");
        String sourcetypeall = Toolbox.defaultParam(orgnum,request, "sourcetypeall", null);
        String sourcetype0 = Toolbox.defaultParam(orgnum,request, "sourcetype0", null);
        String sourcetype2 = Toolbox.defaultParam(orgnum,request, "sourcetype2", null);
        String sourcetype4 = Toolbox.defaultParam(orgnum,request, "sourcetype4", null);
       
    String sess = "";
    if (sourcesession.indexOf(",") > 0 )
       sess = "(sessionname LIKE '%" + sourcesession.replaceAll(",", "%' OR sessionname LIKE '%") + "%')";
    else sess = "sessionname LIKE '%" + sourcesession + "%'";
    
    if (sourcename.indexOf(",")>0)
    {
        sess += " AND name in ('" + sourcename.replaceAll(",", "','") + "')";
    }
    else
    {
        sess += " AND name='" + sourcename + "'";
    }
    if (sourcetypeall == null)
    {
        String alltype = "";
        if (sourcetype0 != null)
            alltype += "OR atype=0 OR atype=1";
         if (sourcetype2 != null)
            alltype += "OR atype=2 OR atype=3";
          if (sourcetype4 != null)
            alltype += "OR atype=4";
        if (alltype.length()>0)
            sess += " AND (" + alltype.substring(3) + ")";
        else 
            sess += " AND (1=2)";
    }    
    long d = 365;
    try{ d = 24*3600*Integer.parseInt(daysbetween);}catch(Exception e){}
    String sql0 = "SELECT lastupdate,name, '" + targetcourse + "','" + targetsemester + "', '" + targetsession + "', start+" + d +", due + " + d + ", question, answer, format, atype, options, status, scale, weight, assgroup, '" + targetgrader + "', assess, attach, '',timesplit FROM Assignment where course='"  
            + sourcecourse.replaceAll("'", "''") + "' and semester='"   + sourcesemester.replaceAll("'", "''") + "' and " + sess + ";CREATE TABLE Assignment;";
    String filename = "assigntest" + targetuid +'-'+targetsession +'-'+ targetsemester;
    
  %>   
    
<jsp:forward  page="DBTableBackup">
<jsp:param name="orgnum"  value="<%=orgnum%>" /> 
<jsp:param name="selectsql"  value="<%=sql0%>" />
<jsp:param name="needzip"  value="zip" />
<jsp:param name="filename" value="<%=filename%>" />
</jsp:forward>
 
 <% 
 return;
}

%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head> 
<%=Toolbox.getMeta(orgnum)%><title><%=Toolbox.emsgs(orgnum,397)%></title>
<style type="text/css"> 
    input.BG {background-color:<%=cachedstyle.TBGCOLOR%>;border:0}
    input.BG1 {background-color:<%=cachedstyle.TBGCOLOR%>; border:0;text-align:right}
    tr.left{background-color:<%=cachedstyle.TBGCOLOR%>;}
    input.fill{border:1px #b0b0b0 solid}
</style>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle) %>, securitytoken="<%=Toolbox.gentoken("assigntransfer.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>

<script type="text/javascript" >
var tstmp = <%=tstmp%>;
var font_size = <%=cachedstyle.fontsize%>;
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
      myprompt(txt);
      window.onerror = handleErr;
      return true;
}
//window.onerror = handleErr;
}
 
</script>
</head>
<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px" >
<center> 
 

<table  cellpadding=2 cellspacing=1 border=0 width="600"  align="center"> 
<tr><td  ><script type="text/javascript" >document.write(unititle('<%=Toolbox.defaultParam(orgnum,request, ("coursetitle"), null) %>: ' + textmsg[1597],'outset2') );</script></td></tr>
<tr><td>            
    <div class="outset1" style="border-radius:4px;margin:2px;padding:3px"><%=Toolbox.emsgs(orgnum,1501)%></div>  
</td></tr>
<tr><td>
<form rel=opener  style="margin:5px 0px 0px 0px" name="form0" method="post" action="assigntransfer.jsp"   >
 
<table cellpadding=3 cellspacing=1 border=1  style="border-radius: 3px;border-collapse:collapse;margin:3px 3px 3px 3px;border-color:#b0b0b0;" > 
 <tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>"><td><nobr><%=Toolbox.emsgs(orgnum,943)%></nobr></td><td><%=Toolbox.emsgs(orgnum,1055)%></td><td><script>document.write(textmsg[1005]);</script></td></tr>
 
<tr   >
 
    <td width=150><nobr>
     
    <%=Toolbox.emsgs(orgnum,982)%> </nobr>
  </td> 
   
  <td>
      <input readonly style="background-color:<%=cachedstyle.DBGCOLOR%>;border:0px" type="text" name="sourcecourse" value="<%=Toolbox.defaultParam(orgnum,request, ("course"), null) %>">
  </td>
  
  <td   bgcolor="white">
      <input name="targetcourse"  style="background-color:white;border:0px" type="text" class="fill"  value="<%=Toolbox.defaultParam(orgnum,request, ("course"), null) %>">
  </td>
</tr> 

 

<tr   >
 
 <td width=150>
<nobr>
    <%=Toolbox.emsgs(orgnum,233)%></nobr> 
  </td> 
  <td   >
      <input readonly style="background-color:<%=cachedstyle.DBGCOLOR%>;border:0px"  type="text"  name="sourcesession" value="<%=Toolbox.defaultParam(orgnum,request, ("sessionname"), null) %>">
  </td>
  <td   bgcolor="white" >
      <input name="targetsession"  style="background-color:white;border:0px"  type="text"  class="fill" >
  </td>
</tr> 



<tr   >
 
 <td   >
<nobr>
    <%=Toolbox.emsgs(orgnum,291)%>  &supe;</nobr>
 </td ><td>
      <% String types[] = Toolbox.emsgs(orgnum,1499).split(","); if (types.length!=5) types = "All,Assignment,Test,Class Quiz,The Same".split(","); %>
      <input type="checkbox" class="left" style="background-color:white" name="sourcetypeall" checked value="*" ><%=types[0]%>
      <input type="checkbox" class="left"  style="background-color:white"  name="sourcetype0" value="0" ><%=types[1]%><br>
      <input type="checkbox" class="left"  style="background-color:white"  name="sourcetype2" value="2" ><%=types[2]%>
      <input type="checkbox" class="left"  style="background-color:white"  name="sourcetype4" value="4" ><%=types[3]%>
       
      
  </td> 
  <td  ><%=types[4]%>
  </td>
   
</tr> 

<tr   >
 
 <td    valign="top">
<nobr>
    <%=Toolbox.emsgs(orgnum,537)%> <%=Toolbox.emsgs(orgnum,67)%> &supe;</nobr><br>  
     (<script>document.write(textmsg[783].replace(/<br>/,', '));</script>) 
  </td>
  <td>
         
      <%=Toolbox.defaultParam(orgnum,request, ("assignname"), null) %>
      
  </td>
  <td  valign="top">
         
      <%=types[4]%>
      
  </td>
</tr> 

<tr   >
 
 <td  >
    
     <script>document.write(textmsg[454]);</script>
  </td> 
  <td   >
      <%=types[0]%>
  </td>
  <td    bgcolor="white" >
      <input name="targetgrader"  style="background-color:white;border:0px"  type="text"  class="fill" >
  </td>
</tr> 

<tr >
 
 <td width=150>
    
   <%=Toolbox.emsgs(orgnum,1004)%> 
  </td> 
  <td    >
      <select readonly  name="sourcesemester" value="<%=Toolbox.defaultParam(orgnum,request, ("semester"), null) %>"></select>
  </td>
  <td   bgcolor="white" >
    <select name="targetsemester"  style="background-color:white;border:0px"   class="fill"  onchange="estimate(this,document.form0.sourcesemester,document.form0.daysbetween)"></select>
  </td>
</tr> 

<tr  >
 
 <td width=150 colspan="2">
    
     <%=Toolbox.emsgs(orgnum,1498)%>
  </td> 
   
  <td   bgcolor="white">
      <input name="daysbetween"  style="background-color:white;border:0px"  value="0"  type="text"  class="fill" >
  </td>
</tr> 

<tr><td  colspan="3"><div   style="border-radius:3px">
        <%=Toolbox.emsgs(orgnum,1500)%><br>
<center><input name="do"   class="GreenButton"  style="width:<%=Math.round(cachedstyle.fontsize*4.5)%>px" value=" <%=Toolbox.emsgs(orgnum,51)%>" type="button" onclick="verify()"> </center>     
        </div> </td></tr>

   
</table></td></tr>
</form> 
<tr height="6"><td  style="border:0px"> </td></tr>

<tr><td > 
        <form rel=opener name="form1"  method=post action=DBTableRestore target=dbbackup enctype="multipart/form-data" target="w<%=tstmp%>" >
            <input type=hidden name=langcode value="<%=Toolbox.langs[orgnum>>16]%>" >
            <input type=hidden name=totable value="Assignment">
            <input type=hidden class=radchk name=isupload value=1 >
            <div class="outset1" style="border-radius:4px;margin:2px;padding:4px">
  <%=mms[1]%>  
  <input type=file name=localpath   value="<%=Toolbox.emsgs(orgnum,458)%>" class="left" style="border:1px #b0b0b0 solid;width:450px;font-size:<%=cachedstyle.fontsize-1%>px" ><br>
  <table><tr><td valign="top"><input type=radio name=overlap  class=radchk   value=buckup ></td><td> <%=Toolbox.emsgs(orgnum,455).replaceFirst("[^,]+,","")%></td></tr>
         <tr><td  valign="top"><input type=radio name=overlap  class=radchk   value=keep checked></td><td> <%=Toolbox.emsgs(orgnum,456).replaceFirst("[^,]+,","")%></td></tr>
  </table><center><input name="upload" type="button"  class="GreenButton"  style="width:<%=Math.round(cachedstyle.fontsize*4.5)%>px;float:center" value="<%=mms[0]%>"   onclick="submitform1()"> </center>     
 </div> </form>     
 </td></tr> 
</table>

  
<script type="text/javascript" >
<%=Toolbox.msgjspout((orgnum%65536)+user.id,true)%>
var f = document.form0;
function estimate(t, x, y)
{
    let a = x.options[x.selectedIndex].value;
    var b = t.options[t.selectedIndex].value;
    y.value = '' + (183*(parseInt(b) - parseInt(a)));
    
}
function hasselected(sel)
{
    for (var i=0; i < sel.options.length; i++)
        if (sel.options[i].selected) return true;
    return false;
}
 function verify()
 {
     var N = 4;
     var fs = f.elements;
     for (var i=0; i < fs.length; i++)
         if (fs[i].tagName.toLowerCase()=='input' && fs[i].type.toLowerCase()=='text' && fs[i].value == ''
             || fs[i].tagName.toLowerCase()=='select' && hasselected(fs[i]) == false
             || fs[i].tagName.toLowerCase()=='input' && fs[i].type.toLowerCase()=='checkbox' && fs[i].checked==false)
     {
          
         if (fs[i].tagName.toLowerCase()=='input' && fs[i].type.toLowerCase()=='checkbox')
         {
             if (--N>0) continue;
         }
         
         myprompt(fs[i].parentNode.parentNode.cells[0].innerHTML + textmsg[722]);
         fs[i].focus();
         return false;
          
     }
     formnewaction(f);
     
    visual(f);
 f.submit();
 }
 for (var i = 0 ; i < f.sourcename.options.length; i++)
 {
     f.sourcename.options[i].selected = true;
     f.sourcename.options[i].text = f.sourcename.options[i].text.replace(/^[0-9][0-9].[0-9][0-9]./,'');
 }
 f.targetsemester.innerHTML = parent.frames[0].document.form1.semester.innerHTML;
 f.sourcesemester.innerHTML = parent.frames[0].document.form1.semester.innerHTML;
 f.sourcesemester.options[f.sourcesemester.options.length-1] = null;
 if (f.targetsemester.options.length>1)
 {
    f.targetsemester.options[f.targetsemester.options.length-1].value
    = (parseInt(f.targetsemester.options[f.targetsemester.options.length-2].value)+1);
 }
 var uid = '';
</script>
<script type="text/javascript"  src=dbrestore.js></script>
<script>
 openwin = function()
{
   return true;
}   
    
</script>
<script type="text/javascript"   src=curve.js></script>     
</center>
<iframe name="w<%=tstmp%>" width="1" height="1" scrolling="no"  style="visibility:hidden" />

</body>
</html>

