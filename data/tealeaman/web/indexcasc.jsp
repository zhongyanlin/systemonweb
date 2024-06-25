<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>

<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
long tstmp = System.currentTimeMillis() % 10000000;
User user = (User)(session.getAttribute("User"));
if ( user==null)
{
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>"><head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><%=Toolbox.getMeta(orgnum)%></head><body><script type="text/javascript" >parent.document.location.href="index.jsp";</script></body></html>
<%
return;
}
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">

<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,439)%></title>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<style type="text/css">
#floater1Div {position:absolute;left:0px;top:0px;visibility:hidden;z-index:12}

:root .css3-selectbox,
:root .css3-selectbox:select,
:root .css3-selectbox:after,
:root .css3-selectbox:before
{
     display: inline-block;
    vertical-align: top;
     height: <%=cachedstyle.fontsize+6%>px; 
}
 
:root .css3-selectbox:after,
:root .css3-selectbox:before
{
    content: "";
    -moz-pointer-events: none;
    -webkit-pointer-events: none;
    pointer-events: none;
}
 
:root .css3-selectbox,
:root .css3-selectbox:after
{
    background: <%=cachedstyle.IBGCOLOR%>;
    background: -moz-linear-gradient(<%=cachedstyle.IBGCOLOR%>, <%=cachedstyle.IBGCOLOR%>);
    background: -webkit-linear-gradient(<%=cachedstyle.IBGCOLOR%>, <%=cachedstyle.IBGCOLOR%>);
    background: -ms-linear-gradient(<%=cachedstyle.IBGCOLOR%>, <%=cachedstyle.IBGCOLOR%>);
    background: -o-linear-gradient(<%=cachedstyle.IBGCOLOR%>, <%=cachedstyle.IBGCOLOR%>);
    background: linear-gradient(<%=cachedstyle.IBGCOLOR%>, <%=cachedstyle.IBGCOLOR%>);
}
 
:root .css3-selectbox:select
{
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    font: normal <%=cachedstyle.fontsize-6%>px/<%=cachedstyle.fontsize%>px "Segoe UI" ; /* , Arial, Sans-serif; */
    /*color: #fff;*/
    outline: none;
}
 
:root .css3-selectbox option
{
    background: <%=cachedstyle.IBGCOLOR%>;
}
 
:root .css3-selectbox
{
  /*  border: solid 1px #303030;*/
    overflow: hidden;
    cursor: pointer;
   /* border-radius: 3px; */
    position: relative;
   /* box-shadow: 0 0 0 1px #6a6a6a, 0 0 0 1px #919191 inset;*/
}
 
:root .css3-selectbox:before
{
    position: absolute;
    z-index: 1;
    top: 8px;
    right: 4px;
    width: 0;
    height: 0;
    border: solid 0px transparent;
   /* border-top-color: rgba(255, 255, 255, .6);*/
}
 
:root .css3-selectbox after
{
    position: relative;
    left: 1px;
    width: <%=cachedstyle.fontsize%>px;
    margin: 0px 0px 0px -<%=cachedstyle.fontsize+3%>px;
   /* box-shadow: -1px 0 0 1px #919191 inset; */
}
 
:root .css3-selectbox hover before
{
    border-top-color: #DDCC11
}

</style>
<%=Toolbox.unifontstyle(16,orgnum)%>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript"  src=funblock<%=orgnum%65536%>.js></script>
<script type="text/javascript"  src="curve.js"></script>
 
<script type="text/javascript" >
function nullify(j)
{
    for (var i=0; i < funlinks.length; i++)
    if (funlinks[i][0] == j)
        funlinks[i][0] = 0;
}
var courseGoing=null;
var subdb = '<%=user.id%>';
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
<% if (Toolbox.edition.contains("Personal")) {%>
    nullify(3);  nullify(4); nullify(5); nullify(6); nullify(7); nullify(8);  nullify(10);  nullify(11);                             
<%}
else if (Toolbox.edition.equals("Instituion")) {%>
    nullify(3);  nullify(4); nullify(5); nullify(6); nullify(7); nullify(8);                             
<%}%>
    
var WIDTH = 1300;
var userid = "<%= user.id%>";
var roles="<%= user.roles %>";
var menulabels  = ['<%=Toolbox.emsgs(orgnum,1431)%>'];
var picicon  = ['image/nophoto.jpg'];
var menuitem = new Array();
var jj = 0;
menuitem[0]  = new Array();
menuitem[0][jj++] =  ["home.jsp","<%=Toolbox.emsgs(orgnum,1334)%>"];
<%
if ( (user.roles & 2) > 1
  || (user.roles & 4) > 1
  || (user.roles & 8) > 1
  ||(user.roles & 16) > 1 )
{
%>
menuitem[0][jj++] = ['studentpage.jsp','<%=Toolbox.emsgs(orgnum,1229)%>'];
<%
}
%>
menuitem[0][jj++] = ['index.jsp','<%=Toolbox.emsgs(orgnum,508)%>'];
menuitem[0][jj++] = ['index.html','<%=Toolbox.emsgs(orgnum,266)%>'];
<%
if ( user.id.equals("") == false)
{
%>
menuitem[0][jj++] = ["login.jsp?follow=logout","<%=Toolbox.emsgs(orgnum,870)%>"];
<%
}
%>
var shortlabel = ['<%=Toolbox.emsgs(orgnum,1165)%>','<%=Toolbox.emsgs(orgnum,1359)%>',
'<%=Toolbox.emsgs(orgnum,1360)%>',textmsg[500],
'<%=Toolbox.emsgs(orgnum,1361)%>',textmsg[474],
'<%=Toolbox.emsgs(orgnum,1362)%>','<%=Toolbox.emsgs(orgnum,565)%>',
'<%=Toolbox.emsgs(orgnum,336)%>','<%=Toolbox.emsgs(orgnum,1363)%>',
'<%=Toolbox.emsgs(orgnum,1364)%>','<%=Toolbox.emsgs(orgnum,1365)%>',
'<%=Toolbox.emsgs(orgnum,527)%>','<%=Toolbox.emsgs(orgnum,270)%>',
'<%=Toolbox.emsgs(orgnum,1366)%>','<%=Toolbox.emsgs(orgnum,1367)%>'];

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
            menux = shortlabel[funlinks[j][0]-1];
            if (menulabels[menulabels.length-1]!=menux)
            {
               menuitem[menulabels.length] = new Array();
               menulabels[menulabels.length] = menux;
               picicon[picicon.length] = funblocks[funlinks[j][0]-1][1];
               jj = 0;
            }
            menuitem[menulabels.length-1][jj++] = [funlinks[j][2], funlinks[j][3]];
         }
}
menuitem[menulabels.length] = new Array();
for(jj = 0;jj < 26; j++)
{
   menuitem[menulabels.length][jj++] = [(jj+10)+"",(jj+10)+"px"];
}
menulabels[menulabels.length] = "<%=Toolbox.emsgs(orgnum,358)%>";

function initmenus()
{
for (var i=0; i < menulabels.length; i++)
{
  var alink = document.getElementById("nav_item_" + i );
  if (alink == null)
  {
	  
	  continue;
  }
  //alink.onmouseover = function(){showmenu(this);}
  //alink.onmouseout =  function(){hidemenu(this);}
  alink.options[0] = new Option(menulabels[i],"");
  alink.options[0].style.cssText="width:auto;font-weight:700;background-color:<%=cachedstyle.IBGCOLOR%>;color:#DDCC11;border:1px #b0b0b0 solid;overflow:display";
   alink.style.width = (menulabels[i].length * 14+5)  + 'px';
  
  for (var j = 0; j < menuitem[i].length; j++)
  {
    
     alink.options[j+1] = new Option(menuitem[i][j][1],menuitem[i][j][0]);
     alink.options[j+1].style.cssText="width:auto;font-weight:700;background-color:<%=cachedstyle.IBGCOLOR%>;color:white;border:1px #202020 outset";
  }
   
  alink.selectedIndex = 0;
  var leftw = 18;
  if (navigator.appName=='Netscape')
     leftw = 20;
  var xy = findPositionnoScrolling(alink);
  var div = document.createElement("div");
   div.setAttribute("id", "div" + i);
   div.style.cssText="position:absolute;visibility:visible;left:" + xy[0] +"px;top:0px;width:"
  + (alink.offsetWidth-leftw) +"px;height:" + (alink.offsetHeight-1)
  +"px;z-index:10;background:<%="linear-gradient(to right," + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ")"%>;color:#DDCC11;font-weight:700;font-size:16px;border:1px #202020 outset;text-align:center;overflow:hidden";
  div.innerHTML = menulabels[i];
  //document.body.appendChild(div);
  //div.onmouseover = function(){ simulatec(this);}
  
}
window.open("home.jsp", parent.frames[1].name);
shupfloat();
}
var onloadbeforeindexcasc  = null;
if (typeof window.onload == 'function')
onloadbeforeindexcasc = window.onload;

window.onload= function()
{
    if (onloadbeforeindexcasc!=null)
     onloadbeforeindexcasc()
    initmenus();
}


function simulatec(div)
{
   var i = div.id.replace(/div/,'');
   var selbox = document.getElementById("nav_item_" + i );
    var $target = selbox;
        var $clone = $target.clone();
        $clone.val($target.val()).css({
            position: 'absolute',
            'z-index': 999,
            left: $target.offset().left,
            top: $target.offset().top + $target.height()
        }).attr('size', $clone.find('option').length).change(function() {
            $target.val($clone.val());
        }).on('click blur',function() {
            $(this).remove();
        });
        $('body').append($clone);
        $clone.focus();
}

function openthis(s,ii)
{
   for (var i=0; i < menulabels.length-1; i++)
   {
       var alink = document.getElementById("nav_item_" + i );
       if (alink==null) alert('alink is null')
       if (s!=alink)
       {
          alink.selectedIndex = 0;
       }
   }
   if (ii < menulabels.length-1)
   {
      var x = s.options[s.selectedIndex].value;
      if (x.indexOf("index.")!=0)
          open(x, parent.frames[1].name);
      else
          parent.document.location.href = x;
   }
   else
      open("follows.jsp?x=fontsize&fontsize=" + s.options[s.selectedIndex].value +"&follow=indexcasc.jsp",   window.name);
}

function menu(arr)
{ 
   for (var i=0; i < arr.length; i++)
   {
      if (arr[i]=='') continue;
      document.write("<td style=\"width:100px;\" class=\"submenudiv\"><span class=\"css3-selectbox\"><select id=\"nav_item_" + i +
         "\" style=\"font-weight:600; background-color:<%=cachedstyle.IBGCOLOR%>;color:white;border:0px #202020 solid;margin:0px 0px 0px 0px;text-align:center;overflow:display\" onchange=\"openthis(this," + i +")\"></select></span></td>");
   }
}
</script>

<link rel=StyleSheet type="text/css" href=style.css>
</head>
<body style="margin:0px 0px 0px 0px;background:<%= cachedstyle.IBGCOLOR %>"><table valign="top" style="margin:-4px 0px 0px 0px" align=center cellspacing=0 cellpadding=0>
<tr height="30"><td>
 <script type="text/javascript" >menu(menulabels)</script>
</tr></table>
<div  id="floater1Div">
<img src=image/float1.png   onclick=moveleft(event)>
</div>
<script type="text/javascript" >

var replywin = null;

function moveleft(et)
{
    var posx = 0;
    if (et.pageX !=null )
    {
	    posx = et.pageX;
    }
    else if (et.clientX !=null)
    {
	   posx = et.clientX + document.body.scrollLeft
	   + document.documentElement.scrollLeft;
    }
    var floater = document.getElementById("floater1Div");
    var xy  = findPositionnoScrolling(floater);
    var j = posx - xy[0];
    if (j <  15)
    {
       window.scrollBy(-60,0);
       floater.style.left = (xy[0] - 60)+'px';
    }
    else if (j > 15)
    {
       window.scrollBy(60,0);
       floater.style.left = (xy[0] + 60)+'px';
    }
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
function shupfloat()
{
   var wd = screen.width - 40;
   var floater = document.getElementById("floater1Div");
   if (wd < menulabels.length*100)
      floater.style.visibility = "visible";
   else
      floater.style.visibility = "hidden";
   floater.style.left = wd +"px";
   floater.style.top =  "5px";
}
SetCookie("myindexway", "index.htm");

window.resize = shupfloat;
<iframe name="w<%=tstmp%>" width=1 height=1 />
</script>


</body>
</html>
