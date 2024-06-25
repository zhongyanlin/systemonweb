
var oldsort;
var oldcopyback;
var oldenlarge;
var editthiscellold;
var activequestionnum;
var leavingboxold;
var uniformula = new Array();
var modifiedanswer = new Array();
var thecurrenttxtarea, thecurrentpos,thecurrenttxtarea1;
options[10][options[10].length] = '6';
captions[10][captions[10].length] = textmsg[1775].split(/@/)[1]; 
//0    1            2         3        4     5        6       7     8     9       10      11           12     13     14       15       16      17       18    19    20        21
//Course,AssignTest,StudentId,SubmitAt,Score,PhotoUrl,Content,Comment,due,Format, StudName,Attachment, atype,assess, AsAssess,question, Answer,Attachat,Scale,Weight,Sessions Aformat
//course,AssignTest,StudentId,Student,Score,Photo,   content, Attachm,Delay,Comment,Format,Type,       Due,   Assess,AsAssess,question,answer,Attachat,Scale,Weight,Session,Aformat
//course,Assigntest,StudentId,Student,Photo,Score,    content,Attach, Delay,Comment,Format,Type,       Assess,AsAssess,question,answer,Attachat,Sessionname

var semester = (parent.frames.length > 1) ? parent.frames[0].retrv(0, 0) : opener.getSemester();
onlinetoolbar = function(txt,c)
{
    var toolbar = document.getElementById("toolbarbase");
    if (toolbar == null)
    {   
        
        toolbar = document.createElement("div");
        toolbar.id="toolbarbase";
        var zindex = document.getElementById("toolbar").style.zIndex + 2;
      
        toolbar.style.cssText = "position:absolute;visibility:visible;z-index:" + zindex + ";top:50;left:60";
        toolbar.innerHTML = "<table cellspacing=0 cellpadding=0><tr><td> </td><td> </td></tr></table>";
        document.body.appendChild(toolbar);
        toolbar.getElementsByTagName('table')[0].rows[0].cells[0].appendChild(fsnd);
        toolbar.getElementsByTagName('table')[0].rows[0].cells[1].appendChild(document.getElementById("webtoolset"));
    }
    var xx = document.getElementById("enlargebut");
    if (txt==null)
    {
        thecurrenttxtarea = ele(counter,6);
        toolbar.style.cssText = "position:static;z-index:auto;top:0;left:0;background-color:white;border:1px orange solid";
        if (toolbar.getElementsByTagName('table')[0].rows[0].cells[0].innerHTML.length < 30)
            toolbar.getElementsByTagName('table')[0].rows[0].deleteCell(0);
        if (xx!=null) document.body.removeChild(xx);
    }
    else
    {
        if (thecurrentpos == null)
        {
            thecurrentpos = toolbar.parentNode;
        }
        thecurrenttxtarea = txt;


        var xy = findPositionnoScrolling(txt);
        
        if (xx!=null)
        {
            xx.style.top = (xy[1] - 20) +"px";
            thecurrenttxtarea1 = txt;
            if(c==null)return;
        }
        var ww = toolbar.getElementsByTagName('table');
 
        if (ww!=null && ww.length>0 && ww[0].rows[0].cells[0].offsetWidth> 30)
        {
            var zz= ww[0].rows[0].insertCell(0);
            
            zz.innerHTML = "&nbsp;&nbsp;&nbsp;";
            zz.onclick =   onlinetoolmini;
            zz.style.cssText = "width:24px;background:url(image/tosmall.png)  no-repeat;background-position:2px  5px";
        }
        toolbar.style.cssText = "position:absolute;top:" + (xy[1] - toolbar.offsetHeight) +"px;left:" + xy[0] +"px;background-color:white;border:1px orange solid;z-index:20";
        // thecurrentpos.innerHTML = '';
        if (c==1) document.body.removeChild(xx);
    }
}; 
function onlinetoolmini()
{
 
    var xy = findPositionnoScrolling(thecurrenttxtarea);
    thecurrenttxtarea1 = thecurrenttxtarea;
    onlinetoolbar();
    var d = document.createElement("div");
 
    d.style.cssText = "position:absolute;z-index:11;background:url(image/enlarge.png) no-repeat;width:22px;height:20px;top:" + (xy[1]-20) +"px;left:" + xy[0] +"px";
    d.innerHTML = "&nbsp;&nbsp;&nbsp;";
    d.id = "enlargebut";
    d.onclick = function(){
        onlinetoolbar(thecurrenttxtarea1,1);
    }
    document.body.appendChild(d);
};
document.write("<style>.scoreword{color:red !important;background-color:" + TBGCOLOR +";border:0px;text-align:right}\n.negativeword{color:" + TBGCOLOR +" !important;background-color:" + TBGCOLOR +";border:0px;text-align:right}\n</style>");
document.write("<scr" + "ipt id=\"moregjs1\" src=\"checkHTML.js\"></scri" + "pt>");
document.write("<scr" + "ipt id=\"moregjs2\" src=\"assessform.js\"></scr" + "ipt>");
document.write("<scr" + "ipt id=\"moregjs\" src=\"gradingsheet.js\"></scr" + "ipt>");
for (var j = 0; j < numRows; j++)
{
    if (mat[j][7] == "-1" || mat[j][7] == '-2' && parseInt(mat[j][9]) >= 0)
    {
        mat[j][7] = '';
    }
    if (parseFloat(mat[j][9]) < 0)
        mat[j][9] = "0";
}
defaultRecord[0] = parent.frames[0].retrv(0,1);
ctype[0] = 'h';
for (var kk = 0; kk < captions[0].length; kk++)
{
    if (defaultRecord[0] == options[0][kk])
    {
        title = captions[0][kk];
        break;
    }
}
if (kk == captions[0].length)
{
    title = textmsg[152] + ": " + defaultRecord[0];
}
for (j = 0; j < numCols; j++)
{
    labels[j] = labels[j].substring(0, 1).toUpperCase() + labels[j].substring(1);
}



 

function doattach(str)
{
    //genAttach(Z);
    showattachment(str,Z);
}

function attachmentZ(z)
{
    Z = z; 
    ResizeUploaded.attachman(ele(z,7));
}
/*
function genAttach(z)
{
    var x = ele(z, 7);
   
    var p = x.parentNode;
    for (var i = p.childNodes.length - 1; i >= 0; i--)
    {
        if (p.childNodes[i] != x)
            p.removeChild(p.childNodes[i]);
    }
    x.style.width = "1px";
    x.setAttribute("type", "hidden");

    var str = retrv(z, 7);
    if (typeof(fsnd.attach)!='undefined')
    fsnd.attach.value = str;
    else if (typeof(fsnd.Attachment)!='undefined')
    fsnd.Attachment.value = str;
    var attarr;
    if (str != '')
    {    
        attarr = ResizeUploaded.unzip(str).replace(/@[^,]+,/g, ',').replace(/[ ,]+$/,'');

        if (attarr.charAt(attarr.length-1) == ',')
            attarr = attarr.substring(0,attarr.length-1);
    }
    else
    {
        attarr = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
    }
    var a = document.createElement("a");
    a.href = "javascript:attachmentZ("+ z +")";
    a.innerHTML = attarr;
    x.parentNode.insertBefore(a, x);
     
}
*/
function genattachall()
{
    for (var i = 0; i < numRows; i++)
    {
       // genAttach(i);
    }
}

function addasslink()
{

}

function openit3(z, str)
{
    openit("FileOperation?folder=" + encodeURIComponent(subdb + "/" + retrv(z, 0) + "/submission/" + retrv(z, 2)) + "&filedir=" + str + "&operation=open");
    Z = z;
}

var testsheet = null;
var istest = false;
var freeformat;
var leftbutwidth = Math.round(font_size*charwidthrate());
function adjustphotowidth()
{
    //genattachall();
    oldsort = sort;
    oldcopyback = copyback;
    oldenlarge = enlarge;
    oldallowenter = allowenter;
    
    
    sort = function(j)
    {
        oldsort(j);
        //genattachall();
        whitethem();
    }

    addasslink();
    var tb = document.getElementById("maintable");

    for (var i = 0; i < tb.rows.length; i++)
    {
        tb.rows[i].cells[4].width = (font_size + 12);
    }

    copyback = function(z, j)
    {
        if (testsheet != null)  
        testsheet.makeback();
        valuechanged[z] = true;
        LaTexHTML.reset();
        if (istest)
        {
            
            var bar = document.getElementById("toolbar");
            var tbl = bar.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0];
            var fm = document.thisform;
            if (mat[z][5] != '-2') 
            {
                var toolset = document.getElementById('formtoolset');
                fm.parentNode.appendChild(fsnd);
                toolset.parentNode.insertBefore( document.getElementById('webtoolset'),  toolset);
            }
            document.body.removeChild(bar);
            largeZ = -1;
            largej = -1;
            for (var x in modifiedanswer)
             {
                var  y = modifiedanswer[x];
                if (y == null) continue;
                var f3 = document.createElement("form");
                f3.method = "POST";
                var nms = ['rdap','rsacode','subdb','wcds','securitytoken', 'orgnum'];
                var vls = ['assignedit','0',f1.subdb.value,'','', orgnum];
                vls[3] = modifiedanswer[x];
                onsaved = "valuechanged["+counter+"]=false;";
                 formnewaction(f3,'SaveBack');
                 f3.target = "w" + tstmp;
               //  f3.action = 'Echo';  f3.target = "_blank";
                document.body.appendChild(f3);
                for (var i=0; i < nms.length; i++)
                {
                    var el = document.createElement('input');
                    el.type = 'hidden';
                    el.name = nms[i];
                    el.value = vls[i];
                    f3.appendChild(el);
                }

               visual(f3);
 f3.submit();
                document.body.removeChild(f3);
                modifiedanswer[x] = null;
            }
        }
        else
        {
            oldcopyback(z, j);
        }
         
    }
    
    enlarge = function(tx, z, j)
    {
        istest = (mat[z][11] == '1' || mat[z][11] == '3' || mat[z][11] == '4');
        var tbl = oldenlarge(istest? null:tx, z, j);
        if (tbl == null) return;
        if (mat[z][4] == '-2') 
        {
                var fm = document.thisform;
                var toolset = document.getElementById('formtoolset');
                fm.parentNode.appendChild(fsnd);
                toolset.parentNode.insertBefore( document.getElementById('webtoolset'),  toolset);
                
        }
        freepicture = false;
       
        if (mat[z][10] == '6')
        {
            LaTexHTML.reset();
            if (!istest) 
            {
                freepicture = true;
                testsheet = null;
                tbl.rows[1].cells[0].innerHTML = '';
                tbl.rows[1].style.height = '100px';
                var hh = [800,700,4];
                 
                tbl.rows[1].cells[0].innerHTML = "<form rel=opener name=form3  > <div id=content >" + makeimgs(z,hh,mat[z][7],mat[z][13]) + "</div></form>";
                contenttd = document.getElementById('content');
                
            }
            else
            {   
                testsheet = new TestSheet(z, retrv(z,j), mat[z][14], retrv(z,13), retrv(z,21), istest,mat[z][15],mat[z][16],mat[z][17],mat[z][7], 4, 13 ); 
                tbl.rows[1].cells[0].innerHTML = '';
                tbl.rows[1].style.height = '100px';
                var tt = testsheet.makesheet();
                var hh = [800,700,4];
                 
                tbl.rows[1].cells[0].innerHTML = "<form rel=opener name=form3  ><div style=width:100px;position:fixed;left:0px;display:inline>" + tt + "</div><div id=content style=margin-left:100px>" + makeimgs(z,hh,mat[z][7],mat[z][13]) +  testsheet.makecomments(hh) + "</div></form>";
                contenttd = document.getElementById('content');
            }
            //document.getElementById('sumptr').innerHTML = retrv(n,18);
        }
        else if (istest || mat[z][14] !='')
        {   
            
            LaTexHTML.reset();
            testsheet = new TestSheet(z, retrv(z,j), mat[z][14], retrv(z,13), retrv(z,21), istest,mat[z][15],mat[z][16],mat[z][17],mat[z][7], 4, 13 ); 
                                 //(n, content,    assess,     sheet,       fmt,         istest, scorebox, assessbox, contentbox)
            if (istest)
            {   
                tbl.rows[1].cells[0].innerHTML = '';
                tbl.rows[1].style.height = '100px';
                tbl.rows[1].cells[0].innerHTML = "<form rel=opener name=form3  >" + testsheet.makequestanswer() + "</form>";
                testsheet.latex();
            }
            else
            {
                freeformat = new FreeFormat(z, 6, 10, 4, 7, 15, 16, 21,17)
                tbl.rows[0].cells[0].colSpan = 3;
                var tx = tbl.rows[1].cells[0].getElementsByTagName('textarea')[0];
                tx.style.width = '720px';//(tx.offsetWidth - 100)  + 'px'; 
                var rn = tx.value.replace(/[^\n]/g,'').length + 2;
                var r = tbl.rows[1];
                
                var c = r.insertCell(-1);
                c.vAlign = 'top';
                
                var xx = "<table border=0 cellspacing=0 cellpadding=1 style=\"margin:0x 0px 0px 0px\">";
                xx += '<tr><td id=showqui() style=color:blue onclick=showqa(this)><nobr>' + (showquestionanswer?textmsg[732] +  textmsg[178]:textmsg[543] +  textmsg[178]) + "</nobr></td></tr>";
                xx += "<tr><td  ><input type=button class=GreenButton  onMouseOver=\"showmyhintstr(textmsg[1767])\"  onMouseOut=\"hidemyhint()\"  style=\"width:" + leftbutwidth + "px\" value=\"" + textmsg[225] + "\"  ></td></tr>";
                xx += "<tr><td  ><input type=button class=OrangeButton  onMouseOver=\"showmyhintstr(textmsg[1768])\"  onMouseOut=\"hidemyhint()\" style=\"width:" + leftbutwidth + "px\" value=\"" + textmsg[1706] + "\" onclick=\"freeformat.asnewanswer()\"></td></tr>";
                xx += "<tr><td  ><input type=button class=OrangeButton  onMouseOver=\"showmyhintstr(textmsg[1769])\"  onMouseOut=\"hidemyhint()\"  style=\"width:" + leftbutwidth + "px\" value=\"" + textmsg[1628] + "\"onclick=\"freeformat.commenttoclass()\"></td></tr>"
                var yy = testsheet.makesheet();
                 
                if(yy == '')
                {
                yy = "<table cellpadding=1 cellspacing=0 ><tr><td colspan=2><b>" + textmsg[139] +"</b></td></tr><tr><td id=copyscorelbl width=" + Math.round(leftbutwidth*0.6) +   " valign=middle   style=\"background:" + gradientbg.replace(/\(/,'(to right,')  
                    +  ";white-space:nowrap;color:#DDCC11;overflow:hidden;height:"
                + (font_size+6) +"px;border-bottom:1px " + IBGCOLOR + " outset;border-left:1px " + IBGCOLOR + " outset;font-weight:bold;\">" + labels[4] + "</td><td><input type=text id=copyscore class=gradetxt style=\"width:" + Math.round(font_size*1.6) + "px;color:red;text-align:right;height:"
                + (font_size+6) +"px;\" value=\"" + retrv(freeformat.n,freeformat.scoreindex) + "\" onchange=\"freeformat.synscore()\" onkeypress=\"return numericgrade(event,this)\"></td></tr></table>"; 
                 
                }//</table>";
                if (rn < 5) rn = 5;
                tx.rows = rn;
                c.innerHTML = xx + "</table>";
                tx.addEventListener("change",function(){
                setv(freeformat.n, freeformat.contentindex,this.value);
                this.rows = this.value.replace(/[^\n]/g,'').length + 2;
                freeformat.updatemergesubmitted();},false);
                
                c = r.insertCell(0);
                c.innerHTML =  yy  ;
                c.vAlign = 'top'; 
                c.rowSpan =2;
                
                r = tbl.insertRow(2);
                c = r.insertCell(-1);
                c.id = 'merged';
                c.colSpan = 2;
                c.innerHTML =  freeformat.mergesubmitted();
                LaTexHTML.formatele(c);
                var toolbar = document.getElementById('toolbar');
                if (toolbar != null) toolbar.style.left = '0px';
                if (showquestionanswer) 
                {
                    var zw = freeformat.makequestionanswers();
                    r = tbl.insertRow(-1);
                    c = r.insertCell(-1);
                    c.vAlign = 'top'
                    c.style.cssText = 'font-weight:700';
                    c.innerHTML = textmsg[456];
                    c = r.insertCell(-1);
                    c.colSpan = 2;
                    c.innerHTML = zw[0];
                    LaTexHTML.formatele(c);
                     
                    r = tbl.insertRow(-1);
                    c = r.insertCell(-1);
                    c.vAlign = 'top'
                    c.style.cssText = 'font-weight:700;white-space:nowrap';
                    c.innerHTML = textmsg[457];
                    c = r.insertCell(-1);
                    c.id = "refanswer";
                    c.colSpan = 2;
                    c.innerHTML = zw[1];
                    LaTexHTML.formatele(c);
                }
            }
        }
        else
            testsheet = null;
         var bar = tbl;
         while (bar.tagName.toLowerCase()!='div')bar = bar.parentNode;
         var rr = new ResizeRounded(bar,resizeta);
         
         return tbl;
    }

    var oldsetv = setv;
    setv = function(r,c,v) 
    {
       if (c==5)
       {
           var x1 =  parseFloat(''+v);
           var y1 = ele(r,c);
           if (x1 == -2 || x1 == -1)
              y1.style.color = TBGCOLOR;
           else
              y1.style.color = 'red';
       }
       oldsetv(r,c,v);
    }

}
var showquestionanswer = false;
function numericgrade(event,t)
{
    var code = 49;
    if (!event)
        var event = window.event;
    if (event.keyCode) code = event.keyCode;
    else if (event.which) code = event.which;

    if(code == 13)
    {
        var xv = (t.value).replace(/\.0+$/,'');
        if (xv != mat[counter][4])
        {
            setv(counter,4, xv);
            valuechanged[counter] = true;
        }
        
        return true;
    }
    else if (code==8 || code==46)
        return true;
    if ( code < 48 || code > 57 )
        return false;
    return true;
}
function showqa(div)
{
    showquestionanswer = !showquestionanswer;
    div.innerHTML = (showquestionanswer?textmsg[732] + textmsg[178]:textmsg[543] + textmsg[178]) + '<br>';
    var tbl = div.parentNode.parentNode;
    if (tbl.tagName.toLowerCase() != 'table')
        tbl = tbl.parentNode;
    tbl = tbl.parentNode.parentNode;
    if (tbl.tagName.toLowerCase() != 'table')
         tbl = tbl.parentNode;
    if (showquestionanswer)
    {
        var zw = freeformat.makequestionanswers();
        var r = tbl.insertRow(-1);
        c = r.insertCell(-1);
        c.vAlign = 'top'
        c.style.cssText = 'font-weight:700';
        c.innerHTML = textmsg[456];
        c = r.insertCell(-1);
        c.colSpan = 2;
        c.innerHTML = zw[0];
        LaTexHTML.formatele(c);
        r = tbl.insertRow(-1);
        c = r.insertCell(-1);
        c.vAlign = 'top'
        c.style.cssText = 'font-weight:700;white-space:nowrap';
        c.innerHTML = textmsg[457];
        c = r.insertCell(-1);
        c.innerHTML = zw[1];
        c.colSpan = 2;
        LaTexHTML.formatele(c);
    }
    else
    {
        LaTexHTML.deformat(tbl.rows[4].cells[1]);
        tbl.deleteRow(4);
        LaTexHTML.deformat(tbl.rows[3].cells[1]);
        tbl.deleteRow(3);
    }
}

function changecolor40()
{
    if(ele(rr,5).value.indexOf('-1')>=0)
    {
        ele(rr, 5).style.color =  'red';
        ele(rr, 5).value = '';
    }
}
function changecolor41()
{
    if ((mat[rr][11] == '1' || mat[rr][11] == '3' || mat[rr][11] == '4') && (x == '-1' || x == '-2'))
    {
        setv(rr, 4, x);
    }
    if(ele(rr, 4).value.replace(/ /g,'')== ''  )
    {
        ele(rr, 4).style.color = TBGCOLOR;
        ele(rr,4).value = '-1';
    }
}
cellonfocus += "if(cc==4)changecolor40()";
cellonblur  += "if(cc==4)changecolor41()";


function resizeta(td, dx, dy)
{
    if ( td.nodeName.toLowerCase()== 'textarea')
    {
        td.style.width = (td.offsetWidth + dx) + 'px';
        return;
    }
    var i = td.childNodes.length;
    if (i == 0) return;
    for (i--; i>=0; i--)
    resizeta(td.childNodes[i], dx, dy);
}

function whitethem()
{
    for (var i=0; i < numRows; i++)
    {    
       var y =  parseFloat('' + retrv(i,5));
       var e = ele(i,5);
    
       if (y == -1 || y == -2)
           e.style.color = TBGCOLOR;
       else
           e.style.color = 'red';
        
    } 
      
}

 

function changedformula(txt)
{
    uniformula[retrv(largeZ, 0) + '_' + retrv(largeZ, 1)] = txt.value;
    formula = txt.value;
}
 
if (onbegin.replace(/ /i, '') == '')
{
    onbegin = ";adjustphotowidth();whitethem();";
}
else
{
    onbegin += ";adjustphotowidth();whitethem();";
}
//0 course, Assigntest, StudentId, Student, 
//4. Photo, Score, content, Attachment, DelayDay, 
//9. Comment, Format, Type, Assess, 
//13 AsAssess, question, answer, Attachat, Sessionname
function toclass(k)
{
     
    var tid = testsheet.atd[k][0];
    var v = document.getElementById('txt'+k).value;
    //for (var kk=0; kk < 2; kk++)
    for (var n = 0; n < numRows; n++)
 {
    if (n == counter || mat[n][1] != mat[counter][1] || mat[n][0]!=mat[counter][0] || mat[n][20]!=mat[counter][20]) continue;
    var tt;
    tt = (new CSVParse(retrv(n,13), "|", ",", ";")).nextMatrix(true);
    
    var i=0;
    if (tt!=null && tt.length>0)
    for (i=0; i < tt.length; i++)
    {
       if ( tt[i][0] == tid)
       {
          if (tt[i][3].indexOf(v)<0) 
          {  
              if (tt[i][3] =='')
                  tt[i][3] = v;
              else
                  tt[i][3] += "\n" + v;
          }
          break;
       }
    }
    if (i == tt.length)
    {
        if (tt.length == 0)
        {
            tt = new Array();
            tt[0] = [tid,'1','0',v];
        }
        else if (tt.length == 1 && tt[0].length!=4)
        {
            tt[1] = tt[0];
            tt[0] = [tid,'1','0',v];
        }
        else if (tt.length == 1 && tt[0].length==4)
        {
            tt[1] = [tid,'1','0',v];
        }
        else
        {
            tt[i] = tt[i-1];
            tt[i-1] = [tid,'1','0',v];
        }
    }
    var str = "";
    for (var i=0; i < tt.length; i++)
    {
       for (var j=0; j < tt[i].length; j++)
       {
          if (tt[i][j]==null || tt[i][j]=='') 
          {
               
          }
          else if (tt[i][j].indexOf(',')>=0 || tt[i][j].indexOf(';') >=0 || tt[i][j].indexOf('|') >=0)
          {
             str += "|" + tt[i][j].replace(/\|/g, '||') + "|";
          }
          else 
          {
              str += tt[i][j];
          }
          if (j < tt[i].length-1)
          {
             str += ",";
          }
          else if ( i < tt.length-1)
          {
            str += ";"; 
          }
       }

    }
    setv(n,13,str);
    valuechanged[n] = true;
 }
    
}

 
var synscore1 = function ()
{
    var e = document.getElementById('copyscore');
    if (e!=null) e.value = retrv(freeformat.n, freeformat.scoreindex);
}
function displaytxt(ta,evt,j){}

