/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
document.write("<style>.img-shadow {float:left;background:url(image/trans-shadow.png) no-repeat bottom right;}\n"); 
document.write(".table-shadow {float:left;background:url(image/trans-shadow.png) no-repeat bottom right;}\n");
document.write(".table-shadow table {display: block;  position: relative;  padding: 5px; background-color: #fff;  border: 1px solid #cecece; margin: -6px 6px 6px -6px;}\n");
document.write(".img-shadow img {display: block;  position: relative;  padding: 5px; background-color: #fff;  border: 1px solid #cecece; margin: -6px 6px 6px -6px;}</style>"); 
document.write( "<center>\n"); 
document.write(unititle(title,'outset2')); 
document.write(unifontstyle(font_size));
 
var hc = 0; 
var buttons = ""; 
var rsstr = ""; 
var rowsize, colsize, sa;
var jj;
 


 
if (numRows == 0)
{
    document.write(textmsg[351]);
    if (rdapname.toLowerCase().indexOf('syllabus')>=0)
    {
        document.write("Open " + textmsg[356] + " " + textmsg[776]);
    }
}  
for (var r=0;r < numRows; r++)
{  
var att =  makehw(r); 
document.write(round1('100%') + "<table id=tbl" + r  +"  class=outset3 cellspacing=1 width=100% bgcolor=" + DBGCOLOR +" >");
var wvalue = ""; 
 
for (var j1=0;  j1 < numCols; j1++)
{
   j = positionr[j1];
   
   var str = null; 
   if (ctype[j] == null) ctype[j] = "";
   if (ctype[j] == 'h'||ctype[j] == 'k') continue;
   if (j==0 || fold[j-1])
      {
         document.write("<TR>");
         maxfinr1 = 0;
      }
      else
      {
         maxfinr1++;
      }
   if (fields[j].indexOf("nolabel") != 0 ) 
   {  
         str = labels[j].replace(/([a-z])([A-Z])/, "$1&nbsp;$2").replace(/([a-z])([A-Z])/, "$1<br>$2").replace(/([a-z])([A-Z])/, "$1&nbsp;$2"); 
         if (str != '')
         {
            str = str.substring(0,1).toUpperCase() + str.substring(1); 
            //document.write( "<TR><td align=left  width=100 VALIGN=top><table cellspacing=1 cellpadding=3 width=100><tr><td align=left bgcolor="+ IBGCOLOR + " width=100 BACKGROUND=header2.GIF><font color=#DDCC11><b><NOBR>"+ str +"</NOBR></b></font></td></tr></table></TD>\n");
            document.write( "<td align=left VALIGN=top width=" + Math.floor(font_size*20/3) +"><table cellspacing=1 cellpadding=3 width=100% ><tr width=100% ><td  width=100% style=\"background:" + gradientbg.replace(/\(/,'(to right,') + ";border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px\">"
                    +  "<span style=\"text-shadow:-1px -1px #060606;color:#DDCC11\" onMouseOver=\"showmyhint(" 
                    + j  + ")\"   onMouseOut=\"hidemyhint()\" ><nobr><b>" + str 
                    + "</b></nobr></span></td><td align=left></td></tr></table></TD>");
         }
         else   
            document.write( "<td align=left  width=100></td>");
  }
   else if (mat[r][j] != null && mat[r][j].length > 0)
         document.write("<td align=left  width=100></td>");
   else continue;
    
   
   x = ctype[j]; 
   if (x!='L') x = x.toLowerCase();

   document.write("<td align=left ");
   if (fold[j] && maxfinr-maxfinr1>0)
     document.write(" colspan=" + (2*(maxfinr-maxfinr1)+1) + " " );
 
   jj =0;
   switch(x) 
   { 
      case 'i': case 'n':
         sa = fsize[j].split("_"); 
         if (sa.length > 0) 
            rowsize = sa[0]; 
         else 
            rowsize = "10";   
         if (sa.length > 1) 
             colsize = sa[1]; 
         else if (ctype[j]=='i')
             colsize = "30";
         else 
             colsize = "2";
         if (mat[r][j]==null) mat[r][j]='';
         if (ctype[j]=='i')
         {
           document.write("  VALIGN=top   valign=top align=left><iframe frameborder=0 width="+colsize+" height="+rowsize+" name=iframe"+j +"></iframe></TD>");
           openit(mat[r][j],r,'iframe' +j);   
         }
         else
           document.write( ">" +   numberstr(mat[r][j],colsize)  + "</TD>");
         break;
      case 'aa':
         if (mat[r][j]==null) mat[r][j]='';
         hc += mat[r][j].length/50 + 1; 
         if (mat[r][j]==null) mat[r][j]='';
         jj = parseInt(fsize[j]); if (''+jj=='NaN') jj=60;
         if (jj < 10 || jj > 120) jj = 60;
         document.write( ">" + formatstr(mat[r][j], 0) + "</TD>");
         break;    
      case 't':
      case 'p':
      case '': 
       
       if (mat[r][j]==null) mat[r][j]='';
      
      if (fields[j].toLowerCase().indexOf('attach')==0)
      {
           value = att;// viewattachment(mat[r][j],r);
           document.write( ">" +   value + "</TD>");       
      }
      else 
         document.write( ">" +   mat[r][j].replace(/</g, "&lt;").replace(/>/g,"&gt;").replace(/[ ]+/g,"&nbsp;")  + "</TD>");
     
      break; 
      case "b":
         document.write( ">" +   Innergrid.makeinnertable( mat[r][j],r,j,false) + "</TD>" );
      break;
      case 'f':case 'a':
      if (mat[r][j]==null) mat[r][j]='';
      actualformat = '0';
     if (fmtcol < numCols)
         actualformat = ''+mat[r][fmtcol];
     else
         actualformat = ''+guessFormat(mat[r][j]); 
 
     if (actualformat == '2')
     { 
         needtranslator = true;
     }
     document.write( " width=100% style=border-radius:3px>" +   formatmat(mat[r][j],r,j)  + "</TD>");
      /*
      actualformat = guessFormat(mat[r][j]);
       
      if (actualformat =='2' )
      {
         document.write( " >" + hw.merge( mat[r][j].replace(/\n[\r| ]*\n/g,'<br>\n\n').replace(/^[\n|\t|\r| ]+/,'').replace(/[\n|\t|\r| ]+$/,'') + "</TD>"));
         needtranslator = true;
      }
      else if(actualformat =='1')
      {
         document.write( ">" + hw.merge( checkh(mat[r][j],false)) + "</TD>");
      }
      else
      {
         document.write( ">" +  hw.merge( mat[r][j]).replace(/</g,"&lt;").replace(/\r\n/g,"<br>").replace(/\r/g,"<br>").replace(/\n/g,"<br>")  + "</TD>");
      }*/
      break;
      case 'm':
        if (mat[r][j]==null) mat[r][j]='0';
        document.write( ">" +    timestr(mat[r][j])  + "</TD>");
         break;
      case 's': case 'r':
       document.write( ">");
      if (options[j]!=null && captions[j]!=null)
      {
      for (jj=0; jj < options[j].length && mat[r][j] != options[j][jj]; jj++);
      if (  jj < captions[j].length) 
         document.write(  captions[j][jj] +  "</TD>");
      else 
      {
         if (mat[r][j]==null) mat[r][j]='';
         document.write(    mat[r][j] + "</TD>" );
      }
      }
      else
         document.write(  mat[r][j] +  "</TD>");
      break; 
      case 'w':   
      document.write(">" +  multivalue(mat[r][j],options,captions,j,dtype[j]) +  "</TD>");
      break; 
      case 'l': 
      if (mat[r][j]==null) mat[r][j]=''; 
      document.write("><a href=\"javascript:openit1("+r+","+j+")\">" + mat[r][j] +"</a></td>");
      break; 
      case 'L': 
         document.write("><a href=\"javascript:openit2("+r+","+j+")\">" + extractfromm(mat[r][j],true) +"</a></td>");
      break;
      case 'u':   
      if (mat[r][j]==null) mat[r][j]='';
      document.write("  align=left><span class=\"img-shadow\"><img src=\"" + mat[r][j] + "\"  ></span></td>");
      break; 
     
   }
   if (fold[j])
   {
       document.write("</tr>");
   }

} 


document.write( "</table>" + round2);
if (nextpageurl!='')
    document.write("<a href=nextpage()>" + textmsg[795] + "</a>"); 
 
} 
 
if (fmtcol < numCols && numRows>0&& (mat[0][fmtcol]=='LaTeXML'|| mat[0][fmtcol]=='2') ) needtranslator=true;
theight = 205 + numRows*(numCols*30 + hc); 
makesend();
if (onbegin!=null && onbegin!=''){ eval(onbegin); }
function resizeCont()
{
   if (parent == window) return;
   var xx = screen.width - 12 - parent.frames[0].offsetWidth;
   var tbs = document.getElementsByTagName("table");
   for (var i=0; i < tbs.length; i++)
   {
      var yy = tbs[i].offsetWidth;
      if (yy > xx)
         tbs[i].width = xx;
   }
}

var notlink0 = webserviceAlloptions.replace(/<a.*<.a>/g,'');
var alinks = webserviceAlloptions.substring(0,webserviceAlloptions.length - notlink0.length);

//if (typeof(fsnd)=='undefined' || typeof(fsnd.localpathtoupload)=='undefined')
{
   webserviceAllbuts = webserviceAllbuts.replace(/<[^>]*localpathtoupload[^>]*>/,'');
    
}
 
 
while (true)
{
             jj = alinks.indexOf("textmsg[");
             if (jj==-1) break;
             var kk = alinks.indexOf("]",jj);
             alinks = alinks.substring(0,jj)
             + textmsg[parseInt(alinks.substring(jj+8,kk))]
             + alinks.substring(kk+1);
}
document.write(alinks);
if (mm>0)
   document.write(webserviceAllbuts.replace(/<br>/g,''));
document.write( "<div id=anchor name=anchor style=\"width:1px;height:1px;float:right\"><!----></div>");
fitme();
setTimeout( resizeCont , 200 );