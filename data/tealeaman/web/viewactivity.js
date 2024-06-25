
var activitynames = textmsg[1834].split(/@/);
var words = textmsg[1835].split(/@/);
let labels = words;
window.title = words[0];
var activitycodes = ['st','ef','tx','cl','sb','pb','pf','save','submit','withdraw'];
var activitycolors = ['green','#33aa66','#aa6644','#bb7755','#88ff99','#ee8877','#77dd66','#ddcc55','#ffee88','#ff1122'];
var activitynamecolor = [];
var activitycodecolor = [];
var numqrs = 0;
var tlength = 0;
var WD = 0;
for(var j=0; j < activitynames.length; j++)
{
   activitynamecolor[activitynames[j]] = activitycolors[j];
   activitycodecolor[activitycodes[j]] = activitycolors[j];
}
function normalizearr(alltns,events)
{
    var k=0, j=0;
    while(true)
    {
        for(j++; j < alltns.length && events[j]!='st'; j++);
        if (j >= alltns.length) break;
        var diff = alltns[j] - alltns[j-1];
        for (var j1=j; j1 < alltns.length; j1++)
            alltns[j1] -= diff;
    }
}
//semester,course,assignname,sid,
var N0 = 0;
var maT = [];
var mu = [];
var sigma = [];
var maxq = 0;
function viewsingle0(activities,width,ht,normal)
{
    var actarr = activities.replace(/,$/,'').split(/,/);
    var alltns = new Array(actarr.length);
    var events = new Array(actarr.length);
    var max = 0;
    var M = 0;
    for (var i=0; i < actarr.length; i++)
    {
        
       var te = actarr[i].split(/ /); 
       if( te.length<2)
       {
           continue;
       }
       alltns[i] = parseInt(te[0]);
       if (te[1] == 'lf') te[1] = 'sb';
       events[i] = te[1];
       
       var x =  te[1].replace(/[^0-9]/g,''); 
       if (x!='')
       {
           var t = parseInt(x);
           if (max < t) max = t;
       } 
       if (alltns[i]-alltns[0] > M)
           M = alltns[i]-alltns[0];
    }
    if(max > 200) max = 200;
    if (normal!= null&&normal)
    { 
        normalizearr(alltns,events);
         
    }
    var min = alltns[0];
    var max1 = min;
    for (var i=1; i < alltns.length; i++)
        if (alltns[i] > max1) max1 = alltns[i];
        else if (alltns[i] < min) min = alltns[i];
    M = max1 - min;
    if (M == 0) M = 1;
    var str = '<table border=1 style="border-collapse:collapse;border-color:#999999;background-color:#fafaf6;border-radius:3px" cellspacing=1 cellpadding=0  width=' + width + '><tr height=24><td width=60  style="width:60px;color:white;background-color:' + IBGCOLOR +'" valign=middle align=center><nobr>'  + words[8] + '</nobr></td><td><div style="position:relative;left:0px;top:0px;height:24px">';
    var qn = 1;
    width -= 76;
    for (var i=0; i < events.length; i++)
    {
        if (events[i]!=null && events[i]!='' && events[i].replace(/[0-9]/,'') == events[i])
        {
            var cl = activitycodecolor[events[i]];
            if (cl == null) 
                alert("invalid code: |" + events[i] + "| ");
            else
            {
                var z = Math.round((alltns[i]-min)/M*width);
                  
                str += '<div class=dotmark style=background-color:' + cl + ';position:absolute;left:' + 
                    z + 'px;top:4px ><!----></div>';
            }
        }
        
    }
    
    str += '</div></td></tr>';
    numqrs = 1;  
    var focus = alltns[0];
    var spent = [];
    var yqn = [];
        for (var i=0; i < actarr.length; i++)
        {
            if (events[i]!=null && events[i]!='' && events[i].replace(/[0-9]/g,'') != events[i])
            {
                var qn = parseInt(events[i].substring(2));
                if (events[i].indexOf('cl')==0)
                {
                    if (spent[qn] == null)
                       spent[qn] = alltns[i] - focus;
                    else
                       spent[qn] += alltns[i] - focus; 
                    focus = alltns[i];
                }
                else if (events[i].indexOf('tx')==0)
                {
                    if (spent[qn] == null)
                       spent[qn] = alltns[i] - focus;
                    else
                       spent[qn] += alltns[i] - focus; 
                }
                else if (events[i].indexOf('ef')==0)
                {
                    focus = alltns[i];
                }
                var z = Math.round((alltns[i]-min)/M*width);
                var yy = '<div class=dotmark style="background-color:' + activitycodecolor[events[i].replace(/[0-9]/g,'')] + ';position:absolute;left:' + 
                        z + 'px;top:4px" ><!----></div>';
                if (yqn[qn] == null) yqn[qn] = yy;
                else yqn[qn] += yy;
            }
            else if (events[i] == 'st')
            { 
                focus = alltns[i];
            }
        }
        maT[N0] = new Array(max+1);
        if (max > maxq) maxq = max;
        var sm = 0;
        for (var qn=1; qn <= max; qn++)
        {
            if (spent[qn]!=null)
            {
                sm += spent[qn];
            }
        }
        for (var qn=1; qn <= max; qn++)
        {
            if (spent[qn]==null)
            {
                spent[qn] = M - sm;
            }
            if (yqn[qn] == null) continue;
            str += '<tr';
            if (questionnum!=null && questionnum==qn)
               str += ' bgcolor=#f0f0eb '
            str += '><td align=center width=60><table width=58 cellspacing=0 cellpadding=0 style="margin:0px 0px 0px 0px"><tr><td width=24 align=left><div style=color:white;background-color:' + IBGCOLOR + ';height:24px;width:24px;border-radius:12px;text-align:center;font-size:20px ' + (way=='group'?('onclick=compcoefficient('+ qn + ')'):'') + '>'
            + qn + '</div></td><td align=right>'+ dot1(spent[qn]) + '</td></tr></table></td><td width=' + (width+16) + '><div style="position:relative;left:0px;top:0px;border:0px black solid;margin:0px 0px 0px 0px;height:24px;">'+ yqn[qn] + '</div></td></tr>';
           maT[N0][qn] = spent[qn];
        }
        N0++; 
          
    return str + '</table>';
}
function compcoefficient(qn)
{
   if (sigma[qn]==null)
   {
       mu[qn] = 0;
       var N = 0;

       for(var k=0; k < N0; k++)
       {
          if (maT[k][qn]==null) continue;
          mu[qn] += maT[k][qn]; 
          N++;
       }
       
       mu[qn] /= N;
       sigma[qn] = 0;
       for(var k=0; k < N0; k++)
       {
          if (maT[k][qn]==null) continue;
          sigma[qn] += (maT[k][qn] - mu[qn])*(maT[k][qn] - mu[qn]); 
       }
       sigma[qn] /= N-1;
       sigma[qn] = Math.sqrt(sigma[qn]);
   }
   myprompt("&mu;=" + timeduration(mu[qn]) + "<br>&sigma;=" + timeduration(sigma[qn]));
}
function viewsingle(course,assignname,sid,activities,width,ht,normal)
{
    var tspents = 0;
    var tstarts = 0;
    var tspans = 0;
    var nsaves = 0;
    var nwithdraws = 0;
    var actarr = activities.replace(/,$/,'').split(/,/);
    var alltns = new Array(actarr.length);
    var events = new Array(actarr.length);
    
    for (var i=0; i < actarr.length; i++)
    {
       var te = actarr[i].split(/ /);  
       alltns[i] = parseInt(te[0]);
       if (te[1] == 'lf') te[1] = 'sb';
       events[i] = te[1]; 
       
       if (te[1] == 'withdraw')
          nwithdraws++;
       else if (te[1] == 'st')
          nsaves++;
    }
    tstarts  =  timestr(alltns[0]);
    tspans  = alltns[alltns.length-1] - alltns[0];
    if (normal)
    {normalizearr(alltns,events);
   
    }
    tspents  = alltns[alltns.length-1] - alltns[0];
     
    var interval = (normal?tspents:tspans); 
    tlength = interval;
    var str = '<center>'+ unititle(words[0],'outset2');
    str += '<table align=center cellspacing=5 cellpadding=0 style="margin:0px 0px 5px 0px;" border=0><tr><td><table id=tsummary align=center style="margin:0px 0px 0px 0px;border-collapse:collapse;border-color:#666666" border=1><tr  style=background:linear-gradient(' + BBGCOLOR + ',' + TBGCOLOR + ') >';
    str +='<td >' + textmsg[673] + '</td><td >' + textmsg[466] + '</td><td >' + textmsg[317] + '</td>'; 
    str += '<td>' + words[1] + '</td><td >' + words[2] + '</td><td >' + words[3] + '</td><td>' + words[4] + '</td><td>' + words[5] + '</td></tr>'
    str += '<tr bgcolor=' + TBGCOLOR + '  height=25><td style=color:blue onclick=opensid(\'' +sid  + '\')>' + sid + '</td><td >' + course + '</td><td style=color:blue onclick=openass("' + assignname +'")>' + assignname + '</td><td align=left>' + tstarts + '</td><td  align=right>' + timeduration(tspents) + '</td><td   align=right>' +  timeduration(tspans) + '</td><td  align=right>' + nsaves + '</td><td  align=right>' + nwithdraws + '</td></tr>';          
    str += '</table>';
    
    str += '</td><td bgcolor=' + TBGCOLOR + ' style="border:1px #888888 solid"><input type=radio name=normalr onclick=tonormal(this) value=6 ' + (normal?'checked':'') + '>' + (words[6]) + '<br><input type=radio  name=normalr onclick=tonormal(this)  value=7 ' + (normal?'':'checked') + '>' + (words[7]) + '</td>'
           +'<td style="border:1px #888888 solid;color:red" id=timeline></td></tr><tr><td colspan=3><table  border=1 align=center style="margin:0px 0px 0px 0px;border-collapse:collapse;border-color:#666666"><tr  style=background:linear-gradient(' + BBGCOLOR + ',' + TBGCOLOR + ')>';
    for (var i=0; i < activitynames.length; i++)
    {
        str += '<td width=80 align=center><nobr>' + activitynames[i] + '</nobr></td>';
       
    }
    str += '</tr><tr height=24>'
    for (var i=0; i < activitynames.length; i++)
    {
        str +=  '<td align=center valign=middle><div class=dotmark style=background-color:' + activitycolors[i] + '><!----></div></td>';
       
    }
    str += '</tr></table></td></tr></table>';
    str += '<div style=float:right;color:red id=tl>' + timeduration(tlength) + '</div>';
    str += '<table  width=' + (width) + ' style="margin:0px 0px 0px 0px" cellspacing=0 cellpadding=0><tr height=16><td width=68 valign=middle><div style=width:68px;height:2px;background-color:red><!----></div></td><td width=2  valign=middle><div id=ruler style=height:4px;width:2px;background-color:red><!----></div></td><td width=' + (width-90) + ' valign=middle>'
    + '<div style=width:' + (width-90) + 'px;height:2px;background-color:red><!----></div></td><td width=10 style=font-size:10px;font-family:arial;color:red;font-weight:700  valign=middle align=left>&#10148;</td><td width=10 style=font-size:15px;font-family:arial;color:red;font-weight:700  valign=middle align=left>t</td></tr></table>'; 
   
    WD = width - 76;
    str +=  viewsingle0(activities,width,ht,normal) + '</center>';
    document.write(str);
}
function tonormal(x)
{
     postopen('visualwa.jsp',['course','assignname','sessionname','semester','subdb','normal','sid'],
                              [course,assignname,sessionname, semester,subdb,!normal,sid],'_self');
}
function dot1(t)
{
    var str = '';
    if (t >= 24*3600)
    {
       str =  Math.round(t/24/3600).toFixed(1) + 'd';
    }
    else if (t >= 3600)
        str =  Math.round(t/3600).toFixed(1) + ':';
    else if (t >= 60)
        str = Math.round(t/60).toFixed(1) + '\'';
    else
        str = t + '"'; 
    return str.replace(/\.0/,'');
        
}
function timeduration(l)
{
    l = Math.floor(l);
    if (typeof(l) == 'undefined') return 'undefined';
    var d = Math.floor(l/24/3600);
    l = l - d*24*3600;
    var h = Math.floor(l/3600);
    l = l - h*3600;
    var m = Math.floor(l/60);
    l = l - m*60;
    var str  = d + 'd'+ h + ':' + m + "'" + l + '"';
    str = str.replace(/^0[^0-9]/,'').replace(/^0[^0-9]/,'').replace(/^0[^0-9]/,'');
    str = str.replace(/([0-9]+[^0-9][0-9]+[^0-9][0-9]+[^0-9]).*/,'$1');
    return str;
}
var dataactivities ;
var tspents, tstarts, tspans,  nsaves, nwithdraws,sidarr;
let mat = [];
function show1()
{
   let x = document.getElementById('whichfield');
   x.selectedIndex = 1;
   drawhis(1,param[1],param[2],60);
}
 
function viewgroup(way,course,assignname,sids,activities,width,ht)
{
    sidarr = sids; 
    dataactivities = activities;
    tspents = new Array(sids.length);
    tstarts = new Array(sids.length);
    tspans = new Array(sids.length);
    nsaves = new Array(sids.length);
    nwithdraws = new Array(sids.length);
    var M = 0; 
    numRows = sids.length;
    for (var j=0; j < sids.length; j++)
    {
       mat[j] = [];
        var actarr = activities[j].replace(/,$/,'').split(/,/);
        var alltns = new Array(actarr.length);
        var events = new Array(actarr.length);
        nsaves[j] = nwithdraws[j] = 0;
        for (var i=0; i < actarr.length; i++)
        {
           var te = actarr[i].split(/ /);  
           alltns[i] = parseInt(te[0]);
           if (i==actarr.length-1 && alltns[i] < alltns[i-1]+3)
               alltns[i] = alltns[i-1]+3;
           if (te[1] == 'lf') te[1] = 'sb';
           events[i] = te[1];
           if (te[1] == 'withdraw')
              nwithdraws[j]++;
           else if(te[1] == 'st')
              nsaves[j]++;
        }
       mat[j][4] = nsaves[j];
        tstarts[j] =  timestr(alltns[0]);
       mat[j][1] = ~~(alltns[0]%(24*3600)/60);
       tspans[j] = alltns[alltns.length-1] - alltns[0];
       mat[j][3] = ~~(tspans[j]/60);
       normalizearr(alltns,events);
       tspents[j] = alltns[alltns.length-1] - alltns[0];
       mat[j][2] = ~~(tspents[j]/60);
       mat[j][0] = sids[j];
        if (tspents[j] > M) M = tspents[j];
    }
    
    var str = '<center>'+ unititle(msg1583,'outset2');
    str += "<span style=\"float:center;margin:10px 10px 10px 10px\">" + words[0] + ": " +  course + "-" + assignname + "</span>";
    str += '<table cellpadding=0 cellspacing=5 align=center><tr><td><table width=100% id=tsummary align=center style="border-collapse:collapse;border-color:#666666" border=1>';
    str += '<tr style=background:linear-gradient(' + BBGCOLOR + ',' + TBGCOLOR + ')><td onclick=sortc(0)>' + (way=='session'?textmsg[673]:textmsg[1022]) + '</td><td onclick=sortc(1)>' + words[1] + '</td><td onclick=sortc(2)>' + words[2] + '</td><td onclick=sortc(3)>' + words[3] + '</td><td onclick=sortc(4)>' + words[4] + '</td><td onclick=sortc(5)>' + words[5] + '</td><td align=center>' + msg386 + '</td><td  align=center>' + textmsg[69] + '</td></tr>'          
    var sum1 =0, sum2=0,sum3=0,sum4=0;
    for (var j=0; j < sids.length; j++)
    {  
        sum1+= tspents[j];
        sum2+=tspans[j];
        sum3+= nsaves[j];
        sum4+= nwithdraws[j];
        str += '<tr bgcolor=' + TBGCOLOR + '><td  style=color:blue onclick="open' +(way=='session'?'sid':'ass') 
                + '(\'' +sids[j]  + '\')">' + sids[j] 
                + '</td><td>' + tstarts[j] 
                + '</td><td align=right>' + timeduration(tspents[j]) 
                + '</td><td align=right>' + timeduration(tspans[j]) 
                + '</td><td align=right>' + nsaves[j]
                + '</td><td align=right>' + nwithdraws[j] + '</td>'
                + '</td><td align=center onclick=raw(j)  style=color:blue > >> '  
                + '</td><td align=center style=color:red onclick=deleteit() >&cross;</td>'
                + '</tr>'
    }
    if (sids.length>0)
    {
        str += '<tr bgcolor=lightyellow><td align=right>' + textmsg[194] +  '</td><td  align=center>' + sids.length  + '</td><td align=right>' + timeduration(sum1) + '</td><td align=right>' + timeduration(sum2) + '</td><td align=right>' + (sum3).toFixed(2)+ '</td><td align=right>' +  (sum4).toFixed(2) + '</td><td></td><td></td></tr>'
        str += '<tr bgcolor=lightyellow><td align=right>' + msg238 +  '</td><td  align=center style=color:blue  onclick="distribute();show1()">'  + textmsg[1898] + '</td><td align=right >' + timeduration(sum1/sids.length) + '</td><td align=right  >' + timeduration(sum2/sids.length) + '</td><td align=right  >' + (sum3/sids.length).toFixed(2)+ '</td><td align=right>' +  (sum4/sids.length).toFixed(2) + '</td><td  onclick=csv() style=color:blue; align=center>CSV</td><td></td></tr>'
    }
    str += '</table></td><td valign=bottom style="border:1px #888888 solid;color:red" id=timeline></td>' + (way=='session'?('<td valign=bottom width=68></td>'):'') + '</tr><tr><td colspan=' + (way=='session'?3:2) + '><table border=1 width=100% align=center style="border-collapse:collapse;margin:0px 0px 0px 0px;"><tr  style=background:linear-gradient(' + BBGCOLOR + ',' + TBGCOLOR + ')>';
    for (var i=0; i < activitynames.length; i++)
    {
        str += '<td align=center><nobr>' + activitynames[i] + '</nobr></td>';
    }
    str += '</tr><tr height=24  bgcolor=' + TBGCOLOR + '>'
    for (var i=0; i < activitynames.length; i++)
    {
        str +=  '<td align=center valign=middle><div class=dotmark style=background-color:' + activitycolors[i] + '><!----></div></td>';
    }
    str += '</tr></table></td></tr></table>';
    str += '<table  style="margin:0px 0px 0px 0px;" width=' + (width) + '><tr><td id=tl align=right style=color:red>' + timeduration(M) + '</td></tr></table>';
    str += '<table  style="margin:4px 0px 0px 0px;" width=' + (width) + ' cellspacing=0 cellpadding=0><tr height=16><td width=68  valign=middle><div style=width:68px;height:2px;background-color:red><!----></div></td><td width=2 valign=middle><div  id=ruler style=height:4px;width:2px;background-color:red><!----></div></td><td width=' + (width-90) + ' valign=middle>'
    + '<div style=width:' + (width-90) + 'px;height:2px;background-color:red><!----></div></td><td width=10 style=font-size:10px;font-family:arial;color:red;font-weight:700  valign=middle align=left>&#10148;</td><td width=10 style=font-size:15px;font-family:arial;color:red;font-weight:700  valign=middle align=left>t</td></tr></table>'; 
    
    str += '<table style="margin:-8px 0px 0px 0px;border-collapse:collapse;border-color:#888888" border=0>'
    for (j=0; j < sids.length; j++)
    {
        str += '<tr height=30><td  align=left><table width=100% ><tr><td width=60  align=left style=font-weight:700px;color:blue align=left valign=bottom onclick=showdata(this,' + j + ')>' + sids[j] + '</td><td align=left></td></tr></table></td></tr>';
         
        str += '<tr><td align=left>' + viewsingle0(activities[j],76 + (width-76)*tspents[j]/M,ht,'true') + '</td></tr>'; 
    }
    tlength = M;
    WD = width - 76;
    document.write(str + '</table></center>');
     
}
function csv()
{
    var str = textmsg[673] + ',' + words[1] + ',' + words[2] + ',' + words[3] + ',' + words[4] + ',' + words[5];
    for (var qn = 1; qn < maxq; qn++) str += ",Q" + qn;
    str +="\n";
    for (var k=0; k < N0; k++)
    {
        str += sidarr[k] + "," +   tstarts[k] + ',' +  tspents[k] + ',' + tspans[k]  +',' + nsaves[k] + ',' +nwithdraws[k];
        for (var qn = 1; qn < maxq; qn++) str += "," + (maT[k][qn]==null?0:maT[k][qn]);
        if (k < N0-1) str += "\n";
    }
    myprompt("<center><textarea id=csvcontent cols=70 rows=23 >" + str + '</textarea><input id="download" type="button" class="GreenButton" style="width:'
            + (4.5*font_size) + 'px;" value="' + textmsg[1871].split(/@/)[3]+'" onclick="download1()"></center>',null,null,'CSV');
}
function deleteit(j)
{
    postopen('visualwa.jsp', "semester,course,sessionname,assignname,subdb,normal".split(/,/),
    [semester,course,sessionname,assignname,subdb,normal],
    "_self")
}
function raw(j)
{
    myprompt("<textarea rows=25 cols=40 style=border:0px;float:center>"+ dataactivities[j] + "</textarea>");
}
function download1()
{
    download(null, 'csvcontent',course + '-'+ assignname +  "grades.csv");
}
timeunit = function(){return '(' + textmsg[1694].split(/@/)[1] + ')';}
bestwidth = function (x)
{
    let m = extremal(x);
    let l = ~~((m[1]-m[0])/10);
    let z=[1,10, 60,120,600,1440];
    let mm = 0, mi=1000;
    for (let j=0; j < z.length; j++)
    {
       let w = (Math.abs(z[j] - l)/l);
       if (w <mi){mi = w;mm=j}
    }
    let wd = z[mm];
    if ((m[1]-m[0])/wd < 5 && mm>0) 
    {
        wd = z[mm-1];
    }
    if ((m[1]-m[0])/wd < 5) 
    {
           wd = 1;
    }
    return wd;
}
function download(contents, id,filename) 
{
        let mime_type =  "text/csv";
        if (contents == null)
        contents = document.getElementById(id).value;
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
function showdata(td, j)
{
    if (td.parentNode.cells[1].innerHTML=='' )
    {
         
        var st = parseInt(dataactivities[j].replace(/^[ ]+/,'').replace(/([0-9]+).*/,'$1'));
        
        var x = dataactivities[j].replace(/,$/,'').split(/,/);
        var str = '';
        for (var i=0; i < x.length; i++)
        {
            var n = parseInt(x[i].replace(/([0-9]+).*/g,'$1'));
            str += (n - st) +   x[i].replace(/[0-9]/g,'') + ',';
        }
        td.parentNode.cells[1].innerHTML = str;
      
        //td.parentNode.cells[1].innerHTML = dataactivities[j];

    }
    else
       td.parentNode.cells[1].innerHTML = ''; 
}
 
let numCols = 5;
let numRows = 0;
let ctype = 'TNNNNN'.split(/|/); 
function opensid(sid)
{
    open('studentpage.jsp?mode=instructor&sid=' + sid)
}
function openass(ass)
{
    postopen('assigndoc.jsp',['course','assignname','sessionname','semester','subdb','option'],[course,ass,sessionname,semester,subdb,'des'],'_blank');
}

var timeline = document.getElementById('timeline');
 
var ende = document.getElementById('end');
var xy = null,xy1;
function placemark()
{
    xy = findPositionnoScrolling(document.getElementById('ruler'));
    xy1 = findPositionnoScrolling(document.getElementById('end'));
    
    var m = timeduration(tlength).replace(/([0-9]+[^0-9][0-9]+[^0-9]).*/,'$1').replace(/[0-9]/g,'').split(/|/);
    
    var unitname = []; unitname['d'] = 'Day';unitname[':'] = 'Hour';unitname['\''] = 'Minute';unitname['"'] = 'Second';
    var seconds = []; seconds['"'] = 1; seconds['\''] = 60; seconds[':'] = 3600; seconds['d'] = 24*3600;
    var nums = []; nums['"'] = [15,10];nums['\''] = [15,10,1]; nums[':'] = [6,4,2];nums['d'] = [10,1];
    var j, n=0;
    var str = "<input name=gapn type=radio value=0 onclick=putline(this) checked>" +  words[9];
    var xx = document.getElementById('timeline');
    if (xx == null) return;
    var N = xx.parentNode.cells[0].getElementsByTagName('table')[0].rows.length;
    N = Math.ceil(4/N);
    var n1 = 1; 
    for(j=0; j < m.length; j++)
    {
        var t = m[j];
        var num = nums[t];
        for (var k=0; k < num.length && n < 3; k++)
           if (num[k]*seconds[t] < tlength)
           {
               if (n1%N==0) str += "<br>";
               str += "<input name=gapn type=radio value=" + num[k]*seconds[t] + " onclick=putline(this)>" + num[k] + t;
               n1++;
               n++;
           }
        
    }
    xx.innerHTML = str;
}     
var putline = function(rd)
{
    var i=0;
    var g0 = parseInt(rd.value);
    var g = WD * g0/tlength; 
    document.getElementById('tl').style.visibility = (rd.value=='0'?'visible':'hidden');
    while (true)
    {
        var line = document.getElementById('tl' + i);
        if (line == null) break;
        document.body.removeChild(line);
        var tm = document.getElementById('tm' + i);
        if (tm == null) break;
        document.body.removeChild(tm);
        i++;
    }
    if (g == 0) return;

    var k=0;
    var y = xy[1] + 2;
    var h = xy1[1] - xy[1];
    while (k*g0 < tlength)
    {
        var x = xy[0] + k*g;
        var ms = timeduration(k*g0).replace(/([0-9]+[^0-9])([0-9]+[^0-9]).*/,'$1 $2').split(/ /);
        var mk = ms[0];
        var wd = 1;
        if (k==0) 
        {
            wd = 2;
            mk = '0'
        }
        else if (ms.length==2)
        {
            if (ms[1].charAt(0) == '0')
            {
                mk = ms[0];
                wd = 2;
            }
            else
                mk = ms[1];
        }
        var line = document.createElement('div');
        line.id='tl' +  k;
        line.style.cssText = 'background-color:red;width:'+ wd + 'px;height:' + h + 'px;position:absolute;top:' + y + 'px;left:' + x + 'px';
        document.body.appendChild(line);
        var tm = document.createElement('span');
        tm.id='tm' +  k;
        tm.style.cssText = 'text-align:center;color:red;width:30px;height:15px;position:absolute;top:' + (y-18) + 'px;left:' + (x-15) + 'px';
        document.body.appendChild(tm);
        tm.innerHTML = mk;
        k++;
    }
   
}
var onloadbeforeviewa = null;
if(typeof window.onload == 'function')
    onloadbeforeviewa = window.onload; 
window.onload = function()
{
    if (onloadbeforeviewa!=null) 
        onloadbeforeviewa();
    placemark();
}

 

