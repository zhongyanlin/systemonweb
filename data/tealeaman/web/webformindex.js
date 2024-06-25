var ab = new RegExp("[a-z|A-Z][^ ]*");
function invoke1()
{
   open("wordform.jsp?mode=1", parent.frames[1].name );
}

function insertAfter( referenceNode, newNode )
{
   referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
}
function findmenui(str){var i=0; for(; i < menus.length && menus[i]!= str; i++);return i;}
function findcatsi(str){var i=0; for(; i < cats.length  && cats[i] != str; i++);return i;}
var catsopened = null; if (typeof(cats)!='undefined') catsopened = new Array(cats.length);
var menuopened = null; if (typeof(menus)!='undefined') menuopened = new Array(menus.length);
function initflags(b)
{
   if (typeof(menus)!='undefined')
   for(var i =0; i < menus.length; i++)
     menuopened[i] = b;
   if (typeof(cats)!='undefined')
   for( i =0; i < cats.length; i++)
     catsopened[i] = b;
}
function expandmenu(i)
{
   var sign= document.getElementById("menu" + i);
   var signd= document.getElementById("menud" + i);
   var tt = sign.src;
   if (tt.indexOf('menuc.gif') > 0)
   {
      menuopened[i] = true;
      for (var j=N-1; j >= 0; j--)
      {
         
         if (m[j][2]!=menus[i]) continue;
         var tr = document.createElement("tr");
         tr.setAttribute("height","22");
         insertAfter(sign.parentNode.parentNode.parentNode,tr);
         var cell = tr.insertCell(0);
         cell.setAttribute("width","15");
         cell.innerHTML = "<img  width=" + font_size  + "   style=\"border:0px\" src=image/menul.gif>";
         cell = tr.insertCell(1);
         cell.setAttribute("width","15");
         cell.innerHTML = "<img  width=" + font_size  + "   style=\"border:0px\" src=image/menuf0.gif>";
         cell = tr.insertCell(2);
         cell.setAttribute("width","15");
         cell.innerHTML = "<img  width=" + font_size  + "   style=\"border:0px\" src=image/menuf.gif>";
         cell = tr.insertCell(3);
         cell.setAttribute("colspan",2);
         cell.colSpan = 2;
         cell.setAttribute("align","left");
         cell.setAttribute("valign","center");
         cell.innerHTML = "<a href=\"" + m[j][0] + "\" target=\"" + parent.frames[1].name +"\"><nobr>" + m[j][1] +"</nobr></a>";
         
      }
      sign.src = "image/menuo.gif";
      signd.src = "image/menudo.gif";
   }
   else
   {
      tr = sign.parentNode.parentNode.parentNode;
      menuopened[i] = false;
      for (j=N-1; j >= 0; j--)
      {
         if (m[j][2]==menus[i])
         tr.parentNode.removeChild(tr.nextSibling);
      }
      sign.src = "image/menuc.gif";
      signd.src = "image/menudc.gif";
   }
   //fitmenu();
   showupdown();
}

function expand(i)
{
   if (typeof cats=='undefined') return;
   var sign= document.getElementById("sign" + i);
   var signd= document.getElementById("signd" + i);
   var tt = sign.src;
   var tr0 = sign.parentNode.parentNode.parentNode;
   if (tt.indexOf('menuc.gif') > 0)
   {
      catsopened[i] = true;
      for (var j=nums[i]; j<n && z[j][2]==cats[i]; j++)
      {
         var tr = document.createElement("tr");
         tr.setAttribute("height","22");
         insertAfter(tr0,tr);
         var cell = tr.insertCell(0);
         cell.setAttribute("width","15");
         if (iamsystemadmin)
         {
             cell.innerHTML =   "<img  width=" + (font_size-2)  + " src=image/delete.png  style=cursor:pointer;border:0px onclick=\"trydelinconsistant('" + z[j][0] +"')\" alt=\"Delete Index\">";
         }
         else
         {
             cell.innerHTML = "<img  width=" + font_size +"  style=\"border:0px\" src=image/menul.gif>";
         }
         cell = tr.insertCell(1);
         cell.setAttribute("width","15");
         cell.innerHTML = "<a href=\"javascript:expandform(" + j +")\"><img  width=" + font_size  + "    style=\"border:0px\" id=dir" + j +"  src=image/menuc.gif></a>";
         cell = tr.insertCell(2);
         cell.setAttribute("width","15");
         cell.innerHTML = "<img  width=" + font_size  + "    style=\"border:0px\" id=dird" + j +" src=image/menudc.gif>";
         cell = tr.insertCell(3);
         cell.setAttribute("align","left");
         cell.setAttribute("valign","center");
         cell.setAttribute("colspan",2);
         cell.colSpan = 2;
          var linkwidth = (thispagewidth()-3*font_size-12);
         cell.innerHTML = "<div   name=\"varywidthdivf" + j +"\" style=\"width:" + linkwidth +"px;overflow:hidden\">"
                        + "<nobr><font color=gold>[<b>" + z[j][0] +"</b>]"+ z[j][1] +"</font></nobr></div>";
         tr0 = tr;
      }
      sign.src = "image/menuo.gif";
      signd.src = "image/menudo.gif";
   }
   else
   {
      catsopened[i] = false;
      tr = sign.parentNode.parentNode.parentNode;
      for (j=nums[i]; j < n && z[j][2]==cats[i]; j++)
      {
          
         var signj= document.getElementById("dir" + j);
         var ty = signj.src;
         if (ty.indexOf('menuo.gif') > 0)
            expandform(j);
         tr.parentNode.removeChild(tr.nextSibling);
      }
      sign.src = "image/menuc.gif";
      signd.src = "image/menudc.gif";
   }
   //fitmenu();
   showupdown();
}
function expandform(j)
{

   var sign= document.getElementById("dir" + j);
   var signd= document.getElementById("dird" + j);
   var tt = sign.src;
   if (tt.indexOf('menuc.gif') > 0)
   {
      if (typeof (formassociated) != 'undefined')
      for (var k=0; k< formassociated.length; k++)
      {
         if (formassociated[k][0]==z[j][0])
         {
         var tr = document.createElement("tr");
         tr.setAttribute("height","22");
         insertAfter(sign.parentNode.parentNode.parentNode,tr);
         var url = formassociated[k][2];
         var cell = tr.insertCell(0);
         cell.setAttribute("width","15");
         cell.innerHTML = "<img  width=" + font_size  + "   style=\"border:0px\"  src=image/menul.gif>";
            cell = tr.insertCell(1);
            cell.setAttribute("width","15");
         cell.innerHTML = "<img  width=" + font_size  + "   src=image/menul.gif>";
            cell = tr.insertCell(2);
            cell.setAttribute("width","15");
         cell.innerHTML = "<img  width=" + font_size  + "   style=\"border:0px\" src=image/menuf0.gif>";
            cell = tr.insertCell(3);
            cell.setAttribute("width","15");

         cell.innerHTML = "<img  width=" + font_size  + "    style=\"border:0px\" src=image/menuf.gif>";
            cell = tr.insertCell(4);
         cell.setAttribute("valign","middle");
         cell.setAttribute("align","left");
         cell.innerHTML =
         "<a href=\"javascript:openform('" + url +"',0)\"><nobr>" + formassociated[k][1] +"</nobr></a>";
         }
      }
      for (k=act.length-1; k>=0 ; k--)
      {
          tr = document.createElement("tr");
          tr.setAttribute("height","22");
         insertAfter(sign.parentNode.parentNode.parentNode,tr);
          url = 'Form?rdap=' + z[j][0];
         if (z[j][3] !='')  url += "&subdb=" + z[j][3];
         if (z[j][5] == 1)  url += "&df=1"; 
         if (acs[k]!='')  url += "&ac=" + acs[k];
           cell = tr.insertCell(0);
         cell.setAttribute("width","15");
         cell.setAttribute("align","left");
          cell.setAttribute("valign","middle");
         cell.innerHTML = "<img  width=" + font_size  + "   style=\"border:0px\"  src=image/menul.gif>";
            cell = tr.insertCell(1);
            cell.setAttribute("width","15");
          cell.setAttribute("align","left");
          cell.setAttribute("valign","middle");
         cell.innerHTML = "<img  width=" + font_size  + "   src=image/menul.gif>";
            cell = tr.insertCell(2);
            cell.setAttribute("width","15");
         cell.setAttribute("align","left");
          cell.setAttribute("valign","middle");
         cell.innerHTML = "<img  width=" + font_size  + "   style=\"border:0px\" src=image/menuf0.gif>";
            cell = tr.insertCell(3);
            cell.setAttribute("width","15");
         cell.setAttribute("align","left");
          cell.setAttribute("valign","middle");
         cell.innerHTML = "<img  width=" + font_size  + "    style=\"border:0px\" src=image/menuf.gif>";
           cell = tr.insertCell(4);
          cell.setAttribute("align","left");
          cell.setAttribute("valign","middle");
            var linkwidth = (thispagewidth()-4*font_size-16);
         cell.innerHTML = "<div   name=\"varywidthdivk" + k +"\" style=\"width:" + linkwidth +"px;overflow:hidden\"><a href=\"javascript:openform('" + url +"'," + k + ")\"><nobr>" + act[k] +"</nobr></a></div>";

        // cell.innerHTML =
        // "<a href=\"javascript:openform('" + url +"'," + k + ")\"><nobr>" + act[k] +"</nobr></a>";
      }
      sign.src = "image/menuo.gif";
      signd.src = "image/menudo.gif";
   }
   else
   {
      tr = sign.parentNode.parentNode.parentNode;
      for (k=act.length-1; k>=0 ; k--)
         tr.parentNode.removeChild(tr.nextSibling);
      if (typeof (formassociated) != 'undefined')
      for (k=0; k < formassociated.length; k++)
         if (formassociated[k][0]==z[j][0])
             tr.parentNode.removeChild(tr.nextSibling);
      sign.src = "image/menuc.gif";
      signd.src = "image/menudc.gif";
   }
   if (typeof(fitmenu)!='undefined')fitmenu();
   showupdown();
}

function openform(url,k)
{

   if (k > 2)
   {
      myprompt(textmsg[847],"1", "openitup(v,'" + url +"')");
   }
   else open(url,  parent.frames[1].name  );

}
function openitup(param,url)
{
   url += param;
   open(url, parent.frames[1].name);
}
var replywin = null;
function setcrosssite(s)
{
    crosssite=s;
}
var lines = new Array();
var numlines = 0;
function parseas(ele, jj)
{
   if (ele.childNodes == null || ele.childNodes.length == 0) return;
   for (var i =0; i < ele.childNodes.length; i++)
   {
      if (ele.childNodes[i].tagName==null) continue;
      if (ele.childNodes[i].tagName.toLowerCase() == 'nobr')
      {
         lines[numlines++] = ele.childNodes[i];
          
      }
      else
        parseas(ele.childNodes[i],jj+1);
   }
}
function getLines()
{
   numlines = 0;
   parseas(document.getElementById("table1"),0);
}
function markthme(reg)
{
   for (var j = 0; j < lines.length; j++)
   {
      var str  = lines[j].innerHTML;
      var nospan = str.replace(/<span[^>]+>/g, "").replace(/<.span>/g, "");
      lines[j].innerHTML = nospan;
      var k = 0, l2 = 0, l1 = 0;
      str = "";
      
      while (k <= nospan.length)
      {
         if ( k==nospan.length || nospan.charAt(k) == '<' )
         {
             
            var m = reg.exec(nospan.substring(l2,k));
            if (m!=null)
            {
               var fd = '' + m;
               var n = nospan.indexOf(fd, l2);
               str += nospan.substring(l2, n)
                   + "<span style=background-color:white;color:" + ibgcolor +">"
                   + fd +"</span>" + nospan.substring(n + fd.length, k);
            }
            else
               str += nospan.substring(l2, k);
            l1 = k;
         }
         else if (nospan.charAt(k) == '>')
         {
            l2 = k+1;
            str += nospan.substring(l1,l2);
         }
         k++;
      }
      lines[j].innerHTML = str;
   }
}
function trydelinconsistant(x)
{
    myprompt("Do you want to delete this index (not the form)?", null, "if(v)goaheaddel('" + x +"')" );
}
function goaheaddel(x)
{
    window.open("wordform.jsp?rdap=" + x +"&mode=24", parent.frames[1].name);
}
function searchit()
{
   for(var i =0; i < menus.length; i++)
     if (menuopened[i]) expandmenu(i);
   if (typeof(cats)!='undefined')
   for(  i =0; i < cats.length; i++)
     if (catsopened[i])expand(i);

   var pat = document.getElementById("pat").value;
   if (pat=='')
   {
      for (var j = 0; j < lines.length; j++)
      {
          var str  = lines[j].innerHTML;
          lines[j].innerHTML = str.replace(/<span[^>]+>/g, "").replace(/<.span>/g, "");
      }
      return;
   }
   var spc = "$^*()=-[]\\|.";
   pat = pat.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
   for (  i=0; i < pat.length; i++)
   {
      if (spc.indexOf(pat.charAt(i))>=0)
      {
         pat = pat.substring(0,i) + "\\" + pat.substring(i);
         i++;
      }
   }
   pat = pat.replace(/[ ]+/, ".*");


   var reg = new RegExp(pat,"i");

   for (j = 0; j < z.length; j++)
   {
      var mr = reg.exec(z[j][0]);
      if (mr != null)
      {
         i = findcatsi(z[j][2]);
         if (catsopened[i] != true)
            expand();
      }
      mr = reg.exec(z[j][1]);
      if (mr != null)
      {
         i = findcatsi(z[j][2]);
         if (catsopened[i] != true)
            expand(i);
      }
   }
   for (j = 0; j < m.length; j++)
   {
      mr = reg.exec(m[j][1]);
      if (mr != null)
      {
         i = findmenui(m[j][2]);
         
         if (menuopened[i] != true)
            expandmenu(i);
      }
   }
   getLines();
   markthme(reg);
}
function openpage(up, low)
{
    if (low==null) low = '';
    var str = "webwframes.jsp?up=" + encodeURIComponent(up) + "&low=" + encodeURIComponent(low);
    postopen(str,parent.frames[1].name);
}
initflags(false);
function openright(pg)
{
    var nm = parent.frames[1].name;
    postopen(pg, nm);
}
