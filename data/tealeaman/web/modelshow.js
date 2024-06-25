var allagilepics = "cube1.gif cube2.gif cube3.gif";
function Rectangle(lt,tp,wd,ht,WT, HT)
{

    this.WIDTH  = WT;
    this.HEIGHT = HT;
    this.left = lt;
    this.top  = tp;
    this.width = wd;
    this.height = ht;
    this.movestep0 = movestep0;
    this.movestep = function(RIGHT,BOTTOM)
    {
      /* if ( Math.abs((RIGHT - this.WIDTH)/2 - this.left) < this.speed/2)
       {
          this.countpause++;
          if (this.countpause < 8)
          {

             return this;
          }
       }*/
       this.countpause = 0;
       var newrect = new Rectangle(this.left,this.top,this.width,this.height,this.WIDTH,this.HEIGHT);
       newrect.movestep0(RIGHT,BOTTOM);
       return newrect;
    };

    this.laped = function (x1,x2,y1,y2)
    {
   if (x1<=y1 && y1<=x2 && x2<=y2) return x2-y1;
   if (y1<=x1 && x2<=y2) return x2-x1;
   if (y1<=x1 && x1<=y2 && y2<=x2) return y2-x1;
   if (x1<=y1 && y2<=x2) return y2-y1;
   return 0;
   };
   this.overlaparea = function (arect)
   {
    var x = this.laped(this.left, this.left + this.width, arect.left, arect.left + arect.width);
    if (x==0) return 0;
    var y = this.laped(this.top, this.top + this.height, arect.top, arect.top + arect.height);
    if (y==0) return 0;
    return x*y;
   };
   this.atzero = function ()
   {
       return (this.left == 0 && this.height==0);
   }
   this.overlapma = function (arect)
   {
    return (this.overlaparea(arect)>0);
    }

    this.toString = function ()
    {
       return "left=" + this.left + ",top=" + this.top + ",width=" + this.width + ",height=" + this.height
       +",WIDTH=" + this.WIDTH +",HEIGHT=" + this.HEIGHT;
    };
    this.speed = 10;
    this.countpause = 0;
    this.min = function (a,b){return (a>b)?b:a;};
}

function movestep0(RIGHT,BOTTOM)
{
    if (this.left == 0)
    {
       if (this.top==0)
       {
          this.left = this.speed;
       }
       else if (this.top < this.speed)
       {
          this.top = 0;
       }
       else
       {
          this.top -= this.speed;
          this.height = this.min(this.HEIGHT, BOTTOM-this.top);
       }
    }
    else if (this.top==0)
    {
       if (this.left ==  RIGHT - this.WIDTH)
          this.top += this.speed;
       else if ( RIGHT - this.left - this.WIDTH < this.speed)
          this.left =  RIGHT - this.WIDTH;
       else
          this.left += this.speed;
    }
    else
    {
       if (this.top ==  BOTTOM)
       {
          this.left = 0;
          this.height = 0;
       }
       else if ( BOTTOM - this.top < this.speed)
       {
          this.top =  BOTTOM;
          this.height = 0;
       }
       else
       {
          this.top += this.speed;
          this.height = this.min(this.HEIGHT,  BOTTOM - this.top);
          
       }
    }
}

function Floater(objname, ii, x, y, initheight)
{
   this.div    = document.getElementById(objname + ii);
   this.rect   = new Rectangle(0,initheight,x, 0, x, y);
	this.doFloat = function doFloat(arect, modelshow)
   {
        this.rect = arect; //new Rectangle(arect.left, arect.top, arect.width, arect.height,arect.WIDTH, arect.HEIGHT, arect.RIGHT);
        this.div.style.left   =  (modelshow.posxy[0]  + this.rect.left)+ "px";
	     this.div.style.top    =  (modelshow.posxy[1]  + this.rect.top) + "px";
        this.div.style.width  =  this.rect.width  + "px";
        if (this.rect.height <= 10)
            this.div.style.visibility = "hidden";
        else
             this.div.style.visibility = "visible";
        this.div.style.height =  this.rect.height + "px";
   };
	this.id   = ii;
   this.toString = function(){return "id=" + ii +"," + this.rect.toString();}
}
 
function Modelshow(objname, screenid, pics, widths, heights)
{
   this.objname = objname;
   this.showscreen = document.getElementById(screenid);
   this.posxy = findPositionnoScrolling(this.showscreen);
   this.resize = function ()
   {
      this.posxy = findPositionnoScrolling(this.showscreen);
      this.swidth = this.showscreen.offsetWidth ;
      this.sheight = this.showscreen.offsetHeight;
      if (this.allFloaters!=null)
      {
         for (j=0; j < this.pics.length; j++)
         {
            if (this.allFloaters[j]!=null)
            {
               this.allFloaters[j].div.style.height = "0px";
               this.allFloaters[j].div.style.top = this.posxy[1] + "px";
               this.allFloaters[j].div.style.left = this.posxy[0] +"px";
               this.allFloaters[j].rect.height = 0;
               this.allFloaters[j].rect.left = 0;
               this.allFloaters[j].rect.top = this.sheight;
            }
         }
         this.endingi = pics.length-1;
         this.startingi = 0;
         this.stationed = true;
      }
   }
   this.pics = pics;
   this.widths = widths;
   this.heights = heights;
   this.swidth = 0;
   this.sheight = 0;
   this.freq = 200;
   this.speed = 10;
   this.allFloaters = null;
   this.endingi = pics.length-1;
   this.startingi = 0;
   this.stationed = true;
   this.updsize = function()
   {
      this.swidth = this.showscreen.offsetWidth ;
      this.sheight = this.showscreen.offsetHeight;
   }
   this.init = function()
   {
     this.updsize();
     this.allFloaters = new Array(this.pics.length);
     for (var j=0; j < this.pics.length; j++)
     {
       document.write("<div id=\"" + objname + j + "\" style=\"position:absolute;left:"
       +  this.posxy[0]   + "px;top:" + (this.posxy[1] + this.sheight)  + "px;"
       +   "height:0px;background:url(image/models/"
       +  this.pics[j]    + ");z-index:" + j + ";visibility:hidden\">" +"</div>");
       this.allFloaters[this.pics.length-j-1] = new Floater(this.objname, j, this.widths[j], this.heights[j], this.sheight );
     }
     this.movethem();
   };
   this.movethem = movethem;
   this.toString  = function ()
   {
       //bug("switch=" + this.swidth +", sheight=" + this.sheight +"<br>");
   }
}
 
var ka = 0;
function movethem()
{
   var N = this.pics.length;
   var di =  1;
   var M =  0;

   if (this.stationed)
      M = this.endingi >= this.startingi?(this.endingi - this.startingi+1):(this.endingi+ N-this.startingi);
   var jj = 0;
   var tryrect = null;
   //if (moreballons) bug("M=" + M + ", N=" + N + "<br>");
   if (N - M > 0)
   {
     this.updsize();
     var lst = (this.startingi-di+N)%N;
     //if (moreballons) bug("startingi=" + this.startingi +", di+" + di +", N=" + N + ", lst=" + lst +"<br>");
     tryrect = this.allFloaters[lst].rect.movestep(this.swidth,this.sheight);
    // if (moreballons) bug("leading:" + lst +"," + tryrect.toString() +"<br>");
     this.allFloaters[lst].doFloat(tryrect,this);
     jj = (this.startingi-2*di+N)%N;
     if (tryrect.atzero())
     {
        this.startingi = lst;
        this.allFloaters[this.startingi].div.style.zIndex = this.startingi;
        this.stationed = true;
     }
   }

   if (N - M > 1)
   for (var i=jj; i != this.endingi; i =(i-di+N)%N)
   {
      tryrect = this.allFloaters[i].rect.movestep(this.swidth,this.sheight);
      //if(moreballons) bug("following:"+ i +", "+ tryrect.toString() +"<br>");
      var b3 = tryrect.overlapma( this.allFloaters[(i+di+N)%N].rect);
      if ( b3 == false)
         this.allFloaters[i].doFloat(tryrect,this);
   }
   if (this.stationed)
   {
   tryrect = this.allFloaters[this.endingi].rect.movestep(this.swidth,this.sheight);
   //if(moreballons) bug("tryinit:" + this.endingi +','+ tryrect.toString() +"<br>");
   var pst = (this.endingi+di+N)%N;
   var xx = this.allFloaters[pst].rect;
   //if(moreballons) bug("prestar:" +pst +","+ xx.toString() +"<br>");
   b3 = xx.atzero();
   var b4 = tryrect.overlapma( xx);
   //if(moreballons) bug("pres at zero=" + b3 + ", overlap=" + b4 + "<br>");
   if ( b4==false)
   {
       //if(moreballons) bug("startint " + this.endingi + "<br>");
       this.allFloaters[this.endingi].doFloat(tryrect,this);
       this.allFloaters[this.endingi].div.style.zIndex = (N + 10);
       if (this.startingi==this.endingi)
       {
          this.stationed = false;
       }
       this.endingi = (this.endingi-di+N)%N;
   }
   else
   {
      this.allFloaters[this.endingi].div.style.zIndex = (N + 9);
   }

   }
   //if (ka++<5)
   setTimeout(this.objname + ".movethem()", 100);
}

var agilep = allagilepics.split(" ");
var agilew = new Array(agilep.length);
var agileh = new Array(agilep.length);
for (var l=0; l < agilep.length; l++)
{
   agilew[l] = 185; agileh[l] = 205;
}
var agileshow = new Modelshow("agileshow", "screen", agilep, agilew, agileh);
agileshow.init();













