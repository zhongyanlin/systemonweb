<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*" %>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.dbauthorize(application,session,request, response, "dbdataclear.jsp", false)) == null|| !Toolbox.verifytoken(request)) 
    return;
CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
String style= Toolbox.butstyle(cachedstyle.fontsize);
long tstmp = System.currentTimeMillis()%10000000;
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head> 
<%=Toolbox.getMeta(orgnum)%><title><%=Toolbox.emsgs(orgnum,423)%></title>
<%=Toolbox.getMeta(orgnum)%>
<style type="text/css"> 
 
    
    input.BG {background-color:<%=cachedstyle.TBGCOLOR%>;border:0}
    input.BG1 {background-color:<%=cachedstyle.TBGCOLOR%>; border:0;text-align:right}
     
</style>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("dbdataclear.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>
 
</head>
 
 
<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px"  >
<center> 
<%=Toolbox.title(Toolbox.emsgs(orgnum,425))%> 
 
<form rel=opener  style="margin:5px 0px 0px 0px" name=form1 method=post action=Save target="w<%=tstmp%>" > 
<script type="text/javascript" >document.write(round1('100%'));</script>
<table width=100% cellpadding=0 cellspacing=0 border=0 class=outset3  ><tr><td>
<table width=100% cellpadding=1 cellspacing=1 border=1 style="border-collapse:collapse">  
<tr style="background:<%= Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>" >
<td width=<%=cachedstyle.fontsize+5%> align=center> 
<input type=checkbox  style="background-color:<%= cachedstyle.BBGCOLOR%>" name=check1 onclick="checkall()">
</td>
 <td width=150><%=Toolbox.emsgs(orgnum,398)%></td> 
  <td ><%=Toolbox.emsgs(orgnum,399)%></td>
  <td   width=70><nobr><%=Toolbox.emsgs(orgnum,704)%></nobr></td>
</tr>
 <script type="text/javascript" >
var numtables = parent.frames[0].passNumtables();
var  tables = new Array(numtables);
var font_size = <%=cachedstyle.fontsize%>;
parent.frames[0].passTables(tables);

for (var i = 0; i < numtables; i++)
{  
   document.write('<tr bgcolor=<%=cachedstyle.TBGCOLOR%>>' + 
   '<td width=<%=cachedstyle.fontsize+5%> align=center> <input type=checkbox name=checkbox' + i + ' value=' + tables[i] + ' > </td>' + 
   '<td>  ' + parent.frames[0].name2label(  tables[i]) + '  </td>' +
   '<td > <input class=BG name=rest' + i + ' size=30></td><td onclick=browsedata(this) align=center> >></td> </tr>' );
}
function browsedata(td)
 {
     var tr = td.parentNode;
     var tbl = tr.childNodes[0].getElementsByTagName("input")[0].value;
     var sql = tr.childNodes[2].getElementsByTagName("input")[0].value;  
    
     postopen('dbbackup.jsp?tbl=' + tbl + '&tblname=' + encodeURIComponent(tr.childNodes[1].innerHTML.replace(/<[^>]+>/g,'')) +  '&sql=' + encodeURIComponent(sql), '_blank');
 }
</script>
</table> 
</td></tr></table>
<script type="text/javascript" >document.write(round2);</script>

<%if (DBAdmin.sysonwebdb){%>
<table><tr><td>
    <%=Toolbox.emsgs(orgnum,400)%></td><td><input  name=start size=12 onchange=chq(this,1) onfocus=setv(this)>
    </td><td><%=Toolbox.emsgs(orgnum,402)%></td><td><input  name=end size=12 onchange=chq(this,2) onfocus=setv1(this)>
</td><td><nobr><input type=checkbox name=droptable>Drop Table</nobr></td></tr></table>
<%}%>


<input type=hidden name=wcds> 
<input type=button  onclick="confirmd(this)" class=OrangeButton   <%=style%>;background:url(image/OrangeButton.gif)   value="<%=Toolbox.emsgs(orgnum,30)%>"   >  
<input type=reset  class=GreenButton   <%=style%>  value="<%=Toolbox.emsgs(orgnum,192)%>" >

 
<input class=GreenButton  <%=style%>  type=button value="<%=Toolbox.emsgs(orgnum,32)%>" onclick=showhelp() tabindex=10>  
</form>
<br>
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
      myprompt(txt);
      window.onerror = handleErr;
      return true;
}
window.onerror = handleErr;
}
var warn = "<%=Toolbox.emsgs(orgnum,426)+user.dbinfo.server.replaceFirst("(.*)[:|/|=]([a-z|A-Z|0-9]+$)", "$2")%>";
function confirmd(btn)
{
    open('login.jsp?follow=logout','w' + tstmp );
     
    postopen('login.jsp?follow=<%= (new Encode6b(orgnum)).to6b("parent.dodeletedata()")%>&error=' + encodeURIComponent(warn),'w' + tstmp);
}
 
var starttime = 0;
var endtime= <%=System.currentTimeMillis()/1000%>-3600*24*365;
var timeformat = '<%=cachedstyle.timeformat%>';var haswebfolder=<%=user.websitename != null && !user.websitename.equals("")
||user.webFileFolder != null && !user.webFileFolder.equals("") %>;
</script>
 <script type="text/javascript"  src=timeformat.js></script>
<script type="text/javascript" >
     
<%if (DBAdmin.sysonwebdb){%>

var ml = document.form1;
document.form1.start.value = timestr(starttime);
document.form1.end.value = timestr(endtime);
function setv(v){if (v.value=='') v.value=timestr(starttime);}  
function setv1(v){if (v.value=='') v.value=timestr(endtime);} 
function chq(v,i)
{   
    var tm = parseTime(v.value); 
   
    if (tm==null)
    {
        myprompt('Enter time in format ' + timeformat);
        v.focus();
        return;
    }
  
    if (i==1) 
       starttime = tm;
    else
    {
       endtime = tm;
         if (endtime < starttime)
        {
           myprompt('Ending time should be later than starting time');
        } 
       
    }
}
  
function addres()
{
  var len = ml.elements.length;  
  var res = new Array( numtables ); 
  for (var i = 0; i < len; i++)  
  {                              
      var e = ml.elements[i];    
      if (e.name.indexOf("rest") == 0) 
      { 
          res[parseInt(e.name.substring(4))] = i;  
      }
  } 
  
  for (var i = 0; i < numtables; i++)
  {
      if (ml.elements[res[i]].value == '')
          ml.elements[res[i]].value =  'lastupdate >= ' +  starttime + ' AND lastupdate <= ' +  endtime;  
      else 
          ml.elements[res[i]].value += ' AND lastupdate >= ' +  starttime + ' AND lastupdate <= ' +  endtime; 
  }
} 
<%}%>
var tstmp = <%= tstmp%>;
var aword = null; 
var tb = new Array(numtables);
var res = new Array(numtables);
function dodeletedata()
{
   <%if (DBAdmin.sysonwebdb){%> addres();<%}%>
  var sql = '';
  var b = document.form1.check1.checked; 
  var ml = document.form1;     
  var len = ml.elements.length;  
  for ( var j = 0; j < numtables; j++)
  {
     tb[j] = '';
     res[j] = '';
  }
  for (var i = 0; i < len; i++)  
  {                              
      var e = ml.elements[i];    
      if (e.name.indexOf("checkbox") == 0) 
      {
          if (e.checked)
          {
              tb[parseInt(e.name.substring(8))] = e.value;
          }
      }
      else if (e.name.indexOf("rest") == 0) 
      {
          if (e.value != '')
             res[parseInt(e.name.substring(4))] = e.value;
      }
  } 
  for ( var j =  numtables - 1;  j>=0; j--)
  {
     if (tb[j] != '')
     {
          if (document.form1.droptable.checked==false)
          {
            sql += "DELETE FROM " + tb[j] ;
            if (res[j] != '')
                sql += " WHERE " + res[j];
          }
          else
          {
             sql += "DROP TABLE " + tb[j];
          }
          sql +=  ';'; 
     }
  }
  document.form1.wcds.value = sql;
  visual(document.form1);
  document.form1.submit();
}
function syn(n,ss)
{
    myprompt(ss);
}

function delimit(c1,def )
{
      var c2 = ')'; 
      var jj = 0; 
      while (jj < def.length && (def.charAt(jj) == ' ' || def.charAt(jj) == '\n'|| def.charAt(jj) == '\r') ) 
          jj++;
      if (jj == def.length || def.charAt(jj) != c1 ) 
      {
         aword = null; 
         return;
      }
      var m = ''; 
      jj++;
      for(; jj < def.length  && def.charAt(jj) != c2; jj++ ) 
      { 
         m += def.charAt(jj);
      }
      if (jj == def.length) 
      {
         aword = null;
      }
      else
      {
         aword = m ;
         def = def.substring(jj+1);
      }
}

function checkall()            
 {                              
    var b = document.form1.check1.checked; 
    var ml = document.form1;     
    var len = ml.elements.length;  
    for (var i = 0; i < len; i++)  
   {                              
      var e = ml.elements[i];    
      if (e.name.indexOf("checkbox") == 0) 
         e.checked = b; 
   } 
 }

function init()            
{   
    document.form1.check1.checked = true;
    checkall();
    var b = document.form1.check1.checked; 
    var ml = document.form1;     
    var len = ml.elements.length;  
    for (var i = 0; i < len; i++)  
   {                              
      var e = ml.elements[i];    
      if (e.name.indexOf("checkbox") == 0 && (e.value =='Course' || e.value=='Apptables' || e.value=='Student' || e.value=='Advisor' || e.value=='Operation' || e.value=='Major'|| e.value=='Task')) 
         e.checked = false; 
   } 
}
init();
resizebut(document.form1);

var helpstr = "<%=Toolbox.emsgs(orgnum,427)%>\n<%=Toolbox.emsgs(orgnum,404)%> 'WHERE'<%=Toolbox.emsgs(orgnum,405)%>    \"courseid='eng101' AND grade > -1\"";
</script>
<script type="text/javascript"  src=helpformat.js></script>
<script type="text/javascript" >
helpstr +="<br><br><b><font color=purple>" + textmsg[51] +"</font></b><br>";
helpstr +="<table><tr><td valign=top> <input style=background-color:#CC0000;color:white;width:60px type=button value=Delete> </td><td><%=Toolbox.emsgs(orgnum,424)%></td></tr></table>";
</script>
<script type="text/javascript"  src=curve.js></script>
<iframe name="w<%=tstmp %>" width="1" height="1" scrolling="no"  style="visibility:hidden" />
</body>
</html>
