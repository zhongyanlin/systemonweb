var ii, jj;
var hand = null;
var recursive = false;
 
function transl()
{  
   ii= (which=='js'?0:1); jj = 0;
   var x = document.getElementById('ij').value.replace(/ /g,'');
   if (x!='' && x.replace(/[0-9]+,[0-9]+/,'') == '')
   {
       var xs = x.split(/,/);
       ii = parseInt(xs[0]);
       jj = parseInt(xs[1]);
   }
   doij();
}
function autotran(i,j)
{
    recursive = false;
    var y = document.getElementById('s' + i + '_' + j);
    var z = document.getElementById('t' + i + '_' + j);
    if (z.value==y.value || z.value == '')
    {
        ii = i; jj = j;
        doij();
    }
} 

function doij()
{
    var y = document.getElementById('s' +ii + '_' + (jj));
    if (y == null) return;
    var q = y.value;
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        xmlhttp = new XMLHttpRequest();
    }
    else
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var s = xmlhttp.responseText;
            var result = JSON.parse(s);
            var x = '';
            for (var j=0; j < result[0].length; j++)
                x += result[0][j][0];
            var z = document.getElementById('t' + ii + '_' + jj);
            var y = document.getElementById('s' +ii + '_' + (jj));
            if (z!=null && (z.value == y.value || z.value == ''))
                z.value = x;
            
            {
                y = document.getElementById('s' +ii + '_' + (jj + 1));
                if (y == null)
                {
                      y = document.getElementById('s' + (ii+1) + '_0');
                      if ( y!=null )
                      {
                          ii++;
                          jj=0; 
                          if (ii%100 != 0 ) 
                          {if (recursive)    doij();}
                          else
                          {
                              document.getElementById('ij').value = ii + ',' + jj; 
                          }
                      }
                }
                else
                {
                      jj++; if (recursive)doij();
                } 
            }
        }
    }
    var url="https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=" + encodeURI(sl) + "&tl=" + encodeURI(tl) + "&q=" + encodeURI(q); 
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    
}

function save()
{
   var str = '';
   for  (var i=0; i < N; i++)
   {
      var j = 0;
      var w = document.getElementById('w' + i  ).value;
      if (w=='n') w = '\n+  ';
      else if (w == '1') w = '';
      var s = '';
      for (; ; j++)
      {
          var y = document.getElementById('t' + i + '_' + j);
          if (y == null) break;
          if (s!='') s += w;
          s += y.value;
      }
      if (i>0) str += '\n';
      str += i + " " + s;
   }
   var dv = document.createElement('div');
   dv.style.cssText = 'width:600px;height:500px;position:absolute;left:0px;top:10px;background-color:lightblue';
   dv.innerHTML = ("<form rel=opener name=f action=transtxt.jsp  ><input name=which type=hidden value=save" + which +"><textarea name=txt rows=30 cols=80>" + str + "</textarea><br><input type=submit class=GreenButton style=width:80px value=Update ></form><input  style=width:80px  class=OrangeButton type=button value=close onclick=rm(this)>");
   document.body.appendChild(dv);
}
 
function rm(bt)
{
    document.body.removeChild(bt.parentNode);
}

function reload(tx)
{
    let url = document.location.toString().replace(/\?.*$/,'') + '?enc=' + tx.value.trim() + '&which=' + which;
    document.location.href = url;
}

