var f2 = document.thisform;
f1 = document.form1;
var nn; 
var numnew = 0;
var whichaction = '';
var rowInvolves = '';

function updateFoot(init)
{
  if (hasfoot)
  for(var j=0;j<numCols;j++)
  {
     var tmp = calfoot(j,init);
     if (tmp!=null)
     {
        var du = ele(NUMROWS,j);
        du.value = tmp;
     }
  }
}        
function populate(fills)
{  

           var kk=0;
           var localnum = 0; 
           var ct;
           for (var r = 0; r < numRows; r++)
           for (var c = 0; c < numCols; c++)
           {  

               ct = ctype[c].toLowerCase();
               if ( fills || (ct != 'm' && ct!='n' && ct!= 's' && ct!='c'))
               {
                  setv(r,c,mat[r][c]);
               }
           }
           for (  r = numRows; r < NUMROWS; r++)
           {
             for (  c = 0; c <  numCols ;c++)
               if (ctype[c]=='h')
               {
                  setv(r,c,defaultValue(r,c));
               }
               else if (ctype[c]!='s')
                    setv(r,c,nullvalue[c]);
             valuechanged[r] = false;
           }

           updateFoot();
 
}        
 
function locatr(r, c)
{
    return 2 + r*(running +1) + lookup[c];
}

function setaction( n )   
{  
           if (periodvalue==1)
           {
               if (rr>=0 && cc>=0) 
                   U(rr,cc);
           }
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
                   return false; 
                } 
                else  if ( formstr() == true) 
                {
                    formnewaction(f2);
                   visual(f2);
 f2.submit(); 
                    did = true;
                }
                for (i=0; i < self.frames.length; i++) 
                   if (self.frames[i].name.indexOf("iframe") == 0 && self.frames[i].setaction(1))
                      did = true;
                break;
              
              case 2:
                nn = 2;
                did = formstr();
                for (i=0; i < self.frames.length; i++) 
                {
                    if (self.frames[i].name.indexOf("iframe") == 0 && self.frames[i].setaction(2))
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
                    
                    if (self.frames[i].name.indexOf("iframe") == 0)
                    {
                       var nm = self.frames[i].name;
                        nm = nm.substring(6);
                       var xx = nm.indexOf("_");
                       var yy = parseInt(xx.substring(0,xx));
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
                         name.options[j+1] = new Option(captions[c][j],options[c][j]);
                  }
              }
}
        
function checkone(cks)
{
   cks.style.visibility = "";  
   cks.checked = true;
}

function checkall()            
{                              
             var b = f1.check1.checked;
             if (NUMROWS==1)f1.checkbox.checked = b;
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
                  dsize[j] == 40;
               if (dsize[j] < fields[j].length)
                   dsize[j] = fields[j].length;  
              
          }
          var  str = ''; 
          for (var j = 0; j <  numCols  ; j++) 
          {
               str += pad(fields[j], dtype[j], dsize[j]);
          }
          str += '\n';
          var kk = 0;
          for (var i = 0; i <  numRows ; i++) 
          {
               if (f1.checkbox[i].checked )   
               {
                  
                  for (var j = 0; j <  numCols  ; j++) 
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
       
helpstr += "</td></tr></table>";
if (deleteQuery != '')
   helpstr += "<br><b><font color=purple>"+textmsg[248]+
      "</font></b><br>"+textmsg[249]+"<b style=background-color:#cc0000;color:white>&nbsp;"+textmsg[69]+"&nbsp;</b>" + textmsg[183];
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
              f2.wcds.value += sqlstr;
}   
        
function formupdatestr(querystr)
{ 
         
          numnew = 0; 
          var sqlstr = '';
          rowInvolves = '1'; 
          for (var i = 0; i < NUMROWS ; i++) 
          {
               if (valuechanged[i]==false)  
                   continue;   
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
 
          f2.wcds.value += sqlstr;
 
          whichaction='upd'; 
}   
         
var nav1 = null;
function formstr()
{
           if (viewonly) return false;      
           f2.id.value = iid;   
           formnewaction(f2,"SaveBack");
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
            
             if (updateQuery != '')
             {
                 formupdatestr(updateQuery); 
             }
             popwin = 'savewindow'; 

             if ( sqls.value == '' ) return (false);
          }
          else if (nn == 2)  
          {
             if (updateQuery != '')formupdatestr(updateQuery); 
             if (deleteQuery != '')formdeletestr(); 
             if ( sqls.value == '' ) return (false);
             sqls.value = sqls.value.replace(/\xFD/g,"<br>").replace(/\xFC/g,"<br>").replace(/\xFB/g,"<br>");;;
          }
          else if (nn == 3)//delete
          {
             for (var k = 0; k < numRows; k++)
                deleted[k] = false;
             popwin = 'deletewindow'; 
             if (deleteQuery != '')
                formdeletestr();
             if ( sqls.value == '' || confirm( textmsg[252]) == false) return (false);
          }
          if (nav1!=null) nav1.close();
          nav1 = window.open('', popwin ,popstr);
          f2.target =  popwin ;
          if ( nn != 2)
          {
            nav1.document.write('<html>' + metaencode +'<body>'+textmsg[242]);
            return (true); 
          }
          nav1.document.write('<html>' + metaencode +'<body>'+sqls.value + '</body></html>');
          return (false);
} 
        
function syn(z)
{
               
              if (f1.checkbox == null) return;
              if (whichaction=='savesql')
              {
                 if (parseInt(z)>=0)
                    refreshindex();
                    return;
              }
              else if (whichaction=='cret' || whichaction=='upda')
              {
                  if (parseInt(z)>=0)
                    save();
                    return;
              }
               
              var rx = z.split(",");
              whichaction = rowInvolves.charAt(0);
              rowInvolves = rowInvolves.substring(1);
              var ix = rowInvolves.split(','); 
              var N = rx.length  ;
              var min = -1;  
              if (whichaction== '0')
              {
                    
                   haserror = false;
                   for (var l = 0; l < N; l++)
                   {
                       var u = parseInt(ix[l]);
                       if (rx[l] != '0' && rx[l] != '-1')
                       {
                           deleted[u] = true;
                           if (min == -1) 
                               min = parseInt( ix[l]);
                       }
                       else 
                           haserror = true;
                   }

                   if (min == -1) return;
                   var t = 0;

                   while ( t < numRows )
                   {
                       t = min + 1;
                       for (; t < numRows && deleted[t]; t++);
                       if (t < numRows) 
                       {
                           for (var c = 0; c <  numCols ; c++)   
                           { 
                              mat[min][c] = mat[t][c];
                           }
                           deleted[t] = true;
                           deleted[min] = false;
                           f1.checkbox[min].checked = f1.checkbox[t].checked;
                           min++;
                       }
                   } 
                   
                    for (t--; t >= min; t--) 
                       f1.checkbox[t].checked = false;
                     
                    for (t++; t < numRows; t++)
                    {
                        for (var c = 0; c <  numCols ; c++)   
                        { 
                            mat[t][c] = nullvalue[c];  
                        }
                    }
                    numRows = min;

                    for (c = 0; c <  numCols ; c++)   
                    { 
                         mat[min][c] = nullvalue[c];  
                    }

                    populate(true);  
                    f1.total.value = '' + numRows;
                    if (haserror)
                        myprompt(textmsg[253]);
                     
                }
                else if (whichaction== '1')
                {
 
                    newn = 0;
                    for (var l = 0; l < N; l++)
                    {
                       var u = parseInt(ix[l]);
                      if (rx[l] == '0' || rx[l] == '-1')
                      {
                         if (min == -1 && u >= numRows ) 
                             min = u;
                         if (NUMROWS >1)
                             checkone(f1.checkbox[u]); 
                         else 
                             checkone(f1.checkbox); 
                      }
                      else 
                      {  
                         if ( u >= numRows )newn ++;
                         for (var c = 0; c <  numCols ; c++)   
                         { 
                            if ((ctype[c].toUpperCase()==ctype[c] || ctype[c]=='k'||ctype[c]=='h')&&ctype[c]==nullvalue[c])
                                  mat[u][c] = defaultValue(u,c);
                            else
                                  mat[u][c] = retrv(u,c);
                         }
                         valuechanged[u] = false;  
                      }
                   }
                  
                   if (min == -1) 
                   {  
                        numRows += newn; 
                        f1.total.value = '' + numRows;  
                        window.onbeforeunload = null;
                        if (onsaved!='') eval(onsaved);
                        return;
                   }
                   var up = numRows + numnew - 1; 
                      
                   while (min < up) 
                     {
                        for(; up > min && f1.checkbox[up].checked; up--);
                        if ( min < up) 
                        {
                            var t = valuechanged[min];
                            valuechanged[min] = valuechanged[up];
                            valuechanged[up] = t;
                            for (var c = 0; c <  numCols ; c++)   
                            { 
                               t = mat[min][c];
                               mat[min][c] = mat[up][c];
                               mat[up][c] = t;
                               checkone(f1.checkbox[up]);
                               f1.checkbox[min].checked = false;
                            }
                            
                            min++;
                            for (; min < up && f1.checkbox[min].checked == false; min++);
                         }
                     }
                     up = numRows + newn;
                     numRows += numnew;
                     numRows = up;
                     f1.total.value = '' + numRows;
                     
                }
                
                if (onsaved!='') eval(onsaved);
}
if (fields[0]=='rolecode' && ctype[0]=='h' || typeof(copy2) == 'undefined')       
copy2 = function()
{
    
     if (colsfed=='')
     {
           var ids = "";
           var idn = 0;
             
           for (var i = 0; i < NUMROWS;i++)
           {
              var cb = f1.elements[1 + i*(running +1)];
              if (cb.checked )
              {
                  
                 if (fields[0]=='rolecode' && ctype[0]=='h')
                 {
                     idn += parseInt(mat[i][0]);
                 }
                 else
                 {
                     if (ids !="") ids += ",";
                     ids += mat[i][0];
                 }
              }
            }
            if (fields[0]=='rolecode' && ctype[0]=='h')
            {
                     ids  = '' + idn;
            }
            if (  onmydomain( opener))
            opener.getPassed(ids); 
       }
       else
       { 
           var xy = colsfed.split(",");
           for (var i = 0; i < NUMROWS;i++)
           {
              var cb = f1.elements[1 + i*(running +1)];
              if (cb.checked )
              {
                 
                 for (var j = 0; j < xy.length; j++)
                 {
                    var x = xy[j].charAt(0);  
                    var y = xy[j].charAt(1); 
                    
                    if (x=='0' && y=='0') continue;
                    if (onmydomain(opener))opener.getPassed1(parseInt(y), retrv(i, parseInt(x)) );
                 }
                 if (onmydomain(opener))opener.getPassed2(retrv(i,0));
              }
           }
           if (onmydomain(opener))opener.updateFoot(1);
       }
       tinywin = 'w' + tstmp;
       setaction(1);
       if (parent == window)
       close();
       else if (parent!=openme && openme.parent!=parent) 
           parent.close();
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
    rr=r; cc=c;
    if (cellonblur!='') eval(cellonblur);
    if (hasfoot) 
    { 
       var qu = ele(NUMROWS,c);
       qu.value = calfoot(c);
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
   if (hasfoot) 
    { 
       var qu = ele(NUMROWS,cc);
       qu.value = calfoot(cc);
    }
}
 
function fontstr(partname, fontname, dname, fontsize,dsize1, fontcolor, dcolor, bgcolor,k)
{ 
   var fot = "arial,courier"; var fontarr = fot.split(",");
   var str = "<table  width=100%  border=0 bgcolor=" + bgcolor + "><tr><td  ><input size=" + (9 + partname.length) +" name=sample" + k+"  value=\"" + partname +textmsg[737]+ "\" style=background-color:" + bgcolor +";border:0;color:" + dcolor +";font-family:" + dname +";font-size:" + dsize1 +">: &nbsp; &nbsp; <nobr> { "+textmsg[737]+ " <select name=" + fontname + " onchange=testofont1(1,this,"+k+",'" +bgcolor+"')>";
   for (var i=0; i < fontarr.length; i++)
   {
      str +="<option value=\"" + fontarr[i] +"\" ";
      if (fontarr[i]==dname) str +=" selected ";
      str +=">" + fontarr[i] +"</option>";
   }
   str +="</select> "+textmsg[734]+ " <input name=" + fontsize +" value=\"" + dsize +"\" size=1 onchange=testfont(2,this.value,"+k+",'" +bgcolor+"')>pt  &nbsp;"+textmsg[738]+ " <input name=" + fontcolor +" value=\"" + dcolor +"\" size=4 onchange=testfont(3,this.value,"+k+",'" +bgcolor+"')>}</nobr></td></tr></table>";
   return str;
} 

var printstylestr = localStorage["tableprintstyle"]; 

if (printstylestr==null || printstylestr=='') 
   printstylestr="image/tm.gif,arial,28,red,arial,12,blue,arial,12,black,1";

function resetdefualtprint()
{
   printstylestr="image/tm.gif,arial,28,red,arial,12,blue,arial,12,black,1";
   localStorage.removeItem("tableprintstyle");
   printing();
}

var rowselection = "1-" + NUMROWS;

var lineFolding = true;
var captionvalue = true;

function printing()
{ 
    var javascript = "script";

    var xx = printstylestr.split(",");
    if (nav1!=null) nav1.close();
     
    nav1 = window.open("","custom","location=0,toolbar=0,menubar=0,resizable=1,top=0,left=0,width=" + screen.width +",height=" + screen.height);
    nav1.document.body.innerHTML = ''; 
    nav1.document.write("<html><head><meta http-equiv=\"content-type\" content=\"text/html; charset=" + encoding +"\"></head><body bgcolor=" +DBGCOLOR+ ">");
    nav1.document.write("\n<" + javascript +">\nfunction go(){if (document.f.tfontname.selectedIndex >=0) opener.printstyle(document.f.logo.value,document.f.tfontname.options[document.f.tfontname.selectedIndex].value,document.f.tfontsize.value,document.f.tfontcolor.value,document.f.tborder.value,document.f.hfontname.options[document.f.hfontname.selectedIndex].value,document.f.hfontsize.value,document.f.hfontcolor.value,document.f.cfontname.options[document.f.cfontname.selectedIndex].value,document.f.cfontsize.value,document.f.cfontcolor.value);}");
    nav1.document.write("\nvar xx=["); 
    for (var i=0; i<10;i++) nav1.document.write("'"+xx[i]+"',"); 
    nav1.document.write("'']; \nfunction testfont1(i,th,j,c){var k=th.selectedIndex;if (k>-1){testfont(i,th.options[k].value,j,c);}}");
    nav1.document.write("\nfunction testfont(i,v,j,c){xx[i+3*(j-1)]=v;('document.f.sample'+j+'.style=\\'background-color:'+c+';border:0;font-name:'+xx[1+(j-1)*3]+';font-size:'+xx[2+(j-1)*3]+';color:'+xx[3+(j-1)*3]+'\\';');}</" + javascript +">");
   
    nav1.document.write("<table border=0 valign=center align=center width=100%> <tr><td></td><td><img name=tstimg src=image/blank.gif width=100% height=1></td></tr><tr><td><img name=tstimg1 src=image/blank.gif width=1 height=100%></td><td align=center>  <table BORDER=0 COLS=1 WIDTH=100%  BGCOLOR="+IBGCOLOR+"  background=header.gif height=42><tr ALIGN=CENTER><td><font color=#DDCC11 size=+2><b>"+textmsg[735]+ "</font></td></tr></table><br> \n"); 
    nav1.document.write("<br><form rel=opener name=f  >"+textmsg[736]+ "<input name=logo size=30 onblur=\"document.f.logoimg.src=this.value\" value=\"" + xx[0] +"\"><br><img name=logoimg src=\""+xx[0] +"\"><br><br>");
    nav1.document.write(fontstr(textmsg[441], "tfontname", xx[1], "tfontsize", xx[2], "tfontcolor", xx[3], IBGCOLOR,1));
    nav1.document.write("<br> "+textmsg[741]+ "<input name=tborder value="+xx[10] +" size=1><br><br>");
   
    nav1.document.write("<table cellpadding=0 cellspacing=1 border=0 bgcolor="+ BBGCOLOR+ " width=100%><tr><td>"); 
    nav1.document.write( "<TABLE width=100% cellpadding=3 cellspacing=1 border=0>"); 
    nav1.document.write( "<TR bgcolor=lightblue><td  width=100% colspan=" + numCols +">");
    
    nav1.document.write(fontstr(textmsg[739], "hfontname", xx[4], "hfontsize", xx[5], "hfontcolor", xx[6],"lightblue",2));
    nav1.document.write("</td></tr><tr>");
    for (var i =0; i < numCols; i++)
    {
      if (fields[j] == 'onclose' || fields[j] == 'onbegin' || fields[j] == 'cellonfocus' || fields[j] == 'cellonblur' || 
      fields[j] == 'onsaved' || fields[j] == 'exbut' ) continue; 
     
     nav1.document.write("<td bgcolor=lightblue valign=top style=color:"+xx[6]+";font-family:"+xx[4]+";font-size:"+xx[5] +">" + fields[i] + "<br> <nobr> "+textmsg[732]+ " <input type=checkbox name=c" + i +" value=on onclick=opener.setcustom(((this.checked)?'t':'f'),"+i+") ");
     if (ctype[i]=='h') 
         nav1.document.write(" checked ");
     nav1.document.write("></nobr><br><nobr>"); 
     if (ctype[i]=='t' || ctype[i]=='a'|| ctype[i]=='T' || ctype[i]=='A' || ctype[i]=='u' || ctype[i]=='U')
     {
          nav1.document.write( textmsg[733]+ " <input size=2 name=w"+i +" value=\""+fsize[i] +"\" onkeypress=\"return isDigitEvent()\" onchange=opener.setcustom(this.value," +i +")>");
     }
      
     nav1.document.write("</nobr></td>");
    }
 
     var vv = ""; if (hasroworder) vv = "checked"; 
     nav1.document.write("</tr><tr height=30>    <td width=100%   colspan=" + numCols +" bgcolor=" + TBGCOLOR +">");   
     nav1.document.write("<input type=checkbox name=c00 value=on onclick=opener.setcustom(((this.checked)?'t':'f'),-4) " + vv +" ><b><nobr>" + "Print row number " + "</nobr></b><br>");
     vv = ""; if (!captionvalue) vv = "checked"; 
     nav1.document.write("<input type=checkbox name=c01 value=on onclick=opener.passLineFolding(!this.checked,0)  " + vv + " ><b><nobr>" + "For selective fields, print internal value " + "</nobr></b><br>");
     vv = ""; if (lineFolding) vv = "checked"; 
     nav1.document.write("<input type=checkbox name=linefolding onchange=opener.passLineFolding(this.checked,1)  " + vv + " ><b><nobr>"  + textmsg[743]+ "</nobr></b></td></tr>");
     nav1.document.write("<tr  height=30>    <td width=100%   colspan=" + numCols +">");
     nav1.document.write(fontstr(textmsg[740], "cfontname", xx[7], "cfontsize", xx[8], "cfontcolor", xx[9], TBGCOLOR,3));
     nav1.document.write("</td></tr> <tr  height=30><td width=100%   colspan=" + numCols +"  bgcolor=" + TBGCOLOR +"><nobr> "+textmsg[742]+ " <input name=rowselect size=22 value=\"" + rowselection + "\" onblur=opener.passRowselect(this.value)> (" + textmsg[750] +":  13-15,18) </nobr></td></tr>");
     nav1.document.write("</table></td></tr></table><br><br>");
     nav1.document.write("<input type=button name=btn style=background-color:#CC0000;color:white;font-weight:700;width:70 value=\""+textmsg[744]+ "\" onclick=opener.resetdefualtprint()><input type=button name=btn style=background-color:#00BBBB;color:white;font-weight:700;width:70 value=\"" + textmsg[408] +"\" onclick=go()></form></td></tr></table>");
     nav1.document.write("<body></html>");
 
    //var tablen = nav1.document.images['tstimg'].width+60;
    //var tablei = 750;//nav1.document.images['tstimg1'].height+80;
    //nav1.resizeTo(tablen,tablei);
    //nav1.moveTo((screen.width - tablen)/2, (screen.height - tablei)/2); 
    if (navigator.appName=='Microsoft Internet Explorer')
        nav1.document.execCommand('Stop');
     else
         nav1.stop();
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
 
   
function printstyle(logo,tfontname,tfontsize,tfontcolor,bord,hfontname,hfontsize,hfontcolor,cfontname,cfontsize, cfontcolor)
{ 
   printstylestr = logo+','+tfontname+','+tfontsize+','+tfontcolor+','+hfontname+','+hfontsize+','+hfontcolor+','+cfontname+','+cfontsize+','+ cfontcolor+ ',' + bord+','+hasroworder; 
 
   localStorage["tableprintstyle"] =printstylestr;
   var css = "<style>\nh1{font-family:" + tfontname+";font-size:" + tfontsize +"pt;color:" + tfontcolor+"}\n"  
    + "td.heading{font-family:" + hfontname+";font-size:" + hfontsize +"pt;color:" + hfontcolor+"}\n" 
    + "td.cell{font-family:" + cfontname+";font-size:" + cfontsize +"pt;color:" + cfontcolor+"}\n</style>";
    nav1 = window.open("","custom1","location=0,toolbar=0,menubar=1,scrollbars=1,resizable=1,top=0,left=0,width=800,height=" + (screen.height-30));
    nav1.document.body.innerHTML = '';
    nav1.document.write("<html>" + metaencode + "<head><meta http-equiv=\"content-type\" content=\"text/html; charset=" + encoding +"\"></head><body bgcolor=" +DBGCOLOR+ ">\n" + css);
    nav1.document.write("\n<table border=0 valign=center align=center width=100%> <tr><td></td><td><img name=tstimg src=image/blank.gif width=100% height=1></td></tr>");
    nav1.document.write("<tr><td><img name=tstimg1 src=image/blank.gif width=1 height=100%></td><td align=center>");
    nav1.document.write("<img src=" + logo + "><br>\n<h1>" + title + "</h1><br>\n<table border=" + bord +"><tr>");
    if (hasroworder)nav1.document.write("<td  class=heading >&nbsp;</td>");
    for (var j = 0; j < numCols; j++)
    {    
        if (ctype[j]!='h' && ctype[j]!='k')
        {
        nav1.document.write("<td class=heading ");
        if (ctype[j]=='a' || ctype[j]=='A'|| ctype[j]=='t' || ctype[j]=='T')
            nav1.document.write(" width=" + (parseInt(fsize[j])*7) );
        else if (ctype[j]=='u' || ctype[j]=='U')
            nav1.document.write(" width=" + fsize[j] );
        if (dtype[j] && captionvalue==false || ctype[j]=='n') 
            nav1.document.write(" align=right");
        nav1.document.write("><b><nobr>" + fields[j].replace(/([a-z])([A-Z])/g, "$1&nbsp;$2") +"</nobr></b></td>"); 
        }
    }
    nav1.document.write("</tr>");
    var rowordernum = 1;
    var printfoot = true; 
     
    for (var i=0; i<NUMROWS ||i==NUMROWS && printfoot && hasfoot; i++)
    { 
         if (i<NUMROWS && isinrange(i) == false){printfoot=false; continue;}
         
         if (i >=numRows && i <NUMROWS)
         {
            var k=0; while (k < numCols && retrv(i,k)==nullvalue[k] || ctype[k]=='h' || ctype[k]=='k')k++;
            if (k==numCols) continue;
         }

         nav1.document.write("<tr>");
         if (hasroworder)
         {
             nav1.document.write(
             "<td  valign=top class=cell valign=top align=right>" + rowordernum +"</td>");
             rowordernum++;
         }
         for (var j=0; j < numCols; j++)
         {  
             if ( ctype[j]=='h' || ctype[j] =='k' )  continue;
             
             var td = "<td  valign=top class=cell valign=top ";
             if (dtype[j]) 
                 td += " align=right ";
             if (ctype[j]=='a' || ctype[j]=='A'|| ctype[j]=='t' || ctype[j]=='T')
                 td += " width=" + parseInt(fsize[j])*7;
             else if (ctype[j]=='u' || ctype[j]=='U')
                 td += " width=" + fsize[j];
             td += ">"; 
           
             
             var str =  '';
             if (i==NUMROWS) 
                 str = ele(NUMROWS,j).value;
             else 
                 str = retrv(i,j);
             if (str==null) 
                 str = '';
             if (i < NUMROWS)
             switch(ctype[j])
             {
                 case "m": case "M": 
                    str =   timestr2(str); if (str==null) str=''; 
                    break;
                 case "n": case "N":
                    str = numberstr(str,ffsize[j]); 
                    break;
                 case "s": case "S": case "r": case "R": 
                     
                    if (captionvalue && options[j] != null)
                    {
                     for (var jj=0; jj < options[j].length; jj++) 
                     if ( str==options[j][jj]) 
                     { 
                        str = captions[j][jj] ; 
                     } 
                    }   
                    break;
               
                case "c": case "C": 
                     if (captionvalue)
                         str = (str=="1")? "Yes":"No";
                     break;
                case "u": case "U":
                    if (fsize[j]!="" && ffsize[j] != "")
                        str =  "<img name=image" + i+"_"+j+" src=\"" + str + "\" width=" + fsize[j] + " height=" + ffsize[j] + " alt=\"" + str +  "\" >" ;  
                    else if (fsize[j]!="")
                        str =  "<img name=image" + i+"_"+j+" src=\"" + str + "\" width=" + fsize[j] + " alt=\"" + str + "\" >" ;
                    else if (ffsize[j]!="")
                        str =  "<img name=image" + i+"_"+j+" src=\"" + str + "\" height=" + ffsize[j] + " alt=\"" + str + "\" >" ;  
                    else 
                        str =  "<img name=image" + i+"_"+j+" src=\"" + str + "\" alt=\"" + str + "\" > " ;
                     break;
                case "L":
                    str = "<a href=\"" + extractfromm(mat[i][j],false).replace(/"/g,"'") +"\">" + extractfromm(mat[i][j],true) + "</a>";  
              } 
 
              if (str==null||str=='') str="&nbsp;";
              if (i==NUMROWS) str = "<b>" + str + "</b>"; 
              if (!lineFolding) 
                 str = "<nobr>" + str +"</nobr>";
              nav1.document.write(td + str +"</td>");   
         }
         nav1.document.write("</tr>");
     }
  
    nav1.document.write("</table></td></tr></table><body></html>");
    nav1.focus();
    var tablen = nav1.document.images['tstimg'].width+60;
    var tablei = 750;   //nav1.document.images['tstimg1'].height+80;
    nav1.resizeTo(tablen,tablei);
    nav1.moveTo((screen.width - tablen)/2, (screen.height - tablei)/2); 
    stopwin(nav1);
   
}

customize = function()
{
    nav1 = window.open("","custom","location=0,toolbar=0,menubar=0,height=400,resizable=1,top=0,left=0");
    nav1.document.body.innerHTML = '';
    nav1.document.write("<html>" + metaencode + "<head><meta http-equiv=\"content-type\" content=\"text/html; charset=" + encoding +"\"></head><body bgcolor=" +DBGCOLOR+ ">");
    nav1.document.write(" <table border=0 valign=center align=center width=100%> <tr> <td></td><td><img name=tstimg src=image/blank.gif width=100% height=1></td></tr><tr><td><img name=tstimg1 src=blank1.gif width=1 height=100%></td><td align=center>  <table BORDER=0 COLS=1 WIDTH=100%  BGCOLOR="+IBGCOLOR+"  background=header.gif height=42><tr ALIGN=CENTER><td><font color=#DDCC11 size=+2><b>"+textmsg[745]+ ": "+ title +"</font></td></tr></table><br> \n"); 
    nav1.document.write("<br><table border=1><tr>");
    for (var i =0; i < numCols; i++)
    {
      if (fields[j] == 'onclose' || fields[j] == 'onbegin' || fields[j] == 'cellonfocus' || fields[j] == 'cellonblur' || 
      fields[j] == 'onsaved' || fields[j] == 'exbut' ) continue; 
      nav1.document.write("<td bgcolor=lightblue valign=top><b><nobr>" + fields[i] + "</nobr></b><br><nobr> "+textmsg[732]+ " <input type=checkbox name=c" + i +" value=on onclick=opener.setcustom(((this.checked)?'t':'f'),"+i+") ");
      if (ctype[i]=='h') 
         nav1.document.write(" checked ");
      nav1.document.write("></nobr><br>");
      if (ctype[i]=='t' || ctype[i]=='a'|| ctype[i]=='T' || ctype[i]=='A' || ctype[i]=='u' || ctype[i]=='U')
      {  
         nav1.document.write("<nobr>"+textmsg[733]+ " <input size=1 name=w"+i +" value=\""+fsize[i] +"\" onkeypress=\"return  isDigitEvent()\" onchange=opener.setcustom(this.value," +i +")>");
      }
      nav1.document.write("</nobr></td>");
    }
    nav1.document.write("</tr>");
    var vv = ""; if (hasroworder) vv = "checked=true";  
    nav1.document.write("<tr><td bgcolor=" + TBGCOLOR +" colspan=" + numCols +"><input type=checkbox name=c00 value=on onclick=opener.setcustom(((this.checked)?'t':'f'),-4) " + vv +"><b><nobr>" + "With Row Number" + "</nobr></b></td></tr>");
    nav1.document.write("<tr><td bgcolor=" + TBGCOLOR +" colspan=" + numCols +">"+textmsg[746]  + extra 
    + textmsg[747]+  "<input name=n size=1 value=\"" + NUMROWS +"\" onchange=opener.setcustom(this.value,-1)  onkeypress=\"return  isDigitEvent()\" ><br></td></tr></table><br>"
    + textmsg[748]+ ".<br> <input type=button name=btn class=GreenButton style=width:70 value=\""+textmsg[744]+ "\" onclick=opener.setcustom('',-3);window.close()> <input type=button name=btn class=GreenButton style=width:70 value=\""+textmsg[749]+ "\" onclick=opener.setcustom('',-2);window.close()></td></tr></table><body></html>");
    var tablen = nav1.document.images['tstimg'].width+60;
    var tablei = 450;//nav1.document.images['tstimg1'].height+80;  
    nav1.resizeTo(tablen,tablei);
    // nav1.moveTo((screen.width - tablen)/2, (screen.height - tablei)/2); 
}
  
populate(true);
if (exbut.indexOf('s')>=0 && f1.check1!=null)
{
   f1.check1.style.visibility = "hidden";
   if (NUMROWS==1)
      document.form1.checkbox.style.visibility = "hidden"; 
   else
   {
      for (var i=0; i < NUMROWS; i++)
         document.form1.checkbox[i].style.visibility = "hidden";
   }
}
if (onbegin != ''){ eval(onbegin);}
 
 


       
         