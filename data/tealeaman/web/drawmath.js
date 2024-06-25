 /*
 *drawmath.js 
 *Zhongyan Lin
 *Oct 2012
 *Systems on Web, Inc.
 *All rights reserved
 */
 function Poly(s)
 {
     this.sides = [];
     var i = s.indexOf(":");
     if (s.substring(0,i) == 'Poly')
     {
        s = s.substring(i);
        var lines = s.split(/;/);
        for (i=0; i < lines.length; i++)
        {
         constructline(s[i]);
         this.sides[i] = allLines[i];
        }
     }
     this.toString = function()
     {
         s = "Poly:";
         for (i=0; i < this.sides.length; i++)
        {

        }

     }
 }


