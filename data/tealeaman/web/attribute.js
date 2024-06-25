function makef4()
{
    if (!onmydomain(opener))
        return;
    var fieldname = opener.passfieldname();
    if (fieldname == null || fieldname == '')
    {
        myprompt("no  field names");
        return;
    }

    var fieldnames = fieldname.replace(/^[ ]+/, '').replace(/[ ]+$/, '').split(/[ ]*,[ ]*/)
    var leftlabels = ['Attribute', 'Field Name', 'WordorCode', 'Type', 'Position', 'Display As'];
    leftlabels = [textmsg[1394], textmsg[128], textmsg[1083], textmsg[452], textmsg[1807], textmsg[1451]];

    var f = new Array(5);
    var nn = fieldnames.length;
    if (numRows > 0 && mat[0][3] != null)
    {
        mat[0][3] = mat[0][3].replace(/[ ]/g, '').replace(/[^0-9]/g, ',');
    }
    for (var i = 1; i < 3; i++)
    {
        if (numRows > 0)
            f[i] = mat[0][i].replace(/^[ ]+/, '').replace(/[ ]+$/, '').replace(/,$/, '').split(/[ ]*,[ ]*/);
        else
            f[i] = defaultRecord[i].replace(/^[ ]+/, '').replace(/[ ]+$/, '').replace(/,$/, '').split(/[ ]*,[ ]*/);
        if (nn < f[i].length)
            nn = f[i].length;
    }
    if (numRows > 0 && mat[0][3] != null)
    {
        for (i = nn; i < 2 * nn + 10; i++)
            mat[0][3] = mat[0][3].replace(".[ ]*" + i, "");
        f[3] = mat[0][3].replace(/^[ ]+/, '').replace(/[ ]+$/, '').replace(/,$/, '').split(/[ ]*,[ ]*/);
    } else if (defaultRecord[3] != null)
    {
        for (i = nn; i < 2 * nn + 10; i++)
            defaultRecord[3] = defaultRecord[3].replace(".[ ]*" + i, "");
        f[3] = defaultRecord[3].replace(/^[ ]+/, '').replace(/[ ]+$/, '').replace(/,$/, '').split(/[ ]*,[ ]*/);
    }
    var positionr = new Array(nn);
    for (var j = 0; j < nn; j++)
    {
        if (j >= f[3].length)
            f[3][j] = j;
        if (j >= f[3].length || isNaN(f[3][j]))
            positionr[j] = j;
        else
            positionr[parseInt(f[3][j])] = j;
    }
    var needadddel = false;
    var allentries = "|" + leftlabels[0] + "|";
    for (j = 0; j < nn; j++)
        allentries += ",|" + j + "|";
    allentries += ";|" + leftlabels[1] + "|";
    for (j = 0; j < fieldnames.length; j++)
        allentries += ",|" + fieldnames[j] + "|";
    if (j < nn)
        needadddel = true;
    for (; j < nn; j++)
        allentries += ",||";

    for (i = 1; i < 4; i++)
    {
        allentries += ";|" + leftlabels[i + 1] + "|";
        for (j = 0; j < f[i].length; j++)
            allentries += ",|" + f[i][j] + "|";
        if (j < nn)
            needadddel = true;
        for (; j < nn; j++)
            allentries += ",||";
    }
    allentries += ";|" + leftlabels[5] + "|";
    for (j = 0; j < positionr.length; j++)
        allentries += ",|" + fieldnames[positionr[j]] + "|";
    if (j < nn)
        needadddel = true;
    for (; j < nn; j++)
        allentries += ",||";
    if (needadddel)
    {
        allentries += ";||";
        for (j = 0; j < nn; j++)
        {
            allentries += ",||";
        }
    }


    return allentries;
}



function makedefault()
{
    if (!onmydomain(opener))
        return;
    var fieldname = opener.passfieldname();
    if (fieldname == null || fieldname == '')
    {
        myprompt("no  field names");
        return;
    }
    var fieldnames = fieldname.replace(/^[ ]+/, '').replace(/[ ]+$/, '').split(/[ ]*,[ ]*/)

    var nn = fieldnames.length;

    defaultRecord[1] = fieldname;
    defaultRecord[2] = opener.passctypes();
    defaultRecord[3] = '0';
    defaultRecord[5] = opener.document.thisform.title.value;
    for (var j = 1; j <= nn; j++)
        defaultRecord[3] += "," + j;
    defaultRecord[0] = document.location.toString().replace(/.*TaskName=([\w]+).*/, '$1');



}

function leftmove(j, y)
{
    var thetable = whichcell(4, 0).getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('table')[0];
    var nn = thetable.rows[0].cells.length;
    if (j + y == nn || j + y == -1)
        return;
    for (var rw = 2; rw < 4; rw++)
    {
        var holdend = thetable.rows[rw].cells[j].innerHTML;
        thetable.rows[rw].cells[j].innerHTML = thetable.rows[rw].cells[j + y].innerHTML;
        thetable.rows[rw].cells[j + y].innerHTML = holdend;
    }

}


function setback4()
{
    var allentry = retrv(0, 4);
    var allentries = allentry.split(/;/);
    for (var i = 1; i < 4; i++)
    {
        if (allentries[i + 1] != null)
            setv(0, i, allentries[i + 1].replace(/\|/g, '').replace(/[^,]+,/, ''));
    }

}


function add1col(j)
{
    var thetable = whichcell(4, 0).getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('table')[0];
    var nn = thetable.rows[0].cells.length;
    for (var rw = 2; rw < 4; rw++)
    {
        var holdend = thetable.rows[rw].cells[nn - 1].innerHTML;
        for (var i = nn - 1; i > j; i--)
        {
            thetable.rows[rw].cells[i].innerHTML
                    = thetable.rows[rw].cells[i - 1].innerHTML;
        }
        thetable.rows[rw].cells[j].innerHTML = holdend;
    }
    valuechanged[0] = true;
}
function del1col(j)
{
    var thetable = whichcell(4, 0).getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('table')[0];
    var nn = thetable.rows[0].cells.length;
    for (var rw = 2; rw < 4; rw++)
    {
        for (var i = j; i < nn - 1; i++)
        {
            thetable.rows[rw].cells[i].innerHTML
                    = thetable.rows[rw].cells[i + 1].innerHTML;
        }
        thetable.rows[rw].cells[nn - 1].innerHTML = "";
    }
    valuechanged[0] = true;
}
var inittra = [];
var helptra = [];
var allfs = new Array();
var whichview = "a";
if (opener != null && typeof (opener.getwhichview) != 'undefined' && numRows > 0)
    whichview = opener.getwhichview();

function gethelp()
{
    var helpm = (new CSVParse(opener.document.thisform.help.value, "'", ",", "\n")).nextMatrix();
    var initmap = [];
    var helpmap = [];
    var initstr = "";
    var helpstr = "";
    
    for (var j = 0; j < helpm.length; j++)
    {
        if (helpm[j][2] != null && helpm[j][2] != '')
        {
            initmap[helpm[j][0]] = helpm[j][2];
            initstr += helpm[j][0] + "=" + helpm[j][2] + "\n";
            inittra[j] = helpm[j][2];
            allfs[j] = helpm[j][0];
        }
        if (helpm[j][4] != null && helpm[j][4] != '')
        {
            helpmap[helpm[j][0]] = helpm[j][4];
            helpstr += helpm[j][0] + ":" + helpm[j][4] + "\n";
            helptra[j] = helpm[j][4];
            allfs[j] = helpm[j][0];
        }
    }
    if (numRows>0)
    {
        if ( mat[0][6] == '')
        mat[0][6] = helpstr.replace(/\n$/, '');
    }
    else
    {
        defaultRecord[6] = helpstr.replace(/\n$/, '');
    }
    if (numRows>0)
    {
        if (mat[0][8] == '')
        mat[0][8] = initstr.replace(/\n$/, '');
    }
    else
    {
        defaultRecord[8] = initstr.replace(/\n$/, '');
    }
}

function enablegoogle()
{
    if (langcode == 'en')
        return;
    if (whichview != 'innertable' && mat[0][1].replace(/[ |0-9|,]/g, '') != '')
    {
        var x = ele(0, 1).parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling.getElementsByTagName('table')[0];
        var r = x.insertRow(-1);
        var c = r.insertCell(-1);
        c.innerHTML = "Translate";
        c.className = "GreenButton";
        c.onclick = function () {
            doij(1);
        }
    }
    x = ele(0,5).parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling.getElementsByTagName('table')[0];
    r = x.insertRow(-1);
    c = r.insertCell(-1);
    c.innerHTML = "Translate";
    c.className = "GreenButton";
    c.onclick = function () {
        doij(5);
    }
    x = ele(0, 6).parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling.getElementsByTagName('table')[0];
    r = x.insertRow(-1);
    c = r.insertCell(-1);
    c.innerHTML = "Translate";
    c.className = "GreenButton";
    c.onclick = function () {
        doij(6);
    }
    x = ele(0, 8).parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling.getElementsByTagName('table')[0];
    r = x.insertRow(-1);
    c = r.insertCell(-1);
    c.innerHTML = "Translate";
    c.className = "GreenButton";
    c.onclick = function () {
        doij(8);
    }
}
if (numRows == 0)
{
    makedefault();
    defaultRecord[4] = makef4();
} else
{
    mat[0][4] = makef4();
}
if (whichview == 'innertable')
{
    onbegin = "installmouse();enablegoogle();if (numRows>0) valuechanged[0] = true;";
    onsave = "setback4()";
    gethelp();
} else
{
    ctype[1] = ctype[2] = ctype[3] = 'a';
    ctype[4] = 'h';
    onbegin = "enablegoogle();";
    gethelp();
}


var downj = -1;
var timeclicking = -1;
function installmouse()
{
    for (var j = 0; ; j++)
    {
        var cell = document.getElementById('Igd' + j + '_0');
        if (cell == null)
            break;
        cell.innerHTML = "<nobr>" + cell.innerHTML + "</nobr>";
    }
    for (var j = 0; ; j++)
    {
        var cell = document.getElementById('Igd0_' + j);
        if (cell == null)
            break;
        cell.onclick = function ()
        {
            if (downj == -1)
            {
                downj = parseInt(this.id.replace(/[^\-]+\-/, ''));
                timeclicking = (new Date()).getTime();
            } else
            {
                var nows = (new Date()).getTime();
                if (nows - timeclicking < 2000) {
                    var j = parseInt(this.id.replace(/[^\-]+\-/, ''));
                    for (var k = 2; k < 4; k++)
                    {
                        var t = document.getElementById('Igd' + k + '_' + downj).value;
                        for (var l = downj; l <= j; l++)
                        {
                            if (l < j)
                                document.getElementById('Igd' + k + '_' + l).value = document.getElementById('Igd' + k + '_' + (l + 1)).value;
                            else
                                document.getElementById('Igd' + k + '_' + l).value = t;
                        }
                    }
                    downj = -1;
                } else
                {
                    downj = parseInt(this.id.replace(/[^\-]+\-/, ''));
                    timeclicking = nows;
                }
            }
        }
    }
}
var jj = 0;
function encodeURI1(j)
{
    if (j < 6)
        return encodeURI(retrv(0, j));
    else if (j == 6)
        return encodeURI(helptra[kk]);
    else if (j == 8)
        return encodeURI(inittra[kk]);
}
var kk = 0;
function doij(j)
{
    if (jj != j && (j > 5))
    {
        kk = 0;
        var  p = (new CSVParse(retrv(0,j),"\"","=:","\n")).nextMatrix();
        if (j == 6){ helptra = new Array(); allfs = new Array();
        for (var k=0; k < p.length; k++)
        {
            helptra[k] = p[k][1];allfs[k] = p[k][0];
        }
    } else if (j == 8){ inittra = new Array();allfis = new Array();
        for (var k=0; k < p.length; k++)
        {
            allfis[k] = p[k][0];inittra[k] = p[k][1];
        }
    }
    }
    jj = j;
    var y = ele(0, jj);
    if (y == null)
        return;

    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        xmlhttp = new XMLHttpRequest();
    } else
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var s = xmlhttp.responseText;
            var result = JSON.parse(s);
            var x = '';
            for (var j = 0; j < result[0].length; j++)
                x += result[0][j][0];
            var y = ele(0, jj);
            if (jj == 1)
                y.value += "\n" + x;
            else if (jj == 6)
                y.value += "\n" + allfs[kk] + ":" + x;
            else if (jj==8)
                y.value += "\n" + allfis[kk] + "=" + x;
            else y.value +=  "  " + x;
            y.rows = 20;
            if (jj == 6 && kk < helptra.length)
                kk++;
            else if (jj == 8 && kk < inittra.length)
                kk++;
        }
    }
    if (jj == 6)
        while (kk < helptra.length && helptra[kk] == null)
            kk++;
    else if (jj == 8)
        while (kk < inittra.length && inittra[kk] == null)
            kk++;
    var url = "https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=en&tl=" + encodeURI(langcode) + "&q=" + encodeURI1(jj);
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}