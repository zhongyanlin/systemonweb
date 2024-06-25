

/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/

if (parent.frames[0] == window)
{
    function power2(sel)
    {
        var s = sel.options[sel.selectedIndex].value;
        
        if ('' + s == '0') return 0;
        if ('' + s == '-1') return -1;
        if ('' + s == 1) return 1;
        var k = 1;
        for (var i = parseInt(s) - 2; i>=0; i--)
            k *= 2;
        return k;
    }
    function selv(sel)
    {
        var j = sel.selectedIndex;
        var s = sel.options[j].value;
        
        return s;
    }
    function txtval(j)
    {
        return ele(0,j).value;
    }
    function redefine()
    {
    
    dosearch = function()
    {
        var r = document.getElementById("regex19").checked;
        var d = document.getElementById("regex18").checked;
         
        parent.frames[1].searchreg(txtval(0),txtval(1), txtval(2),txtval(3),txtval(4),txtval(5), txtval(6), 
        selv(ele(0,7)), power2(ele(0,8)), power2(ele(0,9)), power2(ele(0,10)), power2(ele(0,11)), 
        txtval(12), txtval(13),txtval(14), txtval(15), 
        parseInt('' + retrv(0,16)),parseInt('' + retrv(0,17)),
        d,r);
    }
    newrecord = function()
    {
        parent.frames[1].new1();
    }
    window.open("userrdaps.jsp", parent.frames[1].name);
    
    }
    onbegin = "redefine();";
}
else
{
 
 
 

for (var i=1; i < N-20; i++)
{
   document.thisform.rdap.options[i] = new Option(names[i],names[i]);
}
for (i=1; i < N-20; i++)
   if (names[i]==rdapin)
   {
      document.thisform.rdap.selectedIndex = i;
      break;
   }

var numlines = 0;
var originalrow = new Array(6);
var TOTAL = 0;
function builds(sel)
{
   TOTAL = 0;
   sel.options[0] = new Option(allroles[0], "-1");
   var base = 1;
   for (var i =1; i < allroles.length -1; i++)
   {
       sel.options[i] = new Option(allroles[i], i);
       TOTAL += base;
       base *= 2;
   }
}
builds(document.thisform.rolesel);
builds(document.thisform.insertrolesel);
builds(document.thisform.updaterolesel);
builds(document.thisform.deleterolesel);

roles[0] = 4;
insertroles[0] = 4;
updateroles[0] = 4;
deleteroles[0] = 4;
names[0] = '';
titles[0] = '';
jscripts[0] = '';
preops[0] = '';
postops[0] = '';
querys[0] = '';
insertQuerys[0] = '';
updateQuerys[0] = '';
deleteQuerys[0] = '';
formats[0] = '';
webServices[0] = '';
helps[0] = '';
var nav2 = null;
function dim(w,h)
{
    return "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=" + w +",height=" + h +",left=" + ((screen.width-w)/2) +",top=" + ((screen.height-h)/2);
}
var dim0 = dim(340,300);
function showhelp()
{ 
  let H = thispageheight();//
  // alert(H)
  var tt =    (helpstr);
  tt +=("<br><br><b><font color=purple>" + textmsg[51] + "</font></b><br><table style=width:" + document.thisform.query.style.width + " >");
  var butts = document.thisform.elements;
 
  tt +=       (   // buts(butts[0].className,newlabel, textmsg[12])+
                  //    buts(butts[1].className,toolmsg37, textmsg[13])+
                      buts("GreenButton",toolmsg960, textmsg[10]) +
                      buts("BlueButton",toolmsg33, textmsg[9])+
                      buts("GreenButton",toolmsg36, textmsg[11])+
                      buts("RedButton",textmsg[69], textmsg[14])
                   ); 
  tt +=("</table>");
  tt +=("<br><br><b><font color=purple>" + textmsg[924] + "</font></b><br><table><tr><td>");
  tt +=(textmsg[859].replace(/:/g,"</td><td>").replace(/;/g,"</td></tr><tr><td>"));
  tt +=("</td></tr></table>");
  tt +=("<br><br><b><font color=purple>" + textmsg[861] + "</font></b><br><table><tr><td>");
  tt +=(textmsg[860].replace(/:/g,"</td><td>").replace(/;/g,"</td></tr><tr><td>"));
  tt +=("</td></tr></table>");
  myprompt(tt,null,null,textmsg[7]);
  
  promptwin.style.left = (5 + 4.5*font_size) +  "px";
  promptwin.style.top = "140px";
 // promptwin.style.width = document.thisform.query.style.width;
  //alert(promptwin.style.height + promptwin.offsetHeight)
 
}
var temp;
var which;
var format;
var f = document.thisform;
f.submit9.value = textmsg[407];
resizebut(f,font_size);

var valid = true;
var ss =  "newTask";

var nav1=null;
function openit(url, winname)
{ 
   nav1 = window.open(url,winname, dim(560,500));
   nav1.focus();
}
function display()
{
   if (numrdaps==1) return;
   var j = f.rdap.selectedIndex;
   if (j==0 || j==-1)
   {
        nav1 = window.open('DataSearch?rdap=tasklangsearch&subdb='+ subdb,'language');
   }
   else
   {
        var rdapname = f.rdap.options[j].value;
        if (fieldnames[j] == null)
        {
           if (formats[j] == 'Update')
               nav1 = window.open('DataForm?exbut=a&numrows=1&rdap=tasklang&TaskName=' + rdapname + '&subdb='+ subdb,'language');
           else 
           {
              verify();
              bufferedaction = "display()";
           }
        }
        else
        {
           bufferedaction = "";
           nav1 = window.open('DataForm?exbut=a&numrows=1&rdap=tasklang&TaskName=' + rdapname +"&subdb="+ subdb,'language');
        }
   }
   

}
 
function getstring(str)
{
   f.query.value += '\n'+str;
}

function defaultupdate()
{
    if (f.updateQuery.value!= '')
       return;
    var j = f.rdap.selectedIndex;
    if (formats[j] == 'Search')
    {
        f.updateQuery.value = 'DataTable?rdap=' +  names[j].replace(/0$/,'');
        return;
    }
    var str = f.query.value;
    str = str.replace(/\sfrom\s/i, " from ");
    str = str.replace(/select\s/i, "select ");
    str = str.replace(/\swhere\s/i, " where ");

    var sa = str.split(" from ");
    var fa = sa[0].split("select ");
    var y = sa[1].split(" where ");

    var fs = fa[1].split(",");
    
    var len = fs.length;
     
    var nw = 0;
    var wc;
 
    var ns = 0;
    var sc;

    var field;
    var value;
    var x;

    for (var i=0; i < len; i++)
    {
       var t = fs[i].replace(/ as /i, " AS ");
       var b = t.split(" AS ");
       if ( b.length == 1)
       {
           field = t.replace(/\s/g, ""); 
           value = t.replace(/\s/g, "");
           x = 2;
       }
       else
       {
           t = b[1];
           field = b[0].replace(/\s/g, ""); 
           var a = b[1].split("_");
           value = a[0].replace(/\s/g, ""); 

           if (a.length == 1 || a[1].substr(0,1).toLowerCase() == 'h')
           {
               x = 2;
           }
           else
               x = 1;

       }

       if ( x == 1)
       {
            if (ns == 0)
            { 
               sc = "UPDATE " + y[0] + "\nSET " + field + "='$$" + value+"$$'";ns=1;
            }
            else
            {
               sc +=  ",\n    " + field + "='$$" + value+"$$'"; 
            }
       }
       else
       {
           if (nw == 0)
           {
               wc = "\nWHERE " + field + "='||"+value+"||'\n"; nw = 1;
           }
           else
               wc +="AND   " + field + "='||" + value+"||'\n"; 
       }

    }

    f.updateQuery.value = sc +" " + wc;

    if ( y.length > 1)
       f.updateQuery.value += " AND " + y[1];
    myprompt(textmsg[0]);
}


function insertupdate()
{
   if (f.insertQuery.value!='') return;
    var str = f.query.value;
    str = str.replace(/\sfrom\s/i, " from ");
    str = str.replace(/select\s/i, "select ");
    str = str.replace(/\swhere\s/i, " where ");

    var sa = str.split(" from ");
    var fa = sa[0].split("select ");
    var y = sa[1].split(" where ");

    var fs = fa[1].split(",");
    
    var len = fs.length;
     
    var nw = 0;
    var wc;
 
    var ns = 0;
    var sc;

    var field;
    var value;
    var x;

    for (var i=0; i < len; i++)
    {
       var t = fs[i].replace(/ as /i, " AS ");
       var b = t.split(" AS ");
       if ( b.length == 1)
       {
           field = t.replace(/\s/g, ""); 
           value = t.replace(/\s/g, "");
           
       }
       else
       {
           t = b[1];
           field = b[0].replace(/\s/g, ""); 
           var a = b[1].split("_");
           value = a[0].replace(/\s/g, ""); 
       }

       if (ns == 0)
       { 
           sc = "INSERT INTO " + y[0] + " (" + field;
           wc = " VALUES( " + "'@@"+ value+"@@'";
           ns=1;
       }
       else
       {
           sc += ", "+field; 
           wc +=", '@@" + value + "@@'"; 
       }
  
    }

    f.insertQuery.value = sc + ")" + wc + ")";
 
    myprompt(textmsg[0]);
}
if (typeof(f.submit20)!='undefined')  f.submit20.value=textmsg[321];


function defaultdelete()
{
    if (f.deleteQuery.value!= '')
       return;
    var j = f.rdap.selectedIndex;
    if (formats[j] == 'Search')
    {
        f.deleteQuery.value = 'DataForm?rdap=' +  names[j].replace(/0$/,'');
        return;
    }
    var str = f.query.value; 
    str = str.replace(/\sfrom\s/i, " from ");
    str = str.replace(/select\s/i, "select ");
    str = str.replace(/\swhere\s/i, " where ");

    var sa = str.split(" from ");
    var fa = sa[0].split("select ");
    var y = sa[1].split(" where ");

    var fs = fa[1].split(",");
    
    var len = fs.length;
     

    var nw = 0;
    var wc = '';
 
    var ns = 0;
    var sc;

    var field;
    var value;
    var x;
                   
    for (var i=0; i < len; i++)
    {
       var t = fs[i].replace(/ as /i, " AS ");  
       var b = t.split(" AS ");
       if ( b.length == 1)
       {
           field = t.replace(/\s/g, ""); 
           value = t.replace(/\s/g,"");
           x = 2;
       }
       else
       {
           t = b[1];
           field = b[0].replace(/\s/g, ""); 
           var a = b[1].split("_");
           value = a[0].replace(/\s/g, ""); 

           if (a.length == 1 || a[1].substr(0,1).toLowerCase() == 'h')
           {
               x = 2;
           }
           else
               x = 1;

       }

       if ( x == 1)
       {
            if (ns == 0)
            { 
               sc = "DELETE FROM " + y[0] + " \n"; ns=1;
            }
       }
       else
       {
           if (nw == 0)
           {
               wc = " WHERE " + field + "='||"+value+"||'\n"; 
               nw = 1;
           }
           else
               wc +="AND   " + field + "='||" + value+"||'\n"; 
       }

    }

    f.deleteQuery.value = sc  + wc;

    if ( y.length > 1)
       f.deleteQuery.value += " AND " + y[1];
    
}
function example()
{
    f.query.value= "SELECT \n  ssn,  \n  lastname as LastName_t_20,\n  email as Email_t_30\nFROM  Student where lastname='Lin'";
    f.updateQuery.value="";
    f.deleteQuery.value="";
    f.insertQuery.value="";
    f.webService.value="";
}

function hideamp(q)
{
    var amp = false;
    var ans = "";
    for (var j=0; j < q.length; j++)
    {
      if (q.charAt(j) == "'")
        amp = !amp;
      if (amp && q.charAt(j)=='&')
        ans += '&&';
      else 
        ans += q.charAt(j); 
    }
    return ans;
}
 
var fqueryold, finsertold, fupdateold, fdeleteold,ftitleold,fwebold;
function exec()
{
   var k = f.format.selectedIndex;

   if (   f.format.options[k].value == '')
   {
      myprompt('Select format');
      f.format.focus();
      return;
   }
   
   if (f.query.value == null || f.query.value == '' )
   {
       myprompt('Enter  query');
       f.query.focus();
       return;
   }

   if ( f.format.options[k].value == 'Update' && (f.updateQuery.value != '' || f.deleteQuery.value != '') )
   {
         myprompt('Update Query or deleteQuery is ignored');
   }
   ss = "ss";
   if (f.rdap.selectedIndex >=0)
   ss = f.rdap.options[f.rdap.selectedIndex].value;
   if (f.format.options[k].value == 'Web')
      formnewaction(f, "Form?rdap=" + ss + thisdb); 
   else
      formnewaction(f, "userrdaps.jsp");
   f.mode.value = "exec";
   valid = rolevalues();
   f.target = "_blank";
   visual(document.thisform);
document.thisform.submit();
}
var aa =''; 
function violate(i, c, a, e)
{
   var ans = false;
   if (regularmode)
   {
     if (c == '') 
         ans = false;
     else
     {
         try{
         var m = e.exec(a);
         ans = (m == null);
     }catch( x)
     {
         myprompt(c + ' ' + toolmsg990);
         ans = true;
     }
     }
   }
   else
   {
       if (c == '') 
           ans =  false;
       else
           ans =  (casesitive && a.indexOf(c) < 0 || !casesitive && a.toLowerCase().indexOf(c.toLowerCase()) < 0 );
   }
   if (ans) aa+=i + ',';
   return ans;
}

function violate1(i, rs, ri)
{
    var ans =  (rs != '' &&  ri!= rs);
    if (ans) aa += i +  "|" + rs + "|=|" +  ri +  '|,';
    return ans;
}

function violate3(i, rs, ri)
{
    var ans =  ( rs < ri );
    if (ans) aa += i + ',';
    return ans;
}

function violate2(i, rs, ri)
{
    var ans =  ( 
    rs==-1 &&  ri != -1 && ri != TOTAL  ||
    rs > 0 &&  (ri & rs) == 0   );
    if (ans) aa += i + ',';
    return ans;
}
var searchstate = 0;
var regularmode = true;
var casesitive = false;
var selectedIndex = 0;
function searchreg(rdapname, title,  query, insertQuery, updateQuery, deleteQuery, help, 
format, role, insertRoles, updateRoles, deleteRoles, 
webService,jscript, preop, postop, 
starttimes , endtimes ,
cases, regularmode1)
{
   
   regularmode = regularmode1;
   var cs = cases?'':'i';
   if (regularmode)
   {
   if (rdapname!='')
   try{ 
   var nmr = new RegExp(rdapname,cs);
   }catch(Exceptione)
   {
      myprompt( rdapname + " " + toolmsg990);
      return;
   } 
   if (title!='')
    try{ 
   var tr = new RegExp(title,cs);
   }catch(Exceptione)
   {
      myprompt( title+ " " + toolmsg990);
      return;
   } 
    
   if (query!='')
   try{ 
   var qr = new RegExp(query,cs);
   }catch(Exceptione)
   {
      myprompt( query  + " " + toolmsg990);
      return;
   }
   if (insertQuery!='')
   try{
   var ir = new RegExp( insertQuery,cs);
   }catch(Exceptione)
   {
      myprompt( insertQuery  + " " + toolmsg990);
      return;
   }
   if (updateQuery!='')
   try{ 
   var ur = new RegExp( updateQuery ,cs);
   }catch(Exceptione)
   {
      mypromt( updateQuery  + " " + toolmsg990);
      return;
   }
   if (deleteQuery!='')
   try{ 
   var dr = new RegExp( deleteQuery ,cs);
   }catch(Exceptione)
   {
      myprompt( deleteQuery  + " " + toolmsg990);
      return;
   }
   if (jscript!='')
   try{ 
   var jr = new RegExp(jscript,cs);
   }catch(Exceptione)
   {
      myprompt(jscript + " " + toolmsg990);
      return;
   }
   if (preop!='')
   try{ 
   var pr = new RegExp(preop,cs);
   }catch(Exceptione)
   {
      myprompt(preop + " " + toolmsg990);
      return;
   }
   if (postop!='')
   try{ 
   var or = new RegExp(postop,cs);
   }catch(Exceptione)
   {
      myprompt(postop + " " + toolmsg990);
      return;
   }
   if (webService!='')
   try{ 
   var wr = new RegExp(webService,cs);
   }catch(Exceptione)
   {
      myprompt(webService + " " + toolmsg990);
      return;
   }
   if (help!='')
   try{
   var hr = new RegExp(help,cs);
   }catch(Exceptione)
   {
      myprompt(help + " " + toolmsg990);
      return;
   }
    
   }
   
   
    
   //for (var i = f.rdap.options.length-1; i>=1; i--)  f.rdap.options[i] = null;
   var bstr = '<table style=\"border-collapse:collapse;border-color:#b0b0b0;background-color:' + TBGCOLOR + '\" cellpadding=3 border=1 id=brieftbl><tr bgcolor='+ BBGCOLOR + '>';
   var aligns = ['left','left','left','right','right','right','right','left','left','left','left'];
   var reor = [0,1,6,8, 10, 12, 14, 16,3, 4, 5];  
   for (var n=0; n < reor.length; n++)
       bstr+= "<td align=" + aligns[n] + " onclick=sortit(this," + n + ") style=font-weight:700 ><nobr>" + allabels[reor[n]] + "</nobr></td>";
   bstr += "<td align=left   onclick=sortit(this," + n + ")  style=font-weight:700 ><nobr>" + textmsg[1298] + "</nobr></td>";
   bstr += "<td align=left   style=font-weight:700 ><nobr>" + permitstr + "</nobr></td></tr>";
   var ii = 0; 
   var k=0;
   closeprompt();
   for (i = 1; i < numrdaps; i++)
   { 
    aa = '';
    if (
        violate(1, rdapname,names[i], nmr) ||
        violate(2, title,titles[i],tr)             ||
        violate(3, insertQuery,insertQuerys[i],ir) ||
        violate(4, query,querys[i],qr)             ||
        violate(5, updateQuery,updateQuerys[i],ur) ||
        violate(6, deleteQuery,deleteQuerys[i],dr) ||
        violate(7, help,helps[i],hr)               || 
        violate(8, jscript,jscripts[i],jr)         ||
        violate(9, preop,preops[i],pr)             ||
        violate(10, postop,postops[i],or)           ||
        violate(11, webService,webServices[i],wr)   ||
        violate1(12, format, formats[i])            ||
        violate2(13,  role, roles[i])              ||
        violate2(14, insertRoles, insertroles[i])  ||
        violate2(15, updateRoles,  updateroles[i])    ||
        violate2(16, deleteRoles, deleteroles[i])  ||
        violate3(17, lastupdates[i], starttimes) ||
         violate3(18, endtimes, lastupdates[i]) 
        )
        {  
         //   f.rdap.options[i] = new Option(" ", " "); 
            
        }
        else
        {
            k++;   
           // f.rdap.options[i] = new Option(names[i], names[i]);
            
            bstr += "<tr><td onclick=showrecord(this) style=color:blue;cursor:pointer ><nobr>" + names[i] + "</nobr></td><td width=100 style=\"overflow:hidden\">" + cut(titles[i],15) + "</td><td>" + formats[i] + "</td><td align=right>" 
                    + roles[i] + "</td><td align=right>" + insertroles[i] + "</td><td align=right>" + updateroles[i] + "</td><td align=right>" + deleteroles[i] + "</td><td  width=100 style=\"overflow:hidden\">" 
                    + cut(webServices[i],10 ) + "</td><td>" + cut(jscripts[i],10) + "</td><td>" + cut( preops[i],10) + "</td><td>" + cut(postops[i],10) + "</td><td  align=right><nobr>"
                    + "<!--" + lastupdates[i] + "-->" +  parent.frames[0].timestr(lastupdates[i])  + "</nobr></td><td style=color:blue;cursor:pointer onclick=getpermit(this) >" + permitstr + "</td></tr>";  
        }
   } 
   // f.submit1.value = textmsg[721];
    if (k==0)  
    {
        if (promptwin == null) myprompt(  k + " " + textmsg[839]);
    }
    else
    {
        myprompt(bstr + '</table>',null,null,"" + k + " " + textmsg[839]);
        selectedIndex = 0;
        showrecord( document.getElementById('brieftbl').rows[1].cells[0] );
        promptwin.style.left = '5px';
        promptwin.style.top = '70px';
    }
    promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].onclick
        = function(){searchstate=0;closeprompt();}
    searchstate=1;
    
}
function getpermit(td)
{
   showrecord(td.parentNode.cells[0]);
   userlevel();
}
function getcellstr(tbl, r, c)
{
    return tbl.rows[r].cells[c].innerHTML.replace(/<nobr>/g,'').replace(/<.nobr>/g,'');
}
function cut(str, n)
{
    if (str.length > n) 
        return str.substring(0,n).replace(/>/, '&gt;').replace(/</, '&lt;').replace(/ /g, '&nbsp;');
    return str;
}
function sortit(td, n)
{
    var tbl = td.parentNode.parentNode;
    var numeric = (td.align.toLowerCase() == 'right');
    if (tbl.tagName.toLowerCase()!='table') tbl = tbl.parentNode;
    var m = 0;
    for (var i=1; i < tbl.rows.length; i++)
    {
        var m1 = getcellstr(tbl, i, n).length;
        if (  m < m1)   m = m1;
    } 
    var arr = new Array();
    for (var i=1; i < tbl.rows.length; i++)
        arr[i-1] = padd(numeric,getcellstr(tbl, i, n),m,i);
    arr.sort();
    var y = new Array();
    for (var i=0; i < tbl.rows.length-1; i++)
       y[i] = parseInt(arr[i].substring(m).replace(/^[0]+/,'')) - 1;
    for (var j= 0; j < tbl.rows[0].cells.length; j++)
    {
       for (var i=1; i < tbl.rows.length; i++)
           arr[i-1] = getcellstr(tbl, i, j);
       for (var i=1; i < tbl.rows.length; i++)
           tbl.rows[i].cells[j].innerHTML = '<nobr>' + arr[y[i-1]] + '</nobr>';
    }
}
function padd(numeric, s, m, i)
{
    var a = '';
    if (!numeric)
    {
        a = s;
        for (var j= s.length; j < m; j++) 
            a += ' ';
    }
    else
    {
        for (var j= s.length; j < m; j++) 
            a += '0';
        a += s;
    }
    if (i < 10) a += '000' +i;
    else if (i < 100) a += '00' + i;
    else if (i < 1000) a += '0' + i;
    else a += i;
  
    return a;
}

function showrecord(td)
{
    
    var tbl = document.getElementById("brieftbl");
    if (selectedIndex>0)
    for (var i=0; i < tbl.rows[0].cells.length; i++)
        tbl.rows[selectedIndex].cells[i].style.backgroundColor = TBGCOLOR;
    var r = document.thisform.rdap;
    for ( i=0; i < r.options.length; i++)
        if (td.innerHTML.replace(/<nobr>/i,'').replace(/<.nobr>/i,'') == r.options[i].value)
            break;
       
    r.selectedIndex = i;
    fill();
    
    for (i=1; i < tbl.rows.length;i++)
        if (tbl.rows[i].cells[0] == td)
            break;
    selectedIndex = i;
    for ( i=0; i < td.parentNode.cells.length; i++)
        td.parentNode.cells[i].style.backgroundColor = 'lightyellow';
     
}
function nextrecord(i)
{
    var tbl = document.getElementById("brieftbl");
    var j = 1;
    if (i == 1)
    {
        if (selectedIndex == tbl.rows.length-1)
            j = 1;
        else 
            j = selectedIndex+1;
    }
    else
    {
        if (selectedIndex ==  1)
            j =   tbl.rows.length-1;
        else 
            j = selectedIndex - 1;
    }
    showrecord(tbl.rows[j].cells[0]);
}
function tables()
{
   formnewaction(f,"tables.jsp");
   valid = true;
   ss = "tableLis";
  visual(f);
 f.submit();
}

function nulloption()
{
   // fm.assignname.options[l] = null;
   
}
function rolevalues()
{
   var rolesvalue = fromAccess1(f.rolesel);

   var insertrolesvalue = fromAccess1(f.insertrolesel);
   var updaterolesvalue = fromAccess1(f.updaterolesel);
   var deleterolesvalue = fromAccess1(f.deleterolesel);

   if (  rolesvalue==null||insertrolesvalue==null
       ||updaterolesvalue==null||deleterolesvalue==null)
   {
       myprompt(textmsg[507]);
       if (rolesvalue==null)fillAccess1(f.rolesel,-1,true);
       if (insertrolesvalue==null)fillAccess1(f.insertrolesel,-1,true); 
       if (updaterolesvalue==null)fillAccess1(f.updaterolesel,0, false); 
       if (deleterolesvalue==null)fillAccess1(f.deleterolesel,0, false);
       return false;
        
   }
   else 
   {
       f.roles.value = rolesvalue;
       f.insertroles.value = insertrolesvalue;
       f.updateroles.value = updaterolesvalue;
       f.deleteroles.value = deleterolesvalue;
   }
   
   return true;
}
function trimcsv(  x)
{  
    return x;//.replace(/[ ]+,/g, ",");
}

function getattr(j)
{
     var query = f.query.value;
     var parse = new CSVParse(f.help.value, '\'', ',','\r\n');
     var mt = parse.nextMatrix(true);
     var err = '';
     for (var i=0; i < mt.length; i++)
     if (query.indexOf(mt[i][0]) < 0)
     {
         err += mt[i][0] + ' not in query<br>';
     }
     myprompt(err +"<center><input type=button class=\"OrangeButton\" style=width:70px onclick=updatehelp(1) value=\"" + textmsg[225] + "\"><input type=button class=\"GreenButton\" style=width:70px onclick=updatehelp(0)  value=\"" + textmsg[18] + "\"></center><br><iframe id=helpwin src=DataTable?rdap=taskopt&extraline=2&onbegin=109 width=800 height=" + (j*25 + 100) + " frameborder=0>");
     var xy = findPositionnoScrolling(f.help);
     promptwin.style.top = xy[1] + 'px';
     promptwin.style.left = (xy[0]-60) + 'px';
}
function width2(w,h)
{
    document.getElementById('helpwin').width= (w + 30) + 'px';
    document.getElementById('helpwin').height= (h + 30) + 'px';
}

function updatehelp(i)
{
    if (i == 1)
    {
        var win = document.getElementById('helpwin').contentWindow;
        var nr = win.passoverNumRows();
        var x = '';
        for (var i=0; i < nr; i++)
        {
            for (var j=0; j < 5; j++)
            {
                var q = win.retrv(i,j);
                if (q == null) q = '';
                var qu = '';
                if (q.indexOf(",") >= 0 || q.indexOf("\n")>=0 || q.indexOf("\r")>=0)
                    qu = "'";
                x += qu + q.replace(/'/g, "''") +  qu;
                if (j < 4) 
                    x += ",";
                else if (i < nr-1)
                {
                    x = x.replace(/[,]+$/,"") + "\r\n";
                }
            }
        }
        f.help.value = x.replace(/[,]+$/,"");
        
    }
    closeprompt();
}
var jjj = 0;
function attr()
{
     formnewaction(f,"userrdaps.jsp");
     f.mode.value="regex";
     valid = true;
    f.target = "w" + tstmp; 
    visual(f);
    f.submit();
}


function aftersave()
{
   var j = f.rdap.selectedIndex;
   names[j] = f.rdap.options[j].value; 
   querys[j] = f.query.value;
   titles[j] = f.title.value;
   jscripts[j] = f.jscript.value;
   preops[j] = f.preop.value;
   postops[j] = f.postop.value;
   insertQuerys[j] = f.insertQuery.value;
   updateQuerys[j] = f.updateQuery.value;
   deleteQuerys[j] = f.deleteQuery.value;
   webServices[j] = f.webService.value;
   if (f.format.selectedIndex>=0)
   formats[j] = f.format.options[f.format.selectedIndex].value;

   helps[j] = trimcsv(f.help.value);
   roles[j] = f.roles.value;
   insertroles[j] = f.insertroles.value;
   updateroles[j] = f.updateroles.value;
   deleteroles[j] = f.deleteroles.value;
   permits[j] = '';
   if (f.rolesel.selectedIndex == 0)
       permits[j] += ",1+*";
   if (f.insertrolesel.selectedIndex == 0)
       permits[j] += ",2+*";
   if (f.updaterolesel.selectedIndex == 0)
       permits[j] = ",3+*";
   if (f.deleterolesel.selectedIndex == 0)
       permits[j] = ",4+*";
   if (permits[j]!='')
       permits[j] = permits[j].substring(1);
   
   if (j==numrdaps) numrdaps++;
}
function save()
{
  // searchstate = 0;
   valid = true;
   if (  f.rdap.selectedIndex == 0)
   {
      saveAs();
      return;
   }
   formnewaction(f, "userrdaps.jsp");
   f.mode.value="update";
   ss = "safewin" ;
   valid = rolevalues();
}

function deletet()
{
    if (numrdaps==1) return;
    var j = f.rdap.selectedIndex;
    if (j==0 || j==-1)
    {
        myprompt(textmsg[885]);
        f.rdap.focus();
        return;
    }
    myprompt(textmsg[1],null,"if(v)godelete()");
}
function blankthis()
{
    var j = f.rdap.selectedIndex;
    f.rdap.options[j].text = '';
    f.title.value = '';
    f.jscript.value = '';
    f.preop.value = '';
    f.postop.value = '';
    f.query.value = '';
    f.insertQuery.value = '';
    f.updateQuery.value = '';
    f.deleteQuery.value = '';
    f.webService.value = '';
    f.format.selectedIndex = 0;//f.format.options.length-1;
    f.help.value = '';
    fillAccess1(f.rolesel, -1,true);
    fillAccess1(f.insertrolesel, -1,true);
    fillAccess1(f.updaterolesel, -1,true);
    fillAccess1(f.deleterolesel, -1,true);
    names[j] = '';
    titles[j] = '';
    jscripts[j] = '';
    preops[j] = '';
    postops[j] = '';
    querys[j] = ''; 
    insertQuerys[j] = '';
    updateQuerys[j] = '';
    deleteQuerys[j] = '';
    webServices[j] = '';
    helps[j] = '';

    roles[j] = 0  ;
    insertroles[j] = 0 ;
    updateroles[j] = 0  ;
    deleteroles[j] = 0;
    roles[j] = '';
    insertroles[j] = '';
    updateroles[j] = '';
    deleteroles[j] = '';
    options[j] = ''  ;
    permits[j] = '';
}
function godelete()
{
     formnewaction(f,"userrdaps.jsp");
     f.mode.value="delete";
     valid = true;
     f.target = "w" + tstmp; 
    
    visual(f);
 f.submit();
}

function afterdelete()
{
   var j = f.rdap.selectedIndex;
         querys[j] = 'deleted';
         insertQuerys[j] = '';
         updateQuerys[j] = '';
         deleteQuerys[j] = '';
         webServices[j] = '';
         helps[j] = '';
         permits[j] = '';
}

function saveAs()
{
  // searchstate = 0;
   var  i = f.format.selectedIndex;
   if (i==-1 || f.format.options[i].value=='')
   {
        myprompt(textmsg[896]);
        f.format.focus();
        return;
   }
   valid = rolevalues();
   if (valid)
      myprompt(textmsg[2],"newTask","nonrepeatthengo(v)");
}

function nonrepeatthengo(nt)
{
          var error = "";
          nt = nt.replace(/'/g,'');
          var j = 0, k = 0;
          for ( ; j < numrdaps && nt != names[j]; j++);
          if(j < numrdaps )
          {
              myprompt(nt + " " + textmsg[3], "newTask","nonrepeatthengo(v)");
          }
          else
          {
             j=0;
             if (sysrdaps.length-1 > 0)
             for (; j < sysrdaps.length-1 && nt != sysrdaps[j]; j++);
             if(sysrdaps.length-1 > 0 && j < sysrdaps.length-1 )
             {
                 myprompt(nt + " " + textmsg[4], "newTask","nonrepeatthengo(v)");
             }
             else
             {
                 var str = validatesearch();
                 if (str!='')
                     myprompt(str +".<br>Continue?", null,"if(v)gosaveit('" + nt +"')");
                 else
                     gosaveit(nt);
             }
          }
}

function gosaveit(nt)
{

   f.mode.value="insert";
   formnewaction(f, "userrdaps.jsp");
   f.rdap.options[numrdaps] = new Option(nt,nt);
   f.oldrdap.value = (f.rdap.selectedIndex==0)?"":f.rdap.options[f.rdap.selectedIndex].value;
   f.rdap.selectedIndex = numrdaps;
   ss = "savemsg";
   if (validate())
   {
      visual(f);
 f.submit();
   }
}


function new1()
{
    
    f.rdap.selectedIndex = 0;
    f.title.value = '';
    f.jscript.value = '';
    f.preop.value = '';
    f.postop.value = '';
    f.query.value = '';
    f.insertQuery.value = '';
    f.updateQuery.value = '';
    f.deleteQuery.value = '';
    f.webService.value = '';
    f.format.selectedIndex = 0;//f.format.options.length-1;
    f.help.value = '';
    fillAccess1(f.rolesel, -1, true);
    fillAccess1(f.insertrolesel, -1, true);
    fillAccess1(f.updaterolesel, -1, true);
    fillAccess1(f.deleterolesel, -1, true);
    
    smalltext();
}


function next(i)
{
   if (searchstate==0)
   {
   if (i==1 && f.rdap.selectedIndex == f.rdap.options.length-1)
     f.rdap.selectedIndex = 1;
   else if (i==-1 && f.rdap.selectedIndex <= 1)
     f.rdap.selectedIndex = f.rdap.options.length-1;
   else if (f.rdap.selectedIndex<1)
       f.rdap.selectedIndex = 1;
   else
       f.rdap.selectedIndex += i;
   fill();
   }
   else
   {
       nextrecord(i);
   }
}

function fill()
{
  //  searchstate = 0;
    //smalltext();
    var j = f.rdap.selectedIndex;

    if (j==-1){  resizeCont(); return;}
    var nm = f.rdap.options[j].value;
    if (j > 0)
    {
      j=0;
      for(; j < numrdaps && names[j] != nm; j++);
    }

    if (j==numrdaps){  resizeCont(); return;}
    var i = 0;  
    for (; i < f.format.options.length && f.format.options[i].value != formats[j]; i++);
    if (i == f.format.options.length) 
        i = 0;
   
    f.format.selectedIndex = i;
    f.rdap.value = names[j];
    f.title.value = titles[j];
    f.jscript.value = jscripts[j];
    f.preop.value = preops[j];
    f.postop.value = postops[j];
    f.query.value = querys[j]; 
    f.insertQuery.value = insertQuerys[j];
    f.updateQuery.value = updateQuerys[j];
    f.deleteQuery.value = deleteQuerys[j];
    f.webService.value = webServices[j];
    f.help.value = makeneat( helps[j]);

    fillAccess1(f.rolesel, roles[j], permits[j]!=null && permits[j].indexOf("1+*")>=0);
    fillAccess1(f.insertrolesel, insertroles[j],permits[j]!=null && permits[j].indexOf("2+*")>=0 );
    fillAccess1(f.updaterolesel, updateroles[j],permits[j]!=null && permits[j].indexOf("3+*")>=0 );
    fillAccess1(f.deleterolesel, deleteroles[j],permits[j]!=null && permits[j].indexOf("4+*")>=0 );
    f.roles.value = roles[j];
    f.insertroles.value = insertroles[j];
    f.updateroles.value = updateroles[j];
    f.deleteroles.value = deleteroles[j];
    f.options.value = options[j];
    resizeCont();
    smalltext();
    
    if (formats[j] == 'Search')
    {
       document.getElementById(msg1090).innerHTML = '<b><Nobr>' + textmsg[114] + '</nobr></b>';
       document.getElementById(msg29).innerHTML = '<b><Nobr>' + msg1332 + '</nobr></b>';
    }
    else
    {
       document.getElementById(msg1090).innerHTML = '<b><Nobr>' + msg1090 + '</nobr></b>';
       document.getElementById(msg29).innerHTML = '<b><Nobr>' + msg29 + '</nobr></b>';
    }
}

function smalltext()
{
   var eles = f.elements;
   var j=0;
   for (var i=0; i< eles.length && j < 6; i++)
   {
       if (eles[i].tagName.toLowerCase()=='textarea')
       {
          if (originalrow[j]!=null)
          {
             eles[i].rows = originalrow[j];
          }   
          j++;
       }
   }
   allrights();
}
 
function validate()
{  
   if (valid == false)
      return false;
    
   if (ss != null) 
        ss = ss.replace(/\W/g,'_');
   else ss = 'resulwin';
    
   f.target = "w" + tstmp;
   return (true);
}
var nav4 = null;
function openWindow(url, winname  )
{
    nav4 = window.open(url, winname, dim0);
}
var oldWindW = 0; 
function resizeCont()
{
    var rate = charwidthrate();
    var butwith = Math.ceil(parseFloat(rate)*font_size);
    resizebut(f,font_size);
    var winW = screen.width-10;
    var winH = screen.height-200;
    winW = document.body.clientWidth - 16;
     //winH = document.body.clientHeight + 30;
    var usedw = 2*butwith + 36 + ((2*butwith < 150)?150:(2*butwith )) ;
    
    winW -= usedw;
    if (winW < oldWindW+25) return;
    oldWindW = winW;
    winH = Math.ceil(winH - (6*font_size + 100));
    if (winH < 20) winH = 20;
    winH  = Math.ceil(Math.floor(winH/5)-3);
    
    f.query.style.width= '' + winW +'px';
    f.insertQuery.style.width='' + winW +'px';
    f.updateQuery.style.width='' + winW +'px';
    f.deleteQuery.style.width='' + winW +'px';
    f.help.style.width='' + winW +'px';
    f.webService.style.width= '150px';

    f.old.style.width = (butwith + 10)   + 'px';
    f.newone.style.width = (butwith + 10) + 'px';

    var wd = Math.ceil((winW - 3*butwith  - 26)/2);

    f.rdap.style.width = wd + 'px';
    f.title.style.width = wd + 'px';

    allrights();

     f.insertQuery.style.visibility = '';
     f.updateQuery.style.visibility = '';
     f.deleteQuery.style.visibility = '';
     f.help.style.visibility = '';
     var xx = (wd - butwith -2);
     if (xx < 10) xx = 10;
    f.jscript.style.width = xx + 'px';
    f.preop.style.width =  butwith + 'px';
    f.postop.style.width = xx + 'px';


 }
function allrights()
{
     f.rolesel.style.height= f.query.offsetHeight + 'px';
     f.insertrolesel.style.height=f.insertQuery.offsetHeight + 'px';
     f.updaterolesel.style.height=f.updateQuery.offsetHeight + 'px';
     f.deleterolesel.style.height=f.deleteQuery.offsetHeight + 'px';
     f.webService.style.height=f.help.offsetHeight + 'px';
}
function syn(x)
{
   if (x==1)
   { 
     if (f.mode.value=='delete')
       afterdelete();
     else
       aftersave();
    
     if (iamsystemadmin)
       return 1;
   }
   return 0;
}

var rootstyle = document.getElementsByTagName("head")[0].innerHTML;
   let jj = rootstyle.indexOf(":root");
   if (jj == -1)rootstyle = '';
   else 
   {
      let kk = rootstyle.indexOf("}",jj);
      rootstyle = "<style>" + rootstyle.substring(jj,kk+1) + "</style>";
   }
var helpstr = textmsg[5];
helpstr = helpstr.replace(/:/g, "</font></NOBR></b></div></td><td>");
helpstr = "<b><font color=purple>" + textmsg[6] + "</font></b><br><table border=0><tr><td valign=top><div style=background-color:" + IBGCOLOR + " > <b><NOBR><font color=#DDCC11>" + helpstr;
helpstr = helpstr.replace(/\n/g, "</td></tr><tr><td valign=top><div style=background-color:" + IBGCOLOR + " > <b><NOBR><font color=#DDCC11>");
helpstr += "</td></tr></table>" + rootstyle + "<link rel=stylesheet type=text/css href=styleb" + (orgnum) + ".css />" ;


function buts(clas, caption, explain)
{
   return "<tr><td valign=top> <input class=" + clas +" style=\"width:60px\"  type=button value=\""
   + caption+"\"> </td><td>"
   + explain +"</td></tr>";
}

function getPassed(idsv)
{
    if (f.webService.value.length > 0)
       f.webService.value += ","+idsv.replace(/\n/g,",").replace(/,$/,'');
    else
      f.webService.value  = idsv.replace(/\n/g,",").replace(/,$/,''); 
}
 
function picktool()
{
    if (nav2 != null) 
        nav2.close();
    nav2 = window.open('DataPicker?rdap=webservices&existing='+encodeURIComponent(document.thisform.webService.value), "pickerwin" ,dim(300,700));
}



function trans(sel, hinput)
{
    hinput.value = fromAccess1(sel);
}
function fillAccess1(sel, code, public)
{
      sel.options[0].selected = public;
      
      if (code==null)
      {
         for (var i = 0; i <  sel.options.length ; i++)
         sel.options[i].selected = true;
      }    
      else if (code == -1)
      { 
         for (i = 1; i <  sel.options.length ; i++)
         sel.options[i].selected = true;
      }
      else
      {
         if (sel.options.length > 0)
         sel.options[0].selected = false;
         for (var i = 1; i <  sel.options.length ; i++)
            sel.options[i].selected = ( (code & (1<<(i-1)) ) > 0);
      }
}
function fromAccess1(sel)
{
   if ( sel.options[0].selected )
   {
       return -1;
   }
   var isall = true;
   for (i = 1; i <  sel.options.length ; i++)
      if (sel.options[i].selected)
          isall = false;
   if (isall)
   {
       return -1;
   }
   var code = 0;
   for (var i = 1; i <  sel.options.length ; i++)
      if ( sel.options[i].selected)
         code |= (1<<(i-1));
   //f.roles.value = code; 
   return code;
}

function makeneat(t)
{
    return t;
    var space = "                                                         ";
    var p = new CSVParse(t);
    var mt = p.nextMatrix(true);
    var str = '';
    var idea = [25, 2, 35, 20];
    for (var i=0; i < mt.length; i++)
    {
        for (var j=0; j < 5; j++)
        {
            var q = '';
            if (mt[i][j] == null) mat[i][j] = '';
            if (mt[i][j].indexOf(",")>=0 || mt[i][j].indexOf("\n")>=0 || mt[i][j].indexOf("\r")>=0) q = "'";
            q = q + mt[i][j].replace(/'/g,"''") + q;
            if (j < 4)
            {
                
                if (q.length < idea[j])
                    q+= space.substring(0,idea[j]-q.length);
                q += ",";
                str += q;
            }
            else 
            {
                str += q;
                if (i < mt.length) str += "\n";
            }
        }
    }
    return str;
}
 
function verify()
{
    if (f.query.value == null || f.query.value == '' )
    {
       myprompt('Enter  query');
       f.query.focus();
       return;
    }
    formnewaction(f, "userrdapcompile.jsp");
    ss = 'w' + tstmp;
    f.target =   ss;
   visual(f);
 f.submit();
}
var thecurrentareabesearch = 0;
function startsearchfrom(nn)
{
   thecurrentareabesearch = nn;
}
var textareaarray = new Array(5);
textareaarray[0] = f.query;
textareaarray[1] = f.insertQuery;
textareaarray[2] = f.updateQuery;
textareaarray[3] = f.deleteQuery;
textareaarray[4] = f.help;



function findstrintextarea1(str1)
{

   var b=0;
   var ii =    thecurrentareabesearch;
   var kk = 0;
   while (kk++ <  5)
   {
     textareatobesearch = textareaarray[ii];
     large(textareaarray[thecurrentareabesearch], thecurrentareabesearch, 6);
     b = findstrintextarea(str1);
     if (b == false)
     {
        ii =  (ii+1)%5;
       
     }
     else
     {
        thecurrentareabesearch = ii;
        break;
     }
   }


   var edittoolobj = document.getElementById("edittool");
   var pos = findPositionnoScrolling(textareaarray[thecurrentareabesearch]);
   window.scrollTo(0, pos[1]);
   if (thecurrentareabesearch != 0)
   {
       document.ftt.newone.value = f.newone.value;
       document.ftt.old.value = f.old.value;
       edittoolobj.style.visibility = "visible";
      // pos[1] -= edittoolobj.offsetHeight;
       pos[0]  += textareaarray[thecurrentareabesearch].offsetWidth;// - edittoolobj.offsetWidth;
       edittoolobj.style.left =  pos[0]   + 'px';
       edittoolobj.style.top =   pos[1]   + 'px';
   }
   else
   {
       edittoolobj.style.visibility = "hidden";
   }

}
     
 

function buildURL()
{
     if (numrdaps==1) return;
     var j = f.rdap.selectedIndex;
     if (j==0 || j==-1)
     {
        myprompt(textmsg[885]);
        f.rdap.focus();
        return;
     }
     var  i = f.format.selectedIndex;
     if (i==-1 || f.format.options[i].value=='')
     {
        myprompt(textmsg[896]);
        f.format.focus();
        return;
     }
      
     if (nav2!=null) nav2.close();
     var url = "userrdapopt.jsp?j=" + j + "&format="
        + f.format.options[i].value +"&rdap="
        + encodeURIComponent(f.rdap.options[j].value)
        + ((options[j]==null)? '':options[j]);
      
     nav2 = window.open(url, "_blank");//, dim(800,600));

}

function setting()
{
   window.open("DataForm?rdap=fontsize&exbut=p&onsaved=0&subdb="+ subdb,"customiz", dim(300,280));
}
var BIGN = 25;
function extract()
{ 
    var outstr = new Array(2);
    var nav3 =  openblank("words",dim(screen.width,screen.height));
    nav3.document.write("<table border=1>");
    for (var i=1; i < numrdaps; i++)
    {
       var mt = new Array(BIGN);
       var numRows = 0;
       if (formats[i]=='Search' || formats[i]=='Update')
          numRows = getQues(querys[i],  mt );
       else  
          numRows = qparse(querys[i], 11, mt, outstr);
       nav3.document.write("<tr><td>" + names[i] + "</td><td>" + formats[i] +"</td>");
       for (var j=0; j < numRows && j < BIGN; j++)
          nav3.document.write("<td>" + mt[j] + "</td>");
      if (numRows < BIGN)
          nav3.document.write("<td colspan=" + (BIGN-numRows) + ">&nbsp;</td>");
       nav3.document.write("</tr>");
    
    }
    nav3.document.write("</table>");
    endDocWrite(nav3);
}
function getQues(latex,mt)
{
  var reg = new RegExp(/[ |\?]([A-Z|a-z]+)_[a-z|A-Z]/);
  var k =0, j, i = 0;
  
  var numRows = 0;
  while (true)
  {
      var m = reg.exec(latex.substring(k));
      if (m == null || ''+m == '') break;
      j = m.index;
      var str = '' + m;  
      mt[numRows++] = str.replace(/[^,]*,/g,'');
      k += j + str.length;
  }
  return numRows;
}
function replace(str, w, tw)
{
   var x = '';
   var tt = ["||","@@","$$"];
   for (var i=0; i < 3; i++)
   {
      while ( (x = str.replace(tt[i]+w+tt[i], tt[i]+tw+tt[i])) != str)
         str = x;
   }
   return str;
}
 
function saveall()
{
    
}
window.onresize = resizeCont;
 
function relarge(){}

function large(elem,j,c)
{
   originalrow[j] = c;
   for(var i=0; i < 10; i++)
       if (elem.clientHeight < elem.scrollHeight)   elem.rows += 2;
   allrights();
   startsearchfrom(j);
}
function smaller(ta,j)
{
  
}

function alarge(elem,evt,j)
{
    var e = evt? evt : window.event;
    if(!e) return true;
    var key = 0;
    if (e.keyCode) { key = e.keyCode; } // for moz/fb, if keyCode==0 use 'which'
    else if (typeof(e.which)!= 'undefined') { key = e.which; }
    if (key == 13)
    {
        while (elem.clientHeight < elem.scrollHeight)
          elem.rows += 2;
        allrights();
    }
    return true;
}


var helphints = null;
var hints = new Array(15);

if (typeof(helpinstro)!='undefined' &&  helpinstro!=null && helpinstro!="")
{
     helphints = helpinstro.split(/<.td><.tr>/);
}

if (helphints!=null)
{
  for (var j=0; j < helphints.length && j < 15;j++)
     hints[j] = helphints[j].replace(/.*<.td><td>/,"");
}
/*
f.submit.onmouseover = function (){showmyhint(0);}
f.btn2.onmouseover = function (){showmyhint(1);}
if(iamsystemadmin) f.btn3.onmouseover = function (){showmyhint(2);}
f.btn4.onmouseover = function (){showmyhint(3);}
f.btn5.onmouseover = function (){showmyhint(4);}
f.btn6.onmouseover = function (){showmyhint(5);}
f.submit.onmouseout = function (){hidemyhint();}
f.btn2.onmouseout = hidemyhint;
f.btn3.onmouseout = hidemyhint;
f.btn4.onmouseout = hidemyhint;
f.btn5.onmouseout = hidemyhint;
f.btn6.onmouseout = hidemyhint;
var alldivs = document.getElementsByTagName("div");
var headinghint = toolmsg660.split("@");
alldivs[1].onmouseover = function (){showmyhintstr(headinghint[0].replace(/.*:/,'') +"<br>" + textmsg[74]);}
alldivs[2].onmouseover = function (){showmyhintstr(headinghint[1].replace(/.*:/,'') +"<br>" + textmsg[74]);}
alldivs[3].onmouseover = function (){showmyhintstr(headinghint[2].replace(/.*:/,'') +"<br>" + textmsg[74]);}
alldivs[4].onmouseover = function (){showmyhintstr(headinghint[3].replace(/.*:/,'') +'<br>' );}
alldivs[5].onmouseover = function (){showmyhintstr(headinghint[4].replace(/.*:/,'') +"<br>" + textmsg[835]);}
alldivs[6].onmouseover = function (){showmyhintstr(headinghint[5].replace(/.*:/,'') +"<br>" + textmsg[74]);}
for (var i=1; i < 7; i++)
    alldivs[i].onmouseout = hidemyhint;
*/
 
function userlevel()
{
   if (f.rdap.selectedIndex > 0)
   {
   var rdapname = f.rdap.options[f.rdap.selectedIndex].value;
   postopen("DataTable?x=1&rdap=permits&N=4&rdapname=" + encodeURIComponent(rdapname)  + "&onbegin=9"  + "&onsave=10" ,  '500_400');
   }
}

function assemble()
{
   var s='',tt;
   for (var i=0; i < 4; i++)
   {
       tt= justopenedwindowhandle.retrv(i,4).replace(/[ ]*,[ ]*/g, "," + (i+1) + "+").replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[ ]+/g, "," + (i+1) + "+");
       if (tt!='')
       {
          tt  = (i+1) + '+'+tt; 
          if (s!='') s += ",";  
          s+=  tt;
       }
       tt = justopenedwindowhandle.retrv(i,5).replace(/[ ]*,[ ]*/g, "," + (i+1) + "-").replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[ ]+/g, "," + (i+1) + "-");
       if (tt!='')
       {
          tt  = (i+1) + '-' + tt;
          if (s!='') s += ",";  
          s +=  tt;
       }
   }
    

   for (i=0; i < 4; i++)
      justopenedwindowhandle.setv(i, 3, s);
}

function redo(mat)
{
   if (mat==null || mat.length==0 || mat[0].length < 5)
   {
      myprompt(f.rdap.options[f.rdap.selectedIndex].value + " not exist");
       
      return;
   }
   var i,j;

   var arr = mat[0][3].split(",");
   var v = new Array(8);
   for ( i=0; i < 8; i++) v[i]='';
   for (var k=0; k < arr.length; k++)
   {
      i = parseInt(arr[k].charAt(0))-1;
      j = (arr[k].charAt(1)=='+')?0:1;
      v[i*2 + j] += ","+arr[k].substring(2);
   }
    
   for ( i=0; i < 8; i++)
   {

      var x = v[i];
      if (v[i]!='')
         v[i] = v[i].substring(1);
      var ii = Math.floor(i/2);
      var jj = 4+(i%2);
      mat[ii][jj] = v[i];
       
   }
}
function setOptions(j,s)
{
   options[j] = s;
   f.options.value = s;

}
function getOptions()
{
   var jj = f.rdap.selectedIndex;
   if (jj==0 || jj==-1)
   {
        return options[jj];
   }
   return '';
}
document.body.style.overflowX="hidden";


function passfieldname(fn)
{
   
   if (fn==null || fn=='NULL')
   {
       
       if (formats[f.rdap.selectedIndex]=='Update')
       {
           var r = new RegExp(/\?\?[a-z]+\?\?/i);
           var k = 0;
           var x = '';
           while (true)
           {
               var m = r.exec(f.query.value.substring(k));
               if (m == null) break;
               var y = m.toString().replace(/\?/g, '');
               if ((","+x + ",").indexOf("," + y + ",") < 0)
               {
               if (x!='') x +=',';
               x += m.toString().replace(/\?/g, '');
               }
               k += m.index + m.toString().length;
           }
           return x;
       }
       else
           return fieldnames[f.rdap.selectedIndex];
   }
   fieldnames[f.rdap.selectedIndex] = fn;
   if (bufferedaction!='')
   {
      eval(bufferedaction);
      bufferedaction = '';
   }
   else
       myprompt(fn);
}
var txtbeing;
var processi;
var spacestr = " \r\n";
function passctypes()
{
    var x = passfieldname().split(/,/);
    var y = '';
    for (var j=0; j < x.length; j++)
    {
        var q = f.query.value;
        var k = q.indexOf(x[j] + "_");
        var l = q.indexOf(",",k); if (l == -1) l = 1000;
        var l1 = q.indexOf(" ",k);if (l1 == -1) l2 = 1000;
        var l2 = q.indexOf("\n",k);if (l2 == -1) l2 = 1000;
        if (l1 < l) l = l1;
        if (l2 < l) l = l2;
        k += x[j].length + 1;
        var z = q.substring(k, l);
        
        z = z.replace(/[a-z][a-z]+$/,'').replace(/_$/,'');
        if (y!='') y += ",";
        y += z;
    }
    return y;
}
function chartype(c)
{

   if (c==spacestr.charCodeAt(0)||c==spacestr.charCodeAt(1)||c==spacestr.charCodeAt(2))
      return 1;
   else if (c >= 65 && c <=90 
         || c >= 97 && c<= 122
         || c >= 48 && c<=57
         || c==46) return 2;
   else if (c >= 33 && c <=47 
         || c >=58  && c<= 64
         || c>=91   && c<=96
         || c>=123  && c<=127)
      return 4;
   else return 3;
}
function readtoekn()
{
   var oldi  = processi;
   if (processi == txtbeing.length) return null;
   var c = txtbeing.charCodeAt(processi);
   for (var j=1; j < 4; j++)
   { 
     while (chartype(c)==j)
     { 
        if (  processi  == txtbeing.length -1 ) 
        { 
           processi++;  
           return txtbeing.substring(oldi);
        }
        c = txtbeing.charCodeAt(++processi);
     }
     if (processi > oldi)
        return j;
   }
   processi++;   // puntuation
   return 4;
}
function checksyntax(j)
{
   
}

function validatesearch()
{

      if (f.format.selectedIndex >=0  &&
          f.format.options[f.format.selectedIndex].value == 'Search')
      {


      var reg = [new RegExp(/[ |\n]LIKE[ |\n][^_]+_s/i),
                 new RegExp(/_s_[0-9]+\?\?%/i),
                 new RegExp(/_s\?\?%/i)];
      for (var z =0; z < 3; z++)
      { 
      var m =reg[z].exec(textareaarray[0].value);

      if (m != null)
      {

      var str1 = '' + m;
      var i = m.index + str1.length - 2;
      if (z>0) i = m.index - 1;
      var k=i-1;
      while (k>0 && chartype(textareaarray[0].value.charCodeAt(k))==2) k--;
      str1 = textareaarray[0].value.substring(k+1,i+3);
      thecurrentareabesearch = 0;
      f.old.value = str1;
      str1 = ( "<b>" + str1 + "</b> can be with LIKE and %. Use '=' instead");
      return str1;
      }

      }
      var xx = textareaarray[0].value.replace(/\(\(\([^\)]+\)\)\)/g,'');
      i= xx.indexOf("_s");
      if (i==-1) i = xx.indexOf("_S");
      if (i>0)
      {
         k=i-1;
         while (k>0   && chartype(xx.charCodeAt(k))==2) k--;
         str1 = xx.substring(k+1,i+2);
         thecurrentareabesearch = 0;
         f.old.value = str1;
         str1 = ("<b>" + str1 + "</b> needs to be enclosed by ((( )))");
         return str1;
      }

      }
      return "";
}
fill();
function getfele(j)
{
    var x = parent.frames[0].ele(0,j).parentNode.parentNode.parentNode.parentNode.parentNode;
    if (x.tagName.toLowerCase()!='tr') x = x.parentNode;
    return x;
}
function modifylabel()
{
//'名称','标题','数据库','JScript ','预处理','后处理','格式','询问','谁用询问','加入','谁用插值','更新','谁用更新','删除','谁用删除','帮助','辅助工具'
var reor = [0,1,7,9,11,13,15,6, 8, 10, 12, 14, 16,3, 4, 5];
for (var i=0; i < reor.length; i++)
    getfele(i).cells[0].childNodes[0].innerHTML = "<nobr><b>" + allabels[reor[i]] + "</b></nobr>";
getfele(16).cells[0].childNodes[0].innerHTML = "<nobr><b>" +  textmsg[1298]   + "</b></nobr>";
var row17 = getfele(17);
row17.cells[0].childNodes[0].innerHTML = "<nobr><b>" +  textmsg[1298]  + "</b></nobr>";
var row19 = row17.nextSibling.nextSibling; 
row19.cells[0].childNodes[0].innerHTML ="<nobr><b>" +  textmsg[1299]  + "</b></nobr>";

row19.cells[2].innerHTML = "<input type=checkbox style=\"border:1px #b0b0b0 solid\"  id=regex19>";
var row18 = row17.nextSibling; 
row18.cells[0].colSpan = 1;
row18.cells[0].innerHTML = row19.cells[0].innerHTML;

row18.cells[0].childNodes[0].innerHTML ="<nobr><b>" +  textmsg[1300]  + "</b></nobr>";
var c0 = row18.cells[0];
c0.childNodes[0].innerHTML ="<nobr><b>" +  textmsg[1300]  + "</b></nobr>";
c0.style.cssText = row19.cells[0].cssText;
c0.childNodes[0].style.cssText = row19.cells[0].childNodes[0].cssText;
c0.childNodes[0].style.color = '#DDCC11';
var c1 = row17.nextSibling.insertCell(-1);
c1.align = 'center';

var c2 = row17.nextSibling.insertCell(-1);
c1.innerHTML =   row19.cells[1].innerHTML;
c1.childNodes[0].style.color = '#DDCC11';
c1.childNodes[0].style.fontSize = '16';
c1.childNodes[0].style.textAlign = 'center'; 
c1.childNodes[0].innerHTML =   row19.cells[1].childNodes[0].innerHTML;
c2.innerHTML =   "<input type=checkbox style=\"border:1px #b0b0b0 solid\" id=regex18>";
 
fillopts(parent.frames[0].ele(0,7), document.thisform.format.innerHTML);
var yy = document.thisform.format.options[0].text;
 
fillopts(parent.frames[0].ele(0,8), "<option value=0 selected>" + yy +"</option>" + document.thisform.rolesel.innerHTML);
fillopts(parent.frames[0].ele(0,9), "<option value=0 selected>" + yy +"</option>" + document.thisform.insertrolesel.innerHTML);
fillopts(parent.frames[0].ele(0,10), "<option value=0 selected>" + yy +"</option>" + document.thisform.updaterolesel.innerHTML);
fillopts(parent.frames[0].ele(0,11), "<option value=0 selected>" + yy +"</option>" + document.thisform.deleterolesel.innerHTML);

for (var i=8; i < 12; i++)
{    
    getfele(i).cells[1].innerHTML = "<nobr><b>&supe;</b></nobr>";
    getfele(i).cells[1].style.fontSize = '14px';
}
document.thisform.format.options[0].text = textmsg[16];

    myfontname = localStorage['myfontname'];
    if (myfontname==null) 
    {
         if (typeof(defaultfontfamily)!='undefined')
         {
            myfontname = defaultfontfamily;
         }
         else
         {
            myfontname = 'times';
         }
    }
   parent.frames[0].unifonts(document.body, myfontname); 

}
var myfontname = 'times';

function fillopts(sel, s)
{
     
    var ss = s.replace(/\r/g,'').replace(/\n/g,'').split(/<.option>/i);
    for (var i=0; i < ss.length; i++)
    {
        if (ss[i].replace(/ /g,'') == '') continue;
        var v = ss[i].replace(/.*value=([^>]+).*/i, '$1').replace(/[ ].*/g,'').replace(/"/g,'');
        
        var t = ss[i].replace(/[^>]*>/,'');
         
        if (t == '') continue;
        sel.options[i] = new Option(t,v);
    }
    sel.selectedIndex = 0;
}
var viewway = 'innertable';
function switchview()
{
    if (viewway == 'innertable')
        viewway = 'form';
    else
        viewway = 'innertable';
    display();
}
function getwhichview(){return viewway;}

onload = modifylabel;


}
