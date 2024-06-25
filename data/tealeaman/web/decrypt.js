/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
var fields = H.split(",");
var mss = MS.split(",");
var sessiondebug = (mss[0]=='1');
var hasupdate = (mss[1]=='1');  
var hasdelete = (mss[2]=='1');
var hasnew  = (mss[3]=='1');
var viewonly = (!hasupdate && !hasdelete && !hasnew);
var extra   = parseInt(mss[4]);
var numRows = parseInt(mss[5]);
var NUMROWS = parseInt(mss[6]);
var numCols = parseInt(mss[7]);
var x = '';
var foot =    new Array(numCols);
var nullable= new Array(numCols);
var fsize   = new Array(numCols);
var ffsize =  new Array(numCols);  
var ctype   = new Array(numCols);
var positions = new Array(numCols);
var positionr = new Array(numCols);
var maxsize = new Array(numCols);
var dtype   = new Array(numCols);
var rdapname = ZQ[0];
var cachedstr = localStorage["custom"+rdapname];

var hasroworder = false;   
if (cachedstr !=null && cachedstr !='')
{
  var ind = cachedstr.indexOf(";");
  if (ind > 0 )
  {
     hasroworder = (cachedstr.substring(0,ind) == '1');
     cachedstr = cachedstr.substring(ind+1);
  }
  ind = cachedstr.indexOf(";");
  if (ind > 0 )
  {
     var NUMOFROWS = parseInt(cachedstr.substring(0,ind));
     if ('' + NUMOFROWS != 'NaN')
       NUMROWS += NUMOFROWS;
     cachedstr = cachedstr.substring(ind+1);
  }
}

//var mat     = new Array(NUMROWS);
var deleted = new Array(NUMROWS);
var pubkey  = pubkeys.split(",");

var positions1 = positionstr.split(/[,| ]+/);
for (var j = 0; j < numCols; j++)
{
    if (positionstr=='' || j >= positions1.length || isNaN(positions1[j]) || positions1[j]>=numCols)
       positions[j] = j;
    else if (!isNaN(positions1[j]))
       positions[j] = parseInt(positions1[j]);
    else
       positions[j] = j; 
}
var needtranslator1 = false; 
for (  j = 0; j < numCols; j++)
{
   positionr[positions[j]] = j;
   var y = pubkey[j];
   nullable[j] = (y.charAt(0)=='1');
   dtype[j]    = (y.charAt(1)=='1');
   y = y.replace(/([a-z])([0-9])/i,'$1_$2'); 
   maxsize[j] = parseInt( y.substring(2).replace(/[a-z].*/i,'')); 
    
   var z = fields[j] + '_' + y.replace(/[0-9]+/, '');
   
   var tt = z.split("_");
   if (tt.length > 1) 
   {
       foot[j] = tt[tt.length-1];
   }
   else foot[j] = null;
            
   if (ctype[j]==null)
   { 
   if (tt.length > 1) 
   {
       ctype[j] = tt[1]; 
      
   }
   else
       ctype[j] = 'T';
   }
   if (ctype[j]=='n'||ctype[j]=='N'||ctype[j]=='M'||ctype[j]=='m')
       dtype[j] = true;
   else if (ctype[j]=='a') 
       dtype[j] = false; 
   if (fsize[j]==null || fsize[j]=='')
   {
    
      if (pubkey[j].indexOf("L") >=0)
      {
          
          if (tt.length > 2) 
          {
              fsize[j] = tt[2];
          }
          else fsize[j] = ffsize[j] = null;
          if (tt.length>3)
              ffsize[j] = tt[3];
          else
               ffsize[j] = null;
      }
      else  if (tt.length > 2) 
      {
        fsize[j] = "" +  parseInt(tt[2]);
        if (fsize[j] == 'NaN') 
            fsize[j] = "10"; 
      }
      else  
        fsize[j] =  "";
             
      if (tt.length > 3) 
      {
        var xx = ctype[j].toLowerCase();
        if (xx=="a"  ||xx=="b"  || xx=="i" || xx=="n")
        {
            
            if ( '' +  parseInt(tt[3]) != 'NaN')
               fsize[j] += "_" +  tt[3];
            else if (ctype[j]=='n')
               fsize[j] += "_0";
            else
               fsize[j] += "_10";
        }
      }
   } 
   
   if (ctype[j]=='a' && maxsize[j]<20000) maxsize[j]=20000;
   if (ctype[j]=='A' || ctype[j] == 'f' || ctype[j] =='a') needtranslator1 = true;
}
if (needtranslator1==false)needtranslator=false;
    
for (  j = 0; j < numCols; j++)
   if (positionr[j]==null)
       positionr[j] = j;
 
if (cachedstr!=null && cachedstr!='')
{ 
  var tmparr = cachedstr.split(";");
  for (var i=0; i < tmparr.length  && i < numCols; i++)
  {
      if (tmparr[i].charAt(0)=='1') 
      {   
         ctype[i] = 'h'; 
      } 
      else if (ctype[i]=='h') ctype[i]='T';
      var zz = '';
      if (tmparr[i].length>1) 
          zz = tmparr[i].substring(1); 
      var xx = ctype[i].toLowerCase(); 
      if ( zz.replace(/[0-9|_]/g,'')==''  && (  xx=='t'|| xx=='a'|| xx=='b' ||xx=='i'|| xx=='u' || xx=='n'))
          fsize[i]=zz;
  }
}

var query='';
rdapname = ZQ[0];   
var title = ZQ[1];
serCharSize(ZQ[10]);
 
var updateQuery = decryptString0(ZQ[2]);   
var insertQuery = decryptString0(ZQ[3]);  
var deleteQuery = decryptString0(ZQ[4]);
 
var helpstr     = ZQ[5];   
var subdb = ZQ[6];    
var rsaenccode = ZQ[7];
if (rsaenccode=='2'||rsaenccode=='3')
    setServerkeys(ZQ[8]);
 
if ((rsaenccode=='1'||rsaenccode=='3') && getrsakeyN4()!=ZQ[9])
{
   myprompt(textmsg[780]);
   rsaprivate = null;
} 
for (var i = numRows; i < NUMROWS; i++)
{ 
   deleted[i]= 0; 
   mat[i]= new Array(numCols);  
}
for (i = 0; i< numRows; i++)
{ 
   deleted[i]= 0; 
} 
if (rsaenccode=='1' || rsaenccode=='3')
{
for (i = 0; i< numRows; i++)
{ 
   for (j = 0; j < numCols; j++)
   {
       mat[i][j] = decryptString(mat[i][j]);
   }
}
}

if (typeof STNEVE !='undefined')
{
   for (j=0; j < STNEVE.length-1; j++)
   {
      if (STNEVE[j]!='')
      {  
         let n = parseInt(STNEVE[j]);
         if (''+n == 'NaN' )
            STNEVE[j] = decryptString0(STNEVE[j]);
         else if (n < eventcodes.length)
            STNEVE[j] = eventcodes[n];
         else
            STNEVE[j] = '';
      }
   }
}
var cellonblur="";
var cellonfocus="";
var onsave="";
var onsaved="";
onbegin="";
onclose="";
var exbut=""; 

  
 