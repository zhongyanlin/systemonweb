/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/

var helpstr1 = helpstr.replace(/[\n| ]+$/,"");
helpstr = helpstr.replace(/[\n|\s]+$/,"");
helpstr = helpstr.replace(/^[\n|\s]*/,"\n"); 
var hasfielddes =   helpstr.indexOf("<!---->");
  
if (hasfielddes > 0)
{
    var allbuttonhelp = helpstr.substring(hasfielddes+7);
     
    helpstr =  helpstr.substring(0,hasfielddes).replace(/([^:]+):([^\n]+)/g, "<tr><td valign=top width=90><table width=100%  bgcolor=" + BBGCOLOR +"><tr width=100% ><td   width=100% ><NOBR><b><font color=black>$1</font></b></NOBR></td></tr></table></td><td>$2</td></tr>");
    
    helpstr +=    allbuttonhelp;
}
if (helpstr.indexOf("<tr") < 0 && helpstr.indexOf("<TR") < 0) helpstr = "<tr><td>" + helpstr + "</td></tr>";
if (helpstr != '')
helpstr = "<table border=0>" + helpstr + "</table>";
 
if (hasfielddes > 0)
    helpstr = "<b><font color=purple>" + textmsg[50] + "</font></b><br>\n" + helpstr;
var helpstrrr = helpstr.replace(/RECURSSIVEHELP([^ ]+)/g,"<a href=\"javascript:opener.framehelp('$1')\">Help</a>");
helpstr = helpstrrr;
helpstr1 = helpstr1.replace(/^[\n|\s]*/,"\n"); 
hasfielddes = helpstr1.indexOf("<!---->"); 
if (hasfielddes > 0)
    helpstr1 = helpstr1.substring(0,hasfielddes).replace(/\n([^:]+):([^\n]+)/g, "<tr><td valign=top><b style=background-color:" + BBGCOLOR +"> <NOBR>$1</NOBR></b>$2");
   +  helpstr1.substring( hasfielddes);
helpstr1 = helpstr1.replace(/RECURSSIVEHELP([^ ]+)/g,"<a href=\"javascript:opener.framehelp('$1')\">Help</a>");
 
if (helpstr1!='')
helpstr1 = "<b><font color=purple>"+textmsg[50]+"</font></b><br>\n<table border=0>" + helpstr1 + "\n</table>";

function showhelp2(helpwin)
{
     
    
    if (helpwin==null)
    {
       myprompt(helpstr);
       setRoundedWidth(promptwin, 400);
       promptwinfit();
       promptwin.style.top = document.body.scrollHeight + 'px';
       return;
    }
    var nav2 =  open('',helpwin);
    var rootstyle = document.getElementsByTagName("head")[0].innerHTML;
   let jj = rootstyle.indexOf(":root");
   if (jj == -1)rootstyle = '';
   else 
   {
      let kk = rootstyle.indexOf("}",jj);
      rootstyle = "<style>" + rootstyle.substring(jj,kk+1) + "</style>";
   } 
    nav2.document.write("<html>" + metaencode + "<head>" + rootstyle + "<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\" />");
    nav2.document.write(unifontstyle(font_size));
    nav2.document.write("<title>" + textmsg[7] + "</title></head><body>");
    nav2.document.write(unititle(textmsg[7],"outset2"));
    if (helpstr!='')
    {
        nav2.document.write( "<table><tr height=5><td></td></tr></table><TABLE width=100% border=0 class=outset1 cellpadding=3 cellspacing=1><TR><TD valign=TOP>"); 
        nav2.document.write(helpstr);//.replace(/<.td><td>/g,'').replace(/width=90><table width=100%/g,'colspan=2><table width=90'));
        nav2.document.write("</td></tr></table>");
    }
    endDocWrite(nav2); 
    //nav2.document.write('<html><head><style>input {background-color:#0000CC;color:antiquewhite;font-weight:700;width:65px;vertical-align:middle}</style><title>Help </title></head><body bgcolor=lightyellow>' + helpstr +"</body></html>");
    if (typeof (resizehelpbut)!='undefined')
       resizehelpbut(nav2);
}

function showhelp(helpwin)
{
    if (helpstr.length < 30000)
    {
       myprompt(helpstr, null,null, textmsg[17]);
       setRoundedWidth(promptwin, 560);
       promptwinfit();
      // promptwin.style.top = document.body.scrollHeight + 'px';
       return;
    }
    if (helpwin==null) helpwin = "helpwind";
    var l = helpstr.length/3; 
    if (l < 300) l = 300;
    if (l > 650) l = 650;
    var nav2 =  open('',helpwin, dim(600,l) );
    nav2.document.write('<html>' + metaencode +'<head><link rel="stylesheet" type="text/css" href="styleb'+ (orgnum%65536)+'.css" />');
    nav2.document.write(unifontstyle(font_size));
    nav2.document.write("<title>" + textmsg[7] + "</title></head><body>");
    nav2.document.write(unititle(textmsg[7],"outset2")); 
    nav2.document.write( "<table><tr height=5><td></td></tr></table>");
    if(helpstr!='')
    {
        nav2.document.write( "<TABLE width=100% border=0 class=outset1 cellpadding=3 cellspacing=1><TR><TD valign=TOP>"); 
        nav2.document.write(helpstr);
        nav2.document.write("</td></tr></table>"); 
    }
    unifonts(nav2.document.body, myfontname); 
    endDocWrite(nav2);
    if (typeof (resizehelpbut)!='undefined')
    resizehelpbut(nav2);
}