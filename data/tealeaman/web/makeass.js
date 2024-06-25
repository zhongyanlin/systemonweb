/**************************************************************************
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
//Name(0),Start(1),Due(2),Format(3),Type(4),Sessions(5),Grader(6),Status(7),Question(8)
//,Answer(9),course(10),Semester(11),Scale(12),Weight(13),Options(14),coursetitle(15)
//,timeformat(16),Assessment(17),Attach(18),LatePermits£¨19£©,timesplit£¨20£© 


 
//document.body.style.marginBottom = '-4px';
//captions[4] = textmsg[798].split
ctype[12] =ctype[13] = 'n'; fsize[12] = fsize[13] = '4';  ffsize[12] = ffsize[13] = '1';
fsize[0] = fsize[1] = fsize[2] = '12';
labels[13]+="%";
NUMROWS = 1;
datapresentformat = 'DataForm';
var timenow = (new Date()).getTime()-100000; 
writenow( "<center>");
var numIframes = 0;
var colspan = 2;
defaultRecord[8] = '';
theight = screen.height-10;
var buttons = "";
var rsstr = "";
var hides = '';
var isnewrecord = (mat== null||mat[0]== null|| mat[0][0]== null||mat[0][0]=='');
let key0 = (orgnum%65536) + "-" + defaultRecord[11] + "-" + defaultRecord[10] + "-" +  defaultRecord[5] + "-";
if (!isnewrecord)
    key0 = (orgnum%65536) + "-" + mat[0][11]+ "-" +  mat[0][10] + "-" +  mat[0][5] + "-" + mat[0][0];
let leftwindow = null;
if (parent!=window && typeof (parent.frames.length>1) && parent.frames[1]==window)
{
   leftwindow = parent.frames[0]; 
}
let mat0 = null;
if(localStorage[key0]!=null && leftwindow !=null)
{
   mat0 = new Array();
   if (!isnewrecord)
   for (let k=0; k < numCols; k++)
   {
       mat0[k] = mat[0][k];
   }
  
   let p = (new CSVParse(localStorage[key0], "'", ",")).nextRow();
   let valid = validate(p);
   if (valid) 
   {for (let k=0; k < numCols; k++)
       mat[0][k] = p[k];
   }
   else
   {
      mat0 = null; 
      delete localStorage[key0];
   }
}
function validate(p)
{
    if (p[0] == null || p[0] === '') return false;
    if (p[1] === '' || p[1].replace(/[0-9]/g,'') !== '') return false;
    if (p[2] === '' || p[2].replace(/[0-9]/g,'') !== '') return false;
    if (p[3] === '' || p[3].replace(/[0-9]/,'') !== '') return false;
    if (p[4] === '' || p[4].replace(/[0-9]/,'') !== '') return false;
    if (p[5] === '' || p[5].length > 100) return false;
    if (p[6] === '' || p[6].length > 200) return false;
    if (p[7] === '' || p[7].replace(/[0-9]/,'') !== '') return false;
    if (p[8] === '' || p[8].length  < 30) return false;
    if (p[10] === ''  ) return false;
    if (p[11] === ''  ) return false;
    if (p[12] === '' || p[12].replace(/[0-9|.]/g,'') !== '') return false;
    if (p[13] === '' || p[13].replace(/[0-9|.|%]/g,'') !== '') return false;
    if (p[16] === '' || p[16].length > 30) return false;
    return true;
}
var needproof = false;
var butborderstyle = 'border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:3px;margin:3px 3px 3px 3px;';
writenow("<style>.tdbutton{white-space:nowrap;padding-top:3px;padding-bottom:3px;width:" + leftbutwidth +"px;overflow:hidden;border:1px green outset;color:white;font-family:" + defaultfontfamily + ";font-weight:bold;text-shadow:#606060 -1px -1px;" + butborderstyle +"}</style>");
var openedpreview =null;
document.body.style.backgroundImage = 'linear-gradient(var(--bbgcolor),var(--dbgcolor))';
 
var duringopen = function()
{
    var timenow = ~~((new Date()).getTime()/1000);
    var t1 = parseFloat(mat[0][1]);
    var t2 = parseFloat(mat[0][2]);
    return ( timenow    >  t1  - 900   &&  timenow   <  t2 + 900  );
} 

function proveFormat(nm, openedwin)
{ 
    openedpreview = openedwin;
    needproof = false;
    if (nm == textmsg[67])
    {
        NUMROWS = 1;
      
        setaction(1);
    }
   // else if (demokeyframen > 0)  demose26();
}
function setneedproof()
{ 
    needproof = true;
}
var layout =  (screen.width >=1360)?'h':'v';
var leftbutwidth = Math.ceil(font_size*charwidthrate());
document.body.style.marginBottom = '-2px';
function findheight()
{
   var vp = new Viewport();
   let ach = vp.windowY - 2*(40+4.5*font_size);
   if (localStorage["menuontop"]!=null) ach -= 2*font_size; 
   return (layout == 'h')? ach : (ach/2);
}
let actualleftbutwidth = localStorage["menuontop"]==null?leftbutwidth:0;

var boxheight = findheight(); 
for (var j =0; j < numCols; j++)
{
 if (j == 12 || j ==13) continue;
 x = ctype[j].toLowerCase();
 if (x=='a' || x=='i' || x=='n' || x=='u')
 {
 if (fsize[j] == null || fsize[j] == '')
 {
 if (x == 'n')
 { fsize[j] = "10";    ffsize[j]  = "0";}
 else if (x=='u')
 {
 fsize[j] = "";
 ffsize[j] = "";
 }
 else
 { fsize[j] = "30";   ffsize[j]  = "5";}
 }
 else
 {
 var sa = 0; 
 if (fsize[j]!=null) sa = fsize[j].indexOf("_");
 if (sa > 0)
 {

 ffsize[j]  = fsize[j].substring(sa+1);
 fsize[j]  = fsize[j].substring(0, sa);

 }
 else
 {
 if (x == 'n')
 ffsize[j] = "0";
 else if (x=='u')
 ffsize[j] = "";
 else
 ffsize[j] = "5";
 }
 }
 }
 else if (x == 'm' && (fsize[j]== null||fsize[j]==""))
 {   fsize[j] = '' + (parseInt(timeformat.length)-2);  }
 else if (x == 'l' && (fsize[j]== null || fsize[j]==""))
 fsize[j] = '2';

}
fsize[0] = fsize[5] = fsize[6] = fsize[1];
var numWsinputs = 0, numWsopts=0;
var jj = 0, j;
if (mm>0)
{
 while ((j = webserviceAllbuts.indexOf('<input ',jj)) >=0){jj=j+1;numWsinputs++;}
 if ( webserviceAlloptions!='')
 {
 jj = 0;
 while ((j = webserviceAlloptions.indexOf('<input ',jj)) >=0){jj=j+1;numWsopts++;}
 }
}

//lookup[8] += numWsinputs;
//for (j=9; j < numCols; j++)
//   lookup[j] += 2*numWsinputs + numWsopts;

var Lstr = "", borderstr;
S = function(r,c)
{
  if (periodvalue ==1)
  {
        if (rr>=0 && cc>=0)
        U(rr,cc);
  }
  periodvalue =1;
   
 x = retrv(r,c);
 if (isnewrecord && (x== nullvalue[c]||x==''&&dtype[c])  )
 {
 if (ctype[c]!='s' && ctype[c]!='S')
 {
 setv(r,c,defaultValue(r,c));
 }
 }
 rr=r;
 cc=c;
 if(cc==8||cc==9)
 {
     changethem(0);
 }
 else if (cc==1)
 {
     if (ele(0,1).value == '')
     {
         setv(0,1,defaultRecord[1]);
         holdvalues['0_1'] = defaultRecord[1];
         valuechanged[0] = true;
     } 
 }               //21424  '21425
 else if (cc==2)
 {
     if (ele(0,2).value == '')
     {
         setv(0,2,defaultRecord[2]);
         holdvalues['0_2'] = defaultRecord[2];
         valuechanged[0] = true;
     }
 }
  
 if (cellonfocus!='')
 { 
    eval(cellonfocus); 
 }
   
};
 
defaultRecord[1] = '' + (parseInt(defaultRecord[1]) + 1800);
//if (mat[0][0]=='') myprompt("Starting time is set to be one hour later. You may change");
var ddue = new Date(1000*eval(defaultRecord[2]));
ddue.setHours(23);
ddue.setMinutes(50);
defaultRecord[2] = '' + Math.round(ddue.getTime()/1000);



var oldUT = UT;
UT = function(r,c)
{
    oldUT(r,c);
    if (c == 0)
    {
        holdvalues['0_0'] = ele(0,0).value = ele(0,0).value.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
        
    }
    else if (c == 2)
    {
        var yy = parseTime(ele(0,2).value);
         
        var z = 0;
        if (''+yy != ''+x) 
        {
            holdvalues['0_2'] =''+ yy;
            
            z = (parseFloat(''+retrv(r,c)) - parseFloat(''+x))/3600/24;
            z = Math.round(z*10)/10;
            
            var g = new RegExp(/,[\-]?[0-9|\.]+/);
            var k = 0; 
            var mg = retrv(0,19); 
            if (mg=='') mg = mat[0][19];
            var q = '';
            while (true)
            {
                var m = g.exec(mg.substring(k));
                if (m==null)
                {
                    break;
                }
                var i = m.index;

               
                var y =parseFloat(m.toString().substring(1))-z;
                var y1 = (''+ y).replace(/(\.[0-9])[0-9]+$/, "$1");
                if (y > 0)
                {
                    q += mg.substring(k, k+i);
                    q += ',' + y1; 
                }
                k += i + m.toString().length;
            }
            setv(0,19, q);
            holdvalues['0_19'] = q;
        }
    }
    else if (c == 5 || c == 6)
    {
        
        ele(0,c).value = ele(0,c).value.replace(/[ ]*[,|\\.|\\/|;|\\+][ ]*/g,',').replace(/[ ]+/g,',').replace(/^[ ]+/g,'').replace(/[ ]*[ ]*[,|\\.|\\/|;|\\+][ ]*$/g,'');
        holdvalues['0_' + c] = ele(0,c).value;
    }
    else if (c == 3 || c == 4)
    {
        var zz = ele(0,c);
        holdvalues['0_' + c] = zz.options[zz.selectedIndex].value;
    }
    else if (c == 7)
    {
         var vl = ele(0,7).options[ele(0,7).selectedIndex].value;
         if (vl != '3')
             holdvalues['0_' + c] = vl;
         else 
         {
             setv(0,7,x);
             holdvalues['0_' + c] = null;
             myprompt('Status Grading is set automatically during grading')
         }
    }
    valuechanged[0] = true;
};
var heightratio = parseInt(butstyle(font_size).replace(/.*height:([0-9]+).*/,'$1'));
function opentimehint(j)
{
    cc = j;
    timestrpop(retrv(0,cc));
}
function openforthis(j)
{
    if (promptwin!= null)
    {
        closeprompt();
        opentimehint(j);
    }
}
function makehimta(j)
{
    var allta = ",";
    var as = (new CSVParse(retrv(0,20), "|", ",", ";")).nextMatrix();
    for (var i=0; i < as.length; i++)
    {
        if (as[i]!=null && as[i].length >=3)
        {
            if (as[i][2]!=null && allta.indexOf("," + as[i][2] + ",")<0)
                allta += as[i][2] + ",";
        }
    }
    var as1 = retrv(0,6).split(/,/);
    for ( i=0; i < as1.length; i++)
    {
         as1[i] = as1[i].replace(/ /g,'');
         if (as1[i] != '' && allta.indexOf("," + as1[i]  + ",")<0)
                allta += as1[i]  + ",";
         
    }
    if (allta.length>0){ allta = allta.replace(/^,/,'').replace(/,$/,'') ;
    myprompt(textmsg[1825] + "<br><div class=outset3 style=margin:1px;padding:3px >" +  allta + '</div>',null,"if(v)makehimta1('" + allta  + "')");}
}
 
function myprompt2(s)
{
    if (s == '')
        myprompt(textmsg[1826])
    else 
        myprompt(textmsg[1827] + s);
}
function makehimta1(allta)
{
    postopen("follows.jsp",["x","allta"],  ["makehimta",allta],  "w" +tstmp);
}
function makelabel(j, wd)
{
 
 if (wd== null) wd = "";
 else wd = " width=" + wd +" ";
 writenow("<td " + wd +" style=\"background:" + gradientbg.replace(/\(/,'(to right,') + ";color:#DDCC11;"+ 
  "border-bottom:1px " + DBGCOLOR + " outset;border-left:1px " + DBGCOLOR + " outset\"  onMouseOver=\"showmyhint(" + 
 j  + ")\"   onMouseOut=\"hidemyhint()\" >" + ((j==1||j==2||j==6)?'<table cellspacing=0 cellpadding=0 width=100%><tr><td>':'') + "<nobr><b>" + labels[j]);
 if ( j==1 || j==2) 
   writenow('</td><td align=right><span style="-line-height:20px;height:15px;border:1px #c0c0c0 solid;vertical-align:middle;color:white;cursor:pointer;font-size:' + font_size + 'px;cursor:pointer" onclick=opentimehint(' + j + ')>&#9716;</span></td></tr></table>' );
 else if (j==6)
     writenow('</td><td align=right><span style="-line-height:20px;height:15px;border:1px #c0c0c0 solid;vertical-align:middle;color:white;cursor:pointer;font-size:' + font_size + 'px;cursor:pointer;padding:2px" onclick=makehimta(' + j + ')>&bull;&bull;</span></td></tr></table>' );
   
 else if (j==9 && !ismobile() && duringopen())
 {
     writenow('&nbsp;<span style="display:inline;color:white;cursor:pointer;font-size:' + font_size + 'px;text-align:center" onclick=addfs() onMouseOver=\"showmyhintstr(\'Projection protection during test. Click to switch\')\"  onMouseOut=\"hidemyhint()\">&#8858;</span>' );
 }
 writenow("</b></nobr>");
}
var numsize=0;
writenow(unifontstyle(font_size));
var panelposition = 9;
 
var toolbarsparent;
function movepanel(j)
{  
 window.onresize = null;
 if (j == null) j = panelposition;
 var p = document.getElementById("panel");
 
 if (layout == 'h')
 {
    toolbarsparent = document.getElementById('panelhomeport');// p.parentNode;
    toolbarsparent.align = (j == 9)?'right':'left'; 
    if (toolbarsparent.childNodes!= null && toolbarsparent.childNodes.length>0 && 
            toolbarsparent.childNodes[0].tagName.toLowerCase()=='table')
        toolbarsparent.childNodes[0].align = (j == 9)?'right':'left'; 
  
 }
 else if (j==8)
 {
     toolbarsparent = document.getElementById('panelhomeport'); //p.parentNode;
     p.style.position= 'absolute';
     p.style.width = ele(0,j).offsetWidth + 'px';
     var xy = [0, 70];
     if (typeof(findPositionnoScrolling)!='undefined')
     xy = findPositionnoScrolling(ele(0,j));
     p.style.top = ( xy[1] + ele(0,j).offsetHeight + 4) + 'px';
     p.style.left =  (leftbutwidth + 8) +  'px';
     p.style.verticalAlign='middle'; 
 }
 else  
 {
     p.style.width = null; 
     p.style.position= 'static';
     toolbarsparent = document.getElementById('panelhomeport');// p.parentNode;
     toolbarsparent.appendChild(p);  
 } 
 //if (pp!= null){  pp.appendChild(document.createTextNode(" ")); }
 associatedtxt = ele(0,j);
 panelposition = j;
 window.onresize = resizeCont1;
 if (typeof(textareatobesearch) != 'undefined')
 {
     textareatobesearch = associatedtxt;
 }
}
var clickedtime;
function dofocus11(n)
{
    clickedtime = (new Date()).getTime(); 
    
}


function doblur11(n)
{
    if (   (new Date()).getTime() - clickedtime > 30)
        Innergrid.leavingbox(false);
    
}
var taborder=0;
function makecontrol(j)
{
 if (ctype[j]== null){ return;}
 if (j >= numCols) return;   
 if (j == 17)
 {
     writenow("<div style=\"margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;width:1px\"><input   type=text onfocus=\"cc=17;this.select()\" onkeypress=\"return Innergrid.dotabenter(event);\"   style=\"width:1px;visibility:hidden\" name="+fields[j] +"></div>");
     return;
 }
 var str = null, readonly;

 if (dtype[j])
 classrl = "right";
 else
 classrl = "left";

 if (ctype[j] == ctype[j].toUpperCase())
 {
 readonly = "border:0px;background-color:" + DBGCOLOR +";color:" + IBGCOLOR +";";
 }
 else
 {
 readonly = "border:0px;background-color:" + TBGCOLOR +";color:#000000;";
 }

 switch(ctype[j])
 {
 case 'a': case 'A':
 if (layout == 'h')
 {
    ffsize[j] = 10;
    fsize[j] = 20;
 }
 else
 {
     ffsize[j] = 14;
 }
 writenow( "<textarea  onkeydown=\"if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}\"   wrap=soft style=\"font-size:" + font_size + "px;border:1px " + IBGCOLOR + " outset;background-color:" + TBGCOLOR +";color:#000000;height:" +  boxheight + "px\" cols="+ fsize[j]+"   name="+fields[j] );
 writenow( " onfocus=\"closethis();onF(counter,"+j+")\"");
 writenow( " onblur=\"U(counter,"+j+")\"");
 
 writenow("  onkeypress=\"return mkstrike(this,event,'" + ((j==8)?'e':'w') + "')\"");
 writenow( " onchange=\"setneedproof();UT(counter,"+j+");tempsave();\"  tabindex=" + (taborder++)+" ></textarea>\n");
 break;

 case 'i': case 'I':
 writenow("<input type=hidden name="+fields[j]+"><iframe frameborder=0 width="+fsize[j]+" height="+ffsize[j]+" name=iframe"+j +"></iframe>");
 break;
 case "m": case "M":
 writenow( "<INPUT style=\"" + readonly +"\" MAXSIZE=" + maxsize[j] +" SIZE="+(parseInt('' + fsize[j])+2)+" name="+fields[j] );
 writenow( " onfocus=\"S(counter,"+j+");closethis();openforthis(" + j + ")\"");
 writenow( " onblur=U(counter,"+j+")");
 writenow( " onchange=\"UT(counter,"+j+");tempsave();\"   tabindex=" + (taborder++)+">\n");
 break;

 case "t": case "n": case "T": case "N":
 writenow( " <INPUT  style=\"" + readonly +";width:"+font_size*0.5*parseInt(''+fsize[j])+"px\" MAXSIZE=" + maxsize[j] +"  name="+fields[j] );
 writenow( " onfocus=\"S(counter,"+j+");multirecords("+j+")\"");
 writenow( " onblur=U(counter,"+j+")");
 writenow( " onchange=\"UT(counter,"+j+");tempsave();\"   tabindex=" + (taborder++)+">\n");
 break;

 case 'p': case 'P':
 writenow( "<INPUT  style=\""   + readonly +"\"  type=password SIZE="+fsize[j]+" NAME="+fields[j] );
 writenow( " onfocus=S(counter,"+j+")");
 writenow( " onblur=U(counter,"+j+") ");
 writenow( " onchange=UT(counter,"+j+")   tabindex=" + (taborder++)+">\n");
 break;

 case 's': case 'S':
 numfsize = parseInt(fsize[j]);
 if(''+numfsize=='NaN'|| numfsize==0)
 {
 if (navigator.appName=='Netscape')
 readonly += "width:100px";
 }
 else
 readonly += "width:" + (numfsize*10) +"px";
 writenow( "<SELECT  style=\"" + readonly +"\"  name="+fields[j] );
 writenow( " onfocus=\"S(counter,"+j+");multirecords("+j+")\"");

 writenow( " onchange=\"U(counter,"+j+");UT(counter,"+j+");tempsave();" );
 if (j==4) writenow(";multichoice("+j+")");
 writenow("\" tabindex=" + (taborder++)+">");
 for (var jj=0; jj < options[j].length; jj++)
 writenow("<option value=\"" + options[j][jj].replace(/"/g,'\\"') + "\">" + captions[j][jj] + "</option>");
 writenow("</SELECT>");
 break;
 case 'w': case 'W':
 hc += 120;
 writenow( "<SELECT style=\"" + readonly +"\" multiple size=4 name=a"+fields[j] );
 writenow( " onfocus=S(counter,"+j+")");
 writenow( " onblur=U(counter,"+j+")");
 writenow( " onchange=UT(counter,"+j+")  tabindex=" +(taborder++)+">\n");
 for (jj=0; jj < options[j].length; jj++)
 writenow("<option value=\"" + options[j][jj].replace(/"/g,'\\"') + "\">" + captions[j][jj] + "</option>");
 writenow("</SELECT>");
 break;

 case 'r': case 'R':
 for (jj=0; jj < options[j].length; jj++)
 {
 writenow( "<input type=radio class=radchk  name="+fields[j] +" style=\"" + readonly + "background:" + DBGCOLOR +"\""  );

 writenow( " onfocus=S(counter,"+j+") onblur=U(counter,"+j+")  onclick=UT(counter,"+j+") value=\"" + options[j][jj].replace(/"/g,'\\"') + "\"  tabindex=" + j+"><nobr>" + captions[j][jj] +"</nobr>");
 }
 break;

 case 'c': case 'C':
 writenow("<INPUT style=\"" + readonly + "\"   type=checkbox NAME="+fields[j] );
 if (ctype[j]=='C') writenow(" readonly   ");
 writenow( " onfocus=S(counter,"+j+")");
 writenow( " onblur=U(counter,"+j+")");
 writenow( " onchange=UT(counter,"+j+")  tabindex=" + (taborder++)+">");
 break;
 case 'l':
 writenow("<INPUT class=dunderline style=\"border:1px #b0b0b0 solid;height:23!important;background:#fff;\" SIZE="+fsize[j]+" NAME="+fields[j] );
 writenow( " onfocus=S(counter,"+j+")");
 writenow( " onblur=U(counter,"+j+") ");
 writenow( " onchange=UT(counter,"+j+") onDblClick=openit1(this.value,counter)  tabindex=" + (taborder++)+">");
 break;
 case 'k':  case 'K':
 writenow("<input style=background-color:"+DBGCOLOR+";color:"+IBGCOLOR + ";font-weight:700;border:0;cursor:pointer readonly size=2 NAME="+fields[j]+" value=\"&bull;&bull;&bull;\" onClick=\"passedCol="+j+";openit1(mat[counter]["+j+"]+'&existing='+encodeURIComponent(retrv(counter,"+(j-1)+")),counter)\">");
 break;
 case 'h':  case 'H':
 writenow("<INPUT  type=hidden  NAME="+fields[j] +">");
 break;
 case 'L':
 Lstr += "<tr><td align=center  class=GreenButton  style=\"width:" + leftbutwidth +"px;overflow:hidden;border:1px green outset;color:white;font-family:" + defaultfontfamily + ";font-wight:700\"   NAME="+fields[j]+" onClick=openit2(counter,"+j+")>" + labels[j] +"</td></tr>";
 break;
 }
}

writenow("<style>body{margin:0px 0px 0px 0px}\nA:link{COLOR: blue;FONT-WEIGHT:700;TEXT-DECORATION: none}\n");
writenow("A:visited{COLOR: blue;FONT-WEIGHT:700;TEXT-DECORATION: none}\n");
writenow("A:hover{COLOR: #CC0000; FONT-WEIGHT:700; TEXT-DECORATION: underline}\n");
writenow(".outsetbox{border-bottom:1px " + DBGCOLOR + " outset}\n");
writenow("</style>");

var tit = unititle(title,'outset2');
if (parent.frames[1]==window) tit = tit.replace(/<img[^>]*>/,"").replace(/<td[^>]*><.td>/,"");
       
writenow(tit);
writenow("<form rel=opener name=form1 method=post  style=\"margin:0px 0px 0px 0px\"  >");
//writenow(round1('100%'));
writenow("<TABLE id=maintable    class=outset3 style=\"margin:0px 0px 0px 0px;background-color:var(-bbgcolor);border:2px " + IBGCOLOR + " outset\"  cellspacing=1 cellpadding=3 width=\"100%\" >");
 writenow("<tr>");
makelabel(0);
writenow("</td><td align=left class=outsetbox>");
makecontrol(0);
for(j = 1; j < 3; j++)
{
 writenow("</td>");
 makelabel(j);
 writenow("</td><td  class=outsetbox>");
 makecontrol(j);
}
writenow("</td>");
 makelabel(7);
 writenow("</td><td  class=outsetbox>");
 makecontrol(7);
writenow("</td>");
makelabel(12);
writenow("</td><td  class=outsetbox>");
makecontrol(12);
writenow("</td></tr>");
writenow("<tr>");
makelabel(4);
writenow("</td><td align=left  class=outsetbox>");
makecontrol(4);
for(j = 5; j <7; j++)
{
 writenow("</td>");
 makelabel(j);
 writenow("</td><td  class=outsetbox>");
 makecontrol(j);
}
 writenow("</td>");
 makelabel(3);
 writenow("</td><td  class=outsetbox>");
 makecontrol(3);
 
writenow("</td>");
makelabel(13);        
writenow("</td><td  class=outsetbox>");
makecontrol(13);
writenow("</td></tr>");

 
//if (textmsg[1012].length>7) textmsg[1012] = textmsg[1012].substring(0,7);
hints[numCols+7] = textmsg[1575];
hints[numCols+6] = textmsg[1323];
hints[numCols+4] = textmsg[811];
hints[numCols+5] = textmsg[812];
hints[numCols + 3] =textmsg[1324];
hints[numCols+8] = textmsg[1847];
var assessopened = false;

if ( layout == 'h')
{
writenow("<tr><td valign=top rowspan=1  style=background-color:" + IBGCOLOR+"><table cellspacing=1 cellpadding=3  id=contbutt >");
writenow( "<tr><td  align=center class=\"tdbutton GreenButton\"   id=guidebtn   ONCLICK=\"closethis();syntax()\"  onMouseOver=\"showmyhint(" + (numCols + 3)  + ")\"  onMouseOut=\"hidemyhint()\">");
writenow( "<nobr>"+ textmsg[1319] + "</nobr></td></tr>");

writenow("<tr><td align=center  class=\"tdbutton GreenButton\"  id=assessbtn     ONCLICK=\"closethis();openassess();assessopened=true;\"  tabindex=7  onMouseOver=\"showmyhint(" + (numCols+6)  + ")\"  onMouseOut=\"hidemyhint()\">");
writenow("<nobr>"+  textmsg[1012] +"</nobr></td></tr>");



writenow("<tr><td  align=center  class=\"tdbutton GreenButton\"    id=optionbtn   ONCLICK=\"closethis();multichoice()\"  tabindex=8  onMouseOver=\"showmyhint(" + (numCols+4)  + ")\"  onMouseOut=\"hidemyhint()\">");
writenow("<nobr>" + (textmsg[414] ) + "</nobr></td></tr>");
writenow( "<tr><td  align=center   class=\"tdbutton OrangeButton\"   id=savebtn  ONCLICK=\"closethis();proofsave()\"  onMouseOver=\"showmyhint(" + (numCols )  + ")\"  onMouseOut=\"hidemyhint()\">");
writenow("<nobr>"+    updatelabel  +"</nobr></td></tr>");
writenow( "<tr><td  align=center  class=\"tdbutton GreenButton\" " + (numRows==0?'style=overflow:hidden;visibility:hidden':'style=overflow:hidden') +"   id=slink  ONCLICK=\"closethis();studentlink()\"  onMouseOver=\"showmyhint(" + (numCols+8 )  + ")\"  onMouseOut=\"hidemyhint()\">");
writenow( "<nobr>"+ textmsg[1872] + "</nobr></td></tr>");
writenow( "<tr><td  align=center  class=\"tdbutton GreenButton\" " + (numRows==0?'style=overflow:hidden;visibility:hidden':'style=overflow:hidden') +"    id=latebtn1  ONCLICK=\"closethis();latepermit()\"  onMouseOver=\"showmyhint(" + (numCols + 7)  + ")\"  onMouseOut=\"hidemyhint()\">");
writenow( "<nobr>"+ textmsg[1574] + "</nobr></td></tr>");
writenow( "<tr><td  align=center  class=\"tdbutton GreenButton\"      name=printbtn  ONCLICK=\"closethis();printing()\"  >");
writenow( "<nobr>"+ textmsg[409] + "</nobr></td></tr>");
if (numRows>0 &&  parent!=window && parent!=window)// && parent.frames[0].getCurrentSemester()!=mat[0][11])
{

 writenow( "<tr><td  align=center  class=\"tdbutton BlueButton\"   bgcolor=blue  name=saveasbtn  ONCLICK=\"closethis();dosaveas()\"  onMouseOver=\"showmyhint(" + (numCols + 5)  + ")\"  onMouseOut=\"hidemyhint()\">");
 writenow("<nobr>"+    textmsg[797] + "</nobr></td></tr>");
}

writenow("<tr><td  align=center  class=\"tdbutton RedButton\" " + (numRows==0?' style=visibility:hidden':'') +"  id=delbtn ONCLICK=setaction(3)  onMouseOver=\"showmyhint(" + (numCols+1)  + ")\"  onMouseOut=\"hidemyhint()\">");
writenow("<nobr>"+     deletelabel + "</nobr></td></tr>");

//writenow("<tr><td   align=center  style=\"" + butborderstyle + ";font-weight:700;background:url(image/GreenButton.gif);width:" + leftbutwidth +"px;overflow:hidden;border:1px green outset;color:white;font-family:" + defaultfontfamily + ";font-wight:700\"   ONCLICK=customize()  onMouseOver=\"showmyhint(" + (numCols+2)  + ")\"  onMouseOut=\"hidemyhint()\">");
//writenow("<nobr>"+     textmsg[407] +"</nobr></td></tr>" );

writenow( "<tr><td   align=center  class=\"tdbutton GreenButton\"    ONCLICK=\"closethis();showhelp()\" >");
writenow("<nobr>"+  textmsg[17]+"</nobr></td></tr>");
writenow(Lstr);
writenow( "<tr><td id=butswitch style=color:white onclick=buttonsmove1(this) align=center>&uarr;</td></tr>");


writenow("</table> </td><td colspan=9><table cellpadding=0 cellspacing=0><tr>");
makelabel(8); 

writenow(  "</td>");
function addfs()
{
    var f =  ele(0,8).style.fontSize;
    var g = ele(0,9).style.fontSize;
    if (f!=g)
    {
        ele(0,9).style.color = '#000000';
        ele(0,9).style.fontSize = f;
    }
    else
    {
        ele(0,9).style.color = '#cccccc';
        ele(0,9).style.fontSize = '6px'; 
    }
}
makelabel(9);
writenow("</td>");
 
writenow("</tr><tr><td  >");
 makecontrol(8);  writenow("</td><td  >");
 makecontrol(9);  writenow("</td></tr>");
  
 

 writenow("</table></td></tr>");
 writenow("<tr>");makelabel(18);writenow("<td colspan=9><table width=100% ><tr><td align=left  id=attachpanel0  width=50% style=\"color:blue;cursor:pointer\"  ONCLICK=\"closethis();ResizeUploaded.attachman(ele(0,18))\"></td><td align=right width=50%  id=attachpanel1  style=\"color:blue;cursor:pointer\"  ONCLICK=\"closethis();ResizeUploaded.attachman(ele(0,18))\"></td></tr></table></td></tr>");
 

}
else
{

writenow("<tr height=" + (8+ font_size) + "><td  style=\"height:" + (8+ font_size) + "px;\" valign=top><table  height=" + (8+ font_size) + " width=100%  cellspacing=0 cellpadding=0><tr height=" + (8+ font_size) + ">");
makelabel(8);
writenow("</td></tr></table></td><td rowspan=2 colspan=9>");
 makecontrol(8);
writenow("</td></tr>");
writenow("<tr><td valign=top style=background-color:"+IBGCOLOR+"><table cellspacing=1 id=contbutt cellpadding=3>");

writenow( "<tr><td  align=center class=\"tdbutton GreenButton\"   id=guidebtn   ONCLICK=\"closethis();syntax()\"  onMouseOver=\"showmyhint(" + (numCols + 3)  + ")\"  onMouseOut=\"hidemyhint()\">");
writenow( "<nobr>"+ textmsg[1319] + "</nobr></td></tr>");


writenow("<tr><td align=center class=\"tdbutton GreenButton\"     name=submit01     ONCLICK=\"closethis();openassess()\"  tabindex=7  onMouseOver=\"showmyhint(" + (numCols+6)  + ")\"  onMouseOut=\"hidemyhint()\">");
writenow("<nobr>"+  textmsg[1012] +"</nobr></td></tr>");



writenow("<tr><td  align=center  class=\"tdbutton GreenButton\"     id=optionbtn   ONCLICK=\"closethis();multichoice()\"  tabindex=8  onMouseOver=\"showmyhint(" + (numCols+4)  + ")\"  onMouseOut=\"hidemyhint()\">");
writenow("<nobr>" + ( textmsg[414] ) + "</nobr></td></tr>");

/*
writenow("<tr><td   align=center  style=\"" + butborderstyle + ";font-weight:700;background:url(image/GreenButton.gif);width:" + leftbutwidth +"px;overflow:hidden;border:1px green outset;color:white;font-family:" + defaultfontfamily + ";font-wight:700\"   ONCLICK=customize()  onMouseOver=\"showmyhint(" + (numCols+2)  + ")\"  onMouseOut=\"hidemyhint()\">");
writenow("<nobr>"+     textmsg[407] +"</nobr></td></tr>" );
*/

writenow( "<tr><td  align=center  class=\"tdbutton OrangeButton\"   id=savebtn  ONCLICK=\"if(assessopened)updateassess();closethis();proofsave()\"  onMouseOver=\"showmyhint(" + (numCols )  + ")\"  onMouseOut=\"hidemyhint()\">");
writenow("<nobr>"+    updatelabel  +"</td></tr>");
writenow( "<tr><td  align=center  class=\"tdbutton GreenButton\"      id=slink  ONCLICK=\"closethis();studentlink()\"  onMouseOver=\"showmyhint(" + (numCols+8 )  + ")\"  onMouseOut=\"hidemyhint()\">");
writenow( "<nobr>"+ textmsg[1872] + "</nobr></td></tr>");
writenow( "<tr><td  align=center  class=\"tdbutton GreenButton\"  style=overflow:hidden" + (numRows==0?';visibility:hidden':'') +"   name=latebtn1  ONCLICK=\"closethis();latepermit()\"  onMouseOver=\"showmyhint(" + (numCols + 7)  + ")\"  onMouseOut=\"hidemyhint()\">");
writenow( "<nobr>"+ textmsg[1574] + "</nobr></td></tr>");

writenow( "<tr><td  align=center  class=\"tdbutton GreenButton\"      name=printbtn  ONCLICK=\"closethis();printing()\" >");
writenow( "<nobr>"+ textmsg[409] + "</nobr></td></tr>");
if (numRows>0 &&  parent!=window && parent!=window)// &&  parent.frames[0].getCurrentSemester()!=mat[0][11])
{
 writenow( "<tr><td  align=center  class=\"tdbutton BlueButton\"   name=saveasbtn  ONCLICK=\"closethis();dosaveas()\"  onMouseOver=\"showmyhint(" + (numCols + 5)  + ")\"  onMouseOut=\"hidemyhint()\">");
 writenow("<nobr>"+    textmsg[797] + "</td></tr>");
}

writenow("<tr><td  align=center  class=\"tdbutton RedButton\" " + (numRows==0?' style=visibility:hidden':'') +"  id=delbtn ONCLICK=setaction(3)  onMouseOver=\"showmyhint(" + (numCols+1)  + ")\"  onMouseOut=\"hidemyhint()\">");
writenow("<nobr>"+     deletelabel + "</td></tr>");
writenow( "<tr><td   align=center class=\"tdbutton GreenButton\"    ONCLICK=\"closethis();showhelp()\">");
writenow("<nobr>"+  textmsg[17]+"</nobr></td></tr>");


//writenow("<tr ><td   align=left  valign=top  width=100% id=attachpanel0  style=\"color:blue;overflow:hidden\"  ONCLICK=ResizeUploaded.attachman(ele(0,18))></td></tr>");

writenow("</table>");
writenow( "</td></tr>");


writenow("<tr height=" + (8+font_size) +" style=background-color:"+ IBGCOLOR+ ";><td valign=top style=\"height:" + (8+ font_size) + "px;\"><table  height=" + (8+ font_size) + " width=100% cellspacing=0 cellpadding=0><tr  height=" + (8+ font_size) + ">");
makelabel(9);
writenow("</td></tr>");
writenow("</table> <div id=butswitch style=text-align:center;color:white onclick=buttonsmove(this)>&uarr;</div></td><td rowspan=2 colspan=9>");
makecontrol(9);
writenow("</td></tr><tr><td valign=top><table cellspacing=0 valign=top width=100% cellpadding=0>");

writenow(Lstr);
 
//writenow("<tr><td align=left valign=bottom width=100%  id=attachpanel1  style=\"width:" + leftbutwidth +"px;color:blue;overflow:hidden\"  ONCLICK=ResizeUploaded.attachman(ele(0,18))></td></tr>");
 

//writenow("<tr><td><a href=\"javascript:myws(null,'DataTable?rdap=courseservices&extraline=3&exbut=cp&CourseId=" + defaultRecord[10] +"&Title=" + defaultRecord[10] +"&onsaved=4&wording=" + textmsg[485] +"&subdb=" + subdb +"',0)\"><nobr>");
//writenow( textmsg[188] +"</nobr></a></td></tr>");
writenow("</table></td></tr>");
writenow("<tr>");makelabel(18);writenow("<td colspan=9><table width=100% ><tr><td align=left  id=attachpanel0  width=50% style=\"color:blue;cursor:pointer\"  ONCLICK=\"closethis();ResizeUploaded.attachman(ele(0,18))\"></td><td align=right width=50%  id=attachpanel1  style=\"color:blue;cursor:pointer\"  ONCLICK=\"closethis();ResizeUploaded.attachman(ele(0,18))\"></td></tr></table></td></tr>");
 
}

 
writenow("</table>" );
writenow(round2 );

writenow(round1('100%'));

writenow("<table class=outset1 style=\"margin:-6px 0px 0px 0px;border-collapse:collapse;\" width=100% border=0 cellspacing=0 cellpadding=0 >");
writenow("<tr height=" + (font_size+6) + " bgcolor="+ IBGCOLOR + ">");
writenow("<td width=" + (leftbutwidth+5) +" style=padding-left:2px;padding-right:2px><table style=\"margin:0px 3px 0px 0px\" cellspacing=0 cellpadding=0 width=" + (leftbutwidth+6) +" ><tr><td   align=center class=\"tdbutton GreenButton\" style=\"padding-left:3px;padding-right:3px;width:" + (leftbutwidth) + "px !important\"  ONCLICK=\"closethis();opentool()\">");
//writenow("<a href=\"javascript:opentool()\"><nobr></nobr></a>");
writenow( textmsg[188] +"</td></tr></table></td><td width=\"0%\" style=\"background-color:" + IBGCOLOR +";width:0px;padding:0px 0px 0px 0px\"  >");
for(let z=10; z < numCols; z++)
    if (z!=12 && z!=13)
       makecontrol(z);  
 
writenow("<input name=role type=hidden value=instructor>");
writenow("<input name=subfolder type=hidden>");  
writenow("<input name=subdb type=hidden value=\"" + subdb +"\">");
writenow("<input name=formattxt type=hidden value=\"\"></td>"); 
writenow("<td with=100% bgcolor=" + IBGCOLOR + " align=\"left\" id=\"panelhomeport\" ><div id=\"panel\" style=\"background-color:" + IBGCOLOR +";padding:0px 0px 0px 1px;vertical-align:middle;align:left\">"  );
if (mm > 0)
{
 
if ( webserviceAlloptions!='')
{
 webserviceAlloptions = webserviceAlloptions.replace(/webservice.ele.0,8.,/g, "myws1(").replace(/ele.0,8./g, "associatedtxt").replace(/<table.*<tr><td>/,'').replace(/<.tr>.*/, '').replace(/<td>/g,'').replace(/<.td>/g,'');
 writenow(webserviceAlloptions);
  
}
 
 webserviceAllbuts = webserviceAllbuts.replace(/<br>/g,'').replace(/webservice.ele.0,8.,/g, "myws1(").replace(/ele.0,8./g, "associatedtxt").replace(/style=/g,"style=width:" + leftbutwidth +"px;overflow:hidden;padding-left:0px");
 writenow( webserviceAllbuts);
}

webserviceAlloptions +=   webserviceAllbuts;
writenow(  "</div></td></tr>");
writenow( "</table>"  );

writenow(  "</form>");

writenow( "<form rel=opener style=\"margin:-3px 0px 5px 0px\" name=thisform  method=POST action=SaveBack target=savewindow style=\"margin:0px 0px 0px 0px\"  >");
writenow( "<input type=HIDDEN   name=rdap value=\"" + rdapname + "\">\n");
writenow( "<input type=HIDDEN   name=rsacode value=\"" + rsaenccode + "\">\n");
writenow( "<input type=HIDDEN   name=subdb value=\"" + subdb + "\">\n");
writenow( "<input type=HIDDEN   name=wcds>\n");
writenow( "<input type=HIDDEN   name=id>\n");
writenow( "<input type=hidden   name=count >\n");
writenow( "<input type=hidden   name=total value="+ numRows+ ">\n");
writenow( "<input type=hidden   name=newbtn>\n");
writenow( "<input type=hidden   name=savebtn>\n");
writenow( "<input type=hidden   name=delbtn>\n");
writenow( "</form>");
//writenow("<input name=test1 value=test1 type=button onclick=doleaving()>");
fsnd = document.form1;
f1 = document.form1;

 
function dosaveas()
{
 var tt = mat[0][0]; if (leftwindow!=null && mat[0][11]==leftwindow.getCurrentSemester())tt += "1";
 var str = "<form rel=opener name=f10   ><table class=outset3 align=center><tr><td align=left  style=\"background:" + gradientbg.replace(/\(/,'(to right,') + ";color:#DDCC11;background-color:"+ 
 IBGCOLOR +";border-bottom:1px " + DBGCOLOR + " outset;border-left:1px " + DBGCOLOR + " outset\" >" + labels[0] + "</td><td align=left><input name=name1 value=\"" + tt + "\" class=left></td></tr><tr><td style=\"background:" + gradientbg.replace(/\(/,'(to right,') + ";color:#DDCC11;background-color:"+ 
 IBGCOLOR +";border-bottom:1px " + DBGCOLOR + " outset;border-left:1px " + DBGCOLOR + " outset\" align=left>"
   + labels[5] + "</td><td align=left><input name=sessions class=left  value=\"" +  mat[0][5]  + "\"></td></tr><tr><td align=left style=\"background:" + gradientbg.replace(/\(/,'(to right,') + ";color:#DDCC11;background-color:"+ 
 IBGCOLOR +";border-bottom:1px " + DBGCOLOR + " outset;border-left:1px " + DBGCOLOR + " outset\">" 
         + labels[11] + "</td><td align=left><input name=semester class=left readonly  value=\"" +  (leftwindow==null?defaultRecord[11]:leftwindow.getCurrentSemester()) + "\"></td></tr><tr><td colspan=2 align=center>" 
         + "<input name=godo type=button class=OrangeButton style=width:" + (4.5*font_size) + "px onclick=gosaveas(this) value=\"" +  textmsg[66] + "\"><input  style=width:" + (4.5*font_size) + "px  type=button name=cancel class=RedButton onclick=closeprompt() value=\"" +  textmsg[18] + "\"></td></tr></table></form>";
myprompt(str,null,null,textmsg[1634]); 
}
function buttonsmove(a)
{
    if (a.innerHTML.charCodeAt(0) == 8593)
    {
        let cont = document.getElementById('contbutt');
        let tr = cont.parentNode.parentNode;
        let tbl = tr.parentNode.parentNode;
        let dv = document.createElement('div');
        dv.style.cssText = "margin:4px;alignment:center";
        let x = cont.outerHTML.replace(/<\/tr>[ ]*<tr>/g,'').replace(/width:[0-9|\.]+;/g,'width:' + (charwidthrate()*font_size)).replace(/style="/g,'style="padding-top:3px;padding-bottom:3px;width:' + (charwidthrate()*font_size) + "px;");
        dv.innerHTML = x.replace(/<.tr>/,'<td onclick=buttonsmove(this) style=color:white >&darr;</td></tr>');
        let tl = document.getElementById('maintable');
        document.form1.insertBefore(dv,tl);
        cont.parentNode.removeChild(cont);
        a.innerHTML = '&darr;';
        localStorage["menuontop"] = "true";
    }
    else
    {
        let cont = document.getElementById('contbutt');
        let tr = document.form1.Question.parentNode.parentNode;
        let newtb = document.createElement('table');
        let x = cont.innerHTML.replace(/<.td><td/ig,'</td></tr><tr><td').replace(/padding\-[a-z]+:3px;/g,"");
        let k = x.lastIndexOf("<td ");
        
        document.form1.removeChild(cont.parentNode);
        newtb.innerHTML = x.substring(0,k) + "</tr></table>";
        newtb.id = 'contbutt'
        newtb.cellSpacing = "2";
        tr.cells[0].appendChild(newtb);
        tr.cells[0].style.backgroundColor = IBGCOLOR;
        a.innerHTML = '&uarr;';
        localStorage.removeItem("menuontop");
        document.getElementById('butswitch').innerHTML = '&uarr;';
    }
    placeit();
    ele(0,8).onfocus = function(){closethis();onF(counter,8);}
    ele(0,9).onfocus = function(){closethis();onF(counter,9);}
    for (let k=8; k < 10; k++)
    {
        let qbox = ele(0,k);
        qbox.onkeydown=function(event)
        {
            if(event.keyCode===9) 
            {   
               var v=this.value ,s=this.selectionStart,e=this.selectionEnd;
               this.value=v.substring(0, s)+'	'+v.substring(e);
               this.selectionStart=this.selectionEnd=s+1;
               return false;
            }
        }
        qbox.onblur= function(){U(counter,8);}
        qbox.onkeypress= function(event){return mkstrike(this,event,'e');}
        qbox.onchange= function(){setneedproof();UT(counter,8);tempsave();}
    }
}
let buthome;

function buttonsmove1(a)
{
    if (a.innerHTML.charCodeAt(0) == 8593)
    {
        a.innerHTML = "&darr;";
        let cont = document.getElementById('contbutt');
        let width = cont.parentNode.offsetWidth;
        buthome = cont.parentNode.parentNode;
        let tbl = buthome.parentNode.parentNode;
        let dv = document.createElement('div');
        dv.style.cssText = "margin:4px;alignment:center;background-color:var(dbgcolor)";
        dv.innerHTML =  cont.outerHTML.replace(/<\/tr>[ ]*<tr>/g,'').replace(/pointer;/g,'pointer;width:' + (4*font_size) + 'px;padding-top:3px;padding-bottom:3px');
        let tl = document.getElementById('maintable');
        document.form1.insertBefore(dv,tl);
        let td1 = buthome.cells[1];
        buthome.deleteCell(0);
        td1.colSpan = "10";
        document.form1.Question.style.width = (document.form1.Question.offsetWidth + width-4) + 'px';
        localStorage["menuontop"] = "true";
        actualleftbutwidth = 0;
        resizeCont1();
        cont = document.getElementById('contbutt');
        cont.rows[0].cells[cont.rows[0].cells.length-1].style.width = null;
        let td = cont.rows[0].insertCell(-1);
        td.innerHTML = '&rarr;';
        td.style.color = 'white';
        td.onclick = removetoolbar;
    }
    else
    {
        a.innerHTML = "&uarr;";
        let cont = document.getElementById('contbutt');
        cont.rows[0].deleteCell(cont.rows[0].cells.length-1);
        let x = cont.outerHTML.replace(/<.td><td/ig,'</td></tr><tr><td');
        cont.parentNode.removeChild(cont);
        let td = buthome.cells[0];
        td.colSpan= "" + (parseInt(td.colSpan) - 1);
        td = buthome.insertCell(0);
        td.innerHTML =  x;
        td.bgColor = IBGCOLOR;
        td.vAlign = 'top';
        let wd = td.offsetWidth;
        document.form1.Question.style.width = (document.form1.Question.offsetWidth - wd-8) + 'px';
        localStorage.removeItem("menuontop");
        actualleftbutwidth = leftbutwidth;
        resizeCont1();
       
    }
    placeit();
    ele(0,8).onfocus = function(){closethis();onF(counter,8);}
    ele(0,9).onfocus = function(){closethis();onF(counter,9);}
    for (let k=8; k < 10; k++)
    {
        let qbox = ele(0,k);
        qbox.onkeydown=function(event)
        {
            if(event.keyCode===9) 
            {   
               var v=this.value ,s=this.selectionStart,e=this.selectionEnd;
               this.value=v.substring(0, s)+'	'+v.substring(e);
               this.selectionStart=this.selectionEnd=s+1;
               return false;
            }
        }
        qbox.onblur= function(){U(counter,8);}
        qbox.onkeypress= function(event){return mkstrike(this,event,'e');}
        qbox.onchange= function(){setneedproof();UT(counter,8);tempsave();}
    }
}
function showtootbar()
{
   let cont = document.getElementById('contbutt');
   cont.style.display = 'block';
   let p = allainputeles.lastIndexOf("<tr>");
   allainputeles = allainputeles.substring(0,p);
   for(let j=8; j <= 9; j++)
   ele(0,j).style.height = (parseInt(ele(0,j).style.height.replace(/px/,'')) - font_size-10) + 'px';
    
}
function removetoolbar()
{
    let cont = document.getElementById('contbutt');
    cont.style.display = 'none';
    for(let j=8; j <= 9; j++)
    ele(0,j).style.height = (parseInt(ele(0,j).style.height.replace(/px/,'')) + font_size+10) + 'px';
    allainputeles += "<tr><td  class=BlackButton style=\"background-image:linear-gradient(var(--ibgcolor),var(--hibgcolor));color:white;font-family:" + defaultfontfamily + "\" onclick=\"showtootbar()\"><nobr>" + textmsg[1889] +"</nobr></td></tr>";
}
function rollback(){}
function gosaveas(btn)
{
    var f = document.f10;
    var timelen = parseInt(mat[0][2]) - parseInt(mat[0][1]);
    mat[0][0]=''; setv(0,0,f.name1.value.replace(/^[ ]+/,'').replace(/[ ]+$/,''));
    mat[0][1]=''; setv(0,1,defaultRecord[1]); 
    mat[0][2]=''; setv(0,2,parseInt(defaultRecord[1])+ timelen); 
    mat[0][5]=''; setv(0,5,f.sessions.value.replace(/ /g,'')); 
    mat[0][11]=''; setv(0,11,f.semester.value.replace(/^[ ]+/,'').replace(/[ ]+$/,'')); 
    setv(0, 14, mat[0][14].replace(/et:[0-9]+/,'et:0').replace(/;r:[^;]+/,';').replace(/^r:[^;]+/,'')); mat[0][14] = '';
    numRows = 0;
    valuechanged[0]=true;
    NUMROWS = 1;
    setaction(1);
}

 
 

 
function multichoice(v)
{
 var t1 = retrv(0,4);
 document.getElementById("optionbtn").innerHTML = "<nobr>"+    textmsg[414] + "</nobr>";
 document.getElementById("optionbtn").style.visibility = 'visible';
 if (!needproof && (t1=='1'  || t1 == '3'))
 {
     needproof = true;
     setv(0, 14, mat[0][14].replace(/;r:[^;]+/,';').replace(/^r:[^;]+/,'').replace(/;o:[^;]+/,';').replace(/^o:[^;]+/,''));
 }
 else if ( needproof && (t1 =='0'  || t1 == '2'))
 {
     needproof = false;
 }
 if (retrv(0,8).length < 10 && retrv(0,9).length < 5 || retrv(0,8)==defaultRecord[8])
 {
    syntax1();
 }
 if (v== null)
 cfgquiz(parseInt(t1));
  
}

var cellfitdone = false;
var cellwidths = null;

 
function myws1(s,j)
{
    myws(associatedtxt, s, j);
}
function myws(ta, s, j)
{
    updatepops(); 
    if (s == 'preview.jsp' && (retrv(0, 4) == '1' || retrv(0, 4) == '3'))
    {
        if ( retrv(0, 8).length < 10 && retrv(0, 9).length < 5 )
        {
            syntax1();
        }
        else 
        {
            var el  = formselementbyname(document.form1, "Content");
            if (el  == null)
            {
                el  = document.createElement('input');
                el.type='hidden';
                el.name = 'Content';
                document.form1.appendChild(el);
            }
            el.value =  associatedtxt.value;
            
            nav1 = window.open('splitwin.jsp?way=1', "_blank");
        }
        return;
    }

    
    if (ta != null)
    {
        if (ta.name == fields[9])
            fsnd.subfolder.value = "answer"; //"textmsg[84];
        else
            fsnd.subfolder.value = "assignment";//"textmsg[85];
    }

    if (numRows == 0)
    {
        fsnd.course.value = defaultRecord[10];
        fsnd.coursetitle.value = defaultRecord[15];
    }
    contentarea = ta;
    if (s.indexOf('UploadComm') == 0)
        s = 'UploadTeaching';

    if (s.indexOf('UploadTeaching') == 0)
    {
        popwin = 'w' + tstmp;
        disablethem1(true);
        fsnd.encoding = "multipart/form-data";
    }
    else
    {
        fsnd.encoding = 'application/x-www-form-urlencoded';
        fsnd.coursetitle.value = ZQ[1];
        if (ta != null && asso[j] != null)
        {
            asso[j].value = ta.value;
            // disableAreas(asso[j], true);
        }
       
    }

    formnewaction(fsnd, s);
   
    if (s == 'preview.jsp')
    {
        phase = '0';
        
        fsnd.target = "upleft"+ phase;
    }
    else if (s.indexOf('UploadTeaching') == 0)
    {
        fsnd.target = 'w'+ tstmp;
    }
    else
    {
        fsnd.target = "_blank";
        
    }
    disablethem1(false);
    phase = 0;
   visual(fsnd);
 fsnd.submit();
}
function syntax1()
{
   setv(0,8, textmsg[1318]);
}
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] == a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};
function circlebg(n,k)
{
    var m = Math.round(n/2 + 3) ;
    return "<div style=\"font-family:arial;font-weight:700;width:" + (2*m) + "px;height:" + 
            (2*m)  + 
            "px;border-radius:" + m + "px;font-size:" + n + "px;color:#ddcc11;line-height:" + (2*m) + "px;text-align:center;background-color:" + IBGCOLOR + "\">"  + k + "</div>";
}

 
var h = null;
var h0 = null;
if (numRows>0) 
{
    var aw = mat[0][9];
    
    h0 = new Hwtake("prev", mat[0][8], aw, '', mat[0][17], mat[0][3],-1);
}

function guideline()
{
    var grader6 = retrv(0,6);
    var typecodes = "mbs";
    var sels = textmsg[1333].split(/@/);
    var seltype = "";
    for (var q = 0; q < sels.length; q++)
        seltype += "<options value=" + typecodes[q] + ">" + sels[q] + "</option>";
    var aw = retrv(0,9);
    
    h = new  Hwtake("prev", retrv(0,8), aw, '', retrv(0,17), retrv(0,3));
    if (holdvalues['0_20']!=null && holdvalues['0_20']!='')
        h.parseTimequota(holdvalues['0_20']);
    else 
        h.parseTimequota(mat[0][20]);
    var ww = 0;
    if (layout == 'h')
        ww = ele(0,8).offsetWidth -40 + ele(0,9).offsetWidth;
    else
        ww = ww = ele(0,8).offsetWidth-40;
    var w1 = Math.round(ww*0.6);
     let graders = grader6.split(/[ ]*,[ ]*/);
    var w2 = ww - 55 - w1-38;
    if (graders.length>1) {w1-=45;w2 -=45;}
    var tx = "<table id=contentid cellspacing=1 cellpadding=0 width=" + (ww) + " bgcolor=" + DBGCOLOR +">";
    var qns =   h.quesnums.concat(h.answnums).unique().sort(function(a,b){return parseInt(''+a)-parseInt(''+b);});
    for (var i=0; i < qns.length; i++)
    {
        var qq,aa;
        var j1=0; for (; j1 < h.quesnums.length && h.quesnums[j1]!=qns[i]; j1++);
        if (j1 < h.quesnums.length) 
        {
            qq =  h.questarr[h.quesnums[j1]];
            if (qq == null)  qq = '';
        }
        else {j1=-1;qq = "";}
        var hh = qq.replace(/[^\n]/g,'').length;
        var j2=0; for (; j2 < h.answnums.length && h.answnums[j2]!=qns[i]; j2++);
         if (j2 < h.answnums.length) 
         {
             aa =  h.answqrr[h.answnums[j2]];
             if (aa == null) aa = '';
         }
         else {j2=-1;aa = "";} 
         var hh1 = aa.replace(/[^\n]/g,'').length;
         if (hh1 > hh) hh = hh1;
         hh++;
         var pp = h.ptlist[qns[i]];
         if (pp == null) {pp = '1';h.ptlist[qns[i]] = 1;}
         if (hh < 4) hh = 4;
         
         var timequote = h.timequota[qns[i]];
         var graderv = h.graderbyquestion[qns[i]];
         if (graderv == null || graderv == '' || grader6.indexOf(graderv)<0)
         {
             graderv = grader6.replace(/,.*$/,"");
         }
         if (timequote == null) 
         { 
             var rr = new RegExp("\n[a-z][^a-z]", "i");
             if (rr.exec(qq)!=null) 
                timequote = '3';
             else if (qq.indexOf('_____')>0)
                timequote = '4'; 
             else
                timequote = '20';
             h.timequota[qns[i]] = parseInt(timequote);
         }
         let graderstr = "";
        
         if (graders.length>1)
         {
             graderstr = "<td valign=top><select multiple size=4 id=grader" + i 
                     + "  style=\"margin:0px 0px 0px 0px;border:1px #b0b0b0 solid\"      onchange=updatequota(" + qns[i] + ",this,'g') >";
              
             for (let jj = 0; jj < graders.length; jj++)
             {
                 graderstr += '<option ' + (graderv.indexOf(graders[jj])>=0?' selected ':' ') + ' value="' + graders[jj] + '">'+  graders[jj] + "</option>";
             }
             graderstr += "</select></td>";
         }
         else
         {
              graderstr = "<td width=0><input type=hidden id=grader" + i  + ' value="' + graderv + '" ></td>';
           
         }
         var twowords = textmsg[1694].split(/@/);
        tx += "<tr><td valign=top align=center width=80  style=\"border:0px #909090 solid;border-radius:3px;padding:0px 0px 0px 0px\"><table cellspacing=0 cellpadding=0><tr><td   align=left >" +circlebg(20,qns[i]) +  "</td><td></td></tr>"
              + "<tr><td  valign=top align=left style=background-color:" + IBGCOLOR +";color:#DDCC11;border-top-left-radius:3px;border-bottom-left-radius:3px ><nobr>" + twowords[0] + "</nobr></td><td style=background-color:" + TBGCOLOR +";border-top-right-radius:3px;border-bottom-right-radius:3px><input name=pts" + i + " style=\"background:" + TBGCOLOR +";width:25px;border:1px #b0b0b0 solid;text-align:right\" onchange=updatep(" + qns[i] + ",this) value=" + pp + "></td></tr>"
               + "<tr height=3px><td colspan=2></td></tr><tr><td style=background-color:" + IBGCOLOR +";color:#DDCC11;border-top-left-radius:3px;border-bottom-left-radius:3px  ><nobr>" +  twowords[1] + "</nobr></td><td style=background-color:" + TBGCOLOR +";border-top-right-radius:3px;border-bottom-right-radius:3px ><input id=quota" + i + " rows=" + hh + "   style=\"margin:0px 0px 0px 0px;overflow:hidden;width:25px;border:1px #b0b0b0 solid;text-align:right\"      onchange=updatequota(" + qns[i] + ",this) value=\"" + timequote + "\" ></td></tr>"
               + "</table></td><td ><textarea   onkeydown=\"if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}\"     id=ques" + i + " rows=" + hh + "     style=\"margin:0px 0px 0px 0px;overflow:hidden;width:" + w1 + "px;border:1px #b0b0b0 solid\" onfocus=movetool("+j1 +",this," + qns[i] + ") onchange=updateq("+j1 +"," + qns[i] + ",this)>" + qq + "</textarea></td>" 
               +   "<td ><textarea   onkeydown=\"if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}\"    id=answ" + i + " rows=" + hh + "     style=\"margin:0px 0px 0px 0px;overflow:hidden;width:" + w2 + "px;border:1px #b0b0b0 solid\"  onfocus=movetool("+j2 +",this," + qns[i] + ",1)  onchange=updatea("+j2 +"," + qns[i] + ",this)>" + aa + "</textarea></td>"
               + "<td>" + graderstr + "</td></tr>";
       //+ "<tr><td  valign=top align=center>" + textmsg[1333] + "<br><select name=type" + i + " style=\"width:25px;border:1px #b0b0b0 solid;text-align:right\" onchange=updatet(" + qns[i] + ",this)  >" + seltype.replace(new RegExp("value=" + h.qtypes[qns[i]]),"value=" + h.qtypes[qns[i]] + " selected ")  + "</select></td></tr>";
    }
        let graderstrN = "";
      
         if (graders.length>1)
         {
             graderstrN = "<td valign=top><select multiple size=4 id=grader" + max(qns)
                     + "  style=\"margin:0px 0px 0px 0px;border:1px #b0b0b0 solid\"      onchange=updatequota(" + (max(qns)+1) + ",this,'g') >";
             for (let jj = 0; jj < graders.length; jj++)
             {
                 graderstrN += '<option value="' + graders[jj] + '" selected >'+  graders[jj] + "</option>";
             }
             graderstrN += "</select></td>";
         }
         else
         {
              graderstrN = "<td width=0><input type=hidden id=grader" + i  + ' value="' + graderv + '" ></td>';
           
         }
    tx += "<tr><td valign=top align=center  style=\"border:0px #909090 solid;border-radius:3px;padding:0px 0px 0px 0px\"><table cellspacing=0 cellpadding=0><tr><td>" + circlebg(20,max(qns)+1)  + "</td><td></td></tr>"
          + "<tr><td  valign=top align=left   style=background-color:" + IBGCOLOR + ";color:#DDCC11 ><nobr>" + twowords[0] + "</nobr></td><td><input name=pts" + (i+1) + " style=\"width:25px;border:1px #b0b0b0 solid;text-align:right\" onchange=updatep(" + (max(qns)+1) + ",this) value=10 ></td></tr>"
          + "<tr height=3px><td colspan=2></td></tr><tr><td    style=background-color:" + IBGCOLOR + ";color:#DDCC11  ><nobr>" +  twowords[1] + "</nobr></td><td><input id=quota" + (i+1) + " rows=5  style=\"margin:0px 0px 0px 0px;overflow:hidden;width:25px;border:1px #b0b0b0 solid;text-align:right\"   value=3   onchange=updatequota(" + (max(qns)+1)  + ",this)></td></tr>" 
                
          + "</table></td><td ><textarea   onkeydown=\"if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}\"     id=ques" + (i+1) + " rows=5   style=\"margin:0px 0px 0px 0px;overflow:hidden;width:" + w1 + "px;border:1px #b0b0b0 solid\"  onfocus=movetool(-1,this," + (max(qns)+1) + ")   onchange=updateq(-1," + (max(qns)+1) + ",this,1)></textarea></td>" 
         + "<td  ><textarea   onkeydown=\"if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}\"    id=answ" + (i+1) + " rows=5  style=\"margin:0px 0px 0px 0px;overflow:hidden;width:" + w2 + "px;border:1px #b0b0b0 solid\"  onfocus=movetool(-1,this," + (max(qns)+1)  + ",1)  onchange=updatea(-1," + (max(qns)+1)  + ",this,1)></textarea></td>"
          + "<td>" + graderstrN + "</td></tr>";
        
      //  + "<tr><td  valign=top align=center>" + textmsg[1333] + "<br><select name=type" + i + " style=\"width:25px;border:1px #b0b0b0 solid;text-align:right\" onchange=updatet(" + (max(qns)+1) + ",this)  ><option value=\"\"> </select>" + seltype  + "</select></td></tr>";
    tx += "<tr><td valign=top align=center><img onclick=addanew(this.parentNode.parentNode)  style=cursor:pointer src=\"image/addopt.png\" ></td><td colspan=3  align=center>";
    if (needexample())
        tx += "<input type=button class=GreenButton  style=\"" + butborderstyle + ";font-weight:700;width:" + leftbutwidth +"px;overflow:hidden;border:1px blue outset;color:white;font-family:" + defaultfontfamily + ";font-wight:700;cursor:pointer\" value=\"" + textmsg[1322] + "\" onclick=\"example()\" >";
    tx += "<input type=button class=OrangeButton  style=\"" + butborderstyle + ";font-weight:700;width:" + leftbutwidth +"px;overflow:hidden;border:1px blue outset;color:white;font-family:" + defaultfontfamily + ";font-wight:700\" value=\"" + textmsg[225] + "\" >";
    tx += "<input type=button class=BlueButton  style=\"" + butborderstyle + ";font-weight:700;width:" + leftbutwidth +"px;overflow:hidden;border:1px blue outset;color:white;font-family:" + defaultfontfamily + ";font-wight:700;cursor:pointer\" value=\"" + textmsg[408] + "\" onclick=\"updatepoints();myws1('preview.jsp',0,this)\" >";
    
    tx += "</td></tr></table>";
    var xx;
    if (needexample())
    {
         xx = "<input type=button class=GreenButton  style=\"" + butborderstyle + ";font-weight:700;width:" + leftbutwidth +"px;overflow:hidden;border:1px blue outset;color:white;font-family:" + defaultfontfamily + ";font-wight:700\" value=\"" + textmsg[1322] + "\" onclick=\"example()\" id=examplebtn >";
    }
    else
    {
         xx = "<input type=button class=GreenButton  style=\"" + butborderstyle + ";font-weight:700;width:" + leftbutwidth +"px;overflow:hidden;border:1px blue outset;color:white;font-family:" + defaultfontfamily + ";font-wight:700\" value=\"" + textmsg[17] + "\" onclick=\"showrules(this)\"  id=examplebtn>";
    } 
    xx += "<input type=button class=OrangeButton  style=\"" + butborderstyle + ";font-weight:700;width:" + leftbutwidth +"px;overflow:hidden;border:1px blue outset;color:white;font-family:" + defaultfontfamily + ";font-wight:700\" value=\"" + textmsg[225] + "\" >";
    xx += "<input type=button class=BlueButton  style=\"" + butborderstyle + ";font-weight:700;width:" + leftbutwidth +"px;overflow:hidden;border:1px blue outset;color:white;font-family:" + defaultfontfamily + ";font-wight:700\" value=\"" + textmsg[408] + "\" onclick=\"updatepoints();myws1('preview.jsp',0,this)\" id=\"prevbtn\" >";
    
    var titlestr = "<table width=100% ><tr><td width=50%>" + labels[8] +  "</td><td width=0% >" + xx + "</td><td width=50%>" + labels[9] + "</td>" + (graders.length>1?("<td width=0%>" + labels[6] + "&nbsp;&nbsp;&nbsp;</td>"):"") + "</tr></table>"; 
    
    myprompt(tx, null,null, titlestr);
    var xy = findPositionnoScrolling(ele(0,8));
    promptwin.style.top = (xy[1]-30) + 'px';
    promptwin.style.left =  xy[0] + 'px';
    
    document.getElementById('contentid').parentNode.style.backgroundColor = DBGCOLOR;
    document.getElementById('contentid').parentNode.parentNode.parentNode.style.backgroundColor = DBGCOLOR;
    promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].onclick = function()
     {
         if (typeof(activeeditingbox)!='undefined')
         activeeditingbox = null;
         var p = document.getElementById("panel");
         if (toolbarsparent != p.parentNode)
         {
             p.style.width = null;
             p.style.position = 'static';
             toolbarsparent.appendChild(p);
             if (typeof(holdtoolbartable)!='undefined' && holdtoolbartable!='')
                toolbarsparent.innerHTML =  holdtoolbartable;
             var zw = document.getElementById('movetool');
             if (zw!= null) document.body.removeChild(zw);
         }
         document.getElementById('guidebtn').disabled = false;
         document.getElementById('guidebtn').style.color="white";
         wyewygstatus = false;
         var k=0;
         var put = null;
         for (; (put = document.getElementById('quota' + k))!=null; k++)
         {
             var xx = '' + put.onchange;
             xx = xx.replace(/this/,'document.getElementById(\'quota' + k + '\')').replace(/.*\{/,'').replace(/\)[^\)]+$/,')');
              
             try{ eval(xx);}catch(e1){ }
         }
         closeprompt();
         //document.getElementById('guidebtn').innerHTML = textmsg[1319];
      };
    document.getElementById('guidebtn').disabled = true;
    document.getElementById('guidebtn').style.color="#FFBBBB";
    //document.getElementById('guidebtn').onclick=example;
    //document.getElementById('guidebtn').innerHTML = textmsg[1322];
    var p = document.getElementById("panel");
    if (toolbarsparent == null)
    toolbarsparent = p.parentNode;
    p.style.position = 'static';
    var sm = 0;
    var feles = p.childNodes;
    for (var j=0; j < feles.length; j++)
    {
        if (feles[j].tagName.toLowerCase() == 'input' &&
        (feles[j].type.toLowerCase() == 'button' || feles[j].type.toLowerCase() == 'text' || feles[j].type.toLowerCase() == 'file'))
        {   
            var wd = parseFloat('' + feles[j].offsetWidth);
            if (wd > 100) wd = 100;
            sm  = sm + wd;
           
        }
    }
    
    if (sm < 300) sm = 300;
    p.style.width = (sm + 20) + 'px';
    document.body.appendChild(p);
    
    
}
function showrules(btn)
{
    var tb = document.getElementById('contentid');
    if (btn.value != textmsg[1357])
    {
         btn.value = textmsg[1357];
        var r = tb.insertRow(0);
        var t = r.insertCell(0);
        t.colSpan = 3;
        t.innerHTML = "<ul><li>" + textmsg[309].replace(/[^\n]+\n/,'').replace(/\n/g, '\n<li>') + "</ul>";
    }
    else
    {
        tb.deleteRow(0);
        btn.value = textmsg[17];
    }
}

function addanew(r)
{
    r.cells[1].appendChild(document.createTextNode(textmsg[1593]));
}
 
function max(arr)
{
    if (arr== null || arr.length == 0) return 0;
    var m = arr[0];
    for (var j=1;j < arr.length;j++)
        if (m < arr[j]) m = arr[j];
    return m;
}
var graderbyquestionopened = false;
function updatequota(qn, txt, timeorgrader)
{
    if (txt==null) return;
    var sm = 0;
    if (null == holdvalues['0_20'])
       h.parseTimequota(mat[0][20]);
    else
       h.parseTimequota(holdvalues['0_20']);
    var y = '';
    if (timeorgrader==null)
    {
        var k = parseInt(txt.value);
        h.timequota[qn] = k;
    }
    else if (timeorgrader=='g')
    {
        let xx = "";
        for (let kk=0; kk < txt.options.length; kk++)
            if (txt.options[kk].selected)
                xx += '@'+ txt.options[kk].value;
        h.graderbyquestion[qn] = xx===''?"":xx.substring(1);// txt.value.replace(/[ ]+/g, ' ').replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[,| |\.|;|_|\-|\+]/,'@');
    }
    for (var j=0; j < h.quesnums.length; j++)
    {
        var qn = h.quesnums[j];
       
        y += h.quesnums[j] + "," + h.timequota[qn] + "," + h.graderbyquestion[qn]+ ";";
    }
     if (h.timequota[qn]+''!='NaN')
  
    holdvalues['0_20'] = y.replace(/;$/,'');
    valuechanged[0] = true;
   
}

function updatep(qn,tx)
{
    var x = parseInt(tx.value);
    var d = x - h.ptlist[qn];
    h.ptlist[qn] = x;
    var y = parseFloat(retrv(0,12)) + d;
    setv(0,12,''+y);
    holdvalues['0_12'] = ''+y;
    updatepoints();
}
var qtypes = [];
function updatet(qn, sel)
{
    h.qtypes[qn] = sel.options[sel.selectedIndex].value;
    qtypes[qn] = h.qtypes[qn];
    updatepoints();
}


function updatepoints()
{
    var qns = h.quesnums.concat(h.answnums).unique();
    var parse = new CSVParse(retrv(0,17), "|", ",", ";");
    
    var mm = parse.nextMatrix();
    for (var j=0; j < mm.length; j++)
    {
        var x2 = h.ptlist[mm[j][0]];
        if (x2!= null) mm[j][1] = x2;
         
        if (mm[j].length == 3) 
        {
            mm[j][3] = mm[j][4] = '0'; 
        }
    }
    var xx = ''; var rw;
    if (isNaN(mm[0][0]))
     for (j=0; j < mm[0].length; j++)
     {    
         xx += mm[0][j];
         if (j < mm[0].length-1)
             xx += ",";
         else
             xx += ";"; 
     }
      
    for (j=0; j < qns.length; j++)
    {
        var k = qns[j];
        var l=0; for (; l < mm.length && k!=mm[l][0]; l++);
        if (l == mm.length)
            xx += k + ",1,,0,0";
        else
        {
            xx += k + "," + mm[l][1] + ",|" + mm[l][2] + "|," +  mm[l][3] + "," +  mm[l][4] + ";";
            
        }
    }
    setv(0, 17, xx); 
    holdvalues['0_17'] = xx;
    valuechanged[0] = true;
}
var editingquestionnumber = -1;
function updatea(j, qn, ta, mr)
{
     
    if (j!=-1) 
    {
        h.answqrr[qn] = ta.value;
    }
    else
    {
        if (h.answqrr== null) h.answqrr = [];
        h.answqrr[qn] = ta.value;
        h.answnums[h.answnums.length] = qn;
        
    }
    var x = '';
    for (j = 0; j < h.answnums.length; j++)
        x += "\n\n" + h.answnums[j] + ". " + h.answqrr[h.answnums[j]].replace(/[ |\n|\r]+$/g,'').replace(/^[ |\n|\r]+/g,'');
    
    setv(0,9, x);
    valuechanged[0] = true; 
    if (mr!= null) 
    {
        closeprompt();
        guideline();
    }
     
}
var editingright = null;
var editingmn = null;
var editingtb = null;
function movetool(mn,ta, qn, right)
{
    if (wyewygqn >= 0) return;
    editingright = right;
    editingquestionnumber = qn;
    editingmn = mn;
    editingtb = ta;
    if (wyewygstatus == true)
    {
        wyewygstatus = false;
        wyewyg(ta);
        return;
    }
    var p = document.getElementById("panel");
    var xy = findPositionnoScrolling(ta);
    var z = document.getElementById('movetool');
    associatedtxt = ta;
    if (z == null)
    {
        z = document.createElement('div');
        z.id = 'movetool';
        document.body.appendChild(z);
        var wi = (p.offsetWidth + 4);
        if (wi < 530) wi = 530;
        z.style.cssText = 'z-index:21;position:absolute;left:' + xy[0] + 'px;top:' + (xy[1] - 28) + 'px;width:'+ wi + 'px;border-radius:3px';
        z.appendChild(p);
    }
    else
    {
        z.style.left =  xy[0] + 'px';
        z.style.top =  (xy[1] - 28) + 'px';
        z.appendChild(p);
        z.style.zIndex = 21;
    }
    
    z.style.width = (p.offsetWidth + 4) + 'px';
    if (right!= null)
    {
        var pw = p.offsetWidth;
        if (typeof(latexhintbar)!='undefined')
            pw = (latexhintbar.length + 1)*31;
        var lt = xy[0] + ta.offsetWidth - pw - 4;
        if (lt> xy[0]) 
            lt = xy[0];
        z.style.left = lt  + 'px';  
    }
    associatedtxt = ta;
    if (typeof(textareatobesearch) != 'undefined')
    {
        textareatobesearch = ta;
    }
}

function updateq(j, qn, ta, mr)
{
    if (j!=-1) 
        h.questarr[qn] = ta.value;
    else
    {
        h.questarr[qn] = ta.value;
        h.quesnums[h.quesnums.length] = qn;
    }
    var x = h.header0.replace(/<[^>]+>/g,'');
    for (j = 0; j < h.quesnums.length; j++)
    {
        x += "\n\n" + h.quesnums[j] + ". " + h.questarr[h.quesnums[j]].replace(/[ |\n|\r]+$/g,'').replace(/^[ |\n|\r]+/g,'');
    }
    setv(0,8, x);
    valuechanged[0] = true; 
    if (mr!= null) 
    {
        closeprompt();
        guideline();
    }
    editingquestionnumber = -1; 
}

function syntax()
{
  guideline();
}
function needexample()
{
    var b1 =  (retrv(0,8).length > 20 || retrv(0,9).length > 20 ) ;
    var b2 = retrv(0,8) != textmsg[1318];
    var b3 = retrv(0,8) != 'Click Help to see the instruction of make assignments';
    return !b1 || !b2 || !b3;
}

function example()
{
     if (needexample())
     {
         setv(0,8, textmsg[1326].replace(/\n([1-9]+)/g, "\n\n$1") + "\n\n16.$\\frac{d}{dx}\\int_0^{x^2}f(t)dt=$\na.$f(x)$\nb.$f(x^2)$\nc.$xf(x^2)$\nd.$2xf(x^2)$");
         setv(0,9, "1.b\n2.d\n3.a\n4.a\n5.c\n6.c\n7.a\n8.c\n9.b\n10.c\n11.b\n12.a\n13.c\n" +  textmsg[1327] + "\n16.d");
         closeprompt();
         guideline();
     }
}
function previewdoc(tt)
{
 var which = "answer";
 if (tt == 0) which = "des";
 openit("assigndoc.jsp&assignname=" + retrv(0,0) + "&option="+which);
}

var refresh = false;
function fresh()
{
 if (numRows <1) return;
 refresh = true;
 NUMROWS = 1;
 setaction(1);
}
function openGet(url,wn,opt)
{
    var j = url.indexOf("?");
    var x = url.substring(j+1).split(/&/);
    x[x.length] = "securitytoken=" + securitytoken;
    var fm = document.createElement("form");
    document.body.appendChild(fm);
    var fs = ",";
    for (var i=x.length - 1; i >= 0; i--)
    {
        var nm = x[i].replace(/=.*/,'');
        if (fs.indexOf("," + nm + ",") >= 0 ) continue;
        fs += nm + ",";
        var e = document.createElement("input");
        e.name= nm;
        e.type = 'hidden';
        e.value = x[i].replace(/[^=]+=/,'');
        
        fm.appendChild(e);
    }
     
    fm.name = "fGet";
    fm.method = "POST";
    
    formnewaction(fm, url.substring(0,j));
    var hnd = open("", wn, opt);
    fm.target = wn;
   visual(fm);
 fm.submit();
    document.body.removeChild(fm);
    
}
function opentool()
{
   // disablethem2(true);
     openGet("DataTable?rdap=courseservice&extraline=3&exbut=cp&which=editing&course=" + defaultRecord[10] +"&coursetitle=" + title +"&onsaved=4&wording=" + textmsg[485] +"&subdb=" + subdb, "opentool", "toolbar=0,menubar=0,left=100,top=100,width=400,resizable=1");
   // disablethem2(false);
}

function disablethem2(b)
{
   for (var jj = fsnd.elements.length-1; jj>=0; jj--)
 if (fsnd.elements[jj].name != 'course' && 
     fsnd.elements[jj].name != 'rdap' && 
     fsnd.elements[jj].name != 'which' && 
     fsnd.elements[jj].name != 'couretitle' && 
     fsnd.elements[jj].name != 'wording' && 
     fsnd.elements[jj].name != 'onsaved' && 
     fsnd.elements[jj].name != 'subdb'
 )
 {
     fsnd.elements[jj].disabled = b;
 }
}

function disablethem1(b)
{
for (var jj = f1.elements.length-1; jj>=0; jj--)
 if (f1.elements[jj].name != 'course' &&
   f1.elements[jj].name != 'subfolder' &&
   f1.elements[jj].name != 'name' &&
  f1.elements[jj].name != 'File')
  { f1.elements[jj].disabled = b;}
 
}

function disableAreas(afm, b)
{
 for (var i = 0; i < mm; i++)
 if (asso[i] != null && asso[i] !=afm)
 asso[i].disabled = b;
 ele(0,8).disabled = b;
 ele(0,9).disabled = b;
}


if (parent == window || parent.frames.length == 1)
{
 window.resizeTo(800,640);
 window.moveTo(0,0);
 resizeCont();
}

function testmultitest()
{
 myws(ele(0,8),'preview.jsp',0);
}
function applyoptions()
{
 if (numRows>0){ NUMROWS=1;setaction(1);}
}



if (typeof (f1.submit21) != 'undefined')
{
 if (numRows>0)
 f1.submit21.style.visibility = (mat[0][4]=='0')?"hidden":"visible";
 else
 f1.submit21.style.visibility =  "hidden";
}
//defaultRecord[16] = timeformat;
//mat[0][16] = timeformat;

function aa(){ fsnd.encoding = "multipart/form-data"; return true;}

if (mm > 0) makeasso();
var helpstr = textmsg[95];
function makehelpstr(t)
{
hintstr = helpstr.replace(/<tr.*$/,'').split("\n");
for (j=0; j < numCols; j++)
{
 var k = 0; for (; k < hintstr.length && hintstr[k].toLowerCase().replace(/ /g,'').indexOf(fields[j].toLowerCase()+":")!=0 &&  hintstr[k].toLowerCase().replace(/ /g,'').indexOf(labels[j].toLowerCase()+":")!=0; k++);
 if (k < hintstr.length){ hints[j] = hintstr[k].replace(/[^:]+:/,'');  }
 else hints[j] = labels[j];
 // hints[j] = "<p class='thehint'>" + hints[j] +" </p>";
}

helpstr  += "<!----></table><br><b><font color=purple>"+textmsg[288]+"</font></b><br><table>"+
 "<tr><td valign=top><nobr><b>"+textmsg[292]+"</b></nobr></td><td>"+textmsg[291]+".</td></tr>"+
 "<tr><td valign=top><nobr><b>"+textmsg[83]+"</b></nobr></td><td>"+textmsg[293]+".</td></tr>"+
 "<tr><td valign=top><nobr><b>"+textmsg[294]+"</b></nobr></td><td>"+textmsg[295]+".</td></tr>"+
 "<tr><td valign=top><nobr><b>HTML </b></nobr></td><td>"+textmsg[296]+".</td></tr>"+
 "<tr><td valign=top><nobr><b>"+textmsg[298]+"</b></nobr></td><td> "+textmsg[297]+"</td></tr>"+
 "<tr><td valign=top><nobr><b>"+textmsg[299]+"</b></nobr></td><td> "+textmsg[300]+"</td></tr></table>"+
 "<br>";
 helpstr  += "<br><br><b><font color=purple>" + textmsg[308]+"</font></b><ul><li>"+textmsg[309].replace(/\n/g,'<li>')+"</ul>";
 helpstr  += "<br><br><b><font color=purple>" + textmsg[1723]+"</font></b><ul><li>"+textmsg[1724].replace(/\n/g,'<li>')+"</ul>";
 helpstr  += "<b><font color=purple>"+textmsg[301]+"</font></b><br><table><tr><td valign=top><input type=button class=GreenButton style=height:" + butheight() +"px;width:" + butwidth('') +"px;font-weight:700;border:1px #b0b0b0 outset\"  value=\""+textmsg[302]+"\" > </td><td> "+textmsg[303]+"</td></tr>"+
 "<tr><td valign=top><input type=button class=OrangeButton style=height:" + butheight() +"px;width:" + butwidth('') +"px;font-weight:700;border:1px #b0b0b0 outset\"  value=\""+textmsg[67]+"\"> </td><td> "+textmsg[304]+"</td></tr>"+
 "<tr><td valign=top><input type=button class=RedButton style=height:" + butheight() +"px;width:" + butwidth('') +"px;font-weight:700;border:1px #b0b0b0 outset\"  value=\""+textmsg[69]+"\"> </td><td> "+textmsg[305]+"</td></tr>";
 
if (mm>0) { helpstr += helpbuttons.replace(/style=/g, 'style=height:' + butheight() + 'px;width:' + butwidth('') + 'px;');}

if (numRows==0)
 helpstr +="</table><br><table><tr><td>" + textmsg[306] + " <a href=\"DataTable?rdap=courseservice&which=editing&exbut=cph&course="+ defaultRecord[10] +"&coursetitle=" +  ZQ[1]  + "&wording=" + textmsg[485]+ "&subdb=" + subdb +"\">" + textmsg[307] +"</a>";
else
 helpstr +="</table><br><table><tr><td>" + textmsg[306] + " <a href=\"DataTable?rdap=courseservice&which=editing&exbut=cph&course="+ mat[0][10] +"&coursetitle=" +  mat[0][15]  + "&wording=" + textmsg[485]+ "&subdb=" + subdb +"\">" + textmsg[307] +"</a>";
//helpstr  += "</table>";
helpstr += "</td></tr>";
}
makehelpstr(1);

var nav5 = null;

 

function aftertool()
{
 myprompt(textmsg[748]);
}
function changethem(u)
{
    var t = findheight()-u;
    ele(0,8).style.height = t  + 'px';
    ele(0,9).style.height = t  + 'px';
    placeit();
}
function setAssoptions()
{
    setv(0,14,assoptions);  
    if (assoptions!=mat[0][14])
    {
        holdvalues['0_14'] = assoptions;
        valuechanged[0] = true;
    }
    
}
var needemail = false;
onsave = "beforesanding()";
var correctedtext = '';
var askedonce = false;

function sumpoints()
{
        var parse = new CSVParse(retrv(0,17), "|", ",", ";");
        var ff = 0;
        var mm = parse.nextMatrix();
       
        if (mm.length > 2)
        {
            var Q = 0;
            var arr = new Array();
            for (var j=0; j < mm.length; j++)
            {
                 
                 if (mm[j][1]!=null && mm[j][1].replace(/ /g,'')!='' && !isNaN(mm[j][1]))
                 {
                     
                     var yy = parseFloat(mm[j][1]);
                     
                     if (''+yy!='NaN')
                     {
                         arr[arr.length] = yy;
                         ff += yy;
                         Q++;
                     }
                      
                 }
                
            }
            
            if ( extract("f") == '0|S' || extract("f") == '')
                setv(0,12,''+ff);
            else
            { 
                arr.sort();
                var str = extract("f").split(/\|/);
                var N = parseInt(str[0]);
                for (var k=0; k < N; k++) ff -= arr[k]; 
                var ff = str[1].replace(/S/g,''+ff).replace(/Q/g,''+Q).replace(/T/g,"0");
                var fv = Math.round(10*evalhat(ff))/10;
                setv(0,12, ''+ fv);
            }
        }
        else if (h!=null && h.quesnums.length > 0)
        {
            if (retrv(0,12)=='') setv(0,12,''+h.quesnums.length);
            var pp = "|Order|,|Points|,|Objective|;";
            for (var j=0; j < h.quesnums.length; j++)
            {
                pp += (j+1) + ",1,;"; 
            }
            setv(0,17,pp);
        }
    else
    {
        ff = parseFloat(retrv(0,12));
        if ( (''+ff=='NaN' || ff < 0.1) ||  retrv(0,12)==''){ setv(0,12,'10');}
    }
}
var missedcode = '';
var needsavefile = false;
var needregrade = false;
function verifyTimesplit()  
{
    if (holdvalues['0_6'] === null) return;
    let grader6 =retrv(0,6);
    let grader61 =  grader6.replace(/,.*$/,'');
    var v = mat[0][20];
    if (holdvalues['0_20'] != null) 
        v = holdvalues['0_20'];
    if (v == null || v === '' || v.indexOf(',') <0)
    {
       holdvalues['0_20'] = null;
       return;
    }v
     
    let vptr = new CSVParse(v, "'", ',',';\n');
    let mt = vptr.nextMatrix(false);
    let xx = '';
    let R = mt.length;
    if (h != null) 
        R = h.questarr.length;
    else 
        R = (new  Hwtake("prev", retrv(0,8), '', '', retrv(0,17), retrv(0,3))).questarr.length;
        
    for (let r = 0; r < R-1; r++)
    {
        if (r < mt.length)
        {
            let yy = '';
            if (mt[r].length <= 2 || mt[r][2] == null)
                yy = grader61;
            else
            {
                let zz = mt[r][2].split(/@/);
                let ww = '';
                for (let kk = 0; kk < zz.length; kk++)
                {
                    if (grader6.indexOf(zz[kk]) >= 0)
                        ww += '@' + zz[kk];
                    else if (ww.indexOf(grader61) < 0)
                        ww += '@' + grader61;
                }
                if (ww === '')
                    ww = grader61;
                else
                    ww = ww.substring(1);
                yy = ww;
            }
            xx += mt[r][0] + "," + mt[r][1] + "," + yy;
     
        } 
         else
            xx += (r + 1) + ',3,' + grader61;
        if (r < R - 2)   
           xx += ';'; 
    }
    if (xx !== mat[0][20]) 
        holdvalues['0_20'] = xx; 
    else
        holdvalues['0_20'] = null;
}
function beforesanding()
{   
    verifyTimesplit();
    let aType = retrv(0,4);
    needeamil = (typeof(holdvalues['0_8']) !='undefined' && holdvalues['0_8']== 1 );
    needsavefile =( typeof(holdvalues['0_8']) !='undefined' && holdvalues['0_8']==1 );
    needregrade = (numRows>0 && (aType == '1' || aType == '3'  || aType == '4' ) 
                             && parseInt(retrv(0,2)) <= (new Date()).getTime()/1000 
                             && (typeof(holdvalues['0_9']) !='undefined' && holdvalues['0_9']==1 
                             || holdvalues['0_14']!= null || holdvalues['0_17']!= null  || holdvalues['0_20']!= null)  );
    
    missedcode = '';
    if ((retrv(0,4)=='2' || retrv(0,4)=='3'))
    {
        var s = retrv(0,14);
        var k = s.indexOf('cd');
       /* if (k < 0)
        {
            s = s.replace(/;$/,'');
            missedcode = Math.round(0.001+Math.random()*10000);
            s += ";cd:" + missedcode;
            setv(0,14,s);
        }
        else if (k+3==s.length)
        {
            missedcode = Math.round(0.001+Math.random()*10000);
            s += missedcode;
            setv(0,14,s);
        }
        else missedcode = '';*/
    }
    document.thisform.rsacode.value = "0";
    seeformat();
    setAssoptions();
    guessedFormat=0;
    
    if ( isNaN(holdvalues['0_13'])) holdvalues['0_13'] = '-1'; 
    backupbeforesave();
}
function seeformat()
{
 validating = '';
 var w = retrv(0,8);
 var fj= '' + guessFormat(w);
 var ff = parseInt(fj);
 var sel = ele(0,3);
 var nowf = '' + sel.options[sel.selectedIndex].value;
 if (fj == nowf) 
 {
     if (nowf == 1 || nowf == 2)
     checkHTML(ele(0,8),true);
 }
 else if(askedonce ==false)
 {
     askedonce = true;
     validating = ' ';
     correctedtext  = checkh(retrv(0,8),true);
     var str =textmsg[77] + ' '+ sel.options[ff+1].text+
             textmsg[78] + ' '+ sel.options[sel.selectedIndex].text;
     if (correctedtext == '')
     {
         myprompt(str +"." +  textmsg[196] + "?",
         null,"changeformat(v," + fj +",0)", "format");
     }
     else
     {
         myprompt(str +"." +  textmsg[196] + "?",
         null,"changeformat(v," + fj +",1)", "format");
     }
 }
  
}
function changeformat(v,j,c)
{
    if (v == false)
    {
       NUMROWS = 1;
       setaction(1);
    }
    else
    {
        ele(0,3).selectedIndex = j+1;
        if (c == 1)
        {
           setv(0,8, correctedtext);
           correctedtext  = checkh(retrv(0,9),true);
           setv(0,9, correctedtext);
           
        }
    }
}
var menuontop = false;

function cellfit()
{
 var mt = document.getElementById("maintable");
 var cws = new Array(4);

 for (var i=0; i < 4;i++)
 {
 if (navigator.appName=='Microsoft Internet Explorer')
 {
 var maxsz = Math.ceil(mt.offsetWidth/4);
 var x1 = mt.rows[0].cells[2*i].offsetWidth;
 var x2 = mt.rows[1].cells[2*i].offsetWidth;
 cws[i] = maxsz - ((x1>x2)?x1:x2);
 }
 else
 {
 cws[i] = mt.rows[0].cells[2*i + 1].offsetWidth;
 }
 if (cws[i] < 70)
 cws[i] = Math.ceil(mt.offsetWidth/8);
 }

 //for (i=0; i < 8;i++) ele(0,i).style.width =  (cws[i%4]-1)  + 'px';
 
}
 
function warnSize() 
{
 var myWidth = 400, myHeight =  16*(2+font_size);
 if (actualleftbutwidth == 0)
     myHeight -= 4*font_size;
 var  div1 =  document.getElementById('titlediv');
  
 if (div1!= null)
 {
    myWidth = div1.offsetWidth  - (actualleftbutwidth==0?0:(actualleftbutwidth-10));
 }
 return [myWidth, myHeight];
}
window.onresize = resizeCont1;
function resizeCont()
{}
function resizeCont1()
{
 var is9 = false;
 if (panelposition == 9)
 {
     is9 = true;
     movepanel(8); 
 }
 var wd = 400;
 var oldw = ele(0,9).offsetWidth; 
 if (layout == 'h')
 {
    wd = 200;
 }
 ele(0,8).style.height =   "300px";
 ele(0,9).style.height =   "300px";
 ele(0,8).style.width =  wd + "px";
 ele(0,9).style.width =  wd + "px";
  
 wd = document.getElementById('titlediv').offsetWidth - (actualleftbutwidth==0?(-25):(actualleftbutwidth));
 if (layout == 'h')
 {
     wd /= 2;
 }
  
 boxheight = findheight();
 ele(0,8).style.width =   (wd-10)  + "px";
 ele(0,9).style.width =   (wd-10)   + "px";
 ele(0,8).style.height =   boxheight + "px";
 ele(0,9).style.height =   boxheight   + "px";
 placeit();
 if (is9) movepanel(9); 
}

function resize1()
{
 cellwidths = new Array(10);
 for (var i=0; i < 8; i++)
 {
 cellwidths[i] = ele(0,i).offsetWidth;
 }
 cellwidths[8] = ele(0,12).offsetWidth;
 cellwidths[9] = ele(0,13).offsetWidth;
 for (i=0; i < 14; i++)
 {
 var el = ele(0,i);
 el.parentNode.style.backgroundColor = TBGCOLOR;
 }

 if (initialhintneed(1))
 {
    var ugentmsg = initialhint(1);
 }
 ele(0,0).focus();
 if (mat[0][10]== null || mat[0][10]=='')
 mat[0][10] = defaultRecord[10];
 setTimeout(resizeCont1,200);

 //movepanel(8);
}

var larningoutcome = null;
function openassess()
{
 if (larningoutcome == null)
 {
     demosuspend();
     postopen("DataText",["rdap","subdb","CourseId","Semester","Sessions","onbegin"],
                     ["assignass",subdb, retrv(0,10),retrv(0,11),retrv(0,5),"44"],  
                      "w" +tstmp);
 }
 else
 openassess1(larningoutcome);
}

function ismulti(x)
{
 var r = new RegExp(/[\r|\n][ |\(]*[a-z][\.| |\)|\]]/i);
 var m = r.exec(x);
 if (m== null) return false;
 var k = m.index+ m.toString().length;
 m = r.exec(x.substring(k));
 return (m!= null);
}
var zIndex = 2;
var peeledheader;

function passbacktonext()
{
    var x = Innergrid.currentth.parentNode.parentNode;
    if (x.tagName.toLowerCase() != 'table') x = x.parentNode;
    var nm = Innergrid.currentm;
    var nn = Innergrid.currentn;
    if (Innergrid.currentn < 2) nn++;
    else
    {
        nn = 0;
        nm++;
        if (nm == x.rows.length) nm = 1;
    }
    Innergrid.editthiscell(x.rows[nm].cells[nn], 0, 17);
}
var mt;
function openassess1(outcome)
{  
 if (demokeyframen > 0 && demohandle==null)
 {
     demoresume();
 }
 var dive = document.getElementById("assessinfo");
 if (dive!= null)
 {
 dive.style.zIndex = ++zIndex;
 return;
 }
 larningoutcome = outcome;
 var v17 = retrv(0,17);
  
 
 var v = (v17 != null && v17 !='')? v17:defaultRecord[17]; 
  
 var kk = v.indexOf(";");
  
 var header = v.substring(0,kk);
 peeledheader = header;
  
 v = v.substring(kk+1);
  
 var parse = new CSVParse(v, "|", ",", ";");
 mt = parse.nextMatrix(false);
 v = '';
 for (var ii=0; ii < mt.length; ii++)
 {
     if (mt[ii].length < 3) continue;
     if (ii > 0) v+=";";
     v += mt[ii][0] + "," + mt[ii][1] + ",|" + mt[ii][2] + "|"
 }
 parse = new CSVParse(v, "|", ",", ";");
 var p1;
 var y = [];
  
 while ( (p1 = parse.nextRow()) != null)
 {
     y[p1[0]] = p1;
 }
 var qtxt = retrv(0,8);
 var rorn =   (qtxt!=null && qtxt.indexOf("\n") < 0  &&  qtxt.indexOf("\r") >= 0) ? '\r':'\n';  
 if (this.rorn == '\r')
   qtxt = "\r" + qtxt.replace(/\t/g, '   ').replace(/\r[ ]+\r/g, '\r\r').replace(/^[ |\r]+/, '');
 else
   qtxt = "\n" + qtxt.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\t/g, '   ').replace(/\n[ ]+\n/g, '\n\n').replace(/^[ |\n]+/, '');
 var delimiter = "[0-9]+[ |:|\\.|\\)|\\]";
 var langsep = textmsg[1332].replace(/\./,'').replace(/\]/,'').replace(/\)/,'').replace(/:/,'').replace(/\[/,'').replace(/\(/,'').replace(/\\/,'').replace(/(.)/g, "|$1") + "]";
    
 var r = new RegExp( "[" +  rorn + "]+" +  delimiter + langsep  );
  
 var k = 0, j=0;
  
 var  zz = null, n = null, n1=null; 
 while (true)
 {
     var m = r.exec(qtxt.substring(k));
     if (m== null)
     {
         zz = ismulti(qtxt.substring(k));
     }
     else
     {
         var ms = m.toString();
         n1 = ms.replace(/[^0-9]/g,'') ;
         zz = ismulti(qtxt.substring(k,k+m.index));
         k  =  k + m.index + ms.length;
     }
     if (n!= null  )
     {
         if (y[n] == null)
         y[n] = [n, '1', ''];
     }
     if (m == null) break; 
     n = n1;
 }
  
 v = "";
 var p;
 for (  p  in y)
 {
     p1 = y[p]; 
     if (v!='') v += ";";
     for (j=0; j < p1.length; j++)
     {
         if (p1[j]== null) p1[j] = '';
         v += parse.compose(p1[j]);
         if (j < p1.length - 1)
             v += ",";
     }
 }
 
 v = v.replace(/;[ |,]+;/g,';'); 
 v = textmsg[1305]+ ";" + v;
 v = v.replace(/;$/,'');
 let e17 = ele(0,17);
 if (e17 === null)
{
   e17 = document.createElement('input');
   e17.type = 'hidden';
   e17.name = fields[17];
   ele(0,10).parentNode.appendChild(e17);
}
 
 e17.value = v;
 mat[0][17] = v;
 holdvalues['0_17'] = v;
 Innergrid.editstruct = false;
 v = Innergrid.makeinnertable(v ,0,17,true,1);
 var ass = null;
 var gp = [];
 if (leftwindow!=null && window==parent.frames[1] && typeof(leftwindow.getass)!='undefined')
 {    
     ass = new CSVParse(leftwindow.getass(),'|',",",";","@");  //"|", ",", ";");
     var mr = null;
     while ( (mr = ass.nextMatrix())!= null) 
     for (var i1=0; i1 < mr.length; i1++)
     {
        var x = mr[i1][2];
        if (x==null || x.replace(/[0-9|,]/g,'')!='')continue;
        var xs = x.replace(/ /g,'').split(/,/);
        for (var l=0; l < xs.length; l++)
        {
            if (gp[xs[l]] == null)
                gp[xs[l]] = 1;
            else
                gp[xs[l]]++;
        }
     }
 }
 
 
 var outcomes = outcome.replace(/\n[ ]+\n/g, '\n\n').replace(/^[\s]+/,'').split(/[\n]+/);
 var outv = "<table cellspacing=1 cellpadding=3 border=1 style=\"border-collapse:collapse;border-color:#aaaaaa;\" ><tr style=\"background:" + beheading +"\"><td valign=top>" +   ZQ[1]+ " " + textmsg[1014] + '</td><td align=right valign=top>#</td></tr>';
 var ii=0;
 
 for (i=0; i < outcomes.length; i++)
 {
 var z = outcomes[i].replace(/^[ ]+/,'').replace(/[ ]+$/,'');
 if (z=='') continue;
 ii++;
 var z1 = z.replace(/^[0-9]/, '');
 if (z==z1) z = (ii) + ". " + z;
 var nq = z.replace(/[^0-9].*/,'');
 var nn = gp[nq];
 
 var cl='#990000';
 if (nn==null) nn = 0;
 else if (nn<3) cl = '#333300';
 else if (nn>=3) cl ='green';
 outv += '<tr><td align=left>'+ z + '</td><td  align=right valign=top><font color='+cl +'>' + nn + '</font></td></tr>';
 if (i == outcomes.length-1) outv +="</table>";
 }
 dive = document.createElement("div");
 dive.id="assessinfo";
 var xy = findPositionnoScrolling(ele(0,9));
 if (layout=='h')
 {
 xy[1] -= 8 + font_size;
 }

 var topp = xy[1]+2;
 var otherone = document.getElementById("optioninfo");
  
 if (otherone!= null) topp += otherone.offsetHeight ;
  dive.style.cssText="border-radius:3px;position:absolute;color:#000000;border:1px #BBBBBB outset;padding:0px;zIndex:20;left:" + (xy[0]-30) +"px;top:" + topp + "px;z-index:" + (++zIndex);
    ;
 var widthw = ele(0,9).offsetWidth + 25;
 var pbgcolor = "#FFEECC";
 if (typeof(DBGCOLOR) != 'undefined') pbgcolor = DBGCOLOR;
  var parse = new CSVParse(retrv(0,17), "|", ",", ";");
  var mm = parse.nextMatrix();
  outv =  "<table style=\"border-radius:3px;\"  width=" + widthw +" bgcolor=" + pbgcolor  +" cellspacing=1 cellpadding=3><tr><td width=100% colspan=2><table  width=100% cellpadding=3 cellspacing=0><tr  valign=middle  style=\"background:" + gradientbg  + "\"  valign=middle ><td   align=left valign=middle ><img  width=" + (font_size+6)+
  " style=\"margin:0px 0px 0px 0px;border-radius:" + Math.round(font_size/2+3) + "px;cursor:pointer\" src=\"image/icon/smalls00.png\" onclick=\"updateassess();assessopened=false;\"></td><td width=100% id=\"assessheader\"  align=center valign=middle><font color=DDCC11><b>"+
  textmsg[1012] +"</b></font></td></tr></table></td></tr><tr><td   valign=top>"+
   v.replace(/<table /,'<table id="assessnum" width=180')+
  "<input id=landerbug style=background-color:" + DBGCOLOR + ";height:1px;width:1px;border:0px type=button onfocus=passbacktonext() value=\"\"><div style=\"color:#111111;border:1px #777777 solid;border-radius:0px;width:178px;font-size:12px\"><ul style=\"margin:0px 0px 0px 8px;padding: 3px;\">" + (v.length>2500?'':("<li style=\"margin:0px 0px 0px 6px;padding:0px;\">"+ textmsg[1666].replace(/<b>/,''))) + "<li style=\"margin:0px 0px 0px 6px;padding: 0px;\">" + textmsg[1573].replace(/\n/,'<li style="margin:0px 0px 0px 6px;padding: 0px;"># ') + "</ul></div>"+
  "</td><td   valign=top align=left style=background-color:" + TBGCOLOR +">"
  + outv+ "</td></tr></table>" ;
  dive.innerHTML = outv; 
 document.body.appendChild(dive);
 unifonts(dive, myfontname);
 if (typeof (Drag)!='undefined')
 Drag.init(document.getElementById("assessheader"),dive);
   
 var tbl = document.getElementById('assessnum');
 for (j=0; j < 3; j++)
 tbl.rows[0].cells[j].innerHTML = '<nobr>' + tbl.rows[0].cells[j].innerHTML + '</nobr>';
 //var darr = document.createElement('span');
// darr.innerHTML = '&darr;';
 //darr.style.cssText = 'color:blue';
 var darrf = function(){ 
     let tt, t, i=2, u = document.getElementById('Igd1_1').innerHTML.replace(/<[^<]+>/g,''); 
     while (( t = document.getElementById('Igd' +i + '_1'))!=null && ( tt = document.getElementById('Igd' +i + '_0'))!=null && tt.innerHTML.trim() !=='')
     {
         t.innerHTML =  u;
         i++;
     }
     let w =  (i-1)*parseFloat(u);
     setv(0,12, w.toFixed(0));
     var v17 = retrv(0,17);
     var v = (v17 != null && v17 !=='')? v17:defaultRecord[17]; 
     var kk = v.indexOf(";");
     var header = v.substring(0,kk);
     v = v.substring(kk+1);
     var parse = new CSVParse(v, "|", ",", ";");
     var mtt = parse.nextMatrix(false);
     v = header;
     for (i=0; i < mtt.length; i++)
     {
         v+=";"+  mtt[i][0] + "," + u + ",|" + document.getElementById('Igd' + (i+1) + '_2').innerHTML.replace(/<[^>]+>/g,'') + "|";
     }
     v= v.replace(/,\|\|;/g,",;").replace(/,\|\|$/g,",");
     setv(0,17, v);
     holdvalues['0_17'] = v;
     valuechanged[0] = true;
 };
 let tb0 = document.getElementById('assessnum');
 let cel = document.getElementById('Igd0_1');
 cel.innerHTML = '<nobr>' + cel.innerHTML.replace(/<[^>]+>/g,'') + '&darr;</nobr>';
 cel.style.color='blue';
 cel.onclick = function()
 {
     var tbl = this.parentNode.parentNode;
     darrf();
 };
 document.getElementById('Igd0_2').style.color='blue';
 document.getElementById('Igd0_2').onclick = function()
 {
     var tbl = this.parentNode.parentNode;
     sorttbl(tbl,2); 
 };
 document.getElementById('Igd0_0').style.color='blue';
 document.getElementById('Igd0_0').onclick = function()
 {
     var tbl = this.parentNode.parentNode;
     sorttbl(tbl,0); 
 };
}
function sorttbl(tbl,c)
{
     if (tbl.tagName.toLowerCase()!='table') tbl = tbl.parentNode;
     var v = "";
     var N = tbl.rows.length;
     for (var i=1; i < N ; i++)
     {
         if (i < N - 1)
         for (var j=1; j < N-i; j++)
         {
             if (parseFloat(tbl.rows[j].cells[c].innerHTML) > parseFloat(tbl.rows[j+1].cells[c].innerHTML))
             {
                 for (var k=0; k < 3; k++){
                 var tt = tbl.rows[j].cells[k].innerHTML;
                 tbl.rows[j].cells[k].innerHTML = tbl.rows[j+1].cells[k].innerHTML;
                 tbl.rows[j+1].cells[k].innerHTML = tt;}
             }
         }
         var y = tbl.rows[N-i].cells[2].innerHTML;
         var z = (y=='')?'':'"';
         v =  tbl.rows[N-i].cells[0].innerHTML + "," + tbl.rows[N-i].cells[1].innerHTML + ',' +  z + y + z + (v==''?'':";") + v;
     }
     v = retrv(0,17).replace(/([^;]+;).*/,'$1') + v;
     setv(0,17,v);
     valuechanged[0] = true;
    // "Question|,|Points|,|Map to  Outcome|;1,1,;2,1,;3,1,;4,1,;5,1,;6,1,;7,1,;8,1,;9,1,;10,1,;11,1,;12,1,;13,1,;14,10,;15,10,;16,1,;,,","",""
}
Innergrid.nextelement = function(el){ if (el == ele(0,17)) return document.getElementById('landerbug'); return null;};
Innergrid.prevelement = function(el){ if (el== document.getElementById('landerbug')) return ele(0,17); else return null;};
function closediv(assessinfo)
{
 var dive = document.getElementById(assessinfo);
 if (document.getElementById('percentage') != null)
 setv(counter,13, document.getElementById('percentage').value);
 if (dive!= null)
 document.body.removeChild(dive);
}
function updateassess()
{
Innergrid.leavebox();
let e17 = ele(0,17);
if (e17 == null)
{
   e17 = document.createElement('input');
   e17.type = 'hidden';
   e17.name = fields[17];
   ele(0,10).parentNode.appendChild(e17);
}
e17.value = holdvalues['0_17'];
if (leftwindow!=null && window==parent.frames[1] && typeof(leftwindow.getass)!='undefined')
{
    leftwindow.setass(retrv(0,0),holdvalues['0_17']);
} 
//var xx = retrvtablevalue(document.getElementById('assessnum')).replace(/;[ |,]+;/g,';').replace(/;[ |,]+$/g,'')+';,,';
var xx = retrv(0,17).replace(/;[ |,]+;/g,';').replace(/;[ |,]+$/g,'')+';,,';
xx = xx.replace(/[^;]+/,peeledheader);
setv(0, 17, xx);
holdvalues['0_17'] = xx;
closediv('assessinfo');
valuechanged[0] = true;
sumpoints();
}

function updatepops()
{
 if (document.getElementById('assessinfo') != null)
 {
 Innergrid.leavebox();
 //var xx = retrvtablevalue(document.getElementById('assessnum')).replace(/;[ |,]+;/g,';').replace(/;[ |,]+$/g,'')+';,,';
 var xx = retrv(0,17).replace(/;[ |,]+;/g,';').replace(/;[ |,]+$/g,'')+';,,';
 xx = xx.replace(/[^;]+/,peeledheader);
 setv(0, 17, xx);
 holdvalues["0_17"] = xx;
 valuechanged[0] = true;
 var v = retrv(0,17);

 }
 if (document.getElementById('optioninfo') != null)
 {
 setvalues();
 }
 var atype = retrv(0,4);
  
}

onbegin +=";resize1();resizebut(f1);extraitem();";

function extraitem()
{
    var ff = parseFloat(''+mat[0][13]);
    if (ff > 100 || ff < 0)
    {
        ele(0,13).value = textmsg[1858].replace(/ .*/,''); 
    }
    document.body.style.backgroundImage = 'linear-gradient(var(--bbgcolor),var(--dbgcolor))';
}
var fm = null;

var assoptions = '';
if (numRows>0) assoptions = mat[0][14];
if (assoptions == '' || assoptions == null)
{
    assoptions = "et:0;ff:courier;fs:16;w:1;fw:650;";
    if (numRows>0) mat[0][14] = assoptions;
    else defaultRecord[14] = assoptions;
}
 
var emailtime = 0;

function tryit()
{
 if (setvalues())
 testmultitest();
}

function setback()
{
 if (setvalues())
 {
     closediv('optioninfo');
 }
 
 valuechanged[0] = true;
}

function extract(nm)
{
    var jj;
    if (assoptions == null)
        return null;
    if (assoptions.indexOf(nm + ":") == 0)
    {
        jj = assoptions.indexOf(";", 2);
        if (jj > 0)
            return assoptions.substring(1 + nm.length, jj++);
        return assoptions.substring(1 + nm.length);
    }
    var ii = assoptions.indexOf(";" + nm + ":");
    
    var k = assoptions.indexOf(";cd:");
    var result = null;
    if (ii == -1 || ii > k && k >= 0)
    {
        if (nm.length > 1 || nm == 'f')
            result = "";
    } else  //  ;ip:;cd:;d:;f:100*C/Q;ff:courier;fs:18;fw:650
    {
        jj = assoptions.indexOf(";", ii + 2);
        if (jj == -1 || nm == 'cd')
            result = assoptions.substring(ii + 2 + nm.length);
        else
            result = assoptions.substring(ii + 2 + nm.length, jj);
        if ( nm == 'cd')
        {
            result =result.replace(/^;cd:/,'');
        }
    }
    return result;

}
emailtime = parseInt(extract("et"));
if ('' + emailtime == 'NaN') emailtime = 0; 
 

if (!isnewrecord && mat0==null && emailtime == 0 && parseInt(mat[0][2])*1000 > (new Date()).getTime())
{
    onbegin += ";myprompt('" + textmsg[1590] + "?";
    if (mat[0][4]=='0'||mat[0][4]=='1')
        onbegin +=  "<br> <input type=checkbox name=asattach id=needattach onchange=\"chooseneedattach(this)\"><font color=" + (retrv(0,18)==''&&(mat.length==0||mat[0][18]=='')?'#00AA00':'#AA0000') + ">" + textmsg[1591];
    onbegin += "',null,'if(v)sendnotice()',null);"; 
}
var needattachvalue1 = false;
function chooseneedattach(ck)
{
   needattachvalue1 = ck.checked; 
}
var sourcestr;
function sendnotice(tt)
{
    nullifyall();
    sourcestr = f1.source.value;
    fsavetarget = f1.target;
    var xx = document.location.toString();
    var ix = xx.lastIndexOf("/");
    f1.source.value = (needattachvalue1?1:0) +  xx.substring(0,ix);
    if (tt!= null) f1.source.value += "\n" + tt;
    formnewaction(f1, "follows.jsp?x=assignemail");
    f1.target =    'w' + tstmp;
   visual(f1);
 f1.submit();
    f1.source.value = sourcestr;
}
function usesms()
{
    sourcestr = f1.source.value;
    fsavetarget = f1.target;
    var xx = document.location.toString();
    var ix = xx.lastIndexOf("/");
    f1.source.value = (needattachvalue1?1:0) +  xx.substring(0,ix);
    if (tt!= null) f1.source.value += "\n" + tt;
    formnewaction(f1, "follows.jsp?x=assignsms");
    f1.target =    'w' + tstmp;
    visual(f1);
    f1.submit();
    f1.source.value = sourcestr;
}

function setemailtime(t,err)
{
    if (t>=0)
    {
        emailtime = t;
        assoptions = assoptions.replace(/^et:0/,"et:" + t);
        setv(0,14,assoptions);
    }
    if (t==-1)
        err = err.replace(/.*(<table .*)/i,'$1');
    myprompt(err);
    
}
 
function setcfg(type)
{
     if (assoptions.indexOf(";")!=0)
     assoptions = ";" + assoptions;
      
     var fs = extract("fs");
     var ff = extract("ff");
     if (ff== null || ff =='') ff = defaultfontfamily;
     var fw = extract("fw");
     var emailtime = parseInt(extract("et"));
     for (var i = 0; i < 22; i++)
     {
         fm.fs.options[i] = new Option(""+(10+i), ""+(10+i) );
         if (fs == "" +(10+i))
         fm.fs.selectedIndex = i;
     }
     if ('' + emailtime == 'NaN' || emailtime < 10000000)
         fm.emailtime.value = '';
     else
         fm.emailtime.value = timestr(emailtime); 
     var fns = textmsg[1594].split(/@/);
     var ii = 0;
     for(  i =0; i < fns.length; i++)
     {
         fm.ff.options[i] = new Option(fns[i].replace(/,.*/,''),fns[i]);
         if (ff == fns[i])  ii = i;
     }
     fm.ff.selectedIndex = ii;
     
     fm.fw.checked = (fw=="700");
     if (typeof(fm.w) !='undefined') 
        fm.w.checked = (extract("w")!= null );
     if (typeof(fm.n) !='undefined') 
        fm.n.checked = (extract("n")!= null );
     var tmp = "";
    // if (type > 1 )
     {
         if (typeof(fm.q) !='undefined') 
         fm.q.checked =(extract("q")!= null );
     if (typeof(fm.o) !='undefined') 
         fm.o.checked =(extract("o")!= null );
     if (typeof(fm.m) !='undefined') 
         fm.m.checked =(extract("m")!= null );
     if (typeof(fm.r) !='undefined') 
         fm.r.checked =(extract("r")!= null );
     if (typeof(fm.g) !='undefined') 
         fm.g.checked =(extract("g")!= null );
         tmp = extract("cd");
         if ("" + tmp == "undefined")
         tmp = "";
     if (typeof(fm.cd) !='undefined') 
         fm.cd.value = tmp;
         tmp = extract("ip");
         if ("" +  tmp == "undefined")
         tmp = "";
     if (typeof(fm.ip) !='undefined') 
         fm.ip.value = tmp;
     tmp = extract("fo");
         if ("" +  tmp == "undefined")
         tmp = "";
     if (typeof(fm.fo) !='undefined') 
     {    
         fm.fo.value = tmp;
         if (fm.fo.value=='')
         {
            fm.fo.value = 'e.g. 3<4,6<7<8';
            fm.fo.style.color = '#aaaaaa';
            fm.fo.onfocus = function(){if(this.value=='e.g. 3<4,6<7<8'){this.value = '';this.style.color='black';}}
         }
         fm.fo.onblur = function(){if(this.value==''){this.value = 'e.g. 3<4,6<7<8';this.style.color = '#aaaaaa';}}
         fm.fo.onchange = function(){this.value=this.value.replace(/ /g,'').replace(/[\.|;|:]/g,',');if (this.value.replace(/[<|0-9|,]/g,'')!=''){this.value = 'e.g. 3<4,6<7<8';this.style.color = '#aaaaaa';}}
     }
     
     
     }
     
  
    // if (type>=2) // if m test
     {
         var xx = extract("d");
         if ( xx== null|| xx=='')
         xx = textmsg[1266];
     if (typeof(fm.d) !='undefined') 
         fm.d.value =  xx;
     if (typeof(fm.p) !='undefined') 
         fm.p.checked = (extract("p")!= null );
     }

    // if (type==3 || type==1)  
     {
         tmp = extract("f");
         if ("" + tmp == "undefined")
         {
             if (typeof(fm.f) !='undefined') 
             fm.f.value = "x";
         if (typeof(fm.dr) !='undefined') 
             fm.dr.value = "0";
         }
         else
         {
             tmp = tmp.replace(/C/g,"S");
             i = tmp.indexOf("|");
             if (i==-1)
             {
                 if (typeof(fm.dr) !='undefined') 
                 fm.dr.value="0";
             }
             else
             {
                 if (typeof(fm.dr) !='undefined') 
                 fm.dr.value= tmp.substring(0,i);
             }
             if (typeof(fm.f) !='undefined') {
             fm.f.value = tmp.substring(i+1);
             if (fm.f.value == '') fm.f.value = 'S';
         }
          }
      }
   
}
 

function numberonly(evt)
{
 var e = evt? evt : window.event;
 if(!e) return true;
 var key = 0;
 if (e.keyCode) { key = e.keyCode; } // for moz/fb, if keyCode==0 use 'which'
 else if (typeof(e.which)!= 'undefined') { key = e.which; }
 return (key >= 48  && key <= 57 || key==8);

}

function parseit(txt)
{
 txt.value = txt.value.replace(/ /g, '').toUpperCase();
 if (txt.value == '')
 {
 myprompt( textmsg[865+390] );
 txt.value = "S";
 }
 var num = txt.value.replace(/[T|S|Q| ]/g,'').replace(/[0-9]/g,'').replace(/\-/g, '').replace (/\./g,'').replace(/\+/g,'').replace(/\*/g,'').replace("/",'').replace(/\^/g, "").replace (/\(/g,'').replace(/\)/g,'');
 
 if (''!=num )
 {
 myprompt(num + textmsg[1256]  );
 txt.focus();
 return false;
 }
 txt.value = txt.value.replace(/\s/g,'');
 num = txt.value.replace(/S/g,'3').replace(/Q/g,'2').replace(/T/g,'1');
 if (evalhat(num) == 'NaN')
 {
 myprompt(txt.value + "  is invalid");
 txt.focus();
 return false;
 }
 var parse = new CSVParse(retrv(0,17), "|", ",", ";");
 var mm = parse.nextMatrix();
 if (mm.length > 2)
 {
        var Q = 0;
        var ff = 0;
        var arr = new Array();
        for (var j=0; j < mm.length; j++)
        {
             if (mm[j][1]!=null && mm[j][1].replace(/ /g,'')!='' && !isNaN(mm[j][1]))
             {
                 var yy = parseFloat(mm[j][1]);
                 if (''+yy!='NaN')
                 {
                     ff += yy;
                     Q++;
                     arr[arr.length] = yy;
                 }
             }
        }
        arr.sort();
        var N = parseInt(fm.dr.value);
        for (var k=0; k < N; k++) ff -= arr[k];
        var fs = txt.value.replace(/S/g,''+ff).replace(/Q/g,''+Q).replace(/T/g,'0');
       
        var fv = Math.round(10*evalhat(fs))/10;
        if (''+fv !='NaN')
        {
           setv(0,12, ''+ fv);
           myprompt(textmsg[1699] + fv + ". " + textmsg[1700] + fv);
        }
 } 
 return true;
}
function evalhat(x)
{
    var i = x.indexOf('^');
    if (i == -1)
    {
        var t = 0;
        try {
            t = eval(x);
        } catch (e) {
            return 'NaN';
        }

        return t;
    }
    if (i == 0 || i == x.length - 1)
        return 'NaN';
    var j = i + 1;
    var lft, rt;
    var np = 1;
    if (x.charAt(j) == '(')
    {
        np = 1;
        for (j++; j < x.length; j++)
        {
            if (x.charAt(j) == '(')
                np++;
            else if (x.charAt(j) == ')')
                np--;
            if (np == 0)
                break;
        }
        if (np > 0)
            return 'NaN';
        j++;
        rt = evalhat(x.substring(i + 1, j));
        if (rt == 'NaN')
            return 'NaN';
    } else if ("0123456789.".indexOf(x.charAt(j)) >= 0)
    {
        for (j++; j < x.length; j++)
        {
            if ("0123456789.".indexOf(x.charAt(j)) < 0)
                break;
        }
        rt = parseFloat(x.substring(i + 1, j));
    } else
        return 'NaN';
    var k = i - 1;
    if (x.charAt(k) == ')')
    {
        np = 1;
        for (k--; k >= 0; k--)
        {
            if (x.charAt(k) == ')')
                np++;
            else if (x.charAt(k) == '(')
                np--;
            if (np == 0)
                break;
        }
        if (np > 0)
            return 'NaN';

        lft = evalhat(x.substring(k, i));
        if (lft == 'NaN')
            return 'NaN';
    } else if ("0123456789.".indexOf(x.charAt(k)) >= 0)
    {
        for (k--; k >= 0; k--)
        {
            if ("0123456789.".indexOf(x.charAt(k)) < 0)
                break;
        }
        if (k > 0)
            k++;
        lft = parseFloat(x.substring(k, i));
    } else
        return 'NaN';

    var z = Math.pow(lft, rt);
    if (k == 0)
    {
        if (j == x.length)
            return z;
        return evalhat(z + x.substring(j));
    } else
    {
        if (j == x.length)
            return evalhat(x.substring(0, k) + z);
        return evalhat(x.substring(0, k) + z + x.substring(j));
    }
}

function setOption(ele,txt)
{
    if (txt.indexOf(';' + ele + ":") == 0)
        assoptions +=  txt; 
    else
    {
        assoptions +=";";
        assoptions += ele +":" + txt;
    }
}
function setOptionSel(nm)
{
    if (nm.tagName.toLowerCase() == 'select')
       setOption(nm.name, nm.options[nm.selectedIndex].value);
    else (nm.tagName.toLowerCase() == 'input' && nm.type.toLowerCase()=='checkbox')
    {
       if (nm.checked) 
          setOption( nm.name, "700");
       else
          setOption( nm.name, "600");
    }
        
}
function setnologin(checked)
{
    nologin = checked;
}
function setOptionEle(nm)
{
 if (nm.name=='f')
     setOption(nm.name,fm.dr.value +"|" + nm.value);
 else
     setOption(nm.name,nm.value);
}
function setflag(ck)
{
   if (typeof(ck) !='undefined' && ck!=null) 
   if (ck.checked) setOption(ck.name,"");
}
function setvalues()
{
 assoptions="";
 if (typeof(fm.f)!='undefined' && parseit(fm.f) == false)
 return false;

 if (typeof(fm.o)!='undefined')
 {
 setflag(fm.o);
 }
 if (typeof(fm.r)!='undefined')
 {
 setflag(fm.r);
 }
 setflag(fm.w);
 setflag(fm.n);
 if (typeof(fm.p)!='undefined')
 setflag(fm.p);
 if (typeof(fm.m)!='undefined')
 setflag(fm.m);
  if (typeof(fm.g)!='undefined')
 setflag(fm.g);
 if (typeof(fm.ff)!='undefined')
 setOptionSel(fm.ff);
 if (typeof(fm.fs)!='undefined')
 setOptionSel(fm.fs);
 if (typeof(fm.fw)!='undefined')
 setOptionSel(fm.fw);

 if (typeof(fm.q)!='undefined')
 setflag(fm.q);

 if (typeof(fm.ip)!='undefined')
 setOptionEle(fm.ip);
 
 if (typeof(fm.fo)!='undefined')
 {
     if (fm.fo.value == 'e.g. 3<4,6<7<8')
         fm.fo.value = '';
     setOptionEle(fm.fo);
     if (fm.fo.value == '')
         fm.fo.value = 'e.g. 3<4,6<7<8';
 }
 

 if (typeof(fm.d)!='undefined')
 {
     if (!isNaN(fm.d.value))
     {
         setOptionEle(fm.d);
     }
     else
     {
         assoptions = assoptions.replace(/;d:[0-9]*;/, ";");
     }
 }

 
 if (typeof(fm.f)!='undefined')
 setOptionEle(fm.f);

 if (typeof(fm.cd)!='undefined')
 setOptionEle(fm.cd);
 
 
 if (assoptions.charAt(0) == ';')
     assoptions = "et:" + emailtime + assoptions;
 else 
     assoptions = "et:" + emailtime + ";" +  assoptions;
 setv(0, 14, assoptions);

 return true;

}
writenow("<style> .field{border:1px #cc1111 solid;background-color:lightyellow}\n.cellbg{background-color:" + DBGCOLOR +";padding-left:4px;padding-right:4px}</style>");
associatedtxt = ele(0,9);


function cfgquiz(type)
{
var itemcounter = 1;
var dive = document.getElementById("optioninfo");
if (dive!= null)
{
 dive.style.zIndex = ++zIndex;
 return;
}

var str ="<table border=1 cellpadding=3 cellspacing=1 bgcolor=#b0b0b0 style=\"border-collapse:collapse;border-color:#DDCC66\" >";

if ( type > 1)
{
str +='<tr><td class=cellbg align=center>';
str += (itemcounter++);
str +='</td><td class=cellbg  align=left colspan=4>';
str +='<input type=checkbox name=o class="chk"  class="field"> ';
str +='<nobr>'+textmsg[865+367] +'</nobr>';
str +='</td></tr>';

str +='<tr><td class=cellbg   align=center> ';
str += (itemcounter++);
str +='</td><td  class=cellbg  align=left colspan=4>';
str +='<input type=checkbox name=r  class="chk" > ';
str +='<nobr>'+textmsg[865+368] +'</nobr></td></tr>';
}




if ( type >= 2 )
{
str +='<tr><td  class=cellbg  align=center>';
str += (itemcounter++);
str +='</td><td  class=cellbg   align=left colspan=4>';
str +='<input type=checkbox name=p  class="chk"> <nobr>'+textmsg[1258] +'</nobr></td></tr>';
}

//////////////
str +='<tr><td class=cellbg   align=center>';
str += (itemcounter++);
str +='</td><td  class=cellbg   align=left colspan=2>';
str +='<input type=checkbox name=n  class="chk"> <nobr>'+textmsg[1886] +'</nobr></td><td  colspan=1 class=cellbg  >';
str +='<input name=btnfromcached type=button class=OrangeButton  style=padding-top:3px;padding-bottom:2px;width:'
            + Math.round(4.5*font_size) + "px onclick=\"fromcached()\" value=\"" + textmsg[1866].split(/@/)[3] + "\"></td><td  colspan=1 class=cellbg  >";
    str +='<input name=btnfromsaved type=button class=OrangeButton  style=padding-top:3px;padding-bottom:2px;width:'
            + Math.round(4.5*font_size) + "px onclick=\"fromsaved()\" value=\"" + textmsg[1866].split(/@/)[4] + "\"></td></tr>";

str +='<tr><td class=cellbg   align=center>';
str += (itemcounter++);
str +='</td><td  class=cellbg   align=left colspan=2>';
str +='<input type=checkbox name=g  class="chk"> <nobr>'+textmsg[1924] +'</nobr></td><td  class=cellbg   align=left colspan=1>';
str += '<input  type=button class=OrangeButton  style=padding-top:3px;padding-bottom:2px;width:' + Math.round(4.5*font_size) + "px onclick=\"gradego()\" value=\"" +   textmsg[1617].split(/@/)[2] + "\">";
str += '</td><td  class=cellbg   align=left colspan=1>';
if (( type ==1 || type==3) && (new Date()).getTime() >= parseInt('' + retrv(0, 2)) * 1000)
    str += '<input  type=button class=OrangeButton  style=padding-top:3px;padding-bottom:2px;width:' + Math.round(4.5*font_size) + "px onclick=\"regradesubmission(1)\" value=\"" +  textmsg[1564]  + "\">";
str += '</td></tr>';

if ( type ==1 || type==3)
{
str +='<tr><td class=cellbg   align=center>';
str += (itemcounter++)
str +='</td><td class=cellbg colspan=2    align=left><input type=checkbox name=w > ';
str +='<nobr>' + textmsg[1833] + "</nobr></td><td   class=cellbg  ><input name=btnactivity type=button class=OrangeButton  style=padding-top:3px;padding-bottom:2px;width:"
        + Math.round(4.5*font_size) + "px onclick=\"reviewactivities()\" value=\"" + textmsg[1451] + "\"></td><td class=cellbg  >";

str +='</td></tr>';
} 
if (type == 1 || type == 3)
{
    str +='<tr><td class=cellbg   align=center>';
    str += (itemcounter++);
    str +='</td><td  class=cellbg   align=left colspan=2>';
    str +='<input type=checkbox name=m  class="chk"> <nobr>'+textmsg[1906] +'</nobr></td><td  colspan=1 class=cellbg  >';
    if ((new Date()).getTime() < parseInt('' + retrv(0, 1)) * 1000)
    {
    str +='<input name=btnreorder type=button class=OrangeButton  style=padding-top:3px;padding-bottom:2px;width:'
            + Math.round(4.5*font_size) + "px onclick=\"reordernum()\" value=\"" + textmsg[1771].split(/@/)[13] + "\"></td><td  colspan=1 class=cellbg  >";
    str +='<input name=btnshuffle type=button class=OrangeButton  style=padding-top:3px;padding-bottom:2px;width:'
            + Math.round(4.5*font_size) + "px onclick=\"shuffle()\" value=\"" + textmsg[1866].split(/@/)[5]+ "\">";
    }
    else
    {
        str += "</td><td  colspan=1 class=cellbg  >";
    }
    str +="</tr>";
}
if ( type==3)
{
str +='<tr><td class=cellbg   align=center valign=middle>';
str += (itemcounter++);
str +='</td><td class=cellbg  align=left>';
str +='<nobr>'+textmsg[1904] +'</nobr>';
str +='</td><td   class="field"  align=left>';
str +='<input name=fo   style=width:200px;border:0px></td><td colspan=2 class=cellbg  align=left>   <nobr>('+textmsg[1905] +')</td></tr>';
}
//if (type==2 || type==3)
{
str +='<tr><td class=cellbg   align=center valign=top>';
str += (itemcounter++);
str +='</td><td class=cellbg  align=left valign=top >';
str +='<nobr>' + textmsg[1263] +'</nobr><div style=margin-top:10px;color:purple;font-weight:700 id=ifactive ></div>';
str +='</td><td class=cellbg colspan=1 align=left>';
//str +='<input name=cd   class="field"  width=200>';

str += makecontrols(assoptions);
str +='</td></tr>';

 
str +='<tr><td class=cellbg   align=center valign=middle>';
str += (itemcounter++);
str +='</td><td class=cellbg  align=left>';
str +='<nobr>'+textmsg[1262] +'</nobr>';
str +='</td><td  class="field"  class=cellbg  align=left>';
str +='<input name=ip  style=width:200px;border:0px></td><td colspan=2 class=cellbg  align=left>   <nobr>('+textmsg[1264] +':';
str += (leftwindow!=null? parent.frames[0].getRemoteAddr():'');  //<%=request.getRemoteAddr()%>)</nobr>';
str +=')</td></tr>';
} 

if ( type == 1 || type==3)
{ 
 
str +='<tr><td class=cellbg  align=center  valign=top>';
str += (itemcounter++);
str +='</td><td class=cellbg  align=left  valign=top>';
str +='<nobr>' + textmsg[1265] +'(' + textmsg[1267] + ")</nobr>";
str +='</td><td   class="field"  align=left valign=top>';
str +='<input name=d style=width:200px;border:0px ></td><td  class=cellbg   valign=top><input type=button class=OrangeButton  style=padding-top:3px;padding-bottom:2px;width:'
        + Math.round(4.5*font_size) + "px onclick=\"closethis();syntax()\" value=\"" + labels[20] + "\">";
str += "</td><td  class=cellbg   valign=top><input type=checkbox name=q >" + textmsg[1695]  ;
str +='</td></tr>';


}

str +='<tr><td  class=cellbg  align=center> ';
str += (itemcounter++);
str +='</td><td  class=cellbg   align=left>';
str +='<nobr>'+textmsg[865+370] +'</nobr>';
str +='</td><td   class=field align=left valign=top><select name=ff  style=width:200px;background-color:white;border:0px ></select></td>';
str += "<td  class=field  style=background-color:white >" + textmsg[865+371] +'<select name=fs  style=background-color:white;border:0px ></select>';
str += '</td><td  class=cellbg  ><input name=fw type=checkbox  class="field">' + textmsg[1592] + '</nobr>';
str +='</td></tr>';




if ( type ==1 || type==3)
{
str +='<tr><td class=cellbg rowspan=3  valign="top"  align=center>';
str += (itemcounter++);
str +='</td><td class="cellbg" style="font-weight:400;font-size:' + (font_size ) + 'px" rowspan=1   align=right valign=top><nobr>'+textmsg[865+372] + '</nobr></td><td  class=field  colspan=1>';
str +='<input name=dr value="0" style=width:200px;border:0px  onkeypress="return numberonly(event)"  style=width:200px;border:0px>';
let xss = textmsg[1259].split(/@/);
str +='</td><td colspan=2   class=cellbg  valign=top><nobr>'+ xss[0] +'</nobr></td></tr>';
str +='<tr><td class=cellbg><nobr>' + xss[1] + '</nobr></td><td class=field><input name=f size=20 value="S"   onchange=parseit(this)  style=width:200px;border:0px></td><td colspan=2   class=cellbg  valign=top>';
str +='<input  type=button class=OrangeButton style=padding-top:3px;padding-bottom:2px;width:'+ Math.round(4.5*font_size) + "px onclick=\"showhideins(this)\" value=\"" + textmsg[1926].replace(/[^@]+@/,'') + textmsg[567] + '"></td></tr>';

str +='<tr><td class=cellbg align=center  colspan=4 style="padding:0px 0px 0px 0px">';

str +='<table id=formulahint border=0 cellspacing=0 align=center style="border-radius:3px;border-width:1px;display:none;margin:0px 0px 0px 0px" ><tr><td>';
str +='<table cellpadding=3 cellspacing=1  >';
str +='<tr><td class=cellbg align=left align=center  colspan=2><u>'+textmsg[865+373] + '</u></td></tr>';
str +='<tr><td class=cellbg  width=50  align=left > <nobr><b>'+textmsg[865+374] +'</b></nobr></td> <td class=cellbg >'+textmsg[865+375] +'</td></tr>';
str +='<tr><td class=cellbg  width=50  align=left > <b> S </td> <td class=cellbg >'+textmsg[865+376] +'</td></tr>';
str +='<tr><td class=cellbg  width=50  align=left > <b> Q </td> <td class=cellbg >'+textmsg[865+377] +'</td></tr>';
str +='<tr><td class=cellbg  width=50  align=left > <b> T </td> <td class=cellbg >'+textmsg[1287] +'(' + textmsg[1694].split(/@/)[1] + ')</td></tr>';
str +='</table>';

str +='</td><td>';


str +='<table border=0 cellspacing=1 cellpadding=3  >';
str +='<tr><td class=cellbg  colspan=4   align=center><u>'+textmsg[865+378] +'</u></td></tr>';
str +='<tr><td class=cellbg  width=50  align=center > <b>  <font size=2> + </font></b> </td><td class=cellbg >'+textmsg[865+379] +'</td>';
str +='<td class=cellbg  width=50  align=center > <b> <font size=3> - </font></b> </td><td class=cellbg >'+textmsg[865+380] +'</td></tr>';
str +='<tr><td class=cellbg  width=50  align=center > <b> <font size=2> * </font></b>   </td><td class=cellbg >'+textmsg[865+381] +'</td>';
str +='<td class=cellbg  width=50  align=center > <b>  <font size=2> / </font></b>  </td><td class=cellbg >'+textmsg[865+382] +'</td></tr>';
str +='<tr><td class=cellbg  width=50  align=center > <b>  <font size=2> ^ </font></b>  </td><td class=cellbg >'+textmsg[865+383] +'</td>';
str +='<td class=cellbg  width=50  align=center > <b>  <font size=2> (&nbsp;&nbsp;) </font></b>  </td><td class=cellbg >'+textmsg[1260] +'</td></tr>';
str +='<tr><td class=cellbg  colspan=4>&nbsp;</td></tr>';
str +='</table>';

str +='</td></tr>';
 
str +='<tr><td colspan=2><table align=center  cellpadding=3 cellspacing=1  >';
str +='<tr><td class=cellbg  width=200 ><u>'+textmsg[865+385] +'</u></td><td><u>'+textmsg[1716] +'</u></td></tr>';
str +='<tr><td class=cellbg  width=200> <b>  S </td> <td class=cellbg >'+textmsg[865+386] +'</td></tr>';
str +='<tr><td class=cellbg  width=200> <b>  100*S/Q </td> <td class=cellbg >'+textmsg[865+387] +'</td></tr>';
str +='<tr><td class=cellbg  width=200> <b>  100*(S/Q)^0.5 </td><td class=cellbg >'+textmsg[865+388] +'</td></tr>';
str +='<tr><td class=cellbg  width=200> <b>  30 + 70*(S)/Q </td><td class=cellbg >'+textmsg[865+389] +'</td></tr>';
str +='<tr><td class=cellbg  width=200> <b>  S - T </td><td class=cellbg >'+textmsg[1289] +'</td></tr>';
str +='<tr><td class=cellbg  width=200> <b>  S - T/2 </td><td class=cellbg >'+textmsg[1290] +'</td></tr>';
str +='</table></td></tr></table>';
str +='</td></tr>';
}
var strs = textmsg[1784].split(/@/);
str +='<tr><td class=cellbg   align=center>';
str += (itemcounter++);
str +='</td><td class=cellbg  align=left>';
str +='<nobr>' + strs[0] + '</nobr>';
str +='</td><td class=cellbg  align=left>';
str +='<input name=emailtime class="cellbg" style="border:0px;width:200px"></td><td  class=cellbg  >';
str +="<input name=btnemail type=button class=OrangeButton  style=padding-top:3px;padding-bottom:2px;width:"
        + Math.round(4.5*font_size) + "px onclick=\"sendnotice()\" value=\"" + strs[1] + "\">";
str +="</td><td  class=cellbg  ><input name=btnsms type=button class=OrangeButton style=padding-top:3px;padding-bottom:2px;width:"
        + Math.round(4.5*font_size) + "px onclick=\"usesms()\" value=\"" + strs[2] + "\">";
str +='</td></tr>';
/////////////////
str += '</table>';


 

var labeling = textmsg[798].split(/@/);

dive = document.createElement("div");
dive.id="optioninfo";
 
var xy = findPositionnoScrolling(f1.Question);
if (layout=='h')
{
 xy[1] -= 8 + font_size;
}

var topp = xy[1]+2;

var otherone = document.getElementById("assessinfo");
if (otherone!= null) topp += otherone.offsetHeight ;

 dive.style.cssText="position:absolute;color:#000000;border:0px;border-radius:3px;padding:0px;zIndex:20;left:" + xy[0] +"px;top:" + topp + "px;z-index:" + (++zIndex);
 var widthw = thispagewidth()- xy[0] - 24;
 if (otherone!= null) widthw = otherone.offsetWidth ;
 dive.innerHTML = round10('100%').replace(/>$/, " style=\"border-radius:3px;background-color:" + DBGCOLOR + ";font-family:" + myfontname +  ";background-image:" + document.body.style.backgroundImage + ";\">") +
  "<table style=\"margin:1px 1px 1px 1px;border-radius:3px;background-color:" + IBGCOLOR +"\" cellspacing=0><tr><td width=100% ><table  width=100% cellpadding=0 cellspacing=0><tr  style=\"background:" + gradientbg  + "\"><td  align=left valign=middle   align=center valign=middle ><img width=" + (font_size+6)+
  " style=\"margin:0px 0px 0px 0px;border-radius:" + Math.round(font_size/2+3) + "px;cursor:pointer\" src=\"image/icon/smalls00.png\" onclick=\"setback()\"></td><td width=100% id=\"optionheader\"  align=center  valign=middle><font color=DDCC11><b>"+
  labeling[type] +   ' ' +  textmsg[865+366] +"</b></font></td></tr></table></td></tr>"+
  "<tr><td colspan=2 valign=top ><form rel=opener name=formm style=\"margin:1px 1px 0px 1px\"  >"+
  str+
  "</form></td></tr>"+
  "</table>"  + round20;

 document.body.appendChild(dive);
unifonts(dive, myfontname);

if (typeof (Drag)!='undefined')
 Drag.init(document.getElementById("optionheader"),dive);

fm = document.formm;

setcfg(type);

}


function ieresizewidth0(wd)
{
 thesubmitarea.style.width  = wd + 'px';
 if ( document.body.scrollWidth <= thispagewidth()+10)
 setTimeout("ieresizewidth0(" + (wd+50) +")",10);
 else
 {
 setTimeout("thesubmitarea.style.width=(document.body.clientWidth-11)+'px';",10);
 }
}

function ieresizeheight0(ht)
{
 thesubmitarea.style.height  = ht + 'px';
 if ( document.body.scrollHeight <= thispageheight()+10)
 setTimeout("ieresizeheight0(" + (ht+50) +")",10);
 else
 setTimeout("thesubmitarea.style.height=(document.body.clientHeight-45)+'px';",10);
}
function showhideins(b)
{
    let xs = textmsg[1926].split(/@/);
    let xx = document.getElementById('formulahint'); 
    if (b.value.indexOf(xs[1])==0)
    {   xx.style.display = 'block'; 
        b.value = b.value.replace(xs[1],xs[0]);
    }
    else
    {xx.style.display = 'none';   
         b.value = b.value.replace(xs[0],xs[1]);
    }
}
var anchor = document.createElement("div");
anchor.style.cssText="background:url(image/horbar.jpg);cursor:s-resize;width:200px;height:2px;position:absolute;left:6px;";
document.body.appendChild(anchor);
var anchorv = document.createElement("div");
if (layout == 'h')
   anchorv.style.cssText="background:url(image/vertbar.jpg);cursor:w-resize;width:2px;height:200px;position:absolute;left:6px;";
else
   anchorv.style.cssText="background:url(image/horbar.jpg);cursor:s-resize;width:200px;height:2px;position:absolute;left:6px;";
document.body.appendChild(anchorv);
 
function   placeit()
{
    if (typeof(findPositionnoScrolling) !='undefined')
    {
        var qbox;
        var xy;
        if (layout == 'h')
        { 
        qbox = ele(0,8);
        xy = findPositionnoScrolling(qbox);
        anchor.style.left = (xy[0]) + 'px';
        anchor.style.top =  (xy[1] + qbox.offsetHeight -1) + 'px';
        anchor.style.width = (qbox.offsetWidth + ele(0,9).offsetWidth) + 'px';
        anchorv.style.left = (xy[0] + qbox.offsetWidth) + 'px';
        anchorv.style.top =  (xy[1] ) + 'px';
        anchorv.style.height = (qbox.offsetHeight) + 'px';
        }
        else
        {
        qbox = ele(0,9);
        xy = findPositionnoScrolling(qbox);
        anchor.style.left = (xy[0]) + 'px';
        anchor.style.top =  (xy[1] + qbox.offsetHeight - 1) + 'px';
        anchor.style.width = (qbox.offsetWidth) + 'px';
         
        qbox = ele(0,8);
        xy = findPositionnoScrolling(qbox);
        anchorv.style.left = (xy[0]  ) + 'px';
        anchorv.style.top =  (xy[1] + qbox.offsetHeight - 1) + 'px';
        anchorv.style.width = (qbox.offsetWidth) + 'px';
         
        }    
           
    }
}
 
var currenthoedgex=0, currenthoedgey = 0;
function recordpos(x,y)
{
    currenthoedgex = x; 
    currenthoedgey = y; 
}
function repositionv(x,y)
{
    y -= currenthoedgey;
    x -= currenthoedgex;
    if (layout == 'h')
    { 
        var qbox1,qbox2;
        var w1,w2;
        if (x < 0)
        { 
        qbox1 = ele(0, 8); 
        qbox2 = ele(0, 9); 
        w1 = parseInt(qbox1.style.width.replace(/px/,'')) +(x) ;
        w2 = parseInt(qbox2.style.width.replace(/px/,'')) -(x) ;
        qbox1.style.width =  (w1 ) + 'px';
        qbox2.style.width =  (w2 ) + 'px';
        }
        else
        {
        qbox2 = ele(0, 8); 
        qbox1 = ele(0, 9); 
        w1 = parseInt(qbox1.style.width.replace(/px/,'')) -(x) ;
        w2 = parseInt(qbox2.style.width.replace(/px/,'')) +(x) ;
        qbox1.style.width =  (w1 ) + 'px';
        qbox2.style.width =  (w2 ) + 'px';
        }
       
    }
    else
    {
        qbox = ele(0, 8); 
        var hh = parseInt(qbox.style.height.replace(/px/,'')) + y ;
        qbox.style.height = hh + 'px';
        qbox = ele(0, 9); 
        hh = parseInt(qbox.style.height.replace(/px/,'')) - y;
        qbox.style.height = hh + 'px';
    }
     movepanel();
}
 
function reposition(y)
{
    y -= currenthoedgey;
    var h;
    var qbox;
    if (layout == 'h')
    {
        //if (y > 0)
        { 
        qbox = ele(0,8); 
        h = parseInt(qbox.style.height.replace(/px/,'')) + y;
        qbox.style.height = h + 'px';
        ele(0,9).style.height = h + 'px';
        movepanel();
        }
    }
    else
    {
        qbox = ele(0,9); 
        h = parseInt(qbox.style.height.replace(/px/,'')) + y;
        qbox.style.height = h + 'px';
        movepanel();
    }
}
function onF(z, j)
{
    S(z,j);
     movepanel(j);
}
function initanchor()
{
    Drag.init(anchor);
    Drag.init(anchorv);
    placeit(); 
    anchor.onDragStart = function(x,y)
    {
        window.onresize = null;
        recordpos(x,y);
    };
     
    anchor.onDragEnd =   function(x,y)
    {
        reposition(y);
        placeit();
        window.onresize = resizeCont1;
    };
    anchorv.onDragStart = function(x,y)
    {
        window.onresize = null;
        recordpos(x,y);
    };
     
    anchorv.onDragEnd =   function(x,y)
    {
        repositionv(x,y);
        placeit();
        window.onresize = resizeCont1;
    };
}

function selcol(j,td)
{
    var tbl = td.parentNode.parentNode.parentNode;
    if (tbl.tagName.toLowerCase() != 'table') 
        tbl = tbl.parentNode;
    for (var i = 1; i < tbl.rows.length; i++)
    {
        var xx = tbl.rows[i].cells[j+1]; if (xx==null) continue;
        if (xx.innerHTML.replace(/ /g,'') == '') continue;
        xx = xx.getElementsByTagName('input');if (xx==null) continue;
        if (xx[0]!=null && xx[0].type.toLowerCase()=='radio') xx[0].checked = true;
    }
     
}
function regradesubmission(hd)
{
    if (openedpreview!= null)
    {
       openedpreview.close();
       openedpreview = null;
    }
    if ((new Date()).getTime() <= parseInt('' + retrv(0, 1)) * 1000 || retrv(0, 4) == '0' || retrv(0, 4) == '2')
        return;
    var aw = retrv(0,9);
    //if (duringopen()){ aw = ""; for (var jj=0; jj < 20; jj++) aw += jj + ". \n";}
    h = new Hwtake("prev", aw, retrv(0, 9), retrv(0, 17), retrv(0, 3));
    h.parseTimequota(mat[0][20]);
    var adif = "";
    var ldif = "";
    var str = "<center>";
    if (missedcode!='')
    {
        str += textmsg[532] + ":" + missedcode + "<br>";
    }
    str += "<form rel=opener name=fn style=\"margin:5px 5px 5px 5px\"   ><table cellspacing=1 width=100% cellpadding=3 class=outset3 border=1 style=border-radius:3px;border-collapse:collapse;border-color:#ddcc99" 
            +";background-color:" + TBGCOLOR +"><tr style=linear-grdient("+BBGCOLOR +"," + TBGCOLOR+")><td align=right><nobr>" 
            + labels[8] + "</nobr></td><td align=center style=color:blue onclick=selcol(0,this)><nobr>" 
            + textmsg[1564] + "</nobr></td><td align=center  style=color:blue  onclick=selcol(1,this)><nobr>" 
            + textmsg[1565] + "</nobr></td><td align=center  style=color:blue  onclick=selcol(2,this)><nobr>" 
            + textmsg[1654] + "</nobr></td></tr>";
    for (var i = 0; i <= h0.biggesti; i++)
    {
        if (h.contains1(i) && i < h0.answqrr.length && h.answqrr[i] !=h0.answqrr[i])
        {  
            adif += i + " ";
            str += "<tr  bgcolor="+TBGCOLOR +"><td  align=right>" + i + "</td><td  align=center><input type=radio name=x" + i + " value=g  checked ></td><td  align=center><input  type=radio name=x" + i + " value=r ></td><td  align=center><input  type=radio name=x" + i + " value=n ></td></tr>";
        }
        else if (h.contains1(i) && i < h0.ptlist.length &&  h.ptlist[i]!=null &&  h.ptlist[i] !=h0.ptlist[i])
        {
            ldif += " " + i + " " + h0.ptlist[i];
            str += "<tr bgcolor="+TBGCOLOR +"><td  align=right>" + i + "</td><td  align=center><input  type=radio name=x" + i + " value=g  ></td><td  align=center><input  type=radio name=x" + i + " value=r ></td><td  align=center><input  type=radio name=x" + i + " value=n ></td></tr>";
        }
        else if (h.contains(i))
        {
            str += "<tr bgcolor="+TBGCOLOR +"><td align=right>" + i + "</td><td  align=center><input  type=radio name=x" + i + " value=g  ></td><td  align=center><input  type=radio name=x" + i + " value=r ></td><td  align=center><input  type=radio name=x" + i + " value=n  checked ></td></tr>";
        }
    }
    var tmp = extract("f");
    if (tmp == null) tmp = '0 | S';
    tmp = tmp.replace(/C/g,"S");
    var readonly = "";
    if (adif + ldif !='')readonly = " readonly ";
    if (tmp !='0 | S')
    str += "<tr><td colspan=4><input  type=checkbox name=formula checked " + readonly + ">" + textmsg[1567].split(/@/)[0] + ":" + tmp + "</td></tr>";
     str += "<tr><td colspan=4><input  type=checkbox name=keepc checked " + readonly + ">" + textmsg[1567].split(/@/)[1]  + "</td></tr>";
    str += "</table></form>"+
            "<input type=button class=\"tdbutton OrangeButton\" onclick=regradego() style=width:70px value=\"" + textmsg[1564] + "\">"+
             "<input type=button class=\"tdbutton GreenButton\" onclick=closeprompt() style=width:70px value=\"" + textmsg[18] + "\">" +
             "<input type=button class=\"tdbutton RedButton\" onclick=ungrade() style=width:70px value=\"" + textmsg[1856] + "\"></center><br>" ;
    var y = getpromptmsg();
    if ((retrv(0,4) == '2' || retrv(0,4) == '3') && parseInt(retrv(0,2)) - parseInt(retrv(0,1)) > 10400)
    {
        y +=  textmsg[667] + " " + labels[2] + " <b>-</b> " + labels[1] + " >  3h?<br>";
    }
    myprompt(y + (hd==0?("<br><div style=\"margin:3px 3px 3px 3px\">" + textmsg[1328] + "</div>"):"") + str, null, null, textmsg[1563]);
    h0 = h;
}
function ungrade()
{
    copydatato(null, -1);
    formnewaction(fsnd, "gradeQuiz.jsp?regradenum=u");
    fsnd.target =   "w" + tstmp;
   visual(fsnd);
 fsnd.submit();
}
function regradego()
{
    var s = "@";
    var e = document.fn.elements;
    var j;
    var k = 0, l=0;
    for ( j = 0; j < e.length; j++)
    {
        if (e[j].name == 'formula') k = e[j].checked?1:0;
        if (e[j].name == 'keepc'){l = (e[j].checked ? 1 : 0); break;}
        else if (e[j].checked)
        {
           s += e[j].value + "@" + e[j].name.substring(1) + '@';
        }
    }
    //e[j].checked = true;
    s =  (k+2*l) + s ;
    copydatato(null, -1);
 
    formnewaction(fsnd, "gradeQuiz.jsp?regradenum=" + encodeURIComponent(s));
    
    fsnd.target =   "w" + tstmp;
   visual(fsnd);
 fsnd.submit();
}
function gradego()
{
    formnewaction(fsnd, "gradeQuiz.jsp?gradeall=1&course=" + mat[0][10] +"&assignname=" + retrv(0,0)  +"&sessionname=" + retrv(0,5) );
    fsnd.target =   "w" + tstmp;
    visual(fsnd);
    fsnd.submit();
}
var oldfailupload = failupload;

failupolad = function(x)
{
    oldfailupload(x);
    if (x== null)
    {
        ResizeUploaded.updateattach();
        showattachment(ele(0,18).value);
    }
    tempsave();
};

function deleteAllAttached()
{
    fsavetarget = f1.target;
    f1.action =  "assigndoc.jsp?savetodoc=3";//
    f1.target =    'w' + tstmp;
    visual(f1);
    f1.submit();
    f1.target = fsavetarget; 
}

function delone()
{
    myprompt("<br>" + textmsg[1306] + "<br><center><input type=button class=GreenButton style=width:70px value=\"" + textmsg[1357] + "\" onclick=freshpage() ></center>",null,null,""); 
    //if (parent!=window && parent.frames.length==2 && window==parent.frames[1] && typeof(parent.frames[0].delone)!='undefined')
    {    
      //  parent.frames[0].delone();
    }
}

function freshpage()
{
    parent.document.location.href = parent.document.location.toString();
}

var allAttachTodel = '';
showattachment = function (t,r)
{
    var tt = ResizeUploaded.unzip(t);
    var mt = (new CSVParse(tt.replace(/,$/,''), "'", "@", ",")).nextMatrix(true);
    var s = ['',''];
    var k = 0;
    var goodstr = '';
    for (var i=0; i  < mt.length; i++)
    {
        if ( mt[i][0]== null ||  mt[i][1]== null ||  mt[i][0]=='' ||  mt[i][1]==''  ) continue;
        if (mt[i].length == 2)
            goodstr += mt[i][0] + '@' + mt[i][1] + ',';
        else if (mt[i].length == 3)
            goodstr += mt[i][0] + '@' + mt[i][1] + '@' + mt[i][2] + ',';
        var x = " "+ mt[i][1] + " ";
        var l = x.length;
        if (mt[i].length == 3 && mt[i][2].charAt(0) == '_') s[1] += " " + mt[i][0] + " ";
        else if ( (k = s[0].indexOf(x))>= 0) 
            s[0] = s[0].substring(0,k+l) +  " " +   mt[i][0] + " " + ((k+1>=s[0].length)?'':s[0].substring(k+l));
        else if ( (k = s[1].indexOf(x))>= 0) 
            s[1] = s[1].substring(0,k+l) +  " " +   mt[i][0] + " " + ((k+l>=s[1].length)?'':s[1].substring(k+l));
        else s[0] += " " + mt[i][0] + " ";
    }
    var zv = ResizeUploaded.zip(goodstr);
    if (zv!=mat[0][18] )
    {
        setv(0,18,zv);
        holdvalues['0_18'] = zv;
        valuechanged[0] = true;
        
    }
     
    for (var j=0; j < 2; j++)
    {
       // if (s[0]=='') s[0] = "[+]";//textmsg[787]; 
        var xx = document.getElementById("attachpanel" + j);
        if (xx!= null)
        {
           xx.innerHTML =  "<span style=color:blue;font-size:18px;cursor:pointer onclick=\"movepanel(" + (j+8) + ");attachmore(18)\">[+]</span>" + s[j].replace(/@[^,]+/g,'').replace(/,$/,'').replace(/,/g,', ') ;
            
        }
    }
     
};

attachmore = function(c)
{
    cc = c;
    ResizeUploaded.attachref = ele(0,c);
    for (var j=0; j < fsnd.elements.length; j++)
        if (fsnd.elements[j].type.toLowerCase() == 'file')
    {
        fsnd.elements[j].click();
        closeprompt();
        break;
    }
}
function trim(s)
{ 
    if (s == null) return null; 
    return s.replace(/^[ ]+/, '').replace(/[ ]+$/, '');
}
function transfer(t,i,j)
{
    
    var vs = [];
    var N = 0;
    var q = trim(retrv(0,i));
   
    if (q !='')
    {
        vs = q.split(/,/);
        N = vs.length;
    }
    var v = '';
    var X = trim(t.value);
    
    var tbl = t.parentNode.parentNode.parentNode;
    if (tbl.tagName.toLowerCase() !='table') 
        tbl = tbl.parentNode;
    var k;
    if ( X  == '' && j < N)
    {
        for (k=0; k < N; k++)
        if (k !=j)
            v += ',' + vs[k];
        if (v!= '')
            setv(0, i, v.substring(1));
        else 
            setv(0, i,'');
        for (; j < tbl.rows.length-2; j++)
        {
            document.getElementById('tmpbox' + (j)).value = document.getElementById('tmpbox' + (j+1)).value ;
        }
        if (tbl.rows.length-2>=0)
        tbl.deleteRow(tbl.rows.length-2);
       
    }
    else if (j < N)
    {   
        for (k=0; k < N; k++)
            if (k == j)
                v += ',' + X;
            else
                v += ',' + vs[k];
        setv(0, i, v.substring(1));
         
        
    }
    else if ( X !='')
    {
        if ( q != '') 
            q +=  ',' + X;
        else 
            q = X;
        setv(0, i, q); 
         
        if (doclose1 == false)
        {
            j++;
            var r = tbl.insertRow(j);
            var c = r.insertCell(-1);
            c.innerHTML = '<input id=tmpbox' + j + '  size=18  style="border:0px #b0b0b0 solid" value=""  onfocus=enteredit()  onblur=transfer(this,' + i  +',' + j  +')  tabindex=' + (j+20) + ' onkeypress="return enterlistvalue(event,' + i  +',' + j  +',this)">';
            var txt = document.getElementById('tmpbox' + (j ));
           // if (txt!= null) txt.focus();
        }
    } 
    if (enteredthisone ==2)
    {
        closethis();
    }
    enteredthisone = 0;    
}
var enteredthisone = 0;
function enteredit() 
{
   enteredthisone = 1; 
}
function enterlistvalue(evt, i, j, ta)
{ 
    var e = evt? evt : window.event;
    if(!e) return true;
    var key = 0;
    if (e.keyCode) 
    {
        key = e.keyCode;
    }  
    else if (typeof(e.which)!= 'undefined') 
    {
        key = e.which;
    }
    if (key == 13)
    {
        transfer(ta,i,j);
    }
    var txt;
    if (ta.value!= '')
    {
        txt = document.getElementById('tmpbox' + (j+1));
        //if (txt!= null) txt.focus();
    }
    else
    {
        txt = document.getElementById('tmpbox' + (j-1));
        //if (txt!= null) txt.focus();
    }
    return true;
}
var doclose1 = false;
function closethis()
{
    if (multactive == 0) return;
    if (enteredthisone == 1) 
    { 
        enteredthisone = 2;
        return;
    }
    var tbl;
    if (graderbyquestionopened )
    {
        var y = '';
        tbl = document.getElementById('gradetbl');
         for (var i=1; i < tbl.rows.length; i++)
            {
                try {  
                    var k = parseInt(tbl.rows[i].cells[0].innerHTML); 
                    var v = tbl.rows[i].cells[1].getElementsByTagName("input")[0];//.value.replace(/[ ]+/g, ' ').replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[,| |\.|;|_|\-|\+]/,'@') + ';';
                    updatequota(k,v,'g');
               }catch(e){}
            }
         
    }
    graderbyquestionopened = false;
    doclose1 = true;
    tbl = document.getElementById('tmptbl');
    if (tbl== null) return;
    if (tbl.rows.length > 1)
    {
        tbl.deleteRow(0);
        closethis();
    }
    else
    {
        document.body.removeChild(document.getElementById('tmpdiv'));
        var zv = sort1(retrv(0,multactive));
        setv(0, multactive, zv);
        if (mat[0][multactive] !=zv) 
        {
            valuechanged[0] = true;
            holdvalues['0_' + multactive] = zv; 
        }
        multactive = 0;
    }
   
}



function sort1(x)
{
    if (x == null || x.replace(/ /g,'') == '' || x.indexOf(",") < 2 )
        return x;
    var xs = x.split(/[ ]*,[ ]*/);
    xs.sort();
    var t = '';
    for (var j=0; j < xs.length; j++)
        t += "," + xs[j];
    return t.substring(1);
}
var multactive = 0;
function multirecords(i)
{
    if (multactive > 0)
    {
        closethis();
    }
    multactive = i;
    if (i == 5 || i == 6)
    {
        var vs = [];
        var N = 0;
        var q = trim(retrv(0,i));
    
        if (q !='')
        {
            vs = q.split(/,/);
            N = vs.length;
        }
         
        var xy = findPositionnoScrolling(ele(0,i));
       // ele(0,i).style.visibility = 'hidden';
        var d = document.createElement('div');
        d.id = 'tmpdiv';
        d.style.cssText = 'position:absolute;background-color:' + DBGCOLOR + ';left:' + xy[0] + 'px;top:' + xy[1] + 'px;border:1px #b0b0b0 solid;z-index:3;border-radius:4px';
         
        var v = '<table cellspacing=0 cellpadding=0 style="border-collapse:collapse" id=tmptbl >';
        var j = 0;
        for (; j < N; j++)
        {
            v += '<tr><td><input id=tmpbox' + j + ' size=18 style="border:0px #b0b0b0 solid" value="' + vs[j] + '" onfocus=enteredit() onblur=transfer(this,' + i +',' + j  +')   tabindex=' + (j+20) + '  onkeypress="return enterlistvalue(event,' + i  +',' + j  +',this)"></td><td onclick="deletelistitem(' + i  +',' + j  +',this)" style=color:red>&#8855;</td></tr>';
        }
        v += '<tr><td><input id=tmpbox' + j + '  size=18  style="border:0px #b0b0b0 solid" value=""  onfocus=enteredit() onblur=transfer(this,' + i  +',' + j  +')   tabindex=' + (j+20) + '  onkeypress="return enterlistvalue(event,' + i  +',' + j  +',this)"></td><td></td></tr>';
        v += '<tr><td width=100% colspan=2><table width=100% ><tr style=color:#0000BB><td width=50% style=cursor:pointer;white-space:nowrap onclick=' + ((i==5||retrv(0,4)=='0'||retrv(0,4)=='2')?('closethis() align=center>' + textmsg[1824]):('graderbyquestion(this)   align=center>'+textmsg[1797])) + '</td><td width=50% onclick=closethis() style=cursor:pointer align=center>' +  textmsg[1824]  + '</td></tr></table></td></tr>';
        v += '</table>';
        d.innerHTML = v; 
        
        document.body.appendChild(d);
        document.getElementById('tmpbox0').focus();
    }
    
}


function  graderbyquestion(td)
{
    graderbyquestionopened = true;
    var tbl = td.parentNode.parentNode;
    if (tbl.tagName.toLowerCase()!='table') tbl = tbl.parentNode;
    var j = tbl.rows.length - 1;
    h = new  Hwtake("prev", retrv(0,8), aw, '', retrv(0,17), retrv(0,3));
    if (holdvalues['0_20']!=null && holdvalues['0_20']!='')
        h.parseTimequota(holdvalues['0_20']);
    else 
        h.parseTimequota(mat[0][20]);
    var c0;
    if (tbl.rows.length == 1)
    {   
        var r =  tbl.insertRow(0);
        c0 = r.insertCell(0); 
        c0.colSpan = 2;
    }
    else
        c0 = tbl.rows[0].cells[0];
    var tblstr = "<table id=gradetbl border=1 style=border-collapse:collapse;border-color:#cccccc ><tr style=\"background:" + beheading +"\"><td align=right ><nobr>" + labels[8] + "</nobr></td><td>" + labels[6] + "</td></tr>";
    for (var k=1; k <= h.graderbyquestion.length  || k <= h.questarr.length+1; k++)
    {
        tblstr +=  '<tr><td align=right>' + k;
        var graders = h.graderbyquestion[k];
        if (graders==null || graders==''||''+graders == 'undefined')
        {
            if (k <= h.questarr.length )
                graders = retrv(0,6);
            else
                graders = '';
        }
            
        graders = graders.replace(/@/g,',');
        if (''+graders == 'undefined')
            graders = retrv(0,6);
        tblstr += '</td><td><input class=left size=19 value="' + graders  + "\" onchange=\"updatequota(" + k +",this,'g')\" ></td></tr>";
        j++;
    }
    c0.innerHTML = tblstr + '</table>';
    tbl.rows[1].cells[0].innerHTML = textmsg[1824];//
    tbl.rows[1].cells[0].onclick = closethis;
}
 
ele = function(r,c)
{
    var x1 = formselementbyname(f1,fields[c]); 
    return x1;
};
var deletelistitem = function(i, j,t )
{
    var vs = [];
    var N = 0;
    var q = trim(retrv(0,i));
   
    if (q !='')
    {
        vs = q.split(/,/);
        N = vs.length;
    }
    var v = '';
     
    var tbl = t.parentNode.parentNode;
    if (tbl.tagName.toLowerCase() !='table') 
        tbl = tbl.parentNode;
    var k;
    if (  j < N)
    {
        for (k=0; k < N; k++)
        if (k !=j)
            v += ',' + vs[k];
        else
        {
           
        }
        if (v!= '')
        {
            setv(0, i, v.substring(1));
            holdvalues['0_20'] = holdvalues['0_20'].replace(new RegExp(vs[j] + '@'),'').replace(new RegExp('@' + vs[j] ),'').replace(new RegExp(vs[j] ),'');
            for (; j < tbl.rows.length-2; j++)
            {
               document.getElementById('tmpbox' + (j)).value = document.getElementById('tmpbox' + (j+1)).value ;
            }
            if (tbl.rows.length-2>=0)
               tbl.deleteRow(tbl.rows.length-2);
        }
        else
            myprompt(textmsg[1798]);
        
       
    }
}
retrv = function(r,c)
{
        if (c!=8 && c!=9 && holdvalues[r + '_' + c] != null)
            return holdvalues[r + '_' + c];
        var z = ele(0,c);
        if (ctype[c] == 's')
        {
            return z.options[z.selectedIndex].value;
        }
        else if (ctype[c] == 'm')
        {
            return parseTime(z.value);
        }
        if (z!= null && typeof(z.value) != 'undefined')
            return z.value;
        if (numRows > 0) 
        {
            return mat[0][c];
        }
        return defaultRecord[c];
};

setv = function(r,c, v)
{
        var z = ele(0,c);
        if (ctype[c] == 's')
        {
            var jj = 0;
            while(jj < z.options.length &&  z.options[jj].value !=v)
               jj++;
            if (jj == z.options.length)
            {
                 z.options[jj] = new Option(v,v);
            }
            z.selectedIndex = jj;
            holdvalues[ "0_" + c] = v;
        }
        else if (ctype[c] == 'm')
        {
            z.value = timestr(v);
            holdvalues[ "0_" + c] = v;
        }
        else if (ctype[c] == 'a')
        {
            if (mat[0][c] !=v)
            {
                holdvalues['0_' + c] = 1;
                mat[0][c] = v;
            }
            
            z.value = v;
            
        }
        else if (z!= null && typeof(z.value) != 'undefined')
        {      
            z.value = v;
            holdvalues[ "0_" + c] = v;
        }
        
};

var previewforsave = false;
function setpreviewforsave(b)
{
    previewforsave = b;
}
function getpreviewforsave()
{
    return previewforsave;
}
 
function proofsave()
{
    updatepops();
    openedpreview = null;
   
    var xx = retrv(0,4);
    if (valuechanged[0] == false)
    {
        myprompt(textmsg[1566]);
        return;
    }
    var needproof = (typeof(holdvalues['0_8'])!='undefined' && holdvalues['0_8'] == 1 
                  || retrv(0,3)!=mat[0][3]  || retrv(0,18)!=mat[0][18])  &&   ( xx == '1' || xx=='3');
    if (needproof == false)
    {
        NUMROWS = 1;
        if ( xx == '2')
        {
            xx = extract('cd');
            if (xx==null||xx=='')
            {
                if (assoptions !='')  assoptions +=";";
                assoptions += "cd:" + code0;
                setv(0,14,assoptions);
            }
        }
        setaction(1);
    }
    else
    {
        if (xx=='2' || xx=='3')
        {
            xx = extract('cd');
            if (xx==null||xx=='')
            {
                if (assoptions !='')  assoptions +=";";
                assoptions += "cd:" + code0;
                setv(0,14,assoptions);
            }
        }
        else if (xx=='0'||xx=='1')
        {
            xx = extract('cd');
            if (xx!=null && xx!='')
            {
                assoptions = assoptions.replace(/cd:.*$/,'');
                setv(0,14,assoptions);
            }
        }
        myws1('preview.jsp',1);
        previewforsave = true;
    }
    
}

function redefine1()
{
    ResizeUploaded.activetextarea = function(x)
    {
        if (x.charAt(0) == '_')
           return ele(0, 9);
        return ele(0,8);
    };
    ResizeUploaded.setformat2html = function()
    {
        valuechanged[counter] = true;
        UT(0,panelposition);
        var xx = retrv(0, 3);
        if (xx== null || ('' + xx !='1' &&  ''+xx == '2'))
        {
            setv(0, 3, '1');
        }
    };
}
var oldprintstyle = null;
var oldprintgo = null;
var oldguessFormat = guessFormat;
 
function reformat8()
{
  //  var attstr = ResizeUploaded.unzip(mat[i][18]);
    var detailass = new Hwtake('prev', retrv(0, 8),  '', retrv(0, 18), retrv(0, 17), retrv(0, 3), 0, true ); 
    //addcss2head(0, detailass.divs);   
    var str =  ("<center>" + detailass.header + detailass.attachheader +"</center>");
    detailass.assemble(false,true); 
    str +=  detailass.str;
    for (var j=0; j <= detailass.answqrr.length; j++)
    {
        var ii = detailass.mapor2nm[j];    
        if (ii == null) continue;
        if (detailass.answqrr[ii]!=null && detailass.answqrr[ii]!='')
        str += j + "." + formatstr(detailass.answqrr[ii], detailass.fmt) + "<br>";
    }
    return str;
}
var oldprinting;
var oldchecked = [];
function defaultfields(ck)
{
    if (ck.checked)
    {
    for (let j = 0; j < numCols; j++)
    {
        let ck = formselementbyname(document.f, 'c'+j);
        if (ck!=null) { oldchecked[j] = ck.checked;}
        if (j!=8) ck.checked = true;else ck.checked = false;
    }
    document.f.btn.onclick = go1;
   }
    else
    {
        for (let j = 0; j < numCols; j++)
    {
        let ck = formselementbyname(document.f, 'c'+j);
        if (ck!=null)  ck.checked = oldchecked[j];
    }
    document.f.btn.onclick = go;
    }
}
function changeprintdef()
{
    oldprinting = printing;
    printing = function(){
       oldprinting();
       let xx = formselementbyname(document.f, 'tborder');
       if (xx!=null){
       let q = document.createElement('span');
       q.innerHTML = '<input type=checkbox id=questiononly onclick=defaultfields(this)>' + textmsg[385] + "&nbsp;&nbsp;&nbsp;&nbsp;";
       xx.parentNode.insertBefore(q, xx.previousSibling);
       }
       xx = formselementbyname(document.f, 'rowselect');
       if (xx!=null)
       {
           let tr = xx.parentNode.parentNode;
           tr.style.display = 'none';
           let tb = tr.parentNode; 
           //if (tb.tagName.toLowerCase()!=='table') tb = tb.parentNode;
           tb.removeChild(tr);
       }
    }
    oldprintstyle = printstyle;
    printstyle = function(logo, tfontname, tfontsize, tfontcolor, bord, hfontname, hfontsize, hfontcolor, cfontname, cfontsize, cfontcolor,alljs,title)
    {
        guessFormat = function(str){return retrv(0,3);};
        oldprintstyle(logo, tfontname, tfontsize, tfontcolor, bord, hfontname, hfontsize, hfontcolor, cfontname, cfontsize, cfontcolor,alljs,title);
        guessFormat = oldguessFormat;
    };
    go = function()
    {
        let tl = makeprinttitle();
        if (document.f.tfontname.selectedIndex>=0)
        printstyle(document.f.logo.value,document.f.tfontname.options[document.f.tfontname.selectedIndex].value,document.f.tfontsize.value,document.f.tfontcolor.value,document.f.tborder.value,document.f.hfontname.options[document.f.hfontname.selectedIndex].value,document.f.hfontsize.value,document.f.hfontcolor.value,document.f.cfontname.options[document.f.cfontname.selectedIndex].value,document.f.cfontsize.value,document.f.cfontcolor.value,null,tl);
    };
    go1 = function()
    {
        let tl = makeprinttitle();
        if (document.f.tfontname.selectedIndex>=0)
        printstyle1(document.f.logo.value,document.f.tfontname.options[document.f.tfontname.selectedIndex].value,document.f.tfontsize.value,document.f.tfontcolor.value,document.f.tborder.value,document.f.hfontname.options[document.f.hfontname.selectedIndex].value,document.f.hfontsize.value,document.f.hfontcolor.value,document.f.cfontname.options[document.f.cfontname.selectedIndex].value,document.f.cfontsize.value,document.f.cfontcolor.value,null,tl);
    };
    printstyle1 = function (logo, tfontname, tfontsize, tfontcolor, bord, hfontname, hfontsize, hfontcolor, cfontname, cfontsize, cfontcolor,alljs,title1)
    {
        var nrec = numRows;
        var title2 = title1;
        printstylestr = logo + ',' + tfontname + ',' + tfontsize + ',' + tfontcolor + ',' + hfontname + ',' + hfontsize + ',' + hfontcolor + ',' + cfontname + ',' + cfontsize + ',' + cfontcolor + ',' + bord;
        localStorage["tableprintstyle"] = printstylestr;
        let str =  "<style>\nh1{font-family:" + tfontname + ";font-size:" + tfontsize + "pt;color:" + tfontcolor + ";text-shadow:#606060 1px 1px}\n"
                +   "h2{z-index:2;font-family:" + tfontname + ";font-size:" + (tfontsize-7) + "pt;color:" + tfontcolor + ";text-shadow:#606060 1px 1px}\n"
                + " td.heading{font-family:" + hfontname + ";font-size:" + hfontsize + "pt;color:" + hfontcolor + ";width:100px;font-weight:bold}\n"
                + " .quesans{font-family:" + hfontname + " !important;font-size:" + hfontsize + "pt !important;color:" + hfontcolor + " !important;}\n"
                + " #studentsign tr td{font-family:" + cfontname + " !important;font-size:" + cfontsize + "pt !important;color:" + cfontcolor + " !important;}\n"
                + " #maintbl tr td{font-family:" + cfontname + " !important;font-size:" + cfontsize + "pt !important;color:" + cfontcolor + " !important;}\n"
                + " td.cell{font-family:" + cfontname + ";font-size:" + cfontsize + "pt;color:" + cfontcolor + ";}\n</style>";
        str += "<title>" + (title1==null?rdapname:((j=title1.lastIndexOf('<br>'))>0?title1.substring(j+4):title1)) + "</title>\n</head>\n<body style=\"margin:4px 4px 4px 4px\" >";
        str += ("<center>\n<img src=" + logo + ">\n" +  "<h1>" + title1 + "</h1>\n<h3><table id=studentsign align=center cellspacing=5 cellpadding=4><tr height=40  ><td valign=middle><nobr>" + textmsg[673] + "</nobr></td><td  valign=bottom>___________ </td><td valign=middle><nobr> " + textmsg[1308] + "</nobr></td><td valign=bottom>_____________________________</td></tr></table></h3></center>\n<table style=\"border-radius:4px;border:0px #111 solid\" width="+ bord + " align=center><tr><td>");
        var needlatex = false;
        str += reformat8(); 
        str += "</td></tr></table><script  type=text/javascript src=curve.js></script>";
        if (retrv(0,3)=='2') str += 'true';
        postopen("printdoc.jsp",['wcds'],[str],'_blank');
    } 
}
function makeprinttitle()
{
    let tl = '';
        let homepage = parent.opener;
        if (homepage != null && homepage.document!=null)
        {
            let clientname = homepage.document.getElementById('clientname');
            if (clientname!=null)
            {
                tl = clientname.innerHTML + '<br>';
            }
        }
        let fr = parent.frames;
        if (fr != null)
        {
            let sel = fr[0].document.form1.semester;
            tl += sel.options[sel.selectedIndex].text + '<br>';
        }
        let ts = title.split(/:/);
        let tll = retrv(0,0);
        let tll1 = tll.toLowerCase();
        if (tll1.includes('mid') && (tll1.includes('exam') || tll1.includes('test')))
            tll = textmsg[1933].replace(/@.*$/,'');
        else if (tll1.includes('final'))
            tll =  textmsg[1933].replace(/[^@]+@/,'');
        tl += ts[0] + '<br>' + tll;
        return tl;
}
function setready(str){myprompt(str.replace(/\n/,'<br>') + '<br>' + textmsg[1321]);}
var ondeleted = "deleteAllAttached();delone();"; 
onbegin += ";initanchor();showattachment(mat[0][18]);redefine1();multichoice(1);changeprintdef();nodefault();checktemp();";
onsaved += ";if (needregrade) regradesubmission(0);else savetoafile();";
onsaved += "localStorage.removeItem(key0);";
if (numRows==0)
    onsaved += "document.getElementById('slink').style.visibility='visible';document.getElementById('delbtn').style.visibility='visible';document.getElementById('latebtn1').style.visibility='visible';";
if (parent.parent == parent && parent.opener!=null && onmydomain(parent.opener) && parent.opener.parent!=parent.opener && parent.opener.parent.frames.length>0 && typeof(parent.opener.parent.frames[0].refresh)=='function')
{
    onsaved += "parent.opener.parent.frames[0].refresh();";
}
onsaved += "nullifyall();backup();needsavefile=false;needregrade=false;needemail=false;";
//onsaved += "if (demokeyframen>0&&democursorsim!=null)demose26();";
function nullifyall()
{
    for (var j=0; j < numCols; j++)
    {
        holdvalues['0_' + j] = null;
    }
    valuechanged[0] = false;
}

var fsavetarget;
function savetoafile()
{
    if ( retrv(0,4)=='0' || retrv(0,4)=='2')
    {
        f1.formattxt.value = retrv(0,8);
    }
    if (needsavefile == false)  f1.formattxt.value = '';
    //if (f1.formattxt.value != '')
    {
        fsavetarget = f1.target;
        f1.action =   "assigndoc.jsp?savetodoc=1"; 
        f1.target =    'w' + tstmp;
        visual(f1);
        f1.submit();
        f1.target = fsavetarget;
        if (openedpreview!= null)
        {
            openedpreview.close();
            openedpreview = null;
        }
    }
}
var nextemailstr = null;
function savedazip(a)
{
    if (a == null) return;
    a =   '<div style="border:1px #b0b0b0 outset;padding:3px 3px 3px 3px">' + a + '</div><br>';
    var l = (new Date()).getTime();
    var y;
    if (retrv(0,0)!= '' && (emailtime == 0) && parseInt(retrv(0,2))*1000 > l)
    {
        var x = textmsg[1590] + "?";
        
        var cl = (retrv(0,18)==''? '#00AA00':'#AA0000');
        if (retrv(0,4)=='0'||retrv(0,4)=='1')
        {
            x +=  "<br> <input type=checkbox name=asattach id=needattach  onchange=\"chooseneedattach(this)\" ><font color=" + cl + ">" +  textmsg[1591] + "</font>";
        }
         
        if (promptwin == null && needemail)
        {
            nextemailstr = null;
            myprompt(a  + x,null,'if(v)sendnotice();else nullifyall()', null);
        } 
        else
        {
            nextemailstr = x;
            y = getpromptmsg();
            closeprompt();
            myprompt(  y + "<br>" + a + x, null,'if(v)sendnotice();else nullifyall()', null);
        }
    }
    else
    {
         y = getpromptmsg();
            closeprompt();
         if (retrv(0,0)!= '' && (emailtime > 0) && parseInt(retrv(0,2))*1000 > l  && needemail)
             a  = a.replace(/:/,"(<a href=javascript:reemail()>" + textmsg[1609] + '</a>):');
         myprompt(  y + '<br>' + a  , null, null, null);
    }
}
function reemail()
{
    emailtime = 0;
    myprompt("<center><textarea id=reemailtxt  rows=3 cols=50>" + textmsg[1610] + "</textarea><br><input name=send type=button value=\"" + textmsg[223] + "\" class=OrangeButton style=width:" + Math.round(4.5*font_size) + "px onclick=reemailsend(this)><input name=cancel  value=\"" + textmsg[18] + "\" type=button class=GreenButton style=width:" + Math.round(4.5*font_size) + "px onclick=closeprompt()></center>",null,null,textmsg[1609]);
}
function reemailsend(b)
{
    var tt = document.getElementById("reemailtxt").value;
    sendnotice(tt);
}
function giveyouformatedtxt(t)
{
    f1.formattxt.value = t; 
}
var wyewygstatus = false;
var wyewygqn=-1, wyewygright;
if (typeof(wyewyg) != 'undefined')
{
    var oldwyewyg = wyewyg;
    wyewyg = function(associatedtxt)
    {
        var ss = retrv(0,4);
        if ((ss =='1'|| ss=='3' || ss == '4') && (associatedtxt == ele(0,8) || associatedtxt == ele(0,9)))
        {
            syntax();
            wyewygstatus = true;
            //myprompt(textmsg[1571]);
            return;
        }
        oldwyewyg(associatedtxt);
        wyewygqn = editingquestionnumber;
        wyewygright = editingright;
        var zz = document.getElementById('movetool');
        if (zz!= null)zz.style.zIndex = 19;
        var w = document.getElementById('myprompt1');
        zz = w.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0];
        zz.style.cursor = 'pointer';
        zz.onclick = function()
     {
         wyewygqn = -1;
         closeprompt('myprompt1');
     };
    };
}
function whenwyewygchange(txt)
{
    if (wyewygright!= null) 
       updatea(editingmn, wyewygqn, txt);
    else
       updateq(editingmn, wyewygqn, txt);
    wyewygqn = -1;
}
function renaming()
{
    v = ele(0,0).value;
    if (leftwindow ==null || typeof(parent.frames[0].unique)=='undefined')
        return;
    var bb = leftwindow.unique(retrv(0,10),(numRows>0), v, retrv(0,5));
    if ( bb == false)        
    {
        myprompt(v + '('+ retrv(0,5) + ')' + textmsg[3]);
        ele(0,0).focus();
    }
    else if(numRows>0 && v!=x)
    {
        myprompt(textmsg[1572],null,"if(v)changerid('changeassn',mat[rr][0],retrv(rr,0),retrv(rr,5),retrv(rr,10),retrv(rr,11));else setv(rr,0,'" + x.replace(/'/g, "\\'") + "');",'');
    }
}

var oldlatepermit;
function latepermit()
{
    postopen("follows.jsp","x,course,sessions".split(/,/), ['latepermit',mat[0][10],retrv(0,5)],"w" + tstmp);
    
}
function setlateinfo(str)
{
    let xx = latepermit1().replace(/<td/, '<TD').replace(/<td/, '<td align=right');
    let xs = textmsg[1923].split(/@/);
    if (str == '')
    {
        myprompt("<center>" + xx + "<div style=font-size:12px> * " + xs[3] +   "</div> <br><input type=button class=\"tdbutton OrangeButton\" style=width:70px;cursor:pointer onmouseenter=matchboth() onmouseleave=erasematch() onclick=setlate(1) value=\"" + textmsg[225] + "\"><input type=button class=\"tdbutton GreenButton\" style=width:70px;cursor:pointer onclick=setlate(0)  onmouseenter=matchboth() onmouseleave=erasematch()  value=\"" + textmsg[18] + "\"></center>",null, null, textmsg[1574]);
        promptwin.style.width='240px';
        return;
    }
    
    let x = new CSVParse('<nobr>'+textmsg[673] + "</nobr>,<nobr>"+ xs[4] + "</nobr>,<nobr>" + xs[5] + '</nobr>'+ str, '"', ',', ';');
    let y = x.tohtml().replace(/<tr/, '<tr bgcolor=' + BBGCOLOR + ' ').replace(/<table /, '<table id=oldrecord cellpadding=3 width=100% ');
     myprompt("<table align=center cellpadding=3><tr><td valign=top width=55% >" + xs[0]+ ":"+ y + "<div style=font-size:12px>*" + xs[2] + '</div></td><td valign=top>' + xs[1] + ":"+ xx +   '<div style=font-size:12px;text-align:left;float:left >*' + xs[3] +   "</div></td></tr><tr><td colspan=2 align=center><input type=button class=\"tdbutton OrangeButton\" style=width:70px;cursor:pointer  onmouseenter=matchboth() onmouseleave=erasematch()  onclick=setlate(1) value=\"" + textmsg[225] + "\"><input type=button class=\"tdbutton GreenButton\" style=width:70px;cursor:pointer  onmouseenter=matchboth() onmouseleave=erasematch()  onclick=setlate(0)  value=\"" + textmsg[18] + "\"></td></tr></table>",null, null, textmsg[1574]);
     promptwin.style.width='450px';
    
}
let oldextensions= 1;
function   matchboth()
{
    Innergrid.leavingbox(false);
    let tbl = document.getElementById('oldrecord');
    if (tbl == null  ) return;
    let R = tbl.rows.length;
    var x = document.getElementById('Igdt0_19'); 
    for (let j = oldextensions; j < x.rows.length; j++)
    {
        var ta = x.rows[j].cells[0].innerHTML.replace(/<[^>]+>/g,'').replace(/&nbsp;/ig,'').replace(/ /g,'').replace(/[,|;]/g,'');
        for (let k=1; k < R; k++)
        {
            if (ta == tbl.rows[k].cells[0].innerHTML.replace(/ /g,'').replace(/&nbsp;/g,'') )
            {
                tbl.rows[k].cells[0].style.color = 'purple'; 
                break;
            }
        }
    }
}
function erasematch()
{
    let tbl = document.getElementById('oldrecord1');
    if (tbl == null) return;
    let R = tbl.rows.length;
    for (let k=1; k < R; k++)
    {
        tbl.rows[k].cells[0].style.color = 'black'; 
    }
}
function latepermit1()
{
    let e19 = ele(0,19);
    var xx = holdvalues['0_19'];
    if (xx==null||xx=='') xx = mat[0][19];
    if (e19!=null)
    {
       e19.setAttribute("type",'text'); 
       e19.style.width = '1px';
       e19.style.visibility = 'hidden';
       xx = retrv(0,19);
    }
    xx = xx.replace(/^[;|,]+/,'').replace(/[;|,]+$/,'');
    xx = xx.replace(new RegExp("."+ textmsg[673] + "[^;]+;"),"");
    var p = new CSVParse(xx,"|",",",";"); 
    xx = '';
    var i = 0;
    var r = null; oldextensions = 1;
    while ( (r = p.nextRow())!= null)
    {
        if (r[0] == ' ' || r[0] == '' || r[0] ==null || r[0].indexOf('&nbsp')==0) break;
        if (r[1] == null) r[1] = "3";
        if (r[1].includes("-")) continue;
        if (xx != '') xx+= ";";
        xx += "|" + r[0] + "|,|" + r[1] + "|";
        oldextensions++;
    }
    var yy = 1+ Math.ceil((-parseTime(ele(0,2).value) + (new Date()).getTime()/1000)/3600/24) ;
    oldlatepermit = xx;
    if (xx == '') 
        xx = "|<nobr>" + textmsg[673] + "</nobr>|,|<nobr>" + textmsg[1576] + "</nobr>|;| |,|" + yy + ".0|";
    else
        xx = "|<nobr>" + textmsg[673] + "</nobr>|,|<nobr>" + textmsg[1576] + "</nobr>|;" + xx + ";| |,|" + yy + ".0|";
     
    xx  = Innergrid.makeinnertable(xx,0, 19,true,true);
    return xx;
}
  
function doneextend(x)
{
    if (x == null)
        closeprompt();
    else
    {
       let y = new CSVParse(x,'|',",",";");
       myprompt(textmsg[1655] + y.tohtml(),null,null,textmsg[1574]);
    }
}
function setlate(v)
{
    Innergrid.leavingbox(false);
    if (v == 0)
    {
        setv(0,19, oldlatepermit);
    }
    else
    {
        var x = document.getElementById('Igdt0_19'); 
        var tt = '';
        for (var i=1; i < x.rows.length ; i++)
        {
            var ta = x.rows[i].cells[0].innerHTML.replace(/<[^>]+>/g,'').replace(/&nbsp;/ig,'').replace(/ /g,'').replace(/[,|;]/g,'');
            var tb = x.rows[i].cells[1].innerHTML.replace(/<[^>]+>/g,'').replace(/&nbsp;/ig,'').replace(/ /g,'').replace(/[,|;]/g,'');
            if (ta == '') break;
            if (tb ==='' || isNaN(tb))
            {
                tb = (1+ Math.ceil((-parseTime(ele(0,2).value) + (new Date()).getTime()/1000)/3600/24)) + '.0';
            }
            if (tt!= '') tt += ";";
            tt += ta + "," + tb;
        }
        if (tt !=oldlatepermit)
        {
           valuechanged[0] = true; 
           oldlatepermit = tt;
           holdvalues['0_19'] = tt;
           postopen("follows.jsp","subdb,semester,course,sessions,assignname,sid,newdue,x".split(/,/),
           [subdb,mat[0][11],mat[0][10],retrv(0,5),retrv(0,0),'',tt,'extenddue'],"w" + tstmp);
 
        }
        setv(0,19, tt);  
    }
    closeprompt();
   // ele(0,19).setAttribute("type", 'hidden');
}

function latemuch()
{
    Innergrid.leavingbox(false);
    var x = document.getElementById('Igdt0_19'); 
    var i =  x.rows.length - 2;
    var ta = x.rows[i].cells[0].innerHTML;
     
    if (ta == '')
    {
        var ts = document.body.getElementsByTagName('input');
        for (var j=0; j < ts.length; j++)
            if (ts[j].name == 'LatePermit')
                 ta = ts[j].value;
    }    
   
    ta = ta.replace(/<[^>]+>/g,'').replace(/&nbsp;/ig,'').replace(/ /g,'');
    
    if (ta!='' )
    window.open('follows.jsp?x=latepermit&course=' + mat[0][10] + '&sid='+ ta,'w' + tstmp);
}

function nodefault()
{


var w = retrv(0,4); 
 
if ( (w =='1' || w=='3') && duringopen())
{
    ele(0,9).style.fontSize = '6px';
    ele(0,9).style.color = '#cccccc';
}
if (isnewrecord)
{
    holdvalues['0_1'] = null;
    holdvalues['0_2'] = null;
    ele(0,1).value = '';
    ele(0,2).value = '';
}
}

var oldstrtoback = '';
function periodback()
{
    if (periodvalue == 1 && 
        (cc==9 || cc==8)   
        ) 
        tempsave();
}
//setTimeout(periodback, 300000);
function tempsave()
{
    //if ((new Date()).getTime() - timenow < 300000) return;
    var str = '';
    for (var j=0; j < numCols; j++)
    {
        if (j>0) str += ",";
        var  xx = retrv(0,j);
        if ((j == 5 || j==10 || j==11) && (xx==null||xx==''))
            xx = defaultRecord[j];
        if (xx==null)
            xx = '';
        else  if (typeof(xx.indexOf) != 'function')
        {
            ;
        }
        else if (xx.indexOf(',')>=0 || xx.indexOf(';')>=0)
            xx = "'" + xx.replace(/'/g, "''") + "'";
         
        str += xx;
    }
    localStorage[key0] = str;
}



function tempsaved()
{
    timenow = (new Date()).getTime();
    document.thisform.rsacode.value = "0";
}
function comparetemp(needshow)
{
    let k = 0;
    let s = '';
    for (let j=0; j < numCols; j++)
    {
        if (mat0[j]==null) mat0[j] = '';
        if (mat[0][j]==null) mat[0][j] = '';
        if (j==16 || mat0[j].replace(/^[\n| |\t]+/,'').replace(/[\n|\s]+$/,'') == mat[0][j].replace(/^[\n| |\t]+/,'').replace(/[\n|\s]+$/,''))
            continue;
        if (needshow)s += "<tr><td valign=top>" + labels[j] + "</td><td>" + mat0[j].replace(/</g,"&lt;") 
                + "</td><td>" + mat[0][j].replace(/</g,"&lt;") + "</td></tr>";
        k++;
    }
    if (!needshow) return k>0; 
    let ms = textmsg[1887].split(/@/);
    s = '<table border=1 cellspacing=0 cellpadding=5 style=border-radius:4px;border-collapse:collapse width=' + (0.8*thispagewidth()) + '><tr style=background:linear-gradient(var(--bbgcolor),var(--tbgcolor))><td>' + textmsg[128] 
            + '</td><td width=50%>' + ms[1] + "</td><td  width=50%>" + ms[2] + "</td></tr>" 
        + s + "</table>";
    let t=document.getElementById('comparetbl');
    if (k>0) t.innerHTML = s;
    else t.innerHTML = "The same";
    promptwin.style.left = '0px';
    promptwin.style.top = '0px';
    if (k==0) setTimeout('closeprompt()',2000);
    return k>0;
}
function temprestore()
{
    if (comparetemp(false) == false) return;
    var str1 = textmsg[1650];
    let ms = textmsg[1887].split(/@/);
    let cp = "";
    if (!isnewrecord)
        cp = "<input type=button class=GreenButton style=width:" + (4.5*font_size) + "px value=\"" + ms[0] + "\" onclick=comparetemp(true)>";
    str1+= "<br><center><div id=comparetbl></div><br>" + cp +"<input type=button class=OrangeButton style=width:" + (4.5*font_size) + "px value=\"" 
        + ms[3] + "\" onclick=keeptemp()><input type=button class=RedButton style=width:" + (4.5*font_size) + "px value=\"" 
        + ms[4] + "\" onclick=deletetemp()></center>";
    myprompt(str1);
    
}
function keeptemp()
{
    localStorage.removeItem(key0);
    for (var j=0; j < numCols; j++)
    {
        if (j==8 || j==9)
        {
            holdvalues['0_' + j] = "1";
        }
        else
            holdvalues['0_' + j] = mat[0][j];
    }
    valuechanged[0] = true;
    closeprompt();
}
function deletetemp()
{
    if (leftwindow!=null) leftwindow.demokeyframen = 0;
    for (var j=0; j < numCols; j++)
    {
       if (!isnewrecord && mat0[j]!=mat[0][j])
           setv(0,j,mat0[j]);
       if (mat0[j]!='' && j == 18) 
           showattachment(mat0[j]);
       holdvalues['0_' + j] = null;
    }
    if (!isnewrecord) mat[0] = mat0;
    else mat = [];
    localStorage.removeItem(key0);
    valuechanged[0] = false;
}
ele(0,12).parentNode.align = 'right';
ele(0,13).parentNode.align = 'right';
ele(0,12).style.textAlign = 'right';
ele(0,13).style.textAlign = 'right';
//document.body.style.marginLeft = '1px'; 


function getValuechanged(){return valuechanged[0];}

function reviewactivities(v)
{
    if (v==null)
    {
        if (mat[0][5].indexOf(',')<0)
            reviewactivities(mat[0][5]);
        else
        {
            var sessions = mat[0][5].split(/,/);
            var str = '';
            for (var i=0; i < sessions.length; i++)
            {
                str += '<a href=javascript:reviewactivities("' + sessions[i] + '")>' + sessions[i] + '</a><br>';
            }
            myprompt(str);
        }
    }
    else
    {
        postopen('visualwa.jsp',['course','assignname','sessionname','semester','subdb'],
                                [mat[0][10],mat[0][0],v,mat[0][11],subdb],'_blank');
    }
}
//onbegin += "shorterfoot();";
if (leftwindow!=null && leftwindow.demokeyframen > 0 
            && leftwindow.document.form1.assignname0.selectedIndex == 0 && numRows == 0)
    {
        demospeedup = leftwindow.demospeedup;
        onbegin += "demo();";
    }
var tx,demoxy;
var readnn = 0;
function asamplename()
{
    while (true)
    {
       var v = 'read' + (++readnn);
       var bb = true;
       if (leftwindow!=null) 
           bb = leftwindow.unique(retrv(0,10),false, v, retrv(0,5));
       if ( bb ) break;      
    }
    return v;
}
var demoxy;
demotasks = [
    ["democursory = 90; ele(0,4).focus();ele(0,4).selectedIndex = 0;tx = ele(0,0).parentNode.parentNode.cells[0];democursor2(tx,4)", 0],
    ["myHintx=democursorx; myHinty=democursory+30;showmyhint(0,1);closeprompt()", 1000],
    ["democursor2(ele(0,0),4)", 1000],
    ["ele(0,0).focus();demoheight(0.7)", 1000],
    ["demoheight(1);ele(0,0).value = 'r'", 500],
    ["ele(0,0).value = 're'",  100],
    ["ele(0,0).value = 'rea'",  100],
    ["ele(0,0).value = 'read'",  100],
    ["ele(0,0).value = asamplename()",  100],
    ["hidemyhint(); ele(0,0).onblur();democursor2(ele(0,1).parentNode.parentNode.cells[2],4)",100],
    ["myHintx = democursorx; myHinty = democursory+30; showmyhint(1,1)", 1000],
    ["democursor2(ele(0,1))", 3000],
    ["U(0,0); ele(0,1).focus(); demoheight(0.7); hidemyhint()", 1000],
    ["ele(0,1).onblur(); demoheight(1); democursor2(ele(0,2).parentNode.parentNode.cells[4],4)", 500],
    ["myHintx = democursorx; myHinty = democursory+30; showmyhint(2,1)", 1000],
    ["democursor2(democursorx+100,democursory);",2000],
    ["ele(0,2).focus(); demoheight(0.7); hidemyhint()", 1000],
    ["U(0,2);demoheight(1);democursor2(20,90)", 500],
    ["myHintx = 70; myHinty = democursory+30; showmyhint(4,1)",3400],
    ["hidemyhint(); democursor2(democursorx+100,democursory)", 3000],
    ["demoheight(0.7);ele(0,4).focus(); setv(0,4,'1'); U(0,4)",2000],
    ["demoheight(1);democursor2(document.getElementById('guidebtn'),4)", 500],
    ["demoheight(0.7);setv(0,8,'');document.getElementById('guidebtn').click()", 3000],
    ["demoheight(1);democursorsim.style.zIndex='450';democursor2(document.getElementById('examplebtn'),4)", 500],
    ["demoheight(0.7); example();", 3000],
    ["demoheight(1);democursorsim.style.zIndex='550';democursor2(democursorx + 15, democursory)", 500],
    ["demoheight(0.7); showrules(document.getElementById('examplebtn'))", 3000],
    ["demoheight(1);democursorsim.style.zIndex='600'", 500],
    ["democursor2(democursorx+150,democursory)",5500],
    ["demoheight(0.7); updatepoints(); setv(0,3,'2'); myws1('preview.jsp',0,document.getElementById('prevbtn'));", 2000],
    ["demoheight(1); demoxy = findPositionnoScrolling(promptwin);democursor2(demoxy[0]+15,demoxy[1] + 15)", 6000],
    ["demoheight(0.7); promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].click();closeprompt();", 5000],
    ["demoheight(1); democursor2(document.getElementById('optionbtn'))", 500],
    ["demoheight(0.7); closethis(); multichoice();",2000],
    ["demoheight(1); democursor2(document.formm.ff,4)",500],
    ["demoheight(0.7); document.formm.ff.selectedIndex = 1", 2000],
    ["demoheight(1); democursor2(document.formm.d,4)", 500],
    ["demoheight(0.7); document.formm.d.value = '20'", 2000],
    ["demoheight(1); democursor2(document.formm.btnemail,2)", 2000],
    ["democursor2(document.formm.w,100)", 2000],
    ["demoheight(0.7);document.formm.w.checked = true;", 2000],
    ["demoheight();democursor2(90, 120)", 500],
    ["demoheight(0.7); setback()", 3000],
    ["demoheight(1); democursor2(document.getElementById('savebtn'),2)", 500], 
    ["demoheight(0.7); closethis();", 2000],
    ["demoheight(1);tx=document.getElementById('assessbtn');democursor2(tx,2)", 500],
    ["demoheight(0.7);openassess();democursorsim.style.zIndex = '600'",2000],
    ["demoheight(1);tx=document.getElementById('assessnum');democursorx=80;democursory=160;demoxy=findPositionnoScrolling(tx);democursor2(demoxy[0]+10, demoxy[1]+10)", 1000],
    ["democursor2(tx.rows[1].cells[1],2)",3000],
    ["democursor2(tx.rows[6].cells[1],2)", 3000],
    ["democursor2(tx.rows[10].cells[1],2)", 2000],
    ["democursor2(tx.rows[1].cells[2],2)", 2000],
    ["demoheight(0.7); tx.rows[1].cells[2].innerHTML = '1,2';",3000],
    ["demoxy = findPositionnoScrolling(tx.rows[1].cells[2]); myHintx = demoxy[0]-200;myHinty = demoxy[1] + 70;showmyhintstr(textmsg[1838],1)", 1000],
    ["demoxy = findPositionnoScrolling(document.getElementById('assessinfo'));democursor2(demoxy[0] + 10, demoxy[1])", 3000], 
    ["demoheight(0.7); updateassess()", 3000],
    ["demoheight(1);democursor2(document.getElementById('savebtn'),2)", 500], 
    ["demoheight(0.7);closethis()", 3000],
    ["demoheight();hidemyhint(); demoremovesim();window.onbeforeunload = null; if(leftwindow!=null)leftwindow.demokeyframen = 0", 500]
];
 
//Name,Start,Due,Format,Type,Sessions,Grader,Status,Question,Answer,course,Semester,Scale,Weight,Options,coursetitle,timeformat,Assessment,Attach,LatePermits 
//captions[4] = textmsg[798].split

function getSelfile(fn, fc, tm)
{
    myprompt(fn + "  " + fc +  "  " + tm);
}

if (numRows>0)
   ResizeUploaded.initfolder = mat[0][10] + "/assignment";
else
   ResizeUploaded.initfolder = defaultRecord[10].replace(/^!/,'') + "/assignment"; 
var onloadbeforemkass  = null;
if (typeof window.onload == 'function')
onloadbeforemkass= window.onload;
window.onload = function()
{
    try{ 
    if (onloadbeforemkass!=null)   
        onloadbeforemkass();
    }catch(e){}
    document.form1.style.backgroundColor = null; 
    document.body.style.margin = "0px 0px -40px -2px";
    document.body.style.backgroundImage = 'linear-gradient(var(--bbgcolor),var(--dbgcolor))';
    document.form1.Start.size = 12;
    document.form1.Due.size = 12;
   // document.getElementsByName("table")[0].style.margin = "3px 0px 6px 0px";
    document.getElementById('maintable').parentNode.style.margin = "2px 3px 0px 0px";
    document.getElementById('maintable').style.margin = "0px 0px 0px 0px";
    document.getElementById('maintable').parentNode.parentNode.parentNode.parentNode.style.backgroundColor = IBGCOLOR;
    document.getElementById('maintable').parentNode.parentNode.parentNode.style.backgroundColor = IBGCOLOR;
    document.getElementById('maintable').parentNode.parentNode.style.backgroundColor = IBGCOLOR;
    document.getElementById('maintable').parentNode.style.backgroundColor = IBGCOLOR;
    let montop = localStorage["menuontop"];
    if (montop!=null && montop == 'true' && layout=='h')
    {
        buttonsmove1(document.getElementById('butswitch'));
    }
    else if (montop!=null && montop == 'true' && layout=='v')
    {
        buttonsmove(document.getElementById('butswitch'));
    }
    let ct = document.getElementById('copyrights');
    let sd = document.getElementById('sdhost');
    ct.style.display = 'inline';sd.style.display = 'inline';
    ct.parentNode.appendChild(sd);
};
function shorterfoot()
{
    let tbl = document.createElement("table");
    tbl.id='foot1';
    tbl.align='center';
    tbl.style.cssText = 'margin:3px 0px 0px 0px;';
    tbl.cellSpacing = 0;
    tbl.cellPadding = 0;
    tbl.innerHTML = "<tr><td></td><td></td><td></td><td></td></tr>";
    document.body.appendChild(tbl);
    let fs = window.frames;
    let k=0;
    for(k=0; k < fs.length; k++)
        if (window.frames[k].name.replace(/w[0-9]+/,'')=='')
            break;
    let sdhost = document.getElementById('sdhost');
    if (sdhost!=null) tbl.rows[0].cells[0].appendChild(sdhost);
    let mathj = document.getElementById('MathJax_Font_Test');
    if (mathj!=null)
    tbl.rows[0].cells[1].appendChild(mathj);
    let copyr = document.getElementById("copyrights");
    if (copyr!=null)
    tbl.rows[0].cells[2].appendChild(copyr);
    if (k<fs.length)
    tbl.rows[0].cells[3].appendChild(window.frames[k]);
}
function checktemp()
{
     
    if (localStorage[key0]!=null && leftwindow!=null )
    {
        temprestore();
    }
}
function darkall(el)
{
    if (el.tagName.toLowerCase() == 'textarea'||el.tagName.toLowerCase() == 'input'
            ||el.tagName.toLowerCase() == 'select');
    else
        el.style.backgroundColor = IBGCOLOR;
    if (el.childNodes!=null)
    for (let x in el.childNodes)
      darkall(x); 
}
//Name,Start,Due,Format,Type,Sessions,Grader,Status,Question,Answer,course,Semester,Scale,Weight,Options,coursetitle,timeformat,Assessment,Attach,LatePermits 
let withcode = false;
let shorten = false;
function studentlink()
{  
    if (!shorten)
    {
        let u = 'x,orgnum,subdb,semester,course,sessionname,assignname,atype';
        if (withcode) u += ",code";
        let v = ['encode6b',''+orgnum ,subdb,retrv(0,11),retrv(0,10),retrv(0,5),retrv(0,0),retrv(0,4)];
        if (withcode) v[v.length] = extract("cd");
        postopen('follows.jsp',u.split(/,/), v, 'w'+tstmp);
    }
    else
    {
        let key =  retrv(0,11) + "|" +   retrv(0,10)+ "|" +  retrv(0,5)+ "|" +  retrv(0,0);
        let v = subdb + "|" + 
        retrv(0,11) + "|" + 
        retrv(0,10)+ "|" + 
        retrv(0,5)+ "|" + 
        retrv(0,0);
        
        if(withcode) v += '|'+extract('cd');
        postopen('follows.jsp',  'x,c,atype,key'.split(/,/),["enforce6b", v,retrv(0,4),key],'w'+tstmp);
    }
}
function safelink(code6b) 
{
    let ms = textmsg[1888].split(/@/);
    let explicit = code6b.includes("orgnum=");
    if (explicit)
    {
        safelink0(code6b,"assigntest.jsp",1,ele(0,0));
    }
    else
    {
       code6b = code6b.replace(/code6b=/,"c=" + orgnum + "-");
       safelink0(code6b,"assigntest.jsp",1,ele(0,0)); 
    }
    let copybut = document.getElementById('copybutt');
        let tbl = copybut.parentNode.parentNode.parentNode;
        if (tbl.tagName.toLowerCase()!='table')
            tbl = tbl.parentNode;
     
    let tmp = extract('cd');
    if (tmp!=null && tmp!='' && tmp.indexOf('distinct')<0 && tmp.indexOf('attendance')<0)
    {
        let tr = tbl.insertRow(1);
        let td = tr.insertCell(-1);
        td.innerHTML = '<input id=chkaddcode type=checkbox onclick="javascript:withcode=!withcode;studentlink();" ' + (withcode?'checked':'') + ' > ' + ms[1];
    }
    let tr = tbl.insertRow(1);
    let td = tr.insertCell(-1);
    let y = code6b.includes("orgnum=");
    td.style.fontFamily = "var(--fontname)";
    td.style.fontSize = "var(--fontsize)";
    td.innerHTML = '<input id=chkshorten type=checkbox onclick="javascript:shorten=!shorten;studentlink();" ' + (shorten?'checked':'') + ' > ' + ms[0] ;
    
    document.getElementById('myprompthead').innerHTML = textmsg[1872];
}


moresetting = function()
{
    let s = 'numCols=' + numCols;
    for (let i=0; i < numCols; i++)
    {
        let x = ele(0,i);
        if (x == null)
            s += i + ': null<br>';
        else if (x.tagName.toLowerCase() == 'select')
            s += i +':' + x.name + '=' + x.options[x.selectedIndex].value + '<br>';
        else  
            s += i +':' + x.name + '=' + x.value + '<br>';
    }
    myprompt(s);
}

function loadScript(src) {
    let script = document.createElement('script');
    script.src = src;
    document.body.append(script);
}
function splitreg(s, r)
{
    let k =0;
    let l, j;
    let c = new Array();
    c[0] = 0;
    while (true)
    {
        let m = r.exec(s.substring(k));
        if (m == null) break;
        c[c.length] = k+m.index;
        k += m.index + m.toString().length;
    }
    c[c.length] = s.length;
    var a = new Array(c.length-1);
    for (let i=0; i < c.length-1; i++)
    {
        a[i] = s.substring(c[i], c[i+1]);
    }
    return a;
}

function shuffle()
{
    if ((new Date()).getTime() >= parseInt('' + retrv(0, 1)) * 1000)
    {
        myprompt('You can not reorder questions after assignment started.');
        return;
    }
    h0 = new Hwtake("prev", retrv(0,8), '', '', retrv(0,17), retrv(0,3),-1);
    var spt  = new RegExp("[" + h0.rorn + "]+" + h0.delimiter + h0.langsep,"i");
    var arr = splitreg("@\n" + retrv(0,8), spt);     
    var A = arr[0].substring(2).replace(/^[ |\n|\r]+/,'').replace(/[ |\n|\r]+$/,'');
    var mp = [];
    let quarr = [];
    let N = (arr.length)
    for (let i=1; i < arr.length; i++)
    {
        var m = spt.exec(arr[i]);
        if (m == null) {continue;}
        var s = m.toString();
        var l = m.index + s.length;
        s = s.replace(/[^0-9]/g,'');
        mp[s] = i;
        quarr[i] =   arr[i].substring(l).replace(/^[ |\n|\r]+/,'').replace(/[ |\n|\r]+$/,'');
    }
    
    arr = splitreg(("@\n" + retrv(0,9)), spt); 
    let B = arr[0].substring(2).replace(/^[ |\n|\r]+/,'').replace(/[ |\n|\r]+$/,'');
    var extra = mp.length;
    var newarr = new Array();
     for (let i=1; i < arr.length; i++)
    {
        var m = spt.exec(arr[i]);
        if (m == null) { continue;}
        var s = m.toString();
        var l = m.index + s.length;
        s = s.replace(/[^0-9]/g,'');
       
        var jj = mp[s];
        if (jj==null || ''+jj == 'NaN')
            jj = extra++;
        newarr[jj] = arr[i].substring(l).replace(/^[ |\n|\r]+/,'').replace(/[ |\n|\r]+$/,'');
       
    } 
    
    var a = [];
    for (let j=0; j < N-1; j++)
        a[j] = j;
    a = Hwtake.shuffle(a);
   
   
    for (let i=0; i < N-1; i++)
    {A += '\n\n'+ (i+1) + ". " + quarr[a[i]+1]; B +='\n\n'+ (i+1) + ". " + newarr[a[i]+1];}
    setv(0,8,A);
    setv(0,9,B);
}

function reordernum()
{
    if ((new Date()).getTime() >= parseInt('' + retrv(0, 1)) * 1000)
    {
        myprompt('You can not reorder questions after assignment started.');
        return;
    }
    h0 = new Hwtake("prev", retrv(0,8), '', '', retrv(0,17), retrv(0,3),-1);
    var spt  = new RegExp("[" + h0.rorn + "]+" + h0.delimiter + h0.langsep,"i");
    var arr = splitreg("@\n" + retrv(0,8), spt);     
    var newstr = arr[0].substring(2);
    var mp = [];
    for (let i=1; i < arr.length; i++)
    {
        var m = spt.exec(arr[i]);
        if (m == null) {continue;}
        var s = m.toString();
        var l = m.index + s.length;
        s = s.replace(/[^0-9]/g,'');
        mp[s] = i;
        newstr += "\n\n" + i + ". " + arr[i].substring(l).replace(/^[ |\n|\r]+/,'').replace(/[ |\n|\r]+$/,'');
    }
    setv(0,8,newstr);
    arr = splitreg(("@\n" + retrv(0,9)), spt); 
    newstr = arr[0].substring(2);
    var extra = mp.length;
    var newarr = new Array();
     for (let i=1; i < arr.length; i++)
    {
        var m = spt.exec(arr[i]);
        if (m == null) { continue;}
        var s = m.toString();
        var l = m.index + s.length;
        s = s.replace(/[^0-9]/g,'');
       
        var jj = mp[s];
        if (jj==null || ''+jj == 'NaN')
            jj = extra++;
        newarr[jj] = ''+jj + ". " + arr[i].substring(l).replace(/^[ |\n|\r]+/,'').replace(/[ |\n|\r]+$/,'');
       
    } 
    for (let i=1; i < newarr.length; i++)
    if (newarr[i] == null)
        newstr += ''+ i + ". \n\n";
   else
       newstr += newarr[i] + "\n\n";
    setv(0,9,newstr);
}
 
function backupbeforesave()
{
    var key = (orgnum%65536) + '-' + retrv(0,11) + '-' +   retrv(0,10) + "-" +  retrv(0,5).replace(/,/g,'-') + '-'+ retrv(0,0);
    let v = new Array(numCols);
    v[0] = (new Date()).getTime();
    for (let c =0; c < numCols; c++)
    {
        v[c+1] = holdvalues['0_' + c];
        if (v[c+1] == null) v[c+1] = retrv(0,c);
        if (v[c+1] == null) v[c+1] = mat[0][c];
    }
    
    let y = JSON.stringify(v);
    localStorage[key] = y;
}
function backup()
{
    if (ele(0,8).value.length < 100 || !needsavefile) return;
    var key = (orgnum%65536) + '-' + retrv(0,11) + '-' +   retrv(0,10) + "-" +  retrv(0,5).replace(/,/g,'-') + '-'+ retrv(0,0);
    downloadaswell("mysql/CREATE TABLE Assignment\n" + ~~((new Date()).getTime()/1000) + ",'" + mat[0][0] + "','" + mat[0][10] + "','" + mat[0][11] 
         + "','" +mat[0][5] + "'," + mat[0][1] + ","  + mat[0][2] + ",'" + mat[0][8].replace(/'/g,"''") 
         + "','" + mat[0][9].replace(/'/g,"''") + "','" +  mat[0][3] + "'," + mat[0][4] + ",'" +  mat[0][14].replace(/'/g,"''") + "'," +
         mat[0][7] + "," +  mat[0][12] + "," +  mat[0][13] + ",'','" +  mat[0][6] + "','" + mat[0][17] + "','" +  mat[0][18] + "','" 
         +  mat[0][19] + "','" +  mat[0][20] + "'",key + '.bak');
    
}
function fromsaved()
{
     myprompt('<input type=hidden id=hidetxt><input type="file" style="border:1px #b0b0b0 solid;" id=localpath onchange="openlfile(this)" ><div></div>', null,null,'File');
}
function openlfile(td)
{
    var key = (orgnum%65536) + '-' + retrv(0,11) + '-' +   retrv(0,10) + "-" +  retrv(0,5).replace(/,/g,'-') + '-'+ retrv(0,0);
    if (!td.value.includes(key + ".bak"))
        td.nextSibling.innerHTML = "Original file saved automatically should have been named as " + key + ".bak. But this file name(" + td.value + ") is not that one. Do you still  want to load the file and override the current record?"
        + "<br><center><input type=button class=OrangeButton style=width:78px value=OK onclick=\"loadanyway();closeprompt()\"><input type=button class=GreenButton style=width:78px value=Cancel onclick=closeprompt()></center>";
    else loadanyway();
}

function loadanyway()
{
    let x = document.getElementById("hidetxt");
    let td = document.getElementById("localpath");
    openfileto(td, x, afterloadlocal);
}
afterloadlocal = function()
{
    let x = document.getElementById("hidetxt");
    let p = new CSVParse(x.value, "'", ",","\n");
    let arr = p.nextRow();
    arr = p.nextRow(); if (arr == null) return;
    let mp = [21,0,10,11,5,1,2,8,9,3,4,14,7,12,13,6,17,18,19,20];
    for (let j =1; j < mp.length; j++)
        mat[0][mp[j]] = arr[j];
     for (let ii =0; ii < numCols; ii++)
             setv(0, ii, mat[0][ii]);
     
}
var justparsed;
function useparsed()
{
    for (let ii =0; ii < numCols; ii++)
    { mat[0][ii] = justparsed[ii+1];  setv(0, ii, justparsed[ii+1]);}
}
function fromcached()
{
     var key = (orgnum%65536) + '-' + retrv(0,11) + '-' +   retrv(0,10) + "-" +  retrv(0,5).replace(/,/g,'-') + '-'+ retrv(0,0);
     let y = localStorage[key];
     if (y!=null)
     {
        justparsed = JSON.parse(y);
        myprompt('Last caching time: ' + (new Date(parseInt(justparsed[0]))).toTimeString() + ".<br>Load this cached record to override the current one?", null,
        "if(v)useparsed()",textmsg[1866].split(/@/)[3]);
     }
     else
         myprompt('No cached record found on this machine.You may try other machine that you used to edit ' + key);
}
loadScript('assigncontrol.js');
                                                    