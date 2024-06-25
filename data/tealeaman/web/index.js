var indexpage = true;
var logouti = 0;
var wins = new Array();
var winkeys = [];
var titletxtnow;
var courseGoing=null;
var blnum = 0, blnum0=0;  
var posx=0, posy=0, kk=1; 
var nav = null;
var ugentmsg = ''; 
var containerWidth,containerHeight, regisheight=700;
var myfontname = localStorage['myfontname'];
var allspans = [];
SetCookie((orgnum%65536) + "uid",userid);  
function havedomain()
{
    for (var k=0; k < funlinks.length; k++)
    {
        if (funlinks[k][2].indexOf('rdap=registerp')>0)
        {
            funlinks[k][2] = "domainvalue.jsp";
            funlinks[k][3] = textmsg[696];
            funlinks[k][4] = 8;  
            break;
        }
    }
}

function stars()
{
    var xy = [[500,20],[450,10],[520,30],[530,70],[540,45]];
    var z = document.getElementById('maintbl');
     for (var j=0; j < xy.length; j++)
     {
         var d = document.createElement('div');
         d.style.cssText = 'animation: glimpse 5s infinite;color:#ddcc11;position:absolute;left:' + (800 - 500 +xy[j][0]) + 'px;top:' + xy[j][1] + 'px;font-size:' + (10+1*j) + 'px';
         d.innerHTML = "&starf;";
        
         z.appendChild(d);
     }
 }    
function setcrosssite(s){crosssite=s;}

function openit(doc, alink, wn)
{
    var titletxt = "";
    if (alink!=null &&  typeof(alink.innerHTML)!='undefined')
        titletxt = alink.innerHTML.replace(/<[^>]*>/g,'');
    else if (typeof(alink)=='text')
        titletxt = alink;
    
    makeformsubmit(doc, wn,  titletxt);
}

function managewin(win, j) 
{
    if (j == 0)
    {
        if (wins[titletxtnow]==null)
        {
           wins[titletxtnow] = win;
           var i = 0;
           for (; i < winkeys.length; i++)
           {
              if (winkeys[i] == titletxtnow)
                  break;
           }
           
           if ( i == winkeys.length)
           {
               winkeys[winkeys.length] = titletxtnow;
           }
        }
    }
    else
    {
       for (var i=0; i < winkeys.length; i++)
       {
           if (win == wins[winkeys[i]])
           {
               delete wins[winkeys[i]];
               break;
           }
       }
    }
}
var closechildwin = function()
{
   for (var key in wins) 
   {
      if (!wins[key].parent.parent.parent.closed)
      wins[key].parent.parent.parent.close();
   }  
}

function makeformsubmit(url, wn, titletxt)
{
    url = url.replace(/\?\?Encoding\?\?/g,encoding);
    if (wins[titletxt] != null)
    {
        var p = wins[titletxt];
        while (p!=null && p!=p.parent ) p = p.parent;
        if (p!=null && p.parent!=null)
        {
            p.focus();
            return;
        }
        
    }
    titletxtnow = titletxt;
    var fsnd = document.postform;
    var feles = fsnd.elements;
    for (var j=feles.length-1; j >=0; j--)
       feles[j].disabled = true;   
    var ii = url.indexOf("?");
    if (ii==-1)
        url = url+"?qi3p_is4x=dg2_2_gh12dfgdf_w";
    else
        url = url+"&qi3p_is4x=dg2_2_gh12dfgdf_w";
    if (ismobile()) url = url+"&mobile=1";
    var tt = document.location.toString().replace(/^.*orgnum=([0-9]+).*$/,'$1');
    if (''+parseInt(tt) != 'NaN')
    {
        url = url+"&orgnum=" + tt;
    }
    ii = url.indexOf("?");
    var pv = url.substring(ii+1);
     var jj = pv.lastIndexOf("#");
     if (jj>-1) pv = pv.substring(0,jj);
     var pvs = pv.split(/&/);
     
     
     for (var i=0; i < pvs.length; i++)
     {
         var k = pvs[i].indexOf("=");
         if (k == -1) continue;
         var x = null;
         if (k == pvs[i].length-1)
             x = [pvs[i].substring(0,k),''];
         else
             x = pvs[i].split(/=/);
         for (var j=0; j < fsnd.elements.length; j++)
         {
             if (x[0] == fsnd.elements[j].name)
             {
                 fsnd.elements[j].disabled = false;
                 fsnd.elements[j].value = decodeURI(x[1]);
                 break;
             }    
         }
         if (j == fsnd.elements.length)
         {
             var el = document.createElement("input");
             el.type = "hidden";
             el.name = x[0];
             el.value = decodeURI(x[1]);
             fsnd.appendChild(el);
         }
     }
     url = url.substring(0,ii);
     formnewaction(fsnd,  url);
 
     if (wn==null) wn = "_blank";
     var islogout = (url.indexOf("login.jsp")>=0);

     if (wn!='_blank' && !islogout)
     { 
         var handle = window.open("", wn);
         handle.title = titletxt;
     }
     if (!islogout) fsnd.target = wn;
   
     visual(fsnd);
     fsnd.submit();
}
function systemname()
{
    return systemnamestr;
}

function getCourseGoing(){ return courseGoing;}
function setCourseGoing(cid){ courseGoing=cid;}

function addnewhint(nummsg, numsub, numins)
{
  for (var i=0; i < funlinks.length; i++)
  if (funlinks[i][0]==2 &&  funlinks[i][1]==3)
     funlinks[i][3] += numsub;
  else if (funlinks[i][0]==13 &&  funlinks[i][1]==2)
     funlinks[i][3] += nummsg;
  else if (funlinks[i][0]==13 &&  funlinks[i][1]==3)
     funlinks[i][3] += numins;
  else if (funlinks[i][0]==16 &&  funlinks[i][1]==2)
  {
      funlinks[i][2] += '&Encode='+encoding;
  }
}

function addother(subdb,semester)
{
  for (var i=0; i < funlinks.length; i++)
  if ( funlinks[i][2].indexOf("rdap=mycourse") >0
    || funlinks[i][2].indexOf("rdap=mysession") >0
    || funlinks[i][2].indexOf("rdap=mystudent0") >0
    || funlinks[i][2].indexOf("rdap=grading") >0
    || funlinks[i][2].indexOf("rdap=messages0") >0
    || funlinks[i][2].indexOf("rdap=webservices0") >0
  )
   funlinks[i][2] += subdb;
}


 
function noshow(f)
{                            
if ( initstatus == 3)
{ 
    var notp = "rdap=evalution&,rdap=mycourse&,myeval.jsp,statuschange.jsp,aggregate.jsp,rdap=faculty0&,rdap=student0&,rdap=staff0&,rdap=vender0&,rdap=department0&,subjectmajor.jsp,rdap=acaprogram0&,rdap=course0&,rdap=acalender0&,scheduler.jsp,rdap=registration0&,rdap=statuschanger&,rdap=evalquestion0&,rdap=sessionsum0&,rdap=evaluation0&,rdap=assess0&,rdap=transfer0&,rdap=feeset&,frdap=eecharge0&,cfgdb.jsp,rdap=commandline,cfgfolders.jsp,rdap=systemparameter&,rdap=role&,rdap=registerp&,rdap=userlist0&,rdap=dbowner0&,tables.jsp,datatransfer.jsp,domainvalue.jsp,rdap=task10&,datamerge.jsp,customize.jsp,rdap=index&,talk.jsp,discussion.jsp,dboperation.jsp,dbapplication.jsp,webservices0&,webfolder.jsp,authen.jsp,rdap=userself&,rdap=facultyself&,rdap=userresetpass&".split(/,/);
    for (var i=0; i < notp.length; i++)
        if (f.indexOf(notp[i]) >=0) 
            return true;
}
    return false;
}
 

function block(order)
{
   if (funblocks[order-1] == null || funblocks[order-1].length < 3) 
   return '';
   var blname = funblocks[order-1][2];
   var picname = funblocks[order-1][1];

   var str = '<table width="100%" cellpadding=3 cellspacing=0 >';
   if (blname!= '')
   {
      str += '<tr height=30><td  align=center class=outset3 style="border:1px #bbb  outset;padding:3px 3px 3px 5px"   colspan="2" ><div class=forcurve2 style="color:#DDCC11;font-weight:bold" ><nobr>'+ (++blnum)+'. <nobr>'+ blname +'</nobr></div> </td></tr>';
   }
 
   str+='<tr><td class="outset4" style="border:1px #bbb outset"><table id="block' + order + '" style="background:' + bgindex + ';width:100%" cellpadding="12" cellspacing="0" border="0"  >'
   +'<tr> <td valign=top align=center width=120><div style="width:120px !important;height:120px !important" ><center>'
   +'<img src="' + picname + '" width=100 height=100 style="width:100px !important;height:100px !important;margin:10px 10px 10px 10px;border:0px" /></center></div></td><td align=left valign=center>'
   +'<table width="100%" cellspacing="0" align=left cellpadding="1" border="0">';
   for (var i = 0; i < funlinks.length && funlinks[i][0]!=order; i++);
   
   for (; i < funlinks.length && funlinks[i][0]==order; i++)
   {
      if (funlinks[i][2]=='login.jsp?follow=logout') 
          logouti = i;
      else if (order==16 && funlinks[i][2].indexOf('orgnum=') < 0)
      {
          if (funlinks[i][2].indexOf('?')>0)
              funlinks[i][2] += "&orgnum=" + (orgnum - orgnum%65536);
          else
              funlinks[i][2] += "?orgnum=" + (orgnum - orgnum%65536);
      }
      if (  ( (funlinks[i][4] & userroles) > 0 && funlinks[i][5].indexOf("-" + userid) < 0
         || funlinks[i][5].indexOf("+" + userid)  >=0 ) && (funlinks[i][3]!=textmsg[369]&&funlinks[i][3]!=textmsg[368] || edition.indexOf("+")>0))
      {
         if ( noshow(funlinks[i][2]) )
              str +='<tr><td><span style="color:grey;font-weight:bold"><nobr>'  + funlinks[i][3] + '</nobr></span></td></tr>';
         else
              str +='<tr><td><a href="javascript:openlink(' + i +')"><span style="font-weight:bold"><nobr>'  + funlinks[i][3] + '</nobr></span></a></td></tr>';
      }
   }
   str +='</table></td></tr></table></td></tr></Table>';
   return str;
}
 
function closehint(m)
{
    var tr = m.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    var tb = tr.parentNode.parentNode;
    var r=0; for (; r < tb.rows.length; r++) if (tb.rows[r] == tr) break;
    tb.deleteRow(r);
    quickrow = 0;
}
function quitmsg(app,tid,rid,code,sek)
{
    Msg.send({app:app,tid:tid,rid:rid,code:code,sek:sek});
  
} 

function msginit()
{
    Msg.init({stoken:securitytoken,
    app:"exam",
    tid:'',
    sid:userid,
    sname:userid,
    rid:'',
    code:'',
    msg:'',
    sek:''}); 
    stars();
 
    var ftsel = document.getElementById("fontfamily");
    if (ftsel!=null && myfontname!=null)
    {
        for (var j=0; j < 3; j++) 
        if (ftsel.options[j].value == myfontname) 
            ftsel.selectedIndex = j;
    }
    doblocks();
    
}

function doblocks()
{
for (var order = 1; order < 50; order++)
{
    var b = document.getElementById("block" + order);
    if (b == null)  
    {
        continue;
    }
    b.style.fontFamily = document.body.style.fontFamily;
    b.style.backgroundPosition = "-" + posx +"px -" + posy +"px";
    if ((kk) %2 == 0)
    {
        posy += b.offsetHeight + 80;
        if (kk % 8 == 0) posy = 0;
        posx = 0;
    }
    else
    {
        posx += b.offsetWidth + 8;
    }  
    kk++;
    
} 
}


function handleerr(err)
{
   if (err == '')
   {
       var browsehint = localStorage["browsehint"];
       if ( browsehint ==null)
       {
            ugentmsg =  "<div  style=\"border-radius:4px;border:0px #b0b0b0 solid;padding: 3px 3px 3px 3px;background:linear-gradient(" + DBGCOLOR + "," + BBGCOLOR + ")\"><div style=\"width:72px;height:72px;margin:4px 4px 5px 5px;float:left;border-radius:36px;background-image:url(image/stop.png);background-position:-4px -4px\"><!----></div>" + textmsg[868];
           if (browserstr.indexOf('MSIE') >= 0)
           {
             rv = navigator.userAgentData.flatformVersion;
             if (rv == 6.0)
                ugentmsg =  "<div  style=\"border-radius:4px;border:0px #b0b0b0 solid;padding: 3px 3px 3px 3px;background:linear-gradient(" + DBGCOLOR + "," + BBGCOLOR + ")\">Because you are using an old version of Internet Explorer browser, some of TeaLeaMan functions may not work. You are advised to update your browser.<br><br>";
             else
                ugentmsg  = "<div  style=\"border-radius:4px;border:0px #b0b0b0 solid;padding: 3px 3px 3px 3px;background:linear-gradient(" + DBGCOLOR + "," + BBGCOLOR + ")\" ><div style=\"width:72px;height:72px;margin:4px 4px 5px 5px;float:left;border-radius:36px;background-image:url(image/stop.png);background-position:-4px -4px\"><!----></div>" + textmsg[868] + textmsg[869];
           }
           else if (browserstr.indexOf('Mozilla')>=0)
           {
              ugentmsg += textmsg[870]; 
           }
           else if (browserstr.indexOf('Safari') >=0)
           {
              ugentmsg += "<br>" + textmsg[871] +".<br>";
           }
           else 
           {
              ugentmsg += "<br>" + textmsg[873]+".<br>";
           }
           ugentmsg += "<br><input type=checkbox style=background-color:transparent onclick=\"javascript:localStorage['browsehint']='1'\"> " + textmsg[872] + "</div>";
        }
        execmjp(browsehint);
    }
    else
    { 
        ugentmsg =  err.replace(/"/g,' ').replace(/\n/,' ');
    }
    if (ugentmsg!='') myprompt(ugentmsg) ;
}

function syn(n)
{
    if (n == 'del')
    {
        delnotusedattach();
        myprompt(textmsg[1306]);
    }
}

function removeembed(course,sessionname)
{
    postopen('embedquiz.jsp?',
    ['mode','course','sessionname'],
    ['remove',course, sessionname], 'w' + tstmp);
}

                            
function changeencoding(spn,encoding)
{
    var str = "<table width=100 >";
    for (var i=0; i < enlang.length; i++)
        str += "<tr><td onclick=\"choosethislang(this,'" +enlang[i] + "','" + encoding + "'," + i + ")\">" + unic[i] + "</td></tr>";
    str += "</table>";
    var xy = findPositionnoScrolling(spn);
    var dv = document.createElement("div");
    dv.id = 'changecode';
    //dv.className = 'outset2';
    dv.style.cssText = "background-color:" + IBGCOLOR + ";color:white;width:100px;position:absolute;top:" + xy[1] + "px;left:" + (xy[0]-20) 
    +"px;border:1px #666666 solid";
    dv.innerHTML = str;
    document.body.appendChild(dv);
}
 
function choosethislang(td, encoding, encoding0,i)
{
     
        var newnum = i*65536 + ORGNUM;
        SetCookie("orgnum", ""+newnum);
       
        if (typeof(eid)=='undefined' || eid==null)
            document.location.href='index.jsp?orgnum=' + newnum;
        else
            document.location.href='index.jsp?orgnum=' + newnum + '&eid=' + eid;
    
}                            
function openitw(url,wn,tl)
{
   //stop = true;
   var xx = screen.width;
   if (xx>=1000) xx=999;
   var yy = screen.height;
   if (yy>=1000) yy=999;
   if (url.indexOf("?"))
      openit(url + "&dim=" + xx + yy, tl,wn);
   else
      openit(url + "?dim=" + xx + yy, tl,wn);
}
function openlink(i)
{
    makeformsubmit(funlinks[i][2], "_blank", funlinks[i][3]);
}

function restoredim(uid)
{
    document.f1.id.value = uid;
    shrinkiframe();
     
}
function shrinkiframe()
{
    var z = document.getElementById('regis');
    regisheight -= 10;
    z.style.height = regisheight + 'px';
    
    var hh = 50;
    if (regisheight == 120) hh = 3000;
    else if (regisheight < 120) hh == 20;
    if (regisheight>0)
    {
        z.parentNode.parentNode.height = (regisheight);
        setTimeout( shrinkiframe ,hh);
        //
    }
    else
    { 
        z.parentNode.parentNode.height = 1;
        z.style.visibility = 'hidden';
        regisheight = 700;
        //document.getElementById('msg').innerHTML = regisheight + ", " + z.parentNode.parentNode.height;
    }
}

if (crosssite == null) setcrosssite('');


 
function biggerqrcode(x)
{
    var orgurl =  url + "/index.jsp?orgnum=" +  orgnum;
    var y = "Qrlink?url=" + Msg.hex(orgurl) + (userid==null?'':'&nlg=1');
    var xy = findPositionnoScrolling(x);
    myprompt("<div id=warning0></div><img src=\"" + y + "\" onerror=makeaqrcode() onclick=makeaqrcode() onload=warning(this)>",null,null,orgurl);
    promptwin.style.zIndex = 52;
}
function makeaqrcode()
{
    document.location.href = "index.jsp?qrcode";
}
warning = function(mg)
{
    if (mg.offsetWidth < 300)
    {
        document.getElementById('warning0').innerHTML = textmsg[1864];
    }
}
function getTimeroom()
{
   if ( timeslots == null) return null;
   var x = [];
   for (var j=0; j < timeslots.length; j++)
       x[x.length] = [timeslots[j], rooms[j]];
   return x;
    
}
 

function getindexwindow()
{
    return window;
}
gomenu0 = function(){return true;}

var quickrow = 0;  
function showquickstart()
{
    if (quickrow>0)  return;
    var i;
    if (typeof(quickstartarr)!='undefined')
    quickrow =  showquickstart0(quickstartarr,1);
    if (typeof(quickstart4arr)!='undefined')
    showquickstart0(quickstart4arr);
}
function drawline(td,j)
{
    if (allspans.length == 0)
       collect(document.getElementById('insrow').parentNode.parentNode);
    
    var str = td.innerHTML.replace(/[^"]+"([^"]+)".*/,'$1');
    if (j==1) str =  allspans[3].innerHTML.replace(/<[^>]+>/g,''); 
    for (var i=0; i < allspans.length; i++)
    {
        var s = allspans[i].innerHTML.replace(/<[^>]+>/g,'');
        
        if (s == str)
        {
            var xy = findPositionnoScrolling(td);
            xy[0] +=100;  
            var XY = findPositionnoScrolling(allspans[i]);
            XY[0] += 50; 
            drawlo(xy[0],xy[1],XY[0],XY[1] );
        }
    }
}
var linenum = 0;
function removeline()
{
    var j = 0;
    for(; j < linenum; j++)
    {
        var x = document.getElementById('lineto'+j);
        if (x==null) break;
        document.body.removeChild(x);
    }
    linenum = 0;
}
var drawlo = function(x0,y0,x1,y1)
{
   var  dv =  document.createElement('div');
   dv.id='lineto'+ (linenum++);
   var f = 7;
   var thick = 2;
   if (thick >= 2 && thick <= 4) f= 9;
   else if (thick > 4) f= 13;
   var  mg =   '&rarr;'

    var width = Math.sqrt((y1-y0)*(y1-y0) + (x1-x0)*(x1-x0)) ;
    if (width < f) {mg = '';}
    var left =  (x1+x0)/2 - (width)/2 -1 ;
    var top =   (y1+y0)/2 - (f)/2 -1;
    var height = thick;
    if (Math.abs(x1-x0) > Math.abs(y1-y0) )
    {
        var deg  =   Math.atan2(y1-y0, x1-x0)*180/3.14159265;
    }
    else
    {
        var deg  = -Math.atan2(x1-x0,y1-y0)*180/3.14159265 + 90;
    }
        
    dv.style.cssText = 'z-index:0;position:absolute;left:'
    + left + 'px;top:'
    + top +  'px;width:'
    + width + 'px;height:'
    + f + 'px;-ms-transform: rotate(' + deg 
    + 'deg);-webkit-transform: rotate('+ deg + 'deg);transform: rotate('  + deg + 'deg);z-index:10;padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;';
    dv.innerHTML = '<table cellpadding=0 cellspacing=0><tr height=' + f + " valign=middle><td valign=middle style=\"font-size:20px;color:purple\" width=" + f + " align=center valign=middle>&bull;</td><td width=" + (width-f) + " valign=middle><div style=\"margin:0px 0px 0px 0px;width:" + (width-f) + "px;height:" + thick + "px;background-color:purple\"><!----></div></td><td valign=middle style=\"font-size:20px;color:purple\" width=" + f + " align=center valign=middle>&bull;</td></tr></table>";
    document.body.appendChild(dv);
}
function showquickstart0(xs,x)
{
     var str = '<div style="background-image:null;background-color:#E9F6A1;color:purple;border-radius:4px;font-size:13px"><table>'
           + '<tr><td align="left" valign=top width="2%"><img style="margin:0px 0px 0px 0px;float:left;width:20px !important;border-radius:10px;cursor:pointer" src="image/icon/smalls00.png" onclick="closehint(this)" onmouseover="swappic(this)" onmouseout="swappic(this)"></td><td align="center"  style="font-weight:bold;font-size:16px;color:#331100">' + xs[0] + '</td></tr>';
     for (var j=1; j < xs.length; j++)
         str += '<tr><td align="left" valign=top width="2%"><div class=circle>' + j + '</div></td><td width=98% align="left" onmouseenter=drawline(this,'+j+') onmouseout=removeline() colspan=1>' + xs[j] + '</td></tr>';
     str += '</table></div>';
    var r;
    if (x == 1)
    {
        r = document.getElementById('insrow');
    }
    else
    {
        r = document.getElementById('tearow');
    }
    var tbl = r.parentNode.parentNode;
    var i=0; for (; i < tbl.rows.length && tbl.rows[i] != r; i++);
    r = tbl.insertRow(i);
    
    var c = r.insertCell(0);
    c.colSpan = 2;
    c.innerHTML = str;
    return i;
}

function collect(x)
{
   if (x ==null||x.tagName==null) return;
   var type = x.tagName.toLowerCase();
   if (type == 'span')
   {
      allspans[allspans.length] = x;
   }
   if ( type='table'||type=='div'||type =='tr'|| type=='td')
   {
       var xs = x.childNodes;
       if (xs!=null && xs.length!=0)
       for (var j=0; j < xs.length; j++)
       {
           collect(xs[j]);
       }
   }
}
function search()
{
   for (var j = 0; j < allspans.length; j++)
   {
       var str  = allspans[j].innerHTML;
       allspans[j].innerHTML = str.replace(/<span[^>]+>/g, "").replace(/<.span>/g, "");
   }
   var pat = document.getElementById("pat").value;
   if (pat=='') 
   {
       return;
   }
   var spc = "$^*()=-[]\\|.";
   pat = pat.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
   for (var i=0; i < pat.length; i++)
   {
      if (spc.indexOf(pat.charAt(i))>=0)
      {
         pat = pat.substring(0,i) + "\\" + pat.substring(i);
         i++;
      }
   }
   pat = pat.replace(/[ ]+/, ".*");

   var reg = new RegExp(pat);
   if (allspans.length == 0)
       collect(document.getElementById('insrow').parentNode.parentNode);
    
   for (var j = 0; j < allspans.length; j++)
   {
      var str  = allspans[j].innerHTML;
      var nospan = str.replace(/<span[^>]+>/g, "").replace(/<.span>/g, "");
      var m = reg.exec(nospan);
      if(m == null) continue;
      var i = m.index;
      var found = m.toString();
      str = '';
      if (i > 0)
          str = nospan.substring(0,i);
      str += "<span style=background-color:purple;color:white>"  + found +"</span>";
      if(nospan.length > i + found.length)
         str += nospan.substring(i + found.length);
      allspans[j].innerHTML = str;
       var xy = findPositionnoScrolling(document.getElementById("pat"));
       xy[0] +=100; xy[1] += 15;
       var XY = findPositionnoScrolling(allspans[j]);
       XY[0] +=50; XY[1] += 10;
       drawlo(xy[0],xy[1],XY[0],XY[1] );
  }
}
if (typeof(nummsg) == 'undefined')var nummsg = 0;
if (typeof(numsub) == 'undefined')var numsub = 0;
if (typeof(numins) == 'undefined')var numins = 0;
addnewhint( nummsg, numsub,numins);
addother(userid,currentSemester);
document.write(unifontstyle(font_size));
window.onunload = closechildwin;
needtranslator = false;
if ( (userroles & 16) == 0) havedomain();
var onloadbeforeindex = null;
if (typeof(window.onload)!='undefined' && window.onload !=null)
{
    onloadbeforeindex = window.onload;
}
window.onload = function()
{
    msginit();
    if (onloadbeforeindex!=null)   onloadbeforeindex();
}




function allcookies(title) 
{
    let clear = textmsg[1871].split(/@/)[5];
    var cookies = document.cookie.split(';');
    var ret = "<table align=center id=allcookie style=\"border:1px #b0b0b0 solid;border-radius:4px;margin:4px\"><tr style=background-color:"
           + BBGCOLOR + "><td>" 
           + textmsg[15] + '</td><td  width=100%>' + textmsg[531] 
           + "</td><td valign=middle onclick=clearallcookies()>" 
           + clear +"<td></tr>";
    
    for(let i=0; i < cookies.length; i++)
    {
        let j = cookies[i].indexOf('=');
        ret +=  '<tr><td>' + cookies[i].substring(0,j)
                + '</td><td style=font-weight:700;font-family:arial  width=100%>' + cookies[i].substring(j+1)
                + "</td><td valign=middle onclick=\"clearcookie(this,'" + cookies[i].substring(0,j)  
                + "')\">"  
                + clear
                +"<td></tr>";
    }
    myprompt(ret + "</table>",null,null,title);
    
}

function clearcookie(td,name)
{
    delCookie(name);
    td.parentNode.parentNode.removeChild(td.parentNode);
}
function clearallcookies()
{
    let tbl = $('allcookie');
    for (let i = tbl.rows.length-1; i>=1;  i--)
    {
        clearcookie(tbl.rows[i].cells[0],tbl.rows[i].cells[0].innerHTML);
    }
    
}
function alllocals(title) 
{
   localStorage['key'] = 'value';
   var ret =  "<table align=center id=alllocal style=\"border:1px #b0b0b0 solid;border-radius:4px;margin:4px\"><tr style=background-color:" + BBGCOLOR + "><td  width=100%>" 
           + textmsg[15] + ':' + textmsg[531] 
           + "</td><td valign=middle onclick=clearalllocals() >" 
           + textmsg[1871].split(/@/)[5]+"<td></tr>";
   let key = Object.keys(localStorage);
   
   for(let i=0; i < key.length; i++) 
   {
       
       ret += "<tr><td width=100%>" + key[i] + ':<br>' + localStorage[key[i]].replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\r\n/g,'<br>').replace(/\n/g,'<br>') 
       + "</td><td valign=middle onclick=clearlocal(this," + key[i] + ")>" 
       + textmsg[1871].split(/@/)[5]+"<td></tr>";
   }
   myprompt(ret + "</table>",null,null,title);
}
function clearlocal(td,name)
{
    localStorage.removeItem(name);
    td.parentNode.parentNode.removeChild(td.parentNode);
}
function clearalllocals()
{
    let tbl = $('alllocal');
    for (let i = tbl.rows.length-1; i>=1;  i--)
    {
        clearlocal(tbl.rows[i].cells[1],tbl.rows[i].cells[0].innerHTML.replace(/;.*$/,''));
    }
    
}
SetCookie("orgnum", orgnum);
SetCookie("myindexway","index.jsp");
handleerr(err);
indexwindow = window;
 