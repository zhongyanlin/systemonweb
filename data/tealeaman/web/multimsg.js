/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
var format = '';
function mu(u,x)
{
   var tt = x.split(/[ |,]+/);
   var w = "";
   for (var i = tt.length-1; i>=0;i--)
   {
       var y = tt[i].replace(/'/g, "''");
       if (w!='') w +='u';
       w+= u.replace(/@3@/g,"'"+y+"'") + ";";
   }
   return w;
}
 
 maxsize[9] = 255;
 
 