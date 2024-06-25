/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
datapresentformat = 'DataPicker'; 
viewonly = false;

if (typeof piccount == 'undefined')
{
   var piccount = numCols + 5;
   var hints = new Array(piccount);
   hints[numCols]   = textmsg[11];
   hints[numCols+1] = textmsg[809];
   hints[numCols+2] = textmsg[745];
   hints[numCols+3] = textmsg[735];
   hints[numCols+4] = textmsg[795];
}


for ( j=0; j < numCols; j++)
{
   if (ctype[j] == null || ctype[j] == "")
      ctype[j] = "T";
   hints[j] +=  "<br>"  + textmsg[74] ;
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
             { fsize[j] = "10";  ffsize[j]  = "0";}
             else if (x=='u')
             {
                fsize[j] = "";
                ffsize[j] == "";
             }
             else
              {fsize[j] = "30";  ffsize[j]  = "5";}
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
       fsize[j] = '2';
    if ((ctype[j]=='t' || ctype[j]=='u' || ctype[j]=='p' ) &&  maxsize[j]  < parseInt(fsize[j]) )
       maxsize[j]=parseInt(fsize[j]);
    if (ctype[j]=='u')
        piccount += NUMROWS;
}

var needtitle = (title != null && title.length>0);
var needtitle1 = true;
if (parent!=window
    && parent.frames[0]!=null
    && self!=parent.frames[0]
    && typeof(parent.frames[0].getTitle)!='undefined'
    && ("" + parent.frames[0].location).substring(0,13)==("" + self.location).substring(0,13)
    && parent.frames[0].getTitle()==title)
    needtitle1=false;

document.write( "<table  cellpadding=0 cellspacing=0 ");
if (exbut.indexOf("l") >=0)
    document.write( "  align=left>");
else if (exbut.indexOf("r") >=0)
    document.write( "  align=right>");
else
    document.write( "  align=center>");
if (needtitle)
{
    if (needtitle1 && title.replace(/ /g,'')!='')
    {
      document.write("<tr><td align=center>" + unititle(title,'outset2') +"</td></tr>");
    }
}
document.write(unifontstyle(font_size));
document.write( "<tr><td  align=center><form rel=opener name=form1 style=\"margin:"+ ((needtitle&&needtitle1)?3:0) + " 0 0 0\"  >");
document.write(round1('100%') + "<table align=center   cellpadding=0 cellspacing=1 class=outset3 id=maintbl>");
document.write( "<tr><td  align=center><TABLE cellpadding=3 cellspacing=1 border=0>\n");
document.write( "<TR style=\"background:" + beheading +"\" >\n");
var af = "";
if (!viewonly)
   af +=( "<TD  width=" +  (5 + font_size) + " align=center> <input type=checkbox name=check1 value=all onclick=checkall1(this) style=background-color:" + BBGCOLOR +"> </TD>");
if (hasroworder)
   af +=( "<TD   ><nobr><b>" + textmsg[542] + "</b></nobr></TD>");

   var j1=0;
   for (;  j1 < numCols; j1++)
   {
      j = positionr[j1];
      if (ctype[j].toLowerCase()!='h')
          break;
   }

   for (;  j1 < numCols; j1++)
   {
      j = positionr[j1];



   var align = (dtype[j])?"right":"left";
   if (ctype[j]=='C'||ctype[j]=='c') align="center";
   x = ctype[j].toLowerCase();
   var str1 = labels[j].replace(/([a-z])([A-Z])/g, "$1&nbsp;$2");
   if (str1.indexOf("nolabel") == 0||x=='h'||x=='k') str1 = "";
   if (x =='k')
   {
      var j2 = af.lastIndexOf("<TD "); 
      af = af.substring(0, j2) + "<TD colspan=2  " + af.substring(j2+4);
   }
   else if (x!='h'  )
   af +=  "<TD align="+align
       +"   onclick=sort("
       + j+") onMouseOver=\"showmyhint(" + j  + ",1)\"   onMouseOut=\"hidemyhint()\" ><nobr><b>"
       + str1
       + "</b></nobr></td>";
 }
document.write( af + "</TR>");
 
var  classrl, Z,   readonly, cellvalue;
var numfsize=0;
 
for (Z = 0; Z < NUMROWS; Z++)
{
   var af = "<TR valign=middle bgcolor="+ TBGCOLOR +" style=\"margin:0px 0px 0px 0px\">";
   if (!viewonly)
      af += "<TD  valign=middle   align=center  width=" +  (5+ font_size) + "> <INPUT  type=checkbox name=checkbox onclick=recordch("+Z+",this) value=\"" + Z + "\"  > </TD>";
   if (hasroworder)
      af += "<TD   align=right>" +  (Z+1) + "</TD>";
   var att = makehw(Z);
   var bufferedhidden = "";
   j1=0;
   for (;  j1 < numCols; j1++)
   {
      j = positionr[j1];
      if (ctype[j].toLowerCase()=='h')
         bufferedhidden += "<INPUT  type=hidden  NAME="+Z+"_"+j+">";
      else break;
   }

   for (;  j1 < numCols; j1++)
   {
      j = positionr[j1];

      if (dtype[j] && ctype[j]!='M' && ctype[j]!='m')
         classrl = "right";
      else
         classrl = "left";

      if (ctype[j] == ctype[j].toUpperCase())
         readonly = "color:" + IBGCOLOR+"!important";
      else
         readonly = "color:black!important";
      cellvalue = "";

      if (ctype[j]=='c')
         af += "<td align=center >";
      else
         af += "<td >";
      if (bufferedhidden!='')
      {
          af += bufferedhidden; bufferedhidden = '';
      }
      switch(ctype[j])
      {
        case "a": case "A":

            af += "<textarea   style=" + readonly +"border:0   rows="+ffsize[j]+" cols="+ fsize[j] +" NAME="+Z+"_"+j;
            af += " onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+")  onchange=UT("+Z+","+j+") onkeypress=\"return allowenter("+ Z + ","+ j + ",event)\"></textarea>";
            break;
        case "i": case "I":

            af += "<iframe  frameborder=0 width="+fsize[j]+" height="+ ffsize[j] +" NAME=iframe"+Z+"_"+j;
            af += "></iframe><input type=hidden name=" + Z +"_"+j+">";
            break;
        case "b": case "B":
            af +=  "<table cellspacing=0 cellpadding=0 align=center><tr><td><textarea NAME="+Z+"_"+j +" style=visibility:hidden;width:1px;height:20px>" + mat[Z][j] +"</textarea></td><td id=\"cell" + Z +"_" + j +"\"><table cellpadding=0 cellspacing=0 border=1 style=border-collapse:collapse width=50><tr height=11><td width=25 align=center style=font-size:8px;background:" + beheading + " onclick=\"ST("+Z+","+j+");\">&bull;&bull;&bull;</td><td width=25  align=center style=font-size:8px;background-color:" + BBGCOLOR + " onclick=\"ST("+Z+","+j+");\">&bull;&bull;&bull;</td></tr><tr height=11><td width=25  align=center style=font-size:8px;background-color:" + TBGCOLOR + " onclick=\"ST("+Z+","+j+");\">&bull;&bull;&bull;</td><td width=25  align=center style=font-size:8px;background-color:" + TBGCOLOR + " onclick=\"ST("+Z+","+j+");\">&bull;&bull;&bull;</td></tr></table></td></tr></table>";
             
            break;
         case 'f':
           if (fmtcol < numCols && numRows>0 && mat[0][fmtcol]=='2')
            {
                needtranslator=true;   
            } 
           xx = formatmat(mat[Z][j],Z, j);
           af +=  "<table cellspacing=0 cellpadding=0 align=center><tr><td><textarea NAME="+Z+"_"+j +" style=visibility:hidden;width:1px;height:20px>" + mat[Z][j] +"</textarea></td><td id=\"cell" + Z +"_" + j +"\">" + xx + "</td></tr></table>";
            
           break;
        case "m": case "M":  case "t": case "n": case "T": case "N":

            if ( (ctype[j] == 'm' || ctype[j] == 'M') && mat[Z][j]!=nullvalue[j])
            {
               maxsize[j] = timeformat.length + 2;
               cellvalue = timestr2(mat[Z][j]);
            }
            else
            if ( (ctype[j] == 'n' || ctype[j] == 'N') && mat[Z][j]!=nullvalue[j])
            {   
               cellvalue = numberstr(mat[Z][j], ffsize[j]);
            }
            else if (mat[Z][j]!='')
            {
               cellvalue = mat[Z][j];
            }
            af +=  "<INPUT value=\"" + cellvalue +"\"  class="+ classrl +" style=\"" + readonly  + "\"  size=" +  fsize[j]  + " maxsize=" + maxsize[j] +" NAME="+Z+"_"+j;
            af += " onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+") onchange=\"UT("+Z+","+j+");maybenew("+Z+")\"  onkeypress=\"return allowenter("+ Z + ","+ j + ",event)\">";

            break;
       
       case "w":

           af +=  "<SELECT style=height:100px multiple style="+ readonly + "border:0;background-color:"+ TBGCOLOR +" NAME="+Z+"_"+j;
           af += " onchange=UT("+Z+","+j+") ";
           af +=" onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+")>";
           var zz = '';
           if (options[j] != null)
           for (var jj=0; jj < options[j].length; jj++)
              af += "<option value=\""+ options[j][jj] + "\"  >"+ captions[j][jj] +"</option>";
           af += "</SELECT>";
           break;

      case 'W':

           af +=  "<SELECT   style="+ readonly + "border:0;background-color:"+ TBGCOLOR +" NAME="+Z+"_"+j;
           af += " onchange=UT("+Z+","+j+") ";
           af += " onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+")>";
           af += "</SELECT>";
           break;

       case "s": case "S":
           cellvalue = ";";
           if (fsize[j]==null||fsize[j]=='')fsize[j]='10';
           numfsize = parseInt(fsize[j]);
           if(''+numfsize=='NaN'|| numfsize==0)
           {
              if (navigator.appName=='Netscape')
                 cellvalue += ";width:100px";

           }
           else
              cellvalue += ";width:" + (numfsize*10) + "px";

           af += "<SELECT   style="+ readonly + "border-wdith:1px;border-color:" + TBGCOLOR +";background-color:"+ TBGCOLOR + cellvalue +" NAME="+Z+"_"+j;
           af += " onchange=\"U("+Z+","+j+");UT("+Z+","+j+");maybenew("+Z+")\" ";
           af +=" onfocus=S("+Z+","+j+");fillopts(this,"+Z+","+j+",true)  >";
           var hit = false;

           if (options[j] != null)
           for (  jj=0; jj < options[j].length; jj++)
           if (Z < numRows && mat[Z][j]==options[j][jj])
           {
             hit = true;
             af += "<option value=\""+ options[j][jj] + "\" selected=true>"+ captions[j][jj] +"</option>";
           }

           if (hit==false)
           {
             if (mat[Z][j]!=null)
               af += "<option value=\""+ mat[Z][j] + "\" selected=true>"+ mat[Z][j] +"</option>";
           }
           af += "</SELECT>";

           break;

       case "r": case "R":
           af += "<table cellspacing=0 align=left cellpadding=0 width=="+ fsize[j] + "><tr>";
           for ( jj=0; jj < options[j].length; jj++)
           {
             if (options[j].length==1)
                  af +="<td width=12><INPUT type=radio   style=border:0;background-color:transparent NAME=1_"+j;
             else
                  af +="<td width=12><INPUT type=radio    style=border:0;background-color::transparent NAME="+Z+"_"+j;
             af += " onchange=UT("+Z+","+j+") ";
             if (options[j][jj] == mat[Z][j]) af += " checked ";
             if (options[j].length==1)
                  af +=" onfocus=S("+Z+","+j+") onclick=\"U("+Z+","+j+");UT("+Z+","+j+")\" value=\""+ options[j][0] + "\"></td><td>" + captions[j][jj] + "</td>";
             else
                  af +=" onfocus=S("+Z+","+j+") onclick=\"U("+Z+","+j+");UT("+Z+","+j+")\" value=\""+ options[j][jj] + "\"></td><td><nobr>"+ captions[j][jj].replace("/", "</td></tr><tr><td  width=12>") +"</nobr>&nbsp;</td>";
           }
           af += "</tr></table>";
           break;


       case "p": case "P":
         af +=  "<INPUT  type=password class="+ classrl + " style=" + readonly +" size="+fsize[j]+"  NAME="+Z+"_"+j;
         af += " onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+") onchange=UT("+Z+","+j+") >";
         break;



       case "c": case "C":
         af +=  "<INPUT  style=background-color:transparent   type=checkbox  NAME="+Z+"_"+j;
         af += " onchange=UT("+Z+","+j+") ";
         if (mat[Z][j] != null && mat[Z][j] != '0')
            af += " checked ";
         af += " onclick=\"valuechanged["+Z +"]=true\" ";
         af += " onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+")>";
         break;

       case "l":
           if (fsize[j] == '1' || fsize[j] == '2') fsize[j] = '3';
         af +=  "<INPUT class=underline  size="+fsize[j]+"  NAME="+Z+"_"+j;
         af += " onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+") onchange=UT("+Z+","+j+") onDblClick=openit1(this.value,"+Z+")>";
         break;

       case "L":
         x = extractfromm(mat[Z][j],true);
          if (x == '>>') af +=  "<input align=center ";
         else af +=  "<input align=left ";
         af +=  "    class="+classrl+" style=color:#0000AA size=" + (x.length < 2 ? 2:x.length) + "  NAME="+Z+"_"+j+" onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+") onchange=UT("+Z+","+j+") onClick=openit2("+Z+","+j+") value=\"" + x +"\">";
         break;

       case "h": case "H":
         af  = af.substring(0,af.length-5);
         af += "<INPUT  type=hidden  NAME="+Z+"_"+j+">";
         break;

       case "k": case "K":
          af +=  "<input type=button class=flat width=2 NAME="+Z+"_"+j+" onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+")  onClick=\"openit3("+Z+","+j+")\" value=\"&bull;&bull;&bull;\" >";
         break;

       case "u":
           hints[piccount] = "<img src=\"" + mat[Z][j] + "\">";
           af += "<INPUT  class="+classrl +" style=color:blue size=50 NAME="+Z+"_"+j;
           af += " onfocus=S("+Z+","+j+") onblur=\"U("+Z+","+j+")\"  onchange=\"UT("+Z+","+j+");updatepic(this.value,"+Z+","+j+")\" onkeypress=\"return allowenter("+ Z + ","+ j + ")\" ";
           af += " onMouseOver=\"showmyhint(" + piccount +  ")\" onMouseOut=\"hidemyhint()\">";
           piccount++;
          /* if (fsize[j]!="" && ffsize[j] != "")
               af += ("<img name=image" + Z+"_"+j+" src=\"" + mat[Z][j] + "\" width=" + fsize[j] + " height=" + ffsize[j] + " alt=\"" + mat[Z][j] +  "\" >");
           else if (fsize[j]!="")
              af += ("<img name=image" + Z+"_"+j+"  src=\"" + mat[Z][j] + "\" width=" + fsize[j] + " alt=\"" + mat[Z][j] + "\" >");
           else if (ffsize[j]!="")
              af += ("<img name=image" + Z+"_"+j+"  src=\"" + mat[Z][j] + "\" height=" + ffsize[j] + " alt=\"" + mat[Z][j] + "\" >");
           else
              af += ("<img name=image" + Z+"_"+j+" src=\"" + mat[Z][j] + "\" alt=\"" + mat[Z][j] + "\" >");
           */
           break;
       case "U":
         af += "<INPUT  type=hidden NAME="+Z+"_"+j+">";
         if (fsize[j]!="" && ffsize[j] != "")
            af += ("<img name=image" + Z+"_"+j+" src=\"" + mat[Z][j] + "\" width=" + fsize[j] + " height=" + ffsize[j] + "  >");
         else if (fsize[j]!="")
            af += ("<img name=image" + Z+"_"+j+" src=\"" + mat[Z][j] + "\" width=" + fsize[j] + "  >");
         else if (ffsize[j]!="")
            af += ("<img name=image" + Z+"_"+j+" src=\"" + mat[Z][j] + "\" height=" + ffsize[j] + "   >");
         else
            af += ("<img name=image" + Z+"_"+j+" src=\"" + mat[Z][j] + "\"  >");
         break;
       default:

          if ( j1 < numCols - 1  && (ctype[positionr[j1+1]]=='k' || ctype[positionr[j1+1]]=='K' ) )
             af +="<nobr>";
         af += "<INPUT  class="+classrl +" style=color:"+IBGCOLOR + " size="+fsize[j]+ " NAME="+Z+"_"+j;
         af += " onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+") readonly  onkeypress=\"return allowenter("+ Z + ","+ j + ")\">";
      }
      af +=  "</TD>";
   }
   document.write(af + "</TR>");
}

if (hasfoot)
{
   af = "<TR bgcolor=#FFFFC0  >";
   if (!viewonly) af += "<TD><INPUT type=hidden name=total></TD>";
   if (hasroworder) af += "<TD align=right>" +  NUMROWS  +"</TD>";
   bufferedhidden = "";
   j1=0;
   for (;  j1 < numCols; j1++)
   {
      j = positionr[j1];
      if (ctype[j].toLowerCase()=='h')
         bufferedhidden += "<INPUT  type=hidden  NAME=foot"+j+">";
      else break;
   }

   for (;  j1 < numCols; j1++)
   {
      j = positionr[j1];

      if (dtype[j] && ctype[j]!='M' && ctype[j]!='m')
         classrl = "right";
      else
         classrl = "left";

      var tt = 2;
      if (fsize[j]!=null&& fsize[j].replace(/[0-9]/g,'')=='')
          tt = parseInt(fsize[j]);

      var maxsizej = 2*tt;
      if (  ctype[j] == 'm' || ctype[j] == 'M' )
      {
         maxsizej = timeformat.length + 2;
      }
      af += "<td>";
      if (bufferedhidden!='')
      {
         af += bufferedhidden;
         bufferedhidden = "";
      }
      switch(ctype[j])
      {
         case "h": case "H":
         af = af.substring(0, af.length-5) + "<input name=foot" + j + " type=hidden value=\"\">";
         break;
         default:
         af +=  "<INPUT class=right readonly style=background-color:#FFFFC0;"   +" size="+tt+" NAME=foot"+j+" maxsize=" + maxsizej +" value=\"\">";
      }
      af += "</td>";
   }
   document.write(af + "</TR>");
}


document.write("</TABLE></td></tr></table>" + round2);

if (hasfoot == false)
{
if (title != null && title.length>0)
  document.write("<font color=" + IBGCOLOR +">" + textmsg[194]+"</font>:<span id=rowtotal>" + numRows +"</span><input type=hidden  name=total size=5 value="+numRows + ">");
else
   document.write( " <input type=hidden name=total size=5 value="+numRows +">"); 
}

document.write( "</form></td></tr><tr><td ALIGN=center>"); 

document.write( "<form rel=opener name=thisform  method=POST onsubmit=\"return formstr()\" target=savewindow action=Save  >\n"); 

 document.write( "<input type=HIDDEN   name=subdb value=\"" + subdb + "\">");
document.write( "<input type=HIDDEN   name=rdap value=\"" + rdapname + "\">");
document.write( "<input type=HIDDEN   name=rsacode value=\"" + rsaenccode + "\">");
 

document.write( "<input type=HIDDEN   name=query>"); 
document.write( "<input type=HIDDEN   name=title>"); 
document.write( "<input type=HIDDEN   name=id>\n"); 
document.write( "<input type=HIDDEN   name=wcds>\n<table border=0>\n<tr><td>\n");
 
document.write(webserviceAlloptions);
document.write(webserviceAllbuts.replace(/<br>/g,''));
 
//if (exbut.indexOf('p')<0)
   document.write( "<input  class=GreenButton " + "  type=button value="+textmsg[16] +"   ONCLICK=cl()>"); 
if (nextpageurl!='')
    document.write("<input type=button class=GreenButton  "   +"  value=\"" + textmsg[795] + "\"  onclick=\"nextpage()\">");
 if (exbut.indexOf('c')<0)
   document.write( "<input  class=GreenButton "   +"  type=button value=\""+textmsg[18] +"\" ONCLICK=close2()>");
 
document.write( "</td></tr></table></form> </td></tr></table>  "); 
document.write( "<div id=anchor name=anchor style=\"width:1px;height:1px;float:right\"><!----></div>");
theight = (numRows + (hasnew?6:0) )*30+200;
makesend();
if (mm>0)makeasso();
function resizeCont(){}
 
var hit = false;
var rowchecked = -1;
var tmpi = existing.indexOf("~");
colsfed = existing.substring(0,tmpi);
 
if (colsfed.replace(/[0-9|,|:|\-]/g,'')!='')
{
   colsfed = '';
}
else
   existing = existing.substring(tmpi+1);
  
 
function checkall1(c)
{
    checkall();
    for (Z=0; Z < numRows; Z++)
      checkrs[Z] = c.checked?'1':'0'; 
}
var checkrs = new Array();  
for (Z=0; Z < numRows; Z++)
{
  checkrs[Z] = '0'; 
  if ( (","+existing + ",").indexOf(","+mat[Z][0]+",") >= 0 ) 
  {
      hit =true;
      if (numRows>1) 
      {
          document.form1.checkbox[Z].checked = true;
          checkrs[Z] = '1';
      }
      else 
      {
          document.form1.checkbox.checked = true;
          checkrs[0] = '1';
      }
      rowchecked = Z; 
  }
}

 

var rolesInt = parseInt(existing);
 
if (hit==false && existing !='' && '' + rolesInt == existing && dtype[0])
{
 
    for (Z=0; Z < numRows; Z++)
    {

      if (existing == mat[Z][0] || rolesInt > 0 && parseInt(mat[Z][0])>0 && (rolesInt & parseInt(mat[Z][0])) >  0 )
      {
        hit =true;
        if (numRows>1) 
             document.form1.checkbox[Z].checked = true;
        else 
             document.form1.checkbox.checked = true;
         rowchecked = Z;
      }
      
    }
} 


function unique(Z)
{
  if (numRows <= 1 || exbut.indexOf('m')<0) return;
  if (  rowchecked != -1 && Z != rowchecked && document.form1.checkbox[Z].checked)
  {  
      document.form1.checkbox[rowchecked].checked = false;
      rowchecked = Z;
  }
  else if ( document.form1.checkbox[Z].checked == false)
  {
      rowchecked = -1;
  }
  else if ( document.form1.checkbox[Z].checked)
     rowchecked = Z;
} 

function recordch(Z,chc)
{
    if (chc.checked)
    {
       checkrs[Z] = '1'; 
    }
    else 
        checkrs[Z] = '0';
}
function maybenew(j)
{
    f1.checkbox[j].checked = true;
    checkrs[j] = '1'; 
}
 
function copy2()
{
     var openme = opener;
     
     if (opener==null || ! onmydomain(opener) || typeof(opener.getPassed)=='undefined')
         openme = parent.frames[0];
     else if (parent!=window)
     {    
         openme = parent.opener;
     } 
     if (openme==null || typeof(openme.getPassed)=='undefined')
     { 
         return;
     }
   
     var binary = false;//(exbut.indexOf('t') >= 0);
     var kk = 0;
     for (; kk < 3 && kk < NUMROWS; kk++)
     {
        var kkv = retrv(kk,0);
        if (isNaN(kkv)) {kk=-1; break;}
        else if (parseInt(kkv)>0){break;}
     }
      
     if (kk >= 0 && kk < 3 )
     {
        for (; kk+1 < NUMROWS; kk++ )
        {
           kkv = retrv(kk,0);
           var kkv1 = retrv(kk+1,0);
           if(isNaN(kkv) || isNaN(kkv1))
              break;
           if (parseInt(kkv1) % (parseInt(kkv)*2)!=0)
              break;
        }
         
        if (kk+1==NUMROWS) binary = true;
     }
      
     if (colsfed=='')
     {
            var ids = "";
            var idn = 0;
             
            for (var i = 0; i < NUMROWS;i++)
            {
              if (checkrs[i] != null && checkrs[i] == '1' )
              {
                 if (binary)
                 {
                     idn += parseInt(retrv(i,0));
                 }
                 else
                 {
                     if (ids !="") ids += ",";
                     ids += retrv(i,0);
                 }
              }
            }
            if ( binary)
            {
               if (retrv(0,0)=='-1' && f1.elements[1].checked)
                  ids = '-1';
               else if (retrv(1,0)=='0' && f1.elements[2].checked)
                  ids = '0';
               else
                  ids = "" + idn;
            }
            
            openme.getPassed(ids);
     }
     else
     { 
           var xy = colsfed.split(",");
           for (i = 0; i < NUMROWS;i++)
           {
              if (checkrs[i] != null && checkrs[i] == '1' )
              {
                 for (var j = 0; j < xy.length; j++)
                 {
                    if (xy[j].indexOf(":") >= 0)
                    {
                        var x = (xy[j].split(/:/))[0];
                        var y = (xy[j].split(/:/))[1];
                    }
                    else
                    {
                        x = xy[j].charAt(0);
                        y = xy[j].substring(1); 
                    }  
                    var ix =  parseInt(x);
                    var iy = parseInt(y);
                    var z = retrv(i, ix);
                   
                    if (x=='0' && y=='0') continue;
                 
                    openme.getPassed1(iy, z );
                 }
                 
                 if (colsfed == '')
                     openme.getPassed2(retrv(i,0));
              }
           }
           if ( typeof(openme.updateFoot) != 'undefined')
               openme.updateFoot(1);
       }
       tinywin = 'w' + tstmp;
       //setaction(1);
        
       if (parent == window)
          close();
       else if (parent!=openme && openme.parent!=parent) 
            parent.close();
}

function cl()
{ 
    document.thisform.wcds.value = '';
    document.thisform.target = 'w' + tstmp;
    tinywin = 'w' + tstmp;
    onsaved = 'copy2()';
    setaction(1);
    
    if (document.thisform.wcds.value == '')
    {
        copy2();
    }
    
}

function savebeforego()
{
    if (numRows < NUMROWS && typeof setaction == 'function' )
    {setaction(1);}
}
 
onbegin += ";window.onbeforeunload = savebeforego;fitme();";
function close2(){window.onbeforeunload = null;close();}
resizebut(document.thisform);
whichcell = function(Z,j)
{
   return document.getElementById("cell" + Z + "_" + j);
} 

 



