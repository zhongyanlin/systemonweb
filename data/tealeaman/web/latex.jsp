<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>


<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = (User)(session.getAttribute("User"));
String mode = Toolbox.validate( Toolbox.defaultParam(orgnum,request, ("mode"), null), null, 10);
   long tstmp = System.currentTimeMillis() % 1000000;

%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
<title>Online LaTex</title>

<%
   if (mode == null){
%>
 </head>
  <frameset cols="60%,*" >
  <frame  scrolling="auto"  name="w<%=tstmp%>" src="latex.jsp?mode=left" />
  <frame  scrolling="auto"  name="e<%=tstmp%>" src="" />
 </frameset>
 <%}
else if (mode.equals("rows")){
%>
 </head>
 <frameset rows="60%,*" >
 <frame  scrolling="auto"  name="w<%=tstmp%>" src="latex.jsp?mode=left" />
 <frame  scrolling="auto"  name="e<%=tstmp%>" src="" />
 </frameset>

 <%}
else  if (mode.equals("latex"))
{%>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" src="LaTeXMathML.js"></script>
<script type="text/javascript" src="checkHTML.js"></script>
<link   rel="stylesheet" href="display-mathml.css?r=stable" />
<script type="text/javascript" src="display-mathml.js?r=stable"></script>
<%=cachedstyle.toString()%><link   rel="stylesheet" type="text/css" href="stylea.css" />
<link   rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript" >
function resett()
{
    var x = parent.frames[0].document.f.source.value;
    document.body.innerHTML = checkh(x, true);
    setTimeout("displaylatex(document.body)", 500);
}
onload = resett;
onunload = function(){parent.frames[0].setopen();}
</script>
</head>
<body>
</body>
<%}
else
{
 %>

<script type="text/javascript"  src="LaTeXMathML.js"></script>

<script  type="text/javascript" src="display-mathml.js?r=stable"></script>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("latex.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<%=cachedstyle.toString()%><link   rel="stylesheet" type="text/css" href="stylea.css" />
<link   rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />

</head>
<body>
    <script  type="text/javascript"   src="checkHTML.js"></script>

<script  type="text/javascript"   src="findrep.js"></script>
    <%= Toolbox.title("Online LaTex")%>
     LaTex is the most useful typesetting for producing scientific documents, in particular, for math, physics and engineering.
     This tool renders LaTex codes on fly. Two simple rules   help you to get start.<ul>
         <li>LaTex codes have to be enclosed in a pair of dollar sign: $ ... $, or within \begin{...} ... \end{} </li>
         <li>Whenever you type a \&#36; or &#123;, this tool will try to re-render the all codes on the right window</li>
     </ul>
     For learn more , read this tuorial <a href="http://www.cs.cornell.edu/Info/Misc/LaTeX-Tutorial/LaTeX-Home.html" target="_blank">http://www.cs.cornell.edu/Info/Misc/LaTeX-Tutorial/LaTeX-Home.html</a>
     <form rel=opener name="f" method="post" action="ServerAgent"  >
         <table><tr><td class="outset1" id="hinttd" style="color:purple;border:1px #345622 outset;text-align:center">&nbsp;</td></tr><tr><td class="outset1"> <table cellpadding="0" cellspacing="0"><tr><td>
        <input type=button  class=GreenButton style="width:60px" name=cached value="My Saved" onmouseout="hidehint()" onmouseover="showhint1('Switch between example LaTex codes and your own work')" onclick="savedt(this)">
       </td><td> <%=Toolbox.emsgs(orgnum,1348)%>
       </td><td><input name=linenum size=3 >
       </td><td>
       <input type=button class=GreenButton style="width:60px" name=goto value="<%= Toolbox.emsgs(orgnum,1270) %>"  onmouseout="hidehint()" onmouseover="showhint1('Move cursor to specified line')"  onclick="goline()">
       </td><td>
      </td><td>
      <input type=text name=old size=10>
      </td><td>
      <input type=button class=GreenButton style="width:60px"   name=search value="<%= Toolbox.emsgs(orgnum,1113) %>"  onmouseout="hidehint()" onmouseover="showhint1('Search target string')"  onclick="searchstr()">
      </td><td>
      <input type=text name=newstr size=10>
      </td><td>
     <input type=button  class=GreenButton style="width:60px"  name=replace value="<%= Toolbox.emsgs(orgnum,1114) %>"  onmouseout="hidehint()" onmouseover="showhint1('Replace found string by specified new string')"  onclick="replaceit()">
      </td><td>
     <input type=button  class=GreenButton style="width:60px" name=render value="Render"  onmouseout="hidehint()" onmouseover="showhint1('Render the LaTex codes on right window')"  onclick="renderit()">
     </td><td>
     <input type=button  class=GreenButton style="width:60px" name=pdf value="PDF"  onmouseout="hidehint()" onmouseover="showhint1('Complile LaTex to PDF document when finish')"  onclick="dopdf()">
     </td><td>
     </tr></table> </td></tr> <tr><td  id="thetoolbar"  class="outset1" latexml="1" >
     <script type="text/javascript" >
      var str = '<table cellspacing=1 cellpadding=1 style=\"layout:fixed\"><tr height=30>';
      for (var i=0; i <  latexhintbar.length; i++)
      {
         str += '<td class=outset1 width=30 style="border:1px #333333 outset;width:30px;height:30px;overflow:hidden" align=center onmouseout="hidehint(' + i + ')" onmouseover="showhint(' + i +')" onclick="insertlatexhints(' + i + ')">' + latexhintbar[i][1] + '</td>';
      }
      document.write(str + "</td></tr></table>");
      var needtranslator = true;
    </script>


                 </td></tr>
         <tr><td >

     <textarea name="source" rows="20" cols="60" onkeypress="displaytxt(this,event)">
     (A) Inline math expression: $ \frac{x}{y} = a^b $  and a complex one $\frac{x^4}{1+ \frac{y}{y^2+1}}$. A  blank line to break a paragraph.

     (B) Double dollar signs to start a separated line of math equation
     $$ \frac{dy}{dx} = \int_{0}^{x} f(t)dt $$

     (C)Pmatrix: \begin{pmatrix} 1 & 2 & 3 \\ a_{21} & a_{22} & a_{23} \end{pmatrix}


     (D)Vmatrix: \begin{vmatrix} 1 & 2 & 3 \\ a_{21} & a_{22} & a_{23} \end{vmatrix}

     (E)Equation array
      \begin{eqnarray}
        y_{1} & = & 2x_{1} + 3 \label{whatevermeaningfulllabel} \\
        z_{1} & = & \alpha \int_{0}^{\pi} sin(\omegat+\theta) d \theta  \label{anothlabel}
     \end{eqnarray}
     Later on I can reference equation  \ref{whatevermeaningfulllabel}.

     This is pretty much all you need for typing homework for calculus and linear algebra course.  

     </textarea>
     <input type="hidden" name="ext" value="tex,pdf">
     <input type="hidden" name="command" value="pdflatex">
     <input type="hidden" name="feed" value="x">
             </td></tr>
         <tr height=2><td colspan="10" id=barfather0><img id=horbar0 src="image/horbar.jpg"  style="cursor:s-resize;height:2px;width:100%" ></td></tr>

     </table>
    </form>
     
     <form rel=opener name="fsnd" method="POST" action="latex.jsp"  >
         <input type="hidden" name="mode" value="latex">
     </form>

<script type="text/javascript" >
 

var emxa = document.f.source.value;


var savedQuizName = "mylatexml";
function savedt(btn)
{
         if (btn.value == 'My Saved')
         {
             document.f.source.value = localStorage[savedQuizName];
             btn.value ='Example';
         }
         else
         {
             document.f.source.value = emxa;
             btn.value = "My Saved";
         }
}

function goline()
{
    go2line(document.f.linenum.value);
}

function searchstr()
{
    findstrintextarea(document.f.old.value);
}

function replaceit()
{
    replacestrintextarea(document.f.newstr.value);
}


function displaytxt(ta,evt)
{
 var e = evt? evt : window.event;
 if(!e) return true;
 var key = 0;
 if (e.keyCode) {key = e.keyCode;} // for moz/fb, if keyCode==0 use 'which'
 else if (typeof(e.which)!= 'undefined') {key = e.which;}
 var c = String.fromCharCode(key);
 if (key == 13)
 {
     localStorage[savedQuizName] = ta.value;
 }
 else if (c == '$' || c == '}')
 {
     setTimeout( viewlatex , 500);
 }
 return true;
}


var openrender = false;
function setopen()
{
    if (saved!='')
    {
        document.f.source.value = saved;
        saved = '';
    }

    openrender = false;
}
 
function renderit()
{
    openrender = true;
    document.fsnd.target = parent.frames[1].name;
    formnewaction(document.fsnd, "latex.jsp");
    visual(document.fsnd);
document.fsnd.submit();
    
}

function viewlatex()
{
    if (openrender == false)
    {
         renderit();
    }
    else
    {
        parent.frames[1].resett();
    }
}
var saved = '';
function dopdf()
{
    var hadd = (document.f.source.value.indexOf("documentstyle") > 0);
    saved = document.f.source.value;
    if (!hadd) document.f.source.value = "\\documentstyle[11pt,epsf,cite,twoside]{article} \\begin{document}" + saved + "\\end{document}";
    openrender = false;
    document.f.target = parent.frames[1].name; 
    formnewaction(document.f,"ServerAgent");
    visual(document.f);
document.f.submit();
    
}

function movebarhere(anchor)
{
    Drag.init(anchor);
    anchor.onDragStart = function(x,y)
    {
         var xy = findPositionnoScrolling(anchor);
         var wd = anchor.offsetWidth;
         document.body.appendChild(this);
         this.style.position = "absolute";
         this.style.left = xy[0] + 'px';
         this.style.top =  xy[1] + 'px';
         this.style.width = (wd-2) + 'px';
        // currenthoedgey = y;
    };
    anchor.onDragEnd =   function(x,y)
    {
        var xy = findPositionnoScrolling(anchor);
        var i = parseInt(this.id.replace(/horbar/,''));
        y  = xy[1];
        var barassociate = document.f.source;
        xy = findPositionnoScrolling(barassociate);
        y = y - xy[1] ;
        barassociate.style.height = y + 'px';
        var father = document.getElementById("barfather" + i);
        if (father !=null)
        {
        father.appendChild(this);
        this.style.position = "";
        this.style.width = '100%';
        }
    }
}

function res()
{
    if (typeof(allcurveneed0) != 'undefined')
    {
    document.f.source.style.width = '200px';
    document.f.source.style.width = (allcurveneed0[0].offsetWidth + 50) + 'px';
    document.f.source.style.fontSize = "18px";
    }
}


if(typeof (window.onresize) != 'undefined' && window.onresize!=null)
{
      var existing  = window.onresize;
      window.onresize = function()
      {
          existing();
          res();
      };
}
else
{
      window.onresize = function()
      {
           res();
      };
}
if(typeof (self.onresize) != 'undefined' && self.onresize!=null)
{
      var existing  = self.onresize;
      self.onresize = function()
      {
          existing();
          res();
      };
}
else
{
      self.onresize = function()
      {
           res();
      };
}


onload = function()
{
    textareatobesearch=document.f.source;
   // showlatexpanel(textareatobesearch);
    res();
    document.f.source.style.height='400px';
    movebarhere(document.getElementById("horbar0" ));
    renderit();
}
var showhint1 = function(str)
{
   document.getElementById("hinttd" ).innerHTML = str;
}
showhint = function(i)
{
   document.getElementById("hinttd" ).innerHTML = latexhintbar[i][2];
}
hidehint = function()
{
   document.getElementById("hinttd" ).innerHTML = '&nbsp;';
}
</script>
<script type="text/javascript"  src="curve.js"></script>
</body>
<%}  %>
</html>
