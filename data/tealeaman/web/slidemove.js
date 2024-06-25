  
    function maketext(nm)
    {
        var N = 5;

        var s = '@keyframes ' + nm + '{';
        s +=  "from {color:rgb(55,55,180)}\n"; 
        s +=   "to {color:rgb( 221,201,17)}\n";
        s += "}\n";
        return s;
    }

    function BrowserCheck()
{
    var N= navigator.appName, ua= navigator.userAgent, tem;
    var M= ua.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) {M[2]=tem[1];}
    M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
    return M;
}
   function isie()
   {
      var q = ( document.all && !document.querySelector)  
      var w = (document.all && document.querySelector && !document.addEventListener);
      return q||w;
   }
   var browserinfo = BrowserCheck();
   var canrotate = ('transform' in document.body.style);
    
  /*  function makeblock(i, x, y, w, h, d)
    {
         return "<div id=block" + i + " style=\"visibility:hidden;padding:0px;width:" + w + "px;height:" + h + "px;border:0px;position:absolute;left:"+ x+"px;top:" +
                 y + "px;transform:(" + d + "deg);opacity:0.3;background-color:#aaaaaa\"></div>";
    }
  */     
    function Spiral(base,nm,ws,X,Y,W,H,R)
    {
       this.X = X;
       this.Y = Y;
       this.W = W;
       this.H = H;
       this.R = R;
       if (base==null)
           this.base = document.body;
       else
       {
           this.base = base;
           base.style.position="relative";
           this.X = 0;
           this.W = base.offsetWidth;
           this.Y = - Math.round(this.W/380*38);//38;
           this.H = base.offsetHeight;
           this.R = Math.round(this.W/380*70);//70;
       }
       
       this.name = nm;
       this.ws = ws;
       this.N = ws.length-1;
       
       this.makerun = function(nm)
        {
            var N = 40;
            var s = '@keyframes ' + nm + '{';
            var g = 0;//1/N;
            for (var i=0; i < N; i++)
            {
                g += 100.0/N;//Math.round(0.000001+4*Math.abs(Math.cos(i/N*Math.PI)));
                if (i == N-1) g = 100;
                s += g  + "% {transform:rotate(" + (i*360/N) + "deg)}\n";
            }

            s += "}\n";
            return s;
        }
       
       this.makexy = function()
       {
          var N = this.N;
          var xop = "0+0--00+++000----0000+++++00000------000000+++++++".split(/|/);
           var yop = "00+00--000+++0000----00000-----000000++++++0000000".split(/|/);
           this.x = [this.X + this.W/2];
           this.y = [this.Y + this.H/2];
           var R = this.R/2+2;
           for (var i=1; i < ws.length; i++)
           {
               if (xop[i]=='+') this.x[i] = this.x[i-1] + 2*R;
               else if (xop[i]=='-') this.x[i] = this.x[i-1] - 2*R;
               else                  this.x[i] = this.x[i-1];
               if (yop[i]=='+') this.y[i] = this.y[i-1] + 2*R;
               else if (yop[i]=='-') this.y[i] = this.y[i-1] - 2*R;
               else                  this.y[i] = this.y[i-1];
           }
       }
       this.light = function(c)
    {
       // return c.replace(/(...)[0-9][0-9]/, '$143');
        var r = parseInt(c.substring(1,3),16) + 20;
        var g = parseInt(c.substring(3,5),16) + 70;
        var b = parseInt(c.substring(5),16) + 10;
        if (r>255) r = 255;
        if (g>255) g = 255;
        if (b> 255) b = 255;
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
       this.makeline = function(nm,x0,y0,x1,y1)
            {
                var m = parseInt(nm.replace(/[^0-9]/g,''));
                
                var s = '@keyframes ' + nm + '{';
                if (x0==x1)
                {
                    if (y1>y0)
                        s += 'from {height:0px;opacity:0;top:' + y0 +'px}\n  to {top:' + y0 +'px;height:' +  (y1-y0) + "px;opacity:1}\n";
                    else
                        s += 'from {height:0px;opacity:0;top:' + y0 +'px}\n  to {top:' + y1 +'px;height:'+  (y0-y1) + "px;opacity:1}\n";
                }
                else 
                {
                    if (x1 > x0)
                       s += 'from {left:0px;opacity:0;left:' + x0 + 'px;}\n   to {left:' + x0 + 'px;width:'+  (x1-x0) + "px;opacity:1}\n";
                    else
                       s += 'from {left:0px;opacity:0;left:' + x0 + 'px}\n   to {left:' + x1 + 'px;width:' +  (x0-x1) + "px;opacity:1}\n";
                }
                s += "}\n";
                
                
                return s;
            }
       this.makekey = function(nm,x0,y0,x1,y1)
            {
                var m = parseInt(nm.replace(/[^0-9]/g,''));
                
                var s = '@keyframes ' + nm + '{';
                if (x0==x1)
                   s += 'from {top:' + (y0) + "px;opacity:0}\n"   +  '  to {top:' + (y1) + "px;opacity:1}\n";
                else 
                   s += 'from {left:' + (x0) + "px;opacity:0}\n"   +  '  to {left:' + (x1) + "px;opacity:1}\n";
                s += "}\n";
                
                
                return s;
            }
       this.circle = function(w)
       {
           
           var fs = Math.round(this.W/380*13);
           var l = Math.round(2*Math.PI * (this.R/2 - fs/2-1)/fs);
           
           var z = w.length ;
           if (z > l) return '';
           var t = (z+l)/l*Math.PI;
           
           var j = 0;
           var str = '';
           for (; j < w.length;j++,t = t - 2*Math.PI/l) 
           {
               var x0 = this.R/2 + (this.R/2 - fs/2-1)*Math.cos(t);
               var y0 = this.R/2 + (this.R/2 - fs/2-1)*Math.sin(t);
               var d = t*180/Math.PI;
               str += "<div style=\"text-shadow:1px 1px #505050;position:absolute;left:" + (x0-fs/2) + 'px;top:' + (y0-fs/2-1) + 'px;text-align:center;transform:rotate(-' + d + 'deg);font-size:' + fs + 'px;color:inherit">' + w.charAt(j) + '</div>';
           }
           return str;
       }
       this.circular = function(x)
       {
           var ans = "";
           if (canrotate){
           x = x.replace(/&nbsp;/g,' ').toLowerCase();
           var U = 19; if (U > 350/x.length) U = 350/x.length; 
           if (x.length < 7)
           {
               U = 35;
               x = "---" + x + "---";
               x = x.replace(/ /,'');
           }
           for (var j=0; j < x.length; j++)
           {
               var u = U;
               var y = x.charAt(j);
               
               if (y == '-') y = '<font size=' + ((j<2||x.length-1-j<2)?2:1) + '>&bull;</font>';
               ans += "<div style=\"padding:0px 0px 0px 0px;margin:" + (j==0?0:(-this.R)) + "px 0px 0px 0px;width:" + this.R + "px;height:" + this.R + "px;border-radius:" + (this.R/2) + "px;transform:rotate(" + (0.4+j-x.length/2)*U + "deg);font-size:inherit;color:#DDCC11;font-weight:700;text-align:center\">" + y + "</div>";
           }
           ans +=  "<div style=\"padding:0px 0px 0px 0px;margin:" + (-this.R ) + "px 0px 0px 0px;width:" + this.R + "px;line-height:" + (this.R) + "px;border-radius:" + (this.R/3) + "px;font-size:25px;color:#DDCC11;font-weight:700;text-align:center;vertical-align:middle\">&star;</div>";
           return ans;
          }
           return "<div style=\"margin:18px;0px;0px;0xp;line-height:" + this.R/4 + "px;height:" + (this.R/2) + ";width:" + this.R + "px;overflow:hidden;text-align:center;vertical-align:middle;font-size:14px;color:#DDCC11;font-weight:700\">" + x.replace(/ /,'<br>')  + "</div>";
       }
       this.mkdisk = function(i)
        {
            if (this.stop)return;
            var d = document.createElement('div');
            d.id = 'dis' + i;
           // var r = (i/this.N)*(this.R/2) + (this.N-i)/this.N*this.H/2;
            if ( i==16) this.base.style.borderBottomLeftRadius = (this.R/2) + 'px';
            var fs = 1; var ls = this.ws[i].split(/ /);
            if (ls[0].length>fs)fs = ls[0].length;
            if (ls.length>1 && ls[1].length>fs)fs = ls[1].length;
            if (ls.length>2 && ls[1].length>fs)fs = ls[1].length;
            if (fs<10) fs = Math.round(this.W/380*16);
            else fs = Math.round(this.W/380*13);
            d.style.cssText =  "z-index:" + (60-3*i) + ";padding:0px;font-size:" + fs +"px;padding:0px;text-align:center;border:0px;position:absolute;left:"+ (this.x[i==0?0:(i-1)]-this.R/2)+"px;top:" +  (this.y[i==0?0:(i-1)]-this.R/2) + "px";
            d.innerHTML =   "<center><div id=circle" + i + " class=advanced style=\"width:"+this.R+"px;height:"+this.R +"px;border-radius:" + (this.R/2) + "px;z-index:" + (60-3*i+1) + ";animation:diskrun 2s 1;border:1px #CCCCbb solid;\" >" + this.circular(this.ws[i]) + "</div></center>"; 
              //   +"<div style=\"z-index:" + (60-3*i+2) + ";position:relative;text-align:center;vertical-align:middle;left:0px;top:-" + (this.R*3/4) +"px;animation:textshow  2s 1;font-size:inherit;color:#DDCC11;font-weight:700;text-align:center\">" +  (this.ws[i].replace(/ /,'<br>')) + "</div></center>";
            this.base.appendChild(d);
            
            if (i>0)
            {
                d.style.animation = 'disk' + i + " 2s 1";
                var p = document.createElement('div');
                p.id = 'lin' + i; 
                p.style.cssText = "z-index:0;position:absolute;background-color:#DDCCAA;border-radius:" + this.R/4 + "px;width:" + this.R/2 + "px;height:" + (this.R/2) + "px;left:"
                +(this.x[i-1]-this.R/4) + 'px;top:' + (this.y[i-1]-this.R/4) + "px;animation:line" + i + " 2s 1";
                p.innerHTML = '';
                this.base.appendChild(p);
            }
            setTimeout(this.name + ".hold(" + i + ")",2000);
        }
        this.hold = function(i)
        {
            if (i>0){ 
            var z = document.getElementById('dis' + i);
            z.style.zIndex = i+50;
            z.style.left = (this.x[i]-this.R/2)  +'px';
            z.style.top = (this.y[i]-this.R/2)  +'px';
            
            var r = document.getElementById('lin' + i);
            if (this.x[i]==this.x[i-1])
                {  
                     if (this.y[i] > this.y[i-1])
                    {r.style.height =  (this.y[i]-this.y[i-1]) + 'px';
                    r.style.top = Math.abs(this.y[i-1]) + 'px';}
                    else
                    {r.style.height =  (this.y[i-1]-this.y[i]) + 'px';
                    r.style.top = Math.abs(this.y[i]) + 'px';}    
                }
                else
                {  
                    if (this.x[i] > this.x[i-1])
                    {r.style.width = Math.abs(this.x[i]-this.x[i-1]) + 'px';
                    r.style.left =  (this.x[i-1]) + 'px';}
                    else
                    {r.style.width = Math.abs(this.x[i-1]-this.x[i]) + 'px';
                    r.style.left = (this.x[i]) + 'px';}    
                }
            }
             
            if (i+1 < this.N )this.mkdisk(i+1);
              else this.conclude();
        }
        this.transit = null;
        this.conclude = function()
        {
            if (this.count==3) this.stop = true;
            this.count++;
            if (this.stop)return; 
            var x = 0, y=0;
            if (document.getElementById('lin1')!=null)
            {
                for (var i=1; i < this.N; i++)
                    this.base.removeChild(document.getElementById('lin' + i));
               var d = document.getElementById('dis' + (this.N-1));
               x = parseInt(d.style.left.replace(/px/,''));
               y = parseInt(d.style.top.replace(/px/,''));
                for (var i=0; i < this.N; i++)
                    this.base.removeChild(document.getElementById('dis' + i));
            }
            this.transit = document.createElement('div');
           // this.base.style.borderBottomLeftRadius = '150px';
            this.transit.className= 'advanced';
            this.transit.style.cssText = "position:absolute;left:" + x + 'px;top:' + 
                   y + 'px;width:' + this.R + 'px;height:' + this.R + 'px;border-radius:' + (this.R/2) + 'px;animation:amplify 4s 1;color:#DDCC11;font-size:' + Math.round(this.W/380*13) + 'px;font-weight:700;text-shadow:1px 1px #606060;border:1px #CCCCbb solid;';
            this.transit.innerHTML = "<center><div   class=advanced style=\"width:"+this.R+"px;height:"+this.R +"px;border-radius:" + (this.R/2) + "px;border:0px #CCCCbb solid;z-index:" + (60-3*i+1) + ";animation:diskrun 2s 1;\" >" + this.circular(this.ws[this.N]) + "</div></center>" ;
             //    +"<div style=\"position:relative;text-align:center;vertical-align:middle;left:0px;top:-" + (this.R*3/4) +"px;animation:textshow  2s 1;font-size:inherit;color:#DDCC11;font-weight:700;text-align:center\">" + this.ws[this.N].replace(/ /,'<br>') + "</div></center>";  
            this.base.appendChild(this.transit);
            setTimeout(this.name + ".redo()",4000);
            
        }
    this.stop = false; 
    this.count = 0;
    this.redo = function()
    {
        this.transit.style.left = (this.W/2 - this.R/2) + 'px';
        this.transit.style.top = (this.H/2 - this.R/2) + 'px';
        setTimeout(this.name + ".redo1()",10);
    }
    this.redo1 = function()
    {
        this.base.removeChild(this.transit);
        this.mkdisk(0);
        
    }
}
    var demo = null;
     
    function makecurve(base, c,w)
    {
        demo = new Spiral(base, "demo",w);
        demo.makexy();
        document.write("<style>");
        var c0 = c.replace(/[0-9][0-9]/,'88');
        var c1 = demo.light(c);
        
        var t1 = Math.round(demo.W/380*5);
        var t2 = Math.round(demo.W/380*20);
        var t3 = Math.round(demo.W/380*115);
        var t4 = Math.round(demo.W/380*130);
        var t5 = Math.round(demo.W/380*120);
        var t6 = Math.round(demo.W/380*130);
        document.write("@keyframes amplify  {  0%{top:" + t1 + "px;left:" + t2 + "px}  50%{top:" + t3 + "px;left:" + t4 + "px}  80%{top:" + t5 + "px;left:" + t6 + "px;transform:scale(4.29,4.29)} 100%{top:" + (demo.y[0]-demo.R/2) + "px;left:" + (demo.x[0]-demo.R/2) + "px;transform:scale(1, 1)}} ");
      //  if (browserinfo[0].toLowerCase()=='trident' && parseFloat(''+browserinfo[1]) <= 9)
        //if(isie())
        {    document.write("div.advanced{ background-image: -moz-radial-gradientt(circle," + c1 + "," +  c +");");
       document.write("background-image: -webkit-radial-gradient(circle, " + c1 + "," +   c +");");
       document.write("background-image: radial-gradient(circle," + c1 + "," +   c +");}");
   } /*else {document.write("div.advanced{ background-image: -moz-radial-gradient(25px 30px, circle cover, " + c1 +" 0%, " + c +" 30%, " + c +" 95%);");
       document.write("background-image: -webkit-radial-gradient(25px 30px, circle, " + c1 +", " + c +");");
       document.write("background-image: radial-gradient(25px 30px, circle cover," + c1 +" 0%, " + c +" 30%, " + c +" 100%);}\n");*/
      // }
       document.write(demo.makerun('diskrun')  );
        document.write(maketext('textshow' )  );
        
          for (var i=1; i <= w.length; i++)
        {
           document.write(demo.makekey('disk'+i,demo.x[i-1]-demo.R/2,demo.y[i-1]-demo.R/2,demo.x[i]-demo.R/2,demo.y[i]-demo.R/2)  );
        }
        for (var i=1; i < w.length; i++)
        {
           document.write(demo.makeline('line'+i,demo.x[i-1] ,demo.y[i-1] ,demo.x[i] ,demo.y[i] )  );
        }
         document.write("</style>");
        demo.conclude();
       
    }
 
 /*


try{

var n = 40, random = d3.randomNormal(0, .3), data = d3.range(n).map(random);

var svg = d3.select("svg"),
        margin = {top: 20, right: 20, bottom: 20, left: 40},
width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("class", "line").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear()
        .domain([1, n - 2])
        .range([0, width]);

var y = d3.scaleLinear()
        .domain([-1, 1])
        .range([height, 0]);

var line = d3.line()
        .curve(d3.curveBasis)
        .x(function (d, i) {
            return x(i);
        })
        .y(function (d, i) {
            return y(d);
        });

g.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

g.append("g")
        .attr("class", "axisgold")
        .attr("transform", "translate(0," + y(0) + ")")
        .call(d3.axisBottom(x));

g.append("g")
        .attr("class", "axisgold")
        .call(d3.axisLeft(y));

g.append("g")
        .attr("clip-path", "url(#clip)")
        .append("path")
        .datum(data)
        .attr("class", "line")
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .on("start", tick);
 

function tick() {

    // Push a new data point onto the back.
    data.push(random());

    // Redraw the line.
    d3.select(this)
            .attr("d", line)
            .attr("transform", null);

    // Slide it to the left.
    d3.active(this)
            .attr("transform", "translate(" + x(0) + ",0)")
            .transition()
            .on("start", tick);

    // Pop the old data point off the front.
    data.shift();

}
}catch(e){}
*/

function stopmodelshow()
{
    if (demo != null)   demo.stop = true;
}

function RoundRect(base, nm, ws, X, Y, W, H, R, color)
{
    this.X = X;
    this.Y = Y;
    this.W = W;
    this.H = H;
    this.w = 140;
    this.h = 30;
    if (base == null)
        this.base = document.body;
    else
    {
        this.base = base;
        base.style.position = "relative";
        this.W = base.offsetWidth;
        this.H = base.offsetHeight;
        this.X = Math.round(this.W/380*34);
        this.Y = Math.round(this.W/380*20);
        this.w = Math.round(this.W/380*140);
        this.h = Math.round(this.W/380*30);

    }

    this.name = nm;
    this.ws = ws;
    this.N = ws.length - 1;

    this.makerun = function (nm)
    {
        var N = 2;
        var s = '@keyframes ' + nm + '{';
        var g = 0;//1/N;
        for (var i = 1; i < N; i++)
        {
            g += Math.round(0.000001 + 4 * Math.abs(Math.cos(i / N * Math.PI)));
            if (i == N - 1)
                g = 100;
            s += g + "% {imagePosition:" + (this.w * i / N) + "px 0px}\n";
        }
        s += "}\n";
        
        return s;
    }

    this.makexy = function ()
    {
        var N = this.N;
        this.x = [this.X];
        this.y = [this.Y];
        var R = this.h + Math.round(this.W/380*15);
        for (var i = 1; ; i++)
        {
            if (this.y[i - 1] + R + this.h + Math.round(this.W/380*10) > this.H)
                break;
            this.y[i] = this.y[i - 1] + R;
            this.x[i] = this.x[i - 1];
        }
        this.y[i] = this.y[i - 1];
        this.x[i] = this.x[i - 1] + this.w + Math.round(this.W/380*33);
        for (i++; ; i++)
        {
            if (this.y[i - 1] - R - Math.round(this.W/380*10) < 0)
                break;
            this.y[i] = this.y[i - 1] - R;
            this.x[i] = this.x[i - 1];
        }
        this.N = i;
    }

    this.makelinkb = function (nm, x0, y0, x1, y1)
    {
        var m = parseInt(nm.replace(/[^0-9]/g, ''));
        var t1 = Math.round(this.W/380*80);
        var s = '@keyframes ' + nm + '{';
        if (x0 == x1)
        {
            if (y1 > y0)
                s += 'from {height:0px;opacity:0;top:' + y0 + 'px}\n  to {background-position:'+ t1 + 'px 0px;top:' + y0 + 'px;height:' + (y1 - y0) + "px;opacity:1}\n";
            else
                s += 'from {height:0px;opacity:0;top:' + y0 + 'px}\n  to {background-position:'+ t1 + 'px 0px;top:' + y1 + 'px;height:' + (y0 - y1) + "px;opacity:1}\n";
        } else
        {
            if (x1 > x0)
                s += 'from {left:0px;opacity:0;left:' + x0 + 'px;}\n   to {background-position:'+ t1 + 'px 0px;left:' + x0 + 'px;width:' + (x1 - x0) + "px;opacity:1}\n";
            else
                s += 'from {left:0px;opacity:0;left:' + x0 + 'px}\n   to {background-position:'+ t1 + 'px 0px;left:' + x1 + 'px;width:' + (x0 - x1) + "px;opacity:1}\n";
        }
        s += "}\n";


        return s;
    }
    this.makeMove = function (nm, x0, y0, x1, y1)
    {
        var m = parseInt(nm.replace(/[^0-9]/g, ''));

        var s = '@keyframes ' + nm + '{';
        if (x0 == x1)
            s += 'from {top:' + (y0) + "px;opacity:0}\n" + '  to {top:' + (y1) + "px;opacity:1}\n";
        else
            s += 'from {left:' + (x0) + "px;opacity:0}\n" + '  to {left:' + (x1) + "px;opacity:1}\n";
        s += "}\n";


        return s;
    }
    this.color = color;
    if (color == null)
        this.color = "#332288";
    this.light = function(c)
    {
        var r = parseInt(c.substring(1,3),16) + 130;
        var g = parseInt(c.substring(3,5),16) + 120;
        var b = parseInt(c.substring(5),16) + 70;
        if (r>255) r = 255;
        if (g>255) g = 255;
        if (b> 255) b = 255;
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
    this.mkdisk = function (i)
    {
        if (this.stop)
            return;
        var d = document.createElement('div');
        d.id = 'block' + i;
        var  fs = Math.round(this.W/380*16);
        var c1= this.light(this.color);
        d.style.cssText = "width:" + this.w + "px;height:" + (this.h ) + "px;color:#DDCC11;background:linear-gradient(to right," + this.color + "," + c1 + " " + (i%7) + "0%," + this.color + ");z-index:" + (60 - 3 * i) + ";font-size:" + fs + "px;padding:0px;text-align:center;vertical-align:middle;border-radius:15px;text-shadow:1px 1px #505050;border:1px #707070 outset;position:absolute;line-height:" + (this.h ) + "px;left:" + (this.x[i == 0 ? 0 : (i - 1)]) + "px;top:" + (this.y[i == 0 ? 0 : (i - 1)]) + "px" + (i==0?'':(';animation:blockMove' + i + " 2s 1"));
        d.innerHTML = (this.ws[i]);
        this.base.appendChild(d);

        if (i > 0  )
        {
            var p = document.createElement('div');
            p.id = 'link' + i;
            p.style.cssText = "z-index:0;position:absolute;background-color:#DDCCAA;width:" + this.h + "px;height:" + (this.h-3) + "px;left:"
                    + (this.x[i - 1] + this.w / 2-this.h/2 -3 ) + 'px;top:' + (this.y[i - 1]) + "px;animation:linkb" + i + " 2s 1";
            p.innerHTML = '';
            this.base.appendChild(p);
        }
        setTimeout(this.name + ".hold(" + i + ")", 2000);
    }
    this.hold = function (i)
    {
        if (i > 0) {
            var z = document.getElementById('block' + i);
            z.style.zIndex = i + 50;
            z.style.left = (this.x[i] ) + 'px';
            z.style.top = (this.y[i] ) + 'px';

            var r = document.getElementById('link' + i);
            if (r!=null)
            {
            if (this.x[i] == this.x[i - 1])
            {
                if (this.y[i] > this.y[i - 1])
                {
                    r.style.height = (this.y[i] - this.y[i - 1] ) + 'px';
                    r.style.top = Math.abs(this.y[i - 1]+this.h/2) + 'px';
                } else
                {
                    r.style.height = (this.y[i - 1] - this.y[i] ) + 'px';
                    r.style.top = Math.abs(this.y[i]+this.h/2) + 'px';
                }
            } else
            {
                if (this.x[i] > this.x[i - 1])
                {
                    r.style.width = Math.abs(this.x[i] - this.x[i - 1] ) + 'px';
                    r.style.left = (this.x[i - 1]+this.w/2) + 'px';
                } else
                {
                    r.style.width = Math.abs(this.x[i - 1] - this.x[i] ) + 'px';
                    r.style.left = (this.x[i] + this.w/2) + 'px';
                }
            }
            }
        }

        if (i + 1 <= this.N)
            this.mkdisk(i + 1);
        else
            this.conclude();
    }
    this.transit = null;
    this.conclude = function ()
    {
        if (this.count == 1)
            this.stop = true;
        this.count++;
        if (this.stop)
            return;
        var x = 0, y = 0;
        if (document.getElementById('link1') != null)
        {
            for (var i = 1; i <= this.N; i++)
                this.base.removeChild(document.getElementById('link' + i));
            for (var i = 0; i <= this.N; i++)
                this.base.removeChild(document.getElementById('block' + i));
        }
        this.transit = document.createElement('div');
         var c1= this.light(this.color);
        this.transit.style.cssText = "position:absolute;color:#DDCC11;background:linear-gradient(to right," + this.color + "," + c1 + " 70%," + this.color  + ");z-index:" + (20) + ";font-size:" + Math.round(this.W/380*18) + "px;padding:0px;text-align:center;vertical-align:middle;border-radius:15px;text-shadow:1px 1px #505050;border:1px #707070 outset;position:absolute;line-height:" + (this.h ) + "px;left:" + this.X + 'px;top:' +
                this.Y + 'px;width:' + this.w + 'px;height:' + this.h + 'px;animation:amplifyb 4s 1;color:#DDCC11;font-size:' + Math.round(this.W/380*18) + 'px;font-weight:700;text-shadow:1px 1px #606060;';
        this.transit.innerHTML = this.ws[this.N];
        this.base.appendChild(this.transit);
         
        setTimeout(this.name + ".redo()", 4000);
    }
    this.stop = false;
    this.count = 0;
    this.redo = function ()
    {
        this.transit.style.left = (this.X) + 'px';
        this.transit.style.top = (this.Y) + 'px';
        setTimeout(this.name + ".redo1()", 10);
    }
    this.redo1 = function ()
    {
        this.base.removeChild(this.transit);
        this.mkdisk(0);
    }
}
var blocks;
function makeblocks(base, c, w)
{
    blocks = new RoundRect(base, "blocks", w);
    blocks.makexy();
    document.write("<style>");
    var c0 = c.replace(/[0-9][0-9]/, '88');
    blocks.color = c;
    var c1 = c.replace(/(...)[0-9][0-9]/, '$143');
    blocks.color = c1;
    var t1 = Math.round(w/380*20);
    var t2 = Math.round(w/380*140);
    var t3 = Math.round(w/380*140);
    var t4 = Math.round(w/380*140+40);
    document.write("@keyframes amplifyb  {  0%{top:" + t1 + "px;left:" + t2 + "px}   80%{top:" + t3 + "px;left:" + t4 + "px;transform:scale(2.5 ,2.5 )} 100%{top:" + (blocks.Y+5) + "px;left:" + (blocks.X+80) + "px;transform:scale(1, 1)}} ");
     ;
    document.write(maketext('textshow'));

    for (var i = 1; i <= blocks.N; i++)
    {
        document.write(blocks.makeMove('blockMove' + i, blocks.x[i - 1], blocks.y[i - 1], blocks.x[i], blocks.y[i]));
    }
    for (var i = 1; i <  blocks.N; i++)
    {
        document.write(blocks.makelinkb('linkb' + i, blocks.x[i - 1]+5 , blocks.y[i - 1]+5 , blocks.x[i ]+5 , blocks.y[i ]+5 ));
    }
    document.write(blocks.makelinkb('linkb' + i, blocks.x[i - 1]+5 , blocks.y[i - 1]+5 , blocks.x[0]+10 , blocks.y[0]+5 ));
    
    document.write("</style>");
    blocks.conclude();

}
function makefirstone()
{
    if (document.getElementById('screen')!=null)
    makecurve(document.getElementById('screen'), IBGCOLOR, textmsg[1821].split(/@/));
}
function makesecondone()
{
    if (document.getElementById('major')!=null)
    makeblocks(document.getElementById('major'), IBGCOLOR, textmsg[1822].split(/@/));
}
if (document.getElementById('screen')!=null)
{
    if (textmsg.length>2){

        makefirstone();
        makesecondone();
    }
    else
    {
        makecurve(document.getElementById('screen'), IBGCOLOR, textmsg[0].split(/@/));
        makeblocks(document.getElementById('major'), IBGCOLOR, textmsg[1].split(/@/));
    }
}