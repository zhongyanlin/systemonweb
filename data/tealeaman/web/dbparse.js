 
resizebut(document.form1, Math.ceil(font_size));
var tablename = "";
var rawdata = "";
var limiters = [' ','@','&','#','~'];
var limpos = -1;
var limitbas = "";
textareatobesearch=document.form1.rawdata;
  
function selfile(but)
{
   savetmp();
   window.open("webfolder.jsp?selfile=1","webfile", dim(600,500));
}
let usewenfile = false;
 
function reinit()
{
   if (document.form1.newtable.value == '') return;
   if (document.getElementById('blank').innerHTML == '')
   {
       redraw();
   }
   else
   {
       myprompt(textmsg[1879],null,"if(v)redraw()");
   }
}
function getFile20(N,j, x)
{
    document.form1.source.checked = false;
    document.form1.rawdata.value = x;
    document.form1.localpath.value = '';
    ifcsv();
    usewenfile = false;
    if (N < j)
    {   
        myprompt( textmsg[1876].replace(/#/,''+N).replace(/@/,''+j),
        ""+(N+10), "loadagain(v)");
        document.form1.rawdata.readOnly = true;
        document.form1.rawdata.style.backgroundColor = 'lightblue';
        usewenfile = true;
        
    }
    else
    {    
        document.form1.rawdata.readOnly = false;
        document.form1.rawdata.style.backgroundColor = 'white';
    }
       
     
    
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
function bestmatch(xs,ys)
{
    var matc = new Array(xs.length);
    let u = new Array();
    
    for (let k=0; k < xs.length; k++)
    {
       for (let j=0; j < ys.length; j++)
       {
           let z = matchscore(xs[k], ys[j]);
           if (z!='000')
           u[u.length] = z + k + "_"+ j;
       }
    }   
    u.sort();
     
    for (let l = u.length-1,i=0; l>=0 && i < ys.length; l--,i++)
    {
     
       let kj = u[l].substring(3).split(/_/);
       let k = parseInt(kj[0]);
       let j = parseInt(kj[1]);
       if (matc[k]==null) matc[k] = j;
    }
    return matc;
}
function chooseenter()
{
    savetmp();
    document.form1.rawdata.readOnly = false;
    document.form1.rawdata.style.backgroundColor = 'white';
    document.form1.localpath.value = '';
    document.form1.webfile.value = '';
}
function loadagain(v)
{
    postopen("dbparse.jsp", ["mode","path", "lines"],["webfile",document.form1.webfile.value, v],'w' + tstmp);
}
function getselfile(x)
{
    document.form1.webfile.value=x;
    document.form1.localpath.value = '';
    loadagain(10);
}
function textboxhint1(txt, s, hint)
{
   
   if (s=='b')
   {
      if (txt.value == '')
      {
        txt.value=hint;
        txt.style.color = "#aaaaaa";
      }
   }
   else
   {
      var x = txt.style.color.toString().toLowerCase().replace(/ /g,'');

      if (x=='#aaaaaa' || x=='rgb(170,170,170)')
      {
         txt.value='';
         txt.style.color="#000000";
      }
   }
}
function verifyreg(dctrl)
{
    
   try
   {
       var rg = new RegExp(tolinefeed(dctrl.value));
   }
   catch(err)
   {
       myprompt(textmsg[819] +": " + dctrl.value);
       dctrl.focus();
   }
   
}
 
function replaceall(r,newstr)
{
    rawdata = textareatobesearch.value;
    var rg = new RegExp(r,"g");
    var str1 = tolinefeed(newstr);
    textareatobesearch.value = textareatobesearch.value.replace(rg,str1);
}
function nextch()
{
    limpos=(limpos + 1)%limiters.length;
    limit=limitbas+limiters[limpos];
    if (limpos==limiters.length-1)
       limitbas = limit;
    return limit;
}
var numCols = 0;
var wd = screen.width - 234;
var nav1;
function tospecialchar(x)
{
   x = x.replace(/^[ ]+/,'').replace(/[ ]^$/,'');
   if (x.charAt(0) == '\\')
   {
       if (x.charAt(1) == 't')return '\t';
       else  if (x.charAt(1) == 'n')return '\n';
       else  if (x.charAt(1) == 'r')return '\r';
       else  if (x.charAt(1) == 's')return ' ';
       else  alert('wrong literal');
   }
   return x;
}
var chartype = new Array(), lengths = new Array();
function updatetype(v, j)
{
     
    if (v  == null)
           ;
       else   if (chartype[j] == null)
       {
          chartype[j] = isNaN(v)?'c':(v.indexOf(".")>=0?'f':'i'); 
       } 
       else if (chartype[j] != 'c' && isNaN(v))
       {
          chartype[j] = 'c';
       }
       else if (chartype[j] == 'i' && v.indexOf(".")>=0)
       {
          chartype[j] = 'f';
       }
       if (chartype[j] == 'c')
       {
           if (v!=null )
           if (lengths[j] == null || lengths[j] < v.length)
           {
              lengths[j] = v.length; 
           }
       } 
}
function csvparse()
{
   rawdata = document.form1.rawdata.value;
   var colsepstr = tospecialchar(document.form1.regex.value);
   var closure = tospecialchar(document.form1.closure.value); 
   var rowsepstr = tospecialchar(document.form1.rowsep.value);
   var par = new CSVParse(rawdata,closure,colsepstr,rowsepstr);
   heading = null;
   if (document.form1.head.checked)
      heading = par.nextRow();
   var vv = par.nextMatrix();
   
   document.getElementById("numrows").innerHTML = "<b>" + vv.length +"</b>"; 
   document.form1.rawdata.value="";
   var limit = nextch();
   numCols = 0;
   var noreg = (colsepstr.replace(/\w/g,'').replace(/ /g,'').replace(/\x160/g,'') == '');
   if (colsepstr.length==0)
       limit=''; 
   else
   while (true)
   {
       if (noreg && limit.length >= colsepstr.length)
       {
           limit = colsepstr; 
           break;
       }
       var found = false;
       for (i=0; i < vv.length; i++)
       {
           if (vv[i]==null) continue;
           for (var j=0; j < vv[i].length; j++)
                if (vv[i][j]!=null && vv[i][j].indexOf(limit)>=0)
                {found=true;    break;}
           if (found) break;
       }
       if (found == false) break;
       limit = nextch();
       
   }
   limpos = -1;
   limitbas = "";
   var leng = new Array(80);
   var isnum = new Array(80);
   for (j=0; j < 40; j++) 
   {
        leng[j] = 0;
        isnum[j]=true;
   }
    
   for (i=0; i < vv.length; i++)
   {
       if (vv[i]==null) continue;
       for (j=0; j < vv[i].length; j++)
       {
           if (j>=40 && isnum[j]==null) isnum[j] = true;
           if (j < 40 && isnum[j]==true && "" + parseFloat(vv[i][j]) == 'NaN')
               isnum[j] = false;
           if (vv[i][j]==null) vv[i][j] = "";
           if (j>=40 && leng[j]==null) 
               leng[j] = vv[i][j].length;
           else 
               leng[j] += vv[i][j].length;
           updatetype(vv[i][j],j);
           document.form1.rawdata.value += vv[i][j];
           if (j<vv[i].length-1)
               document.form1.rawdata.value +=limit;
           
       }
       
       if (i < vv.length-1)
          document.form1.rawdata.value += rowsepstr;
       if (numCols < vv[i].length)
           numCols = vv[i].length;
   }
   if (heading == null)
   {
       heading = new Array(numCols);
       for (let k = 0; k < numCols; k++)
           heading = textmsg[816] + (k+1);
   }
   var txt = "<table cellspacing=1 cellpadding=3><tr  bgcolor=" + BBGCOLOR +">";
   
   document.form1.delimiter.value = limit;
   var cell=document.getElementById("delimit");
   if (limit == ' ') limit='&nbsp;';
   cell.innerHTML = "<b>" + limit  + "</b>";

   var m = 0;
   for (j=0; j < numCols; j++)
    {   m += leng[j];  }
   var ratio = wd/(m+0.0);
   for (j=0; j < numCols; j++)
       txt += "<td width=\"0%\" style=\"padding:5px;border:1px #b0b0b0 solid\" ><b><nobr>" + heading[j] + "</nobr></b></td>"; 
   txt +="</tr></table>"; 
   var tablecell=document.getElementById('header');
   tablecell.innerHTML = txt;
   myprompt("<iframe name=parsed width=700 height=600 />",null,null,title);
   nav1 = open("","parsed");
   var rootstyle = document.getElementsByTagName("head")[0].innerHTML;
   let jj = rootstyle.indexOf(":root");
   if (jj == -1)rootstyle = '';
   else 
   {
      let kk = rootstyle.indexOf("}",jj);
      rootstyle = "<style>" + rootstyle.substring(jj,kk+1) + "</style>";
   }
    nav1.document.body.innerHTML = "";
    nav1.document.write("<html><head><meta http-equiv=\"content-type\" content=\"text/html; charset=" + encoding +"\">"+unifontstyle(font_size) + rootstyle +"<link rel=stylesheet  type=text/css  href=styleb" + (orgnum) + ".css /></head><body bgcolor=" +DBGCOLOR+ ">");
    nav1.document.write(" <table border=0 valign=center align=center > <tr> <td><img name=tstimg src=image/blank.gif width=100% height=1></td></tr><tr> <td align=center>");
   // nav1.document.write(unititle(title,"outset2") + "<br>"); 
    nav1.document.write("<table cellpadding=0 cellspacing=0 class=outset1 align=center  width=100%  ><tr><td><table  cellpadding=3 cellspacing=1 align=center  width=100% ><tr style=\"background:" + beheading  + "\">");
    for (j=0; j < numCols; j++)
       nav1.document.write("<td align=" 
              + ((isnum[j]==true)?"right":"left") 
              + "><b><nobr>" + heading[j] + "</nobr></b></td>");
    nav1.document.write("</tr>"); 
    for (i=0; i < vv.length; i++) 
    {
       if (vv[i]==null) continue;
       nav1.document.write("<tr bgcolor=" + TBGCOLOR +">");
       j = 0;
       for (; j < vv[i].length ; j++)
          nav1.document.write("<td align=" 
              + ((isnum[j]==true)?"right":"left") 
              + ">" + vv[i][j].replace(/</g,"&lt;") +"</td>");
       if(j<numCols)
          nav1.document.write("<td colspan=" +(numCols-j)+">&nbsp;</td>"); 
           
       nav1.document.write("</tr>");   
    }
    nav1.document.write("</table></td></tr></table></td></tr></table><scrip" + "t>");
    nav1.document.write("\nvar tablen =   document.images[0].width+60;"); 
    nav1.document.write("\nvar tablei =  600;// document.images[1].height+80;");
    nav1.document.write("\nresizeTo(tablen,tablei);");
    nav1.document.write("\nmoveTo((screen.width - tablen)/2, (screen.height - tablei)/2);</scrip" +"t>"); 
    nav1.document.write("</body></html>"); 
    foundold();
}


function myparse()
{
   if (document.form1.iscsv.checked){ csvparse(); return;}
   rawdata = document.form1.rawdata.value;
   var colsepstr = document.form1.regex.value;
   colsepstr = tolinefeed(colsepstr);
    
   var reg = null;
   try{
       reg = new RegExp(colsepstr);
   }
   catch( err)
   {
         document.form1.regex.focus();
         myprompt(textmsg[818] + " " + msg2 +": " + document.form1.regex.value);
         return ;
   }
   var rowse=null;
   var rowsepstr = document.form1.rowsep.value;
   rowsepstr = tolinefeed(rowsepstr);
   
   try
   {
       rowse = new RegExp(rowsepstr);
   }
   catch( err)
   {
         document.form1.rowsep.focus();
         myprompt(textmsg[818] + " " + msg2 +": " + document.form1.rowsep.value);
         return ;
   }
   var arr = rawdata.split(rowse);
   heading = null;
   if (document.form1.head.checked)
   {
       heading = arr[0].split(reg);
       arr.splice(0,1);
   }
   
      
   
   document.getElementById("numrows").innerHTML = "<b>" + arr.length +"</b>"; 
   var vv = new Array(arr.length);
   document.form1.rawdata.value="";
   for (var i=0; i < arr.length; i++)
   {
       vv[i] = arr[i].split(reg);
   }
   var limit = nextch();
   numCols = 0;
   var noreg = (colsepstr.replace(/\w/g,'').replace(/ /g,'').replace(/\x160/g,'') == '');
   if (colsepstr.length==0)
       limit=''; 
   else
   while (true)
   {
       if (noreg && limit.length >= colsepstr.length)
       {
           limit = colsepstr; 
           break;
       }
       var found = false;
       for (i=0; i < arr.length; i++)
       {
           if (vv[i]==null) continue;
           for (var j=0; j < vv[i].length; j++)
                if (vv[i][j]!=null && vv[i][j].indexOf(limit)>=0)
                {found=true;    break;}
           if (found) break;
       }
       if (found == false) break;
       limit = nextch();
       
   }
   limpos = -1;
   limitbas = "";
   var leng = new Array(80);
   var isnum = new Array(80);
   for (j=0; j < 40; j++) 
   {
        leng[j] = 0;
        isnum[j]=true;
   }
   
   for (i=0; i < arr.length; i++)
   {
       if (vv[i]==null) continue;
       for (j=0; j < vv[i].length; j++)
       {
           if (j>=40 && isnum[j]==null) isnum[j] = true;
           if (j < 40 && isnum[j]==true && "" + parseFloat(vv[i][j]) == 'NaN')
               isnum[j] = false;
           if (vv[i][j]==null) vv[i][j] = "";
           if (j>=40 && leng[j]==null) 
               leng[j] = vv[i][j].length;
           else 
               leng[j] += vv[i][j].length;
           document.form1.rawdata.value += vv[i][j];
            if (j<vv[i].length-1)
               document.form1.rawdata.value +=limit;
            updatetype(vv[i][j],j);
           if (j<vv[i].length-1)
               document.form1.rawdata.value +=limit;
       }
       
       if (i < arr.length-1)
          document.form1.rawdata.value += rowsepstr;
       if (numCols < vv[i].length)
           numCols = vv[i].length;
   }
   if (heading == null)
   {
       heading = new Array(numCols);
       for (let k = 0; k < numCols; k++)
           heading = textmsg[816] + (k+1);
   }
   var txt = "<table cellspacing=1 cellpadding=3><tr  bgcolor=" + BBGCOLOR +">";
   
   document.form1.delimiter.value = limit;
   var cell=document.getElementById("delimit");
   if (limit == ' ') limit='&nbsp;';
   cell.innerHTML = "<b>" + limit  + "</b>";

   var m = 0;
   for (j=0; j < numCols; j++)
    {   m += leng[j];  }
   var ratio = wd/(m+0.0);
   for (j=0; j < numCols; j++)
       txt += "<td width=" + Math.floor(ratio*leng[j])   +"><b><nobr>" + heading[j] + "</nobr></b></td>"; 
   txt +="</tr></table>"; 
   var tablecell=document.getElementById('header');
   tablecell.innerHTML = txt;
   
   nav1 = open("","parsed",dim(700,600));
   var rootstyle = document.getElementsByTagName("head")[0].innerHTML;
   let jj = rootstyle.indexOf(":root");
   if (jj == -1)rootstyle = '';
   else 
   {
      let kk = rootstyle.indexOf("}",jj);
      rootstyle = "<style>" + rootstyle.substring(jj,kk+1) + "</style>";
   }
    nav1.document.body.innerHTML = "";
    nav1.document.write("<html><head><meta http-equiv=\"content-type\" content=\"text/html; charset=" + encoding +"\">"+unifontstyle(font_size) + rootstyle +"<link rel=stylesheet  type=text/css  href=styleb" + (orgnum) + ".css /></head><body bgcolor=" +DBGCOLOR+ ">");
    nav1.document.write(" <table border=0 valign=center align=center > <tr> <td><img name=tstimg src=image/blank.gif width=100% height=1></td></tr><tr> <td align=center>");
    nav1.document.write(unititle(title,"outset2") + "<br>"); 
    nav1.document.write("<table cellpadding=0 cellspacing=0 class=outset1 align=center  width=100%  ><tr><td><table  cellpadding=3 cellspacing=1 align=center  width=100% ><tr style=\"background:" + beheading  + "\">");
    for (j=0; j < numCols; j++)
       nav1.document.write("<td align=" 
              + ((isnum[j]==true)?"right":"left") 
              + "><b><nobr>" + heading[j] + "</nobr></b></td>");
    nav1.document.write("</tr>"); 
    for (i=0; i < arr.length; i++) 
    {
       if (vv[i]==null) continue;
       nav1.document.write("<tr bgcolor=" + TBGCOLOR +">");
       j = 0;
       for (; j < vv[i].length ; j++)
          nav1.document.write("<td align=" 
              + ((isnum[j]==true)?"right":"left") 
              + ">" + vv[i][j].replace(/</g,"&lt;") +"</td>");
       if(j<numCols)
          nav1.document.write("<td colspan=" +(numCols-j)+">&nbsp;</td>"); 
           
       nav1.document.write("</tr>");   
    }
    nav1.document.write("</table></td></tr></table></td></tr></table><scrip" + "t>");
    nav1.document.write("\nvar tablen =   document.images[0].width+60;"); 
    nav1.document.write("\nvar tablei =  600;// document.images[1].height+80;");
    nav1.document.write("\nresizeTo(tablen,tablei);");
    nav1.document.write("\nmoveTo((screen.width - tablen)/2, (screen.height - tablei)/2);</scrip" +"t>"); 
    nav1.document.write("</body></html>"); 
    foundold();
}
var holdtemp;
function foundold()
{
    let ky = '';
    for (let k=0; k < heading.length; k++)
        ky += ',' + heading[k];
    let oldone = parent.frames[0].gettmp(ky);
    if (oldone!=null)
    {
        let k = oldone.indexOf(',');
        if (k < 0) return;
        let tbl = oldone.substring(0,k);
        let sel = document.form1.targettable;
        let def = oldone.substring(k+1);
        if (def.length<20 || def.indexOf("<")!=0)return;
        document.getElementById('blank').innerHTML = def;
        holdtemp = def;
        myprompt(textmsg[1877],
        null,"if(v)useoldone('" + tbl + "');else notusethis()");
    }
}
function tohex(s)
{
    var i = parseInt(s);
    var y = Number(i).toString(16);
    if (y.length == 1) y = '0' + y;
    return y.toLowerCase();
}
function notusethis(){
    document.getElementById('blank').innerHTML = "";
}
function useoldone(tbl)
{
   let sel = document.form1.targettable;
   for (let k=0; k < sel.options.length; k++)
   {
      if (sel.options[k].text == tbl)
      {
          sel.selectedIndex = k;
          document.form1.newtable.value = '';
          document.getElementById('blank').innerHTML = holdtemp;
          return;
      }
   }
   document.form1.newtable.value = tbl;
   sel.selectedIndex = 0;
   document.getElementById('blank').innerHTML = holdtemp;
}
function undo()            
{                              
   document.form1.rawdata.value = rawdata;
   heading = null;
   chartype = new Array();;
   lengths = new Array();;
}

function fill()            
{  
    var numtables = parent.frames[0].passNumtables();
    var  tables = new Array(numtables);
    parent.frames[0].passTables(tables);
    tables.sort();
    for (var i = 0; i < numtables; i++)
    {
      if (tables[i]!='')
      {
          var xx = parent.frames[0].name2label(tables[i]);
          document.form1.targettable.options[i+1] = new Option(xx,tables[i]);
      }
      else
      {
          break;
          numtables = i;
      }
    }
}
var cstart = 0;
var numRows = 0;
var heading = null;
function canstart(){cstart = 1;}
function showclosure(c)
{
    document.getElementById('closurelbl').style.visibility = c.checked?'visible':'hidden';
    document.form1.closure.style.visibility = c.checked?'visible':'hidden';
    document.form1.closure.list = 'closurelist';
    let r = document.form1.regex;
    if (c.checked && r.value == '[ ]+')
    {
       r.value  = ',';
    }
}
 
function repaint(sel) 
{
   if (document.form1.targettable.selectedIndex == 0 )
   {
       if (document.form1.newtable.value == '')
          document.getElementById('blank').innerHTML = '';
       return;
   }
   if (heading == null) 
   {
       myprompt(textmsg[1878]);
       return;
   } 
   var numtables = sel.options.length - 1;
   var i = sel.selectedIndex;
   var  tables = new Array(numtables);
   parent.frames[0].passTables(tables);
   var tablename = sel.options[i].value; 
   i = 0;
   while (tables[i]!=tablename)i++;
   var definition = parent.frames[0].passdef(tablename).replace(/^[^a-zA-Z]+/,'');
   var  ts = new Array(numtables);
   parent.frames[0].passNumfields(ts);
   var NUMROWS =  ts[i] ;  
   var mat  =    new Array( NUMROWS );
   for (i = 0; i< NUMROWS; i++)
   {
       mat[i]= new Array(11);
   }
   numRows  = parse(definition, mat, "");
   var mapkey = '';
   for (i=0; i < numRows; i++)
       if (mat[i][7] == '1')
          mapkey += "," + i; 
   document.form1.primarykey.value = mapkey;
   var txt =  "<table align=left class=\"outset1\" border=1 style=\"border:1px #b0b0b0 solid;border-collapse:collapse;font-size:" + (font_size-2) + "px;font-weight:500\" cellpacing=1 cellpadding=0 align=center><tr style=\"background:" + beheading + "\"><td  bgcolor=#ded><nobr>"  + textmsg[128] +   "</nobr>";
   for (i =0; i < numRows; i++)
   {
      txt += "<td ><b>" + mat[i][1] +"</b><input type=hidden name=field" + i +" value=\"" 
       +  mat[i][1] + "\"></td>";
   }
   txt += "</tr><tr ><td  bgcolor=#ded><nobr>" + textmsg[1880] + "</nobr>";
   
   var kk = (mat[0][1]=='lastupdate')?1:0;
   let fds = new Array();
   for (let kk=0; kk < numRows; kk++)
       fds[kk] = mat[kk][1];
   let bestm = bestmatch(fds, heading);
   
   for (i =0; i < numRows; i++)
   {
       txt += "<td ><select  name=order" + i +"     onchange=hidedef("+i+")>";
       var had = false;
       for (var j =0; j < numCols; j++)
       {
           txt += "<option  value=" + j;
           if (bestm[i] == j){ txt += " selected=\"true\" "; had=true;}
           txt +=">" +  (heading[j].length<14?heading[j]:heading[j].substring(0,14)) +"</option>";
       }
       if (had==true)
           txt +="<option  value=\"-1\">" + textmsg[184] +"</option>";
       else 
           txt +="<option  value=\"-1\" selected=\"true\">" + textmsg[184] +"</option>";
       txt += "</select></td>";
   }
   txt += "</tr><tr ><td  bgcolor=#ded><nobr>" + textmsg[184] + "</nobr>";
    
   var leng = new Array(numRows);
   var total = 0;
   for (i = 0; i < numRows; i++)
   {
      var tt = 2*mat[i][1].length; 
      if (tt>100) tt =100; 
      if (numCols > 1 && tt < wd/numCols) 
          tt =  wd/numCols ;
      leng[i] = tt;
      total += tt;
   }
      
   for ( i = 0; i < numRows; i++)
   {
      var yy = mat[i][6];
      if (mat[i][1]=='lastupdate' && yy=='')
          yy = "" +~~((new Date()).getTime()/1000);
      tt = Math.floor(wd*leng[i]/total-1); 
      if (tt<68) tt = 68; 
      txt += "<td  ><input name=defaultv" + i +"  class=\"roundc\"  onchange=\"javascript:this.style.borderColor='#333333';\"  style=width:" + tt +"px value=\""
       + yy.replace(/"/g,"\\\"") + "\"></td>";
   }
  
   txt += "</tr></table></td></tr></table><br>";
   txt += "<p style=\"margin:0px 0px 0px 0px;float:left;font-size:15px;color:#af5600\">1." + msg1609 + "</br>2." + aboutr + "</p>";
   
   var tablecell= document.getElementById("blank");//document.getElementsByTagName('table')[4].rows[1].cells[0];
   tablecell.innerHTML = txt;
   for (i = 0; i < numRows; i++)
       hidedef(i);
}
let txtlength = new Array();
function redraw1(sel)
{
   
   if (sel.value != '')
   {
       if (document.getElementById('blank').innerHTML == '')
       redraw(sel);
   }
   else if (document.form1.targettable.selectedIndex == 0)
   {
       document.getElementById('blank').innerHTML = '';
   }
       
}
let basictype= "CHAR(x),VARCHAR(x),INTEGER,BIGINT,SMALLINT,FLOAT,DOUBLE,TEXT".split(/,/);
function typelists(id,existone)
{
   if (existone!=null&& existone.indexOf('VARCHAR')>=0) 
       existone = existone.replace(/^[A-Z]+/,'');
   let ret = "<datalist id=\"" + id + "\">";
   for (let k=0; k < basictype.length; k++)
   {
       if (existone!=null )
           basictype[k] = basictype[k].replace(/\(x\)/,existone);
       ret += "<option value=\"" + basictype[k] + "\">";
   }
   return ret + "</datalist>";
}
function redraw(sel) 
{
   if (heading == null)
   {
       myprompt(textmsg[1877]);
       return;
   }
   if (sel == null) sel = document.form1.newtable;
   document.form1.targettable.selectedIndex = 0;
   var  tables = new Array();
   parent.frames[0].passTables(tables);
   var numtables = tables.length;
   var tablename = sel.value; 
   let i = 0;
   while (i < tables.length && tables[i]!=tablename)i++;
   if (i < tables.length)
   {
       sel.value = '';
       sel = document.form1.targettable;
       for (var k=0; k < sel.options.length; k++)
       {
           if (sel.options[k].value == tablename) break;
       }
       sel.selectedIndex = k;
       repaint(sel);
       return;
   }
   var betterheading = new Array(heading.length+2);
   for (let k =0; k < heading.length; k++)
   {    betterheading[k] = heading[k].replace(/[^a-z|A-z|0-9]/g,'')
        if (betterheading[k].length > 14)
           betterheading[k] = betterheading[k].substring(0,14);
   }
   betterheading[heading.length] = "more" + heading.length;
   betterheading[heading.length+1] = "more" + (heading.length  + 1);
   
   let fieldtype = new Array();
   for (let i =0; i < betterheading.length; i++)
   {
       if (i >= heading.length+1)
       {
           fieldtype[i]= "VARCHAR(20)";
       }
       else if (i >= heading.length)
       {
           fieldtype[i]= "BIGINT";
       }
       else if (chartype[i] == 'c')
       {
          fieldtype[i]= "VARCHAR(" + lengths[i] + ")";
       }
       else if (chartype[i] == 'f')
       {
          fieldtype[i]= "FLOAT";
       }
       else
           fieldtype[i]= "INTEGER";
       txtlength[i] = font_size*(betterheading[i].length > fieldtype[i].length? betterheading[i].length:fieldtype[i].length)/1.5;
   }
   var txt = "<table id=newtblstruct align=left class=\"outset1\" border=1 style=\"border:1px #b0b0b0 solid;border-collapse:collapse;font-size:" + (font_size-2) + "px;font-weight:500\"  cellpacing=1 cellpadding=0 align=center>";
   txt +="<tr style=\"background:" + beheading + "\"><td  bgcolor=#ded><nobr>"+ textmsg[16] + "</nobr></td>";
   for (i =0; i < betterheading.length; i++)
   {
      txt += "<td  align=center><input type=checkbox class=roundc  name=keepit" + (i) +"  checked onclick=\"keepit(this," + i + ")\"></td>";
   } 
   txt += "</tr><tr><td  bgcolor=#ded><nobr>" + textmsg[128] + "</nobr></td>";
   for (i =0; i < betterheading.length; i++)
   {
      txt += "<td ><input type=text class=roundc style=width:" + txtlength[i] + "px name=field" + (i ) +" value=\"" 
       +  betterheading[i] + "\"></td>";
   }
   txt += "</tr><tr ><td  bgcolor=#ded><nobr>" + textmsg[1464] + "</nobr></td>";
   for (i =0; i < betterheading.length; i++)
   {
       txt += "<td ><input list=\"dbtypelist" + i + "\" type=text class=roundc style=width:" + txtlength[i] + "px name=datatype" + (i ) + " value=\"" + fieldtype[i];
       txt += "\"> ";
       txt += typelists("dbtypelist" + i,fieldtype[i]);
       txt += "</td>";
   }
   txt += "</tr><tr ><td  bgcolor=#ded><nobr>" + msg725 + "</nobr></td>";
   for (i =0; i < betterheading.length; i++)
   {
      txt += "<td align=center><input type=checkbox class=roundc  name=iskey" + (i) +"   \"></td>";
   } 
   
   txt += "</tr><tr ><td  bgcolor=#ded><nobr>" + textmsg[1880] + "</nobr></td>";
   
   for (i =0; i < betterheading.length; i++)
   {
       txt += "<td ><select  name=order" + i +"  onchange=hidedef("+i+")>";
       var had = false;
       for (var j =0; j < heading.length; j++)
       {
           txt += "<option  style=font-size:inherit value=" + j;
           if (j==i){ txt += " selected=\"true\" "; had=true;}
           txt +=">" +  (heading[j].length<14?heading[j]:heading[j].substring(0,14)) +"</option>";
       }
       if (had==true)
           txt +="<option  value=\"-1\">" + textmsg[184] +"</option>";
       else 
           txt +="<option  value=\"-1\" selected=\"true\">" + textmsg[184] +"</option>";
       txt += "</select></td>";
   }
   txt += "</tr><tr><td  bgcolor=#ded><nobr>" + textmsg[184] + "</nobr></td>";
   for ( i = 0; i < betterheading.length; i++)
   {
       txt += "<td ><input name=defaultv" + i +"  onchange=\"javascript:this.style.borderColor='#333333';\"  class=\"roundc\"  style=border:1px;width:" + (length[i]==null?60:(length[i]*4)) +"px value=\""
       +   "\"></td>";
   }
    
   txt += "</td></tr></table></td></tr></table><br>";
   txt += "<p  style=\"margin:0px 0px 0px 0px;float:left;font-size:15px;color:#af5600\">1. " + msg1610 + "<br>2." + aboutr + "</p>";
    
   
   var tablecell= document.getElementById("blank");//document.getElementsByTagName('table')[4].rows[1].cells[0];
   tablecell.innerHTML = txt;
   numRows = betterheading.length;
   for (i = 0; i < numRows; i++)
       hidedef(i);
   
}


var checks = "";
var numbefore = 0;
function keepit(ch,i)
{
    var ele = [formselementbyname(document.form1,'field'+i),
    formselementbyname(document.form1,'datatype'+i),
    formselementbyname(document.form1,'iskey'+i),
    formselementbyname(document.form1,'order'+i),
    formselementbyname(document.form1,'defaultv'+i),
    ];
     
    if (ch.checked)
    {
        for (var k=0; k < 5; k++)
        {ele[k].style.visibility = 'visible'; 
            ele[k].style.width = txtlength[i] + 'px';
        }
    }
    else
    {
        for (var k=0; k < 5; k++)
        {
            ele[k].style.visibility = 'hidden'; 
            ele[k].style.width =   '12px';
            ele[k].parentNode.style.width = "0%";
        }
    }
    
}
function hidedef(i)
{
    var sel = formselementbyname(document.form1, 'order'+i);
    var txt = formselementbyname(document.form1, 'defaultv'+i);
    txt.style.width = (sel.offsetWidth-2) + 'px';
    txt.style.visibility = (sel.selectedIndex == sel.options.length - 1)?"visible":"hidden";
        
}
function savetmp()
{
    if (heading == null) return;
    let ky = '';
    for (let k=0; k < heading.length; k++)
    { 
        ky += ',' + heading[k];
    }
    let t = document.getElementById('blank');
    let table = t.getElementsByTagName('table')[0];
    
    if (t.innerHTML=='') return;
    let i=0;
    while (true)
    {
        let ele = formselementbyname(document.form1, "order" + i);
        if (ele == null) break;
        ele.options[ele.selectedIndex].selected = true;
        i++;
    }
    let ss = 'keepit,field,datatype,iskey,defaultv'.split(/,/);
    if (table.rows.length<3)ss = ['defaultv'];
    for (let k=0; k < ss.length; k++)
    {
        i = 0;
        while (true)
        {
            let ele = formselementbyname(document.form1, ss[k] + i);
            if (ele == null) break;
            if (k==0 || k==3)
            {
                let v = ele.checked;
                if (v && ele.outerHTML.toLowerCase().indexOf(" checked") == -1)
                    ele.outerHTML = ele.outerHTML.replace(/<input /i, '<input checked ').replace(/ =""/g, ' ');
                else if (!v && ele.outerHTML.toLowerCase().indexOf(" checked") >= 0)
                    ele.outerHTML = ele.outerHTML.replace(/ checked[^ ]+/i, ' '); 
                else ele.outerHTML = ele.outerHTML.replace(/ =""/g, ' ');
            }
            else 
            {
                let v = ele.value;
                if (ele.outerHTML.toLowerCase().indexOf(" value=") == -1)
                    ele.outerHTML = ele.outerHTML.replace(/<input /i, '<input value="' + v.replace(/"/g, "\\\"")+'" ');
                else
                    ele.outerHTML = ele.outerHTML.replace(/ value="[^"]*"/i, ' value="' + v.replace(/"/g, "\\\"")+'" ');
            }
            i++;
        }
    }
    let tbl = document.form1.newtable.value;
    let k = document.form1.targettable.selectedIndex;
    if (k!=0)
        tbl = document.form1.targettable.options[k].text;
    parent.frames[0].settmp(ky, tbl + "," + t.innerHTML);
}
function hexcolor(cl)
{
    if (cl == null || cl==''  ||  cl.toLowerCase()=='transparent') return 'transparent';
    else if ( !isNaN(cl)) return cl;
    if ((cl+'').toLowerCase().indexOf('rgb')>=0)
    {
        var x = (''+cl).replace(/rgb/,'').replace(/\(/,'').replace(/\)/,'').split(/,/);
        return  '#' + tohex(x[0]) + tohex(x[1]) +  tohex(x[2]) ;
    }
    cl = cl.toUpperCase();
    if (cl=="WHITE") cl="#FFFFFF";
else if (cl=="SILVER") cl="#C0C0C0";
else if (cl=="GRAY") cl="#808080";
else if (cl=="BLACK") cl="#000000";
else if (cl=="RED") cl="#FF0000";
else if (cl=="MAROON") cl="#800000";
else if (cl=="YELLOW") cl="#FFFF00";
else if (cl=="OLIVE") cl="#808000";
else if (cl=="LIME") cl="#00FF00";
else if (cl=="GREEN") cl="#008000";
else if (cl=="AQUA") cl="#00FFFF";
else if (cl=="TEAL") cl="#008080";
else if (cl=="BLUE") cl="#0000FF";
else if (cl=="NAVY") cl="#000080";
else if (cl=="FUCHSIA") cl="#FF00FF";
else if (cl=="PURPLE") cl="#800080";
else if (cl =='PINK') cl = '#FFC0CB';
else if (cl =='ORANGE') cl ='#FFA500';
else if (cl =='CYAN') cl = '#00FFFF';
  if (cl.replace(/#[0-9|a-z][0-9|a-z][0-9|a-z][0-9|a-z][0-9|a-z][0-9|a-z]/i,'')!='') 
      return 'transparent';
  return cl.toLowerCase();
}
function process()            
{  
    savetmp();
    if (document.form1.delimiter.value=='')
        document.form1.delimiter.value=document.form1.regex.value;
    if (document.form1.rawdata.value=="")
    {
        myprompt(msg0);
        if (document.form1.rawdata.readOnly == false)
        document.form1.rawdata.focus();
        return;
    }
    else if (document.form1.targettable.selectedIndex == 0)
    {
        if (document.form1.newtable.value.replace(/ /g,'') == '')
        {
        myprompt(textmsg[16] +" " + msg1);
        document.form1.targettable.focus();
        return;
        }
        document.form1.createsql.value = composecreate();
    }
    else if (document.form1.regex.value=='')
    {
        myprompt(  msg2);
        document.form1.regex.focus();
        return; 
    }
    else if (document.form1.primarykey.value=='' && document.form1.override.value == 'yes')
    {
         myprompt('No primary key');
         document.form1.override[0].checked = true;
         return;
    }
    if (document.form1.rawdata.readOnly)
    {
        document.form1.rawdata.disabled = true;
    }
    document.form1.idledefault.value = '';
    if (document.form1.override.value == 'yes')
    {
        for (let k=0; k < document.form1.elements.length; k++)
            if (document.form1.elements[k].name.indexOf('defaultv') == 0 )
        {
            let kk = parseInt(document.form1.elements[k].name.replace(/[^0-9]/g,''));
            if (hexcolor(document.form1.elements[k].style.borderColor)!='#333333') 
                document.form1.idledefault.value += ','+ kk;
        }
    }
    formnewaction(document.form1);
    visual(document.form1);
    document.form1.submit();
    document.form1.rawdata.disabled = false;
     
}
function resizeCont()
{    
     var wd =  thispagewidth();
     var het = thispageheight();
     wd -= 25;
     het -= 8*(4+ 1.5*font_size) + 100;
     if (wd < 50)   wd = 50;
     if (het < 50) het = 50;
     var tt = document.getElementsByTagName("table")[0].offsetWidth;
     if (tt > 20)
     document.form1.rawdata.style.width= ""  + (tt-45)+  "px";
     var l = 4;
     document.form1.rawdata.style.height="" + het+ "px";
   // document.form1.old.style.width = (document.form1.old.offsetWidth + l-7) + 'px';
    // document.form1.newstr.style.width = (document.form1.newstr.offsetWidth + l-7) + 'px';
 } 
function afterloadlocal()
{
   savetmp();
   document.form1.source.checked = false;
   ifcsv();
   document.form1.webfile.value = "";
   document.form1.rawdata.readOnly = false;
   document.form1.rawdata.style.backgroundColor = 'white';
}
function ifcsv()
{
     
    document.getElementById('blank').innerHTML = '';
    heading = null;
    chartype = new Array();
    lengths = new Array();
    let s = document.form1.rawdata.value.replace(/^[ |\n]+/,'').replace(/\n.*/,"");
    if (s == '') return false;
    let q = s.replace(/[^"]/g,"");
    let c = s.replace(/"[^"]+"/g,"");
    if(q.length/s.length > 0.08)
    {
        document.form1.iscsv.checked = true;
        let x = new RegExp(/"."/);
        let m = x.exec(s);
        if (m !=null)
            document.form1.regex.value =  s.charAt(m.index+1);
        else
            document.form1.regex.value = ',';
        document.form1.closure.value = '"';
        document.form1.closure.list = 'closurelist';
        myparse();
    }
    else
    {
        let ss = document.form1.rawdata.value.replace(/^[ |\n]+/,'').split(/\n/);
        let s = ss[1]; if (s == null) s = ss[0];
        let q = s.replace(/[^']/g,"");
        let c = s.replace(/"[^']+"/g,"");
        if(q.length/s.length > 0.08)
        {
        document.form1.iscsv.checked = true;
        document.form1.regex.value =  (c.length>0?c.charAt(0):',');
        document.form1.closure.value = '\'';
        document.form1.closure.list = 'closurelist';
        myparse();
        }
        else 
        {
            document.form1.iscsv.checked = false;
             document.form1.regex.value =  '[ ]+';
        }
    }
    showclosure(document.form1.iscsv); 
}
function composecreate()
{
    let tbl = document.getElementById('newtblstruct');
    let s = "CREATE TABLE "+ document.form1.newtable.value + "(\n";
    let key = "";
    let k = 0;
    let maps ='';
    let keymap = "";
    for (let col = 1; col < tbl.rows[0].cells.length; col++)
    {
        let ch = tbl.rows[0].cells[col].getElementsByTagName('input')[0];
        if (ch.checked == false) continue;
        if (maps !='') maps += ",";
        maps += (col-1);
        let field = tbl.rows[1].cells[col].getElementsByTagName('input')[0].value.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
        let type = tbl.rows[2].cells[col].getElementsByTagName('input')[0].value.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
        let iskey = tbl.rows[3].cells[col].getElementsByTagName('input')[0].checked;
        let def = tbl.rows[5].cells[col].getElementsByTagName('input')[0].value;
        if (isNaN(def)==false) def = def.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
        let txt = (type.toLowerCase().indexOf("char")>=0 || type.toLowerCase().indexOf("text")>=0);
        if (iskey){ key += "," + field; keymap += ',' + k;}
        s += field + " " + type;
        if (def!='')
        {
            s += " DEFAULT ";
            if (txt) s += "'" + def + "'";
            else if (isNaN(def)==false)s +=   def;  
        }
        s += ","; k++;
    }
    document.form1.primarykey.value = keymap;
    document.form1.picks.value = maps;
    if (key == '') return s.replace(/,$/,")");
    return s + "PRIMARY KEY(" + key.substring(1) + "))";
}
function cachetbl()
{
    let tbl = document.getElementById('newtblstruct');
    let s = "";
    let key = "";
    for (let row = 0; row < 6; row++)
    {
       if (s!='') s += '\n';
    for (let col = 1; col < tbl.rows[0].cells.length; col++)
    {
        if (col > 1) s += ',';
        if (row == 0 || row==3)
           s += tbl.rows[row].cells[col].getElementsByTagName('input')[0].checked;
        else if (row == 4)
           s += tbl.rows[row].cells[col].getElementsByTagName('select')[0].selectedIndex;
        else if (row == 2 || row == 1)
           s += tbl.rows[row].cells[col].getElementsByTagName('input')[0].value.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
        else if (row == 5)
           s += tbl.rows[row].cells[col].getElementsByTagName('input')[0].value;
    }
} 
}

resizeCont();
window.onresize = resizeCont;
fill();
