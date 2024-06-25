/**************************************************************************
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
var f1 = document.form1;
 
function init()
{

   var ll = 0;
   for (; ll < f1.semester.options.length &&
   f1.semester.options[ll].value!=semester;ll++);
   f1.semester.selectedIndex = ll;
   for (var j = 0; j <  numcourses ; j++)
   {
      assgn[j].options[0] = new Option(textmsg[108],"");
      var allnm = "";
      for (var l = 1; l <= numassigns[j]; l++)
      {
         allnm +=  "@#@" + AN[j][l-1] ;
         assgn[j].options[l] = new Option(AN[j][l-1],AN[j][l-1]);
      }
      assgn[j].selectedIndex = 0;
      if (numassigns[j]>0)
      {    
          assgn[j].options[numassigns[j]+1] = new Option(textmsg496,allnm.substring(3)  );
          assgn[j].options[numassigns[j]+1].className = 'selectoption';
          if (orderways  =='n')
            assgn[j].options[numassigns[j]+2] = new Option(textmsg[1599],"bystarttime@#$Z");
          else
            assgn[j].options[numassigns[j]+2] = new Option(textmsg[1598],"byname@#$Z");
          assgn[j].options[numassigns[j]+2].className = 'selectoption';
      }
   }
   
}
var pendingsl, pendingindex;
var nav;

function submitform(sl, index)
{
      var as = sl.selectedIndex;
      whichitem = as;
      if (as == 0)
         submitasnew(sl, index);
      else if (sl.options[as].value=='Participation')
           submitpar(sl, index,"2");
      else if (as < sl.options.length-2)
         submitasold(sl, index);
      else if (as == sl.options.length-2)
         submitpar(sl, index,"1");
      else if (as == sl.options.length-1)
      {
          let k = theurl.indexOf('bynametime');
          if (k == -1)
          {
              if (theurl.indexOf('?')>0)
                 theurl = theurl + '&bynametime=start';
              else
                 theurl = theurl + '?bynametime=start';
          }
          else
          {
              let m = theurl.indexOf("&", k+1)
              if (m == -1)
              {
                  let val = theurl.substring(k+10);
                  theurl = theurl.substring(0,k) + 'bynametime=' + val.contains('name')?'start':'name';
              }
              else
              {
                  let tail = theurl.substring(m);
                  let val =  theurl.substring(k+10,m);
                  theurl = theurl.substring(0,k) + 'bynametime=' + val.contains('name')?'start':'name' + tail;
              }
          }
          document.location.href=theurl;
      }
}

function submitpar(sl, index,modev)
{
      whichcoursenow = index;
      f1.course.value = cid[index];
      f1.courseTitle.value = ctitle[index];
      f1.sessionname.value = sess[index];
      f1.assignname.value = sl.options[sl.selectedIndex].value;
      f1.mode.value = modev;
      sindex[index] = sl.selectedIndex;
      formnewaction(f1,'gradeindex.jsp');
      f1.target = parent.frames[1].name;
      for (var i = 0; i < numcourses; i++)
      {
         if (assgn[i] != sl)
         {
             sindex[i] = 0;
             assgn[i].selectedIndex = 0;
         }
      }
      if (typeof changeFlag == 'function')
       changeFlag(cid[index],false);
     visual(f1);
 f1.submit();
}

function reweight(v)
{
   f1.weight.value = v;
   f1.rdap.value='assignmentnodoc';
   formnewaction(f1, 'DataUpdate');
   visual(f1);
   f1.submit();
}
 
function submitasold(sl, index)
{
      if (sl.selectedIndex<0) return;
      var j = 0;
      whichcoursenow = index;
      f1.course.value = cid[index];
      f1.courseTitle.value = ctitle[index];
      f1.sessionname.value = sess[index];
      f1.assignname.value = sl.options[sl.selectedIndex].value;
      sindex[index] = sl.selectedIndex;
      var fl = parseFloat(''+wtsarr[sl.selectedIndex]);
      
      if (fl < 0 || fl >= 100)
      {
         myprompt(textmsg[1859],'5','reweight(v)'); 
         var box = document.getElementById('promptinput');
         box.style.wdith = "20px";
      }
      formnewaction(f1,'DataTable');
      f1.rdap.value='assignmentgrade';
      f1.target = parent.frames[1].name;
      for (var i = 0; i < numcourses; i++)
      {
         if (assgn[i] != sl)
         {
             sindex[i] = 0;
             assgn[i].selectedIndex = 0;
         }
      }
      if (typeof changeFlag == 'function')
       changeFlag(cid[index],false);
     visual(f1);
 f1.submit();
}
var assigndropdown = null;
function submitasnew(sl, index)
{
    assigndropdown = sl;
    myprompt(textmsg[725],'', "donewassign(v," + index +")");
    var box = document.getElementById('promptinput');
    box.style.wdith = "200px";
    var row = box.parentNode.getElementsByTagName('table')[0].rows[0];
    row.cells[0].innerHTML = "<nobr>" + textmsg[1858] + "</nobr>" ;
    var cell = row.insertCell(-1);
    cell.innerHTML = "<input type=checkbox id=newextra onclick=hideweight(this)>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    cell.aLign = "left";
    var cell = row.insertCell(-1);
    cell.aLign = "right";
    cell.innerHTML = "<nobr>" + textmsg[1761] + "</nobr>";
    var cell = row.insertCell(-1);
    cell.innerHTML = "<input type=text style=\"width:20px;border:1px #b0b0b0 solid;text-align:right\" id=newweight value=4 onblur=\"f1.weight.value=this.value;\">";
    var cell = row.insertCell(-1);
    cell.innerHTML = "%";
}
function hideweight(t)
{
    var b = t.checked;
    if (b)
    {
        f1.weight.value = '-1'; 
    }
    t.parentNode.parentNode.cells[2].style.visibility = b?'hidden':'visible';
    t.parentNode.parentNode.cells[3].style.visibility = b?'hidden':'visible';
    t.parentNode.parentNode.cells[4].style.visibility = b?'hidden':'visible';
}
function donewassign(newassign,index)
{
    
      var j = 0;
      f1.course.value = cid[index];
      f1.courseTitle.value = ctitle[index];
      f1.sessionname.value = sess[index];
      var jj = -1;
      var useexisting = false;

      if (newassign == '')
      {
         submitasnew(assigndropdown, index);
      }
      else
      {
         sl = assigndropdown;
         newassign = newassign.replace(/'/g,"");
         for(jj = 0; jj < sl.options.length && sl.options[jj].value != newassign; jj++);
         if (jj < sl.options.length)
         {
             sl.selectedIndex = jj;
             submitasold(sl, index);
         }
         else
         {
             nav = window.open('','popwin','toolbar=0,menubar=0,location=0,width=200,height=150,left=200,top=200');
             pendingsl = sl;
             pendingindex = index;

             if (sl.options.length==1)
             {
                 sl.options[sl.options.length] =  new Option(newassign, newassign);
             }
             else
             {
                 sl.options[sl.options.length-1] =  new Option(newassign, newassign);
             }
             var allnm = "";
             for (var l = 1; l <  sl.options.length; l++)
             {
                 allnm +=  "@#@" + sl.options[l].value;
             }
             sl.options[sl.options.length] = new Option( textmsg496,allnm.substring(3) );
             
             sl.selectedIndex = sl.options.length - 2;
             formnewaction(f1, 'DataUpdate');
             f1.assignname.value = newassign;
             f1.rdap.value='assignmentnodoc';
             f1.target = 'popwin';
             visual(f1);
             f1.submit();
         }
      }
}

function refresh()
{
    open( "blank.html", parent.frames[1].name);
    if (whichcoursenow!=null)
    {
       
       postopen('gradeindex.jsp',['semester','whichcoursenow','whichitem'],[semester,whichcoursenow,whichitem],'_self');
    }
    else
       postopen('gradeindex.jsp',['semester'],[semester],'_self'); 
   //document
}

function switchs(sel)
{
   if (sel.selectedIndex>=0)
   {
       open( "blank.html", parent.frames[1].name);
       postopen('gradeindex.jsp',['semester'],[sel.options[sel.selectedIndex].value],'_self');
   }
        
   //document.location.href = "gradeindex.jsp?semester=" + sel.options[sel.selectedIndex].value;
}
function syn(y)
{
   
   if (y=='1,1'|| y=='-1,1')
   {
      nav.close();
      submitform(pendingsl,pendingindex)
    }
}
init();
