
/*var Exchange = 
{ 
    socket : null,
    ready:false,
    sendbuffer:'',
    connect : function(host) 
    {
        if ('WebSocket' in window) 
        {
            Exchange.socket = new WebSocket(host);
        } else if ('MozWebSocket' in window) 
        {
            Exchange.socket = new MozWebSocket(host);
        } else 
        {
            Console.log('Error: WebSocket is not supported by this browser.');
            return;
        }
        Exchange.socket.onopen = function () 
        {
            Exchange.ready = true;
            if (Exchange.sendbuffer!='')
            Exchange.sendMessage(Exchange.sendbuffer);
            
        };

        Exchange.socket.onclose = function () 
        {
            fm.sendbtn.style.background = 'grey';
            
            Exchange.socket = null;
            Exchange.ready = false;
        };

        Exchange.socket.onmessage = function (message) 
        {
            execreturn(message.data);
            go.lasttime = (new Date()).getTime();
            return false;
        };
    },
    close: function()
    {
        if (Exchange.socket!=null )
        Exchange.socket.close();
    },
    initialize : function(msg) 
    {
        if (msg!=null)
        {
            Exchange.sendbuffer = msg;
        }
        else
            Exchange.sendbuffer = ''; 
        if (window.location.protocol == 'http:') 
        {
            Exchange.connect('ws://' + window.location.host + '/websock/websocket/chat');
        } else 
        {
            Exchange.connect('wss://' + window.location.host + '/websock/websocket/chat');
        }
    },
    sendmsg1:function(msg)
    {
        if (Exchange.socket == null) 
        Exchange.initialize(msg);
        else
        if (Exchange.sendMessage(msg))
            frash(0);
        go.lasttime = (new Date()).getTime();
    },
    sendMessage : function(message) 
    {
        if (Exchange.ready)
        {   
            try{Exchange.socket.send(message);
                Exchange.sendbuffer = '';
                return true;
            }catch(e){
                Exchange.sendbuffer = message;
                return false;
            }
        }
        else 
        {  
            Exchange.sendbuffer = message;
            return false;
        }
    }
};

var Console = 
{ 
    log : function(message) 
    {
        var console = $('resp');
        var p = document.createElement('p');
        p.style.wordWrap = 'break-word';
        p.innerHTML = message;
        console.appendChild(p);
        while (console.childNodes.length > 25) 
        {
            console.removeChild(console.firstChild);
        }
        console.scrollTop = console.scrollHeight;
    } 
}

document.addEventListener("DOMContentLoaded", function() {
    // Remove elements with "noscript" class - <noscript> is not allowed in XHTML
    var noscripts = document.getElementsByClassName("noscript");
    for (var i = 0; i < noscripts.length; i++) {
        noscripts[i].parentNode.removeChild(noscripts[i]);
    }
}, false);
*/
function $(x){return document.getElementById(x);}
var fm = document.f;
var Exchange = 
{
    mode:'',
    id : -1,
    act:'',
    ready:true,
    messages:null,
    receiver:new XMLHttpRequest(),
    init:function()
    {
        Exchange.act = '';
        Exchange.mode = '';
        Exchange.ready = true;
        Exchange.id = -1;
    },
    startrecev : function()
    {
        if (Exchange.id < 0)
            return;
        Exchange.receiver.open('GET', "../websock/WsMessage?id=" + Exchange.id  + "&mode=" + Exchange.mode, true);
        Exchange.receiver.send();
    },
    
    sendMessages : function (msgs,mode)
    {
        if (msgs==null || msgs.length == 0) return;
        Exchange.messages = msgs;
        Exchange.sendMessage(Exchange.messages[0],mode);
        Exchange.messages.splice(0,1);
    },
    sendMessage : function (msg,mode)
    {
        if (Exchange.ready && msg != null)
        {
            let k = msg.indexOf('&act=');
            if (k >=0) 
            {
                let j = msg.indexOf("&",k+2);
                if (j==-1)
                {
                    Exchange.act = msg.substring(k+5);
                }
                else
                    Exchange.act = msg.substring(k+5,j);
            }
            Exchange.mode = mode;
            Exchange.ready = false;
            let oldv = fm.sendbtn.value;
            let b = fm.sendbtn.disabled;
            if (!b)fm.sendbtn.disabled = true;
            fm.sendbtn.value = "&bull;&bull;&bull;&bull;&bull;";
            postopen("../websock/WsMessage", ['msg'],["&mode=" + Exchange.mode +  (msg.indexOf("&id=")<0? ("&id="+ Exchange.id):"") +  msg],"w"+tstmp);
            fm.sendbtn.disabled = b;
            fm.sendbtn.value = oldv;
            go.lasttime = (new Date()).getTime();
            frash(0);
        }
    },
    serverReturn : function(id)
    {
        Exchange.ready = true;
        if (Exchange.id ==-1 && id>-1)
        {
           nomsgcount = 0;
           if (Exchange.mode == '')
              go.id  = id;
           Exchange.id = id;
           $('tdid').innerHTML = id;
           Exchange.startrecev();
        }
        else if (id == -1)
        {
            if (Exchange.mode == 'watch' && Exchange.act == 'book')
               wgone(gid);  
            go.id  = -1;
        }
        if (Exchange.messages!=null && Exchange.messages.length>0)
        {
            Exchange.sendMessage(Exchange.messages[0],Exchange.mode);
            Exchange.messages.splice(0,1);
        }
        else if (Exchange.messages!=null && Exchange.messages.length==0)
            Exchange.messages=null;
    }
};
 
Exchange.receiver.onreadystatechange = function()
{
    if (Exchange.receiver.readyState == 4 && Exchange.receiver.status == 200)
    {
       let y = Exchange.receiver.responseText;
          execreturn(y);
       if (y.indexOf('stopmsg()')!=0)
          Exchange.startrecev();
   }
};

const STONESIZE = CELLSIZE - 4; 
const NL = 19;
const BLACK = 'black';
const WHITE = 'white';
const TRANSPARENT = 'transparent';
const INIT = gokeyword[1];
const PAIRINGUP = gokeyword[24];
const GOINGON = gokeyword[25];
const DONECOUNT = gokeyword[19];  
const INCOUNTING = gokeyword[22];
const COMPLETE = "done";


const GO0 = 
{
   id:-1,
   myname:'',
   type:0,
   timecap:2,
   myrank:0,
   opponent:-1,
   opprank:0,
   oppname:'',
   mycolor:TRANSPARENT,
   oppcolor:TRANSPARENT,
   stone:new Array(),
   mytime:0,
   opptime:0,
   turn:'',
   result:0,
   lasttime:0,
   opennow:true,
   status:INIT,
   pixel:'',
   msg:'',
   listenmore:false,
   mycount:0,
   hcount:0
}
let goes = {};
let go = JSON.parse(JSON.stringify(GO0));
let typesel = $('type');
let timecapsel = $('timecap');
let ranksel = $('rank');
let playertbl = $('players');
let scoretbl = $('scores');
let msgboard = $('resp');
let gametypes = gokeyword[87].split(/@/);
let msgwidth = msgboard.offsetWidth - 17*4.5;
let lang = $('homeico').parentNode.cells[2];
let clickable = true;
let tryingid = '';
let gamestart = 0;
let himher=null;
let second1timer = null;
let second5timer = null;
let timelimit = 120;
let stepstart=0;
let delay = 0;
let bcounter = 0, wcounter=0, gcounter=0;
let replys = ",";
let negotiatingform = null;
let myuserid = ""; 
let numerically = 1;
let sortingcol;
let gamerows = new Array();
let headingcell;
let playerrow = new Array();

function openthis(id)
{
    if (id == go.id || go.status == GOINGON || go.status == INCOUNTING) 
    {
        myprompt('A game is going on');
        return;
    }
    let saved = localStorage["gogame"];
    if (saved!=null && saved!='')
    {
       go.opennow = false;
       if (go.opponent>-1)
       {   
           archive();
       }
       localStorage["gogame"] = JSON.stringify(goes);
       goes = JSON.parse(saved);
       go = goes[id];
       populate();
    }
}
function heights()
{
    if (go.opponent > -1 || go.id == -1)
    {
       $('playerdiv').style.height = playertbl.offsetHeight + 'px';
       $('playerdiv').style.overflow = ''; 
       msgboard.style.height = (370-playertbl.offsetHeight) +  'px';
       if (go.id == -1)
       {
           msgboard.innerHTML = "<h3><center><b>"+textmsg[1892].replace(/@/,'</b></center></h3><ol><li>').replace(/@/g,'<li>') + '</ol>';
       }
       enablemsg(go.id == -1);
    }
    else 
    {
       msgboard.style.height = '150px';
       $('playerdiv').style.height = '220px';
       $('playerdiv').style.overflow = 'scroll'; 
    }
}

function watchgame()
{
    if ($('watch').value == gokeyword[120])
    {
        go.listenmore = false;
        Exchange.sendMessage("&act=quit",'watch');
        Exchange.init();
        $('watch').value = gokeyword[111];
        $('newbtn').value = gokeyword[79];
        $('newbtn').style.visibility = 'visible';
    }
    else
    {
        if ($('myname').value == '')
        {
           $('myname').focus();
           myprompt1(gokeyword[116]);
           return;
        }
        Exchange.init();
        let s = '&act=list&name=' + $('myname').value + "&type="   + $('type').selectedIndex;
        Exchange.sendMessage(s,'watch');
    }
}
function populate1()
{
   setcolors(go.pixel);
   go.opennow = true;
   setcolor($('myclr'), go.mycolor);
   setcolor($('hisclr'),go.oppcolor);
   $('myname1').innerHTML = go.myname;
   $('hname').innerHTML =   go.oppname;
   $('myminute').innerHTML = go.mytime;
   $('hminute').innerHTML = go.opptime;
   $('mycount').innerHTML = go.mycount;
   $('hcount').innerHTML = go.hcount;
   let anchor = gokeyword[114].replace(/@[^@]+@/,'');
   msgboard.innerHTML = go.msg.replace(/BLACK/g,gokeyword[40]).replace(/WHITE/g,gokeyword[39]).replace(/anchor/g,anchor);  
   
   $('newbtn').style.visibility = 'hidden';
   if (go.turn=='me')
   {
       secondhandle = setInterval(readmyseconds,1000);
   }
   else
   {
       secondhandle = setInterval(readhseconds,1000);
   }
   $('type').selectedIndex = go.type;
   showresult();
   let str = "<select name=who  id=who><option value=" + 0 + ">"+  gokeyword[117]+ " "
   + gokeyword[40] + "</option><option value=" + 1 + ">"+  gokeyword[117]+ " "
   + gokeyword[39] + "</option><option value=\"2\">" +  gokeyword[117] + " "+ gokeyword[118]
   +"</option></select>";
   let sel = document.createElement('select');
   fm.myword.style.width = (msgwidth - 100) + 'px';
   fm.myword.parentNode.insertBefore(sel,fm.myword);
   fm.myword.style.width = (msgwidth - sel.offsetWidth-4) + 'px';
   sel.outerHTML = str ;
   enablemsg(true);
   $("watch").value = gokeyword[120];
}
function populate()
{
   if (go.id == -1)
       $('tdid').innerHTML = gokeyword[119];
   else 
       $('tdid').innerHTML = go.id;
   $('myname').value = go.myname;
   timecapsel.selectedIndex = go.timecap;
   ranksel.selectedIndex = go.myrank;
   for (let k=playertbl.rows.length-1; k>=2;k--)
        playertbl.deleteRow(k); 
   msgboard.innerHTML = go.msg + "<br>ends at "+(new Date(go.lasttime)).toDateString();
   setcolors(go.pixel);
   go.opennow = true;
   setcolor($('myclr'), go.mycolor);
   setcolor($('hisclr'),go.oppcolor);
   if (go.opponent>-1 && go.result==0)
   {
       $('newbtn').value = textmsg[821];
       $('result').innerHTML =  "<input id=newnewbtn class=GreenButton style=\"" +  $('newbtn').style.cssText
                 + "\" value=\"" + gokeyword[79] + "\" onclick=\"reinit();$('result').innerHTML=''\"  type=button >";
       heights();
   }
   else if (go.opponent>-1 && go.result!=0)
   {
       $('newbtn').value = gokeyword[79];
       heights();
   }
   else if (go.id >= 0 && go.opponent == -1)
   {
       $('newbtn').value = msg64;
       heights();
   }
   else if (go.id == -1)
   {
       $('newbtn').value = gokeyword[27];
       heights();
       if (go.mycolor!=BLACK && go.mycolor !=WHITE)
       {
           go.mycolor = BLACK;
           go.oppcolor = WHITE;
       }
       setcolor($('myclr'), go.mycolor);
       setcolor($('hisclr'),go.oppcolor);
   }
   
   $('hminute').innerHTML = go.opptime;
   $('myminute').innerHTML = go.mytime;
   if (go.myname == go.oppname)
    {
        $('myname1').innerHTML = gokeyword[74];
        $('hname').innerHTML = gokeyword[80];
    }
    else
    {
        $('myname1').innerHTML = go.myname;
        $('hname').innerHTML = go.oppname;
    }
    
    $('plate').style.display = 'block';
   if (go.result!=0)
       showresult();
}

function onbegin()
{
    let saved = localStorage["gogame"];
    let m = -1, j=-1;
    if (saved!=null && saved!='')
    {
       goes = JSON.parse(saved); 
       let ar = Object.keys(goes);
       for (let ky of ar) 
       {
           let g = goes[ky];
           if (g == null) 
           {
               continue;
           }
           if (g.opennow == false && g.result == 0)
           {
               if (g.lasttime > m)
               {
                   m = g.lasttime;
                   j = g.id;
               }
           }
           else
           {
               go.name = g.name;
               go.rank = g.rank;
               go.type = g.type;
               go.timecap = g.timecap;
           }
       }
       if (j!=-1)
       {
           go = goes[j];
           populate();
           localStorage['gogame'] = JSON.stringify(goes);
           if (go.opponent == -1)
           {
               newgame(go.id);
           }
           else if (go.result == 0)
           {
               //resumeold();
               $('newbtn').value = textmsg[821];
                $('result').innerHTML = 
                 $('newbtn').outerHTML.replace(/id=[^ ]+/, " id=newnewbtn").replace(/onclick=[^ ]+/, " onclick=reinit()").replace(/value=[^ ]+/, " value=\"" + gokeyword[79] + "\" ")
                ; 
            }
       }
       else
       {
           populate();
       }
   }
   if (go.id == -1)
   {
       msgboard.innerHTML = "<h3><center><b>"+textmsg[1892].replace(/@/,'</b></center></h3><ol><li>').replace(/@/g,'<li>') + '</ol>';
       $('playerdiv').style.height = playertbl.offsetHeight + 'px';
       $('playerdiv').style.overflow = '';
       msgboard.style.height = (370-playertbl.offsetHeight) + 'px';
       msgwidth = msgboard.offsetWidth - 80;
       
   }
   enablemsg(go.id > -1);
}

function gamelist()
{
    gamerows = new Array();
    let xs = msg1520.split(/@/);
    let saved = localStorage["gogame"];
    if (saved!=null && saved!='')
    {
       goes = JSON.parse(saved); 
       let s = '<table id=allgame class=outset3 border=1 style=border-collapse:collapse><tr ><td style=white-space:nowrap align=right onclick=sort1(0,1)>' + gokeyword[75] + '</td><td  onclick=sort1(1,0) style=white-space:nowrap align=left>' +  gokeyword[73]+'/'+gokeyword[74] + '</td><td  onclick=sort1(2,0) style=white-space:nowrap align=left>' +   textmsg[452] + '</td>';
       s += "<td style=white-space:nowrap  onclick=sort1(3,0)>" + gokeyword[82] + "</td><td style=white-space:nowrap  align=right  onclick=sort1(4,1)>" +xs[0] + "</td><td colspan=2  align=center  onclick=sort1(6,0) style=white-space:nowrap >" +gokeyword[80] + "</td><td  onclick=sort1(7,1) style=white-space:nowrap align=right>" +xs[1] + "</td><td  onclick=sort1(8,1)  align=right style=white-space:nowrap >" +xs[2] + "</td><td  style=white-space:nowrap >" +xs[3] + "</td><td  style=white-space:nowrap >" +xs[4] + "</td></tr>"
       for (let ky in goes) 
       {
           let g = goes[ky];
           if (g==null)continue;
           gamerows[gamerows.length] = [g.id,g.myname, g.type,g.mycolor,g.mytime,g.opponent,g.oppname,g.opptime,g.result];
           s += "<tr " + (g.id == go.id? "bgcolor=yellow":"") + "><td  align=right>" + g.id + "</td><td  align=left>" + g.myname + "</td><td align=left>" + typesel.options[g.type].text + "</td><td align=center><img src=image/" + g.mycolor + "stone.png style=margin:0px;border:0px;width:16px ></td><td  align=right>" + g.mytime + "</td><td  align=right>" + g.opponent + "</td><td align=left>" + g.oppname + "</td><td  align=right>" + g.opptime + "</td><td  align=right>" + g.result + "</td><td  align=center onclick=openthis(" + g.id + ")> >> </td><td align=center onclick=deletethis(" + g.id + ",this)> >> </td></tr>";
       }
       s += "</table>";
       myprompt1(s,null,null,xs[5]);
    }
    else
       myprompt1(xs[6],null,null,xs[5]);
    let tb = $('allgame');
    if (tb!=null)
      tb.rows[0].style.backgroundImage = 'linear-gradient(' + BBGCOLOR + "," + DBGCOLOR + ")";
}
function gamelist1()
{
    let xs = msg1520.split(/@/);
    let s = '<table id=allgame class=outset3 border=1 style=border-collapse:collapse><tr><td style=white-space:nowrap align=right onclick=sort1(0,1)>' + gokeyword[75] + '</td><td  onclick=sort1(1,0) style=white-space:nowrap align=left>' +  gokeyword[73]+'/'+gokeyword[74] + '</td><td  onclick=sort1(2,0) style=white-space:nowrap align=left>' +   textmsg[452] + '</td>';
       s += "<td style=white-space:nowrap  onclick=sort1(3,0)>" + gokeyword[82] + "</td><td style=white-space:nowrap  align=right  onclick=sort1(4,1)>" +xs[0] + "</td><td colspan=2  align=center  onclick=sort1(6,0) style=white-space:nowrap >" +gokeyword[80] + "</td><td  onclick=sort1(7,1) style=white-space:nowrap align=right>" +xs[1] + "</td><td  onclick=sort1(8,1)  align=right style=white-space:nowrap >" +xs[2] + "</td><td  style=white-space:nowrap >" +xs[3] + "</td><td  style=white-space:nowrap >" +xs[4] + "</td></tr>"
    for (let k = 0; k < gamerows.length; k++) 
    {
        s += "<tr " + (gamerows[k][0] == go.id? "bgcolor=yellow":"") + "><td  align=right>" + gamerows[k][0]
                   + "</td><td  align=left>" + gamerows[k][1]
                   + "</td><td   align=left>" + typesel.options[gamerows[k][2]].text 
                   + "</td><td align=center><img src=image/" + gamerows[k][3] 
                   + "stone.png style=margin:0px;border:0px;width:16px ></td><td  align=right>" 
                   + gamerows[k][4] + "</td><td  align=right>" 
                   + gamerows[k][5] + "</td><td>" + gamerows[k][6] + "</td><td  align=right>" 
                   + gamerows[k][7] + "</td><td  align=right>" + gamerows[k][8] 
                   + "</td><td  align=center onclick=openthis(" + gamerows[k][0] 
                   + ")> >> </td><td align=center onclick=deletethis(" 
                   + gamerows[k][0] + ",this)> >> </td></tr>";
    }
    s += "</table>";
    myprompt1(s,null,null,xs[5]);
    $('allgame').rows[0].style.backgroundImage = 'linear-gradient(' + BBGCOLOR + "," + DBGCOLOR + ")";
}

function changename(it)
{
    go.myname = it.value;
}
function deletethis(gid,td)
{
    delete goes[gid];
    localStorage['gogame'] = JSON.stringify(goes);
    let tr = td.parentNode;
    tr.parentNode.removeChild(tr);
    if (gid == go.id)
    {
        go = JSON.parse(JSON.stringify(GO0));
        populate();
    } 
}
function sort1(c,n)
{
   let tbl = $("allgame");
   if (tbl.rows.length > 2)
   sorttbl(tbl,c,1,n);
}
function sort(c,n)
{
   if ($("players").rows.length > 4)
   sorttbl($("players"),c,2,n);
}

function sorttbl(tbl,col,start,n)
{
   numerically = n;
   sortingcol = col;
   if (start == 2) 
   playerrow.sort( function(a,b){
      if (numerically == 1) 
         return parseFloat(a[sortingcol]) - parseFloat(b[sortingcol]);
      else
         return a[sortingcol]  > b[sortingcol]?1:-1;
   });
   else
    gamerows.sort( function(a,b){
      if (numerically == 1) 
         return parseFloat(a[sortingcol]) - parseFloat(b[sortingcol]);
      else
         return a[sortingcol]  > b[sortingcol]?1:-1;
   });  
   let k = tbl.rows.length-1;
   for (; k>=start;  k--)
   {
       tbl.deleteRow(k);
   }
   if (start == 2)
   {
   let i = 0;
   for (; i < playerrow.length; i++)
   addline([playerrow[i][0],playerrow[i][1],playerrow[i][3],playerrow[i][4],playerrow[i][2]],false);
   }
   else
   {
       gamelist1();
   }
}

function joinorquit(but)
{
    goback();
    if (but.value == gokeyword[27])
    {
        but.disabled = true;
        $('tdid').innerHTML = gokeyword[119];
        if (newgame(-1))
        {
            
        }
        but.disabled = false;
    }
    else if (but.value == gokeyword[79])
    {
        reinit();
        but.value = gokeyword[27];
        heights();
    }
    else if (but.value == gokeyword[108])
    {
        but.disabled = true; 
        if (Exchange.mode == '')
            accident();
        but.disabled = false; 
        but.value = gokeyword[79];
    }
    else if (but.value == textmsg[821])
    {
        but.disabled = true; 
        resumeold();
        but.disabled = false; 
        but.value = gokeyword[16];
         
    }
    else if (but.value == msg64)
    {
        but.disabled = true; 
        quitwait();
        but.disabled = false; 
        but.value = gokeyword[27];
        addbackwatch();
    }
    else if (but.value == gokeyword[16])
    {
        but.disabled = true; 
        myprompt1(msg1521 + '?',null, 'if(v)giveup1();else $("newbtn").disabled=false;');
    }
    else if (but.value == gokeyword[35])
    {
        but.disabled = true;
        archive();
        reinit();
        but.disabled = false;
        but.value = gokeyword[79];
    }
}
function reinit()
{
   go = JSON.parse(JSON.stringify(GO0));
   $('tdid').innerHTML = gokeyword[119];
   for (let k=playertbl.rows.length-1; k>=2;k--)
      playertbl.deleteRow(k);
   msgboard.innerHTML = '';
   msgboard.style.height = '150px';
   $('playerdiv').style.height = '220px';
   $('playerdiv').style.overflow = 'scroll';
   enablemsg(false);
   if (secondhandle!=null)
       clearInterval(secondhandle);
   $('newbtn').value = gokeyword[27];
   $('newbtn').style.visibility = 'visible';
   heights();
   $('newbtn').disabled = false;
   Exchange.init();
   deletewho();
   enablemsg(false);
}
function inflate(s)
{
    s = Msg.fromhex(s);
    go = JSON.parse(s);
    populate1();
}
function quitwait()
{
    if (go.id == -1) return;
    let s = "&act=quit";
    Exchange.sendMessage(s,''); 
}
function archive()
{
    if (go.opponent==-1)return;
    go.pixel = save0();
    goes[go.id] = go;
    localStorage["gogame"] = JSON.stringify(goes);
}
function resumeold()
{
   if (go.id == -1)
   {
       reinit();
       $('newbtn').value = gokeyword[27];
   }
   else
   {
       populate();
       if (go.turn=='me')
       {
           secondhandle = setInterval(readmyseconds,1000);
       }
       else
       {
           secondhandle = setInterval(readhseconds,1000);
       }
       let msg = "&act=resumeold&id="+ go.id + "&name=" + go.myname  + "&rank="+ go.myrank + '&timecap=' + go.timecap + '&type='+ go.type + "&oppid=" + go.opponent + "&turn=" + go.turn;
       Exchange.sendMessage(msg,'');
   }
}
function newgame(myid)
{
   if ($('myname').value == '')
   {
       $('myname').focus();
       myprompt1(gokeyword[116]);
       return false;
   }
    go.id = myid;
    if (myid==-1)
    $('tdid').innerHTML = gokeyword[119];
    else
       $('tdid').innerHTML = myid; 
    go.myname = $('myname').value;
    go.myrank = ranksel.selectedIndex;
    go.timecap = timecapsel.selectedIndex;
    go.type = typesel.selectedIndex;
    let msg = "&act=list&name=" + go.myname + "&id=" + myid + "&rank="+ go.myrank + '&timecap=' + go.timecap + '&type='+ go.type;
    Exchange.sendMessage(msg,'');
    //if ($('playerdiv').style.height == playertbl.offsetHeight + 'px')
    {
       msgboard.style.height = '150px';
       $('playerdiv').style.height = '220px';
       $('playerdiv').style.overflow = 'scroll';
    }
    msgboard.innerHTML = '';
    return true;
}
let watchingrow;
function showgoinglist(x)
{
    x = x.replace(/^[\s]+/,'').replace(/[\s]+$/,'');
    if (x == '') return;
    watchingrow = (new CSVParse(x,'\'',",",";")).nextMatrix();
    let header = [gokeyword[75],$('players').rows[0].cells[2].innerHTML,
        gokeyword[76],gokeyword[77],gokeyword[82],gokeyword[80],gokeyword[77],
        gokeyword[78],gokeyword[115]];
    
    let qq =  ["right","left","left","right","center","left","right","right","right"];
    let q = '<table id=watchlist border="1" style="border-radius:3px;border-collapse: collapse"><tr>';
    for (let j=0; j < header.length; j++)
    {    
        q += "<td style=white-space:nowrap onclick=sort2(" + j + "," + (qq[j]=='right'?1:0) + ") align=" + qq[j] + ">" + header[j] + '</td>';
        
    }
    q += "</tr>";
    myprompt1(q,null,null,gokeyword[112]);
    $('watchlist').rows[0].style.backgroundImage = 'linear-gradient(' + BBGCOLOR + "," + DBGCOLOR + ")";

    for (let k=0; k < watchingrow.length; k++)
    {
        addlinewatch(watchingrow[k]);
    }
    Exchange.ready = true;
    Exchange.id = -1;
}

function sort2(j,k)
{
    sortingcol = j;
    numerically = k;
    watchingrow.sort(function(a,b)
    {
       if (numerically==0)
          return a[sortingcol]>b[sortingcol]?1:-1;
       return parseInt(a[sortingcol])-parseInt(b[sortingcol]);
    });
    let tbl = $('watchlist');
    for (let k=tbl.rows.length-1; k>0; k--)
        tbl.deleteRow(k);
    for (let k=0; k < watchingrow.length; k++)
    {
        addlinewatch(watchingrow[k]);
    }
     
}
function addlinewatch(x)
{
    let align =  ["right","left","left","right","center","left","right","right","right"];
                           //type  name  rank  color    name   rank   timcap   #stone
    let tr = $('watchlist').insertRow(-1);
    for (let j=0; j < 9; j++)
    {
        let td = tr.insertCell(-1);
        td.align = align[j];
        td.style.cssText = "white-space:nowrap;font-family:" + myfontname;
        if (j==1)
            td.innerHTML = $('type').options[parseInt(x[j])].text;
        else if (j==4)
            td.innerHTML = '<img class=nosel src=image/' + (x[4]=='0'?'black':'white') + 'stone.png style=margin:0px;border:0px;width:' + STONESIZE + 'px >';
        else if (j==7)
             td.innerHTML =  $('timecap').options[parseInt(x[j])].text;
        else 
             td.innerHTML = x[j];
    }
    tr.cells[0].style.color = "blue";
    tr.cells[0].onclick = function(){watchthis(this);}
}
let gid = -1;
function watchthis(td)
{
    if (td.innerHTML == gokeyword[113])
    {
        wgone(gokeyword[113]);
        return;
    }
    gid = parseInt(td.innerHTML);
    let s = '&act=book&name=' + $('myname').value + "&type=" + $('type').selectedIndex + '&gid=' + td.innerHTML;
    Exchange.sendMessage(s,'watch');
}
function fetchgame(wid)
{
    archive();
    let copygo = JSON.parse(JSON.stringify(go));
    let xs = go.msg.split(/<br>/);
    let back = '';
    let anchor = gokeyword[114].replace(/@[^@]+@/,'');
    for (let i=0; i < xs.length; i++)
    {
        let q = xs[i].replace(/.*(\([0-9]+,[0-9]+\))/,'$1');
        if (q!=xs[i])
        {
            if (xs[i].includes(gokeyword[39]))
                back += '<br>WHITE' +  q;
            else if (xs[i].includes(gokeyword[40]))
                back += '<br>BLACK'  +  q;
        } else if (xs[i].includes(anchor))
        {
            if (xs[i].includes(gokeyword[39]))
                back += '<br>' + xs[i].replace(/([0-9]+).*/,"$1") + " WHITEanchor";
            else if (xs[i].includes(gokeyword[40]))
                back += '<br>' + xs[i].replace(/([0-9]+).*/,"$1") + " BLACKanchor";
        }    
            
    }
    copygo.msg = back;
    let s = '&act=fetchinfo&oppid=' + wid + "&info=" + Msg.hex(JSON.stringify(copygo));
    Exchange.sendMessage(s,'');
}
 
function wgone(gid)
{
    let tbl = $('watchlist');
    for (let k =1; k < tbl.rows.length; k++)
    {
        if (tbl.rows[k].cells[0].innerHTML == ''+gid)
        {
            if (gid==gokeyword[113])
            {   
                tbl.deleteRow(k);
                watchingrow.splice(k-1,1);
            }
            else
            tbl.rows[k].cells[0].innerHTML = gokeyword[113];
            break;
        }    
    }
}

function showlist(x)
{
    playerrow = new Array();
    x = x.replace(/^[\s]+/,'').replace(/[\s]+$/,'');
    if (x == '') return;
    let xs = (new CSVParse(x,'\'',",",";")).nextMatrix();
    Exchange.id = go.id = parseInt(xs[0][0]);
    Exchange.ready = true;
    Exchange.startrecev();
    $('tdid').innerHTML = go.id;
    for (let k=playertbl.rows.length-1; k>=2;k--)
        playertbl.deleteRow(k);
    //if ($('playerdiv').style.height == playertbl.offsetHeight + 'px')
    {
       msgboard.style.height = '150px';
       $('playerdiv').style.height = '220px';
       $('playerdiv').style.overflow = 'scroll';
    }
    for (let k=1; k < xs.length; k++)
    {
        if (parseInt(xs[k][0]) == go.id)
           continue;
        addline(xs[k]);
    }
     
    $('watch').style.visibility = 'hidden';
    $('newbtn').value = msg64;
    $('result').innerHTML = ''; 
    go.status = PAIRINGUP;
    enablemsg(false);
}

function addline(xs,record)
{     
    let tr = playertbl.insertRow(-1);
    let  td = tr.insertCell(-1);
    td.innerHTML = xs[0];
    td.align = 'right';
        
    td = tr.insertCell(-1);
     td.innerHTML = xs[1];
        td.align = 'left';
        
      td = tr.insertCell(-1);
      td.innerHTML = gametypes[xs[4]];
      td.align = 'left';  
        
      td = tr.insertCell(-1);
      td.innerHTML = ranksel.options[xs[2]].text;
      td.align = 'right';
      td = tr.insertCell(-1);
      td.innerHTML = timecapsel.options[xs[3]].text;
      td.align = 'right';
      td = tr.insertCell(-1);
      td.id = 'wait' + xs[0];
      td.innerHTML = gokeyword[89];
      td.align = 'center';
      td.style.cssText = 'color:blue';
      td.onclick = function(){ask(this.id.substring(4));} 
      
      for (let j=0; j < 6; j++)
          tr.cells[j].style.fontFamily = myfontname;
      if (record==null)
      playerrow[playerrow.length] = [xs[0],xs[1],xs[4],xs[2],xs[3]];
}
function trinaskeds(id)
{
    let tbl = $("askeds");
    if (tbl == null) return null;
    for (let k=0; k < tbl.rows.length; k++)
    {
        if (tbl.rows[k].cells[0].innerHTML.includes(":" + id + " "))
            return tbl.rows[k];
    }
    return null;
}
function naming(y)
{
    let x;
    if (typeof y == 'string')
    {
        x = y.split(/;/);
    }
    else x = y;
    return x[1] + "(" + gokeyword[75] + ":" + x[0] + " " + gokeyword[77] + ":" + x[2] + ")";
}
function delrow(id)
{
    for (let k =2; k < playertbl.rows.length; k++)
    {
         if(playertbl.rows[k].cells[0].innerHTML == ''+id)
           playertbl.deleteRow(k);
    }  
}
function addplayer(x)
{
    let xs = x.split(/;/);
    if (xs.length !=5||''+parseInt(xs[0])=='NaN'||''+parseInt(xs[2])=='NaN'||''+parseInt(xs[3])=='NaN')
    {
        appendmsg("Error:"+ x);
        return;
    }
   
    let k =2;
    for (; k < playertbl.rows.length; k++)
    {
         if(playertbl.rows[k].cells[0].innerHTML == ''+xs[0])
            break;
    } 
    if (k < playertbl.rows.length)
    {
        playertbl.rows[k].cells[1].innerHTML = xs[1];
        playertbl.rows[k].cells[2].innerHTML = gametypes[xs[4]];
        playertbl.rows[k].cells[3].innerHTML = xs[2];
        playertbl.rows[k].cells[4].innerHTML = xs[3];
        for (let j=0; j < 5; j++)
        playertbl.rows[k].cells[j].style.fontFamily = myfontname;
    } 
    else
    {
        addline(xs); 
    }
}
function clickcell(oppid)
{
    for (let k =2; k < playertbl.rows.length; k++)
    {
         if(playertbl.rows[k].cells[0].innerHTML == ''+oppid)
          return  playertbl.rows[k].cells[playertbl.rows[k].cells.length-1];
    } 
    return null;
}
function hiderow(oppid)
{
    
    for (let k =2; k < playertbl.rows.length; k++)
    {
        if( playertbl.rows[k].cells[0].innerHTML == ''+oppid)
            playertbl.deleteRow(k);
    }    
}
 
function ask(oppid,oldtimecap,btn)
{
    if (oldtimecap == ''+timecapsel.selectedIndex)
    {
        pairup(oppid,oldtimecap);
        return;
    }
    go.timecap = timecapsel.selectedIndex;
    let k = 2;
    for(; k<playertbl.rows.length && playertbl.rows[k].cells[0].innerHTML!=''+oppid;k++);
    if (playertbl.rows[k].cells[2].innerHTML != typesel.options[typesel.selectedIndex].text
       && playertbl.rows[k].cells[2].innerHTML != gametypes[3]
    )
    {
        myprompt1(gokeyword[90]);
        typesel.focus();
        return;
    }
    if (typesel.selectedIndex == 3  && playertbl.rows[k].cells[2].innerHTML == gametypes[3])
    {
        myprompt1(gokeyword[91]);
        typesel.focus();
        return;
    }
    go.timecap = timecapsel.selectedIndex;
    go.type = typesel.selectedIndex;
    clickcell(oppid).innerHTML = "<img width=26 src=image/progress.gif>";
    let s = "&act=ask&oppid="+ oppid + "&timecap="+ go.timecap + "&type=" + go.type;
    Exchange.sendMessage(s,'');
    if (btn!=null)shrink(btn);
    if (typeof fm.who != 'undefined')
    {
          let tbl = $('players');
          fm.who.options[fm.who.options.length] = new Option(tbl.rows[k].cells[1].innerHTML,tbl.rows[k].cells[0].innerHTML)
          fm.who.selectedIndex = fm.who.options.length - 1;
    }
    else
        makewho();
    enablemsg(true);
}
 
function pad(s,n)
{
    for (let k=n.length; k<n; k++)
       if (n > 10) 
           s += ' ';
       else 
           s = ' ' + s;
    return s;
}

function rejectq(oppid,btn)
{
    if (go.id < 0 || oppid < 0) return;
    let msg = "&act=reject&oppid="+ oppid;
    Exchange.sendMessage(msg,'');
    if (btn!=null) shrink(btn);
    clickcell(oppid).innerHTML = gokeyword[89];
    removewho(''+oppid);
}
function shrink(btn)
{
    let tr = btn.parentNode.parentNode;
    let tbl = tr.parentNode.parentNode;
    let len = tbl.rows.length;
    let h = tr.offsetHeight;
    tr.parentNode.removeChild(tr);
    if (len == 1)
    {
        closeprompt();
        go.opponent = -1;
    }
    else
    {
        let t = promptwin.offsetHeight;
        promptwin.style.height = (t - h) + 'px';
        if ($("askeds").rows.length == 1)
        go.opponent = parseInt($("askeds").rows[0].cells[0].id.substring(2));
        else
        go.opponent = -1;
    }
}
 
function pairup(oppid,timecap)
{
    if (go.id < 0 || oppid < 0) return;
    go.timecap = parseInt(''+timecap);
    let msg = "&act=agree&oppid="+ oppid + "&timecap="+ timecap;
    Exchange.sendMessage(msg,'');
    let z = trinaskeds(oppid);
    if (z!=null)
    {        
        z.parentNode.removeChild(z);
    }
}

function startgame(str)
{
    let x = str.split(/;/);
    setcolors("");
    if (x[3] == '-1')
    {
        myprompt1(naming(x) + ' ' + gokeyword[101]);
        hiderow(x[0]);
        return;
    }
    window.onbeforeunload = beforeclose;
    fm.sendbtn.style.background = '#00BBBB';
    go.opponent = parseInt(x[0]);
    go.oppname = x[1];
    go.mycolor = x[3]=='0'?BLACK:WHITE;
    go.oppcolor= x[3]=='1'?BLACK:WHITE; 
    go.opprank = x[2];
    go.opptime = 0;
    go.mytime = 0;
    
    for (let k=playertbl.rows.length-1; k>=2;k--)
        playertbl.deleteRow(k);
    $('newbtn').value = gokeyword[16];
    scoretbl.style.display = 'block';
    if (go.myname == go.oppname)
    {
        scoretbl.rows[1].cells[1].innerHTML = gokeyword[74];
        scoretbl.rows[2].cells[1].innerHTML = gokeyword[80];
    }
    else
    {
        scoretbl.rows[1].cells[1].innerHTML = go.myname;
        scoretbl.rows[2].cells[1].innerHTML = go.oppname;
    }
    setcolor($('myclr'), go.mycolor);
    setcolor($('hisclr'),go.oppcolor);
    $('hminute').innerHTML = go.timecap * 60;
    $('myminute').innerHTML = go.timecap * 60;
    $('plate').style.display = 'block';
    go.status = GOINGON;
    eseconds = 0;
    if (go.mycolor == BLACK)
    {   
        clickable = true;
        appendmsg(gokeyword[33]);
        secondhandle = setInterval(readmyseconds,1000);
        go.turn = 'me';
    }
    else
    {
        secondhandle = setInterval(readhseconds,1000);
        go.turn = 'opp';
    }
   $('playerdiv').style.height = playertbl.offsetHeight + 'px';
   $('playerdiv').style.overflow = ''; 
   msgboard.style.height = (370-playertbl.offsetHeight) + 'px';
   enablemsg(true);
   closeprompt();
   $('result').innerHTML = '';
}

function deletewho()
{
   let wh = $('who');
   if (wh!=null)
   {
      let w = fm.myword.offsetWidth;
      wh.parentNode.removeChild(wh);
      fm.myword.style.width = (msgwidth) + 'px';
   }
}
 
let eseconds = 0;
let secondhandle;
function readmyseconds()
{
   $('mysecond').innerHTML = eseconds++;
   if (eseconds == 60)
   {
      eseconds = 0;
      go.mytime =  parseInt($('myminute').innerHTML)+ (go.timecap==0?1:-1);
      if (go.timecap>0 && go.mytime == 0)
      {
          giveup1();
      }
      else
      $('myminute').innerHTML = go.mytime; 
      
   }
}
function readhseconds()
{
   $('hsecond').innerHTML = eseconds++;
   if (eseconds == 60)
   {
      eseconds = 0;
      go.opptime =  parseInt($('hminute').innerHTML)+ (go.timecap==0?1:-1);
      $('hminute').innerHTML = go.opptime;
      if ((new Date())-go.lasttime>300000)
          alive(0);
   }
}
function alive(t)
{
    if (t<2)
    {
        let s = "&act=alive&oppid=" + go.opponent  + "&t="+t;
        Exchange.sendMessage(s,'');
    }
    else   appendmsg(go.opponent + ' ' + gokeyword[104])
}
function gone(x)
{
    if (go.status != GOINGON)
    {
       let xs = (''+x).split(/;/);
       for(let y of xs)
       {  
           delrow(y);
           let z = trinaskeds(y);
           if (z != null) 
           {    
               z.parentNode.removeChild(z);
           }
           let wh = $('who');
           if (wh != null)
           {
               for (let i= wh.options.length-1; i>=0; i--)
                   if (wh.options[i].value == y)
                      wh.options[i].remove(i); 
           }
       }
    }
    else if (x == go.opponent) 
    {
        myprompt(map2color(go.oppcolor) + " " + gokeyword[102])
    }
    
    if ($('askeds')==null || $('askeds').rows.length < 2)
    {
         deletewho();
    }
}

function makewho1(id, watcher)
{
    let str = "<select name=who  id=who style=\"font-family:" + myfontname + "\">";
    if(go.opponent>0)
        str += "<option value=" + go.opponent + ">" + go.oppname + "</option>";
    str += "<option value=" + id +  ">"+ watcher + "</option>";
    let sel = document.createElement('select');
    fm.myword.style.width = (msgwidth - 100) + 'px' ;
    fm.myword.parentNode.insertBefore(sel,fm.myword);
    sel.outerHTML = str + '</select>';
    fm.myword.style.width = (msgwidth - sel.offsetWidth-4) + 'px';
    enablemsg(true);
}
function enablemsg(b)
{
    fm.myword.disabled = !b;
    fm.sendbtn.disabled = !b;
    fm.sendbtn.style.backgroundColor = b?'#00BBBB':'grey';
}
function makewho()
{
    let str = "<select name=who  id=who  style=\"font-family:" + myfontname + "\">";
    let tbl = $('askeds');
    if (tbl != null)
    {
          for (let k=0; k < tbl.rows.length; k++)
          {
              str += "<option value=" + tbl.rows[k].cells[0].id.replace(/td/,'') + (k == tbl.rows.length-1?' selected ':'')+   ">"
              + gokeyword[117]+ " " + tbl.rows[k].cells[0].innerHTML.replace(/\(.*/,'') +  "</option>"
          }
     }
     tbl = $('players');
     if (go.status == PAIRINGUP)
     for (let k=2; k < tbl.rows.length; k++)
     {
         if (!tbl.rows[k].cells[5].innerHTML.includes(gokeyword[89]))
         {
             str += "<option value=" + tbl.rows[k].cells[0].innerHTML + ">"
             + tbl.rows[k].cells[1].innerHTML + "</option>";
         }
     }
     let sel = document.createElement('select');
     fm.myword.style.width = (msgwidth - 100) + 'px' ;
     fm.myword.parentNode.insertBefore(sel,fm.myword);
     sel.outerHTML = str + '</select>';
     fm.myword.style.width = (msgwidth - sel.offsetWidth-4) + 'px';
     enablemsg(true);
}
function removewho(id)
{
    let wh = $('wh');
    if (wh == null) return;
    
    for (let i =0; i < wh.options.length; i++)
        if (id == wh.options[i].value)
    {
        if (wh.options.length == 1)
        {    
            wh.parentNode.removeChild(wh);
            fm.myword.style.width = (msgwidth) + 'px' ;
        }
        else 
            wh.options[i] = null;
        break;
    }
}
function pursued(x)
{
   let xs = x.split(/;/); 
   let s = textmsg[1891].replace(/@/,naming(x)).replace(/@/,gametypes[xs[4]]).replace(/@/,timecapsel.options[xs[3]].text);
   s += "<br><center><input type=button class=GreenButton style=width:76px value=\"" + gokeyword[31] + "\" onclick=pairup("+ xs[0]+"," + xs[3]+") >"
               +"<input type=button class=OrangeButton style=width:76px value=\"" + gokeyword[49] + "\" onclick=rejectq("+ xs[0]+",this) >"
               +"<input type=button class=GreenButton style=width:76px value=\"" + gokeyword[29] + "\" onclick=ask("+ xs[0]+"," + xs[3] + ",this) ></center>";
   if (promptwin == null)
   {
      go.opponent = parseInt(xs[0]);
      myprompt1("<table cellspacing=4 id=askeds><tr><td id=td" + xs[0] + ">" + s+"</td></tr></table>",null,null,gokeyword[105]);
   }
  else
   {
      go.oppcount = -1;
      let tbl = $('askeds');
      let r = tbl.insertRow(-1);
      let c = r.insertCell(-1);
      c.innerHTML = s;
      c.id = 'td' + xs[0];
      c.style.cssText = 'font-family:' + myfontname;
      if (typeof fm.who != 'undefined')
      {
          let k = tbl.rows.length-1;
          fm.who.options[fm.who.options.length] = new Option(tbl.rows[k].cells[0].innerHTML.replace(/\(.*/,''),tbl.rows[k].cells[0].id.replace(/td/,''))
          fm.who.selectedIndex = fm.who.options.length - 1;
      }
      else
      {
          makewho();
      }
      enablemsg(true);
   }
   promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].onclick = function()
   {
       if ($('who')!=null) 
           $('who').parentNode.removeChild($('who'));
       let tbl = $('askeds');
       let ms = new Array();
       Exchange.sendMessage("&act=reject&oppids=",'');
       go.opponent = -1;
       closeprompt();
       
   };
   fm.sendbtn.style.disabled = false;
   fm.sendbtn.style.background = '#00BBBB';
}
function reject(x)
{
   let xs = x.split(/;/);
   let cell = clickcell(xs[0]);
   cell.innerHTML = gokeyword[89];
   removewho(xs[0]);
   myprompt1(naming(xs) + " " + gokeyword[106],null,null,gokeyword[50]);
}
function agree(x)
{
   let xs = x.split(/;/);
   let cell = clickcell(xs[0]);
   cell.innerHTML = gokeyword[89];
   startgame(x);
}
function move(x)
{
    makesound(2);
    clearInterval(secondhandle);
    eseconds = 0;
    secondhandle = setInterval(readmyseconds,1000);
    go.turn = 'me';
    let color = go.oppcolor;
    let othercolor = go.mycolor;
    let xs = x.split(/_/); 
    if (xs.length == 3)
    {
       color = xs[2]=='0'?BLACK:WHITE;
       othercolor = xs[2]=='1'?BLACK:WHITE;
       x = xs[0] + '_' +xs[1];
    }
    setcolor($('s'+x), color);
    if (color == go.oppcolor)
       increment('hcount',1);
    else
       increment('mycount',1);
    if (go.type == 0)
    {
        let n1=containRemove4(xs);
        if (n1 > 0) appendmsg(gokeyword[114].replace(/@/,n1 + " ").replace(/@/, map2color(othercolor)));
    } 
    else if (go.type == 1)
    {
        if (check35(xs,5) )
        {
            if (xs.length == 2)
              gameover(-1);
            else
            {  
                $('result').innerHTML = map2color(color) + gokeyword[2];
                stopmsg();
            }  
        }
    } 
    else 
    {
        if (check35(xs,3))
        {
           if (xs.length == 2)
               gameover(-1);
           else
           {
               $('result').innerHTML = map2color(color) + gokeyword[2];
               stopmsg();
           }  
        }
    }
    //go.stone[go.stone.length]=x;
    appendmsg(map2color(go.oppcolor) + "(" + xs[0] + "," + xs[1] + ")");
}
 
function frash(i)
{
    let p = new Array(15);
    for (let j=0; j <15; j++)
    {
        if ( j <= i && j > i-3)
              p[j] = 1;
           else
              p[j] = 0;
    } 
    let s = '';
    for (let j=0; j <5; j++)
        s += p[j]==1?'&bull;':'&nbsp;';
    
    $('cord').innerHTML = s;
    if (i<6)
        setTimeout("frash(" + (i+1) + ")", 100);
    else
        $('cord').innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
}
function stopmsg()
{
    go.listenmore = false;
    if (Exchange.mode == '')
    {
        if ($('newbtn').value==gokeyword[16]||go.status == GOINGON)
        {
            appendmsg(gokeyword[32]);
            gameover(10);
            archive();
        }
        else   if ( $('newbtn').value==msg64 ||go.status == PAIRINGUP)
        {    
            $('newbtn').value==gokeyword[27];
            go.id = -1;
            $('tdid').innerHTML = gokeyword[119];
            heights();
        }
        reinit();
        addbackwatch();
    }
    else
    {
        $('watch').value = gokeyword[111];
        $('tdid').innerHTML = gokeyword[119];
        $('newbtn').value==gokeyword[79];
    }
    Exchange.init();
}
 

 
 
function regerror(err)
{
    $('regerror').innerHTML = err;
}

function login()
{
    window.open("login.jsp?follow=" + jsfollows, "w" + tstmp);
}
 
function deletegame(id)
{
    window.open("go.jsp?&username=1&email=4&password=" + id, "w" + tstmp);
}
function allgames()
{
     window.open("go.jsp?email=3&password=0&username=1", "w" + tstmp);
}
function logout()
{
    myprompt1(intf71,null, "if(v)logout1()");
}

function logout1()
{
     window.open("login.jsp?follow=logout", "w" + tstmp);
}

function register()
{
    myprompt1("<span style=color:red id=regerror></span><form rel=opener name=f style=\"margin:15px 0px 10px 15px\" method=post action=go.jsp target=\"w" + tstmp + "\" onsubmit=\"return validate(this)\"  ><table width=300 cellpadding=0px cellspacing=1><tr><td  class=label2>" + gokeyword[59] + "</td><td><input name=username class=text></td></tr>"
    + "<tr><td class=label2>" + gokeyword[60] + "</td><td><input  name=password  class=text type=password></td></tr><tr><td class=label2>" + gokeyword[61] + "</td><td><input name=email  class=text></td></tr>"
    + '<tr><td><img src="patchca.png" alt="captcha"  style="cursor:pointer;vertical-align:text-bottom;height:22px;line-height:22px;margin:0px 0px -3px 0px" onclick="randomit(this)">'
    +'</td><td><input type="text" class=text name="patchcafield" ></td></tr><tr><td colspan=2 align=center><input class=BlueButton type=submit style=width:70px value="' + gokeyword[58] + '"></td></tr></table></form>',null,null,gokeyword[58]);
}
 
function randomit(im)
{
   im.src = im.src.replace(/\?.*/,'') + '?' + Math.random();
}
 
function validate(f)
{
    if (f.username.value.replace(/ /g,'').length < 3)
    {
        f.username.value = f.username.value.replace(/ /g,'');
        $('regerror').innerHTML = gokeyword[66]; return false;
    }
    if ( f.password.value.length < 8)
    {
        $('regerror').innerHTML = gokeyword[67]; return false;
    }
    if ( f.email.value.replace(/ /g,'').length < 10 ||  f.email.value.indexOf('@') < 0 ||  f.email.value.indexOf('.') < 0)
    {
        f.email.value = f.email.value.replace(/ /g,'');
        $('regerror').innerHTML = gokeyword[68]; return false;
    } 
    if ( f.patchcafield.value.replace(/ /g,'').length !=4 )
    {
        f.patchcafield.value = f.patchcafield.value.replace(/ /g,'');
        $('regerror').innerHTML = gokeyword[69]; return false;
    } 
}
function getstone(i, j)
{
    return $('s' + i + "_" + j);
}
function setcolor(d,clr)
{
    if (d== null) return;
    if (clr == BLACK || clr == WHITE)
    {
        d.innerHTML = '<img class=nosel src=image/' + clr + 'stone.png style=margin:0px;border:0px;width:' + STONESIZE + 'px >';
        d.style.backgroundColor = null;
    }
    else if (clr == 'grey' || clr == '#999999')
    {
        d.innerHTML = '<div style="width:' + STONESIZE + 'px;height:' + STONESIZE + 'px;border-radius:' + (STONESIZE/2) + 'px;background-image:radial-gradient(#999999,#666666)"></div>';
        d.style.backgroundColor = null;
    }
    else
    {
        d.innerHTML = '';
        d.style.backgroundColor = clr;
    }
}
function cord(i,j){ $('cord').innerHTML = '(' + i + "," + j + ")";}
function cord1(){ $('cord').innerHTML = '';}
function getcolor(i, j, v )
{ 
    if (v!=null &&  v.indexOf(',' + i + "_" + j + ",")>=0) 
        return 'visited';
    let y= getstone(i,j);
    if (y==null) 
        return 'outside'; 
    let p = y.innerHTML;
    if (p.indexOf(BLACK)>=0) 
    {
        //if (go.type == 2)  appendmsg(i + ',' + j + ' black');
        return BLACK;
    }
    if (p.indexOf(WHITE)>=0) 
    {
        //if (go.type == 2)  appendmsg(i + ',' + j + ' white');
        return WHITE;
    }
     
    if (y.innerHTML.includes("radial-gradient") || y.style.backgroundColor.indexOf("#999999")>=0 
            || y.style.backgroundColor.toLowerCase().replace(/ /g,'').indexOf("rgb(153")>=0
            || y.style.backgroundColor.toLowerCase().indexOf("grey")>=0)
    {
        
        return 'grey';
    }
    return TRANSPARENT;
}
 
function draw(n)
{
    let clr = TRANSPARENT;
    let marginwdith = 6;
    let bordercolor = TRANSPARENT;
    if (n == 18) 
    {     
        marginwdith = 22;
        bordercolor = '#222222';
    }
    let tbl = document.createElement('table');
    if (n == NL) tbl.id = 'board';
    tbl.style.cssText = ';border-radius:4px;border-collapse:collapse;position:absolute;left:' + marginwdith 
                        + "px;top:" + (marginwdith + 60) 
                        + 'px;border-color:' + bordercolor 
                        + ';background-color:transparent;z-index:' + (-16+n);
    tbl.border = '0';
    tbl.cellspacing = '0';
    tbl.cellpadding = '0';
    let border = ""
    let ss = ''
    for (let i=0; i < n; i++)
    {
        ss += '<tr height=' + CELLSIZE + '>';
        for (let j = 0; j < n; j++)
        {   
            let q = ''; 
            if (n==NL) q = ' id=s' + i+ '_' + j;
            ss +=  '<td width=' + CELLSIZE + ' style="border:1px ' + (n==18?'#000055':'transparent') + ' solid"><div ' + q + ' style="margin:0px 0px 0px 0px;width:' + STONESIZE 
                    + 'px;height:' + STONESIZE + 'px;border-radius:14px;background-color:transparent" onclick=clickstone(this)  onmouseover=cord(' + i + ',' + j +') onmouseout=cord1()></div></td>';
        }
        ss += "</tr>";
    } 
    tbl.innerHTML = ss;
    document.body.appendChild(tbl);
   
}

 
function getcord(d)
{
    let z =  d.id.substring(1).split(/_/);
    return [parseInt(z[0]), parseInt(z[1])];
}
 
function map2color(cl)
{
    if (cl == BLACK || cl == '0' || cl==0) 
        return gokeyword[40];
    return gokeyword[39];
}
function appendmsg2(x)
{
    appendmsg(gokeyword[117] + " " +x)
}
function appendmsg(x)
{
      msgboard.innerHTML +=    "<br>" +x;
      go.msg = msgboard.innerHTML;
}
function appendmsg1(x)
{
    let k = x.indexOf(" ");
    let id = x.substring(0,k);
    let j = x.indexOf(":", k+2);
    let nm = x.substring(k+1,j);
    x = x.substring(k+1);
    let wh = $('who');
    if (wh == null)
    {
        makewho1(id,nm);
        wh = $('who');
        wh.selectedIndex = 1;
    }
    else
    {
        k = 0;
        for (; k < wh.options.length; k++)
        {
            if (wh.options[k].value == id)
                break;
        }
        if (k == wh.options.length)
        {
            wh.options[k] = new Option(nm, id);
        }
        wh.selectedIndex = k;
    }
    msgboard.innerHTML +=    "<br>"   + x;
    go.msg = msgboard.innerHTML;
}
function appendmsg(x)
{
      msgboard.innerHTML +=    "<br>" +x;
      go.msg = msgboard.innerHTML;
}
setcolor($('myclr'), BLACK);
setcolor($('hisclr'), WHITE );
let visited = ',';
let foundcolor = '';
let counter = 0;
let stack = [];
let stacksize=0; 
let maxstacksize = 0;
let returnsoon = true;
function isblack(l)
{
    l = l.toLowerCase().replace(/ /g,'');
    return (l == 'rgb(0,0,0)' || l == BLACK || l == '#000' || l =='#000000');
}
function isgrey(l)
{
   l = l.toLowerCase().replace(/ /g,'');
   return (l == 'rgb(153,153,153)' || l == 'grey' || l == '#999' || l =='#999999')  
}
function iswhite(l)
{
   l = l.toLowerCase().replace(/ /g,'');
   return (l == 'rgb(255,255,255)' || l == WHITE || l == '#fff' || l =='#ffffff')  
}
 
function alongborder(a,i,j, maincolor)
{
    if (goway == 1)
       return 0;
    if (goway == 2)
    {
        let k = Math.floor(Math.random() * a.length);
        if (k == a.length) k = a,length-1;
        return k;
    }
    let k;
        for (k=0; k < a.length; k++)
        {
             
            let u = [a[k][0] - i, a[k][1]-j]; 
            let v;
            if (u[0] == -1 && u[1] == 0)
                v = [0, -1];
            else if (u[0] == 0 && u[1] == 1)
                v = [-1, 0];
            else if (u[0] == 1 && u[1] == 0)
                v = [0, 1];
            else v = [1, 0];
            let right = [i + v[0], j+v[1]];
            
            let c1 = getcolor(right[0], right[1], visited);
            if (c1!=maincolor && (c1==BLACK || c1 == WHITE || c1 ==TRANSPARENT))
            { 
                if (foundcolor=='') 
                    foundcolor = c1; 
                else if (foundcolor!=c1) 
                {
                    foundcolor = 'undecided';
                    if (returnsoon) return -1;
                }
            }
            if (c1 != maincolor)
                break;
            
        }
        return k;
}
function next(i,j, maincolor)
{
    let c = getcolor(i,j,visited); 
    if (c !=maincolor ) return null;
    visited += i + '_' + j + ',';
    if (returnsoon == false) 
        setcolor(getstone(i,j), '#999999');
    stack[stacksize++] = [i,j];
    if (maxstacksize < stacksize) 
        maxstacksize = stacksize;
    let r = [ [i,j-1], [i-1, j], [i,j+1], [i+1, j] ];
    let a = [];
    for (let k = 0; k< 4; k++)
    {
        let c1 = getcolor(r[k][0], r[k][1],visited); 
        if (c1 == maincolor)
        {
            a[a.length] = r[k];
        }
        else  if (c1==BLACK || c1 == WHITE || c1 ==TRANSPARENT) 
        { 
             if (foundcolor=='') 
                foundcolor = c1; 
            else if (foundcolor!=c1) 
            {
                foundcolor = 'undecided';
                if (returnsoon) return;
            }
        }
    }
    let nb = a.length;
    if (nb == 4)
    {
        return [i, j-1];
    }
    else if (nb==1)
    {
        return  a[0];
    }
    else if (nb==2 || nb==3)
    {
       
         let k = alongborder(a,i,j,maincolor);
         
        return a[k];
    }
    else
    {
        stacksize--; 
        while (stacksize-1 >= 0)
        {
            let b = stack[stacksize-1];
            i = b[0];
            j = b[1];
            let r = [ [i,j-1], [i-1, j], [i,j+1], [i+1, j] ];
            let a = [];
            for (let k = 0; k< 4; k++)
            {
                let c1 = getcolor(r[k][0], r[k][1],visited); 
                if (c1 == maincolor)
                {
                    a[a.length] = r[k];
                }
            }
            let nb = a.length;
            if (nb == 0)
            {
                stacksize--;
                continue;
            }
            else if (nb==1)
            {
                return  a[0];
            }
            else if (nb==2 || nb==3)
            {
                
              
               let k = alongborder(a,i,j,maincolor);
             
                return a[k];

            }
            else   if (nb==4) return null; // impossible unless error
           
        }
        return null;
    }
}

window.onunload = function()
{
    if (window.onbeforeunload != null)
        archive();
    if (Exchange.mode == 'mode')
    {
        Exchange.sendMessage("act=quit","watch");
    }
    else if (go.status == GOINGON && go.result == 0)
    {
         accident();
    }
    else if (go.status == PAIRINGUP&&go.id > -1)
    {
        quitwait();
    }
     
    goes[go.id].opennow = false;
    localStorage['gogame'] = JSON.stringify(goes);
}
function Stone(i,j,color)
{
    this.i = i;
    this.j = j;
    this.color = color;
}
function Queue()
{ 
 this.max=0;
 this.s='';
 this.l =0;
 this.dequeue=function(){
    let i = this.s.indexOf(',');
    if (i <1) return null;
    let t = this.s.substring(0,i);
    if (i == this.s.length-1) this.s = '';
    else this.s = this.s.substring(i+1);
    
    this.l--;
    return t;
 } 
 this.enqueue=function(item){
  if (("," + this.s).indexOf("," + item + ",")>=0) return;
  this.s += item + ",";
  this.l++;
  if (this.max < this.l) this.max = this.l;
 }
 this.size = function()
 {
     return this.l;
 }
}

let queue = null;

function moretodo( )
{
       let i=0, j;
       for (; i < NL; i++)
       {
           for (j=0; j < NL; j++)  
           if (getcolor(i,j,visited) == TRANSPARENT) 
               break;
           if (j != NL) break;
       }
       
       if (i < NL && j < NL) 
       {
          return [i, j];
       }
       else
       { 
           return null;
       }  
          
}
 

function  breadth(i,j,maincolor)
{
    if (getcolor(i, j) != maincolor) return;
    visited = ',';
    queue = new Queue();
    parentv = new Array();
    foundcolor = '';
    returnsoon = false;
    queue.enqueue(i + '_' +j);
    visit(maincolor);
    
}
let parentv;
let destiny = null;
function routing()
{
    if (go.status == DONECOUNT) 
        uncount();
    let ss = $('source');
    let ds = $('destiny');
    if (ss==null || ds==null) return;
    destiny = ds.value.replace(/ /g,'').replace(/,/,'_');
    let source = ss.value.replace(/ /g,'');
    if (destiny.replace(/[0-9]+_[0-9]+/,'')!='' || source.replace(/[0-9]+,[0-9]+/,'')!='')
    {
        myprompt1('Enter the source and destination in the format like 7,8'); 
        return;
    }
    let  sss = source.split(/,/);
    let  des = destiny.split(/_/);
    if (getcolor( parseInt(sss[0]),parseInt(sss[1])) != TRANSPARENT) 
    {
        myprompt1( gokeyword[20]); return;
    }
     if (getcolor( parseInt(des[0]),parseInt(des[1])) != TRANSPARENT) 
    {
        myprompt1(gokeyword[21]); return;
    }
    maxstacksize = 0;
    dohold();
    holdcount  = [$('mycount').innerHTML, 
                  $('hcount').innerHTML]
   bcounter = isblack(go.mycolor)?parseInt($('mycount').innerHTML) : parseInt($('hcount').innerHTML);
   wcounter=  isblack(go.mycolor)?parseInt($('hcount').innerHTML) : parseInt($('mycount').innerHTML);
   gcounter=0;
   holdstatus = go.status;
   setstatus(INCOUNTING); 
   clickable = false;
   breadth( parseInt(sss[0]),parseInt(sss[1]),TRANSPARENT);
   if ($('count1')!=null)
       $('count1').value = gokeyword[15];
}
function endbreadth()
{
   let k=0; for (let ee in parentv)k++;
   appendmsg("visited:" + (visited.replace(/[^,]/g,'').length-1)  );
   appendmsg("edges:" + k);
   appendmsg("max q:" + queue.max  );
    if (parentv[destiny]!=null)
    {
        uncount();
        
        let p = destiny; 
        while (p!=null)
        {
            setcolor($('s' + p.replace(/,/,'_')), '#999999');
            
            p = parentv[p];
        }
        setstatus(DONECOUNT); 
    }
    else
    {
        myprompt1( 'Point (' + destiny.replace(/_/,',') + ") " + gokeyword[107] + " Point(" + $('source').value + "). No path");
    }
    destiny = null;
}
let neighbore;

function visit(maincolor)
{
    let e = queue.dequeue();
    if (e == null) 
    {
        if (maincolor == TRANSPARENT && destiny == null)
        {
            endeach();
            let ij = moretodo();
            if (ij==null) 
            {
               enddepth();
               return;
            }
            breadth(ij[0], ij[1], TRANSPARENT);
        }
        else if (maincolor == TRANSPARENT && destiny != null)
        {
            endbreadth();
        }
        return;
    }
    let es = e.split(/_/);
    let i = parseInt(es[0]);
    let j = parseInt(es[1]);
    visited += i + '_' + j + ',';
    if (returnsoon == false) setcolor(getstone(i,j), '#999999');
     neighbore = [ [i,j-1], [i-1, j], [i,j+1], [i+1, j] ];
     for (let k=0; k < 4; k++)
     {
        let c1 = getcolor(neighbore[k][0], neighbore[k][1],visited); 
      
        if (c1 == maincolor)
        {
             queue.enqueue( neighbore[k][0] + '_' + neighbore[k][1]);
             if (destiny!=null)
             {
                 parentv[neighbore[k][0]+'_'+neighbore[k][1]] = i + '_' + j;
                 if ( neighbore[k][0]+ '_'+neighbore[k][1] == destiny )
                 {
                     queue.s='';
                     queue.l = 0;
                     endbreadth();
                     return;
                 }
             }
        }
        else  if (c1==BLACK || c1 == WHITE || c1 ==TRANSPARENT) 
        { 
             if (foundcolor=='') 
                foundcolor = c1; 
            else if (foundcolor!=c1) 
            {
                foundcolor = 'undecided';
                if (returnsoon) return;
            }
        }
         
     }
     if (delay==0)
         visit(maincolor);
     else
         setTimeout("visit('" + maincolor + "')",delay);
  
}

function trycount(i,j)
{
    visited = ',';
    stack = [];
    stacksize = 0;
    foundcolor = '';
    returnsoon = false;
    
    let n;
    while ( true)
    {
        n = next(i, j, TRANSPARENT);
        if (n == null) break;
        i = n[0];
        j = n[1];
    }
    
    if (foundcolor == BLACK || foundcolor == WHITE)
    { 
        let a = visited.replace(/^,/,'').replace(/,$/,'').split(/,/);
        for (let i=0; i < a.length; i++)
        {
            if (foundcolor == WHITE) wcounter++;
            else if (foundcolor == BLACK) bcounter++;
            setcolor($('s' + a[i]), foundcolor);
            if (isblack(go.mycolor) && foundcolor == WHITE || iswhite(go.mycolor) && foundcolor == BLACK)
            increment('mycount',1);
              else
            increment('hcount',1);
        }
   }
   else
       gcounter += visited.replace(/^,/,'').replace(/,$/,'').split(/,/).length;
}

function trycountdemo(i,j)
{
    visited = ',';
    stack = [];
    stacksize = 0;
    foundcolor = '';
    returnsoon = false;
    nextdemo(i,j);
}

function enddepth()
{
       go.status = DONECOUNT;  
       setstatus(DONECOUNT); 
       fm.count.value = gokeyword[15];
       $('gcounter').innerHTML =  gcounter;
       $('gcounter').parentNode.cells[0].innerHTML = '<div style="width:26px;height:26px;border-radius:13px;background-image:radial-gradient(#999999,#666666)"></div>';//gokeyword[52];
       if (gcounter + bcounter - 3.75 <= wcounter && isblack(go.mycolor) 
               || gcounter + wcounter <= bcounter - 3.75 && iswhite(go.mycolor))
       {
            if (gcounter < 30) 
            {
                if (gcounter ==0 && isblack(go.mycolor))
                {
                    go.result = (bcounter - 3.75 - wcounter);
                    gameover(go.result,true);
                }
                else if (gcounter ==0 && iswhite(go.mycolor))
                {    
                    go.result = wcounter - bcounter + 3.75;
                    gameover(go.result,true);
                }
                else
                    appendmsg(gokeyword[23]);
            }
       }
       else if (gcounter + bcounter- 3.75 <= wcounter && iswhite(go.mycolor) 
               || gcounter + wcounter <= bcounter- 3.75 && isblack(go.mycolor))
       {
            if (gcounter < 30) 
            {
                if (gcounter ==0 && iswhite(go.mycolor))
                {    
                    go.result = wcoutner - bcounter + 3.75;
                    gameover(go.result,true);
                }
                else if (gcounter ==0 && isblack(go.mycolor))
                {
                    go.result = bcounter - 3.75 - wcounter;
                    gameover(go.result,true);
                }
                else sendmsg('gokeyword[23]');
            }
       }   
      
}
function endeach()
{
    if (foundcolor == BLACK || foundcolor == WHITE)
    { 
       
        let a = visited.replace(/^,/,'').replace(/,$/,'').split(/,/);
        for (let i=0; i < a.length; i++)
        {
            setcolor($('s' + a[i]), foundcolor);
            if (isblack(go.mycolor) && foundcolor == WHITE || iswhite(go.mycolor) && foundcolor == BLACK)
            increment('mycount',1);
              else
            increment('hcount',1);
        }
   }
   else  gcounter += visited.replace(/^,/,'').replace(/,$/,'').split(/,/).length;
}
function nextdemo(i,j)
{
    let n = next(i, j, TRANSPARENT);
    
    if (n != null)
    {
        if (delay<=0)
           nextdemo(  n[0], n[1] ); 
        else setTimeout('nextdemo(' + n[0] + "," + n[1] + ")",delay);
    }
    else
    {
       endeach();
       let i,j;
       for ( i=0; i < NL; i++)
       {    for ( j=0; j < NL; j++)
               if (getcolor(i,j) == TRANSPARENT) break;
           if (j!=NL) break;
       }  

       if (i < NL && j < NL)
           trycountdemo(i,j);
       else
       { 

           enddepth();
       }
   }         
}

 
function countswitch(btn)
{
    if (btn.value == gokeyword[14] && go.status!=INCOUNTING) 
    {
        countfillall();
        if ($('count1')!=null)
            $('count1').value = gokeyword[15];
        fm.count.value = gokeyword[15];
    }
    else if( go.status == DONECOUNT)  
    {
        uncount();
        fm.count.value = gokeyword[14];
        if ($('count1')!=null)
            $('count1').value = gokeyword[14];
        btn.value = gokeyword[14];
        $('gcounter').innerHTML = '';
        $('gcounter').parentNode.cells[0].innerHTML = gokeyword[81];
        closeprompt();
    }
}
function myprompt1(x,y,z,w)
{
    myprompt(x,y,z,w);
    promptwin.style.width = '460px';
    if (x.substring(0,4).indexOf('<ul>')>0)
        promptwin.style.top = playertbl.offsetHeight + 'px';
    else
        promptwin.style.top = '140px';
    promptwin.style.left = ($("a").offsetWidth + 5)  + "px";
}
 
let holdcolor = ',';
let holdcount  = [0,0];
let holdstatus = '';
let goway = 0;
function slow()
{
    
    let x ='<div>' + textmsg[1893];
    x += '<center><br>' + gokeyword[92] + ':<select name=delay onchange=getdelay(this) style=width:200px>'; 
    for (let j=0; j < 10; j++) 
        x +=  "<option value=" + j*10 + ' ' + ((j*10==delay)?'selected':'') + ">" + j*10+ " milliseconds</option>";
    x +='</select><br><br>' + gokeyword[93] + ':<select name=way onchange=getway(this)  style=width:200px ><option value=0 ' + (goway==0?'selected':'')
            + '>' + gokeyword[98] + '</potion><option value=1 ' + (goway==1?'selected':'') + '>' + gokeyword[99] + '</option><option value=2  ' 
            + (goway==2?'selected':'') + '>' + gokeyword[100] + '</option><option value=2  ' 
            + (goway==3?'selected':'') + '>' + gokeyword[101] + '</option></select>'
+ '</div><div  class=outset1 style="width:400px;margin:3px 3px 3px 3px;visibility:' + (goway==3?'visible':'hidden') + '" id=shortpath>' 
+ "" + gokeyword[94] +  "<input id=destiny size=6 value=\"1,14\"> " + gokeyword[95] +  "<input id=source size=6 value=\"0,0\">.  " 
+ '' + gokeyword[96] + ' <br><center><input name=go class=GreenButton width=80 type=button value=' + gokeyword[97] + ' onclick=routing()></center></div>';
    myprompt1(x
    +"<center><input id=count1 class=OrangeButton style=width:76px  type=button value=\"" + gokeyword[14] + "\" onclick=countswitch(this)><center>"
    ,null,null,gokeyword[10]);
     
}


function getway(v)
{ 
    goway =  v.selectedIndex;
    $('shortpath').style.visibility = goway==3?'visible':'hidden';
} 
function getdelay(v)
{
    delay = parseInt(v.options[v.selectedIndex].value);
}
function dohold()
{
    holdcolor = ',';
    for (let i=0; i < NL; i++)
    { 
         for (let j=0; j < NL; j++)  
         {
            let x = getcolor(i,j);
            if (x == BLACK) 
                holdcolor += '0_' + i + '_' + j + ',';
            else if( x == WHITE)
                holdcolor += '1_' + i + '_' + j + ',';
                
         }
    }
}
function save0()
{
    dohold();
    if(go.mycolor == BLACK) holdcolor+='0'; else  holdcolor+='1';
    if (clickable) holdcolor+='0';  else  holdcolor +='1';
    let s=0;
    for (let k=0; k < holdcolor.length; k++)
    {
        s += holdcolor.charCodeAt(k);
    }
    return  holdcolor  + '_' + s;
}
function countfillall()
{
    maxstacksize = 0;
    dohold();
    holdcount  = [$('mycount').innerHTML,   $('hcount').innerHTML]
    bcounter = isblack(go.mycolor)?parseInt($('mycount').innerHTML) : parseInt($('hcount').innerHTML);
    wcounter=  isblack(go.mycolor)?parseInt($('hcount').innerHTML) : parseInt($('mycount').innerHTML);
    gcounter=0;
    holdstatus = go.status;
    setstatus(INCOUNTING);  
   clickable = false;
   let i=0,j=0;
   for (; i < NL; i++)
   {
       for (j=0; j < NL; j++)  
       if (getcolor(i,j) == TRANSPARENT) 
           break;
       if (j != NL) break;
   }
   if (i < NL && j < NL) 
   {
       if (goway < 3)
           trycountdemo(i,j);
       else 
           breadth(i,j, TRANSPARENT);
   }
   else
   { 
       enddepth();
   }          
}

function setcolors(x)
{
     let a= 0, b=0;
     for (let i=0; i < NL; i++)
    { 
         for (let j=0; j < NL; j++)  
         {
             if (x.indexOf(',0_' + i + '_' + j + ',')>=0)
             {b++; setcolor(getstone(i,j),BLACK);}
             else if (x.indexOf(',1_' + i + '_' + j + ',')>=0)
             {a++;setcolor(getstone(i,j),WHITE);}
             else if (x.indexOf(',2_' + i + '_' + j + ',')>=0)
             { setcolor(getstone(i,j),'#999999');}
             else  
             setcolor(getstone(i,j),TRANSPARENT);
         }
    }
    if (go.mycolor == BLACK) {
     $('mycount').innerHTML = '' + b;
     go.mycount = b;
    $('hcount').innerHTML = '' + a;
    go.oppcount = a;
}
else
    {
     $('mycount').innerHTML = '' + a;
    $('hcount').innerHTML = '' + b;
     go.mycount = a;
     go.oppcount = b;
}
}

function uncount()
{
    setcolors(holdcolor);
    $('mycount').innerHTML = holdcount[0];
    $('hcount').innerHTML = holdcount[1];
     go.mycount = holdcount[0];
    go.oppcount = holdcount[1];
    clickable = true;
    setstatus(holdstatus);
}

function  usethiscolor(dv)
{
      
     if (dv.parentNode == scoretbl.rows[2].cells[0])
     {
         let t = scoretbl.rows[2].cells[2].innerHTML;
         scoretbl.rows[2].cells[2].innerHTML = scoretbl.rows[1].cells[2].innerHTML;
         scoretbl.rows[1].cells[2].innerHTML = t;
     }
     if (go.status == INIT || go.status == PAIRINGUP) 
    {
        
        if (dv.innerHTML.indexOf(BLACK)>=0) 
        {
            go.mycolor = BLACK;
            go.oppcolor = WHITE;
            setcolor($('myclr'), go.mycolor);
            setcolor($('hisclr'),go.oppcolor);
        }
        else if (dv.innerHTML.indexOf(WHITE)>=0) 
        {
            go.mycolor = WHITE;
            go.oppcolor = BLACK;
            setcolor($('myclr'), go.mycolor);
            setcolor($('hisclr'),go.oppcolor);
        }
        else   
        {
            go.mycolor = TRANSPARENT;
        }
        
    }
}

function containRemove(i,j, targetcolor)
{
    visited = ',';
    stack = [];
    stacksize = 0;
    foundcolor = '';
    returnsoon = true;
    let n;
    while ( true)
    {
        n = next(i, j, targetcolor);
        if (n == null) break;
        i = n[0];
        j = n[1];
    }
    if (foundcolor == BLACK || foundcolor == WHITE)
    { 
        let a = visited.replace(/^,/,'').replace(/,$/,'').split(/,/);
        for (let i=0; i < a.length; i++)
        {
            setcolor($('s' + a[i]), TRANSPARENT);
            if (isblack(go.mycolor) && foundcolor == WHITE || iswhite(go.mycolor) && foundcolor == BLACK)
                increment('mycount',-1);
            else
                increment('hcount',-1);
        }
        return a.length;
   }
   return 0;
}


function increment(s, i)
{
    let y = $(s);
    if (i == '')
    {
       y.innerHTML = '0';
       return;
    }
    let k = i + parseInt(y.innerHTML);
    y.innerHTML = ''+k;
}
 
function containRemove4(y)
{
    let n = 0;
    let i = parseInt(''+y[0]);
    let j = parseInt(''+y[1]);
    let r = [ [i-1,j], [i+1, j], [i,j-1], [i, j+1] ];
    let thiscolor = getcolor(i,j);
    for (let k=0; k < 4; k++)
    {
        let othercolor = getcolor(r[k][0],r[k][1]);
        if (thiscolor == WHITE && othercolor ==BLACK 
           || thiscolor == BLACK && othercolor ==WHITE )
          n +=  containRemove(r[k][0],r[k][1],othercolor);
    }
     
   return n;
}
function setclickable(b)
{
    clickable = b;
}
 
function check35(z,total)
{
    z[0] = parseInt(z[0]+'');
    z[1] = parseInt(z[1]+'');
    let c, c0 = getcolor(z[0],z[1]);
    let d = [[0,1],[1,0],[1,1],[1,-1]];
    if (c0!=BLACK && c0!=WHITE) return false;
    for(let i=0; i < 4; i++)
    {
       let j,sum=0;
       for (let k = -1; k <=1; k+=2)
       {
           for (j=1;(c = getcolor(z[0]+k*j*d[i][0],z[1]+k*j*d[i][1]))==c0;j++);
           sum += j;
       }
       if (sum > total) return true;
    }   
    return false;    
}
let savedcolor = '';
let initcolor = '';
function goback()
{
   if (fm.count.value == gokeyword[15])
   {
      fm.count.click(); 
   }
}
function clickstone(d)  
{
    goback();
    if (Exchange.mode != '') return;
    if (go.status==GOINGON && go.turn!='me')
    {
        appendmsg('Not my turn!');
        return;
    }
    if (clickable == false)
    {
         if ( go.status==GOINGON)   
             appendmsg('My turn!');
        return;
    }
    let z = getcord(d);
    if (go.type==2 && (z[0] >=3 || z[1]>=3))
    {
        appendmsg("Beyong border. Please use the first three rows and columns");
        return;
    }
    let clr = getcolor(z[0], z[1]);
    if ((clr == BLACK || clr == WHITE))
    {
        
        if (go.status != INIT && go.status!=PAIRINGUP)
            return;
        savedcolor = clr;
    }
    if (tryingid == '' )
    {
        setcolor(d,'grey'); 
        tryingid = d.id;
    }
    else if (tryingid == d.id)
    {
        setcolor(d, go.mycolor); 
        
        if (go.type == 1 && check35(z,5) || go.type == 2 &&  check35(z,3))
        {
            z = getcord(d);
            makesound(2);
            
            increment('mycount',1);
            sendmove(tryingid.substring(1));
            //go.stone[go.stone.length]=tryingid.substring(1);
            gameover(1,true);
            tryingid = ''; 
            return;
        }
        else if (go.type == 0)
        {
            let n1 = containRemove4(z);
        if(  n1 == 0)
        {
             
            if (go.status==GOINGON ) 
            {
                let goodtogo=false;
                let q = [getcolor(z[0]-1,z[1]),  getcolor(z[0]+1,z[1]),   getcolor(z[0], z[1]-1),  getcolor(z[0],z[1]+1)];
                for (let i=0; i < 4; i++) 
                {
                    if (q[i] == go.mycolor || q[i] == TRANSPARENT)
                    {
                        goodtogo=true;
                        break;
                     }
                }
                if (goodtogo==false) 
                {
                    setcolor(d, TRANSPARENT);
                    appendmsg(gokeyword[26] );
                    return;
                }
            }    
        }
        else
        {
            appendmsg(gokeyword[114].replace(/@/,''+n1).replace(/@/,''+map2color(go.oppcolor)));
        }
    }
    
        if (go.status ==GOINGON && go.turn == 'me')
        {
            makesound(2);
            
            increment('mycount',1);
            sendmove(tryingid.substring(1));
            //go.stone[go.stone.length]=tryingid.substring(1);
        }
        else if ( go.status ==INIT || go.status == PAIRINGUP)
        {
            makesound(2);
            if (go.mycolor == WHITE )
            {
                 if (savedcolor != WHITE)
                    increment('mycount',1);
            } else if (go.mycolor == BLACK)
            {
                 if (savedcolor != BLACK)
                     increment('mycount',1);
            }
            else 
            {
                 if (savedcolor == BLACK && go.oppcolor == WHITE
                         || savedcolor == WHITE && go.oppcolor == BLACK)
                    increment('mycount',-1);
                 else  if (savedcolor == BLACK && go.oppcolor == BLACK
                         || savedcolor == WHITE && go.oppcolor == WHITE)
                    increment('hcount',-1);
                 go.mycolor = $('myclr').innerHTML.includes(BLACK)?BLACK:WHITE;
            }
        }
        tryingid = ''; 
         
    }
    else 
    {
        setcolor($(tryingid), TRANSPARENT);
        setcolor(d,'grey'); 
        tryingid = d.id;
    }
}
 
function setstatus(s)
{
    go.status = s;
    if (s == GOINGON)
    {
        fm.count.value = gokeyword[14];
        fm.count.style.visibility = 'visible';
        gamestart = (new Date()).getTime();
    }
    if (s == INIT)
    {
        fm.count.style.visibility = 'visible';
    }
    else if (s == PAIRINGUP)
    {
        fm.count.value = gokeyword[14];
        fm.count.style.visibility = 'visible';
    }
    else if (s == INCOUNTING || s== DONECOUNT)
    {
        fm.count.value = gokeyword[15];
        fm.count.style.visibility = 'visible';
    }
}
 
function clean()
{
    for (let i=0; i < NL; i++)
        for (let j=0; j < NL; j++)
            setcolor(getstone(i, j),TRANSPARENT);
    increment('mycount','');
    increment('hcount','');
}
 
  
function execreturn(y)
{
    try
    {
       eval(y);
    }catch(e)
    {
       appendmsg("Error in executing: " + y );
    }
    frash(0);
}
function sendmsg(mg)
{
    goback();
    let v = (mg==null?fm.myword.value:mg);
    if ( v == null || v=='' || go.id ==-1 || go.opponent==-1) return;
    let b = Exchange.mode == '' && (go.status == PAIRINGUP ||  go.status == GOINGON)
          ||Exchange.mode == 'watch' && Exchange.id > -1;
    if (!b) return;
    
    if (Exchange.mode == '')
    {
        let oid = go.opponent;
        if ($('who') != null)
        {
            oid =  fm.who.options[fm.who.selectedIndex].value;
        }
        if (oid<0) return;  
        
        let s =  "&act=msg&oppid=" + oid  + "&content="  + v;
        Exchange.sendMessage(s,'');
    }
    else if (typeof fm.who != "undefined")
    {
        let s =   "&act=msg&who=" + fm.who.selectedIndex + "&content="  + v;
        Exchange.sendMessage(s,'watch');
    }
}
function resume(t)
{
   if (secondhandle!=null)
   clearInterval(secondhandle);
   eseconds = 0;
   if (t!=null) 
   {
      if (t=='me') go.turn = 'opp';
      else if (t == 'opp') go.turn = 'me';
      else go.turn  = '';
   }
   if (go.turn=='me')
   {
       secondhandle = setInterval(readmyseconds,1000);
   }
   else
   {
       secondhandle = setInterval(readhseconds,1000);
   }
   $('result').innerHTML ='';
   $('watch').style.visibility = 'hidden'
}
function sendmove(mg)
{
    if (mg.replace(/[0-9]+_[0-9]+/,'')!='' || go.opponent < 0 || go.id < 0)
         return;
    clearInterval(secondhandle);
    eseconds = 0;
    secondhandle = setInterval(readhseconds,1000);
    go.turn = 'opp';
    let s =  "&act=move&oppid=" + go.opponent  + "&xy=" + mg;
    Exchange.sendMessage(s,'');
}
function givein(x)
{
   let N = parseInt( x[2] )-4;
   if (N >= 1) setcolor(getstone(3, 3),go.mycolor);
   if (N >= 2) setcolor(getstone(3, 15),go.mycolor);
   if (N >= 3) setcolor(getstone(15, 3),go.mycolor);
   if (N == 4) setcolor(getstone(15, 15),go.mycolor);
   if (N <= -1) setcolor(getstone(3, 3),go.oppcolor);
   if (N <= -2) setcolor(getstone(3, 15),go.oppcolor);
   if (N <= -3) setcolor(getstone(15, 3),go.oppcolor);
   if (N <= -4) setcolor(getstone(15, 15),go.oppcolor); 
   if (N>0)$('hcount').innerHTML = ''+N;
   else if (N<0)$('mycount').innerHTML = ''+(-N);
    
}

function replacewords(w)
{
    w.innerHTML = w.innerHTML.replace(/Login/g, gokeyword[70]).replace(/User ID/, gokeyword[59]).replace(/Password/, gokeyword[60]);
}
 
 
function givenup(color)
{
    if (go.status==GOINGON)
    {
        if (go.mycolor == BLACK && color == 0 || go.mycolor == WHITE && color == 1)
            gameover(10);
        else
        {
            gameover(-10);
        }
        appendmsg(gokeyword[40-color] + " " + gokeyword[120]);
        go = JSON.parse(JSON.stringify(GO0));
        $('newbtn').value = gokeyword[27];
        $('watch').value = gokeyword[111];
    } 
}
function giveup0()
{
    myprompt1(msg1521 + '?',null, 'if(v)giveup1()');
      
}
function accident()
{
   if (go.opponent < 0 || go.id < 0) return;
   clearInterval(secondhandle);
   archive();
   let s = "&act=accident&oppid=" + go.opponent;
   Exchange.sendMessage(s,''); 
}
function giveup1()
{
   if (go.opponent < 0 || go.id < 0) return;
   clearInterval(secondhandle);
   go.result = -10;
   gameover(-10);
   let s = '&act=giveup&oppid='+ go.opponent;
   go.listenmore = false;
   $('newbtn').value = gokeyword[79];
   Exchange.sendMessage(s,''); 
}
let nomsgcount =0;
function nothing(){
   nomsgcount++;
   if (nomsgcount == 5)
   {
       if (Echange.mode == '')
       {
          if (go.status == PAIRINGUP)
             quitwait();
          else
             accident(); 
       }
       else
       {
           $('watch').click();
       }
   }
} 
function showresult()
{
    if (go.result > 0)
    {
        $('result').innerHTML =     gokeyword[2] + " "+ go.result+ " " + gokeyword[30];
         
    }
    else if (go.result < 0) 
    {
        $('result').innerHTML =    gokeyword[2] + " "+ (-go.result) + " "+ gokeyword[30];
       
    }
    else
        $('result').innerHTML = '';
}
function addbackwatch()
{
    $('watch').style.visibility = 'visible';
}
function  gameover1(result,color)
{
    if (go.status==GOINGON)
    {
        if (go.mycolor == BLACK && color == 0 || go.mycolor == WHITE && color == 1)
        gameover(result);
        else
        gameover(-result);
    }
    go.status = COMPLETE;
    addbackwatch();     
}
function  gameover(result,noticeopp)
{
    if (go.opponent < 0 || go.id < 0 ||go.status==COMPLETE) return;
    go.result = result; 
    makesound(2);
    clearInterval(secondhandle);
    go.turn = '';
    if (go.result>0)
    {  
         scoretbl.rows[1].cells[1].appendChild(document.createTextNode('(' + gokeyword[2] + ')'));
    }
    else
    {  
         scoretbl.rows[2].cells[1].appendChild(document.createTextNode('(' + gokeyword[2] + ')'));
    }
     go.status = COMPLETE;
     archive();
     showresult();
     window.onbeforeunload = null;
     $('newbtn').value==gokeyword[79];
     enablemsg(false);
   if (noticeopp != null)
   {
       let s = "&act=gameover&oppid=" + go.opponent +"&result=" + (-go.result);
        Exchange.sendMessage(s,''); 
   }
}
let oldonbegin = window.onload;
function beforeclose()
{
    return go.id + ": " + textmsg[791];
}
window.onload = function()
{
    if (oldonbegin != null) oldonbegin();
    fm.myword.style.width = (msgwidth) + 'px';
    enablemsg(false);
    onbegin();
}
function demo()
{
    if(go.status!=INIT && go.status!=PAIRINGUP) {myprompt1(PAIRINGUP);return;}
    setcolors("0_0_0,0_0_1,0_0_3,0_0_6,1_0_11,0_0_12,0_0_13,0_0_14,1_0_15,0_1_1,0_1_2,0_1_3,0_1_5,0_1_7,1_1_11,0_1_12,0_1_14,1_1_15,0_2_6,1_2_10,1_2_12,0_2_13,0_2_14,1_2_15,1_3_13,1_3_14,1_9_15,1_9_16,1_9_17,1_10_15,1_10_17,1_11_15,1_11_16,1_11_17,0_12_0,0_12_1,1_12_15,0_12_16,1_12_17,0_13_1,0_13_2,0_13_3,0_13_15,0_13_17,0_14_0,0_14_1,0_14_2,0_14_15,0_14_16,0_14_17,0_15_0,0_15_2,0_15_15,0_15_17,0_16_0,0_16_1,0_16_15,0_16_16,0_16_17,");
    let s = msg1614.replace(/<br>/,"<ul><li>");
    s = s.replace(/<br>/g,"<li>");
    myprompt1(s + "</ul>",null,null,gokeyword[5]); 
    
}

function rand(){
    if(go.status!=INIT && go.status!=PAIRINGUP) {myprompt1(gokeyword[37]);return;}
    let s = '';
    for (let k=0; k < 150; k++)
    {
        let x = Math.round(19*Math.random());
        let y = Math.round(19*Math.random());
        if (s.indexOf('_'+x+'_'+y+',')<0)
        {
            if (Math.random()>0.5)
                s += '1_'+x+'_'+y+',';
            else
                s += '0_'+x+'_'+y+',';
        }
    }
    setcolors(s);
}  

function save()
{
        let mime_type =  "text";
        if (go.opponent > -1)
        {
           archive();
        }
        let contents = JSON.stringify(goes);
        let blob = new Blob([contents], {type: mime_type});
        let dlink = document.createElement('a');
        dlink.download = "gogame-backups.txt";
        dlink.href = window.URL.createObjectURL(blob);
        dlink.onclick = function(e) {
            let that = this;
            setTimeout(function() {
                window.URL.revokeObjectURL(that.href);
            }, 1500);
        };

        dlink.click();
        dlink.remove();
    }
 
function upload(){}

function restore()
{
     if(go.status!=INIT && go.status!=PAIRINGUP) 
     {
         myprompt1(gokeyword[37]);
         return;
     }
     myprompt1(msg1522 + '<input type=hidden id=hidetxt><input type="file" style="border:1px #b0b0b0 solid;" id=localpath onchange="openlfile(this)" >' 
     );
}
function afterloadlocal()
{
    let x = $("hidetxt");
    goes = JSON.parse(x.value);
}
function openlfile(td)
{
    let x = $("hidetxt");
    openfileto(td, x, afterloadlocal);
}
 
function getidv(bx)
{
   document.f1.id.value = bx.value;
}

function getPassv(bx)
{
   document.f1.password1.value = bx.value; 
}

function doupload(fn)
  {
        if (fn.files.length==0) return;
        let xmlhttp;
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
                let y = '';
               
                let j = xmlhttp.responseText.indexOf('syn(');
                if (j > 0)
                {
                    let k = xmlhttp.responseText.indexOf(')',j+6);
                    y = xmlhttp.responseText.substring(j,k+1);
                }
                else
                {
                    j = xmlhttp.responseText.indexOf('failupload(');
                    if (j > 0)
                    {
                        k = xmlhttp.responseText.indexOf(');',j+6);
                        y = xmlhttp.responseText.substring(j,k+1).replace(/failupload/,'myprompt');
                    }
                }
                eval(y);
            }
        }
        let f = new FormData();
        let file = fn.files[0]
        f.append('file', file);
        f.append('rdap', 'gogame');
        xmlhttp.open('POST', "UploadWfa", true);
        xmlhttp.send(f);
    
  }
  function syn(z,fn)
  {
      ResizeUploaded.uploaded(z, fn);
      let s = $('uploadinstru');
      s.rows[0].cells[2].onclick = function(){ResizeUploaded.cropuse(4);}
      s.rows[0].deleteCell(3);s.rows[0].deleteCell(3);s.rows[0].deleteCell(4); 
  }  
  function failupload(t, fl, fn, pathcode)
  {
   
  }
  function idblackwhite(t)
  {
      setcolors(t);
  }
  function help()
  {
      myprompt1("<ol><li>" + gogamehelp.replace(/@/g,"</li><li>") + "</li></ol>",null,null,gokeyword[11]);
  }
  function canabort()
  {
      $('newbtn').value = gokeyword[108];
      appendmsg(gokeyword[109]);
  }
  function makesound(j)
  {
       if( "Audio" in window) 
        {
            let str = "image/doorbell.mp3";
            if (j==2)str = "image/placestone.mp3";
            let a = null;
            try
            {
                a = new Audio();
                if ( (a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, '')))
                   a.src = str;
                a.autoplay = true;
             }catch(ee){} 
         }
     }
draw(NL-1);draw(NL);
let board = $('board');
$('a').style.width = board.offsetWidth + 'px';
$('a').style.height = (board.offsetHeight) + 'px';   
window.title = gokeyword[48];
for(let k in gametypes)
typesel.options[k] = new Option(gametypes[k],k);
timecapsel.options[0].text = gokeyword[88];
ranksel.options[0].text = gokeyword[88];
fm.sendbtn.style.background = 'grey';
let str0 =   '<table><tr><td><select onchange=chooselang1(this)>';
for (let j =0; j < 2; j++)
    str0 +="<option value=\"" + enlang[j] + "\" " + (unic[j]==langname?"selected":"") + "  >" + unic[j] + "</option>"
  //onclick="changeencoding(this,langu)">&vellip; </span></td>';
str0 += "</select><td><select onchange=chgfontname(this) >";
for (let j =0; j < 3; j++)
{
        if (allfonts[j]==cachedfontname) fontnameorder = j;
        str0 += "<option value=\"" + allfonts[j] + "\" " + (allfonts[j]==cachedfontname?"selected":"") 
                + " >" + allfonts[j].replace(/,.*/,"") + "</option>";
}
str0 += "</select></td></tr></table>";
$('titlediv').style.verticalAlignment = 'middle';
lang.innerHTML = str0;
lang.width= 150;
playertbl.rows[0].style.backgroundImage = 'linear-gradient(' + BBGCOLOR + "," + DBGCOLOR + ")";
scoretbl.rows[0].style.backgroundImage = 'linear-gradient(' + BBGCOLOR + "," + DBGCOLOR + ")";
msgboard.style.backgroundColor = DBGCOLOR;
function chgfontname(sel)
{
  localStorage['myfontname'] = myfontname = defaultfontfamily = cachedfontname = sel.options[sel.selectedIndex].value;
   unifonts(document.body, myfontname);
}
function chooselang1(sel)
{
    let i = sel.selectedIndex; 
    let newnum = i*65536 + ORGNUM;
    SetCookie("orgnum", ""+newnum);
    document.location.href='go.jsp?orgnum=' + newnum;
}
     
