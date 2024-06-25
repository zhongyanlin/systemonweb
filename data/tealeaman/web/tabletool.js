/* tabletool.js
 * by Systems on Web, Inc.
 * Zhongyan Lin
 */
 
var strlabel;
if (typeof(textmsg) == 'undefined')
{
 
strlabel = ["Maximum Number of Rows",
"Maximum Number of Columns","Optional Cell Width","Optional Cell Height","ApplyCell","UndoText","Colors","HtmlCode",
"Click X to cut off some of your current selected frequent colors,  and click to pick some from the above web safe colors",
"You may also modify this file,  then click the Upload button to see the conversion",
"Finished, Going to deliver",
"Copy the codes to a notepad and save them as a html file",
"Parse",
"Format",
"Edit text",
"Close",
'Insert table',
'Copy table',
"Del table",
"Please enter an  integer",
'Enter parameters to create the new page  or click Cancel to redesign existing page',
"Select rectect",
"Insert cell",
"Del cell",
"Insert row ",
"hold<br>drag",
"Insert div",
"Paste table",
"grd",
"Width",
"SetText",
"+>>",
"Font<br>size",
"Color",
"Del row",
"Cut Splitter",
"Next",
"Cancel",
"Test",
"Start Color",
"End Color",
"Orientation",
"Horizontal",
"Vertical",
"Bg url",
"Align",
"Border",
"Spacing",
"Padding",
"Cell id",
"Table id",
"Valign",
"BgCol",
"Class",
"Save",
"ApplyTable"
];
}
else
{
  strlabel = textmsg[1292].split(/\n/);
  
} 
if (typeof(subsitename) == 'undefined')
    var subsitename = 'subsites';
var mode = 'format'; // edit
var nonbreakspace = '&nbsp;'; 
var handledialog = null;
var tableid = 0;
var menutbl = null;
var cmenu = null;
//var follower = null;
var donelist = ','; 
var clickedcells = [];
var  fortblcolor = "#BBBBBB";
var numclicked = 0;
var changedbg = false;
var mapa = ['',  'left', 'center', 'right'];
var maps = ['',  'top',  'middle','bottom'];
var cellheight, cellwidth;
var father = [];
var savedtxt = [];
var oldnumclicked = 0;
var copiedtable='';  
var mycolors = ['red', 'green', 'yellow', 'orange', 'blue', 'white', 'purple', 'pink'];
var websafecl="#FFFFFF#FFFFCC#FFFF99#FFFF66#FFFF33#FFFF00#FFCCFF#FFCCCC#FFCC99#FFCC66#FFCC33#FFCC00#FF99FF#FF99CC#FF9999#FF9966#FF9933#FF9900#FF66FF#FF66CC#FF6699#FF6666#FF6633#FF6600#FF33FF#FF33CC#FF3399#FF3366#FF3333#FF3300#FF00FF#FF00CC#FF0099#FF0066#FF0033#FF0000#CCFFFF#CCFFCC#CCFF99#CCFF66#CCFF33#CCFF00#CCCCFF#CCCCCC#CCCC99#CCCC66#CCCC33#CCCC00#CC99FF#CC99CC#CC9999#CC9966#CC9933#CC9900#CC66FF#CC66CC#CC6699#CC6666#CC6633#CC6600#CC33FF#CC33CC#CC3399#CC3366#CC3333#CC3300#CC00FF#CC00CC#CC0099#CC0066#CC0033#CC0000#99FFFF#99FFCC#99FF99#99FF66#99FF33#99FF00#99CCFF#99CCCC#99CC99#99CC66#99CC33#99CC00#9999FF#9999CC#999999#999966#999933#999900#9966FF#9966CC#996699#996666#996633#996600#9933FF#9933CC#993399#993366#993333#993300#9900FF#9900CC#990099#990066#990033#990000#66FFFF#66FFCC#66FF99#66FF66#66FF33#66FF00#66CCFF#66CCCC#66CC99#66CC66#66CC33#66CC00#6699FF#6699CC#669999#669966#669933#669900#6666FF#6666CC#666699#666666#666633#666600#6633FF#6633CC#663399#663366#663333#663300#6600FF#6600CC#660099#660066#660033#660000#33FFFF#33FFCC#33FF99#33FF66#33FF33#33FF00#33CCFF#33CCCC#33CC99#33CC66#33CC33#33CC00#3399FF#3399CC#339999#339966#339933#339900#3366FF#3366CC#336699#336666#336633#336600#3333FF#3333CC#333399#333366#333333#333300#3300FF#3300CC#330099#330066#330033#330000#00FFFF#00FFCC#00FF99#00FF66#00FF33#00FF00#00CCFF#00CCCC#00CC99#00CC66#00CC33#00CC00#0099FF#0099CC#009999#009966#009933#009900#0066FF#0066CC#006699#006666#006633#006600#0033FF#0033CC#003399#003366#003333#003300#0000FF#0000CC#000099#000066#000033#000000";
var filename = null;
var subdb = null;
var locationstr = null;
var  folder = null;
var online = false;
var cansave = false;
var savedfile = true;
var fileopurl = '';
var tinywinn = 'w'+(new Date()).getTime()%10000000;
var savedmx=-1,savedmy=-1;

function convertpage()
{
   if ( parent.frames.length==3 
       && parent.frames[1]==self  
       && parent.parent.frames.length==2) 
       return parent.frames[2].name;
   return null;
}

if (typeof (ismobile) == 'undefined')
var ismobile = function()
{
    return navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/BlackBerry/i)||
    navigator.userAgent.match(/iPhone|iPad|iPod/i)
    || navigator.userAgent.match(/Opera Mini/i)
   ||  navigator.userAgent.match(/IEMobile/i);
}


if (!ismobile() && typeof (Drag) == 'undefined')
{
var Drag = 
{
    
    parseIntpx : function (str)
    {
        return parseInt(str.replace(/px/,''));
    },
    
	obj : null,

	init : function(o, oRoot, minX, maxX, minY, maxY, bSwapHorzRef, bSwapVertRef, fXMapper, fYMapper)
	{
		o.onmousedown	= Drag.start;

		o.hmode			= bSwapHorzRef ? false : true ;
		o.vmode			= bSwapVertRef ? false : true ;

		o.root = oRoot && oRoot != null ? oRoot : o ;

		if (o.hmode  && isNaN(Drag.parseIntpx(o.root.style.left  ))) o.root.style.left   = "0px";
		if (o.vmode  && isNaN(Drag.parseIntpx(o.root.style.top   ))) o.root.style.top    = "0px";
		if (!o.hmode && isNaN(Drag.parseIntpx(o.root.style.right ))) o.root.style.right  = "0px";
		if (!o.vmode && isNaN(Drag.parseIntpx(o.root.style.bottom))) o.root.style.bottom = "0px";

		o.minX	= typeof minX != 'undefined' ? minX : null;
		o.minY	= typeof minY != 'undefined' ? minY : null;
		o.maxX	= typeof maxX != 'undefined' ? maxX : null;
		o.maxY	= typeof maxY != 'undefined' ? maxY : null;

		o.xMapper = fXMapper ? fXMapper : null;
		o.yMapper = fYMapper ? fYMapper : null;

		o.root.onDragStart	= new Function();
		o.root.onDragEnd	= new Function();
		o.root.onDrag		= new Function();
	},

	start : function(e)
	{
		var o = Drag.obj = this;
		e = Drag.fixE(e);
		var y = Drag.parseIntpx(o.vmode ? o.root.style.top  : o.root.style.bottom);
		var x = Drag.parseIntpx(o.hmode ? o.root.style.left : o.root.style.right );
		o.root.onDragStart(x, y);

		o.lastMouseX	= e.clientX;
		o.lastMouseY	= e.clientY;

		if (o.hmode) {
			if (o.minX != null)	o.minMouseX	= e.clientX - x + o.minX;
			if (o.maxX != null)	o.maxMouseX	= o.minMouseX + o.maxX - o.minX;
		} else {
			if (o.minX != null) o.maxMouseX = -o.minX + e.clientX + x;
			if (o.maxX != null) o.minMouseX = -o.maxX + e.clientX + x;
		}

		if (o.vmode) {
			if (o.minY != null)	o.minMouseY	= e.clientY - y + o.minY;
			if (o.maxY != null)	o.maxMouseY	= o.minMouseY + o.maxY - o.minY;
		} else {
			if (o.minY != null) o.maxMouseY = -o.minY + e.clientY + y;
			if (o.maxY != null) o.minMouseY = -o.maxY + e.clientY + y;
		}

		document.onmousemove	= Drag.drag;
		document.onmouseup		= Drag.end;

		return false;
	},

	drag : function(e)
	{
		e = Drag.fixE(e);
		var o = Drag.obj;

		var ey	= e.clientY;
		var ex	= e.clientX;
		var y = Drag.parseIntpx(o.vmode ? o.root.style.top  : o.root.style.bottom);
		var x = Drag.parseIntpx(o.hmode ? o.root.style.left : o.root.style.right );
		var nx, ny;

		if (o.minX != null) ex = o.hmode ? Math.max(ex, o.minMouseX) : Math.min(ex, o.maxMouseX);
		if (o.maxX != null) ex = o.hmode ? Math.min(ex, o.maxMouseX) : Math.max(ex, o.minMouseX);
		if (o.minY != null) ey = o.vmode ? Math.max(ey, o.minMouseY) : Math.min(ey, o.maxMouseY);
		if (o.maxY != null) ey = o.vmode ? Math.min(ey, o.maxMouseY) : Math.max(ey, o.minMouseY);

		nx = x + ((ex - o.lastMouseX) * (o.hmode ? 1 : -1));
		ny = y + ((ey - o.lastMouseY) * (o.vmode ? 1 : -1));

		if (o.xMapper)		nx = o.xMapper(y)
		else if (o.yMapper)	ny = o.yMapper(x)

		Drag.obj.root.style[o.hmode ? "left" : "right"] = nx + "px";
		Drag.obj.root.style[o.vmode ? "top" : "bottom"] = ny + "px";
		Drag.obj.lastMouseX	= ex;
		Drag.obj.lastMouseY	= ey;

		Drag.obj.root.onDrag(nx, ny);
		return false;
	},

	end : function()
	{
                
		document.onmousemove = null;
		document.onmouseup   = null;
		Drag.obj.root.onDragEnd(	Drag.parseIntpx(Drag.obj.root.style[Drag.obj.hmode ? "left" : "right"]), 
									Drag.parseIntpx(Drag.obj.root.style[Drag.obj.vmode ? "top" : "bottom"]));
		var ex = Drag.obj.lastMouseX;
		var ey = Drag.obj.lastMouseY;
      Drag.obj = null;
      if (typeof atEndDrag =='function')atEndDrag(ex,ey);
	
   },

	fixE : function(e)
	{
		if (typeof e == 'undefined') e = window.event;
		if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
		if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
		return e;
	}
};
 
}

if (ismobile() && typeof (Drag) == 'undefined')
{
    var Drag = 
   {
      init : function (draggable, obj)
      {
        if (obj == null)
        {
            draggable.style.position = "absolute";
            draggable.addEventListener('touchmove', function(event) 
            {
               var touch = event.targetTouches[0];
               draggable.style.left = touch.pageX-25 + 'px';
               draggable.style.top = touch.pageY-25 + 'px';
               event.preventDefault();
            }, false);
        }
        else
        {
            obj.style.position = "absolute";
            draggable.addEventListener('touchmove', function(event) 
            {
               var touch = event.targetTouches[0];
               obj.style.left = touch.pageX-25 + 'px';
               obj.style.top = touch.pageY-25 + 'px';
               event.preventDefault();
            }, false);
        }
     }
   } 
}




function padd2(i)
{
    if (i > 9) return i;
    else return '0' + i;
}
function initfilename()
{ 
locationstr = document.location.toString();   
var lj = locationstr.lastIndexOf("/");
if (lj > 0)
{
   var filenm = locationstr.substring(lj+1);
   locationstr = locationstr.substring(0, lj);
   if (locationstr.indexOf("http") == 0 && filenm.indexOf("mytool.jsp") == 0)
   {
       fileopurl = locationstr.replace(/mytool.*/, 'FileOperation');
       var kk = filenm.indexOf("?");
       if (kk == -1) 
          filename = null;
       else
          filename = filenm.substring(kk+1);
   }
   else if (locationstr.indexOf("http") == 0 && filenm.indexOf("FileOperation") == 0)
   {
       fileopurl = locationstr.replace(/FileOperation.*$/, 'FileOperation');
       if(onmydomain(opener)) 
       filename = opener.document.form2.filedir.value;
   }
   else if (locationstr.indexOf("http") == 0 && locationstr.indexOf("/" + subsitename + "/") > 0)
   {
       fileopurl = locationstr.replace(new RegExp( subsitename + ".*"), 'tealeaman/FileOperation');
       if (opener!=null && onmydomain(opener)  && typeof(opener.document.form2)!='undefined'  
           && typeof(opener.document.form2.filedir)!='undefined')
       filename = opener.document.form2.filedir.value;
   }
} 
 
if (filename == null)
{
   cansave =  false;
   var d = new Date();
   filename  = padd2(d.getYear()%100) + padd2(d.getMonth()) + padd2(d.getDate()) + ".html";
}
else
{
    cansave = true;
    if (filename.indexOf(".")<0)
        folder = "dbdesign";
}
 
if (window.opener!= null 
     && typeof(window.self)!='undefined'   
     && window.opener!= window.self 
     && window.opener!=null 
     &&  onmydomain(opener)
     && typeof(window.opener.getFolder)!='undefined'
)
{     
    folder = window.opener.getFolder();
    if (typeof(window.opener.getSubdb)!='undefined')
     subdb = window.opener.getSubdb();
}
else if (parent!=self && parent.frames[0]!=self && typeof(parent.frames[0].getFolder)!='undefined')
{
    
    folder = parent.frames[0].getFolder();
    if (typeof(parent.frames[0].getSubdb)!='undefined')
     subdb = parent.frames[0].getSubdb();
     if (fileopurl == '') fileopurl = locationstr.replace(new RegExp( subsitename + ".*"), 'tealeaman/FileOperation');
}
  online = (fileopurl!='' && folder != null  && subdb !=null);
}
 
function $(id) {return document.getElementById(id);}
document.write("")
function maketopbtns()
{ 

     var panel = document.createElement("div");
     panel.id="buttonpanel";
     var s = "<table align=center><tr><td id=editmodebtn class=tdbtns onclick=\"editmode(this)\"><nobr>" + strlabel[14] + "</nobr></td>"
    // +"<td style=width:68px  id=undobtn  class=tdbtns style=\"visibility:hidden\" onclick=\"savedfile=undo(this)\">" + strlabel[5] + "</td>"
     + "<td style=width:68px id=tlmttclp  class=tdbtns onclick=\"pickmycolor()\"><nobr>" + strlabel[6] + "</nobr></td>"

      + "<td><form rel=opener style=\"margin:0px 0px 0px 0px;display:inline\" name=\"ff\" method=\"post\" target=" + tinywinn + " action=\"" + fileopurl +"\"   >"
  
     + "<input name=operation type=hidden value=save>"
     + "<input name=filedir type=" + (filename.indexOf(".")<0?'hidden':'text') + "  size=7 value=\"" + filename + "\" >"
     + "<input name=folder  type=hidden  value=\"" + folder + "\" >"   
     + "<input name=destination type=hidden value=\"\"></form></td>"
     + ( ( cansave==false || convertpage()!=null )? "":"<td   id=savefilebtn  class=tdbtns onclick=\"saveit()\"><nobr>" + strlabel[54] + "</nobr></td>" );

     s += "<td  class=tdbtns   id=codes onclick=\"codes()\"><nobr>" + strlabel[7] + "</nobr></td>"

    if (convertpage()!=null)
    {
       s += "<td  class=tdbtns style=background-color:#009900;color:white;font-weight:700 id=uploadbtn onclick=\"uploadit(false)\"><nobr>" + strlabel[38] + "</nobr></td>"
    }
    s += "<td></td></tr></table>";
    panel.cssText = "background-color:#aaaaaa;padding:1px 1px 1px 1px";
    panel.innerHTML = s;
     
    if (document.body.childNodes.length > 0)
        document.body.insertBefore(panel, document.body.childNodes[0]);
    else
        document.body.appendChild(panel); 
     
} 
function scrollexistw()
{
var hasVScroll = document.body.scrollWidth > document.body.clientWidth;
var cStyle = document.body.currentStyle||window.getComputedStyle(document.body, "");
hasVScroll = cStyle.overflow == "visible" 
             || cStyle.overflowX == "visible"
             || (hasVScroll && cStyle.overflow == "auto")
             || (hasVScroll && cStyle.overflowX == "auto");
return hasVScroll;
}
function scrollexisth()
{
var hasVScroll = document.body.scrollHeight > document.body.clientHeight;
var cStyle = document.body.currentStyle||window.getComputedStyle(document.body, "");
hasVScroll = cStyle.overflow == "visible" 
             || cStyle.overflowY == "visible"
             || (hasVScroll && cStyle.overflow == "auto")
             || (hasVScroll && cStyle.overflowY == "auto");
return hasVScroll;
}
function centerlize(x)
{
    var k = 0;
    while (scrollexisth() == false)
    {
        x.style.top = (parseInt(x.style.top.replace(/px/,''))+50) + 'px';
        k++;
    }
    if (k> 0)
    {
        x.style.top = (parseInt(x.style.top.replace(/px/,''))-50) + 'px';
    }
    k = 0;
    while (scrollexistw() == false)
    {
        x.style.left = (parseInt(x.style.left.replace(/px/,''))+50) + 'px';
        k++;
    }
    if (k > 0) x.style.left = (parseInt(x.style.left.replace(/px/,''))-50) + 'px';
   
}
function makedialog()
{ 
var x = document.createElement('div');
x.id="dialog";
x.style.cssText="position:absolute;width:280px;visibility:hidden;border:1px #b0b0b0 outset;border-radius:4px;top:50px;left:50px;box-shadow:#CCCCCC -2px -px;background:linear-gradient(#dddddd,#cccccc)";
x.innerHTML = "<table align=center id=\"inputtbl\">" 
+"<tr><td colspan=2 align=left></td></tr>"
+"<tr><td  align=left><nobr>" + strlabel[0] + "</nobr></td><td><input id=txtnumrows size=3 value=10 /></td></tr>"
+"<tr><td  align=left><nobr>" + strlabel[1] + "</nobr></td> <td><input id=txtnumcols size=3 value=" +(convertpage()==null?10:2  )+ " /></td> </tr>"
+"<tr><td  align=left><nobr>" + strlabel[2] + "</nobr></td> <td><input id=txtcellwidth size=3  value=300 /></td>"
+"<tr><td  align=left><nobr>" + strlabel[3] + "</nobr></td> <td><input id=txtcellheight size=3 value=40 /></td></tr>"
+"</tr><tr> <td  align=center align=right colspan=2><input  style=\"width:68px;color:white;border:1px black outset;border-radius:3px;background-color:#777777 \"  type=button name=btnok value=\"" + strlabel[30] + "\" onclick=readvalue() />"
+" <input type=button   style=\"width:68px;color:white;border:1px black outset;border-radius:3px;background-color:#777777\"   name=btncancel value=\"" + strlabel[37] + "\" onclick=\"quitmake()\"/></td></tr>"
+"</table>";
document.body.appendChild(x);
//centerlize(x);
/*
x = document.createElement('div');
x.id="follower";
x.style.cssText="visibility:hidden;position:absolute;width:10px;height:10px;background-color:grey" ;
x.innerHTML = "<!-- -->";
x.onmouseover=showmenu;
document.body.appendChild(x);
*/
/* 
x = document.createElement('iframe');
x.name="gradient";
x.width=10;
x.height=10;
//x.style.cssText="visibility:hidden"; 
document.body.appendChild(x);*/
handledialog = document.getElementById("inputtbl");
//follower = document.getElementById("follower");  
}
 function addfield(ff, nm, v)
 {
     var x = document.createElement('input');
     x.type='hidden';
     x.name= nm;
     x.value= v;
     ff.appendChild(x);
 }



function pickmycolor()
{
   var myc = document.createElement("div");
   myc.id = "colorpat";
   myc.style.cssText = "border:1px #b0b0b0 outset;position:absolute;left:0px;top:0px;background-color:#dddddd";
   var s = '<table>';
   var done = false;
   for (var i=0; done == false; i++)
   {
       s += '<tr>';
       for (var j=0; j < 12; j++)
       {
           if (i*7*12 + (1+j)*7 > websafecl.length) {done = true;break;}
           var cl = websafecl.substring(i*7*12+j*7, i*7*12+ (1+j)*7);
           s += "<td onclick=\"pickmycolor1('" + cl +"')\" bgcolor=" + cl +">" + cl +"</td>";
       }
       s += '</tr>';
   }
   s += '</table>' + strlabel[8].replace(/X/,"<font face=arial color=red>X</font>") + '<br><center><table style=display:inline border=1><tr>'; 
   for (i=0; i < 8; i++)
   {
       s += '<td onclick="delthiscolorsel(this)" >'+  (i+1) + '(<font face=arial color=red>X</font>)</td>';
   }
   s +='</tr><tr>'
   for (i=0; i < 8; i++)
   {
       s += '<td  bgcolor=' + mycolors[i] +'>'+  mycolors[i] + '</td>';
   }
   s =  s +'</tr></table><input type=button onclick="closecl()" value="' + strlabel[15] +  '"></center>';
   
   myc.innerHTML = s;
   document.body.appendChild(myc);   
}

function delthiscolorsel(td)
{
    var i = parseInt(td.innerHTML.replace(/[^0-9]/g,''))-1;  
    var tb = document.getElementById("colorpat").getElementsByTagName("table")[1];
    tb.rows[1].deleteCell(i);tb.rows[0].deleteCell(i);
    for (i=0; i < 8 && i < tb.rows[0].cells.length; i++)
   {
      tb.rows[0].cells[i].innerHTML = (i+1) + '(X)';
   }
}
function closecl()
{
    var tr = document.getElementById("colorpat").getElementsByTagName("table")[1].rows[1];
    var cached = '';
    for (var i=0; i < tr.cells.length ; i++)
         if (i < 8) 
             {
                 mycolors[i] = tr.cells[i].innerHTML;
                 if (cached!='') cached += ',';
                 
                 cached += mycolors[i] ;
             }
    
    document.body.removeChild(document.getElementById("colorpat"));
    var k =0;
    i = menurow("bgcolorpat");
    for ( ; i < menutbl.rows.length && k<8; i++)
    for (var j=1; j < menutbl.rows[i].cells.length && k<8; j++)
    if (menutbl.rows[i].cells[j].style.backgroundColor!=null)
    { 
        menutbl.rows[i].cells[j].style.backgroundColor= mycolors[k++];
    }
    k=0;
    i = menurow("fgcolorpat");
    for ( ; i < menutbl.rows.length && k<8; i++)
    for (  j=1; j < menutbl.rows[i].cells.length && k<8; j++)
    if (menutbl.rows[i].cells[j].style.color!=null)
    { 
        menutbl.rows[i].cells[j].style.color= mycolors[k++];
        
    }
    localStorage["tlmttcl"] = cached;
}
function pickmycolor1(cl)
{
    var td = document.getElementById("colorpat").getElementsByTagName("table")[1].rows[1].insertCell(-1);
    td.bgColor = cl;
    td.innerHTML = cl;
    td = document.getElementById("colorpat").getElementsByTagName("table")[1].rows[0].insertCell(-1);
    td.innerHTML = document.getElementById("colorpat").getElementsByTagName("table")[1].rows[1].cells.length + '(X)';
    td.onclick = function (){delthiscolorsel(this);}
}
 
function initializeContextManu()
{ 
    cmenu = document.createElement('div');
    cmenu.id = "cmenu";
    cmenu.style.cssText="visibility:hidden;position:absolute;background-color:#BBBBBB;padding:2px 2px 2px 2px;border-radius:3px;box-shadow:#00BBBB 1px 1px;border:1px " + fortblcolor + " sold";
    menutbl = document.createElement('table');
    menutbl.id = "menutbl";
    menutbl.border = 0;menutbl.bgColor='#EEEEEE';
    menutbl.cellSpacing = 1;
    menutbl.cellPadding = 0;
    cmenu.appendChild(menutbl);
    document.body.appendChild(cmenu);
   
    var cachedcolorstr = localStorage["tlmttcl"];
    if (cachedcolorstr!=null) mycolors =  cachedcolorstr.split(/,/);

    var c =  newmenu(-1, "editit",strlabel[14],2);
    c.align = 'center';
    c.onclick =  function () {editmode(document.getElementById("editmodebtn"));}
    c = newmenu(0, "handle","<nobr>" + strlabel[25] + "</nobr>",1);Drag.init(c,cmenu);
    c.style.backgroundColor = fortblcolor;
    
    newmenu(0, "closec",strlabel[15],1).onclick = closemenu;
    var r; 

r = menutbl.insertRow(-1);r.bgColor =   fortblcolor ;
c = r.insertCell(-1);c.colSpan= 1; c.innerHTML= "<nobr>" + strlabel[50] + "</nobr>"; Drag.init(c,cmenu);
c = r.insertCell(-1);c.innerHTML = "<input id=tblid size=4 style=\"width:30px;color:" + fortblcolor+"\" value=\"\" style=\"background-color:#666666\" readonly >";
c = r.insertCell(-1);c.innerHTML= "<nobr>" + strlabel[53] + "</nobr>";Drag.init(c,cmenu);
c = r.insertCell(-1); 
c.innerHTML= "<input id=classname  style=width:30px value=\"\" onchange=setClassName(this)>";

var labels = [strlabel[45], '&larr;', "|", '&rarr;'];
for (i=0; i < 4; i++)
{
if (i==0  )  r = menutbl.insertRow(-1);    
c = r.insertCell(-1);c.align="center";c.width=15;r.bgColor =  fortblcolor;
if (i> 0) c.onclick= settbalign;
else{c.id="tableborder"; Drag.init(c,cmenu);}
c.innerHTML= labels[i]+"<!--" + i +"-->"  ;
}

r = menutbl.insertRow(-1);r.bgColor =   fortblcolor ;
c = r.insertCell(-1);c.innerHTML=  strlabel[44]  ; Drag.init(c,cmenu); 

c = r.insertCell(-1);
c.colSpan= 3;
c.innerHTML= "<input id=tburl size=15 onfocus=bigg(this) value=\"\">";


for (i=0; i < 3; i++)
{
if (i==0  )  
{
    r = menutbl.insertRow(-1);r.bgColor =   fortblcolor ;c = r.insertCell(-1);c.width=15;c.innerHTML=strlabel[46]; 
    Drag.init(c,cmenu);
}
c = r.insertCell(-1);c.width=15;c.align='center';c.onclick=setborder;c.innerHTML= i  ;
}
 
for (i=0; i < 3; i++)
{
if (i==0  )  
{
    r = menutbl.insertRow(-1);r.bgColor = fortblcolor;c = r.insertCell(-1);c.width=15;c.innerHTML=strlabel[47] ;
    Drag.init(c,cmenu);
}
c = r.insertCell(-1);c.width=15;c.align='center';c.onclick=setspacing;c.innerHTML=  i*2;
}
for (i=0; i < 3; i++)
{
if (i==0  )  
{
    r = menutbl.insertRow(-1);r.bgColor = fortblcolor;c = r.insertCell(-1);c.width=15;c.innerHTML=strlabel[48];
    Drag.init(c,cmenu);
}
c = r.insertCell(-1);c.width=15;c.align='center';c.onclick=setpadding;c.innerHTML= i*3;
}    

r = menutbl.insertRow(-1); 
c = r.insertCell(-1);   c.innerHTML= strlabel[49];
 Drag.init(c,cmenu);
c = r.insertCell(-1); c.innerHTML = "<input id=cellid size=4 style=width:30px value=\"\"  onchange=setCellId(this)>";
c = r.insertCell(-1); c.innerHTML = "<nobr>" + strlabel[53] + "</nobr>";Drag.init(c,cmenu);
c = r.insertCell(-1); c.innerHTML = "<input id=cellclass size=4 style=width:30px value=\"\" onchange=setCellClass(this)>";
 
labels = [strlabel[45], '&larr;', "|", '&rarr;'];   
for (i=0; i < 4; i++)
{
if (i==0  )  r = menutbl.insertRow(-1);    
c = r.insertCell(-1);
if (i> 0){c.width=15;c.align="center";c.onclick=setalign;} 
else {c.colSpan = 1;c.align='left';c.setAttribute('align','left');Drag.init(c,cmenu);}
c.innerHTML= labels[i]+"<!--" + i +"-->"  ;
}

 

labels = [ strlabel[51], '&uarr;','--','&darr;'];
for (i=0; i < 4; i++)
{
if (i==0  )  r = menutbl.insertRow(-1);
c = r.insertCell(-1);
if (i> 0){c.width=15;c.align="center";c.onclick=setvalign;} 
else {c.colSpan = 1;c.align='left';Drag.init(c,cmenu);}
c.innerHTML= labels[i] +"<!--" + i +"-->" ;
}




for (var i=0; i < 7; i++)
{
if (i==0 || i==3)
{
    r = menutbl.insertRow(-1);   
}
if (i == 0)
{
    var c = r.insertCell(-1);
c.width=15;
 
c.align= 'left';c.vAlign= 'top';
c.innerHTML = strlabel[32]; 
Drag.init(c,cmenu);
}
c = r.insertCell(-1);
c.width=15;
c.align= 'center';
c.onclick=setfontsize;
c.innerHTML = (10+i*5); 
}
 
for (i=0; i < 8; i++)
{
if (i==0 || i==4)  r = menutbl.insertRow(-1);
c = r.insertCell(-1);
c.align='center';
c.onclick=setcolor;
c.style.color = mycolors[i];
c.innerHTML=   strlabel[33]  ;
c.style.fontWeight = '700' 
}
   

for (i=0; i < 8; i++)
{
if (i==0 || i==4)  r = menutbl.insertRow(-1);  
c = r.insertCell(-1);c.width=15;c.align='center';c.onclick=setbgcolor;c.innerHTML= strlabel[52];
if(i == 4)
{
          c.style.border='1px #b0b0b0 solid'; c.style.backgroundColor = 'transparent'; 
}
else    
           c.style.backgroundColor = mycolors[i]; 
}


r = menutbl.insertRow(-1);
c = r.insertCell(-1);c.innerHTML= strlabel[44]; Drag.init(c,cmenu);

c = r.insertCell(-1);c.colSpan= 3;c.innerHTML= "<input id=url size=15 onfocus=bigg(this) value=\"\"><a href=\"javascript:godown()\">&darr;</a>";





newmenu(-1,"edit", "<textarea rows=3 id=entertxt style=\"width:194px\" onfocus=bigger(this) onchange=\"settext()\"></textarea>",4);
r = menutbl.insertRow(-1);
c = r.insertCell(-1);c.innerHTML= strlabel[29];Drag.init(c,cmenu);
c = newmenu(menutbl.rows.length-1,"widthm", "<input id=widthtxt style=\"width:30px;margin:0px 0px 0px 0px\"  onchange=\"settext()\" />",1);
c.style.padding="0px 0px 0px 0px";
c.style.border="0px";
 
c = r.insertCell(-1);c.innerHTML= strlabel[28];
c.onclick=function(){showinputs(this);} 
//c.onmouseover=function(){showinputs(this);}
c.align = 'center' ;

c = newmenu(menutbl.rows.length-1,"morecssd",  strlabel[31],1);
c.onclick = function(){moreccs(this);};
//c.onmouseover=function(){moreccs(this);};

 
}

function godown()
{
    var id = clickedcells[numclicked-1];
    var td = document.getElementById(id.t).rows[id.r].cells[id.c]; 
    document.getElementById("entertxt").value = 
        "<img width=" + td.offsetWidth + " height=" + td.offsetHeight + " src=\"" + document.getElementById("url").value  + "\"/>";
}
function settbalign()
{
   var id = clickedcells[numclicked-1];
   var c = document.getElementById(id.t);
   var x = mapa[parseInt(this.innerHTML.replace(/[^0-9]+([0-9]).*/, '$1'))];
   c.setAttribute("align", x);
}
function setalign()
{
   
   for (var i=0; i < numclicked; i++)
   {
        var id = clickedcells[i];
        var c = document.getElementById(id.t).rows[id.r].cells[id.c];
        
        c.align = mapa[parseInt(this.innerHTML.replace(/[^0-9]+([0-9]).*/, '$1'))];
   }
   
}
function setvalign()
{
   
   for (var i=0; i < numclicked; i++)
   {
        var id = clickedcells[i];
        var c = document.getElementById(id.t).rows[id.r].cells[id.c];
        c.vAlign = maps[parseInt(this.innerHTML.replace(/[^0-9]+([0-9]).*/, '$1'))]; 
   }
   
  
}
function setspacing()
{
   var id = clickedcells[numclicked-1];
   document.getElementById(id.t).cellSpacing = this.innerHTML; 
}
function setpadding()
{
   var id = clickedcells[numclicked-1];
   document.getElementById(id.t).cellPadding = this.innerHTML; 
}
function setborder()
{
   var id = clickedcells[numclicked-1];
   document.getElementById(id.t).border = this.innerHTML; 
}
 
function setcolor()
{
   for (var i=0; i < numclicked; i++)
   {
        var id = clickedcells[i];
        var c = document.getElementById(id.t).rows[id.r].cells[id.c];
        c.style.color = this.style.color;
   }
    
}
function setbgcolor()
{
    for (var i=0; i < numclicked; i++)
   {
        var id = clickedcells[i];
        var c = document.getElementById(id.t).rows[id.r].cells[id.c];
        c.style.backgroundColor = this.style.backgroundColor;
   }
   changedbg = true;
   
}

function setfontsize()
{
    for (var i=0; i < numclicked; i++)
   {
        var id = clickedcells[i];
        var c = document.getElementById(id.t).rows[id.r].cells[id.c];
        c.style.fontSize = this.innerHTML + "px";
   }
   
}
function goodchar(s)
{
    var a = ''; for (var i=0; i < s.length; i++)
    {
        var c = s.charAt(i).toLowerCase();
        if ( c <='z' && c >='a' || c <='9' && c >='0' || c =='_')
            a += s.charAt(i);
    }
    return a;    
}
function setClassName(v)
{
    v.value = goodchar(v.value);
    var id = clickedcells[0];
    var t = document.getElementById(id.t);
    if (t.className != null && v.value == '') t.className = null;
    if (v.value!='')  
    t.className = v.value;
}
function setCellId(v)
{
    v.value = goodchar(v.value);
    var id = clickedcells[0];
    var t = document.getElementById(id.t).rows[id.r].cells[id.c];
    if (t.id != null && v.value == '') t.id = null;
    if (v.value!='')  
    t.id = v.value;
}

function setCellClass(v)
{
    v.value = goodchar(v.value);
    for (var i=0; i < numclicked; i++)
    {
        var id = clickedcells[i];
        var t = document.getElementById(id.t).rows[id.r].cells[id.c];
        if (t.className != null && v.value == '') t.className = null;
        else if (v.value!='')  
           t.className = v.value;
    }
    
}

function settext()
{
   var txt = document.getElementById("entertxt");
   
   if (txt.value!='') 
   { 
       for (var i=0; i < numclicked; i++)
       {
            var id = clickedcells[i];
           
            var c = document.getElementById(id.t).rows[id.r].cells[id.c];
            savedtxt[id] = c.innerHTML;
            if (typeof(LaTexHTML) != 'undefined')
            {
                LaTexHTML.deformat(c);
            }
            c.innerHTML  = txt.value;
            if (typeof(LaTexHTML) != 'undefined')
            {
                LaTexHTML.formatele(c);
            }
       }
   }
   
   var wtxt = document.getElementById("widthtxt");
   
   if (wtxt.value!='') 
   { 
   for (  i=0; i < numclicked; i++)
   {
         id = clickedcells[i];
         c = document.getElementById(id.t).rows[id.r].cells[id.c];
        c.width  = wtxt.value;
   }
    
   //wtxt.value= "";
    
   }
   
   var url = document.getElementById("url");
   var urlv = url.value.replace(/^[ ]+/,'').replace(/[ ]+document.getElementById/,'').replace(/[ ]+/,' ');
  
   if (urlv != '')
   { 
   var rp = 'repeat';
   var j = urlv.indexOf(' ');
   if (j > 0)
   {
       rp = urlv.substring(j+1);
       urlv = urlv.substring(0,j);
   }
   
   if (rp.indexOf('x')>=0) rp ='repeat-x';
   else if (rp.indexOf('y')>=0) rp ='repeat-y';
   if (rp.indexOf('no')>=0) rp ='no-repeat';
       
   for (  i=0; i < numclicked; i++)
   {
        id = clickedcells[i];
        c = document.getElementById(id.t).rows[id.r].cells[id.c];
        c.style.backgroundImage  = "url(" + urlv +")";
        c.style.backgroundRepeat = rp;
   }
   changedbg = true;
   //url.value= "background url";
    
   }
   
   url = document.getElementById("tburl");
   urlv = url.value.replace(/^[ ]+/,'').replace(/[ ]+document.getElementById/,'').replace(/[ ]+/,' ');
   
   if (urlv != '') 
   { 
   var rp = 'repeat';
   var j = urlv.indexOf(' ');
   if (j > 0)
   {
       rp = urlv.substring(j+1);
       urlv = urlv.substring(0,j);
   }
   
   if (rp.indexOf('x')>=0) rp ='repeat-x';
   else if (rp.indexOf('y')>=0) rp ='repeat-y';
   if (rp.indexOf('no')>=0) rp ='no-repeat';
       
   var tb = document.getElementById(id.t);
   tb.style.backgroundImage  = "url(" + urlv +")";
   tb.style.backgroundRepeat = rp;
   url.size=10;
   }
   
   
   oldnumclicked = numclicked;
   //txt.value = '';
   rows= 3;
  // document.getElementById("undobtn").style.visibility = 'visible';
}
function newmenu(rn, id, label,n)
{
    if (document.getElementById(id) != null)
    {
        document.getElementById(id).innerHTML = label;
        return null;
    }
    
     
    
    var r= null;
    if (n >=3 || rn==-1 || label==strlabel[16] || label==strlabel[17] || id=='minsertrow' || id=="minsertcell" || id=="quicksel")
    {
        r = menutbl.insertRow(rn);
    }
    else
    {
       r = menutbl.rows[rn];
    }
    if (label==strlabel[18] || label==strlabel[17]) 
        r.bgColor =  fortblcolor ; 
        
    var c = r.insertCell(-1);
    if (n >=3 || rn==-1)
        c.align = 'left';
    else
        c.align = 'center';
    c.style.border = '1px #777777 solid';
    c.style.padding = '0px 0px 0px 0px'; 
    c.colSpan= n;
    c.id = id;
    c.innerHTML = label;
    
    if (label.indexOf(strlabel[25]) >=0)
    { 
     Drag.init(c,cmenu); 
    }
    return c;
}
function closemenu()
{
     cmenu.style.visibility ='hidden'; 
     if (changedbg == false)
     for (var i= numclicked-1; i>=0; i--)
     {
            var id = clickedcells[i];
            var tb = document.getElementById(id.t);
            if (tb!=null)
            {
              var c = tb.rows[id.r].cells[id.c];
              deleteacheck(id);
             // if (c!=null) setbg(c, savedbgs[i]);
            }
     }
      
     notmake();
     notset();
     notround();
     numclicked=0;
     changedbg = false;
}

function opendialog(s)
{
   var div  = document.getElementById("dialog");

   div.style.cssText = "visibility:visible;position:absolute;left:6px;top:36px;z-index:20;border:1px #b0b0b0 outset;border-radius:4px;top:50px;left:50px;box-shadow:#CCCCCC -2px -px;background:linear-gradient(#dddddd,#cccccc);width:280px !important";
   if (tableid>0)
   {
       var id = clickedcells[0];
       var td = document.getElementById(id.t).rows[id.r].cells[id.c];
       var z = findPositionnoScrolling(td);
       div.style.left = z[0] + "px";
       div.style.top = z[1] + "px";
       cmenu.style.visibility = 'hidden';
   }
   if (s!=null) handledialog.rows[0].cells[0].innerHTML  = "<font color=green><b>" + s +"</b></font>";
   //centerlize(div);
}
function readvalue()
{
   document.getElementById("editmodebtn").disabled = false;
  // document.getElementById("undobtn").disabled = false;
   var numrowstr = handledialog.rows[1].cells[1].getElementsByTagName('input')[0].value ;
   
   if (isNaN(numrowstr))
   {
         handledialog.rows[0].cells[0].innerHTML  = strlabel[19] + ' > 0';
         return;
   }

  var numrow = parseInt(numrowstr);
   if (numrowstr.indexOf(".") >=0 ||numrow <=0 || Math.round(numrow) !=numrow)
   {
          
           handledialog.rows[0].cells[0].innerHTML  = strlabel[19] + ' > 0';
          return;
   }
   var numcolstr  = handledialog.rows[2].cells[1].getElementsByTagName('input')[0].value;
   
   var numcol = parseInt(numcolstr);
    if (numrowstr.indexOf(".") >=0 || ''+numcol == 'NaN')
    {
             handledialog.rows[0].cells[0].innerHTML  = strlabel[19] + ' > 0';
            return;
    }
    document.getElementById("dialog").style.visibility = "hidden";
    if (isNaN(handledialog.rows[3].cells[1].getElementsByTagName('input')[0].value))  
              handledialog.rows[3].cells[1].getElementsByTagName('input')[0].value = '';
    if (isNaN(handledialog.rows[4].cells[1].getElementsByTagName('input')[0].value))  
              handledialog.rows[4].cells[1].getElementsByTagName('input')[0].value = '';
    cellwidth =   handledialog.rows[3].cells[1].getElementsByTagName('input')[0].value;
    cellheight =  handledialog.rows[4].cells[1].getElementsByTagName('input')[0].value;
    maketable(numrow, numcol);
}
var makingform = false;
function maketable(numrows, numcols)
{
     makingform = false;
     var tbl = document.createElement('table');
     tbl.align = 'center';
     tbl.border = 0;
     tbl.id= "t" + (tableid++);
     tbl.style.cssText = "border-collapse:collapse;background-color:white;";
     if (tableid <= 1)
     {
         var DBGCOLOR = '#ddc8c4';  
         var BBGCOLOR = '#eeeeee'; 
         if (typeof(parent.parent.frames[0].giveColors) != 'undefined') 
         {
           
             var xx = parent.parent.frames[0].giveColors().split(/,/);
             BBGCOLOR = xx[1];
             DBGCOLOR = xx[0];
         }
         tbl.style.cssText += "border-radius:5px;background:linear-gradient(" + DBGCOLOR + "," + BBGCOLOR + ");border:0px #cccccc outset"
     }
     
     for (var i=0; i < numrows; i++)
     {
          var trele = tbl.insertRow(i);
          if (cellwidth!='') trele.height = cellheight;
           for (var j=0; j < numcols; j++)
           {
                  var cell = trele.insertCell(j);
                  cell.innerHTML = nonbreakspace;
                  if (cellwidth!='') cell.width = cellwidth;
                  cell.onclick =  function(){userclick(this);}
           }
     }
     
     if (tableid==1)
     {
         makingform = true;
         var xx = document.getElementById("buttonpanel").nextSibling;
         if (xx == null) 
             document.body.appendChild(tbl);
         else
            document.body.insertBefore(tbl,xx);
         var ind = document.createElement("div");
         ind.id = 'inithint';
         ind.innerHTML = strlabel[55];
         document.body.insertBefore(ind,xx);
         setTimeout("deletehint(0)", 20000);
         betterplace();
         //editmode(document.getElementById("editmodebtn"));
         tbl.cellSpacing = "3";
         tbl.cellPadding = "3";
         tbl.border = "1";
         tbl.style.cssText = tbl.style.cssText + ";border-collapse:collapse;border-width:1px;border-style:dotted;border-color:grey";
         for (var k=numcols-1; k >0; k--)
             tbl.rows[0].deleteCell(k);
         tbl.rows[0].cells[0].colSpan = "" + numcols;
         tbl.rows[0].cells[0].style.fontSize = "30px";
         tbl.rows[0].cells[0].align = "center";
         tbl.rows[0].cells[0].innerHTML =  textmsg[23] + " " + textmsg[15]  ;
         if (numcols == 2)
         {
         for (var i=1; i < numrows && i < tbl.rows.length; i++)
         {
             tbl.rows[i].cells[0].style.fontSize = "18px";
             tbl.rows[i].cells[1].style.fontSize = "18px";
             tbl.rows[i].cells[0].innerHTML = textmsg[719].replace(/ /,'') + "_" + i;
         }
         if (numrows>1)
         tbl.rows[1].cells[1].innerHTML = "______________________________________________";
         if (numrows>2)tbl.rows[2].cells[1].innerHTML = "(1=" + textmsg[855] + "1/2=" + textmsg[855] + "2/3=" + textmsg[855] + "3)_______";
         if (numrows>3)tbl.rows[3].cells[1].innerHTML = "_______";
         if (numrows>4)tbl.rows[4].cells[1].innerHTML = "(1=" + textmsg[855] + "1,2=" + textmsg[855] + "2,3=" + textmsg[855] + "3)_______";
         if (numrows>5)tbl.rows[5].cells[1].innerHTML = "[_____________________________________________]";
         if (numrows>6)tbl.rows[5].cells[0].vAlign = "top";
         }
         else
         {
             
         }
         cmenu.style.left =  "50px";
         cmenu.style.top =   "100px";
     }
     else
     {
         var id = clickedcells[0];
         var td = document.getElementById(id.t).rows[id.r].cells[id.c];
         
         td.appendChild(tbl);
         father[tbl.id] = id.t;
         numclicked = 0;
     } 
    
}
function deletehint(i)
{
    i++;
    var ind = document.getElementById('inithint');
    if (i == 16)
    {
       document.body.removeChild(ind); 
       return;
    }
    var x = i;
    if (i >= 10) x = String.fromCharCode( ('A').charCodeAt(0)  + (i-10));
    ind.style.color = "#" + x + x + x;
    setTimeout("deletehint(" + i + ")", 300);
            
}
var divid = 0;
function makeadiv()
{
     numqueuedclicks = 0;
     cmenu.style.visibility = 'hidden'; 
     var div = document.createElement('div');
     div.id= "t" + (tableid++);
     div.style.cssText = "border:1px #b0b0b0 solid;corner-radius:10px;background-color:white;color:black;width:100px;height:200px;border:1px #b0b0b0 solid;text-align:center;valign:middle;float:center";
     div.innerHTML = nonbreakspace;
     div.onclick =  function(){userclick1(this);}
     var id = clickedcells[0];
     var td = document.getElementById(id.t).rows[id.r].cells[id.c];
     
     td.appendChild(div);
     father[div.id] = id.t;
     numclicked = 0;
    userclick1(div);
}

function userclick1(td)
{
       if (document.getElementById("editdiv") !=null) return;
       var xy = findPositionnoScrolling(td);
       xy[0] += td.offsetWidth+5; 
       var t = document.createElement("div");
       t.id = "editdiv";
       t.style.cssText = "background-color:#EEE;position:absolute;left:" + xy[0] + "px;top:0px;border:2px #888888 outset";
       t.innerHTML = "<form rel=opener name=fd style=\"margin:0px 0px 0px 0px\" method=post  ><table>"
           + "<tr><td id=csshead colspan=2 bgcolor=" + fortblcolor + " align=center> CSS </td></tr>" 
           + "<tr><td>id</td><td>" + td.id + "</td></tr>" 
           + "<tr><td>class</td><td><input name=classn value=\"" + td.className + "\"  size=12></td></tr>" 
           + "<tr><td colspan=2><textarea name=textv rows=4 cols=28>" + td.innerHTML + "</textarea></td></tr>"
   
            + "<tr><td>color</td><td><input name=color value=\"" + td.style.color + "\"  size=12></td></tr>" 
           + "<tr><td>background-color</td><td><input name=backgroundColor value=\"" + td.style.backgroundColor + "\" size=12></td></tr>" 
           + "<tr><td>background-image</td><td><input name=backgroundImage value=\"" + td.style.backgroundImage + "\" size=12></td></tr>" 
           + "<tr><td>background-position</ttd><td><input name=backgroundPositon value=\"" + td.style.backgroundPosition + "\" size=12></td></tr>" 
           + "<tr><td>background-repeat</td><td><input name=backgroundRepeat value=\"" + td.style.backgroundRepeat + "\" size=12></td></tr>" 
           
            + "<tr><td>position</td><td><input name=position value=\"" + td.style.position + "\"  size=12></td></tr>" 
           + "<tr><td>top</td><td><input name=top value=\"" + td.style.top + "\" size=12></td></tr>" 
           + "<tr><td>left</td><td><input name=left value=\"" + td.style.left + "\" size=12></td></tr>" 
           + "<tr><td>width</td><td><input name=width value=\"" + td.style.width + "\"  size=12></td></tr>"
           + "<tr><td>height</td><td><input name=height value=\"" + td.style.height + "\"  size=12></td></tr>"
            
           + "<tr><td>margin</td><td><input name=margin1 value=\"" + td.style.margin + "\"  size=12></td></tr>" 
           + "<tr><td>padding</td><td><input name=padding value=\"" + td.style.padding + "\" size=12></td></tr>" 
           + "<tr><td>border</td><td><input name=border value=\"" + td.style.border + "\" size=12></td></tr>" 
           + "<tr><td>font-size</td><td><input name=fontSize value=\"" + td.style.fontSize + "\"  size=12></td></tr>"
           
   
           + "<tr><td>font-family</td><td><input name=fontFamily value=\"" + td.style.fontFamily + "\"  size=12></td></tr>"
           + "<tr><td>font-weight</td><td><input name=fontWeight value=\"" + td.style.fontWeight + "\" size=12></td></tr>" 
           + "<tr><td>text-decoration</td><td><input name=textDecoration value=\"" + td.style.textDecoration + "\" size=12></td></tr>" 
           + "<tr><td>cursor</td><td><input name=cursor value=\"" + td.style.cursor + "\"  size=12></td></tr>"
           + "<tr><td>border-radius</td><td><input name=borderRadius value=\"" 
           + (typeof(td.style.borderRadius)=='undefined'?'':td.style.borderRadius) 
           + "\"  size=12></td></tr>"
           + "<tr><td colspan=2 align=center><input type=button style=\"width:65px;color:blue;cursor:pointer;border:1px black solid\" name=submset value=\"" + strlabel[30] + "\" onclick=setdiv('" + td.id +"')>"
           +" <input  style=\"width:65px;color:blue;cursor:pointer;border:1px black solid\"  type=button name=cancel value=\"" + strlabel[37] + "\" onclick=\"canceldiv()\"></td></tr></table></form>"; 
       document.body.appendChild(t);
       Drag.init(document.getElementById('csshead'), t);
}

function setdiv(did)
{
   var d = document.getElementById(did); 
   var f = document.fd;
   if (f == null) return;
   d.className  = f.classn.value;
   d.innerHTML = f.textv.value;
   d.style.cssText = "color:" + f.color.value + ";"
           + "background-color:" + f.backgroundColor.value  +  ";"
           + "background-image:" + f.backgroundImage.value + ";"
           + "background-position:" + f.backgroundPositon.value + ";"
           + "background-repeat:" + f.backgroundRepeat.value + ";" 
   
           + "position:" + f.position.value + ";" 
           + "left:" + f.left.value + ";"
           + "width:" + f.width.value + ";"
           + "top:" + f.top.value + ";"
           + "height:" + f.height.value + ";"
   
           + "margin:" + f.margin1.value + ";"
           + "padding:" + f.padding.value + ";"
           + "border:" + f.border.value + ";"
           + "font-size:" + f.fontSize.value + ";"
   
           + "font-family:" + f.fontFamily.value + ";"
           + "font-weight:" + f.fontWeight.value + ";"
           + "text-decoration:" + f.textDecoration.value + ";"
           + "cursor:" + f.cursor.value + ";"
           + "-webkit-border-radius:" + f.borderRadius.value+ ";"
           + "-moz-border-radius:" + f.borderRadius.value+ ";"
           + "corner-radius:" + f.borderRadius.value; 
    document.body.removeChild(document.getElementById("editdiv"));
   
}

function canceldiv()
{
    document.body.removeChild(document.getElementById("editdiv"));
}

function processkeys(ta,evt)
{
    
var e = evt? evt : window.event;
if(!e) return true;
var key = 0;
if (e.keyCode) {key = e.keyCode;} // for moz/fb, if keyCode==0 use 'which'
else if (typeof(e.which)!= 'undefined') {key = e.which;}
if (key == 13)
{
   if (ta.tagName.toLowerCase() =='input')
   {
      var xx = ta.value;
      var td = ta.parentNode;
      td.removeChild(ta);
      var txt = document.createElement("textarea");
      txt.style.cssText = "height:" + (td.offsetHeight + 30) +"px;width:" + td.offsetWidth +"px;border:0px";
      txt.value = xx;
      txt.id='editctrl';
      txt.rows = 2;
      txt.focus();
      txt.onkeypress = function(){processkeys(this,event);}
      td.innerHTML = '';
      td.appendChild(txt);
   }    
   else
   {
      ta.rows++;
      ta.style.height = (ta.offsetHeight + 19) + 'px';
   }
}
}

function getvalue()
{
    var id = clickedcells[0];
    if (id==null) return;
    var tb = document.getElementById(id.t);
    var td = tb.rows[id.r].cells[id.c];
    var tx = document.getElementById("editctrl");
    if (tx == null) return;
    var xx = tx.value;
    td.removeChild(tx);
    savedtxt[id] = td.innerHTML;
   // document.getElementById("undobtn").style.visibility = "visible";
    oldnumclicked = 1;
    if (xx=='') xx = '&nbsp;';
    if (typeof(LaTexHTML) != 'undefined')
    {
            LaTexHTML.deformat(td);
           
    }
    td.innerHTML = xx;
    if (typeof(LaTexHTML) != 'undefined')
    {
           
            LaTexHTML.formatele(td);
    }
    clickedcells[0] = null;
}
var navmode = 'h';
function passfc()
{
    
    var id = clickedcells[0]; 
    var tb = document.getElementById(id.t);
   
    getvalue();
    
   
    if (navmode =='h')
    {
        if (tb.rows[id.r].cells.length == 1 + id.c )
        {
        id.c = 0;
        id.r = (id.r + 1) % (tb.rows.length);
        }
        else id.c++;
    }
    else
    {
        if (tb.rows.length == 1 + id.r )
        {
           id.r = 0;
           if (id.c < tb.rows[0].cells.length-1)
           id.c++;
           else id.c = 0;  
        }
        else id.r++;
    }
    var td = tb.rows[id.r].cells[id.c];
    //clickedcells[0] = id;
    window.scrollTo( scrollLeft, scrollTop); 
    userclick(td);
}
var quenuedclicks = [];
var numqueuedclicks = 0;
function gettable(td)
{
    var x = td.parentNode.parentNode;
    if (x.tagName.toLowerCase()!='table')x = x.parentNode;
    return x;
}
var scrollLeft, scrollTop;
function userclick(td)
{
    scrollLeft = document.body.scrollLeft;
    scrollTop  = document.body.scrollTop;
    cmenu.style.visibility = 'hidden';
    //document.getElementById("undobtn").style.visibility = 'hidden'; 
    var x = gettable(td);
    var tblid = x.id;
    var id = null;
    for (var i=0; i < x.rows.length && id==null; i++)
       for (var j=0; j < x.rows[i].cells.length; j++)
          if (x.rows[i].cells[j] == td)
          {
               id = {t:tblid, r:i, c:j};
               quenuedclicks[numqueuedclicks++] = id;
               toprocessclicks();
               break;
          }
}

function firstsubtable(x)
{

    if (x.childNodes.length == 0) return null;

    var s = 0;
    if (x.tagName.toLowerCase()=='table' && x.id!=null && x.id.length>0 && x.id.replace(/t[0-9]+/,'') =='')
    {
        return x;
    }
    for (var i=0; i < x.childNodes.length; i++)
    {
        var t = firstsubtable(x.childNodes[i]);
        if (t !=null) return t;
    }
    return null;
}


function toprocessclicks()
{
    if (document.getElementById("editdiv") !=null) return;
    var mm=0, mi=0;
    if (numqueuedclicks==0) return;
    for (var i=0; i < numqueuedclicks; i++)
    {
        var mj = parseInt(quenuedclicks[i].t.substring(1));
        if (mj > mm) {mm = mj;mi=i;}
    }
    numqueuedclicks = 0;
    var id = quenuedclicks[mi]; 
    if (id==null) return;
     
    var tb = document.getElementById(id.t);
    if (tb==null) return;
    var td = tb.rows[id.r].cells[id.c];
    if (mode =='edit')
    {
        
        var tc = firstsubtable(td);
        if (tc!=null)
        {
            tb = tc;
            id.t = tc.id;
            id.c = id.r = 0;
            td = tb.rows[id.r].cells[id.c];
        }
    }
    
    if (mode =='edit')
    {

        if (clickedcells[0]!=null)
        {
            if (clickedcells[0].c == id.c && clickedcells[0].t == id.t && clickedcells[0].r == id.r)
                return;
            navmode = (clickedcells[0].c == id.c)?'v':'h';
            getvalue();
        }
        var xx = td.innerHTML;
        if (xx.indexOf("<table ") >= 0) return;
        if (td.offsetHeight > 30)
        {
            var txt = document.createElement("textarea");
            txt.id='editctrl';
            txt.style.cssText = "height:" + td.offsetHeight +"px;width:" + td.offsetWidth +"px;border:0px";
        }
        else
        {
            txt = document.createElement("input");
            txt.id='editctrl';
            txt.style.cssText = "width:" + td.offsetWidth +"px;border:0px";
        }
        if (xx == '&nbsp;') xx = '';
        txt.value = xx;
        txt.onkeypress = function(){processkeys(this,event);}
        td.innerHTML = '';
        td.appendChild(txt);
        txt.focus();
        clickedcells[0] = id;
        numclicked = 0;
        clearchecks();
    }
    else
    {       
         mark(id.t, id.r, id.c);
         showmenu();
    }      // this allow inner table's cell go first 
}

function mark(tblid,r,c)
{ 
      if ( donelist.indexOf( ',' + tblid+ ',') >=0)
      {
          if (tblid == 't0')
              donelist = ',';
          return;
      }
      var ff = father[tblid];
      while (ff!=null)
      {
         donelist += (ff +',');
         ff = father[ff];
      }

      var td = document.getElementById(tblid).rows[r].cells[c];
      var id =  {t:tblid, r:r, c:c}; 
      
      var i =0;
      
      if (numclicked > 0)
      {
          for (; i <  numclicked; i++)
          {
              if ( clickedcells[i].t == id.t && clickedcells[i].c == id.c && clickedcells[i].r == id.r)
              {
                 return;
              }
          }
      }
      if (i >= numclicked)
      {
         clickedcells[numclicked++] = id;
         makeacheck(td,id);
      }
          
}

function makeacheck(td,id)
{
    var follower = document.createElement("div");
    follower.id = "m_" + id.t + "_" + id.r + "_" + id.c;
    var xy = findPositionnoScrolling(td);
    follower.style.cssText = "position:absolute;z-index:20;border:1px green solid;background:url(image/answerright.gif) white no-repeat;width:20px;height:20px;left:"
    + (xy[0]) + "px;top:" + xy[1]   + "px";
    follower.onmouseover=showmenu;
    follower.onclick = noselect;
    document.body.appendChild(follower);
}
function noselect()
{
   var x = this.id.substring(2).split(/_/);
   for (var i=0; i < numclicked; i++)
   if ( clickedcells[i].t == x[0] && clickedcells[i].r == x[1] && clickedcells[i].c ==x[2])
   {
       if (i < numclicked - 1)
       clickedcells[i] = clickedcells[numclicked - 1];
       break;
   }
   var follower = document.getElementById("m_" + x[0] + "_" + x[1] + "_" + x[2]);
    if (follower!=null)
    document.body.removeChild(follower);
    if (numclicked>0) numclicked--;
    if (numclicked == 0) closemenu();
    else
        showmenu();
}
function deleteacheck(id)
{
    var follower = document.getElementById("m_" + id.t + "_" + id.r + "_" + id.c);
    if (follower!=null)
    document.body.removeChild(follower);
}

function deletetable()
{
          if (numclicked == 0) return;
          var id = clickedcells[numclicked-1]; 
          var tb = document.getElementById(id.t);
          var n = counttablen(tb.parentNode,false);
          tb.parentNode.removeChild(tb);
          numclicked=0;
          closemenu();
          if (id.t =='t0')
          { 
              
              tableid = 0;
              opendialog(strlabel[20]);
              
          }
           
}


function   copytable()
{
   var id = clickedcells[0];
   var x = document.getElementById(id.t);
   closemenu();
   copiedtable = "<table id=XXX style=\"" +x.style.cssText +"\" border=" + x.border + ">"  + x.innerHTML.replace(/ id="t[0-9]+" /ig, '').replace(/<table /ig, '<table id=XXX')  + "</table>";
    
   
}
function subsid(s)
{
    while (true)
    {
        var ss =  s.replace(/<table id=XXX/, '<table id="t' + tableid + '" ' );
        if (ss == s) 
            break;
        else 
            tableid++;
         
        s = ss;
    }
    return s;
}
function   pastetable()
{
   for (var i=0; i <  numclicked; i++)
   {  
       var id = clickedcells[i];
       var td = document.getElementById(id.t).rows[id.r].cells[id.c];
       td.innerHTML  = td.innerHTML.replace(/&nbsp;document.getElementById/,'') + subsid(copiedtable);
       
   }
   numclicked = 0; 
   cmenu.style.visibility ='hidden'; 
   closemenu();
}
function    delrow()
{
   var id = clickedcells[0];
   deleteacheck(id);
   var tb = document.getElementById(id.t);
   tb.deleteRow(id.r); 
   numclicked = 0;
   closemen();
}

function insrow()
{
   
    var id = clickedcells[0];
    var tb = document.getElementById(id.t);
    var r1 = (id.r == 0?0:1);
    var r = tb.insertRow(id.r + r1); 
    for (var i=0; i <tb.rows[id.r+1-r1].cells.length; i++)
    {
        var c = r.insertCell(-1);
        c.colSpan = tb.rows[id.r+1-r1].cells[i].colSpan;
        c.innerHTML = nonbreakspace;
        c.onclick = function(){userclick(this);}
    } 
    if (id.r ==0)
        clickedcells[0].r = 1;
    closemenu();
}
function  delcol()
{
    var id = clickedcells[0];
    deleteacheck(id)
    var tr = document.getElementById(id.t).rows[id.r];
    tr.deleteCell(id.c);
    numclicked = 0;
}
 
function  inscol()
{
    var id = clickedcells[0];
    var tr = document.getElementById(id.t).rows[id.r];
    var c = tr.insertCell(id.c + (id.c == 0?0:1)); 
    c.innerHTML = nonbreakspace;
    c.onclick = function(){userclick(this);}
    if (id.c ==0)
       clickedcells[0].c = 1; 
    closemenu();
}
function  tomenubar()
{
    var id = clickedcells[0];
    closemenu();
    new Tomenu(document.getElementById(id.t));
    
}
 
function  menurow(id)
{
    for (var i=0; i < menutbl.rows.length; i++)
    for(var j=0; j < menutbl.rows[i].cells.length; j++)
    {
        if (menutbl.rows[i].cells[j].id == id)
        {    
            return i;
        }
    }
    return -1;
}
function delmenu(id)
{
    
    for (var i=0; i < menutbl.rows.length; i++)
    for(var j=0; j < menutbl.rows[i].cells.length; j++)
    {
        if (menutbl.rows[i].cells[j].id == id)
        {    
            menutbl.deleteRow(i);
            break;
        }
    }
}
function back2design()
{
    closemenu();
    var mn = Tomenu.objects[this.id.replace(/_.*/,'')].goback();
    document.body.removeChild(this);
    
}
function showmenu()
{       
          savedfile = false;
       //   follower.style.visibility ='hidden';
          if (numclicked == 0) return;
          var id = clickedcells[numclicked-1]; 
          if (id == null || id.t == null) return;
          var tb = document.getElementById(id.t);
          document.getElementById("tblid").value=id.t;
          document.getElementById("classname").value=tb.className;
          var td = document.getElementById(id.t).rows[id.r].cells[id.c];
          
          if (numclicked == 1)
          {
              document.getElementById("cellid").value=td.id;
              document.getElementById("cellclass").value=td.className;
          }
          else
          {
              document.getElementById("cellid").value= '';
              var thesame; 
              for (var j=0; j < numclicked; j++)
              {
                  var id = clickedcells[j]; 
                  var tb = document.getElementById(id.t);
                  var td = document.getElementById(id.t).rows[id.r].cells[id.c];
                  if (j ==0) thesame = td.className;
                  else if (td.className != thesame) break;
              }
              if (j == numclicked)
              document.getElementById("cellclass").value=td.className;    
          }
          var xy = findPositionnoScrolling(td);
          if (Tomenu.objects[id.t] != null)
          { 
             var t = document.createElement("div");
             t.id = id.t + "_backmenu";
             t.style.cssText = "background-color:#EEE;position:absolute;left:" + xy[0] + "px;top:" + (xy[1]) + "px;border:1px #888888 outset";
             t.innerHTML = "Back to design"; 
             t.onclick = back2design;
             document.body.appendChild(t);
             return;
          } 
          if (id == null) return; 
          //savedmx = savedmx==-1? lf:savedmx;
          //savedmy = savedmy==-1? xy[1]:savedmy;
          
          savedmy = savedmy==-1? xy[1]:savedmy;
          cmenu.style.visibility ='visible';
          var lf = (xy[0]+td.offsetWidth - cmenu.offsetWidth);
          if (lf < 0) lf = 0;
          //cmenu.style.left =  "10px";
          //cmenu.style.top =   "10px";
          cmenu.style.zIndex = 21;
          
          if (numclicked >= 2 && clickedcells[numclicked-1].t == clickedcells[numclicked-2].t && 
                  Math.abs(clickedcells[numclicked-2].r-clickedcells[numclicked-1].r) + Math.abs(clickedcells[numclicked-2].c-clickedcells[numclicked-1].c)>1)
          {
              x = newmenu(0, "quicksel", "<nobr>" + strlabel[21] + "</nobr>",2);
                    if (x!=null) x.onclick = quicksel;
              x = newmenu(0, "cutborder", strlabel[35] ,2);
              if (x!=null) x.onclick = goaheadcut;
          }
          else  
          {
              delmenu("cutborder");
          }
          
          if (numclicked == 1)
          {
                 delmenu("quicksel"); 
                 var jj = menurow("tableborder");
                   
                  x = newmenu(jj, "copytable",strlabel[17],2);
                  if (x!=null) x.onclick = copytable;
                  
                  x = newmenu(jj, "deletetable",strlabel[18],2);
                  if (x!=null) x.onclick = deletetable;
                  
                 
                  
                  var jj = menurow("tableborder");
              
                  
                  x = newmenu(jj+5, "minsertcell",strlabel[22] + ((id.c==0)?'&larr;':'&rarr;'),2);
                  if (x!=null) x.onclick = inscol;
                  
                   x =  newmenu(jj+5, "mdelcol",strlabel[23],2);
                  if (x!=null) x.onclick = delcol;
                  
                 
                  x = newmenu(jj+5, "minsertrow",strlabel[24] + ((id.r==0)?'&uarr;':'&darr;'),2);
                  if (x!=null) x.onclick = insrow; 
                  x = newmenu(jj+5, "mdelrow",strlabel[34],2);
                   if (x!=null) x.onclick = delrow;
                  
                  x = newmenu(jj+5, "inserttable",strlabel[16], 2);
                  if (x!=null) x.onclick = function(){opendialog('');}
                  
                  x = newmenu(jj+5, "insertdiv",strlabel[26], 2);
                  if (x!=null) x.onclick =  function(){makeadiv('');}
                  
                  if (copiedtable!='')
                  {  
                       x = newmenu(jj+5, "pastetable",strlabel[27],2);
                       if (x!=null) x.onclick = pastetable;
                  }
                   
               if (typeof(LaTexHTML) !=' undefined')
              {
                 LaTexHTML.deformat(td);
              }   
              document.getElementById("entertxt").value = td.innerHTML;
              if (typeof(LaTexHTML) !=' undefined')
             {
                 LaTexHTML.formatele(td);
             }
              
              document.getElementById("widthtxt").value = td.width;
               
          }
          else
          {
              delmenu("inserttable");
              delmenu("copytable");
              delmenu("deletetable");
              delmenu("mdelrow");
              delmenu("minsertrow");
              delmenu("mdelcol");
              delmenu("minsertcell");
              document.getElementById("entertxt").value = '';
              document.getElementById("widthtxt").value = '';
              document.getElementById("url").value = '';
          }    
          
          var tb = document.getElementById(id.t);
          document.getElementById("tburl").value = bgurl(tb);
          
          
          for (var i=0; i < menutbl.rows.length; i++)
          {
              for (var j =0; j < menutbl.rows[i].cells.length; j++)
              if (menutbl.rows[i].cells[j].onclick!=null  )
              {
                  if (  menutbl.rows[i].cells[j].innerHTML!=strlabel[33])
                      menutbl.rows[i].cells[j].style.color ='blue';
                  menutbl.rows[i].cells[j].style.border ='1px #afafaf outset';
              } 
              else if (menutbl.rows[i].cells[j].innerHTML ==nonbreakspace)
              {
                  menutbl.rows[i].cells[j].style.textDecoration ='underline';
                  menutbl.rows[i].cells[j].style.color ='blue';
              }    
          }
 
}


function bgurl(td)
{
   
  if (td.style.background==null || td.style.background =='none' ||  td.style.backgroundImage=='' 
   || td.style.backgroundImage==null || td.style.backgroundImage.toLowerCase()=='none') 
       return '';
  var x = td.style.backgroundImage.replace(/.*url\(/, '');
  x = x.replace(/\).*/, '').replace(/"/,'').replace(/'/,'');
   
  return x  + ' ' + td.style.backgroundRepeat;  
}
function bigg(t)
 {
    // t.size = 20;
 }
function goaheadcut()
{
//follower.style.visibility = 'hidden';
var id = clickedcells[numclicked-2]; 
var thetbl = document.getElementById(id.t); 
var startcell  = thetbl.rows[id.r].cells[id.c];
 
var xy = findPositionnoScrolling(startcell);
var sx = xy[0];
var sy = xy[1];
id = clickedcells[numclicked-1]; 
var endcell = thetbl.rows[id.r].cells[id.c];
if (startcell == endcell) return;
xy = findPositionnoScrolling(endcell);

 

var ex = xy[0] ;
var ey = xy[1] ;

var maxx,maxy, minx, miny;

if (sx <= ex && sy <=ey)
{
    minx = sx; 
    miny = sy;
    maxx = ex + endcell.offsetWidth;
    maxy = ey + endcell.offsetHeight;
}
else if (sx <= ex && sy >=ey)
{
    minx = sx; 
    miny = ey;
    maxx = ex + endcell.offsetWidth;
    maxy = sy + startcell.offsetHeight;
}
else if (sx >= ex && sy <=ey)
{
    minx = ex; 
    miny = sy;
    maxx = sx + startcell.offsetWidth;
    maxy = ey + endcell.offsetHeight;
}
else if (sx >= ex && sy >=ey)
{
    minx = ex; 
    miny = ey;
    maxx = sx + startcell.offsetWidth;
    maxy = sy + startcell.offsetHeight;
}
 
var done =false;
var sumrowspan = 0;
var sumcolspan = 0;
var width = 0;
var height = 0;
var savedtext = '';
var heights = [];
var cell0; 
var background=null;
for(var i=thetbl.rows.length-1; i >=0; i--)
{
      for (var j=thetbl.rows[i].cells.length-1;  j>=0; j--)
      {
          var td = thetbl.rows[i].cells[j];
          xy = findPositionnoScrolling(td);
          var x = xy[0];
          var y = xy[1];
          if (x >= minx && y >=miny && x < maxx && y < maxy )
          {
              savedtext = thetbl.rows[i].cells[j].innerHTML.replace(/ /g, '').replace(/&nbsp;/g, '') +   savedtext;
              if (y == miny){
              if (typeof(td.width) != 'undefined' && td.width != null )
                  width += parseInt(td.width); 
              else
                  width = 0;
              if (typeof(td.colSpan) == 'undefined' || td.colSpan == null)
                  sumcolspan ++;
              else
                  sumcolspan += parseInt(td.colSpan);
              }
              if (x == minx) {
              if (typeof(thetbl.rows[i].height) != 'undefined' &&  thetbl.rows[i].height != null)
                  heights[i] =  thetbl.rows[i].height;
               
              if (typeof(td.rowSpan) == 'undefined' || td.rowSpan == null)
                   sumrowspan++;
              else
                   sumrowspan += parseInt(td.rowSpan);
              }
              
              if(Math.abs(x-minx) + Math.abs(y-miny) > 0) 
              {
                  var xx = document.getElementById("m_"+  thetbl.id + "_" + i + "_" + j);
                  if (xx!=null) document.body.removeChild(xx);
                  thetbl.rows[i].deleteCell(j);
                  
              } 
              else 
              {
                  cell0 = td;
                   
              }
          }
      }
      
  }
if (savedtext=='') savedtext = nonbreakspace;
cell0.innerHTML = savedtext;
cell0.colSpan = sumcolspan;
cell0.rowSpan = sumrowspan;
if (width > 0)
{
    cell0.width = width;
}
//setbg(cell0, background); 


menutbl.deleteRow(0);
changedbg = true;
closemenu();
var xx = clickedcells[numclicked-2];
if (xx!=null){
var y = document.getElementById("m_"+  xx.t + "_" + xx.r + "_" + xx.c);
if (y!=null) document.body.removeChild(y);
}
numclicked = 0;
//follower.style.visibility = 'hidden';
}
function quicksel()
{

var cancut = (numclicked >= 2);
var id = clickedcells[numclicked-2]; 
var thetbl = document.getElementById(id.t); 
var startcell  = thetbl.rows[id.r].cells[id.c];
 
var xy = findPositionnoScrolling(startcell);
var sx = xy[0];
var sy = xy[1];
var jd = clickedcells[numclicked-1]; 
var endcell = thetbl.rows[jd.r].cells[jd.c];
if (startcell == endcell) return;
xy = findPositionnoScrolling(endcell);

 

var ex = xy[0] ;
var ey = xy[1] ;

var maxx,maxy, minx, miny;

if (sx <= ex && sy <=ey)
{
    minx = sx; 
    miny = sy;
    maxx = ex + endcell.offsetWidth;
    maxy = ey + endcell.offsetHeight;
}
else if (sx <= ex && sy >=ey)
{
    minx = sx; 
    miny = ey;
    maxx = ex + endcell.offsetWidth;
    maxy = sy + startcell.offsetHeight;
}
else if (sx >= ex && sy <=ey)
{
    minx = ex; 
    miny = sy;
    maxx = sx + startcell.offsetWidth;
    maxy = ey + endcell.offsetHeight;
}
else if (sx >= ex && sy >=ey)
{
    minx = ex; 
    miny = ey;
    maxx = sx + startcell.offsetWidth;
    maxy = sy + startcell.offsetHeight;
}
 
var done =false;
var sumrowspan = 0;
var sumcolspan = 0;
var width = 0;
var height = 0;
var savedtext = '';
var heights = [];

for(var i=thetbl.rows.length-1; i >=0; i--)
{
      for (var j=thetbl.rows[i].cells.length-1;  j>=0; j--)
      {
          var td = thetbl.rows[i].cells[j];
          xy = findPositionnoScrolling(td);
          var x = xy[0];
          var y = xy[1];
          if (x >= minx && y >=miny && x < maxx && y < maxy && Math.abs(i-id.r)+Math.abs(j-id.c)>0 &&   Math.abs(i-jd.r)+Math.abs(j-jd.c)>0)
          {
               mark(id.t, i, j);
          }
      }
 }
  //
  //follower.style.visibility = 'hidden';
  showmenu();
  delmenu("quicksel");
}

function setbg(td, bg)
{
   if (td==null || bg==null) return;
   td.style.backgroundImage = bg.i;
   td.style.backgroundRepeat = bg.r;
   td.style.backgroundColor = bg.c;
}

function bigger(txt)
{
      txt.rows=6;
      
}
function undoshow(b)
{
   if (b==null) b = true;
   var undobtn = document.getElementById("undobtn");
  // if (undobtn!=null)   undobtn.style.visibility = b?'visible':'hidden'; 
}
function undo()
{
    if (1==1) return;
   if (mode == 'format') 
   {
       for (var i=0; i < oldnumclicked; i++)
       {
            var id = clickedcells[i];
            if (id == null) continue;
            var c = document.getElementById(id.t).rows[id.r].cells[id.c];
            if (savedtxt[id]!=null)
            c.innerHTML  = savedtxt[id];
       }
   }
   else
   {
        id = clickedcells[0];
        c = document.getElementById(id.t).rows[id.r].cells[id.c];
       // document.getElementById('editctrl').value = c.innerHTML; 
   }
   undoshow(false);
}
 
 

function findPositionnoScrolling( oElement, win)
{
 if (win==null) win = self;
 if (oElement==null) return [0,0];
 if( typeof( oElement.offsetParent ) != 'undefined')
 {
 var ii = 0;
 var originalElement = oElement;
 for( var  posY = 0,posX=0; ii++<10 && oElement!=null; oElement = oElement.offsetParent )
 {
 posY += oElement.offsetTop;
 posX += oElement.offsetLeft;
 if( oElement != originalElement && oElement != win.document.body && oElement != win.document.documentElement )
 {
 posY -= oElement.scrollTop;
 posX -= oElement.scrollLeft;
 }
 }
 return  [posX, posY];
 }
 else
 {
 return  [oElement.x, oElement.y];
 }
}
 
function createCSSClass(selector, style) {
    if (!document.styleSheets) {
        return;
    }

    if (document.getElementsByTagName("head").length == 0) {
        return;
    }

    var stylesheet;
    var mediaType;
    if (document.styleSheets.length > 0) {
        for (i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].disabled) {
                continue;
            }
            var media = document.styleSheets[i].media;
            mediaType = typeof media;

            if (mediaType == "string") {
                if (media == "" || (media.indexOf("screen") != -1)) {
                    styleSheet = document.styleSheets[i];
                }
            } else if (mediaType == "object") {
                if (media.mediaText == "" || (media.mediaText.indexOf("screen") != -1)) {
                    styleSheet = document.styleSheets[i];
                }
            }

            if (typeof styleSheet != "undefined") {
                break;
            }
        }
    }

    if (typeof styleSheet == "undefined") {
        var styleSheetElement = document.createElement("style");
        styleSheetElement.type = "text/css";

        document.getElementsByTagName("head")[0].appendChild(styleSheetElement);

        for (i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].disabled) {
                continue;
            }
            styleSheet = document.styleSheets[i];
        }

        var media = styleSheet.media;
        mediaType = typeof media;
    }

    if (mediaType == "string") {
        for (i = 0; i < styleSheet.rules.length; i++) {
            if (styleSheet.rules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                styleSheet.rules[i].style.cssText = style;
                return;
            }
        }

        styleSheet.addRule(selector, style);
    } else if (mediaType == "object") {
        for (i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                styleSheet.cssRules[i].style.cssText = style;
                return;
            }
        }

        styleSheet.insertRule(selector + "{" + style + "}", 0);
    }
}
function parseit()
{ 
 
       var s =  $('htmlcodes').value;
        
       var m = (new RegExp(/<style[^>]*>/i)).exec(s);
       if (m!=null)
       {
       var i1 = m.toString().length + m.index;   //start of style
       m = (new RegExp(/<.style>/i)).exec(s.substring(i1)); 
       
       var i2 = m.index + i1;  
        
       var css = s.substring(i1,i2).split(/[ ]*\n[ ]*/);
       var cls = [];
       for (var j=0; j < css.length; j++)
       {
          if (css[j].indexOf('.tdbtn')>=0) continue;
          if (css[j].indexOf("{") < 0) continue;
          var arr = css[j].split(/\{/);
          cls[ parseInt(arr[0].replace(/[^0-9]/g,''))] = arr[1].replace(/\}/,'');
       }
       }
       
       m = (new RegExp(/<body[^>]*>/i)).exec(s);
       if (m!=null)
       {
       i1 = m.toString().length + m.index;  
       
       var anchor = 'Tomenu(document.getElementById("t';
       
       var jj = s.indexOf(anchor);
       var menuscript = '';
       if (jj > 0)
       {
           
           m =  (new RegExp(/<scr.pt[^>]*>/i)).exec(s.substring(i1));
           i2 = m.index + i1;
           menuscript = s.substring(i2);
           s = s.substring(i1, i2);
           i1 = m.toString().length;
           m = (new RegExp(/<.script>/i)).exec(menuscript.substring(i1));
           i2 = m.index + i1;
           menuscript = menuscript.substring(i1, i2);
       }
       else
       {
           i2 = (new RegExp(/<\/body>/i)).exec(s.substring(i1)).index + i1;
           s = s.substring(i1, i2);
       }
        

       var  reg = new RegExp(/class=["]?tlmtlsty[0-9]+["]?/i);
       j = 0;
       var z = '';
       while (true)
       {
           var r = reg.exec(s.substring(j));
           if (r == null)
           {
               z += s.substring(j);
               break;
           }
           var i = r.index;
           var w = r.toString();
           var n = parseInt(w.replace(/[^0-9]/g,''));    
           z += s.substring(j,i+j)    + 'style="' + cls[n] +  '"';
           j = i+j + w.length;
       }
        
       if (s != '') 
       {     
          var tbl = document.createElement('div');
          tbl.innerHTML =  z.replace(/<td /ig, '<td onclick="userclick(this)" ') ;
          document.body.appendChild(tbl);
       }
       tableid = counttablen(tbl);
       }

       if (menuscript!=null && menuscript!='') { eval(menuscript); }
       document.body.removeChild(document.getElementById("savediv"));
}
function parsenot()
{ 
      document.body.removeChild(document.getElementById("savediv"));
}

function counttablen(x, adduserclick)
{
    if (x.childNodes.length == 0) return 0;
    
    var s = 0;
    if (x.id!=null && x.id.length>0 && x.id.replace(/t[0-9]+/,'') =='')
    { 
    if (x.tagName.toLowerCase()=='table' )
    {
         s = 1;
         if (adduserclick){  for (var i=0; i < x.rows.length; i++)
         for (var j=0; j < x.rows[i].cells.length; j++)
         {
             x.rows[i].cells[j].onclick = function(){userclick(this);};
             
         }    
        }
    }   
    else if (x.tagName.toLowerCase()=='div' )
    {
        if (adduserclick)
            x.onclick = function(){userclick1(this);};
    }
    }
    for (var i=0; i < x.childNodes.length; i++)
        s += counttablen(x.childNodes[i],adduserclick);
    return s;
    
}
var gradients = '';
function cssclass(v)
{
    var usedg = '';
    var classnum = 0;
    var classlist = [];
    for (var k=0; k < tableid; k++)
    {
        var tbl = document.getElementById("t"+k);
        if (tbl==null) continue;
        if (tbl.tagName.toLowerCase() == 'table')
        { 
        for (var i=0; i < tbl.rows.length; i++)
        {
            for (var j=0; j < tbl.rows[i].cells.length; j++)
            {
                var td = tbl.rows[i].cells[j];
                var css = td.style.cssText;
                
                if (css==null||css=='')continue;
                for (var l=0; l < classlist.length && classlist[l]!=css; l++);
                if ( l == classlist.length)
                {
                    classlist[l] = css;
                    var m = css.indexOf("image/gradient/t");
                    if (m>0)
                    {  
                        var xx = css.substring(m+16,m+23);
                        usedg +=  "," + xx;
                        gradients = gradients.replace(','+xx,'');
                    } 
                }
                //td.style.cssText = '';
               if (v==null) 
               {
                   if (td.className == null || td.className =='')
                       td.className = "tlmtlsty" + l;
                   else
                       td.style.cssText = css; 
               }
            }
        }
        }
        else
        {
             var div = tbl;
             var css = div.style.cssText;
             if (css==null||css=='')continue;
             for (var l=0; l < classlist.length && classlist[l]!=css; l++);
             if ( l == classlist.length)
             {
                    classlist[l] = css;
                    var m = css.indexOf("image/gradient/t");
                    if (m>0)
                    {  
                        var xx = css.substring(m+16,m+23);
                        usedg +=  "," + xx;
                        gradients = gradients.replace(','+xx,'');
                    } 
             }
             if (v==null) 
             {
                 if (td.className == null || td.className =='')
                     td.className = "tlmtlsty" + l;
                 else
                     td.style.cssText = css; 
             }
        }
    }
    if(gradients!='')
    open("/tealeaman/gradient.jsp?del=" + gradients, tinywinn);
    
    gradients = usedg;
    var stycode = '<style type=text/css>\n';
    for ( l=0; l < classlist.length; l++)
       stycode += ".tlmtlsty" + l + "{" + classlist[l] +"}\n";
    
    stycode += "</style>";
    return stycode;
}
 
function htmlcode(deliver)
{
     
     var js = hasmenu();
     if (mode =='edit')
        editmode(document.getElementById("editmodebtn"));
     var stycode = cssclass();
     
     var maintbl = document.getElementById("t0");
     if (typeof(LaTexHTML) !=' undefined')
     {
         LaTexHTML.deformat(maintbl);
     }
     if (maintbl==null) return '';
     var homeurl = fileopurl.replace(/FileOperation/,'');
     var headstr = '';
     if (document.getElementById('uploadbtn')!=null)
         headstr = document.getElementsByTagName('head')[0].innerHTML.replace(/[<]scr.pt[^>]+>[^<]*<.script>/gi, '');
     else
         headstr = document.getElementsByTagName('head')[0].innerHTML.replace(/[<]scr.pt /gi, '<'+ 'scr' + 'ipt ').replace(/<.script>/ig, '<' + '/scr'+ 'ipt>').replace( /[<]scr.pt[^>]+tabletooledit\.js[^>]*>\s*<.scr.pt>/i, '').replace( /[<]scr.pt[^>]+tabletool\.js[^>]*>\s*<.scr.pt>/i, '').replace( /[<]scr.pt[^>]+pagemenu\.js[^>]*>\s*<.scr.pt>/i, '');
     headstr = headstr.replace(/\n\.tlmtlsty[0-9]{[^}]+}/g,'').replace(/[<]style [^>]*>[\n|\r| ]*<.style>/ig,'').replace(/[\r|\n]+/g, '\n');
     if (headstr.indexOf("http") < 0)  headstr = headstr.replace(/src="/g, 'src="' + homeurl);
     if (deliver==null || deliver == false)
         headstr += "<" + "scr" + "ipt type=\"text/javascript\" src=\"/tealeaman/tabletooledit.js\"><" + "/sc" + "ript>";
     if (headstr.indexOf("link rel") < 0)
     {
         headstr += "<!--link rel=\"styleSheet\" type=\"/text/css\" href=\"someURL.css\"></link-->";
     }
     var str = "<!DOCTYPE html>\n<html>\n<head>" + headstr + stycode + "</head>\n<body>"
     var tohtml = "<table ";
     var x =maintbl.attributes;
     var hasstyle = false;
     for (var i=0; i < x.length; i++)
     {
         if (x[i].value != null && x[i].value != 'null' && x[i].value != '')
         tohtml += x[i].name + "=\"" + x[i].value +"\" ";
         if (x[i].name.toLowerCase() == 'style')hasstyle = true;
     }
     if (hasstyle == false) tohtml += " style=\"" + maintbl.style.cssText + "\" ";
     tohtml += ">\n" + maintbl.innerHTML.replace(/<tbody>/g,'').replace(/<.tbody>/g,'') + "\n</table>";
     str +=  tohtml.replace(/ onclick=["]?userclick.this.["]? /ig, ' ')/*.replace(/style="[^"]+"/ig, '')*/.replace(/<tr /ig, '\n<tr ').replace(/<.tr>/, '\n</tr>').replace(/<td /ig, '\n<td ')  +   js +"</body>\n</html>";
     if (typeof(LaTexHTML) !=' undefined')
     {
         LaTexHTML.formatele(maintbl);
     }
     return str;
}
var oldx, oldy;
function codes()
{
   
    var forwebfm = '';
    var forwebins = '';
    var forwebform =  convertpage();
    //if (forwebform!=null && document.getElementById('uploadbtn')==null) makeuploadbtn();
    if (forwebform==null && document.getElementById('uploadbtn')!=null) document.body.removeChild(document.getElementById('uploadbtn'));
    if (forwebform!=null)
    {
        forwebfm = '<input name=send1 type=button style="width:68px;background-color:#009900;color:white;font-weight:700" value="' + strlabel[38] + '" onclick=uploadit(true)>';
        forwebins = ". " + strlabel[9];
    }   
    else
    {
        forwebfm = '<input name=deliver type=checkbox style="background-color:transparent"  onclick=deliverit(this)>' + strlabel[10];
    }
        
    var maintbl = document.getElementById("t0");
    var t = document.createElement("div");
    t.id = "savediv";
    t.style.cssText = "position:absolute;left:8px;top:36px;border:2px #909090 outset;background-color:#ddd";

    if (maintbl!=null)
    {
       var s = "<table cellspacing=0 cellpadding=0 border=1><tr><td width=20 style=\"width:22px;border-radius:11px;background:url(image/icon/smalls00.png) #b0b0b0  no-repeat;overflow:display\" onclick=closeit()></td>"
           +"<td colspan=2 id=tcodes>" + strlabel[11] + " " +  forwebins +"</td></tr>"
           + "<tr><td colspan=3><textarea id=htmlcodes rows=20 cols=70></textarea></td></tr>"
           + "<tr><td width=20></td><td align=center>" + forwebfm  +"</td>"
           + "<td width=20 style=cursor:se-resize><!-- --></td></tr></table>";
       
    }
    else
    {
       if (forwebform!=null)
           forwebins = " <br>or just click the Upload button to see the conversion";
       else forwebfm ='';
       s = "<table  cellspacing=0 cellpadding=0><tr><td width=20  style=\"width:22px;border-radius:11px;background:url(image/icon/smalls00.png) #b0b0b0  no-repeat;overflow:display\"  background=\"image/icon/smalls00.png\" onclick=parsenot()></td>"
           +"<td colspan=2 id=tcodes>" + strlabel[11] + " " +  forwebins +"</td></tr>"
           + "<tr><td colspan=3><textarea id=htmlcodes rows=20 cols=70></textarea></td></tr>"
           + "<tr><td width=20></td><td align=center>" + forwebfm  +"<input type=button onclick=parseit() class=tdbtns value=\"" + strlabel[12] + "\" style=width:68></td>"
           + "<td width=20 style=cursor:se-resize><!-- --></td></tr></table>";
    }
    t.innerHTML = s;
    document.body.appendChild(t);
    t.getElementsByTagName("table")[0].rows[0].cells[0].style.width = '20px';
    t.getElementsByTagName("table")[0].rows[2].cells[0].style.width = '20px';
    t.getElementsByTagName("table")[0].rows[2].cells[2].style.width = '20px';
    if (maintbl!=null)
    {
       var todeliveer = (forwebform!=null);
       var xx = htmlcode(todeliveer);
       $('htmlcodes').value = xx;
    }
    Drag.init(document.getElementById('tcodes'),t);
    var dv = t.getElementsByTagName("table")[0].rows[2].cells[2];
    Drag.init(dv);
    dv.onDragStart = function(x,y){oldx = x; oldy=y;}
    dv.onDragEnd = function(x,y)
    {

        var t = gettable(dv).parentNode;
        t.style.width = (t.offsetWidth + (x-oldx)) + 'px';
        t.style.height = (t.offsetHeight + (y-oldy)) + 'px';
        var tt = t.getElementsByTagName("table")[0].rows[1].cells[0].getElementsByTagName("textarea")[0];
        tt.style.width = (tt.offsetWidth + (x-oldx-1)) + 'px';
        tt.style.height = (tt.offsetHeight + (y-oldy-1)) + 'px';
    }
}

function deliverit(c)
{
    if (c.checked)
    {
        document.getElementById('htmlcodes').value = document.getElementById('htmlcodes').value.replace( /<scr.pt[^>]+tabletool\.js[^>]*>\s*<.scr.pt>/i, '');
    }
    else
    {
        var homeurl = fileopurl.replace(/FileOperation/,'');
        if (homeurl=='/') homeurl ='';
        document.getElementById('htmlcodes').value = document.getElementById('htmlcodes').value.replace( /<.head>/i, '<scri'+ 'pt src="' + homeurl + 'tabletool.js"></scri'+ 'pt></head>');
    }
}
function quitmake()
{
     
    var div  = document.getElementById("dialog");
    if (div.innerHTML.indexOf("redesign") > 0)
        codes();
    div.style.visibility = "hidden";
     
}

function closeit()
{
    document.body.removeChild(document.getElementById("savediv"));
}
var setcsslog =  new Array();
function moreccs(td)
{ 
       notround();
       notmake();
       if (document.getElementById("morecssf") !=null) return;
       var xy = findPositionnoScrolling(cmenu);  //xy[0] += td.offsetWidth+5; 
       var t = document.createElement("div");
       t.id = "morecssf";
      
       t.style.cssText = "background-color:#EEE;position:absolute;left:" + xy[0] + "px;top:" + (xy[1]+350) + "px;border:2px #888888 outset;z-index:23";
       t.innerHTML = "<form rel=opener name=fc style=\"margin:0px 0px 0px 0px\" method=post  ><table><tr><td colspan=2 bgcolor=" + fortblcolor + " align=center id=csshead>" + strlabel[31] + " CSS</td></tr>"
           + "<tr><td>margin</td><td><input name=margin value=\"0px 0px 0px 0px\"  size=12></td></tr>" 
           + "<tr><td>padding</td><td><input name=padding value=\"0px 0px 0px 0px\" size=12></td></tr>" 
           + "<tr><td>border</td><td><input name=border value=\"1px #b0b0b0 solid\" size=12></td></tr>" 
           + "<tr><td>font-style</td><td><input name=fontStyle value=\"normal\"  size=12></td></tr>" 
           + "<tr><td>font-weight</td><td><input name=fontWeight value=\"500\" size=12></td></tr>" 
           + "<tr><td>text-shadow</td><td><input name=textShadow value=\"#707070 1px 1px\" size=12></td></tr>" 
           + "<tr><td>cursor</td><td><input name=cursor value=\"pointer\"  size=12></td></tr>"
           + "<tr><td>corner-radius</td><td><input name=radius value=\"5px\"  size=12></td></tr>"
           + "<tr><td colspan=2 align=center><input type=button style=\"width:65px;color:blue;cursor:pointer;border:1px black solid\" name=submset value=\"" + strlabel[4] + "\" onclick=setcss(this,'c')><input type=button style=\"width:65px;color:blue;cursor:pointer;border:1px black solid\" name=submset value=\"" + strlabel[56] + "\" onclick=setcss(this,'t')>"
           +" <input  style=\"width:65px;color:blue;cursor:pointer;border:1px black solid\"  type=button name=cancel value=\"" + strlabel[37] + "\" onclick=\"notset()\"></td></tr></table></form>"; 
       document.body.appendChild(t);
       var f = document.fc;
    
       for (var i=0; i < f.elements.length-2; i++)
       {
          setcsslog[f.elements[i].name] = 0;
          f.elements[i].onblur = function(){logthis(this);};
       }
       if (numclicked == 1)
       {
           var id = clickedcells[0];
           var tb = document.getElementById(id.t);
           td = tb.rows[id.r].cells[id.c];
           var ww = tb.cellPadding;
           if (ww == '') ww = '0';
           f.margin.value = ((td.style.marginTop)?td.style.marginTop:'0px')  + " " +  ((td.style.marginRight)?td.style.marginRight:'0px')
               + " " + (td.style.marginBottom? td.style.marginBottom :'0px') + " " +  (td.style.marginLeft?td.style.marginLeft:'0px');
           f.padding.value =  (td.style.paddingTop?td.style.paddingTop: (ww + 'px'))
                      + " " +  (td.style.paddingRight? td.style.paddingRight: (ww + 'px'))
                      + " " +  (td.style.paddingBottom? td.style.paddingBottom : (ww + 'px'))
                      + " " +  (td.style.paddingLeft?td.style.paddingLeft:(ww + 'px'));
           f.border.value = td.style.border? td.style.border:'0px black solid';
           f.fontStyle.value =  td.style.fontStyle?td.style.fontStyle:'normal';
           f.fontWeight.value = td.style.fontWeight? td.style.fontWeight:'500';
           f.textShadow.value =  td.style.textShadow?td.style.textShadow:'#707070 1px 1px';
           f.cursor.value = td.style.cursor? td.style.cursor:'pointer';
       }
       Drag.init(document.getElementById('csshead'), t);
       
        t.style.top = (xy[1] + cmenu.offsetHeight -  t.offsetHeight) + 'px'
}

function logthis(tx)
{
   setcsslog[tx.name] = 1;
}

function setStyle(x, s)
{
    if (x.style.background!=null && x.style.background!='')
        s += ';background:' + x.style.background  ;
     if (x.style.fontSize!=null && x.style.fontSize!='')
        s += ';font-size:' + x.style.fontSize;
     if (x.style.color!=null && x.style.color!='')
        s += ';color:' + x.style.color;
     if (x.style.backgroundColor!=null && x.style.backgroundColor!='')
        s += ';backgroundColor:' + x.style.backgroundColor;
     x.style.cssText = s;
    
}
function setcss(btn,c)
{
    var f = document.fc;
    var s = '';
    for (var i=0; i < f.elements.length-3; i++)
    {
        if (setcsslog[f.elements[i].name] == 1)
        s +=  ";" + f.elements[i].name.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase() + ":" + f.elements[i].value  ;
    }
    s = s.substring(1);
    if (setcsslog[f.radius.name] == 1) 
    {
        s += ";-webkit-border-radius:" + f.radius.value 
           + ";-moz-border-radius:" + f.radius.value 
           + ";corner-radius:" + f.radius.value  ; 
    } 

    if (s!='')
    {
        if (c == 'c')
        {
            for (i=0; i < numclicked; i++)
            {
                var id = clickedcells[i];
                var td = document.getElementById(id.t).rows[id.r].cells[id.c];
                setStyle(td, s);
            }
        }
        else
        {
              for (i=0; i < numclicked; i++)
            {
                var id = clickedcells[i];
                var td = document.getElementById(id.t);
                setStyle(td, s);
            }
            
        }
}
    notset();
    closemenu();
}
function notset()
{
    var x = document.getElementById("morecssf");
    if (x!=null) document.body.removeChild(x);
}
var nowwt = 6;
var newcolor = 'red';
function showround(td)
{ 
       notset();
       notmake();
       if (document.getElementById("rounder") !=null) return;
       var xy = findPositionnoScrolling(td);xy[0] += cmenu.offsetWidth+3; 
       var t = document.createElement("div");
       t.id = "rounder";
       //var cls = ['#342389','#BBBB00','black','blue','green','orange','pink','purple','red'];
       var thicks = [6, 7, 8, 9, 10, 11, 12, 13];
       t.style.cssText = "background-color:#EEE;position:absolute;left:" + xy[0] + "px;top:" + (xy[1]-150) + "px;border:2px #888888 outset";
       var s  = "<table border=1><tr><td colspan=5 id=roundc align=center>Round Corner</td></tr>"
       for (var i=0; i < 8; i++)
       {
           if (i==0)  s += "<tr><td>Color</td>";else if (i==4) s +="</tr><tr><td></td>";
           s += "<td bgcolor=" + mycolors[i] +" width=10 onclick=pickrcolor(this)>&nbsp;</td>";
       }
       for (i=0; i < 8; i++)
       {
           if (i==0)  s += "</tr><tr><td>Thick</td>";else if (i==4) s +="</tr><tr><td></td>";
           s += "<td   width=10 onclick=pickthick(this) align=center>" + thicks[i] +"px</td>";
       }
       s += "</tr><tr><td colspan=5 align=center><input  style=width:65  type=button name=cancel value=\"Round\" onclick=\"setroundc()\"><input  style=width:65  type=button name=cancel value=\"Close\" onclick=\"notround()\"></td></tr></table>"; 
       t.innerHTML = s;
       document.body.appendChild(t);
       Drag.init(document.getElementById('roundc'), t);
}
function notround()
{
    var x = document.getElementById("rounder");
    if (x!=null) document.body.removeChild(x);
    oldnumclicked = 0;
}
function pickrcolor(td)
{
    nowcolor = td.bgColor;
   // setroundc(nowcolor,nowwt);
}

function pickthick(td)
{
   nowwt = parseInt(td.innerHTML); 
  // setroundc(nowcolor,nowwt);
}

function setroundc(wt)
{ 

   for (var i=0; i <  numclicked; i++)
   {
        var id = clickedcells[i];
        var tb = document.getElementById(id.t);
        if (tb!=null)
        {
           var c = tb.rows[id.r].cells[id.c];
          
        }

        id = clickedcells[i];
        tb = document.getElementById(id.t);
        c = tb.rows[id.r].cells[id.c];
        var t = c.innerHTML;
        if (t.indexOf())
        var div = document.createElement("div");
        div.style.cssText = "background-color:" + c.style.backgroundColor +";border-radius:" + wt +"px;-moz-border-radius:" + wt +"px";
        c.style.backgroundColor = tb.style.backgroundColor? tb.style.backgroundColor: "white";
        c.innerHTML = '';
        var t1 = t.replace(/<div[^>]+\-moz\-border\-radius:[^>]+>/i,'');
        if (t1!=t) t = t1.replace(/<.div>$/i,'');
        div.innerHTML = t;
        c.appendChild(div);
        changedbg = true;
   }
   notround(); 
}

function showinputs(td)
{ 
       notset();
       notround();
       if (document.getElementById("gradient") !=null) return;
       var xy = findPositionnoScrolling(cmenu); 
       var t = document.createElement("div");
       
       t.id = "gradient";
       var sc = "yellow";
       var ec = "orange";
       var ot = "V";
        var id = clickedcells[0];
        if (id != null)
        {
            
            var c = document.getElementById(id.t).rows[id.r].cells[id.c];
            var xx  = c.style.cssText;
            
            var jj = -1, k,m;
            if (xx!= null && ( (jj = xx.indexOf("gradient")) >0 ))
            {
                k = xx.indexOf("(", jj);
                m = xx.indexOf(")", jj);
                var y = xx.substring(k+1, m).split(/[ ]*,[ ]*/);
                if (y.length == 3)
                {   
                    ot = "H";
                    sc = y[1];
                    ec = y[2];
                } 
                else
                {
                    sc = y[0];
                    ec = y[1];
                }
            }
        }
       
       
       t.style.cssText = "background-color:#EEE;position:absolute;width:" + (cmenu.offsetWidth) + "px;left:" + xy[0] + "px;top:" + (xy[1]+300 ) + "px;border:2px #888888 outset;z-index:23";
       t.innerHTML =    "<form rel=opener name=gf style=\"margin:0px 0px 0px 0px\" method=post   ><table><tr><td colspan=2 id=gradmake align=center bgcolor=" + fortblcolor + " >" + strlabel[28] + "</td></tr>"
           + "<tr><td><nobr>" + strlabel[39] + "<nobr></td><td><input name=startc value=\"" + sc + "\" size=6></td></tr>" 
           + "<tr><td><nobr>" + strlabel[40] + "<nobr></td><td><input name=endc value=\"" + ec + "\" size=6></td></tr>" 
           
           + "<tr><td><nobr>" + strlabel[41] + "<nobr></td><td><input name=orient value=H  " + (ot=='H'?'checked':'') + "  type=radio>" + strlabel[42] + "<input name=orient value=V type=radio  " + (ot=='V'?'checked':'') + " >" + strlabel[43] + "</td></tr>"
           + "<tr><td colspan=2 align=center><input type=button style=\"width:65;color:blue;cursor:pointer;border:1px black solid\" name=submist value=\"" + strlabel[4] + "\" onclick=\"setgradient('c')\"> <input type=button style=\"width:65;color:blue;cursor:pointer;border:1px black solid\" name=submist value=\"" + strlabel[56] + "\" onclick=\"setgradient('t')\"><input  style=\"width:65;color:blue;cursor:pointer;border:1px black solid\"  type=button name=cancel value=\"" + strlabel[37] + "\" onclick=\"notmake()\"></td></tr></table></form>"; 
       document.body.appendChild(t);
       Drag.init(document.getElementById('gradmake'), t);
       t.style.top = (xy[1] + cmenu.offsetHeight - t.offsetHeight) + 'px';
}
function notmake()
{
    var x = document.getElementById("gradient");
    if (x!=null) document.body.removeChild(x);
}
function deliver(urlv,rp,endc,t)
{
   for ( var  i=0; i < numclicked; i++)
   {
        var id = clickedcells[i];
        var c = document.getElementById(id.t).rows[id.r].cells[id.c];
        c.style.background  = endc + " url(" + urlv +") " + rp;
        if (numclicked == 1)
            document.getElementById("url").value = urlv + ' ' + rp;
   }
   changedbg = true;
   document.body.removeChild(document.getElementById("gradient"));
   gradients += "," + t;
}
function editmode(btn)
{
   if ($('t0') == null) opendialog('')
   savedfile=false;
   if (mode == 'format') 
   {
       mode = 'edit';
       if (btn!=null) btn.innerHTML= strlabel[13];
       var t = document.createElement("input");
       t.id = "passf";
       t.style.cssText = "width:1px;height:1px;background-color:white;border:0px";
       t.value = '<!-- -->';
       t.onfocus = function()
       {
           passfc();
       }
       
       document.body.insertBefore(t,document.getElementById("t0").nextSibling);
       var td = null;
       if (numclicked>0)
       {
           var id = clickedcells[numclicked-1];
           td = document.getElementById(id.t).rows[id.r].cells[id.c];
       }
       closemenu();
       clickedcells[0] = null;
       if (td!=null) userclick(td);
   }
   else
   {
      t = document.getElementById("passf");
      if (btn!=null) btn.innerHTML= strlabel[14];
      document.body.removeChild(t);
      mode = 'format'
      if (btn!=null) btn.insertHTML = 'EditText';
      getvalue();
   }
}


function betterplace()
{
    var tb = document.getElementById("t0");
    var xy = findPositionnoScrolling(tb);
    cmenu.style.left = (xy[0] + t0.offsetWidth ) + 'px' 
    cmenu.style.top = (xy[1]  ) + 'px';
}

function hasmenu()
{
    var s = '';
    for (var i=0; i < tableid; i++)
    if (Tomenu.objects['t'+i] != null)
    {
        Tomenu.objects['t'+i].goback();
        s += 'new Tomenu(document.getElementById("t' + i +  '"));\n';
    }
    if (s!='')
        s =  '<scri'+ 'pt type=text/javascript>\n' + s + '</scri'+ 'pt>\n';
     return s;
}


var savehandler = null;
function notsaved()
{
    $('savefilebtn').style.color='red';
    
}
function saveit()
{
    if (cansave)
    {
        var fn = filename + (filename.indexOf(".")<0?'.html':'');
        var ct = ($('savediv')==null)? htmlcode(): $('htmlcodes').value;
        if (opener!=null && typeof(opener.helpsave)!='undefined')
            opener.helpsave(window,fn, ct);
    }
    else
    {
        codes();
        
    }
    savedfile = true;
}

function uploadit(viewfirst)
{
    if (makingform)
    {
        var tbl = document.getElementById('t0');
        tbl.border = "0";
    }
    var forwebform = convertpage();
    if (forwebform!=null)
    {
        var f = document.ff;
        if (viewfirst)
            f.destination.value =  document.getElementById('htmlcodes').value;
        else
            f.destination.value = htmlcode(true);
        f.destination.value = f.destination.value.replace(/<scr.pt[^<]*<.script>/ig,'');
     
        f.filedir.value = filename;
        f.target = forwebform; 
        if (f.action == 'wordform.jsp')
            f.action =  "wordform.jsp?1";
        else f.action = 'wordform.jsp';
       visual(f);
       f.submit();
    }
    if (makingform )
    {
        var tbl = document.getElementById('t0');
        tbl.border = "1";
    }
}
function renull(fn,len,furl,ltime)
{
    clearTimeout(savehandler);
    var cl = $('savefilebtn').style.backgroundColor;
    $('savefilebtn').style.backgroundColor = "green";
    setTimeout("$('savefilebtn').style.backgroundColor='" + cl + "';",1500);
    savedfile = true;
} 
var onloadbeforettjs = null;
if (typeof window.onload == 'function')
    onloadbeforettjs = window.onload;
window.onload = function()
{
   initfilename();  
   maketopbtns();    
   initializeContextManu();  
   makedialog();   
   if (fileopurl.indexOf("FileOperation") < 0) 
       fileopurl += "/FileOperation";
   if ( $('t0') !=null)
   {    
       tableid = counttablen(document.body,true);
       document.getElementById("editmodebtn").disabled = false;
      // document.getElementById("undobtn").disabled = false;
   }
   else
   {    
       opendialog(strlabel[20]);
       document.getElementById("editmodebtn").disabled = true;
      // document.getElementById("undobtn").disabled = true;
   }
     
   if (parent!=self && parent.parent!=parent && typeof(parent.parent.frames[0].Anchor)!='undefined')
     new parent.parent.frames[0].Anchor(self);
   if (onloadbeforettjs!=null)
       onloadbeforettjs();
    
}
var oldonclose14 = window.onunload;
  
onunload = function()
{
   if (oldonclose14!=null)
       oldonclose14();
   cssclass(1); 
   if (convertpage() == null && savedfile==false)   
   {
       saveit();
   }
}

function setgradient(c)
{
  var sc = document.gf.startc.value;
  var ec = document.gf.endc.value;
  var ot =   document.gf.orient.value;
  var str = "background: -webkit-linear-gradient(" +  (ot=='H'?'left,':'')  + sc + "," + ec + ");"  
  + "background: -o-linear-gradient(" + (ot=='H'?'right,':'') + sc + "," + ec + ");" 
  + "background: -moz-linear-gradient(" + (ot=='H'?'right,':'') + sc + "," + ec + ");" 
  + "background: linear-gradient(" + (ot=='H'?'to right,':'') + sc + "," + ec + ");"
 if (c == 'c')
 {
    for (var i=0; i < numclicked; i++)
   {
        var id = clickedcells[i];
        var c = document.getElementById(id.t).rows[id.r].cells[id.c];
        var x = c.style.cssText.replace(/background:[^;]+[;|$]/gi, '');
      
        c.style.cssText = str + x; 
   }
   changedbg = true;
 }
 else
 {
      for (var i=0; i < numclicked; i++)
   {
        var id = clickedcells[i];
        var c = document.getElementById(id.t);
        var x = c.style.cssText.replace(/background:[^;]+[;|$]/gi, '');
        c.style.cssText = str + x; 
   }
   changedbg = true;
 }
}

function clearchecks()
{
    for (var i=0; i < numclicked; i++)
   {
        var id = clickedcells[i];
        var c = document.getElementById(id.t).rows[id.r].cells[id.c];
        deleteacheck(id);
   }
   numclicked = 0;
}


 
