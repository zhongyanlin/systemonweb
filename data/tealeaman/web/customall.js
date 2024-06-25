/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
function passh(i,j)
{
   return h[i][j];
}
function passm(i,j)
{
   return m[i][j];
}
function passhp(i)
{
   return hp[i];
}
var K=h.length, N=m.length, n=0;
function passhl()
{
   return K;
}
function passml()
{
   return N;
}
function passhpl()
{
   return hp.length;
}
var called = new Array(K);
for (var i =0; i < K; i++)
   called[i] = "";
for (var k=0; k < K; k++)
{
   for (var i=0; i < K; i++)
      if( (","+ h[i][4]+",").indexOf(","+ h[k][0] + ",")>=0 )
   {
      if (called[k]!='') called[k]+=",";called[k] += h[i][0];
   }
}
function passcalled(i)
{
   return called[i];
}
var starting = -1;
function gen()
{
   openit1('customize.jsp?mody=G','_blank');
}
function clearm()
{
   myprompt(textmsg[845] + "?", null,  
      "if (v) openit1('customize.jsp?mody=D','_blank');");
}

function openit(k)
{
   openit1('customize.jsp?mody='+ k, h[k][0]);
}

var group = new Array(K);
var lookfor = new Array();

function openstr(x)
{
   var k = parseInt(""+lookfor[x]);
   if (""+ k=='NaN')
   {
      myprompt(x +" is not a routine name"); return null;
   }
   
   return openit(k);
}

for (var k=0; k < K; k++)
   lookfor[h[k][0]] = k;
var groupcount = -1;

function grouping(k)
{
   if (group[k]!=null) return;
      groupcount++;
   propagate(k);
}
function propagate(k)
{
   if (group[k]!=null)return;
      group[k] = groupcount;
   var lks = (h[k][4]+","+called[k]).split(",");
   for (var j=0; j < lks.length; j++)
   {
      var lk = lks[j];
      var i = parseInt(""+lookfor[lk]);
      if (''+i!='NaN')propagate(i);
   }
}
for (var k=0; k < K; k++)
{
   grouping(k);
}
var groups = null;
if (groupcount>0)
{
   groups = new Array(groupcount);
   for (var k=0; k < K; k++)
      if (groups[group[k]]==null)
         groups[group[k]] = ""+k;
      else
         groups[group[k]] += ","+ k;
      
      for (var gc=0; gc < groupcount; gc++)
         groups[gc] = sort(groups[gc]);
}
if (groupcount==-1)groupcount = 0;  
function sort(xs)
{
   var xss = xs.split(",");
   var arr = new Array(xss.length);
   for (var i=0; i < arr.length; i++)
      arr[i] = h[xss[i]][0];
   arr.sort();
   var ans= "";
   for (var i=0; i < arr.length; i++)
   {
      if (i >0) ans +=",";
      ans += ""+ lookfor[arr[i]];
   }
   return ans;
}
function modifyhp(k,v)
{
   hp[k]=v;
}
function modifyh(k,n,v)
{
   h[k][n]=v;
}
function modifym(k,n,v)
{
   m[k][n]=v;
}
function swapm(i,j)
{
   for (var k=5; k < 6; k++)
   {
      var held = m[i][k];
      m[i][k] = m[j][k];
      m[j][k] = held;
   }
}
function openit2(gc)
{
   openit1('customize.jsp?mody='+ groups[gc], 'group'+gc);
}
function aline( k,i)
{
   document.write("<tr><td width=" + (13*font_size) + " ><a name="+ k + 
      "><a href=\"javascript:openit("+ k + ")\"><nobr>"+ h[k][0] 
      +"</nobr></a></td><td  width=400>"+ h[k][1].replace(/\?\?([^\?]+)\?\?/g,'[$1]') 
      +"</td><td width=80>"+ h[k][2] +"</td></tr>");
  
}

function reinit()
{
   starting = -1;
}
function find(k)
{
   
   var targ = document.form1.find0;
   if (k==1) targ = document.form1.find1;
      var target = targ.value;
   var j = starting+1;
   while ( j < K && h[j][k].indexOf(target)==-1) j++;
   
   if (j == K)
   {
      myprompt('Find none');
      starting = -1;
      targ.focus();
      return;
   }
   starting = j;
   document.location.href="#"+ j;
}        
document.write( 
"<tr><td></td></tr><tr><td>"
+ "<TABLE width=100%  cellpadding=3 cellspacing=1 class=outset1 >"
+ "<TR>"
+ "<td width=" + (5 + font_size) + " colspan=1 align=right  style=\"background:" + beheading +"\" bgcolor=" + BBGCOLOR +" ><nobr>"+ textmsg[542]
+ "</nobr></td><td style=\"background:" + beheading +"\" ><table border=0><tr><td  width=" + (13*font_size) + " ><nobr>" + toolmsg14
+ "<input name=find0  onchange=reinit() size=12>"
+ "<input type=button class=micro onclick=find(0)></nobr></td>"
+ "<td width=400><nobr>"+ textmsg[441]
+ "<input name=find1  onchange=reinit() size=20>"
+ "<input type=button class=micro onclick=find(1)></nobr></td>"
+ "<td  ><nobr>"+ textmsg[443] +"</nobr></td></tr></table></td>"
+ "</tr>");
for (var gc=0; gc < groupcount; gc++)
{
   document.write("<tr><td  bgcolor=" + TBGCOLOR +" valign=top align=right>  <a href=\"javascript:openit2("
   + gc
   +")\">"
   + gc
   + "</a>  </td><td bgcolor=" + TBGCOLOR+ "  aling=left><table border=0>");
   var st = ""+ groups[gc];
   var ls = st.split(",");
   for (var j=0; j < ls.length; j++) aline(ls[j]);
      document.write("</table></td></tr>");
}
document.write("<tr  bgcolor=#FFFFC0 ><td align=right>"+ groupcount +"  </td><td>"+ K +"</td></tr></table></td></tr> ");
