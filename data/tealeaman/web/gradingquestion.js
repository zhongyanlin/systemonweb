var labs0 = textmsg[1799].split(/@/);
document.getElementById('summary').innerHTML = "<table border=0 align=\"center\" class=\"outset3\" style=\"margin-top:3px;margin-bottom:3px;border-color:#ddcc99\" cellpadding=3 >" + str   + "</table>";  

if (typeof(encorders) != 'undefined')
{
    serCharSize(charsize);
    let shuffledsids = decryptString0(sids).split(/,/);
    let orders = decryptString0(encorders).split(/,/);
    for (let k=0; k < mat.length; k++)
    {
        let j = orders[k];
        mat[j][2] = shuffledsids[k];
    }
    document.getElementById('anonytd').innerHTML = "(" +  textmsg[1828] + ")";
}
 document.getElementById('atype').innerHTML = "<nobr>" +  textmsg[1333].split(/@/)[atype] + "</nobr>"; 
if (!viewassess && document.getElementById('unigrade')!=null)
    document.getElementById('unigrade').value =  textmsg[923];
var nextbtn = document.getElementById('nextbtn');
if (nextbtn!=null)nextbtn.value = labs0[12];

var flabels = textmsg[1942].split(/@/); 
var valuechanged = new Array(N);
var fmts = new Array(N);
var sids = new Array(N);
var submitted =  new Array(N);
 
var feedback =  new Array(N);
var scores =  new Array(N);
var hints = new Array(N);
var numRows = N;
var tspent = new Array(N);
 
for (var i=0; i < N; i++)
{
    if (mat[i] == null)
    {
        N = i;
        break;
    }
    fmts[i] = mat[i][9];
    sids[i] = mat[i][2];
    feedback[i]= mat[i][7];
    
    scores[i] =  (mat[i][4]);
    submitted[i] = mat[i][6];
    var xx = document.getElementById('submitted'+i);
    if (xx!=null && xx.disabled == false)
    xx.value = textmsg[139];
    if(mat[i][5]!=null && mat[i][5]!='null'&&mat[i][5]!='') hints[i] = "<img width=100 src=" + mat[i][5] + ">";
    else hints[i] = "<img width=100 src=nophoto.jpg>";
    tspent[i] = parseFloat(mat[i][22]);
    if (mat[0][12] == '4' && tspent[i]==0) 
        tspent[i] = N+1;
}
 
function resetallquickscore(edit )
{
     if (isNaN1(edit.value)) return;
     
     for (var i=0; i < N; i++)
     {
         var quickscore  = document.getElementById('quickscore' + i);
         if (quickscore!=null)
         {
             quickscore.value = edit.value;
         }
          quickscore  = document.getElementById('score' + i);
         if (quickscore!=null)
         {
             quickscore.value = edit.value;
         }
     }
      document.getElementById('btnundo').style.visibility = 'visible';
 }
function makesel(fmt,qora)
 {
     var fmtops   = "<option value=0 " + ( fmt =='0'? 'selected':'') + ">" + textmsg[83] + "</option>"
                 + "<option value=1 " + ( fmt =='1'? 'selected':'') + ">HTML</option>"
                 + "<option value=2 " + ( fmt =='2'? 'selected':'') + ">LaTeXML</option>"
                 +  "<option value=3 " + ( this.atd[i][6]=='3'? 'selected':'') + ">" + textmsg[1847] + "</option>"
                + "<option value=4  >" + textmsg[69] + "Tab</option>";
     fmtops =   "<select name=fmtbox" + qora+"  onchange=\"updatefmt1(this,'" + qora + "')\" class=gradetxt  style=\"border:1px #999999 solid;float:right;background-color:" + DBGCOLOR + ";width:" + Math.round(charwidthrate()*font_size) + "px\" >" + fmtops + "</select>";
     return  fmtops;
 }
 function updatefmt1(sel, i)
 {
    
 }
function quick2()
{
    
    var tbl = document.getElementById('delconfirmtbl'); 
    var sk = 0, sg = 0;
    var kk=3; if (sformat==4) kk=2;
    for (var i=0; i <  N; i++)
    {
        var n = 0;
        if (words!=null)
        {
            for (var j=0; j < words.length; j++)
            {
                if (mat[i][6].indexOf(words[j])>=0) n++;
            }
            var y = Math.round(n*100.0/words.length);
            sk += y;
            
            tbl.rows[i+1].cells[kk].innerHTML = y + '%';
        }
    }
    tbl.rows[i+1].cells[kk].innerHTML = oneplace(sk/N);
}

function synscore(td, i)
{
    var t = td.value;
    if (t == '') return;
    if (isNaN1(t)){ td.focus(); return;}
    document.getElementById('score' + i).value = t; 
    document.getElementById('btnundo').style.visibility = 'visible';
}
function oneplace(x)
{
    var y = '' + Math.round(x*100);
    if (y.length==1) y = '00' + y;
    else if (y.length==2) y = '0' + y;
    return y.replace(/(..)$/, '.$1');
}
var originalscore = new Array();
var shorten = false;
var meanlength = 0;
var gradingformulas =["K*(1-Min(2,P)*0.2)","(0.3*Min(L,M)/M + 0.7*K)*(1-Min(2,P)*0.2)","(0.4*Min(L,1)+0.6*K)*(1+0.1*(N-R)/N)"];
 
function getformula(t,a)
{
    if (parent!=window && parent.frames.length==2)   return parent.frames[0].getformula(t,a)
    if (''+a=='4') return gradingformulas[2];
    if (t==4) return gradingformulas[0];
    return   gradingformulas[1];
}
function setformulas(t,f,a)
{
    if (parent!=window && parent.frames.length==2) 
        parent.frames[0].setformulas(t,f,a);
    if (''+ a == '4') gradingformulas[2] = f;
    else if (t==4) gradingformulas[0] = f;
    else  gradingformulas[1] = f;
}
function roundall()
{
    for (var i=0; i < N; i++)
    {
        var v = parseFloat(document.getElementById('quickscore' + i).value);
        document.getElementById('quickscore' + i).value = Math.round(v);
        document.getElementById('score' + i).value = Math.round(v);
    }
}

function quickgrade(btn)
{
    if (mat.length < 1) return;
    if (shorten==false)
    {
        if (sformat == 4)
            keywords = keywords.replace(/^[ ]+/,'').replace(/ .*/,''); 
        else 
        {
            var  words = keywords.replace(/,[ ]*$/,'').replace(/^[ ]+/,'').split(/[ ]*,[ ]*/); 
            keywords = ',';
            for (var j=0; j < words.length; j++)
            {
                if ((keywords).indexOf("," + words[j] + ",") < 0)
                    keywords += words[j] + ",";
            }
            keywords = keywords.replace(/^,/,'').replace(/,$/,'');
        }
    }
    //textmsg[1310], textmmsg[1309]
    var labs = [textmsg[542],labs0[4],labs0[5],labs0[6],msg224];
    var tt = "<tr style=\"background:" + beheading + "\">";//<td width=" + (font_size + 3) + " align=center><input type=checkbox onclick=controlallquickchecks(this) checked></td>
    tt += "<td align=right valign=top><nobr><b>" + labs[0] + "</b></nobr></td>";
    tt += "<td align=right valign=top><nobr><b>" + labs[1] + "<br>(P)</b></nobr></td>";
    if (sformat!=4) tt += "<td align=right valign=top><nobr><b>" + labs[2] + "<br>(L)</b></nobr></td>";
    tt += "<td align=right valign=top><nobr><b>" + labs[3] + "<br>(K)</b></nobr></td>";
    tt += "<td align=right valign=top><nobr><b>" + textmsg[timerace] + "<br>(" + (mat!=null && mat.length>0 && mat[0][12]=='4'?'R':'T') + ")</b></nobr></td>";
    tt += "<td align=right valign=top><nobr><b>" + textmsg[787] + "<br>(A)</b></nobr></td>";
    tt += "<td align=right valign=top><nobr><b>" + labs[4] + "<br>(S)</b></nobr></td>";
    tt += "</tr>";
//course,Assigntest,sid,SubmitAt,Score,
//PhotoUrl,content,comment,Due,Format,
//Student,attach,atype,Assess,AsAssess,
//question,Answer,Attachat,Scale,Weight,
//Sessionname,Aformat
     var M = 0;
     var sp=0,sl=0,sk=0,st = 0,sa=0;
     for (var i = 0; i < N; i++)
     {
            tt += "<tr  bgcolor=" + TBGCOLOR + " ><td align=right><a href=#" + i + ">" + (i + 1) + "</a></td>";
            var jj = 0, ll = 0;
            var vv = Math.round((parseFloat(mat[i][3]) - due)/360.0/24.0);
            if (vv<=0) vv = 0;
            sp += vv;
            var iv = ''+ vv;
            if (iv.length==1) iv = "0" + vv;
            iv = iv.replace(/(.)$/, '.$1');
            tt += "<td align=right>" + iv + "</td>";
            if (sformat!=4) tt += "<td align=right>" +  (mat[i][9]=='6'?(mat[i][11].replace(/[^,]/g,'').length*1000):mat[i][6].length) + "</td>";
            sl += mat[i][6].length;
           // if (mat[i][6].length > M) M = mat[i][6].length;
            tt += "<td align=right></td>";
            originalscore[i] = document.getElementById('score' + i).value;
            
            tt += "<td align=right>" + tspent[i] + "</td>";
            st += tspent[i];
            var numa = genAttachnum(mat[i][11]);
            sa += numa;
            tt += "<td align=right " + (numa==0?'':("style=color:blue onclick=\"ResizeUploaded.attachman(document.getElementById('attach" +i + "'))\"")) + ">" + (numa) + "</td>"; 
            tt +=  '<td align=right><input style=color:rgb(255,0,0) id=quickscore' + i + ' class=right size=3 value="' + originalscore[i] + '" onchange=synscore(this,' + i + ')></td>';
            tt += "</tr>";
    }
    meanlength = M = Math.round(sl/N);
    
    tt += "<tr  bgcolor=" + TBGCOLOR + " ><td  align=right>" + labs0[10]+ "</td><td align=right>" + oneplace(sp/10.0/N) + "</td>";
    if (sformat!=4) tt += "<td align=right>M=" + M + "</td>";
    tt += "<td align=right></td><td align=right>" + Math.round(st/N) + "</td><td align=right>" + Math.round(sa/N) + "</td><td align=right></td></tr>";
    tt += "<tr  bgcolor=" + TBGCOLOR + " ><td ></td><td align=right>P</td>";
    if (sformat!=4) tt += "<td align=right>L</td>";
    tt += "<td align=right>K</td>";
    tt += "<td align=right>" + (mat!=null && mat.length>0 && mat[0][12]=='4'?'R':'T') + "</td>"; 
    tt += "<td align=right>A</td>";
    tt +="<td align=right>S<a href=\"javascript:roundall()\">" + labs0[11] + "</a></td></tr>";
    //var tmp = "<nobr>" + textmsg[1789] + "</nobr>";// + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href=javascript:quick1()>" +textmsg[923] + "</a>";
    var tmp  =  "<div style=\"margin:3px 3px 3px 3px;background-color:grey;border-radius:3px\"><table width=100% id=delconfirmtbl  class=outset1 align=center cellspacing=1 cellpadding=3 border=0>"
       + tt + "</table>";
    tmp +=  "<table width=100% class=outset3 style=\"margin:5px 0px 0px 0px;border-color:#d5c677\" align=left><tr><td valign=top align=left><nobr>" 
            +  labs0[7] +  '</nobr><br><br><div id=error>' + textmsg[1760] 
            + "=" + mat[0][18] + "</div></td><td><textarea id=keywords rows=4 style=\"width:400px;border:1px #ddcc99 solid\">" 
            + keywords.replace(/,$/,'') + "</textarea></td></tr><tr><td><table cellpacing=0 cellpadding=0><tr><td><nobr>";
    tmp +=   textmsg[1286] + ":</nobr></td><td align=right>S=" +   mat[0][18] + "*</td></tr></table></td><td><input id=formula onfocus=\"this.style.color='black';\" onchange=setformulas(sformat,this.value,mat[0][12]) style=\"width:400px;text-align:left;border:1px #ddcc99 solid\" value=\"" 
            +   getformula(sformat,mat[0][12])  + "\" /></td></tr>" 
    tmp +=   '<tr><td align=center colspan=2>';
    let inx = 0;
    let isurl = isURL();
    if (isurl)
    {
         tmp +=   '<input type=button class=OrangeButton style=width:' 
            + (font_size*4.5) + 'px  value="' + textmsg[1200]+ '" onclick=quick2(this) >'; 
     
    }
    tmp +=   '<input type=button class=OrangeButton style=width:' 
            + (font_size*4.5) + 'px  value="' + textmsg[923] 
            + '" onclick=quick1() >';
    tmp += '<input id=btnundo type=button class=OrangeButton  style=width:' ;
    tmp +=   (font_size*4.5) + 'px;visibility:hidden   value="' 
            + msg1224 + '" onclick=undoquick() >';
    tmp +=  '<input type=button class=RedButton style=width:' 
            + (font_size*4.5) + 'px id=closebtn value="' + textmsg[1421] 
            + '" onclick="closeprompt(\'quickest\')" >';
     tmp +=   '</td></tr>';  
      tmp +=  '<tr><td colspan=2   >' + labs0[8] + '</td></tr>';
      tmp +=  '</table></div>';
    myprompt(tmp, null, null, textmsg[1788],'quickest' );
    promptwin = document.getElementById('quickest');
    promptwin.style.left = '110px';
    if (1+1==2)
    {
        var xy = findPositionnoScrolling(btn);
        xy[1] = xy[1] - promptwin.offsetHeight;
        if (xy[1] < 100) xy[1] = 100;
        promptwin.style.top = xy[1] + 'px';
    }
    
    if (shorten) quick1(); 
    shorten = true;
}
function quick1()
{
    var words = null; 
    var wordele = document.getElementById('keywords');
    if (wordele != null  )
    {
        keywords = wordele.value;
        if (keywords.length>0)
        words = keywords.replace(/,[ ]*$/,'').replace(/^[ ]+/,'').split(/[ ]*,[ ]*/); 
    }
     
    var tbl = document.getElementById('delconfirmtbl'); 
    var numcols = tbl.rows[0].cells.length;
    var sk = 0;
    var sg = 0;
     
    var kk=3; if (sformat==4) kk=2;
    for (var i=0; i <  N; i++)
    {
        var n = 0;
        var y = 0;
        if (words!=null)
        {
            for (var j=0; j < words.length; j++)
            {
                if (mat[i][6].toLowerCase().indexOf(words[j].toLowerCase())>=0) n++;
            }
            y = Math.round(n*100.0/words.length);
            sk += y;
            tbl.rows[i+1].cells[kk].innerHTML = y + '%';
        }
        var l = tbl.rows[i+1].cells[2].innerHTML;
        var p = tbl.rows[i+1].cells[1].innerHTML;
        var aa =   tbl.rows[i+1].cells[5].innerHTML.includes('<!---->')?1:0;
        var numa = tbl.rows[i+1].cells[numcols-2].innerHTML;
        var f = document.getElementById('formula').value;
        f = f.replace(/max/ig,'@#').replace(/min/ig,'#@');
        if (words!=null)
            f = f.replace(/K/ig,'' + (y/100.0)  );
        else
            f = f.replace(/K/ig, '1');
        var timetake = 0,race=N;
        f = f.replace(/A/g, ''+aa); 
        if (mat[0][12] == '4')
            race = tbl.rows[i+1].cells[numcols-3].innerHTML;
        else
            timetake = tbl.rows[i+1].cells[numcols-3].innerHTML;
        f = f.replace(/x/g,'*').replace(/L/ig,''+l).replace(/P/ig,''+p).replace(/M/ig,''+meanlength).replace(/R/ig,''+ race).replace(/N/ig, ''+N).replace(/T/ig,''+timetake).replace(/A/ig,''+numa);
        
        f = f.replace(/@#/ig,'Math.max').replace(/#@/ig,'Math.min');
        
        f = mat[0][18] + "*(" + f + ")";
        try{
            var zz = eval(f) ;
            sg += zz;
           
            if (sformat==4)
            {
                if (zz>0) 
                    document.getElementById('commenttd'+i).innerHTML = "<img src=image/answerright.gif>";
                else
                    document.getElementById('commenttd'+i).innerHTML = "<img src=image/answerwrong.gif>"; 
            }
            let gr = oneplace(zz);
            let inputs = document.getElementById('score' + i);
            if (inputs!=null) inputs.value = gr;
            inputs = document.getElementById('quickscore' + i);
            if (inputs!=null) inputs.value = gr;
            let v = Math.round(gr);
            let sels =  document.getElementById("scoreradio" + i  + "_" + v );
            if (sels!=null)
            {
                sels.click();
                sels.checked = true;
            }
       } catch(e1){ document.getElementById('formula').style.color = 'red';
       document.getElementById('error').style.color =  labs0[9];}
    }
    
    tbl.rows[N+1].cells[kk].innerHTML = Math.round(sk/N) + '%';
    tbl.rows[N+1].cells[numcols-1].innerHTML = oneplace(sg/N);
     document.getElementById('btnundo').style.visibility = 'visible';
    document.getElementById('sendbtn').disabled =  false;
}
var counterv = 0;
function isURL()
{
    let i = 0; let nn=0;
    while(i < N && i < 5)
    {
        let inx=mat[i][6].indexOf("http");
        if (inx >-1 && inx < 12) nn++;
        i++;
    }
    return i===1 && nn===1 || i===2 && nn>=1 || i>2 && nn/i > 0.6;
    
}
async function testUrl(i)
{
    var tbl = document.getElementById('delconfirmtbl');
    var numcols = tbl.rows[0].cells.length;
    var sk = 0;
    var sg = 0;
    var kk = 3;
    if (sformat == 4)
        kk = 2;

    var n = 0;
    var y = 0;
    var url ='';
    let ret = false;
    let urls = new Array();
    let arr = mat[i][6].replace(/^[ |\n|\r|\t]+/,'').replace(/[ |\n|\r|\t]+$/,'').split(/[ |\n|\r|\t]+/);
    for (let y of arr)
    { 
        let j =y.toLowerCase().indexOf('http');
        if (j >=0)
        {
            url = y.substring(j).replace(/[,|;|\.]$/,'');
            
            try
            {
                const response = await fetch(url, {method: 'HEAD'});
                ret = response.ok;
                urls.push(url);
            } catch (error)
            {
                ret = false;
                urls.push(url + "  NOT working");
            }
            if (ret) break;
        }
        else
        {
           ret = false; urls.push("  NOT valid URL"); 
        }
    }
    counterv += ret?1:0;
    url =urls.join("\n");
    tbl.rows[i + 1].cells[kk].innerHTML = url.length < 120? url : url.substring(0,120);
    tbl.rows[i + 1].cells[kk].align = 'left';
    tbl.rows[N + 1].cells[kk+2].innerHTML = (counterv) + '/' + (i+1);
    if (i === 0) 
    {
        tbl.rows[0].cells[kk].innerHTML = 'URL';
        tbl.rows[0].cells[kk+2].innerHTML = 'Valid';
    }
    var zz = ret ? parseFloat(mat[0][18]) : 0;
    sg += zz;
    if (zz > 0)
    {
        tbl.rows[i + 1].cells[kk+2].innerHTML =  "<span style=\"color:green;font-size:24px\">&check;</span><!---->";
       // document.getElementById('comment' + i).value = '';
    } 
    else
    {    
        tbl.rows[i + 1].cells[kk+2].innerHTML =  "<span style=\"color:red;font-size:24px\">&cross;</span>";
        document.getElementById('comment' + i).value = 'Invalid URL or can not open the URL';
    } 
    let gr = oneplace(zz);
    let inputs = document.getElementById('score' + i);
    if (inputs != null)
        inputs.value = gr;
    inputs = document.getElementById('quickscore' + i);
    if (inputs != null)
        inputs.value = gr;
    let v = Math.round(gr);
    let sels = document.getElementById("scoreradio" + i + "_" + v);
    if (sels != null)
    {
        sels.click();
        sels.checked = true;
    }
    if (i >= N-1) document.getElementById('closebtn').style.visibility = 'visible';
}
var keepdoing = false;
function quick2(btn)
{
    if (btn.value === textmsg[1200])
    {
        counterv = 0;
        keepdoing = true;
        (async () => { 
            for (let i=0; keepdoing && i < N; i++)
                await testUrl(i);
        })();
        document.getElementById('btnundo').style.visibility = 'visible';
        document.getElementById('sendbtn').disabled =  false;
        document.getElementById('closebtn').style.visibility = 'hidden';
        btn.value = textmsg[1771].split(/@/)[5];
    }
    else
    {
        keepdoing = false;
       document.getElementById('sendbtn').disabled =  false; 
       btn.value = textmsg[1200]; 
       document.getElementById('closebtn').style.visibility = 'visible';
    }
}

function undoquick()
{
   for (var i=0; i < N; i++)
   {
       document.getElementById('score' + i).value = originalscore[i];
       document.getElementById('quickscore' + i).value = originalscore[i];
   }
   document.getElementById('btnundo').style.visibility = 'hidden';
}
function addcells(i,la)
{
       var digit = typeof(i) == 'number';
       var exists = document.getElementById('q' + i + 'q' + (la+1));
       if (exists!=null) return;
       var qa = document.getElementById('q' + i + 'q' + la);
       var off = 0;
       if (la%4 == 0)
       {
           var n = qa.parentNode.parentNode;
           
       }
       else if (la%4 == 1)
       {
           var n = qa.parentNode.parentNode;
          
           off = 4;
       }
       else if (la%4 == 2)
       {
           var n = qa.parentNode.parentNode;
          
           off = 8;
       }
       else
       {
           n = qa.parentNode.parentNode.parentNode.parentNode.insertRow(-1);
          
           off = -4;
       }
        
       var c3 = null; if (3+off>=0) {c3= n.insertCell(3+off); c3.innerHTML = "&nbsp;";}
       var c4 = n.insertCell(4+off); c4.innerHTML = "<input   class=gradeinput style=width:50px;color:black  id=\"q" +i + "q" + (la+1) + "\"  onfocus=resist(this)  onchange=\"varyqn(this," + (!digit?"''":i) + "," + (la+1) + ")\" >";
       var xx = "<input   class=gradeinput style=width:50px;color:green  id=\"s" +i + "q" + (la+1) + "\"  onfocus=\"followscale(this," + (!digit?"''":i) + "," + la + ");resist(this)\"    onchange=\"varyscale(this," + (!digit?"''":i) + "," + (la+1) + ")\" >";
       var c5 = n.insertCell(5+off); c5.innerHTML = xx;
       var c6 = n.insertCell(6+off); c6.innerHTML = "<input   class=gradeinput style=width:50px;color:red  id=\"g" +i + "q" + (la+1) + "\"    onchange=\"varygrade(this," + (!digit?"''":i) + "," + (la+1) + ")\" >";
       if (la < 3)
       {
           var tr0 = n.parentNode.parentNode.rows[0];
           c3 = tr0.insertCell(-1);c3.innerHTML = "&nbsp;";
           c4 = tr0.insertCell(-1);c4.className='outset3'; c4.style.cssText='border-radius:0px;font-family:inherit'
           c4.align='right';c4.innerHTML = tr0.cells[0].innerHTML;
           c5 = tr0.insertCell(-1);c5.className='outset3'; c5.style.cssText='border-radius:0px;font-family:inherit'
           c5.align='right';c5.innerHTML = tr0.cells[1].innerHTML;
           c6 = tr0.insertCell(-1);c6.className='outset3'; c6.style.cssText='border-radius:0px;font-family:inherit'
           c6.align='right';c6.innerHTML = tr0.cells[2].innerHTML;
           
       }
}
function copyv(i, j,la)
{
   var qi = document.getElementById('q' + i + 'q' + la);
   var qj = document.getElementById('q' + j + 'q' + la);
   qj.value = qi.value;
    qi = document.getElementById('s' + i + 'q' + la);
    qj = document.getElementById('s' + j + 'q' + la);
   qj.value = qi.value;
}
function varycomment()
{
    needsave = true;
    window.onbeforeunload = beforeclose;
    document.getElementById('sendbtn').disabled = false;
}
function   varyqn(p,i, la)
{
   needsave = true;
   window.onbeforeunload = beforeclose;
   document.getElementById('sendbtn').disabled = false;
   if (!isinstructor)
   {
       if (undonumber!='' && p.value!='' && undonumber!=p.value)
       {
           p.value = undonumber;
           return;
       }
   }
   var qa = document.getElementById('q' + i + 'q' + la);
   var qs = document.getElementById('s' + i + 'q' + la); 
   if (!isNaN1(qs.value) )
   {
        if (  document.getElementById('q' + i + 'q' + (la+1)) == null)
        {
            for (var j=0; j < N; j++)  addcells(j,la);
            addcells('',la); 
        }
        for (var j=0; j < N; j++) copyv(i, j,la);
        copyv(i, '', la); 
   }
   for (var lb=0; ; lb++)
   {
       var q = document.getElementById('q' + i + 'q' + lb);
       if (q == null) break;
       if (la!=lb && qa.value.replace(/ /g,'') ==  q.value.replace(/ /g,''))
       {
           myprompt(q.value + textmsg[3]);
           break;
       }
   }
}

var undonumber;
function resist(td)
{
   undonumber = td.value; 
}
function followscale(td,i,la)
{
    var q = document.getElementById('q' + i + 'q' + la);
    var found = false;
    for (var j=0; ;j++ )
    {
        var qq =  document.getElementById('qq' + j);
        if (qq==null) break;
        if (qq.value == q.value)
        {
            found = true;
            break;
        }
    }
    if (found==false) return;
    q = document.getElementById('s' + i + 'q' + la);
    qq =  document.getElementById('sq' + j);
    q.value = qq.value;
}
function   varyscale(p,i, la)
{
   needsave = true;
   window.onbeforeunload = beforeclose;
   document.getElementById('sendbtn').disabled = false;
   var qa = document.getElementById('q' + i + 'q' + la);
   var q = document.getElementById('s' + i + 'q' + la);
   if (  (isNaN1(q.value) || parseFloat(q.value)<0))
   {
       myprompt("Invalid");
       return;
   }
   if (!isinstructor)
   {
       if (  !isNaN1(undonumber)
          &&   !isNaN1(q.value)
          && undonumber!=q.value)
       q.value = undonumber;
       return;
   }
   qa = document.getElementById('q' + i + 'q' + la);
   var qs = document.getElementById('s' + i + 'q' + la); 
   if (qa.value!='' && qs.value!='' && !isNaN1(qs.value) )
   {
        if (  document.getElementById('q' + i + 'q' + (la+1)) == null)
        {
            for (var j=0; j < N; j++)  addcells(j,la);
            addcells('',la); 
        }
        for (var j=0; j < N; j++) copyv(i, j,la);
        copyv(i, '', la); 
   }
    var sum = 0;
   for (var lb=0; ; lb++)
   {
       var q = document.getElementById('s' + i + 'q' + lb);
       if (q == null   ) break;
       else if (  isNaN1(q.value))continue;
       sum += parseFloat(q.value); 
   }
    document.getElementById('scale' + i).innerHTML  = onedeciaml(sum);
  document.getElementById('scale' ).innerHTML  = onedeciaml(sum);
}

function   varyscore(p,i, la)
{
   needsave = true;
   window.onbeforeunload = beforeclose;
   document.getElementById('sendbtn').disabled = false;
   var qa = document.getElementById('q' + i + 'q' + la);
   var g = document.getElementById('g' + i + 'q' + la);
   var s = document.getElementById('s' + i + 'q' + la);
   var gv = parseFloat(g.value);
   var sv = parseFloat(s.value);
  
   if (typeof(i)=='number' &&  (isNaN1(g.value) || gv< 0 || gv> sv))
   {
           myprompt(g.value +  " invalid");
           return;
   }
   var sum = 0;
   for (var lb=0; ; lb++)
   {
       var q = document.getElementById('g' + i + 'q' + lb);
       if ( q == null)  break;
       if (  isNaN1(q.value)) continue;
       sum += parseFloat(q.value); 
   }
   document.getElementById('score' + i).value = onedeciaml(sum);
  
   sum=0.0;
   for (var j=0; j <N; j++)
   {
       var q = document.getElementById('score' + j);
       if ( q == null ) break;
       if (   isNaN1(q.value)) continue;
       sum += parseFloat(q.value); 
   }
   document.getElementById('average' ).innerHTML = onedeciaml(sum/N);
}
function onedeciaml(s)
{
    var s10 = ('' + Math.round(10*s)).replace(/\..*$/,'');
    if (s10.length == 1) s10 = '0' + s10;
    s10 = s10.replace(/(.)$/, ".$1");
    return s10;
} 
function displaytext(ta,evt,j)
{
  calvposition();
 var e = evt? evt : window.event;
 if(!e) return true;
 var key = 0;
 if (e.keyCode)
 {
     key = e.keyCode;
 } // for moz/fb, if keyCode==0 use 'which'
 else if (typeof(e.which)!= 'undefined')
 {
     key = e.which;
 }
  
 if (key == 36 || key==62)
 {
     var p = caretPos( ta) ;
     var str = '';
     var ch = String.fromCharCode(key);
     if (p > 0)
        str   = ta.value.substring(0,p) + ch +  ta.value.substring(p);
     else
        str   =   ch +  ta.value.substring(p);
     var fmt=guessFormat(str);
     
     tabeingedited = ta;
     displayit(j,fmt,str);
    
 }
 else if (key == 13)
 {
     
 }
   return true;
 }
 
var tabeingedited;  
function displayit(j, fmt, ss)
{
     if (j>=0)
         fmts[j] = fmt ;
     if (ss==null)
         ss = tabeingedited.value;
      
     ss = addbreak(ss,"1");
     LaTexHTML.deformat(document.getElementById("showarea" + j));
     if (fmt!= 0 || ss.indexOf('[Imagelet') >=0 || ss.indexOf('[' + textmsg[1303]) >=0 || ss.indexOf('\t') >=0 )
     {
         ss = formatstr(ss,fmt);
         if (ss.indexOf('[' + textmsg[1303]) >=0 || ss.indexOf('[Imagelet') >=0)
         {
            var attstr = ResizeUploaded.unzip(ResizeUploaded.attachref.value).replace(/,([0-9]+)@/g, ',100$1@' );
            var hw = new Hwtake('rev','','', attstr, '',fmt);
            addcss2head(0,hw.divs,'1');
            ss = hw.merge(ss).replace(/Imagelet([0-9]+)/g, 'imagelet100$1');
          }
          document.getElementById("showarea" + j).innerHTML =    addbreak1(ss);
     }
     
     if ( fmt  +''=='2')
     {
         LaTexHTML.formatele(document.getElementById("showarea" + j));
     }
}
function displayit1(j, sel)
{
    if ( fmts[j] +''=='2')
     {
         LaTexHTML.deformat(document.getElementById("showarea" + j));
     }
    displayit(j,''+sel.options[sel.selectedIndex].value,  answers[j]);
}

function beforeclose()
{
    
    return   textmsg[791];
}
window.onbeforeunload = (needsave)? beforeclose:null; 
if (document.getElementById('sendbtn')!=null)
document.getElementById('sendbtn').disabled = (!needsave);
function asscore(txt)
{ 
    needsave = true;
    window.onbeforeunload = beforeclose;
    document.getElementById('sendbtn').disabled = false;
    if (isNaN1(txt.value) || parseFloat(txt.value)> scale || parseFloat(txt.value) < 0) 
    {
        myprompt(textmsg[123]); 
        txt.focus(); 
    }
    else 
    {
        var sum = 0;
        var j = 0;
        for (var i=0; i < N; i++)
        {
            var tyt = document.getElementById('score' + i);
            if (txt==tyt) j = i;
            sum += parseFloat(tyt.value);
        }
        sum *= 10/N;
        var avg = '' + (Math.round(sum));
        avg =avg.replace(/\..*$/,'');
         
        if (avg.length == 1) avg = '0' + avg;  
        
        avg = avg.replace(/(.)$/,'.$1');
         
        document.getElementById('average').innerHTML = avg;
        if (sformat == 4)
        {
            if (parseFloat(txt.value.replace(/[^0-9]/g,''))>0.0)
            {
                document.getElementById('commenttd'+j).innerHTML = "<span style=\"color:green;font-size:24px\">&check;</span>"; 
            }
            else
            {
                document.getElementById('commenttd'+j).innerHTML = "<span style=\"color:red;font-size:24px\">&cross;</span>";
            }
        }
        closeprompt();
    }
    if (!byquestion)
    {
        var sid = txt.id.replace(/[^0-9]+/,'');
        var tt = document.getElementById("g" + sid + "q0");
      
        if (tt!=null) tt.value = txt.value;
    }
}
 
function getsubmitted(i)
{
    document.getElementById('comment' + i).value = submitted[i];
}

function sendall()
{
    
}
var thissend = '';
function send(btn)
{
     
    var assess = '';
    thissend = '';
    for (var i=0; i < N; i++)
    {
        var stxt =  document.getElementById('score' + i);
        var ctxt =  document.getElementById('comment' + i);
        var feed =  document.getElementById('feedback' + i);
        var commen = '';  if (ctxt!=null) commen = ctxt.value;
        
        var scor = stxt.value;
        if (scor.replace(/ /g,'')=='')scor = '-1';
        if (!byquestion)
        {
            if (assess!='') assess += ";";
            thissend += "," + sids[i];
            
            assess += sids[i] + ",@," + scor + ",'" +  sumass(i).replace(/'/g,"''") + "'";
            if (forfeedback)
            {
                feed.value = feed.value.replace(/#/g,'').replace(/'/g,'');
                assess += ",'" + feed.value  + "'";
            }
        }
        else
        {
            
            if (commen!=mat[i][13] || parseFloat(scor)!= parseFloat(scores[i]) )
            {
               if (assess!='') assess += ";";
               thissend += "," + sids[i];
               assess += sids[i] + ","  + scale + "," + scor + ",'" + commen.replace(/'/g,"''") + "'";
               if (forfeedback)
               {
                   markdone(feed);
                   assess += ",'" + feed.value.replace(/'/g,'') + "'";
               }
            }
        }
    }
    if (!byquestion && isinstructor)
    {
        var tt = sumass('');
        if (tt != '')
        {
        assess +=  ";,,,'" + tt.replace(/'/g,"''") + "'"; 
        thissend += ",q";
        }
    } 
   
    if (assess != '')
    {
        var sents = thissend.substring(1).split(/,/);
        var heads = textmsg[1866].split(/@/);
        var tt = textmsg[86] + "<table id=senttbl align=center style=\"margin-top:5px;border-radius:3px;border:1px #ddcc99 solid;border-collapse:collapse\" cellpadding=4><tr ><td width=150 style=\"background:linear-gradient(to bottom," + BBGCOLOR + "," + TBGCOLOR+ ")\">" + heads[0] + "</td><td align=center style=\"background:linear-gradient(to bottom," + BBGCOLOR + "," + TBGCOLOR+ ")\" width=150>" + heads[1] + "</td>";
        for (let j=0; j < 3; j++)
            tt += "<td width=10 rowspan=" + (Math.ceil(sents.length/4.0) + 1) + "></td><td width=150 style=\"background:linear-gradient(to bottom," + BBGCOLOR + "," + TBGCOLOR+ ")\"><nobr>" + heads[0] + "</nobr></td><td align=center style=\"background:linear-gradient(to bottom," + BBGCOLOR + "," + TBGCOLOR+ ")\" width=150><nobr>" + heads[1] + "</nobr></td>";
        tt += "</tr>";
        for (var i=0; i < sents.length; i++)
        {    
            if (i%4 == 0) tt += "<tr>";
            tt += "<td bgcolor=" + TBGCOLOR +">" + sents[i] + "</td><td  bgcolor=" + TBGCOLOR +" id=saved" + sents[i] + " align=center></td>";
            if (i%4 == 3) tt += "</tr>";
        }
        if (sents.length%4 > 0)
        for (let j=0; j < 4 - sents.length%4; j++)
        {
            tt += "<td bgcolor=" + TBGCOLOR +"></td><td  bgcolor=" + TBGCOLOR +"  align=center></td>";
        }
        tt += "</tr>";
        myprompt(tt + "</table>",null,null,textmsg[67]);
        var nms = ['subdb','securitytoken', 'orgnum','assignname','sessionname','course','questionnum','Semester','assess'];
        var vls = [ subdb,securitytoken, orgnum,assignname,sessionname,course,questionnum,semester, assess];
        postopen('gradingQuestion.jsp',nms,vls,    "w" + tstmp);
    }
    else
    {
        myprompt('No change');
    }
}
function isdigit(c)
{
    return "0123456789".includes(c);
}
function markdone(fd)
{
    let is = fd.value;
    let fs = is.split(/\/\//);
    let nl = fs.length;
    if (nl === 2) is = fs[0];
     
    let j = 0,i;
    let nustr = '' +questionnum;
    while(j < is.length)
    {
        i = is.indexOf(nustr,j);
        if (i === -1) return;
        if (i>0 && isdigit(is.charAt(i-1)) || i+nustr.length < is.length && isdigit(is.charAt(i+nustr.length)))
            j = i+1;
        else break;
    }
    let q = is.substring(0,i) + is.substring(i+nustr.length);
    if (nl===2)
    {
       is = fd.value = q + "//" +  fs[1] + "," + questionnum; 
    }
    else 
       is = fd.value = q + "//" + questionnum;
    let k = is.indexOf('//');
    let f = is.substring(0,k);
    if (f.replace(/[0-9]/,'') === f)
        fd.value = is.substring(k+2);
    fd.value = fd.value.replace(/#,[ ]*/,'#').replace(/,[ ]*,/,',').replace(/,[ ]*\//,'/');
}
function sumass(i)
{
   var str = '';
   for (var la=0; ; la++)
   {
       var qq = document.getElementById('q' + i + 'q' + la);
       var sq = document.getElementById('s' + i + 'q' + la);
       if (qq==null ||  isNaN1(sq.value)) break;
       
       var gq = document.getElementById('g' + i + 'q' + la);
       if (str!='') str += ";";
       str +=   qq.value + "," + sq.value + "," + gq.value + ",";
       
       if (typeof(i) == 'number' && la == 0) 
       {
           var cmi = document.getElementById('comment' + i);
           str += "|" + cmi.value.replace(/\|/g, "||") + "|";
       }
       else str += "||";
   }
   return str;
}
function syn(sidstr, j, missed)
{
    needsave = false;
    window.onbeforeunload = null;
    document.getElementById('sendbtn').disabled = (missed==''?true:false);
    var alls = "";
    try{document.body.removeChild(document.subfollo);}catch(e){ }
    if (j==null) 
    {
        if (sidstr!='')
            myprompt(sidstr);
        return;
    }
    var ss = thissend.substring(1).split(/,/);
    for (var i=0; i < ss.length; i++)
    {
        if (sidstr.indexOf("," + ss[i] + ",") < 0)
        {
            alls += "," + ss[i];
            var rec = document.getElementById('saved' + ss[i]);
            if (rec!=null){ rec.innerHTML = "&cross;";
            rec.style.color = 'red';}
            continue;
        }
        var commen = '';
        var ctxt = document.getElementById('comment' + i);
        if (ctxt!=null) commen = ctxt.value;
        var scor = document.getElementById('score' + i).value;
        scores[i] = scor;
        
        mat[i][13]=commen; 
        rec = document.getElementById('saved' + ss[i]);
        if (rec!=null){ rec.innerHTML = "&check;";
         rec.style.color = 'green';}
    }   
    
     
    if (alls!='')
    {
        var ctxt = document.getElementById('senttbl');
        var r = ctxt.insertRow(-1); var c = r.insertCell(-1); c.colSpan = 11;
        c.style.color = 'red';
        c.style.backgroundColor = DBGCOLOR;
        c.innerHTML = textmsg[1866].split(/@/)[2]; 
    }
   
}
function toclass(i)
{
    var s = document.getElementById('comment' + i).value;
    for (var j=0; j < N; j++)
    {
        if (i!=j)
        {
            if (!pictureway)
                document.getElementById('comment' + j).value = s;
            else
            {
                var x = JSON.parse(s);
                var y = mat[i][11].replace(/@[^,]+,/g,",").replace(/[0-9]+,/g,'').replace(/,$/,'').split(/,/);
                var z = mat[j][11].replace(/@[^,]+,/g,",").replace(/[0-9]+,/g,'').replace(/,$/,'').split(/,/);
                var t = [];
                for (var k=0; k < x.length; k++)
                {
                    var l=0; for (; l < y.length; l++) 
                        if (y[l] == x[k].f) break;
                    if (l >= z.length)break;
                    t[t.length] = {f:z[l], x:x[k].x, y:x[k].y,c:x[k].c};
                }
                document.getElementById('comment' + j).value = JSON.stringify(t);
            }
        }
    }
}
let selway = null;
function toquestion(k)
{
    if (forfeedback)
    {
        if (selway == null)  selway='loadfeedback';
        myprompt(flabels[3] + "<br><input name=selway onclick=\"javascript:selway='loadall';\" type=radio value=0 " + ( selway=='loadfeedback'?'':'checked') + ">" + flabels[4] + "<br><input type=radio  name=selway onclick=\"javascript:selway='loadfeedback';\" value=1  " + ( selway!='loadfeedback'?'':'checked') + ">" + flabels[5],null,"if(v)loadselected(" + k + ")");
        let w = promptwin.getElementsByTagName('table')[0].rows[1].cells[1];
        w = w.getElementsByTagName('table')[0].rows[2].cells[0];
        w = w.getElementsByTagName('table')[0].rows[0].cells[0];
        w = w.getElementsByTagName('input');
        w[0].value =  textmsg[1871].split(/@/)[1];
        w[1].value =  textmsg[18];
    }
    else 
    {   
        selway='loadall';
        loadselected(k);
    } 
}
function loadselected(k)
{
    var nms = ['subdb','securitytoken', 'orgnum','assignname','sessionname','course','questionnum','Semester','loadall'];
    var vls = [ subdb,securitytoken, orgnum,assignname,sessionname,course,k,semester,loadall];
    if (selway!='loadall'){nms.push('feed'); vls.push('1');}
    postopen('gradingQuestion.jsp',nms,vls,  "_self");
}
function enableass(btn)
{
    var nms = ['subdb','securitytoken', 'orgnum','assignname','sessionname','course','shortone','Semester' ];
    var vls = [ subdb,securitytoken, orgnum,assignname,sessionname,course,'0', semester ];
    postopen('gradingQuestion.jsp',nms,vls,  "_self");
}
function changefmt(sel,i)
{
    if (typeof(i)=='number' && mat[i][9] =='6')
    {
        sel.selectedIndex = 3;
        return;
    }
    var showans = document.getElementById('showans' + i);
    if (typeof(i)=='number' && sel.selectedIndex == 4)
    {
        if (fmts[i] == '2')
        {
           LaTexHTML.formatele(showans);
        }
        showans.innerHTML = formatstr(submitted[i].replace(/\t/g, '    '), fmts[i]); 
        sel.selectedIndex = parseInt(fmts[i]); 
        var nms = ['subdb','securitytoken', 'orgnum','sid', 'assignname','sessionname','course','questionnum','Semester','format' ];
        var vls = [ subdb,securitytoken, orgnum,    sids[i],assignname,sessionname,course,questionnum,semester, 5 ];
        postopen('gradingQuestion.jsp',nms,vls,    "w" + tstmp);
        return;
    }
    var fmt = sel.options[sel.selectedIndex].value;
    
    if (typeof(i)!='number' && i==null)
    {
        var nms = ['subdb','securitytoken', 'orgnum', 'assignname','sessionname','course','questionnum','Semester','format', 'loadall'];
        var vls = [ subdb,securitytoken, orgnum,    assignname,sessionname,course,questionnum,semester, fmt, loadall];
        postopen('gradingQuestion.jsp',nms,vls,    "_self" );
        return;
    }
    
    
    if (fmt == '2')
    {
        showans.innerHTML = formatstr(submitted[i], '2'); 
        LaTexHTML.formatele(showans);
    }
    else if (fmts[i] == '2' && fmt=='1')
    {
        LaTexHTML.deformat(showans);
        showans.innerHTML = formatstr(submitted[i], '1'); 
    }
    else if (fmts[i] == '0' && fmt=='1')
    {
         showans.innerHTML = formatstr(submitted[i], '1'); 
    }
    
    else if (fmts[i] == '1' && fmt=='0')
    {
        showans.innerHTML = formatstr(submitted[i], '0'); 
    }
    else if (fmts[i] == '2' && fmt=='0')
    {
        LaTexHTML.deformat(showans);
        showans.innerHTML = formatstr(submitted[i], '0'); 
    }
    var nms = ['subdb','securitytoken', 'orgnum','sid', 'assignname','sessionname','course','questionnum','Semester','format' ];
    var vls = [ subdb,securitytoken, orgnum,    sids[i],assignname,sessionname,course,questionnum,semester, fmt ];
    postopen('gradingQuestion.jsp',nms,vls,    "w" + tstmp);
    
}

function loadAll()
{
    loadall = !loadall;
    var nms = ['subdb','securitytoken', 'orgnum','assignname','sessionname','course','questionnum','Semester','loadall'];
    var vls = [ subdb,securitytoken, orgnum,assignname,sessionname,course,questionnum,semester,loadall];
    postopen('gradingQuestion.jsp',nms,vls,  "_self");
}
buildactmenu = function()
{
    recurainput(document.getElementById('butbase'));
   // recurainput(document.getElementById('numqstr'));
}
function genAttachnum(str)
{
   return ResizeUploaded.unzip(str).replace(/[^,]/g,'').length;
    
}
function updatequestion(ta,byquestion)
{
    var nms = ['subdb','securitytoken', 'orgnum','assignname','sessionname','course','questionnum','Semester','questiontext'];
    var vls = [ subdb,securitytoken, orgnum,assignname,sessionname,course,(byquestion?questionnum:10000),semester, ta.value];
    postopen('gradingQuestion.jsp',nms,vls,    "w" + tstmp); 
}
function updateanswer(ta,byquestion)
{
    originalanswer = ta.value;
    onstart();
    var nms = ['subdb','securitytoken', 'orgnum','assignname','sessionname','course','questionnum','Semester','answertext'];
    var vls = [ subdb,securitytoken, orgnum,assignname,sessionname,course,(byquestion?questionnum:10000),semester, ta.value];
    postopen('gradingQuestion.jsp',nms,vls,    "w" + tstmp); 
}

function selecttext(txt)
{
    if (typeof(txt.select)!='undefined')
        txt.select();
    else if (typeof(txt.setSelectionRange)!='undefined')
        txt.setSelectionRange(0, txt.value.length);
}

function picktools()
{
    
    myprompt("<iframe name=datatabl width=400 height=550 />");
    var nms = ['subdb','securitytoken', 'rdap','exbut','wording','course','coursetitle'];
    var vls = [ subdb,securitytoken, 'serviceforgrade','cp','',course, course];
    postopen('DataTable',nms,vls, "datatabl"); 
 
}

function initcomments()
{
    for (var i= 0; i < N; i++)
    {
        if (document.getElementById("comment" + i)!=null)
        document.getElementById("comment" + i).innerHTML = mat[i][13];
    }
}
 
 
 
function changestatus(s,t)
{
   
      if (t.parentNode.cells[0].innerHTML.replace(/ /g,'')!='' )return;
      var nms = ['subdb','securitytoken', 'orgnum','assignname','sessionname','course','questionnum','Semester','status'];
      var vls = [ subdb,securitytoken, orgnum,assignname,sessionname,course,questionnum,semester, s];
      postopen('gradingQuestion.jsp',nms,vls,   "w" + tstmp);
}
function changestatus2(i)
{
    var x = document.getElementById("status" + i); x.innerHTML = '&check;';
    x.parentNode.cells[1].style.color='black';
    var j = (i==3?2:3); 
    x = document.getElementById("status" + j); x.innerHTML = '';
    x.parentNode.cells[1].style.color='blue';
} 
var onloadbeforegradingquestionjs  = null;
if (typeof window.onload == 'function')
onloadbeforegradingquestionjs= window.onload;
window.onload = function()
{
    if (onloadbeforegradingquestionjs!=null)
        onloadbeforegradingquestionjs();
    
    if (scoreway == 'mouse')
    {
        scoreway = 'key';
        switchg();
    }
   
    var avgtd = document.getElementById('average');
    if (avgtd!=null)  avgtd.innerHTML = avgpoints;
    initcomments();
    if (window!=parent && parent.frames[1]==window && parent.frames[0].demokeyframen>0)
    {
        demospeedup = parent.frames[0].demospeedup;
        demo();
    }
    else if (window == parent)
    {
        var x = document.createElement('input');
        x.className = 'BlueButton';
        x.type = "button";
        x.style.width= Math.round(charwidthrate()*font_size) + 'px';
        x.style.overflow = 'display';
        x.value = textmsg[1839];
        x.style.margin = "0px 0px 0px 0px";
        x.onclick = demo;
        document.getElementById('numqstr1').appendChild(x);
    }
    calvposition();
    let i = 0; let f; let alln = new Array();
    while ((f = document.getElementById('feedback' + i))!==null)
    {
        let w = f.value.replace(/\/\/.*$/,'').split(/[^0-9]+/); 
        for (let j of w) if (!alln.includes(j)) alln.push(j);
        let tbl = null;
        let ss = f.value.replace(/\/\/.*$/,'');
        let ss1 = '';
        for (let jj=0; jj < ss.length; jj++)
        {
            if (isdigit(ss.charAt(jj)))ss1 += ss.charAt(jj);
            else ss1 += '@';
        }
        if (forfeedback&& ('@'+ ss1 + '@').includes('@' + questionnum +'@') === false)
        {
            let  tw = f.parentNode.parentNode;
            if (tbl===null) tbl = tw.parentNode.parentNode;let j = 0;
            for (j=1; j < tbl.rows.length && tbl.rows[j]!==tw;j++);
            for (let k=0; k < 3; k++)
            {
                for (let z = 0; z < tbl.rows[j+k].cells.length; z++)
                  tbl.rows[j+k].cells[z].style.backgroundColor = '#555555';
            }
        }
        document.getElementById('darrow'+i).value = flabels[0];
        i++;
    }
    if (forfeedback) 
    {
        let tbl = document.getElementById('numqstr');
        let n = tbl.rows[0].cells.length-1;
        while( n >= 0)
        {
            let ss = tbl.rows[0].cells[n].innerHTML;
            let ns = ss.replace(/<[^>]+>/g,'');

            if (!alln.includes(ns) && ns!==questionnum )
               tbl.rows[0].deleteCell(n); 
           n--;
        }
        tbl = document.getElementById('numqstr1');
         n = tbl.rows[0].cells.length-1;
        while( n >= 0)
        {
            let ss = tbl.rows[0].cells[n].innerHTML;
            let ns = ss.replace(/<[^>]+>/g,'');

            if (!alln.includes(ns) && ns!==questionnum )
               tbl.rows[0].deleteCell(n); 
           n--;
        }
    }
   // humangrade();
    //document.getElementsByTagName('body')[0].style.backgroundColor = IBGCOLOR;
    //document.body.style.backgroundColor = IBGCOLOR; 
};
var imgnum = 0;
var fileimages = new Array();
var camerawidth;
var imagebutwidth = -1; 
var activepic = [];
function loadclose(dv, code,filename)
{
    var img = document.getElementById(dv.id.replace(/@/,'_'));
    var sidi = dv.id.split(/@/);
    var sid = parseInt(sidi[0]);
    var ii = parseInt(sidi[1]);
   
    clearcommentdv(sid);
    if (dv.innerHTML.indexOf("<img") < 0)
    {   
         if (activepic[sid] == null || activepic[sid] == '')
           activepic[sid] = "," + filename + ",";
         else
           activepic[sid] +=  filename + ",";
        var imgs = fileimages[sid];
        if (imgs == null)
        {
            imgs = [];
            imgs[ii] = {f:filename,code:code};
            fileimages[sid] = imgs;
        }
        else
        {
            imgs[ii] = {f:filename,code:code};
        }
        img.onError = function(){
            this.src = "image/clip.png";
            this.onclick = null;
            this.width = 30;
            var dv = document.getElementById(this.id.replace(/_/,'@'));
            dv.innerHTML = dv.innerHTML.replace(/<!\-\-/,'').replace(/\-\->/,'');
            dv.style.width = null;
            dv.style.height = null;
            dv.style.position = "static";
            dv.style.backgroundImage = null;
            dv.style.left = null;
        }
        img.onload = function(){showannotation(this);}
        img.src = "FileOperation?did=" + code;
        img.onclick = function(){ commenting(this);}
        img.alt = filename;
        img.width = camerawidth = document.getElementById('commenttd' + sid).offsetWidth -5;
        document.getElementById('comment'+sid).style.width = (camerawidth-90) + 'px';
        dv.innerHTML =  '<img src=image/close.gif style=border:0px;margin:0px >';
        dv.style.zIndex = '3';
        dv.style.width ='18px';
        dv.style.position = "absolute";
        dv.style.height = '18px';
        dv.style.left = '100px'; 
        dv.style.top = '200px'; 
    }
    else
    {
        dv.innerHTML = fileimages[sid][ii].f  + "&nbsp;&nbsp;";
        var kk = activepic[sid].indexOf("," + fileimages[sid][ii].f + ",");
        if (kk == 0) activepic[sid] = activepic[sid].substring(fileimages[sid][ii].f.length+1);
        else if (kk > 0)
           activepic[sid] = activepic[sid].substring(0, kk-1) + activepic[sid].substring(kk+fileimages[sid][ii].f.length+2); 
        fileimages[sid][ii] = null;
        img.onclick = null;
        img.src = "image/clip.png" ;
        img.width = 30;
        dv.style.width = null;
        dv.style.backgroundImage = null;
        dv.style.position = "static";
    }
}


var picarray = null;
var commentdivs = []; 
 
function showannotation(img)
{
   var sids = img.id.split(/_/);
   var sid = parseInt(sids[0]);
   
   var ii = parseInt(sids[1]);
   var dv = document.getElementById(img.id.replace(/_/,'@')); 
   var kk=0;
   var cxy ;
   while (true)
   {
       var xx  = document.getElementById(sid + '_' + kk);
       if (xx == null) break;
       var yy =  document.getElementById(sid + '@' + kk);
       if (yy == null){kk++; continue;}
       cxy = findPositionnoScrolling(xx);
       yy.style.top = cxy[1] + 'px';
       yy.style.left = cxy[0] + 'px';
       yy.style.zIndex = '3';
       kk++;
   }
    
   //img.alt = fileimages[sid][ii].f;
   fromjson(sid);
   calvposition();
   
}
function ignore(i)
{
    if (forfeedback)
    {
       markdone(document.getElementById('feedback' + i));
    }
}
function fromjson(sid)
{
    clearcommentdv(sid);
    var comments = null;
    var s = document.getElementById('comment' + sid).value;
    if (s=='') 
    {
        s = mat[sid][13];
    }
  
    try{comments = JSON.parse(s); }catch(e){
       myprompt(s + "'s format is incorrect"); 
    }
    
    var commentdiv = [];
    var ii = 0;
    while (true)
    {
        var imageobj = document.getElementById(sid + '_' + ii);
        if (imageobj==null ) break;

        if (imageobj.src.indexOf('image/clip.png')>=0)
        {
            ii++; continue;
        }
        var kk = -1;
        if (comments != null)
        for (var i=0; i < comments.length; i++)
        {
            var y = fileimages[sid][ii];
            if (y == null) continue;
            y = y.f;
            if (comments[i].f != y)
                continue;
 
            var fmt = (typeof(guessFormat)!='undefined')? guessFormat(comments[i].c):0;
            var dv = document.createElement('div');
            kk++;
            var cxy = findPositionnoScrolling(imageobj);
            dv.style = 'color:red;position:absolute;left:' + (cxy[0] + comments[i].x*camerawidth) + 'px;top:' + (cxy[1] + comments[i].y*camerawidth) + 'px';
            dv.innerHTML = formatstr(comments[i].c,fmt);
            dv.onclick = function(){commenting(this);}
            imageobj.parentNode.appendChild(dv); 
            if (fmt==2)LaTexHTML.formatele(dv);
            commentdiv[commentdiv.length] = {f:comments[i].f,x:(comments[i].x*camerawidth),y:(comments[i].y*camerawidth),c:comments[i].c,div:dv,qn:questionnum};  
        }
        ii++;
    }
    commentdivs[sid] = commentdiv;
 
}
var actsid,acti,acttext;
 
function commenting(imageobj)
{
   var commenteditor = document.getElementById('commenteditor');
    if (commenteditor !=null)
    {
        var ta = commenteditor.getElementsByTagName('textarea')[0];
      
        var z = ('' + ta.onblur).replace(/.*,/,'').replace(/.$/,'').split(/,/);
        setcomment(ta,z[0],z[1],z[2],z[3],z[4]);
    }
    var commentdiv = null;
    contenttd = imageobj.parentNode;
    var di = -1;
    var tx = '';
    var sid,ii;
   if (imageobj.tagName.toLowerCase() == 'img')
   {
      var sids = imageobj.id.split(/_/);
      sid = parseInt(sids[0]);
      ii = parseInt(sids[1]);
      commentdiv = commentdivs[sid];
      if (commentdiv==null) commentdivs[sid] = commentdiv = [];
     
   }
   else
   {
       sid = parseInt(contenttd.id.replace(/[^0-9]+/,''));
       commentdiv = commentdivs[sid];
       if (commentdiv==null) return; 
       for (di=0; di < commentdiv.length; di++)
       {
           if (commentdiv[di].div == imageobj)
               break;
       }
       if (di == commentdiv.length) return;
       LaTexHTML.deformat(commentdiv[di].div);
       commentdiv[di].div.innerHTML = '';
       tx = commentdiv[di].c;
       var imgn = commentdiv[di].f;
       var kk = 0; var ims = contenttd.getElementsByTagName('img');
       for (kk=0; kk < ims.length; kk++)
       {
           if (ims[kk].alt == imgn)
               break;
       }
       if (kk == ims.length) return;
       imageobj = ims[kk];
       var sids = imageobj.id.split(/_/);
       ii = parseInt(sids[1]);
   }
     
    if (browserstr.indexOf('MSIE')>-1)
    {
         myHintx = event.clientX + document.body.scrollLeft;
         myHinty = event.clientY + document.body.scrollTop;
    }
    else
    {
          myHintx = event.pageX;
          myHinty = event.pageY;
    }
    var cxy = findPositionnoScrolling(imageobj);
    var xy = [myHintx-cxy[0],myHinty-cxy[1]];
    
    var dv = document.createElement('div');
    dv.id = 'commenteditor';
    if (di == -1)
    {
        dv.style.cssText = 'z-index:100;position:absolute;left:' + (myHintx - 2)  + 'px;top:' + (myHinty-2) + 'px;';
    }
    else 
    {
        dv.style.cssText = 'z-index:100;position:absolute;left:' + commentdiv[di].div.style.left  + ';top:' + commentdiv[di].div.style.top ;
    }
    dv.innerHTML = '<textarea  rows=2 cols=30 style=color:red keypress=growarea(event,this) onblur=setcomment(this,' + xy[0] + ',' + xy[1] + ','+ di + ',' + sid + ',' + ii +  ') >' + tx.replace(/<.textarea>/g, '<\\.textarea>') + '</textarea>';
    document.body.appendChild(dv);
    dv.getElementsByTagName('textarea')[0].focus();
     
}
var numimgs = 0;
function growarea(evt,ta)
{
    var ts = ta.value.split(/\n/);
    var m = 0;
    for (var i=0; i < ts.length; i++)
    {
        if (ts[i].length > m) m = ts[i].length; 
    }
    if (m > ta.cols - 2) ta.cols = ta.cols + 1;
    if (ts.length > ts.rows - 1) ta.rows = ta.rows + 1;
}

function clearcommentdv(sid)
{
   var commentdiv = commentdivs[sid];
   if (commentdiv!=null)
   for (var i=0; i < commentdiv.length; i++)
    { 
        if (commentdiv[i]==null) continue;
        var dv = commentdiv[i].div;
        if (dv!=null)
            dv.parentNode.removeChild(dv);
    }
    commentdiv = [];
    commentdivs[sid] = commentdiv;
}

function tojson(sid)
{
    var commentdiv = commentdivs[sid];
    if (commentdiv==null || commentdiv.length == 0) return;
    var comments = [];
    for (var i=0; i < commentdiv.length; i++)
    {
        if (commentdiv[i] == null) continue;
        comments[comments.length] = {f:commentdiv[i].f,x:(commentdiv[i].x/camerawidth).toFixed(3), y:(commentdiv[i].y/camerawidth).toFixed(3), c:commentdiv[i].c};
    }
    var exist = null;
    try{exist = JSON.parse(document.getElementById('comment'+sid).value);}catch(e){}
    if (exist!=null)
    for (var j=0; j < exist.length; j++)
    {
        if (activepic[sid]==null || activepic[sid].indexOf("," + exist[j].f +",") < 0)
            comments[comments.length] =  exist[j];
    }
    document.getElementById('comment'+sid).value = JSON.stringify(comments);
    document.getElementById('sendbtn').disabled = false;
}
function setcomment(ta,x,y,i,sid,ii)
{
    
    var imageobj = document.getElementById(sid + '_' + ii);
    var commentdiv = commentdivs[sid];
    if (i == -1)
    {
       if (ta.value.replace(/ /g,'') != '')
       {
           var fmt = (typeof(guessFormat)!='undefined')? guessFormat(ta.value):0;
           var dv = document.createElement('div');
           var cxy = findPositionnoScrolling(imageobj);
           dv.style = 'color:red;position:absolute;left:' + (cxy[0] + x) + 'px;top:' + (cxy[1] + y) + 'px';
           dv.innerHTML = formatstr(ta.value,fmt);
           imageobj.parentNode.appendChild(dv);
           LaTexHTML.formatele(dv);
           dv.onclick = function(){commenting(this);}
           commentdiv[commentdiv.length] = {f:fileimages[sid][ii].f,x:x,y:y,c:ta.value,div:dv};
       }
    }
    else if (ta.value == '')
    {
        imageobj.parentNode.removeChild(commentdiv[i].div);
        commentdiv.splice(i,1);
        
    }
    else 
    {
        commentdiv[i].c = ta.value;
        var fmt = (typeof(guessFormat)!='undefined')? guessFormat(ta.value):0;
        var dv = commentdiv[i].div;
        dv.innerHTML = formatstr(ta.value,fmt);
        if (fmt==2)LaTexHTML.formatele(dv);
    }
    document.body.removeChild(ta.parentNode);
    tojson(sid);
}
var camerawidth = 800;
 
var vposition = [];
function calvposition()
{
    for (var i=0; i < N; i++)
    {
        var t = document.getElementById('infobox' + i);
        if (t == null) continue;
        t = t.parentNode;
        var xy = findPositionnoScrolling(t);
        vposition[i] = xy[1];
        if (i==N-1) vposition[N] = vposition[i] + t.offsetHeight;
       
    }
     
}
window.onscroll = function()
{
   /* var h = 0;
    if (typeof(document.body.scrollTop) != 'undefined')
        h = document.body.scrollTop;
    if (h < vposition[0] && typeof(document.documentElement.scrollTop) != 'undefined')
        h = document.documentElement.scrollTop;
   
    if (h < vposition[0]) 
    {
      
        return;
    }
    var i =0; var j = N;
    for (; i < N; i++)
    if (vposition[i] < h &&  h <= vposition[i+1])
    {
        j= i;
        break;
       
    }
    
    i = j;
    
    if (i == N) 
    {
        
        return;
    }
     
    var t = document.getElementById('infobox' + i);
    if (t==null) 
    {
      
        return;
    }
   
    var y = h - vposition[i];
    if (y < 0) y = 0;
    
    if (y + t.offsetHeight > vposition[i+1] - vposition[i])
        y = vposition[i+1] - vposition[i] - t.offsetHeight;
    
    t.style.marginTop = y+ 'px';
      
    */ 
}
function editfeedback(div)
{
    var txt = div.innerHTML;
    if (txt.indexOf("<textarea ")>=0 ) return;
    div.style.borderWidth = '0px';
    var str =  "<textarea  style=\"border:1px #555 solid;width:" +
            div.offsetWidth + "px;height:60px;\" onblur=setfeedback(this)  >" + txt + "</textarea>";
    //div.getElementsByTagName('textarea')[0].focus();
   
    div.innerHTML = str;

}
function updatefmt1(sel, i)
{
    
}
function setfeedback(tx)
{
    tx.parentNode.style.borderWidth = '1px';
    tx.parentNode.innerHTML = tx.value;
    
}
var scoreway = localStorage['scoreway'];
 
var switchg = function()
    {
        if ( scoreway == null ||  scoreway == 'key')
            scoreway = 'mouse';
        else
           scoreway = 'key';
       
        localStorage['scoreway'] = (scoreway); 
        
        for (var i=0; i < numRows; i++)
        {
            
            var td = document.getElementById('scoretd'+i);
            if (scoreway == 'key') 
            {
                td.innerHTML = makebox(i) + darr(i);
            }
            else
            {
                td.innerHTML =  makeradio(i) + darr(i);
            }
        }
    }
var makeradio = function(i)
    {
            var str = '<input name=hiddenscore'  + i +' id=score' + i + ' type=hidden value="' +   scores[i] + '" >';
            for (var k=0; k <= scale; k++)
            {
                var sel = (scores[i] == "" + k? "checked":"");
                var clr = (scores[i] == "" + k? "red":"black");
                str += "<input type=radio name=scoresel" + i  + "  id=scoreradio" + i  + "_" + k + "   onclick=\"selval(" + i + "," + k + ",this);document.getElementById('score" + i + "').value='" + k +"';\"   value=" + k + " " + sel + "><span id=ra" + k + "_" + i +" style=color:" + clr + ";font-weight:700 >" + k + (k < scale?"</span>&nbsp; ":"</span>");
            }
            return  str;
    }

var makebox = function(i)
{
    return "<input name=hiddenscore"  + i + " class=gradeinput id=score" + i + " style=\"text-align:right;background-color:" + 
            viewcolor + ";width:60px\" onfocus=\"selecttext(this)\"  onchange=\"asscore(this)\" onblur=\"propag(" +i + ",this)\" tabindex=" + (i+1) + "  value=\"" + scores[i] + "\" onkeypress=\"return down1(this," + i + ",event)\"> ";
}

var down1 = function(box, i, evt)
{
        var e = evt? evt : window.event;
        if(!e) return true;
        var key = 0;
        if (e.keyCode)
        {
             key = e.keyCode;
        }  
        else if (typeof(e.which)!= 'undefined')
        {
             key = e.which;
        }
       
        if (key == 13 || key == 9)
        {
            down(i, box.parentNode);  
        }
        return true;
}
var darr = function (i)
{
    if (i==N-1) return "";
    return "<input type=button class=GreenButton style=width:" + (font_size*4.5) + "px onclick=\"down(" + i + ",this.parentNode)\" value=\"&darr;\"  >";
}
    
var down = function(i,td)
{
    
    var tr = td.parentNode.parentNode.parentNode;
    
    var h = 0;
    var k = 0;
    while(k < tr.rows.length)
    if (tr.rows[k] == td.parentNode) 
        break;
    else k++;
    
    let k1 = k+3;
    for (; ;k--)
    {
        h += tr.rows[k].offsetHeight;
        if (tr.rows[k].cells[0].className == "s1001" ) break;
    }
    if (k1 < tr.rows.length)
    {
        tmptr = tr.rows[k1].cells[1];
        if (i < numRows)
        {
            window.scrollBy(0, h+20);
            tmptr.style.backgroundColor = '#eeccbb'; 
            setTimeout('tmptr.style.backgroundColor = null', 4000);
        }
    }
}
var tmptr = null;
var selval = function(i, k, ta)
{
        for (var j=0; j <= scale; j++)
        {
            var lbl = document.getElementById('ra' + j + '_' + i);
            if (j == k) 
            {
                lbl.style.color = 'red';
            }
            else
            {
                lbl.style.color = 'black';
            }
        }
        //document.getElemenById('score' + i).value = k;
        //scores[i] = k;
        down(i, document.getElementById('score' + i).parentNode);
        document.getElementById('sendbtn').disabled = false;
}
 
var lscore = new Array();
function onstart()
{
    if (isfillingblank)
    {
        let dis = textmsg[1943].split(/@/)[8];
        let xs = originalanswer===''?(new Array(numOfparts)):originalanswer.replace(/\n/,' \n').split(/\n/);
        let s ='<table  class=outset3   style="border:1px #ddcc99 solid;border-collapse:collapse;border-radius:3px" border=1  cellpadding=4 >';

        for (let i=0; i < numOfparts; i++)
         s += '<tr><td>' + formatstr((typeof xs[i]=== 'undefined' || xs[i]== null)?textmsg[1634]:xs[i], mat[0][21]) + '</td><td  align=center style=color:blue onclick="testsheet.byanswer('+ i + ')" >' + dis + " </td></tr>";

        document.getElementById('referenceans').innerHTML = s + '</table>';
    }
    else 
    {
        let s = originalanswer;
        let sp = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        document.getElementById('referenceans').innerHTML = formatstr(s, mat[0][21]) + sp + '<span  class=outset3  style="border-collapse:collapse;border:1px #ddcc99 solid;border-radius:3px;padding:3px 3px 3px 3px;color:blue"  onclick=testsheet.byanswer(' +(sformat === 4?-2:-3) + ')>' + textmsg[1943].replace(/@.*$/,'') +'</span>';
    }
    document.getElementsByTagName('table')[1].style.backgroundColor = IBGCOLOR;
    document.getElementsByTagName('table')[1].bgColor = IBGCOLOR;
    document.getElementsByTagName('table')[0].parentNode.style.backgroundColor = IBGCOLOR;
    if (numOfparts > 0)
    {
        let oarr = originalanswer.replace(/\n/g,' \n').split(/\n/);
        NR = oarr.length; 
        for (let j=0; j < oarr.length ; j++)
        {
             oarr[j] = oarr[j].replace(/^[ ]+/,'').replace(/[ ]+$/,'');
        }
        var ys = textmsg[1937].split(/@/);
        
        for (let i=0; i < N; i++)
        {
            let hums = null;
            let hum = mat[i][4];
            if (hum.includes("+"))
                hums = hum.split(/\+/);
            else
                hum = null; 
            
            let s ='<table  style="border-color:#ddcc99;border-collapse:collapse;border-radius:3px" border=1  cellpadding=4><tr  style=color:black><td style=background-image:linear-gradient(' + BBGCOLOR+','+TBGCOLOR+ ') >' 
                    + textmsg[1629]+'</td><td  style=background-image:linear-gradient(' + BBGCOLOR+','+TBGCOLOR+ ')>' + textmsg[457]+'</td><td align=right  style=background-image:linear-gradient(' + BBGCOLOR+','+TBGCOLOR+ ')>' + textmsg[1943].split(/@/)[5]+'</td></tr>';
            let submitted = mat[i][6];
            if (submitted == null || submitted.length == 0 || submitted == textmsg[1865] )
            {
                submitted = originalanswer.replace(/[^\n]/g,'');
            }
            let arr = null;
            if (submitted.includes('<br>')) arr = submitted.replace(/<br>$/,'').split(/<br>/);
            else arr = submitted.replace(/\n/g, ' \n').split(/\n/);
            let sm = 0;
            lscore[i] = 0;
          
            for (let j=0; j < numOfparts; j++)
            {
                let vs; 
                if (hum!==null && hums[j] !== null && !isNaN1(hums[j]) )
               {    
                    vs = hums[j];
                    lscore[i] += parseFloat(vs);
                }
                else if (arr[j] == null || arr[j].replace(/ /g,'') ==='')
                {
                    arr[j] = '';
                    vs = '0';
                }
                else 
                {  
                    let U = testsheet.convert2(arr[j],j);
                    let V = testsheet.convert2(oarr[j],j);
                    if (testsheet.thesame(U,V))
                    {
                        vs = ('' +(scale/numOfparts).toFixed(2)).replace(/\.[0]+$/,'').replace(/^[0]*\.[0]*$/,'0').replace(/(\.[0-9])0$/,'$1');
                        sm += 1;
                    }
                   else
                   {
                      let tmp  = similarnum(U,V);
                      if (tmp > 1)
                      {
                        try{if (U!=null && V.length>0) 
                        tmp = similarity(U,V)/V.length; }catch(e){}
                        if (tmp>1) tmp = 1;
                        tmp =   Math.pow(1 - tmp,2/3.0);
                        if (tmp > 0.9 && V!=null && U!=null && U!='' && V.length < 25 && isNaN1(V)) tmp= 1;
                      }
                      sm += tmp;
                      vs  = (''+(tmp*scale/numOfparts).toFixed(2)).replace(/\.*[0]+$/,'').replace(/(\.[0-9])0$/,'$1'); 
                   }
                }
                let p1='', p2=''; 
                let rfmt = mat[i][21];
                
                if (j < arr.length && arr[j]!=null)
                {
                    if (''+sformat === '0' || ''+ sformat === '2')
                    {
                       arr[j] = arr[j].replace(/<([a-z])/ig,'< $1');
                    }
                    p1 = formatstr(arr[j],sformat);
                }
                if (j < oarr.length && oarr[j]!=null)
                {
                    if (''+rfmt=== '0' || ''+rfmt === '2')
                    {
                       oarr[j] = oarr[j].replace(/<([a-z])/ig,'< $1');
                    }
                    p2 = formatstr(oarr[j],rfmt);
                }

                let  ent = makeenter(i,j,vs);
                s += '<tr><td  style=color:purple>' + (arr[j]==null?'':p1) + '</td><td  style=color:green>' + (oarr[j]==null?'':p2) + "</td><td  align=right>" + ent + "</td></tr>\n";
            }
            if (hum==null)
            {
                sm /= numOfparts;  
                lscore[i] = Math.round(sm*scale*10)/10;
                if (scale == 1 && lscore[i]>0.5) 
                    lscore[i] = 1;
            }
            s +="</table>";
            let xx = document.getElementById('fillblank'+i); 
            if (xx!=null){ xx.innerHTML = s; 
                let x1 = xx.parentNode;//.previousSibling;
                x1 = x1.parentNode.cells[0];
                x1.innerHTML = '<b>' + testsheet.words[13] + '</b>';
            }
        }
        if (false  )
        {
           myprompt(ys[2] + "?<br><br>" + textmsg[1922] + "<select id=nd onchange=\"javascript:numdecimals = parseInt(this.options[this.selectedIndex].value)\"><option value=0>0</option><option value=1>1</option><option value=2>2</option></select>" ,null,"if(v)doreplace()");
           promptwin.style.left= '100px';
           var x = document.getElementById('nd'); 
           numdecimals = parseInt(x.options[x.selectedIndex].value); 
        }
     }
}
function retrv(n,j)
{
    if (j===13)
    {
        var ctxt =  document.getElementById('comment' + n);
        var commen = '';  if (ctxt!=null) commen = ctxt.value;
        if (commen.includes(',') || commen.includes('\n'))
            commen = "'" + commen.replace(/'/g,"''") + "'";
        return x = scale + ',' +  document.getElementById('score'+n).value + ',' + commen;
        
    }
    else if (j === 4)
    {
       return document.getElementById('score'+n).value;
    }
    return '';
}
function TestSheet()
{
    this.updateddistinct = true;
    this.holdmyanswer = '';
    this.words = textmsg[1943].split(/@/);
    this.expandsign = '&#8853;';
    
    this.formatDistinct = function(t,fmt)
   {
        let ans = formatstr(t, fmt);
        if (fmt==='1')
        {
             ans = ans.replace(/^[ ]*<tr>/, '').replace(new RegExp("<.tr>[ ]*$"), '').replace(/^[ ]*<td>/, '&lt; td&gt;').replace(new RegExp("<.td>[ ]*$"), '&lt; /td&gt;') ; 
        }
       
        return ans;
     };
     this.displaytxt1= function(ta,evt,j)
    {
         var e = evt? evt : window.event;
         if(!e) return true;
         var key = 0;
         if (e.keyCode)
         {
             key = e.keyCode;
         } // for moz/fb, if keyCode==0 use 'which'
         else if (typeof(e.which)!= 'undefined')
         {
             key = e.which;
         }
         if (key === 13)
         {
            this.setcolor(ta, 'black');
            let id = parseInt(ta.id.substring(1)) ;
            let tt  ;
            for (let n of this.temp[id])
            {
                if (j >= 0)
                   tt = document.getElementById('h' + n + '_' + j);
                else
                   tt = document.getElementById('score' + n  ); 
                 
                tt.value = ta.value;
                this.setcolor(tt, 'black');
            }
            tt  = document.getElementById('e' + (id + 1));
            if (tt==null)
                tt  = document.getElementById('upd' + (j));
            if (tt!= null) 
                tt.focus();
            //else 
            //    this.nextone(j);
            this.hitenter =true;
         }
         return true;

    };
    this.convert2 = function(a,j) 
    {
       if (a == null || a == '') return '';
       if (j === -2)
       {
          a = a.replace(/^[ ]+/,'');
          if (a.length === 0) return '';
          return  a.replace(/^[ ]+/,'').charAt(0).toLowerCase(); 
       }
       a = a.toLowerCase().replace(/^[ ]+/,'').replace(/[ ]+$/,'');
       let s = {'half':2,'third':3, 'fourth':4,'fifth':5, 'sixth':6, 'seventh':7, 'eighth':8, 'ninth':9, 'tenth':10, 'eleventh':11, 'twelfth':12};
       let b = s[a];
       if (b != null) return '1/' + b;
       if (a.replace(/[,|\.|0-9]/g,'') === '' )
       {
           return a.replace(/,/g,'');
       }
       let a1=a;
       if (a.includes('$') || a.includes('\\frac')) 
       {
           a1 = a.replace(/\$/g, '').replace(/([\^|_])([0-9|a-z|A-Z])/g, '$1{$2}'); 
           return this.trimlatex(this.toover(a1)).replace(/ /g,'');
       }
       return a.replace(/ /g,'');
    };
    this.thesame = function(a,b)
    {
        if (a.replace(/[0-9|\.|\/]/g,'') ==='' &&  b.replace(/[0-9|\.|\/]/g,'') ==='' && a!=='' && b!== '')
        {
            if ((a.indexOf('.') >= 0 || b.indexOf('.') >= 0) && (a.indexOf(b) == 0 || b.indexOf(a) == 0))
               return true;
            return eval(a) === eval(b); 
        }
        return a === b;
    };
    this.fracpair = function(x)
    {
        let k = x.indexOf('\\frac');
        if (k === -1) return null;
        let i = x.indexOf('{',k+4),j;
        let count = 1;
        if (i ===-1) return null;
        let f = x.substring(0,k);
        for (j = i+1; j < x.length; j++)
            if (x.charAt(j) === '{') count++;
            else if (x.charAt(j) === '}') { count--; if (count === 0) break;}
        if (j === x.length || x.charAt(j) != '}') return null;    
        let nu = x.substring(i+1,j);
        while ( j <   x.length && (x.charAt(j) === ' '|| x.charAt(j) === '\t' || x.charAt(j) === '\n'))j++;
        if (j === x.length || x.charAt(j) != '{') return null;
        i = j;
        count = 1;
        for (j = i+1; j < x.length; j++)
            if (x.charAt(j) === '{') count++;
            else if (x.charAt(j) === '}') { count--; if (count === 0) break;}
        if (j === x.length || x.charAt(j) != '{') return null;    
        let de = x.substring(i+1,j);
        let r = '';
        if (j + 1< x.length) r = x.substring(j+1);
        return [f, nu,de,r];
    };
    this.toover = function(x)
    {
        let p4 = this.fracpair(x);
        if (p4 == null) return x; 
        let t = p4[0] + '{' + this.toover(p4[1]) + '\over ' + this.toover(p4[2]) + '}' + this.toover(p4[3]);
        return t;
    };
    this.oldj = 0;
    this.instruction = '<nobr>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</nobr><br><ul style="margin:0px 0px 0px 0px;padding-left:25px;">' 
                    +  '<li>'+ this.words[1]+'<li>'+ this.words[2].replace(/\+/,this.expandsign).replace(/blue/g,'black')+'<li>'+ this.words[3]+'<li>'+ this.words[4]  +'<li>'+ this.words[11]  +  '</ul>';
    this.byanswer = function(j)
    { 
        if (typeof j == 'undefined' || j == null)
            j = this.oldj;
        else
            this.oldj = j;
        var rep = {}, fre={}, scr={}, hfmt = {};
        let ans = originalanswer;
        if (j>=0)
        {
            let anss = ans.replace(/\n/g,' \n').split(/\n/);
            if (j < anss.length) 
                ans = anss[j].replace(/[ ]+$/,'');
            else ans = '';
        }
        for (let n=0; n < numRows; n++)
        {
            let score = 0, sol;
            if (j >= 0)
            {
                sol = retrv(n,4); 
                if (sol === null || !sol.includes('+')&& mat[n][4].includes('+')) sol = mat[n][4];
                let sol1 = sol;//.replace(/[0-9]+,[0-9]+,([^,]+),.*$/,'$1');//split(/\n/g,' \n').split(/\n/)[j].replace(/[ ]+$/,);
                //if (sol1 === sol) sol1 = '';
                if (sol1!=='')
                {
                    let y = sol1.replace(/\+/g,' +').split(/\+/)[j];
                    if (y!=null) y = y.replace(/[ ]+$/,'');
                    if  (y!==null && isNaN1(y) === false)
                        score = parseFloat(y);
                }
                else sol = '0';
            }
            else
            {
                let yy = retrv(n,4); if (yy === null) yy = mat[n][4];
                score = parseFloat(yy);
                if (''+score === 'NaN') score = 0;
            }
            sol = mat[n][6];
            sol = j < 0?sol:sol.replace(/\n/g,' \n').split(/\n/)[j];
            if (j === -2 && ans.length===1 && ans.toLowerCase() === sol.replace(/ .*$/,'').toLowerCase() && sol.length > 2 )
                ans = sol;
            if (sol == null) sol = '';
            else sol = sol.replace(/[ ]+$/,'');
            let sol1 = this.convert2(sol,j);
            let hj = rep[sol1];
            if (hj ===  'undefined' || hj ==  null)
            {
                let keys = Object.keys(rep);
                for (let key of keys)
                {
                    if (this.thesame(key,sol1))
                    {
                        hj =  rep[key]; 
                        sol1 = key;
                        break;
                    }
                }
            }
            if (hj ===  'undefined' || hj ==  null)
            {
                rep[sol1] = sol;
                fre[sol1] = [n];
                scr[sol1] = [score];
                hfmt[sol1] = [j===-2?mat[n][21]:mat[n][9]];
            }
            else
            {
                fre[sol1].push(n);
                scr[sol1].push(score);
                hfmt[sol1].push(j===-2?mat[n][21]:mat[n][9]);
            }
            
        }
        let str ='';
        let s = Object.keys(rep);
        for (let a=0; a < s.length; a++)
            s[a] = fre[s[a]].length + " " + s[a];
        s.sort(function(x,y){let g = parseInt(y.replace(/ .*$/,'')) - parseInt(x.replace(/ .*$/,'')); if (g!==0) return g;  if (y.replace(/[0-9]+[ |\r|\t|\n]+/,'')===''){return -1;} if (x.replace(/[0-9]+[ |\r|\t|\n]+/,'')===''){return 1;} return y<x?1:-1;});
        for (let a=0; a < s.length; a++)
            s[a] = s[a].replace(/^[0-9]+ /,'');
        let cs= Math.ceil(scale/numOfparts*10)/10; 
        str += '<Table cellspacing=0 border=0><tr><td valign=top ><table border=1 id=distincttbl style="border-color:#ddcc99;border-collapse:collapse" cellpadding=4 >';
        str += '<tr ><td  style=color:green;border-top-color:transparent;border-left-color:transparent;border-right-color:transparent id=mystandard colspan=1>' +  ((ans !== null && ans !=='')?this.formatans(ans,this.fmt,j>=0):'') 
                +'</td><td align=center style=color:blue;font-size:'+ (font_size-2) +'px;border-top-color:transparent;border-left-color:transparent;border-right-color:transparent;visibility:' + ((ans !== null && ans !=='')?'visible':'hidden') +' onclick=testsheet.correctreference('+j +',this) colspan=2>&#9998;</td>'
                + '<td align=center style=border-top-color:transparent;border-left-color:transparent;border-right-color:transparent;white-space:nowrap>' + textmsg[1760] +': ' + scale + (numOfparts<=1?'':('/'+ numOfparts +' = '+ cs)) + '</td><td colspan=2  style=border-top-color:transparent;border-left-color:transparent;border-right-color:transparent;text-align:right;white-space:nowrap> ' + '</td></tr>';
        str += '<tr  style=border-color:#ddcc99;border-width:2px;background-image:linear-gradient('+BBGCOLOR+','+TBGCOLOR+')><td  style=border-top-left-radius:4px;background-image:linear-gradient('+BBGCOLOR+','+TBGCOLOR+') ><nobr>' 
                + this.words[8] + '</nobr></td><td align=center  style=background-image:linear-gradient('+BBGCOLOR+','+TBGCOLOR+')  colspan=2>' + textmsg[1790] + '</td><td align=center  style=background-image:linear-gradient('+BBGCOLOR+','+TBGCOLOR+') >' + this.words[5] + '</td><td align=center   >' + this.words[6] + '</td></tr>';
        
        let n = 0, nr = 0;
        this.temp = []; let ts = 0;
        let hit = false;
        let ans0 = j===-2? ans.replace(/ .*$/g,'').toLowerCase() : ans.replace(/ /g,'').toLowerCase();
        let mx = 0;
        for (let y of s)
        {
            let ans = rep[y].replace(/^[ ]+/,'').replace(/[ ]+$/,'');
            let lx = ans.length;
            if (lx > mx) mx = lx;
            let good = this.thesame(ans0,y);
            let su = 0; 
            if (good) 
                su = scale /(numOfparts<=1?1: numOfparts); 
            else 
                su = this.mode(scr[y]);
            su = (Math.ceil(su*10)/10);
            ts += scr[y].length*su;
            nr += scr[y].length;
            this.temp.push(fre[y]);
            if (hit===false && good) hit = true;
            str += '<tr><td  valign=top  style=color:purple;background-color:' + TBGCOLOR+ '>' + (ans===''?('<font color=red>' + textmsg[1865] + '</font>'):this.formatDistinct(ans,hfmt[y])) + "</td><td align=right  valign=top  style=background-color:" + TBGCOLOR+"><nobr>" 
                    +   (good?'<span style=color:green>&check;  </span>':' ')  
                    + scr[y].length + "</nobr></td><td align=right  valign=top    style=background-color:" + TBGCOLOR+ ">" + (100*scr[y].length/numRows).toFixed(0) + '%</td><td  align=center  valign=top   style="padding:3px 3px 3px 3px;background-color:' + TBGCOLOR+ '" ><input  onkeypress="return testsheet.displaytxt1(this,event,' + j + ')" class=human size=4 id=e'
                    +  n + ' value="'+ (''+su.toFixed(1)).replace(/([0-9])\.[0]+$/,'$1') + '" onfocus="this.select();testsheet.hitenter=false;" onchange=testsheet.benumeric(this)></td><td align=center  valign=top  style=color:blue;background-color:' + TBGCOLOR+ '><a  href="javascript:testsheet.distinctCommentg('+ n + ");testsheet.activerow("+n+ ')">&#9998;</a>&nbsp;&nbsp;<a href="javascript:testsheet.whois(' + n   +");testsheet.activerow("+n+")\">" + this.expandsign + "</a></td>"  
                    +  "</tr>";
            n++;   
        } 
        str += "<tr bgcolor=lightyellow><td align=right   style=border-bottom-left-radius:4px;margin-left:130px >" + (n) + "</td><td align=right><nobr>" +  (hit?'':'<span style=color:red>&cross;</span>' )
                    + nr + "</nobr></td><td>100%</td><td colspan=2 ><nobr><span onclick=testsheet.doavg(this) id=doavg style=color:black align=right>" + this.words[7] + "  </span><span>" + (''+(ts/nr).toFixed(2)).replace(/([0-9])\.[0]+$/,'$1').replace(/^[0]*\.[0]*$/,'0').replace(/(\.[0-9])0$/,'$1') + "</span></nobr></td></tr>";
        str += "<tr><td colspan=5 align=center style=border-color:transparent ><table cellspacing=1 cellpadding=0 ><tr><td width=100% align=right><input type=button id=d=upd" + j + "  class=OrangeButton style=width:78px; value=\"" + textmsg[225] + "\" onclick=testsheet.spread(" + j +")>";
        str += "</td><td  width=0% ><input  type=button class=GreenButton style=width:78px value=\"" + textmsg[67] + "\" onclick=\"testsheet.spread("  + j +");testsheet.savedistinct("+ j + ")\"></td><td  width=0% ><input  type=button class=OrangeButton style=width:78px value=\"" + textmsg[18] + "\" onclick=closeprompt()></td><td  width=0% ><span style=float:right;color:purple id=numupdated></span></td><td width=0%><input  type=button class=GreenButton  value=\" &nbsp;<&nbsp; \" onclick=\"testsheet.previousone(" + j +")\"></td><td  width=0% ><input  type=button class=GreenButton   value=\" &nbsp;>&nbsp; \" onclick=testsheet.nextone(" + j +")></td></tr></table></td></tr></table></td>"; 
            str += '<td valign=top id=details  width=250 >'+ this.instruction +'</td></tr>'; 
        str += "</table>";
        let wd = thispagewidth() - 20;
        myprompt(str, null, null,  this.words[8] +': ' + assignname +' '+ textmsg[178] + " " + (questionnum) + (j>=0?('.' +(j+1)):'') );
        LaTexHTML.reformat(document.getElementById('distincttbl'));
        //promptwin.style.position = 'fixed';
        promptwin.style.left = '0px';
        promptwin.style.top = '0px';
        promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].onclick = function()
        {
            if (testsheet.updateddistinct)
            {
               LaTexHTML.deformat(promptwin);
               closeprompt();
            }
            else
            {    
               testsheet.updateddistinct = true;
               let xy = document.getElementById('mystandard');
               testsheet.holdmyanswer = xy.innerHTML;
               xy.innerHTML = '<font color=red>' + testsheet.words[9] + '</font>';
               xy.style.color = 'red';
               setTimeout(function(){let x = document.getElementById('mystandard'); x.innerHTML = testsheet.holdmyanswer;x.style.color='green';},3000);
            }
        };
        document.getElementById('e0').focus();
        if (promptwin.offsetWidth > wd || mx > 50)
        {
           promptwin.style.width = wd + 'px'; 
        }
    };
    this.editanswer = function(j,v)
    {
        return '<input class=human onblur="testsheet.toblack(' + j + ',this)" type=text id=ans' + j + ' style=width:200px;margin-left:-3px;text-align:left;margin-top:-2px;margin-bottom:-2px; value="'+ v + '">';
    };
    this.correctreference = function(j, td)
    {
       let v = originalanswer; 
       if (j>=0) v = v.replace(/\n/g,' \n').split(/\n/)[j].replace(/[ ]+$/,'');
       td.previousSibling.innerHTML = this.editanswer(j,v); 
       td.style.visibility = 'hidden';
        document.getElementById('ans'+   j).style.width = (td.previousSibling.offsetWidth-4) + 'px';
    };
    this.toblack = function(j,ta)
    {
        ta.style.color= "black";
        ta.style.borderColor="black";
        if (j>=0)
        {
            let as = originalanswer.replace(/\n/g,' \n').split(/\n/);
            as[j] = ta.value;
            originalanswer = as.join('\n');
        }
        else
            originalanswer = ta.value;
        onstart();
        var nms = ['subdb','securitytoken', 'orgnum','assignname','sessionname','course','questionnum','Semester','answertext'];
        var vls = [ subdb,securitytoken, orgnum,assignname,sessionname,course,(byquestion?questionnum:10000),semester, originalanswer];
        postopen('gradingQuestion.jsp',nms,vls,    "w" + tstmp); 
    };
    
    this.trimlatex = function(x,p)
    {
        if (p ==  null || typeof p === 'undefined')
        {
            return this.trimlatex(this.trimlatex(x,'_'),'^');
        }
        let i=x.indexOf(p);//, j = x.indexOf('^');
        if (i > 0 && x.charAt(i-1) == '}')
        {
           let j = i-2; let count = 1;
           for (; j >=0; j--)
             if (x.charAt(j) == '}') count++;
             else if (x.charAt(j) == '{') {count--; if (count === 0) break;}
           if (j === -1) return x;
           let r = '';
           if (j > 0) r = x.substring(0,j);
           return  r + this.trimlatex(x.substring(j+1,i-1)) + this.trimlatex(x.substring(i));
        }
       return x;
    }; 
    this.previousone = function(j)
    {  
       this.spread(j);
       if (j <= 0) 
       {
           if (questionnum == 1) 
           {
               this.putalert(textmsg[1771].split(/@/)[15]);
               return;
           }
           toquestion(questionnum-1);
       }
       else 
       {
           this.byanswer(j-1);
       }
    };
    this.putalert = function(x)
    {
       let xy = document.getElementById('mystandard'); 
       this.holdmyanswer = xy.innerHTML;
       xy.innerHTML =  x ;
       xy.style.color = 'red';
       setTimeout(function(){let x = document.getElementById('mystandard'); x.innerHTML = testsheet.holdmyanswer;x.style.color='green';},3000);
    };
    this.nextone = function(j)
    {  
       this.spread(j);
       if (j < 0 || j == numOfparts-1)
       {
           let nd = document.getElementById('numqstr').innerHTML.replace(/<[^>]+>/g,' ').replace(/[ ]+$/,'').replace(/.* ([0-9]+)$/,'$1');
           let ii = parseInt(nd);
           if (questionnum == ii) 
           {
               this.putalert(textmsg[1771].split(/@/)[16]);
               return;
           }
           toquestion(questionnum + 1);
       }
       else
       {
           this.byanswer(j+1);
       }
    };
    this.savedistinct = function(j)
    {
        let cn = 0;
        if (j >= 0)
        for (let k=0; k < this.temp.length; k++)
        {
            let u = document.getElementById('e' + k);
            let cl = (''+u.style.color).replace(/ /g,'').toLowerCase();
            if (cl=== 'red' || cl === '#ff0000' || cl === 'rgb(255,0,0)')
                continue;
            let vv = u.value;
            let ns = this.temp[k];
            for (let n of ns)
            {
                   j = 0; ; let w; let su = 0;
                   while ( (w = document.getElementById('h' + n + '_' + j) )!==null)
                   {
                       su += parseFloat(w.value);
                       j++;
                   }    
                   document.getElementById('score' + n).value = su;
                
               this.cacheentered(n);
            }
        }
       send(document.getElementById('sendbtn'));
    };
    this.whois = function(n)
    {
        this.group = n;
        let ss ='<table  border=1 id=distincttbl1 style="border-color:#ddcc99;border-collapse:collapse;border-radius:3px" cellpadding=4  ><tr><td colspan=4 align=center  style=border-top-color:transparent;border-left-color:transparent;border-right-color:transparent;padding-top:4px;padding-bottom:4px >' +textmsg[55] + ' ' + (n+1) + '</td></tr>';
        ss += '<tr><td style=background-image:linear-gradient('+BBGCOLOR+','+TBGCOLOR+") align=center >" +    '#</td><td style=background-image:linear-gradient('+BBGCOLOR+','+TBGCOLOR+')>' + textmsg[154] +'</td><td style=background-image:linear-gradient('+BBGCOLOR+','+TBGCOLOR+") >" + textmsg[1629] + '</td></td><td style=font-size:' + (font_size-3) +'px;background-image:linear-gradient('+BBGCOLOR+','+TBGCOLOR+')  >&#9998;</td></tr>';
        for (let i of this.temp[n])
           ss += '<tr><td style=background-color:' + TBGCOLOR+ ' onclick=testsheet.moveto('+i+')>' + document.getElementById('disk' + i).outerHTML.replace(/width:[ |0-9}\.]+/,'width:20').replace(/height:[ |0-9}\.]+/,'height:20') + "</td><td style=color:blue;background-color:" + TBGCOLOR+ "  onclick=testsheet.studentinfo(" + i +") >" + mat[i][2] + "</td><td onclick=testsheet.whosub(" + i + ")  style=background-image:linear-gradient(" + BBGCOLOR+',' + TBGCOLOR+');color:blue;white-space:nowrap >' + mat[i][10] + "</td><td style=color:blue;background-image:linear-gradient(" + BBGCOLOR+',' + TBGCOLOR+') onclick=testsheet.distinctComment('  + i  + ")>&#9998;</td></tr>";
        document.getElementById('details').innerHTML = ss + '</table>';
       
    };
    this.moveto = function(n)
    {
        let q = document.querySelector('#anchor' + n);
        let q1 = document.getElementById('unigrade' ); 
        if (n < N-1) q1=document.querySelector('#anchor' + (1+n));
        let uv = findPositionnoScrolling(q);
        let xy = findPositionnoScrolling(q1);
        let diff = (xy[1] - uv[1]-10);
        if (diff > 500) diff = 500;
        q.scrollIntoView();
        promptwin.style.top = (uv[1] + diff) + 'px';
    };
    this.studentinfo = function(n)
    {
        var str = "studentpage.jsp?mode=instructor&sid=" + mat[n][2];
        window.open(str, '_blank');
       
    };
    this.whosub = function(n)
    {
        let s = mat[n][6];
        document.getElementById('details').innerHTML = 
        '<div style="white-space:nowrap;padding:4px 4px 4px 4px;float:center;width:250px" >' +   mat[n][10] + ' ' + textmsg[1629] + ': </div>'
        + '<div style="color:purple;border-radius:3px;border:1px #ccdd99 solid; padding:3px 3px 3px 3px;width:250px">' + formatstr(s, sformat) + '</div>'
        + '<Center><a href="javascript:testsheet.distinctComment('  + n + ')">&#9998;</a></center>';
    };
    this.activerow = function(n)
    {
        let tbl = document.getElementById('distincttbl');
       let set = false, clear = false;
       for (let r=2; r < tbl.rows.length-2; r++)
       {
           let cl = (''+tbl.rows[r].bgColor);
           if (r-2!==n && (cl.replace(/ /g,'') === 'rgb(230,230,180)' )|| cl ==='#E6E6B4')
           {    
               tbl.rows[r].bgColor = null;clear = true;
           } 
           if (r-2===n )//&& cl.replace(/ /g,'') !== 'rgb(230,230,180)' && cl!=='#E6E6B4') 
           {
               tbl.rows[r].bgColor = '#E6E6B4'; set = true;
           } 
           if (set && clear) break;
       } 
    };
     this.formatans = function(qq,fmt,isfillblank)
     {
        if(isfillblank && ( fmt =='1' ||  fmt=='2'))  
            qq = qq.replace(/\n/g,'<br>');
        qq = formatstr(qq, fmt );
        //qq = this.hw.merge(qq) ;
        if (qq === 'null') qq = '';
        return qq;
     };
    this.cancelCommentg = function(n)
    {
        let dt = document.getElementById('details');
        let err = document.getElementById('notsaveerror');
        if (this.commentSaved === false)
        {    
            err.innerHTML = '<blink>' + this.words[10] + '</blink>';
            
            this.commentSaved = true;
        }
        else
        {
            dt.innerHTML = this.instruction;
        }
    };
    this.insertCommentg = function(g )
    {
        let v = document.getElementById("commentds" ).value;
        this.tempcomment[g] = v;
        for (let n of this.temp[g])
        {
            document.getElementById("comment" + n).value = v; 
        }
        document.getElementById('details').innerHTML =  '<nobr>' + textmsg[447] + ' ' + textmsg[55] + ' ' + (g+1) + ':&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</nobr><br>' + v ;
        var fmt=guessFormat(v);
         if ( fmt  +''=='2')
         {
             LaTexHTML.formatele(document.getElementById('details'));
          }
    };
    this.tempcomment = [];
    this.distinctCommentg = function(n)
    {
        let es = this.tempcomment[n];
        if (es == null || es === null) es = '';
        if (es !== '')
        for (let nn of this.temp[n])
        {
            let xx = retrv(nn,13).replace(/[0-9]+,[0-9]+,([^,]+),/,'');
            let j  = xx.indexOf(es);
            if (j >= 0)
               xx = xx.substring(0,j).replace(/\n$/,'') +  xx.substring(j + es.length);
            document.getElementById('comment' + nn).value = xx;
           
        }
        let s =  '<div style="white-space:nowrap;padding:4px 4px 4px 5px;margin-right:20px;margin-bottom:2px" >' + textmsg[447] + ' ' + textmsg[55] + ' ' + (n+1) + "</div>" 
        + '<textarea id="commentds" style="border:1px solid rgb(192,192,192);background-color:white;color:black;height:200px;width:250px;"  onfocus="testsheet.clearalert()"  onkeypress="return testsheet.displaytxt(this,event,' + n + ')">' + es + '</textarea>';
        s += '<center><input type=button class=GreenButton style=width:78px value="' + textmsg[310] + '" onclick=testsheet.insertCommentg(' + n + ')><input type=button class=OrangeButton style=width:78px value="' + textmsg[18] + '" onclick=testsheet.cancelCommentg(' + n + ')></center>'
        + '<br><div id=notsaveerror></div>';
        document.getElementById('details').innerHTML =  s  ;
        document.getElementById('commentds').focus();
    };
    this.temp = [];
    this.clearalert = function()
    {
        document.getElementById('notsaveerror').innerHTML = '';
    };
    this.displaytxt = function(ta,evt,n)
    {
        var e = evt ? evt : window.event;
        if (!e)
            return true;
        var key = 0;
        if (e.keyCode) {
            key = e.keyCode;
        }  
        else if (typeof (e.which) != 'undefined') {
            key = e.which;
        }
        
        if (key === 13)
        {
         }
        else
        {
            this.commentSaved = false;
        }
         if (key === 36 || key===62)
         {
             var p = caretPos( ta) ;
             var str = '';
             var ch = String.fromCharCode(key);
             if (p > 0)
                str   = ta.value.substring(0,p) + ch +  ta.value.substring(p);
             else
                str   =   ch +  ta.value.substring(p);
             var fmt=guessFormat(str);
             if ( fmt  +''=='2')
             {
                 document.getElementById("notsaveerror" ).innerHTML = str;
                 LaTexHTML.formatele(document.getElementById("notsaveerror" ));
              }
          }
        return true;
   
    };
    this.distinctComment = function(n)
    {
        let comm = document.getElementById('comment' + n);
        if (comm!=null) comm = comm.value; 
        else comm = '';
        let s = '<div style="white-space:nowrap;padding:4px 4px 4px 4px;margin-right:100px" >' + textmsg[447] + ' ' +  mat[n][2] + ' ' + mat[n][10] + '</div>' 
         + '<textarea id="commentds" style="border: 1px solid rgb(192, 192, 192); background-color: white; color: black; height: 200px; width:99%;" onfocus="testsheet.clearalert()" onkeypress="return testsheet.displaytxt(this,event,' + n +')">' + comm +'</textarea>';
        s += '<table cellpadding=0 align=center><tr><td><input type=button class=GreenButton style=width:78px value="' + textmsg[1357] + '" onclick=testsheet.insertComment(' + n +')></td><td><input type=button class=OrangeButton style=width:78px value="' + textmsg[18] + '" onclick=testsheet.cancelComment(' + n + ')></td></tr></table>'
         + '<br><div id=notsaveerror></div>';
        document.getElementById('details').innerHTML =  s  ;
        document.getElementById('commentds').focus();
    };
    this.insertComment = function(n)
    {
        let v = document.getElementById("commentds" ).value;
        var fmt1 = guessFormat(v);
        let comm = document.getElementById('comment' + n);
        if (comm!=null) comm.value = v; 
        this.commentSaved = true;
        document.getElementById('details').innerHTML = '<div style="white-space:nowrap;padding:4px 4px 4px 4px;margin-right:100px" >' + textmsg[447] + ' ' +  mat[n][2] + ' ' + mat[n][10] + '</div>' + ' '+ formatstr(v,fmt1);
        if (fmt1 == '2')
        LaTexHTML.deformat(document.getElementById('details'));
    };
    this.commentSaved = true;
    this.group = 0;
    this.cancelComment = function(n)
    {
        let dt = document.getElementById('details');
        let err = document.getElementById('notsaveerror');
        if (this.commentSaved === false)
        {    
            err.innerHTML = '<blink>' + this.words[10] + '</blink>';
            
            this.commentSaved = true;
        }
        else
        {
            this.whois(this.group);
        }
    };
    this.hitenter = false;
    this.benumeric = function(tx)
    {
       if (isNaN1(tx.value))
       {
           tx.focus();
           tx.style.borderColor = 'red'; 
           tx.style.color = 'red';
       }
       else
       {
           document.getElementById('doavg').style.color = 'blue';
           document.getElementById('doavg').nextSibling.style.color = 'grey';
            tx.style.borderColor = 'black'; 
            tx.style.color = 'black';
            document.getElementById('numupdated').innerHTML = '';
            if (!this.hitenter) this.updateddistinct = false;
       }
    };
    this.setcolor = function(tx,cl)
    {
        tx.style.borderColor = cl;
        tx.style.color = cl;
    };
    this.mode = function(arr)
    {
        let a = {};
        for (let x of arr)
        {
            if (a[x] == null) 
                a[x] = 1;
            else
                a[x] = a[x] + 1;
        }
        let k = Object.keys(a);
        let kf = [];
        for (let x of k)
        {
            kf.push([parseFloat(''+x),a[x]]);
        }
        kf.sort(function(x,y){ if (y[1] === x[1]) return y[0]  -  x[0] ; return y[1] - x[1];});
        return Math.round(10*kf[0][0])/10;
    }; 
    this.spread = function(j)
    {
        let cn = 0;
        for (let k=0; k < this.temp.length; k++)
        {
            let u = document.getElementById('e' + k);
            let cl = (''+u.style.color).replace(/ /g,'').toLowerCase();
            if (cl=== 'red' || cl === '#ff0000' || cl === 'rgb(255,0,0)' || cl === '')
                continue;
         
            let vv = u.value;
            let ns = this.temp[k];
            for (let n of ns)
            {
               let u;
               if (j >= 0)
               {
                   u = document.getElementById('h' + n +  '_' + j);
               } 
               else  
               {    
                   u =document.getElementById('score' + n );
                }
               u.value = vv;
               this.setcolor(u,'black');
               this.cacheentered(n);
               cn++;
            }
        }
        this.updateddistinct = true;
        document.getElementById('numupdated').innerHTML = '#'+cn;
    };
    this.cacheentered = function(n){}

}
 let testsheet = new TestSheet();
 var oldscore = new Array();
 function transfer(td,i)
 {
     var x = document.getElementById('score'+i);
     if (td.innerHTML.charCodeAt(0) == 8595)
     {
         
         oldscore[i] = x.value;
         x.value = lscore[i];
         asscore(x);
         td.innerHTML = '&uarr;';
     }
     else
     {
         
         x.value =  oldscore[i]
         asscore(x);
         td.innerHTML = '&darr;';
     }
 }
 var numdecimals = 0;
 function doreplace()
{
    for (let i=0; i < N; i++)
    {
        let x = document.getElementById('score'+i);
        if (x.value !== ''+lscore[i])
        {
            if (lscore[i]!=null){
            x.value = lscore[i];//.toFixed(numdecimals);
            asscore(x);
        }
        }
    }
}
let NR = 1;
function humangrade()
{
    for (let i=0; i < N; i++)
    {
        let dv = document.getElementById('fillblank' + i);
        if (dv===null) break;
        let ts = dv.getElementsByTagName('table');
        if (ts === null|| ts.length === 0) break;
        let tbl = ts[0];
        NR = tbl.rows.length-2;
        let s = parseFloat(mat[i][18]);
        let r = tbl.rows[0];
        let c = r.insertCell(3); c.align = 'right';
        c.innerHTML = textmsg[463];
        for (var j = 0; j < tbl.rows.length-2; j++)
        {
           let r = tbl.rows[j+1];
           let p = parseInt(r.cells[2].innerHTML.replace(/%/,''));
           let q = s/NR*p/100;
           q = q.toFixed(2);
           let t = ''+ q;
           t = t.replace(/[\.]*0+$/,'');
           let c = r.insertCell(3);
           c.innerHTML = '<input id=h' + i + '_' + j + ' size=5 onfocus="javascript:currentv=this.value;this.select();" onblur=propagate(' + i + ',' + j + ',this) value=' + t + '  class=human >';
            
        }
        r = tbl.rows[j+1];
        c = r.insertCell(3);   c.align = 'right';
        c.innerHTML = r.cells[2].innerHTML;
       
    }
}
let currentv;
function propagate(ii,jj,ip)
{
   let p = ip.parentNode.previousSibling.previousSibling.innerHTML.replace(/ /g,'').toLowerCase();
   ip.style.color = 'rgb(0,0,0)';
   for (let i=0; i < N; i++)
   {
      let ele = document.getElementById( 'h' + i + '_' + jj);
      if (ele == null) continue;
      if (i != ii) 
      { 
          let q = ele.parentNode.previousSibling.previousSibling.innerHTML.replace(/ /g,'').toLowerCase();
          if (p != q) continue;
          ele.value = ip.value;
      }
      ele.style.color = 'rgb(0,0,0)';
      let n = 0;
      for (let j=0; j < numOfparts; j++)
      {
         ele = document.getElementById( 'h' + i + '_' + j);
         if (ele!=null)
         n += parseFloat(ele.value);
      }
      let m = parseFloat(mat[i][23]); if (''+m == 'NaN') m =-1;
      if (n > m && m>-1) n = m;
      let tbl = ele.parentNode.parentNode.parentNode;
      if (tbl.tagName.toLowerCase()!='table') tbl = tbl.parentNode;
      
      ele = document.getElementById( 'score' + i  );
      if (ele!==null) ele.value = (''+n.toFixed(1)).replace(/([0-9])\.[0]+$/,'$1').replace(/^[0]*\.[0]*$/,'0').replace(/(\.[0-9])0$/,'$1');
   }
   asscore(document.getElementById( 'score' + ii ));
}
function getScrolly()
{
    if (window.scrollY) return window.scrollY;
    else if (window.pageYOffset)
        return window.pageYOffset;
    else
        return document.documentElement.scrollTop;
}
function setscrolly(y)
{
   if (document.documentElement.scrollTop)
      document.documentElement.scrollTop = y;
   else window.scrollTo(0, y);
}
 

function makeenter(i, j, v)
{
     return '<input id=h' + i + '_' + j + ' size=5 onfocus="javascript:currentv=this.value;this.select();" onblur=propagate(' + i + ',' + j + ',this) value=' + v + ' style="color:rgb(255,0,0)" class=human onkeypress="return displaytxt(this,event,' +i + ',' + j + ')">';
 }
function displaytxt(tx, evt, i, j){return true;} 
function propag(ii,ip)
{
    let p = mat[ii][6].toLowerCase();
    for (let i=0; i < N; i++)
    {
      let ele = document.getElementById( 'score' + i);
      if (i !== ii) 
      { 
          let q = mat[i][6].toLowerCase();
          if (p !== q) continue;
          ele.value = ip.value;
      }
      ele.style.color = 'rgb(0,0,0)';
    }
}
function whatitis()
{
    myprompt("<nobr>There are three correct formats for submission:</nobr><div class=why>1,'answer1'<br>2,'answer2'<br>...<br>n,'answern'</div><div class=why>1,'answer1'<br>2,'answer2'<br>...<br>n,'answern'</div><div class=why>1,'answer1',time1,format1,suffle1,estimate1<br>2,'answer2',time2,,suffle2,estimate2<br>...<br>n,'answern',timen,formatn,sufflen,estimaten</div>",null,null,textmsg[156]);
}
function correctit(sid,i)
{
    var nms = ['subdb','securitytoken', 'orgnum','assignname','sid','course','Semester','answertext',"sessionname"];
    var correctanswer = document.getElementById('error' + i).value;
    var vls = [ subdb,securitytoken, orgnum,assignname,sid,course,semester, correctanswer,sessionname];
    postopen('gradingQuestion.jsp',nms,vls,"w" + tstmp); 
}
 
/* 
var tbl;
var hintxs = textmsg[1840].split(/@/);
var goodj = 0, goodrowi=0;
var commentbox,goodbut,goodtbl; 
while (goodj<N && document.getElementById('comment'+goodj)==null)goodj++;
if (goodj < N &&  mat[goodj][9]!='6')
{    
    commentbox = document.getElementById('comment'+goodj);
    goodtbl = commentbox.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    alert(goodtbl.tagName + goodj + ',' + goodrowi);
    while(goodrowi < goodtbl.rows.length && goodtbl.rows[goodrowi] != commentbox.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode)
       goodrowi++; 
    goodrowi--;
    
    if (goodtbl.rows[goodrowi].cells.length< 3) 
        goodrowi--;
    //alert(goodtbl.rows[goodrowi].cells[2].innerHTML)
    goodbut = document.getElementById('submitted'+goodj);
    demotasks = [ 
    ["democursor2(document.getElementById('numqstr'),100)", 0],
    ["democursor2(thispagewidth()-50,150)", 4000],
    ["democursor2(thispagewidth()-50,200)", 3000],
    ["democursor2(thispagewidth()-50,250)", 1000],
    ["democursor2(thispagewidth()-50,300)", 1000],
    ["democursor2(thispagewidth()-50,300)", 1000],
    ["tbl=goodtbl;democursor2(tbl.rows[" + goodrowi + "].cells[1],10)", 1000],
    ["democursor2(tbl.rows[" + goodrowi + "].cells[1],2)", 4000],
    ["tbl=commentbox.parentNode.parentNode.parentNode.parentNode;democursor2(tbl.rows[0].cells[0],100)", 3000],
    ["demoheight(0.7);commentbox.focus();commentbox.click();tbl.rows[0].cells[0].click()", 2000],
    ["demoheight();democursor2(goodbut,2)",500],
    ["demoheight(0.7);goodbut.click()", 4000],
    ["demoheight();democursor2(document.getElementById('tosmall'),2)",500],
    ["demoheight(0.7);document.getElementById('tosmall').click()", 4000],
    ["demoheight();democursor2(commentbox,2)",500],
    ["commentbox.focus();democursor2(document.getElementById('tosmall'),2)",2000],
    ["demoheight(0.7);commentbox.value=hintxs[6]",2000],
    ["demoheight(1);commentbox.value=hintxs[6] + ':$y=x^2$'",2000],
    ["demoheight(0.7);document.getElementById('tosmall').click()", 2000],
    //["demoheight();tbl=goodtbl.rows[" + goodrowi + "].cells[2];democursor2(tbl.getElementsByTagName('table')[0].rows[1].cells[0],2)",500],
    //["democursor2(tbl.getElementsByTagName('table')[3].rows[1].cells[0],2)",3000],  
    ["demoheight(0.7)",500],
    ["demoheight(1)",500],
    ["window.scrollTo(0,document.body.scrollHeight);democursorx=500;democursory=document.body.scrollHeight-500;democursor2(document.getElementById('butbase').rows[0].cells[0].getElementsByTagName('input')[0],10)",200],
    ["demoheight(0.7);quickgrade(document.getElementById('butbase').rows[0].cells[0].getElementsByTagName('input')[0]);democursorsim.style.zIndex=(1+parseInt(''+promptwin.style.zIndex))", 4000],
    ["demoheight(1);democursor2(document.getElementById('keywords'),10)", 1000],
    ["demoheight(0.7);document.getElementById('keywords').focus();document.getElementById('keywords').value=hintxs[7]", 1000],
    ["demoheight(1)", 500],
    ["democursor2(document.getElementById('keywords').parentNode.parentNode.parentNode.parentNode.rows[2].cells[0].getElementsByTagName('input')[0],2)", 2000],
    ["demoheight(0.7)",1000],
    ["demoheight(1);democursor2(parseInt(promptwin.style.left.replace(/px/,''))+10,parseInt(promptwin.style.top.replace(/px/,''))+10)",500],
    ["demoheight(0.7);closeprompt('quickest')",3000],
    ["demoheight(1); democursor2(document.getElementById('butbase').rows[0].cells[1].getElementsByTagName('input')[0],2)",500],
    ["demoheight(0.7)",2000],
    ["demoheight(1);democursor2(document.getElementById('butbase').rows[0].cells[2].getElementsByTagName('input')[0],2)",500],
    ["demoheight(0.7)",2000],
    ["demoheight(1);demoremovesim()", 500]
    ];
}
else
{
    demotasks = [ 
    ["democursor2(document.getElementById('numqstr'),100)", 0],
    ["democursor2(thispagewidth()-50,150)", 4000],
    ["democursor2(thispagewidth()-50,200)", 3000],
    ["democursor2(thispagewidth()-50,250)", 1000],
    ["democursor2(thispagewidth()-50,300)", 1000],
    ["democursor2(thispagewidth()-50,300)", 1000],
    ["window.scrollTo(0,document.body.scrollHeight);democursorx=500;democursory=document.body.scrollHeight-500;democursor2(document.getElementById('butbase').rows[0].cells[0].getElementsByTagName('input')[1],2)",3000],
    ["demoheight(0.7)",3000],
    ["demoheight(1);democursor2(document.getElementById('butbase').rows[0].cells[2].getElementsByTagName('input')[0],2)",500],
    ["demoheight(0.7)",3000],
    ["demoheight(1);demoremovesim()", 500]
    ];
}
*/