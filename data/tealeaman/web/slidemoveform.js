browserVars = new browserVarsObj();
if(!browserVars.type.getById) document.captureEvents(Event.MOUSEMOVE);
document.onmousemove = new Function('e', 'browserVars.updateMouse(e)');

function browserDetect()
{
	this.getById = document.getElementById?true:false;
	this.layers = document.layers?true:false;
	this.ns4 = ((this.layers) && (!this.getById));
	this.ns6 = ((browserstr.indexOf('Netscape6') != -1) && (this.getById));
	this.moz = ((navigator.appName.indexOf('Netscape') != -1) && (this.getById) && (!this.ns6));
	this.ie  = ((!this.layers) && (this.getById) && (!(this.ns6 || this.moz)));
	this.opera = window.opera?true:false;
}


function browserVarsObj()
{
	this.updateMouse = browserVarsObjUpdateMouse;
	this.updateVars = browserVarsObjUpdateVars;
	
	this.mouseX = 0;
	this.mouseY = 0;
	
	this.type = new browserDetect();
	this.width = 0;
	this.height = 0;
	this.screenWidth = screen.width;
	this.screenHeight = screen.height;
	this.scrollWidth = 0;
	this.scrollHeight = 0;
	this.scrollLeft = 0;
	this.scrollTop = 0;
	this.updateVars();
}

function browserVarsObjUpdateMouse(e)
{
	if(!this.type.ie)
	{
		this.mouseX = e.pageX;
		this.mouseY = e.pageY;
	}
	else
	{
		this.mouseX = window.event.clientX + this.scrollLeft;
		this.mouseY = window.event.clientY + this.scrollTop;
	}
}

function browserVarsObjUpdateVars()
{
	if(!this.type.getById)
	{
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.scrollWidth = document.width;
		this.scrollHeight = document.height;
		this.scrollLeft = window.pageXOffset;
		this.scrollTop = window.pageYOffset;
		if(this.width < this.scrollWidth) this.width -= 16;
		if(this.height < this.scrollHeight) this.height -= 16;
	}
	else
	{
		if((!(this.type.ns6 || this.type.moz)) && (document.body))
		{
			this.width = document.body.offsetWidth;
			this.height = document.body.offsetHeight;
			this.scrollWidth = document.body.scrollWidth;
			this.scrollHeight = document.body.scrollHeight;
			this.scrollLeft = document.body.scrollLeft;
			this.scrollTop = document.body.scrollTop;
		}
		
		if((this.type.ns6 || this.type.moz) && (document.body))
		{
			this.width = window.innerWidth;
			this.height = window.innerHeight;
			this.scrollWidth = document.body.scrollWidth;
			this.scrollHeight = document.body.scrollHeight;
			this.scrollLeft = window.pageXOffset;
			this.scrollTop = window.pageYOffset;
		}
	}
}
function findScreenPosition()
{
    var divposxy = [5,5];
    divposxy[1]+= 30;
    divposxy[0]-= 5;
    return  divposxy;
}

/*
function findPositionScrolling( oElement ) 
{
  var xx = 0, yy = 0;
  if (oElement==null) return [0,0];
  if( typeof( oElement.offsetParent ) != 'undefined' ) 
  {
    var originalElement = oElement;
    for( var  posY = 0,posX=0; oElement; oElement = oElement.offsetParent ) 
    {
      posY += oElement.offsetTop;
      posX += oElement.offsetLeft;
      if( oElement != originalElement && oElement != document.body && oElement != document.documentElement ) 
      {
          posY -= oElement.scrollTop;
          posX -= oElement.scrollLeft;
      }
    }
    xx=posX; 
    yy=posY; 
  }
  else
  {
     xx = oElement.x; 
     yy = oElement.y;
  }
   
  if(browserstr.indexOf("Safari")>=0)
  {   
      yy += 32;  
  }
  return [xx,yy];
}
*/
var icons = new Array(20);
for (var i=0; i < 20; i++)
   icons[i] = "f" + (i+1) +".jpg";
var showscreen = document.getElementById('screen');
 
var posxy = findScreenPosition();
 
var docxy = findPositionnoScrolling(document.getElementsByTagName("iframe")[0]);
if (posxy[1] > 500) posxy[1] -= 240;
var swidth = showscreen.offsetWidth;
var sheight = showscreen.offsetHeight;
var freq = 200;
var speed = 5;

var allFloaters =null;
function Rectangle(lt,tp,wd,ht)
{
    this.left = lt; 
    this.top  = tp; 
    this.width = wd; 
    this.height = ht;
    this.movestep0 = movestep0;
    this.movestep = movestep;
    this.contains = contains;
    this.overlapma = overlapma;
    this.atzero = atzero;
}
function atzero()
{
    return this.left == 0 && this.top == 0;
}
function contains(x,y)
{
    var b = ( this.left <= x && x <= this.left + this.width 
          && this.top   < y && y <  this.top  + this.height
          || this.left  < x && x <  this.left + this.width 
          && this.top  <= y && y <= this.top  + this.height);
    return b;
}
function overlapma(arect)
{
   if (arect.left==0) return false;
    var b = this.contains(arect.left, arect.top)
    || this.contains(arect.left + arect.width, arect.top)
    || this.contains(arect.left,               arect.top + arect.height)
    || this.contains(arect.left + arect.width, arect.top + arect.height) 
    || arect.contains(this.left,               this.top)
    || arect.contains(this.left + this.width,  this.top)
    || arect.contains(this.left,               this.top + this.height)
    || arect.contains(this.left + this.width,  this.top + this.height)
    || this.left==arect.left && this.top == arect.top 
    ;   
    return b;
}
function movestep0()
{
    
    if (this.top==0)
    {
       this.left += speed;
       if (this.left + this.width >= swidth)
       {
          this.left = swidth - this.width;
          this.top = speed;
       }
    }
    else if (this.left == swidth - this.width)
    {
       this.top += speed;
       if (this.top + this.height >= sheight)
       {
          //this.top = 0;
          //this.left = 0;
          this.top = sheight -  this.height;
          this.left = swidth - this.width - speed;
       }
    }
    else if (this.top == sheight -  this.height)
    {
        this.left -= speed;
        if (this.left <=  0)
        {
           this.left = 0;
           this.top = sheight -  this.height - speed;
        }
    }
    else if (this.left==0)
    {
        this.top -= speed;
        if (this.top <= 0)
           this.top = 0;
    }
}
function movestep()
{
   var newrect = new Rectangle(this.left,this.top,this.width,this.height);
   newrect.movestep0();
   return newrect;
}
function Floater(ii)
{
        this.loaded = false;
	this.div = document.getElementById("floatingDiv" + ii);
        this.rect = new Rectangle(0,0,99,99);
	this.visible = false;
	this.doFloat = doFloat;
	this.idNo = ii;
        this.zindex = (icons.length - this.idNo);
        this.load = load;
        this.sized = false;
        this.rightsize = rightsize;
}
function rightsize()
{
   if (this.sized == false)
   {
       var mg = document.images['icons' + this.idNo];
       if (mg != null && mg.width > 40)
       {
          this.rect = new Rectangle(0,0,mg.width,mg.height);
          this.sized = true;
       }
   }
}
function load()
{
   if (this.loaded==false)
   {
   //document.write("<div  id=\"floatingDiv" + this.idNo + "\" style=\"position:absolute;z-index:4;left:" +  posxy[0] +"px;top:" + posxy[1]+"px;visibility:hidden\">"); 
  // document.write("<img src=\"image/models/" + icons[this.idNo] +"\">"); 
  // document.write("</div>"); 
   document.images["icons" +this.idNo].src="image/models/" + icons[this.idNo];
   //this.rect = new Rectangle(0,0,.offsetWidth,this.div.offsetHeight);
   this.loaded = true;
   }
}
var stop = false;
function doFloat(arect)
{
       // browserVars.updateVars();
        this.rect = new Rectangle(arect.left, arect.top, arect.width, arect.height);
        this.div.style.left =  (posxy[0]  + this.rect.left)+"px";
	     this.div.style.top =   (posxy[1]  + this.rect.top)+"px";
        this.div.style.visibility = (this.rect.height >= 16)?"visible":"hidden";
        this.zindex = (this.zindex + icons.length - 1)%icons.length;
        this.div.style.zIndex = this.zindex;
        
}
Floater.prototype.doFloat = doFloat;

var startingi=-1,turni=0;
function movethem()
{
   //if (stop) return;
   var rect = null;
   var N = allFloaters.length;
   if (startingi== -1)
   {
      startingi = turni;
      turni = (turni + 1)%N;
      allFloaters[startingi].load();
      allFloaters[startingi].rightsize();
      rect = allFloaters[startingi].rect.movestep();
      allFloaters[startingi].doFloat(rect);
   }    
   else
   {
      var i = startingi; 
      do
      { 
        allFloaters[i].load();
        allFloaters[i].rightsize();
        origin = allFloaters[i].rect.atzero();
        rect = allFloaters[i].rect.movestep();

        var j = (i - 1 + N )%N;
        var ol = rect.overlapma(allFloaters[j].rect);
        if (!allFloaters[j].rect.atzero() && ol)
            break;
        
        allFloaters[i].doFloat(rect);
        if (rect.left == 0)
           allFloaters[i].div.style.zIndex = 0;
        else if (this.left == swidth - this.width)
           allFloaters[i].div.style.zIndex = 100;
        i = (i + 1)%N;
      }
      while (origin==false);
      //allFloaters[i].div.style.top = posxy[1] + 'px';
      allFloaters[i].div.style.visibility = "visible";
      //allFloaters[i].div.style.zIndex = 100;
      if (allFloaters[startingi].rect.atzero())
      {
         startingi = (startingi + 1)%N;
         if (allFloaters[startingi].rect.atzero()) 
             startingi = -1;
      }
   }
   setTimeout( movethem , 100);
}

function initFloaters()
{
        fitting();
        for (var i=icons.length-1; i>=0; i--)
        { 
           document.write("<div id=\"floatingDiv" + i + "\" style=\"position:absolute;z-index:4;left:" +  posxy[0] +"px;top:" + posxy[1]+"px;width:20px;height:20px;visibility:hidden;\">"); 
           document.write("<img id=icons" + i  + "></div>"); 
        }  
	    if(!document.getElementById) return;
	     allFloaters = new Array(icons.length);
        for (var j=0; j < icons.length; j++)
           allFloaters[j] = new Floater(j);
        movethem();
        var publicdiv = document.getElementById("public");
        if (publicdiv!=null) publicdiv.style.zIndex = icons.length + 1;
}



function fitting()
{
    var copyright = document.getElementById('copyright');
    var copxy = findPositionnoScrolling(copyright);
     
    var het = screen.height - 150 ;
    if (navigator.appName=='Microsoft Internet Explorer') 
    {
        het = document.body.offsetHeight;
    }
    else if(navigator.appName=='Netscape')
    {
        het = self.innerHeight;
    }
    var diff =  het - copxy[1] - 20;
    if (diff < -50) diff = -50;
   // document.getElementsByTagName("iframe")[0].height = (diff + 256);
    sheight += diff;
    showscreen.style.height = (290 + diff) + "px";
    var overv = document.getElementById('overv0');
    overv.style.height = (290 + diff) + "px";
    posxy = findScreenPosition();
    if (posxy[1] > 500) posxy[1] -= 250;
    
    
}
if(typeof window.onresize == 'function')
{
    var existing = onresize;
    window.onresize = function()
    {
      existing();
      fitting();
    };
}
else
{
    window.onresize = fitting;
}

initFloaters();
 
function openitw(url,wn,tl)
{
   //stop = true;
   var xx = screen.width;
   if (xx>=1000) xx=999;
   var yy = screen.height;
   if (yy>=1000) yy=999;
   openit(url + "?dim=" + xx + yy, wn, 1, tl);
}
function switchb(btn)
 {
      if (btn.value=='Stop' || textmsg[820]==btn.value)
      {
         window.frames[0].switchb(false);
         btn.value=textmsg[821];
      }
      else
      {
         window.frames[0].switchb(true);
         btn.value=textmsg[820];
      } 
 } 
 
 
 
 

