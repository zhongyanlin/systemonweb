/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/


font_size = 15;
 
datapresentformat = 'DataSearch';
unifontstyle(font_size); 
var colspan = 2;
   document.write(unititle(title,"outset2"));

document.write("<form rel=opener name=form1 style=\"margin:4px 0px 0px 0px\"  >");

document.write("<TABLE BORDER=0 cellspacing=1 width=100% align=center class=outset1 ><tr>");
if (typeof counter == 'undefined')
    var counter = 0;
var hc = 0; 
var buttons = ""; 
var rsstr = ""; 
var timeformat1 = timeformat;
if (timeformat1.indexOf("YY") == -1)
  timeformat1 = timeformat1 + ' YYYY';
else if (timeformat1.indexOf("YYYY") == -1)
  timeformat1 = timeformat1.replace(/YY+/,"YYYY");  
var hides = '';
var ffsize = new Array(numCols);  
var selwidth = Math.floor(screen.width/4 - 4 - butwidth('')); 

 

for (var j =0; j < numCols; j++) 
{ 
    
   if (ctype[j] == null || ctype[j] == "")
      ctype[j] = "T";
   
   var str = labels[j].replace(/([a-z])([A-Z])/g, "$1 $2"); 
   
   str = str.replace(/[0-9]+/,'');
    document.write( "<TD  align=center><table cellspacing=0 cellpadding=3><tr width=100% ><td style=font-size:" + font_size +"px  width=100% bgcolor="+ IBGCOLOR + " BACKGROUND=header2.gif>"
                    + "<span style=color:#DDCC11 onMouseOver=\"showmyhint(" 
                    + j  + ")\"   onMouseOut=\"hidemyhint()\" ><nobr><b>" + str 
                    + "</b></nobr></span></td></tr></table></td>");
   var r=0;  
   mat[0][j]  = defaultValue(0,c);
 
   x = ctype[j].toLowerCase(); 
 
   if (x=='a' || x=='i' || x=='n' || x=='u')
   {

         if (fsize[j] == null)
         {
             fsize[j] = "10";
             if (x == 'n')
                ffsize[j]  = "0";
             else if (x=='u')
             {
                fsize[j] = "";
                ffsize[j] = "";
             }
             else
                ffsize[j]  = "30";
         }
         else
         {
             var sa = fsize[j].indexOf("_"); 

             if (sa > 0)
             {
                ffsize[j]  = fsize[j].substring(sa+1);
                
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
                   ffsize[j] = "30";
             }
         }
    }
    else if (x == 'm' && (fsize[j]==null||fsize[j]==""))
       fsize[j] = 10;//timeformat1.length*0.7;
    else if (x == 'l' && (fsize[j]==null || fsize[j]==""))
       fsize[j] = '2';
    
    if (dtype[j]) 
        classrl = "right"; 
    else 
        classrl = "left";
 

    if (ctype[j]=='a' || ctype[j]=='p') ctype[j] = 't'; 
   
   switch(ctype[j]) 
   { 
      
      case "t": case "n": case "T": case "N":
      document.write( "<TD   align=left><INPUT style=" + readonly +" MAXSIZE=" + maxsize[j] +" SIZE="+fsize[j]+" name="+fields[j] ); 
      document.write( " onfocus=S(0,"+j+")"); 
      document.write( " onblur=U(0,"+j+")");
      document.write( " onchange=UT(0,"+j+")  >\n");
      break;
  
      

      case 's':   
      document.write( "<td><SELECT  style=width:" + selwidth + "px  name="+fields[j] ); 
       document.write("  onchange=UT(0,"+j+");setrdapname(1);setaction(1)");
      document.write( " onfocus=S(0,"+j+")"); 
      document.write( " onblur=U(0,"+j+") >");
      
      for (var jj=0; jj < options[j].length; jj++) 
      {
            var tt = captions[j][jj];  
            document.write("<option value=\"" + options[j][jj].replace(/"/g,'\\"') + "\">" + tt + "</option>"); 
      }
      document.write("</SELECT></td>"); 
      break; 
     
   } 
} 
 
document.write( "</tr></table></form>");
 
document.write( "<form rel=opener style=topmargin:0pts;bottommargin:0pts name=thisform  method=POST action=" + mss[12] + " target=savewindow style=\"topmargin:0pts;bottommargin:0pts\"  > \n"); 
//document.write( "<input type=HIDDEN   name=rdap value=\"" + rdapname.replace(/0$/,"1") + "\">");
document.write( "<input type=HIDDEN   name=subdb value=\"" + subdb + "\">");
document.write( "<input type=HIDDEN   name=wcds>"); 
document.write( "<input type=HIDDEN   name=id>\n"); 
document.write( "<input type=hidden   name=onbegin>"); 
document.write( "<input  type=hidden size=3  name =count >"); 
document.write( "<input type=hidden name=total value="+ numRows+ ">"); 
for (var i=0; i < numCols; i++)
document.write( "<input type=hidden name=" + fields[i] +">");
document.write( "</form>");
 
 