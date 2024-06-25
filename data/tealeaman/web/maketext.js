/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
 

 

function filltxt(str, width, k) 
{ 
   var d = ""; 
   if (str == null) str =''; 
   for (var i = 0; i < width-str.length; i++) 
   d += " "; 
   if (k == false) 
   return str + d + " "; 
   
   return d + str + " "; 
} 

function populate(f,n1) 
{ 
   var sz = new Array( numCols ); 
   var j1=0;
   for (;  j1 < numCols; j1++)
   {
      var j = positionr[j1];
      sz[j] = fields[j].length ; 
      for (var i = 0; i < numRows ; i++) 
      if (mat[i][j] != null && sz[j] < mat[i][j].length ) sz[j] = mat[i][j].length; 
      f.txt.value += filltxt(fields[j], sz[j], dtype[j]); 
   } 
   f.txt.value += "\n"; 
   for (var i = 0; i< numRows ; i++) 
   {
      j1=0;
      for (;  j1 < numCols; j1++)
      {
          j = positionr[j1];
          if (ctype[j] != null && (ctype[j] == 'm' || ctype[j] == 'M'))
             mat[i][j] = timestr( mat[i][j]); 
          else if (ctype[j] != null && (ctype[j] == 'n' || ctype[j] == 'N'))
          {
             var pl = 2;
             if (fsize[j] != null)
             {
                var ii = fsize[j].indexOf("_");
                if (ii!=-1) pl = fsize[j].substring(ii+1);
             }  
             mat[i][j] = numberstr(mat[i][j],pl);
          } 
          else if (ctype[j] != null && (ctype[j] == 'c' || ctype[j] == 'C'))
             mat[i][j] = (mat[i][j] != '0')? 'Yes': 'No';
          f.txt.value += filltxt(mat[i][j], sz[j], dtype[j]); 
      }
      f.txt.value += "\n"; 
   } 
   j1=0;
   for (;  j1 < numCols; j1++)
   {
      j = positionr[j1];
      f.txt.value += filltxt(calfoot(j), sz[j], dtype[j]);
   }
   f.txt.value += "\n";  
} 

document.write(unititle(title,'outset2')); 
document.write(unifontstyle(font_size));
document.write("<center><TABLE width=100% border=0 bgcolor="+ "#b0b0b0" +" cellpadding=3 cellspacing=0><TR><TD valign=TOP>"); 
document.write("<TABLE BORDER=0 cellspacing=1 width=100% bgcolor="+ DBGCOLOR + "><tr><td><form rel=opener name=form1  > \n"); 
document.write("<textarea cols=70 rows=25  name=txt>"); 
document.write("</textarea>"); 
document.write("</form>");
if (nextpageurl!='')
    document.write("<input type=button class=GreenButton value=\"" + textmsg[795] + "\"  onclick=\"nextpage()\">"); 
document.write("</center></td></tr></TABLE></td></tr></TABLE>\n"); 

height= 1200; 
populate(document.form1,0);
if (onbegin!=''){ eval(onbegin);}
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