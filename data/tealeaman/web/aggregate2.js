
var url, groupurl,clearoldstr;
var Ff = document.form1;
Ff.btnsave.value= textmsg[67];
Ff.btnproc.value= textmsg[66];
Ff.btnold.value= textmsg[71];
Ff.btnhelp.value= textmsg[17];

var cellh = Math.ceil(1+font_size*1.6);
resizebut(Ff,font_size);

function openit(url)
{
  if (url!==null)  
  postopen(url, url.substring(0,8).replace(/\W/g, '_') );
} 
function syn(x){return 1;}


function delnums()
{
   self.frames[0].setaction(1);
   if (grouping==1)
     self.frames[1].setaction(3);
}
function gosubmit()
{
    self.frames[0].setaction(1);
    check2submit();
}
function proceed()
{
   formnewaction(Ff);
   if ( grouping==1)
   { 
      self.frames[1].setaction(1);
      if (self.frames[1].passover(self.frames[1].passoverNumRows(),4) == 100)
      {
          gosubmit();
          return;
      }
      myprompt(textmsg[52], null, "if(v)gosubmit()", "");
   }
   else
   { 
       if (self.frames[0].passover(self.frames[0].passoverNumRows(),7) == 100)
       {
            
          visual(Ff);
          Ff.submit();
       }
       else
       {
          myprompt(textmsg[53], null, "if(v)Ff.submit()","");
       }
   } 
}
 
function redo(ck)
{
  // Ff.grouping.value =   (ck.checked?"1":"0");
   //formnewaction(Ff, "aggregate2.jsp");
   //visual(Ff);
   //Ff.submit();
   parent.frames[0].redo();
   
}
 
function openit10()
{
    postopen (clearoldstr,'300_200' );
}
function clearOld()
{
   old=true; 
   myprompt( textmsg[1720], null, "if(v)openit10()", null);
    
}

function check2submit()
{
   var M0 = self.frames[0].passoverNumRows();
   var M1 = self.frames[1].passoverNumRows();
   for (var i = 0; i < M0; i++)
   {
     var j = 0;
     for (; j < M1 && self.frames[1].passover(j,0) != self.frames[0].passover(i,7); j++);
     if (j==M1)
     {
        myprompt(self.frames[0].passover(i,7) + textmsg[50], null, "if(v)Ff.submit()", "");
        return;
     }
   }
   for (var j = 0; j < M1; j++)
   {
     var i = 0;
     for (; i < M0 && self.frames[1].passover(j,0) != self.frames[0].passover(i,7); i++);
     if (i==M0)
     {
         self.frames[1].form1.checkbox[j].checked = true; 
         myprompt(textmsg[55] +" " + self.frames[1].passover(j,0) + textmsg[56], null, "if(v)Ff.submit()",null);
         return;
     }
   }
   if (M0 > M1)
   {
       
      visual(Ff);
 Ff.submit();
   }
   myprompt(textmsg[57], null, "if(v)Ff.submit()",null);
}


function regroup()
{ 
   var M0 = self.frames[0].passoverNumRows();
   var M1 = self.frames[1].passoverNumRows();
   var kk = 1;
   for (var i = 0; i < M0; i++)
   {
     if (self.frames[0].passover(i,7) != self.frames[0].passover(i,1)) continue;
      
     var j = 0;for (; j < M0 ; j++) 
       if ( i != j && self.frames[0].passover(j,7) == self.frames[0].passover(i,7))
         break;
     
     
     if (j == M0) 
     {
        var tt = self.frames[0].passover(i,7);
        var gn = textmsg[55] + (kk++);
        self.frames[0].setCell(i,7,gn);
        var j= 0; for (; j < M1 && self.frames[1].passover(j,0)!=tt; j++);
        if (j < M1) self.frames[1].setCell(j,0,gn); 
     } 
   } 
   match();
}

var x = null;
function old(xx)
{
   x=xx;
}
 
function show(F, k){var tr = ""; for (var i = 0; i < k; i++) tr +=F[i]+", ";myprompt(tr);}
var helpstr = '<TR><TD COLSPAN=2><FONT COLOR=PURPLE><b>'+ textmsg[50] + '</b></font></td></tr>';
function match()
{
    
   var M0 = self.frames[0].passoverNumRows();
   var F0 = new Array(M0); 
   var M1 = self.frames[1].passoverNumRows();
   var F1 = new Array(M1); for (var i = 0; i < M1; i++) F1[i] = 0;
   var kk = 1;
   
   for (var i = 0; i < M0; i++)
   {
     var x = self.frames[0].passover(i,7);
     var j = 0; for (;j < M1 && self.frames[1].passover(j,0) != x; j++);
     if (j == M1) 
        F0[i] = 0;
     else
     {
        F0[i] = 1;
        F1[j] = 1;
     }
   }
   
   for(var i=0; i < M0; i++)  
   {
      if (F0[i] == 1) continue; 
         
      var j = 0;
      for(; j < M1 && F1[j]==1; j++);
      if (j < M1)
      {
          self.frames[1].setCell(j,0, self.frames[0].passover(i,7));
          F1[j] = 1;
          F0[j] = 1;
      }
   }
    
    for (var i = 0; i < M0; i++)
      if (F0[i] == 0) self.frames[0].f1.checkbox[i].checked = true;
 
    for (var i = 0; i < M1; i++)
      if (F1[i] == 0) { self.frames[1].f1.checkbox[i].checked = true;}
  
    var tt = self.frames[1].helpstr.replace(/<b><font color=purple>Descript.*/,'').replace(/<b><font color=purple>How to sort.*/,'');
  
    helpstr = helpstr.replace(/ZZZZ/, tt );
 }
 
function renameas(M1, x, str)
{
    var i = 0;for (; i < M1 && self.frames[1].passover(i,0) != x; i++);
        if (i < M1) 
        {
            self.frames[1].setCell(i,0,str); 
            rename1(i,0);
        }
}
function gosum()
{
     savenums();
     postopen(groupurl + "&onbegin=51"  ,"group");
}

function rename0(r,c)
{
 
 if (c==7)
 {
     
    var M1 = self.frames[1].passoverNumRows();
    var str = self.frames[0].passover(r,c);
     
    if (str == x) return;

    var i = 0;for (; i < M1 && self.frames[1].passover(i,0) != str; i++);
    if (i < M1) return;

    myprompt(textmsg[59] +"\"" + str + "\" " + textmsg[60] +" \"", null, "if(v)gosum(); else renameass(" + M1 + ",'" + x + "','" + str + "')","");
     
 }
}



function savenums()
{
   if (grouping==1)
     self.frames[1].setaction(1);
   self.frames[0].setaction(1);
   
}

function rename1(r,c)
{ 
 if (c==0)
 {
    var M0 = self.frames[0].passoverNumRows();
     
    var str = self.frames[1].passover(r,c);
    
    for (var i = 0; i < M0; i++)
       if (self.frames[0].passover(i,7) == x)
       {
           self.frames[0].setCell(i,7,str);
       }
     
 }
 else if (c == 2 || c == 3)
 {
    var ma = parseInt(self.frames[1].passover(r,1));
    if (parseInt(self.frames[1].passover(r,c)) > ma)
    {
       myprompt(textmsg[62]);
    }
 } 
}

function resizeIframe(n,win)
{
   var tbl = win.document.getElementById('maintable');
   var ht = tbl.offsetHeight + 20;
   if (ht < 20 )
   {    
       if (document.getElementsByTagName("iframe")[n].document && document.body.scrollHeight)
           ht = document.getElementsByTagName("iframe")[n].document.body.scrollHeight - 19;
       else 
           ht = 400;
   }
   document.getElementsByTagName("iframe")[n].height = ht + 20;
   var dvs = window.frames[n].document.getElementsByTagName('center');
   if (dvs!=null)
   {
    var y = dvs[dvs.length-1];
    window.frames[n].document.body.removeChild(y);
   }
   var j =0;
   for (var j=0; j < win.numCols; j++)
       if (win.fields[j] == 'Weight') break;
    
   if (j == win.numCols) return;
   for (var i=0; i < win.numRows; i++)
   {
      var y = parseFloat(win.retrv(i,j));
      if (y > 100 || y < 0)
      {
          win.ele(i,j).value = msg1558;
          win.ele(win.numRows,j).value = '' + (parseFloat(win.ele(win.numRows,j).value) - y);
      }
   }
}

function onstart()
{
    if (grouping==1)
    {   
         url = "DataTable?subdb=" + userid 
                 +"&rdap=summaryg&course=" +encodeURIComponent(course) 
                 + "&semester=" + encodeURIComponent(semester) +
                 "&cellonblur=40"  + "&cellonfocus=41"   
                 + "&sessionname=" + encodeURIComponent(sessionname) 
                 + "&extraline=0&extraline=0";

        groupurl = "DataTable?subdb=" + userid 
                +"&rdap=group&course=" + encodeURIComponent(course) 
                + "&semester=" + encodeURIComponent(semester) +
                "&cellonblur=40"  + "&cellonfocus=41"  
                + "&sessionname=" +encodeURIComponent(sessionname) + "&extraline=0";
    }
    else
    {
         url = "DataTable?subdb=" + userid 
                 +"&rdap=summary&course=" + encodeURIComponent(course) 
                 + "&semester=" + encodeURIComponent(semester) +
                "&sessionname=" + encodeURIComponent(sessionname)  + "&extraline=0";

    }
    parent.frames[0].setGrouping(grouping);
    url += "&onbegin=39";
    clearoldstr = "DataUpdate?subdb=" + userid 
                 +"&rdap=ClearEvaluation&courseid=" + encodeURIComponent(course) 
                 + "&Semester" + encodeURIComponent(semester);
    postopen(url, 'summary');
    
    
}

justopened = function(win)
{
    
    justopenedwindowhandle = win; 
    if (win.name != 'summary') return;
    var extrastr = win.helpstr;
    
    var j, i = extrastr.indexOf("<b><font color=purple>"+textmsg[50]);
    if (i>=0)
    {
        j = extrastr.indexOf("\n",i);  
        if (j>0) extrastr = extrastr.substring(0,i) + extrastr.substring(j);
        else
          extrastr = extrastr.substring(0,i);
    }
    i = extrastr.indexOf("<b><font color=purple>"+textmsg[250]);
    if (i>=0)
    {   
        j = extrastr.indexOf("\n",i); 
        if (j>0) extrastr = extrastr.substring(0,i) + extrastr.substring(j);
        else
           extrastr = extrastr.substring(0,i);
    }
     
    helpstr += extrastr;
    if (grouping ==1)
         helpstr += "ZZZZ";
    helpstr += "<br><b><font color=purple>" +textmsg[40] + "</font></b><br>" +textmsg[64];
     
    helpstr += "<br><b><font color=purple>"+textmsg[51]+"</font></b><br><table>"+
    "<tr><td valign=top> <input type=button  class=GreenButton  style=width:" + Math.round(4.5*font_size) + "px  value=\"" +   textmsg[66] + "\"> </td><td>"+textmsg[65] +"</td></tr>";
    helpstr +="<tr><td valign=top> <input   type=button class=OrangeButton  style=width:" + Math.round(4.5*font_size) + "px   value=\"" + textmsg[67] +"\"></td><td>" +textmsg[68]+"</td></tr>";
    if ( grouping ==1){
    helpstr +="<tr><td valign=top> <input   type=button  class=RedButton   style=width:" + Math.round(4.5*font_size) + "px  value=\"" + textmsg[69] +"\"></td><td>" + textmsg[70] +"</td></tr>";
    }
     
    helpstr +="<tr><td valign=top> <input    type=button  class=RedButton  style=width:" + Math.round(4.5*font_size) + "px   value=\""+textmsg[71]+"\"></td><td>" +textmsg[72]+"</td></tr></table>";
     
    if ( grouping == 1)
        postopen( groupurl  +  "&onbegin=56" , "group" );
    else
        helpstr += "<br><b><font color=purple>"+textmsg[73]+"</font></b><br>"+textmsg[74];

}
 
function resizeCont()
{
      var wd = thispagewidth();
      var het = thispageheight();
       
       
      het = het - 130 - 3*font_size;
      
      //for (var i =0; i < window.frames.length; i++)
      {
         // window.frames[i].width = wd - 16;
         // window.frames[i].height = het/document.frames.length;
      }
}
window.onresize = resizeCont;
function framefit()
{
   var fm = document.getElementsByTagName('iframe');
   for (var i=0; i < fm.length; i++)
   for (var j=0; j < 20; j++) 
   {
       fm[i].scrollBy(0,100);
       if (fm[i].document.body.scrollTop == 0) break;
       fm[i].height += 10;
   }
}
if (window != parent && window==parent.frames[1] && parent.frames[0].document.getElementById('homeico')!=null)
{
        var homeico = document.getElementById('homeico');
        if (homeico!=null)
            homeico.parentNode.removeChild(homeico);
}
buildactmenu = function()
{
    recurainput(Ff);
}


