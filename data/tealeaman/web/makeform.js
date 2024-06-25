/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/

var numIframes = 0;
datapresentformat = 'DataForm';
var colspan = (numCols > 0 )?2:1;
var ecount = 0;
var securitylevel = 0;
var elexy = new Array(numCols);
document.write(unifontstyle(font_size)); 
document.write("<style>.img-shadow {float:left;background: url(image/trans-shadow.png) no-repeat bottom right;}\n");
document.write(".img-shadow img {display: block;  position: relative;  padding: 5px; background-color: #fff;  border: 1px solid #cecece; margin: 0px 6px 6px 0px;}</style>");
document.write("<table border=0 align=center cellspacing=0 cellpadding=0 id=\"maintbl\">");
if (title != null && title.length>0) 
{
   var tit = unititle(title,'outset2');
   if (parent.frames[0]!=window) tit = tit.replace(/<img[^>]*>/,"").replace(/<td[^>]*><.td>/,"");
       
   document.write("<tr><td>");
   if (title.indexOf("<img ")>=0)
   {
      var imgintitle=title.replace(/(<img [^>]*>).*/,'$1');
      title = title.replace(/<img [^>]*>/,'');
      document.write(title.replace(/<img [^>]*>/,imgintitle));
   }
   else
      document.write(tit);
   document.write("</td></tr><tr height=3><td></td></tr>");
}
var  div1 =  document.getElementById('titlediv');
if(div1!=null)
{  
    div1.onmouseover=function(){ if (typeof(showmyhintstr) != 'undefined') showmyhintstr(ZQ[0]);};
    div1.onmouseout=function(){hidemyhint();};
}
 
document.write("<tr><td align=center><form rel=opener name=form1 style=\"margin:0px 0px 0px 0px\"  >");
var formalign="center"; 
if (exbut.indexOf("l")>=0) formalign="left";
if (exbut.indexOf("r")>=0) formalign="right";
document.write(round1("") + "<TABLE class=outset3 align=" + formalign +" width=100%   cellpadding=3 cellspacing=1  border=0>");

var buttons = ""; 
var rsstr = ""; 
var hides = '';
 
//var myHint = new THints (HINTS_CFG, hints);
var Lstr = "", borderstr;
var imagecount = 0;
 
var pictureindex = -1;
for (var j =0; j < numCols; j++) 
{ 
   if (ctype[j]=='u' || ctype[j]=='U' )
   {pictureindex = j;break;}
}

function removebut(s,t)
{
    var k = s.indexOf(t);
    if (k <0) return s;
    var i = k;
    while (i>=0 && s.charAt(i)!='<') i--;
    while (k < s.length && s.charAt(k) !='>')k++;
     
    if (i == 0) return s.substring(k+1);
    return s.substring(0,i) + s.substring(k+1);
}
function showupk(j)
{
    return  ctype[j].toLowerCase() =='k';  
     
}
function showup(j)
{
    return ctype[j].toLowerCase() != "h" 
    && ctype[j].toLowerCase() !='k'  
    && (ctype[j] != "L" || numRows>0 && mat[0][j]!=null && mat[0][j].indexOf(">>")>=0 );
}
var hc = 0;
function invokeselect(j)
{
   passedRow = counter;
   passedCol=j;
    
   openit3(counter,j);
}
 
function printhidden(j)
{ 
      hc -= font_size + 10;
      if (ctype[j]=='k')
      {
         elexy[j] = ecount++;
         document.write("<input type=button  style=\"border:1px #aaa outset;vertical-align:text-top;font-size:17px;color:purple;line-height:20px;height:20px;cursor:pointer\"  NAME="+fields[j]+" value=\"&bull;&bull;&bull;\" onClick=\"invokeselect(" + j +")\">");
      }  
      else if (ctype[j]=='L'  && (numRows==0 || mat[0][j]==null || mat[0][j].indexOf(">>")<0 ))
      {
          elexy[j] = ecount++;
          document.write("<input   type=\"hidden\" value=\"\"  NAME="+fields[j] +">");
          Lstr += "<input type=button class=GreenButton value=\""+labels[j]+"\"  "
         + butstyle(font_size) +";background-color:blue;cursor:pointer  NAME="+fields[j]+" onClick=openit2(counter,"+j+")>";
      }
      else if (ctype[j].toLowerCase()=='h')
      {
          elexy[j] = ecount++;
          document.write("<input    type=\"hidden\" value=\"" + defaultRecord[j] +"\"  NAME="+fields[j] +">");
      }
}
 
var bufferedhidden = "";
var futurej,  j1=0;
for (; j1 < numCols; j1++)
{
    j = positionr[j1];
    if (ctype[j]=='L' &&(numRows==0 || mat[0][j]==null || mat[0][j].indexOf(">>")<0 ))
    {
          elexy[j] = ecount++;
          bufferedhidden += ("<input  type=hidden value=\"\"  NAME="+fields[j] +">");
          Lstr += "<input type=button class=RedButton value=\""+labels[j]+"\"  "
         + butstyle(font_size) +";background-color:blue;cursor:pointer  NAME="+fields[j]+" onClick=openit2(counter,"+j+")>";
    }
    else if (ctype[j].toLowerCase()=='h' || ctype[j].toLowerCase()=='k')
    {
          elexy[j] = ecount++;
          bufferedhidden += ("<input  type=hidden value=\"" +  defaultRecord[j]  +"\"  NAME="+fields[j] +">");
    }
    else break;
}
  
 
for (; j1 < numCols; j1++)
{ 
   j = positionr[j1];
   
   if (ctype[j] == null || ctype[j]=='')
      ctype[j] = "T";
   
   var str = null; 
    
      if (j1==0 || fold[positionr[j1-1]])
      {
         document.write( "<TR>");
         maxfinr1 = 0;
      }
      else
      {
         maxfinr1++;
      }
     
      str = labels[j].replace(/([a-z])([A-Z])/, "$1&nbsp;$2");//.replace(/([a-z])([A-Z])/, "$1<br>$2").replace(/([a-z])([A-Z])/, "$1&nbsp;$2");
      if (fields[j].indexOf("nolabel") != 0)
      {
            str = str.substring(0,1).toUpperCase() + str.substring(1);
              
            if (str.length > 28) 
            {   
               // str = str.replace(/&nbsp;/,'</nobr><br><nobr>');
            } 
            if (j == 0)
            document.write( "<td align=left VALIGN=top width=" + Math.floor(font_size*20/3)
                    + "><table cellspacing=1 cellpadding=3 width=100%  >"
                    + "<tr width=100% ><td align=left  width=100% style=\"background:" + gradientbg  + ";border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px\""
                    + "><span style=\"text-shadow:-1px -1px #060606;color:#DDCC11;width:" + Math.floor(font_size*20/3-6) +"px;overflow:hidden\" onMouseOver=\"showmyhint("
                    + j  + ",1)\" id=\"XXX\"  onMouseOut=\"hidemyhint()\" ><nobr><b>" + str
                    + "</b></nobr></span></td></tr></table>");
            else
                 document.write( "<td align=left VALIGN=top width=" + Math.floor(font_size*20/3)
                    + "><table cellspacing=1 cellpadding=3 width=100%  >"
                    + "<tr width=100% ><td align=left  width=100% style=\"background:" + gradientbg.replace(/\(/,'(to right,') + ";border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px\""
                    + "><span style=\"text-shadow:-1px -1px #060606;color:#DDCC11;width:" + Math.floor(font_size*20/3-6) +"px;overflow:hidden\" onMouseOver=\"showmyhint("
                    + j  + ",1)\"  " + (ctype[j]=='i'?('onclick="updateiframe('+j +')"'):'') +  "  onMouseOut=\"hidemyhint()\" ><nobr><b>" + str
                    + "</b></nobr></span></td></tr></table>");
            
            if(1==2 && (ctype[j] == 'b' || ctype[j] == 'a'))
            {
                document.write( "&nbsp;&nbsp;<span style=\"border:1px #b0b0b0 outset;background-color:" 
                        + IBGCOLOR + ";color:white;font-size:14px;cursor:pointer\" onclick=togrids(this," + j + ")>" + textmsg[1378] + '</span>');
            }
      }
      else
      {
           document.write( "<td align=left><table><tr><td align=left>&nbsp;</td></tr></table>");
      }
      document.write("</td><td align=left   ");
       if (fold[j] && maxfinr-maxfinr1>0)
          document.write(" colspan=" + (2*(maxfinr-maxfinr1)+1)  );
      document.write("><table border=0 cellpadding=0 cellspacing=0 width=100% ><tr>");
      if (bufferedhidden!='')
      {
         document.write("<td  align=left>" + bufferedhidden +"</td>");
         bufferedhidden = '';
      }
      document.write("<td  align=left id=\"tdcell" + j +"_0\"  ");
      if (fmtcol < numCols && numRows>0 && mat[0][fmtcol]=='2' && (ctype[j]=='f' || ctype[j]=='H'))
      {
        
         needtranslator=true;   
      }  
      x = ctype[j].toLowerCase();
      if (x!='w') document.write(" width=99% ");
       document.write(">");
      
    
    if (ctype[j]=='L')
   {
      
   }
   else   if (x=='a'|| x=='b' || x=='i' || x=='n' || x=='u' || x=='w')
   {
         if (fsize[j] == null || fsize[j] == '')
         {
             if (x == 'n')
             {fsize[j] = "10";ffsize[j]  = "0";}
             else if (x=='u')
             {
                fsize[j] = "";
                ffsize[j] == "";
             }
             /*else if (x=='w')
             {
               // fsize[j] = "4";
               // ffsize[j] == "";
             }*/
             else
             {fsize[j] = "30";ffsize[j]  = "5";}
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
                else if (x=='b')
                   ffsize[j] = "28";
                else
                   ffsize[j] = "5";
             }
         }
    }
    else if (x == 'm' && (fsize[j]==null||fsize[j]==""))
       fsize[j] = timeformat.length;
    else if (x == 'l' && (fsize[j]==null || fsize[j]==""))
       fsize[j] = '3';
     
    if ((ctype[j]=='t' || ctype[j]=='u' || ctype[j]=='p' ) &&  maxsize[j]  < parseInt(fsize[j]) )
        maxsize[j]=parseInt(fsize[j]); 

    if (dtype[j]) 
        classrl = "right"; 
    else 
        classrl = "left";

    if (ctype[j] == ctype[j].toUpperCase())
    {     
        readonly = "border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;border:0;background-color:transparent;color:" + IBGCOLOR;
    }
    else if (ctype[j]=='c'||ctype[j]=='r')
    {   
        readonly =  "border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;color:black";
    }
    else 
    {   
        readonly = ";border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;border:1px #b0b0b0 solid!important;background-color:" + TBGCOLOR +  ";color:black;" ;
    }

   switch(ctype[j]) 
   { 
      
      case 'a': case 'A':
       
         hc += parseInt(ffsize[j])*font_size;   //cols="+ fsize[j]+"   
        // document.write( "<table border=1 cellspacing=0 cellpadding=0><tr  valign=bottom><td valign=bottom >");
         document.write( "<textarea   onkeydown=\"if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}\"  wrap=soft style=\"width:99%;" + readonly +   "\" rows="+ffsize[j]+" name="+fields[j] );
         document.write( " onfocus=\"large(this,counter,"+j+")\"");
          document.write( " onkeypress=mkstrike(this,event)");
         document.write( " onblur=alarge(this,"+j+");");
         document.write( " onchange=UT(counter,"+j+")  ></textarea>");
        // document.write( "</td></tr><tr height=2><td id=barfather" + j +" valign=top ><div   id=horbar" +  j +" style=\"background:url(image/horbar.jpg);cursor:s-resize;height:2px;width:100%;margin:0px 0px 0px 0px;border:0px\" ></div></td></tr></table>\n");
         break;
       
      case 'i': case 'I':
         hc += parseInt(ffsize[j])-25;  
         document.write("<iframe marginwidth=0 marginheight=0 align=left frameborder=0 width="+fsize[j]+" height="+ffsize[j]+" name=iframe"+j +"></iframe><input type=hidden name="+fields[j]+">"); 
         numIframes++;
         break; 
      case "m":
      maxsize[j] = timeformat.length + 2; 
      document.write( "<input value=\"01/01/1970 00:00\" style=\"" + readonly +"\" MAXSIZE=" + maxsize[j] +" SIZE="+fsize[j]+" name="+fields[j] );
      document.write( " onfocus=S(counter,"+j+")"); 
      document.write( " onblur=U(counter,"+j+")");
      
      document.write( " onchange=UT(counter,"+j+") >\n");
      break;
      
      case "t": case "n":
      if (fields[j].toLowerCase().indexOf('attach') == 0)
      {
          document.write( "<input  type=hidden name="+fields[j]  +" onchange=UT(counter,"+j+")  ><span style=color:blue;cursor:pointer onclick=\"attachmore("  + j + ")\" >[+]</span><span id=theattach"+ j + " style=color:blue;cursor:pointer onclick=\"ResizeUploaded.attachman(ele(0," + j +"))\"></span>");
      }
      else 
      {
          var xx = fsize[j];
          if (xx < 6) xx = 6;
          document.write( "<input  style=\"" + readonly +"\" MAXSIZE=" + maxsize[j] +" SIZE="+ xx +" name="+fields[j] );
          document.write( " onfocus=S(counter,"+j+")"); 
          document.write( " onblur=U(counter,"+j+")");
          document.write( " onchange=UT(counter,"+j+") onkeypress=\"return allowenter1("+ j + ",event)\">\n");
      }
      break;
  
      case 'p': case 'P':
      document.write( "<input style=\"" + readonly +"\" MAXSIZE=" + maxsize[j] +" type=password SIZE="+fsize[j]+" NAME="+fields[j] );
      document.write( " onfocus=S(counter,"+j+")"); 
      document.write( " onblur=U(counter,"+j+") ");
      document.write( " onchange=UT(counter,"+j+")   ONKEYDOWN=\"return mstrength(this,event)\" >&nbsp;<div id=strength style=\"display:inline;width:100px !important;color:#eee;overflow:visible;font-size:" + font_size + "px;height:" + (font_size+4) + "px;margin:2px 0px -2px 0px;font-weight:700;padding:3px 3px 3px 3px\" ></div>\n");
      break; 

      case 's': case 'S':
      document.write( "<SELECT style=\"" + readonly +"\"  name="+fields[j] ); 
      document.write( " onfocus=S(counter,"+j+")"); 
      document.write( " onblur=U(counter,"+j+")");
      document.write( " onchange=UT(counter,"+j+")>");
     // if (mandatory[j]==false)
      {
          document.write( "<option value=\"\"  selected ></option>");
      }
      if (options[j]!=null)
      {
          
         for (var jj=0; jj < options[j].length; jj++)
         {
            if (captions[j][jj]==null)
                ;
            else if (captions[j][jj].indexOf('...')>=0 && captions[j][jj]!=options[j][jj])
                document.write("<option value=\""  +(captions[j][jj]+ options[j][jj]).replace(/"/g,'\\"') + "\">" + textmsg[925] + "...</option>");
            else if (options[j][jj].indexOf('...')>=0)
                document.write("<option value=\"" + options[j][jj].replace(/"/g,'\\"') + "\">" + textmsg[925] + "...</option>");
            else
                document.write("<option value=\"" + options[j][jj].replace(/"/g,'\\"') + "\">" + captions[j][jj] + "</option>");
        
         }
      
      }//if (ctype[j]=='s')
        // document.write("<option value=\"" + textmsg[925] + "...\">" + textmsg[925] + "...</option>");
      document.write("</SELECT>");
      break; 

      case 'w':
      if (fsize[j]=='') fsize[j] = '20';   
      hc += 100;  
      x = (parseInt(fsize[j])*8);
      if (x < 100) x = 100;
      document.write( "<SELECT multiple style=\"height:100px;" + readonly + "width:" + x + "px\"  name="+fields[j] ); 
      document.write( " onfocus=S(counter,"+j+")"); 
      document.write( " onblur=U(counter,"+j+")");
      document.write( " onchange=UT(counter,"+j+") size=4>");
      for (jj=0; jj < options[j].length; jj++) 
         document.write("<option value=\"" + options[j][jj].replace(/"/g,'\\"') + "\">" + captions[j][jj] + "</option>"); 
      document.write("</SELECT>"); 
      break;

      case 'W':
      
      document.write( "<SELECT style=\"" + readonly +"\"   name="+fields[j] ); 
      document.write( " onfocus=S(counter,"+j+")"); 
      document.write( " onblur=U(counter,"+j+")");
      document.write( " onchange=UT(counter,"+j+")>\n");
      document.write("</SELECT>"); 
      break;
      
      case 'f': case "M":
      case "T": case "N":
         if (fields[j].toLowerCase().indexOf('attach') == 0)
         {
             document.write( "<span id=theattach"+ j + " style=color:blue;cursor:pointer></span> ");
         }
         
      break;

      case "b":
         
         document.write(Innergrid.makeinnertable(defaultRecord[j], 0, j, true));
          
      break;
       
      case "B":
         document.write(Innergrid.makeinnertable(defaultRecord[j], 0, j, false));
      break;

      case 'r': case 'R':
     
      for (jj=0; jj < options[j].length; jj++)
      {
          document.write( "<input  style=\"background-color:transparent;cursor:pointer\" type=radio   name="+fields[j]      ); 
       
          document.write( "  onfocus=S(counter,"+j+") onblur=U(counter,"+j+")  onclick=UT(counter,"+j+") value=\"" + options[j][jj].replace(/"/g,'\\"') + "\"><nobr>" + captions[j][jj].replace("\/$","<br>") +"</nobr>");
      } 
      break; 
       
      case 'c': case 'C':
      document.write("<input  style=\"background-color:transparent;width:" + font_size +"px;cursor:pointer\" type=checkbox NAME="+fields[j] );
      if (ctype[j]=='C') document.write(" readonly   ");
      document.write( " onfocus=S(counter,"+j+")"); 
      document.write( " onblur=U(counter,"+j+")");
      document.write( " onclick=\"valuechanged[counter]=true\"");
      document.write( " onchange=UT(counter,"+j+") >");
      break; 

      case 'l':
          if (fsize[j] == '1' || fsize[j] == '2') fsize[j] = '3';
      document.write("<input class=dunderline SIZE="+fsize[j]+" NAME="+fields[j] );
      document.write( " onfocus=S(counter,"+j+")"); 
      document.write( " onblur=U(counter,"+j+") ");
      document.write( " onchange=UT(counter,"+j+") onDblClick=openit1(this.value,counter)>");
      break; 

      //case 'k':  case 'K':
      // document.write("<input style=background-color:"+DBGCOLOR+";color:"+IBGCOLOR + ";font-weight:700;border:0 readonly size=2 NAME="+fields[j]+" value=\"???\" onClick=\"passedCol="+j+";passedRow=counter;openit1(mat[counter]["+j+"]+'&existing='+encodeURIComponent(retrv(counter,"+(j-1)+")),counter)\">"); 
      //break; 

      //case 'h':  case 'H':
      //document.write("<input  type=hidden  NAME="+fields[j] +">");
      //break; 

      case 'L':
      
      if ( numRows >0 && mat[0][j]!= null && mat[0][j].indexOf(">>") >=0 )
          document.write("<input  class=left style=color:#0000AA size=10 NAME=" + fields[j] + "  onClick=openit2(counter,"+j+")>");
       
      break;

      case "u":
           document.write( "<input type=text  style=\"" + readonly +"width:200px !important\"   maxsize=" + maxsize[j] +" name="+fields[j] );
           document.write( " onfocus=S(counter,"+j+");selffit(this)");
           document.write( " onblur=U(counter,"+j+") ");
           document.write( " onchange=\"getImageByName('image"+j +"').src=this.value;UT(counter,"+j+")\" >");
           document.write( "</td><td align=left><div  style=\"border:1px #aaa outset;vertical-align:top;font-size:17px;color:purple;height:20px;line-height:20px;padding:0px 0px 0px 0px;cursor:pointer\"  id=picpik"+fields[j]+"  onClick=\"uploadphoto(" + j +")\">&bull;&bull;&bull;</div></td><td align=left></td></tr>");
            
           document.write( "<tr><td align=left><span class=\"img-shadow\"><img name=image"+j +" src=\"\"");
           if (fsize[j]!="" && ffsize[j] != "")
              document.write( " width=" + fsize[j] + " height=" + ffsize[j]);  
           else if (fsize[j]!="")
              document.write( " width=" + fsize[j]); 
           else if (ffsize[j]!="")
              document.write( " height=" + ffsize[j]); 
           //document.write( " alt=\"" + mat[0][j] +"\"");
           document.write( "></span>");  
              
           break;
       case "U":
       
         document.write( "<input name="+fields[j]+" type=hidden></td><td align=left></td><td align=left></td></tr><tr><td align=left><span class=\"img-shadow\"><img name=image"+j  +" src=\"\"");
           if (fsize[j]!="" && ffsize[j] != "")
              document.write( " width=" + fsize[j] + " height=" + ffsize[j]);  
           else if (fsize[j]!="")
              document.write( " width=" + fsize[j]); 
           else if (ffsize[j]!="")
              document.write( " height=" + ffsize[j]); 
           document.write( " ></span>");
             
           break;
   }
     
    document.write( "</td><td   align=left  id=\"tdcell" + j +"_1\"  valign=top>");
    if (ctype[j] =="w")
          document.write( "(" + textmsg[783] +")");
    
    if (ctype[j]=='f'|| ctype[j]=='T' || ctype[j]=='M'|| ctype[j]=='N'  )
    {
       document.write("<input type=\"hidden\"  name=\""+fields[j] +"\" value=\"\">");
    }
    else if (ctype[j]=='b' || ctype[j]=='B')
    {
       document.write(  "<input type=\"text\"  onfocus=\"Innergrid.goto1st(counter," + j 
                + ")\"  onkeypress=\"return Innergrid.dotabenter(event )\" onblur=\"Innergrid.U(this,counter," + j 
                + ")\" style=\"width:1px;visibility:hidden\" name=\""
               +fields[j] +"\" value=\"\">"
               );  
    }
    futurej  = j1;
    if (futurej+1 < numCols  && showupk(positionr[futurej+1]) )
    {
      futurej++;
      printhidden(positionr[futurej]);
    }
    document.write( "</td><td align=left valign=top>");
    //futurej  = j1;
    while (futurej+1 < numCols  && showup(positionr[futurej+1])==false && !showupk(positionr[futurej+1]))
    {
      futurej++;
      printhidden(positionr[futurej]);
    }

    if (mandatory[j])
       document.write("<span style=color:red;float:right>*</span>");
    else   document.write(" ");
    document.write( "</td></tr>");
    if (!ismobile() && (ctype[j] == 'a'||ctype[j]=='A' || ctype[j] == 'b'||ctype[j]=='B'))
    {
        document.write( "<tr height=2><td id=barfather" + j +" valign=top ><div   id=horbar" +  j +" style=\"background:url(image/horbar.jpg);cursor:s-resize;height:2px;width:100%;margin:0px 0px 0px 0px;border:0px\" ></div></td><td colspan=2></td></tr>");
    }       
                                            
    document.write( "</table></TD>");
    if (fold[j])
    {
       document.write("</tr>");
    }
    j1 = futurej;
    
}   
if (bufferedhidden!='')
{ 
    document.write( "<tr><td align=left>" + bufferedhidden + "</td></tr>");
}
document.write( "</table>" + round2 +"</form></td></tr>");
 
for (j=0; j < numCols; j++)
{
    var xm = getImageByName('image'+j);
    if (xm!=null) hc += xm.height;
} 

if (mm > 0 )
{
    makeasso();
} 
//document.write( "</center>");
document.write("<tr><td  style=\"padding:3px 3px 3px 3px\" ><table cellspacing=0 id=contbutt cellpadding=0 class=outset1 align=center width=100% >"); 
if (numRows == 0 && hasnew == false && hasupdate == false)
{
    window.onload = function()
    {
        let copyr = document.getElementById('copyrights');
        if (copyr!=null) copyr.parentNode.removeChild(copyr);
    }
    document.write("<tr><td align=left width=280> " + textmsg[351] +"</td></tr>"   );
    theight = 160; 
} 
else 
{
    if (typeof(onlinetoolinitial)!='undefined' )
    {
        if (onlinetoolinitial.indexOf(";Edit;") < 0)
        onlinetoolinitial += ";" + textmsg[1378] + ";tealeaman;" + textmsg[1378] + "HTML;Edit;findrep.js;wyewyg(source_a)";
        if (onlinetoolinitial.indexOf(";LaTex;") < 0)
        onlinetoolinitial += ";LaTex;tealeaman;LaTex toolbar;LaTex;findrep.js;showlatexpanel(content_a,this)"; 
        if (onlinetoolinitial.indexOf(";Find;") < 0)
         onlinetoolinitial += ";"   + textmsg[1561] + ";tealeaman;" + textmsg[1561] + ";Find;findrep.js;findstrintextarea2(Content_a,Pattern_t);"
            + textmsg[1562] + ";tealeaman;" + textmsg[1562] + ";Find;findrep.js;replacestrintextarea2(source_a,NewString_t)";
    }
    
    document.write("<tr><td align=center>");
    if (numattachfiled > 1)
    webserviceAllbuts = webserviceAllbuts.replace(/this.form.localpathtoupload.click\(\)/,"myprompt(textmsg[345]+'[+]')");
   // webserviceAllbuts = removebut(webserviceAllbuts,textmsg[1378]);webserviceAllbuts = removebut(webserviceAllbuts,"wyewyg");
    
    webserviceAllbuts = removebut(webserviceAllbuts,textmsg[1561]);webserviceAllbuts = removebut(webserviceAllbuts,"findstrintextarea2");
    
    webserviceAllbuts = removebut(webserviceAllbuts,textmsg[1562]);webserviceAllbuts = removebut(webserviceAllbuts,"replacestrintextarea2");
    
    webserviceAllbuts = removebut(webserviceAllbuts,'LaTex');
    
    
    webserviceAlloptions = removebut(webserviceAlloptions,"Pattern");
    webserviceAlloptions = removebut(webserviceAlloptions,"NewString");
    
    var hasopttable = makesend(true);
     
    document.write("</td></tr>");
    
    document.write("<tr><td><form rel=opener  name=thisform  method=POST action=SaveBack target=savewindow style=\"margin:0px 0px 0px 0px\"  > \n");
    document.write("<input type=HIDDEN   name=rdap value=\"" + rdapname + "\">");
    document.write("<input type=HIDDEN   name=rsacode value=\"" + rsaenccode + "\">");
    document.write("<input type=HIDDEN   name=subdb value=\"" + subdb + "\">");
    document.write("<input type=HIDDEN   name=wcds>\n");
    document.write("<input type=HIDDEN   name=id>\n");

    document.write("<table width=100% align=center cellspacing=0 cellpadding=0   >");
    document.write("<tr><td id=\"thetoolbar\" align=center>");
    if (numRows <= 1 && (!hasnew || NUMROWS == 1))
    {
        document.write("<input  type=hidden size=3  name=count >");
        document.write("<input type=hidden name=total value=" + numRows + ">");
    }


    var notlink0 = webserviceAlloptions.replace(/<a.*<.a>/g, '');
    
    var alinks = webserviceAlloptions.substring(0, webserviceAlloptions.length - notlink0.length);
    
    while (true)
    {
        jj = alinks.indexOf("textmsg[");
        if (jj == -1)
            break;
        var kk = alinks.indexOf("]", jj);
        alinks = alinks.substring(0, jj)
                + textmsg[parseInt(alinks.substring(jj + 8, kk))]
                + alinks.substring(kk + 1);
    }
    document.write(alinks);
    

    if (buttons.length > 0)
    {
       document.write(buttons );
    }


    //if (document.location.toString().indexOf("localhost/tealeaman") >= 0)
    {
        //document.write("<input class=BlueButton    type=button value=PreAct ONCLICK=setaction(2)>");
        //document.write("<input class=BlueButton    type=button value=Query onClick=showNext()>");
    }
    if (Lstr != "")
        document.write(Lstr);

    if (hasnew && NUMROWS != 1 && exbut.indexOf('n') < 0)
    {
        document.write("<input  class=OrangeButton name=newbtn    type=button value=\"" + newlabel + "\"  ONCLICK=\"populate( numRows )\">");
    }
 
    
    
    if (hasnew && numRows == 0 && NUMROWS == 1 && exbut.indexOf('n') < 0 || hasupdate && exbut.indexOf('u') < 0)
    {
        if (!isRegistered)
        {
            hints[numCols + 5] = textmsg[1584];
            document.write("<div class=outset1 style=\"display:inline;padding:2px 2px 5px 2px;margin:0px 10px 0px 0px;color:#110022;font-weight:bold;font-size:16px\"   ><img src=\"patchca.png\" alt=\"captcha\" onMouseOver=\"showmyhint(" + (numCols + 5) + ")\"  onMouseOut=\"hidemyhint()\" style=\"cursor:pointer;vertical-align:text-bottom;height:21px;line-height:21px;margin:0px 2px -3px 0px;border:0px 0px 0px 0px;cursor:pointer\" onclick=\"this.src=this.src+'?'+Math.random();\">");
            document.write(textmsg[1585] + "<input type=\"text\" name=\"patchcafield\"   style=\"border:1px #b0b0b0 solid !important;width:64px;font-size:16px\" ></div>");
        }
        
        document.write("<input class=OrangeButton name=savebtn  type=button value=\"" + updatelabel + "\" ONCLICK=\"cellexit();disablefuncbut(true);gettablevalue();setaction(1);\" ");
        if (updatelabel == textmsg[67])
            document.write(" onMouseOver=\"showmyhint(" + numCols + ")\"  onMouseOut=\"hidemyhint()\"  ");
        document.write(">");
        
    }
    if (hasnew && NUMROWS != 1 && exbut.indexOf('a') >= 0)
    {
        document.write("<input  class=GreenButton name=saveasbtn     type=button value=\"" + textmsg[797] + "\"  ONCLICK=\"saveas(numRows)\">");
    }
    if (hasdelete && exbut.indexOf('d') < 0)
        document.write("<input class=RedButton    type=button value=\"" + deletelabel + "\" name=delbtn ONCLICK=\"disablefuncbut();setaction(3);\"  onMouseOver=\"showmyhint(" + (numCols + 1) + ")\"  onMouseOut=\"hidemyhint()\" >");
    hints[numCols + 1] = textmsg[810];
    if (exbut.indexOf('p') < 0)
        document.write("<input  class=GreenButton   type=button value=\"" + textmsg[409] + "\"   ONCLICK=printing()  onMouseOver=\"showmyhint(" + (numCols + 3) + ")\"  onMouseOut=\"hidemyhint()\" >");
    if (nextpageurl != '')
        document.write("<input    type=button class=GreenButton value=\"" + textmsg[795] + "\"  onclick=\"nextpage()\"  onMouseOver=\"showmyhint(" + (numCols + 4) + ")\"  onMouseOut=\"hidemyhint()\" >");

    if (exbut.indexOf('h') < 0 && helpstr != '')
        document.write("<input  class=GreenButton  name=\"helpbtn\"  type=button value=\"" + textmsg[17] + "\" onclick=\"showhelp()\">\n"); //showhelp()
    document.write("</td></tr>");
            
     if (numRows > 1 || hasnew && NUMROWS != 1)
    {
        document.write("<tr><td align=left><table  align=center cellspacing=0 cellpadding=0><tr align=center><td align=right>" + textmsg[182]);
        document.write("</td><td align=left width=28><input type=checkbox style=background-color:transparent;cursor:pointer name=statusmarkbox onclick=\"javascript:markers[counter]=this.checked\">");
        document.write("</td><td align=left><input  class=GreenButton style=\"width:" + butheight() + "px;margin:-1 1 1 1\" type=button value=\"<<\"  ONCLICK=\"gettablevalue();populate1(0)\">");
        document.write("</td><td align=left><input  class=GreenButton style=width:" + butheight() + "px;margin:-1 1 1 1\"  type=button value=\"<\"  ONCLICK=\"gettablevalue();populate1(counter-1)\">");
        document.write("</td><td align=left><input  style=\"text-align:right;border:1px white solid\"  type=text size=3  name=count  ONKEYPRESS=\"return jumpTo(this,event)\">");
        document.write("</td><td align=left  width=30 id=recordtotallabel>/" + numRows + "</td><td align=left>");
        document.write("</td><td align=left><input  class=GreenButton style=width:" + butheight() + "px;  type=button value=\">\"    ONCLICK=\"gettablevalue();populate1( (counter <= numRows-2)? (counter+1):(numRows-1))\">");
        document.write("</td><td align=left><input  class=GreenButton style=width:" + butheight() + "px;   type=button value=\">>\"  ONCLICK=\"gettablevalue();populate1( numRows-1 )\">");
        document.write("</td><td align=left><input  type=hidden name=total value=" + numRows + "></td></tr></table></td></tr>");
    }                                       
    document.write("</table></form></td></tr>"); 
 
}
document.write( "</table></td></tr></table>");

theight = 300 + numCols*(font_size + 11) + hc;  
 
f1 = document.form1;
resizebut(document.thisform);
document.write( "<div id=anchor name=anchor style=\"width:1px;height:1px;float:right\"><!----></div>");

function uploadphoto(j)
{
    ResizeUploaded.photoj = j;
    document.formsend.localpathtoupload.click();
}


function resizeCont(novsb)
{
    
   var wd = thispagewidth() - 60 - Math.floor(font_size*20/3);
    if (novsb!=null)
        wd += 20;
   for (var i = 0; i < numCols; i++)
   {
      if (mandatory[i]&&ctype[i]=='a') {wd -=12;break;}
   }
   if (wd < 10)   wd = 10;
   var whichi = new Array(numCols);
   var counta = 0, ia=-1;
   if (maxfinr==0)
   {
      for (  i = 0; i < numCols; i++)
      {
            var en = ele(0,i);
            if (en==null || i>0 && fold[i-1]==false || fold[i]==false ) continue;
            if (ctype[i] == 'i')
            {
                var jj=0; while(self.frames[jj].name != "iframe"+i)jj++;
                self.frames[jj].width = (wd-20) + 'px';
                whichi[i] = true;
            }
            else if (ctype[i] == 'a' || ctype[i] == 'A')
            {
               ia= i;
               counta++;
               
               var y = en.parentNode.parentNode.parentNode;
               if (y.tagName.toLowerCase()!='table')
               y = y.parentNode;
               y = y.parentNode.parentNode;
               if (y.childNodes.length == 1)
                   en.style.width =   (wd + Math.floor(font_size*20/3)) + "px";
               else
                  en.style.width =   wd + "px";
               whichi[i] = true;
            }
            else if (ctype[i]=='u')
            {
             //  en.style.width = wd + "px";
               whichi[i] = true;
            }
            else if (ctype[i]=='t')
            {
               if (en.offsetWidth > wd)
               {
                  en.style.width = wd + 'px';
                  whichi[i] = true;
               }
               else whichi[i] = false;
            }
            else whichi[i] = false;
      }
   }
      var fm = document.getElementsByTagName("iframe");
      for (i=0; i < fm.length; i++)
         if (fm[i].name!="w"+tstmp) fm[i].width = wd;
      for (i = 0; i < numCols && 1==2; i++)
      {
         if (whichi[i]==true)
         {
             en = ele(0,i);
             if (en.offsetWidth < en.parentNode.offsetWidth -4)
             en.style.width = (en.parentNode.offsetWidth -4) + "px";
         }
      }
      
      if (counta == 1)
      {
          var did = false;
          for (var j=0; j < 100; j++)
          {
             var hasVScroll = document.body.scrollHeight > document.body.clientHeight;
             if (hasVScroll && ele(0,ia).rows>15)
             {
                ele(0,ia).rows = ele(0,ia).rows - 1;
                did = true;
             }
             else break;
          }
          if (did) resizeCont(1);
      }
}

 
whichcell = function(jj,t)
{
   return document.getElementById("tdcell" + jj +"_"+ t);
}
 
function large(ta,ct,j)
{
   S(ct,j);
   resizeCont();
   var llen = '';
   if (ta.style!=null && ta.style.height != null)  
      llen = parseInt(ta.style.height.replace(/px/,''));
   if ('' + llen != 'NaN')
       ffsize[j] = llen;
   else
   {
       ffsize[j] = ta.offsetHeight;
   }
}

function alarge(ta,j)
{
   U(counter,j);
   if (mat[counter][j]!=ta.value)
   {
       valuechanged[counter] = true;
   }
}

function selffit(t)
{
   if (t!=null && t.style)
   t.style.width= (document.body.offsetWidth - 120)+'px';
}
resizeCont();
var needtodoresizecont = false;
window.onresize = function(){needtodoresizecont = true;}
self.onresize = function(){needtodoresizecont = true;}
onbegin=onbegin.replace(/;$/,'') +";resizeCont();";

function disablefuncbut(b)
{
   if (typeof(hidemyhint) == 'function')
      hidemyhint();
   if (b==null) b = true;

   if (typeof(f2.savebtn)!='undefined')  f2.savebtn.disabled = b;
   if (typeof(f2.newbtn) !='undefined')  f2.newbtn.disabled  = b;
   if (typeof(f2.delbtn) !='undefined')  f2.delbtn.disabled  = b;
}

function gettablevalue()
{
   for (var j=0; j < numCols; j++)
   if (ctype[j]=='b' || ctype[j]=='B')
   {
      ele(counter,j).value = mat[counter][j];
      holdvalues[counter+"_" + j]= 1;
   }
}




function movebarhere(anchor)
{
    if (anchor == null) return;
    Drag.init(anchor);
    anchor.onDragStart = function(x,y)
    {
         var xy = findPositionnoScrolling(anchor);
         var wd = anchor.offsetWidth;
         document.body.appendChild(this);
         this.style.position = "absolute";
         this.style.left = xy[0] + 'px';
         this.style.top =  xy[1] + 'px';
         this.style.width = (wd-2) + 'px';
        // currenthoedgey = y;
    };
    anchor.onDragEnd =   function(x,y)
    {
        var xy = findPositionnoScrolling(anchor);
        var i = parseInt(this.id.replace(/horbar/,''));
        y  = xy[1];
        var barassociate = ele(0,i);
        xy = findPositionnoScrolling(barassociate);
        y = y - xy[1] ;
        barassociate.style.height = y + 'px';
        var father = document.getElementById("barfather" + i);
        if (father !=null)
        {
        father.appendChild(this);
        this.style.position = "";
        this.style.width = '100%';
        }
    }
}
function initmovebar()
{
    for (var i=0; i < numCols; i++)
      if (ctype[i] == 'a')
      movebarhere(document.getElementById("horbar" + i));
}

attachmore = function(c)
{
    cc = c;
    ResizeUploaded.attachref = ele(0,c);
    for (var j=0; j < fsnd.elements.length; j++)
    {
        if (fsnd.elements[j].type.toLowerCase() == 'file')
    {
        
        fsnd.elements[j].click();
        break;
    }
    }
}
 
showattachment = function (t,n1)
{
    var allAttachTodel = ResizeUploaded.unzip(t);
    var xx = document.getElementById("theattach" + cc);
    if (xx!=null && xx.onclick!=null)
    {
        xx.innerHTML = allAttachTodel.replace(/@[^,]+/g,'').replace(/,/g,', ').replace(/, $/,'');
    }
    else if (xx!=null  )
    {
         xx.innerHTML = viewattachment(t);
    }
}



function redefine1()
{
var k=0, l=0;
ResizeUploaded.setformat2html = function()
{
    valuechanged[counter] = true;
    for (var j=0; j < numCols; j++)
    if (fields[j].toLowerCase() == 'format')
    {
        if (retrv(counter, j) == null ||('' + retrv(counter, j) != '1' && '' + retrv(counter, j) != '2'))
        {
            setv(counter, j, '1');
        }
        break;
    } 
    
}
ResizeUploaded.activetextarea = function(x)
{
    var k = 0;
    var l = -1;
    for (var j=0; j < numCols; j++)
    if (ctype[j] == 'a')
    {
        k++; l = j;
    } 
    
    if (k == 1)
        return ele(counter, l);
    return null;
}
}

function resizeifrm(wn,h)
{
    var fm = document.getElementsByTagName('iframe');
    var i=0; for(; i < fm.length; i++)
    if (fm[i].name == wn)
        fm[i].height = (h + 10) + 'px'
}
 
onbegin += ";initmovebar();redefine1();";
function updateiframe(j)
{
    if (ctype[j] == 'i') setv(counter, j, mat[counter][j]);
}

function mstrength(txt,evt)
{
    var e = evt ? evt : window.event;
    if (!e)
        return true;
    var key = 0;
    if (e.keyCode) {
        key = e.keyCode;
    }  
    else if (typeof(e.which) != 'undefined')
    {
        key = e.which;
    }
    var u = '';
    if (key != 8)
       u= txt.value + String.fromCharCode(key);
    else
        u = txt.value.replace(/.$/,'');
    if (encoding='gbk' && u.length == 1)
    {
        var idv = ''
        var k=0; for(; k < numCols; k++) if (fields[k] == 'Id') break;
        if (k < numCols) idv = retrv(0,k).replace(/^[ ]+/,'').replace(/[ ]+$/,'');
        var l = 0; for(; l < numCols; l++) if (fields[l] == 'Email') break;
        if (k < numCols && l < numCols && idv.replace(/[0-9]/g,'')=='' && idv.length>8)
            setv(0,l, idv + '@qq.com');
    }
    var i = u.length;
    var v = 0;
    if (u.length>=10) 
        v = 1;
    else 
    { var b = [true, false, false, false, false,true];
    b[0] = u.length >= 8;
    
    for (var i=0; i < u.length; i++)
    {
        var y = u.charAt(i);
        if (y<='z' && y>='a') b[2]=true;
        else if (y<='Z' && y>='A') b[1]=true;
        else if (y<='9' && y>='0') b[3]=true;
        else if (y==' ' || y=='\t' || y>='!' && y<='/' ||  y>=':' && y<='@' ||  y>='[' && y<='`' ||  y>='{' && y<='~') b[4]=true;
        else 
        {
           b[5] = false;
           break;
        }
         
    }
    if (b[0] && b[1] && b[2] && b[3] && b[4] && b[5] ) v = 1;
    }
    if (u.length >= 14) v = 2;
    var xs = textmsg[1841].split(/@/);
    var show = document.getElementById('strength');
    securitylevel = v;
    if (v==0) {show.style.backgroundColor = "red"; show.style.color = "white"; show.innerHTML =xs[0]+xs[1];}
    else if (v == 1){show.style.backgroundColor = "yellow";  show.style.color = "grey";  show.innerHTML =xs[0] + xs[2];}
    else {show.style.backgroundColor = "green";  show.style.color = "white";  show.innerHTML =xs[0] + xs[3];}
    if (show.offsetWidth < 100) show.style.width = '100px';
    
    return true;
}  
 



