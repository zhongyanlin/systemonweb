openitup = function(param,url)
{
   url += param;
   open(url, "_blank");
}

function writenote(s)
{
   if (s.replace(/ /g,'')!='')
   {
      s = "<div style=\"float:left\"><img src=image/guide1.gif height=60></div>" + s ;
      myprompt(s,null,null,textmsg[191]);
      promptwin.style.left= (6) + 'px';
      promptwin.style.top = (6) + 'px';
      setRoundedWidth(promptwin, 500);
   }
}

 

var f = document.form1;


var oldbutton = null;
function sinkbut(btn)
{
   if (oldbutton!=null) oldbutton.style.borderStyle = "outset";
   btn.style.borderStyle = "inset";
   oldbutton = btn;
}

 
function visible(b)
{
 /*  var t = document.getElementById("lbl");
   if (t!=null)
      t.style.visibility = b;
   f.rdap.style.visibility = b;
   f.showbtn.style.visibility = b;
   
   f.permitbtn.style.visibility = b;
   f.deletebtn.style.visibility = b;
   f.newbtn.style.visibility = b;
   f.renamebtn.style.visibility = b;
    */
}
//if (hasone==false) visible('hidden');
var formname = "";
var valid = false;
function validate ()
{
   return valid;
}
function currentform()
{
   if (f.rdap.selectedIndex < 0) return '';
   return f.rdap.options[f.rdap.selectedIndex].value;
}
function getTitle()
{
   if (f.rdap.selectedIndex < 0) return '';
   return f.rdap.options[f.rdap.selectedIndex].value;
}
function newform()
{
   open("webwizard.jsp?mode=7", "subwin");
}

function syn()
{
    
}

function  selectone()
{
   if (f.rdap.selectedIndex == 0)
   {
      myprompt(msg206);
      setRoundedHeight(  promptwin, 80);
      f.rdap.focus();
      valid  = false;
      return false;
   }
   return true;
}
var formname1;
var hasconfirmed = false;
function delete1()
{
   if (selectone() == false)
      return;
   myprompt(msg1278  + "?", null, "if(v)godelete1()");
   setRoundedHeight(  promptwin, 80);
}

function godelete1()
{
   f.mode.value = "14";
   valid  =  true;
   if (f.rdap.selectedIndex < 0) return;
   formname1 = f.rdap.options[f.rdap.selectedIndex].value;
   f.target = "subwin";
   if (validate())
   {
      formnewaction(f);
     visual(f);
 f.submit();
   }
}
function def()
{
   if (selectone())
   {
      var tn = f.rdap.options[f.rdap.selectedIndex].value;
      parent.frames[1].document.location.href="webwizard.jsp?mode=3&rdap=" + tn;
      document.location.href="webwizard.jsp?mode=9&fromm=3&rdap=" + tn;

   }
}



function url()
{
    if (!selectone())
    {
      return "";
    }
      var act = [textmsg[841],textmsg[842],textmsg[843],textmsg[846],textmsg[844],textmsg[845]];
      var tn = f.rdap.options[f.rdap.selectedIndex].value;
      var base = ("" + document.location).replace(/webwizard.jsp.*/, "Form?rdap=" + tn + subdb );
      //han = window.open("Form?rdap=" + tn + subdb, "subwin");
      return   "<tr><td class=fieldhead>"
      + textmsg[865] + "</td><td class=fieldhead>" + msg923 + "</td></tr><tr><td class=fieldlbl><nobr>"
      + act[0] + "</nobr></td><td class=fieldlbl>     <a href=Form?rdap=" + tn + subdb + "&df=1  target=_blank >"            + base + '&df=1</a></td></tr><tr><td  class=fieldlbl><nobr>'
      + act[1] + "</nobr></td><td class=fieldlbl><nobr><a href=\"Form?rdap=" + tn + subdb +"&df=1&ac=s\" target=_blank>"        + base + "&df=1&ac=s</nobr></a></td></tr><tr><td  class=fieldlbl><nobr>"
      + act[2] + "</nobr></td><td class=fieldlbl><nobr><a href=\"Form?rdap=" + tn + subdb +"&df=1&ac=r\" target=_blank>"        + base + "&df=1&ac=r</nobr></a></td></tr><tr><td  class=fieldlbl><nobr>"
      + act[3] + "</nobr></td><td class=fieldlbl><nobr><a href=\"javascript:myprompt(textmsg[847],'1', 'open(\\'Form?rdap=" + tn + subdb +"&df=1&ac=r\\'+v,\\'_blank\\')')\">"+ base + "&df=1&ac=ri</a></nobr></td></tr><tr><td  class=fieldlbl><nobr>"
      + act[4] + "</nobr></td><td class=fieldlbl><nobr><a href=\"javascript:myprompt(textmsg[847],'1', 'open(\\'Form?rdap=" + tn + subdb +"&df=1&numrows=1&ac=u\\'+v,\\'_blank\\')')\">"+ base + "&df=1&ac=ui</a></nobr></td></tr><tr><td  class=fieldlbl><nobr>"
      + act[5] + "</nobr></td><td class=fieldlbl><nobr><a href=\"javascript:myprompt(textmsg[847],'1', 'open(\\'Form?rdap=" + tn + subdb +"&df=1&numrows=1&ac=d\\'+v,\\'_blank\\')')\">"+ base + "&df=1&ac=di</a></nobr></td></tr>"
      ;
}
function show()
{

    if (!selectone())
    {
       valid = false;
    }
    else
    {
       f.target = "subwin";
       f.mode.value = "10";
       valid = true;
       formnewaction(f);
      visual(f);
 f.submit();
    }
}


function ren()
{
   if (selectone())
   {
      f.mode.value = "7";
      f.target = "subwin";
      valid = true;
      formnewaction(f);
     visual(f);
 f.submit();
   }
   else valid = false;
}


function modify()
{
   if (selectone())
   {
      f.mode.value = "9";
      f.target = "subwin";
      formname = f.rdap.options[f.rdap.selectedIndex].value;
      valid = true;
      
   }
   else valid = false;
}

function permit()
{
   if (selectone()){
   var tt = "DataTable?rdap=permitdf&numrows=5" + subdb.replace(/&cdrdap=1/,'')
        + "&rdapname=" + encodeURIComponent(f.rdap.value)
        + "&onbegin=60"  
        + "&onsave=61"   
        + "&onsaved=62"  
        + "&cellonblur=63"  
        + "&exbut=c";
    postopen(tt,"subwin");

   }
}
function menupermit(tk)
{
   var roles= justopenedwindowhandle.retrv(0,1);
   
   open("wordform.jsp?rdap=" + f.rdap.value +"&roles=" + roles + "&mode=11","savewindow");
}
function assemble()
{
   var s='',tt, i=0;
   tt= justopenedwindowhandle.retrv(0,4).replace(/[ ]*,[ ]*/g, ","  + "+").replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[ ]+/g, "");
   if (tt!='')
   {
          tt  =  '+'+tt;
          if (s!='') s += ",";
          s+=  tt;
   }
   tt = justopenedwindowhandle.retrv(0,5).replace(/[ ]*,[ ]*/g, ","  + "-").replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[ ]+/g, "");
       if (tt!='')
       {
          tt  =  '-' + tt;
          if (s!='') s += ",";
          s +=  tt;
       }
   justopenedwindowhandle.setv(0, 3, s);
   
   s = '';
   var r = [0,2, 1, 3, 4];
   for (i=1; i <= 4; i++)
   {
       tt= justopenedwindowhandle.retrv(i,4).replace(/[ ]*,[ ]*/g, "," + r[i] + "+").replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[ ]+/g, "");
       if (tt!='')
       {
          tt  = r[i] + '+' + tt;
          if (s!='') s += ",";  
          s+=  tt;
       }
       tt = justopenedwindowhandle.retrv(i,5).replace(/[ ]*,[ ]*/g, "," + r[i] + "-").replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[ ]+/g, "");
       if (tt!='')
       {
          tt  = r[i] + '-' + tt;
          if (s!='') s += ",";  
          s +=  tt;
       }
   }
   
   justopenedwindowhandle.setv(3, 3, s);

   s = '';
   for (i=1; i <= 3; i++)
   {
       tt= justopenedwindowhandle.retrv(2,4).replace(/[ ]*,[ ]*/g, "," + i + "+").replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[ ]+/g, "");
       if (tt!='')
       {
          tt  = i + '+' + tt;
          if (s!='') s += ",";
          s+=  tt;
       }
       tt = justopenedwindowhandle.retrv(2,5).replace(/[ ]*,[ ]*/g, "," + i + "-").replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[ ]+/g, "");
       if (tt!='')
       {
          tt  = i + '-' + tt;
          if (s!='') s += ",";
          s +=  tt;
       }
   }
   {   tt= justopenedwindowhandle.retrv(1,4).replace(/[ ]*,[ ]*/g, "," + 4 + "+").replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[ ]+/g, "");
       if (tt!='')
       {
          tt  = 4 + '+' + tt;
          if (s!='') s += ",";
          s+=  tt;
       }
       tt = justopenedwindowhandle.retrv(1,5).replace(/[ ]*,[ ]*/g, "," + 4 + "-").replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[ ]+/g, "");
       if (tt!='')
       {
          tt  = 4 + '-' + tt;
          if (s!='') s += ",";
          s +=  tt;
       }
   }
   justopenedwindowhandle.setv(2, 3, s);
   s = '';
   for (i=1; i <= 4; i++)
   {
       tt= justopenedwindowhandle.retrv(1,4).replace(/[ ]*,[ ]*/g, "," + i + "+").replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[ ]+/g, "");
       if (tt!='')
       {
          tt  = i + '+' + tt;
          if (s!='') s += ",";
          s+=  tt;
       }
       tt = justopenedwindowhandle.retrv(1,5).replace(/[ ]*,[ ]*/g, "," + i + "-").replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[ ]+/g, "");
       if (tt!='')
       {
          tt  = i + '-' + tt;
          if (s!='') s += ",";
          s +=  tt;
       }
   }
   justopenedwindowhandle.setv(1, 3, s);
   for (i=0; i < 4; i++) justopenedwindowhandle.setvaluechanged(i,true);
}

function redo(mat)
{
   if (mat==null || mat.length==0 || mat[0].length < 5)
   {
      myprompt(f.rdap.value + " " + notexist);
      return;
   }
   var i,j;
   var arr = mat[1][3].split(",");
   var r = [0,2, 1, 3, 4];
   var v = new Array(8);
   for ( i=0; i < 8; i++) v[i]='';
   for (var k=0; k < arr.length; k++)
   {
      i = r[parseInt(arr[k].charAt(0))]-1;
      j = (arr[k].charAt(1)=='+')?0:1;
      v[i*2 + j] += ","+arr[k].substring(2);
   }

   for ( i=0; i < 8; i++)
   {
      var x = v[i];
      if (v[i]!='')
         v[i] = v[i].substring(1);
      mat[Math.floor(i/2)+1][4+(i%2)] = v[i];
   }
   for ( i=0; i < 2; i++) v[i]='';
   arr = mat[0][3].split(",");

   for (k=0; k < arr.length; k++)
   {
      j = (arr[k].charAt(0)=='+')?0:1;
      v[j] += ","+arr[k].substring(1);
   }
   for ( i=0; i < 2; i++)
   {
      x = v[i]; if (v[i]!='') v[i] = v[i].substring(1);
      mat[0][4+i] = v[i];
   }
   for (i=0; i < 4; i++) justopenedwindowhandle.setvaluechanged(i,true);
}

function disablediscard()
{
    if (formname!='')
     writenote(msg1283);
}
function removeone()
{
   
   var k=0,N = f.rdap.options.length;
    
   for (k=0; k < N; k++)
   {
      if (k == f.rdap.selectedIndex)
      {
         f.rdap.options[k] = null;
         break;
      }
   }
}

var remind = "";
function notesrc()
{
   if (srcs!='')
   {
      
      writenote( lblupload + "  " +  srcs  );
      f.savebtn.value=capupload;
   }
   else
      formname = '';
}
function addone(str)
{
   var k = f.rdap.options.length;
   for (var i=0; i < k; i++)
      if (f.rdap.options[i].value==str)
      {
         f.rdap.selectedIndex = i;
         return;
      }
   f.rdap.options[k] = new Option(str,str);
   f.rdap.selectedIndex = k;
}

function rename(oldn,newn)
{

   var k=0,N = f.rdap.options.length;

   for (k=0; k < N; k++)
   {
      if (f.rdap.options[k].value==oldn)
      {
         f.rdap.options[k] = new Option(newn,newn);
         f.rdap.selectedIndex = k;
         break;
      }
   }
}




function savetemp()
{
   document.form1.mode.value = "17";
   document.form1.title.value = parent.frames[1].getTitle();
   document.form1.fieldstr.value = parent.frames[1].getFieldstr();
   parent.frames[1].obeforeunload = null;
   document.form1.target = parent.frames[1].frames[0].name;
   formnewaction(document.form1);
   visual(document.form1);
document.form1.submit();
   return true;
}

var elem = document.form1.elements;
for (var i=0; i < elem.length; i++)
{
     if(elem[i].type.toLowerCase() == 'button' || elem[i].type.toLowerCase() == 'submit')
    elem[i].style.cssText = "height:" + (font_size+4) + 'px;vtextalign:center';
}
if (typeof (buttonhints) != 'undefined')
{
var schedhandle = new Array();
var schstatus = new Array();
var alllblpos = new Array();
var hints = new Array();
var schbuttonnums = 0;
var schinverse = function(i)
{
    var j=0; for (; j < schbuttonnums; j++)
        if (alllblpos[j] == i)
            return j;
    return -1;
}
var existingmy = myHintMove;
myHintMove = function(){existingmy();myHintdiv.style.top = "6px";}
function addmouseevents(ele)
{
 if (ele==null ) return;
  
 if (typeof(ele.tagName) != 'undefined' && ele.tagName != null
 && ele.tagName.toLowerCase().indexOf("td") >= 0 &&
 typeof(ele.className) != 'undefined' && ele.className != null
 && ele.className.toLowerCase().indexOf("button") >= 0)
 {
    var nm = ele.innerHTML.replace(/^\s+/,'').replace(/\s+$/,'');
    var i = buttonhints.indexOf(";" + nm + ":");
    var j = buttonhints.indexOf(":", i);
    var k = buttonhints.indexOf(";", j+1);
    var str = buttonhints.substring(j+1,k);
    alllblpos[schbuttonnums] = i;
    hints[schbuttonnums] = str;
    schbuttonnums++;
    ele.onmouseover = function()
    {
       var nm = this.innerHTML.replace(/^\s+/,'').replace(/\s+$/,'');
       var i = buttonhints.indexOf(";" + nm + ":");
       var j = schinverse(i);
       if (j>=0)showmyhint(j);
    };
    ele.onmouseout = function()
    {

     hidemyhint();
    };
 }
 else
 {
 var childs = ele.childNodes;
 if (childs!=null && childs.length > 0)
 {
    for (i=0; i < childs.length; i++)
       addmouseevents(childs[i]);
 }
 }
}

addmouseevents(self.document.body);
}





