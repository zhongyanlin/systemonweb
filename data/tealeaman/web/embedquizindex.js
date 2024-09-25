 var clicked = false;
 var MAXN = 50;
 var ranges = new Array(numcourses);
 var starts = new Array(numcourses);
 var dues = new Array(numcourses);
 var weekdays = textmsg[830].replace(/,/g,'');
 var weekdays1 ="NMTWRFS" ;
 
  var dt = new Date();
  var nowsec =  dt.getTime() + timenowsec;
  dt = new Date(nowsec);
  var dayw = weekdays.charAt(dt.getDay());
  var dayw1 = weekdays1.charAt(dt.getDay());
  
 function pad2(x)
 {
     if (x < 10) return '0' + x;
     return ''+x;
 }
 function makenm(l )
 {
     var d = new Date(l*1000);
     var j = weekdays.charAt(d.getDay());
     return [j, pad2(d.getMonth() + 1) + pad2(d.getDate())];
 }
 
 var startk = 0;
 var oldd = null;
function retrv(ts, dayw,dayw1, d)
{
   if (oldd!=null && d.getTime()!=oldd.getTime())
   {
       startk = 0;
   }
   
   var  k = ts.indexOf(dayw, startk);
   if (k==-1) k = ts.indexOf(dayw1, startk);
   if (k == -1)
   {
       startk = 0;
       return null;
   }
   else
   {
       startk = k + 1;
   }
   while (k < ts.length && (weekdays.indexOf(ts.charAt(k))>=0 || weekdays1.indexOf(ts.charAt(k))>=0 ) ) k++;
   if (k == ts.length) return null;
   var l = k;
   while (k < ts.length && (weekdays.indexOf(ts.charAt(k))< 0 &&  weekdays1.indexOf(ts.charAt(k))<0 ) ) k++;
   
   var y = ts.substring(l, k).replace(/^[ ]*/,'').replace(/[ ]*$/,'');
   
   var perd = y.split(/[^0-9]+/);
   if (perd.length<4) return null;
   var z = new Array(4);
   
   for (var i=0; i < 4; i++)
       z[i] = parseInt(perd[i].replace(/ /g,'').replace(/^0/,''));
   var ds = new Date(d.getTime());
   
   ds.setHours(z[0], z[1], 0, 0);
    
   var dd = new Date(d.getTime());
   
   dd.setHours(z[2], z[3], 0, 0);
   oldd = d;
   //if (dd.getTime() >= d.getTime())
   {
      return [Math.round(ds.getTime()/1000),
              Math.round(dd.getTime()/1000)+900];
   }
   //return null;    
}
var nowi = -1, nowN = -1;
var MN = new Array(); 
 function schedule()
{
   if (semester != currentSemester) return;
   for (var i=0; i < numcourses; i++)
   {
       starts[i] = new Array();
       dues[i] = new Array();
       var d = new Date();
       var l = d.getTime()  - 25*3600000;
       var l1 = l/1000+365*24*3600;
       d = new Date(l);
       var N = 0;
      
       while (N < MAXN && d.getTime()/1000 < l1)
       {
           var wd = d.getDay();
           var dayw = weekdays.charAt(wd);
           var dayw1 = weekdays1.charAt(wd);
           var se = retrv(timeslot[i], dayw,dayw1, d)
           if (se == null)
           {
               d = new Date(d.getTime() + 24*3600000);
               continue;
           }
           if (se[1] <= (new Date()).getTime()/1000)
           {
               d = new Date(d.getTime() + 24*3600000);
               continue;
           } 
           else if (se[0] <= (new Date()).getTime()/1000)
           {
               nowN = N; nowi = i;
            
           }
           starts[i][N] = se[0];
           dues[i][N] = se[1];
           N++;
       }
       N = starts[i].length;
       starts[i][N] = ~~(  (new Date()).getTime()/1000);
       dues[i][N] = starts[i][N]+3600;
       MN[i] = N+1;
       
   }
}
 
schedule();
 






function debg()
{
    open("follows.jsp?x=mycourse");
}

function switchs(sel)
{
   var i = sel.selectedIndex;
   var j = 0; for (; j < sel.options.length && sel.options[j].value != currentSemester;j++);
   var newsemester = '0';
   if (i > j) newsemester = '1';
   //enableelements(false);
   formnewaction(f1,"embedquizindex.jsp?newsemester=" + newsemester);
   f1.target = parent.frames[0].name;
   f1.semester.disabled = false;
   f1.mode.disabled = false;
   visual(f1);
   f1.submit();
}

var f1 = document.form1;
var ll = 0;
for (; ll < f1.semester.options.length &&
f1.semester.options[ll].value!=semester;ll++);
f1.semester.selectedIndex = ll;

function inside(arr, x)
{
   if (arr!=null)
   for (var i=0; i < arr.length; i++)
       if (x==arr[i]) return true;
   return false;
}
function swapmode()
{
    formnewaction(document.form1, "assignmentindex.jsp");
    document.form1.target = window.name;
    formnewaction(document.form1);
    visual(document.form1);
document.form1.submit();
}
for (var i=0; i < numcourses; i++)
{
    var k =0;
    for (var j=0; j <numassigns[i]; j++ )
       if(  AN[i][j]!='')
   {    
       assign[i].options[k] = new Option(AN[i][j], AN[i][j]);
       assign[i].options[k++].className = 'selectoption';
   }
   // if (semester == currentSemester)
    {
        ranges[i] = new Array();
        var kk = -1;
        var old = "";
        var jj = 1;
        for (var l=0; l < MN[i] ; l++)
        {
            if ( k>=40 && l<MN[i]-1)continue;
            var xy = makenm(starts[i][l] );
            var nm = xy[1];
 
            if (xy[1] == old)
            {
                nm = xy[1] +  (jj++);
            }
            else
            {
               nm = xy[1];
               jj = 1;
            }
            var zm = xy[0]+ " " + xy[0];
            nm = sess[i] + "-" + nm;
            var xx = textmsg[114];
            if ( l == MN[i]-1)
                xx = textmsg[1197];
            if ( inside(AN[i], nm) == false)
            {
                assign[i].options[k] = new Option(nm +"(" + xx +")", nm);
                assign[i].options[k].className = 'selectoption';
                if (kk < 0) kk = k;
                ranges[i][k] = l;
                k++;
            }
            old = xy[1];
        }
        assign[i].selectedIndex = kk;
    }
}
var activecid = -1;
function submitform(sl, index)
{
      activecid = index;
      f1.course.value = cid[index];
      f1.coursetitle.value = ctitle[index];
      f1.sessionname.value = sess[index];
      f1.assignname.value = sl.options[sl.selectedIndex].value;
      sindex[index] = sl.selectedIndex;
      formnewaction(f1,'embedquiz.jsp');
      var k = ranges[index][sl.selectedIndex];
      
       if ( 1==2 ) //sl.selectedIndex == sl.options.length-1)
      {
          if (!confirm('Do not use this item unless you are doing a test on the software or your class time is changed temproarily. Continue? '))
          {
              sl.selectedIndex = 0;
              return;
          }
      }
      
      if (k==null || isNaN(starts[index][k]))
      {
          f1.start.value = '';
          f1.quizdue.value = '';
      }
      else
      {
          f1.start.value = starts[index][k];
          f1.quizdue.value = dues[index][k];
      }
      f1.target = parent.frames[1].name;
      for (var i = 0; i < numcourses; i++)
      {
         if (assign[i] != sl)
         {
             sindex[i] = 0;
             assign[i].selectedIndex = 0;
         }
      }
      if (typeof changeFlag == 'function')
       changeFlag(cid[index],false);
     visual(f1);
 f1.submit();
}
function getActivesel()
{
    return assign[activecid];
}
function didnew()
{
   var  index  = activecid ;
   var k = ranges[index][sindex[index]];
   starts[index][k] = '';
   dues[index][k] = '';
}
function refreshIndex()
{
    f1.action = "embedquizindex.jsp";
    f1.target = window.name;
    formnewaction(f1);
   visual(f1);
 f1.submit();
}

function init()
{
    for (j = 0; j < numcourses ; j++)
    {
      var dd = document.getElementById("course" + j);
      if (dd!=null)
      dd.style.width = (dd.parentNode.offsetWidth-2) + "px";
    }
    
    var x = null;
    if (typeof(parent.frames[1].getinitdata) != 'undefined')
       x = parent.frames[1].getinitdata();
   if (x==null || x[0] == null)
       parent.frames[1].document.writeln('<html><body style="background-color:'+  DBGCOLOR + '" > <br>' + msg468 + '<br>');
   else
   {
      var cd = x[0];
      var ass = x[1];
      var sn = x[2];
      var j = 0; for (;j<cid.length; j++) 
          if (cid[j]==cd && sessa[j] == sn) 
             break;
      for (var k=0; k < document.form1.elements.length; k++) 
          if (document.form1.elements[k].name == 'assignname'+j) 
             break;
      var sel = document.form1.elements[k];
      var l = 0; 
      for (; l < sel.options.length; l++) 
          if (sel.options[l].value == ass) 
             break;
      sel.selectedIndex = l;
      submitform(sel, j);
      parent.setinitdata();
   }
   var homeico = document.getElementById('homeico');
   if (homeico!=null)
       homeico.innerHTML = homestr1();
}


var copied = null;
function getCopied()
{
    return copied;
}
function setCopied(s)
{
    copied = new Array();
    for (var i=0; i < s.length; i++)
    copied[i] = s[i];
}
function nullCopied(s)
{
    copied = null;
}
function openinit(courseid,assname)
{
    
    var j =0; for (; j < cid.length; j++) if (courseid==cid[j]) break;
     
    var sl = formselementbyname(f1,'assignname' + j);
    if (sl == null) return;
    var i=0;
    for (;i < sl.options.length; i++)
    {
        if (sl.options[i].value == assname)
            break;
    }
    
    if ( i < sl.options.length)
    {
        sl.selectedIndex = i;
      
        submitform(sl, j);
    }
    
}
window.parent.document.title = textmsg[1291];
init();
 


