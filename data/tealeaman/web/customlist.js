/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
var K=opener.passhl(), N=opener.passml(), n=0;
var h = new Array(K),m=new Array(N), hp = new Array(K);
var mn3 = new Array(N);

for (var i = 0; i < N; i++)
{
   mn3[i] = opener.passm(i,3);
}          
                      
function openstr1(x)
{
   var na = opener.openstr(x);
   if (na!=null)
      na.moveTo(screen.width/2,0);
}
function callstr(x)
{
   var lst = x.split(",");
   var str = "";
   for (var i =0; i < lst.length; i++)
      if (lst[i].indexOf(".jsp")<0)
         str +="<a href=\"javascript:openstr1('"+lst[i]+"')\">"+ lst[i] +"</a> ";
      else
         str += lst[i] +" ";
      return str;
}
function opencfg(t)
{
   formnewaction(t);
   openit1('','savecfg');
}
var starting = null;
var NumRows = null;
function build(list)
{
   var count = 0;
   starting = new Array(list.length);
   NumRows = new Array(list.length);
   for (var j=0; j < list.length; j++)
   {
      var k = list[j];
      hp[k] = opener.passhp(k);
      h[k] = new Array(7);
      for (var z=0; z < 7; z++)
      {
        h[k][z] = opener.passh(k,z);
      }
      
      document.write("<form name=f"
      + count
      + " method=post action=savelangcfg.jsp target=savecfg onsubmit=opencfg(this)>"
      + round1() + "<table  width=400    cellpadding=3 cellspacing=1 class=outset3 >"
      + "<TR bgcolor=" + IBGCOLOR + " >"
      +"<td width=" + (4+font_size) + "   colspan=1> <font color=#DDCC11 >"
      + (1+count)
      + "</font></td>"
      + "<td   align=left colspan=3><nobr><font color=#DDCC11>" + toolmsg14 + "</font>"
      + "<input size=20 style=color:" + IBGCOLOR + "  name=rdapname value=\""
      + h[k][0]
      + "\" ></nobr></td> <td width=160  colspan=3 align=left> <font color=#DDCC11  ><nobr>"
      + textmsg[441] + "<input size=35 maxsize=100 ONFOCUS=S(document.f" + count +".title.value) ONBLUR=\"F("+count +",this.value);modifyh("+ k + ",1,this.value);\" name=title value=\""
      + h[k][1]
      + "\"> </td> <td   align=left> <font color=#DDCC11 ><nobr>"
      + textmsg[156] + "</nobr></td><td colspan=2 bgcolor=white><nobr>"+ h[k][2] + "</font>"+"</nobr></td></TR>");
      var n=0;
      while( n<N && mn3[n]!=k)n++;
      starting[count] = n;
      if (n < N)
      document.write("<TR style=\"background:"+beheading +"\"> <td width=20></td>"
      +"<td width=30 align=right><nobr>" + textmsg[542] +"</td>"
      +"<td width=30 align=right><nobr>" + Toolmsg1344 +"</td>"
      +"<td width=80 align=right><nobr>" + Toolmsg1347 +"</td>"
      +"<td width=80 ><nobr>" + textmsg[739] +"</td>"
      +"<td width=70 ><nobr>" + textmsg[156] +"</td>"
      +"<td width=10 ><nobr>" + Toolmsg1345 + "</td>"
      +"<td ><nobr>" + Toolmsg1346
      +"</td> <td ><nobr>Variable</td>"
      +"<td ><nobr>" + textmsg[184] +"</td> </TR>");
      
      var i = 0;

      while (n < N && mn3[n]==k)
      {
         m[n] = new Array(8);
         for (z=0; z < 8; z++)
         {
            if (z!=3)
            {
               m[n][z] = opener.passm(n, z);
            }
         }
         n++;
      }
      NumRows[count] =  n;
      n = starting[count];
      while (n < N && mn3[n]==k)
      {
         var kk =0;
         while (count < starting.length 
            &&     starting[count]+kk < mn3.length
            &&     starting[count]+kk < m.length
            && mn3[starting[count]+kk]==k
            && starting[count]+kk < NumRows[count]
            &&   m[starting[count]+kk][5]!=''+i)
            kk++;  

         document.write(
            "<TR bgcolor=" + TBGCOLOR + " >"
            +"<td  align=center><INPUT type=checkbox name=checkbox  onclick=\"showfloat(this," + count +", document.f" + count + ")\"> </td>"
            +"<td align=right style=color" + IBGCOLOR +">"+ i + " </td>"
            +"<td align=left><INPUT value=\""+ m[n][5] + "\" readonly class=right style=color:" + IBGCOLOR + "  size=2  maxsize=2 ONFOCUS=\"S(this.value)\"  NAME=t"+ i +"_1 onblur=\"modifym("+ n +",5,this.value);\" > </td>"
            +"<td align=left><INPUT value=\""+ m[kk+starting[count]][0] + "\"  readonly  class=left  style=\"background-color:" + IBGCOLOR + ";color:#DDCC11;font-weight:700;border:1px #888888 outset\"  size=15  maxsize=50  NAME=t"+ i +"_2  ONFOCUS=\"S(this.value)\"  onblur=\"R(this)\" > </td>"
            +"<td align=left><table><tr><td><INPUT value=\""+m[n][0] +"\" class=left  size=15  maxsize=50  NAME=t"+ i +"_3  ONFOCUS=\"S(this.value);c121("+count+","+i+",this.value)\"  onblur=\"F("+ count +",this.value);modifym("+ n +",0,this.value);subjs("+count+","+i+",this.value)\" > </td>"
            +"</td><td><a style=TEXT-DECORATION:none href=\"javascript:selectmore("+count +','+ i +")\"><font size=3>...</font></a></td></tr></table></td>"
            +"<td align=left><INPUT value=\""+ m[n][1] + "\"  class=left  size=10  maxsize=30  NAME=t"+ i +"_4  ONFOCUS=\"S(this.value)\"  onblur=\"modifym("+ n +",1,this.value)\" > </td>"
            +"<td align=left><INPUT value=\""+ ((m[n][2].charAt(0)=='0')?'*':'') + "\"  style=color:" + IBGCOLOR + "  class=left style=color:" + IBGCOLOR + "   size=1  maxsize=1  NAME=t"+ i + "_5  ONFOCUS=\"S(this.value)\"  onblur=\"R(this)\"> </td>"
            +"<td align=left><INPUT value=\""+ m[n][2].substring(2).replace(/^0/,"") + "\"  style=color:" + IBGCOLOR + "  class=right  style=color:" + IBGCOLOR + "   size=4  maxsize=4  NAME=t"+ i + "_6  ONFOCUS=\"S(this.value)\"  onblur=\"R(this)\"></td>"
            +"<td align=left><INPUT value=\""+ m[n][6] + "\" class=left size=8 style=color:black  NAME=t"+ i + "_7> </td>"
            +"<td align=left><INPUT value=\"\" class=left size=20   NAME=t"+ i + "_8 onblur=\"modifym("+ n +",7,this.value);\"> </td>"
            +"</TR>");
         n++;
         i++;
      }
      
      NumRows[count] = i;
      if (h[k][6]==null||h[k][6]=='null') 
          h[k][6]="";
         
      document.write("<TR bgcolor=" + TBGCOLOR + " ><td align=left background=\"image/bheading.gif\" colspan=2><nobr>" + Toolmsg1215 + "</nobr></td>"
      +"<td colspan=8 align=left bgcolor=#EEEEFF>"+ h[k][3] +"</td></tr>"
      +"<TR bgcolor=" + TBGCOLOR + " ><td align=left background=\"image/bheading.gif\" colspan=2><nobr>" + Toolmsg1216 + "</nobr></td>"
      +"<td colspan=8  align=left bgcolor=#EEEEFF>"+ callstr(h[k][4]) + "</td></tr>"
      +"<TR bgcolor=" + TBGCOLOR + " ><td align=left background=\"image/bheading.gif\" colspan=2><nobr>" + Toolmsg1217 + "</nobr></td>"
      +"<td colspan=8  align=left bgcolor=#EEEEFF>"+ callstr(opener.passcalled(k)) + "</td></tr>"
      +"<TR bgcolor=" + TBGCOLOR + " ><td align=left background=\"image/bheading.gif\" colspan=2><nobr>" + Toolmsg1218 + "</nobr></td>"
      +"<td colspan=8  align=left bgcolor=#EEEEFF> "+ h[k][6] + " </td></tr>"
      +"<TR bgcolor=" + TBGCOLOR + " ><td align=left background=\"image/bheading.gif\" colspan=2><nobr>" + Toolmsg1219 + "</nobr></td>"
      +"<td colspan=8  align=left bgcolor=#EEEEFF><table><tr><td><input name=keywords size=60 value=\""+ h[k][5] + "\" onfocus=S(this.value) onblur=\"F("+count+",this.value);modifyh("+ k +",5,this.value)\"></td>"
      +"<td><a style=TEXT-DECORATION:none href=\"javascript:morekey("+count +")\"><font size=3>...</font></a></td></tr></table></td></tr>"
      +"<TR bgcolor=" + TBGCOLOR + " ><td align=left valign=top background=\"image/bheading.gif\" colspan=2>" + textmsg[17]+" </td>"
      +"<td colspan=8  align=left bgcolor=#EEEEFF><textarea name=text rows=6 cols=60 onchange=\"modifyhp("+ k +",this.value)\"></textarea></td></tr>"
      +"</table>" + round2
      +"<br><INPUT type=hidden name=N value="+ i +" ><input type=hidden name=temp>"
      +"<INPUT name=bn1 class=GreenButton   type=button  " + style + "  ONCLICK=\"fmove(-1,document.f"+count +","+i+","+ (n-i) + ")\" value=\"" + Toolmsg1053 + "\" >"
      +"<INPUT name=bn2 class=GreenButton   type=button  " + style + "   ONCLICK=\"fmove(1,document.f"+count +","+i+","+ (n-i) + ")\" value=\"" + Toolmsg1054 + "\" >"
      +"<INPUT class=OrangeButton   " + style + "  onclick=\"document.f"+ count +".action='http://www.google.com/translate_t?sl=en&tl=zh-CN';\" type=submit value=\"google\">"
      +"<INPUT class=OrangeButton   " + style + "  onclick=\"document.f"+ count +".temp.value=2;document.f"+ count +".action='savelangcfg.jsp';\" type=submit value=\"" + Toolmsg1055 + "\" >"
      +"<INPUT class=OrangeButton   " + style.replace(/background:[^\)]*\)/,'') + ";width:100px  onclick=\"document.f"+ count +".temp.value=0;document.f"+ count +".action='savelangcfg.jsp';\" type=submit value=\"" + Toolmsg1225 + "\"  >"
      +"<INPUT class=OrangeButton   " + style + ";width:100px  onclick=\"document.f"+ count +".temp.value=1;document.f"+ count +".action='savelangcfg.jsp';\" type=submit value=\"" + Toolmsg1224 + "\">"
      +"</form><br>");
       
      count++;
   }
   
   if (list.length>1) 
       document.write(" <input name=b class=RedButton style=width:80 type=button value=\"" + Toolmsg1061 + "\"   ONCLICK=saveall()><br>");

document.write("<style>#floater1Div {position:absolute;left:0px;top:0px;visibility:hidden;}</style>");
document.write("<div class=outset id=floater1Div>");
document.write("<img src=image/float.png   onclick=movedown(event)>");
document.write("</div>");


   return count;
}
function floater(ct,f, div)
{
   this.f = f;
   this.ct = ct;
   this.div = div;
   this.steps = 0;
}
var floster1 = null;

function showfloat(ck, ct, f)
{
   if (ck.checked )
   {


   floater1 = new floater(ct, f, document.getElementById("floater1Div"));
   floater1.div.style.visibility = "visible";
   var xy = findPositionnoScrolling(ck);
   floater1.div.style.left = (xy[0]+ 20) + 'px';
   floater1.div.style.top =  (xy[1]+ 5) + 'px';
   }
   else
      floater1.div.style.visibility = "hidden";
}

function movedown(e)
{
    var posy = 0;
    if ( e.pageY)
    {
	    posy = e.pageY;
    }
    else if (e.clientY)
    {
	    posy = e.clientY + document.body.scrollTop
	          + document.documentElement.scrollTop;
    }
    var xy =  findPositionnoScrolling(floater1.div);
    var j = posy - xy[1];
     
    if (j <  15)
    {
       fmove(-1,floater1.f,NumRows[floater1.ct],starting[floater1.ct]);
       floater1.steps--;
       //window.scrollBy(0,-60);
    }
    else if (j > 15)
    {
       fmove(1,floater1.f, NumRows[floater1.ct],starting[floater1.ct]);
       floater1.steps++;
       //window.scrollBy(0,60);
    }
    if (floater1.steps > 7 || floater1.steps < -7)
    {
        var ii=0;
        for (; ii < floater1.f.checkbox.length; ii++)
          if (floater1.f.checkbox[ii].checked)break;
        xy =  findPositionnoScrolling(floater1.f.checkbox[ii]);
        floater1.div.style.top = (xy[1] + 5) + "px";
        floater1.steps = 0;
    }

}

function fillDefaultv(list)
{
   for (var j=0; j< list.length; j++)
   {
      var RN = (document.forms[j].elements.length-12)/9;
      document.forms[j].text.value = hp[list[j]];
      for (var ll=0; ll<RN;ll++)
         document.forms[j].elements[ll*9+10].value = m[starting[j] + ll][7];
   }
}
function c121(cunt,i,v)
{
   
   var str = document.forms[cunt].elements[5+9*i].value;
   var num = null;
   if (typeof(c1to1)!='undefined') num = c1to1[str.toLowerCase()];
   if (num!=null) 
      document.forms[cunt].elements[5+9*i].value = textmsg[num];
}
function subjs(cunt,i,v)
{
   var z = document.forms[cunt].elements[3+9*i].value;
   var jj = parseInt(z);
   var str = document.forms[cunt].elements[5+9*i].value;
   if (str.match("[0-9]+") && str.charAt(0)=='2')
   document.forms[cunt].elements[4+9*jj].value = textmsg[str.substring(1)];
   else
   document.forms[cunt].elements[4+9*jj].value = str;
}
var passedk,passedi;
function selectmore(k,i)
{
   var exist = eval('document.f'+ k + ".t"+ i + "_3.value");
   if (exist.charAt(0)=='3')
      exist = exist.substring(1);
   else exist = '';
   passedk = k;
   passedi= i;
   window.open('DataPicker?subdb=&rdap=morewords&extraline=5&exbut=mh&existing='+ exist,'picker',popstr);
}

function morekey(k)
{
   var exist = eval('document.f'+ k + ".keywords.value");
   exist = exist.replace(/[^0-9,]/g,'').replace(/,1[0-9]+/g,'').replace(/,2[0-9]+/g,'').replace(/^1[0-9]+/,'').replace(/^2[0-9]+/,'').replace(/,3/g,',').replace(/3/,'').replace(/,[,]+/g,',');
   passedk = k;passedi= -1;
   window.open('DataPicker?subdb=&rdap=morewords&extraline=5&existing='+ exist,'picker',popstr);
}
function getPassed(str)
{
   if (passedi>-1)
      eval('document.f'+ passedk + ".t"+ passedi + "_3.value= '" + str +"';");
   else
   {
      var exist = eval('document.f'+ passedk + ".keywords.value");
      exist = exist.replace(/,3[0-9]+/g,'').replace(/^3[0-9]+/,'').replace(/,[,]+/,',').replace(/^,/,'').replace(/,$/,'');
      str ='3'+str.replace(/,/g,',3');
      if (exist=='') exist = str;
         else exist +=','+ str;
            eval('document.f'+ passedk + ".keywords.value='"+ exist+"';");
   }
}

var needsave = new Array();
var x = 0;
function S(s)
{
   x = s;
}
function H(k,i,v)
{
   F(k,v);
   var j=0; while (j < textmsg.length && v!= textmsg[j])j++;
      if (j < textmsg.length)
         eval("document.f"+k +".t"+ i +"_4.value='2"+ j +"';");
}

function F(k,v)
{
   if (v!=x)
      needsave[k] = true;
   
}
function R(tb)
{
   tb.value = x;
}
function saveall()
{
   openit1('','sss');
   for(var i=0;i < document.forms.length; i++)
   if (needsave[i])
   {
      formnewaction(document.forms[i]);
      document.forms[i].submit();
   }
}
 

function fmove(j,f,NUMROWS,start)
{

   var full = false;
   var x=0, count=0,tt;
   for (; x < NUMROWS && f.checkbox[x].checked; x++);
      if (x == NUMROWS)
      {
         full=true;
      }
      x = ( x - j + NUMROWS)%NUMROWS;
      count=0;
      while (count++ < NUMROWS-1)
      {
         tt = ( x + j + NUMROWS)%NUMROWS;
         if (f.checkbox[x].checked)
         {
            swap(tt, x, f, NUMROWS);
            opener.swapm(tt+start,x+start);
         }
         x = (x - j + NUMROWS)%NUMROWS;
      }
      if (full)
         f.checkbox[( x + j + NUMROWS)%NUMROWS].checked=true;
}

function modifyhp(k,v)
{
   opener.modifyhp(k,v);
   hp[k]=v;
}
function modifyh(k,n,v)
{
   opener.modifyh(k,n,v);
   h[k][n]=v;
}
function modifym(k,n,v)
{
   opener.modifym(k,n,v);
   m[k][n]=v;
}
function reorderall(f,NUMROWS)
{
   var count = 0;
   while (count<100 && f.name!='f' + count) count++; if (count==100) return;
   var numCols = 9;
   for (var i=0; i < NUMROWS; i++)
   {
      var j=0;
      for(; j < NUMROWS
      && f.elements[i*numCols+5].value !=f.elements[j*numCols+4].value; j++);
      f.elements[i*numCols+3].value = '' + j;
      modifym(starting[count]+i,5, ''+j);
      
   }

}
function swap(tt,ii,f,NUMROWS)
{
   var held ;
   var numCols = 9;
   var k = 2;
   held = f.elements[ii*numCols+k+2].value;
   f.elements[ ii*numCols+k+2].value = f.elements[tt*numCols+k+2].value;
   f.elements[tt*numCols+k+2].value = held;
   reorderall(f,NUMROWS);
   f.checkbox[ii].checked = false;
   f.checkbox[tt].checked = true;
}
function resizeCont() 
{  
      var wd = thispagewidth();
      var het = thispageheight();
       
      for(var i=0; i < document.forms.length; i++)
          document.forms[i].text.style.width = "" + wd + "px";
      
} 
window.onresize = resizeCont;
 