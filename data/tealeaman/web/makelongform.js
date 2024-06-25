/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
datapresentformat = 'DataLongForm'; 
 
if (title != null && title.length>0)
   document.write(unititle(title,'outset2')); 
document.write(unifontstyle(font_size)); 
document.write( " <form rel=opener name=form1 style=\"margin:3px 0px 0px 0px\"  >");
if (viewonly==false && NUMROWS >0) document.write( "<center><input type=checkbox  style=\"background-color:transparent;border-width:0px;margin:0px\"  name=check1 value=all onclick=checkall()></center>");
document.write(  "<table  id=maintbl cellpadding=0 cellspacing=1 border=0 width=100% align=center>");
function updateiframe(n,j)
{
     
     if (mat[n][j] != '' && mat[n][j] != null)
         setv(n, j, mat[n][j]);
     else 
         setv(n, j, defaultValue(n,j));
}
function showup(j)
{
    return ctype[j].toLowerCase() != "h"
        && ctype[j].toLowerCase() != 'k';
}
ele = function(r, c)
{
    if (f1==null) return null;
    var ll = lookup[c];
    if (datapresentformat == 'DataTable' && r == NUMROWS)
        ll = c;

    if (datapresentformat != 'DataSearch' && datapresentformat != 'DataForm')
    {
       if (!viewonly)
           ll += 2 + r*(running +1);
       else
           ll += r*(running);
    }

    if (ctype[c] != 'r' && ctype[c] != 'R' || r==NUMROWS)
        return f1.elements[ll];
    var y = 0;
    while ( y < options[c].length && f1.elements[ll+y].checked == false)
        y++;

    if (y == options[c].length) y=0;
    return f1.elements[ll+y];
}

for (var j =0; j < numCols; j++) 
{
    
   hints[j] +=  "<br>"  + textmsg[74]  ;
   if (ctype[j] == null || ctype[j] == "")
      ctype[j] = "T";
   
    
   x = ctype[j].toLowerCase(); 
    if (ctype[j]=='L')
   {
       
   }
   else 
   if (x=='a' || x=='i' || x=='n' || x=='u')
   {
        
         if (fsize[j] == null)
         {
             
             if (x == 'n')
             {
                 fsize[j] = "10";  
                 ffsize[j]  = "0";
             }
             else if (x=='u')
             {
                fsize[j] = "";
                ffsize[j] = "";
             }
             else
             {
                 fsize[j] = "30";   
                 ffsize[j]  = "5";
             }
         }
         else
         {
             var sa = fsize[j].indexOf("_"); 
          
             if (sa > 0)
             {
                ffsize[j] = fsize[j].substring(sa+1);
                fsize[j]  = fsize[j].substring(0, sa);
                if (''+parseInt(ffsize[j])=='NaN')
                {  
                   if (x == 'n')
                     ffsize[j] = "0";
                   else if (x=='u')
                     ffsize[j] = "";
                   else
                     ffsize[j] = "30";
                }
             }
             else
             { 
                if (x == 'n')
                   ffsize[j] = "0";
                else if (x=='u')
                   ffsize[j] = "";
                else
                   ffsize[j] = "5";
             }
         }
    }
    else if (x == 'm' && (fsize[j]==null || fsize[j]==""))
       fsize[j] = timeformat.length;
    else if (x == 'l' && (fsize[j]==null || fsize[j]==""))
       fsize[j] = '3';
    
   if ((ctype[j]=='t' || ctype[j]=='u' || ctype[j]=='p' ) &&  maxsize[j]  < parseInt(fsize[j]) )
       maxsize[j]=parseInt(fsize[j]); 
    
} 

attachmore = function(r,c)
{
    counter = r;
    ResizeUploaded.attachref = ele(r,c);
    rr = r;
    cc = c;
    for (var j=0; j < fsnd.elements.length; j++)
        if (fsnd.elements[j].type.toLowerCase() == 'file')
    {
        
        fsnd.elements[j].click();
        break;
    }
}
 
 
var  classrl, Z, maxsize, readonly, cellvalue; 

for (Z = 0; Z < NUMROWS; Z++) 
{ 
   var af = ( "<tr><td align=left >" + round1("").replace(/<table /ig, '<table align=left ').replace(/<td /ig, '<td align=left ') +  "<TABLE width=100% border=0 align=left class=outset3 cellpadding=3 cellspacing=1>");
   if (viewonly==false)
       af +="<TR><TD colspan=" + (2*maxfinr+2) +" align=center valign=top><INPUT type=checkbox  style=\"background-color:transparent\" name=checkbox value="+ Z + "></TD></TR>";
   var bufferedhidden = "";
   var att = makehw(Z);
var futurej,  j1=0;
for (; j1 < numCols; j1++)
{
    j = positionr[j1];
    if (ctype[j].toLowerCase()=='h' || ctype[j].toLowerCase()=='k')
    {
          bufferedhidden += ("<input  type=hidden value=\"" + mat[Z][j] +"\"  NAME="+Z + "_" + j +">");
    }
    else break;
}

   for (;  j1 < numCols; j1++)
   {
      j = positionr[j1];
      if (ctype[j] == ctype[j].toUpperCase() && Z < numRows)
         readonly = "background-color:transparent;color:" + IBGCOLOR+";border:0px;";
      else
         readonly = "color:black;";
      cellvalue = "";
      
      if (showup(j) == false)
         continue;

      var align = (dtype[j] && ctype[j]!='M' && ctype[j]!='m')?"right":"left"; 
      var str1 = labels[j].replace(/([a-z])([A-Z])/, "$1&nbsp;$2").replace(/([a-z])([A-Z])/, "$1<br>$2").replace(/([a-z])([A-Z])/, "$1&nbsp;$2");

      if (bufferedhidden!='' || fold[positionr[j1-1]])
      {
         af +="<TR>";
         maxfinr1 = 0;
      }
      else
      {
         maxfinr1++;
      }
      

      if (str1.indexOf("nolabel") != 0)
      {
         af += "<TD VALIGN=top  width=" + Math.floor(font_size*20/3) 
                    + "><table cellspacing=1 cellpadding=3 width=100% ><tr width=100% ><td  width=100% style=\"background:" + gradientbg.replace(/\(/,'(to right,')  ;
         af += ";color:#DDCC11;overflow:hidden;text-shadow:-1px -1px #0606060;\" onclick=\"sort("+j+");" + (ctype[j]=='i'?"updateiframe("+Z+"," + j + ")":"") + "\" onMouseOver=\"showmyhint("
                    + j  + ",1)\"   onMouseOut=\"hidemyhint()\" ><b><nobr>" + str1
                    + "</nobr></b> ";
         af += "</td></tr></table></TD>"; 
      }
      else
          af+= "<TD><div onclick=sort("+j+")>&nbsp;</div> </TD>";
      af += "<td ";
      if  (fmtcol < numCols && mat[Z][fmtcol]=='2')
      {
           needtranslator=true;
          
      }
      if (fold[j] && maxfinr-maxfinr1>0)
          af += " colspan=" + (2*(maxfinr-maxfinr1)+1)  ;
      af += ">";
      if (bufferedhidden!='')
      {
         af += bufferedhidden;
         bufferedhidden = "";
      }

      switch(ctype[j])
      {
        case "a": case "A":  
            af +="<textarea   onkeydown=\"if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}\"  style=\"" + readonly +"border:1px #b0b0b0 solid\"  solid rows="+ffsize[j]+" cols="+  fsize[j] +" NAME="+Z+"_"+j;
            af += " onfocus=large(this,"+Z+","+j+") onblur=U("+Z+","+j+") onchange=UT("+Z+","+j+")  onkeypress=\"return allowenter("+ Z + ","+ j + ",event)\"></textarea>";
            break;
        case "i": case "I":
         
            af +="<iframe  frameborder=0 width=" + fsize[j]+ " height="+ ffsize[j] +" NAME=iframe"+Z+"_"+j +" src=\"\"></iframe>"; 
            af += "<input type=hidden name=" + Z +"_"+j+">"; 
            break;
        case "m": case "M":  case "t": case "n": case "T": case "N":
            if ( (ctype[j] == 'm' || ctype[j] == 'M') && mat[Z][j]!=nullvalue[j])
            {
               maxsize[j] = timeformat.length + 2;
               cellvalue = timestr2(mat[Z][j]);
               fsize[j] = timeformat.length;
            }
            else if ( (ctype[j] == 'n' || ctype[j] == 'N') && mat[Z][j]!=nullvalue[j])
            {
               cellvalue = numberstr(mat[Z][j], ffsize[j]);
               maxsize[j] = 2*parseInt(fsize[j]);
            }
            else if (  ctype[j] == 't' || ctype[j] == 'T')
            {
               maxsize[j] = 2*parseInt(fsize[j]);
               cellvalue = mat[Z][j];
               
            }
            
            if (fields[j].toLowerCase().indexOf('attach')==0)
            {
                //cellvalue = att;
                if (ctype[j] == 'T')
                {
                    
                    af += "<input type=hidden  name=\""+Z+"_"+j + "\"   value=\"" + cellvalue +"\" ><span id=theattach" + Z + "_" + j + ">" + viewattachment(cellvalue) +  "</span>";
                }
                else if (ctype[j] == 't')
                {
                    //document.write( "<input  type=hidden name="+fields[j]  +" onchange=UT(counter,"+j+")  ><span id=theattach"+ j + " style=color:blue onclick=\"ResizeUploaded.attachman(ele(0," + j +"))\"></span> <span style=color:blue onclick=\"attachmore("  + j + ")\" >[+]</span>");
     
                    af += "<input style=width:1px;visibility:hidden   name=\""+Z+"_"+j + "\"  onchange=UT(" + Z +","+j+")   value=\"" + cellvalue +"\" ><span id=theattach" + Z + "_" + j + " style=color:blue;cursor:pointer onclick=\"modifyattach("+ Z + ',' + j + ")\""+ 
                            "></span><span style=color:blue;cursor:pointer  onclick=\"attachmore("+ Z + ',' + j + ")\" >[+]</span>";
                }    
            }
            else
            {
                af +="<INPUT style=\"" + readonly +"border:1px #b0b0b0 solid\" size="+ fsize[j] + " maxsize=" + maxsize[j] +" NAME="+Z+"_"+j;
                af += " value=\"" + cellvalue +"\" onfocus=S("+Z+","+j+")  onblur=U("+Z+","+j+") onchange=UT("+Z+","+j+")  onkeypress=\"return allowenter("+ Z + ","+ j + ",event)\">";
           
            }
            
            break;

       case "f":
             
             if (mat[Z][j]==null)
                 cellvalue = "" ;
             else
             {
                 cellvalue = formatmat(mat[Z][j],Z,j) ;
                 
             } 
             af += "<table cellspacing=0 cellpadding=0 width=100% ><tr><td><INPUT  type=hidden  NAME="+Z+"_"+j+"></td><td id=\"cell" + Z +"_" + j + "\" style=border-radius:3px width=100% >"+ cellvalue + "</td></tr></table>";
            break;

       case "b": case "B":
              af +=  "<table cellspacing=0 cellpadding=0><tr><td><INPUT  type=hidden  NAME="+Z+"_"+j+"></td><td id=\"cell" + Z +"_" + j + "\">" + Innergrid.makeinnertable(mat[Z][j], Z, j, ctype[j] == 'b')  + "</td></tr></table>";
              //af +=  Innergrid.makeinnertable(mat[Z][j], Z, j, ctype[j] == 'b');
              
            //af += "<table  border=1 cellspacing=0 cellpadding=0><tr><td><input type=text  onfocus=\"S("+Z+","+j+");Innergrid.goto1st("+Z+","+j+")\"  onkeypress=\"return Innergrid.dotabenter(event )\" onblur=\"Innergrid.leavingbox();onblur=U("+Z+","+j+")\"  style=\"width:1px;visibility:hidden\" name=" + Z +"_"+j+"></td><td id=\"cell" + Z +"_" + j + "\">&nbsp;</td></tr></table>";
            break;
      break;
       case "s": case "S": 
           af +="<SELECT  style=" + readonly +"  NAME="+Z+"_"+j; 
           af += " onchange=\"U("+Z+","+j+");UT("+Z+","+j+")\" ";
           af +=" onfocus=S("+Z+","+j+")   >"; 
           var zz = ''; 
           var hhit=0; 
           if (options[j] != null)
           for (var jj=0; jj < options[j].length; jj++) 
           if (Z < numRows && mat[Z][j]==options[j][jj]) 
           { 
             hhit = 1; 
             zz += "<option   value=\""+ options[j][jj] + "\" selected=true>"+ captions[j][jj] +"</option>"; 
           } 
           else 
             zz += "<option   value=\""+ options[j][jj] + "\">"+ captions[j][jj] +"</option>"; 
           if (Z < numRows && mat[Z][j] != null && hhit==0) 
             af += "<option   value=></option>"+ zz + "<option value=\""+ mat[Z][j] + "\" selected=true>"+ mat[Z][j] +"</option>"; 
           else 
             af += "<option   selected=true value=\"\"></option>"+ zz; 
           af += "</SELECT>"; 
           break;

        case 'w': case 'W':
           af +="<SELECT style=" + readonly +" onload=fillSelect(this,mat["+Z+"]["+j+"],dtype["+j+"])  NAME="+Z+"_"+j; 
           af += " onchange=\"U("+Z+","+j+");UT("+Z+","+j+")\" ";
           af +=" onfocus=S("+Z+","+j+")    multiple size=" + fsize[j] +">"; 
           
           if (options[j] != null)
           for (jj=0; jj < options[j].length; jj++) 
              af += "<option value=\""+ options[j][jj] + "\">"+ captions[j][jj] +"</option>"; 
           af += "</SELECT>"; 
           break;

        
       case "r": case "R":

           if (options[j].length==1)
             af +="<INPUT type=radio    style=border:0;width:25px;background-color:transparent;"
             + "  NAME=1_"+j
             + " onchange=UT("+Z+","+j+") onfocus=S("+Z+","+j+") onclick=U1("+Z+","+j+","+options[j][0]+") value=\""
             + options[j][0] + "\">"
             + captions[j][0];
           else if (options[j].length > 1)
           {
              af +="<table width=300 align=left cellspacing=0 border=0 cellpadding=0><tr>";
              for ( jj=0; jj < options[j].length; jj++)
              {
                 af   +="<td width=25px align=left><INPUT type=radio  style=border:0;width:25px;background-color:transparent;"
                 + "  NAME="+Z+"_"+j
                 + " onfocus=S("+Z+","+j+") onclick=U("+Z+","+j+") onchange=UT("+Z+","+j+") value=\""
                 + options[j][jj] + "\"></td><td><nobr>";
                 if (captions[j][jj].charAt(captions[j][jj].length-1)=='/')
                   af   += captions[j][jj] + "&nbsp;</nobr></td></tr><tr>";
                 else
                   af   += captions[j][jj] + "&nbsp;</nobr></td>";

              }
              af += "</tr></table>";


           }
           break;


       case "p": case "P": 
         af += "<INPUT style=" + readonly +" type=password  size="+fsize[j]+"  NAME="+Z+"_"+j; 
         af += " onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+") onchange=UT("+Z+","+j+") >";
         break;

      

       case "c": case "C": 
          
         af += "<INPUT    type=checkbox   style=\"" + readonly +"border:0;background-color:transparent\"  NAME="+Z+"_"+j;
         af += " onchange=UT("+Z+","+j+") ";
         if (mat[Z][j] != null && mat[Z][j] != '0' || Z>=numRows && defaultRecord[j] !=null && defaultRecord[j] !='0')
            af += " checked ";
         af += " onclick=\"valuechanged[counter]=true\" ";
         af += " onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+")>";
         break;

       case "l": 
           if (fsize[j] == '1' || fsize[j] == '2') fsize[j] = '3';
         af += "<INPUT class=underline style=\"background-color:transparent\" size="+fsize[j]+"  NAME="+Z+"_"+j;
         af += " onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+") onchange=UT("+Z+","+j+") onDblClick=openit1(this.value,"+Z+")>";
         break;

       case "L": 
         x =  extractfromm(mat[Z][j],true);  
          if (x == '>>') af +=  "<input align=center ";
         else af +=  "<input align=left ";
         af +=  "  readonly   style=background-color:transparent;border:0px;color:#0000AA size=" + (x.length < 2 ? 2:x.length) + "  NAME="+Z+"_"+j+" onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+") onchange=UT("+Z+","+j+") value=\"" + x + "\" onClick=openit2("+Z+","+j+")>";
         break;
/*
         case "h": case "H":
         if (af.substring(af.length-5) ==  "</tr>" )
            af = af.substring(0, af.length-10) + "<INPUT  type=hidden  NAME="+Z+"_"+j+">";
         else
            af = af.substring(0, af.length-5) + "<INPUT  type=hidden  NAME="+Z+"_"+j+">";

         break;
        case "k": case "K": 
         if (Z < numRows)
            af = af.substring(0, af.length-10) +
            "<input type=button class=flat NAME="+Z+"_"+j+" onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+")  onClick=\"passedRow="+Z+";passedCol="+j+";openit1(mat["+Z+"]["+j+"]+'&existing='+ encodeURIComponent(mat["+Z+"]["+(j-1)+"]),"+Z+")\" value=&bull;&bull;&bull; >";
         else 
            af = af.substring(0, af.length-10) +
            "<input type=button class=flat NAME="+Z+"_"+j+" onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+")  onClick=\"passedRow="+Z+";passedCol="+j+";openit1(defaultRecord["+j+"],"+Z+")\" value=&bull;&bull;&bull; >";
         break;
*/
       case "u": 
           af += "<INPUT   style=\"" + readonly +"border:1px #b0b0b0 solid\"  size=50 NAME="+Z+"_"+j;
           af += " onfocus=S("+Z+","+j+") onblur=\"U("+Z+","+j+")\" onchange=\"document.form1.image" + Z+"_"+j+".src=this.value;UT("+Z+","+j+")\"  onkeypress=\"return allowenter("+ Z + ","+ j + ")\"><br>";
           af += "<img name=image" + Z + "_"+j+" src=\"" + mat[Z][j] + "\" ";
           if (fsize[j]!="" && ffsize[j] != "")
              af +=  "width=" + fsize[j] + " height=" + ffsize[j];  
           else if (fsize[j]!="")
              af +=  " width=" + fsize[j]; 
           else if (ffsize[j]!="")
              af +=  " height=" + ffsize[j]; 
           af +=  "  >";
           break;
       case "U":
           af += "<INPUT style=\"" + readonly +"border:1px #b0b0b0 solid\"  NAME="+Z+"_"+j +" type=hidden>";
           af += "<img name=image" + Z+"_"+j+" src=\"" + mat[Z][j] + "\" ";
           if (fsize[j]!="" && ffsize[j] != "")
              af +=  "width=" + fsize[j] + " height=" + ffsize[j];  
           else if (fsize[j]!="")
              af +=  " width=" + fsize[j]; 
           else if (ffsize[j]!="")
              af +=  " height=" + ffsize[j]; 
           af +=  "  >";
           break;
       /*
       case "T":  
         af += "<INPUT  style=" + readonly +"  size="+fsize[j]+ " NAME="+Z+"_"+j;
         af += " onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+") onchange=UT("+Z+","+j+")  >";
         break; */
       default:
          if (showup(j))
          {
            af += "<INPUT  style=\"" + readonly +"border:1px #b0b0b0 solid\"  size="+fsize[j]+ " NAME="+Z+"_"+j;
            af += " onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+")  onchange=UT("+Z+","+j+")  onkeypress=\"return allowenter("+ Z + ","+ j + ")\">";
          }
      }

    futurej  = j1;
    while (futurej < numCols-1 && showup(positionr[futurej+1])==false )
    {
      j = (positionr[++futurej]);
      if (ctype[j].toLowerCase()=='h')
      {
         af += "<INPUT  type=hidden  NAME="+Z+"_"+j+">";
      }
      else if (ctype[j].toLowerCase()=='k')
      {
         if (Z < numRows)
            af +=  "<input type=button class=flat style=background-color:transparent NAME="+Z+"_"+j+" onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+
                ")  onClick=\"openit3("+Z+","+j+")\" value=&bull;&bull;&bull; >";
         else
            af +="<input type=button class=flat  style=background-color:transparent NAME="+Z+"_"+j+" onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+
                ")  onClick=\"openit3("+Z+","+j+")\" value=&bull;&bull;&bull; >";
      }
    }
    af +="</td>";
    j =  positionr[j1] ;
    if (fold[j])
    {
        af +="</tr>";
    }
    j1 = futurej;
   } 
   document.write(af + "</table>" + round2 +"</td></tr>");
} 
 
function large(ta,ct,j)
{
   S(ct,j);
   var llen = parseInt(ta.style.height.replace(/px/,''));
   if ('' + llen != 'NaN')
       ffsize[j] = llen;
   else
   {
       ffsize[j] = ta.offsetHeight;
   }
   if (ffsize[j] < 270)
       ta.style.height = 270+  "px";
}
hasfoot = false;
if (hasfoot && NUMROWS>0)
{
   af =("<tr><td>" + round1() +"<TABLE BORDER=0 width=100% cellspacing=0 bgcolor=" + DBGCOLOR +"  >");
   
   af +="<TR bgcolor="+ DBGCOLOR +"><TD colspan=2 valign=top> ";
   if (viewonly==false) af +="<INPUT type=hidden name=total1>";
   af += "</TD></TR>";

   var xx = "";
   for (j = 0; j < numCols; j++) 
   {
      str1 = labels[j].replace(/([a-z])([A-Z])/g, "$1&nbsp;$2");
       
      var footv = "";//calfoot(j);

      if (str1.indexOf("nolabel")==0 ||   ctype[j] == 'h' || ctype[j] == 'k' || foot[j]=='' || dtype[j]==false&&foot[j]!='count')
      {
          xx +="<input name=foot" + j + " type=hidden value=\"" + footv +"\">";
      }
      else
      {   
          af += ("<tr><TD VALIGN=top width=100><table cellspacing=1 cellpadding=3 width=100% ><tr width=100% ><td  width=100% bgcolor="+ IBGCOLOR + "  ><font color=#DDCC11><b><NOBR>"+ str1 + "</NOBR></b></font></td></tr></table></TD><td>");
          af += xx;
          xx = "";
          var tt = parseInt(ffsize[j]); if (''+tt == 'NaN') tt = 12;
          af +="<INPUT   readonly style=\"background-color:" + DBGCOLOR +";border:0px\" size="+tt+" NAME=foot"+j+" onkeypress=\"return false\" value=\"" + footv +"\"></TD></TR>";
      }
   }
   if (viewonly) af +="<INPUT type=hidden name=total1>";
   document.write(af);
   document.write( "</table>" + round2  +"</td></tr>");
 
}
 
if (hasfoot == false)
{
    document.write( "<tr><td>"); 
if (title != null && title.length>0 && numRows>0)
   document.write( "<center>" + textmsg[194]+": <input class=samebg name=total size=5 value="+numRows + "><center>");
else
   document.write( "<center><input type=hidden name=total size=5 value="+numRows +"></center>"); 
   document.write( "</td></tr>"); 
}

document.write( "</table>"); 

document.write( "</form> <center> ");

var hasopttable = '';
if (  NUMROWS>0) hasopttable =makesend();
if (mm > 0  && NUMROWS>0)
{
    makeasso();
} 
 
document.write( "<form rel=opener name=thisform  method=POST style=\"margin:0px 0px 0px 0px\" target=savewindow action=Echo  >"); 
document.write( "<input type=HIDDEN   name=subdb value=\"" + subdb + "\">");
document.write( "<input type=HIDDEN   name=rdap value=\"" + rdapname + "\">");
document.write( "<input type=HIDDEN   name=rsacode value=\"" + rsaenccode + "\">");
document.write( "<input type=HIDDEN   name=query>"); 
document.write( "<input type=HIDDEN   name=title>"); 
document.write( "<input type=HIDDEN   name=id>"); 
document.write( "<input type=HIDDEN   name=wcds>"); 

if (title != null && title.length>0 && NUMROWS>0)
{
   var notlink0 = webserviceAlloptions.replace(/<a.*<.a>/g,'');
   var alinks = webserviceAlloptions.substring(0,webserviceAlloptions.length - notlink0.length);
   while (true)
   {
             jj = alinks.indexOf("textmsg[");
             if (jj==-1) break;
             var kk = alinks.indexOf("]",jj);
             alinks = alinks.substring(0,jj)
             + textmsg[parseInt(alinks.substring(jj+8,kk))]
             + alinks.substring(kk+1);
   }
   document.write(alinks);
   webserviceAllbuts = webserviceAllbuts.replace(/this.form.localpathtoupload.click\(\)/,"myprompt(textmsg[345]+'[+]')");
   
   if (mm>0)
      document.write(webserviceAllbuts.replace(/<br>/g,''));

 
if (sessiondebug && ( hasupdate || hasdelete) )
{ 
   document.write( "<input  class=BlueButton    type=button value=\"" + textmsg[21] +"\"   ONCLICK=\"setaction(2)\">");
   document.write( "<input  class=BlueButton     name=query1 type=button value=\"" + textmsg[22] +"\"   onClick=showNext()>");
   document.write("<input class=OrangeButton    type=button value=\"" + textmsg[23] +"\"  ONCLICK=copy1()>");
} 

if ( hasupdate && exbut.indexOf('u')<0)
{ 
   document.write( "<input  class=OrangeButton name=savebtn    type=button value=\"" + updatelabel + "\"   ONCLICK=\"disablefuncbut();setaction(1)\"  onMouseOver=\"showmyhint(" + (numCols )  + ")\"  onMouseOut=\"hidemyhint()\">");
  // document.write( "<input  class=OrangeButton  style=width:" + butwidth(textmsg[24]) +"px  name=reset type=button value=\"" + textmsg[24] +"\"   onClick=reset1()>"); 
} 

if (hasdelete && exbut.indexOf('d')<0 )
{ 
   document.write( "<input class=RedButton  name=delbtn   type=button value=\"" + deletelabel + "\"  ONCLICK=\"trydelete()\"  onMouseOver=\"showmyhint(" + (numCols+1)  + ")\"  onMouseOut=\"hidemyhint()\">");
} 
if (exbut.indexOf('p')<0)
   document.write( "<input  class=GreenButton     type=button value=\"" + textmsg[409] +"\"   ONCLICK=printing()  onMouseOver=\"showmyhint(" + (numCols+3)  + ")\"  onMouseOut=\"hidemyhint()\">");
if (nextpageurl!='')
    document.write("<input type=button class=GreenButton    value=\"" + textmsg[795] + "\"  onclick=\"nextpage()\"  onMouseOver=\"showmyhint(" + (numCols+4)  + ")\"  onMouseOut=\"hidemyhint()\">");
  
if (exbut.indexOf('h')<0)
document.write( "<input  class=GreenButton     type=button value=\"" + textmsg[17] +"\"   ONCLICK=showhelp()>");
document.write( "</center>");

}
document.write("</form>");
document.write( "<div id=anchor name=anchor style=\"width:1px;height:1px;float:right\"><!----></div>");
resizebut(document.thisform);
theight = (numRows + (hasnew?6:0) )*30+200;
 

function passover(r,c)
{
    return  retrv(r,c);
}
function passoverNumCols()
{
    return numCols;
}
function passoverNumRows()
{
    return numRows;
}
         
function passoverNUMROWS()
{
    return NUMROWS;
}

function setCell(r,c,str)
{
   setv(r,c,str);
}
function disablefuncbut(b)
{
   if (typeof(hidemyhint) == 'function')
      hidemyhint();
   if (b==null) b = true;
   if (typeof(f2.savebtn)!='undefined')
   f2.savebtn.disabled = b;
   if (typeof(f2.delbtn)!='undefined')
   f2.delbtn.disabled  = b;
}
function trydelete()
{
    disablefuncbut();
    setaction(3);
}
function resizeCont() 
{ 
    var wd = thispagewidth() - 60 - Math.floor(font_size*20/3);
    if (wd < 10)   wd = 10;
      
      var aindex = 0;
      for (var k=0; k < NUMROWS; k++)
      {
         for (var i = 0; i < numCols; i++) 
         { 
            var en = ele(k,i); 
            if (ctype[i] == 'i')
            {
                var jj=0; while(jj < self.frames.length && self.frames[jj].name != "iframe"+k + '_' + i)jj++;
                self.frames[jj].width = (wd )+ 'px' ;
              
            }
            else 
            if (ctype[i] == 'a' || ctype[i] == 'A') 
            {
               en.style.width = "" + wd + "px";
               aindex = i;
            } 
         }
      }
  }
  
  
  function modifyattach(Z,j)
  {
      counter = Z;
      rr=Z;
      cc=j;
      ResizeUploaded.attachref = ele(rr,cc);
      ResizeUploaded.attachman(ResizeUploaded.attachref);
  }
  window.onresize = function(){ needtodoresizecont = true;}
  hints[numCols+1] = textmsg[809];
  onbegin=onbegin.replace(/;$/,'') +";resizeCont();";
  
 
  if (NUMROWS==0) document.write(textmsg[351]);
  whichcell = function(Z,j)
  {
   return document.getElementById("cell" + Z + "_" + j);
  }
  
if(datapresentformat =='DataLongForm')
    enableattachman('rr');


 