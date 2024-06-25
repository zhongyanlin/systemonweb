var indexpage = true;
if (GetCookie('orgnum') == null &&orgnumstr==null)
{
    var a;
    var Browser_Agent=navigator.userAgent;
    if(Browser_Agent.indexOf("MSIE")!=-1)
    {
        a=navigator.browserLanguage.toLocaleLowerCase();
    }
    else
    {
        a=navigator.language.toLocaleLowerCase();
    }
    var orgnum1;
    if (a == "zh-cn") 
        orgnum1 = 0;
    else
        orgnum1 = 65536;
    if (orgnum!=orgnum1)
        document.location.href = "index0.jsp?orgnum=" + orgnum1;
}
function stars()
{
    var xy = [[610,20],[560,10],[630,30],[647,80],[650,50]];
    var z = document.getElementById('maintbl');
    z.style.position = "relative";
     for (var j=0; j < xy.length; j++)
     {
         var d = document.createElement('div');
         d.style.cssText = 'animation: glimpse'+ j + ' ' + (''+(10+Math.random()*40)).replace(/\..*/,'') + 's 1;opacity:1.0;color:#ddcc11;position:absolute;left:' + ( xy[j][0]) + 'px;top:' + xy[j][1] + 'px;font-size:' + (10+1*j) + 'px';
         d.innerHTML = "&starf;";
        
         z.appendChild(d);
     }
 }  
function setcrosssite(s){crosssite=s;}
document.write(unifontstyle(font_size));
function openit(doc, alink, wn)
{
    var titletxt = "";
    if (alink!=null &&  typeof(alink.innerHTML)!='undefined')
        titletxt = alink.innerHTML.replace(/<[^>]*>/g,'');
    else if (typeof(alink)=='text')
        titletxt = alink;
    
    makeformsubmit(doc, wn,  titletxt);
}
var wins = new Array();
var winkeys = [];
var titletxtnow;
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
window.onunload = closechildwin;
function makeformsubmit(url, wn, titletxt)
{
    url = url.replace(/\?\?Encoding\?\?/g, encoding );
    if (wins[titletxt] != null)
    {
        var p = wins[titletxt];
        while (p!=p.parent && p.parent!=null) p = p.parent;
        if (p.parent!=null && p!=null)
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
    
    if (ii>-1)
    {
     var pv = url.substring(ii+1);
     var jj = pv.lastIndexOf("#");
     if (jj>-1) pv = pv.substring(0,jj);
     var pvs = pv.split(/&/);
     if (ismobile()) pvs[pvs.length] = "mobile=1";
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
 }
 else if (ismobile() )
 {
     if (url.indexOf('?')==-1)
       url = url.replace(/[\\?|&]mobile=[0|1]/,'') + "?mobile=1";
     else
       url = url.replace(/[\\?|&]mobile=[0|1]/,'') + "&mobile=1";  
 }
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
                        

function updateSessionid(newsid){sessionid = newsid;}
var oldid = '';
SetCookie("orgnum", orgnum );
var eid = null;
function afterreg(eid)
{
    postopen('DataForm',
    ['rdap','rsacode','securitytoken','orgnum','cellonfocus','eid','numrows','onsaved','onbegin'],
    ['registerd','2',securitytoken, orgnum,'',eid,'1','',''],
    'register');
} 
function makeiframe()
{
    var c = document.getElementById('container');
    if (c == null)
    {
        var t = document.getElementById("news").parentNode.parentNode;
        if (t.tagName.toLowerCase() != 'table') t= t.parentNode;
        var r = t.insertRow(2);
        var c = r.insertCell(-1);
        c.id = "container";
        c.align="center";
        c.colSpan = "2";
        c.style.padding = "0px 0px 0px 6px";
        c.innerHTML ="<iframe name=register id=regis width=790 scrolling=no height=400 frameborder=0 />"; 
    }
    else
    { 
        var z = document.getElementById('regis');
        z.parentNode.parentNode.height = 550;
        z.style.visibility = 'visible';
        z.style.width  = '790px';
        z.style.height = '400px';
        
    }
     
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
    dv.style.cssText = "background-color:" + IBGCOLOR +";color:white;width:100px;position:absolute;top:" + xy[1] + "px;left:" + (xy[0]-20) 
    +"px;border:1px #666666 solid";
    dv.innerHTML = str;
    document.body.appendChild(dv);
}
 
function choosethislang(td, encoding, encoding0,i)
{
        var newnum = (i*65536) + ORGNUM;
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
 
var containerWidth,containerHeight, regisheight=700;
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
function chgfont(sel)
{
    localStorage['myfontname'] = sel.options[sel.selectedIndex].value; 
    unifonts(document.body, sel.options[sel.selectedIndex].value);
}
 
var myfontname = localStorage['myfontname'];
var ftsel = document.getElementById("fontfamily");
if (ftsel!=null && myfontname!=null)
{
    for (var j=0; j < 3; j++) 
    if (ftsel.options[j].value == myfontname) ftsel.selectedIndex = j;
}
 
function biggerqrcode(x)
{
    
    var y = "Qrlink?url=" + Msg.hex(orgurl)+ (typeof(userid)!='undefined'&& userid==null?'&nlg=1':'');
    var xy = findPositionnoScrolling(x);
    myprompt("<img src=\"" + y + "\" onerror=makeaqrcode() onclick=makeaqrcode()>",null,null,orgurl);
    promptwin.style.zIndex = 52;
}
function makeaqrcode()
{
    document.location.href = "index.jsp?qrcode";
}

function getTimeroom()
{
   if ( timeslots == null) return null;
   var x = [];
   for (var j=0; j < timeslots.length; j++)
       x[x.length] = [timeslots[j], rooms[j]];
   return x;
    
}
 
indexwindow = window;
function getindexwindow()
{
    return window;
}
gomenu0 = function(){return true;}

function others()
{
    open("newschool.jsp?nowunit=","w" + tstmp);
}
var allunits ;
function showunitchoice(str)
{
    allunits = (new CSVParse(str, '|', ",", ";")).nextMatrix();
    var str = "";
    for (var j=0; j < allunits.length && j < 20; j++)
    {
        if (allunits[j]!=null && allunits[j].length>1)
        {
            str +="<nobr>" +  " <a href=javascript:switchto(" + allunits[j][0] + ")>" + allunits[j][0] + "." + allunits[j][1].replace(/\/.*/,"") + "</a></nobr><br>";
        }
    }
    str += " ......<br>";
    str = "<table><tr><td colspan=4>" + str + "</td></tr><tr><td valign=middle><nobr>"+ textmsg[1423] +  "</nobr></td><td  valign=middle>&supe;</td><td  valign=middle><input name=unitname onchange=instantsearch(this) style=\"border:1px #606060 solid\"></td><td><input type=button class=GreenButton style=width:70px value=\"" + msg560  + "\"></td></tr></table> <div  style=\"border:1px #a0a0a0 solid;border-radius:3px\" id=unitchoices></div>";
    myprompt(str, null,null,msg1130);//textmsg[1634]);
} 
 
function newunit(x,err)
{
    var str  = "<form rel=opener name=f4 method=post action=newschool.jsp onsubmit=\"return goodname(this)\" target=\"w" + tstmp + "\"  ><table>";
    if (err!=null)
        str += "<tr><td colspan=3 id=proerr>" + msg1464 + "</td></tr>";
    else 
       str += "<tr><td colspan=3 id=proerr>" + textmsg[1832] + "</td></tr>"; 
    str += "<tr><td align=right style=\"padding:0px 0px 0px 15px\">" + 
 "<img src=\"patchca.png\" alt=\"" + msg1463 + "\"  style=\"cursor:pointer;vertical-align:text-bottom;height:22px;line-height:22px;\" onclick=\"this.src=this.src+'?'+Math.random();\">" 
 + "</td><td  >&nbsp;" + textmsg[1585] + "&nbsp;</td>"
 + "<td align=left ><input id=patchcaid type=text name=patchcafield    style=\"border:1px #b0b0b0 solid !important;width:70px;font-size:16px\" ></td>"
 + "</tr><tr><td colspan=3>" + textmsg[1829] + "</td></tr>"
 + "</tr><tr><td colspan=3><input name=nowunit style=\"border:1px #b0b0b0 solid !important;width:310px;font-size:16px\" value=\"" + x + "\"></td></tr>";
    str += "<tr><td colspan=3 align=center><input type=submit name=sub class=GreenButton style=width:78px value=\"" + textmsg[61] + "\"><input type=reset name=ret class=OrangeButton style=\"width:78px\" value=\"" + msg192 + "\"></td></tr></table></form>";
    myprompt(str,null,null, textmsg[114] + " " + msg1130);
    promptwin.style.width = '320px';
}

 
function goodname(f)
{
    var v = f.nowunit.value;
   
    for (var j=0; j < allunits.length; j++)
    {
        if (allunits[j]!=null && allunits[j].length>1 && allunits[j][1].replace("/.*","")==v)
        {
            break;  
        }
    }
    
    if ( j < allunits.length) 
    {
        switchto( allunits[j][0]);
        return false;
    }
    else
    {
        document.getElementById('proerr').innerHTML = ('<table><tr><td align=center><img width=30 src=image/progress.gif></td><td><img  width=30 src=image/progress.gif></td><td><img  width=30 src=image/progress.gif></td></tr></table>');
        return true;
    }
}
function instantsearch(txt)
{
    var str = "";
    for (var j=0; j < allunits.length; j++)
    {
        if (allunits[j]!=null && allunits[j].length>1 && allunits[j][1].indexOf(txt.value)>=0)
        {
            str +=  "<a href=javascript:switchto(" + allunits[j][0] + ")>" + allunits[j][1].replace(/\/.*/,"") + "</a><br>";
        }
    }
    if(str != '') 
        str = "<center><input type=button class=OrangeButton onclick=\"newunit('" + txt.value + "')\" style=width:70px value=\""+ textmsg[114] + "\" ></center> <br>" + str;
    else
        str = textmsg[1831] + "<br><center><input type=button class=OrangeButton onclick=\"newunit('" + txt.value + "')\" style=width:70px value=\""+ textmsg[114] + "\" ></center>";
    document.getElementById('unitchoices').innerHTML = str;
       
}
function switchto1(k)
{
    var newnum = orgnum - (orgnum%65536) + k;
    SetCookie("orgnum", ""+newnum);
    document.location.href='index.jsp?eid=!&orgnum=' + newnum;
}

function switchto(k)
{
    var newnum = orgnum - (orgnum%65536) + k;
    SetCookie("orgnum", ""+newnum);
        
    if (typeof(eid)=='undefined' || eid==null)
        document.location.href='index.jsp' ;
    else
        document.location.href='index.jsp?eid=' + eid; 
}
function enterenames(i)
{
    var orgnum1 = ((i*65536) + (orgnum%65536));
    SetCookie("orgnum", ""+ orgnum1);
    document.getElementById('langname').src = 'newschool.jsp?nowunit=@&orgnum=' + orgnum1;
}
var onloadbeforeindex0 = null; 
if (typeof(window.onload)!='undefined' && window.onload !=null)
{
    onloadbeforeindex0 = window.onload;
}
    window.onload = function()
    {
       if (onloadbeforeindex0!=null)  onloadbeforeindex0();
        stars();  
        fillform();
    }
 

function readall(z,i,l)
{
    var t=document.getElementById('t'+ z + '_' + i);
    var y = t.innerHTML;
    var j = y.indexOf('t:readall('); 
    
    var k = j;
    while (y.charAt(j)!='<')j--;
   
    k = y.indexOf('</a',k);
     
    k += 8;
    var anchor = y.substring(j,k);
    t.innerHTML = y.substring(0,j) + y.substring(k, k+l) + "<a href=javascript:shrink("+z + "," + i + "," + j + "," + l + ")>&lt;&lt;&lt;</a>";
}
function shrink(z,i,j,l)
{
    var t=document.getElementById('t'+ z + '_' + i);
    var y = t.innerHTML;
    t.innerHTML = y.substring(0,j) + "<a href=\"javascript:readall(" + z + "," + i + "," + l + ")\">&gt;&gt;&gt;</a><!--"
    + y.substring(j,j+l) + "-->";
}

