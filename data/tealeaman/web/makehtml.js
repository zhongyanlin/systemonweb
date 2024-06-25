/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
datapresentformat = 'DataHTML';
document.write("<style>a{TEXT-DECORATION:none}</style>");
document.write(unititle(title,'outset2')); 
document.write(unifontstyle(font_size));
document.write("<table cellpadding=0 cellspacing=1 border=0  align=center><tr height=3><td></td></tr></table>");
var formalign="center";
if (exbut.indexOf("l")>=0) formalign="left";
if (exbut.indexOf("r")>=0) formalign="right";
document.write(round1('')+ "<table   class=outset3    align=" + formalign +" id=\"maintable\"  cellpadding=3 cellspacing=1 > <tr style=\"background:" + beheading +"\">\n");
var piccount = numCols;
var viewattachmentold = viewattachment;
 
 
var viewattachment1 = function(t,j)
{
    hw.parseAttach(t);
    addcss2head(j, hw.divs);
     
    return hw.attachheader; 
}
var docformat = '0';
function vl(i,j)
{
        var value = mat[i][j];
        if (value == null || value == 'null') 
           value = "";
        if (ctype[j] == null) 
            ctype[j] = "t";
         switch(ctype[j])
        {
            case "n": case "N":
           pl = "2";
           if (fsize[j] != null) 
           {
              var ii = fsize[j].indexOf("_");
              if (ii != -1)
               pl = fsize[j].substring(ii+1);
           }
           value =  numberstr( value, pl);  
          break;
          
          case "m": case "M":
           value =  timestr(parseInt(value));
           break;
           case "b": case "B":
              value = Innergrid.makeinnertable(mat[i][j],i,j,false);
           break;
          case "c": case "C": 
           value = (value=="1")?"yes":"no";
           break;

           case "l":
           value = "<a href=\"javascript:openit2("+i+","+j+")\">" +  mat[i][j] +"</a>"; 
           break;
           case "a": case "A":
                  
           case "t": 
           case "T": 
                
                 if (fields[j].toLowerCase().indexOf('attach')>=0)
                 {
                     value = viewattachment1(value,i);
                 }
                 else if (fields[j].replace(/f[0-9]+/,'')=='')
                 {
                     if (value.replace(/@[0-9]+@/,'')!=value)
                     value = viewattachment1(value,i);
                 }
                 else
                 {    
                    // value = value.replace(/\n/g,'<br>').replace(/</g, '&lt;').replace(/>/g,'&gt;').replace(/[ ]+/g,"&nbsp;");
                    value = formatmat(value, i, j); 
                 }
             break;
             case "f": 
                
                 if (fields[j].toLowerCase().indexOf('attach')>=0)
                 {
                     value = viewattachment1(value,i);
                 }
                 else if (fields[j].replace(/f[0-9]+/,'')=='')
                 {
                     if (value.replace(/@[0-9]+@/,'')!=value)
                     value = viewattachment1(value,i);
                 }
                 else
                 {    
                    // value = value.replace(/\n/g,'<br>').replace(/</g, '&lt;').replace(/>/g,'&gt;').replace(/[ ]+/g,"&nbsp;");
                    value = formatmat(value, docformat); 
                 }
             break;
          case "L":
             value = "<a  href=\"javascript:openit2("+i+","+j+")\">" + extractfromm(mat[i][j],true) + "</a>"; 
             break;
           
            case 'u': 
            hints[piccount] = "<img src=\"" + value + "\">"; 
            value = "<span onMouseOver=\"showmyhint(" + piccount +  ")\"  style=color:blue;cursor:pointer onMouseOut=\"hidemyhint()\">" + value +"</span>";
            piccount++;
            break;
          
            case 's':
            case 'S':
                 if (options[j]!=null && captions[j]!=null)
                 {
                  for (jj=0; jj < options[j].length && value!= options[j][jj]; jj++);
                  if (  jj < captions[j].length) 
                    value = captions[j][jj] ;
                  else  if (value==null) value ='';
                 }
            break; 
            case 'w':   
                 value = multivalue(mat[i][j],options,captions,j,dtype[j]);
                 hc += 4;
             break; 
       
            default:
              break;
         }
         
         return   hw.merge(value);
}

var tdorder = 0;

var ntype = false; 
for (var j1=0;  j1 < numCols; j1++)
{
    var j = positionr[j1];
   // hints[j] = hints[j].replace(/<.p>$/, "<br>") + textmsg[74] +"</p>";
    ntype  = (dtype[j]&&ctype[j].toUpperCase()!='M'&&ctype[j].toUpperCase()!='S')?"right":"left";
    if (labels[j].indexOf("nolabel") !=0 && (ctype[j]!='h' || exbut=='') )
    { 
        document.write("<td align="+ntype+" valign=top    onclick=sort1("+j+",this) onMouseOver=\"showmyhint(" 
                    + j  + "," + (tdorder++) + ")\"   onMouseOut=\"hidemyhint()\" ><nobr><b>" + labels[j].replace(/([a-z])([A-Z])/g, "$1&nbsp;$2") 
                    + "</b></nobr></td>");
    }
    else if (labels[j].indexOf("nolabel") ==0) 
    {
        document.write("<td align="+ntype+" valign=top> &nbsp;</td>"); 
        tdorder++;
    }
    if (ctype[j] == null) ctype[j] = 't';
}


document.write("</tr>");
var pl = '2';
var jj = 0;
var hc = 0;

for (var i = 0;  i < numRows; i++) 
{
    hw =  new  Hwtake('grade', '', '', '', null, '1', i, true);
    docformat = '0';
    
    document.write("<tr bgcolor=" +  TBGCOLOR + ">\n");
    for (j1=0;  j1 < numCols; j1++)
    {
        j = positionr[j1];
        ntype  = (dtype[j]&&ctype[j].toUpperCase()!='M'&&ctype[j].toUpperCase()!='S')?"right":"left";
        
        if (fields[j].toLowerCase().indexOf('format')==0)
        {
            docformat = vl(i,j);
        
        }
        if (ctype[j]!='h' || exbut=='')
            document.write("<td align="+ntype+" valign=top>" +  vl(i,j) +"</td>");
         
    }
    document.write("</tr>\n");
}

if (hasfoot)
{
    document.write("<tr bgcolor=#FFFFC0>\n");
    for (j1=0;  j1 < numCols; j1++)
    {
       j = positionr[j1];
       if ( ctype[j]!='h' && ctype[j]!='k' || exbut=='')
       {
           ntype  = dtype[j]?"right":"left";
           document.write("<td align="+ntype+" valign=top>" + calfoot(j) +"</td>");
       }
    }
    document.write("</tr>\n");
}
theight = 170 +  numRows*40 + hc;
makesend();



document.write("</table>" + round2 + "</td></tr></table>");
if (nextpageurl!='')
    document.write("<br><a href=\"javascript:nextpage()\">" + textmsg[795] + "</a>");
document.write( "<div id=anchor name=anchor style=\"width:1px;height:1px;float:right\"><!----></div>");
function resizeCont(){ }
 
if (onbegin!=null && onbegin!=''){ eval(onbegin); }
function sort1(j,dv)
{
           cc = j; sw[j] = 1 - sw[j];
           for (var i = 0; i <  numRows ; i++) 
              pointer[i] = i;
           qsort(); 
           swap1(deleted);
           swap1(valuechanged);
           swap2(mat); 
           var tbl = dv.parentNode.parentNode; 
           if (tbl.tagName.toLowerCase()!='table') 
               tbl=tbl.parentNode;
           for (var i = 0;  i < numRows; i++) 
           {
               var rw = tbl.rows[i+1];
               var k = 0;
               for ( var j=0;  j < numCols; j++) 
               {
                    if (ctype[j]!='h' || exbut=='')
                    {
                        if (rw.cells[k]!=null)
                        try{ rw.cells[k].innerHTML = vl(i,j);}catch(e)
                        {console.log("k=" + k + ", i=" + i + ", j=" + j);}
                        k++;
                    }
               }
           }
}

var  div1 =  document.getElementById('titlediv');
if(div1!=null)
{  
    div1.onmouseover=function(){showmyhintstr(ZQ[0]);}
    div1.onmouseout=hidemyhint;
}




