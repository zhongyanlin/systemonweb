var f = document.form1;
var localpath = "";
var srcs = "";
var han;
var formname = "";
 
function getsql2(x){document.form1.sql2.value = x;}
function getformname()
{
if (f.rdap.tagName.toUpperCase()=='INPUT')
    formname = f.rdap.value;
else if (typeof (f.rdap.selectedIndex) != 'undefined' && f.rdap.selectedIndex>=0)
    formname = f.rdap.options[f.rdap.selectedIndex].value;
else formname = "";
}
var valid = false;
var formname1;
var hasconfirmed = false;
var state = 0;

 
     
function writenote(s,keepgo)
{
    if (keepgo!=null && keepgo==false)
        parent.frames[1].frames[parent.frames[1].frames.length-1].setkeepgo(false);
    else
        parent.frames[1].frames[parent.frames[1].frames.length-1].setkeepgo(true);
    s = "<div style=\"float:left\"><img src=image/guide1.gif height=60></div>" + s;
    parent.frames[1].frames[parent.frames[1].frames.length-1].myprompt(s,true,null,textmsg[191]) ; 
}


function newform()
{
   f.rdap.selectedIndex = 0;
   f.mode.value = "7";
   f.target =  parent.frames[1].name;
   f.encoding='application/x-www-form-urlencoded';
   formnewaction(f );
  visual(f);
 f.submit();
   //document.form1.innerHTML = '';
}

function validate ()
{
   if (f.mode.disabled || f.mode.value!='')
      f.encoding='application/x-www-form-urlencoded';
   else
      f.encoding = "multipart/form-data";
   return valid;
}
function transform()
{
   if (selectone() == false)
      return;
   var vl = f.rdap.options[f.rdap.selectedIndex].value;
   document.location.href = "webwizard.jsp?mode=9&fromm=0&rdap=" + vl;
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
function getfilename()
{
   var file = f.localpath.value;
   var j = file.lastIndexOf("/");
   if (j==-1) j = file.lastIndexOf("\\");
   return  file.substring(j+1);
}
function parse()
{
   getformname();
   var lp = f.localpath;
   var thefile = lp.value;
   f.mode.value="";
   f.sql.value="";
   if (lp.value=='')
   {
      lp.focus();
      myprompt(msg160);
      valid = false;
      return;
   }

   if (state==0)
   {

      if (lp.value.indexOf(".htm")>0 || lp.value.indexOf(".txt")>0)
      {
         f.override.disabled = true;
         localpath = lp.value;
      }
      else
      {
         f.override.disabled = false;
         f.override.value = formname + "/" + getfilename();
      }
      valid = true;
 
   }
   else
   { 
      if (localpath!=lp.value)
      {
        if (lp.value.indexOf(".htm")>0 || lp.value.indexOf(".txt")>0)
        {
         var tt = confirm(textmsg[655]);
         if (tt==true)
         {
            localpath = lp.value;
            f.override.disabled = true;
         }
         else
         {
            f.override.disabled = false;
            f.override.value = formname + "/" + getfilename();
         }
       }
       else
       {
         f.override.disabled = false;
         f.override.value = formname + "/" + getfilename();
       }
      }
      else
      {
         f.override.disabled = true;
      }
   }
   
   valid = true;
   f.encoding='multipart/form-data';
   formnewaction(f);
  visual(f);
 f.submit();

}
 
function syn()
{
    
}

function sendSrcs(s)
{
   if (document.getElementById("deletebtn")==null) return;
   if(state ==0)
      state = 1;
   document.getElementById("deletebtn").innerHTML = textmsg[18];
   //f.deletebtn.style.visibility = "visible";
   srcs = s.replace(/, $/,'');
   
   
}
function getdv(a)
{
   if (typeof (f) != 'undefined' && typeof(f.defaultav)!='undefined')
   f.defaultav.value = a;
}

function get(a)
{
   //closeprompt();
   getformname();
   var i = a.indexOf("&-@;#");
   if (i > 0)
   {
      var j = a.indexOf("&-@;#", i+5);
      if (j > 0)
      {
         var formname2 = a.substring(i+5,j);
      }
      else formname2 = a.substring(i+5);
      if (formname2 != formname)
      {
          myprompt("Some inconsistance. Please redo the task");
          return;
      }
      if (f.rdap.tagName.toUpperCase()=='INPUT')
      {
          
         //document.getElementById("savebtn").innerHTML = "";
         var support = "";
         if (suspects!='')
             support = msg1449 + "<br>" + suspects + "<br>";
         support += msg1286;
         if (srcs!='')
         {
            support = supportfile + "<br><br><b><font color=purple>" +  srcs + "</font></b><br><br>" + support;
            writenote(support,false);
         }
         else
            writenote(support);
      }
      else
      {
         if (srcs!='')
         {
            writenote(supportfile + "<br><br><b><font color=purple>" +  srcs + "</font></b><br><br>");
         }
      }
   }
   f.sql.value = a;
   if (f.rdap.tagName.toUpperCase()!='INPUT')
   {
      var as = a.split(/&-@;#/);
      var ii = as[2].indexOf(" FROM");
      f.sql.value = as[2].substring(0,ii).replace(/SELECT/,"").replace(/[a-z][0-9]+ AS /g, "").replace(/n as n_h,/,'').replace(/_[a-z]/g,'');
   }
   showsavebtn();
   document.getElementById("makeitlbl").innerHTML = '';
   if (parent!=self && parent.parent!=parent && typeof(parent.parent.frames[0].Anchor)!='undefined')
   {
      new parent.parent.frames[0].Anchor(self);
   }
}
function checkcons()
{
   f.target = "subwin";
   f.mode.value = "18";
   formnewaction(f);
  visual(f);
 f.submit();
}
function save()
{

   if (state==0)
   {
      valid = false;
      myprompt(textmsg[656]);
      return;
   }
   if (srcs!='')
   {
      valid = false;
      parent.frames[1].frames[parent.frames[1].frames.length-1].myprompt(msg1290 +"<br>" + srcs + ".<br><br>" 
      + textmsg[898], null, "if(v)parent.parent.frames[0].gosave(false)", textmsg[191]);
   }
   else
      gosave(true);
}

function gosave(b)
{
    
   f.mode.value="6";
   f.target = "subwin";
   valid = true;
   f.encoding='application/x-www-form-urlencoded';
   formnewaction(f);
  visual(f);
 f.submit();
}
function promptagain()
{
    getformname();
    if (srcs!='')
        writenote(lblupload + " " +  srcs + "<input type=hidden>" );
    else
    {
        closeprompt();
        var htp = ("" + document.location).replace(/mode=1/,"mode=10") + "&rdap=" + formname;
        open(htp, parent.frames[1].name);
    }
}
function  selectone()
{ 
   
   if (f.rdap.selectedIndex <= 0)
   {
      myprompt(msg206);
      f.rdap.focus();
      valid = false;
      return false;
   }
   return true;
}

function delete1()
{
   if (selectone() == false)
   { 
        godelete1();
   }
   else
       myprompt(msg1278  + "?", null, "if(v)godelete1()", textmsg[191]);
}

function godelete1()
{
   //if (f.rdap.selectedIndex < 0) return;
   f.mode.value = "3";
   valid  =  true;
   if (f.rdap.selectedIndex >= 0) formname1 = f.rdap.options[f.rdap.selectedIndex].value;
   f.target = parent.frames[1].name;
   f.encoding='application/x-www-form-urlencoded';
   formnewaction(f);
  visual(f);
 f.submit();
}
 
function url()
{
    if (!selectone())
    {
      return "";
    }
      var act = [textmsg[841],textmsg[842],textmsg[843],textmsg[846],textmsg[844],textmsg[845]];
      var tn = f.rdap.options[f.rdap.selectedIndex].value;
      var base = ("" + document.location).replace(/wordform.jsp.*/, "Form?rdap=" + tn + subdb + orgstr );
      var extra = "";

      
      return "<tr><td align=left class=fieldhead>"
      + textmsg[865] + "</td><td  align=center class=fieldhead width=90>" + textmsg[1860] + "</td><td align=left class=fieldhead>" + msg923 + "</td></tr><tr><td align=left class=fieldlbl style=color:" + IBGCOLOR +">"
      + act[0] + "</td><td align=center class=fieldlbl ><img src=image/qrcode.gif width=26 onclick=\"genqrcode('" + base + "',0)\"></td><td align=left class=fieldlbl><nobr><a href=\"Form?rdap=" + tn + subdb + orgstr +     "\" target=_blank>"        + base +      "</a></nobr></td></tr><tr><td align=left  class=fieldlbl style=color:" + IBGCOLOR +">"
      + act[1] + "</td><td align=center class=fieldlbl ><img src=image/qrcode.gif width=26 onclick=\"genqrcode('" + base + "&ac=s',1)\"></td><td align=left class=fieldlbl><nobr><a href=\"Form?rdap=" + tn + subdb + orgstr +"&ac=s\" target=_blank>"        + base + "&ac=s</a></nobr></td></tr><tr><td align=left  class=fieldlbl style=color:" + IBGCOLOR +">"
      + act[2] + "</td><td align=center class=fieldlbl ><img src=image/qrcode.gif width=26 onclick=\"genqrcode('" + base + "&ac=r',2)\"></td><td align=left class=fieldlbl><nobr><a href=\"Form?rdap=" + tn + subdb + orgstr +"&ac=r\" target=_blank>"        + base + "&ac=r</a></nobr></td></tr><tr><td align=left  class=fieldlbl style=color:" + IBGCOLOR +">"
      + act[3] + "</td><td align=center class=fieldlbl ><img src=image/qrcode.gif width=26 onclick=\"genqrcode('" + base + "&ac=ri',3)\"></td><td align=left class=fieldlbl><nobr><a href=\"javascript:openit1('Form?rdap=" + tn + subdb + orgstr +"&ac=r')\">"+ base + "&ac=ri</a></nobr></td></tr><tr><td align=left  class=fieldlbl style=color:" + IBGCOLOR +">"
      + act[4] + "</td><td align=center class=fieldlbl  class=fieldlbl ><img src=image/qrcode.gif width=26 onclick=\"genqrcode('" + base + "&ac=ui',4)\"></td><td align=left class=fieldlbl><nobr><a href=\"javascript:openit1('Form?rdap=" + tn + subdb + orgstr +"&ac=u')\">"+ base + "&ac=ui</a></nobr></td></tr><tr><td align=left  class=fieldlbl style=color:" + IBGCOLOR +">"
      + act[5] + "</td><td align=center class=fieldlbl ><img src=image/qrcode.gif width=26 onclick=\"genqrcode('" + base + "&ac=di',5)\"></td><td align=left class=fieldlbl><nobr><a href=\"javascript:openit1('Form?rdap=" + tn + subdb + orgstr +"&ac=d')\">"+ base + "&ac=di</a></nobr></td></tr>";
}
 
function genqrcode1(url,i,v)
{
    url = url.replace(/i$/,v);
    var fm = url.replace(/.*rdap=([A-z|a-z|0-9]+).*/,'$1');
    myprompt("<div id=warning0></div><img src=\"Qrlink?url=" + Msg.hex(url) + (i==0?'&nlg=1':'') + "\"  onload=warning(this)  />",null,null,act[i] + ":" + fm);
}
function genqrcode22(url,i)
{
    if (i>=3)
    {  
        myprompt(textmsg[542] + "=", "1", "genqrcode1('" + url + "'," + i + ",v)");
        return;
    }
    var fm = url.replace(/.*rdap=([A-z|a-z|0-9]+).*/,'$1');
    myprompt("<div id=warning0></div><img  src=\"Qrlink?url=" + Msg.hex(url) + (i==0?'&nlg=1':'') + "\"  onload=warning(this)  />",null,null,act[i] + ":" + fm);
}
function show()
{
    if (!selectone())
    {
       valid = false;
    }
    else
    {
       f.encoding='application/x-www-form-urlencoded';
       f.target = "subwin";
       f.mode.value = "10";
       valid = true;
       formnewaction(f);
      visual(f);
 f.submit();
    }
}

function openit1(tt)
{
   myprompt(enterone,"", "openit2(v)");
}

function openit2(i)
{
   if (''+parseInt(i)!='NaN')
   {
      open(tt+ i, parent.frames[1].name);
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
      f.encoding='application/x-www-form-urlencoded';
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
      f.encoding='application/x-www-form-urlencoded';
      valid = true;
      formnewaction(f);
     visual(f);
 f.submit();
   }
   else valid = false;
}
var orgstr = "";
if (orgnum >= 0) 
{
    orgstr = "&orgnum=" + orgnum; 
}
function permit()
{
   
   if (selectone())
   {

   var tt = "DataTable?rdap=permitform&numrows=5" + subdb.replace(/&cdrdap=1/,'')
        + "&rdapname=" + encodeURIComponent(f.rdap.value)
        + "&onbegin=60"  
        + "&onsave=61"  
        + "&onsaved=62" 
        + "&cellonblur=63"  
        + "&exbut=c";
   han = window.open(tt,parent.frames[1].name);
    
   }
}
function menupermit()
{
   var roles= han.retrv(0,1);
   open("wordform.jsp?rdap=" + f.rdap.value +"&roles=" + roles + "&mode=11", parent.frames[1].frames[0].name);
}
function assemble()
{
   var s='',tt, i=0;
   tt= han.retrv(0,4).replace(/[ ]*,[ ]*/g, ","  + "+").replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[ ]+/g, "");
   if (tt!='')
   {
          tt  =  '+'+tt;
          if (s!='') s += ",";
          s+=  tt;
   }
   tt = han.retrv(0,5).replace(/[ ]*,[ ]*/g, ","  + "-").replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[ ]+/g, "");
       if (tt!='')
       {
          tt  =  '-' + tt;
          if (s!='') s += ",";
          s +=  tt;
       }
   han.setv(0, 3, s);
   
   s = '';
   var r = [0,2, 1, 3, 4];
   for (i=1; i <= 4; i++)
   {
       tt= han.retrv(i,4).replace(/[ ]*,[ ]*/g, "," + r[i] + "+").replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[ ]+/g, "");
       if (tt!='')
       {
          tt  = r[i] + '+' + tt;
          if (s!='') s += ",";  
          s+=  tt;
       }
       tt = han.retrv(i,5).replace(/[ ]*,[ ]*/g, "," + r[i] + "-").replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[ ]+/g, "");
       if (tt!='')
       {
          tt  = r[i] + '-' + tt;
          if (s!='') s += ",";  
          s +=  tt;
       }
   }

   for (i=1; i <= 4; i++)
      han.setv(i, 3, s);
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
      x = v[i];if (v[i]!='') v[i] = v[i].substring(1);
      mat[0][4+i] = v[i];
   }
}

function disablediscard()
{
    getformname();
    if (formname!='')
     writenote(msg1283);
}
function removeone()
{

   var k=0,N = f.rdap.options.length;
    
   for (k=0; k < N; k++)
   {
      if (f.rdap.options[k].value==formname1)
      {
         f.rdap.options[k] = null;
         break;
      }
   }
}
var oldbutton = null;
function sinkbut(btn)
{
   if (oldbutton!=null) oldbutton.style.borderStyle = "outset";
   btn.style.borderStyle = "inset";
   oldbutton = btn;
   return true;
}
var remind = "";
function notesrc()
{
   if (srcs!='')
   {
      f.override.disabled = false;
      writenote( lblupload + "  " +  srcs   + "<input type=hidden>");
     // f.savebtn.value=capupload;
     document.getElementById("savebtn").innerHTML = capupload;
   }
   else
      formname = '';
}
function addone(str)
{
   remind = str;

   var k = f.rdap.options.length;
   f.rdap.options[k] = new Option(formname,formname);
   f.rdap.selectedIndex = k;

   if (formname=='')
   {
      var htp = ("" + document.location).replace(/mode=1/,"mode=10") + "&rdap=" + formname;
      open(htp, parent.frames[1].name);
   }
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

 
function cancel()
{
    myprompt(textmsg[657], null, "if(v)gocancel()");
}

function gocancel()
{
   f.target = window.name;
   f.mode.value  = "16";
   f.encoding='application/x-www-form-urlencoded';
   formnewaction(f);
  visual(f);
 f.submit();
}
function consistant(s,override)
{
   var ts = f.sql.value.split(",");
   var ss = s.split(",");

   var isred = false;
   var yellow = "";
   var old = "<tr><td>" + formname +"</td>";
   var new1 = "<tr><td>" + textmsg[290] +"</td>";
   for (var i=0; i < ss.length; i++)
   {
       var tt = ts[i].replace(/_.*$/,'').replace(/^\s*/,'');
       var st = ss[i].replace(/_.*$/,'').replace(/^\s*/,'');
       old += "<td>" + st +"</td>";
      
      if (tt !=st )
      {
         new1 += "<td align=left style=background-color:red;color:red;font-weight:700>" + tt +"</td>";
         isred = true;
      }
      else
         new1 += "<td align=left >" + tt +"</td>";
      var yt = ts[i].replace(/[a-z][0-9]+/,'').replace(/_/,'');
      st = ss[i].replace(/[a-z][0-9]+/,'').replace(/_/,'');
      if (!isNaN(tt) && parseInt(yt) > parseInt(st))
      {
         isyellow = true;
         yellow += tt +"_" + (2*parseInt(yt)) + ",";
      }
   }
   var msg = "<table align=center>" + old +"</tr>" + new1 +"</tr>";

   msg += "<tr><td align=left colspan=" + ss.length +" align=center><form rel=opener name=f2 action=wordform.jsp target=subwin  >"
      +"<input type=hidden name=yellow value=\"" + yellow +"\"><input type=hidden name=rdap value=\"" + formname +"\">"
      +"<input type=hidden name=override value=\"" + override +"\">"
      +"<input type=hidden name=mode value=18 >";
   if (!isred)
     msg += "<input type=submit class=OrangeButton name=confirm value=\"" + textmsg[462] +"\">";
   else
      msg +=textmsg[460];
   msg += "<input type=submit class=GreenButton name=concel value=\"" + textmsg[461] +"\"  onclick=\"document.f2.yellow.disabled=true\"></form></td></tr></table>";
   myprompt(msg, null,null,textmsg[323]);
  
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
    var j=0;for (; j < schbuttonnums; j++)
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
    var nm = ele.innerHTML.replace(/^\s+/,'').replace(/\s+$/,'').replace(/<[^>]*>/g,'');
    
    var i = buttonhints.indexOf(";" + nm + ":");
    var j = buttonhints.indexOf(":", i);
    var k = buttonhints.indexOf(";", j+1);
    var str = buttonhints.substring(j+1,k);
    alllblpos[schbuttonnums] = i;
    hints[schbuttonnums] = str;
   
    schbuttonnums++;
    ele.onmouseover = function()
    {
       var nm = this.innerHTML.replace(/^\s+/,'').replace(/\s+$/,'').replace(/<[^>]*>/g,'');
      
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
Anchor.objects = [];
function Anchor(win)
{
   this.root = self;
   for (var j=0; j < win.parent.frames.length; j++)
       if (win == win.parent.frames[j])break;
   Anchor.objects[j] = this;
   this.y = 0;
   this.x = 0;
   this.win = win;
   this.d = win.document.createElement("div");
   this.d.id = "anchor" + j;

   this.d.style.cssText = "position:absolute;width:15px;height:15px;left:6px;top:300px;background:url(image/float.png)";

   this.move = function(i,j)
   {
   
   this.win.scrollBy(i,j);

   var y = parseInt(this.d.style.top.replace(/px/,''))
   y+=j;
   if (y < 0) y = 0;
   this.d.style.top  = y + 'px';
   var x = parseInt(this.d.style.left.replace(/px/,''))
   x+=i;
   if (x < 0) x = 0;
   this.d.style.left  = x + 'px';
   }
   win.document.body.appendChild(this.d);
   
   if (typeof(win.Drag.init)!='undefined')
   {
       win.Drag.init(this.d);

   this.d.onDragStart = function(x,y)
   {
       var j = parseInt(this.id.substring(6));
       {
           Anchor.objects[j].y=y;
           Anchor.objects[j].x=x;
       }
   }
   this.d.onDragEnd = function(x,y)
   {
        var j = parseInt(this.id.substring(6));
        {
            Anchor.objects[j].move(x - Anchor.objects[j].x, y - Anchor.objects[j].y);
        }
   }
   }
}


   var sqls = new Array(3);
    
    function passit(k)
    {
        sqls[k] = parent.frames[k].giveyou();
    }


    function parsesql(sql)
    {
        if (sql==null) return null;
        sql = ' ,'+sql.replace(/'[^']*'/g,'').replace(/,[ ]*$/g,'');
        // sql = sql.replace(/.*lastupdate BIGINT,/,'').replace(/,[ ]+PRIMARY KEY/,'');
    
        var fields = sql.split(/,[ ]*/);
        for (var j=0; j < fields.length; j++)
            fields[j] = fields[j].replace(/ .*/,'');
        return fields;
    }

    function buildit()
    {
        passit(0);passit(2);
        var f0 = parsesql(sqls[0]);
        var f2 = parsesql(sqls[2]);
        var tbl = document.getElementsByTagName("table")[0];
        var N = (f0.length>f2.length)?f0.length:f2.length;
        for (var j=1; j < N; j++)
        {
            var r = tbl.insertRow(-1);
            var cl = r.insertCell(-1);
            cl.setAttribute("bgcolor",  TBGCOLOR );
            if(j < f0.length)
                cl.innerHTML = f0[j];
            else
                cl.innerHTML = "<input name=h" + j +" style=width:30px>"

            cl = r.insertCell(-1);
            cl.setAttribute("bgcolor",  TBGCOLOR );
            cl.innerHTML =  "&rarr;";

            cl = r.insertCell(-1);

            var xx = "<select name=s"  + j +">";
            var k = -1;
            for (var i=1; i < f2.length; i++)
            {
                xx += "<option value=" + f2[i];
                if (f0[j] == f2[i]) xx += " selected ";
                xx+= ">" + f2[i] + "</option>";
            }
            if( f2.length < N )
            {
                xx += "<option value=\"\"></option>"  ;
                // if (j == i) xx += " selected ";
                // xx+= ">h" + i + "</option>";
            }
            xx += "</select>";  
            cl.innerHTML = xx;
        }
        var xx = thispagewidth();
        document.getElementById('instr').innerHTML = msg1386;
        setRoundedWidth(promptwin, xx-10);
    }
    function makesql()
    {
        var f2 = parsesql(sqls[2]);
        var f0 = parsesql(sqls[0]);
        var xx = "";
        for (var i=1; i < f2.length; i++)
            xx += f2[i] +",";
        var N = (f0.length>f2.length)?f0.length:f2.length;
        var tbl = document.getElementsByTagName("table")[0];
        var X='lastupdate,n', Y=X;
        for (var j=1; j < N; j++)
        {
            var s = tbl.rows[j].cells[2].childNodes[0];
            var v = s.options[s.selectedIndex].value;
            if (v!='')
            {
                xx = xx.replace(v+",","");
                X += "," + v;
                if (j < f0.length && j < N )
                    Y += "," + tbl.rows[j].cells[0].innerHTML ;
                else if (v.replace(/c[0-9]+/,"")=="")
                    Y += "," + tbl.rows[j].cells[0].getElementsByTagName('input')[0].value.replace(/'/g,"")  ;
                else
                    Y += ",'" + tbl.rows[j].cells[0].getElementsByTagName('input')[0].value.replace(/'/g,"''") +"'";
            }
        }
        if (xx!='')
        {
            myprompt(xx + '\n' + X +'\n' +Y + '\nTarget Fields are not distinct');
            return false;
        }
       
        document.f2.X.value =  X;
        document.f2.Y.value =  Y;
        return true;
    }


function makeanchor()
{
    var splits = [10, 40, 50];

    var xx = document.createElement('div');
    var y = (thispageheight() - 18);
    var x = Math.round(thispagewidth() / 2 - 8);
    var x0 = Math.round(thispagewidth() / 10);
    xx.style.cssText = "cursor:move;position:absolute;z-index:3;width:16px;height:16px;border-radius:8px;background-color:#DDCC22;color:#DDCC22;top:"
            + y + 'px;left:' + x + 'px;border:1px ' + IBGCOLOR + ' solid';
    xx.id = 'anchor';
    xx.innerHTML = ' ';
    document.body.appendChild(xx);
    Drag.init(xx);
    xx.onDragEnd = function (x, y)
    {
        var z = thispagewidth();
        z = Math.round(100 * (z - x) / z);
        var w = parent.frames[1];
        var y = w.document;
        splits[1] = 100 - splits[0] - z;
        y.getElementById('fset').cols = splits[0] + "%," + splits[1] + "%,*";
        this.style.top = (thispageheight() - 18) + 'px';
    }
 
    var imglet = document.createElement('div');
    x = Math.round(thispagewidth() / 10 - 8);
    imglet.style.cssText = "cursor:move;position:absolute;z-index:3;width:16px;height:16px;border-radius:8px;background-color:#DDCC22;color:#DDCC22;top:"
            + y + 'px;left:' + x + 'px;border:1px ' + IBGCOLOR + ' solid';
    imglet.id = 'anchor1';
    imglet.innerHTML = ' ';
    document.body.appendChild(imglet);
    Drag.init(imglet);
    imglet.onDragEnd = function (x, y)
    {
        var z = thispagewidth();
        z = Math.round(100 * x / z);
        splits[0] = z;
        var w = parent.frames[1];
        var y = w.document;
        y.getElementById('fset').cols = splits[0] + "%," + splits[1] + "%,*";
        this.style.top = (thispageheight() - 18) + 'px';
    }
}



function tellrdap(){return document.form1.rdap.value;}
    function helphints(){}
    function choose()
    {
       var myfontname1 = localStorage['myfontname'];
        if (myfontname1!=null) 
        {
             myfontname = myfontname1;
        }
        else
            myfontname = defaultfontfamily;
        document.form1.fontname.value = myfontname;
        document.form1.localpath.click();
    }
    function upload()
    {
        parse();
        if (valid) {visual(document.form1);
        document.form1.submit();}
    }
    var senddone = false;
    function makeit(z)
    {
        if (senddone)
        {
            setTimeout("open('wordform.jsp?mode=1&initrdap=" + rdap + "','_self')", 500);
            return;
        }    
        if (z != null && formimg == true)
        {
            myprompt(textmsg[1579],null,'if(v){formimg=false;makeit("'+z + '");}else myprompt("' + textmsg[1152] + ':<br>FileOperation?did=' + z + '");');
            return;
        }
        else
        {
            closeprompt();
        }
        formimg = (z!=null);
         
        open("wordfmsp.jsp?numfrms=3&rdap=" + document.form1.rdap.value + (z!=null?('&js='+z):''), parent.frames[1].name);
        if (typeof(makeanchor)!='undefined') makeanchor();
        if (z==null) 
        {
            document.getElementById('savebtn').innerHTML = '';
            senddone = true;
        }
        
    }
    
    
    function getsuspects(x){suspects = x;}
    function showsavebtn()
    {
       // buttonhints = textmsg[1588];
        hints[1]= textmsg[1589];
        var btn = document.getElementById("savebtn");
        btn.className = "tdbutton OrangeButton";
        if (typeof( msg727) == 'undefined') return;
        btn.onclick= function()
        {
            closeprompt()
            if(sinkbut(this))save();
        }
       
        btn.innerHTML =  msg727;
        btn.onmouseover = function()
        {
            var nm = this.innerHTML.replace(/^\s+/,'').replace(/\s+$/,'');
            var i = buttonhints.indexOf(";" + nm + ":");
            var j = schinverse(i);
            if (j>=0)showmyhint(j);
        };
        
        var r = btn.parentNode;
        if (document.getElementById("b" + (r.cells.length-2)) != null)  return;
        var newbtn = r.insertCell(r.cells.length-2);
        newbtn.style.cssText = btn.style.cssText;
         
        newbtn.className = "tdbutton OrangeButton";
        newbtn.innerHTML = msg1382;
        newbtn.align='center';
        newbtn.id = "b" + (r.cells.length-2);
        newbtn.onclick= function()
        {
            closeprompt();
            var N = parent.frames[1].frames.length;
            parent.frames[1].frames[N-1].closeprompt();
            if(sinkbut(this))
            {
                var w = parent.frames[1].frames[N-1];
                var s = "<DOCTYPE html><html><head>" + w.document.getElementsByTagName("head")[0].innerHTML
                + "</head><body ";
                var x = w.document.body.attributes;
                 for (var i=0; i < x.length; i++)
                 {
                     if (x[i].value != null && x[i].value != 'null' && x[i].value != '')
                     {
                         s  += x[i].name + "=\"" + x[i].value +"\" ";

                     }
                 }
                 s += ">\n" + w.document.body.innerHTML.replace(/<scr.pt [^<]+<.script>/gi,'') + "\n</body></html>";
                 var nav = open('','_blank');
                nav.document.write(s);
                var t = nav.document.createElement("textarea");
                t.rows = 30;
                t.cols = 80;
                t.value = s;
                nav.document.body.appendChild(t);
            }
            //this.parentNode.deleteCell(parseInt(this.id)-1);
        }
    }
    
  
   



 
