/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
function wordcount(x)
{
     var a = x.value.split('\n');
     var l = a.length;
     var wc = 0;
     var cc = 0;
     for (var i = 0; i < l; i++)
     {
        var ss = a[i].split(' ');
        for (var j = ss.length-1; j>=0; j--)
        {
           if (ss[j].length > 0 && ss[j].replace(/^[a-z|A-Z]+$/,'')=='') 
              wc++;
           cc+= ss[j].length;
        }
     }
     myprompt('<table align=center> <tr><td>' + textmsg[729] +':</td><td>'+a.length+'</td></tr><tr><td>' + textmsg[730] +':</td><td>'+wc+'</td></tr><tr><td>' + textmsg[731] +':</td><td>'+cc+'</td></tr></table>');
    
}

var compsubmiscontinue = true;
var compsubmiscount = 0;
var compsubalink = null;
var compsubmisresu = null;
var compsubmthresh = null;
var compsubmsg = null;
function compsubmis()
{
     if (numRows < 2) 
     {
        myprompt(' n < 2.  ');
        return;
     }
     myprompt('<table  cellpadding=0 cellspacing=0 >'
     +'<tr><td><table id="compsubmisres" class=outset1 cellpadding=3 cellspacing=1 ><tr><td id="comsubmsgwin" width="320" colspan="3" rowspan="2"  align="center" style="background-color:' + TBGCOLOR + ";color:" + IBGCOLOR +'"></td>'
     + '<td  colspan="2" valign=top bgcolor=' + TBGCOLOR +' align=left><select  name=thresh onchange=restart(this)>'
     + '<option value="0" selected>90% same</option>'
     + '<option value="1">50% same</option>'
     + '<option value="2">1 row same</option>'
     + '<option value="3">2 row same</option>'
     + '</select></td></tr><tr>'
     + '<td  colspan="2" align=center bgcolor=' + TBGCOLOR +'><input class=OrangeButton style="width:' 
     + Math.round(charwidthrate()*font_size)+'px;height:' +  (4 + font_size) +'px;text-align:center" value="'
     + textmsg[18] + '" onclick=notcompsubmis()></td></tr></table></td></tr>'
     +'<tr><td  colspan=1     align=center><table><tr><td>&nbsp;<br></td></tr></table></td></tr>'
     +'</table>',null,null, textmsg[912]);
     promptwin.style.width="406px";
     compsubmisresu = document.getElementById('compsubmisres');
     compsubmsg = document.getElementById("comsubmsgwin");
     compsubmiscount = 0;
     restart(null);
}
function restart(sel)
{
   compsubmiscontinue = true;
   compsubalink = null;
   for (var i=compsubmisresu.rows.length-1; i>=1 && compsubmiscount>0; i--,compsubmiscount--)
      compsubmisresu.deleteRow(i);
   compsubmisresu.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].innerHTML
   = "<table><tr><td>&nbsp;<br></td></tr></table>";
   compsubmsg.innerHTML = "";
   compsubmsg.align = "center";
    
   setRoundedSize(promptwin, 406,130);
   if (sel!=null)
   compsubmthresh = sel.selectedIndex;
   else compsubmthresh = 0;

   compsubmisdo(0,0);
}
function notcompsubmis()
{
   compsubmiscontinue = false;
}

function compsubmisdo(i, j)
{
   
   if (promptwin == null) return;
   if (compsubmiscontinue==false)
   {
      compsubmsg.innerHTML += ': Canceled';
      return;
   }

   do
   {
   if (j<numRows-1)
      j++;
   else if (i < numRows-2)
   {
      i++; j=i+1;
   }
   else
   {
      compsubmsg.align = "left";
      if (compsubmiscount == 0)
      {
         compsubmsg.innerHTML =  textmsg[910]  ;
      }
      else
      {
         compsubmsg.innerHTML =  textmsg[909]  ;
      }
      return;
   }
   }
   while (mat[i][0]!=mat[j][0]  || mat[i][1]!=mat[j][1]
        ||mat[i][6].length < 10 || mat[j][6] < 10);

   compsubmisab(i,j);
   setTimeout("compsubmisdo(" + i +"," + j +")",10);
}
function answeronly(i)
{
    if (mat[i][12] == '0' || mat[i][12] == '2')
        return mat[i][6];
    var xx = "";
    var zz = - 50;
    while ( (zz = mat[i][6].indexOf("td>" + textmsg[139] + "<", zz+50)) > 0 )
    {
        var j = mat[i][6].indexOf("colspan=11 >", zz);
        var k = mat[i][6].indexOf("</td>\n</tr>", j);
        if (xx!='') xx += "\n";
        xx += mat[i][6].substring(j+12, k);
    }
    return xx;
}
function compsubmisab(i,j)
{
   compsubmsg.innerHTML = i + " ~ " + j;
   var a = answeronly(i).split(/[ ]*\n[ ]*/);
   var b = answeronly(j).split(/[ ]*\n[ ]*/);
   var ai = 0, bi=0;
   var matchn = 0;
   var itisone = false;
   while (ai < a.length && bi < b.length)
   {
      if (a[ai]==null || a[ai]=='')
      {
         ai++;  continue;
      }
      var k = 0;
      for (k = bi; k < b.length ; k++)
         if (a[ai]==b[k]) break;
      if (k < b.length)
      {
         matchn++; ai++; bi++; 
      }
      else
      {
         ai++; bi=0;
      }
      if 
      (  compsubmthresh==3 && matchn>=2
      || compsubmthresh==2 && matchn>=1
      || compsubmthresh==0 && (matchn >= 0.9*a.length || matchn >= 0.9*b.length)
      || compsubmthresh==1 && (matchn >= 0.5*a.length || matchn >= 0.5*b.length)
      )
      {
         itisone = true;
         break;
      }
   }
    
   if (itisone)
   {
      var newrow=compsubmisresu.insertRow(2+compsubmiscount);
      var cell1 = newrow.insertCell(0);
      cell1.style.backgroundColor= TBGCOLOR;
      cell1.innerHTML  = "<nobr>" +  mat[i][1] + "</nobr>";

      cell1 = newrow.insertCell(1);
      cell1.style.color="blue";
      cell1.style.backgroundColor= TBGCOLOR;
      cell1.onclick = function(){populate(i);}
      cell1.innerHTML  = "<nobr>" + mat[i][10] + "</nobr>" ;

      cell1 = newrow.insertCell(2);
      cell1.style.color="blue";
      cell1.style.backgroundColor= TBGCOLOR;
      cell1.onclick = function(){populate(j);}
      cell1.innerHTML  = "<nobr>" + mat[j][10] + "</nobr>" ;

      cell1 = newrow.insertCell(3);
      cell1.style.color="blue";
      cell1.align="center";
      cell1.style.backgroundColor= TBGCOLOR;
      cell1.onclick = function(){compsubmisvew(i,j,this);}
      cell1.innerHTML  = "<nobr>" + textmsg[30]  + "</nobr>" ;

      var cell2 = newrow.insertCell(4);
      cell2.style.color = "blue";
      cell2.align="center";
      cell2.style.backgroundColor= TBGCOLOR;
      cell2.onclick = function(){thisisnot(this);}
      cell2.innerHTML  = "<nobr>" +  textmsg[69] + "</nobr>" ;
      setRoundedSize(promptwin, compsubmisresu.parentNode.parentNode.parentNode.offsetWidth + 6,
       compsubmisresu.parentNode.parentNode.parentNode.offsetHeight + 6);
       
      if (compsubmiscount>10)
         promptwin.style.top = "0px";
      compsubmiscount++;
   }
}

function thisisnot(td)
{
   var tbl = compsubmisresu;
   for (var i=0; i < tbl.rows.length; i++)
   {
       if (tbl.rows[i].cells[4]==td)
       {

            if (i>0 && compsubalink==tbl.rows[i].cells[3])
            {
               compsubalink = tbl.rows[i-1].cells[4];
               compsubalink.innerHTML = '<b>' + compsubalink.innerHTML +'</b>';
            }
            else if (i==0&&compsubalink==tbl.rows[i].cells[3])
            {
               compsubalink = null;
            }

            tbl.deleteRow(i);
            compsubmisresu.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].innerHTML
            = "<table><tr><td>&nbsp;<br></td></tr></table>";
            setRoundedSize(promptwin,compsubmisresu.parentNode.parentNode.parentNode.offsetWidth + 6,  
                            compsubmisresu.parentNode.parentNode.parentNode.offsetHeight + 6)  ;
            
            return;
       }
   }
}

function compsubmisvew(i,j,alink)
{
   if (compsubalink!=null)
       compsubalink.innerHTML = compsubalink.innerHTML.substring(3).replace(/....$/,'');
   alink.innerHTML = '<b>' + alink.innerHTML +'</b>';
   compsubalink = alink;

   var a = answeronly(i).split(/[ ]*\n[ ]*/);
   var b = answeronly(j).split(/[ ]*\n[ ]*/);
   var c = new Array(b.length);
   var ai = 0, bi=0;
   var matchn = 0;
   var at = "", bt="";
   var blankar = 0, blankbr=0;
   while (ai < a.length && bi < b.length)
   {
      if (a[ai]=='')
      {
         ai++;
         at += "<br>";
         blankar++;
         continue;
      }
      var k = 0;

      for (k = bi; k < b.length ; k++)
      {
         if (a[ai]==b[k])
         {
            c[k] = true;
            break;
         }
      }

      if (k < b.length)
      {
         at += "<nobr><span style=background:url(image/bheading.gif);background-color:" + BBGCOLOR+">" + a[ai].replace(/</g, "&lt;") + "</span></nobr><br>";
         matchn++;
         bi++;
      }
      else
      {
         at += "<nobr>" + a[ai].replace(/</g, "&lt;") + "</nobr><br>";
         bi=0;
      }
      ai++; 
   }
   k=0;
   while (k < b.length)
   {
      if (c[k]==true)
        bt += "<nobr><span style=background:" + beheading +">" + b[k].replace(/</g, "&lt;")  + "</span></nobr><br>";
      else if (b[k]!='')
        bt += "<nobr>" + b[k].replace(/</g, "&lt;")  + "</nobr><br>";
      else
      {
         bt += "<br>";
         blankbr++;
      }
      k++;
   }
   blankbr = b.length - blankbr;
   blankar = a.length - blankar;
   if (blankar==0)blankar=1;
   if (blankbr==0)blankbr=1;
   compsubmisresu.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].innerHTML
      = "<table class=outset1 style=\"font-size:14px\" cellpadding=3 cellspacing=1 border=0  >"
      + "<tr><td colspan=2 align=center bgcolor=" + BBGCOLOR +" background=" + beheading +">" + textmsg[911] + ": <b>" + matchn + "</b>  &nbsp;&nbsp;" + mat[i][10] +": <b>" + Math.floor(matchn/blankar*100) +"%</b>  &nbsp;&nbsp;" + mat[j][10] +": <b>"
      + Math.floor(matchn/blankbr*100) +"%</b></td></tr>"
      + "<tr><td valign=top  bgcolor=" + TBGCOLOR +">"
      + at
      +"</nobr></td><td   bgcolor=" + TBGCOLOR +"  valign=top><nobr>"
      +  bt
      +"</nobr></td></tr></table>";
   var tt1 = compsubmisresu.parentNode.parentNode.parentNode.offsetHeight;
   if(tt1 > 600){  promptwin.style.left = "0px";promptwin.style.top = "0px";}
   setRoundedSize(promptwin,compsubmisresu.parentNode.parentNode.parentNode.offsetWidth + 6,  
                            compsubmisresu.parentNode.parentNode.parentNode.offsetHeight + 6)  ;
   

}