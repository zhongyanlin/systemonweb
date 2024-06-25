 var accum = 0;
 var timeleave = localStorage[savedQuizName+'L'];
 if (timeleave!=null)accum = parseInt(timeleave); 
  
 if (typeof(isembedquiz) =='undefined') 
     var isembedquiz = false;
 var timerstr = "<div id=\"floater1Div\" style=\"margin:2px 2px 0px 0px;position:fixed;left:" + (thispagewidth()-100) + "px;top:0px;z-index:20;border:2px;#b0b0b0;outset\">"
+ round1() + "<table bgcolor=#CCCCCC cellpadding=3 cellspacing=1>"
+ (isembedquiz?"":"<tr><td class=outstand onclick=showraw()  align=left  style=color:blue;cursor:pointer>" + ( thesid.length>5 ? thesid.substring(thesid.length-5) : thesid )+ "</td></tr>")
+ "<tr><td class=outstand style=color:purple;font-family:arial>00'00\"</td></tr>"
+ (isembedquiz?"0":("<tr><td align=left class=outstand style=color:" + (typeof(document.form1.submit2)=='undefined'?"red":"green") + ";font-family:arial>" + accum) + "'</td></tr>")
+ "</table>" + round2 + "</div>";
var win2 = parent.frames[1]; 
document.write(timerstr);

function checksum(x)
{
    if (x == null || x == '')
        return 0;
    x = x.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
    var s = 0;
    var i = 0;
    for (var j=0; j < x.length; j++)
    {
        if (x.charAt(j) == '\n' || x.charAt(j) == '\r') continue;
        s += (++i)*x.charCodeAt(j);
    }
    return s;
}
function checktxt(x)
{
    if (x == null || x == '') return true;
    x = x.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
    var j1 = x.indexOf('\n'); 
    var j2 = x.indexOf('\r');
    if (j1 == -1 && j2 ==-1) return false;
    else if (j1==-1 && j2>0 || j2>0 && j1>0 && j2 < j1)
         j1 = j2;
     
    var i = parseInt(x.substring(0,j1));
    if ('' +i == 'NaN') return false;
    return i == checksum(x.substring(j1+1));
}
function chatdiv()
{
    var str = "<div style=text-align:center;font-size:17px;font-family:"+ myfontname + ";font-weight:700>" +textmsg[1792] + "</div><textarea id=chattxt style=width:97%;height:90px onfocus=\"javascript:parent.frames[0].checkreply()\" ";
    str += " onkeydown=\"if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}\" ";
    str += " onkeypress=\"return chatdisplaytxt(this,event)\" ";        
    str += "></textarea><center><input type=button id=chatbtn class=GreenButton style=\"width:70px\" name=s0 value=\""    + textmsg[223] + "\" onclick=\"chatsend()\"></center>";
    str += "<div id=chatmsg style=\"border:1px #cccccc solid;border-radius:3px;font-size:12px;font-family:" + myfontname +"\" >" + chatmsgbind() + "</div>";
    
    return str;
}
var questionasked = false;
function checkreply()
{
    postopen('follows.jsp', 
    ["x","course","assignname"],
    ["checkquestion",f1.course.value, f1.assignname.value], 
     "w"+parent.frames[0].tstmp);
}
var askingquestion = false;
var askee = "";
let posttime = 0;
function askquestion()
{
    if (proctors.includes(f1.subdb.value))
       askee = f1.subdb.value;
    else
       askee = proctors.replace(/,.*$/,'');
    posttime = (""+(new Date()).getTime()).replace(/...$/,'');
    let content = parent.frames[1].document.getElementById('chattxt').value;
    let subject =  f1.course.value + ":" + f1.assignname.value + ":" + f1.semester.value+ ":" + textmsg[178] ;
    let format = guessFormat(content);
    let wcds =  "i'" + askee 
            + "','" + posttime
            + "','" + subject
            + "','"+ content 
            + "','" + format + "','" + f1.subdb.value  + "',''"; 
    askingquestion = true;
    postopen("SaveBack", 
    "rdap,rsacode,subdb,wcds".split(/,/),
    ["messageTo","0",f1.subdb.value,wcds],
    "w"+tstmp);
}
function askquestionqueue()
{
    parent.frames[1].document.getElementById('chattxt').value = '';
    questionasked = true;
    postopen('follows.jsp', "x,posttime,askee,course,assignname,subdb".split(/,/),
    ["askquestion",posttime,askee,f1.course.value,f1.assignname.value,f1.subdb.value],
    "w"+tstmp);
}
let chatmsgcache = localStorage[savedQuizName+'h'];
if (chatmsgcache == null)
{
    var chatmsgnum = 0;
    var chatmsgs = new Array();
    if (typeof(ugentmsg)!='undefined')
        chatmsgs[0] = ugentmsg;
    else 
        chatmsgs[0] = '';
    var chatmsgorient = new Array();
    chatmsgorient[0] = 0;
}
else
{
   let temp = JSON.parse(chatmsgcache);
   var chatmsgnum = temp.num;
   var chatmsgs = temp.msg;
   if (chatmsgs[chatmsgs.length-1] == textmsg[1895])
       questionasked = true;
   if (typeof(ugentmsg)!='undefined')
   {   
       chatmsgs[chatmsgs.length] = ugentmsg;
       questionasked = false;
   }
   else 
      chatmsgs[chatmsgs.length] = '';
   var chatmsgorient = temp.msgorient;
   chatmsgorient[0] = 0;
}

var setchatmsgnum = function(s){ chatmsgnum=s;}
var getchatmsgnum = function(){ return chatmsgnum;}
var getchatmsgs = function(){ return  chatmsgs;}
var getchatmsgorient = function(){return chatmsgorient;} 
  
function chatmsgbind()
{
    var str = "";
    for (var i=0; i <= chatmsgnum; i++)
    {
        str += "<div id=chatmsg" + i + " style=font-family:inherit;font-size:12px;width:100%;color:"+(chatmsgorient[i]==1?'#008800':'#000011')+" >" + (chatmsgorient[i]==1?'&uarr;':'&darr;' ) + chatmsgs[i] + "</div>";
    }
    return str;
}


var dyncontent = "";
 

function showraw(n)
{
   if (parent.frames == null || parent.frames.length <2)
       return null;
   var yy = parent.frames[1];
   if(yy==null) return;
   if (yy.document && yy.document.getElementsByTagName('head')!=null)
   {
       var len = yy.document.getElementsByTagName('head')[0].innerHTML.length;
       
       if (len > 300 )
       {
           if (document.getElementById('closebtn')!=null)
           {
               document.body.removeChild(document.getElementById('closebtn'));
               openedfileinframe1 = false;
           }
       }
       
   }
   if (!isembedquiz && parent.frames.length > 1 && openedfileinframe1 == false) 
   {
        var na = 3;
        if (n==null) 
            composecsv();
        var xx = '';
        if (sofar!='')
        {  
            sofar = sofar.replace(/^[0-9|a-z][0-9|a-z][0-9|a-z][0-9|a-z][0-9|a-z]+,/,'');
            xx =sofar.replace(/<(.textarea>)/ig, '&lt;$1');
            xx = checksum(xx) + "\n" + xx;
        }
          
        var xz = '<ol style=\"margin:2px 2px 2px 0px;padding:0px 0px 0x 0px\">' + textmsg[1338].replace(/\([0-9]\)/g, '<li style="margin:0px 0px 0px -10px;padding:0px 0px 0px 0px">') + "</ol>";
        var na=0;
        var X = xx.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        for (var j=0; j < X.length; j++)
            if (X.charAt(j) == '\n') 
                na++;
        if (na > 40) na = 40;
        if (na < 10) na = 10;
         
        var wit   = 250;
       var myfontname = localStorage['myfontname'];
       
      if (myfontname==null) myfontname = defaultfontfamily; 
       if (typeof(win2.document)!='undefined' && win2.document.getElementById("t") == null)
       {
          
          var xz = '<ol style=\"margin:2px 2px 2px 0px;padding:0px 0px 0x 0px\">' + textmsg[1338].replace(/\([0-9]\)/g, '<li style="margin:0px 0px 0px -10px;padding:0px 0px 0px 0px">') + "</ol>";
          var    yy = "<div id=chat class=outset3 style=\"font-size:16px;text-align:left;width:97%;margin:6px 1px 0x 1px;padding:3px 3px 3px 3px\">" + chatdiv() + "</div>"         
           + "<br><div id=instr class=outset3 style=\"font-size:16px;text-align:left;width:97%;margin:6px 1px 0x 1px;padding:3px 3px 3px 3px\" ><div style=\"text-align:center;font-size:17px;font-family:"+ myfontname + ";font-weight:700\">"  + textmsg[1711] + "</div>" 
           + xz + "</div><br><div class=outset3><div style=text-align:center;font-size:17px;font-family:"+ myfontname + ";font-weight:700 >"  + textmsg[1795] + "</div><form rel=opener name=f style=\"margin:0px 0px 0px 0px\"method=post action=DataUpdate target=\"q" + tstmp + "\"   ><textarea name=Content id=t rows=" + na + "  style=\"font-size:" + ((typeof(document.form1.submit2) != 'undefined')?14:8) + "px;color:" + ((typeof(document.form1.submit2) != 'undefined')?'black':'#eee') + "px;width:99%;margin:0px 0px 10px 0px\"  onkeypress=\"return keyrestrict(event)\">" 
           + xx + "</textarea><center><input type=hidden name=rdap   value=submissionsave ><input type=hidden name=subdb   value=\"" + f1.subdb.value + "\"><input type=hidden name=sid   value=\"" + f1.sid.value + "\"><input type=hidden name=semester value=\"" + f1.semester.value + "\">"
   +"<input name=leavs type=hidden value=0><input type=hidden name=course value=\"" + f1.course.value + "\"><input type=hidden name=assignname value=\"" + f1.assignname.value + "\"><input type=hidden name=\"attach\" value=\"" + f1.attach.value + "\"  ><input type=hidden name=\"format\" value=\"" + f1.format.value + "\"  >";
          
           yy += "<input type=button id=restorebtn class=OrangeButton style=\"width:70px\" name=s value=\""    + textmsg[118] + "\" onclick=\"parent.frames[0].parseback();parent.frames[0].getbackf()\">"; 
          
            yy += "<input type=button id=previewbtn class=GreenButton style=\"display:none;width:70px\" name=s value=\""    + textmsg[408] + "\" onclick=\"parent.frames[0].previewass();parent.frames[0].getbackf()\">"; 
           yy += "<input type=button id=savedbtn class=GreenButton style=\"display:none;width:70px\" name=s1 value=\""    + textmsg[67] + "\" onclick=\"resumehalted();parent.frames[0].getbackf()\">"; 
           yy += "<input type=button id=clipbtn class=GreenButton style=\"width:70px\" name=clip value=\""    + textmsg[1945] + "\" onclick=\"parent.frames[0].toclip();parent.frames[0].getbackf()\">"; 
           yy += "<input type=button id=downbtn class=GreenButton style=\"width:70px\" name=down value=\""    + textmsg[1871].split(/@/)[3] + "\" onclick=\"parent.frames[0].download();parent.frames[0].getbackf()\">"; 
            yy += "</center></form></div><div id=relogin style=text-align:center></div><br><div id=google style=\"text-align:center;font-size:17px;font-weight:700;font-family:" + myfontname + ";color:blue;cursor:pointer;width:100%\" onclick=\"openbackup();parent.frames[0].getbackf()\" >" + (xx==''?'':textmsg[1340]) + "</div>";
           
          yy += "</center>"; 
          yy += "<iframe src=tm.gif name=\"q" + tstmp + "\" height=1 width=1 ></iframe>";//</body></html>";
     
          dyncontent = yy;
          open("quizhelp.jsp", parent.frames[1].name); 
           
       }
       else
       {  
           win2.document.f.attach.value = f1.attach.value;
           win2.document.getElementById("t").value = xx; 
           win2.document.getElementById("t").rows = na;
          
           var btn = win2.document.getElementById("restorebtn");
           if (btn!=null && sofar.length > 30)
           btn.style.display = 'none';
           btn =  win2.document.getElementById("previewbtn");
           if (btn!=null)
           btn.style.display = 'inline';
           btn =  win2.document.getElementById("savedbtn");
           if (btn!=null)
           btn.style.display = 'inline';
       
       }
       if (xx!='') 
       {
            
           var zz = win2.document.getElementById("google");
           if (zz!=null) zz.innerHTML = textmsg[1340];
           zz = win2.document.getElementById("t");
           if (zz!=null) 
           {  
               //zz.readOnly = 'true';
               wit = zz.offsetWidth;
           }
            var z = win2.document.getElementById("altform");
            if (z!=null)  z.style.width = (wit-5)   + 'px';
        }
    }
    unifonts(parent.frames[1].document.body, myfontname);
}
download = function() 
{
    let filename = f1.course.value + "-" + f1.assignname.value + '.txt';
    let contents = win2.document.getElementById("t");
        let mime_type =  "css/text";
        var blob = new Blob([contents.value], {type: mime_type});
        var dlink = document.createElement('a');
        dlink.download = filename;
        dlink.href = window.URL.createObjectURL(blob);
        dlink.onclick = function(e) {
            var that = this;
            setTimeout(function() {
                window.URL.revokeObjectURL(that.href);
            }, 1500);
        };

        dlink.click();
        dlink.remove();
}
function toclip()
{
    var copyText = win2.document.getElementById("t");
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
    document.execCommand("copy");
}
function parseback()
{
    var x = win2.document.getElementById("t").value;
    if (checktxt(x) == false) 
    {
        myprompt(msg1468);
        return;
    }
    x = x.replace(/^[ |\\-|0-9]+[\r|\n]+/,'');
    sofar = Math.round((new Date()).getTime()/1000) + "," + x;
    saved(true);
}
function Floater(div)
{
 this.div = document.getElementById(div);
  
 this.doFloat = function()
{
 var wd = thispagewidth();
 var het = thispageheight();
 var thescrollt  =  thescrolltop();
 var thescrolll =   thescrollleft();
 //myprompt(wd +',' + het +',' + tescrollt +',' + thescrolll);
 this.div.style.left = (thescrolll + wd - this.div.offsetWidth - 25 ) +"px";
 this.div.style.top = (thescrollt+ 45 )+"px";
}

 this.writetimeleft = function(x)
 { 
     var i=1;
     if (isembedquiz) i=0; 
     this.div.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[i].cells[0].innerHTML = x;
 }
 this.writetimeleave = function(x)
 { 
     if (isembedquiz)return; 
     this.div.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[2].cells[0].innerHTML 
             = x;
     if (proctored && settingstr.includes("6"))
     sendprocmsg('lf:'+x.replace(/'/,''));
     tic();
 }
 this.writestates = function(x){}// this.div.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[3].cells[0].innerHTML = x;}
}
 
 var pf = 1;
 var ef = 0;
 var lastx = (new Date()).getTime();
 
 var floater = null;
 var needresize = false;
 
 function eonf(x)
 {
 if ( pf==0 && ef==0)
 {
 accum += Math.round((x - lastx)/1000);
 parent.frames[1].document.f.leavs.value = ''+accum;
 if (floater != null) floater.writetimeleave(accum +"'");
 localStorage[savedQuizName + 'L'] = accum;
      
 }
 ef = 1;
 pf = 0;
 lastx = x;
 if (floater != null) floater.writestates(pf +" " + ef)
 if (ef==1) pf = 0;
 }
function eonfnow(){eonf( (new Date()).getTime());}
 function eonb(x)
 {
 if (ef==1) pf = 0;
 ef = 0;
 lastx = x;
 if (floater != null) floater.writestates(pf +" " + ef)
 if (ef==1) pf = 0;
 }
 
function eonbnow(){eonb( (new Date()).getTime());}
 function ponf()
 {
 var x = (new Date()).getTime();
 if (ef==1) pf = 0;
 if ( pf==0 && ef==0)
 {
 accum += Math.round( (x - lastx)/1000);
   
 if (floater != null)
 {  
     floater.writetimeleave(accum+"'");
 }
 localStorage[savedQuizName + 'L'] = accum;
 }
 lastx = x;
 pf = 1;
 if (ef==1) pf = 0;
 if (floater != null)
 {
     floater.writestates(pf +" " + ef);
     
 }
 if (ef==1) pf = 0;
  
 }
 function ponb(x,c)
 {
 
 if (ef==1) pf = 0;
 if (c!=null && pf == 0) return;
 pf = 0;
 if (floater != null)
 {
     floater.writestates(pf +" " + ef);
     
 }
 if (x==-1)
 {
 lastx = (new Date()).getTime();
 return;
 }
 else
 lastx = x;
 if (ef==1) pf = 0;
  
 }

 var timestart1 = 0;
 var answering = false;
  
 function tic()
 {
     if (typeof(timesplitmode)!='undefined' && timesplitmode) 
         return;
     var rightnow = (new Date()).getTime();
     var tl= Math.floor(timedue - rightnow/1000);

     var gap = 0;
     if (tl <  0)
     {
         if (answering == false)
         {
             floater.writetimeleft("00'00\"");
         }
          
     }
     else if (tl > 3600*24)
     {

         var day = Math.floor(tl/3600/24);
         var ch = (tl - 3600*24 < 3600 && doned2h == false);
         tl = Math.floor((tl %(3600*24))/3600);
         if (floater != null &&  answering == false) 
         {
             floater.writetimeleft("" + day + "d" + tl   + "h");
         }
         if (ch)
         {
             
             gap = 60000;if (Msg.app == 'exam' && activeidletime  < gap)
             gap = activeidletime ;
             
             doned2h = true; 
         }
         else  
         {
             gap = 3600000;
             if (Msg.app == 'exam' && activeidletime  < gap)
             gap = activeidletime ;
            
         }
     }
     else if (tl > 3600)
     {
         var h = Math.floor(tl/3600);
         var ch =( tl - 3600 < 60 && doneh2m == false)
         tl = Math.floor((tl%3600)/60); 
         if (tl == 2)
         {
             composecsv();
             if (sofar == '' && f1.attach.value == '')
             {
                 sendprocmsg('sofar=""');
                 tic();
                 myprompt('Warning:<br> you have not answered any question when the time is running out. <br>This warning message has been sent to the instructor as well.<br>You could fail this test')
             }
         }
         if (floater != null && answering == false)
         {
             floater.writetimeleft(h + "h" + tl   + "m");
         }
         if (ch)
         {
             
             gap = 1000;
           
             doneh2m = true;
         }
         else 
         {
              
             {
                 gap = 60000;if (Msg.app == 'exam' && activeidletime  < gap)
                 gap = activeidletime ;
                
             }
         }
     }
     else if (tl > 60)
     {
         gap = 2000;
         var m = Math.floor(tl/60);
         var ch =( tl - 60 < 60 && donem2s == false);
         tl = tl%60;
         var mstr = '' + m;
         if (m<10) mstr = '0' + m;
         var lstr = '' + tl;
         if (tl < 10) lstr = '0' + tl;
         if (floater != null &&  answering == false)
         {
             floater.writetimeleft( mstr + "'" + lstr+ "\"");

         }
         if (ch)
         {
             donem2s = true;
             
             anyextend();
         }
         else  
         {
             gap = 2000;
             
         }

     }
     else
     {

         var lstr = '' + tl;
         if (tl < 10) lstr= '0' + tl;
         if (floater != null  &&  answering == false)
         {
             floater.writetimeleft( "00'" +  lstr + "\"");
         }
         if ( tl <= 1  )
         {
             if (!isembedquiz )
             {
                 dofinalact();
             }
             
             return;
         } 

         if (tl > 1 )
         {
             gap = 1000;
         } 

     }
 
     if (Msg.app == 'exam' &&  timenow + gap - last2server >  activeidletime ) 
     {
         expiretime = activeidletime + rightnow;
         last2server = timenow;
         functioncallstring = "setact(0)";
         open("alive.jsp?target=child", "w" + tstmp);
     } 
 }

function starttimer(L,k,txt)
{
    var xy = findPositionnoScrolling(txt);
    var btn = document.createElement('input');
    btn.id = 'race' + k;
    btn.type='button';
    btn.className = 'OrangeButton';
    var y = xy[1] - 30;
    
    btn.style.cssText = 'position:absolute;z-index:10;top:' + y + 'px;left:'+(85+xy[0]) + 'px;height:27px;font-weight:700;width:68px;font-size:16px';
    btn.onclick= function()
    {
        var num = parseInt(this.id.substring(4));
        sendpartial(num);
    }
    btn.value =  textmsg[1277];
    document.body.appendChild(btn);
    if (floater!=null)
    {
        floater.div.style.height = '30px';
        floater.div.style.left = xy[0] + 'px';
        floater.div.style.top = (y) + 'px';
        floater.div.style.visibility = 'visible';
    }
    answering = true;
    quizQuestionAnswering = k;
    quizTimeLeft = L;
    timerhandle = setInterval(timeleft,1000);
     
}

var timerhandle = null;
var quizTimeLeft = 0;
var quizQuestionAnswering = -1;

function timeleft()
{
    if (quizTimeLeft == 0)
    {
        sendpartial(quizQuestionAnswering,1);
    }
    else
    {
        if (floater!=null)
            floater.writetimeleft(quizTimeLeft + "\"");
        quizTimeLeft--; 
    }
}
function initFloaters()
{
 floater = new Floater('floater1Div');
 Drag.init(floater.div);
 if (typeof(timesplitmode) == 'undefined' || !timesplitmode) 
 {
     tic();
 }
}

window.onblur  = function()
{
 ponb((new Date()).getTime());
 if (ef==1) pf = 0;
 
}
 
window.onfocus = function()
{
 if(ef==0) ponf();
 else pf = 0;
  
}
var onloadbeforefindrep = null;
if (typeof window.onload == 'function')
   onloadbeforefindrep = window.onload;
window.onload = function()
{
    initFloaters();
    if (onloadbeforefindrep!=null)
        onloadbeforefindrep();
};

function resizebox(l)
{
   var eles = f1.elements;
   for (var i=0; i < eles.length; i++)
   {
       var nm;
       if ((nm=eles[i].name)!=null && eles[i].tagName.toLowerCase() == 'input' && (eles[i].type.toLowerCase() == '' ))
       {  
           if (nm.replace(/q[0-9]+_0/,'') == '')
           {
           eles[i].style.width = l + 'px';
           }
       } 
       
   }
   handle = null;
   needresize = false;
   
}

 
 window.onresize = function()
 {
    needresize = true;
    var l = thispagewidth();
    if (l>100)
   {
    var dt = document.getElementById('floater1Div');   
    if (dt!=null)
    {   
        dt.style.position = 'absolute';
        dt.style.left = (l-100) + 'px';
        dt.style.position = 'fixed';
    }
    dt = document.getElementById('closebtn');
    if (dt!=null) 
    {
        dt.style.position = 'absolute';
        dt.style.left = (l-45) + 'px';
        dt.style.position = 'fixed';
    }
}
 };
var questiondone = null; 
 
var timesplithandle = null;
var nextquestion = function()
{
     clearTimeout( timesplithandle);
     runtimequota();
}
    
var processone = function()
{
    var tbl = document.getElementById('maintbl');
    var si = tbl.rows[0].cells[0].innerHTML;
    var sj = si.replace(/[^!]+!([^>]+)>.*/, '$1').replace(/[^0-9]+/, '');
    var j = parseInt(sj); 
    var ele; var k = 0;
    while (true)
    {
       ele = formselementbyname(document.form1,'q' +j + '_' + k);
       if (ele==null) 
           break;
       k++;
    }
    var NN = k;
    if (NN>0)
    {
           k--;
           while (k>=0 )
           {
            ele = formselementbyname(document.form1,'q' +j + '_' + k);
            doonblurb(ele, j, NN);
            fmts[j] = guessFormat(ele.value);
            checkHTML(ele.value);
            k--;
           }
           if (answers[j] == null) answers[j] = '';
      }
      else 
      {   
          ele = formselementbyname(document.form1,'q' +j);
          if (ele!=null && ele.tagName.toLowerCase() == 'textarea')
          { 
                fmts[j] = guessFormat(ele.value);
                checkHTML(ele.value);
                doonblur(ele, j);
                if (answers[j] == null) answers[j] = '';
          }
          else if (ele!=null)
          {
              if (answers[j] == null)
                  answers[j] = 'a';
              fmts[j] = '4';
          }
    }
    if (spents[j] == null)
    {
         if (detailass.timequota[j]!=null)
             spents[j] = 60*detailass.timequota[j];
         else
             spents[j] = 10;
    }
    var xy = findPositionnoScrolling(tbl.rows[0].cells[0]);
    questiondone = document.createElement('div');
    questiondone.style.cssText = 'position:absolute;left:' + xy[0] + 'px;top:' + xy[1] +'px';
    tbl.rows[0].cells[0].getElementsByTagName('table')[0].width = null;
    questiondone.appendChild(tbl.rows[0].cells[0].getElementsByTagName('table')[0]);
    document.body.appendChild( questiondone);
    moveaway();
}
var moveaway = function()
{
   // var x = parseInt(questiondone.style.left.replace(/px/,''));
    var y = parseInt(questiondone.style.top.replace(/px/,''));
    var h = thispageheight();
    var h1 = questiondone.offsetHeight;
    var t = Math.round(5 + 500/y*5);
    
    y += Math.round(5 + y/500);
    if (y + h1 > h)
    { 
        h1 = h-y; 
        if (h1 > 5)
        {
            questiondone.style.height = h1 + 'px';
            questiondone.style.top = y + 'px'; 
            setTimeout(  moveaway,t);
        }
        else if(questiondone.parentNode!=null)
            questiondone.parentNode.removeChild(questiondone);
    }
    else
    {
        questiondone.style.top = y + 'px'; 
        setTimeout( moveaway ,t);
    }
}
function skipone(n)
{
    if (hasactivities && (answers[n]=='' || answers[n] == null))
    {
        if (activities.indexOf('cl'+n +',') <0 && activities.indexOf('tx'+n + ',') <0)
            logactivity('sk' +n);
    }
}
var runtimequota = function()
{
    timesplitmode = true;
    var qid = document.getElementById('fortimequota');
    if (qid!=null) qid.innerHTML = textmsg[1698];
    var tbl = document.getElementById('maintbl');
   // document.form1.submit1.style.visibility = 'hidden';
    //document.form1.submit2.style.visibility = 'hidden';
    
    if (detailass.navi >= detailass.quesnums.length)
    {
        processone();
        dofinalact();
        return;
    }
    var yy = document.getElementById('tooltbl');
    
    yy.rows[0].height = '40px';
    yy.rows[0].deleteCell(0);
    var tt = yy.rows[0].insertCell(0);
    yy.style.cssText = "";
    tt.width="90px";
    tt.innerHTML = "<input onclick=\"skipone(" + (detailass.navi+1) + ");nextquestion()\" type=button class=RedButton style=\"padding-left:0px;padding-right:0px;padding-top:3px;padding-bottom:3px;overflow:visible;width:90px\" value=\"" +  textmsg[1696] + "\" >";
    if (detailass.navi>0)
    {
     
        processone(); 
        tbl.deleteRow(0);
        var r = tbl.insertRow(2);
        var c = r.insertCell(-1);
        c.appendChild(document.getElementById('tooltbl'));
        tbl.deleteRow(0);
        tbl.rows[0].cells[0].style.visibility = 'visible';
    }
    else
    {
        tbl.rows[0].cells[0].style.visibility = 'visible';
        var r = tbl.insertRow(1);
        var c = r.insertCell(-1);
        c.appendChild(document.getElementById('tooltbl'));
    }
    var ht = tbl.rows[0].cells[0].getElementsByTagName('table')[0].rows[0].cells[0].offsetHeight;
    tbl.rows[0].cells[0].getElementsByTagName('table')[0].rows[1].height = (350-ht) + 'px';
    for (var i=2; i < tbl.rows.length; i++)
    {
        tbl.rows[i].cells[0].style.visibility = 'hidden';
    }
    var si = tbl.rows[0].cells[0].innerHTML;
    var sj = si.replace(/[^!]+!([^>]+)>.*/, '$1').replace(/[^0-9]+/, '');
    var j = parseInt(sj);

    var  ele = formselementbyname(document.form1,'q' +j);
    if (ele != null && ele.tagName.toLowerCase() == 'textarea')
    {
        ele.style.height = (350 - tbl.rows[0].cells[0].getElementsByTagName('table')[0].rows[0].cells[0].offsetHeight) + 'px';
    }
     
    var delay = 0;
    
    if (detailass.timequota[j]!=null) 
    {
        delay = detailass.timequota[j]*60000;
    }
    if (detailass.stage == 'prev')
    {
        delay = 3000;
    }
    if (typeof(answers)!='undefined' && typeof(answers[detailass.navi+1])!='undefined' && answers[detailass.navi+1] !==null && answers[detailass.navi+1] !== '' )   delay = 3000;
     
    detailass.navi++;
    thistimer( delay + (new Date()).getTime());
}
var  thistimer = function(timedue)
{
     var tl=Math.floor( (timedue - (new Date()).getTime() )/1000);
     
     var gap = 0;
     if (tl > 3600)
     {
         gap = 60000;
         var h = Math.floor(tl/3600);
         tl = Math.floor((tl%3600)/60);
         if (floater != null && answering == false)floater.writetimeleft(h + "h" + tl   + "m");
     }
     else if (tl > 60)
     {
         gap = 2000;
         var m = Math.floor(tl/60);
         tl = tl%60;
         if (m<10) m = '0' + m;
         if (tl < 10) tl = '0' + tl;
         if (floater != null &&  answering == false)floater.writetimeleft( m + "'" + tl+ "''");
         
     }
     else
     {
         gap = 1000;
         if (tl < 10) 
         {
             tl = '0' + tl;
         }
         if (floater != null)floater.writetimeleft( "00'" +  tl + "\"");
        
     }
     
     if (gap == 1000 && tl<1)
     {
          if (hasactivities)
          {
              let n = detailass.navi;
              if (answers[n] == null || answers[n] == '' )
              {
                   if (activities.indexOf('cl'+n +',') <0 && activities.indexOf('tx'+n + ',') <0)
                       logactivity('sk' +n);
              }
              else
              {
                   if (activities.indexOf('cl'+n +',') <0 && activities.indexOf('tx'+n + ',') <0)
                       logactivity('tx' +n);
              
              }
          }
          runtimequota();
     }
     else 
     {
          timesplithandle = setTimeout("thistimer(" + timedue + ")", gap);
     }
}
    
   
window.onactivate = function(){timenow = (new Date()).getTime();}




 
 


 
