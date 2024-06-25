/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
 

var courses = new Array(), sessions = new Array(), assignnames = new Array(),cangradeall = [];
courses[0] = '';
var anonymous = new Array();  
var gradebyta = (ZQ[0] == 'grading11');
var enteredsn = defaultRecord[2].replace(/!/,'');
var anyword =captions[2][0]; 
let semestersel,coursesel,sessionsel,assignsel;
for (let k=1; k < options[2].length; k++)
if (options[2][k]!=null && options[2][k].indexOf('--') == 0)
{
        anonymous[k] = 1;
        options[2][k] = options[2][k].substring(2);
} 
function copyarr(arr)
{
   if (arr==null) return null;
   var newarr = new Array(arr.length);
   for (var i=0; i < arr.length; i++)
   {
       newarr[i] = arr[i];
   }
   return newarr;
}
function reloadsemester()
{
    if (v!=null && v!='' && x!=null && x!='' && v!=x) 
    {
        var nms = 'orgnum,semester,rdap,exbut,subdb'.split(/,/);
        var vls = [orgnum,v,'grading0', 'h', subdb];
        postopen('DataSelect', nms, vls, '_self');
        //var old =  parent.document.location.toString().replace(/DataSearch.*/, "");
       // parent.document.location.href = old +"DataSearch?orgnum=" + orgnum + "&exbut=h&rdap=grading0&semester=" + v + "&subdb=" + subdb;
    }
}
var updateQuery0 = '', updateQueryc = " WHERE  Submission.semester=Assignment.semester "  
+ " AND (((Submission.semester='@0@')))  " 
+ " AND  Submission.course=Assignment.course "    
+ " AND (((Assignment.course = '@1@')))  " 
+ " AND  ((( Assignment.sessionname='@2@'))) "    
+ " AND  Assignment.name=Submission.assignname  "   
+ " AND   Submission.sid=AppUser.id  "    
+ " AND Submission.comment LIKE '#%'  ",
updateQuerys = ", Registration WHERE Submission.semester=Assignment.semester "  
+ " AND (((Submission.semester='@0@')))  " 
+ " AND  Submission.course=Assignment.course "    
+ " AND (((Assignment.course = '@1@')))  " 
+ " AND  ((( Assignment.sessionname LIKE '%@2@%'))) "    
+ " AND  Assignment.name=Submission.assignname  "  
+ " AND (((Assignment.name = '@3@'))) " 
+ " AND Submission.sid=AppUser.id  " 
+ " AND AppUser.id LIKE '%@4@%'"   
+ " AND (AppUser.lastname LIKE '%@5@%' OR AppUser.firstname LIKE '%@5@%')"
+ " AND ((( -1=@6@  AND Submission.grade=-1  OR 0=@6@ AND Submission.grade >= @7@ AND Submission.grade <= @8@ OR ''='@6@'  OR Submission.grade=-2 AND Assignment.due<??CURRENT_TIME??))) "
+ " AND Submission.content LIKE '%@9@%'  " 
+ " AND Submission.comment LIKE '%@10@%'  "    
+ " AND Registration.sid = Submission.sid " 
+ " AND Registration.courseid= Submission.course " 
+ " AND Registration.semester='@0@'  " 
+ " AND Registration.sessionname='@2@' ",
updateQueryt = "  WHERE Submission.semester=Assignment.semester "  
+ " AND (((Submission.semester='@0@')))  " 
+ " AND  Submission.course=Assignment.course "    
+ " AND (((Assignment.course = '@1@')))  " 
+ " AND  ((( Assignment.sessionname='@2@'))) "    
+ " AND  Assignment.name=Submission.assignname  "  
+ " AND (((Assignment.name = '@3@'))) " 
+ " AND Submission.sid=AppUser.id  " 
+ " AND AppUser.id LIKE '%@4@%'"   
+ " AND (AppUser.lastname LIKE '%@5@%' OR AppUser.firstname LIKE '%@5@%')"
+ " AND ((( -1=@6@  AND Submission.grade=-1  OR 0=@6@ AND Submission.grade >= @7@ AND Submission.grade <= @8@ OR ''='@6@'  OR Submission.grade=-2 AND Assignment.due<??CURRENT_TIME??))) "
+ " AND Submission.content LIKE '%@9@%'  " 
+ " AND Submission.comment LIKE '%@10@%'  "; 

 
function firstload()
{
   updateQuery0 = updateQuery;
   mandatory[1] = true;
   if (defaultRecord[1] != null && defaultRecord[1] != '')
       reloadsession();
   document.form1.Status.options[2].text = textmsg[913];
   document.form1.Status.options[3].text = textmsg[915];
   document.form1.Status.options[4] = new Option("Feedback",3);
   document.form1.displayformat.options[2] = null;
   document.form1.displayformat.options[1] = null;
   document.form1.displayformat.options[0].text = textmsg[1805];
   document.form1.displayformat.options[1] = new Option(textmsg[1797], "gradingQuestion.jsp"); 
   document.form1.displayformat.options[2]= new Option(textmsg[1806],mss[8].replace(/Data[a-z|A-Z]+/, 'DataTable').replace(/rdap=[a-z]*/,"rdap=gradingtb"));
   //document.form1.displayformat.options[1].className = 'selectoption';
   document.form1.displayformat.options[3]= new Option('CSV:Excel',mss[8].replace(/Data[a-z|A-Z]+/, 'DataCSV').replace(/rdap=[a-z]*/,"rdap=gradingcsv&quotes=1"));
   //document.form1.displayformat.options[2].className = 'selectoption'; 
   
}
 
function reloadsession()
{
    hascompound = false;
    var course = coursesel.options[coursesel.selectedIndex].value;
    var k1 = 1;
    for (var k=sessionsel.options.length-1; k>0; k--)
        sessionsel.removeChild(sessionsel.options[k]);
    let ss = [];
    for (var k=1; k < courses.length; k++)
    {
        if (courses[k] == course)
        {
            if (options[2][k1-1]!= sessions[k]) 
            {    
                options[2][k1] = sessions[k];
                captions[2][k1] = sessions[k];
                let sss = sessions[k].split(/,/);
                for (let s1 of sss) if (!ss.includes(s1)) ss.push(s1);
                sessionsel.options[k1] = new Option(sessions[k],sessions[k]);
                k1++;
                if (hascompound == false && sessions[k].includes(','))
                    hascompound = true;
            }
        }
    }
    for (let s1 of ss)
    if (!sessions.includes(s1))
    {
        sessionsel.options[k1] = new Option(s1,s1);
        k1++;
    }
    for (var k=sessionsel.options.length-1; k>=k1; k--)
    {      
        sessionsel.options[k] =  new Option("","");
    }
    if (k1 == 1)
    {
       sessionsel.selectedIndex = 0; 
       for (var k=assignsel.options.length-1; k>0; k--)
          assignsel.options[k] = null;
    }
    else if (k1 == 2)
    {
       sessionsel.selectedIndex = 1; 
       reloadassign();
    }
    
}
 
function reloadassign()
{
    var course = coursesel.options[coursesel.selectedIndex].value;
    var session = sessionsel.options[sessionsel.selectedIndex].value;
    var k1 = 1;
    for (var k=assignsel.options.length-1; k>0; k--)
        assignsel.options[k] = null;
     
    for (var k=0; k < courses.length; k++)
    {
        if (courses[k] == course && (sessions[k]===session||sessions[k].split(/,/).includes(session)))
        {
            if (options[3][k1-1]!= assignnames[k]) 
            {    
                options[3][k1] = assignnames[k];
                captions[3][k1] = assignnames[k];
                assignsel.options[k1] = new Option(captions[3][k1],options[3][k1]);
                //sel.options[k1].className = 'selectoption';
                k1++;
            }
        }
    }
   
     
    if (k1 == 1)
    {
       sel.selectedIndex = 0; 
       for (var k=sel.options.length-1; k>0; k--)
        sel.options[k] = null;
    }
    else  if (k1 == 2)
    {
       sel.selectedIndex = 1;
    }
    if (gradebyta)
    {
        restrict(retrv(0,3));
    }
}
 
function whichsession(assignname,courseid,semester)
{
   var sel = document.forms[0].elements[2];
   if (sel.selectedIndex != 0)
   return sel.options[sel.selectedIndex].value;
   return '';
}
var astatus = [];
let hascompound = false;
function makeoptions()
{
   if ( gradebyta)
   {
       if ((options[2]==null || options[2].length==0) )
       {
           //open('gradebyta.jsp?error=3','_parent');
           alert("There was no assignments. Try late");
           return;
       }
   }
   
   if (options[2][0] != '')
   {
      options[2].splice(0,0,'');
      captions[2].splice(0,0,'Any');
   }
   assignnames = copyarr(options[2]);
   
   var k1 = 1;
   var sss = [];
   for (var k=1; k < captions[2].length; k++)
   {
       
       var tmp = captions[2][k].split(/\^~/);
       if (tmp.length < 2) break;
       courses[k] = tmp[0];
     
       if (tmp[1].indexOf("~^") < 0)
       {  
           sessions[k] = tmp[1];
           astatus[options[2][k] + "@" + sessions[k]] =  tmp[2];
           sss.push(options[2][k] + "@" + sessions[k]   + ' --->' +  tmp[2]);
       }
       else
       {
           //01~^D10011112,D10045678,D10059906~^D10045678
           var tmp1 = tmp[1].split(/~\^/);
           //options[1][k] = captions[1][k]= courses[k];
           captions[2][k] = options[2][k] = sessions[k] = tmp1[0];
           cangradeall[tmp1[0] + "@" + assignnames[k]] = (tmp1[1].indexOf(tmp1[2])>=0);
           options[3][k] = captions[3][k]= assignnames[k];
       }
        
       if (courses[k]!=courses[k-1])
       { 
           options[1][k1++]=courses[k];
       }
   }
   
   captions[1] = copyarr(options[1]);
   
    if(parent.opener!=null&& onmydomain(parent.opener) && typeof parent.opener.getCourseGoing =='function')
    {
      var scid = parent.opener.getCourseGoing();
      if (scid!=null &&  scid!='')
      {
          defaultRecord[1] = scid;
      }
      cellonblur +="if(c==1)parent.opener.setCourseGoing(v);";
    }
    else if(parent.parent!=null && parent.parent.opener!=null&& onmydomain(parent.parent.opener) && typeof parent.parent.opener.getCourseGoing =='function')
    {
      scid = parent.parent.opener.getCourseGoing();
      if (scid!=null &&  scid!='')
      {
          defaultRecord[1] = scid;
      }
      cellonblur +="if(c==1)parent.parent.opener.setCourseGoing(v);";
    }
    if (options[1].length == 2)
        defaultRecord[1] = options[1][1];
    else if (options[1].length == 1)
    {
       defaultRecord[1] = options[1][0]; 
    }
    if (KK=1)
        captions[1][0] = captions[2][0] = anyword;
 
 }    
 
function showastatus()
{
    
     let cid = coursesel.options[coursesel.selectedIndex].text;
     let nm = assignsel.options[assignsel.selectedIndex].text;
     let ses = sessionsel.options[sessionsel.selectedIndex].text;
     let sem =  semestersel.options[semestersel.selectedIndex].value;
     var ast = document.getElementById('asstatus'); 
     if (coursesel.selectedIndex!=0 && sessionsel.selectedIndex!=0 && assignsel.selectedIndex!=0)
     {
         if (ast==null)
         {
             ast = document.createElement('span');
             ast.id = 'asstatus';
             ast.innerHTML = '<input id=release type=checkbox onclick=resetast(this) ' + (astatus[nm + '@' + ses]=='3'?'':'checked') + '> <span style=color:#DDCC11>' + textmsg[1941] + "</span>"
              + "<span style=float:right><a href=javascript:gradeproj()>" + textmsg[1940] + "</a></span>";
             var cy = document.getElementById('cpright');
             cy.parentNode.insertBefore(ast,cy);
         }
     }
     else
     {  if (ast!=null)
         ast.parentNode.removeChild(ast);
     }
}
function gradeproj()
{
    var ss = document.form1.Semester;
    var sc = document.form1.CourseId;
    var sn = document.form1.Session;
    var sa = document.form1.AssignmentTest;
    postopen('gradeproj.jsp',"semester,course,sessionname,assignname".split(/,/),
    [ss.options[ss.selectedIndex].value, sc.options[sc.selectedIndex].value,sn.options[sn.selectedIndex].value,sa.options[sa.selectedIndex].value],
    '_blank');
}
function resetast(ck)
{
  
     let cid = coursesel.options[coursesel.selectedIndex].text;
     let nm = assignsel.options[assignsel.selectedIndex].text;
     let ses = sessionsel.options[sessionsel.selectedIndex].text;
     let sem =  semestersel.options[semestersel.selectedIndex].value;
     if (astatus[nm + '@' + ses]=='3' && ck.checked )
     {
         setastatus(2);
     }
     else if (astatus[nm + '@' + ses]!='3' && !ck.checked )
     {
         setastatus(3);
     }
}
function setastatus(j)
{
    
     let cid = coursesel.options[coursesel.selectedIndex].text;
     let nm = assignsel.options[assignsel.selectedIndex].text;
     let ses = sessionsel.options[sessionsel.selectedIndex].text;
     let sem =  semestersel.options[semestersel.selectedIndex].value;
     let fd = new FormData();
     fd.append("mode", j==3?'ingrading':'toauto');
      fd.append("cid", cid);
      fd.append("assignname", nm);
        fd.append("semester", sem);
         fd.append("sessions", ses);
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
         
        if (y.length> 40)
        {
           
            let nm = assignsel.options[assignsel.selectedIndex].text;
            let ses = sessionsel.options[sessionsel.selectedIndex].text;
            var ast = document.getElementById('asstatus'); 
            astatus[nm + '@' + ses] =  ast.checked?'2':'3';        
        }
    }
    }
    let xx = new URLSearchParams(fd).toString();
    let url = 'alerta.jsp';
    xmlhttp.open('POST', url, true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send(xx); 
        
}
function debg()
{
    open('follows.jsp?x=mycourse',parent.frames[1].name);
}
var firstnocourse = false;
function retrieve()
{
    postopen('follows.jsp', ['semester','x'],  [retrv(0,0),'reloadg'],parent.frames[1].name);
    firstnocourse = true;
}
function setoptions()
{
    for (let i=ele(0,1).options.length-1; i>=0; i--)
    {
       ele(0,1).options[i] = null; 
    }
    for (let i=0; i < options[1].length; i++)
    {
       ele(0,1).options[i] = new Option(options[1][i],options[1][i]); 
    }
    ele(0,1).onchange = function(){
        let k = this.selectedIndex;
        let course = this.options[k].value;
        let sessionname = new Array();
        sessionsel.options[1] = null;
        sessionsel.options[0] = null;
        let l = 0;
        for (let k=0; k < options[2].length; k++)
        {
            if (options[2][k].indexOf(course) == 0) 
            {
                let sess = options[2][k].replace(/[^~]+~/,'');
                sessionsel.options[l++] = new Option(sess,sess);
            }
        }
        sessionsel.selectedIndex = 0;
    }
    closeprompt();
    ele(0,1).options[0].text = sessionsel.options[0].text;
}
function antibusy()
{
   if (options[2].length === 1) 
   {
       let s = localStorage['crseass'];
       if (s == null) return; 
       let pr = new CSVParse(s.trim(),'\'',';','\n');
       let p = pr.nextMatrix();
       for (let i=0; i < p.length; i++)
       {
           options[2].push(p[i][0]);
           captions[2].push(p[i][1]);
       }
       makeoptions();
   }
   else
   {
       let s=[];
       for (let i=1; i < options[2].length; i++)
       {
           s.push(options[2][i]);s.push(';');
           s.push(captions[2][i]);s.push('\n');
       }
       localStorage['crseass'] = s.join('');
   }
   
}
function usedbefore()
{
     
    if (courses.length == 1 && options[2].length == 1)
    {
        if (!firstnocourse)
        {
            let as = textmsg[1918].split(/@/);
            myprompt(as[1] + "<br><br><center><input class=GreenButton type=button style=width:70px value=\"" + as[0] + "\" onclick=retrieve() ></center>");
        }
        else
        {
           myprompt( textmsg[1364] + "<br><br><center><input class=GreenButton type=button style=width:70px value=\"" + textmsg[1365] + "\" onclick=debg() ></center>");
        }
        return;
    }
    if (document.form1.elements[6].options[0].text == '')
    {
        document.form1.elements[6].options[0] = null; 
    }
    var s = localStorage["savedCritias"]; 
    if (s == null) return;
    var p = new CSVParse(s, "'", ",");
    var ss = p.nextRow();
    
    for (var i=0; i < ss.length; i++)
    {
        setv(0,i+1,ss[i]);
        c = i+1;
        if (i==0)reloadsession();
        else if (i  ==1)reloadassign();
    }
    document.form1.elements[1].options[0].text = textmsg[16];
    document.form1.elements[2].options[0].text = anyword; 
}
 
function saveselection()
{
   var ss = '';
   for (var i=1; i < numCols; i++)
   {
       v = retrv(0,i);
       if (v == null) v = '';
       ss +=  "'" + v.replace(/'/g,"''") + "'";
       if (i < numCols-1) ss += ",";
   } 
   localStorage["savedCritias"] = ss;
}

function removehat()
{
    var sel = document.form1.elements[2];
    for (var k=sel.options.length-1; k>0; k--)
    {
        if (sel.options[k].text.indexOf("^~") >0 )
        sel.removeChild(sel.options[k]);
    }
}

 
var isallungraded = false; 
function setisallungraded(b)
{
    isallungraded = b; 
}
function reshow()
{
    if (isallungraded)
    {
        var y =  document.form1.Assigntest;
        for (var k=1; k < y.options.length; k++)
        {
            y.options[k].text = y.options[k].value;
        }
        y.options[k].text = 
        isallungraded = false;
    }
}
var submitlate = function()
 {
     for (var j=0; j < 4; j++)
     {
         if (ele(0,j).selectedIndex < 1)
         {
             myprompt(textmsg[1600] + " " + labels[j]);
             return;
         }
     }
     setrdapname(2);
     newrecord();
 }
var gradingformulas =["K*(1-Min(2,P)*0.2)","(0.3*Min(L,M)/M + 0.7*K)*(1-Min(2,P)*0.2)","(0.4*Min(L,1)+0.6*K)*(1+0.1*(N-R)/N)"];
function setformula(t,f,a)
{
    if (''+ a == '4') gradingformulas[2] = f;
    else if (t==4) gradingformulas[0] = f;
    else  gradingformulas[1] = f;
}
function getformula(t,a)
{
    if (''+a=='4') return gradingformulas[2];
    if (t==4) return gradingformulas[0];
    return   gradingformulas[1];
}
function resel()
{
    let e = ele(0,1);
    for (let j = e.options.length-1; j >=0; j--)
        e.options[j] = null;
    for (let j = 0; j < options[1].length; j++)
        e.options[j] = new Option(captions[1][j],options[1][j]);
    closeprompt();
}
makeoptions(); 
onbegin = ";semestersel=ele(0,0);coursesel=ele(0,1);sessionsel=ele(0,2);assignsel=ele(0,3);antibusy();firstload();usedbefore();document.thisform.savebtn1.value =  textmsg[1618];document.thisform.savebtn1.onclick=submitlate;hidefixed();adddemo();";
onclose  = "saveselection();";
cellonblur += "if(c==0)reloadsemester();else if (c==1)reloadsession();else if (c==2)reloadassign(v); else if (c==6) reshow();";
if (gradebyta)
{
    cellonblur += "if(c==3)restrict(v);";
}
cellonfocus += "if (c==2)removehat()";
var olddosearch;
var onloadbeforegradingsearchjs  = null;
if (typeof window.onload == 'function')
onloadbeforegradingsearchjs= window.onload;
function adddemo()
{
    window.onload = function()
    {
        if (onloadbeforegradingsearchjs!=null)
            onloadbeforegradingsearchjs();
        demo0();
    }
}
function restrict(an)
{
    var sn = retrv(0,2);  
    var allow = cangradeall[sn + '@' + an];
   
    if (!allow)
    {
       document.form1.displayformat.selectedIndex = 1;
    }
    else
    {
       document.form1.displayformat.selectedIndex = 0;
    }
}
function changecourse()
{
    open('gradebyta.jsp', '_parent');
}

function hidefixed()
{
    olddosearch = dosearch;
    if (gradebyta)
    {
        var maintbl = document.getElementById('maintbl');
        let course = defaultRecord[1].replace(/!/,'');
      
        let semester = semestersel.options[semestersel.selectedIndex].text;
        semestersel.style.cssText = 'width:1px;visibility:hidden';
        maintbl.rows[0].cells[0].appendChild(semestersel);
        
        coursesel.style.cssText = 'width:1px;visibility:hidden';
        maintbl.rows[0].cells[0].appendChild(coursesel); 
        maintbl.rows[2].cells[2].innerHTML = course + "<span  style=float:right><a href=javascript:changecourse()>&bull;&bull;&bull;&nbsp;&nbsp;&nbsp;</a></span>";
        maintbl.rows[2].cells[2].style.color = "#DDCC11";
        maintbl.rows[2].cells[2].style.fontWeight = "700";
        maintbl.rows[1].cells[2].innerHTML = semester;
        maintbl.rows[1].cells[2].style.color = "#DDCC11";
        maintbl.rows[1].cells[2].style.fontWeight = "700";
         
      
 
       for (var j=sessionsel.options.length-1; j>=0; j--)
       {
           if (sessionsel.options[j].value.indexOf(enteredsn)<0)
               sessionsel.options[j].text = textmsg[16];
           else 
               sessionsel.selectedIndex = j;
            
       } 
      
        dosearch = function()
        {
            if (retrv(0,0)!=defaultRecord[0].replace(/[^0-9]/g,''))
            {
                setv(0,0,defaultRecord[0].replace(/[^0-9]/g,''));
            }  
            if (retrv(0,1)!=defaultRecord[1].replace(/!/,''))
            {
                setv(0,0,defaultRecord[1].replace(/!/,''));
            } 
           
            if (retrv(0,2).indexOf(defaultRecord[2].replace(/!/,''))<0)
            {
                myprompt(textmsg[207]);
                sessionsel.focus();
                return;
            } 
            let j = sessionsel.selectedIndex;
            let anony = anonymous[j];
            if (assignsel.selectedIndex == 0)
            {
                myprompt(textmsg[885]);
                assignsel.focus();
                return;
            }
            if (cangradeall[retrv(0,2) + "@" + retrv(0,3)] == false || anony == 1)
                document.form1.displayformat.selectedIndex = 1;
            showastatus();
            let tnow = ~~((new Date()).getTime()/1000);
            if (document.form1.Status.selectedIndex == 3 )
            {
                updateQuery = updateQueryc;
                document.form1.StudentId.value = document.form1.StudentName.value = document.form1.Content.value = document.form1.Comment.value = '';
                modifyfeedback(true);
            }
            else if (sessionsel.options[sessionsel.selectedIndex].value.includes(',') || hascompound===false)
            {
                updateQuery = updateQueryt.replace(/..CURRENT_TIME../,''+tnow);
            }
            else
            {   
                updateQuery = updateQuerys.replace(/..CURRENT_TIME../,''+tnow);
                modifyfeedback(false);
            }
            olddosearch();
            
        };
    }
    else
    {
        dosearch = function()
        {
            showastatus();
            let tnow = ~~((new Date()).getTime()/1000);
            if (document.form1.Status.selectedIndex == 3 )
            {
                updateQuery = updateQueryc;
                document.form1.StudentId.value = document.form1.StudentName.value = document.form1.Content.value  =document.form1.Comment.value = '';
                modifyfeedback(true);
            }
            else if (sessionsel.options[sessionsel.selectedIndex].value.includes(',') || hascompound==false)
            {
                updateQuery = updateQueryt.replace(/..CURRENT_TIME../,''+tnow);
            }
            else
            {   
                updateQuery = updateQuerys.replace(/..CURRENT_TIME../,''+tnow);
                modifyfeedback(false);
            }
            olddosearch();
        };
    }
}
function modifyfeedback(b)
{
    let feed = document.thisform.feed;
    if (typeof feed == 'undefined')
    {
        if (b == true) 
        {
            feed = document.createElement('input');
            feed.type='hidden';
            feed.name= 'feed';
            feed.value = '1';
            document.thisform.appendChild(feed);
        }
    }
    else
    {
        if (b == false)
            document.thisform.removeChild(feed);
    }
}
 
var key2content = [];

function demo0()
{
    var x = document.createElement('input');
    x.className = 'BlueButton';
    x.type = "button";
    
    x.style.width= Math.round(charwidthrate()*font_size) + 'px';
    x.style.overflow = 'display';
    x.value = textmsg[1839];
    x.style.margin = "0px 0px 0px 0px";
    x.onclick = demo;
    var tbl = document.getElementById('buttons');
    var r = tbl.rows[0];
    r.cells[0].align='center';
    r.cells[1].align='center';
    var c = r.insertCell(-1);
    c.align='center';
    c.appendChild(x);
    tbl.cellSpacing = "2";
    tbl.width = null;
    //document.thisform.savebtn1.parentNode.appendChild(x);
    if (ele(0,0).style.visibility == 'hidden')
    {
        demotasks = [
    ['democursor2(sessionsel,3)', 500],
    ['demoheight(0.7);sessionsel.selectedIndex=1', 1500],
    ['demoheight();democursor2(assignsel,3)', 500],
    ['demoheight(0.7);assignsel.selectedIndex=1', 1500],
    ['demoheight();democursor2(ele(0,6),3)', 500],
    ['demoheight(0.7);ele(0,6).selectedIndex=2', 2000],
    ['demoheight();democursor2(ele(0,6),3)', 500],
    ['demoheight(0.7);ele(0,6).selectedIndex=2', 2000],
    ['demoheight();democursor2(document.form1.displayformat,3)',500],
    ['demoheight(0.7);document.form1.displayformat.selectedIndex=0', 1000],
    ['demoheight();democursor2(document.thisform.savebtn,2)', 500],
    ['demoheight(0.7);dosearch()',2000],
    ['demoheight();democursor2(230,200)', 500],
    ['demoremovesim()', 1500] 
];
    }
}

demotasks = [
    ["democursor2(ele(0,0),3)", 0],
    ['democursor2(ele(0,1),3)',  2000],
    ['demoheight(0.7);ele(0,1).selectedIndex=1', 1000],
    ['demoheight();democursor2(sessionsel,3)', 500],
    ['demoheight(0.7);sessionsel.selectedIndex=1', 1500],
    ['demoheight();democursor2(ele(0,6),3)', 500],
    ['demoheight(0.7);ele(0,6).selectedIndex=2', 2000],
    ['demoheight();democursor2(document.form1.displayformat,3)',500],
    ['demoheight(0.7);document.form1.displayformat.selectedIndex=0', 1000],
    ['demoheight();democursor2(document.thisform.savebtn,2)', 500],
    ['demoheight(0.7);dosearch()',2000],
    ['demoheight();democursor2(230,200)', 500],
    ['demoremovesim()', 1500] 
];
//document.thisform.action = 'Echo';
function type1()
{
    demotasks = [
    ['demoinitcursor();democursor2(document.form1.displayformat,3)',500],
    ['demoheight(0.7);document.form1.displayformat.selectedIndex=1', 1000],
    ['demoheight();democursor2(document.thisform.savebtn,2)', 500],
    ['demoheight(0.7);dosearch()',2000],
    ['demoheight();democursor2(230,200)', 500],
    ['demoremovesim()', 1500] 
    ];
    
    demo();
}
 
 
 
 
