/************************************************************************** 
 * (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
 * Author: Zhongyan Lin                                                   *
 **************************************************************************/
 
var onlinetoolinitial  = "";
var guessedFormat = 0;
var elexy = new Array(NUMROWS + 1);
var associatedtxt = null;
var valuechanged = new Array(NUMROWS);
var timechanged = ";";
var mandatory = new Array(numCols);
var lookup = new Array(numCols);
var periodvalue = 0;
var nullvalue = new Array(numCols);
var running = 0;
var f1 = null;
var passedCol = -1;
var passedRow = -1;
var colsfed = '';
var counter = 0;
var rr, cc;
var nav1 = null;
var contentarea = null;
var popwin1 = null;
var datapresentformat = '';
var tinywin = "w" + tstmp;
var holdvalues = new Array();
var fmtcol = numCols;
var actualformat = "0";

for (cc = 0; cc < numCols; cc++)
{
    
    c = positionr[cc];
    lookup[c] = running;
    if ((ctype[c] == 'r' || ctype[c] == 'R') && options[c] != null && options[c].length > 1)
        running += options[c].length;
    else
        running++;
}
var showattachment = function(s,r){}
var numattachfiled = 0;

for (c = 0; c < numCols; c++)
{
    if (fields[c].toLowerCase().indexOf('attach')==0)
    {
        numattachfiled++;
        if (typeof(Hwtake)=='undefined')
                document.write('<scri'+ 'pt type=text/javascript src=assessform.js></scr'+ 'ipt>');
    }
    if (fields[c].toLowerCase() == 'format' || fields[c].toLowerCase().indexOf('format') == 0 && fmtcol==numCols)
        fmtcol = c;
    if (defaultRecord[c] == null || defaultRecord[c] == '' || defaultRecord[c].charAt(0) != '!')
    {
        mandatory[c] = false;
    }
    else
    {
        mandatory[c] = true;
        defaultRecord[c] = defaultRecord[c].substring(1);
    }

    if (dtype[c] == false && defaultRecord[c] == null)
        defaultRecord[c] = '';
    if (ctype[c] == 'm' || ctype[c] == 'M')
    {
        if (defaultRecord[c] == null)
            defaultRecord[c] = "";
        var nowtime = ~~((new Date()).getTime()/1000);
        var tmpv = defaultRecord[c].replace(/\?\?CURRENT_TIME\?\?/, '' + nowtime);
        
        if (tmpv != '')
            try 
            {
                eval(tmpv.replace(/#/g,''));
            } catch (e) 
            {
                defaultRecord[c] = "" + parseTime(tmpv);
                var tt = (new Date()).getTime();
                if (''+defaultRecord[c] == 'NaN')
                    defaultRecord[c] = '' + (''+(tt1/1000)).replace(/\..*/,'');
            }
    }
    if (ctype[c] == 'c' || ctype[c] == 'C')
    {
        if (defaultRecord[c] == null || defaultRecord[c] == '' || defaultRecord[c].charAt(0) == '0')
            defaultRecord[c] = '0';
        else
            defaultRecord[c] = '1';
    }
    if (dtype[c] == false)
        nullvalue[c] = '';
    if (ctype[c] == 'c' || ctype[c] == 'C')
        nullvalue[c] = '0';
    else if (dtype[c])
        nullvalue[c] = null;
    
    var emptyL = 0;
    for (var i = 0; i < NUMROWS; i++)
    {
        if (mat[i][c] == null || mat[i][c] == '')
        {
            mat[i][c] = nullvalue[c];
            if (ctype[c] == 'L' || ctype[c] == 'k')
                emptyL++;
        }
        
        if (fields[c].toLowerCase().indexOf("attach") == 0) 
        {
            var cp = new CSVParse(mat[i][c].replace(/,$/,''), '\'', '@', ',');
            var arr = cp.nextMatrix(true);
            var kk = 0;
            var tmps = '';
            for (var j=0; j < arr.length; j++)
            {
                if (arr[j].length!=3) {tmps = '';break;}
                tmps  += arr[j][0] + '@' + arr[j][1] + "@";
                
                if (arr[j][0].replace(/[0-9]/g, "")=="" && arr[j][2].replace(/[0-9]/g, "")=="___")
                {
                    tmps += arr[j][2];
                    kk++;
                }
                else if (arr[j][1].replace(/[0-9]/g, "")=="" && arr[j][2].replace(/[0-9|a-z]/g, "").replace(/\n/g, "")=="")
                {
                    tmps += decryptString0(arr[j][2]);
                    kk++;
                }
                tmps += ",";
            }
            
            if (tmps!='' && kk == arr.length)
            {
                
                mat[i][c] = tmps;
            }
        } 
    }
    if (emptyL == NUMROWS && (ctype[c] == 'L' || ctype[c] == 'k'))
        for (var i = 0; i < numRows; i++)
            mat[i][c] = defaultRecord[c];

}
 
for (var i = 0; i < NUMROWS; i++)
    valuechanged[i] = false;


cellonblur += STNEVE[0];
cellonfocus += STNEVE[1];
onsave += STNEVE[2];
onsaved += STNEVE[3];
onbegin += STNEVE[4];
onclose += STNEVE[5];
exbut += STNEVE[6];
validating = '';

function makesend(dobut)
{
    var doit = false;
    for (var kk = 0; kk < numCols; kk++)
    {
        if (ctype[kk] != null && (ctype[kk] == 'l' || ctype[kk] == 'L' || ctype[kk] == 'i' || ctype[kk] == 'k') )
        {
            doit = true;
            break;
        }
    } 
    var str = "";
    var j = 0;
    
    if (doit || mm > 0)
    {  
        str += ("<div style=\"margin:0px 0px 0px 0px;display:inline;width:0%\" id=sendformdiv>\n<form rel=opener name=formsend id=frmsnd method=post  style=\"margin:0px 0px 0px 0px;width:0%\"  >\n");
        var hasiid = false, hassubdb = false
 
        for (var z = 0; z < numCols; z++)
        {
            str += ("<input type=\"hidden\" name=\"" + fields[z] + "\" >\n");
            if (hasiid == false && fields[z] == 'iid')
                hasiid = true;
            if (hassubdb == false && fields[z] == 'subdb')
                hassubdb = true;
        }
        if (hasiid == false)
            str += ("<input type=\"hidden\" name=\"iid\" value=\"" + iid + "\">\n"); 
        if (hassubdb == false)
            str += ("<input type=\"hidden\" name=\"subdb\" value=\"" + subdb + "\">\n"); 
        str += ("<input type=\"hidden\" name=\"securitytoken\" value=\"" + ((typeof (securitytoken) == 'undefined') ? '' : securitytoken) + "\">\n");
        
        if (webserviceAlloptions != null && webserviceAlloptions != '')
        {
            var notlink = webserviceAlloptions.replace(/<a.*<.a>/g, '');
            
            webserviceAlloptions = webserviceAlloptions.substring(0, webserviceAlloptions.length - notlink.length);
            for (var z = 0; z < numCols; z++)
                notlink = notlink.replace("<input type=hidden name=\"" + fields[z] + "\"[^>]*>", '');
           
            if (datapresentformat == 'DataTable') 
            {
                notlink = notlink.replace(/size=26/,"size=2");
            }
           
            str +=  notlink  ;
           
            j = notlink.length;
        }
        
        if (dobut != null && webserviceAllbuts!='')
        {
            
            var tmpx = "width:" + Math.round(charwidthrate()*font_size) + "px;height:" + (font_size+6)+ "px;"; 
            
            if (str.indexOf("</table>") >0)
               str  = str.replace(/<.tr><.table>/, "<td>" + webserviceAllbuts.replace(/<br>$/,'').replace(/<br>/g, '</td><td>').replace(/(style=["]?)/ig,  "$1" + tmpx)   + "</td></tr></table>" );
            else
               str += webserviceAllbuts.replace(/(style=["]?)/ig,  "$1" + tmpx);
        }
        str += ("</form></div>");
       
        document.write(str);
        fsnd = document.formsend;
        var ele = formselementbyname(fsnd, "iid");
        if (ele == null)
        {
            ele = document.createElement('input');
            ele.type='hidden';
            ele.name = 'iid';
            ele.value = iid;
            fsnd.appendChild(ele);
        }
         ele = formselementbyname(fsnd, "subdb");
        if (ele == null)
        {
            ele = document.createElement('input');
            ele.type='hidden';
            ele.name = 'subdb';
            ele.value = subdb;
            fsnd.appendChild(ele);
        }
         
    }
    return (j > 0) ? 1 : 0;
}
function fsndElement(txtname)
{
    if (fsnd == null)
        return null;
    for (var j = 0; j < fsnd.elements.length; j++)
        if (fsnd.elements[j].name == txtname)
            return fsnd.elements[j];
    return null;
}
function disableFields(formptr, TorF)
{
    for (var i = 0; i < formptr.elements.length; i++)
    {
        if (formptr.elements[i].name != 'subdb'
                && formptr.elements[i].name != 'File'
                && formptr.elements[i].name != 'subfolder'
                && formptr.elements[i].name != 'course'
                && formptr.elements[i].name != 'To')
            formptr.elements[i].disabled = TorF;
    }
}
function dim(x, y)
{
    return 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=' + x + ',height=' + y + ',top=' + ((screen.height - y) / 2) + ',left=' + ((screen.width - x) / 2);
}
function copydatato(ta, jj)
{
    if (typeof(fsnd)=='undefined' || fsnd == null)
        return;

    var Z = counter;
    if (datapresentformat == "DataTable" || datapresentformat == "DataLongForm")
        Z = rr;

    if (mm > 0 && jj >= 0 && asso[jj] != null)
    {
        if (ta != null)
            asso[jj].value = ta.value;
        for (var zz = 0; zz < asso.length; zz++)
            if (asso[zz] == asso[jj])
                asso[zz].disabled = false;
            else if (asso[zz] != null)
                asso[zz].disabled = true;
    }

    if (fsnd != f1)
    {
        for (var j = 0; j < numCols && fsnd.elements.length; j++)
        {
            if (Z < numRows && ctype[j].toUpperCase() == ctype[j])
            {
                fsnd.elements[j].value = mat[Z][j];
            }
            else
            {
                fsnd.elements[j].value = retrv(Z, j);
            }
        }

    }
}

var theattachbtn = null;

function webservice(ta, s, jj, btn, win2go)
{
    
    if (s == 'follows.jsp')   win2go = 'w' + tstmp;
    if (typeof (hidemyhint) != 'undefined')
    {
        hints[jj] = null;
        hidemyhint();
    }
    if (datapresentformat == "DataLongForm")
    {
        if (rr >= 0 && cc >= 0 && ctype[cc] == 'a')
            ta = ele(rr, cc);
    }
    if (fsnd == null)
        return;
    copydatato(ta, jj);

    if (ta == null)
    {
        contentarea = null;
    }
    else if (contentarea != ta)
    {
        contentarea = ta;
    }
    if (s.indexOf('Upload') >= 0 || s.indexOf('Attach') >= 0)
    {
        win2go = 'w' + tstmp;
        fsnd.localpathtoupload.disabled = false;
        if (fsnd.localpathtoupload.files.length==0) return;
        fsnd.encoding = "multipart/form-data";
        if (s == "UploadWfa" && pubkeys.indexOf("u_")>=0 && (H.toLowerCase().indexOf("userid,")>=0 || H.toLowerCase().indexOf("uid,")>=0 ))
        {
             if (typeof (fsnd.dfilename) == 'undefined')
             {
                 var dfilenameele = document.createElement("input");
                 dfilenameele.setAttribute("type", "hidden");
                 dfilenameele.setAttribute("name", "dfilename");
                 fsnd.appendChild(dfilenameele);
             }
             var jj = 0;
             for (; fields[jj].toLowerCase() != 'userid' && fields[jj].toLowerCase() != 'uid'; jj++);
             if (counter<0) counter = 0;
             fsnd.dfilename.value = retrv(counter,jj);
             onsave += ";ResizeUploaded.alluploaded='';alluploadedfiles='';";
             
        }
        if (typeof (fsnd.subdb) == 'undefined')
        {
            var subdbele = document.createElement("input");
            subdbele.setAttribute("type", "hidden");
            subdbele.setAttribute("name", "subdb");
            subdbele.value = subdb;
            fsnd.appendChild(subdbele);
        }
        if (typeof (fsnd.rdap) != 'undefined')
            fsnd.rdap.value = rdapname;
        if (btn!=null)
        {
        btn.disabled = true;
        btn.style.cursor = "wait";
        theattachbtn = btn;
        }
    }
    else
    {
        fsnd.encoding = 'application/x-www-form-urlencoded';
    }
    formnewaction(fsnd, s);
    if (typeof (win2go) == 'undefined' && s.indexOf('Upload') == 0)
        var win2go = "w" + tstmp;
    if (typeof (win2go) == 'undefined' || win2go == null)
    {
        
        popwin = '' + s.replace(/^Data\w+\?rdap=/, '').replace(/\W/g, 'a');
        if (popwin.length > 8)
            popwin = popwin.substring(0, 8);
        myprompt('<iframe name=' + popwin + " width=500  height=500 />",null,null,labels[jj]);
        nav1 = window.open('', popwin);
        fsnd.target = popwin;
        if (nav1.document)
        {
            nav1.document.writeln('<html>' + metaencode + '<head><title> <title></head><body bgcolor=' + DBGCOLOR + '>' + textmsg[86] + '</body><html>');
            nav1.focus();
        }
    }
    else
    {
        //nav1 = window.open('', win2go);
        fsnd.target = win2go;
    }
    if (s == 'preview.jsp' && typeof(fsnd.Format)!='undefined'  && fsnd.Format.value == '0')
    {
        fsnd.Format.disabled = true;
    }
   visual(fsnd);
   fsnd.submit();
    if (s == 'preview.jsp' && typeof(fsnd.Format)!='undefined'  && fsnd.Format.value == '0')
    {
        fsnd.Format.disabled = false;
    }

}
doupload = function(){
    visual(fsnd);
    fsnd.submit();
}
function getImageByName(nm)
{
    var al = document.images;
    if (al!=null) 
    for (var i=0; i < al.length; i++)
    {
        if (al[i].name == nm)
        return al[i];
    }
    return null;
}

function failupload(err,leng,newfilename,js)
{
    if (theattachbtn != null)
    {
        theattachbtn.disabled = false;
        theattachbtn.style.cursor = "default";
    }
    if (err == null || err == '')
    {
        if ( ResizeUploaded.noattachindex>0)
        {
            setv(counter,ResizeUploaded.noattachindex,retrv(counter,ResizeUploaded.noattachindex));
            ResizeUploaded.updatepic();
        }
    }
    else if (typeof(err) == 'number')
    {
        var y =  ResizeUploaded.filename;
         
        ResizeUploaded.filename =  newfilename+ '@' + err;
        if (ResizeUploaded.attachref!=null)
        {
            var z = ResizeUploaded.unzip( ResizeUploaded.attachref.value );
            var j = z.indexOf(y);
            if (j >-1)
            {  
                var k = j + y.length;
                while (k < z.length && z.charAt(k) != ',') k++;
                var w = z.substring(0,j) + ResizeUploaded.filename + '@' + js;
                if (k < z.length)  w += z.substring(k); 
                ResizeUploaded.attachref.value = ResizeUploaded.zip(w);
                if (ResizeUploaded.attachindex>-1)
                {
                    holdvalues[counter + '_' + ResizeUploaded.attachindex] = ResizeUploaded.attachref.value;
                }
            }
        }
        var z = ResizeUploaded.alluploaded;
        var j = z.indexOf(y);
        ResizeUploaded.alluploaded = z.substring(0,j) + ResizeUploaded.filename + z.substring(ResizeUploaded.filename.length + j)  ;
        j = ResizeUploaded.noattachindex;
        if (j>=0 && ctype[j].toLowerCase()=='u')
        {
            var xm = getImageByName('image'+j);
            if (xm!=null)
            {
                xm.src= ResizeUploaded.noattachurl + "&tcode=" + (new Date()).getTime()%100000000;
            }
        }
        else if (typeof(setaction) == 'function')
            ;//setaction(1,false);
        if (ResizeUploaded.dosplitnow)
        {
            ResizeUploaded.cutoff();
            ResizeUploaded.dosplitnow = false;
        }
    }
    else
        myprompt(err);
    
    
}

function openmid(url, x, y)
{
    if (x == null)   x = 300;
    if (y == null)  y = 300;
    window.open(url+"&t=" + (new Date()).getTime(), '_blank');
}
var extraele =null;
function removeextraeles()
{
    if (extraele == null) return;
    for (var j=0; j < extraele.length; j++)
           fsnd.removeChild(extraele[j]); 
    extraele = null; 
}
function openit(url, Z, winname)
{
    removeextraeles();
    if (url == null || url == '' || fsnd == null)
        return;
    fsnd.encoding = 'application/x-www-form-urlencoded';
    if (winname == null)
    {
        winname = '_blank';
    }

    if (url.indexOf("javascript") == 0)
    {
        eval(url);
    }
    else
    {
        // (winname != '_blank')  window.open("", winname);

        if (Z >= 0)
        {
            for (var j = 0; j < numCols; j++)
            {
                if (typeof (fsnd) == 'undefined' || fsnd == null || typeof (fsnd.elements) == 'undefined' || fsnd.elements == null || j >= fsnd.elements.length)
                    break;
                var ele = formselementbyname(fsnd, fields[j]);
                if (ele == null) 
                {
                    ele = document.createElement('input');
                    ele.name = fields[j];
                    ele.type= 'hidden';
                    fsnd.appendChild(ele);
                }
                if (Z < numRows && ctype[j].toUpperCase() == ctype[j]   )
                {
                    if (ctype[j] == 'L')
                    {
                        ele.value = extractfromm(mat[Z][j], true);
                    }
                    else
                    {
                        ele.value = mat[Z][j];
                    }
                }
                else
                {
                    ele.value = retrv(Z, j);
                    
                }
            }
        }
        extraele = new Array();
        var ii = url.indexOf("?");
        if (ii > -1)
        {
            var pv = url.substring(ii + 1);
            var jj = pv.lastIndexOf("#");
            if (jj > -1)
                pv = pv.substring(0, jj);
            var pvs = pv.split(/&/);
             
            for (var i = 0; i < pvs.length; i++)
            {
                var k = pvs[i].indexOf("=");
                if (k == -1)
                    continue;
                var X = null;
                if (k == pvs[i].length - 1)
                    X = [pvs[i].substring(0, k), ''];
                else
                    X = pvs[i].split(/=/);
                
                for (var j = 0; j < fsnd.elements.length; j++)
                {
                    if (X[0] == fsnd.elements[j].name)
                    {
                        fsnd.elements[j].value = decodeURIComponent(X[1]);
                        fsnd.elements[j].disabled = false;
                        break;
                    }
                }
                
                if (j == fsnd.elements.length)
                {
                   
                    var el = document.createElement("input");
                    el.type = "hidden";
                    el.name = X[0];
                    if (X[1].indexOf('~')>=0) 
                            el.value = '~' +  decodeURIComponent(X[1].substring(1));
                    else
                       el.value = decodeURI(X[1]);
                  
                    fsnd.appendChild(el);
                    extraele[extraele.length] = el;
                }
            }
            url = url.substring(0, ii);
        }
       
         formnewaction(fsnd, url);
        
        if (typeof(fsnd.localpathtoupload) != 'undefined')
        {
            fsnd.localpathtoupload.disabled = true;
        }
        fsnd.target = winname;
        
       visual(fsnd);
       fsnd.submit();
        if (typeof(fsnd.localpathtoupload) != 'undefined')
        {
            enablelocalpathupload() ;
        }
         
        
    }
}

function enablelocalpathupload()
{
    if (typeof(fsnd)!='undefined' && typeof(fsnd.localpathtoupload)!='undefined')
    fsnd.localpathtoupload.disabled = false;
}



function extractfromm(url, capt)
{
    if (url == null || url == '')
        return "";
    var hh = url.indexOf(">>");
    if (hh != -1)
    {
        if (capt == false)
            return url.substring(hh + 2);
        return url.substring(0, hh);
    }
    else
    {
        if (false == capt)
            return  url;
        return  ">>";
    }
     
}


function openit1(url, Z)
{
    if (url == null)
        return;
    if (url == '' || url.charAt(0) == '&')
    {
        if (passedCol != -1 && defaultRecord[passedCol] != '')
            url = defaultRecord[passedCol] + url;
        else
            return;
    }
    
    var d = '';
    if (url.indexOf('DataPicker') >= 0)
    {
        var k = url.indexOf('colsfed=');
 
        if (k != -1)
        {
            var l = url.indexOf('&', k + 8);
            if (l == -1)
                d = url.substring(k + 8);
            else
                d = url.substring(k + 8, l);
            if (typeof(fsnd.existing) !='undefined' && d!='')
            {
                fsnd.existing.value =    d + '~' + fsnd.existing.value;
            }
            
        }
        
        
    }
    
    openit(url, Z, null);
}
function openit3(r,c)
{
   passedRow=r;
   passedCol=c;
   var str = defaultValue(r,c);
   
   if (r < numRows) str = mat[r][c];
  
   if (typeof(fsnd.existing) == 'undefined')
   {
        var btn = document.createElement('input');
        btn.type='hidden';
        btn.name = 'existing';
        fsnd.appendChild(btn);
   }
   str = str.replace(/&existing=[^&]*$/,'').replace(/\?existing=[^&]*$/,'').replace(/&existing=[^&]*&/,'&').replace(/\?existing=[^&]*&/,'?');
   
   fsnd.existing.value = retrv(r,c-1);
    
   openit1(str,r);
}
function openit2(Z, j)
{
    if (Z >= numRows && defaultRecord[j].indexOf('DataPicker')>=0)
    {
        openit3(Z,j);
        return;
    }
    rr = Z;
    if ( ctype[j] =='L' && fsize[j]!=null && fsize[j]!='' && isNaN(fsize[j])==false)
    {
        if (fsize[j]!='0')
        {
            if (ffsize[j]==null || ffsize[j]=='' || isNaN(ffsize[j])) ffsize[j] = thispageheight() - 10;
            myprompt('<iframe id=within name=openlink width=' + fsize[j] + '  height=' + ffsize[j] + ' />',null,null,labels[j]);
            var h = 0;
            if (typeof(document.scrollingElement)!='undefined')
                h = document.scrollingElement.scrollTop;
            else (typeof(document.documentElement)!='undefined' && typeof(document.documentElement.scrollTop)!='undefined')
                h = document.documentElement.scrollTop;
            promptwin.style.top = h + 'px'; 
            promptwin.style.left = '0px';
            popwin1 = 'openlink';
        }
        else
        {
            popwin1 = 'w' + tstmp;
        }
    }
    else if (fsize[j] != null && fsize[j].toLowerCase() == 'h')
    {
        popwin1 = 'w' + tstmp;
    }
    else if (popwin1 == null && (fsize[j]==null || fsize[j]=='' || isNaN(fsize[j]))) 
    {
        popwin1 = "_blank";
    }
     
    if (Z < numRows && mat[Z][j] != '')
    {
        openit(extractfromm(mat[Z][j], false), Z, popwin1);
    }
    else
    { 
        openit(extractfromm(defaultRecord[j], false), Z, popwin1);
    }
   
}
function setgooddim(w, h)
 {
     for (var j=0; j < window.frames.length; j++)
         if (window.frames[j].name == 'openlink' )
     {
         window.frames[j].width = w + 'px';
         window.frames[j].height = h + 'px';
     }
 }
function resistchange(r, c)
{
    setv(r, c, x);
}
//var supportevent = (navigator.appName=='Microsoft Internet Explorer'); 

function isDigitKey(keyc)
{
    return (keyc >= 48 && keyc <= 57)
            || keyc == 45 || keyc == 46 || keyc == 69 || keyc == 101 || keyc == 50;
}
function isDigitEvent(evt)
{
    if (evt == null)
        evt = window.event;
    var keyc = (typeof evt.keyCode != 'undefined' && evt.keyCode != null) ? evt.keyCode : evt.which;
    return (keyc >= 48 && keyc <= 57)
            || keyc == 45 || keyc == 46 || keyc == 69 || keyc == 101;
}


function allowenter(r, c, evt)
{
    if (ctype[c] == ctype[c].toUpperCase() && r < numRows)
        return false;
    if (typeof (event) == 'undefined')
        return true;

    if (dtype[c] && !isDigitEvent(evt))
        return false;

    return true;
}
var newlabel = textmsg[114];
var updatelabel = textmsg[67];
var deletelabel = textmsg[69];
var labeli = insertQuery.indexOf(":");
if (labeli <= 15 && labeli > 0)
{
    newlabel = insertQuery.substring(0, labeli);
    insertQuery = insertQuery.substring(1 + labeli);
}
labeli = updateQuery.indexOf(":");
if (labeli <= 15 && labeli > 0)
{
    updatelabel = updateQuery.substring(0, labeli);
    updateQuery = updateQuery.substring(1 + labeli);
}
 
labeli = -1; if (deleteQuery!=null) 
    labeli = deleteQuery.indexOf(":");

if (labeli <= 15 && labeli > 0)
{

    deletelabel = deleteQuery.substring(0, labeli);
    deleteQuery = deleteQuery.substring(1 + labeli);
}
 
var pointer = new Array(numRows);

var sw = new Array(numCols);
for (var ii = 0; ii < numCols; ii++)
    sw[ii] = 1;

function swap1(a)
{
    var b = new Array(numRows);
    for (var i = 0; i < numRows; i++)
        b[i] = a[i];
    for (var i = 0; i < numRows; i++)
        a[i] = b[pointer[i]];
}

function swap2(a)
{
    var b = new Array(numRows);
    for (var c = 0; c < numCols; c++)
    {
        for (var i = 0; i < numRows; i++)
            b[i] = a[i][c];
        for (var i = 0; i < numRows; i++)
            a[ i][c] = b[pointer[i]];
    }
}


function parseDouble(s)
{
    var ar = s.split('.');
    var t = parseInt(ar[0]);
    if (ar.length == 1)
        return t;
    var l = ar[1].length;
    return t + parseInt(ar[1]) * Math.pow(10, -l);
}
function swaptwoarrayele(arry, i, j)
{
    var T = arry[i];
    arry[i] = arry[j];
    arry[j] = T;
}
function swapp(i, j)
{
    swaptwoarrayele(pointer, i, j)
}
function compare(u, v)
{
    var an = 0;
    if (mat[v][cc] == nullvalue[cc] && mat[u][cc] == nullvalue[cc])
        an = u - v;
    else if (mat[u][cc] == nullvalue[cc] && mat[v][cc] != null)
        an = -1;
    else if (mat[v][cc] == nullvalue[cc] && mat[u][cc] != null)
        an = 1;
    else if (dtype[cc])
    {
        if (parseFloat(mat[u][cc]) < parseFloat(mat[v][cc]))
            an = -1;
        else if (parseFloat(mat[u][cc]) > parseFloat(mat[v][cc]))
            an = 1;
        else
            an = u - v;
    }
    else
    {
        if (mat[u][cc] < mat[v][cc])
            an = -1;
        else if (mat[u][cc] > mat[v][cc])
            an = 1;
        else
            an = u - v;
    }
    return sw[cc] * an;
}
function QuickSort(l, r)
{
    if (l >= r)
        return;
    var t = l;
    var w = r;
    r++;
    l--;
    do
    {
        do {
            l++;
        } while (l < w && compare(pointer[l], pointer[t]) <= 0);
        do {
            r--;
        } while (r > 0 && compare(pointer[r], pointer[t]) > 0);
        if (l < r && compare(pointer[r], pointer[l]) != 0)
            swapp(r, l);
    } while (l < r);

    if (compare(pointer[r], pointer[t]) != 0)
        swapp(t, r);
    QuickSort(t, r - 1);
    QuickSort(r + 1, w);
}

function mergesort(list)
{
    var k;
    k = Math.floor(list.length / 2);
    if (k < 1) {
        return;
    }
    var left = new Array();
    var right = new Array();
    while (list.length > k) {
        left.push(list.shift());
    }
    while (list.length > 0) {
        right.push(list.shift());
    }
    mergesort(left);
    mergesort(right);
    while ((left.length > 0) && (right.length > 0))
    {
        if (compare(left[0], right[0]) < 0)
        {
            list.push(left.shift());
        }
        else
        {
            list.push(right.shift());
        }
    }
    while (left.length > 0)
    {
        list.push(left.shift());
    }
    while (right.length > 0)
    {
        list.push(right.shift());
    }
    return;
}

function  qsort() {
    QuickSort(0, numRows - 1);
}
function bsort()
{
    for (var p = 1; p < numRows; p++)
        for (var j = 0; j < numRows - p; j++)
            if (compare(pointer[j], pointer[j + 1]) > 0)
                swapp(j, j + 1);
}
function exsort()
{
    var jj = 0, front;
    while (jj < numRows - 1)
    {
        front = jj;
        while (jj < numRows - 1 && mat[jj][cc] == mat[++jj][cc])
            ;
        if (jj - front == 1)
            continue;
        var arr = new Array(jj - front);
        for (var kk = 0; kk < jj - front; kk++)
            arr[kk] = pointer[front + kk];
        arr.sort();
        for (kk = 0; kk < jj - front; kk++)
            pointer[front + kk] = arr[kk];
    }
}
function sort(j)
{
    
    cc = j;
    sw[j] = -sw[j];
    for (var i = 0; i < numRows-1; i++)
    {
        if (valuechanged[i])
        {
           myprompt(textmsg[791] + ": " + i + "-th row");
           return;
        }
        pointer[i] = i;
    }
    pointer.sort(compare);
    swap1(deleted);
    swap1(valuechanged);
    swap2(mat);
    populate(true);
    for (var i = 0; i < numRows; i++)
       valuechanged[i] = false;
   
}

function dcunt(j)
{
    var nd = 0;
    for (var i = 0; i < NUMROWS; i++)
    {
        var tmp = retrv(i, j);
        if (tmp != nullvalue[j])
        {
            var k = 0;
            for (; k < nd && tmp != retrv(pointer[k], j); k++)
                ;
            if (k == nd)
                pointer[nd++] = i;
        }
    }
    return nd;
}
var hasfoot = false;

for (var c = 0; c < numCols; c++)
{
    if (foot[c] == 'null' || foot[c] == 'NULL')
        foot[c] = '';
    if (foot[c].length > 1 && isNaN(foot[c]))
    {
        hasfoot = true;
    }
    else
        foot[c] = '';
}



function max(arr, kk)
{
    if (kk == 0)
        return '';

    var tt = arr[0];
    for (var w = 1; w < kk; w++)
        if (arr[w] > tt)
            tt = arr[w];
    return tt;
}
function min(arr, kk)
{
    if (kk == 0)
        return '';

    var tt = arr[0];
    for (var w = 1; w < kk; w++)
        if (arr[w] < tt)
            tt = arr[w];
    return tt;
}
function sum(arr, kk)
{
    var tt = 0;
    for (var w = 0; w < kk; w++)
        if (arr[w] != null) {
            tt += arr[w];
        }
    return tt;
}

function mean(arr, kk)
{
    if (kk <= 0)
        return '';
    return sum(arr, kk) / kk;
}
function sdv(arr, kk)
{
    if (kk == 0)
        return '';
    var yy = mean(arr, kk);
    var tt = 0;
    for (var w = 0; w < kk; w++)
        tt += (arr[w] - yy) * (arr[w] - yy);
    return Math.sqrt(tt / kk);
}

var numarray = new Array(NUMROWS);
var strarray = new Array(NUMROWS);
function calfoot(c, init)
{
    if (foot[c] == null)
        return null;
    else if (foot[c] == '')
        return '';
    // if (foot[c] != 'count' && foot[c] != 'dcunt' && foot[c] != 'max' && foot[c]!= 'min' && foot[c] != 'sum' && foot[c]!= 'mean' &&
    // foot[c] != 'sdv' )
    //    return  foot[c];
    var kk = 0;
    var tmpstr;

    if (foot[c] == 'count')
    {
        for (var r = 0; r < NUMROWS; r++)
        {
            if (init == null)
                tmpstr = mat[r][c];
            else
                tmpstr = retrv(r, c);

            if (tmpstr != nullvalue[c] && tmpstr != null)
                kk++;

        }

        return '' + kk;
    }
    else if (foot[c] == 'dcunt')
    {
        return dcunt(c);
    }
    if (dtype[c] == false)
        return '';
    var tmpnum;

    for (r = 0; r < NUMROWS; r++)
    {
        if (init == null)
            tmpstr = mat[r][c];
        else
            tmpstr = retrv(r, c);
        if (tmpstr == nullvalue[c])
            continue;
        tmpnum = parseFloat(tmpstr);
        if ('' + tmpnum != 'NaN')
        {
            numarray[kk++] = tmpnum;
        }
    }

    if (kk == 0) {
        if (foot[c] == 'sum')
            return '0';
        else
            return '';
    }
    var y = 0;
    try {
        if (ffsize[c] == null)
        {
            if (ctype[c].toLowerCase() == 'n')
                ffsize[c] = "2";
            else
                ffsize[c] = "0";
        }
        y = eval(foot[c] + "(numarray,kk)");
        return numberstr('' + y, ffsize[c]);
    }
    catch (error)
    {
        return foot[c];
    }
    switch (foot[c])
    {
        case 'sum':
            if (kk == 0)
                return '0';
            y = sum(numarray, kk);
            break;
        case 'mean':
            if (kk == 0)
                return '';
            y = mean(numarray, kk);
            break;
        case 'sdv':
            if (kk == 0)
                return '0';
            y = sdv(numarray, kk);
            break;
        case 'max':
            if (kk == 0)
                return '';
            y = max(numarray, kk);
            break;
        case 'min':
            if (kk == 0)
                return '';
            y = min(numarray, kk);
            break;
    }
    return '';
}
function readb(K,j)
{
    var tbl = document.getElementById('Igdt' +K + "_" + j);
    var s = '';
    for (var i=0; i < tbl.rows.length; i++)
    {
        for (var  j=0; j < tbl.rows[i].cells.length; j++)
        {
            s += "|" + tbl.rows[i].cells[j].innerHTML.replace(/\|/g,"||");
            var p = tbl.rows[i].cells[j].rowSpan;
            if (p == null) p = 1;
            var q =  tbl.rows[i].cells[j].colSpan;
            if (q == null) q = 1;
            var w = p + "x" + q;
            if (w!='1x1') s += "," + w;
            s += "|";
            if (j < tbl.rows[i].cells.length-1 )
                s += ",";
            else if (i < tbl.rows.length-1)
                s += ";";
        }
    }
    return s; 
}
function subs(s, K)
{
    var numitems = 0;
    var halt = false;
    if (s == null)
        return null;
    
    var state = 0;
    var i = 0, j = -1;
    var N = s.length;
    var num = "";
    var ans = "";
    var kk = 0;
    var inquo = false;
    for (; i < N; i++)
    {
        
        if (s.charAt(i) == "'")
        {
            switch (state)
            {
                case 21:
                    ans += "'";
                    state = 22;
                    break;
                case 22:
                    ans += "'";
                    state = 21;
                    break;
                case 0:
                    ans += "'";
                    state = 21;
                    break;
                case 1:
                    break;
                case 11:
                    break;
                case 31:
                    break;

            }
        }
        else if (s.charAt(i) == '|')
        {
            switch (state)
            {
                case 0:
                    state = 1;
                    num = "";
                    break;
                case 1:
                    j = parseInt(num);

                    if ("" + j != 'NaN' && j < numCols)
                    {
                        if (mat[K][j] != null)
                        {
                           
                            if (dtype[j])
                                ans += mat[K][j];
                            else
                                ans += "'" + mat[K][j].replace(/'/g, "''") + "'";
                        }

                    }
                    state = 0;
                    num = "";
                    break;

                case 11:
                case 31:
                    state = 1;
                    num = "";
                    break;

                case 21:
                    ans += "|";
                    break;
                case 22:
                    ans += "|";
                    state = 1;
                    break;
            }
        }
        else if (s.charAt(i) == '@')
        {
            switch (state)
            {

                case 11:

                    j = parseInt(num);
                    if ('' + j == 'NaN' || j >= numCols)
                    {
                        ans += '@' + num + '@';
                        state = 0;
                        num = "";
                        break;
                    }
                       
                    if (datapresentformat == 'DataForm')
                    {
                        v = holdvalues[K + '_' + j];
                        if ( ctype[j] == 'a' )
                        {
                            v = retrv(K,j);
                            if (v==null) v = mat[K][j];
                        }
                        else if (v == null  ) 
                        {
                            v = mat[K][j];
                            
                        }
                        else if ( ctype[j] == 'b') 
                        {
                            v = readb(K,j);
                            
                        }
                        if (v == null || v=='')
                        {
                            v = retrv(K,j);
                        }
                    }
                    else
                       v = retrv(K, j);
                     

                    if (ctype[j] == 'h' && v != null && maxsize[j] > 0 && v.length > maxsize[j])
                    {
                        myprompt('The value (' + v + ') in the hidden field ' + fields[j] +
                                ' is too long to be saved in the database');
                    }
                    else if ( ctype[j] == 'p' && fields[j].toLowerCase() != 'stmppassword' || fields[j] == 'Password')
                    {
                       // passwordpolicy(v);
                        v = sha1pass(v);
                        
                    }
                    /* else if ( (ctype[j]=='a'||ctype[j]=='b') && datapresentformat=='DataForm')
                     {
                     v = mat[K][j];
                     }*/
                    if (ctype[j]=='a') 
                        dtype[j] = false;
                    if (dtype[j])
                    {
                        if (v != null)
                            ans += v;
                    }
                    else
                    {
                        if (v != null)
                            ans += "'" + v.replace(/'/g, "''") + "'";
                    }
                    num = "";
                    numitems++;
                    state = 0;
                    break;
                 case 0:
                    state = 11;
                    num = "";
                    break;
                case 1:
                case 31:
                    state = 11;
                    num = "";
                    break;

                case 21:
                    ans += "@";
                    break;
                case 22:
                    ans += "@";
                    state = 11;
                    break;
            }
        }
        else if (s.charAt(i) == '$')
        {
            switch (state)
            {

                case 31:
                    j = parseInt(num);
                    if ('' + j == 'NaN' || j >= numCols)
                    {
                        ans += '$' + num + '$';
                        state = 0;
                        num = "";
                        break;
                    }
                    
                    
                    if (datapresentformat == 'DataForm' )
                       v = holdvalues[K + '_' + j];
                    else
                       v = retrv(K, j);
                   
                     
                    numitems++;
                   
                    if (dtype[j])
                    {
                        if (v != null && v != mat[K][j])
                            ans += v;
                        else
                            numitems--;
                    }
                    else
                    {
                        if ((ctype[j] == 'a' ) && datapresentformat == 'DataForm')
                        {
                             
                            if (holdvalues[K + "_" + j] != null)
                                ans += "'" + mat[K][j].replace(/'/g, "''") + "'";
                            else
                                numitems--;
                            
                        }
                        else if (( ctype[j] == 'b') && datapresentformat == 'DataForm')
                        {
                             
                            if (holdvalues[K + "_" + j] != null)
                                ans += "'" + readb(K,j) + "'";
                            else
                                numitems--;
                            
                        }
                        else
                        {
                            if (v != null && v != '' && v != mat[K][j])
                            {
                                if (ctype[j] == 'p' && fields[j].toLowerCase() != 'stmppassword' || fields[j] == 'Password')
                                {
                                    v = sha1pass(v);
                                    
                                }
                                
                                ans += "'" + v.replace(/'/g, "''") + "'";
                                
                            }
                            else if (v != null && v == '' && v != mat[K][j])
                                ans += "''";
                            else
                                numitems--;
                            
                        }

                    }
                    num = "";
                    state = 0;
                    
                    break;


                case 0:
                    state = 31;
                    num = "";
                    break;
                case 1:
                case 11:
                    state = 31;
                    num = "";
                    break;

                case 21:
                    ans += "$";
                    break;
                case 22:
                    ans += '$';
                    state = 31;
                    break;
            }
        }
        else
        {
            switch (state)
            {
                case 0:
                case 21:
                    ans += s.charAt(i);
                    break;

                case  1:
                case 11:
                case 31:
                    num += s.charAt(i);
                    break;
                case 22:
                    state = 0;
                    ans += s.charAt(i);
            }
        }

    }
    
    if (ans.match(/^u[,]+$/)) 
    {
        myprompt(textmsg[92]);
        return "";
    }
    //myprompt(ans);
    //alert(ans);
    ans = ans.replace(new RegExp("\\[" + textmsg[1303] + "([0-9]+)","ig"),"[Imagelet$1");
     
    return ans;
}

function domandatory(K)
{
    for (var j = 0; j < numCols; j++)
    {
        if (ctype[j] == 'c' || mandatory[j] == false)
            continue;
        if (ctype[j] == 'm' && (ele(K, j).value == '' || retrv(K, j) == invalidtimevalue))
        {
            myprompt(labels[j] + textmsg[722]);
            ele(K, j).focus();
            return false;
        }
        if (ctype[j] == 'n' && (retrv(K, j) == '' || retrv(K, j) == null))
        {
            myprompt(labels[j] + textmsg[722]);
            ele(K, j).focus();
            return false;
        }
        else  if (retrv(K, j) == nullvalue[j])
        {
            if (ctype[j]!='h' && (defaultValue[j] == null || defaultValue[j] == ''))
            {
                ele(K, j).focus();
                myprompt(labels[j] + textmsg[722]);
                return false;
            }
            setv(K,j, defaultValue(K,j));
        }
    }
    return true;
}


function fillbyDefault()
{
    for (var r = numRows; r < NUMROWS; r++)
        for (var c = 0; c < numCols; c++)
        {
            mat[r][c] = defaultValue(r, c);
        }
}
function fillbyNullvalue()
{
    for (var r = numRows; r < NUMROWS; r++)
        for (var c = 0; c < numCols; c++)
        {
            mat[r][c] = nullvalue[c];
        }
}





function numberstr(num, pl)
{
    if (num == null || num == '')
        return num;
    
    if (pl == null)
        return num;
    if (isNaN(pl))
    {
        if ( isNaN(num))
            return null;
        return num;
    }
    var j = parseInt(pl);
    var k = num.indexOf("e");
    if (k < 0)
        k = num.indexOf('E');
    if (k == 0)
        return num ;
    var tail = "";
    if (k > 0) 
    {
        tail = num.substring(k);
        num = num.substring(0, k);
    }
    var ind = num.indexOf(".");
    if (ind == -1)
    {
        if (j > 0)
            num += ".";
        for (var i = 0; i < j; i++)
            num += '0';
        return (num + tail);
    }
    var l = num.length;
    k = j;

    if (k > l - 1 - ind)
    {
        k = l - 1 - ind;
    }

    var w = 0;
    var q = '';
   
    if (k < j)
    {

        while (k < j)
        {
            num += '0';
            k++;
        }
    }
    else if (k + 1 + ind < l)
    {
        var zz = k + 1 + ind;
        var d = parseInt(num.charAt(zz));
        if ('' + d != 'NaN' && d > 4)
        {
            w = zz - 1;
            while (w >= 0 && (num.charAt(w) == '9' || num.charAt(w) == '.'))
            {
                if (num.charAt(w) == '.')
                    q = '.' + q;
                else
                    q = '0' + q;
                w--;
            }
            if (q == '.')
                q = '';
            
            if (w == -1)
                return ('1' + q + tail).replace(/\.$/, '');

            return (num.substring(0, w) + movenext(num.charAt(w)) + q + tail).replace(/\.$/, '');
        }
        else
            num = num.substring(0, zz);
    }

    //if (j == 0)   num = num.replace(/\.$/, '');
    return (num + tail).replace(/\.$/, '')  ;
}

function movenext(c)
{
    switch (c)
    {
        case '0':
            return '1';
        case '1':
            return '2';
        case '2':
            return '3';
        case '3':
            return '4';
        case '4':
            return '5';
        case '5':
            return '6';
        case '6':
            return '7';
        case '7':
            return '8';
        case '8':
            return '9';
    }
    return ' ';
}

function newitem(Z, j)
{
    var s = ele(Z, j);
    var i = s.selectedIndex;
    if (i == null)
        return;
    var sv = s.options[i].text;
    var pp = sv.indexOf("...");
    if (pp < 0)
        return;
    sv = s.options[i].value;
  
    pp = sv.indexOf("...");
    
    var cate = "";
    
    if (pp >= 0)
        cate = sv.replace(/\.\.\./,'');
    
    var num = "";
    if (pp + 3 < sv.length)
        num = sv.substring(pp + 3).replace(/\.\.\..*/, '');
 
    if (cate == '' && num == '' || cate.charAt(0).toLowerCase() != cate.charAt(0))
    {
        myprompt(textmsg[925], "", "addAnItem(v," + i + "," + Z + "," + j + ",'" + cate + "','" + num + "')", labels[j]);
        if (typeof (findPositionnoScrolling) != 'undefined')
        {
            var xy = findPositionnoScrolling(s);
            promptwin.style.top = xy[1] + "px";
            promptwin.style.left = xy[0] + "px";
        }
        ele(Z, j).options.selectedIndex = 0;
    }
    else
    {
        addAnItem1i = i;
        addAnItem1Z = Z;
        addAnItem1j = j;
        var z = (new Date()).getTime()%10000000;
        myprompt("<iframe name=s" + z + " width=500  height=500 />",null,null,"DataForm?rdap=" + cate + "&onsaved=92",null,null,textmsg[114]);
        fillhand = open("DataForm?rdap=" + cate + "&onsaved=92", "s" + z );
        ele(Z, j).options.selectedIndex = 0;
    }

}


var fillhand = null;
function closefillhand() {
    fillhand.close();
}

var addAnItem1i,addAnItem1Z,addAnItem1j;
function addAnItem1(i, Z, j)
{
    if (i==null)
    {i = addAnItem1i;
    Z = addAnItem1Z;
    j = addAnItem1j;
    }
    var newvalue = fillhand.retrv(0, 0);
    var face = fillhand.retrv(0, 1);
    var s = ele(Z, j);
    var zz = s.options[i].value;
    s.options[i] = new Option(face, newvalue);
    
    s.selectedIndex = i;
    s.options[i + 1] = new Option(textmsg[925] + "...", zz);
     
    setTimeout(closefillhand , 1500);
}
function addAnItem(newvalue, i, Z, j, cate, num, face)
{

    if (newvalue == '')
        return;
    newvalue = newvalue.replace(/^[ ]+/, '').replace(/[ ]+$/, '');
    var s = ele(Z, j);
    if (face == null)
        face = newvalue;
    s.options[i] = new Option(face, newvalue);
    s.options[i].className = 'selectoption';
    s.selectedIndex = i;
    s.options[i + 1] = new Option(textmsg[925] + "...", cate + "..." + num);
    
    //var url = "DataUpdate?rdap=newdomainvalue&category&Category="+cate+'&value=' + newvalue;

    if (cate.charAt(0).toLowerCase() != cate.charAt(0))
    {
        if (isNaN(num))
            num = "";
        var extraf = ["domain", "domainvalue", "valuecode", "rdap"];
        if (typeof (fsnd) == 'undefined')
            var fsnd = null;
        if (fsnd == null)
        {
            fsnd = document.createElement("form");
            fsnd.setAttribute("name", "formsend");
            fsnd.setAttribute("method", "post");
            document.body.appendChild(fsnd);
        }
        for (i = 0; i < extraf.length; i++)
        {
            var k = 0;
            if (fsnd.elements != null)
                for (; k < fsnd.elements.length && fsnd.elements[k].name != extraf[i]; k++)
                    ;
            if (fsnd.elements == null || k == fsnd.elements.length)
            {
                var pt = document.createElement("input");
                pt.setAttribute("name", extraf[i]);
                pt.setAttribute("type", "hidden");
                fsnd.appendChild(pt);
            }

        }
        fsnd.target = "w" + tstmp;
        fsnd.rdap.value = "domainvbyuser";
        fsnd.domain.value = cate;
        fsnd.domainvalue.value = newvalue;
        fsnd.valuecode.value = num;
        formnewaction(fsnd, "DataUpdate");
       visual(fsnd);
 fsnd.submit();
        setTimeout( closeprompt, 1000); 
    }

}


function setcustom(val, c)
{
   // alert(localStorage["custom" + rdapname]);
    if (c == -4)
    {
        hasroworder = (val == 't');
    }
    else if (c == -3)
    {
        var expdate = new Date();
        expdate.setTime(expdate.getTime() + 604800000);
        localStorage.removeItem("custom"+rdapname);
        localStorage.removeItem("fontsize");
        font_size = '';
        font_size1 = '';
    }
    else if (c == -2)
    {
        var str = "" + (hasroworder ? '1' : '0') + ";" + extra + ";";
        for (var i = 0; i < numCols; i++)
        {
            str += ((ctype[i] == 'h') ? '1' : '0');
            if (ctype[i] == 't' || ctype[i] == 'a' || ctype[i] == 'T' || ctype[i] == 'A' || ctype[i] == 'i' || ctype[i] == 'u' || ctype[i] == 'U')
                str += fsize[i];
            if (i < numCols - 1)
                str += ";";
        }
        
        var expdate = new Date();
        expdate.setTime(expdate.getTime() + 604800000);
        localStorage["custom"+rdapname] = str;
    }
    else if (c == -1)
    {
        var tmpnum = parseInt(val);
        if ('' + tmpnum != 'NaN' )
        {
            NUMROWS = numRows + tmpnum;
            extra = tmpnum; 
        }
    }
    else if (val == 'f')
    {
        if (ctype[c] == 'h')
            ctype[c] = 't';
    }
    else if (val == 't')
    {
        ctype[c] = 'h';
    }
    else if ('' + parseInt(val) != 'NaN')
    {
        if (c >= 0)
            fsize[c] = val;
    }

}

function ele(r, c)
{
    if (f1 == null)
        return null;
    var ll = lookup[c];
    if (datapresentformat == 'DataTable' && r == NUMROWS)
    {
        ll = positions[c];

    }
    if (datapresentformat != 'DataSearch' && datapresentformat != 'DataForm')
    {
        if (!viewonly)
            ll += 2 + r * (running + 1);
        else
            ll += r * (running);
    }

    if (ctype[c] != 'r' && ctype[c] != 'R' || r == NUMROWS)
    {
        if (ll < f1.elements.length)
           return f1.elements[ll];
        return null;
    }
    var y = 0;
    while (y < options[c].length && f1.elements[ll + y].checked == false)
        y++;
    if (y == options[c].length)
        y = 0;
    return f1.elements[ll + y];
}

function nextelement(r, c, q)
{
    var ll = lookup[c];
    if (datapresentformat != 'DataSearch' && datapresentformat != 'DataForm')
    {
        if (!viewonly)
            ll += 2 + r * (running + 1);
        else
            ll += r * (running);

    }
    if (q >= options[c].length)
        return null;

    return f1.elements[ll + q];
}

function fillopts(sel, r, j, setvl)
{
    var k = 0;
    if (j < 0 || options == null || j >= options.length || options[j] == null)
        return;
    if (sel.options != null && sel.options.length > options[j].length)
        return;

    var kk = 0;
    for (; kk < options[j].length && options[j][kk] != nullvalue[j]; kk++)
        ;

    if (kk < options[j].length && kk > 0)
    {
        var tmp = options[j][kk];
        options[j][kk] = options[j][0];
        options[j][0] = tmp;
        tmp = captions[j][kk];
        captions[j][kk] = captions[j][0];
        captions[j][0] = tmp;
    }
    var nj = 0;
    if (sel.options != null) {
        sel.options[0] = null;
        if (kk == options[j].length)
        {
            sel.options[0] = new Option('', nullvalue[j]);
           
            nj = 1;
        }

        var i = 0;
        for (; i < captions[j].length; i++)
        {
            sel.options[nj] = new Option(captions[j][i], options[j][i]);
           
            nj++;
        }
    }
    if (ctype[j] == 's' && (datapresentformat == 'DataForm' || datapresentformat == 'DataTable' || datapresentformat == 'DataLongForm'))
    {
        // sel.options[sel.options.length] =  new Option(textmsg[925]+"...",textmsg[925]+"...");
    }
    sel.focus();

    if (setvl)
    {
        var u = x;
        if (x == null || x == '')
            u = defaultValue(r, j);
        fillChoose(sel, u);
    }
}
function showxxx() {
    var xxx = "<table><tr><td>lookup</td>";
    for (var w = 0; w < numCols; w++)
        xxx += "<td>" + lookup[w] + "</td>";
    xxx += "</tr><tr><td>positions</td>";
    for (w = 0; w < numCols; w++)
        xxx += "<td>" + positions[w] + "</td>";
    xxx += "</tr><tr><td>positionr</td>";
    for (w = 0; w < numCols; w++)
        xxx += "<td>" + positionr[w] + "</td>";
    xxx += "</tr><tr><td>fields</td>";
    for (w = 0; w < numCols; w++)
        xxx += "<td>" + fields[w] + "</td>";
    xxx += "</tr><tr><td>labels</td>";
    for (w = 0; w < numCols; w++)
        xxx += "<td>" + labels[w] + "</td>";
    xxx += "</tr><tr><td>ele.name</td>";/*
     for (  w=0; w < numCols; w++)
     xxx += "<td>" + ele(0,w).name + "</td>";
     xxx+="</tr><tr><td>f1.elements.name</td>";
     for (  w=0; w < numCols; w++)
     xxx += "<td>" + f1.elements[w].name + "</td>";
     xxx+="</tr><tr><td>f1.elements.tag</td>";
     for (  w=0; w < numCols; w++)
     xxx += "<td>" + f1.elements[w].tagName + "</td>";
     xxx+="</tr><tr><td>f1.elements.type</td>";
     for (  w=0; w < numCols; w++)
     xxx += "<td>"
     +(  (typeof(f1.elements[w].type)!='undefined')?f1.elements[w].type:'') + "</td>";
     xxx+="</tr><tr><td>ctype</td>";  */
    for (w = 0; w < numCols; w++)
        xxx += "<td>" + ctype[w] + "</td>";
    xxx += "</tr></table>" + numRows;
    myprompt(xxx);
}
var didc = true;
function setv(n, j, tmp)
{
    if (datapresentformat == 'DataForm' && didc == false)
    {
        for (var z = 0; z < numCols; z++)
        {
            var xx = ele(counter, z);
            if (xx.name != fields[z])
            {

                didc = true;
                break;
            }
        }
    }
    else if (datapresentformat == 'DataTable' && didc == false
            || datapresentformat == 'DataLongForm' && didc == false)
    {
        for (z = 0; z < numCols; z++)
        {
            xx = ele(0, z);
            if (xx.name != "0_" + z)
            {

                showxxx();
                didc = true;
                break;
            }
        }
    }
    if (valuechanged[n] == false && mat[n][j] != tmp)
        valuechanged[n] = true;

    if (datapresentformat == 'DataForm' && n != counter)
    {

        if (ctype[j] != 'a' && ctype[j] != 'b')
            holdvalues[n + "_" + j] = tmp;
        else
        {
            mat[n][j] = tmp;
            holdvalues[n + "_" + j] = '1';
        }

        return;
    }

    var xstr = null, wstr = null;
    var xtbl = null;
    var ytbls = null;
    var i1, i2 = 0;
    var e = ele(n, j);
    if (e == null)
        return;
    var nexte;
    var q;
    switch (ctype[j])
    {
        case 'm':
        case 'M':
            if (tmp != null)
            {
                if (n < numRows || foot[j]!='count' && foot[j]!='dcunt')
                    e.value = timestr2(tmp);
                else
                    e.value =  (tmp);
            }
            else
            {
                e.value = '';
            }
            break;

        case 'n':
        case 'N':
            if (tmp != null)
                tmp = numberstr(tmp, ffsize[j]);
            if (tmp == null)
            {
                e.value = '';
            }
            else
                e.value = tmp;

            break;

        case 'c':
        case 'C':
            e.checked = (tmp != null && tmp != '0');
            break;

        case 'w':
            if (e.tagName.toLowerCase() != 'select')
                myprompt(e.name);
            fillSelect(e, tmp, dtype[j]);

            break;
        case 'W':
            fillmultivalue(e, tmp, options, captions, j, dtype[j]);
            break;

        case 's':
        case 'S':
            fillopts(e, n, j, false);
            fillChoose(e, tmp);
            break;
        case 'r':
        case 'R':

            for (q = 0; q < options[j].length
                    && options[j][q] != tmp; q++)
            {
                nexte = nextelement(n, j, q);
                nexte.checked = false;
            }
            if (q < options[j].length)
            {
                nexte = nextelement(n, j, q);
                nexte.checked = true;
            }
            break;
        case "f":
            e.value = tmp;
            if ( (datapresentformat == 'DataLongForm' || datapresentformat == 'DataTable' || datapresentformat == 'DataPicker') && n < numRows)
            {
                var area1 = whichcell(n, j);
                tmp =   formatmat(tmp,n,j);
                if (area1!=null)
                { 
                    area1.innerHTML = tmp;
                    area1.style.cssText = 'border-radius:3px;width:100%';
                }
            }
            else if (datapresentformat == 'DataForm' && n < numRows) 
            {    
                var area1 =  whichcell(j, 0);
                tmp =   formatmat(tmp,n,j);
                if (area1!=null)
                { 
                    area1.innerHTML = tmp;
                    area1.style.cssText = 'border-radius:3px;width:100%';
                }
            }
            break;
        case 'B': case 'b':
            if ( datapresentformat == 'DataTable' || datapresentformat == 'DataPicker' )
            {
                 e.value = tmp;
            }
            else if (datapresentformat == 'DataForm'  || datapresentformat == 'DataLongForm' )
            {
                e.value = tmp;

                if (tmp == '')
                    tmp = defaultValue(n, j);
                 
                xstr = Innergrid.makeinnertable(tmp,n, j,ctype[j] == 'b');
                y = Innergrid.makeinnertable(defaultRecord[j], 0, j, ctype[j] == 'b');
                if (xstr.length < y.length)
                {
                      var tmps = tmp.split(/\n/);
                      xstr = defaultRecord[j];
                      for (var k1=0; k1 < tmps.length; k1++)
                      xstr = xstr.replace(/(;\|\|[^;]*)$/,'$1$1').replace(/;\|\|/,';|' + tmps[k1] + '|');
                      xstr = Innergrid.makeinnertable(xstr, 0, j, ctype[j] == 'b');
                }
                
                if (datapresentformat == 'DataForm')
                {
                    var whj = whichcell(j, 0);
                    if (whj!=null){
                    if (typeof(needtranslator)!='undefined' && needtranslator && typeof(LaTexHTML) != 'undefined')
                    {
                        LaTexHTML.deformat(whj);
                    }
                    whj.innerHTML = xstr;
                    if (typeof(needtranslator)!='undefined' && needtranslator && typeof(LaTexHTML) != 'undefined')
                    {
                        LaTexHTML.formatele(whj);
                    } }
                }
                else
                {
                   if (typeof(needtranslator)!='undefined' && needtranslator && typeof(LaTexHTML) != 'undefined')
                    {
                        LaTexHTML.deformat(whichcell(n,j ));
                    } 
                    whichcell(n, j).innerHTML = xstr;
                    if (typeof(needtranslator)!='undefined' && needtranslator && typeof(LaTexHTML) != 'undefined')
                    {
                        LaTexHTML.formatele(whichcell(n,j));
                    } 
                }
                
            }
            break;
        case 'K':
        case 'k':
            break;
        case 'L':
            e.value = extractfromm(tmp, true);
            break;
        case 'U':
        case 'u':
            if (tmp == '')
                break;
            if (datapresentformat == 'DataForm' || datapresentformat == 'DataSearch')
            {
                document.images['image' + j].src = tmp;
            }
            else if (datapresentformat == 'DataTable')
            {
                //document.images['image'+n+'_'+j].src = tmp;
                if (typeof updatepic == 'function')
                    updatepic(tmp, n, j);

            }
            if (ctype[j] == 'U')
                break;

        default:
            if (typeof(e.type)!='undefined' && e.type.toLowerCase() =='file')
            {
                e.value = '';
                
            }
            else if (e.tagName.toLowerCase() =='textarea')
            {
                e.value =  tmp;
            }
            else if (tmp != null && tmp != 'null')
            {
                if (typeof(e.value) != 'undefined')
                {
                    e.value = tmp;
                }
            }
            else
            {
                if (typeof(e.value) != 'undefined')
                {
                    e.value = '';
                }
            }
            if (fields[j].toLowerCase().indexOf('attach') == 0 )
            {
                rr = n; cc = j;
                showattachment(tmp,n);
            }
            break;
    }
    if (datapresentformat == 'DataForm' && n < numRows)
    {
        var thiscell0 = whichcell(j, 0);
        if (thiscell0 != null) {
            if (ctype[j] == 'T' && fields[j].toLowerCase().indexOf('attach')!=0)
            {
                thiscell0.innerHTML = tmp;
                
            }
            else if (ctype[j] == 'N')
            {
                thiscell0.innerHTML = numberstr(tmp, ffsize[j]);
            }
            else if (ctype[j] == 'M')
            {
                thiscell0.innerHTML = timestr2(tmp);
            }
        }
    }
    if (datapresentformat == 'DataForm' && n == counter)
    {

        if (ctype[j] != 'a' && ctype[j] != 'b')
            holdvalues[n + "_" + j] = tmp;
        else
        {
            if (mat[n] == null) mat[n] = new Array();
            mat[n][j] = tmp;
            holdvalues[n + "_" + j] = '1';
        }
    }
    if (ctype[j] == 'i' || ctype[j] == 'I')
    {
        
        if (datapresentformat == 'DataForm' || datapresentformat == 'DataSearch')
        { 
            
            var fr = framebyname( 'iframe' + j); if (fr!=null) fr.width = '200px';
            openit(tmp, n, 'iframe' + j);
            fr = framebyname( 'iframe' + j);
            fr.width = samewidthasa() + 'px';
          
        }
        else
        {   var fr = framebyname( 'iframe' + n + '_' +j);  if (fr!=null) fr.width = '200px';
            openit(tmp, n, 'iframe' + n + '_' + j);
            fr = framebyname( 'iframe' + n + '_' +j);
            fr.width = samewidthasa() + 'px';  
        }
    }
     
}
function samewidthasa()
{
    var j = 0; while (j <numCols && (ctype[j].toLowerCase()!='a' || ele(0,j).style.visibility =='hidden')) j++;
    if (j == numCols) return thispagewidth() - 120;
    return ele(0,j).offsetWidth;
}
function framebyname(nm)
{
    var j=0; while (j < window.frames.length && window.frames[j].name != nm) j++;
    if (j == window.frames.length) return null;
    return window.frames[j];
}
function retrv(n, j)
{
    if (datapresentformat == 'DataHTML')
        return mat[n][j];
     
    if (datapresentformat == 'DataForm')
    {
        if (j >=numCols) 
        {
            return null;
        }
        if (  counter != n)
        {
            if (holdvalues!=null && holdvalues[n + "_" + j] != null  && ctype[j]!='a')
            { 
                 return holdvalues[n + "_" + j];
            }

            if (n >= numRows || numRows==0 || mat.length == 0)
            {
                return nullvalue[j];
            }
            if (mat!=null && mat.length>n && j < mat[n].length)
            {     
                return mat[n][j];
            }
            return nullvalue[j];
        }
        else
        {
           /* 
            if (holdvalues!=null && holdvalues[n + "_" + j] != null)
            {
             
                 if (ctype[j] != 'a')
                {
                    return holdvalues[n + "_" + j];
                }
                else
                {
                    return mat[n][j];
                }
            }
           */ 
        } 
    }
    var e = ele(n, j);

    if (e == null)
        return nullvalue[j];
 
    switch (ctype[j])
    {
        case 'm':
        case 'M':

            if (timechanged.indexOf(";" + n + "," + j + ";") < 0)
                v = mat[n][j];
            else
                v = parseTime(e.value);

            if (v == invalidtimevalue)
                return null;
            return v;
        case 'c':
        case 'C':
            return (e.checked) ? '1' : '0';
        case 'w':
        case 'W':
            return fromSelect(e, dtype[j]);
        case 's':
        case 'S':
            return fromChoose(e, dtype[j]);
        case 'n':
        case 'N':
            return numberstr(e.value, ffsize[j]);
        case 'L':

            return mat[n][j];
        case 'r':
        case 'R':
            if (e.checked == false)
                return nullvalue[j];
            return e.value;
        case 'a':
        case 'A':
            return e.value.replace(/\r\n/g, '\n');
        case 'b':
        case 'B':
           /* if (datapresentformat == 'DataTable' || datapresentformat == 'DataLongForm'
                    || datapresentformat == 'DataPicker')
               return retrvtablevalue(whichcell(n, j).getElementsByTagName('table')[0]);

            return retrvtablevalue(whichcell(j, 0).getElementsByTagName('table')[0]);//.rows[0].cells[0].getElementsByTagName('table')[0]);
           */
           Innergrid.leavebox();
           return e.value;
        default:

            return e.value;
    }
}
function beforeclose()
{
    return title + ": " + textmsg[791];
}
var v = null;
var x = null;
function U(r, c)
{
   // cc = c;
   // rr = r;
    periodvalue = 0;
    var el = ele(r, c);
    if (fields[c] == 'Password') 
    {
        if (passwordpolicy(el, c) == false && el.value!='') 
        {
            var xy = findPositionnoScrolling(el);
            if(promptwin!=null)
            {
            promptwin.style.top = (xy[1]+40) + 'px';
            promptwin.style.left = (xy[0] ) + 'px';
            promptwin.style.width = '250px';
            }
            return false;
        }
        return true;
    }
    var isvalid = true;
    v = null;
    if (ctype[c] == 'm' || ctype[c] == 'M')
    {
        v = parseTime(el.value);
        if (v == invalidtimevalue)
        {
            if (el.value != '')
            {
                el.value = timestr(x);
                v = x;
                timestrpop(x);
                var xy = findPositionnoScrolling(el);
                if(promptwin!=null){
                promptwin.style.left = xy[0] + 'px';
                promptwin.style.top = (xy[1] + 40) + 'px';
                }
                myprompt(textmsg[246] + "<br><nobr>" + timeformat + "</nobr><br><nobr>" + el.value + "</nobr>");
                el.focus();
                isvalid = false;
            }
            else
            {
                v = null;
                isvalid = false;
            }
        }
        else
        {
            if (v != x && timestr(v)!= timestr(x))
            {
                el.value = timestr(v);
                if (timechanged.indexOf(";" + r + "," + c + ";") < 0)
                {
                    timechanged += r + "," + c + ";";
                }
                valuechanged[rr] = true;
                if (datapresentformat == 'DataForm')
                {    
                    holdvalues[r + "_" + c] = v;
                }
            }
            else
            {
                el.value = timestr(x);
               
            }
        }
    }
    else if (ctype[c] == 'n' || ctype[c] == 'N')
    {
        v = numberstr(el.value, ffsize[c]);
 
        if (v == null)
        {
            myprompt(textmsg[818]);
            el.focus();
            v = x;
            isvalid = false;
        }
        if (v != x)
        {
            valuechanged[r] = true;
            if (datapresentformat == 'DataForm')
            {
                holdvalues[r + "_" + c] = v;
            }
        }
        setv(r, c, v);
    }
    else if (ctype[c] == 't' || ctype[c] == 'u' || ctype[c] == 'p' || ctype[c] == 'a' || ctype[c] == 'b')
    {
        v = retrv(r, c);
        
        var v1 = v;
         if (ctype[c] != 'a' )  
             v1 = removejs(v);  
         else 
         {
             if ( ''+guessFormat(v) != '0')
                v1 = checkh(v, true);
             if (textmsg[1332].charAt(5) != ']' && textmsg[1332].charAt(7) != '[')  
             {
                 v1 = v1.replace(new RegExp(textmsg[1332].charAt(7) + '[ |\n|\r|\t]*' + textmsg[1303] + '[ |\n|\r|\t]*([0-9]+)[ |\n|\r|\t]*' +  textmsg[1332].charAt(5),"g"), '[Imagelet$1]');
                 v1 = v1.replace(new RegExp(textmsg[1332].charAt(7) + '[ |\n|\r|\t]*' + textmsg[1303] + '[ |\n|\r|\t]*([0-9]+)[ |\n|\r|\t]*' +   textmsg[1332].charAt(3) + "[ |\n|\r|\t]*([0-9])[ |\n|\r|\t]*" +   textmsg[1332].charAt(5),"g"), '[Imagelet$1:$2]');
                 v1 = v1.replace(new RegExp(textmsg[1332].charAt(7) + '[ |\n|\r|\t]*' + textmsg[1303] + '[ |\n|\r|\t]*([0-9]+)[ |\n|\r|\t]*:[ |\n|\r|\t]*([0-9])[ |\n|\r|\t]*' +   textmsg[1332].charAt(5),"g"), '[Imagelet$1:$2]');
             }
         }
        if (typeof(regexs)!='undefined' && regexs[c]!='')
        {
            var reg = new RegExp(regexs[c], "i");
            var mt = reg.exec(v);
            if (v!='' && (mt == null || mt.index!=0 || mt.toString()!=v))
            {
                 myprompt(textmsg[245]+ "<br>" + hints[c]);
                 el.focus();
                 v = x;
                 isvalid = false;
            }
        }
         
        if (v != v1) 
        {
            setv(r, c, v1);
            v = v1;
            myprompt(textmsg[1627]);
        }
        if (maxsize[c] > 0 && v.length > maxsize[c])
        {
            myprompt(textmsg[784] + fields[c] + maxsize[c]);
            v = v.substring(0, maxsize[c]);
            setv(r, c, v);
        }
         
        if (v != x)
        {
            valuechanged[r] = true;
            if (datapresentformat == 'DataForm')
            {
                if (ctype[c] == 'a' || ctype[c] == 'b')
                {
                    holdvalues[r + "_" + c] = "1";
                    if (r < NUMROWS)
                        mat[r][c] = v;
                }
                else
                    holdvalues[r + "_" + c] = v;
            }
        }
    }
    else if (ctype[c] == 'p')
    {
        if (v.length < 8)
        {
            myprompt(textmsg[881]);
            v = x;
            el.focus();
            isvalid = false;
        }
        if (v != x)
        {
            valuechanged[r] = true;
            if (datapresentformat == 'DataForm')
            {
                holdvalues[r + "_" + c] = v;
            }
        }
    }
    else
    {
        v = retrv(r, c);
        if (v != x)
        {
            valuechanged[r] = true;
            if (datapresentformat == 'DataForm')
                holdvalues[r + "_" + c] = v;
        }
    }
    if (cellonblur != '' && isvalid)
    {
        eval(cellonblur);
    }

    if (x != v && (datapresentformat == 'DataForm'
            || datapresentformat == 'DataTable'
            || datapresentformat == 'DataLongForm'))
    {
        window.onbeforeunload = beforeclose;
    }
    if (ctype[c] == 's')
    {
        if (v != x)
            valuechanged[r] = true;
        var sel = ele(r,c);
        if (sel!=null && sel.options!=null && sel.options[sel.selectedIndex].text.indexOf('...')>=0)
        {
            newitem(r,c);
        }
    }
    return isvalid;
}

function hasVerticalScroll(node)
{
    if (node == undefined)
    {
        if (window.innerHeight) {
            return document.body.offsetHeight > innerHeight;
        }
        else
            return  document.documentElement.scrollHeight >
                    document.documentElement.offsetHeight ||
                    document.body.scrollHeight > document.body.offsetHeight;
    }
    else
        return node.scrollHeight > node.offsetHeight;
}
function defaultValue(r, c)
{
    var s = defaultRecord[c];
    if (s != null && s.length > 1 &&
            s.charAt(0) == '#' &&
            s.charAt(s.length - 1) == '#'
            )
    {
       
        return "" + eval(s.substring(1, s.length - 1).replace(/rowNumber/g, '' + r));
    }
    return defaultRecord[c];
}

function cellexit()
{
    if (periodvalue == 1)
    {
        if (rr>=0 && cc>=0)
        U(rr,cc);
    }
}

function S(r, c)
{
    if (periodvalue == 1)
    {
        if (rr>=0 && cc>=0 && U(rr,cc) == false)
            return;
    }
    periodvalue = 1;
    if (typeof(needtodoresizecont)!='undefined'  && needtodoresizecont==true && typeof(resizeCont) == 'function')
    {
        resizeCont();
        needtodoresizecont = false;
    }
    if (ctype[c].toLowerCase()!='b')
    {
        var mmenu = document.getElementById("Igdmenu");
        if (mmenu!=null) document.body.removeChild(mmenu);
        Innergrid.nextcell = null;
    }
    x = retrv(r, c);
    if (r >= numRows && (x == nullvalue[c] || x == '' && dtype[c]))
    {
        if (ctype[c] != 's' && ctype[c] != 'S')
        {
            setv(r, c, defaultValue(r, c));
        }
    }
    rr = r;
    cc = c;
     
    if (cellonfocus != '')
    {
        eval(cellonfocus);
    }
    
}
function dcunt1(el, r, c)
{
    rr = r;
    cc = c;
    v = retrv(rr, cc);
    var dis0 = true;
    for (var i = 0; i < numRows; i++)
        if (i != rr && x == retrv(i, cc))
        {
            dis0 = false;
            break;
        }
    var dis1 = true;
    for (var i = 0; i < numRows; i++)
        if (i != rr && v == retrv(i, cc))
        {
            dis1 = false;
            break;
        }

    if (dis0 && !dis1)
        el.value = parseInt(el.value) - 1;
    else if (!dis0 && dis1)
        el.value = parseInt(el.value) + 1;
}
 
function UT(r, c)
{
    cc = c;
    rr = r;
    
    if (ctype[cc] == ctype[cc].toUpperCase() && rr < numRows && mat[rr][cc]!=nullvalue[cc])
    {
        
         setv(rr, cc, mat[rr][cc]);
    }
    else
    {
        if (ctype[cc] == 's' || ctype[cc] == 'S')
        {
            newitem(r, c);
            ctype[cc] = 's';
        }
        if (hasfoot)
        {
            el = ele(NUMROWS, cc);
            if (el != null)
            {
                if (foot[cc] != 'dcunt')
                    el.value = calfoot(cc, 1);
                else
                    dcunt1(el, rr, cc);
            }
        }
    }
    if ( ("," + allkeyfields + ",").indexOf(',' + cc + ',') >= 0)
    {
        for (var j=0; j < numCols;j++)
            if (ctype[j] == 'i')
        {
                var zz = mat[rr][j];
                if (zz == null || zz =='') zz = defaultValue(rr,j);
                setv(rr, j, zz);
        }
    }
    if (fields[cc].toLowerCase().indexOf('attach') == 0)
    {
        hw = hws[rr];
        hw.parseAttach(holdvalues[rr+'_'+cc]);
        var q  =document.getElementById('style_' +   rr);
        addcss2head(rr, hw.divs);
         
     
    }
}

function swaprow(i, j)
{
    var tmp = null;

    for (var k = 0; k < numCols; k++)
    {
        tmp = retrv(i, k);
        setv(i, k, retrv(j, k));
        setv(j, k, tmp);
    }

    for (k = 0; k < numCols; k++)
    {
        tmp = mat[i][k];
        mat[i][k] = mat[j][k];
        mat[j][k] = tmp;
    }
    tmp = valuechanged[j];
    valuechanged[j] = valuechanged[i];
    valuechanged[i] = tmp;
    tmp = deleted[j];
    deleted[j] = deleted[i];
    deleted[i] = tmp;
}


function setaction(t) {
}
function getvaluechanged(r) {
    return valuechanged[r];
}
function setvaluechanged(r, v) {
    valuechanged[r] = v;
}
function getOptions(j) {
    return options[j];
}
function setOptions(j, v) {
    options[j] = v;
}
function setCaptions(j, v) {
    captions[j] = v;
}
var alluploadedfiles = '';
function doleaving()
{
    if (datapresentformat == 'DataPicker' || datapresentformat == 'DataSearch' || title == '')
        return;
    if (onclose!='')
        eval(onclose);
    if (alluploadedfiles == '')
        return;
    
    if (typeof(parent.opener)!='undefined'&& onmydomain(parent.opener) && typeof(parent.opener.delnotusedattach)!='undefined')
    {  
        parent.opener.delnotusedattach(alluploadedfiles);
    }
    else if (opener != null && typeof(opener.delnotusedattach)!='undefined')
    {   
        opener.delnotusedattach(alluploadedfiles);
    }
    else if (typeof(parent.parent.frames[0].delnotusedattach)!='undefined')
    {   
        parent.parent.frames[0].delnotusedattach(alluploadedfiles);
    }
}

function stopwin(win)
{
    if (navigator.appName == 'Microsoft Internet Explorer')
        win.document.execCommand('Stop');
    else
        win.stop();
}

var hw = null;
var hws = new Array();
 
function makehw(r)
{
    if (hws[r]!=null) 
    {
        hw = hws[r];
        return hw.attachheader;
    }
    for (var j=0; j < numCols; j++)
       if (fields[j].toLowerCase().indexOf('attach') == 0)
        {   
            
            var attstr = ResizeUploaded.unzip(mat[r][j]);
            hw = new Hwtake('rev', '', '', attstr, '', '', r);
            addcss2head(r, hw.divs);
             
            return hw.attachheader;
        }
    hw = null;
    return '';
    
}
function formatmat(x, r,c)
{
    actualformat = '0';
    if (fmtcol < numCols)
    {
        if (holdvalues[r + '_' + fmtcol] != null)
        actualformat = holdvalues[r + '_' + fmtcol]; 
        else 
            actualformat = mat[r][fmtcol];
    }
    else
    {
        actualformat = guessFormat(x);
    }
    var s = addbreak1(formatstr(addbreak(x,1),actualformat));
    if (hw == null) return s;
    return hw.merge(s);
}

function nextpage()
{
    if (nextpageurl != '')
    {
        document.location.href = "NextPage?id=" + encodeURIComponent(nextpageurl);
    }
}
var oldonclose12 = window.onunload;
window.onunload = function(){
    if (oldonclose12 !=null)
        oldonclose12();
    doleaving();
}
 
function butheight()
{
    if (font_size >= 15)
        return  Math.floor(1.5 * font_size);
    else if (font_size >= 12)
        return  22;
    else
        return 20;
}
function butwidth(str)
{
    var leng = 0;
    var upper = 65;
    if (typeof (font_size) == 'undefined')
        leng = str.length * charwidthrate();
    else
    {
        leng = str.length * font_size / 2 + 2;
        upper = charwidthrate() * font_size;
    }

    if (leng < upper)
        leng = upper;
    return Math.floor(leng);
}
var helphints = null;
var piccount = numCols + 8;
if (typeof (helpbuttons) != 'undefined' && helpbuttons != null && helpbuttons != "")
{
    helphints = helpbuttons.split(/<.td><.tr>/);
    piccount += helphints.length;
}
var hints = [];

var hintstr = helpstr.replace(/<tr.*$/, '').split("\n");

var fold = new Array(numCols);
var maxfinr1 = 0, maxfinr = 0;
for (var j = 0; j < numCols; j++)
{
    if (isNaN(labels[j].replace(/_1/,'')) == false && labels[j].charAt(0) == '2')
    {
        var xx = textmsg[parseInt(labels[j].substring(1).replace(/_1/,''))];
        if (xx!=null) labels[j] = xx;
         
    }
    
    var k = 0;
    for (; k < hintstr.length && hintstr[k]!=null
            && hintstr[k].toLowerCase().replace(/ /g, '').indexOf(fields[j].toLowerCase() + ":") != 0
            && hintstr[k].toLowerCase().replace(/ /g, '').indexOf(labels[j].toLowerCase() + ":") != 0;
            k++)
        ;
    fold[j] = true;//(ctype[j] != 'h' && ctype[j] != 'k');
    if (k < hintstr.length)
    {
        hints[j] = hintstr[k].replace(/[^:]+:/, '');
        if (hints[j].length > 0 && hints[j].charAt(hints[j].length - 1) == '_')
        {
            hints[j] = hints[j].substring(0, hints[j].length - 1);
            if (j < numCols) 
            {
                fold[j] = false;
            }
        }
    }
    else  hints[j] = labels[j];

    if (fold[j])
    {
        if (maxfinr1 > maxfinr)
            maxfinr = maxfinr1;
        maxfinr1 = 0;
    }
    else
    {
        if (ctype[j] != 'h' && ctype[j] != 'k')
            maxfinr1++;
    }

}

hints[numCols] = textmsg[11];
hints[numCols + 1] = textmsg[810];
hints[numCols + 2] = textmsg[745];
hints[numCols + 3] = textmsg[735];
hints[numCols + 4] = textmsg[795];

if (helphints != null)
    for (var j = 0; j < helphints.length; j++)
        hints[numCols + 8 + j] = helphints[j].replace(/.*<.td><td>/, "");
for (var j = 0; j < hints.length; j++)
    if (hints[j] == null)
    {
        hints[j] = "";
    }



function showhintcap(but)
{
    var j = 0;
    if (helphints == null)
        return;
    for (; j < helphints.length
            && helphints[j].indexOf('"' + but.value + '"') == - 1; j++)
        ;

    if (typeof (showmyhint) != 'undefined')
    {

        showmyhint(numCols + 8 + j, 1);
    }
}

function getTitle() {
    return title;
}
function readtd(source, pos)
{
    var kk = pos+1;
    while (pos < source.length && source.charAt(pos) != "|")
        pos++;
    if (pos == source.length)
        return null;
    
    var state = -1;
    var r = new Array(4);
    var xx = source.substring(kk,pos).replace(/.*([0-9]+,[0-9]+,).*/,"$1");
    if (xx!='' && xx.replace(/[0-9]+,[0-9],+/,"") == '')
    {
        r[3] = xx;
    }
    else
    {
        r[3] = "";
    }
    r[0] = pos + 1;
    
    while (pos < source.length)
    {
        if (source.charAt(pos) == "|")
        {
            if (state == -1 || state == 0)
                state = 1;
            else
                state = 0;
            r[1] = pos;
        }
        else if (source.charAt(pos) == ",")
        {
            if (state == 0)
            {
                r[2] = 0;
                break;
            }
        }
        else if (source.charAt(pos) == ";")
        {
            if (state == 0)
            {
                r[2] = 1;
                break;
            }
        }
        pos++;
    }
    if (pos == source.length)
    {
        if (source.charAt(pos - 1) != "|")
            r[1] = pos;
        r[2] = 1;
    }

    return r;
}

function modifyinner(v, r1, c, x)
{
    var i = 0, j = -1, cl = 0, rw = 0;
    var y = '';
    while (true)
    {
        var r = readtd(v, j + 1);

        if (r == null || r[0] == null || r[1] == null || r[2] == null)
            break;
        if (cl == 0 && rw > 0)
            y += ";";
        else if (cl > 0)
            y += ",";
        var z = v.substring(r[0], r[1]);
        
        if (cl == c && rw == r1)
            y += r[3] + "|" + x.replace(/\|/g, "||") + "|";
        else
            y += r[3] + "|" + z + "|";
        j = r[1];
        if (r[2] == 1)
        {
            cl = 0;
            rw++;
        }
        else
            cl++;
    }
    return y;
}


var thbeingedited = new Array(2);
var thbeingeditedIndex = 0;
function text2html(str)
{
    if (str == null)
        return "";
   
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;").replace(/\n/g, "<br>");
}
function html2text(str)
{
    if (str == null)
        return "";
    return str.replace(/<nobr>/i,'').replace(/<.nobr>/i,'').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/<br>/g, "\n");
}
var Innergrid = 
{
    myhomeport : null,
    valueparse : null,
    colinfo : "",
    currentrr:-1,
    currentcc:-1,
    currentm:-1,
    currentn:-1,
    currentth:null,
    currentbox:null,
    neednext : false,
    nextcell : null,
    copyx:-1,
    copyy:-1,
    copyed:0,
    clickedtime:0,
    nextelement:function(el) 
    {
       if (el == null) return null;
       var ff = el;
       while (ff.tagName!=null && ff.tagName.toLowerCase() != "form" && ff.parentNode) 
       {
           ff = ff.parentNode;
       }
       
        var k = 0;
        for (k=0; k < ff.elements.length; k++)
            if (ff.elements[k] == el)
                break;

        if ( k+1 < ff.elements.length )
        {
             return ff.elements[k+1]; 
        }

        var fs =document.forms;
        for (var k=0; k < fs.length; k++)
            if ( fs[k] == ff) break;
        if (k < fs.length - 1)
        {
             
            for (var jj=0; jj < fs[k+1].elements.length; jj++)
            {
                var b1 =  typeof(fs[k+1].elements[jj].style) == 'undefined' || fs[k+1].elements[jj].style.visibility!='hidden';
                var b2 =   typeof(fs[k+1].elements[jj].type) == 'undefined' || fs[k+1].elements[jj].type.toLowerCase()!='hidden';
                
                if ( b1  && b2 )
               {
                   return fs[k+1].elements[jj];
               }
            }
        }
        return null;
    },
    prevelement:function(el) 
    {
        var ff = el;
        while (ff.tagName!=null && ff.tagName.toLowerCase() != "form" && ff.parentNode) 
        {
           ff = ff.parentNode;
        }
        
         for (var jj=0; jj < ff.elements.length; jj++)
         {      
             if ( (  typeof(ff.elements[jj].style) == 'undefined' || ff.elements[jj].style.visibility!='hidden')
                 && (  typeof(ff.elements[jj].type) == 'undefined' || ff.elements[jj].type.toLowerCase()!='hidden') )  
              break;
         } 
         
         if (jj < ff.elements.length && ff.elements[jj] == el)
         {
             
             var fs =document.forms;
             for (var k=0; k < fs.length; k++)
             if ( fs[k] == ff) break;
             if (k>0 && k < fs.length)
             {
                var fg = fs[k-1];
                if (Innergrid.currentcc>-1)
                {
                    return ele(Innergrid.currentrr,Innergrid.currentcc);
                }
             }
         }     
        
        
        
        var k = 0;
        for (k=0; k < ff.elements.length; k++)
            if (ff.elements[k] == el)
                break;

        if ( k > 0 )
        {
             return ff.elements[k-1]; 
        }
         
        return null;
    },
    
    goto1st : function(Z,j)
    {
        if (Innergrid.currentrr == -1 || Innergrid.currentm == -1) 
        {
           S(Z,j);
           var tbl = document.getElementById("Igdt" + Z + '_' + j);
           if (tbl == null) return;
           if (tbl.rows.length==1) 
               Innergrid.appendRow();
           Innergrid.editthiscell(tbl.rows[0].cells[0],Z,j); 
        }
        rr = Z;
        cc = j;
        
    },
    active : true,
    editstruct: true,
    hidemenu : function(b)
    {
        Innergrid.active = b;
        var mmenu = document.getElementById("Igdmenu");
        if (mmenu!=null)  mmenu.style.visibility = b?'visible':'hidden';
    },
    moment :[],
    editthiscell : function(th,Z,j)
    {
        if (th == null || th.id == null || th.innerHTML.toLowerCase().indexOf('<input ')>=0 || th.innerHTML.toLowerCase().indexOf('<textarea ')>=0)
        {
             return;
        }
        if (Innergrid.activcellid == th.id) return;
        if (Innergrid.currentm != -1 || Innergrid.currentn != -1)
        {
            if (th.id == 'Innergrid' + Innergrid.currentm + "_" + Innergrid.currentn)
               return;
            Innergrid.leavingbox(false);
        }
        Innergrid.activcellid = th.id;
        var newone = false;
        
        if (Z!=null && j!=null) 
        {
            if (Innergrid.currentrr != Z || Innergrid.currentcc !=j)
            {
               Innergrid.leavingbox(false);
               if (Innergrid.cuurentbox!=null && Innergrid.currentrr>=0 && Innergrid.currentcc >=0)
               {
                   valuechanged[Innergrid.currentcc] = true;
                   
                   if (ctype[Innergrid.currentcc].toLowerCase() == 'b')
                   {
                       Innergrid.cuurentbox.value = mat[Innergrid.currentrr][Innergrid.currentcc];
                   }
                   else
                   {
                       if (holdvalues[Innergrid.currentrr + '_' + Innergrid.currentcc] == null)
                           Innergrid.cuurentbox.value = mat[Innergrid.currentrr][Innergrid.currentcc];
                       else
                           Innergrid.cuurentbox.value = holdvalues[Innergrid.currentrr + '_' + Innergrid.currentcc];
                   }
                }    
                newone = true;
            }
            Innergrid.currentrr=Z;
            Innergrid.currentcc=j;
        }
        
        var mn = th.id.substring(3).split(/_/);
        var m = parseInt(mn[0]);
        var n = parseInt(mn[1]);
        Innergrid.currentm=m;
        Innergrid.currentn=n;
       
        Innergrid.currentth = th;
        var tbl = th.parentNode.parentNode;
        if (tbl.tagName.toLowerCase() != 'table') tbl = tbl.parentNode;
         
        if (n < tbl.rows[m].cells.length-1) 
            Innergrid.nextcell = tbl.rows[m].cells[n+1];
        else
        {
            if (m + 1 == tbl.rows.length) 
                Innergrid.nextcell = null;
            else
                Innergrid.nextcell = tbl.rows[m+1].cells[0];
        }
         
     
        if (Innergrid.valueparse == null || newone )
        {
            Innergrid.currentbox   = ele(Innergrid.currentrr,Innergrid.currentcc);
            if (Innergrid.currentbox == null) { return;}
            var nexte = Innergrid.nextelement(Innergrid.currentbox);
            if (nexte!=null)
            {
                 
                var oldonfocus = nexte.onfocus;
                
                nexte.onfocus = function()
                {
                    var e = Innergrid.prevelement(this);
                    
                    if (Innergrid.active  && e!=null && e == Innergrid.currentbox)
                    {
                        
                        if (Innergrid.currentm > 0)
                        {
                            Innergrid.neednext = true;
                        }
                        else if (Innergrid.nextcell!=null)
                        {
                            Innergrid.editthiscell(Innergrid.nextcell);
                        }
                        else if (oldonfocus!=null)
                        {  
                            var mmenu = document.getElementById("Igdmenu");
                            if (mmenu!=null) document.body.removeChild(mmenu);
                            oldonfocus();
                        }
                    }
                    else if (oldonfocus!=null)
                    {
                        var mmenu = document.getElementById("Igdmenu");
                        if (mmenu!=null) document.body.removeChild(mmenu);
                        oldonfocus();
                    }
                }
            }
             
            var parse =  new CSVParse(Innergrid.currentbox.value,'|', ",", ";") ;
            Innergrid.valueparse = new Array();
            Innergrid.colinfo = ",";
             var vl;
             var m=0, n=0;
            while ((vl = parse.nextElement() )!= null)
            {
                if (n == 0)
                {
                   Innergrid.valueparse[m] = new Array();
                }
                if (parse.ppstate == parse.UNQUOTE && vl.replace(/[0-9]+x[0-9]+/,'') == '')
                {
                    Innergrid.colinfo += m + "x" + n + ",";
                }
                Innergrid.valueparse[m][n] = vl;

                if (parse.state==parse.DIMENSIONEND[1] ) 
                {    
                   m++;
                   n = 0;
                }
                else if (parse.state==parse.DIMENSIONEND[0] ) 
                {
                   n++;
                }
            }
            Innergrid.myhomeport = Innergrid.currentbox.parentNode;
            
            
        }
        var tt = th.offsetWidth ;
        var thv = th.innerHTML.replace(/^<nobr>/,'').replace(/<.nobr>$/,'');
        th.innerHTML = '';
        th.align = 'left';
        th.vAlign = 'top';
        if (Innergrid.currentbox!=null)
        th.style.height = (2+Innergrid.currentbox.offsetHeight) + 'px';
        if (Innergrid.editstruct)
        {
            var mmenu = document.getElementById("Igdmenu");

            var hasone = true;
            if (mmenu == null)
            {
                hasone = false;
                mmenu = document.createElement("div");
                mmenu.id = "Igdmenu";
            }

            var xy = findPositionnoScrolling(th);
            var l = Math.ceil(font_size/2) + 2;
            mmenu.style.cssText = "background-color:transparent;position:absolute;z-index:20;top:"  + xy[1] + "px;left:" + (xy[0] + th.offsetWidth + (Innergrid.currentth.nextSibling == null?0:10)) + "px;padding:0px 0px 0px 0px;text-align:center;vertical-align:middle";
            var ss = "<table cellpadding=3 cellspacing=1><tr><td><div onmouseover=Innergrid.hidemenu(true)  onmouseover=Innergrid.hidemenu(false) style=\""
            + "background-color:" + DBGCOLOR + ";border:1px #b0b0b0 outset;padding:0px 0px 0px 0px;text-align:center;vertical-align:middle;border-radius:" + l + "px;width:" + (2*l) + "px;height:" + (2*l) + "px;color:red;font-family:arial;cursor:pointer\"" 
            + " onclick=\"Innergrid.deletecel(" + Innergrid.currentm + "," + Innergrid.currentn + ")\" >x</div></td>"
            if (Innergrid.currentth.nextSibling == null || (typeof(Innergrid.currentth.colSpan)!='undefined' && Innergrid.currentth.colSpan!='' && Innergrid.currentth.colSpan!='1'))
                ss += "<td><div  onmouseover=Innergrid.hidemenu(true)  onmouseover=Innergrid.hidemenu(false) style=\""
            + "background-color:" + DBGCOLOR + ";border:1px #b0b0b0 outset;padding:0px 0px 0px 0px;text-align:center;vertical-align:middle;border-radius:" + l + "px;width:" + (2*l) + "px;height:" + (2*l) + "px;color:orange;font-family:arial;cursor:pointer\"" 
            + " onclick=\"Innergrid.addcol("  + Innergrid.currentm + "," + Innergrid.currentn + ")\" >+</div></td>";
            mmenu.innerHTML = ss + "</tr></table>";
         
            if (hasone == false) document.body.appendChild(mmenu);
           
        }
        th.appendChild(Innergrid.currentbox);
        Innergrid.currentbox.style.cssText = "margin:0px 0px 0px 0px;border:0px #404040 solid;width:" + tt +"px;visibility:visible;text-align:" + al;
        var vv = '';
        if (Innergrid.currentm < Innergrid.valueparse.length )
        {
            if(Innergrid.currentn < Innergrid.valueparse[Innergrid.currentm].length)
            {    
                vv = Innergrid.valueparse[Innergrid.currentm][Innergrid.currentn];
            }
            else
            {  
                for (var  m =Innergrid.valueparse[Innergrid.currentm].length; m<= Innergrid.currentn; m++)
                {    
                    Innergrid.valueparse[Innergrid.currentm][m] = '';
                }
                vv = '';
            }
        }
        else
        {
            var m = Innergrid.valueparse.length;
            var l = Innergrid.valueparse[m-1].length; 
            if (l <= Innergrid.currentn+1) l = Innergrid.currentn+1;
            for (; m <= Innergrid.currentm; m++)
            {
               Innergrid.valueparse[m] = new Array(l);
               for (var j=0; j < l; j++)
                   Innergrid.valueparse[m][j] = '';
            }
            vv = '';
        }
         
        vv = html2text(thv);
         
        var al = 'left';
        if (vv != null && vv !='' && vv.replace(/[0-9]/g, '').replace(/\./g, '')=='')
              al = 'right';
         Innergrid.currentbox.style.textAlign = al;
        
         if (Innergrid.currentbox.value!=vv)
          Innergrid.currentbox.value = vv;
          Innergrid.currentbox.focus();
        if (typeof(Innergrid.currentbox.type) =='undefined' || Innergrid.currentbox.type.toLowerCase()!='hidden')
        {    
            if (typeof(Innergrid.currentbox.selectionStart) != 'undefined' &&  typeof Innergrid.currentbox.selectionStart == "number") 
            {
              Innergrid.currentbox.selectionStart = Innergrid.currentbox.selectionEnd = Innergrid.currentbox.value.length;
            } 
            else if (typeof Innergrid.currentbox.createTextRange != "undefined") 
            {
                 Innergrid.currentbox.focus();
                var range = Innergrid.currentbox.createTextRange();
                 range.collapse(false);
                 range.select();
            }
        }
        
        th.style.width = (2+Innergrid.currentbox.offsetWidth) + 'px';
        //thenewtextbox.setAttribute("onkeypress", "return dotabenter(this,event)");
        //thenewtextbox.setAttribute("onblur", "leavingbox(this,false)");
         
    },
    deleterow : function(m)
    {
        var arr = new Array();
        for (var j =0; j < m; j++)
            arr[j] = Innergrid.valueparse[j];
        Innergrid.colinfo = Innergrid.colinfo.replace(new RegExp("," + m + "_[0-9]+,", "g"), "," );
        for (var j =m+1; j < Innergrid.valueparse.length; j++)
        {   
            Innergrid.colinfo = Innergrid.colinfo.replace(new RegExp("," + j + "(_[0-9]+,)", "g"), "," + (j-1) + "$1" ); 
            arr[j-1] = Innergrid.valueparse[j];
        }
        if (arr.length == 0)
        {
            Innergrid.valueparse = null;
            var  tbl = Innergrid.mytbl(Innergrid.currentth);
            tbl.parentNode.removeChild(tbl);
            return;
        }
         Innergridb.valueparse = arr;
         Innergrid.redotbl();
         var tbl = document.getElementById("Igdt" + Innergrid.currentrr + "_" + Innergrid.currentcc);
         if (m < Innergrid.valueparse.length)
             Innergrid.editthiscell(tbl.rows[m].cells[0]);
         else 
             Innergrid.editthiscell(tbl.rows[0].cells[0]);
      
    },
    deletecel : function(m,n)
    {
        
        if (Innergrid.currentth.previousSibling == null)
        {
            myprompt("Delete the whole row?", null, "if(v) Innergrid.deleterow(" + m +")","Confirm");
           
            return;
        }
         
        if (n>2 && Innergrid.isspan(m,n-1) && Innergrid.isspan(m,n-3)) 
        {
           var cid =   Innergrid.currentth.id.replace(/[0-9]+$/,'' + (n-2));
          
            var arr = new Array();
            for (var j=0; j < n-3; j++)
                arr[j] = Innergrid.valueparse[m][j];
            
            
            var a = parseInt(Innergrid.valueparse[m][n-3].replace(/^[^x]+x/,''));
            var b = parseInt(Innergrid.valueparse[m][n-1].replace(/^[^x]+x/,''));
           
            arr[n-3] = Innergrid.valueparse[m][n-3].replace(/[0-9]+$/, '' + (a+b));
            arr[n-2]  = Innergrid.valueparse[m][n-2] +  Innergrid.valueparse[m][n];
            for (var j=n+1; j < Innergrid.valueparse[m].length; j++)
                arr[j-2] = Innergrid.valueparse[m][j];
            Innergrid.valueparse[m] = arr;
            Innergrid.colinfo = Innergrid.colinfo.replace("," + m + "_" + (n-1) + ",", "," );
            
        }
        else if ( Innergrid.isspan(m,n-1) &&  (n==2 || !Innergrid.isspan(m,n-3)  )   )
        {
            var cid =   Innergrid.currentth.id.replace(/[0-9]+$/,'' + (n-1)); 
            var arr = new Array();
            for (var j=0; j < n-2; j++)
                arr[j] = Innergrid.valueparse[m][j];
             
            var b = parseInt(Innergrid.valueparse[m][n-1].replace(/[^x]+x/,''));
            arr[n-2] = Innergrid.valueparse[m][n-1].replace(/[0-9]+$/, '' + (b+1));
            arr[n-1] = Innergrid.valueparse[m][n-2] +  Innergrid.valueparse[m][n];
            for (var j=n+1; j < Innergrid.valueparse[m].length; j++)
                arr[j-1] = Innergrid.valueparse[m][j];
            Innergrid.valueparse[m] = arr;
            Innergrid.colinfo = Innergrid.colinfo.replace("," + m + "_" + (n-1) + ",", "," + m + "_" + (n-2) + "," );
            
        }
        else if ( !Innergrid.isspan(m,n-1) &&  n>=2 &&  Innergrid.isspan(m,n-2)     )
        {
            var cid =   Innergrid.currentth.previousSibling.id;   
            var arr = new Array();
            for (var j=0; j < n-2; j++)
                arr[j] = Innergrid.valueparse[m][j];
             
            var b = parseInt(Innergrid.valueparse[m][n-2].replace(/[^x]+x/,''));
            arr[n-2] = Innergrid.valueparse[m][n-2].replace(/[0-9]+$/, '' + (b+1));
            arr[n-1] = Innergrid.valueparse[m][n-1] +  Innergrid.valueparse[m][n];
            for (var j=n+1; j < Innergrid.valueparse[m].length; j++)
                arr[j-1] = Innergrid.valueparse[m][j];
            Innergrid.valueparse[m] = arr;
        }
        else
        {
            var cid =   Innergrid.currentth.id;   
            
            var b =  Innergrid.valueparse[m][n-1] +  Innergrid.valueparse[m][n];
            Innergrid.valueparse[m][n-1] = "1x2" 
            Innergrid.valueparse[m][n] = b;
            Innergrid.colinfo += m + "_" + (n-1) + ",";
        }
        Innergrid.redotbl();
        Innergrid.editthiscell(document.getElementById(cid)); 
    }, 
    isspan : function (m,n)
    {
        return (Innergrid.colinfo.indexOf("," + m + "_" + n + ",") >= 0);
    }, 
    mytbl : function(cell)
    {
        var tbl = cell.parentNode.parentNode;
        if (tbl.tagName.toLowerCase()!='table') tbl = tbl.parentNode;
        return tbl;
    },
    addcol : function(m,n)
    {
        if (Innergrid.valueparse[m].length == n+1)
        {
            var cid = Innergrid.currentth.id;  
            for (var i=0; i < Innergrid.valueparse.length; i++)
            {
               Innergrid.valueparse[i][Innergrid.valueparse[i].length] = ''; 
            }
            Innergrid.redotbl();
            var tbl = document.getElementById("Igdt" + Innergrid.currentrr + "_" + Innergrid.currentcc);
            Innergrid.editthiscell(tbl.rows[0].cells[tbl.rows[0].cells.length-1]);
        } 
        else
        {
            var col = parseInt('' + Innergrid.currentth.colSpan);
            var x1 = Innergrid.valueparse[m][n].replace(/ .*$/,'');
            var x2 = Innergrid.valueparse[m][n].replace(/[^ ]+/,'').replace(/^[ ]+/,'');  
            var cid;
          
            if (col == 2)
            {
                Innergrid.valueparse[m][n-1] = x1;
                Innergrid.valueparse[m][n] = x2;
                cid = "Igd" + m + "_" + (n-1);
                Innergrid.colinfo = Innergrid.colinfo.replace("," + m + "_" + (n-1) + ",", ","  );
            }
            else
            {
                var bb = Innergrid.valueparse[m][n-1];
                var b = parseInt(Innergrid.valueparse[m][n-1].replace(/[0-9]+x/,''));
                bb = bb.replace(/[0-9]+$/, '' + (b-1));
                Innergrid.valueparse[m][n-1] = x1;
                Innergrid.valueparse[m][n] = bb;
                cid = "Igd" + m + "_" + (n-1);
                for (var j=Innergrid.valueparse[m].length;  j >= n+2; j--)
                    Innergrid.valueparse[m][j] =Innergrid.valueparse[m][j-1];
                Innergrid.valueparse[m][n+1] = x2;
                Innergrid.colinfo = Innergrid.colinfo.replace("," + m + "_" + (n-1) + ",", "," + m + "_" + (n) + "," );
            }
            Innergrid.redotbl();
            Innergrid.editthiscell(document.getElementById(cid)); 
        }
    },
    redotbl : function()
    {
            var xx = Innergrid.CSVcompose(Innergrid.valueparse,Innergrid.colinfo);
            var vl = Innergrid.makeinnertable( xx,Innergrid.currentrr, Innergrid.currentcc,true);
            var tbl = Innergrid.mytbl(Innergrid.currentth);
            if (Innergrid.currentbox != null)
            {
            Innergrid.currentbox.style.width = "1px";
            Innergrid.currentbox.style.visibility = "hidden";
            Innergrid.myhomeport.appendChild(Innergrid.currentbox);
            Innergrid.currentbox.value = xx;
            }
            var pp = tbl.parentNode;
            LaTexHTML.deformat(pp);
            pp.removeChild(tbl);
            pp.innerHTML = pp.innerHTML + vl ;
            LaTexHTML.formatele(pp);
            var mmenu = document.getElementById("Igdmenu");
            if (mmenu != null)
             document.body.removeChild(mmenu);
            Innergrid.currentm = Innergrid.currentn = -1;
            Innergrid.nextcell = null;
    },
    dotabenter : function(evt)
    {
        var e = evt ? evt : window.event;
        if (!e)
            return true;
        var key = 0;
        if (e.keyCode) {
            key = e.keyCode;
        } // for moz/fb, if keyCode==0 use 'which'
        else if (typeof (e.which) != 'undefined') {
            key = e.which;
        }
       
        if (  key == 9 || key == 13)
        {
            Innergrid.leavingbox(true);
            var mmenu = document.getElementById("Igdmenu");
            if (mmenu!=null) document.body.removeChild(mmenu);
            Innergrid.nextcell = null;
            return false;
        }
         
        return true;
    },

    leavebox : function()
    {
        if (Innergrid.valueparse!=null)
        {    
            Innergrid.leavingbox(false);
        }
    },
     
    U : function(tx, Z, j)
    {
        Innergrid.leavingbox(false);
        holdvalues[Z + "_" + j]= tx.value;
    },
    
    leavingbox : function(gonext)
    {
        //(new Date()).getTime() - 
       // var x = Innergrid.moment[Innergrid.currentrr + "_" + Innergrid.currentcc + "_" + Innergrid.currentm + "_" + Innergrid.currentn] ;
       // if (x!=null && (new Date()).getTime() - x < 60)    return;
        if (gonext == null )
        {
            if (Innergrid.neednext )
            {    
              gonext = true;
              Innergrid.neednext = false;
            }
            else
               gonext = false; 
        }
        
        if (Innergrid.valueparse == null || Innergrid.currentbox==null) return;
        if (Innergrid.currentm < 0 || Innergrid.currentn < 0) return;
        var value = Innergrid.currentbox.value;
        Innergrid.valueparse[Innergrid.currentm][Innergrid.currentn] = value;
        var oldcell = Innergrid.currentth;
  
        Innergrid.currentbox.style.width = "1px";
        Innergrid.currentbox.style.visibility = "hidden";
        Innergrid.myhomeport.appendChild(Innergrid.currentbox);
        var u = Innergrid.CSVcompose(Innergrid.valueparse,Innergrid.colinfo).replace(/<nobr>/ig,'').replace(/<.nobr>/ig,'');
        
        if (ctype[Innergrid.currentcc].toLowerCase() == 'b')
        {
            mat[Innergrid.currentrr][Innergrid.currentcc]   = u;
            holdvalues[Innergrid.currentrr + '_' + Innergrid.currentcc] = "1";
        }
        else
        {
            holdvalues[Innergrid.currentrr + '_' + Innergrid.currentcc] = u;
           
        }
        valuechanged[Innergrid.currentcc] = true;
        var fmt = guessFormat(value);
        if (fmt > 0)
          value = checkh(value, true);
        else value = text2html(value);
        if (fmt ==2)
            LaTexHTML.deformat(Innergrid.currentth);
         if (Innergrid.activecellid == Innergrid.currentth.id)
                Innergrid.activecellid = null;
        Innergrid.currentth.innerHTML = "<nobr>" + value + "</nobr>";
        LaTexHTML.formatele(Innergrid.currentth);
        if (value!='' && value.replace(/[0-9]/g, '').replace(/\./, '')=='')
            Innergrid.currentth.align = 'right';
        else
            Innergrid.currentth.align = 'left'; 
       /* Innergrid.currentth.style.padding = '1px 1px 1px 1px';
        Innergrid.currentth.style.borderWidth = '1px 1px 1px 1px';
        Innergrid.currentth.style.borderColor = 'red';*/
        valuechanged[Innergrid.currentrr] = true;
        Innergrid.currentm = Innergrid.currentn = -1; 
        var tbl = oldcell.parentNode.parentNode;
        if (tbl.tagName.toLowerCase() !='table')
        tbl = tbl.parentNode;
        if ( value.replace(/[\s|\n|\r|\t]/g,'').replace(/&nbsp;/ig,'')!='' && oldcell.parentNode == tbl.rows[tbl.rows.length - 1])
        {    
            Innergrid.appendRow(tbl);
            
        }
        if (gonext)
            Innergrid.editthiscell(Innergrid.nextcell);
        
    },
    /*
    function gettext1(n)
    {
        if (n == null)
            return "";
        var tx = n.innerHTML.replace(/\n/g, ' ');
        if (tx == null)
            return "";
        return tx.replace(/<br>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&lt;/gi, '<').replace(/&nbsp;/gi, ' ');
    }
    */

     CSVcompose : function(v, cols)
    {
        var parse = new CSVParse("", "|", ",", ";");
        var s = '';
        for (var m=0; m < v.length; m++)
        {
            for (var n=0; n < v[m].length; n++)
            {
               if (cols.indexOf("," + m + '_' + n + ",")>=0)
                  s += "|" + v[m][n] + "|";
               else
                  s += parse.compose(v[m][n]);
               if (n < v[m].length-1)
                   s += ",";
               else if (m < v.length-1)
                   s += ";";
            }
        }
        return s;
    },
    activecellid:null,
    
    /*
     retrvtablevalue : function(n)
    {
        var s = "", x;
        if (n == null || n.tagName.toLowerCase() != 'table')
            return '';
        n = n.rows[0].cells[0].getElementsByTagName("table")[0];
        var start = false;
        var parse = new CSVParse("", "|", ",", ";");
        for (var i = 0; i < n.rows.length; i++)
        {
            for (var j = 0; j < n.rows[i].cells.length; j++)
            {
                x = gettext1(n.rows[i].cells[j]);

                start = true;
                var cols = "1";
                if (typeof (n.rows[i].cells[j].colSpan) != 'undefined'
                        && n.rows[i].cells[j].colSpan != null)
                    cols = n.rows[i].cells[j].colSpan;

                var rows = "1";
                if (typeof (n.rows[i].cells[j].rowSpan) != 'undefined'
                        && n.rows[i].cells[j].rowSpan != null)
                    rows = n.rows[i].cells[j].rowSpan;
                if (rows!="1" || cols!="1")
                    s += "'" + rows + "x" + cols + "',";
                s += parse.compose(x);
                if (j < n.rows[i].cells.length-1)
                    s += ",";
                else if (i < n.rows.length-1)
                    s += ";";
            }
        }

        return s;
    }*/

    appendRow: function(n)
    {

        var i = n.rows.length;
        var htt = n.rows[i - 1].cells[0].offsetHeight;
        var rs =   n.insertRow(i);
        rs.setAttribute("height", htt + "px");
        var l = n.rows[i - 1].cells.length;
        var ll = 0;
        
        for (var k = 0; k < l; k++)
        {
            var  z = n.rows[i-1].cells[k];
            if (typeof(z.colSpan) == 'undefined' || z.colSpan == null)
            {
                ll ++; continue;
            }
            var y = parseInt(''+z.colSpan);
            if ('' + y == 'NaN')
            {
                ll ++; continue;
            }
            ll  += y;
        }
        if (Innergrid.valueparse!=null)
        Innergrid.valueparse[i] = new Array(ll);
        for (var k = 0; k < ll; k++)
        {
            if (Innergrid.valueparse!=null)
            Innergrid.valueparse[i][k] = '';
            var  tdele = rs.insertCell(k);
            tdele.id = "Ing" + i + "_" + k;
            tdele.style.backgroundColor = TBGCOLOR;
            tdele.style.cursor = 'pointer';
            tdele.innerHTML = "&nbsp;";
            if (Innergrid.activecellid == "Ing" + i + "_" + k)
                Innergrid.activecellid = null;
            tdele.onclick = function() 
            {
                var  x = Innergrid.mytbl(this).id.substring(4).split(/_/);
                Innergrid.editthiscell(this,x[0],x[1]);
            };
            tdele.onmouseover = function(){Innergrid.hidemenu(true);}
            tdele.onmouseout= function(){Innergrid.hidemenu( false);} 
        }

    },
    makeinnertable : function (v, Z, l, etble,keepheading)
    {
        
        var usecross = (defaultRecord[l]!=null && defaultRecord[l]!='' && defaultRecord[l].replace(/[0-9]+x[0-9]+/, '').replace(/[\|| ]/g, '') == ''); 
        var widt = "";
        var ht = "";
       
        if (v == null || v == '' || v == defaultRecord[l])
        {
            v = defaultRecord[l];
            if (usecross)
            {
                var i = parseInt(v.replace(/x.*/, ''));
                var j = parseInt(v.replace(/[0-9]+x/, ''));

                if ('' + i != 'NaN' && '' + j != 'NaN')
                {
                    var ww = "";
                    for (; j >= 1; j--)
                        ww += ',';
                    ww = ww.replace(/,$/, ';');
                    v = "";
                    for (; i >= 1; i--)
                        v += ww;
                    v = v.replace(/;$/, '');
                    ht = " ";
                    widt = " width=\"100%\" ";
                }
               
                if (mat[Z][l] == null || mat[Z][l] == '')
                    mat[Z][l] = v;
            }
        }
        else if (!usecross && defaultRecord[l]!=null && keepheading==null )
        {
            var head = defaultRecord[l].replace(/;.*$/,'');
            if (head!='')
            v = v.replace(/^[^;]+/,head);
        }
 

        var s = "";

        if (l >= 0 && fsize[l] == '100')
            widt = " width=\"100%\" ";
        else if (l >= 0 && fsize[l] != '')
            widt = " width=\"" + fsize[l] + "\" ";

        var zz = "";
        if (l >= 0 && ffsize[l] == null)
            ffsize[l] = (font_size + 4);
        if (l >= 0 && ffsize[l] != '')
            ht = " height=" + ffsize[l];

       var numcl = 0;
       var  ii = 1;
       var  jj = 1;
       var cl=0, rw = 0, m =0, n=0; 
        var parse = new CSVParse(v, "|", ",", ";");
        var s = "";
        var id = "Igdt" + Z + "_" + l;
        while (true)
        {
            var vl = parse.nextElement();
            if (vl == null) 
            {
                if (s == '')
                {
                    var vv = defaultRecord[l];
                    if (v!='')
                    {
                        vv = defaultRecord[l].replace(/(\|\|.*$)/,'$1;$1').replace(/\|\|/,'|' + v + '|');
                    }
                    return Innergrid.makeinnertable(vv, Z, l, etble,keepheading);
                }
                break;
            }
            if (parse.pstate == parse.UNQUOTE && vl != '' && vl.replace(/[0-9]+x[0-9]+/,'') == '')
            {
                ii = parseInt(vl.replace(/x.*/, ''));
                jj = parseInt(vl.replace(/[0-9]+x/, ''));

                n++;
                continue;
            }
            if (cl == 0 )
            {
                if (rw == 0)
                {
                    
                    s = "<table  " + widt + " id=\"" + id + "\" cellpadding=3 cellspacing=1 border=1 style=\"border-color:#b0b0b0;border-collapse:collapse\">"  ;
                }
                s += "<tr " + ht + ">";
            }
            zz = '';
            if (vl == '')
            {
                if (rw == 0)
                    zz = 'width="70px"';
                if (ht == '')
                    ht = ' height="' + (font_size + 4) + 'px" ';

            }
            else
            {
                if (rw == 0)
                {
                    zz = 'width="' + (font_size * vl.length) + 'px"';
                }
            }

            s += "<td " + zz + "  id="+ "Igd" + m + "_" + n + "  valign=top ";
            if (vl.length>2 && vl.charAt(0)==' ' && vl.charAt(vl.length-1)==' ')
                s += " align=center ";
            else if (vl.length>1 && vl.charAt(0)==' ' )
                s += " align=right ";
            else if (vl.length>1 && vl.charAt(vl.length-1)==' ' )
                s += " align=left ";
            else if (vl.length>0 && isNaN(vl) == false)   s += " align=right ";
            else if (vl.length>0 && isNaN(vl))   s += " align=left ";
            else s += " align=center ";
            if (ii != 1)  s += " rowspan=" + ii;
            if (jj != 1)  s += " colspan=" + jj;
            s +=  (Innergrid.editstruct) ? " onmouseover=\"Innergrid.hidemenu(true)\"  onmouseout=\"Innergrid.hidemenu(false)\" " : " ";
            s +=  (etble) ? "    onclick=\"Innergrid.editthiscell(this,"+ Z + "," + l + ")\" " : "" ;
             if (rw > 0 || usecross || keepheading == 2)
                 s += " style=cursor:pointer;background-color:" +  TBGCOLOR;
             else
                 s += " style=cursor:pointer;background:" + beheading +";background-color:" + BBGCOLOR;
             if (typeof(guessFormat) != 'undefined')
             {
               var fmt = guessFormat(vl);
               if (fmt > 0)
                vl = checkh(vl, true);
               else vl = text2html(vl);
             }
             else
                  vl = text2html(vl);
              
             s += ">" +  (vl) + "</td>";

            ii = 1;
            jj = 1;

            if (parse.state==parse.DIMENSIONEND[1] || parse.state==parse.FILEEND) 
            {    
                s += "</tr>";
                rw++;
                m++;
                n = 0;
                cl = 0;
                if (parse.state==parse.FILEEND)
                    s+= "</table>";
            }
            else
            {
                cl++;
                n++;
            }


        }
        
        
        var w = null; var Z1 = Z;
        var l1 = l;
        while(true)
        {
            if (l1 > 0)
            {
                 w = ele(Z1,--l1);
                 if (w==null) break;
            }
            else if (datapresentformat = 'DataTable' && Z1 > 0)
            {
                l1 =  numCols-1;
                w = ele(--Z1,l1);
                if (w==null) break;
            }
            else 
            {
                w = null;
                break;
            }
        
            var b1 =  typeof(w.style) == 'undefined' || w.style.visibility!='hidden';
            var b2 =   typeof(w.type) == 'undefined' || w.type.toLowerCase()!='hidden';
            if (b1 && b2) break;
        }
         
        if (w!=null)
        {
             
            var oldwonfocus = w.onchane;
            w.onchange = function()
            {
                Innergrid.currentrr = -1;
                var ff = document.getElementById(id);
                if (ff!=null) 
                {
                Innergrid.editthiscell(ff.rows[0].cells[0],Z,l);
                oldwonfocus();
                }
            }
            
        }
        return s;
    }
    
     
}

var numnew = 0;
var whichaction = '';
var rowInvolves = '';
function atEndDrag(ex, ey)
{
    
}
function checkone(i, b) {
}
function copycheck(i, j) {
}
function checkread(i) {
    return false;
}
function goeval(effect)
{
    if (onsaved != '' && effect > 0)
    {
            var  poped = (promptwin == null);//  poped = true;
            eval(onsaved);
            poped = (poped != (promptwin == null));
            return poped;
    }
    return false;
}
function multirowdatasaved(z, ss)
{
     
    if (rowInvolves == '') return;
    var ret = 0;
    var rx = z.split(",");
    whichaction = '';
    if (rowInvolves != '')
        whichaction = rowInvolves.charAt(0);
    var ix = rowInvolves.substring(1).split(',');
    var N = rx.length;
    var min = -1;
    var poped = false; 
    var goodhint = '';
    if (''+whichaction == '0')
    {
        haserror = false;
        try 
        {
            if (typeof (ondeleted) != 'undefined' && ondeleted != '')
            {
                 eval(ondeleted);
            }
        } catch (e) { }
        for (var l = 0; l < N; l++)
        {
            var u = parseInt(ix[l]);
            if (u >=NUMROWS) break;
            if (rx[l] != '0' && rx[l] != '-1')
            {
                deleted[u] = true;
                if (min == -1)
                    min = parseInt(ix[l]);
                
                if (u < counter)
                    counter--;
            }
            else
                haserror = true;
        }

        if ('' + min != '-1')
        {
            var t = 0;
            while (t < numRows)
            {
                t = min + 1;
                for (; t < numRows && deleted[t]; t++)
                    ;
                if (t < numRows)
                {
                    for (var c = 0; c < numCols; c++)
                    {
                        mat[min][c] = mat[t][c];
                        setv(min, c, mat[t][c]);
                    }
                    valuechanged[min] = valuechanged[t];
                    deleted[t] = true;
                    deleted[min] = false;
                    copycheck(min, t);
                    min++;
                }
                 
            }

            for (t--; t >= min; t--)
                checkone(t, false);
 
            for (t++; t < numRows; t++)
            {
                for (c = 0; c < numCols; c++)
                {
                    mat[t][c] = nullvalue[c];
                    if (holdvalues[t + "_" + c] != null)
                        holdvalues[t + "_" + c] = null;
                    else
                    {
                        setv(t, c, nullvalue[c]);
                    }
                }
            }
            numRows = min;


            for (c = 0; c < numCols; c++)
            {
                mat[min][c] = nullvalue[c];
                if (holdvalues[min + "_" + c] != null)
                    holdvalues[min + "_" + c] = null;
                else
                {
                    setv(min, c, nullvalue[c]);
                    
                }
            }

            if (typeof (f1.count) != 'undefined')
            {
                f1.count.value = counter;
            }
            if (typeof (f1.total) != 'undefined')
            {
                f1.total.value = numRows;
            }

            if (typeof (f2.count) != 'undefined')
            {
                f2.count.value = counter;
            }
            if (typeof (f1.total) != 'undefined')
            {
                f1.total.value = numRows;
            }

            rewriteRowtotal();
 
            if (haserror && ret < 2)
            {
                ret = 2;
            }
            else if (haserror == false && ret < 1)
            {
                ret = 1;
            }
        }
    }
    else if (whichaction == '1')
    {
        alluploadedfiles = '';
        haserror = false;
        var newn = 0, effect = 0;
        for (l = 0; l < N; l++)
        {
            u = parseInt(ix[l]);
            if (u >= NUMROWS) break;
            if (rx[l] == '0' || rx[l] == '-1')
            {
                if (min == -1 && u >= numRows)
                    min = u;
                checkone(u);
                haserror = true;
            }
            else
            {
                if (u >= numRows)
                    newn++;
                effect++;
             
                for (c = 0; c < numCols; c++)
                {
                    if ( holdvalues[u + "_" + c]==null)
                    {
                       mat[u][c] = retrv(u,c); 
                    }
                    else if (ctype[c] != 'a' && holdvalues[u + "_" + c]!=null)
                    {
                        mat[u][c] = holdvalues[u + "_" + c];
                    }
                    holdvalues[u + "_" + c] = null;
                }
                valuechanged[u] = false;
            }
            
        }
        if (newn > 0)
        {
            numRows += newn;
            if (typeof (f1.total) != 'undefined')
                f1.total.value = numRows;
            if (typeof (f2.total) != 'undefined')
                f2.total.value = numRows;
            rewriteRowtotal();
        }
        
        var hasformatfield = false; for (var k=0; k < numCols; k++) if (fields[k].toLowerCase().indexOf('format')>=0){ hasformatfield = true;break;}
        if (1==2 && hasformatfield && guessedFormat!=0 && numRows <=1 && datapresentformat=='DataForm')
        {
            goodhint = "<br>" + textmsg[1607] + "<center><input type=button name=okbtn class=GreenButton style=\"width:" + Math.round(4.5*font_size) + "px\" value=\"" + textmsg[1357] +"\" onclick=\"goeval(" + effect + ")\"></center><br>" + textmsg[1616]    
            if (guessedFormat == 1)
            {
                goodhint =goodhint.replace(/LaTeXML/i,'HTML') + "<input type=radio name=goodformat value=0 onclick=resaveformat(0)>" + textmsg[1608] +"<input type=radio name=goodformat value=1 onclick=resaveformat(2)>LaTeXML";
            }
            else if (guessedFormat == 2)
            {
                goodhint =goodhint + "<input type=radio name=goodformat value=0 onclick=resaveformat(0)>" + textmsg[1608] +"<input type=radio name=goodformat value=2 onclick=resaveformat(1)>HTML";
            }
            goodhint = '<div style="border:1px #b0b0b0 outset;margin:3px 3px 3px 3px;padding:3px 3px 3px 3px">' +  goodhint + "</div>";
            guessedFormat = 0;
        }
        else if (onsaved != '' && effect > 0)
        {
            poped = (promptwin == null);//  poped = true;
           
            eval(onsaved);
            poped = (poped != (promptwin == null));
             
        }
        if (haserror && ret < 2)
        {
            ret = 2;
        }
        else if (haserror == false && ret < 1)
        {
            ret = 1;
        }
    }
   
    if (ret == 1)
    {
        if (whichaction != '0' && ss != null)
        {
            if (!poped || promptwin == null)
               myprompt(ss+ goodhint);
            else
            {
                 var txt = promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[1].cells[0].getElementsByTagName('div')[0];
                 txt.innerHTML = ss +  txt.innerHTML + goodhint;
            }
        }
    }
    else if (ret < 3 && ss != null)
    {
        if (!poped || promptwin == null)
           myprompt(ss);
        else
        {
             var txt = promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[1].cells[0].getElementsByTagName('div')[0];
             txt.innerHTML = ss +    txt.innerHTML;
        }
    }
    if (typeof (disablefuncbut) == 'function')
    {
        disablefuncbut(false);
    }
    rowInvolves =  '';
    
    return ret;
}
var allkeyfields = "";
for (var ii = 0; ii < numCols; ii++)
{
    if (deleteQuery.indexOf("|" + ii + "|") >= 0
            && ("," + allkeyfields + ",").indexOf("," + ii + ",") < 0)
    {
        if (allkeyfields != '')
            allkeyfields += ","
        allkeyfields += ii;
    }
    if (updateQuery.indexOf("|" + ii + "|") >= 0
            && ("," + allkeyfields + ",").indexOf("," + ii + ",") < 0)
    {
        if (allkeyfields != '')
            allkeyfields += ","
        allkeyfields += ii;
    }
}
function resaveformat(k)
{
    for (var j=0; j < numCols; j++)
    {
        if (fields[j].toLowerCase().indexOf('format') == 0) break;
    }
    if (j < numCols)
    {
        setv(0, j, ''+k);
        numRows = 1;
        valuechanged[0] = true;
        guessedFormat = 0;
        setaction(1);
    }
}
function doblankkey()
{
    for (var i = 0; i < NUMROWS; i++)
    {
        if (valuechanged[i])
        {
            for (var j = 0; j < numCols; j++)
            {
                if (("," + allkeyfields + ",").indexOf("," + j + ",") >= 0 && dtype[j] == false)
                {
                    v = retrv(i, j);

                    if (v == null)
                        continue;
                    var k = v.length;
                    if (k > 0 && (v.charAt(0) == ' ' || v.charAt(k - 1) == ' '))
                    {
                        if (confirm("|" + v + "|\n" + textmsg[892]))
                            setv(i, j, v.replace(/^[ ]+/, '').replace(/[ ]+$/, ''));
                    }
                }
            }
        }
    }
}
function changedbback()
{
    if (typeof (f2) != 'undefined')
    {
        f2.subdb.value = subdb;
    }
}
 
function save2places()
{
    if (valuechangedold!=null)
    {
       for (var j=0; j < numCols; j++)
       {  
           valuechanged[j] = valuechangedold[j];
       }
       valuechangedold = null;
    }
    if (typeof (f2) != 'undefined')
    {
        if (f2.subdb.value != '')
        {
            f2.subdb.value = "";
          
        }
        else
        {
            for (var j=0; j < numCols; j++)
           {
               if (fields[j]=='UserId' || fields[j] == 'Id')
               {   
                   f2.subdb.value = mat[0][j];
                   break;
               }
           }
           if (j == numCols) return;
        }
          formnewaction(f2, "SaveBack");
          visual(f2);
          f2.submit();
          changedbback() ;
    }
}
var valuechangedold = null;
function saveabsence1()
{
    valuechangedold = [];
    for (var j=0; j < numCols; j++)
    {  
        valuechangedold[j] = valuechanged[j];
        valuechanged[j] = true;// (''+retrv(j,6) == '0');
    }
}

function saveabsence()
{
    var n = parseInt(''+ele(NUMROWS,6).value);
    if (0 < n && n < numRows/2 && confirm(textmsg[1848]) || n>=numRows/2)
    {
        saveabsence1();
    }
}
function pop(str)
{
    var haswarn = (typeof (promptwin) != 'undefined' && promptwin != null);
    if (haswarn)
        setRoundedWidth(promptwin, 600);
    else
        window.resizeTo(600, 600);
    document.getElementById("errdetail").innerHTML = '<p style="margin:2px 2px 2px 2px">' + str + '</p>';
    if (haswarn) 
    {
        setRoundedHeight(  promptwin, document.getElementById("errdetail").offsetHeight + 40)  ;
        centerlizeit();
    }
}
if (typeof(ResizeUploaded) == 'undefined')
var ResizeUploaded =
{
attachref: null,
filetobedeleted: null,
savedfiletodelete: '',
uploadedattachmen: null,
uploadedresized: false,
pathcode: null,
filename: null,
picwidth: null,
picheight: null,
noattachindex: null,
noattachurl: null,
attachindex:null,
oldattachvalue:null,
alluploaded : '',
timestmp:0,
zip: function(str)
{
    var s = str.replace(/,$/,'').split(/,/);
    if (str.indexOf("|") > 0 || s.length ==1) 
        return str;
    var i=0;
    var l = s[0].lastIndexOf("@");
    while (true)
    {
        for (var j=1; j < s.length; j++)
        {
            var k = s[j].lastIndexOf("@");
            if (i+l+1 == s[0].length  || i+k+1 == s[j].length || s[j].charAt(i+k+1) != s[0].charAt(i+l+1)) 
              break;  
        }
        if (j < s.length )
        {
             break;
        }
        else  i++;
    }
    var y = s[0] + ",";
    for (var j=1; j < s.length; j++)
    {
        var k = s[j].lastIndexOf("@");
        var i=0;
        while ( i+l+1 < s[0].length  &&  i+k+1 < s[j].length && s[j].charAt(i+k+1) == s[0].charAt(i+l+1)) 
            i++;
        if (i > 0)
            y += s[j].substring(0,k+1) +  i + "|" + s[j].substring(i+k+1) + ",";  
        else
            y += s[j] + ",";
    }
    return y;
},

unzip : function(str)
{
    if (str == null) return '';
    var s = str.replace(/,$/,'').split(/,/);
    if (str.indexOf("|") < 0 || s.length ==1) 
        return str;
    str = s[0] + ",";
    var l = s[0].lastIndexOf("@");
    for (var j=1; j < s.length; j++)
    {
         var k = s[j].indexOf("|");
         if (k < 0)
            str += s[j] + ","; 
         else
         {
            var m = s[j].lastIndexOf("@");
            var n = parseInt(s[j].substring(m+1,k));
            str += s[j].substring(0,m+1) + s[0].substring(l+1,l+n+1) + s[j].substring(k+1) + ",";
         }
    }
    return str;
}, 
tempvalue:'',
isimg:true,
goodopenurl:function(codepath,tail)
{
    if (codepath.indexOf('http://') == 0 || codepath.indexOf('https://') == 0)
    return codepath;
    var st = "FileOperation?did=" + codepath; 
    if (tail==null || tail==true)
        st += "&tcode=" + (new Date()).getTime()%1000000000;
    return st;
},
widthnow:0,
heightnow:0,
butwidth:Math.round(charwidthrate()*font_size),
photoj:-1,
uploaded : function (z, fn)
{
    
    ResizeUploaded.widthnow = thispagewidth();
    ResizeUploaded.heightnow = thispageheight();
    if (datapresentformat == 'DataTable' || datapresentformat == 'DataLongForm')
        counter = rr;
    if (counter < 0) counter = 0;
    if (theattachbtn != null)
    {
        theattachbtn.disabled = true;
        theattachbtn.style.cursor = "default";
    }
    ResizeUploaded.butwidth = Math.round(charwidthrate()*font_size);
    var j = 0; 
    if (ResizeUploaded.photoj == -1)
    {
        var j3= 0; 
        if  (cc!=null && cc>=0 && cc < numCols) j = cc;
        for (; j3 < numCols &&  fields[j].toLowerCase().indexOf('attach') != 0  ; j3++,j = (j+1)%numCols );
    } 
    else
    {
        j = ResizeUploaded.photoj;
       
    }
    var regloc = fn;
    var locat = document.location.toString();
   
    if (z.length > 4)
        regloc = locat.replace(/[^\\/]+$/,  "FileOperation?did=" + z.substring(4));
    var imgpath = "FileOperation?did=" + z.substring(4);  
    var tt = fn;
    ResizeUploaded.isimg = false;
    ResizeUploaded.noattachindex = -1;
    ResizeUploaded.noattachurl = regloc;
    var fnc = fn + '@'+ z.substring(4);
    if (fields[j].toLowerCase().indexOf('attach') != 0)
    {
        ResizeUploaded.attachindex = -1;
        var atcvalue = "," + ResizeUploaded.alluploaded;
        if (atcvalue.indexOf("," + fnc  + ",") < 0 )
            ResizeUploaded.tempvalue =  fnc  + "," + ResizeUploaded.alluploaded;
        else
            ResizeUploaded.tempvalue = ResizeUploaded.alluploaded;
        ResizeUploaded.attachman();
    }
    else
    {
        ResizeUploaded.attachindex = j;
       
        var atc = ele(counter, j);
        
        ResizeUploaded.oldattachvalue = atc.value;
        var atcvalue = "," + ResizeUploaded.unzip(atc.value);
 
        if (atcvalue.indexOf("," + fnc  + ",") < 0 )
        {
            v =  ResizeUploaded.zip( fnc  + "," + atc.value);
 
            if (maxsize[j] > 0 && v.length > maxsize[j])
            {

                myprompt('(' + v + ')' + ' ' + textmsg[906]);
            }
            else
            {
                setv(counter, j, v);
            }
            
        }
         
         ResizeUploaded.attachman(ele(counter, j));

    }
    valuechanged[counter] = true;
    window.onbeforeunload = beforeclose;


    var fen = fn.replace(/@.*/, '');
    var jj = fen.lastIndexOf(".");
    fen = fen.substring(jj + 1).toLowerCase();
    var ss = '';
    ResizeUploaded.pathcode = z.substring(4);
    ResizeUploaded.filename = fn;
     var wordfor = textmsg[1293].split(/@/);
     
    if ((fen == 'jpg' || fen == 'jpeg' || fen == 'gif' || fen == 'png') && z.length > 4 && (z.charAt(3) == '/'  ))
    {
        if (typeof(startface) != 'undefined' && rdapname =='roster' && phasestatus==0)
        {
            
            myprompt(textmsg[86]);
            ResizeUploaded.detectface();
            return;
        }
        var cancut = (ResizeUploaded.attachref==null || ResizeUploaded.attachref.value.indexOf("@" + fn.replace(/@.*/, '') + "@") < 0);
        
        ResizeUploaded.isimg = true;
        ResizeUploaded.picwidth = 0;
        ResizeUploaded.picheight = 0;
        ss = "<table class=outset1 style=\"margin:3px 3px 3px 3px; border-radius:3px;border:0px #d0d0d0 outset\" id=uploadinstru cellspacing=1 cellpadding=0  ><tr>";
        if (cancut) 
            ss +="<td style=\"border-radius:3px\" ><select id=resizesel style=\"width:"+ ResizeUploaded.butwidth + "px;overflow:hidden;border:1px #b0b0b0 solid;margin:0px 0px 0px 0px;border-radius:3px\" onchange=ResizeUploaded.resizeonly(this,'" + z.substring(4) + "','" + fn + "')><option selected>100%</option>"
                + "<option>5%</option><option>10%</option><option>20%</option><option>25%</option><option>30%</option><option>40%</option><option>50%</option><option>75%</option>"
                + "<option>125%</option><option>150%</option><option>200%</option></select></td>";

        var s1 = '';
        var s2 = ''; var ii = 0;
        var betterrdap =  (rdapname.toLowerCase().indexOf("message")<0 && rdapname.toLowerCase().indexOf("submission")<0 
        && rdapname.toLowerCase().indexOf("assign") <0 && rdapname.toLowerCase().indexOf("announce")  <0  && rdapname.toLowerCase().indexOf("grading")  <0 
          );
        var isu = rdapname.toLowerCase()== ("studentself")  || rdapname.toLowerCase() == ("userself");
        
        if (ResizeUploaded.photoj ==-1)
        {
        if (betterrdap)
        for (var k = 0; k < numCols; k++)
        if (  fsize[k] != null && (ctype[k] == 'u' || ctype[k] == 'U' ))
        {
            s1 += "<option value=\"" + k + "\" >" + wordfor[1] +" " + labels[k] + "</option>";
        }
        if (isu) 
        {
            for (k = 0; k < numCols; k++)
            if (ctype[k] == 'u' || ctype[k] == 'U'   )
            {
                ResizeUploaded.noattachindex = k; 
            }
            s1 = s1.replace(/>/, ' selected >');
        }
        }
        else
        {
             s1 = "<option value=\"" + ResizeUploaded.photoj + "\" selected>" + wordfor[1] +" " + labels[ResizeUploaded.photoj] + "</option>";
             ResizeUploaded.noattachindex = ResizeUploaded.photoj; 
             ResizeUploaded.photoj = -1;
        }
        
        ss += "<td><nobr></nobr></td>";
        if (cancut)
        {
            ss += "<td style=\"background-color:orange;color:white;border:1px #b0b0b0 outset;width:"+ ResizeUploaded.butwidth + "px;font-weight:700;border-radius:3px;cursor:pointer\"   align=center onclick=\"ResizeUploaded.swapproc(this)\"><nobr>"+ textmsg[1295] + "</nobr></td>";
            //ss += "<td  width=70><select id=cropfield style=\"border:1px #b0b0b0 solid\" onchange=\"ResizeUploaded.cropshow(this)\"><option value=-1 " + (isu?'':'selected') + ">" + textmsg[1297].replace(/;.*/,'')+ textmsg[1294] + "</option>" + s1 + "<option value=-2 >"+  textmsg[1295] +"</option></select></td>";
        }
        if (betterrdap && !isu)
        {
            for (k = 0; k < numCols; k++)
            if ( fields[k].toLowerCase().indexOf('attach') == 0   )
            {
                ii++;
                s2 += "<option value=\"" + k + "\" >" + wordfor[1] +" "+ labels[k] + "</option>";

            }
            for (k = 0; k < numCols; k++)
            if (ctype[k] == 'u' || ctype[k] == 'U'   )
            {
                ii++;
                s2 += "<option value=\"" + k + "\"  >" + wordfor[1] +" "+ labels[k] + "</option>";

            }

            for (k = 0; k < numCols; k++)
            if ( (ctype[k] == 'a' || ctype[k] == 'A' ) &&  fields[k].toLowerCase().indexOf('attach') != 0 )
            {
                ii++;
                s2 += "<option value=\"" + k + "\"  >" + wordfor[1] +" " + labels[k] + "</option>";

            }

            for (k = 0; k < numCols; k++)
            if ( (ctype[k] == 't' || ctype[k] == 'T') &&  fields[k].toLowerCase().indexOf('attach') != 0 )
            {
                ii++;
                s2 += "<option value=\"" + k + "\"  >" + wordfor[1] +" " + labels[k] + "</option>";

            }

            if (ii >= 1)
                s2 = s2.replace(/>/, " selected >");

            ss += "<td><nobr>"  + "</nobr></td><td  width=70><select id=usefield  style=\"width:"+ ResizeUploaded.butwidth + "px;overflow:hidden;border:1px #b0b0b0 solid;margin:0px 0px 0px 0px\"  onchange=\"ResizeUploaded.cropuse()\" )><option value=-1 " + (ii>=1?"":"selected") + " >" + textmsg[1297].replace(/[^;]+;/,'') +   wordfor[0] + "</option>" + s2 + "<option value=" + (numCols) + ">URL</option></select></td>";
        } 
        if (cancut)ss += "<td style=\"background-color:#BBBB00;color:white;border:1px #b0b0b0 outset;width:"+ ResizeUploaded.butwidth + "px;font-weight:700;border-radius:3px;cursor:pointer\"   align=center onclick=\"ResizeUploaded.cropuse()\"><nobr>"+ textmsg[1357] + "</nobr></td>";
        ss += "<td style=\"background-color:#b0b0b0;color:white;border:1px #808080 outset;width:"+ ResizeUploaded.butwidth + "px;font-weight:700;border-radius:3px;cursor:pointer\"  align=center onclick=ResizeUploaded.cropuse(1)><nobr>"+ textmsg[1359] + "</nobr></td>";
        ss += "<td style=\"background-color:white;color:black;border:1px #808080 outset;width:"+ ResizeUploaded.butwidth + "px;font-weight:700;border-radius:3px;cursor:pointer\"  align=center onclick=ResizeUploaded.readbw()><nobr>"+ textmsg[1630] + "</nobr></td>";
        ss += "<td style=\"background-color:red;color:white;border:1px #b0b0b0 outset;width:"+ ResizeUploaded.butwidth + "px;font-weight:700;border-radius:3px;cursor:pointer\"  align=center  onclick=\"ResizeUploaded.deleteit()\"><nobr>" + textmsg[69]  + "</nobr></td>";
        ss += "<td style=\"background-color:#BBBB00;color:white;border:1px #b0b0b0 outset;width:"+ ResizeUploaded.butwidth + "px;font-weight:700;border-radius:3px;cursor:pointer\"  align=center  onclick=\"ResizeUploaded.cropuse(3)\"><nobr>" + textmsg[1303]  + "</nobr></td>";
        //if (typeof(regradesubmission) != 'undefined' && typeof(openassess) != 'undefined')
        ss += "<td style=\"background-color:#BBBB00;color:white;border:1px #b0b0b0 outset;font-weight:700;border-radius:3px;cursor:pointer\"  align=center ><img style=\"width:" + font_size + "px;height:" + font_size + "px;border-radius:" + (font_size/2) + "px\" src=image/nophoto.jpg  onclick=\"ResizeUploaded.detectface(this)\"></td>";
        if (ResizeUploaded.attachref==null ||ResizeUploaded.attachref.value.replace(new RegExp(",[0-9][0-9]?@"+fn.replace(/@.*/,'')),"") ==ResizeUploaded.attachref.value)  
        ss +=  "<td><input id=rotatesel style=\"width:" + ResizeUploaded.butwidth + "px;overflow:hidden;border:1px #b0b0b0 solid;margin:0px 0px 0px 0px;border-radius:3px;width:30px;width:50px\" onchange=ResizeUploaded.rotateonly(this,'" + z.substring(4) + "','" + fn + "') value=0 ></td><td>&deg;</td>";
        
        ss += "</tr></table><img id=\"imgwork\" src=\"" + imgpath + "&tcode=" + (new Date()).getTime()%1000000000 + "\"  style=\"margin:0px 0px 0px 0px\" onload=\"ResizeUploaded.goodposition(this);\">";
        
        myprompt(ss, null, null, textmsg[1296]);
        
        if (promptwin!=null && promptwin.getElementsByTagName('table')!=null)
        {
            promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[1].cells[0].getElementsByTagName('div')[0].style.cursor='pointer';
            promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[1].cells[0].getElementsByTagName('div')[0].style.padding = "0px 0px 0px 0px";
            promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].onclick
            = function(){var b = document.getElementById("dragcropbox"); if (b!=null) document.body.removeChild(b);ResizeUploaded.cropuse();} 
        }
        if (isu)
            ResizeUploaded.cropshow(document.getElementById('cropfield'));
    }
    else
    {
        ResizeUploaded.photoj = -1;
        ss = "<table class=outset1 style=\"margin:3px 3px 3px 3px;border-radius:3px;border:0px #d0d0d0 outset\" id=uploadinstru cellspacing=1 cellpadding=3 ><tr>";

        var s1 = '';
        var s2 = ''; var ii = 0;
        var selectedstr = ' selected ';
        for (k = 0; k < numCols; k++)
        if ( fields[k].toLowerCase().indexOf('attach') == 0   )
        {
            ii++;
            s2 += "<option value=\"" + k + "\"  >" + wordfor[1] +" "+ labels[k] + "</option>";
            selectedstr = '';
        }
         
        for (k = 0; k < numCols; k++)
        if ( (ctype[k] == 'a' || ctype[k] == 'A' ) &&  fields[k].toLowerCase().indexOf('attach') != 0 )
        {
            ii++;
            s2 += "<option value=\"" + k + "\"  >" + wordfor[1] +" " + labels[k] + "</option>";
            selectedstr = '';
        }
        
        for (k = 0; k < numCols; k++)
        if ( (ctype[k] == 't' || ctype[k] == 'T') &&  fields[k].toLowerCase().indexOf('attach') != 0 )
        {
            ii++;
            s2 += "<option value=\"" + k + "\"  >" + wordfor[1] +" " + labels[k] + "</option>";
           
        }
        if (ii >= 1)
            s2 = s2.replace(/>/, " selected >");
        ss += "<td  width=70><select id=usefield  style=\"border:1px #b0b0b0 solid;margin:0px 0px 0px 0px\"  onchange=\"ResizeUploaded.cropuse()\" )><option value=-1 " + (ii==1?"":"selected") + " >" + textmsg[1297].replace(/[^;]+;/,'')+ textmsg[1294]+ "</option>" + s2 + "<option value=" + (numCols) + ">URL</option></select></td>";
        ss += "<td style=\"background-color:#BBBB00;color:white;border:1px #b0b0b0 outset;width:"+ ResizeUploaded.butwidth + "px;font-weight:700;border-radius:3px;cursor:pointer\" align=center onclick=\"ResizeUploaded.docuse()\">"+ textmsg[1357] + "</td>";

        ss += "<td style=\"background-color:red;color:white;border:1px #b0b0b0 outset;width:"+ ResizeUploaded.butwidth + "px;font-weight:700;border-radius:3px;cursor:pointer\"  align=center  onclick=\"ResizeUploaded.deleteit()\"><nobr>" + textmsg[69]  + "</nobr></td></tr>";

        ss += "</table>";
        myprompt(ss, null, null, wordfor[0]);
        promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].onclick
        = function(){ResizeUploaded.docuse();}
        ResizeUploaded.alluploaded +=   ResizeUploaded.filename + '@' + ResizeUploaded.pathcode + ','; 
    }
},
anchor:null,
detectface : function(img)
{
       /* var savedredourl = "UploadFace?pathcode=" + ResizeUploaded.pathcode +   "&tcode=" + ResizeUploaded.filename.replace(/^[^@]+@/,"");
        if (typeof(startface) != 'undefined')
        savedredourl += "&CourseId=" + currentcid + "&Session=" + (numRows>0?mat[0][0]:defaultRecord[0]);
        window.open(savedredourl,'w'+tstmp);*/
        if (img!=null)
        {
            img.src="image/giphy.gif";
        }
        var xmlhttp;
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
                var y = xmlhttp.responseText;
                if (y!=null && y!='')
                { 
                    if (ResizeUploaded.anchor!=null)
                    {
                        ResizeUploaded.anchor.style.animation = null;
                        ResizeUploaded.anchor = null;
                    }
                    if (y.indexOf('<html>') > 0 && y.indexOf('<body ')>0)
                    {
                        var x= parent.open('', 'w' + tstmp);
                        x.document.write(y);
                    }
                    else eval(y);
                }
            }
        }
        var f = new FormData();
        f.append('pathcode',ResizeUploaded.pathcode);
        
        if (typeof(startface) != 'undefined' && rdapname =='roster')
        { 
            f.append('CourseId', currentcid);
            f.append('Session', (numRows>0?mat[0][0]:defaultRecord[0]) );
        }
        xmlhttp.open('POST', "UploadFace", true);
        xmlhttp.send(f);
        
}, 

facedim : function (alln)
{
     var r = new RegExp(",[0-9]+@");
     var s = ResizeUploaded.attachref.value;
     var k = 0;
     var m;
     var j = 0;
     while ( (m = r.exec(s.substring(k))) != null)
     {
         j = parseInt(m.toString().replace(/[^0-9]/g, ''));
         k += m.index + m.toString().length;
     }
     if (alln == '') return;
     var ns = alln.replace(/,$/,'').split(/,/) ;
     var imgs = '<table><tr>';
     var ww = 0; 
     var had = false;
     for (var i=0; i <= ns.length-4; i+=4)
     {var w = parseInt( ns[i+2]);var  h =  parseInt( ns[i+3])
          var x = parseInt( ns[i]) - Math.round(0.13*w);
          var y = parseInt( ns[i+1]) - Math.round(0.25*h);
          w += Math.round(0.26*w);
          h += Math.round(0.5*h);
          ww += w;
          if (ww > 720){imgs += '</tr></table><table><tr>'; ww = w;had = true;} 
          imgs += '<td><table><tr height=' + h + '><td width=' +w +' style="background-image:url(FileOperation?did='+
          ResizeUploaded.pathcode + ');background-position:-' + x + 'px -' + y + 'px" > </td></tr></table></td>';
          ResizeUploaded.attachref.value = ResizeUploaded.attachref.value + (++j) + "@" + ResizeUploaded.filename.replace(/@.*/,'') + "@" + x  + "_" +  y + "_" +  w + "_" +  h + ",";
     }
     myprompt(imgs + '</tr></table>');
     if (had)
         promptwin.style.width = '740px';
     else 
         promptwin.style.width = (ww+30) + 'px';
     //ResizeUploaded.attachman(ResizeUploaded.attachref);
},
swapproc : function(td)
{
    var tr = td.parentNode;
    var tds = tr.cells;
    var len = tds.length;
    
    if (td.innerHTML.replace(/<[^>]+>/g,'') == textmsg[1295])
    {
        ResizeUploaded.cropshow(td);
        td.innerHTML = "<nobr>" + textmsg[1645] + "</nobr>";
        
        for (var j = len - 1; j >  len - 5; j--)
        {
            tds[j].style.visibility = 'hidden';
        }
    }
    else
    {
        td.innerHTML =  "<nobr>" + textmsg[1295] + "</nobr>";
        var box = document.getElementById("dragcropbox");
        if (box != null)  document.body.removeChild(box);
        for (var j = len - 1; j >  len - 5; j--)
        {
            tds[j].style.visibility = 'visible';
        }
    }
},

deleteit : function()
{
    ResizeUploaded.cropuse();
    var usefield = document.getElementById("usefield");
    if (usefield!=null)
    usefield.selectedIndex = 0;
    ResizeUploaded.deleteAttachedFile(ResizeUploaded.attachref.value);
    //open("UploadChangePic?pathcode=" + ResizeUploaded.pathcode + "&rdap=" + rdapname + "&tcode=" + ResizeUploaded.filename.replace(/^[^@]+@/,""), 'w' + tstmp);
},

docuse : function()
{
   var usefield = document.getElementById("usefield");
   var i = usefield.selectedIndex;
   if (i == usefield.options.length-1) 
       myprompt(ResizeUploaded.noattachurl);
   else if (i > 0)   
   {
        var k = parseInt(usefield.options[i].value);
        if (k < numCols && fields[k].toLowerCase().indexOf('attach')!=0)
        {
            ResizeUploaded.noattachindex = k;
            if (retrv(counter,k) == '')
               ele(counter, k).value =  ResizeUploaded.noattachurl;
            else
               ele(counter, k).value +=  '\n'+ ResizeUploaded.noattachurl;
            holdvalues[counter + '_' + k] = ele(counter, k).value;
            valuechanged[counter] = true;
            window.onbeforeunload = beforeclose;
            ResizeUploaded.alluploaded +=  ResizeUploaded.filename + '@' + ResizeUploaded.pathcode + ','; 
        }
        if (typeof(showattachment)!='undefined')
                showattachment(ResizeUploaded.zip(ele(counter, k).value)); 
   }
   else 
   {
        savedredourl = "UploadChangePic?pathcode=" + ResizeUploaded.pathcode + "&rdap=" + rdapname + "&tcode=" + ResizeUploaded.filename.replace(/^[^@]+@/,"");
        window.open(savedredourl, "w" + tstmp); 
   }
   
   closeprompt();
},
readbw : function()
{
    var pic = document.getElementById('imgwork');
    var p = pic.parentNode;
    p.insertBefore(document.createTextNode(textmsg[1631]),pic);
    var btn = document.createElement('input');
    btn.className = 'OrangeButton';
     
    btn.style.cssText = 'width:' + ResizeUploaded.butwidth + 'px;align:center;cursor:pointer';
    btn.type='button';
    btn.value = textmsg[848];
    btn.onclick = function(){ResizeUploaded.cropuse(2)};
    p.insertBefore(btn,pic);
    btn = document.createElement('input');
    btn.className = 'GreenButton';
    btn.style.cssText = 'width:'+ ResizeUploaded.butwidth + 'px;align:center;cursor:pointer';
    btn.type='button';
    btn.value = textmsg[849];
    btn.onclick = function(){var pic = document.getElementById('imgwork');var p = pic.parentNode;p.removeChild(pic.previousSibling);p.removeChild(pic.previousSibling);p.removeChild(pic.previousSibling);};
    p.insertBefore(btn,pic);
},
dosplitnow: false,
cropuse : function(bw)
 {
   var i = -2;
   ResizeUploaded.dosplitnow = false;
   if (bw!=null && bw==3)
   {
      ResizeUploaded.dosplitnow = true;
      bw =null;
   }
   var usefield = document.getElementById("usefield");
   if (usefield!=null)
    i = usefield.selectedIndex;
   var needsubmit = (bw!=null);
   var url = "UploadChangePic?pathcode=" + ResizeUploaded.pathcode + "&rdap=" + rdapname + "&tcode=" + ResizeUploaded.filename.replace(/^[^@]+@/,"");
   
   var b = null;
   if (i > 0 || i == -2)   
   {
        var pic = document.getElementById('imgwork');
        var XY = findPositionnoScrolling(pic);
        var w = pic.offsetWidth;
        var h = pic.offsetHeight;
        //needsubmit = false; 
        if (ResizeUploaded.uploadedresized)
        {
            needsubmit = true;
            url += "&rwidth=" + w + "&rheight=" + h;
        }
        
        b = document.getElementById("dummycenter");
        if ( b != null)
        {
            var cw = parseInt(b.style.width.replace(/px/,''));
            var ch = parseInt(b.style.height.replace(/px/,''));
            if (''+cw == 'NaN') cw = b.offsetWidth;
            if (''+ch == 'NaN') ch = b.offsetHeight;
            var xy = findPositionnoScrolling(b);
            xy[0] -= XY[0];
            xy[1] -= XY[1];
            if (xy[0] < 0)
                xy[0] = 0;
            if (xy[1] < 0)
                xy[1] = 0;
            if (cw > w) cw = w;
            if (ch > h) ch = h;
            url += "&cropx=" + xy[0] + "&cropy=" + xy[1] + "&cwidth=" + cw + "&cheight=" + ch;
            needsubmit = true;
            
        }
        var k = ResizeUploaded.attachindex;
        
        if (i>0)
            k = parseInt(usefield.options[i].value);
        if (k == -1)
            k = ResizeUploaded.noattachindex;
            
        if (k < numCols && fields[k].toLowerCase().indexOf('attach')!=0)
        {
            ResizeUploaded.noattachindex = k;
            valuechanged[counter] = true;
            if (retrv(counter,k) == ''|| ctype[k].toLowerCase() == 'u')
            {   
                setv(counter, k, ResizeUploaded.noattachurl);
                holdvalues[counter + "_" + k] = ResizeUploaded.noattachurl;
            }
            else
            {
                if (ctype[k].toLowerCase() == 'a')
                {
                    if (ResizeUploaded.isimg)
                       ele(counter, k).value +=  '\n<img src='+ ResizeUploaded.noattachurl + " >";
                    else 
                       ele(counter, k).value +=  '\n'+ ResizeUploaded.noattachurl ; 
                    holdvalues[counter + "_" + k] = 1;
                    mat[counter][k] = ele(counter, k).value;
                }
                else
                {
                    ele(counter, k).value +=  ' '+ ResizeUploaded.noattachurl;
                    holdvalues[counter + "_" + k] = ele(counter, k).value;
                }
            }   
        }
        else
        {
            if (typeof(showattachment)!='undefined')
              showattachment(ele(counter, k).value);
        }
        
       // if (rdapname.indexOf( 'lecture') < 0)
        {
            valuechanged[counter] = true;
            window.onbeforeunload = beforeclose;
            ResizeUploaded.alluploaded +=  ResizeUploaded.filename + '@' + ResizeUploaded.pathcode + ','; 
        }
        
    }
    else
    {
        if (ResizeUploaded.attachindex!=-1) 
        {
            var za = ele(counter,ResizeUploaded.attachindex);
            za.value = ResizeUploaded.oldattachvalue;
            if (typeof(showattachment)!='undefined')
                showattachment(za.value);
        }
    }
    
    
    if (needsubmit) 
    {
       if (bw!=null) url += "&whiteblack=" + bw;
      
       savedredourl = url;
       window.open(url, "w" + tstmp);
    }
    var dourl =  (usefield!=null && i == usefield.options.length-1);
    closeprompt();
    if (dourl)
        myprompt(ResizeUploaded.noattachurl);
    b = document.getElementById("dragcropbox");
    if ( b!= null) 
        document.body.removeChild(b);
     if (!needsubmit && ResizeUploaded.dosplitnow) 
     {
        ResizeUploaded.cutoff() 
     }
 },
 
rotateonly : function (edt,z,fn)
{
    var url = "UploadChangePic?pathcode=" + z + "&rdap=" + rdapname + "&tcode=" + fn.replace(/^[^@]+@/,"");
    url += "&rwidth=-1&rheight=" + edt.value;
    savedredourl = url;
    window.open(url, "w" + tstmp);
},  


 
resizeonly : function (sel  )
{
   
    var box = document.getElementById("dragcropbox");
     
    if (sel.selectedIndex < 0)
        return;

    var p = parseInt(sel.options[sel.selectedIndex].text.replace(/%/, ''));
    var pic = document.getElementById('imgwork');
    if (ResizeUploaded.picwidth == 0 || ResizeUploaded.picheight == 0) 
    {
        ResizeUploaded.picwidth = pic.width;
        ResizeUploaded.picheight = pic.height;
    }
    var w = Math.round(p * ResizeUploaded.picwidth / 100);
    var h = Math.round(p * ResizeUploaded.picheight / 100);
    
    pic.style.width = w + 'px';
    pic.width = w;
    pic.style.height = h + 'px';
    pic.height = h;
    
    var w0 = document.getElementById("uploadinstru").offsetWidth;
    setRoundedSize(promptwin, (w0>w?w0:w), h+40)  ;
    ResizeUploaded.uploadedresized = (p!=100);
     
},

cropshow : function (sel)
{
    var box = document.getElementById("dragcropbox");
    if (box != null)
        document.body.removeChild(box);
    var k = -1;
    if (sel!=null && sel.tagName.toUpperCase() == 'SELECT') 
        k = parseInt(sel.options[sel.selectedIndex].value);
    var w = 100, h =100;
    if (k > -1)
    {
        w = parseInt('' + fsize[k]);
        if (''+w == 'NaN') w = 100;
        if (ffsize[k] == null || ffsize[k] == '' || isNaN(ffsize[k]))
        {
            h = w;
        }
        else
        {
            h = parseInt('' + ffsize[k]);
        }
    }
    else
    {
       var pic = document.getElementById('imgwork');
       if (pic!=null && pic.width >0 && pic.height > 0)
       {   
           w = Math.round(pic.width * 0.7);
           h = Math.round(pic.height * 0.7);
       } 
    }
     
    if (k>=0 && k < numCols)
    {
        var usefield = document.getElementById("usefield");
        if (usefield!=null)
        {
            for (var i=0; i < usefield.options.length; i++)
            if (usefield.options[i].value == k)
            {
                usefield.selectedIndex = i;
                break;
            } 
        }
    }
    ResizeUploaded.showframe(w, h  );
},
showframe : function(w, h )
{
    
    var pic = document.getElementById('imgwork');
    var xy = findPositionnoScrolling(pic);
    if (1==2 && (h > pic.offsetHeight && pic.offsetHeight > 0 || w > pic.offsetWidth && pic.offsetWidth>0 ))
    {
        var ro = (h / pic.offsetHeight);
        if (ro < w / pic.offsetWidth)
            ro = w / pic.offsetWidth;
        var ww = Math.ceil(ro * pic.offsetWidth + 2);
        var hh = Math.ceil(ro * pic.offsetHeight + 2);
        pic.height = hh;
        pic.width = ww;
        pic.style.height = hh + 'px';
        pic.style.width = ww + 'px';
       
    }
    var z = 21;
    if (typeof (promptwin.style.zIndex) != 'undefined')
        z = promptwin.style.zIndex;
    if (typeof (pic.style.zIndex) != 'undefined' && z < pic.style.zIndex)
        z = pic.style.zIndex;

    var box = document.createElement("div");
    box.id = "dragcropbox";
    box.style.cssText = "position:absolute;left:" + xy[0] + "px;top:" + xy[1]
            + "px;z-index:" + (z + 1) + ";background-color:transparent;border:1px #909090 broken;align:center;vertial-align:middle";
    box.innerHTML = round1('100%') + "<div id=dummycenter style=\"background-color:#eee;opacity:0.3;width:" + w + "px;height:" + h + "px;border-radius:3px\"></div>" + round2  ;
    document.body.appendChild(box);
    box.getElementsByTagName('table')[0].cellPadding='0';
    box.getElementsByTagName('table')[0].cellSpacing='0';
    box.getElementsByTagName('table')[0].rows[2].cells[2].innerHTML = "<div><img src=image/diskbg.png></div>"
    new ResizeRounded(box,ResizeUploaded.resizeblank);
    Drag.init(box.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('div')[0], box);
},
 
moveTo :function(r)
{
    var box = document.getElementById("dragcropbox");
    var pic = document.getElementById("imgwork");
    var dox = document.getElementById("dummycenter");
    var w0 = dox.offsetWidth;
    var h0 = dox.offsetHeigh;
    if (w0 > r[2])
    {
        dox.style.width = ( r[2]) + 'px';
        dox.parentNode.width = r[2];
        dox.parentNode.parentNode.parentNode.width = ( r[2]+24);
        box.style.width = ( r[2]+24) + 'px'; 
    }
    else
    {
        box.style.width = ( r[2]+24) + 'px'; 
        dox.parentNode.parentNode.parentNode.width = ( r[2]+24);
        dox.parentNode.width = r[2];
        dox.style.width = ( r[2]) + 'px';
    }
    if (h0 > r[3])
    {
        dox.style.height = ( r[3]) + 'px';
        dox.parentNode.parentNode.height = r[3];
       
        box.style.height = ( r[3]+24) + 'px'; 
    }
    else
    {
        box.style.height = ( r[3]+24) + 'px'; 
        dox.parentNode.parentNode.height = ( r[3]);
        dox.style.height = ( r[3]) + 'px';
    }
     
    var xy = findPositionnoScrolling(pic);
    box.style.left = (xy[0] + r[0]) + 'px';
    box.style.top = (xy[1] + r[1]) + 'px';
    
},

resizeblank : function(td, dx, dy)
{
    var b = document.getElementById('dummycenter');
    var d = document.getElementById('dragcropbox');
    if (dx > 0)
    {
        d.style.width = (d.offsetWidth + dx) + 'px';
        b.style.width = (b.offsetWidth + dx) + 'px';
    }
    else
    {
        b.style.width = (b.offsetWidth + dx) + 'px';
        d.style.width = (d.offsetWidth + dx) + 'px';
    }
    
    if (dy > 0)
    {
        d.style.height = (d.offsetHeight + dy) + 'px';
        b.style.height = (b.offsetHeight + dy) + 'px';
    }
    else
    {
        b.style.height = (b.offsetHeight + dy) + 'px';
        d.style.height = (d.offsetHeight + dy) + 'px';
    }
    
},

updatepic : function()
{
    var pic = document.getElementById('imgwork');
    if (pic!=null)
    {
        var s = pic.src;
        pic.src = s;
    }
},

setattachref : function(x)
{
   if( x != ResizeUploaded.attachref)
   ResizeUploaded.attachref = x;
},
getattachref : function ()
{
   return ResizeUploaded.attachref;
},

setfiletobedel : function (filename)
{
    ResizeUploaded.filetobedeleted = filename;
},
updateattch : function ()
{
   if ( ResizeUploaded.filetobedeleted ==null) return;
  
   if (ResizeUploaded.attachref != null )
   {
      var x = ResizeUploaded.unzip(ResizeUploaded.attachref.value);
      if (x.indexOf('@')<0) x = '';
      var x0 = ResizeUploaded.attachref.value;
      var j = x.indexOf(ResizeUploaded.filetobedeleted + ",");
      var k = ResizeUploaded.filetobedeleted.length + 1;
      if (ResizeUploaded.attachref.value.replace(/[^,]/g,'').length < 2 && k>1)
      {
          ResizeUploaded.attachref.value = ''; 
      }
      else
      {
          if (j> 0)
              x = x.substring(0,j) + x.substring(j+k);
          else if(j == 0)
              x = x.substring(k);
         if (ResizeUploaded.ifdelfilealso) 
         {
              var y = '@' + ResizeUploaded.filetobedeleted.replace(/@.*/,'') + "@";
              var z = '', j =0, k =0;
              while ( (k = x.indexOf(y)) > 0)
              {
                  x = x.substring(0,k)  + ( k+y.length < x.length? x.substring(k+y.length) : '');
              }
              x = x.replace(/,[0-9|_]+,/g,',').replace(/^[0-9|_]+,$/g,',');
          }
          ResizeUploaded.ifdelfilealso = false;
          ResizeUploaded.attachref.value = ResizeUploaded.zip(x);
      }
      if (typeof(valuechanged) != 'undefined')
          valuechanged[counter] = true;
     }   
      x = ResizeUploaded.alluploaded;
      var j = x.indexOf(ResizeUploaded.filetobedeleted + ",");
      var k = ResizeUploaded.filetobedeleted.length + 1;
      if (j> 0)
          x = x.substring(0,j) + x.substring(j+k);
      else if (j == 0)
          x = x.substring(k);
      ResizeUploaded.alluploaded = x;
      x = ResizeUploaded.tempvalue;
      var j = x.indexOf(ResizeUploaded.filetobedeleted + ",");
      var k = ResizeUploaded.filetobedeleted.length + 1;
      if (j> 0)
          x = x.substring(0,j) + x.substring(j+k);
      else if(j == 0)
          x = x.substring(k);
      ResizeUploaded.tempvalue = x;
      ResizeUploaded.filetobedeleted = null;
},

openmid : function(url,x,y)
{
  if (x==null) x= '300';
  else
  x = Math.round(x);
  if (y == null) 
      y = '300';
  else
      y = Math.round(y);
  myprompt('<iframe src="' + url + '" width=' + x + " height=" + y + " />");
  //window.open(url,'winname', 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width='+x +',height=' +y +',top=' +(screen.height-y)/2+',left=' + (screen.width-x)/2);
  
},

refreshatt : function()
{
    closeprompt();
    ResizeUploaded.updateattch();
    ResizeUploaded.attachman(ResizeUploaded.attachref);
},
ifdelfilealso : false,
 
deleteAttachedFile : function (file)
{
   
   var xs = file.split(/@/);
   ResizeUploaded.setfiletobedel(file);
   
   if (xs[2] ==null ||  xs[2].length < 2 || xs[1] == null || xs[1].replace(/[0-9]/g,'')!='')
   {
       syn('del','');
   }
   else
   {
       ResizeUploaded.ifdelfilealso = false;
       ResizeUploaded.savedfiletodelete ="UploadChangePic?pathcode=" + xs[2] + '&tcode=' + xs[1];
       var mm = textmsg[809] + "?";
       if (xs[0].toLowerCase().indexOf('.jpg') >0 || xs[0].toLowerCase().indexOf('.png') >0 || xs[0].toLowerCase().indexOf('.gif') >0  || xs[0].toLowerCase().indexOf('.pdf') >0)
       {
           mm += "<br><input type=checkbox name=ifdeletefile style=cursor:pointer  onclick=\"ResizeUploaded.ifdelfilealso=this.checked\">" + textmsg[1601];
       }
       myprompt(mm,null,"ResizeUploaded.delgoahead(v)");
   }
       
},
showback : function()
{
    ResizeUploaded.attachman(ResizeUploaded.attachref);
},
delgoahead : function(v)
{
   if (v == false) 
       ResizeUploaded.showback();
   else
   {
       savedredourl = ResizeUploaded.savedfiletodelete;
       nav1 = window.open(ResizeUploaded.savedfiletodelete,'w' + tstmp);
   }
},
openAttachedFile : function(codepath, filename)
{
   if (codepath == null) return;
   var fn= filename.toLowerCase();
   var dd = (fn.indexOf('.gif')>=0 || fn.indexOf('.jpg')>=0 || fn.indexOf('.jpeg')>=0 || fn.indexOf('.png')>=0);
    if(dd == false)
    {
        var fsnd1 = document.getElementById("openfileform_id");
        if (fsnd1 == null)
        {
            fsnd1 = document.createElement("form");
            fsnd1.name = "openfileform";
            fsnd1.id = "openfileform_id";
            if (codepath.indexOf('http://') == 0 || codepath.indexOf('https://') == 0)
                formnewaction(fsnd1, codepath);
            else
                formnewaction(fsnd1, "FileOperation");
            fsnd1.method = 'post';
            fsnd1.target = "_blank" ;
            fsnd1.innerHTML = "<input type=hidden name=did><input type=hidden name=operation value=open>";
            document.body.appendChild(fsnd1);
        }
        fsnd1.did.value = codepath;
        formnewaction(fsnd1);
       visual(fsnd1);
 fsnd1.submit();
    }
    else 
    {
         var showarea =  document.getElementById('codeshow');
         showarea.style.padding = "0px 0px 0px 0px";
         showarea.innerHTML = "<img src=" + ResizeUploaded.goodopenurl(codepath,false) + " style=\"margin:0px 0px 0px 0px\" onload=\"ResizeUploaded.fitting(this)\">";
         var tbl = document.getElementById('attachaction');
        
         for (var k=1; k <= 4; k++)
         tbl.rows[0].cells[k].width = ResizeUploaded.butwidth + 'px';
         tbl.rows[0].cells[0].width = '120px';
         //openpicorfile(codedpath}, filename);
     }
},
tobewritten:'',
fitting: function(im)
{
    if (promptwin.offsetWidth < im.width + 10)
       promptwin.style.width = (im.width + 10) + 'px'; 
},
gettobewritten : function()
{
   return ResizeUploaded.tobewritten; 
   
}, 
folder0:null,
sort:function(files, timest, urls, codedpath)
{
   var a = [];
   for (var j=0; j < files.length; j++)
   {
       if (!isNaN(timest[j]) && urls[j] == null && codedpath[j] !=null && codedpath[j].length>14)
       {
           a[a.length] = [files[j], timest[j], codedpath[j]];
           for (var k=0; k < files.length; k++)
           {
               if (timest[k] == files[j] && !isNaN(files[k]) &&codedpath[k]!=null &&  !isNaN(codedpath[k].replace(/_/,'')) )
                   a[a.length] = [files[k], timest[k], codedpath[k]];
           }
       }
   }
   for (var j=0; j < files.length; j++)
   {
       if ( timest[j] == null && urls[j] != null && codedpath[j] ==null )
       {
           a[a.length] = [files[j],null, urls[j]];
           for (var k=0; k < files.length; k++)
           {
               if (timest[k] == files[j] && !isNaN(files[k]) && codedpath[k]!=null && !isNaN(codedpath[k].replace(/_/,'')) )
                   a[a.length] = [files[k], timest[k], codedpath[k]];
           }
       }
   }
   for (var i=0; i < a.length; i++)
   {
       files[i] = a[i][0];
       timest[i] = a[i][1];
       codedpath[i] = a[i][2];
   }
},
attachman : function(attach_h, viewonly)
{
   if (ResizeUploaded.folder0!=null) 
   {
       if (ResizeUploaded.folder0!='/')
       {
           ResizeUploaded.initfolder = ResizeUploaded.folder0;
           ResizeUploaded.folder0 = null;
           ResizeUploaded.selicon();
       }
       ResizeUploaded.folder0 = null;
       return;
   }
   if (attach_h == null || attach_h.value=='attach') 
   {
      if (typeof(f1) !=' undefined' && typeof(f1.Attachment)!='undefined')
          attach_h = f1.Attachment;
      else
          attach_h = null;
   } 
    
    
   ResizeUploaded.setattachref(attach_h);

   var dbgcolor = "lightyellow", ibgcolor="teal", bbgcolor = "grey", tbgcolor="white";
   if (typeof(DBGCOLOR) != "undefined")
      dbgcolor = DBGCOLOR;
   if (typeof(IBGCOLOR) != "undefined")
      ibgcolor = IBGCOLOR;
   if (typeof(BBGCOLOR) != "undefined")
      bbgcolor = BBGCOLOR;
   if (typeof(TBGCOLOR) != "undefined")
      tbgcolor = TBGCOLOR;
    
   var encoding1 = "utf-8";
   if (typeof(encoding) != "undefined")
       encoding1 = encoding;
    
   var selectedfiles = "";

   
    
   var ss = "<center>";
   if (ResizeUploaded.initfolder!=null)
          ss += "<a href=\"javascript:ResizeUploaded.selicon()\">" +  textmsg[675] + "</a>&nbsp;&nbsp;&nbsp;";        
   ss += "<a href=\""   + "javascript:ResizeUploaded.asraw()\">" +   textmsg[1614].replace(/[^:]+:/,'') +" </a>&nbsp;&nbsp;&nbsp;<a href=javascript:ResizeUploaded.showwfhint()><!--[?]--></a></center>";
   var nav = null;
   var allentries = '';
   if (attach_h !=null)
       allentries = attach_h.value;
   else
       allentries = ResizeUploaded.tempvalue;
   allentries = ResizeUploaded.unzip(allentries); 
   var hasframe = false; 
   if (hasframe)
   {
       ss +=(unititle(textmsg[787],"outset2"));
       if (allentries.replace(/ /g,'').length < 2)
       {
          ss +=  textmsg[89]  ;
          ResizeUploaded.tobewritten = ss;
          
          fsnd.target = upperrightwin.name;
          formnewaction(fsnd, 'blank.jsp');
         visual(fsnd);
         fsnd.submit();
          if (typeof(showattachment)!='undefined')
                showattachment(allentries);
          return;
       }
   }
   else if (allentries.replace(/ /g,'').length < 2)
   {
       var ss = "<center>";
       if (ResizeUploaded.initfolder!=null)
          ss += "<a href=\"javascript:ResizeUploaded.selicon()\">" +  textmsg[675] + "</a>&nbsp;&nbsp;&nbsp;";
       ss += "<a href=\"javascript:ResizeUploaded.asraw()\">" +   textmsg[1614].replace(/[^:]+:/,'') +" </a>&nbsp;&nbsp;&nbsp;<a href=javascript:ResizeUploaded.showwfhint()><!--[?]--></a></center>" + textmsg[89] + "<div id=codeshow></div>"
       myprompt(ss,null,null,textmsg[787]  );
       if (typeof(showattachment)!='undefined')
                showattachment('');
       return;
   }
   
   var fparse = new CSVParse(allentries.replace(/,$/,''),"'","@", ",").nextMatrix();
   var files = new Array();
   var timest = new Array();
   var urls = new Array();  
   var codedpath = new Array();
   for (var i=0; i < fparse.length; i++)
   {
       files[i] = fparse[i][0];
       if (fparse[i].length==2)
       {
           urls[i] = fparse[i][1];
       }
       else 
       {
           timest[i] = fparse[i][1];
           codedpath[i] = fparse[i][2];
       }
   }
   ResizeUploaded.sort(files, timest, urls, codedpath);
   var maxcols = 3; 
   var wt = 150 + 4*ResizeUploaded.butwidth;
   ss = "";   
   if (ResizeUploaded.initfolder!=null)
       ss += "<a href=\"javascript:ResizeUploaded.selicon()\">" +  textmsg[675] + "</a>&nbsp;&nbsp;&nbsp;";     
   
   if (typeof(haswebfolder)!='undefined' && haswebfolder || typeof(allShapes)!= 'undefined')
   {
       ss += "<a href=\"javascript:ResizeUploaded.asraw()\">" +   textmsg[1614].replace(/[^:]+:/,'') +" </a>&nbsp;&nbsp;&nbsp;<a href=javascript:ResizeUploaded.showwfhint()><!--[?]--></a>"; 
   }
   ss += "<form rel=opener name=form1 style=\margin:0px 0px 0px 0px\"  ><table id=\"attachaction\" cellpadding=3 cellspacing=1  border=0 class=outset1 style=\"border:0px #b0b0b0 outset;border-radius:3px;margin:3px 3px 3px 3px\" align=center  >";
   
   var maps = new Array();
   
   for (i =0; i < files.length; i++)
   {
      if (files[i]==null||files[i]==''||codedpath[i] ==null) continue;
      if (isNaN(files[i]) == false && codedpath[i].replace(/[0-9]/g,"")=="___")
      {
         
          ss +=  "<tr><td  style=\"border:1px #c0c0c0 solid;\"><nobr><a href=\"javascript:";
          ss +=   "ResizeUploaded.openImagelet('" + timest[i]+ "','" +  codedpath[i] + "')\">" + textmsg[1303] + files[i] + "</a></nobr></td>";
          ss+= "<td   class=GreenButton style=\"width:" + ResizeUploaded.butwidth + "px !important;border-radius:3px\" align=center   onclick=\"";
          ss += "ResizeUploaded.infoImage('" +   timest[i] +  "','" +  codedpath[i] +  "')\"><nobr>" +  textmsg[1605] +"</nobr></td>";
          var bb = true;//typeof(issubmit)!='undefined' && issubmit == true ||  rdapname.indexOf(  'grading') >=0 || rdapname == 'assignedit' || rdapname.toLowerCase().indexOf("message") >= 0;
          
          ss+= "<td   class=GreenButton style=\"width:" + ResizeUploaded.butwidth + "px !important;border-radius:3px\" align=center   onclick=\"";
          ss += "ResizeUploaded.insertImagelet('" +   files[i] +  "')\"><nobr>" +  textmsg[1604] +"</nobr></td>";
          ss+= "<td   class=OrangeButton style=\"width:" + ResizeUploaded.butwidth + "px !important;border-radius:3px\" align=center   onclick=\"";
          ss += "ResizeUploaded.cutoff('" +  maps[timest[i]] +  "','" +   timest[i] +  "','" +  codedpath[i] +  "'," + files[i] + ")\"><nobr>" +  textmsg[1603] +"</nobr></td>";
          ss+= "<td   class=RedButton style=\"width:" + ResizeUploaded.butwidth + "px !important;border-radius:3px\" align=center   onclick=\"";
          ss += "ResizeUploaded.deleteImagelet('" + files[i] + '@'+timest[i]  + "')\"><nobr>" +  textmsg[69] +"</nobr></td>";
          ss += "<td></td></tr>";
      }
      else  
      {
          ss += "<TR ><td  style=\"border:1px #c0c0c0 solid;\"><nobr><a href=\"javascript:";
          ss +=   "ResizeUploaded.openAttachedFile('" + codedpath[i] + "','" + files[i] + "')\">" + files[i] + "</a></nobr></td>";
          ss+= "<td    class=GreenButton style=\"width:" + ResizeUploaded.butwidth + "px !important;border-radius:3px\" align=center   onclick=\"";
          ss += "ResizeUploaded.urlAttachedFile('" + codedpath[i] +  "')\"><nobr>" +  textmsg[546] +"</nobr></td>";
          var bb = true;//typeof(issubmit)!='undefined' && issubmit == true ||  rdapname.indexOf(  'grading') >=0 || rdapname == 'assignedit' || rdapname.toLowerCase().indexOf("message") >= 0;

          
          var jj = files[i].lastIndexOf(".");
          var fen = files[i].substring(jj + 1).toLowerCase();
           
          if (fen == 'jpg' || fen == 'jpeg' || fen == 'gif' || fen == 'png') 
          {
             maxcols = 5;
             if (timest[i]!=null ){
             if (allentries.indexOf("@" + files[i] + "@")<0)
             {
             ss += "<td style=\"width:" + ResizeUploaded.butwidth + "px !important;border-radius:3px\" class=OrangeButton  align=center   onclick=\"";
             ss +=   "ResizeUploaded.uploaded('web/" + codedpath[i] + "','" + files[i] + '@' + timest[i] + "')\"><nobr>" +  textmsg[1294] +"</nobr></td>";
             }
             else 
             {
             ss += "<td style=\"width:" + ResizeUploaded.butwidth + "px !important;border-radius:3px\" class=OrangeButton  align=center   onclick=\"";
             ss +=   "ResizeUploaded.uploaded('web/" + codedpath[i] + "','" + files[i] + '@' + timest[i] + "')\"><nobr>" +  textmsg[1294] +"</nobr></td>";
             }}
             else ss += "<td></td>";
         ////  ss += "<td width=" +  Math.round(4.5*font_size) +" class=OrangeButton style=\"width:70px\" align=center   onclick=\"";
           //  ss +=    "ResizeUploaded.codeAttachedFile('"  + codedpath[i] + "')\"><nobr>" +  textmsg[1303] +"</nobr></td>";
            ss += "<td style=\"width:" + ResizeUploaded.butwidth + "px !important;border-radius:3px\"  class=OrangeButton   align=center   onclick=\"";
            ss +=    "ResizeUploaded.cutoff('" + codedpath[i] + "','" + files[i]+ "')\"><nobr>" +  textmsg[1303] +"</nobr></td>"; 
            maps[files[i]] = codedpath[i];
          }
          else
          {
              if (typeof(DBGCOLOR) == 'undefined') DBGCOLOR = "white";
              ss += "<td colspan=2 style=background-color:" + DBGCOLOR +"></td>"; 
          }
          if (timest[i]!=null)
          {
              ss+= "<td style=\"width:" + ResizeUploaded.butwidth + "px !important;border-radius:3px\"   class=RedButton   align=center   onclick=\"";
              ss +=   "ResizeUploaded.deleteAttachedFile('" + files[i] + '@'+timest[i]  +'@' + codedpath[i] +  "')\"><nobr>" +  textmsg[69] +"</nobr></td>";
          }
          else
          {
              ss+= "<td style=\"width:" + ResizeUploaded.butwidth + "px !important;border-radius:3px\"   class=RedButton   align=center   onclick=\"";
              ss +=   "ResizeUploaded.deleteAttachedFile('" + files[i] + '@' + codedpath[i] +  "')\"><nobr>" +  textmsg[69] +"</nobr></td>";
         
          }
          ss += "<td></td></tr>" ;
      }
   }
  ss += ("<tr><td colspan=" + (maxcols+1) + " id=codeshow><br></td></tr></table></form>"  );
  
   
  {
      myprompt(ss,null,null,   textmsg[787]  );
      if (promptwin!=null)  
      {
          var zz = promptwin.getElementsByTagName('table')[0];
          if (zz!=null && zz.rows.length > 1)
          {
              zz = zz.rows[1].cells[1].getElementsByTagName('table')[0];
              if (zz.rows!=null && zz.rows.length > 1)
              {
                  zz.rows[1].cells[0].style.padding = "0px 0px 0px 0px";
              }
          }
          
      }
  }
   ResizeUploaded.xnow = parseInt(promptwin.style.left.replace(/px/,''));
   ResizeUploaded.ynow = parseInt(promptwin.style.top.replace(/px/,''));
   ResizeUploaded.widthnow = document.body.scrollWidth;
   ResizeUploaded.heightnow = document.body.scrollHeight;
   
},
showwfhint : function ()
{
    document.getElementById('codeshow').innerHTML = textmsg[1667];
},
updatecell:function()
{
    var p = new CSVParse(ResizeUploaded.unzip(ResizeUploaded.attachref.value).replace(/,$/,''), '\'', '@',',');
    var y = p.nextMatrix(true);
    var tbl = document.getElementById('celledit');
    for (var i=0; i < tbl.rows.length; i++)
    {    
        var bb = (document.getElementById('CE' + i + '_2')!=null);
    for (var j=0; j < (bb?3:2); j++)
    {  
       if (bb)
       {
           var ij = document.getElementById('CE' + i + '_' + j);
           if (ij != null) 
           {
               if (i >= y.length)
                  y[i] = ['','',''];
               y[i][j] = ij.value.replace(/ /g,'');
               if (j==2) 
                   y[i][j] = y[i][j].replace(/@/g, escape('@')).replace(/,/g, escape(','));
                
           }
       }
       else
       {
           var ij = document.getElementById('CE' + i + '_' + j);
           if (ij != null && ij.value!='') 
           {
               if (i >= y.length)
                  y[i] = ['',''];
               y[i][j] = ij.value.replace(/ /g,'');
           }
       }
    }
}
    var z = '';
    for (i=0; i < y.length; i++)
    {
        if (y[i].length==3) 
        for (var j=0; j < 3; j++)
        {
            if (y[i][0].replace(/ /g,'')=='' || y[i][1].replace(/ /g,'')==''|| y[i][2]=='')continue;
            if (y[i][2].length>18 && isNaN(y[i][1]) && y[i][2].replace(/[0-9]/g,'')!="___")
                y[i][1] = parseTime(y[i][1]);
            z +=   y[i][j] + "@";
        }
        else
        for (var j=0; j < 2; j++)
        {
            if (y[i][0]=='' || y[i][1]=='')continue;
            z += (j==0?'':"'") +  y[i][j] + (j==0?'':"'") + "@";
        }    
        z = z.replace(/@$/,','); 
    }
    ResizeUploaded.attachref.value = ResizeUploaded.zip(z);
    valuechanged[counter] = true;
    if (ResizeUploaded.attachindex == null ||ResizeUploaded.attachindex == -1)
    {
        var j3= 0;
        for (; j3 < numCols ; j3++)
            if (fields[j3].toLowerCase().indexOf('attach') == 0 )
                break;
        if (j3 < numCols)ResizeUploaded.attachindex = j3;
        else ResizeUploaded.attachindex = -1;
    }
    if (ResizeUploaded.attachindex>-1)
    {
        holdvalues[counter + '_' + ResizeUploaded.attachindex] = ResizeUploaded.attachref.value;
    }
    if (typeof(showattachment)!='undefined') showattachment(ResizeUploaded.attachref.value);
},
dontdel:'',
asraw : function()
{
    var ck = localStorage['fileurlbuf'];
    localStorage.removeItem('fileurlbuf');
    var hasone = false;
    if (ck == null || ck == 'null') 
        ck = '';
    else
        ResizeUploaded.dontdel += ck;
    ck = ck + ResizeUploaded.unzip(ResizeUploaded.attachref.value);
    var p = new CSVParse(ck.replace(/,$/,''), '\'', '@',',');
    var y = p.nextMatrix(true); 
    if (ck == '') 
    {
        y[0] = ['','','']; 
        y[1] = ['',''];
    }
    else 
    {
        y[y.length] = ['',''];
    }
    var z  = "<table id=celledit border=1 style=border-collapse:collapse style=\"border:1px #dddddd solid;background-color:white\">";
    var sizes = [16,16,50];
    var xs = textmsg[1850].split(/@/);
   // z += "<tr  bgcolor=lightblue><td align=left>" + xs[0] + "</td><td>"+ xs[1] +"</td><td>"+ xs[2] +"</td></tr>";
    for (var i=0; i < y.length  ; i++)
    {
        z += "<tr>";
        if (y[i].length==3)
        for (var j=0; j < 3; j++)
        {
            if (y[i][j] == null) y[i][j] = '';
            var len = 20; if (y[i][j]!=null) len = y[i][j].length;
            if (len < sizes[j]) len = sizes[j];
            if (len > sizes[j] + 2) len = sizes[j] + 2; 
            len = Math.round(7.5*len);
            
            z += "<td align=left   style=\"background-color:white;font-size:" + font_size + "px;\"><input id=CE" + i + '_' + j + " value=\"" + y[i][j] + "\" style=\"background-color:white;color:black;border:0px;width:" + len+ "px;font-size:" + font_size + "px\"></td>";
        }
        else
        for (var j=0; j < 2; j++)
        {
            if (y[i][j] == null) y[i][j] = '';
            var len = 20; if (y[i][j]!=null) len = y[i][j].length;
            if (len < sizes[j]) len = sizes[j];
            if (len > sizes[j] + 2) len = sizes[j] + 2; 
            if (y[i][1]=='') y[i][1] = "http...";
            z += "<td align=left colspan=" + (j==0?"1":"2") + "  style=\"background-color:white;font-size:" + font_size + "px;\"><input id=CE" + i + '_' + j + " value=\"" + y[i][j] + "\" style=\"background-color:white;color:" +(y[i][1]==''?'black':'grey') + ";border:0px;width:100%;font-size:" + font_size + "px\" " + (j==0?"":" onchange=ResizeUploaded.fillfilename(this," + i +")  ") + "></td>";
        }    
        z += "</tr>";
    }
    
    z += "</table><br><center><input type=button style=\"background:url(image/addopt.png);width:18px;height:18px;background-position:-2px -2px;cursor:pointer\" onclick=\"ResizeUploaded.updatecell();ResizeUploaded.asraw()\">&nbsp;&nbsp;<input name=send type=button value=\"" + textmsg[225] + "\" class=OrangeButton style=width:" + Math.round(4.5*font_size) + "px onclick=\"ResizeUploaded.updatecell();ResizeUploaded.attachman(ResizeUploaded.attachref)\"><input name=cancel  value=\"" + textmsg[18] + "\" type=button class=GreenButton style=width:" + Math.round(4.5*font_size) + "px onclick=closeprompt()></center>";
    
    var ss = '<center>';
    if (ResizeUploaded.initfolder!=null)
          ss += "<a href=\"javascript:ResizeUploaded.selicon()\">" +  textmsg[675] + "</a>&nbsp;&nbsp;&nbsp;"; 
    ss += '<a href="javascript:ResizeUploaded.attachman(ResizeUploaded.attachref)">' 
     + textmsg[1614].replace(/:.*/,'') + '</a></center>' + z;
    myprompt(ss,null,null,textmsg[787] );
},
fillfilename:function(tb,i)
{
    var j = tb.value.lastIndexOf('/');
    if (j==-1) return;
    var t1 = document.getElementById( "CE" + i + '_0');
    if (t1.value=='')  
    {
       var fn = tb.value.substring(j+1);
       if (fn.length>16) fn = fn.substring(fn.length-16);
       t1.value = fn;
    }
},
initfolder: null,
iframewin:null,
getIFrameSelected:function()
{
    var s = ResizeUploaded.iframewin.selected();
    ResizeUploaded.attachref.value = ResizeUploaded.zip(ResizeUploaded.unzip(ResizeUploaded.attachref.value)+ s);
},
selicon: function()
{
    if (ResizeUploaded.initfolder!=null)
    myprompt(
     ""//<center><input name=send type=button value=\"" + textmsg[1600] + "\" class=OrangeButton style=width:" + Math.round(4.5*font_size) + "px onclick=\"ResizeUploaded.getIFrameSelected();ResizeUploaded.attachman(ResizeUploaded.attachref)\"><input name=cancel  value=\"" + textmsg[18] + "\" type=button class=GreenButton style=width:" + Math.round(4.5*font_size) + "px onclick=closeprompt()></center><br>" 
   + "<iframe style=border:0px id=filebrowse src=Thumbs?folder=" + ResizeUploaded.initfolder + " width=450 height=550 />",null,null,ResizeUploaded.initfolder); 
},
addAnentry : function(fn, tm, code)
{
    var x = ResizeUploaded.unzip(ResizeUploaded.attachref.value);
    if (x.indexOf(code) < 0)
    {
        x += fn + '@' + tm + '@' + code + ',';
    }
    ResizeUploaded.attachref.value = ResizeUploaded.zip(x);
    if (typeof(showattachment)!='undefined')  showattachment(x);
},
deleteByCode : function(c)
{
    var x = ResizeUploaded.unzip(ResizeUploaded.attachref.value).replace(/,$/,'');
    var y = (new CSVParse(x,'\'',"@", ",")).nextMatrix();
    var str = '';
    for (var i=0; i < y.length; i++)
    {
        if (y[i][2]!=c)
            str += y[i][0] + '@' + y[i][1] + '@' + y[i][2] + ',';
    }
    ResizeUploaded.attachref.value = ResizeUploaded.zip(str);
    if (typeof(showattachment)!='undefined')  showattachment(str);
}, 
deleteFiles: function(folder, selstr)
{
    postopen('FileOperation',['folder','filedir', 'operation'], [folder, selstr, 'delete'], 'w' + tstmp);
},
deleteImagelet : function(filename)
{
    var y = ',' + ResizeUploaded.unzip(ResizeUploaded.attachref.value); 
    var v0 = y;
    var k = y.indexOf(','+filename + '@');
    if (k < 0) return;
    y = y.substring(0,k) + y.substring(k + filename.length + 2).replace(/[^,]+/,'');
    
    ResizeUploaded.attachref.value = ResizeUploaded.zip(y.replace(/^,/,''));
    ResizeUploaded.attachman(ResizeUploaded.attachref);
},
insertImagelet : function(j)
{
    var sa = document.getElementById("codeshow");
    var ss = textmsg[311].replace(new RegExp("("+textmsg[1303]+ ")","ig"),"$1" + j) ;
    var dic = textmsg[1613].split(/@/);
    if (associatedtxt == null) associatedtxt = textareatobesearch;
    if ( associatedtxt != null && typeof(caretPos)!='undefined') 
    {
        ResizeUploaded.oldonclick = associatedtxt.onclick;
        associatedtxt.onclick = function()
        {
            ResizeUploaded.caretpos = caretPos(associatedtxt);
            
            if (ResizeUploaded.oldonclick!=null) 
                ResizeUploaded.oldonclick();
        }
        ss += ",<br>" + textmsg[312];
        for (var k=0; k < 3; k++)
           ss += " <a href=\"javascript:ResizeUploaded.goinsert(" + j + "," + k  + ")\">" + dic[k] + "</a> ";
    }
    
    sa.innerHTML = ss  ;
},
oldonclick : null,
caretpos:0, 
goinsert : function(n,k)
{
     
    var j = ResizeUploaded.caretpos;
    
    if ( associatedtxt == null || (ResizeUploaded.caretpos = j = caretPos(associatedtxt)) == 0)
    { 
        var sa = document.getElementById('codeshow');
        if (sa!=null)
        sa.innerHTML = sa.innerHTML + "<br>" + textmsg[1606];
        return;
    }
     
    var m = '';
    if (k==0) m=':1';else if (k==2) m= ':2'; 
    associatedtxt.value = associatedtxt.value.substring(0,j) + "[" + textmsg[1303] +n + m+ "]" + associatedtxt.value.substring(j); 
    
},
infoImage : function(fn, dim) 
{
     var sa = document.getElementById("codeshow");
     var ds = dim.split(/_/);
     sa.innerHTML = fn  + ", x=" + ds[0] + ", y=" + ds[1] + ", w=" + ds[2] + ", h=" + ds[3]
},
openImagelet : function(filename, dim)
{
    var y = ResizeUploaded.unzip(ResizeUploaded.attachref.value).replace(/,$/,'');
    var mt =  (new CSVParse(y, "'", "@", ",")).nextMatrix(true);
    for (var i=0; i < mt.length; i++)
    {
        if (filename == mt[i][0]) break;
    }
    if (i == mt.length) return;
    var url = ResizeUploaded.goodopenurl( mt[i][2]);
    var sa = document.getElementById("codeshow");
    var ns = dim.split(/_/);
    sa.innerHTML = '<div style="background-image:url('+ url + ');background-position:-' + ns[0] + "px -" + ns[1] + "px;width:" + ns[2] + "px;height:" + ns[3] + 'px" >&nbsp&nbsp;</div>';
},
urlAttachedFile : function(pathcode)
{
    var showarea = document.getElementById('codeshow');
    showarea.style.border = "1px #b0b0b0 outset";
    
    showarea.innerHTML = document.location.toString().replace( /[^\\/]+$/, ResizeUploaded.goodopenurl(pathcode,false ));
},
activetextarea : function(x)
{
    return null;
},
setformat2html : function()
{
    
},
picfilename : null, 
goodposition:function(im)
{
    if (ResizeUploaded.ynow + im.height + 60 > ResizeUploaded.heightnow)
    {
       ResizeUploaded.ynow = ResizeUploaded.heightnow - im.height - 60;
       if (ResizeUploaded.ynow < 0) ResizeUploaded.ynow = 0;
    }
    
    if (ResizeUploaded.xnow + im.width + 5 > ResizeUploaded.widthnow)
    {
       ResizeUploaded.xnow = ResizeUploaded.widthnow - im.width - 5;
       if (ResizeUploaded.xnow < 0) ResizeUploaded.xnow = 0;
    }
    
    promptwin.style.top =  document.body.scrollTop + 'px' ;// ResizeUploaded.ynow +  'px';
    promptwin.style.left = '8px';//ResizeUploaded.xnow +  'px'; 
}, 
cutoff : function(pathcode,fn,dim, num) 
{
    if (pathcode==null)
    {
        pathcode = ResizeUploaded.pathcode.replace(/@.*/,'');
        fn = ResizeUploaded.filename.replace(/@.*/,'');
    }
     
    ResizeUploaded.picfilename = fn; 
     
    var x = textmsg[1602] +  "<input type=button  class=GreenButton style=\"width:" + ResizeUploaded.butwidth + "px;border-radius:3px;cursor:pointer\" value=\"" + textmsg[16] + "\" onclick=\"ResizeUploaded.selectit(" + (num==null?'':num)+ ")\"><div style=display:inline id=selectlet></div>";
    myprompt(x +"<img id=\"imgwork\" src=\"" + ResizeUploaded.goodopenurl(pathcode)  + "\" onload=\"ResizeUploaded.goodposition(this);ResizeUploaded.cropshow(null);" + (dim==null?'':("ResizeUploaded.moveTo(["+dim.replace(/_/g,',')+"]);")) + "\" style=\"margin:0px 0px 0px 0px\" >",
    null, null, (num==null? (textmsg[1600]+ textmsg[1303]) : (textmsg[1603] + " " + textmsg[1303] + num)) );
      
    promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[1].cells[0].getElementsByTagName('div')[0].style.cursor = "pointer";
    promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[1].cells[0].getElementsByTagName('div')[0].style.padding = "0px 0px 0px 0px";
    promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].onclick
    = function()
    {
        var b = document.getElementById("dragcropbox"); 
        if (b!=null) document.body.removeChild(b);
        closeprompt();
    } 
},
 
selectit : function(j)
{
    var pic = document.getElementById('imgwork');
    var XY = findPositionnoScrolling(pic);
    var w = pic.offsetWidth;
    var h = pic.offsetHeight;
    var b = document.getElementById("dummycenter");
    var cw, ch;
    if (b==null) return; 
    if ( b != null)
    {
        cw = b.offsetWidth;
        ch = b.offsetHeight;
         
        var xy = findPositionnoScrolling(b);
        xy[0] -= XY[0];
        xy[1] -= XY[1];
        if (xy[0] < 0)
            xy[0] = 0;
        if (xy[1] < 0)
            xy[1] = 0;
    } 
    var mt = (new CSVParse(ResizeUploaded.attachref.value.replace(/,$/,''),"'","@",",")).nextMatrix();
    if (j == null || j=='' || isNaN(j)) 
    {
        j = 0;
        for (var i=0; i < mt.length; i++)
        {
            if (mt[i].length==3 && !isNaN(mt[i][0]) && mt[i][2].replace(/[0-9]/g,'')=='___')  
            {
            var k = parseInt(mt[i][0]);
            if (k > j) j = k;
            }
        }
        j++;
        var xx = ResizeUploaded.unzip(ResizeUploaded.attachref.value) + (j) + "@" + ResizeUploaded.picfilename.replace(/@.*/,'') + "@" + xy[0] + "_" +  xy[1] + "_" + cw + "_" + ch + ",";
        ResizeUploaded.attachref.value = ResizeUploaded.zip(xx);
        var x = promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[2];
        b.style.left = XY[0] + 'px'; b.style.top = XY[1] + 'px';
        
        var zt = document.getElementById('selectlet');
        zt.innerHTML = zt.innerHTML.replace(new RegExp(textmsg[1611] + ".*$"),'') + '&check;' + textmsg[1611] + "<input type=button class=GreenButton style=width:" + Math.round(4.5*font_size) + "px name=t1 value=\"" + textmsg[1612] + "\" onclick=\"ResizeUploaded.attachman(ResizeUploaded.attachref)\">";
    }
    else
    {
        var y= ',' + ResizeUploaded.unzip(ResizeUploaded.attachref.value);
        var w = "," + j + "@" + ResizeUploaded.picfilename + "@";
        var w1 = w + xy[0] + "_" +  xy[1] + "_" + cw + "_" + ch;
        if(typeof(imagelet2wh) != 'undefined' && typeof(pagenum) != 'undefined' )
        {
            imagelet2wh['imagelet' + j + '_' + pagenum] =  (parseInt(''+cw)/2) + "px/" + (parseInt(''+ch)/2) + 'px';
        }
        var k = y.indexOf(w); 
        if (k>=0)
        {
            y = y.substring(0,k) + w1 + y.substring(k + w.length).replace(/^[0-9|_]+/,'');
            ResizeUploaded.attachref.value = ResizeUploaded.zip(y.replace(/^,/,''));
            document.body.removeChild(document.getElementById('dragcropbox'));
            closeprompt();
        }  
    }
    if (typeof(showattachment)!='undefined') showattachment(ResizeUploaded.attachref.value);
},
codeAttachedFile : function(pathcode)
{
    var showarea = document.getElementById('codeshow');
    showarea.style.border = "1px #b0b0b0 outset";
    showarea.innerHTML = "&lt;img src=\"" + ResizeUploaded.goodopenurl(pathcode,false)   + "\" &gt;";
    var ta = ResizeUploaded.activetextarea(pathcode);
    if (ta != null)
    {
        var j = caretPos(ta);
        ta.value = ta.value.substring(0,j) +  "<img src=\"" + ResizeUploaded.goodopenurl(pathcode)   + "\" style=display:inline;float:right >" +  ta.value.substring(j); 
         
        ResizeUploaded.setformat2html();
        myprompt(textmsg[794]);
    }
} 
}

var tobedeleteds  = new Array();
var deleteatt = function(j)
{
    if (rowInvolves.charAt(0).replace(/[a-z]/,'') == '')
        rowInvolves = rowInvolves.substring(1);
    var ix = rowInvolves.split(',');
    var str = '';
    for (var j=0; j < ix.length; j++)
    {
        var k = parseInt(ix[j]);
        str +=  tobedeleteds[k];
    }
    var dontdel = ResizeUploaded.dontdel.replace(/,$/,'');
    if (dontdel != '')
    {
        var arr = dontdel.split(/,/);
        for (j=0; j < arr.length; j++)
        {
            arr[j] += ",";
            var k = str.indexOf(arr[j]);
            if (k>0)
               str = str.substring(0,k) + str.substring(k+arr[j].length);  
            else if (k==0)
               str = str.substring(arr[j].length); 
        }
    }
    if (parent.opener != null&& onmydomain(parent.opener) && parent.opener.delnotusedattach)
    {  
        parent.opener.delnotusedattach(str );
    }
    else if (opener != null&& onmydomain( opener) && opener.delnotusedattach)
    {   
        opener.delnotusedattach(str );
    }
}
function displayattach(j)
{
    
    for (var r=0; r < numRows; r++) 
    {
        var xx = document.getElementById('at'+r);
        if (xx!=null)
        ele(r,j).parentNode.removeChild(xx);
    }
    var y = new RegExp(/([^@]+)@[0-9]+@([^,]+),/g);
    for (r=0; r < numRows; r++) 
    {
        tobedeleteds[r]=  ResizeUploaded.unzip(mat[r][j]);
        var ar=document.createElement('span');
        ar.id='at'+r;
        var z = ResizeUploaded.unzip(mat[r][j]).replace(/[0-9]+@[^@]+@[0-9|_]+,/g,'');
       
        ar.innerHTML=z.replace(y,'<span style=color:blue;cursor:pointer onclick="openpicorfile(\'$2\',\'$1\',this)">$1</span>&nbsp;&nbsp;');
        ele(r,j).parentNode.appendChild(ar);
        ele(r,j).style.cssText='width:1px;visibility:hidden';
        
    }
}

function attonbegin()
{
    for (var j=0; j < numCols; j++)
    {
     
       if (ctype[j] == 'T' && fields[j].toLowerCase().indexOf('attach')>=0 )
        {
        ondeleted = "deleteatt("+ j + ");r=NUMROWS-1;while (r>=0 && mat[r][0]==''){document.getElementById('maintbl').deleteRow(r);r--;NUMROWS--;};displayattach(" + j + ");";
        //displayattach(j);
        break;
        }
    }
    rr = 0;
}

function attachforform(j)
{
    ondeleted = "deleteatt("+ j + ")";
    //displayattachforform(j);
}

savedredourl = '';
 
function displayattachforform(j)
{
    var xx = document.getElementById('at'+counter);
    if (xx!=null)
    ele(counter,j).parentNode.removeChild(xx);
    var y = new RegExp(/([^@]+)@[0-9]+@([^,]+),/g);
    tobedeleteds[counter]=ResizeUploaded.unzip(mat[counter][j]);
    var ar=document.createElement('span');
    ar.id='at'+ counter;
    ar.innerHTML=ResizeUploaded.unzip(mat[counter][j]).replace(y,'<span style=color:blue;cursor:pointer onclick="openpicorfile(\'$2\',\'$1\',this)">$1</span>&nbsp;&nbsp;');
    ele(counter,j).parentNode.appendChild(ar);
  
    ele(counter,j).style.cssText='width:1px;visibility:hidden';
    var tdcell = document.getElementById("tdcell" + j + "_0");
    if (tdcell != null) tdcell.innerHTML = '';
    ele(counter,j).size = '1';
}

function enableattachman(v)
{
    
   for (var j=0; j < numCols; j++)
   {
      
      if (ctype[j] == 't' && fields[j].toLowerCase().indexOf('attach')>=0 ) 
      {  
          //cellonfocus += ";if (cc==" + j + " && x!='')ResizeUploaded.attachman(ele("+ v +"," + j + "));";
          maxsize[j] = 2000;
          break;
      }
   }
}

function viewattachment(t)
{
    if (t == null || t =='') return '';
    var attarr = ResizeUploaded.unzip(t).replace(/,$/,'').split(/,/);
    var tmptxt = '';
    for (var i = 0; i < attarr.length; i++)
    {
        var xs = attarr[i].split(/@/);
        if (xs.length < 3)
        {
          
            continue;
        }
        if (xs[0].replace(/[0-9]/g,'')=='' && xs[2].replace(/[0-9]/g,'') == '___') continue;
        if (tmptxt!='') tmptxt += ", "; 
        tmptxt += '<span style=color:blue;cursor:pointer onclick="openpicorfile(\''+ xs[2].replace(/^[ ]+/,'') + '\',\'' + xs[0] + '\',this)">' +  xs[0] + '</span>';
    }
    return tmptxt;
}

function  passwordpolicy(txt,j)
{
    if (rdapname == 'userpass') 
        return true;
    if (securitylevel < 1)
    {
        var xs = textmsg[1841].split(/@/);
        myprompt(xs[0] + xs[1],null,null, textmsg[1047] +" "+labels[j] );
        txt.focus();
        return false;
    }
    return true;
}

function whichcell(jj, t) 
{
    return null;
}

function fitme()
{
    var anc = document.getElementById("anchor");
    var wname = window.name;
    if (anc==null )return;
    if (typeof (findPositionnoScrolling) != 'undefined'){
    var xy = findPositionnoScrolling(anc);
    if (wname=='openlink')
        parent.fitwithin(xy);
    else if (parent.name=='openlink' && window!=parent) 
    {
        
        xy[0] += 250;
        
        parent.parent.fitwithin(xy);
    }
     
    }
}
function fitwithin(xy)
{
    var frm = document.getElementById('within');
   
    frm.width = xy[0]+ 30;
    frm.height = xy[1]+30;
}

function printcourse1()
{
    printstyle(null, myfontname, 25, '#006600', 700, myfontname, 18, '#00bb00', myfontname, 18, '#111111',
    [0,1,2,4,3,5,8,9,11,12,13,15],textmsg[1803]);
}
function printcourse()
{
    printstyle(null, myfontname, 25, '#006600', 700, myfontname, 18, '#00bb00', myfontname, 18, '#111111',
    [0,1,2,4,8,9,11,12,13,15],textmsg[1800]);
}
 
function printstyle(logo, tfontname, tfontsize, tfontcolor, bord, hfontname, hfontsize, hfontcolor, cfontname, cfontsize, cfontcolor,alljs,title1)
{
    var nrec = numRows;
    var title2 = title1;
  
    if (nrec == 0)
        nrec = 1;
    var allrs = [];
    for (var r = 0; r < nrec; r++)
    {
        if (typeof(isinrange) == 'undefined' || isinrange(r))  
            allrs[allrs.length] = r;
    }
    if (logo!=null){  
    printstylestr = logo + ',' + tfontname + ',' + tfontsize + ',' + tfontcolor + ',' + hfontname + ',' + hfontsize + ',' + hfontcolor + ',' + cfontname + ',' + cfontsize + ',' + cfontcolor + ',' + bord;
    localStorage["tableprintstyle"] = printstylestr;
    }
    var orgname = systemname();
    if (orgname == null) orgname = '';
    var a = [];
    a[0] = "<style>\nh1{font-family:" + tfontname + ";font-size:" + tfontsize + "pt;color:" + tfontcolor + ";text-shadow:#606060 1px 1px}\n"
            +   "h2{z-index:2;font-family:" + tfontname + ";font-size:" + (tfontsize-7) + "pt;color:" + tfontcolor + ";text-shadow:#606060 1px 1px}\n"
            + " td.heading{font-family:" + hfontname + ";font-size:" + hfontsize + "pt;color:" + hfontcolor + ";width:100px;font-weight:bold}\n"
            + " td.cell{font-family:" + cfontname + ";font-size:" + cfontsize + "pt;color:" + cfontcolor + ";width:" + (bord-106) + "px;}\n</style>";
    a[1] = "<title>" + (title1==null?rdapname:((j=title1.lastIndexOf('<br>'))>0?title1.substring(j):title1)) + "</title>\n</head>\n<body style=\"margin:4px 4px 4px 4px\" >";
    if (logo!=null)
    {
        if (title1==null) title1=title;
        a[a.length] = ("<center>\n<img src=" + logo + ">\n" + (orgname==null?"":("<h2>" + orgname + "</h2>\n")) + "<h1>" + title1 + "</h1>\n</center>\n<table align=center cellspacing=0 cellpadding=0 >");
    }
    else
    { 
        var kk = orgname.indexOf('<br>');
        if (kk>0) orgname = orgname.substring(0,kk);
        else orgname = null;
        if (title1==null) title1=title;
        a[a.length] = ("<center>" + (orgname==null?"":("<h2>" + orgname + "</h2>\n")) + "<h1>" + title1 + "</h1>\n</center>\n<table align=center cellspacing=0 cellpadding=0 >");
    }
    
    var printfoot = true;
    var wh = 7; if (title1==textmsg[1800]) wh = 6;
    var url = theurl.replace(/zpcrpt.*/,"rdap=").replace(/rdap=.*/,"rdap=courseInstructor&CourseId=" + mat[0][0] + "&onbegin=11" + wh)
    var needlatex = false;
    var roundc = "",roundc1="";
    for (var r0 = 0; r0 < allrs.length; r0++)
    {
        r = allrs[r0];
        if (r0 > 0)
        a[a.length] = ("<tr height=40><td></td></tr>");
        if (title2==null)
           a[a.length] = ("<tr><td align=left style=\"border:2px #dddddd solid;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px\">");
        else
           a[a.length] = ("<tr><td align=left >"); 
        if (bord <800) bord = 800;
        if (title2==null)
           a[a.length] = ("<table align=left cellspacing=1 cellpadding=5  style=\"width:" + bord + "px;border-collapse:collapse;border:0px;background:linear-gradient(180deg,#E0F4A3,#EBF7C3);border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px\">");
        else
           a[a.length] = ("<table align=left cellspacing=0 cellpadding=5  style=\"width:" + bord + "px;border:1px #aaaaaa solid;border-radius:4px;background-color:lightyellow\">");
        var wvalue = "";
        
        var att = makehw(r);
        if (alljs==null)
        {
            alljs = [];  
            for (var j = 0; j < numCols; j++)
            {
                if (ctype[j] == null)
                    ctype[j] = "";
                if (ctype[j] != 'h' && ctype[j] != 'k')
                    alljs[alljs.length] = j;
            }   
        }
        
        for (var j0=0; j0 < alljs.length; j0++)
        {
            var str = null;
            j = alljs[j0];
            
            roundc = roundc1 = "";
           if(title2==null){
           if (j0 == 0)
           {
               roundc = "style=\"border-top-left-radius:6px;-webkit-border-top-left-radius:6px;-moz-border-top-left-radius:6px\"";
               roundc1 = "style=\"border-top-right-radius:6px;-webkit-border-top-right-radius:6px;-moz-border-top-right-radius:6px;\"";
           }
           else if (j0 == alljs.length-1)
           {
               roundc = "style=\"border-bottom-left-radius:6px;-webkit-border-bottom-left-radius:6px;-moz-border-bottom-left-radius:6px;\"";
               roundc1 = "style=\"border-bottom-right-radius:6px;-webkit-border-bottom-right-radius:6px;-moz-border-bottom-right-radius:6px;\"";
           }
       }
           a[a.length] = ("<tr><td valign=top class=heading " +  roundc +"><nobr>");
            if (fields[j].indexOf("nolabel") != 0)
            {
                str = labels[j]; 
                if (str != null)
                {
                    str = str.replace(/([a-z])([A-Z])/g, "$1&nbsp;$2");
                    str = str.substring(0, 1).toUpperCase() + str.substring(1);
                    a[a.length] = ( str  );
                }
            }
            a[a.length] = ("</nobr></td><td  class=cell  " +(j0 < alljs.length-6 && title2!=null? " colspan=2 ":"") +   roundc1 +">");
            if (mat[r][j] == null)
            {
                if (dtype[j]) 
                    mat[r][j] = '0';
                else
                    mat[r][j] = '';
            }
            str = retrv(r, j);
            
            x = ctype[j];
            if (x != 'L')
                x = x.toLowerCase();
            var jj = 0;
            
            var sa = '';
            var rowsize = '';
            var colsize = '';
            switch (x)
            {
                case 'i':
                case 'n':
                    sa = fsize[j].split("_");
                    if (sa.length > 0)
                        rowsize = sa[0];
                    else
                        rowsize = "10";

                    if (sa.length > 1)
                        colsize = sa[1];
                    else if (ctype[j] == 'i')
                        colsize = "30";
                    else
                        colsize = "2";
                   
                    if (ctype[j] == 'i')
                    {
                        a[a.length] = ("<iframe frameborder=0 width=" + colsize + " height=" + rowsize + " name=iframe" + j + "></iframe>");
                        openit(mat[r][j], r, 'iframe' + j);
                    }
                    else
                    {
                       
                        a[a.length] = ( numberstr(str, ffsize[j]) );
                    }
                    break;
                case 'a': 
                    //a[a.length] = formatstr(str,'0');
                    //break;
                case 'f':
                    if (fmtcol < numCols && fmtcol>=0)
                       actualformat = mat[r][fmtcol];
                    else
                       actualformat = '0';  
                    
                    
                    if ('' + actualformat == '2') 
                        needlatex = true;
                    str = formatmat(str,r,j);
                    
                    if (str == '') str = "&nbsp;";
                    a[a.length] = ( str); 
                    break;
                    
                case 'b':
                    if (fmtcol < numCols && fmtcol>=0)
                       actualformat = mat[r][fmtcol];
                    else
                      actualformat = '0'; 
                    if ('' + actualformat == '2') 
                        needlatex = true;
                    str = Innergrid.makeinnertable(str, r, j, false);
                    
                    a[a.length] = ( str );
                    break;
                case 't':
                    if (fields[j].toLowerCase().indexOf('attach') == 0)
                    {
                        a[a.length] = att;
                        break;
                    }
                case 'p':
                case '':
                   
                    a[a.length] = ( formatstr(str) );
                    break;
                case 'c':
                    a[a.length] = ("<input type=checkbox " + ((str == '0') ? "" : "checked") + ">");
                    break;
               
                case 'm':
                    
                    a[a.length] = ( timestr(str) );
                    break;
                case 'r':
                case 's':
                    for (jj = 0; jj < options[j].length && retrv(r, j) != options[j][jj]; jj++) ;
                    if (jj < captions[j].length)
                        a[a.length] = (  captions[j][jj] );
                    else
                    {
                        a[a.length] = (str);
                    }
                    break;
                case 'w':
                    a[a.length] = ( multivalue(str, options, captions, j, dtype[j]) );
                    break;
                case 'l':
                    
                    a[a.length] = ("<a href=\"javascript:opener.openit1(" + r + "," + j + ")\">" +str + "</a>");
                    break;
                case 'L':
                    a[a.length] = /*("<a href=\"javascript:opener.openit2(" + r + "," + j + ")\">" + */  mat[r][j];//  + "</a>");
                    break;
                case 'u':
                    a[a.length] = ("<img src=\"" + str + "\" >");
                    break;
            }
            a[a.length] = ("</td>" + ((j0 != alljs.length-6||title2==null||title2.includes('<br>'))?"":("<td rowspan=6 valign=bottom ><img height=240 src=\"Qrlink?url=" + Msg.hex(url) + "\"></td>")) + "</tr>\n");
        }

        a[a.length] = ("</table></td></tr>");
    }
    
    a[a.length] = ("</table>");
    
    if (''+actualformat =='2')a[a.length] = needlatex;
    if (title2==null || title1.includes("<br>"))
    {  
        postopen("printdoc.jsp",['wcds'],[a.join("")],'_blank');
         
    }
    else
    {
        var r = document.getElementsByTagName('table')[0].insertRow(-1);
        var c = r.insertCell();
        c.align='center';
        c.innerHTML =   a.join("") ;
        
        if (title1==textmsg[1800] )
        {
            var w = thispagewidth();
            var h = document.getElementsByTagName('table')[0].offsetHeight+90;
            var url = "image/poster.png";
            var img = document.createElement('img');
            img.style.cssText = "opacity:0.2;position:absolute;top:0px;height:" + h +"px;width:" + w + "px;z-index:3";
            img.src = url;
            document.body.appendChild(img);
        }
        else
        {
            var w = thispagewidth();
            var tbl = document.getElementsByTagName('table')[0];
            tbl.style.cssText = "";
            var h = tbl.offsetHeight+90;
            var url = "https://image.photoworld.com.cn/wp-content/uploads/2017/01/%E6%83%B3%E6%8B%8D%E5%A5%BD%E9%9B%AA%E6%99%AF%EF%BC%8C%E8%BF%995%E7%82%B9%E4%BD%A0%E8%A6%81%E8%AE%B0%E7%89%A2-t.jpg?imageView2/2/w/720";
            var img = document.createElement('img');
            img.style.cssText = "opacity:0.2;position:absolute;top:0px;height:" + h +"px;width:" + w + "px;z-index:3";
           // img.src = url;
           // document.body.appendChild(img);   
        }
        //download2(a.join(""),title1+".html");
    }
    
}
function download2(contents, filename) 
{
    let mime_type =  "text/html";
    var blob = new Blob([contents], {type: mime_type});

    var dlink = document.createElement('a');
    dlink.download = filename;
    dlink.href = window.URL.createObjectURL(blob);
    dlink.onclick = function(e) {
        // revokeObjectURL needs a delay to work properly
        var that = this;
        setTimeout(function() {
            window.URL.revokeObjectURL(that.href);
        }, 1500);
    };

    dlink.click();
    dlink.remove();
} 
if (rdapname.toLowerCase().indexOf("message")>=0)
{
    ResizeUploaded.initfolder = "email";
}
else if(rdapname.toLowerCase().indexOf("announce")>=0)
{
     ResizeUploaded.initfolder = "communication";
}


















 