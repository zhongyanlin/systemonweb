class Cynlinder
{
    static THICKNESS = 60;
    static WIDTH = 300;
    static GAP = 20;
    static RATIO = 0.2;
    static TOPWIDTH = 100;
    static $(x){return document.getElementById(x);}
    id;
    x;
    y;
    z;
    width;
    height;
    type;
    handle;
    constructor(id,x, y, z, w, h)
    {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = w;
        this.height = h;
    }
    
    makecynlinder(w, h, i)
    {
        let h1 = w*  Cynlinder.RATIO;
        //let color = colors[i]; 
        let color = 'rgb(' + Math.floor(Math.random()*256) + ","
                           + Math.floor(Math.random()*256) + ","
                    + Math.floor(Math.random()*256) + ")";
            
        let w2 = w/2, w3 = w-2, w4 = w/2 - 1;
        let h2= h1/2, h3 = h1-2, h4 = h2-1;
        let c =  Cynlinder.TOPWIDTH/2;
        let  lt = (Cynlinder.WIDTH - this.width)/2;
        let s = `<div style="position:relative;left:${lt}px;top:0px;z-index:3;width:${w3}px;height:${h3}px;background-image:radial-gradient(#101010,#305020,${c}px,yellow,${color});border-radius:${w4}px/${h4}px;border:1px grey solid;"></div>
                <div id="main${this.id}" style="position:relative;top:-${h2}px;left:${lt}px;z-index:2;width:${w}px;height:100%;background-color:${color}"></div> 
                <div  style="position:relative;top:-${h1}px;left:${lt}px;z-index:1;width:${w}px;height:${h1}px;background-color:${color};border-radius:${w2}px/${h2}px"></div>`;
      return s;
    }
    makehtml()
    {
      let ele = document.createElement("div");
      ele.className = "layer";
      ele.style.left = this.x +'px';
      ele.style.top = this.y + 'px';
      ele.style.width = Cynlinder.WIDTH + 'px';
      ele.style.height = (this.height  ) + 'px';
      ele.style.zIndex = this.z;
      ele.id = "layer" + this.id;
      ele.innerHTML = this.makecynlinder(this.width, this.height, this.id);
      ele.style.backgroundColor = 'transparent';
      document.body.appendChild(ele);
      this.handle = ele;
    }
    moveX(x)
    {
       this.x = x;
       this.handle.style.left = x + 'px';
    }
    moveY(y)
    {
       this.y = y;
       this.handle.style.top = y + 'px';
    }
    moveXY(x,y)
    {
       this.y = y;
       this.x = x;
       this.handle.style.top = y + 'px';
       this.handle.style.left = x + 'px';
    }
    setHeight(h)
    {
       this.height = h;
       this.handle.style.height = h + 'px';
    }
}
class Pillar extends Cynlinder
{
    constructor(id,x, y, z, w, h)
    {
        super(id,x, y,z, w, h);
        this.type= 'pillar';
    }
    makecynlinder(w, h, i)
    {
        let s = super.makecynlinder(w, h, i);
        s = s.replace(/#101010,#305020,[^,]+,/g,'').replace(/background.color[^\)]+\)/g,'background-color:orange');
       // alert(s);
        return s;
    }
}
class Disk extends Cynlinder
{
    constructor(id,x, y, z, w, h)
    {
        super(id,x, y, z, w, h);
        this.type= 'disk';
    }
     
}
class Game
{
    static times = 1.2;
    INDNET;
    N = 8;
    disks = [];
    pillars = [];
    bottom;
    order = 0;
    top;
    constructor(n)
    {
        this.N = n;
        this.INDENT = (Cynlinder.WIDTH - Cynlinder.TOPWIDTH)/2/(n-1);
        this.bottom = (n+2) * Cynlinder.THICKNESS;
        let y = this.bottom;
        for (let i=0; i < n; i++)
        {
            let x = 0;//i * Game.INDENT;
           // let y = (n- i) * Cynlinder.THICKNESS;
            let w  = 2*(n-i-1)*this.INDENT + Cynlinder.TOPWIDTH;
            let h  = Cynlinder.THICKNESS;
            this.disks[i] = new Disk(i, x, y, i+1, w, h);
            y -= Cynlinder.THICKNESS - Cynlinder.RATIO*this.INDENT;
            this.disks[i].makehtml();
        }
        this.top = y;
        let h = this.bottom - y + 2*Cynlinder.THICKNESS - Cynlinder.RATIO*Cynlinder.TOPWIDTH;
        //let hs = [Cynlinder.THICKNESS*(1 + Cynlinder.RATIO/4),h,this.bottom-y0 + 2*Cynlinder.THICKNESS,h,this.bottom - y0 + 2*Cynlinder.THICKNESS,h]; 
        for (let i=0; i < 6; i++)
        {
            let x =   ( (i - i%2)/2)*Cynlinder.WIDTH*Game.times;
            let w  =  Cynlinder.TOPWIDTH/2;
            this.pillars[i] = new Pillar(i+n, x, this.top, (i%2===0?(n+1):0), w, h);
            this.pillars[i].makehtml();
        }
        this.pillars[0].setHeight(this.disks[n-1].y - this.top);
    }
    getTop(p)
    {
        let w = p*Cynlinder.WIDTH*Game.times;
        let j = -1, i;
        for (i = 0; i < this.N; i++)
        {
           if (this.disks[i].x === w ) 
               j = i; 
        }
        return j;
    }
    
    move(p, q, s)
    {
        let i = this.getTop(p);
        let j = this.getTop(q);
        let x0 = p*Cynlinder.WIDTH*Game.times;
        let y0 = this.disks[i].y;
        let x1 = q*Cynlinder.WIDTH*Game.times;
        let y1 = this.bottom +  this.disks[i].width* Cynlinder.RATIO;
        let h0 = this.disks[i].y - this.top;
        if (j>=0)
            y1 = this.disks[j].y + this.disks[j].width * Cynlinder.RATIO/2 - this.disks[i].width* Cynlinder.RATIO - Cynlinder.THICKNESS;
        Cynlinder.$('dynamic').innerHTML = `@keyframes schedule${this.order}{0%{left:${x0}px;top:${y0}px}\n30%{left:${x0}px;top:${this.top}px}\n40%{left:${x0}px;top:0px}\n60%{left:${x1}px;top:0px}\n70%{left:${x1}px;top:${this.top}px}\n100%{left:${x1}px;top:${y1}px}}`;
       // Cynlinder.$('growp').innerHTML = `@keyframes grow${this.order}{0%{height:${x0}px;top:${y0}px}\n35%{left:${x0}px;top:${this.top}px}\n65%{left:${x1}px;top:${this.top}px}\n100%{left:${x1}px;top:${x1}px}}`;
        this.disks[i].handle.style.animation =  `schedule${this.order} ${s}s 2`;
        this.order++;
        this.disks[i].moveXY(x1,y1);
    }
}

let game = new Game(8);
game.move(0,2,2);



