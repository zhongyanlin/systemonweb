<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>

<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
long tstmp = System.currentTimeMillis() % 10000000;
CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
User user =   (User) (session.getAttribute("User"));
int fs = (user!=null)?cachedstyle.fontsize: Toolbox.defaultFontSize;
String pagetitle= Toolbox.dbadmin[orgnum%65536].unitname[orgnum>>16]; 
          if (pagetitle == null || pagetitle.equals(""))
              pagetitle =  Toolbox.emsgs(orgnum,906);
if (user==null)
{
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>"><head>
        <%=Toolbox.getMeta(orgnum)%></head><body><script type="text/javascript" >parent.document.location.href="index.jsp";</script></body></html>
<%
return;
}
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head>
<%=Toolbox.getMeta(orgnum)%><title><%=Toolbox.emsgs(orgnum,439)%></title>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<%=Toolbox.unifontstyle(fs,orgnum)%>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("indexmenu.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript"  src=funblock<%=orgnum%65536%>.js></script>
<script type="text/javascript" >


function systemname()
{
    return '<%=pagetitle%>';
}
var subdb = '<%=user.id%>';
var courseGoing=null;
function getCourseGoing(){ return courseGoing;}
function setCourseGoing(cid){ courseGoing=cid;}
//function addother(subdb,semester)
{
  for (var i=0; i < funlinks.length; i++)
  if ( funlinks[i][2].indexOf("rdap=mycourse") >0
    || funlinks[i][2].indexOf("rdap=mysession") >0
    || funlinks[i][2].indexOf("rdap=mystudent0") >0
    || funlinks[i][2].indexOf("rdap=grading") >0
    || funlinks[i][2].indexOf("rdap=messages0") >0
    || funlinks[i][2].indexOf("rdap=webservices0") >0
  )
   funlinks[i][2] += subdb;
}

var WIDTH = 1300;
var userid = "<%= user.id%>", roles="<%= user.roles %>";
var menus  =['<%=Toolbox.emsgs(orgnum,1431)%>'];
var picicon  = ['image/icon/cup3.png'];
var m = new Array(); var N = 0;
m[N++] = ["home.jsp", "<%=Toolbox.emsgs(orgnum,1334)%>", '<%=Toolbox.emsgs(orgnum,1431)%>',""];
<% if ( (user.roles & 2) > 1 || (user.roles & 4) > 1 ||(user.roles & 8) > 1 ||(user.roles & 16) > 1 ) {%>
m[N++] = ['studentpage.jsp','<%=Toolbox.emsgs(orgnum,1229)%>', '<%=Toolbox.emsgs(orgnum,1431)%>',""];
<%}%>
m[N++] = ['index.jsp','<%=Toolbox.emsgs(orgnum,508)%>', '<%=Toolbox.emsgs(orgnum,1431)%>',""];
//m[N++] = ["index.htm", "<%=Toolbox.emsgs(orgnum,1358)%>", '<%=Toolbox.emsgs(orgnum,1431)%>',""];
m[N++] = ["login.jsp?follow=logout","<%=Toolbox.emsgs(orgnum,870)%>", '<%=Toolbox.emsgs(orgnum,1431)%>',""];
for (var j=0; j < funlinks.length && funlinks[j][0]==0; j++);
    
for (; j < funlinks.length; j++)
{
    
      if (funlinks[j][0]-1 < funblocks.length &&(  funlinks[j][4] == -1 ||
           (   userid !=''  &&  (funlinks[j][4] & roles) > 0
                &&  funlinks[j][5].indexOf("-" + userid) < 0
             ||userid !='' && funlinks[j][5].indexOf("+" + userid) >=0
           )
           )
         )
         {
            menux = funblocks[funlinks[j][0]-1][2];
            if (menus[menus.length-1]!=menux && menux!='')
            {
               menus[menus.length] = menux;
               picicon[picicon.length] = funblocks[funlinks[j][0]-1][1];
            }
            if (menux!='')
            m[N++] = [funlinks[j][2], funlinks[j][3], menux,""];
         }
}

var z = new Array();
var n = 0;
var acs = ['','s','r','r','u','d'];
var act = acs;
function menu(arr)
{
   for (var i=0; i < arr.length; i++)
   {
     
    if (arr[i]=='') continue;
      document.write("<tr height=22 id=tr + " + i +"><td width=15><a href=javascript:expandmenu(" + i +")><img  width=<%=cachedstyle.fontsize%>    style=\"border:0px\" id=menu" + i +" src=image/menuc.gif></a></td><td  width=16><img   style=\"background-color:<%=cachedstyle.TBGCOLOR%>;border:0px;border-radius:8px\" id=menud" + i +" src=" + picicon[i] +" width=<%=cachedstyle.fontsize%>></td><td  colspan=3 valign=center style=color:gold><nobr>" + arr[i] +"</nobr></td></tr>");
   }
}

var ibgcolor = '<%=cachedstyle.IBGCOLOR%>';

</script>
<link rel=StyleSheet type="text/css" href=style.css>
</head>
<body style="margin:6px 12px 6px 6px;background:<%= cachedstyle.IBGCOLOR %> right url(image/backgd.gif) repeat-y">
<Center>
<table width=100% align=center cellspacing=0 cellpadding=3>
<tr> <td  class="outset" align=center>
<img src="image/tm.png" width="210" >
</td></tr>
 
</table>


<form rel=opener name=f1 style="margin:5px 0px 5px 0px"  >

<TABLE id="table1" class=outset width=100% cellpadding=0 cellspacing=0 border="0">


<tr>
<td valign=center  colspan="1" width=<%=cachedstyle.fontsize%>></td>
<td colspan="4">
<input id="pat"  class=box  size=10 style="width:120px" name=pat>
<input type=button  class=GreenButton style="width:65px" name=patbut value="<%=Toolbox.emsgs(orgnum,37)%>" onclick="javascript:searchit()">
</td>
</tr>


<tr>
<td valign=center  colspan="1" width=<%=cachedstyle.fontsize%>></td>
<td colspan="4"><table cellpadding="0" cellspacing="0"><tr>

<%String[] xx = Toolbox.emsgs(orgnum,1336).split(","); int fsz = 8 + (int)(cachedstyle.fontsize/3.5); %>
<td  style="font-size:<%=fsz%>px;" >
<select name=fontsize style="font-size:<%=fsz%>px" onchange="changefonts(this)">
   <% for (int i=8; i < 40; i++)
      out.println("<option value=" + i +" " + ((i==cachedstyle.fontsize)?"selected":"") +">" + i + "</option>");
   %>
</select >
</td>
<td>&nbsp;</td>
<td  style="font-size:<%=fsz%>px;color:#DDCC11" ><nobr><%=xx[0]%></nobr></td>
<td><input name="tarwin" style="background-color:transparent" type="radio" value="0" ></td>
<td  style="font-size:<%=fsz%>px;color:#DDCC11" ><nobr><%=xx[1]%></nobr></td>
<td><input name="tarwin" style="background-color:transparent" type="radio" value="1" ></td>
<td  style="font-size:<%=fsz%>px;color:#DDCC11" ><nobr><%=xx[2]%></nobr></td>
</tr></table>
</td>
</tr>
<script type="text/javascript" >
menu(menus);
</script>

</TABLE>
</form>
 
<%=Toolbox.sponsor(orgnum,11 , 0).replaceFirst("<img [^>]*>","")%>

<script type="text/javascript" >
document.f1.tarwin[0].checked = (screen.width >= WIDTH);
document.f1.tarwin[1].checked = (screen.width < WIDTH);
 
function whichtar(j)
{
   if (j!=null )
   {
   var url= m[j][0];
   if (url.indexOf("index.")>=0)
      return  "";
   else if (url.indexOf("home.jsp")>=0)
      return parent.frames[1].name;
   }

   if (document.f1.tarwin[0].checked)
      return parent.frames[1].name;
   return "_blank";
}
function invoke1()
{
   window.open("home.jsp", parent.frames[1].name);
}

function insertAfter( referenceNode, newNode )
{
   referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
}
function findmenui(str){var i=0; for(; i < menus.length && menus[i]!= str; i++);return i;}
var menuopened = new Array(menus.length);
function initflags(b)
{
   for(var i =0; i < menus.length; i++)
     menuopened[i] = b;
}
function expandmenu(i)
{
   var sign= document.getElementById("menu" + i);
   var signd= document.getElementById("menud" + i);
   var tt = sign.src;
   if (tt.indexOf('menuc.gif') > 0)
   {
      menuopened[i] = true;
      for (var j=N-1; j >= 0; j--)
      {

         if (m[j][2]!=menus[i]) continue;
         var tr = document.createElement("tr");
         tr.setAttribute("height","22");
         insertAfter(sign.parentNode.parentNode.parentNode,tr);
         var cell = tr.insertCell(0);
         cell.setAttribute("width","16");
         cell.innerHTML = "<img  width=<%=cachedstyle.fontsize%>    style=\"border:0px;border-radius:8px\" src=image/menul.gif >";
         cell = tr.insertCell(1);
         cell.setAttribute("width","16");
         cell.innerHTML = "<img  width=<%=cachedstyle.fontsize%>    style=\"border:0px;border-radius:8px\" src=image/menuf0.gif>";
         cell = tr.insertCell(2);
         cell.setAttribute("width","16");
         cell.innerHTML = "<img  width=<%=cachedstyle.fontsize%>    style=\"border:0px;border-radius:8px\" src=image/menuf.gif>";
         cell = tr.insertCell(3);
         cell.setAttribute("colspan",2);
         cell.colSpan = 2;
         cell.setAttribute("align","left");
         cell.setAttribute("valign","center");
        /* var tarwin = parent.frames[1].name;
         if (screen.width < WIDTH && ( m[j][0] == "domainvalue.jsp"
            ||m[j][0].indexOf("DataSearch") == 0
            ||m[j][0] == "talk.jsp"
            ||m[j][0] == "announcement.jsp"
            ||m[j][0] == "tables.jsp"
            ||m[j][0] == "discussion.jsp"
            ||m[j][0] == "dboperation.jsp"))
            tarwin = "_blank"; */
         cell.innerHTML = "<a href=\"javascript:openme("+j+")\"><nobr>" + m[j][1] +"</nobr></a>";

      }
      sign.src = "image/menuo.gif";
      signd.src = "image/menudo.gif";
   }
   else
   {
      tr = sign.parentNode.parentNode.parentNode;
      menuopened[i] = false;
      for (j=N-1; j >= 0; j--)
      {
         if (m[j][2]==menus[i])
         tr.parentNode.removeChild(tr.nextSibling);
      }
      sign.src = "image/menuc.gif";
      signd.src = picicon[i];
   }
   fitmenu();
   showupdown();
}
function openme(j)
{
   var tar = whichtar(j);
   if (tar=='')parent.document.location.href=m[j][0];
   else open(m[j][0],tar);

}
function openform(url,k)
{
   if (k > 2)
   {
      myprompt(textmsg[847],"1", "openitup(v,'" + url +"')");
   }
   else open(url, whichtar());

}
 
function openitup(param,url)
{
   url += param;
   open(url, whichtar());
}
var replywin = null;
function setcrosssite(s)
{
    crosssite=s;
}
var lines = new Array();
var numlines = 0;
function parseas(ele, jj)
{
   if (ele.childNodes == null || ele.childNodes.length == 0) return;
   for (var i =0; i < ele.childNodes.length; i++)
   {
      if (ele.childNodes[i].tagName==null) continue;
      if (ele.childNodes[i].tagName.toLowerCase() == 'nobr')
      {
         lines[numlines++] = ele.childNodes[i];
      }
      else
      {
         parseas(ele.childNodes[i],jj+1);
      }
   }
}
function getLines()
{
   numlines = 0;
   parseas(document.getElementById("table1"),0);
}
function markthme(reg)
{
   for (var j = 0; j < lines.length; j++)
   {
      var str  = lines[j].innerHTML;
      var nospan = str.replace(/<span[^>]+>/g, "").replace(/<.span>/g, "");
      lines[j].innerHTML = nospan;
      var k = 0, l2 = 0, l1 = 0;
      str = "";
      while (k <= nospan.length)
      {
         if ( k==nospan.length || nospan.charAt(k) == '<' )
         {
            var m = reg.exec(nospan.substring(l2,k));
            if (m!=null)
            {
               var fd = '' + m;
               var n = nospan.indexOf(fd, l2);
               str += nospan.substring(l2, n)
                   + "<span style=background-color:white;color:" + ibgcolor +">"
                   + fd +"</span>" + nospan.substring(n + fd.length, k);
            }
            else
               str += nospan.substring(l2, k);
            l1 = k;
         }
         else if (nospan.charAt(k) == '>')
         {
            l2 = k+1;
            str += nospan.substring(l1,l2);
         }
         k++;
      }
      lines[j].innerHTML = str;
   }
}
function searchit()
{
   for(var i =0; i < menus.length; i++)
     if (menuopened[i]) expandmenu(i);


   var pat = document.getElementById("pat").value;
   if (pat=='')
   {
      for (var j = 0; j < lines.length; j++)
      {
          var str  = lines[j].innerHTML;
          lines[j].innerHTML = str.replace(/<span[^>]+>/g, "").replace(/<.span>/g, "");
      }
      return;
   }
   var spc = "$^*()=-[]\\|.";
   pat = pat.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
   for (var i=0; i < pat.length; i++)
   {
      if (spc.indexOf(pat.charAt(i))>=0)
      {
         pat = pat.substring(0,i) + "\\" + pat.substring(i);
         i++;
      }
   }
   pat = pat.replace(/[ ]+/, ".*");


   var reg = new RegExp(pat,"i");


   for (j = 0; j < m.length; j++)
   {
      mr = reg.exec(m[j][1]);
      if (mr != null)
      {
         i = findmenui(m[j][2]);

         if (menuopened[i] != true)
            expandmenu(i);
      }
   }
   getLines();
   markthme(reg);
}
initflags(false);
SetCookie("myindexway", "index.html");
invoke1();
resizebut(document.f1,<%=cachedstyle.fontsize*0.8%>);
function changefonts(sel)
{
   open("follows.jsp?x=fontsize&fontsize=" + sel.options[sel.selectedIndex].value +"&follow=indexmenu.jsp",   window.name);
}
var tstmp = <%=tstmp%>;
function syn(n)
{
    if (n == 'del')
    {
        delnotusedattach();
        myprompt(textmsg[1306]);
    }
}
function nullify(j)
{
    
    var tb = document.getElementById('table1')
    for (var i=tb.rows.length-1; i >=0; i--)
    { 
        if (funblocks[j][2] == tb.rows[i].cells[2].innerHTML.replace(/<[^>]+>/g,''))
        {    tb.deleteRow(i); break;}
    }
}
var onloadbeforeindexm  = null;
if (typeof window.onload == 'function')
onloadbeforeindexm = window.onload;
window.onload = function(){
 
<% if (Toolbox.edition.contains("Personal")) {%>
    nullify(11);    
    nullify(10); 
    nullify(7); 
    nullify(6); 
    nullify(4);  
    nullify(3);   
    nullify(2);  
<%}
else if (Toolbox.edition.contains("Institution")) {%>
   nullify(11); nullify(10);
     
<%}%>
    if (onloadbeforeindexm!=null)onloadbeforeindexm();
    }
</script>

<script type="text/javascript"  src=floating.js></script>
<script type="text/javascript" >showupdown();</script>
<script type="text/javascript"  src=curve.js></script>
<span id="homeico"></span>
<iframe name="w<%=tstmp%>" width=1 height=1 />
</body>
</html>
