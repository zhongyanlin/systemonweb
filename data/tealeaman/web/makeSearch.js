/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/

 
datapresentformat = 'DataSearch';
var fwidth = Math.round(font_size*6.1);
 
var colspan = (numCols > 0 )?3:1;
writenow(unititle(title,'outset'));
 
writenow(unifontstyle(font_size));

//writenow("<table width=100% align=center cellspacing=0 cellpadding=0><tr><td width=100% align=center>");

writenow("</td></tr><tr><td  align=left>");
writenow("<form rel=opener name=form1 style=\"margin:0px 0px 0px 0px\"  >\n"); 
writenow("<table cellspacing=0 cellpadding=0 class=outset align=center width=100% ><tr><td width=100% align=center>");
writenow("<table width=100% id=maintbl  border=0 align=center cellspacing=1 cellpadding=3  >" +
"<tr height=28><td align=center valign=center colspan=3 width=100%  style=\"text-shadow:-1px -1px #060606;color:#DDCC11;font-weight:700\" >"+textmsg[405]+"</td></tr>"); 
 
if (typeof (counter) == 'undefined')
   var counter = 0;
var hc = 0; 
var buttons = ""; 
var rsstr = ""; 
var Lstr = "";
var timeformat1 = timeformat;
if (timeformat1.indexOf("YY") ==-1)
  timeformat1 = timeformat1 + ' YYYY';
else if (timeformat1.indexOf("YYYY") ==-1)
  timeformat1 = timeformat1.replace(/YY+/,"YYYY");  
var hides = '';

var folder = true;
var sealtail = "";
onbegin +=";maxit();";

var j=0, j1=0;
var bufferedhidden = "";
for (; j1 < numCols; j1++)
{
   j = positionr[j1];
   if (ctype[j] != 'h') break;
   bufferedhidden += "<INPUT  type=hidden value=\"" + defaultRecord[j] +"\"  NAME="+fields[j] +">";
}

var styleforselec = '';
for (; j1 < numCols; j1++)
{
  
   j = positionr[j1];
   if (ctype[j] == null || ctype[j] == "")
      ctype[j] = "T";

   if ( ctype[j].toLowerCase() =='k')
   {
      writenow("<input style=background-color:"+IBGCOLOR+";color:#DDCC11;font-weight:700;border:0 readonly size=2 NAME="+fields[j]+" value=&bull;&bull;&bull; onClick=\"passedCol="+j+";openit1(mat[counter]["+j+"]+'&existing='+encodeURIComponent(f1.elements[lookup["+(j-1)+"]].value),counter)\">");
      continue;
   }
   if (ctype[j].toLowerCase()=='h')
   {
      writenow("<INPUT  type=hidden value=\"" + defaultRecord[j] +"\"  NAME="+fields[j] +">");
      continue;
   }
   var str = labels[j].replace(/([a-z])([A-Z])/g, "$1 $2"); 
   str = str.replace(/[0-9]+/,'');
   str = str.substring(0,1).toUpperCase() + str.substring(1);
   var pxs = 13;
   if (mat[0][j]=="&ge;" || mat[0][j]=="&le;")
           pxs = 14;
   else if (mat[0][j]=='=')
           pxs = 17;
   pxs = Math.ceil(pxs*font_size/15);
   if (sealtail!='')
   {
      writenow(sealtail);
      sealtail = "";
   }
   if (folder)
   {
   writenow( "<TR  >");
   writenow( "<td align=left width=100   >");
   writenow( "<div style=\"color:#DDCC11;text-shadow:-1px -1px #060606\" onMouseOver=\"showmyhint("   + j  + ")\"   onMouseOut=\"hidemyhint()\" ><nobr><b>" + str + "</b></nobr></div>");
   writenow("</TD>");
   writenow("<td align=center  style=text-alignment:center;font-size:" + pxs +"px;color:#DDCC11 onMouseOver=\"showmyhint(" + (numCols+j)  + ")\"   onMouseOut=\"hidemyhint()\" ><b>" + mat[0][j] + "</b></TD>");

   if (bufferedhidden != '')
   {
      writenow(bufferedhidden);
      bifferedhidden = "";
   }
   }
   if (mat[0][j]=='&supe;') 
   {
       hints[j+numCols] = textmsg[803];
   }
   else if (mat[0][j]=='&ge;')
   {
       if( ctype[j]=='m')
           hints[j+numCols] = textmsg[804];
       else
           hints[j+numCols] = textmsg[806];
   }
   else if (mat[0][j]=='&le;')
   {
      if (ctype[j]=='m')
       hints[j+numCols] = textmsg[805];
      else
       hints[j+numCols] = textmsg[807];
   }
   else
   {
       hints[j+numCols]= textmsg[808];
   }

   rsstr = mat[0][j]; 
   mat[0][j]  = defaultValue(0,j);
   
   x = ctype[j].toLowerCase(); 
   if (x=='a' || x=='i' || x=='n' || x=='u')
   {
         if (fsize[j] == null)
         {
             fsize[j] = "10";
             if (x =='n')
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
                   if (x =='n')
                     ffsize[j] = "0";
                   else if (x=='u')
                     ffsize[j] = "";
                   else
                     ffsize[j] = "30";
                }
             }
             else
             { 
                if (x =='n')
                   ffsize[j] = "0";
                else if (x=='u')
                   ffsize[j] = "";
                else
                   ffsize[j] = "30";
             }
         }
    }
    else if (x =='m' && (fsize[j]== null||fsize[j]==""))
       fsize[j] = 10;//timeformat1.length*0.7;
    else if (x =='l' && (fsize[j]== null || fsize[j]==""))
       fsize[j] = '2';
    
    if (dtype[j]) 
        classrl = "right"; 
    else 
        classrl = "left";

    if (ctype[j] ==ctype[j].toUpperCase())
    {
         readonly = "color:" + IBGCOLOR+";";
    }
    else if (ctype[j]=='c'||ctype[j]=='r')
    {   
        readonly = "background-color:transparent;color:black;";
    }
    else 
    {   
        readonly = "border:1px #c0c0c0 solid!important;background-color:transparent;color:white;";
    }
    readonly += "border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;";
    if (ctype[j]=='a' || ctype[j]=='p') ctype[j] = 't'; 
   if (fsize[j] == '') fsize[j] = '12';
   switch(ctype[j]) 
   { 
      case 'a': case 'A': 
       
         hc += parseInt(fsize[j])*25; 
          
         writenow( "<TD width=105  align=left><table><tr><td  align=left><textarea style=width:" + fwidth +"px;"+readonly + " cols="+ffsize[j]+" rows="+fsize[j]+" name="+fields[j] );
         writenow( " onfocus=\"S(0,"+j+")\" "); 
         writenow( " onblur=\"U(0,"+j+")\" ");
         writenow( " onchange=\"UT(0,"+j+")\"  ></textarea>");

         break;
       
      case 'i': case 'I': 
         writenow("<TD width=105  align=left><table><tr><td  align=left><input type=hidden name="+fields[j]+"><iframe frameborder=0 width="+ffsize[j]+" height="+fsize[j]+" name=iframe"+j +"></iframe>");
         break; 
      case "m": case "M": 
      if (mat[0][j].replace(/[0-9]/g,'') != '')
      {
          try{
              mat[0][j] = "" + eval(mat[0][j]);
          }catch(e)
          { 
              mat[0][j] = mat[0][j].replace(/[^0-9].*/,'');
          }
      }
      writenow( "<TD width=105  align=left><table cellspacing=0 cellpadding=0><tr><td  align=left><INPUT type=text style=\"width:" + fwidth +"px;" + readonly +"overflow:hidden\" MAXSIZE=" + maxsize[j] +" SIZE=\""+fsize[j]+"\"  name=\""+fields[j] );
      writenow( "\" onfocus=\"S(0,"+j+")\" "); 
      writenow( " onblur=\"U(0,"+j+")\" ");
      writenow( " onchange=\"UT(0,"+j+")\" >");

      break;

      case "t": case "n": case "T": case "N":
      if (folder)
          writenow( "<TD width=105  align=left><table cellspacing=0 cellpadding=0><tr  >");
         
       if (parseInt(fsize[j])<=5)
          writenow( "<td  align=left><INPUT type=text style=\"text-align:right;width:" + Math.round((fwidth-pxs-6)/2) +"px;" + readonly +"overflow:hidden\" MAXSIZE=" + maxsize[j] +" SIZE="+fsize[j]+" name="+fields[j] );
      else
         writenow( "<td  align=left><INPUT type=text style=\"width:" + fwidth +"px;" + readonly +"overflow:hidden\" MAXSIZE=" + maxsize[j] +" SIZE=\""+fsize[j]+"\" name=\""+fields[j] );
      writenow( "\" onfocus=\"S(0,"+j+")\""); 
      writenow( " onblur=\"U(0,"+j+")\"");
      writenow( " onchange=\"UT(0,"+j+")\" onkeypress=\"allowenter1("+ j + ",event)\" >");
      folder = !(rsstr=='&ge;' && j1<numCols-1 && mat[0][positionr[j1+1]]=='&le;' && j < numCols-1 && fields[positionr[j1+1]].indexOf(fields[j])==0 );

      break;
  
      case 'p': case 'P': 
      writenow( "<TD width=105 align=left><table><tr><td  align=left><INPUT type=text style=\"width:" + fwidth +"px;" + readonly +"overflow:hidden\"   type=password SIZE=\""+fsize[j]+"\" NAME=\""+fields[j] );
      writenow( "\" onfocus=\"S(0,"+j+")\" "); 
      writenow( " onblur=\"U(0,"+j+")\" ");
      writenow( " onchange=\"UT(0,"+j+")\" >");
      j = printhidden(j);
      break; 

      case 's': case 'S': 
      
      writenow( "<TD width=105  align=left><table cellpadding=0 cellspacing=0><tr><td  align=left><SELECT class=\"selectsel\" style=\"width:" + (fwidth+3) +"px;overflow:hidden;" + readonly + "\"   name=\""+fields[j] +'"' );
      if (ctype[j]=='S')
         writenow("  onchange=\"resistchange(counter,"+j+")\" ");
      else
         writenow( " onchange =\"U(0,"+j+");UT(0,"+j+")\" ");
      writenow( " onfocus=\"S(0,"+j+")\" >");
      
       
      if (options[j] != null)
      for (var k=0; k < options[j].length; k++)
      {
          var  hiddenvalue = options[j][k];
          var facevalue = captions[j][k];
          if (facevalue == null || hiddenvalue == null) continue;
          writenow("<option   value=\"" + hiddenvalue.replace(/"/g,'\\"') +"\">" + facevalue +"</option>");
      }
      writenow("</SELECT>"); 

      break; 
      case 'w': case 'W':
      hc += 120;
      writenow( "<TD width=105  align=left><table><tr><td  align=left><SELECT style=\"width:" + fwidth +"px;" + readonly +"overflow:hidden\" multiple size=4 name=a"+fields[j] );
      if (ctype[j]=='W')
         writenow("  onchange=\"resistchange(counter,"+j+")\" ");
      else
         writenow( " onchange=\"U(0,"+j+");UT(0,"+j+")\" >\n");
      writenow( " onfocus=S(0,"+j+")");
      
       
      for (var jj=0; jj < options[j].length; jj++) 
         writenow("<option value=\"" + options[j][jj].replace(/"/g,'\\"') + "\">" + captions[j][jj] + "</option>"); 
      writenow("</SELECT>"); 
      break;

      case 'r': case 'R': 
      writenow( "<TD width=105  align=left><table cellspacing=0 cellpadding=0><tr><td  align=left>");
      for (jj=0; jj < options[j].length; jj++)
      {
          writenow( "<input style=" + readonly +"  type=radio   name=" + fields[j]    ); 
          writenow( " onfocus=S(0," + j + ") onblur=U(0,"+j+")  onclick=UT(0,"+j+") value=\"" + options[j][jj].replace(/"/g,'\\"') + "\"></td><td  align=left><nobr><font color=#DDCC11>" + captions[j][jj].replace("/","</nobr><br>")  +"</font></nobr>");
          if (jj < options[j].length-1)
             writenow( "</td></tr><tr><td  align=left>");
     }

      break; 
       
      case 'c': case 'C': 
      writenow(" <TD align=left><table><tr><td  align=left><INPUT  style=\"" + readonly +"\"  type=checkbox NAME="+fields[j] );
      
      writenow( " onfocus=S(0,"+j+")"); 
      writenow( " onblur=U(0,"+j+")");
      writenow( " onchange=UT(0,"+j+")>");

      break; 
      case 'l':  
      writenow("<TD width=105  align=left><table><tr><td  align=left><INPUT class=dunderline SIZE="+fsize[j]+" NAME="+fields[j] );
      writenow( " onfocus=S(0,"+j+")"); 
      writenow( " onblur=U(0,"+j+")");
      writenow( " onchange=UT(0,"+j+") onDblClick=openit1(this.value,counter)>");

      break; 
       
      case 'L':
         writenow( "<input type=hidden NAME=" + fields[j] + ">");
         Lstr += "<input type=button value=\""+labels[j]+"\"  style=overflow:visible;background-color:blue;cursor:pointer;font-weight:700;color:white;width:65 NAME="+fields[j]+" onClick=openit2(counter,"+j+")>";

      break;
      case "u":
           writenow( "<TD width=105  align=left><table><tr><td  align=left><INPUT type=text style=\"width:" + fwidth +"px;" + readonly +"overflow:hidden\" MAXSIZE=" + maxsize[j] +" SIZE=80 name="+fields[j] );
           writenow( " onfocus=S(0,"+j+")"); 
           writenow( " onblur=U(0,"+j+")");
           writenow( " onchange=\"document.form1.image"+j+".src=this.value;UT(0,"+j+")\"  >");
           writenow( "</td><td  align=left>      </td></tr>");
           writenow( "<tr><td align=left colspan=2><img name=image"+j +" src=\"" + mat[0][j] +"\"");
           if (fsize[j] != "" && ffsize[j]  !=  "")
              writenow( " width=" + fsize[j] + " height=" + ffsize[j]);  
           else if (fsize[j] != "")
              writenow( " width=" + fsize[j]); 
           else if (ffsize[j] != "")
              writenow( " height=" + ffsize[j]); 
           writenow( " >");

           break;
       case "U":
         writenow( "<TD width=105  align=left><table><tr><td  align=left><img name=image"+j  +" src=\"" + mat[0][j] +"\"");
           if (fsize[j] != "" && ffsize[j]  !=  "")
              writenow( " width=" + fsize[j] + " height=" + ffsize[j]);  
           else if (fsize[j] != "")
              writenow( " width=" + fsize[j]); 
           else if (ffsize[j] != "")
              writenow( " height=" + ffsize[j]); 
           writenow( "  >");

           break;
   } 
   
   if ( j1==numCols-1 ||   folder)
   {
       sealtail = ( "</td></tr></table></TD></tr>");
   }
   else if ( folder==false)
   {
       sealtail = ("</td><td align=center style=\"width:" + Math.ceil(pxs+2) +"px !important;font-size:" + pxs +"px\"><font color=#DDCC11><b>&le;</b></font></td>");
   }
} 

 
if (bufferedhidden != '')
{ 
    writenow( "<tr><td  align=left>" + bufferedhidden + "</td></tr>");
}
writenow(sealtail);
writenow( "<tr><td colspan=3  style=\"height:1px;background-color:" + IBGCOLOR +"\"></td></tr>");
writenow( "<tr><td align=left width=100   >");
writenow( "<div style=\"text-shadow:-1px -1px #060606;color:#DDCC11;font-weight:700\"  onMouseOver=\"showmyhintstr("  +textmsg[1649]  +")\"  onMouseOut=\"hidemyhint()\"><nobr>" + textmsg[1280]  + "</nobr></div>");
writenow("</TD>");
writenow("<td align=center  style=\"text-alignment:center;font-size:" + pxs +"px;color:#DDCC11\" onMouseOver=\"showmyhintstr("  + ' can be selected as '   +")\"   onMouseOut=\"hidemyhint()\" ><b>" + '='  + "</b></TD>");
readonly = "border:1px #c0c0c0 solid!important;background-color:transparent;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;";
writenow("<td><select class=selectsel style=\"width:" + (fwidth+3) +"px;overflow:hidden;" + readonly + "\"   name=displayformat></select></td></tr>");
writenow( "</table></td></tr></table></form>"); 
  
writenow( "</td></tr>");
 
if (mss[8]== null) mss[8]="";
writenow( "<tr><td align=center width=100%>"); 
writenow( "<form rel=opener  name=thisform  style=\"margin:0px 0px 0px 0px\" method=POST action=\"" + mss[8] + "\" target=" + parent.frames[1].name + " style=\"margin:5px 0px 0px 0px\"  > \n");
for (var i=0; i < numCols; i++)
writenow( "<input type=hidden name=" + fields[i] +">");
writenow( "<input type=HIDDEN   name=subdb value=\"" + subdb + "\">");
writenow( "<input type=HIDDEN   name=wcds>\n");
writenow( "<input type=HIDDEN   name=startingrow value=0>\n"); 

writenow( "<input type=hidden   name=onbegin>\n"); 

writenow( "<input type=hidden name=total value="+ numRows+ ">"); 

if (Lstr != '') writenow(Lstr); 
writenow( "<table id=buttons align=center width=100% ><tr><td  align=\"" + (deleteQuery==''?"center":"right") + "\"><input class=GreenButton  style=\"overflow:visible;width:" + butwidth(textmsg[16]) +"px\"  name=savebtn type=button value=\"" + textmsg[16] +"\" ONCLICK=dosearch()></td> "); 


if (deleteQuery != '')
{
   if (deletelabel ==textmsg[69])  deletelabel = textmsg[114];
   if (rdapname.toLowerCase().indexOf('message')>=0 || rdapname.toLowerCase().indexOf('announce')>=0)
       deletelabel = textmsg[1636];
   writenow( "<td  align=left><input class=GreenButton  style=\"overflow:visible;width:" + butwidth(deletelabel) + "px\" name=savebtn1 type=button value=\"" + deletelabel +"\" ONCLICK=\"setrdapname(2);newrecord()\"></td>");
}

 writenow( "</tr></table></form></td></tr>"); 
 
var webserviceButs = webserviceAllbuts.split(/;/);
 
if (webserviceAllbuts != '')
{ 
    writenow("<tr><td  align=left><table class=outset cellspacing=1 cellpadding=0 bgcolor=#DDCC11 width=100% align=center>");
    for (var j=0; j < webserviceButs.length; j++) 
    {
       var indexstr = webserviceButs[j].replace(/.*textmsg.([0-9]+).*/,"$1");
    
       var indexnum = parseInt(indexstr);
       if ( "" +  indexnum != 'NaN')
       {
           webserviceButs[j] = webserviceButs[j].replace(/textmsg.([0-9]+)./,  textmsg[indexnum]);
       }
       
       webserviceButs[j] = webserviceButs[j].replace(/RIGHT/,parent.frames[1].name);
       writenow("<tr><td  align=center>");
       var noanchor = (webserviceButs[j].indexOf("<a")<0 || webserviceButs[j].indexOf("</a>") < 0);
       if (noanchor)
       {
          writenow( "<a   href=\"javascript:openlink('" + webserviceButs[j] +"')\">");
          writenow(webserviceButs[j] +"</a>"); 
       }
       else
       {
          writenow(webserviceButs[j]);
       }
       writenow('</td></tr>');
    }
    writenow(switchstr.replace(/center/,''));
    writenow("</table></td></tr>");
} 
else if (switchstr != '')
   writenow( switchstr);
 
writenow( "<tr><td  align=left>");

function openlink(str)
{
    formnewaction(document.thisform,str);
    document.thisform.onbegin.value='';
    document.thisform.target = popwin1;
    visual(document.thisform);
document.thisform.submit();
}
function maxit()
{
  // if (numCols >=12) {parent.moveTo(0,0);parent.resizeTo(screen.width, screen.height-30);}
}
function reload(){document.location.href = '' + document.location;}

function styleoptions()
{
    var T = numCols;
    if (typeof(document.form1.displayformat) == 'undefined')
        T--;
    
    for (var j=0; j <= T; j++)
    {
        
        var xx;
        if (j < numCols) 
            xx = ele(0,j);
        else 
            xx = document.form1.displayformat;
        if (j<numCols && ctype[j].toLowerCase() =='s' || j==numCols)
        {
            for (var i=0; i < xx.options.length; i++)
            {
                xx.options[i].className = 'selectoption';
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
 
 
 
 