/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
datapresentformat="DataTable";
var largeZ=-1,largej=-1;
function copyback(Z, j)
{
    var bar = document.getElementById("toolbar");
    var fm = document.thisform;
    if ( typeof(document.formsend)!='undefined')
    {
        if ( fm.nextSibling != null)
        {
            fm.parentNode.insertBefore(document.formsend, fm.nextSibling);
        }
        else
        {
            fm.parentNode.appendChild(document.formsend);
        }
    }
    if (document.getElementById('formtoolset') !=null && document.getElementById('webtoolset')!=null)
    {
        var toolset = document.getElementById('formtoolset');
        toolset.parentNode.insertBefore( document.getElementById('webtoolset'),  toolset);
    }

    var tbl = bar.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0]; 
    var tx = tbl.rows[1].cells[tbl.rows[1].cells.length-1].getElementsByTagName('textarea')[0];
    if (typeof(tx)!='undefined' && tx!=null)
    {
        setv(Z, j, tx.value);
    }
    document.body.removeChild(bar);
    largeZ=-1;
    largej=-1;
}

function enablemovearound(b)
{
    if (b == false)
    {
         document.onmousemove = null;
         document.onmouseup   = null; 
     }
     else
     {
         document.onmousemove	= Drag.drag;
         document.onmouseup		= Drag.end;
     }
}

function enlarge(tx, z, j)
{
    if (typeof(findPositionnoScrolling)=='undefined') return;
    if (largeZ!=-1 && largej !=-1)
    {
        var bar = document.getElementById("toolbar");
        if (typeof(bar)!='undefined' && bar!=null) 
        {
            var tx = bar.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[1].cells[0].getElementsByTagName('textarea')[0];
            if (typeof(tx)!='undefined' && tx!=null)
            {
                setv(largeZ, largej, tx.value);
            }
        }
        return;
    }
    largeZ=z; largej=j;
    Z = counter = z;
    var bar = document.createElement("div");
    bar.id = "toolbar";
   // bar.className = "outset1";
    var xy = findPositionnoScrolling(tx);
    xy[1] -= parseInt('' + ffsize[j])*(2 + font_size) - 20;
    xy[0] -= parseInt('' + fsize[j])*4;
    if (xy[1] < 0) xy[1] = 0;
    if (xy[0] < 0) xy[0] = 0;
    
    bar.style.cssText="background-color:" + DBGCOLOR +";vertical-align:top;margin:0px 0px 0px 0px;paddding:0px 0px 0px 0px;left:" + xy[0] + "px;top:" + xy[1] + "px;border:1px #b0b0b0 outset;position:absolute;z-index:10;border-radius:3px";
    
    var zz =  "<table border=0 cellpadding=0 cellspacing=0 width=100% ><tr><td align=left  width=100% ><table width=100% cellpadding=3 cellspacing=1><tr style=\"background:" + beheading + "\"><td width=20  valign=top align=left><img width=22 style=\"float:left;margin:0px 0px 0px 0px;border-radius:11px;cursor:pointer\" src=\"image/icon/smalls00.png\"   onmouseover=\"swappic(this)\" onmouseout=\"swappic(this)\""
      + " onclick=\"copyback(" + z +"," + j +")\"></td>";
    zz += "<td></td><td></td>";  
    zz += "</tr></table></td></tr><tr><td valign=top>";
    var ww = '';
    if (tx!=null)
    {
        ww = "<textarea ";
       ww += ( " onkeydown=\"if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}\" ");
           
        var attr = tx.attributes;
        for (var i=0; i < attr.length; i++)
        {
            if (attr[i].nodeName.toLowerCase()!='onblur' && attr[i].nodeName.toLowerCase()!='onfocus' 
               && attr[i].nodeName.toLowerCase()!='rows' && attr[i].nodeName.toLowerCase()!='cols' 
               && attr[i].value!='null' && attr[i].value!=null  && attr[i].value!='')
            ww += " " + attr[i].nodeName + "=\"" + attr[i].value +"\" ";
        }
        ww += " onfocus=\"enablemovearound(false)\"  onblur=\"enablemovearound(true)\" readonly=no ";
        ww +=   " rows=" + ffsize[j] + " cols=" + fsize[j] + "></textarea>";
    }
            
    bar.innerHTML = round1('') + zz  + ww + "</td></tr></table>" +  round2;
    
  
    var tbl0 = bar.getElementsByTagName('table')[0].rows[1].cells[1];
    tbl0.style.borderRadius = "4px";
    var tbl = tbl0.getElementsByTagName('table')[0];
    var webtoolset = document.getElementById('webtoolset');
    
    if (mm > 0 && typeof(document.formsend) != 'undefined')  
    {
        tbl.rows[0].cells[0].getElementsByTagName('table')[0].rows[0].cells[1].appendChild(document.formsend);
    }
    if (typeof(webtoolset)!='undefined') 
    { 
        try{
        tbl.rows[0].cells[0].getElementsByTagName('table')[0].rows[0].cells[2].appendChild(webtoolset);
        }catch( ex ){}
    }
  
    var td = tbl.rows[1].cells[0].getElementsByTagName('textarea');
    if (td!=null && td.length > 0 )
    {
        td = td[0];
        td.value = ele(z,j).value;
        td.disabled = false;
        td.readOnly = false;
    }
    else
        td = null;
    document.body.appendChild(bar);
    var w = tbl.rows[0].cells[0].offsetWidth;
   
    if (mm > 0)
    {    
        w = 22 + tbl.rows[0].cells[0].getElementsByTagName('table')[0].rows[0].cells[1].offsetWidth 
           + tbl.rows[0].cells[0].getElementsByTagName('table')[0].rows[0].cells[2].offsetWidth;
    }
  
    var w0 = document.getElementById('toolbar').offsetWidth-6;
    
    if (w < w0) w = w0; 
    
    if (td!=null && td.offsetWidth < w)
    {
        td.style.width = w + 'px';
    }
    
    Drag.init( tbl.rows[0], bar);
    if (tx!=null)
    copydatato(tx,j);
    var rr = new ResizeRounded(bar, function(td, dx, dy)
    {
        var ll = td.getElementsByTagName("table")[0].rows[1].cells.length;
        var xs =  td.getElementsByTagName("table")[0].rows[1].cells[ll-1].getElementsByTagName('textarea');
        if (xs == null || xs.length == 0) return;
        var u = xs[0];
        var z =  td.getElementsByTagName("table")[0].rows[0];
        var xx = parseInt(x.style.width.replace(/px/,''));
        if ( ('' + xx) == 'NaN')
        {
            xx = u.offsetWidth;
        }
        var xy = parseInt(x.style.height.replace(/px/,''));
        if ( ('' + xy) == 'NaN')
        { 
            xy = u.offsetHeight;
        }
        if (dx!=0)
        {    
            u.style.width = (xx + dx) + 'px';
            var zl = z.cells[0].offsetWidth + z.cells[1].offsetWidth + z.cells[2].offsetWidth;
            //if (xx+ dx < zl)   x.style.width = zl + 'px'; 
        }
        if (dy!=0)
        {    
            u.style.height = (xy + dy) + 'px';
        }
    });
    rr.fitsize(); 
    return tbl;
}
function ST(Z,j)
{
    S(Z,j);
    var xx = retrv(Z,j);
 
    var xx = Innergrid.makeinnertable(xx, Z, j, ctype[j] == 'b');
   
    myprompt(xx);
    //Innergrid.goto1st(Z,j);
}

var showpicflag = false;
var onlyim = null;
function showphoto(z,j, m)
{
   if (showpicflag ) return;
   var xy = findPositionnoScrolling(m);
   var im = document.createElement("div");
   var ih = "<img onload=\"move2here(" + xy[0]+','+xy[1]+")\" src=" + mat[z][j] ;
   if (fsize[j]!="" && ffsize[j] != "")
   {   
       ih += "  width=" +  fsize[j] +  " height=" +  ffsize[j] ;  
   }
   else if (fsize[j]!="")
   {   
       ih += "  width=" +  fsize[j]   ;  
   }
   else if (ffsize[j]!="")
   {   
       ih +=    " height=" +  ffsize[j] ;  
   } 
   ih += ">";
   im.innerHTML = ih;
    
   document.body.appendChild(im);
   showpicflag = true;
   onlyim = im;
}
function move2here(x,y)
{   
   x  -= onlyim.offsetWidth;
   y -= onlyim.offsetHeight;
   if (x < 0) x = 0;
   if (y < 0) y = 0;
   onlyim.style.cssText = "position:absolute;z-index:10;top:" + x + 'px;left:' + y + 'px;border:1px #bbbb00 outset';
   
}
function hidephoto()
{
   document.body.removeChild(onlyim); 
   showpicflag = false;
}
function attachbtnclick()
{
    if (counter>=0 && counter < numRows && ResizeUploaded.attachindex>-1)
       attachmore(counter,ResizeUploaded.attachindex);
    else 
       myprompt(textmsg[345]+'[+]');
}
if (typeof piccount == 'undefined')
{
   var piccount = numCols + 5;
   var hints = [];
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
   else if (x=='a' || x=='i' || x=='n' || x=='u')
   {
         if (fsize[j] == null || fsize[j] =='')
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
var needtitle1 =!(parent!=window  // left has the same
    && parent.frames[0]!=null 
    && self!=parent.frames[0] 
    && typeof(parent.frames[0].getTitle)!='undefined'
    && ("" + parent.frames[0].location).substring(0,13)==("" + self.location).substring(0,13)
    && parent.frames[0].getTitle()==title); 
document.write(unifontstyle(font_size)); 
document.write( "<table  cellpadding=0 cellspacing=0 ");
if (exbut.indexOf("l") >=0)
    document.write( "  align=left>");
else if (exbut.indexOf("r") >=0)
    document.write( "  align=right>");
else
    document.write( "  align=center>");
if (needtitle && needtitle1 && title.replace(/ /g,'')!='')
{
        var tit = unititle(title,'outset2');;
        if (parent!=window && parent.frames[0]!=window) 
            tit = tit.replace(/<img[^>]*>/,"").replace(/<td[^>]*><.td>/,"");
        document.write("<tr><td align=center>" + tit +"</td></tr>"); 
}




var ecount = 0;
 
document.write( "<tr><td style=\"padding:0px 0px 0px 0px\" align=center><form rel=opener name=form1 style=\"margin:"+ (((needtitle&&needtitle1)?3:0)  ) + " 0 0 0\"  >");
document.write( round1("100%")+ "<table align=center  cellspacing=0 cellpadding=0 class=outset3 >");
document.write( "<tr><td  align=center bgcolor=#b0b0b0 ><table id=\"maintable\" style=\"border-collapse:collapse;border-color:#b0b0b0\" class=outset1 cellpadding=3 width=100% cellspacing=1 border=1>\n");
document.write( "<tr style=\"background:" + beheading +"\" >\n");
var af = "";
var tdorder = 0;
if (!viewonly)
{
   af +=( "<td   style=\"border:1px #b0b0b0 outset\" width=" +  (5 + font_size) + " align=center> <input type=checkbox name=check1 value=all onclick=checkall() style=\"background-color:transparent\"> </TD>");
   ecount++;
   tdorder++;
}



if (hasroworder)
{    
    af +=( "<td  style=\"border:1px #b0b0b0 outset\" ><nobr><b>" + textmsg[542] + "</b></nobr></TD>");
    tdorder++;
}
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



   var align = (dtype[j])? "right":"left";
   if (ctype[j]=='c' || ctype[j]=='C') align='center';
   var tdwidth = "";
   if (ctype[j]=='c' ) tdwidth = "width=" +  (5+ font_size);
    
   x = ctype[j].toLowerCase();
   var str1 = labels[j].replace(/([a-z])([A-Z])/g, "$1&nbsp;$2");
   if (str1.indexOf("nolabel") == 0||x=='h'||x=='k') str1 = "";
   if (x =='k'  )
   {
      var j2 = af.lastIndexOf("<TD ");
      af = af.substring(0, j2) + "<TD  style=\"border:1px #b0b0b0 outset\" colspan=2  width=100 " + af.substring(j2+4);
   }
   else if (x!='h')
   af +=  "<TD  style=\"border:1px #b0b0b0 outset;cursor:pointer;width:70px\" " + tdwidth
       + " align=\""+align  + "\"  onclick=sort("
       + j+") onMouseOver=\"showmyhint(" + j  + ",1," + (tdorder++) +")\"   onMouseOut=\"hidemyhint()\" ><nobr><b>"
       + str1
       + "</b></nobr></td>";
 }
 
document.write( af + "</TR>");

var  classrl, Z,   readonly, cellvalue;
var numfsize=0; 
 
for (Z = 0; Z < NUMROWS; Z++) 
{
   //elexy[Z] = new Array(numCols);
   af = "<TR valign=middle bgcolor="+ TBGCOLOR +" style=\"margin:0px 0px 0px 0px\">"; 
   if (!viewonly) 
   {
      af += "<TD  valign=top    align=center  width=" +  (5+ font_size) + "> <INPUT  type=checkbox name=checkbox value=" + Z + "  > </TD>";
      ecount++;
   }
   if (hasroworder)
      af += "<TD  valign=top   align=right>" +  (Z+1) + "</TD>";
   var att = makehw(Z);
   var bufferedhidden = "";
   j1=0;
   for (;  j1 < numCols; j1++)
   {
      j = positionr[j1];
      if (ctype[j].toLowerCase()!='h') break;
      //elexy[Z][j] = ecount++;
      bufferedhidden += "<INPUT  type=hidden  NAME="+Z+"_"+j+">";

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
         readonly = "color:black";
      cellvalue = "";
      if (ctype[j]=='L' )
      {
           x = extractfromm(mat[Z][j],true);
           af += "<td   align=\"" + (x.includes('>>')?'center':(isNaN(x)?'left':'right')) + "\" width=70 valign=top>";
      }
      else if (ctype[j]=='c'|| ctype[j].toLowerCase()=='l')
         af += "<td   align=\"center\" valign=top>";
      else if (ctype[j]=='k')
         af += "<td   width=3  valign=top>"; 
      else if (ctype[j]=='U')
         af += "<td  valign=top  style=\"width:" + (font_size + 12) +"px !important\">";
      else if (ctype[j].toLowerCase()!='h')
         af += "<td  valign=top >";
      if (bufferedhidden!='')
      {
          af += bufferedhidden;
          bufferedhidden = '';
      }


      switch(ctype[j])
      {
        case "a": case "A":

            af += "<textarea   style=" + readonly +"border:overflow:hidden;margin-bottom:-3px   rows=1 cols=15 NAME="+Z+"_"+j;
            af += " onfocus=\"Z="+Z+";S("+Z+","+j+");enlarge(this,"+Z+","+j+")\" onblur=\"U("+Z+","+j+")\"  onchange=UT("+Z+","+j+") onkeypress=\"return allowenter("+ Z + ","+ j + ",event)\"></textarea>";
             //elexy[Z][j] = ecount++;
            break;
        case "i": case "I":
            af += "<iframe  frameborder=0 width="+fsize[j]+" height="+ ffsize[j] +" NAME=iframe"+Z+"_"+j;
            af += "></iframe><input type=hidden name=" + Z +"_"+j+">";
            //elexy[Z][j] = ecount++;
            break;
        
        case "m": case "M":  case "t": case "n": case "T": case "N":
            
            if ( (ctype[j] == 'm' || ctype[j] == 'M') && mat[Z][j]!=nullvalue[j])
            {
               maxsize[j] = timeformat.length + 2;
               cellvalue = timestr2(mat[Z][j]);
            }
            else if ( (ctype[j] == 'n' || ctype[j] == 'N') )
            {
               if (mat[Z][j]!=nullvalue[j])
                  cellvalue = numberstr(mat[Z][j], ffsize[j]);
               if (cellvalue=='null' || cellvalue==null)
                  cellvalue = '';
               
            }
            else if ( ctype[j] == 't' || ctype[j] == 'T')cellvalue = mat[Z][j];
            
            if (fields[j].toLowerCase().indexOf('attach')==0)
            {
                fsize[j] = 10000;
                var xx = fsize[j];
                if (xx < 4) xx = 4;
                af +=  ("<input  type=hidden NAME=\"" + Z + "_" + j + "\" value=\"" + cellvalue +"\" onchange=UT(counter,"+j+")  >");
                if (ctype[j] == 'T')
                { 
                    af += "<span id=theattach"+ Z + '_' + j + " >" + viewattachment(cellvalue) + "</span>";
                }
                else if (ctype[j] == 't')
                {
                    af += "<span  style=color:blue;cursor:pointer onclick=\"attachmore("+ Z + ',' + j + ")\" >[+]</span><span id=theattach"+ Z + '_' + j + " style=color:blue;cursor:pointer onclick=\"rr="+Z +";cc="+j+";ResizeUploaded.attachman(ele("+ Z + ',' + j + "))\"></span>";
                } 
            }
            else 
            {
                var xx = fsize[j];
                if (xx < 4) xx = 4;
                af +=  "<INPUT value=\"" + cellvalue +"\"  class="+ classrl +" style=\"" + readonly  + "\"  size=" +  xx  + " maxsize=" + maxsize[j] +" NAME="+Z+"_"+j;
                af += " onfocus=\"Z=" + Z + ";S("+Z+","+j+")\" onblur=U("+Z+","+j+") onchange=UT("+Z+","+j+")  onkeypress=\"return allowenter("+ Z + ","+ j + ",event)\">";
            }
           
             
            break;
        case "b": case "B":
                //onkeypress=\"return Innergrid.dotabenter(event)\" onblur=\"Innergrid.leavingbox();U("+Z+","+j+")\" 
            af +=  "<table cellspacing=0 cellpadding=0 align=center><tr><td><textarea NAME="+Z+"_"+j +" style=visibility:hidden;width:1px;height:20px>" + mat[Z][j] +"</textarea></td><td id=\"cell" + Z +"_" + j +"\"><table cellpadding=0 cellspacing=0 border=1 style=border-collapse:collapse width=50><tr height=11><td width=25 align=center style=font-size:8px;background:" + beheading + ";cursor:pointer onclick=\"ST("+Z+","+j+");\">&bull;&bull;&bull;</td><td width=25  align=center style=font-size:8px;background:" + beheading + ";cursor:pointer onclick=\"ST("+Z+","+j+");\">&bull;&bull;&bull;</td></tr><tr height=11><td width=25  align=center style=font-size:8px;background-color:" + TBGCOLOR + ";cursor:pointer onclick=\"ST("+Z+","+j+");\">&bull;&bull;&bull;</td><td width=25  align=center style=font-size:8px;background-color:" + TBGCOLOR + ";cursor:pointer onclick=\"ST("+Z+","+j+");\">&bull;&bull;&bull;</td></tr></table></td></tr></table>";
            //elexy[Z][j] = ecount++;
            break;
        case 'f':
               if (fmtcol < numCols && numRows>0 && mat[0][fmtcol]=='2')
                {
                    needtranslator=true;   
                } 
               xx = formatmat(mat[Z][j],Z, j);
               af +=  "<table cellspacing=0 cellpadding=0 align=center><tr><td><textarea NAME="+Z+"_"+j +" style=visibility:hidden;width:1px;height:20px>" + mat[Z][j] +"</textarea></td><td id=\"cell" + Z +"_" + j +"\">" + xx + "</td></tr></table>";
            
              
               break;
             
       case "w": 
            //elexy[Z][j] = ecount++;
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
            //elexy[Z][j] = ecount++;
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
           //elexy[Z][j] = ecount++;
           af += "<SELECT   style="+ readonly + "border-wdith:1px;border-color:" + TBGCOLOR +";background-color:"+ TBGCOLOR + cellvalue +" NAME="+Z+"_"+j;
           af += " onchange=\"Z=" + Z + ";UT("+Z+","+j+")\" ";
           af += " onblur=\"Z=" + Z + ";U("+Z+","+j+")\" "
           af +=" onfocus=\"Z=" + Z + ";S("+Z+","+j+");fillopts(this,"+Z+","+j+",true)\"  >";
           var hit = false; 
 
           if (options[j] != null)
           {
             for (  jj=0; jj < options[j].length; jj++)
             if (Z < numRows && mat[Z][j]==options[j][jj])
           { 
             hit = true;
             af += "<option value=\""+ options[j][jj] + "\" selected=true>"+ captions[j][jj] +"</option>"; 
           }
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
                  af +="<td width=12><INPUT type=radio   style=border:0;background-color:transparent;cursor:pointer NAME=1_"+j; 
             else
                  af +="<td width=12><INPUT type=radio    style=border:0;background-color::transparent;cursor:pointer NAME="+Z+"_"+j;
             af += " onchange=UT("+Z+","+j+") ";

             if (options[j][jj] == mat[Z][j]) af += " checked ";
             if (options[j].length==1)
                  af +=" onfocus=S("+Z+","+j+") onclick=\"U("+Z+","+j+");UT("+Z+","+j+")\" value=\""+ options[j][0] + "\"></td><td>" + captions[j][jj] + "</td>";
             else
                  af +=" onfocus=S("+Z+","+j+") onclick=\"U("+Z+","+j+");UT("+Z+","+j+")\" value=\""+ options[j][jj] + "\"></td><td><nobr>"+ captions[j][jj].replace("/", "</td></tr><tr><td  width=12>") +"</nobr>&nbsp;</td>";
           }
           //elexy[Z][j] =  ecount;
           ecount += options[j].length;
           af += "</tr></table>"; 
           break;


       case "p": case "P": 
         af +=  "<INPUT  type=password class="+ classrl + " style=" + readonly +" size="+fsize[j]+"  NAME="+Z+"_"+j;
         af += " onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+") onchange=UT("+Z+","+j+") >";
          //elexy[Z][j] = ecount++;
         break;

       

       case "c": case "C":
         //elexy[Z][j] = ecount++;
         af +=  "<INPUT  style=background-color:transparent;width:" + font_size +"px;cursor:pointer   type=checkbox  NAME="+Z+"_"+j;
         af += " onchange=UT("+Z+","+j+") ";
         if (mat[Z][j] != null && mat[Z][j] != '0')
            af += " checked ";
         af += " onclick=\"valuechanged["+Z +"]=true\" ";
         af += " onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+")>";
         break;

       case "l":
          
         af +=  "<INPUT class=underline style=cursor:pointer size="+fsize[j]+"  NAME="+Z+"_"+j;
         af += " onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+") onchange=UT("+Z+","+j+") onDblClick=openit1(this.value,"+Z+")>";
         break;

       case "L": 
       
         x = extractfromm(mat[Z][j],true);
         if (x == '>>') af +=  "<input   class="+classrl+"  style=\"float:center;text-align:center;";
         else af +=  "<input   class="+classrl+" style=\"float:center;text-align:center;";
         af +=  "color:#0000AA\" size=" + (x.length < 2 ? 2:x.length) + " NAME="+Z+"_"+j+" onfocus=S("+Z+","+j+") onblur=U("+Z+","+j
            +") onchange=UT("+Z+","+j+") onClick=openit2("+Z+","+j
            +")   value=\"" + x +"\">";
         break;

       case "h": case "H": 
         af  = af.substring(0,af.length-5);
         //elexy[Z][j] = ecount++;
         af += "<INPUT  type=hidden  NAME="+Z+"_"+j+">"; 
         break;
       
       case "k": case "K":
          //elexy[Z][j] = ecount++;
          af +=  "<input type=button size=2 class=flat NAME="+Z+"_"+j+" onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+")  onClick=\"openit3("+Z+","+j+")\" value=\"&bull;&bull;&bull;\" >";
         break;

       case "u":
           //elexy[Z][j] = ecount++;
           hints[piccount] = "<img src=\"" + mat[Z][j] + "\">"; 
           af += "<INPUT  class="+classrl +" style=color:blue;cursor:pointer;width:120px size=50 NAME="+Z+"_"+j;
           af += " onfocus=S("+Z+","+j+") onblur=\"U("+Z+","+j+")\"  onchange=\"UT("+Z+","+j+");updatepic(this.value,"+Z+","+j+")\" onkeypress=\"return allowenter("+ Z + ","+ j + ")\" ";
           af += " onMouseOver=\"showmyhint(" + piccount +  ")\" onMouseOut=\"hidemyhint()\">";
           piccount++; 
        
           break;
       case "U":
         //elexy[Z][j] = ecount++;
         af += "<INPUT  type=hidden NAME="+Z+"_"+j+">";
         if (mat[Z][j]!='')
         af += "<img name=image" + Z+"_"+j+" src=\"" + mat[Z][j] + "\" style=height:" + (font_size+10) + "px;margin-bottom:-3px onmouseover=showphoto(" + Z +',' + j + ",this) onmouseout=hidephoto()>"
         
         break;
       default:

          if ( j1 < numCols - 1  && (ctype[positionr[j1+1]]=='k' || ctype[positionr[j1+1]]=='K' ) )
             af +="<nobr>";
         //elexy[Z][j] = ecount++;
         af += "<INPUT  class="+classrl +" style=color:"+IBGCOLOR + " size="+fsize[j]+ " NAME="+Z+"_"+j;
         af += " onfocus=S("+Z+","+j+") onblur=U("+Z+","+j+") readonly  onkeypress=\"return allowenter("+ Z + ","+ j + ")\">";
      }
      af +=  "</TD>";
   }
    
   document.write(af + "</TR>");
} 

if (hasfoot)
{
   //elexy[NUMROWS] = new Array(numCols);
   af = "<TR bgcolor=#FFFFC0  >";
   if (!viewonly)
   {
      af += "<td><input type=hidden name=total></td>";
      ecount++;
   }
   if (hasroworder) af += "<td align=right>" +  NUMROWS  +"</td>";
   bufferedhidden = "";
   j1=0;
   for (;  j1 < numCols; j1++)
   {
      j = positionr[j1];
      if (ctype[j].toLowerCase()=='h')
      {
         bufferedhidden += "<input  type=hidden name=foot"+j+">";
         //elexy[NUMROWS][j] = ecount++;
      }
      else break;
   }

   for (;  j1 < numCols; j1++)
   {

      j = positionr[j1];
      //elexy[NUMROWS][j] = ecount++;
      if (dtype[j] && ctype[j]!='M' && ctype[j]!='m') 
         classrl = "right"; 
      else 
         classrl = "left";
      
      var tt = 2;
      if (fsize[j]!=null&& isNaN(fsize[j])==false)
          tt = parseInt(fsize[j]);   
       
      var maxsizej = 2*tt;
      if (  ctype[j] == 'm' || ctype[j] == 'M' )
      {
         maxsizej = timeformat.length + 2;
      }
      else if (  ctype[j] == 'k' || ctype[j] == 'K' || ctype[j] == 'c' || ctype[j] == 'C' )
         tt = 2;
      if (ctype[j] != 'h' && ctype[j] != 'H')
          af += "<td>";
      if (tt > 6) tt = 6;
      if ('' + tt == 'NaN') tt = 6;
      if ('' +maxsizej == 'NaN')maxsizej = 20;
      if (bufferedhidden!='')
      {
         af += bufferedhidden;
         bufferedhidden = "";
      }
      switch(ctype[j])
      {
         case "h": case "H": 
         af = af.substring(0, af.length-5) + "<input name=foot" + j + "  type=hidden  value=\"\">";
         break;
         default:
         af +=  "<input class=right readonly style=\"border:0px;background-color:#FFFFC0;\"  size="+tt+" name=foot"+j+" maxsize=" + maxsizej +" value=\"\">";
         break;
      }
      af += "</td>";
   }  
    
   document.write(af + "</TR>");
}

document.write("</TABLE></td></tr></table>" + round2 );

if (hasfoot == false)
{
if (needtitle)
   document.write("<span class=outset1 style=\"alignment:center\"><font color=" + IBGCOLOR +">" + textmsg[194]+"</font>:<span id=rowtotal>" + numRows +"</span><input type=hidden name=total   value="+numRows + "></span>");
else
   document.write( "<input type=hidden name=total  value=\"" + numRows +"\">"); 
}
document.write( "</form>");
document.write( "</td></tr>");

let barcolnum = 2;
{
    let doit = false;
    for (let kk = 0; kk < numCols; kk++)
    {
        if (ctype[kk] != null && (ctype[kk] == 'l' || ctype[kk] == 'L' || ctype[kk] == 'i' || ctype[kk] == 'k') )
        {
            doit = true;
            break;
        }
    } 
    if ( (doit || mm > 0) && needtitle && needtitle1) 
        barcolnum = 3;
}


document.write( "<tr><td align=center>");
document.write( "<div class=outset1 id=toolbar0 style=\"margin:3px 3px 3px 3px;display:grid;grid-template-columns:auto "+ (barcolnum==2?"":"10px")+ " 20px;\">");
document.write( "<form rel=opener name=thisform  method=POST style=display:inline target=savewindow action=Echo    >"); 
document.write( "<span><input type=HIDDEN   name=subdb value=\"" + subdb + "\">");
document.write( "<input type=HIDDEN   name=rdap value=\"" + rdapname + "\">");
document.write( "<input type=HIDDEN   name=rsacode value=\"" + rsaenccode + "\">");
document.write( "<input type=HIDDEN   name=query>"); 
document.write( "<input type=HIDDEN   name=title>"); 
document.write( "<input type=HIDDEN   name=id>"); 
document.write( "<input type=HIDDEN   name=wcds>"); 
//if (typeof(f1.attach) != 'undefined' || typeof(f1.attachment) != 'undefined' || typeof(f1.Attach) != 'undefined' || typeof(f1.Attachment) != 'undefined')
{
    webserviceAllbuts = webserviceAllbuts.replace(/this.form.localpathtoupload.click\(\)/,"attachbtnclick()"); 
}


if (needtitle)
{
   var notlink0 = webserviceAlloptions.replace(/<a.*<.a>/g,'');
   var alinks = webserviceAlloptions.substring(0,webserviceAlloptions.length - notlink0.length);
   while (true) 
   {
             var jj = alinks.indexOf("defaultRecord[");
             if (jj==-1) break;
             var kk = alinks.indexOf("]",jj);
             alinks = alinks.substring(0,jj) 
             +    textmsg[parseInt(alinks.substring(jj+8,kk))]
             + alinks.substring(kk+1);
   }  
   while (true) 
   {
             var jj = alinks.indexOf("textmsg[");
             if (jj==-1) break;
             var kk = alinks.indexOf("]",jj);
             alinks = alinks.substring(0,jj) 
             +    textmsg[parseInt(alinks.substring(jj+8,kk))]
             + alinks.substring(kk+1).replace(/<\/a>/i,'</a>&nbsp;&nbsp;');
   } 
   document.write(alinks + "</span>");
   if (mm>0)
      document.write( "<span id=webtoolset>" +  webserviceAllbuts.replace(/<br>/g,'')  + "</span>" );
    document.write("<span id=formtoolset>");
   if (sessiondebug && ( hasupdate || hasdelete) )
   { 
   document.write( "<input  class=GreenButton   name=\"btnfunc1\" type=button value=\"" + textmsg[21] +"\"   ONCLICK=setaction(2)>");
   document.write( "<input  class=GreenButton   name=\"btnfunc2\" type=button value=\"" + textmsg[22] +"\"   onClick=showNext()>");
   //document.write("<input class=OrangeButton   type=button value=\"" + textmsg[23] +"\"  ONCLICK=copy1()>"); 
   } 

  if ( hasupdate && exbut.indexOf('u')<0 || hasnew  && exbut.indexOf('n')<0)
  { 
   document.write( "<input  class=OrangeButton  name=\"btnfunc3\" type=button value=\"" + updatelabel + "\"  ONCLICK=\"cellexit();setaction(1)\" onMouseOver=\"showbuthint(this,event," + numCols  + ");\"  onMouseOut=\"hidemyhint()\">");
   var numofshownfields = 0; 
   for (var i=0; i <numCols && ctype[i]!='h' && ctype[i]!='k';i++)
       numofshownfields++;
  // if (exbut=='') document.write( "<input  class=RedButton width=60 name=reset type=button value=\"" + textmsg[24] +"\"   onClick=reset1()>"); 
  } 

  if (hasdelete && exbut.indexOf('d')<0)
  {
     document.write( "<input class=RedButton name=btnfunc4 type=button value=\"" + deletelabel + "\"  ONCLICK=\"disablefuncbut();setaction(3)\" onMouseOver=\"showbuthint(this,event," + (numCols+1)  + ")\"  onMouseOut=\"hidemyhint()\" >");
  } 
  if (exbut.indexOf('c')<0)
  {
     document.write( "<input  class=GreenButton  name=btnfunc5  type=button value=\"" + textmsg[407] +"\"   ONCLICK=customize() onMouseOver=\"showbuthint(this,event," + (numCols+2)  + ")\"  onMouseOut=\"hidemyhint()\" >");
  }
  if (exbut.indexOf('p')<0)
  {
    document.write( "<input  class=GreenButton  name=btnfunc6  type=button value=\"" + textmsg[409] +"\"   ONCLICK=printing() onMouseOver=\"showbuthint(this,event," + (numCols+3)  + ")\"  onMouseOut=\"hidemyhint()\">");
  }
  if (nextpageurl!='')
  {
    document.write("<input type=button class=GreenButton  name=btnfunc7  value=\"" + textmsg[795] + "\"  onclick=\"nextpage()\" onMouseOver=\"showbuthint(this,event," + (numCols+4)  + ")\"  onMouseOut=\"hidemyhint()\">");
  }
  if (exbut.indexOf('h')<0)  
    document.write( "<input  class=GreenButton   name=btnfunc8   type=button value=\"" + textmsg[17] +"\"   ONCLICK=showhelp()>");
   document.write("</span>");
}
document.write( "</form>");
makesend();
if (needtitle && needtitle1)
{
   document.write("<span style=color:blue onclick=hidetoolbar()>&uarr;</span>"); 
}
document.write( "</div>");
document.write("</td></tr>");

document.write( "</table>");
document.write( "<div id=anchor name=anchor style=\"width:1px;height:1px;float:right\"><!----></div>");
resizebut(document.thisform);
if (mm>0)makeasso();

theight = NUMROWS*30+200; 
function passover(r,c)
{
    return retrv(r,c);
}
function fillcolsels(j)
{
   if (ctype[j]!='s') return;
   for (var i=0; i < numRows; i++)
      fillopts(ele(i,j),i,j,true);
}
function fillallsels()
{
   for (var j = 0; j < numCols; j++)
      fillcolsels(j);
}
 
function updatepic(tmp,n,jj)
{
   /*var tt = piccount;
   for (var Z=NUMROWS-1; Z>n; Z--)
       for (var j=numCols-1; j>=0; j--)
           if (ctype[j]=='u')
               tt--;
   for (var j=numCols-1; j>=jj; j--)
           if (ctype[j]=='u')
               tt--;
   hints[tt] = "<img src=\"" + tmp + "\">";
   */
  // if (tmp!=mat[n][jj] && typeof myHint!='undefined')
  //     myHint = new THints (HINTS_CFG, hints);
}
 
function showbuthint(but,e,j)
{
   if (typeof showmyhint=='function')
       showmyhint(j); 
}

if (initialhintneed(3))
{
   var ugentmsg = initialhint(3);
}

function disablefuncbut(b)
{
   if (typeof(hidemyhint) == 'function')
      hidemyhint();
   if (b==null) b = true;
   if (typeof(f2.savebtn)!='undefined')
   f2.savebtn.disabled = b;
   if (typeof(f2.newbtn)!='undefined')
              f2.newbtn.disabled  = b;
   if (typeof(f2.delbtn)!='undefined')
   f2.delbtn.disabled  = b;
}
whichcell = function(Z,j)
{
   return document.getElementById("cell" + Z + "_" + j);
}
//document.write("<input name=s onblur=\"this.value=retrv(0,parseInt(this.value))\">");

if (document.getElementById)
{
var maintbl = document.getElementById("maintable");
if (maintbl!=null)
{
   var nh = maintbl.rows[0].cells.length;
   var colspans = new Array(nh);
   for (j=0; j < nh; j++)
   {
      colspans[j] = maintbl.rows[0].cells[j].colSpan;
   }
   
   var rowc = maintbl.insertRow(0);
   rowc.setAttribute("height","2px");
   for (j=0; j < nh; j++)
   {
      var cell = rowc.insertCell(j);
      cell.setAttribute("name","unientry" + j);
      cell.name = "unientry" + j;
      cell.colSpan = colspans[j];

      cell.onclick = function(){showunientry(this);}
      cell.style.cssText = "cursor:pointer;background-color:" + DBGCOLOR;
      //cell.style.cssText = "background-color:black";
   }
}
}
function showunientry(td)
{
   if (document.getElementById("floatbuts")!=null)
      repeatrow(0,2);
   if (NUMROWS==0) return;
   var maintbl = document.getElementById("maintable");
   var jj = parseInt(td.name.substring(8));
   var cell = maintbl.rows[1].cells[jj];
   var cellstr = "" + cell.onclick;
   var j = cellstr.indexOf("sort(");

   j  = parseInt(("" + cell.onclick ).substring( 5 + j).replace(/\).*/,''));
   
   
   var xy = findPositionnoScrolling(td);
   var XY = findPositionnoScrolling(maintbl);
   var tblwidth = maintbl.offsetWidth;

   var fdiv = document.createElement("div");
   fdiv.setAttribute("id", "floatbuts");
   var xx = xy[0] - 60;
   if (xx < XY[0])
      xx = XY[0];
   else if ( xx + 3*font_size*charwidthrate() > XY[0] + tblwidth)
      xx = XY[0] + tblwidth - Math.ceil(3*font_size*charwidthrate());
   fdiv.style.cssText = "position:absolute;top:" + (xy[1]+2) +"px;left:"
   +xx +"px;margin:0px 0px 0px 0px;padding:0 0 0 0";
   fdiv.innerHTML = "<table cellpadding=0 cellspacing=0><tr >"
 + "<td><input type=button class=GreenButton style=width:"
 + Math.ceil(font_size*charwidthrate()) + "px onclick=repeatrow(" + j +",0) value=\"" + textmsg[327] +"\"></td>"
 + "<td><input type=button class=RedButton  style=width:"
 + Math.ceil(font_size*charwidthrate()) + "px onclick=repeatrow(" + j +",1) value=\"" + textmsg[328] +"\"></td>"
 + "<td><input type=button class=GreenButton  style=width:"
 + Math.ceil(font_size*charwidthrate()) + "px onclick=repeatrow(" + j +",2) value=\"" + textmsg[18] +"\"></td>"
 + "</tr></table>";
 
  document.body.appendChild(fdiv);
}
var  div1 =  document.getElementById('titlediv');
if(div1!=null)
{  
    div1.onmouseover=function(){ if (typeof(showmyhintstr) != 'undefined') showmyhintstr(ZQ[0]);}
    div1.onmouseout=function(){hidemyhint();};
}

function repeatrow(j, way)
{
   if (way==2){document.body.removeChild(document.getElementById("floatbuts")); return;}
   var et = (ctype[j] == ctype[j].toLowerCase());
   var vl = retrv(0,j);
   for (var i=1; i < NUMROWS; i++)
   {
      if ( (way==1 && retrv(i,j)!=vl || retrv(i,j)==nullvalue[j]) && (et || i >=numRows))
      {
         setv(i,j,vl);
         valuechanged[i] = true;
      }
   }
}

function showtootbar()
{
   let cont = document.getElementById('toolbar0');
   cont.style.display = 'block';
   let p = allainputeles.lastIndexOf("<tr>");
   allainputeles = allainputeles.substring(0,p);
    
}
function hidetoolbar()
{
    let cont = document.getElementById('toolbar0');
    cont.style.display = 'none';
    allainputeles += "<tr><td  class=BlackButton style=\"background-image:linear-gradient(var(--ibgcolor),var(--hibgcolor));color:white;font-family:" + defaultfontfamily + "\" onclick=\"showtootbar()\"><nobr>" + textmsg[1889] +"</nobr></td></tr>";
}
 



 
 
 

  
