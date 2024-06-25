/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
for (var i = 0; i< numRows ; i++) 
for (var j = 0; j< numCols ; j++)
   if (ctype[j] == 'c')
   {
      mat[i][j] = (mat[i][j]==1)?"yes":"no"; 
      ctype[j] = 't';
      dtype[j] = false;
   }
   else if (ctype == 'm')
   {
      mat[i][j] = timestr(parseInt(mat[i][j]));
      ctype[j] = 't';
      dtype[j] = false;
   } 
   
function translate(x){};
function butheight()
{
   if (font_size>=15)
      return  Math.floor(1.5*font_size);
   else if (font_size>=12)
      return  22;
   else return 20;
}
function butwidth(str)
{
   var leng = 0;
   var upper = 65;
   if (typeof(font_size) == 'undefined')
       leng = str.length*4;
   else
   {
       leng = str.length*font_size/2+2;
       upper = 4*font_size;
   }

   if (leng <  upper)
       leng =  upper;
   return Math.floor(leng);
}
        