var uploadedattachment = null; 
var uploadedresized = false;
var uploadsize = null;
var uploadeddraged = false;
var regloc = "";
var picwin = null;
function syn(z, fn, em1)
{ 
    var ret = 0;
    if (z == 'del')
    {
        if (fn.replace(/[0-9|a-z]/ig,'').replace(/[\-|_|\.|\$]/g,'') == '' && typeof (ResizeUploaded.refreshatt) == 'function')
            ResizeUploaded.refreshatt();
        return 1;
    }
    else if (z.indexOf("web") == 0)
    {
        var locat = '' + document.location;
        if (z.length > 4)
            regloc = locat.replace(/embedquiz.*$/, '') + "FileOperation?did=" + z.substring(4);
        else
            regloc = fn;
        uploadsize = null;
        uploadedresized = false;
        uploadeddraged = false;
        var tm = parseInt(fn.replace(/[^@]+@/, ''));
         
        var fen = fn.replace(/@.*/, '');
        var jj = fen.lastIndexOf(".");
        fen = fen.substring(jj + 1).toLowerCase();
        var ss = '';
        if ((fen == 'jpg' || fen == 'jpeg' || fen == 'gif' || fen == 'png') && z.length > 4 &&  z.charAt(3) == '/' )
        {
       // files[i] + '@'+timest[i]  +'@' + codedpath[i]
            uploadedattachment = [z.substring(4), fn ]; //code, fn@time   
            ss = "<table class=outset1 style=border-radius:3px id=uploadinstru cellspacing=0 cellpadding=0 border=0><tr><td>"
                    + "<select id=resizesel style=\"overflow:hidden;border:1px #b0b0b0 solid;margin:0px 0px 0px 0px\" onchange=resizeonly(this,'" + z.substring(4) + "','" + fn + "')><option selected value=100>100%</option>"
                    + "<option value=5>5%</option><option value=10>10%</option><option value=20>20%</option><option  value=25>25%</option><option  value=30>30%</option><option  value=40>40%</option><option  value=50>50%</option><option  value=75>75%</option>"
                    + "<option  value=125>125%</option><option  value=150>150%</option><option  value=200>200%</option></select></td>"
                    + "<td><input type=submit class=OrangeButton value=\"" + textmsg[424] + "\" style=\"width:68px;\" onclick=useit()></td>" 
                    +  "<td><input type=button name=deleuppic class=RedButton value=\"" + textmsg[69] + "\" style=\"width:70px\" onclick=\"delshowpic()\" ></td></tr>"
                    + "</table>";
   
            myprompt(ss+"<img id=imgwork src=\"" + regloc + "\"  onload=\"showframe()\">", null, null, textmsg[1296]);
            picwin = promptwin;
            
            
            picwin.style.top = "10px";
            picwin.style.left = "10px";
            
            picwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].onclick
        = function(){useit();}
            picwin.onDragStart = function()
            {
                var b = document.getElementById('dragcropbox');
                if (b!=null)
                {
                    var xy = findPositionnoScrolling(b);
                    uploadedattachment[2] = xy[0];
                    uploadedattachment[3] = xy[1];
                    xy = findPositionnoScrolling(this);
                    uploadedattachment[2] -= xy[0];
                    uploadedattachment[3] -= xy[1];
                }
            }
            picwin.onDragEnd = function()
            {
                var b = document.getElementById('dragcropbox');
                if (b!=null)
                {
                    var xy = findPositionnoScrolling(this);
                    b.style.left = (xy[0] + uploadedattachment[2]) + 'px';
                    b.style.top = (xy[1] + uploadedattachment[3]) + 'px';
                }
            }
            
        }
        else  
        {
           var i = imageset.length;
           imageset[i] = "<a href=\"" + regloc + "\" target=\"" +  fn.replace(/[^@]+@/, '') + "\">" +  fn.replace(/@.*/, '') + "</a>";
           d[savedk][1] += "[" + msg185 + i + "]"; 
           maintbl.rows[savedk].cells[1].innerHTML = maintbl.rows[savedk].cells[1].innerHTML + imageset[i];
        }

        

        return 1;
    }
  
    return ret;
}

function delshowpic()
{
    deluploadedpic();
    closeprompt();
    var s = document.getElementById("dragcropbox");
    if (s!=null) 
        document.body.removeChild(s); 
}
  
 
function showframe(pic)
{
    var w = Math.round(pic.width*7/8);
    var h = Math.round(pic.height*7/8);
    if (w < 50) w = 50;
    if (h < 50) h = 50;
     
    var xy = findPositionnoScrolling(pic);
    if (h > pic.offsetHeight || w > pic.offsetWidth)
    {
        var ro = (h / pic.offsetHeight);
        if (ro < w / pic.offsetWidth)
            ro = w / pic.offsetWidth;
        var ww = Math.ceil(ro * pic.offsetWidth + 2);
        var hh = Math.ceil(ro * pic.offsetHeight + 2);
        pic.height = hh;
        pic.width = ww;
        pic.style.height = hh + 'px';
        pic.style.width = ww + 'px';
       
    }
    var z = 21;
    if (typeof (promptwin.style.zIndex) != 'undefined')
        z = promptwin.style.zIndex;
    if (typeof (pic.style.zIndex) != 'undefined' && z < pic.style.zIndex)
        z = pic.style.zIndex;

    var box = document.createElement("div");
    box.id = "dragcropbox";
    box.style.cssText = "position:absolute;left:" + xy[0] + "px;top:" + xy[1]
            + "px;z-index:" + (z + 1) + ";background-color:transparent;border:0px;align:center;vertial-align:middle";
    box.innerHTML = round1() + "<div id=dummycenter style=\"background-color:#eee;opacity:.1;width:" + w + "px;height:" + h + "px;\"></div>" + round2;
    document.body.appendChild(box);
    
    new ResizeRounded(box, function(td, dx, dy)
    {
        var b = document.getElementById('dummycenter');
        b.style.width = (b.offsetWidth + dx) + 'px';
        b.style.height = (b.offsetHeight + dy) + 'px';
        uploadeddraged = true;
    }   
    );
    var blank0 = box.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('div')[0];
    Drag.init(blank0, box);
    
    box.onDragEnd = function()
    {
        uploadeddraged = true;
    }
}
 
function resizeonly(sel, zz, explicit)
{
    var pic = document.getElementById('imgwork');
    if (uploadsize==null)
    {
        uploadsize = [pic.width, pic.height];
    } 
    var p = parseInt(sel.options[sel.selectedIndex].value);
    var w = Math.round(p * uploadsize[0] / 100);
    var h = Math.round(p * uploadsize[1] / 100);
    pic.style.width = w + 'px';
    pic.width = w;
    pic.style.height = h + 'px';
    pic.height = h;
    promptwin.style.width = (w + 4) + "px";
    promptwin.style.height = (h + 30) + "px";
    uploadedresized = true;
}
var imageset = new Array();
 
function extractpic(x)
{
    var j = x.indexOf("FileOperation?did=");
    if (j == -1) return x;
    var i = j;
    for (; i>=0; i--)
    if (x.charAt(i) == '<') break;
    for (; j < x.length; j++)
        if (x.charAt(j) == '>') break;
    if (x.substring(i,i+2) == '<a')
    {
        for (j++; j < x.length; j++)
        if (x.charAt(j) == '>') break;
    }
    imageset[imageset.length] = x.substring(i,j+1);
    
    if (i>0 && j < x.length-1)
        return x.substring(0,i) + "[" + msg185 +  (imageset.length-1) + "]" + extractpic(x.substring(j+1));
    if (i==0 && j < x.length -1)
        return  "[" + msg185 +  (imageset.length-1) + "]" + extractpic(x.substring(j+1));
    if (i > 0 && j == x.length-1)
        return x.substring(0,i) + "[" + msg185 +  (imageset.length-1) + "]" ; 
    
    return  "[" + msg185 +  (imageset.length-1) + "]"  ;
}
var usedindex = 0;
function useit()
{
    
    var sel = document.getElementById('resizesel');
    var pic = document.getElementById('imgwork');
    
    var i = imageset.length;
    if (redoindex!=-1)
        i =  redoindex ;
    usedindex = i;
    var p = parseInt(sel.options[sel.selectedIndex].value);
    if (uploadsize==null)  uploadsize = [pic.width, pic.height]; 
    var url = "UploadChangePic?pathcode=" + uploadedattachment[0] +  "&tcode=" + uploadedattachment[1].replace(/^[^@]+@/,"");
    var needsubmit = false;
    var XY = findPositionnoScrolling(pic);
    var w = pic.offsetWidth;
    var h = pic.offsetHeight;
    needsubmit = false; 
    if (uploadedresized)
    {
        needsubmit = true;
        url += "&rwidth=" + w + "&rheight=" + h;
    }
    var b = document.getElementById("dragcropbox");
    if ( b != null && uploadeddraged)
    {
        var cw = b.offsetWidth;
        var ch = b.offsetHeight;
        var xy = findPositionnoScrolling(b);
        xy[0] -= XY[0];
        xy[1] -= XY[1];
        if (xy[0] < 0)
            xy[0] = 0;
        if (xy[1] < 0)
            xy[1] = 0;
        if (cw < w && ch < h)
        {    
            url += "&cropx=" + xy[0] + "&cropy=" + xy[1] + "&cwidth=" + cw + "&cheight=" + ch;
            needsubmit = true;
        }
    }
    document.body.removeChild(b);
    imageset[i] = "<img  src=\"" + regloc + "\" alt=\"" + uploadedattachment[1] + "\"  >";
    maintbl.rows[savedk].cells[1].innerHTML = maintbl.rows[savedk].cells[1].innerHTML + imageset[i];
    
    if (d[savedk][1]==null || d[savedk][1] == '')
        d[savedk][1] = "[" + msg185 + i + "]"; 
    else if (d[savedk][1].indexOf("[" + msg185 + i + "]")<0)
         d[savedk][1] += "[" + msg185 + i + "]"; 
    
    uploadedattachment = null;
    uploadsize = null;
    closeprompt();
    var s = document.getElementById("dragcropbox");
    if (s!=null) 
        document.body.removeChild(s);
    if (needsubmit) 
    {  
       savedredourl = url;
        var nav = window.open(url, "w" + tstmp);
    } 
    redoindex = -1;
}
savedredourl = '';
var dochangepic = function()
{
   var nav = window.open(savedredourl, "w" + tstmp); 
}
failupload = function (x)
{
    if (x==null) return;
    if (typeof(x) == 'number')
    {
       var z = maintbl.rows[savedk].cells[1].getElementsByTagName('img');
       if (z!=null)
       {
          var y = z[z.length-1];
          y.src = regloc + "&vv=" +(new Date()).getTime();
          y.alt = y.alt.replace(/@([0-9]+)/,'@' + x);
       }
       var w = imageset[usedindex].replace(/@([0-9]+)/,'@' + x);
       imageset[usedindex] = w;
    }
    else
         myprompt(x);
     
}
function deluploadedpic()
{
    if (uploadedattachment == null)
        return;
    savedredourl =  "UploadChangePic?tcode=" +  uploadedattachment[1].replace(/[^@]+@/,'') + "&pathcode=" + uploadedattachment[0]  ;
    window.open(savedredourl, "w" + tstmp);
}
var redoindex = -1;
function redoit(img,k)
{
    extract("<img src=\"" + img.src + "\" alt=\"" + img.alt + "\" >");
    for (var i=0; i < imageset.length; i++)
        if (imageset[i].indexOf(img.alt)>=0) break;
    redoindex = i;
    d[k][1] = d[k][1].replace("\\[" + msg185 + i + "\\]", "");
    var z = tds[k][1].innerHTML;
    var j = z.indexOf(img.alt);
    var l = j;
    while (z.charAt(j)!='<') j--;
    while (z.charAt(l)!='>') l++; l++;
    if (j ==0 && l < z.length)
    {
        tds[k][1].innerHTML = z.substring(l);
    }
    else if (j == 0 && l == z.length)
    {
       tds[k][1].innerHTML = ''; 
    }
    else if (j > 0 && l < z.length)
    {
        tds[k][1].innerHTML =z.substring(0,j) +  z.substring(l);
    }
    else if (j > 0 && l == z.length)
    {
        tds[k][1].innerHTML = z.substring(0,j);
    }
    syn("web/" + uploadedattachment[0], uploadedattachment[1]);
    savedk = k;
    //showframe(document.getElementById('imgwork'));
}
function extract(x)
{
    uploadedattachment = new Array();
    if (x.charAt(1) == 'a')
        {
            var j1 = x.indexOf("FileOperation?did=")+ 18;
            var j2 = x.indexOf("\"",j1);
            var j3 = x.indexOf("target=\"", j2) + 8;
            var j4 = x.indexOf("\"",j3);
            var j5 = x.indexOf(">",j4) + 1;
            var j6 = x.indexOf("<",j5);
            uploadedattachment[1] = x.substring(j5,j6) + "@" + x.substring(j3,j4);
            uploadedattachment[0] = x.substring(j1,j2);
             
        }
        else
        {
             var j1 = x.indexOf("FileOperation?did=")+ 18;
            var j2 = x.indexOf("\"",j1);
            var j3 = x.indexOf("alt=\"", j2) + 5;
            var j4 = x.indexOf("\"",j3);
            uploadedattachment[1] =   x.substring(j3,j4);
            uploadedattachment[0] = x.substring(j1,j2); 
             
        }
}
var allns = ''; 
function deleteallns()
{
    
    allns = allns.replace(/^,/,'').replace(/,$/,'');
    if (allns == '') return;
    var alln = allns.split(/,/);
     
    for (var j=0; j < alln.length; j++)
    {
        var x = imageset[parseInt(alln[j])];
        if (x == '') break;
        extract(x);
        savedredourl = "UploadChangePic?tcode=" + encodeURIComponent(uploadedattachment[1].replace(/[^@]+@/)) + "&pathcode=" + uploadedattachment[0] + "&rdap=assignedit" ;
        window.open(savedredourl, "w" + tstmp);
    }
}
function combine(x)
{
    var s = "";
    var r = new RegExp("\\[" + msg185 + "[0-9]+\\]");
    var k = 0;
    var j = 0;
    while (k < x.length)
    {
        var m = r.exec(x.substring(k));
        if (m != null)
        {
            j = k + m.index;
            var toben = m.toString();
            var n = parseInt(toben.replace(/[^0-9]/g,''));
            s += x.substring(k,j) + imageset[n];
            allns = allns.replace(new RegExp("," + n + ","), ",");
            k = j + toben.length;
        }
        else
        {
            return s + x.substring(k);
        }
    } 
    
    return s;
}
 


