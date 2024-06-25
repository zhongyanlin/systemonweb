
exbut='';
numCols--;
var maintable = null;
var courseid = null;
var sessionname = null;
var semester = null;
var gradehwd = null;
var activei = null;
var activej = null;
var formptr = null;
var hiddenrdap = null;
var hiddensemester = null;
var hiddenwcds     = null;
var hiddenmakescript = null;
var hiddensid      = null;
var hiddencoursetitle = null;
var hiddensubdb = null;
var hiddencourse  = null;
var hiddenstudname = null;
var hiddenstudentid = null;
var hiddenassigntest  = null;
var hiddenonsaved  = null;
var tdxy = null;
var assn = parent.frames[0].getAssn();
var sess = parent.frames[0].getSes();
var orderded = parent.frames[0].getdeducts();
let emails = new Array();
for (let k=0; k < mat.length; k++)
{
    let dp = mat[k][2].lastIndexOf(',');
    emails[k] = mat[k][2].substring(dp+1);
    if (dp>0)mat[k][2] = mat[k][2].substring(0,dp);
    else mat[k][2] = '';
}
labels[1] = textmsg[39];labels[2] = textmsg[38];
function absencestr(n)
{
   if (orderded == null) return 0;
   var f = 0;
   for (var k=0; k < n && k < orderded.length; k++)
       f += orderded[k];
   return f;
}
function modifyded()
{
    var x = [];
    var j = 0;
    if (orderded != null)
    for (; j < orderded.length; j++) 
        x[j] = [j+1, orderded[j]];
    for (; j < 30; j++)
        x[j] = [j+1, 0];
    var str = "<center>"; var kk = 0;
    for (var j=0; j < x.length; j++)
    {
        if (j % 10 == 0)
            str += "<table id=tbl" + (kk++) + " cellspacing=1 border=1 style=\"border-radius:3px;border-collapse:collapse;display:inline-block;margin:3px 3px 3px 3px\" ><tr style=\"font-weight:700;background:linear-gradient(to bottom," + BBGCOLOR +"," + TBGCOLOR + ")\"><td align=right>" + textmsg[542] + "</td><td align=right style=width:40px;overflow:hidden>" + parent.frames[0].msg1601() + "</td></tr>";
        str += "<tr  bgcolor=" + TBGCOLOR +"><td align=right style=color:#004400 >" + x[j][0] + "</td><td align=right><input  value=" + x[j][1] + "  style=\"border:0px;text-align:right;color:red\" size=3></td></tr>";
        if (j % 10 == 9)
           str += "</table>"; 
    }
    str += "<br><input type=button class=GreenButton style=width:" + (font_size*4.5) + "px onclick=updateded() value=\""
     + textmsg[66] + "\">";
     str += "<input type=button class=OrangeButton style=width:" + (font_size*4.5) + "px onclick=closeprompt() value=\""
     + textmsg[18] + "\"></center>"; 
     myprompt(str, null,null, parent.frames[0].msg1600() + " " + parent.frames[0].msg1601());
     var w0 = document.getElementById('tbl0').offsetWidth * 3 + 16;
     var h0 = document.getElementById('tbl0').offsetWidth   + 45;
     
     promptwin.style.width = w0 + 'px;'
     promptwin.style.height = h0 + 'px;'
}
function updateded()
{
   var str = "";
   var start = false;
   for (var kk=2; kk >= 0; kk--)
   {
       var tbl = document.getElementById('tbl' + kk);
       for (var j=9; j>=0; j--)
       {
           var y = tbl.rows[j+1].cells[1].getElementsByTagName('input')[0].value;
           if (start == false && y =='0') continue;
           else if (start == false && y != '0') start = true;
           str = tbl.rows[j+1].cells[0].innerHTML + "," + y + ";" + str;
       }
   }
   str = parent.frames[0].msg1600() + "," + parent.frames[0].msg1601() + ";" + str;
   postopen("aggregate3.jsp", 
        ["title","subdb","cid", "semester", "sessionname", "absentdeduct", "grouping","updateded"], 
        [title, subdb, courseid,semester, sessionname,str,1, 1],
        "w" + tstmp);
}
let subframe;
function onc(td)
{
   if (maintable == null || formptr == null)
      return;
   var NP = maintable.rows[0].cells.length - assn.length;
   var i, j;
   for (i=0; i < maintable.rows.length; i++)
   {
      var found = false;
      for (j=0; j < maintable.rows[i].cells.length; j++)
      {
         if (td == maintable.rows[i].cells[j])
         {
            found = true;
            break;
         }
      }
      if (found) break;
   }
   
  
   if (i==0  )
   {
        sort1(j,td)
        swaphints();
   }
   else if (j==0 && i == numRows+1)
   {
       var nms = ['CourseId','CourseTitle','Session','schedule','securitytoken', 'orgnum','Semester','rdap','subdb','onsaved'];
       var vls = [courseid,title, sessionname, parent.frames[0].getTslots(), '', orgnum,    semester,'roster',subdb,'15'];
       postopen('DataTable',nms, vls, "_blank");
      
   }
   else if (j == numCols - 1 &&i <= numRows)
  { 
       var sid = maintable.rows[i].cells[0].innerHTML.replace(/<[^>]+>/g,"");
       var nms = ['CourseId','coursetitle','sessionname','SID','securitytoken', 'orgnum','Semester','rdap','mode','subdb'];
       var vls = [courseid,title ,sess[j-2],sid,'', orgnum,semester,"absencebysid","make",subdb];
       postopen('DataTable',nms, vls, "_blank");
       
    }
   else if ( i == numRows+1 && j == maintable.rows[i].cells.length-1)
   {
        var sid = maintable.rows[i].cells[0].innerHTML.replace(/<[^>]+>/g,"");
       var nms = ['CourseId','coursetitle','sessionname','SID','securitytoken', 'orgnum','Semester','rdap','mode','subdb'];
       var vls = [courseid,title ,sess[j-2],sid,'', orgnum,semester,"absenceall","make",subdb];
       postopen('DataTable',nms, vls, "_blank");
   }
   else if (i >= numRows +2  && j == maintable.rows[i].cells.length-1)
   {
       modifyded();
   }
   else if ( j < 3 &&i<=numRows)
   {
      gradehwd = open('studentpage.jsp?mode=instructor&sid='+ maintable.rows[i].cells[0].innerHTML.replace(/<[^>]+>/g,""),'regrade1');
   }
   else if (j==3 &&i<=numRows)
   {
      var xy = findPositionnoScrolling(td);
      var yy = hints[piccount+i-1];
      if (yy==null)
      {    
         
      }
      else 
      {
          if (valuechanged[i-1])
             myprompt("Score changed. <a href=\"javascript:openaggret()\">" + textmsg[377] +"</a><br>" + yy);
          else
             myprompt(yy,null,null,textmsg[33]);
          promptwin.style.left = (xy[0]+60) + "px";
          promptwin.style.top = xy[1] + "px";
      }
   }
   else if ((j >0 && j < 4) && i==numRows+1)
   {
        var savedCritias = "'" + courseid + "','" +   sessionname + "','','','','0'";
        localStorage["savedCritias"] = savedCritias;
        open('DataSearch?rdap=grading0&exbut=h&subdb='+ subdb,"_blank");
   }
   else if (j >= 4 && i==numRows+1)
   {
        var savedCritias = "'"   + courseid + "','" +   sess[j-4] + "','" + assn[j-4] +  "','','','0'";
        localStorage["savedCritias"] = savedCritias;
        var nms = 'orgnum,semester,rdap,exbut,subdb'.split(/,/);
        var vls = [orgnum,semester,'grading0', 'h', subdb];
        postopen('DataSearch', nms, vls, 'grading');
        
   }
   else if ((j==1) && i==numRows + 2)
   {
       open('assignment.jsp',"_blank");
   }
   else if (j==2 && i==numRows + 2)
   {
       
       myprompt('<iframe id=subframe width=550 height=350 name=abc src="DataTable?rdap=gradethreshbook&numrows=6&system=2&subdb='
               + subdb +  '&course=' + courseid + '&session=' + sessionname + '&semester=' + semester + '&cellonblur=40&onbegin=47&onsaved=124" >');
        
   }
   else if (j==2 && i==numRows + 3)
   {
       alertmessage();
   }
   else if (j >=4 && i == numRows+2 && j < numCols)
   {
            var assg  = assn[j-4];
            if (parent.frames[0].getAtype()[j-4]!=4)
            {
               var nms = ['subdb','course','coursetitle','sessionname','AssignTest','securitytoken', 'orgnum','semester','makescript','extraline','rdap'];
               var vls = [subdb, courseid, title,sess[j-4],assg,'', orgnum, semester,'makeass','0','assignbyname'];
               postopen('DataForm',nms, vls, "_blank");
            }
            else
            {
              var nms = ['course','coursetitle','sessionname','assignname','securitytoken', 'orgnum','semester','rdap','mode','subdb'];
              var vls = [courseid,title ,sess[j-4],assg,'', orgnum,semester,"allembedquiz","make",subdb];
              postopen('embedquiz.jsp',nms, vls, "_blank");
            }
   }
   else if (j >=4 && i==numRows+3 && j < numCols)
   {
            var assg  = assn[j-4];
            let  courseid = title.replace(/ .*/,'');
            var ix = courseid.lastIndexOf("-");
            let sessionname1 = courseid.substring(ix+1);
            courseid = courseid.substring(0,ix);
              var nms = ['course','coursetitle','sessionname', 'orgnum','semester','rdap','subdb'];
              var vls = [courseid,title , sessionname1,  orgnum,semester,"assignweight",subdb];
              postopen('DataTable',nms, vls, "_blank");
            
   }
   else if (j == 3 && i >= numRows + 2)
   {
       open('assignment.jsp',"_blank"); 
   }
   else//if (j > 3) 
   {  
       
      gradehwd =  open('','regrade1');
      formnewaction(formptr, "DataForm");
      formptr.target = "regrade1";
      if (j>=NP && maintable.rows[i].cells[j].innerHTML != '')
      { 
         hiddensid.disabled = false;
         hiddensid.value = maintable.rows[i].cells[0].innerHTML.replace(/<[^>]*>/g,'').replace(/ /g,'');
         hiddenstudentid.disabled = true;
         hiddenassigntest.disabled = true;
         hiddenstudname.disabled = true;
         hiddenrdap.value = "gradingns";
         hiddenwcds.value = " WHERE  Submission.semester=Assignment.semester  AND  Submission.semester='"
         + semester + "' AND  Submission.course=Assignment.course  AND Assignment.course = '"
         + courseid
         + "' AND Assignment.name=Submission.assignname AND  Assignment.name = '"
         + assn[j-NP].replace(/'/g,"''")
         + "' AND Submission.sid=AppUser.id AND AppUser.id='"
         + hiddensid.value  + "' AND Assignment.sessionname='" + sess[j-NP] + "'";
         
      }
      else
      {
          hiddenstudentid.disabled = false;
          hiddenstudentid.value = maintable.rows[i].cells[0].innerHTML.replace(/<[^>]*>/g,'').replace(/ /g,'');
          hiddensid.disabled = true;
          hiddenassigntest.disabled = false;
          hiddenassigntest.value = hints[j];
          hiddenstudname.disabled = false;
          hiddenrdap.value = "gradingsub";
      }
     visual(formptr);
     formptr.submit();
      activei=i;
      activej=j;
   }
   
}


function openaggret()
{ 
   closeprompt();
   gradehwd =  open('aggregate.jsp','regrade1');
}

function updatescore()
{
   
   if (maintable ==null || gradehwd == null || typeof(gradehwd.retrv)=='undefined')
      return;
   var x = gradehwd.retrv(0,4);
   if (activei!=null && activej!=null && activei>0 && activej>3  )
   {
      maintable.rows[activei].cells[activej].innerHTML = x;
      mat[activei-1][activej] = x;
      valuechanged[activei-1] = true;
      maintable.rows[numRows+1].cells[activej].innerHTML = calfoot(activej,1);
   }
}

function spliteval(middleeval)
{
   if (middleeval==null)return "";
   var str = "<table>";
   var st =  middleeval.split("\n");
   for (var  i = 1; i < st.length; i++)
   {
    var  x = st[i].split(/[ ]+/);
    var l = x.length;
    
    if (l >= 3)
    {
        str += "<tr><td>";
        for (var  m = 0; m < l-3; m++)
           str += (x[m] + " ");
        str += ("</td><td align=center>" + x[l-3] + "</td><td align=right>" + x[l-2] + "</td><td align=right>" + x[l-1] + "</td></tr>");
    }
   }
   return str + "</table>";
    
   //return "<pre>" + middleeval +"</pre>";
}

function  swaphints()
{
           var b = new Array(numRows);
           for (var i = 0; i < numRows; i++)
              b[i] = hints[i+piccount];
           for (var i = 0; i < numRows; i++)
             hints[i+piccount] = b[pointer[i]];
}
 
function addextraform()
{
maintable = document.getElementById("maintable");
courseid = title.replace(/ .*/,'');
var ix = courseid.lastIndexOf("-");
sessionname = courseid.substring(ix+1);
courseid = courseid.substring(0,ix);

var semestera = parent.frames[0].document.form1.semester;
semester = semestera.options[semestera.selectedIndex].value;
var subdbstr = parent.frames[0].getSubdb();

formptr = document.createElement("form");
formptr.setAttribute("name","assform");
formptr.setAttribute("method","post");
formptr.setAttribute("action","DataForm");
formptr.setAttribute("target","regrade1");

hiddenrdap = document.createElement("input");
hiddenrdap.setAttribute("name","rdap");
hiddenrdap.setAttribute("type","hidden");
hiddenrdap.setAttribute("value","gradingns");
formptr.appendChild(hiddenrdap);

hiddensemester = document.createElement("input");
hiddensemester.setAttribute("name","Semester");
hiddensemester.setAttribute("type","hidden");
hiddensemester.setAttribute("value",semester);
formptr.appendChild(hiddensemester);

hiddenwcds = document.createElement("input");
hiddenwcds.setAttribute("name","wcds");
hiddenwcds.setAttribute("type","hidden");
formptr.appendChild(hiddenwcds);

hiddenmakescript = document.createElement("input");
hiddenmakescript.setAttribute("name","makescript");
hiddenmakescript.setAttribute("type","hidden");
hiddenmakescript.setAttribute("value", "grading");
formptr.appendChild(hiddenmakescript);

hiddensid = document.createElement("input");
hiddensid.setAttribute("name","sid");
hiddensid.setAttribute("type","hidden");
formptr.appendChild(hiddensid);

hiddenstudentid = document.createElement("input");
hiddenstudentid.setAttribute("name","StudentId");
hiddenstudentid.setAttribute("type","hidden");
formptr.appendChild(hiddenstudentid);

hiddenassigntest = document.createElement("input");
hiddenassigntest.setAttribute("name","AssignmentTest");
hiddenassigntest.setAttribute("type","hidden");
formptr.appendChild(hiddenassigntest);

hiddenstudname = document.createElement("input");
hiddenstudname.setAttribute("name","StudName");
hiddenstudname.setAttribute("type","hidden");
hiddenstudname.setAttribute("value", "");
formptr.appendChild(hiddenstudname);

hiddencourse  = document.createElement("input");
hiddencourse.setAttribute("name","CourseId");
hiddencourse.setAttribute("type","hidden");
hiddencourse.setAttribute("value", courseid);
formptr.appendChild(hiddencourse);

hiddenonsaved  = document.createElement("input");
hiddenonsaved.setAttribute("name","onsaved");
hiddenonsaved.setAttribute("type","hidden");
hiddenonsaved.setAttribute("value", "80");
formptr.appendChild(hiddenonsaved);

hiddencoursetitle = document.createElement("input");
hiddencoursetitle.setAttribute("name","coursetitle");
hiddencoursetitle.setAttribute("type","hidden");
hiddencoursetitle.setAttribute("value", title.replace(/[^ ]* /,""));
formptr.appendChild(hiddencoursetitle);

hiddensubdb = document.createElement("input");
hiddensubdb.setAttribute("name","subdb");
hiddensubdb.setAttribute("type","hidden");
hiddensubdb.setAttribute("value", subdbstr);
formptr.appendChild(hiddensubdb);
document.body.appendChild(formptr);


if (maintable !=null)
for (var r=1; r <= numRows; r++)
{
   hints[piccount + r - 1] = spliteval(mat[r-1][numCols]);
   for (var c=0; c < numCols; c++)
   {
        maintable.rows[r].cells[c].style.color = "blue";
       if (c==3)
       {
          maintable.rows[r].cells[c].setAttribute("align","center");
       }
       maintable.rows[r].cells[c].onclick = function(){onc(this);};
        
   }
}
   
    var s = parent.frames[0].getScs();
    var w = parent.frames[0].getWts(); 
    var tbl = document.getElementById('maintable');
    
    var N = tbl.rows[0].cells.length;
    var NP = N - w.length;
    tbl.rows[numRows+1].cells[0].style.color = 'blue';
    for (var k=0; k < NP-4; k++)
    tbl.rows[numRows+1].deleteCell(2);
    tbl.rows[numRows+1].cells[1].style.color = 'blue';
    tbl.rows[numRows+1].cells[1].colSpan=NP-3;
    tbl.rows[numRows+1].cells[1].innerHTML = textmsg[1743];
    tbl.rows[numRows+1].cells[1].style.whiteSpace = 'nowrap';
    tbl.rows[numRows+1].cells[1].align='right';
    
    let gpasum = 0;
    for (let k=0; k < numRows; k++)
    {
        let va = tbl.rows[k+1].cells[NP-2].innerHTML.replace(/<[^>]+>/g,'');
        if (va == 'A')gpasum += 4;
        else if (va == 'B')gpasum += 3;
        else if (va == 'C')gpasum += 2;
        else if (va == 'D')gpasum += 1;
    }
    tbl.rows[numRows+1].cells[2].align = 'center';
    if (gpasum == 0)
        tbl.rows[numRows+1].cells[2].innerHTML = '0.00';
    else 
        tbl.rows[numRows+1].cells[2].innerHTML = (gpasum/numRows).toFixed(2);
    
    var r = tbl.insertRow(-1);
    r.bgColor = '#FFFFC0';
    var c = r.insertCell(-1);
    c.align='left';
    c.style.color = 'blue';
    c.innerHTML = "CSV";
    c.onclick = docsv;
    
    c = r.insertCell(-1);
    c.align='right';
    c.colSpan = NP-3;
    c.style.color = 'blue';
    c.innerHTML =   textmsg[1741]  ; 
    
    c = r.insertCell(-1);
    c.innerHTML =  textmsg[558];
    c.align='right';
    c.style.color = 'blue';
    
    c = r.insertCell(-1);
    c.innerHTML = '100.0';
    c.align='right';
    c.style.color = 'black';
    var sum = 0.0;
    for (var k=0; k < w.length; k++)
    {
        var c = r.insertCell(-1);
        c.style.color = 'blue';
        var y = '' + s[k]; if (y.indexOf('.')<0) y += ".0";
        c.innerHTML =  y;
        c.align='right';
        if (w[k] <= 100 && w[k]>=0)
           sum+= w[k];
        
    }
    tbl.rows[numRows+2].cells[NP-3].align = 'center';
    r = tbl.insertRow(-1);
    r.bgColor = '#FFFFC0';
    var c = r.insertCell(-1);
    c.align='right';
    c.style.color = 'blue';
    c.innerHTML =  "Blackboard";
    c.onclick = dobb;
    
    c = r.insertCell(-1);
    c.colSpan = NP-3;
    c.align='right';
    c.style.color = 'blue';
    c.innerHTML =  textmsg[1742];
    
    c = r.insertCell(-1);
    c.innerHTML = textmsg[1903];
    c.align='right';
    c.style.color = 'blue';
    
    c = r.insertCell(-1);
    c.innerHTML = sum;
    c.align='right';
    c.style.color = 'blue';
    for (var k=0; k < w.length; k++)
    {
        var c = r.insertCell(-1);
        c.style.color = 'blue';
        if (w[k] < -1)
        {
           c.innerHTML = parent.frames[0].msg1601(); 
        }
        else if (w[k] > 100 || w[k] < 0)
        {
           c.innerHTML = textmsg[1858].replace(/ .*/,''); 
        }
        else {var y = '' + w[k]; 
        if (y.indexOf('.')<0) y += ".0";
        c.innerHTML = y;
        }
        c.align='right';
        
    }
   for (var c=0; c < N; c++) 
   {
       maintable.rows[0].cells[c].onclick = function(){onc(this);};
   }
   maintable.rows[numRows+1].cells[0].onclick = function(){onc(this);};
   for (var c=1; c < maintable.rows[numRows+1].cells.length; c++)
   {
      maintable.rows[numRows+1].cells[c].onclick = function(){onc(this);};
      maintable.rows[numRows+1].cells[c].style.color = 'blue';
   } 
    
   for (var c=1; c < maintable.rows[numRows+2].cells.length; c++)
   {
      maintable.rows[numRows+2].cells[c].onclick = function(){onc(this);};
      maintable.rows[numRows+3].cells[c].onclick = function(){onc(this);};  
   } 
   //tbl.rows[numRows+3].cells[2].innerHTML = '';
   tbl.rows[numRows+3].cells[2].align = 'center';
    
}

function getSemester()
{
   return semester;
}
function getCourse()
{
   return courseid;
}
var headingstr = "<table style=border-collapse:collapse;border-color:#707070 border=1><tr><td align=left><nobr>" +  textmsg[646]  + "</nobr></td><td  align=center><nobr>" +  textmsg[28] +"/" + parent.frames[0].msg1145() + "</nobr></td><td align=right><nobr>"+  parent.frames[0].msg254() + "</nobr></td><td align=right><nobr>"+  parent.frames[0].msg320() + "</nobr></td></tr>"; 
var alldetail = [];
var hm = [];
var numGrades = 0;
function getgradeletter()
{
    var xx = parent.frames[0].getGrades();
    if (xx==null || xx=='null')
    {
       xx =     "A:" + 90+ ";"
       +  "B:" + 80 + ";"
       +   "C:" + 70 + ";"
       +   "D:" + 60 + ";"
       +   "F:" + 0;
    }
    var gt = xx.replace(/;$/,'').split(/;/);
    numGrades = gt.length;
    for (var j=0; j < numGrades; j++)
    {
        var xy = gt[j].split(/:/);
        hm[xy[0]] = parseFloat(xy[1]);
    }
}
var scorecol = 3;
var lettercounter = [];

function toLetterGrade(score100)
{
     var hg = numGrades-1;
     let F = parent.frames[0].gradeletter(0);
     let letter = F;
     while (hg>0)
     {
        letter = parent.frames[0].gradeletter(hg);
        if (score100 >=hm[letter])
        {   
            break;
        }
        else
        {
            hg--;
            letter =F;
        }
     }
    return letter;
}
let estimateLetter = [];
function calcestimate()
{
    var s = parent.frames[0].getScs();
    var w = parent.frames[0].getWts(); 
    var  ready = [];
    for (var j=numCols-1, m=s.length-1; m>=0; m--,j--)
    {
        ready[j] = false;
        for (var i=0; i < numRows; i++)
        {
            if (parseFloat(mat[i][j]) + '' != 'NaN') 
            {
                ready[j] = true;
                 
                break;
            }
        }
    }
    lettercounter = [];
    getgradeletter();
    var tbl = document.getElementById('maintable');    
    for (var i=0; i < numRows; i++)
    {
        alldetail[i] =  "";
        var dedetail = '', exdetail='';
        var  weighedScore =0.0, totalWeights = 0.0, extraScore = 0.0, deductScore = 0.0, ss = 0.0;
        for (var j=numCols-1, m=s.length-1; m>=0; m--,j--)
        {
            if (w[m]<=100 && w[m]>=0)
            {
                var score = mat[i][j];
                if (score == '-1'|| score == '-2' || score == '-3'|| s[m]<=0 || ready[j]==false)
                {
                    alldetail[i] = '<tr><td align=left>' + fields[j] +  '</td><td></td><td align=right>' + w[m] + '</td><td></td></tr>' + alldetail[i];
                    continue;
                }
                totalWeights += w[m];
                var y = 0;
                if (score!='' && s[m]>0 && ''+parseFloat(score) !='NaN' )
                {
                    y = parseFloat(score)/s[m]*w[m];
                }
                weighedScore += y;
                alldetail[i] = '<tr><td  align=left>' + fields[j] +  '</td><td align=center>' + ((mat[i][j]==null||mat[i][j]=='null')?'0':mat[i][j]) + '/' + s[m] + '</td><td  align=right>' + w[m] + '</td><td  align=right>' +  y.toFixed(2) + '</td></tr>' + alldetail[i];
           }
           else if (parseFloat(w[m]) == -2)
           {
                var score = mat[i][j];
                var zz=0,y = 0;
                if (score!=null && score!='' && ''+ (zz = parseFloat(score)) !='NaN' )
                {
                    y = absencestr(zz) ;
                    ss += zz;
                    deductScore += y;
                }
                dedetail  = '<tr><td  align=left>' + fields[j] +  '</td><td align=center>' + (score==null?"":score) + '</td><td  align=right>' + parent.frames[0].msg1601() + '</td><td  align=right style="color:#cc0000" >' + y.toFixed(2) + '</td></tr>' ;
            }
           else
           {
                var score = mat[i][j];
                if (score == '-1'|| score == '-2' || score == '-3'|| s[m]<=0 || ready[j]==false)
                {
                    alldetail[i] = '<tr><td align=left>' + fields[j] +  '</td><td></td><td align=right>' + w[m] + '</td><td></td></tr>' + alldetail[i];
                    continue;
                }

                var y = 0;
                if (score!='' && s[m]>0 && ''+(y=parseFloat(score)) !='NaN' )
                {
                    extraScore += y;
                    exdetail += '<tr><td  align=left>' + fields[j] +  '</td><td align=center>' + score + '/'  + s[m] + '</td><td  align=right>' + textmsg[1858].replace(/ .*/,'') + '</td><td  align=right  style="color:#006600" >' + y.toFixed(2) + '</td></tr>';
                }
                else score = '0'; 
                
            }
        }
        var score100 = 0;
        var xstr = '';
        if (totalWeights>0)
        {
            score100 =  100*weighedScore/totalWeights;
        }
        alldetail[i] += "<tr><td  align=right colspan=2>" + textmsg[194] + "</td><td  align=right style=color:#000066 >" +  totalWeights.toFixed(2) + "</td><td  align=right  style=color:#006666 >" +  weighedScore.toFixed(2) + "</td></tr>"
        + exdetail
        + dedetail
        + "<tr><td colspan=4 align=center> <table style=\"font-weight:700\" ><tr><td  style=color:#006666  valign=bottom>" + weighedScore.toFixed(2) + '</td><td colspan=6></td></tr><tr><td><table style=margin:0px><tr><td width=42><div style=height:1px;width:40px;background-color:black></div></td><td>&times;</td><td>100</td></tr></table></td><td> + </td><td style=color:#006600 >'  + extraScore.toFixed(2) + '</td><td> - </td><td   style=color:#CC0000 >' + deductScore.toFixed(2) + '</td><td> = </td><td>' + (score100+extraScore-deductScore).toFixed(2) + '</td></tr><tr><td  style=color:#000066  valign=top>' + totalWeights.toFixed(2) + '</td><td colspan=6></td></tr></table></td></tr></table>';
        score100 += extraScore - deductScore; 
        
        if (score100 < 0)  score100 = 0; 
        
        mat[i][j] = ''+ score100.toFixed(2);
        scorecol = j;
        let lettergrade = toLetterGrade(Math.round(score100));
        //alert(score100 + ' j=' + j + ', ' + mat[i][j] + ', scorecol=' + scorecol);
        if (mat[i][j-1]=='null' ||mat[i][j-1]==null ||mat[i][j-1]=='' || mat[i][j-1] == '-1')
        {
            mat[i][j-1] = lettergrade;
            if (lettercounter[lettergrade] == null)
               lettercounter[lettergrade] = 1;
            else 
               lettercounter[lettergrade] = lettercounter[lettergrade]+1;
        }
        estimateLetter[i] =  lettergrade;
           
        if (mat[i][numCols] !=null && mat[i][numCols] != '' && mat[i][numCols]!='NULL')
        {
            var n = mat[i][numCols].lastIndexOf(' ');
            mat[i][j] = mat[i][numCols].substring(n+1);
          
            alldetail[i]  =  "<pre>"+ mat[i][numCols] + "</pre><br>" + alldetail[i];
        }
    }
} 

calcestimate();
function updatethresh(s)
{
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', "follows.jsp?x=gradethresh&course="+ courseid + "&sessionname="+ 
    sessionname + "&semester=" +semester + "&subdb=" + subdb + "&xxx=" + s.replace(/[;|:]/g,'@'), true);
    xmlhttp.send();
    
}
function repercent(s)
{
    let l2s = s.split(/;/);
    let z = new Array();
    for (let j=0; j < l2s.length; j++) 
    {
       z[j] = [l2s[j].replace(/:.*/,''),parseFloat(l2s[j].replace(/[^:]+:/,''))];
    }
    lettercounter = [];
    for (let i = 0; i < numRows; i++)
    {
        let j = scorecol;
        let score100 = Math.round(parseFloat(mat[i][scorecol]));
        let hg = 0; 
         
        while (true)
        {
            if (score100 >=z[hg][1])
            {   
                let letter = mat[i][j-1]= z[hg][0];
                if (lettercounter[letter] == null)
                    lettercounter[letter] = 1;
                else 
                    lettercounter[letter] = lettercounter[letter]+1;
                break;
            }
            else
            {
                hg++; 
            }
        }
        if (mat[i][numCols] !=null && mat[i][numCols] != '' && mat[i][numCols]!='NULL')
        {
            var n = mat[i][numCols].lastIndexOf(' ');
            mat[i][j] = mat[i][numCols].substring(n+1);
            alldetail[i]  =  "<pre>"+ mat[i][numCols] + "</pre><br>" + alldetail[i];
        }
        setv(i,j-1, mat[i][j]);
    }
}
var onloadbeforegradebook = null;
if (typeof window.onload == 'function')
   onloadbeforegradebook = window.onload;
var tstmp = (new Date()).getTime()%10000000;//parent.frames[0].getTstmp();
var sortold = null;

function markred()
{
    
}
var gradecolumn = 3;
function extracols()
{
    var s = parent.frames[0].getScs();
    var w = parent.frames[0].getWts(); 
    var tbl = document.getElementById('maintable');
    var N = tbl.rows[0].cells.length;
    var NP = N - w.length;
    gradecolumn = NP-2;
    for (var r =0; r < numRows; r++)
    {
        tbl.rows[r+1].cells[NP -1].onclick = function()
        {
            for (var r1=0; r1 < numRows; r1++)
                if (this == tbl.rows[r1+1].cells[NP -1])
                {
                  var xy = findPositionnoScrolling(this);
                  if (valuechanged[r1])
                     myprompt("Score changed. <a href=\"javascript:openaggret()\">" + textmsg[377] +"</a><br>" + headingstr + alldetail[r1],null,null,textmsg[33]);
                  else
                     myprompt(headingstr + alldetail[r1],null,null,textmsg[33]);
                  promptwin.style.left = (xy[0]+60) + "px";
                  promptwin.style.top = xy[1] + "px";
                }
        }
         
        for (var k=0; k < w.length; k++)
        {
            var tx = tbl.rows[1+r].cells[NP+k].innerHTML.replace(/<[^>]*>/g,'');
            if (tx==''  ) continue;
            if (isNaN(tx))
            {
                tbl.rows[1+r].cells[NP+k].style.color = "red";
            }
            var y = parseFloat(tx);
            if (y > s[k] || y==0)
                tbl.rows[1+r].cells[NP+k].style.color = "red";
            else if (y == -1)
            {
                tbl.rows[1+r].cells[NP+k].style.color = "red";
                tbl.rows[1+r].cells[NP+k].style.whiteSpace = "nowrap";
                tbl.rows[1+r].cells[NP+k].innerHTML = textmsg[915];
            }
            else if (y < -1)
            {
                tbl.rows[1+r].cells[NP+k].style.color = "red";
                tbl.rows[1+r].cells[NP+k].style.whiteSpace = "nowrap";
                tbl.rows[1+r].cells[NP+k].innerHTML = textmsg[1861];
            }
            else
            {
                tbl.rows[1+r].cells[NP+k].style.color = "blue";
                tbl.rows[1+r].cells[NP+k].style.whiteSpace = "nowrap";
            }
        }
        tbl.rows[r+1].cells[N -1].style.whiteSpace = 'nowrap';
        if (mat[r][N-1]!=null && !isNaN(mat[r][N-1]))
            tbl.rows[r+1].cells[N -1].innerHTML =  mat[r][N-1] + (" <font color=#990000>(-" +  absencestr(parseInt(mat[r][N-1])).toFixed(1) + ")</font>");
        else
            tbl.rows[r+1].cells[N -1].innerHTML = "0 <font color=#990000>(-0.0)</font>";
        
        if (hints[piccount + r]==null || hints[piccount + r].replace(/ /g,'') == '' || hints[piccount + r].toLowerCase()=='<table></table>')
        {
            hints[piccount + r] = headingstr + alldetail[r] + "<br><table align=center cellspacing=0 cellpadding=0 border=1 style=border-collapse:collapse>";
            for (var hg=numGrades-1; hg>0; hg--)
            {
                var xx = parent.frames[0].gradeletter(hg);
                hints[piccount + r] += "<tr><td width=60>" + xx + "</td><td><input id=gradelevel" + hg + " size=2 class=right value=" + hm[xx] + " onchange=reset('" + xx + "',this.value)>+</td></tr>"
            }
            hints[piccount + r] += "</table>";
            
        }
    }
}

function hideshowcolumn(j,hide)
{
    for (let r=0; r <= numRows ; r++)
    {
        maintable.rows[r].cells[j].style.color =  hide?TBGCOLOR:'blue';
    }
    if (j>=5)
    for (let r=numRows ; r <= numRows+3; r++)
         maintable.rows[r].cells[j-1].style.color =  hide?TBGCOLOR:'blue';
}
window.onload  = function()
{
if (document.getElementById('btnfunc5') === null)
{
    for (let j=0; j < numCols-1; j++) 
        hideshowcolumn(j,ctype[j]=='h');
    
    let  bb = document.createElement('input'); 
    bb.className = "GreenButton";
    bb.id= "btnfunc5";
    bb.style.width = (4.5*font_size) + 'px';
    bb.style.marginLeft =  '100px';
    bb.type="button";
    bb.value =  textmsg[407];
    bb.onclick = customize;
    document.body.appendChild(bb); 
    
    bb = document.createElement('input'); 
    bb.className = "OrangeButton";
    bb.name= "btnfunc6";
    bb.type="button";
    bb.style.width = (4.5*font_size) + 'px';
    bb.value =  textmsg[67];
    bb.onclick = savetempgrade;
    document.body.appendChild(bb); 
    
    bb = document.createElement('input'); 
    bb.className = "GreenButton";
    bb.name= "btnfunc7";
    bb.type="button";
    bb.style.width = (4.5*font_size) + 'px';
    bb.value =  textmsg[409];
    bb.onclick = printing;
    document.body.appendChild(bb); 
    
    
    let d = document.createElement('iframe');
    d.height = "1";d.width = "1";
    d.name="w" + tstmp;
    document.body.appendChild(d);
    
    if (onloadbeforegradebook!=null) onloadbeforegradebook();
    extracols();
    sortold = sort1;
    sort1 = function(j,td)
    {
        let hold = numCols; 
        let L = mat[0].length;
        for (let k=0; k < mat.length; k++)
            mat[k][L] = emails[k];
        L = mat[0].length;
        for (let k=0; k < mat.length; k++)
            mat[k][L] =alldetail[k];
        numCols = L + 1; 
        sortold(j, td);
        for (let k=0; k < mat.length; k++)
        {  
           alldetail[k] = mat[k][L];
           mat[k].splice(L,1);
        }
        L--;
        for (let k=0; k < mat.length; k++)
        {  
           emails[k] = mat[k][L];
           mat[k].splice(L,1);
        }
        numCols = hold;
        extracols();
    };
}
    let tbl = document.getElementById('maintable');
    for (let i=0; i < numRows; i++)
        if (estimateLetter !==null && estimateLetter[i] !== mat[i][scorecol-1] || mat[i][scorecol-1]!=tbl.rows[i+1].cells[scorecol-1].innerHTML)
            tbl.rows[i+1].cells[scorecol-1].style.color = 'red';
};

function rename0(r,c)
{
   if(c==1)
   {
       let s = '';
       estimateLetter = null;
       for (let r=0; true; r++)
       {
           if (subframe.retrv(r,0) == '' || subframe.retrv(r,1) ==''
              || isNaN(subframe.retrv(r,1))) 
             break;
           if (s !='') s += ";";
           s += subframe.retrv(r,0) + ":" +subframe.retrv(r,1);
       }
       parent.frames[0].setGrades(s);
       repercent(s);
       fill(subframe);
       updatethresh(s);
       window.onload();
   }
}
function reset(g, n)
{
     hm[g] = parseFloat(n.replace(/ /g,''));
     var x = "";
     for (var g in hm)
         x += g + ":" + hm[g] + ";";
     parent.frames[0].setGrades(x); 
}
 
 
function afterloadlocal()
{
   let str = document.getElementById('hidetxt').value;
   let comma = str.includes('\t')?"\t":",";
   let p = new CSVParse(str,'"', comma, "\r\n");
   document.getElementById('bbhint').style.visibility = 'visible';
   document.getElementById('download').style.visibility = 'visible';
   document.getElementById('bbsheet').innerHTML = p.tohtml();
   let head = new Array();
   let tbl = document.getElementById('bbsheet').getElementsByTagName('table')[0];
   for (let i=0; i < tbl.rows.length; i++)
       if(tbl.rows[i]!=null && tbl.rows[i].cells.length>=5)
       for (let k =0; k <5; k++)
          if(tbl.rows[i].cells[k]!=null)
             tbl.rows[i].cells[k].style.whiteSpace = "nowrap";
   let N = tbl.rows[0].cells.length;
   
   for (let i=6; i < N; i++)
   {
       let jj = tbl.rows[0].cells[i].innerHTML.indexOf('[');
       if (jj>0)  
       tbl.rows[0].cells[i].innerHTML = tbl.rows[0].cells[i].innerHTML.substring(0,jj).replace(/ $/,'');
       head[head.length] = tbl.rows[0].cells[i].innerHTML;
    
       for (let k =0; k < tbl.rows.length; k++)
          if (tbl.rows[k]!=null && tbl.rows[k].cells[i]!=null) 
          tbl.rows[k].cells[i].align='right';
   }
   
   let thishead = new Array();
   let thislabel = new Array();
   for (let k=4; k < numCols-1; k++)
   {
       thishead[thishead.length] = fields[k];
       thislabel[thislabel.length] = labels[k];
   }
    
  // let bt = bestmatch(head, thishead);
   let oldmap = null;
                          
   let saved = localStorage[orgnum%65536 + "-" + courseid + '-' + sessionname + 'grades'];
  
   oldmap = [];
   if (saved!=null)
   {
      
       let p = (new CSVParse(saved,'"',":", ";")).nextMatrix();
       for (let k=0; k < p.length; k++)
           oldmap[p[k][0]] = p[k][1];
   }
   else
   {
       for (let bbhead of head)
       {
           let bbheadci = bbhead.toLowerCase().replace(/ /g, '');
           for (let u of thishead)
           {
               if (bbheadci == u.toLowerCase().replace(/ /g, ''))
               {
                  oldmap[bbhead] = u; break;
               }
           }
       }
   }
   for (let i=0; i < tbl.rows[0].cells.length-6; i++)
   {
      let ss = '';
     // let bi = saved==null?bt[i]:-1;
      let yy = tbl.rows[0].cells[i+6].innerHTML.replace(/[ ]*<.*$/,'');
      for (let k =0; k < thishead.length; k++)
      {
          let bi = -1;
       
          if (oldmap!=null && oldmap[yy] == fields[k+4])
          {    
              ss = ss.replace(/ selected>/,' >');
              bi = k;
          }
          ss += '<option value="'+ fields[k+4] + '"  ' + (bi==k?'selected':'')  + '>' + thislabel[k] + '</option>';
      }
      if (ss.includes(" selected>")) 
          ss = '<select style="color:orange;border:1px orange solid"><option value=""></option>' + ss;
      else 
          ss = '<select style="color:orange;border:1px orange solid"><option value="" selected></option>' + ss;
      tbl.rows[0].cells[i+6].innerHTML = tbl.rows[0].cells[i+6].innerHTML + '<br>' + ss  + '</select>';
       
   }
   
}
if (typeof(matchscore) == 'undefined')
{
matchscore = function(x,y)
{
    x = x.toLowerCase();
    y = y.toLowerCase();
    if (x.indexOf(y)>=0 || y.indexOf(x)>=0)
        return '085';
    let c = 0;
    for (let k=0; k < x.length; k++)
      if (y.indexOf(x.charAt(k))>=0)
        c++;
    for (let k=0; k < y.length; k++)
      if (x.indexOf(y.charAt(k))>=0)  c++;
    let z= (100*c/(x.length + y.length));
    if (z < 50) return '000';
    else if (z == 100) return '100';
    return '0' + z.toFixed(0);
}
}
function bbmerge()
{
   let tbl = document.getElementById('bbsheet').getElementsByTagName('table')[0];
   let str = document.getElementById('hidetxt').value;
   let comma = str.includes('\t')?"\t":",";
   let p = new CSVParse(str,'"', comma, "\r\n");
   let m = p.nextMatrix();
   let map = new Array();
   let done = ",";
   let nomatch = "";
   for (let i=1; i < m.length; i++)
   {
       if (m[i].length<4)continue;
       let k = 0;
       let sid = m[i][3];
       for (; k < mat.length; k++)
       {
           if (mat[k][0]==sid)
           {
               map[i] = k;
               done += k + ",";
               break;
           }
       }
       if (map[i] == null)
       {
          let email = m[i][2];
          k = 0;
          for (; k < emails.length; k++)
          {
           if ( done.indexOf("," + k + ",")<0 && emails[k]==email)
           {
               map[i] = k;
               done += k + ",";
               break;
           }
           } 
        }
        if (map[i] == null)
        {
          let lastname = m[i][0];
          let firstname = m[i][1];
          k = 0;
          for (; k < emails.length; k++)
          {
           if ( done.indexOf("," + k + ",")<0  && 
                  parseInt(matchscore(lastname,  mat[k][1]).replace(/^[0]+/,'')) > 80
               && parseInt(matchscore(firstname, mat[k][2]).replace(/^[0]+/,'')) > 50
               )
           {
               map[i] = k;
               done += k + ",";
               break;
           }
           } 
        }
        if (map[i] == null)
        {
            tbl.rows[i].cells[0].bgColor = "red";
            tbl.rows[i].cells[1].bgColor = "red";
            tbl.rows[i].cells[2].bgColor = "red";
            tbl.rows[i].cells[3].bgColor = "red";
        }
        else
        {
          
        }
   }
   
   let col2col = "";
   for (let k=6; k < tbl.rows[0].cells.length; k++)
   {
       let sel = tbl.rows[0].cells[k].getElementsByTagName('select')[0];
       let sl = sel.selectedIndex;
       if (sl == 0) continue;
       col2col += ";" +  m[0][k].replace(/\[.*$/,'').replace(/ $/,'')  + ":" + sel.options[sl].value;
       sl += 3;
       for (let i=1; i < m.length; i++)
       {
           let ii = map[i]; 
           if (ii == null) continue;
           ii++;
           
           let cel = maintable.rows[ii].cells[sl];
           if (cel == null) continue;
           let value = cel.innerHTML;
        
           if (isNaN(value)) continue;
           m[i][k] = value;
           tbl.rows[i].cells[k].innerHTML = tbl.rows[i].cells[k].innerHTML + "&rarr;<font color=red>" + value + "</font>";
       }
   }
   if (col2col.length>0)
   localStorage[orgnum%65536 + "-"+courseid+"-"+sessionname + "grades"] = col2col.substring(1);
  
   let backstr = '';
   for (let i=0; i < m.length; i++)
   for (let k=0; k < m[i].length; k++)
   {
       backstr += '"' + m[i][k] + '"';
       if (k < m[i].length-1) backstr += ',';
       else if (i < m.length-1) backstr += '\n';
   }
   let filename = document.getElementById('localpath').value;
   let z = filename.lastIndexOf('/');
   if (z == -1)
   {
      z = filename.lastIndexOf('\\');
   }
   filename = filename.substring(z+1).replace(/\....$/,"M.csv");
   download(backstr,null,filename);
}
function openlfile(td)
{
    let x = document.getElementById("hidetxt");
    openfileto(td, x, afterloadlocal);
}

function fill(w)
{
   subframe = w;
   for (let r=0; r < w.passoverNumRows(); r++)
   {
       if (w.retrv(r,0) == '' || w.retrv(r,1) =='' || isNaN(w.retrv(r,1))) break;
       let c = lettercounter[w.retrv(r,0)];
       if (c == null) c = 0;
       let p = (100*c/numRows).toFixed(0) + '%';
       w.setv(r,3,""+c);
       w.setv(r,4,p);
   }  
}
function dobb()
{
    let ms = textmsg[1883].split(/@/);
    let str= '<nobr>'+ ms[0] + '&nbsp;</nobr><input type=hidden id=hidetxt><input type="file" style="border:1px #b0b0b0 solid;" id=localpath onchange="openlfile(this)" ><br><span id=bbhint style=visibility:hidden;margina-right:40px><span style="color:orange;border:1px orange solid">&rarr;</span>' + ms[1] +
         '</span><input id="download" type="button" class="GreenButton" style="visibility:hidden;width:'
            + (4.5*font_size) + 'px;" value="' + ms[2] +'" onclick="bbmerge(this)">'    
            + '<div id=bbsheet></div>';
    myprompt(str,null,null,"Blackboard " + textmsg[1883].split(/@/)[2]); 
    window.scrollTo(0, 10);
    promptwin.style.width = null;
    promptwin.style.left = "5px";
    promptwin.style.top = "120px";
}
var cols = [];
function docsv()
{
     
    var labs = maintable.rows[0].cells;
    let n = labs.length + 1;
    let lbls = new Array(n);
    for (let k =0; k < n;k++)
        if (k < 3)
            lbls[k] = labs[k].innerHTML;
        else if (k==3)
            lbls[k] = textmsg[516];
        else 
            lbls[k] = labs[k-1].innerHTML;
    var tbl = "<table style=border-collapse:collapse border=1 id=seltbl>";
  //  tbl += "<tr><td>" + textmsg[816] + "</td><td>" +   textmsg[1600] + "</td><td>" +   textmsg[1005] + "</td><td>"  + textmsg[1922] + "</td></tr>";  
    var u = (n%2==1)?((n-1)/2):(n/2-1);
    var m = n%2==1?1:2;
    var k = 0;
     
    for (var j=0; j < n; j++)
    {
        tbl += "<tr><td onclick=movetd1(this," + j + ") align=left width=150>" + lbls[j]  + "</td>";
        //if (j==2)  tbl += "<tr><td onclick=movetd1(this," + labs.length + ") align=left width=150>" + "Email" + "</td>";
        if (j==0) tbl +=  "<td valign=middle rowspan=" + u + " onclick=addlab() align=center width=100> &rarr; </td>";
        else if (j == u)tbl +=  "<td valign=middle align=center rowspan=" + m + " onclick=addalllab()> >> </td>";
        else if (j == u+m)tbl +=  "<td valign=middle align=center rowspan=" + u + " onclick=removelab()> &larr; </td>";
        tbl += "<td onclick=movetd(this," + j + ") width=150>" +   (j>=cols.length ?'':(lbls[cols[k++]])) + "</td></tr>";//<td align=center><input id=round" + j + "  type=checkbox></td></tr>";
        //if (j==2)  tbl += "<td onclick=movetd(this," + labs.length + ") width=150></td></tr>";
        
    }  
    tbl += "</table><center><input class=OrangeButton value=\"" + textmsg[18] + "\" style=width:80px;text-align:center onclick=cancelsel()>";
    tbl += "<input class=GreenButton value=\"" + textmsg[66] + "\" style=width:80px;text-align:center onclick=doselscv()></center>"
    myprompt(tbl,null,null,textmsg[739]);
    var tbl = document.getElementById("seltbl"); 
    if ( 0 < cols.length)
    {
        for (var j=0; j < cols.length; j++)
        {
            tbl.rows[cols[j]].cells[0].style.visibility = "hidden";
        }
        seledn = cols.length;
    }
    promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].onclick = function()
   {
    cancelsel();
   }
}

function cancelsel()
{  
    selj = -1; 
    selk = -1; 
    cols = [];
    var tbl = document.getElementById("seltbl"); 
    for (var i=0; i < seledn; i++)
    {
       var x = tbl.rows[i].cells[tbl.rows[i].cells.length-1].innerHTML;
       for (var j=0; j < tbl.rows.length; j++)
       if (x == tbl.rows[j].cells[0].innerHTML )
       {
           cols[cols.length] = j;
           break;
       }
    } 
    closeprompt();
}

function doselscv(havingcol){
    if (seledn == 0) return;
    var tbl = document.getElementById("seltbl"); 
    if (havingcol == null)
    {
    cols = [];
    for (var i=0; i < seledn; i++)
    {
       var x = tbl.rows[i].cells[tbl.rows[i].cells.length-1].innerHTML;
       for (var j=0; j < tbl.rows.length; j++)
       if (x == tbl.rows[j].cells[0].innerHTML )
       {
           cols[cols.length] = j;break;
       }
    } 
    }
    var s = '';
    var R = maintable.rows.length;
    var dida = false;
    var dids = false;
    var didw = false;
    var maxl = 0;
    var quote = checkquote=='d'?'"':(checkquote=='s'?"'":'');
    for (var i= 0; i < R; i++)
    {
        var n = cols.length;
        var n0 = s.length;
        for (var j = 0; j < n; j++)
        {
            if (j > 0) s += ","; 
            else if (i > 0) s += '\n';
            var k = cols[j];
            
            if (i == R-3) 
            {
                if (k == 0) 
                    s += quote +   maintable.rows[i].cells[0].innerHTML.replace(/<[^>]+>/g,'') + quote;
                else if (k < 4)
                { 
                    if (dida==false)
                    { 
                        s += quote +  "average" + quote; 
                        dida=true;
                    } 
                    else
                    {
                        s += quote + quote;
                    }
                }
                else 
                    s += quote +  maintable.rows[i].cells[k-3].innerHTML.replace(/<[^>]+>/g,'') + quote;
            }
            else  if (i == R-2) 
            {
                if (k < 4){ if (dids==false){ s += quote +  "scale" + quote; dids=true;} else s += quote + quote;}
                else  s += quote +  maintable.rows[i].cells[k-4].innerHTML.replace(/<[^>]+>/g,'') + quote;
            }
            else if (i == R-1)
            {
                 if (k < 4){ if (didw==false){ s += quote +  "weight" + quote; didw=true;} else s += quote + quote; }
                 else  s += quote +  maintable.rows[i].cells[k-4].innerHTML.replace(/<[^>]+>/g,'') + quote;
            }
            else 
            {   
                var str = "";
                if (k < 3)
                   str = maintable.rows[i].cells[k].innerHTML.replace(/<[^>]+>/g,'');
                else if (k==3)
                {
                   if (i>0) 
                      str = emails[i-1];
                   else 
                      str = textmsg[516];
                }
                else  
                {   
                   str = maintable.rows[i].cells[k-1].innerHTML.replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ');
                 //  alert(str)
                 //  if ( !isNaN(str) && document.getElementById('round' + (k-1)).checked) 
                 //       str = '' + parseFloat(str).fixed(0);
                }
                   if (str.replace(/ /g,'')=='') 
                      s += quote + "0" + quote;
                   else if (str.indexOf(",") >= 0 )
                      s += "\"" + str.replace(/"/g, '') + "\"";
                   else
                      s += quote + str.replace(/"/g, '') + quote;
            }
        }
        var ll = s.length - n0;
        if (ll > maxl) maxl = ll;
    }
    let xs = textmsg[1882].split(/@/);
    myprompt("<textarea id=csv style=font-family:courier cols=" + maxl + " rows=" + (R+1) + ">" 
            + s + "</textarea><br>"+ xs[0] + ":<select onchange=addquote(this)><option value=d "
            + (checkquote=='d'?"selected":"") + "> " + xs[1] + "</option><option value=s "
            + (checkquote=='s'?"selected":"") + "> " + xs[2] + "</option><option value=n "
            + (checkquote=='n'?"selected":"") + "> " + xs[3] + "</option></select>"
            + '<center><input id="download" type="button" class="GreenButton" style="width:'
            + (4.5*font_size) + 'px;" value="' + textmsg[1871].split(/@/)[3]+'" onclick="download1()"></center>',
            null,null,  courseid + "-"+ sessionname +  "grades.csv");
}
function download1()
{
    download(null, 'csv',courseid + '-'+ sessionname +  "grades.csv");
}
function download(contents, id,filename) 
{
        let mime_type =  "text/csv";
        if (contents == null)
        contents = document.getElementById(id).value;
        var blob = new Blob([contents], {type: mime_type});

        var dlink = document.createElement('a');
        dlink.download = filename;
        dlink.href = window.URL.createObjectURL(blob);
        dlink.onclick = function(e) {
            // revokeObjectURL needs a delay to work properly
            var that = this;
            setTimeout(function() {
                window.URL.revokeObjectURL(that.href);
            }, 1500);
        };

        dlink.click();
        dlink.remove();
    }
function addquote(ck)
{
   checkquote = ck.options[ck.selectedIndex].value;
   doselscv(1);
}
var checkquote = 'd';
var selj = -1;
var selk = -1;
var seledn = 0;
function movetd(td,j)
{
    if (j < seledn)
    selk = j;
}
function movetd1(td,j)
{
    var tbl = document.getElementById("seltbl"); 
    if (tbl.rows[j].cells[0].style.visibility != 'hidden')
    selj = j;
}
function addlab()
{
    if (selj == -1) return;
    var tbl = document.getElementById("seltbl"); 
    tbl.rows[seledn].cells[tbl.rows[seledn].cells.length-1].innerHTML = tbl.rows[selj].cells[0].innerHTML;
    tbl.rows[selj].cells[0].style.visibility = 'hidden';
    selj = -1;
    seledn++;
}
function addalllab()
{
    var tbl = document.getElementById("seltbl"); 
    for (var j=0; j < tbl.rows.length; j++)
    if (tbl.rows[j].cells[0].style.visibility != 'hidden')
    {
        tbl.rows[seledn].cells[tbl.rows[seledn].cells.length-1].innerHTML = tbl.rows[j].cells[0].innerHTML;
        tbl.rows[j].cells[0].style.visibility = 'hidden';
        seledn++;
    }
    selk = selj = -1;
}
function removelab()
{
    if (selk == -1) return;
    var tbl = document.getElementById("seltbl"); 
    var x = tbl.rows[selk].cells[tbl.rows[selk].cells.length-1].innerHTML;
    for (var j=0; j < tbl.rows.length; j++)
    if (x == tbl.rows[j].cells[0].innerHTML )
    {
        tbl.rows[j].cells[0].style.visibility = 'visible';
        break;
    }
    for (var i=selk; i < seledn-1; i++)
    {   
        tbl.rows[i].cells[tbl.rows[i].cells.length-1].innerHTML = tbl.rows[i+1].cells[tbl.rows[i+1].cells.length-1].innerHTML;
    }
    seledn--;
    tbl.rows[seledn].cells[tbl.rows[seledn].cells.length-1].innerHTML = '';
}

function alertmessage()
{
    let j = scorecol-2;
    if (document.getElementById("chk_1") == null)
    {
        var tbl = document.getElementById('maintable');
        let F = parent.frames[0].gradeletter(0);
        for (let i=1; i <= numRows; i++)
        {
           let cell = tbl.rows[i].cells[j];
           let chk = document.createElement('input');
           chk.id = "chk_" + i;
           chk.type = 'checkbox';
           chk.style='float:right';
           let cell1 = tbl.rows[i].cells[j+1];
           if (cell1.innerHTML.replace(/<[^>]+>/g,'') == F)
               chk.checked = true;
           cell.appendChild(chk);
        }
        let str = '<table class=outset1 ><tr><td style="white-space:nowrap">' + textmsg[1902] 
                + '</td><td><input id=subject class=left style="border:1px #808080 solid;border-radius:3px" value="' + textmsg[1903] + ": " + courseid +'" ></td></tr><tr><td valign=top  style="white-space:nowrap">'
                +textmsg[449] + '</td><td><textarea id=msg rows=5 cols=40>' + textmsg[1931] + '</textarea></td></tr><tr><td colspan=2 align=center>'
        + '<input class=GreenButton type=button style=width:' + (4.5*font_size) + 'px onclick=sendmsg() value="' +textmsg[223]+ '">'
        + '<input class=OrangeButton  type=button style=width:' + (4.5*font_size) + 'px onclick=cancelmsg() value="' +textmsg[18]+ '"></td></tr></table>';
        myprompt(str,null,null,textmsg[1903]);
        let xy = findPositionnoScrolling(tbl.rows[numRows+3].cells[3]);
        promptwin.style.left = xy[0] + 'px';
        promptwin.style.top = (xy[1] - promptwin.offsetHeight) + 'px';
    }
}
function cancelmsg()
{
   let i = 1;
   let c;
   while ((c = document.getElementById("chk_" + i)) != null)
   {
      c.parentNode.removeChild(c);
      i++;
   }
   closeprompt();
}
function sendmsg()
{
   let i = 1;
   let c;
   var tbl = document.getElementById('maintable');
   let sids = '';
   while ((c = document.getElementById("chk_" + i)) != null)
   {
       if (c.checked)
       {
           let sid = tbl.rows[i].cells[0].innerHTML.replace(/<[^>]+>/g,'');
           sids += ',' + sid;
       }
       i++;
   }
   if (sids == '') 
   {
       myprompt(textmsg[247]);
       return;
   }
   sids = sids.substring(1);
   let subject = document.getElementById('subject').value;
   let msg = document.getElementById('msg').value;
   let wcds = "u'" + subject + "','" + msg.replace(/'/g,"''") + "','0','" + subdb + "','','"+ sids + "'";
   postopen('SaveBack',['rdap','subdb','securitytoken','wcds','orgnum','rsacode'],
   ['messagenew',subdb,'',wcds,orgnum,'0'],'w' + tstmp);
   i = 1;
   while ((c = document.getElementById("chk_" + i)) != null)
   {
       c.parentNode.removeChild(c);
       i++;
   }
   closeprompt();
}
function syn(n,ss)
{
   myprompt(ss);
}

function matchscore(x,y)
{
    x = x.toLowerCase();
    y = y.toLowerCase();
    if (x.indexOf(y)>=0 || y.indexOf(x)>=0)
        return '085';
    let c = 0;
    for (let k=0; k < x.length; k++)
      if (y.indexOf(x.charAt(k))>=0)
        c++;
    for (let k=0; k < y.length; k++)
      if (x.indexOf(y.charAt(k))>=0)  c++;
    let z= (100*c/(x.length + y.length));
    if (z < 50) return '000';
    else if (z == 100) return '100';
    return '0' + z.toFixed(0);
}
customize = function()
{
    var NP = maintable.rows[0].cells.length - assn.length;
    var str = '';
    str += ("<form rel=opener name=fc style=\"margin:5px 0px 0px 0px\"   ><input type=hidden name=x value=fontsize>");
    str += ("<TABLE width=100%  class=outset1  cellpadding=0 cellspacing=0 ><TR><TD valign=TOP  bgcolor=#666666>");
    str += ("<TABLE BORDER=0 cellpadding=3 cellspacing=1 width=100% bgcolor="+ DBGCOLOR + ">");
    str += "<tr><td valign=top bgcolor=\"" + BBGCOLOR + "\"  align=left><nobr><b>" + textmsg[646] + "</b></nobr></td>";
    str += "<td bgcolor=\"" + BBGCOLOR + "\"  align=center><nobr><b>" + textmsg[1922] + "</b></nobr><br>";
    var defv = 1;
    if (cachedstr!=null)
    {
       let vl = (cachedstr + ";").replace(/[^_]+_([0-9]);/g, "$1");
       let n0 = vl.replace(/1/g,'').replace(/2/g,'').length;
       let n1 = vl.replace(/0/g,'').replace(/2/g,'').length;
       let n2 = vl.replace(/1/g,'').replace(/0/g,'').length;
       if (n0>=n1 && n0>=n2) defv = 0;
       else if (n2>=n1 && n2>=n0) defv = 2;
    }    
    str +=  (" <select style=\"border:1px #b0b0b0 solid;border-radius:2px;text-align:right;width:40px\" size=1  id=wddall  name=wdall onchange=setcustomall(this)><option value=0 " + (defv=='0'?'selected':'') + ">0</option><option value=1  " + (defv=='1'?'selected':'') + ">1</option><option value=2  " + (defv=='2'?'selected':'') + ">2</option></select>");
    str += "</td><td  valign=top bgcolor=\"" + BBGCOLOR + "\"  align=center><b>" + textmsg[732] + "</b></td></tr>";
    
    for (var i=0; i < numCols-1; i++)
    {
       str +=  "<tr><td align=left><b><nobr>" + labels[i] + "</nobr></b></td>";
       str += ("<td  align=center>");
       if (i >= NP-1){
       let vl = fsize[i].replace(/.*_/,'')  ;
       str +=  (" <select style=\"border:1px #b0b0b0 solid;border-radius:2px;text-align:right;width:40px\" size=1  id=wd" + i + "  name=w"+i +" onchange=setcustom1(this," +i +")><option value=0 " + (vl=='0'?'selected':'') + ">0</option><option value=1 " + (vl=='1'?'selected':'') + ">1</option><option value=2 " + (vl=='2'?'selected':'') + ">2</option></select>");
       }str += ("</td><td  align=center><input  type=checkbox style=background-color:" + BBGCOLOR +"  id=hide" + i + "  name=hid"+i + " onclick=setcustom4(this,"+ i + ") "  + (ctype[i]=='h'?'checked':''));
       str += ("></td></tr>");
    }
    str += ("</table></td></tr></table><br>");
    str += ("<center><input type=button name=btn class=GreenButton  style=width:" + butwidth(textmsg[744])*1.3 +"px  value=\"" +textmsg[744]
    + "\" onclick=\"setcustom2(-3);restart()\" >");
    str += ("<input type=button name=btn  class=GreenButton style=width:" + butwidth(textmsg[749])*1.3 +"px  value=\""
    + textmsg[749]+ "\" onclick=\"setcustom2(-2);restart()\"  ></center></form>  ");
    myprompt(str,null,null,textmsg[745]);//+ ": "+ title );
}
function setcustom4(ck, i)
{
    ctype[i] = ck.checked?'h':'N';
    hideshowcolumn(i, ctype[i]=='h');
}
function setcustomall(sel)
{
     
     let j = sel.selectedIndex;
     if (j < 3)
     {
         var NP = maintable.rows[0].cells.length - assn.length;
         for (var i=NP-1; i < numCols-1; i++)
            document.getElementById('wd' + i).selectedIndex = j;
     }
}
function setcustom1(sel, c)
{
     let j = sel.selectedIndex;
     let val = sel.options[j].value;
     fsize[c] = fsize[c].replace(/_([0-9])$/, '_' + val);
     for (let j=0; j < numRows;j++)
     {  
         let xx = numberstr(mat[j][c],''+val);
         maintable.rows[j+1].cells[c].innerHTML = xx;
     }
}
function restart()
{
    document.location.href = theurl; 
}
function setcustom2(c)
{
    
    var NP = maintable.rows[0].cells.length - assn.length;
   
    if (c == -3)
    {
        localStorage.removeItem("custom"+rdapname);
    }
    else if (c == -2)
    {
        var str = "0;0;";
        var NP = maintable.rows[0].cells.length - assn.length;
        for (var i = 0; i < numCols; i++)
        {
            if ( i >= NP-1 && i < numCols-1)
            {
                let sel = document.getElementById('wd' + i);
                let val = sel.options[sel.selectedIndex].value;
                fsize[i] = fsize[i].replace(/_[0-9]+$/, '_' + val);
                
            }
            let bb = false;
            sel = document.getElementById('hide' + i); 
            if (sel!=null)
            {
                bb = sel.checked;
               // hideshowcolumn(i,bb); 
            } 
            ctype[i] = bb?'h':'N';
            str += ((ctype[i] == 'h') ? '1' : '0');
            str += fsize[i];
            if (i < numCols - 1)str += ";";
        }
        localStorage["custom" + rdapname] = str;
    }
    
}
function savetempgrade()
{
    let grades = '';
    let tbl = document.getElementById('maintable');
     
    if (estimateLetter!=null)
    {
        for (let j=0; j < numRows; j++)
        {
           grades +=  estimateLetter[j] + ":" + mat[j][0]; 
           mat[j][scorecol-1] = estimateLetter[j];
           tbl.rows[j+1].cells[scorecol-1].style.color = 'black';
           if (j < numRows-1) grades += ";";
        }
    }
    else
    for (let j=0; j < numRows; j++)
    {
       grades +=  mat[j][gradecolumn] + ":" + mat[j][0]; 
       if (j < numRows-1) grades += ";";
    }
    postopen('follows.jsp','x,subdb,course,semester,sessionname,grades'.split(/,/),['savetempg',subdb,courseid,semester,sessionname,grades],'w' + tstmp);
}
function fontstr(partname, fontname, dname, fontsize,dsize1, fontcolor, dcolor, bgcolor,k)
{
   var fot = textmsg[1594]; var fontarr = fot.split("@");
   var str = "<table  width=100%  border=0 bgcolor=" + bgcolor + "><tr><td width=120><nobr>" + partname +textmsg[737] +":</nobr> </td><td > <nobr> { "
   +textmsg[737]+ "</nobr></td><td><select   name=" + fontname + " onchange=testfont1(1,this,"+k+",'" +bgcolor+"') >";
   for (var i=0; i < fontarr.length; i++)
   {
      fontarr[i] = fontarr[i].replace(/,.*/,'');
      str +="<option value=\"" + fontarr[i] +"\" ";
      if (fontarr[i]==dname) str +=" selected ";
      str +=">" + fontarr[i] +"</option>";
   }
   str +="</select></td><td><nobr> "+textmsg[734]+ "</nobr></td><td> <input  style=\"border-radius:2px;border:1px #b0b0b0 solid\"   name=" + fontsize +" value=\"" + dsize1 +"\" size=3 onchange=testfont(2,this.value,"+k+",'" +bgcolor+"')></td><td><nobr>pt  &nbsp;"
   +textmsg[738]+ "</nobr></td><td><input  type=color   name=" + fontcolor +" value=\"" + dcolor +"\" size=4 onchange=testfont(3,this.value,"+k+",'"
   +bgcolor+"')></td><td>} </td><td id=\"samplelooks" + k
   +"\" style=\"background-color:" + bgcolor +";color:"
   + dcolor +";font-family:" + dname +";font-size:" + dsize1 +"\"><nobr>" + textmsg[796] +"</nobr></td></tr></table>";
  
   return str;
}

var printstylestr = localStorage["print-" + rdapname];

if (printstylestr==null || printstylestr=='')
   printstylestr="image/tm.gif,arial,28,#FF0000,arial,12,#0000FF,arial,12,black,1";

function resetdefualtprint()
{
   printstylestr="image/tm.gif,arial,28,#FF0000,arial,12,#0000FF,arial,12,black,1";
   localStorage.removeItem("print-" + rdapname);
   printing();
}

var rowselection = "1-" + NUMROWS;

var lineFolding = true;
var captionvalue = true;
function whichcell1(k)
{
   return  document.getElementById("samplelooks" + k);
}
var styleeles = [];
function go()
{
    if (document.f.tfontname.selectedIndex>=0)
        printstyle2(document.f.logo.value,document.f.tfontname.options[document.f.tfontname.selectedIndex].value,document.f.tfontsize.value,document.f.tfontcolor.value,document.f.tborder.value,document.f.hfontname.options[document.f.hfontname.selectedIndex].value,document.f.hfontsize.value,document.f.hfontcolor.value,document.f.cfontname.options[document.f.cfontname.selectedIndex].value,document.f.cfontsize.value,document.f.cfontcolor.value);
}
function testfont1(i,th,j,c)
{
    var k=th.selectedIndex;
    if (k>-1){testfont(i,th.options[k].value,j,c);}
}
function testfont(i,v,j,c)
{
    styleeles[i+3*(j-1)] = v;
    
    var cel= document.getElementById("samplelooks" + j);
    if (cel!=null)
        cel.style.cssText='background-color:'+c+';font-name:'+styleeles[1+(j-1)*3]+';font-size:'+styleeles[2+(j-1)*3]+';color:'+styleeles[3+(j-1)*3];
     
}

var illustration = "";
function setIllustation(ta){illustration=ta.value;}
function printing()
{
    styleeles = printstylestr.split(",");
    var str = '';
    str += ("<table border=0 valign=center align=center style=\"margin:4px 4px 4px 4px\" > <tr><td align=center>  ");
    str += ("<form rel=opener name=f margin=\"5 0 0 0\"  >");
    str += ("<table cellpadding=0 cellspacing=0 class=outset1 width=100%><tr><td>");
    str += ( "<TABLE width=100% cellpadding=0 cellspacing=1 class=outset1  border=0>");
    str += ( "<TR bgcolor=" + DBGCOLOR + "><td  width=100% align=center>");
    str += (textmsg[736]+ "<input  style=\"border-radius:2px;border:1px #b0b0b0 solid\"  name=logo size=30 onblur=\"document.f.logoimg.src=this.value\" value=\"" + styleeles[0] +"\"><br><img name=logoimg src=\""+styleeles[0] +"\">");
    str += ("</td></tr></table></td></tr></table><br>");
    str += ("<table cellpadding=0 cellspacing=0 class=outset1 width=100%><tr><td>");
    str += ( "<TABLE width=100% cellpadding=0 class=outset1 cellspacing=1 border=0>");
    str += ( "<TR bgcolor=" + DBGCOLOR + "><td  width=100% align=center>");
    str += (fontstr(textmsg[441], "tfontname", styleeles[1], "tfontsize", styleeles[2], "tfontcolor", styleeles[3], DBGCOLOR,1));
    str += ("</td></tr></table></td></tr></table><br>");
    str += ("<table cellpadding=0 cellspacing=0 class=outset1  width=100%><tr><td>");
    str += ( "<TABLE width=100%  class=outset1><tr><td valign=top>");
    str += (textmsg[143]+ "</td><td><textarea name=notes rows=2 style=width:98% cols=70 onblur=setIllustation(this)></textarea></td></tr></table>");
    str += ("</td></tr></table><br>"+textmsg[741]+ "<input  style=\"border-radius:2px;border:1px #b0b0b0 solid\"    name=tborder value="+styleeles[10] +" size=7><br>");

    str += ("<table cellpadding=0 cellspacing=0 class=outset1  width=100%><tr><td bgcolor=\"" + IBGCOLOR + "\">");
    str += ( "<TABLE width=100% cellpadding=3 cellspacing=1 border=1  bgcolor="+ DBGCOLOR + " style=border-collapse:collapse>");
    str += ( "<TR bgcolor=\"" + BBGCOLOR + "\"><td  width=100% colspan=" + (numCols+1) +">");

    str += (fontstr(textmsg[739], "hfontname", styleeles[4], "hfontsize", styleeles[5], "hfontcolor", styleeles[6],BBGCOLOR,2));
    str += ("</td></tr>");
    
    for (var kk=0; kk < numCols/10; kk++){
    let str1 = "<tr ><td><nobr><b>"+textmsg[816]+ "</b></nobr></td>", str2 = "<tr><td><nobr><b>"+textmsg[732]+ "</b></nobr></td>", str3="<tr><td><nobr><b>"+textmsg[733]+ "</b></nobr></td>";
    
    for (var i =kk*10; i < numCols && i < (kk+1)*10; i++)
    {
      
      if (fields[i] == 'onload'||fields[i] == 'onclose' || fields[i] == 'onbegin' || fields[i] == 'cellonfocus' || fields[i] == 'cellonblur' ||
      fields[i] == 'onsaved' || fields[i] == 'exbut' ) continue;
      str1 += ("<td bgcolor=\"" + BBGCOLOR + "\" valign=top> <nobr>" + labels[i] + "</nobr> </td>");
      str2 +=  "<td><center><input type=checkbox name=c" + i +" value=on onclick=setcustom(((this.checked)?'t':'f'),"+i+") ";
      if (ctype[i]=='h') str2 += (" checked ");  str2 += ("></center></td>");
      str3 +=  "<td><center>";
      if (ctype[i]=='t' || ctype[i]=='a'|| ctype[i]=='T' || ctype[i]=='A' || ctype[i]=='u' || ctype[i]=='U')
      {
         str3 += (" <input style=\"border:1px #b0b0b0 solid;border-radius:2px;text-align:right\" size=2 name=w"+i +" value=\""+fsize[i] +"\" onkeypress=\"return isDigitEvent()\" onchange=setcustom(this.value," +i +")>");
      }
      str3 += ("</center></td>");
     }
     str1 += ("</tr>"); str2 += ("</tr>");str3 += ("</tr>");
     str += "<tr height=15><td colspan=11></td></tr>";
     str += str1 + str2; 
     if (kk==0) str += str3;
     }
     var vv = ""; if (typeof(hasroworder) != 'undefined' && hasroworder) vv = "checked";
     str += ("<tr height=30>    <td width=100%   colspan=" + (numCols+1) +" bgcolor=" + TBGCOLOR +">");
     str += ("<input type=checkbox name=c00 value=on onclick=setcustom(((this.checked)?'t':'f'),-4) " + vv +" > <b><nobr>" +
     textmsg[789]
     + "</nobr></b><br>");
     vv = ""; if (!captionvalue) vv = "checked";
    // str += ("<input type=checkbox   name=c01 value=on onclick=passLineFolding(!this.checked,0)  " + vv + " > <b><nobr>" +
    // textmsg[788]
     //+ "</nobr></b>
    // str += (  "<br>");
     vv = ""; if (lineFolding) vv = "checked";
     //str += ("<input type=checkbox name=linefolding onchange=passLineFolding(this.checked,1)  " + vv + " > <b><nobr>"  + textmsg[743]+ "</nobr></b>");
     str += ("</td></tr>");
     str += ("<tr  height=30>    <td width=100%   colspan=" + numCols +">");
     str += (fontstr(textmsg[740], "cfontname", styleeles[7], "cfontsize", styleeles[8], "cfontcolor", styleeles[9], TBGCOLOR,3));
     str += ("</td></tr> <tr  height=30><td width=100%   colspan=" + numCols +"  bgcolor=" + TBGCOLOR +"><nobr> "+textmsg[742]+ " <input name=rowselect  style=\"border-radius:2px;border:1px #b0b0b0 solid\"  size=22 value=\"" + rowselection + "\" onblur=passRowselect(this.value)> (" + textmsg[750] +":  13-15,18) </nobr></td></tr>");
     str += ("</table></td></tr></table> <link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\" /><br>");
     str += ("<input  class=GreenButton style=width:" + butwidth(textmsg[744])*1.3 + "px type=button name=btn value=\"" + textmsg[744]+ "\" onclick=resetdefualtprint()   >");
     str += ("<input  class=GreenButton style=width:" + butwidth(textmsg[408])*1.3 + "px type=button name=btn value=\"" + textmsg[408] +"\" onclick=go()  >");
    
     str += ("</form></td></tr></table>");
    // str += ("<center> <font size=-1>"+textmsg[790]+"</font></center>");
     myprompt(str,null,null,textmsg[735]);
     promptwin.style.left = "10px";
}
function isinrange(k)
{
   var  rowselectionarray = rowselection.split(/[ ]*,[ ]*/);
   k++;
   for (var i=0; i < rowselectionarray.length; i++)
   {
      var tt = rowselectionarray[i].split(/[ ]*-[ ]*/);
      if (tt.length == 1)
      {
         if (rowselectionarray[i] == '' + k) return true;
      }
      else
      {
         var b1 = parseInt(tt[0]);
         var b2 = parseInt(tt[1]);
         if ( '' + b1 == 'NaN' || '' + b2 == 'NaN') continue;
         if (b1 <= k && b2 >= k) return true;
      }
   }
   return false;
}
printstyle2 = function(logo,tfontname,tfontsize,tfontcolor,bord,hfontname,hfontsize,hfontcolor,cfontname,cfontsize, cfontcolor)
{
     
    printstylestr = logo + ',' + tfontname + ',' + tfontsize + ',' + tfontcolor + ',' + hfontname + ',' + hfontsize + ',' + hfontcolor + ',' + cfontname + ',' + cfontsize + ',' + cfontcolor + ',' + bord + ',' + hasroworder;

    localStorage["print-" + rdapname] = printstylestr;
    var a = [];
    a[0] = "<style>\nh1{font-family:" + tfontname + ";font-size:" + tfontsize + "pt;color:" + tfontcolor + ";text-shadow:#606060 1px 1px}\n"
            +   "h2{font-family:" + tfontname + ";font-size:" + (tfontsize-7) + "pt;color:" + tfontcolor + ";text-shadow:#606060 1px 1px}\n"
            + "td.heading{font-family:" + hfontname + ";font-size:" + hfontsize + "pt;color:" + hfontcolor + ";background-color:" + BBGCOLOR +";font-weight:bold;border-right-width:1px;border-right-color:#bbbbbb;border-right-style:solid;border-bottom-width:1px;border-bottom-color:#bbbbbb;border-bottom-style:solid;}\n"
            + "td.heading1{font-family:" + hfontname + ";font-size:" + hfontsize + "pt;color:" + hfontcolor + ";background-color:" + BBGCOLOR +";font-weight:bold;border-bottom-width:1px;border-bottom-color:#bbbbbb;border-bottom-style:solid;}\n"
            + "td.cell{font-family:" + cfontname + ";font-size:" + cfontsize + "pt;color:" + cfontcolor + ";border-right-width:1px;border-right-color:#bbbbbb;border-right-style:solid;border-bottom-width:1px;border-bottom-color:#bbbbbb;border-bottom-style:solid;}\n"
            + "td.cell1{font-family:" + cfontname + ";font-size:" + cfontsize + "pt;color:" + cfontcolor + ";border-bottom-width:1px;border-bottom-color:#bbbbbb;border-bottom-style:solid;}\n"
            + "td.cell2{font-family:" + cfontname + ";font-size:" + cfontsize + "pt;color:" + cfontcolor + ";border-right-width:1px;border-right-color:#bbbbbb;border-right-style:solid;}\n" 
            + "td.cell3{font-family:" + cfontname + ";font-size:" + cfontsize + "pt;color:" + cfontcolor + "}\n</style>";
    a[1] = "<title>" +  title + "</title>\n</head>\n<body style=\"margin:4px 4px 4px 4px\" >";
    var orgname = systemname();
    if (orgname == null) orgname = "";
    a[a.length] = ("<center><img src=" + logo + ">" + (orgname==null?"":("<h2>" + orgname + "</h2>\n")) + "<h1>" + title + "</h1>");
    a[a.length] = illustration==''?'':('<div style=font-size:' + (parseInt(document.f.hfontsize.value)-2) +  'px;text-align:left >' + illustration.replace(/</g, "&lt;").replace(/\n/g, "<br>") + '</div><br>');
    a[a.length] = ("</center><table  align=center ><tr><td style=\"border:2px #bbbbbb solid;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px\"><table width=" + bord + " cellspacing=1 cellpadding=5  style=\"border-collapse:collapse;border:0px #cccccc solid;background:linear-gradient(180deg,#E3F9A9,#EBF7C3)\" >\n<tr>");
     
    if (hasroworder)
    {
        a[a.length] = ("<td  class=heading >#</td>");
    }
    var alljs = [];
    for (var j = 0; j < numCols; j++)
    {
        if (ctype[j] == null)
            ctype[j] = "";
        if (ctype[j] != 'h' && ctype[j] != 'k')
            alljs[alljs.length] = j;
    }
    for (var j0 = 0; j0 < alljs.length; j0++)
    {
        j = alljs[j0];
        var roundc = "";
        if (j0 == 0)
        {
            roundc = "style=\"white-space:nowrap;border-top-left-radius:6px;-webkit-border-top-left-radius:6px;-moz-border-top-left-radius:6px\"";
        }
        else if (j0 == alljs.length - 1)
        {
            roundc = "style=\"white-space:nowrap;border-top-right-radius:6px;-webkit-border-top-right-radius:6px;-moz-border-top-right-radius:6px;\"";
        }
        else
            roundc = "style=\"white-space:nowrap;\"";
        a[a.length] = ("<td class=heading" + (j0 == alljs.length - 1?'1':'') + ' ' + roundc);
        if (ctype[j] == 'a' || ctype[j] == 'A' || ctype[j] == 't' || ctype[j] == 'T')
            a[a.length] = (" width=" + (parseInt(fsize[j]) * 7));
        else if (ctype[j] == 'u' || ctype[j] == 'U')
            a[a.length] = (" width=" + fsize[j]);
        if (dtype[j] && captionvalue == false || ctype[j] == 'n')
            a[a.length] = (" align=right");
        a[a.length] = ("><b><nobr>" + labels[j].replace(/([a-z])([A-Z])/g, "$1&nbsp;$2") + "</nobr></b></td>");
    }

    a[a.length] = ("</tr>");
    var rowordernum = 1;
    var printfoot = true;
    var allrs = [];

    for (var i = 0; i < numRows+3; i++)
    {
        if (i < numRows && isinrange(i) == false) {
            printfoot = false;
            continue;
        }
        allrs[allrs.length] = i;
    }
    
    for (var i0 = 0; i0 < allrs.length; i0++)
    {
        i = allrs[i0];
        a[a.length] = ("<tr>");
        if (hasroworder)
        {
            a[a.length] = (
                    "<td  class=cell align=right>" + rowordernum + "</td>");
            rowordernum++;
            
        }
        var fmt = "0";
        var needl = false;


        for (var j0 = 0; j0 < alljs.length; j0++)
        {
            var str = null;
            j = alljs[j0];
            var roundc = "";
            if (i0 == allrs.length - 1 && j0 == 0)
            {
                roundc = "style=\"border-bottom-left-radius:6px;-webkit-border-bottom-left-radius:6px;-moz-border-bottom-left-radius:6px;\"";
            }
            else if (i0 == allrs.length - 1 && j0 == alljs.length - 1)
            {
                roundc = "style=\"border-bottom-right-radius:6px;-webkit-border-bottom-right-radius:6px;-moz-border-bottom-right-radius:6px;\"";
            }
            var ii = '';
            if (i0 == allrs.length - 1) 
            {
                if (j0 == alljs.length-1) 
                    ii = '3';
                else
                    ii = '2';
            }
            else
            {
                if (j0 == alljs.length-1) 
                    ii = '1';
                else
                    ii = '';
            }
            var td = "<td   class=cell" + ii + "  " + roundc;
            if (dtype[j])
                td += " align=right ";
            if ( ctype[j] == 't' || ctype[j] == 'T')
                td += " width=" + parseInt(fsize[j]) * 7;
            
            td += ">";


            var str = '';
            var strb = '';
            if (i < numRows)
            {
               str = maintable.rows[i+1].cells[j].innerHTML;
            }
            else if (j >=3)
            {
               str = maintable.rows[i+1].cells[j-1].innerHTML; 
            }
            else if (j == 0 && i>=numRows)
            {
                str = maintable.rows[i+1].cells[0].innerHTML;
            }
            else if (j == 1 && i>=numRows)
            {
                 str =  alljs.includes(2)?'':[textmsg[648],textmsg[1760],textmsg[1761]][i-numRows]; 
            }
            else if (j == 2 && i>=numRows)
            {
                 str =  [textmsg[648],textmsg[1760],textmsg[1761]][i-numRows];
            }
            if (str == null)
                str = '';
            strb = str;
            
            if (str == null || str == '')
                str = "&nbsp;";
            if (j==1 || j==2 || j==numCols-1)
                str = "<nobr>" + str + "</nobr>";
            a[a.length] = (td + str + "</td>");
        }
        a[a.length] = ("</tr>\n");
    }
    a[a.length] = ("</table></td></tr></table>");
    let wcds = a.join("");
    postopen("printdoc.jsp",["wcds"],[wcds],"_blank" );
    
}
function savedtempgrade()
{
    parent.frames[0].myprompt(labels[gradecolumn] + ' ' + textmsg[1866].split(/@/)[1]);
}



  
 