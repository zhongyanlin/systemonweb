/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
if (helpstr==null) helpstr = "";
helpstr = helpstr.replace(/[\n|\s]+$/,"");
helpstr = helpstr.replace(/^[\n|\s]*/,"\n"); 
var hasfielddes = helpstr.indexOf("<!---->"); 
 
if (hasfielddes > 0)
{
    var allbuttonhelp = helpstr.substring(hasfielddes+7);
    helpstr = helpstr.substring(0,hasfielddes).replace(/([^:]+):([^\n]+)/g, "<tr><td valign=top width=90><table width=100%  bgcolor=" + IBGCOLOR +"><tr width=100% ><td   width=100% ><NOBR><b><font color=#DDCC11>$1</font></b></NOBR></td></tr></table></td><td>$2</td></tr>");
    helpstr += allbuttonhelp; 
}   
helpstr = "<b><font color=purple>"+textmsg[6]+"</font></b><br>\n<table border=0>" + helpstr + "\n</table>";
var helpstrrr = helpstr.replace(/RECURSSIVEHELP([^ ]+)/ig,"<a href=\"javascript:opener.framehelp('$1')\">Help</a>");
helpstr = helpstrrr; 
function framehelp(fm)
{
  var i =0;
  var j = 0;
  for (; j < numCols &&  fields[j] != fm; j++);  
  if (j == numCols) return;
  for (; i < self.frames.length && self.frames[i].name !='iframe'+j; i++);
  if ( i == self.frames.length) return;
   
  self.frames[i].showhelp(); 

}
function showhelp2(helpwin,nav2)
{
    if (helpwin==null)
    {
       myprompt(helpstr);
       setRoundedWidth(promptwin, 400);
       promptwinfit();
       return;
    }
    if (nav2==null) nav2 = openblank(helpwin,dim(400,200),textmsg[7]);
    nav2.document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\" />");
    nav2.document.write(unifontstyle(font_size));
    nav2.document.write(unititle(textmsg[7],"outset2"));   
    nav2.document.write( "<table><tr height=5><td></td></tr></table>");
    nav2.document.write( "<TABLE width=100% border=0 class=outset1 cellpadding=3 cellspacing=1>");
    nav2.document.write( "<TR><TD valign=TOP>"); 
    nav2.document.write(helpstr.replace(/<.td><td>/g,'').replace(/width=90><table width=100%/g,'colspan=2><table width=90'));
    nav2.document.write("</td></tr></table>");
    if (typeof (resizehelpbut)!='undefined')
   {
       resizehelpbut(nav2);
   }
    endDocWrite(nav2); 
}
 
function showhelp()
{
  if (helpstr.length <10000)
    {
       myprompt(helpstr);
       setRoundedWidth(promptwin,  thispagewidth()-100);
       promptwin.style.left = "50px";
       promptwinfit();
       return;
    }
  var helpwin = "helpwindow";
  if (popwin1 != null) helpwin = popwin1;
  var l = helpstr.length/3; 
    if (l < 300) l = 300;
    if (l > 650) l = 650;
  var popstr = dim(500,l);
  var nav2 =  openblank(helpwin, popstr,textmsg[7]);
  nav2.document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\" />");
  nav2.document.write(unifontstyle(font_size));
  nav2.document.write(unititle(textmsg[7],"outset2"));   
  nav2.document.write( "<table><tr height=5><td></td></tr></table>");
  nav2.document.write( "<TABLE width=100%                  border=0 class=outset1 cellpadding=3 cellspacing=1>");
  nav2.document.write( "<TR><TD valign=TOP>"); 
  nav2.document.write(helpstr);
   
  nav2.document.write("</td></tr></TABLE> ");
  if (typeof (resizehelpbut)!='undefined')
   {
       resizehelpbut(nav2);
   }
  endDocWrite(nav2);
}