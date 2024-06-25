/*************************************************************************
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
 
function formattest(x)
{
    x = x.replace(/^[\n]+/, '');
    var i1 = x.indexOf("\n");
    var i2 = x.indexOf("\n", i1 + 2);
    x = x.substring(0, i1) + x.substring(i2);
    return x;
}
function formatstr2(x,fmt)
{
    var s = '';
    var xs = x.replace(/\n/g,' \n').split(/\n/);
    for (let y of xs)
    {
        s += formatstr(y,fmt) + '<br>';
    }
    return s;
}
function myformatstr(x, f)
{
   if(x == null) x = '';
   if (''+ f === '0' || ''+ f === '2')
      x = x.replace(/<([a-z])/ig,'< $1');
   return  formatstr(x,f); 
}
var thesame = function(a,b)
    {
        let a1 = a.replace(/[0-9|\.|\/]/g,'') ;
        if (a1=== ''  && b.replace(/[0-9|\.|\/]/g,'') ==='' && a!=='' && b!== null)
        {
            if ((a.indexOf('.') >= 0 || b.indexOf('.') >= 0) && (a.indexOf(b) === 0 || b.indexOf(a) === 0))
               return true;
            return (eval(a.replace(/,/g,'')) === eval(b.replace(/,/g,'')));
        }
        return a === b;
    };
function compareans(Z,p)
{
    var x = mat[Z][13];
    var hw;
    var asg = null;
    var parse = new CSVParse(x, "'", ",", "\r\n");
    hw = new Hwtake('rev', mat[Z][18], mat[Z][19], '', mat[Z][20], mat[Z][23], Z);
    var pq = new CSVParse(mat[Z][20], "|", ",", ";");
    asg = pq.nextMatrix(true);
    var sol = parse.nextMatrix();
    var qarr = hw.quesnums;
    var numq = qarr.length;
    var atd = new Array();
    var num = hw.quesnums[p];
    var j = parseInt(num);
    var bb = false;
    var j0 = 0;
    if (asg != null)
    {
        j0 = 0;
        for (; j0 < asg.length; j0++)
        {
            if (num == asg[j0][0])
                break;
        }
        bb = (j0 < asg.length && asg[j0].length > 2);
    }
    var bs = false;
    var j1 = 0;
    for (; j1 < sol.length; j1++)
    {
        if (sol[j1][0] == num)
        {
            bs = true;
            break;
        }
    }
    //num .shuffled .pts .score .outcome .timestay .fmt . question .solution .answer .comments  
    
    var quess = hw.questarr[j];
    let nbl = quess.split(/___[_]*/).length - 1;
    if (quess == null)
        quess = '';
    var submitted = (bs ? sol[j1][1] : '');
    var originalanswer = (hw.answqrr[j] != null ? hw.answqrr[j] : '');
    var ll = originalanswer.indexOf('why:');
    let whyblock = '';
    if (ll>0){whyblock = originalanswer.substring(ll); originalanswer  = originalanswer.substring(0,ll).replace(/[\n| ]+$/,''); }
    var scale = (hw.ptlist[j] == null ? 1 : parseFloat(hw.ptlist[j]));
    var rfmt = (bs? sol[j1][3] : mat[Z][23]);
    let lscore = 0;
    let oarr = originalanswer.replace(/\n/g, ' \n').split(/\n/);
    for (let j = 0; j < oarr.length; j++)
    {
        oarr[j] = oarr[j].replace(/^[ ]+/, '').replace(/[ ]+$/, '');
    }
    var ys = textmsg[1937].split(/@/);
    let z = asg[p][2]; let zs = null;
    if (z==null) z = '';
    if (z!=null)
      zs = z.split(/\+/); 
     
    let s = '<table style=border-collapse:collapse;border-color:#ddcc88;border-radius:3px border=1 cellspacing=4 cellpadding=3 width=100% ><tr bgcolor=' +BBGCOLOR +'><td style=background-image:linear-gradient(' + BBGCOLOR+',' + TBGCOLOR+');white=space:nowrap >' + textmsg[1629] + '</td><td style=background-image:linear-gradient(' + BBGCOLOR+',' + TBGCOLOR+');white=space:nowrap >' + textmsg[457] + '</td><td align=right  style=background-image:linear-gradient(' + BBGCOLOR+',' + TBGCOLOR+');white=space:nowrap >' + (zs==null? ys[0]:textmsg[463]) + '</td></tr>';
    if (submitted.length == 0)
    {
        s = textmsg[802];
        //return;
    }
    let arr = null;
    if (submitted.includes('<br>')) arr = submitted.replace(/<br>$/,'').split(/<br>/);
    else arr = submitted.replace(/\n/g, ' \n').split(/\n/);
    let sm = 0;
     
    for (let j = 0; j < nbl; j++)
    {
        let v = 0;
        if (arr[j] != null) 
        {
            arr[j] = arr[j].replace(/^[ ]+/, '').replace(/[ ]+$/, '');
            if (zs!=null && z[j]!=null)
            {
                s += '<tr bgcolor=' +TBGCOLOR +'><td style=white-space: nowrap;>' + myformatstr(arr[j],rfmt) + '</td><td  style=white-space: nowrap;>' + myformatstr(oarr[j],mat[Z][23]) + "</td><td  align=right>" + zs[j]  + "</td></tr>\n";
            }
            else if (arr[j] != '')
            {
                v = 1;
                let v2 = thesame(arr[j], oarr[j]);
                if (v2 == false)
                {
                    let tmp = similarnum(arr[j], oarr[j]);
                    if (tmp <= 1)
                        v = tmp;
                    else
                    {
                        try {
                            if (oarr[j] != null && oarr[j].length > 0)
                                v = similarity(arr[j], oarr[j]) / oarr[j].length;
                        } catch (e) {
                        }
                        if (v > 1)
                            v = 1;
                        v = 1 - v;
                        if (v > 0.9 && oarr[j]!=null && arr[j]!=null && arr[j]!='' && oarr[j].length < 25 && isNaN(oarr[j])) v = 1;
                    }
                }
                sm += v;
                s += '<tr bgcolor=' +TBGCOLOR +'><td style=white-space: nowrap;>' + myformatstr(arr[j],rfmt) + '</td><td  style=white-space: nowrap;>' + myformatstr(oarr[j],mat[Z][23]) + "</td><td  align=right>" + (100 * v).toFixed(0) + "%</td></tr>\n";
            }
        } else
        {    
            arr[j] = '';
            s += '<tr bgcolor=' +TBGCOLOR +'><td style=white-space: nowrap;>  </td><td  style=white-space: nowrap;>' + myformatstr(oarr[j],mat[Z][23]) + "</td><td  align=right>0</td></tr>\n";
        }
        
    }
    sm /= arr.length;
    lscore = (sm * scale).toFixed(1);if (scale == 1 && lscore>0.5) lscore = 1;
    if (zs == null) 
        s += "<tr bgcolor=lightyellow ><td colspan=2 align=right>Levenshtein " + textmsg[463] + "</td><td align=right>" + lscore +'/' + scale + "</td></tr>";
    else
        s += "<tr bgcolor=lightyellow ><td colspan=2 align=right> " + textmsg[194] + "</td><td align=right>" + eval1(asg[p][2],scale).toFixed(1) +'/' + scale + "</td></tr>";
    if (ll>0)
    s += '<tr><td colspan=3 bgcolor=white>' + whyblock + '</td></tr>';
    s += "</table>";
    if (zs==null) s+= ys[1];
    myprompt(s, null, null, textmsg[1887].split(/@/)[0]); 
    if (rfmt==2 || mat[Z][23]==2){ LaTexHTML.formatele(promptwin);}
   
    promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].onclick = function()
    {
         LaTexHTML.deformat(promptwin);
         closeprompt();
     };
    
}
//assignname, Score, at, Notes, Format, Options, Semester, course, sid, timenow,
//         0,    1,  2,  3 ,    4,      5,        6,        7,      8,   9 
//Type,  sessionname, due, Content, attach, dummy, status, subs,question, answer, Assess, Attachat, Scale�� aformat
//10,     11,         12,       13,    14,    15,     16,   17,      18,     19,     20,        21,    22,      23
for (var ZZ=0; ZZ < numRows; ZZ++)
{
    if (mat[ZZ][16]=='3' || mat[ZZ][1] == '-1')
    { 
        mat[ZZ][1] = '-1';
        if (mat[ZZ][16]=='3'){ mat[ZZ][16]= '2';
        mat[ZZ][19] = mat[ZZ][20] = '';
        mat[ZZ][21] = mat[ZZ][21].replace(/^[^@]+@[^@]@_[^,]+,/, "").replace(/,[^@]+@[^@]@_[^,]+,/, ","); }
    } 
}
var timestart = 0, timedue = 0;
var timethis = Math.round((new Date()).getTime() / 1000);

var winhandle = null;
if (typeof(helpbuttons)=='undefined')
    var helpbuttons = '';
else{ helpbuttons = '';if (helpbuttons!=null)
{
    helpbuttons = helpbuttons.replace(/width:[0-9]+px;height:[0-9]+px;/g, '');
}
}


datapresentformat = 'DataForm';
var attheader = '';
var numIframes = 0;
var colspan = 2;

theight = screen.height - 10;
var buttons = "";
var rsstr = "";
var hides = '';
 
var issubmit = (numRows == 1 && mat[0][17] == '2' && window.name.indexOf("lower") >= 0);

if (numRows == 2 && mat[1][17] == '2')
{
    for (var j = 0; j < numCols; j++)
        defaultRecord[j] = mat[1][j];
    numRows = 1;
}
NUMROWS = numRows;
 
 
for (var j = 0; j < numCols; j++)
{

    x = ctype[j].toLowerCase();
    if (ctype[j]=='L')
   {
     
   }
   else 
    if (x == 'a' || x == 'i' || x == 'n' || x == 'u')
    {
        if (fsize[j] == null || fsize[j] == '')
        {
            if (x == 'n')
            {
                fsize[j] = "10";
                ffsize[j] = "0";
            }
            else if (x == 'u')
            {
                fsize[j] = "";
                ffsize[j] = "";
            }
            else
            {
                fsize[j] = "30";
                ffsize[j] = "5";
            }
        }
        else
        {
            var sa = fsize[j].indexOf("_");
            if (sa > 0)
            {

                ffsize[j] = fsize[j].substring(sa + 1);
                fsize[j] = fsize[j].substring(0, sa);

            }
            else
            {
                if (x == 'n')
                    ffsize[j] = "0";
                else if (x == 'u')
                    ffsize[j] = "";
                else
                    ffsize[j] = "5";
            }
        }
    }
    else if (x == 'm' && (fsize[j] == null || fsize[j] == ""))
    {
        fsize[j] = '' + (parseInt(timeformat.length) - 2);
    }
    else if (x == 'l' && (fsize[j] == null || fsize[j] == ""))
        fsize[j] = '2';

}
//webserviceAllbuts +=  '<input type=button class=BlueButton  onclick="ResizeUploaded.attachman(ele(0,14))" value="' + textmsg[787] + '" >';
 
var numWsinputs = 0, numWsopts = 0;
var jj = 0, j;
if (mm > 0)
{
    while ((j = webserviceAllbuts.indexOf('<input ', jj)) >= 0) {
        jj = j + 1;
        numWsinputs++;
    }
    if (webserviceAlloptions != '')
    {
        jj = 0;
        while ((j = webserviceAlloptions.indexOf('<input ', jj)) >= 0) {
            jj = j + 1;
            numWsopts++;
        }
    }
}
if (numWsinputs + numWsopts > 6) webserviceAlloptions = webserviceAlloptions.replace(/size=26/, 'size=3');

function needupdate(Z)
{
    if (mat[Z][10] == '1' || mat[Z][10] == '3' || mat[Z][10] == '4')
        return false;
    var xz = parseInt(mat[Z][9]) - parseInt(mat[Z][2]); // how long submitted
    var b1 =  (xz < 120 && mat[Z][1] == '-1');
    var b2 = parseInt(mat[Z][12]) > parseInt(mat[Z][9]);//||          // just submit
    var b3 = (mat[Z][10] == '0');                      // is assignment
    var b4 = (mat[Z][1] == '-1');                     // ungraded
    var bb = b1 || b2&&b3&&b4;
    return bb;
}
//AND (grade < 0 OR grade=0 AND content='' AND  comment='Test Aborted') AND ||timenow|| <= ||due||
function modifylookup()
{
    var shift = 6 + numWsinputs + numWsopts;
    for (j = 13; j < numCols; j++)
        lookup[j] = shift + j;
}
modifylookup();
var dummycount = 0;
function makedummy()
{
    writenow("<input type=hidden name=dummyhidden" + (dummycount++) + ">");
}
var Lstr = "", borderstr;
var labelwidth0 = Math.round((0.7 + charwidthrate()) * font_size);
function makelabel(j) {
    labels[14] = textmsg[787];
    writenow("<span  style=\"width:" + labelwidth0 + "px\" ><b><nobr>" + labels[j] + "</nobr></b></span>");
}
function setcounter(Z) {
    counter = Z;
}
var runningn = 0;
var eval1 = function(s, u)
{
    let y = parseFloat(''+u);
    try{
        let x =  eval(''+s);
        if (x >= y) 
            return y;
        else if (Math.round(x) == x)
              return Math.round(x);
        else
            return Math.round(10*x)/10;
    } catch(e) {return 0;}
};
function nonegative(box,j)
{
    if (j == 1)
    {
        if(box.value == '-1')
           box.value=textmsg[236];
        box.style.width='60px';
    }
}
function makecontrol(Z, j)
{

    var str = null, readonly;
    var gradestr1 = '';
    if (dtype[j])
        classrl = "right";
    else
        classrl = "left";
    if (!issubmit && j == 1)
    {
        readonly = "border:0;background-color:" + TBGCOLOR + ";color:red;font-size:" + font_size + "px;"  ;
    }    
    else if (ctype[j] == ctype[j].toUpperCase())
    {
        readonly = "border:0;background-color:" + TBGCOLOR + ";color:" + IBGCOLOR +";font-size:" + font_size + "px;";
    }
    else
    {
        readonly = "border:0;background-color:" + TBGCOLOR + ";color:black;font-size:" + font_size + "px;"
    }
    var tmpz = '';

    switch (ctype[j])
    {

        case 'a':
        case 'A':

            writenow("<table cellspacing=0 cellpadding=0><tr><td>");
            writenow("<textarea style=\"" + readonly + ";border:1px #b0b0b0 solid!important\" rows=" + ffsize[j] + " name=" + fields[j]);
            writenow(" onfocus=\"setcounter(" + Z + ");S(counter," + j + ")" + (issubmit ? (";textboxhint(this,0,'" + textmsg[219] + "');largertxt();") : ';resizeCont();') + "\"");
            writenow(" onblur=\"U(counter," + j + ");textboxhint(this,1);\"");
            if (issubmit)
                writenow(" onkeypress=\"return displaytxt(this,event)\"");
            else
                writenow(" onkeypress=\"return mkstrike(this,event)\"");
            writenow(" onchange=UT(counter," + j + ")   tabindex=" + j + "></textarea>\n");
// if (issubmit)
            writenow("</td></tr><tr height=2><td id=barfather" + Z + "_" + j + "><img id=horbar" +
                    Z + "_" + j + " src=\"image/horbar.jpg\" style=\"cursor:s-resize;height:2px;width:100%\" ></img></td></tr></table>\n");
            break;


        case "m":
            writenow("<INPUT style=\"border:1px #b0b0b0 solid;height:23!important;background:#fff;" + readonly + "\" MAXSIZE=" + maxsize[j] + " SIZE=" + fsize[j] + " name=" + fields[j]);
            writenow(" onfocus=setcounter(" + Z + ");S(counter," + j + ")");
            writenow(" onblur=U(counter," + j + ")");
            writenow(" onchange=UT(counter," + j + ")  ");
            writenow(" tabindex=" + j + ">\n");
            break;

        case "M":
            writenow("<INPUT  type=hidden name=" + fields[j] + ">");
            writenow("<nobr>" + timestr2(mat[runningn][j]) + "</nobr>");
            break;

        case "t":
        case "n":
           
        case "T":
        case "N":
            
            writenow("<INPUT   style=\"" + ((j == 0) ? 'text-align:right;width:70px;border:1px #b0b0b0 solid;' : ( (j == 1)?'text-align:right;width:70px;border:0px':'text-align:right;width:150px;border:0px;' )) + "height:21!important;" + readonly + "\"  MAXSIZE=" + maxsize[j] + " SIZE=" + fsize[j] + " name=\"" + fields[j]);
            writenow("\" onfocus=setcounter(" + Z + ");S(counter," + j + ")");
            writenow(" onblur=U(counter," + j + ")");
            writenow(" onchange=\"UT(counter," + j + ");nonegative(this," + j +")\"   tabindex=" + j + ">\n");
            break;

        case 'k':
        case 'K':
            writenow("<input style=background-color:" + DBGCOLOR + ";color:" + IBGCOLOR + ";font-weight:700;border:0 readonly size=2 name=" + fields[j] + " value=\"&bull;&bull;&bull;\" onClick=\"passedCol=" + j + ";openit1(mat[Z][" + j + "]+'&existing='+encodeURIComponent(retrv(Z," + (j - 1) + ")),Z)\">");
            break;
        case 'h':
        case 'H':
            writenow("<input  type=hidden  name=\"" + fields[j] + "\" value=\"" + mat[Z][j] + "\">");
             
            break;

    }

}

function reformate(x, Z )
{
    var hw;
    var asg = null;
    var due = (mat[Z][19] != '' && mat[Z][1] != '-1'); 
    var parse = new CSVParse(x, "'", ",", "\r\n");
    var attstr = ResizeUploaded.unzip(mat[Z][21]); 
     
    if (due)
    {
        hw = new Hwtake('rev',mat[Z][18],mat[Z][19],  attstr,  mat[Z][20],mat[Z][23],Z);
        var pq = new CSVParse(mat[Z][20],"|", ",", ";");
        asg = pq.nextMatrix(true);
        if (mat[Z][4] == '6') 
        {
             
            for (var j=0; j < asg.length-1; j++)
            {
                var comms = JSON.parse(asg[j][3]);
                var tt = '';
                for (var jj=0; jj < comms.length; jj++)
                {
                    tt += comms[jj].c + "<br>";
                }
                asg[j][3] = tt;
            }
        }
    }
    else
    {
        hw = new Hwtake('rev',mat[Z][18],'', attstr.replace(/^[^@]+@[^@]@_[^,]+,/,"").replace(/,[^@]+@[^@]@_[^,]+,/,","), mat[Z][20],mat[Z][23],Z,true);
    }
     
    var txt = "";
    addcss2head(Z, hw.divs);
    
    var atd = null;
    
    //if (mat[Z][20].length > 3)
    {
        var sol = parse.nextMatrix();
        var qarr = hw.quesnums;
        var numq = qarr.length;
         
        atd = new Array();
        for (var p=0; p < numq; p++)
        {
            var num = hw.quesnums[p];
            var j = parseInt(num);
            
            var bb = false;
            var j0=0;
            if (asg != null)
            {
               j0=0; 
               for(; j0 < asg.length; j0++) 
               {
                   if (num == asg[j0][0]) 
                       break;
               }
               bb =  (j0 < asg.length && asg[j0].length>2);
            }
            var bs = false;
            var j1=0;
            for (;j1 < sol.length; j1++)
            {
                if (sol[j1][0] == num)
                {
                    bs = true;
                    break;
                }
            }
            //num .shuffled .pts .score .outcome .timestay .fmt . question .solution .answer .comments  
            
            var quess = hw.questarr[j];
            if (quess == null) quess = '';
            atd[p]  = 
            [  
               num,
              ( bs?  sol[j1][4] : ''),
              ( hw.ptlist[j] == null? '1': hw.ptlist[j] ),
              ( bb?asg[j0][2]:'0' ).replace(/([0-9])\.[0]+$/,'$1').replace(/^[0]*\.[0]*$/,'0'),
                '', //( hw.outcome[j] == null?'':hw.outcome[j]),
              (bs? sol[j1][2] : '0'),
              (bs? sol[j1][3] : mat[Z][23]),
               quess,
              (bs?  sol[j1][1]: ''),
              ( hw.answqrr[j] != null? hw.answqrr[j] : ''),
              ( bb? asg[j0][3] : '')
            ];
        }
        
        if (asg != null &&  asg[asg.length-1] != null)
        {
            var N = asg.length-1;
            atd[p]  = 
            [   
                asg[N][0],
                asg[N][1],
                asg[N][2],
                asg[N][3],
                asg[N][4],
                asg[N][5],
                asg[N][6]
            ];
        }
    }
    if (atd.length == 1) return x;
    if (hw.header0.replace(/ /g,'') != '' || hw.attachheader.replace(/ /g,'') != '')
        txt += "<table  class=outset1  style=background-color:" + TBGCOLOR +";font-family:inherit   width=100% cellspacing=1  cellpadding=0><tr><td id=heade" + Z  +" >"  + hw.header0 +  (hw.attachheader == ""?"":("<br><img src=\"image/clip.png\"  width=28>" + hw.attachheader )) +   "</td></tr></table><div style=width:100%;height:5px;background-color:transparent></div>";
    txt +="<table id=\"t" + Z  + "\" style=background-color:" + TBGCOLOR +";font-family:inherit width=100%  cellspacing=0  cellpadding=4 >";
    var thisfmt = mat[Z][23];
    hw.attachheader = hw.divs = '';
    hw.parseAttach(ResizeUploaded.unzip(mat[Z][14]).replace(/,([0-9]+)@/g, ',100$1@' )); 
    addcss2head(Z, hw.divs, '1');
    attheader = hw.attachheader;
    
    var cellw = "200";
    var tablename = "t" + Z;
    var graded = true;
    var N  = atd.length -1; 
    if (!due) N++;
    for (var i = 0; i <   N  ; i++)
    {
        
        if ( atd[i].length == 11)
        {
           if ((atd[i][7]==null||atd[i][7]=='') && (atd[i][8]==null||atd[i][8]=='') && (atd[i][9]==null||atd[i][9]=='')  )  continue;
          if ( (atd[i][6] == '4'||atd[i][8] == '')  )
            {
                atd[i][7] = addbreak(atd[i][7] );//tt.replace(/\n([a-z][ |\\.|\\)|\]|:])/ig, '<br>$1');
            } 
           
            var tt = formatstr( atd[i][7], thisfmt ); 
            var isfillingblank = false; 
            if (tt.indexOf('____') >= 0)
            {  
                isfillingblank = true;
                tt = mergeunderscore(tt,atd[i][8]); 
                //if (atd[i][6] == '1' || atd[i][6] == '2')atd[i][8] = atd[i][8].replace(/\n/g,'<br>');
            }
            tt = hw.merge(tt);
            
            if ( (atd[i][6] == '4'||atd[i][8] == '')  )
            {
                tt = addbreak1(tt);
            }
            var rfmt = atd[i][6];
            if ( ''+rfmt == '4')
                rfmt = mat[Z][23];
            
            txt += "<tr bgcolor=white><td  width=5% valign=top align=left class=b1001 style=border-top-left-radius:4px; ><nobr><b><div class=circlebg>" + atd[i][0] + "</div>";
            txt += "</b></nobr></td><td  colspan=";
            if (due)
            {
                txt += "3 width=100% class=b1100  style=border-top-right-radius:4px;word-wrap:break-word  align=left >" + tt  + "</td>";
            }
            else
            {
                txt += "1 width=100% class=b1000 style=word-wrap:break-word  align=left >" + tt  + "</td><td class=b1000    width=5%  valign=bottom align=left><b><nobr>" 
                        + textmsg[1268] + "</nobr></b></td><td  class=b1100  style=border-top-right-radius:4px;   width=5%  align=left  valign=bottom >"  + atd[i][2] + "</td>";
            }
            txt += "</tr>";
            var ans = '';
            if (mat[Z][4] == '6') 
            {
                txt += "<tr  bgcolor=white><td  width=5%   valign=top align=left class=b0001 " +  (!due? 'style=border-bottom-left-radius:4px' : '') + "  ><nobr><b>" + textmsg[139] + "</b></nobr></td><td width=85%  align=left   style=\"color:purple;font-size"+font_size +"\">[" + textmsg[1775].split(/@/)[1] + "]</td>";
            
            }
            else{  
            if (isfillingblank)
                ans = formatstr2(atd[i][8], rfmt) ;
            else 
                ans = formatstr(atd[i][8], rfmt);
            ans = hw.merge(ans).replace(/imagelet([0-9]+)/g, 'imagelet100$1');
         
             
            txt += "<tr  bgcolor=white><td  width=5%   valign=top align=left class=b0001 " +  (!due? 'style=border-bottom-left-radius:4px' : '') + "  ><nobr><b>" + textmsg[139] + "</b></nobr></td><td width=85%  align=left   style=\"color:purple;font-size"+font_size +"\">" + ans + "</td>";
            }
            if (mat[Z][10] == '4')
               txt += "<td   width=5%  valign=top align=left><nobr><b>" + textmsg[1309]  + "</b></nobr></td><td  width=5%  align=left  valign=top   class=b0100  style=\"color:purple" + (!due?';border-bottom-right-radius:4px':'') + "\">"  + atd[i][5]  + "</td></tr>";
            else
               txt += "<td   width=5%  valign=top align=left><nobr><b>" + textmsg[1310]  + "</b></nobr></td><td  align=left  valign=top  width=5%   class=b0100  style=\"color:purple" + (!due?';border-bottom-right-radius:4px':'') + "\">"  + atd[i][5]  + "s</td></tr>"; 
                
            if (due) 
            {  
                let moreline = atd[i][9].includes('\n') && atd[i][8]!='' && isfillingblank;
                let fans = '';
                if (isfillingblank && (thisfmt=='1'||thisfmt=='2'))  fans = atd[i][9].replace(/\n/g,'<br>');
                else fans = atd[i][9];
                txt += "<tr  bgcolor=white><td  width=5%   valign=top align=left  class=b0001   ><nobr><b>" + textmsg[457] + "</b></nobr></td><td   width=85%  align=left >" + formatstr(fans, thisfmt )+  (moreline?('<a href="javasc' + 'ript:compareans('+Z+','+i+')" ><b>  ' + textmsg[1887].split(/@/)[0] + '</b> </a>'):'') + '</td>'; 
                txt += "<td  width=5%   valign=top align=left><b><nobr>" + textmsg[1268]  + "</nobr></b></td><td   align=left   valign=top    class=b0100   >"  + atd[i][2] + "</td></tr>";
                var fts =  formatstr( atd[i][10], thisfmt );
                if (fts == '') fts = '&nbsp;';
                fts = hw.merge(fts).replace(/imagelet([0-9]+)/g, 'imagelet100$1');
                txt +=  "<tr  bgcolor=white><td  width=5%   valign=top align=left  class=b0011  style=border-bottom-left-radius:4px; ><nobr><b>" + textmsg[541] + "</b></nobr></td><td  width=85%   valign=top  align=left colspan=1  class=b0010  style=\"color:red\">";
                var answerpic = "<span style=\"color:green;font-size:24px\">&check;</span><span style=\"margin:0px 0px 0px -12px;color:red;font-size:24px;font-weight:700\">&bsol;</span>";
                let sum2 = eval1( atd[i][3],atd[i][2]);
                
                if (parseFloat( atd[i][2]) == sum2) 
                    answerpic = "<span style=\"color:green;font-size:24px\">&check;</span>";
                else if (sum2 == 0.0)
                    answerpic = "<span style=\"color:red;font-size:24px\">&cross;</span>";
                 
                txt += "<table><tr><td  valign=top >" + answerpic   + "</td><td  valign=top >" + fts +  "</td></tr></table></td>";
                txt += "<td  width=5%  valign=top align=left  class=b0010  ><b><nobr>" + textmsg[1311]  + "</nobr></b></td><td  width=5%   valign=top  align=left   class=b0110  style=\"border-bottom-right-radius:4px;color:red\" >"   +  sum2 + "</td></tr>";
            }
            txt += "<tr ><td colspan=4 style=\"width:100%;height:1px;background-color:" + BBGCOLOR +"\"></td></tr>";

        }
        else if (atd[i].length == 6)
        {
                if (i == 0)
                txt += "<tr><td width=50 align=right><nobr><b>" + textmsg[542] + "</b></nobr></td><td  align=left><NOBR><b>" + textmsg[139] + "</b></NOBR></td><td width=50 align=right><NOBR><b>" + textmsg[408] + "</b></nobr></td><td width=50 align=right><NOBR><b>" + textmsg[36] + "/" +  textmsg[542] + "</b></nobr></td></tr>";
         if (atd[i][0]!=null&&atd[i][0]!='' || atd[i][1]!=null&&atd[i][1]!='' || atd[i][2]!=null&&atd[i][2]!='' )
         {
                txt += "<tr><td  width=50   align=right>" + atd[i][0] + "</td><td align=left>" + formatstr(atd[i][1], atd[i][3] ) 
                + "</td><td  width=50   align=right>" + ((atd[i][5] != '-1')?atd[i][5]:'') + "</td>"
                + "</td><td  width=50   align=right>" + atd[i][2] + "</td></tr>";
         }
        }
        else  if(atd[i].length == 2)
        {
                if (i == 0)
                    txt += "<tr><td  width=50  align=right><nobr><b>" + textmsg[542] + "</b></nobr></td><td  align=left><NOBR><b>" + textmsg[139] + "</b></NOBR></td></tr>";
                var fmt = (typeof(guessFormat)!='undefined')? guessFormat(atd[i][1]):0;
                txt += "<tr><td align=right>" + atd[i][0] + "</td><td   align=left>" + formatstr(atd[i][1], fmt ) + "</td></tr>";
        }
       else  
        {
             return x;
        }
    } 
    if (due && i == atd.length -1 && atd[i].length >= 7)
    {
        txt += "<tr><td  align=left colspan=4>";
        txt += "<b>"+ textmsg[563] +  " Q=" +  atd[i][0] + ", " + (atd[i][1] == '0'?'':(textmsg[1285] + " "
            + atd[i][1] + ", "))  +   textmsg[1288]+ " S=" +  atd[i][2] + ", "
        if (mat[Z][10] == '3') 
        {
            txt += textmsg[1287] + " T=" +  atd[i][4]  + ", ";
        }
        else if (mat[Z][10] == '4') 
        {
            let tt = parseFloat(atd[i][4]);
            if (''+tt == 'NaN') atd[i][4] = '';
            else atd[i][4] = tt.toFixed(2);
            txt += textmsg[1309] + " T=" + atd[i][4]  + ", ";
        }
        txt += textmsg[1286] +  ":" +  ((atd[i][3] == null||atd[i][3] == '')?'S':atd[i][3]);
        txt += "</b></td></tr>";
    }
    else if (!due && mat[Z][1] != '-1')
    {
        txt += "<tr><td  align=left colspan=4><b>"+ textmsg[1346] +  "</b></td></tr>";
    }
    txt += "</table>";
    
    return txt;
}
/*
function borderstyle (t,r,b,l)
{
    return "border-color:#b0b0b0;border-style:solid;border-top-width:" + t + "px;border-left-width:" + l + "px;border-bottom-width:" + b + "px;border-right-width:" + r + "px;font-size:" + font_size;
}*/ 


//font_size = 15;
writenow(unifontstyle(font_size));
writenow("<style>.thehint{background: yellow; border: 1px solid #CC0000;color:green;font-size:" + (font_size + 1) + "px;}\n"); 
writenow(".b1000{" + borderstyle(1,0,0,0) + "}\n"); 
writenow(".b1100{" + borderstyle(1,1,0,0) + "}\n"); 
writenow(".b0100{" + borderstyle(0,1,0,0) + "}\n");
writenow(".b0110{" + borderstyle(0,1,1,0) + "}\n");
writenow(".b0010{" + borderstyle(0,0,1,0) + "}\n");
writenow(".b0011{" + borderstyle(0,0,1,1) + "}\n");
writenow(".b0001{" + borderstyle(0,0,0,1) + "}\n");
writenow(".b1001{" + borderstyle(1,0,0,1) + "}\n");
var m2 = Math.round(font_size/2 + 3);
writenow(".circlebg{font-family:arial;font-weight:bold;width:" + (2*m2) + "px;height:" + (2*m2)
        + "px;border-radius:" + m2 + "px;font-size:" + font_size + "px;color:#ddcc11;line-height:" + (2*m2) + "px;text-align:center;background-color:" + IBGCOLOR + "}")
writenow("</style><center>");

if (numRows == 1 && mat[0][1] == '-2')
{
    for (j = 0; j < numCols; j++)
        if (j != 1 && j != 2)
            defaultRecord[j] = mat[0][j];
    numRows = 0;
}
else if (numRows > 1)
{
    for (; numRows > 1 && mat[numRows][1] == '-2'; numRows--)
        ;
}

writenow(unititle(title, 'outset2'));

webserviceAllbuts = webserviceAllbuts.replace(/<br>/g, "").replace(/width:[0-9]*/g, 'width:65').replace(/height:[0-9]*/g, 'height:24');

var t1 = webserviceAllbuts.indexOf(textmsg[294]);
if (t1 > 0)
{
    var t2 = t1;
    while (webserviceAllbuts.charAt(t2) != '<')
        t2--;
    while (webserviceAllbuts.charAt(t1) != '>')
        t1++;
    webserviceAllbuts = webserviceAllbuts.substring(t2, t1) +
            webserviceAllbuts.substring(0, t2) + ((t1 < webserviceAllbuts.length - 1) ? (webserviceAllbuts.substring(t1)) : "");
}

var numRows1 = numRows;
if (numRows == 0)
{
    if (defaultRecord[0] != '')
        numRows1 = 1;
    else
    {
        writenow("<html><head><meta http-equiv=\"content-type\" content=\"text/html; charset=" + encoding + "\"></head><body><form rel=opener name=form1  ></form><form rel=opener name=form0  ></form>" + textmsg[727] + ".");
        numRows1 = 0;
    }
}

writenow("<table  cellspacing=0 align=left cellpadding=0 width=100% id=maintbl>");
needtranslator = false;
var itistest = false;

var needinitZ = "";


for (var Z = 0; Z < numRows; Z++)
{
    
    var beforedue = (parseInt(mat[Z][12]) > timethis);
    var isformatedtest = ( mat[Z][10] == '1' || mat[Z][10] == '3' || mat[Z][10] == '4');
    var canUpdate = true;
     
    writenow("<tr><td align=left width=100%  ><form rel=opener name=form" + Z + " style=\"margin:4px 0px 1px 0px\" method=POST action=DataUpdate target=savewindow style=\"margin:0px 0px 0px 0\"  >");
    writenow( "<table   class=outset1  border=1  width=100%   align=left  cellspacing=0  cellpadding=0  >");
    var stylestr = "background-image:" + gradientbg  + ";color:#DDCC11;table-layout:fixed;border:0px " + IBGCOLOR + " outset";
    writenow("<tr style=\"background:" + beheading +"\"><td width=100%  ><table  cellpadding=3 cellspacing=0   style=\"border:0px\"><tr id=\"assb" + Z + "\" style=\"background:" + beheading +"\"><td   onMouseOver=\"showmyhint("
            + 0 + ")\"   onMouseOut=\"hidemyhint()\" id=itemlabel" + Z + " style=\"" + stylestr + ";width:" + labelwidth0 + "px\" width=" + labelwidth0 + ">");
    labels[0] = "<b>" + textmsg[126] + "</b>";
    if (mat[Z][10] == '2' || mat[Z][10] == '3')
        labels[0] = "<b>" + textmsg[667] + "</b>";
    else if (mat[Z][10] == '4')
        labels[0] = "<b>" + textmsg[1291] + "</b>";
    makelabel(0);
    writenow("</td><td width=140px style=\"border:1px " + IBGCOLOR + " outset;overflow:display\"><div style=\"width:140px !important;font-weight:700\"><nobr>" + mat[Z][0].replace(/[ ]+$/, '') + "</nobr></div></td><td>");
    makecontrol(Z, 0);
    writenow("</td><td   style=\"" + stylestr + "\"  onMouseOver=\"showmyhint(" + 1 + ")\" width=" + labelwidth0 + "px  onMouseOut=\"hidemyhint()\"  >");
    makelabel(1);
    writenow("</td><td  style=\"background-color: " + TBGCOLOR + ";border:1px " + IBGCOLOR + " outset\" >");
    makecontrol(Z, 1);
    writenow("</td><td  style=\"background-color: " + TBGCOLOR + ";border:1px;width:50px " + IBGCOLOR + " outset\">/" +  mat[Z][22]  + "</td><td   style=\"" + stylestr + "\"  onMouseOver=\"showmyhint(" + 2 + ")\"  width=" + labelwidth0 + "px    onMouseOut=\"hidemyhint()\"  >");
    makelabel(2);
    writenow("</td><td  style=\"border:1px " + IBGCOLOR + " outset\" style=color:" + IBGCOLOR + ">");
    makecontrol(Z, 2);
    writenow("</td><td   style=\"" + stylestr + "\"  onMouseOver=\"showmyhint(" + 3 + ")\"  width=" + labelwidth0 + "px    onMouseOut=\"hidemyhint()\" >");
    makelabel(3);
    writenow("</td><td align=right style=\"background-color: " + TBGCOLOR + ";border:1px " + IBGCOLOR + " outset\" >");
    makecontrol(Z, 3);
    makecontrol(Z, 4);
    makecontrol(Z, 5);
    makecontrol(Z, 6);
    makecontrol(Z, 7);
    makecontrol(Z, 8);
    makecontrol(Z, 9);
    makecontrol(Z, 10);
    makecontrol(Z, 11);
    makecontrol(Z, 12);
    writenow("</td>");
    writenow("<td ><input class=GreenButton   type=button name=savenote" + Z + "      value=\"" + textmsg[223] + "\" onclick=\"myws1(" + Z + ")\"></td>");
    canUpdate = needupdate(Z);

   
    if (!beforedue)
    {
        writenow("<td><input    style=width:1px    type=hidden name=answerbtn" + Z + "    value=\"" + textmsg[144] + "\" ONCLICK=\"myws3(" + Z + ")\"></td>");
    }
    else
    {
        writenow("<td><input style=visibility:hidden;width:1px  type=hidden name=answerbtn" + Z + "></td>");
    }

    if (beforedue && (mat[Z][10] == '0' || mat[Z][10] == '1'))
    {

        writenow("<td  style=\"background:" + beheading +"\"><input class=OrangeButton   name=savebtn" + Z + "  type=button value=\"" +  textmsg[1341] + "\" ONCLICK=\"redomultiple(" + Z + ",this)\"></td>");
    }
    else
    {
        writenow("<td   style=\"background:" + beheading +"\"><input  type=hidden name=dummybtn" + Z + "></td>");
    }
    writenow("<td><input class=GreenButton  style=width:" + charwidthrate()*font_size + "px  type=button name=helpbtn" + Z + "   value=\"" + textmsg[17] + "\" ONCLICK=\"showhelp1()\">");
    for (j = 0; j < numWsinputs + numWsopts + 2; j++)
        makedummy();
    writenow("</td></tr></table></td></tr>");
    updatelabel = textmsg[225];
    attheader = '';
    writenow("<tr><td width=100%  style=\"padding:3px 3x 3px 3px;background:" + beheading + "\"");
    var x = null;
    writenow(" style=\"background:" + beheading + "\" >");
    if (isformatedtest)
    {
        x =   reformate(mat[Z][13], Z);
        needtranslator = isformatedtest;
    }
    else
    {
        x = freeformat(Z);
    }
    if (x == '')
        x = '<br>';
    writenow(   x + '<input name=' + fields[13] + ' type=hidden>');
    writenow("</td></tr>");
    if ( mat[Z][1] == '-1')
    {
        writenow("<tr><td><table cellspacing=0 cellpadding=3><tr><td style=\"background-color:" + IBGCOLOR +";color:#DDCC11;width:" + labelwidth0 + "px !important;\"  >"); makelabel(14);
        writenow("</td><td width=99%   width=99% style=\"background:" + beheading + "\" ><input  value=\"" + mat[Z][14] + "\"  type=hidden name="+ fields[14]  +" onchange=UT(" + Z + ",14)  ><span style=color:blue;cursor:pointer onclick=\"attachmore("  + Z + ")\" >[+]</span><span id=theattach" + Z +"  style=color:blue;cursor:pointer onclick=\"manattach("+ Z + ")\">" + ResizeUploaded.unzip(mat[Z][14]).replace(/@[^,]+/g,'').replace(/,$/,'').replace(/,/g,', ')  + "</span></td></tr></table></td></tr>");
    }
    else
    {
        var qqq = '';
         if (mat[Z][4]=='6' && numRows > 1) qqq = "&nbsp&nbsp&nbsp;<a href=javascript:showallcamera()>" + textmsg[1483] + "</a>";
         
         writenow("<tr><td><table  cellspacing=0  cellpadding=3><tr><td style=\"background-color:" + IBGCOLOR +";color:#DDCC11;width:" + labelwidth0 + "px !important;\"  >" );  makelabel(14) ;
         writenow("</td><td  width=99%  style=\"background:" + beheading + "\" ><input  value=\"" + mat[Z][14] + "\"  type=hidden name="+ fields[14]  +" onchange=UT(" + Z + ",14)  ><span id=theattach" + Z +"  style=color:blue;cursor:pointer >" +  (attheader != ''?attheader:viewattachment(mat[Z][14])) + "</span><span style=float:right id=dallc" + Z + ">" + qqq + "</span></td></tr></table></td></tr>");
    }
    writenow("<tr><td colspan=12 id=showarea" + Z + "></td></tr></table>" );
    writenow("<input type=hidden  name=rdap      value=\"submissionnote\">");
    writenow("<input type=hidden  name=role       value=\"student\">");
    writenow("<input type=HIDDEN  name=rsacode    value=\"" + rsaenccode + "\">");
    writenow("<input type=hidden  name=subfolder  value=\"submission\">");
    writenow("<input type=hidden  name=subdb      value=\"" + subdb + "\">");
    writenow("</form>" + "</td></tr> ");
    runningn++;
    //showattachment(mat[Z][14],Z); 
}

function fillouta()
{
    if (needinitZ == '') return;
    var zs = needinitZ.substring(1).split(/,/);
    for (var j=0; j < zs.length; j++)
    {
        var Z = parseInt(zs[j]);
        setv(Z, 13, mat[Z][13]);
    }
}
 

writenow("<tr><td><form rel=opener  name=thisform  method=POST action=\"SaveBack\" target=savewindow style=topmargin:0pts;bottommargin:0pts;leftmargin:0pts;rightargin:0pts  >");
writenow("<input type=HIDDEN   name=rdap value=\"" + rdapname + "\">");
writenow("<input type=HIDDEN   name=subdb value=\"" + subdb + "\">");
writenow("<input type=HIDDEN   name=wcds>");
writenow("<input type=HIDDEN   name=id>");
writenow("<input type=hidden   name=count >");
writenow("<input type=hidden   name=total value=" + numRows + ">");
writenow("<input type=hidden   name=newbtn>");
writenow("<input type=hidden   name=savebtn>");
writenow("<input type=hidden   name=delbtn>");
writenow("</form></td></tr></table>");

function manattach(Z)
{
    counter = Z;
    var el = formselementbyname(document.forms[Z], fields[14]);
    ResizeUploaded.attachman(el,true);
   
}
function   circlebg(n,k)
{
    return "<div class=circlebg>" + k + "</div>";
} 



function freeformat( Z)
{ 
    var x = mat[Z][13];
    if (mat[Z][4] != '0')
    {
         x = checkh(x, true);
         needtranslator = true;
    }
     
    x = formatstr(addbreak(x, 1), mat[Z][4]);
    
    if (mat[Z][10] == '0' || mat[Z][10] == '2')
    {
         x = x.replace(/\/\/\/\/([^<]+)/g, "<font color=red>//$1</font>");
         x = x.replace(/<scr.pt/ig, "&lt;sc" + "ript").replace(/<\/scr.pt/ig, "&lt;/scr" + "ipt");
    }
      //assignname, Score, at, Notes, Format, Options, Semester, course, sid, timenow,
//         0,       1,     2,  3 ,    4,      5,        6,        7,      8,   9   
//Type,  sessionname, due, Content, attach, dummy, status, subs,question, answer, Assess, Attachat, Scale�� aformat
//10,     11,         12,       13,    14,    15,     16,   17,      18,     19,     20,        21,    22,      23
    var hw;
    var due = (mat[Z][19] != '' && mat[Z][1] != '-1');
   
    var attstr = ResizeUploaded.unzip(mat[Z][21]);
    if (due)
    {
         hw = new Hwtake('rev', '', '', attstr, '', '', Z);
    }
    else
    {   
         hw = new Hwtake('rev', '', '', attstr.replace(/^[^@]+@[^@]@_[^,]+,/, "").replace(/,[^@]+@[^@]@_[^,]+,/, ","), '', '', Z, true);
        
    }
    addcss2head(Z, hw.divs);
    
    //assignname, Score, at, Notes, Format, Options, Semester, course, sid, timenow,
//         0,       1,    2,  3 ,    4,      5,        6,        7,      8,   9   
//Type,  sessionname, due, Content, attach, dummy, status, subs,question, answer, Assess, Attachat, Scale�� aformat
//10,     11,         12,       13,    14,    15,     16,   17,      18,     19,     20,        21,    22,      23
    var aa = ResizeUploaded.unzip(mat[Z][21]).replace(/,([0-9]+)@/g, ',100$1@');
    var z = hw.merge(addbreak1(formatstr(addbreak(mat[Z][18],1),mat[Z][23])));
    var w = '';
    if (due)
        w = hw.merge(addbreak1(formatstr(addbreak(mat[Z][19],1),mat[Z][23])));
    var y = hw.attachheader;
    hw.divs = hw.attachheader = '';
    hw.parseAttach(ResizeUploaded.unzip(mat[Z][14]).replace(/,([0-9]+)@/g, ',100$1@'));
    addcss2head(Z, hw.divs, '1');
    
    attheader = hw.attachheader;
    var ans = "";
    if (mat[Z][4] == '6')
        ans = "[" + textmsg[1775].split(/@/)[1] + "]";
    else ans = hw.merge(addbreak1(x)).replace(/imagelet([0-9]+)/g, 'imagelet100$1');
    x =  '';
    if (y != '') 
    {
        x =  "<table class=outset1 width=100% style=\"background-color:" + TBGCOLOR +";margin:0px 0px 0px 0px;font-family:inherit\" cellpadding=3 cellspacing=0><tr><td id=header" + Z + "><img src=\"image/clip.png\" width=28 >" + y + "</td></tr></table><div style=width:100%;height:5px;background-color:transparent></div>";
    }  
    
    x += "<table  id=\"t" + Z  + "\" class=outset1 width=100% style=\"background-color:" + TBGCOLOR +";margin:0px 0px 0px 0px;font-family:inherit\" cellpadding=3 cellspacing=0><tr><td valign=top align=left width=5% ><nobr><b>" + textmsg[456] + "</b></nobr></td><td valign=top align=left>" + z + "</td></tr><tr><td valign=top align=left><nobr><b>"
    + textmsg[139] + "</b></nobr></td><td valign=top align=left>" + ans + "</td></tr>";
    if (due)
    {
        x += "<tr><td valign=top align=left><nobr><b>" + textmsg[457] + "</b></nobr></td><td valign=top align=left>" + w + "</td></tr>";
    }
    return x  +"</table>";
}



 
 
 
showattachment = function (t,Z)
{
    var pname = "theattach";
    pname += counter;
    var y = ResizeUploaded.unzip(t);
     
    var xx = document.getElementById(pname  );
    if (xx!=null && xx.onclick!=null)
    {
        xx.innerHTML = y.replace(/@[^,]+/g,'').replace(/,$/,'').replace(/,/g,', ');
    }
    else if (xx!=null)
    {
        xx.innerHTML = viewattachment(y);
    }
     
}
function openitattached(Z, filename)
{
    openmid("FileOperation?folder="
            + encodeURIComponent(subdb + "/" + mat[Z][7] + "/submission/" + mat[Z][8])
            + "&filedir=" + encodeURIComponent(filename) + "&operation=open");
}


function myws1(Z, btn)
{
    nn = -1;
    counter = Z;
    rowInvolves = '1' + Z;
    document.forms[Z].elements[3].value = document.forms[Z].elements[3].value.replace(/^([^#])/,'#$1');
    onsaved = "mat[" + Z + "][3]=document.forms[" + Z + "].elements[3].value=document.forms[" + Z + "].elements[3].value.replace(/^#/,'');";
    specifyform(Z);
    f1.rdap.value = "submissionnote";
    f1.subdb.value = subdb;
    myws(Z, null, 'DataUpdate?rdap=submissionnote', 0, btn);

}
function updatesubs(Z)
{
    
    specifyform(Z);

    if (valuechanged[Z] == false)
    {
        myprompt(textmsg[1566]);
        return;
    }
    else if (typeof (f1.File) != 'undefined' && f1.localpathtoupload.value != '' && retrv(Z, 14) == '')
    {
      //  if (confirm("You have selected a file but not attached the file. Do you want to stop this submitting process to attach the file first?"))
      //      return;
    }
    setv(Z,13, retrv(Z,13).replace(/\n[ ]+\t/g, '\n\t'));
    if (retrv(Z, 13) == '' || retrv(Z, 13) == textmsg[219])
    {
        if (retrv(Z, 14) != '')
        {
            setv(Z, 13, textmsg[787]);
            // return;
        }
        else
        {
            myprompt("<font color=red><b>" + textmsg[219] + "</b></font>", null, null, "Error");
            return;
        }
    }
     
    if (ctype[1] == 'h' || f1.elements[1].value == '' || isNaN(f1.elements[1].value))
        setv(Z, 1, '-1');
    if (rdapname == 'studentsubmission')
        tinywin = "_blank";
     onsaved = "if( f1.elements[1].value=='-1') f1.elements[1].value=textmsg[236];";
 
    setaction(1);
}


function tempsave(Z)
{
    specifyform(Z);
    setv(0, 1, '-2');
    onsaved = "if(retrv(0,1) == '-2'){myprompt('" + textmsg[824].replace(/'/g, "\\'") + "');}";// "if(ctype[1] == 'n' && f1.elements[1].value == '-1') f1.elements[1].value=textmsg[236];if(retrv(0,1) == ''||retrv(0,1) == '-1'){f1.savebtn.value=updatelabel;f1.save1btn.style.visibility='hidden'; receipt();}";
    setaction(1);
}

function findformbyname(fn)
{
    for (var j=0; j < document.forms.length; j++)
        if (document.forms[j].name == fn)
            return document.forms[j];
    return null;
}
function specifyform(Z)
{
    fsnd = findformbyname('form' + Z);
    f1 = fsnd;
    counter = Z;
}
function setaction1()
{
   if (periodvalue == 1)
   {
       if (rr>=0 && cc>=0) 
           U(rr,cc);
   }
}
function getMat(r, c) {
    return mat[r][c];
}
var upperrightwin = null;
function finduprig()
{
    var xx = parent.frames;
    for (var i = 0; i < xx.length && xx[i].name.indexOf("uprig") < 0; i++)
        ;
    if (i < xx.length)
    {
        upperrightwin = xx[i];
    }
    else
    {
        if (parent.frames!=null && parent.frames[0].frames!=null)
        {
        xx = parent.frames[0].frames;
        for (i = 0; i < xx.length && xx[i].name.indexOf("uprig") < 0; i++);
        if (i < xx.length)
            upperrightwin = xx[i];
        }
    }
}
finduprig();
function myws(Z, ta, s, j, btn)
{
    if (typeof (hidemyhint) != 'undefined')
    {
        hints[j] = null;
        hidemyhint();
    }
    specifyform(Z);
    
    if (mm > 0)
        makeasso();
    if (s.indexOf('UploadTeaching') == 0 || s == 'DataUpdate')
    {
        if (s.indexOf('UploadTeaching') == 0)
        {
            if (f1.localpathtoupload.value == '')
            {
                myprompt(textmsg[883]);
                return;
            }
            else
            {
                var fn = f1.localpathtoupload.value.replace(/.*\/([^\/]+$)/, '$1');
                ii = 0;
                for (; ii < numCols && (fields[ii] != 'attach' && fields[ii] != 'Attached'); ii++)
                    ;
                var fns = "," + retrv(counter, ii);
                if (fns.indexOf("," + fn + "@") >= 0)
                {
                    if (!confirm("A file named " + fn + " has already been attached. If you intend to use this new file to update the existing file, please click the Cancel button, delete the exiting file  then upload the new file again. Otherwise the System will upload this new file and save it as another file name. Do you let system to save as another file name?"))
                    {
                        ResizeUploaded.attachman(ele(counter, ii));
                        return;
                    }
                }
            }
            disablethem1(true);
        }
        else
            disablethem1(false);
        
        webservice(ta, s, j, btn, 'w' + tstmp);
    }
    else
    {
        disablethem1(false);
        if (s.indexOf('DataUpdate') == 0)
            webservice(ta, s, j, btn, 'w' + tstmp);
        else
            webservice(ta, s, j, btn,   null );
    }
    disablethem1(false);

}
function myws2(Z, btn)
{
    myws(Z, null, 'assigndoc.jsp?option=des', 0, btn);
}
function myws3(Z, btn)
{
    myws(Z, null, 'assigndoc.jsp?option=answer', 0, btn);
}
function disablethem1(b)
{
    for (var i=0; i < f1.elements.length; i++)
    {
       var e = f1.elements[i];
       if (e.name.indexOf("dummy") == 0 && e.type.toLowerCase() == 'hidden')        
       {
           e.disabled = true;
       }
    }
    for (var i=0; i < numCols && i < f1.elements.length; i++)
    {
        if (i != 7 && ele(0,i) != null) ele(0,i).disabled = b;
    }
}


var thesubmitarea = document.form0.elements[lookup[13]];
function alertSize() {
    var myWidth = 0, myHeight = 0;
    if (typeof (window.innerWidth) == 'number')
    {
        //Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    }
    else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }
    return [myWidth, myHeight];
}
function largertxt()
{
    var wd = document.getElementById('assb0').offsetWidth;
    thesubmitarea.style.width = "" + (wd - 4) + "px";

    if (hasVerticalScroll())
    {
        var hh = thesubmitarea.offsetHeight - 150;
        if (hh < 100)
            hh = 100;
        thesubmitarea.style.height = hh + 'px';
    }
}
function resizeCont()
{

    var wd = 40;

     
    {
        for (var i = 0; i < numRows; i++)
        {
            var isformatedtest = ( mat[i][10] == '1' || mat[i][10] == '3' || mat[i][10] == '4');
            if (isformatedtest == false && (mat[i][1] == '-1' || ctype[1] != 'h'))
            {
                var xx =ele(i,13);
                if (xx != null) xx.style.width = "300px";
            }
        }
        wd = thispagewidth();
        
        for (i = 0; i < numRows; i++)
        {
            var isformatedtest = ( mat[i][10] == '1' || mat[i][10] == '3' || mat[i][10] == '4');
            if (isformatedtest == false && (mat[i][1] == '-1' || ctype[1] != 'h'))
            {
                var xx = ele(i,13);
                if (xx != null) xx.style.width  = "" + (wd-35) + "px";
            }
        }
    }
}
var savedQuizName = (orgnum%65536) + '-' + defaultRecord[7] + "-" + defaultRecord[0] + '-' + defaultRecord[8];



//assignname, Score, at, Notes, Format, Options, Semester, course, sid, timenow, 
//Type,  sessionname, due, Content, attach, dummy, status, subs,question, answer, Assess, Attachat, Scale
var haslatexpage = false;
var target
function hasnolatexpage() {
    haslatexpage = false;
}
var submitguessformat = null;
function displaytxt(ta, evt, j, fmt)
{
    var e = evt ? evt : window.event;
    if (!e)
        return true;
    var key = 0;
    if (e.keyCode) {
        key = e.keyCode;
    } // for moz/fb, if keyCode == 0 use 'which'
    else if (typeof (e.which) != 'undefined') {
        key = e.which;
    }
    if (key == 13)
    {
        localStorage[savedQuizName] =  ta.value;

    }
    else if (key == 36 || key == 62)
    {
        fmt = guessFormat(ta.value + String.fromCharCode(key));
        setv(counter,4,''+fmt);
        if (fmt > 0)
        {
            
            fsnd.target = upperrightwin.name;
            formnewaction(fsnd, 'stuasfrm.jsp?ways=latex');
            visual(fsnd);
            fsnd.submit();
        }
    }
    return true;
}
 
timedue = parseInt(mat[0][12]) ;
 
function tic()
{
    timestart++;

    var diff = Math.floor(timedue - timestart);
    var sign = "";
    if (diff == 300)
    {
        myprompt(textmsg[884]);
    }
    else if (diff == 0)
    {
        
    }
    else if (diff < 0)
    {
        diff = -diff;
        sign = "-";
    }
    
}

function maxht()
{
    scrollTo(0, 0);
    var y = self.innerHeight ? self.innerHeight : document.body.clientHeight;
    if (hasVerticalScroll() == false)
        thesubmitarea.style.height = Math.max(1, y - thesubmitarea.offsetTop - 30) + "px";
    else
        thesubmitarea.style.height = (thesubmitarea.offsetHeight - 40) + 'px';
}
 
helpbuttons = helpbuttons.replace(/style=/g, "style=width:68px;");


function updatesubs1(Z)
{
    specifyform(Z);
    if (ctype[1] == 'h' || "" + parseFloat(f1.elements[1].value) == 'NaN')
        setv(Z, 1, '-1');
    onsaved = "if(ctype[1] == 'n' && f1.elements[1].value == '-1') f1.elements[1].value=textmsg[236];if(retrv(0,1) == ''||retrv(0,1) == '-1'){f1.savebtn.value=updatelabel;f1.save1btn.style.visibility='hidden';} ";
    valuechanged[0] = true;
    makeasso();
    disablethem1(true);
    webservice(null, 'SaveSubm', 0, 'w' + tstmp);
}

function warn()
{
    return textmsg[874];
}
function sethandler(win) {
    nav1 = win;
}

function removent(t)
{
    t.value=t.value.replace(/\n[ ]+\t/g,'\n\t');
    
}

function makebut(color, capt)
{
    return   "<input class=" + color + " style=\"width:" + Math.floor(4.5 * font_size) + "px\"   type=button  value=\"" + capt + "\">";
}
var helpstr0 = "<font color=purple><b>" + textmsg[215] + "</b></font><br>";

function showhelp0()
{
    helpstr = "<font color=purple><b>" + textmsg[222] + "</b></font><br>" + textmsg[216] + "<br>";
    if (numRows == 1 && mat[0][13] == '')
    {
        helpstr += "<font color=purple><b>" + textmsg[228] + "</b></font> " + textmsg[415] + ". ";
        if (numRows != 1 || mat[0][5].indexOf(";o:") >= 0)
            // helpstr +=   textmsg[416];
            helpstr += "<br>";
    }
    helpstr += "<br>";
    //if (issubmit)
    //   helpstr += "<b style=color:purple>"+textmsg[218]+"</b><BR>1. "+textmsg[219]+"<br>2. "+textmsg[220]+"<br>"
    //+ "3. "+ textmsg[221]+"<br>";

    helpstr += helpstr0 + "<table>"
            + "<tr><td valign=top>" + makebut("OrangeButton", textmsg[61]) + "</td><td valign=top>" + textmsg[217] + "</td></tr>";
    //if(itistest == false)
    //    helpstr += "<tr><td valign=top>" + makebut("OrangeButton", textmsg[67]) + "</td><td valign=top>" + textmsg[304]+"</td></tr>";
    helpstr += helpbuttons
            + "</table>";
    helpstr += "</body></html>";
    helpstr = helpstr.replace(/Table Fields/, 'Function Buttons').replace(/!/g, ":").replace(/table   bgcolor=[^ ]+ /g, 'table ');
    if (upperrightwin != null)
    {
        upperrightwin.document.write("<html>" + metaencode + "<head><link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\" /></style></head><body>" + helpstr);
        setTimeout("resizehelpbut(parent." + upperrightwin.name + ")", 200);
    }
}
 
function showhelp1(fg)
{
    helpstr = helpstr0;
    var buts = "<tr><td valign=top>" + makebut("GreenButton", textmsg[223]) + "</td><td>" + textmsg[224] + ".</td></tr>"
            + "<tr><td valign=top>" + makebut("OrangeButton", textmsg[1341]) + "</td><td>" + textmsg[214] + '.</td></tr>';
    if (fg)
    {
        buts += "<tr><td valign=top>" + makebut("OrangeButton", textmsg[225]) + "</td><td>" + textmsg[226] + ".</td></tr>"
                + "<tr><td valign=top>" + makebut("RedButton", textmsg[69]) + "</td><td>" + textmsg[227] + ".</td></tr>";
    }
    else
        buts += "<tr><td valign=top>" + makebut("GreenButton", textmsg[144]) + "</td><td>" + textmsg[233] + ".</td></tr>";

    helpstr = helpstr0 + "<table>" + buts;
    if (fg)
        helpstr += helpbuttons;
    helpstr += "</table><br>";

    if (ctype[1] == 'h')
    {
        if (fg)
        {
            helpstr += "<b style=color:purple>" + textmsg[228] + "</b><br>" + textmsg[229];
        }
        else
        {
            helpstr += "<b style=color:purple>" + textmsg[230] + "</b><br>" + textmsg[231];
        }
    }

    helpstr += "</body></html>";
    helpstr = helpstr.replace(/Table Fields/, 'Function Buttons').replace(/!/g, ":").replace(/table   bgcolor=[^ ]+ /g, 'table ');
    showhelp();

}
function showhintz()
{
    var ans = "";
    for (var i = 0; i < hints.length; i++)
        ans += i + "  " + hints[i] + "<br>";
    myprompt(ans);

}



function ttt() {
    f1 = document.form0;
    ele(0, 13).value = "w:";
}
//onbegin = onbegin.replace(/;$/, '');
for (i = 0; i < document.forms.length; i++)
    if (document.forms[i].name.replace(/form[0-9]+/,'') == '')
    resizebut(document.forms[i]);


function nodeletebut()
{
    var allbuts = promptwin.getElementsByTagName("input");
    for (var i = 0; i < allbuts.length; i++)
    {
        allbuts[i].style.visibility = "hidden";
        allbuts[i].disabled = true;
    }
}
function movebarhere(anchor)
{
    if (anchor == null)
        return;

    Drag.init(anchor);
    anchor.onDragStart = function(x, y)
    {
        var xy = findPositionnoScrolling(this);
        var wd = this.offsetWidth;
        document.body.appendChild(this);
        this.style.position = "absolute";
        this.style.left = xy[0] + 'px';
        this.style.top = xy[1] + 'px';
        this.style.width = (wd - 2) + 'px';

    };
    anchor.onDragEnd = function(x, y)
    {
        var xy = findPositionnoScrolling(this);
        var Zj = this.id.replace(/horbar/, '').split("_");
        var Z = parseInt(Zj[0]);
        var j = parseInt(Zj[1]);
        y = xy[1];
        var barassociate = ele(Z, j);
        if (issubmit)
            barassociate = document.form0.Content;
        xy = findPositionnoScrolling(barassociate);
        y = y - xy[1];
        barassociate.style.height = y + 'px';
        var father = document.getElementById("barfather" + Z + "_" + j);
        if (father != null)
        {
            father.appendChild(this);
            this.style.position = "";
            this.style.width = '100%';
        }
    }
}

if (typeof (self.onresize) != 'undefined' && self.onresize != null)
{
    var existing = self.onresize;
    self.onresize = function()
    {
        existing();
        resizeCont();
    };
}
else
{
    self.onresize = function()
    {
        resizeCont();
    };
}
if (typeof (window.onresize) != 'undefined' && window.onresize != null)
{
    existing = window.onresize;
    window.onresize = function()
    {
        existing();
        resizeCont();
    };
}
else
{
    window.onresize = function()
    {
        resizeCont();
    };
}

function initmovebar()
{
    if (issubmit == false)
    {
        for (var Z = 0; Z < numRows; Z++)
        {  
            if ((mat[Z][10] == '0') && mat[Z][1] == '-1' || ctype[1] == 'n')
            {
                f1 = findformbyname('form' + Z);
                populate(Z);
                var xx = ele(Z, 13);
                if (xx != null)
                {
                    if (xx.tagName.toLowerCase() == 'textarea')
                    {
                        xx.style.color = 'black';
                    }
                }
            }

            if (mat[Z][1] == '-1')
            {
                ele(Z, 1).value = textmsg[236];
            }
            else if (mat[Z][1] != '-2')
            {
                ele(Z, 1).value = mat[Z][1];
            }
        }
    }
     
    var len = numRows;
     
    for (Z = 0; Z < len; Z++)
        for (var j = 0; j < numCols; j++)
        {
            if (ctype[j] == 'a')
            {
                movebarhere(document.getElementById("horbar" + Z + "_" + j));
            }
        }
    resizeCont();

}
function smaller()
{
    var tbl = document.getElementById('maintbl');
    
    tbl.width = (screen.width - 225);
     
}

function redomultiple(Z,btn)
{
    if (mat[Z][1] == '-1')
    {
        if (rdapname == 'studentsubmission')
        {
            nn = -1;
            counter = Z;
            rowInvolves = '1' + Z;
            onsaved = "mat[" + Z + "][1]=-1;delarow(" + Z + ")";
            specifyform(Z);
            f1.rdap.value = "submissionundo";
            f1.target = '_blank';
            f1.subdb.value = subdb;
            myws(Z, null, 'DataUpdate', 0, btn);
        }
        else
        {
            myprompt(textmsg[1347]);
        }
    }
    else
    {
        myprompt(textmsg[1342]);
    }
}
function erase(Z)
{
    var t = document.getElementById('assb' + Z);
    t = t.parentNode; 
    if (t.tagName.toLowerCase() != 'table') 
        t = t.parentNode;
    t = t.parentNode.parentNode;
    var w = t.nextSibling;
    var s = w.nextSibling;
    w.style.visibility = 'hidden';
    w.style.height = '30px';
    t.style.visibility = 'hidden';
    s.style.visibility = 'hidden';
    myprompt(textmsg[1345],null,null,textmsg[1341]);
}

function delarow(Z)
{
    var tz = document.getElementById('t' + Z);
    if (tz!=null && tz.rows != null && tz.rows.length>0)
    {
        tz.deleteRow(0);
        setTimeout('delarow(' + Z + ')',100);
    }
    else
    {
        erase(Z);
        postopen('DataUpdate',['subdb','rdap','assignname','course','Semester'],
        [subdb,'submissionundo1',mat[Z][0],mat[Z][7],mat[Z][6]], 'w' + tstmp);
    } 
}

ele = function(n, i)
{
    var f = findformbyname('form'+n);
    if (f == null) return null;
    for (var j=0; j < f.elements.length; j++)
        if (f.elements[j].name == fields[i])
            return f.elements[j];
    return null;
}

attachmore = function(r)
{
    ResizeUploaded.attachref = ele(r,14);
    rr = r;
    cc = 14;
    fsnd = findformbyname('form' + r);
    var N = fsnd.elements.length;
    for (var j=0; j < N; j++)
    {
        var t = fsnd.elements[j].type.toLowerCase();
        if (t == 'file')
        {
            fsnd.elements[j].click();
            break;
        }
    }
}
//document.write( "<div id=anchor name=anchor style=\"width:1px;height:1px;float:right\"><!----></div>");

onbegin = "initmovebar();";
onsave += "ResizeUploaded.alluploaded ='';";
function camerasub()
{
    if (numRows == 1 && mat[0][4] == '6' && (mat[0][19] != '' && mat[0][1] != '-1') )
    {
        var tbl = document.getElementById('t0');
        var trs =tbl.rows;
        var tr = trs[trs.length-1];
        var td = tbl.parentNode;
        td.innerHTML = makeimgs(0,tr.outerHTML);
        fromjson(0,td);
    }
}
function itisimage(fn)
{
   var tt = fn.toLowerCase();
   if (tt.indexOf('.jpg')>0 || tt.indexOf(".jpeg")>0 || tt.indexOf('.gif')>0 || tt.indexOf('.png')>0)
      return true;   
   return false;
}
var allZs = null;
var startedall = false;
function showallcamera()
{
    if (startedall)
    {
        myprompt("Started. Please wait...");
        return;
    }
    if (allZs == null)
    {
        allZs = [];
     for (var i=0; i < mat.length; i++)
    {
        if (alldownloaded.indexOf("," + i + ",")< 0 && mat[i][4] == '6' && mat[i][19]!='' && mat[i][1]!='-1'&& document.getElementById('t' + i)!=null)
           allZs[allZs.length] = i;
    }
    }
    if (allZs.length > 0)
    {
        var n = allZs[0];
        allZs.splice(0,1);
        startedall = true;
        integimag(n);
    }
    
}
function integimag(n)
{
     if (alldownloaded.indexOf("," + n + ",")>=0)
     {
         if (allZs.length > 0)
         {
            n = allZs[0];
            allZs.splice(0,1);
            startedall = true;
            integimag(n);
         }
         return;
     }
     alldownloaded +=  n + ",";
     
     var att = document.getElementById('theattach' + n);
     opencamesubs(att,n);
}
var alldownloaded = ",";
var oldopemproper = openproper;
 openproper = function(cd,fn,sp)
 {
   
    var n = parseInt(sp.parentNode.id.replace(/[^0-9]/g,''));
     
    if ( mat[n][4] == '6' && mat[n][1]!='-1' && itisimage(fn))
    {
        if (alldownloaded.indexOf("," + n + ",")>=0)return;
        alldownloaded +=  n + ",";
        opencamesubs(sp.parentNode, n);
    } else
         oldopemproper(cd,fn,sp);
 }
function opencamesubs(sp,n)
{
                 
        var td = sp.parentNode.parentNode.parentNode.parentNode.parentNode;
        var tbl = td.parentNode.parentNode.parentNode;
        var tr  = tbl.insertRow(-1);
        td = tr.insertCell(-1);
        td.innerHTML =  makeimgs(n);
        var v = document.getElementById('theattach' + n);
        var spans = v.getElementsByTagName('span');
        if (spans!=null)
        for (var i= spans.length-1; i >=0; i--)
        {
            var y = spans[i];
            if (itisimage(y.innerHTML)) y.parentNode.removeChild(y);
        }
        v = document.getElementById('dallc' + n);
        if (v!=null) v.parentNode.removeChild(v);
}
   
 
function getImgobj(td, fn)
{
   var ims = td.getElementsByTagName('img');
   for (var i=0; i < ims.length; i++)
   {
       if (ims[i].alt == fn)
           return ims[i];
   }
   return null;
}
function makeimgs(n)
{
    var str = ResizeUploaded.unzip(mat[n][14]);
    var x = new CSVParse(str.replace(/,$/,''), "'",'@', ',');
    var ms = x.nextMatrix();
    var w = thispagewidth()  - 30;
    var z= '';
    numimgs = ms.length; 
    for (var i=0; i < ms.length; i++)
    {
        if (itisimage(ms[i][0]))
        z += '<img alt="' + ms[i][0] + '" width='+ w +' style=display:block src="FileOperation?did=' + ms[i][2] + '">';
    }
    z = z.replace(/>$/, ' onload="fromjson(' + n + ',this.parentNode)" >');
    return z;
}

function fromjson(n,td)
{
    var isformatedtest = ( mat[n][10] == '1' || mat[n][10] == '3' || mat[n][10] == '4');
    var comments = null;
    if (true)//isformatedtest)
    {
        var p = new CSVParse(mat[n][20],"|",",",";");
        var m = p.nextMatrix();
       
        try
        {
            comments = JSON.parse(m[0][3]);
            
            for (var j=1; j < m.length-1; j++)
            { 
                var more = null;
                
                try{ more = JSON.parse(m[j][3]);}catch(e){  }
                if (more!=null)
                    comments = comments.concat(more);
            }
         
        }catch(e)
        {
           
           
        }
        
    }
     
    var w = thispagewidth()  - 30; 
    if (comments != null)
    for (var i=0; i < comments.length; i++)
    {
        var fmt = (typeof(guessFormat)!='undefined')? guessFormat(comments[i].c):0;
        var dv = document.createElement('div');
        var imgobj = getImgobj(td,comments[i].f);
        if (imgobj == null)
        {
           var cxy = findPositionnoScrolling(td); 
        }
        else
           cxy = findPositionnoScrolling(imgobj);
        dv.style = 'color:red;position:absolute;left:' + (cxy[0] + comments[i].x*w) + 'px;top:' + (cxy[1] + comments[i].y*w) + 'px';
        dv.innerHTML = formatstr(comments[i].c,fmt);
        td.appendChild(dv);
        if (fmt==2){ LaTexHTML.formatele(dv);}
    }
    if (allZs!=null && allZs.length > 0)
    {
        var n = allZs[0];
        allZs.splice(0,1);
        startedall = true;
        integimag(n);
    }
    
}

 

 

 