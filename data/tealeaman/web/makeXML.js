/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/


function populate(f,n1) 
{ 
   
   f.txt.value += "<?xml version=\"1.0\"?>\n<rootelement>\n"; 
   
   for (var i = 0; i< numRows ; i++) 
   { 
      f.txt.value += "  <recordrow>\n"; 
      for (var j = 0; j< numCols ; j++)
      {
          if (ctype[j] != null && (ctype[j] == 'm' || ctype[j] == 'M') )
             mat[i][j] = timestr2( mat[i][j]);
          else if (ctype[j] != null && ( ctype[j] == 'n' || ctype[j] == 'N'))
          {
             var pl = 2;
             if (fsize[j] != null)
             {
                var ii = fsize[j].indexOf("_");
                if (ii!=-1) pl = fsize[j].substring(ii+1);
             }  
             mat[i][j] = numberstr(mat[i][j],pl);
          } 
          else if (ctype[j] != null && ( ctype[j] == 'c'|| ctype[j] == 'C'))
             mat[i][j] = (mat[i][j] != '0')? 'Yes': 'No';
         
         f.txt.value += "      <"+ labels[j] + ">"+ mat[i][j]+ "</"+labels[j]+ ">\n"; 
      }
       
      f.txt.value += "  </recordrow>\n"; 
   } 
  
   f.txt.value += "</rootelement>\n"; 
     
} 
/*
f.txt.value += "  <recordrow>\n"; 
for (var j = 0; j< numCols ; j++)
{
   f.txt.value += "      <"+ fields[j] + ">"+ calfoot(j)+ "</"+fields[j]+ ">\n"; 
}
f.txt.value += "  </recordrow>\n";
*/
document.write(unititle(title,'outset2')); 
document.write(unifontstyle(font_size));
document.write("<center>  <form rel=opener name=\"form1\"  ><TABLE BORDER=0 width=92%>\n"); 
document.write(" <tr><td VALIGN=center>   \n"); 
document.write("<textarea cols=70 rows=25  name=txt>"); 
document.write("</textarea></center><center><input type=button  style=height:");
document.write( butheight() + "px;width:" );
document.write( butwidth(textmsg[543]) + "px class=GreenButton value=\""
              + textmsg[543] + "\" onclick=show()>"); 
if (nextpageurl!='')document.write("<input type=button  style=" 
              + "width:"
              + butwidth(textmsg[795]) +"px class=GreenButton value=\"" 
              + textmsg[795] + "\"  onclick=nextpage()>"); 
document.write("</td></tr></TABLE></form></center></td></tr></TABLE></body>\n"); 
theight = 1200; 
 
function show() 
{ 
   var nav = window.open('','xml','toolbar=0,menubar=0,width=800,height=600'); 
   nav.document.write(document.form1.txt.value); 
} 

populate(document.form1,0); 
focus();

function resizeCont()
{ 
      var wd = thispagewidth();
      var het = thispageheight();
      wd -= 40;
      het -= 110 +    font_size ;
      het = Math.floor(het);
      
      document.form1.txt.style.width= ""  + wd+  "px";
      document.form1.txt.style.height="" + het+ "px"; 
     
} 

window.onresize = resizeCont;