/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
buildactmenu = function()
{
    recurainput(document.getElementById('tbl0'));
}
var f2 = document.form2;
var f3 = null;
if (typeof (document.form3)!='undefined')
{
   f3 = document.form3;
}
var f4 = document.form4;
var f5 = document.form5;
var maintbl = document.getElementById("themaintbl");
var K = -1;
var callingwindow = null;
var rsaenccode = "3";
if (typeof(setServerkeys)=='function' && typeof(ZQ8)!='undefined')
{
    setServerkeys(ZQ8);
    serCharSize(ZQ10);
}

var tocall='';
var hasurlselected = function()
{
    return false;
}
  


function webservice(k,act,opt)
{ 
  f5.filename.value = fn[k];
  f5.file.value = fn[k];
  var et = fn[k].replace(/[^\.]+\./,'').toLowerCase();
  tocall =   getHandler(act);
  f5.target = '_blank';
  formnewaction(f5,tocall);
  f5.content.disabled = true;
  var opts = opt.split(/&/);
  for (var i=0; i < opts.length; i++)
  {
      if (opts[i].indexOf('_')>0) continue;
      var as = opts[i].split(/=/);
      var feles = f5.elements;
      var fne = null;
      for (var j=0; j < feles.length; j++)
          if (feles[j].name == as[0])
          {   fne = feles[j];break;}

      if (fne == null) 
      {
          fne = document.createElement('input');
          fne.type = 'hidden';
          fne.name = as[0];
          f5.appendChild(fne);
      }

      fne.value = as[1];
  }
 visual(f5);
 //f5.submit();
 sendbyajax(f5);  
}
function sendbyajax(fm)
{
    var act = "";
    if (typeof(fm.operation) != 'undefined') 
        act = fm.operation.value;
    if (fm.target != 'w' + tstmp || act !="unzip" &&   act!="zip" && act != "backup" && act != "restore" && act != "delete" && act != "move" && act !="copy")
    {
        fm.submit();
        return;
    }
    
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
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200 )
            {
                closeprompt();
                var j = xmlhttp.responseText.indexOf('<script');
                if (j < 0) return;
                j = xmlhttp.responseText.indexOf('parent.',j);
                var k = xmlhttp.responseText.lastIndexOf('</script>');
                var jscodes = xmlhttp.responseText.substring(j+7,k);
                eval(jscodes);
            }
        };
        
        const f = new FormData(fm);
        let xx = new URLSearchParams(f).toString();
         
    let url = fm.action;
    let jj =url.indexOf('?');
    if ( jj > 0 ) 
    { 
        if (url.substring(jj+1).includes('='))
        xx += url.substring(jj+1);
        url = url.substring(0,jj);
    }
    let xy = findPositionnoScrolling(fm);
    let left = xy[0] + fm.offsetWidth/2 -20;
    let top = xy[1] + fm.offsetHeight - 180;
    myprompt('<img id=progress src=image/progress.gif>',null,null,act); 
    promptwin.style.cssText = '';
    promptwin.className = 'rundisk';
    promptwin.style.left = left + 'px';
    promptwin.style.top = top + 'px';
     
    xmlhttp.open('POST', url, true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send(xx); 
}
 
 
function syn1()
{
  if (K > -1)
  {
      K = -1;
      f5.content.disable = false;
      f5.content.value = nav1.document.f1.destination.value;
      eval(tocall);
  }
} 

parsepassedsel() ;

var selected = '';
var involved = null;
var valid = true;

function zip(k)
{
    openwin();
    f2.target = "w" + tstmp;
    f2.filedir.value = fn[k];
    f2.operation.value = "zip";
    formnewaction(f2);
   visual(f2);
   //f2.submit();
    sendbyajax(f2); 
}

function pdflatex(k)
{
    openwin("fileoper");
    f2.target = "fileoper";
    f2.filedir.value = fn[k];
    f2.operation.value = "pdflatex";
    formnewaction(f2);
    visual(f2);
   // f2.submit();
    sendbyajax(f2); 
}
var resizei;
function resizepic(i)
{
    ResizeUploaded.attachref = document.form7.attach;
    ResizeUploaded.uploaded( "web/" + url[i] ,  fn[i] + '@' +  tstr[i]  );
    if (typeof(document.fpic) != 'undefined')
    {
         var tr = document.fpic.deleuppic.parentNode.parentNode;
         tr.deleteCell(2);
    }
    resizei = i;
     
}
function setfileltime(ltime,len)
{
    var nm = ResizeUploaded.filename.replace( /@.*/,'');
    var i, j = 0;
    for (i = 0; i < N && fn[i]!=nm; i++);
    for ( ; j < maintbl.rows.length; j++)
    {
        if( maintbl.rows[j].cells[1].innerHTML.indexOf(">" + nm +"<") >0)
           break;
    }
    ln[i]  = len;
    tstr[i] = ltime;  
    var dif = repln(j,3,len,"");
    var newtime = replc(j,6, timestr(tstr[i]));
}
function unzip(k)
{
    if (inquota==false){myprompt(textmsg[774]);return;}
    openwin();
    f2.target = "w" + tstmp;
    f2.filedir.value = fn[k];
    f2.operation.value = "unzip";
    formnewaction(f2);
   visual(f2);
   //f2.submit();
    sendbyajax(f2); 
}

var operationsel = null;
function invoke(sel)
{
   operationsel = sel;
   var k = sel.selectedIndex;
   if (k > 0)
   {
      eval(sel.options[k].value);
   }
   sel.selectedIndex = 0;
}


function rename(i)
{
    var renamerownum = 0;
    for (renamerownum=0; renamerownum < maintbl.rows.length; renamerownum++)
    {
        if( maintbl.rows[renamerownum].cells[1].innerHTML.indexOf(">" + fn[i] +"<") >0)
           break;
    }
    if (renamerownum == maintbl.rows.length)
        renamerownum = 0;
    myprompt(textmsg[2], fn[i],"goahead(v," + i +"," + renamerownum +")");
    setRoundedWidth(promptwin, 350);
    promptwinfit();
}

var renamesyn = "";
function afterrename(nm, newname, len, furl)
{
    for (var i = 0; i < N && fn[i]!=nm; i++);
    if (i == N) return false;
    var j = 0;
    for ( ; j < maintbl.rows.length; j++)
    {
        if( maintbl.rows[j].cells[1].innerHTML.indexOf(">" + nm +"<") >0)
           break;
    }
    if (j == maintbl.rows.length)
       return false;
   
    fn[i]= newname;
    var bb = typeof(websiteurl)!='undefined' && websiteurl!=null;
    if (!bb)
        maintbl.rows[j].cells[1].innerHTML= 
    "<a href=\"javascript:download("  + i + ")\"><NOBR>" + newname + "</NOBR></a>";
    else
        maintbl.rows[j].cells[1].innerHTML=
    "<a href=\"" +  websiteurl + newname + "\" target=\"_blank\" >" ;

    ln[i]  = len;
    tstr[i] = Math.round((new Date()).getTime()/1000);  
    var dif = repln(j,3,len,"");
    var newtime = replc(j,6, timestr(tstr[i]));
    url[i] =  furl;
    return true;
}
function goahead(newname,i, renamerownum)
{
    if (renamerownum < 0 && renamerownum >= maintbl.rows.length)
    {
        return;
    }
    var invalid = newname.replace(/[_|\.|a-z|A-Z|0-9]/g,"");
    if( invalid !='')
    {
       myprompt(textmsg[888] + invalid +".", newname,"goahead(v," + i +")");
       return;
    }
    var jj = 0;
    for (; jj < N && fn[jj]!=newname; jj++);
    if (jj < N)
    {
       myprompt(newname + " " + textmsg[3], newname,"goahead(v," + i +")");
       return;
    }

    if (newname == '' || newname == fn[i]) return;
    f2.filedir.value = fn[i];
    f2.destination.value = newname;
    f2.operation.value = "rename";
    
    var isfile = (maintbl.rows[renamerownum].cells.length >2 && 
            (maintbl.rows[renamerownum].cells[2].innerHTML.indexOf("file.jpg") > 0 || maintbl.rows[renamerownum].cells[2].innerHTML.indexOf("<div") > 0));
    renamesyn = "fn[" + i + "]='" + newname + "';maintbl.rows["
    + renamerownum + "].cells[1].innerHTML="
    + "'<a href=\"javascript:" + ((!isfile)?"openFolder":"download") +"("  + i + ")\"><NOBR>" + newname + "</NOBR></a>';f2.target = 'fileoper';";
    var bb = typeof(websiteurl)!='undefined' && websiteurl!=null;
    if (bb)
        renamesyn = renamesyn.replace(/javascript:download\([0-9]+\)./, websiteurl + newname + "\" target=\"_blank\"" );
     
    openwin();
    f2.target = "w" + tstmp;
    formnewaction(f2);
   visual(f2);
   f2.submit();
   sendbyajax(f2); 
}

//event.keyCode <= 90 && event.keyCode >=65 || event.keyCode >=97 && event.keyCode <=122 || event.keyCode >=48 && event.keyCode <=57 || event.keyCode == 95 || event.keyCode == 46)
var nav1 = null;

function canload()
{
    if (inquota==false)
    {
       myprompt(textmsg[774]);
       return false;
    }
    if (f3.localpath.value=="")
    {
       myprompt(textmsg[336]);
       f3.localpath.focus();
       return false;
    }
    if (f3.localpath.multiple == true)
        return true;
    var tt = f3.localpath.value.replace(/[ ]+$/,'');
    var i = tt.lastIndexOf("/");
    var j = tt.lastIndexOf("\\");
    if (j > i) i = j;
    tt = tt.substring(i+1);
    for (i=0; i < N && tt!=fn[i]; i++)  ;
    if (i < N )// false == confirm(textmsg[836]) )
    {
        closeprompt();
        return false;
    } 
    return openwin();
}
function openwin(winnm)
{
  if (winnm==null) winnm = "w" + tstmp;
  if (!valid) 
  {
    valid = true;
    return false;
  }
  nav1 = null;
  //var  popstr = dim(340,300);
  if (winnm=='w'+tstmp)
      nav1 = window.open('', winnm );
  else
      nav1 = window.open('', winnm, dim(540,400));
  //nav1.document.writeln('<html><body bgcolor=lightyellow><center>' + textmsg[203] + "</body></html>");
  return true;
}
function updatechecks(msg)
{
      var xx = ";" + passedsel +";";
      var passed1 = "";
      var yy = msg.replace(/;$/,'').split(";")
      for (var ii=0; ii < yy.length; yy++)
         if (xx.indexOf(";" + yy[ii] +";") >=0)
            passed1 += yy[ii] +";";
      passedsel = passed1.replace(/;$/,'');

      for (var i=1; i < cb.length; i++)
      {
         if (cb[i].checked)
      {
         if ( (";" + msg).indexOf(";"+ folder +"/" + fn[i] +";")<0)
           cb[i].checked = false;
      }
      }
}

 function syn(act, msg)
{
   if (act =='restore')
   {
       addpromptmsg(msg);
      
   }
   else if (act=='refresh')
   {
   if (nav1 != null && nav1.name!='w' + tstmp) nav1.close();
   f4.folder.value = folder;
   f4.sel.value = '';
   formnewaction(f4);
   visual(f4);
   f4.submit();
   }
   else if (act=='error')
   {
      myprompt(msg);
   }
   else if (act=='copy')
   {
      updatechecks(msg); if (msg!='')
      myprompt(textmsg[899] +"<br>" + msg);
   }
   else if (act=='move')
   {
      for (var i = 0; i < cb.length; i++)
      {

      if (cb[i].checked)
      {
         if ( (";" + msg).indexOf(";" + folder + "/" + fn[i] +";")<0)
         {
           for (var jj=1; jj < 8; jj++)
              cb[i].parentNode.parentNode.cells[jj].innerHTML = '';
           cb[i].checked = false;
           cb[i].disabled = true;
         }
      }
      }
      updatechecks(msg);
      if (msg!='') myprompt(textmsg[900] + "<br>" + msg);
   }
   else if (act=='del')
   {
      var total = 0;
      for (var i = 0; i < cb.length; i++)
      {
      if (cb[i].checked)
      { 
         if ( (";" + msg).indexOf(";" + folder + "/" + fn[i] +";")<0)
         {
           for (var jj=1; jj < 8; jj++)
              cb[i].parentNode.parentNode.cells[jj].innerHTML = '';
           cb[i].checked = false;
           cb[i].disabled = true;
           total++;
         }
      }
      }
      updatechecks(msg);
      if (msg!='')
         myprompt(textmsg[904] + "<br>" + msg);
      if (hasurlselected())
      {
          myprompt(textmsg[252] , null, "godeleteurl(v)");
      }
       
      if(total == 0 && msg == '' && resizei >= 0 && isimage(fn[resizei]))
      {
           var i = resizei+1;
           for (var jj=1; jj < 8; jj++)
              cb[i].parentNode.parentNode.cells[jj].innerHTML = '';
           cb[i].checked = false;
           cb[i].disabled = true;
           closeprompt();
      }
   }
   else if (act=='ren')
   {
       if (msg=='0')
       {
           myprompt(textmsg[91]);
       }
       else if (renamesyn!='')
       {
         eval(renamesyn);
         renamesyn = '';
       }

   }
   else if (act =='lock')
   {
       if ( '' + f2.filedir.value.length != msg)
          myprompt(f2.filedir.value + "<br>But Saved length=" + msg);
       else
          myprompt(toolmsg71);
        if (f2.filedir.value.length > 9000)
        {
            myprompt('Exceeded limit. Lock fewer files at one time');
            return;
        }
       if (needsaveurl)
       {
           saveurlchange();
       }
   }
   else if (act =='zip')
   {
      if (nav1 != null && nav1.name!="w" + tstmp) nav1.close();
      f4.folder.value = folder;
      f4.sel.value = '';
      formnewaction(f4);
      visual(f4);
      f4.submit();
      sendbyajax(f4); 
   }
   else if (act =='newsite')
   {
      if (msg=='')
      {
          myprompt(textmsg[1228]);
          //document.form2.crtweb.style.visibility = 'hidden';
          var tb = document.getElementById("buttons");
          tb.rows[0].removeChild(tb.rows[0].cells[0]);
      }
      else
      {
          var xx = msg.replace(/[0-9]+$/,'');
          var yy = msg.replace(xx,'');
          if (yy!='' && isNaN(yy)==false)
          {
          yy = '' + (parseInt(yy) + 1);
          msg = xx + yy;
          }
          else msg = msg +'0';
          createwebsite1(msg, 0);
      }
   }
   else if (act =='rensit0')
   {
       xx = msg.replace(/[0-9]+$/,'');
       yy = msg.replace(xx,'');
        
      if (yy!=''   && isNaN(yy)==false)
      {
          yy = '' + (parseInt(yy) + 1);
          msg = xx + yy;
      }
      else msg = msg +'0';
      createwebsite1(msg, 1);
   }
   else if (act =='clssite')
   {
      if (msg != 'website') msg = textmsg[1227] + "<br>" + textmsg[1228] + " " + msg;
      else msg = textmsg[1227];
      myprompt(msg);

      document.location.href = document.location.toString();
   }
   else if (act =='clssit0')
   {
       myprompt(textmsg[91] +"<br>" + msg);
   }
   else if (act =='rensite')
   {
      document.location.href = document.location.toString().replace(/\?.*$/,'')+"?folder=website";
   }
   else if (act == 'ulrs')
   {
      document.location.href= document.location.toString();
   }
   else myprompt(act + msg);
 
}
 
function openFolder(k)
{
    
    var fd = '';
    if (k == -1)
    {
        if (folder != null)
           fd = folder; 
        else
           fd = '';
        if (fd.length  > 0)
        {
        var j = fd.length - 1;
        while (j >  0 &&  fd.charAt(j) != '/' && fd.charAt(j) != '\\') j--;
        fd = fd.substring(0,j);
        }
    }
    else if (folder == '')
        fd = fn[k];
    else
        fd  = folder + "/" + fn[k];
     
    formdeletestr();
    
    var psl = selstr + passedsel;
   f4.folder.value = fd; 
   f4.sel.value = psl;
   formnewaction(f4);
   visual(f4);
   f4.submit(); 
 }

function redoit(field)
{
    formdeletestr();
    var psl = selstr + passedsel; 
     f4.folder.value = folder;
   f4.sortField.value = field;
   f4.sel.value = psl;
   formnewaction(f4);
  visual(f4);
 f4.submit(); 
}

var shiftPressed= false;
function lockseq(i)
{
   if (shiftPressed)
   {
      var j = i-1;
      while (j>=0 && locks[j].checked!=locks[i].checked)
      {
         locks[j].checked = locks[i].checked;
         j--;
      }
   }
}

function checkseq(i)
{
   if (shiftPressed)
   {
      var j = i-1;
      while (j>=0 && cb[j].checked!=cb[i].checked)
      {
         cb[j].checked = cb[i].checked;
         j--;
      }
   }
   if (  cb[i].checked && iscourse && (fn[i]==designated[0] ||  fn[i]==designated[1] ||  fn[i]==designated[2] ||  fn[i]==designated[3] ||  fn[i]==designated[4]))
   myprompt(fn[i] + " " + textmsg[887],null,null,"warning");
}

 function checkall1()
 {
    var b = f1.check1.checked;
    for (var i = 0; i < cb.length; i++)  
    {                              
        cb[i].checked = b;
    } 
 }
 
 var selstr = "";

 function seled(nf)
 {
    formdeletestr();
    if (passedsel==null||passedsel=='null') passedsel = "";
    var selstr1 = selstr + passedsel;
     
    selstr1 = selstr1.replace(/;$/,"").replace(/;/g,"\n");
    if (selstr1 == '')
      selstr1 = selhint;
    myprompt(selstr1.replace(/\n/g, "<br>"),null,null,nf);
 }

 function Unselect()
 {
    selstr = ''; 
    passedsel = '';
    f1.check1.checked = false;
    checkall1();
    passedsel = '';
    closeprompt();
 }
function parsepassedsel()        
 { 
   var fd  = folder;
   if (folder != '')
       fd += "/";
   selstr = '';
   
   for (var i = 0; i < N; i++)  
   {  
       var selstr1  =  fd + fn[i] + ';';
       if (passedsel.indexOf(selstr1) == 0)
       {
            passedsel = passedsel.substring(selstr1.length);
            cb[i].checked = true;
       }
       else if ( (j = passedsel.indexOf(';' + selstr1) )> 0)
       {
           passedsel = passedsel.substring(0,j) +";" + passedsel.substring(j + 1 + selstr1.length);
           cb[i].checked = true;
       }
   }
 }
  
 function formdeletestr()        
 { 
   var fd  = folder;
   if (folder != '')
       fd += "/";
   selstr = '';
   
   for (var i = 0; i < N; i++)  
   {  
     
      if (cb[i] != null && cb[i].checked )
      { 
          var selstr1  =  fd + fn[i] + ';';
          if (passedsel.indexOf(selstr1) != 0 && passedsel.indexOf(';' + selstr1) < 0)
             selstr += selstr1;
      }
   }
   
 }
 
 function formlockstr()        
 { 
   var ans="";
   for (var i = 0; i < N; i++)  
   {  
      if (locks[i].checked)
      ans += locks[i].value +";";
   }
   return ans;
 }
 
 
function newdir(nf)
{
   if (inquota==false){myprompt(textmsg[774]);valid = false;return;}
   myprompt(toolmsg665,'newdir', "gonewdir(v)",nf);
  setRoundedWidth(promptwin, 350);
   promptwinfit();
}

function gonewdir(v)
{
   for (var i=0; i < fn.length; i++)
   if (fn[i]==v)
   {
       myprompt( v + "" + textmsg[3], v, "gonewdir(v)");
       setRoundedWidth(promptwin, 350);
       return;
   }
   f2.target = "w" + tstmp;
   f2.filedir.value = v;  
   f2.operation.value = "newdir";
   nav1 = open("", "w" + tstmp);
   formnewaction(f2);
  visual(f2);
 f2.submit();
}
var changedfiletype = 't'; 
function newfile(nf)
{
   changedfiletype = 't';
   var tdate = new Date();
   if (inquota==false){myprompt(textmsg[774]);valid = false;return;}
   var xs = textmsg[1307].split(/@/);
   var j = (1+tdate.getMonth());
   var js = '' + j;
   if (j < 10) js = '0' + j;
   var filen = (1900+tdate.getYear())+ js + tdate.getDate();
   myprompt( "<table><tr><td><input  type=radio checked name=isfig onclick=\"changefiletype(this)\" value=t>" + xs[0]+ "</td><td><input   name=isfig type=radio onclick=\"changefiletype(this)\" value=w>" + xs[1]+ "</td><td><input    name=isfig type=radio onclick=\"changefiletype(this)\" value=l>" + xs[2]+ "</td><td><input    name=isfig type=radio onclick=\"changefiletype(this)\" value=c>" + xs[3]+ "</td></tr></table>" + toolmsg767, "" + filen  +'.txt', "gonewfile(v)", nf);
   setRoundedWidth(promptwin, 350);
}
 

function  changefiletype(txt)
{
     
        changedfiletype = txt.value;
        var v = document.getElementById("promptinput");
        if (txt.value=='t')
            v.value = v.value.replace(/\..*$/, '.txt');
        else if (txt.value == 'c')
            v.value = v.value.replace(/\..*$/, '.css');
        else 
            v.value = v.value.replace(/\..*$/, '.html');
        
     
}
 
function gonewfile(v)
{
   
   if (v == null)
   {
      valid = false;
      return;
   }
   valid = true;
   for (var i=0; i < fn.length; i++)
   if (fn[i]==v)
   {
       myprompt( v + " " + textmsg[3], v, "gonewfile(v)");
       setRoundedWidth(promptwin, 350);
       promptwinfit();
       return;
   }
  
  
   if (changedfiletype == 'l')
   {
       var nam = window.open('umltool.html?en=' +  encoding + '&fn=' + v + '&orgnum=' + orgnum + "&lang=" + lang, "_blank") + "&encoding=" + encoding;//, "menubar=1,toolbar=1,scrollbars=1,resizable=1,left=0,top=0,width=700,height=600");
       return;
   }
   else if (changedfiletype == 'w')
   {
       
       document.form2.filedir.value = v;
       document.form2.destination.value = '';
       wyewyg(document.form2.destination);
       
       //nam = window.open('mytool.jsp?' + v, "_blank");//, "menubar=1,toolbar=1,scrollbars=1,resizable=1,left=0,top=0,width=700,height=600");
       return;
   }
    
   f2.filedir.value = v;  
   f2.operation.value = "newfile";
   //var nav2 = openblank("fileoper",dim(800,600));
   f2.target = "_blank";
   formnewaction(f2);
  visual(f2);
 f2.submit();
 }
    
 function deleteit(nf)
 {
   
   formdeletestr();
   var selstr1 = selstr + passedsel;
   if (selstr1 == '')
   {
      if (hasurlselected())
      {
          myprompt(textmsg[252], null, "godeleteurl(v)",nf);
      }
      else
          myprompt(toolmsg664,null,null,nf);
      valid = false;
      return;
   }
   else if (selstr1.length > 9000)
   {
       myprompt('Limit execeeded. Select fewer files to delete at one time');
       return;
   }
   valid = true;
   //var fixed = ["assignment","answer","submission","lecture"];
    var caution = "";
    for (var ii=0; ii < fixed.length; ii++)
    {
       
    if ( ( ";" + selstr + passedsel +";").match(";[^/]+/" + fixed[ii] + ";") !=null 
        //    ||   ( ";" + selstr + passedsel +"/").match(";[^/]+/" + fixed[ii] + "/") !=null
            )
        caution += fixed[ii] + " ";
    }
   if (caution!='')
   caution = " (" + caution +") " +textmsg[887] +"<br>";

   myprompt(caution + toolmsg666 + ':<br>' + selstr1.replace(/;/g,"<br>"), null, "godeleteit(v)",nf);
 }
 function godeleteit(v)
 {
    if (v)
    {
       f2.filedir.value= selstr + passedsel;
       f2.target = "w" + tstmp;
       f2.operation.value = 'delete';
       nav1 = open('',"w" + tstmp);
       valid = true;
       formnewaction(f2);
       visual(f2);
       //f2.submit();
        sendbyajax(f2); 
    }
    else
    {
        valid = false;
        if (hasurlselected())
        {
            myprompt(textmsg[252], null, "godeleteurl(v)");
        }
    }
 }

 function updateLock()
 {
   if (changedlock)
   {
       f2.filedir.value= formlockstr();
       f2.target = "w" + tstmp;
       f2.operation.value = 'lock';
       nav1 = open('',"w" + tstmp);
       valid = true;
       formnewaction(f2);
      visual(f2);
 f2.submit();
   }
   else if(needsaveurl)
   {
       saveurlchange();
   }
 }
    
  
 function count(n)
 {
    var ss = selstr.replace(/;/,'');
    return ss.indexOf(';');
 }

function warnmove()
{
   myprompt(toolmsg667);
}

 function copyto(i)
 {
    if (inquota==false){myprompt(textmsg[774]);return;}
    formdeletestr();
    f2.filedir.value = selstr + passedsel; 
   
    var cap = toolmsg68;
    if (i > -1) cap = fn[i];
    if (f2.filedir.value == '')
    {
        myprompt( toolmsg768 );
        return;
    }
    else  if (f2.filedir.value.length > 9000)
    {
        myprompt('Exceeded limit. Copy fewer files at one time');
        return;
    }
    f2.target = "w" + tstmp;
    openwin();
    if (i != -1)
    {
        var fd  = folder;
       if (folder != '')
        fd += "/";
        f2.destination.value = fd + fn[i];
     }
    else
    {
        var fd = folder;
       
        var j = fd.length - 1;
        while (j > 0 && fd.charAt(j) != '/' ) j--;
        f2.destination.value = fd.substring(0,j);
        
    }
    
    f2.operation.value= 'copy';
    formnewaction(f2);
    visual(f2);
   //f2.submit();
    sendbyajax(f2); 
 }



 function moveto(i)
 {
    formdeletestr();
    f2.filedir.value = selstr;

    if (passedsel!=null) 
        f2.filedir.value = selstr + passedsel;
    else
        f2.filedir.value = selstr.replace(/;$/,'');
    //var fixed = ["assignment","answer","submission","lecture"];
    var caution = "";

    for (var ii=0; ii < 4; ii++)
    if ( ( f2.filedir.value +";").indexOf("/" + fixed[ii] + ";") >0  )
        caution += fixed[ii] + " ";
    if (caution!='')
       caution = "(" + caution +")" + textmsg[887];

    var cap = toolmsg68;
    if (i > -1) cap = fn[i];
    if (f2.filedir.value == '')
    {
        myprompt( toolmsg659);
    }
    else if (f2.filedir.value.length > 9000)
    {
        myprompt('Exceeded limit. Move fewer files at one time');
        return;
    }
    else
       myprompt(caution +  toolmsg668 + ' ' + cap + '?<br>'+ f2.filedir.value.replace(/;/g,'<br>'),
       null, "if(v)gomoveto(" + i +")");
 }
 function gomoveto(i)
 {
    
    if (i != -1)
    {
        var fd  = folder;
       if (folder != '')
        fd += "/";
        f2.destination.value = fd + fn[i];
     }
    else
    {
        var fd = folder;
        var j = fd.length - 1;
        while (j > 0 && fd.charAt(j) != '/' && fd.charAt(j) != '\\') j--;
        f2.destination.value = fd.substring(0,j);
    }
    var allf = f2.filedir.value.replace(/;$/,'').split(";");
    for (var ii=0; ii < allf.length; ii++)
       if (f2.destination.value.indexOf(allf[ii]) == 0
        && f2.destination.value.charAt(allf[ii].length)=='/')
       {
           myprompt(f2.filedir.value +"<br>" + f2.destination.value +"<br>You can not move " + allf[ii] + " into its subfolder");
           return;
       }
    openwin();
    f2.operation.value= 'move';
    f2.target = "w" + tstmp;
    formnewaction(f2);
    visual(f2);
    f2.submit(); 
     sendbyajax(f2); 
 }
function alertrename()
{
   myprompt( toolmsg648 );
}

 
var jj;
var vv;


var actionname;
function editFile(k)
{
     
    actionname = "";
    valid = true;
    f2.rel = "opener";
    f2.target = "_blank";
    f2.filedir.value = fn[k];
    f2.operation.value = "edit";
    f2.option.value = "width:" + (thispagewidth() - 20 + ((parent.frames!=null && parent.frames.length==2)?parent.frames[0].thispagewidth():0 ))  + "px;height:" + (thispageheight() - 160) + "px;";
    formnewaction(f2);
    visual(f2);
    f2.submit();
    
}
 
 
function getFileContent(k)
{
    actionname = "";
    valid = true;
    f2.target = "w" + tstmp;
    f2.filedir.value = fn[k];
    f2.operation.value = "content";
    formnewaction(f2);
   visual(f2);
 f2.submit();
}
function addContent(str)
{
    f5.content.value += str;
    
}
function doAct()
{
    formatHTML(f5.content);//eval(tocall);
}
function download(k,attachment)
{
    actionname = "";
    if (       fn[k].toLowerCase().indexOf(".htm")>0 
            || fn[k].toLowerCase().indexOf(".do")>0 
            || fn[k].toLowerCase().indexOf(".php")>0 
            || fn[k].toLowerCase().indexOf(".jsp")>0
            || fn[k].toLowerCase().indexOf(".jpg")>0 
            || fn[k].toLowerCase().indexOf(".png")>0 
            || fn[k].toLowerCase().indexOf(".gif")>0
            || fn[k].toLowerCase().indexOf(".svg")>0
            || fn[k].toLowerCase().indexOf(".tiff")>0
            || fn[k].toLowerCase().indexOf(".txt")>0)
    {
       ; 
    }
    else if (attachment==null){ attachment = 1;}
    
    if (attachment==null)
    { 
       f2.target = "_blank";
       f2.destination.value = "inline";
    }
    else
    {
       f2.target = "w" + tstmp;
       f2.destination.value = "attachment";
    }
    
    f2.filedir.value = fn[k];
    f2.operation.value = "download";
    formnewaction(f2);
    //f2.action = 'Echo';  f2.target = "_blank";
   visual(f2);
 f2.submit();
}
function act( filename, actname)
{
    
    actionname = actname;
    //openwin("fileoper");
    f2.target = "_blank";
    f2.filedir.value = filename;
    f2.operation.value = "edit";
    
    formnewaction(f2);
    
   visual(f2);
 f2.submit();
}

function fresh()
{ 
    myprompt( toolmsg769 );
} 
 

helpstr += helpinstro;
 
helpstr +="</table><br><a style=visited:#blue href=DataTable?rdap=operationftype&subdb= >" + toolmsg771 +"</a>";
helpstr += "<br><br><b><font color=purple>"+textmsg[256]+"</font></b><br>"+textmsg[257];
helpstr += "<br><br><b><font color=purple>"+textmsg[258]+"</font></b><br>"+textmsg[259]; 
helpstr += "<br><br><b><font color=purple>"+textmsg[250]+"</font></b><br>"+textmsg[260];
//helpstr += "<br><br><b><font color=purple>"+textmsg[261]+"</font></b><br>"+textmsg[262]; 
helpstr += "<br><br><b><font color=purple>"+textmsg[263]+"</font></b><br>" +
textmsg[264]+"<br>"+
textmsg[265]+
 
textmsg[268]+
textmsg[269]+
textmsg[270];
helpstr += "<br><br><b><font color=purple>"+textmsg[271]+"</font></b><br>"+textmsg[272];
 

 


for (j=0; j < N; j++) 
{  
   locks[j].checked = lock[j];
} 
function checklocks(ckall)
{
   for (var i=0; i < locks.length; i++)
      locks[i].checked = ckall.checked;
   
}

function hin(i)
{
    var str1 = "<center>";
    if(websiteurl == null)
    {
        if (locks[i].checked)
           str1 += toolmsg1227 + "<br>";
        var str = url[i];
        str = "FileOperation?did=" + str;
        str =  ("" + document.location).replace(/webfolder.jsp.*/,'') + str;
        str1 += str + "<br><a   href=\"" +   str  + "\" target=_blank>" + textmsg[1391] +"</a>";
        str1 += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href=\"javascript:bufferit('" + fn[i] + '@'+tstr[i]+ '@' + url[i] + ',\')" >'+textmsg[1615] + '</a>';
        str1 += "<br><div id=warning0></div><img src=\"Qrlink?url=" + Msg.hex(str) + "&nlg=1\"  onload=warning(this) >";
    }
    else
    {
        str1 += websiteurl +  fn[i] + "<br><a href=\"" + websiteurl +  fn[i] +"\">" +textmsg[1391] +"</a>";
        str1 += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href=\"javascript:bufferit('" + fn[i] + '@'+tstr[i]+ '@' + url[i] + ',\')" >'+textmsg[1615] + '</a>';
        str1 += "<br><div id=warning0></div><img src=\"Qrlink?url=" + Msg.hex(websiteurl +  fn[i]) + "&nlg=1\"  onload=warning(this) >";
    }
    
    
    myprompt(str1);
}

function testurl(str)
{
   nav1.resizeTo(screen.width-5,screen.height-5);
   nav1.moveTo(2,2);
   //open(str,'url');
}
function stophourglass(){endDocWrite(nav1);}
function selfile()
{
   var fd  = folder;
   if (folder != '')
       fd += "/";
   var selstr = ""; 
   for (var i = 0; i < N; i++)  
   {  
      if (cb[i] != null && cb[i].checked )
      { 
         if (selstr!='') selstr+=";";
         selstr  +=  fd + fn[i] ;
      }
   }
   if(onmydomain(opener)) 
   opener.getselfile(selstr);
   close();
}

var helphints = null;
var hints = new Array(15);
 
if (typeof(helpinstro)!='undefined' &&  helpinstro!=null && helpinstro!="")
{
     helphints = helpinstro.split(/<.td><.tr>/);
}
 
if (helphints!=null)
{
  for (var j=0; j < helphints.length && j < 15;j++)
     hints[j] = helphints[j].replace(/.*<.td><td>/,"");
}
 
var alldivs = document.getElementsByTagName("div");
var headinghint = toolmsg660.split("@");
alldivs[1].onmouseover = function (){showmyhintstr(headinghint[0].replace(/.*:/,'') +"<br>" + textmsg[74]);}
alldivs[2].onmouseover = function (){showmyhintstr(headinghint[1].replace(/.*:/,'') +"<br>" + textmsg[74]);}
alldivs[3].onmouseover = function (){showmyhintstr(headinghint[2].replace(/.*:/,'') +"<br>" + textmsg[74]);}
alldivs[4].onmouseover = function (){showmyhintstr(headinghint[3].replace(/.*:/,'') +'<br>' );}
alldivs[5].onmouseover = function (){showmyhintstr(headinghint[4].replace(/.*:/,'') +"<br>" + textmsg[835]);}
alldivs[6].onmouseover = function (){showmyhintstr(headinghint[5].replace(/.*:/,'') +"<br>" + textmsg[74]);}
for (var i=1; i < 7; i++)
    alldivs[i].onmouseout = hidemyhint;

function appendRow(trstr)
{
    if (trstr==null||trstr=='')
        return;
     
    var nd =    document.createElement("tr");
    
    var r = maintbl.insertRow(2);
    var tdtd = trstr.replace(/^<td[^>]+>/i,'').replace(/<.td>$/i,'').split(/<.td><td[^>]*>/);
     
    for (var j=0; j < tdtd.length; j++)
    {
       var tdele =  r.insertCell(-1);// document.createElement("td");
        
       if (j==0 || j==2||j==5) tdele.setAttribute("align","center");
       else if (j==3||j==6) tdele.setAttribute("align","right");
       else   tdele.setAttribute("align","left");
       tdele.setAttribute("bgcolor", '#aadd88');
       tdele.innerHTML = tdtd[j];
       //nd.appendChild(tdele);
    }
   // var thetable = maintbl.getElementsByTagName("tbody")[0];
    
   // thetable.insertBefore(nd,thetable.childNodes[3]);
    
}
function downloadsyn()
{
   myprompt("<div style=\"float:left\"><img  src=image/filesyn.gif style=\"margin:2px 2px 2px 2px;border:1px #b0b0b0 solid\"></div>" + textmsg[852],null,"if(v)open('FileSynjar?dir=" + folder + "')");
}
function repln(j, c, newn, signn)
{

   if (j==-1) j += maintbl.rows.length;
   var tmp = maintbl.rows[j].cells[c].innerHTML;
   var tmpv = tmp.replace(/.*>([0-9]+)<.*/,"$1");
   var df = 0;
   if (signn=='')
   { 
      df = newn - parseInt(tmpv);
   }
   else if (signn=='+')
   {
      df = newn;
      newn += parseInt(tmpv);
   }
   else if (signn=='-') 
   {
      df = -newn;
      newn = parseInt(tmpv) - newn;
   }
   maintbl.rows[j].cells[c].innerHTML = tmp.replace(/>[0-9]+</, ">" + newn +"<");
   return df;
}

function replc(j, c, newn)
{
   if (j==-1) j += maintbl.rows.length;
   var tmp = maintbl.rows[j].cells[c].innerHTML;
    maintbl.rows[j].cells[c].innerHTML = tmp.replace(/<nobr>[^<]+</i, "<nobr>" + newn + "<");
   return newn;
}

let numsent = 0;
let fileLis = [];
let sendAFile = function () 
{
    if (numsent == fileList.length) 
    {
        myprompt(numsent + " files sent"); 
        f3.localpath.multiple = true;
        f3.localpath.value = null;
    } 
    else 
    {
        let file = fileList[numsent];
        var formData = new FormData();
        formData.append('file', file);
        formData.append('saveindir', document.form3.saveindir.value);
        formData.append('maximumsize', document.form3.maximumsize.value);
        formData.append('dummy', document.form3.dummy.value);
        formData.append('securitytoken', document.form3.securitytoken.value);
        formData.append('allcourse', document.form3.allcourse.value);

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function ()
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            {
                closeprompt();
                var j = xmlhttp.responseText.indexOf('<script');
                if (j < 0)
                    return;
                j = xmlhttp.responseText.indexOf('parent.', j);
                var k = xmlhttp.responseText.lastIndexOf('</script>');
                var jscodes = xmlhttp.responseText.substring(j + 7, k);
                jscodes = jscodes.replace(/parent\./g, '');
                eval(jscodes);
                numsent++;
                sendAFile();

            }
        };

        xmlhttp.open('POST', "UploadFile", true);
        myprompt("Sending " + fileList[numsent].name + "  (" + numsent +"/" + fileList.length + ")<br>" 
                + "<img style=float:center id=progress src=image/progress.gif>", null, null, toolmsg647);
        xmlhttp.send(formData); 
    }
};
 
function nooverwrite()
{
    
    if (numsent == -1)
    {
        numsent = 0;
        if (fileList != null && fileList.length > 0)
            sendAFile();
        
        return;
    }
    var tt = ''+fileList[numsent].name;
    var i = tt.lastIndexOf("/");
    var j = tt.lastIndexOf("\\");
    if (j > i) i = j;
    tt = tt.substring(i+1);
    for (i=0; i < N && tt!=fn[i]; i++)  ;
    if (i < N )
    {
        if (overwriteall == 'ask')
        {
            myprompt( tt + ": " + textmsg[836] 
                + "<br><input type=checkbox onclick=notaskagain(this) id=nomore > " 
                + textmsg[1925], null,"skipit(v)",toolmsg647);
        }
        else
        {
            fileList.splice(numsent,1);
            
            numsent--;
            nooverwrite();
        }
    } 
    else
    {
        numsent--;
        nooverwrite();
    }
}
function notaskagain(ck)
{
    overwriteall = ck.checked?'yes':'ask';
}
var overwriteall = 'ask';
function skipit(v)
{
    if (!v)
    {
        fileList.splice(numsent,1);
    }
    else
    {
        if (overwriteall == 'yes')
        {   
             numsent = 0;
             sendAFile();
             return;
        }
    }
    numsent--;
    nooverwrite();
}
function douploadm(btn)
{
    if( canload()  )
    {
        let fileInput = document.form3.localpath;
        if (fileInput.files == null || fileInput.files.length == 0)
            return;
        fileList = [];
        overwriteall = 'ask';
        for (let fn of fileInput.files)
        {
            fileList.push(fn);
        }
        numsent = fileList.length - 1;
        nooverwrite();
       
    }
}
function doupload(btn)
{
    if( canload()  )
    {
        visual(document.form3);
        document.form3.submit();
    } 
    
} 
 
function failupload1(str,leng)
{
    if (typeof(str) =='number')
    {
        var i = resizei;
        renull(fn[i], leng, url[i], str);
    }
    else
        myprompt('error' + str);
}
function loadicon(fn)
{
   
    maintbl.rows[2].cells[2].getElementsByTagName('div')[0].innerHTML = '';
    maintbl.rows[2].cells[2].getElementsByTagName('div')[0].style.background = 'url(FileOperation?did=' + did +') ' + fn2pos[fn];
}

function addedItem(fname,furl,len,ltime)
{
    if (typeof(activeeditingbox)=='undeifned' || activeeditingbox ==null )
    closeprompt();
    var fid = document.getElementById("pathfather");
    if (fid!=null)
    {
        var c=document.form3.localpath.style.cssText;
        
        fid.innerHTML = '<input type=file name=localpath   size=1 style="' + c + '" onchange="clickedhere(this);doupload()" >';
    }
    if (ltime!=null) 
        ltime =  Math.round( (new Date()).getTime()/1000);
    var dif = 0;
    var newtime = null;
    var i=0; for(; i < N && fn[i]!=fname;i++);

    if (len==null) len = 0;
    var needload = false;
    var lastrow = maintbl.rows.length-1;
    if (i < N)
    {
       ln[i]  = len;
       tstr[i] = (ltime==null)?"":ltime; ( ~~((new Date()).getTime()/1000));
       for (var j =0; j < maintbl.rows.length; j++)
       {
          if (maintbl.rows[j].cells[1].innerHTML.indexOf(">" + fname +"<") >0)
          {
             dif = repln(j,3,len,"");
             newtime = replc(j,6, timestr(tstr[i]));
             break;
          }    
       }
    }
    else
    { 
        
        if (isimage(fname))
        {
            var IN = Object.keys(fn2pos).length;
            var  rr =~~(IN/5), cc = IN%5;
            fn2pos[ fname ]='-' + (80*cc) + "px -" + (80*rr) + 'px'; 
            fn2size[ fname ]= ''; 
            
        }
       ln[N] = 0;
       if (furl!=null&&len!=null)
          ln[N] = len;
       fn[N] = fname;
       lock[N] = false;
       url[N] = (furl==null)?"":furl;
       tstr[N] =  ltime ;
       newtime = timestr(tstr[N]);
       var trstr = "";
       if(furl !=null)
          trstr = addFileRow(N);
       else
          trstr = folderrow(N);
       dif = len;
       
       appendRow(trstr);
       eval("cb[" + N +"] = f1.checkbox" + N );
       eval("locks[" + N +"]=f1.lockit" + N );
       N++;
       repln(-1,1,1,"+");
       resizei = N;
       if (isimage(fname))
       {
           maintbl.rows[2].cells[2].getElementsByTagName('div')[0].innerHTML = '<img src=image/progress.gif width=79>'; 
           needload = true;
       }
    }
    
    if (dif!=0)
    {
        repln(-1,2,dif,"+");
        repln(-1,3,dif,"-");
    }
    replc(-1,4,newtime);
    if (addedItem.caller == null || addedItem.caller.name.indexOf('renull') == -1)
    {
        //ResizeUploaded.uploaded("web/" + furl, fname + "@" + ltime );
        if (typeof(document.fpic) != 'undefined')
        {
            var tr = document.fpic.deleuppic.parentNode.parentNode;
            tr.deleteCell(2);
        }
    }
    if (needload)
    {
        setTimeout("loadicon('" + fname + "')",3000);
    }
 }
 
 function renull(fn, len, furl, ltime)
{
    addedItem(fn,furl,len, ltime) ;
    window.onbeforeunload= null;
    if (callingwindow!=null)
    {
        callingwindow.renull(fn, len, furl, ltime);
        callingwindow.focus();
    }
    else  
    {
        myprompt(toolmsg71);
    }
    callingwindow = null;
}
 
 function mouseDown(e)
 {
   if (parseInt(navigator.appVersion)>3)
   {
      var evt = navigator.appName=="Netscape" ? e:event;
      if (navigator.appName=="Netscape" && parseInt(navigator.appVersion)==4)
      {
         var mString =(e.modifiers+32).toString(2).substring(3,6);
         shiftPressed=(mString.charAt(0)=="1");
      }
      else
      {
         shiftPressed=evt.shiftKey;
      }
    }
    return true;
}

 document.onmousedown = mouseDown;
 if (navigator.appName=="Netscape" && parseInt(navigator.appVersion)==4)
    document.captureEvents(Event.MOUSEDOWN);

if (N >= 20 && parent==self)
{
  //window.moveTo(0,0);
  //window.resizeTo(screen.width, screen.height);
}
if (initialhintneed(4))
{
   var ugentmsg = initialhint(4);
}
 
 
var urltbl = document.getElementById("theurltbl");
if (urltbl!=null)
{
var Ninputs = document.form6.elements.length - 6;
hasurlselected = function()
 {
    var N = Math.round( (Ninputs - 1)/4);
    for (var i=0; i < N; i++)
    if(document.form6.elements[i*4+1].checked)
        return true;
    return false;
 }
var fitting = function()
{
    var x1 = Math.round( (urltbl.rows[0].cells[3].offsetLeft - urltbl.rows[0].cells[1].offsetLeft  )/2);
    for (var i=0; i < Ninputs; i++)
    {
        if (document.form6.elements[i].type.toUpperCase() == 'TEXT')
        {
            if (document.form6.elements[i].name.indexOf('cell1')>=0)
                document.form6.elements[i].style.width = (thispagewidth()/2) + 'px';
            else
                document.form6.elements[i].style.width =  (document.form6.elements[i].parentNode.offsetWidth-3) + 'px';
        }
    }
}

onresize = function ()
{
   for (var i=0; i < Ninputs; i++)
    {
        if (document.form6.elements[i].type.toUpperCase() == 'TEXT')
        {
            document.form6.elements[i].style.width =  '100px';
        }
    }
  for (var i=0; i < Ninputs; i++)
    {
        if (document.form6.elements[i].type.toUpperCase() == 'TEXT')
        {
            document.form6.elements[i].style.width =  (document.form6.elements[i].parentNode.offsetWidth-3) + 'px';
        }
    } 
}

function padd(s, l){ while (s.length < l) s += ' '; return s;}
function padd1(s, l){ while (s.length < l) s = ' '+s; return s;}
function saveurlchange()
{
    var N = Math.round( (Ninputs - 1)/4);
    var arr = new Array( N );
    var ml = 0;
    for (var i=0; i < N; i++)
    {
        var xl = document.form6.elements[i*4+2].value.length;
        if (xl > ml) ml = xl;
    }
    for (i=0; i < N; i++)
    {
        var xv = document.form6.elements[i*4+2].value;
        arr[i] = padd(xv, ml) + padd1('' + i, 4);
    }
    arr.sort();
    var str = '';
    for (i=0; i < N; i++)
    {
        var vl = arr[i];
        var vl1 = arr[i].substring(0, arr[i].length-4).replace(/[ ]+$/,'');
        var k = parseInt(arr[i].substring(arr[i].length-4).replace(/ /g,''));
        if (vl1 !='' && vl1!='http://' )
        {
           str  += (document.form6.elements[k*4+4].checked)? 'x':' ';
           if (document.form6.elements[k*4+3].value == '')
               document.form6.elements[k*4+3].value = vl1  ;
           if (document.form6.elements[k*4+3].value!='save')
           str += "<a href=\""  +  vl1 + "\" target=\"_blank\">" + document.form6.elements[k*4+3].value +"</a><br>\n";
        }
    }
    act = 'urls';
    document.form6.destination.value = str;
    formnewaction(document.form6,"FileOperation");
    visual(document.form6);
document.form6.submit();
}


 
function openthisurl(i)
{
    open(document.form6.elements[i*4+2].value, '_blank');
    needsaveurl = false;
}

for (var i=0; i < Ninputs; i++)
  document.form6.elements[i].onchange = function ()
  {
      needsaveurl = true;
      window.onbeforeunload = function (){return (textmsg[96]);};
  }

 

function checkall2()
 {
    var b = document.form6.check1.checked;
    for (var i = 0; i <  document.form6.urlchecks.length; i++)
    {
        document.form6.urlchecks[i].checked = b;

    }
 }
 
 function godeleteurl(v)
 {
    if (v)
    {
    var N = Math.round( (Ninputs - 1)/4);
    for (var i=0; i < N; i++)
    if(document.form6.elements[i*4+1].checked)
    {
       document.form6.elements[i*4+2].value = '';
       document.form6.elements[i*4+3].value = '';
       document.form6.elements[i*4+4].checked = false;
       document.form6.elements[i*4+1].checked = false;
       needsaveurl = true;
    }
    saveurlchange();
    }
 }
 var lasturlrow = urltbl.rows[N];

}
var needsaveurl = false;

function createwebsite(i)
{
   createwebsite1(initsitename,i);
}
function createwebsite1(x,i)
{
   myprompt( textmsg[1224] + "<br><b>" + websiteurl1.replace(new RegExp("/"+subsitename + "/.*$"),'/' + subsitename + '/') + "X</b><br> " + textmsg[1225] + " <b>X</b>  " + textmsg[1226],
            x, "createwebsite2(v," + i + ")", (i==0?textmsg[114]:'Rename'));
   setRoundedWidth(promptwin, 350);
}
function createwebsite2(v,i)
{
    if (v!=null && v!='')
    {
       if (i==0)
       {
           act = 'newsite';
           f2.operation.value = "newsite";
       }
       else
       {
           act = 'rensite';
           f2.operation.value = "rensite";
       }
       f2.destination.value = v;
       openwin();
       f2.target = "w" + tstmp;
       formnewaction(f2);
      visual(f2);
      f2.submit();
    }
}

function closewebsite()
{
     
     act = 'rensite';
     f2.operation.value = "clssite";
     openwin();
     f2.target = "w" + tstmp;
     formnewaction(f2);
    visual(f2);
 f2.submit();
}
function publish()
{
     act = 'publish';
     f2.operation.value = "publish";
     openwin();
     f2.target = "w" + tstmp;
     formnewaction(f2);
    visual(f2);
 f2.submit();

}
 
function addline()
{
    var utbl = document.getElementById("theurltbl");
    var x = utbl.rows[utbl.rows.length-2].cells[1].childNodes[0];
    if (x.value == 'http://')
    {
        x.focus();
        return;
    }
    var r = utbl.insertRow(utbl.rows.length-2);
    for (var j=0; j < 5; j++)
    {
       var c = r.insertCell(-1);
       c.innerHTML = utbl.rows[utbl.rows.length-3].cells[j].innerHTML.replace(/cell([1|2])/,'cell$1'+ (utbl.rows.length-2)) ;
    }
   // utbl.rows[utbl.rows.length-2].cells[1].childNodes[0].value = "http://";
   // utbl.rows[utbl.rows.length-2].cells[2].childNodes[0].value = "about";
    utbl.rows[utbl.rows.length-1].cells[1].innerHTML = (utbl.rows.length-2);
}
var oldgetBounce = getBounce;
getBounce = function(t)
{
    oldgetBounce(t);
    helpsave();
    var callerFunc = arguments.callee.caller.toString();
}
 
 
function helpsave(wn, nm, vl)
{
    if (wn!=null)
    {
        callingwindow = wn;
    }
    if (vl!=null)
    {    
        document.form2.destination.value =vl;
    }
    document.form2.target = "w" + tstmp;
    document.form2.operation.value = "save";
    if (nm!=null)
    {
        document.form2.filedir.value = nm;
    }
    formnewaction(f2);
    visual(document.form2);
    document.form2.submit();
    return nm;
}
var whichtimeoption = 0;
var timeperiod = 1;
function showtimeopt(b,i,j)
{
    
    whichtimeoption = i;
    document.backupform.startstr.disabled = (i!=3);
    document.backupform.endstr.disabled = (i!=3);
    document.getElementById('timeopt').style.visibility =b? "visible":"hidden";
    if (j!=null) timeperiod = j;
    
}

var starttime = timestr(Math.round((new Date()).getTime()/1000)-365*24*3600);
var endtime = timestr(Math.round((new Date()).getTime()/1000));

function backup()
{
    var timenow = ((new Date()).getTime() );
    var str = textmsg[1726].split(/@/);
    var xs = textmsg[1729].split(/@/);
     var x = '<select name=timeperiod onchange=changeperiod(this)><option value=0>0</option><option value=1>1</option><option value=2>2</option><option value=7>7</option><option value=10>10<option value=15>15</option><option value=30>30</option></select>';
   // document.getElementById('dropboxperd').innerHTML = textmsg[1731].replace(/@/, x.replace(new RegExp('([^0-9])'+backupperiod + '>'), "$1"+backupperiod + " selected >"));
    x =x.replace(new RegExp('([^0-9])'+backupperiod + '>'), "$1"+backupperiod + " selected >");
    x = textmsg[1731].replace(/@/, x);
    
    var t = "<table id=optionprom><tr><td class=outset3><form rel=opener name=backupform action=FileOperation method=post  >" + 
    "<input name=start value=" 
            +(timenow-3600000*48) 
            + " type=hidden><input name=end value=" 
            + timenow + " type=hidden><input name=operation value=backup type=hidden>" + 
    "<input name=filedir value=\"\" type=hidden>" + 
    "<input name=destination value=\"\" type=hidden>" + 
    "<input name=orgnum value=\"" + orgnum + "\" type=hidden><input name=folder value=\"\" type=hidden><br>" + xs[0] +
   ":<br><table border=0><tr><td><input name=timeperiod type=radio value=2 checked  onclick=showtimeopt(false,0,2)></td><td>" + str[0] + "</td></tr><tr><td>" + 
            "<input name=timeperiod  type=radio value=7   onclick=showtimeopt(false,1,7)></td><td>" 
            + str[1] + "</td></tr><tr><td>" 
            +  "<input name=timeperiod  type=radio value=inf  onclick=showtimeopt(false,2)></td><td>" 
            + str[2] + "</td></tr><tr><td>" 
            + "<input name=timeperiod  type=radio value=-1 onclick=showtimeopt(true,3)></td><td><nobr>" 
            + str[3] + 
            "</nobr></td></tr><tr><td></td><td><table id=timeopt style=\"visibility:hidden;display:inline\"><tr><td><nobr>" 
            + toolmsg400 + "</nobr></td><td><input name=startstr  disabled  size=14 style=\"border:1px #707070 solid\" value=\"" 
            + starttime + "\"  ></td> <td><nobr>" 
            + toolmsg402 + "</nobr></td><td><input name=endstr disabled size=14 style=\"border:1px #707070 solid\"  value=\"" 
            + endtime + "\"  ></td></tr></table></td></tr></table>";
    t+= "<br><br><nobr>" + xs[1] + "</nobr>:<br><input name=wheretogo type=radio  checked   value=download>" + xs[2]  
             +    "<br><input name=wheretogo type=radio value=dropbox onclick=showperiod(this)><nobr>dropbox.com <span id=periodconf style=visibility:hidden><a href=javascript:config()>" 
             + textmsg[1737] + "</a></nobr></span>";
    t += "<br><div id=periodspan  style=visibility:hidden><span id=dropboxperd>" + x + "</span><div id=dropboxtimes></div></div>";
    t+= "<br></form></td></tr></table><br>";
    t+= "<center><input type=button class=OrangeButton style=width:80px value=\"" + toolmsg78 + "\" onclick=gobackup()>";
    t+= "<input  type=button  class=GreenButton style=width:80px value=\"" + textmsg[18] + "\" onclick=closeprompt()></center><br>";
    myprompt(t,null,null,toolmsg78);
    
}
function showperiod(rd)
{
     
    document.getElementById('periodconf').style.visibility = 'visible';
    document.getElementById('periodspan').style.visibility = 'visible';
    
}
function changeperiod(sel)
{
     backupperiod = parseInt(sel.options[sel.selectedIndex].value);
     if (backupperiod == 0){  backupperiod = -1;}
     postopen('FileOperation?operation=dropbox&orgnum=' 
            + orgnum + '&filedir=&destination=&folder=&backupperiod=' + backupperiod,'w' + tstmp);
    
}
function gobackup()
{
    var timenow = ((new Date()).getTime() );
    if (whichtimeoption ==0)
    {
       document.backupform.start.value = ''+ (timenow - 3600000*48); 
       document.backupform.end.value = ''+timenow;
      
    }
    else  if (whichtimeoption ==1)
    {
       document.backupform.start.value =  ''+(timenow - 3600000*24*7); 
       document.backupform.end.value = ''+ timenow;
    }
    else  if (whichtimeoption ==2)
    {
       document.backupform.start.value =  '0'; 
       document.backupform.end.value = ''+ timenow;
    }
    else
    {
        var t1 = parseTime(document.backupform.startstr.value);
        if (t1==invalidtimevalue)
        {
            document.backupform.startstr.focus();
            return;
        }
        document.backupform.start.value = t1*1000;
        t1 = parseTime(document.backupform.endstr.value);
        if (t1==invalidtimevalue)
        {
            document.backupform.endstr.focus();
            return;
        }
         document.backupform.end.value = t1*1000;
    }
     
    formnewaction(document.backupform);
    document.backupform.target='w' + tstmp;
    visual(document.backupform);
   // document.backupform.submit();
    sendbyajax(document.backupform); 
}
function syserror(s){myprompt(s);}
function config()
{
    promptwin.style.left = '0px';
    var str = textmsg[1728].split(/@/);
    var tbl = document.getElementById('optionprom');
    tbl.rows[0].cells[0].className = 'outset3';
    tbl.cellSpacing='5';
    tbl.cellPadding = '3';
    var r = tbl.rows[0].insertCell(-1);
    r.vAlign = 'top';
    r.className = 'outset3';
    r.innerHTML = textmsg[1727] + "<form rel=opener name=dropboxform action=FileOperation method=post target=\"w" + tstmp + "\"   ><input name=operation value=dropbox type=hidden>" + 
    "<input name=orgnum value=\"" + orgnum + "\" type=hidden><input name=filedir value=\"\" type=hidden>" + 
    "<input name=destination value=\"\" type=hidden>" + 
    "<input name=folder value=\"\" type=hidden><table id=dropboxkeys><tr><td><nobr>" +   
            str[0] +
            "</nobr></td><td><input name=appkey1 size=15 style=\"border:1px #707070 solid\" ></td><td><input name=appkey type=hidden></td></tr><tr><td><nobr>" + 
            str[1] + 
            "</nobr></td><td><input name=appsecret1  size=15  style=\"border:1px #707070 solid\" ></td><td><input name=appsecret  type=hidden></td></tr><tr><td><nobr>" + 
            str[2] + 
            "</nobr></td><td><input name=accesstoken1  size=25  style=\"border:1px #707070 solid\" ></td><td><input name=accesstoken  type=hidden></td></tr><tr height=40><td valign=bottom colspan=2 align=center><input class=OrangeButton style=width:80px value=\"" + 
            textmsg[225] + "\" type=button onclick=updatedropbox()  ></td></tr><tr ><td colspan=2 align=center>*<font size=2>" + textmsg[1730] + "</font></td></tr></table></form>";
}
function updatedropbox()
{
    document.dropboxform.appkey.value = encryptString(document.dropboxform.appkey1.value.replace(/^[ ]+/,'').replace(/[ ]+$/,''));document.dropboxform.appkey1.disabled=true;
    document.dropboxform.appsecret.value = encryptString(document.dropboxform.appsecret1.value.replace(/^[ ]+/,'').replace(/[ ]+$/,''));document.dropboxform.appsecret1.disabled=true;
    document.dropboxform.accesstoken.value = encryptString(document.dropboxform.accesstoken1.value.replace(/^[ ]+/,'').replace(/[ ]+$/,''));document.dropboxform.accesstoken1.disabled=true;
    
    formnewaction(document.dropboxform );
    document.dropboxform.target = 'w' + tstmp;
    visual(document.dropboxform);
    //document.dropboxform.submit();
    sendbyajax(document.dropboxform);
}

function dropboxmsg(s)
{
    var tbl = document.getElementById('dropboxkeys');
    if(tbl!=null && tbl.rows.length > 4)
    {
    tbl.rows[4].cells[0].innerHTML = s;
    document.dropboxform.appkey1.disabled=false;
    document.dropboxform.appsecret.disabled=false;
    document.dropboxform.accesstoken.disabled=false;
    }
    else 
    {
        tbl = document.getElementById('dropboxtimes');
         
        if (tbl!=null)
         tbl.innerHTML = s;
    }
}

function showtbl0(rd)
{
    document.getElementById('timeopt').style.visibility=(!rd.checked?'visible':'hidden');
    if (rd.checked)
    document.getElementById('samefile').style.height = "1px";
    document.getElementById('samefile').style.visibility=(!rd.checked?'visible':'hidden');
    
}
function showtbl(rd)
{
    document.getElementById('timeopt').style.visibility=(rd.checked?'visible':'hidden');
    if (rd.checked)
    document.getElementById('samefile').style.height = null;
    document.getElementById('samefile').style.visibility=(rd.checked?'visible':'hidden');
    
}
 
function restore()
{
    Msg.send({code:'new',msg:filerestore});
    Msg.needmore = true;
   formdeletestr();
   var ys = textmsg[1735].split(/@/);
   var override = "<table ><tr><td  ><nobr>" + ys[0] + "</nobr><br><input type=radio checked value=override name=destination><nobr>" 
   + ys[1] + "</nobr><br><input type=radio value=copy name=destination><nobr>"
   + ys[2] + "</nobr><br><input type=radio value=ignore name=destination><nobr>"
   + ys[3] + "</nobr></td></tr>"
   + "<tr><td ><table width=140 align=center><td name=gobtn class=GreenButton  style=\"width:70px;text-align:center\"  onclick=godropboxrestore() ><nobr>" 
   + textmsg[66] + "</nobr></td>"
   + "<td   style=\"width:70px;text-align:center;color:blue;text-decoration:underline\" onclick=getstatus() >" 
   + textmsg[1736] + "</td></tr></table></td></tr></table>";
   
   
   if (selstr=='') 
   {
       var timenow = (new Date()).getTime();
       var st = (timenow - 3600000*1000 );
       var et = timenow;
       var xs = textmsg[1734].split(/@/);
       var timeformat0 = timeformat;
       timeformat = timeformat.replace(/hh:mm/,'');
       var ys = textmsg[1735].split(/@/);
       myprompt("<div class=outset3 style=\"margin:4px 4px 4px 4px\"><form rel=opener name=restorfrm action=FileOperation method=post  >"
               +"<input name=folder  type=hidden value=\"\">"
               +"<input name=filedir  type=hidden value=\"\">"
               + "<input name=start value=" + st + " type=hidden><input name=end value=" + et + " type=hidden>"
               +"<input name=operation  type=hidden value=restore><div style=\"margin:2px 3px 2px 3px\" ><nobr>" 
               + xs[0] + "</nobr><br><br><input type=radio name=filesource value=1 checked  onclick=\"javascript:showtbl0(this)\" >" 
               + xs[1] + "<br>" + "<input type=radio  name=filesource onclick=\"javascript:showtbl(this)\" value=2>" 
               + xs[2] +  "</div><table id=timeopt  style=visibility:hidden align=center>"
               +"<tr><td width=20%><nobr>" + toolmsg400 + "</nobr></td>"
               +"<td width=30%><input name=startstr   disabled  size=10 style=\"border:1px #707070 solid\" value=\"" + timestr(st/1000) + "\"  ></td>"   
              + "<td width=20%><nobr>" + toolmsg402 + "</nobr></td>"
              + "<td width=30%><input name=endstr disabled size=10 style=\"border:1px #707070 solid\"  value=\"" + timestr(et/1000 ) + "\"  ></td></tr></table></div>"
              + "<div class=outset3 style=\"margin:4px 4px 4px 4px;visibility:hidden;height:1px\" id=samefile>" + override   +  "</form></div>", null,null,toolmsg80);
       timeformat = timeformat0;
        promptwin.style.top = "0px";
   }
   else 
   {
    myprompt("<div class=outset3  style=\"margin:4px 4px 4px 4px\"><form rel=opener name=restorfrm action=FileOperation method=post  >"
               +"<input name=folder  type=hidden value=\"\">"
               +"<input name=filedir  type=hidden value=\"\">"
               +"<input name=operation  type=hidden value=restore>"
              + override +  "</form></div>", null,null,toolmsg80);
  }
 
}

 
function dorestore()
{ 
   document.restorfrm.filedir.value= selstr;
   document.restorfrm.operation.value = 'restore';
   document.restorfrm.target = "w" + tstmp;
   valid = true;
   formnewaction(document.restorfrm);
   visual(document.restorfrm);
   //document.restorfrm.submit();
   sendbyajax(document.restorfrm);
}

function getstatus()
{
    Msg.send({code:'snap',msg:filerestore});
}

Msg.handlepost = function(s)
{
    var m = new Message(s);
    if (m.code == "newd")
    {
        Msg.tid = m.tid;
        if (''+m.tid !='-1')
        {
            Msg.listen();
        }
    } 
    else if (m.code == 'snap')
    {
        var seg = m.msg.split(/\|/);
        var x = textmsg[1646].split(/@/);
        for (var i=1; i < 4; i++)
        seg[i] = seg[i].replace(/<table/, '<table width=100% border=1 style=border-collapse:collapse;border-radius:3px;background-color:white');
        addpromptmsg("<table width=100% class=outset3><tr><td>" + x[0] +seg[1]+ "</td></tr> <tr><td>" + x[1] +seg[2]+ "</td></tr><tr><td>" + x[2] +seg[3]+ "</td></tr></table>");
         
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
       addpromptmsg(m.msg);
    }    
   
}

function godropboxrestore()
{
    if (typeof(document.restorfrm.startstr)=='undefined')
    {
        dorestore(); return;

    }
    
    var t1 = parseTime(document.restorfrm.startstr.value )*1000;
    if (t1!=invalidtimevalue)document.restorfrm.start.value = t1 ;
    else
    {
        myprompt("");
        document.restorfrm.start.focus();
        return;
    }
    t1 = parseTime(document.restorfrm.endstr.value)*1000;
    if (t1!=invalidtimevalue)document.restorfrm.end.value = (t1 + 3600000*24-1);
    else
    {
        myprompt("");
        document.restorfrm.end.focus();
        return;
    }
    
    document.restorfrm.target =  'w' + tstmp;
    formnewaction(document.restorfrm, 'FileOperation');
    visual(document.restorfrm);
   // document.restorfrm.submit();
    sendbyajax(document.restorfrm);
}
var onloadbeforewebf = null;
if (typeof window.onload == 'function')
    onloadbeforewebf = window.onload;
window.onload = function ()
{
    if (onloadbeforewebf != null) 
        onloadbeforewebf();
    
    Msg.init({stoken:securitytoken,
    app:"chat",
    tid:'',
    sid:uid,
    sname:uid,
    rid:'',
    code:'',
    msg:'',
    key:keystr,
    sendhandle:'Msgretrive',
    sek:sek});
    Msg.recevhandle = 'Msgretrive';
    var w = thispagewidth()/2;
     for (var i=0; i < Ninputs; i++)
    {
       if (document.form6.elements[i].type.toUpperCase() == 'TEXT')
        {
            if (document.form6.elements[i].name.indexOf('cell1')>=0)
                document.form6.elements[i].style.width = (w-100) + 'px';
            else
                document.form6.elements[i].style.width =  (w-170) + 'px';
        }
    }
    
    if (parent!=window && parent.frames[1] == window && parent.frames[0].demokeyframen>0)
    {
        maketasks();
        demospeedup = parent.frames[0].demospeedup;
        demo();
        
    }
} 

var oldonclose13 = window.onunload;
window.onunload = function()
{
    
    if (oldonclose13!=null)
        oldonclose13();
    updateLock();
    if (parent.frames!=null && parent.frames.length==2 && selfile==false && Msg.code!='' && Msg.msg!='' && Msg.tid!='')
    {
        parent.frames[0].quitm(Msg.tid);
    }
}
var tbl0;
 
function showhints(i)
{
    hidemyhint(); 
    var cell = ('' + tbl0.rows[0].cells[i].onmouseover).replace(/[\n|\r]/g,'');
    var xy = findPositionnoScrolling(tbl0);
    var cell1 = cell.replace(/.*(showmyhint\([0-9]+).*/,'$1,1)');
    myHintx = xy[0]+i*tbl0.offsetWidth/10;
    myHinty = 100;
    if (cell!=cell1)
    {
        eval(cell1); 
    }
}
 
 
function thebutton()
{
    return promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[2].cells[0].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('input')[1]; 
}
 

function getelebyname(t,n)
{
    if (t==null || t.tagName == null || t.tagName.toLowerCase() == 'img' || t.tagName.toLowerCase() == 'input')
        return null;
    
    var xs = t.getElementsByTagName('input');
    
    if (xs == null)
    {
        var y = t.childNodes;
        if (y!=null && y.length>0)
        {
            for (var j=0; j < y.length; j++)
            {
                var z = getelebyname(y[j],n);
                if (z!=null) return z;
            }
        }
        return null;
    }
     
    if (xs!=null && xs.length>0 && typeof(xs[0].name)!='undefined' && xs[0].name == n) 
    {
        return xs;
    }
    return null;
}

var tm ;
if (typeof(xy)=='undefined') var xy = [0,0];
function maketasks()
{
tbl0 = document.getElementById('tbl0');
var N = (tbl0.rows[0].cells.length); 
var nu = 0;
demotasks[nu++] = ["closeprompt();democursorx = 0; democursory = 60; democursor2(document.form1.check1);", 0];
demotasks[nu++] = ["myHintx = 40; myHinty = 150; showmyhintstr(textmsg[1837],1)", 2000];
//demotasks[nu++] = ["hidemyhint();", 3000];

for (var ii =0; ii < N; ii++) 
{
    demotasks[nu++] = ["closeprompt();democursor2(tbl0.rows[0].cells[" + ii + "],2)", 3000];
    demotasks[nu++] = ["showhints(" + ii + ")",(1000 + (ii==0?1000:0)) ];
}
demotasks[nu++] = ["hidemyhint();demoheight(0.7);showhelp();tm = parseInt(promptwin.style.zIndex) + 1; democursorsim.style.zIndex = tm",2000],
demotasks[nu++] = ["demoheight(1); xy = findPositionnoScrolling(promptwin); tm = democursor2(xy[0]+100,xy[1]+10)", 500],
demotasks[nu++] = ["democursor2(xy[0]+200,xy[1]+100)", 3000];
demotasks[nu++] = ["democursor2(xy[0]+200,xy[1]+200)",2000];
demotasks[nu++] = ["democursor2(xy[0]+200,xy[1]+400)",1000];
demotasks[nu++] = ["democursor2(xy[0]+200,xy[1]+600)",1500];
demotasks[nu++] = ["democursor2(xy[0]+200,xy[1]+750)",1500];
demotasks[nu++] = ["democursor2(xy[0]+10,xy[1]+10)",1500];
demotasks[nu++] = ["demoheight(0.7)", 4500];
demotasks[nu++] = ['demoheight(1);closeprompt();democursor2(document.getElementById("newfiletd"),2)', 500];
demotasks[nu++] = ['demoheight(0.7);newfile(toolmsg766)',2000],
demotasks[nu++] = [ "demoheight(1);tm = parseInt(promptwin.style.zIndex) + 1; democursorsim.style.zIndex = tm; democursor2(getelebyname(promptwin,'isfig')[2],8)",500];
demotasks[nu++] = ["demoheight(0.7);changefiletype(getelebyname(promptwin,'isfig')[2]);getelebyname(promptwin,'isfig')[2].checked= true",3000];
demotasks[nu++] = ["demoheight();democursor2(thebutton(),2)",500];
demotasks[nu++] = ["demoheight(0.7);thebutton().click()", 1500];
demotasks[nu++] = ["demoheight();demoremovesim()", 600];
}