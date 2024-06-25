var currentcid ;
var faces = [];
var nonpersons = '';
var tobedeledtd = [];
var okphase = 0;
var alllabels = textmsg[1673].split(/@/);
// (defaultRecord[12] != defaultRecord[13]) webserviceAlloptions = webserviceAlloptions.replace(/<a[^>]+>[^<]+<.a>/,'').replace(/<a[^>]+>[^<]+<.a>/,'').replace(/&nbsp;/g,'');
 
function startface(cid)
{
    //Session,SID,Picker,FirstName,LastName,MiddleName,AttendToday,TotalAttend,Monitor,Status,FaceInfo
    if (ctype[10] =='h')
    {
        var maintbl = document.getElementById('maintable');
        ctype[10] =='t';
        var tr = maintbl.rows[1].cells;
        for (var j=0; j < tr.length; j++)
            if (tr[j].innerHTML.indexOf(labels[9])>=0) 
        {    tr[j].innerHTML = '<nobr><b>'+ labels[10] + '</b></nobr>';
             hints[9] = labels[10];
             break;
         }
        
        for (var i=0; i < NUMROWS; i++)
        {
            var el = ele(i,9); 
            el.style.cssText = 'display:none;width:1px;overflow:hidden';
            el = ele(i,10);
            el.type = 'text';
            el.style.width= (parseInt(fsize[9])*10) + 'px';
            el.style.border = '0px';
            el.onmouseover = function()
            {
                if (''!=this.value)
                showmyhintstr('<img src="FileOperation?did=' + this.value + '">');
            }
            el.onmouseout = hidemyhint;
             
            el.onchange = function()
            {   
                okphase = 0;
                var nm = this.name;
                rr = parseInt(nm.replace(/_.*/,''));
                cc = parseInt(nm.replace(/[^_]+_/,''));
                valuechanged[rr] = true;
                if (this.value.length < 5 && isNaN(this.value) == false)
                {
                    var k = parseInt(this.value);
                    myprompt("<img src=FileOperation?did=" + faces[k] + " >",null, "if(v)usethispic(" +k + ")");
                    var xy = findPositionnoScrolling(this);
                    promptwin.style.top = (xy[1] + 30) + 'px';
                    promptwin.style.left = (xy[0] -260) + 'px';
                }
                else
                {
                    holdvalues[nm] = this.value;
                }
            }
        }
    }
    currentcid = cid;
    var att = document.createElement('input');
    att.type = 'hidden';
    att.name = 'attachphoto';
    f1.appendChild(att);
    if (typeof(fsnd.localpathtoupload) == 'undefined')
    {
        var fe = document.createElement('input');
    
        fe.type = 'file';
        fe.name = 'localpathtoupload';
        fe.style.visibility = 'hidden';
        fsnd.appendChild(fe);
        fe = document.createElement('input');

        fe.type = 'hidden';
        fe.name = 'saveindir';
        fe.value = cid + '/attendance';
        fsnd.appendChild(fe);
        fe = document.createElement('input');

        fe.type = 'hidden';
        fe.name = 'saveasfile';
        
        fsnd.appendChild(fe);
    }
    fsnd.localpathtoupload.disabled = false;
    fsnd.localpathtoupload.onchange = function()
    {
        if (this.value == '') return;
        var aa = this.value;
        var i = aa.lastIndexOf('.'); 
        
        if (i > 0) {
        aa = aa.substring(i);
        if (aa.toLowerCase() != '.jpg' && aa.toLowerCase() != '.jepg' && aa.toLowerCase() != '.png' && aa.toLowerCase() != '.gif' && aa.toLowerCase() != '.tiff')
        {
              myprompt('need image file');
             return;
        }
        
        var y = ('' + ((new Date()).getTime())); 
        fsnd.saveasfile.value = y.substring(y.length-8) + aa ;
       
        webservice(null,'UploadFile',0,null,'w' + tstmp);
    }
    else myprompt('illegal file');
    }
    fsnd.localpathtoupload.click();
    
}
if (typeof(addedItem) == 'undefined') addedItem = null;
var thepathcode='',thefilename='';
addedItem = function(filename,pathcode, len, tm)
{
    thepathcode = 'web/' + pathcode;
    thefilename = filename + '@' + tm;
    syn(thepathcode, thefilename);
    
}

function takeattendance(i)
{
    var y = retrv(i,7);
    if (y == null || y=='' || isNaN(y)) y = '0';
    setv(i, 7, '' + (parseInt(y) + 1));
    setv(i, 6, '1');
    holdvalues[i + '_6'] = '1';
    holdvalues[i + '_7'] = '' + (parseInt(y) + 1);
    set(NUMROWS,7,'' + (parseInt(retrv(NUMROWS,7))+1) );
    set(NUMROWS,6,'' + (parseInt(retrv(NUMROWS,6))+1) );
}
var attendancephoto;
function countattendance(s)
{   //Session,SID,Picker,FirstName,LastName,MiddleName,AttendToday,TotalAttend,Monitor,Status,FaceInfo
    var ss = s.split(/;/);
    var missed = '';
    attendancephoto = ss[2];
    var cc=0;
    for (var i=0; i < numRows; i++)
    {
        var fi =   retrv(i, 10) + ',';
        
        if(fi!=",") cc++;
        if (fi.length>2  &&  ss[0].indexOf(',' + fi) >= 0) 
        {
            
           takeattendance(i);
        }
        else if (fi.length>2  &&  ss[0].indexOf(','+fi) < 0  ) 
        {
            missed  += fi + retrv(i,4) + ',' + i + ',';
        }
    }
     
    if (ss[1].length>1 || missed!='')
       shownotma(ss[1],missed);
    else if(ss[1].length>1)
       myprompt(textmsg[1671]); 
}
function arriveperson(td,j)
{
    if (onclickdown == false) return;
    if (td.style.color == 'orange' || td.style.color == 'rgb(255,0,0)')
     {
         td.style.color = 'green';
     }
     else
     {
         td.style.color = 'orange';
     }
     onclickdown = false;
}
function isgreen(cl)
{
    var x = (''+cl).replace(/rgb/,'').replace(/\(/,'').replace(/\)/,'').split(/,/);
    if (x.length>1 && x[1] == '256') return true;
    return false;
}
function docallattend(t)
{
   if (t.value == alllabels[2])
   {
       document.getElementById('callattend').value =  alllabels[4];
       document.getElementById('instr').innerHTML =   formathint(textmsg[1675]);
   }
   else
   {
       
       var tbl = document.getElementById('noshowtbl');
       var xx = tbl.rows[0].cells[0];
       while (true) 
       {  
           var xx = tbl.rows[0].cells[0];
           while (xx!=null &&  (xx.style.color != 'green' && !isgreen(xx.style.color))) xx = nextonetd(xx,tbl);
           if (xx==null) break;

           if (xx.style.color == 'green' || isgreen(xx.style.color))
           {
               var str = xx.innerHTML;
               var j = str.indexOf('FileOperation?did=');
               var l = str.indexOf('"',j);
               var p = str.substring(j+18,l);
               removethistd1(p);
               rr = 0; while (retrv(rr,10)!==p) rr++;
               takeattendance(rr);
           }
        } 
        document.getElementById('callattend').value =  alllabels[2];
        document.getElementById('instr').innerHTML =   initialinstr;
    }     
}

function dosaveface()
{
    optstate = 4;
    document.getElementById('instr').innerHTML = formathint(textmsg[1677]);
}
var beingdragged;
function dragThisurl(x) 
{
    beingdragged = x;
}

function testifdone(tblid)
{
    return  document.getElementById(tblid) == null 
    || document.getElementById(tblid).rows.length == 0;
        
}
 
function formathint(x)
{
    if (x.indexOf(";") < 0) 
    { 
        return '<table><tr><td><img style=float:left width=50 src=image/guide1.gif></img></td><td>'+x + '</td></tr></table>';
    }
    var y = x.split(/;/);
    x =  '<table><tr><td><img style=float:right width=50 src=image/guide1.gif></td><td valign=top><ol style="padding:0px 0px 0px 23px;margin:-16px -16px -16px 0x;">';
    for (var i=0; i < y.length; i++)
        x += '<li>' + y[i] + '</li>'
    return x + '</ol></td></tr></table>';
        
}
var onclickdown = false;
function didmousedown()
{
    onclickdown = true;
}
function selallicons()
{
    var tbl = document.getElementById('picmatchtbl');
    for (var i=0; i < tbl.rows.length; i++)
        for (var j=0; j < tbl.rows[i].cells.length; j++)
            tbl.rows[i].cells[j].childNodes[0].click();
}
function shownotma(ss,missed)
{
     closeprompt();
     var str0 = "<table cellpadding=3 cellspacing=1   align=center style=border-color:#909090;border-collapse:collapse;border-radius:3px border=0 ";
     var str = ''; var w1 = 0;
     if (missed!='') 
     {
         var  xx =  missed.replace(/,$/,'').split(/,/);
         
         for (var i=0; i < xx.length/3; i++)
         {

             var wh =  90;
             if ( i % 8 == 0){str += "<tr >";}

             str +="<td width=" + wh + "  valign=top align=center style=\"font-size:28px;color:orange;padding:1px 1px 0px 1px\">" + xx[3*i+1] + "<br><img style=\"border:0px;margin:0px 0px 0px 0px;border-radius:4px;\" src=\"FileOperation?did=" + xx[3*i]
             + "\" onmouseup=\"arriveperson(this.parentNode," + xx[3*i+2] + ")\"   onmousedown=\"dragThisurl('" + xx[3*i] + "');didmousedown()\"  ></td>\n";

             if (3*i+3==xx.length ||  i%8 == 7){str += "</tr>";} 

         }
         if (i < 8) wh = i*92 ; else wh = 736;  
         str =  '<span id=noshowlbl>'+ textmsg[1672] + '</span>' + str0 + " width="+ wh + " id=noshowtbl>" + str + "</table><br>\n";
         w1= wh;
     }
     
     var hash = false;
     var w2 = 0;
     var  str1 = '';
     if (ss!='')
     { 
         faces = ss.replace(/,$/,'').split(/,/);
         
          
         for (var i=0; i < faces.length; i++)
         {

             var wh =  90;
              
             if ( i % 8 == 0){str1 += "<tr height=" + (wh + 2) + ">";}
             str1 +="<td width=" + wh + "><div style=\"color:red;font-size:40px;border-radius:45px;width:" + wh + "px;height:" + wh + "px\"  onclick=\"nonperson("+i+",this)\"  onmouseover=landonhere("+i+") >" +i + "</div></td>\n";

             if (i==faces.length-1||  i%8 == 7){str1 += "</tr>";} 

         }
         if (i < 8) wh = i*92; else wh = 736; 
         str1 =  '<span>'+ textmsg[1669] + ' <a href=javascript:selallicons()>'+ textmsg[1685] + '</a> | <a href=javascript:orginalphoto()>'+ textmsg[1686] + '</a></span>' + str0 + " id=picmatchtbl width="+ wh + " cellpadding=0>" + str1 + "</table>";
         w2 = wh;
     }
     else
     {
         nonpersons = attendancephoto + ",";
         delonenonperson();
         attendancephoto = '';
     }
     if (w2 < w1) w2 = w1;
     if (w2 < 500) w2= 500;
     var bw = 5*font_size;
     var but1 = '<input id=delnonface type=button onclick=delonenonperson() class=RedButton style=width:' + bw + 'px value="' + alllabels[0] + '">\n';
     var but2 = '<input id=recognize type=button onclick=dorecognize() class=OrangeButton style=width:' + bw + 'px value="' + alllabels[1] + '">\n';
     var but3 = '<input id=callattend type=button onclick=docallattend(this) class=GreenButton style=width:' + bw + 'px value="' + alllabels[2] + '">\n';
     var but4 = '<input id=saveface type=button onclick=dosaveface() class=GreenButton style=width:' + bw + 'px value="' + alllabels[3] + '">\n';
   
     ss = '';
      
     if (str!='' && str1!='')
     {
         initialinstr = formathint(textmsg[1674]);
        
         ss = "<div class=outset3 id=noshowlbl>" + str + "</div><table align=center><tr><td>" + but1 +'</td><td>'+ but2 +'</td><td>'+ but3 +'</td><td>'+ but4 + "</td></tr></table>"
                 + "<div id=instr style=\"width:" +w2 + "px;margin:5px 0px 5px 0px;\" class=outset3>"+initialinstr+"</div>\n<div class=outset3  id=picmatchlbl>" 
                 + str1  + "</div>";
     }
     else if (str!='' )
     { 
         initialinstr = formathint(textmsg[1675]);
         ss = "<div class=outset3  id=noshowlbl>" + str + "</div><center>" +   but3 +  "</center>" + " <div id=instr style=\"width:" +w2 + "px;margin:5px 0px 5px 0px;text-alignment:left\" class=outset3>" + initialinstr + "</div>\n";
     }
     else if (str1 != '')
     {
         initialinstr = formathint(textmsg[1676]);
         ss =   "<center>" + but1 +  but4 +  "</center>" + " <div id=instr style=\"width:" +w2 + "px;margin:5px 0px 5px 0px;text-alignment:left\" class=outset3>" + initialinstr + "</div><div class=outset3  id=picmatchlbl>" + str1 + "</div>";
     }
      
     myprompt(ss,null, null,textmsg[1668],'facedia');
     document.getElementById('facedia').getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].onclick
     = function()
     {
         if (testifdone('picmatchtbl') && testifdone('noshowtbl') || exitlevel == 1)
         {
              document.body.removeChild(document.getElementById('facedia'));
             
         }
         else if (document.getElementById('picmatchtbl')!=null && document.getElementById('picmatchtbl').rows.length > 0)
         {
             document.getElementById('instr').innerHTML =  formathint(textmsg[1670]);
         }
         else if (exitlevel == 0)
         {
             document.getElementById('instr').innerHTML =  formathint(textmsg[1683]);
             exitlevel =  1;
         }
         
     }
     exitlevel = 0
     if (str!='' && str1=='')
     {
         document.getElementById('callattend').value = alllabels[4];
         optstate = 3;
     }
     if (str1!='') assignimage(0); 
}

function assignimage(k)
{
    if (k == faces.length) return;
    var img = new Image();
    img.id = 'tdbk' + k;
    img.onload = function() 
    {
        var k = parseInt(this.id.substring(4));
        var mm = document.getElementById('picmatchtbl');
        if (mm == null) return;
        var i = Math.floor(k/8);
        var j = k%8;
        var xx = mm.rows[i].cells[j]; 
        xx.childNodes[0].style.backgroundImage = "url(" + this.src + ")";
        assignimage(k+1);
    };
    img.src = "FileOperation?did=" + faces[k] + "&t=" + (new Date()).getTime();
}


var exitlevel = 0;

var ismoreclear = false;
var asknosure = false;
function moreclear(ck){ismoreclear =ck.checked;}
function nomoresure(ck){asknosure = ck.checked;}
function landonhere(i)
{
     if (onclickdown == false) return;
     if (asknosure)
     {
         goaheadmatch(i);
         return;
     }
    myprompt(textmsg[1681] + "<br><table align=center cellpadding=5 cellspacing=4><tr><td class=outset3><span>" +textmsg[1679].replace(/,.*/,'') + "</span><br><img src=FileOperation?did=" + beingdragged + "></td><td class=outset3><span>" +textmsg[1679].replace(/[^,]+,/,'') + "</span><br><img src=FileOperation?did=" 
            + faces[i] + "></td></tr><tr><td colspan=2><input type=checkbox onclick=\"moreclear(this)\">" +textmsg[1680]  
            + "</td></tr><tr><td colspan=2><input type=checkbox onclick=\"nomoresure(this)\">" +textmsg[1684]  
            + "</td></tr></table>", null, "if(v)goaheadmatch("+i+")");
    onclickdown = false;
}
 
function dorecognize()
{
    document.getElementById('instr').innerHTML = formathint(textmsg[1678]);
}
function goaheadmatch(k)
{
 var tobedeled = faces[k];
 rr = 0; while (retrv(rr,10)!=beingdragged)rr++;
 takeattendance(rr);
 if (ismoreclear)
 {
     setv(rr, 10, faces[k]); 
     holdvalues[rr + '_10'] = faces[k];
     tobedeled = beingdragged;
 }
 removethistd1(beingdragged);  
 removethistd(faces[k]);   
 valuechanged[rr] = true;  
 closeprompt();
 nonpersons += tobedeled + ",";
 delonenonperson();
}
function removethistd1(x)
{
    var tbl = document.getElementById('noshowtbl');
    if (tbl.rows.length == 0) return;
     var xx = tbl.rows[0].cells[0],yy;  
     while (xx!=null && xx.innerHTML.indexOf(x)<0)xx = nextonetd(xx,tbl);
     if (xx == null) return;
      
     while ((yy = nextonetd(xx,tbl))!=null)
     {
         xx.innerHTML = yy.innerHTML;
         xx.style.color = yy.style.color;
         xx = yy;
     }
     cutofftail(tbl);
}
var wheredown = [0,0];
var wheretoup = [0,0];
var optstate = 0;
function okonenonperson()
{
    if (okphase == 1)
    {
        //delonenonperson();
        nonpersons = '';
        closeprompt();
        return;
    }
    var str = '';
    var mm = document.getElementById('picmatchtbl');
    for (var i=0; i < mm.rows.length; i++)
        for (var j=0; j < mm.rows[i].cells.length; j++)
            if (mm.rows[i].cells[j].innerHTML.replace(/[0-9]/g,'') == '')
            {
                var k = mm.rows[i].cells[j].style.backgroundImage.replace(/.*FileOperation.did=/,'').replace(new RegExp("\\).*"), '').replace(/"/,'');
                str += k + ",";
                document.getElementById('delnonface').style.visibility = 'visible';
                mm.rows[i].cells[j].style.color = 'black';
            }
    if (str!='')
    {
        var rw = mm.insertRow(-1);
        var cl = rw.insertCell(-1); cl.colSpan = 8;
        cl.innerHTML =  textmsg[1670];
        nonpersons = str;
        okphase = 1;
    }
    else
    {
        closeprompt();
    }
}

function nonperson(i,td)
{
     if (td.style.color == 'red' || td.style.color == 'rgb(255,0,0)')
     {
         document.getElementById('delnonface').style.visibility = 'visible';
         td.style.color = 'black';
         nonpersons +=  faces[i] + ",";
         
         tobedeledtd[tobedeledtd.length] = td;
     }
     else
     {
         td.style.color = 'red';
         var j =  nonpersons.indexOf(faces[i] + ",");
         nonpersons = nonpersons.substring(0, j) + nonpersons.substring(j + faces[i].length+1);
         //if (nonpersons == '')  document.getElementById('delnonface').style.visibility = 'hidden'; 
     }
}
function nextonetd(x,tbl)
{
     
    for (var i=0; i < tbl.rows.length; i++)
        for (var j=0; j < tbl.rows[i].cells.length; j++)
            if (tbl.rows[i].cells[j] == x)
    {
        if (j < tbl.rows[i].cells.length-1)
            return tbl.rows[i].cells[j+1];
        else if (i < tbl.rows.length-1)
            return tbl.rows[i+1].cells[0];
    }
    return null;
}
function removethistd(x)
{
    var tbl = document.getElementById('picmatchtbl');
    if (tbl==null || tbl.rows.length == 0 || tbl.rows[0].cells.length == 0) return ;
     var xx = tbl.rows[0].cells[0],yy;  
     while (xx!=null && xx.innerHTML.indexOf(x)<0)xx = nextonetd(xx,tbl);
     if (xx == null) return ;
      
     while ((yy = nextonetd(xx,tbl))!=null)
     {
         xx.innerHTML = yy.innerHTML;
         xx = yy;
     }
     cutofftail(tbl);
     
}
function cutofftail(tbl)
{
     var R = tbl.rows.length;
     var C = tbl.rows[R-1].cells.length;
     if (C==1)
        tbl.deleteRow(R-1);
     else
     {   
         tbl.rows[R-1].deleteCell(C-1);
         if (R == 1)
         {
             tbl.width = ((C-1) *92);
         }
     }
    var a=  testifdone('picmatchtbl') ;
    var b = testifdone('noshowtbl');
    
    if (a&&b)
    {   
        document.body.removeChild(document.getElementById('facedia')); 
        nonpersons += attendancephoto + ","; 
    }
    else if (a) 
    {
        if (document.getElementById('picmatchlbl')!=null)document.getElementById('picmatchlbl').innerHTML = '';
        if(document.getElementById('delnonface')!=null)document.getElementById('delnonface').style.visibility = 'hidden';
        if(document.getElementById('saveface')!=null)document.getElementById('saveface').style.visibility = 'hidden';
        if(document.getElementById('recognize')!=null)document.getElementById('recognize').style.visibility = 'hidden';
        document.getElementById('callattend').value = alllabels[4];
        var xx = document.getElementById('instr'); xx.innerHTML = initialinstr = formathint(textmsg[1675]);
        nonpersons += attendancephoto + ",";
        
    }
    else if (b) 
    { 
        if( document.getElementById('noshowlbl')!=null)document.getElementById('noshowlbl').innerHTML = '';
        if(document.getElementById('recognize')!=null)document.getElementById('recognize').style.visibility = 'hidden';
        if(document.getElementById('callattend')!=null)document.getElementById('callattend').style.visibility = 'hidden';
        var xx  = document.getElementById('instr'); xx.innerHTML = initialinstr = formathint(textmsg[1676]);
    }     
   
}
function notagoodface(x)
{
     var j =  nonpersons.indexOf(x+',');
     for (var i=0; i < faces.length; i++)
     if (faces[i] == x) 
     {
         faces[i] = '';
     }
     removethistd(x);
     if (j  == 0)
     {
         if (nonpersons.length == x.length + 1)
             nonpersons = '';
         else 
             nonpersons = nonpersons.substring( x.length + 1);
     }
     else
     {
         if (j + x.length + 1 == nonpersons.length)
             nonpersons = nonpersons.substring(0, j);
         else 
             nonpersons = nonpersons.substring(0, j) + nonpersons.substring(j + x.length + 1);
     }
      
     if (nonpersons != '')
     {
         delonenonperson() 
     }
      
}

function usethispic(k)
{
 setv(rr,10,faces[k]);
 takeattendance(rr);
 removethistd(faces[k]);  
 holdvalues[rr + "_10"] = faces[k];
 valuechanged[rr] = true;  
 closeprompt();
}



function delonenonperson()
{
        if (nonpersons == '')
        {
            var xx = document.getElementById('instr'); xx.innerHTML = formathint("<font color=red><b>" + textmsg[1682] + "</b></font><br>");
            return;
        }
        
        var pathcode = nonpersons.replace(/,.*/,'');
        if (pathcode.length>0 && pathcode.length < 12)
        {
            nonpersons = '';
            var  xx = document.getElementById('instr'); xx.innerHTML = formathint("<font color=red><b>" + textmsg[1682] + "</b></font><br>");
            return;
        }
        
        
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
                var y = xmlhttp.responseText;
                if (y!=null && y!='')
                { 
                eval(y);
                }
            }
        }
        var f = new FormData();
        
        f.append('pathcode',pathcode);
        f.append('CourseId', currentcid);
        f.append('Session', '' );
        xmlhttp.open('POST', "UploadFace", true);
        xmlhttp.send(f);
 
}
var phasestatus = 0;
function orginalphoto()
{
   phasestatus = 1;
   ResizeUploaded.uploaded(thepathcode, thefilename);
   phasestatus = 0;
   //myprompt('<img src=FileOperation?did='+ attendancephoto + ">",null,null,1686);
}
var startk = 0;
 
function retrv1(ts, dayw,   dayw1,d)
{
   var  reg = new RegExp(/[0-9][0-9]?[ ]*:[ ]*[0-9][0-9]?/);  // 
   var  k = ts.indexOf(dayw );
   if (k==-1) k = ts.indexOf(dayw1 );
   if (k == -1)
   {
       return null;
   }
   var X = reg.exec(ts.substring(k+1));
    
   if (X==null) return null;
   var z = new Array(2);
   var perd = X.toString().replace(/ /g, '').split(/:/);
   for (var i=0; i < 2; i++)
       z[i] = parseInt(perd[i].replace(/^0/,''));
   var ds = new Date(d.getTime());
   
   ds.setHours(z[0], z[1], 0, 0);
    
  
   
   return [Math.round(ds.getTime()/1000), null];
       
}
function signsheet()
{
    startk = 0;
    var MAXN = 60;
    var weekdays = textmsg[830].replace(/,/g,'');
    var weekdays1 ="NMTWRFS" ;
    var timeslot = mat[0][numCols-3];
    var str = "<table cellspacing=10 id=alldates><tr>";
    
    var d = new Date();
    var l = d.getTime()  - 24*3600000;
    var l1 = l/1000+365*24*3600;
    d = new Date(l);
    var N = 0;
    
    while (N < MAXN && d.getTime()/1000 < l1)
    {
       var wd = d.getDay();
       var dayw = weekdays.charAt(wd);
       var dayw1 = weekdays1.charAt(wd);
       var se = retrv1(timeslot, dayw,dayw1, d);
           
       if (se != null)
       {
           if (N%20==0) str +=("<td><table><tr><td colspan=2><input type=checkbox onclick=checkbelow(this)></td></tr>") 
           str += "<tr><td><input type=checkbox></td><td><nobr>" + timestr(se[0])  + "</nobr></td></tr>";
           if (  N%20 == 19) 
               str += "</table></td>";
           N++;
       }
       d = new Date(d.getTime() + 24*3600000);
         
    }
       if ( N%20!=0) str += "</table></td>";
       str += "</table>";
       //N = starts.length;
       //starts[N] = Math.round(  (new Date()).getTime()/1000);
       //dues[N] = starts[N]+3600;
       let numc = 2;
       if (numRows < 30) numc=2;
       else if (numRows < 55) numc = 3;
       else if (numRows < 90) numc = 4;
       else numc = 3;
       let sed = ['','','','',''];
       sed[parseInt(numc)] = ' selected';
       myprompt(str + "</table><center><a href=javascript:nameattend()>" + textmsg[1870] + "</a>&nbsp;&nbsp;<select id=numc onchange=\"localStorage['numOfColumns']=''+this.options[this.selectedIndex].value;\"><option value=2 " + sed[2] +">2 " + textmsg[816] + "</option><option value=3 " + sed[3] +">3 " + textmsg[816] + "</option><option value=4 " + sed[4] +">4 " + textmsg[816] + "</option></select><input type=button class=GreenButton name=nextb onclick=fprint(document.getElementById('numc').options[document.getElementById('numc').selectedIndex].value)  value=\"" + textmsg[66] + "\"   style=width:70px;text-align:center><input  type=button class=YellowButton name=canceb onclick=closeprompt() value=\"" + textmsg[18] + "\" style=width:70px;text-align:center></center><br>",null,null,textmsg[1722]);
   
}
function nameattend()
{
     
     myprompt("<center><textarea id=nms rows=10 cols=60>" + textmsg[1868] + "</textarea><br><input class=OrangeButton style=width:120px;float:center type=button onclick=parseattendee() value=\"" + textmsg[1869] + "\" ></center>");
}

function parseattendee()
{
    var t = document.getElementById('nms').value.trim();
    if (t == '') return;
    var arr = t.replace(/[\n|;|,|\t]/g, '##').split(/##/);
    var did = new Array(arr.length);
    for (var j=0; j < numRows; j++)
    {
        var n = parseInt(retrv(j,7));
        if (n + '' == 'NaN') n = 0;
        var hasit = false;
        for (var i=0; hasit == false && i < arr.length; i++)
        {
            if (did[i] == true) continue;
            var nm = arr[i].trim().split(/[ ]+/);
            if (nm.length == 1 && (
                    nm[0].toLowerCase() == retrv(j,1).toLowerCase() 
                    || nm[0].toLowerCase() == retrv(j,4).toLowerCase()
                    )
               || nm.length == 2 && (
                        nm[0].toLowerCase() == retrv(j,1).toLowerCase()
                     || nm[1].toLowerCase() == retrv(j,1).toLowerCase()
                     || nm[0].toLowerCase() == retrv(j,3).toLowerCase() && nm[1].toLowerCase() == retrv(j,4).toLowerCase()
                     || nm[1].toLowerCase() == retrv(j,3).toLowerCase() && nm[0].toLowerCase() == retrv(j,4).toLowerCase()
                    ) 
               || nm.length == 3 && (
                        nm[0].toLowerCase() == retrv(j,1).toLowerCase()
                     || nm[1].toLowerCase() == retrv(j,1).toLowerCase()
                     || nm[2].toLowerCase() == retrv(j,1).toLowerCase()
                     || nm[0].toLowerCase() == retrv(j,3).toLowerCase() && nm[1].toLowerCase() == retrv(j,4).toLowerCase()
                     || nm[1].toLowerCase() == retrv(j,3).toLowerCase() && nm[0].toLowerCase() == retrv(j,4).toLowerCase()
                     || nm[2].toLowerCase() == retrv(j,3).toLowerCase() && nm[1].toLowerCase() == retrv(j,4).toLowerCase()
                     || nm[1].toLowerCase() == retrv(j,3).toLowerCase() && nm[2].toLowerCase() == retrv(j,4).toLowerCase()
                     || nm[0].toLowerCase() == retrv(j,3).toLowerCase() && nm[2].toLowerCase() == retrv(j,4).toLowerCase()
                     || nm[2].toLowerCase() == retrv(j,3).toLowerCase() && nm[0].toLowerCase() == retrv(j,4).toLowerCase()
                    ) 
                )
                {
                    did[i] = true;
                    hasit = true;
                    setv(j,6, '1');
                    break;
                }
        }
        if (hasit == false)
        {
            setv(j,6, '0');
            setv(j,7, ''+(n+1));
        }
}
}

function checkbelow(bx)
{
    var tbl = bx.parentNode.parentNode.parentNode;
    if (tbl.tagName.toLowerCase()!='table') tbl= tbl.parentNode;
    for (var i=1; i < tbl.rows.length; i++)
    {
       var cx= tbl.rows[i].cells[0].getElementsByTagName('input')[0];
       cx.checked = bx.checked;
    }
}

function fprint(numcstr)
{
    let numc = parseInt(numcstr);
    var v = [];
    var tr = document.getElementById('alldates').rows[0];
    for (var i=0; i < tr.cells.length; i++)
    {
        var tbl = tr.cells[i].getElementsByTagName('table')[0];
        for (var j=1; j < tbl.rows.length; j++)
        {
            var cx= tbl.rows[j].cells[0].getElementsByTagName('input')[0];
            if (cx.checked) v[v.length] = tbl.rows[j].cells[1].innerHTML;
        }
    }
    if (typeof(encoding) == 'undefined')
    {
        var x = document.getElementsByTagName('head')[0].innerHTML.toLowerCase();
        var ii = x.indexOf('charset=');
        if (ii >0)
        {
            var jj = x.indexOf('"',ii+8);
            encoding = x.substring(ii+8,jj); 
        }
        else
            encoding = "utf-8";
    }
     
    var nav = window.open("", "_blank");
    let sheight = 55; if (numc == 3) sheight = 42; else if (numc == 4) sheight = 34;
    let tfs = 42;     if (numc == 3) tfs = 32; else if (numc == 4) tfs= 26;
    let scw = 50;     if (numc == 3) scw = 33; else if (numc == 4) scw= 25;
    let lfs = 18;     if (numc == 3) lfs = 14; else if (numc == 4) lfs= 12;
     
    nav.document.write("<!doctype html><html><head><title></title><meta http-equiv=\"content-type\" content=\"text/html; charset=" + encoding +"\"><style>@page{size: auto; margin: 10mm; }\nspan{font-size:" + tfs + "px;font-weight:bold;text-align:center}\n@media print { div{page-break-after: always; }}</style></head><body>");
    for (var i=0; i < v.length; i++)
    {
         var nms = [];
         for (var r=0; r < numRows; r++)
         {
             var name = mat[r][3]; if (name=='') continue;
             if (ctype[5]!='h') name += " " + mat[r][5].replace(/(.).*/,'$1');
             if (ctype[4]!='h') name += " " + mat[r][4];
             nms[nms.length] = name;
             
         }
         nms.sort();
         let H = Math.ceil(nms.length/numc);
         nav.document.write("<div><center><span>" + title.replace(/ [^ ]+$/,'') + "-" + mat[0][0] + " " + textmsg[1721] + "(" + v[i] +  ")</span><br></center><table align=center cellspacing=5  cellpadding=3  border=0 style=border-collapse:collapse width=100% >" );
         for (var r=0; r < H*numc; r++)
         {
             let row = ~~(r/numc), col = r%numc, m = col*H+row;
             if (m >= nms.length || nms[m] == null) nms[m]= '';//alert("length=" + nms.length + ", r=" + r  + ", row=" + row + ", col=" + col + ", H=" + H + ", m=" + m);
             if (r%numc == 0)nav.document.write("<tr height=" + sheight + ">");
             
             nav.document.write("<td style=\"font-size:" + lfs + "px;border:1px black solid\" width=\"0%\" ><nobr>" + nms[m] + "</nobr></td><td style=\"font-size:" + lfs + "px;border:1px black solid\"  width=\"" + scw + "%\" ></td>");
             if (r%numc == numc-1)nav.document.write("</tr>");
             //else nav.document.write("<td style=border:0px width=\"2%\" ></td>");
         }  
         
        
       nav.document.write("</table></div>");
   }
   nav.document.write("</body></html>");
   closeprompt();
}


var sids = '';
for (var jj=0; jj < numRows; jj++) sids += mat[jj][1].replace(/ /g,'')+ "\n";
 
function subchange(x )
{
     if (sids=='')
     {
         closeprompt();
         return;
     }
     if (x == 'Revoke1')
     {
          
         myprompt(textmsg[1756] + "<br><center><input name=b1 type=button class=OrangeButton style=\"" + (4.2*font_size) + "px\" value=\"" + textmsg[1757] + "\" onclick=subchange('Notify')>" + 
         "<input name=b2 type=button class=OrangeButton  style=\"" + (4.2*font_size) + "px\" value=\"" + textmsg[1758] + "\" onclick=subchange('Revoke')  ></center>");
     }
     else if (x == 'Notify')
     {
         var nms = ['opt','sids'];
         var vls = [x, sids];
         
         postopen('cfgfolders.jsp',nms,vls,  "w" + tstmp);
        
     }
     else
     {
         var nms = ['opt','sids'];
         var vls = [x, sids];
         
         postopen('cfgfolders.jsp',nms,vls,  "w" + tstmp);
     }
}
function notdone(x, sids)
{
    if (sids=='') myprompt(textmsg[1357]);
    else myprompt(  sids.replace(/,$/,'') + "<br>" + textmsg[91]);
}
function startfolder()
{
    var str =  "<form rel=opener name=f22  ><table width=96% align=center><tr><td colspan=2>" + textmsg[1759] + "</td></tr><tr><td><input name=b2 type=radio value=\"GrantWebsite\"></td><td>" + textmsg[1752]  + "</td></tr>" +
            "<tr><td><input name=b2 type=radio value=\"Grant\" checked></td><td>" + textmsg[1751]  + "</td></tr>" + 
             "<tr><td><input name=b2 type=radio value=\"Revoke1\"></td><td>" + textmsg[1753]  + "</td></tr>" +
             "<tr><td><input name=b2 type=radio value=\"RevokeWebsite\"></td><td>" + textmsg[1754]  + "</td></tr>" + 
    "<tr><td colspan=2 align=center><input name=b1 type=button class=OrangeButton style=width:70px value=\"" + textmsg[720] + "\" onclick=subchange(document.f22.b2.value) >" + 
    "<input name=b3 type=button class=OrangeButton style=width:70px value=\"" + textmsg[18] + "\" onclick=closeprompt() ></td></tr></table></form>";
    myprompt(str,null,null,textmsg[154] + ' '+ textmsg[675]);
}
function allchanged()
{
    for (var i2=0; i2 < numRows; i2++)
    {
        valuechanged[i2] = true;
    }
} 
var cutime = parseInt((''+(new Date()).getTime()).replace(/.......$/,(''+tstmp).substring(0,4)));
for (var i2=0; i2 < numRows; i2++)
{
    var ab = mat[i2][6];
    if (ab==null || ab=="0" || ab==0 || cutime - parseInt(ab) > 36000)
    {
        mat[i2][6] = "1";
    }
    else
    {
        mat[i2][6] = "0";
    }
    if( mat[i2][7] == null) 
        mat[i2][7] = '0';
} 
//onbegin += ";allchanged();";





