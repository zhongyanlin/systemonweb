if (document.location.toString().indexOf("localhost") >= 0
        && typeof (handleErr) == 'undefined')
{
    function handleErr(msg, url, l)
    {
        var txt = "There was an error on this page.\n\n"
                + "Error: " + msg + "\n"
                + "URL:   " + url + "\n"
                + "Line:  " + l + "\n\n"
                + "Click OK to continue.\n\n";
        myprompt(txt);

        window.onerror = handleErr;
        return true;
    }
    window.onerror = handleErr;
}
if (typeof (expiretime) == 'undefined')
{
    var expiretime = (new Date()).getTime() + 3600000;
    var activeidletime = 3600000;
}
//shapearr[i]=[words,shapename,x,y,width,height,fontsize,color]
//linearr[i]=[type,startobjnum,xonobj, yonobj, endobjnum, xonobj,yonobj,thick,direction]
var shapes = ["rightrect", "roundrect", "ellipse", "diamond"];
var arrows = ["arrow", "arrom", "diamond", "line"];
var COLORS = ["black", "red", "green", "orange", "blue", "purple", "pink", "#BBBB00"];
var BCOLORS = ["white", "red", "green", "orange", "blue", "purple", "pink", "transparent"];
if (typeof (colors) == 'undefined')
{
    var colors = ["black", "red", "green", "orange", "blue", "purple", "pink", "#BBBB00"];
    var bcolors = ["white", "red", "green", "orange", "blue", "purple", "pink", "transparent"];
} else
{
    bcolors[bcolors.length - 1] = 'transparent';
}
var allfonts = [15, 20, 25, 30, 35, 40, 45, 50];
var fillblank = "<!---->";
var diamondchar = "&loz;";
var horarrowchar = "&rarr;";
var uparrowchar = "&uarr;";
var bullchar = "&bull;";
var diamschar = "&diams;";
var linetype = '';
var state = 0;
var numShapes = 0;
var allShapes = new Array();
var savestart = 0;
var savestartx = 0;
var savestarty = 0;
var numLines = 0;
var allLines = new Array();
var currentlnum = 0;
var myHintx = 0;
var myHinty = 0;
var cord;
var folder = null;
var locationstr = '';
var whichact = '';
var textareatobesearch = null;
var playstate = 'playstop';
var urlas = '';
var numbeing = 0;
var activesave = false;
var maxn = 100;
var hasone = null;
var numsselected = [];
var cdbeing = -1;
var tdaredoing;
var numaredoing = [];
var itemaredoing;
var bgcolorcode = -1;
if (typeof (originalurl) == 'undefined')
{
    var originalurl = '';
    var filename = null;
}
if (typeof (shapearr) == 'undefined')
{
    var shapearr = new Array();
    var linearr = new Array();
    var curvearr = new Array();
    var attacharr = new Array();
    var shapetime = new Array();
    var linetime = new Array();
    var curvetime = new Array();
    var pagetime = new Array();
}
if (typeof (editable) == 'undefined')
{
    var editable = true;
}
if (typeof (tstmp) == 'undefined')
{
    var tstmp = (new Date()).getTime() % 10000000;
}

var iframename = "w" + tstmp;

var seldirect = 0;
var onmouseover0 = null;
var pagenum = 0;
var favorx = 5;
var mfavory = 0;
var favory = 50;
var favorw = 400;
var favorh = 200;
var deletepage = 0;
var beingloadnum;
var selectend;
var selectstart = 0;
var entered = new Array();
var otherunique = null;

var ppos = 0;
var tobeparsed = '';
var tempsstr;
var templstr;
var pgn = 0;
var hassaved = true;

var tnamebeing = '';
var toolbarxy = 0;
var sentline = false;
var drawstate = 0;
var drawpoints = null;
var drawpointslength = 0;
var numCurves = 0;
var allCurves = new Array();
var searches = document.location.search.replace(/^\?/, '').split(/&/);
var dobackground = false;
var minutes = "";
var sessionid = null;
var toolnames = "";
var cachedshapenum;
var cachedshapename = "rightrect";
var cachedlinecolor = 0;
var cachedcurvecolor = 0;
var cachedianum = 0;
var cachedcd = 0;
var cachedfc = 0;
if (typeof (cachedfontfamily) == 'undefined')
    var cachedfontfamily = textmsg[1594].replace(/@.*/, '');
if (typeof (onlinetoolinitial) == 'undefined' || onlinetoolinitial == null)
{
    onlinetoolinitial = ";LaTex;web;LaTex toolbar;LaTex;" + originalurl + "/findrep.js;showlatexpanel(content_a,this);";
}
onlinetoolinitial += textmsg[16] + ";web;Configuration;Configure;;openconfigtool();";
var onlinetoolinfo = onlinetoolinitial;

function samefont(x, y)
{
    if (x == null || y == null)
        return false;
    y = y.toLowerCase();
    var ans = false;
    var xs = x.toLowerCase().split(/[ ]*,[ ]*/);
    for (var i = 0; i < xs.length; i++)
        if (y.indexOf(xs[i]) >= 0)
        {
            ans = true;
            break;
        }

    return ans;
}
function openconfigtool()
{
    onlinetoolinfo = onlinetoolinfo.replace(/^;/, '');
    var xs = onlinetoolinfo.split(/;/);
    var s = '@';

    for (var i = 0; i < xs.length; i++)
        if (i % 6 == 3)
            s += xs[i] + '@';
    myprompt('<iframe src="remote.jsp?schedule=' + s + '" width=700 height=600 />', null, null, textmsg[16] + textmsg[1776]);

}
function setTool(n, y)
{
    var j;
    if (y.charAt(0) == ';')
        y = y.substring(1);
    if ((j = onlinetoolinfo.indexOf(y)) >= 0)
    {

        onlinetoolinfo = onlinetoolinfo.substring(0, j) + onlinetoolinfo.substring(j + y.length);

    } else
    {
        onlinetoolinfo += y;

    }
    if (onlinetoolinfo.charAt(0) != ';')
        onlinetoolinfo = ';' + onlinetoolinfo;

    onlinetoolinitial = onlinetoolinfo;
    var ss = onlinetoolstr(onlinetoolinfo);

    onlinetoolbase.innerHTML = ss;
}

if (typeof (passedencoding) == 'undefined')
{
    var passedencoding = '';
    var passedfilename = '';
    var passedsessionid = '';
    for (var j2 = 0; j2 < searches.length; j2++)
        if (searches[j2].indexOf('fn=') == 0)
            passedfilename = searches[j2].substring(3);
        else if (searches[j2].indexOf('en=') == 0)
            passedencoding = searches[j2].substring(3);
        else if (searches[j2].indexOf('sn=') == 0)
            passedsessionid = searches[j2].substring(3);
}

var chatsessionnum = (passedsessionid == null || passedsessionid == '' || isNaN(passedsessionid)) ? -1 : parseInt(passedsessionid);


if ($('mainmeta') && passedencoding != '')
{
    $('mainmeta').content = 'text/html; charset=' + passedencoding;
}
function tohex(s)
{
    var i = parseInt(s);
    var y = Number(i).toString(16);
    if (y.length == 1)
        y = '0' + y;
    return y.toLowerCase();
}
function hexcolor(cl)
{
    if (cl == null || cl == '' || cl.toLowerCase() == 'transparent')
        return 'transparent';
    if ((cl + '').toLowerCase().indexOf('rgb') >= 0)
    {
        var x = ('' + cl).replace(/rgb/, '').replace(/\(/, '').replace(/\)/, '').split(/,/);
        return  '#' + tohex(x[0]) + tohex(x[1]) + tohex(x[2]);
    }
    cl = cl.toUpperCase();
    if (cl == "WHITE")
        cl = "#FFFFFF";
    else if (cl == "SILVER")
        cl = "#C0C0C0";
    else if (cl == "GRAY")
        cl = "#808080";
    else if (cl == "BLACK")
        cl = "#000000";
    else if (cl == "RED")
        cl = "#FF0000";
    else if (cl == "MAROON")
        cl = "#800000";
    else if (cl == "YELLOW")
        cl = "#FFFF00";
    else if (cl == "OLIVE")
        cl = "#808000";
    else if (cl == "LIME")
        cl = "#00FF00";
    else if (cl == "GREEN")
        cl = "#008000";
    else if (cl == "AQUA")
        cl = "#00FFFF";
    else if (cl == "TEAL")
        cl = "#008080";
    else if (cl == "BLUE")
        cl = "#0000FF";
    else if (cl == "NAVY")
        cl = "#000080";
    else if (cl == "FUCHSIA")
        cl = "#FF00FF";
    else if (cl == "PURPLE")
        cl = "#800080";
    else if (cl == 'PINK')
        cl = '#FFC0CB';
    else if (cl == 'ORANGE')
        cl = '#FFA500';
    else if (cl == 'CYAN')
        cl = '#00FFFF';
    if (cl.replace(/#[0-9|a-z][0-9|a-z][0-9|a-z][0-9|a-z][0-9|a-z][0-9|a-z]/i, '') != '')
        return 'transparent';
    return cl.toLowerCase();
}
function samecolor(x, y)
{
    return hexcolor(x) == hexcolor(y);
}

function gradient(cl)
{
    cl = hexcolor(cl);
    if (cl == 'transparent')
        return "url()";
    var r = parseInt(cl.substring(1, 3), 16);
    var g = parseInt(cl.substring(3, 5), 16);
    var b = parseInt(cl.substring(5), 16);
    if (r == 0)
        r = Math.round(Math.random() * 50);
    else {
        r -= Math.round(Math.random() * 0.34 * r);
        if (r < 0)
            r = 0;
    }
    var rs = Number(r).toString(16);
    if (r < 16)
        rs = '0' + rs;
    if (g == 0)
        g = Math.round(Math.random() * 50);
    else {
        g -= Math.round(Math.random() * 0.34 * g);
        if (g < 0)
            g = 0;
    }
    var gs = Number(g).toString(16);
    if (g < 16)
        gs = '0' + gs;
    if (b == 0)
        b = Math.round(Math.random() * 50);
    else {
        b -= Math.round(Math.random() * 0.30 * b);
        if (b < 0)
            b = 0;
    }
    var bs = Number(b).toString(16);
    if (b < 16)
        bs = '0' + bs;
    var c0 = "#" + rs + gs + bs;
    c0 = 'linear-gradient(' + c0 + " 10%," + cl + ")";

    return c0;
}
function findPositionnoScrolling(oElement, win)
{
    if (win == null)
        win = self;
    if (oElement == null)
        return [0, 0];
    if (typeof (oElement.offsetParent) != 'undefined')
    {
        var ii = 0;
        var originalElement = oElement;
        for (var posY = 0, posX = 0; ii++ < 10 && oElement != null; oElement = oElement.offsetParent)
        {
            posY += oElement.offsetTop;
            posX += oElement.offsetLeft;
            if (oElement != originalElement && oElement != win.document.body && oElement != win.document.documentElement)
            {
                posY -= oElement.scrollTop;
                posX -= oElement.scrollLeft;
            }
        }
        return  [posX, posY];
    } else
    {
        return  [oElement.x, oElement.y];
    }
}
function padd2(i)
{
    if (i > 9)
        return i;
    else
        return '0' + i;
}
function initfilename()
{
    locationstr = document.location.toString();
    var lj = locationstr.lastIndexOf("/");
    if (lj > 0)
    {
        var filenm = locationstr.substring(lj + 1);
        locationstr = locationstr.substring(0, lj);
        if (locationstr.indexOf("http") == 0 && filenm.indexOf("umltool.html") == 0)
        {
            originalurl = locationstr;
            filename = passedfilename;
        }
    }

    if ((filename == null || filename == '') && passedfilename != 'erd.html')
    {
        var d = new Date();
        filename = padd2(d.getYear() % 100) + padd2(d.getMonth()) + padd2(d.getDate()) + ".html";
    }

    if (window.opener != null
            && typeof (window.self) != 'undefined'
            && window.opener != window.self
            && window.opener != null
            && typeof (window.opener.getFolder) != 'undefined'
            )
    {
        folder = window.opener.getFolder();
        subdb = window.opener.getSubdb();
    } else if (parent != self && parent.frames[0] != self && typeof (parent.frames[0].getFolder) != 'undefined')
    {
        folder = parent.frames[0].getFolder();
        subdb = parent.frames[0].getSubdb();
    } else if (parent != self && parent.frames[0] != self && typeof (parent.fntobesaved) != 'undefined')
    {
        folder = "communication/chat";
        filename = parent.fntobesaved();
    }

}
var subdb = null;
function rcolor(x)
{
    var i = 0;
    for (; i < COLORS.length; i++)
        if (COLORS[i] == x)
            return i;
    return 0;
}
function rbcolor(x)
{
    var i = 0;
    for (; i < BCOLORS.length; i++)
        if (BCOLORS[i] == x)
            return i;
    return BCOLORS.length - 1;
}
function setcolor()
{

}
function insideobj()
{
    for (var i = 0; i < numShapes; i++)
        if (allShapes[i] != null && allShapes[i].inbase(myHintx, myHinty))
            return true;
    var m = $('m0_0');
    if (m == null)
        return false;
    var x = parseInt(m.style.left.replace(/px/, '')) - myHintx;
    var y = parseInt(m.style.top.replace(/px/, '')) - myHinty;
    var w = m.offsetWidth;
    var h = m.offsetHeight;
    return (x >= 0 && x <= w && y >= 0 && y <= h);
}

function saveable()
{
    return (opener != null && typeof (opener.helpsave) != 'undefined');
}
function setfolderfn(fd, fn)
{
    folder = fd;
    filename = fn;
}
function savesqlable()
{
    return (parent != self && typeof (parent.frames[0].savedef) != 'undefined');
}
function shrink(shapename)
{
    if (shapename == 'roundrect')
        return 0.85;
    if (shapename == 'ellipse')
        return  0.63;
    if (shapename == 'diamond')
        return  0.43;
    return 0.9;
}
function picname(s, d)
{
    if (s == "line")
        return  "-";
    else if (s == 'diamond')
        return  diamondchar;
    else if (s == 'arrom')
        return 'm';
    else if (d == 0)
        return horarrowchar;
    return '>';
}
function funsel(sel)
{
    var v = sel.options[sel.selectedIndex].value;
    if (v == 'uploadfile()')
        uploadfile();
    else if (v != '')
        eval(v);
    sel.selectedIndex = 0;
}
function dohtml()
{
    codes();

    canceldia(0, 0);

}
function clr()
{
    clearall1(1);
}
function exeplay(sel)
{
    if (sel.selectedIndex > 0)
    {
        var x = sel.options[sel.selectedIndex].value;

        eval(x);
        sel.selectedIndex = 0;
    }
}
function makebtns()
{
    document.write("<table id=toolbar  cellspacing=0 cellpadding=0 border=0 bgcolor=white align=center style=\"z-index:0\" ><tr height=22>");
    var palylabels = textmsg[1771].split(/@/);
    document.write("<td width=40 class=tdbutton id=tdplay><select style=\"width:40px;border:0px;background-color:white;visibility:" + (true ? 'visible' : 'hidden') + "  \" onchange=\"exeplay(this)\" id=\"selplay\">");
    document.write("<option value=\"\"  id=\"timebtn0\"  selected>" + palylabels[7] + "</option>");
    document.write("<option value=\"Play.schedule()\"  id=\"timebtn\" >" + textmsg[36] + "</option>");
    document.write("<option value=Play.start()>" + palylabels[0] + "</option>");
    document.write("<option value=Play.pause()>" + palylabels[1] + "</option>");
    document.write("<option value=Play.resume()>" + palylabels[2] + "</option>");
    document.write("<option value=Play.forward()>" + palylabels[3] + "</option>");
    document.write("<option value=Play.backward()>" + palylabels[4] + "</option>");
    document.write("<option value=Play.stop()>" + palylabels[5] + "</option>");
    document.write("<option value=Play.remote()>" + palylabels[6] + "</option>");
    document.write("</select></td>");
    if (editable == false)
    {
        document.write("<td id=\"tdpage\"><select style=\"border:0px;background-color:white \" onchange=changepage(this) id=\"selpage\">");
        for (var i = 0; i < Math.max(1, shapearr.length); i++)
        {
            document.write("<option value=" + i + ">P" + (i + 1) + "</option>");
        }
        document.write("<option value=\"-1\">" + textmsg[114] + "</option></select></td></tr></table>");

        return;
    } else if (editable)
    {

        document.write("<td  class=tdbutton valign=middle id=tdfile><select name=funname style=\"border:0px;background-color:white\" onchange=funsel(this)><option value=\"\" >" + textmsg[1651] + "</option>");
        if (filename != null)
        {
            document.write("<option value=\"saveit();activesave=true;\" id=\"saveit\">" + textmsg[67] + "</option>");
        }
        document.write("<option value=\"saveas()\" id=\"saveit\">" + textmsg[797] + "</option>");
        if (chatsessionnum == -1)
        {
            document.write("<option value=\"uploadfile()\"  id=\"attachbtn\" >" + textmsg[294] + "</option>");
        }
        document.write("<option value=\"dohtml()\"  id=\"codes\">HTML</option>");
        document.write("<option value=\"clr()\"  id=\"clearbtn\" >" + textmsg[1663] + "</option>");

        document.write("</select></td>");
        if (chatsessionnum == -1)
        {
            document.write("<td width=" + (chatsessionnum == -1 ? 40 : 1) + " id=tdpage class=tdbutton  valign=middle ><select style=\"width:" + (chatsessionnum == -1 ? 40 : 1) + "px;border:0px;background-color:white;visibility:" + (chatsessionnum == -1 ? 'visible' : 'hidden') + "  \" onchange=changepage(this) id=\"selpage\">");
            for (i = 0; i < Math.max(1, shapearr.length); i++)
            {
                document.write("<option value=" + i + ">P" + (i + 1) + "</option>");
            }
            document.write("<option value=\"-1\">" + textmsg[114] + "</option></select></td>");

            document.write("<td width=1><form style=\"margin:0px 0px 0px 0px\" name=\"f\" method=\"post\" action=\"FileOperation\" >"
                    + "<input name=operation type=hidden value=save>"
                    + "<input name=filedir size=8 style=\"border:0px;background-color:white;\"  type=hidden  value=\"" + filename + "\"  >"
                    + "<input name=folder  type=hidden  >"
                    + "<input name=destination type=hidden ><td><input name=attach type=hidden></td></form></td>");
        }
        document.write("<td  class=tdbutton id=tdicon  width=40   align=center valign=middle ><div style=\"margin:3px 4px 3px 4px;width:32px;height:16px;border-radius:3px;border:1px #EEEEEE outset;text-align:center;vertical-align:middle;lineheight:16px\"  onclick=\"newshape()\">T</div></td>");

        if (chatsessionnum == -1)
        {
            document.write("<td  class=tdbutton id=tdclip width=35><img style=\"width:34px;height:25px\" src=\"" + originalurl + "/image/pic.png\" align=center onclick=\"ResizeUploaded.attachman(document.f.attach)\"></td>");
            document.write("<td><form name=ff1 style=\"margin:0px 0px 0px 0px\" method=post  enctype=\"multipart/form-data\" action=UploadFile" +
                    " target=\"" + iframename + "\"><input type=file size=1 style=\"width:1px;visibility:hidden\" name=localpath onchange=\"clickedhere(this);upload(document.ff1)\" " +
                    "><input type=hidden name=maximumsize value=10000000><input type=hidden name=dummy value=4000000>" +
                    "<input type=hidden name=securitytoken value=\"111111111\">" +
                    "<input type=hidden   name=allcourse value=\"\"><input type=hidden name=subdb value=\"" + subdb + "\"><input type=hidden name=subfolder value=\"chat\"><input type=hidden name=saveindir value=\"" + folder + "\"></form>" +
                    "</td>");
            ResizeUploaded.attachref = document.f.attach;
        }

        document.write("<td  width=40  class=tdbutton id=tdline align=center style=background-color:white;font-size:14px; valign=middle  onclick=\"select(this,0,0)\"><nobr>----></nobr></td>");
        document.write("<td  width=30  class=tdbutton id=tdcurve align=center valign=middle style=\"font-size:14px;background:#000 url(" + originalurl + "/image/curve.png) no-repeat;width:30px;height:20px \" onclick=\"selcurve(this,0)\">" + fillblank + "</td>");
        document.write("<td  width=30  class=tdbutton id=tdbg align=center valign=middle  style=font-size:14px;background-color:#ffffff onclick=\"startbg(this)\"><nobr>" + textmsg[1781].replace(/,.*/, '') + "</nobr></td>");

        document.write("<td  width=30  class=tdbutton id=tdbg1 align=center valign=middle  style=font-size:14px;background-color:#ffffff onclick=\"mdia(1,5)\"><nobr>" + textmsg[1786].replace(/@.*/, '') + "</nobr></td>");


        document.write("<td  width=50  class=tdbutton id=tdcord style=\"font-size:14px;vertical-align:middle\" valign=middle align=center onclick=movecord()></td>");
        if (document.createElement('input').webkitSpeech !== undefined)
            document.write("<td    class=tdbutton  valign=middle align=center><input id=voice style=\"font-size:14px;vertical-align:middle;border:1px #555555 solid;width:20px\" onfocus=voicefocus(this) onblur=voiceblur(this) x-webkit-speech></td>");

        document.write("</tr></table>");
        cord = $("tdcord");



        onmouseover0 = (browserstr.indexOf('MSIE') > -1) ?
                function ()
                {
                    myHintx = event.clientX + document.body.scrollLeft;
                    myHinty = event.clientY + document.body.scrollTop;
                    var ps = $('selplay');

                    if (drawstate == 2)
                    {
                        addp();
                    } else if (Play.handle == null || Play.current == 'resume')
                    {
                        cord.innerHTML = myHintx + "," + myHinty;
                    }
                }
        : function (e)
        {
            myHintx = e.pageX;
            myHinty = e.pageY;
            if (drawstate == 2)
            {
                addp();
            } else if (Play.handle == null || Play.current == 'resume')
            {
                cord.innerHTML = myHintx + "," + myHinty;
            }
        }
        document.onmousemove = onmouseover0;
    }

}

function $(id) {
    return document.getElementById(id);
}
function playcomm(str)
{
    if (str == playcommand)
        return;
    var j = str.indexOf(';');
    var x = str.substring(0, j);
    var p = (new CSVParse(str.substring(j + 1), "\"", ",", ";")).nextMatrix();
    for (var i = 0; i < p.length; i++)
    {
        var k = parseInt(p[i][0]);
        allShapes[k].start = parseInt(p[i][1]);
        allShapes[k].time = parseInt(p[i][2]);

    }
    eval(x);
}
var playcommand;
function sendObject(num, del)
{
    if (chatsessionnum > -1 && num == -2)
    {
        var x = '';
        for (var i = 0; i < numShapes; i++)
        {
            if (allShapes[i] != null)
            {
                x += ';' + i + ',' + allShapes[i].start + ',' + allShapes[i].time;
            }
        }
        playcommand = del + x;
        parent.sendObject(chatsessionnum, playcommand);
    } else if (chatsessionnum > -1 && num != null && num >= 0 && allShapes[num] != null && (allShapes[num].words != textmsg[1774] || del != null))
    {
        if (del == null)
        {
            var tt = num + " s" + allShapes[num].toString();
            parent.sendObject(chatsessionnum, tt);
        } else if (del == 'd')
        {
            parent.sendObject(chatsessionnum, num + " s");
        } else if (del == 'u')
        {
            parent.sendObject(chatsessionnum, "" + num);
        } else if (del == 'a')
        {
            parent.sendObject(chatsessionnum, "" + num + "a");
        } else if (del == 'h')
        {
            parent.sendObject(chatsessionnum, "" + num + "h");
        }

    }
}



function uploadfile()
{
    saveit();
    formnewaction(document.ff1, originalurl + "/UploadFile");
    document.ff1.localpath.click();

}
function startbg(td)
{
    if (numsselected != null)
        canceldia(numsselected[numsselected.length - 1], cdbeing);
    dobackground = !dobackground;
    if (dobackground)
        enabletd('tdcord');
    else
        enabletd(null, 1);
    td.style.backgroundColor = (dobackground) ? '#bbbbbb' : '#ffffff';

    var xs = textmsg[1781].split(/,/);
    td.innerHTML = '<nobr>' + ((dobackground) ? xs[1] : xs[0]) + '</nobr>';
    if (dobackground)
    {
        /*  myprompt(textmsg[1780]);
         promptwin.style.top = '0px';
         setTimeout(closeprompt,2000);*/
        mdia(0, 0);

        // document.onclick = winclick;
    } else
    {
        drawstate = 0;
        drawlinenumber = null;
        linetype = '';

        document.onclick = null;

    }

}
function voicefocus(t) {
    t.style.width = '200px';
}
function voiceblur(t) {
    t.style.width = '20px';
}
function addp()
{
    var x = $("c" + drawlinenumber + "_" + (allCurves[drawlinenumber].k - 1));
    if (x == null)
        return;
    if (drawpointslength > 1 && myHintx == drawpoints[drawpointslength - 1][0] && myHintx == drawpoints[drawpointslength - 2][0] && myHinty != drawpoints[drawpointslength - 1][1])
    {
        x.style.height = Math.abs(myHinty - drawpoints[drawpointslength - 2][1]) + 'px';
        drawpoints[drawpointslength - 1][1] = myHinty;
    } else if (drawpointslength > 1 && myHinty == drawpoints[drawpointslength - 1][1] && myHinty == drawpoints[drawpointslength - 2][1] && myHintx != drawpoints[drawpointslength - 1][0])
    {
        x.style.width = Math.abs(myHintx - drawpoints[drawpointslength - 2][0]) + 'px';
        drawpoints[drawpointslength - 1][0] = myHintx;
    } else if (myHintx != drawpoints[drawpointslength - 1][0] || myHinty != drawpoints[drawpointslength - 1][1])
    {
        drawpoints[drawpointslength] = [myHintx, myHinty];
        if (drawpointslength > 0)
            allCurves[drawlinenumber].draw(drawpointslength - 1);
        drawpointslength++;

    }
}

function preaction()
{
    //  $("clearbtn").text = textmsg[1663];
    hassaved = false;
}

function newshape()
{
    if (chatsessionnum > -1)
    {

        // parent.sendObject(chatsessionnum,'s');

    }


    var i = 0;//parseInt(td.name.replace(/[a-z]/g,''));
    preaction();
    var x = 10;
    var y = 100;

    if (numediting > -1)
    {
        x = allShapes[numediting].x + 110;
        y = allShapes[numediting].y;
    }

    var xy = [0, 5];
    if (typeof (findPositionnoScrolling) != 'undefined')
        xy = findPositionnoScrolling($("toolbar"));
    if (y < xy[1])
        y = xy[1] + 40;
    document.onmousemove = onmouseover0;

    $('tdicon').style.backgroundColor = '#cccccc';
    new Shape(null, textmsg[1774], '', cachedshapename, x, y, 250, 150, parseInt(cachedfontsize.replace(/px/i, '')), cachedcolor, cachedbgcolor, cachedfc, 0, null, null);
    if (numediting == -1)
    {
        action(allShapes[numShapes - 1].div);
    }
}
var drawlinetypei, drawlinenumber = null;

function enabletd(str, b)
{
    if (str != null)
        str = "," + str + ",";
    var tds = ['tdfile', 'tdplay', 'tdpage', 'tdclip', 'tdfont', 'tdline', 'tdcurve', 'tdbg', 'tdcord', 'tdicon'];
    for (var i = 0; i < tds.length; i++)
    {
        var x = $(tds[i]);
        if (x == null) {
            continue
        }

        if (str != null && str.indexOf(tds[i]) >= 0 && b == null || str == null && b != null)
        {
            x.style.visibility = 'visible';
            if (tds[i] == 'tdpage' || tds[i] == 'tdplay')
                $(tds[i].replace(/td/, 'sel')).style.visibility = 'visible';
        } else
        {
            x.style.visibility = 'hidden';
            if (tds[i] == 'tdpage' || tds[i] == 'tdplay')
                $(tds[i].replace(/td/, 'sel')).style.visibility = 'hidden';
        }
    }
}
function selcurve(td, i)
{
    if (td.innerHTML !== fillblank)
    {
        var t = $('drawdonebtn');
        if (t != null)
            t.onclick();
        td.style.backgroundImage = "url(" + originalurl + "/image/curve.png)";
        td.innerHTML = fillblank;
        enabletd(null, 1);
        drawstate = 0;
        drawlinenumber = null;
        linetype = '';
        document.onclick = null;
        return;
    }
    document.onclick = winclick;
    td.style.backgroundImage = null;
    td.style.backgroundColor = '#bbbbbb';
    td.innerHTML = '<nobr>' + textmsg[1781].replace(/.*,/, '') + '</nobr>';
    enabletd(td.id + ',tdcord');

    myprompt(textmsg[1783]);

    promptwin.style.top = '0px';
    setTimeout(closeprompt1, 2000);
    drawlinetypei = i;
    if (chatsessionnum > -1)
    {
        parent.sendObject(chatsessionnum, 'c');
        return;
    }

    if (i == 0)
    {
        linetype = 'mline';
        drawstate = 3;
    } else
    {
        lintype = 'curve';
        drawstate = 1;
    }
    if (drawlinenumber == null)
    {
        drawlinenumber = numCurves;
    }
    preaction();


}

function drawmode()
{

}
function select(td, i, j)
{
    if (numShapes < 1)
        return;
    if (state > 0)
    {
        state = 0;
        enabletd(null, 1);
        var x = $("q" + savestart);
        if (x != null)
            document.body.removeChild(x);
        linetype = '';

        drawlinenumber = null;

        td.style.backgroundColor = '#ffffff';
        td.innerHTML = "<nobr>----></nobr>";
        document.onclick = null;
        return;
    }
    document.onclick = winclick;
    td.innerHTML = '<nobr>' + textmsg[1781].replace(/.*,/, '') + '</nobr>';
    myprompt(textmsg[1782]);
    promptwin.style.top = '0px';

    setTimeout(closeprompt1, 2000);
    enabletd('tdline,tdcord');

    drawlinetypei = i;
    seldirect = j;
    if (chatsessionnum > -1)
    {
        parent.sendObject(chatsessionnum, 'l');
        return;
    }
    preaction();
    linetype = arrows[i];
    state = 1;

    td.style.backgroundColor = '#cccccc';

}
function parsestr(s)
{

    if (s == null)
        return false;
    var st = 0;
    var j = 0;
    s = s.replace(/\r/g, '');
    while (j < s.length && (s.charAt(j) == ' ' || s.charAt(j) == '\n' || s.charAt(j) == "\r"))
        j++;

    var z = "";
    tempsstr = new Array();
    templstr = new Array();
    var isShape = true;
    for (var i = 0; i < s.length; i++)
    {
        if (s.charAt(i) == "'" && (i == 0 || s.charAt(i - 1) != '\\'))
            st = 1 - st;

        if (st == 0)
        {
            if (i > 10 && (s.charCodeAt(i) == 10 || s.charAt(i) == '\r' || s.charAt(i) == '\n' || i == s.length - 1))
            {
                var k = i;
                if (i == s.length - 1)
                    k = s.length;

                while (k >= 1 && s.charAt(k - 1) == ' ')
                {
                    k--;
                }
                var one = s.substring(j, k);

                if (one.length > 2 && isShape && one.charAt(0) == "'")
                {
                    tempsstr[tempsstr.length] = one;
                } else if (isShape == false && one.length > 10 && one.charAt(0) == "'")
                {
                    templstr[templstr.length] = one;
                } else if (one.length <= 2)
                {
                    isShape = false;
                }
                j = i + 1;
                while (j < s.length && (s.charAt(j) == ' ' || s.charAt(j) == '\n' || s.charAt(j) == "\r"))
                {
                    j++;

                }
                if (j == s.length)
                {
                    break;
                }
                z = '';
            } else if (s.charAt(i) != "'")
                z += s.charAt(i);
        } else
            z = '';
    }
    return tempsstr.length > 0 || templstr.length > 0;
}
function cachedone(needconfirm)
{
    var str = GetCookie("UMLtoolstr");

    if (str == null)
        return false;
    var stmpi = str.indexOf(" ");
    if (stmpi < 0)
        return false;
    var dstr = str.substring(0, stmpi);
    if (isNaN(dstr))
        return false;
    var d = parseInt(dstr);
    var j = str.indexOf(" ", 1 + stmpi);
    if (j < 0)
        return false;
    var fnstr = str.substring(stmpi + 1, j);
    if (fnstr != filename)
        return false;
    var pn = str.indexOf(" ", 1 + j);
    if (pn < 0)
        return false;
    var pstr = str.substring(j + 1, pn);
    if (isNaN(pstr))
        return false;
    pgn = parseInt(pstr);
    if (pgn > shapearr.length)
        return false;
    str = str.substring(pn + 1);
    var bb = parsestr(str);

    if (bb == false)
    {
        return false;
    }
    if (shapearr.length == 0)
    {
        usecached();
    } else if (needconfirm == true && typeof (tstmp) != 'undefined')
    {
        var tnow = (new Date()).getTime();
        tnow = tnow - (tnow % 10000000) + tstmp;
        var savedtime = (new Date(tnow)).toString();
        var cachedtime = (new Date(d)).toString();
        var compare = " > ";
        if (d < tnow)
            compare = ' < ';
        myprompt(textmsg[1652].replace(/#/, (pgn + 1)).replace(/#/, cachedtime).replace(/#/, compare)
                .replace(/#/, savedtime).replace(/#/, (pgn + 1)),
                null,
                "if(v)usecached()", textmsg[1633]);

    }
    return true;
}
function notcached(clearfirst)
{
    if (clearfirst)
        delall();
    if (pagenum < shapearr.length)
    {
        initial();
    }
}
function copy(a, num, b)
{
    if (num >= 0)
    {
        a[num] = new Array();
        for (var i = 0; i < b.length; i++)
        {
            a[num][i] = b[i];

        }
    } else
    {
        a = new Array(b.length);
        for (i = 0; i < b.length; i++)
        {
            a[i] = b[i];
        }
    }
}
function usecached()
{
    var psel = $("selpage");
    if (psel != null && pgn >= psel.options.length)
        return;
    if (pgn != pagenum)
        makeintostring();
    delall();
    pagenum = pgn;

    copy(shapearr, pgn, tempsstr);
    copy(linearr, pgn, templstr);
    copy(curvearr, pgn, templstr);
    initial();
    if (psel != null && psel.options[pgn].value == "-1")
    {
        psel.options[pgn] = new Option("P" + (pgn + 1), "" + pgn);
        psel.options[pgn + 1] = new Option(textmsg[114], "-1");
        psel.selectedIndex = pgn;
    }

}
function movecord()
{

    mdia(0, 3);
    document.onmousemove = onmouseover0;
}

HandleAttach.attaf2code = new Array();
function HandleAttach(atta)
{
    this.divs = "";
    this.maximagelet = 0;
    this.attachheader = '';
    this.goodopenurl = function (codepath, tail)
    {
        if (codepath.indexOf('http://') == 0 || codepath.indexOf('https://') == 0)
        {
            return codepath;
        } else
        {
            var st = "FileOperation?did=" + codepath;
            if (tail == null || tail == true)
                st = "&tcode=" + (new Date()).getTime() % 1000000000;
            return st;
        }
    }
    this.parseAttach = function (atta)
    {
        if (atta == null)
        {
            this.divs = "";
            this.maximagelet = 0;
            this.attachheader = '';
            return;
        }
        atta = atta.replace(/,$/, '');
        if (atta == '')
        {
            this.divs = "";
            this.maximagelet = 0;
            this.attachheader = '';
            var sid = $('style_' + pagenum);
            if (sid != null)
                document.getElementsByTagName('head')[0].removeChild(sid);
            return;
        }
        var z = (new CSVParse(atta, '\'', '@', ',')).nextMatrix(true);
        var at = '', q = '';
        var k = 0;
        var iis = '';

        for (var i = 0; i < z.length; i++)
        {
            if (z[i].length != 3 || this.courseonly != null && z[i][2].charAt(0) == '_')
                continue;
            if (z[i][0].replace(/[0-9]/g, "") == "" && z[i][2].replace(/[0-9]+/g, "") == "___")
            {
                var xx = HandleAttach.attaf2code[z[i][1]];
                if (xx == null)
                    continue;
                if (parseInt(z[i][0]) > this.maximagelet)
                {
                    this.maximagelet = parseInt(z[i][0]);
                }
                var ns = z[i][2].split(/_/);
                q += "div.imagelet" + z[i][0] + "_" + pagenum
                        + "\n{\nbackground-image:url("
                        + this.goodopenurl(xx, false) + ");\nbackground-position:-" + ns[0] + "px -" + ns[1] + "px;\nwidth:" + ns[2] + "px !important;\nheight:" + ns[3] + "px !important;\n}\n\n";
                k = at.indexOf('>' + z[i][1] + '<');
                if (k >= 0)
                {
                    at = at.substring(0, k).replace(/ <[^<]+$/, '') + at.substring(k + z[i][1].length + 8);
                }
            } else
            {

                var cd = HandleAttach.attaf2code[z[i][0]];
                if (cd == null)
                    HandleAttach.attaf2code[z[i][0]] = z[i][2];
                at += " <span style=color:blue;cursor:pointer onclick=\"openproper('" + z[i][2] + "','" + z[i][0] + "',this)\" >" + z[i][0] + "</span> ";
            }
        }
        this.divs = q;

        at = at.replace(/^[ ]+/g, '').replace(/[ ]+$/g, '');
        if (at.length > 1)
        {
            this.attachheader = at;
        }
        addcss2head(pagenum, this.divs);

    }

    this.merge = function (s)
    {
        var iis = "_" + pagenum;
        if (s == null)
            return '';
        return s.replace(new RegExp("\\[" + textmsg[1303] + "([0-9]+):1\\]", "ig"), "<table style=display:inline;float:left><tr><td><div  class=\"imagelet$1" + iis + "\"></div></td></tr></table>")
                .replace(new RegExp("\\[" + textmsg[1303] + "([0-9]+):2\\]", "ig"), "<table style=display:inline;float:right><tr><td><div class=\"imagelet$1" + iis + "\"></div></td></tr></table>")
                .replace(new RegExp("\\[" + textmsg[1303] + "([0-9]+)\\]", "ig"), "<table align=center><tr><td><div class=\"imagelet$1" + iis + "\"></div></td></tr></table>");
    }

}
var hw = new HandleAttach();

function changepage(sel)
{

    var v = $("m0_0");
    if (v != null)
        document.body.removeChild(v);
    preaction();
    var pn = parseInt(sel.options[sel.selectedIndex].value);
    makeintostring();
    delall();
    attacharr[pagenum] = document.f.attach.value;
    var sid = $('style1_' + pagenum);
    if (sid != null)
        document.getElementsByTagName('head')[0].removeChild(sid);
    if (pn == -1)
    {
        pagenum = sel.options.length - 1;
        sel.options[pagenum] = new Option("P" + (pagenum + 1), pagenum);
        sel.options[sel.options.length] = new Option(textmsg[114], "-1");
        sel.selectedIndex = pagenum;
    } else
    {
        pagenum = pn;
        initial();

    }
    document.f.attach.value = attacharr[pagenum] == null ? '' : attacharr[pagenum];

    allowmove(1);

}

function clearall(d)
{

    if (chatsessionnum == -1)
    {
        makeintostring();

        copy(tempsstr, -1, shapearr[pagenum]);
        copy(templstr, -1, linearr[pagenum]);
        copy(templstr, -1, curvearr[pagenum]);
    }
    for (var i = 0; i < numShapes; i++)
    {
        if (allShapes[i] != null && allShapes[i].inediting)
            return;
    }

    for (i = 0; i < numShapes; i++)
    {

        if (allShapes[i] != null)
        {
            allShapes[i].delme();
        }
    }

    for (i = 0; i < numLines; i++)
    {
        if (allLines[i] != null)
        {
            allLines[i].delme();
            allLines[i] = null;
        }
    }
    for (i = 0; i < numCurves; i++)
    {
        if (allCurves[i] != null)
        {
            allCurves[i].delme();
            allCurves[i] = null;
        }
    }
    numShapes = numLines = numCurves = 0;
    if (chatsessionnum > -1 && d == null)
    {
        parent.sendObject(chatsessionnum, 'd');
    }
}
function clearall1(btn)
{
    var psel = $("selpage");
    if (btn != null)
    {
        var str = "";
        if (chatsessionnum == -1)
        {
            if (pagenum <= psel.options.length - 1 && psel.options.length > 2)
                str = "<br><input type=checkbox id=\"promptcheck\" onclick=\"ifchecked(this)\">" + textmsg[1661];
        }
        myprompt((textmsg[1660] + str), null, "if(v)clearall2()", textmsg[1633]);

    } else
    {
        delall();
        if (deletepage == 1)
        {
            var i = shapearr.length - 1;
            for (; i > pagenum; i--)
            {
                shapearr[i] = shapearr[i - 1];
                linearr[i] = linearr[i - 1];
                curvearr[i] = curvearr[i - 1];
            }
            psel.options[psel.options.length - 1] = new Option('P' + psel.options.length, (psel.options.length - 1));
            psel.options[psel.options.length] = new Option(textmsg[114], "-1");
            psel.selectedIndex = pagenum;
        }

        // if (cachedone(false))
        if (tempsstr != null)
        {
            copy(shapearr, pagenum, tempsstr);
            copy(linearr, pagenum, templstr);
            copy(curvearr, pagenum, templstr);
            initial();
        }

        preaction();
    }
}
function ifchecked(td)
{
    deletepage = td.checked ? 1 : 0;
}
function undodel()
{

}
function clearall2()
{
    clearall();
    if (chatsessionnum > -1)
        return;
    //$("clearbtn").text = "Undo";
    if (deletepage == 1)
    {

        for (var i = pagenum; i < shapearr.length - 1 && shapearr[i + 1] != null; i++)
        {
            shapearr[i] = shapearr[i + 1];
            linearr[i] = linearr[i + 1];
            curvearr[i] = curvearr[i + 1];
        }
        shapearr[shapearr.length - 1] = null;
        linearr[linearr.length - 1] = null;
        curvearr[curvearr.length - 1] = null;

        if (pagenum > 0 && shapearr[pagenum] == null) {
            pagenum--;
        }
        initial();

        var psel = $("selpage");
        if (psel != null)
        {
            psel.options[psel.options.length - 1] = null;
            psel.options[psel.options.length - 1] = new Option(textmsg[114], "-1");
            psel.selectedIndex = pagenum;
        }
    }
}
function changethickall()
{
    var fs = Math.floor(getFontsize() / 10);
    for (var i = 0; i < numLines; i++)
        if (allLines[i] != null)
        {
            allLines[i].thick = fs;
            allLines[i].redraw();
        }
    for (i = 0; i < numCurves; i++)
        if (allCurves[i] != null)
        {
            allCurves[i].thick = fs;
            allCurves[i].redraw();
        }
}


function makeintostring(xy)
{

    var map = new Array(numShapes);
    var k = numShapes;
    if (typeof (curvearr) == 'undefined')
    {
        curvearr = new Array();
        for (var l = 0; l < shapearr.length; l++)
            curvearr[l] = new Array();
    }
    if (typeof (linearr) == 'undefined')
    {
        linearr = new Array();
        for (var l = 0; l < shapearr.length; l++)
            linearr[l] = new Array();
    }

    if (shapearr.length <= pagenum)
    {
        attacharr[pagenum] = new Array();
        shapearr[pagenum] = new Array();
        linearr[pagenum] = new Array();
        curvearr[pagenum] = new Array();
    }
    var i = 0;
    for (; i < k; i++)
    {
        var j = i;
        if (allShapes[i] == null)
        {
            while (k >= 1 && allShapes[k - 1] == null)
            {
                k--;
            }
            if (k <= i)
                break;
            j = k - 1;
            map[j] = i;
            k--;
        } else
            map[i] = i;
        shapearr[pagenum][i] = allShapes[j].toString().replace(/true$/, 'false');
        if (xy != null)
        {
            xy[i] = [allShapes[j].x, allShapes[j].y];
        }
    }
    for (; i < shapearr[pagenum].length; i++)
        shapearr[pagenum][i] = null;
    k = numLines;
    for (i = 0; i < k; i++)
    {
        j = i;
        if (allLines[i] == null)
        {
            while (k >= 1 && allLines[k - 1] == null)
            {
                k--;
            }
            if (k <= i)
                break;
            j = k - 1;
            k--;

        }
        linearr[pagenum][i] = allLines[j].toString(map);

    }
    for (; i < linearr[pagenum].length; i++)
        linearr[pagenum][i] = null;

    k = numCurves;

    for (i = 0; i < k; i++)
    {
        j = i;
        if (allCurves[i] == null)
        {
            while (k >= 1 && allCurves[k - 1] == null)
            {
                k--;
            }
            if (k <= i)
                break;
            j = k - 1;
            k--;

        }
        curvearr[pagenum][i] = allCurves[j].toString();

    }
    if (curvearr[pagenum] != null)
    {
        for (; i < curvearr[pagenum].length; i++)
        {
            curvearr[pagenum][i] = null;
        }
    }
}
function makefile()
{
    attacharr[pagenum] = document.f.attach.value;
    makeintostring();
    if (passedencoding == null || passedencoding == '')
    {
        passedencoding = 'utf-8';
        var headsec = document.getElementsByTagName('head')[0];
        var metas = headsec.getElementsByTagName('meta');
        for (var j = 0; j < metas.length; j++)
            if (metas[j].content && metas[j].content.toLowerCase().indexOf('charset'))
            {
                passedencoding = metas[j].content.replace(/^text.html;[ ]*charset=(.*)$/i, "$1");
                break;
            }
    }



    var ltxscrpt = $("ltxscrpt");
    var s = "<!DOCTYPE html>\n<html>\n<head>\n<meta id=mainmeta http-equiv=\"Content-Type\" content=\"text/html;charset=" + passedencoding + "\" >\n"
            + ltxscrpt.outerHTML.replace(/;executed=true/, '')
            //
            + "<style type=\"text/css\">.tlmmsty{border:0px black solid;font-style:normal;font-family:" + myfontname + ";vertical-align:top;text-align:center;padding:0px 0px 0px 0px}\n"
            + ".tlmmline{width:100%}\n.tlmvline{height:100%}\n"
            + ".tdbutton{border:1px #bbb solid;font-style:normal;font-family:arial;vertical-align:middle;text-align:center;padding:0px 0px 0px 0px;border-radius: 3px}\n"
            + ".samebg{background-color:white;color:black;font-size:20px;font-family:" + myfontname + "}\n"
            + "</style>\n\n"
            //+ "<link rel=stylesheet type=\"css/text\" href=\"" + originalurl + "/styleb" + (orgnum>>16) + ".css\" >\n"
            + "<!--link rel=styleSheet type=css/text href=mystyle.css-->\n\n</head>\n";

    var tx = getdocbg();
    var xx = ";background-image:url(" + tx + ")";
    var yy = document.body.style.backgroundImage;

    if (yy != null)
        yy = ";background-color:" + yy;
    else
        yy = '';

    s += "<body style=\"margin:0px 5px 0px 5px" + xx + yy + "\">\n<scr" + "ipt  type=\"text/javascript\" >\n"
    s += "/*1*/var orgnum=" + orgnum + ";\n"
    s += "/*1*/var originalurl='" + originalurl + "';\n";
    // s += "/*1*/$.ajax({type:'HEAD',url:'"   + originalurl +"',error:function(){originalurl=originalurl.replace(/\\/\\/[^\\/]+\\//,'//localhost/');}});\n";
    s += "/*1*/function changeserver(s){var x=document.location.toString();if (x.indexOf('http')!=0){return s;}var j=x.indexOf('/',8),k=s.indexOf('/',8);return x.substring(0,j)+s.substring(k);}\n"
    s += "/*1*/originalurl=changeserver(originalurl);var umltoolstyles = document.createElement('link');umltoolstyles.id='stylebnum';umltoolstyles.rel = 'stylesheet';umltoolstyles.type = 'text/css';umltoolstyles.media = 'screen';document.getElementsByTagName('head')[0].appendChild(umltoolstyles);\n";
    s += "/*1*/umltoolstyles.href =originalurl + '/styleb' + orgnum + '.css';\n";
    s += "/*1*/var cachedfontfamily='" + cachedfontfamily + "';\n";
    s += "/*1*/var colors='" + hexcolor(colors[0]);
    for (var j = 1; j < colors.length; j++)
        s += "," + hexcolor(colors[j]);
    s += "'.split(/,/);\n"
    s += "/*1*/var bcolors='" + hexcolor(bcolors[0]);
    for (var j = 1; j < bcolors.length; j++)
        s += "," + hexcolor(bcolors[j]);
    s += "'.split(/,/);\n"
    s += "/*1*/var filename='" + document.f.filedir.value + "';\n/*1*/var needtranslator = true;\n/*1*/var editable=true;\n/*1*/var tstmp="
            + ((new Date()).getTime() % 10000000) + ";\n/*1*/var shapearr=[];\n/*1*/var linearr=[];\n/*1*/var curvearr=[];\n/*1*/var attacharr=[];\n/*1*/var shapetime=[];\n/*1*/var linetime=[];\n/*1*/var curvetime=[];\n/*1*/var pagetime=[];";


    for (var n = 0; n < shapearr.length && shapearr[n] != null; n++)
    {
        var sd = '';
        for (var j = 0; j < shapearr[n].length; j++)
        {
            if (shapearr[n][j] != null)
            {
                if (sd != '')
                    sd += ',\n';
                sd += '"' + shapearr[n][j].replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r/g, '').replace(/\n/g, '\\n') + '"';
            }
        }

        s += "\n/*1*/shapearr[" + n + "] = [" + sd + "];\n/*1*/linearr[" + n + "] = [";
        sd = '';
        for (j = 0; j < linearr[n].length; j++)
        {
            if (linearr[n][j] != null) {
                if (sd != '')
                    sd += ',\n';
                sd += '"' + linearr[n][j] + '"';
            }
        }
        s += sd + "];\n/*1*/curvearr[" + n + "] = [";

        sd = '';
        if (curvearr[n] != null)
            for (j = 0; j < curvearr[n].length; j++)
            {
                if (curvearr[n][j] != null) {
                    if (sd != '')
                        sd += ',\n';
                    sd += '"' + curvearr[n][j] + '"';
                }
            }
        s += sd + "];";
        s += "\n/*1*/attacharr[" + n + "] = '" + ((attacharr[n] == null || attacharr[n] == 'undefined') ? '' : attacharr[n]) + "';";
    }
    s += "/*1*/var jsscripts = ['textmsgs.js','cookie.js','attachment.js','curve.js?sn=30&dn=20','findrep.js','installtool.js','umltool.js'];\n";
    s += "/*1*/for (var ii=0; ii < jsscripts.length; ii++)\n";
    s += "/*1*/document.write('<scrip'+'t  type=\"text/javascript\" src=\"'   + originalurl + '/' + jsscripts[ii] + '\"></scrip' + 't>');\n";
    s += "/*1*/</scrip" + "t>\n</body>\n</html>";
    // s +=  "\n</scrip" + "t>\n";
    return s;
}
function saveas()
{
    myprompt(textmsg[2], document.f.filedir.value.replace(/\\./, '1.'), "saveas1(v)");

}
function filexist(fn, len)
{
    if (len >= 0)
    {
        document.f.filedir.value = filename;
        myprompt(fn + textmsg[3] + "<br>" + textmsg[2], document.f.filedir.value.replace(/\\./, '1.'), "saveas1(v)");

    } else
    {
        filename = document.f.filedir.value;
        saveit();
    }
}

function saveas1(v)
{
    submitstring = "saveas1('" + v + "')";
    if ((new Date()).getTime() >= expiretime - 1000)
    {
        expiretime = activeidletime + (new Date()).getTime();
        open('alive.jsp?target=child', "w" + tstmp);
        return;
    }

    filename = document.f.filedir.value;
    document.f.target = iframename;
    document.f.operation.value = 'exist';
    formnewaction(document.f, originalurl + "/FileOperation");
    document.f.filedir.value = v;
    expiretime = activeidletime + (new Date()).getTime();
    visual(document.f);
    document.f.submit();
}
var submitstring = null;
resumehalted = function(sid)
{
    sessionid = sid;
    if (submitstring != null && submitstring != '')
        eval(submitstring);
}

function saveit()
{
    submitstring = "saveit()";
    if ((new Date()).getTime() >= expiretime - 1000)
    {
        expiretime = activeidletime + (new Date()).getTime();
        open('alive.jsp?target=child', "w" + tstmp);
        return;
    }
    expiretime = activeidletime + (new Date()).getTime();
    preaction();

    if (opener != null && opener.helpsave)
    {
        if ($("savearea") == null)
            opener.helpsave(window, document.f.filedir.value, (makefile()));
        else
            opener.helpsave(window, document.f.filedir.value, ($("savearea").value));
    } else if (parent != null && parent.helpsave && typeof (document.f) != 'undefined')
    {
        if ($("savearea") == null)
            parent.helpsave(window, document.f.filedir.value, (makefile()));
        else
            parent.helpsave(window, document.f.filedir.value, ($("savearea").value));
    } else if (typeof (document.f) != 'undefined')
    {
        document.f.folder.value = folder;
        document.f.destination.value = makefile();
        document.f.target = "w" + tstmp;
        document.f.operation.value = "save";
        formnewaction(document.f, originalurl + "/FileOperation");
        visual(document.f);
        document.f.submit();
    }

}

function codes()
{
    closeprompt();
    myprompt("<textarea id=\"savearea\" rows=20 cols=60></textarea><br><center><input type=button style=\"background-color:#BBBB00;width:120px;border:1px #b0b0b0 solid\" value=\"Delivery Version\" onclick=\"delivery()\" ></center>", null, null, filename + ": " + textmsg[532]);
    $("savearea").value = makefile().replace(/\n\/\*1\*\//g, '\n');

}
function delivery()
{
    closeprompt();
    var attr = "";
    var x = document.body.attributes;
    for (var i = 0; i < x.length; i++)
    {
        if (x[i].value != null && x[i].value != 'null' && x[i].value != '')
        {
            attr += x[i].name + "=\"" + x[i].value + "\" ";

        }
    }
    var s = "<!DOCTYPE html><html><head>" + document.getElementsByTagName("head")[0].innerHTML + "</head><body "
            + attr + ">";

    for (var j = 0; j < numShapes; j++)
    {
        var w = allShapes[j].base;

        attr = "";
        x = w.attributes;
        for (i = 0; i < x.length; i++)
        {
            if (x[i].value != null && x[i].value != 'null' && x[i].value != '' && x[i].name.indexOf("on") != 0)
            {
                attr += x[i].name + "=\"" + x[i].value + "\" ";
            }
        }

        s += "<DIV " + attr + ">" + w.innerHTML + "</DIV>\n\n\n";
        if (allShapes[j].isrect() == false)
        {
            w = allShapes[j].div;
            attr = "";
            x = w.attributes;
            for (i = 0; i < x.length; i++)
            {
                if (x[i].value != null && x[i].value != 'null' && x[i].value != '' && x[i].name.indexOf("on") != 0)
                {
                    attr += x[i].name + "=\"" + x[i].value + "\" ";
                }
            }
            s += "<DIV " + attr + ">" + w.innerHTML + "</DIV>\n\n\n";
        }
    }
    myprompt("<textarea id=\"savearea\" rows=20 cols=60></textarea><br><center><input type=button style=\"background-color:#bbbb00;width:120px;border:1px #b0b0b0 solid\" value=\"Editing Version\" onclick=\"codes()\" ></center>", null, null, textmsg[532]);
    $("savearea").value = s + "</body></html>";

}
function removescript(ss)
{
    var i = 0, j = -9;
    var a = '';
    var s = ss.toLowerCase();
    while ((i = s.indexOf("<script ", j + 9)) > 0)
    {
        a += ss.substring(j + 9, i);
        j = s.indexOf("</script>", i + 8);
    }
    a += ss.substring(j + 9);
    return a;
}
function renull(fn, len, furl, ltime)
{
    if (activesave)
    {
        filename = fn;
        myprompt(textmsg[1655]);
        promptwin.style.left = '10px';
        promptwin.style.top = '1px';
        setTimeout('closeprompt()', 1500);

    }
    hassaved = true;
    activesave = false;
}
function addedItem(fn, url, len, tm)
{
    ResizeUploaded.uploaded("web/" + url, fn + '@' + tm);
    return;
    closeprompt();
    var num = beingloadnum;
    var s = "<img alt=\"" + fn + "\" src=\"" + originalurl + "/FileOperation?did=" + url + "\" />";
    var b = $("t" + num);
    var t = $("e" + num);
    allShapes[num].words = t.value + s;
    document.body.removeChild(b);
    done(num);
    document.onmousemove = onmouseover0;
}
function syn(act, x, y)
{
    if (act.indexOf('web') == 0)
    {
        var fn = x.replace(/@.*/, '');
        var len = x.replace(/[^@]+@/, '');
        var url = act.substring(4);
        ResizeUploaded.uploaded(act, x);
        addedItem(fn, url, len);
    } else if (act == 'del')
    {
        if (x.replace(/[0-9|a-z]/ig, '').replace(/[\-|_|\.|\$]/g, '') == '')
            ResizeUploaded.refreshatt();
    } else if (isNaN(act))
    {
        document.f.filedir.value = filename;
    } else
    {

        if (whichact == 'sql')
        {
            if (parseInt(act) > 0)
            {
                //var nam = open("tables.jsp?tname="+tnamebeing);
                if (typeof (parent.frames[0]) != 'undefined')
                {
                    parent.frames[0].document.location.href = parent.frames[0].document.location.toString();
                }
                myprompt(textmsg[1656]);

            }
        }
    }

}
function winclick()
{
    if (myHinty < 30)
        return;
    if (insideobj())
        return;
    var arr = null;
    if (drawstate == 1)
    {
        drawpointslength = 1;
        drawpoints = [[myHintx, myHinty]];
        drawstate = 2;

        var k = Math.floor(getFontsize() / 10);
        new Curve(drawlinenumber, 'curve', k, null, 0, drawpoints);

    } else if (drawstate == 2)
    {

        linetype = '';
        drawstate = 0;
        if (chatsessionnum > -1)
        {
            parent.sendObject(chatsessionnum, drawlinenumber + " c" + allCurves[drawlinenumber].toString());
        }
        drawlinenumber = null;

    } else if (drawstate == 3)
    {
        drawpointslength = 1;
        drawpoints = [[myHintx, myHinty]];
        drawstate = 4;

        var adot = document.createElement("span");
        adot.id = "drawdonebtn";
        adot.style.cssText = "position:absolute;width:50px;left:" + (myHintx + 3)
                + "px;top:" + (myHinty + 3) + "px;border:1px #909090 solid;background-color:orange;text-align:center";
        adot.innerHTML = "End";
        document.body.appendChild(adot);
        Drag.init(adot);
        adot.onmouseover = function ()
        {
            this.style.left = (myHintx - 20) + 'px';
            this.style.top = (myHinty - 15) + 'px';
        }
        adot.onclick = function ()
        {
            if (chatsessionnum > -1)
            {
                parent.sendObject(chatsessionnum, drawlinenumber + " c" + allCurves[drawlinenumber].toString());
            }
            drawstate = 0;
            drawlinenumber = null;
            linetype = '';
            document.onclick = null;
            $('tdcurve').style.backgroundImage = "url(" + originalurl + "/image/curve.png)";
            $('tdcurve').innerHTML = fillblank;
            enabletd(null, 1);
            document.body.removeChild(adot);

        }


        new Curve(drawlinenumber, 'mline', Math.floor(getFontsize() / 10), null, 0, drawpoints);

    } else if (drawstate >= 4)
    {
        drawpoints[drawpointslength++] = [myHintx, myHinty];
        allCurves[drawlinenumber].draw(drawpointslength - 2);
        drawstate++;
        adot = $("drawdonebtn");
        adot.style.left = (myHintx + 3);
        adot.style.top = (myHinty + 3);
    } else if (state == 1)
    {
        savestart = -1;
        savestartx = myHintx;
        savestarty = myHinty;
        state = 2;
        //selectedlinetd.style.backgroundColor = '#999';
        // enabletd('tdcord');
        adot = document.createElement("div");
        adot.id = "q-1";
        adot.style.cssText = "position:absolute;width:6px;height:6px;left:" + (myHintx - 3)
                + "px;top:" + (myHinty - 3) + "px;border:1px #909090 solid;background-color:yellow";
        adot.innerHTML = fillblank;
        document.body.appendChild(adot);
    } else if (state == 2)
    {
        // Math.floor(getFontsize()/10);
        var l = new Line(drawlinenumber, linetype, savestart, savestartx, savestarty, -1, myHintx, myHinty, cachedlinethick, seldirect, 0, cachedlinecolor);
        drawlinenumber = null;

        //selectedlinetd.style.backgroundColor = '#fff';
        var x = $("q" + savestart);
        document.body.removeChild(x);
        //linetype = '';
        state = 1;
        enabletd('tdline,tdcord');
    } else if ((arr = closelineend()) != null)
    {
        var dv = document.createElement("div");
        dv.id = "f" + arr[2] + "_" + arr[3];
        dv.style.cssText = "position:absolute;z-index:10;width:6px;height:6px;background-color:yellow;border:1px #909090 solid;left:" + (arr[0] - 3) + "px;top:" +
                (arr[1] - 3) + "px;";
        document.body.appendChild(dv);
        Drag.init(dv);
        dv.onDragEnd = function (x, y)
        {
            var xs = this.id.substring(1).split(/_/);
            var i = parseInt(xs[0]);
            if (xs[1] == '0')
            {
                allLines[i].sx = x + 3;
                allLines[i].sy = y + 3;
            } else if (xs[1] == '1')
            {
                allLines[i].ex = x + 3;
                allLines[i].ey = y + 3;
            }
            allLines[i].redraw();
            document.body.removeChild(this);
        }
    } else if (dobackground && $("m0_0") == null)
    {
        var pg = $("tdbg");
        if (pg != null)
        {
            var xy = [0, 50];
            if (typeof (findPositionnoScrolling) != 'undefined')
                xy = findPositionnoScrolling(pg);
            if (!(myHintx < xy[0] + 100 && myHintx > xy[0] && myHinty < xy[1] + pg.offsetHeight + 5 && myHinty > xy[1]))
                mdia(0, 0);
        } else
            mdia(0, 0);
    }

    document.onmousemove = onmouseover0;
}
function closelineend()
{
    for (var i = 0; i < numLines; i++)
    {
        if (allLines[i] == null)
            continue;
        if (allLines[i].startnum == -1 && (myHintx - allLines[i].sx) * (myHintx - allLines[i].sx) + (myHinty - allLines[i].sy) * (myHinty - allLines[i].sy) < 25)
            return [allLines[i].sx, allLines[i].sy, i, 0];
        else if (allLines[i].endnum == -1 && (myHintx - allLines[i].ex) * (myHintx - allLines[i].ex) + (myHinty - allLines[i].ey) * (myHinty - allLines[i].ey) < 25)
            return [allLines[i].ex, allLines[i].ey, i, 1];

    }
    return null;

}
function divclick(dv)
{
    if (dv.id.charAt(0) == 'b')
        return;

    var num = parseInt(dv.id.substring(1));
    if ('' + num == 'NaN')
    {
        myprompt(dv.id + ' is num');

        return;
    }

    if (state == 0)
    {
        var tt = dv.innerHTML.replace(/^\s+/g, '').replace(/\s+$/, '').replace(/<[\/]?nobr>/gi, '');
        mdia(num, 1);
    } else
    {
        var bv = $("d" + dv.id.substring(1));
        begindraw(bv);
    }
    document.onmousemove = onmouseover0;
}

function islatex(s)
{
    return (s.indexOf("$") >= 0 || s.indexOf("\\begin{") >= 0);
}
function ishtml(s)
{
    s = s.toLowerCase();
    var k = 0;
    var r = RegExp(/<[a-z|0-9]+/);
    while (k < s.length - 4)
    {
        var m = r.exec(s.substring(k));
        if (m == null)
            return false;
        var z = m.toString();
        k += m.index + z.length;
        if (s.indexOf("</" + z + ">", k) > 0 || s.indexOf("/>", k) > 0)
            return true;
    }
    return false;
}
formatstr0 = function (v, fmt)
{

    if (!ishtml(v))
        v = formatnolx(v, colorbeing, fsbeing);
    return hw.merge(v);
}
var fsbeing;
var shapenamebeing = null;
var colorbeing = 'red';
function tohtml(v, cl, fs, shapename)
{
    fsbeing = fs;
    colorbeing = cl;
    shapenamebeing = shapename;
    var s = formatstr(v, 2);
    s = mergelink(s);
    return s;
}
function makemultmedia(link, X)
{
    var xs = X.split(/_/);
    if (xs[1] == null || xs[1] == '')
        xs[1] = '';
    if ((xs[0] == '2' || xs[0] == '3') && xs[1] == '')
        xs[1] = '500';
    if (xs[0] == '1')
    {
        if (xs[1] != '' && !isNaN(xs[1]) && parseInt(xs[1]) > 1)
            return '<img src="' + link + '" width=' + xs[1] + ">";
        return '<img src="' + link + '">';
    } else if (xs[0] == '2')
    {
        return '<iframe src="' + link + '" width=' + xs[1] + " height=" + xs[1] + ">";
    } else if (xs[0] == '3')
    {
        if (link.indexOf('.mp4') > 0)
            link = '<video  width=' + xs[1] + ' controls><source  src="' + link + '" type=video/mp4 /></video>';
        else if (link.indexOf('youtu') > 0)
            link = '<iframe src="' + link.replace(/watch\?v=/, 'embed/') + '" width=' + xs[1] + " height=" + Math.round(0.5625 * parseInt(xs[1])) + " style=border:0px >";
        return  link;
    } else if (xs[0] == '4')
    {
        link = '<embed src="' + link + '" width=200 height=25></embed>';

        return  link;
    } else if (xs[0] == '5')
    {
        return '<a href="' + link + '" target=_blank>' + link + '</a>';
    }
    return link;
}
function foldto(x, l)
{
    var y = '';
    var i = 0;
    while (true)
    {
        if (i + l < x.length)
        {
            y += x.substring(i, i + l) + '<br>';
        } else
        {
            y += x.substring(i, x.length);
            return y;
        }
        i += l;
    }
}
function mergelink(v)
{

    var urlass = urlas.split(/\|/);
    var x = '';
    var r = new RegExp(/[ |"|'|\]|\[|\(|\)|\{|\}|\n|\r|\t|<]/);
    var k = 0;
    var K = 0;
    var link;
    var z = '';
    var needp = ($('t' + numbeing) != null);
    urlas = '';
    while (k < v.length)
    {
        var j = v.indexOf('http://', k);
        if (j == -1)
            j = v.indexOf('https://', k);
        if (j == -1)
        {
            z += v.substring(k);
            break;
        }
        var q = urlass[K];
        if (urlas != '')
            urlas += '|';
        urlas += q;
        if (q == null)
            q = '';
        var w = asoption(K);
        var m = r.exec(v.substring(j));
        if (m == null)
            link = v.substring(j);
        else
            link = v.substring(j, m.index + j);
        if (j < 6 || v.substring(j - 6, j).toLowerCase().indexOf("src=") < 0 && v.substring(j - 6, j).toLowerCase().indexOf("href=") < 0)
        {
            if (needp)
            {
                var ll = w.replace(/<[^>]+>/g, "").length + 240;
                x += '<tr bgcolor=lightyellow><td>' + foldto(link, ll) + "</td></tr><tr><td  bgcolor=lightblue>" + w + "</td></tr><tr><td bgcolor=transparent></td></tr>";
            }
            var e = makemultmedia(link, q);
            z += v.substring(k, j) + e;
        }
        k = link.length + j;
        K++;
    }
    if (needp && x != '')
    {
        myprompt(textmsg[1777] + '<table cellspacing=0 cellpadding=3 style=\"margin:2px 2px 2px 2px;border:2px #999999 solid;border-radius:2px\">' + x + "</table>", null, null, textmsg[1634]);

    }

    return z;
}

function chooseurlas(K, i)
{
    var x = urlas.split(/\|/);
    var q = $('width' + K);
    q.style.visibility = (i < 4 ? 'visible' : 'hidden');
    var wv = '';
    if (i < 7)
    {
        var w = q.getElementsByTagName('table')[0].rows[0].cells[1].getElementsByTagName('input')[0];
        var wv = x[K];
        if (wv == null)
            wv = '';
        var j = wv.indexOf('_');
        if (j == -1)
            wv = '';
        else
            wv = wv.substring(j + 1);
        if ((i == 2 || i == 3))
        {
            if (wv == '' || isNaN(wv))
            {

                if (w.value == '' || isNaN(w.value) || parseInt(w.value) < 1)
                    wv = w.value = '500';
                else
                    wv = w.value;
            } else
            {
                if (w.value == '' || isNaN(w.value) || parseInt(w.value) < 1)
                    w.value = wv;
            }
        } else if (i == 1)
        {
            if (wv == '' || isNaN(wv))
            {
                if (w.value == '' || isNaN(w.value) || parseInt(w.value) < 1)
                    wv = w.value = '';
                else
                    wv = w.value;
            } else
            {
                if (w.value == '' || isNaN(w.value) || parseInt(w.value) < 1)
                    w.value = wv;
            }
        }

    }

    urlas = '';
    for (var j = 0; j < x.length; j++)
    {
        if (j > 0)
            urlas += "|";
        if (j != K)
            urlas += x[j];
        else
            urlas += i + (wv == '' ? '' : '_') + wv;
    }
    var t = allShapes[numbeing];
    t.urlas = urlas;
    t.inediting = false;
    sendObject(numbeing);
    if (typeof (LaTexHTML) != 'undefined')
        LaTexHTML.deformat(t.div);

    t.base.innerHTML = t.setup(t.width, t.height);
    t.div = $('d' + numbeing);
    t.init();
    if (typeof (LaTexHTML) != 'undefined')
    {
        LaTexHTML.formatele(t.div);
        if (!t.isrect())
            t.gooddim();
    }

}
function dourlaswidth(td, K)
{
    var x = urlas.split(/\|/);
    urlas = '';
    var wv = td.value;
    var z = x[K].split(/_/)[1];
    var p = x[K].split(/_/)[0];

    if (K == 2 || K == 3)
    {
        if (wv == '' || isNaN(wv))
            t.value = wv = (z == '' || z == null || isNaN(z)) ? '500' : z;
        else
            z = wv;
    } else if (K == 1)
    {
        if (wv == '' || isNaN(wv))
            t.value = wv = (z == null || z == '' || isNaN(z)) ? '' : z;
        else
            z = wv;
    }

    for (var i = 0; i < x.length; i++)
    {
        if (i > 0)
            urlas += "|";
        if (i != K)
            urlas += x[i];
        else
            urlas += p + (td.value == '' ? '' : '_') + td.value;
    }
    var t = allShapes[numbeing];
    t.urlas = urlas;
    t.inediting = false;
    sendObject(numbeing);
    if (typeof (LaTexHTML) != 'undefined')
        LaTexHTML.deformat(t.div);
    t.base.innerHTML = t.setup(t.width, t.height);

    t.div = $('d' + numbeing);
    t.init();
    if (typeof (LaTexHTML) != 'undefined')
    {
        LaTexHTML.formatele(t.div);
        if (!t.isrect())
            t.gooddim();
    }
}

function drawlinein(x0, y0, x1, y1, thick, color)
{
    var str = '<div style="';

    if (Math.abs(x1 - x0) > Math.abs(y1 - y0))
    {
        var width = Math.sqrt((y1 - y0) * (y1 - y0) + (x1 - x0) * (x1 - x0));
        var left = x0 + (x1 - x0) / 2 - width / 2 + thick / 2;
        var top = y0 + (y1 - y0) / 2;
        var height = thick;
        var deg = Math.atan2(y1 - y0, x1 - x0) * 180 / 3.14159265;
        str += 'position:relative;left:'
                + left + 'px;top:'
                + top + 'px;width:'
                + width + 'px;height:'
                + height + "px;background-color:" + color + ';-ms-transform: rotate(' + deg
                + 'deg);-webkit-transform: rotate(' + deg + 'deg);transform: rotate(' + deg + 'deg);padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;font-size:1px';

    } else //if (Math.abs(x1-x0) < Math.abs(y1-y0) )
    {
        var height = Math.sqrt((y1 - y0) * (y1 - y0) + (x1 - x0) * (x1 - x0));
        var left = x0 + (x1 - x0) / 2;
        var top = y0 + (y1 - y0) / 2 - height / 2 + thick / 2;
        var width = thick;
        var deg = -Math.atan2(x1 - x0, y1 - y0) * 180 / 3.14159265;
        str += 'position:relative;left:'
                + left + 'px;top:'
                + top + 'px;width:'
                + width + 'px;height:'
                + height + "px;background-color:" + color + ';-ms-transform: rotate(' + deg
                + 'deg);-webkit-transform: rotate(' + deg + 'deg);transform: rotate(' + deg + 'deg);padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;font-size:1px';

    }
    return str + '"><!--></div>';

}

function drawstright(x0, y0, x1, y1, thick, color, zx)
{
    var dv = document.createElement('div');
    var pos = 'absolute';

    if (Math.abs(x1 - x0) > Math.abs(y1 - y0))
    {
        var width = Math.sqrt((y1 - y0) * (y1 - y0) + (x1 - x0) * (x1 - x0));
        var left = x0 + (x1 - x0) / 2 - width / 2 + thick / 2;
        var top = y0 + (y1 - y0) / 2;
        var height = thick;
        var deg = Math.atan2(y1 - y0, x1 - x0) * 180 / 3.14159265;
        dv.style.cssText = 'position:absolute;left:'
                + left + 'px;top:'
                + top + 'px;width:'
                + width + 'px;height:'
                + height + "px;background-color:" + color + ';-ms-transform: rotate(' + deg
                + 'deg);-webkit-transform: rotate(' + deg + 'deg);transform: rotate(' + deg + 'deg);z-index:' + zx + ';padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;font-size:1px';
        document.body.appendChild(dv);
    } else //if (Math.abs(x1-x0) < Math.abs(y1-y0) )
    {
        var height = Math.sqrt((y1 - y0) * (y1 - y0) + (x1 - x0) * (x1 - x0));
        var left = x0 + (x1 - x0) / 2;
        var top = y0 + (y1 - y0) / 2 - height / 2 + thick / 2;
        var width = thick;
        var deg = -Math.atan2(x1 - x0, y1 - y0) * 180 / 3.14159265;
        dv.style.cssText = 'position:absolute;left:'
                + left + 'px;top:'
                + top + 'px;width:'
                + width + 'px;height:'
                + height + "px;background-color:" + color + ';-ms-transform: rotate(' + deg
                + 'deg);-webkit-transform: rotate(' + deg + 'deg);transform: rotate(' + deg + 'deg);z-index:' + zx + ';padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;';
        document.body.appendChild(dv);
    }
    return dv;
}

function asoption(K)
{
    var urlass = urlas.split(/\|/);
    var X = urlass[K];
    if (X == null || X == '')
        X = '6';
    var Y = X.split(/_/);
    if (Y[1] == null)
        Y[1] = '';
    var xs = textmsg[1775].split(/@/);
    var x = '<table border=0 cellspacing=0 cellpadding=0><tr height=22><td><nobr>' + xs[0] + "</nobr></td>";
    for (var i = 1; i < xs.length; i++)
    {
        var w = (Y[0] == '' + i);
        x += "<td><input onclick=\"chooseurlas(" + K + "," + i + ")\" name=opts" + K + " type=radio value=\"" + i + "\" " + (w ? 'checked' : '') + '></td><td><nobr>' + xs[i] + "</nobr></td><td width=15><div style=width:15px;height:20px></div></td>";
    }
    x += '<td  id=width' + K + ' style=visibility:' + (parseInt(Y[0]) < 4 ? 'visible' : 'hidden') + '><table cellspacing=0 cellpadding=0><tr  height=22><td><nobr>' + textmsg[733] + "</nobr></td><td><input type=text size=3 value=\"" + Y[1] + "\" onchange=dourlaswidth(this," + K + ")></td><td>px</td></tr></table></td></tr></table>";
    return x;
}

/*
 function tohtml1(v, cl, fs )
 {
 
 if (!ishtml(v))  v =  formatnolx(v,cl,fs );
 
 return hw.merge(v);
 }*/

function dotable(str, cl)
{
    var x = (new CSVParse(str, '"', "\t", "\r\n")).tohtml().replace(/border\-collapse:/, 'border:1px ' + cl + ' solid;border-collapse:').replace(/<td /g, '<td style=border-color:' + cl + ' ');

    return x;
}
if (typeof (formatnolx) == 'undefined')
    var formatnolx = null;

formatnolx = function (v, cl, fs)
{

    var j = v.indexOf("<img ");
    if (j == 0)
        return v;
    var j = v.indexOf("<iframe ");
    if (j == 0)
        return v;
    if (j < 0)
    {
        v = dotag(v, cl, fs);
        return v;
    }

    var y = v.substring(j);
    v = v.substring(0, j);
    v = dotag(v, cl, fs);
    j = v.lastIndexOf("<br>");
    if (j < 0 || j >= 0 && j < v.length - 5)
        return v + "<br>" + y;
    return v + y;
}
function dotag(v, cl, fs)
{
    var tag = ['oln', 'ola', 'ulb'];
    for (var i = 0; i < 3; i++)
    {
        var j = v.indexOf("<" + tag[i] + ">");

        if (j >= 0)
        {

            var k = v.indexOf("</" + tag[i] + ">", j);
            var x = v.substring(0, j);
            if (x.length > 0 && x.charAt(x.length - 1) != '\n')
                x += "\n";
            x = dotag(x, cl, fs);
            if (k >= 0)
            {
                var y = dotag1(v.substring(j + tag[i].length + 2, k), tag, i, cl, fs);
                return x + y + dotag(v.substring(k + tag[i].length + 3), cl, fs);
            }
            return x + dotag1(v.substring(j + tag[i].length + 2), tag, i, cl, fs);
        }
    }

    if (shapenamebeing == 'rightrect')
        v = v.replace(/\n[\r| ]*\n/g, "</nobr><br><div style=\"width:100%;height:2px;background-color:" + cl + "\"><!----></div><nobr>");

    var arr = v.split(/\n/);
    v = '';
    for (i = 0; i < arr.length; i++)
    {
        if (v != '')
            v += "<br>";
        v += "<nobr>" + arr[i] + "</nobr>";
    }
    return v;
}
function dotag1(v, tag, i, cl, fs)
{
    var arr = v.split("\n");
    var base = '1a';

    var s = '';
    var k = 0;
    for (var j = 0; j < arr.length; j++)
    {
        if (arr[j].length == 0)
        {
            s += '<br>';
            continue;
        } else if (arr[j].charAt(0) == ' ')
        {
            s += "<nobr>" + diamschar + arr[j].replace(/^\s+/, '') + "</nobr><br>";
        } else
        {
            var x = bullchar;

            if (i < 2)
                x = String.fromCharCode(base.charCodeAt(i) + k) + ".";
            s += "<nobr>" + x + arr[j] + "</nobr>";
            if (j < arr.length - 1)
                s += "<br>";
            k++;
        }
    }

    return s;
}
function uploadfile()
{
    saveit();
    document.ff1.localpath.click();
}
var freference;
function upload(f, num)
{
    freference = f;
    beingloadnum = num;
    submitstring = "upload(freference,beingloadnum)";
    if ((new Date()).getTime() >= expiretime - 1000)
    {
        expiretime = activeidletime + (new Date()).getTime();
        open('alive.jsp?target=child', "w" + tstmp);
        return;
    }
    expiretime = activeidletime + (new Date()).getTime();
    var xx;
    if (chatsessionnum > -1)
    {
        f.subdb.value = parent.subdb;
        f.subfolder.value = "chat";
        formnewaction(f, "UploadComm");
        f.subfolder.disabled = false;
        f.saveindir.disabled = true;
    } else
    {
        f.action = "UploadFile";
        f.saveindir.disabled = false;
        f.subfolder.disabled = true;
        xx = f.saveindir.value;
    }

    if (saveable())
    {
        f.saveindir.value = xx + "/image";
        f.target = iframename;
        visual(f);
        expiretime = activeidletime + (new Date()).getTime();
        f.submit();
        f.saveindir.value = xx;
    }

}
function failupload(x)
{
    myprompt(x);

}
function addtab(num)
{
    var t = $('e' + num);
    t.focus();
    var j = caretPos(t);
    var x = '';
    if (j > 0)
        x = t.value.substring(0, j);
    t.value = x + "\t" + t.value.substring(j);

}
var cachedlinethick = 1;
var cachedfontsize = '15px';
var cachedbgcolor = 0;
var cachedcolor = 0;
function selectfontname(sel)
{
    cachedfontfamily = sel.options[sel.selectedIndex].value;
    for (var i = 0; i < allShapes.length; i++)
        if (allShapes[i] != null)
            allShapes[i].div.style.fontFamily = cachedfontfamily;
}
function changefsinousing(sel, num)
{
    var edt = $('e' + num);
    var fs = parseInt(sel.options[sel.selectedIndex].text.replace(/px/, ''));
    edt.style.fontSize = fs + 'px';
    allShapes[num].div.style.fontSize = fs + 'px';
    allShapes[num].fontsize = fs;
    cachedfontsize = edt.style.fontSize;
}
function addtilde(id)
{
    var x = $(id);
    var y = getCursorPos(x) + 1;
    x.value = x.value.substring(0, y) + "\t" + x.value.substring(y);
    setCursorPos(x, y + 1);
}
function setCursorPos(input, start, end) {
    if (arguments.length < 3)
        end = start;
    if ("selectionStart" in input) {
        setTimeout(function () {
            input.selectionStart = start;
            input.selectionEnd = end;
        }, 1);
    } else if (input.createTextRange) {
        var rng = input.createTextRange();
        rng.moveStart("character", start);
        rng.collapse();
        rng.moveEnd("character", end - start);
        rng.select();
    }
}
function getCursorPos(input) {
    if ("selectionStart" in input && document.activeElement == input) {
        return {
            start: input.selectionStart,
            end: input.selectionEnd
        };
    } else if (input.createTextRange) {
        var sel = document.selection.createRange();
        if (sel.parentElement() === input) {
            var rng = input.createTextRange();
            rng.moveToBookmark(sel.getBookmark());
            for (var len = 0;
                    rng.compareEndPoints("EndToStart", rng) > 0;
                    rng.moveEnd("character", -1)) {
                len++;
            }
            rng.setEndPoint("StartToStart", input.createTextRange());
            for (var pos = {start: 0, end: len};
                    rng.compareEndPoints("EndToStart", rng) > 0;
                    rng.moveEnd("character", -1)) {
                pos.start++;
                pos.end++;
            }
            return pos;
        }
    }
    return -1;
}
function showedit(num, x, y, w, h, tt)
{
    if (w == null)
        w = favorw;
    if (h == null)
        h = favorh;
    var a = $("a" + num);
    if (a != null)
        a.style.visibility = 'hidden';
    var edt = document.createElement("div");
    edt.id = "t" + num;
    edt.style.cssText = "background-color:white;position:absolute;z-index:" + (2 * numShapes + 4) + ";left:" + x + "px;top:" + y + "px;";
    var s = "<table cellpadding=0 cellspacing=0 border=1><tr><td align=center bgcolor=white><textarea  onkeydown=\"if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}\"        id=\"e"
            + num + "\" onfocus=\"if(typeof(onlinetoolbarfollow)!='undefined')textareatobesearch=this;\"  class=samebg style=\"border-radius:0px;width:" + w + "px;height:" + h + "px;font-size:" + cachedfontsize + "\"  onkeyup=getInputSelection(this)  onmouseout=getInputSelection(this)>" + tt + "</textarea></td></tr><tr>"
            + "<td  align=center> <table cellspacing=0 cellpadding=0 border=0><tr>"
            + "<td><div id=an" + num + " style=\"background-color:#BBBBBB;width:24px;height:24px;border-radius:12px;lineheight:24px;text-align:center;vertial-align:middle\">&uarr;</div></td>"
            + "<td  style=\"background-color:#BBBBBB;border:1px #b0b0b0 outset;font-weight:700\" ><select  style=font-size:12px;background-color:#BBBBBB  name=editfs onchange=changefsinousing(this," + num + ")><option " + (cachedfontsize == '15px' ? 'selected' : '') + " value=15px>15px</option><option  " + (cachedfontsize == '25px' ? 'selected' : '') + "  value=25px>25px</option><option  " + (cachedfontsize == '35px' ? 'selected' : '') + " value=35px>35px</option><option  " + (cachedfontsize == '45px' ? 'selected' : '') + "  value=45px>45px</option><option  " + (cachedfontsize == '55px' ? 'selected' : '') + " value=55px>55px</option><option  " + (cachedfontsize == '70px' ? 'selected' : '') + " value=70px>70px</option></select><td><input style=width:1px;height:1px;border:0px onfocus=addtab(" + num + ")></td><td style=\"background-color:#BBBBBB;border:1px #b0b0b0 outset;font-weight:700\" >";
    s += "</td>"
            + "<td    onclick=helpstr(" + num + ")          align=center   style=\"width:40px;overflow:hidden;font-size:12px;font-weight:bold;background-color:#BBBBBB;border:1px #0b0b0b outset;\"><nobr>" + textmsg[17] + "</nobr></td>";
    if (onlinetoolinitial.replace(/[^;]/g, '').length < 8 && onlinetoolinitial.indexOf('LaTex') >= 0)
        s += "<td                                         align=center   style=\"width:40px;overflow:hidden;font-size:12px;font-weight:bold;background-color:#BBBBBB;border:1px #0b0b0b outset;\"><span  onclick=\"showlatexpanel($('e" + num + "'),this)\">LaTex</span></td><td style=width:10px;overflow:hidden></td>";
    else
        s += "<td                                         align=center   style=\"width:40px;overflow:hidden;font-size:12px;font-weight:bold;background-color:#BBBBBB;border:1px #0b0b0b outset;\"><span  onclick=\"showonlinetool(" + num + ")\">" + textmsg[1776] + "</span></td><td style=width:10px;overflow:hidden></td>";

    s += "<td    onclick=\"listf(" + num + ",'b')\"    align=center   style=\"width:40px;overflow:hidden;font-size:12px;font-weight:bold;background-color:#BBBBBB;border:1px #0b0b0b outset\"><nobr>" + textmsg[1592].replace(/ .*/, '') + "</nobr></td>"
            + "<td    onclick=\"listf(" + num + ",'oln')\"  align=center   style=\"width:40px;overflow:hidden;font-size:12px;font-weight:bold;background-color:#BBBBBB;border:1px #0b0b0b outset\"><nobr>1.2.3.</nobr></td>"
            + "<td    onclick=\"listf(" + num + ",'ola')\"  align=center   style=\"width:40px;overflow:hidden;font-size:12px;font-weight:bold;background-color:#BBBBBB;border:1px #0b0b0b outset\">a.b.c.</td>"
            + "<td    onclick=\"listf(" + num + ",'ulb')\"  align=center   style=\"width:40px;overflow:hidden;font-size:12px;font-weight:bold;background-color:#BBBBBB;border:1px #0b0b0b outset\">&bull;&bull;&bull;</td>"
            + "<td    onclick=\"clearformat(" + num + ")\"  align=center   style=\"width:40px;overflow:hidden;font-size:12px;font-weight:bold;background-color:#BBBBBB;border:1px #0b0b0b outset\" ><nobr>" + textmsg[1663] + "</nobr></td><td style=width:10px;overflow:hidden></td>"
            + "<td    onclick=done(" + num + ")             align=center   style=\"width:40px;overflow:hidden;font-size:12px;font-weight:bold;background-color:#BBBBBB;border:1px #0b0b0b outset\"><nobr>" + textmsg[1357] + "</nobr></td><td>"
            + "<td    onclick=cancele(" + num + ")          align=center   style=\"width:40px;overflow:hidden;font-size:12px;font-weight:bold;background-color:#BBBBBB;border:1px #0b0b0b outset;\"><nobr>" + textmsg[18] + "</nobr></td>"

            + "</tr></table></td></tr></table>";
    edt.innerHTML = s;
    allShapes[num].inediting = true;
    sendObject(num);
    document.body.appendChild(edt);
    edt.onmouseover = function ()
    {
        showanchor($("e" + num), $("t" + num), 'se');
    }
    numbeing = num;
    Drag.init($("an" + num), edt);
    return edt;
}
function example(num)
{
    var x = $('e' + num);
    if (x.value == '' || x.value.length < 10)
        x.value = "Math:$y=x^2$\n\nTable:\n11\tTab 12\n21\tTab 22\n\nImage:[" + textmsg[1303] + "1]\n[" + textmsg[1303] + "2:2] \n\nItemrize:\n<oln>Upload images\n\create imagelet from it</oln>"
}
function helpstr(num)
{
    var ex = '';
    var x = $('e' + num);
    if (x.value == '' || x.value.length < 10)
        ex = "<br><center><a   href=\"javascript:example(" + num + ")\"><b><font color=blue>" + textmsg[1322] + "</font></b></a></center>";
    myprompt("<ol><li>" + textmsg[1664].replace(/\n/g, "<li>") + "</ol>" + ex);

}
function clearformat(num)
{
    var ta = $("e" + num);
    ta.value = ta.value.replace(/<[a-z]+>/g, '').replace(/<\/[a-z]+>/g, '');
}
function listf(num, b)
{
    var tag = ["<" + b + ">", "</" + b + ">"];
    var ta = $("e" + num);
    var t = ta.value.substring(selectstart, selectend);
    var i = selectstart;

    if (t.indexOf(tag[0]) >= 0 || t.indexOf(tag[1]) >= 0)
        return;

    for (var k = 0; k < 2; k++)
        for (var j = 1; j < tag[k].length; j++)
        {

            if (i > j
                    && i < ta.value.length - tag[k].length + j
                    && ta.value.substring(i - j, i + tag[k].length - j) == tag[k]
                    )
            {
                i = i - j;

            }

        }

    j = ta.value.substring(0, i).lastIndexOf(tag[1]);
    k = ta.value.substring(0, i).lastIndexOf(tag[0]);

    if (k > j)
    {
        var l = ta.value.indexOf(tag[1], i);
        var m = t.length + i;

        if (m > l && l > 0)
            ta.value = ta.value.substring(0, i) + tag[1] + ta.value.substring(i, l) + tag[0] + ta.value.substring(l + 4, m) + tag[1] + ta.value.substring(m);
        else if (m < l)
            ta.value = ta.value.substring(0, i) + tag[1] + ta.value.substring(i, m) + tag[0] + ta.value.substring(m);
    } else if (k <= j)
    {
        l = ta.value.indexOf(tag[0], i);
        m = t.length + i;

        if (m > l && l > 0)
            ta.value = ta.value.substring(0, i) + tag[0] + ta.value.substring(i, l) + tag[1] + ta.value.substring(l + 3, m) + tag[0] + ta.value.substring(m);
        else
            ta.value = ta.value.substring(0, i) + tag[0] + ta.value.substring(i, m) + tag[1] + ta.value.substring(m);

    }
    ta.value = ta.value.replace(tag[0] + tag[1], '');
}
var numediting = -1;
function action(dv)
{
    LaTexHTML.deformat(dv);
    var num = parseInt(dv.id.substring(1));
    var tt = allShapes[num].words;
    if (tt == null || tt == textmsg[1774])
        tt = '';
    if (allShapes[num].isrect())
    {
        var x = allShapes[num].x + 4;
        var y = allShapes[num].y + 4;
    } else
    {
        x = parseInt(dv.style.left.replace(/px/, ''));
        y = parseInt(dv.style.top.replace(/px/, ''));
    }

    var w = dv.style.offsetWidth;
    var h = dv.style.offsetHeight;

    if (w < favorw)
        w = favorw;
    if (h < favorh)
        h = favorh;
    var b = showedit(num, x - 10, y - 10, w, h, tt);
    var ta = b.getElementsByTagName("textarea")[0];
    if (typeof (onlinetoolbarfollow) != 'undefined' && typeof (onlinetoolbase) != 'undefined' && onlinetoolbase != null)
    {
        onlinetoolbarfollow(ta);
        ta.focus();
    }
    $('mobiletoolbar').style.zIndex = '' + (2 * numShapes + 4);
    if (b.offsetWidth > ta.offsetWidth + 6)
        ta.style.width = (b.offsetWidth - 6) + 'px';
    numediting = num;
}
function cancele(num)
{

    allShapes[num].inediting = false;

    sendObject(num);
    if (typeof (onlinetoolbase) != 'undefined')
    {
        onlinetoolbase.style.visibility = "hidden";
    }
    numediting = -1;
    var b = $("t" + num);
    document.body.removeChild(b);
    document.onmousemove = onmouseover0;
    hideanchor(num);
    if (num == numShapes - 1 && allShapes[num].words == textmsg[1774])
    {
        allShapes[num].delme(false);
    }
}
var moreslice = '';

function done(num, W, H, enforce)
{
    allShapes[num].inediting = false;
    var b = $("t" + num);
    if (typeof (onlinetoolbase) != 'undefined')
        onlinetoolbase.style.visibility = "hidden";
    var haseditt = false;
    var ta;
    if (b != null)
    {
        haseditt = true;
        hideanchor(num);
        $('tdicon').style.backgroundColor = '#ffffff';
        ta = $("e" + num);

        if (num == numShapes - 1)
        {
            var v = ta.value.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/^[\n]+/, '');
            var j = v.indexOf('\n\n\n', 1);
            if (j > -1)
            {
                moreslice = v.substring(j + 3);
                ta.value = v.substring(0, j);
            } else
                moreslice = '';
        } else
            moreslice = '';
        if (typeof (LaTexHTML) != 'undefined')
            LaTexHTML.deformat(allShapes[num].div);
        var stv = ta.value;
        if (stv == '')
            stv = textmsg[1774];
        allShapes[num].words = stv;
        if (typeof (LaTexHTML) != 'undefined')
        {
            LaTexHTML.formatele(allShapes[num].div);
            if (!allShapes[num].isrect())
                allShapes[num].gooddim();
        }
    }
    var z = allShapes[num];
    var rx = z.base.offsetWidth;
    var ry = z.base.offsetHeight;

    if (z.div.style.position != null && z.div.style.position.toUpperCase() == 'ABSOLUTE')
        document.body.removeChild(z.div);

    document.body.removeChild(z.base);
    if ((W != null || H != null) && enforce == true)
    {
        z = new Shape(z.num, z.words, z.urlas, z.shapename, z.x, z.y, W, H, z.fontsize, z.color, z.bcolor, z.fc, z.time, z.zindex, z.start);
    } else
    {

        z = new Shape(z.num, z.words, z.urlas, z.shapename, z.x, z.y, null, null, z.fontsize, z.color, z.bcolor, z.fc, z.time, z.zindex, z.start);
    }

    rx = z.base.offsetWidth / rx;
    ry = z.base.offsetHeight / ry;
    allShapes[z.num] = z;

    if (allLines != null && W == null && H == null && b == null)
    {
        for (var i = 0; i < numLines; i++)
        {
            if (allLines[i] != null && allLines[i].startnum == num)
            {
                allLines[i].sx = Math.round(allLines[i].sx * savedfontrate);
                allLines[i].sy = Math.round(allLines[i].sy * savedfontrate);
                allLines[i].redraw();
            }
            if (allLines[i] != null && allLines[i].endnum == num)
            {
                allLines[i].ex = Math.round(allLines[i].ex * savedfontrate);
                allLines[i].ey = Math.round(allLines[i].ey * savedfontrate);
                allLines[i].redraw();
            }
        }
    }
    if (typeof (LaTexHTML) != 'undefined')
    {
        LaTexHTML.formatele(allShapes[num].div);
        if (!allShapes[num].isrect())
            allShapes[num].gooddim();
    }
    if (b != null)
    {
        document.body.removeChild(b);
        numediting = -1;
    }
    allShapes[num].init();
    hassaved = false;
    document.onmousemove = onmouseover0;
    allShapes[num].inediting = false;
    sendObject(num);

    if (moreslice != '')
    {

        num++;
        if ((W != null || H != null) && enforce == true)
        {
            var qz = new Shape(num, moreslice, '', z.shapename, z.x + 20, z.y + 20, W, H, z.fontsize, z.color, z.bcolor, z.fc, z.time, z.zindex, z.start);
        } else
        {
            qz = new Shape(num, moreslice, '', z.shapename, z.x + 20, z.y + 20, null, null, z.fontsize, z.color, z.bcolor, z.fc, z.time, z.zindex, z.start);
        }
        edit(num);
        done(num, W, H, enforce);

    } else if (haseditt)
        saveit();
}



function modifyimg(tag, num, w, h)
{
    var pi = allShapes[num].words.indexOf("<" + tag + " ");
    allShapes[num].words = allShapes[num].words.substring(0, pi) +
            ((allShapes[num].words.substring(pi).indexOf(" width=") > 0) ? allShapes[num].words.substring(pi).replace(/ width=[0-9]+/, " width=" + w).replace(/height=[0-9]+/, "height=" + h)
                    : ("<" + tag + "  width=" + w + " height=" + h + " " + allShapes[num].words.substring(pi + 2 + tag.length)));
    done(num);
}
function showanchor(obj, baseobj, direct)
{
    var num = parseInt(obj.id.substring(1));
    if (('' + num) == 'NaN')
    {
        if (otherunique == null)
            otherunique = obj;
        else
            return;
    } else
    {
        if (obj.id.charAt(0) == 'z')
        {
            if (entered[num] != null && obj.id.charAt(0) != 'z')
            {
                hideanchor(num);
                entered[num] = obj;
            } else if (entered[num] == null)
            {
                entered[num] = obj;
            } else
                return;
        } else
        {
            if (entered[num] != null)
                return;
            else
                entered[num] = obj;
        }
    }

    var anchor = document.createElement("div");
    anchor.id = "a" + num;
    var xy = findPositionnoScrolling(baseobj);
    var z = 0;
    if (isNaN(baseobj.style.zIndex) == false)
        z = parseInt(baseobj.style.zIndex);
    z += 2;


    if (direct == 'ss')
    {
        anchor.style.cssText = "position:absolute;left:" + (xy[0] + baseobj.offsetWidth / 2 - 10) + "px;top:" + (xy[1] + baseobj.offsetHeight - 2)
                + "px;width:20px;height:2px;z-index:" + z + ";cursor:" + direct + "-resize;background-color:black";
        anchor.innerHTML = fillblank;
    } else
    {
        anchor.style.cssText = "position:absolute;left:" + (xy[0] + baseobj.offsetWidth - 11) + "px;top:" + (xy[1] + baseobj.offsetHeight - 12)
                + "px;width:12px;height:12px;z-index:" + z + ";cursor:" + direct + "-resize;";
        anchor.innerHTML = "<img src=\"" + originalurl + "/image/lbangle.png\" >";
    }

    document.body.appendChild(anchor);
    var bxy = findPositionnoScrolling(baseobj);

    Drag.init(anchor);
    anchor.onDragStart = function (x, y)
    {
        var num = parseInt(this.id.substring(1));

        if (('' + num) != 'NaN')
            var obj = entered[num];
        else
            obj = otherunique;
        if (obj == null)
            return;

    }
    anchor.onDragEnd = function (x, y)
    {
        var num = parseInt(this.id.substring(1));
        if (('' + num) != 'NaN')
            var obj = entered[num];
        else
            obj = otherunique;
        if (obj == null)
            return;
        var xy = findPositionnoScrolling(obj);
        var w = x - xy[0] - (baseobj.offsetWidth - obj.offsetWidth);
        var h = y - xy[1] - (baseobj.offsetWidth - obj.offsetWidth);

        if (w < 2 || h < 2)
            return;

        if (typeof (obj.tagName) == 'undefined')
            return;
        if (obj.tagName.toLowerCase() == 'div')
        {
            done(num, w, h, true);
        } else if (obj.tagName.toLowerCase() == 'textarea')
        {
            obj.style.width = w + 'px';
            obj.style.height = h + 'px';
            favorw = w;
            favorh = h;
        } else
            modifyimg(obj.tagName.toLowerCase(), num, w, h);
        hideanchor(num);

    }
    setTimeout("hideanchor(" + num + ")", 5000);
}
function hideanchor(num)
{

    var obj = $("a" + num);
    if (obj == null)
        return;
    document.body.removeChild(obj);
    entered[num] = null;

}
function begindraw(bv)
{

    var num = parseInt(bv.id.substring(1));
    bv = $('b' + num);
    var sp = allShapes[num];
    var tsn = sp.shapename;
    if (linetype == '' || state == 0)
        return;
    var i = myHintx - parseInt(bv.style.left.replace(/px/, ''));
    var j = myHinty - parseInt(bv.style.top.replace(/px/, ''));
    var dn = j;
    var ds = Math.abs(j - bv.offsetHeight);
    var de = Math.abs(i - bv.offsetWidth);
    var dw = i;
    var md = dn;
    if (md > ds)
        md = ds;
    if (md > de)
        md = de;
    if (md > dw)
        md = dw;

    if (md == dn)
    {
        j = 0;
        i = Math.round(bv.offsetWidth / 2);
    } else if (md == dw)
    {
        i = 0;

        if (tsn == 'diamond' || tsn == 'ellipse')
            j = Math.round(bv.offsetHeight / 2);
    } else if (md == de)
    {
        i = bv.offsetWidth;

        if (tsn == 'diamond' || tsn == 'ellipse')
            j = Math.round(bv.offsetHeight / 2);
    } else if (md == ds)
    {
        i = Math.round(bv.offsetWidth / 2);
        j = bv.offsetHeight;

    }


    if (state == 1)
    {
        savestart = num;
        savestartx = i;
        savestarty = j;
        state = 2;

        //selectedlinetd.style.backgroundColor = '#999';
        var adot = document.createElement("div");
        adot.id = "q" + num;
        adot.style.cssText = "position:absolute;width:6px;height:6px;left:" + (allShapes[num].x + i - 3)
                + "px;top:" + (allShapes[num].y - 3 + j) + "px;border:1px #909090 solid;background-color:yellow";
        adot.innerHTML = fillblank;
        document.body.appendChild(adot);

    } else if (state == 2)
    {

        var k = cachedlinethick;
        var l = new Line(drawlinenumber, linetype, savestart, savestartx, savestarty, num, i, j, k, seldirect, 0, cachedlinecolor);
        drawlinenumber = null;

        //selectedlinetd.style.backgroundColor = '#fff';
        var x = $("q" + savestart);
        document.body.removeChild(x);
        //linetype = '';
        state = 1;
    }
    document.onmousemove = onmouseover0;
}

function getFontsize()
{
    var sel = $("fntsize");
    if (sel == null)
        return 20;
    var sfs = parseInt(sel.options[sel.selectedIndex].value);
    return sfs;
}


function Shape(num, words, urlas, shapename, x, y, w, h, fs, cl, bc, fc, tm, zIndex, starttime)
{
    var s = ("words=" + words + '\nsp=' + shapename + '\nx=' + x + '\ny=' + y + '\nw=' + w + '\nh=' + h + '\nfs=' + fs + '\ncl=' + cl + '\nbc=' + bc + '\nfc=' + fc + '\nzi=' + zIndex + '\nor=' + starttime);
    if (zIndex == null)
        this.zindex = 1;
    else
        this.zindex = zIndex;

    if (tm == null)
        this.time = 5;
    else
        this.time = tm;
    this.urlas = urlas;
    var newone = true;
    if (words == null)
        words = textmsg[1774];
    if (words != textmsg[1774])
        newone = false;
    if (shapename == null)
        shapename = 'rightrect';
    var sfs = getFontsize();
    if (x == null)
    {
        x = favorx;
    }
    if (y == null)
    {
        y = favory;
    }
    this.x = x;
    this.y = y;

    if (fs == null)
        fs = sfs;
    if (cl == null)
        cl = 0;
    if (bc == null)
        bc = 0;
    if (num == null)
    {
        this.num = numShapes;
    } else
    {
        this.num = num;
    }
    if (this.num == maxn)
    {
        maxn += 100;
        for (var l = 0; l < maxn; l++)
            if (allShapes[l] != null)
                allShapes[l].uniz();
    }
    if (samecolor(bcolors[bc], document.body.style.backgroundColor) && fc != null && (fc & 1) == 1)
        fc -= 1;
    if (starttime == null)
        this.start = 5 * this.num;
    else
        this.start = starttime;
    allShapes[this.num] = this;
    if (allShapes[this.num + 1] == null)
        numShapes = this.num + 1;
    this.shapename = shapename;

    this.width = w;
    this.height = h;
    this.words = words;
    this.fontsize = fs;
    this.color = cl;
    if (bc == null)
        bc = bcolors.length - 1;
    this.bcolor = bc;
    this.fc = 0;
    this.inediting = false;
    if (fc != null)
    {
        this.fc = fc;
    }
    this.visible = 1;

    var boxshadow = ((this.fc & 2) > 0) ? 1 : 0;

    this.base = document.createElement("div");
    this.base.id = "b" + this.num;
    this.isrect = function () {
        return this.shapename.indexOf("rect") >= 0;
    }
    var tmp = ";box-shadow:" + (boxshadow * 3) + "px " + (boxshadow * 3) + "px " + (boxshadow * 6) + "px #666666";
    if (boxshadow == 0 || this.shapename == 'diamond' || this.shapename == 'ellipse')
        tmp = "";
    this.base.style.cssText = "position:absolute;border:0px;top:" + y + "px;left:" + x + "px;border:0px" + tmp;


    this.move = function (Ax, Ay, z)
    {
        var mx = parseInt(this.base.style.left.replace(/px/i, ''));
        var my = parseInt(this.base.style.top.replace(/px/i, ''));
        var x = Ax - mx;
        var y = Ay - my;
        var more = true;
        if (z != null)
        {
            more = false;

        } else if (Math.abs(x) + Math.abs(y) < 4)
        {
            more = false;
        } else if (x > 0 && y == 0) {
            x = 2;
            y = 0;
        } else if (x > y && y > 0) {
            x = 2;
            y = 1;
        } else if (x == y && y > 0) {
            x = 1;
            y = 1;
        } else if (y > x && x > 0) {
            x = 1;
            y = 2;
        } else if (y > 0 && x == 0) {
            x = 0;
            y = 2;
        } else if (y > -x && y > 0) {
            x = -1;
            y = 2;
        } else if (-x == y && y > 0) {
            x = -1;
            y = 1;
        } else if (y < -x && y > 0) {
            x = -2;
            y = 1;
        } else if (y == 0 && x < 0) {
            x = -2;
            y = 0;
        } else if (-x > -y && y < 0) {
            x = -2;
            y = -1;
        } else if (x == y && y < 0) {
            x = -1;
            y = -1;
        } else if (-y > -x && x < 0) {
            x = -1;
            y = -2;
        } else if (y < 0 && x == 0) {
            x = 0;
            y = -2;
        } else if (-y > x && y < 0) {
            x = 1;
            y = -2;
        } else if (-x == y && y < 0) {
            x = 1;
            y = -1;
        } else if (-y < x && y < 0) {
            x = 2;
            y = -1;
        }

        mx += x;
        my += y;
        this.x = mx;
        this.y = my;
        this.base.style.top = my + 'px';
        this.base.style.left = mx + 'px';
        var fw = this.framew();
        if (!this.isrect())
        {
            this.div.style.left = (parseInt(this.div.style.left.replace(/px/i, '')) + x) + 'px';
            this.div.style.top = (parseInt(this.div.style.top.replace(/px/i, '')) + y) + 'px';

        }
        if (more && this.num < allShapes.length)
            setTimeout("allShapes[" + this.num + "].move(" + Ax + "," + Ay + ")", 5);
        else
            redrseline();
    };



    this.cssfit = function ( )
    {
        var textshadow = ";text-shadow:1px 1px #505050";
        if ((this.fc & 4) == 0)
            textshadow = '';
        if (colors[this.color] == 'blue' || hexcolor(colors[this.color]) == '#00ff00')
            textshadow = textshadow.replace(/50/g, '11');
        else
            textshadow = textshadow.replace(/11/g, '05');
        var bcl = bcolors[this.bcolor];
        if (!this.isrect())
            bcl = "transparent";
        else if ((this.fc & 1) == 1)
            this.base.style.boxShadow = "2px 2px 4px #aaa";

        var shink = shrink(this.shapename);
        var zz = "font-family:" + cachedfontfamily + ";border:0px #000 solid;z-index:4;overflow:visible;padding:0px 0px 0px 0px;margin:0px 0px 0px 0px"
                + ";font-size:" + this.fontsize + 'px;color:' + colors[this.color] + textshadow;

        if (this.shapename == 'roundrect')
            zz += ";border-radius:" + (this.framew() - 1) + "px";


        if (!this.isrect())
        {
            var ww = 50;
            var hh = 50;
            if (this.width != null)
                ww = this.width / 2;
            if (this.height != null)
                hh = this.height / 2;
            zz += ';position:absolute;left:' + Math.round(this.x + ww * (1 - shink)) + 'px;top:' + Math.round(this.y + hh * (1 - shink)) + "px";
        }

        if (this.width != null)
            zz += ";width:" + this.width + "px";
        if (this.height != null)
            zz += ";height:" + this.height + "px";

        return zz;
    }
    this.framew = function ()
    {
        return 1 + Math.round(this.fontsize / 15);
    }
    this.resetup = function (w, h)
    {
        var fw = this.framew();
        var framecolor = colors[this.color];
        if ((this.fc & 1) == 1)
            framecolor = bcolors[this.bcolor];
        var textshadow = "text-shadow:1px 1px #505050;";
        if ((this.fc & 4) == 0)
            textshadow = '';

        var boxshadow = ((this.fc & 2) > 0) ? 1 : 0;

        if (this.shapename == 'roundrect')
        {
            // if ( (this.fc & 1) > 0) fw = 0;
            var div = this.base.getElementsByTagName("div")[0];
            this.base.style.backgroundColor = framecolor;
            this.base.style.borderRadius = fw + 'px';
            div.style.cssText = "border:" + fw + "px " + framecolor + " solid;border-radius:" + (fw - 1) + "px;-webkit-border-radius:" + (fw - 1) + "px;-moz-border-radius:" + (fw - 1) + "px;";
            if ((this.fc & 1) > 0)
                this.div.style.borderRadius = this.framew() + 'px';
        } else if (this.shapename == 'rightrect')
        {
            if ((this.fc & 1) > 0)
                fw = 0;
            var div = this.base.getElementsByTagName("div")[0];
            this.base.style.backgroundColor = framecolor;
            div.style.cssText = "border:" + fw + "px " + framecolor + " solid;";

        } else if (this.shapename == 'ellipse')
        {
            if ((this.fc & 1) > 0)
                fw = 0;
            var div = this.base.getElementsByTagName("div")[0];
            div.style.backgroundColor = bcolors[this.bcolor];
            div.style.borderColor = framecolor;
            div.style.borderWidth = fw + 'px';
            div.style.borderStyle = 'solid';
            // this.base.style.backgroundColor =   framecolor;
        } else if (this.shapename == 'diamond')
        {
            var tbl = this.base.getElementsByTagName("table")[0];
            this.base.innerHTML = this.setup(null, null);
        }

        if (this.isrect())
        {
            if (boxshadow > 0)
                this.base.style.boxShadow = (boxshadow * 3) + "px " + (boxshadow * 3) + "px " + (boxshadow * 6) + "px #666666";
            else
                this.base.style.boxShadow = null;
            if ((this.fc & 8) == 8)
                this.base.style.backgroundImage = gradient(bcolors[this.bcolor]);
            else
            {
                this.base.style.backgroundImage = null;
                this.base.style.backgroundColor = (bcolors[this.bcolor]);
            }
        } else if (this.shapename == 'ellipse')
        {
            var dv = this.base.getElementsByTagName('div')[0];
            if (boxshadow > 0)
                dv.style.boxShadow = (boxshadow * 3) + "px " + (boxshadow * 3) + "px " + (boxshadow * 6) + "px #666666";
            else
                dv.style.boxShadow = null;
            if ((this.fc & 8) == 8)
                dv.style.backgroundImage = gradient(bcolors[this.bcolor]);
            else
            {
                dv.style.backgroundImage = null;
                dv.style.backgroundColor = (bcolors[this.bcolor]);
            }
        }

        if ((this.fc & 4) == 4)
            this.div.style.textShadow = "1px 1px #505050;";
        else
            this.div.style.textShadow = null;
        this.inediting = false;
        this.div.style.zIndex = '' + (2 * this.zindex + 1);
        this.base.style.zIndex = '' + (2 * this.zindex);

    }
    this.makeellipse = function (w, h, c, fc, fw)
    {
        if (fw == null)
            fw = this.framew();
        var bf;
        if ((this.fc & 8) > 0)
            bf = "background-image:" + gradient(c);
        else
            bf = 'background-color:' + c;
        ;
        if ((this.fc & 1) > 0)
            fw = 0;
        return "<div style=\"width:" + w + "px;height:" + h + "px;" + bf + ";border-radius:" + Math.round(w / 2) + "px/" +
                Math.round(h / 2) + "px;border:" + fw + "px " + fc + " solid\"><!-- --></div>";
    }
    this.changediamond = function (tbl, w, h, c, fc, framethick)
    {
        if (w != null)
        {
            w /= 2;
            h /= 2;
            tbl.rows[0].cols[0].style.cssText = "width: 0; height: 0; border-bottom: " + h + "px  " + c + " solid; border-left: " + w + "px  transparent solid;";
            tbl.rows[0].cols[1].style.cssText = "width: 0; height: 0; border-bottom: " + h + "px  " + c + " solid ;border-right: " + w + "px transparent  solid";
            tbl.rows[1].cols[0].style.cssText = "width: 0; height: 0; border-top: " + h + "px   " + c + "  solid ; border-left: " + w + "px transparent  solid";
            tbl.rows[1].cols[1].style.cssText = "width: 0; height: 0; border-top: " + h + "px   " + c + "  solid ; border-right: " + w + "px   transparent  solid";
        } else
        {
            tbl.rows[0].cols[0].style.borderBottomColor = c;
            tbl.rows[0].cols[1].style.borderBottomColor = c;
            tbl.rows[1].cols[0].style.borderTopColor = c;
            tbl.rows[1].cols[1].style.borderTopColor = c;
        }
    }

    this.makediamond = function (w, h)
    {
        var shink = shrink(this.shapename);
        var c = bcolors[this.bcolor];
        if (w == null)
        {
            var shink = shrink(this.shapename);
            if (this.div != null)
            {
                w = Math.round(this.div.offsetWidth / shink);
                h = Math.round(this.div.offsetHeight / shink);
            } else
            {
                w = h = 2;
            }
        }

        if ((this.fc & 1) > 0)
        {
            if (this.bcolor == bcolors.length - 1)
                return '';
            w /= 2;
            h /= 2;
            return  "<table cellspacing=0 cellpadding=0><tr  ><td   style=\"width: 0; height: 0; border-bottom: " + h + "px  " + c + " solid; border-left: " + w + "px  transparent solid;\"></td>"
                    + "<td style=\"width: 0; height: 0; border-bottom: " + h + "px  " + c + "  solid ; border-right: " + w + "px transparent  solid ;\"></td></tr>"
                    + "<tr><td style=\"width: 0; height: 0; border-top: " + h + "px   " + c + "  solid ; border-left: " + w + "px transparent  solid ;\"></td>"
                    + "<td style=\"width: 0; height: 0; border-top: " + h + "px   " + c + "  solid ; border-right: " + w + "px   transparent  solid ;\"></td></tr></table>";


        } else
        {
            c = colors[this.color];
            var fw = this.framew();

            if (this.bcolor == bcolors.length - 1)
            {
                w /= 2;
                h /= 2;
                return "<table cellspacing=0 cellpadding=0 style=\"z-index:0;margin:0px 0px 0px 0px\"><tr><td><div style=width:" + w
                        + "px;height:" + h + "px>" + drawlinein(0, h, w, 0, fw, c) + "</div></td><td><div style=width:"
                        + w + "px;height:" + h + "px>" + drawlinein(0, 0, w, h, fw, c) + "</div></td></tr><tr><td><div  style=width:" + w
                        + "px;height:" + h + "px>" + drawlinein(0, 0, w, h, fw, c) + "</div></td><td><div style=width:"
                        + w + "px;height:" + h + "px>" + drawlinein(0, h, w, 0, fw, c) + "</div></td></tr></table>";

            } else
            {
                w /= 2;
                h /= 2;
                var str = "<table cellspacing=0 cellpadding=0 style=\"z-index:0;margin:0px 0px 0px 0px\"><tr  ><td   style=\"width: 0; height: 0; border-bottom: " + h + "px  " + c + " solid; border-left: " + w + "px  transparent solid;\"></td>"
                        + "<td style=\"width: 0; height: 0; border-bottom: " + h + "px  " + c + "  solid ; border-right: " + w + "px transparent  solid ;\"></td></tr>"
                        + "<tr><td style=\"width: 0; height: 0; border-top: " + h + "px   " + c + "  solid ; border-left: " + w + "px transparent  solid ;\"></td>"
                        + "<td style=\"width: 0; height: 0; border-top: " + h + "px   " + c + "  solid ; border-right: " + w + "px   transparent  solid ;\"></td></tr></table>";
                c = bcolors[this.bcolor];
                var fh = fw * h / w;
                w -= fw;
                h -= fh;
                return str + "<table style=\"z-index:1;margin:-" + (2 * h + fh) + "px " + fw + "px " + fh + "px " + fw + "px\"  cellspacing=0 cellpadding=0><tr  ><td   style=\"width: 0; height: 0; border-bottom: " + h + "px  " + c + " solid; border-left: " + w + "px  transparent solid;\"></td>"
                        + "<td style=\"width: 0; height: 0; border-bottom: " + h + "px  " + c + "  solid ; border-right: " + w + "px transparent  solid ;\"></td></tr>"
                        + "<tr><td style=\"width: 0; height: 0; border-top: " + h + "px   " + c + "  solid ; border-left: " + w + "px transparent  solid ;\"></td>"
                        + "<td style=\"width: 0; height: 0; border-top: " + h + "px   " + c + "  solid ; border-right: " + w + "px   transparent  solid ;\"></td></tr></table>";
            }
        }

    }


    this.setup = function (w, h)
    {
        var fw = this.framew();
        var s = '';
        urlas = this.urlas;
        numbeing = this.num;
        this.inediting = false;
        shapenamebeing = this.shapename;
        s = tohtml(this.words, colors[this.color], this.fontsize, this.shapename);
        var framecolor = colors[this.color];
        if ((this.fc & 1) > 0)
            framecolor = bcolors[this.bcolor];
        if (this.shapename == 'rightrect')
        {
            if ((this.fc & 1) > 0)
                fw = 0;
            var xx = "background-color:" + bcolors[this.bcolor] + ";";
            if ((this.fc & 8) > 0)
                xx = "background-image:" + gradient(bcolors[this.bcolor]) + ";"
            s = "<div style=\"" + xx + "border:" + fw + "px " + framecolor + " solid;padding:0 px 0px 0px 0px\">"
                    + "<div id=\"d" + this.num + "\"  style=\"" + this.cssfit() + "\">"
                    + s
                    + "</div></div>";
        } else if (this.shapename == 'roundrect')
        {
            if ((this.fc & 1) > 0)
                fw = 0;
            var xx = "background-color:" + bcolors[this.bcolor] + ";";
            if ((this.fc & 8) > 0)
                xx = "background-image:" + gradient(bcolors[this.bcolor]) + ";"
            s = "<div style=\"" + xx + "border:" + fw + "px " + framecolor + " solid;border-radius:" + fw + "px;-webkit-border-radius:" + fw + "px;-moz-border-radius:" + fw + "px;padding:0 px 0px 0px 0px\">"
                    + "<div id=\"d" + this.num + "\"  style=\"" + this.cssfit() + ";border-radius:" + (fw - 1) + "px\">"
                    + s
                    + "</div></div>";
        } else if (this.shapename == 'ellipse')
        {
            s = this.makeellipse(w, h, bcolors[this.bcolor], framecolor, fw);
        } else if (this.shapename == 'diamond')
        {
            s = this.makediamond(w, h);
        }

        return s;
    }

    this.base.innerHTML = this.setup(w, h);

    document.body.appendChild(this.base);
    // if (editable && typeof(Drag)!='undefined') Drag.init(this.base);

    this.positionbyfn = function (fn)
    {
        var s = this.div.getElementsByTagName("nobr");
        for (var i = 0; i < s.length; i++)
        {

            if (s[i].innerHTML.replace(/<b>/i, '').replace(/<.b>/i, '').replace(/^[ |\r]*/, '').replace(/[ |\r]*$/, '')
                    == fn.replace(/^[ |\r]*/, '').replace(/[ |\r]*$/, ''))
                return findPositionnoScrolling(s[i])[1] - this.y + Math.round(this.fontsize);
        }
        return 0;
    }

    this.inbase = function (bx, by)
    {
        if (this.shapename == 'ellipse')
        {
            var w = this.base.offsetWidth;
            var h = this.base.offsetHeight;
            var x = bx - this.x - w / 2;
            var y = by - this.y - h / 2;
            var D = x * x / w / w + y * y / h / h;

            return (D <= 0.25);
        } else if (this.shapename == 'diamond')
        {
            w = this.base.offsetWidth;
            h = this.base.offsetHeight;
            x = bx - this.x - w / 2;
            y = by - this.y - h / 2;
            D = Math.abs(x / w) + Math.abs(y / h);
            return (D <= 0.50);
        } else
        {
            w = this.base.offsetWidth;
            h = this.base.offsetHeight;
            x = bx - this.x;
            y = by - this.y;

            return (x >= 0 && x <= w && y >= 0 && y <= h);
        }
    }


    if (this.isrect())
    {
        this.div = $("d" + this.num);
    } else
    {
        this.div = document.createElement("div");
        this.div.id = "d" + this.num;
        // this.div.className = "samebg";
        this.div.style.cssText = this.cssfit();
        urlas = this.urlas;
        numbeing = this.num;
        shapenamebeing = this.shapename;
        this.div.innerHTML = tohtml(this.words, colors[this.color], this.fontsize, this.shapename);
        document.body.appendChild(this.div);
    }
    //
    this.bx = 0;
    this.by = 0;
    this.validdrag = false;

    this.base.onDragStart = function (x, y)
    {
        if (this.inediting)
            return;
        document.onmousemove = onmouseover0;

        var sp = allShapes[parseInt(this.id.substring(1))];
        sp.bx = x;
        sp.by = y;
        if (state > 0)
            sp.validdrag = false;
        else
            sp.validdrag = sp.inbase(myHintx, myHinty);
        //myprompt(sp.x + " " + myHintx + " " + x + " " + sp.y + " " + myHinty + " " + y)
        if (sp.isrect())
        {
            sp.x = parseInt(sp.base.style.left.replace(/px/, ''));
            sp.y = parseInt(sp.base.style.top.replace(/px/, ''));
        } else
        {
            var shink = shrink(this.shapename);
            var dw = Math.round(this.div.offsetWidth * (1 / shink - 1));
            var dh = Math.round(this.div.offsetHeight * (1 / shink - 1));
            sp.x = parseInt(sp.div.style.left.replace(/px/, '')) - dw;
            sp.y = parseInt(sp.div.style.top.replace(/px/, '')) - dh;

        }
    }

    this.onDragEnd = function (x, y)
    {

        if (this.inediting || this.validdrag == false)
            return;

        if (Math.abs(x) + Math.abs(y) > 10)
        {
            sendObject(this.num);
        }
        if (Math.abs(x) + Math.abs(y) > 0)
        {
            for (var i = 0; i < allLines.length; i++)
            {
                if (allLines[i] != null && (allLines[i].startnum == this.num || allLines[i].endnum == this.num))
                {
                    allLines[i].redraw();
                }
            }

        }


        document.onmousemove = onmouseover0;
    }

    this.delme = function (needcomfirm)
    {
        if (typeof (LaTexHTML) != 'undefined')
            LaTexHTML.deformat(this.div);
        if (needcomfirm != null && saveable() && this.words != null && this.words.indexOf("<img ") >= 0)
        {
            var im = this.div.getElementsByTagName("img")[0].alt;

            if (im.src.indexOf(originalurl + "/FileOperation?did=") >= 0
                    && confirm(textmsg[1662].replace(/#/, im)))
                delpic(this.num, im);
        }

        if (this.shapename == 'rightrect' || this.shapename == 'roundrect')
        {
            this.base.getElementsByTagName('div')[0].removeChild(this.div);
        } else
            document.body.removeChild(this.div);

        document.body.removeChild(this.base);
        for (var i = 0; i < allLines.length; i++)
        {
            if (allLines[i] != null && (allLines[i].startnum == this.num || allLines[i].endnum == this.num))
            {
                allLines[i].delme();
            }
        }
        if (chatsessionnum == -1 && numShapes - 1 == this.num)
            numShapes--;

        allShapes[this.num] = null;

    }
    this.toString = function ()
    {
        if (this.words == null)
            this.words = "";

        if (this.shapename == null)
            this.shapename = 'rightrect';
        var yy = parseInt(this.base.style.top.replace(/px/, ''));
        var xx = parseInt(this.base.style.left.replace(/px/, ''));
        var ww = '';
        if (this.width != null)
            ww = this.width;
        else
            ww = this.base.offsetWidth;
        var hh = '';
        if (this.height != null)
            hh = this.height;
        else
            hh = this.base.offsetHeight;
        var str;
        if (this.words.indexOf(",") >= 0 || this.words.indexOf("\n") >= 0 || this.words.indexOf("\r") >= 0)
            str = "'" + this.words.replace(/'/g, "''") + "',";
        else
            str = this.words + ",";
        ;
        str += this.urlas + ",";
        str += this.shapename + "," + xx + "," + yy + "," + ww + "," + hh + ","
                + this.fontsize + ",'" + (this.color) + "','" + this.bcolor + "'," + this.fc + "," + this.time + "," + this.zindex + "," + this.start + "," + this.inediting;

        return str;
    }
    if (newone)
    {
        this.width = (w != null) ? w : this.base.offsetWidth;
        this.height = (h != null) ? w : this.base.offsetHeight;

    }
    this.showresize = function (pic)
    {
        pic.id = "z" + this.num;
        if (this.isrect())
        {
            this.base.onmouseover = function ()
            {
                var num = parseInt(this.id.substring(1));
                showanchor($("z" + num), this, 'se');
            }
        } else
        {
            this.base.getElementsByTagName('div')[0].onclick = function ()
            {
                mdia(parseInt(this.parentNode.id.substring(1)), 1);
            }
        }
    }
    this.resizeit = function ()
    {
        var ims = this.div.getElementsByTagName("img");
        if (ims != null && ims.length > 0)
        {
            ims[0].id = "z" + this.num;
            ims[0].style.cssText = "margin:0px 0px 0px 0px;border:0px";
            ims[0].onDragStart = function (x, y)
            {
                var sp = allShapes[parseInt(this.id.substring(1))];
                sp.bx = x;
                sp.by = y;
            }
            ims[0].onDragEnd = function (x, y)
            {
                if (document.onclick != null)
                    return;
                var sp = allShapes[parseInt(this.id.substring(1))];
                var diffx = x - sp.bx;
                var diffy = y - sp.by;
                if (diffx * diffx + diffy * diffy <= 4)
                    mdia(parseInt(this.id.substring(1)), 1);
            }

            //ims[0].onclick = function() {mdia(parseInt(this.id.substring(1)), 1);}
            ims[0].onmouseover = function () {
                showanchor(this, this, 'se');
            }
        } else if ((ims = this.div.getElementsByTagName("iframe")) != null && ims.length > 0)
        {
            this.showresize(ims[0]);
        } else if ((ims = this.div.getElementsByTagName("embed")) != null && ims.length > 0)
        {
            this.showresize(ims[0]);
        } else if (this.shapename == 'rightrect' || this.shapename == 'roundrect')
        {
            this.div.onmouseover = function ()
            {
                var num = parseInt(this.id.substring(1));
                if (allShapes[num].fc == 0)
                    showanchor(this, allShapes[num].base, 'se');
            }
        }
    }


    this.getdim = function ()
    {
        this.width = this.base.offsetWidth;
        this.height = this.base.offsetHeight;
    }

    this.uniz = function ()
    {
        this.base.style.zIndex = '' + (2 * this.zindex);
        this.div.style.zIndex = '' + (2 * this.zindex + 1);
    }

    this.init = function ()
    {
        this.resizeit();

        Drag.init(this.div);
        this.div.onDragStart = function (x, y)
        {
            document.onmousemove = onmouseover0;

            var sp = allShapes[parseInt(this.id.substring(1))];
            sp.bx = x;
            sp.by = y;
            if (state > 0)
                sp.validdrag = false;
            else
                sp.validdrag = sp.inbase(myHintx, myHinty);
        }

        this.div.onDragEnd = function (x, y)
        {

            document.onmousemove = onmouseover0;
            var sp = allShapes[parseInt(this.id.substring(1))];

            if (state > 0) // bounce back
            {
                this.style.left = sp.bx + 'px';
                this.style.top = sp.by + 'px';
                begindraw(sp.div);
                return;
            }
            if (document.onclick != null)
                return;
            var diffx = x - sp.bx;
            var diffy = y - sp.by;

            if (Math.abs(diffx) + Math.abs(diffy) > 4)
            {

                sp.x = (diffx + parseInt(sp.base.style.left.replace(/px/, '')));
                sp.y = (diffy + parseInt(sp.base.style.top.replace(/px/, '')));
                sp.base.style.left = sp.x + 'px';
                sp.base.style.top = sp.y + 'px';
                sp.onDragEnd(diffx, diffy);
                hassaved = false;
            } else
            {
                mdia(parseInt(this.id.substring(1)), 1);
            }
            var boxshadow = ((this.fc & 2) > 0) ? 1 : 0;

            if (sp.shapename == 'ellipse')
            {
                var dv = sp.base.getElementsByTagName('div')[0];
                if (boxshadow > 0)
                    dv.style.boxShadow = (boxshadow * 3) + "px " + (boxshadow * 3) + "px " + (boxshadow * 6) + "px #666666";
                else
                    dv.style.boxShadow = null;
            } else if (sp.shapename == 'roundrect')
            {
                if ((sp.fc & 1) > 0)
                    sp.div.style.borderRadius = this.framew() + 'px';
            }
            sp.uniz();
            document.onmousemove = onmouseover0;
        }

        var mw = this.base.offsetWidth;
        if (mw < this.width)
            mw = this.width;
        if (mfavory < this.base.offsetHeight)
            mfavory = this.base.offsetHeight;
        if (mfavory < this.height)
            mfavory = this.height;

        favorx += 10 + mw;
        if (favorx > 800)
        {
            favory += mfavory + 10;
            favorx = 5;
            mfavory = 0;
        }

        if (!this.isrect())
            this.gooddim(w, h);
        else if (this.shapename == 'roundrect' && (this.fc & 1) > 0)
            this.div.style.borderRadius = this.framew() + 'px';

    }

    this.gooddim = function (w, h)
    {
        var shink = shrink(this.shapename);
        var cc = false;
        if (w == null)
        {
            w = Math.round(this.div.offsetWidth / shink);
            cc = true;
        } else
        {
            this.div.style.width = (w * shink) + 'px';

        }
        if (h == null)
            h = Math.round(this.div.offsetHeight / shink);
        else
        {
            this.div.style.height = (h * shink) + 'px';
        }
        if (this.shapename == 'ellipse')
        {
            var dv = this.base.getElementsByTagName('div');
            if (dv == null)
            {
                this.base.innerHTML = this.setup(w, h);
            } else
            {
                dv[0].style.width = w + 'px';
                dv[0].style.height = h + 'px';
                dv[0].style.borderRadius = Math.round(w / 2) + 'px/' + Math.round(h / 2) + 'px';
                var fw = this.framew();
                dv[0].style.borderWidth = fw + 'px';
            }

            if (boxshadow > 0)
                dv[0].style.boxShadow = (boxshadow * 3) + "px " + (boxshadow * 3) + "px " + (boxshadow * 6) + "px #666666";
            else
                dv[0].style.boxShadow = null;


        } else
        {
            this.base.innerHTML = this.setup(w, h);
            var fw = this.framew();
            this.uniz();
        }
        if (cc)
        {
            this.div.style.left = Math.round(this.x + this.div.offsetWidth / shink * (1 - shink) / 2) + "px";
            this.div.style.top = Math.round(this.y + this.div.offsetHeight / shink * (1 - shink) / 2) + "px";
        }

    }

    this.init();

}


function toString()
{
    var s = "";
    var map = new Array();
    var k = numShapes;
    for (var i = 0; i < k; i++)
    {
        if (allShapes[i] != null)
        {
            s += allShapes[i].toString() + "\n";
            map[i] = i;
        } else
        {
            while (k >= 1 && allShapes[k - 1] == null)
                k--;
            if (i >= k)
            {
                break;
            }
            map[k - 1] = i;
            s += allShapes[--k].toString() + "\n";
        }
    }
    s += "A\n";
    if (allLines != null)
        for (i = 0; i < allLines.length; i++)
        {
            if (allLines[i] != null)
                s += allLines[i].toString(map) + "\n";
        }
    return s;
}
function delall()
{
    if (allShapes != null)
        for (var i = 0; i < allShapes.length; i++)
            if (allShapes[i] != null)
                allShapes[i].delme();
    if (allLines != null)
        for (i = 0; i < allLines.length; i++)
            if (allLines[i] != null)
                allLines[i].delme();
    numShapes = 0;
    numLines = 0;
}
function Line(ordernum, type, startnum, sx, sy, endnum, ex, ey, thick, direct, tm, cl)
{
    if (ordernum == null)
        this.num = numLines;
    else
        this.num = ordernum;
    numLines++;
    allLines[this.num] = this;
    this.startnum = startnum;
    this.sx = sx;
    this.sy = sy;
    this.endnum = endnum;
    this.ex = ex;
    this.ey = ey;
    this.direct = direct;
    this.type = type;
    this.thick = thick;
    this.time = tm;
    this.k = 0;
    this.color = cachedlinecolor;
    if (cl != null && cl != '')
    {
        this.color = cl;
    }
    this.x = 0;
    this.y = 0;
    this.visible = 1;
    this.toString = function (map)
    {
        var sn = this.startnum;
        var en = this.endnum;
        if (map != null)
        {
            sn = map[this.startnum];
            en = map[this.endnum];
        }

        if (sn == null)
            sn = -1;
        if (en == null)
            en = -1;
        var s = this.type + "," + sn + "," + this.sx + "," + this.sy
                + "," + en + "," + this.ex + "," + this.ey + "," + this.thick + "," + this.direct + "," + this.time + "," + this.color;
        return s;
    }
    this.draw = function ()
    {
        var ss = '';
        this.k = 0;
        if (this.startnum == this.endnum)
        {
            return;
        }
        var A, B;
        if (this.startnum >= 0)
        {
            var sobj = allShapes[this.startnum];
            if (sobj == null)
                return;
            sobj = sobj.base;
            var xys = findPositionnoScrolling(sobj);
            ss += xys[0] + '\n' + xys[1] + '\n';
            if (allShapes[this.startnum].shapename == 'diamond')
            {
                sobj = allShapes[this.startnum].div;
                xys = findPositionnoScrolling(sobj);
                var shink = shrink('diamond');
                var w1 = sobj.offsetWidth / shink;
                var h1 = sobj.offsetHeight / shink;
                xys[0] -= (w1 - sobj.offsetWidth) / 2;
                xys[1] -= (h1 - sobj.offsetHeight) / 2;
                ss += xys[0] + '\n' + xys[1] + '\n';
                A = [
                    [xys[0], xys[1] + Math.round(h1 / 2)],
                    [xys[0] + w1, xys[1] + Math.round(h1 / 2)],
                    [xys[0] + Math.round(w1 / 2), xys[1]],
                    [xys[0] + Math.round(w1 / 2), xys[1] + Math.round(h1)]
                ];
            } else if (allShapes[this.startnum].shapename == 'ellipse' || this.sy == 0 || Math.abs(sobj.offsetHeight - this.sy) < 3)
            {
                A = [
                    [xys[0], xys[1] + Math.round(sobj.offsetHeight / 2)],
                    [xys[0] + sobj.offsetWidth, xys[1] + Math.round(sobj.offsetHeight / 2)],
                    [xys[0] + Math.round(sobj.offsetWidth / 2), xys[1]],
                    [xys[0] + Math.round(sobj.offsetWidth / 2), xys[1] + sobj.offsetHeight]
                ];
            } else
            {
                A = [
                    [xys[0] + sobj.offsetWidth, xys[1] + this.sy],
                    [xys[0], xys[1] + this.sy]];
            }
            ss += A.toString() + '\n';
        } else
        {
            A = [[this.sx, this.sy]];

        }

        if (this.endnum >= 0)
        {
            sobj = allShapes[this.endnum];
            if (sobj == null)
                return;
            sobj = sobj.base;
            xys = findPositionnoScrolling(sobj);
            if (allShapes[this.endnum].shapename == 'diamond')
            {
                sobj = allShapes[this.endnum].div;
                xys = findPositionnoScrolling(sobj);
                var shink = shrink('diamond');
                var w1 = sobj.offsetWidth / shink;
                var h1 = sobj.offsetHeight / shink;
                xys[0] -= (w1 - sobj.offsetWidth) / 2;
                xys[1] -= (h1 - sobj.offsetHeight) / 2;
                ss += xys[0] + '\n' + xys[1] + '\n';
                B = [
                    [xys[0], xys[1] + Math.round(h1 / 2)],
                    [xys[0] + w1, xys[1] + Math.round(h1 / 2)],
                    [xys[0] + Math.round(w1 / 2), xys[1]],
                    [xys[0] + Math.round(w1 / 2), xys[1] + Math.round(h1)]
                ];
            } else if (allShapes[this.endnum].shapename == 'ellipse'
                    || this.ey == 0 || Math.abs(this.ey - sobj.offsetHeight) < 3)
            {
                B = [
                    [xys[0], xys[1] + Math.round(sobj.offsetHeight / 2)],
                    [xys[0] + sobj.offsetWidth, xys[1] + Math.round(sobj.offsetHeight / 2)],
                    [xys[0] + Math.round(sobj.offsetWidth / 2), xys[1]],
                    [xys[0] + Math.round(sobj.offsetWidth / 2), xys[1] + sobj.offsetHeight]
                ];
            } else
            {
                B = [
                    [xys[0] + sobj.offsetWidth, xys[1] + this.ey],
                    [xys[0], xys[1] + this.ey]
                ];
            }
        } else
        {
            B = [[this.ex, this.ey]];
            // this.mdiv(this.ex, this.ey,4, 6, "&times;");
        }

        var m = 100000000;
        var mi = 0;
        var mj = 0;
        for (var i = 0; i < A.length; i++)
            for (var j = 0; j < B.length; j++)
            {
                var d = (A[i][0] - B[j][0]) * (A[i][0] - B[j][0]) + (A[i][1] - B[j][1]) * (A[i][1] - B[j][1]);
                if (d < m)
                {
                    m = d;
                    mi = i;
                    mj = j;

                }
            }


        var Ax = A[mi][0];
        var Ay = A[mi][1];
        var Bx = B[mj][0];
        var By = B[mj][1];

        var bx = Bx;
        var by = By;

        var way = '';
        if (mi < 2 && mj < 2)
            way = 'hh';
        if (mi < 2 && mj >= 2)
            way = 'hv';
        if (mi >= 2 && mj < 2)
            way = 'vh';
        if (mi >= 2 && mj >= 2)
            way = 'vv';

        var mg = '';
        if (this.type == 'arrow')
            mg = ' ';
        else if (this.type == 'arrom')
            mg = ' ';
        else if (this.type == 'diamond')
            mg = ' ';
        if (this.thick % 2 == 0)
            this.thick++;
        if (this.direct == 0)
        {
            this.drawLine(Ax, Ay, Bx, By, this.thick, mg);
        } else if (this.direct >= 1)
        {
            if (way == 'hv')
            {
                this.drawLine(Ax, Ay, Bx, Ay, this.thick);
                this.drawLine(Bx, Ay, Bx, By, this.thick, mg);
            } else if (way == 'vh')
            {
                this.drawLine(Ax, Ay, Ax, By, this.thick);
                this.drawLine(Ax, By, Bx, By, this.thick, mg);
            } else if (way == 'hh')
            {
                var l = 1;
                if (Ax > bx)
                    l = -1;
                var ly = 1;
                if (by < Ay)
                    ly = -1;
                this.drawLine(Ax, Ay, (Ax + Bx) / 2, Ay, this.thick);
                this.drawLine((Ax + Bx) / 2, Ay, (Ax + Bx) / 2, By, this.thick);
                this.drawLine((Ax + Bx) / 2, By, Bx, By, this.thick, mg);
            } else if (way == 'vv')
            {
                var l = 1;
                if (Ax > bx)
                    l = -1;
                var ly = 1;
                if (by < Ay)
                    ly = -1;
                this.drawLine(Ax, Ay, Ax, (Ay + By) / 2, this.thick);
                this.drawLine(Ax, (Ay + By) / 2, Bx, (Ay + By) / 2, this.thick);
                this.drawLine(Bx, (Ay + By) / 2, Bx, By, this.thick, mg);
            }
        }
        if (chatsessionnum > -1 && sentline == false)
        {
            parent.sendObject(chatsessionnum, this.num + " l" + this.toString());
        }
        sentline = false;
        document.onmousemove = onmouseover0;

    }
     
     
    this.drawLine = function (Ax, Ay, Bx, By, thick, mg)
    {
        this.drawl(Ax, Ay, Bx, By, thick, mg);
    }

    this.drawlo = function (x0, y0, x1, y1, thick, mg)
    {
        var dv = document.createElement('div');
        var f = 7;
        if (thick >= 2 && thick <= 4)
        {
            f = 9;
        } else if (thick > 4)
        {
            f = 13;
        }
        if (mg != null)
        {
            mg = this.type;
        }
        var width = Math.sqrt((y1 - y0) * (y1 - y0) + (x1 - x0) * (x1 - x0)) + 2;
        if (mg == 'arrow')
        {
            mg = '<div style="width:0px;height:0px;border-top:' + (f / 2) + 'px solid transparent;border-left:' + f + 'px solid ' + colors[this.color] + ';border-bottom:' + (f / 2) + 'px solid transparent;"><!----></div>';
        } else if (mg == 'arrom')
        {
            mg = '<div style="width:0px;height:0px;border-top:' + (f / 2) + 'px solid transparent;border-right:' + f + 'px solid ' + colors[this.color] + ';border-bottom:' + (f / 2) + 'px solid transparent;"><!----></div>';
        } else if (mg == 'diamond')
        {
            mg = '<div style="width:' + (f / 1.4) + 'px;height:' + (f / 1.4) + 'px;background-color:' + colors[this.color] + ';-ms-transform:rotate(45deg);-webkit-transform:rotate(45deg);transform:rotate(45deg)"><!----></div>';
        } else
        {
            mg = '<div style="width:' + f + 'px;height:' + thick + 'px;background-color:' + colors[this.color] + '"><!----></div>';
        }

        var left = (x1 + x0) / 2 - (width) / 2 - 1;
        var top = (y1 + y0) / 2 - (f) / 2 - 1;
        var height = thick;
        if (Math.abs(x1 - x0) > Math.abs(y1 - y0))
        {
            var deg = Math.atan2(y1 - y0, x1 - x0) * 180 / 3.14159265;
        } else
        {
            var deg = -Math.atan2(x1 - x0, y1 - y0) * 180 / 3.14159265 + 90;
        }
        var ll = width - f;
        if (ll < 1)
        {
            ll = 1;
        }
        dv.style.cssText = 'z-index:0;position:absolute;left:'
                + left + 'px;top:'
                + top + 'px;width:'
                + width + 'px;height:'
                + f + 'px;-ms-transform: rotate(' + deg
                + 'deg);-webkit-transform: rotate(' + deg + 'deg);transform: rotate(' + deg + 'deg);z-index:0;padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;';
        dv.innerHTML = '<table cellpadding=0 cellspacing=0><tr height=' + f + " valign=middle><td width=" + ll + " valign=middle><div style=\"margin:0px 0px 0px 0px;width:" + ll + "px;height:" + thick + "px;background-color:" + colors[this.color] + "\"><!----></div></td><td style=\"color:" + (colors[this.color]) + "\" width=" + f + " align=center valign=middle  >" + mg + "</td></tr></table>";
        document.body.appendChild(dv);
        return dv;
    }


    this.drawl = function (x0, y0, x1, y1, thick, mg)
    {
        var dv = this.drawlo(x0, y0, x1, y1, thick, mg);
        dv.id = "l" + this.num + "_" + (this.k++);
        if (this.startnum == -1 && this.endnum == -1)
        {
            if (editable)
                Drag.init(dv);
            dv.onDragStart = function (x, y)
            {
                var tnum = parseInt(this.id.substring(1, this.id.indexOf("_")));
                current(tnum);
                allLines[tnum].x = x;
                allLines[tnum].y = y;
            }
            dv.onDragEnd = function (x, y)
            {
                var tnum = parseInt(this.id.substring(1, this.id.indexOf("_")));
                var d = (allLines[tnum].x - x) * (allLines[tnum].x - x) + (allLines[tnum].y - y) * (allLines[tnum].y - y);
                if (d > 4)
                {
                    allLines[tnum].sx += x - allLines[tnum].x;
                    allLines[tnum].sy += y - allLines[tnum].y;
                    allLines[tnum].ex += x - allLines[tnum].x;
                    allLines[tnum].ey += y - allLines[tnum].y;
                    allLines[tnum].redraw();
                } else
                {
                    mdia(tnum, 2);
                }
            }
        } else
        {
            dv.getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('div')[0].onclick = function ()
            {
                var a = this.parentNode.parentNode.parentNode;
                if (a.tagName.toLowerCase() != 'table')
                    a = a.parentNode;
                var tnum = parseInt(a.parentNode.id.substring(1, a.parentNode.id.indexOf("_")));
                mdia(tnum, 2);
            }
            var dvhead = dv.getElementsByTagName('table')[0].rows[0].cells[1].getElementsByTagName('div')[0];
            if (editable)
                Drag.init(dvhead);
            dvhead.onDragStart = function (x, y)
            {
                var a = this.parentNode.parentNode.parentNode;
                if (a.tagName.toLowerCase() != 'table')
                    a = a.parentNode;
                var tnum = parseInt(a.parentNode.id.substring(1, a.parentNode.id.indexOf("_")));
                current(tnum);
                allLines[tnum].x = x;
                allLines[tnum].y = y;
            }
            dvhead.onDragEnd = function (x, y)
            {
                var a = this.parentNode.parentNode.parentNode;
                if (a.tagName.toLowerCase() != 'table')
                    a = a.parentNode;
                var tnum = parseInt(a.parentNode.id.substring(1, a.parentNode.id.indexOf("_")));
                var d = (allLines[tnum].x - x) * (allLines[tnum].x - x) +
                        (allLines[tnum].y - y) * (allLines[tnum].y - y);
                if (d > 4)
                {
                    allLines[tnum].ex += x - allLines[tnum].x;
                    allLines[tnum].ey += y - allLines[tnum].y;
                    var num = 0;
                    for (; num < numShapes; num++)
                    {
                        if (allShapes[num] != null && allShapes[num].inbase(x, y))
                            break;
                    }
                    if (num != allLines[tnum].endnum && num < numShapes)
                    {
                        allLines[tnum].ex = x - allShapes[num].x;
                        allLines[tnum].ey = y - allShapes[num].y;
                        allLines[tnum].endnum = num;
                    }
                    allLines[tnum].redraw();
                }
            }
        }
        dv.style.zIndex = "0";
    }
    this.mdiv = function (x, y, w, h, mg)
    {
        var dv = document.createElement("div");
        if (mg == '')
            dv.style.cssText = "z-index:0;position:absolute;left:" + x + "px;top:" + y + "px;width:" + w + "px;height:" + h + "px;background-color:" + colors[this.color] + ";padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;font-size:1px";
        else
            dv.style.cssText = "z-index:0;position:absolute;left:" + x + "px;top:" + y + "px;background-color:transparent;color:" + colors[this.color] + ";padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;font-size:" + w + "px;width:" + w + "px;height:" + w + "px";
        dv.id = "l" + this.num + "_" + (this.k++);
        if (mg == '')
            dv.innerHTML = "<!---->";
        else
        {
            dv.innerHTML = mg;
        }
        if (this.startnum == -1 && this.endnum == -1)
        {

            if (editable)
                Drag.init(dv);
            dv.onDragStart = function (x, y)
            {

                var tnum = parseInt(this.id.substring(1, this.id.indexOf("_")));
                current(tnum);
                allLines[tnum].x = x;
                allLines[tnum].y = y;
            }
            dv.onDragEnd = function (x, y)
            {

                var tnum = parseInt(this.id.substring(1, this.id.indexOf("_")));
                var d = (allLines[tnum].x - x) * (allLines[tnum].x - x) +
                        (allLines[tnum].y - y) * (allLines[tnum].y - y);
                if (d > 4)
                {
                    allLines[tnum].sx += x - allLines[tnum].x;
                    allLines[tnum].sy += y - allLines[tnum].y;
                    allLines[tnum].ex += x - allLines[tnum].x;
                    allLines[tnum].ey += y - allLines[tnum].y;
                    allLines[tnum].redraw();
                } else
                    mdia(tnum, 2);
            }
        } else
        {
            dv.onclick = function ()
            {

                var tnum = parseInt(this.id.substring(1, this.id.indexOf("_")));
                mdia(tnum, 2);
            }

        }
        document.body.appendChild(dv);
        dv.style.zIndex = "-1";
    }

    this.remove = function ()
    {
        var k = 0;
        var z;
        while (true)
        {
            z = $("l" + this.num + "_" + k);
            if (z == null)
                break;
            document.body.removeChild(z);
            k++;
        }
    }
    this.delme = function ()
    {
        this.remove();
        allLines[this.num] = null;
        if (chatsessionnum == -1 && this.num == numLines - 1)
            numLines--;
    }
    this.redraw = function ()
    {
        this.remove();
        this.draw();
    }
    this.draw();
}


function Curve(ordernum, type, thick, cl, time, points)
{
    if (ordernum == null)
        this.num = numCurves;
    else
        this.num = ordernum;
    numCurves++;
    allCurves[this.num] = this;
    this.points = points;
    this.type = type;
    this.thick = thick;
    this.time = time;
    this.k = 0;
    this.kk = 0;
    this.color = cachedcurvecolor;
    if (cl != null && cl != '')
    {
        this.color = cl;

    }
    this.x = 0;
    this.y = 0;
    this.visible = 1;
    this.toString = function ()
    {
        var s = this.type + "," + this.thick + "," + this.color + "," + this.time;
        if (this.points != null && this.points.length > 0)
        {
            s += "," + this.points[0][0] + "," + this.points[0][1];
            for (var i = 1; i < this.points.length; i++)
            {
                if (Math.abs(this.points[i][0] - this.points[i - 1][0]) + Math.abs(this.points[i][1] - this.points[i - 1][1]) > 0)
                    s += "," + (this.points[i][0] - this.points[i - 1][0]) + "," + (this.points[i][1] - this.points[i - 1][1]);
            }
        }
        return s;
    }
    this.draw = function (ii)
    {
        var j = 0;
        if (ii != null)
            j = ii;
        else
            this.k = 0;
        for (var i = j; i < this.points.length - 1; i++)
        {
            if (this.points[i] == null || this.points[i + 1] == null)
                continue;
            if (this.points[i][0] == this.points[i + 1][0] && this.points[i][1] == this.points[i + 1][1])
                continue;
            this.drawLine(this.points[i][0], this.points[i][1], this.points[i + 1][0], this.points[i + 1][1]);
            if (this.type == 'mline' && ii == null && (i == 0 || this.points[i][0] != this.points[i - 1][0] || this.points[i][1] != this.points[i - 1][1]))
            {
                this.drawDot(this.points[i][0], this.points[i][1], i);
            }
        }
        i = this.points.length - 1;
        if (this.type == 'mline' && (i == 0 || this.points[i] != null && this.points[i - 1] != null && this.points[i][0] != this.points[i - 1][0] || this.points[i][1] != this.points[i - 1][1]))
        {
            this.drawDot(this.points[i][0], this.points[i][1], i);
        }
        if (ii == null && chatsessionnum > -1 && sentline == false)
        {
            parent.sendObject(chatsessionnum, this.num + " c" + this.toString());
        }
        sentline = false;
        document.onmousemove = onmouseover0;
    }

    this.drawl = function (x0, y0, x1, y1, thick)
    {
        var dv = document.createElement('div');


        if (Math.abs(x1 - x0) > Math.abs(y1 - y0))
        {
            var width = Math.sqrt((y1 - y0) * (y1 - y0) + (x1 - x0) * (x1 - x0));
            var left = x0 + (x1 - x0) / 2 - width / 2 + thick / 2;
            var top = y0 + (y1 - y0) / 2;
            var height = thick;
            var deg = Math.atan2(y1 - y0, x1 - x0) * 180 / 3.14159265;
            dv.style.cssText = 'position:absolute;left:'
                    + left + 'px;top:'
                    + top + 'px;width:'
                    + width + 'px;height:'
                    + height + "px;background-color:" + colors[this.color] + ';-ms-transform: rotate(' + deg
                    + 'deg);-webkit-transform: rotate(' + deg + 'deg);transform: rotate(' + deg + 'deg);z-index:5;padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;font-size:1px';
            document.body.appendChild(dv);
        } else //if (Math.abs(x1-x0) < Math.abs(y1-y0) )
        {
            var height = Math.sqrt((y1 - y0) * (y1 - y0) + (x1 - x0) * (x1 - x0));
            var left = x0 + (x1 - x0) / 2;
            var top = y0 + (y1 - y0) / 2 - height / 2 + thick / 2;
            var width = thick;
            var deg = -Math.atan2(x1 - x0, y1 - y0) * 180 / 3.14159265;
            dv.style.cssText = 'position:absolute;left:'
                    + left + 'px;top:'
                    + top + 'px;width:'
                    + width + 'px;height:'
                    + height + "px;background-color:" + colors[this.color] + ';-ms-transform: rotate(' + deg
                    + 'deg);-webkit-transform: rotate(' + deg + 'deg);transform: rotate(' + deg + 'deg);z-index:5;padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;font-size:1px';
            document.body.appendChild(dv);
        }

        dv.id = "c" + this.num + "_" + (this.k++);

        dv.innerHTML = "<!---->";
        Drag.init(dv);
        dv.onDragStart = function (x, y)
        {

            var tnum = parseInt(this.id.substring(1, this.id.indexOf("_")));
            current(tnum);
            allCurves[tnum].x = x;
            allCurves[tnum].y = y;
        }
        dv.onDragEnd = function (x, y)
        {

            var tnum = parseInt(this.id.substring(1, this.id.indexOf("_")));
            if (tnum + '' == 'NaN')
                return;
            var d = [allCurves[tnum].x - x, allCurves[tnum].y - y];
            var ds = d[0] * d[0] + d[1] * d[1];
            if (ds > 4)
            {
                for (var i = 0; i < allCurves[tnum].points.length; i++)
                {
                    for (var j = 0; j < 2; j++)
                    {
                        allCurves[tnum].points[i][j] -= d[j];
                    }
                }
                allCurves[tnum].redraw();
            } else
            {
                mdia(tnum, 4);
            }
        }
        document.body.appendChild(dv);
    }

    this.drawLine = function (Ax, Ay, Bx, By)
    {
        this.drawl(Ax, Ay, Bx, By, this.thick);
        return;

    }
    this.mdiv = function (x, y, w, h)
    {
        if (w == 0 || h == 0)
            return;
        var dv = document.createElement("div");
        dv.style.cssText = "z-index:1;position:absolute;left:" + x + "px;top:" + y + "px;width:" + w + "px;height:" + h + "px;background-color:" + colors[this.color] + ";padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;font-size:1px";
        dv.id = "c" + this.num + "_" + (this.k++);

        dv.innerHTML = "<!---->";
        Drag.init(dv);
        dv.onDragStart = function (x, y)
        {

            var tnum = parseInt(this.id.substring(1, this.id.indexOf("_")));
            current(tnum);
            allCurves[tnum].x = x;
            allCurves[tnum].y = y;
        }
        dv.onDragEnd = function (x, y)
        {

            var tnum = parseInt(this.id.substring(1, this.id.indexOf("_")));
            var d = [allCurves[tnum].x - x, allCurves[tnum].y - y];
            var ds = d[0] * d[0] + d[1] * d[1];
            if (ds > 4)
            {
                for (var i = 0; i < allCurves[tnum].points.length; i++)
                {
                    for (var j = 0; j < 2; j++)
                    {
                        allCurves[tnum].points[i][j] -= d[j];
                    }
                }
                allCurves[tnum].redraw();
            } else
            {
                mdia(tnum, 4);
            }
        }
        document.body.appendChild(dv);
    }

    this.drawDot = function (x, y, i)
    {
        var w = 2, h = 2;
        x--;
        y--;
        var dv = document.createElement("div");
        dv.style.cssText = "z-index:1;position:absolute;left:" + x + "px;top:" + y + "px;width:" + w + "px;height:" + h + "px;background-color:" + colors[this.color] + ";padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;font-size:1px";
        dv.id = "g" + this.num + "_" + this.kk++;
        dv.innerHTML = "<!---->";
        Drag.init(dv);
        dv.onDragStart = function (x, y)
        {

        }
        dv.onDragEnd = function (x, y)
        {

            var i = parseInt(this.id.substring(this.id.indexOf("_") + 1));
            var tnum = parseInt(this.id.substring(1, this.id.indexOf("_")));
            allCurves[tnum].points[i] = [x, y];
            allCurves[tnum].redraw();
        }
        document.body.appendChild(dv);
    }

    this.remove = function (k, r)
    {
        var z;
        if (k == null)
        {
            for (k = 0; k < this.k; k++)
                if ((z = $('c' + this.num + "_" + k)) != null)
                    document.body.removeChild(z);
            for (k = 0; k < this.kk; k++)
                if ((z = $('g' + this.num + "_" + k)) != null)
                    document.body.removeChild(z);
        } else
        {

            if (k < this.k && r == 'c')
            {
                z = $('c' + this.num + "_" + k);
                if (z != null)
                    document.body.removeChild(z);
                // var s = "allCurves[" + this.num + "].remove(" + (k + 1) + ",'c')";
                this.remove(k + 1, 'c');
                //setTimeout(s, 5);
            } else if (k == this.k && r == 'c')
            {
                if (this.type == 'mline')
                    this.remove(0, 'g');
                else
                    this.draw();
            } else if (k < this.kk && r == 'g')
            {
                z = $('g' + this.num + "_" + k);
                if (z != null)
                    document.body.removeChild(z);
                this.remove(k + 1, 'g');
                // var s = "allCurves[" + this.num + "].remove(" + (k + 1) + ",'g')";
                //setTimeout(s, 5);
            } else if (k == this.kk && r == 'g')
            {
                this.draw();
            }
        }
    }
    this.delme = function ()
    {
        this.remove();
        allCurves[this.num] = null;
        if (chatsessionnum == -1 && this.num == numCurves - 1)
            numCurves--;
    }
    this.redraw = function ()
    {
        this.remove(0, 'c');
    }
    this.draw();
}




function current(lnum)
{
    currentlnum = lnum;
}
function redrawl(x, y)
{
    var l = allLines[currentlnum];
    if (l.startnum == -1)
    {
        l.sx = x;
        l.sy = y;

    }

    l.redraw();
    canceldia(currentlnum, 2);
}
function redraw2(num, d)
{
    var l = allLines[num];
    l.direct = d;
    l.redraw();
    canceldia(num, 2);
}

function removehint(t, hint)
{
    if (t.value == hint)
    {
        t.style.color = 'black';
        t.value = '';
    }
}

function showhint(t, hint)
{
    if (t.value == '')
    {
        t.style.color = 'grey';
        t.value = hint;
    }
}

function mdia(num, cd)
{
    var mss = textmsg[1786].split(/@/);
    var xs = textmsg[1773].split(/@/);
    if (num < 0 || cd == 1 && num >= allShapes.length || cd == 2 && num >= allLines.length)
    {
        myprompt(textmsg[1657] + "<br>" + num + "," + cd);

        return;
    }

    if (cd != cdbeing && cdbeing != -1)
        return;
    if (cd == 0 && numsselected != null && numsselected.length == 1)
        return;
    cdbeing = cd;
    if (numsselected == null)
    {
        numsselected = [];
    }

    for (var i = 0; i < numsselected.length; i++)
        if (numsselected[i] == num)
            break;
    if (i == numsselected.length)
    {
        numsselected[i] = num;
    }
    if (hasone != null)
        document.body.removeChild(hasone);
    var dv = document.createElement("div");
    hasone = dv;
    dv.style.cssText = "position:absolute;left:" + myHintx + "px;top:" + myHinty + "px;background-color:#000;border:1px #111111 outset;background-color:#dddddd;z-index:" + (2 * numShapes + 2);
    var str = "<table style=\"font-size:12px\" border=0><tr><td  >               </td></tr>";
    if (editable && cd == 1)
    {
        str += "<tr id=mdiatitle><td><table align=center   cellspacing=0 cellpadding=0><tr><td align=left>(#" + num + ")&nbsp;</td><td  style=color:blue onclick=edit(" + num + ")>" + xs[0] + "</td></tr></table></td></tr>";
    }
    if (editable && cd == 2)
    {
        str += "<tr id=mdiatitle><td><table align=center   cellspacing=0 cellpadding=0><tr><td align=left>(#" + num + ")&nbsp;</td><td  style=color:blue  > </td></tr></table></td></tr>";
    }
    if (cd == 1)
    {
        str += "<tr><td><table align=center   cellspacing=0 cellpadding=0 border=1><tr>";
        str += "<td   valign=middle align=center width=14  style=color:blue onclick=redraw3(" + num + ",'rightrect'," + cd + ")><img width=10 style=\"border:1px black solid\" src=\"" + originalurl + "/image/rightrect.png\"></td>";
        str += "<td   valign=middle align=center width=14 ><img style=\"border:0px;width:13px;height:10px\"  src=\"" + originalurl + "/image/roundrect.png\" onclick=redraw3(" + num + ",'roundrect'," + cd + ") > </td>";
        str += "<td   valign=middle align=center width=14  style=font-size:12px;color:blue  onclick=redraw3(" + num + ",'ellipse'," + cd + ")>O</td>";
        str += "<td   valign=middle align=center width=14 style=font-size:14px;color:blue   onclick=redraw3(" + num + ",'diamond'," + cd + ")>" + diamondchar + "</td>";
        str += "</tr></table></td></tr>";
    } else if (cd == 5)
    {
        //str += "<tr><td>" + textmsg[1639].split(/@/)[4] + "</td></tr>";
        str += "<tr><td align=center><select name=selfont onchange=selectfontname(this)>";
        var fns = textmsg[1594].split(/@/);
        var ii = 0;
        for (var l = 0; l < fns.length; l++)
        {
            str += "<option value=\"" + fns[l] + "\"  " + (samefont(cachedfontfamily, fns[l]) ? 'selected' : '') + ">" + fns[l].replace(/,.*/, '') + "</option>"

        }
        str += "</select></td></tr>"
    }
    if (cd == 1 || cd == 5)
    {
        var mini = -1;
        if (cd == 5)
        {
            str += "<tr><td><table align=center cellpadding=0 cellspacing=0><tr><td><nobr>" + mss[1] + "</nobr></td><td id=orient style=color:blue onclick=changeorient(this)>&uarr;</td></tr></table></td></tr>";
        } else
        {
            var tt = parseInt(allShapes[num].div.style.fontSize.replace(/px/, ''));
            var minm = 1000000;
            if (cd == 1)
                for (var i = 0; i < allfonts.length; i++)
                {
                    if (minm > Math.abs(allfonts[i] - tt))
                    {
                        minm = Math.abs(allfonts[i] - tt);
                        mini = i;
                    }
                }
        }
        str += "<tr><td><table align=center cellpadding=0 cellspacing=0 border=1><tr height=14>";
        for (var i = 0; i < allfonts.length; i++)
        {
            str += "<td width=14 align=center valign=middle style=\"color:blue;font-size:13px";
            if (mini == i)
                str += ";font-weight:700";
            str += "\"  onclick=\"changefont(this," + num + "," + cd + "," + i + ")\">" + allfonts[i] + "</td>\n";
            if (i == allfonts.length / 2 - 1)
            {
                str += "</tr>\n<tr height=14>";
            }
        }
        str += "</tr></table></td></tr>";
    } else if (cd == 2)
    {
        str += "<tr><td align=center><table align=center cellpadding=0 cellspacing=0 border=1><tr height=14>";//changefont(this," + num  + ")>";
        for (i = 0; i < 4; i++)
        {

            str += "<td width=14 align=center valign=middle ";
            if (allLines[num].type == arrows[i])
                str += "style=\"border:2px #222222 inset\"";
            var pn = picname(arrows[i]);
            if (pn == '')
                pn = '-';
            else if (pn == 'arrow')
                pn = '>';
            str += "  onclick=changelinetype(" + i + "," + num + "," + cd + ")><nobr>-" + pn + "</nobr></td>\n";
        }
        str += "</tr></table></td></tr>";

        str += "<tr><td  align=center><table align=center cellpadding=0 cellspacing=0 border=1><tr height=14>";//changefont(this," + num  + ")>";
        for (i = 1; i <= 4; i++)
        {
            str += "<td width=14 align=center valign=middle ";
            if (allLines[num].thick == i)
                str += "style=\"border:2px #222222 inset\"";
            str += "  onclick=changethick(" + i + "," + num + "," + cd + ")><div style=\"width:12px;height:" + i + "px;background-color:" + colors[allLines[num].color] + "\">" + fillblank + "</div></td>\n";
        }
        str += "</tr></table></td></tr>";
    } else if (cd == 4)
    {
        str += "<tr><td  align=center><table align=center cellpadding=0 cellspacing=0 border=1><tr height=14>";//changefont(this," + num  + ")>";
        for (i = 1; i <= 4; i++)
        {
            str += "<td width=14 align=center valign=middle ";
            if (allCurves[num].thick == i)
                str += "style=\"border:2px #222222 inset\"";
            str += "  onclick=changethick(" + i + "," + num + "," + cd + ")><div style=\"width:12px;height:" + i + "px;background-color:" + colors[allCurves[num].color] + "\">" + fillblank + "</div></td>\n";
        }
        str += "</tr></table></td></tr>";
    }
    if (cd == 1 || cd == 0 || cd == 5)
    {
        var ww = 14;
        if (cd == 0)
            ww = 19;
        var hold = bcolors[bcolors.length - 1];
        bcolors[bcolors.length - 1] = "transparent";
        if (cd == 1)
            var vv = allShapes[num].bcolor;
        else if (cd == 0)
            vv = hexcolor(document.body.style.backgroundColor);
        else
            vv = -1;
        if (cd == 5)
        {
            str += "<tr  valign=bottom><td  align=center><table align=center cellpadding=0 cellspacing=0 ><tr><td><nobr>" + mss[2] + "</nobr></td><td><input  id=hiddencolorb type=color style=\"width:1px;visibility:hidden;height:10px\" onchange=changethatcolor(this,'b')></td></tr></table></td></tr>";
        }
        str += "<tr><td  valign=top><table align=center cellpadding=0 cellspacing=0 border=1><tr height=" + ww + ">";

        for (i = 0; i < bcolors.length; i++)
        {
            str += "<td width=" + ww + " style=\"background-color:" + bcolors[i]
            if ((cd == 1 && (vv == i % 100 || vv - i * 100 < 100 && vv >= 100)) || (cd == 0 && vv == hexcolor(bcolors[i])))
                str += ";border:1px #222222 solid";
            else
                str += ";border:1px transparent solid"
            str += "\"  onclick=changecolorb(this," + num + "," + cd + "," + i + ")><!----></td>\n";
            if (i == bcolors.length / 2 - 1)
            {
                str += "</tr>\n<tr height=" + ww + ">";
            }
        }
        bcolors[bcolors.length - 1] = hold;
        str += "</tr></table></td></tr>";
    }

    if (cd == 1 || cd == 2 || cd == 4 || cd == 5)
    {
        if (cd == 5)
        {
            str += "<tr  valign=bottom><td ><table align=center cellpadding=0 cellspacing=0 ><tr><td><nobr>" + mss[3] + "</nobr></td><td><input id=hiddencolorf type=color style=\"width:1px;height:15px;height:10px;visibility:hidden\" onchange=changethatcolor(this,'f')></td></tr></table></td></tr>";
        }
        str += "<tr  valign=bottom><td><table align=center cellpadding=0 cellspacing=0 border=1><tr height=" + 14 + ">";
        var uu = -1;
        if (cd == 1)
            uu = allShapes[num].color;
        else if (cd == 2)
            uu = allLines[num].color;
        else if (cd == 4)
            uu = allCurves[num].color;
        for (i = 0; i < colors.length; i++)
        {
            str += "<td width=" + 14 + " align=center valign=middle style=\"font-size:15px;font-weight:700;color:" + colors[i]
            if (uu == i)
                str += ";border:1px #222222 solid";
            else
                str += ";border:1px transparent solid";
            str += "\"  onclick=changecolor(this," + num + "," + cd + "," + i + ")>" + ((cd == 1 || cd == 5) ? 'a' : ('<div style=background-color:' + colors[i] + ";width:13px;height:3px><!----></div>")) + "</td>\n";
            if (i == colors.length / 2 - 1)
            {
                str += "</tr>\n<tr height=14>";
            }
        }
        str += "</tr></table></td></tr>";
    }
    if (cd == 1)
    {
        //if ( allShapes[num].shapename != 'diamond' ) 
        {
            str += "<tr><td style=\"padding:0px 0px 0px 0px\" ><input style=\"margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;width:14px;color:blue\" name=framec type=checkbox " + (((allShapes[num].fc & 1) > 0) ? 'checked' : '') + " onclick=\"changeframecolor(" + num + ",this)\">" + xs[1] + "</td></tr>";
        }
        if (allShapes[num].isrect() || allShapes[num].shapename == 'ellipse')
        {
            str += "<tr><td style=\"padding:0px 0px 0px 0px\" ><input style=\"margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;width:14px;color:blue\" name=shadow type=checkbox " + (((allShapes[num].fc & 2) > 0) ? 'checked' : '') + " onclick=\"changeshadow(" + num + ",this)\">" + xs[2] + "</td></tr>";
        }

        str += "<tr><td style=\"padding:0px 0px 0px 0px\" ><input style=\"margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;width:14px;color:blue\" name=tshadow type=checkbox " + (((allShapes[num].fc & 4) > 0) ? 'checked' : '') + " onclick=\"changeTshadow(" + num + ",this)\">" + xs[14] + "</td></tr>";
        if (allShapes[num].isrect() || allShapes[num].shapename == 'ellipse')
        {
            str += "<tr><td style=\"padding:0px 0px 0px 0px\" ><input style=\"margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;width:14px;color:blue\" name=tgrad type=checkbox " + (((allShapes[num].fc & 8) > 0) ? 'checked' : '') + " onclick=\"changegradient(" + num + ",this)\">" + mss[4] + "</td></tr>";
        }
    }
    var NN = 0;
    str += '<tr><td><table align=center width=70>';
    if (cd == 1)
    {
        if (allShapes[num].words.indexOf("<img ") > 0)
            if (editable)
            {
                if (NN % 2 == 0)
                    str += '<tr>';
                str += "<td   style=color:blue onclick=delpic(" + num + ")>" + xs[12] + "</td>";
                if ((++NN % 2) == 0)
                    str += '</tr>';
            }
        if (NN % 2 == 0)
            str += '<tr>';
        str += "<td   style=color:blue onclick=\"hideShape(" + num + ");canceldia(" + num + ",1);\"> " + ((allShapes[num].visible == 1) ? xs[3] : 'Show') + "</td>";
        if ((++NN % 2) == 0)
            str += '</tr>';
        if (allShapes[num].shapename == 'rightrect' && issql(allShapes[num].words))
        {
            if (NN % 2 == 0)
                str += '<tr>';
            str += " <td   style=color:blue onclick=dosql(" + num + ")>SQL</td> ";
            if ((++NN % 2) == 0)
                str += '</tr>';
        } else if (allShapes[num].shapename == 'rightrect' && iscpp(allShapes[num].words))
        {
            if (NN % 2 == 0)
                str += '<tr>';
            str += "<td   style=color:blue onclick=docpp(" + num + ")>C++H</td>";
            if ((++NN % 2) == 0)
                str += '</tr>';
        }
        if (numsselected.length > 1 && achain())
        {
            if (NN % 2 == 0)
                str += '<tr>';
            str += "<td   style=color:blue onclick=alignchain()>" + textmsg[1785] + "</td>";
            if ((++NN % 2) == 0)
                str += '</tr>';
        }
    } else if (cd == 2)
    {

        str += "<tr><td colspan=2  align=center style=\"border:1px #555555 solid;padding:0px;width:100%\"><table align=center  width=100%  cellspacing=0 cellpadding=0 border=0><tr height=17>";
        str += "<td   valign=middle align=center width=37 " + (allLines[num].direct == 0 ? 'style="border:2px #333333 solid"' : '') + " onclick=redraw2(" + num + ",0)><div style=\"background-color:blue;width:35;height:2px;transform: rotate(30deg);\"><!----></div></td>"
        str += "<td   valign=middle align=center width=20 ></td>";
        str += "<td   valign=bottom align=right width=30 " + (allLines[num].direct > 0 ? 'style="border-left:2px #333333 solid;border-top:2px #333333 solid;border-bottom:2px #333333 solid"' : '') + "  onclick=redraw2(" + num + ",1)><div style=\"background-color:blue;width:28;height:2px\"><!----></div></td>"
        str += "<td   valign=bottom align=left width=2 " + (allLines[num].direct > 0 ? 'style="border-right:2px #333333 solid;border-top:2px #333333 solid;border-bottom:2px #333333 solid"' : '') + "  onclick=redraw2(" + num + ",1)><div style=\"background-color:blue;width:2;height:15px\"><!----></div></td>"
        str += "</tr></table></td></tr>";
    } else if (cd == 0)
    {
        str += "<tr><td  colspan=2>" + textmsg[1493] + "</td></tr>";
        var a = getdocbg();
        var fc = 'black';
        if (a == '') {
            fc = 'grey';
            a = 'http://...';
        }
        str += "<tr><td colspan=2><input id=bgurl onchange=setdocbg(this.value) onfocus=removehint(this,'" + a + "') onblur=showhint(this,'" + a + "') style=\"width:82px;font-size:10px;color:" + fc + "\" value=\"" + a + "\"></td></tr>";
        var z = $("selpage");
        if (z != null)
        {
            var xx = '';
            for (i = 0; i < z.options.length - 1; i++)
                if (i != pagenum)
                    xx += "<option value=" + i + ">P" + (i + 1) + "</option>";

            if (numShapes > 0 && xx != '')
            {
                str += "<tr><td  colspan=2>" + xs[13] + "<select onchange=\"mergeto(this)\"  style=\"border:0px;background-color:white \"  onclick=showoptions(this)  ><option value=-1> </option>" + xx + "</select></td></tr>";
            }
            var yy = '';
            var j = 0;
            for (i = 0; i < numShapes; i++)
            {
                if (allShapes[i] != null && allShapes[i].visible == 0)
                {
                    if (yy == '')
                        yy = "<tr><td  colspan=2><table cellspacing=0 cellpadding=0 border=1>";
                    if (j % 2 == 0)
                        yy += "<tr height=26>";
                    xx = tblname(i);
                    if (xx.length > 7)
                        xx = xx.substring(0, 7) + "..";

                    yy += "<td  colspan=2 align=center valign=middle width=41  style=\"background:url(" + originalurl + "/image/" + allShapes[i].shapename
                            + ".png) repeat:no-repeat;font-size:10px;background-position:0 0;color:blue\" onclick=\"hideShape(" + i + ");canceldia(0,0)\">" + xx + "</td>";

                    if (j % 2 == 1)
                        yy += "</tr>";
                    j++;
                }

            }

            if (yy != '')
            {
                if (j % 2 == 0)
                {
                    str += "<td width=30  colspan=2> </td></tr>";
                }
                str += yy + "</table></td></tr>";
            }

        }

    }


    if (editable && cd == 1)
    {
        if ((NN % 2) == 0)
            str += '<tr>';
        str += "<td   style=color:blue onclick=copyshape(" + num + ")>" + xs[4] + "</td>";
        if ((++NN % 2) == 0)
            str += '</tr>';
    }
    if (editable && (cd == 1 || cd == 2 || cd == 4))
    {
        if ((NN % 2) == 0)
            str += '<tr>';
        str += "<td   style=color:blue onclick=dodelete(" + num + "," + cd + ")>" + xs[5] + "</td>";
        if ((++NN % 2) == 0)
            str += '</tr>';
    }
    if (editable && cd == 0 && cutshape != null)
    {
        if ((NN % 2) == 0)
            str += '<tr>';
        str += "<td   style=color:blue onclick=pasteshape()>" + xs[7] + "</td>";
        if ((++NN % 2) == 0)
            str += '</tr>';
    }
    if (cd == 3)
    {
        var xt = $("toolbar");
        if (xt.style.position == null || xt.style.position.toLowerCase() != 'absolute')
        {
            if ((NN % 2) == 0)
                str += '<tr>';
            str += "<tr><td   style=color:blue onclick=allowmove(0)>" + xs[8] + "</td></tr>";
            if ((++NN % 2) == 0)
                str += '</tr>';
        } else
        {
            if ((NN % 2) == 0)
                str += '<tr>';
            str += "<tr><td   style=color:blue onclick=allowmove(0)>" + xs[8] + "</td></tr>";
            str += "<tr><td   style=color:blue onclick=allowmove(1)>" + xs[9] + "</td></tr>";
            if ((++NN % 2) == 0)
                str += '</tr>';
        }
    }
    if ((NN % 2) == 0)
        str += '<tr>';
    str += "<td   style=color:blue onclick=canceldia(" + num + "," + cd + ")>" + xs[6] + "</td>";
    if ((++NN % 2) == 0)
        str += '</tr>';
    str += "</table></td></tr></table>";

    dv.innerHTML = str;
    dv.id = "m" + num + "_" + cd;

    document.body.appendChild(dv);
    if (cd != 0)
        Drag.init($('mdiatitle'), dv);
    else
        dv.style.top = '0px';
    //dv.onDragEnd = function(x,y) {buttonclick = false;};
}



function achain()
{

    var l = 0;
    if (numsselected == null || numsselected.length < 2)
        return false;

    while (l < numsselected.length - 1)
    {
        var k = 0;
        for (; k < allLines.length; k++)
        {
            if (allLines[k].startnum == numsselected[l] && numsselected[1 + l] == allLines[k].endnum)
                break;
        }
        if (k == allLines.length)
            return false;
        if (allShapes[allLines[k].endnum] == null)
            return false;
        l++;
    }
    return true;

}
function alignchain()
{
    var i = numsselected[0];
    var j = numsselected[numsselected.length - 1];
    var x0 = allShapes[i].x + allShapes[i].base.offsetWidth / 2;
    var y0 = allShapes[i].y + allShapes[i].base.offsetHeight / 2;
    var x1 = allShapes[j].x + allShapes[j].base.offsetWidth / 2;
    var y1 = allShapes[j].y + allShapes[j].base.offsetHeight / 2;
    var x = [], y = [];
    var di = 'v';
    if (Math.abs(x1 - x0) < Math.abs(y1 - y0))
    {
        x[0] = allShapes[i].x;
        y[0] = allShapes[i].y;
        for (i = 1; i < numsselected.length; i++)
        {
            x[i] = x0 - allShapes[numsselected[i]].base.offsetWidth / 2;

            y[i] = y[i - 1] + allShapes[numsselected[i - 1]].base.offsetHeight + Math.round(0.7 * (allShapes[numsselected[i]].fontsize + allShapes[numsselected[i - 1]].fontsize));
        }
    } else
    {
        di = 'h';
        x[0] = allShapes[i].x;
        y[0] = allShapes[i].y;
        for (i = 1; i < numsselected.length; i++)
        {
            y[i] = y0 - Math.round(allShapes[numsselected[i]].base.offsetHeight / 2);
            x[i] = x[i - 1] + allShapes[numsselected[i - 1]].base.offsetWidth + Math.round(0.7 * (allShapes[numsselected[i]].fontsize + allShapes[numsselected[i - 1]].fontsize));
        }
    }
    for (i = 1; i < numsselected.length; i++)
    {

        allShapes[numsselected[i]].move(x[i], y[i], 1);
        var k = 0;
        for (; k < allLines.length; k++)
        {
            if (allLines[k].startnum == numsselected[i - 1] && numsselected[i] == allLines[k].endnum)
            {
                if (di == 'v')
                {
                    allLines[k].sx = allShapes[ numsselected[i - 1]].base.offsetWidth / 2;
                    allLines[k].sy = allShapes[numsselected[i - 1]].base.offsetHeight;
                    allLines[k].ex = allShapes[numsselected[i]].base.offsetWidth / 2;
                    allLines[k].ey = 0;
                } else
                {
                    allLines[k].sx = allShapes[ numsselected[i - 1]].base.offsetWidth;
                    allLines[k].sy = allShapes[numsselected[i - 1]].base.offsetHeight / 2;
                    allLines[k].ex = 0;
                    allLines[k].ey = allShapes[numsselected[i]].base.offsetHeight / 2;
                }
                break;
            }
        }
        allLines[k].redraw();
    }


}

function d1(m)
{
    var mstr = '' + Math.round(m * 10);
    mstr = mstr.replace(/\..*$/, '');
    mstr = mstr.replace(/(.)$/, '.$1');
    mstr = mstr.replace(/\.0$/, '');
    return mstr;
}
function selectget(td)
{
    var or;
    var nw = -1;
    if (!isNaN(td.innerHTML))
        nw = parseInt(td.innerHTML);
    if (itemaredoing == 't')
    {
        for (var i = 0; i < numaredoing.length; i++)
        {
            or = parseInt(selectedtds['t'][i].innerHTML);
            if (nw >= 0)
            {
                selectedtds['t'][i].innerHTML = '' + nw;
                allShapes[numaredoing[i]].time = nw + (allShapes[numaredoing[i]].time - Math.floor(allShapes[numaredoing[i]].time));
            }
            selectedtds['t'][i].style.backgroundColor = '#000000';
        }
        selectedtds['t'] = null;
        numaredoing = [];
    } else if (itemaredoing == 'dt')
    {
        for (var i = 0; i < numaredoing.length; i++)
        {
            if (nw >= 0)
            {
                selectedtds['dt'][i].innerHTML = '.' + nw;
                allShapes[numaredoing[i]].time = Math.floor(allShapes[numaredoing[i]].time) + nw / 10.0;
            }
            selectedtds['dt'][i].style.backgroundColor = 'white';
        }
        selectedtds['dt'] = null;

    } else if (itemaredoing == 'do')
    {
        for (var i = 0; i < numaredoing.length; i++)
        {
            if (nw >= 0)
            {
                selectedtds['do'][i].innerHTML = '.' + nw;
                allShapes[numaredoing[i]].start = Math.floor(allShapes[numaredoing[i]].start) + nw / 10.0;
            }
            selectedtds['do'][i].style.backgroundColor = 'white';
        }
        selectedtds['do'] = null;

    } else if (itemaredoing == 'p')
    {
        if (nw >= 0)
            tdaredoing.innerHTML = '' + nw;

    } else if (itemaredoing == 'o')
    {
        for (var i = 0; i < numaredoing.length; i++)
        {
            or = parseInt(selectedtds['o'][i].innerHTML);
            selectedtds['o'][i].style.backgroundColor = 'white';
            if (nw >= 0)
            {
                selectedtds['o'][i].innerHTML = '' + nw;
                allShapes[numaredoing[i]].start = nw + (allShapes[numaredoing[i]].start - Math.floor(allShapes[numaredoing[i]].start));
            }
        }
        selectedtds['o'] = null;

    } else if (itemaredoing == 'z')
    {
        for (var i = 0; i < numaredoing.length; i++)
        {
            if (nw > -1)
            {
                selectedtds['z'][i].innerHTML = '' + nw;
                allShapes[numaredoing[i]].zindex = nw;
                allShapes[numaredoing[i]].uniz();

            }
            selectedtds['z'][i].style.backgroundColor = 'white';
        }
        selectedtds['z'] = null;
    }
    numaredoing = [];
    var tbl = td.parentNode.parentNode;
    if (tbl.tagName.toLowerCase() != 'table')
        tbl = tbl.parentNode;
    tbl = tbl.parentNode;
    document.body.removeChild(tbl);
    if (itemaredoing == 'p')
        return;
    var m = 0;
    for (var i = 0; i < numShapes; i++)
    {
        if (allShapes[i] == null)
            continue;
        var d = allShapes[i].start + allShapes[i].time;
        if (m < d)
            m = d;
    }
    var q = $('totaltime');

    if (q != null)
        q.innerHTML = '' + d1(m);
}
function lessnum(td)
{
    var tr = td.parentNode.parentNode;
    if (tr.tagName.toLowerCase() != 'table')
        tr = tr.parentNode;
    var n = parseInt(tr.rows[2].cells[0].innerHTML);
    n -= 20;
    if (n < 0)
        n = 0;
    for (var i = 2; i < 22; i++)
        tr.rows[i].cells[0].innerHTML = '' + (n + i - 2);
}
function addmorenum(td)
{
    var tr = td.parentNode.parentNode;
    if (tr.tagName.toLowerCase() != 'table')
        tr = tr.parentNode;
    var n = parseInt(tr.rows[21].cells[0].innerHTML) + 1;
    for (var i = 2; i < 22; i++)
        tr.rows[i].cells[0].innerHTML = '' + (n + i - 2);
}
function selectnum(td, arr, z)
{
    tdaredoing = td;
    var x = document.createElement('div');
    var n = parseInt(td.innerHTML);
    var xy = findPositionnoScrolling(td);
    var zd = (promptwin == null) ? (4 * numShapes + 100) : (parseInt(promptwin.style.zIndex) + 1);

    x.style.cssText = 'position:absolute;left:' + (xy[0] - 90) + 'px;z-index:' + zd + ';border:1px grey solid;background-color:lightyellow';


    var str = '<table width=60>';
    str += '<tr><td align=right onclick=selectget(this)  >' + textmsg[18] + '</td></tr>';
    if (arr.length == 20)
        str += '<tr><td align=right onclick=lessnum(this)  >---</td></tr>';
    var j = 0;
    for (var i = 0; i < arr.length; i++)
    {
        str += '<tr><td align=right onclick=selectget(this)  >' + (arr[i]) + '</td></tr>';
        if (arr[0] >= 0 && arr[i] == n)
            j = i;
    }
    if (arr.length == 20)
        str += '<tr><td align=right onclick=addmorenum(this)  >+++</td></tr>';
    str += '</table>';

    x.innerHTML = str;
    document.body.appendChild(x);
    var y1 = x.offsetHeight / arr.length;
    if (arr[0] < 0)
        j = arr.length / 2;
    var y = xy[1] - y1 * j;
    if (y < 30)
        y = 30;
    x.style.top = y + 'px';
}
function changetm(td, num)
{
    if (selectedtds['o'] != null || selectedtds['z'] != null || selectedtds['do'] != null || selectedtds['dt'] != null)
        return;
    var has = true;
    td.style.backgroundColor = '#777777';
    if (selectedtds['t'] == null)
    {
        selectedtds['t'] = [];
        numaredoing = [];
        has = false;
    }
    for (var i = 0; i < selectedtds['t' ].length; i++)
        if (td == selectedtds['t' ][i])
        {
            if (selectedtds['t' ].length == 1)
                selectedtds['t' ] = null;
            else
                selectedtds['t' ].splice(i, 1);
            td.style.backgroundColor = '#ffffff';
            numaredoing.splice(i, 1);
            return;
        }
    selectedtds['t'][selectedtds['t'].length] = td;
    numaredoing[numaredoing.length] = num;
    var arr = [];
    var k = parseInt(td.innerHTML);
    k -= 10;
    if (k < 0)
        k = 0;
    itemaredoing = 't';
    for (var i = 0; i < 20; i++)
        arr[arr.length] = k + i;

    if (!has)
        selectnum(td, arr);
}
function changeplaytime(td)
{
    numaredoing = [];
    itemaredoing = 'p';
    var k = parseInt(td.innerHTML) - 10;
    if (k < 0)
        k = 0;
    var arr = [];
    for (var i = 0; i < 20; i++)
        arr[arr.length] = i + k;
    selectnum(td, arr);
}
var selectedtds = new Array();
function changeZ(td, num)
{
    if (selectedtds['o'] != null || selectedtds['t'] != null || selectedtds['do'] != null || selectedtds['dt'] != null)
        return;
    var has = true;
    td.style.backgroundColor = '#777777';
    if (selectedtds['z'] == null)
    {
        selectedtds['z'] = [];
        has = false;
    }
    for (var i = 0; i < selectedtds['z'].length; i++)
        if (td == selectedtds['z'][i])
        {
            if (selectedtds['z' ].length == 1)
                selectedtds['z' ] = null;
            else
                selectedtds['z' ].splice(i, 1);
            td.style.backgroundColor = '#ffffff';
            numaredoing.splice(i, 1);
            return;
        }
    selectedtds['z'][selectedtds['z'].length] = td;
    numaredoing[numaredoing.length] = num;
    itemaredoing = 'z'
    var arr = [];
    for (var i = 0; i < numShapes; i++)
        arr[arr.length] = i;
    arr[arr.length] = 110;
    arr[arr.length] = 111;
    arr[arr.length] = 112;
    arr[arr.length] = 113;
    if (!has)
        selectnum(td, arr);
}
function changedecimal(td, num, x)
{
    if (selectedtds['z'] != null || selectedtds['o'] != null || selectedtds['t'] != null || selectedtds['do'] != null && x == 't' || selectedtds['dt'] != null && x == 'o')
        return;
    var has = true;
    if (selectedtds['d' + x] == null)
    {
        selectedtds['d' + x] = [];
        has = false;
    }
    for (var i = 0; i < selectedtds['d' + x].length; i++)
        if (td == selectedtds['d' + x][i])
        {
            if (selectedtds['d' + x].length == 1)
                selectedtds['d' + x] = null;
            else
                selectedtds['d' + x].splice(i, 1);
            td.style.backgroundColor = '#ffffff';
            numaredoing.splice(i, 1);
            return;
        }
    selectedtds['d' + x][selectedtds['d' + x].length] = td;
    numaredoing[numaredoing.length] = num;
    itemaredoing = 'd' + x;
    td.style.backgroundColor = '#777777';
    var arr = [];

    for (var i = 0; i < 10; i++)
        arr[arr.length] = i;
    if (!has)
        selectnum(td, arr);
}
function changeord(td, num)
{
    if (selectedtds['z'] != null || selectedtds['t'] != null || selectedtds['do'] != null || selectedtds['dt'] != null)
        return;
    var has = true;
    td.style.backgroundColor = '#777777';
    if (selectedtds['o'] == null)
    {
        has = false;
        selectedtds['o'] = [];
    }
    for (var i = 0; i < selectedtds['o'].length; i++)
        if (td == selectedtds['o' ][i])
        {
            if (selectedtds['o' ].length == 1)
                selectedtds['o' ] = null;
            else
                selectedtds['o' ].splice(i, 1);
            td.style.backgroundColor = '#ffffff';
            numaredoing.splice(i, 1);
            return;
        }
    selectedtds['o'][selectedtds['o'].length] = td;
    numaredoing[numaredoing.length] = num;
    itemaredoing = 'o';
    var k = parseInt(td.innerHTML);
    k -= 10;
    if (k < 0)
        k = 0;
    var arr = [];
    for (var i = 0; i < 20; i++)
        arr[arr.length] = k + i;
    if (!has)
        selectnum(td, arr);
}

function showoptions(sel)
{

    //if(browserstr.indexOf("Chrome")>=0)
    {
        var xys = findPositionnoScrolling(sel, window);
        var tbl = document.createElement('table');
        tbl.style.border = "1px #b0b0b0 outset";
        for (var i = 0; i < sel.options.length; i++)
        {
            var row = tbl.insertRow(i);
            var cell = row.insertCell(0);
            if (i == 0)
                cell.innerHTML = '&nbsp;&nbsp;';
            else
                cell.innerHTML = sel.options[i].text;
            cell.onclick = function () {
                pickthis(this);
            }

        }
        tbl.style.zIndex = '30';
        tbl.style.position = 'absolute';
        tbl.style.top = xys[1] + 'px';
        tbl.style.left = xys[0] + 'px';
        document.body.appendChild(tbl);
    }
}
function changelinetype(i, num, cd)
{
    hassaved = false;

    for (var j = 0; j < numsselected.length; j++)
    {
        num = numsselected[j];
        if (cd == 4)
        {
            allCurves[num].remove();
            allCurves[num].type = arrows[i];
            allCurves[num].draw();
        } else
        {
            allLines[num].remove();
            allLines[num].type = arrows[i];
            allLines[num].draw();
        }
        sendObject(num);
    }
}
function changethick(i, num, cd)
{
    hassaved = false;
    cachedlinethick = i;
    if (numsselected == null)
    {
        numsselected = [];
    }
    for (var j = 0; j < numsselected.length; j++)
    {
        num = numsselected[j];
        if (cd == 4)
        {
            allCurves[num].thick = i;
            allCurves[num].redraw();
        } else
        {
            allLines[num].thick = i;
            allLines[num].redraw();
        }
        sendObject(num);
    }
}
function changeframecolor(num, fc)
{
    hassaved = false;

    for (var i = 0; i < numsselected.length; i++)
    {
        num = numsselected[i];
        var j = allShapes[num].fc;
        if (fc.checked && (j & 1) == 0)
            j++;
        else if (fc.checked == false && (j & 1) == 1)
            j--;
        cachedfc = j;
        allShapes[num].fc = j;

        allShapes[num].resetup();
        sendObject(num);
    }
}
function changegradient(num, fc)
{
    hassaved = false;

    for (var i = 0; i < numsselected.length; i++)
    {
        num = numsselected[i];
        var z = allShapes[num];
        var j = z.fc;
        if (fc.checked && (j & 8) == 0)
            j += 8;
        else if (fc.checked == false && (j & 8) == 8)
            j -= 8;
        cachedfc = j;
        z.fc = j;

        if (z.isrect())
        {
            if ((j & 8) > 0)
            {
                z.base.style.backgroundImage = gradient(bcolors[z.bcolor]);
                z.div.style.backgroundColor = 'transparent';
            } else
            {
                z.base.style.backgroundImage = null;
                z.base.style.backgroundColor = bcolors[z.bcolor];
            }
        } else if (z.shapename == 'ellipse')
        {
            var dv = z.base.getElementsByTagName('div')[0];
            if ((j & 8) == 8)
            {
                dv.style.backgroundImage = gradient(bcolors[z.bcolor]);
                dv.style.backgroundColor = null;
                z.div.style.backgroundColor = 'transparent';
            } else
            {
                dv.style.backgroundColor = bcolors[z.bcolor];
                dv.style.backgroundImage = null;
            }
        }

        allShapes[num].resetup();
        sendObject(num);
    }
}
function changeTshadow(num, fc)
{

    for (var i = 0; i < numsselected.length; i++)
    {
        num = numsselected[i];
        var j = allShapes[num].fc;
        if (fc.checked && (j & 4) == 0)
            j += 4;
        else if (fc.checked == false && (j & 4) > 0)
            j -= 4;
        allShapes[num].fc = j;
        cachedfc = j;
        if ((j & 4) == 4)
            allShapes[num].div.style.textShadow = (colors[allShapes[num].color] == 'blue' ? '1px 1px #111111' : '1px 1px #505050');
        else
            allShapes[num].div.style.textShadow = null;
        sendObject(num);
    }
}
function changeshadow(num, fc)
{
    hassaved = false;

    for (var i = 0; i < numsselected.length; i++)
    {
        num = numsselected[i];
        var j = allShapes[num].fc;
        if (fc.checked && (j & 2) == 0)
            j += 2;
        else if (fc.checked == false && (j & 2) > 0)
            j -= 2;
        allShapes[num].fc = j;
        cachedfc = j;
        allShapes[num].resetup();
        sendObject(num);
    }
}
function setdocbg(tv)
{
    hassaved = false;

    document.body.style.backgroundImage = "url(" + tv + ")";
    if (tv == '')
        document.body.style.backgroundImage = null;
    if (chatsessionnum > -1)
    {
        parent.sendObject(chatsessionnum, 'b' + tv);
    }
    canceldia(0, 1);
}
function getdocbg()
{
    var xx = document.body.style.backgroundImage;
    if (xx == null)
        return '';

    xx = xx.replace(/[^\(]*\(/, '').replace(/\).*/, '');

    xx = xx.replace(/"/g, '');

    return xx;
}


function dosql(num)
{
    hassaved = false;
    var s = '';
    for (var j = 0; j < numsselected.length; j++)
    {
        num = numsselected[j];
        var str = allShapes[num].words.replace(/\r/g, '');
        var a = str.split(/[\n|\s]*\n[\n|\s]*/);
        s += "CREATE TABLE " + a[0] + "\n(";
        if (a[1] != 'lastupdate')
            s += "\n   lastupdate BigInt,\n";
        for (var i = 1; i < a.length; i++)
        {
            a[i] = a[i].replace("^[ ]+", "").replace(/[ ]+$/, '');
            if (a[i].indexOf(" ") < 0)
                s += "   " + a[i].replace(/<b>/ig, "").replace(/<.b>/ig, "") + " VARCHAR(50),\n";
            else
                s += "   " + a[i].replace(/<b>/ig, "").replace(/<.b>/ig, "") + ",\n";
        }

        var p = '';
        for (i = 1; i < a.length; i++)
        {
            a[i] = a[i].replace(/<b>/i, '').replace(/<.b>/i, '');
            var j = str.indexOf(a[i]);
            var k = str.substring(0, j).lastIndexOf("</b>");
            var l = str.substring(0, j).lastIndexOf("<b>");
            if (l < 0 || l > k && k >= 0)
                continue;
            k = str.indexOf("</b>", j);
            l = str.indexOf("<b>", j);
            if (k < 0 || l < k && l >= 0)
                continue;
            p += "," + a[i].replace(/<b>/ig, '').replace(/<.b>/ig, '');
        }
        if (p != '')
            s += "   PRIMARY KEY(" + p.substring(1) + ")";

        var maps = new Array();
        var mape = new Array();
        var alltbl = new Array();
        for (i = 0; i < allLines.length; i++)
        {
            if (allLines[i] == null)
                continue;
            if (allLines[i].endnum != num)
                continue;
            var tbl = tblname(allLines[i].startnum);
            if (maps[tbl] == null)
                maps[tbl] = '';
            if (mape[tbl] == null)
                mape[tbl] = '';
            alltbl[alltbl.length] = tbl;
            var startfn = fdname(allLines[i].startnum, allLines[i].sy);
            var endfn = fdname(allLines[i].endnum, allLines[i].ey);
            maps[tbl] = maps[tbl] + "," + startfn;
            mape[tbl] = mape[tbl] + "," + endfn;
        }
        for (i = 0; i < alltbl.length; i++)
        {
            tbl = alltbl[i];
            s += ",\n   FOREIGN KEY (" + mape[tbl].substring(1) + ") REFERENCES " + tbl + "(" + maps[tbl].substring(1) + ")";

        }
        s += "\n)";
        if (j < numsselected.length - 1)
            s += "\n\n";
    }
    if (savesqlable())
        myprompt("<textarea name=def id=\"def" + num + "\" rows=20 cols=60>" + s + "</textarea><br><center><input type=hidden name=tname value=\"" + a[0] + "\"><input name=submit style=\"width:70px;height:22px;border:1px #b0b0b0 outset\" value=GoPhysical type=button onclick=\"gophysical('" + a[0] + "'," + num + ")\"></center>", null, null, textmsg[797]);
    else
        myprompt(textmsg[1658] + ":<br><textarea id=\"savesql\" rows=20 cols=60>" + s + "</textarea>", null, null, textmsg[797]);


}
function gophysical(tname, num)
{

    parent.frames[0].savedef(tname, $("def" + num).value);
    whichact = 'sql';
    hassaved = false;
    tnamebeing = tname;
}
function docpp(num)
{

    hassaved = false;
    canceldia(0, 0);
    var inh = '';
    if (numsselected == null || numsselected.length == 0)
        numsselected = [num];
    for (var j = 0; j < numsselected.length; j++)
    {
        num = numsselected[j];
        for (var i = 0; i < numLines; i++)
        {
            if (allLines[i] == null)
                continue;
            if (allLines[i].startnum == num && allLines[i].type == 'arrow')
            {
                if (inh != '')
                    inh += ",";
                inh += tblname(allLines[i].endnum);
            }
        }

        var str = allShapes[num].words;
        var a = str.split(/\n/);
        var s = "public class " + a[0];
        if (inh != '')
        {
            s += " : public " + inh;
        }
        s += "\n{\n";

        var st = 'data';
        var alltbl = new Array();
        for (i = 0; i < allLines.length; i++)
        {
            if (allLines[i] == null)
                continue;
            if (allLines[i].endnum != num || allLines[i].type != 'diamond')
                continue;
            var tbl = tblname(allLines[i].startnum);
            var endfn = fdname(allLines[i].endnum, allLines[i].ey);
            endfn = endfn.replace("^[ ]+", "").replace(/[ ]+$/, '').replace(/\r/, '').replace(/<b>/ig, "").replace(/<.b>/ig, "");
            alltbl[endfn] = tbl;
        }

        for (i = 2; i < a.length; i++)
        {
            var v = a[i].replace("^[ ]+", "").replace(/[ ]+$/, '').replace(/\r/, '').replace(/<b>/ig, "").replace(/<.b>/ig, "");
            if (i >= 2 && v == '') {
                st = 'method';
                continue;
            }

            if (v.indexOf(" ") < 0)
            {
                if (st == 'data')
                {
                    tbl = alltbl[v];
                    if (tbl != null)
                        s += "   " + tbl + "* " + v + ";\n";
                    else
                        s += "   string " + v + ";\n";
                } else
                    s += "   void " + v + "();\n";
            } else
            {
                if (st == 'data')
                {
                    s += "   " + v + ";\n";
                } else
                    s += "   " + v + "();\n";
            }
        }

        s += "\n};";
        if (i < numsselected.length - 1)
            s += "\n\n";
    }
    if (saveable())
        myprompt("<textarea id=\"destination" + num + "\" rows=20 cols=60>" + s + "</textarea><br><center><input size=8 name=filedir value=\"" + a[0] + ".h\" ><input name=submit  style=\"width:50px;height:22px;border:1px #b0b0b0 outset\" value=\"" + textmsg[67] + "\" type=button onclick=\"savehfile('" + a[0] + ".h'," + num + ")\"></center>", null, null, textmsg[797]);
    else
        myprompt(textmsg[1659] + ":<textarea id=\"destination\" rows=20 cols=60>" + s + "</textarea>");

    canceldia(0, 0);
    canceldia(num, 1);
}
function savehfile(fn, num)
{
    opener.helpsave(window, fn, $("destination" + num).value);
}
function fdname(num, y)
{

    var xyb = findPositionnoScrolling(allShapes[num].base);
    y += xyb[1];

    var s = allShapes[num].div.getElementsByTagName("nobr");
    var zmn = 10000;
    var mnj = 0;
    for (var i = 0; i < s.length; i++)
    {
        var xy = findPositionnoScrolling(s[i]);
        var w = Math.abs(xy[1] + allShapes[num].fontsize / 2 + 1 - y);
        if (zmn > w) {
            zmn = w;
            mnj = i;
        }
    }
    return s[mnj].innerHTML.replace(/<b>/i, "").replace(/<.b>/i, "");
}

function tblname(num)
{
    var s = allShapes[num].words.replace(/\r/g, '').replace(/^[\s|\n]+/, '');
    var j = s.indexOf("\n");
    if (j > 0)
        return s.substring(0, j);
    return s;

}
function issql(s)
{
    s = s.replace(/\r/g, '');
    s = s.replace(/[ ]*\n[ ]*/g, '\n');
    s = s.replace(/^\s+/g, '');
    s = s.replace(/\s+$/g, '');
    var j = s.indexOf("\n\n");
    if (j < 0)
        return false;
    if (s.indexOf("<b>") < 0)
        return false;
    j = s.indexOf("\n\n", j + 3);
    if (j > 0)
        return false;
    return true;
}
function iscpp(s)
{

    s = s.replace(/\r/g, '');
    s = s.replace(/[ ]+\n/g, '\n');
    s = s.replace(/^\s+/g, '');
    var j = s.indexOf("\n\n");
    if (j < 0)
        return false;
    if (s.indexOf("<b>") >= 0)
        return false;
    j = s.indexOf("\n\n", j + 3);
    if (j < 0)
        return false;
    return true;
}
function hideShape(num)
{
    if (num < 0 || num >= numShapes || allShapes[num] == null)
        return;

    allShapes[num].visible = 1 - allShapes[num].visible;
    allShapes[num].base.style.visibility = (allShapes[num].visible == 1) ? 'visible' : 'hidden';
    if (allShapes[num].shapename == 'diamond' && $('u' + num) != null)
        $('u' + num).style.visibility = (allShapes[num].visible == 1) ? 'visible' : 'hidden';
    if (allShapes[num].visible == 1)
    {
        var sw = screen.width - 20;
        var sh = screen.height - 100;
        if (allShapes[num].shapename == 'diamond')
        {
            var dx = parseInt(allShapes[num].div.style.left.replace(/px/i, ''));
            var dy = parseInt(allShapes[num].div.style.left.replace(/px/i, ''));
            var dw = allShapes[num].div.offsetWidth;
            var dh = allShapes[num].div.offsetHeight;
            var shink = shrink(allShapes[num].shapename);
            var bw = dw / shink;
            var bh = dh / shink;
            var bx = dx - (bw - dw) / 2;
            var by = dy - (bh - dh) / 2;
            if (!(bx >= 0 && by >= 0 && bx + bw <= sw && by + bh <= sh))
            {
                var bx0 = parseInt(allShapes[num].base.style.left.replace(/px/i, ''));
                var by0 = parseInt(allShapes[num].base.style.left.replace(/px/i, ''));
                var diffx = bx0 - bx;
                var diffy = by0 - by;
                var x1 = (sw - bw) / 2 + diffx;
                var y1 = (sh - bh) / 2 + diffy;
                allShapes[num].move(x1, y1);
            }
        } else
        {
            var bx = parseInt(allShapes[num].base.style.left.replace(/px/i, ''));
            var by = parseInt(allShapes[num].base.style.top.replace(/px/i, ''));
            var bw = allShapes[num].base.offsetWidth;
            var bh = allShapes[num].base.offsetHeight;
            if (bx < 0 || by < 0 || bx + bw >= sw || by + bh >= sh)
            {
                allShapes[num].move((sw - bw) / 2, (sh - bh) / 2);
            }
        }
        for (var j = 0; j < numLines; j++)
            if (allLines[j] != null && (allLines[j].endnum == num || allLines[j].endnum == -1 && allLines[j].startnum == num))
                allLines[j].draw();
    } else
    {
        for (var j = 0; j < numLines; j++)
            if (allLines[j].startnum == num || allLines[j].endnum == num)
                allLines[j].remove();
    }
    allShapes[num].div.style.visibility = (allShapes[num].visible == 1) ? 'visible' : 'hidden';
    document.onmousemove = onmouseover0;

}

function hideLine(num)
{
    if (num < 0 || num >= numLines || allLines[num] == null)
        return;

    allLines[num].visible = 1 - allLines[num].visible;
    if (allLines[num].visible)
        allLines[num].draw();
    else
        allLines[num].remove();
    document.onmousemove = onmouseover0;

}

function hideCurve(num)
{

    allCurve[num].visible = 1 - allCurve[num].visible;
    allCurve[num].base.style.visibility = (allCurve[num].visible == 1) ? 'visible' : 'hidden';
    allCurve[num].div.style.visibility = (allCurve[num].visible == 1) ? 'visible' : 'hidden';

    document.onmousemove = onmouseover0;

}


function redraw3(num, shapename, cd)
{
    cachedshapename = shapename;
    if (cd == 1)
    {
        hassaved = false;
        savedfontrate = 1;
        if (numsselected == null || numsselected.length == 0)
            numsselected = [num];
        for (var i = 0; i < numsselected.length; i++)
        {
            var num = numsselected[i];
            allShapes[num].shapename = shapename;
            for (var j = 0; j < numLines; j++)
                if (allLines[j].startnum == num || allLines[j].endnum == num)
                    allLines[j].remove();
            done(num);
        }
        var xy = findPositionnoScrolling(allShapes[numsselected[i - 1]].base);

        mdia(num, cd);
    } else if (cd == 0)
    {
        if (chatsessionnum == -1)
        {
            anewshape(num, shapename);
        } else
        {
            cachedshapenum = num;

            parent.sendObject(chatsessionnum, 's');
        }
    }

    document.onmousemove = onmouseover0;
}
function anewshape(num, shapename)
{
    if (num == null)
    {
        num = cachedshapenum;
        shapename = cachedshapename;
    }
    var dv = $("m0_0");
    new Shape(num, textmsg[1774], '', shapename, parseInt(dv.style.left.replace(/px/, '')), parseInt(dv.style.top.replace(/px/, '')), null, null, parseInt(cachedfontsize.replace(/px/i, '')), cachedcolor, cachedbgcolor, cachedfc, 0, num, num);
    canceldia(num, 0);
    if (numediting == -1)
    {
        action(allShapes[numShapes - 1].div);
    }
    cachedshapenum = null;

}
function edit(num)
{
    if (chatsessionnum == -1)
    {

        urlas = allShapes[num].urlas;
        numbeing = num;
        action(allShapes[num].div);
    } else
    {
        if (allShapes[num].inediting == false)
        {
            if (allShapes[num].word != textmsg[1774])
            {
                sendObject(num, 'u');
            }
            urlas = allShapes[num].urlas;
            numbeing = num;
            action(allShapes[num].div);
        }
    }
    canceldia(num, 1);
}

function holdtomodify(num)
{
    return;
    if (num < 0 || allShapes[num] == null)
        return;
    // allShapes[num].inediting = true;
    if (numediting == num)
    {
        var b = $("t" + num);
        document.body.removeChild(b);
        numediting = -1;
        myprompt(textmsg[1657]);

    }
}
function delpic(num, im)
{
    beingloadnum = num;
    if (im != null)
        submitstring = "delpic(beingloadnum,'" + im + "')";
    else
        submitstring = "delpic(beingloadnum)";
    if ((new Date()).getTime() >= expiretime - 1000)
    {
        expiretime = activeidletime + (new Date()).getTime();
        open('alive.jsp?target=child', "w" + tstmp);
        return;
    }


    hassaved = false;
    if (saveable())
    {
        if (im == null)
        {
            var img = allShapes[num].div.getElementsByTagName("img")[0];
            im = img.alt;
            allShapes[num].words = allShapes[num].words.replace(/<img [^>]+>/, '');
            done(num);
            canceldia(num, 1);
            if (img.src.indexOf(originalurl + "/FileOperation?did=") != 0)
                return;
        }
        if (im == null || im == '' || im.indexOf(".") < 0)
            return;
        var fn = (folder == '') ? (im) : (folder + "/" + im);

        {
            document.f.operation.value = "delete";
            document.f.destination.value = "";
            document.f.filedir.value = fn;
            formnewaction(document.f, originalurl + "/FileOperation");
            document.f.target = iframename;
            expiretime = activeidletime + (new Date()).getTime();
            visual(document.f);
            document.f.submit();
            document.f.filedir.value = filename;
        }
    } else
    {
        allShapes[num].words = allShapes[num].words.replace(/<img [^>]+>/, '');
        done(num);
    }
    document.onmousemove = onmouseover0;
}

function changefont(sel, num, cd, ii)
{
    var fs = parseInt(sel.innerHTML);
    if (cd == 1)
    {
        hassaved = false;
        preaction();
        var tbl = sel.parentNode.parentNode;
        if (tbl.tagName.toLowerCase() != 'table')
        {
            tbl = sel.parentNode.parentNode.parentNode;
        }
        for (var j = 0; j < tbl.rows.length; j++)
            for (var i = 0; i < tbl.rows[j].cells.length; i++)
                tbl.rows[j].cells[i].style.fontWeight = '500';
        sel.style.fontWeight = '700';
        if (numsselected != null)
            for (var i = 0; i < numsselected.length; i++)
            {
                num = numsselected[i];
                allShapes[num].div.innerHTML = '';
                savedfontrate = fs / allShapes[num].fontsize;
                allShapes[num].div.style.fontSize = fs + 'px';
                cachedfontsize = fs + 'px';
                allShapes[num].fontsize = fs;

                done(num);

            }
    } else if (cd == 5)
    {
        var ori = $('orient').innerHTML.charCodeAt(0);
        var ij = 1;
        if (ori == 8593)
            ij = -1;
        fs += ij;
        if (fs > 6) {
            sel.innerHTML = '' + fs;
            allfonts[ii] = fs;
        }
    }
    //canceldia(num,1);   
}
function changeorient(td)
{
    var ori = td.innerHTML.charCodeAt(0);
    if (ori == 8593)
        td.innerHTML = '&darr;'
    else
        td.innerHTML = '&uarr;'
}
function changecolorb(sel, num, cd, cl)
{

    hassaved = false;
    var tbl = sel.parentNode.parentNode;
    if (tbl.tagName.toLowerCase() != 'table')
    {
        tbl = sel.parentNode.parentNode.parentNode;
    }
    var iii = 0;
    for (var j = 0; j < tbl.rows.length; j++)
        for (var i = 0; i < tbl.rows[j].cells.length; i++)
        {
            tbl.rows[j].cells[i].style.border = '1px transparent solid';
            if (tbl.rows[j].cells[i] == sel)
                iii = j * tbl.rows[0].cells.length + i;
        }
    sel.style.border = '1px #222222 solid';
    if (cd == 0)
    {
        document.body.style.backgroundImage = null;
        document.body.style.backgroundColor = bcolors[cl];
        document.body.style.background = "url() " + bcolors[cl];
        if (chatsessionnum > -1 && num == null)
        {
            parent.sendObject(chatsessionnum, 'g' + bcolors[cl]);
        }
        //canceldia(0,0);  
    } else if (cd == 1)
    {
        for (var i = 0; i < numsselected.length; i++)
        {
            num = numsselected[i];
            {
                var z = allShapes[num];
                if (z.isrect())
                {
                    if ((z.fc & 8) == 0)
                    {
                        z.base.style.backgroundColor = bcolors[cl];
                        z.base.style.backgroundImage = null;
                        z.div.style.backgroundImage = null;
                        z.div.style.backgroundColor = "transparent";
                    } else
                    {
                        z.base.style.backgroundColor = bcolors[cl];
                        z.base.style.backgroundImage = gradient(bcolors[cl]);
                        z.div.style.backgroundImage = null;
                        z.div.style.backgroundColor = "transparent";
                    }
                } else if (z.shapename == 'ellipse')
                {
                    var dv = allShapes[num].base.getElementsByTagName('div')[0];
                    if ((z.fc & 8) == 0)
                    {
                        dv.style.backgroundImage = null;
                        dv.style.backgroundColor = bcolors[cl];
                    } else
                    {
                        dv.style.backgroundImage = gradient(bcolors[cl]);
                        dv.style.backgroundColor = null;
                    }
                } else if (z.shapename == 'diamond')
                {
                    var tbl = allShapes[num].base.getElementsByTagName('table')[0];
                    allShapes[num].base.innerHTML = allShapes[num].setup(null, null);

                }
                cachedbgcolor = allShapes[num].bcolor = cl;
                allShapes[num].resetup();

            }

            sendObject(num);
        }
    } else if (cd == 5)
    {

        if (iii < bcolors.length - 1)
        {
            $('hiddencolorb').value = bcolors[cl];
            $('hiddencolorb').click();
            cachediii = iii;
            cachedtd = sel;
        } else
        {
            myprompt(textmsg[1642].replace(/@.*/, ''));
        }

    }
}
var cachedtd;
var cachediii;
function changecolor(sel, num, cd, cl)
{

    hassaved = false;
    var tbl = sel.parentNode.parentNode;
    if (tbl.tagName.toLowerCase() != 'table')
    {
        tbl = sel.parentNode.parentNode.parentNode;
    }

    var iii = 0;
    for (var j = 0; j < tbl.rows.length; j++)
        for (var i = 0; i < tbl.rows[j].cells.length; i++)
        {
            tbl.rows[j].cells[i].style.border = '1px transparent solid';
            if (tbl.rows[j].cells[i] == sel)
                iii = j * tbl.rows[0].cells.length + i;
        }
    sel.style.border = '1px #222222 solid';
    if (numsselected != null)
        for (var i = 0; i < numsselected.length; i++)
        {
            num = numsselected[i];
            if (cd == 1)
            {
                var z = allShapes[num];
                allShapes[num].div.style.color = colors[cl];
                cachedcolor = allShapes[num].color = cl;
                allShapes[num].resetup();
                sendObject(num);
            } else if (cd == 2)
            {

                allLines[num].color = cl;
                allLines[num].redraw();
                cachedlinecolor = cl;
                //canceldia(num,cd); 
            } else if (cd == 4)
            {
                cachedcurvecolor = cl;
                allCurves[num].color = cl;
                allCurves[num].redraw();
                //canceldia(num,cd); 
            } else if (cd == 5)
            {
                $('hiddencolorf').value = colors[cl];
                $('hiddencolorf').click();
                cachediii = iii;
                cachedtd = sel;
            }
        }
}

function changethatcolor(txt, c)
{
    if (c == 'b')
    {
        cachedtd.style.backgroundColor = txt.value;
        bcolors[cachediii] = txt.value;
    } else if (c == 'f')
    {
        cachedtd.style.color = txt.value;
        colors[cachediii] = txt.value;
    }
}
var cutshape = null;
function dodelete(num, cd)
{
    if ($("m" + num + "_" + cd) == null)
        return;

    hassaved = false;
    if (numsselected != null)
        for (var i = 0; i < numsselected.length; i++)
        {
            num = numsselected[i];
            if (cd == 1)
            {
                if (true)// allShapes[ num ].inediting== false)
                {
                    cutshape = allShapes[ num ].toString();
                    sendObject(num, 'd');
                    allShapes[ num ].delme(1);
                } else
                {
                    myprompt(textmsg[1657]);

                }
            } else if (cd == 2)
            {
                allLines[ num ].delme();
                if (chatsessionnum > -1)
                {
                    parent.sendObject(chatsessionnum, num + " l");
                }
            } else if (cd == 4)
            {
                allCurves[ num ].delme();
                if (chatsessionnum > -1)
                {
                    parent.sendObject(chatsessionnum, num + " c");
                }
            }
        }
    canceldia(num, cd);

}
function copyshape(num)
{

    cutshape = allShapes[ num ].toString();
    canceldia(num, 1);
}
function pasteshape(num)
{

    hassaved = false;
    var dv = $("m0_0");
    if (chatsessionnum > -1 && num == null)
    {
        parent.sendObject(chatsessionnum, 's');
    } else
    {
        constructshape(num, cutshape, parseInt(dv.style.left.replace(/px/, '')), parseInt(dv.style.top.replace(/px/, '')));
        canceldia(0, 0);
        sendObject(num);
    }
}
function canceldia(num, cd)
{

    if (cd == 0 && num == 0)
    {
        var bg = $('bgurl');
        if (bg != null && bg.value != '')
            setdocbg(bg.value);
    }
    numsselected = null;


    var md = $("m" + num + "_" + cd);
    if (md != null)
        document.body.removeChild(md);
    hasone = null;
    cdbeing = -1;
    document.onmousemove = onmouseover0;
    if ($('tdbg') != null)
    {
        var j = hexcolor($('tdbg').style.backgroundColor);
        if (cd == 0 && num == 0 && j != '#ffffff')
            startbg($('tdbg'));
    }
}



function constructshape(num, str, xx, yy)
{
    var parser = new CSVParse(str, "'", ",", ";");
    //  s = str;
    var words = parser.nextElement();
    if (words == null)
        return null;
    numbeing = num;
    urlas = parser.nextElement();
    var shapename = parser.nextElement();
    var x = parseInt(parser.nextElement());
    if (xx != null)
        x = xx;
    var y = parseInt(parser.nextElement());
    if (yy != null)
        y = yy;
    var w = null;
    var h = null;
    var w1 = parser.nextElement();
    if (w1 != '' && w1 != null)
        w = parseInt(w1);
    var h1 = parser.nextElement();
    if (h1 != '' && h1 != null)
        h = parseInt(h1);
    var fs = parseInt(parser.nextElement());
    var cl = parser.nextElement();
    var cn = 0;
    if (cl == null)
        cl = 'black';
    if (isNaN(cl))
        cn = rcolor(cl);
    else
        cn = parseInt(cl);
    var bc = parser.nextElement();
    var bn = 0;
    if (bc == null)
        bc = 'black';
    if (isNaN(bc))
        bn = rbcolor(bc);
    else
        bn = parseInt(bc);

    var fc = parseInt(parser.nextElement());
    var tm = parseFloat(parser.nextElement());
    var zi = parseInt(parser.nextElement());
    var or = parseFloat(parser.nextElement());

    // str += this.shapename  +"," +  xx +"," + yy + "," + w + "," + h +","  
    //  + this.fontsize + "," + this.color + "," + this.bcolor + "," + this.fc + "," + this.time+ "," + this.zindex + "," + this.start + "," + this.inediting; 

    var inedit = (parser.nextElement() == ("true"));
    // s  += ("\n\nwords=" + words + '\ns='+ shapename+ '\nx=' + x+ '\ny=' + y+ '\nw=' + w+ '\nh=' + h+ '\nfs=' + fs+ '\ncl=' + cl+ '\nbc=' + bc+ '\nfc=' + fc) ;
    if (constructshape.caller.name == null || constructshape.caller.name.indexOf('exebuffered') < 0)
    {
        var z = new Shape(num, words, urlas, shapename, x, y, w, h, fs, cn, bn, fc, tm, zi, or);
        //(num, words, shapename,x, y, w, h, fs, cl, bc, fc,tm,zIndex,starttime)
        z.setup();
    } else if (createmove == null)
    {
        var z = new Shape(num, words, urlas, shapename, 0, 0, w, h, fs, cl, bc, fc, tm, zi, or);

        if (num >= 0 && num < allShapes.length)
            setTimeout("allShapes[" + num + "].move(" + x + "," + y + ")", 5);
        var em = $("sound");
        if (em != null)
            em.Play();
    } else
    {
        z = new Shape(num, words, urlas, shapename, createmove[0], createmove[1], w, h, fs, cl, bc, fc, tm, zi, or);
        if (num >= 0 && num < allShapes.length)
            setTimeout("allShapes[" + num + "].move(" + x + "," + y + ")", 5);
    }
    z.inediting = inedit;

    return z;
}
function constructline(num, str)
{
    var i = 0;
    var parser = new CSVParse(str, "'", ",", "\r\n");

    var type = parser.nextElement();
    if (type == null)
        return null;
    var startn = parser.nextElement();
    if (startn == null)
        return null;
    var sx = parser.nextElement();
    if (sx == null)
        return null;
    var y = parser.nextElement();
    if (y == null)
        return null;
    if (isNaN('' + y))
    {
        var sy = allShapes[startn].positionbyfn(y);
    } else
        sy = parseInt(y);

    var endn = parser.nextElement();
    if (endn == null)
        return null;
    var ex = parser.nextElement();
    if (ex == null)
        return null;
    y = parser.nextElement();
    if (y == null)
        return null;

    if (isNaN('' + y))
    {
        var ey = allShapes[endn].positionbyfn(y);
    } else
        ey = parseInt(y);

    var thick = parser.nextElement();
    if (thick == null)
        thick = '1';
    var direct = parser.nextElement();
    if (direct == null)
        direct = '1';
    var time = parser.nextElement();
    if (time == null)
        time = '0';
    var cn = 0;
    var color = parser.nextElement();
    if (color == null)
        color = 'black';
    if (isNaN(color))
        cn = rcolor(color);
    else
        cn = parseInt(color);
    sentline = true;

    var l = (new Line(num, type, parseInt(startn), parseInt(sx), sy, parseInt(endn), parseInt(ex), ey, parseInt(thick), parseInt(direct), parseInt(time), cn));
    //l.redraw();
    return l;
}

function constructcurve(num, str)
{
    var i = 0, x, y = 0;
    var parser = new CSVParse(str, "'", ",", "\r\n");

    var type = parser.nextElement();
    if (type == null)
        return null;
    var thick = parseInt(parser.nextElement());
    if (thick == null)
        return null;
    var color = parser.nextElement();
    if (color == null)
        return null;
    var time = parser.nextElement();
    if (time == null)
        return null;
    var points = [];
    while (true)
    {
        x = parser.nextElement();
        y = parser.nextElement();
        if (x == null || y == null)
            break;
        if (i == 0)
            points[i] = [parseInt(x), parseInt(y)];
        else
        {
            points[i] = [parseInt(x) + points[i - 1][0], parseInt(y) + points[i - 1][1]];
        }
        i++;
    }

    sentline = true;
    var cn = 0;
    if (isNaN(color))
        cn = rcolor(color);
    else
        cn = parseInt(color);
    return (new Curve(num, type, thick, cn, time, points));
}

function initial()
{
    hw.parseAttach(attacharr[pagenum], pagenum);
    document.f.attach.value = attacharr[pagenum];
    favorx = 5;
    favory = 35;
    mfavory = 0;
    if (shapearr[pagenum] != null)
        for (var i = 0; i < shapearr[pagenum].length; i++)
        {
            constructshape(null, shapearr[pagenum][i]);
        }
    if (linearr[pagenum] != null)
        for (i = 0; i < linearr[pagenum].length; i++)
        {
            constructline(null, linearr[pagenum][i]);
        }
    if (curvearr != null)
        for (i = 0; curvearr[pagenum] != null && i < curvearr[pagenum].length; i++)
        {
            constructcurve(null, curvearr[pagenum][i]);
        }
    document.onmousemove = onmouseover0;
    var zz = $("selpage");
    if (zz != null)
        zz.selectedIndex = pagenum;
}
function getInputSelection(el)
{
    var start = 0;
    var end = 0;
    var normalizedValue;
    var range;
    var textInputRange;
    var len;
    var endRange;

    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number")
    {
        start = el.selectionStart;
        end = el.selectionEnd;
    } else
    {
        range = document.selection.createRange();

        if (range && range.parentElement() == el)
        {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());
            endRange = el.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1)
            {
                start = end = len;
            } else
            {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1)
                {
                    end = len;
                } else
                {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }

    selectstart = start,
            selectend = end;
}
function makevisible(n)
{
    allShapes[n].base.style.visibility = 'visible';
    if (allShapes[n].shapename == 'diamond' && $('u' + n) != null)
        $('u' + n).style.visibility = 'visible';
    //Play.appear(n);
}
function makehidden(n)
{
    allShapes[n].base.style.visibility = 'hidden';
    if (allShapes[n].shapename == 'diamond' && $('u' + n) != null)
        $('u' + n).style.visibility = 'hidden'
}
function savetocache()
{

    if (hassaved == false)
    {
        var str = toString();

        //SetCookie("UMLtoolstr", "" + ((new Date()).getTime()) + " " + filename + " " + pagenum + " " + str);
    }
}

function initialdraw()
{
    notcached(false);
    if (editable && chatsessionnum == -1)
    {
        cachedone(true);
    }
}
function makeframe()
{
    document.write("<iframe name=\"" + iframename + "\" width=1  height=1 style=\"visibility:hidden\" />");
    //if (saveable()) document.f.filedir.style.fontWeight = 700;
}




function pickthis(sp)
{

    if (sp.innerHTML.toLowerCase() != '&nbsp;&nbsp;')
        mergeto(null, parseInt(sp.innerHTML.substring(1)) - 1);
    var tbl = sp.parentNode.parentNode
    if (tbl.tagName.toLowerCase() != 'table')
        tbl = tbl.parentNode;
    document.body.removeChild(tbl);
}
function mergeto(sel, pn)
{
    var pp = pagenum;
    preaction();
    if (pn == null)
        pn = parseInt(sel.options[sel.selectedIndex].value);
    var xy = [];
    makeintostring(xy);

    delall();
    var lower = 0;
    if (pagenum < pn)
        lower = 1;
    pagenum = pn;

    initial();
    hw.parseAttach(attacharr[pagenum], pagenum);
    var my = 40;
    for (var i = 0; i < numShapes; i++)
    {
        if (allShapes[i] != null)
        {
            var bt = allShapes[i].y + allShapes[i].base.offsetHeight;
            if (bt > my)
                my = bt;
        }
    }
    var ns = numShapes;
    for (i = 0; i < shapearr[pp].length; i++)
    {
        constructshape(null, shapearr[pp][i], xy[i][0], xy[i][1] + my + 10);
    }
    for (i = 0; i < linearr[pp].length; i++)
    {
        var parser = new CSVParse(linearr[pp][i], "'");
        var type = parser.nextElement();
        var startn = parser.nextElement() + ns;
        var sx = parser.nextElement();
        var sy = parser.nextElement();
        var endn = parser.nextElement() + ns;
        var ex = parser.nextElement();
        var ey = parser.nextElement();
        var thick = parser.nextElement();
        var direct = parser.nextElement();
        var time = parser.nextElement();
        var cn = 0;
        var color = parser.nextElement();
        if (color == null)
            color = 'black';
        if (isNaN(color))
            cn = rcolor(color);
        else
            cn = parseInt(color);
        new Line(drawinenumber, type, startn, sx, sy, endn, ex, ey, parseInt(thick), direct, time, cn);
    }

    for (; pp < linearr.length - 1; pp++)
    {
        shapearr[pp] = shapearr[pp + 1]
        linearr[pp] = linearr[pp + 1];
    }
    shapearr[pp] = null;
    linearr[pp] = null;
    pagenum -= lower;
    sel = $("selpage");

    /* var hold = sel.options[sel.options.length-1];
     sel.options[sel.options.length-1] = null;
     sel.options[sel.options.length-1] = hold;*/
    sel.selectedIndex = pagenum;
    canceldia(0, 0);
}

function allowmove(c)
{

    canceldia(0, 3);
    var xx = $("toolbar");

    if (c == 0)
    {
        toolbarxy = findPositionnoScrolling(xx);
        var holdpos = $("holdpos");
        if (holdpos == null)
        {
            holdpos = document.createElement("div");
            holdpos.id = "holdpos";
            holdpos.cssText = "width:" + xx.offsetWidth + "px;height:" + xx.offsetHeight + "px";
            document.body.insertBefore(holdpos, xx);
        }
        xx.style.position = "absolute";
        var my = 40;
        for (var i = 0; i < numShapes; i++)
        {
            if (allShapes[i] != null)
            {
                var bt = allShapes[i].y + allShapes[i].base.offsetHeight;
                if (bt > my)
                    my = bt;
            }
        }
        xx.style.top = my + 'px';
        xx.style.left = toolbarxy[0] + 'px';
        xx.style.height = "28px";
        window.scrollTo(0, bt);
    } else
    {
        xx.style.position = "";
        xx.style.height = "28px";
        xx.align = "center";

        var xy = $("holdpos");
        if (xy != null) {
            document.body.insertBefore(xx, xy);
            document.body.removeChild(xy);
            window.scrollTo(0, 0);
        }
    }

}
var createmove = null;
var linenums = null;
function redrseline()
{
    if (linenums == null)
        return;
    for (var j = 0; j < linenums.length; j++)
    {
        var x = linenums[j];
        allLines[x.num] = constructline(x.num, x.str);
    }
    linenums = null;
}
var bufferedcommand = null;
function exebuffered()
{
    if (bufferedcommand != null)
    {
        allShapes[bufferedcommand.num] = constructshape(bufferedcommand.num, bufferedcommand.str);
        if (typeof (LaTexHTML) != 'undefined')
        {
            LaTexHTML.formatele(allShapes[bufferedcommand.num].div);
            if (!allShapes[bufferedcommand.num].isrect())
                allShapes[bufferedcommand.num].gooddim();
        }
        bufferedcommand = null;

    }
}
function createupdate(str)
{

    var j = str.indexOf(" ");
    if (j == -1)
    {
        if (str.charAt(0) == 'b')
        {
            setdocbg(str.substring(1));
        } else
            (str.charAt(0) == 'g')
        {
            document.body.style.backgroundColor = (str.substring(1));
        }
        return;
    }
    var num = parseInt(str.substring(0, j));
    var c = str.charAt(1 + j);
    if (2 + j < str.length)
        str = str.substring(2 + j);
    else
        str = '';
    if (c == 's')
    {


        if (allShapes[num] != null)
        {
            createmove = [allShapes[num].x, allShapes[num].y];
            linenums = [];
            for (var j = 0; j < allLines.length; j++)
            {
                if (allLines[j].startnum == num || allLines[j].endnum == num)
                {
                    linenums[linenums.length] = {num: allLines[j].num, str: allLines[j].toString()};
                    allLines[j].delme();
                }
            }
            allShapes[num].delme(false);
        } else
        {
            createmove = null;
        }
        if (str != '')
        {
            bufferedcommand = {num: num, str: str};
            var delay = 10;
            if (linenums != null)
                delay += linenums.length * 400;
            setTimeout('exebuffered()', delay);
        }
    } else if (c == 'l')
    {
        if (allLines[num] != null)
            allLines[num].delme();
        if (str != '')
        {
            allLines[num] = constructline(num, str);
        }
    } else if (c == 'c')
    {
        if (allCurves[num] != null)
            allCurves[num].delme();
        if (str != '')
        {
            allCurves[num] = constructcurve(num, str);
        }
    }
}
function changefontfamily()
{
    var myfontname1 = GetCookie('myfontname');

    if (myfontname1 != null)
    {
        myfontname = myfontname1;
    } else if (typeof (defaultfontfamily) != 'undefined')
    {
        myfontname = defaultfontfamily;
    }

    var s = document.getElementsByTagName('head')[0].getElementsByTagName('style')[0];
    s.innerHTML = s.innerHTML.replace(/font-family:arial\}/, "font-family:" + myfontname + "}");

}
function appendfileto()
{
    var tt = $('e' + numbeing);

    if (tt != null)
        tt.value += ' ' + originalurl + '/FileOperation?did=' + ResizeUploaded.pathcode;
    else
        ResizeUploaded.attachman(document.f.attach);
    attacharr[pagenum] = document.f.attach.value;
    hw.parseAttach(attacharr[pagenum], pagenum);
}
var oldResizeUploadeddocuse = ResizeUploaded.docuse;
ResizeUploaded.docuse = function ()
{
    oldResizeUploadeddocuse();
    appendfileto();

}

function showattachment(t)
{
    attacharr[pagenum] = t;
    hw.parseAttach(t);
}

Msg.handlepost = function (s)
{

    var m = new Message(s);
    if (m.code == "newd")
    {
        Msg.tid = m.tid;

        if ('' + m.tid != '-1')
        {
            var url = originalurl + "/remote.jsp?t=" + tstmp;
            var url1 = originalurl + "/Qrlink?url=" + Msg.hex(url);
            myprompt(textmsg[1778] + '<br><span style=background-color:lightyellow;width:100% >' + url + "</span><br>" + textmsg[1779] + "<br><img src=" + url1 + " width=500 />", null, null, textmsg[1771].split(/@/)[6]);
            promptwin.style.top = '30px';

            mypromptonclose(Play.quitremote);
        }

    } else if (m.code == 'snap')
    {
        var zz = textmsg[1725].split(/@/);
        var seg = m.msg.split(/\|/);
        var x = textmsg[1646].split(/@/);
        for (var i = 1; i < 4; i++)
            seg[i] = seg[i].replace(/<table/, '<table width=100% border=1 style=border-collapse:collapse;border-radius:3px;background-color:white');
        myprompt("<body style=\"font-family:" + myfontname + "\"><table id=snap border=1  cellspacing=4px cellpadding=3  style=background-color:white;border-collapse:collapse><tr><td>" + zz[0] + "</td><td>" + zz[1] + "</td><td>" + zz[2] + "</td><td>" + zz[3] + "</td><td>" + zz[4] + "</td><td>" + zz[5] + "</td></tr></table>");
        var tbl0 = $('snap');

        var r = tbl.insertRow(-1);
        var c = r.insertCell(-1);
        c.colSpan = 6;
        c.innerHTML = ("<table width=98%><tr><td>" + x[0] + seg[1] + "</td></tr> <tr><td>" + x[1] + seg[2] + "</td></tr><tr><td>" + x[2] + seg[3] + "</td></tr></table>");

    }
}
Msg.handleget = function (s)
{
    if (s == '')
        return;

    var m = new Message(s);
    Msg.needmore = true;
    if (m.code == 'login')
    {
        window.open('login.jsp?follow=' + m.msg, 'w' + Msg.tstmp);
        Msg.needmore = false;
    } else if (m.code == "plain")
    {
        if (promptwin != null && promptwin.innerHTML.indexOf(textmsg[1771].split(/@/)[6]) > 0)
            closeprompt();
        eval(m.msg);
        Msg.needmore = true;
    } else if (m.code == "leave")
    {
        Msg.send({code: 'unsubs', msg: tstmp});
        Msg.needmore = false;
    }
}

var oldcropuse = ResizeUploaded.cropuse;
ResizeUploaded.cropuse = function (t)
{
    oldcropuse(t);
    if (t == null || t == 1)
    {
        appendfileto();
    }
}
var olddrawbw = ResizeUploaded.readbw;
ResizeUploaded.readbw = function ()
{
    olddrawbw();
    appendfileto();
}
var closeprompt1 = closeprompt;
closeprompt = function ()
{
    closeprompt1();
    canceldia(0, 0);
}
function showonlinetool(num)
{
    onlinetoolbase.style.visibility = 'visible';
    onlinetoolbarfollow($('e' + num));
    oldonlinetoolmini($('tosmall'));
    var t = $('t' + num);
    var xy = findPositionnoScrolling(t);
    onlinetoolbase.style.top = (xy[1] - 25) + 'px';
    onlinetoolbase.style.left = (xy[0]) + 'px';
    onlinetoolbase.style.zIndex = '' + (2 * numShapes + 4);
}
var oldonlinetoolmini = onlinetoolmini;
onlinetoolmini = function (t)
{
    if (t.value == '.')
    {
        oldonlinetoolmini(t);
        onlinetoolbase.style.visibility = "hidden";
    } else
    {
        oldonlinetoolmini(t);
    }

}

var Play =
        {
            starttime: 0,
            idletime: 0,
            startunit: 0,
            handle: null,
            shorttime: 0,
            current: 'stop',
            state: 'begin',
            sel: null,
            nopath: ";stop,pause;stop,forward;stop,backward;stop,resume;start,resume;resume,resume;pause,start;pause,forward;pause,backward;pause,pause;forward,resume;backward,resume;",
            color: function (s)
            {
                var sel = $('selplay');
                for (var i = 2; i < 8; i++)
                {
                    var x = sel.options[i].value.replace(/.*Play\.([a-z]+).*/, '$1');

                    if (Play.nopath.indexOf(";" + s + ',' + x + ";") >= 0)
                        sel.options[i].style.color = '#cccccc';
                    else
                        sel.options[i].style.color = 'black';
                }
            },
            reinit: function (td)
            {
                var total = 75;
                if (td != null)
                {
                    total = parseInt(td.parentNode.cells[1].innerHTML);
                }
                var lens = [];
                var W = 0;
                for (var i = 0; i < numShapes; i++)
                {
                    if (allShapes[i] == null)
                        continue;
                    var j = allShapes[i].words.replace(/<[a-b]+[^>]*>/ig, '').replace(/<\/[a-b|0-9]+>/ig, '').length;
                    if (j < 2 && allShapes[i].words.indexOf("http") == 0)
                    {
                        j = 50;
                    }
                    lens[i] = j;
                    W += j;
                }
                var r = total / W;
                var p = 0;
                for (var i = 0; i < numShapes; i++)
                {
                    if (allShapes[i] == null)
                        continue;
                    var d = Math.round(r * lens[i] * 10) / 10;
                    if (d == 0)
                        d = 0.1;
                    allShapes[i].time = d;
                    allShapes[i].start = p;
                    allShapes[i].zindex = '' + i;
                    p += d;
                }

                for (var i = 0; i < numLines; i++)
                {
                    var l = allLines[i];
                    if (l == null)
                        continue;
                    var k = l.startnum;
                    var j = l.endnum;
                    if (k == -1 || j == -1)
                        continue;
                    var dk = allShapes[k].start + allShapes[k].time;
                    var dj = allShapes[j].start + allShapes[j].time;

                    if (dk > dj)
                    {
                        allShapes[j].time += (dk - dj);
                    } else if (dk < dj)
                    {
                        allShapes[k].time += (dj - dk);
                    }
                }

                if (td != null)
                {
                    Play.schedule();
                }
            },
            speedup: 1,
            schedule: function ()
            {
                var m = 0;
                for (var i = 0; i < numShapes; i++)
                {
                    if (allShapes[i] == null)
                        continue;
                    var d = allShapes[i].start + allShapes[i].time;
                    if (m < d)
                        m = d;
                }

                var xs = textmsg[1772].split(/@/);
                var x = "<table align=center  ><tr><td   style=color:purple;font-size:10px;float:center>" + xs[7] + "</td></tr></table><table align=center  border=1 style=\"border-collapse:collapse\"><tr><td  align=left bgcolor=lightblue><nobr><b>" + xs[8] + "</b></nobr></td><td id=totaltime align=center onclick=changeplaytime(this) bgcolor=white  width=50>" + d1(m) + "</td><td  align=center style=color:blue onclick=Play.reinit(this)><nobr>" + xs[9] + "</nobr></td><td align=center style=color:black  bgcolor=lightblue><nobr>" + xs[10] + "</nobr></td>"
                        + "<td onclick=Play.changespeedup(this,-1) style=\"background-color:white;color:blue;font-weight:700\"  width=17>&lt;</td><td id=speednum align=center   bgcolor=transparent  width=17>" + Play.speedup + "</td><td onclick=Play.changespeedup(this,1) style=\"background-color:white;color:blue;font-weight:700\"  width=17>&gt;</td></tr></table>";
                x += "<table align=center border=1 style=\"border-collapse:collapse;margin:3px 0px 1px 0px\"><tr bgcolor=lightblue><td><nobr><b>" + xs[0] + "</b></nobr></td><td><nobr><b>" + xs[6] + "</b></nobr></td><td><nobr><b>" + xs[1] + "</b></nobr></td><td align=right><nobr><b>" + xs[2] + "</b></nobr></td><td align=right><nobr><b>" + xs[3] + "</b></nobr></td><td><nobr><b>" + xs[4] + "</b></nobr></td></tr>";
                for (var i = 0; i < numShapes; i++)
                {
                    if (allShapes[i] == null)
                        continue;
                    x += "<tr  bgcolor=lightyellow><td valign=middle  align=right >" + (i) + "</td>";
                    var l = allShapes[i].words.length;
                    if (l > 15)
                        l = 15;
                    var str;
                    if (allShapes[i].shapename == 'ellipse')
                        str = 'O';
                    else if (allShapes[i].shapename == 'diamond')
                        str = diamondchar;
                    else if (allShapes[i].shapename == 'roundrect')
                        str = "<img style=\"border:0px;width:13px;height:10px\"  src=\"" + originalurl + "/image/roundrect.png\">";
                    else
                        str = "<img style=\"border:0px;width:13px;height:10px\"  src=\"" + originalurl + "/image/rightrect.png\">";
                    x += "<td  align=center ><nobr>" + str + "</nobr></td>";
                    x += "<td  align=left ><nobr>" + allShapes[i].words.substring(0, l) + "</nobr></td>";
                    x += "<td align=right  bgcolor=white ><table bgcolor=white align=right cellspacing=0 cellpadding=0><tr><td valign=middle align=right  bgcolor=white  onclick=changeord(this," + i + ")>" + Math.floor(allShapes[i].start) + "</td><td valign=middle align=right  bgcolor=white  onclick=changedecimal(this," + i + ",'o') width=20>." + Math.round((allShapes[i].start - Math.floor(allShapes[i].start)) * 10) + "</td></tr></table></td>";
                    x += "<td align=right  bgcolor=white ><table  bgcolor=white align=right cellspacing=0 cellpadding=0><tr><td valign=middle align=right  bgcolor=white  onclick=changetm(this," + i + ")>" + Math.floor(allShapes[i].time) + "<td valign=middle align=right  bgcolor=white  onclick=changedecimal(this," + i + ",'t') width=20>." + Math.round((allShapes[i].time - Math.floor(allShapes[i].time)) * 10) + "</td></tr></table></td>";
                    x += "<td valign=middle align=right  bgcolor=white  onclick=changeZ(this," + i + ")>" + allShapes[i].zindex + "</td></tr>";
                }
                x += "</table>";
                myprompt(x, null, null, xs[5]);

            },
            changespeedup: function (s, k)
            {
                Play.speedup += k;
                if (Play.speedup == 0)
                    Play.speedup = 1;
                if (Play.speedup == 7 || Play.speedup == 9 || Play.speedup == 11)
                    Play.speedup += k;
                if (Play.speedup >= 13)
                    Play.speedup = 12;
                s.parentNode.cells[5].innerHTML = '' + Play.speedup;

            },
            stop: function ()
            {
                if (!Play.cando('stop'))
                    return;
                Play.current = 'stop';
                Play.color('stop');
                if (Play.handle != null)
                    clearInterval(Play.handle);
                Play.handle = null;
                Play.starttime = 0;

                for (var i = 0; i < numShapes; i++)
                {
                    if (allShapes[i] != null)
                    {
                        allShapes[i].visible = 0;
                        hideShape(i);
                    }

                }
                for (i = 0; i < numLines; i++)
                {
                    if (allLines[i] != null)
                    {
                        allLines[i].visible = 0;
                        hideLine(i);
                    }
                }
                sendObject(-2, 'Play.stop()');
            },
            cando: function (str)
            {
                var x = ";" + Play.current + "," + str + ";";
                var y = Play.nopath.indexOf(x);
                return (y < 0);
            },
            backward: function ()
            {
                var rightnow = (new Date()).getTime();
                if (Play.starttime == 0)
                {
                    Play.prevpage();
                    return;
                }
                if (!Play.cando('backward'))
                    return;
                Play.current = 'backward';
                Play.color('backward');
                var last = Math.round((Play.startunit - Play.starttime) / periodtime) / 10.0;
                var max = -1;
                for (var i = 0; i < numShapes; i++)
                {
                    if (allShapes[i] != null && allShapes[i].start < last)
                    {
                        if (allShapes[i].start > max)
                            max = allShapes[i].start;
                    }

                }
                if (max == -1)
                {
                    Play.prevpage();
                } else
                {
                    if (Play.handle != null)
                    {
                        clearInterval(Play.handle);
                        Play.handle = null;
                    }
                    Play.starttime = rightnow - max * (6000 / Play.speedup);
                    Play.play();
                }
                sendObject(-2, 'Play.backward()');
            },
            forward: function ()
            {
                if (!Play.cando('forward'))
                    return;
                Play.current = 'forward';
                Play.color('forward');
                var rightnow = (new Date()).getTime();
                if (Play.starttime == 0)
                    Play.starttime = rightnow;
                var last = Math.floor((rightnow - Play.starttime) / 6000 * Play.speedup) / 10.0;
                var min = 10000000000;
                for (var i = 0; i < numShapes; i++)
                {
                    if (allShapes[i] != null && allShapes[i].start > last)
                    {
                        if (allShapes[i].start < min)
                            min = allShapes[i].start;
                    }
                }
                if (min == 10000000000)
                {
                    Play.state = 'begin';
                    Play.nextpage();
                } else
                {
                    if (Play.handle != null)
                    {
                        clearInterval(Play.handle);
                        Play.handle = null;
                    }
                    Play.starttime = rightnow - min * 6000 / Play.speedup;
                    Play.play();
                }
                sendObject(-2, 'Play.forward()');
            },
            prevpage: function ()
            {
                var ps = $('selpage');
                if (ps.selectedIndex > 0)
                {
                    Play.stop();
                    ps.selectedIndex = ps.selectedIndex - 1;
                    changepage(ps);
                    Play.play();
                } else if (Play.handle != null)
                {
                    clearInterval(Play.handle);
                    Play.handle = null;
                }
                return;
            },
            nextpage: function ()
            {
                var ps = $('selpage');
                if (ps.selectedIndex < ps.options.length - 2)
                {
                    Play.stop();
                    ps.selectedIndex = ps.selectedIndex + 1;
                    changepage(ps);
                    Play.play();
                } else if (Play.handle != null)
                {
                    clearInterval(Play.handle);
                    Play.handle = null;
                }
                return;
            },
            pause: function ()
            {
                if (Play.starttime == 0)
                    return;
                if (!Play.cando('pause'))
                    return;
                Play.current = 'pause';
                Play.color('pause');
                if (Play.handle != null)
                    clearInterval(Play.handle);
                Play.handle = null;
                Play.idletime = (new Date()).getTime();
                Play.shorttime = Play.idletime - Play.startunit;
                sendObject(-2, 'Play.pause()');
            },
            resume: function ()
            {

                if (Play.starttime == 0)
                    return;
                if (!Play.cando('resume'))
                    return;
                Play.current = 'resume';
                Play.color('resume');
                var rightnow = (new Date()).getTime();
                Play.starttime += rightnow - Play.idletime;
                Play.startunit += rightnow - Play.idletime;
                setTimeout(Play.play, 6000 / Play.speedup - Play.shorttime % (6000 / Play.speedup));
                sendObject(-2, 'Play.resume()');
            },
            start: function ()
            {
                if (!Play.cando('start'))
                    return;
                Play.current = 'start';
                Play.color('start');
                Play.starttime = 0;
                if (Play.handle != null)
                    clearInterval(Play.handle);
                for (var i = 0; i < numLines; i++)
                {
                    if (allLines[i] != null)
                    {
                        allLines[i].visible = 1;
                        hideLine(i);
                    }
                }
                Play.handle = null;
                Play.play();
                sendObject(-2, 'Play.start()');
            },
            appear: function (n)
            {
                var str = '@keyframes appearmove{\n from {opacity:0.0;}\n to {opacity:1.0;}\n}\n@keyframes appeardiv{\n from {opacity:0.0;background-color:' + document.body.style.backgroundColor + ';}\n to {opacity:1.0;' + (allShapes[n].div != null ? ('background-color:' + allShapes[n].div.style.backgroundColor) : '') + '}\n}';

                var st = $('appearmove');
                if (st == null)
                {
                    st = document.createElement('style');
                    st.id = 'appearmove';
                    st.innerHTML = str;
                    document.getElementsByTagName('head')[0].appendChild(st);
                } else
                    st.innerHTML = str;

                if (allShapes[n].shapename == 'ellipse')
                {
                    allShapes[n].base.getElementsByTagName('div')[0].style.animationName = "appearmove";
                    allShapes[n].base.getElementsByTagName('div')[0].style.animationFillMode = "forwards";
                    allShapes[n].base.getElementsByTagName('div')[0].style.animationDuration = "2s";
                    allShapes[n].base.getElementsByTagName('div')[0].style.animationDelay = "0s";
                } else if (allShapes[n].shapename == 'diamond')
                {
                    allShapes[n].base.style.animationName = "appearmove";
                    allShapes[n].base.style.animationFillMode = "forwards";
                    allShapes[n].base.style.animationDuration = "2s";
                    allShapes[n].base.style.animationDelay = "0s";
                    allShapes[n].div.style.animationName = "appearmove";
                    allShapes[n].div.style.animationFillMode = "forwards";
                    allShapes[n].div.style.animationDuration = "2s";
                    allShapes[n].div.style.animationDelay = "0s";
                }
                if (allShapes[n].div != null)
                {
                    allShapes[n].div.style.animationName = "appeardiv";
                    allShapes[n].div.style.animationFillMode = "forwards";
                    allShapes[n].div.style.animationDuration = "2s";
                    allShapes[n].div.style.animationDelay = "0s";
                }

            },
            disappear: function (n)
            {
                var tm = Math.ceil((allShapes[n].y + allShapes[n].x) / 500);
                var str = '@keyframes disappmove{\n'
                        + 'from{ top:' + Math.round(allShapes[n].y) + 'px;left;' + Math.round(allShapes[n].x) + 'px;opacity:1.0}\n';
                +'to  { top:0px;left;0px;opacity:0.0}}'
                var st = $('disappmove');
                if (st == null)
                {
                    st = document.createElement('style');
                    st.id = 'disappmove';
                    st.innerHTML = str;
                    document.getElementsByTagName('head')[0].appendChild(st);
                } else
                    st.innerHTML = str;
                allShapes[n].base.style.animationName = "disappmove";
                allShapes[n].base.style.animationFillMode = "forwards";
                allShapes[n].base.style.animationDuration = tm + "s";
                allShapes[n].base.style.animationDelay = "0s";

            },
            play: function ()
            {
                var rightnow = (new Date()).getTime();
                if (rightnow - Play.startunit < 30)
                {
                    return;
                }

                Play.startunit = rightnow;
                if (Play.starttime == 0)
                {
                    Play.starttime = rightnow;
                }
                Play.state = 'play';
                var numshown = 0;
                var maxd = 0;

                for (var i = 0; i < numShapes; i++)
                {
                    if (allShapes[i] == null)
                        continue;
                    var starttime = allShapes[i].start;
                    var endtime = allShapes[i].time + starttime;
                    var tt = Math.round((rightnow - Play.starttime) / 6000 * Play.speedup);
                    if (tt >= Math.round(10 * starttime) && tt < Math.round(10 * endtime))
                    {
                        allShapes[i].visible = 0;
                        hideShape(i);
                        numshown++;
                        if (endtime > maxd)
                        {
                            maxd = endtime;
                        }
                        if (tt == Math.round(10 * starttime))
                        {
                            Play.appear(i);
                        }

                    } else
                    {
                        allShapes[i].visible = 1;
                        hideShape(i);
                    }
                }

                if (numshown == 0)
                {
                    Play.nextpage();
                } else
                {
                    var soon = 10000000000;
                    for (var i = 0; i < numShapes; i++)
                    {
                        if (allShapes[i] == null)
                            continue;
                        var starttime = allShapes[i].start + Math.round((Play.starttime - rightnow) / 6000 * Play.speedup) / 10.0;

                        if (starttime < 1 / 60.0)
                            continue;
                        if (starttime < soon)
                        {
                            soon = starttime;
                            // myprompt(allShapes[i].start + '<br>'+ (Play.starttime - rightnow) + '<br>' + starttime);
                        }
                    }
                    if (soon != 10000000000)
                        cord.innerHTML = '' + (Math.floor(soon)) + "'" + (Math.round((soon - Math.floor(soon)) * 60)) + "\"";
                    else
                        cord.innerHTML = '' + (Math.floor(maxd)) + "'" + (Math.round((maxd - Math.floor(maxd)) * 60)) + '"';

                }
                if (Play.handle == null)
                    Play.handle = setInterval(Play.play, 6000 / Play.speedup);
            },
            remote: function ()
            {
                var y = '';
                for (var i = 0; i < numShapes; i++)
                {
                    if (allShapes[i] == null)
                        continue;
                    var l = allShapes[i].words.replace(/<[^>]+>/g, '').length;
                    y += i + ',' + allShapes[i].shapename + "," + l + ',' + allShapes[i].start + ',' + allShapes[i].time + ';';
                }

                var url = originalurl + "/remote.jsp?t=" + tstmp + '&schedule=' + y.replace(/;$/, '') + "&current=" + Play.current;

                open(url, iframename);
            },
            initRemote: function (securitytoken, uid, sek)
            {
                Msg.init({stoken: securitytoken,
                    app: "chat",
                    tid: '',
                    sid: uid,
                    sname: uid,
                    rid: '',
                    code: '',
                    msg: '',
                    sek: sek});
                Msg.needmore = true;
                Msg.listen();
                Msg.send({code: 'new', msg: '' + tstmp});

            },
            endRemote: function ()
            {
                Msg.send({code: 'unsubs', msg: Msg.tid});
            },
            quitremote: function ()
            {
                open(originalurl + "/remote.jsp?t=" + tstmp + "&schedule=", 'w' + tstmp);
                closeprompt();
            }


        }

initfilename();
makebtns();

makeframe();

if (editable)
{
    window.onunload = savetocache;
}

var oldonload4 = window.onload;
window.onload = function ()
{
    onlinetoolbarhas = true;
    if (oldonload4 != null)
        oldonload4();
    initialdraw();
    changefontfamily();

    var needtranslator = 0;
    if (document.body.style.backgroundImage == 'url()' || document.body.style.backgroundImage == '')
    {
        document.body.style.backgroundImage = null;
    }
    Play.sel = $('selplay');
    Play.sel.style.width = '60px';
    Play.color('stop');


    //Play.initRemote();
}







