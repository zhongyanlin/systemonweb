//var imgs= 
//var cimgs= 
//var folders= 
//var others= 
//var cthers=
//var path
//tms
//otms
 
if (path.replace(/[^\/]+\//,'')!='')
    folders  = "..," + folders;
 
if (typeof(thumbs) != 'undefined' || others!='')
    document.write("<div id=holderr style=background-color:#f5f5f5;text-align:center;font-size:15px>" + textmsg[1842] + "</div>");
else if (folders !='')
    document.write("<div  id=holderr style=background-color:#f5f5f5;text-align:center>" + textmsg[1843] + "</div>");
else
    document.write("<div  id=holderr style=background-color:#f5f5f5;text-align:center>" + textmsg[1844] + "</div>");
 
var folder0 = path.replace(/[^\/]+\//,'');
var N = 0;
var ON = 0;
 
if (typeof(thumbs) != 'undefined')
{
   var imgarr = imgs.replace(/\n/,'').split(/,/);   
   var cimgarr = cimgs.split(/,/);  
   var tmarr = tms.split(/,/);      
   var dimarr = dim.split(/,/);    
   N = imgarr.length;              
   var imgseled = new Array(N);    
   for (var i=0; i < N; i++) 
      imgseled[i] = false; 
   var r = Math.ceil(N/5.0);
   var H = r *110;
   var W = 420;
   var tblstr = "";
 
   for (var i=0; i < r; i++)
   {
       tblstr += "<tr height=110>";
       for (var j=0; j < 5  ; j++)
       {        
           tblstr += "<td width=80 style=background-color:" + (j+i*5 < N?'#f5f5f5':DBGCOLOR) + ";border-radius:3px>";
           if (j+i*5 < N)
              tblstr += "<div id=d" + ((j+i*5)) + "><div class=icon style=\"border-radius:3px;background-position:-" + (j*80) + "px -" + (i*80) + "px\"></div><div style=font-size:11px;height:30px;width:80px;margin:0px;text-align:center>" + (j+i*5<N?imgarr[j+i*5].toLowerCase():'') + "<br>" + (j+i*5<N?('('+dimarr[j+i*5]+')'):'') + "</div></div>";
           tblstr += "</td>";
       }
       tblstr += "</tr>";
   }
   document.write("<center><table id=imgtbl align=center border=0 cellpadding=0 cellspacing=5 style=\"margin:0px\" >" + tblstr + "</table>") 
}
if (typeof(thumbs) != 'undefined' || others != '')
document.write("<center><table id=imgtbl align=center border=0 cellpadding=0 cellspacing=5 style=\"margin:5px 5px 5px 5px\" ><tr><td width=20></td><td width=380 align=center><img  id=trash1 src=image/trash.png></td><td width=20 onclick=location.reload()>&#10227;</td></tr></table>");
   
var otherarr = others.split(/,/);
var ctherarr = cthers.split(/,/);
var folderarr = folders.split(/,/);
var otmarr = otms.split(/,/);
var osizearr = osizes.split(/,/);
var ON = otherarr.length; 
var fileseled = new Array(ON);
for ( i=0; i < ON; i++)  fileseled[i] = false;
document.body.style.backgroundColor = DBGCOLOR;
var selectedN = ',';
var selectedO = ',';
var ddx,ddy;
var trx1, try1, trx2, try2;
var ctd;
 
if (others!=''){
document.write("<table id=othertbl align=center cellpadding=0 cellspacing=1 width=420 style=background-color:" + DBGCOLOR +";border-radius:3px >");
for (i=0; i < Math.ceil(ON/2.0); i++)
{
    document.write("<tr>");
    for (var j=0; j < 2; j++)
    {
        document.write("<td width=200 ");  
        if (2*i+j >= otherarr.length)
            document.write(">");
        else
            document.write(" style=border-radius:3px;color:blue;font-size:15px;background-color:#f5f5f5><div id=o" + (2*i+j)  + " style=padding:3px;border-radius:3px >" + otherarr[2*i+j] + "  (" + osizearr[2*i+j] + "K)</div>");
        document.write("</td>");
    }  
    document.write("</tr>");
}
document.write("</table>");
 
}
 
if (folders!='')
{
    document.write("<br><table  id=foldertbl   align=center width=420 cellspacing=1 cellpadding=3 style=border-radius:3px >");
    for ( i=0; i < folderarr.length; i++)
    {
        if (i%3 ==0) document.write("<tr>");
        document.write("<td style=width:135px;background-color:yellow;border-radius:3px;color:blue;font-size:16px onclick=selfolder(" +i + ")>" +   (folderarr[i]=='..'?'&uarr;&uarr;&uarr;':folderarr[i])+ "</td>");
        if ( i%3 ==2 || i== folderarr.length-1) document.write("</tr>");
    }
    document.write("</table></center>");
}
function sel0(td,n)
{
    if (n >= N) return;
    imgseled[n]= !imgseled[n]; 
    var c = n%5;
    var r = ~~(n/5);
    td.style.border = (imgseled[n]?'1px #999999 solid':'0px #f5f5f5 solid');
    td.style.backgroundColor = (imgseled[n]?'#999999':'#f5f5f5');
    if (imgseled[n]==false)
    {
        parent.ResizeUploaded.deleteByCode(cimgarr[n]);
        selectedN = selectedN.replace(new RegExp(',' + n + ','),",");
    }
    else 
    {
        parent.ResizeUploaded.addAnentry(imgarr[n],tmarr[n],cimgarr[n]);
        selectedN = selectedN  + n + ','; 
    }
}
var tobedeleted='';
function deleted(dv,n, nn)
{
    var fd  = folder0;
    if (folder0 != '' && folder0.charAt(folder0.length-1)!='/')   
    {
        fd += "/";
    }
    var selstr1  =  fd + (nn==0?imgarr[n]:otherarr[n]) + ';';
    tobedeleted += selstr1;
    delfiles();
  
}
var f2=document.form2;

function selother(td,n)
{
    fileseled[n] = !fileseled[n]; 
    
    td.style.backgroundColor = (fileseled[n]?'#999999':'#f5f5f5');
     
    if (fileseled[n]==false)
    {
        parent.ResizeUploaded.deleteByCode(ctherarr[n]);
        selectedO = selectedO.replace(new RegExp(',' + n + ','),",");
    }
    else  
    {
        parent.ResizeUploaded.addAnentry(otherarr[n],otmarr[n],ctherarr[n]);
        selectedO = selectedO  + n + ','; 
    }
}

function selfolder(i)
{
    var x = folder0;
    if (x=='' && folderarr[i]=='..')
    {
        x = ''; 
    }
    else if (x == '' && folderarr[i]!='..')
    {    
        x  =  folderarr[i];
    }
    else if (x != '' && folderarr[i]!='..' )
    {
        x += "/" +  folderarr[i];
    }
    else
    {
       var k = x.lastIndexOf('/');
       if (k >= 0) 
       {
           x = x.substring(0,k); 
       }
       else  
       {
           x = '';
       } 
    }
    if (tobedeleted!='')
    {
        parent.ResizeUploaded.folder0 = x;
        parent.ResizeUploaded.deleteFiles(folder0,tobedeleted);
        tobedeleted ='';
    }
    else 
    {
        postopen("Thumbs",["folder"],[x],"_self");
    } 
}
if (typeof(parent.promptwin) != 'undefined')
parent.promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[1].innerHTML = path;
 
function selected()
{
    var str = '';
    if (N>0)
    for (var j=0; j < N; j++)
    {
        if (imgseled[j] && selectedN.indexOf(',' + j + ',')<0)
            str += imgarr[j] + '@' + tmarr[j] + '@' + cimgarr[j] + ',';
    }
    if (cthers!='')
    for (j=0; j < otherarr.length; j++)
    {
        if (fileseled[j] && selectedO.indexOf(',' + j + ',')<0)
            str += otherarr[j] + '@' + otmarr[j] + '@' + ctherarr[j] + ',';
    }
    
    return str;
}

function isin(x,y,x1,y1)
{
    return (x>=x1 && y >=y1 && x<x1+40 && y < y1+40);
}
 

function beginwith()
{
    var myfontname1 = localStorage['myfontname'];
    if (myfontname1!=null)
    {
        myfontname = myfontname1;
    }
    else if (typeof(defaultfontfamily)!='undefined')
    {
        myfontname = defaultfontfamily;
    }
    unifonts(document.body); 
    parent.ResizeUploaded.iframewin = window;
    if (document.getElementById('imgtbl')!=null)
    {
        document.getElementById('imgtbl').align = 'center';
    }
    var x = parent.ResizeUploaded.unzip(parent.ResizeUploaded.attachref.value).replace(/,$/,'');
    
    var y = new CSVParse(x,'\'',"@", ",");
    var z = y.nextMatrix();
    var imgtbl = document.getElementById('imgtbl');
    var tbl = document.getElementById('othertbl');
    for (var i=0; i < z.length; i++)
    {
        var a = z[i][2];
         
        for (var j=0; j < N; j++){
           if (a == cimgarr[j])
            {
                sel0(document.getElementById('d' +j),j);
                selectedN += j + ",";
            }
        }
         
        for (var j=0; j < ON; j++)
        {
            if (a == ctherarr[j])
            {
                selother(document.getElementById('o' +j),j)
                selectedO += j + ",";
            }
        }
    }
    enabledrag();
}  

function enabledrag()
{
    if (document.getElementById('trash1')!=null
       && document.getElementById('foldertbl') != null
       && typeof(findPositionnoScrolling) != 'undefined')
    for (var k=0; k < N; k++)
    {
        var dv = document.getElementById('d' + k);
        if (dv==null) break;
        Drag.init(dv);
        dv.onDragStart = function(x,y)
        { 
            ctd= this.parentNode;
            var xy = findPositionnoScrolling(document.getElementById('trash1'));
            trx1 = xy[0];
            try1 = xy[1];
            xy = findPositionnoScrolling(document.getElementById('foldertbl'));
            trx2 = xy[0];
            try2 = xy[1];
           
            if (trx1<190) trx1=190;
            
            if (try2<try2+39) try2=try2+39;
            xy = findPositionnoScrolling(this);
            ddx = xy[0];
            ddy = xy[1];
            document.body.appendChild(this);
            this.style.position = 'absolute';
            this.style.left = xy[0] + 'px';
            this.style.top = xy[1] + 'px';
        } 
         
        dv.onDragEnd = function(x,y)
        {
            var d = [ddx - x,ddy - y];
            var n = parseInt(this.id.substring(1));
            var ds = d[0]*d[0] + d[1]*d[1];
          
            if (ds < 4)
            {
                sel0(this,n);
                ctd.appendChild(this);
                this.style.position = 'static';
                this.style.left = '0px';
                this.style.top =  '0px';
                document.getElementById('holderr').innerHTML = '<font color=red>' + textmsg[1881] + '</font>';
            }
            else if (imgseled[n]!=true && isin(x,y,trx1,try1))
            {  
                deleted(this,n,0);  
            }
            else
            {
                ctd.appendChild(this);
                this.style.position = 'static';
                this.style.left = '0px';
                this.style.top =   '0px';
              document.getElementById('holderr').innerHTML = '<font color=red>' + textmsg[1881] + '</font>';
            }
        } 
    }
    if (document.getElementById('trash1')!=null
       && document.getElementById('foldertbl') != null
       && typeof(findPositionnoScrolling) != 'undefined')
    for (var k=0; k < ON; k++)
    {
        var dv = document.getElementById('o' + k);
        if (dv == null) break;
        Drag.init(dv);
        dv.onDragStart = function(x,y)
        { 
            ctd= this.parentNode;
            var xy = findPositionnoScrolling(document.getElementById('trash1'));
            trx1 = xy[0];
            try1 = xy[1];
            xy = findPositionnoScrolling(document.getElementById('foldertbl'));
            trx2 = xy[0];
            try2 = xy[1];
            
            if (trx1<190) trx1=190;
            if (trx2>20) trx2=20;
            if (try2<try2+39) try2=try2+39;
            xy = findPositionnoScrolling(this);
            ddx = xy[0];
            ddy = xy[1];
            document.body.appendChild(this);
            this.style.position = 'absolute';
            this.style.left = xy[0] + 'px';
            this.style.top = xy[1] + 'px';
        } 
        dv.onDragEnd = function(x,y)
        {
            var d = [ddx - x,ddy - y];
            var n = parseInt(this.id.substring(1));
            var ds = d[0]*d[0] + d[1]*d[1];
            if (ds < 4)
            {
                selother(this,n);
                ctd.appendChild(this);
                this.style.position = 'static';
                this.style.left = '0px';
                this.style.top =  '0px';
                document.getElementById('holderr').innerHTML = '<font color=red>' + textmsg[1881] + '</font>';
            }
            else if (fileseled[n]!=true && isin(x,y,trx1,try1))
            {  
                deleted(this,n,1);  
            }
            else
            {
                ctd.appendChild(this);
                this.style.position = 'static';
                this.style.left = '0px';
                this.style.top =  '0px';
                document.getElementById('holderr').innerHTML = '<font color=red>' + textmsg[1881] + '</font>';
            
            }
        } 
    }
}
function delfiles()
{
   if (tobedeleted!='')
   {
       parent.ResizeUploaded.folder0 =  folder0;
       parent.ResizeUploaded.deleteFiles(folder0,tobedeleted);
       tobedeleted = '';
   }
}
var onloadbeforetumnail = null;
if (typeof window.onload == 'function')
    onloadbeforetumnail = window.onload;
window.onload = function()
{
    if (onloadbeforetumnail!=null)
    beginwith();
}
window.onunload = delfiles; 
//window.onbeforeunload = function(){delfiles();return "";}




