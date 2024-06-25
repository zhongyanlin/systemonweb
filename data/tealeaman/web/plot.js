  
var Plot =
{
     datatobeplot:null, 
     enableregress:function()
     {
         var jsele = document.getElementById("jschart");
         if (jsele==null)
         {

             jsele = document.createElement("script");
             jsele.id = "jschart";
             jsele.type = "text/javascript";
             jsele.src  = "https://www.google.com/jsapi";
             document.getElementsByTagName("head")[0].appendChild(jsele);

         }
     },
     drawChart:function() 
     {
            var data  = google.visualization.arrayToDataTable(Plot.datatobeplot);
            var options = 
           {
              legend: 'none',
              width: 600,
              height: 500
            };
            var chart = new google.charts.Line(document.getElementById('curve_chart'));
            chart.draw(data, options);
    },
     plotd : function(ta)
     {
     if (typeof(google) == 'undefined')
     {
          Plot.enableregress();
          myprompt('Click it again');
           return;
     }

     Plot.datatobeplot = []; 
     var data1 = ta.value.split(/\n/);
     var d = data1[0].replace(/^[ ]+/,'').replace(/[ ]+$/,'').split(/[ ]+/);
     var j0 = 0;
     if (isNaN(data1[0].replace(/ /g,''))) 
     {
         Plot.datatobeplot[0] = d;
     }
     else
     {
         j0 = 1;
         Plot.datatobeplot[0] = ['x'];
         for (var k=1; k < d.length; k++)
           Plot.datatobeplot[0][k] = 'y'+ k;  
     }
     for (var i=1; i < data1.length + j0; i++)
     {
         Plot.datatobeplot[i]  = [];
         d = data1[i-j0].replace(/^[ ]+/,'').replace(/[ ]+$/,'').split(/[ ]+/);
         for (var j=0; j < d.length; j++)
             Plot.datatobeplot[i][j] = parseFloat(d[j]);
     }
     myprompt("<div id=\"curve_chart\" style=\"width:600px;height:500px\"></div>", null,null, "Line Chart");

     if (typeof(google.load) == 'undefined')
         alert('Google is not accessiable from your computer')
     else
         google.load('visualization', '1.1', {packages:['line'], callback:  Plot.drawChart});

     }
 };
 var onloadbeforeplot = null;
 if (typeof(rdapname) != 'undefined')
 {
     onbegin += ";Plot.enableregress();";
 }
 else
 {
     if (typeof (window.onload) == 'function')
         onloadbeforeplot = window.onload;
     window.onload = function()
     {
        Plot.enableregress();
        if (onloadbeforeplot!=null) 
            onloadbeforeplot();
     }
 }
 
 var hasloadedchat = false;
var xDatum, yDatum;
function lineplot1(d)
{
    var x = new Array(), y = new Array();
    for (var i in d)
    {
       x[x.length] = d[i][0];
       y[y.length] = d[i][1];
    }
    generateLineChart(x, y) ;
}
function lineplot2(d)
{
    lineplot(d.value)
}
function lineplot(d)
{
     var ln = d.split(/\n/);
     var x = new Array(), y = new Array();
     for (var i in ln)
     {
        if (ln[i].length<2) continue;
        var z = ln[i].replace(/^[^0-9]+/,'').replace(/[^0-9]+$/,'').split(/[^\.0-9]+/);
        if (z.length != 2) continue;
        x[x.length] = parseFloat(z[0]);
        y[y.length] = parseFloat(z[1]);
     } 
     generateLineChart(x, y) ;
}
function generateLineChart(xData, yData) 
{
  if (hasloadedchat == false) 
 {
  xDatum = xData;  
  yDatum = yData;
  var script = document.createElement('script');
  script.onload = function() 
 {
      hasloadedchat = true;
      generateLineChart(xDatum, yDatum);
 }
  document.head.appendChild(script);
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
  return;
  }
  myprompt('<canvas id="plotctx" width="410" height="210"></canvas>',null,null, "plot");
  var ctx = document.getElementById('plotctx');
  promptwin.style.width = '410px';
  promptwin.style.height = '210px';
  
    //document.body.appendChild(ctx);
    var context = ctx.getContext('2d');
    var chart = new Chart(context, {
      type: 'line',
      data: {
        labels: xData,
        datasets: [{
          label: 'Data',
          data: yData,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      }
  });
}

