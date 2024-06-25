let rnn = [];
let KC = 4;
let KP = 5;
if (typeof subdb === 'undefined')
    subdb = document.form1.subdb.value;
let alldistincts = [];
let code0 = ('00000' + Math.floor(Math.random() * 1000000)).replace(/^.*([0-9]{6})$/,'$1');
if (typeof(code) === 'undefined')
    var code = null; 
let shiftPressed;
let pastminutes = 45;
let isaembedquiz = (typeof(document.form1.optionstr)!='undefined'); 
function makecontrols(optionstr)
{
    let labelcode = textmsg[1927].split(/@/);
    let llb = textmsg[1929].split(/@/);
    let code1 = '';
    let kk =optionstr.indexOf(';cd:');
    if (kk >= 0)
    {
        code1 = optionstr.substring(kk+4);
    }
    let ai = -1;
    let sels = ['','','',''];
    if (code1 == ''){ sels[0] = 'checked'; ai =0;}
    else if (code1 == 'distinct'){ sels[3] = 'checked';ai = 3;}
    else if (code1 == 'attendance'){ sels[1] ='checked';ai = 1;}
    else 
    {
        sels[2] = 'checked';ai =2;
    }
    var str = '';         
    str += "<input type=\"radio\" name=\"passcode\" value=0  " + sels[0] +"  onclick=setcode(0) >" + labelcode[0] +"<br>";
    str += "<input type=\"radio\" name=\"passcode\" value=1  " + sels[1] +"   onclick=setcode(1) >" + labelcode[1] +"<br>";
    str += "<input type=\"radio\" name=\"passcode\" value=2  " + sels[2] +"   onclick=setcode(2) >" + labelcode[2] +"<br>";
    str += "<input type=\"radio\" name=\"passcode\" value=3  " + sels[3] +"   onclick=setcode(3) ><nobr>" + labelcode[3] + "</nobr>";
    let s1 = '';
    let hints = ['','','','']; 
    if (isaembedquiz) 
        s1 = document.form1.sessionname.value;
    else 
    {   
        hints = textmsg[1930].split(/@/);
        s1 = retrv(0,5).replace(/,.*$/,''); 
    }
    str += "</td><td width=0% class=cellbg ><input type=button class=OrangeButton id=manageatt style=padding-top:3px;padding-bottom:2px;display:" + (code1 == 'attendance'?"inline":"none") + " onclick=manageattend('" +s1 + "') value=\"" + textmsg[1915] + "\" ><br>";
    str += '<input id=code name=cd   style="width:100px;font-size:30px;font-weight:700;display:' + (sels[2] == 'checked'?'inline':'none') + '" value="'  + (code==''||isNaN(code)?code0:code) + '" onchange="javascript:code=this.value"><br>';
    str += '<input class=OrangeButton type=button style=padding-top:3px;padding-bottom:2px;display:' + (sels[3] == 'checked'?'inline':'none') + ' id=passspan onclick=managecode() value="' + labelcode[4] + "\"></td><td class=cellbg valign=top align=left width=200px id=hintarea >" + hints[ai] +"</td>";
    return str;
}

function newmorecode()
{
    let n = parseInt(document.getElementById('numnew').value);
    if (''+n == 'NaN' || n < 0){n = 2;document.getElementById('numnew').value = '2';}
     
    let tb = document.getElementById('dcodes');
    if (tb == null) return;
    let N = alldistincts.length; 
    let i=0; 
    rnn = [];
    while (i < n)
    {
        let j = Math.floor(Math.random() * 1000000000);
        let k =0; for (; k < alldistincts.length; k++) 
            if (alldistincts[k] === j) break;
        if (k == alldistincts.length) {i++;alldistincts.push(j);rnn.push(j);}
    }
    
    rnn.sort();
    i = 0;
    let kk = tb.rows.length-1;
    let ki = kk * KC;
    
    for (let c = N % KC; c % KC!=0 && i < rnn.length;c++,i++)
    {
         tb.rows[kk].cells[3*c+1].innerHTML = ''+rnn[i];
    }
    
    while(i < rnn.length)
    {
        let rw = tb.insertRow(-1);
        for (let k = 0; k < KC; k++)
        {
            let cl = rw.insertCell(-1);
            cl.innerHTML = '<input type=checkbox  id=codecheck' + ki + ' onclick=setrange(' + ki + ')>';
            cl.borderLeftWidth = '2px';
            cl.align = 'center';
            cl = rw.insertCell(-1);
            cl.align = 'right';
            if (i < rnn.length){ cl.innerHTML = '' + rnn[i]; i++;}
            else cl.innerHTML = '';
            cl = rw.insertCell(-1);
            cl.innerHTML = '<input style=border:0px size=8 id=codesid' + ki + ' value="">';
            ki++;
        }
    }
    if (SORTK === 0) 
    {
        SORTK = 1; 
        sortby(0);
    }
    document.getElementById('hintstr').innerHTML = textmsg[1927].split(/@/)[7];
}
 

function mouseDown(e)
 {
   if (parseInt(navigator.appVersion)>3)
   {
      var evt = navigator.appName=="Netscape" ? e:event;
      if (navigator.appName=="Netscape" && parseInt(navigator.appVersion)==4)
      {
         var mString =(e.modifiers+32).toString(2).substring(3,6);
         shiftPressed=(mString.charAt(0)=="1");
      }
      else
      {
         shiftPressed=evt.shiftKey;
      }
    }
    return true;
}
document.onmousedown = mouseDown;

function setrange(i)
{
   let cki = document.getElementById('codecheck' + i);
   if (shiftPressed)
   {
      var j = i-1;
      let ckj;
      while (j>=0 && (ckj = document.getElementById('codecheck' + j)).checked!=cki.checked)
      {
         ckj.checked = cki.checked;
         j--;
      } 
   }
    
}
function selecall(c)
{
    let i = 0; let chi;
    while ( (chi = document.getElementById('codecheck' + i)) != null)
    {
        chi.checked = c.checked;
        i++;
    }
}
function managedelete()
{
    
    let ns = ""; let d;
    for(let i=0; (d = document.getElementById('codecheck' + i)) != null; i++)
    {
        if (d.checked)
        {
            ns += ";" + d.parentNode.nextSibling.innerHTML;
        }
       
    }
    if (ns!='') ns = ns.substring(1);
    let f1 = document.form1;
    let v, page;
    let para;
    if (isaembedquiz)
    {  
        page = 'embedquiz.jsp';
        v = ['ddcode',''+orgnum,f1.subdb.value, f1.semester.value,f1.course.value,f1.sessionname.value,ns];
        para = 'mode,orgnum,subdb,semester,course,sessionname,code';
        postopen(page,  para.split(/,/), v,  'w' + tstmp);
    }
    else
    { 
        
        s1 = retrv(0,5);
        v = ['ddcode',''+orgnum,subdb, mat[0][11],mat[0][10],s1,ns]; 
        para = 'mode,orgnum,subdb,semester,course,sessionname,code';
        page = "assigncontrol.jsp";
        postopen(page,  para.split(/,/), v,  'w' + tstmp);
        
    }
    
}
function managecode2(N,ss)
{
    document.getElementById('hintstr').innerHTML = "("+N+") " + textmsg[1817].replace(/ .*$/,'');
    let tb = document.getElementById('ifactivespan');
    if (tb!=null)
    tb.innerHTML =    (ss ==''?'':((isaembedquiz?'(': ('('+ ss +' ')) + textmsg[594] +')'));
    tb = document.getElementById('ifactive');
    if (tb!=null)
    tb.innerHTML =    (ss ==''?'':((isaembedquiz?'(': ('('+ ss +' ')) + textmsg[594] +')'));
}
function savecodesid()
{
    let tb = document.getElementById('dcodes');
    let str = '';
    let j = alldistincts.length - rnn.length;
    for (let i = 0; i < rnn.length; i++)
    {
        str += rnn[i];
        let tx = document.getElementById('codesid' + j);
        if (tx!=null && tx.value!='') str += ":" + tx.value.replace(/[^ ]+[ ]/,'');
        str +=";";
        j++;
    }
    if (rnn.length == 0)
    {
        let tx;
        for (let i = 0; (tx = document.getElementById('codesid' + i)) != null; i++)
        {
            let bb =tx.value.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
            if (bb !=='') 
            {
                str += tx.parentNode.previousSibling.innerHTML;
                str += ":" + bb;
                str +=";";
            }
        }
    }
    let f1 = document.form1;
    let para;
    let v, page;
    if (isaembedquiz)
    {    v = ['svcode',''+orgnum,f1.subdb.value,f1.semester.value, f1.course.value,f1.sessionname.value,str];
         page = 'embedquiz.jsp';
         para = 'mode,orgnum,subdb,semester,course,sessionname,code';
         postopen(page,  para.split(/,/), v,  'w' + tstmp);
    }else
    {   
         for (let mysession of retrv(0,5).split(/,/))
        {
            v = ['svcode',''+orgnum,subdb,  mat[0][11],mat[0][10],mysession,retrv(0,0),str];
            page = "assigncontrol.jsp";
            para = 'mode,orgnum,subdb,semester,course,sessionname,assignname,code';
            postopen(page,  para.split(/,/), v,  'w' + tstmp);
        }
    }
}
 
function printingn(h)
{
    var nav = window.open("", "_blank");
    var tbl = document.getElementById('dcodes');
    nav.document.write("<!doctype html><html><head><title></title><meta http-equiv=\"content-type\" content=\"text/html; charset=utf8\"><style>@page{size: auto; margin: 0mm; }\ntd{font-size:18px;font-weight:bold;text-align:center}\n@media print { div{page-break-after: always; }}</style></head><body style=font-family:courier><table style=border-collapse:collapse border=1 width=100% >");
    let ii = 0, k=0;
    let aa = new Array();
    for (var i=1; i < tbl.rows.length; i++)
    {
       for (let j=0; j < KC; j++)
       { 
           let tt = tbl.rows[i].cells[3*j+1].innerHTML;
           let t2 = document.getElementById("codesid" + (ii++)).value.trim();
           if (tt !=='' && t2 === '')
           {      
               aa.push(tt);
           }
       }
    }
    
    for (var i = aa.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = aa[i];
        aa[i] = aa[j];
        aa[j] = temp;
    }
    for (let j=0; j < aa.length; j++)
    {
    if (k % KP == 0) nav.document.write("<tr height=" + h +">");
               nav.document.write("<td align=center>" + aa[j] + "</td> ");
               if (k % KP == KP-1) nav.document.write("</tr>");
               k++;
     }           
    if (k % KP ==0) {nav.document.write("<tr>");}
    nav.document.write("<td colspan=" + (KP - k % KP) + " align=left>height<select onchange=\"opener.useheight(this);close()\">");
    for (let i=3; i < 10; i++)
    {
        nav.document.write("<option value=" + (10*i) + (h==10*i?' selected ':'') +">" + i + "</option>");
    }
    nav.document.write("</select></td></tr>");
    nav.document.write("</table>");
    nav.document.write("</body></html>");
}
function useheight(sel)
{
    let k = sel.options[sel.selectedIndex].value;
    printingn(k);
}
 
function managecode1(x,d)
{
    var p = new CSVParse(x.replace(/;$/,''),'|',':', ';');
    let r;
    let str = textmsg[1928] +  "<span style=float:right id=ifactivespan>" + (d==''?'':((isaembedquiz?'(': ('('+d +' ')) + textmsg[594] +')'))  + '</span><table align=center border=1 width=0% id=dcodes style=border-collapse:collapse;margin-top:4px;margin-bottom:5px cellpadding=3 ><tr bgcolor=' + BBGCOLOR + ">";
    for (let kk=0; kk < KC;kk++)
    {
        if (kk==0)str += '<td  width=0% ><input type=checkbox id=codecheckall onclick=selecall(this)></td>';
        str += '<td colspan=' + (kk==0?1:2) +' width=0% onclick=sortby(0) ><nobr>' + textmsg[1927].split(/@/)[3] + '<nobr></td><td  onclick=sortby(1) ><nobr>' + textmsg[673] + "<nobr></td>";
        //str += "<td  onclick=sortby(2) ><nobr>" + textmsg[1850].split(/@/)[1] + "<nobr></td>";
    }
    str += "</tr>";
    let kk = 0;
    alldistincts = [];  
    if (x!='')
    while ( (r = p.nextRow(false)) != null && isNaN(r[0])==false || (kk>0 && kk % KC!=0))
    {
        let cd = '', sd = '', ts = '';
        if (r!=null && isNaN(r[0])==false)
        {
            alldistincts[kk] = parseInt(r[0]);
            cd = r[0];
            if(r.length>1) sd = r[1];
            if(r.length>2) ts = r[2];
        }
        if (kk% KC == 0) str += "<tr>";
        str += "<td width=0% style=border-left-width:2px;width:25px align=center ><input type=checkbox id=codecheck" + kk +"  onclick=setrange(" + kk + ")></td>";
        str += "<td align=right width=" + (100/KC) + "% align=right>" + cd + "</td>";
        str += "<td  width=0% ><input style=border:0px size=8 id=codesid" + kk +" value=\"" + sd + "\"></td>";
        //str += "<td  width=0% >" + ts + "</td>";
        if (kk% KC == KC-1) str += "</tr>";
        kk++;
    }
     
    str += "</table><table align=center cellpading=3><tr><td><input id=numnew size=1 value=2   style=\"width:30px;padding:2px 2px 2px 2px;text-align:right;border:1px #cccccc solid\">"
    + "</td><td><input type=button class=GreenButton style=width:80px value=\"" + textmsg[114]  + "\" onclick=\"newmorecode()\">"
    + "</td><td><input type=button class=GreenButton style=width:80px value=\"" + textmsg[67]  + "\" onclick=savecodesid()>"
    + "</td><td><input type=button class=RedButton style=width:80px value=\"" + textmsg[69]  + "\" onclick=managedelete()>"
     
    + "</td><td><input type=button class=GreenButton style=width:80px value=\"" + textmsg[409] + "\" onclick=\"printingn(60)\"></td><td>"
    + (isaembedquiz?('<input id=ses type=hidden value="' + document.form1.sessionname.value + '">'):(textmsg[25] + '<input id=ses size=10 value="' + retrv(0,5) + '" onfocus="this.select()" style="width:90px;padding:2px 2px 2px 2px;text-align:right;border:1px #cccccc solid">'
    + "</td><td><input type=button class=GreenButton style=width:80px value=\"" + textmsg[583]  + "\" onclick=\"checkabsence()\">"))
    + "<td  id=hintstr></td></tr></table>";
     
    myprompt(str,null,null,textmsg[1927].split(/@/)[3]);
    let xy = document.getElementById("optioninfo");
    if (xy != null) {promptwin.style.left = xy.style.left;
    promptwin.style.top = xy.style.top;}
    
}
var SORTK = 0;
function absence(x,sessionnames)
{
    let s = '<table id=absencer cellpadding=4 border=1 style="border-collapse:collapse;boder-color:#ddcc99;border-radius:3px"><tr bgcolor=' + BBGCOLOR +'><td></td><td  style=white-space:nowrap>' + textmsg[37] + '</td><td style=white-space:nowrap>' + textmsg[38] + '</td><td style=white-space:nowrap>' + textmsg[39] + '</td><td   style=white-space:nowrap>' + textmsg[25] + '</td></tr>';
    let r = (new CSVParse(x, '\'',',',';')).nextMatrix();
    for (let i=0; i < r.length; i++)
        s += '<tr bgcolor=' + TBGCOLOR +'><td ><input type=checkbox id=ck' + i + ' checked></td><td style=white-space:nowrap >' + r[i][0]+ '</td><td  style=white-space:nowrap >' + r[i][1] + '</td><td  style=white-space:nowrap >' + r[i][2] + '</td><td align=right>' + r[i][3] + '</td></tr>';
    s += '<tr><td colspan=5 style=border-color:transparent align=center><input type=button id=absbnt onclick="recordabsence(\'' + sessionnames + '\')" class=OrangeButton style=width:' + (4*font_size) + 'px value="'
    + textmsg[1791] + '"></td></tr></table>';
    myprompt(s  ,null, null,textmsg[583] + ": " + sessionnames);
}
function recordabsence(sessionnames)
{
    let tbl = document.getElementById('absencer');
    let s = '';
    for (let r = 1; r < tbl.rows.length-1; r++)
    {
        if (document.getElementById('ck' + (r-1)).checked)
        {
            if (s !== '') s += ';';
            s += tbl.rows[r].cells[1].innerHTML + "," + tbl.rows[r].cells[3].innerHTML;
        }
    }
    let v = ['absencerecord',''+orgnum,subdb, mat[0][11],mat[0][10],sessionnames,s]; 
    para = 'mode,orgnum,subdb,semester,course,sessionname,code';
    page = "assigncontrol.jsp";
    postopen(page,  para.split(/,/), v,  'w' + tstmp); 
}
function checkabsence()
{
    let v;
    let f1 = document.form1;
    if (isaembedquiz) 
    {
        s1 = document.form1.sessionname.value;
        v = ['absence',''+orgnum,f1.subdb.value,f1.semester.value, f1.course.value,f1.newaname.value,f1.sessionname.value,s1];
        page = "embedquiz.jsp";
    }
    else 
    {
        s1 = retrv(0,5);
        v = ['absence',''+orgnum,subdb, mat[0][11],mat[0][10],mat[0][0],document.getElementById('ses').value,s1]; 
        page = "assigncontrol.jsp";
    }
    para = 'mode,orgnum,subdb,semester,course,assignname,sessionname,sessions';
    
    postopen(page,  para.split(/,/), v,  'w' + tstmp);
}
function compr(x,y)
{
    if (SORTK==0)
    {
        x = x.replace(/@.*/,'');
        y = y.replace(/@.*/,'');
        return parseInt(x) - parseInt(y);
    }
    else
    {
        x = x.replace(/^[^@]+@/,'');
        y = y.replace(/^[^@]+@/,'');
        let xs = x.split(/#/);
        let ys = x.split(/#/);
        if (xs[0] === ys[0])
        {
             return parseInt(xs[1]) - parseInt(ys[1]);
        }
        else
        {
            return  xs[0] > ys[0]?1:-1;
        }
    }
    
}
function sortby(k)
{
     
    SORTK = k;
    let a=new Array();
    let c; let i=0;
    while ((c = document.getElementById('codecheck'+i))!==null)
    {
        let x = c.parentNode.nextSibling.innerHTML;
        if (x === '') break;
        a[a.length] = x  + "@" + c.parentNode.nextSibling.nextSibling.childNodes[0].value +" #" + a.length;
        i++;
    }
    a.sort(compr);
    i=0;
    while ( (c = document.getElementById('codecheck'+i))!==null && i < a.length)
    {
        let xs = a[i].split(/@/);
        c.parentNode.nextSibling.innerHTML =  xs[0];
        c.parentNode.nextSibling.nextSibling.childNodes[0].value = xs[1].replace(/ #.*/,'');
        i++;
    }
}
function managecode()
{
    closeprompt();
    let f1 = document.form1;
    let para;
    let v, page;
    if (isaembedquiz)
    {    
        v = ['dcodes',''+orgnum,f1.subdb.value, f1.semester.value,f1.course.value,f1.sessionname.value]; 
        para = 'mode,orgnum,subdb,semester,course,sessionname';
        page = 'embedquiz.jsp';
        postopen(page,  para.split(/,/), v,  'w' + tstmp);
    }
    else
    { 
      //  for (let mysession of retrv(0,5).split(/,/))
        {
            v = ['dcodes',''+orgnum, subdb,  mat[0][11],mat[0][10],retrv(0,5),retrv(0,0)];
            para = 'mode,orgnum,subdb,semester,course,sessionname,assignname';
            page = 'assigncontrol.jsp';
            postopen(page,  para.split(/,/), v,  'w' + tstmp);
        }
    }
    
}
let thissession;
function manageattend(s)
{
    thissession =s;
    closeprompt();
    let f1 = document.form1;
    
    let v,para,page = 'embedquiz.jsp';
    if (isaembedquiz)
    {
        v = ['attend',''+orgnum,f1.subdb.value, f1.semester.value,f1.course.value,f1.sessionname.value,pastminutes];
        para = 'mode,orgnum,subdb,semester,course,sessionname,minutes';
    }
    else 
    {
        para = 'mode,orgnum,subdb,semester,course,sessionname,assignname,minutes';
        v = ['attend',''+orgnum,subdb, mat[0][11],mat[0][10],thissession,retrv(0,0),pastminutes];
        page = 'assigncontrol.jsp';
    }
    postopen(page ,  para.split(/,/), v,  'w' + tstmp);
    
}
function manageattend1(x,active)
{
     x = x.replace(/;$/,'');
     var pr = new CSVParse(x, '|', ":", ";");
     let label = textmsg[1929].split(/@/);
     let ss;
     let str = '';
     if (typeof(retrv) == 'function' && (ss = retrv(0,5)).indexOf(",")>0)
     {
         str += "<center><span style=background-color:" + IBGCOLOR + ";color:#DDCC11>" + textmsg[25] + "</span><select onchange=manageattend(this.options[this.selectedIndex].value)>";
         for (let s of ss.split(/,/))
         {
             str += "<option " + (thissession==s?"selected":'') + " value=\"" + s + "\">" +s +"</option>";
         }
         str += "</select></center>";
     }
     str += label[0] + "<input size=2 value=" + pastminutes + "     style=\"border:1px #777 solid;text-align:center\" onchange=\"javascript:pastminutes=this.value;manageattend(thissession)\">" + label[1];
     if (active) str += "<span style=float:right>("+textmsg[594] + ")</span>";
     str += "<table id=absentid style=\"border-collapse:collapse;margin:5px 0px 5px 0px\" border=1 align=center cellpadding=3 ><tr bgcolor=" +BBGCOLOR +"><td>" + textmsg[673] + "</td><td>" + textmsg[39] + "</td><td>" + textmsg[38] + "</td></tr>";
     let r; let i = 0;
     if (x!='')
     while ((r = pr.nextRow()) != null)
     {
         str += "<tr><td><input style=border:0px size=8 id=sid" + i + " value=" + r[0] + "></td>";
         str += "<td><input style=border:0px size=10 id=ln" + i + " value=" + r[1] + "></td>";
         str += "<td><input style=border:0px size=10  id=fn" + i + " value=" + r[2] + "></td></tr>";
         i++;
     }
     r = ['','',''];
     for (let j=0; j < 2; j++)
     {
         str += "<tr><td><input id=sid" + i + "  style=border:0px size=8 value=" + r[0] + "></td>";
         str += "<td><input id=ln" + i + "  style=border:0px size=12 value=" + r[1] + "></td>";
         str += "<td><input id=fn" + i + "  style=border:0px size=12 value=" + r[2] + "></td></tr>";
         i++;
     }
     str += "</table><center><input class=OrangeButton type=button style=width:80px onclick=manageattend2() value=\"" + textmsg[225] + "\" ></center>";
     myprompt(str, null,null,textmsg[1915]);
     //promptwin.style.width = '500px';
     let xy = document.getElementById("optioninfo");
     if (xy != null){promptwin.style.left = xy.style.left;
     promptwin.style.top = xy.style.top;}
}
function manageattend2()
{
    let str = ''; let i = 0;
    while (i<100)
    {
        let sid = document.getElementById('sid' + i);
        if (sid == null) break;
        sid.value = sid.value.replace(/ /g,'');
        if (sid.value != '')
        str += ";" + sid.value;
        i++;
    }
    if (str == '') str = ";";
    let v, page = 'embedquiz.jsp';
    let para;
    if (isaembedquiz)
    {
        let f1 = document.form1;
        v = ['attend',''+orgnum,f1.subdb.value, f1.semester.value,f1.course.value,f1.sessionname.value,pastminutes, str];
        para = 'mode,orgnum,subdb,semester,course,sessionname,minutes,ids';
    }
    else
    {    v = ['attend',''+orgnum,subdb, mat[0][11],mat[0][10],thissession,retrv(0,0),pastminutes, str];
        para = 'mode,orgnum,subdb,semester,course,sessionname,assignname,minutes,ids';
        page = 'assigncontrol.jsp';
    }
    postopen(page,  para.split(/,/), v,  'w' + tstmp);
}
 
function setcode(codeorder) 
{
    document.getElementById('manageatt').style.display = codeorder==1?'inline':'none';
    document.getElementById('code').style.display = codeorder==2?'inline':'none';
    document.getElementById('passspan').style.display = codeorder==3?'inline':'none';
    let hints = ['','','','']; 
    if (isaembedquiz) 
        s1 = document.form1.sessionname.value;
    else 
    {   
        hints = textmsg[1930].split(/@/);
        s1 = retrv(0,5).replace(/,.*$/,''); 
    }
    if (codeorder==0)
    {
        if (code !=null && code!='' && isNaN(code) == false)
            code0 = code;
        code = '';
        document.getElementById('code').value = code;
    }
    else if (codeorder==1)
    {
        if (code !=null && code!='' && isNaN(code) == false)
            code0 = code;
        code = 'attendance';
        document.getElementById('code').value = code;
    }
    else if (codeorder==2)
    {
        
        if (code == null || code == '' || isNaN(code)) 
            code = code0;
        document.getElementById('code').value = code;
    }
    else
    {
        if (code !=null && code!='' && isNaN(code) == false)
            code0 = code;
        code = 'distinct';
        document.getElementById('code').value = code;
    }
   
    let v, para, page = 'embedquiz.jsp';
    let  f1 = document.form1;
    if (isaembedquiz)
    {
        let kk = document.form1.optionstr.value.indexOf(';cd:');
        if (kk == -1)
        {
            document.form1.optionstr.value = document.form1.optionstr.value + ";cd:" + code;
        }
        else
        {
            document.form1.optionstr.value = document.form1.optionstr.value.substring(0,kk+4) + code;
        }
        v = ['code',''+orgnum,f1.subdb.value,f1.semester.value, f1.course.value,f1.sessionname.value,code];
        para = 'mode,orgnum,subdb,semester,course,sessionname,code';
        postopen(page,  para.split(/,/), v,  'w' + tstmp);
    }
    else
    {
        document.getElementById('hintarea').innerHTML = hints[codeorder];
        para = 'mode,orgnum,subdb,semester,course,sessionname,assignname,code';
        page = 'assigncontrol.jsp';
        if (assoptions.indexOf(";cd:") < 0)
             assoptions += ";cd:" + code;
        else
           assoptions = assoptions.replace(/;cd:.*$/,";cd:" + code);
        setAssoptions();
        if (codeorder==1 || codeorder==3)
        {
            v = ['code',''+orgnum, subdb, mat[0][11],mat[0][10],retrv(0,5),retrv(0,0),code];
            postopen(page,  para.split(/,/), v,  'w' + tstmp);
        }
    }
 
}
 
function enlarge()
{
    let b = document.getElementById('lblcode');
    let x = b.style.fontSize;
    x = x.replace(/[^0-9]/g,'');
    let y = parseInt(x);
    b.style.fontSize = (y + 2) + 'px';
    let bb = document.getElementById('code');
    y = parseInt(bb.style.fontSize.replace(/[^0-9]/g,''));
    bb.style.fontSize = (y + 2) + 'px';
    bb.style.width = (3*(y+2)) + 'px';
}

function confirmset(ss)
{
    if (document.getElementById('code').style.display == 'inline')
        document.getElementById('code').style.color = 'green';
    let bb = document.getElementById('ifactive');
    if (bb!=null) 
        bb.innerHTML = ss==''?'':((isaembedquiz?'':ss) + ' '+textmsg[594]);
}
 




