/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
function filltxt(str, width, k) 
{ 
   var d = ""; 
   for (var i = 0; i < width-str.length; i++) 
   d += " "; 
   if (k == 0) 
   return str + d + " "; 
   else 
   return d + str + " "; 
} 

function populate(f,n1) 
{ 
   f.source.value = "\\documentclass[12pt,epsf,cite,twoside]{article}\n"; 
   f.source.value += "\\begin{document}\n"; 
   f.source.value += "\\begin{center}\n"; 
   f.source.value += ""+title+" \n \n"; 
   f.source.value += "\\begin{tabular}[h]{|"; 
   for (var j = 0; j< numCols ; j++) 
   f.source.value += (dtype[j])?"r|":"l|"; 
   f.source.value += "}  \\hline\n"; 
   for (var j1=0;  j1 < numCols; j1++)
   {
      j = positionr[j1];
      if (labels[j].indexOf("nolabel")!=0)
         f.source.value += labels[j] ; 
      if (j < numCols -1) f.source.value += " & "; 
      else f.source.value += "\\\\     \\hline\n"; 
   } 
   
   for (var i = 0; i< numRows ; i++) 
   {
      for ( j1=0;  j1 < numCols; j1++)
      {
         j = positionr[j1];
         if ( ctype[j] != null && (ctype[j] == 'n' || ctype[j] == 'N'))
         {
            var pl = "2";
            if (fsize[j] != null)
            { var ii = fsize[j].indexOf("_");
              if (ii != -1)
                pl = fsize[j].substring(ii+1);
            }
            mat[i][j] = numberstr(mat[i][j],pl);
         }
         else if (ctype[j] != null && (ctype[j] == 'm'|| ctype[j] == 'M'))
            mat[i][j] = timestr(parseInt(mat[i][j]));
         else if (ctype[j] != null && (ctype[j] == 'c' || ctype[j] == 'C'))
         {
            if (mat[i][j] == "1")
               mat[i][j] = "v";
            else
               mat[i][j] = "$\\times$";
         }
         f.source.value += mat[i][j] ; 
         if (j < numCols -1) f.source.value += " & "; 
         else f.source.value += "\\\\     \\hline\n"; 
      } 
      if (i>0 && i%30 == 0) 
      { 
         f.source.value += "\\end{tabular}\n\n"; 
         f.source.value += "\\begin{tabular}[h]{|"; 
         for (j1=0;  j1 < numCols; j1++)
         {
            j = positionr[j1];
            f.source.value += (dtype[j]==1)?"r|":"l|";
         }
         f.source.value += "}\n \\hline\n";
      } 
   }
   if (hasfoot)
   for (j1=0;  j1 < numCols; j1++)
   {
       j = positionr[j1];
       f.source.value += calfoot(j) ;
       if (j < numCols -1) f.source.value += " & "; 
       else f.source.value += "\\\\     \\hline\n"; 
   }  
   f.source.value += "\\end{tabular}\n"; 
   f.source.value += "\\end{center}\n"; 
   f.source.value += "\\end{document}"; 
} 
document.write(unititle(title,'outset2')); 
document.write(unifontstyle(font_size));
document.write("<center><TABLE BORDER = 0 align=center valign=center width=92%>"); 
document.write("<tr><td  ALIGN=center> <form name=form1 method=post "); 
document.write("action=ServerAgent  >"); 
document.write("<textarea cols=70 rows=25  name=source>"); 
document.write("</textarea>"); 
document.write("<input type=hidden name=ext>"); 
document.write("<input type=hidden name=feed value=x>"); 
document.write("<input type=hidden name=command> <br>"); 
document.write("<input type=submit class=GreenButton " + butstyle(font_size) + " name=submit value=Postscript onclick=setvalue('latex','dvi') target=msg>"); 
document.write("<input type=submit class=GreenButton " + butstyle(font_size) + " name=submit value=PDF onclick=setvalue('pdflatex','pdf') target=msg>"); 
if (nextpageurl!='')
    document.write("<input type=button class=GreenButton value=\"" + textmsg[795] + "\"  onclick=\"nextpage()\">"); 
 
document.write("</form></td></tr></TABLE></center> </td></tr></TABLE>"); 
 
theight = 1500; 

function setvalue(aa,bb)
{
   document.form1.command.value=aa;document.form1.ext.value ='tex,'+ bb;
}  
populate(document.form1,0); 
function resizeCont()
{ 
      var wd = thispagewidth();
      var het = thispageheight();
      wd -= 40;
       
      het -= 110 +  font_size ;
      het = Math.floor(het);
      
      document.form1.source.style.width = "" + wd + "px";
      document.form1.source.style.height= "" + het+ "px"; 
}
var exitinglatex = window.onresize;
if (exitinglatex!=null)
onresize = function ()
{
    exitinglatex();
    resizeCont(); 
}
else onresize = resizeCont;
    
