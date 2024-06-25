/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
onbegin="for(r=0;r<numRows;r++)if(mat[r][9]=='0')setv(r,8,'1');else valuechanged[r]=true;";
var semester = document.location.toString();
 
var semsterposstart = semester.indexOf("semester=");
 
var semsterposend = semester.indexOf("&",semsterposstart);
 
if (semsterposend == -1)
   semester = semester.substring(semsterposstart+9);
else
   semester = semester.substring(semsterposstart+9,semsterposend);
 
if (rdapname=='statuschange') 
{
    onbegin += "postopen('DataTable',['subdb','rdap','semester'],['','statuschangea', semester],'tlmrstatus');";
}
 
cellonblur =  "if(cc==8){if(v=='1')setv(rr,9,'0');else if(v=='0') openit3(rr,10);else valuechanged[rr]=false;}" ;
 
onsaved =  "window.open('follows.jsp?x=mycourse',popwin);" ;

 