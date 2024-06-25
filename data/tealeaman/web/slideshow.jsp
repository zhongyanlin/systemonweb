
<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
    User user = (User)(session.getAttribute("User"));
%>
<%!
String  butwidth(String str, int font_size)
{
   int leng = (str.length() * font_size)/2 + 4;
   int upper = (int)Math.ceil(Toolbox.charwidthrate() * font_size);
       
   if (leng <  upper) 
       leng =  upper;
   return  "style=width:" + leng +"px";
}
%> 
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,1257)%></title>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<style type="text/css">
.img-shadow {float:left;background: url(image/trans-shadow.png) no-repeat bottom right;}  
.img-shadow img {display: block;  position: relative;  padding: 5px; background-color: #fff;  border: 1px solid #cecece; margin: -6px 6px 6px -6px;}
</style>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("slideshow.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
 
<script type="text/javascript" >
  var options = unescape(top.location.search.substring(1));
  if (options=='')options = '03';
  else if (options.length==1) options += "3";
   
  var word = (textmsg[733] + ";" + textmsg[826] +";" + textmsg[827]+ ";" + textmsg[820] + ";" + textmsg[821] + ";<%=Toolbox.emsgs(orgnum,479)%>;" + textmsg[828]).split(/;/);
</script>
<script type="text/javascript"  src="image/slide/list.js"></script>
</head>

<body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 5px 5px">
    <center>
<form rel=opener name=f  > 
 


<table width=100% class=outset2 style="color:#DDCC11">
<tr>
<td><b><%=Toolbox.emsgs(orgnum,1255)%></b></td> 
<td align=right> <b> <nobr> 
<script type="text/javascript" >document.write(word[0]);</script>
</nobr> </b> </td>
<td> <select name=z></select> </td>
<td align=right> <b> <nobr><script type="text/javascript" >document.write(word[1]);</script></nobr> </b> </td>
<td> <select name=s></select></td>

 
<td> <input type=button name=b class=GreenButton  onclick="pause()" value="Pause"></td>  
<td><select name=ge></select></td>
<td id=pl>Song</td> 
</tr> 
</table>
<table align=center> <tr height=5><td></td></tr> </table>

<table width=100% cellspacing=1 cellpadding=0 style="background-color:#880033;">
<tr><td>
<table width=100% cellspacing=0 cellpadding=0 background="image/random.png" style="background-color:lightyellow;color:#880033">
<tr><td align=center>

<table align=center cellspacing=6 background="image/random.png">
  
 
<tr  background="image/random.png"><td id=m > image </td></tr>
</table>

</td>
</tr>
</table>

</td>
</tr>
</table>


</form> 
</body>
<script type="text/javascript" >
if (typeof (pics) == 'undefined')
{
   document.write("Need a file named data.js that defines the pic name set in the format <br> var pics=\"pic1.jpg pic2.jpg more.jpg\";<br> <br>");
   var pics = "";
   document.write("This file, data.js and all picture files should be put in the same folder.<br><br>");
}
var  i = 1;
for (;  i < 40;  i++)
   document.f.s.options[i-1] = new Option(''+ (3*i) + word[2], ''+ (3*i) );
var second = parseInt(options.substring(1));
if (''+second=='NaN') second = 6;
var ii  = second/3;
var kk = Math.floor(ii);
if (ii - kk >= 0.5) 
   i = kk;
else 
   i = kk - 1;
if (i < 0)  
   i = 0;
document.f.s.selectedIndex = i;

var sw = screen.width;
var sh =screen.height;  

if (typeof (song) == 'undefined')
{
   document.write("data.js should define song name in the format<br>var song=\"songurl1 songurl2 moreurl\";");
   var song = "";
}
var songs = song.split(/[ ]+/);
function songname(s)
{
   var jj = s.lastIndexOf("/");
   if (jj>=0) s = s.substring(jj+1);  
   return s;
}
if (song!='')
{
    
   for (i=0; i < songs.length; i++)
   {
      document.f.ge.options[i] =
      new Option(songname(songs[i]), songs[i]);
   }
   document.f.ge.selectedIndex = 0;
}    
 
var picstr = pics.replace(/[\s|\n]+/g,' '); 
var picarr = picstr.split(/[ ]+/);
var N = picarr.length;

i = 0;
var j = 0;

function show()
{
   i++; 
   if (i==N+1) i = 1;
   if (i <= N)
   {
    document.img.src= "image/slide/" + picarr[i-1] ; 
   // document.getElementById('n').innerHTML = '<B>' + i + "/"+N + ": " + picarr[i-1] +"</B>";
   }
 
   setTimeout("show()", parseInt(document.f.s.options[document.f.s.selectedIndex].value)*1000);

}

function pause()
{
   if ( i >= N)
   {
      i = j;
      j = 0;
      document.f.b.value=word[3];
      show();
      return;
   }

   if (j == 0 )
   {
     j = i;
     i = N+2;
     document.f.b.value=word[4];
   }
   else
   {
     i = j;
     j = 0;
     document.f.b.value=word[3];
     show();
   }
}
function chlng(sel)
{
    document.location.href=('' + document.location).replace(/\?.*$/,'') 
             + '?' + sel.options[sel.selectedIndex].value + 
    document.f.z.options[document.f.z.selectedIndex].value +
    document.f.s.options[document.f.s.selectedIndex].value; 
   
}
function chsz()
{
   var sel = document.f.z;
   var wd = parseInt(sel.options[sel.selectedIndex].value);
   var wdstr = "";
   if (wd == 1) wd = clientw();
   if (wd > 0) 
       wdstr = "width=" + wd;
   document.getElementById("m").innerHTML = "<span class=\"img-shadow\"><img name=\"img\" " + wdstr +" src=\"image/slide/" + picarr[i] + "\"></span>";
}

function clientw()
{
   var wd = thispagewidth();
   return wd- 55;
}

//document.f.g.selectedIndex = (lng=='e')?0:1;
document.f.z.options[0] = new Option(word[5],0);
document.f.z.options[1] = new Option(word[6],1);
document.f.z.options[2] = new Option("400px",400);
document.f.z.options[3] = new Option("600px",600);
document.f.z.options[4] = new Option("800px",800);
var wdindex = parseInt(options.charAt(0));
if (''+wdindex == 'NaN') wdindex = 0;
if (wdindex < 0 || wdindex > 4) wdindex = 1;
document.f.z.selectedIndex = wdindex;
document.f.b.value=word[3];
function rewritesong()
{
  var sel = document.f.ge;
  document.getElementById("pl").innerHTML = "<embed  align=center height=30  loop=20  autostart=true src=\"" 
  + sel.options[sel.selectedIndex].value +"\">"; 
}
rewritesong();
document.getElementById("m").innerHTML = "Downloading the song";
chsz();
document.f.z.onchange = chsz;
document.f.ge.onchange = rewritesong;
show();
 
</script>
</thml>


  