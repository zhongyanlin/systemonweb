 
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
    this.endcourse = true;
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
        var r = new RegExp("[0-9][0-9]?:[0-9][0-9]?");
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
                var dw = item[0].substring(k,j);
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
                  ev += "," + textmsg[1029]; 
               else
                  ev += ","+ this.schedule[i][1]; 
            }
        }
        this.j = ii;
        this.min = min;
        this.event = ev;
        if (this.handler!=null) clearTimeout(this.handler);
        if (ev=='' || min==this.maxtime  ) 
        {
            this.timeat = '';
            return;
        }
        this.handler = setTimeout("showalarm('" + this.event + "');alarm.nextone();", (min)*60000);
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
         this.schedule[this.N++] = item;
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
if (typeof(timeslots)=='undefined') timeslots = null;
 
var alarm = new Alarm(timeslots,timenowsec);
var showalarm = function(t)
    {
         
       var aid = document.getElementById("theclock");
       if (aid != null && aid.style.visibility!="hidden")
       {
           var nowshow = (aid.style.visibility == "visible");
           aid.style.visibility = "visible";
           aid = document.getElementById('alarm');
           var tm = aid.innerHTML;
           var w = "";

           if ( navigator.appName=='Microsoft Internet Explorer')
           { 
             if (tm.indexOf("<embed")<0)
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
           
           aid.innerHTML =  "<br><b>"+   t +  "</b><br><input class=GreenButton style=\"width:70px;text-align:center\" onclick=\"setasinit()\" value=\""+ textmsg[1357] + "\" >" + w;

       }
       
      
 
    }
function findPositionWithScrolling( oElement ) 
{
  if( typeof( oElement.offsetParent ) != 'undefined' ) 
  {
    var originalElement = oElement;
    for( var  posY = 0; oElement; oElement = oElement.offsetParent ) 
    {
      posY += oElement.offsetTop;
      if( oElement != originalElement && oElement != document.body && oElement != document.documentElement ) 
      {
          posY -= oElement.scrollTop;
      }
    }
    return  posY; 
  } 
  else 
  {
    return  oElement.y;
  }
}



function staycenter()
{
       var wd = thispagewidth();
       var het =  thispageheight();
       var thescrollt  =  thescrolltop();
       var thescrolll =   thescrollleft();
       //myprompt("wd=" + wd + "<br>het=" + het +"<br>scrolltop=" + thescrollt +"<br>scrollheight+" +thescrolll);
       var left =  Math.floor(wd - 150)/2;
       left +=  thescrolll;
       var top  = het - 150;
       top  =  Math.floor(top/2);
       top += thescrollt;
       if (left < 0) left = 0;
       if (top  < 0 ) top = 0;

      floater1.style.left =   left + "px";
      floater1.style.top  =   top  + "px";
}
 

var floater1 = null;


//timeslots[0] = "S23:49-23:51";
 
   

function pickthis(td)
{
   var weekdays = (textmsg[832] +"," +  textmsg[830].replace(/|/g,',') ).split(",");
   var label = td.innerHTML.replace(/<[^<]+>/g,'');
   if (label==textmsg[831]) label = weekdays[1];
   var j = 0;
   while (j < weekdays.length && weekdays[j]!=label)
    {   j++;}
   var tbl = td.parentNode.parentNode.parentNode;
   if (tbl.tagName.toLowerCase()!='table') tbl = tbl.parentNode;
   document.body.removeChild(tbl);
   document.getElementById("frequency").selectedIndex = j;
   
}
function showoptions(sel)
{
   var weekdays = (textmsg[832] +"," +  textmsg[830].replace(/|/g,',')).split(",");
   weekdays[1] = textmsg[831];
   //if(browserstr.indexOf("Chrome")>=0)
   {
      var xys = findPositionnoScrolling(sel, window);
      var tbl = document.createElement('table');
      tbl.style.border = "1px #b0b0b0 outset";

      tbl.style.backgroundColor = DBGCOLOR;
      for (var i=0; i < weekdays.length-1; i++)
      {
         var row=tbl.insertRow(i);
         var cell=row.insertCell(0);
         cell.innerHTML = "<span onclick=\"pickthis(this)\">" + weekdays[i] +"</span>";
         
      }
      tbl.style.zIndex = '30';
      tbl.style.position = 'absolute';
      tbl.style.top = xys[1] +'px';
      tbl.style.left = xys[0] + 'px';
      document.body.appendChild(tbl);
   }
}
if (typeof(timenowsec)=='undefined') 
    var timenowsec = 0;
function addone(bb)
{
   
   var btn = document.getElementById('newalarmitembt').childNodes[0];
   var weekdays = textmsg[830].split( "" );
   var btncap=btn.innerHTML;
    
   var  aid = document.getElementById('alarm');
   if (btncap==textmsg[114])
   {
     aid.innerHTML    =   "<table cellspacing=0 cellpadding=0 align=center><tr><td colspan=2 align=center><select id=\"frequency\" style=\"font-size:17px;height:21px;border:1px " + DBGCOLOR +" inset\"    size=1><option value=\"0\" selected>" + textmsg[832] +"</option><option value=\"7\">" + textmsg[831] +"</option><option value=\""
     + weekdays[0] + "\">" + weekdays[0]+ "</option><option value=\"" 
     + weekdays[1] + "\">" + weekdays[1]+ "</option><option value=\"" 
     + weekdays[2] + "\">" + weekdays[2]+ "</option><option value=\"" 
     + weekdays[3] + "\">" + weekdays[3]+ "</option><option value=\"" 
     + weekdays[4] + "\">" + weekdays[4]+ "</option><option value=\"" 
     + weekdays[5] + "\">" + weekdays[5]+ "</option><option value=\""
     + weekdays[6] + "\">" + weekdays[6]+ "</option></select>" 
     +"</td></tr><tr><td><input style=\"width:45px;height:21px;background:white center center url(image/hhmm.gif) no-repeat;font-size:17px;\" id=\"hhmm\" onclick=\"this.focus()\"></td><td>"
     + "<input style=\"width:56px;height:21px;background:white center center url(image/event.gif) no-repeat;font-size:17px;\" id=\"alarmevent\" onclick=\"this.focus()\"></td></tr></table>";
     btn.innerHTML= textmsg[829];
     document.getElementById("alarm").onmousedown = null;
     document.onmousemove = null;
     document.onmouseup   = null;
  }
  else if (document.getElementById('hhmm')!=null)
  { 

   var hhmmele = document.getElementById('hhmm');
   var eventele = document.getElementById('alarmevent');
   var freqele = document.getElementById('frequency');
   var allitems = "";
   var times = hhmmele.value;
   var once = false;
   for (var i=0; i < freqele.options.length; i++)
   {
      if (times!='' && eventele.value!='' && freqele.options[i].selected)
      {
         var y;
         if ( i > 1)
         {
            y = "i'" + userid + "','" + freqele.options[i].value + times + "','" + eventele.value + "',,";
         }
         else if (i==1)
         {
            
             y = "i'" + userid + "','" + times + "','" + eventele.value + "',,";
         }
         else 
         {
             once = true;
             var dt = new Date();
             var nowsec = dt.getTime() + timenowsec;
             var zz = '' + nowsec;
             y = "i'" + userid + "','" + times + "','" + eventele.value + "'," + zz.substring(0,zz.length-3) + "," + zz.substring(0,zz.length-3) ;
         }
         postopen('SaveBack',['rdap','subdb','securitytoken','wcds','orgnum','rsacode'],['schman',userid,'',y,orgnum,'0'],'w' + tstmp);
         alarm.update([times, eventele.value, null,null]); 
      }
   }
   setasinit(); 
   enabledrag();
   btn.innerHTML=textmsg[114];
   }
   
}
 
function setasinit()
{
    var  aid = document.getElementById('alarm');
    aid.innerHTML = "<img src=image/icon/alert.png height=50   onclick=showtimer()>";
    var  bid = document.getElementById('newalarmitembt');
    bid.value = textmsg[114]; 
    
}
function schman()
{
    var nms=['orgnum','subdb','rdap','onbegin','onsaved','ondeleted'];
    var vls=[orgnum, userid, 'schman','115','115','115'];
    myprompt('<iframe name=openlink width=660  height=550 />' );
    postopen('DataTable',nms,vls,'openlink');
}
function delalarmitem(i)
{
   var theclock = document.getElementById('theclock');
   myprompt(textmsg[810],null,"godelalarmitem(v," + i + ")");
   promptwin.style.top = (parseInt(theclock.style.top.replace(/px/,'')) + 30) + 'px';
   promptwin.style.left = theclock.style.left;
}
function godelalarmitem(v,i)
{
    if (v)
    { 
        var     y = "d'" + userid + "','" + alarm.schedule[i][0] + "','" + alarm.schedule[i][1] + "'";
        postopen('SaveBack',['rdap','subdb','securitytoken','wcds','orgnum','rsacode'],['schman',userid,'',y,orgnum,'0'],'w' + tstmp);
        alarm.delete1(i); 
    }   
}

function showtimenow()
{
   var dt = new Date();
   var nowsec = dt.getTime() + timenowsec;
   dt = new Date(nowsec);
   var  aid = document.getElementById('alarm');
   aid.innerHTML =  textmsg[523] +": <b>" + dt.getHours() + ":" + dt.getMinutes() +"</b>";
   setTimeout(setasinit , 2000);
}

function showtimer()
{
   var dt = new Date();
   var nowsec = dt.getTime() + timenowsec;
   dt = new Date(nowsec);
   var  aid = document.getElementById('alarm');
   aid.innerHTML = "<b>"+ alarm.timeat +"<br>" + alarm.event +"</b>";
   setTimeout(setasinit, 2000);
}
 
var xx = (screen.width-150)/2;
if (window.name == "tlmmainr") xx = 20;
//var clock ="background: " + BBGCOLOR +";background: radial-gradient(farthest-side at 50% 50%,"+ DBGCOLOR + ","+ DBGCOLOR + ","+ DBGCOLOR + ","+ DBGCOLOR + ","+ DBGCOLOR + ","+ DBGCOLOR + ","+ DBGCOLOR + ","+ DBGCOLOR + ","+ DBGCOLOR + ","+ DBGCOLOR + ","+ DBGCOLOR +","+ IBGCOLOR + ","+ IBGCOLOR +  ","+ IBGCOLOR + ", transparent);"; 
//var clock = "radial-gradient(ellipse farthest-corner at 150px 150px, "+ DBGCOLOR + " 0%, " + DBGCOLOR + "75%, " + IBGCOLOR + " 95%)";
//document.write("<style>#theclock {position:absolute;left:" + xx +"px;top:" + (screen.height-150)/2 +"px;height:150px;width:154px;" + clock+";background-repeat:no-repeat;border:0px;margin:0px 0px 0px 0px;padding:20px 0 20px 0;font-size:15px;z-index:5}</style>");

document.write("<style>#theclock {position:absolute;left:" + xx +"px;top:" + (screen.height-150)/2 +"px;height:150px;width:150px;border-radius:75px;background:"/*transparent top center url(image/clock.gif) no-repeat*/+"radial-gradient(circle at 50%," + DBGCOLOR +" 0%, " + DBGCOLOR +" 62%, " + IBGCOLOR +" 71%);background:-webkit-radial-gradient(circle at 50%," + DBGCOLOR +" 0%," + DBGCOLOR +" 62%," + IBGCOLOR +" 71%);background:-moz-radial-gradient(circle at 50%," + DBGCOLOR +" 0%, " + DBGCOLOR +" 62%, " + IBGCOLOR +" 71%);border:0px;margin:0px 0px 0px 0px;padding:0px 0  0px 0;font-size:15px;z-index:5}</style>");
document.write("<div id=\"theclock\" ><center>");
document.write("<br><table><tr><td align=center id=\"newalarmitembt\" style=\"font-size:17px;margin:0px;padding:0px;font-weight:bold\"><a href=\"javascript:addone('newalarmitembt')\" >" + textmsg[114] + "</a></td></tr></table>");
document.write("<div style=\"font-size:17px;height:50px;width:110px;margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;border:0px\" id=\"alarm\"><img style=margin:0px;padding:0px src=image/icon/alert.png height=50  onclick=showtimer()></div>");//<br><span class=outset2><font color=#DDCC11><b>Alarm</b></font></span></div>");
//document.write("<div style=\"height:17px;width:110px;margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;border:1px black solid\">");
document.write("<span style=\"font-size:17px;margin:0px;padding:0px;font-weight:bold\"><a href=\"javascript:showtimenow()\">" + textmsg[36] + " </a></span>");
document.write("&nbsp;&nbsp;<span style=\"font-size:17px;margin:0px;padding:0px;font-weight:bold\"><a href=\"javascript:schman()\">" + textmsg[545] + " </a></span>");
document.write("<br>");
document.write("<span   style=\"font-size:17px;font-weight:bold\"><a href=\"javascript:hideme()\">" + tmg82 + " </a></span>");
document.write("</center></div>");
function hideme()
{
   var aid = document.getElementById('theclock');
   if (aid!=null)aid.style.visibility = "hidden";
   aid = document.getElementById('alarm');
   if (aid!=null) aid.innerHTML = "";
   alarm.stopme();
     
}
function newalarm(m,n)
{
    for (var i=0; i < n; i++)
    {
       if (i >= alarm.N)
          alarm.schedule[i] = [];
       for (var j=0; j < 4; j++) 
          alarm.schedule[i][j] = m[i][j];
    }
    alarm.N = n;
    alarm.nextone();
}
function enabledrag()
{
     floater1 = document.getElementById("theclock");
      var swap0 = document.getElementById("alarm");
      Drag.init(swap0,floater1);
}
 
var onloadbeforechock = null;
if(typeof window.onload == 'function')
   onloadbeforechock = window.onload; 
 window.onload = function()
    {
      if (onloadbeforechock!=null) 
          onloadbeforechock();
      enabledrag();
      alarm.nextone();
      staycenter();
      window.onscroll = staycenter;
    };
 
window.onresize = function()
{
    staycenter();
}





 

 

