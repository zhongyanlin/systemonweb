 /************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
 
if (typeof font_size=='undefined') var font_size = 17;
if (typeof lblorder=='undefined') var lblorder = 'Order';
if (typeof lblsearch=='undefined') var lblsearch = 'Search';
if (typeof lblsubmit=='undefined') var lblsubmit = 'Submit';
if (typeof lblsave=='undefined') var lblsave = 'Save';
if (typeof lbldelete=='undefined') var lbldelete = 'Delete';
if (typeof lblcancel=='undefined') var lblcancel = 'Cancel';
if (typeof lblupdate=='undefined') var lblupdate = 'Update';
if (typeof lblreview=='undefined') var lblreview = 'Review';
if (typeof lblnorecord=='undefined') var lblnorecord = 'No record';
if (typeof lblhint=='undefined') var lblhint = 'Enter searching requirements  and click the Select/Search button to select desired records';
if (typeof lblreally=='undefined') var lblreally = 'Do you really want to delete';
if (typeof lblenterone=='undefined') var lblenterone = 'Please enter order';
if (typeof lblman=='undefined') var lblman = 'Data Management';
if (typeof lblsep=='undefined') var lblsep = ',/()';
if (typeof lblselect=='undefined') var lblselect = 'Select One';
if (typeof lblall=='undefined' || lblall.indexOf(",")<0) var lblall = 'All Records in One Merged Form,All Records in Separate Merged Forms, All Records in Comma Separated Value, All Records in Data Sheet';
 
var lblallstr = lblall.split(/,/);
if (typeof lblalls=='undefined'|| lblalls.indexOf(",")<0) var lblalls = 'Merged Form,Comma Separated Value,Data Sheet';
var lblallstrs = lblalls.split(/,/); 
if (typeof lblwait=='undefined') var lblwait = 'Please wait while the server is processing your request...';
if (typeof lblblock=='undefined') var lblblock = 'The data is being loaded. If block, click ';
if (typeof lblselect=='undefined') var lblselect = 'Please select one item';

var slen = 8;
var us = new RegExp(/__[_]*/);
var i=0, k = 0, j=1;
var len = 0;
var str = ""; 
var ts = "";
var sql = "";
var sql2 = '';
var newselr = "";
var idsel = true;
var maxlen = 0;
var fds = "";
var sel = "";
var oldlen = 0;
var updatesql = "";
var deletesql = "";
var where = "";
var allele = "";
var updatedatalink = "";
var bd = document.body;
var txt = bd.innerHTML;
 
function unifonts(x)
{
     if (typeof(fontname) == 'undefined')  fontname = 'times';
     if (x==null || x.nodeType==3) return;
     if ((typeof(x.id)=='undefined'|| x.id==null || x.id.toString().indexOf('S_s')<0) && typeof(x.tagName)!='undefined' &&  (x.tagName.toLowerCase() == 'div' || x.tagName.toLowerCase() == 'td' 
             || x.tagName.toLowerCase() == 'p' ||x.tagName.toLowerCase() == 'span'
             || x.tagName.toLowerCase() == 'input' && x.type!='hidden' && x.type!='radio' ||x.tagName.toLowerCase() == 'select'
             || x.tagName.toLowerCase() == 'textarea'|| x.tagName.toLowerCase() == 'body'  
            ))
     {
         x.style.fontFamily = fontname;
     }
     var y = x.childNodes;
     if (y !=null && y.length>0)
     for (var j=0; j < y.length; j++)
     {
         unifonts(y[j]);
     }
}
function replacel(s, a, b)
{
    
    var j=0;
    var z = ''
    while (true) 
    {
     var i = s.indexOf(a, j);
     if (i == -1)
     {
         z += s.substring(j);
         break;
     }
     z += s.substring(j,i) + b;
     j = i+1;
    }
    return z;
}
if (lblsep!=',/()')
for (var i0=0; i0 < 5; i0++)
{ 
    var xx = ",/()";
    if (lblsep.charAt(i0)!=xx.charAt(i0))
    {
       txt = replacel(txt, lblsep.charAt(i0), xx.charAt(i0));  
    }
}
var endtxtn = txt.indexOf("var uid='" + uid +"',");
var unifontsizestr = '17';
if ( typeof(bd.style) != 'undefined' && bd.style!=null &&  bd.style.fontSize!=null )
    unifontsizestr = bd.style.fontSize.replace(/px/,'');
var unifontsize = 'inherit';
if ( '' + parseInt(unifontsizestr) != 'NaN')
    unifontsize = parseInt(unifontsizestr) + 'px';

var unifontfamily = 'arial';
if (typeof(bd.style)!='undefined' && bd.style!=null && bd.style.fontFamily!=null)
    unifontfamily = bd.style.fontFamily;
if (unifontfamily=='')unifontfamily = 'arial';
var headstr = document.getElementsByTagName('head')[0].innerHTML;
var jjj = headstr.indexOf('commonlooking');
var unipadding = "2px 2px 2px 2px";
var filej;
if (jjj>0)
{
   // headstr = headstr.substring(jjj + 14).replace(/}.*/,'');
  /*  var arrheadstr = headstr.split(/;/);
    var headstrlist = [];
    for (jjj=0; jjj < arrheadstr.length; jjj++)
    {
        if (arrheadstr[i].indexOf(':') > 0)
        {
            var xy = arrheadstr[i].split(/:/);
            headstrlist[xy[0].replace(/ /g,'')] = xy[1];
        }
    }
    unifontfamily = headstrlist['font-family'];
    unifontsize = headstrlist['font-size'];
    unipadding = headstrlist['padding'];
    */
    unifontfamily = 'inherit';
    unifontsize = 'inherit';
    unipadding = 'inherit';
}
var unifontsize1 = 17;
if (unifontsize!='inherit')
    unifontsize1 = parseInt(unifontsize.replace(/px/,''));
    
var divstr = ("<style>.progress_outer{ border: 1px solid #000;position:absolute;top:200px;left:10px;z-index:3}\n.progress{width:20%;background:#DEDEDE;height:20px;}\nA:link\n{ COLOR:blue;\nTEXT-WEIGHT:1000;\nTEXT-DECORATION: none}\nA:visited\n{\nCOLOR: blue;TEXT-WEIGHT:700;TEXT-DECORATION: none}\n"
+"A:hover\n{\nCOLOR:purple; TEXT-WEIGHT:700;TEXT-DECORATION: underline}\n"
+".showingsty{display:inline;padding:" + unipadding + ";border-radius:3px;border:1px #3399CC solid !important;font-family:" + unifontfamily +";font-size:" +
unifontsize +";background-color:white;color:black}\ndiv.bindlabel{display:inline;background-color:orange;color:white;border:1px white outset;font-family:" + unifontfamily +";font-size:" +
17 +"px;border-radius:" + (2) +"px !important;width:" + (24) +"px !important;height:" + (24) +"px !important;font-weight:bold;text-shadow:#b0b0b0 -1px -1px}\n    span.bindspan{background-color:lightgreen;color:black;font-weight:670;border:1px white outset;font-family:" + unifontfamily +";font-size:" +
unifontsize +"}\ndiv.binddata{background-color:lightgreen;color:black;font-weight:670;border:1px white outset;font-family:" + unifontfamily +";font-size:" +
unifontsize +"}\n.bindclik{background-color:transparent;padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;border:0px;font-family:" + unifontfamily +";font-size:" +
unifontsize +";border:1px white outset}\n");

if (typeof(myprompt)== 'undefined')
myprompt = function(x){alert(x.replace(/<br>/g,'\n').replace(/<[^>]+>/g,''));}
if (typeof(visual)=='undefined') 
{
    var failedformsubmit = null;
    var visual = function(f){failedformsubmit = 'document.' + f.name + ".submit();";}
    var redoexpired = function(w){eval(failedformsubmit);}
}
var numtables = 0;
var tablelist = new Array();
var defaultav = "";
var tablehidden = "";
var numfields = 1;
var parsed = "";
var uid1 = "";
var uid2 = "";
if (typeof uid != 'undefined') uid1= uid;
if (typeof uid !='undefined' && uid !='')
      uid2 = uid +"&cdrdap=1";
var subdb = "";
if (uid1!='') subdb='&subdb=' + uid1 +"&cdrdap=1";
var jsbases = document.getElementsByTagName("script");
var jsbase = "";
if (typeof(formselementbyname) == 'undefined')
{ 
formselementbyname = function(formhandle, elenametxt)
{
   if (formhandle == null) return null;
   for (var i=0; i < formhandle.elements.length; i++)
       if (formhandle.elements[i].name == elenametxt)
           return formhandle.elements[i];
   return null;
}
}
function getRSAkeys()
{
    var defaultrsakey = "10001,202700adbd85e2d7182720c3a0ee19c1,30db31542ace0f7d37a629ee5eba28cb,7";
    return defaultrsakey.split(",");
}
function handleError( errType, errURL, errLineNum )
{
   
   myprompt( "Error: " + errType + "\non " + errURL + "\nat line " + errLineNum);
   return true;
}
//window.onerror = handleError;
function dimen(n)
{
   return  [n.offsetWidth,n.offsetHeight];
}
function _slen(n)
{
      if (navigator.appName=='Microsoft Internet Explorer'
         || navigator.appName=='Netscape')
      {
        var x = Math.round(n.offsetWidth/n.innerHTML.length);
        if (x < 8) return x;
      }
      return 8;
}
function search_(n)
{
   if (n==null || n.innerHTML==null) return null;
   if (n.innerHTML.indexOf("_")==0 && n.innerHTML.replace(/__[_]*/,'')=='')
   {
       return n;
   }
   var cds = n.childNodes;
   if (cds == null) return null;
   for (var i=0; i < cds.length; i++)
   {
      var nn = search_(cds[i]);
      if (nn!=null) return nn;
   }
   return null;
}


function gettext(n)
{
   if (n==null) return "";
   var tx = n.innerHTML;
   if (tx==null) return "";
   if (tx.indexOf("<img ")>=0 || tx.indexOf("<input ")>=0) return " ";
   return tx.replace(/<[^>]+>/g,'').replace(/&nbsp;/gi,'').replace(/\n/g,'').replace(/\r/g,'').replace(/ /g,'').replace(/\xA0/g,'').replace(/\x09/g,'');
}

function gettext1(n)
{
   if (n==null) return "";
   var tx = n.innerHTML.replace(/\n/g,' ');
   if (tx==null) return "";
   return tx.replace(/<br[\>]*>/gi,'\n').replace(/<[^>]+>/g,'').replace(/&lt;/gi,'<').replace(/&nbsp;/gi,' ');
}

function settext(tx)
{
   if (tx!=null && tx.search("<[^>]*>")>=0)
      return tx;
   return tx.replace(/</g,'&lt;').replace(/\n/g,'<br>').replace(/  /g,'&nbsp;');
}
var maxelewidth = 0; 
function searchb(n)
{
   var i = 0;
   if (n.nodeName.toLowerCase()=='body')
   {
      numtables = 0;
      tablehidden = "";
      maxelewidth = 200;
   }
   else if (n.nodeName.toLowerCase()=='table' && n.outerHTML.indexOf("__")<0)
   {
       
       var kk=0;
       for (; kk < numtables; kk++)
          if (n==tablelist[kk])
             return;
       
       var hasunderscore = false;
       var found = false;

       for (i=0; i < n.rows.length; i++)
       {
          var rs = n.rows[i];

          for (var j =0; j < rs.cells.length; j++)
          {
            var inv = rs.cells[j].innerHTML.toLowerCase();

            if (inv.indexOf("__")>=0  ||inv.indexOf("<input ")>=0 || inv.indexOf("<textarea ")>=0 || inv.indexOf("<select ")>=0)
            {
                hasunderscore = true;
                break;
            }
            else if (found || gettext(rs.cells[j]) ==''
               && (j < rs.cells.length-1 &&  gettext(rs.cells[j+1])==''
               ||  i < n.rows.length-1   &&  gettext(n.rows[i+1].cells[j])==''
               ))
            {
                found = true;
            }
          }
          if (hasunderscore) break;
       }
       if (hasunderscore==false&&found)
       {
          tablelist[numtables++] = n;
       }
   }
   if (n.nodeName.toLowerCase()!='body' && typeof(n.offsetWidth) !='undefined' &&  maxelewidth < n.offsetWidth)
       maxelewidth = n.offsetWidth;
   var cds = n.childNodes;
   if (cds == null || cds.length == 0) return;

   for (i=0; i < cds.length; i++)
   {
         searchb(cds[i]);
   }

}
var more = true;
function buildhidden(m)
{
   for (var k=0; k < numtables; k++,m++)
   {
       tablehidden += "<input name=b" + m + " type=hidden value=\"\">";
   }
}

var source = "";
var pos = 0, isnewrow=false;
var colrow = '';
function readtd()
{
   var j = pos + 1;
   while (pos < source.length && source.charAt(pos)!="|")pos++;
   if (pos>j) 
       colrow = source.substring(j,pos);
   else 
       colrow = '';
   if (pos==source.length) return null;
   var state = 0;
   var i = pos, j=source.length;
   while (pos < source.length)
   {
      if (source.charAt(pos)=="|")
      {
         state = 1 - state;
         j=pos;
      }
      else if (source.charAt(pos)=="," )
      {
         if (state == 0)
         {
            isnewrow=false;
            break;
         }
      }
      else if (source.charAt(pos)==";" )
      {
         if (state == 0)
         {
            isnewrow=true;
            break;
         }
      }
      pos++;
   }
   if (j==i+1) return '';
   return source.substring(i+1,j).replace(/\|\|/g,'|');
}
function appendRow(n,m,editable)
{
           var i = n.rows.length;
           var rs = n.insertRow(i);
           rs.setAttribute("style","mso-yfti-lastrow:yes");
           for (var k=0; k < n.rows[i-1].cells.length; k++)
           {
               var tdele =  rs.insertCell(k);
               if (n.rows[i-1].cells[k].hasAttribute("colspan"))
               {
                   var cspan = n.rows[i-1].cells[k].getAttribute("colspan");
                   if (cspan!=null)
                   tdele.setAttribute("colspan",cspan);
               }
               if (n.rows[i-1].cells[k].hasAttribute("align"))
               {
                   var cspan = n.rows[i-1].cells[k].getAttribute("align");
                   if (cspan!=null)
                   tdele.setAttribute("align",cspan);
               }
               if (n.rows[i-1].cells[k].className!=null)
               {
                   tdele.className = n.rows[i-1].cells[k].className
               } 
               var st = n.rows[i-1].cells[k].style;
               var css = "";
               for (var x in st)
               {
                  if (st[x]!='')
                  {
                     css +=  x.replace(/([a-z])([A-Z])/,'$1-$2').toLowerCase() + ":" + st[x] +";";
                  }
               }
               tdele.style.cssText =  css.replace(/^csstext/i,'');
               //var textNode = document.createTextNode("&nbsp;");
               tdele.innerHTML="&nbsp;";
               tdele.onclick = editcell1;
           }
           return rs;
}
function fill(m,editable)
{
   pos = 0;
   var n = tablelist[m];
   n.style.backgroundColor = 'white';
   n.style.border = "1px lightblue solid !important"
   n.style.color ='black';
   n.style.borderRadius = '3px !important';
   if (n==null) return;
   n.style.border = n.rows[0].cells[0].style.border;
   var v = null;
   var i = 0, j = 0, k=0;
   var rs = null;
   while (true)
   {
      v = readtd();
     
      if (v==null && i == n.rows.length) break;
      if (v==null) v = "";
      
      if (v=='') v = '&nbsp;';
      if (i < n.rows.length)
         rs = n.rows[i];
      else
      {
         rs = appendRow(n,m,editable);
      }

      if (i==0 && isheading[m])
      {
          rs.cells[j].onclick = editcell1;
      }
      else
      {
          rs.cells[j].innerHTML = settext(v);
          
      }
      if (!isnewrow)
      {
         if (j < rs.cells.length-1)
            j++;
         else
         {
            while (isnewrow ==false && v!=null)
            {
               v = readtd();
            }
            if (v==null) break;

            j=0;
            i++;
         }
      }
      else
      {
         j=0;
         i++;
      }
   }

   for (i=0; i < n.rows.length; i++)
   {
      rs = n.rows[i];
      for (j=0; j < rs.cells.length; j++)
      {
         var tt = gettext1(rs.cells[j]).replace(/ /g,'').replace(/\n/g,'');
         if (i==0 && (typeof(rs.cells[j].width) == 'undefined' ||  rs.cells[j].width  == null))
         {
            var xxx = rs.cell[j].offsetWidth;
            if (xxx<10) {
            if (unifontsize!='inherit')
            {
                xxx = tt.length * parseInt(unifontsize.replace(/px/,''));
            }
            else
            {
                xxx = tt.length * 17;
            }
            }
            rs.cells[j].width = xxx +"px";

         }
         if (tt!='' && tt.replace(/[0-9]/g,'').replace(/\./,'') == '')
         {
            rs.cells[j].setAttribute("align","right");
            rs.cells[j].setAttribute("valign","top");
         }
      }
   }

}

function retrvtablevalue(n)
{
    var s = "", x;
    var start = false;
    for (var i=0; i < n.rows.length-1; i++)
    {
       var isblank = true;var rowstr = "";
       for (var j=0; j < n.rows[i].cells.length; j++)
       {
          x = gettext1(n.rows[i].cells[j]).replace(/^[ ]+$/,'').replace(/\|/g,"||");
          if (isblank  && x!='')isblank = false;
          //if (start==false && x=='')continue;
          start = true;
          var cols = "1";
          if (typeof (n.rows[i].cells[j].colSpan) != 'undefined'
              && n.rows[i].cells[j].colSpan!=null)
              cols = n.rows[i].cells[j].colSpan;

          var rows = "1";
          if (typeof (n.rows[i].cells[j].rowSpan) != 'undefined'
             && n.rows[i].cells[j].rowSpan != null)
             rows = n.rows[i].cells[j].rowSpan;

          var vv = '';
          if (rows !='1' || cols !='1' || x.match(/^[0-9]+,.*/)!=null)
             vv =   rows + "," + cols + ",";
          if (j>0)
             rowstr += ",";
          rowstr +=  vv + "|"  +  x +"|";
       }
       if (isblank==false){if (s!='') s += ";";s += rowstr;}
    }
    return s;
}

var isheading = new Array();
function tellisheading()
{
   for (var k=0; k < numtables; k++)
   {
       var n = tablelist[k];
       var xx = 0;
       var i=0;
       for (var j =0; j < n.rows[0].cells.length; j++)
          if (gettext(n.rows[0].cells[j])!='')
          {xx++;}
       if (xx >= n.rows[0].cells.length - 1)
        isheading[k] = true;
       else
          isheading[k] = false;
   }
}

function enableedit(label)
{
   for (var k=0; k < numtables; k++)
   {
       var n = tablelist[k];
       n.border = "1px";
       n.style.border = "1px #3399CC solid";
       
       var xx = 0;
       var i=0;
       for (var j =0; j < n.rows[0].cells.length; j++)
          if (gettext(n.rows[0].cells[j])!='')
          {xx++;}
       if (xx >= n.rows[0].cells.length - 1)
       {
          isheading[k] = true;
          for (j =0; j < n.rows[0].cells.length; j++)
          {
            n.rows[0].cells[j].style.backgroundColor = "#F5F3DC";
            n.rows[0].cells[j].onclick =editcell1;
          }
          i = 1;
       }
       else
          isheading[k] = false;

       var ss = "";
       for (i=0; i < n.rows.length; i++)
       {
          var rs = n.rows[i];
          for (j =0; j < rs.cells.length; j++)
          {
               var xy = dimen(rs.cells[j]);
               if (xy[1] < 23)
                  rs.cells[j].parentNode.height = "23px";

               if(gettext(rs.cells[j])=='')
               {
                  rs.cells[j].className = "bindtext";
                  if (label  )
                     rs.cells[j].innerHTML = "&nbsp;";// "b" +(k+numfields)+"_" +i +"_" +j;
                  else
                     rs.cells[j].innerHTML = "&nbsp;";
               }
               
               rs.cells[j].onclick = editcell1;
          }
       }
    }
}
function enablesearch(m)
{
   for (var k=0; k < numtables; k++,m++)
   {
       var n = tablelist[k];
       var ntd =0;
       for (var i=0; i < n.rows.length; i++)
          if (n.rows[i].cells.length > ntd)
             ntd = n.rows[i].cells.length;
       addsearch(n,ntd,m);
   }
}
function addsearch(n,ntd,m)
{
   // var nd = n.insertRow(n.rows.length);
   // var tdele = nd.insertCell(0);
   // tdele.colspan = "" + ntd;
    var xy = dimen(n);
    var inp = document.createElement("input");
    inp.className = 'bindtext';
    inp.name="b" + m;
    inp.style.width = (xy[0]-2) + "px";
    insertAfter(n, inp);

}

var handle = null;
function openwin()
{
  var winopt = "location=0,menubar=1,toolbar=0,scrollbars=1,resizable=1,width=300,height=" + (screen.height-200)/2 +",left=" + (screen.width-300)/2 +",top=200";
  handle = window.open("", "tinyerr", winopt);
  if (handle!=null) handle.document.write(lblwait);
  document.f.target='tinyerr';
  return handle;
} 
function trim(x)
{
    if (x == null) return x;
    return x.replace(/^[\n|\r|\t| ]+/,'').replace(/[\n|\r|\t| ]+$/,'');
}
function findsep(str)
{
   str = trim(str);
   var ii = 0;
   for(; ii < str.length; ii++)
   if (str.charAt(ii)==','||str.charAt(ii)=='\n'||str.charAt(ii)=='/')
   {
      var a1=str.substring(0,ii);
      while (ii<str.length && (str.charAt(ii)==' ' || str.charAt(ii)==','||str.charAt(ii)=='\n'||str.charAt(ii)=='/'))ii++;
      return [a1, str.substring(ii).replace(/\n/g,'')];
   }

   for (ii=str.length-1; ii>=0 && str.charAt(ii)!=' '; ii-- )
       ;

   if (ii>=0)
      return [str.substring(0,ii).replace(/\s*$/, ""), str.substring(ii+1)];

   return [str, ''];
}
var suspects = ""; 
function scansuspect(bet)
{
    for (var j0=0; j0 < bet.length-3; j0++)
      {
          var zz = bet.charCodeAt(j0);
          if (zz == 8212 || zz==45)
          if (bet.charAt(j0) == bet.charAt(j0+1) && bet.charAt(j0) == bet.charAt(j0+2))
          {
              var j1 = 3;
              while (j1+j0 < bet.length && bet.charAt(j0+j1) == bet.charAt(j0)) j1++;
              suspects  += bet.substring(j0,j0+j1) + "<br>";
              j0 += j1;
          }
      }
}
function scanopts(opt, bet, newselr, maxlen, issel, mapc2v)
{
      scansuspect(bet);
      var ans = new Array(7);
      var newsel = '';
      var newsropts = ' ';
      var i1 = 0, i2=0;
      var arr = null;
      var firstkind = false;
      while (true)
      {
         i1 = bet.indexOf("(",i2);
         if (i1 < 0)
            break;
         else
         {
            i2 = bet.indexOf(")",i1);
            if (i2 <=0)
               break;
            else
            {
               var tt =  bet.substring(i1+1, i2);
                
               var ss = tt.replace(/<.p>/ig,'\n').replace(/<br>/ig,'\n').replace(/<[^>]*>/g,'').replace(/<.*/,' ').replace(/&nbsp;/ig,' ');
               var ww = "";
               if (ss.indexOf('=')==0) ss = ' ' + ss;
               if (ss.lastIndexOf("=")==ss.length-1) ss = ss +" ";
               arr = ss.split(/=/);
               var newsropts1 = "", newsropts2=""; 
               if (arr.length > 2)
               {
                  firstkind = true;
                  newselr = '';
                  issel = (tt.indexOf("/") > 0 || tt.toUpperCase().indexOf("<BR>") > 0 || tt.toUpperCase().replace(/<.TR>/,'').indexOf("</TR>")>0);
                  
                  var interncode=trim(arr[0]);
                  for (var i3=0; i3 < arr.length-1; i3++)
                  {
                     var ar = findsep(arr[i3+1]);

                     var caption = ar[0];
                     if (interncode.length > maxlen)
                         maxlen = interncode.length;
                     
                     if (i3>0)
                        ww+=",";
                     if (caption!=interncode)
                     {
                        ww += interncode + "=" + caption;
                     }
                     else ww += interncode;
                     
                     newsropts1 += caption +",";
                     newsropts2 += interncode +",";
                     newsel += "<option value=\"" + interncode + "\">" +  caption +"</option>";
                     newselr += "<input type=radio class=transparent value=\"" + interncode + "\" name=r > " + caption + " ";
                     if (mapc2v!=null) mapc2v['|'+interncode +"|"] = caption;
                     interncode = ar[1];
                  }
                  newsropts += newsropts1.replace(/,$/,";") + newsropts2.replace(/,$/,"");
                  bet =  bet.substring(0,i1 )  + ((opt=='s')?'('+ww+')':'')  +  bet.substring(i2+1) ;
                  break;
               }
            }
         }
      }
      i1 = i2 =0;
      if (firstkind == false)
      while (true)
      {
         
         i1 = bet.indexOf("(",i2);
         if (i1 < 0)
            break;
         else
         {
           
            i2 = bet.indexOf(")",i1);
            if (i2 <=0)
               break;
            else
            {
               tt =  bet.substring(i1+1, i2);
               firstkind = true;
               ss = tt;//eplace(/<.p>/ig,'\n').replace(/<br>/ig,'\n').replace(/<[^>]*>/g,'').replace(/<.*/,' ').replace(/&nbsp;/ig,' ');
               ww = "";
               if (ss.indexOf('/')==0) ss = ' ' + ss;
               if (ss.lastIndexOf("/")==ss.length-1) ss = ss +" ";
 
               arr = ss.split(/\//); 
               if (arr.length > 1)
               {
                  var newselmaybe = '';
                  for (i3=0; i3 < arr.length; i3++)
                  {
                     if (arr[i3].length > maxlen)
                         maxlen = arr[i3].length;
                     arr[i3] = trim(arr[i3]);
                 if (arr[i3].indexOf("<")>=0 || arr[i3].indexOf(">")>=0 || arr[i3].indexOf(",")>=0 || arr[i3].indexOf("\"")>=0 ||
                     arr[i3].indexOf(")")>=0 || arr[i3].indexOf("(")>=0 || arr[i3].indexOf("{")>=0 || arr[i3].indexOf("}")>=0  || 
                     arr[i3].indexOf("[")>=0 || arr[i3].indexOf("]")>=0 || arr[i3].indexOf(";")>=0 || arr[i3].indexOf(":")>=0  )
                     {
                        firstkind  = false;
                        break;
                     }
                     if (i3>0)  ww+=",";
                     ww += arr[i3];
                     newsropts1 += arr[i3] +",";
                     newsropts2 += arr[i3] +",";
                     newselmaybe += "<option value=\"" + arr[i3] + "\">" +   arr[i3] +"</option>";
                     if (mapc2v!=null) mapc2v['|'+arr[i3] +"|"] = arr[i3];
                  }
                  if (firstkind == false) continue;
                  newsropts += newsropts1.replace(/,$/,";") + newsropts2.replace(/,$/,"");
                  bet =  bet.substring(0,i1 )  + ((opt=='s')?'('+ww+')':'')  +  bet.substring(i2+1) ;
                  newselr = ''; 

                  issel = true;
                  newsel = newselmaybe;
                  break;
               }
            }
         }
      }
      ans[0] = newselr;
      ans[1] = maxlen;
      ans[2] = issel;
      ans[3] = newsel;
      ans[4] = newsropts;
      ans[5] = bet;
     
      return ans;
}

var rdap = "";
var opt = "";
var param = "";
var helpstr = "";
if (typeof optstr == 'undefined')
   var optstr = document.location.search;
if (optstr==null) optstr = "";
function parse()
{

if (typeof filename != 'undefined')
{
   rdap = filename;
   opt = 'a';
   optstr = "?a";
}
if (rdap=='')
{
   rdap = "" + document.location;
   var ind = rdap.indexOf("ac=") + 3;
   if (ind==2)
      optstr = "";
   else
      optstr = "?" + rdap.substring(ind).replace(/&.*/,'');
   ind = rdap.indexOf("rdap=") + 5;
   rdap = rdap.substring(ind).replace(/&.*/,'');
}

 

if (optstr.indexOf("a") ==1)
{
   opt = "a";
}
else if (optstr.indexOf("v") ==1) //for modify and development, find name corresponding
{
   opt = "v";
}
else if (optstr.indexOf("m") ==1) //for modify and development, find name corresponding
{
   opt = "m";
}
else if (optstr.indexOf("d")==1)
{
   param = optstr.substring(2);
   opt = "d";
   if (''+ parseInt(param)=='NaN')
   {
      getInput();
      return;

   }
}
else if (optstr.indexOf("r") ==1)
{
   opt = "r";
   param = optstr.substring(2);
   if (param=='a')
   {
      getInput1();
   }
}
else if (optstr.indexOf("s") ==1)
{
   opt = "s";
}
else if (optstr.indexOf("u") ==1)
{
   opt = "u";
   param = optstr.substring(2);
   if (''+ parseInt(param)=='NaN')
   {
      getInput();
      return;
   }
}
else if (optstr.length > 0)
{
   var base = ("" + document.location).replace(/&ac=[^&]*/,'');
   
   myprompt(lblreview + ": " + base + "&ac=ri\n" + lblsubmit+ ": " + base  +"\n" +  lblsearch +  ":" + base + "&ac=s\n"   + lblupdate +  ":" + base + "&ac=ui\n" +
   lbldelete +  ":" + base + "&ac=di\n");
   opt = 'x';
}

 
if (opt!='r' )
   divstr += ("textarea.noborder{border:0px;font-family:" + unifontfamily +";font-size:" +
unifontsize +"}\n.bindtext{padding:" + unipadding + ";border-radius:3px;border:1px #3399CC solid !important;font-family:" + unifontfamily +";font-size:" +
unifontsize +";background-color:white;color:black}\ntextarea.bindarea{vertical-align:top;padding:" + unipadding + ";border-radius:3px;border:1px #3399CC solid !important;font-family:" + unifontfamily +";font-size:" +
unifontsize +";background-color:white;color:black}\nselect.bindsel{padding:" + unipadding + ";border-radius:3px;font-family:" + unifontfamily +";font-size:" +
unifontsize +";background-color:white;color:black;border:1px #3399CC solid !important}\ninput.transparent{background-color:transparent;color:#3399CC}");
else
   divstr += "div.forcurve{background-color:#00DC89;color:#DDCC11;border:1px #888888 outset;height:48px;font-size:40px;font-weight:700}";
divstr += ("\ninput.button{cursor:pointer;background-color:#3399CC;color:white;border-radius:3px;border:1px #b0b0b0 outset;text-shadow:#696969 -1px -1px;font-weight:bold;width:70px;border:1px #b0b0b0 outset;font-family:" + unifontfamily +";font-size:" +
unifontsize +"}\n .panel{background-color:#dddddd;color:black;border-radius:3px;border:1px #b0b0b0 outset;border:1px #bbbbbb solid;padding:3px 3px 3px 3px;font-family:" + unifontfamily +";font-size:" +
unifontsize +"}\ninput.noborder{border:0px;font-family:" + unifontfamily +";font-size:" +
unifontsize +"}</style>");

var first_ = search_(bd);
if (first_!=null)  slen = _slen(first_);
var sropts=' ', allsropts='';

var j=1;

 
 
var issel = false;
k = 0;
var indices = [];
indices[0] = 0;
while (k < endtxtn)
{
      var m = us.exec(txt.substring(k));
      if (m==null  || k+m.index >= endtxtn)
      {
          scansuspect(txt.substring(k,endtxtn));
          break;
      }
      indices[indices.length] = k + m.index;
      var bet = txt.substring(k,k+m.index); //.replace(/^<.span>/i,'').replace(/<span[^>]*>$/i,'');
    
      maxlen = 1;
      var ans  =  scanopts(opt, bet, newselr, maxlen, issel);
      
       newselr = ans[0];
       maxlen = ans[1];
       issel = ans[2];
       var newsel = ans[3];
       var newsropts = ans[4];
       bet = ans[5];
      
         str += bet;
         len = ("" + m).length;
          
         if (newsel !='')
         {
            sel = newsel;
            sropts = newsropts;
         }
         else
         {
            if (oldlen!=len)
            {
               sel = '';
               sropts = '';
            }
         }
         oldlen = len;
         var beth = bet;
         if ((jj = beth.toLowerCase().lastIndexOf("</table>"))>0)
         {
            beth = beth.substring(jj);
         }
         beth = beth.replace(/<[^>]+>/g,'').replace(/\n/g,' ').replace(/&nbsp;/g, '');
         if (j==1)
         {
             if(beth.length > 40)
                beth = beth.substring(beth.length-40);
         }
         else if (beth.length > 200)
             beth = beth.substring(0, 200); 
         if (sel=='')
         {
         if (len == 2)    //checkbox
         {
            allele += '=&c' +j;
            if (opt=='a')
            {
               ts += ",??c" + j +"??";
               fds +=",c" + j +" AS c" + j +"_c_1";
               sql += "c" + j + " SMALLINT,";
               if (updatesql!='') updatesql +=",";
               updatesql += "c" + j + "=??c" + j +"??";
               where += "AND c" + j + " = ??c" + j +"??";

               helpstr += "\nc" + j + ",1,,," + beth ;
            }
            else if (opt=='m')
            {
                str += "<font color=red>(c" +j +")</font>";
                sql += "c" + j + " SMALLINT,";
                 
            }
            else if (opt=='v')
            {
                str += "<span style=\"border:2px red solid;color:red;font-family:arial;padding:0px\" onclick=deletefield('c" +j +"') >x</span>";
                sql += "c" + j + " SMALLINT,";
                 
            }
            
            if (opt=='r')
               str += "<input  name=c" + j +" value=\"\" type=hidden>";
            else
               str += "<input tabindex=" + j + " name=h" + j +" class=transparent type=checkbox onclick=set(" + j +")><input type=hidden name=c" + j +" value=\"0\" " + ((opt=='s')?'disabled':'') + " >";
         }
         else if (txt.charAt(k+m.index-1)=='[' && txt.charAt(k + m.index + len)==']')
         {
            allele += '=&a' +j;
            if (opt=='m')
               str = str.substring(0,str.length-1) + "<font color=red>(a" + j +")</font> ";
            else if (opt=='v')
            {
                str = str.substring(0,str.length-1) + "<span style=\"border:2px red solid;color:red;font-family:arial;padding:0px\" onclick=deletefield('a" +j +"') >x</span>";
            }
            
            if (opt=='r') // peel the last char, which is "["
               str = str.substring(0,str.length-1) + "<input  name=a" + j +" value=\"\" type=hidden>";
            else if(opt=='s')
               str = str.substring(0,str.length-1) + "&supe;<input class=bindtext   tabindex=" + j +  "  name=a" + j +" size=70>";
            else
            {
               str = str.substring(0,str.length-1) + "<textarea class=bindarea tabindex=" + j +  "  name=a" + j +" rows=4 cols=" + len +" onfocus=countline(this) onkeypress=\"return bigger(this,event)\">";
               str += "</textarea>";
            }

            if (opt=='a')
            {
               sql +=  "a" + j  + " TEXT,";
               ts += ",'??a" + j +"??'";
               fds +=",a" + j +" AS a" + j + "_a";
               if (updatesql!='') updatesql +=",";
               updatesql += "a" + j + "='??a" + j +"??'";
               where += "AND a" + j + " LIKE '%??a" + j +"??%'";
               helpstr += "\na" + j + ",0,,," + beth  ;
            }
            else if (opt=='m' || opt =='v')
            {
               sql +=  "a" + j  + " TEXT,";
            }
            
            k+=1;
         }
          
         else  
         {
               var tp = 't';
               if (txt.charAt(k+m.index-1)=='@' && txt.charAt(k + m.index + len)=='@' )
               {
                   str = str.substring(0, str.length-1);
                   k++;
                   tp = 'f';
               }    
               
               
               leng = 20;
               if (tp=='t') leng = ((2*len>255)?255:(2*len));
               else if (tp == 'f') leng = 255;

               allele += '=&t' +j;
               if (opt=='m') 
                   str +="<font color=red>(" + tp  + j +")</font>";
               else if (opt=='v')
               {
                   str += "<span style=\"border:2px red solid;color:red;font-family:arial;padding:0px\" onclick=deletefield('" + tp+j +"') >x</span>";
                }
               if (opt == 's') str += "&supe;";
               var wlen = Math.round(len*slen);
               
               var needhidden = ""; 
               if (opt=='r' || tp == 'f'&&opt!='s')
               {
                   needhidden = ";visibility:hidden";
                   wlen = 1;
               }
               
                str += "<input type=text class=bindtext tabindex=\"" + j + "\" name=\"" + tp + j +"\" style=\"width:" + wlen + 'px' + needhidden + "\"";
              
               //if (tp == 'f') str += " readonly "
               if (opt=='a')
               {
                  if (tp =='f')
                      sql +=   tp + j +" TEXT,";
                  else
                  sql +=   tp + j +" VARCHAR(" + leng +"),";
                   
                  ts += ",'??" + tp + j +"??'";
                  fds +="," + tp+ j +" AS " + tp + j +"_t_" + len;
                  if (updatesql!='') updatesql +=",";
                  updatesql +=  tp + j + "='??" + tp + j +"??'";
                  where += "AND " + tp + j + " LIKE '%??" + tp + j +"??%'";

                  helpstr += "\n" + tp + j + ",0,,," + beth  ;
               }
               else if (opt=='m' || opt =='v')
               {
                  sql +=  tp + j +" VARCHAR(" + leng +"),";
                 
               }
               
               str += " value=\"\"  />";
               if (tp == 'f')
               {
                   str += "<br><br>";
               }
              
         }
         
         }
         else  // selective
         {
            if (issel==false) // use radios
            {
               if (maxlen < len) maxlen = len;
               if (opt=='m')
               {
                   sql += "r" + j + " VARCHAR(" + (2*maxlen) +"),";
                   str += "<font color=red>(r" +j +")</font>";
               }
               else if (opt=='v')
               {
                  str += "<span style=\"border:2px red solid;color:red;font-family:arial;padding:0px\" onclick=deletefield('r" +j +"') >x</span>";
                  sql += "r" + j + " VARCHAR(" + (2*maxlen) +"),";
               }
               else if (opt=='a')
               {
                  sql += "r" + j + " VARCHAR(" + (2*maxlen) +"),";
                  fds +=",r" + j +" AS r" + j +"_r";
                  ts += ",'??r" + j +"??'";
                  if (updatesql!='') updatesql +=",";
                  updatesql += "r" + j + "='??r" + j +"??'";
                  where += "AND r" + j + " LIKE '%??r" + j +"??%'";
                 
                  
                  helpstr += "\nr" + j + ",1,,," +  beth;
                  allsropts += "\n\n" + sropts;
               }

               allele += '=&r' +j;
               if (opt == 's') str += "&supe;";
               if (opt=='r')
                 str += "<input  name=r" + j +" value=\"\" type=hidden>";
               else if(opt=='s')
                  str += "<input class=bindtext tabindex=" + j +  "  name=r" + j +" style=width:" + (len*slen) + ">";
               else
                  str += newselr.replace(/name=r/g,"name=r" + j);


            }
            else
            {
               var wlen = Math.round(len*slen);
                
               allele += '=&s' +j  ;
               if (opt=='m')
               {
                   str += "<font color=red>(s" +j +")</font>";
               }
               else if (opt == 'v')
               {
                   str += "<span style=\"border:2px red solid;color:red;font-family:arial;padding:0px\" onclick=deletefield('s" +j +"') >x</span>";
               }
               if (opt=='r')
                 str += "<input  name=s" + j +" value=\"\" type=hidden>";
               else if(opt=='s')
                  str += "&supe;<input class=bindtext tabindex=" + j +  "  name=s" + j +" style=width:" + wlen + ">";
               else
                 str += "<select class=bindsel tabindex=" + j +   " name=s" + j +"><option value=\"\" selected>" + lblselect + "</option>" + sel +"</select>";
               if (opt=='m' || opt =='v')
               {
                   sql += "s" + j + " VARCHAR(" + ((2*len>255)?255:(2*len)) +"),";
               }
               else if (opt=='a')
               {
                  sql += "s" + j + " VARCHAR(" + ((2*len>255)?255:(2*len)) +"),";
                  fds +=",s" + j +" AS s" + j +"_s";
                  ts += ",'??s" + j +"??'";
                  if (updatesql!='') updatesql +=",";
                  updatesql += "s" + j + "='??s" + j +"??'";
                  where += "AND s" + j + " LIKE '%??s" + j +"??%'";
                  helpstr += "\ns" + j + ",1,,," + beth ;
                  allsropts += "\n\n" + sropts;
               }
           }
        }
       
         k += m.index + len;
         j++;

 }
 function makesubbtn()
 {
     
 }
 if (opt=='a')
 {
     if (parent!=self && typeof(parent.parent.frames[0].get)!='undefined' && typeof(parent.parent.frames[0].getsuspects)!='undefined' )
     parent.parent.frames[0].getsuspects(suspects);
 }

   var tailstr = txt.substring(k);

   numfields = j;

   var inputdivstr = "<div id=inputdiv style=\"position:absolute;visibility:hidden;border:0px;margin:0px 0px 0px 0px;width:1px;height:1px;left:0px;top:0px;background-color:transparent\">"
                   + "<input class=noborder id=inputtext style=\"border:1px #202020 solid;margin:0px 0px 0px 0px  !important;width:1px;height:1px;\" tabindex=" + (numfields + 1) +" name=mvtxt    onkeypress=\"return toarea(this,event)\" >"
                   + "<input class=noborder id=land1 type=button style=\"border:0px;margin:0px 0px 0px 0px  !important;margin:0px 0px 0px 0px;width:1px;height:1px;background-color:transparent\" onfocus=passf()  tabindex=" + (numfields + 2) +">"
                   +"</div>";
   var areadivstr = "<div id=areadiv style=\"position:absolute;visibility:hidden;border:0px;margin:0px 0px 0px 0px;width:1px;height:1px;left:0px;top:0px;background-color:transparent\">"
                   + "<textarea class=noborder id=areatext  style=\"border:1px #202020 solid;margin:0px 0px 0px 0px!important;width:1px;height:1px;\" tabindex=" + (numfields + 1) +" name=mvarea   onkeypress=\"return bigger1(this,event)\" onfocus=countline(this)></textarea>"
                    + "<input class=noborder id=land2 type=button style=\"border:0px;margin:0px 0px 0px 0px !important;margin:0px 0px 0px 0px;width:1px;height:1px;background-color:transparent\" onfocus=passf() tabindex=" + (numfields + 2) +">"
                   + "</div>"
   var anchorstr =  "<input type=button style=\"width:100px;height:30px;background-color:blue;cursor:pointer\" onfocus=\"passf()\" value=Land tabindex=\"" + (numfields + 2) +"\" name=passf1>";


   if (jsbases.length>0)
   {
     for (kk=jsbases.length-1;kk>=0;kk--)
       if (jsbases[kk].src.indexOf("databind.js")>=0)
         break;
     if (kk>=0)
      jsbase = jsbases[kk].src.replace(/databind.js/,'');

   }
 
   if (opt=='a')
   {
      
      searchb(bd);
      buildhidden(numfields);
     
      for (k=0; k < numtables; k++,j++)
      {
         sql += "b" + j + "  TEXT  NOT NULL DEFAULT '" + retrvtablevalue(tablelist[k]).replace(/'/g,"''") +"',";
         ts += ",'??b" + j + "??'";
         fds += ",b" + j +" AS b" + j +"_b_" + tablelist[k].offsetWidth + "_30";
         where += "AND b" + j + " LIKE '%??b" + j +"??%'";
         if (updatesql!='') updatesql +=",";
         updatesql += "b" + j + "='??b" + j +"??'";
         defaultav += "b" + j +"=" + retrvtablevalue(tablelist[k]).replace(/'/g,"''").replace(/\n/g,' ') +"\n";
      }
      if (j > 1)
      {
         sql = "CREATE TABLE " + rdap + "(lastupdate BIGINT, n INTEGER," + sql + " PRIMARY KEY (n))";
         
         var zeror = "INSERT INTO " + rdap + "(lastupdate,n" + ts.replace(/\?\?/g,'').replace(/'/g,'') + ") VALUES (" + (''+((new Date()).getTime()/1000)).replace(/\..*$/,'') +",0" + ts.replace(/[0-9]/g,'').replace(/\?\?c\?\?/g,'0').replace(/\?\?/g,'') +")";
         var inst =  "INSERT INTO " + rdap + "(n" + ts.replace(/\?\?/g,'').replace(/'/g,'') + ") SELECT max(n) + 1" + ts  +" FROM " + rdap ;
         fds = "SELECT n as n_h" + fds + " FROM  " + rdap + " ??wcds?? order by n" + allsropts;
         updatesql = "UPDATE " + rdap + " SET " + updatesql  +" WHERE n=??n??";
         deletesql = "DELETE FROM " + rdap + " WHERE n=??n??";
         parsed = sql + "&-@;#" + rdap + "&-@;#" + fds +"&-@;#" +  inst + "&-@;#" + updatesql + "&-@;#" + deletesql+ "&-@;#" + zeror + "&-@;#" + helpstr + " ";
      }
      else
      {
         parsed = " &-@;#" + rdap;
      }
  
      if (parent!=window && typeof(parent.parent.frames[0].get)!='undefined')
      {   
           
          bd.innerHTML = ""
           + divstr
           + inputdivstr
           + areadivstr
           + "<form rel=opener name=f method=post action=" + jsbase +"/Echo target=popup   >"
         + str + tailstr + "<input name=n type=hidden value=0>"
         + tablehidden
         + "<br>"
         + "<input type=hidden name=securitytoken value=\"" + securitytoken +"\">"
         + "</form><br><table align=center width=70px ><tr><td  id=holdbutton></td></tr></table>";
         
        searchb(document.body);
        unifonts(document.body);
        enableedit(false);
         
         parent.parent.frames[0].get(parsed);
         parent.parent.frames[0].closeprompt();
         parent.parent.frames[0].getdv(defaultav);
          
         var addedsub = document.getElementById('addedsubbutton');
         if (addedsub==null)
         addedsub = document.getElementById('holdbutton');
         if (addedsub!=null)
         addedsub.innerHTML = "<input   type=button class=button style=\"background-color:#00BBBB;color:white;text-align:center\" value=\"" + lblsubmit + "\" onclick=\"submita()\" >"  ;
      }
   }
   else if (opt=='m')
   {
      searchb(bd);
      buildhidden(numfields);

      for (k=0; k < numtables; k++,j++)
      {
         sql += "b" + j + "  TEXT  NOT NULL DEFAULT '" + retrvtablevalue(tablelist[k]).replace(/'/g,"''") +"',";
      }
      if (j > 1)
      {
         parsed = sql;
      }
      else
      {
         parsed = " !" + rdap;
      }

          bd.innerHTML = ""
           + divstr
           + inputdivstr
           + areadivstr
           + "<form rel=opener name=f method=post action=" + jsbase +"/wordform.jsp?mode=19 onsubmit=\"return true\"  >"
         + str + tailstr + "<input name=n type=hidden value=0>"
         + tablehidden
         + (parent.frames.length == 3?'':
          ("<br></form><br><br><table align=center width=70px ><tr><td  id=holdbutton></td></tr></table>")) 
         ;
        searchb(document.body);
        unifonts(document.body);
        enableedit(true);
        var addedsub = document.getElementById('addedsubbutton');
        if (addedsub==null)
            addedsub = document.getElementById('holdbutton');
        addedsub.innerHTML = "<form rel=opener  name=f1 method=post action=wordform.jsp  ><input type=hidden name=mode value=19><input name=defaultav type=hidden><input type=hidden name=rdap value=\"" + rdap +"\"><input tabindex=" + (numfields + 3) +" name=submit1 class=button   type=button value=\""
         + lblsave +"\"  onclick=submitm()><input type=button value=\"" + lblcancel +"\" onclick=\"parent.parent.parent.frames[0].openpage('wordform.jsp?mode=1','')\" class=button>"
         + "<input type=hidden name=securitytoken value=\"" + securitytoken +"\">"
         + "</form>"  ;
      
   }
   else if (opt=='v')
   {
      searchb(bd);
      buildhidden(numfields);

      for (k=0; k < numtables; k++,j++)
      {
         sql += "b" + j + "  TEXT  NOT NULL DEFAULT '" + retrvtablevalue(tablelist[k]).replace(/'/g,"''") +"',";
      }
      if (j > 1)
      {
         parsed = sql;
      }
      else
      {
         parsed = " !" + rdap;
      }

          bd.innerHTML = ""
           + divstr
           + inputdivstr
           + areadivstr
           + "<form rel=opener name=f method=post action=" + jsbase +"/wordform.jsp?mode=19 onsubmit=\"return true\"  >"
         + str + tailstr + "<input name=n type=hidden value=0>"
         + tablehidden
         + (parent.frames.length == 3?'':
          ("<br></form><br><br><table align=center width=70px ><tr><td  id=holdbutton></td></tr></table>")) 
         ;
        searchb(document.body);
        unifonts(document.body);
        enableedit(true);
         enableedit(true);
         var addedsub = document.getElementById('addedsubbutton');
        if (addedsub==null)
            addedsub = document.getElementById('holdbutton');
        addedsub.innerHTML = "<form rel=opener  name=f1 method=post action=wordform.jsp  ><input type=hidden name=mode value=19><input name=defaultav type=hidden><input type=hidden name=rdap value=\"" + rdap +"\"><input tabindex=" + (numfields + 3) +" name=submit1 class=button   type=button value=\""
         + lblsave +"\"  onclick=submitm()><input type=button value=\"" + lblcancel +"\" onclick=\"parent.parent.parent.frames[0].openpage('wordform.jsp?mode=1','')\" class=button>"
         + "<input type=hidden name=securitytoken value=\"" + securitytoken +"\">"
         + "</form>"  ;
   }
   else if (opt=="") // submit form
   {
      searchb(bd);
      buildhidden(numfields);
//DataWeb
      bd.innerHTML =   divstr + inputdivstr  + areadivstr +"<form rel=opener name=f method=post action=" + jsbase +"DataWeb    >" +
         str + tailstr +"<br><input name=n type=hidden value=0>"
         + "<input  name=which type=hidden value=insert>"
         + "<input  name=rdap value=\"" + rdap +"\" type=hidden>"
         + ( (subdb=='')?'':"<input name=subdb value=\"" + uid1 +"\" type=hidden><input name=cdrdap value=1 type=hidden>")
         + tablehidden
         + "<input type=hidden name=securitytoken value=\"" + securitytoken +"\"></form><br><table align=center width=70px ><tr><td  id=holdbutton></td></tr></table>"
          
      searchb(bd);
      unifonts(bd);
      enableedit(false);
      var addedsub = document.getElementById('addedsubbutton');
      if (addedsub==null)
          addedsub = document.getElementById('holdbutton');
      addedsub.innerHTML =  "<input  tabindex=" + (numfields + 3) +"   class=button style=\"background-color:#3399CC\" type=button value=\"" + lblsubmit +"\" onclick=\"submitt()\" >";
   }
   else if (opt=='u')
   {
      searchb(bd);
      buildhidden(numfields);
      for (i=numfields; i < numfields+numtables; i++)
      allele +=   '=&b' +i;

      bd.innerHTML =   divstr +  inputdivstr  + areadivstr + "<form rel=opener name=f method=post target=sql action=" + jsbase +"DataWeb onsubmit=\"return validate()\"  >" +
      str + tailstr + "<input name=n type=hidden value=\"" + param +"\"><br>"
         + "<input name=which type=hidden value=update>"
         + "<input name=rdap value=\"" + rdap +"\" type=hidden>"
         + ( (subdb=='')?'':"<input name=subdb value=\"" + uid1 +"\" type=hidden><input name=cdrdap value=1 type=hidden>")
         + tablehidden
         + "<input type=hidden name=securitytoken value=\"" + securitytoken +"\">"
         + "</form><br><table align=center width=70px ><tr><td  id=holdbutton></td></tr></table>";
      searchb(document.body);
      unifonts(document.body);
      enableedit(false);
      readrd2u(mat);
      var addedsub = document.getElementById('addedsubbutton');
      if (addedsub==null)
          addedsub = document.getElementById('holdbutton');
      addedsub.innerHTML =   "<input   class=button  type=button value=\"" + lblsave +"\" onclick=\"compose(true);if(validate())document.f.submit()\" >";
       
   }
   else if (opt=='s')
   {
      bd.innerHTML =    divstr + "<form rel=opener name=f method=post action=" + jsbase +"DataManager?rdap=" + rdap + subdb  +"&ac=ra   ><table align=left cellspacing=0 cellpadding=3 ><tr><td>" +
      str + tailstr +"</td></tr><tr><td align=center    id=holdbutton></td></tr></table></form><br>" ;
      searchb(bd);
      unifonts(bd);
      enablesearch(numfields);
         var addedsub = document.getElementById('addedsubbutton');
      if (addedsub==null)
          addedsub = document.getElementById('holdbutton');
       
      addedsub.innerHTML =  "<div class=showingsty style=background-color:#EEEEEE;width:350px >" +  lblhint + "<br><input class=bindtext tabindex=" + (numfields + 3) +" name=m size=4 value=1> &le; " + lblorder + " &le; <input  class=bindtext tabindex=" + (numfields + 4) +" name=n size=4 value=160>"
      +"&nbsp;&nbsp;&nbsp;<select onclick=selformat(this) style=font-family:inherit;font-size:" + (unifontsize) + "px name=format  tabindex=" + (numfields + 5) +"><option value=Manger selected>" + lblallstrs[0] + "</option><option value=CSV>" + lblallstrs[1] + "</option><option value=HTML>" + lblallstrs[2] + "</option></select>"
      + "<input type=hidden name=securitytoken value=\"" + securitytoken +"\"><input   class=button   style=font-family:inherit   type=button value=\"" + lblsearch + "\" onclick=\"nozero();document.f.submit()\" ></div>"
     addedsub = addedsub.parentNode.parentNode.parentNode; 
     var leftf = parseInt(addedsub.style.left.replace(/px/,'')) - 200;
     if (leftf < 0) leftf = 0;
     if (addedsub.style.position == 'absolute')
     addedsub.style.left = leftf + 'px';
   }
   else if (opt=='d')
   {
      searchb(bd);
      buildhidden(numfields);
      tellisheading(); 
      for (i=numfields; i < numfields+numtables; i++)
      allele +=   '=&b' +i;
      allele += "=";
      
      bd.innerHTML = divstr +   "<br><form rel=opener name=f method=post action=\"" + jsbase +"DataWeb?rdap=" + rdap +   subdb  +"&n=" + param +"&which=delete" + allele.substring(1)  +"\" onsubmit=\"return validate()\"   >"
      + lblorder +": " + param
      + "<input name=submit class=button   type=submit value=\"" + lbldelete + "\" onclick=delet1()>"
      + "<input type=hidden name=securitytoken value=" + securitytoken +"></form>";
       
      unifonts(bd);
   }
   else if (opt=='r')
   {
      
      searchb(bd);
      
      buildhidden(numfields);
      tellisheading();

      if (param=='')
      {
           if (typeof (gradientbg) == 'undefined')
               gradientbg = " ";
           bd.innerHTML = divstr +   "<center><table   cellspacing=0 cellpadding=0   align=center ><tr><td valign=middle align=center style=\"background:" + gradientbg + ";border:1px outset\"><table width=100%  ><tr><td><div onclick=close() style=\"background:radial-gradient(farthest-side at 70% 65%,#82B097,#01170B);width:36px;height:36px;border-radius:18px;alignment:center;vertical-align:middle;line-height:36px\"><table cellspacing=0 width=24 align=center><tbody><tr height=6><td colspan=7></td></tr><tr height=10><td colspan=7><div style=\"width:0px;height:0px;border-left:12px solid transparent;border-bottom:10px #fff solid;border-right:12px solid transparent;\"></div></td></tr><tr height=3><td width=3 rowspan=2></td><td width=5 style=\"background-color:#ffffff\" rowspan=2></td><td width=5 rowspan=2></td><td width=4 style=\"background-color:#ffffff\" rowspan=2></td><td width=5></td><td width=4 style=\"background-color:#ffffff\" rowspan=2></td><td width=3 rowspan=2></td></tr><tr height=5><td style=\"background-color:#ffffff\" width=5></td></tr><tr height=12><td colspan=7></td></tr></tbody></table></div></td><td  align=center><div class=forcurve1 style=\"color:#DDCC11;margin:5px 0px 5px 0px;text-alignment:center;border:0px red solid\" id=titlediv><font  size=+2><b><NOBR><center>" + rdap +" " + lblman + "</center></NOBR></b></font></div></td></tr></table></td></tr>"
          + "<tr><td><form rel=opener name=f method=post action=\"" + jsbase +"DataWeb\" onsubmit=\"return validate()\"  >"
          + "<table style=\"background:linear-gradient(#dddddd,#Cccccc);border-radius:4px;border:1px #b0b0b0 outset;box-shadow:#aaaaaa 2px 2px;margin:6px 0px 0px 0px\" cellspacing=1px cellpadding=4px >"
          + "<tr><td><a href=DataManager?rdap=" + rdap + subdb + "&ac=rall>" + lblallstr[0] +"</a></td></tr>"
          + "<tr><td><a href=DataManager?rdap=" + rdap + subdb + "&ac=ral>" +  lblallstr[1] +"</a></td></tr>"
          + "<tr><td><a href=DataCSV?rdap=" + rdap + subdb + "&ac=csv&m=1>" +  lblallstr[2] +"</a></td></tr>"
          + "<tr><td><a href=DataHTML?rdap=" + rdap + subdb + "&ac=html&m=1>" +lblallstr[3] +"</a></td></tr>"
          + "<tr><td>&nbsp;</td></tr>"
          + "<tr><td><a href=Form?rdap=" + rdap + subdb + "&ac=s>" + lblsearch +"</a></td></tr>"
          + "<tr><td>&nbsp;</td></tr>"
          + "<tr><td align=center>" + lblorder + "<input class=bindtext name=n size=4><input name=m type=hidden size=4></td></tr>"
          + "<tr><td align=center ><input name=submit1 class=button    type=button value=\"" + lblreview +"\" onclick=view()>"
          + "<input name=submit2 class=button style=\"background-color:orange;\" type=button value=\"" + lblupdate +"\" onclick=update()>"
          + "<input name=submit3 class=button  style=\"background-color:red\"  type=submit value=\"" + lbldelete +"\" onclick=delet()></td></tr>"
          + "</table>"
          + "<input name=which type=hidden value=delete>"
          + "<input name=rdap value=" + rdap +" type=hidden>"
          + ((subdb=='')?"":"<input name=cdrdap value=1 type=hidden><input name=subdb value=" + uid1 +" type=hidden>")
          + "<input type=hidden name=securitytoken value=\"" + securitytoken +"\">"
          + "</form></td></tr></table></center><scri" + "pt   id=\"jsele\"></scr" + "ipt>"
         ;
          var jsele = document.getElementById("jsele");
          jsele.src = "curve.js";
         // parent.frames[0].resizebut(document.f);
          document.f.submit1.style.cssText ="color:white;background:url(image/GreenButton.gif);font-size:" + (font_size ) +'px;font-weight:700;';
          document.f.submit2.style.cssText ="color:white;background:url(image/OrangeButton.gif);font-size:" + (font_size) +'px;font-weight:700';
          document.f.submit3.style.cssText ="color:white;background:url(image/RedButton.gif);font-size:" + (font_size) +'px;font-weight:700';
      }
      
      else
      {
         if (typeof mat != 'undefined')
         readrd(mat);
      }
      unifonts(bd);
   }
 
   }

   function selformat(sel)
   {
       if (sel.selectedIndex == 0)
       {
           formnewaction(document.f, jsbase +"DataManager?rdap=" + rdap + subdb  +"&ac=ra");
           
       }
       else if (sel.selectedIndex == 1)
       {
           formnewaction(document.f, jsbase +"DataCSV?rdap=" + rdap + subdb )  ;
           
       }
       else if (sel.selectedIndex == 2)
       {
           formnewaction(document.f, jsbase +"DataHTML?rdap=" + rdap + subdb) ;
       } 
   }
   function GetCookie(xx)
   {
      return null;
   }
   var valid = true;
   function validate(){return valid;}
   function view()
   {
      valid = false;
      if (document.f.n.value=='')
      {
         alert(lblenterone);
         document.f.n.focus();
      }
      else
      {
        var xx =  document.location.toString().replace(/Form\?/,"DataManager?").replace(/ac=r/,'ac=r' + document.f.n.value);
        
        document.location.href = xx;
      }
   }
   function update()
   {
      valid = true;
      if (document.f.n.value=='')
      {
         valid = false;
         alert(lblenterone);
         document.f.n.focus();
      }
      else
      {
         var x1 = document.location.toString().replace(/Form\?/,"DataManager?").replace(/ac=r/,'ac=u' + document.f.n.value);
         
         document.location.href = x1;
      }
   }
   function delet1()
   {
      if (confirm(lblreally + " " + param +"?"))
         godelet1(true);
   }
   function godelet1(v)
   {
      valid = v;
      if (v)openwin();
   }
   function delet()
   {

      valid = true;
      if (document.f.n.value=='')
      {
         alert(lblenterone);
         document.f.n.focus();
         valid = false;
      }
      else if (parseInt(document.f.n.value) <= 0)
      {
         alert(lblenterone + " > 0");
         document.f.n.focus();
         valid = false;
      }
      else if (confirm(lblreally + ' ' + document.f.n.value + '?'))
      {
         formnewaction(document.f,  jsbase +"DataWeb");
         document.f.rdap.value=rdap;
         document.f.which.value="delete";
          
         valid = true;
      }
      else
         valid = false;
   }
   function set(j)
   {
      eval("document.f.c" + j +".disabled=false;document.f.c" + j +".value=document.f.h" + j +".checked?'1':'0';");

   }

   function makespan(str)
   {
      var txtn = document.createElement("table");
      txtn.cellspacing="0";
      txtn.cellpadding="0";
      var r=txtn.insertRow(0);
      var y = r.insertCell(0);
      var sp = document.createElement("div");
      sp.className="bindlabel";
    
      sp.innerHTML =   str  ;
      y.appendChild(sp);
      return txtn;
   }
   function txt2html(str)
   {
      if (str==null) return "";
      return str.replace(/</g, "&lt;").replace(/>/g,"&gt;").replace(/\n/g, "<br>");
   }

   function readrd(mat)
   {
 
      var numCols = 0;
      var numRows = 0;
      if (mat!=null && (numRows=mat.length) > 0)
         numCols = mat[0].length;
      else
      {
         bd.innerHTML = lblnorecord + mat.length;

         return;
      }

      str = "";
      var v = new Array(numCols);


      if (param =='all')
      {
         var base = ("" + document.location);
         var xx = "<center>" + lblorder +": ";
         for (i=0; i < numRows; i++)
            xx +=  " <a href=" + base.replace(/ac=ral*/,"ac=r" + mat[i][0]) + ">" +   mat[i][0] + "</a> ";
         str += xx +"</center><br>";
         for ( j=0; j < numCols; j++)
         {
            v[j] = '';
            for ( i=0; i < numRows; i++)
            {
               v[j] += "<!--__--><div class=bindlabel>" +  mat[i][0].replace(/<[^>]+>/g,'')  +"</div>";
               v[j] += "<div class=showingsty>" + ((mat[i][j]=='')?"&nbsp;":txt2html(mat[i][j])) +"</div>";
            }
         }

      }
      var mapc2v = new Array();
      var sel = '';
      var oldlen = 0;
      for (i=0; i < numRows; i++)
      {
         if (param!='all')
            str += "<!--__--><div class=bindlabel>" + mat[i][0].replace(/<[^>]+>/g,'') +"</div><br>";
         j=1;k=0;
         var isa = false;
         var isf = false;
         while (k < endtxtn)
         {
            var m = us.exec(txt.substring(k));

            if (m==null) break;
            len = ("" + m).length;
            var from =  k;
            if(isa)from++;
            isa = (len>2 && txt.charAt(k+m.index-1)=='['&& txt.charAt(k+len+m.index)==']');
            isf = (len>2 && txt.charAt(k+m.index-1)=='@'&& txt.charAt(k+len+m.index)=='@');
            var to = k+m.index;
            if (isa || isf)to--;
            var bet = txt.substring(from, to).replace(/^<.span>/,'').replace(/<span[^>]*>$/,'');
            var ans = scanopts('r', bet,  '', 1, true, mapc2v);
            
            if (isf) ans[5] = ans[5].replace(/^@/,'');
            len = ("" + m).length;
            if (ans[3] !='')
            {
                sel = ans[3];
            }
            else
            {
               if (oldlen!=len)
               {
                   sel = '';
               }
            }
            oldlen = len;
            
            str += ans[5];
            
            if (param!='all')
            {
               if (sel == '')
                  v[j] = txt2html(mat[i][j]);
               else
               { 
                  var ww = '';
                   
                  if (mat[i][j]!=null && mat[i][j]!='') 
                  { 
                  try{    
                      ww = mapc2v['|'+ mat[i][j].replace(/^[ ]+/,'').replace(/[ ]+$/,'') +'|']; 
                  }catch(e){}
                  }
                  if (ww==null) ww = '';
                  if (mat[i][j]!=null && mat[i][j]!='') 
                      v[j] =  ww + "(" + mat[i][j] + ")";
                  else
                      v[j] = '';
               }
            }
             
            if (v[j]==null)v[j] = '';
            for (var ki=v[j].length; ki < len; ki++)
                v[j] += "&nbsp;";
            if (isf == false) 
                str += "<div class=showingsty>" + v[j] +"</div>";
            else  
                str += "<div class=showingsty>" + makefilestr(v[j]) + "</div>";
             
            k += m.index + len;
            j++;
         }
         if(isa||isf) k = k+1;
         str += txt.substring(k);
         if (param=='all'){break;}
         else str+='<br>';
      }
      numfields = j;
      bd.innerHTML =  divstr + str;
      searchb(bd);
      tellisheading();
      var i;
 
      if (param!='all')
      {
         for (i=0; i < numRows; i++)
         for (j=numfields; j < numCols; j++)
         {
            var k = i*(numCols-numfields) + (j-numfields);
            source = mat[i][j];
            fill(k,false);
         }
      }
      else
      {
         for (j=numfields; j < numCols; j++)
         {
            var txtn =  makespan(mat[0][0]);
            tablelist[j-numfields].parentNode.insertBefore(txtn,tablelist[j-numfields]);

           for (i=1; i < numRows; i++)
           {
             var tb = tablelist[j-numfields].cloneNode(true);
             txtn = makespan(mat[numRows-i][0]);
             insertAfter(tablelist[j-numfields], txtn);
             insertAfter(txtn, tb);
           }
         }
         searchb(bd);
         tellisheading();
         for (j=numfields; j < numCols; j++)
         for (i=0; i < numRows; i++)
         {
              k = i + (j-numfields)*numRows;
              source = mat[i][j];
              
              fill(k,false);
         }
      }
      transplant();
   }
   function insertAfter( referenceNode, newNode )
   {
      referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
   }
   var matptr = null;
   function show(mat)
   {
     /* var para = prompt("1. " + lblall + "\n2. " + lblalls,"1");
      if (para=='1'){param = 'all';readrd(mat);}
      else if (para=='2'){param = 'al';readrd(mat);}
     */
     var newdiv = document.createElement('div');
     newdiv.setAttribute('id', "showm");
     newdiv.style.zIndex = 100;
     newdiv.style.width = 300;
     newdiv.style.height = 200;
     newdiv.style.position = "absolute";
     newdiv.style.left = 300;
     newdiv.style.top = 200;
     newdiv.style.background = "lightyellow";
     newdiv.style.border = "1px purple outset";
     newdiv.style.padding = "5px 5px 5px 5px";
     newdiv.innerHTML = "<table>" +
        "<tr><td><input type=radio value=l name=n onclick=\"showm('all')\">1. " + lblall +
        "</td></tr><tr><td><input type=radio value=al name=n onclick=\"showm('al')\">2. " + lblalls +
        "</td></tr></table>";
     document.body.appendChild(newdiv);
     matptr = mat;
   }
   function showm(ch)
   {
      param = ch;
      document.getElementById("showm").hide();
      readrd(matptr);
   }
   function readrd2u(mat)
   {
      var f = document.f;
       
      var numCols = 0;
      var numRows = 0;
      if (mat!=null && (numRows=mat.length) > 0)
         numCols = mat[0].length;
      else
      {
         bd.innerHTML = lblnorecord;
         return;
      }
     var k = 0;

      for (var j=1; j <  numfields; j++)
      {
        
         var tt = formelementbyname(f,"h" + j);
         if (tt!=null)
         {

            if (tt.tagName.toLowerCase()=='input' && tt.type.toLowerCase()=='checkbox')
            {
              tt.value = ( mat[0][j]==''||mat[0][j]=='0')?'0':'1';
              tt.checked = (mat[0][j]!='' && mat[0][j]!='0');
            }
            else
            {
               tt.value = mat[0][j];
            }

         }
         tt = formelementbyname(f,"c" + j);
         if (tt!=null)
         {
           tt.value = mat[0][j];
           formelementbyname(f,"h" + j).checked = (tt.value!='');
           continue;
         }
         tt = formelementbyname(f,"s" + j);
         if (tt!=null && typeof(tt.options)!='undefined')
         {
            k  = tt.options.length;
            var kk=k-1;
            for (; kk >=0 && tt.options[kk].value!=mat[0][j]; kk--);
            if (kk>=0)
               tt.selectedIndex = kk;
            else
            {
               tt.options[k] = new Option(mat[0][j], mat[0][j]);
               tt.selectedIndex = tt.options[k];
            }
            continue;
         }
         tt = formelementbyname(f,"a" + j);
         if (tt!=null)
         {
            if (mat[0][j]==null) continue;
            tt.value = mat[0][j];
            var rowlen = 0,chari=0;
            for (; chari < mat[0][j].length; chari++)
               if (mat[0][j].charAt(chari)=='\n') rowlen++;
            if (rowlen>4) tt.rows = rowlen + 1;
            continue;
         }
         tt = formelementbyname(f,"t" + j);
         if (tt!=null)
         {
            tt.value = mat[0][j];continue;
         }
         tt = formelementbyname(f,"f" + j);
         if (tt!=null)
         {
            tt.value = mat[0][j];continue;
         }
         tt = formelementbyname(f,"r" + j);
         if (tt!=null)
         {
            for (k = tt.length-1;  k >=0 && tt[k].value!=mat[0][j]; k--);
            if (k>=0)
               tt[k].checked = true;
            continue;
         }
      }
      

      for (k=0; k < numtables; k++)
      {
         source = mat[0][numfields+k];
         fill(k,true);
      }
       

   }


   function nozero()
   {
    
      for (var j=1; j <  numfields; j++)
      {
         var tt = formelementbyname(document.f,"h" + j);
         if (tt!=null)
         {
             if (tt.tagName.toLowerCase()=='input' && tt.type.toLowerCase()=='checkbox')
                 tt.disabled = true;
             
         }
      }
      valid = true;
      if (document.f.n.value.replace(/ /g,'')=='')
          document.f.n.value='160';
      if (document.f.m.value.replace(/ /g,'')=='')
          document.f.m.value='1';

   }
 // document.write("<div id=anchor style=\"position:absolute;border:0px;margin:0px 0px 0px 0px;width:1px;height:1px;left:0px;top:0px;background-color:transparent\"><input type=button style=\"border:0px;margin:0px 0px 0px 0px;width:1px;height:1px;background-color:transparent\" onfocus=passf() tabindex=" + (numfields + 2) +" nmae=passf1></div>");
 // var anchor = document.getElementById("anchor");

  var mv = null;
  var mtxt = null;
  var mm=null, mi=-1, mj=-1;
  var nextdiv = null;
  var nextm = 0, nexti=-1, nextj=-1;
  function readvalue()
  {
     if (mm==null || mi==-1 || mj==-1) return;
     var m = mm, i=mi, j=mj;
     var vl = mtxt.value;
     var pn = tablelist[m].rows[i].cells[j];
     if (pn==null)
     {
        return;
     }
     pn.innerHTML = settext(vl);


     var n = tablelist[m];

     var len = n.rows[i].cells.length;
     if (i + 1 == n.rows.length)
     {
        var needone = false;
        for (var k=0; k < len; k++)
        if (gettext(n.rows[i].cells[k])!='')
        {
           needone = true;
           break;
        }
        if (needone)
        {
           var row = appendRow(n,m,true);
        }
     }
     

  }
  function positionning( oElement, win)
{
  if (win==null) win = window;
  if (oElement==null) return [0,0];
  if( typeof( oElement.offsetParent ) != 'undefined' )
  {
    var originalElement = oElement;
    for( var  posY = 0,posX=0; oElement; oElement = oElement.offsetParent )
    {
      posY += oElement.offsetTop;
      posX += oElement.offsetLeft;
      if( oElement != originalElement && oElement != win.document.body && oElement != win.document.documentElement )
      {
          posY -= oElement.scrollTop;
          posX -= oElement.scrollLeft;
      }
    }
    return  [posX, posY];
  }
  else
  {
    return  [oElement.x, oElement.y];
  }
}
  var usearea = false;




  function testsub()
  {
     if (typeof filename == 'undefined')
        document.f.action = jsbase +"Echo";
     else
        document.f.action = "Echo";

     compose(false);
     
     if (opt=='m')
     {
        document.f1.defaultav.value = defaultav;
         
     }
     else
     {
       if (parent!=self && typeof(parent.parent.frames[0].get)!='undefined')
         parent.parent.frames[0].getdv(defaultav);
     }
  }

  function compose(forceSelect)
  {
     readvalue();
     valid = true;
     var k=0,  state = 0;
     defaultav = '';
     for (k=0; k < document.f.elements.length; k++)
     {
        var elet = document.f.elements[k].tagName.toUpperCase();
        if (document.f.elements[k].name == 'securitytoken') continue;
        if (elet == 'SELECT')
           defaultav += document.f.elements[k].name + "=" + document.f.elements[k].options[document.f.elements[k].selectedIndex].value + "\n";
        else if (elet == 'INPUT' && document.f.elements[k].type.toUpperCase() == 'CHECKBOX')
        {

            defaultav += document.f.elements[k].name.replace(/h/,'c') + "=" + (document.f.elements[k].checked?'1':'0') + "\n";
            if (document.f.elements[k].checked == false)
            {
                eval("document.f." + document.f.elements[k].name.replace(/h/,'c') + ".value = '0'");
            }
        }
        else if (elet == 'INPUT' && document.f.elements[k].type.toUpperCase() == 'RADIO')
        {
            if (document.f.elements[k].checked)
            defaultav += document.f.elements[k].name + "=" + document.f.elements[k].value +"\n";
        }
        else if (document.f.elements[k].value!='' && document.f.elements[k].name!='submit')
           defaultav += document.f.elements[k].name + "=" + document.f.elements[k].value +"\n";
        
     }
     for (k=0; k < document.f.elements.length; k++)
     {
        if (document.f.elements[k].name.match(/r[0-9]+/)!=null)
        {
            if (state == 0)state=1;
            if (document.f.elements[k].checked){state=2;}
        }
        else if (state==1)
        {
           break;
        }
        else
           state = 0;
     }
     if (forceSelect && state == 1)
     {
         document.f.elements[k-1].focus();
         valid = false;
         return;
     }
     for (k=0; k < numtables; k++)
     {
        var vl = retrvtablevalue(tablelist[k]);
        formselementbyname(f,'b'+(numfields+k)).value = vl;
        defaultav += 'b'+(numfields+k) + "=" + vl.replace(/\n/g, ' ') +"\n";
        
     }
     if (opt!='m' && opt!='')
     {
        openwin();
        document.f.target = "tinyerr";
     }
  }


var pointer = null;
var  sm,sj;
function swapp(i,j)
{
    var T = pointer[i];
    pointer[i] = pointer[j];
    pointer[j] = T;
}
function compare(u,v )
{
          var an = 0;
          var matu = gettext1(tablelist[sm].rows[u].cells[sj]);
          var matv = gettext1(tablelist[sm].rows[v].cells[sj]);

          var natu = parseFloat(matu);
          var natv = parseFloat(matv);

          if ( "" + natu != 'NaN' && "" + natv!= 'NaN')
          {
             if ( natu < natv )
                an = -1 ;
             else if ( natu > natv )
                an = 1 ;
             else
                 return u - v;
          }
         else
         {
          if ( matu < matv )
               an = -1;
          else if ( matu > matv )
               an = 1;
          else
                return u - v;
          }
          return an;
       }

var swapcount = 0;
function QuickSort(l, r )
{
          if (l >= r) return;
          var t = l;
          var w= r;
          r++;l--;
          do
          {
              do {l++;} while (l < w && compare( pointer[l], pointer[t]) <= 0);
              do {r--;} while (r > 0 && compare( pointer[r], pointer[t]) > 0 );
              if( l < r && compare( pointer[r], pointer[l]) != 0) swapp(r, l);
          }while ( l < r);

          if( compare( pointer[r], pointer[t]) != 0)swapp(t,r);
          swapcount++;
          QuickSort(t, r-1 );
          QuickSort(r+1, w );
}

//function  qsort(){QuickSort(0,  numRows-1 );}

function exsort(l,r)
{
   var jj = l,front;
   while (jj < r)
   {
      front = jj;
      var matu, matv;
      do
      {
         matu = gettext1(tablelist[sm].rows[jj].cells[sj]);
         matv = gettext1(tablelist[sm].rows[jj+1].cells[sj]);
         jj++;
      }
      while (matu == matv && jj < r);

      if (jj-front == 1) continue;
      var arr = new Array(jj-front);
      for (var kk=0; kk < jj-front; kk++)
         arr[kk] = pointer[front + kk];
      arr.sort();
      for (kk=0; kk < jj-front; kk++)
         pointer[front + kk] = arr[kk];
   }
}


function sort(m,j)
{
   var numRows = tablelist[m].rows.length;
   while (numRows >= 1)
   {
      for (k=0; k < tablelist[m].rows[numRows-1].cells.length; k++)
         if (gettext(tablelist[m].rows[numRows-1].cells[k])!='')
            break;
      if (k == tablelist[m].rows[numRows-1].cells.length)
         numRows--;
      else break;
   }
   sm = m;
   pointer = new Array(numRows);
   document.body.style.cursor = 'wait';
   if (j==sj)
   {
      for (var i = 0; i <  numRows ; i++)
        pointer[i] = numRows-1-i;
   }
   else
   {
     sj = j;
     for (i = 0; i <  numRows ; i++)
        pointer[i] = i;
     QuickSort(1, numRows-1);
   }
   var b = new Array( numRows );
   for (var c = 0; c < tablelist[m].rows[0].cells.length; c++)
   {
        for (i = 1; i <  numRows ; i++)
           b[i]  =  tablelist[m].rows[i].cells[c].innerHTML;
        for (i = 1; i <  numRows ; i++)
        {
            tablelist[m].rows[i].cells[c].innerHTML  =   b[pointer[i]];
        }
   }
   document.body.style.cursor = 'default';
}


function toarea(ta,evt)
{
  return true;
var dv = tablelist[mm].rows[mi].cells[mj];
var e = evt? evt : window.event;
if(!e) return true;
var key = 0;
if (e.keyCode) {key = e.keyCode;} // for moz/fb, if keyCode==0 use 'which'
else if (typeof(e.which)!= 'undefined') {key = e.which;}
if (key == 13)
{
   var hold = mtxt.value;
   dv.innerHTML="<br>";
  // mtxt.onblur=null;
   editcell(dv, mm, mi, mj);
   mtxt.value = hold + "\n";
   return false;
}
return true;
}
var numlines = 0;
function bigger(ta,evt)
{
    var e = evt? evt : window.event;
    if(!e) return true;
    var key = 0;
    if (e.keyCode) {key = e.keyCode;} // for moz/fb, if keyCode==0 use 'which'
    else if (typeof(e.which)!= 'undefined') {key = e.which;}
    if (key == 13)
    {
       numlines++;
       if (numlines >= 4)
          ta.rows = numlines+1;
    }

    return true;
}

function bigger1(ta,evt)
{

    var e = evt? evt : window.event;
    if(!e) return true;
    var key = 0;
    if (e.keyCode) {key = e.keyCode;} // for moz/fb, if keyCode==0 use 'which'
    else if (typeof(e.which)!= 'undefined') {key = e.which;}
    if (key == 13)
    {
       numlines++;
       var ts = 17;
       if (unifontsize!='inherit') ts = parseInt(unifontsize.replace(/px/,''));
       mtxt.rows = numlines +1;
       mtxt.style.height = (numlines+1)*(unifontsize+6);
       var dv = tablelist[mm].rows[mi].cells[mj];
       dv.parentNode.height = mtxt.offsetHeight + "px";
       mv.style.height = mtxt.offsetHeight + "px";
       mtxt.focus();
    }

    return true;
}
var prevdiv = null;
function passf()
{
      readvalue();
      if (nextm < numtables)
      {
         if (nexti>=0 && nextj>=0)
         {
             nextdiv = tablelist[nextm].rows[nexti].cells[nextj];
             editcell(nextdiv, nextm, nexti, nextj);
         }
      }
      else
      {
         mm = null;
         mv.style.visibility = 'hidden';
         if (tablelist[nextm-1].nextSibling!=null)
             tablelist[nextm-1].nextSibling.focus();
      }
}
function countline(ta)
{
   numlines = 0;
   if (ta.value!=null)
   for (var k=0; k < ta.value.length; k++)
      if (ta.value.charAt(k)=='\n')
         numlines++;
}
var skiparr = null;

function editcell1()
{
   readvalue();
   var n = this.parentNode.parentNode;
   if (n.nodeName.toLowerCase()!='table') n = n.parentNode;
   var m=0;for(;m<numtables;m++) if (n==tablelist[m])break;
   if (m==numtables) return;
   var i = this.parentNode.rowIndex;
   var j = this.cellIndex;

   if (m==mm)
   {
      if (mi==i)
      {
         if (j>mj)
           for (k=mj+1; k < j; k++) skiparr[k] = true;
         else
         {
           for (k=j; k < tablelist[m].rows[i].cells.length; k++)
               skiparr[k] = false;
         }
      }
      else
         for (k=0; k < tablelist[m].rows[i].cells.length; k++)
            skiparr[k] = (i>=mi && (k<j && k > mj));
   }
   else
   {
      skiparr = new Array(tablelist[m].rows[i].cells.length);
      for (var k=0; k < skiparr.length; k++) 
          skiparr[k] = false;
   }
   editcell(this, m, i, j);
   
}
function nextcell(dv,m,i,j)
{
     nextj = j+1;
     var n = tablelist[m];
     var len = n.rows[i].cells.length;
     while (nextj < len && skiparr[nextj]!=null && skiparr[nextj]) nextj++;
     if (nextj < len)
     {
         nextm = m;
         nexti = i;
     }
     else if (i < n.rows.length-1)
     {
        nextm = m;
        nexti = i+1;
        nextj = 0;
        while (nextj < len && skiparr[nextj]!=null && skiparr[nextj]) nextj++;
     }
     else
     {
        nextm = m+1;
        nexti = 0;
        nextj = 0;
     }
     
}
function editcell(dv, m, i, j)
  {
     if (isheading[m]&&i==0)
     {
        sort(m,j);
        return;
     }
     mm = m;
     mi = i;
     mj = j;
     
     var x = dimen(dv)[0]-2;
     var y = dimen(dv)[1]-2;
     var cols = x/slen;
     var vl = gettext1(dv);

     if (y < 50 && vl.indexOf("\n")<0)
     {
        mv = document.getElementById("inputdiv");
        mtxt = document.getElementById("inputtext");
       // mtxt.onblur = readvalue;
     }
     else
     {
        if (y < 50)
        {
            y = 50;
            dv.parentNode.height = y + "px";
        }
        mv   = document.getElementById("areadiv");
        mtxt = document.getElementById("areatext");
     }


     var xy = positionning(dv);
     mv.style.top   = (xy[1] ) + "px";
     mv.style.left  = (xy[0] ) + "px";
     mv.style.width = (x+1) + "px";
     mv.style.height = (y+1) + "px";
     mv.style.borderWidth = 0;
     mv.style.zIndex = 101;
     if (prevdiv!=mv )
     {
        if (prevdiv!=null)
           prevdiv.style.visibility = "hidden";
     }
     mv.style.visibility = "visible";
     mtxt.style.width = (x+1) + "px";
     mtxt.style.height = (y+1) + "px";
     mtxt.value = vl;

     mtxt.focus();
     prevdiv = mv;
     nextcell(dv, m, i, j);
     
  }

  function getInput()
  {
     bd.innerHTML = "<center><form rel=opener name=ff  >" + lblenterone + " > 0: <input name=n>"
         + "<input type=hidden name=securitytoken value=\"" + securitytoken +"\">"
         + "<input type=button style=width:70px;background-color:orange value=Go onclick=\"redo()\"></form></center>";
  }
  var newdiv = null;
  function getInput1()
  {
     var wd  = screen.width;
   var het = screen.height ;
   if (navigator.appName=='Microsoft Internet Explorer')
   {
       wd = document.body.offsetWidth ;
       het= document.body.offsetHeight ;
   }
   else if(navigator.appName=='Netscape')
   {
       wd = self.innerWidth ;
       het= self.innerHeight ;
   }
     newdiv = document.createElement('div');
     newdiv.setAttribute('id', "showm");
     newdiv.style.zIndex = 100;
     newdiv.style.width = 300;
     newdiv.style.height = 150;
     newdiv.style.position = "absolute";
     newdiv.style.left = (wd - 300)/2;
     newdiv.style.top = (het - 150)/2;
     newdiv.style.background = "lightyellow";
     newdiv.style.border = "1px purple outset";
     newdiv.style.padding = "5px 5px 5px 5px";
     newdiv.innerHTML = "<form rel=opener name=f  ><table align=center>" +
        "<tr><td><input type=radio value=l name=n onclick=redor('all') >1. " + lblall +
        "</td></tr><tr><td><input type=radio value=al name=n  onclick=redor('al')  >2. " + lblalls +
        "</td></tr></table>"
        + "<input type=hidden name=securitytoken value=\"" + securitytoken +"\">"
        +"</form>";
     document.body.appendChild(newdiv);

  }
  function redor(ch)
  {
      param = ch;
      bd.removeChild(newdiv);
      optstr = "r" + ch;
      parse();
      readrd(mat);
  }
  function redo(bn)
  {
     document.location.href = "" + document.location + document.ff.n.value;
  }
   
  function formelementbyname(f,nm)
  {
     if (f==null) return null;
     var j = 0;
    for (; j < f.elements.length; j++)
    {
      if (f.elements[j].name == nm) break;
    }
     if (nm.charAt(0)=='r')
     {
        var xx = new Array();
        var i = j;
        for (var k=0; j < f.elements.length && f.elements[i+k].name == nm; k++,j++)
           xx[k] = f.elements[i+k];
        return xx;
     }
     return f.elements[j];
  }
  function reprint()
  {
     var f = document.f;
    
     var mat = new Array(1);
     mat[0] = new Array(numfields + numtables);
     var k = 0;

      for (var j=1; j <  numfields; j++)
      {
         var tt = formelementbyname(f,"h" + j);
         if (tt!=null)
         {
            if (tt.tagName.toLowerCase()=='input' && tt.type=='checkbox')
            {
               mat[0][j]= tt.checked?'1':'0';
               continue;
            }
            else
            {
               mat[0][j]= tt.value;
            }
         }
         tt = formelementbyname(f,"c" + j);
         if (tt!=null)
         {
           mat[0][j] = tt.value;
           continue;
         }
         tt = formelementbyname(f,"s" + j);
         if (tt!=null)
         {
            mat[0][j] = tt.options[tt.selectedIndex].value;
            continue;
         }

         tt = formelementbyname(f,"a" + j);
         if (tt!=null)
         {
            mat[0][j] = tt.value;

            continue;
         }
         tt = formelementbyname(f,"t" + j);
         if (tt!=null)
         {
            mat[0][j]=tt.value;continue;
         }
         tt = formelementbyname(f,"f" + j);
         if (tt!=null)
         {
            mat[0][j]=tt.value;continue;
         }
         tt = formelementbyname(f,"r" + j);
         if (tt!=null)
         {
            for (k = tt.length-1;  k >=0 && tt[k].checked ==false; k--);
            if (k>=0)
               mat[0][j] = tt[k].value;
            continue;
         }
      }


      for (k=0; k < numtables; k++)
      {
         mat[0][numfields+k] = retrvtablevalue(tablelist[k]);
      }
      //document.f.submit.value = "Print";
      //document.f.submit.onclick = "window.print()";
      if (opt!='')
      {
         mat[0][0] = document.f.n.value;
      }
      else
      {
         mat[0][0] = 'New Record';
         param = '1';
      }
      opt = 'r';

      readrd(mat);
  }
  function makefilestr(x)
  {
      var xs = x.replace(/,$/,'').split(/,/);
      x = '';
      for (var i=0; i < xs.length; i++)
      {
          var ys = xs[i].split(/@/);
          x += "<a href=\"FileOperation?did=" +  ys[2] + "\" target=_blank >" + ys[0]  + '</a>&nbsp;&nbsp;'
      }
      return x;
  }
  function makedelfilestr(x)
  {
      var xs = x.replace(/,$/,'').split(/,/);
      x = '';
      for (var i=0; i < xs.length; i++)
      {
          var ys = xs[i].split(/@/);
          x += "<a href=\"javascript:asynsend('UploadChangePic?pathcode=" + ys[2] + "&tcode=" + ys[1] + "')\" ><font color=red>" + ys[0]  + '</font></a>&nbsp;&nbsp;'
      }
      return x;
  }
  
  function syn(x,y)
  {

     if (x=='1')
     {
        if (opt=='' || opt=='u')
        {
            reprint();
            
        }
        return 1;
     }
     else if (x.indexOf('web/') == 0)
     {
         x = '@'+ x.substring(4);
         
         eval("document.f.f" + filej + ".value = document.f.f" + filej + ".value + y + x + ',';");
         eval("x=document.f.f" + filej + ".value");
         var w = document.getElementById('attachment' + filej);
         w.innerHTML = makefilestr(x);
         var td = w.nextSibling;
         td.innerHTML = td.innerHTML.replace(/deleter/,'deletef').replace(/>[^<]+<.font/i,'>-</font');
     }
     else if (x=='del')
     {
         eval("x=document.f.f" + filej + ".value");
         var j = x.indexOf(y);
         if (j >0)
         {
         var y = x.substring(0,j);
         var z = x.substring(j);
         x = y.replace(/[^,]+$/,'') + z.replace(/[^,]+,/,'');
         eval("document.f.f" + filej + ".value=x");
         var w = document.getElementById('attachment' + filej);
         w.innerHTML = makefilestr(x);
         var td = w.nextSibling;
         td.innerHTML = td.innerHTML.replace(/deleter/,'deletef').replace(/>[^<]+<.font/i,'>-</font');
         
         }
        
     }
     return 2;
  }

  function maxareawidth()
  {
    if ( typeof(document.f) == 'undefined')
        return;
    var eles = document.f.elements;
    var leng = new Array();
    for (var i=0; i < eles.length; i++)
    {
       if ( eles[i].tagName.toLowerCase() =='textarea')
       {
          leng[i] = (eles[i].parentNode.offsetWidth - 2) + 'px';
       }
    }
    for (i=0; i < eles.length; i++)
    {
       if ( eles[i].tagName.toLowerCase() =='textarea')
       {
          eles[i].style.width = leng[i];
       }
    }
  }
  function setdefaultv()
  {  
     if (typeof(defaultorinitv)=='undefined' || defaultorinitv =='')
        return;
 
        mat = new Array(1);
      
        mat[0] = new Array( numfields + numtables );
        var fieldnames = new Array( numfields + numtables );
        var mat00 = defaultorinitv.split(/\n/);
        for (var i=0; i < mat00.length; i++)
        {
           var xx = mat00[i].split(/=/);
           if (xx.length < 2) continue;
           xx[0] = trim(xx[0]);
           
           var jj = parseInt(xx[0].substring(1));
 
           if (  ''+jj != 'NaN')
           {
              mat[0][jj] = xx[1];
              
              fieldnames[jj]= xx[0];
           }
        }
        for (i=1; i < mat[0].length; i++)
        {
            if (mat[0][i]==null)
            {
               mat[0][i] = '';
               fieldnames[i] = 'b' + i;
            }
        }
         
        
        readrd2u(mat);

        if (opt=='m')
        {
           for (var j=numfields; j < numfields + numtables; j++)
           {
              var txtn =  document.createElement("font");
              txtn.setAttribute("color", "red");
              txtn.innerHTML =  "(" + fieldnames[j] +")" ;
              tablelist[j-numfields].parentNode.insertBefore(txtn,tablelist[j-numfields]);
           }
        }

  }
  function setkeepgo(b){keepgoing = b;}
  function giveyou(){return sql;}
  function makeattach(rw)
  {
   
      for (var j=0; j <=  numfields; j++)
      {
         var tt = formelementbyname(document.f,"f" + j);
         if (tt!=null)
         {
             makeattach0(tt,j,rw);
         }    
      }
       
      if (rw.indexOf("w")>=0)
      {
          var dv = document.createElement('div');
          dv.innerHTML = "<input type=file id=filesel  style=width:1px;visibility:hidden name=localpath onchange=doupload(this)>";
          document.body.appendChild(dv);
      }
  }
  var needafile = false;
  function makeattach0(elef,j, rw)
  {
      var xy = positionning(elef);
      var d = document.createElement("div");
      d.style.cssText = "position:absolute;left:" + (xy[0] ) + "px;top:" + (xy[1] )  +"px;z-index:10;background-color:lightyellow;border:1px #CCCC77 outset";
      var s  = "";
      
      if (rw != '')
          s += "<table><tr><td colspan=3>";
      var ts = '17';
      if (unifontsize != 'inherit') 
          ts = parseInt(unifontsize.replace(/px/,''));
      if (rw.indexOf("w") >= 0)
      {
          needafile = true;
          s += "</td><td  style=font-size:" + ts + "px;width:20px;text-align:center><a"
          +  "  href=\"javascript:selupload(" + j + ")\"><font size=" + Math.round(ts*3/17+1) + ">+</font></a>";
      } 
      if (rw.indexOf("r") >= 0)
      {
          s +=  "</td><td id=attachment" + j + ">" + makefilestr(elef.value);
      }
      if (rw.indexOf("w") >= 0)
          s += "</td><td style=font-size:" + ts + "px;width:20px;text-align:center><a "
          +  " href=\"javascript:deletef(" + j + ",document.f.f" + j +");\"><font size=" + Math.round(ts*3/17+1) + ">-</font></a>";
      if (rw != '') s += "</td></tr></table>";
      
      d.innerHTML = s;
     document.body.appendChild(d);
  }
  
  function selupload(j)
  {
      filej = j;
      document.getElementById('filesel').click();
  }
  
  function doupload(fn)
  {
        if (fn.files.length==0) return;
        var xmlhttp;
        if (window.XMLHttpRequest)
        {
            xmlhttp = new XMLHttpRequest();
        }
        else
        {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function()
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            {
                var y = '';
               
                var j = xmlhttp.responseText.indexOf('syn(');
                if (j > 0)
                {
                    var k = xmlhttp.responseText.indexOf(')',j+6);
                    y = xmlhttp.responseText.substring(j,k+1);
                }
                else
                {
                    j = xmlhttp.responseText.indexOf('failupload(');
                    if (j > 0)
                    {
                        k = xmlhttp.responseText.indexOf(');',j+6);
                        y = xmlhttp.responseText.substring(j,k+1).replace(/failupload/,'myprompt');
                    }
                }
                eval(y);
                //document.body.removeChild(document.getElementById('progressbar'));
            }
        } 
       /* var divout = document.createElement('div');
            divout.className =  'progress_outer';
            divout.id = "progressbar";
            divout.innerHTML = "<div id=\"_progress\" class=\"progress\" ></div>";
            document.body.appendChild(divout);
            
       xmlhttp.upload.addEventListener("progress", 
       function(e) 
       {
			var pc = parseInt(100 - (e.loaded / e.total * 100));
            var _progress = document.getElementById('_progress');
			_progress.style.backgroundPosition = pc + "% 0";
	    }, false);
       */  
        var f = new FormData();
        var file = fn.files[0]
        f.append('file', file);
        f.append('rdap', rdap);
        xmlhttp.open('POST', "UploadWfa", true);
        xmlhttp.send(f);
    
  }
   
  
  function deletef(j,v)
  {
      
      var td = document.getElementById('attachment' + j);
      td.innerHTML = makedelfilestr(v.value);
      filej = j;
      td = td.nextSibling;
      td.innerHTML = td.innerHTML.replace(/deletef/,'deleter').replace(/>[^<]+<.font/i,'>@</font');
  }
  
  function deleter(j,v)
  {
     
      var td = document.getElementById('attachment' + j);
      td.innerHTML = makefilestr(v.value);
      filej = j;
      td = td.nextSibling;
      td.innerHTML = td.innerHTML.replace(/deleter/,'deletef').replace(/>[^<]+<.font/i,'>-</font');
  }
  
  
  function deletefile(fn, v)
  {
      v.value = v.value.replace("," + fn + ",", ",").replace("," + fn + "$", "").replace("^" + fn + ",", "");
  }
   
  
  function downloadfile1(fn)
  {
     open("Download?filedir=" + encodeURIComponent(rdap + "/" + fn ));
  }
  
  
  function mkdownloads(x)
  {
     
      x = x.replace(/&nbsp;/g, '');
      var a = '';
      var j = 0;
      while (true) 
      {
          var i = x.indexOf("<div class=showingsty>",j);
          if (i < 0) break;
          a += x.substring(j, i+21);
          j = x.indexOf("</div>", i);

          var y = x.substring(i+21, j).replace(/ /g,'').split(/,/);
 
          for (var i=0; i < y.length; i++)
          {
              a += "<a href=\"javascript:downloadfile1('" + y[i] + "')\" target=_blank>" + y[i] + "</a>&nbsp;";
          }
      }
      
      if (a == '')
      {
          var y = x.replace(/ /g,'').split(/,/);
          for (var i=0; i < y.length; i++)
          {
              a += "<a href=\"javascript:downloadfile1('" + y[i] + "')\" target=_blank>" + y[i] + "</a>&nbsp;";
          }
      }
      else
          a +=   x.substring(j);
      return a;
  }
  
  function centerize(id)
  {
      var f = document.body.childNodes;
      var m = 0, h=0;
      var j = 0, k=0, n=0;
      var idb = document.getElementById(id);
      for (var i=0; i < f.length; i++)
      {
          if (f[i] == idb) continue;
          var xy = findPositionnoScrolling(f[i]);
          
          if (f[i].offsetWidth!=null && typeof(f[i].offsetWidth)!='undefined' && f[i].offsetWidth > m)
          {
              m = f[i].offsetWidth;
              n = xy[0] - 35 + m/2;
              j = i;
          }
          if (f[i].offsetHeight !=null && typeof(f[i].offsetHeight)!='undefined' && [i].offsetHeight + xy[1] > h)
          {
              h = f[i].offsetHeight + xy[1];
              k = i;
          }
      }
      
      idb.style.position = 'absolute';
      idb.style.left = n + 'px';
      idb.style.top = (h+10) + 'px';
  }
  
  function findPositionnoScrolling(oElement, win)
{        
    if (win == null)
        win = self;
    if (oElement == null)
        return [0, 0];
    if (typeof (oElement.offsetParent) != 'undefined')
    {
        var ii = 0;
        var originalElement = oElement;
        for (var posY = 0, posX = 0; ii++ < 20 && oElement != null; oElement = oElement.offsetParent)
        {
            posY += oElement.offsetTop;
            posX += oElement.offsetLeft;
            if (oElement != originalElement && oElement != win.document.body && oElement != win.document.documentElement)
            {
                posY -= oElement.scrollTop;
                posX -= oElement.scrollLeft;
            }
        }
        return  [posX, posY];
    }
    else
    {
        return  [oElement.x, oElement.y];
    }
}
  
  if (opt!='r' || param =='all') parse();

  //if (opt=='' || opt=='u' || opt=='a' ||   opt=='m')  maxareawidth();

  if (opt =='' ||  opt=='m' ||  opt=='v') {setdefaultv(); }
  
  if (opt =='' || opt =='a' || opt =='u' || opt =='v')
  {
     
      makeattach('rw');
  }
  else if(opt == 'r') 
  {
      makeattach('r');
  }
  

  function transplant()
  {
      var basedivs = document.body.getElementsByTagName('div');
      if (basedivs!=null)
      {
          
          for (var i=0; i < basedivs.length; i++) 
          {
              if (basedivs[i].className == 'basediv')
              {
                  var xy = findPositionnoScrolling(basedivs[i]);
                  var divs = basedivs[i].getElementsByTagName('div');
                  for (var j=0; j < divs.length; j++)
                  {
                      if (divs[j].style.position == 'absolute')
                      {
                          var top = xy[1] + parseInt(divs[j].style.top.replace(/px/,''));
                          var left  = xy[0] + parseInt(divs[j].style.left.replace(/px/,''));
                          divs[j].style.left = left + 'px';
                          divs[j].style.top =  top + 'px';
                      }
                  }
              }
          }
      }
  }
  
  
  function asynsend(url)
  {
       
        var xmlhttp;
        if (window.XMLHttpRequest)
        {
            xmlhttp = new XMLHttpRequest();
        }
        else
        {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
 
        xmlhttp.onreadystatechange = function()
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            {
                
                var j = xmlhttp.responseText.indexOf('syn(');
                var k = xmlhttp.responseText.indexOf(')',j+6);
                var y = xmlhttp.responseText.substring(j,k+1);
               
                eval(y);
            }
        }
        
        xmlhttp.open("GET", url, true);
        
        xmlhttp.send();

    } 
    
    
    function submita()
    {
        testsub(); 
        if (validate()==false) return; 
        visual(document.f);
        document.f.submit();
    }
    
    
    function submitt()
    {
        compose(true);
        if (validate()==false) return;
        var xmlhttp;
        if (window.XMLHttpRequest)
        {
            xmlhttp = new XMLHttpRequest();
        }
        else
        {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function()
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            {
                var j = xmlhttp.responseText.indexOf('syn(');
                if (j > 0)
                {
                    var k = xmlhttp.responseText.indexOf(')',j+6);
                    var y = xmlhttp.responseText.substring(j,k+1);
                    y = y.replace(/ss,es/, "'1',null");
                    eval(y);
                }
                else
                {
                    myprompt(xmlhttp.responseText); 
                }
            }
        }
        var  kk = 0;
        if (uid1=='' && (kk = document.location.toString().indexOf('subdb='))>=0)
        {
            uid1 = document.location.toString().substring(kk+6).replace(/&.*/,'');
        }
        if (uid1!='') 
        {
            var ele1 = document.createElement('input'),ele2= document.createElement('input');
            ele1.name = "subdb";
            ele1.type = 'hidden'; ele2.type = 'hidden';
            ele1.value = uid1;
            ele2.name = "cdrdap";
            ele2.value = "1";
            document.f.appendChild(ele1);
            document.f.appendChild(ele2);
        } 
         
        var f = new FormData(document.f);
        xmlhttp.open('POST', document.f.action,true);
        xmlhttp.send(f);
        
   }
   
   function submitm()
   {
       compose(false);
       document.f.defaultav.value = defaultav;
       visual(document.f);
document.f.submit(); 
   }

  

 