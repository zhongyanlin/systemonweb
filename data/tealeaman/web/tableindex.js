/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
 

 
function passbackOwner(tblname,code)
{
   for (var i = 0; i < numtables && tblname !=tables[i];i++);
   if (i < numtables)
      owner[i] = code;
}
function passOwner(tblname)
{
   for (var i = 0; i < numtables && tblname !=tables[i];i++);
   if (i < numtables)
       return owner[i];
   return  systemtotal;
}
 
function passNumfield(tblname)
{
    for (var i = 0; i < numtables && tblname !=tables[i];i++);
    if (i < numtables)
       return numfields[i];
    return 1;
}

function passNumtables(){return numtables;}
function passTables(ts){for (var i = 0; i < numtables; i++) ts[i] = tables[i];}
function passNumfields(ts){ for (var i = 0 ; i < numtables; i++) ts[i] = numfields[i];}
function passTFields( ts ) 
{
  for (var i = 0; i < numtables; i++)
    for (var j = 0; j < numfields[i]; j++)
      ts[i][j] = tfields[i][j];
}
function passdbinfo()
{
   var infos = dbinfo.split("|");
   return infos[0];
}
function passdef(tn)
{
   var j = 0; 
   for (; j < numtables && tn != tables[j]; j++);
   
   if (j < numtables)
   {
      return  "create table " + tn +    definitions[j];
   }
   return "create table " + tn + "(lastupdate " + longstr + " NOT NULL)";;
}

function passexists(tn)
{
   var j = 0; 
   for (; j < numtables && tn != tables[j]; j++);
   
   if (j < numtables)
   {    
       return  exists[j]; 
   }
   return false;
}

function qpassOwner(tblname)
{
   var i = 0;
   for ( i = 0; i < numquerys && tblname !=querys[i];i++) 
       ;
   if (i < numquerys)  
       return qowner[i];
   return  systemtotal ;
}
 
function passNumquerys(){return numquerys;}
 
function qpassdef(tn)
{
   var j = 0; 
   for (; j < numquerys && tn !=  querys[j]; j++);
   
   if (j < numquerys)  
   {    
       return  qdefinitions[j]; 
   }
   return "";
}

function backdef(tn, def)
{
   var j = 0; 
   for (; j < numtables && tn != tables[j]; j++);
   if (j < numtables)
       definitions[j] = def; 
}
 
var curtable = '';
var upper=null, lower=null;
function dotable(sel)
{
    if (sel.selectedIndex < 0) return;
    upper=sel;
    curtable  = sel.options[sel.selectedIndex].value; 
    if (sel.selectedIndex !=sel.options.length-1 && lower!=null && lower.selectedIndex!=0)
      start(lower);
}
var deff = '';
function start(sel)
{
   lower=sel; 
   if (upper==null ||  curtable=='') 
   {
       myprompt(textmsg[885]);
       return;
   }
   var i = sel.selectedIndex;
    if (i==0) return;
   var newnm = '';
 
   deff = passdef(curtable);
   
   if (i < sel.options.length-2)
   {
     var z = sel.options[i].value.replace(/XX/,curtable);
      
     mode='table'; 
     
     window.open(z,"rightwintb");
   }
   else if ( i==sel.options.length-2)
   { 
     if (curtable.toLowerCase() == 'appuser' || curtable.toLowerCase() == 'apptables' || curtable.toLowerCase() == 'task')
     {
       myprompt( "Don't drop the system table");
     }
     else { 
     if (lower!=null) lower.selectedIndex = 0;
     myprompt( m715 + curtable +"?", null, "if(v) dropcurtable()");
     }
   }
   else  if ( i==sel.options.length-1)
   {  
       if (curtable.toLowerCase() == 'appuser' || curtable.toLowerCase() == 'apptables' || curtable.toLowerCase() == 'task')
       {
           myprompt( "Don't rename the system table");
       }
       else
       myprompt(textmsg[2], curtable +"1", "submittable(v)");
   }
}

function dropcurtable()
{  if (curtable.toLowerCase() == 'appuser' || curtable.toLowerCase() == 'apptables' || curtable.toLowerCase() == 'task')
   {
       myprompt('No drop the system table');
       return;
   }
   if (lower!=null) lower.selectedIndex = 0;
   document.f1.act.value = "droptable";
   document.f1.tname.value = curtable;
   formnewaction(document.f1);
   visual(document.f1);
document.f1.submit();
}

function savedef(tn, def)
{
      if (lower!=null) lower.selectedIndex = 0;
      document.f1.act.value = "savedef";
      document.f1.tname.value = tn;
      document.f1.newname.value = tn;
      document.f1.def.value =  def;
      formnewaction(document.f1);
      visual(document.f1);
document.f1.submit();
}

function submittable(newnm)
{
      if (curtable.toLowerCase() == 'appuser' || curtable.toLowerCase() == 'apptables' || curtable.toLowerCase() == 'task')
   {
       myprompt('No rename the system table');
       return;
   }
      if (lower!=null) lower.selectedIndex = 0;
      document.f1.act.value = "renametable";
      document.f1.tname.value = curtable;
      document.f1.newname.value = newnm;
      var deff = passdef(curtable);
      document.f1.def.value =  deff.replace(curtable,newnm);
      formnewaction(document.f1);
      visual(document.f1);
document.f1.submit();
}

var qlower = null;
var qupper = null;
var curquery = '';

function doquery(sel)
{
    document.f1.target = parent.frames[1].name;
     if (lower!=null)
       lower.selectedIndex = 0;
    qupper=sel;
    if (sel.selectedIndex < 0) return;
    curquery  = sel.options[sel.selectedIndex].value; 
    
    if (qlower!=null && qlower.selectedIndex!=0)
      start1(qlower);
}

 

function start1(sel)
{
   if (lower!=null)
       lower.selectedIndex = 0;
   qlower=sel; 
   if (qupper==null ||  curquery=='') 
   {
       myprompt(textmsg[885]);
       return;
   }
   var i = sel.selectedIndex;
    document.f1.target = parent.frames[1].name;
   if (i==0) return;
   if (i < sel.options.length-2)
    {  
        var z=sel.options[i].value.replace(/XX/,curquery);
       if (subdb!='') z +='&subdb=' + subdb;  
       window.open(z,parent.frames[1].name);
       mode='query';
    }
    else if ( i== sel.options.length-2)
    {
      sel.selectedIndex = 0;
      myprompt( "Do you really want to delete "  + curquery +"?", null, "if(v)dropcurquery()");
      
    }
    else 
    {
      newnm = rntable(curquery);
      if (newm != null)
     { 
     sel.selectedIndex = 0;
      
     document.f1.act.value = "renamequery";
     document.f1.tname.value = curquery.replace(/'/,"''");
     document.f1.newname.value = newnm;
     formnewaction(document.f1);
     visual(document.f1);
document.f1.submit(); 
     } 
   }
}

function dropcurquery()
{
     document.f1.act.value = "dropquery";
     document.f1.tname.value = curquery.replace(/'/,"''");
     formnewaction(document.f1);
     visual(document.f1);
document.f1.submit(); 
}
 
function rntable(tn)
{  
   var j = 0; 
   var pm =  m716;
   do
   {
       tn = window.prompt(pm, tn +"1");
       if (tn != null)
       {
           for (j = 0; j < querys.length && tn != querys[j]; j++);
           if (j == querys.length)
           {
               if (issystemrpoc(tn)) 
               {
                  j= -1;
                  pm = newm + " is a system routine. Enter another name"; 
               }
           }
           else
              pm = m22 + tn +  m714;
       }
   }
   while (tn != null && j < querys.length);
   return tn;
}


function newtable(pm,tn)
{
   if (pm==null) pm = m716;
   if (tn==null) tn = 'newtable';
   myprompt(pm,tn, "gonewtable(v)");
}

function gonewtable(tn)
{ 
   pm = m22 + tn+  m714;
   var j = 0; 
   for (j = 0; j < tables.length && tn.toLowerCase() != tables[j].toLowerCase(); j++);
   if ( j < tables.length || tn=='Task' || tn=='Apptables')
   {
       myprompt(pm, tn + '1', "gonewtable(v)");
       return;
   }
   if (tn.replace(/ /g,'')=='')
   {
       newtable();
       return;
   }
   if (tn.replace(/[a-z|A-Z|0-9]/g,'') != '')
   {
      pm = "Don't use any character other than alphabet and digit";
      tn = tn.replace(/[^a-z|A-Z|0-9]/g,'');
      myprompt(pm, tn + '1', "gonewtable(v)");
      return;
   } 

   window.open('tablemake.jsp?tablename=' + tn + '&subdb=' + subdb, parent.frames[1].name);
   mode = 'table';

}

function newquery(pm,tn)
{  
   if (pm==null) pm = m716;
   if (tn==null) tn = 'newquery';
   myprompt(pm,tn, "gonewquery(v)");
}

function gonewquery(tn)
{
   var j = 0; 
   for (j = 0; j < querys.length && tn.toLowerCase() != querys[j].toLowerCase(); j++);
   if (j < querys.length)
   {
      pm = m22 + tn+  m714;
      tn = tn + "1";
      newquery(pm,tn);
      return;
   }
   if (issystemrpoc(tn)) 
   {           
      pm = tn + " is a system rdap. Enter another name:";
      tn +='1';
      newquery(pm,tn);
      return;
   }

   if (tn.replace(/ /g,'')=='')
   {
       newtable();
       return;
   }

    window.open('querymake.jsp?queryname=' + tn +'&subdb=' + subdb, parent.frames[1].name);
    mode = 'query';
     
}
 
function pad(str,  n)
{
   var i = 0;
   if (str!=null) i=str.length; 
   if (i == n) return str;
   
   if ( n < i ) return str.substring(0,n);

   for ( ; i < n; i++)
           str +=" ";
        return str;
}
 
if (numtables == 0)
{
    document.form1.tablename.options[0] = new Option(pad('',22),'');
    document.form1.tablename.options[0].className = 'selectoption';
}
else
{
    for (var i = 0; i < numtables; i++)
    {
        document.form1.tablename.options[i] = new Option((exists[i]?'  ':'*') +   pad(tables[i],22),tables[i]);
        document.form1.tablename.options[i].className = 'selectoption';
    }
}
if (numquerys == 0)
{
    document.form2.queryname.options[0] = new Option(pad('',22),'');
    document.form2.queryname.options[0].className = 'selectoption';
}
else
{
    for (var i = 0; i < numquerys; i++)
    {   document.form2.queryname.options[i] = new Option(pad(querys[i],22),querys[i]);
        document.form2.queryname.options[i].className = 'selectoption';
    }
}

 
function godef1(sel)
{
     var i = sel.selectedIndex; 
     
     if (i >=0 && i < sel.options.length)
     {   
         postopen('querymake.jsp?queryname=' + encodeURIComponent( sel.options[i].value)+'&subdb=' + subdb,parent.frames[1].name, '_blank');
         mode = 'query';
     }
}
 
 
  
function godef(sel)
{
    if (mode=='table')
    {
     var i = sel.selectedIndex;  
     if (i >=0 && i < sel.options.length )
        window.open('tablemake.jsp?tablename=' + sel.options[i].value +'&subdb='+ subdb,parent.frames[1].name);
    }
    else
    {
        
        var j, i = sel.selectedIndex;  
        if (i <0 || i >= sel.options.length ) return;
        var tbn = sel.options[i].value;  
        i=0; for(;i< numtables && tbn!=tables[i];i++);
        if (i==numtables) return;
        parent.frames[1].addmore(definitions[i],numfields[i],tbn);
       
    }
}
 
function refresh(tb)
{
   var xx = document.location.toString();
   if (tb!=null)
   { 
   if (xx.indexOf("?") > 0)
   {
       if (xx.indexOf("&refresh=") > 0)
          xx = xx.replace(/&sortway=[\w]*/,'&refresh=' + tb);
       else
          xx += "&refresh=" + tb;
   }
   else
   {
       xx += "?refresh=" + tb;
   }
   if (xx.indexOf("mode")>0) xx += "&mode=" + mode;
   }
    
   document.location.href = xx;
}

var did = false;



function syn(x)
{
  document.location.href="tableindex.jsp?mode=" + mode;
  return 0;
}
function submitf1()
{
    visual(document.f1);
document.f1.submit();
}


function initerror()
{
    var m = nerr * 30;
    if (m>600) m = 600;
     
    var nav0 = openblank('error',dim(350, 100+m));
    var txt = "<h1  style=background-color:" + IBGCOLOR +";color:#DDCC11;text-align:center><nobr>Tables Not Consistant</nobr></h1><table align=center style=\"border:1 orange inset;background-color:lightyellow\" cellspacing=1 cellpadding=3><tr><td style=\"border:1 grey outset\">" + err0 + "</td><td valign=top style=\"background-color:#FFDDEE;border:1 grey outset\">Click table name to show details</td></tr></table>";
    txt += "<scrip" + "t>function showme(t){if(onmydomain(opener)) document.getElementsByTagName(\"table\")[0].rows[0].cells[1].innerHTML=opener.readerr(t);}</scrip" + "t>";
    nav0.document.write(txt);
    endDocWrite(nav0);
}

function init()
{
    if (initable!=null)
    {
        var sel = document.form1.tablename;
        for (var i=0; i < sel.options.length; i++)
        {
            
            var x = sel.options[i].text.replace(/\*/,'').replace(/^[ ]+/,'').replace(/[ ]+$/,'');
            
            if (x.toLowerCase() == initable.toLowerCase())
            {
                sel.selectedIndex = i;
                godef(sel);
                break;
            }
        }
    }
}

function getFolder(){return "dbdesign";}
init();

