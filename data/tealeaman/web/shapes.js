
 
function Shape (num, words, urlas, shapename,x, y, w, h, fs, cl, bc, fc,tm,zIndex,starttime, fontfamily,slope)
{
   if (ismakingtab!=1)
   {
       if (x!=null)
           x = Math.round(ismakingtab*x);
       if (y!=null)
           y = Math.round(ismakingtab*y); 
       if (w!=null)
           w = Math.round(ismakingtab*w);
       if (h!=null)
           h = Math.round(ismakingtab*h);
       if (fs!=null)
           fs = Math.round(ismakingtab*fs);
   }
  var s = ("words=" + words + '\nsp='+ shapename+ '\nx=' + x+ '\ny=' + y+ '\nw=' + w+ '\nh=' + h+ '\nfs=' + fs+ '\ncl=' + cl+ '\nbc=' + bc+ '\nfc=' + fc+ '\nzi=' + zIndex+ '\nor=' + starttime) ;
   if (zIndex == null)
      this.zindex =  1;
   else
      this.zindex = zIndex;
   this.slope = 0; 
   if (slope!=null && isNaN(''+slope) == false)
      this.slope =  slope;
   if (tm == null )
       this.time = 5;
   else
       this.time = tm;
   this.urlas = urlas;
   this.fontfamily = cachedfontfamily; 
   if (fontfamily != null)
       this.fontfamily = fontfamily;
     
   var newone = true;
   if (words == null) 
       words = textmsg[1774];
   if(words != textmsg[1774])
       newone = false; 
   if (shapename == null ) 
       shapename = 'rightrect';
   var sfs = getFontsize();
   if (x == null) 
   {
       x = favorx;
   }
   if (y == null) 
   {
       y = favory  ;
   }
   this.x = x;
   this.y = y;
   
   if (fs == null) fs = sfs; 
   if (cl == null) cl = 0;
   if (bc == null) bc = 0;
   if (num == null)
   {
       this.num = numShapes;
   }
   else
   {
       this.num = num;
   }
   if (this.num == maxn)
   {
       maxn += 100;
       for (var l=0; l < maxn; l++)
        if(allShapes[l]!=null)   allShapes[l].uniz();
   }
   if (shapename.indexOf("rect") < 0 && samecolor(bcolors[bc],document.body.style.backgroundColor) && fc!=null &&   (fc &1)==1)
       fc -= 1;
   if (starttime == null) 
      this.start = 5*this.num;
   else
      this.start = starttime;
   allShapes[this.num] = this;
   if (allShapes[this.num+1] == null)
       numShapes = this.num+1;
   this.shapename = shapename;
   
   this.width = w;
   this.height = h;
   this.words = words;
   if (ismakingtab!=1)
   {
      this.words = this.words.replace(/<img [^>]+>/g, '<img src="image/pic.png" width=50>'); 
   }
   this.fontsize = fs;
   
   this.color = cl;
   if (bc == null) bc = bcolors.length-1;
   this.bcolor = bc;
   this.fc = 0;
   this.inediting = false;
   if(fc!=null) 
   {
       this.fc = fc;
   }
   this.visible = 1;
   this.bx = 0;
   this.by = 0;
   this.validdrag = false;
   this.basiccss = function(){return "display:inline-block;position:absolute;border:0px;top:" + y +"px;left:" + x +"px;font-size:" + this.fs + "px;font-family:" + this.fontfamily  +';text-shadow:' + ((this.fc & 4)/4) + "px " + ((this.fc & 4)/4) + "px grey;color:" + colors[this.color] + ";";} 
   this.base = document.createElement("div");
   this.base.id = 'b' + this.num;
   this.base.style.cssText = this.basiccss();
   this.words = this.words.replace(/^[\n|\r| ]+/,'').replace(/[\n|\r| ]+$/,'');
   this.base.innerHTML = tohtml(this.words, this.urlas, colors[this.color], this.fontsize,this.shapename);
   document.body.appendChild(this.base);
   
   this.move = function(Ax, Ay,z)
   {
        var mx = parseInt(this.base.style.left.replace(/px/i,''));
        var my = parseInt(this.base.style.top.replace(/px/i,''));
        var  x = Ax - mx;
        var  y = Ay - my;
        var more = true;
        if (z!=null)
        {
            more = false;
            
        }
        else if (Math.abs( x) + Math.abs( y) < 4)
        {
            more = false;
        }
        else if (x>0 && y==0){x=2;y=0;}
        else if (x>y && y>0){x=2;y=1;}
        else if (x==y && y>0){x=1;y=1;} 
        else if (y > x && x>0){x=1;y=2;} 
        else if (y > 0 && x==0){x=0;y=2;}
        else if (y > -x && y>0){x=-1;y=2;}
        else if (-x==y && y>0){x=-1;y=1;} 
        else if (y < -x && y>0){x=-2;y=1;} 
        else if (y == 0 && x < 0){x=-2;y=0;}
        
        else if (-x>-y && y<0){x=-2;y=-1;}
        else if (x==y && y < 0){x=-1;y=-1;} 
        else if (-y > -x && x<0){x=-1;y=-2;} 
        else if (y < 0 && x==0){x=0;y=-2;}
        else if (-y > x && y < 0){x=1;y=-2;}
        else if (-x==y && y<0){x=1;y=-1;} 
        else if (-y < x && y<0){x=2;y=-1;} 
        
        mx += x;
        my += y;
        this.x = mx;
        this.y = my;
        this.base.style.top = my + 'px';
        this.base.style.left = mx + 'px';
        var fw = this.framew();
        if (!this.isrect())
        {
            this.div.style.left = (parseInt(this.div.style.left.replace(/px/i,'')) + x) + 'px';
            this.div.style.top =  (parseInt(this.div.style.top.replace(/px/i,'')) + y)  + 'px';
           
        }
        if (more && this.num < allShapes.length)
            setTimeout("allShapes[" + this.num + "].move(" + Ax + "," + Ay + ")",5);
        else  redrseline();
   };
    
   this.framew = function()
   {
       return 1+ Math.round(this.fontsize/15);
   }
   this.isrect = function(){return this.shapename == 'rightrect' || this.shapename == 'roundrect'
       || this.shapename == 'circle' || this.shapename == 'ellipse' || this.shapename == 'egg' ;}
   this.setup = function()
   { 
       var fw  = this.framew();
       var framecolor =  colors[this.color];
       if ((this.fc & 1) == 1) 
       {
           framecolor = bcolors[this.bcolor];
           fw = 0;
       }
       if (this.width == null)
       {
           var wt = this.width = this.base.offsetWidth;
       }
       else 
           wt = this.width;
       if (this.height == null)
       {
           var ht = this.height = this.base.offsetHeight;
       }
       else 
           ht = this.height; 
       var boxshadow = ((this.fc & 2) > 0)?1:0;
       if ( (this.fc & 8 ) > 0) 
           var bf = "background-image:" + gradient(bcolors[this.bcolor]) + ";";
       else
           bf = 'background-color:' + bcolors[this.bcolor] + ";";
       if (this.rect())
       {
           var tmp = this.basiccss() + "border:" + fw + "px " + framecolor + " solid;box-shadow:" + boxshadow + "px " + boxshadow + "px grey;tranform:rotate(" + this.slope + "deg);" + bf;
           if (this.shapename== 'rightrect')
               this.base.cssText = tmp;
           else if (this.shapename== 'roundrect')
               this.base.cssText = tmp + "border-radius:" + (2*fw) + "px";
           else if (this.shapename== 'circle')
           {
               var sd = (ht > wt)?ht : wt;
               var mx = sd*1.4142;
               var tp = 0; if (ht > wt) tp = (ht - wt)/2;
               var wd =0;  if (ht < wt) wd = (-ht + wt)/2;
               this.base.cssText = tmp + "width:" + mx + "px;height:" + mx + "px;border-radius:" + (mx/2) + "px;padding:" + tp + "px " + wd + "px " + tp + "px " + wd + "px;";
           }
           else if (this.shapename== 'ellipse')
           {
               var wt = 1.4142*wt;
               var ht = 1.4142*ht;
               this.base.cssText = tmp + "width:" + wt + "px;height:" + ht + "px;border-radius:50% / 50%;";
           }
           else if (this.shapename== 'egg')
           {
               var wt = 1.5*wt;
               var ht = 1.5*ht;
               this.base.cssText = tmp + "width:" + wt + "px;height:" + ht + "px;border-radius:50% 50% 50% 50%/ 40% 40% 60% 60%;";
           }
       }
       else if (this.shapename== 'diamond')
       {
           
           var rt = wt/ht;
           this.base.cssText = tmp + "width:" + (2*wt) + "px;height:" + (2*ht) + "px;padding:" + (ht/2) + "px " + (wt/2) + "px "   + (ht/2) + "px " + (wt/2) + "px;";
           if ($('g' + this.num) !=null) this.base.removeChild($('g' + this.num));
           var q = document.createElement('div');
           q.id = 'g' + this.num; 
           q.style.cssText = "position:relative;margin:-" + (3*ht/2) + "px -" + (wt/2) + "px -" + (ht/2) + "px -" + (wt/2) + "px;height:" + (2*ht) + "px;transform:scaleX(" + (wt/ht) + ");transform-origin:0%;width:" + (2*ht) + "px;z-index:-2";
           q.innerHTML = "<div style=\"" + bf   + "border:" + fw + "px " + framecolor + " solid;box-shadow:" + boxshadow + "px " + boxshadow + "px grey;height:"+ (2*ht/1.4142) +"px;width:"+ (2*ht/1.4142) +"px;transform:rotate(45deg);transform-origin:35.5% 84%;";
           this.base.appendChild(q);
       }
       else   if (this.shapename== 'hexgon')
       { 
           if (this.width == null)
           var wt = wt;
           else 
               wt = this.width;
           if (this.height == null)
           var ht = ht;
           else 
               ht = this.height;
           if (ht > wt)
           {
               if (ht/wt > 1.732)
               {
                   
               }
           }
           this.base.cssText = tmp + "width:" + (2*wt) + "px;height:" + (2*ht) + "px;padding:" + (ht/2) + "px " + (w/t) + "px "   + (ht/2) + "px " + (w/t) + "px;";
           if ($('g' + this.num) !=null) this.base.removeChild($('g' + this.num));
           var q = document.createElement('div');
           q.id = 'g' + this.num; 
           q.style.cssText = "position:relative;margin:-" + (3*ht/2) + "px -" + (wt/2) + "px -" + (ht/2) + "px -" + (wt/2) + "px;height:" + (2*ht) + "px;transform:scaleX(" + (wt/ht) + ");transform-origin:0%;width:" + (2*ht) + "px;z-index:-2";
           q.innerHTML = "<div style=\"" + bf   + "border:" + fw + "px " + framecolor + " solid;box-shadow:" + boxshadow + "px " + boxshadow + "px grey;height:"+ (2*ht/1.4142) +"px;width:"+ (2*ht/1.4142) +"px;transform:rotate(45deg);transform-origin:35.5% 84%;";
           this.base.appendChild(q);
       }
       numbeing = this.num;
       this.inediting = false;
       shapenamebeing = this.shapename;
       Drag.init(this.base);
   }
    
    
   this.positionbyfn = function(fn)
   {
       var s = this.base.getElementsByTagName("nobr");
       for (var i=0; i < s.length; i++)
       {
           
           if (s[i].innerHTML.replace(/<b>/i,'').replace(/<.b>/i,'').replace(/^[ |\r]*/,'').replace(/[ |\r]*$/,'') 
                                                            == fn.replace(/^[ |\r]*/,'').replace(/[ |\r]*$/,''))
           return findPositionnoScrolling(s[i])[1] - this.y + Math.round(this.fontsize);
       }
       return 0;
   }
   
   this.inbase = function(bx,by)
   {
       if (this.shapename== 'ellipse'||this.shapename== 'circle')
       {
       var w =  this.base.offsetWidth;
       var h =  this.base.offsetHeight;
       var x = bx - this.x - w/2 ;
       var y = by - this.y  - h/2;
       var D = x*x/w/w + y*y/h/h;
      
       return (  D <= 0.25);
       }
       else if (this.shapename== 'diamond')
       {
       w =  this.base.offsetWidth;
       h =  this.base.offsetHeight;
       x = bx - this.x - w/2 ;
       y = by - this.y - h/2;
       D =  Math.abs(x/w) + Math.abs(y/h) ;
       return (D <= 0.50);
       }
       else
       {
       w =  this.base.offsetWidth;
       h =  this.base.offsetHeight;
       x = bx - this.x ;
       y = by - this.y ;
      
       return ( x>=0 && x <=w && y >=0 && y <=h);
       }
   }
   this.ellipseimg = function()
   {
       if ( (this.shapename == 'ellipse' || this.shapename == 'circle')  && this.words.replace(new RegExp("\\[" + textmsg[1303] + "[0-9]+\\]","i"),'')=='')
       {
           
          this.base.className = null;
          this.base.style.cssText = "";
          var cln = this.words.replace(new RegExp("\\[" + textmsg[1303] + "([0-9]+)\\]","i"),'imagelet$1') + '_' + pagenum;
          this.base.className = cln;
          var qq = imagelet2wh[cln]; 
          if (qq!=null){ this.base.style.borderRadius=qq;  }
          base2cn[cln] = this.base;
       }
   } 
   
   this.base.onDragStart = function(x,y)
   {
       if (this.inediting) return;
       document.onmousemove = onmouseover0;
       var sp = allShapes[parseInt(this.id.substring(1))];
       sp.bx = x; 
       sp.by = y; 
       if (state>0)
           sp.validdrag = false;
       else
           sp.validdrag = sp.inbase(myHintx, myHinty);
       sp.x =  parseInt(sp.base.style.left.replace(/px/,''));
       sp.y =  parseInt(sp.base.style.top.replace(/px/,''));
        
   } 
    
   this.onDragEnd = function(x,y)
   {
       
       if (this.inediting || this.validdrag == false) return;
       
       if (Math.abs(x) + Math.abs(y) > 10)
       {
           sendObject(this.num);
       }
       if (Math.abs(x) + Math.abs(y) > 0)
       { 
        for (var i=0; i < allLines.length; i++)
        {
           if (allLines[i]!=null && (allLines[i].startnum== this.num || allLines[i].endnum== this.num )) 
           {
               allLines[i].redraw();
           }
        } 
       
       }
       document.onmousemove = onmouseover0; 
   }
   this.base.onDragEnd = function(x,y)
   {
       document.onmousemove = onmouseover0;
       var sp = allShapes[parseInt(this.id.substring(1))];
       
       if ( state>0) // bounce back
       {
           this.style.left = sp.bx + 'px';
           this.style.top  = sp.by + 'px';
           begindraw(sp.div);
           return;
       }
       if (document.onclick !=null) return;
       var diffx  = x - sp.bx;
       var diffy =  y - sp.by;
       
       if (   Math.abs(diffx) + Math.abs(diffy) > 4)
       {
           
           sp.x = (diffx + parseInt(sp.base.style.left.replace(/px/,'')));
           sp.y = (diffy + parseInt(sp.base.style.top.replace(/px/, '')));
           sp.base.style.left = sp.x + 'px';
           sp.base.style.top  = sp.y + 'px';
           sp.onDragEnd(diffx,diffy);
           hassaved = false;
       }
       else
       {
           mdia(parseInt(this.id.substring(1)),1);
       }
        
       document.onmousemove = onmouseover0; 
   }
    
   this.delme = function(needcomfirm)
   {
      if (typeof(LaTexHTML)!='undefined')
      LaTexHTML.deformat(this.base);
      if (needcomfirm!=null && saveable()  && this.words!=null &&  this.words.indexOf("<img ") >= 0)
      {
          var im = this.base.getElementsByTagName("img")[0].alt;
          
          if (im.src.indexOf(originalurl + "/FileOperation?did=") >=0 
           && confirm(textmsg[1662].replace(/#/,  im)))
              delpic(this.num, im);
      }
     
      document.body.removeChild( this.base); 
      for (var i=allLines.length-1; i >=0; i--)
      {
           if (allLines[i]!=null && (allLines[i].startnum== this.num || allLines[i].endnum== this.num ))
           {
               allLines[i].delme();
           }
      } 
      if (chatsessionnum== -1 && numShapes-1== this.num)
          numShapes--;
      
      allShapes[this.num] = null;
      
   }
   this.toString = function()
   {
       if (ismakingtab != 1) return null;
       if (this.words == null)
           this.words = "";
         
       if (this.shapename == null) this.shapename = 'rightrect';
       var yy  = parseInt(this.base.style.top.replace(/px/,''));
       var xx  = parseInt(this.base.style.left.replace(/px/,''));
       var ww = '';
       if (this.width !=null)
           ww = this.width; 
       else 
           ww = this.base.offsetWidth;
       var hh = '';
       if (this.height !=null)
           hh = this.height; 
       else 
           hh = this.base.offsetHeight;
       var str ;
       if (this.words.indexOf(",") >= 0 || this.words.indexOf("\n") >= 0 || this.words.indexOf("\r") >= 0)
           str = "'" + this.words.replace(/'/g, "''") + "',";
       else 
           str = this.words + ",";
        ;
       str += this.urlas + ",";
       str += this.shapename  +"," +  xx +"," + yy + "," + ww + "," + hh +","  
          + this.fontsize + ",'" + (this.color) + "','" + this.bcolor + "'," + this.fc + "," + this.time+ "," + this.zindex + "," + this.start + ",'" + this.fontfamily + "'," + this.inediting + "," + this.slope; 
        
       return str;
   }
    
   this.showresize = function(pic)
   {
       pic.id = "z" + this.num;
       if (this.isrect())
       { 
           this.base.onmouseover = function()
           { 
               var num = parseInt(this.id.substring(1));
               showanchor($("z"+num), this, 'se');
           }
       }
        
       else
       {
           this.base.getElementsByTagName('div')[0].onclick = function() 
           {
              
              mdia(parseInt(this.parentNode.id.substring(1)), 1);
           }
       }
   }
   this.resizeit = function()
   { 
   var ims = this.div.getElementsByTagName("img");
   if (ims != null && ims.length >0)
   {
       ims[0].id = "z" + this.num;
       ims[0].style.cssText = "margin:0px 0px 0px 0px;border:0px";
       ims[0].onDragStart = function(x,y)
       {
           var sp = allShapes[parseInt(this.id.substring(1))];
           sp.bx = x; 
           sp.by = y; 
       } 
       ims[0].onDragEnd = function(x,y)
       {
           if (document.onclick!=null) return;
           var sp = allShapes[parseInt(this.id.substring(1))];
           var diffx  = x - sp.bx;
           var diffy =  y - sp.by;
           if ( diffx*diffx + diffy*diffy <= 4)
           {  
               mdia(parseInt(this.id.substring(1)), 1);
           }
       }
       
       //ims[0].onclick = function() {mdia(parseInt(this.id.substring(1)), 1);}
       ims[0].onmouseover = function(){showanchor(this, this,'se');}
   }
   else if ( ( ims = this.div.getElementsByTagName("iframe") ) !=null && ims.length >0)
   {
        this.showresize(ims[0]);
   }
   else if ( ( ims = this.div.getElementsByTagName("embed") ) !=null && ims.length >0)
   {
       this.showresize(ims[0]);
   }
   else  if (this.isrect())
   { 
       this.div.onmouseover = function()
       { 
           var num = parseInt(this.id.substring(1));
           if (allShapes[num].fc== 0) 
               showanchor(this, allShapes[num].base, 'se');
       }
   }
   }
    
   
   this.getdim = function()
   {
      this.width = this.base.offsetWidth;
      this.height = this.base.offsetHeight;
   }
   
   this.uniz = function()
   {
       this.base.style.zIndex = '' + (2* this.zindex );
        
   }
    
   this.init = function()
   {
       setup();
       this.resizeit();
       var mw = this.base.offsetWidth;
       if (mw < this.width ) mw = this.width;
       if (mfavory < this.base.offsetHeight)
           mfavory = this.base.offsetHeight;
       if (mfavory < this.height)
           mfavory = this.height;

       favorx += 10 + mw;
       if (favorx > 800)
       {
           favory += mfavory + 10;
           favorx = 5;
          mfavory = 0;
       }
   }
   this.init();
}
 