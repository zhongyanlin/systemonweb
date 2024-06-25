/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/

var popwin, popstr, areastr, areaname;
var fields =  new Array( numCols );
var fsize =  new Array( numCols );
var ffsize =  new Array( numCols );
var positions = new Array(numCols);
var positionr = new Array(numCols);
var ctype =   new Array( numCols );
var options = new Array( numCols );
var captions =new Array( numCols );
var foot =    new Array( numCols );
var maxsize =    new Array( numCols ); 
for (var kk = 0;   kk < numCols; kk++)
{
   foot[kk] = '';
   maxsize[kk] = 0;
   positionr[kk] = positions[kk] = kk;
}
var labels = fields;
var x = '';
var rdapname = '';
 
var dtype =   new Array( numCols ); 
var defaultRecord = new Array(numCols);
fields[0] = "Order";
dtype[0]=true;
ctype[0]="t";
defaultRecord[0] = ''+(numRows+1);
 
fields[1] = "FieldName";
dtype[1]=false;
ctype[1]="t";
defaultRecord[1] = '';
 
fields[2] = "DataType";
dtype[2]=false;
ctype[2]="s";
defaultRecord[2] = 'INTEGER';
 
options[2] = parent.frames[0].passdbdatatypes().split(",");
captions[2] = options[2];

fields[3] = "Length";
dtype[3]=true;
    ctype[3]="n";
defaultRecord[3] = null;
ffsize[3]=0;
 
fields[4] = "Nullable";
dtype[4]=true;
ctype[4]="c";
defaultRecord[4]='1';

fields[5] = "Distinct";
dtype[5]=true;
ctype[5]="c";
defaultRecord[5]='0';
 
fields[6] = "Default";
dtype[6]=false;
ctype[6]="t";
defaultRecord[6]='';
 
fields[7] = "Key";
dtype[7]=true;
ctype[7]="c";
defaultRecord[7]= '0';

fields[8] = "Reference";
dtype[8]=false;
ctype[8]="s"; 
defaultRecord[8]  = '';

var numNotself = 0;
var tempstr;
var tempname = new Array(numtables);
for (var i = 0; i < numtables; i++)
{
   tempstr = tables[i].replace(/^\s*/,'').replace(/\s*$/,'');
     if (tempstr != tablename) 
      tempname[numNotself++] = tempstr;
    
}
for (var p = 1; p <  numNotself ; p++) 
    for (var j = 0; j <  numNotself  - p; j++) 
              if ( tempname[j] > tempname[j+1]) 
              {
                 tempstr = tempname[j];
                 tempname[j] = tempname[j+1];
                 tempname[j+1] = tempstr;
              }

options[8] = new Array(numNotself);
captions[8] = new Array(options[8].length);
for (var i = 0; i < options[8].length; i++)
   captions[8][i] = options[8][i] = tempname[i];  

fields[9] = "FKey";
dtype[9]=false;
ctype[9]="s";
defaultRecord[9] = '';

fields[10] = "Control";
dtype[10]= false;
ctype[10]='t';
defaultRecord[10] = '';

var nn = 0;
theight = 800;
var updateQuery = '';
var deleteQuery = '';
var insertQuery = '';
var helpstr = textmsg[244] +"<!---->"; 
var whichaction = '';
var mm = 0;
 
 
 