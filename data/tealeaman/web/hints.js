if (typeof font_size=='undefined') var font_size = 16;
document.write("<div id=\"theelehint\"   style=\"position:absolute;visibility:hidden;top:0px;left:0px;width:200px;height:" + font_size*1.4 +"px;text-align:left;z-index:100\" onclick=\"hidemyhint()\">hint</div>");
var myHintx = 0;
var myHinty = 0;
var myHintdiv = document.getElementById("theelehint");

  
document.onmousemove  =  (browserstr.indexOf('MSIE')>-1)? 
function () 
{
   myHintx = event.clientX + document.body.scrollLeft;
   myHinty = event.clientY + document.body.scrollTop;
   
}
: function (e) 
{
   myHintx = e.pageX;
   myHinty = e.pageY;
    
}
 
  
function myHintMove()
{
    if (myHintdiv == null) return;
 var x = myHintx;
 var y = myHinty;
 var wd = 250;
 if (browserstr.indexOf('MSIE')>-1) 
 {
 wd = document.body.offsetWidth - 30;
 }
 else 
 {
 wd = self.innerWidth - 30;
 }
 
 var y1 =   0;
 if (typeof myHintdiv.offsetHeight !='undefined')
 y1 = myHintdiv.offsetHeight;
 else
 y1 = myHintdiv.scrollHeight;

 if (y < 150)
 y += 10;
 else 
 y -= 30 + y1;
 var x1 = 0;
 if (typeof myHintdiv.offsetWidth !='undefined')
   x1 = myHintdiv.offsetWidth;
else
   x1 = myHintdiv.scrollWidth;
 if (x1 > wd) 
 {
   myHintdiv.style.width = "" + wd + "px";
   x1 = wd;
 }
 if (x1 > wd - x)
 x = wd - x1;
 myHintdiv.style.left = "" + x +"px";
 myHintdiv.style.top = "" + y + "px";
 
} 
var normaltimedelay =1500;
  
var showmyhintstr = function (str, imm)
{
  if (str == null || myHintdiv ==null) return;
  if (imm!=null)
  {
     if (typeof str =='undefined' || str==null) return;
     if (str.indexOf("http")==0 || str.length < 25)
     myHintdiv.style.width = "100px";
     else if(str.length < 40)
     myHintdiv.style.width = "200px";
     else myHintdiv.style.width = "400px";
     myHintdiv.innerHTML = round1() +  "<div class=thehint style=border-radius:4px;>" + str +"</div>" +  round2;
     myHintMove();
     myHintdiv.style.visibility='visible';
  }
  else
  {
      if(showmyhinttimer !=null)
      {
          clearTimeout(showmyhinttimer);
          showmyhinttimer = null;
      }
      showmyhinttimer = setTimeout('showmyhintstr("' + str.replace(/"/g,'\\"').replace(/\n/g,'\\n') + '",1)', normaltimedelay);
  }
 
}

if (typeof showmyhint == 'undefined')
{
 var showmyhint = function (j,imm,tdorder){}
 var showmyhintimm = function (){}
 var hidemyhint = function (){}
 var showmyhintgoahead = true;
 var showmyhintitemorder = 0;
 var showmyhinttimer = null;
}
 
function Draganchor()
{
    var dv = document.createElement("div");
    dv.style.cssText = "position:absolute;visibility:hidden;cursor:e-resize;z-index:10;left:0px;top:0px;width:2px;height:" + (font_size + 6) + 'px;background-color:#909090;border:0px';
    dv.innerHTML = "<!--0,0,0,0-->";
    dv.id = "draganchor";
    document.body.appendChild(dv);
    this.did = false;
    this.dv = dv;
    if (typeof(Drag) != 'undefined')
    {
        Drag.init(dv);
    }
    dv.onDragStart = function(x,y)
    {
        var maintbl = document.getElementById("maintable");
        var j = Draganchor.status[0];
        
        var xpos = x;
        var width1 =  maintbl.rows[Draganchor.status[4]].cells[j].offsetWidth;
        var width2 = 0;
        if (j <  maintbl.rows[Draganchor.status[4]].cells.length-1)
        {
            width2 =  maintbl.rows[Draganchor.status[4]].cells[j+1].offsetWidth;
            Draganchor.savedfun[j] =  ('' +  maintbl.rows[Draganchor.status[4]].cells[j+1].onmouseover).replace(/^[^0-9]+/,'').replace(/[^0-9]*$/,'');
            maintbl.rows[Draganchor.status[4]].cells[j+1].onmouseover = null;
        }
        Draganchor.status[1] = xpos;
        Draganchor.status[2] = width1;
        Draganchor.status[3] = width2; 
        Draganchor.savedclick[j] =  ('' +  maintbl.rows[Draganchor.status[4]].cells[j].onclick).replace(/^[^0-9]+/,'').replace(/[^0-9]*$/,'');
        maintbl.rows[Draganchor.status[4]].cells[j].onclick = null;
    }

    dv.onDragEnd =   function(x,y)
    {
         
        var maintbl = document.getElementById("maintable");
        var j = Draganchor.status[0];
        var xpos = Draganchor.status[1];
        var width1 = Draganchor.status[2];
        var width2 = Draganchor.status[3];
        x -= xpos;
        if (j == maintbl.rows[Draganchor.status[4]].cells.length-1)
        {
            maintbl.style.width = (maintbl.offsetWidth+x) + 'px';
        }
        if (x > 0) 
        { 
            if (j < maintbl.rows[Draganchor.status[4]].cells.length-1)
            { 
                Draganchor.resizetd(maintbl, j+1, width2-x);
            }
            Draganchor.resizetd(maintbl, j, width1+x);
             
        }
        else
        {
            Draganchor.resizetd(maintbl, j, width1+x);
            if (j < maintbl.rows[Draganchor.status[4]].cells.length-1)
            { 
               Draganchor.resizetd(maintbl, j+1, width2-x);
            }
        }
        this.style.visibility = 'hidden';
        if (j < maintbl.rows[Draganchor.status[4]].cells.length-1)
        {
            maintbl.rows[Draganchor.status[4]].cells[j+1].onmouseover = function (){eval('showmyhint(' + Draganchor.savedfun[j]+ ')');};
        }
        maintbl.rows[Draganchor.status[4]].cells[j].onclick = function (){eval('sort(' + Draganchor.savedclick[j]+ ')');};
    }
    this.associte = function (j)
    {
        var dv = document.getElementById("draganchor");
        if (this.did == false)
        {
            this.did = true;
        }
        Draganchor.status[0] = j;
        var maintbl = document.getElementById("maintable");
         
        if (typeof(findPositionnoScrolling) != 'undefined')
        {
            var l = Draganchor.status[4];
            if (l < maintbl.rows.length)
            {
                var xy = findPositionnoScrolling(maintbl.rows[l].cells[j]);
                dv.style.visibility = 'visible';
                dv.style.left = (xy[0] + maintbl.rows[l].cells[j].offsetWidth) + 'px';
                dv.style.top  = (xy[1]) + 'px';
            }
        }
        this.j = j;
    }
    this.j = -1;
}
Draganchor.status = [0,0,0,0,1]; 
Draganchor.savedfun = new Array();
Draganchor.savedclick = new Array();
Draganchor.resizetd = function(maintbl, j, wx)
{
    if (wx>0)
    for (var i=maintbl.rows.length-1; i>=0; i--)
    {
                    if (maintbl.rows[i].cells[j].childNodes.length>0 
                       && maintbl.rows[i].cells[j].childNodes[0].tagName.toLowerCase()=='input'
                       && (maintbl.rows[i].cells[j].childNodes[0].type.toLowerCase()=='text' ||
                           maintbl.rows[i].cells[j].childNodes[0].type.toLowerCase()==''))
                    {
                        maintbl.rows[i].cells[j].childNodes[0].style.width = (wx -2) + 'px';
                    }
                    else if (maintbl.rows[i].cells[j].childNodes.length>0 
                       && maintbl.rows[i].cells[j].childNodes[0].tagName.toLowerCase()=='textarea'
                       )
                    {
                        maintbl.rows[i].cells[j].childNodes[0].style.width = (wx -2) + 'px';
                    }
                    maintbl.rows[i].cells[j].style.width = (wx) + 'px';
     }
}
 
var resizeanchor = null;
function maketheanchor()
{ 
 
if ( typeof(datapresentformat)!='undefined'  && datapresentformat =="DataTable"  )
{ 
    Draganchor.status[4] = 1;
    resizeanchor =  new  Draganchor();
     
}
else if (typeof(datapresentformat)!='undefined' && datapresentformat =="DataHTML")
{ 
    Draganchor.status[4] = 0;
    resizeanchor =  new  Draganchor();
}
}
var onloadbeforehints = null;
if (typeof(window.onload)!='undefined' && window.onload !=null)
{
    onloadbeforehints = window.onload;
}
window.onload  = function()
{
   if (onloadbeforehints!=null)
       onloadbeforehints(); 
        maketheanchor();
}
 
showmyhint = function (j,imm, tdorder)
{
 if (resizeanchor!=null && resizeanchor.j!=tdorder && tdorder!=null && typeof(datapresentformat)!='undefined' && (
  datapresentformat =="DataTable" || datapresentformat =="DataHTML"))
 { 
     resizeanchor.associte(tdorder);
 }
 showmyhintgoahead = true;
 showmyhintitemorder = j;
 if(imm!=null)
 showmyhintimm() ;
 else
 {
      if(showmyhinttimer !=null)
      {
         clearTimeout(showmyhinttimer);
          showmyhinttimer = null;
      }
      showmyhinttimer = setTimeout(showmyhintimm , 1500);
 }
}

showmyhintimm = function ()
{
 if (showmyhintgoahead && typeof hints!='undefined' && myHintdiv!=null && myHintdiv.style.visibility=='hidden')
 {
 showmyhintstr(hints[showmyhintitemorder],1);
 }
}

hidemyhint = function ()
{
 showmyhintgoahead = false;
 if(showmyhinttimer !=null)
 {
 clearTimeout(showmyhinttimer);
 showmyhinttimer = null;
 }
 if (myHintdiv != null)
 {
 myHintdiv.style.visibility='hidden';
 myHintdiv.style.width = "100px";
 myHintdiv.innerHTML = "";
 }
}

