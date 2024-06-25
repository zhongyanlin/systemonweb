var pi = 1;
var dodivide = true;
var doproduct = false;
var doaddproduct = false;
var doaddweight = false;
var tblv = new Array();
var maintbl = document.getElementById('maintbl');
var s, s1=0,s2=0;
var buttons = "<table align=center><tr><td class=GreenButton style=width:72px onclick=pause() align=center>" + textmsg[820] + "</td><td  align=center class=GreenButton  style=width:72px  onclick=resume()>" 
        + textmsg[821] + "</td></tr></table>";
var delayhandle = null;
var tblheight, tblpos,tblcellnum;
function animateinit()
{
    tblheight = maintbl.offsetHeight;
    tblpos = findPositionnoScrolling(maintbl)[1];
    tblcellnum = maintbl.rows.length;
    var hh = 0;
    if (typeof(document.scrollingElement)!='undefined')
            document.scrollingElement.scrollTop= hh;
        else (typeof(document.documentElement)!='undefined' && typeof(document.documentElement.scrollTop)!='undefined')
            document.documentElement.scrollTop = hh;
}

function pause()
{
    clearTimeout(delayhandle);
}
function resume()
{
     animate1();
}
function stop()
{
    clearTimeout(delayhandle);
    pi = 1;
    dodivide = true;
    doproduct = false;
    doaddproduct = false;
    doaddweight = false;
    for (var i=0; i < maintbl.rows.length; i++)
        {
            for (var j=0; j < maintbl.rows[i].cells.length; j++)
            {
               maintbl.rows[i].cells[j].innerHTML = tblv[i][j];
            }
        }
}
function animate1()
{
    
    if (pi == 1 && dodivide)
    {
        for (var i=0; i < maintbl.rows.length; i++)
        {
            tblv[i] = new Array();
            for (var j=0; j < maintbl.rows[i].cells.length; j++)
            {
                tblv[i][j] = maintbl.rows[i].cells[j].innerHTML;
                maintbl.rows[i].cells[j].style.width = (maintbl.rows[i].cells[j].offsetWidth-6) + 'px';
            }
            maintbl.rows[i].cells[3].innerHTML = maintbl.rows[i].cells[4].innerHTML = '';
        }
        maintbl.rows[0].cells[3].innerHTML = 'Product';
        maintbl.rows[0].cells[4].innerHTML = 'Sum';
         maintbl.rows[maintbl.rows.length-1].cells[1].innerHTML = '';
        maintbl.rows[maintbl.rows.length-1].cells[2].innerHTML = '';
        myprompt( textmsg[1701]+ "....." + buttons);
        moveprompt();
    }
    if (dodivide)
    {
        if (pi < maintbl.rows.length-1)
        {  
            if (!isNaN(maintbl.rows[pi].cells[1].innerHTML.replace(new RegExp('/'),'')) )
            {
                if (!isNaN(maintbl.rows[pi].cells[2].innerHTML)) 
                {
                  s = eval(maintbl.rows[pi].cells[1].innerHTML);
                  maintbl.rows[pi].cells[1].innerHTML = ''+ (Math.round(s*100)/100);
                 }
                 else
                 {
                    maintbl.rows[pi].cells[1].innerHTML = maintbl.rows[pi].cells[1].innerHTML.replace(/<[^>]+>/g,'').replace(/\/.*/,''); 
                 }
             }
            pi++;
            moveprompt();
            delayhandle = setTimeout(animate1, 500);
        }
        else
        {
            pi = 1;
            s = 0;
            dodivide = false;
            doproduct = true;
            myprompt(textmsg[1702] +"......" + buttons);
            promptwin.style.left = '0px';
            promptwin.style.left = '0px';
            moveprompt();
            delayhandle = setTimeout(animate1, 1000);
        }
    }
    else if (doproduct)
    {
        if (pi < maintbl.rows.length-1)
        {
            if (!isNaN(maintbl.rows[pi].cells[1].innerHTML))
            { 
                if (!isNaN(maintbl.rows[pi].cells[2].innerHTML) )
                {
                   maintbl.rows[pi].cells[3].innerHTML = eval(maintbl.rows[pi].cells[1].innerHTML.replace(/<[^>]+>/g,'')+'*'+maintbl.rows[pi].cells[2].innerHTML.replace(/<[^>]+>/g,''));
                   maintbl.rows[pi].cells[2].innerHTML = 'x ' + maintbl.rows[pi].cells[2].innerHTML + ' = ';
                }
                else
                {
                   maintbl.rows[pi].cells[3].innerHTML = maintbl.rows[pi].cells[1].innerHTML;
                   //maintbl.rows[pi].cells[2].innerHTML = 'x 100% = ';
                }
            }
            pi++;
            moveprompt();
            delayhandle = setTimeout(animate1, 500);
        }
        else
        { 
            for (var k=0; k < pi; k++) 
            {
                maintbl.rows[k].cells[2].innerHTML = maintbl.rows[k].cells[2].innerHTML.replace(/x/,'');  
                maintbl.rows[k].cells[2].innerHTML = maintbl.rows[k].cells[2].innerHTML.replace(/=/,'');  
                maintbl.rows[k].cells[2].innerHTML = maintbl.rows[k].cells[2].innerHTML.replace(/ /g,''); 
            }
            s = 0;
            pi = 1;
            doproduct = false;
            doaddproduct = true;
             myprompt(textmsg[1703] + "....." + buttons);
             moveprompt();
            delayhandle = setTimeout(animate1, 2000); 
        }
    }
    else if (doaddproduct)
    {
        if (pi < maintbl.rows.length-1)
        {
          if (!isNaN(maintbl.rows[pi].cells[1].innerHTML)  && !isNaN(maintbl.rows[pi].cells[3].innerHTML)) 
          {
             if ( !isNaN(maintbl.rows[pi].cells[2].innerHTML))
             {
                 s += parseFloat(maintbl.rows[pi].cells[3].innerHTML);
                 s = Math.round(100*s)/100;
                 maintbl.rows[pi].cells[4].innerHTML = ''+s;
             }
             else
             {
                 s2 += parseFloat(maintbl.rows[pi].cells[3].innerHTML);
                 s2 = Math.round(100*s2)/100;
                 maintbl.rows[pi].cells[4].innerHTML = ''+s2;
             }
          }
           
          pi++;
          moveprompt();
          delayhandle = setTimeout(animate1, 500);
        }
        else
        {
            maintbl.rows[pi].cells[1].innerHTML = '<b>'+s + "</b>";
            for (var k=0; k < pi; k++) 
            {
                maintbl.rows[k].cells[3].innerHTML = '';
                maintbl.rows[k].cells[4].innerHTML = '';
            }
            doaddproduct = false;
            doaddweight = true;
            pi = 1;
             myprompt(textmsg[1703] + ".....<b>s=" +  s + "</b><br>" + textmsg[1704] + "......" + buttons);
            s1 = s;
            s= 0;
            moveprompt();
            delayhandle = setTimeout(animate1, 2000);
             
        }
    }
    else if (doaddweight)
    {
        if (pi < maintbl.rows.length-1)
        {
          if (!isNaN(maintbl.rows[pi].cells[1].innerHTML)) 
          {
              if (isNaN(maintbl.rows[pi].cells[2].innerHTML) == false)
              { 
               s += parseFloat(maintbl.rows[pi].cells[2].innerHTML);
               s = Math.round(100*s)/100;
               maintbl.rows[pi].cells[3].innerHTML = ''+s;
              }
          }
          pi++;
          moveprompt();
          delayhandle = setTimeout(animate1, 500);
        }
        else
        {
            maintbl.rows[pi].cells[2].innerHTML = '<b>'+s +"</b>";
            for (var k=0; k < pi; k++) 
                maintbl.rows[k].cells[3].innerHTML = '';
            doaddweight = false;
            var s3 = Math.round(eval(s1*1000/s))/10;
            var s4 = ''; if (s2>0) s4 = " + " + s2; if (deductpoint>0) s4 += " - " + deductpoint;
            myprompt("<b>w = " + s + "</b>. " + textmsg[1705]  + "<center><div class=outset3 style=width:" + (s4==''?130:260) + "px ><table align=center cellspacing=0 cellpadding=0><tr><td  align=center valign=bottom>s</td><td  width=40  align=center> </td><td   align=center valign=bottom>" + s1 + "</td><td  width=40>  </td><td  align=center valign=bottom>" + s3 +  "</td>" + (s4==''?'':("<td   width=40  ></td><td><nobr>" + s3 + s4 + "</nobr></td><td></td><td><nobr>" + (s3 +s2-deductpoint)+ "</nobr></td>")) + "</tr>"
                    +"<tr height=5><td><div style=height:1px;width:20px;background-color:black></div></td><td align=center>=</td><td><div style=height:1px;width:40px;background-color:black></div></td><td align=center>=</td><td><div style=height:1px;width:40px;background-color:black></div></td>" + (s4==''?"":("<td align=center>=></td><td><div style=height:1px;width:60px;background-color:black></div></td><td align=center>=</td><td><div style=height:1px;width:40px;background-color:black></div></td>")) + "</tr>"
                    +"<tr><td   align=center valign=top>w</td><td></td><td  align=center valign=top>" + s + "</td><td></td><td  align=center valign=top>100</td>" + (s4==''?'':("<td></td><td  align=center valign=top>100</td><td></td><td  align=center valign=top>100</td>")) + "</tr></table></div></center>");
            moveprompt(); 
            delayhandle = setTimeout(animate1, 2000);
        }
    }
    else
    {
        for (var i=0; i < maintbl.rows.length; i++)
        {
            for (var j=0; j < maintbl.rows[i].cells.length; j++)
            {
               maintbl.rows[i].cells[j].innerHTML = tblv[i][j];
            }
        }
        pi = 1;
        dodivide = true;
        //closeprompt();
    }
    
}
function moveprompt()
{
    if ( promptwin != null)
    {
         promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].onclick
        = function(){stop();closeprompt();}
        var hh = tblpos + tblheight/tblcellnum*(pi-6);
        
        if (hh < 0) hh = 0; if (hh < 500) return;
       // promptwin.style.top = hh+ 'px'; 
        if (typeof(document.scrollingElement)!='undefined')
            document.scrollingElement.scrollTop= hh;
        else (typeof(document.documentElement)!='undefined' && typeof(document.documentElement.scrollTop)!='undefined')
            document.documentElement.scrollTop = hh;
        
        //parent.frames[0].promptwin.style.width = maintbl.offsetWidth +  'px';
    }
}
var DBGCOLOR = "white";
function histogram(assignname,myscore,total)  
{
    document.h.assignname.value = assignname;
    document.h.myscore.value = ''+ Math.round(myscore);
    document.h.total.value = ""+ total;
    formnewaction(document.h,"checkgrades.jsp");
    document.h.target="w" + tstmp;
    visual(document.h);
    document.h.submit();
}
function openinner(assignname)
{
    myprompt("<iframe name=openlink width=" + (thispagewidth()-30) + " height=600>",null,null,assignname);
    var h = 0;
        if (typeof(document.scrollingElement)!='undefined')
            h = document.scrollingElement.scrollTop;
        else (typeof(document.documentElement)!='undefined' && typeof(document.documentElement.scrollTop)!='undefined')
            h = document.documentElement.scrollTop;
        promptwin.style.top = h + 'px'; 
        promptwin.style.left = '0px';
}

function graded(assignname)  
{
    openinner(assignname);
    formnewaction(document.h,"DataForm");
    document.h.assignname.value = assignname;
    document.h.target = "openlink";
    
    visual(document.h);
    document.h.submit();
}
 
function openass(str,missed )
{
    openinner(str);
    makeformhiddenele(document.h,"missed", missed);
    document.h.assignname.value = str;
    formnewaction(document.h, "assigndoc.jsp");
    document.h.option.value = "des";
    document.h.target = "openlink";
    visual(document.h);
    document.h.submit();
}
var activei = 0;
var activetbl = null;
function modify(i, td, tl, err)
{
    activei = i;
    var sel = document.getElementById('leavetime');
    if (i == timemoments.length-1 && sel.selectedIndex == 0)
    {
        myprompt(sel.options[sel.selectedIndex].value  );
        return;
    }
    if (td!=null){
    var tbl = td.parentNode.parentNode;
    if (tbl.tagName.toLowerCase()!='table') tbl= tbl.parentNode;
    activetbl = tbl;
    }
    if (err==null) err = formatstr(excuses[i],'0');
    if (err.replace(/<[^>]+>/g,'') == '') err = textmsg[1634] + ' '+ tl;
    myprompt(err,"", "saveexcuse(v)", tl);
    var id = document.getElementById('promptinput');
    var p = id.parentNode;
   
    var txt = document.createElement("textarea");
    txt.onchange = function()
    {
        var pid = document.getElementById('promptinput');
        pid.value = this.value;
    }
    txt.id= "prompttxt";
    var j = 7;//excuses[i].replace(/[^\n]/g,'').length;
    
    txt.rows = j;
    txt.cols = 70;
    p.insertBefore(txt, id);
    
   // txt.value = excuses[i];
    id.style="width:1px;height:1px;visibility:hidden";
    if (timemoments[i] > (new Date()).getTime()/1000 || !userissid)
    {
    var but = document.createElement('input');
    but.className = 'RedButton';
    but.style='width:' + (font_size*4) + 'px';
    but.type= 'button';
    but.value = textmsg[69];
    p.appendChild(but);
    but.onclick = delrecord;
    }
}
function delrecord()
{
     postopen("checkgrades.jsp", 
        ["subdb","course", "sid","semester", "myscore", "excuse"], 
        [subdb, courseid,sid,semester, timemoments[activei],''],
        "w" + tstmp);
}
 
var newexcuse;
function newa(i,td)
{
    activei = i;
    if (td!=null)
    {
        var tbl = td.parentNode.parentNode;
        if (tbl.tagName.toLowerCase()!='table') tbl= tbl.parentNode;
        activetbl = tbl;
    }
    if (timemoments[activei]==null || excuses[activei] == null || timemoments[activei]=='' || excuses[activei] == '')
    {
        let tbl = document.getElementById("absencetbl");
        newexcuse = tbl.rows[i+2].cells[3];
        let str = tbl.rows[i+2].cells[2].getElementsByTagName('select')[0].outerHTML;
        str = str.replace(/hidden/,'visible');
        str = str.replace(/goodtime/,'synleavetime();goodtime');
        str = str.replace(/leavetime/,'leavetime1').replace(/,[^,]+,/, ',newexcuse,');  
        str = "<Center>" +  tbl.rows[0].cells[2].innerHTML + ': ' + str  +"</center>" ;
      /*  myprompt( "(1)" + therow(i).cells[2].getElementsByTagName('select')[0].outerHTML + "<br>"
        + "(2)" + therow(i).cells[3].innerHTML + "<br>"  
        + "(3)" + therow(i).cells[4].innerHTML + "<br>" );*/
        myprompt(str,null,null,tbl.rows[0].cells[1].innerHTML);
       // let newtbl = document.getElementById('newtbl');
       // newtbl.rows[0].cells[1].appendChild(tbl.rows[i+2].cells[2].getElementsByTagName('select')[0]);
       // tbl.rows[i+2].cells[3].innerHTML = '';
    }
    else
    {
        parent.frames[0].openit1('checkgrades.jsp');
    }
}

function therow(j)
{
    if (j < activetbl.rows.length-3)
        return activetbl.rows[j+1];
    else
        return activetbl.rows[activetbl.rows.length-1];
}
function reshow(err)
{
     if (err == 'add file')
     {
         
         tbl = document.getElementById("absencetbl");
         document.getElementById('leavetime').style.visibility = 'visible';
         document.getElementById('newexcuse').style.visibility = 'visible';
          document.getElementById('newfileplus').innerHTML = '[+]<input type="hidden" value="" id="att' + (tbl.rows.length-3) + '" >';
          
         myprompt('<div style=float:center><a href="javascript:invokeupload()" >'
                 + textmsg[1836].split(/@/)[5] + "</a><br>" + msg1381 + "<br><a href=\"javascript:therow(activei).cells[7].innerHTML=textmsg[1629];closeprompt()\">" + textmsg[1357] + "</a></div>",null,null,tbl.rows[0].cells[4].innerHTML);
     }
     else
         modify(activei, null, " ", err);
}
function invokeupload()
{
    attachmore(document.getElementById("absencetbl").rows.length-3,document.getElementById("newfileplus"));
}
function saveexcuse(v)
{
   var j = v.indexOf('\n'); if (j == -1) j = v.length; 
   therow(activei).cells[7].innerHTML = textmsg[236];
   therow(activei).cells[3].innerHTML = "<span style=\"width:200px;overflow:hidden\">" + v.substring(0,j)  + "</span>";
   postopen("checkgrades.jsp", ["subdb","course", "sid","semester", "myscore", "excuse"], 
   [subdb, courseid,sid,semester, timemoments[activei],(excuses[activei] + "\n" + v).replace(/^\n/,'')],"w" + tstmp);
   excuses[activei] = (excuses[activei] + "\n" + v).replace(/^\n/,'');
}
var attachmore = function(i,td)
{
    activei = i;
    var sel = document.getElementById('leavetime');
    if (i == timemoments.length-1 && sel.selectedIndex == 0)
    {
        myprompt(sel.options[sel.selectedIndex].value  );
        return;
    }
    if (td!=null)
    {
        var tbl = td.parentNode.parentNode;
        if (tbl.tagName.toLowerCase()!='table') tbl= tbl.parentNode;
        activetbl = tbl;
    }
    ResizeUploaded.attachref = document.getElementById('att' + i);
    document.ff.localpath.click();
    
}
syn = function(x,y)
{
     
    ResizeUploaded.attachref = document.getElementById('att' + activei);
    if (x.indexOf('del') == 0)
    {
        var q = new CSVParse(document.getElementById('att' + activei).value.replace(/,$/,''), '\'',"@", ",").nextMatrix();
        var w = '';
        var c = '';
        for (var j=0; j < q.length; j++)
           if (q[j].length > 2 && q[j][2].indexOf(y)!=0 && q[j][2]!='' && q[j][0].indexOf(y) < 0 && q[j][1].indexOf(y) < 0)
           {   
               w +=   q[j][0] + '@' +  q[j][1] + '@' + q[j][2] + ","; 
               c += "," + q[j][0];
           }
        
        document.getElementById('att' + activei).value = ResizeUploaded.zip(w);
        therow(activei).cells[4].innerHTML = c.replace(/^,/,'');
        ResizeUploaded.attachman(document.getElementById('att' + activei));
    }
    else 
        ResizeUploaded.uploaded(x,y,document.getElementById('att' + activei));
    therow(activei).cells[7].innerHTML = textmsg[1629];
    postopen("checkgrades.jsp", 
    ["subdb","course", "sid","semester", "myscore", "attach"], 
    [subdb, courseid,sid,semester, timemoments[activei],ResizeUploaded.attachref.value],"w" + tstmp);
}
function uploadf()
{
    document.ff.target = "w" + tstmp;
    document.ff.submit();
}
function showattachment(v)
{
    v = ResizeUploaded.unzip(v);
    
    var x = new CSVParse(v,'\'',"@",",").nextMatrix();
    var y = '';
    for(var j=0; j < x.length; j++)
        y += "," +  x[j][0];
    y = y.replace(/^,/,'');
    therow(activei).cells[4].innerHTML = y;
}
function attach(i, td)
{
    if (document.getElementById('att' + i).value == null)
        document.getElementById('att' + i).value = "";
    activei = i;
    if (td!=null)
    {
        var tbl = td.parentNode.parentNode;
        if (tbl.tagName.toLowerCase()!='table') tbl= tbl.parentNode;
        activetbl = tbl;
    }
    ResizeUploaded.attachman(document.getElementById('att' + i));
}
var filecounts = [];
ResizeUploaded.deleteAttachedFile = function (file)
{
   var xs = file.split(/@/);
   var y = xs[2];
   if (filecounts[y] == null) 
       filecounts[y] = "1";
   else
       filecounts[y] = "" + (parseInt(filecounts[y]) + 1);
   
   ResizeUploaded.setfiletobedel(file);
   ResizeUploaded.ifdelfilealso = false;
   ResizeUploaded.savedfiletodelete ="UploadChangePic?pathcode=" + y + '&tcode=' + xs[1];
   var mm = textmsg[809] + "?";
   myprompt(mm,null,"ResizeUploaded.delgoahead(v)");
   if (parseInt(filecounts[y]) > 1)
   {
        var q = new CSVParse(document.getElementById('att' + activei).value.replace(/,$/,''), '\'',"@", ",").nextMatrix();
        var w = '';
        var c = '';
        for (var j=0; j < q.length; j++)
           if (q[j].length > 2 && q[j][2].indexOf(y)!=0 && q[j][2]!='' && q[j][0].indexOf(y) < 0 && q[j][1].indexOf(y) < 0)
           {   
               w +=   q[j][0] + '@' +  q[j][1] + '@' + q[j][2] + ","; 
               c += "," + q[j][0];
           }
        
        document.getElementById('att' + activei).value = ResizeUploaded.zip(w);
        therow(activei).cells[4].innerHTML = c.replace(/^,/,'');
   }
}
var toMinute = function  (slot) // MWF 11:00am - 11:50 
    {
        if (slot.charAt(0).replace(/[0-9]/,'') == '') 
            slot = 'A' + slot;
        var r = new RegExp(/[0-9][0-9]?[ ]*:[ ]*[0-9][0-9]?/);
        var k = 0;
        var b = 0;
        if (slot.replace(/[0-9][0-9]/,'')==slot) return '';
        if (slot.replace(/[0-9][0-9]/,'').replace(/[0-9][0-9]/,'').replace(/[0-9][0-9]/,'') == slot.replace(/[0-9][0-9]/,'').replace(/[0-9][0-9]/,''))
        {
            slot = slot + "-" + slot.replace(/.*[^0-9]([0-9][0-9]?[ ]*:[ ]*[0-9][0-9]?).*/,"$1");

        }
        var digits1, digits2,digits3, digits, dstr, ans = "", before1, after1, days="",day0, letters; 
        while (true)
        {
            var m = r.exec(slot.substring(k));
            if (m == null)
            {
                before1 = slot.substring(k);
                digits3= digits1;
                day0 = days;
                digits1 = "";
                b++;
            } else
            {
                b++;
                var i = m.index + k;

                if (b % 2 == 1)
                {
                    digits3= digits1;
                    day0 = days;
                    digits1 = m.toString();
                    before1 = slot.substring(k, i);
                } else
                {
                    digits2 = m.toString();
                    after1 = slot.substring(k, i);
                }
                k += m.index + m.toString().length;
            }
            if (b % 2 == 1)
            {
                 before1 = before1.replace(/^[ ]+/,'');
                var apm2 = before1.toLowerCase();
                if (apm2.indexOf('pm') !=0 && apm2.indexOf('am') !=0)
                {
                    apm2 = '';
                    days = before1;
                } else
                {
                    days = before1.substring(2);
                }
            } 
            else
            {
                var apm1 = after1.toLowerCase();
            }
            if (b % 2 == 1 && b>1)
            {
                var digits = (digits3 + " " + digits2).replace(/([0-9][0-9]?)[ ]*:[ ]*([0-9][0-9]?)[^0-9]+([0-9][0-9]?)[ ]*:[ ]*([0-9][0-9]?).*/, "$1:$2:$3:$4").split(":");
                letters = day0;
                var apm = [apm1, apm2];
                var ln = textmsg[1739].split(/@/);
                var sn = textmsg[830].split(/|/);
                for (var l = 0; l < 7; l++)
                {
                    letters = letters.replace( ln[i] , sn[i]);
                }
                letters = letters.replace(/sunday/i, sn[0]).replace(/monday/i, sn[1]).replace(/tuesday/i, sn[2]).replace(/wednesday/i, sn[3])
                        .replace(/thursday/i, sn[4]).replace(/Friday/i, sn[5]).replace(/saturday/i, sn[6]).replace(/,/g, '').replace(/ /g, '');
                for (var i = 0; i < letters.length; i++) 
                {
                    var c = letters.charAt(i);
                    if (textmsg[830].indexOf(c)<0 && "AUMTWRFS".indexOf(c) < 0) continue;
                    //var  x = c == 'M' ? 1 : c == 'T' ? 2 : c == 'W' ? 3 : c == 'R' ? 4 : c == 'F' ? 5 : c == 'S' ? 6 : c == 'U' ? 0 : 7;
                    var x = 0;
                    if (digits.length != 4) {
                        return null;
                    }
                    if (x == 7) {
                        return null;
                    }


                    var t = parseInt(digits[0].replace(/^0/, ""));
                    if (t > 23 ||  t < 0) {
                        return null;
                    }
                    t -= 8;
                    if (t < 0) {
                        t += 12 ;
                    }
                    x += t * 60;

                    t = parseInt(digits[1].replace(/^0/, ""));
                    if (t >= 60) 
                    {
                        return null;
                    }
                    x += t;

                    t = parseInt(digits[2].replace(/^0/, ""));
                    if (t > 23   || t < 0) {
                        return null;
                    }
                    t -= 8;
                    if (t<0) {
                        t += 12 ;
                    }
                    var y = t * 60;
                    t = parseInt(digits[3].replace(/^0/, ""));
                    if (t >= 60) {
                        return null;
                    }
                    y += t;
 
                    if (c=='A')
                    {
                        for (var j=0; j < 7; j++)
                        ans += "UMTWRFS".charAt(j) + Math.round(x)   + ",";
                    }
                    else
                        ans += nm2min(c)*24*60 + 8*60 + Math.round(x) +  ",";
                }
            }

            if (digits1 == "")
                break;
        }
 
        return ans;    // 121203,34343,343435
    }
    function nm2min(c)
    {
        if (c == 'U')return 0;
         if (c == 'M')return 1;
          if (c == 'T')return 2;
           if (c == 'W')return 3;
            if (c == 'R')return 4;
             if (c == 'F')return 5;
              if (c == 'S')return 6;
    }
function inittime()
{
    var str = parent.frames[0].getSch();
   
    var timest =  toMinute(str);
    if (timest == null) 
    {
       return;
    }
    var times = timest.replace(/,$/,'').split(/,/); 
    var now = new Date();
    var j = now.getDay();
    var p = now.getTime();
    var s = p - j*24*3600000 - now.getHours()*3600000 - now.getMinutes()*60000 - now.getSeconds()*1000;
   
    var m = 1;
    var sel = document.getElementById('leavetime');
    for (var l=0; l < 4; l++)
    {
        for (var i=0; i < times.length; i++)
        {
            var k = parseInt(times[i])*60000 + s + l*7*24*3600000;
            if (k < p) continue;
            k = Math.round(k/1000);
            sel.options[m++] = new Option(timestr(k), k);
        }
    }
    timemoments[timemoments.length-1] = 0;
}
function synleavetime()
{
    document.getElementById('leavetime').selectedIndex =  document.getElementById('leavetime1').selectedIndex;
}
function goodtime(sel)
{
    timemoments[timemoments.length-1] = sel.options[sel.selectedIndex].value;
}

function whydeduct(p)
{
    if (userissid)
    {
    var x = p.replace(/.*,([0-9]+)$/,'$1');
    p += ";...," + x;
    myprompt(new CSVParse(p,'|',",", ";").tohtml().replace(/<table /, '<table align=center style=border-collapse:collapse '));
    }
    else
    {
       modifyded(p);
    }
}

function modifyded(absentdeduct)
{
    var kk = absentdeduct.indexOf(";");
    var lbl = absentdeduct.substring(0,kk).split(/,/);
    absentdeduct = absentdeduct.substring(kk+1);
    var x = (new CSVParse(absentdeduct, '|',',',';')).nextMatrix();
    var k = parseInt(x[x.length-1][0])+1;
    for (var j=x.length; j < 30; j++,k++)
        x[x.length] = [k, 0];
    var str = "<center>"; var kk = 0;
    for (var j=0; j < x.length; j++)
    {
        if (j % 10 == 0)
            str += "<table id=tbl" + (kk++) + " cellspacing=1 border=1 style=\"border-radius:3px;border-collapse:collapse;display:inline-block;margin:3px 3px 3px 3px\" ><tr style=\"font-weight:700;background:linear-gradient(to bottom," + BBGCOLOR +"," + TBGCOLOR + ")\"><td align=right>" + textmsg[542] + "</td><td align=right>" +  msg1601 + "</td></tr>";
        str += "<tr  bgcolor=" + TBGCOLOR +"><td align=right style=color:#004400 >" + x[j][0] + "</td><td align=right><input  value=" + x[j][1] + "  style=\"border:0px;text-align:right;color:red\" size=3></td></tr>";
        if (j % 10 == 9)
           str += "</table>"; 
    }
    str += "<br><input type=button class=GreenButton style=width:" + (font_size*4.5) + "px onclick=updateded() value=\""
     + textmsg[66] + "\">";
     str += "<input type=button class=OrangeButton style=width:" + (font_size*4.5) + "px onclick=closeprompt() value=\""
     + textmsg[18] + "\"></center>"; 
     myprompt(str, null,null, msg1600 + " " + msg1601);
     var w0 = document.getElementById('tbl0').offsetWidth * 3 + 12;
     var h0 = document.getElementById('tbl0').offsetWidth   + 45;
     promptwin.style.width = w0 + 'px;'
     promptwin.style.height = h0 + 'px;'
}
function updateded()
{
   var str = "";
   var start = false;
   for (var kk=2; kk >= 0; kk--)
   {
       var tbl = document.getElementById('tbl' + kk);
       for (var j=9; j>=0; j--)
       {
           var y = tbl.rows[j+1].cells[1].getElementsByTagName('input')[0].value;
           if (start == false && y =='0') continue;
           else if (start == false && y != '0') start = true;
           str = tbl.rows[j+1].cells[0].innerHTML + "," + y + ";" + str;
       }
   }
   str = msg1600 + "," + msg1601 + ";" + str;
  
   params[6] = str;
   postopen("checkgrades.jsp", 
        ["course", "sessionname","coursetitle","subdb", "sid", "myscore", "absentdeduct","updateded"], 
        params,
        "_self");
}
var oldonload11 = onload;
onload = function()
{
    if (oldonload11 != null) oldonload11();
    inittime();
}
let oldscores=null;
function drawfig(scores,wd)
{
    oldscores = scores;
    var numRows = scores.length;
    if (wd!=null && typeof(wd)!='number')
        wd = parseInt(wd);
    let w = thispagewidth()-80;
    let h = 500;
    let m = 0;
    for (let k=0; k < numRows; k++)
        if (scores[k] > m){m = scores[k];}
    let mm =0;
    if (wd == null)
    {
        let l = ~~(m/10);
        let z=[1,2,3,5,10];
        let mi=1000;
        for (let j=0; j < z.length; j++)
        {
           let w = (Math.abs(z[j] - l)/l);
           if (w <mi){mi = w;mm=j}
        }
        wd = z[mm];
        if ((m)/wd < 5 && mm>0) 
        {
            wd = z[mm-1];
        }
        if ((m)/wd < 5) 
        {
               wd = 1;
               mm = 0;
        }
        //document.getElementById('selwidth').selectedIndex = mm;
    }
    let fre = new Array();
    let ra = new Array();
    let mh =1;
    let b = 0,a=1000;
    for (let r = 0; r < numRows; r++)
    {
        let wh = Math.floor(scores[r]/wd);
        if (wh > b) b = wh;
        else if (wh < a) a = wh;
        ra[r] = wh;
        if (fre[wh] == null)
            fre[wh] = 1;
        else
        {   
            fre[wh] = fre[wh] + 1;
            if (fre[wh] > mh) mh = fre[wh];
        }
    }
     
    let str = "<table cellspacing=0 cellpadding=0 style=\"margin:5px 4px 5px 4px;border:1px #666666 solid;border-radius:4px\"><tr><td align=bottom width=20><table cellspacing=0><tr height=" + ((mh%5)*h/mh) + "><td> </td></tr>";
    let jj = ~~(mh/5);
    while(jj>0)
    {
        str += "<tr height=" + (5*(h-50)/mh) + "><td valign=top>"+ (jj*5) + "</td></tr>";
        jj--;
    }
    str +="</table></td>";
    let adjust = 1; 
    
    for (let k=a; k <= b; k++)
    {
        let n = fre[k]; if (n == null) n = 0;
        let per = '';
        if (n>0) per = (n*100/numRows).toFixed(0) + '%';
        str += "<td valign=bottom><div style=\"margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;width:" 
                + Math.floor(w/(b-a+1)-adjust) + 'px;height:' 
        + Math.floor((h-50)/mh*n) + 'px;background-color:rgb('
        + Math.floor(Math.random() * 200) + "," + Math.floor(Math.random() * 200) + ","
        + Math.floor(Math.random() * 200) + ");text-align:center;color:#ffffff\" >" + per + "</div></td>"
    }
    str += "</tr><tr height=40><td style=height:20px;color:red  valign=top align=right>" + (a*wd) + "</td>";
    if (w/(b-a+1) > 50)
    {
        for (let k=a; k <= b; k++)
        {
            str += "<td style=\"width:" + Math.floor(w/(b-a+1)-adjust) + "px;height:20px;color:red\" align=right valign=top>"+ (k*wd+wd) +"</td>";
        }
    }
    else
    {
        let k = a;
        for ( k=a; k <= b; k+=2)
        {
            str += "<td style=\"width:" + Math.floor(2*w/(b-a+1)-2*adjust) + "px;height:20px;color:red\" align=right colspan=2 valign=top>"+ ((k+2)*wd) +"</td>";
        }
        if (k == b+1)
            str += "<td></td>";
    }
    str += "</tr></table>";
    let tt = document.getElementById('histogram');
    tt.innerHTML = str;
    
    let tbl = tt.parentNode.parentNode.parentNode;
    if (tbl.tagName.toLowerCase()!='table') tbl = tbl.parentNode;
    if (didhistogram == false) 
    {
        didhistogram = true;
        let tr = tbl.insertRow(tbl.rows.length-1);
        let td = tr.insertCell(-1);
        td.colSpan = "2";
        td.align = 'center';
        td.innerHTML = textmsg[499] + '<select id=selwidth onchange="drawfig(oldscores,this.options[this.selectedIndex].value)">'
        +'<option value="1" '+ (mm==0?'selected':'') + '>1</option> <option value="2" '+ (mm==1?'selected':'') + '>2</option>  <option value="3" '+ (mm==2?'selected':'') + '>3</option>  <option value="5" '+ (mm==3?'selected':'') + '>5</option> <option value="10" '+ (mm==4?'selected':'') + '>10</option></select>';
    }
}
let didhistogram = false;
let extendeddues = null;
let extenttotal = "";
function setlateinfo(str, n, t)
{
    extendeddues = [];
    if (str == '') 
    {
        extenddue(itemnm,rownum);
        return;
    }
    let p = new CSVParse(str.substring(1),'|',':',';');
    let rw = null;
    extenttotal = "<table align=center border=1 style=\"border-collapse:collapse\" ><tr bgcolor=" + BBGCOLOR + "><td>" + textmsg[646] + "</td><td align=right>" + textmsg[1576] + "</td></tr>";
    while ((rw = p.nextRow()) != null)
    {
        extendeddues[rw[0]] = rw[1] ;
        extenttotal += "<tr><td>" + rw[0] + "</td><td align=right>" + rw[2] + "</td></tr>";
    }
   
    extenttotal += "<tr><td >" + textmsg[194] + ":&nbsp;&nbsp;&nbsp;" + n + "</td><td align=right>" + t +"</td></tr><table>"; 
    let nw = ~~((new Date()).getTime()/1000);
    let tbl = document.getElementById('maintbl');
    for (let r = 1; r < tbl.rows.length; r++)
    {
        let nm = tbl.rows[r].cells[0].innerHTML.replace(/<[^>]+>/g,'');
        let newdue = extendeddues[nm];
        if (newdue == null) continue;
        let newtime = Math.round(parseFloat(newdue));
        let wd= tbl.rows[r].cells[3].innerHTML.replace(/<[^>]+>/g,'').replace(/^[ ]+/g,'').replace(/[ ]+$/g,'');
        if (wd.indexOf(missed)>=0)
        { 
            if (newtime > nw )
            {
                tbl.rows[r].cells[3].innerHTML = "<font color=red>" + timestr(newtime) + "</font>";
            }
            else
            {
                tbl.rows[r].cells[3].innerHTML = "<font color=red>" + missed + "!!</font>";
            }
        }
    }
    // extenttotal =   "<table><tr><td><nobr>" +   textmsg[1574] + ":" + n + "</nobr></td><td><nobr>&nbsp;&nbsp;" +  textmsg[944] + ":" + t + "</nobr></td></tr></table>";
    extenddue(itemnm,rownum); 
}
timeformat = timeformat.replace(/ hh:mm/,'') + " hh:mm";
 
var rownum = -1;
var itemnm = '';
var newtimelong = -1
function extenddue(nm,r)
{
    rownum = r;
    itemnm = nm;
    if (extendeddues == null)
    {
        postopen("follows.jsp","x,course,sid,grade".split(/,/), ['latepermit',courseid,sid,1],"w" + tstmp);
    }
    else
    {  let newdue = ~~((new Date()).getTime()/1000) + 48*3600;
       let newduestr = timestr(newdue);
       myprompt(extenttotal + textmsg[1921], newduestr, "goextenddue(v,'" + nm + "')", textmsg[1574] + ": " + nm);
    }
}
function goextenddue(v,nm)
{
    let timelong = parseTime(v);
 
    if (timelong == invalidtimevalue)
    {
        let newdue = ~~((new Date()).getTime()/1000) + 48*3600;
        let newduestr = timestr(newdue);
        myprompt(textmsg[75], newduestr, "goextenddue(v,'" + nm + "')");
    }
    else
    {   
        newtimelong = timelong;
        
        postopen("follows.jsp" ,"subdb,semester,course,sessions,assignname,sid,newdue,x".split(/,/),
                               [subdb,semester,courseid,sessionname,nm,sid,timelong,'extenddue'],"w" + tstmp);
                             
    }
}
function doneextend(f)
{
    let tbl = document.getElementById('maintbl');
    extendeddues[itemnm] = newtimelong;  
    tbl.rows[rownum].cells[3].innerHTML = "<font color=red>" + timestr(newtimelong) + "</font>"; 
}
 

