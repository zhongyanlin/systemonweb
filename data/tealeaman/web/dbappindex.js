
if (document.location.toString().indexOf("localhost") >= 0
    && typeof (handleErr) == 'undefined')
{
function handleErr(msg, url, l)
{
      var txt= "There was an error on this page.\n\n"
       + "Error: " + msg + "\n"
       + "URL:   " + url + "\n"
       + "Line:  " + l + "\n\n"
       + "Click OK to continue.\n\n";
      myprompt(txt);
      window.onerror = handleErr;
      return true;
}
window.onerror = handleErr;
}
 
var ab = new RegExp("[a-z|A-Z][^ ]*");
function openright(str)
{
   window.open(str,parent.frames[1].name);
}


function insertAfter( referenceNode, newNode )
{
   referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
}

function expandmenu(i)
{
   var sign= document.getElementById("menu" + i);
   var signd= document.getElementById("menud" + i);
   var tt = sign.src;
   if (tt.indexOf('menuc.gif') > 0)
   {
      for (var j=N-1; j >= 0; j--)
      {
         if (m[j][2]!=menus[i]) continue;
         var tr = document.createElement("tr");
         insertAfter(sign.parentNode.parentNode.parentNode,tr);
         var cell = tr.insertCell(0);
         cell.setAttribute("width","15");
         cell.innerHTML = "<img    width=" + font_size +"  style=\"border:0px 0px 0px 0px\" src=image/menul.gif>";
         cell = tr.insertCell(1);
         cell.setAttribute("width","15");
         cell.innerHTML = "<img    width=" + font_size +"  style=\"border:0px 0px 0px 0px\" src=image/menuf0.gif>";
         cell = tr.insertCell(2);
         cell.setAttribute("width","15");
         cell.innerHTML = "<img    width=" + font_size +"  style=\"border:0px 0px 0px 0px\" src=image/menuf.gif>";
         cell = tr.insertCell(3);
         cell.setAttribute("colspan","2");
         cell.colSpan="2";
         cell.setAttribute("align","left");
         cell.innerHTML = "<div   name=\"varywidthdivm" + j +"\" style=\"width:" + (thispagewidth()-3*font_size-16) +"px;overflow:hidden\"><a href=\"" + m[j][0] + "\" target=\"" + parent.frames[1].name +"\"><nobr>" + m[j][1] +"</nobr></a></div>";
         
      }
      sign.src = "image/menuo.gif";
      signd.src = "image/menudo.gif";
   }
   else
   {
      tr = sign.parentNode.parentNode.parentNode;

      for (j=N-1; j >= 0; j--)
      {
         if (m[j][2]==menus[i])
         tr.parentNode.removeChild(tr.nextSibling);
      }
      sign.src = "image/menuc.gif";
      signd.src = "image/menudc.gif";
   }
   fitmenu();
//   redocollectdiv();
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
      for (var j=nums[i]; j<n && z[j][2]==cats[i]; j++)
      {
         var tr = document.createElement("tr");
         insertAfter(tr0,tr);
         var cell = tr.insertCell(0);
         cell.setAttribute("width","15");
         if (iamsystemadmin)
         {
             cell.innerHTML =   "<img  width=" + (font_size-2)  + " src=image/delete.png  style=\"cursor:pointer;border:0px 0px 0px 0px\" onclick=\"trydelinconsistant('" + z[j][0] +"')\" alt=\"Delete Index\">";
         }
         else
         {
             cell.innerHTML = "<img  width=" + font_size +"  style=\"border:0px 0px 0px 0px\" src=image/menul.gif>";
         }
         cell = tr.insertCell(1);
         cell.setAttribute("width","15");
         cell.innerHTML = "<a href=\"javascript:expandform(" + j +")\"><img    width=" + font_size +"   style=\"border:0px 0px 0px 0px\" id=dir" + j +"  src=image/menuc.gif></a>";
         cell = tr.insertCell(2);
         cell.setAttribute("width","15");
         cell.innerHTML = "<img   width=" + font_size +"  style=\"border:0px 0px 0px 0px\" id=dird" + j +" src=image/menudc.gif>";
         cell = tr.insertCell(3);
         cell.setAttribute("colspan","2");
         cell.colSpan="2";
         cell.setAttribute("align","left");
         cell.setAttribute("vAlign","middle");
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
   fitmenu();
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
      for (var k=0; k < formassociated.length; k++)
      {
         if (formassociated[k][0]==z[j][0])
         {
         var tr = document.createElement("tr");
         insertAfter(sign.parentNode.parentNode.parentNode,tr);
         var url = formassociated[k][2];
         var cell = tr.insertCell(0);
         cell.setAttribute("width","15");
         cell.innerHTML = "<img   width=" + font_size +"   style=\"border:0px 0px 0px 0px\"  src=image/menul.gif>";
            cell = tr.insertCell(1);
            cell.setAttribute("width","15");
         cell.innerHTML = "<img   width=" + font_size +"   src=image/menul.gif>";
            cell = tr.insertCell(2);
            cell.setAttribute("width","15");
         cell.innerHTML = "<img   width=" + font_size +"   style=\"border:0px 0px 0px 0px\" src=image/menuf0.gif>";
            cell = tr.insertCell(3);
            cell.setAttribute("width","15");
         cell.innerHTML = "<img    width=" + font_size +"   style=\"border:0px 0px 0px 0px\" src=image/menuf.gif>";
         cell = tr.insertCell(4);
         cell.setAttribute("align", "left");
         cell.innerHTML = "<a href=\"javascript:openform('" + url +"',0)\"><nobr>" + formassociated[k][1] +"</nobr></a>";
         }
      }
      for (k=act.length-1; k>=0 ; k--)
      {
         tr = document.createElement("tr");
         insertAfter(sign.parentNode.parentNode.parentNode,tr);
         url = 'Form?rdap=' + z[j][0];
         if (z[j][3]!='') url += "&subdb=" + z[j][3];
         if (z[j][5] == 1)  url += "&df=1";
         if (acs[k]!='')  url += "&ac=" + acs[k];
         cell = tr.insertCell(0);
         cell.setAttribute("width","15");
         cell.innerHTML = "<img   width=" + font_size +"   style=\"border:0px 0px 0px 0px\"  src=image/menul.gif>";
            cell = tr.insertCell(1);
            cell.setAttribute("width","15");
         cell.innerHTML = "<img   width=" + font_size +"   src=image/menul.gif>";
            cell = tr.insertCell(2);
            cell.setAttribute("width","15");
         cell.innerHTML = "<img    width=" + font_size +"  style=\"border:0px 0px 0px 0px\" src=image/menuf0.gif>";
            cell = tr.insertCell(3);
            cell.setAttribute("width","15");
         cell.innerHTML = "<img   width=" + font_size +"    style=\"border:0px 0px 0px 0px\" src=image/menuf.gif>";
            cell = tr.insertCell(4);
         cell.setAttribute("align","left");
         var linkwidth = (thispagewidth()-4*font_size-16);
         cell.innerHTML = "<div   name=\"varywidthdivk" + k +"\" style=\"width:" + linkwidth +"px;overflow:hidden\"><a href=\"javascript:openform('" + url +"'," + k + ")\"><nobr>" + act[k] +"</nobr></a></div>";
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
   fitmenu();
  // redocollectdiv();
   showupdown();
}

function openform(url,k)
{
   if (k > 2)
   {
      myprompt(textmsg[847],"1", "openitup(v,'" + url +"')");
   }
   else postopen(url,  parent.frames[1].name  );

}
function openitup(param,url)
{
   url += param + "&numrows=1";
   
   postopen(url, parent.frames[1].name);
}
var replywin = null;
function setcrosssite(s)
{
    crosssite=s;
}

function trydelinconsistant(x)
{
    myprompt(textmsg[1586], null, "if(v)goaheaddel('" + x +"')" );
}
function goaheaddel(x)
{
    window.open("wordform.jsp?rdap=" + x +"&mode=24", parent.frames[1].name);
}
function openpage(up, low)
{
    var nm = parent.frames[1].name;
    if (low==null) low = '';
    var str = "webwframes.jsp?up=" + encodeURIComponent(up) + "&low=" + encodeURIComponent(low);
    postopen(str, nm);
}
function openright(pg)
{
    var nm = parent.frames[1].name;  
    var handle = window.open(pg, nm);
}

