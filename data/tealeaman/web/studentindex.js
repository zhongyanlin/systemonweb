var morecel  =  document.getElementById("ins0");
function getBeheading(){return beheading;}
var f = document.form1;
var onsaved1 = "for(c=0;c<4;c++)if(ctype[c]=='h'){setv(0,c,'');mat[0][c]='';}valuechanged[0]=false;";
var accessibles = new Array();
var weekdays = textmsg[830].replace(/,/g,'');
var weekdays1 ="NMTWRFS" ;
function timesubmit()
{
    
        expiretime = activeidletime + (new Date()).getTime();
        visual(f);
        f.submit();
   
}
resumehalted = function()
{
    expiretime = activeidletime + (new Date()).getTime();
    f.submit();
}
function  refresh()
{
    SetCookie(sid + "acinfo",'');
    document.location.href="studentindex.jsp?id=" + sid;
}
function setname(nm){f.studentname.value=nm;}
function getname(){return f.studentname.value;}
function setaccessible()
{
    if (typeof (f.course)!='undefined' && f.course.selectedIndex>=0)
    f.accessible.value = "" + accessibles[f.course.options[f.course.selectedIndex].value];
    else f.accessible.value = "";
    
}
function setaccessible(course)
{
   accessibles[course] = true;
}
function needcid()
{
    var k = document.form1.course.selectedIndex;
    if (k < 0 ||  document.form1.course.options[k].value == "")
    {
       parent.frames[1].myprompt(msg288);
       f.course.focus();
       parent.frames[1].promptwin.style.width = '220px';
       var xy = findPositionnoScrolling(f.course);
       parent.frames[1].promptwin.style.top = (xy[1] - parent.frames[1].promptwin.offsetHeight) + 'px';
       return false;
    }
    return true;
}
function changeiid()
{
 closeprompt();
 if (typeof(morecel)!='undefined' && morecel!=null)
 {
     morecel.innerHTML =  "<a href=\"javascript:openit1('insservice.jsp')\">" + textmsg[436] + "</a>";
 }
 resetassociate();
 if ( typeof(chatinfo) != 'undefined'  
         && f.course.selectedIndex >-1 
         && chatinfo[f.course.selectedIndex]!=null)
 {
  var xx = document.getElementById('chatinfo');
  if (xx!=null)  xx.innerHTML = chatinfo[f.course.selectedIndex];
 }
 if (savedurl!='') {eval(savedurl);savedurl='';}

}

function getPassed(str)
{
    if (str==coursesession){return;}
    f.onsave.value="";
    f.subdb.value = "";
    f.onsaved.value="";
    makeformhiddenele(f, 'coursesession', str);
    makeformhiddenele(f, 'coursesession0', coursesession);
    formnewaction(f,'studentreg.jsp');
    f.target = parent.frames[1].name;
    visual(f);
    timesubmit();  
}
 
var replywin = null;
function setcrosssite(s)
{
    crosssite=s;
} 
 
function distinct(str)
{
     var ids=str.split(";");
     if (str=='') return ''; 
     str=ids[0];
     for(var i=1; i < ids.length; i++) 
        if ((";" +str+";").indexOf(";"+ids[i]+";")<0)
           str+=";" + ids[i]; 
     return str;
}

function tosecond(d)
{
   var tt = d.replace(/ /g,'').split(/[^0-9]/);
   if (tt.length<2) return 0;
   return (parseInt(tt[0].replace(/^0/,''))*60 +
           parseInt(tt[1].replace(/^0/,''))      )*60000;
}

var ranges = new Array();
 

 function pad2(x)
 {
     if (x < 10) return '0' + x;
     return ''+x;
 }
 function makenm(l)
 {
     var d = new Date(l*1000);
     var j = weekdays[d.getDay()];
     return [j, pad2(d.getMonth() + 1) + pad2(d.getDate())];
 }

 

function showalarm(t,r)
{
    parent.frames[1].myprompt("Class starts soon.<br> <a href=javascript:parent.frames[0].embedquiz(1)>"
        + "Start class Quiz"
        + "</a><br><a href=javascript:parent.frames[0].embedquiz(2)>"
        + "Start class notes & quiz" + "</a>");
}
if (typeof(document.form1)!='undefined' && typeof(document.form1.course)!='undefined') 
document.form1.course.onchange = changeiid;

var haschatsession = false; 
function closeallchat()
{
   haschatsession = false; 
}
function alltopics()
{
    var ss = '';
    for (var j=0; j < f.course.options.length; j++)
    {
               if (f.course.options[j].value == '' || f.course.options[j].text == '') continue;
               var x = f.course.options[j].text;
               var k = x.lastIndexOf(" ");
               if (ss != '') ss += '||';
               var y = f.course.options[j].value + "-" + x.substring(k+1) + ":" + x.substring(0,k);
               ss += y; 
               f.course.options[j].className = 'selectoption';
    }
    
    return encodeURIComponent(ss);
}

function openit(url,subwin)
{
    if (subwin == null)
    {
       // if (typeof(parent.frames) == 'undefined' || parent.frames.length < 2 || parent.frames[1] == null)
        {
            subwin = 'rightwinmoniter';
        }
      //  else
          //  subwin = parent.frames[1].name;
    }
    if (f!=null)
    {
    if(typeof(f.coursetitle)!='undefined') f.coursetitle.value = '';
    setaccessible();
    f.subdb.value = "";
    f.onsaved.value="";
    f.onsave.value="";
    f.target =  subwin;
    formnewaction(f, url);
    visual(f);
    timesubmit();
    }
}
var temp = "";
function openit1(url)
{
    resetassociate();
    setaccessible();
     if (f.ta.value.includes(uid)&& 
       (  url.indexOf('evalform')>=0 
       || url.indexOf('studentsubmission')>=0
       || url.indexOf('checkgrades')>=0))
    {
        parent.frames[1].myprompt("For enrolled students only");
        return;
    }
    
    if (url.indexOf('evalform')>=0)
    {
        f.onsave.value="42";
        f.onsaved.value= "43";
    }
    else
        f.onsave.value="";
    f.target = parent.frames[1].name;
    
    if (url.indexOf('evalform') > 0 || url.indexOf('Syllabus')>=0)
    {
       temp = f.subdb.value;
       f.subdb.value = '';
    } 
     
    if (needcid())
    {
       formnewaction(f, url);
       visual(f);
       timesubmit();
    }
    else
    {
       savedurl="openit1(\"" + url +"\")";
    }
}
 
function openit2()
{
    resetassociate();
    setaccessible();
    f.onsave.value="";
    f.onsaved.value= "";
    f.target = parent.frames[1].name;
    
    if (needcid())
    {
        if (f.course.selectedIndex >= 0)
        {
           savedurl= "";
           formnewaction(f,  "download.jsp?folder=" + encodeURIComponent(f.iid.value +"/" + f.course.options[f.course.selectedIndex].value + "/lecture" ));
          visual(f);
 timesubmit();
        }
    }
    else
        savedurl= "openit2()";
}



function openit3(url,ts,db)
{
    setaccessible();
    f.subdb.value=db;
    f.onsave.value="";
    f.onsaved.value="";
    f.target = parent.frames[1].name;
    f.rdap.value = ts;
    
    if (db!='' && needcid()==false)
    {
       savedurl = "openit3(\"" + url + "\",\"" + ts +"\",\"" + db +"\")";
       return;
    }
    if (url.indexOf("?") > 0)
        url = url + "&exbut=cp";
    else
        url = url + "?exbut=cp";
    
    formnewaction(f,  url  );
   visual(f);
 timesubmit();
    
}
function openit4(url)
{
    setaccessible();
    f.subdb.value = "";
    f.onsave.value="";
    f.onsaved.value="";
    formnewaction(f, url);
    f.target="_blank";
   visual(f);
 timesubmit();
}

function openit5()
{
    setaccessible();
    f.subdb.value = "";
    f.onsaved.value="";
    f.onsave.value="";
    f.target = parent.frames[1].name;
    
    
    formnewaction(f,'DataTable?rdap=mycontacts&extraline=0&exbut=cph&advisor=' + advisorid()); 
   visual(f);
 timesubmit();  
}
 
  
function openit6(d)
{
    if (d==null)
        dodept(document.form1.department.value,0);
    else
    {  
        dodept(d,1);
        //parent.frames[1].writehint();
    }
}

function dodept(dept,l)
{     
    f.subdb.value = "";
    setaccessible();
    f.onsaved.value="";
    f.onsave.value="";
    f.target=parent.frames[1].name;
    if (dept == '') dept = '11';
    else dept = dept.replace(/,.*/,'');
    makeformhiddenele(f, "rdap","registered");
    makeformhiddenele(f, "extraline","5");
    makeformhiddenele(f, "existing",coursesession);
    makeformhiddenele(f, "cellonblur","112");
    makeformhiddenele(f, "onbegin",l==0?"113":"118");
    makeformhiddenele(f, "dept", dept);
    formnewaction(f,'DataPicker?exbut=c'); 
    visual(f);
    timesubmit(); 
    makeformhiddenele(f, "existing","");
    makeformhiddenele(f, "cellonblur","");
    makeformhiddenele(f, "onbegin","");
    makeformhiddenele(f, "dept", ""); 
}
function getstudentdriven(){return studentdriven;}
function openit7(way)
{
    
    resetassociate();
    setaccessible();
    f.target=parent.frames[1].name;
    f.ways.value = way;
    formnewaction(f,"studentquizfrm.jsp");
   visual(f);
 timesubmit();  
    
}
var orderinaday = 0;
function openit8(url, win)
{
    var tm = '';
    if (orderinaday>1) tm = '' + (orderinaday-1);
    var d = new Date();
    tm = pad2(d.getMonth()+1) + pad2(d.getDate()) + tm;
    var t = getquizlist(f.course.value + "-" + tm );
     
    if (orderinaday>1)
        url+= "?count=" + (orderinaday-1);
    if (t == false)
    {
       setquizlist(f.course.value + "-" + tm  );
       url += ( (orderinaday>1)? "&" : "?") + "numtester=1";
       
    }
     
    setaccessible();
    resetassociate();
    f.onsave.value="";
    f.onsaved.value="";
    formnewaction(f, url);
    f.target= win;
    if (needcid())
    {
      visual(f);
 timesubmit();
    }
    else
    {
       savedurl="openit8(\"" + url +"\",\"" + win +"\")";
    }
     
}

function openit9(url, win)
{
    setaccessible();
    resetassociate();
    f.onsave.value="";
    f.onsaved.value="6";
    f.onbegin.value = "46";
    f.rdap.value = "lecturenotes";
    if (url == null) 
        url =  "DataForm"; 
    formnewaction(f,  url);
    if (win==null) 
       win = parent.frames[1].name;
    f.target=  win;
    if (needcid())
    {
       visual(f);
       timesubmit();
    }
    else
    {
       savedurl="openit9(\"" + url +"\",\"" + win +"\")";
    }
}


function openit10()
{
    resetassociate();
    setaccessible();
    var adv =  '<!--' + advisorid() + '-->' + advisorname  +":" + msg1407;
    haschatsession = parent.frames.length>1 && typeof(parent.frames[1].studentstart) != 'undefined';
    if (haschatsession == false)
    {   
        haschatsession = true;
        f.onsave.value="";
        f.onsaved.value= "";
        f.target = parent.frames[1].name;
        f.iid.value = advisorid();
        f.inittopic.value = adv;
        formnewaction(f,  "talkpage.jsp");
       visual(f);
 timesubmit();
    }
    else
    {
        parent.frames[1].studentstart(adv,advisorid());
    }
}
 
function openit11()
{
    resetassociate();
    setaccessible();
    f.onsave.value="";
    f.onsaved.value= "";
    f.target = parent.frames[1].name;
    if (needcid())
    {
        if (f.course.selectedIndex >= 0)
        {
           savedurl= "";
           var j =  f.course.selectedIndex;
           var x = f.course.options[j].text;
           var k = x.lastIndexOf(" ");
           var y = f.course.options[j].value + "-" + x.substring(k+1) + ":" + x.substring(0,k);
           if (y.length>33)
               y = y.substring(0,33);
           haschatsession = parent.frames.length>1 && typeof(parent.frames[1].studentstart) != 'undefined';
           if (haschatsession == false)
           {
               haschatsession = true;
               f.inittopic.value = y;
               formnewaction(f,  "talkpage.jsp");
              visual(f);
              timesubmit();
           }
           else
           {
               parent.frames[1].studentstart(y,f.iid.value);
           }
        }
    }
    else
        savedurl= "openit11()";
}

function openit12()
{
    resetassociate();
    setaccessible();
    f.target = parent.frames[1].name;
    var j = classtimenow();
     
    var goingon = 0;
    if (j < numcourses)
    {
        goingon = 1;
        if (f.course.options.length>1 && f.course.selectedIndex != j+1)
        {
            if (confirm(  coursesession.split(/,/)[j].replace(/\|[^\|]+$/,'') + " " + textmsg[1344]))
            {
                f.course.selectedIndex = j+1;
                resetassociate();
            }
            else if (!verif(f.course.selectedIndex-1)) 
            {
                alert ("Since you don't to select the going-on class, class quiz for going-on class is not available");
                goingon = 0;
            } 
        }
    }
    if (needcid())
    {
        if (f.course.selectedIndex >= 0)
        {
           savedurl= "";
           f.ways.value = 'furt';
           formnewaction(f,  "studentquizfrm.jsp?quiznow="  + goingon);
           visual(f);
           timesubmit();
        }
    }
    else
        savedurl= "openit12()"; 
} 

function openit19()
{
   savedurl= "";
   f.ways.value = 'furt';
   formnewaction(f,  "studentquizfrm.jsp?quiznow=1");
   visual(f);
   timesubmit();
}

function openit16()
{
     
    var nav = window.open("", parent.frames[1].name);
 
}

function zz()
{    
    if (parent.frames[1].frames.length > 1)
    {
      openit8('embedquiz.jsp',  parent.frames[1].frames[1].name);
      var ht = thispageheight()-270; 
      var x = parent.frames[1].frames[0].ele(0,2);
      var y = x.parentNode.parentNode.parentNode;
      if (y.tagName.toLowerCase()!='table')
          y = y.parentNode;
      y = y.parentNode;
      var z = y.parentNode;
      z.deleteCell(0);
      y.colSpan = "2";
      x.style.width = (x.offsetWidth + Math.floor(font_size*20/3)+4) + 'px';
      x.style.height =  ht + 'px'; 
  }
  else
  {
      var x = parent.frames[1].ele(0,2);
      var y = x.parentNode.parentNode.parentNode;
      if (y.tagName.toLowerCase()!='table')
          y = y.parentNode;
      y = y.parentNode;
      var z = y.parentNode;
      z.deleteCell(0);
      y.colSpan = "2";
      x.style.width = (x.offsetWidth + Math.floor(font_size*20/3)) + 'px';
      x.style.height =  ht + 'px'; 
  }
}
 

function intervals(atimeslots)
{
    var s = atimeslots.replace(/^[ ]+/,'').replace(/[ ]+$/,'').split(/[ ]*,[ ]*/);
    var vs = [];
    for (var j=0; j < s.length; j++)
    {
        var days = s[j].replace(/[0-9].*/,'').replace(/ /g,'');
        var times = s[j].replace(/^[^0-9]+/,'').split(/[^0-9]+/);
        var timesminutes = [];
        for (var l=0; l < times.length; l++)
        {
           timesminutes[l] = parseInt(times[l].replace(/^0/,''));
            
        }
        var start = timesminutes[0]; 
        if (''+start =='NaN') start = 0;
        else start *= 60;
        if (timesminutes.length>1) start += timesminutes[1];
        var end = 1000000; 
        if (timesminutes.length>2) 
        {
            if ('' + timesminutes[2] =='NaN') 
                end = start + 240;
            else
                end = timesminutes[2]*60;
        } 
        if (timesminutes.length>3)  
        {
            if ( timesminutes[3] != 'NaN') 
            end += timesminutes[3];
        }
        
        for (var i=0; i < days.length; i++)
        {
            var dd = dayminutes(days.charAt(i));
            vs[vs.length] = [dd+ start, dd + end];
        }
    }
    return vs;
}

function dayminutes(dayname)
{
    var weekdays = textmsg[830].replace(/,/g,'');
    var i = weekdays.indexOf(dayname);
    if (i >= 0) return i*24*60; 
    var  weekdays1 ="UMTWRFS" ;
    i = weekdays1.indexOf(dayname);
    if (i >= 0) return i*24*60; 
    return 0;
}
function getMinInWeek()
{
   var dt = new Date();
   var nowsec =  dt.getTime() + timenowsec;
   dt = new Date(nowsec);
   return dt.getDay()*24*60 + dt.getHours()*60 + dt.getMinutes();
}
function verif(j)
{
    var minutesInWeek = getMinInWeek();
    var vs = intervals(timeslots[j]);
    for (var k=0; k < vs.length; k++)
    {
        if (minutesInWeek >= vs[k][0]-10 && minutesInWeek <= vs[k][1]+10)
            return true;
    }
    return false;
}

function classtimenow()
{
   var minutesInWeek = getMinInWeek();
   var dt = new Date();
   var nowsec1 = Math.round( (dt.getTime() + timenowsec)/1000);
    
   f.start.value = nowsec1 ;
   f.quizdue.value = (nowsec1  + 7200);
   var jj = 0;
   var j = 0;
   for (j=0; j < numcourses; j++)
   {
       orderinaday = 0;
       if (timeslots[j] == null) continue;
       var vs = intervals(timeslots[j]);
       for (var k=0; k < vs.length; k++)
       {
           if (minutesInWeek >= vs[k][0]-10 && minutesInWeek <= vs[k][1]+10)
               return j;
       }
   }
   return j; 
}
 
function setAssignName(s)
{
     
    f.assignname.disabled = (s==null);
    if (s != null)
       f.assignname.value = s;
}
function setTimes(a,b)
{
    f.start.value = a;
    f.quizdue.value = b;
}
 
 
 var quizlist = ",";
 function setquizlist(s)
 {
     if (getquizlist(s) == false)
     quizlist += s + ",";
 }
 function getquizlist(s)
 {
     return quizlist.indexOf("," + s + ",")>=0;
 }
function succ(){}
var flashnote = document.getElementById('flashnote');
function flash(n)
{
    var m = 9 - n;
    flashnote.style.color = '#' + 0 + 0 + m + n + n + m;
    if (n>0) 
        setTimeout("flash(" + (n-1) + ")",700);
    else 
        flashnote.style.color = 'orange';
}
if (typeof(changeiid)!='undefined' &&  typeof(document.form1)!='undefined' && typeof(document.form1.course)!='undefined')
{
   changeiid();
   
}
else 
{
    if (flashnote!=null)  flash(9);
    openit6();
}
if (typeof(f.course)!='undefined') 
for (var j=0; j < f.course.options.length; j++)
{ 
    f.course.options[j].className = 'selectoption';
    f.course.options[j].cssText = 'width:200px;overflow:hidden';
}
function showqrcode(t)
{
    parent.frames[1].myprompt(url + "?anchor2chick=" + t); 
}
var text2na = new Array();
var na2codes = new Array();

function showqrcode(t)
{
    if (typeof(theurl) != 'undefined')
    {
    var j = text2na[t];
    var tt = theurl.replace(/.*studentindex.jsp[\?]?(.*)/,'studentpage.jsp?click=' + j + "&$1").replace(/&$/,'');
    //parent.frames[1].myprompt('<img src=image/qrcodesc' + j + ".gif >",null,null,tt);
    parent.frames[1].myprompt( "<center><div id=warning0></div><img src=\"Qrlink?url=" + Msg.hex(tt) + "\" name=\"qrcode"+j+"\" onload=warning(this)></center>",null,null,tt);
  
    }
    else
    {
        parent.frames[1].myprompt("<img src=\"image/qrcode.gif\" >",null,null);
    }
}
var NA = 0; 
function searchanchor(t)
{
    if (t == null || typeof(t.tagName)=='undefined') return;
    if (t.tagName.toLowerCase() =='a')
    {
        t.parentNode.parentNode.cells[0].onclick = function(){showqrcode(this.innerHTML.replace(/<[^>]+>/g,'') + this.parentNode.cells[1].getElementsByTagName('a')[0].innerHTML.replace(/<[^>]+>/g,''));}
        text2na[t.parentNode.parentNode.cells[0].innerHTML.replace(/<[^>]+>/g,'')+t.innerHTML.replace(/<[^>]+>/g,'')] = NA;
        na2codes[NA++] = t.href.replace(/^javascript:/,'');
        return;
    }
    if (t.childNodes == null) return;
    for (var j=0; j < t.childNodes.length; j++)
        searchanchor(t.childNodes[j]);
}
if (document.location.toString().indexOf('studentindex.jsp') >= 0)
{
var onloadbeforestudentindjs = null;
if (typeof window.onload == 'function')
   onloadbeforestudentindjs = window.onload;
window.onload = function()
{
    if (onloadbeforestudentindjs!=null) 
        onloadbeforestudentindjs(); 
    searchanchor(document.body);
     
    var j = parseInt(click);
    if (j > -1)
    {
        eval(na2codes[j]);
        if (ismobile())
           minimizeit();
        return;
    }
}    
}

function showalarm(t)
{
   var w = '';
   if ( navigator.appName=='Microsoft Internet Explorer')
   { 
        w = "<embed height=30 hidden=true loop=0 autostart=true src=\"image/sound.wma\">";
   }
   else if(navigator.appName=='Netscape')
   {
        if ("Audio" in window) 
        {
            var a = null;
            try
            {
                a = new Audio();
                if (!!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, '')))
                   a.src = "image/doorbell.mp3";
                a.autoplay = true;
             }catch(ee){}
        } 
   }
    parent.frames[1].myprompt(t+w);
}

function Alarm(sch,err)
{
    this.schedule = [];
    this.N = 0;
    this.currentj = 0;
    this.err = err;
    this.stop = false;
    this.maxtime = 1500000000000;
    this.sn = textmsg[830];
    this.esn = "UMTWRFS";
    this.handler = null;
    this.min=100000000000;
    this.event = "";
    this.endcourse = false;
    this.j = -1;
    if (sch!=null)
    {
        for (var i=0; i < sch.length; i++)
        {
            this.schedule[this.schedule.length] = sch[i];
        }
        this.N = sch.length;
    }
    
    this.closest = function(item)
    {
        var now = new Date((new Date()).getTime() + this.err+60000);
         
        var daynow = now.getDay();
        var nowminutes = now.getHours()*60 + now.getMinutes();
        var nowlong = now.getTime();
        var r = new RegExp("[0-9]+[ ]*:[ ]*[0-9]+");
        var k=0, j=0, n=0;
        var m;
        var ls = this.maxtime;
        if (item.length<4){item[2] = item[3]='';}
        var ds = parseInt(item[2]);
        var de = parseInt(item[3]);
        
        if (''+ ds == 'NaN') 
            ds = -1;
        else if (ds!=0)
        {    
            var x = new Date(ds*1000+this.err);
            x.setHours(0);
            x.setMinutes(0);
            x.setSeconds(0);
            ds = x.getTime();
        }    
        if (''+de == 'NaN') 
            de = this.maxtime+(new Date()).getTime();
        else
        {
            var x = new Date(de*1000+this.err);
            x.setHours(23);
            x.setMinutes(59);
            x.setSeconds(59);
            de = x.getTime(); 
        } 
        var dn = null; 
        var apm1 = '';
        
        while ( (m = r.exec(item[0].substring(k)))!=null)
        {
            n++;
            this.endcourse = false;
            var j = m.index + k;
            var ys = m.toString();
         
            var y = ys.split(/:/);
            var mn = parseInt(y[0].replace(/^0/,''))*60 + parseInt(y[1].replace(/^0/,''));
            
            var apm = '';
            var jj = j+ ys.length;
            while (jj <item[0].length && (item[0].charAt(jj).toLowerCase()!='a' && item[0].charAt(jj).toLowerCase()!='p'))jj++;
            
            if (  item[0].substring(j+ys.length,jj).replace(/\s/g,'')=='' && jj < item[0].length-1 && item[0].charAt(jj+1).toLowerCase()=='m')
            {
                apm = item[0].substring(jj,jj+2).toLowerCase();
            }
            
            if (n%2==0 && item[2]=='0') // ending course
            {
                if (apm1=='pm') apm = 'pm';
                if (apm == 'pm') 
                    mn += 12*60;
                if (dn != null  && dn.length>0 )
                {
                    for (var q=0; q < dn.length; q++)
                    {
                        var tm = dn*24*60 + mn;
                        var nowm = daynow*24*60 + nowminutes;
                        if (tm>=nowm)
                        {  
                            if(tm-nowm < ls) 
                            {  
                                ls = tm-nowm;
                                this.endcourse = true;
                            }
                        }
                        else
                        {   
                             if ( 7*24*60 + tm-nowm < ls) 
                             { 
                                 ls = 7*24*60 + tm-nowm;
                                 this.endcourse = true;
                             }
                        }
                    }
                }
            }
            else if (n%2 ==1)
            {
                apm1 = apm; 
                if (apm == 'pm') 
                    mn += 12*60;
                var dw = ''; if (k<j) dw=item[0].substring(k,j);
                dn = this.daymap2n(dw);
                if (dn != null  && dn.length>0 )
                {
                    for (var q=0; q < dn.length; q++)
                    {
                        var tm = dn[q]*24*60 + mn ;
                        if ( item[2]=='0') tm -=   this.ahead;
                        var nowm = daynow*24*60 + nowminutes;
                        if (tm>=nowm) 
                        {
                            if (ls > tm-nowm) 
                                ls = tm-nowm;
                        }
                        else 
                        { 
                            if (ls > 7*24*60 + tm-nowm) 
                                ls = 7*24*60 + tm-nowm;
                        }
                            
                    }
                }
                else if (nowlong >= ds && nowlong <= de)
                {
                    var ll = this.maxtime;
                    if (nowlong-ds < 24*3600000 && nowminutes < mn)
                       ll = mn-nowminutes; 
                    else if (nowlong-ds >= 24*3600000 && nowminutes < mn)
                       ll = mn-nowminutes;
                    else if (nowlong-ds >= 24*3600000 && nowminutes >= mn)
                       ll = 24*60 + mn-nowminutes; 
                    if (ls > ll) 
                    {
                        ls  = ll;
                    }
                }
            }
            k = j+ ys.length;
        }
         
        return ls;
    }
    
    this.daymap2n = function(x)
    {
        x = x.replace(/[\s]*$/,'');
        if (x == '') return null;
        var dns = [];
        var j = x.length-1;
        while (j>=0)
        {
           x = x.charAt(j).toUpperCase();
           var k = this.esn.indexOf(x);
           if (k < 0) k = this.sn.indexOf(x);
           if (k <0) break;
           dns[dns.length] = k;
           j--;
        }
        return dns;
    }
    this.nextone = function()
    {
        var min = this.maxtime;
        var ev = '';
        var ii=-1;
        this.event = '';
        for (var i=0; i < this.N; i++)
        {
            var j = this.closest(this.schedule[i]);
            
            if (j < min)
            {
                min = j;
                ii = i;
                if (this.endcourse) 
                    ev = textmsg[1029];
                else
                    ev = this.schedule[i][1];
            }
            else if (j == min && j < this.maxtime)
            {
                if (this.endcourse) 
                    ev = ","+ textmsg[1029];
                else
                    ev += ","+ this.schedule[i][1]; 
            }
        }
        this.j = ii;
        this.min = min;
        this.event = ev.replace(/'/g,' ');
        if (this.handler!=null) clearTimeout(this.handler);
        if (ev=='' || min==this.maxtime  ) 
        {
            this.timeat = '';
            return;
        }
        this.handler = setTimeout("showalarm('" + this.event + "');Sch.alarm.nextone();", (min)*60000);
        var now = new Date((new Date()).getTime() + this.err);
        var daynow = now.getDay();
        var nowminutes = now.getHours()*60 + now.getMinutes();
        var nowlong = now.getTime();
        var dd = (new Date(nowlong + min*60000))
        this.timeat = this.sn.charAt(dd.getDay())+ dd.getHours() + ":" + dd.getMinutes();
        
    }
     
    
    this.update = function(item)
    {
        
         for (var j=0; j < this.N; j++)
         {
             if (item[0] == this.schedule[j][0] && item[1] == this.schedule[j][1])
                 return;
         }
         this.schedule[this.N++] = [item[0],item[1],item[2],item[3]];
        
         this.nextone();
    }
    this.delete = function(item)
    {
         for (var j=0; j < this.N; j++)
         {
             if (item[0] == this.schedule[j][0] && item[1] == this.schedule[j][1])
                break;
         }
          
         for (; j < this.N-1; j++)
         {
             this.schedule[j] = this.schedule[j+1]
         }
         this.N--; 
         this.nextone();
    }
    this.delete1 = function(j)
    {
         for (; j < this.N-1; j++)
         {
             this.schedule[j] = this.schedule[j+1]
         }
         this.N--; 
         this.nextone();
    }
    this.stopme = function()
    {
        if (this.handler!=null) 
            clearTimeout(this,handler);
    }
}

function switchs(sel)
{
    var s =  (sel.options[sel.selectedIndex].value);
    if (document.location.toString().indexOf('studentindex')>0)
        s =  document.location.toString().replace(/semestercode=[0-9]+/,'').replace(/studentindex.jsp[\?]?/,'studentindex.jsp?semestercode=' + s + '&').replace(/&&/,'&').replace(/&$/,'');
    else
        s =  document.location.toString().replace(/semestercode=[^&]+/,'').replace(/studentmonitor.jsp[\?]?/,'studentmonitor.jsp?semestercode=' + s + '&').replace(/&$/,'').replace(/&&/,'&');
    document.location.href = s;
}
var numtries = [];
function getNumtries(order)
{
    return numtries[order]==null?0:numtries[order];
}
function setNumtries(order,q)
{
    numtries[order] = q;
}
function getSch()
{
    if (f.course.options.length==1)
        return allcourseschs[0][0];
    var j = f.course.selectedIndex;
    return allcourseschs[j-1][0];
}

var cookiekeys = allCookieKeys();
for (let k=0; k < cookiekeys.length;k++)
{
    let nm = cookiekeys[k];
    if (nm.includes('tcmt') && nm!=(uid + 'tcmt') 
     || nm.includes('acinfo') && nm!=(uid + 'acinfo'))
         delCookie(nm);
}
function openit15()
{
    resetassociate();
    setaccessible();
    f.onsave.value="";
    f.onsaved.value= "";
    f.target = parent.frames[1].name;
    if (needcid())
    {
        if (f.course.selectedIndex >= 0)
        {
           savedurl= "";
           openit4('gradebyta.jsp?courseid='+ f.course.options[f.course.selectedIndex].value + '&sessionname=' + f.sessionname.value + '&subdb=' + f.subdb.value)
        }
    }
    else
        savedurl= "openit15()";
    
}

 



