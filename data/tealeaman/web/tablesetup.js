/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
var iid = ''; 

var numtables = 0;  if (hasleft) numtables = parent.frames[0].passNumtables();
var  tables = new Array(numtables);
if (hasleft)parent.frames[0].passTables(tables);
var  numfields = new Array(numtables); 
if (hasleft)parent.frames[0].passNumfields( numfields);
var  tfields = new Array(numtables);
for (var i = 0; i < numtables; i++) 
   tfields[i] = new Array(numfields[i]);
if (hasleft)parent.frames[0].passTFields(tfields);
var owner = null;
var definition = '';
var title = "Create Table";
var uline = ''; 
var numCols = 11;
var NUMROWS ;
var mat ;
var deleted  ;
var query = '';
var checks = '';
var numRows  ; 
var cellonblur="";
var cellonfocus="";
var onsave="";
var onsaved="";
var onbegin="";
var onclose="";
var exbut="";
if (  tablename!='')
{ 
 if (hasleft)owner = parent.frames[0].passOwner(tablename);
 if (hasleft)definition = parent.frames[0].passdef(tablename);
 if (hasleft)NUMROWS = parent.frames[0].passNumfield( tablename)+5; else NUMROWS = 5;
if (NUMROWS < 16) NUMROWS = 16;
 
 mat  =    new Array( NUMROWS );
 
 deleted = new Array( NUMROWS );
 query = '';
for (i = 0; i< NUMROWS; i++)
{
    deleted[i]= 0; 
    mat[i]= new Array(numCols);
   
}
 checks = '';
 
 if (definition!='')
     numRows  = parse(definition, mat, ""); 
 if (numRows == 0) myprompt(definition);
}
 
