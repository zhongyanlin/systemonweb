var ml = document.form1;

if (sysonwebdb)
{ 
   document.form1.start.value = timestr(starttime);
   document.form1.end.value = timestr(endtime);
}

function setv(v){if (v.value=='') v.value=timestr(starttime);}  
function setv1(v){if (v.value=='') v.value=timestr(endtime);} 
function chq(v,i)
{   
    var tm = parseTime(v.value); 
   
    if (tm==null)
    {
        myprompt(textmsg[75] + " " + timeformat);
        v.focus();
        return;
    }
  
    if (i==1) 
       starttime = tm;
    else
    {
       endtime = tm;
         if (endtime < starttime)
        {
           myprompt('Ending time should be later than starting time');
        } 
       
    }
    addres(); 
}
function toall(txt)
{
  txt.value = removejs( txt.value);
  var extable =  ' TaskLang Apptables Backupfolder Ckunith Commandline Major DomainValue EvalQuestion Faq Fee Funblock Funlink Operation OperationType Role SigninPolicy SystemParam TimeSlot ';
  var len = ml.elements.length;
  var res = new Array( numtables );
  for (var i = 0; i < len; i++)
  {
      var e = ml.elements[i];

      if (e.name.indexOf("rest") == 0)
      {
          var tbl = ml.elements[i-1].value;
          var isone = (extable.indexOf(" " + tbl +" ") >= 0);
          var vl =  ( txt.value);
          if (isone && vl==' 1 = 2 ') vl = "";
          if (e.value=='') e.value = vl;
          else e.value += '  AND ' + vl;
      }
  }

}
 
function addres()
{
  
  var len = ml.elements.length;  
  var res = new Array( numtables ); 
  for (var i = 0; i < len; i++)  
  {                              
      var e = ml.elements[i];    
      if (e.name.indexOf("rest") == 0) 
      { 
          res[parseInt(e.name.substring(4))] = i;  
      }
  } 
  
  for (var i = 0; i < numtables; i++)
  { 
      
      var x = ml.elements[res[i]].parentNode.parentNode.cells[0].getElementsByTagName('input')[0].checked;
      
      if (!x) continue;
      if (ml.elements[res[i]].value=='')
      {
          ml.elements[res[i]].value =  'lastupdate>=' +  starttime + ' AND lastupdate<=' +  endtime; 
      }
      else if (ml.elements[res[i]].value.indexOf("lastupdate") < 0)
      {
          ml.elements[res[i]].value +=   ' AND lastupdate>=' +  starttime + ' AND lastupdate<=' +  endtime;
      } 
      else
      {   ml.elements[res[i]].value  =   ml.elements[res[i]].value.replace(/lastupdate>=[0-9]+/,
         'lastupdate>=' + starttime ).replace(/lastupdate<=[0-9]+/,'lastupdate<=' +  endtime);
      }
  }
} 
  
function selectit(j,txt)
{
   txt.value = removejs(txt.value)
   var len = document.form1.elements.length;
   for (var i=0; i < len; i++)
      if (document.form1.elements[i].name == 'rest' + j)
      {
          if (document.form1.elements[i].value.replace(/ /g,'')!='')
              document.form1.elements[i-1].checked = true;
          break;
      }
}

var aword = null; 
var tb = new Array(numtables);
var res = new Array(numtables);
 
function openwin()
{
  var sql = '';   
  var b = document.form1.check1.checked; 
  var ml = document.form1;     
  var len = ml.elements.length; 
   
  for ( var j = 0; j < numtables; j++)
  {
     tb[j] = '';
     res[j] = '';
  }
   
  for (var i = 0; i < len; i++)  
  {                              
      var e = ml.elements[i];    
      if (e.name.indexOf("checkbox") == 0) 
      {
          if (e.checked)
          {
              tb[parseInt(e.name.substring(8))] = e.value;
          }
      }
      else if (e.name.indexOf("rest") == 0) 
      {
          var j = parseInt(e.name.substring(4));
          if (e.value != '')
             res[j] = e.value;
          if (uid!='')
          {
          var x = e.parentNode.parentNode.cells[0].getElementsByTagName('input')[0].value;
         
          if (x == 'Session' && !sysadmin && !teachadmin)
          {
              if (res[j]!='') res[j] += " AND ";
              
              res[j] += " Session.instructor='" + uid + "'";
          }
          else if (x == 'Course'  && !sysadmin && !teachadmin)
          {
              if (res[j]!='') res[j] += " AND ";
              
              res[j] += " id IN (SELECT courseid FROM Session where instructor='" + uid + "')";
          }
          else if (x == 'Message'  && !sysadmin )
          {
              if (res[j]!='') res[j] += " AND ";
             
              res[j] += " (Message.rid='" + uid + "' OR Message.sid='" + uid + "')";
          }
          else if (x == 'Assignment'  && !sysadmin )
          {
              if (res[j]!='') res[j] += " AND ";
              
              res[j] += " Assignment.grader LIKE '%" + uid + "%'";
          }
          else if (x == 'Submission'  && !sysadmin )
          {
              if (res[j]!='') res[j] += " AND ";
             
              res[j] += "  CONCAT(Submission.assignname, ',',Submission.cource) IN (SELECT CONCAT(Assignment.name,',',Assignment.course) FROM Assignment WHERE grader LIKE '%" + uid  +"%')";
          }
          else if (x == 'Lecturenotes'  && !sysadmin )
          {
              if (res[j]!='') res[j] += " AND ";
             
              res[j] += " courseid IN (SELECT courseid FROM Session WHEERE instructor='" + uid + "')";
          }
          else if (x == 'Chatmsg'  && !sysadmin)
          {
              if (res[j]!='') res[j] += " AND ";
              
              res[j] += " courseid IN (SELECT courseid FROM Session WHEERE instructor='" + uid + "')";
          }
          else if (x == 'Registration'  && !sysadmin && !teachadmin)
          {
              if (res[j]!='') res[j] += " AND ";
             
              res[j] += " CONCAT(courseid,',',sessionname) IN (SELECT CONCAT(courseid,',',name) FROM Session WHEERE instructor='" + uid + "')";
          }
          else if (x == 'Announcement'  && !sysadmin && !teachadmin )
          {
              if (res[j]!='') res[j] += " AND ";
             
              res[j] += " uid='" + uid + "'";
          }
          
        }
      }
  }
  
  for (j = 0; j < numtables; j++)
  {
     if (tb[j] != '')
     {
          sql += tb[j];   
          if (res[j] != '')
              sql += " WHERE " + res[j];
          var def = parent.frames[0].passdef(tb[j]);
          var ind = def.indexOf("|");
          sql +=  ';' + def.substring(ind+1) + ';'; 
     }
  }
   
  document.form1.target = "w" + tstmp;
  formnewaction(document.form1,"DBTableBackup");
  document.form1.wcds.disabled = true;
  document.form1.selectsql.disabled = false;
  document.form1.selectsql.value = sql;
  visual(document.form1);
  document.form1.submit(); 
}

function chext(c)
{
    if (c.selectedIndex == 0)
        document.form1.extname.value = ".zip";
    else if (c.selectedIndex == 1)
        document.form1.extname.value = ".bak"; 
    else 
        document.form1.extname.value = ".sql"; 
}

function delimit(c1,def )
{
      var c2 = ')'; 
      var jj = 0; 
      while (jj < def.length && (def.charAt(jj) == ' ' || def.charAt(jj) == '\n'|| def.charAt(jj) == '\r') ) 
          jj++;
      if (jj == def.length || def.charAt(jj) != c1 ) 
      {
         aword = null; 
         return;
      }
      var m = ''; 
      jj++;
      for(; jj < def.length  && def.charAt(jj) != c2; jj++ ) 
      { 
         m += def.charAt(jj);
      }
      if (jj == def.length) 
      {
         aword = null;
      }
      else
      {
         aword = m ;
         def = def.substring(jj+1);
      }
}

function checkall()            
 {                              
    var b = document.form1.check1.checked; 
    var ml = document.form1;     
    var len = ml.elements.length;  
    for (var i = 0; i < len; i++)  
   {                              
      var e = ml.elements[i];    
      if (e.name.indexOf("checkbox") == 0) 
         e.checked = b; 
   } 
 }

function init()            
 {                              
    var b = document.form1.check1.checked; 
    var ml = document.form1;     
    var len = ml.elements.length;  
    for (var i = 0; i < len; i++)  
   {                              
      var e = ml.elements[i];    
      if (e.name.indexOf("checkbox") == 0 && (e.value=='Submission' || e.value=='Assignment' || e.value=='Announcement'
          || e.value=='Message'|| e.value=='Forum'|| e.value=='Subactivity' ||e.value=='Lecturenotes')) 
         e.checked = true; 
     
   } 
 }
init();
function resizeCont()
{     var wd = thispagewidth();
    
      wd -= 160 + font_size;
       
      if (wd < font_size*2)   wd = font_size*2;
      var len = ml.elements.length; 
       
      for (var i = 0; i < len; i++) 
      { 
         
         if (ml.elements[i].name.indexOf("rest") >= 0)
         {  
             ml.elements[i].size = wd/font_size*2-100; 
         } 
      } 
 }
 
 var droptableaswell = false;
 function dodelete()
{
  if (sysonwebdb)addres(); 
  var sql = '';
  var b = document.form1.check1.checked; 
  var ml = document.form1;     
  var len = ml.elements.length;  
  for ( var j = 0; j < numtables; j++)
  {
     tb[j] = '';
     res[j] = '';
  }
  for (var i = 0; i < len; i++)  
  {                              
      var e = ml.elements[i];    
      if (e.name.indexOf("checkbox") == 0) 
      {
          if (e.checked)
          {
              tb[parseInt(e.name.substring(8))] = e.value;
          }
      }
      else if (e.name.indexOf("rest") == 0) 
      {
          if (e.value != '')
             res[parseInt(e.name.substring(4))] = e.value;
      }
  } 
  for ( var j =  numtables - 1;  j>=0; j--)
  {
     if (tb[j] != '')
     {
          if (droptableaswell==false)
          {
            sql += "DELETE FROM " + tb[j] ;
            if (res[j] != '')
                sql += " WHERE " + res[j];
          }
          else
          {
             sql += "DROP TABLE " + tb[j];
          }
          sql +=  ';'; 
     }
  }
  formnewaction(document.form1, "Save");
  document.form1.target = 'w' + tstmp;
  document.form1.wcds.disabled = false;
  document.form1.selectsql.disabled = true;
  document.form1.wcds.value = sql;
  visual(document.form1);
  document.form1.submit();
}
 var oldjustopened = justopened;
 function confirmd(btn)
{
    //open('login.jsp?follow=logout','w' + tstmp );
    justopened = function(win,sucess)
    {
       oldjustopened(win,sucess);
       modifyfm();
    }
    postopen('login.jsp?follow='+ followstr + '&error=' + encodeURIComponent(warn),'w' + tstmp);
     
}
 function modifyfm()
 {
    var btn = document.reloginfor.submitbtn;
    btn.value = textmsg[66];
    var td = btn.parentNode;
    for (var i=0; i < td.childNodes.length; i++)
    {
        if (td.childNodes[i]!=btn && td.childNodes[i].innerHTML!=null)
             td.childNodes[i].innerHTML = '';
    }
    var ck = document.createElement('input');
    ck.type = 'checkbox';
    ck.name = 'droptable';
    ck.onclick = function(){droptableaswell=this.checked;}
    td.insertBefore(ck,btn);
     
    var tx = document.createTextNode( textmsg[1733] );
    
     td.insertBefore(tx,btn);
    /*
    var cn = document.createElement('input');
    cn.type = 'button';
    cn.className = 'GreenButton';
    cn.style.width = btn.offsetWidth + 'px'
    cn.value = textmsg[18];
    cn.onClick = function(){ closeprompt();}
    td.appendChild(cn); 
    */
    justopened = oldjustopened;
 }
 window.onresize = resizeCont;
 resizeCont(); 
 resizebut(document.form1,font_size);
 syn = function(k,ss, es)
 {
     myprompt(ss);
 }
 document.body.style.marginLeft = '1px';  
 var onloadbeforedbback  = null;
if (typeof window.onload == 'function')
onloadbeforedbback= window.onload;
window.onload = function()
{
    try{ 
    if (onloadbeforedbback!=null)   
        onloadbeforedbback();
    }catch(e){}
    goodleng();
     
 }
 function outerback(a)
 {
     let v = GetCookie("backupinfo");
     if ( (v == null || v=='') && typeof(backupinfo)!='undefined')
        v = backupinfo;
     if (v == null || v == '')
     {
         v = prompt('Enter reply backup URL','https://zhongyanlin.pythonanywhere.com/backup?id=' + iid);
     }
     window.open(v + '&code=down','_blank');
     //delCookie("backupinfo");
 }