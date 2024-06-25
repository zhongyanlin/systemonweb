if (typeof modelp=='undefined')
var modelp = ["image/models/tn_supper.jpg",
"image/models/tn_supper2.jpg",
"image/models/tn_supper3.jpg",
"image/models/tn_announce.jpg",
"image/models/tn_email.jpg",
"image/models/tn_msn.jpg",
"image/models/tn_grades.jpg",
"image/models/tn_aggret.jpg",
"image/models/tn_instant.jpg",
"image/models/tn_mody.jpg",
"image/models/tn_mysession.jpg",
"image/models/tn_registration.jpg",
"image/models/tn_schedule.jpg",
"image/models/tn_webdb.jpg",
"image/models/tn_webfile.jpg",
"image/models/tn_webservice.jpg"];



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
 /*if ( Math.abs((RIGHT - this.WIDTH)/2 - this.left) < this.speed/2
 || Math.abs(BOTTOM-this.HEIGHT-this.top) < this.speed/2 && this.left ==  RIGHT - this.WIDTH )
 {
 this.countpause++;
 if (this.countpause < 8)
 {
 return this;
 }
 }
 this.countpause = 0; */
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


function Floater(obj , ii, initheight)
{
 this.div    =  obj;
 this.rect   = new Rectangle(0,initheight,this.div.offsetWidth, 0, this.div.offsetWidth, this.div.offsetHeight);
 this.doFloat = function(arect, modelshow)
 {
 if (this.rect==arect) return;
 this.rect = arect;
 this.div.style.visibility = (this.rect.height >=16)?"visible":"hidden";
 if (this.rect.height >=16){
 this.div.style.height = this.rect.height + "px";
 this.div.style.width =  this.rect.width + "px";
 this.div.style.left =  (modelshow.posxy[0]  + this.rect.left)+"px";
 this.div.style.top =   (modelshow.posxy[1]  + this.rect.top)+"px";
 }
 
 };
 this.id   = ii;
 this.toString = function(){return "id=" + ii +"," + this.rect.toString();}
}



function Modelshow(objname, screenid, pics)
{
 this.objname = objname;
 this.showscreen = document.getElementById(screenid);
 this.posxy = findPositionnoScrolling(this.showscreen);
 
 this.resize = function ()
 {
 this.posxy = findPositionnoScrolling(this.showscreen);
 //this.posxy[0]+=2;
 //this.posxy[1]+=21;
 this.swidth = this.showscreen.offsetWidth ;
 this.sheight = this.showscreen.offsetHeight;
 if (this.allFloaters!=null)
 {
 for (j=0; j < this.pics.length; j++)
 {
 if (this.allFloaters[j]!=null)
 {
 this.allFloaters[j].div.style.height = "0px";
 this.allFloaters[j].rect.height = 0;
 this.allFloaters[j].rect.left = 0;
 this.allFloaters[j].rect.top = this.sheight;
 this.allFloaters[j].div.style.top = this.posxy[1] + "px";
 this.allFloaters[j].div.style.left = this.posxy[0] +"px";
 }
 }
 this.endingi = this.pics.length-1;
 this.startingi = 0;
 this.stationed = true;
 }
 }
 this.pics = pics;

 this.swidth = this.showscreen.offsetWidth ;
 this.sheight = this.showscreen.offsetHeight;
 this.freq = 200;
 this.speed = 10;
 this.allFloaters = null;
 this.endingi = pics.length-1;
 this.startingi = 0;
 this.stationed = true;
 this.countarrival = 0;
 this.allFloaters = new Array(this.pics.length);
 this.keepgoing = true;
 for (var j=0; j < this.pics.length; j++)
 {
 
 document.write("<div id=\"" + objname + j + "\" style=\"position:absolute;visibility:hidden;overflow:hidden;left:"
 +  this.posxy[0]   + "px;top:" + (this.posxy[1]  )
 + "px;z-index:" + j + "\"><img src=\"" + this.pics[j] + "\"  onload=\""
 + objname +".init(" + j +")\"   onclick=openbig('" + this.pics[j] +"')></div>");
 }
 this.hide = function()
 {
     this.keepgoing = false;
     for (var j=0; j < this.pics.length; j++)
     {
         var divpic  = document.getElementById(this.objname + j);
         if (divpic!=null)
         {
             document.body.removeChild(divpic);
         }
     }
 }
 this.init  = function(j)
 {
 var divpic  = document.getElementById(this.objname + j);
 this.allFloaters[this.pics.length - j - 1] = new Floater(divpic,j, this.sheight );
 this.countarrival++;
 if ( this.countarrival == this.pics.length )
 { this.movethem();}

 };
 this.movethem = movethem;
 this.toString  = function ()
 {
 //bug("switch=" + this.swidth +", sheight=" + this.sheight +"<br>");
 }
 this.stop = function()
 {
 this.keepgoing = false;
 }
}


var ka = 0;
function movethem()
{
 if (this.keepgoing==false) return;
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
 if (this.stationed && this.endingi < this.allFloaters.length && this.allFloaters[this.endingi]!=null)
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
var modelshow = new Modelshow("modelshow", "screen", modelp);
var onloadbeforereslide = null;
if (typeof window.onload == 'function')
    onloadbeforereslide = window.onload;
window.onload = function()
{
   if (onloadbeforereslide!=null)     
       onloadbeforereslide();
   modelshow.resize();
}
 
if(typeof (window.onresize) != 'undefined' && window.onresize!=null)
{
 var existing = window.onresize;
 window.onresize = function()
 {
    existing();
    modelshow.resize();
  };
}
else
{
    window.onresize = function(){modelshow.resize();} 
}

function stopmodelshow()
{
   if (modelshow!=null) modelshow.stop();
}

function openbig(th)
{
 open(th.replace(/models.tn_/,'slide/'),'_blank');
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