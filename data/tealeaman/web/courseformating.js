var Harray = H.split(/,/);
function h2n(str)
{
   var i=0; while(i < Harray.length && Harray[i]!=str)i++;
   if (i == Harray.length)
   {
       return -1;
   }
   return i;
}
var LaTexWin = null;
function write2(lbl, txt)
{
    LaTexWin.document.write("\\begin{tabular}{p{1.0in} p{5.0in} }\n");
    LaTexWin.document.write("{\\large {\\bf " + lbl +"}} & " + txt.replace(/&/g, "\\&") + "\\\\ \n");
    LaTexWin.document.write("\\end{tabular}\n");
}
if (typeof(textarea)=='undefined') var textarea = null;
function makepdf(dummy,pdfthis)
{
pdfthis = (numRows > 1)? 0: 1;

 
LaTexWin =  openblank("_blank",dim(800,650));
 
LaTexWin.document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\"  />");
LaTexWin.document.write(unifontstyle(font_size));

LaTexWin.document.write("<table border=0 valign=center align=center  > <tr> <td></td><td>");
LaTexWin.document.write("<img name=\"tstimg\" src=\"image/blank.gif\" width=100% height=1 />");
LaTexWin.document.write("</td></tr><tr><td>");
LaTexWin.document.write("<img name=\"tstimg1\" src=\"image/blank.gif\" width=1 height=100% />");
LaTexWin.document.write("</td><td align=center>");
LaTexWin.document.write( unititle("LaTex to PDF",'outset2'));
LaTexWin.document.write("<table><tr><td colspan=5><form rel=opener name=f style=\"margin:5px 0px 0px 0px\" method=post action=\"ServerAgent?ext=tex,pdf&command=pdflatex&feed=x\"  >");
            
LaTexWin.document.write("<textarea name=content rows=25 cols=80>");

LaTexWin.document.write("\\documentclass[11pt,epsf,cite]{article}\n");
//LaTexWin.document.write("\\usepackage{pdftex}\n");
LaTexWin.document.write("\\usepackage{graphicx}\n");
//LaTexWin.document.write("\\usepackage{fullpage}\n");
LaTexWin.document.write("\\oddsidemargin 0.0in\n");
LaTexWin.document.write("\\evensidemargin 1.0in\n");
LaTexWin.document.write("\\textwidth 6.1in\n");
LaTexWin.document.write("\\addtolength{\\topmargin}{-.875in}\n");
LaTexWin.document.write("\\addtolength{\\textheight}{1.75in}\n");
LaTexWin.document.write("\\begin{document}\n");

 

 
 
for (var i=0; i < numRows; i++) 
{
 if (pdfthis==1 && i!=counter) continue;
 var currentone =  (i==counter && datapresentformat == 'DataForm'); 
 
LaTexWin.document.write("\\begin{figure}\n");
LaTexWin.document.write("\\begin{center}\n");
LaTexWin.document.write("\\includegraphics[height=25mm]{C:/customer0/web/DSUhoriz.jpg}\n");
LaTexWin.document.write("\\end{center}\n");
LaTexWin.document.write("\\end{figure}\n");

LaTexWin.document.write("\\begin{center}\n {\\bf {\\Large Department of Computer and Information Sciences \\\\Course Syllabus} }\n\\end{center}\n");
var xx = '';
var z = h2n("Course");
if (z==-1)
{ 
var z1 = h2n("CourseId"); if (z1==-1) z1= h2n("Id");
xx = mat[i][z1] + " ";
if (currentone) xx = retrv(i,0) + " ";

var z2 = h2n("Title");
if (currentone) 
    xx += retrv(i,z2);
else
    xx += mat[i][z2];
xx = xx.replace(/^35/,'CSCI').replace(/^20/,'INFO');
    LaTexWin.document.write("\\begin{center}\n {\\bf {\\LARGE " + xx + "} }\n\\end{center}\n\\bigskip\n");
   

}
else 
{ 
    xx = mat[i][z];
    xx = xx.replace(/^35/,'CSCI').replace(/^20/,'INFO');
    LaTexWin.document.write("\\noindent \\begin{center}\n {\\bf {\\LARGE " + xx + "} }\n\\end{center}\n\\bigskip\n");
    LaTexWin.document.write("\\begin{tabular}{p{1in} p{5in}}\n ");


    for (z = 1; Harray[z]!='Description'; z++)
    {
        if (Harray[z]=='nolabel')continue;
        xx = mat[i][z];
        if (Harray[z+1]=='nolabel'){ xx += "\n\n" + mat[i][z+1]; }
        if (options[z]!=null)
        {
            var zz =0; for(; zz < options[z].length && xx!=options[z][zz]; zz++);
            xx = captions[z][zz];
        }

    LaTexWin.document.write(" {\\large {\\bf " + labels[z].replace(/([a-z])([A-Z])/,'$1 $2') + "}} & ");
    LaTexWin.document.write(xx.replace(/&/g, "\\&")  );
    LaTexWin.document.write("\n\n\\\\ \n");
    }
    LaTexWin.document.write(" \\end{tabular}\n\\bigskip\n");
}


z = h2n("Description");
if (z!=-1)
{

xx = mat[i][z];
if (currentone) xx = retrv(i,z);
if (xx.replace(/ /g,'')!='')
{
    write2("Description", xx.replace(/\n/g, "\n\n").replace(/&#61548;/g,'$$\\cdot$$') + "\n\n");
}
}



z = h2n("Goal"); if (z==-1)z = h2n("Goals");
if (z!=-1){
xx = mat[i][z];
if (currentone) xx = retrv(i,z);
if (xx.replace(/ /g,'')!='')
{
var x0 = "This goals of the course are\n \\begin{enumerate}\\itemsep0pt\n";
var goals = xx.split(/\n+/);
for (var j=0; j < goals.length && goals[j]!=''; j++)
   x0 += ("\\item " + goals[j] +"\n");
x0 += ("\\end{enumerate}\n\n");
write2("Goals", x0);
}
}


z = h2n("Learning Outcomes"); if (z==-1)z = h2n("Outcomes");  if (z==-1)z = h2n("Outcome"); if (z==-1)z = h2n("Objective");
if (z!=-1){
xx = mat[i][z];
if (currentone) xx = retrv(i,z);

if (xx.replace(/ /g,'')!='')
{
 x0 = "This course enables students to achieve\n \\begin{enumerate}\\itemsep0pt\n";

goals = xx.split(/\n+/);
for (j=0; j < goals.length && goals[j]!=''; j++)
{
  x0 += ("\\item " + goals[j] +"\n");
}
x0 += ("\\end{enumerate}\n\n");
write2("Learning Outcomes", x0);
}
}
 //CourseId,Title,Goal,Objective,Description,Assessment,Prerequisite,Textbook,pick,Evaluation,Map2,CID

z = h2n("Assessment Plan"); if (z==-1)z = h2n("Assessment");
if (z!=-1)
{
xx = mat[i][z];
if (currentone) xx = retrv(i,z);
if (xx.replace(/ /g,'')!='')
{
  write2("Assessment Plan", xx+ "\n\n");

}
}


z = h2n("EvaluationRules"); if (z==-1)z = h2n("EvaluationRules");
if (z==-1)z = h2n("Evaluations"); if (z==-1)z = h2n("Evaluation");
if (z!=-1){
xx = mat[i][z];
if (currentone) xx = retrv(i,z);
if (xx.replace(/ /g, '')!='')
{
write2("Evaluation Rules",  xx.replace(/%/g,'\\%').replace(/\n/g, "\n\n") + "\n\n" );
}
}

z = h2n("Prerequisite"); if (z==-1)z = h2n("Prerequisites");
if (z!=-1){
xx = mat[i][z];
if (currentone) xx = retrv(i,z);
if (xx.replace(/ /g, '')!='')
{
write2("Prerequisite", xx.replace(/%/g,'\\%').replace(/\n/g, "\n\n") + "\n\n" );

}
}

 

z = h2n("Acmmap");
if (z!=-1){
xx = mat[i][z];
if (currentone) xx = retrv(i,z);
if (xx.length > 60)
{
LaTexWin.document.write("\\noindent {\\large {\\bf Topics and Their Mapping to ACM Knowledge Units}}\n\n");
LaTexWin.document.write("\\begin{table}[h!]\n");
LaTexWin.document.write("\\begin{tabular}{r p{3.4in} p{2in}}\n");
LaTexWin.document.write("\\hline\n");
LaTexWin.document.write("\\# & Topics & Cover  ACM Knowledge Units \\\\ [0.5ex]\n");
LaTexWin.document.write("\\hline\n");
LaTexWin.document.write(xx.replace(/@/g,'\\\\\n'));
LaTexWin.document.write("\\\\ [1ex]\n");
LaTexWin.document.write("\\end{tabular}\n");
LaTexWin.document.write("\\end{table}\n\n");
LaTexWin.document.write("\n\n\\bigskip\n\n");
}
}

if (i<numRows-1)
   LaTexWin.document.write("\n\\pagebreak\n");
}
LaTexWin.document.writeln("\n\\end{document}</textarea></td>Number of records:" + numRows +"</tr><tr><td align=center>");
/*
LaTexWin.document.writeln("<input type=text name=old size=10></td><td>");
LaTexWin.document.writeln("<input type=button class=GreenButton   name=search value=Search onclick=\"findstrintextarea(document.f.old.value)\"></td><td>");
LaTexWin.document.writeln("<input type=text name=newstr size=10></td><td>");
LaTexWin.document.writeln("<input type=button  class=GreenButton  name=replace value=Replace onclick=\"replacestrintextarea(document.f.newstr.value)\"></td><td>");
*/
LaTexWin.document.writeln("<input type=submit name=btn class=GreenButton   value=LaTex2Pdf></td></tr></table>");
LaTexWin.document.writeln("</form></td></tr></table>");
 
LaTexWin.document.writeln("<scr" + "ipt>");
//LaTexWin.document.writeln("textareatobesearch=document.f.content;");
LaTexWin.document.writeln("function resizeCont1()");
LaTexWin.document.writeln("{var wd = screen.width - 200;var het = screen.height - 200;");

LaTexWin.document.writeln("document.f.content.style.width = wd + 'px';");
LaTexWin.document.writeln("document.f.content.style.height= het + 'px';\n}");
LaTexWin.document.writeln("\n window.onresize=resizeCont1; \n resizeCont1();\n");
LaTexWin.document.writeln("</sc" + "ript>");
 
LaTexWin.document.writeln("</body></html>");
}

function openrhs()
{
   var courseid = title.replace(/^[ ]+/,'').replace(/ .*/,''); 
   if (courseid=='Map') courseid='';
   var major = title.substring(title.length-2);
   if (major.indexOf("CS") < 0 && major.indexOf("IT") < 0)
    {
       myprompt("Enter CS or IT as Major Program. Reload the page");
    }
    else
   parent.frames[1].document.location.href="DataTable?&subdb=&extraline=0&exbut=dc&rdap=knit&Major=" + major + "&CourseId=" + courseid;
 
}

 


var oldrownum = -1;
 
function showmap()
{  
   if (rr==oldrownum && oldrownum >= 0) return; 
 
   var xx = retrv(rr,2);
   
   oldrownum = rr;
   parent.frames[1].setgrid(xx);
}
 
function freshgrid(vv,nt)
{
   if (oldrownum!=-1)
   { 
     setv(oldrownum,2,vv);
     setv(oldrownum,3,''+nt);
     valuechanged[oldrownum] = true;
   }
   dosum1();
}
var sumallhours = 0;

function dosum1()
{
   var ft = 0.0;
   for (var i=0; i < NUMROWS; i++)
   {
      var xx = parseFloat(retrv(i,3));
      if ('' + xx != 'NaN')
        ft += xx;
   }
   setv(NUMROWS, 3, ''+ft);
   parent.frames[1].setv(parent.frames[1].passoverNUMROWS(),5, '' + ft);
    parent.frames[1].setv(parent.frames[1].passoverNUMROWS(),6, '' + (sumallhours + ft));
}

function setgrid(xx)
{
   for (var k=0; k < NUMROWS; k++)
   {
     f1.checkbox[k].checked = false;
     ele(k,3).selectedIndex = 0;
     setv(k,4,"0.00");
   }
   if (xx=='') return;
    
   var xxs = xx.split(/\n/);
  
   var gs = new Array(xxs.length);
   for (var k=0; k < xxs.length; k++)
   { 
      gs[k] = xxs[k].split(/ /); 
   }
    
   var hitrow=0;
   for (var k=0; k < xxs.length; k++)
   {
      if (gs[k].length < 5) continue;
      while (hitrow < numRows && retrv(hitrow,1)!= gs[k][1])
        hitrow++;
      if (hitrow == numRows)
          break; 
      f1.checkbox[hitrow].checked = true;
      setv(hitrow,3,gs[k][0]);
      setv(hitrow,4,gs[k][3]);
      hitrow++;
   }
}
 

function refreshleft()
{
   var vv = "";
   var nt = 0;
    
   for (var k=0; k < NUMROWS; k++)
   {
      
      if (f1.checkbox[k].checked && retrv(k,3)!='' && parseFloat(retrv(k,4))!=0.0) 
      {
        if (vv!='') vv+="\n";
        vv +=   retrv(k,3) +" " + retrv(k,1) +" for " + retrv(k,4) +" hours"; 
 
        nt += parseFloat( ""+retrv(k,4) );
 
      }
   }
    
   parent.frames[0].freshgrid(vv,nt);
}
 
function selectOneRow()
{
   return (oldrownum > -1);
}

//0Group, 1Code,  2KnowledgeUnit,  3Extent,  4ContactHour,  5CourseHours,  6AllHours,  7AcmHours,  8Major, 9Num
 
function updategrid(vl,xl)
{
   if (vl==xl) return;   
   if (parent.frames[0].selectOneRow()==false && (cc==3 || cc==4))
   {
      if (cc==3 && xl=='') xl = '';
      
      myprompt("Select or enter a row on the Left hand side");
      setv(rr,cc,xl);
   }
  
   if (cc==3)
   {
      
      f1.checkbox[rr].checked = (vl!='');
      refreshleft();
   }
   else if (cc==4)
   {
      f1.checkbox[rr].checked = (parseFloat(vl)!=0.0);
      if (parseFloat(vl)==0.0)
      {
        setv(rr,3,'');
      }
      var df = parseFloat(vl) - parseFloat(xl);
      df += parseFloat(retrv(rr,5));
      setv(rr, 5, ''+df);
      df = parseFloat(vl) - parseFloat(xl);
      df += parseFloat(retrv(rr,6));
      setv(rr, 6, ''+df); 
      var dif = df - parseFloat(retrv(rr,7));
      var cl = 'green'; var wd = '';
       if ( dif  < 0.01 && dif > -0.01)
      {   cl = 'green'; wd='Covered';}
      else if (dif > 0)
      {   cl = 'black'; wd='Over';}
      else if (retrv(rr,6)=='0.00')
      {   cl = 'red'; wd='Miss';}
      else 
     {   cl = 'yellow'; wd='Partial';}
 
      var el = ele(rr,10);  
      el.style.cssText="width:35px;background-color:" + cl +" !important;color:white";
      el.value=wd;
      refreshleft();
   }
   else if (cc == 7)
   {
       
       f2.elements[savebtnorder].style.visibility =  "visible"; 

   }
}
  
function disablesome()
{
   for (var k=0; k < NUMROWS; k++)
   {
     if (retrv(k,0).replace(/ /g,'')=='') continue;
     f1.checkbox[k].style.visibility = "hidden";
     for (var j=4; j < 7; j++)
        ele(k,j).style.visibility = "hidden";
   }

}
function inittgrid()
{
   for (var k=numRows; k < NUMROWS; k++)
      setv(k, 2, defaultRecord[2]);
}
function setreadonly(j)
{
    for (var k=0; k < NUMROWS; k++)
   {
     var el = ele(k,j);
     el.readOnly = true;
     el.style.cssText="color:#CC4400 !important";
      
   }
} 
function showins()
{
   ugentmsg=(
    "1. If the course is not in the major's curriculum at all, do not enter anything but quit.\n\n2.Enter a topic, determine the mapped knowledge units on the right and   enter Extent and Contact Hours\n\n3. To delete a topic,  check the row and click the Delete button.\n\n4. Save the change before you leave\n\n5. After saving, you may click the Syllabus link to generate a PDF file of syllabus");
   var aa = document.getElementsByTagName("a");
   var ci = title.replace(/^[ ]+/,'').replace(/ .*/,''); 
   if (ci=='Map') ci = '';
   aa[0].href=aa[0].href + "&CourseId=" +  ci;
}

var savebtnorder = 0;
function coloring()
{ 
    for (var i=0; i < NUMROWS; i++)
    {
      if (retrv(i,0).replace(/ /g,'')!='') continue;
      
      var dif = parseFloat(retrv(i,6)) - parseFloat(retrv(i,7));
      
      var cl = 'green';
     var wd = 'Covered';
      if ( dif  < 0.01 && dif > -0.01 && retrv(i,6)!='0.00')
     {     cl = 'green';  wd = 'Covered';}
      else if (dif > 0)
     {     cl = 'black'; wd = 'Over';}
      else if (retrv(i,6)=='0.00')
     {     cl = 'red'; wd='Miss';}
      else 
      {    cl = 'yellow'; wd='Partial';}
    
      var el = ele(i,10);
       
      el.style.cssText="width:35px;color:white;background-color:" + cl +"  !important";
      el.value=wd;
    }  
   for (i =0; i < f2.elements.length; i++)
      if (f2.elements[i].value=='Save') {savebtnorder = i;   break;}
   f2.elements[i].style.visibility = "hidden";   

   for (i =0; i < f2.elements.length; i++)
      if (f2.elements[i].value=='NextPage') { f2.elements[i].disabled = true; f2.elements[i].style.cssText="visibility:hidden";  break;}

  
    sumallhours = parseFloat(retrv(NUMROWS,6)) - parseFloat(retrv(NUMROWS,5));
}

function coursehours1()
{
    parent.frames[1].clear2();
    for (var i=0; i < numRows; i++)
    {
        var xx = retrv(i, 2);
        parent.frames[1].addcumulate2(xx);
    }
    dosum1();
    parent.frames[1].ifchanged2();
    parent.frames[1].setaction(1);
}

function ifchanged2()
{
    for (var i=0; i <numRows; i++)
    {
         if (retrv(i,5) == mat[i][5])
            valuechanged[i] = (retrv(i,7) != mat[i][7]);
    }
}

function clear2()
{
    for (var i=0; i < NUMROWS; i++)
       setv(i, 5, '0.00');
}

function addcumulate2(xx)
{
    
   if (xx=='') return;
    
   var xxs = xx.split(/\n/);
  
   var gs = new Array(xxs.length);
   for (var k=0; k < xxs.length; k++)
   { 
      gs[k] = xxs[k].split(/ /); 
   }
    
   var hitrow=0;
   for (var k=0; k < xxs.length!=''; k++)
   {
      while (retrv(hitrow,1)!= gs[k][1])
        hitrow++;
      var yx = parseFloat(retrv(hitrow, 5)) + parseFloat(gs[k][3]); 
      setv(hitrow,5,'' + yx);
      valuechanged[hitrow] = true;
      hitrow++;
   }
}

var ondeleted = "coursehours1()";
if (title.indexOf("Map") >= 0)
{
   onbegin +=";openrhs();setreadonly(2);setreadonly(3);showins();";
   cellonfocus += ";showmap();";
   onsaved = "coursehours1()";
}
else if (title.indexOf("Knowledge") >= 0)
{
   onbegin +=";disablesome();setreadonly(0);setreadonly(1);setreadonly(2);setreadonly(5);setreadonly(6);coloring();";
   cellonblur += ";updategrid(v,x);";
}

 





    
 