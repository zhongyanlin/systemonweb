/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
 
function openthis(k)
{
   var cid1 = parent.frames[1].retrv(k,0);
   var assn = parent.frames[1].retrv(k,1);
   var  j=0; for (; j < numcourses && cid[j]!=cid1; j++); 
   
   if (j==numcourses) return;
   var i=0;  
   for (; i < assgn[j].options.length && assgn[j].options[i].value!=assn; i++);
   
  
   if (i==assgn[j].options.length) return;
   assgn[j].selectedIndex = i;
   
   submitform(assgn[j], j);
}
function subopen(j){
    for (let k=0; k < cid.length; k++)
    {
        if (k != j) assgn[k].selectedIndex = 0;
    }
        
    submitform(assgn[j], j);
}
var abcorder = new Array(numcourses);
var rabcorder = new Array(numcourses);
var orderways = new Array(numcourses);
function padd(n)
{
   var x = '';
   for (var  i=0; i < n; i++)
       x += ' ';
   return x;
}
function buildsel(j)
{
      assgn[j].options[0] = new Option(textmsg[108],"");
      assgn[j].options[0].className = 'selectoption';
      for (var l = 0; l <  numassigns[j]; l++)
      {
         var ll = l;
         if (orderways[j] =='n')
         {     
             ll = abcorder[j][l];
         }
         assgn[j].options[l+1] = new Option(n2s[cid[j] + "-" +AN[j][ll]] + ":" + AN[j][ll], AN[j][ll]);
         assgn[j].options[l+1].className = 'selectoption';
      }

      if (1 <= numassigns[j])
      {
        assgn[j].options[numassigns[j]+1] = new Option(toolmsg496,toolmsg496+"@#$Z,");
        assgn[j].options[numassigns[j]+1].className = 'selectoption';
        if (orderways[j] =='n')
          assgn[j].options[numassigns[j]+2] = new Option(textmsg[1599],"bystarttime@#$Z");
        else
          assgn[j].options[numassigns[j]+2] = new Option(textmsg[1598],"byname@#$Z");
        assgn[j].options[numassigns[j]+2].className = 'selectoption';
        assgn[j].options[numassigns[j]+3] = new Option(textmsg[1597],"giveto@#$Z");
        assgn[j].options[numassigns[j]+3].className = 'selectoption';
      }
       
      
}
var tempbacked=null;
function setTempbacked(v)
{
    return tempbacked=v;
}
function getTempbacked()
{
    return tempbacked;
}
let hasinittask = false;
function init()
{
   var ll = 0;
   for (; ll < f1.semester.options.length && 
   f1.semester.options[ll].value!=semester;ll++)  ;
   if (ll == f1.semester.options.length)
      ll = 0;
   f1.semester.selectedIndex = ll;
   
   for (var j = 0; j < numcourses ; j++)
   {
      orders(j);
      orderways[j] = 't';
      buildsel(j);
      assgn[j].selectedIndex = 0;
      for (var i=0; i < assgn[j].options.length; i++)
      assgn[j].options[i].className = 'selectoption';
   }
   for (var i=0; i < f1.semester.options.length; i++)
      f1.semester.options[i].className = 'selectoption';
   
   var x = null;
   if (parent.frames.length>1 && typeof(parent.frames[1].getinitdata) != 'undefined')
       x = parent.frames[1].getinitdata();
   
   if (x!=null && x[0] != null)
   {
      hasinittask = true;
      var cd = x[0];
      var ass = x[1];
      var sn = x[2];
      var j = 0; while (j<cid.length && cid[j]!=cd) j++;
      for (var k=0; k < document.form1.elements.length; k++) if (document.form1.elements[k].name == 'assignname'+j) break;
      var sel = document.form1.elements[k];
      var l = 0; for (; l < sel.options.length; l++) if (sel.options[l].value == ass) break;
      sel.selectedIndex = l;
      submitform(sel, j);
       
   }
   else 
    {
        let kk = 0; 
        let assns;
        for (j = 0; j < cid.length; j++)
        {
            assns = AN[j];
            for (;kk < assns.length; kk++)
            {
                let key0 = orgnum%65536 + "-" +  semester + "-" + cid[j] + "-" +  session[j] + "-" + assns[kk];
                if (localStorage[key0] != null)
                {
                    hasinittask = true;
                    break;
                }
            } 
            if (hasinittask)break;
        }
        if (hasinittask)
        {
            var sl = formselementbyname(document.form1, 'assignname' + j);
            if (sl != null)
            {
                sl.selectedIndex = 0;
                for (var i = 0; i < sl.options.length; i++)
                {
                    if (assns[kk] == sl.options[i].value)
                    {
                       sl.selectedIndex = i;
                       break;
                    }
                }
                submitform(sl, j);
            }
        }
    }
}
function selectedValue(j)
{
    var x = assgn[j].selectedIndex;
    if (x == -1) return null;
    return assgn[j].options[x].value;
}
function selectValue(j, x, y)
{
    var k=0;
    for(; k < assgn[j].options.length; k++)
       if (assgn[j].options[k].value == x) break;
    if (k < assgn[j].options.length)
    {
        assgn[j].selectedIndex = k;
        return k;
    }
    return -1;
}
function sorta(j)
{
    if (orderways[j] == 't')
        orderways[j] = 'n';
    else
        orderways[j] = 't';
    var y = selectedValue(j);
    buildsel(j);
    sindex[j] = selectValue(j, y);
    if (sindex[j] == -1)
        sindex[j] = 0;
}
var CM=10;
function orders(j)
{
      abcorder[j] = new Array(numassigns[j]);
      var M = 0;
      for (var l = 0; l <  numassigns[j]; l++)
      {
          if (AN[j][l].length > M)
              M = AN[j][l].length;
      }
      CM = M;
      var y = new Array(numassigns[j]);
      for (l = 0; l <  numassigns[j]; l++)
      {
          y[l] = AN[j][l] + padd(M - AN[j][l].length);
          if (l < 10) y[l] += '  ' + l;
          else if (l < 100) y[l] += ' ' + l;
          else y[l] += '' + l;

      }
      y.sort(function(a,b)
      {
          a = a.toLowerCase().substring(0,CM);
          b = b.toLowerCase().substring(0,CM);
          if ( a.replace(/[0-9]+[ ]*$/,'') == b.replace(/[0-9]+[ ]*$/,''))
          {
             var x = a.replace(/.*[^0-9]([0-9]+)[ ]*/,'$1');
             var y = b.replace(/.*[^0-9]([0-9]+)[ ]*/,'$1');
             return parseInt(x) - parseInt(y);
          }
          else
          {
              return a.localeCompare(b);
          }
      }
      );
      for (l = 0; l <  numassigns[j]; l++)
      {
        
          abcorder[j][l] = parseInt(y[l].substring(M).replace(/ /g,''));
          //rabcorder[j][abcorder[j][l]] = l;
      }
}
var coursenum = -1;
function enableelements(bl)
{
   for (var j=0; j < f1.elements.length; j++)
      f1.elements[j].disabled = !bl;
}
var didonce = new Array(numcourses);
function hint1(j)
{
   if (didonce[j]==null && assgn[j].selectedIndex == 0)
   {
       myprompt(textmsg[1337]);
       var xy = findPositionnoScrolling(assgn[j]);
       promptwin.style.top = (xy[1]+assgn[j].offsetHeight) + 'px';
       promptwin.style.left = (0) + 'px';
       didonce[j]=1;
   }
}
function getass()
{
    return ass[cid[thisj] + "," + session[thisj]];  
}
function setass(asn, assstr)
{
    var y = '@' + ass[cid[thisj] + "," + session[thisj]]; 
    var j = y.indexOf('@'+asn + ";");
    if (j>=0) 
    {
        var l = y.indexOf('@',j+1);
        ass[cid[thisj] + "," + session[thisj]] = y.substring(1,j+1) + asn + ';' + assstr + y.substring(l);
    }
    else 
    {
        ass[cid[thisj] + "," + session[thisj]] += '@' + asn + ';' + assstr;
    }
}


function cancelhint()
{
     closeprompt();
}
var thisj;
function submitform(sl, j)
{
      thisj = j;
      didonce = true;
      enableelements(true);
      var i = sl.selectedIndex;
      if (i==numassigns[j]+1)
      {
         var wcds = 'start,atype,name';
         if (orderways == 'n')
             wcds = 'name,atype,start';
         formnewaction(f1,"DataFormHTML");
         var wcdsele = document.createElement('input');
         wcdsele.type = 'hidden';
         wcdsele.name = 'wcds';
         wcdsele.value = wcds;
         f1.appendChild(wcdsele);
         f1.rdap.value = "assignall";
         f1.target = parent.frames[1].name;
         f1.course.value = cid[j];
         f1.coursetitle.value = cid[j] + " " + ctitle[j];
         f1.sessionname.value= session[j];
         f1.grader.value = userid;
         f1.makescript.disabled = true;
         f1.numrows.disabled = true;
         f1.onsave.value = "";
         f1.onsaved.value = "";
         f1.cellonblur.value = "";
         f1.onbegin.value = "";
         f1.assignname.value = "";
         f1.session.value = "";
          for (i = 0; i < numcourses; i++)
          {
             if (assgn[i] != sl) 
             {
                 sindex[i] = -1;
                 assgn[i].selectedIndex = 0;
             }
          }
      }
      else if (i==numassigns[j]+2)
      {
          sorta(j);
           for (i = 0; i < numcourses; i++)
          {
             if (assgn[i] != sl) 
             {
                 sindex[i] = -1;
                 assgn[i].selectedIndex = 0;
             }
          }
          return;
      }
      else if (i==numassigns[j]+3)
      {
          formnewaction(f1,"assigntransfer.jsp");
          f1.target = parent.frames[1].name;
          f1.course.value = cid[j];
          f1.coursetitle.value = ctitle[j];
          f1.makescript.value = "transfer";
          f1.grader.value = grader[j];
          f1.sessionname.value = session[j];
          f1.assignname.value = sl.outerHTML.replace(/<select[^>]+>/i, '<select multiple size=4 style="border:1px #cccccc solid; width:150px" name="sourcename" >')
                  .replace(/<option[^>]*>[^<]*<.option>/i,'')
                  .replace(/<option[^>]*>[^<]*<.option>[^<]*<.select>$/i,'</select>')
                  .replace(/<option[^>]*>[^<]*<.option>[^<]*<.select>$/i,'</select>')
                  .replace(/<option[^>]*>[^<]*<.option>[^<]*<.select>$/i,'</select>'); 
           for (i = 0; i < numcourses; i++)
          {
             if (assgn[i] != sl) 
             {
                 sindex[i] = -1;
                 assgn[i].selectedIndex = 0;
             }
          }
                  
      }
      else
      {
          formnewaction(f1,"DataForm");
          f1.target = parent.frames[1].name;
          f1.course.value = cid[j];
          f1.coursetitle.value = ctitle[j];
          f1.makescript.value = "makeass";
          f1.numrows.value="1";
          f1.rdap.value = "assignedit";
          f1.onsave.value = "13";//"if(retrv(0,0)==''){validating=textmsg[97];ele(0,0).focus();}";
          f1.onsaved.value = "11";// "if(cc==0&&parent.frames[0].unique(mat[0][10],(numRows>0),v,mat[0][5])==false){myprompt(v+'('+ mat[0][5] + ')'+ textmsg[3]);ele(0,0).focus();}";
          f1.cellonblur.value = "12";//if(cc==0&&parent.frames[0].unique(mat[0][10],(numRows>0),v,mat[0][5])==false){myprompt(v+'('+ mat[0][5] + ')'+ textmsg[3]);ele(0,0).focus();}";
          f1.onbegin.value = "";
          f1.grader.value = grader[j];
          f1.assignname.value = sl.options[i].value;
          if ( i  == 0)
          {
              var tt = "";
              for (var jj=0; jj < cid.length; jj++)
                  if (cid[jj] == cid[j]) tt += "," + session[jj];
              f1.sessionname.value = tt.substring(1);
          }
          else
          {
             var w = i-1;
             if (orderways[j] == 'n')
                 w = abcorder[j][w];
             f1.sessionname.value = SN[j][w];
           
          }
          for (var k=0; k < assgn.length; k++)
          {
              if (k!=j)
              {
                  for (var q=0; q < assgn[k].options.length; q++)
                  {
                      if (cid[j]==cid[k] && i>0 && q>0 && SN[j][i-1] == SN[k][q-1] && f1.assignname.value == assgn[k].options[q].value)
                      {
                          assgn[k].selectedIndex = q;
                          break;
                      }
                  }
              }
          }
      }
      if (typeof changeFlag == 'function')
         changeFlag(cid[j],false);
      sindex[j] = i;
     
      coursenum = j;
      
     visual(f1);
     f1.submit();
      enableelements(true);
      if (typeof(f1.wcds)!='undefined')
          f1.removeChild(f1.wcds);
}
 
function openplan()
{
    
   enableelements(false);
   f1.target = parent.frames[1].name;
   formnewaction(f1,"DataTable");
   f1.rdap.disabled = false;
   f1.rdap.value = "AssignmentPlanTeach";
   f1.semester.disabled = false;
   
  visual(f1);
 f1.submit();
   enableelements(true);
}
var savedsessions = null;
function unique(course,upquery,name,sessions)
{
   
    var j = 0;
    for (; j < cid.length && cid[j] != course; j++);
    if (j == cid.length)
    {
       myprompt(course + " is invalid");
       return false;
    }
    j = thisj;
    var n = assgn[j].options.length;
    var si = assgn[j].selectedIndex;
    var l = n - 2;
    
    if (upquery) 
    {
        for (; l >= 1; l--)
        {
           var am = assgn[j].options[l].value;
           var w = l-1;
           if (orderways[j] == 'n')
           {
               w = abcorder[j][w];
              
           }
          
           if (l != si && am == name && SN[j][w]==sessions)
           {
               
               return false;
           }
        }
    }
    else 
    {
        for (l = 0; l < numassigns[j]; l++)
        {
            if (AN[j][l] == name && SN[j][l]==sessions)
               return false;
        }
    }
     
    return true;
}

function change(course,  newn, news)
{  
    if (name==newn) return;
    var j = 0;
    for (; cid[j] != course; j++);
    j = thisj;
    var x = assgn[j].selectedIndex;
    var k = x - 1;
    if (k == -1 || k >= numassigns[j])
        return;
    if (orderways[j] == 'n')
        k = abcorder[j][k];
    SN[j][k] = news;
    AN[j][k] = newn;
    orders(j);
    buildsel(j);
    f1.sessionname.value = news;
    f1.assignname.value = newn;
    assgn[j].selectedIndex = x;
}
function padd2(i)
{
    if (i < 10) return '0' + i;
    return ''+i;
}
function addone(course, newn, ses)
{
    var j = 0;
    for (; j < cid.length; j++)
    {    
        if (course == cid[j] && (','+ses + ',').indexOf(","+session[j] + ",")>=0)
        {
            if (numassigns[j]==0) 
            {
                SN[j] = new Array();
                AN[j] = new Array();
            }
            SN[j][numassigns[j]] = ses;
            AN[j][numassigns[j]] = newn;
            numassigns[j]++;
            var d = new Date();
            n2s[cid[j] + "-" +newn] = padd2(d.getMonth()+1) + "/" + padd2(d.getDate());
            assgn[j].innerHTML = '';
            orders(j);
            buildsel(j);

            f1.assignname.value = newn;
            f1.sessionname.value = ses;

            for (var l=0; l < numassigns[j]; l++)
            {
               var w = l ;
               if (orderways[j] == 'n')
                   w = abcorder[j][w];
               if (assgn[j].options[l+1].value == newn && SN[j][w]==ses)
               {
                   assgn[j].selectedIndex = l+1;
                   break;
               }
            }
        }
    }
}

function delone(course, name)
{
    var j = 0, l=0, k =0;
    
    if (course == null && name==null)
    {
        for (;sindex[j] == -1; j++);
        k = sindex[j];
    }
    else
    {
        for (;cid[j] != course; j++);
        j = thisj;
        for (; k < numassigns[j] && AN[j][k]!=name; k++);
        if (k == numassigns[j]) return;
    } 
    
    
    
    for(var l=k; l < numassigns[j]-1; l++)
    {
        AN[j][l] = AN[j][l+1];
        SN[j][l] = SN[j][l+1];
    }
    
    assgn[j].innerHTML = '';
    numassigns[j]--;
    
    orders(j);
    buildsel(j);
    sindex[j] = -1;
    assgn[j].selectedIndex = 0;
    f1.assignname.value = '';
}
function openit3()
{
   postopen('DataSearch?rdap=assignsearch0&subdb=' + subdb,parent.name);
}
function opentable0()
{
   opentable('assignmentopen');
}
function opentable1()
{
   opentable('assignmentclosed');
}
function opentable(x)
{
      enableelements(true);

      formnewaction(f1,"DataTable");

      f1.target = parent.frames[1].name;
      f1.coursetitle.disabled = true;
      f1.makescript.disabled = true;
      f1.numrows.disabled = true;
      f1.rdap.value = x;
      f1.onsave.disabled = true;
      f1.onsaved.disabled = true;
      f1.cellonblur.disabled = true;
      f1.grader.disabled = true;
      f1.assignname.disabled = true;
      f1.course.value = "All Courses";
      f1.onbegin.value = "for(r=numRows-1;r>=0;r--)mat[r][5]='javascript:parent.frames[0].openthis(rr)';sort(3);sort(2);sort(1);sort(0);";
      f1.active.value = active;
      for (i = 0; i < numcourses; i++)
      {
        sindex[i] = -1;
        assgn[i].selectedIndex = 0;
      }
      
     visual(f1);
 f1.submit();
      enableelements(true); 
}
function refresh()
{

   if (f1.assignname.value == "")
   {

      addone(f1.course.value,parent.frames[1].retrv(0,0),parent.frames[1].retrv(0,5));

   }
   else 
   {
      change(f1.course.value,parent.frames[1].retrv(0,0),parent.frames[1].retrv(0,5));
   }   
}
function fresh()
{
   formnewaction(f1);
   
  visual(f1);
 f1.submit();
}
function planfuture(v,i)
{
    if (v == null || v=='')
    {
        var j = 0; for (; j < f1.semester.options.length && f1.semester.options[j].value != semester;j++);
        f1.semester.selectedIndex = j;
    }
    else
    {
        enableelements(false);
        formnewaction(f1,"assignmentindex.jsp");
        var ele = document.createElement('input');
        ele.type='hidden';
        ele.name = 'newsemester';
        ele.value = v;
        f1.appendChild(ele);
        var max = parseInt(f1.semester.options[f1.semester.options.length-2].value) + 1;
        f1.semester.options[i] = new Option(v,""+max);
        f1.semester.selectedIndex = i;
        f1.target = parent.frames[0].name;
        f1.semester.disabled = false;
        f1.mode.disabled = false;
        
       visual(f1);
 f1.submit();
    }
}
function switchs(sel)
{
   
   var i = sel.selectedIndex;

   var j = 0; for (; j < sel.options.length && sel.options[j].value != currentSemester;j++);
   var newsemester = '0'; 
   if (i > j) newsemester = '1';

   if (newsemester == '1')
   {
       myprompt( textmsg[770].replace(/2008/, '' + (1901 + (new Date()).getYear())), "", "planfuture(v," + i + ")");
       return;
   }
   enableelements(false);
   formnewaction(f1,"assignmentindex.jsp");
   f1.target = parent.frames[0].name;
   f1.semester.disabled = false;
   f1.mode.disabled = false;
   
  visual(f1);
 f1.submit();
} 
function swapmode(x)
{
    if (newsemester)
    {
        myprompt("You can make class quiz now for the new semester by treating them as assignment. After new semester starts, you can change the type to class quiz");
    }
    else
    {
        formnewaction(document.form1,"embedquizindex.jsp");
        document.form1.target = window.name;
        
        visual(document.form1);
document.form1.submit();
    }
}

function openright(Z)
{
    var courseid = parent.frames[1].retrv(Z,0);
    var j =0; for (; j < cid.length; j++) if (courseid==cid[j]) break;
    var sl = formselementbyname(f1,'assignname' + j);
    var assname = parent.frames[1].retrv(Z,1);
    var i=0;
    for (;i < sl.options.length; i++)
    {
        if (sl.options[i].value == assname)
            break;
    }
    if ( i< sl.options.length)
    {
    sl.selectedIndex = i;
    submitform(sl, j);
    }
    else
    {
        f1.course.value = courseid;
        f1.assignname.value = assname;
        swapmode('make');
    }
}
 
function getCurrentSemester()
{
    return currentSemester;
}
function debg()
{
   open("follows.jsp?x=mycourse", parent.frames[1].name);
}

init();

function addonei(j)
{
    assgn[j].selectedIndex = 0;
    submitform(assgn[j], ''+j);
}
 
var onloadbeforeassind  = null;
if (typeof window.onload == 'function')
   onloadbeforeassind = window.onload;
if (currentSemester == semester && hasinittask == false)
{
    window.onload = function()
    {
       onloadbeforeassind();
       openalert();
    }
}
onmouseover0 = (browserstr.indexOf('MSIE') > - 1)?
    function ()
    {
        democursorx = event.clientX + document.body.scrollLeft;
        democursory = event.clientY + document.body.scrollTop;
    }
    : function (e)
    {
        democursorx = e.pageX;
        democursory = e.pageY;
    }
document.onmousemove = onmouseover0;
function absence(j)
{
    if (j==0)
        postopen('DataLongForm',['rdap','semester','subdb','extraline'],['Absencereview',semester,subdb,'2'],parent.frames[1].name);
    else 
        postopen('DataTable',['rdap','semester','subdb','extraline'],['absenceall',semester,subdb,'4'],parent.frames[1].name);
} 
function openalert()
{
     if (localStorage['threshold']!=null)
     postopen('alerta.jsp',['coursesessiontimes','semester','threshold'],
     [allstr,semester,localStorage['threshold']],parent.frames[1].name);
     else
         postopen('alerta.jsp',['coursesessiontimes','semester'],
     [allstr,semester],parent.frames[1].name);
} 
function debg()
{
   open("follows.jsp?x=mycourse", parent.frames[1].name);
}  
function openshort(keys)
{
    postopen('assigntest.jsp',['keys'],[keys], parent.frames[1].name);
}
function unselall()
{
     for(let i=0; i < cid.length;i++)
    {
        let sel = document.getElementById('courseid' + i);
        sel.selectedIndex = 0;
    }
}
function selwhich(course,assign,sessions)
{
    let ii =-1;
    for(let i=0; i < cid.length;i++)
    {
        let sel = document.getElementById('courseid' + i);
        sel.selectedIndex = 0;
        let sl = -1;
        if (cid[i] == course) 
        {
            for (let j=0; j < SN[i].length; j++)
            {
                if (assign == AN[i][j] && sessions == SN[i][j])
                {
                    sel.selectedIndex = j+1;
                    sl = j;
                    break;
                }
            }
        }
        if (ii == -1 && sel.selectedIndex > 0) ii = i;
    }
    return ii;
}
var tx;
demotasks = [
    ["democursor2(document.form1.semester,4)", 0],
    ["document.form1.semester.click()", 2000],
    ["tx=document.getElementById('toquiz');democursor2(tx,100)",500], 
    ['parent.frames[1].myprompt("<span style=font-size:40px;color:red><nobr>" + tx.innerHTML.replace(/<[^>]+>/g,"") + "</nobr></span>");parent.frames[1].promptwin.style.left="0px"',2000],
    ["tx = document.getElementById('toproctor');democursor2(tx,100)", 500],
    ['parent.frames[1].myprompt("<span style=font-size:40px;color:red><nobr>" + tx.innerHTML.replace(/<[^>]+>/g,"") + "</nobr></span>");parent.frames[1].promptwin.style.left="0px"',2000],
    ["tx = document.getElementById('toalert');democursor2(tx,100)", 500],
    ['parent.frames[1].myprompt("<span style=font-size:40px;color:red><nobr>" + tx.innerHTML.replace(/<[^>]+>/g,"") + "</nobr></span>");parent.frames[1].promptwin.style.left="0px"',2000],
    ['democursor2(document.form1.assignname0,10)', 1000],
    ['demoheight(0.7);document.form1.assignname0.selectedIndex = 0;document.form1.assignname0.click()', 2000],
    ['demoheight();democursor2(democursorx, democursory-25)',500],
    ['demoheight(0.7); addonei(0)', 2000],
    ['demoheight();democursor2(220, 100)', 500],
    ['demoremovesim()',2000]
];
 



 
    