


function changeFlag(scid,doitnow)
{
   if (scid==null || scid=='') return;
   if (doitnow==false && parent!=window && parent.opener!=null&& onmydomain(parent.opener) &&
       typeof (parent.opener.setCourseGoing) !='undefined')
       parent.opener.setCourseGoing(scid);

   var arrows = document.images;
   var ls = "";
   for (var r=0; r < arrows.length; r++)
   {
      if ( ("" + arrows[r].src).indexOf('image/tri.gif') >= 0)
      {
        var myparent = arrows[r].parentNode.nextSibling;
        if (myparent == null) continue;
        var str = myparent.innerHTML;
        if (str == null) continue;
        if ( str.indexOf(scid)>=0)
        {

         arrows[r].src = ("" + arrows[r].src).replace("tri.gif", "yellowtri.gif");
         var jj = 0, l;
         if (doitnow &&  (jj = str.indexOf("invoke('" + scid +"'")) > 0)
         {
            l = str.indexOf(")",jj);
            ls = str.substring(jj,l+1);
         }
        }
      }
      else if ( ("" + arrows[r].src).indexOf('image/yellowtri.gif') >= 0)
      {
        myparent = arrows[r].parentNode.nextSibling;
        str = myparent.innerHTML;

        if (str.indexOf(scid)<0)
        {
         arrows[r].src = ("" + arrows[r].src).replace("yellowtri.gif","tri.gif");
        }
      }
   }
   if (ls=='' && typeof  document.form1 != 'undefined'
       && typeof document.form1.course != 'undefined'
       && typeof changeiid != 'undefined')
      ls = "for (var i=0; i < document.form1.course.options.length;i++) if (document.form1.course.options[i].value=='"
      + scid +"'){document.form1.course.selectedIndex = i;changeiid();break;}";

   if (ls!="")eval(ls);
}
document.write("<style>.img-shadow {float:left;background: url(image/trans-shadow.png) no-repeat bottom right;}\n");
document.write(".img-shadow img {display: block;  position: relative;  padding: 5px; background-color: #fff;  border: 1px solid #cecece; margin: -6px 6px 6px -6px;}");
document.write("#floater1Div {position:absolute;left:200px;top:500px;visibility:hidden;}</style>");
document.write("<div class=outset id=floater1Div>");
document.write("<img src=image/float.png style=cursor:pointer onmousedrag=dragto(event) onclick=movedown(event)>");
document.write("</div>");
if (self.name != 'searchwn')
document.write("<div id=\"minimizer\"   style=\"z-index:30;text-align:center;padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;background:url(image/toleft.jpg);color:#eee;width:26px;height:26px;font-size:18px;position:absolute;top:6px;left:200px;font-weight:700;1px #445577 solid;cursor:pointer\"> </div>");


var floater1 = document.getElementById("floater1Div");
 
var minimizer = document.getElementById("minimizer");

function findPositionWithScrolling( oElement )
{
  if( typeof( oElement.offsetParent ) != 'undefined' )
  {
    var originalElement = oElement;
    for( var  posY = 0; oElement; oElement = oElement.offsetParent )
    {
      posY += oElement.offsetTop;
      if( oElement != originalElement && oElement != document.body && oElement != document.documentElement )
      {
          posY -= oElement.scrollTop;
      }
    }
    return  posY;
  }
  else
  {
    return  oElement.y;
  }
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
    var Y = findPositionWithScrolling(floater1);
    var aa = document.getElementById('minimizer');
    var j = posy -  Y;
    if (j <  15)
    {
       window.scrollBy(0,-60);
       floater1.style.top = (Y - 60) + 'px';
       var y = parseInt(aa.style.top.replace(/px/,'')) - 60;
       if (y < 4) y = 4;
       aa.style.top = y + 'px';
       
    }
    else if (j > 15)
    {
       window.scrollBy(0,60);
       floater1.style.top = (Y + 60) + 'px';
       var y = parseInt(aa.style.top.replace(/px/,'')) + 60;
       aa.style.top = y + 'px';
    }

}


function showupdown()
{
   if (ismobile()) return;
   var cpright = document.getElementById('cpright');
   if (cpright==null) return;
   var ht = 500;
   if (typeof(findPositionWithScrolling)!= 'undefined')
       ht =   findPositionWithScrolling(cpright);

   ht += 30;
   if (floater1==null) return;
   var het = thispageheight();

   if (document.images['trademark']!=null)
       ht += document.images['trademark'].height;

   if (ht  > het)
   {
       floater1.style.visibility = 'visible';
       floater1.style.left = (thispagewidth() - 30) + 'px';
       floater1.style.top = (thispageheight() - 60) + 'px';
   }
   else
   {
       floater1.style.visibility = 'hidden';
   }
   window.scrollTo(0,0);
    
}
 
var horizonpos = 0;
function initanchor()
{
    Drag.init(minimizer);
    minimizer.onDragStart = function(x,y)
    {
        horizonpos = x;
    }
    minimizer.onclick = minimizeit;
    minimizer.onDragEnd =   function(x,y)
    {
        if (horizonpos == x)
           minimizeit();
        else
           parent.document.body.cols =  (x + 20) +  ",*";
    }
}

function doit1st()
{
   if (self.name == 'searchwn')
   {
        if (typeof(parent.loadediframe)!='undefined')
            parent.loadediframe(window);
         
        return;
   }
   showupdown();
   fitmenu();
   initanchor();
   var onresizebeforefloat;
   if(typeof window.onresize == 'function')
   {
    onresizebeforefloat = window.onresize;
    window.onresize = function()
    {
       onresizebeforefloat();
       showupdown();
    };
   }
   else
   {
    window.onresize = function()
    {
      showupdown();

    };
   }

   if (parent!=window)
   {
       if(parent.opener!=null && typeof(changeiid) == 'undefined' && typeof parent.opener.getCourseGoing !='undefined')
       {
          var activcoure = parent.opener.getCourseGoing();
          changeFlag(activcoure,true);
       }
   }
   document.body.style.margin = "6px -6px 0px 6ppx";
}

function minimizeit(dv)
{
    if (newonright() == false)
        return;
    //document.body.removeChild(minimizer);
    minimizer.style.left = '0px';
    parent.document.body.cols =   "1,*";
    
}
function enlargeit()
{
    var rightside = getright();
    if (rightside!=null)
    {
        parent.document.body.cols = fitl + ",*";
        minimizer.style.left =  (fitl-20) +  'px';
        var dv = rightside.getElementById("minimizer1");
        dv.style.visibility = 'hidden';
        //rightside.body.removeChild(dv);
         
        //newaminimizer(fitl-20);
        //initanchor();
    }
}

function getright()
{
    var rightside = null;
   if (typeof(parent.frames[1]) != 'undefined' && parent.frames[1]!= null && typeof(parent.frames[1].document) != 'undefined' )
   {
       rightside = parent.frames[1].document;
       
   }
   var i = -1;
   if (rightside == null || typeof(rightside.body) == 'undefined' || rightside.body == null || typeof(rightside.body.appendChild) == 'undefined'
         || (i=rightside.body.innerHTML.toLowerCase().indexOf("<frame ")) >= 0 && rightside.body.innerHTML.toLowerCase().indexOf("<frame ",i)>=0 )
   {
       rightside = parent.frames[1].frames[0].document;
       
   }
   return rightside;
}
function newonright()
{

   var rightside = getright();
    
   if (rightside== null)
      return false;
   
   var dv = rightside.getElementById('minimizer1');
   if (dv==null) { dv = rightside.createElement("div");
   dv.style.cssText = "z-index:30;text-align:center;padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;background:url(image/toright.jpg);color:#eee;width:26px;height:26px;font-size:18px;font-family:arial;position:absolute;top:6px;left:0px;font-weight:700;1px #445577 solid;cursor:pointer";
   dv.id="minimizer1";
   dv.onclick = function(){if (typeof(parent.frames[0].enlargeit)!='undefined') parent.frames[0].enlargeit(); else{parent.parent.frames[0].enlargeit();}}
   dv.innerHTML = '  ';
   rightside.body.appendChild(dv);
   }
   else dv.style.visibility = 'visible';
   return true;
   
}


var NN = 0;
var fitl = 300;
function fitmenu()
{
   var l0 = (new Date()).getTime();
   fitl = 300; 
   parent.document.body.cols =   fitl +  ",*";
   minimizer.style.left = '150px';
   var diff = document.body.scrollWidth - document.body.offsetWidth;
   while (NN++  < 100)
   {
       var dif = document.body.scrollWidth - document.body.offsetWidth;
      
       if  (Math.abs(diff - dif) <2)
       {
           parent.document.body.cols =   fitl +  ",*";
           fitl--;
       }
       else  
       {
           parent.document.body.cols =   ( 13+fitl) +  ",*";
           break;
       }
       
   }
   
  
   minimizer.style.left = (fitl-12) + 'px';
}

function newaminimizer(l)
{
   minimizer = document.createElement('div');
   minimizer.id = "minimizer";
   minimizer.style.cssText= "z-index:30;text-align:center;padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;background:url(image/toleft.jpg);color:#eee;width:26px;height:26px;font-size:18px;position:absolute;top:6px;left:" + l + "px;font-weight:700;1px #445577 solid;cursor:pointer";
   minimizer.innerHTML = ' ';
   document.body.appendChild(minimizer);
  
}
var onloadbeforefloat = null;
if(typeof (window.onload) == 'function')
{
    onloadbeforefloat = window.onload;
}
window.onload = function()
{
    if (onloadbeforefloat!=null)
        onloadbeforefloat();
     doit1st();
}
 

 
