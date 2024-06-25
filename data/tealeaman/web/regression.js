
var Regress =
{
    c : [-1, -1],
    i : 0,
    slope : 0,
    det:0,
    b: 0,
    type: 0,
    op: 'c',
    istable: false,
    code :0,
    datatobeplot:null,
    lastt:0,
    doingcolumn:-1,
    retrv: function(i,j, t)
    {
        if (Regress.istable)
            return retrv(i-1,j);
         return Regress.trim(t.rows[i].cells[j].innerHTML);
    },
    docell: function(th)
    {
        var t = document.getElementById("maintable");
        var r = t.rows[1];
        var i = 0;
        if (Regress.istable)
        {
             for ( i=0; i < numCols; i++)
            {
                if  (ele(0,i) == th ) break;
            }
        }
        else
        {
            for ( i=0; i < r.cells.length; i++)
            {
               if  (r.cells[i] == th ) break;
            }
        }
        
        for (var j=0; j < Regress.i; j++)
        {
           if  (Regress.c[j] == i) break;
        }
        if (j < Regress.i)
        {
            if (j == 0)
            {
                Regress.clear();
                return;
            }
            if (Regress.istable)
            {
                for (var k=0; k < numRows; k++)
                    ele(k,i).style.backgroundColor = TBGCOLOR; 
            }
            else
            {
                for (var k=1; k < t.rows.length; k++)
                   t.rows[k].cells[i].style.backgroundColor = TBGCOLOR; 
            }
            
            if ( j < Regress.i-1)
            {
               Regress.c[j] = Regress.c[Regress.i-1];
            }
            Regress.i--;
            Regress.showmenu();
            return;
        }

       if (Regress.istable)
        {
            for (var k=0; k < numRows; k++)
            {
                ele(k,i).style.backgroundColor = '#eee'; 
            }
        }
        else
        {
            for (var k=1; k < t.rows.length; k++)
               t.rows[k].cells[i].style.backgroundColor ='#eee'; 
        }
        
        Regress.c[Regress.i] = i;
        Regress.i++; 
        Regress.showmenu();
                //Regress.regress(Regress.c[0], Regress.c[1]);
    },
    enableregress : function ()
    {
        Regress.istable =(datapresentformat=="DataTable");
         
        var t = document.getElementById("maintable");
        var r = t.rows[1];
        var i = 0;
        if (Regress.istable)
        {    
            for ( i=0; i < numCols; i++)
            {
                ele(0,i).onclick = function()
                {
                   Regress.docell(this);
                }
            }
        }
        else
        {   
            for (  i=0; i < r.cells.length; i++)
            {
                r.cells[i].onclick = function()
                {
                     Regress.docell(this);
                }
            }
        }
       var script = document.createElement("script");
       script.type = "text/javascript";
       script.src  = "https://www.google.com/jsapi";
       document.getElementsByTagName("head")[0].appendChild(script);
    },
    expand:function(td,dx,dy)
    {
        if (   (new Date()).getTime() - Regress.lastt < 2000)
            return;
        var d = document.getElementById('chart_div'); 
        d.style.width = (d.offsetWidth + dx) + 'px';
        d.style.height = (d.offsetHeight + dy) + 'px';
        Regress.lastt = (new Date()).getTime();
    },
    dontdo : function()
    {
        var d = document.getElementById("opmenu");
        if (d !=null) document.body.removeChild(d);
    },
    showmenu: function()
    {
        var d = document.getElementById("opmenu");
        if (d !=null) document.body.removeChild(d);
         var t = document.getElementById("maintable"); 
        var xy = null;
        
        if (Regress.i == 1)
        {
            if (Regress.istable)
            { 
                xy = findPositionnoScrolling(   ele(0, Regress.c[0]) );
            }
            else
                xy = findPositionnoScrolling(t.rows[1].cells[Regress.c[0]]);
            var d = document.createElement("div");
            d.id = "opmenu";
            d.style.cssText = "position:absolute;z-index:20;font-weight:700;border:1px #b0b0b0 outset; border-radius: 3px; background-color:" + IBGCOLOR + ";color:#DDCC11;top:" + xy[1] + "px;left:" + xy[0] + "px";
            var ss = "<table>";
            ss += "<tr><td onclick=\"Regress.histogram(" + Regress.c[0]  + ")\">Histogram</td></tr>\n";
            ss += "</table>";
            d.innerHTML = ss;
            document.body.appendChild(d);
             
        }
        else
        {
            if (Regress.istable)
            { 
                xy = findPositionnoScrolling(   ele(0, Regress.c[Regress.i-1]) );
            }
            else
                xy = findPositionnoScrolling(t.rows[1].cells[Regress.c[Regress.i-1]]);
            var d = document.createElement("div");
            d.id = "opmenu";
            d.style.cssText = "position:absolute;z-index:20;font-weight:700;border:1px #b0b0b0 outset; border-radius: 3px; background-color:" + IBGCOLOR + ";color:#DDCC11;top:" + xy[1] + "px;left:" + xy[0] + "px";
            var ss = "<table>";
            ss += "<tr><td onclick=\"Regress.histogram(" + Regress.c[Regress.i-1]  + ")\">Histogram</td></tr>\n";
            if (Regress.i == 2)
            {
                ss += "<tr><td onclick=\"Regress.regress()\">Regression</td></tr>\n";
            }
            ss += "<tr><td onclick=\"Regress.stat(1)\">Count&nbsp;by&nbsp;" + labels[Regress.c[0]].replace(/([a-z])([A-Z])/g, '$1&nbsp;$2') + "</td></tr>\n";
            ss += "<tr><td onclick=\"Regress.stat(2)\">Sum&nbsp;by&nbsp;" + labels[Regress.c[0]].replace(/([a-z])([A-Z])/g, '$1&nbsp;$2') + "</td></tr>\n";
            ss += "<tr><td onclick=\"Regress.stat(3)\">Avg&nbsp;by&nbsp;" + labels[Regress.c[0]].replace(/([a-z])([A-Z])/g, '$1&nbsp;$2') + "</td></tr>\n";
            ss += "<tr><td onclick=\"Regress.plot()\">Plot&nbsp;vs.&nbsp;" + labels[Regress.c[0]].replace(/([a-z])([A-Z])/g, '$1&nbsp;$2') + "</td></tr>\n";
            ss += "<tr><td onclick=\"Regress.clear()\">Close</td></tr>";
            ss += "</table>";
            d.innerHTML = ss;
            document.body.appendChild(d);
        }
    },
    trim : function(s)
    {
        return s.replace(/^&nbsp;/g,'').replace(/&nbsp;$/g,'').replace(/^[ ]+/,'').replace(/[ ]+$/,''); 
    },
    stat: function(code)
    {
        Regress.code = code;
        google.load("visualization", "1", {packages:["corechart"], callback: Regress.dostat});
    },
    
    plot : function()
   {
         var j = Regress.c[0];
         Regress.sort(j);
         Regress.doingcolumn = j;
         Regress.datatobeplot = [];
         var t = document.getElementById("maintable"); 
         Regress.datatobeplot[0] = [];
         for (var i=0; i < Regress.i; i++)
         Regress.datatobeplot[0][i] = labels[Regress.c[i]].replace(/([a-z])([A-Z])/g,'$1 $2');
         var N = numRows;
         var j0 = 0;
         if (Regress.istable) 
         {
             j0 = 1;
             N++;
         }
         var X = new Array();
         for (var k=1; k < N; k++)
         {
             var x = retrv(k-j0, Regress.c[0]);
             if (X[x] != null)
             {
                 myprompt("Values in " + labels[Regress.c[0]] + " are not distinct. User Sum by or Average by instead");
                 return;
             }
             else
             {
                 X[x] = "1"; 
             }
             Regress.datatobeplot[k]  = [];
             for (var i=0; i < Regress.i; i++)
                 if (dtype[Regress.c[i]])
                    Regress.datatobeplot[k][i] =  parseFloat(retrv(k-j0, Regress.c[i]));
                 else
                    Regress.datatobeplot[k][i] =   retrv(k-j0, Regress.c[i]);
         } 
         myprompt("<div id=\"curve_chart\" style=\"width:600px;height:500px\"></div>", null,null, "Plot");
         if (typeof(google.load) == 'undefined')
             myprompt('Oops! google.com is not accessible')
         else
             google.load('visualization', '1.1', {packages:['line'], callback:Regress.drawPlot});
          
    },
    drawPlot:function() 
    {
            var data  = google.visualization.arrayToDataTable(Regress.datatobeplot);
            var options = 
           {
              title: 'Linear Interpolation Plot against ' + labels[Regress.doingcolumn],
              legend: 'none',
              width: 600,
              height: 500
            };
            var chart = new google.charts.Line(document.getElementById('curve_chart'));
            chart.draw(data, options);
    },
    
    sort : function(j)
    {
        if (Regress.isTable)
            sort(j);
        else
        {   
            var t = document.getElementById("maintable"); 
            sort1(j, t.rows[0].cells[j]);
        }
    },
     
    histogram : function(j)
   {
         var t = document.getElementById("maintable"); 
         Regress.sort(j);
          
         Regress.doingcolumn = j;
         Regress.datatobeplot = [];
         
         
         var w = [];
         var Z = t.rows.length;
         if (Regress.istable)
             Z = numRows+1;
         var isfloat = false;
         for (var i=1; i < Z; i++)
        {
             w[i-1] = Regress.retrv(i, j, t);
             if (w[i-1].indexOf(".") >= 0)
                 isfloat = true;
         }
         Regress.datatobeplot[0] = [labels[j], "Frequency"];
         if (dtype[j] && isfloat )
         {
             var min = parseFloat(w[0]),max = min;
             for (var i=1; i < w.length; i++)
             {
                 var ff = parseFloat(w[i]);
                 if ( ff > max) max = ff;
                 else if (ff < min) min = ff;
             }
             var N = 100;
             var X = new Array(N), Y=new Array(N);
             for (var i=0; i < X.length; i++)
             {
                 X[i] = min + (max-min)*(i+0.5)/N;
                 Y[i] = 0;
             }
             for (var i=0; i < w.length; i++)
             {
                 var ff = parseFloat(w[i]);
                 var k = Math.floor( (ff - min)*N/(max-min));
                 Y[k]++;
             }

             for (i =0; i < N; i++)
                Regress.datatobeplot[i+1] = [X[i], Y[i]];
            myprompt("<div id=\"curve_chart\" style=\"width:600px;height:500px\"></div>", null,null, "Distribution");
            if (typeof(google.load) == 'undefined')
               myprompt('Oops! google.com is not accessible')
            else
                google.load('visualization', '1.1', {packages:['line'], callback:  Regress.drawHisto});
         }
         else
         {
             var X = Array();
             for (var i=0; i < w.length; i++)
             {
                 if (X[w[i]] == null)
                 {
                     X[w[i]] = 1;
                     Regress.datatobeplot[Regress.datatobeplot.length] = [w[i],0]; 
                 }
                 else
                 {
                     X[w[i]] = X[w[i]] + 1;
                 }
             }
             for (i=1; i < Regress.datatobeplot.length; i++)
                Regress.datatobeplot[i][1] = X[Regress.datatobeplot[i][0]]; 
             myprompt("<div id=\"curve_chart\" style=\"width:600px;height:500px\"></div>", null,null, "Histogram");
             if (typeof(google.load) == 'undefined')
                 myprompt('Oops! google.com is not accessible')
             else
                 google.load('visualization', '1', {packages:['corechart'], callback:  Regress.drawCount});

         }
     },
    
    drawHisto:function() 
     {
            var data  = google.visualization.arrayToDataTable(Regress.datatobeplot);
            var options = 
           {
              title: 'Distribution of ' + labels[Regress.doingcolumn],
              legend: 'none',
              width: 600,
              height: 500
            };
            var chart = new google.charts.Line(document.getElementById('curve_chart'));
            chart.draw(data, options);
    },
    drawCount:function() 
    
    {
            var data = google.visualization.arrayToDataTable(Regress.datatobeplot);
            var view = new google.visualization.DataView(data);
            var options = 
            {
              title: 'Histogram of ' + labels[Regress.doingcolumn],
              //curveType: 'function',
              legend: { position: 'bottom' },
              width: 600,
              height: 500
            };
            var chart = new google.visualization.ColumnChart(document.getElementById('curve_chart'));
            chart.draw(view, options);
    },
    dostat:function () 
    {
         Regress.sort(Regress.c[0]);
         var code = Regress.code;
         var t = document.getElementById("maintable"); 
         var d = new Array();
         d[0] = [];
         var M = Regress.i;
         if (code == 1) M = 2;
         for (var j=0; j < M; j++)
             d[0][j] = labels[Regress.c[j]].replace(/([a-z])([A-Z])/g,'$1 $2');
        var xx = "," 
        
        var Z = t.rows.length;
        if (Regress.istable)
            Z = numRows+1;
        
        for (var k=1; k < Z; k++)
        {
           var a = Regress.retrv(k, Regress.c[0], t);
           if (xx.indexOf("," + a + ",") < 0)
               xx += a + ","
        }
        var y = new Array(M);
         for (var j=0; j< M; j++)
         {
             y[j] = new Array();
         }
        for (var k=1; k < Z; k++)
        {
             var a = Regress.retrv(k, Regress.c[0], t);;
             for (var j=1; j< M; j++)
             {
                 var b = Regress.retrv(k, Regress.c[j], t);
                 var z = y[j][a];
                 if (z == null) z = 0;
                 if (code == 1)
                   y[j][a] = z + 1;
                 else if (code >= 2)
                   y[j][a] = z + (isNaN(b)?0:parseFloat(b));
                 z = y[0][a];
                 if (z == null) z = 0;
                 y[0][a] = z + 1;
             }
        }
        var w = xx.replace(/^,/,'').replace(/,$/,'').split(/,/);
        for (var l=0; l < w.length; l++)
        {
            d[1+l] = new Array();
            d[1+l][0] = w[l];
            for (var k=1; k < M; k++)
              d[l+1][k] = code==3? y[k][w[l]]/y[0][w[l]] :  y[k][w[l]];
        }
        var data = google.visualization.arrayToDataTable(d);
        var tl = 'Count by ' + labels[Regress.c[0]].replace(/([a-z])([A-Z])/g, '$1 $2');
        if (code == 2) tl = 'Sum by ' + labels[Regress.c[0]].replace(/([a-z])([A-Z])/g, '$1 $2');
        else if (code == 3) tl = 'Average by ' + labels[Regress.c[0]].replace(/([a-z])([A-Z])/g, '$1 $2');
        var options = {
          title: tl,
          vAxis: {title: labels[Regress.c[0]].replace(/([a-z])([A-Z])/g, '$1 $2'),  titleTextStyle: {color: 'red'}},
          width: 600,
          height: 500
        };
        myprompt("<div id=chart_div width=600 height=500 ></td>", null, null, tl);
        var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
        chart.draw(data, options);
        new ResizeRounded(promptwin, Regress.expand);
      },      
    regress : function ()
    {
        var k = Regress.c[0];
        var j = Regress.c[1];
        var  n = 0;    
        var  sumx = 0.0, sumy = 0.0, sumx2 = 0.0;
        var t = document.getElementById("maintable"); 
        var x = new Array(t.rows.length-1);
        var y = new Array(t.rows.length-1);
        var N = 0;
        var Z = t.rows.length;
        if (Regress.istable)
            Z = numRows+1;
        
        while( N < Z-1 )
        {
            var a = Regress.retrv(N+1,k,t);
            var b = Regress.retrv(N+1, j, t);
            if ( a== '' || b == '')
            {
                N++;
                continue;
            }
            x[n] =  parseFloat(a);
            y[n] =  parseFloat(b);
            if ('' + x[n] == 'NaN' || '' + y[n] == 'NaN' )
            {
                N++;
                continue;
            }
            sumx  += x[n];
            sumx2 += x[n] * x[n];
            sumy  += y[n];
            n++;
            N++; 
        }
        if (n < 2) 
        {
            myprompt("n < 2");
            return;
        }
       var  xbar = sumx / n;
       var  ybar = sumy / n;
       var  xxbar = 0.0, yybar = 0.0, xybar = 0.0;
        for (var  i = 0; i < n; i++) 
        {
            xxbar += (x[i] - xbar) * (x[i] - xbar);
            yybar += (y[i] - ybar) * (y[i] - ybar);
            xybar += (x[i] - xbar) * (y[i] - ybar);
        }
        var  beta1 = xybar / xxbar;
        var  beta0 = ybar - beta1 * xbar;
        var  df = n - 2;
        var  rss = 0.0;      // residual sum of squares
        var  ssr = 0.0;      // regression sum of squares
        for (var  i = 0; i < n; i++) 
        {
            var  fit = beta1*x[i] + beta0;
            rss += (fit - y[i]) * (fit - y[i]); //SSE
            ssr += (fit - ybar) * (fit - ybar); //SSM
        }
        var  R2    = ssr / yybar;
        var  svar  = rss / df;   //MSE
        var  svar1 = svar / xxbar;  
        var  svar0 = svar/n + xbar*xbar*svar1;
        var Fstat=ssr/svar;//8/4/2014
        Regress.slope = beta1;
        Regress.b = beta0;
        Regress.det = R2;
        Regress.type = 0;
        Regress.draw();
    },
    drawChart : function() 
   {
    var dr = 
    [
        ['X', 'Y1', 'Y2'],
    ];
    var n=0;
    var t = document.getElementById("maintable"); 
    var minx, maxx, miny, maxy;
    var N = 0;
    var Z = t.rows.length;
   if (Regress.istable) Z = numRows+1;
    while( N < Z-1 )
    {
        var a = Regress.retrv(N+1, Regress.c[0], t);
        var b = Regress.retrv(N+1, Regress.c[1], t);
        if (a == '' || b == '')
        {
            N++;
            continue;
        }
        var x =  parseFloat(a);
        var y =  parseFloat(b);
        dr[dr.length] = [x, y,null ];
        if (n == 0)
        {
            minx = maxx = x;
            miny = maxy = y;
        }
        else
        {
            if (minx > x) minx = x;
            if (maxx < x) maxx = x;
            if (miny > y) miny = y;
            if (maxy < y) maxy = y;
        }
        n++;
        N++;
    }
    
    var y = Regress.slope*minx + Regress.b;
    if ( y <= maxy && y >= miny)
    {
        dr[dr.length] = [minx, null,y];
        var y1 = Regress.slope*maxx + Regress.b;
        if (y1 <= maxy && y1 >= miny)
        {
           dr[dr.length] = [maxx, null,y1];
        }
        else
        {
            var x = (-Regress.b + maxy)/Regress.slope;
            if (x >= minx && x <= maxx)
            {
                dr[dr.length] = [x, null,maxy];
            }
            else
            {
                x = (-Regress.b + miny)/Regress.slope;
                dr[dr.length] = [x, null,miny];
            }
        }
    }
    else
    {
            var x = (-Regress.b + maxy)/Regress.slope;
            if (x >= minx && x <= maxx)
            {
                dr[dr.length] = [x, null,maxy];
                var y = Regress.slope*maxx + Regress.b;
               if ( y <= maxy && y >= miny)
               {
                  dr[dr.length] = [maxx, null,y]; 
               }
               else
               {
                  x = (-Regress.b + miny)/Regress.slope; 
                  dr[dr.length] = [x, null,miny]; 
               }
            }
            else
            {
                x = (-Regress.b + miny)/Regress.slope;
                dr[dr.length] = [x, null,miny];
                dr[dr.length] = [maxx, null, Regress.slope*maxx + Regress.b];
            }
    }
    
    var data = google.visualization.arrayToDataTable(dr);
    
    var options = 
    {
        title: "y=" + Regress.slope + "*x + " + Regress.b + ", R2=" + Regress.det,
        hAxis: {title: labels[Regress.c[0]].replace(/([a-z])([A-Z])/g,'$1 $2')},
        vAxis: {title: labels[Regress.c[1]].replace(/([a-z])([A-Z])/g,'$1 $2')},
        legend: 'none',
        trendlines: {0: {}, 1: {}},
        width: 600,
        height: 500
    };
    myprompt("<div id=chart_div  width=600 height=500 ></div>",null,null,"Linear Regression");
    var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
    chart.draw(data, options);
    new ResizeRounded(promptwin, Regress.expand);
    //promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].onclick
    //    = function(){Regress.clear();closeprompt();}
},
    draw : function()
   {
    google.load('visualization', '1', {packages:['corechart'], callback: Regress.drawChart});
},
    clear : function()
   {
   var t = document.getElementById("maintable"); 
   for (var j=0; j < Regress.i; j++)
   {
       if (Regress.istable)
       {
           for (var k=0; k < numRows; k++)
           {
                ele(k,Regress.c[j]).style.backgroundColor = TBGCOLOR; 
           }
       }
       else
       {
           for (var k=1; k < t.rows.length; k++)
           {
               t.rows[k].cells[Regress.c[j]].style.backgroundColor = TBGCOLOR;
           }
       }
   }
   Regress.i = 0;
   Regress.showmenu();
   Regress.dontdo();
}
};

onbegin += ";Regress.enableregress();";

