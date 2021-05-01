function download_file(name) {
        let mime_type =  "text/csv";
        let contents = $('csv').value;
        var blob = new Blob([contents], {type: mime_type});

        var dlink = document.createElement('a');
        dlink.download = name;
        dlink.href = window.URL.createObjectURL(blob);
        dlink.onclick = function(e) {
            // revokeObjectURL needs a delay to work properly
            var that = this;
            setTimeout(function() {
                window.URL.revokeObjectURL(that.href);
            }, 1500);
        };

        dlink.click();
        dlink.remove();
    }    
function download(t)
{
   var d  = new Date(); 
let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    
   var fn = ye + mo + da;
   myprompt('Enter the file name:', fn + '.csv', 'download_file(v)', 'Download'); 
}
function $(x){return document.getElementById(x);}
 
var m;
var temp;
let oldt = new Array();
let allregs = [];
function replace()
{
   let t = $('csv');
   let b = $('view');
   let undo = $('undo');
   if (b.value == 'Back') view(b);
   let s =  $('sourcechar');
   let c =  $('targetchar');
   let a = $('regex');
   var rs = localStorage['reglist']; // search a piece of data named relist in cache/ harddrive
   if (rs == null)
       allregs = []; 
   else
       allregs = JSON.parse(rs);
   for (var i =0; i< allregs.length; i++)
       if (allregs[i][0] == s.value) 
           break;
   if ( i == allregs.length)
   {
       allregs.splice(0,0,[s.value, c.value, ($('regex').checked)]);
       if (allregs.length > 25)
           allregs.splice(allregs.length-1,1);
       localStorage['reglist'] = JSON.stringify(allregs);
       var newitem = document.createElement('option');
       newitem.value = s.value;
       var lt = $('reglist').childNodes;
       if (lt ==null || lt.length == 0)
           $('reglist').append(newitem);
       else
           $('reglist').insertBefore(lt[0],newitem);
       $('sourcechar').list = 'reglist';
       
   }
   if (a.checked)
   try
   {
     let r = new RegExp(s.value, "gi");
     
     oldt[oldt.length] = t.value;
     t.value = t.value.replace(r, c.value);
     undo.style.visibility = 'visible'; 
   }
   catch(e){}
   else
   {
     oldt[oldt.length] = t.value;
     t.value = replaceAll(t.value, s.value, c.value, true);
     undo.style.visibility = 'visible';  
   }
}
function replaceAll(str, find, newToken, ignoreCase)
{
    let i = -1;

    if (!str)
    {
        // Instead of throwing, act as COALESCE if find == null/empty and str == null
        if ((str == null) && (find == null))
            return newToken;

        return str;
    }

    if (!find) // sanity check 
        return str;

    ignoreCase = ignoreCase || false;
    find = ignoreCase ? find.toLowerCase() : find;

    while ((
        i = (ignoreCase ? str.toLowerCase() : str).indexOf(
            find, i >= 0 ? i + newToken.length : 0
        )) !== -1
    )
    {
        str = str.substring(0, i) +
            newToken +
            str.substring(i + find.length);
    } // Whend 

    return str;
}
function undo(btn)
{
   let t = $('csv');
   if (oldt.length>=1)
   {
   t.value = oldt[oldt.length-1];
   oldt.splice(oldt.length-1,1);
   if (oldt.length == 0)
      btn.style.visibility = 'hidden'; 
   }
}
function view(btn)
{
   let t = $('googlesource');
   if (btn.value == 'View Tab')
   {
      temp = t.value;
      btn.value  = 'Back';
      t.value = t.value.replace(/\t/g,'\\t   ').replace(/\n/g,'\\n\n').replace(/\r/g,'\\r');
   }
   else
   {
       t.value = temp;
       btn.value = 'View Tab';
   }
}
function proc(v)
{
    if (v == '\\t') return '\t';
    else if (v == '\\n')return '\n';
    else if (v == '\\r\\n')return '\r\n';
    else return v;
}
function parse()
{
let tx = document.getElementById('csv');
let cols = proc($('column').value);
let rows = proc($('row').value);
let des =  proc($('de').value);
m = (new CSVParse(tx.value, des, cols, rows)).nextMatrix();

let autos = ' auto';
for (let i=0; i < m[0].length; i++)
  autos += ' auto';
var str = "<div  class=heading><div id=t2  onclick=insertRow(0)></div><div id=t1 onclick=insertCol(0)></div></div>";
for (var j=0; j < m[0].length; j++)
{
   str += "<div class=heading style=width:98px;text-align:left;background-color:#888;text-align:center onmouseenter=menu("+ (j+1) + ") onmouseout=hidemenu() onclick=insertCol(" + (j+1) + ") >" + String.fromCharCode('A'.charCodeAt(0)+j) + "</div>"; 
}
$('editing').style.gridTemplateColumns = autos.substring(1);
 
for (var i=0; i < m.length; i++)
{
   str += "<div  class=heading  onmouseenter=menu("+ (i+1) + ",'r') onmouseout=hidemenu()  onclick=insertRow(" + (i+1) + ")>" + (i+1) + "</div>"; 
   for (var j=0; j < m[i].length; j++)
   {
      if (m[i][j] == null) m[i][j] = '';
      str += "<input id=" + i + "_" + j + " onblur=update() value=\"" + m[i][j].replace(/"/g, '\\"') + "\" style=width:100px>";
   }
}
$('editing').innerHTML = str;
}

function menu(i, r)
{
     
    
}
function hidemenu()
{
    
}
function insertCol(j)
{
    
}
function update()
{
   $("csv").value = back();
}
function back()
{
   let cols = proc($('column').value);
   let rows = proc($('row').value);
   let des =  proc($('de').value);
   var text = '';
   let r = 0, c = 0;
   while(true)
   {
       c = 0;
       while (true)
      {
         let ele = $(r + '_' + c);
         if (ele == null)
         {
            if (c == 0) 
                return text;
            else
            {  r++; c= 0;}
         }
         else
         {
             m[r][c] = ele.value;
             if (c == 0) 
             {
                if (r > 0) text += rows;
             }
             else
             {
                 text += cols;
             }
             text += des + ele.value.replace(des,des+des) + des;
             c++;
         }

      }

   }
   return text;
}
function insertRow(j)
{
    m.splice(j,0,new Array(m[0].length));
    var p = new CSVParse();p.toStr(m,'"',",","\n");
    $('csv').value = p.str;
    parse();
}
function insertCol(j)
{
    for (let i=0; i < m.length; i++)
    {
       m[i].splice(j,0,"");  
    }
    
    var p = new CSVParse(); 
    p.toStr(m,'"',",","\n")
    $('csv').value = p.str;
    parse();
}
onload = function()
{
    let w = thispagewidth();
    $('csv').style.width = (w - 210) + 'px';
    parse();
}
onresize = function()
{
   $('csv').style.width = '10px';
   let w = thispagewidth();
   $('csv').style.width = (w - 210) + 'px'
}


