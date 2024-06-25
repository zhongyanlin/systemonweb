var f2 = document.thisform;
f1 = document.form1;
var nn;
 
function updateFoot(init)
{
  if (hasfoot)
  for(var j=0;j<numCols;j++)
  {
     var tmp = calfoot(j,init);
      
     if (tmp!=null)
     {
        if (ctype[j]=='n'||ctype[j]=='N'||ctype[j]=='m'||ctype[j]=='M')
           setv(NUMROWS,j,tmp);
        else
        {
           var xx = ele(NUMROWS,j);
           if (xx!=null) xx.value = tmp;
        }
     }
  }
}
showattachment = function(str,r) 
{
    if (ctype[cc] == 'h')  return;
    if (cc<0 || cc >= numCols) return;
    var y =  document.getElementById('theattach'+rr + "_" + cc);
    if (y==null) return;
    var x =  str;
    if (x==null) return;
    
    var attarr = "";
   
    if (typeof(fsnd.attach)!='undefined')  fsnd.attach.value = str;
    
    else if (typeof(fsnd.Attachment)!='undefined') fsnd.Attachment.value = str;
 
    if (ctype[cc] == ctype[cc].toLowerCase()) 
    {
        if (str != '')
        {  
            attarr = ResizeUploaded.unzip(str).replace(/@[^,]+,/g, ',').replace(/,/g, ', ').replace(/, $/, '');   
            
        }
    }
    else
    {
        if (str != '')
        {  
            attarr = viewattachment(str);
            
        }
    }
     
    y.innerHTML = attarr;
      
}
function populate(fills)
{ 
     
           var kk=0;
           var localnum = 0;
           var ct;
           for (var r = 0; r < numRows; r++)
           {
           for (var c = 0; c < numCols; c++)
           {
               ct = ctype[c].toLowerCase();
               if (fields[c].toLowerCase().indexOf("attach") == 0)
               {
                   cc = c;
                   rr = r;
                   
                   showattachment(mat[r][c],r);
               }
               else   if ( fills || (ctype[c]!='L' && ct != 't' && ct != 'm' && ct!='n' && ct!= 's' && ct!='c'))
               {
                   setv(r,c,mat[r][c]);
               }
           }
           valuechanged[r] = false;
           }
            for (r = numRows; r < NUMROWS; r++)
           {
               for (c = 0; c <  numCols ;c++)
               if (fields[c].toLowerCase().indexOf("attach") == 0)
                   ;
               else if (ctype[c]=='h')
               {
                   setv(r,c,defaultValue(r,c));
               }
               else if (ctype[c]=='b' || ctype[c]=='B')
               {
                   //ele(r,c).parentNode.nextSibling.setAttribute("onclick",  "setv(" + r +"," + c +",'" + defaultRecord[c].replace(/'/g, "\\'") +"')"  ); 
               }
               else if (retrv(r,c) == 'null')
                   setv(r,c,'');
               valuechanged[r] = false;
             
           }
          
          updateFoot();

}
 
resumehalted = function ()
{
    if (typeof(expiretime) != 'undefined')
    {
        expiretime = activeidletime + (new Date()).getTime();
    }
    setactionhelp( nn );
}
function resubmitform()
{
    setactionhelp(nn);
}
function setaction( n )
{
     
    if (periodvalue==1)
    {
       if (rr>=0 && cc>=0) 
           U(rr,cc);
    }
    nn = n;
    var rightnow = (new Date()).getTime();
    setactionhelp( n );
   expiretime = activeidletime + rightnow;
}

function setactionhelp( n )
{
    
           doblankkey();
           var did = false;
           var i;
           switch(n)
           {
              case 1:
                nn = 1;
                if (onsave!='') eval(onsave);
                if (validating != '')
                {
                   if (validating!=' ') myprompt(validating);
                   window.focus();
                   if (typeof(disablefuncbut) == 'function')
                   {
                      disablefuncbut(false);
                   }
                   return false;
                }
                else  if ( formstr() == true)
                {     
                    var fes = f2.elements;
                    for (var i=0; i < fes.length; i++)
                      fes[i].disabled = false; 
                    formnewaction(f2);
                   
                    f2.target =   'w' + tstmp;
                    
                   visual(f2);
                    f2.submit();
                    
                    did = true;
                }
                else if (typeof(disablefuncbut) == 'function')
                {
                    disablefuncbut(false);
                }
                for (i=0; i < self.frames.length; i++)
                   if (typeof(self.frames[i].name)!='undefined' && self.frames[i].name !=null && self.frames[i].name.indexOf("iframe") == 0 
                      && self.frames[i].name!=null && self.frames[i].setactionhelp(1))
                      did = true;
                break;

              case 2:
                nn = 2;
                did = formstr();
                for (i=0; i < self.frames.length; i++)
                {
                    if (typeof(self.frames[i].name)!='undefined' && self.frames[i].name !=null  && self.frames[i].name.indexOf("iframe") == 0 && self.frames[i].setactionhelp(2))
                       did =true;
                }

                break;
              case 5:
                if (NUMROWS==1 )
                      checkone(f1.checkbox);
                else
                for (i = 0; i <  numRows ; i++)
                    checkone(f1.checkbox[i]);

              case 3:
                  
                 for (i=0; i < self.frames.length; i++)
                 {

                    if (typeof(self.frames[i].name)!='undefined' && self.frames[i].name !=null && self.frames[i].name.indexOf("iframe") == 0)
                    {
                       var nm = self.frames[i].name;
                        nm = nm.substring(6);
                       
                       var xx = nm.indexOf("_");
                       var yy = parseInt(nm.substring(0,xx));
                       if ( (yy == 0 && NUMROWS == 1 && f1.checkbox.checked || NUMROWS >1 && f1.checkbox[yy].checked) &&
                             self.frames[i].setaction(5))
                          did =true;
                    }
                 }
                nn = 3;

                if ( formstr() == true)
                {
                    formnewaction(f2);
                
                   visual(f2);
 f2.submit();
                    did = true;
                }
                else if (typeof(disablefuncbut) == 'function')
                {
                    disablefuncbut(false);
                }

            }
            return did;
}

function showNext()
{
   myprompt( query+'\n\n'+insertQuery+'\n\n'+updateQuery+'\n\n'+deleteQuery  );
}

function filloutOptions()
{
           for (var ii = 0; ii <  numCols  ; ii++)
              sw[ii] = 1;
           for (var r = 0; r <  NUMROWS  ;r++)
              for (var c = 0; c < numCols  ;c++)
              {
                 if (ctype[c]=='s' || ctype[c]=='S')
                  {
                       var name=ele(r, c);
                       name.options[0] =  new Option('','NULL');
                       if (options[c] != null)
                       for (var j=0; j < options[c].length; j++)
                       { 
                         if (captions[c][j].indexOf('...')>=0 )
                            name.options[j+1] = new Option(textmsg[925] +"...",captions[c][j]+options[c][j]);
                         else if (options[c][j].indexOf('...')>=0)
                            name.options[j+1] = new Option(textmsg[925] +"...", options[c][j]);
                         else
                            name.options[j+1] = new Option(captions[c][j],options[c][j]);
                          
                      }
                  }
              }
}

checkone = function(i,b)
{
   if (b==null) b = true;
   if (f1.checkbox.length == 1 )
   {
      if (i==0) f1.checkbox.checked = b;
   }
   else if (i < f1.checkbox.length)
   {
      f1.checkbox[i].style.visibility = "visible";
      f1.checkbox[i].checked = b;
   }
}


copycheck  = function (i,j)
{
    f1.checkbox[i].checked =  f1.checkbox[j].checked;
}
checkread = function (i){ return f1.checkbox[i].checked;}

function checkall()
{
             var b = f1.check1.checked;
             if (NUMROWS==1)
                 f1.checkbox.checked = b;
             else
             for (var i = 0; i <  numRows ; i++)
             {
                 f1.checkbox[i].checked = b;
             }
}

function replaceAll(a, b, c)
 {

           var d = a;
           c = ''+c;
           c=c.replace(/'/g,"''");

           while (d.indexOf(b) > -1)
           {

              d = d.replace(b, c);
           }
           return d;
}

var dsize = new Array( numCols  );

function copy()
{
          for (var j = 0; j <  numCols  ; j++)
          {
               dsize[j] = 0;
               for (var i = 0; i <  numRows ; i++)
               {
                     if ( mat[i][j] != null &&dsize[j] < mat[i][j].length)
                   dsize[j] = mat[i][j].length ;
               }
               if (dsize[j] > 40)
                   dsize[j]  = 40;
               if (dsize[j] < fields[j].length)
                   dsize[j] = fields[j].length;

          }
          var  str = '';
          for ( j = 0; j <  numCols  ; j++)
          {
               str += pad(fields[j], dtype[j], dsize[j]);
          }
          str += '\n';
          var kk = 0;
          for ( i = 0; i <  numRows ; i++)
          {
               if (f1.checkbox[i].checked )
               {

                  for ( j = 0; j <  numCols  ; j++)
                  {
                     str += pad(mat[i][j], dtype[j], dsize[j]);
                   }
                   str += '\n';
                   kk++;
               }
          }
         if ( kk == 0 )
            str = textmsg[247];
         var handle =  openblank('blank','menubar=0;toolbar=0,schrollbars=1,resizable=1',title);
         handle.document.write('<center><h2>' + title + '</h2><font face="New Courier"><pre>'+str+'</pre>');
         endDocWrite(handle);
}

function copy1()
{
           f2.query.value= query;
           f2.title.value = title;
           formnewaction(f2, "DataHTML");
           var handle = window.open('','report','toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=300,width=300');
           f2.target = 'report';
          visual(f2);
 f2.submit();
}

function pad(str, isnum, siz)
{

           if (str == null) str = '';
           var b = '';
           for (var i = 0; i < siz- str.length ; i++)
              b += ' ';
           if (isnum) return ' ' +b + str;
           return ' '+str+b;
}

//helpstr += "</td></tr></table>";
if (deleteQuery != '')
   helpstr += "<br><b><font color=purple>"+textmsg[248]+
      "</font></b><br>"+textmsg[249]+"<b style=background-color:#cc0000;color:white>&nbsp;"+textmsg[69]+"&nbsp;</b>" + textmsg[183] +"<br>";
helpstr += "<br><b><font color=purple>"+textmsg[250]+"</font></b><br>"+textmsg[251];

function forerase(i)
{
             var erase =  (i < numRows)?1:0;
               for (var j = 0; j < numCols ; j++)
               {
                  var ww = retrv(i,j);
                  if (erase>0 &&  mat[i][j] != ww )
                  {
                        erase =   (  ww == ''  || dtype[j] && ww==null )?2:0;
                  }
               }
               if (erase == 2)
               {
                  if (NUMROWS==1)
                     checkone(f1.checkbox);
                  else
                     checkone(f1.checkbox[i]);
               }
}

function formdeletestr()
{
              var sqlstr = '';
              rowInvolves = '0';

              for (var i = 0; i <  numRows ; i++)
              {
                   forerase(i);
                   if (NUMROWS==1 && f1.checkbox.checked || NUMROWS > 1 && f1.checkbox[i].checked )
                   {
                        var setstr = subs(deleteQuery,i);
                        sqlstr +=  "d"+setstr  + ';';
                        if (rowInvolves == '0') rowInvolves += i;
                        else rowInvolves += ',' + i;
                        whichaction = 'del';

                   }
              }
              if (rsaenccode=='2'|| rsaenccode=='3')
             f2.wcds.value  += encryptString(sqlstr);
              else
              f2.wcds.value += sqlstr;
}

function keyfieldfilled(i)
{
   var ak = allkeyfields.split(/,/);
   for (var j=0; j < ak.length; j++)
   {
      var k = parseInt(ak[j]);
      if ('' + k == 'NaN' || insertQuery.indexOf("@@" + k +"@@") < 0 )
         continue;
      var xx = retrv(i, k);
      if (xx== nullvalue[k])
         return false;
   }
   return true;
}
function formupdatestr(querystr)
{
     
          numnew = 0;
          var sqlstr = '';
          rowInvolves = '1';
          for (var i = 0; i < NUMROWS ; i++)
          {
               if (valuechanged[i]==false  )
               { 
                   continue;
               }
               if (i >= numRows)
               {
                 
                  var bb =  keyfieldfilled(i);
                  if (bb == false)
                     continue;
               }

               if (domandatory(i) == false)
               {
                        if (NUMROWS==1)
                           checkone(f1.checkbox.checked);
                        else
                           checkone(f1.checkbox[i]);
                        numnew = 0;
                        continue;
               }

               var setstr =  "u" + querystr;
               if (i >= numRows)
               {
                   setstr = "i" + insertQuery;
               }


               setstr = subs(setstr,i);

               if (setstr!='')
               {
                  sqlstr +=  setstr  + ';';

                  if (i >= numRows) numnew ++;
                  if (rowInvolves == '1')
                      rowInvolves  += i;
                  else
                      rowInvolves += ',' + i;
               }
          }
          if (rsaenccode=='2'|| rsaenccode=='3')
             f2.wcds.value  += encryptString(sqlstr);
          else
             f2.wcds.value += sqlstr;

          whichaction='upd';
}

var nav1 = null;
function formstr()
{
           if (viewonly) return false;
           f2.id.value = iid;
           formnewaction(f2, "SaveBack");
           f2.target = "savewindow";
           rowInvolves = '';
           delaction = false;
           var sqls = f2.wcds;
           sqls.value ='';
           popstr = 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width= 200,height= 100';

           if (nn == 1)
           {
              if (f1.check1.value == 'all')
              {
                 if (NUMROWS==1)
                 {
                    f1.checkbox.checked = false;
                    if (exbut.indexOf("s")>=0) f1.checkbox.style.visibility = "hidden";
                 }
                 else if (NUMROWS > 1)
                 {
                    for (var k = 0; k < NUMROWS; k++)
                    {
                       f1.checkbox[k].checked = false;
                       if (exbut.indexOf("s")>=0) f1.checkbox[k].style.visibility = "hidden";
                    }
                 }
             }

             formupdatestr(updateQuery);
         
             if ( sqls.value == '' ) return (false);
          }
          else if (nn == 2)
          {
             if (updateQuery != '')formupdatestr(updateQuery);
             if (deleteQuery != '')formdeletestr();
             if ( sqls.value == '' ) return (false);
             sqls.value = sqls.value.replace(/\xFD/g,"<br>").replace(/\xFC/g,"<br>").replace(/\xFB/g,"<br>");
             
         }
          else if (nn == 3)//delete
          {
             for ( k = 0; k < numRows; k++)
                deleted[k] = false;
              
             if (deleteQuery != '')
                formdeletestr();
             if ( sqls.value == '' )
                return (false);
          }
         
          if (typeof(checkrs)!='undefined')
              tinywin = 'w'+tstmp;
          
          if (tinywin!='w'+tstmp)
          {
             popstr = dim(340,300).replace(/menubar=0/,"menubar=1");
             nav1 = window.open("", tinywin, popstr); 
          }
          f2.target =  tinywin ;
         
          if ( nn != 2)
          {
             return (true);
          }
          if (nav1!=null)
             myprompt(sqls.value);

          return (false);
}
var es;
function syn(z,ss,em1)
{
   
        
       es = em1;
       if (z == 'del')
    {
        if ((ss.replace(/[0-9|a-z]/ig,'').replace(/[\-|_|\.|\$]/g,'')=='') && typeof (ResizeUploaded.refreshatt) == 'function')
            ResizeUploaded.refreshatt();
        return 1;
    }
       if (typeof(disablefuncbut) == 'function')
       {
          disablefuncbut(false);
       }

       if (z.indexOf("web")==0)
       {
           alluploadedfiles += ss + '@'+ z.substring(4) + ",";
           counter = rr;
           ResizeUploaded.uploaded(z,ss);
           return 0;
       } 
       
       ResizeUploaded.alluploaded = "";
       
        if (f1.checkbox == null) return 0;
        if (whichaction=='savesql')
        {
                 if (parseInt(z)>=0)
                    refreshindex();
                    return 0;
        }
        else if (whichaction=='cret' || whichaction=='upda')
        {
                  if (parseInt(z)>=0)
                    save();
                    return 0;
        }
        window.onbeforeunload = null;
        return  multirowdatasaved(z,ss);
}

function rewriteRowtotal()
{
    var tt = null;
    if (document.getElementById && (tt=document.getElementById("rowtotal"))!=null)
    {
        tt.innerHTML = "" + numRows;
    }
}


function growaRow()
{
   mat[NUMROWS]= new Array(9);
}
function passover(r,c)
{
         return retrv(r,c);
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

function setNUMROWS(str)
{
    NUMROWS = str;
}

function getMat(r,c){return mat[r][c];}

function setMat(r,c,str){mat[r][c] = str;}

function setCell(r,c,str)
{
    setv(r,c,str);
    if (hasfoot)
    { 
       var qu = ele(NUMROWS,c);
       if (qu!=null)
       qu.value = calfoot(c,1);
    }
}

function setNumRows(ii)
{
  numRows = ii;
}

function getPassed2(str)
{
   getPassed(str);
   passedRow++;
}

function getPassed1(k,str)
{
   k+= passedCol;
   setCell(passedRow, k, str);
}

function getPassed(str)
{
   if (passedRow < 0 || passedCol < 1) return;
   if (ctype[passedCol-1] != 'a' && ctype[passedCol-1] != 'A')
       str = str.replace(/\n/g,',');
   x = retrv(passedRow, passedCol-1);
   setv(passedRow, passedCol-1, str);
   valuechanged[passedRow] = true;
   v = str;
   cc = passedCol-1;
   rr = passedRow;
   if (cellonblur!='') eval(cellonblur);
}

function fontstr(partname, fontname, dname, fontsize,dsize1, fontcolor, dcolor, bgcolor,k)
{
   var fot = textmsg[1594]; var fontarr = fot.split(/@/);
   var str = "<table  width=100%  border=0 bgcolor=" + bgcolor + "><tr><td width=120><nobr>" + partname +textmsg[737] +":</nobr> </td><td > <nobr> { "
   +textmsg[737]+ "</nobr></td><td><select   name=" + fontname + " onchange=testfont1(1,this,"+k+",'" +bgcolor+"') >";
   
   for (var i=0; i < fontarr.length; i++)
   {
      fontarr[i] = fontarr[i].replace(/,.*$/,'');
      str +="<option value=\"" + fontarr[i] +"\" ";
      if (fontarr[i]==dname) str +=" selected ";
      str +=">" + fontarr[i] +"</option>";
   }
   str +="</select></td><td><nobr> "+textmsg[734]+ "</nobr></td><td> <input  style=\"border-radius:2px;border:1px #b0b0b0 solid\"   name=" + fontsize +" value=\"" + dsize1 +"\" size=3 onchange=testfont(2,this.value,"+k+",'" +bgcolor+"')></td><td><nobr>pt  &nbsp;"
   +textmsg[738]+ "</nobr></td><td><input  type=color   name=" + fontcolor +" value=\"" + dcolor +"\" size=4 onchange=testfont(3,this.value,"+k+",'"
   +bgcolor+"')></td><td>} </td><td id=\"samplelooks" + k
   +"\" style=\"background-color:" + bgcolor +";color:"
   + dcolor +";font-family:" + dname +";font-size:" + dsize1 +"\"><nobr>" + textmsg[796] +"</nobr></td></tr></table>";
  
   return str;
}

var printstylestr = localStorage["print-" + rdapname];

if (printstylestr==null || printstylestr=='')
{
    if (typeof(someconsts)!='undefined') 
        printstylestr="image/tm.gif," + someconsts[1].replace(/,.*$/,'') + ",28,#FF0000," + someconsts[1].replace(/,.*$/,'') + ",12,#0000FF," + someconsts[1].replace(/,.*$/,'') + ",12,black,1";
    else
        printstylestr="image/tm.gif,arial,28,#FF0000,arial,12,#0000FF,arial,12,black,1";
}
function resetdefualtprint()
{
   if (typeof(someconsts)!='undefined') 
        printstylestr="image/tm.gif," + someconsts[1].replace(/,.*$/,'') + ",28,#FF0000," + someconsts[1].replace(/,.*$/,'') + ",12,#0000FF," + someconsts[1].replace(/,.*$/,'') + ",12,black,1";
    else
        printstylestr="image/tm.gif,arial,28,#FF0000,arial,12,#0000FF,arial,12,black,1";
   localStorage.removeItem("print-" + rdapname);
   printing();
}

var rowselection = "1-" + NUMROWS;

var lineFolding = false;
var captionvalue = true;
function whichcell1(k)
{
   return  document.getElementById("samplelooks" + k);
}
var styleeles = [];
function go()
{
    if (document.f.tfontname.selectedIndex>=0)
        printstyle(document.f.logo.value,document.f.tfontname.options[document.f.tfontname.selectedIndex].value,document.f.tfontsize.value,document.f.tfontcolor.value,document.f.tborder.value,document.f.hfontname.options[document.f.hfontname.selectedIndex].value,document.f.hfontsize.value,document.f.hfontcolor.value,document.f.cfontname.options[document.f.cfontname.selectedIndex].value,document.f.cfontsize.value,document.f.cfontcolor.value);
}
function testfont1(i,th,j,c)
{
    var k=th.selectedIndex;
    if (k>-1){testfont(i,th.options[k].value,j,c);}
}
function testfont(i,v,j,c)
{
    styleeles[i+3*(j-1)] = v;
    
    var cel= document.getElementById("samplelooks" + j);
    if (cel!=null)
        cel.style.cssText='background-color:'+c+';font-name:'+styleeles[1+(j-1)*3]+';font-size:'+styleeles[2+(j-1)*3]+';color:'+styleeles[3+(j-1)*3];
     
}

var illustration = "";
function setIllustation(ta){illustration=ta.value;}
function printing()
{
    if (periodvalue ==1)
    {
        if (rr>=0 && cc>=0)
        U(rr,cc);
    }
    styleeles = printstylestr.split(",");
    var str = '';
    str += ("<table border=0 valign=center align=center style=\"margin:4px 4px 4px 4px\" > <tr><td align=center>  ");
    str += ("<form rel=opener name=f margin=\"5 0 0 0\"  >");
    str += ("<table cellpadding=0 cellspacing=0 class=outset1 width=100%><tr><td>");
    str += ( "<TABLE width=100% cellpadding=0 cellspacing=1 class=outset1  border=0>");
    str += ( "<TR bgcolor=" + DBGCOLOR + "><td  width=100% align=center>");
    str += (textmsg[736]+ "<input  style=\"border-radius:2px;border:1px #b0b0b0 solid\"  name=logo size=30 onblur=\"document.f.logoimg.src=this.value\" value=\"" + styleeles[0] +"\"><br><img name=logoimg src=\""+styleeles[0] +"\">");
    str += ("</td></tr></table></td></tr></table><br>");
    str += ("<table cellpadding=0 cellspacing=0 class=outset1 width=100%><tr><td>");
    str += ( "<TABLE width=100% cellpadding=0 class=outset1 cellspacing=1 border=0>");
    str += ( "<TR bgcolor=" + DBGCOLOR + "><td  width=100% align=center>");
    str += (fontstr(textmsg[441], "tfontname", styleeles[1], "tfontsize", styleeles[2], "tfontcolor", styleeles[3], DBGCOLOR,1));
    str += ("</td></tr></table></td></tr></table><br>");
    str += ("<table cellpadding=0 cellspacing=0 class=outset1  width=100%><tr><td>");
    str += ( "<TABLE width=100%  class=outset1><tr><td valign=top>");
    str += (textmsg[143]+ "</td><td><textarea name=notes rows=2 style=width:98% cols=70 onblur=setIllustation(this)></textarea></td></tr></table>");
    str += ("</td></tr></table><br>"+textmsg[741]+ "<input  style=\"border-radius:2px;border:1px #b0b0b0 solid\"    name=tborder value="+styleeles[10] +" size=7><br>");

    str += ("<table cellpadding=0 cellspacing=0 class=outset1  width=100%><tr><td bgcolor=\"" + IBGCOLOR + "\">");
    str += ( "<TABLE width=100% cellpadding=3 cellspacing=1 border=1  bgcolor="+ DBGCOLOR + " style=border-collapse:collapse>");
    str += ( "<TR bgcolor=\"" + BBGCOLOR + "\"><td  width=100% colspan=" + (numCols+1) +">");

    str += (fontstr(textmsg[739], "hfontname", styleeles[4], "hfontsize", styleeles[5], "hfontcolor", styleeles[6],BBGCOLOR,2));
    str += ("</td></tr>");
    
    let str1 = "<tr ><td><nobr><b>"+textmsg[816]+ "</b></nobr></td>", str2 = "<tr><td><nobr><b>"+textmsg[732]+ "</b></nobr></td>", str3="<tr><td><nobr><b>"+textmsg[733]+ "</b></nobr></td>";
    for (var i =0; i < numCols; i++)
    {
      if (fields[i] == 'onload'||fields[i] == 'onclose' || fields[i] == 'onbegin' || fields[i] == 'cellonfocus' || fields[i] == 'cellonblur' ||
      fields[i] == 'onsaved' || fields[i] == 'exbut' ) continue;
      str1 += ("<td bgcolor=\"" + BBGCOLOR + "\" valign=top> <nobr>" + labels[i] + "</nobr> </td>");
      str2 +=  "<td><center><input type=checkbox name=c" + i +" value=on onclick=setcustom(((this.checked)?'t':'f'),"+i+") ";
      if (ctype[i]=='h') str2 += (" checked ");  str2 += ("></center></td>");
      str3 +=  "<td><center>";
      if (ctype[i]=='t' || ctype[i]=='a'|| ctype[i]=='T' || ctype[i]=='A' || ctype[i]=='u' || ctype[i]=='U')
      {
         str3 += (" <input style=\"border:1px #b0b0b0 solid;border-radius:2px;text-align:right\" size=2 name=w"+i +" value=\""+fsize[i] +"\" onkeypress=\"return isDigitEvent()\" onchange=setcustom(this.value," +i +")>");
      }
      str3 += ("</center></td>");
     }
     str1 += ("</tr>"); str2 += ("</tr>");str3 += ("</tr>");
     str += str1 + str2 + str3;
     var vv = ""; if (typeof(hasroworder) != 'undefined' && hasroworder) vv = "checked";
     str += ("<tr height=30>    <td width=100%   colspan=" + (numCols+1) +" bgcolor=" + TBGCOLOR +">");
     str += ("<input type=checkbox name=c00 value=on onclick=setcustom(((this.checked)?'t':'f'),-4) " + vv +" > <b><nobr>" +
     textmsg[789]
     + "</nobr></b><br>");
     vv = ""; if (!captionvalue) vv = "checked";
     str += ("<input type=checkbox   name=c01 value=on onclick=passLineFolding(!this.checked,0)  " + vv + " > <b><nobr>" +
     textmsg[788]
     + "</nobr></b><br>");
     vv = ""; if (lineFolding) vv = "checked";
     str += ("<input type=checkbox name=linefolding onchange=passLineFolding(this.checked,1)  " + vv + " > <b><nobr>"  + textmsg[743]+ "</nobr></b></td></tr>");
     str += ("<tr  height=30>    <td width=100%   colspan=" + numCols +">");
     str += (fontstr(textmsg[740], "cfontname", styleeles[7], "cfontsize", styleeles[8], "cfontcolor", styleeles[9], TBGCOLOR,3));
     str += ("</td></tr> <tr  height=30><td width=100%   colspan=" + numCols +"  bgcolor=" + TBGCOLOR +"><nobr> "+textmsg[742]+ " <input name=rowselect  style=\"border-radius:2px;border:1px #b0b0b0 solid\"  size=22 value=\"" + rowselection + "\" onblur=passRowselect(this.value)> (" + textmsg[750] +":  13-15,18) </nobr></td></tr>");
     str += ("</table></td></tr></table> <link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\" /><br>");
     str += ("<input  class=GreenButton style=width:" + butwidth(textmsg[744])*1.3 + "px type=button name=btn value=\"" + textmsg[744]+ "\" onclick=resetdefualtprint()   >");
     str += ("<input  class=GreenButton style=width:" + butwidth(textmsg[408])*1.3 + "px type=button name=btn value=\"" + textmsg[408] +"\" onclick=go()  >");
     str += ("<input  class=GreenButton style=width:" + butwidth(textmsg[408])*1.3 + "px type=button name=btn value=\"CSV\" onclick=downloadcsv()  >");
     str += ("</form></td></tr></table>");
    // str += ("<center> <font size=-1>"+textmsg[790]+"</font></center>");

     myprompt(str,null,null,textmsg[735]);
     promptwin.style.width = "450px";
}

function passRowselect(rs)
{
  rowselection  = rs ;
}

function isinrange(k)
{
   var  rowselectionarray = rowselection.split(/[ ]*,[ ]*/);
   k++;
   for (var i=0; i < rowselectionarray.length; i++)
   {
      var tt = rowselectionarray[i].split(/[ ]*-[ ]*/);
      if (tt.length == 1)
      {
         if (rowselectionarray[i] == '' + k) return true;
      }
      else
      {
         var b1 = parseInt(tt[0]);
         var b2 = parseInt(tt[1]);
         if ( '' + b1 == 'NaN' || '' + b2 == 'NaN') continue;
         if (b1 <= k && b2 >= k) return true;
      }
   }
   return false;
}

function passLineFolding(b,vv)
{
   if(vv==0) captionvalue = b;
   else lineFolding = b;
}


function printstyle1(logo, tfontname, tfontsize, tfontcolor, bord, hfontname, hfontsize, hfontcolor, cfontname, cfontsize, cfontcolor)
{
    var nrec = numRows;
    if (nrec == 0)
        nrec = 1;
    var allrs = [];
    for (var r = 0; r < nrec; r++)
    {
        if (isinrange(r))  
            allrs[allrs.length] = r;
    }
     
    printstylestr = logo + ',' + tfontname + ',' + tfontsize + ',' + tfontcolor + ',' + hfontname + ',' + hfontsize + ',' + hfontcolor + ',' + cfontname + ',' + cfontsize + ',' + cfontcolor + ',' + bord;
    localStorage["print-" + rdapname] = printstylestr;
    var a = [];
    a[0] = "<style>\nh1{font-family:" + tfontname + ";font-size:" + tfontsize + "pt;color:" + tfontcolor + ";text-shadow:#606060 1px 1px}\n"
            +   "h2{font-family:" + tfontname + ";font-size:" + (tfontsize-7) + "pt;color:" + tfontcolor + ";text-shadow:#606060 1px 1px}\n"
            + " td.heading{font-family:" + hfontname + ";font-size:" + hfontsize + "pt;color:" + hfontcolor + ";width:100px;font-weight:bold}\n"
            + " td.cell{font-family:" + cfontname + ";font-size:" + cfontsize + "pt;color:" + cfontcolor + ";width:" + (bord-106) + "px;}\n</style>";
    a[1] = "<title>" + title + "</title></head>\n<body style=\"margin:4px 4px 4px 4px\">\n";
    var systemnamestr = systemname();
    if (systemnamestr == null) systemnamestr = "";
    a[a.length] = ("<center>\n<img src=" + logo + ">\n<h2>" + systemnamestr + "</h2>\n<h1>" + title + "</h1>\n</center>\n<table align=center cellspacing=0 cellpadding=0 >");
    var printfoot = true;
    var fmt = '0';
    var needlatex = false;
    var roundc = "",roundc1="";
    for (var r0 = 0; r0 < allrs.length; r0++)
    {
        r = allrs[r0];
        if (r0 > 0)
        a[a.length] = ("<tr height=40><td></td></tr>");
       
        a[a.length] = ("<tr><td align=left style=\"border:2px #dddddd solid;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px\">");
        if (bord <800) bord = 800;
        a[a.length] = ("<table align=left cellspacing=1 cellpadding=5  style=\"width:" + bord + "px;border-collapse:collapse;border:0px;background:linear-gradient(180deg,#E0F4A3,#EBF7C3);border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px\">");
        var wvalue = "";
        var alljs = [];
        for (var j = 0; j < numCols; j++)
        {
            if (ctype[j] == null)
                ctype[j] = "";
            if (ctype[j] != 'h' && ctype[j] != 'k')
                alljs[alljs.length] = j;
        }
        
        for (var j0=0; j0 < alljs.length; j0++)
        {
            var str = null;
            j = alljs[j0];
            
            roundc = roundc1 = "";
         
           if (j0 == 0)
           {
               roundc = "style=\"border-top-left-radius:6px;-webkit-border-top-left-radius:6px;-moz-border-top-left-radius:6px\"";
               roundc1 = "style=\"border-top-right-radius:6px;-webkit-border-top-right-radius:6px;-moz-border-top-right-radius:6px;\"";
           }
           else if (j0 == alljs.length-1)
           {
               roundc = "style=\"border-bottom-left-radius:6px;-webkit-border-bottom-left-radius:6px;-moz-border-bottom-left-radius:6px;\"";
               roundc1 = "style=\"border-bottom-right-radius:6px;-webkit-border-bottom-right-radius:6px;-moz-border-bottom-right-radius:6px;\"";
           }
           a[a.length] = ("<tr><td valign=top class=heading " +  roundc +">");
            if (fields[j].indexOf("nolabel") != 0)
            {
                str = labels[j]; 
                if (str != null)
                {
                    str = str.replace(/([a-z])([A-Z])/g, "$1&nbsp;$2");
                    str = str.substring(0, 1).toUpperCase() + str.substring(1);
                    a[a.length] = ( str  );
                }
            }
            a[a.length] = ("</td><td  class=cell  " +  roundc1 +">");
            if (mat[r][j] == null)
            {
                if (dtype[j]) 
                    mat[r][j] = '0';
                else
                    mat[r][j] = '';
            }
            str = retrv(r, j);
            
            x = ctype[j];
            if (x != 'L')
                x = x.toLowerCase();
            var jj = 0;
            
            var sa = '';
            var rowsize = '';
            var colsize = '';
            switch (x)
            {
                case 'i':
                case 'n':
                    sa = fsize[j].split("_");
                    if (sa.length > 0)
                        rowsize = sa[0];
                    else
                        rowsize = "10";

                    if (sa.length > 1)
                        colsize = sa[1];
                    else if (ctype[j] == 'i')
                        colsize = "30";
                    else
                        colsize = "2";
                   
                    if (ctype[j] == 'i')
                    {
                        a[a.length] = ("<iframe frameborder=0 width=" + colsize + " height=" + rowsize + " name=iframe" + j + "></iframe>");
                        openit(mat[r][j], r, 'iframe' + '_' +  j);
                    }
                    else
                    {
                       
                        a[a.length] = ( numberstr(str, ffsize[j]) );
                    }
                    break;
                case 'a': case 'f':
                    fmt = guessFormat(str);
                    if ('' + fmt == '2') 
                        needlatex = true;
                    str = formatmat(str,r,j);
                    if (str == '') str = "&nbsp;";
                    a[a.length] = ( str); 
                    break;
                    
                case 'b':
                    fmt = guessFormat(str);
                    if ('' + fmt == '2') 
                        needlatex = true;
                    str = Innergrid.makeinnertable(str, r, j, false);
                    
                    a[a.length] = ( str );
                    break;
                case 't':
                    if (fields[j].toLowerCase().indexOf('attach') >= 0)
                    {
                        a[a.length] = (  viewattachment(str)  );
                        break;
                    }
                case 'p':
                case '':
                   
                    a[a.length] = ( formatstr(str) );
                    break;
                case 'c':
                    a[a.length] = ("<input type=checkbox " + ((str == '0') ? "" : "checked") + ">");
                    break;
               
                case 'm':
                    
                    a[a.length] = ( timestr(str) );
                    break;
                case 'r':
                case 's':
                    if (options[j]==null) 
                    {
                        a[a.length] = (str);
                    } 
                    else
                    {
                        for (jj = 0; jj < options[j].length && retrv(r, j) != options[j][jj]; jj++) ;
                        if (jj < captions[j].length)
                            a[a.length] = (  captions[j][jj] );
                        else
                        {
                            a[a.length] = (str);
                        }
                    }
                    break;
                case 'w':
                    a[a.length] = ( multivalue(str, options, captions, j, dtype[j]) );
                    break;
                case 'l':
                    if ( onmydomain(opener))
                        a[a.length] = ("<a href=\"javascript:opener.openit1(" + r + "," + j + ")\">" +str + "</a>");
                    else
                        a[a.length] =  str ;
                    break;
                case 'L':
                    if ( onmydomain(opener))
                        a[a.length] = ("<a href=\"javascript:opener.openit2(" + r + "," + j + ")\">" + extractfromm(mat[r][j], false) + "</a>");
                    else
                        a[a.length] =extractfromm(mat[r][j], false);
                    break;
                case 'u':
                    a[a.length] = ("<img src=\"" + str + "\" >");
                    break;
            }
            a[a.length] = ("</td></tr>\n");
        }

        a[a.length] = ("</table></td></tr>");
    }

    a[a.length] = ("</table>");
    document.thisform.wcds.value = a.join("");
    formnewaction(document.thisform, "printdoc.jsp");
    visual(document.thisform);
document.thisform.submit();
    
}

printstyle = function(logo,tfontname,tfontsize,tfontcolor,bord,hfontname,hfontsize,hfontcolor,cfontname,cfontsize, cfontcolor)
{
    
    if (datapresentformat  != 'DataTable' )
    {
        printstyle1(logo,tfontname,tfontsize,tfontcolor,bord,hfontname,hfontsize,hfontcolor,cfontname,cfontsize, cfontcolor);
        return;
    }
    printstylestr = logo + ',' + tfontname + ',' + tfontsize + ',' + tfontcolor + ',' + hfontname + ',' + hfontsize + ',' + hfontcolor + ',' + cfontname + ',' + cfontsize + ',' + cfontcolor + ',' + bord + ',' + hasroworder;

    localStorage["print-" + rdapname] = printstylestr;
    var a = [];
    a[0] = "<style>\nh1{font-family:" + tfontname + ";font-size:" + tfontsize + "pt;color:" + tfontcolor + ";text-shadow:#606060 1px 1px}\n"
            +   "h2{font-family:" + tfontname + ";font-size:" + (tfontsize-7) + "pt;color:" + tfontcolor + ";text-shadow:#606060 1px 1px}\n"
            + "td.heading{font-family:" + hfontname + ";font-size:" + hfontsize + "pt;color:" + hfontcolor + ";background-color:" + BBGCOLOR +";font-weight:bold;border-right-width:1px;border-right-color:#bbbbbb;border-right-style:solid;border-bottom-width:1px;border-bottom-color:#bbbbbb;border-bottom-style:solid;}\n"
            + "td.heading1{font-family:" + hfontname + ";font-size:" + hfontsize + "pt;color:" + hfontcolor + ";background-color:" + BBGCOLOR +";font-weight:bold;border-bottom-width:1px;border-bottom-color:#bbbbbb;border-bottom-style:solid;}\n"
            + "td.cell{font-family:" + cfontname + ";font-size:" + cfontsize + "pt;color:" + cfontcolor + ";border-right-width:1px;border-right-color:#bbbbbb;border-right-style:solid;border-bottom-width:1px;border-bottom-color:#bbbbbb;border-bottom-style:solid;}\n"
            + "td.cell1{font-family:" + cfontname + ";font-size:" + cfontsize + "pt;color:" + cfontcolor + ";border-bottom-width:1px;border-bottom-color:#bbbbbb;border-bottom-style:solid;}\n"
            + "td.cell2{font-family:" + cfontname + ";font-size:" + cfontsize + "pt;color:" + cfontcolor + ";border-right-width:1px;border-right-color:#bbbbbb;border-right-style:solid;}\n" 
            + "td.cell3{font-family:" + cfontname + ";font-size:" + cfontsize + "pt;color:" + cfontcolor + "}\n</style>";
    a[1] = "<title>" +  title + "</title>\n</head>\n<body style=\"margin:4px 4px 4px 4px\" >";
    var orgname = systemname();
    if (orgname == null) orgname = "";
    a[a.length] = ("<center><img src=" + logo + ">" + (orgname==null?"":("<h2>" + orgname + "</h2>\n")) + "<h1>" + title + "</h1>");
    a[a.length] = illustration==''?'':('<table align=center><tr><td align=left style=font-family:' + tfontname + ';font-size:' + (parseInt(document.f.hfontsize.value)) +  'px;>' + illustration.replace(/</g, "&lt;").replace(/\n/g, "<br>") + '</td></tr></table>');
    a[a.length] = ("</center><table  align=center ><tr><td style=\"border:2px #bbbbbb solid;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px\"><table width=" + bord + " cellspacing=1 cellpadding=5  style=\"border-collapse:collapse;border:0px #cccccc solid;background:linear-gradient(180deg,#E3F9A9,#EBF7C3)\" ><tr>");
     
    if (hasroworder)
    {
        a[a.length] = ("<td  class=heading align=right>#</td>");
    }
    var alljs = [];
    for (var j = 0; j < numCols; j++)
    {
        if (ctype[j] == null)
            ctype[j] = "";
        if (ctype[j] != 'h' && ctype[j] != 'k')
            alljs[alljs.length] = j;
    }
    for (var j0 = 0; j0 < alljs.length; j0++)
    {
        j = alljs[j0];
        var roundc = "";
        if (j0 == 0)
        {
            roundc = "style=\"white-space:nowrap;border-top-left-radius:6px;-webkit-border-top-left-radius:6px;-moz-border-top-left-radius:6px\"";
        }
        else if (j0 == alljs.length - 1)
        {
            roundc = "style=\"white-space:nowrap;border-top-right-radius:6px;-webkit-border-top-right-radius:6px;-moz-border-top-right-radius:6px;\"";
        }
        else
            roundc = "style=\"white-space:nowrap;\"";
        a[a.length] = ("<td class=heading" + (j0 == alljs.length - 1?'1':'') + ' ' + roundc);
        if (ctype[j] == 'a' || ctype[j] == 'A' || ctype[j] == 't' || ctype[j] == 'T')
            a[a.length] = (" width=" + (parseInt(fsize[j]) * 7));
        else if (ctype[j] == 'u' || ctype[j] == 'U')
            a[a.length] = (" width=" + fsize[j]);
        if (dtype[j] && captionvalue == false || ctype[j] == 'n')
            a[a.length] = (" align=right");
        a[a.length] = ("><b><nobr>" + labels[j].replace(/([a-z])([A-Z])/g, "$1&nbsp;$2") + "</nobr></b></td>");
    }

    a[a.length] = ("</tr>");
    var rowordernum = 1;
    var printfoot = true;
    var allrs = [];

    for (var i = 0; i < numRows || i == numRows && printfoot && hasfoot; i++)
    {
        if (i < NUMROWS && isinrange(i) == false) {
            printfoot = false;
            continue;
        }

        if (i >= numRows && i < NUMROWS)
        {
            var k = 0;
            while (k < numCols && retrv(i, k) == nullvalue[k] || ctype[k] == 'h' || ctype[k] == 'k')
                k++;
            if (k == numCols)
                continue;
        }
        allrs[allrs.length] = i;
    }
    
    for (var i0 = 0; i0 < allrs.length; i0++)
    {
        i = allrs[i0];
        a[a.length] = ("<tr>");
        if (hasroworder)
        {
            a[a.length] = (
                    "<td  valign=top class=cell valign=top align=right>" + rowordernum + "</td>");
            rowordernum++;
            
        }
        var fmt = "0";
        var needl = false;


        for (var j0 = 0; j0 < alljs.length; j0++)
        {
            var str = null;
            j = alljs[j0];
            var roundc = "";
            if (i0 == allrs.length - 1 && j0 == 0)
            {
                roundc = "style=\"border-bottom-left-radius:6px;-webkit-border-bottom-left-radius:6px;-moz-border-bottom-left-radius:6px;\"";
            }
            else if (i0 == allrs.length - 1 && j0 == alljs.length - 1)
            {
                roundc = "style=\"border-bottom-right-radius:6px;-webkit-border-bottom-right-radius:6px;-moz-border-bottom-right-radius:6px;\"";
            }
            var ii = '';
            if (i0 == allrs.length - 1) 
            {
                if (j0 == alljs.length-1) 
                    ii = '3';
                else
                    ii = '2';
            }
            else
            {
                if (j0 == alljs.length-1) 
                    ii = '1';
                else
                    ii = '';
            }
            var td = "<td  valign=top class=cell" + ii + "  valign=top " + roundc;
            if (dtype[j])
            {  
                if (ctype[j].toLowerCase() == 'c')
                    td += " align=center ";
                else td += " align=right ";
            }
            if (ctype[j] == 'a' || ctype[j] == 'A' || ctype[j] == 't' || ctype[j] == 'T')
                td += " width=" + parseInt(fsize[j]) * 7;
            else if (ctype[j] == 'u' || ctype[j] == 'U')
                td += " width=" + fsize[j];
            td += ">";


            var str = '';
            var strb = '';
            if (i == NUMROWS)
            {
                var ele1 = ele(NUMROWS, j);
                if (ele1 != null)
                    str = ele(NUMROWS, j).value;
                else
                {
                    str = '';

                }
            }
            else
                str = retrv(i, j);
            
            if (str == null)
                str = '';
            strb = str;
            if (i < NUMROWS)
                switch (ctype[j] )
                {
                    case "t": case "T":
                    if (fields[j].toLowerCase().indexOf('attach') >= 0)
                    {   
                       str =  viewattachment(str);
                    }
                    break;
                    case "a":
                    case "f":
                        fmt = guessFormat(str);
                        if ('' + fmt == '2') 
                            needl  = true;
                        str = formatmat(str, i,j);
                         
                        break;
                    case "m":
                    case "M":
                        str = timestr2(str);
                        if (str == null)
                            str = '';
                        break;
                    case "n":
                    case "N":
                        str = numberstr(str, ffsize[j]);
                        break;
                    case "s":
                    case "S":
                    case "r":
                    case "R":

                        if (captionvalue && options[j] != null)
                        {
                            for (var jj = 0; jj < options[j].length; jj++)
                                if (str == options[j][jj])
                                {
                                    str = captions[j][jj];
                                }
                        }
                        break;
                    case "b":
                    case "B":
                        fmt = guessFormat(str);
                        if ('' + fmt == "2")    
                            needl = true;
                        
                        str = Innergrid.makeinnertable(str, i, j, false);
                        break;
                    case "c":
                    case "C":
                        if (captionvalue)
                            str = (str == "1") ? "<img src=image/answerright.gif >" : "<img src=image/answerwrong.gif >";
                        break;
                    case "u":
                    case "U":
                        if (fsize[j] != "" && ffsize[j] != "")
                            str = "<img name=image" + i + "_" + j + " src=\"" + str + "\" width=" + fsize[j] + " height=" + ffsize[j] + "  >";
                        else if (fsize[j] != "")
                            str = "<img name=image" + i + "_" + j + " src=\"" + str + "\" width=" + fsize[j] + " >";
                        else if (ffsize[j] != "")
                            str = "<img name=image" + i + "_" + j + " src=\"" + str + "\" height=" + ffsize[j] + "  >";
                        else
                            str = "<img name=image" + i + "_" + j + " src=\"" + str + "\" > ";
                        break;
                    case "L":
                        str = "<a href=\"" + extractfromm(mat[i][j], false).replace(/"/g, "'") + "\">" + extractfromm(mat[i][j], true) + "</a>";
                }
            if (str == null || str == '')
                str = "&nbsp;";
            if (i == NUMROWS)
                str = "<b>" + str + "</b>";
            if (!lineFolding)
                str = "<nobr>" + str + "</nobr>";
            a[a.length] = (td + str + "</td>");
        }
        a[a.length] = ("</tr>\n");
    }
    a[a.length] = ("</table></td></tr></table>");
    let wcds = a.join("");
    if (typeof(visualgraph) == 'undefined')
       document.thisform.wcds.value = wcds;
    else
       document.thisform.wcds.value = wcds + visualgraph.join("");
    formnewaction(document.thisform, "printdoc.jsp");
    visual(document.thisform);
document.thisform.submit();
}
function downloadcsv()
{
    let b = [];
    if (hasroworder)
    {
        b[b.length] = '#,';
    }
    var alljs = [];
    for (var j = 0; j < numCols; j++)
    {
        if (ctype[j] == null)
            ctype[j] = "";
        if (ctype[j] != 'h' && ctype[j] != 'k')
            alljs[alljs.length] = j;
    }
    for (var j0 = 0; j0 < alljs.length; j0++)
    {
       j = alljs[j0];
       b[b.length] = labels[j].replace(/"/g,"\"\"").replace(/([a-z])([A-Z])/g, "$1 $2") + (j0 < alljs.length-1?",":"");
    }
    b[b.length] = "\n";
    var rowordernum = 1;
    var printfoot = true;
    var allrs = [];

    for (var i = 0; i < NUMROWS || i == NUMROWS && printfoot && hasfoot; i++)
    {
        if (i < NUMROWS && isinrange(i) == false) {
            printfoot = false;
            continue;
        }

        if (i >= numRows && i < NUMROWS)
        {
            var k = 0;
            while (k < numCols && retrv(i, k) == nullvalue[k] || ctype[k] == 'h' || ctype[k] == 'k')
                k++;
            if (k == numCols)
                continue;
        }
        allrs[allrs.length] = i;
    }
    
    for (var i0 = 0; i0 < allrs.length; i0++)
    {
        i = allrs[i0];
        
        if (hasroworder)
        {
            b[b.length] = rowordernum + ",";
            rowordernum++;
        }
        var fmt = "0";
        var needl = false;
        for (var j0 = 0; j0 < alljs.length; j0++)
        {
            var str = null;
            j = alljs[j0];
            var strb = '';
            if (i == NUMROWS)
            {
                var ele1 = ele(NUMROWS, j);
                if (ele1 != null)
                    str = ele(NUMROWS, j).value;
                else
                {
                    str = '';
                }
            }
            else
                str = retrv(i, j);
            
            if (str == null)
                str = '';
            strb = str;
            b[b.length] = '"' + (strb==null?'':strb.replace(/"/g,'""')) + '"' + (j0 < (alljs.length-1)?",":"");
             
        }
        if (i0 < allrs.length-1) b[b.length] = '\n';
    }
    let contents = b.join("");
    let mime_type =  "text/csv";
    var blob = new Blob([contents], {type: mime_type});
    var dlink = document.createElement('a');
    dlink.download = rdapname + ".csv";
    dlink.href = window.URL.createObjectURL(blob);
    dlink.onclick = function(e) 
    {
            // revokeObjectURL needs a delay to work properly
            var that = this;
            setTimeout(function() {
                window.URL.revokeObjectURL(that.href);
            }, 1500);
    };
    dlink.click();
    dlink.remove();
}
customize = function()
{
    var str = '';
    str += ("<table border=0 valign=center align=center  > <tr> <td align=center>");
    str += ("<form rel=opener name=f style=\"margin:5px 0px 0px 0px\"   ><input type=hidden name=x value=fontsize>");
    str += ("<TABLE width=100%  class=outset1  cellpadding=0 cellspacing=0 ><TR><TD valign=TOP  bgcolor=#666666>");
    str += ("<TABLE BORDER=1 style=border-collapse:collapse;border-color:grey cellpadding=3 cellspacing=1 width=100% bgcolor="+ DBGCOLOR + ">");
    let str1 = "<tr><td><nobr><b>"+textmsg[816]+ "</b></nobr></td>", str2 = "<tr><td><nobr><b>"+textmsg[732]+ "</b></nobr></td>", str3="<tr><td><nobr><b>"+textmsg[733]+ "</b></nobr></td>";
    for (var i =0; i < numCols; i++)
    {
      if (fields[i] == 'onload' || fields[i] == 'onclose' || fields[i] == 'onbegin' || fields[i] == 'cellonfocus' || fields[i] == 'cellonblur' ||
      fields[i] == 'onsaved' || fields[i] == 'exbut' ) continue;
      str1 += ("<td bgcolor=\"" + BBGCOLOR + "\" valign=top> <nobr>" + labels[i] + "</nobr> </td>");
      str2 += ("<td><center><input type=checkbox name=c" + i +" value=on style=background-color:" + BBGCOLOR +" onclick=setcustom(((this.checked)?'t':'f'),"+i+") ");
      if (ctype[i]=='h')
         str2 += (" checked ");
      str2 += ("></center></td>");
      str3 +=  "<td><center>";
      if (ctype[i]=='t' || ctype[i]=='a'|| ctype[i]=='T' || ctype[i]=='A' || ctype[i]=='u' || ctype[i]=='U')
      {
         str3 += (" <input style=\"border:1px #b0b0b0 solid;border-radius:2px;text-align:right\" size=2 name=w"+i +" value=\""+fsize[i] +"\" onkeypress=\"return  isDigitEvent()\" onchange=setcustom(this.value," +i +")>");
      }
      str3 += ("</center></td>");
    }
    str1 += ("</tr>");str2 += ("</tr>");str3 += ("</tr>");
    str += str1 + str2 + str3;
    var vv = "";
    if (hasroworder) vv = "checked=true";
    str += ("<tr><td bgcolor=" + TBGCOLOR +" colspan=" + (1+numCols) +"><input type=checkbox name=c00 value=on onclick=setcustom(((this.checked)?'t':'f'),-4) " + vv +"> <b><nobr>" + textmsg[789] + "</nobr></b></td></tr>");
    if (insertQuery!='') 
        str += ("<tr><td bgcolor=" + TBGCOLOR +" colspan=" + (1+numCols) +">"+textmsg[746]  + " " +extra + " "
        + "<br>"+textmsg[747]+  "  <input name=n style=\"border:1px #b0b0b0 solid;border-radius:2px\" size=3 value=" + extra +" onchange=setcustom(this.value,-1)  onkeypress=\"return  isDigitEvent()\" ><br></td></tr>" );
    str += "</table></td></tr></table><br>";

    str += ( "<a href=\"DataForm?rdap=fontsize&exbut=p&subdb=&onsaved=0"
        +  "\">" +  textmsg[734] + " "    + textmsg[659] + "</a><br>");

    //str += (textmsg[748]+ ".<br><br> ");
    str += ("<input type=button name=btn class=GreenButton  style=width:" + butwidth(textmsg[744])*1.3 +"px  value=\"" +textmsg[744]
    + "\" onclick=\"setcustom('',-3);restart()\" >");
    str += ("<input type=button name=btn  class=GreenButton style=width:" + butwidth(textmsg[749])*1.3 +"px  value=\""
    + textmsg[749]+ "\" onclick=\"setcustom('',-2);restart()\"  ></form> </td></tr></table>");
    myprompt(str,null,null,textmsg[745]+ ": "+ title );
}
function restart()
{
    document.location.href = theurl;;
}
function stophourglass(nv)
{
    if (navigator.appName=='Microsoft Internet Explorer')
       ;//nav1.document.execCommand('Stop');
    else
    {   
        nv.stop();
        nv.onmouseove = null;
    }
}
populate(false);


if (exbut.indexOf('s')>=0 && f1.check1!=null)
{
   f1.check1.style.visibility = "hidden";
   if (NUMROWS==1)
       f1.checkbox.style.visibility = "hidden";
   else
   {
      for (var i=0; i < NUMROWS; i++)
         f1.checkbox[i].style.visibility = "hidden";
   }
}

window.onbeforeunload = null;
 

function refreshsub()
{
    for (var j = 0; j < numCols; j++)
    {
        if (ctype[j] == 'i' || ctype[j] == 'I')
        {
            if (i < numRows)
                openithere(mat[i][j], 'iframe' + i + '_' + j);
            else
                openithere("savefirst.html", 'iframe' + i + '_' + j);
        }
    }
}

function passdefaults(openwin)
{

    if (openwin == null || openwin.document == null || openwin.document.form1 == null)
        return;

    var allfs = openwin.document.form1.elements;
    if (allfs == null || allfs.length == 0)
        return;
    for (var i = 0; i < numCols; i++)
    {

        var j = 0;
        while (j < allfs.length && allfs[j].name != fields[i])
            j++;

        if (j < allfs.length && allfs[j].value != null && allfs[j].value != '')
        {

            defaultRecord[i] = openwin.getValue(j);
        }
    }
    populate(0);
}

function setCell(r, c, str)
{
    setv(r, c, str);
}

function openithere(url, winname)
{
    for (var k = 0; k < f1.elements.length; k++)
        if (f1.elements[k].tagName.toLowerCase() == 'textarea')
            f1.elements[k].disabled = true;
    var j = url.indexOf("?");
    if (j == -1)
        formnewaction(f1, url);
    else
    {
        var p = url.substring(j + 1).split("&");
        formnewaction(f1, url.substring(0, j));
        for (var j = 0; j < p.length; j++)
        {
            var pp = p[j].split("=");
            for (var k = 0; k < f1.elements.length; k++)
            {
                if (pp[0] == f1.elements[k].name)
                {
                    break;
                }
            }
            if (k == f1.elements.length) {
                var el = document.createElement("input");
                el.name = pp[0];
                el.type = "hidden";
                el.value = unescape(pp[1]);
            }
        }
    }
    f1.target = winname;
   visual(f1);
 f1.submit();
    for (var k = 0; k < f1.elements.length; k++)
        if (f1.elements[k].tagName.toLowerCase() == 'textarea')
            f1.elements[k].disabled = false;
} 
function showthosearrow()
{
    if (rr>=numRows && ctype[cc] != 'L' && pubkeys.indexOf("L")>=0 )
    {
        for (var jj=0; jj < numCols; jj++)
        if (ctype[jj] == 'L' && ele(rr,jj).value == '')
        {
            ele(rr,jj).value = '>>';
        }
    }
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

function openiframe()
{
    for (var Z = 0; Z < numRows; Z++)
    for (var j = 0; j < numCols; j++)
    {
        if (ctype[j] == 'i')
            openit(mat[Z][j], Z, 'iframe' + Z + '_' + j);
    }
}

cellonfocus += ';showthosearrow();';
onbegin += ';attonbegin();';
 
function onbegin0(){
 
eval(onbegin);
}
var onloadbeforemtdu = null;
 
if (typeof window.onload == 'undefined')
{
     window.onload = onbegin0;
}
else
{
    onloadbeforemtdu = window.onload;
    window.onload = function()
    {
        onloadbeforemtdu();
        onbegin0();
    }
}
 
 
         