var SN = 0;
var tids = [];
var rids = [];
var stopi;
var thisi = 0;
var thisk = 0;
var closelbl = '';
var answers = new Array();
var fmts = new Array();
var answerstr = new Array();
var bwidth =  Math.round(4.5*font_size);
var takentime = new Array();
var lasttime = new Array();
var chatting = new Array();
var studentsek = new Array();
var requests = new Array();
var questions = new Array();
var oldanswers = new Array();
var references = new Array();
var pointing = new Array();
var loadedquestion = new Array();
var loadedanswer = new Array();
var ismultiple = new Array();
var tbl2sek = new Array();
var reportstr = ''; 
var guessedReportformat = '0';
for (var i1=0; i1 < NS.length;i1++)
{
    chatting[i1] = new Array(NS[i1]);
    studentsek[i1] = new Array(NS[i1]);
    tbl2sek[i1] = new Array(NS[i1]);
    takentime[i1] = new Array(NS[i1]);
    lasttime[i1] = new Array(NS[i1]);
    answers[i1] = new Array(NS[i1]);
    loadedquestion[i1] = 0;
    loadedanswer[i1] = 0;
    answerstr[i1] = new Array();
    fmts[i1] = new Array();
    ismultiple[i1] = new Array();
    questions[i1] = new Array();
    oldanswers[i1] = new Array();
    references[i1] = new Array();
    pointing[i1] = new Array();
    requests[i1] = new Array(NS[i1]);
    for (var kk=0; kk < NS[i1]; kk++)
    {
        requests[i1][kk] = '';
        chatting[i1][kk] = false;
        ismultiple[i1][kk] = new Array();
    }
} 

function init(z)
{
    if (z == null)
    {
        for (let k of keystr)
            init(k);
        return;
    }
    Msg.init({stoken:securitytoken,
    app:"exam",
    tid:'',
    sid:uid,
    sname:myname,
    rid:'',
    code:'',
    msg:'',
    sek:mysek,
    sendhandle:"Msgretrive",
    key:z
    }); 
    Msg.needmore = true;
    Msg.listen();
}
 

function closeproc(i)
{
    stopi = i;
    Msg.send({tid:tids[i],rid:'',code:'quit',msg:'Don\'t accept any more'});
    var btn =   document.getElementById('submit3' + stopi);
    closelbl = btn.value;   
    btn.value = textmsg[450];
    btn.onclick = function(){ restart(this);}
    tids[stopi] = '';
   initrids[SN] = '';
   dememberlist(stopi);
    for (var j=0; j < NS.length; j++)
        if (tids[j]!='')
            break;
    if (j == NS.length) window.onbeforeunload = null;
}
function settime()
{
    if (document.getElementById('timer0') == null) return;
    var nt = (new Date()).getTime()  ;
    for (var i=0; i < NS.length; i++)
    {
        var ng = '';
        var t = dues[i] - Math.floor(nt/1000);
        if (t < 0) { ng = '-'; t = -t;}
       // if (t <= 0) return;
        var h = Math.floor(t/3600);
        var m1 = t%3600;
        var m = Math.floor(m1/60);
        var pm = '';
        if (m < 10) pm = '0';
        
        var s = m1%60;
        var ps = '';
        if (s < 10) ps = '0';
        if (ng =='-') document.getElementById('timer' +i).style.color = 'red';
        document.getElementById('timer' +i).value = ng +  h + "h" + pm+ m + "'" + ps + s + "\"";
    }
    if (MAXK > 0)
    {
        for (var k=0; k < MAXK; k++)
        {
            var y = sek2tbl[k];
            if (y == null) continue;
            var tbl = document.getElementById(y);
            if (leaving[k] != null && backing[k]!=null && leaving[k] > backing[k] && nt - leaving[k] > 100000)
            {
                tbl.style.color = 'red';
            }
            else
            {
                tbl.style.color = 'green';
            }
        }
    }
}


var settingstr = [];
function setting(i)
{
    if (settingstr[i] == null)
        settingstr[i] = '0123456';
     tempsetting = settingstr[i];
    var arr = textmsg[1692].split(/\n/);
    var s = '<table  cellpadding=4 >';
    for (var j=0; j < 6; j++)
       s += "<tr height=40><td><input type=checkbox " + (settingstr[i].indexOf('' + j)>=0?'checked':'') + ' onclick=recordsetting(this,'+ i +',' + j +') > </td><td  style=white-space:nowrap>' + arr[j].replace(/^[ ]/,'') + '</td></tr>';
    s += '</table><center><input type=button class=OrangeButton style=width:70px value="' + textmsg[462] + '" onclick=sendsetting(' + i + ') >';
    s += '<input type=button class=GreenButton style=width:70px value="' + textmsg[18] + '" onclick=closeprompt() ></center>';
    myprompt(s,null,null,document.getElementById('submit1'+i).value);
    promptwin.style.width = '500px';
}
function sendsetting(i)
{
    settingstr[i] = tempsetting;
    Msg.send({rid:'',tid:tids[i],code:'seting',msg:settingstr[i]});
    closeprompt();
}
var tempsetting;
function recordsetting(ck, i  ,  j  )
{
     tempsetting =  tempsetting.replace(new RegExp(''+j),'') + (ck.checked?(''+j) :'');
}
function getstatus(i)
{
    stopi = i;
    Msg.send({code:"snap"});
}

function nosaved()
{
   
   return textmsg[791];
}

function align()
{
    var w = screen.width-80;
    var W = Math.floor(w/96);
    
    for (var i=0; i < NS.length; i++)
    {
        var j=W;
        while (j < NS[i])
        {
        var tbl = document.getElementById("s" + i + '_' + j);
        var br = document.createTextNode("br");
        //tbl.parentNode.insertBefore(br,tbl);
        j += W;
        }
    }
}
var onloadbeforeproctor = null;
if (typeof window.onload == 'function')
   onloadbeforeproctor = window.onload;
let  duets =  duet.replace(/,$/,'').split(/,/);

window.onload = function()
{
    if (onloadbeforeproctor!=null) onloadbeforeproctor();
    let msgstr = localStorage['proctor-'+ keystr[0]];
    if (msgstr!=null)
    {
       msgs = JSON.parse(msgstr);
       //for (let s of msgs.post) 
       //Msg.handlepost(s);
       for (let s of msgs.get) 
       {    
           Msg.handleget(s,false);
       }
    } 
    let nowt = ~~((new Date()).getTime()/1000);
    
    if (duets[0]  >= nowt)
    {
        Msg.listen = function ()
        {
            lastlisten = (new Date()).getTime();
            Msg.url = "Msgretrive?key=" + Msg.hex(keystr[0]) + "&orgnum=" + orgnum +  "&sek=" + Msg.sek + "&sid=" + Msg.sid + "&app=" + Msg.app;
            var url =  Msg.url + '&time='+ lastlisten;
            Msg.xmlhttp.open('GET', url ,true);
            Msg.xmlhttp.send();
        };
        Msg.sendhandle = "Msgretrive";
        init();
        Msg.send({msg:"Greeting",code:'new'}); 
        setInterval('settime()', 3000);
    }
}

function restart(btn)
{
   var i = parseInt(btn.id.substring(7));
   initrids[i] = ',';
   Msg.send({msg:SC[i],code:'new'}); 
   var btn =  document.getElementById('submit3' + i);
   btn.value = closelbl; 
   btn.onclick = function()
   {
       var i = parseInt(this.id.substring(7));
       closeproc(i);
   }
}
 
function sendagain()
{
    ++SN;
     Msg.send({msg:SC[SN],code:'new'}); 
}
var initrids = [];
function tellme()
{
    for (var i=0; i < initrids.length; i++)
        if (initrids[i].indexOf(',')>0)
    {
         tellme1(i);
         initrids[i] = '';
         break;
    }
     
}
function tellme1(i)
{
    if (settingstr[i] == null) 
        settingstr[i] = '0123456';
    SN = i;
    Msg.send({tid:tids[i],rid:'',code:'latex',msg:settingstr[i]});
}
var memberlist1 = function(m)
{
    m.tid = keystr[0];
    //m.sname is i]sid
    //m.sid = sek
    for (var i=0; i < NS.length; i++)
    {
       // if (m.tid == tids[i])
        {
            stopi = i;
            for (var k=0; k < NS[i]; k++)
            {
                var tbl = document.getElementById('s' + i + '_' + k);
                var xx = studentid[i][k];
               
                if ( xx == m.sname)
                {   
                     sek2tbl[parseInt(m.sid)] = 's' + i + '_' + k;
                     tbl2sek[i][k] = m.sid;
                     if (answers[i][k]==null)answers[i][k] = new Array();
                     if (takentime[i][k]==null)takentime[i][k] = new Array();
                     if (lasttime[i][k]==null)lasttime[i][k] =  (new Date()).getTime() % 10000000;
                    tbl.style.backgroundColor = white;
                    studentsek[i][k] = m.sid;
                    tbl.style.color = 'green';
                    break;
                }
                
            }
            break;
        }
    }
}
var sek2tbl = new Array();
var MAXK = -1;
function closeall()
{
    localStorage['proctor-' + keystr[0] ]  = JSON.stringify(msgs);
    for (var i=0; i < NS.length; i++)
    closeproc(i);
}
 
window.onunload = closeall;
var memberlist = function(t)
{
       var ss = t.split(/,/);
       var tt =  (new Date()).getTime() % 10000000;
       var allids = ",";
       for (var i = 0; i < ss.length; i++)
       {
          var j = ss[i].indexOf("-");
          var aa = ss[i].substring(0,j); 
          var bb = ss[i].substring(j+1).replace(/_/g,' ');
          for (var j=0; j <  NS.length; j++)
          {
              for (var k=0; k < NS[j]; k++)
              {
                  var ele = document.getElementById('s' + j + '_' + k);
                  if (bb  == studentid[j][k] ) 
                  {  ele.style.backgroundColor = white;
                     ele.style.color = 'green'
                     sek2tbl[parseInt(aa)] = 's' + j + '_' + k;
                     tbl2sek[j][k] =  (aa);
                     if (answers[j][k]==null)answers[j][k] = new Array();
                     if (takentime[j][k]==null)takentime[j][k] = new Array();
                     if (lasttime[j][k]==null)lasttime[j][k] = tt;
                     studentsek[j][k] = aa;
                  }
                  
              }
          }
        } 
    }
    
 function dememberlist(i)
 {
     for (var j=0; j < NS[i]; j++)
     {
         var b = (document.getElementById('s' + i + '_' + j).style.backgroundColor);
         if (b == white || b == 'rgb(255,255,255)' || b == '#FFFFFF' || b =='#fff')
             document.getElementById('s' + i + '_' + j).style.backgroundColor = '#555555';
     }
         
 }
 var leaving = [];
 var backing = [];
 let msgs = {post:new Array(),get:new Array(),start:starts,due:duets[0],subdb:subdb};
 
 Msg.handlepost = function (s, record)
{
    if (s == '')
    {
        return ;
    }
    
    var m = new Message(s);
    if (m.code == 'snap')
    {
        var x = textmsg[1646].split(/@/);
        x[0] = x[0].replace(/s$/i,'');
        var seg = m.msg.split(/\|/);
        for (var i=1; i < seg.length; i++)
        seg[i] = seg[i].replace(/<tr/, '<tr style=background-color:' + BBGCOLOR).replace(/<table/, '<table width=100% border=1  cellpadding=4 style=border-collapse:collapse;border-radius:4px;border-color:' + BBGCOLOR);
        var tbl =  document.getElementById('snap');
        myprompt("<table cellpadding=4  ><tr><td style=\"background-color:" + DBGCOLOR+";border:1px #888888 solid;border-radius:4px;text-align:center;background-color:"+ DBGCOLOR+"\"\">" 
                +x[0]+ seg[1]+ "</td></tr> <tr><td style=\"background-color:" + DBGCOLOR
                +";border:1px #888888 solid;border-radius:4px;text-align:center;background-color:"
                + DBGCOLOR+"\"\">" +x[1]+ seg[2]+ "</td></tr><tr><td style=\"background-color:" 
                + DBGCOLOR+";border:1px #888888 solid;border-radius:4px;text-align:center;background-color:"
                + DBGCOLOR+"\">" +x[2]+ seg[3]+ "</td></tr></table>",null,null,textmsg[1736]);
    }
    else if (m.code == "newd")
    {
        if (record==null)
           msgs.post[msgs.post.length] = s;
        tids[SN] = m.msg;
        initrids[SN] = m.rid;
        memberlist(m.rid);
        if (SN < SC.length-1)
        {
            sendagain();
        }
        else 
            tellme();
         
    }
    else if (m.code == "sure")
    {
        if (SN < SC.length-1)
        {
            tellme();
        }
        if (m.num==2) 
            Msg.listen();
    }
    else if (m.code == "unsubd")
    {
       var btn =   document.getElementById('submit3' + stopi);
       btn.value = textmsg[450];
       btn.onclick = restart;
       tids[stopi] = '';
       initrids[SN] = '';
       dememberlist(stopi);
       Msg.needmore = false;
    }
    else if (m.code == 'error') 
    {
        myprompt(m.msg);
        if (m.num==2) 
            Msg.listen();
    }
    Msg.rid = '';
} 
var maxqn = 0;
var showinganswer = "";
let needtosave = false; 
Msg.handleget = function (s,record)
{
    
    var m = new Message(s);
    //m.display("receiv"+m.sid);
    if (m.sid!=Msg.get('sek'))
    {
        memberlist1(m);
    }
    Msg.needmore = true;
    needtosave = true; 
    if (m.code == 'login')
    {
        window.open('login.jsp?follow=' + m.msg, 'w' + tstmp);
        Msg.needmore = false;
    }
    else if (m.code == "join")
    {
        //m.display("join");
        if (m.sid!=Msg.get('sek'))
        {
            memberlist1(m); let hit = false;
            if (settingstr[stopi] == null) 
                settingstr[stopi] = '0123456';
            for (var i=0; !hit && i < NS.length; i++)
            {
                 for (var k=0; k < NS[i]; k++)
                 {
                    if (m.sid == studentsek[i][k]) 
                    {
                       Msg.key = keystr[i];
                       Msg.send({rid:m.rid,code:'reply',sid:uid,msg:("seting:"+settingstr[stopi])}); 
                       hit = true;
                       break;
                     }
                 }
            }
        }
    }
    else if (m.code == "leave")
    {
        if (record==null)
            msgs.get[msgs.get.length] = s;
        for (var i=0; i < NS.length; i++)
        {
            for (var k=0; k < NS[i]; k++)
            {
                var tbl = document.getElementById('s' + i + '_' + k);
                if (m.sid == studentsek[i][k])
                {
                    tbl.style.backgroundColor = 'grey';
                    break;
                }
            }
        }
    }
    else if (m.code == 'plain')
    { 
        if (record==null)
           msgs.get[msgs.get.length] = s;
        var sendk = parseInt(m.sid);
        if (sendk>MAXK) MAXK = sendk;
        var y = sek2tbl[sendk];
        var tbl = document.getElementById(y);
        if (tbl != null && m.msg != null)
        {
            var d = (new Date());
            var nowt = d.getTime()%10000000;
             
            var mi = d.getMinutes();
            var ms = '';
            if (mi < 10)
                ms = '0';
            var s = d.getSeconds();
            var ss = '';
            if (s < 10)
                ss = '0';
            var mmss =  ms + mi +":"  + ss+ s;
            var arr = m.msg.replace(/....$/,'').split(/#`@`/);
            var textarea = tbl.rows[2].cells[0].childNodes[0];
            var tt = y.substring(1).split(/_/);
            var i = parseInt(tt[0]);
            var k = parseInt(tt[1]);
            for (var p = 0; p < arr.length; p++)
            {
                if (arr[p].indexOf('pb') == 0 || arr[p].indexOf('eb') == 0)
                {
                    leaving[sendk] = d.getTime();
                } else if (arr[p].indexOf('pf') == 0 || arr[p].indexOf('ef') == 0 || arr[p].indexOf('cl') == 0)
                {
                    backing[sendk] = d.getTime();
                }
                if (arr[p].indexOf('lf') == 0)
                    textarea.value += mmss +  textmsg[1304].split(/@/)[2] + arr[p].replace(/[^0-9]/g, '') + '\n';
                else if (arr[p].indexOf('tx') == 0 ||  (arr[p].indexOf('cl') == 0))
                {
                    var seltxt = textmsg[16];
                    if (arr[p].charAt(0)=='t')
                        seltxt = textmsg[83];
                    textarea.value += mmss  +  seltxt + '\n';
                    arr[p] = arr[p].substring(2);
                    var kk = parseInt(arr[p].replace(/:.*/, ''));
                    if (kk > maxqn) maxqn = kk;
                    var z = arr[p].replace(/[0-9]+:/, '');
                    answers[i][k][kk] = z;
                    ismultiple[i][k][kk] = (arr[p].indexOf('cl') == 0)?'4':'0';
                    if (takentime[i][k][kk]==null)
                      takentime[i][k][kk]= 0;
                    else
                      takentime[i][k][kk] += nowt - lasttime[i][k];
                    lasttime[i][k] = nowt;
                }
                else if (arr[p].indexOf('ak') == 0 )
                {
                    textarea.value += mmss + textmsg[449]  + '\n';
                    if (requests[i][k]==null) 
                        requests[i][k] = '';
                    requests[i][k] += '<div style=width:100%;color:#008800;font-size:' + font_size + 'px;font-family:'+myfontname + '>&darr;'+arr[p].substring(2)+'</div>';
                    if (chatting[i][k] == null || chatting[i][k] == false)
                    {   
                        chat(i,k);
                    }
                    else
                    {
                        appendmsg(i,k);
                    } 
                }
                else 
                {
                    textarea.value += mmss  +  arr[p]  + '\n';
                }
            }
            textarea.scrollTop = textarea.scrollHeight;
            if (showinganswer=="" + i)
            {
                seeanswers(i);
            }
            else if (showinganswer== i + "_" + k)
            {
                seeanswers(i,k);
            }
        }
    }
    return true;
} 

function notify(i)
{
   var rids = '';
   for (var k=0; k < NS[i]; k++)
   {
       rids += ',' + studentsek[i][k];
   }
   
   myprompt(textmsg[1484] ,"","sendmsg1(v," + i + ",-1,'" + rids.substring(1)  + "','" + tids[i] + "')",textmsg[1791]);
   var btn = promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[2].cells[0].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('input')[1]; 
   btn.value = textmsg[223];
}

function chat(i, k)
{
    if (chatting[i][k]) return;
    chatting[i][k] = true;
    var tbl = document.getElementById('s' + i + '_' + k);
    var tr0 = tbl.rows[0];
    var td0 = tr0.insertCell(-1);
    td0.style.cssText = 'background-color:' + BBGCOLOR;
    td0.width = 250;
    td0.innerHTML = '<textarea style=width:250px;height:' + (tr0.cells[0].getElementsByTagName('img')[0].offsetHeight-2) + 'px  ></textarea>';
    var tr1 = tbl.rows[1];
    var td1 = tr1.insertCell(-1);
    td1.width = 250;
    td1.style.cssText = 'color:#111111;background-color:' + BBGCOLOR;
    td1.innerHTML =  '<center><input class=GreenButton style=width:70px;text-align:center value="' + textmsg[223] + '" onclick=sendmsg(' + i + ',' + k + ')><input class=GreenButton style=width:70px;text-align:center value="' + textmsg[18] + '" onclick=cancel(' + i + ',' + k + ')></center>';
    var tr2 = tbl.rows[2];
    var td2 = tr2.insertCell(-1);
    td2.width = 250;
    td2.style.cssText = 'font-family:' + myfontname + ';font-size:' + (font_size-2) + 'px;background-color:' + BBGCOLOR +';border-radius:3px;border:1px #aaaaaa solid';
    var xs = requests[i][k]; if (xs==null) xs = '';
    td2.innerHTML = xs;
    td2.vAlign='top'
}
function syn(z, explicit, em1)
{
    if (thisk>=0)
       myprompt(textmsg[778],null,"if(v)sendemail("+thisi +"," +thisk +")");
    else
    {
        myprompt(reportstr,null,null,reportw);
        if (''+guessedReportformat =='2')
            LaTexHTML.formatele(promptwin);
        promptwin.style.width = '800px';
        promptwin.style.height = '600px';
        promptwin.style.left = '0px';
        promptwin.style.top = '0px';
        new ResizeRounded(promptwin,function(td,dx,dy)
        {
            var tbl0 = document.getElementById('anscont');
            var l = parseInt(tbl0.style.width.replace(/px/i,'')) + dx;
            tbl0.style.width = (l) + 'px';
            tbl0.parentNode.width = l;
            tbl0.parentNode.parentNode.paretNode.parentNode.width = (l+3); 
            td.style.height = ( td.offsetHeight + dx) + 'px';
        });
    }
    
}
function cancel(i,k)
{
    if (chatting[i][k]==false) return;
    var tbl = document.getElementById('s' + i + '_' + k);
    tbl.rows[0].deleteCell(1);
    tbl.rows[1].deleteCell(1);
    tbl.rows[2].deleteCell(1);
    chatting[i][k] = false;
}
function sendemail(i,k)
{
    var tbl = document.getElementById('s' + i + '_' + k);
    var textarea = tbl.rows[0].cells[1].getElementsByTagName('textarea')[0];
    var thismsg = textarea.value;
    var nms = ['email','Subject','Content','securitytoken', 'orgnum'];
    var vls = [studentemail[i][k],TL[i]+":"+assignnames[i],thismsg,securitytoken,orgnum];
    postopen('Email',nms, vls, "w"  + tstmp);
}
var previousout = '';
function appendmsg(i,k)
{
    var disp = document.getElementById('s' + i + '_' + k);
    LaTexHTML.deformat(disp.rows[2].cells[1]);
    disp.rows[2].cells[1].innerHTML = requests[i][k];
    LaTexHTML.formatele(disp.rows[2].cells[1]);
}
function sendmsg(i,k)
{
    thisk = k;
    thisi = i;
    var tbl = document.getElementById('s' + i + '_' + k);
    var txt = tbl.rows[0].cells[1].getElementsByTagName('textarea')[0];
    var rid = studentsek[i][k];
    var zz = txt.value;
    if (rid==null || rid=='')
    {
       zz = "u'" + TL[i]+":"+assignnames[i] + "','" + zz.replace(/'/g,"''") + "','" + guessFormat(zz) + "','"
            + subdbs[i] + "','','" + studentid[i][k] + "'";
       
       var nms = ['rdap','rsacode','subdb','wcds','securitytoken', 'orgnum'];
       var vls = ['messagenew','0',subdbs[i], zz,  securitytoken,  orgnum];
       requests[i][k] += '<div style=width:100%;color:#000011;font-size:' + (font_size-2) + 'px;font-family:'+myfontname + '>&uarr;(' +textmsg[388] + ')' + txt.value + '</div>';
       postopen('SaveBack',nms, vls, "w" + tstmp);
       
    }
    else
    {
       requests[i][k] += '<div style=width:100%;color:#000011;font-size:' + (font_size-2) + 'px;font-family:'+myfontname + '>&uarr;' + txt.value + '</div>';
       sendmsg1(zz,i, k,rid,tids[i]);
    }
    appendmsg(i,k);
    txt.value = '';
}
 
 
function sendmsg1(v,j, k,rid,tid)
{
    if (k==-1)
    {
        for (k=0; k < NS[j]; k++)
          requests[j][k] += '<div style=width:100%;color:#000011;font-size:' + (font_size-2) + 'px>&uarr;' + v  + '</div>'  
    }
    if (rid==null)
    {
       Msg.key = keystr[j];
       Msg.send({code:'reply',rid:null,sid:uid, tid:tid,msg:v});
    }
    else
    {
       
        var rids = rid.split(/,/);
        for (var i=0; i < rids.length; i++)
        {  
            if(rids[i]!=null && rids[i]!='null' && rids[i]!='undefined')
            {
                Msg.key = keystr[j];
                Msg.send({code:'reply',rid:rids[i],sid:uid, tid:tid,msg:v});
            }
        }
    }
}
var sname = null;
function revokeanswer(i)
{
    loadedanswer[i] = 1;
    seeanswers(i);
}
function revokequestion(i)
{
    loadedquestion[i] = 1;
    seeanswers(i);
}
function TestSheet()
{
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
};
let testsheet = new TestSheet();
function ismult(i,k,s)
{
    let t, t1, t2;
    if (questions[i]!=null && (t = questions[i][k])!=null && (t1 = t.replace(/\n[a-z][ |\.|:|,|\-|\)]/,''))!== t &&  (t2 = t1.replace(/\n[a-z][ |\.|:|,|\-|\)]/,''))!== t1)
        return true;
    if (references[i]!=null && (t = references[i][k])!=null && (t1 = t.replace(/^[a-z][ |\.|:|,|\-|\)]/,''))!== t)
        return true;
    if (s!=null&&s.length==1 || s!=null &&  (t = s.replace(/^[a-z][ |\.|:|,|\-|\)]/,''))!== s)
        return true;
    return true;
}
function seeanswers(i,jj,sname1)
{
    if (onbeforeunload == null)
        onbeforeunload = nosaved;
    var needload = (jj==null && (proctorrole=='instructor' || proctorrole=='ta'));
    var showinganswer1 = "" + i;
    thisi = i;
    if (jj!=null) 
    {
        var tbl = document.getElementById('s' + i + '_' + jj);
        if (sname1!=null) 
            sname= sname1;
        else
            sname = studentname[i][jj];
       
        showinganswer1 += "_" + jj;
    }
    else sname = null;
     
    var lab1 = textmsg[139];
    if (loadedquestion[i] == 2) lab1 = textmsg[178] + "/" + lab1;
    if (loadedanswer[i] == 2)lab1 =  lab1+ "/" + textmsg[144]  ;
    var s = '<table border=1 cellpadding=3 width=100% style=border-collapse:collapse;border-color:#aaaaaa;background-color:'+ TBGCOLOR +';font-family:' + myfontname + '><tr style="background:' + beheading + '"><td align=right width=' + (4*font_size) + ' style=white-space:nowrap>'+textmsg[998] + '</td><td align=left>'+lab1 + (jj!=null?'':('<span style=float:right>' + textmsg[1790] + '</span>')) + '</td><td align=right  width=' + (4*font_size) + '>'+textmsg[1267] + '</td><td align=left  width=' + (4*font_size) + '>'+textmsg[156] + '</td></tr>';
    var hasone = false; 
    for (var k=1; k <= maxqn; k++)
    {
        if (pointing[i][k] ==null) pointing[i][k] = new Array();
        var dis = new Array(),dis1 = new Array();
        var fq = new Array();
        var j1=0;if (jj!=null) j1=jj;
        var j2 = NS[i]; 
        if (jj!=null) j2 = jj+1;
        var timetaken = 0;
        var nnnull = 0; 
        for (var j=j1; j < j2 ; j++)
        {
            if (answers[i]!=null && answers[i][j]!=null && answers[i][j][k]!=null)
            {
                let simp = testsheet.convert2(answers[i][j][k],ismult(i,k,answers[i][j][k])?-2:1);
                nnnull++;
                hasone = true;
                timetaken += takentime[i][j][k];
                var l=0;
                for (; l < dis.length; l++)
                    if (testsheet.thesame(simp, dis1[l])) break;
                if (dis.length>0 && l < dis.length) 
                    fq[l]++;
                else
                {  
                    dis[l] = answers[i][j][k];
                    dis1[l] = simp;
                    pointing[i][k][l] = j;
                    fq[l] = 1;
                }    
            }
        }
        if (nnnull>0) timetaken /= nnnull;
        timetaken = Math.round(timetaken/6000)/10;
        var timestr = ''+ timetaken;
        timestr = timestr.replace(/\.([0-9]).*/,".$1");
        if (timestr.indexOf(".")<0) timestr += ".0";
        if (dis.length== 0) continue;
        var vv = '';
        if (jj==null && loadedquestion[i]==2)
            vv = "<div style=color:#008800;font-family:inherit >" + questions[i][k] + "</div>";
        
        for (var l=0; l < dis.length; l++)
            vv += dis[l] +  (jj!=null?"":(' `' + fq[l] + '``' + l + '@'));
        if (jj==null && loadedanswer[i]==2)
            vv += "<div id=w"+ k +" style=color:#008800;font-family:inherit onclick=backold(" + i + "," + k +")>" + references[i][k] + "</div>";
        answerstr[i][k] = vv;
        if (fmts[i][k] == null || fmts[i][k]=='')
           fmts[i][k] = guessFormat(vv);
        vv = formatstr(vv,fmts[i][k]);
        var zz = '';
        
        if(needload && loadedanswer[i] == 2)
        {
            zz = vv.replace(/`([0-9]+)``([0-9]+)@/g,'<span id=g'+ k + '_$2 style=float:right;color:blue;white-space:nowrap >[$1]<span style=color:blue;transform:rotate(90deg)  onclick=adapteAsAnswer(' + i + ',' + k + ',' +'$1)>$</span><input size=2 onblur=cacheit(this,' + i + ',' + k + ',$2) onkeypress="return cacheit1(this,event,' + i + ',' + k + ',$2)" ></span><br>');
        } 
        else
            zz = vv.replace(/`([0-9]+)``([0-9]+)@/g,'<span style=float:right>[$1]</span><br>'); 
        s += '<tr><td valign=top align=right>' + k + '</td><td align=left>'+ zz + '</td><td align=right valign=top  width=' + (4*font_size) + '>'+timestr + '</td><td valign=top ><select style="background-color:' + TBGCOLOR +';font-family:' + myfontname + ';font-size:' + font_size + 'px" onchange=reformat(this,' + i + ',' + k + ')><option value=0 style=background-color:' + TBGCOLOR +' ' + ((fmts[i][k]=='0'?'selected':'')) +'>' + textmsg[83] + '</option><option   style=background-color:' + TBGCOLOR +'   value=1 ' + ((fmts[i][k]=='1'?'selected':'')) +'>HTML</option><option   style=background-color:' + TBGCOLOR +'  value=2 ' + ((fmts[i][k]=='2'?'selected':'')) +'>LaTex</option></select></td></tr>';
    }
    s += '</table>'; 
    if (sname1=='') return s;
    var tbl = document.getElementById('anscont');
    var loadstr = '';
    if (needload)
    {
        var clr1 = 'blue'; if (loadedquestion[i]==2) clr1 = "#000000";
        var clr2 = 'blue'; if (loadedanswer[i]==2) clr2 = "#000000";
        loadstr = "<a  href=javascript:loadquestions(" + i + ")><font color=" +clr1 + ">" + textmsg[178]  +  "</font></a>" + (loadedquestion[i]!=2?'':("<a href=javascript:revokequestion(" + i + ") > [X]</a>")) + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href=javascript:loadanswers(" + i + ")><font color=" +clr2 + ">" + textmsg[144] +"</font></a>" + (loadedanswer[i]!=2?'':("<a href=javascript:revokeanswer(" + i + ") > [X]</a>"))  ;
    }
   
    var saveforstr = '';
    if (jj!=null)  
        saveforstr = "<a href=javascript:saveforstudent(" + i + "," + jj + ")>" + textmsg[119] + "</a>&nbsp;&nbsp;&nbsp;";
    
    if ( promptwin==null || tbl == null || showinganswer!=showinganswer1 ) 
    {  
        if (showinganswer!=showinganswer1 && showinganswer!='')
            closeprompt();
        showinganswer=showinganswer1;
        var title = textmsg[139] + ": " + ((sname==null)?TL[i]:sname);
        if ( jj==null || studentsek[i][jj]!=null)
           myprompt('<div><div id=anscont style=width:600px >' + s + '</div><center>' + saveforstr +  (needload?('<span id=loadqa>'+ loadstr + '</span>'):'') + '</center></div>',null,null,title);
        else
           myprompt(studentname[i][jj] + " " + textmsg[597] + "<br><br>" + studentid[i][jj] + "<br>" + studentname[i][jj] + "<br>" + studentphone[i][jj] + "<br>"
               + studentemail[i][jj]  )
        promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].onclick = function()
        {
            if (showinganswer[thisi]==''+thisi && loadedanswer[thisi] == 2 && proctorrole=='instructor') updateanswers(thisi);
            showinganswer = "";
            closeprompt();
        }
        
        promptwin.style.left = '6px';
        promptwin.style.top = '90px'
        tbl = document.getElementById('anscont');
        if (tbl!=null)
        {
            tbl.style.width='800px';
            new ResizeRounded(promptwin,function(td,dx,dy){
            var tbl0 = document.getElementById('anscont');
            tbl0.style.width = (parseInt(tbl0.style.width.replace(/px/i,'')) + dx) + 'px';
           })
        }
    }
    else 
    {
        LaTexHTML.deformat(tbl);
        tbl.innerHTML = s ;
        if (needload)
        {
            document.getElementById('loadqa').innerHTML = loadstr; 
        }
        
    }
    if (tbl!=null && tbl.getElementsByTagName('table')!=null)
    {
    var tbl1 = tbl.getElementsByTagName('table')[0];
    for (var p =1; p < tbl1.rows.length; p++)
    {
        var kk = parseInt(tbl1.rows[p].cells[0].innerHTML);
        
        if (''+fmts[i][kk] == '2')
        {
            LaTexHTML.formatele(tbl1.rows[p].cells[1]);
        }
    }
    }
    
}

function saveforstudent(i, k)
{
    var sofar = '';
    for (var j=0; ; j++)
    {
       if (answers[i][k][j] == null ) break;
       if (sofar != '')  sofar += "\n";
        if (answers[i][k][j].indexOf(",") >= 0 || answers[i][k][j].indexOf("\r") >= 0 || answers[i][k][j].indexOf("\n") >= 0)
           sofar +=   i + ",'" + answers[i][k][j].replace(/'/g, "''") + "'";
        else
           sofar +=   i + "," + answers[i][k][j];
        var fmt = ismultiple[i][k][j];
        if (fmt=='0') fmt = guessFormat(answers[i][k][j]);
        sofar +=  ',' + takentime[i][k][j]  + ',' + fmt;
        sofar += "," + i  + ",-1"  ;
    }
    sofar = sofar.replace(new RegExp("\\[" + textmsg[1303] + "([0-9]+)","ig"),"[Imagelet$1"); 
    
    var nms = ['rdap','noanswer','subdb','sid','assignname','sessionname','securitytoken','course','Content','semester','attach'];
    var vls = ['submissionsave','-2',subdbs[i],studentid[i][k],assignnames[i], sessionnames[i], securitytoken,cids[i],sofar,semester,''];
    postopen('DataUpdate',nms,vls,  "w" + tstmp);
}

function reformat(sel, i, k)
{
    var jj = sel.selectedIndex;
    var td = sel.parentNode.parentNode.childNodes[1];
    if (fmts[i][k] == '2')
    LaTexHTML.deformat(td);
    fmts[i][k] = sel.options[jj].value;
    var vv = formatstr(answerstr[i][k],fmts[i][k]);
    var zz = '';
    if(jj==null && loadedanswer[i]==2 && proctorrole[i]=='instructor')
    {
        zz = vv.replace(/`([0-9]+)`/g,'<span style=float:right;white-space:nowrap>[$1]<span style=color:blue;transform:rotate(90deg)  onclick=adapteAsAnswer(' + i + ',' + k + ',' +'$1)>$</span><input size=2 onblur=cacheit(this,' + i + ',' + k + ',$2) onkeypress="return cacheit1(this,event,' + i + ',' + k + ',$2)" ></span><br>');
    } 
    else
       zz = vv.replace(/`([0-9]+)`/g,'<span style=float:right>[$1]</span><br>'); 
    td.innerHTML = zz;
    if (fmts[i][k] == '2')
    LaTexHTML.formatele(td);
}
function cacheit(tx,i, k, l)
{
    var j =   pointing[i][k][l];
    //references[i][k] = answers[i][j][k];
     
}
function cacheit1(tx,evt,i, k, l)
{
    var j =   pointing[i][k][l];
   // references[i][k] = answers[i][j][k];
     
}
function adapteAsAnswer(i, k, l)
{
    var j =   pointing[i][k][l];
    references[i][k] = answers[i][j][k];
    document.getElementById('g' + k + '_' + l).style.color = '#000000';
    var w = document.getElementById('w' + k );
    w.style.color = 'blue';
    LaTexHTML.deformat(w);
    w.innerHTML = formatstr(references[i][k],fmts[i][k]);
    if (''+fmts[i][k] == '2')
    LaTexHTML.formatele(w); 
}
function backold(i,k)
{
    
    var l=0;
    for (; l < pointing[i][k].length; l++)
    {
        var j = pointing[i][k][l];
        if (references[i][k] == answers[i][j][k])
            break;
    }
    var q = document.getElementById('g' + k + '_' + l);
    if (q!=null)
    {
        q.style.color = '#0000FF';
    }
    var w = document.getElementById('w' + k );
    w.style.color = '#008800';
    LaTexHTML.deformat(w);
    references[i][k] = oldanswers[i][k];
    w.innerHTML = formatstr(references[i][k],fmts[i][k]);
    if (''+fmts[i][k] == '2')
    LaTexHTML.formatele(w); 
}

function integrateAnswer(ans,fmt,question)
{
   var hw = new Hwtake('grad',question,  ans , "", "",  fmt, 1); 
   references[thisi] = hw.answqrr;
   oldanswers[thisi] = new Array();
   for (var j=0; j < references[thisi].length; j++)
      oldanswers[thisi][j] = references[thisi][j];
   questions[thisi] = hw.questarr;
   if (loadedanswer[thisi]==0) loadedanswer[thisi] = 1;
   if (loadedquestion[thisi]==0) loadedquestion[thisi] = 1;
   seeanswers(thisi);
}

function loadanswers(i)
{
   if ( loadedanswer[i]==0) 
   {
   thisi = i;
   loadedanswer[i] = 2;
   var nms = ['mode','cid','assignname','sessionname','securitytoken','subdb'];
   var vls = ['answer',cids[i],assignnames[i], sessionnames[i], securitytoken,subdbs[i]];
   postopen('proctor.jsp',nms,vls,  "w" + tstmp);
   }
   else
   {    loadedanswer[i] = 2;
           seeanswers(i);
   }
}
function loadquestions(i)
{
   if (   loadedquestion[i] == 0) 
   {
   loadedquestion[i] = 2;
   thisi = i;
   var nms = ['mode','cid','assignname','sessionname','securitytoken','subdb'];
   var vls = ['answer',cids[i],assignnames[i], sessionnames[i], securitytoken,subdbs[i]];
   postopen('proctor.jsp',nms,vls,  "w" + tstmp);
   }
   else
   {
       loadedquestion[i] = 2;
       seeanswers(i);
   }
}
var rg = new RegExp("'","g"); 
function updateanswers(i)
{
    if (proctorrole!='instructor'||loadedanswer[i]<2) return;
    var zz = '';
    var nc = false;
    for (var k=0; k < references[i].length || k <= maxqn; k++)
    {
        if (references[i][k]!=oldanswers[i][k] && nc == false) nc = true;
        if (references[i][k]!=null)
            zz += k + "." + references[i][k].replace(/\n([0-9]+)/g,'\n $1') + "\n";
    }
    if (zz=='' || nc==false) return;
    var zz = "u,,,,,,,,'" + zz.replace(rg, "''")+ "',,,,,,,,,'" +assignnames[i].replace(rg, "''")+ "','" + sessionnames[i].replace(rg, "''")+ "','" + cids[i].replace(rg, "''")+ "','" +semester + "'";
    
    var nms = ['rdap','rsacode','subdb','wcds','securitytoken', 'orgnum'];
    var vls = ['assignedit','0',subdbs[i], zz,securitytoken,orgnum];
    postopen('SaveBack',nms, vls, "w"  + tstmp);
}

function  expire()
{
    for (let k of keystr)
    {
       Msg.key = k;
       Msg.send({tid:tids[stopi],msg:(">>>expire1"),code:'plain',rid:''});
    }
}

function report(i)
{
    var str = "<h2>" + cids[i] + "-" + sessionnames[i] + ":" + assignnames[i] + " " + reportw + "</h2>";
    str +=  "<table  cellpadding=3 ><tr><td><div style=font-weight:700;font-family:" + myfontname + ";font-size:20px;float:left>A." +
    textmsg[139] + "</div></td></tr><tr><td id=anscont style=width:600px >" + seeanswers(i,null,'')
    + "</td></tr><tr><td><br><div style=display:block;font-weight:700;font-family:" + myfontname + ";font-size:20px;float:left>B." +
    textmsg[1794] + "</div></td></tr><tr><td>";
    var hascomm = false;
    for (var k=0; k < NS[i]; k++)
    {
        if (requests[i][k]!=null && requests[i][k]!='')
        {    
            str += "<div style=\"float:left;display:inline-block;background-color:" + TBGCOLOR +";border:1px #aaaaaa solid;border-radius:3px;width:250px\"><div  style=\"font-weight:700;background:" + beheading + "\">" + studentname[i][k] + "</div>"  + requests[i][k] + "</div>"; 
            hascomm = true;
        }
    }
    if (hascomm == false)
        str += textmsg[801];
    str += "</td></tr><tr><td><br><div style=display:block;font-weight:700;font-family:" + myfontname + ";font-size:20px;float:left>C." +
    textmsg[1793] + "</div></td></tr><tr><td>";
    for (var k=0; k < NS[i]; k++)
    {
         var tbl = document.getElementById('s' + i + '_' + k);
         var textarea = tbl.rows[2].cells[0].childNodes[0];
         str += "<div style=\"display:inline-block;float:left;background-color:" + TBGCOLOR +";border:1px #aaaaaa solid;border-radius:3px;width:100px\"><div  style=\"font-weight:700;background:" + beheading + "\">" + studentname[i][k] + "</div>"  + textarea.value.replace(/\n/g,'<br>') + '</div>'; 
    }
    str +=   "</td></tr></table>";
     var subject = cids[i] + "-" + sessionnames[i] + ":" + assignnames[i];
     guessedReportformat =   guessFormat(str);
     reportstr = str = str.replace(/'/g,"''");
     subject   = subject.replace(/'/g,"''");
     thisk = -1;
     var zz = "u'" + subdbs[i] +  "','" + subject  + "','"  + str  + "','" + guessedReportformat  + "','','" + str + "','" + guessedReportformat + "','','" + subject   + "','" + subdbs[i] + "'";
     var nms = ['rdap','rsacode','subdb','wcds','securitytoken', 'orgnum'];
     var vls = ['messagesend','0',subdbs[i], zz,securitytoken,orgnum];
     postopen('SaveBack',nms, vls, "w"  + tstmp);
     
     let absence = '';
     for (var k=0; k < NS[i]; k++)
     {
         var tbl = document.getElementById('s' + i + '_' + k);
         var textarea = tbl.rows[2].cells[0].childNodes[0];
         if (textarea.value.replace(/ /g,'') === '')
         {
            if (absence !== '') absence += ";";
            absence += cids[i] + ":" + sessionnames[i] + ":" + assignnames[i] + ":" + studentid[i][k] + ":" + studentname[i][k]  ;
         }
     }
    localStorage['proctor-' + keystr[i] ] = JSON.stringify(msgs);
    nms = ['mode','subdb','absence','securitytoken', 'orgnum'];
    var vls = ['absence',subdbs[i], absence,securitytoken,orgnum];
    postopen('proctor.jsp',nms, vls, "w"  + tstmp);
    onbeforeunload = null;
     //'@@Subject@@','@@Message@@', 0,'@@Format@@','@@subdb@@','@@Attachment@@' FROM AppUser WHERE   LOCATE(id,'@@To@@'
}
window.onbeforeunload = function(){
    localStorage['proctor-' + keystr[0] ] = JSON.stringify(msgs);
    return textmsg[1693];
}

function showresults(c,s,a,i,n)
{
    if (promptwin == null)
    {
        if (s == null)
        {
            myprompt('<table cellpadding=4 ><tr><td colspan=5>' + c + '</td></tr></table>');
        }
        else
        {
             myprompt('<table cellpadding=4 ><tr><td>' + c + '</td><td>' + s + '</td><td>' + a + '</td><td>' + i + '</td><td>' + n + '</td></tr></table>');
        }
    }
    else
    {
        let y = getpromptmsg().replace(/<.table>/,'');
        if (s == null)
        {
            myprompt( y + '<tr><td colspan=5>' + c + '</td></tr></table>');
        }
        else
        {
             myprompt(y + '<tr><td>' + c + '</td><td>' + s + '</td><td>' + a + '</td><td>' + i + '</td><td>' + n + '</td></tr></table>');
        }
    }
     
}

 


