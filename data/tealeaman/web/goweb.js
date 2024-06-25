/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/

function goweb()
{
    
   var txt = "";
   if (document.getSelection)
   { 
       var thealltextarea = document.getElementsByTagName("textarea");
       for (var i=0; i < thealltextarea.length; i++)
       {
           txt = thealltextarea[i].value.substring(thealltextarea[i].selectionStart,thealltextarea[i].selectionEnd);
           if (txt!='') break;
       }
   }
   if (navigator.appName == 'Microsoft Internet Explorer'&& document.selection) 
       txt = document.selection.createRange().text;
   
    
   if (txt == '') 
       myprompt(textmsg[115]);
   else
    {   
      if (txt.indexOf('http') < 0 && txt.indexOf('web/') != 0)
         txt = 'http://' + txt;
      window.open(txt, 'blank',
     'toolbar=1,location=1,directories=1,status=1,menubar=0,alwaysRaised=1,scrollbars=1,resizable=1,width= 700,height= 500');
   }
}
let allselectedsids;
function quickmessage()
{
    let markers = document.form1.checkbox;
    let sidcol = 0;
    if (typeof markers == 'undefined')
    {
        markers = new Array();
        for ( ; sidcol < numCols; sidcol++)
            if (ctype[sidcol].toLowerCase() == 'c')
                break;
        if (sidcol < numCols)
        for (let r = 0; r < numRows; r++)
            markers[r] = ele(r,sidcol);
    }
    else
    {
         for (;sidcol < numCols && (fields[sidcol].toLowerCase() != 'sid'
                           && fields[sidcol].toLowerCase() != 'studentid'); sidcol++);
    }
    if (sidcol == numCols) return;
    let sids = '';
    
    for (let r = 0; r < numRows; r++)
    {
        if (markers[r].checked)
        {
            sids += "," + mat[r][sidcol].replace(/>>.*$/,'');
        }
    }
    
    if (sids == '') 
   {
       myprompt(textmsg[247]);
       return;
   }
   allselectedsids = sids.substring(1);
   alertmessage();
}

function alertmessage()
{
    let str = '<table class=outset1 ><tr><td  style="white-space:nowrap">' + textmsg[1902] 
            + '</td><td><input id=subject class=left style="border:1px #808080 solid;border-radius:3px" value=alert></td></tr><tr><td valign=top  style="white-space:nowrap">'
            +textmsg[449]  + '</td><td><textarea id=msg rows=5 cols=40></textarea></td></tr><tr><td colspan=2 align=center>'
    + '<input class=GreenButton type=button style=width:' + (4.5*font_size) + 'px onclick=sendmsg() value="' +textmsg[223]+ '">'
    + '<input class=OrangeButton  type=button style=width:' + (4.5*font_size) + 'px onclick=cancelmsg() value="' +textmsg[18]+ '"></td></tr></table>';
    myprompt(str,null,null,textmsg[1903]);
}
function cancelmsg()
{
   closeprompt();
}
function sendmsg()
{
   let subject = document.getElementById('subject').value;
   let msg = document.getElementById('msg').value;
   let wcds = "u'" + subject + "','" + msg.replace(/'/g,"''") + "','0','" + subdb + "','','"
            + allselectedsids + "'";
   postopen('SaveBack',['rdap','subdb','securitytoken','wcds','orgnum','rsacode'],
   ['messagenew',subdb,'',wcds,orgnum,'0'],'w' + tstmp);
   closeprompt();
}
var ma2n = ",";
function maping(c)
{
   postopen('analyzedata.jsp', "thresh,cid,sessionname,semester,subdb".split(/,/),
   ["1",defaultRecord[0],defaultRecord[1],defaultRecord[2],subdb], 'w' + tstmp);
}
var grade2gpa = [];
function makemap()
{
    let sm = 0;
    for (let j=0; j < numRows; j++)
    {
        let s1 = grade2gpa[mat[j][3]];
        if (s1 == null)
        {
            myprompt(mat[j][0] + ' has not grade');
        }
        else
            sm +=  (s1);
    }
    let v = (sm/numRows).toFixed(2);
    let cel = document.getElementById("maintable").rows[numRows+2].cells[4];
    //cel.innerHTML = cel.innerHTML.replace(/>.*$/,'') + '>' + v;
    cel.align='left';
    ele(numRows,3).style.textAlign = 'left';
    setv(numRows,3, v);
}
function regress()
{
    let str = '<form rel=opener name=f4  ><table><tr><td colspan=2 align=center> x </td><td rowspan=' + 
            (numCols) + ' width=60> </td><td  colspan=2 align=center> y </td></tr>';
    for (let r=3; r < numCols; r++)
    {
        if (param[4] == null) param[4] = 6;
        if (param[5] == null) param[5] = 4;
        str += "<tr><td><input type=radio name=x value="+ r +" " + (r==param[4]?'checked':'') + " onclick=maping(this)></td><td>" + labels[r] + "</td>"
            + "<td><input  type=radio name=y value="+ r +" " + (r==param[5]?'checked':'') +"  onclick=maping(this)></td><td>" + labels[r] + "</td></tr>"
    }
    str += "<tr><td colspan=5 align=center>";
    str += "<input type=button class=GreenButton onclick=makeregress() style=width:" + (4.5*font_size) + "px value=\"" + textmsg[1907]+ "\">";
    str += "<input type=button class=GreenButton onclick=makeplot() style=width:" + (4.5*font_size) + "px value=\"" + textmsg[1909].split(/@/)[4]+ "\">";
    str += "</td></tr></table></form>";
    myprompt(str,null,null,textmsg[1907]);
}
function extremal(x)
{
    let min = x[0],max=x[0];
    for(let i=1; i < x.length; i++)
        if (x[i] < min)
            min = x[i];
        else if (x[i] > max)
            max = x[i];
    return [min,max];
}
function makeplot(W,H)
{
    if (W == null)
    {
        if (param[1]!=null)
        {
            W = param[1];
            H = param[2];
        }
        else
        {
            W = 800;
            H = 560;
        }
    }
    param[1] = W;
    param[2] = H;
    let xi,yi;
    if (typeof(document.f4) == 'undefined')
    {
        xi = param[4];
        yi = param[5];
    }
    else
    {
        xi = parseInt(document.f4.x.value);
        yi = parseInt(document.f4.y.value);
        param[4] = xi;
        param[5] = yi;
    }
    let x = new Array(numRows), y = new Array(numRows),z = new Array(numRows);
    for (let r = 0; r < numRows; r++)
    {
        if (xi == 3)
            x[r] = (grade2gpa[mat[r][xi]]);
        else 
            x[r] = parseFloat(mat[r][xi]);
        if (yi == 3)
            y[r] = (grade2gpa[mat[r][yi]]);
        else 
            y[r] = parseFloat(mat[r][yi]);
        z[r] = [x[r],y[r]];
    }
    let mx = extremal(x); 
    let my= extremal(y); 
    z.sort(function(a,b){return a[0]-b[0];});
    myprompt("<center><span style=font-size:20px;font-weight:700;float:center;><em>y = f</em>(<em>x</em>)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<em>x</em> : " + labels[xi] + timeunit(xi) + ", <em>y</em> : "+  labels[yi] +timeunit(yi) + "</span> </center><br><canvas  id=\"testCanvas\" width="+ W +" height="+ H +"></canvas>",null,null,textmsg[1909].split(/@/)[4]);
    promptwin.style.left = "0px";
    let canvas = document.getElementById( "testCanvas" );  
    let context = canvas.getContext( "2d" );
    let wdx = bestwidth(x);
    let wdy = bestwidth(y);
    mx[0] = Math.floor(mx[0]/wdx)*wdx;
    mx[1] = Math.ceil(mx[1]/wdx)*wdx;
    my[0] = Math.floor(my[0]/wdy)*wdy;
    my[1] = Math.ceil(my[1]/wdy)*wdy;
    let gap = 30;
    W -= gap;
    H -= gap;
    for (let r = 0; r < numRows; r++)
    {
        x[r] =  (z[r][0]-mx[0])/(mx[1] - mx[0])*W;
        y[r] =  (z[r][1]-my[0])/(my[1] - my[0])*H;
    }
    let i;
    for(i=0; i <= Math.ceil((mx[1]-mx[0])/wdx); i++)
    {
        context.fillText((parseInt(''+mx[0])+i*wdx), gap + i*wdx*W/(mx[1]-mx[0]), H+gap*3/5);
    }
    context.fillText('x',  (i-1)*wdx*W/(mx[1]-mx[0])-5, H-5);
    for(i=0; i <= Math.ceil((my[1]-my[0])/wdy); i++)
    {
        context.fillText((parseInt(''+my[0])+i*wdy), 0, H - (i*wdy*H/(my[1]-my[0])));
    }
    context.fillText('y', gap+2, 5);
    context.beginPath(); 
    context.strokeStyle = "black";
    context.moveTo(gap, H);
    context.lineTo(W,H);
    context.stroke();
    
    context.beginPath(); 
    context.strokeStyle = "black";
    context.moveTo(gap, H);
    context.lineTo(gap,0);
    context.stroke();
    
    context.beginPath();   
    context.lineJoin = "round";  
    context.strokeStyle = "red";   
    context.moveTo(gap + x[0], H-y[0]);   
    for(i = 1; i < x.length; i++ )
    {  
        context.lineTo(x[i]+gap, H-y[i]);  
    }   
    context.stroke();
     new ResizeRounded(promptwin, function(td,dx,dy){
        let canvas = document.getElementById( "testCanvas" );
        canvas.parentNode.removeChild(canvas);
        let W = param[1] + dx;
        let H = param[2] + dy;
        makeplot(W,H);
    });
}
function timeunit(xi)
{
    if(xi == 6) return '(' + textmsg[1694].split(/@/)[1] + ')';
    return '';
}
let previousW=null,previousH;
let interpret = null;
function makeregress(W,H)
{
    if (W == null)
    {
        if (param[1]!=null)
        {
            W = param[1];
            H = param[2];
        }
        else
        {
            W = 800;
            H = 560;
        }
    }
    param[1] = W;
    param[2] = H;
    let xi,yi;
    if (typeof(document.f4) == 'undefined')
    {
        xi = param[4];
        yi = param[5];
    }
    else
    {
        xi = parseInt(document.f4.x.value);
        yi = parseInt(document.f4.y.value);
        param[4] = xi;
        param[5] = yi;
    }
     
    let x = new Array(numRows), y = new Array(numRows),z = new Array(numRows);
    for (let r = 0; r < numRows; r++)
    {
        if (xi == 3)
            x[r] = (grade2gpa[mat[r][xi]]);
        else 
            x[r] = parseFloat(mat[r][xi]);
        if (yi == 3)
            y[r] = (grade2gpa[mat[r][yi]]);
        else 
            y[r] = parseFloat(mat[r][yi]);
        z[r] = [x[r],y[r]];
    }
    let mx = extremal(x);
    let my= extremal(y);
    let wdx = bestwidth(x);
    let wdy = bestwidth(y);
    mx[0] = Math.floor(mx[0]/wdx)*wdx;
    mx[1] = Math.ceil(mx[1]/wdx)*wdx;
    my[0] = Math.floor(my[0]/wdy)*wdy;
    my[1] = Math.ceil(my[1]/wdy)*wdy;
    let gap = 30;
    W -= gap;
    H -= gap;
    
    let sumx = 0, sumy = 0;
    for (let i = 0; i < numRows; i++)
    {
        sumx += x[i];
        sumy += y[i];
    }
    let xbar = sumx/numRows;
    let ybar = sumy/numRows;
    let n =0, d = 0;
    for (let j = 0; j < x.length; j++)
    {
        n+= (x[j] - xbar)*(y[j] - ybar);
        d+= (x[j] - xbar)*(x[j] - xbar);
    }
    if (d == 0)
    {
        myprompt("constant x");
        return;
    }
    let beta = n/d;
    let alpha = ybar - beta*xbar;
    if (Math.abs(beta) > 1 )
    interpret = textmsg[1917].replace(/@/, labels[xi].replace(/([a-z])([A-Z])/g, "$1&nbsp;$2"))
       .replace(/@/, "1")
       .replace(/@/, labels[yi].replace(/([a-z])([A-Z])/g, "$1&nbsp;$2"))
       .replace(/@/, beta.toFixed(1));
    else if (beta == 0)
        interpret = "";
    else
        interpret = textmsg[1917].replace(/@/, labels[xi].replace(/([a-z])([A-Z])/g, "$1&nbsp;$2"))
       .replace(/@/, (1/beta).toFixed(1))
       .replace(/@/, labels[yi].replace(/([a-z])([A-Z])/g, "$1&nbsp;$2"))
       .replace(/@/, "1");    
    for (let i = 0; i < numRows; i++)
    {
        x[i] = (x[i]-mx[0])/(mx[1]-mx[0])*W;
        y[i] = (y[i]-my[0])/(my[1]-my[0])*H;
    }
    let x0 = mx[0]; 
    let y0 = alpha + beta*x0;
    let x1 = mx[1]; 
    let y1 = alpha + beta*x1;
    x0 = 0;
    x1 = W;
    y0 = (y0-my[0])/(my[1]-my[0])*H;
    y1 = (y1-my[0])/(my[1]-my[0])*H;
    
    let i;
    myprompt("<center><span id=regeq style=font-size:20px;font-weight:700><em>y</em> = "+ alpha.toFixed(2) + (beta>=0?" + ":" ") + beta.toFixed(4) + "<em>x</em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<em>x</em> : " + labels[xi] + timeunit(xi)+ ", <em>y</em> : "+  labels[yi] +timeunit(yi)+  "</span><img height=26 src=image/arrow.jpg style=\"margin:0px 0px 0px 0px;border:0px;float:right\" onclick=\"insertthis('regeq');closeprompt()\"></center><br><canvas  id=\"tCanvas\" width="+ (W+gap) +" height="+ (H+gap) +"></canvas>",null,null,textmsg[1907]);
    promptwin.style.left = "0px";
    let canvas = document.getElementById( "tCanvas" );  
    let context = canvas.getContext( "2d" );
    for(i=0; i <= Math.ceil((mx[1]-mx[0])/wdx); i++)
    {
        context.fillText((parseInt(''+mx[0])+i*wdx), gap + i*wdx*W/(mx[1]-mx[0]), H+gap*3/5);
    }
    context.fillText('x',  (i-1)*wdx*W/(mx[1]-mx[0])-5, H-5);
    for(i=0; i <= Math.ceil((my[1]-my[0])/wdy); i++)
    {
        context.fillText((parseInt(''+my[0])+i*wdy), 0, H - (i*wdy*H/(my[1]-my[0])));
    }
    context.fillText('y', gap+2, 5);
    context.beginPath(); 
    context.strokeStyle = "black";
    context.moveTo(gap, H);
    context.lineTo(W,H);
    context.stroke();
    
    context.beginPath(); 
    context.strokeStyle = "black";
    context.moveTo(gap, H);
    context.lineTo(gap,0);
    context.stroke();
    
    
     
    context.strokeStyle = "red";   
    context.fillStyle = "#FF0000"; 
    for(i = 0; i < x.length; i++ )
    {  
        context.fillRect(gap + x[i], H-y[i], 2, 2);  
    }
    context.strokeStyle = "green";  
    context.beginPath();
    context.moveTo(x0+gap, H - y0); 
    context.lineTo(x1+gap, H - y1); 
    context.stroke();
    context.beginPath();   
    context.lineJoin = "round"; 
    new ResizeRounded(promptwin, function(td,dx,dy){
        let canvas = document.getElementById( "tCanvas" );
        canvas.parentNode.removeChild(canvas);
        let W = param[1] + dx;
        let H = param[2] + dy;
        makeregress(W,H);
    });
}
function fillexp(t)
{
    let e = n2exp[t.value];
    if (e!=null)
    {
        e = e.replace(/labels\[0\]/,labels[0]).replace(/labels\[1\]/,labels[1])
        .replace(/labels\[2\]/,labels[2]).replace(/labels\[3\]/,labels[3])
        .replace(/labels\[4\]/,labels[4]).replace(/labels\[5\]/,labels[5])
        .replace(/labels\[6\]/,labels[6]).replace(/labels\[7\]/,labels[7])
        .replace(/labels\[8\]/,labels[8]).replace(/labels\[9\]/,labels[9])
        .replace(/textmsg\[1916\]/,textmsg[1916]);
        document.getElementById('boolean').value = e;
    }
}
var n2exp = null;
function saven2ex(t)
{
    let v = t.value;
    for (let j = 0; j < numCols; j++)
       v = v.replace(labels[c], "labels[" + c + "]");
    v = v.replace(textmsg[1916], "textmsg[1916]");
    n2exp[document.getElementById('fname').value] = v; 
    localStorage['findings'] = JSON.stringify(n2exp);
}
function criteria()
{
    let name2exp = localStorage['findings'];
    let aa = textmsg[1909].split(/@/); 
    if (name2exp !=null)
    {
       n2exp = JSON.parse(name2exp);
    }
    else
    {
       n2exp = [];
       n2exp[aa[2]] = labels[7] +"="+ labels[8];
       n2exp[aa[3]] = labels[6]+" > 3*" + textmsg[1916] + "/2"; 
    }
    let half = ~~((numCols)/2);
    
    let str =  "<table><tr><td style=white-space:nowrap>" + aa[7] + "<datalist id=nmlist>";
    for (let nm in n2exp)
       str += "<option value=\"" + nm + "\">" + nm + "</option>";
    str += "</datalist>";
    str += "</td><td><input class=left  style=\"width:360px;border:1px #666666 solid;border-radius:3px\" id=fname list=nmlist value=\"" + aa[2] + "\" onchange=fillexp(this)></td></tr><tr>";
    str += "<td valign=top  style=white-space:nowrap>" + aa[5] + "</td><td><textarea onchange=saven2ex(this) onfocus=\"javascript:this.style.color='#000000';\" rows=3 style=width:360px id=boolean>"+ labels[7] + "=" + labels[8] + "</textarea></td></tr></table>";
    str += aa[6] + ":<table border=0  width=100% style=border-collapse:collapse;border-radius:4pxborder-width:0px class=outset1><tr>";
    let i = 0;
    for (; i < half; i++)
        str += "<td  style=white-space:nowrap>"+ labels[i] + "</td>";
    
    str +="</tr><tr>";
    for (; i < numCols-1; i++)
        str += "<td  style=white-space:nowrap>"+ labels[i] + "</td>";
    if ((numCols-1)%2 == 1) str += "<td>" + textmsg[1916] + "</td>";
    str += "</tr></table><table width=100% border=1 style=\"margin:6px 0px 6px 0px;border-collapse:collapse;border-radius:4px\" class=outset1>";
    //Enter a boolean expression as filter criteria@Possibly imply@Copy homework@Work hard@Plot   
    str += "<tr><td colspan=" + (~~(half/2))  + ">" + aa[0] + "</td><td  colspan=" +(half - (~~(half/2)))  + ">" + aa[1]  + "</td></tr>"; 
    str += "<tr style=background-color:"+ TBGCOLOR + "><td colspan=" + (~~(half/2)) + " class=left >"+ labels[7] + "=" + labels[8] + "</td><td  class=left  colspan=" +(half - (~~(half/2)))  + ">" + aa[2]  + "</td></tr>"; 
    str += "<tr style=background-color:"+ TBGCOLOR + "><td colspan=" + (~~(half/2))  + " class=left >" + labels[6]  + " > 3*" + textmsg[1916] + "/2 </td><td  class=left  colspan=" +(half - (~~(half/2)))  + ">" + aa[3]  + "</td></tr></table>"; 
    str += "<center><input type=button class=OrangeButton style=width:" + (4.5*font_size) + "px value=\"" + textmsg[1561] + "\" onclick=tofind()></center>";
    myprompt(str, null,null,textmsg[1908]);
}
function tofind()
{
   let str = document.getElementById('boolean');
   let markers = document.form1.checkbox;
   let sm = 0;
   let tbl = document.getElementById('maintable');
    
   for (let r=0; r < numRows; r++)
   {
       let e = str.value;
       for (let c=0; c < numCols; c++)
       {
           if (e.indexOf(labels[c])>=0)
           {
               let vl = retrv(numRows,c);
               e = e.replace(textmsg[1916],vl);
               e = e.replace(labels[c], mat[r][c]);
           }
       }
       e = e.replace(/=([^<|>])/g,'==$1');
       e = e.replace(/([^a-z])and([^a-z])/ig,'$1 && $2');
       e = e.replace(/([^a-z])or([^a-z])/ig,'$1 || $2');
       
       try
       {
           let v = eval(e);
           if (v) sm++;
           markers[r].checked = v;
           valuechanged[r] = false;
       }catch(e1){document.getElementById('boolean').style.color = 'red';}
       
   }
   let cel = tbl.rows[numRows+2].cells[0];
   cel.innerHTML = cel.innerHTML.replace(/>.*$/, '>'+sm);
   cel.align = 'center';
}
function distribute(W,H)
{
    if (W==null) 
    {
        W = 800;
        H = 560;
        param[0] = null;
    }
    param[1] = W;
    param[2] = H;
    let tbl = document.getElementById('maintable');
    let str = '<center><table align=center style=display:inline><tr><td>' + textmsg[128] +'<td><select  id=whichfield  onchange=\"savedcolors=null;drawhis(this.selectedIndex,' + W + "," + H +")\"><option value=2>" + textmsg[1600] + '</option>';
    
    for (let r=1; r < numCols; r++)
        str += "<option value="+ r + "    >" + labels[r].replace(/([a-z])([A-Z])/g, "$1&nbsp;$2") + "</option>"
    str += "</select><td width=60 align=left id=minu>" + timeunit(6) + "</td><td  style=white-space:nowrap id=drawwidthlabel>" + textmsg[733] + "</td><td><input id=drawwidth style=\"border:1px #888888 solid;border-radius:3px\" onchange=\"savedcolors=null;redraw(this)\" size=3></td>";
    str += "<td style=color:blue>&#8635;</td></tr></table><img  id=insertimg height=26 src=image/arrow.jpg style=\"margin:0px 0px 0px 0px;border:0px;float:right\"  onclick=insertthis()><center>";
    str += "<div id=histo style=display:block;width:" + W + "px;height:"+ H + "px></div>";
    myprompt(str,null,null,textmsg[1898]);
    promptwin.style.left = "0px";
    if (param[0]!=null)
    {
        document.getElementById('whichfield').selectedIndex = param[0];
        drawhis(param[0],W,H,param[3]);
    }
    new ResizeRounded(promptwin, function(td,dx,dy)
    {
        let W = param[1] + dx;
        let H = param[2] + dy;
        let t = document.getElementById('histo');
        t.innerHTML = '';
        distribute(W,H);
    });
   
}
function redraw(t)
{
   if (isNaN(t.value)) 
   {
       t.value = param[3];
   }
   else
   {
       savedcolors=null;
       drawhis(param[0],param[1],param[2],parseInt(t.value));
   }
}
var param = new Array();
function bestwidth(x)
{
    let m = extremal(x);
    let l = ~~((m[1]-m[0])/10);
    let z=[2,5,10,20,50,100,150,200,500,1000];
    let mm = 0, mi=1000;
    for (let j=0; j < z.length; j++)
    {
       let w = (Math.abs(z[j] - l)/l);
       if (w <mi){mi = w;mm=j}
    }
    let wd = z[mm];
    if ((m[1]-m[0])/wd < 5 && mm>0) 
    {
        wd = z[mm-1];
    }
    if ((m[1]-m[0])/wd < 5) 
    {
           wd = 2;
    }
    return wd;
}
let savedcolors = null;
function drawhis(cl,w,h,wd)
{
    if (cl < 1) return;
    let useold = (savedcolors != null);
    if (!useold)savedcolors = new Array();
    param[0] = cl;
    if (ctype[cl] !='N' && ctype[cl] !='n')
    {
        document.getElementById('drawwidth').style.visibility = 'hidden';
        document.getElementById('drawwidthlabel').style.visibility = 'hidden';
        document.getElementById('minu').style.visibility = 'hidden';
        let mp = [];
        let mh = 0;
        for (let r = 0; r < numRows; r++)
        {
            let y = mp[mat[r][cl]];
            if (y == null) 
                mp[mat[r][cl]] = 1;
            else
            {    
                mp[mat[r][cl]] = 1+y;
                if (1+y > mh) mh = y+1;
            }
        }
        let a = ""; let mx = 0;
        for (let y in mp)
        {
            a += ',' + y;
            if (mp[y] > mx) mx = mp[y];
        }
        
        let as = a.substring(1).split(/,/);
        if (as.length*30 > w) w = as.length*30;
        as.sort();
        
        let str = "<table cellspacing=0 cellpadding=0 align=center style=\"margin:10px 0px 0px 15px\"><tr><tr><td align=bottom width=20><table  cellpadding=0 cellspacing=0><tr height=" + ((mh%5)*h/mh) + "><td> </td></tr>";
        let jj = ~~(mh/5);
        while(jj>0)
        {
        str += "<tr height=" + (5*(h-50)/mh) + "><td valign=top>"+ (jj*5) + "</td></tr>";
        jj--;
        }
        str +="</table></td>";
        
        for (let k=0; k < as.length; k++)
        {
            let n = mp[as[k]]; if (n==null) n = 0;
            let per = '';
            
            let cl = '';
            if (!useold)
            {
                cl = 'rgb('+ Math.floor(Math.random() * 200) 
                    + "," + Math.floor(Math.random() * 200) + ","
                    + Math.floor(Math.random() * 200) + ")";
                savedcolors[k] = cl;
            }
            else
            {
                cl = savedcolors[k];
            }
            let h1 = Math.floor((h-50)/mx*n);
            let w1 = Math.floor((w-20)/as.length-3);
            if (n>0) per = (n*100/numRows).toFixed(0) + '%';else per = '';
            str += "<td valign=bottom width=" + w1 + "><div style=\"margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;float:center;text-align:center;color:red\">" + per + "</div><div style=\"margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;width:" 
            + w1 + 'px;height:' 
            + h1 + 'px;background-color:'+ cl + ";color:#ffffff;text-align:left;float:left\" ><img height=" + h1 +" width=1 style=\"height:"+ h1 + "px;width:1px;border:0px;margin:0px 0px 0px 0px;display:inline;float:left\" scr=web/blank1.gif></div></td>"
        }
        str += "</tr><tr><td></td>";
        for (let k=0; k < as.length; k++)
            str += "<td align=center style=font-size:20px;color:red>" + (as[k].length>4?as[k].substring(0,4):as[k]) + "</td>";
        str += "</tr></table>";
        document.getElementById('histo').innerHTML = str;
        return;
    }
    
    let x = new Array(numRows);
    document.getElementById('drawwidth').value = wd;
    document.getElementById('drawwidth').style.visibility = 'visible';
    document.getElementById('drawwidthlabel').style.visibility = 'visible';
    document.getElementById('minu').style.visibility = cl==6?'visible':'hidden';
    for (let r = 0; r < numRows; r++)
    {
        x[r] = parseFloat(mat[r][cl]);
    }
    let m = extremal(x);
    if (wd == null)
    {
        wd = bestwidth(x);
        
        document.getElementById('drawwidth').value = '' + wd;
    }
    param = [cl, w, h, wd];
    let fre = new Array();
    let ra = new Array();
    let mh =1;
    for (let r = 0; r < numRows; r++)
    {
        let wh = ~~(x[r]/wd);
        ra[r] = wh;
        if (fre[wh] == null)
            fre[wh] = 1;
        else
        {   
            fre[wh] = fre[wh] + 1;
            if (fre[wh] > mh) mh = fre[wh];
        }
    }
    let mq = extremal(ra);
    let a = mq[0];
    let b = mq[1];
    let str = "<table cellspacing=0 cellpadding=0 align=center style=\"margin:10px 0px 0px 15px\"><tr><td align=bottom width=20><table cellspacing=0><tr height=" + ((mh%5)*h/mh) + "><td> </td></tr>";
    let jj = ~~(mh/5);
    while(jj>0)
    {
        str += "<tr height=" + (5*(h-50)/mh) + "><td valign=top>"+ (jj*5) + "</td></tr>";
        jj--;
    }
    str +="</table></td>";
    let adjust = 1; if ((m[1]-m[0])/wd < 10) adjust  = 14 -(~~((m[1]-m[0])/wd));
    
    for (let k=a; k <= b; k++)
    {
        let n = fre[k]; if (n == null) n = 0;
        let per = '';
        let cl = '';
            if (!useold)
            {
                cl = 'rgb('+ Math.floor(Math.random() * 200) 
                    + "," + Math.floor(Math.random() * 200) + ","
                    + Math.floor(Math.random() * 200) + ")";
                savedcolors[k] = cl;
            }
            else
            {
                cl = savedcolors[k];
            }
            let w1 = Math.floor((w-20)/(b-a+1)-adjust);
            let h1 = Math.floor((h-50)/mh*n);
            if (n>0)per = (n*100/numRows).toFixed(0) + '%';else per = '';
        str += "<td valign=bottom width=" + w1 + "><div style=\"margin:0px 0px 0px 0px;color:red;padding:0px;float:center;text-align:center\">" + per + "</div><div style=\"margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;width:" 
                + w1 + 'px;height:' 
        + h1 + 'px;background-color:'+ cl + ";color:#ffffff;text-align:left\" ><img height=" + h1 +" width=1 style=\"height:"+ h1 + "px;width:1px;border:0px;margin:0px 0px 0px 0px;display:inline;float:left\" scr=web/blank1.gif></div></td>"
    }
    str += "</tr><tr height=40><td style=height:20px;color:red  valign=top align=right>" + (a*wd) + "</td>";
    if (w/(b-a+1) > 50)
    {
        for (let k=a; k <= b; k++)
        {
            str += "<td style=\"width:" + Math.floor(w/(b-a+1)-adjust) + "px;height:20px;color:red\" align=right valign=top>"+ (k*wd+wd) +"</td>";
        }
    }
    else
    {
        let k = a;
        for (k=a; k <= b; k+=2)
        {
            str += "<td style=\"width:" + Math.floor(2*w/(b-a+1)-2*adjust) + "px;height:20px;color:red\" align=right colspan=2 valign=top>"+ ((k+2)*wd) +"</td>";
        }
        if (k == b+1)
            str += "<td></td>";
    }
    str += "</tr></table>";
    document.getElementById('histo').innerHTML = str;
}

if (typeof(rdapname)!='undefined' && rdapname=='correlation')
{
    viewonly = false;
}
var visualgraph = new Array();
function insertthis(id)
{
    let dv = document.createElement('div');
    dv.id = 'reg' + visualgraph.length;
    dv.style.cssText = 'margin-top:10px;margin-right:0px;margin-bottom:10px;text-align:center;float:center;';
    dv.style.float = 'center';
    if (id != null)
    {
        let x = document.getElementById(id);
        dv.innerHTML = '<table align=center><tr><td align=left>'+x.innerHTML + "</td></tr><tr><td  align=left>" + interpret +'</td></tr></table>';
        visualgraph[visualgraph.length] = dv.outerHTML;
    }
    else
    {
        let x = document.getElementById('whichfield');
        if (x!=null)
        {
        let y = document.getElementById('histo');
        dv.innerHTML = '<span style=font-size:20px;float:center;text-align:center>' + x.options[x.selectedIndex].text + '</span><br>' + y.innerHTML;
        visualgraph[visualgraph.length] = dv.outerHTML;
        }
    }
    let cr = document.getElementById('copyrights');
    cr.parentNode.insertBefore(dv,cr);
}

if (typeof(rdapname)!='undefined' && rdapname == 'correlation') 
{
    for (let rr=0; rr < numRows; rr++) 
        for (let cc=4; cc < 10; cc++)
            if (mat[rr][cc]==null || isNaN(mat[rr][cc]))
                mat[rr][cc] = "0";
}
function searchfield(fn)
{
    for (let fm of document.forms)
    {
        for (let ff of fm.elements)
            if (ff.name == fn)
        {
            if (ff.tagName.toLowerCase() =='select')
            {
                return ff.options[ff.selectedIndex].value;
            }
            else
            {   return ff.value;}
        }
         
    }
    return null;
}
var questionnumber = null;
var content_a= null;
var gradingprogrammingurl = null;
var codesgrading = '';
function sendjava(content1_a )
{
    codesgrading  = content1_a.value;
    var r0 =  new RegExp(/^[0-9]+[\.| |\)|\]]/);
    var r =  new RegExp(/\n[0-9]+[\.| |\)|\]]/);
    if (r0.exec(codesgrading)!=null || r.exec(codesgrading)!=null)
    {
        var zs = [];
        var ss = ("\n" + codesgrading.replace(/^[\n|\s]+/,'')).split(/(?=\n[0-9]+[\.| |\)|\]])/);
        var ns = '';
        for (let x of ss)
        {
            var y = x.replace(/\n/g,'').replace(/[\.| |\)|\]].*$/,'');
            ns += ',' + y ;
            var z = x.replace(/\n[0-9]+/,'').replace(/[\.| |\)|\]]+/,'');
            zs[y] = z;
        }
        var j = 1;
        while (true){
           j = prompt('There seem  multiple programs: ' + ns.substring(1) + ". Which one do you want to test?");
           if (j==null) return; j = j.replace(/ /g,'');
           if (!isNaN(j) && (ns+',').includes("," + j + ",")) break;
        }
        codesgrading  = zs[j];  
    }    
    if (codesgrading.includes('public class') || codesgrading.includes('void main'))
            gradingprogrammingurl = 'gradejava.jsp';
    else if (codesgrading.includes('\tprint(') || codesgrading.includes('print('))
           gradingprogrammingurl = 'gradepython.jsp';
      
           
    if (gradingprogrammingurl == 'gradejava.jsp')
    {
    if (typeof(syntaxerror) != 'undefined' && syntaxerror )
    {
        myprompt("There is a syntax error in the program. Please check codes and fixed the error");
        return;
    }
    let j = content1_a.value.indexOf("public class");
    if (j < 0) 
    {
        myprompt("There is no public class. Your program should have one and only pulic class");
    }
    j = content1_a.value.indexOf("public class",j);
    if (j > 0) 
    {
        myprompt("There are more than one main class. Your program should have one and only pulic class!!!");
    }
    content_a=content1_a;
    
    myprompt("In order for your program to work on the server, it must <ul><li>contain one and only one public class (can have multiple other classes)<li>work on your PC first(It surely will not work on server if it does not work locally)<li>not contain any infinite loop<br><li>not contain infinite recursive-call loops(same actuall parameters)<br><li>not contain file-writing statements (standard output only)<li>not construct reading-file objects except for new File(args[0])</ul>Are you sure?", null, "if(v)gradeprogram1()");
}
else  
    sendpython(content1_a );
}
function sendpython(content1_a )
{
    if (typeof(syntaxerror) != 'undefined' && syntaxerror )
    {
        myprompt("There is a syntax error in the program. Please check codes and fixed the error");
        return;
    }
    let j = content1_a.value.indexOf("print(");
    if (j < 0) 
    {
        myprompt("There is no print statement");
    }
    content_a=content1_a;
    gradingprogrammingurl = 'gradepython.jsp';
    myprompt("In order for your program to work on the server, it must <ul> work on your PC first(It surely will not work on server if it does not work locally)<li>not contain any infinite loop<br><li>not contain infinite recursive-call loops(same actuall parameters)<br><li>not contain file-writing statements (standard output only)<li>not construct reading-file objects except for new argv[0]</ul>Are you sure?", null, "if(v)gradeprogram1()");
}
var nocompile = [];
function gradeprogram1()
{
    
    let fd = new FormData();
    fd.append("content", codesgrading);
    
    var coursestr = null;
    if (typeof(courseid) != 'undefined') coursestr = courseid;
    if (coursestr == null && typeof(course)!='undefined') coursestr = course;
    if (coursestr ==  null) coursestr = searchfield('courseid');
    if (coursestr ==  null) coursestr = searchfield('course');
    if (coursestr!=null)
    {
        fd.append("course", coursestr);
    }
    var assign = null;
    if (typeof(assignname) != 'undefined') assign = assignname;
    if (assign == null) assign = searchfield('assignname');
    if (assign == null) assign = searchfield('Name');
     if (assign!=null)
    {
        fd.append("assignname", assign);
      
    }
   
    var questionnum = content_a.name;//
    if (questionnum!=null) questionnum = questionnum.replace(/^[^0-9]+/,'');
     
    if (questionnum!=null && questionnum!='')
    {
        fd.append("questionnum",questionnum);
    }
    else 
    {
        questionnum = null;
    }
    
    let subdb1 = null;
    if (typeof(subdb) != 'undefined') 
        subdb1 = subdb;
    if (subdb1 == null)   subdb1 = searchfield('subdb');
    if (subdb1 == null && typeof(iid)!='undefined')
        subdb1 = iid;
    if (subdb1!=null)
    {
       fd.append("subdb",subdb1);
    }
     
        if ( localStorage["Compile" + coursestr + "_" + assign+ '_' + questionnum ]!=null)
        {
            nocompile[coursestr + '_' + assign+ '_' + questionnum]=localStorage["Compile" + coursestr + "_" + assign+ '_' + questionnum ];
        }
        if (nocompile[coursestr + '_' + assign + '_' + questionnum  ]!=null && nocompile[coursestr + '_' + assign+ '_' + questionnum] == '2') 
        {
            if (typeof(document.form1)!='undefined' && typeof(document.form1.sid)!='undefined' && document.form1.sid.value!=subdb1){
            myprompt('Too many times');return;}
        }
        else if (nocompile[coursestr + '_' + assign+ '_' + questionnum]==null)
        {
            nocompile[coursestr + '_' + assign+ '_' + questionnum] = '1';
        }
        else
        {
            nocompile[coursestr + '_' + assign+ '_' + questionnum] = '2';
        }
        localStorage["Compile" + coursestr + "_" + assign+ '_' + questionnum ] = nocompile[coursestr + '_' + assign+ '_' + questionnum];
   
     
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
            var y = xmlhttp.responseText.replace(/^[ |\n|\r|\t]+/,'').replace(/[ |\n|\r|\t]+$/,''); 
            
            closeprompt();
            if (questionnum!=null && typeof(runresult) !='undefined')
            {
                
                var jj = parseInt(''+questionnum);
                
                runresult[jj] = y;
                if (y.indexOf('Error: ')==0)
                {
                    myprompt('<pre style=font-family:courier>' +y +'</pre>',null,null,"Exec " + questionnum);
                }
                else
                    myprompt( ''+ (y.replace(/[^\n]/g,'').length+1) +' lines of results',null,null,"Exec " + questionnum); 
            }
            else
            {
                myprompt('<pre style=font-family:courier>' +y +'</pre>',null,null,"Exec ");
            }
        }
    };
    let xx = new URLSearchParams(fd).toString();
   
    let xy = findPositionnoScrolling(content_a);
    let left = xy[0] + 100;
    let top = xy[1];
    myprompt('<img id=progress src=image/progress.gif>',null,null,'.....'); 
    promptwin.style.cssText = '';
    promptwin.className = 'rundisk';
    promptwin.style.left = left + 'px';
    promptwin.style.top = top + 'px';
    xmlhttp.open('POST', gradingprogrammingurl, true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send(xx); 
    
   
     
}





