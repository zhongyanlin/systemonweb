/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
if (typeof(c1to1) == 'undefined')
    var c1to1 = new Array();
c1to1["courseid"] = 152;
c1to1["userid"] = 518;
c1to1["departmentid"] = 434;
c1to1["department"] = 434;
c1to1["semester1"] = 661;
c1to1["semester"] = 661;
c1to1["faculty"] = 689;
c1to1["coursetitle"] = 486;
c1to1["name"] = 15;
c1to1["course"] = 152;
c1to1["postdate"] = 579;
c1to1["coursetitle"] = 486;
c1to1["id"] = 37;
c1to1["assignname"] = 317; 
c1to1["sessionname"] = 459;
c1to1["grader"] = 454;
c1to1["code"] = 532;
c1to1["sid"] = 460;
c1to1["major"] = 631; 
c1to1["minor"] = 632;
c1to1["domain"] = 529;
c1to1["iname"] = 35;
c1to1["selectionname"] = 544;
c1to1["session"] = 595; 
c1to1["topic"] = 528;
c1to1["author"] = 670;
c1to1["subject"] = 718;
c1to1["posttime"] = 572;
c1to1["senderuid"] = 570;
c1to1["receipient"] = 571;
c1to1["subdb"] = 694; 
c1to1["format"] = 156;
c1to1["senderuid"] = 570;
c1to1["receipient"] = 571;
c1to1["subdb"] = 694; 
c1to1["semesterto"] = 1385; 
c1to1["semesterfrom"] = 1386; 
c1to1["assignment"] = 126; 
c1to1["dept"] = 434;
c1to1["uid"] = 518;

function trans(str)
{
   if (typeof(en2lang)!='undefined' && en2lang[str]!=null)
   {
       return en2lang[str];
   }
   var str2 = c1to1[str.toLowerCase()];
   
   if (str2==null)
   {
       return str;
   }
   return textmsg[str2];
}
var i0=0, i1=0;
var newtitle = ""; 
if (typeof(title)=='undefined')
   var title = "";
 
while (true)
{
   i0 = title.indexOf("??",i1); 
   if (i0==-1) break;
   newtitle += title.substring(i1,i0) + "[";
   i1 = title.indexOf("??",i0 + 4) + 2; 
   var str = title.substring(i0+2,i1-2);  
   newtitle += trans(str) +"]";
}
title = newtitle + title.substring(i1);
 
document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\" />");
document.write(unititle(title,'outset2')); 
document.write(unifontstyle(font_size));
document.write("<form rel=opener name=form1  method=POST action=" + format + " style=\"margin:5px 0px 0px 0px\"  >"); 
//document.write("<form rel=opener name=form1  method=POST action=Echo target=_blank style=\"margin:5px 0px 0px 0px\"  >"); 
for (var i=0; i < namevalue.length/2; i++)
{
    if (namevalue[2*i]!=null && namevalue[2*i]!='' && 'zpcrpt'!=namevalue[2*i])
    document.write("<input type=hidden name=\"" + namevalue[2*i] + "\" value=\"" + namevalue[2*i+1] + "\">");
}
document.write(round1('')+"<TABLE BORDER=0 cellspacing=1 width=100% class=outset3 ><tr><td colspan=2 align=center> </td></tr>");
var fields = fieldstr.split(",");
var sign = new Array(fields.length);
for (i=0; i < fields.length; i++)
{
   sign[i] = fields[i].charAt(0);
   if (sign[i]=='>')
       sign[i] = "&supe;";
   fields[i] = fields[i].substring(1);
   
}
var numCols = fields.length-1;
var ctype;
var types = new Array(numCols);
var hc = 0; 
var ffsize = new Array(numCols);  
var fsize = new Array(numCols);  
var ll = ~~((new Date()).getTime()/1000); 
var lookup = new Array(numCols); 
var hints = new Array(numCols); 
var pointer; 
var iswcds = false;
for (var j =0; j < numCols; j++) 
{ 
   if (fields[j].toLowerCase() == 'wcds')
   {
       myprompt(textmsg[1787]);
       iswcds = true;
       break; 
   }
   if (sign[j]=='&supe;') 
       hints[j] = textmsg[803];
   else if (sign[j]=='&ge;')
   {
       if( ctype[j]=='m')
       hints[j] = textmsg[804];
       else hints[j] = textmsg[806];
   }
   else if (sign[j]=='&le;')
   {
      if (ctype[j]=='m')
       hints[j] = textmsg[805];
      else
       hints[j] = textmsg[807];
   }
   else
       hints[j]= textmsg[808]; 
   if (fields[j] == '') continue;
   
   str = fields[j];
   var under = str.indexOf("_"); 
   
   if (under == -1 || under+2 > fields[j].length) 
   {
       ctype = "t";
       fsize[j] = "15";
   }
   else 
   {
       str = str.substring(0, under);
       ctype = fields[j].substring(under+1,under+2);
       if (under+4 > fields[j].length)
          fsize[j] = 15;
       else
          fsize[j] = fields[j].substring(under+3);
   }
 
   if (depts!=null && depts.length>1 && fields[j].toLowerCase().indexOf('department') >=0)
   {
      pointer = depts; ctype = 's';
   }
   else if (sms!=null && sms.length>1 &&  fields[j].toLowerCase().indexOf('semester') >=0)
   {
      pointer = sms; ctype = 's';
   }
   else if( sroles!=null && sroles.length>1 &&  fields[j].toLowerCase()== 'roles') 
   {
      ctype = 's';  pointer = sroles; 
   }
   else if (fields[j].toLowerCase()== 'courseid' && options[0]!=null )
   {
       pointer = new Array(); 
       ctype = 's';
       for (var i=0; i < options[0].length*2; i++)
       {
           if (i%2==0) pointer[i] = options[0][i/2];
           else pointer[i] = captions[0][(i-1)/2];
       }
   }
   else if (fields[j].toLowerCase()== 'assignment' && options[1]!=null )
   {
       pointer = new Array(); ctype = 's';
       for (var i=0; i < options[1].length*2; i++)
       {
           if (i%2==0) pointer[i] = captions[1][i/2];
           else pointer[i] = captions[1][(i-1)/2];
       }
   }
   types[j] = ctype;
   
   str = trans(str);
   if (str.charAt(0) == '2' && !isNaN(str)) str = textmsg[parseInt(str.substring(1))]
   str = str.replace(/([a-z])([A-Z])/g, "$1&nbsp;$2"); 
   str = str.substring(0,1).toUpperCase() + str.substring(1); 
   document.write( "<TR><TD VALIGN=top><table cellspacing=1 cellpadding=3 width=" + Math.floor(font_size*20/3) +"><tr><td bgcolor="+ IBGCOLOR + " width=90 style=\"background:" + gradientbg.replace(/\(/,'(to right,') + "\"><font color=#DDCC11><b><NOBR>"+ str +"</NOBR></b></font></td></tr></table></TD>");
   document.write( "<td align=center><div  onMouseOver=\"showmyhint(" + j  + ")\"   onMouseOut=\"hidemyhint()\" ><nobr><b>" + sign[j]  + "</b></nobr></div></TD>");
   //document.write( "<td> " + sign[j] +" </td>"); 
   x = ctype.toLowerCase(); 
   if (x=='a' || x=='n' )
   {
        var sa = fsize[j].indexOf("_"); 
        if (sa > 0)
        {
                ffsize[j]  = fsize[j].substring(sa+1);
                fsize[j]  = fsize[j].substring(0, sa);
        }
        else
        { 
                if (x == 'n')
                   ffsize[j] = "2";
                 
                else
                   ffsize[j] = "30";
         }
    }
    switch(ctype) 
   { 
      case 's': case 'S': 
      document.write( "<TD width=95%  align=left> <SELECT  onchange=refillopts(this," + j + ")  name="+fields[j] ); 
      document.write( "><option value=\"\"></option>"); 
      for (var jj=0; jj < pointer.length/2; jj++) 
         document.write("<option value=\"" + pointer[jj*2].replace(/"/g,'\\"') + "\">" + pointer[jj*2+1] + "</option>"); 
      document.write("</SELECT>"); 
      break; 
     
       case 'a': case 'A': 
          
      hc += parseInt(fsize[j])*(font_size+4); 
      document.write( "<TD VALIGN=top width=95%  align=left><textarea  cols="+ffsize[j]+" rows="+fsize[j]+" name="+fields[j] + "></textarea>"); 
      lookup[j] = elecount++;   
      break;
         
      case "m": case "M": 
       hc += (font_size+8);    
       if (fields[j]!=null && fields[j]!=''){
      document.write( "<TD VALIGN=top width=95%  align=left><INPUT type=hidden name=" + fields[j] + " value=\"" + ll +"\">");
      document.write( "<INPUT class=left style=\"border:1px #050505 solid\" SIZE="+ fsize[j] + " onchange=UT(" + j +",this.value) name=timet" + j +" value=\"" + timestr(ll)+"\">");
      lookup[j] = elecount; elecount += 2;   }
      break;

      
      case "n": case "N": 
      hc += (font_size+8);
      document.write( "<TD VALIGN=top width=95%  align=left><INPUT class=left class=left style=\"border:1px #050505 solid\" SIZE="+fsize[j]+" name="+fields[j] + " onchange=UN(" + j +",this.value)  onkeypress=allowenter1(" + j +",event)>\n");
      lookup[elecount] = elecount++;
      break;
  
      case "p":  case "P":  
      hc += (font_size+8);
      document.write( "<TD VALIGN=top width=95%  align=left><INPUT  class=left class=left style=\"border:1px #050505 solid\" SIZE="+fsize[j]+" name="+fields[j] + " type=password >\n"); 
      lookup[j] = elecount++;
      break;

      case 'c': case 'C':
      if (fields[j]!='' && fields[j]!=null){
      hc += (font_size+8);
      lookup[j] = elecount; elecount+=2;
      document.write(" <TD align=left valign=top> <input type=hidden name=" + fields[j] +" value=0>");
      document.write(" <INPUT  type=checkbox NAME=ck"+ j + " onchange=UC("+j+",this.checked)>"); 
      }
      break;
      default:
      hc += (font_size+8);
      lookup[j] = elecount++;
      document.write( "<TD VALIGN=top width=95%  align=left><INPUT   class=left class=left style=\"border:1px #050505 solid\"   SIZE="+fsize[j]+" name="+fields[j] + ">\n"); 
      break;
   } 
   document.write( "</TD></tr>");
} 
if (iswcds==false)
document.write( "<tr><td colspan=3 align=center><input  class=GreenButton " 
    + butstyle(font_size) 
    + ";background-color:#00BBBB;color:white;font-weight:700 name=savebtn type=submit value=\""
    + textmsg[720] + "\"> <input  class=GreenButton " + butstyle(font_size) +";background-color:#00BBBB;color:white;font-weight:700 name=savebtn1 type=button onclick=\"realClose()\" value=\""
    + textmsg[18] + "\"></td></tr></table>" + round2 +"<input type=hidden name=securitytoken value=\"" + securitytoken + "\" ></form>");
 document.write( "<div id=anchor name=anchor style=\"width:1px;height:1px;float:right\"><!----></div>");
var f1 = document.form1; 
function UC(c,v) 
{ 
      f1.elements[lookup[c]].value = (v == true)?'1':'0';
}
function UM(c,v) 
{ 
       var tt = ''+parseTime(v); 
       if (tt != '-1')
       { 
          f1.elements[lookup[c]].value = tt;
       }
       else
       { 
          f1.elements[lookup[c]].focus();
          myprompt( textmsg[75] + timeformat);
             
       }
}  
function UN(c,v) 
{ 
       { 
          f1.elements[lookup[c]].focus();
         
       }
}  
function refillopts(sel,j)
{
    if (j>0) return;
    var cid = sel.options[sel.selectedIndex].value;
    if (cid=='') return;
    var q = document.form1.Assignment;
    for (var i=q.options.length-1; i>=0; i--)
    {
        q.options[i] = null;
    }
    var ii=0;
    for (var i=0; i < captions[1].length; i++)
    {
        if (options[1][i] == cid) 
        q.options[ii++] = new Option(captions[1][i],captions[1][i]);
    }
}
function fitme()
{
    var anc = document.getElementById("anchor");
    var wname = window.name;
    if (anc==null )return;
    if (typeof (findPositionnoScrolling) != 'undefined'){
    var xy = findPositionnoScrolling(anc);
    if (wname=='openlink')
        parent.fitwithin(xy);
    else if (parent.name=='openlink' && window!=parent) 
    {
        
        xy[0] += 250;
       
        parent.parent.fitwithin(xy);
    }
     
    }
}
function resizeCont(){}
 
function allowenter1(j,evt)
{ 
   return  isDigitEvent(evr);
}
 
window.onresize = resizeCont;

          
if (opener!=null&& onmydomain(opener)&& opener.getInit!=null)
{
   var initvalue = opener.getInit();
   if (initvalue != null)
   { 
     for (j =0; j < numCols; j++) 
     { 
      document.form1.elements[lookup[j]].value = initvalue[j];
      if (types[j] == 'm')
           document.form1.elements[lookup[j]+1].value = timstr(initvalue[j]);
      else if (types[j] == 'c')
           document.form1.elements[lookup[j]+1].checked = (''+initvalue[j] == '1');
     } 
   }
}

function rsize(twidth)
{
    if (twidth < font_size*30 + 40)
        twidth = font_size*30 + 40;
    if (twidth>600)
        twidth = 600;
    if (parent==window)
    {
       resizeTo(twidth, 250 + hc);
       moveTo((screen.width-twidth)/2, (screen.height-250-hc)/2);
    }
}
theight += elecount * 1.6 * font_size - 50;
resizebut(document.form1, font_size);
var onloadmit = onload;
onload = function()
{
    if (onloadmit!=null) onloadmit();
    var  div1 =  document.getElementById('titlediv');
if(div1!=null)
{  
    div1.onmouseover=function(){showmyhintstr(rdap);}
    div1.onmouseout=hidemyhint;
}
fitme();
}

