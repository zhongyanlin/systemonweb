var cx,cy;
var dx,dy;
var tx,ty;
var mx=0, my=0;
var moving = -1;
var currenti=-1;
var bgurl = document.body.background;
var bgcolor = null;
var bodymargin = '4px 4px 4px 4px';
var active = false;
var maxheight  = 10; 
var trheight = 26;
var rdap = null;
if (typeof(parent.parent.frames[0].tellrdap) ==' function')
    rdap = parent.parent.frames[0].tellrdap();
else if (typeof(parent.frames[0].tellrdap) ==' function')
    rdap = parent.frames[0].tellrdap(); 
 
var butxy = [0,0];
var style = [];

var creating = true;
var NN = 0, MAXN = 0;
 
var textbefore;
var hide = [];
var nowh = false;
if (typeof (ismobile) == 'undefined')
var ismobile = function()
{
    return navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/BlackBerry/i)||
    navigator.userAgent.match(/iPhone|iPad|iPod/i)
    || navigator.userAgent.match(/Opera Mini/i)
   ||  navigator.userAgent.match(/IEMobile/i);
}
 
if (ismobile() && typeof (Drag) == 'undefined')
{
    var Drag = 
   {
      init : function (draggable, obj)
      {
        if (obj == null)
        {
            draggable.style.position = "absolute";
            draggable.addEventListener('touchmove', 
            function(event) 
            {
               var touch = event.targetTouches[0];
               draggable.style.left = touch.pageX-25 + 'px';
               draggable.style.top = touch.pageY-25 + 'px';
               event.preventDefault();
               if (typeof atEndDrag =='function')atEndDrag(touch.pageX,touch.pageY);
            }, 
            false);
        }
        else
        {
            obj.style.position = "absolute";
            draggable.addEventListener('touchmove', 
            function(event) 
            {
               var touch = event.targetTouches[0];
               obj.style.left = touch.pageX-25 + 'px';
               obj.style.top = touch.pageY-25 + 'px';
               event.preventDefault();
               if (typeof atEndDrag =='function')atEndDrag(touch.pageY,touch.pageY);
            }, 
            false);
        }
     }
   } 
}
function dokey(ta,evt)
{
    var e = evt? evt : window.event;
    if(!e) return true;
    var key = 0;
    if (e.keyCode) {key = e.keyCode;} // for moz/fb, if keyCode==0 use 'which'
    else if (typeof(e.which)!= 'undefined') {key = e.which;}
    if (key == 13)
    {
       uploadit();
    }
     
    return true;
}

var onmouseover0  =  ( browserstr.indexOf('MSIE') >-1  )? 
function () 
{
   cx = event.clientX + document.body.scrollLeft;
   cy = event.clientY + document.body.scrollTop;
   if (moving>-1)
   {
      var ds = document.body.getElementsByTagName('div');
      var d = ds[moving];
      var tx = parseInt(d.style.left.replace(/px/i,'')) + (cx-dx);
      var ty = parseInt(d.style.top.replace(/px/i,'')) + (cy-dy);
      d.style.left = tx + 'px';
      d.style.top = ty + 'px';
      dx = cx;
      dy = cy;
   }
   if (mx < cx) mx = cx;
   if (my < cy) my = cy;
}
: function (e) 
{
   cx = e.pageX;
   cy = e.pageY;

   if (moving>-1)
   {
      var ds = document.body.getElementsByTagName('div');
      var d = ds[moving];
      var tx = parseInt(d.style.left.replace(/px/i,'')) + (cx-dx);
      var ty = parseInt(d.style.top.replace(/px/i,'')) + (cy-dy);
      d.style.left = tx + 'px';
      d.style.top = ty + 'px';
      dx = cx;
      dy = cy; 
   }
   if (mx < cx) mx = cx;
   if (my < cy) my = cy;
}
function mktbl(x)
{
    if (x.indexOf("__")>=0 || ! (x.match(/ $/) || x.match(/ ,/)))
    {
        return "<pre class=nogapbetween>" + x + "</pre>";
    }
   
    var cs = x.split(/,/);
    var c = cs.length;
    var r = 3;
    var x = '<table border=1  style=border-collapse:collapse>';
    for (var i=0; i < r; i++)
    {
        x += '<tr height=' + trheight + ' >';
        for (var j=0; j < c; j++)
        {
            var al = '';
            if (cs[j].charAt(0) == ' ' && cs[j].charAt(cs[j].length-1)==' ')
                al = 'center';
            else if (cs[j].charAt(0) == ' ')
                al = 'right';
            else if (cs[j].charAt(cs[j].length-1)==' ')
                al = 'left';
            x += '<td valign=middle align=' + al + '>'+ (i>0?'':cs[j].replace(/ /g,'&nbsp;')) + '</td>';
        }
        x += "</tr>";
    }
    return x + '</table>';
}
var numdeleted = 0;
function updatediv()
{
   var w = document.getElementById('movetxt');
   if (active == false) return false;
   var z = w.value;
   var d = w.parentNode;
   if (!creating)
   {
       var otb = textbefore.indexOf("__") < 0 && (textbefore.match(/ $/) || textbefore.match(/ ,/));
       var ntb = z.indexOf("__") < 0 && (z.match(/ $/) || z.match(/ ,/));
       var ol = textbefore.replace(/[^_]/g,'').length;
       var nl = z.replace(/[^_]/g,'').length;
       if (otb && !ntb || ol>1 && nl < 2)
       {
               z = w.value = textbefore;
               myprompt(textmsg[1643]);
       }
       
   }
   
   

   w.style.width = '0px';
   //w.style.height = '0px';
   document.body.appendChild(w);


   if (creating && z.replace(/[\r|\n| |\t]/g,'') == '')
   {
      document.body.removeChild(d);
   }
   else
   {  
      d.innerHTML =  mktbl(z);
      d.style.zIndex = 3;
      var t = parseInt(d.style.top.replace(/px/,''));
      t +=16;
      d.style.top = t + 'px';
      if (creating==false && d.id==null)
      {
          d.id = 'field' + (MAXN++);
         
      }
      
   }
   hide[d.id] = nowh;
   active = false;
   return true;
}

 
function whichd()
{
   var ds = document.body.getElementsByTagName('div');
   
   var marea = 10000000, tm; 
   var j= -1;
   if (ds == null || ds.length == 0  ) 
       return -1;
   
   for (var i=0; i< ds.length; i++)
   {
       var d = ds[i]
       var x = parseInt(d.style.left.replace(/px/i,''));
       var y = parseInt(d.style.top.replace(/px/i,''));
       var w = d.offsetWidth;
       var h = d.offsetHeight;
       
       if (cx <= x + w && cx >= x &&
           cy <= y + h && cy >= y)
       {
           tm = w*h;
           if (tm < marea)
           {
               j = i;
               cx = x;
               cy = y;
               marea = tm;
           }
       }
   }
    
   return j;
}

var dodiv = function()
{
    updatediv();
    closeprompt();
    deletef();
    var ds = document.body.getElementsByTagName('div');
    var i = whichd();
    var d;
    var z = '';
    
    if (i == -1)
    {
       
       d = document.createElement('div');
       d.className = 'commonlooking';
       d.style.cssText = "position:absolute;top:" + (cy-16) + "px;left:" + cx + "px;z-index:10";
       document.body.appendChild(d);
    }
    else
    {
       d = ds[i];
       z = d.innerHTML;
      
       var z1 = z.replace(/<td[^>]*><.td>/ig,'');
       
       z1 = z1.replace(/<tr[^>]*><.tr>/ig,'');
       
       if (z.length >= z1.length-72)
       {
           z1  = z1.replace(/<.td><td[^>]*>/ig,",");
          
           z1  = z1.replace(/<[^>]+>/g,'');
          
           z1  = z1.replace(/&nbsp;/g, ' ');
           z = z1;
         
       }
       var t = parseInt(d.style.top.replace(/px/,''));
          t -=16;
       d.style.top = t + 'px';
       d.innerHTML = '';
       d.style.zIndex = 10;
    }
     
    tx = cx;
    ty = cy;
    currenti = i;
     
    var y = document.getElementById('movetxt');
    y.value = z;
    textbefore = z;
    butxy[0] = parseInt(d.style.left.replace(/px/,''))+16;
    butxy[1] = parseInt(d.style.top.replace(/px/,''));
    var hidestr = "";
    if (!creating)
    {
         if (hide[d.id]!=null)
         nowh = hide[d.id];  
         else nowh  = false;
    }
    d.innerHTML =  "<table cellspacing=0 cellpadding=0><tr><td width=16><div  style=\"display:block;margin:0px 0px 0px 0px;width:16px !important;height:16px;border-radius:8px;font-size:16px;background-color:#DDCC22;color:#DDCC22;border:1px " + IBGCOLOR +" solid;z-index:3" 
    + ";cursor:move\" id=\"anchor\" onmousedown=\"rec(this,currenti)\"   >" 
    +  "@</div></td><td  class=GreenButton id=helpbutton  style =\"margin:0px 0px 0px 0px;width:60px !important;height:16px;border-radius:3px;font-size:16px;\" align=center>"+ textmsg[17] + "</td><td class=GreenButton id=dstbutton  style =\"margin:0px 0px 0px 0px;width:60px !important;height:16px;border-radius:3px;font-size:16px;\" align=center><nobr>"    
    + textmsg[1583] + "</nobr></td></tr></table>";
     
//+"<input type=button style=\"height:16px;width:70px;background-color:#00BBBB;color:white;border:1px #b0b0b0 outset\" value=\"&arrow;\" onclick=uploadit()></span><br>";
    d.appendChild(y);
    //d.style.backgroundColor=scolor;
    var wd = thispagewidth() - cx - 16;
    if (wd < imagew - cx -16)
        wd = imagew - cx -16;
    if (wd < 20) wd = 20;
    y.style.width = wd + 'px';
    //y.style.height = '25px';
    y.focus();
    active = true;
    /*var dummy = document.getElementById('forheight');
    if (dummy == null)
    {
        dummy = document.createElement('div');
        dummy.id = 'forheight';
        dummy.style.cssText = 'width:400px;height:' + cy + 'px;border:2px red solid;display:block';
        document.body.appendChild(dummy);
        dummy.innerHTML = '';
    }
    else
        dummy.style.height = cy + 'px';
        */
}
var documentonmouseup = function()
{
   var txt = document.getElementById('movetxt');
   if (txt.offsetWidth >410 && cx < txt.offsetWidth && cy < txt.offsetHeight)
   {
      return;
   }
   var d = document.getElementById('dstbutton');
   if (d!=null)
    {
       
        var tx = butxy[0]+60;
        var ty = butxy[1];
        var w = d.offsetWidth;
        var h = d.offsetHeight;
        var b1= (cx >= tx && cx <= tx + w && cy >= ty && cy <= ty + h);
        
        if (b1 ) 
        {
            showeditmenu();
            currenti = -1;
            moving =-1;
            return;
        }
     
    }
   d = document.getElementById('helpbutton');
   if (d!=null)
    {
       
        var tx = butxy[0];
        var ty = butxy[1];
        var w = d.offsetWidth;
        var h = d.offsetHeight;
        var b1= (cx >= tx && cx <= tx + w && cy >= ty && cy <= ty + h);
        
        if (b1 ) 
        {
            var twotbl = parent.frames[0].document.getElementById('example');
            
            var vv = '';
            if (twotbl!=null) 
            {
                var c = twotbl.rows[0].insertCell(1);
                c.innerHTML = '&rarr;<br><br><br>&rarr;<br><br><br>&rarr;<br><br><br>&rarr;<br><br><br>&rarr;<br><br><br>&rarr;<br><br><br>';
                vv = twotbl.outerHTML;
                parent.frames[2].myprompt("<img src=image/guide1.gif height=60 style=\"float:left\">" + textmsg[1578].replace(/\n/g,'<br>')+vv,null,null,textmsg[191]); 
                parent.frames[2].promptwin.style.left = '5px'
                parent.frames[2].promptwin.style.top = '5px'
            }
            currenti = -1;
            moving =-1;
            return;
        }
     
    }
   if (currenti>-1)
   {
        var ds = document.body.getElementsByTagName('div');
        d = ds[currenti];
        if (d!=null)
        {
        var tx = parseInt(d.style.left.replace(/px/i,''));
        var ty = parseInt(d.style.top.replace(/px/i,''));
        var w = d.offsetWidth;
        var h = d.offsetHeight;
        var b1= (cx >= tx && cx <= tx + w && cy >= ty && cy <= ty + h);
        var b2= (cx >= tx && cx <= tx + 16 && cy >= ty && cy <= ty + 16);
        moving = -1;
        if (b1 && !b2) return; 
        }
   }
   
   
   if (moving>-1)
   {
      moving = -1;
      txt.focus();
   }
   else     
      dodiv();
}

function namesel(v,a,b,j)
{
    var x = "<select onchange=\"chgstylevalue(" + j + ",this)\">";
    var k = -1;
    for (var i=a; i <=b; i++)
    {
        x += "<option value=" + i;
        if (v == i) 
        {
            x += " selected ";
            k = i;
        }
        x += " >" + i + "px</option>";
    }
    if (k == -1)
        x += "<option value=" + v  +">" + v + "</option>";
    x += "</select>";
     return x;
}

function namesel1(j,v,y,u)
{
    var x = "<select onchange=\"chgstylevalue1(" + j + ",this)\">";
    var k = -1;
    for (var i=0; i < y.length; i++)
    {
        if (u == null)
        {
            x += "<option value=\"" + y[i] + "\" ";
            if (y[i].toLowerCase().indexOf(v.toLowerCase()) >= 0) 
            {
                x += " selected ";
                k = i;
            }
            x += " >" + y[i].replace(/,.*/,'') + "</option>";
        }
        else
        {
            if (u[i] == null) u[i] = y[i];
            x += "<option value=\"" + u[i] + "\" ";
            if (u[i].toLowerCase().indexOf(v.toLowerCase()) >= 0) 
            {
                x += " selected ";
                k = i;
            }
            x += " >" + y[i].replace(/,.*/,'') + "</option>";
        }
    }
    if (k == -1)
    {
        x += "<option value=\"" +v + "\" selected>" + v + "</option>";
    }
    x += "</select>";
    return x;
}
function chgcolorvalue(j,sel)
{
    var v = sel.options[sel.selectedIndex].value;
    if (v == 'inherit' || v == 'transparent')
    { 
        style[j] = style[j].replace(/#....../g,  v).replace(/transparent/,  v).replace(/inherit/,  v);
        var y = document.getElementById('movetxt');
        //['2px','1px #b0b0b0 solid','transparent','#000000','arial','16px','bold','2px','#b0b0b0 2px 2px'];
        y.style.fontFamily = style[4];
        y.style.fontSize = style[5];
        
        y.style.fontWeight = style[6];
        applyto();
        sel.nextSibling.style.visibility = 'hidden';
    }
    else
    {
        sel.nextSibling.style.visibility = 'visible';
    }
}
function makecol(v,j)
{
    var x = "<select onchange=\"chgcolorvalue(" + j + ",this)\">";
    var y = textmsg[1642].split(/@/);
    var u = ['transparent','inherit','select'];
    var k = -1;
    y[2] += "&rarr;"
    for (var i=0; i < y.length; i++)
    {
        x += "<option value=\"" + u[i] + "\" ";
        if (u[i].toLowerCase().indexOf(v.toLowerCase()) >= 0 || i==2&&v!=u[0]&&v!=u[1]) 
        { 
            x += " selected ";
            k = i;
        }
        x += " >" + y[i]  + "</option>";
    }
    x+=  "</select>";
    if (k==2)
       x += "<input type=color style=visibility:visible value=\"" + v + "\" onchange=chgcolorfor(" + j + ",this)>";
    else 
       x += "<input type=color  style=visibility:hidden onchange=chgcolorfor(" + j + ",this)>";
    return x;
}
function docheck(ck)
{
   nowh = ck.checked;
}
function applyto()
{
    //
    var st = ".commonlooking{padding:" + style[0] + ";border:"  + style[1] + ";background-color:" + style[2] 
       + ";color:" + style[3] + ";font-family:" + style[4] + ";font-size:" +  style[5] 
       + ";font-weight:" + style[6] + ";borde-radius:" + style[7]  + ";text-shadow:" + style[8] +   "}";
    var z = document.getElementById('dst');
    z.innerHTML = st;
    var x = document.body.getElementsByTagName('div');
    for (var i=0; i < x.length; i++)
   {
       if (x[i]==promptwin || x[i].className!='commonlooking')continue;
       x[i].style.padding = style[0];
       x[i].style.border = style[1];
       x[i].style.backgroundColor = style[2];
       x[i].style.color = style[3];
       x[i].style.fontFamily = style[4];
       x[i].style.fontSize = style[5];
       x[i].style.fontWeight = style[6];
       x[i].style.borderRadisu = style[7];
       x[i].style.textShadow = style[8];
   }
   trheight = 8 + parseInt(''+style[5].replace(/px/,''));
   document.onmousemove = onmouseover0; 
}
function chgcolorfor(j,sel)
{
    var v = sel.value;
    style[j] = style[j].replace(/#....../g,  v).replace(/transparent/,  v).replace(/inherit/,  v);
    var y = document.getElementById('movetxt');
    //['2px','1px #b0b0b0 solid','transparent','#000000','arial','16px','bold','2px','#b0b0b0 2px 2px'];
    y.style.fontFamily = style[4];
    y.style.fontSize = style[5];
    y.style.fontWeight = style[6];
   // y.style.color = style[3];
    applyto();
}
function chgstylevalue1(j,sel)
{
    var k = sel.options[sel.selectedIndex].value;
    style[j] = style[j].replace(/[^ ]+$/g,  k );
    var y = document.getElementById('movetxt');
    y.style.fontFamily = style[4];
    y.style.fontSize = style[5];
    y.style.fontWeight = style[6];
   // y.style.color = style[3];
    applyto();
}

function chgstylevalue(j,sel)
{
    var k = sel.options[sel.selectedIndex].value;
    style[j] = style[j].replace(/[0-9]+px/g,  k + 'px');
    var y = document.getElementById('movetxt');
    y.style.fontFamily = style[4];
    y.style.fontSize = style[5];
    y.style.fontWeight = style[6];
    
    applyto();
}
 
function showeditmenu()
{
   moving = -1;
   dx = cx;
   dy = cy;
   
   var xs = textmsg[1639].split(/@/); //Padding,Border,Background,Color,Font name,Font size,Font weight,Border radius,Text shadow
   
   var x = "<table><tr><td>" + xs[0] + "</td><td>"+ namesel(parseInt(style[0].replace(/px/,'')),0,15,0) + "</td></tr>" 
           + "<tr><td>" + xs[1] + "</td><td>"
           + namesel(parseInt(style[1].replace(/px.*/,'')),0,5,1) + '&nbsp;'  
           + makecol(style[1].replace(/.*(#......).*/,'$1'),1)    + '&nbsp;' 
           + namesel1(1,style[1].replace(/.*([^ ]+)$/,'$1'),textmsg[1640].split(/@/),['solid','outset','inset']) + "</td></tr>" 
           + "<tr><td>" + xs[2] + "</td><td>"+ makecol(style[2].replace(/.*(#......).*/,'$1'),2)    + "</td></tr>" 
           + "<tr><td>" + xs[3] + "</td><td>"+ makecol(style[3].replace(/.*(#......).*/,'$1'),3)    + "</td></tr>" 
           + "<tr><td>" + xs[4] + "</td><td>" + namesel1(4,style[4].replace(/.*([^ ]+)$/,'$1'),textmsg[1594].split(/@/)) + "</td></tr>" 
           + "<tr><td>" + xs[5] + "</td><td>"+ namesel(parseInt(style[5].replace(/px.*/,'')),8,34,5) + "</td></tr>" 
           + "<tr><td>" + xs[6] + "</td><td>" + namesel1(6,style[6],textmsg[1641].split(/@/),['Normal','Bold']) + "</td></tr>" 
           + "<tr><td>" + xs[7] + "</td><td>"+ namesel(parseInt(style[7].replace(/px.*/,'')),0,10,7) + "</td></tr>"
           + "<tr><td>" + xs[8] + "</td><td>"+ makecol(style[8].replace(/.*(#......).*/,'$1'),8)  + '&nbsp;'  
           + namesel(parseInt(style[8].replace(/px.*/,'')),0,4,8)  
           + "</td></tr><tr><td>" + textmsg[732] + "</td><td><input type=checkbox "+ (nowh?'checked':'')  + ' onclick=docheck(this) >'  
           + "</td></tr></table>"
    myprompt(x,null,null,textmsg[1583]);
    promptwin.style.left = cx;
    promptwin.style.top = cy;
    document.onmouseup = null;
    document.onmousemove = null;
    promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].onclick
    = function()
   { 
       document.onmousemove = onmouseover0;
       document.onmouseup = documentonmouseup;
       closeprompt();
   }
} 


function rec(an,i)
{
   moving = i;
   dx = cx;
   dy = cy;
} 
function erec(an,i)
{
   moving = -1;
   dx = cx;
   dy = cy;
} 
function sortby(i,j){return i-j;} 
function topi(b){return parseInt(b.style.top.replace(/px/,''));}
function lefti(b){return parseInt(b.style.left.replace(/px/,''));}
var XS;
function uploadit()
{
   updatediv();
   closeprompt();
   var s = 'width:' + imagew + 'px;height:' + imageh + "px";
   var xx = document.getElementsByTagName('head')[0].innerHTML;
   var qw = document.getElementById('dst');
   var z = '<!DOCTYPE html>\n<html>\n<head>' + xx + "<style>.nogapbetween{margin:0px 0px 0px 0px;padding: 0px 0px 0px 0px;font-family:inherit;font-size:inherit;font-weight:inherit}\n.basediv{position:absolute;background-image:" + document.body.style.backgroundImage + ";" + s + "}\n" + qw.innerHTML + "</style></head>\n<body style=\"margin:0px 0px 0px 0px\"><div class=basediv>\n";
   XS = document.body.getElementsByTagName('div'); 
   var p = []; 
   for (var j=0; j < XS.length; j++) p[j] = j;
   if (creating) 
   {
       sortby = function(i,j)
       {
           if (topi(XS[i]) - topi(XS[j]) > 5) return 1;
           if (topi(XS[i]) - topi(XS[j]) < -5) return -1; 
           if (lefti(XS[i]) - lefti(XS[j]) > 5) return 1; 
           if (lefti(XS[i]) - lefti(XS[j]) < -5) return -1;
           return i - j; 
       }
   }
   else
   {
        sortby = function(i,j)
        {
            return parseInt(XS[i].id.replace(/field/,'')) - parseInt(XS[j].id.replace(/field/,''));
        }
   }
   p.sort(sortby);
   var x = [];
   for (j=0; j < XS.length; j++) x[j] = XS[p[j]];
   
   var n = 0;
   var max = 0, hmax = 0;
   for (var i=0; i < x.length; i++)
   {
      if (x[i] == promptwin) continue;
      var t = "position:absolute;left:" + x[i].style.left + ";top:" + x[i].style.top + ";z-index:" + ((typeof(x[i].style.zIndex)=='undefined')?'3':x[i].style.zIndex);
      if (hide[x[i].id] != null && hide[x[i].id] == true)
          t += ";visibility:hidden";
      
      var y = x[i].outerHTML.replace(/style[ ]*=[ ]*"[^"]+"/,'style="' + t  +'"');
      
      if (creating) y = y.replace(/<div /, '<div id="field' + i + '" ');
      z += y;
     
      var w = x[i].offsetWidth + parseInt(x[i].style.left.replace(/px/,''));
      var h0 = x[i].offsetHeight;
      if ((y.indexOf('[___')>= 0 && y.indexOf('___]')>= 0 )&& h0 < 100) 
          h0 = 100;
      if ((y.indexOf('<table ')>= 0 && y.indexOf('</table>')>= 0 )&& h0 < 150) 
          h0 = 150;
      var h = h0 + parseInt(x[i].style.top.replace(/px/,''));
      if (w > max) max = w;
      if (h > hmax) hmax = h;
      n++;
   }
   
   hmax += 20;
   if (hmax < my) hmax = my;
   z += "<table style=\"position:absolute;top:" + (hmax) + "px;left:" + (max/2) + "px\" align=center><tr><td id=addedsubbutton ></td></tr></table>";
   z += "</div></body>\n</html>";
   currenti = -1;
   var f = document.getElementById("subf");
   if (f == null)
   {
       f = document.createElement("form");
       f.id = 'subf';
       f.name = 'f';
       document.body.appendChild(f);
   }
   formnewaction( f, 'wordform.jsp?' + (new Date()).getTime());
   f.method= 'POST';
   f.target = convertpage(); 
   f.innerHTML = "<input type=hidden name=filedir value=" + parent.parent.frames[0].tellrdap() + ">"
    + "<input type=hidden name=folder value=\"\" >"
    + "<input type=hidden name=operation value=\"\" >"
    + "<textarea rows=5 cols=70 style=visibility:hidden name=\"destination\" >" + z + "</textarea>";
  visual(f);
 f.submit();
}

function enableclick()
{
   // parent.frames[2].document.write("<br><br>" + textmsg[191] + textmsg[1578].replace(/\n/g,'<br>'));
    document.onmousemove = onmouseover0;
    document.onmouseup = documentonmouseup;
    var vv = '';
    var twotbl = parent.frames[0].document.getElementById('example');
    if (twotbl!=null)
    {
    var c = twotbl.rows[0].insertCell(1);
    c.innerHTML = '&rarr;<br><br><br>&rarr;<br><br><br>&rarr;<br><br><br>&rarr;<br><br><br>&rarr;<br><br><br>&rarr;<br><br><br>';
    vv = twotbl.outerHTML;
    }
    
    var headstr = document.getElementById('dst').innerHTML;
    var jjj = headstr.indexOf('.commonlooking{');
    var y = document.getElementById('movetxt');
    if (jjj>=0)
    {
        headstr = headstr.substring(jjj + 15).replace(/[;]?}.*/,'');
      
        var arrheadstr = headstr.split(/;/);
        for (jjj=0; jjj < arrheadstr.length; jjj++)
        {
            style[jjj] = arrheadstr[jjj].replace(/[^:]+:/,'');
            if (arrheadstr[jjj].toLowerCase().indexOf("padding")>=0)
               y.style.padding = arrheadstr[jjj].replace(/[^:]+:/,''); 
            else if (arrheadstr[jjj].toLowerCase().indexOf("font-family")>=0)
               y.style.fontFamily = arrheadstr[jjj].replace(/[^:]+:/,''); 
            else if (arrheadstr[jjj].toLowerCase().indexOf("font-size")>=0)
               y.style.fontSize = arrheadstr[jjj].replace(/[^:]+:/,''); 
            else if (arrheadstr[jjj].toLowerCase().indexOf("font-weight")>=0)
               y.style.fontWeight = arrheadstr[jjj].replace(/[^:]+:/,''); 

        }
    }
    var vs = document.getElementsByTagName('div');
    if (vs!=null && (NN = vs.length) > 0) 
    {  
        creating = false;
        for (var j=0; j < NN; j++)
        {
            var lenj = vs[j].innerHTML.replace(/[^_]/g,'').length;
            MAXN = (MAXN > lenj)? MAXN:lenj; 
            hide[vs[j].id] = (vs[j].style.visibility == 'hidden');
            vs[j].style.visibility = 'visible';
        }
        
    }
    if (1==2 && parent.frames[2]!=null && typeof(parent.frames[2].myprompt) != 'unefined')
    {
        parent.frames[2].myprompt("<img src=image/guide1.gif height=60 style=\"float:left\">" + textmsg[1578].replace(/\n/g,'<br>')  + vv,null,null,textmsg[191]); 
        parent.frames[2].promptwin.style.left = '5px'
        parent.frames[2].promptwin.style.top = '5px'
    }
}
function disablec()
{
    document.onmousemove = null;
}
function deletef()
{
    var f = document.getElementById('subf');
    if (f != null)
    document.body.removeChild(document.f);
}

function convertpage()
{
   if ( parent.frames.length==3 
       && parent.frames[1]==self  
       && parent.parent.frames.length==2) 
       return parent.frames[2].name;
   return null;
}

function confirm()
{
    myprompt("<img src=image/guide1.gif height=60 style=\"float:left\">" + textmsg[1577],null,"if(v)enableclick1();else goback();",textmsg[191]);
}
function enableclick1()
{
    //myprompt("<img src=image/guide1.gif height=60 style=\"float:left\">" + textmsg[1578].replace(/\n/g,'<br>'),null,"if(v)enableclick();else goback();",textmsg[191]); 
    promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[2].cells[0].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('input')[0].value = textmsg[450];
    promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[2].cells[0].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('input')[1].value = textmsg[18];
}
function goback()
{
    parent.parent.frames[0].closeprompt();
    parent.document.location.href = 'wordfmsp.jsp?numfrms=2&rdap='+rdap;
}

var onloadbeforewfdjs = null;
if (typeof window.onload == 'function')
   onloadbeforewfdjs = window.onload;
window.onload = function()
{
    if (onloadbeforewfdjs!=null)onloadbeforewfdjs();
    if (document.body.getElementsByTagName('div') == null)
       confirm();
    else
       enableclick(); 
    
}

var mini = parent.parent.parent.frames[0].minimizeit();
 
         
for (var i=0; i < fieldinfo.length; i++)
{
    var top1 = fieldinfo[i][2];
    var bot = fieldinfo[i][3];
    var left = fieldinfo[i][0];
    var right = fieldinfo[i][1];
    var width = right - left;
    var height = bot - top1;
    var ratio = height/width;
    var bars = "";
    for (var k=0; k < width/8; k++)
        bars += "_";
    var dv = document.createElement('div');
    dv.className = "commonlooking";
    dv.style.cssText = "position:absolute;top:" + top1 + "px;left:" + left + "px;z-index:3;width:" + width + "px;height:" + height + "px";
    if (height>40)
        dv.innerHTML = "<pre class=\"nogapbetween\">[" + bars + "]</pre>";
    else if ( ratio > 0.8 && ratio < 1.25 && width < 30)
        dv.innerHTML = "<pre class=\"nogapbetween\" style=background-color:white>__</pre>";
    else 
        dv.innerHTML = "<pre class=\"nogapbetween\">" + bars + "</pre>";
    document.body.appendChild(dv);
     
}

