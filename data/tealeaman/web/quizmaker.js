
/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
closeprompt(); 
 
var submited = false;
var nn = 0; 
var numbers = serial.split(",");
var norepeat =  parseInt(numbers[0]);
var openbook =  parseInt(numbers[1]);
var total =     parseInt(numbers[2]);
var timestart = parseInt(numbers[3]);
var timedue =   parseInt(numbers[4]);
var timenow = (new Date()).getTime();
var last2server = timenow; 
timedue -= timedif;
if (typeof(timelastsec)!='undefined' && timelastsec >=0)
{
 var t2 = timestart + timelastsec;
 if (timedue > t2) timedue = t2;
}
 
var intervalhandle = null;
var totalstay = 0;
var confirmit = true;
var leavelong = null;
var f1 = document.form1;
 
var leasele = null;
 
var savedQuizName = (orgnum%65536) + '-' + f1.semester.value + '-' +   f1.course.value + "-" + f1.assignname.value + '-' + f1.sid.value;
 
var numultple = parseInt(f1.noanswer.value.substring(f1.noanswer.value.lastIndexOf('@')+1));
 
var cont = null;
var foucsarr = new Array(total + 4);

var timeonstart = timenow; 
var functioncallstring = "";
var grades = new Array();
var answers = new Array();
var runresult = new Array();
var fmts = new Array();
var spents = new Array();
var shuffles = new Array();
var whichside = 'left';
var hints = new Array();
var questionanswers = {};
resumehalted=function()
{
   if (whichside == 'right')
   {
       parent.frames[1].resumehalted();
       whichside = 'left';
       return;
   }
   expiretime = activeidletime + (new Date()).getTime();
   eval(functioncallstring);
}
var allinimages = false;
var ifsynanswers = false;
function synanswers(bb)
{
    ifsynanswers = bb; 
}
function showanswers(a)
{
    if (a==1)
    {
        answers = detailass.answqrr;
        sofar = '';
        saved();
    }
    else if (a==2)
    {
        answers = [];
        saved();
    }
    else
    {
        for (let ee of document.form1.elements)
        {
            if (ee.name.charAt(0)=='q'){
            if (ee.tagName.toLowerCase() == 'input')
            {
                  if ( ee.type.toLowerCase() == 'radio')
                      ee.checked = false;   
                  else
                      ee.value = '';
            } 
            else if (ee.tagName.toLowerCase() == 'textarea') 
            {
                ee.value = '';
            }}
        }
    }
}

function allimages(ck)
{
   allinimages = ck.checked; 
}


function setact(n)
{
    if (needtestformat) 
    {
        previewass(1);
        return;
    }
        
    var rightnow = (new Date()).getTime();
    expiretime = activeidletime + rightnow;
    if (expiretime < rightnow)
    {
       
    }
    
    var noanswer = "";
    var ck = new Array(detailass.maxorder + 1);
    for (i = 0; i <= detailass.maxorder; i++)
        ck[i] = 0;
    var len = f1.elements.length;
    var i = 0;

    for (; i < len; i++)
    {
        var x = f1.elements[i];
        var nn = x.name;

        if (nn.indexOf('q') == 0 && nn.indexOf('_') < 0 && isNaN(nn.substring(1)) == false)
        {
            var jj = parseInt(nn.substring(1));
            if (jj > detailass.maxorder)
                continue;
            if (ck[jj] == 0)
                ck[jj] = 2;
            if (x.tagName.toLowerCase() == 'input' && x.type.toLowerCase() == 'radio' && x.checked)
            {
                ck[jj] = 1;
            }
            else if (x.tagName.toLowerCase() == 'textarea')
            {
                if (fmts[jj] == null)
                    fmts[jj] = guessFormat(x.value);
                checkHTML(x);
                  
                if (x.value.replace(/ /g, '') != '')
                    ck[jj] = 1;

            }
            else if (x.tagName.toLowerCase() == 'input' && x.type.toLowerCase() == 'hidden')
            {
                if (fmts[jj] == null)
                    fmts[jj] = guessFormat(x.value);
                checkHTML(x);

                if (x.value != '')
                    ck[jj] = 1;
            }

        }
    }

    for (jj = 0; jj < detailass.maxorder + 1; jj++)
    {

        if (ck[jj] == 2  )
            noanswer += detailass.mapnm2or[jj] + ", ";
    }
    var errorquestion = '';
    for (jj = 0; jj < detailass.maxorder + 1; jj++)
    {
        if ( syntaxerrors[jj]!=null && syntaxerrors[jj]==true)
           errorquestion += detailass.mapnm2or[jj] + ", ";
    }
    if (confirmit && (errorquestion!='' || noanswer != ""))
    {
        if (noanswer!='')
        {    
            var xx = textmsg[200] + noanswer.replace(/, $/, ". ") + textmsg[201];

            if (noanswer.replace(/[^,]/g,'').length == detailass.maxorder
                && f1.attach.value != '')
            {
                xx = textmsg[1862];
                allinimages = true;
            }
            if (allinimages == false && f1.attach.value != '')
            {
                xx += "<br><input type=checkbox onclick=allimages(this)>" + textmsg[1863];
            }
         }
        if (errorquestion!='')
        {
             xx += "<br>Syntax error: " + errorquestion;
        }
        myprompt(xx, null, "if(v)dofinalact()", textmsg[222]);
        var xy = findPositionnoScrolling(f1.submit1);
        xy[1] = xy[1] - promptwin.offsetHeight + f1.submit1.offsetHeight;
        if (xy[1] < 100)
            xy[1] = 100;
        promptwin.style.top = xy[1] + 'px';
    }
    else
    {
        if (detailass.freef == null)
          dofinalact(0);
        else
        {
            composecsv(1);
            var content = sofar.replace(new RegExp("\\[" + textmsg[1303] + "([0-9]+)","ig"),"[Imagelet$1");
            var wcds = "i'"+content+ "','" + fmts[1];
            wcds += "','" + f1.attach.value;  
            wcds += "','" + ' ';
            wcds += "','" + f1.course.value;
            wcds += "','" + f1.assignname.value;
            wcds += "','" + f1.semester.value;
            wcds += "','" + f1.sessionname.value;
            wcds += "','" + content.replace(/'/g,"''");
            wcds += "','" + fmts[1];
            wcds +="','" + f1.attach.value;
            wcds +="','" + ' '; 
            wcds +="','" + f1.course.value;
            wcds += "','" + f1.assignname.value;
            wcds += "','" + f1.semester.value;
            wcds += "'";
            if (f1.leas.value == '') f1.leas.value = '0'
            let u = "subdb,semester,sid,course,sessionname,assignname,content,leas,attach"; 
            let v = [f1.subdb.value,f1.semester.value,f1.sid.value,f1.course.value,f1.sessionname.value,f1.assignname.value,content,f1.leas.value,f1.attach.value];
            if (runresult[1]!=null) { u += ",assess"; v.push(runresult[1]);}
            postopen('gradeQuiz.jsp',u.split(/,/), v,  '_self');
             
        }
    }
}
function testformat()
{
    
    let str = textmsg[1936].replace(/[^@]+@/,'').replace(/@/,' ') + '<table width=100% cellspacing=1 style=\"border-radius:3px;border:1px #888 solid\" cellpadding=5>';
    for (let j=1; j < answers.length; j++)
    {
        if (fmts[j] == null) 
           fmts[j] = guessFormat(answers[j]);
        str += '<tr><td valign=top align=left width=0% >' + j + '.</td><td width=100%><div  style="font-family:var(--fontname) !important">' + (answers[j]==null?textmsg[1865]:(((fmts[j] +''=='2'||fmts[j] +''=='1')&&detailass.questarr[j].includes('___'))?answers[j].replace(/\n/g,'<br>'):answers[j])) + '</div></td></tr>';
    }
        str += '</table>' + textmsg[1936].replace(/[^@]+@/,'').replace(/@.*/,'');
    myprompt(str, null,'if(v)dofinalact()','Tex' );
    LaTexHTML.formatele(promptwin); 
}
function disable0(b)
{
   var x;
   for (var j=0; j < f1.elements.length; j++)
   {
       var nm = f1.elements[j].name;
       if (nm.replace(/q[_|0-9]+/,'') == '' )
           f1.elements[j].disabled = b;
   }
}
function dofinalact()
{
 composecsv(1);
 if (sofar == '') 
 {
     if (isembedquiz )
       return;
 }
 disable0(true);
 //delcac();
 formnewaction(f1,"gradeQuiz.jsp");
 f1.target = '_self';
 
 submited = true;
 window.onbeforeunload = null;
 ponf();
 f1.leas.value=accum;
 f1.Content.value = sofar.replace(new RegExp("\\[" + textmsg[1303] + "([0-9]+)","ig"),"[Imagelet$1");
 visual(f1);
 f1.activities.value = activities;
 activities = '';
 expiretime = activeidletime + (new Date()).getTime(); 
 if (allinimages) {f1.format.value = '6'; }
 submitbyajax(f1);
 var ln = makeline();
 var iid = f1.subdb.value;
 parent.frames[1].backupbyajax1(iid,ln,savedQuizName);

 return true;
}

function makeline()
{
    //time,'sid','semester','course','assignname','content','backup',-1,time,format,'attach','assess'
    let subm = ~~((new Date()).getTime()/1000);
    return subm + ",'" + f1.sid.value + "','" + f1.semester.value + "','" + f1.course.value + "','" + f1.assignname.value + "','" + f1.Content.value.replace(/'/g,"''") 
     + "','" + f1.leas.value.replace(/'/g,"''") + "',-1," + subm + ",'" + f1.format.value + "','" + f1.attach.value + "',''";
}
function extentdue(x){timedue = x;}
var doned2h = false, doneh2m = false, donem2s = false;
function extenddue(newdue, realtimenow)
{
    var timenow1 = (new Date()).getTime();
    numbers[4] = newdue;
    var timedif1 = realtimenow - Math.round(timenow1/1000);
    
    timedue = newdue - timedif1;
    doned2h = doneh2m = donem2s = false;
}
function anyextend()
{
    formnewaction(f1,"gradeQuiz.jsp");
    f1.target = 'w' + tstmp;
    f1.Content.value = '?';
    visual(f1);
    expiretime = activeidletime + (new Date()).getTime();  
    f1.submit();
}

function nodisplay(j, f)
{
    LaTexHTML.deformat(document.getElementById("showarea" + j));
    fmts[j]= 0 ;
    document.getElementById("showarea" + j).innerHTML = 
      "<img width=24px style=\"border:1px #b0b0b0 outset\"  name=notfmt" + j + " src=\"image/swap.jpg\"  onclick=\"displayit(" + j + "," + f +")\">" + formatstr(tabeingedited.value,'0'); 
}
function saveback1()
{
    ifsynanswers = true;
    stringify();
    ifsynanswers = false;
}
function saveback()
{
    if (ifsynanswers)
    {
        myprompt(textmsg[1935].split(/@/)[5]);
    }
    else previewass(2);
}

function previewass(ask)
{
    if (parent.frames.length> 1 && !parent.frames[1].document.location.toString().includes("quizhelp.jsp"))
    {    
         openedfileinframe1 = false;
         showraw();
    }
     if (ask == null) {ask=0;}
    var hed = '';
    if (ask==1)hed = textmsg[1936].replace(/[^@]+@/,'').replace(/@/,' ');
    else if (ask==2) hed = textmsg[1935].split(/@/)[4];
   
    var x = hed + '<table class="outset3" style="margin:4px 4px 4px 4px;background-color:lightyellow" ><tr><td><table border=0 cellspacing="1" cellpadding="4" width=' + (thispagewidth()-50) + '>';
    let nn = 0;
    for (let a of answers) if (a!=null) nn ++; 
     
    let nnn = 0;
    for (var ii=1;  ;ii++)
    {
        
        var j = detailass.mapor2nm[ii];  
        if (j==null) break; 
        var ss = answers[j];
        if (ss==null) ss = '';
        else {nnn++; }
        if (fmts[j] == null)
             fmts[j] = guessFormat(ss);
        if ( (fmts[j] +''=='2'||fmts[j] +''=='1')&& detailass.questarr[j].includes('___'))
        {
            ss = ss.replace(/\n/g,'<br>');
        }
        ss = formatstr(ss,fmts[j]);
        ss = ss.replace(new RegExp('\\[' + textmsg[1303],"g"),"[Imagelet");
        if (ss.indexOf('[Imagelet') >=0)
        {
            var attstr = ResizeUploaded.unzip(ResizeUploaded.attachref.value).replace(/,([0-9]+)@/g, ',100$1@' );
            var hw = new Hwtake('rev','','', attstr, '',fmts[j]);
            addcss2head(0,hw.divs,'1');
            ss = hw.merge(ss);
            ss = ss.replace(/imagelet([0-9]+)/g, 'imagelet100$1');//.replace(/imagelet([0-9]+)/g, 'imagelet100$1');
        }
        x += "<tr><td valign=top align=right bgcolor=white width=45 style=border-radius:3px ><b>" + ii + "</b>.</td><td style=border-radius:3px  bgcolor=white >" + addbreak1(ss) + "</td></tr>";
        if (nnn==nn) break;
    }
    x += "</table></td></tr></table>";
    if (ask == 1) 
    {
        x += textmsg[1936].replace(/[^@]+@/,'').replace(/@.*/,'');
         myprompt(x, null,'if(v){LaTexHTML.deformat(promptwin);needtestformat=false;setact(0);}else{LaTexHTML.deformat(promptwin)}',textmsg[408]);
    }
    else if (ask == 2) 
    {
        x += textmsg[1935].split(/@/)[4];
         myprompt(x, null,'if(v){LaTexHTML.deformat(promptwin);saveback1();}else{LaTexHTML.deformat(promptwin)}',textmsg[408]);
    }
    else
         myprompt(x, null,null,textmsg[408]);
     LaTexHTML.formatele(promptwin); 
     promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].onclick = function()
     {
        LaTexHTML.deformat(promptwin); 
        closeprompt();
     };
     var xy = findPositionnoScrolling(f1.submit0);
     var y = xy[1] - promptwin.offsetHeight-10;
     var x = 0;
     promptwin.style.left = '1px';
     promptwin.style.top = y + 'px';
}
function displayit(j, fmt, ss, doit)
{
     fmts[j] =  parseInt(''+  fmt );
     if (ss==null)
         ss = tabeingedited.value;
     answers[j]=ss; 
     ss = addbreak(ss,"1");
     LaTexHTML.deformat(document.getElementById("showarea" + j));
     if (doit!=null || fmt!= 0 || ss.indexOf('[Imagelet') >=0  || ss.indexOf('[' + textmsg[1303]) >=0 || ss.indexOf('\t') >=0 )
     {
         ss = formatstr(ss,fmt);
         ss = ss.replace(new RegExp('\\[' + textmsg[1303],"g"),"[Imagelet");
         let hasimage = false;
         if (  ss.indexOf('[Imagelet') >=0)
         {
            hasimage = true;
            var attstr = ResizeUploaded.unzip(ResizeUploaded.attachref.value).replace(/,([0-9]+)@/g, ',100$1@' );
            var hw = new Hwtake('rev','','', attstr, '',fmt);
            addcss2head(0,hw.divs,'1');
            ss = hw.merge(ss);
            ss = ss.replace(/imagelet([0-9]+)/g, 'imagelet100$1');//.replace(/imagelet([0-9]+)/g, 'imagelet100$1');
          }
         if (''+fmt!='0' || hasimage)
         {
             if(''+fmt == '5') gradingprogrammingurl = 'gradepython.jsp';
             if(''+fmt == '4') gradingprogrammingurl = 'gradejava.jsp';
         var fmtops   = "<option value=0 " + ( fmt=='0'? 'selected':'') + ">" + textmsg[83] + "</option>"
                           + "<option value=1 " + ( fmt =='1'? 'selected':'') + ">HTML</option>"
                           + "<option value=2 " + ( fmt =='2'? 'selected':'') + ">LaTex</option>"
                           + "<option value=3 " + ( fmt =='3'? 'selected':'') + ">" + textmsg[1847] + "</option>"
                           + "<option value=4 " + ( fmt =='4'? 'selected':'') + ">Java</option>"
                           + "<option value=5 " + ( fmt =='5'? 'selected':'') + ">Python</option>"
                           + "<option value=6  >" + textmsg[69] + "Tab</option>";
         fmtops =   "<select name=fmtbox style=float:right onchange=\"displayit1("+ j + ",this)\"   style=background-color:white;width:60px >" + fmtops + "</select>";
         document.getElementById("showarea" + j).innerHTML =  fmtops + addbreak1(ss);
         document.getElementById("showarea" + j).style.fontFamily = 'courier';
         document.getElementById("showarea" + j).style.fontWeight = '400';
         }
     }
    else
    {
        var sha = document.getElementById("showarea" + j);
        if (sha.innerHTML.includes('red') == false)
            sha.innerHTML = '';
    }
     if ( fmts[j] +''=='2')
     {
         LaTexHTML.formatele(document.getElementById("showarea" + j));
         syntaxerror= document.getElementById("showarea" + j).innerHTML.includes('displaystyle');
     }
}
function displayit1(j, sel)
{
    var obj=null, objv=null;
    if ( fmts[j] +''=='2')
     {
         LaTexHTML.deformat(document.getElementById("showarea" + j));
     }
    if (sel.selectedIndex == 6)
    {
        answers[j] = answers[j].replace(/\t/g,'   ');
        document.getElementById("showarea" + j).innerHTML = '';
        try{eval("obj=f1.q" + j + ";objv=f1.q" + j + ".value;"); obj.value= objv.replace(/\t/g,'   ');}catch(e){}
        sel.selectedIndex =  fmts[j];
        displayit(j,''+ fmts[j],  answers[j], 1);
    }
    else
    displayit(j,''+sel.options[sel.selectedIndex].value,  answers[j]);
}
var start$ = -1;
function showemtable(ta,J)
{
    var v = ta.value;
    var j = v.indexOf("\t");
    if (j ==-1) return;
     
    while (j>=0 && v.charAt(j)!='\n'&& v.charAt(j)!='\r')
    {
        j--;
    }
    
    var k = v.lastIndexOf("\t");
    while (k < v.length && v.charAt(k)!='\n'&& v.charAt(k)!='\r')
    {
        k++;
    }
    var str = v.substring(j+1,k);
    var x =(new CSVParse(str, '"', "\t", "\r\n")).tohtml().replace(/border\-collapse:/,'border:1px #060606 solid;border-collapse:').replace(/<td /g,'<td style=border-color:#cccccc ');
    
    var fmt =  fmts[J];
      
     LaTexHTML.deformat(document.getElementById("showarea" + J));
     if (fmt!= 0  )
     {
         document.getElementById("showarea" + J).innerHTML = x;
     }
     if ( fmt==2)
     {
         LaTexHTML.formatele(document.getElementById("showarea" + J));
     }
}
downloadfilename = f1.course.value + "-" + f1.assignname.value + '.html';
function displaytxt(ta,evt,j)
{
 var e = evt? evt : window.event;
 if(!e) return true;
 var key = 0;
 if (e.keyCode)
 {
     key = e.keyCode;
 } // for moz/fb, if keyCode==0 use 'which'
 else if (typeof(e.which)!= 'undefined')
 {
     key = e.which;
 }
 if (ta.tagName.toLowerCase() == 'input' && ta.value.length>parseInt(ta.maxlength))
 {
     return false;
 } 
 if (key == 36 || key==62)
 {
     var p = caretPos( ta) ;
     var str = '';
     var ch = String.fromCharCode(key);
     if (p > 0)
        str   = ta.value.substring(0,p) + ch +  ta.value.substring(p);
     else
        str   =   ch +  ta.value.substring(p);
     var fmt=guessFormat(str);
     
     tabeingedited = ta;
     displayit(j,fmt,str);
    
 }
 else if (key == 13)
 {
    if (ta.tagName.toLowerCase() == 'textarea') 
        ta.rows = ta.rows + 1;
    else if (isembedquiz)
    {
        str   =  ta.value;
        fmts[j]=guessFormat(str);
        sendpartial(j);
    }
 }
  
 if ( typeof(qstates) != 'undefined' )
 {
    if (qstates[j]==null || qstates[j][0] == null)
    {
           if (timerhandle!=null)
           {
              myprompt('Answer one at a time. Race the previous first');
              return false;
           }
           if (isembedquiz)
           {
               starttimer(100,j, ta);
               hideother(ta);
           }
           //setTimeout("doonblur(f1.q" + j +","+j + ")", 300000);  //;f1.q" + j +".style.visibility = 'hidden';
    }
    if (qstates[j]==null)qstates[j]=new Array();
    qstates[j][0] = 1;
 }
 
 return true;
}

function showother()
{
    var fs = f1.elements;
    for (var i=0; i < f1.length; i++)
        if (fs[i].tagName.toLowerCase()=='textarea' && fs[i].cols !='1')
            fs[i].style.visibility = 'visible';
}

function hideother(ta)
{
    var fs = f1.elements;
    for (var i=0; i < f1.length; i++)
        if (fs[i].tagName.toLowerCase()=='textarea' && fs[i]!=ta)
            fs[i].style.visibility = 'hidden';
}
var inediting = []; 
var ineditingb = [];
function doonfocus(txt,kk,ll)
{
     if (ll == null)
         inediting[kk]  = true;
     else
     {
         if (ineditingb[kk]==null) ineditingb[kk] = [];
         ineditingb[kk][11] = true; 
     }
     foucsarr[kk] = (new Date()).getTime();
     if (typeof(eonf)!='undefined')
     eonf(foucsarr[kk]);
     if (isembedquiz)
     {
        resizebox(100);
        var l = thispagewidth() - 135;
        resizebox(l);
        if (txt.readOnly)
        {
            myprompt(textmsg[1629]);
        }
     }
     else
     { 
         logactivity('ef' + kk);
         if (proctored && !isembedquiz && settingstr.includes("2"))
            sendprocmsg('ef' + kk);
         tic();
         
     }
     textareatobesearch = txt;
     associatedtxt = txt;
    
}

function disableeles(bool,kk)
{
 for (var j=0; j < f1.elements.length; j++)
 if (!bool ||   f1.elements[j].name!='isNaN1' &&  f1.elements[j].name!='noanswer'    )
 f1.elements.disabled = bool;
 f1.ismult.disabled = !bool;
 f1.questionnum.disabled = !bool;
 eval('f1.q' + kk + '.disabled=false');
}
let mysolution = new Array(); 
function sendpartial(kk,noclearhandler)
{
 showother();
 if (noclearhandler==null && timerhandle!=null) 
 {
     clearTimeout(timerhandle);
     timerhandle = null;
 } 
 answering = false;
 if (timerhandle!=null)
 clearInterval(timerhandle);
 timerhandle = null; 
 if (floater !=null) floater.doFloat();
 f1.questionnum.value = kk;
 for(let qn=0; qn < f1.elements.length; qn++)
 {
     let e = f1.elements[qn];
     if (e.name.indexOf('q') == 0 && e.name!= 'q' + kk)
         e.disenabled = true;
     else if (e.name== 'q' + kk)
         mysolution[kk] = e.value;
 }
 f1.mode.value="send";
 formnewaction(f1,   "embedquiz.jsp?fmt=" + (fmts[kk]!=null?fmts[kk]:defaultfmt(kk)));
 f1.target =   'w' + tstmp;
 var timenow = (new Date()).getTime();
 expiretime = activeidletime + timenow;
 last2server = timenow;
 visual(f1);
 f1.submit();
 
}
function doonchangeb(txt,kk,N)
{
   if (proctored&& !isembedquiz)
   {
       var xx='';
       for (var j=0; j < N; j++)
      {
         if (j>0)xx += '\n';
         eval("xx +=  f1.q" + kk +"_" + j +".value");
      }
      answers[kk] =  xx ;
      sendprocmsg('tx' + kk + ":" + xx);
   }
   else if (!isembedquiz && questionasked)
            checkreply();
   if (!isembedquiz)tic();
}
//onblur=doonblurb(this," + num + ",@#@@#@," +   l + ")
function doonchange(txt,kk)
{
   syntaxerror = false;
   txt.value = removejs(txt.value);
 if(detailass.fmt=='2' && txt.value.includes('\\') && txt.value.includes('$') == false)
 {    var sha = document.getElementById("showarea" + kk);
         if (sha!=null) sha.innerHTML = '<font color=red>' + textmsg[1936].replace(/@.*/,'') + '</font>';
         needtestformat = true;
 }
 var xx = txt.value.replace(/[\s]*$/,'');
 doonblurhelp(txt,kk,xx);
 if (detailass.stage == 'prev')
 {
      asanswer(txt);
 }
   if (proctored && !isembedquiz && (typeof(txt.type) == 'undefined' || txt.type.toLowerCase()!='radio'))
   {
       sendprocmsg('tx' + kk + ":" + txt.value);
   } 
   else if (!isembedquiz && questionasked)
       checkreply();
   if (!isembedquiz)tic();
  
   syntaxerrors[kk] = syntaxerror;
}
var syntaxerrors = new Array();
function doonblur(txt,kk)
{
 inediting[kk]  = false;  
 if (txt.value=='') return;
 
}

function needblur()
{
    for (var kk=0; kk < ineditingb.length; kk++)
    {
        if (ineditingb[kk]==null) continue;
        var N = ineditingb[kk].length;
        for (var k=0; k < N; k++)
        {
            if (ineditingb[kk][k])
            {
               try{ eval("doonblurb(f1.q" + kk + "_" + k + "," + kk + "," +  N + "," + k + ")");}catch(e){}
            }
        }
    }
    for (var kk=0; kk < inediting.length; kk++)
    {
        if (inediting[kk]==null || inediting[kk]==false) continue;
        eval("doonblur(f1.q" + kk +   "," + kk  + ")");
    }
}
let needtestformat = false; 
function doonblurb(txt,kk, N,ll)
{
     if (ineditingb[kk]!=null && ineditingb[kk].length!=N)
     {
         for (var k=0; k < N; k++)  
         if (ineditingb[kk][k] == null)
            ineditingb[kk][k] = false;  
     }
     if (ineditingb[kk]!=null && ll < ineditingb[kk].length)
     {
         ineditingb[kk][ll] = false;
     }
     if (txt==null || txt.value=='') return;
     txt.value = removejs(txt.value);
     txt.value = txt.value.replace(/\n.*$/,'').replace(/\t/g, ' ');
     let mlength = parseInt(''+txt.maxlength);if (''+mlength == 'NaN') mlength=100;
     if (txt.value.length > mlength)txt.value = txt.value.substring(0,mlength);
     
     
     if(detailass.fmt=='2' && txt.value.includes('\\') && txt.value.includes('$') == false)
     {    var sha = document.getElementById("showarea" + kk);
         
         if (sha!=null) 
         {
             sha.innerHTML = '<font color=red>' + textmsg[1936].replace(/@.*/,'') + '</font>';
             needtestformat = true;
         
         }
         
     }
     else
     {
         var sha = document.getElementById("showarea" + kk);
         if (sha.innerHTML.includes('red'))
         {    sha.innerHTML = ''; needtestformat = true;}
         
     }
     
     //if (txt.value)
     var xx='';

     for (var j=0; j < N; j++)
     {
         if (j>0)xx += '\n';
         eval("xx +=  f1.q" + kk +"_" + j +".value");
     }
     answers[kk] =  xx ;
     var hiddeninput = null;
     try{eval("hiddeninput = f1.q" + kk +";"); hiddeninput.value= xx;}catch(e){}
     doonblurhelp(txt,kk,xx);
     if (detailass.stage == 'prev')
     {
         asanswer(txt);
     }
      if(txt.value.includes('\\') && txt.value.includes('$') == false)
      {
            var sha = document.getElementById("showarea" + kk);
            sha.style.display = 'block';
            sha.style.visibility = 'visible';
      }
}
var numanswered; 
function addblanks()
{
    for (var i=0; i < f1.elements.length; i++)
    {
        if (f1.elements[i].name == null || f1.elements[i].name == '' || f1.elements[i].name.length < 2)
            continue;
        if (f1.elements[i].name.replace(/q[0-9]+_[0-9]+/,'')=='')
        {
            var kj = f1.elements[i].name.substring(1).split(/_/);
            var k = parseInt(kj[0]);
            var j = parseInt(kj[1]);
            var xxs = [];
            if (answers[k]!=null) 
                xxs = answers[k].split(/\n/);
            
            xxs[j] = f1.elements[i].value.replace(/^[ ]+/g,'').replace(/[ ]+$/g,'');
            var ans = '';
            for (var l=0; l < xxs.length; l++)
            {
                if (l > 0) ans += '\n';
                if (xxs[l]==null || xxs[l]=='')
                    ans += '';
                else 
                    ans += xxs[l];
            }
            answers[k] = ans;
            if (answers[k].replace(/\n/g,'')=='') 
                answers[k] = '';
            fmts[k] = guessFormat(answers[k]);
        }
        else if (f1.elements[i].name.replace(/q[0-9]+/,'')=='' && f1.elements[i].tagName.toLowerCase() == 'textarea')
        {
            var k  = parseInt(f1.elements[i].name.substring(1));
            answers[k] = f1.elements[i].value.replace(/\n[ ]+\t/g, '\n\t');
            if (fmts[k] == null)
                fmts[k] = guessFormat(f1.elements[i].value);
             
        }
        
        else if (  f1.elements[i].name.replace(/q[0-9]+/,'')=='' 
                && f1.elements[i].tagName.toLowerCase() == 'input'
                & typeof(f1.elements[i].type)!='undefined'
                && f1.elements[i].type.toLowerCase() == 'radio' 
                && f1.elements[i].checked)
        {
            var k  = parseInt(f1.elements[i].name.substring(1));
            answers[k] = f1.elements[i].value;
            fmts[k] = 4;
            
            
        }
    }
}

function alive()
{
    whichside = 'right';
    window.open('alive.jsp?target=child','w'+tstmp);
}
function delcac()
{
    localStorage.removeItem(savedQuizName);
    localStorage.removeItem(savedQuizName + "a");  
    localStorage.removeItem(savedQuizName + 'L');
}
function redcac()
{
    localStorage[savedQuizName] = Math.round(timedif + (new Date()).getTime()/1000) + "," + sofar;
    localStorage[savedQuizName+'a'] = f1.attach.value; 
}
 
function defaultfmt(i)
{
    var b =  eval("typeof(f1.q" + i + "[0])");
    if (b == 'object') return 4;
    return guessFormat(answers[i]);
}
function composecsv(whenSubmit)
{
    var lastnoblank = -1;
    var i;
    if (whenSubmit!=null)
        addblanks();
    for ( i=0; i <= detailass.maxorder; i++)
    {
    
    if (detailass.questarr[i]!=null && detailass.questarr[i].replace(/ /g,'')!='' 
     || answers[i] != null && answers[i]!='')
        lastnoblank = i;
    }
    if (detailass.freef != null)
    {
        sofar = f1.q1.value;
        return;
    }
    sofar = '';
    numanswered = 0;
    for ( i=0;  i <= lastnoblank; i++)
    { 
        if (answers[i] == null || answers[i] == '') 
        {
            if (whenSubmit!=null && detailass.mapnm2or[i]!=null)
            {
                if (sofar != '')  sofar += "\n";
                var xx = 0; 
                eval("if (typeof(f1.q" + i + ")!='undefined' && typeof(f1.q" + i +".type) != 'undefined' && f1.q" + i +".type.toLowerCase()=='radio') xx=4;");
                sofar += i + ",,0," + xx +"," + detailass.mapnm2or[i] + "," + (grades[i]!=null?grades[i]:-1);
            }
            continue;
        }
        
        if (sofar != '')  sofar += "\n";
        if (answers[i].indexOf(",") >= 0 || answers[i].indexOf("\r") >= 0 || answers[i].indexOf("\n") >= 0)
           sofar +=   i + "," + "'" + answers[i].replace(/'/g, "''") + "'";
        else
           sofar +=   i + "," + answers[i];
        if(spents[i] == null) {if (isembedquiz)spents[i] =0; else  spents[i] =10;}
        sofar=sofar + ',' + spents[i]  + ',' + (fmts[i]!=null?fmts[i]:defaultfmt(i));
        var tt = detailass.mapnm2or[i];
        if (tt == null) tt =  i;
        sofar = sofar + "," + tt   + "," + (grades[i]!=null?grades[i]:-1);
        numanswered++;
    }
    if (whenSubmit != null && isembedquiz && sofar == '' && f1.attach.value != '')
    {
        sofar = '1,attached,0,1,-1';
    }
}
function beforeclose()
{
 if (typeof(nullme0) != 'undefined')
 nullme0();
 
 if (hassave == false)
 return textmsg[415];
 return textmsg[210];
}
function doonblurhelp(txt,kk,xx)
{
     
     var fmt=6;
     
     if (typeof(txt.type)=='undefined' || txt.type.toLowerCase()!='radio')
     {
         fmt = guessFormat(txt.value);
         if (fmt == 1 || fmt==2)
         {
             checkHTML(txt,true);
             var yy = txt.value.replace(/^[ ]*<tr>/,'').replace(/<.tr>[ ]*$/,'').replace(/^[ ]*<td>/,'< td>').replace(/<.td>[ ]*$/,'< /td>');
             if (yy!=txt.value)
             {
                 addpromptmsg(textmsg[1748] + "(tr td without table)");
             }
             txt.value = yy;
         }
         else if (fmt==4 || fmt == 5)
         {
             if(''+fmt == '5') gradingprogrammingurl = 'gradepython.jsp';
             if(''+fmt == '4') gradingprogrammingurl = 'gradejava.jsp';
             var sha = document.getElementById("showarea" + kk);
             sha.innerHTML = formatstr(''+fmt,xx);
             sha.style.fontFamily = 'courier';
             sha.style.fontWeight = '400';
         }
         tabeingedited = txt;
         displayit(kk, fmt);
         if (   ''+fmt=='0'   && typeof(txt.type)!='undefined' && txt.type.toLowerCase()=='textarea' && txt.scrollWidth > txt.clientWidth) 
         {
             myprompt(textmsg[1595]);
             txt.onfocus();
         }
     }
     
     var x = (new Date()).getTime();
     eonb(x);
     if (foucsarr[kk] == null) 
     {
         foucsarr[kk] = timenow;
     }
     var x1 = Math.round( (x  - foucsarr[kk])/1000);
     timenow =  x;
     if (!isembedquiz)
     {
         if (spents[kk]==null) 
             spents[kk] = x1;
         else spents[kk] += x1;
         if (spents[kk]>7200) 
           spents[kk] = 7200;  
     }
     window.onbeforeunload = beforeclose;
     
     answers[kk] = xx;
     if (!isembedquiz && (typeof(txt.type) == 'undefined' || txt.type.toLowerCase()!='radio'))
     {
         logactivity('tx' + kk + ":" + xx  );
         if (proctored && settingstr.includes("3"))
            sendprocmsg('eb'+kk);
         else if (questionasked)
            checkreply();
     }
     if (!isembedquiz)tic();
     composecsv();
     if (sofar == '') return;
     localStorage[savedQuizName] = Math.round(timedif + (new Date()).getTime()/1000) + "," + sofar;
     
     if(proctorseks!='' && proctorseks!=null  || isembedquiz)
     {
        localStorage[savedQuizName] = Math.round(timedif + (new Date()).getTime()/1000) + "," + sofar;
        localStorage[savedQuizName+'a'] = f1.attach.value;
        
     }
     
     if (!isembedquiz  )
         showraw();
     
}
var itemvalue = '';
function onradioclick(txt,kk,N)
{
     itemvalue = txt.nextSibling.nodeValue;
     
     fmts[kk] = 4;
     doonblurhelp(txt,kk,txt.value);
     
     timenow = (new Date()).getTime();
      
     if (isembedquiz)
     {
         sendpartial(kk);
     }
     else 
     {
         logactivity('cl'+kk + ":" + txt.value);
         if (proctored && !isembedquiz)
         sendprocmsg('cl'+kk + ":" + txt.value);
         else if (questionasked)
            checkreply();
         tic();
     } 
     if (detailass.stage == 'prev')
     {
          asanswer(txt);
     }
}

function getbackf()
{
    self.focus();
    if (proctored && !isembedquiz && settingstr.indexOf('5') >= 0)
       sendprocmsg('sb');
    if (!isembedquiz) tic();
    logactivity('sb'); 
}
  
var hassave = false;

function saved(fmt2)
{
    //if (detailass.stage == 'prev') sofar = ''; 
    if (detailass.freef != null)
    {
        f1.q1.value = sofar;
        return;
    }
    var parse = new CSVParse(sofar, "'", ",", "\r\n");

    var longtime = parse.nextInt();
   
    if ('' + longtime == 'NaN' || longtime < 1000)
    {
        //parse.putBack();
        longtime = 100000000;
    }
 
    var sofar1 =  null;
    if (detailass.stage != 'prev')
    { 
        sofar1 = localStorage[savedQuizName];
        if (f1.attach.value == '' || f1.attach.value == null)
        {
            var xx1 = localStorage[savedQuizName + 'a'];
            if (xx1!=null) f1.attach.value = xx1;
        }
    }
    if ( f1.attach.value == null)   f1.attach.value = ''; 
    if (sofar1!=null && sofar1!='')
    {
        var parse1 = new CSVParse(sofar1, "'", ",", "\r\n");
        var longtime1 = parse1.nextInt();
        if ('' + longtime1 == 'NaN' || longtime1 < 1000)
        {
            //parse1.putBack();
            longtime1 = 100000000;
        }
        
        if (longtime1 > longtime)
        {
            sofar = sofar1;
            parse = parse1;
            
            if (document.location.toString().indexOf("assigndoc") >= 0)
                myprompt(textmsg[100]);
        }
     }
    var ar = null;
    var nur = 0;
    var KK = 0;
    questionanswers = {};
    let xx = null;
    if (detailass.stage != 'prev') xx = localStorage[savedQuizName+'q'];
    if (xx!=null)questionanswers = JSON.parse(xx); 
    while ( (  ar = parse.nextRow()) != null)
    {
        if (ar.length == 1) continue;
        nur++;
        var kk;
        if (ar.length > 10)
        {
            kk = parseInt(ar[0]);
            if (kk > KK) KK = kk;
            answers[kk] = ar[8];
            fmts[kk] = parseInt(''+ar[6]);
            spents[kk] = parseInt(ar[5]);
            if ('' + spents[kk] == 'NaN')
                spents[kk] = 1;
            else if (spents[kk] > 1000000)
                spents[kk] = 1000000;
            grades[kk] = ar[3];
        }
        else
        {
            kk = parseInt(ar[0]);
            if (kk > KK) KK = kk;
            answers[kk] = ar[1];
            if (!isembedquiz && kk > detailass.maxorder && (detailass.stage!='prev' || detailass.unknwonnum))
            {
                growrow1();
            }
            if (ar[3]==null || '' + ar[3] == 'NaN' ) ar[3] = guessFormat(ar[1]);
            if (ar[2]==null || '' + ar[2] == 'NaN') ar[2] = 1;
            if (fmts[kk]!=4) fmts[kk] = ar[3];
            spents[kk] = parseInt(ar[2]);
            if ('' + spents[kk] == 'NaN')
                spents[kk] = 1;
            else if (spents[kk] > 1000000)
                spents[kk] = 1000000;
            grades[kk] = -1;
            if (ar[5]!=null) grades[kk] =parseInt(ar[5]);
        }
        if (isembedquiz && nur > maintbl.rows.length/2)  growrow();
        if (isembedquiz)
        { 
            let xy = questionanswers[kk]; 
            if (xy == null)
            {
                xy = ['',''];
                if (grades[kk]==1)xy[1] = answers[kk];
            }
            response(xy[0],answers[kk],xy[1],kk,spents[kk]);
        }
    }
    for (var i= detailass.biggesti+1; i <= KK; i++)
        growrow1();
    
    var len = f1.elements.length;
    var lastk = 0;
    
    if (!isembedquiz )
    for (var i = 0; i < len; i++)
    {
        var x = f1.elements[i];
        if (x==null || typeof(x.name) == 'undefined')
            continue;
        var nstr = x.name;

        if (nstr.length < 2)
            continue;
        var kk = parseInt(nstr.substring(1));
        if (isNaN(kk)) continue;
       
        if (x.type.toLowerCase() == 'radio')
        {
            if (answers[kk] !=null)  answers[kk] = answers[kk].replace(/^[ ]+/,'');
            if (answers[kk]!=null && answers[kk]!='' && answers[kk].charAt(0).toLowerCase() == x.value.charAt(0).toLowerCase() )
            {
                x.checked = true;
                if (isembedquiz)
                {
                    hints[kk] = textmsg[1885];
                    x.parentNode.innerHTML = x.parentNode.innerHTML + results(grades[kk], spents[kk],kk);
                    lastk = kk;
                }
            }
            else
            {
                x.checked = false;
                if (isembedquiz)
                {
                    x.style.visibility = 'hidden';
                }
            }
        }
        else  if ( x.tagName.toLowerCase() == 'textarea' || x.tagName.toLowerCase() == 'input' && (x.type.toLowerCase() == 'hidden'))
        {
            var v = answers[kk]; if (v == null) v = '';
            var fmt = fmts[kk];
            var sha = document.getElementById("showarea" + kk);
          
           if (sha!=null)
           {
             var fmt1 = guessFormat(v);
            // sha.innerHTML = formatstr(v,fmt1);
           }
            x.value = v;
            if (x.tagName.toLowerCase() == 'textarea')
            {
                var rw = v.split(/[\r|\n]+/).length ;
                if (rw > 3) x.rows = rw;
                if (isembedquiz)
                {
                    eval("f1." + x.name + ".readOnly='1';f1." + x.name + ".style.backgroundColor=DBGCOLOR;");
                    lastk = kk;
                    hints[kk] = textmsg[1885];
                    sha.innerHTML = results(grades[kk], spents[kk],kk);
                }
            }
            else if (x.tagName.toLowerCase() == 'input')
            {
                var fills = v.replace(/\n/g,' \n').split(/\n/);
                var visibleinputs = null;
                if (v!='')
                {
                    for (var j = 0; j < fills.length; j++) 
                   {
                        try{eval("visibleinputs=f1." + x.name + "_" + j + ";");visibleinputs.value = fills[j].replace(/^ /,'');}catch(e){}
                   }
                    if (isembedquiz)
                    { 
                         for (var j = 0; j < fills.length; j++) 
                        {
                            hints[kk] = textmsg[1885];
                            sha.innerHTML = results(grades[kk], spents[kk],kk); 
                            try{eval("f1." + x.name + "_" + j + ".readOnly='1';f1." + x.name + "_" + j + ".style.backgroundColor=DBGCOLOR;");}catch(e){}
                        }
                    }
                }
                else
                {
                      for (var j = 0; j < 10; j++) 
                   {
                        try{eval("visibleinputs=f1." + x.name + "_" + j + ";");visibleinputs.value = '';}catch(e){break;}
                   }
                }
            }
             
        }
       
        if (nstr == 'submit2')
            hassave = true;
    }
    sha = document.getElementById("showarea" + lastk );
    if (sha!=null && sha.parentNode.parentNode == maintbl.rows[maintbl.rows.length-1])  
        growrow();
   
} 
function tempsave()
{
   let temp = {num:chatmsgnum,msg:chatmsgs,msgorient:chatmsgorient};
   localStorage[savedQuizName+'h'] = JSON.stringify(temp);
   if (!isembedquiz)tic();
    if (proctored && !isembedquiz)
     sendprocmsg('save');
    else if (!isembedquiz && questionasked)
            checkreply();
     logactivity('save');
     needblur();
     saveit(); 
}
function submitass(){
    if (proctored && !isembedquiz)
    sendprocmsg('submit');
    if (!isembedquiz)tic();
    logactivity('submit');
    needblur();
    functioncallstring = "setact(0)";
    open("alive.jsp?target=child", "w" + tstmp);
    
}
function saveit() 
{
 ResizeUploaded.alluploaded = ''; 
 var rightnow = (new Date()).getTime();
  
 if ( expiretime < rightnow)
 {
       functioncallstring  = "saveit()";
       open("alive.jsp?target=child", "w" + tstmp);
       return;
 }
  
 f1.target = 'w' + tstmp;

 if (isembedquiz)
 {
    formnewaction(f1, "embedquiz.jsp" );
    f1.mode.value = "submit";
    f1.target = self.name;
 }
 else
 {
    Msg.send({code:"leave"});
    f1.activities.value = activities;
    activities = '';
    formnewaction(f1, "DataUpdate" );
    f1.target = "w" + tstmp;
 }
 composecsv();
 f1.Content.value =  sofar.replace(new RegExp("\\[" + textmsg[1303] + "([0-9]+)","ig"),"[Imagelet$1");  
 window.onbeforeunload = null;
 disable0(true);
  
 expiretime = activeidletime + (new Date()).getTime();
 
 if (sofar!='')
 {
     visual(f1);
     if (isembedquiz )//&& !document.location.toString().includes('localhost'))
     {
         backupbyajax(f1.subdb.value,makeline());
         
     }    
     else if (runresult.length > 0)
     {
         var s = '';
         var hasa = false;
         for (var i=1; i < answers.length; i++)
         {
             
             if (i>1) s += '\n';
             s += ''+ i;
             s += detailass.ptlist[i] + ",-1,";
             if (runresult[i] != null && runresults[i]!='')
             {
                s +=  "'" + runresult[i].replace(/'/g,"''") + "'";
                hasa = true;
             }
             else if (answers[i]!=null && answers[i]!='')
             {
                 s +=  "'" + answers[i].replace(/'/g,"''") + "'";
             }
             else
             {
                 s += "''";
             }
         }
         if (hasa)
         {
         if (answers.length == 2)
         {
            s = s.replace(/^1,[0-9]+,.1,'/,"").replace(/''/g,"'").replace(/'$/,''); 
         }
         if (typeof(f1.assess) == 'undefined')
         {
             var x = document.createElement('input');
             x.type='hidden';
             x.value = s;
             f1.appendChild(x);
         }
         else
             f1.assess.value = s;
         }
         else  if (typeof(f1.assess) == 'undefined')
         {
             f1.removeChild(f1.assess);
         
         }
     }
     submitbyajax(f1);
     //f1.submit();
 }
 
}

function syn(n,ss,em1)
{
 if (askingquestion)
 {
     askingquestion = false;
     askquestionqueue();
     return;
 }
   
 ss = ss.replace(/pop/g, 'frames[0].pop').replace(/es\[/g, 'frames[0].es[');
 var orderi = parseInt(window.name.replace(/[a-z]/g,''));
 if (n==null && ss==null)
 return;
 if (n=='del')
 {
 if (ss.replace(/[0-9|a-z]/ig,'').replace(/[\-|_|\.|\$]/g,'')=='')
 ResizeUploaded.refreshatt();

 }
 else if (n.indexOf("web")==0)
 {
     ResizeUploaded.uploaded(n, ss, document.form1.attach);
 }
 else if (n.replace(/1,/,'')==n && n.replace(/,1/,'')==n && n!='1')
 {
 myprompt(  ss);
 
 }
 else
 {
 if (intervalhandle!=null)
 clearInterval(intervalhandle);
 if(ss!=null)
 {
 onblur = null;
 onfocus = null;
 onresize = null;
 document.form1.style.visibility = 'hidden';
 var bar = document.getElementById('mobiletoolbar');
 if (bar!=null) document.body.removeChild(bar);
  
 myprompt(textmsg[926] );
 promptwin.style.top = '150px';
 window.scrollTo(0,0);
 }
 else
 {
 if(  onmydomain( parent.opener) && typeof(window.parent.opener.changebutton) == 'function')   
     window.parent.opener.changebutton(window.parent,true);
 else if( typeof(window.parent.parent.opener.changebutton) == 'function')   
     window.parent.parent.opener.changebutton(window.parent.parent,true);
 onfocus = function(){};
 onblur = null;
 onresize = null;
 document.body.innerHTML = "The assignment/test has been submitted. Please save the receipt";
 //parent.close();
 }
 }
}
var helpstr = "<table><tr><td valign=top><input type=button style=background-color:#cc0000;color:white;width:75px;font-weight:650  value=Announce> </td>";
helpstr += "If you satisfy with the format of the quiz, you can announce to your students about the quiz</td></tr>";
helpstr += "<tr><td valign=top><input type=button style=background-color:#cc0000;color:white;width:75px;font-weight:650  value=TestSubmit> </td>";
 helpstr += "Test submission as you were a student</td></tr></table>";
function showhelp()
{
 popstr = 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=450,height= 400';
 var nav2 = openblank('helpwind', popstr,textmsg[7]);
 nav2.document.write(helpstr.replace(/\n/g, "<br>")); 
 endDocWrite(nav2);
}
 
if (isembedquiz ==false && openbook == 0)
 {
 window.focus();
 try
 {
 window.parent.moveTo(0, 0);
 window.parent.resizeTo(screen.width,screen.height);
 }catch(e){}
 }

 if (isembedquiz)
 {
    pollquestion = function(k)
    {
        f1.mode.value = "pull";
        f1.target = 'w' + tstmp;
        f1.questionnum.value = k;
        formnewaction(f1, "embedquiz.jsp" );
        visual(f1); 
        f1.submit(); 
    }
    setquestion = function(k, qtxt,ans)
    {
       if (grades[k] != null && grades[k]!=-1)
       {
           response(qtxt,answers[k],ans,k,spent[k]);
           return;
       }
       let qs = textmsg[1874].split(/@/);
       if (qtxt == null) qtxt = qs[2];
       else if (qtxt == '') qtxt = qs[1];
       let dv = document.getElementById('qx' + k);
       if (dv != null)
       {
            dv.innerHTML = qtxt;
            var fmt = guessFormat(qtxt);
            if (fmt + '' == '2') LaTexHTML.formatele(dv);
       }
    }
 }



 
function doclosing()
{

 
 if (norepeat && submited == false)
 {
 var nav = window.open('','Gradquiz', 'toolbar=0,location=0,directories=0,status=0,menubar=0,alwaysRaised=1,scrollbars=1,resizable=1,width=400,height=' + (30*total + 60) );
 nav.document.writeln("<html>" + metaencode + "<body>You are closing the window without submitting your answers.\n Your partial answers will be submitted to the server anyway." );
 f1.target = 'Gradquiz';
 formnewaction(f1,"gradeQuiz.jsp");
 expiretime = activeidletime + (new Date()).getTime();
 if (leasele!=null) leasele.value += totalleave + " seconds";
 visual(f1);
 f1.submit();
 }
}


window.onblur  = function()
{
 ponb((new Date()).getTime());
 if (ef==1) pf = 0;
 if (proctored && !isembedquiz && settingstr.includes("1"))
 sendprocmsg('pb');
 logactivity('pb');
 if (!isembedquiz)tic();
}
 
window.onfocus = function()
{
 if(ef==0) ponf();
 else pf = 0;
 if (proctored && !isembedquiz && settingstr.includes('0'))
 sendprocmsg('pf');
 logactivity('pf');
 if (!isembedquiz)tic();
}

var larger = function(ta)
{
    var j;
    if (ta!=null && ta.tagName.toLowerCase() == 'textarea')
    {
        j = ta.value.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/[^\n]/g,'').length + 3;
        ta.rows = '' + j;
    }
}


var resz = function(n)
{
 if (n == null) n = 0;
 var tbl = document.getElementById("maintbl");
 if (tbl==null || tbl.rows.length == 0) return;
 var l = tbl.rows[0].cells[0].offsetWidth;
 var tas = document.form1.elements;
 var anw = 90; 
}
 


function results(resulti,order,questionnum)
{
   if (hints[questionnum] == null || hints[questionnum] == '')
       hints[questionnum] == textmsg[1885];
   var tail;
   if (order == 0)
   {
       tail = '';
   }
   else 
   {
       tail = textmsg[1622] +   order ;
   }
   let color = resulti == -1?"organge":( resulti==1?"green":"red");
   
   let mark = resulti=='-1'?'!':(resulti=='1'?'&check;':'&cross;'); 
   if (questionnum!=null)
   {
       mark = "<td  align=center width=38 onmouseover=showmyhint(" + questionnum + ",1) onmouseout=hidemyhint() style=\"width:36px;height:36px;border-radius:70%/30%;background:radial-gradient(var(--tbgcolor),var(--bbgcolor));border:1px #b0b0b0 outset;color:"+ color + "\">" + mark + "</td>";
   }
   var rank =    "";
    if(order == 1 && typeof(f1.q1_0)!='undefined' && f1.q1_0.value == textmsg[787])
        rank  = "<table style=font-size:16px cellspacing=0 cellpadding=0 width=100%><tr>"+ mark + "<td align=right>"+ tail + "</td></tr></table>"; 
    else if (resulti==1)
        rank  ="<table cellspacing=0 cellpadding=0 width=100%><tr>"+ mark + "<td align=right>" + tail + "</td></tr></table>"; 
    else if ( resulti == 0)
        rank  = "<table cellspacing=0 cellpadding=0 width=100%><tr>"+ mark + "<td align=right>"+ tail + "</td></tr></table>";  
    else 
        rank  = "<table cellspacing=0 cellpadding=0 width=100%><tr>"+ mark + "<td align=right>"+ tail + "</td></tr></table>"; 
   return rank;
}
function grade(s, answer)
{
    if (s==null || s == ("")) return 0;
    if (answer==null || answer==("")) return -1;
    s = s.toLowerCase();
    answer = answer.toLowerCase();
    if (s.replace(/ /g,'') === answer.replace(/ /g,'') ) return 1;
    let a1 = answer.replace(/[0-9|\.|\/]/g,'') ;
    if (a1=== ''  && s.replace(/[0-9|\.|\/]/g,'') ==='' && answer!=='' && s!== null)
    {
        if ((answer.indexOf('.') >= 0 || s.indexOf('.') >= 0) && (answer.indexOf(s) === 0 || s.indexOf(answer) === 0))
            return 1;
        return (eval(answer.replace(/,/g,'')) === eval(s.replace(/,/g,'')))?1:0;
    }
     
    let v = answer.split(/ /);
    let score;

    if (s == ("")) 
    {
        score = 0;
    } 
    else 
    {
        let hits = 0;
        for (let i = 0; i <  v.length; ++i) 
        {
            if (s.indexOf(v[i]) < 0) continue;
            hits += 1;
        }
        score = (hits >= 0.66 * v.length) ? 1 : 0;
    }
    return score;
}
function resendpartial(v, questionnum)
{
    f1.code.value = v.replace(/^[ ]+/,'').replace(/[ ]+$/,''); 
    if (isembedquiz)
    sendpartial(questionnum);
}

function response(qtxt,solution, refanswer,questionnum, order, newdue)
{
    if (solution == '' && refanswer == '')
    {
        myprompt(textmsg[1927].split(/@/)[9] + ":",f1.code.value,"resendpartial(v,"+questionnum + ")");
        document.form1.submit2.disabled = true;
        return;
    }
    else document.form1.submit2.disabled = false;
    if (newdue!=null && (qtxt!='' || refanswer!=''))
    {
        if (qtxt=='' && refanswer!=''||order==-1)
            questionanswers[questionnum][1] = refanswer;
        else
            questionanswers[questionnum] = [qtxt,refanswer];
        localStorage[savedQuizName+'q'] = JSON.stringify(questionanswers);
    }
    let dv =  document.getElementById("qx" + questionnum);
    if (dv==null)
    {
        dv = document.createElement('span');
        dv.className = 'cellbg';
        dv.id= "qx" + questionnum;
        let txt = formselementbyname(document.form1, "q" + questionnum + "_0");
        txt.parentNode.insertBefore(dv,txt);
    }
    let ansarea = null; 
    if (dv!=null) ansarea = dv.nextSibling;
    if (dv!=null) dv.style.cssText = "display:block;margin:3px 3px 3px 3px;background-color:var(--tbgcolor);font-size:var(--fontsize);font-family:var(--fontname)";
    var fmt = guessFormat(qtxt);
    if (document.getElementById('choice'+questionnum)==null)
    {  
        if (solution!='')
        {
        qtxt += "<br><font color=purple>" + solution + "</font>";
        let fmt1 = '0';
        if (''+fmt!='2')
        {
            fmt1 = guessFormat(solution);
            if (fmt1 == '1')fmt == '1';
            else if (fmt1 == '2')fmt == '2';
        } 
        if (ansarea !=null) ansarea.style.display = 'none';
        }
    }
    else if (qtxt!='')
    {
       qtxt = qtxt.replace(/\n([a-z|A-Z])[\.| |:|\)|\-]([^\n]+)/g,'<br>$1. $2')
            + "<br><font color=purple>" + solution + "</font>";
       if (ansarea !=null) ansarea.style.display = 'none';
    }
    if (qtxt!='')
    {  
        if (dv!=null) dv.innerHTML = qtxt;
        if (fmt + '' == '2') LaTexHTML.formatele(dv);
        document.form1.submit2.disabled = false;
    }
    let resulti = (newdue==null)?grades[questionnum]:(solution!=''?grade(solution, refanswer)
    :grade(mysolution[questionnum], refanswer));
    var maintbl =  document.getElementById("maintbl");
    if (newdue!=null)
    {
        grades[questionnum] = resulti;
        spents[questionnum] = order;
    }
    if (refanswer!='')
       hints[questionnum] = refanswer;
    else  
       hints[questionnum] = textmsg[1885];
    composecsv();
    if (order!=-1)
    for (let qn =0; qn < f1.elements.length; qn++)
        f1.elements[qn].disabled = false;
    else
        order = spents[questionnum];
    for (var k=0; k < maintbl.rows.length-1; k++)
    { 
        var cel = maintbl.rows[k].cells[0];
        if (cel.innerHTML.indexOf("<!--" + questionnum + "-->")>=0 )
        {
            var rank =  results(resulti,order,questionnum) ;
            var sha =  document.getElementById("showarea" + questionnum);
            sha.innerHTML = rank;
            sha.style.color = "var(--ibgcolor)";
            sha.style.fontSize = '12px';
            if (maintbl.rows.length-2 == k)
                 growrow();
            break;
        }
    }
    if (newdue!=null && solution!='')
    {
       extentdue(newdue);
       if (document.getElementById('choice'+questionnum)==null)
      {
         if ( timerhandle!=null ) 
         {
             clearTimeout(timerhandle);
             timerhandle = null;
         } 
         if (document.getElementById('race'+questionnum)!=null)
         document.body.removeChild(document.getElementById('race'+questionnum));
      }
   } 
}
function lookfor( x,   v )
{
    if (x == null) return;
    else if (typeof(x.tagName)!='undefined' && x.tagName.toLowerCase() == 'input' 
     &&  (x.type.toLowerCase() == '' ||x.type.toLowerCase() == 'button' ||x.type.toLowerCase() == 'radio' || x.type.toLowerCase() == 'text') )
    {   
         
        v[v.length] = x;
        return;
    }
    else if (x.childNodes.length>0)
    {
        for (var i=0; i < x.childNodes.length; i++)
            lookfor(x.childNodes[i],v);
    }
}
var oldquizresize = self.onresize;
var oldquizresizew = window.onresize;
if (isembedquiz && window!=parent)
{
    document.write("<div id=\"minimizer\" onclick=minimize(this)  style=\"z-index:30;text-align:center;padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;background:url(image/toleft.jpg);color:#eee;width:26px;height:26px;font-size:18px;position:absolute;top:54px;left:0px;font-weight:700;1px #445577 solid\"> </div>");
    self.onresize = function ()
    {
        if (oldquizresize != null)
            oldquizresize();
        var wd = thispagewidth() - 120;
       var closebtn = document.getElementById('closebtn');
        if (closebtn!=null)
        {
            closebtn.style.position = 'absolute';
            closebtn.style.left = (wd - 20) + 'px';
            closebtn.style.position = 'fixed';
        }
         var  floater1Div = document.getElementById('floater1Div');
        if (floater1Div!=null)
        {
            floater1Div.style.position = 'absolute';
            floater1Div.style.left = (wd - 20) + 'px';
            floater1Div.style.position = 'fixed';
        }
    }
    window.onresize = function ()
    {
        if (oldquizresizew != null)
            oldquizresizew();
        var wd = thispagewidth() - 120;
        var closebtn = document.getElementById('closebtn');
        if (closebtn!=null)
        {
            closebtn.style.position = 'absolute';
            closebtn.style.left = (wd - 20) + 'px';
            closebtn.style.position = 'fixed';
        }
         var  floater1Div = document.getElementById('floater1Div');
        if (floater1Div!=null)
        {
            floater1Div.style.position = 'absolute';
            floater1Div.style.left = (wd - 20) + 'px';
            floater1Div.style.position = 'fixed';
        }
        
    }
}
if (isembedquiz && typeof(cidtitle)!= 'undefined')
{
    var ele = document.getElementsByClassName('forcurve1')[0];
    var td = document.createElement('span');
    td.innerHTML = cidtitle;
    td.style.cssText = 'font-size:20px;color:#DDCC11';
    ele.parentNode.insertBefore(td,ele);
}
 
    
function minimize(d)
{
    if (d.style.background.indexOf('toleft') > 0)
    {
        parent.document.body.cols =  "1,*";
        parent.parent.document.body.cols =  "1,*";
        d.style.background = "url(image/toright.jpg)";
        var l = thispagewidth() - 135;
        resizebox(l);
    }
    else
    {
        parent.document.body.cols =  "60%,*";
        parent.parent.document.body.cols =  "220,*";
        d.style.background = "url(image/toleft.jpg)";
        resizebox(100);
        var l = thispagewidth() - 135;
        resizebox(l);
    }
}
function onstart()
{
 functioncallstring = '';
 saved();
 
 functioncallstring = '';
 var tas = document.form1.getElementsByTagName("textarea");
 for (var i=0; i < tas.length; i++)
 {
     var yy = tas[i].name.substring(1);
     var xx = document.getElementById("showarea" + yy);
    // if (xx!=null) xx.innerHTML = checkh(tas[i].value, true);
 }
  
}
onstart();
var onloadbeforequizmake = null;
if (typeof window.onload == 'function')
   onloadbeforequizmake = window.onload;
var fsnd;
window.onload = function()
{
    functioncallstring = '';
    //setTimeout( resz , 10); 
    if (onloadbeforequizmake!=null)
        onloadbeforequizmake();
    showattachment(document.form1.attach.value);
    fsnd = document.form1;
    showraw(2);
    functioncallstring = '';
    if (detailass.stage == 'prev')
    {
        previewanswer();
        showanswers(detailass.loadwhich % 10);
        synanswers(detailass.loadwhich > 9);
    }
    else if (proctored && !isembedquiz)
    {
       initproc();
    }
    
    if (needregister)
    {
        let sp = document.createElement('span');
        let tb = document.getElementsByTagName('table')[0];
        let xy = findPositionnoScrolling(tb);
        let h = xy[1] + tb.offsetHeight+2;
        sp.style.cssText = 'z-index:10;background-color:transparent;color:blue;font-weight:700;border-radius:4px;font-size:20px;position:absolute;left:10px;top:'+ h + 'px';
        sp.innerHTML = textmsg[386];
        sp.onclick = register;
        document.body.appendChild(sp);
    } 
};
 
var proctorseks = ''; 
function initproc()
{
    Msg.key = keystr;
    Msg.send( {code:'join'});  
}
function leftattach()
{
    return f1.attach.value;
}
function guessfmt()
{
   if (detailass.freef == null) return '0';
   var ft =  guessFormat(document.form1.q1.value);
   f1.format.value = ft;
   return ft;
}
function incommon( rid, proctors)
{
     
    var x = '';
    var k;
    var rs = rid.replace(/^[ ]+/,'').replace(/[ ]*$/,'').split(/[ ]*,[ ]*/);
    var ps = proctors.replace(/^[ ]+/,'').replace(/[ ]*$/,'').split(/[ ]*,[ ]*/);
    for (var p=0; p < ps.length; p++)
        for (var q=0; q < rs.length; q++) 
            if ((k = rs[q].indexOf("-" + ps[p]))> 0) 
               x += ',' + rs[q].substring(0,k); 
    if (x=='') return '';
    proctorseks = x.substring(1);
    return proctorseks;
}
 
var settingstr = proctored?"0123456":"";
var trymore = true;
let waiting = false; 
Msg.handleget = function(s)
{
    waiting = false;
    if(s.indexOf('nokey!')==0)
    {
        proctored = false;
        parent.frames[1].document.getElementById('chattxt').value = chatmsgs[chatmsgnum];
        askquestion();
    }
    else appendmsg(s);
    Msg.needmore = false;
}
Msg.handlepost = function(s)
{
    var chatx = parent.frames[1].document.getElementById('chattxt');
    chatx.value = s;
    if (s == '')  
    {
        return;
    }
    var m = new Message(s);
    if (m.code == "newd")
    {
        if (parent.frames[1].document.getElementById('chattxt') == null)
        {
               var chatd = parent.frames[1].document.getElementById('chat');
               if (chatd!=null) chatd.innerHTML = chatdiv();
        }
        if (m.msg!=null && m.msg!='')
        {
            if (m.msg.indexOf("seting:") == 0)
                settingstr = m.msg.substring(7);
            else
                m.code = 'plain'; 
        }
    }
    else if (m.code == "seting")
    {
        if (m.msg!=null)
        settingstr = (m.msg);
    }
    if (m.code == "plain")
    {
        if (m.msg=='') 
            return true;
        if (m.msg.indexOf("seting:") == 0)
        {
           settingstr = m.msg.substring(7);
           return;
        }
        if ( incommon(m.rid, proctors)!='') 
        {
            if (parent.frames[1].document.getElementById('chattxt') == null)
            {
               var chatd = parent.frames[1].document.getElementById('chat');
               if (chatd!=null) chatd.innerHTML = chatdiv();
            }
        }  
        appendmsg(m.msg);
    }
    return true; 
}
function appendmsg(ms)
{
    var addnew = true;
    if (chatmsgs[chatmsgnum]!='')
        chatmsgnum++;
    else
        addnew = false;
    chatmsgs[chatmsgnum] = ms;
    chatmsgorient[chatmsgnum]= 0;

     var chatmsgptr = parent.frames[1].document.getElementById('chatmsg');
     if (chatmsgptr == null)
     {
         if (!isembedquiz) showraw();
     }
     else 
     { 
         if (addnew)
         {
             var area =  parent.frames[1].document.createElement('div');
             area.id= 'chatmsg' + chatmsgnum;
         }
         else
         {
             area =  parent.frames[1].document.getElementById('chatmsg' + chatmsgnum);
         }
         var fmt = guessFormat(ms);
         area.innerHTML = '&darr;' + formatstr(ms, fmt);
         area.style.cssText = 'font-family:inherit;font-size:12px;color:#000011';
         if (addnew)chatmsgptr.appendChild(area); 
         if (fmt + '' == '2') LaTexHTML.formatele(area);
     }
}
var activities = '';
 
if (hasactivities)
{
    activities = ((new Date()).getTime() + ' ').replace(/[0-9][0-9][0-9] /,' st,');
}
function logactivity(x)
{
   if (hasactivities)
    {
       var xx= ((new Date()).getTime() + ' ').replace(/[0-9][0-9][0-9] /,' ') + x;
       var k = xx.indexOf(':');
       if (k>0) xx = xx.substring(0,k);
       activities += xx +  ',';
    } 
}
let queued = '';

function sendprocmsg(x)
{
    if (x.replace(/[0-9].*/,'') == '' && settingstr.indexOf('4') < 0) return;
    var timenow = (new Date()).getTime();
    expiretime = activeidletime + timenow;
    last2server = timenow;
    queued += x +"#`@`";
    if (x.indexOf("ak")==0 ||x.indexOf("tx")==0 || x.indexOf("cl")==0 ||x.indexOf('submit') == 0)
    {
       // var chatx = parent.frames[1].document.getElementById('chattxt');
      //  chatx.value = queued;
        Msg.send({code:'send',msg:queued});
        queued = '';
    }
}
if (detailass.stage == 'prev')
{
sendpartial = function(num)
{
      var t = "";
      let multichoice = false;
      try{eval("t=f1.q" + num + "_0.value;");}catch(e){
       multichoice = true;
       let kk = 0;
       while(true)
       {
           let sel=false;
           try{eval("sel=f1.q" + num + "[" + kk + "].checked;")}catch(e){break;}
           if (sel==true)
           {
               try{eval("t=f1.q" + num + "[" + kk + "].value;");}catch(e){}
               break;
           }
           else kk++;
       }
         
      }
      if (multichoice == false)
      {
          var xx = document.getElementById('race'+num);
          if (xx!=null)
          {
              document.body.removeChild(xx);
          }
      }
      var t1 = window.parent.d[num][1];
      var t2 = window.parent.d[num][2]; //solution, refanswer
      response(t1,t,t2, num, '1', Math.round((new Date()).getTime()/1000) + 3600);
      showother();
      if (timerhandle!=null) 
      {
         clearTimeout(timerhandle);
         timerhandle = null; 
      } 
      answering = false;
  }
}
function previewanswer()
{
   showraw(2);
   var ys = f1.elements;
   var ans = '';
   for (var i=0; i < ys.length; i++)
   {
       var y = ys[i];
       if (y.name.charAt(0)!='q')continue;
       if (y.tagName.toLowerCase() == 'input' && y.type.toLowerCase() == 'radio' )
       {
           var k = parseInt(y.name.replace(/[^0-9]/g,''));
           if (detailass.answqrr[k].replace(/^[ ]+/,'').charAt(0).toLowerCase()== y.value.replace(/^[ ]+/,'').charAt(0).toLowerCase())
               y.checked = true;
       }
       else if (y.tagName.toLowerCase() == 'input' && (y.type.toLowerCase() == 'text' || y.type.toLowerCase() == null))
       {
           var zz = y.name.substring(1).split(/_/);
           var k = parseInt(zz[0]);
           var z = detailass.answqrr[k].replace(/^[\n|\r| ]+/,'').replace(/[\n|\r| ]+$/,'').split(/\n/);
           var l = parseInt(zz[1]);
           y.value = z[l];
           y.size = z[l].length;
       }
       else if (y.tagName.toLowerCase() == 'textarea'  )
       {
           var k = parseInt(y.name.replace(/[^0-9]/g,''));
           y.value = detailass.answqrr[k]; 
       } 
   }
}
function stringify()
{
    var z = '';
    for (var k=0; k < detailass.answqrr.length; k++)
    {
        if (detailass.answqrr[k]!=null)
        z += k + "." + detailass.answqrr[k] + "\n\n";     
    }
    if (ifsynanswers) detailass.callingwin.setv(0, 9, z);
}
function setuid(u)
{
    thesid = u;
    onlinetoolinitial = onlinetoolinitial.replace(/sid=[^;]+/,'sid='+u);
    initexamsg(u,sek);
    document.form1.sid.value = u;
}


function asanswer(y)
{
    
       if (y.tagName.toLowerCase() == 'input' && y.type.toLowerCase() == 'radio' && y.checked)
       {
           var k = parseInt(y.name.replace(/[^0-9]/g,''));
           detailass.answqrr[k] = y.value.replace(/^[ ]+/,'').replace(/ .*/,'');
           stringify();
       }
       else if (y.tagName.toLowerCase() == 'input' && (y.type.toLowerCase() == 'text' || y.type.toLowerCase() == null))
       {
           var k = parseInt(y.name.replace(/_.*/g,'').replace(/[^0-9]/g,''));
           var l = parseInt(y.name.replace(/[^_]+_/g,''));
           var z = detailass.answqrr[k].replace(/^[\n|\r| ]+/,'').replace(/[\n|\r| ]+$/,'').split(/\n/);
           z[l] =   y.value; 
           var zz = ''; 
           for (l=0; l < z.length; l++) zz += ' ' + z[l] + "\n";
           detailass.answqrr[k] = zz;
           stringify();
       }
       else if (y.tagName.toLowerCase() == 'textarea'  )
       {
           var k = parseInt(y.name.replace(/[^0-9]/g,''));
           detailass.answqrr[k] = y.value; 
           stringify();
       }
       
}
function register()
{
    myprompt('<iframe name=regiswin width=600 height=400 />',null,null,textmsg[386]);
    postopen('DataForm',"code,rdap,exbut,orgnum,numrows,onbegin,courseid,sessionname,subdb,semester".split(/,/),
    ["1","registerc","cpd",""+orgnum, "1","21",f1.course.value,f1.sessionname.value, f1.subdb.value,f1.semester.value],
    "regiswin");
}

function restoredim(x)
{
   SetCookie(orgnum%65536 + 'uid',x);
   //delcac();
   savedQuizName = savedQuizName.replace(/[^\-]+$/, x); 
   redcac();
   if (document.location.toString().includes("embedquiz"))
   {
      theuid = x;
      document.form3.sid.value = document.form1.sid.value = x;
   }
   else
   {
      document.location.href = document.location.toString();
   }
}
  
 

 





