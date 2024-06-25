if (ss['course'] == '')
{
   var xx = localStorage['gradeproj'];
   if (xx!=null)
   {
       var SS = JSON.parse(xx);
       ss['course'] = document.f00.course.value = SS['course'];
       ss['assignname'] = document.f00.assignname.value = SS['assignname'];
       ss['sessionname']  = document.f00.sessionname.value =  SS['sessionname'];
       ss['questionnum'] = SS['questionnum'];
       document.f00.questionnum.selectedIndex = parseInt(ss['questionnum']);
   }
}
else
{
   localStorage['gradeproj'] = JSON.stringify(ss); 
}

var form;
var ii = 0;
var loop = false;
var tm = 0;
document.getElementById('order1').innerHTML = '/' + N; 
document.getElementById('order').innerHTML = '0';
var hints = {course:'e.g. 35-121', sessionname:'N1,N2',assignname:'Homework1',sid:'1234567', grade:'<=60',comment:'Error',content:'class Car',tester:'GradeJava'};
function clearhint(t)
{
   let x = ('|'+t.style.color +'|').replace(/\s/g,'');
   if (   x ==  '|rgb(102,102,102)|' || x == '|#666666|')
   {
       t.style.color = '#000000';
       t.value = '';
       t.style.fontWeight = '700';
   }
}
 
let loopj = 0;
var gall = document.f00.gradeall.value;
var compall = textmsg[1887].replace(/@.*/,'');//+textmsg[1849].replace(/@.*/,'');
var resume = textmsg[821];
var pause = textmsg[820];
function doall()
{
   var k = document.f00.basedon.selectedIndex;
   let v = document.f00.gradeall.value;
   if (v == pause)
   {
       loop = false;
       document.f00.gradeall.value = loopj<N? resume:( k == 0?compall:gall);
   }
   else if ( k==1 && (v == resume || v == gall))
   {
       loop=true;
       document.f00.gradeall.value = pause;
       if (loopj == N)
       {
           document.f00.gradeall.value = gall;
           return;
       }
       else 
       {
           test(loopj);
       }
   }
   else if ( k==0 && (v == resume || v == compall))
   {
       loop = true;
       document.f00.gradeall.value = pause;
       if (loopj == N)
       {
           document.f00.gradeall.value = compall;
           return;
       }
       for (let k0=0; loop && loopj < N && k0 < 4; loopj++,k0++)
       {
              compare(loopj);
       }
       document.f00.gradeall.value = pause;
       
       
   }
}
function grade1(i)
{
    var k = document.f00.basedon.selectedIndex;
    
    if (k==0)
    {
        if (loop)
        {
            for (let j=0; j < N; j++)
            {
                compare(j);
            }
        }    
        else     
           compare(i);
    }
    else
        test(i);
}
document.f00.saveall1.value = textmsg[130];
var v0 = document.f00.gradeall.value;
function changebased()
{
    var k = document.f00.basedon.selectedIndex;
    if (k==0)
        document.f00.gradeall.value = compall;//+textmsg[1849].replace(/@.*/,'');
    else
         document.f00.gradeall.value = v0; 
    for (let i = 0; i < N; i++)
    {
        if (k==0) 
           document.getElementById('test' + i).value = compall; 
        else
           document.getElementById('test' + i).value = testrun; 
    }    
}
function puthint(t)
{
    if (t.value.replace(/\s/g,'') == '')
    {
        t.style.color = '#666666';
        t.value ='e.g ' + hints[t.name];
        t.style.fontWeight = '300';
    }
}
for (let i=0; i < document.f00.elements.length ; i++)
{
    let ele = document.f00.elements[i];
    if (ele.tagName.toLowerCase() =='input' && ele.type.toLowerCase() !='button')
    {
        if (ele.name!='tester') 
            ele.style.width = '160px';
        if (ss[ele.name] =='')
        {
            ele.value = 'e.g. ' + hints[ele.name];
            ele.style.color = '#666666';
            ele.style.fontWeight = '300';
             
        }
        else 
        {
            if (ss[ele.name]!=null) 
                ele.value = ss[ele.name];
            ele.style.color = '#000000';
            ele.style.fontWeight = '700';
             
        }
    }
    else if (ele.tagName.toLowerCase() =='select' )
    {
        ele.selectedIndex = parseInt(ss[ele.name]);
        ele.style.color = '#000000';
        ele.style.fontWeight = '700';
     }
}
if (N > 0)
{
   if (document.getElementById('fm0').content.value.includes("public class"))
       document.f00.tester.value =  "GradeJava";
   else
       document.f00.tester.value = "GradePython";
   document.f00.tester.style.color = 'black';
   document.f00.tester.style.fontWeight = '700';
   document.getElementById('ans0').rows[0].cells[0].style.width = (document.getElementById('maintbl0').rows[0].cells[0].offsetWidth) + 'px';
   document.getElementById('order').parentNode.style.width 
   = (document.getElementById('maintbl0').rows[0].cells[0].offsetWidth-5) + 'px';
   var tbl = document.getElementById('sel');
   tbl.rows[0].cells[4].style.width = tbl.rows[0].cells[1].offsetWidth + 'px';
   tbl.rows[1].cells[3].style.width = tbl.rows[1].cells[0].offsetWidth + 'px';
   tbl.rows[2].cells[3].style.width = tbl.rows[2].cells[0].offsetWidth + 'px';
   tbl.rows[3].cells[3].style.width = tbl.rows[3].cells[0].offsetWidth + 'px';
   tbl.rows[4].cells[3].style.width = tbl.rows[4].cells[0].offsetWidth + 'px';
   tbl.rows[5].cells[3].style.width = tbl.rows[5].cells[0].offsetWidth + 'px';
}
 
function whatbased()
{
    if (typeof(document.fm)!='undefined')
    {
        if (ans.includes('public class'))
            document.f00.basedon.selectedIndex = 0;
        else 
            document.f00.basedon.selectedIndex = 1;
        changebased();
    }
}
whatbased();
changebased();
if (ss['attach'] == '1')
   document.f00.attach.selectedIndex = 1;
else if (ss['attach'] == '2')
   document.f00.attach.selectedIndex = 2; 
else  document.f00.attach.selectedIndex = 0; 
if (ss['questionnum'] != '')
   document.f00.questionnum.selectedIndex = parseInt(ss['questionnum']);
else  document.f00.questionnum.selectedIndex = 0; 
if (ss['semester'] != null)
{
    var j = 0;
    for (; j < document.f00.semester.options.length-1 && document.f00.semester.options[j].value!=ss['semester']; j++);
    document.f00.semester.selectedIndex = j; 
}
  
var msg; 
document.f00.questionnum.selectedIndex = qn;
document.f00.semester.style.fontWeight = '700';
document.f00.questionnum.style.fontWeight = '700';
document.f00.attach.style.fontWeight = '700';
  
function validate(f)
{
    if ( (''+f.course.style.color).replace(/\s/g,'') == 'rgb(102,102,102)' )
    {
        alert('Course can not be blank'); 
        f.course.focus();
        return false;
    }
     if (  (''+f.assignname.style.color).replace(/\s/g,'') == 'rgb(102,102,102)' )
    {
        alert('Assignment can not be blank'); 
        f.assignname.focus();
        return false;
    }
     if ( (''+f.sessionname.style.color).replace(/\s/g,'') == 'rgb(102,102,102)')
    {
        alert('Session   can not be blank'); 
        f.sessionname.focus();
        return false;
    }
    return true;
}
function choose()
{
     if (validate(document.f00) == false) return;
     for (var j=0; j < document.f00.elements.length; j++)
    {
        var ele = document.f00.elements[j];
        if (ele.tagName.toLowerCase() == 'input' && (''+ele.style.color).replace(/\s/g,'') == 'rgb(102,102,102)')
            ele.value = '';
    }
    document.f00.submit();
}
function compare(i)
{
    form = document.getElementById("fm" + i);
    if (ss['questionnum'] == '0')
    {
        form.comment.value = " ";
        var sc = 0;
        let code = document.fm.content.value;
        sc = Math.ceil((code.length - similarity1(form.content.value, code)) * fullscore/code.length);
        form.assess.value = '';
        form.grade.value = sc;
        document.getElementById('order').innerHTML = '' + (i+1); 
        return;
    }
    form.comment.value = '';
    var sc = similarity1(form.content.value, document.fm.content.value);  
    sc =  Math.ceil((document.fm.content.value.length - sc) * subfull/document.fm.content.value.length);
    form.grade.value = '' + (parseFloat(form.grade.value) - parseFloat(form.score.value) + sc);
    form.score.value = ''+ sc;
    var x = [];
    if (form.assess.value!='')
         x = new CSVParse(form.assess.value, '|',',',';').nextMatrix();
    let hit = false;
    for (let k=0; k < x.length; k++)
    {
          if (x[k][0] == ss['questionnum'])
          {  
              x[k][1] = ''+subfull;
              x[k][2] = ''+sc; 
              hit = true;
              x[k][3] = 'compared';
              break;
          }
    }
    if (hit == false)
        x[x.length] = [''+ss['questionnum'], ''+ subfull, ''+sc, 'compared'];
    form.assess.value = '';
    for (let k=0; k < x.length; k++)
    {
         if (k>0) form.assess.value += ';';
         let w = x[k][3];
         if (w == null) w = '';
         else if (w.includes(',') || w.includes(';') || w.includes('|')) 
             w = '|' + w.replace(/\\|/g,'||') +'|';
         form.assess.value += x[k][0] + ',' + x[k][1] + ',' + x[k][2] + ',' + w; 
    }
    document.getElementById('order').innerHTML = '' + (i+1);
    
   // else if (i < N- 1) compare(i+1);
    //else saveall();
}
 
function test(i)
{
    
    for (var j=0; j < document.f00.elements.length; j++)
    {
        var ele = document.f00.elements[j];
        if (ele.tagName.toLowerCase() == 'input')
           ss[ele.name] = ele.value;
        else if (ele.tagName.toLowerCase() == 'select')
           ss[ele.name] =  ele.selectedIndex; 
    }
    if (i == 0 || i =='')
    {
      //  localStorage['gradeproj'] = JSON.stringify(ss);
    }
    ii = i;
    form = document.getElementById("fm" + i);
    msg = document.getElementById("msg" + i);
    if ( ''+i!='') 
    {
        msg.style.height = (form.offsetHeight - 60) + 'px';
        msg.style.margin =  '5px 0px 5px 0px';
        msg.style.border = '1px #666666 solid';
    }
    let fd = new FormData();
    fd.append("content", form.content.value);
    fd.append("semester",  ss['semester']);
    fd.append("course",  ss['course']);
    fd.append("assignname", ss['assignname']);
    fd.append("questionnum", ss['questionnum']);
    fd.append("sid", form.sid.value);
    let url = ss['tester']; url = document.f00.tester.value;
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
            if ( '' + ii != '' && (new Date()).getTime() - tm > 60000)
            {
                form.comment.value = "contains infinite loops.";
            }
            var y = xmlhttp.responseText.replace(/^[ |\n|\r|\t]+/,'').replace(/[ |\n|\r|\t]+$/,'');
            msg.innerHTML = y.replace(/\n/g,'<br>');
            msg.style.border = '1px #666666 solid';
            if (''+ii != '')
            {  
                proc(y);
                document.getElementById('order').innerHTML = '' + (ii+1);
                if (loop && ii < N-1)
                    test(ii+1);
            }
            else
            {     
               ans = y;
               whatbased();
            }
            closeprompt();
        }
    };
    let xx = new URLSearchParams(fd).toString();
    let xy = findPositionnoScrolling(form.content);
    let left = xy[0] + 100;
    let top = xy[1];
    myprompt('<img id=progress src=image/progress.gif>',null,null,'.....'); 
    promptwin.style.cssText = '';
    promptwin.className = 'rundisk';
    promptwin.style.left = left + 'px';
    promptwin.style.top = top + 'px';
    tm = (new Date()).getTime();
    xmlhttp.open('POST', url, true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send(xx); 
}
function saveall()
{
    var xs = [];
    for (let i=0; i < N; i++)
    {
        form = document.getElementById("fm" + i); 
        xs.push( form.sid.value + ',' + form.grade.value + ',"' + form.comment.value.replace(/"/g,'""') + '","' + form.assess.value.replace(/"/g,'""') + '"');
    }
    let fd = new FormData();
    fd.append("semester", ss['semester']);
    fd.append("course", ss['course']);
    fd.append("assignname", ss['assignname']);
    fd.append("way", "save2");
    fd.append("content", xs.join(';'));
    let url = document.location.toString().replace(/\.jsp.*/,'.jsp');
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
            var y = xmlhttp.responseText.replace(/^[ |\n|\r|\t]+/,'').replace(/[ |\n|\r|\t]+$/,'');
            myprompt(y);
            return;
        }
    };
    let xx = new URLSearchParams(fd).toString();
    let xy = findPositionnoScrolling(document.f00);
    let left = xy[0] + 100;
    let top = xy[1];
    
    myprompt('<img id=progress src=image/progress.gif>',null,null,'.....'); 
    promptwin.style.cssText = '';
    promptwin.className = 'rundisk';
    promptwin.style.left = left + 'px';
    promptwin.style.top = top + 'px'; 
    xmlhttp.open('POST', url, true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send(xx); 
}
function proc(t)
{
    if (ss['questionnum'] == '0')
    {
        if (t.includes("Compilation") || t.indexOf("Error: ") == 0)
        {
            form.comment.value = "Failed compilation";
            var m =   form.content.value.replace(/[^\n]/g,'').length ;
            if (form.comment.value.length<3) form.comment.value = "Error in codes not executable";
            form.assess.value = '';
            form.grade.value = 0;
            msg.innerHTML = t.replace(/\r\n/g,'<br>').replace(/\n/g,'<br>').replace(/\^\s/g,'<br>');
            return;
        }
        form.comment.value = "Executed";
        var sc = Math.ceil((ans.length - similarity(t, ans)) * fullscore/ans.length);
        form.assess.value = '';
        form.grade.value = sc;
        msg.innerHTML = t.replace(/\r\n/g,'<br>').replace(/\n/g,'<br>').replace(/\^\s/g,'<br>');
        return;
    }
    if (t.includes("Compilation") || t.indexOf("Error: ") == 0)
    {
            form.comment.value += ss['questionnum'] +  ": Failed compilation;";
            var m =   form.content.value.replace(/[^\n]/g,'').length ;
            if (form.comment.value.length<3) form.comment.value = "Error in codes not executable";
            msg.innerHTML = t.replace(/\r\n/g,'<br>').replace(/\n/g,'<br>').replace(/\^\s/g,'<br>');
            form.grade.value = parseFloat(form.grade.value) - parseFloat(form.score.value);
            form.score.value = 0;
    }
    else
    {
          form.comment.value += ss['questionnum'] +  ": executed;";
          var sc = similarity(t, ans);  
          sc =  Math.ceil((ans.length - sc) * subfull/ans.length); 
          form.grade.value = parseFloat(form.grade.value) - parseFloat(form.score.value) + sc;
          form.score.value = sc;
          {
              var x = [];
              if (form.assess.value!='')
                  x = new CSVParse(form.assess.value, '|',',',';').nextMatrix();
              let hit = false;
              for (let k=0; k < x.length; k++)
              {
                  if (x[k][0] == ss['questionnum'])
                  {  
                      x[k][1] = ''+subfull;
                      x[k][2] = ''+sc; hit = true;
                      x[k][3] = t;
                      break;
                  }
              }
              if (hit == false)
                  x[x.length] = [''+ss['questionnum'], ''+ subfull, ''+sc, t];
              form.assess.value = '';
              for (let k=0; k < x.length; k++)
              {
                 if (k>0) form.assess.value += ';';
                 let w = x[k][3];
                 if (w == null) w = '';
                 else if (w.includes(',') || w.includes(';') || w.includes('|')) 
                     w = '|' + w.replace(/\\|/g,'||') +'|';
                 form.assess.value += x[k][0] + ',' + x[k][1] + ',' + x[k][2] + ',' + w; 
              }
          }
    }
    msg.innerHTML = t.replace(/\r\n/g,'<br>').replace(/\n/g,'<br>').replace(/\^\s/g,'<br>');
    
}
function save(i)
{
    ii = i;
    form = null;
    if (''+i == 'p')
        form = document.f00;
    else if (''+i == '')
        form = document.fm;
    else 
        form = document.getElementById("fm" + i);
    
    let fd = new FormData();
    fd.append("semester", ss['semester']);
    fd.append("course", ss['course']);
    fd.append("assignname", ss['assignname']);
    if (''+i!='' && !isNaN(''+i))
    {
        fd.append("sid", form.sid.value);
        fd.append("grade", form.grade.value);
        if (form.comment.value.length> 80) form.comment.value = form.comment.value.substring(0,80);
        fd.append("comment", form.comment.value);
        fd.append("assess", form.assess.value);
        fd.append("way", "save");
    }
    else if (''+i=='p')
    {
        if (document.f00.publish1.value == closet)
        {
            fd.append("status", "2"); 
            document.f00.publish1.value = lbls[21];
        }
        else
        {
            fd.append("status", "3"); 
            document.f00.publish1.value = closet;
        }
        fd.append("sessionnames", document.fm.sessionnames.value); 
        fd.append("way", "save1");
    }
    else
    {   
        fd.append("content", form.content.value);
        fd.append("questionnum",  ss['questionnum']);
        fd.append("sessionnames", form.sessionnames.value); 
        fd.append("way", "save0");
    }
    let url = document.location.toString().replace(/\.jsp.*$/,'.jsp');
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
            var y = xmlhttp.responseText.replace(/^[ |\n|\r|\t]+/,'').replace(/[ |\n|\r|\t]+$/,'');
             myprompt(y);
            if (''+ii=='' || ''+ii=='p')
            {
                return;
            }
            document.getElementById('order').innerHTML = '' + (ii+1);
             
        }
    };
    let xx = new URLSearchParams(fd).toString();
    let xy = findPositionnoScrolling(form.content);
    let left = xy[0] + 100;
    let top = xy[1];
     
    myprompt('<img id=progress src=image/progress.gif>',null,null,'.....'); 
    promptwin.style.cssText = '';
    promptwin.className = 'rundisk';
    promptwin.style.left = left + 'px';
    promptwin.style.top = top + 'px'; 
    xmlhttp.open('POST', url, true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send(xx); 
}
var oldonloadgp = onload;
onload = function()
{
    oldonloadgp(); 
    if (document.f00.tester.value == '') 
        document.f00.tester.value = "GradePython";
    for (var n = 0; n < N; n++)
    {
        form = document.getElementById("fm" + n);
        var cont = form.content.value;
        var kk = cont.indexOf('package');
        if (kk == -1 || kk > 100) continue;
        var kkk = cont.indexOf('import ',kk);
        if (kkk ==-1 || kkk > 200) continue;
        form.content.value = cont.substring(kkk);
        form.content.parentNode.previousSibling.appendChild(document.createTextNode('deleted package'));
    }
}
var mp =null;
var ansarr = null;
function sim0(x)
{ 
    var z = [];
     
    var y = x.replace(/[\n|\r|\t| ]+/g,' ').split(/(?=[a-z|A-Z]+)/); 
    for (let t of y)
    {
        let w = t.replace(/\W.*$/,'');
        let q = t.replace(/^\w+/,'');
        let j = mp.length;
        mp[w] = String.fromCharCode(256+j);;
        z.push(mp[w]);
        z.push(q);
    }
    return z.join('');
}
function sim1(x)
{ 
    var z = [];
    var y = x.replace(/[\n|\r|\t| ]+/g,' ').split(/(?=[a-z|A-Z]+)/); 
    for (let t of y)
    {
        let w = t.replace(/\W.*$/,'');
        let q = t.replace(/^\w+/,'');
        if (mp[w] == null)
        {
            let j =  mp.length;
            mp[w] = String.fromCharCode(256+j);
        }
        z.push(mp[w]);
        z.push(q);
    }
    return z.join('');
}
 
var similarity1 = function(x,y) 
{
    if (ansarr == null)
    {
        mp = [];  
        ansarr = sim0(y);
    }
    x = sim1(x);
    return  similarity(x,ansarr);
}
function publish()
{
    postopen('gradeproj.jsp', "semester,course,sessionnames,assignname".split(/,/),[ss['semester'],ss['course'],ss['sessionnames'],ss['assignname']])
}

