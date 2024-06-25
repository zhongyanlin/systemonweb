/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/ 
 
var cellvalue = "";
var nn;

var f2 = null;
f1 = document.forms[0];
f2 = document.thisform;

var iframeparas = null;
if (typeof(numIframes) == 'undefined' || numIframes == null)
   numIframes = 0;
if (numIframes > 0)
    iframeparas = new Array(numIframes);
for (var i = 0; i < numIframes; i++)
    iframeparas[i] = new Array(3);
var saveneedconfirm = null;
resumehalted = function()
{
    if (typeof (expiretime) != 'undefined')
    {
        expiretime = activeidletime + (new Date()).getTime();
    }
    setactionhelp(nn, saveneedconfirm)
}
function resubmitform()
{
    setactionhelp(nn, saveneedconfirm);
}
 

function setaction(n, needconfirm)
{
   if (periodvalue==1)
   {
       if (rr>=0 && cc>=0) 
           U(rr,cc);
   }
   fixholdv();
    var rightnow = (new Date()).getTime();
    nn = n;
    saveneedconfirm = needconfirm;
    setactionhelp(n, needconfirm);
    expiretime = activeidletime + rightnow;
}

function setactionhelp(n, needconfirm)
{
  
    if (n == 3 && numRows == 0)
        return false;
    if (needconfirm == null)
        needconfirm = true;
    if (f1 == null)
        return false;
    var did = false;
    var doit = false;
    if (n == 5)
        n = 3;
    nn = n;

    if (n == 1)
    {
        
        doblankkey();
        if (onsave != null && onsave != '')
            eval(onsave);
            
        f2.subdb.value = subdb;
       
        if (validating != '')
        {
            if (validating != ' ')
                myprompt(validating);
            if (typeof (disablefuncbut) == 'function')
            {
                disablefuncbut(false);
            }
            return false;
        }
        else if (formstr() == true)
        {

            window.onbeforeunload = null;
            formnewaction(f2, "SaveBack");
   
           visual(f2);
          
           f2.submit();
  
            did = true;
        }
        else
        {
            for (var i = 0; i < self.frames.length; i++)
            {
                if (self.frames[i].name.indexOf("iframe") == 0 && typeof(self.frames[i].setactionhelp)!='undefined' && self.frames[i].setactionhelp(1))
                    did = true;
            }

            if (typeof (disablefuncbut) == 'function')
            {
                disablefuncbut(false);
            }
        }
    }
    else if (n == 2)
    {
        did = formstr();

        for (i = 0; i < self.frames.length; i++)
        {
            if (self.frames[i].name.indexOf("iframe") == 0 && self.frames[i].setactionhelp(2))
                did = true;
        }
    }
    else if (n == 3)
    {
        f2.subdb.value = subdb;
        if (needconfirm == false)
        {
            delselrecimm();
            return true;
        }

        if (numIframes > 0)
        {
            myprompt(textmsg[901] + "?", null, "if(v) delsubformrec();delselectrec();} else dontdelete();");
        }
        else
        {
            delselectrec();
        }
        did = true;
    }

    return did;
}

function delsubformrec()
{
    for (var i = 0; i < numIframes; i++)
    {
        if (self.frames[i].name.indexOf("iframe") == 0)
            self.frames[i].setaction(3, false);
    }
}



function delselectrec()
{
    var dummy = subs(deleteQuery, 0);
    var tt = "";
    var nomark = (typeof (f1.statusmarkbox) == 'undefined'
            && typeof (f2.statusmarkbox) == 'undefined');
    var allkeyfieldarr = allkeyfields.split(",");
    if (nomark)
    {
        for (var i = 0; i < numRows; i++)
        {
            markers[i] = (i == counter);
        }
    }
    else
    {

        for (i = 0; i < numRows; i++)
        {
            if (markers[i])
            {
                tt += "<tr  bgcolor=" + TBGCOLOR + " ><td><input type=checkbox name=a" + i + " checked=yes onclick=\"javascript:clearmark(this," + i + ")\"></td><td align=right>" + (i + 1) + "</td>";
                var jj = 0, ll = 0;
                for (ll = 0; ll < allkeyfieldarr.length; ll++)
                {
                    var vv = mat[i][allkeyfieldarr[ll]];
                    var ct = ctype[allkeyfieldarr[ll]];
                    if (ct == 'M' || ct == 'm')
                        vv = timestr(vv);
                    tt += "<td><nobr>" + vv + "</nobr></td>";
                }
                tt += "<td><a href=javascript:populate(" + i + ")><nobr>" + textmsg[543] + "</nobr></a></td></tr>";
            }
        }
    }
    if (!nomark && tt == '')
    {
        for (i = 0; i < numRows; i++)
        {

            tt += "<tr  bgcolor=" + TBGCOLOR + " ><td width=" + (font_size + 3) + " align=center><input type=checkbox name=a" + i + " onclick=\"javascript:clearmark(this," + i + ")\"></td><td align=right>" + (i + 1) + "</td>";
            jj = 0, ll = 0;
            for (ll = 0; ll < allkeyfieldarr.length; ll++)
            {
                vv = mat[i][allkeyfieldarr[ll]];
                ct = ctype[allkeyfieldarr[ll]];
                if (ct == 'M' || ct == 'm')
                    vv = timestr(vv);
                tt += "<td><nobr>" + vv + "</nobr></td>";
            }
            tt += "<td><nobr><a href=javascript:populate(" + i + ")>" + textmsg[543] + "</a></nobr></td></tr>";
        }
    }

    var tmp = "<nobr>" + textmsg[252] + "</nobr>";
    if (nomark)
        tmp = "<nobr>" + textmsg[810] + "?</nobr>";
    else
        tmp += "<br><div style=background-color:" + DBGCOLOR + "><table width=100% id=delconfirmtbl cellpadding=3 class=outset1 align=center border=0><tr style=\"background:" + beheading + "\"><td width=" + (font_size + 3) + " align=center><input type=checkbox onclick=controlallchecks(this)></td><td><nobr>" + textmsg[542] + "</nobr></td><td colspan=" + allkeyfieldarr.length + "><nobr>" + textmsg[908] + "</nobr></td><td><nobr>" + textmsg[543] + "</nobr></td></tr>" + tt + "</table></div>";
    myprompt(tmp, null, "if(v)delselrecimm();else dontdelete();");
    if (!nomark)
    {
        // var confirmtbl = document.getElementById("delconfirmtbl");
        // promptwin.style.width = (confirmtbl.offsetWidth + 8) + 'px';
    }
}
function dontdelete()
{
    if (typeof (disablefuncbut) == 'function')
    {
        disablefuncbut(false);
    }
}
function controlallchecks(sel)
{
    var tbl = document.getElementById("delconfirmtbl");

    var ll = tbl.rows[1].cells.length;

    for (var ii = 1; ii < tbl.rows.length; ii++)
    {
        var el = tbl.rows[ii].cells[0].childNodes[0];
        el.checked = sel.checked;
        var i = parseInt(el.name.substring(1));
        markers[i] = sel.checked;
        if (counter == i) {
            if (typeof (f2.statusmarkbox) != 'undefined')
                f2.statusmarkbox.checked = sel.checked;
            if (typeof (f1.statusmarkbox) != 'undefined')
                f1.statusmarkbox.checked = sel.checked;
        }
    }

}
function delselrecimm()
{
    if (formstr() == true)
    {
        window.onbeforeunload = null;
        formnewaction(f2);
       visual(f2);
 f2.submit();
        did = true;
    }
    else
        dontdelete();
}

function allowenter1(c, eve)
{
    if (ctype[c] == ctype[c].toUpperCase() && counter < numRows)
        return false;
    if (dtype[c] == 'n' && !isDigitEvent(eve))
        return false;
    return true;
}

function fixholdv()
{
     if (counter ==null || counter == -1 || counter == NUMROWS)
         return;
     for (var j=0; j < numCols; j++)
        {
            if (ctype[j] == 's')
            {
                if (holdvalues[counter + '_' + j]==null )
                {
                    var zz = ele(counter,j);
                    if (zz==null || typeof(zz.tagName)=='undefined'|| zz.tagName ==null || zz.tagName.toLowerCase()!='select')
                        continue;
                    var zv = zz.options[zz.selectedIndex].value;
                    if (x != mat[counter][j])
                    {
                        holdvalues[counter + '_' + j] = zv;
                        valuechanged[counter] = true;
                    }
                }
            }
            else if (ctype[j] == 'm') 
            {
                if (holdvalues[counter + '_' + j]==null )
                {
                    var zz = ele(counter,j);
                    if (zz==null || typeof(zz.value)=='undefined'|| zz.value ==null)
                        continue;
                    var zv = parseTime(zz.value);
                    var yv = parseInt(mat[counter][j]);
                    if (zv != invalidtimevalue && ''+yv!='NaN'  &&  Math.abs(zv - yv) > 60)
                    {
                        holdvalues[counter + '_' + j] =  zv;
                        valuechanged[counter] = true;
                    }
                } 
            }
            else if (ctype[j] == 'n') 
            {
                if (holdvalues[counter + '_' + j]==null )
                {
                    var zz = ele(counter,j);
                    if (zz==null || typeof(zz.value)=='undefined'|| zz.value ==null)
                        continue;
                    var zv = parseFloat(zz.value);
                    var yv = parseFloat(mat[counter][j]);
                    if (''+zv!='NaN' && ''+yv!='NaN' && Math.abs(zv - yv) >= 1)
                    {
                        holdvalues[counter + '_' + j] =  zz.value;
                        valuechanged[counter] = true;
                    }
                }
            }
            else if (ctype[j] == 't' || ctype[j] == 'h' || ctype[j] == 'u'|| ctype[j] == 'r')
            {
                 var zz = ele(counter, j);
                 if (zz==null || typeof(zz.value)=='undefined'|| zz.value ==null)
                        continue;
                 var zv = zz.value;
                 if (zv != mat[counter][j])
                 { 
                     holdvalues[counter + '_' + j] =  zv;
                     valuechanged[counter] = true;
                }
            }
             
             
        }
}

function populate(n)
{
    if (n > 0 && counter!=n)
    {
        fixholdv(); 
    }
    if (isNaN(n) || n < 0)
        return;
    makehw(n);
    window.onbeforeunload = null;
    numIframes = 0;
    counter = n;
    var tt = 'NULL';
    var k = 0, leng = 0;
    if (n == numRows)
        tt = '';
    var q, y = 0;

    for (var j = 0; j < numCols; j++)
    {
        var matnj = null;
        if (n >= numRows)
            matnj = defaultValue(n, j);
        else if (ctype[j] == 'a' || ctype[j] == 'A'
                || ctype[j] == 'b' || ctype[j] == 'B')
            matnj = mat[n][j].replace(new RegExp("\\[Imagelet([0-9]+)","ig"),"[" +  textmsg[1303] + "$1") ;
        else
        {
            matnj = holdvalues[n + "_" + j];
            if (matnj == null)
                matnj = mat[n][j];
        }
        if (ctype[j] == 'i' || ctype[j] == 'I')
        { 
            ele(n, j).value = matnj;
            iframeparas[numIframes][2] = 'iframe' + j;
            if (n < numRows)
            {
                iframeparas[numIframes][0] = matnj;
                iframeparas[numIframes][1] = '' + n;
            }
            else
            {
                iframeparas[numIframes][0] = "savefirst.html";
                iframeparas[numIframes][1] = '0';
            }
            numIframes++;

        }
        else
        {
            var thiscell0 = whichcell(j, 0);
            var thiscell1 = whichcell(j, 1);

            if (thiscell0 != null && thiscell1 != null)
            {
                if (n < numRows)
                {
                    if (ctype[j] == 'T' || ctype[j] == 'N' || ctype[j] == 'M' || ctype[j] == 'f' || ctype[j] == 'b' || ctype[j] == 'B')
                    {
                        if (thiscell1.innerHTML == '')
                            thiscell1.innerHTML = "<input type=\"hidden\"  name=\"" + fields[j] + "\" value=\"\">";
                    }
                }
                else
                {
                    var readonly = "border:1px #b0b0b0 solid!important;background-color:" + TBGCOLOR + ";color:black;";
                    if (ctype[j] == 'T' && fields[j].toLowerCase().indexOf('attach')!=0)
                    {
                        
                        thiscell0.innerHTML = "<INPUT  style=\"" + readonly + "\" MAXSIZE=" + maxsize[j]
                                + " size=" + fsize[j] + " name=" + fields[j]
                                + " value=\"" + matnj + "\" onfocus=S(counter," + j + ")"
                                + " onblur=U(counter," + j + ")"
                                + " onchange=UT(counter," + j + ") onkeypress=\"return allowenter1(" + j + ",event)\">\n";
                        thiscell1.innerHTML = "";
                    }
                    else if (ctype[j] == 'N')
                    {
                        thiscell0.innerHTML = "<INPUT  style=\"" + readonly + "\" MAXSIZE=" + maxsize[j]
                                + " size=" + fsize[j] + " name=" + fields[j]
                                + " value=\"" + numberstr(matnj, ffsize[j]) + "\" onfocus=S(counter," + j + ")"
                                + " onblur=U(counter," + j + ")"
                                + " onchange=UT(counter," + j + ") onkeypress=\"return allowenter1(" + j + ",event)\">\n";
                        thiscell1.innerHTML = "";
                    }
                    else if (ctype[j] == 'M')
                    {
                        thiscell0.innerHTML = "<INPUT  style=\"" + readonly + "\" MAXSIZE=" + maxsize[j]
                                + " size=" + timeformat.length + " name=" + fields[j]
                                + " value=\"" + timestr(matnj) + "\" onfocus=S(counter," + j + ")"
                                + " onblur=U(counter," + j + ")"
                                + " onchange=UT(counter," + j + ") onkeypress=\"return allowenter1(" + j + ",event)\">\n";
                        thiscell1.innerHTML = "";
                    }
                    else if (ctype[j] == 'f')
                    {
                        if (fsize[j] == null || fsize[j] == '')
                            fsize[j] = 60;
                        if (ffsize[j] == null || ffsize[j] == '')
                            ffsize[j] = 5;
                        thiscell0.innerHTML = "<textarea  wrap=soft style=\"" + readonly + "\" cols=" + fsize[j] + " rows=" + ffsize[j] + " name=" + fields[j]
                                + " onfocus=S(counter," + j + ")"
                                + " onblur=U(counter," + j + ")"
                                + " onchange=UT(counter," + j + ")  ></textarea>\n";
                        thiscell1.innerHTML = "";
                    }
                    else if (ctype[j] == 'b' || ctype[j] == 'B')
                    {
                         document.write(Innergrid.makeinnertable(defaultRecord[j], 0, j,ctype[j] == 'b')); 
                    }
                    else if (ctype[j] == 'w' || ctype[j] == 'W')
                    {
                        thiscell0.width = '100';
                        thiscell1.width = (parentNode.offsetWidth - 105);
                    }
                }
            }

            if (ctype[j] == 'u' || ctype[j] == 'U')
            { 
                if (mat[n][j] == '')
                {
                    //myprompt('Fill out URL of the photo or use the "Choose" button and "Attach" button below to upload an image file');
                }
                else{
                    let im = getImageByName('image'+j  );
                    if (im!=null) im.src = matnj; 
                }
            }
           
            setv(n, j, matnj);
           
            if (ctype[j].toLowerCase() == 'm' && timechanged.indexOf(";" + n + "," + j + ";") < 0)
                timechanged += n + "," + j + ";";
            /*if (typeof(issubmit)=='undefined' && fields[j].toLowerCase().indexOf("attach") == 0 && typeof(showattachment) != 'undefined') 
            {
                showattachment(matnj,n);
            }*/
            
        }

    }

    if (numRows >= 1 && NUMROWS > 1)
    {
        if (f2!=null && typeof(f2.count)!='undefined')
        f2.count.value = (n + 1);
    }
    counter = n;

    //if (hasdelete && f2.delbtn!=null)
    //f2.delbtn.style.visibility =  ( n == numRows)?"hidden":"";
    //if (hasnew && f2.newbtn!=null)
    //f2.newbtn.style.visibility =  ( n == numRows)?"hidden":"";

    for (var j = 0; j < numIframes; j++)
    {

        openithere(iframeparas[j][0], iframeparas[j][2]);
    }
    if (n == numRows)
    {
        valuechanged[n] = true;
        rewriteRowtotal(n + 1);
    }
    else
    {
        valuechanged[n] = false;
    }
    if (f2 == null) return;
    if (typeof (f2.statusmarkbox) != 'undefined')
    {
        f2.statusmarkbox.checked = markers[n];
    }
    if (typeof (f2.count) != 'undefined')
    {
        f2.count.value = n + 1;
    }
    if (typeof (f1.statusmarkbox) != 'undefined')
    {
        f1.statusmarkbox.checked = markers[n];
    }
    if (typeof (f1.count) != 'undefined')
    {
        f1.count.value = n + 1;
    }
    if (typeof (populatemore) != 'undefined')
        populatemore(n);
    for (var j=0; j < numCols; j++)
    if (ctype[j] == 'T' && fields[j].toLowerCase().indexOf('attach') >=0)
    {
         attachforform(j);
    }
}
function populate1(numr)
{
    if (numr == counter)
        return;
    if (domandatory(counter))
    {
        populate(numr);
        if (typeof (f2.statusmarkbox) != 'undefined')
            f2.statusmarkbox.checked = markers[numr];
    }
}
function saveas(n)
{
    numIframes = 0;
    var tt = 'NULL';
    var k = 0, leng = 0;
    if (n == numRows)
        tt = '';
    var q, y = 0;

    if (numRows >= 1 && NUMROWS > 1)
        f2.count.value = n + 1;
    counter = n;

    if (hasnew && f2.newbtn != null)
        f2.newbtn.style.visibility = (n == numRows) ? "hidden" : "";
    setaction(1);
}

function showNext()
{
    myprompt(window.frames[0].document.body.innerHTML + '<br>' + query + '<br>' + insertQuery + '<br>' + updateQuery + '<br>' + deleteQuery);
}

var markers = new Array(numRows);
for (var i = 0; i < numRows; i++)
    markers[i] = false;
function forerase(i)
{
    var erase = (i < numRows) ? 1 : 0;
    for (var j = 0; j < numCols; j++)
    {
        var ww = retrv(i, j);
        if (erase > 0 && mat[i][j] != ww)
        {
            erase = (ww == '' || dtype[j] && ww == null) ? 2 : 0;
        }
    }
    if (erase == 2)
    {
        markers[i] = true;
    }
}

function formdeletestr()
{

    var sqlstr = '';
    rowInvolves = '0';

    for (var i = 0; i < numRows; i++)
    {
        forerase(i);
        if (markers[i])
        {

            var setstr = subs(deleteQuery, i);
            sqlstr += "d" + setstr + ';';
            if (rowInvolves == '0')
                rowInvolves += i;
            else
                rowInvolves += ',' + i;
            whichaction = 'del';
        }
    }
    if (rsaenccode == '2' || rsaenccode == '3')
        f2.wcds.value = encryptString(sqlstr);
    else
        f2.wcds.value = sqlstr;
   
}
function clearmark(sel, i)
{
    markers[i] = sel.checked;
    if (i == counter && typeof (f2.statusmarkbox) != 'undefined')
        f2.statusmarkbox.checked = false;
    if (i == counter && typeof (f1.statusmarkbox) != 'undefined')
        f1.statusmarkbox.checked = false;
}
function formupdatestr(querystr)
{
    numnew = 0;
    var sqlstr = '';
    rowInvolves = '1';
    for (var i = 0; i < NUMROWS; i++)
    {
        for (var j=0; j < numCols; j++)
        {
            if (ctype[j] !='a' && ctype[j]!='b' && retrv(i,j) != mat[i][j] || (ctype[j] =='a' || ctype[j]=='b') && holdvalues[i + '_' + j]!=null)
            {
               valuechanged[i] = true;
               break;
            }
        }
        if (valuechanged[i] == null || valuechanged[i] == false)
            continue;

        if (domandatory(i) == false)
        {
            markers[i] = true;
            numnew = 0;
            continue;
        }
        var setstr = "u" + querystr;
        if (i >= numRows)
        {
            setstr = "i" + insertQuery;
            
        }
       
        setstr = subs(setstr, i);

        if (setstr != '')
        {
            sqlstr += setstr + ';';

            if (i >= numRows)
                numnew++;
            if (rowInvolves == '1')
                rowInvolves += i;
            else
                rowInvolves += ',' + i;
        }
    }

    if (rsaenccode == '2' || rsaenccode == '3')
        f2.wcds.value += encryptString(sqlstr);
    else
    {
        f2.wcds.value += sqlstr;
       
    }
    whichaction = 'upd';
   
}


function formstr()
{
    if (nn == 4)
    {
        myprompt(helpstr);
        return false;
    }

    rowInvolves = '';
    f2.id.value = iid;
    var sqls = f2.wcds;
    sqls.value = '';

    if (nn == 1)
    {
        if (updateQuery != '' || insertQuery != '')
        {
           
            formupdatestr(updateQuery);
        }
        if (sqls.value == '')
            return (false);
    }
    else if (nn == 2)
    {
        if (updateQuery != '' || insertQuery != '')
            formupdatestr(updateQuery);
        if (deleteQuery != '')
            formdeletestr();
        if (sqls.value == '')
            return (false);
        sqls.value = sqls.value.replace(/\xFD/g, "<br>").replace(/\xFC/g, "<br>").replace(/\xFB/g, "<br>");
        ;
        ;
    }
    else if (nn == 3)//delete
    {
        for (var k = 0; k < numRows; k++)
            deleted[k] = false;
        if (deleteQuery != '')
            formdeletestr();
        if (sqls.value == '')
            return (false);
    }
    if (nn == 2)
    {
        myprompt(sqls.value);
        setRoundedWidth(promptwin, 600);
        promptwinfit();
        return false;
    }

    openwinsubmitform();
    return true;
}
function openwinsubmitform()
{
    popstr = dim(340, 300).replace(/menubar=0/, "menubar=1");

    if (tinywin != window.name && tinywin != '_blank' && (tinywin != 'w' + tstmp
            || self.frames==null || self.frames.length == 0
            || typeof(self.frames[self.frames.length - 1].name)=='undefined' 
            || self.frames[self.frames.length - 1].name != 'w' + tstmp))
    {
        nav1 = window.open('', tinywin, popstr);
        nav1.focus();
        nav1.document.write("<html>" + metaencode + "<body bgcolor=" + DBGCOLOR + ">" + textmsg[86] + "</body></html>");
    }
    else if (tinywin != '_blank')
    {
        nav1 = window.open('', tinywin);
    }
     
    if (tinywin != '_blank')
        f2.target = tinywin;
}

function reset1()
{
    populate(counter);
}

function jumpTo(v, evt)
{
    var e = (evt != null) ? evt : (window.event);
    var keyc = e.keyCode ? e.keyCode : e.which;

    if (keyc == 13)
    {
        populate1(parseInt(v.value) - 1);
        return true;
    }
    return  isDigitKey(keyc);
}
function getPassed3(str, k)
{
    setv(counter, k + passedCol, str);
}
function getPassed1(k, str)
{
    setv(counter, k + passedCol, str);
}
function getPassed(str)
{
   
    if (passedCol < 1)
        return;
    if (ctype[passedCol - 1] != 'a' && ctype[passedCol - 1] != 'A')
        str = str.replace(/\n/g, ',');
 
    x = retrv(counter, passedCol - 1);
    setv(counter, passedCol - 1, str);
 
    v = str;
    cc = passedCol - 1;
    rr = counter;
    if (cellonblur != '')
        eval(cellonblur);
    valuechanged[counter] = true;
}
function getPassed2(str)
{
    getPassed(str);
    passedRow++;
}

function doonbegin()
{
    if ( (numRows > 0 || hasnew) && typeof(issubmit) == 'undefined')
    {
       populate(0);
    }
  
    if (onbegin != '')
    {  
        onbegin = onbegin.replace(/printcourse([1]?).*/,'printcourse$1()').replace(/;;/g,';');
       
        eval(onbegin);
    }

    if (typeof (fsnd) != 'undefined' && fsnd != null && typeof (fsnd.MaxUploadSize) != 'undefined')
    {
        fsnd.localpathtoupload.onmouseover = function() 
        {
            showmyhintstr('Maximum uploading file size is ' + fsnd.MaxUploadSize.value + 'MB');
        }
        fsnd.localpathtoupload.onmouseout = function(){hidemyhint();};
    }
    fitme();
}
function rewriteRowtotal(n)
{
    if (n == null)
        n = numRows;
    var totaltd = document.getElementById("recordtotallabel");
    if (totaltd != null)
        totaltd.innerHTML = "/" + n;

}

checkone = function(i, b)
{
    if (b == null)
        b = true;
    markers[i] = b;
}
copycheck = function(i, j)
{
    markers[i] = markers[j];
}
checkread = function(i) {
    return markers[i];
}



function syn(z, explicit, em1)
{
    
    var ret = 0;
    if (z == 'del')
    {
       
        if ( (explicit.replace(/[0-9|a-z]/ig,'').replace(/[\-|_|\.|\$]/g,'')=='') && typeof (ResizeUploaded.refreshatt) == 'function')
            ResizeUploaded.refreshatt();
        return 1;
    }
    else if (z.indexOf("web") == 0)
    {
         alluploadedfiles += explicit + '@'+ z.substring(4) + ",";
         ResizeUploaded.uploaded(z, explicit);
         return 1;
    }
    else
    {  
        ResizeUploaded.alluploaded = "";
        ret = multirowdatasaved(z, explicit);
    }
 
    if (typeof (f2.statusmarkbox) != 'undefined')
        f2.statusmarkbox.checked = markers[counter];
    if (typeof (f1.statusmarkbox) != 'undefined')
        f1.statusmarkbox.checked = markers[counter];
    if (numRows == NUMROWS && hasnew)
    {
        for (i = NUMROWS; i < NUMROWS + 10; i++)
        {
            mat[i] = new Array(numCols);
            deleted[i] = false;
            markers[i] = false;
        }
        NUMROWS += 10;
    }

    window.onbeforeunload = null;

    var did = false;
    if (self.frames != null)
        for (var i = 0; i < self.frames.length; i++)
        {
            if (self.frames[i].name.indexOf("iframe") != 0)
                continue;
            if (typeof (self.frames[i].setaction) == 'undefined')
                continue;
            if (!self.frames[i].setaction(1))
                did = false;
        }
    
    return ret;
}
  



function refreshsub()
{
    for (var j = 0; j < numCols; j++)
    {
        if (ctype[j] == 'i' || ctype[j] == 'I')
        {
            if (i < numRows)
                openithere(mat[i][j], 'iframe' + j);
            else
                openithere("savefirst.html", 'iframe' + j);
        }
    }
}

function passdefaults(openwin)
{

    if (openwin == null || openwin.document == null || openwin.document.form1 == null)
        return;

    var allfs = openwin.document.form1.elements;
    if (allfs == null || allfs.length == 0)
        return;
    for (var i = 0; i < numCols; i++)
    {

        var j = 0;
        while (j < allfs.length && allfs[j].name != fields[i])
            j++;

        if (j < allfs.length && allfs[j].value != null && allfs[j].value != '')
        {

            defaultRecord[i] = openwin.getValue(j);
        }
    }
    populate(0);
}

function setCell(r, c, str)
{
    setv(r, c, str);
}

function openithere(url, winname)
{
    for (var k = 0; k < f1.elements.length; k++)
        if (f1.elements[k].tagName.toLowerCase() == 'textarea')
            f1.elements[k].disabled = true;
    var j = url.indexOf("?");
    if (j == -1)
        formnewaction(f1, url);
    else
    {
        var p = url.substring(j + 1).split("&");
        formnewaction(f1, url.substring(0, j));
        for (var j = 0; j < p.length; j++)
        {
            var pp = p[j].split("=");
            for (var k = 0; k < f1.elements.length; k++)
            {
                if (pp[0] == f1.elements[k].name)
                {
                    break;
                }
            }
            if (k == f1.elements.length) {
                var el = document.createElement("input");
                el.name = pp[0];
                el.type = "hidden";
                el.value = unescape(pp[1]);
            }
        }
    }
    f1.target = winname;
   visual(f1);
 f1.submit();
    for (var k = 0; k < f1.elements.length; k++)
        if (f1.elements[k].tagName.toLowerCase() == 'textarea')
            f1.elements[k].disabled = false;
}

function fontstr(partname, fontname, dname, fontsize, dsize, fontcolor, dcolor, bgcolor, k)
{
     var fot = textmsg[1594];
    var fontarr = fot.split(/@/);
    var str = "<table align=center width=100%   border=0 bgcolor=" + bgcolor + "><tr ><td><input type=hidden name=sample" + k + "></td><td    style=background-color:" + bgcolor + ";border:0;color:" + dcolor + ";font-family:" + dname + ";font-size:" + dsize + ";><nobr>" + partname + textmsg[737]
            + "</nobr></td><td>  <nobr>{" + textmsg[737] + "</nobr></td><td><select name=" + fontname + " onchange=testfont1(1,this," + k + ",'" + bgcolor + "')>";
    for (var i = 0; i < fontarr.length; i++)
    {
        fontarr[i]= fontarr[i].replace(/,.*$/,'');
        str += "<option value=\"" + fontarr[i] + "\" ";
        if (fontarr[i] == dname)
            str += " selected ";
        str += ">" + fontarr[i] + "</option>";
    }
    str += "</select></td><td><nobr>" + textmsg[734] + "</nobr></td><td><input class=left name=" + fontsize + " value=\"" + dsize + "\" size=2 onchange=testfont(2,this.value," + k + ",'" + bgcolor + "')></td><td><nobr>pt  &nbsp;</nobr></td><td><nobr>" + textmsg[738] + "</nobr></td><td><input class=left name=" + fontcolor + " type=color value=\"" + dcolor + "\" size=4 onchange=testfont(3,this.value," + k + ",'" + bgcolor + "')></td><td>}</td><td><a href=http://www.colorpicker.com target=_blank><nobr>" + textmsg[320] + "</nobr></a></td></tr></table>";
    return str;
}

var printstylestr = localStorage["tableprintstyle"];

if (printstylestr==null || printstylestr=='')
{
    if (typeof(someconsts)!='undefined') 
        printstylestr="image/tm.gif," + someconsts[1].replace(/,.*$/,'') + ",28,#FF0000," + someconsts[1].replace(/,.*$/,'') + ",12,#0000FF," + someconsts[1].replace(/,.*$/,'') + ",12,black,1";
    else
        printstylestr="image/tm.gif,arial,28,#FF0000,arial,12,#0000FF,arial,12,black,1";
}

function resetdefualtprint()
{
    if (typeof(someconsts)!='undefined') 
        printstylestr="image/tm.gif," + someconsts[1].replace(/,.*$/,'') + ",28,#FF0000," + someconsts[1].replace(/,.*$/,'') + ",12,#0000FF," + someconsts[1].replace(/,.*$/,'') + ",12,black,1";
    else
        printstylestr="image/tm.gif,arial,28,#FF0000,arial,12,#0000FF,arial,12,black,1";
    localStorage.removeItem("tableprintstyle");
    printing();
}
 
var rowselection = "1-" + NUMROWS;

var lineFolding = true;
var styleeles = printstylestr.split(",");

function printing()
{
    if (periodvalue ==1)
    {
        if (rr>=0 && cc>=0)
        U(rr,cc);
    }
    styleeles = printstylestr.split(",");
    if (parseInt( styleeles[10]) < 800) styleeles[10] = 800;
    var str = '';
    str += (" <table border=0 valign=center  align=center > <tr>   <td align=center>");
    // str += (unititle(textmsg[735],"outset2")+ "<br>");
    str += ("<br><form rel=opener name=f  >" + textmsg[736] + "<input class=left name=logo size=40 onblur=\"document.f.logoimg.src=this.value\" value=\"" + styleeles[0] + "\"><br><img name=logoimg src=\"" + styleeles[0] + "\"><br><br>");
    str += (fontstr(textmsg[441], "tfontname", styleeles[1], "tfontsize", styleeles[2], "tfontcolor", styleeles[3], DBGCOLOR, 1));
    str += ("<br> " + textmsg[741] + "<input class=left name=tborder value=\"" + styleeles[10] + "\" size=6><br><br>");
    str += ("<div style=background-color:#808080><TABLE width=100% cellpadding=3 cellspacing=1 class=outset1>");
    str += ("<TR style=\"background:" + beheading +"\"><td  width=100% colspan=" + 6 + ">");

    str += (fontstr(textmsg[739], "hfontname", styleeles[4], "hfontsize", styleeles[5], "hfontcolor", styleeles[6], BBGCOLOR, 2));
    str += ("</td></tr>");
    var ii=0;
    for (var i = 0; i < numCols; i++)
    {
        if (fields[j] == 'onclose' || fields[j] == 'onbegin' || fields[j] == 'cellonfocus' || fields[j] == 'cellonblur' ||
                fields[j] == 'onsaved' || fields[j] == 'exbut')
            continue;
        if (ii%2 == 0) str += "<tr>";
        str += ("<td style=\"background-color:" + DBGCOLOR + "\" valign=top style=color:" + styleeles[6] + ";font-family:" + styleeles[4] + ";font-size:" + styleeles[5] + ">" + labels[i] + "</td><td> <nobr> " + textmsg[732] + " <input type=checkbox style=background-color:transparent name=c" + i + " value=on onclick=setcustom(((this.checked)?'t':'f')," + i + ") ");
        if (ctype[i] == 'h'|| ctype[i] == 'L')
            str += (" checked ");
        str += ("></nobr></td><td><nobr>");
        //if (ctype[i]=='t' || ctype[i]=='a'|| ctype[i]=='T' || ctype[i]=='A' || ctype[i]=='u' || ctype[i]=='U')
        {
            str += (textmsg[733] + " <input class=left size=2 name=w" + i + " value=\"" + fsize[i] + "\" onkeypress=\"return isDigitEvent()\" onchange=setcustom(this.value," + i + ")>");
        }
        str += ("</nobr></td>");
        if (ii%2 == 1) str += "</tr>";
        ii++;
    }
    if (ii%2 ==1) str += "<td colspan=3></td></tr>";
    str += ("</tr><tr height=30><td width=100% align=left colspan=" + 6 + " bgcolor=" + TBGCOLOR + "> &nbsp;</td></tr>");
    str += ("<tr  height=30><td width=100% align=left colspan=" + 6 + ">");
    str += (fontstr(textmsg[740], "cfontname", styleeles[7], "cfontsize", styleeles[8], "cfontcolor", styleeles[9], TBGCOLOR, 3));
    str += ("</td></tr><tr  height=30><td width=100% align=left colspan=" + 6 + "  bgcolor=" + TBGCOLOR + "><nobr> " + textmsg[742] + " <input class=left name=rowselect size=22 value=\"" + rowselection + "\" onblur=passRowselect(this.value)> (" + textmsg[750] + ":  13-15,18) </nobr><br>" + textmsg[743] + "<input type=checkbox name=linefolding onchange=passLineFolding(this.checked) checked=" + lineFolding + " > </td></tr>");
    str += ("</table></div> <br><br>");
    str += ("<input type=button name=btn1   class=GreenButton style=background-color:#CC0000;color:white;font-weight:700;width:" + butwidth(textmsg[408]) + "px  value=\"" + textmsg[744] + "\" onclick=resetdefualtprint()><input type=button name=btn     class=GreenButton style=background-color:#00BBBB;color:white;font-weight:700;width:" + butwidth(textmsg[408]) + "px    value=\"" + textmsg[408] + "\" onclick=go()>");
    if (typeof(downloadcsv) == 'function')
        str += "<input type=button name=btn     class=GreenButton style=background-color:#00BBBB;color:white;font-weight:700;width:" + butwidth(textmsg[408]) + "px    value=\"CSV\" onclick=downloadcsv()>";
    str += "</form></td></tr></table>";
    myprompt(str, null, null, textmsg[735]);
}

function go()
{
    if (document.f.tfontname.selectedIndex >= 0)
    {
        printstyle(document.f.logo.value, document.f.tfontname.options[document.f.tfontname.selectedIndex].value, document.f.tfontsize.value, document.f.tfontcolor.value, document.f.tborder.value, document.f.hfontname.options[document.f.hfontname.selectedIndex].value, document.f.hfontsize.value, document.f.hfontcolor.value, document.f.cfontname.options[document.f.cfontname.selectedIndex].value, document.f.cfontsize.value, document.f.cfontcolor.value,null);
    }
}

function testfont1(i, th, j, c)
{
    var k = th.selectedIndex;
    if (k > -1)
    {
        testfont(i, th.options[k].value, j, c);
    }
}
function testfont(i, v, j, c)
{
    styleeles[i + 3 * (j - 1)] = v;
    var z = null;
    for (var ii = 0; ii < document.f.elements.length; ii++)
        if (document.f.elements[ii].name == 'sample' + j)
        {
            z = document.f.elements[ii];
            break;
        }
    z.style.cssText = 'background-color:' + c + ';border:0;font-name:' + styleeles[1 + (j - 1) * 3] + ';font-size:' + styleeles[2 + (j - 1) * 3] + ';color:' + styleeles[3 + (j - 1) * 3];
}


function passRowselect(rs)
{
    rowselection = rs;
}

function isinrange(k)
{
    var rowselectionarray = rowselection.split(/[ ]*,[ ]*/);
    k++;
    for (var i = 0; i < rowselectionarray.length; i++)
    {
        var tt = rowselectionarray[i].split(/[ ]*-[ ]*/);

        if (tt.length == 1)
        {
            if (rowselectionarray[i] == '' + k)
                return true;
        }
        else
        {
            var b1 = parseInt(tt[0]);
            var b2 = parseInt(tt[1]);

            if ('' + b1 == 'NaN' || '' + b2 == 'NaN')
                continue;
            if (b1 <= k && b2 >= k)
                return true;
        }
    }
    return false;
}

function passLineFolding(b)
{
    lineFolding = b;
}

function keeptext2html(txt)
{
    return txt.replace(/ /g, '&nbsp;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, '<br>');
}
function morearray(a,s)
{
    a[a.length] = s;
}


var existingUT = UT;
//UT = function()
{
    // existingUT(counter,"+j+");
    // if (ctype[cc]!='a')
    //    holdvalues[counter + "_" + cc] = v;
    // else
    //    holdvalues[counter + "_" + cc] = '1';
}

function stophourglass(nv)
{
    if (typeof window.document.execCommand == 'function')
        nv.document.execCommand('Stop');
    else if (typeof window.stop == 'function')
    nv.stop();
    nv.onmouseover = null;
}
if (document.forms.length > 0)
    window.onbeforeunload = null;
enableattachman('counter');
if ( datapresentformat == 'DataLongForm') 
    onbegin += ';attonbegin();';
 

function gooddim()
{
    var w = thispagewidth();
    var h = thispageheight();
    
    parent.setgooddim(w+10,h+10);
}
 
if (window.name == 'openlink')
{
    onbegin += ';gooddim();';
}
var onloadbeforemfdu;
if (typeof window.onload == 'undefined')
{
    window.onload = doonbegin;
}
else
{
    onloadbeforemfdu = window.onload;
    window.onload = function()
    {
        onloadbeforemfdu();
        doonbegin();
    }
}

buildactmenu = function()
{
    var cont = document.getElementById('contbutt');
    if (cont!=null)
    recurainput(cont);
}
 

 



