/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/

var iid = ''; 
var numtables = parent.frames[0].passNumtables();
var  tables = new Array(numtables);
parent.frames[0].passTables(tables);
var  numfields = new Array(numtables); 
parent.frames[0].passNumfields( numfields);
var  tfields = new Array(numtables);
for (var i = 0; i < numtables; i++) 
   tfields[i] = new Array(numfields[i]);
parent.frames[0].passTFields(tfields);
var owner = parent.frames[0].qpassOwner(queryname);
var qdefinition = parent.frames[0].qpassdef(queryname);
 
var title = "Create Table";
var uline = ''; 
var numCols = 11;
 
var outstr = new Array(2);
var mat = new Array(50);

var numRows  = qparse(qdefinition, numCols,mat, outstr);  
var NUMROWS = numRows + 5; 
if (NUMROWS < 16) NUMROWS = 16;
for (i = numRows; i< NUMROWS; i++)
   mat[i] = new Array( numCols); 

 
var deleted = new Array( NUMROWS );
var query = '';
for (i = 0; i< NUMROWS; i++)
{
    deleted[i]= 0; 
    
}
tablename= outstr[0];
 
var tablesused = outstr[0].split(",");
var whereclause = outstr[1];
for (i = 0; i < tablesused.length; i++)
{
   var il = parent.frames[0].passNumfield( tablesused[i]);
   var mt  =    new Array( il );
   for (var j = 0; j < il; j++)
       mt[j]= new Array(numCols);
   var str = parent.frames[0].passdef(tablesused[i]);
   var k = parse(str, mt,tablesused[i]+".");
   for (var l = 0; l < numRows; l++)
   {
      for (j = 0; j < k; j++)
      {
        if (mat[l][1] == mt[j][1] || mt[j][1]==tablesused[i]+"." + mat[l][1] )
        {
           for (var c = 1;  c < numCols-1; c++)
             mat[l][c] = mt[j][c];
        }
        else
        {
            var ll = mt[j][1].indexOf(".");
            var tmp = mt[j][1].substring(ll+1);
            ll = mat[l][1].indexOf(tmp);
            if (ll==0) 
            {   
               mat[l][1] = tablesused[i] +"." + mat[l][1]; 
 
               for (c = 2; c < numCols-1; c++)
                  mat[l][c] = mt[j][c];
            }
            else if (ll>0 && (mat[l][1].charAt(ll-1) =='&' || mat[l][1].charAt(ll-1) =='\'' || mat[l][1].charAt(ll-1) ==' '))
           {
        
              mat[l][1] = mat[l][1].substring(0,ll) + tablesused[i] +"." + mat[l][1].substring(ll);
           }
        }
     }
     if (mat[l][1].indexOf("&")>0)
     {
           if (mat[l][2]==null||mat[l][2]==''){ mat[l][2] = 'VARCHAR'; mat[l][3]='25';}
     }
   }
}

var cellonblur="";
var cellonfocus="";
var onsave="";
var onsaved="";
var onbegin="";
var onclose="";
var exbut="";


