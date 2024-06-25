var f3 = document.form3;
var nav1 = null;
var clickbuts = new Array(assignarr.length);
var oldorderi = 0;
var winddowhandles = new Array(assignarr.length);
var haswindow  = new Array(assignarr.length);
var timerhandle = new Array(assignarr.length);

var allspans =  null;

function fresh(m,i)
{
    if (allspans[m] == null) return;
 allspans[m].className="fresh" + (i%2);
 if (i < 10)
 {
 i++;
 setTimeout("fresh("+m +"," + i +")", 200);
 }
}
var numtries = [];
function wrongcode(attendance)
{
     if (numtries[savedorderi] >= 3)
     {
         
         parent.frames[0].open("login.jsp?follow=logout");
         delCookie(orgnum%65536 + 'user');
         parent.close();
         return;
     }
     let tt = '';
     if (attendance)
     {
         tt =  textmsg[1927].split(/@/)[1];
        
         oldstr = oldstr.replace(/display:[^ ]+/,'display:none ');
     }
     else
     {
         tt = textmsg[818] + ' ' + textmsg[1929].split(/@/)[4];
         oldstr = oldstr.replace(/display:[^ ]+/,'display:inline ');
     }
    
     myprompt(oldstr,null,null,tt); let N = 0;
     let span = null;
     allspans = [];
     for (let j=0; j<3; j++)
     {
         let xx = document.getElementById("ispan" + j);
         let p = null;
         if (xx!=null) {p = xx.parentNode.parentNode; }
         if (xx!=null && p!=null && p.style.display != 'none' && p.style.display != 'NONE')
         {   span = xx;  allspans[j] = xx;}
         else break;
     }
      
     
     if (attendance)
     {
         span.innerHTML = textmsg[1929].split(/@/)[2] + '(' + (numtries[savedorderi]+1) +' &#x2264; 3)';
     }
     else 
     {
         span.innerHTML = msg931 + '(' + (numtries[savedorderi]+1) +' &#x2264; 3)';
         document.form1.code.value = wrongdcode;
     }
     document.form1.acknow.checked = true;
     fresh(allspans.length-1,0);
}
var wrongdcode = '';
function checkoptions(way, orderi,code,extension)
{
     var f1 =  document.form1;
     allspans = document.getElementsByTagName("span");
    f3.extension.value = extension;
     var N = f1.elements.length - 2;
     if (f1.elements[N+1].name == 'securitytoken')N--;
     var T =  (f1.elements[N-1].name=='code')?1:0;
     for(var j=0; j < N-T; j++)
     {
         if (f1.elements[j].checked==false)
         {
             fresh(j,0);
             return;
         }
     }
     if ( T == 1 )
     {
         if (code!='' && code !='attendance' && f1.elements[N-1].value=='')
         {
             fresh(allspans.length-1,0);
             return;
         }
         var entered = f1.elements[N-1].value.replace(/^[ |\t|\n|\r]+/,'').replace(/[ |\t|\n|\r]+$/,'');
          
         if (code!='' && code!='attendance' && code!='distinct' && sha1pass(entered) != code )
         {
             myprompt(textmsg[818]);
             return;
         }
         wrongdcode = entered;  
         f3.code.value = entered;
     }
     openforsure(way, orderi, extension);

}

var savedorderi, savedway;
function openforsure(way, orderi,extension)
{
 savedorderi = orderi;
 if (numtries[orderi] == null) numtries[orderi] = 1;
 else numtries[orderi]++;
 var popstr = 'toolbar=0,location=0,directories=0,status=0,menubar=0,alwaysRaised=1,scrollbars=1,resizable=1,width=' + screen.width + ',height=' + screen.height + ',top=0,left=0';
 f3.assignname.value= assignarr[orderi];
 
 f3.option.value = way;
 formnewaction(f3, "assigndoc.jsp");
 f3.extension.value = extension;
 try{ parseFloat(f3.extension.value ) } catch(e2){f3.extension.value = '0';}
 var size = (hasattach? 50:75);
 var ways = "";
 var ways2 = '';
 if (way=='take')
 {
 ways = escape(  "r*,1");
 ways2 = escape("c" + size + "%,*");
 }
 else if (screen.width>1100)
 {
 ways = escape("c550,*");
 ways2 = escape("r" + size + "%,*");
 }
 else
 {
 ways = escape("r40%,*");
 ways2 = escape("c" + size + "%,*");
 }

 closeprompt();
 haswindow[orderi] = true;
 winddowhandles[orderi] = window.open("stuasfrm.jsp?ways=" + ways + "&ways2=" + ways2 +"&orderi=" + orderi, "_blank", popstr);
}
var oldstr; 
function getcode(but, ob, code, norepeat,way,orderi,extension)
{
 var str = "<br><form rel=opener name=form1  ><table align=center>";
 let n = 0;
 if ( norepeat == true)
 {
 str += ("<tr><td>&bull; " + msg5 + ":&nbsp;&nbsp;&nbsp;&nbsp;<span id=ispan" + (n++) + " >" + msg1256 + "</span> <input type=checkbox style=background-color:transparent name=acknow onclick=focusonn(this) ></td></tr>");
 }
 if ( ob == false)
 {
 str += ("<tr><td>&bull; " + msg3 + ":&nbsp;&nbsp;&nbsp;&nbsp;<span id=ispan" + (n++) + " >" + msg1256 + "</span> <input type=checkbox style=background-color:transparent name=acknow  onclick=focusonn(this)></td></tr>");
 }
 if ( ob == false)
 {
 str += ("<tr><td>&bull; " + textmsg[1939] + ":&nbsp;&nbsp;&nbsp;&nbsp;<span id=ispan" + (n++) + " >" + msg1256 + "</span> <input type=checkbox style=background-color:transparent name=acknow  onclick=focusonn(this)></td></tr>");
 }
 if ( code ==  'attendance')
 {
 str += ("<tr><td>&bull; " + textmsg[1927].split(/@/)[1] + ":&nbsp;&nbsp;&nbsp;&nbsp;<span id=ispan" + (n++) + " >" + msg1256 + "</span> <input type=checkbox style=background-color:transparent name=acknow  onclick=focusonn(this)></td></tr>");
 }
// if (code!='')
 {
 str += ("<tr style=display:"+((code==''|| code=='attendance')?'none':'inline')+" ><td> &bull; <span id=ispan" + (n++) + "  >" + msg998 + "</span><input name=code onkeypress=\"return go(event,'" + way + "'," + orderi +",'" + code + "'," + extension + ")\"></td></tr>");
 }
 str += ("<tr><td>&nbsp;</td></tr><tr><td align=center><input class=OrangeButton style=width:80px type=button name=submit value=\"" + msg6 + "\"  onclick=checkoptions('" + way +"'," + orderi +",'" + code + "'," + extension + ")>");
 str += ("<input  class=GreenButton  type=button name=cancel  style=width:80px value=\"" + textmsg[18] + "\" onclick=\"closeprompt()\">");
 str += ("</td></tr></table></form>");
 oldstr = str;
 myprompt(str,null,null,textmsg[1633]);
setRoundedWidth(promptwin, 400);
 resizebut(document.form1);
 var xy = findPositionnoScrolling(but);
 var z = xy[1] - promptwin.offsetHeight/2;
 if (z < 90) z = 90;
 promptwin.style.top = z + "px";
}
function focusonn(t)
{
    var f = t.form.elements;
    for (var i=0; i < f.length; i++)
    {
        if (f[i] == t)
        {
            f[i+1].focus();
            break;
        }
    }
}
function go(evt,way,orderi,code,extension)
{
 var e = evt? evt : window.event;
 if(!e) return true;
 var key = 0;
 if (e.keyCode) { key = e.keyCode; } // for moz/fb, if keyCode==0 use 'which'
 else if (typeof(e.which)!= 'undefined') { key = e.which; }
 if (key == 13)
 {
 checkoptions(way,orderi,code,extension);
 }
 return true;
}
function trymore(orderi)
{
 var nav1 = window.open('','uprig' + orderi);
 nav1.document.write("<html><body>" + textmsg[86]);
visual(f3);
 f3.submit();
}
 
function nullwin(w)
{
 
 haswindow[parseInt(w.name.replace(/[a-z]/g,''))] = false;
 winddowhandles[parseInt(w.name.replace(/[a-z]/g,''))] = null;
}
var hasattach = false;
var saveorderi = null;
function openit(but, type,  code, ob, norepeat,orderi,hasatt,extension)
{
  
 f3.extension.value = extension; 
 hasattach = hasatt;
 if (haswindow[orderi]!=null && haswindow[orderi])
 {
 var xy = findPositionnoScrolling(but);
 myprompt(textmsg[1625] + '"' + assignarr[orderi] + '".' + textmsg[1626],
 null, "if(!v){try{winddowhandles[" + orderi +"].close();}catch(e){};nullme(" + orderi +");}", "");
 promptwin.style.top = (xy[1] - 50) + 'px';
 winddowhandles[orderi].focus();
 return;
 } 
 oldorderi=orderi;
 saveorderi = orderi;
 clickbuts[orderi] = but;
 if ( (ob==false || code!='' || norepeat ) )
 {
 getcode(but, ob, code, norepeat, ((type==3 || type==1)?'take':'destest'),orderi,extension);
 return;
 }
 openforsure(((type%2==1)?'take':'destest'), orderi,extension );
}

function canceldoagain(wind)
{

 for (var i=0; i < winddowhandles.length; i++)
 if (wind == winddowhandles[i]) break;

}
 
function nullme(orderi)
{
 haswindow[orderi] = false;
 winddowhandles[orderi] = null;
}

function openLower(wname,due)
{
  
 if (f3.extension.value == null || f3.extension.value == '') f3.extension.value = '0';
 try{parseFloat(f3.extension.value);}catch(e1){f3.extension.value = '0';}
  
 if ( (parseInt(f3.extension.value) + due) * 1000 < (new Date()).getTime())
 {
     myprompt("Expired item: Due + extension < now");
     return;
 }
 closeprompt();
 f3.rdap.value="studentsubmission";
 formnewaction(f3, "DataForm");
 
 //formnewaction(f3, "Echo");
 f3.target = "lowerwin" + wname.replace(/[a-z]+/,'');
visual(f3);
 f3.submit();
}
function openSubmitted(but,orderi)
{
 clickbuts[orderi] = but;
 formnewaction(f3,   "DataForm");
 f3.rdap.value= procedure;
 f3.assignname.value= assignarr[orderi];//but.parentNode.parentNode.childNodes[0].innerHTML;
 f3.target = window.name;
visual(f3);
 f3.submit();
}

function changebutton(wind,graded)
{
  
 var  i = 0;
 for (;  i <  assignarr.length ; i++) 
     if( winddowhandles[i]==wind) break;
     
 
 if (i==assignarr.length) 
     i = 0;
  
 var oldbut = clickbuts[i];
 if (oldbut==null) return;
 oldbut.className ="GreenButton";
 
 if (graded)
 oldbut.value = msg627;
 else
 oldbut.value = msg627;

 oldbut.onclick =  function()
 {
  var j=0; for(; j < assignarr.length; j++) 
    if (clickbuts[j]==this) openSubmitted(this,j);
 }
 winddowhandles[i] = null; 
}

function syn(n)
{
    if (toinstructor)
    {
        if (''+n == '1')
          myprompt(msg71);
        else
          myprompt(msg72);
       toinstructor = false;
       return;
    }
    toinstructor = false;
    if (''+n == '1')
    {
        if (saveorderi>=0)
        {
            clickbuts[saveorderi].value = msg627;
            clickbuts[saveorderi].onclick = function(){openSubmitted(this,saveorderi);}
        }
    }
    else if (n == 'del')
    {
        myprompt(textmsg[1306]);
    }
}
 
function preproc(n)
{
    if (n == null || n.tagName == null) return;
    
    if (n.tagName.toLowerCase()=='td') 
    {
      
       var atts = n.attributes;
       var x = 0;
     
       for(; x<atts.length&&atts[x].nodeName!='latexml'; x++);
       if (x < atts.length) 
       {
           n.innerHTML = checkh(n.innerHTML.replace(/&amp;/g, '&'), true);
           return;
       }
    }
    if (n.childNodes != null  )
    for (x = 0; x < n.childNodes.length; x++)
    {
        preproc(n.childNodes[x]);
    }
}

function retrvsaved(t, i)
{
  var tbl = document.getElementsByTagName("table")[0];
  var xy = findPositionnoScrolling(tbl.rows[i].cells[0]);
  let s=localStorage[t]; 
 if (s==null) 
     s = '';
 else
 {
   var x = new CSVParse(s.replace(/,[0-9]+,[0-9]+,[0-9]+,[\-|0-9]/g,''), "'", ",", "\n\r");
   var tt = x.nextInt();
   s = x.tohtml();
 }
 if (s=='')
 {    
     myprompt(textmsg[1638],null,null,textmsg[1861]);
     promptwin.style.left =  (thispagewidth()-promptwin.offsetWidth)/2 + 'px';
     promptwin.style.top = (window.scrollY+100) +'px';
 }
 else
 {    myprompt(textmsg[1637] + ':' + s + '<br>'  
         + ("<center><a href=\"javascript:msgto('"
         + t.replace(/'/g,'') + "')\">" 
         + textmsg[447] 
         + " " + textmsg[35]+ "</a></center>"),null,null,textmsg[1861]);
 //setRoundedWidth(promptwin,  thispagewidth()- 34)  ;
     promptwin.style.left =   '0px';
     promptwin.style.top = (window.scrollY+10) +'px';
 }
}
let toinstructor = false;
function msgto(t)
{
    let s=localStorage[t]; 
    let wcds = "i'" + subdb + "','" + ~~((new Date()).getTime()/1000) 
    + "','" + t.replace(/[0-9]+\-[0-9]+\-/,'').replace(/\-[^\-]+$/,':'+ msg631) +  "','"
    + s.replace(/'/g, "''").replace(/^[0-9]{7}[0-9]+,/, "") + "','0','" + subdb +"',''";
    toinstructor = true;
    postopen("SaveBack","rdap,rsacode,subdb,id,wcds".split(/,/),
            ["messageTo","0",subdb,sid,wcds],"w" + tstmp);
     
}

function setready()
{
 if (autogradedbut!=null)
 openSubmitted(autogradedbut,autogradeedi);
 else
 {
 autogradeddone = true;
 but.disabled = false;
 }

}
function openSubmitted2(but,orderi)
{

 if ( autogradeddone)
 {
 openSubmitted(but,orderi);
 }
 else
 {
 autogradedbut = but;
 autogradeedi = orderi;
 window.open('gradeQuiz.jsp?subdb='+subdb, "w" + tstmp );
 myprompt(textmsg[86]);
 setTimeout("closeprompt()", 1000);
 but.disabled = true;
 }
}
let activebut;
let activeorderi;
let activesessions;
let timeformathms = timeformat + " hh:mm";
function extenddue(but,orderi,sessions)
{
     activebut = but;
     activeorderi = orderi;
     activesessions =  sessions;
     window.open('follows.jsp?x=latepermit&course=' + course + '&sid='+ sid,'w' + tstmp);
}

function setlateinfo(str, n, t)
{
    if (n == null) {n = 0; t= 0;}
    let newdue = Math.round((new Date()).getTime()/1000) + 48*3600;
    let newduestr = timestr1(newdue, timeformathms);
    if (str == '')
       myprompt(textmsg[1921], newduestr, "goextenddue(v," + activeorderi + ",'" + activesessions + "')");
    else
    {
        let xs = textmsg[1923].split(/@/);
        let p = new CSVParse(  textmsg[646] + ":" + textmsg[1576] + str + ";" + n + ":" + t, '"', ':', ';');
        myprompt(p.tohtml().replace(/<tr/, '<tr bgcolor=' + BBGCOLOR + ' ').replace(/<table/, '<table align=center') + "<div style=font-size:12px;float:center>*" + xs[2] + "</div><br>" +  textmsg[1921], newduestr, "goextenddue(v," + activeorderi + ",'" + activesessions + "')", textmsg[1574] +": " + assignarr[activeorderi]);
    }
}
function goextenddue(v,orderi,sessions)
{
    let timelong = parseTime(v,timeformathms);
    if (timelong == invalidtimevalue)
    {
        let newdue = Math.round((new Date()).getTime()/1000) + 48*3600;
        let newduestr = timestr1(newdue, timeformathms);
        myprompt(textmsg[75], newduestr, "goextenddue(v," + orderi + ",'" + sessions + "')");
    }
    else
        postopen("follows.jsp","subdb,semester,course,sessions,assignname,sid,newdue,x".split(/,/),
                               [subdb,semester,course,sessions,assignarr[orderi],sid,timelong,'extenddue'],"w" + tstmp);
}
function doneextend(f)
{
    activebut.className = 'GreenButton';
    activebut.value = textmsg[61];
    activebut.onclick = function()
    {
         let orderi = this.id.substring(3);
         eval(changeclick[orderi] + f + ")");
    }
}
var tempcache = [];
function setcache(x,y)
{
   tempcache[x] = y; 
}
function getcache(x)
{
   return tempcache[x]; 
}
onunload = function()
{
    if (tempcache!=null)
    for (var k in tempcache) 
    {
        if (tempcache.hasOwnProperty(k)) 
        {
           localStorage[k] = tempcache[k];
        }
    }
}

var fm = document.proc;
function copyformfrom(f)
{
    fm.tid.value = f.tid.value;
    fm.sid.value = f.sid.value;
     fm.sname.value = f.sname.value;
    fm.rid.value = f.rid.value;
     fm.code.value = f.code.value;
    fm.sek.value = f.sek.value;
 
}
function closeproc()
{
   // if (fm.rid.value != '')
    {
        fm.code.value = 'unsubs';
        fm.msg.value = '';
       visual(fm);
       fm.submit();
    }
}

 
function getsid(){return sid;}

function undocumented(q)
{
    var s = textmsg[1818];// + "<br><br><center><input type=date onchange=getd(this)></center>";
    if (q!=null)
    {
        if (typeof(s) == 'number')
            s = textmsg[75] + " " + timeformat;
        else
            s  = q + textmsg[1818];
    }
    myprompt(s,timestrnow,"addnew(v)");
}
function getd(t)
{
    var d = Date.parse(t.value);
    closeprompt();
    addnew(timestr(Math.round(d.getTime()/1000)));
}
function pad2(i)
{
    if (i < 10) return '0' + i;
    return '' + i;
}
function addnew(v)
{
   var t = parseTime(v);
   if (t == invalidtimevalue) 
   {
       undocumented(1);
       return;
   }
   var d = new Date(t*1000);
   var y = d.getDay();
   var d1 = new Date( 1000*(t - 3600*24*y));
   var d2 = new Date( 1000*(t + 3600*24*(7-y)));
   var s = pad2(d1.getMonth()+1)  + pad2(d1.getDate()) + "-" +  pad2(d2.getMonth()+1) +   pad2(d2.getDate());
   var k=-1;
   if (assignarr!=null && assignarr.length>0)
   for (k=0; k < assignarr.length; k++)
   {
       if (assignarr[k].indexOf(s)>0)
       {
           var y = document.getElementById('but' + k);
           if (y!=null && (''+y.onclik).indexOf('openit')>=0) 
               y.click();
           else 
               myprompt(msg1574 +  s + " " + textmsg[3] ); 
           break;
       }
   }
   if (assignarr==null || assignarr.length==0 || k == assignarr.length) 
       postopen("studentassign.jsp",
           ["coursetitle","sid","semester", "accessible","course","sessionname","subdb", "assignname","ff"],
           [coursetitle,sid,semester,accessible,course,sessionname,subdb,s,myfontname], 
           "_self");
}

function openundoc()
{
    parent.frames[0].openit1('studentassign.jsp');
}

var onloadbeforestudentassign = null;
if (typeof window.onload == 'function')
{   onloadbeforestudentassign = window.onload;
    
 }

window.onload = function()
{
    if (onloadbeforestudentassign != null)    onloadbeforestudentassign();
    Msg.init({stoken:securitytoken,
    app:"exam",
    tid:'',
    sid: userid,
    sname: userid,
    rid:'',
    code:'',
    msg:'',
    sek:""}); 
    if (typeof(openfirst)=='function')
        openfirst();
}