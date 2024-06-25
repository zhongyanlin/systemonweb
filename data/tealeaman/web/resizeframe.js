
function resizeframe()
{
     var fm = document.getElementsByTagName("iframe");
     if (fm==null) return;
     var wd = screen.width;
     if (typeof (self.innerWidth) != 'undefined')
     {
       wd = self.innerWidth ;
     }
     else
     {
       wd = document.body.offsetWidth ;
     }

     var het = screen.height;
     if (typeof (self.innerHeight) != 'undefined')
     {
         het= self.innerHeight ;
     }
     else
     {
         het= document.body.offsetHeight ;
     }
      
      for (var i=0; i < fm.length; i++)
      {
          if (fm[i].name=="w"+tstmp) continue;
          fm[i].width = wd - 12;
          if (fm.length==1)
              fm[i].height = (het - 200) + "px";
          else
              fm[i].height = wd;
      }
}
resizeframe();
if(typeof (window.onresize) == 'function')
{
     
    var theexisting = onresize;
    window.onresize = function()
    {
      theexisting();
      resizeframe();
    }; 
}
else
{
    window.onresize = resizeframe;
}

var C = [1,1,1,1];
   
   var order = 1;
   function sort(td, j)
   {
       var tr = td.parentNode;
       var tbl = tr.parentNode; 
       if (tbl.tagName.toLowerCase()!='table') tbl = tbl.parentNode;
       
       var x = [];
        
       order = C[j]; 
       C[j] *= -1;
       var xx = "";
       for (var i=0; i < N; i++)
       {
           x[i] = document.getElementById('msg'+i).rows[0].cells[j].innerHTML.replace(/<[^>]+>/g,'');
           if (j==0) 
               x[i] = x[i].replace(/(.*):([^:]+)$/,"$2:$1").replace(/[\r|\n]/,'');
           xx += x[i] + "\n";
       }
       
       var y = []; for (var i=0; i<x.length; i++) y[i] = i;
       y.sort(function(p,q){ if (j==0) if (x[p] > x[q]) return order; if (x[p] < x[q]) return -order; return order*(p - q);});
       var ll = tbl.rows[0].cells.length + 1; 
       for (var k=0; k < ll; k++)
       {
           var m =0, n = k; if (k==ll-1) {m=1; n = 0;}
           for (var i=0; i < N; i++)
           {
               x[i] = document.getElementById('msg'+i).rows[m].cells[n].innerHTML;
           }
           for (var i=0; i < N; i++)
           {
               document.getElementById('msg'+i).rows[m].cells[n].innerHTML = x[y[i]];
           }
       }
         
   }