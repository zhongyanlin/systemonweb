/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
getNumRows = function()
{
    return numstudents;
}
let worst,worst2;
function findlowest()
{
    let ww;
    let i3= 0;
    while (i3 < 10)
    {
       ww = subframe.retrv(i3,1);
       if (ww == null ||  ww == '0')
           break;
       i3++;
    }
    worst2 = subframe.retrv(i3-1,0);
    worst = subframe.retrv(i3,0);
}
function makebut(stra, strb, cl)
{
 return "<tr><td valign=top> <input  type=button  class="
     + cl
     + " <%=style%> value=\""
     + stra
     + "\"></td><td>"
     + strb.replace('"', '\\"')
     + "</td></tr>";
}
function openitme(Z)
{
 var url = 'studentpage.jsp?mode=instructor';
 for (var j=0; j < 5; j++)
 {
 var vv= retrv(Z,j);
 if (vv==null) vv='';
 vv = encodeURIComponent(vv);
  
 url +='&';
 url +=fields[j] +'='+vv;
 }
 url +='&iid=' + iid;
 postopen(url,  '_blank');
}
function historyback()
{
   postopen(thispage.replace(/3/,'2'),'rightwinagg');
}
function modifyded()
{
    var x = (new CSVParse(absentdeduct, '|',',',';')).nextMatrix();
    var k = parseInt(x[x.length-1][0])+1;
    for (var j=x.length; j < 30; j++,k++)
        x[x.length] = [k, 0];
    var str = "<center>"; var kk = 0;
    for (var j=0; j < x.length; j++)
    {
        if (j % 10 == 0)
            str += "<table id=tbl" + (kk++) + " cellspacing=1 border=1 style=\"border-radius:3px;border-collapse:collapse;display:inline-block;margin:3px 3px 3px 3px\" ><tr style=\"font-weight:700;background:linear-gradient(to bottom," + BBGCOLOR +"," + TBGCOLOR + ")\"><td align=right>" + textmsg[542] + "</td><td align=right>" + msg1601 + "</td></tr>";
        str += "<tr  bgcolor=" + TBGCOLOR +"><td align=right style=color:#004400 >" + x[j][0] + "</td><td align=right><input  value=" + x[j][1] + "  style=\"border:0px;text-align:right;color:red\" size=3></td></tr>";
        if (j % 10 == 9)
           str += "</table>"; 
    }
    str += "<br><input type=button class=GreenButton style=width:" + (font_size*4.5) + "px onclick=updateded() value=\""
     + textmsg[66] + "\">";
     str += "<input type=button class=OrangeButton style=width:" + (font_size*4.5) + "px onclick=closeprompt() value=\""
     + textmsg[18] + "\"></center>"; 
     myprompt(str, null,null, msg1600 + " " + msg1601);
     var w0 = document.getElementById('tbl0').offsetWidth * 3 + 16;
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
   postopen("aggregate3.jsp", 
        ["title","subdb","cid", "semester", "sessionname", "absentdeduct", "grouping","updateded"], 
        [title, subdb, cid,semester, sessionname,str,grouping, 1],
        "_self");
}
function twoplace(d)
{
 var x = '' + d;
 return  numberstr(x, '2');
}
function formatline1(str, cl)
{
 
 str = str.replace(/[ ]+$/,''); 
 var j = str.length-1;
 while (j>0 && str.charAt(j)!=' ')j--; 
 var i2  = j;
 while (j>0 && str.charAt(j)==' ')j--;
 while (j>0 && str.charAt(j)!=' ')j--; 
 var i1 = j;
 while (j>0 && str.charAt(j)==' ')j--;
 while (j>0 && str.charAt(j)!=' ')j--; 
 var str1 = "";
 if (cl == BBGCOLOR) 
     str1 = "style=\"font-weight:700;background:linear-gradient(to bottom," + BBGCOLOR +"," + TBGCOLOR + ")\"";
 else
     str1 = "bgcolor=" + cl;
 var str2='';
 if (str.substring(0,j).indexOf(textmsg[583])>=0)
     str2 = ' style=color:blue onclick=modifyded() ';
 return "<tr " + str1 + "><td ><nobr>" + str.substring(0,j) + "</td><td >" + str.substring(j,i1) +
 "</td><td  align=right " + str2 + "><nobr>" + str.substring(i1,i2) +
 "</td><td  align=right><nobr>" + str.substring(i2) +"</td></tr>";
 
}

function formatline2(str, cl)
{
 var tt = str.split("\n");
 var x = "";
 var i=0;
 for (i=0; i < tt.length-2; i++)
 {
    x += formatline1(tt[i], cl);
 }
 return x +  formatline1(tt[i], '#FFFFC0') + formatline1(tt[i+1], '#FFFFC0'); 
}
function showstr(i)
{/*
 if (detailwin != null) detailwin.close();
 var h = mat[i][6].length/(maxlen + 28)*25*font_size/15 + 150; 
 
 if (h> screen.height)h = screen.height;
 detailwin  = window.open("", "details", dim(500,h));
 detailwin.document.getElementsByTagName("body")[0].innerHTML = "";
 detailwin.document.writeln("<html><meta http-equiv=\"Content-Type\" content=\"text/html; charset=" + encoding + "\"><head>");
 detailwin.document.writeln(unifontstyle(font_size));
 detailwin.document.writeln('<link rel=stylesheet  type=text/css  href=styleb' + orgnum + '.css />');
 detailwin.document.writeln("</head><body >");
 detailwin.document.writeln(unititle(title + "<br>"+textmsg[41],'outset2'));
 */
 var j =  mat[i][6].indexOf("\n");
 var ll = mat[i][6].length;
 myprompt("<center><font  color=purple><b>" + mat[i][6].substring(0, j)
 + "</b></font></center><table width=100% align=center cellpadding=3 cellspacing=1 border=0 class=outset1 >" + formatline1(headerline,BBGCOLOR)
 + formatline2(mat[i][6].substring(j+1),TBGCOLOR) 
 //+ "<tr><td colspan=4 align=right style=font-weight:700 >" + retrv(i,5)  +"&nbsp;&nbsp;&nbsp;</td></tr>"
 + '</table>\n',null,null,textmsg[31]);
 
}
 
function passinfo(thresh)
{
 var ids = "";
 for (var  i = 0; i < NUMROWS; i++)
 if (parseFloat(mat[i][4]) < thresh)
 ids +=mat[i][0]  + "\n";
 return ids;
}
function myalert()
{
    var url = "alert.jsp?CourseIDEvaluating=" + coursecid.replace(/ /g, "%20") + "&CourseTitleEvaluting=" + title.replace(/ /g,"%20");
    myprompt("<iframe frameborder=0 width=550 height=400 src=\"" + url + "\">", null, null, msg317);
}

function studentinfo(sid)
{
 var str  = "student.jsp?MoreDetail=no&submit=ToUpdate&sid=" + sid;
 var popstr = 'titlebar=0,toolbar=0,location=0,directories=0,status=0,menubar=0,alwaysRaised=1,scrollbars=1,resizable=1,width= 450,height= 580';
 postopen(str, '_blank');
}

function pad(x, n)
{
 var l = x.length;
 if (l > n)
 return x.substring(0,n);
 var y = '';
 for (var i = 0; i < n ; i++) 
 y += ' ';
 return y + x;
}

var detailwin = null;
function showDetail()
{
 if (detailwin != null) detailwin.close();
 var h =   150;
 var i = 0;
 for (; i < NUMROWS; i++)
 h += mat[i][6].length/(maxlen + 28)*25*font_size/15 + 35;
 
 if (h> screen.height)h = screen.height;
 detailwin  = window.open("", "details", dim(500,h));
 detailwin.document.getElementsByTagName("body")[0].innerHTML = ""; 
 detailwin.document.writeln("<html><meta http-equiv=\"Content-Type\" content=\"text/html; charset=" + encoding + "\"><head>");
 detailwin.document.writeln('<link rel=stylesheet  type=text/css  href=styleb' + (orgnum%65536) + '.css />');
 detailwin.document.writeln(unifontstyle(font_size));
 detailwin.document.writeln("</head><body >");
 detailwin.document.writeln(unititle(title + "<br>"+textmsg[41],"outset2"));
 for (i = 0; i < NUMROWS; i++) 
 {
 var j =  mat[i][6].indexOf("\n");
 var ll = mat[i][6].length;
 detailwin.document.write("<br><center><font   color=purple><b>" + mat[i][6].substring(0, j) 
 + "</b></font><TABLE cellpadding=3 cellspacing=1 class=outset1 width=350>" 
 + formatline1(headerline,BBGCOLOR)
 + formatline2(mat[i][6].substring(j+1),  TBGCOLOR) 
// + "<tr><td colspan=4 align=right style=font-weight:700 >" + retrv(i,5)  +"&nbsp;&nbsp&nbsp;</td></tr>"
+"</table>");
 } 
 
 detailwin.document.writeln("<script>function modifyded(){opener.modifyded();close();}</scrip" + "t></body></html>");
}
var reportwin = null;
var whichfield = 0;
function report1(i){whichfield=i; if (reportwin != null) reportwin.close(); }
function redo(){ if (whichfield !=0) report(whichfield);}

 
function report(i)
{
 if (i==0)
 {
     var kk = (gradesystem == 1)? 4: 5;
     let s = textmsg[816] +  ':&nbsp;&nbsp;&nbsp;<input type=checkbox id=choice1 value=' +kk + ' checked>' + labels[kk]  +  '&nbsp;&nbsp;&nbsp;&nbsp;<input  id=choice2 type=checkbox value=' + (kk-1) + '>' + labels[kk-1];
     s += '<br><br><input type=button name=subgrade class=OrangeButton ' + butstyle(font_size) + ' value="'+textmsg[66]+'" onclick=report(2)>'
       + '<input type=button name=subgrade class=OrangeButton ' + butstyle(font_size) + ' value="'+textmsg[18]+'" onclick=closeprompt()>';
     let t  = myprompt('<center>' + s + '</center>',null,null,null);
     return;
 }
 else if (i==2)
 {
     i = 0;
     let c = document.getElementById('choice1');
     let c2 = document.getElementById('choice2');
     if (c.checked)
     i = parseInt(c.value);
     if (c2.checked)
     i +=  10*parseInt(c2.value);
     if (i == 0) closeprompt();
     report(i);
     return;
 }
 whichfield = 0;
 if (reportwin != null) reportwin.close(); 
 //if (i==0) { sort(2); }
 //else sort(i);
 //sort(1);

 var h = 250 + NUMROWS*25*font_size/15;
 

 var a = [];
 var maxl = 0,  maxi = 0, maxf = 0;
 for ( var j = 0; j < NUMROWS; j++)
 {
 if (j==0 ||   mat[j][1] != mat[j-1][1])
 { 
 if (j!=0) a[a.length] = ("</table> <br><br>");
 var gradestr = textmsg[29];
 if (gradesystem == 1) gradestr = textmsg[492];
 a[a.length] = ( "<table border=0 width=100% > <tr><td width=25% ></td> <td  align=left><b><nobr>"+textmsg[42]+":</nobr></b></td><td> " + coursecid + '-' + mat[j][1] +" </td><td width=25% ></td>  </tr>");
 a[a.length] = ("<tr> <td width=25% ></td> <td colspan=1 align=left> <b><nobr>"+textmsg[35]+":</nobr></b></td><td> <nobr> " + instructorName +"</nobr> </td> <td></td></tr> <tr><td></td> <td><b>"+textmsg[36]+":</b> </td><td style=white-space:nowrap>"+timestr(tim)+"</td><td></td> </tr>  ");
 a[a.length] = ("</table><table cellpadding=3 cellspacing=1 class=outset1 width=100%><tr bgcolor=" + BBGCOLOR +"><td><b><div onclick=opener.report1(0)>"+textmsg[37]+"</div></td> <td><b><div onclick=opener.report1(2)>"+textmsg[38]+"</div></b></td> <td><b><div onclick=opener.report1(2)>"+textmsg[39]+"</div></b></td> <td align=center><b><div onclick=opener.report1(5)>"+ gradestr+"</div></b></td>"+ (i<10?'':("<td align=right><b><div onclick=opener.report1(5)>%</div></b></td>")) + "</tr>\n");
 }
 var kk = (gradesystem == 1)? 4: 5;
 a[a.length] = ("<tr bgcolor=" + TBGCOLOR +"><td>"+ mat[j][0] + "</td><td>" + mat[j][2] + "</td><td>"+ mat[j][3] + "</td><td align=right>" + mat[j][kk] + "</td>" + (i<10?'':("<td align=right>" + mat[j][kk-1] + "</td>")) + "</tr>");
 }
 
 a[a.length] = ('</table>');
 a[a.length] = ('<center><br>'+ selectReport + '<input type=button name=subgrade class=OrangeButton ' + butstyle(font_size) + ' value="'+textmsg[61]+'" onclick=subgrade()>'
         +'<input type=button name=subgrade class=OrangeButton ' + butstyle(font_size) + ' value="'+textmsg[409]+'" onclick=printing()>');
 myprompt(a.join(''),null,null,textmsg[34]);
}

var subframe = self.frames[0];

function updateGrades(n)
{ 

 if (gradesystem == 1)
 {
     postopen('DataUpdate',['rdap','course','semester','subdb'],['gradesystem',course,semester,userid],popwin);
     //window.open('DataUpdate?rdap=gradesystem&course=' + escape(course) +'&semester=' + escape(semester) +"&subdb=" + userid, popwin,popstr);
 } 
 else
 {
 var tt = subframe.passoverNUMROWS();

 subframe.setNUMROWS(numGrades);
 subframe.setaction(n); 
 subframe.setNUMROWS(tt);
 }
}

function saveGrades(n)
{
 if (n==1)
 {
  
 setaction(1);
  updateGrades(1) ;
 }
 else if (n==3)
 {
 updateGrades(3);
 }
}

var whom = '';
var selhandle = null;
function selectwhom(sel)
{
 selhandle = sel;
 if (sel.selectedIndex>=0)
 whom = sel.options[sel.selectedIndex].value;
}
function subgrade()
{
 myprompt(textmsg[850],null,"gosubgrade(v)");
 reportwin.close();
}

function gosubgrade(v)
{
 if (!v) return;
 var tmpsubdb = document.thisform.subdb.value;
 if (tmpsubdb == "")
 {
 return;
 }
 document.thisform.subdb.value = "";
 for (var i = 0; i < numRows; i++) 
 valuechanged[i] = true;
 setaction(1);
 
 document.thisform.subdb.value = tmpsubdb;
}

function init(numGrades)
{
 var  i, j;
 var gts = null;
 if (gradesystem == 2 && numGrades < 3)
 {
 gts = new Array(3); 
 gts[0] = new Array('A','B','C','D','F');
 gts[1] = new Array('90','80','70','60','0');
 gts[2] = new Array('4','3','2','1','0');
 for (i = 0; i < 5; i++) 
 for (j = 0; j < 3; j++)
 subframe.setCell(i,j,gts[j][i]);
 return 5;
 } 
 if (gradesystem == 3 && numGrades < 7)
 {
 gts = new Array(3); 
 gts[0] = new Array('A+', 'A', 'A-','B+', 'B','B-','C+', 'C','C-','D+', 'D','D-','F');
 gts[1] = new Array('100','90','87','84','80','77','74','70','67','64','60','57','0');
 gts[2] = new Array('13','12', '11','10', '9', '8','7',  '6','5', '4',  '3','2', '0');
 for (i = 0; i < 13; i++) 
 for (j = 0; j < 3; j++)
 subframe.setCell(i,j,gts[j][i]);
 return 13;
 }
 return numGrades; 
} 
var maxscore = 0;
var stddiv = 0;
function findmax()
{
 var tt;
 var totalsum = 0;
 var NN = 0;
 var totalgrade = 0;
 var s = 0;
 for (s = 0; s < NUMROWS; s++)
 { 
 tt = parseFloat(mat[s][4]);
 totalsum += tt;
 if (maxscore < tt) maxscore = tt;
 if ( mat[s][5] !='')
 setCell(s,5,mat[s][5]);
 else 
 {
 tt = Math.round(mat[s][4]);
 setCell(s,5, tt);
 mat[s][5] = tt;
 totalgrade += tt;
 NN++;
 }
 }
 var avs = totalsum/NUMROWS;
 
 document.form1.As.value =  twoplace(avs);
 if (NN>0)
 document.form1.Avg.value =  twoplace(totalgrade/NN);
 totalsum = 0;
 for (s = 0; s < NUMROWS; s++)
 { 
 tt = parseFloat(mat[s][4]);
 stddiv  += (tt-avs)*(tt-avs);
 }
 if (NUMROWS>0) stddiv  /= NUMROWS; else stddiv = 0;
 stddiv = Math.sqrt(stddiv);
}
var numGrades = 1;
 
function fill()
{ 
    maxscore = 0;
    numGrades = subframe.passoverNUMROWS();
    var i = 0;
    var gradecounter = new Array(numGrades);
    for (i = 0; i <= numGrades; i++)
        gradecounter[i] = 0;

    i = 0;
    for (; i < numGrades; i++)
    {
        if (subframe.retrv(i, 0) == ''
                || subframe.retrv(i, 0) == textmsg[43]
                || subframe.retrv(i, 1) == ''
                || subframe.retrv(i, 2) == '')
            break;
    }

    numGrades = init(i);
    var ni, ni1;
    i = 0;
    while (i < numGrades)
    {
        ni = parseFloat(subframe.passover(i, 1));
        if ('' + ni == 'NaN') {
            numGrades = i;
            break;
        }
        ni1 = parseFloat(subframe.passover(i + 1, 1));
        if ('' + ni1 == 'NaN') {
            numGrades = i + 1;
            break;
        }
        if (ni < ni1)
        {
            myprompt(textmsg[44] + subframe.passover(i, 0));
            return;
        }
        i++;
    }


    i = 0;
    while (i < numGrades)
    {
        ni = parseFloat(subframe.passover(i, 2));
        if ('' + ni == 'NaN') {
            numGrades = i;
            break;
        }
        ni1 = parseFloat(subframe.passover(i + 1, 2));
        if ('' + ni1 == 'NaN') {
            numGrades = i + 1;
            break;
        }
        if (ni < ni1)
        {
            myprompt(textmsg[45] + subframe.passover(i, 0));
            return;
        }
        i++;
    }

    var totalsum = 0;
    var totalscore = 0;
    var totalnum = 0;
    
    
    
    for (var s = 0; s < NUMROWS; s++)
    {
        var j = 0;

        if (mat[s][5] != '')
        {
            for (; j < numGrades && mat[s][5] != subframe.passover(j, 0); j++)
                ;
        }

        if (j != numGrades)
        {
            for (j = 0; j < numGrades && parseFloat(mat[s][4]) < parseFloat(subframe.passover(j, 1)); j++)
                ;
            gradecounter[j]++;

            mat[s][5] = subframe.passover(j, 0);
            valuechanged[s] = (mat[s][5] != retrv(s, 5));

            totalsum += parseFloat(subframe.passover(j, 2));
            totalnum++;
        }

        setCell(s, 5, mat[s][5]);
        
        valuechanged[s] = true;
        var tt = parseFloat(mat[s][4]);
        if ('' + tt != 'NaN')
        {
            if (maxscore < tt)
                maxscore = tt;
            totalscore += tt;
        }
    }
    gradecounter[numGrades] = NUMROWS - totalnum;
    var tmpi = 0;
    for (i = 0; i < numGrades; i++)
    {
        tmpi = subframe.getvaluechanged(i);
        subframe.setCell(i, 3, gradecounter[i]);
        if (NUMROWS > 0)
            subframe.setCell(i, 4, twoplace(gradecounter[i] * 100 / (NUMROWS + 0.0)));

        subframe.setvaluechanged(i, tmpi);
    }
    i = subframe.passoverNUMROWS() - 1;
    subframe.setCell(i, 0, textmsg[43]);
    tmpi = subframe.getvaluechanged(i);
    subframe.setCell(i, 3, gradecounter[numGrades]);
    if (NUMROWS > 0)
        subframe.setCell(i, 4, twoplace(gradecounter[numGrades] * 100 / (NUMROWS + 0.0)));
    subframe.setvaluechanged(i, tmpi);
    if (totalnum > 0)
        totalsum /= totalnum;
    if (NUMROWS > 0)
    {
        totalscore /= (NUMROWS + 0.0);
        document.form1.As.value = twoplace(totalscore);
        document.form1.Avg.value = twoplace(totalsum);
    }
    coloring();
}
function makev(mx)
{
    var str = "";// "<table bgcolor=#ffffff cellspacing=0 cellpadding=0 border=0 style=border-collapse:collapse >";
    var rate = 300.0/mx;
    str = "<tr height=" + Math.round(5*rate-10) + "><td><div style=height:" + Math.round(5*rate-10) + "px;width:20px><!-- --></div></td></tr>\n";
    var y = "<tr height=20><td align=right valign=middle><div style=height:20px;line-height:20px;width:30px;text-align:right;vertical-align:middle;>N</div></td></tr>\n";
    var i = 1;
    var m = Math.round(5*rate-10);
    while (true)
    {
       
        m += Math.round(5*rate);
        if (m > 300) break;
        str =  "<tr  height=" + Math.round(5*rate-20) + "><td><div style=height:" + Math.round(5*rate-20) + "px;width:20px><!-- --></div></td></tr>\n" + y.replace(/N/, ''+ (i*5)) + str;
        i++;
         
    }
    return str.replace(/<.td>/,'</td><td valign=bottom rowspan=' + (i + 1) + "><div style=height:300px;width:1px;background-color:black ><!-- --></div></td>" );
}
function drawfig()
{
  
 var histogram = new Array(101);
 for (var i=0; i < numRows; i++)
 {
     var j  = Math.round(parseFloat(mat[i][4]));
     if (histogram[j] == null) histogram[j] = 1;
     else histogram[j]++;
 } 
 var mx = 10;
 for (var i=0; i < 101; i++)
 {
     if (histogram[j]==null) histogram[j] = 0;
     else if (histogram[j] > mx) mx = histogram[j];
 }
 var str = "<table bgcolor=#ffffff cellspacing=0 cellpadding=0 border=0 style=border-collapse:collapse ><tr><td width=32 colspan=2 vliang=bottom><table border=0 cellspacing=0 cellpadding=0 border=0 >" 
         + makev(mx) + "</table></td>";
 
 var rate = 300.0/mx;
 for (var i=0; i < 101; i++)
 {
     str += "<td valign=bottom><div style=\"background-color:red;width:6px;height:" + Math.round(histogram[i]*rate) + "px\" ><!----></div></td>";
 }
 str += "</td><td colspan=2 width=15 ></td></tr><tr height=1 bgcolor=black><td colspan=104 ><!-- --></td></tr><tr>"
 for (var i=0; i <= 20; i++)
 {
    str += "<td style=\"font-size:15px;width:30px\" align=center colspan=5 >" + (5*i) + "</td>"
 }
 str += "</td></tr></table>";
 document.getElementById('subtd').innerHTML = str;
}

 
function endload(ht)
{
 if (gradesystem == 1)
 {
 findmax();
 drawfig();
 //helpstr += "<br><b><font color=purple>"+textmsg[48]+"</font></b><br>"+textmsg[49];
 }
 else
 {

 fill();
 
 var extrastr = self.frames[0].helpstr;

 var j, i = extrastr.indexOf("<b><font color=purple>"+textmsg[50]);
 if (i>=0)
 {
 j = extrastr.indexOf("\n",i); 
 if (j>0) 
 extrastr = extrastr.substring(0,i) + extrastr.substring(j);
 else
 extrastr = extrastr.substring(0,i);
 }
 
 /* i = extrastr.indexOf("<b><font color=purple>"+textmsg[248]);
 if (i>=0)
 { 
 j = extrastr.indexOf("<br>",i); 
 if (j>0) 
 extrastr = extrastr.substring(0,i) + extrastr.substring(j);
 else
 extrastr = extrastr.substring(0,i);
 }*/
 if (ht < 20 )
 { 
 if (document.getElementsByTagName("iframe")[0].document && document.body.scrollHeight)
 ht = document.getElementsByTagName("iframe")[0].document.body.scrollHeight ;
 else 
 ht = 200;
 }
 document.getElementsByTagName("iframe")[0].height = ht + 10;
 helpstr  =  "";// "<b><font color=purple>"+textmsg[50]+"</font></b><br>" + extrastr;
 }
 for (i=0; i < numRows; i++)
 {
 valuechanged[i] = true;
 ele(i,7).value = ">>";
 }
 helpstr = "<br><br><b><font color=purple>"+textmsg[51]+"</font></b><br><table>"+ help0 + "</table>";
 
}

var oldsort = sort;
sort = function(j)
{
    oldsort(j);
    var numstudents = getNumRows();
    for (var Z=0; Z < numstudents; Z++)
    {
        var btn = formselementbyname(document.form1,Z + '_7');
        if (btn.value == '') 
            btn.value = ">>";
    }
     
}
function changesystem()
{
 stt = stt.replace(/[0-9]$/,''+document.thisform.gradesystem1.selectedIndex);
 document.location.href = stt;
}

if (gradesystem==1) 
    endload(0);
resizebut(document.thisform,font_size);
function disablefuncbut(b)
{
 document.thisform.savebtn.disabled = b;
}

function passover(r,c)
{
 return retrv(r,c);
}
function fillcolsels(j)
{

}
function fillallsels()
{
 for (var j = 0; j < numCols; j++)
 fillcolsels(j);
}

function updatepic(tmp,n,jj)
{

}

function showbuthint(but,e,j)
{
 if (typeof showmyhint=='function')
 showmyhint(j);
}

function coloring()
{
    for (let s = 0; s < NUMROWS; s++)
    {
        let e = formselementbyname(document.form1, s + '_5');
        if (e.value == worst2) 
            e.style.cssText = 'color:orange !important';
        else if (e.value == worst) 
            e.style.cssText = 'color:red !important';
        else e.style.cssText = 'color:black !important';
    }
}
 
var oldonload15 = window.onload;
window.onload = function()
{
    findlowest();
    oldonload15();
    coloring();
};






 
 
 


 
