 var Ff, Sf = document.form;
 var count = 0;
 var validated = false;  
 var count = 0, acts, popwin, popstr,  sourcestr, languagestr, 
 quick, flagstr,   areacols = 60, arearows=30, photowin;
 var deletnum = -1;
 
 
 function webservice(fm, fmt, j)
 {
     Ff = fm;
    
     if (handler[j] == 'preview.jsp')
         fmt.value = whichFormat(fm.content);
     if (handler[j] == 'UploadTeaching')
     { 
         
         disablethem(fm);
         fm.encoding="multipart/form-data";
     }
     else
     {
        fm.encoding='application/x-www-form-urlencoded';
     }

     if ( fm.name == 'form')
     {
         if (asso[j].name != 'content')
            asso[j].value = fm.content.value;
     }
     else
     {
         var i = parseInt(fm.name.charAt(fm.name.length - 1));
         if (assom[i][j].value != 'content')
             assom[i][j].value = fm.content.value;
     }
         
     formnewaction(fm,handler[j]);
     if (submitonly && type.indexOf("test;") >= 0 && type.indexOf(";o:") < 0)
         popwin = 'helpwindow';
     else 
         popwin = 'servicewin'; 
     popstr = 'toolbar=0,location=0,directories=0,status=0,menubar=0,alwaysRaised=1,scrollbars=1,resizable=1,width= 280,height= 150';
     
     var nav2 = window.open('', popwin ,popstr);
     nav2.document.writeln('<html>' + metaencode +'<head><title>'+textmsg[124]+'<title></head><body '+ colorstr + '>'+textmsg[203]+'.</body></html>');
     nav2.focus();
     fm.target =  popwin ; 
    visual(fm);
 fm.submit();
     fm.encoding='application/x-www-form-urlencoded';
     enablethem (fm);
 }
var nav1 = null;
var format = '0';
var ms = '';
function saveupdate(fm, fmt, ii, which, targ)
{ 
   chuncate(fm.content); 
   fm.comment.value = fm.comment.value.replace(/^question or notes/,'');
   if ('' + fmt !='0')
       checkHTML(fm.content);
   
   fmt.value = whichFormat(fm.content);
   Ff = fm;
   
  count = ii;
  if (which == 'delete' && confirm(textmsg[204]) == false)
     return; 
  else 
     delednum = ii;
  if (ii!=-1 && which=='update' && confirm(textmsg[205]) == false)
     return;

  if ( which=='update'&& edited(ii)=='') return;
  
  if (which == 'submit' || which == 'submittest')
  {
      if (whichact=='submit')
          fm.content.value = fm.content.value.replace(/^Copy paste your answer here/,'');
      if (fm.content.value.length < 2 )
      {
          if (whichact!='')
              alert(textmsg[206]);
          fm.content.focus();
          return;
      }
   }

   

   //assignname,comment,grade,submtime,content
   if (count > -1)
   {
      Ff.submtime.value = timestr(M[count][3]);
   }
   Ff.option.value = which;
    
    
   from = ii;
   if ( targ != 'helpwindow')
   {
   //targ = 'updatewindow'; 
   popstr = 'toolbar=0,location=0,directories=0,status=0,menubar=0,alwaysRaised=1,scrollbars=0,resizable=1,width= 280,height= 150';
   nav1 = openblank(targ ,popstr,textmsg[124]);
   nav1.document.writeln(colorstr + '>'+textmsg[203]+'.');
   endDocWrite(nav1);
   }
   
   if (targ == 'helpwindow') 
     formnewaction(Ff,'updatesubmission.jsp?target=parent.lowerwin');
   else if (targ == 'none')
     formnewaction(Ff,'updatesubmission.jsp?target=none');
   else
     formnewaction(Ff,'updatesubmission.jsp?');
   Ff.target =  targ ; 
     
  visual(Ff);
 Ff.submit();
} 

function newsubtime(v)
{
   M[count][3] = v;
   Ff.submtime.value = timestr(M[count][3]);
}
 
function openit(str)
{ 
    window.open(str,'answer','toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=400,height=400');
}

function fillass()
{
       return;
     var l =  Sf.assignname.options.length - 1;  
     for (; l >= 0; l--)
         Sf.assignname.options[l] = null;
     var kk=0;
     for (l = 0; l < numassigns; l++)
     {
           var tt = P[l];
           var k = 0; 
           while (k < numRows && M[k][0] != tt) k++;
           if (k==numRows)
           {    
               Sf.assignname.options[kk] = new Option(tt,tt); 
               kk++;
           }
     }
     Sf.assignname.options[kk] = new Option(textmsg[207],'');
     Sf.assignname.selectedIndex = kk;
 
}
 var from, fromindex, to;
 function changeass(fm, select, k)
 {
    var original = M[k][0];
    for ( fromindex = 0; fm.assignname.options[fromindex].value != original; fromindex++);
    if (select.selectedIndex <0) return;
    var cvalue = select.options[select.selectedIndex].value;
    for (to = 0;  to < numRows && cvalue != M[to][0]; to++);
    from = k;
     
    if ( to < numRows) 
    {
        seeAss(fm,  'renamewith' + M[k][0] ); 
    }
    else
    { 
        seeAss(fm,   'rename    ' + M[k][0] );
    }
}

function syn(act)
{
     
    if (preface == '') return; 
    if ( act.indexOf( 'submit') == 0 || act.indexOf('submittest') ==0 )
    {
        
       var assignvalue = "";
       if (submitonly)
           assignvalue = Sf.assignname.value;
       var subtime = act.replace(/[a-z]+:/,''); 
        
       var x = Sf.content.value.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\/\/\/\/(.*)/g, "</pre><font color=red>//$1</font><pre>");
       Sf.submtime1.value=subtime;
       ms = Sf.content.value;
       popwin = 'reviewwin';
       popstr = 'toolbar=0,location=0,directories=0,status=0,menubar=1,alwaysRaised=1,scrollbars=1,resizable=1,width= 800,height= 560';
       if (nav1 != null) nav1.close();
       nav1 = window.open('', popwin ,popstr);
       nav1.document.writeln('<html><body '+ colorstr+ '> <center> <H2> <font color=red> ' + courseTitle + ": " + 
       assignvalue +  
       '</font></H2> <br>'+textmsg[208]+' 0'  + subtime + ' '+textmsg[36]+' ' + timestr(subtime) + '<br><font color=teal>' + textmsg[398] +'</font><br></center><pre> ' + x + '</pre>  ');
        
       if (whichact=='submit')
       {
           whichact='update';
       }
       Sf.submit9.value='Update'; 
    }
     else if ( act.indexOf( 'delete') == 0)
    {
         alert(textmsg[399]);
         deletnum = count; 
         window.open("studentsubmission.jsp?id=" + iid + "&course=" + escape(course) + "&ssn=" + escape(ssn)+"&courseTitle=" + escape(courseTitle),"rightwinmoniter"); 
         
    }
    else if ( act.indexOf( 'renameit') == 0)
    {
        var xx = "    ";
        if ( to < numRows )
        {
            xx = "with";
        }
        saveupdate(fref[from], from, "rename" + xx + M[from][0]);
    }
    else if (act.indexOf('rename') == 0)
    {
       if ( to < numRows )
       {
          M[to][0] = M[from][0];
          var j = 0;
          for (; fref[to].assignname.options[j].value != M[to][0]; j++);
          fref[to].assignname.selectedIndex = j;
       }
       if (fref[from].assignname.selectedIndex >= 0)
       {M[from][0] = fref[from].assignname.options[fref[from].assignname.selectedIndex].value;
       fillass();
       }
    }
    else if ( act.indexOf('update') == 0)
    {
        
       if (submitonly==false)
        {
        M[from][1] = fref[from].comment.value;
        M[from][3] = act.substring(7);
        M[from][4] = fref[from].content.value;
        fref[from].submtime.value = timestr(M[from][3]);
        fref[from].submtime1.value =  M[from][3];
        review(fref[from], from);
        }
        else
           Sf.submtime1.value=act.substring(7);
    }
     
    else if ( act.indexOf( 'back') == 0 )
    {
        if (submitonly==false)
            fref[from].assignname.selectedIndex = fromindex; 
    }
    else if ( act.indexOf( 'web') == 0 )
    {

        Ff.content.disabled = false; 
        Ff.content.value += "\n" + regloc + act;
        Ff.content.focus();
          
        alert(  textmsg[209]+" '" + Ff.submit9.value + "' "+ textmsg[183] );
    }
     
     
}


function seeAss(fm,  field)
{  
      if (fm.name == 'form' && fm.assignname.selectedIndex>=0 )
     {
        var xx =fm.assignname.options[fm.assignname.selectedIndex].value;
        var kk=0; for (; kk < P.length && P[kk] !=xx;  kk++);
        if (kk < P.length)
        {
           currentDue = duelong[kk];
           Sf.submtime.value = timestr(currentDue);
        }
        else
        {
           currentDue = ts;
           Sf.submtime.value = "";
        }
        
     }
      
     formnewaction(fm, 'assigndoc.jsp?option=des');

      
     popwin = 'submissionwin';
     popstr = 'toolbar=0,location=0,directories=0,status=0,menubar=0,alwaysRaised=1,scrollbars=1,resizable=1,width= 500,height= 400';
      
     nav1 = window.open('', popwin ,popstr);
     nav1.document.writeln('<html><body '+ colorstr+ '>'+textmsg[203]+'.</body></html>');
     nav1.focus();
     fm.target =  popwin ; 
     fm.option.value = field ;
      
    visual(fm);
 fm.submit(); 
}
 
function resizeCont()
{
     optl=optl.replace(/ /g, '');
     optl=optl.replace(/type=hidden/g,'');
     
     if (mm < 4) mm = 4;
     var winW = 700, winH = 500, x;
    if (parseInt(navigator.appVersion)>3) 
    {
         if (navigator.appName=='Microsoft Internet Explorer') 
        {
           winW = document.body.offsetWidth;
           winH = document.body.offsetHeight;
           areacols = (winW-41)/9.3;
           arearows= (winH-120)/18;
           if ( arearows < 1) arearows = 1;
           if (areacols < 10) areacols = 10;
           if (submitonly) 
           {
              Sf.content.cols=areacols;
              Sf.content.rows=(winH-95)/15;
           }
           else
           for (var i=0; i < numRows; i++) 
           {
             fref[i].content.cols=areacols;
             var tt = (winW - 70*mm  - 300)/6.1;
              
             if (optl.indexOf('type=')>0) tt = 20; 
             if (tt < 3) tt = 3;
             fref[i].comment.size = tt;
           }
        } 
        else  //if (navigator.appName=='Netscape') 
        {
            winW = window.innerWidth;
            winH = window.innerHeight;
          
            areacols = (winW-42)/9.5;
            arearows= winH/15;
            if ( arearows < 1) arearows = 1;
            if ( areacols < 10) areacols = 10;
            if (submitonly) 
           {
              Sf.content.cols=areacols;
              Sf.content.rows=(winH-95)/18.4;
           }
           else
            for (var i=0; i < numRows; i++) 
            {
                fref[i].content.cols = areacols;
                var tt = (winW - 70*mm - 300)/8;
                if (optl.indexOf('type=')>0) tt = 18.4;
                if (tt < 3) tt = 3
                fref[i].comment.size = tt;
            }
        }
      
        var  ll = Sf.elements.length;
        for (var jj = 0; jj < ll; jj++)
        if (Sf.elements[jj].name.indexOf("submit")>=0
         || Sf.elements[jj].name.indexOf("webservice")>=0)
            Sf.elements[jj].width = 60;

    for (var i=0; i < numRows; i++)
    {
         ll = fref[i].elements.length;
         for (var jj = 0; jj < ll; jj++)
         if (fref[i].elements[jj].name.indexOf("submit")>=0
         || fref[i].elements[jj].name.indexOf("webservice")>=0)
            fref[i].elements[jj].width = 60;
    }
  }
} 
   
function populate(f, n)
{  
     //assignname,comment,grade,submtime,content
     var i, j;
     f.content.value = M[n][4];
     f.comment.value = M[n][1].replace(/^#/,'');
     
     if (M[n][2] != '') 
     {
        if (f.comment.value == '') 
           f.comment.value = 'question or notes';
        return;
     }
     if (f.comment.value == '')
         f.comment.value = 'question or notes';
     for ( j =0; j < numassigns && f.assignname.options[j].value != M[n][0];  j++);
     if ( j == numassigns) 
     {
         f.assignname.options[j] = new Option(M[n][0], M[n][0]);
     }
     f.assignname.selectedIndex = j;
}

function tic()
{
   ts += 2;
   var secondLeft = currentDue - ts;
   if (submitonly && type.indexOf("test;") >= 0 && type.indexOf(";o:") < 0)
   {
      occupy();
   } 
   
   if (secondLeft < 0 && secondLeft > -5)
   {
      
      if (type!=null && type.indexOf("test;")==0)
           Sf.timer.value = "Time over";
      else
           Sf.timer.value = "Passed Due"; 
   }
   if (secondLeft < 0) return;

   var hour = Math.floor(secondLeft/3600);
   var days = Math.floor(hour/24);
   hour = hour%24;
   var seconds = secondLeft%3600;
   var minutes = Math.floor(seconds/60);
   seconds = seconds%60;
   if (days > 0)
       Sf.timer.value = days +"d";
   else 
       Sf.timer.value = "";
   
   
   Sf.timer.value  +=  hour  + "h" + minutes  + "'" +  seconds +"''";
   Sf.timer.value = Sf.timer.value.replace(/^0[a-b]/,'');
   
}
function timerswitch(rd){ if (rd.checked)Sf.timer.style.visibility="";else Sf.timer.style.visibility = "hidden";}

function starttimer()
{
    
   if (currentDue <= ts)
   {
      
      if (type!=null && type.indexOf("test;")==0)
           Sf.timer.value = "Time over";
      else
           Sf.timer.value = "Passed Due"; 
   }
   window.setInterval( "tic()", 2000 );
}
function succ(){}

var Ms = '';

function edited(i)
{
     if (submitonly) 
     {
        if ( ms.replace(/\r/g,"") != Sf.content.value.replace(/\r/g, "")) 
        {
           return 'content';
        }
        return '';
     } 
     var j = fref[i].assignname.selectedIndex;
     if ( M[i][4].replace(/\r/g,"") != fref[i].content.value.replace(/\r/g, "")) 
     {
         return 'content';
     }
     fref[i].comment.value = fref[i].comment.value.replace(/^question or notes/,'');
 
     if ( M[i][1] != fref[i].comment.value && M[i][1] != '#'+fref[i].comment.value ) 
         return 'comment';
     return '';
}  

var preface = "The window is going to be refreshed. ";

function warn()
{ 
   if (submitonly)
   {
      var changed = edited(-1);
      if ( changed == 'content' && confirm(preface + textmsg[210]))
      {
           saveupdate(Sf, -2 , whichact, 'none');
           preface = "";
      }
      return;
   }
   
   for (var i=0; i < numRows; i++)
   { 
     if (M[i][2] =='' && deletnum != i)
     {
        var changed = edited(i);
        if ( changed == 'content' && confirm(preface + M[i][0] + textmsg[211]))
        {
           saveupdate(fref[i], i, 'update','none');
           preface = "";
        }
        else if ( changed == 'comment')
        {
           saveupdate(fref[i], i, 'comment','none');
           preface = "";
        }
     }
   }
   //warndone = true;
}

function warn0()
{
   preface = textmsg[212];
   warn();
}

function  popdata()
{
   for (var i = 0; i < numRows; i++) 
     populate(fref[i],i );
}
var nav1 = null;
function review(fm, ii)
{
     var x = fm.content.value.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\/\/\/\/(.*)/g, "</pre><font color=red>//$1</font><pre>");
     
     popwin = 'reviewwin';
     popstr = 'toolbar=0,location=0,directories=0,status=0,menubar=0,alwaysRaised=1,scrollbars=1,resizable=1,width= 800,height= 560';
     
     if (nav1 != null) nav1.close();
     nav1 = window.open('', popwin ,popstr);
     nav1.document.writeln('<html>' + metaencode +'<body '+ colorstr+ '> <center> <H2>' +  courseTitle  + '<br> ' + M[ii][0] + '</H2></center><table><tr><td valign=top ><b>'+textmsg[28]+'</b> </td><td>' + M[ii][2]
     + '</td></tr><tr><td valign=top><b>'+ textmsg[36]  + '</b></td><td>' + timestr(M[ii][3]) + '</td></tr><tr><td  valign=top><b>'+textmsg[143]+'</b></td><td>' + fm.comment.value + '</td></tr><tr><td  valign=top><b>'+textmsg[213]+'</b></td><td><pre>'
     + x + '</pre></td></tr></table>');
}
  
createfref();
popdata();
fillass();
//window.onresize = resizeCont; 
window.onunload = warn0;
resizeCont();
if (submitonly) starttimer();
function makebut(color, capt)
{
  return   "<input style=background-color:" + color +";color:antiquewhite;font-weight=700;width:60  type=button  value=\"" + capt +"\">";
}
var helpstr0 = helpstropt   + makebut("black","Question") + textmsg[214]+'<br>';
helpstr0 = "<font color=purple><b>"+textmsg[215]+"</b></font><br>"; // +helpstr0.replace(/!/g,":");
 

function showhelp0()
{ 
  helpstr = "<font color=purple><b>"+textmsg[222]+"</b></font><br>"+textmsg[216]+"<br><BR>";
  if (submitonly && type.indexOf("test;")>=0 && type.indexOf(";o:")<0)
     helpstr += "&bull; "+Toolbox.msg[699]+"<br>";
  helpstr += helpstr0   + makebut("#CC0000", textmsg[61]) + textmsg[217]+".<br>" + helpstropt.replace(/!/g,":")
  + "<br><br><b style=color:purple>"+textmsg[218]+"</b><BR>1. "+textmsg[219]+"<br>2. "+textmsg[220]+"<br>"
 + "3. "+ textmsg[221]+" "
  + makebut("#CC0000", textmsg[61]) +
  "<br>";
  helpstr +=   "</body></html>";
  helpstr = helpstr.replace(/Table Fields/,'Function Buttons').replace(/!/g, ":").replace(/table   bgcolor=lightblue/g,'table ');
  if (submitonly && type.indexOf("test;")>=0 && type.indexOf(";o:")<0)
     parent.helpwindow.document.write(helpstr);
  else 
     showhelp();
}
function showhelp1(fg)
{
  helpstr  = helpstr0  ;
  
  helpstr +=  makebut("#0000FF", textmsg[223]) + textmsg[224]+".<br>"
           +  makebut("black",textmsg[178]) + textmsg[214]+'<br>';
  if (fg==1 )
  {
    helpstr += makebut("#CC0000", textmsg[225]) + textmsg[226]
            +". <br>" + makebut("#CC0000", textmsg[69]) + textmsg[227]+'<br>';
  }
  helpstr +=  helpstropt.replace(/!/g,":");
  if (fg==1)
  {
    helpstr +=    "<br><br><b style=color:purple>"+textmsg[228]+"</b><br>"+textmsg[229];
  }
  else
  {
    helpstr +=
    "<br><br><b style=color:purple>"+textmsg[230]+"</b><br>"+textmsg[231];
  }
   
    helpstr +=   "</body></html>";
  helpstr = helpstr.replace(/Table Fields/,'Function Buttons').replace(/!/g, ":").replace(/table   bgcolor=lightblue/g,'table ');
  showhelp();
}
function showhelp2()
{
  helpstr  = helpstr0 + 
    makebut("#0000FF", textmsg[223]) + textmsg[232]+".<br>"
   +makebut("black",textmsg[178]) + textmsg[214]+'<br>'
   + makebut("#0000CC", textmsg[144]) + textmsg[233];
  helpstr +=  "</body></html>";
  helpstr = helpstr.replace(/Table Fields/,'Function Buttons').replace(/!/g, ":").replace(/table   bgcolor=lightblue/g,'table ');
  showhelp();
   
}

/*
if (submitonly =false && assname != null && numRows == 0) 
{
 var lg = Sf.assignname.options.length;
 var ind = 0;
 for (; ind < lg && Sf.assignname.options[ind].value !=  assname ; ind++);
 if (ind < lg)
 {
     Sf.assignname.selectedIndex = ind;
     currentDue = duelong[ind];
     Sf.submtime.value = timestr(currentDue);
 }
 else
 {
     Sf.assignname.selectedIndex = lg-1;
 }
}*/

 
function disablethem (fm)
{
  for (var jj = fm.elements.length-1; jj>=0; jj--)
      if (fm.elements[jj].name != 'course' 
         && fm.elements[jj].name != 'File'
         && fm.elements[jj].name != 'subfolder'
        )
        fm.elements[jj].disabled = true;
}

 
function enablethem (fm )
{
  for (var jj = fm.elements.length-1; jj>=0; jj--)
      fm.elements[jj].disabled = false;
}

function cut(txt, para)
{
       if (para == null) return '';
       var ll = para.length; 
       if ( ll == 0) return '';
       
       var LENG = 70;
       if (ll <= LENG) 
       {
          txt.value += para;
          return '';
       }
       var state = 0;
       var word = '';
        
       var i = 0; 
       
       for (; i < ll; i++)
       { 
           if (para.charAt(i) == ' ')
           {
             if (state == 1)
             {
                if (i < LENG)
                {
                   txt.value += word + ' ';
                   
                }
                else
                {
                   txt.value += '\n';
                   if (word.length >= LENG)
                   {
                      txt.value += word + '\n';
                      i++;
                   }
                   else
                      i -= word.length;
                    
                   return  para.substring(i);
                }
             }
             else 
             {
                if (i < LENG)
                {
                    txt.value += ' ';
                }
                else
                {
                    txt.value += '\n';
                    i++;
                    return  para.substring(i);
                }
             }
             state = 0;
           }
           else
           {
              if (state == 0)
              {
                  word = para.charAt(i);
                  state = 1;
              }
              else
                  word += para.charAt(i);
           }
        }
        txt.value += para+"\n";
        return  "";
        
}

function chuncate(txt)
{
    
    var lines = txt.value.split("\n");
    txt.value = '';
    var para = "";
    var ii = 0;
    while (ii < lines.length || para != '')
    {
       
       if (ii < lines.length && (para == '' || lines[ii].indexOf("  ") != 0  && lines[ii].replace(/ /g,'') !=''))
       {
           para += lines[ii];
           ii++;
       }
        
       para = cut(txt,para);
      
    }
     
}
function combined()
{
   resizeCont();
   occupy();
}
function occupy()
{
    window.parent.moveTo(0, 0); 
    window.parent.resizeTo(parent.screen.width,parent.screen.height);
    window.parent.focus();
}
 
if (submitonly && type.indexOf("test;") >= 0 && type.indexOf(";o:") < 0)
{
   window.onresize=combined;
   showhelp0();
}
else
   window.onresize = resizeCont;

 
