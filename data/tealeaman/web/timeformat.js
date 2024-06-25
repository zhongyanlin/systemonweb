/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
 //var timeformat = null;
     
var timeparts = null;
var timepartseparators = null
if (typeof(timeformat) == 'undefined') 
{
    timeformat = 'MM/DD/YYYY hh:mm';
}
function getTimelements(tf)
{
    timeparts = [];
    timepartseparators = [];
    timeformat = tf;
    tf = tf.replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[ ]+/g, ' ');
    var x = [ 'YYYY', 'YY','MMM', 'MM','DD', 'hh', 'mm', 'ss'];
    var j =0;
    var s = new Array(8);
    for (var i=0; i < 8; i++)
        if (i == 3 || i == 6)
            s[i] = tf.indexOf(x[i]);
        else
            s[i] = tf.toUpperCase().indexOf(x[i].toUpperCase());
    if (s[2]>=0) s[3] = -1;
    if (s[0]>=0) s[1] = -1;
    var ss = '';
    for (var i=0; i < 8; i++)
    {
        if (s[i] < 0) 
            x[i] = '99' + x[i];
        else if  (s[i] < 10)
            x[i]  = '0' + s[i] + x[i];
        else 
            x[i] = s[i] + x[i];
        ss += x[i] + ',   ';
    }
     
    ss = '';
    x.sort();
    for (var i=0; i < 8; i++)
    {
        ss += x[i] + ',   ';
        if (x[i].substring(0,2) != '99') 
        { 
            timeparts[timeparts.length] = x[i].substring(2);
        }
    }
    var j = 0, k = 0;
    for (var i= 0; i <= timeparts.length; i++) 
    {
        if (i > 0)
            j = k + timeparts[i-1].length;
        if (i<timeparts.length)
           k = tf.indexOf(timeparts[i],j);
        else
           k = timeformat.length;
        if (j < k)
          timepartseparators[i] = timeformat.substring(j,k);
        else
          timepartseparators[i] = '';
       
    }
}
getTimelements(timeformat); 
 
var monthNames = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
function parseMonth( str)
{
   var j = 0;
   for (; j < 12 && monthNames[j].toLowerCase() != str.toLowerCase(); j++);
   return j+1;
}  

function padd2(m)
{
   var ms = '' + m;
   if (ms.length == 1)
       ms = '0' + ms;
   return ms;
}

function timestr2(lstr)
{
    
   if (lstr == '') return null;
   var l = parseInt(eval(lstr));
   if (''+l == 'NaN')
   {
      return timeformat;
   }
   var timeobj = new Date(l*1000);
   var ll = timeobj.getYear();
   if (ll >= 100 && ll < 200)
   {
   ll += 1900;
   if (timeformat.indexOf("YYY")<0 && ll >=2000 && ll < 2100 )
      ll -= 2000;
   else if (timeformat.indexOf("YYY")>=0 && ll >=1900 && ll < 2000 )
      ll += 100;
   }
   return timeformat.replace(/MMM/, monthNames[timeobj.getMonth()]).replace(/MM/,padd2(timeobj.getMonth()+1)).replace(/DD/,padd2(timeobj.getDate())).replace(/YYYY/, ll).replace(/YY/, padd2(ll)).replace(/hh/,padd2(timeobj.getHours())).replace(/mm/, padd2(timeobj.getMinutes())).replace(/ss/,padd2(timeobj.getSeconds()));
}

function timestr(l, tm)
{
   if (tm!=null && tm!=timeformat) getTimelements(tm);
   if (l == null ) return null;
   var ln = 0;
   if(typeof(l)=='number')
      ln = l;
   else if (isNaN(l)) return null;
   else
      ln = parseInt(l);
   var timeobj = new Date(ln*1000);

   var ll = timeobj.getYear(); 
   
   if (timeformat.indexOf("YYY") < 0)
   {
      ll+=1900;
      if (ll >= 2000 && ll < 2100)
         ll -= 2000;
   }
   else
   {
      ll += 1900;
   }
    
   var h = timeobj.getHours();
   var hs = padd2(h);

   var m = timeobj.getMinutes();
   var ms = padd2(m);

   var s = timeobj.getSeconds();
   var ss = padd2(s);
   
   var x =  timeformat.replace(/MMM/, monthNames[timeobj.getMonth()]);
   
   x = x.replace(/MM/,padd2(timeobj.getMonth()+1));  
   
   x = x.replace(/DD/,padd2(timeobj.getDate()));
    
   x = x.replace(/YYYY/, ll); 
  
   x = x.replace(/YY+/, padd2( ll));
   
   x = x.replace(/hh/,hs); 
    
   x = x.replace(/mm/, ms);  
   x = x.replace(/ss/,ss); 
   return x;
}

function timestrpop(l)
{
   if (timeformat == null) alert('timeformat not defined');
   if (l == null ) return  ;
   var ln = 0;
   if(typeof(l)=='number')
      ln = l;
   else if (isNaN(l)) return  ;
   else
      ln = parseInt(l);
   var timeobj = new Date(ln*1000);

   var ll = timeobj.getYear(); 
   
   if (timeformat.indexOf("YYY") < 0)
   {
      ll+=1900;
      if (ll >= 2000 && ll < 2100)
         ll -= 2000;
   }
   else
   {
      ll += 1900;
   }
   
   var ww = textmsg[1361].split(/@/);
   var ystr, mstr, dstr, hstr, ustr, sstr;
   var q = [];
   var yi = timeformat.indexOf("YYYY");
   var ye = 'YYYY';
   if(yi == -1)
   {    
       yi = timeformat.indexOf("YYY");
       if (yi == -1) 
       {
           yi = timeformat.indexOf("YY");
           if (yi == -1) 
              ystr = "";
           else
           {
               ye = ww[0] +  ',YY';
               ystr = "<td   style=background-color:" + TBGCOLOR + " ><input id=yeartxt size=3 value=" + padd2( ll) + " style=\"background-color:" + TBGCOLOR + ";color:black;border:1px #c0c0c0 solid\"></td>";
           }
       }
       else
       {
           ystr = "<td   style=background-color:" + TBGCOLOR + " ><input id=yeartxt size=4 value=" + padd2( ll) + " style=\"background-color:" + TBGCOLOR + ";color:black;border:1px #c0c0c0 solid\"></td>";
           ye = ww[0] +  ',YYY'
       }
   }
   else
   {    
       ystr = "<td   style=background-color:" + TBGCOLOR + " ><input id=yeartxt size=5 value=" + ll + "  style=\"background-color:" + TBGCOLOR + ";color:black;border:1px #c0c0c0 solid\"></td>";
       ye = ww[0] + ',YYYY';
   }
   
   q['y'] = ystr + "," + ye;
   var mstr = "";
   var mn = timeobj.getMonth();
   var mi = timeformat.indexOf("MMM");
   if (mi == -1)
   {
       mi = timeformat.indexOf("MM");
       if (mi == -1)
       {
           ye = '';
           mstr = "";
       }
       else
       {
           ye = ww[1] + ',MM';
           mstr = "<td  align=left   style=background-color:" + TBGCOLOR + " ><select id=monthsel  style=\"background-color:" + TBGCOLOR + ";color:black;border:1px #c0c0c0 solid\">";
           for (var j=0; j < 12; j++)
           {
               var ss = "";
               if (j   == mn)
                   ss = " selected ";
               mstr += "<option value=" + (j ) + " " + ss +  ">" + padd2(j+1) + "</option>";
           }
           mstr += "</select></td>";
       }
   }
   else
   {
       mstr = "<td  align=left   style=background-color:" + TBGCOLOR + " ><select id=monthdel  style=\"background-color:" + TBGCOLOR + ";color:black;border:1px #c0c0c0 solid\">";
       for (var j=0; j < 12; j++)
       {
           var ss = "";
           if (j == mn)
               ss = " selected ";
           mstr += "<option value=" + j + " " + ss + ">" + monthNames[j] + "</option>";
       }
       mstr += "</select></td>";
       ye =  ww[1] +  ',MMM';
   }
   
   
   
    q['m'] = mstr + ',' + ye;
   var di =  timeformat.indexOf("DD");
   var dn = timeobj.getDate();
   if (di == -1)
   {
       ye = '';
       dstr = "";
   }
   else
   {
       dstr = "<td align=left   style=background-color:" + TBGCOLOR + " ><input id=datetxt size=3  style=\"background-color:" + TBGCOLOR + ";color:black;border:1px #c0c0c0 solid\" value=" 
       +  padd2(dn) + " ></td>";
       ye = ww[2] +  ',DD';
   }
    q['d'] = dstr + ',' + ye;
   var hi =  timeformat.indexOf("hh");
   var hn = timeobj.getHours();
   if (hi == -1)
   {
       hstr = "";
       ye = '';
   }
   else
   {
       hstr = "<td  style=background-color:" + TBGCOLOR + " ><select id=hoursel style=\"background-color:" + TBGCOLOR + ";color:black;border:1px #c0c0c0 solid\">";
       ye = ww[3] +  ',hh';
       for (var j=0; j <  24; j++)
       {
           var ss = "";
           if (j  == hn)
               ss = " selected ";
           hstr += "<option value=" + (j) + " " + ss +  ">" + padd2(j) + "</option>";
       }
       hstr += "</select></td>";
   }
   q['h'] = hstr + "," + ye;
   
   var ui =  timeformat.indexOf("mm");
   var un = timeobj.getMinutes();
   if (ui == -1)
   {
       ye = '';
       ustr = "";
   }
   else
   {
       ustr = "<td  style=background-color:" + TBGCOLOR + " ><select id=minutesel  style=\"background-color:" + TBGCOLOR + ";color:black;border:1px #c0c0c0 solid\">";
       ye = ww[4] +  ',mm';
       for (var j=0; j <  60; j++)
       {
           var ss = "";
           if (j  == un)
               ss = " selected ";
           ustr += "<option value=" + (j) + " " + ss +  ">" + padd2(j) + "</option>";
       }
       ustr += "</select></td>";
   }
   q['u'] = ustr + ',' + ye; 
  
   
   var si =  timeformat.indexOf("ss");
   var sn = timeobj.getSeconds();
   if (si == -1)
   {
       ye = '';
       sstr = "";
   }
   else
   {
       sstr = "<td  style=background-color:" + TBGCOLOR + " ><select id=secondsel  style=\"background-color:" + TBGCOLOR + ";color:black;border:1px #c0c0c0 solid\">";
       ye = ww[5] +  ',ss';
       for (var j=0; j <  60; j++)
       {
           var ss = "";
           if (j  == sn)
               ss = " selected ";
           sstr += "<option value=" + (j) + " " + ss +  ">" + padd2(j) + "</option>";
       }
       sstr += "</select></td>";
   }
   q['s'] = sstr + ',' + ye;
   var arr = [padd2(yi) + "y", padd2(mi) + "m", padd2(di) + 'd', padd2(hi) + "h", padd2(ui) + "u", padd2(si) + 's'];
   arr.sort();
   var zz = '<table class=outset3 cellspacing=1 cellpadding=3 border=1 align=center width=208px style="-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;border-color:#d0d0c0;border-collapse:collapse;border-width:1px;border-color:#ddd"   ><tr>';
   var zz1='', zz2=''; var kkk=0;
   for (var j=0; j < arr.length; j++)
   {
       if (arr[j].charAt(0)=='-')continue;
       var ar= q[arr[j].substring(2)].split(/,/);
       zz  += '<td align=left style=background-color:' + BBGCOLOR + ';font-weight:bold >' + ar[1] + '</td>';
       zz2 += '<td align=left style=background-color:' + DBGCOLOR + ' >(' + ar[2] + ')</td>';
       zz1 +=   ar[0]; kkk++;
   }
   zz += "</tr><tr>" + zz1 + "</tr><tr>" + zz2  + "</tr>"
   zz += "<tr><td colspan=" + kkk + " align=center><input class=OrangeButton style=width:" + Math.round(4.5*font_size) + "px;text-align:center onclick=setbacktime() value=\"" + textmsg[829] + "\" >";
   zz += "<input class=GreenButton style=width:" + Math.round(4.5*font_size) + "px;text-align:center onclick=closeprompt() value=\"" + textmsg[18] + "\" ></td></tr><tr><td colspan=" + kkk + " align=center><a href=javascript:setnow()><nobr>" + textmsg[1050] + "</nobr></a></td></tr></table>";
   myprompt(zz, null, null, textmsg[659]);
   promptwin.style.width = "208px";
   var xy = findPositionnoScrolling(ele(0,cc));
   promptwin.style.left = xy[0] + 'px';
   promptwin.style.top = (xy[1] + 40) + 'px';
   }
   
   
   function setnow()
   {
       timestrpop(Math.round((new Date()).getTime()/1000)); 
   }
   
   





function timestr1(l, timeformat1)
{
    
   if (l == -1) return  null;
   var timeobj = new Date(l*1000);
   var ll = timeobj.getYear();
 
   ll += 1900;
   if (timeformat1.indexOf("YYY")<0 && ll >=2000 && ll < 2100 )
      ll -= 2000;
   
   return timeformat1.replace(/MMM/, monthNames[timeobj.getMonth()-1]).replace(/MM/,padd2(timeobj.getMonth()+1)).replace(/DD/,padd2(timeobj.getDate())).replace(/YYYY/, (ll)).replace(/YY/, padd2(ll )).replace(/hh/,padd2(timeobj.getHours())).replace(/mm/, padd2(timeobj.getMinutes())).replace(/ss/,padd2(timeobj.getSeconds()));
}

var invalidtimevalue = -100000000;

function parseTime(str,tf)
{
  if (tf!=null && tf!=timeformat) 
      getTimelements(tf);
  
  try{ 
  var m, n = timeparts.length;
  if ( str == null || str =='') return invalidtimevalue;
  var timeobj = new Date();

  str = str.replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[ ]+/g, ' ');
  var r = new RegExp("[a-z|0-9]+", "i");
  var k = 0;
  var strs = new Array();
  while (k < str.length)
  {
      var z = r.exec(str.substring(k));
      if (z == null) break;
      strs[strs.length] = z.toString();
      k += z.index + strs[strs.length-1].length;
     
  }
  
  var j;
  k = 0;
  var yearnum = timeobj.getYear();
  var monthnum = timeobj.getMonth();
  var datenum = timeobj.getDate();
  var hournum = 0;
  var minutenum = 0;
  var secondnum = 0;
  var hasyear=false, hasmonth=false,hasday=false,hashour=false,hasminute=false,hassecond=false;
  for (var i = 0; i < n; i++)
  {
    // document.writeln(timeparts[i] + "=" + strs[i]);
     var atom = "0";
     if (i <strs.length  && strs[i]!='0')
     {
        atom = strs[i].replace(/^0([0-9])/,'$1');
     }
     
     switch(timeparts[i])
     {
        case 'MMM':
          m = parseMonth(atom);
          
          if (m >= 13) return  invalidtimevalue;
          timeobj.setMonth(m-1);  
          hasmonth = true;
          monthnum = m-1;
          break;
        case 'MM':
          if (isNaN(atom)) return  invalidtimevalue;
          m = parseInt(atom );
         
          if ( m > 12) m=12;
          monthnum = m-1;
         timeobj.setMonth(m-1);
          
         hasmonth = true; 
         break;
        case 'DD':
         if (isNaN(atom)) return  invalidtimevalue;
         m = parseInt(atom);
         
         if ( m > 31) m=31;
         timeobj.setDate(m);
         datenum = m;
         hasday = true;  
         break;
        case 'YY':
        case 'YYYY':
         if (isNaN(atom)) return  invalidtimevalue;
         m = parseInt(atom );
        
         if(m < 100 && m>=0 && atom.length <=2)
               m+=2000;
         if (m > 3000) return  invalidtimevalue;
         timeobj.setYear(m);
         yearnum = m;
         hasyear = true;
         break;
        case 'hh':
         if (isNaN(atom)) return  invalidtimevalue;
         m = parseInt(atom );
        
         if ( m > 23) m = 23;
         timeobj.setHours(m);
         hashour = true;  
         hournum = m;
         break;
       case 'mm':
         if (isNaN(atom)) return  invalidtimevalue;
         m = parseInt(atom );
        
         if ( m > 59) m = 59;
         timeobj.setMinutes(m); 
         hasminute = true;
         minutenum = m;
         break;
       case 'ss':
         if (isNaN(atom)) return  invalidtimevalue;
         m = parseInt(atom );
       
         if ( m > 59) m = 59;
         timeobj.setSeconds(m); 
         hassecond=true; 
         secondnum = m;
         break;
       }
    }
     
    if (hassecond==false) timeobj.setSeconds(0);
    if (hasminute==false) timeobj.setMinutes(0);
    if (hashour=false) timeobj.setHours(0);
    timeobj = new Date(yearnum, monthnum, datenum, hournum, minutenum,secondnum);
    var xx = timeobj.getTime(); xx -= xx%1000;
     
    return ~~(xx/1000);
}catch(e1){return invalidtimevalue;}
}

function setbacktime()
{
  var timeobj = new Date();
  var msel = document.getElementById('monthsel');
  if (msel!=null)
  {
      var m = parseInt(msel.options[msel.selectedIndex].value);
      timeobj.setMonth(m);  
  }
   
 
  var dtxt =  document.getElementById('datetxt');
  if (dtxt!=null)
  {
      var d = parseInt(dtxt.value.replace(/^0/,''));
      if ('' + d == 'NaN' || d<=0 || d >31)
      {
          dtxt.focus();
          return;
      }
      timeobj.setDate(d);
  }
   
  
  var ytxt =  document.getElementById('yeartxt');
  if (ytxt!=null)
  {
      var y = parseInt(ytxt.value.replace(/^0/,''));
      if ('' + y == 'NaN')
      {
          ytxt.focus();
          return;
      }
      if(y < 100 && y>=0 && ytxt.value.length <=2)
         y+=2000;
     
      timeobj.setYear(y); 
  }
  var hsel =  document.getElementById('hoursel');
  if (hsel!=null)
  {
      var htxt = hsel.options[hsel.selectedIndex].value;
      var h = parseInt(htxt);
      timeobj.setHours(h); 
  }
  else
  {
      timeobj.setHours(0); 
  }
  var usel =  document.getElementById('minutesel');
  if (usel!=null)
  {
      var utxt = usel.options[usel.selectedIndex].value;
      var u = parseInt(utxt);
      timeobj.setMinutes(u); 
  } 
  else
  {
      timeobj.setMinutes(0); 
  }
  var ssel =  document.getElementById('secondsel');
  if (ssel!=null)
  {
      var stxt = ssel.options[ssel.selectedIndex].value;
      var s = parseInt(stxt);
      timeobj.setSeconds(s); 
  } 
  else
  {
      timeobj.setSeconds(0); 
  }
  var xx = timeobj.getTime(); xx -= xx%1000;
  if (typeof(rr) != 'undefined')
  {
      setv(rr,cc,xx/1000);
      valuechanged[rr] = true;
  }
  closeprompt();
}
 
 
 
