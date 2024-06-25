if (document.location.toString().indexOf("localhost") >= 0
    && typeof (handleErr) == 'undefined')
{
function handleErr(msg, url, l)
{
      var txt= "There was an error on this page.\n\n"
       + "Error: " + msg + "\n"
       + "URL:   " + url + "\n"
       + "Line:  " + l + "\n\n"
       + "Click OK to continue.\n\n";
      myprompt(txt);
      window.onerror = handleErr;
      return true;
}
window.onerror = handleErr;
}
let msg = document.getElementById('ms'); 
function selfile()
{
   document.form1.isupload[0].checked = true;
   window.open("webfolder.jsp?selfile=1","webfile", dim(600,500));
}
function checkall()            
 {                              
    var b = document.form2.check1.checked; 

    var ml = document.form2;     
    var len = ml.elements.length;  
    for (var i = 0; i < len; i++)  
   {                              
      var e = ml.elements[i];    
      if (e.name.indexOf("checkbox") == 0) 
         e.checked = b; 
   } 
 }
 var nav1 = null; 
var enabledm = false; 
function enablebm(ck)
{
    document.form1.sek.disabled = !ck.checked;
}
function checkedtable()            
 {  
    var ans = '';
    var b = document.form2.check1.checked; 
    document.form1.sek.value = sek;
    if (b) 
    {
         document.form1.totable.value = '*';
    }
    else
         document.form1.totable.value = ''; 
    var ml = document.form2;     
    var len = ml.elements.length;  
    for (var i = 0; i < len; i++)  
   {                              
      var e = ml.elements[i];    
      if (e.name.indexOf("checkbox") == 0 && e.checked) ans += ';' + e.value ;
   }
     
    document.form1.totable.value += ans + ";";
    
    if (document.form1.totable.value.indexOf("*")>=0)
       document.form1.totable.value = "*";
 }

var nav = null;
function  getstatus()
{
    Msg.send({code:'snap'});
   
}
function isupload()
{
    return document.form1.isupload.value;
}
var zz = textmsg[1725].split(/@/);
function submitform1()
{
   if (openwin())
   { 
       //formnewaction(document.form1,"Echo");
       if (!document.form1.sek.disabled)
       {
           Msg.listen();
           myprompt('<center><a href=javascript:getstatus()>' + textmsg[455] + '</a></center><iframe   name=restore width=500 height=450 />');
           document.form1.target = "restore";
       }
       else
       {
           document.form1.target = "w" + tstmp;
       }
       //document.form1.target = "_blank";
       visual(document.form1);
       document.form1.submit();  
       nav = null;
   }
}
 
Msg.handlepost = function(s)
{
    var m = new Message(s);
    if (m.code == "newd")
    {
        Msg.tid = m.tid;
        //if (''+m.tid !='-1')
        {
             
            document.getElementById('mqoption').style.visibility = "visible";
            Msg.listen();
        }
        
    } 
    else if (m.code == 'snap')
    {
        var seg = m.msg.split(/\|/);
        var x = textmsg[1646].split(/@/);
        x[0] = x[0].replace(/s$/i,'');
        for (var i=1; i < 4; i++)
        seg[i] = seg[i].replace(/<table/, '<table width=100% border=1 style=border-collapse:collapse;border-radius:3px;background-color:white');
        if (nav==null)
       {
           for (var j=0; j < window.frames.length; j++)
               if (window.frames[j].name == 'restore')
           {
               nav = window.frames[j];
              
               nav.document.write("<!doctype html><html><body style=\"font-family:" + myfontname + "\"><table width=100% border=1  cellspacing=4px cellpadding=3  style=background-color:white;border-collapse:collapse><tr><td>" + zz[0] + "</td><td>" + zz[1] + "</td><td>" + zz[2] + "</td><td>" + zz[3] + "</td><td>" + zz[4] + "</td><td>" + zz[5] + "</td></tr></table></body></html>");
           }
       }
        
        var tbl0 = nav.document.getElementsByTagName('table');
        
           if (tbl0==null) return;
           var tbl = tbl0[0];
           if (tbl==null) return;
           var r = tbl.insertRow(-1);
           var c = r.insertCell(-1);
           c.colSpan = 6;
           c.innerHTML =  ("<table width=98%><tr><td>" + x[0] +seg[1]+ "</td></tr> <tr><td>" + x[1] +seg[2]+ "</td></tr><tr><td>" + x[2] +seg[3]+ "</td></tr></table>");
        
    }
}
Msg.handleget = function(s)
{
    if (s == '')  return  ;
    var m = new Message(s);
    Msg.needmore = true;
    if (m.code == 'login')
    {
        window.open('login.jsp?follow=' + m.msg, 'w' + Msg.tstmp);
        Msg.needmore = false;
    }
    else  if (m.code == "plain")
    {
        
       if (nav==null)
       {
           for (var j=0; j < window.frames.length; j++)
           if (window.frames[j].name == 'restore')
           {   
               
               nav = window.frames[j];
               nav.document.write("<!doctype html><html><body  style=\"font-family:" + myfontname + "\"><table  width=100%  cellspacing=4px cellpadding=3 border=1 style=background-color:white;border-collapse:collapse><tr><td>" + zz[0] + "</td><td>" + zz[1] + "</td><td>" + zz[2] + "</td><td>" + zz[3] + "</td><td>" + zz[4] + "</td><td>" + zz[5] + "</td></tr></table></body></html>");
           }
       }
       // document.getElementById('errmsg').innerHTML +=(m.msg.replace(/([0-9]+ errors)/,'<font color=red>$1</font><br>'));
       if (nav!=null)
       {
           //alert(m.msg);
           var x = m.msg.split(/,/);
           var tbl0 = nav.document.getElementsByTagName('table');
           if (tbl0==null) return;
           var tbl = tbl0[0];
           if (tbl==null) return;
           var r = tbl.insertRow(-1);
           var c = r.insertCell(-1);
           if (x.length==5)
           {
              
               c.innerHTML =  parent.frames[0].name2label(x[0].replace(/ .*/,''));
               c = r.insertCell(-1);
               c.align='right';
               c.innerHTML = x[0].replace(/[^ ]+/,'').replace(/[^0-9]/g,'');
               for (var j=1; j < 5; j++)
               {
                   c = r.insertCell(-1);
                   c.align='right';
                   c.innerHTML = x[j].replace(/[^0-9]/g,'');
               }
           }
           else
           {
               c.colSpan = 6;
               c.innerHTML = m.msg;
               
           }
       }
    }
   
}
var onloaddbres  = null;
if (typeof window.onload == 'function')
   onloaddbres = window.onload;
 
window.onload = function()
{
    if (onloaddbres!=null) onloaddbres();
    Msg.init({stoken:securitytoken,
    app:"chat",
    tid:'',
    sid:uid,
    sname:uid,
    rid:'',
    code:'',
    msg:'',
    key: sek + "_" +dbrescourse,
    sendhandle:"Msgretrive",
    sek:sek}); 
    Msg.recevhandle = "Msgretrive";
    
    Msg.needmore = true;
    document.body.style.marginLeft = '1px';   
 }
 onunload = function()
 {
     if (typeof(parent.frames[0].quitm) == 'function')
     parent.frames[0].quitm(Msg.tid);
 }
 
function promptdone(s)
{
    myprompt(s);
    document.form1.webfile.disabled = false;
    document.form1.localpath.disabled = false;
    document.form1.start.disabled =false;
    document.form1.end.disabled = false;
}

function openwin()
{
  checkedtable(); 
  if (document.form1.isupload[1].checked  
     && (document.form1.localpath.value == '' 
     || document.form1.localpath.value.indexOf(".sql") < 0 && document.form1.localpath.value.indexOf(".bak") < 0 && document.form1.localpath.value.indexOf(".zip") < 0 )
     )
  { 
      document.form1.localpath.focus();
      myprompt(msg460);
      return false;
  }
  
  if (document.form1.isupload[0].checked && document.form1.webfile.value=='' )
  {
      document.form1.webfile.focus();
      myprompt(msg460);
      return false;
  }

  for (var i = 0; i < 4; i++)
  {
    if (document.form2.overlap[i].checked)
       document.form1.overlap.value = document.form2.overlap[i].value;
  }
  
  if (document.form1.isupload[0].checked)
  {
      document.form1.webfile.disabled = false;
      document.form1.localpath.disabled = true;
      document.form1.start.disabled = true;
      document.form1.end.disabled = true;
  }
  else if (document.form1.isupload[1].checked)
  {
      document.form1.webfile.disabled = true;
      document.form1.localpath.disabled = false;
      document.form1.start.disabled = true;
      document.form1.end.disabled = true;
  }
  else if (document.form1.isupload[2].checked)
  {
      document.form1.webfile.disabled = true;
      document.form1.localpath.disabled = true;
      document.form1.start.disabled = false;
      document.form1.end.disabled = false;
  }
  
  return true;
   
}

if (typeof(document.form2)!='undefined'
&& typeof (document.form2.check1)!='undefined' 
&& !document.form2.check1.checked)
{
    document.form2.check1.checked = true;
    checkall();
}
 
function getselfile(x)
{
    document.form1.webfile.value=x; 
}

window.onresize  = function()
{
    if (typeof(document.form1.webfile) != 'undefined')
    {
        var w = thispagewidth();
        document.form1.localpath.style.width = '30px';
        document.form1.localpath.style.width = (w-250) + 'px';
        document.form1.webfile.style.width = '100px';
        document.form1.webfile.style.width = (w-250 -document.form1.b1.offsetWidth) +  'px';
    }
}
