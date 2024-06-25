resizebut(document.f3);
resizebut(document.f1);
for (var i=1; i < document.f3.elements.length; i++)
{
   document.f3.elements[i].style.height = document.f1.id.offsetHeight;
}
for (var i=0; i < document.f1.elements.length; i++)
{
   document.f1.elements[i].style.height = document.f1.id.offsetHeight;
}
if (typeof cats != 'undefined')
{
var total = 0;
var zz = new Array(cats.length);
for (var i=0; i < cats.length; i++)
{
   var j = nums[i];
   var k=0;
   while (j <z.length && cats[i]==z[j][2])
   {
      if (z[j][4]== -1)
         k++;
      j++;
   }
   zz[i] = k; total += k;
}
var n2 = 0; var part = 0;
for (; n2 < cats.length; n2++)
{
  part += zz[n2];
  if (part >= total/2) break;
}
if (n2>0) n2--;

var l = 1;


function bycat(zz)
{
   l = 1;
   if (zz==null) sortby(2);
   var overv = document.getElementById("overv");

   if (overv!=null)
   for (var j=overv.rows.length-1; j >=0; j--)
      overv.deleteRow(j);

   var rw = overv.insertRow(0);

   var xx = rw.insertCell(0);
   xx.setAttribute("valign","top");
   var str = "";
 
for (var i=0; i < cats.length; i++)
{
   if (cats[i]=="") continue;
   str += ("<b>" + (l++) + ". " + cats[i] +"</b>");
   var j = nums[i];
   while (j <z.length && cats[i]==z[j][2])
   {
      if (z[j][4]== -1)
      {
      var subdb = "";
      if (z[j][3]!='')
         subdb = "&subdb=" + z[j][3] +"&cdrdap=1";
      if (z[j][5] == 1)
        subdb += "&df=1"; 
      str += ("<br>&nbsp;&nbsp;<nobr><a href=Form?rdap=" + z[j][0] + subdb +" target=_blank>[" + z[j][0] +"] " + z[j][1] +"</a></nobr> ");
      }
      j++;
   }
   str +=  "<br>" ;
   if (i==n2)
   {

      xx.innerHTML = str;
      xx = rw.insertCell(1);
      xx.setAttribute("valign","top");
      var str = "";
   }
}
  
   xx.innerHTML = str;
}

function search()
{
   var pat = document.getElementById("pat").value;
   if (pat=='') return;
   var spc = "$^*()=-[]\\|.";
   pat = pat.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
   for (var i=0; i < pat.length; i++)
   {
      if (spc.indexOf(pat.charAt(i))>=0)
      {
         pat = pat.substring(0,i) + "\\" + pat.substring(i);
         i++;
      }
   }
   pat = pat.replace(/[ ]+/, ".*");

   var reg = new RegExp(pat);

   var k = 0;
   var overv = document.getElementById("overv");
   for (var i = 0; i < overv.rows.length; i++)
   for (var j = 0; j < overv.rows[0].cells.length; j++)
   {
      var str  = overv.rows[i].cells[j].innerHTML;
      var nospan = str.replace(/<span[^>]+>/g, "").replace(/<.span>/g, "");
      var k = 0, l2 = 0, l1 = 0; str = "";
      while (k <= nospan.length)
      {
         if ( k==nospan.length || nospan.charAt(k) == '<' )
         {
            var m = reg.exec(nospan.substring(l2,k));
            if (m!=null)
            {
               var fd = '' + m;
               var n = nospan.indexOf(fd, l2);
               str += nospan.substring(l2, n)
                   + "<span style=background-color:purple;color:white>"
                   + fd +"</span>" + nospan.substring(n + fd.length, k);
            }
            else
               str += nospan.substring(l2, k);
            l1 = k;
         }
         else if (nospan.charAt(k) == '>')
         {
            l2 = k+1;
            str += nospan.substring(l1,l2);
         }
         k++;
      }

      overv.rows[i].cells[j].innerHTML = str;
   }
   

}

function padd(x, mx)
{
   for (var i=x.length; i <= mx; i++)
     x = x + " ";
   return x;
}
function padd1(i, m)
{
   var x = "" + i;
   var mx = ("" + m).length;
   for (var i=x.length; i <= mx; i++)
     x = " " + x;
   return x;
}
function sortby(c)
{
   var mx = 0;
   for (var i=0; i < z.length; i++)
   if (z[i][c].length > mx) mx = z[i][c].length;

   var y = new Array(z.length);
   for (i=0; i < z.length; i++)
   {y[i] = padd(z[i][c], mx) + padd1(i, z.length);  }
   y.sort();
   var w = new Array(z.length);
   for (i=0; i < w.length; i++)
   {w[i] = parseInt(y[i].substring(mx).replace(/ /g,""));  }
   for (c=0; c < z[0].length; c++)
   {
      for (i=0; i < z.length; i++)
      {
         y[i] = z[w[i]][c];
      }
      for (i=0; i < z.length; i++)
      {
         z[i][c] = y[i];
      }
   }
}

function byid()
{
   sortby(0);
   var overv = document.getElementById("overv");


   for (var j=overv.rows.length-1; j >=0; j--)
   overv.deleteRow(j);
   var j1= 0;

   for (var j=0; j < z.length; j++)
   {
     if (z[j][4]== -1)
     {

      var subdb = "";
      if (z[j][3]!='')
         subdb = "&subdb=" + z[j][3] +"&cdrdap=1";
      if (z[j][5] == 1)
         subdb += "&df=1"; 
      var rw = overv.insertRow(j1++);
      var xx = rw.insertCell(0);
      xx.innerHTML = "<nobr><a href=Form?rdap=" + z[j][0] + subdb +"> [" + z[j][0] + "] " + z[j][1]  + "</a></nobr>";
      xx = rw.insertCell(1);
      xx.innerHTML =   z[j][2] ;
     }
   }
}
function bytitle()
{
   sortby(1);
   var overv = document.getElementById("overv");
   for (var j=overv.rows.length-1; j >=0; j--)
   overv.deleteRow(j);
   var j1= 0;
   for (var j=0; j < z.length; j++)
   {
     if (z[j][4]== -1)
     {
      var subdb = "";
      if (z[j][3]!='')
         subdb = "&subdb=" + z[j][3] +"&cdrdap=1";
      if (z[j][5] == 1)
         subdb += "&df=1"; 
      var rw = overv.insertRow(j1++);
      var xx = rw.insertCell(0);
      xx.innerHTML = "<nobr><a href=Form?rdap=" + z[j][0] + subdb +">[" + z[j][0] + "]   " + z[j][1]  + "</a></nobr>";
      xx = rw.insertCell(1);
      xx.innerHTML =   z[j][2] ;
     }
   }
}
function orderby(t)
{
   if (t.selectedIndex < 0) return;
   var v = t.options[t.selectedIndex].value;
   if (v == 'id')
       byid();
   else if (v == 'cat')
       bycat();
   else if (v == 'title')
       bytitle();
}
bycat(0);
}
 

