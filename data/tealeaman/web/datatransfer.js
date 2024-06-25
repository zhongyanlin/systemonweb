/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
var savedstr = localStorage['dbtransfer'];
if (savedstr!=null)
{
    let saveds  = (new CSVParse(savedstr,"'",",")).nextRow();
    document.form1.servera.value = saveds[0];
    document.form1.drivera.value = saveds[1];
    document.form1.usera.value = saveds[2];
    document.form1.passworda.value = saveds[3];
    document.form1.serverb.value = saveds[4];
    document.form1.driverb.value = saveds[5];
    document.form1.userb.value = saveds[6];
    document.form1.passwordb.value = saveds[7];
}
function cacheit()
{
    localStorage['dbtransfer'] = "'" + document.form1.servera.value.replace(/'/g, "''") + "','" + document.form1.drivera.value + "','"+ document.form1.usera.value + "','" +  document.form1.passworda.value.replace(/'/g, "''") + "','"
    + document.form1.serverb.value.replace(/'/g, "''") + "','" + document.form1.driverb.value + "','"+ document.form1.userb.value + "','" +  document.form1.passwordb.value.replace(/'/g, "''") + "'";
}
function showtable(x)
{
   cacheit();
   if (x==0)
   {
      document.form1.passworda1.value = encryptString(document.form1.passworda.value);
     
   }
   else if (x==1)
   {
      document.form1.passwordb1.value = encryptString(document.form1.passwordb.value);
      
   }
   document.form1.passwordb.disabled = true;
   document.form1.passworda.disabled = true;
   if ( x != 2 || validate() )
   {
      document.form1.which.value = x;
      formnewaction(document.form1);
      visual(document.form1);
      document.form1.submit();
      
   }
   document.form1.passworda.disabled = false;
   document.form1.passwordb.disabled = false;
}
var tables = new Array(2);
var fields = new Array(2);

function getThem(x,tables1,fields1)
{
   tables[x] = new Array(tables1.length);
   fields[x] = new Array(tables1.length);
   for (var i = 0; i < tables1.length; i++)
   {
      tables[x][i] = tables1[i];
      fields[x][i] = new Array(fields1[i].length);
      for (var j=0; j < fields1[i].length; j++)
         fields[x][i][j] = fields1[i][j];
   }
   var sel = document.form1.tablelista;
   if (x==1) sel = document.form1.tablelistb;
      for (var i = sel.options.length-1; i>=0; i--)
         sel.options[i] = null;
      
      for (var i=0; i < tables[x].length; i++)
         sel.options[i] = new Option(tables[x][i],tables[x][i]);
}

function fill(x)
{
   var sel = document.form1.tablea;
   var source = document.form1.tablelista;
   if (x==1)
   {
      sel = document.form1.tableb;
      source = document.form1.tablelistb;
   }
   var j = source.selectedIndex;
   if (j==fields[x].length)
   {
      showtable(x);
   }
   else
   {
      for (var i = sel.options.length-1; i>=0; i--)
         sel.options[i] = null;
      
      for (var i=0; i < fields[x][j].length; i++)
         if (fields[x][j][i]!=null)
            sel.options[i] = new Option(fields[x][j][i],fields[x][j][i]);
   }
   // fill(0);
   // fill(1);
   
}

var sourcefield = '', destinfield='';
var sourcetab, destintab;
var destinlist;
var xx = 0;
function direct(x,z)
{
   if (tables[1-x]==null || tables[x]==null) return;
      var a = 'A', b='B'; 
      if (x==1)
      {
         a=b;b='A';
      }
      var source = document.form1.tablelista;
      if (x==1) source = document.form1.tablelistb;
         var destin = document.form1.tablelistb;
      if (x==1) destin = document.form1.tablelista;
         var j = source.selectedIndex;
      if (j >= tables[x].length)
      {
         myprompt('Need to select a table as source to transfer'); return;
      }
      var des = tables[x][j];
      
      var k = 0; while (k < tables[1-x].length && des!=tables[1-x][k])k++;
      var str = a +":"+ tables[x][j] + z + b +":";
      if (k < tables[1-x].length)
      {
           myprompt(des +" exists. Enter a new table name or cancel", des +"1", "addthaton(v,'" + str + "','" + destin +"')");
      }
      else
      {
          addthaton(des, str,destin);
      }
}

function addthaton(vl, str,destin)
{
   document.form1.scripts.value += str + vl + "\n";
   destinlist = destin;
}
var ifr;
function syn(des,win)
{
   ifr = win;
   var alls = document.form1.scripts.value.split("\n");
   if (des!='')
   {
      var j = 0;
      var dess = des.substring(1).split(/,/);
      for (var i = 0; i < dess.length; i++)
      {
         destinlist.options[destinlist.options.length] = new Option(dess[i], dess[i]);
         for( j=0; j < alls.length && alls[j].indexOf(":"+ dess[i])<0; j++);
         if (j < alls.length) alls[j] = '';
      }
      document.form1.scripts.value ='';
      for (j=0; j < alls.length; j++)
         if (alls[j] !='')
            document.form1.scripts.value += "\n"+ alls[j];
   }
}

function partial(x)
{
   if (tables[1-x]==null || tables[x]==null) return;
      var a = 'A', b='B'; if (x==1)
      {
         a=b; b='A';
      }
      var source = document.form1.tablelista;
      sourcetab = document.form1.tablea;
      destintab = document.form1.tableb;
      if (x==1)
      {
         source = document.form1.tablelistb; xx = 1;
      }
      else xx=0;
         var destin = document.form1.tablelistb;
      if (x==1)
      {
         destin = document.form1.tablelista; sourcetab = document.form1.tableb;
         destintab = document.form1.tablea;
      }
      var j = source.selectedIndex;
      if (j<0)
      {
         myprompt('Need to select a table as the source'); return;
      }
      if (j >= tables[x].length)
      {
         myprompt('The selected table is transferred');
      }
      
      var k = destin.selectedIndex; if (k<0)
      {
         myprompt('Need to select a table as the destination'); return;
      }
      if (k >= tables[1-x].length)
      {
         myprompt('The selected table is a transferred');
      }
      
      document.form1.scripts.value += a +":"+ tables[x][j] + ">"+ b +":"+ tables[1-x][k] + "\n";
      sourcefield = '';
      destinfield = '';
      sourcetab.selectedIndex = -1;
      destintab.selectedIndex = -1;
      destinlist = destin;
}
function show(t)
{
   if (t == null) return; var ans='';
      for (var i =0; i < t.length; i++)
         ans += "|"+ t[i] + "|\n";
}
function choose(x)
{
   if (sourcetab==null)
   {
      myprompt('No Source table selected. Click one of the Transfer buttons'); return;
   }
   if (destintab==null)
   {
      myprompt('No Source table selected'); return;
   }
   if ( sourcefield==''&& sourcetab.selectedIndex != -1)
   {
      sourcefield = sourcetab.options[sourcetab.selectedIndex].value.replace(/ .*/,'');
   }
   if ( destinfield==''&& destintab.selectedIndex !=-1)
   {
      destinfield = destintab.options[destintab.selectedIndex].value.replace(/ .*/,'');
   }
   if ( destinfield==''&& sourcefield!='')
   {
      var k=0;
      for(; k < destintab.options.length && destintab.options[k].value.indexOf(sourcefield+' ')!=0; k++);
      if (k < destintab.options.length)
      {
         destintab.selectedIndex = k;
         destinfield = sourcefield;
      }
   }
   if (sourcefield!=''&& destinfield!='')
   {
      document.form1.scripts.value += sourcefield + " AS "+ destinfield +"\n";
      sourcefield = '';
      destinfield = '';
      sourcetab.selectedIndex = -1;
      destintab.selectedIndex = -1;
   }
}
function contains1(arr, x)
{
   if (arr == null) return -1;
      var i = 0;
   for (; i < arr.length && arr[i] !=null && arr[i].replace(/ .*/,'')!=x; i++);
      if (i < arr.length && arr[i]!=null ) return i;
         return -1;
}
function contains(arr, x)
{
   if (arr == null) return -1;
      var i = 0;
   for (; i < arr.length && arr[i]!=x; i++);
      if (i < arr.length) return i;
         return -1;
}
function allmem(arr)
{
   var b = ',';
   var i = 0;
   for (; i < arr.length; i++)
      if (arr[i]!=null) b += arr[i] + ',';
         return b;
}
function lm(str)
{
   var strs = str.split(",");
   var yy = "";
   for (var j = 0; j < strs.length; j++)
   {
      var xx = strs[j].split(" ");
      if (xx.length <2 ) continue;
         if ( xx[1].toLowerCase().indexOf("int") > 0
            || xx[1].toLowerCase().indexOf("long") > 0
         || xx[1].toLowerCase().indexOf("num") > 0 )
         yy += "0 AS "+ xx[0] + "\n";
         else
            yy += "'' AS "+ xx[0] + "\n";
   }
   return yy;
}
function trim(x)
{
    var i=0; 
    while (i < x.length && (x.charAt(i) == '\n'||x.charAt(i) == ' ' || x.charAt(i) == '\r'))i++;
    var j = x.length-1;
    if (i>j) return '';
    while (j>i && (x.charAt(j) == '\n'||x.charAt(j) == ' ' || x.charAt(j) == '\r'))j--;
    if (i >= j+1)return ''; 
    return x.substring(i, j+1);
}
function validate()
{
   
   var x=0,y=0, k, l;
   var aa = '';
   var str = trim(document.form1.scripts.value);
   var rdaps = str.split(/[\r]*[\n]+/);
   var ans = "";
   for (var i = 0; i < rdaps.length; i++)
   {
      rdaps[i] = trim(rdaps[i]);  
      if(rdaps[i] == '') continue;
      ans += rdaps[i]; if (i < rdaps.length-1) ans += "\n";
      var j = rdaps[i].indexOf(">>");
      if (j<0) j = rdaps[i].indexOf("->");
         if (j > 0)
         {
            if (rdaps[i].charAt(0)!='A'&& rdaps[i].charAt(0)!='B'|| rdaps[i].charAt(1)!=':'||
               rdaps[i].charAt(j+2)!='A'&& rdaps[i].charAt(j+2)!='B'|| rdaps[i].charAt(j+3)!=':')
            {
               myprompt(textmsg[93]+ rdaps[i]); return false;
            }
            if (rdaps[i].charAt(0)=='A'&& contains(tables[0],rdaps[i].substring(2,j)) == -1 )
            {
               myprompt("Table "+ rdaps[i].substring(2,j) + " " + textmsg[99] ); return false;
            }
            if (rdaps[i].charAt(0)=='B'&& contains(tables[1],rdaps[i].substring(2,j)) == -1)
            {
               myprompt("Table "+ rdaps[i].substring(2,j) + " " + textmsg[99]); return false;
            }
            if (rdaps[i].charAt(j+2)=='A'&& contains(tables[0],rdaps[i].substring(j+4)) != -1)
            {
               myprompt("Table "+ rdaps[i].substring(j+4) + " " + textmsg[3]); return false;
            }
            if (rdaps[i].charAt(j+2)=='B'&& contains(tables[1],rdaps[i].substring(j+4)) != -1 )
            {
               myprompt("Table "+ rdaps[i].substring(j+4) + " " + textmsg[3]); return false;
            }
            continue;
         }
         
         j = rdaps[i].indexOf(">");
         if (j > 0)
         {
            if (rdaps[i].charAt(0)!='A'&& rdaps[i].charAt(0)!='B'|| rdaps[i].charAt(1)!=':'||
               rdaps[i].charAt(j+1)!='A'&& rdaps[i].charAt(j+1)!='B'|| rdaps[i].charAt(j+2)!=':')
            {
               myprompt(textmsg[93]+ " "+ rdaps[i]); return false;
            }
            if (rdaps[i].charAt(0)=='A'&& contains(tables[0],rdaps[i].substring(2,j)) == -1)
            {
               myprompt("Table "+ rdaps[i].substring(2,j) + " " + textmsg[99]); return false;
            }
            if (rdaps[i].charAt(0)=='B'&& contains(tables[1],rdaps[i].substring(2,j)) == -1)
            {
               myprompt("Table "+ rdaps[i].substring(2,j) + " " + textmsg[99]); return false;
            }
            if (rdaps[i].charAt(j+1)=='A'&& contains(tables[0],rdaps[i].substring(j+3)) == -1)
            {
               myprompt("Table "+ rdaps[i].substring(j+3) + " " + textmsg[99]); return false;
            }
            if (rdaps[i].charAt(j+1)=='B'&& contains(tables[1],rdaps[i].substring(j+3)) == -1)
            {
               myprompt("Table  "+ rdaps[i].substring(j+3) + " " + textmsg[99]); // show(tables[1]);
               return false;
            }
            myprompt('|'+rdaps[i].substring(2,j)+'|');
            if (rdaps[i].charAt(0)=='A')
            {
               x = 0; k = contains(tables[0],rdaps[i].substring(2,j));
            }
            if (rdaps[i].charAt(0)=='B')
            {
               x = 1; k = contains(tables[1],rdaps[i].substring(2,j));
            }
            if (rdaps[i].charAt(j+1)=='A')
            {
               y = 0; l = contains(tables[0],rdaps[i].substring(j+3));
            }
            if (rdaps[i].charAt(j+1)=='B')
            {
               y = 1; l = contains(tables[1],rdaps[i].substring(j+3));
            }
            aa = allmem(fields[y][l]); myprompt('aa='+aa);
            continue;
         }
         j = rdaps[i].toUpperCase().indexOf(" AS ");
         
         if (j < 0)
         {
             myprompt(textmsg[94] + " "+ rdaps[i]); return false;
         }
         
          
         if ( contains1(fields[x][k],rdaps[i].substring(0,j)) == -1
            && rdaps[i].substring(0,j).indexOf("'") < 0
         && rdaps[i].substring(0,j).replace(/[0-9]/g,'')!='')
         {
            myprompt( rdaps[i].substring(0,j) + " is not a field of "+ tables[x][k]);
            return false;
         }
         
          
         if ( contains1(fields[y][l],rdaps[i].substring(j+4)) == -1)
         {
            myprompt( allmem(fields[y][l]) +rdaps[i].substring(j+4) + "| is not a field of "+ tables[y][l]);
            return false;
         }
         else
            aa = aa.replace(rdaps[i].substring(j+4),'').replace(/, [^,]+,/,",");
   }
   if (aa!=''&& aa!=','&& confirm('Some fields are missing and they may be mandatory in the table. Do you want to add and edit default values?') )
   {
      document.form1.scripts.value=ans + "\n"+ lm(aa);
      return false;
   }
   else
      document.form1.scripts.value=ans;
   return (ans!='');
}
function debug(x)
{
    let bt = document.getElementById('erranchor' + x);
    if (bt.innerHTML == '') 
        bt.innerHTML = ifr.geterr(x);
    else 
        bt.innerHTML  = '';
}

document.form1.tablelista.options[0] = new Option(' ','');
document.form1.tableb.options[0] = new Option(' ','');
document.form1.tablelistb.options[0] = new Option(' ','');
document.form1.tablea.options[0] = new Option(' ','');
window.resizeTo(screen.width,screen.height-20);
window.moveTo(0,0);
function resizeCont()
{
      var wd = thispagewidth();
   var het = thispageheight();
    var het1 =  Math.floor((het- 140 - 7*1.5*font_size)/2);
    var het = '' +  het1   ; 
    var het2 = '' +  (2*het1+50)    
    document.form1.scripts.style.height =  het2 + "px";
//document.form1.scripts.style.width = "" + (screen.width-840) +  "px";
document.form1.tablelista.style.height = het+  "px";
document.form1.tableb.style.height =  het +  "px";
document.form1.tablelistb.style.height =  het +  "px";
document.form1.tablea.style.height =   het +  "px";
}
resizeCont();
onresize = resizeCont;