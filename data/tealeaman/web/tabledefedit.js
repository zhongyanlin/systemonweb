/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
function makebutline(bcolor, captionstr, explainstr)
{
   return "<tr><td valign=top> <input class=" + bcolor +" style=color:white;width:60px;font-weight:680 type=button value=\""+captionstr+"\"></td><td>"+explainstr+"</td></tr>";
}
function dim(w,h)
{
    return "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=" + w +",height=" + h +",left=" + ((screen.width-w)/2) +",top=" + ((screen.height-h)/2);
}

tablename = tablename.replace(/\?\?wcds\?\?/,'');
var needselectonly = (queryname!='' && numRows != 0);
var dim0 = dim(340,300);
helpstr +="<br><br><b><font color=purple>"+textmsg[51]+"</font></b><br><table>";
//helpstr += makebutline("#00CCCC", textmsg[415], textmsg[414]);
if (queryname=='')
{
   helpstr += // makebutline("#00CCCC", textmsg[410], textmsg[411])
             makebutline("GreenButton", textmsg[412], textmsg[414])
           + makebutline("RedButton", textmsg[237], textmsg[238])
           + makebutline("OrangeButton", textmsg[67], textmsg[239])
           + makebutline("BlueButton", textmsg[240], textmsg[241]);
}
else
{
    helpstr += makebutline("GreenButton", textmsg[67], textmsg[413]);
}
 
helpstr +="</table>";
 
document.form1.check.value = checks;  

for (var z = 0; z < numRows; z++)
{ 
   refill(z);
}
populate(true);

function setn(n){nn=n;}

function refill(z)
{
  var ts = ele(z,8);
  var ii = ts.selectedIndex;
  var va = ele(z,9);
  var yy = retrv(z,9); 
  if (yy == nullvalue[9]) yy = mat[z][9];
  
  var j; 
  for ( kk= va.options.length-1; kk >=1; kk--)
     va.options[kk] = null;

  if ( ii >  0 )
  {
  var u = ts.options[ii].value; 
  for (var i = 0; i < numtables && u != tables[i]; i++); 
  if ( i == numtables ) return;
  for ( j = 1; j <=  numfields[i]; j++)
     va.options[j] = new Option( tfields[i][j-1], tfields[i][j-1]);
  for (j = 1; j <  numfields[i] && yy != va.options[j].value; j++);
  if (j >= numfields[i])  
      j = 0;
  va.selectedIndex = j;
  }
}

var sep = ';';
function createtable()
{
   rowInvolves = '0';
   var nm ;
   var sct = "CREATE TABLE " + tablename + " (\n";
   var i, j;
   for (i =0; i < NUMROWS; i++)
   {
      nm  =    retrv(i,1);
      if (nm  == nullvalue[1] ) 
          continue;
      sct += nm  + " " + formline(i) + ",\n";
   }
    
   var nr = new Array(NUMROWS);
  
   var sus = "";
   for ( i = 0; i < NUMROWS; i++)
   {
      var elem = ele(i,7);
      nr[i] = elem.checked;
      if (nr[i] == '1')
      {  
         elem = ele(i,1) ;
         sus += ',' + elem.value  ;
      }
   }
   if (sus != '') 
       sct += "PRIMARY KEY (" + sus.substring(1) + "),\n";
   
   var nt = new Array(NUMROWS);
   for ( i = 0; i < NUMROWS; i++)
   {   
       nt[i] =    retrv(i,8);
   }

   var nf = new Array(NUMROWS);
   for ( i = 0; i < NUMROWS; i++)
   {
      var elem = ele(i, 9); 
      var jj = elem.selectedIndex;
      if (jj >= 0)
        nf[i] = elem.options[jj].value; 
   }
  
   for (var k = 0; k < numtables; k++)
   {   
       var fl = new Array(10);
       var kl = new Array(10);   
       for (var kk =0; kk < 10; kk++) fl[kk] = kl[kk] = ''; 
       for (i = 0; i < NUMROWS; i++)
       {
          if (tables[k] == nt[i])
          {
             for (var kk = 0; kk < 10; kk++)
             if ( kl[kk].indexOf("," + nf[i]) == -1)
             { 
                kl[kk] += ',' + nf[i];  
                fl[kk] += ',' + ele(i,1).value;  
                break;
             }
          }
       }
       for (var kk =0; kk < 10; kk++)
       if (kl[kk] != '')
       {
           sct += "FOREIGN KEY (" + fl[kk].replace(/,/,'') + ") REFERENCES " + tables[k] + kl[kk].replace(/,/, '(') + "),\n";
       }
    }
   
    if (document.form1.check.value != null && document.form1.check.value.replace(/\s/g,'') != '')
        sct +=  document.form1.check.value + ",\n";
    
    var ll = sct.length;
    sct = sct.substring(0, ll - 2) + "\n)";

    return sct;
}

var dbinfo = parent.frames[0].passdbinfo().toUpperCase();

function formline(i)
{
   var nm = new Array(7);
   for (var j = 2; j < 7; j++)
       nm[j] =   retrv(i,j);
   if (nm[2] == nullvalue[2]) nm[2] = 'INTEGER';
   var x = nm[2] + " ";
   if (nm[3] !=null && nm[3]!='') 
       x += '(' + nm[3].replace(/ /g,'') + ')';
   
   var datatype = retrv(i,2);
   var tt = 0; 
   for (;tt < options[2].length && options[2][tt]!=datatype;tt++); 
   
   if (ele(i,5).checked &&  dbinfo.indexOf("ACCESS") < 0 ) 
      x += ' UNIQUE ';
   if (ele(i,4).checked == false) 
      x += ' NOT NULL ';
   if (nm[6] != null && nm[6] != 'NULL') 
   {
      if ( tt <= 5)
      { 
          if (nm[6] !=''&&  dbinfo.indexOf("ACCESS") < 0)   
              x += ' DEFAULT ' + nm[6];
      }
      else if ( tt <= 7 &&  dbinfo.indexOf("ACCESS") < 0 )
      {
          x += " DEFAULT '" + nm[6].replace(/'/g, "''") + "' ";
      }
   }
    
   return x;
}
 
function modify()
{
   rowInvolves = '';
   var j = 0;
   var sqlstr= '';
   for (var i = 0; i < numRows; i++)
   { 
      for (j = 1; j < 7 && (retrv(i,j) == mat[i][j] || j==3&&retrv(i,j)==''&&mat[i][j]==null); j++);
      if (j == 7) continue;
 
      if (retrv(i,1)==nullvalue[1])
           sqlstr += "ALTER TABLE " + tablename + " DROP COLUMN " +  mat[i][1] +   sep;  
      else if (retrv(i,1)!=mat[i][1])
      {  
          
          if ( dbinfo.indexOf("ACCESS") >= 0)
               sqlstr += "ALTER TABLE " + tablename + " ALTER COLUMN " + mat[i][1] + " TO " + retrv(i,1);
          else if (dbinfo.indexOf("MYSQL") >= 0)
               sqlstr += "ALTER TABLE " + tablename + " CHANGE COLUMN " + mat[i][1] + " " + retrv(i,1)+ ' ' + formline(i);
          else
               sqlstr += "ALTER TABLE " + tablename + " RENAME COLUMN " + mat[i][1] + " TO " + retrv(i,1);
          for (j = 2; j < 7 && retrv(i,j) == mat[i][j]; j++);
          if (j < 7)  
          {
               if (  dbinfo.indexOf("ACCESS") < 0)
                   sqlstr +=   "; ALTER TABLE " + tablename + " MODIFY COLUMN " + retrv(i,1) + ' ' + formline(i);
               else
                   sqlstr +=   "; ALTER TABLE " + tablename + " ALTER COLUMN " + retrv(i,1) + ' ' + formline(i);

          }
          sqlstr +=  sep;
          
      }
      else
      {
          if (  dbinfo.indexOf("ACCESS") < 0)
               sqlstr += "ALTER TABLE " + tablename + " MODIFY COLUMN " +  mat[i][1] + ' ' + formline(i) + sep;
          else
               sqlstr += "ALTER TABLE " + tablename + " ALTER COLUMN " +  mat[i][1] + ' ' + formline(i) + sep;
      }
      if (rowInvolves == '') 
         rowInvolves += i;
      else 
         rowInvolves += ',' + i;
       
   }
   for (var i =  numRows; i < NUMROWS;  i++)
   {
      if (retrv(i,1)!=nullvalue[1])  
      {
          if (  dbinfo.indexOf("SQL Server") < 0)
           sqlstr += "ALTER TABLE " + tablename + " ADD COLUMN " + retrv(i,1)  + ' ' +  formline(i) + sep;
         else 
           sqlstr += "ALTER TABLE " + tablename + " ADD  " + retrv(i,1)  + ' ' +  formline(i) + sep;
         if (rowInvolves == '') 
            rowInvolves += i;
         else 
            rowInvolves += ',' + i;
      }
   }
   var nf = ''; 
   var kp = '';
   var cp = false;
   var okc = 0;
   var ll = -1;
   for (var i = 0; i < NUMROWS;  i++)
   {
      if (retrv(i,7) != mat[i][7]) 
      { 
         if (ll != -1) ll = i;
         cp = true;
      }
      okc += mat[i][7];
      if (ele(i,7).checked)
         kp += "," + ele(i,1).value;
   }
   if ( cp)
   { 
       if (okc>0) sqlstr += "ALTER TABLE " + tablename + " DROP PRIMARY KEY " + sep;
       sqlstr += "ALTER TABLE " + tablename + " ADD PRIMARY KEY "  + kp.replace(/,/, "(") + ")" + sep;
       if (rowInvolves == '') 
         rowInvolves += ll;
      else 
         rowInvolves += ',' + ll;
   }

   return sqlstr;
}

var execase = 0;
function exec()
{  
    if (haskey()) goexec();
    else
     myprompt(textmsg[103] + ". " + textmsg[66] +"?", null, "if(v)goexec()");
}

function goexec()
{
    if (!exists)
    {
      definition = createtable();
      document.thisform.wcds.value = definition;
      whichaction = 'cret';
      prompt1(textmsg[237], definition, 'cret');
    }
    else
    {
      document.thisform.wcds.value = modify();
      whichaction = 'upda';
      definition = createtable();
      prompt1(textmsg[793], document.thisform.wcds.value,'upda');

    }
    
}
 
function goahead(modified,sv)
{  
   if (sv=='save')
   {
     if ( modified == null)  
     {
        return;
     }
     else
     {
       var  rl = fromSelect(document.form1.rolesel,true);
       document.thisform.wcds.value = 
       "INSERT INTO Apptables(tname, definition, roles) VALUES ('" 
       + tablename 
       + "','" 
       + modified.replace(/'/g, "''") 
       + "'," + rl +")|"  
       + " UPDATE Apptables SET roles=" 
       + rl 
       + ", definition='" 
       + modified.replace(/'/g, "''") 
       + "' WHERE tname='" 
       + tablename + "'";
       whichaction = 'savesql';
      
       submitform();
     }
   }
   else if( sv=='cret' || sv == 'upda')
   {
     if ( modified == null)  
     {
       document.thisform.wcds.value = '';
       return;
     }
     else
     {
       document.thisform.wcds.value = modified;
       if (whichaction=='cret') definition = modified;
       submitform();
     }
   }   
   else if(sv == 'all')
   {
       if ( modified != null)
       {
       document.f2.target = "w" + tstmp;
        
       visual(document.f2);
document.f2.submit();
       }
   }
}

function submitform()
{
    if (document.thisform.wcds.value == '') return;
    
    document.thisform.iid.value = iid;
    document.thisform.target =    "w" + tstmp;
    formnewaction(document.thisform );
    delaction = false;
    visual(document.thisform);
document.thisform.submit();
}
  
function refreshindex()
{
    whichaction = '';
   parent.frames[0].open('tableindex.jsp','leftwintb');
  
}
function haskey()
{
   
   for ( var i = 0; i < NUMROWS; i++)
   {
      var elem = ele(i,7);
      if (elem.checked  )
         return true;
   }
   return false;
}
var winhandle = null;
function doforall()
{
   prompt1(textmsg[237] + "?",'','all');
}

function updatedef()
{
   definition = createtable();
   document.f2.t.value = "UPDATE Apptables SET definition='" +
      definition.replace(/'/g, "''") + "' WHERE tname='" + tablename +"'";
}
function prompt1(hints, initstr, sv)
{

   var actn = "";
   if ( sv!='save')
       actn = textmsg[237]; 
   else 
       actn = textmsg[67];
   var msg = "<center><b>" + hints  + "</b>(" + textmsg[794] +")";
   if (sv=='all')
       msg += "&nbsp;&nbsp; <a href=\"javascript:updatedef()\">Updatedef</a>";
   msg += "<br><form rel=opener name=f2 method=post action=follows.jsp  ><textarea name=t cols=55 rows=20>" + initstr  +
    "</textarea><input type=hidden name=x value=doforall><br><table cellpadding=0 cellpadding=0><tr>";
   if (sv=='all')
       msg += "<td><input type=checkbox name=include value=i checked></td><td nowrap=nowrap>Include System DB</td>";
   else if (sv=='save')
       msg += "<td colspan=2><input type=hidden name=owner value=\"" + owner +"\"></td>";
   msg += "<td  class=buttono  align=center nowrap=onwrap onclick=\"goahead(document.f2.t.value,'" + sv + "')\">" + actn +"</td>"
   + "<td class=buttong  align=center nowrap=onwrap   onclick=\"goahead(null,'" + sv + "');closethis()\">" +  textmsg[18] + "</td></tr></table>"
   + "</form>";
   if (promptwin==null)
   {
       myprompt(msg);
       setRoundedWidth(promptwin, 400);
       promptwinfit();
   }
   else
      promptwin.innerHTML = msg;
}
function closethis()
{
   if (promptwin!=null)
   {
      document.body.removeChild(promptwin);
      promptwin = null;
   }
}
function save()
{
    if (haskey()) 
       gosave();
    else
       myprompt(textmsg[103] + ". " + textmsg[66] +"?", null, "if(v)gosave()");
}

function gosave()
{
    rowInvolves == '0';
    definition = createtable();
    var  rl = fromSelect(document.form1.rolesel,true); 
    owner = rl;
    prompt1(textmsg[792] , definition, 'save');
}
 
function defaultControl()
{
    for (var i = 0; i < NUMROWS; i++)
    {
        if (mat[i][10] != nullvalue[10]) continue;
        var ctl = retrv(i,1);
        if (ctl == '') continue;
        ctl = capitalize( ctl.replace(/[^\.]+\./,''));
        if (ctl == 'lastupdate') continue;
         
        var datatype = retrv(i,2);
        var tt = 0; for (;tt < options[2].length && options[2][tt]!=datatype;tt++);
       var length = retrv(i,3);
       if (length == null) length = "8_0";

       var tb = retrv(i,8);

       var ff = retrv(i,9);
        
        
        if (tb != nullvalue[8] && ff != nullvalue[9]) 
        {
            ctl += "_s";
        }
        else
        {
            if (tt >= 8) 
                ctl += "_a";
            else if (tt>=6)
            {
               if (ctl.indexOf("Photo")>=0)
                 ctl += "_u_" + length;
               else
                 ctl += "_t_" + length;
            }
            else if (tt == 2)
               ctl += "_m";
            else if (tt == 0 )
               ctl += "_c";
            else   
            {   ctl += "_n"; if (length!='') ctl+="_" + length;}
        }
         setv(i,10,ctl);
         mat[i][10] = ctl;

     }
}

function genaccess(btn)
{
    var vl = null; 
    if (btn!=null) vl = btn.innerHTML.replace(/\s/g,'');
 
    defaultControl();
    if (haskey() || vl==textmsg[67])
       gogenaccess();
    else
       myprompt(textmsg[103] + ".<br>" + textmsg[903] + ". " + textmsg[66] +"?", null, "if(v)gogenaccess()");
}

function gogenaccess()
{

    var query = "SELECT ";
    var entry = "SELECT ";
    var search = "WHERE "; 
    var updateQuery = "UPDATE " + tablename + " SET ";   
    var where  = "";
    var alltables = tablename.split(','); 
    var inserts1 = new Array(alltables.length);
    var inserts2 = new Array(alltables.length);
    var l = 0;for ( l=0; l < alltables.length;l++)
    {
     inserts1[l] = "INSERT INTO " + alltables[l]+ "(";
     inserts2[l] = " VALUES(";
    }
    var more = '';
    
    var defaultc = "";
    var mandatory = "";
    for (var i = 0; i < NUMROWS; i++)
    {
        var em;
        var ctl = retrv(i,10).replace(/ /g,'');  
        
        var jj = ctl.indexOf("_"); 
        if (jj == -1) jj = ctl.length;
        var label = ctl.substring(0,jj);
        
        var fieldname = retrv(i,1);  
        l=0;while(l<alltables.length && fieldname.indexOf(alltables[l]+".")!=0) l++;
        if (l==alltables.length) l =0;
        if (fieldname == null || fieldname == '' || fieldname == 'lastupdate') continue;
        var datatype = retrv(i,2); 
        var din = 0; for (; din < options[2].length && options[2][din]!=datatype; din++);
        var sq = '';
        if (din >= 6)
           sq = "'";
        var length = retrv(i,3);
        var defaultv = retrv(i,6);
        em = ele(i,4);
        var nulliable = em.checked;
        var excliam = ''; 
        if (nulliable==false) excliam = '1';
        if (defaultv == nullvalue[6]) 
        {  
           if (sq == "'") 
              defaultv = ''; 
           else  
              defaultv = "''";
        }
        else if (fieldname != '') defaultc += label + ',' +  excliam + ','+ defaultv +"\n";
        
        if (nulliable==false && fieldname != '')
             mandatory += capitalize(fieldname) + "=!\n";
        
        em = ele(i,7);
        var pk = em.checked;
        var tb = retrv(i,8);
        var ff = retrv(i,9);
     
        if (ctl != '') 
        {
            if (fieldname!='')
            {
               if (fieldname.indexOf(".")>0)
                    query +=   fieldname + " AS " + ctl +",";
               else
                    query += alltables[l] +"."+ fieldname + " AS " + ctl +",";
            }
            else
               query += sq + defaultv + sq + " AS " + ctl +",";
        }
        if (defaultv=='' && sq=='') defaultv='0';
        if (ctl != '' && fieldname != '') 
           entry += sq + defaultv + sq + " AS " + ctl+",";
        var tail = '';
        if (tb != null && tb != '' && tb != 'NULL' && ff != null && ff !='') 
        {
            more += "\n\nSELECT DISTINCT " + ff + " FROM " + tb;
           // tail = "s,";
        }
        
        if (ctl != '' && fieldname != '') 
        {
           updateQuery += fieldname + "=" + sq + "$$" + label + "$$" + sq + ",";
           if (ctl.indexOf("_s")>0||ctl.indexOf("_S")>0)
                 search += "(((" + fieldname + " = "  + sq  + "??" + ctl.replace(/_[s|S].*$/, '_s_10') +"??"  + sq +"))) AND ";
           else if (sq == '')
           {
              search += fieldname + " >= "   + "??" + ctl.replace(/_[n|m|N|M].*$/, '_n_5') +"??" +" AND " 
                     +  fieldname + " <= "   + "??" + ctl.replace(/_[n|m|N|M].*$/, '1_n_5') +"??" +" AND ";
           }
           else
           {
              search += fieldname + " LIKE " + sq + "%??" + ctl.replace(/_[t|a].*$/, '_t_10').replace(/_t.*$/, '_t_10') +"??%" + sq +" AND ";
           }
        }
        if (pk) where += fieldname + "=" + sq + "||" + label + "||" + sq + " AND ";
        
        inserts1[l] += fieldname.replace(/[^\.]+\./,'') + ",";
        if (ctl != '') 
           inserts2[l] += sq + "@@" + label + "@@" + sq + ",";
        else
           inserts2[l] += sq + defaultv +sq + ",";
     }

     search = search.substring(0, search.length-5);
     where = where.substring(0, where.length - 4);
     entry = entry.substring(0, entry.length - 1) ;
     var insert1='', insert2='';
     
     query = query.substring(0, query.length - 1) + " FROM " + tablename + more;  

     updateQuery = updateQuery.substring(0, updateQuery.length - 1) + " WHERE " + where;
     var insertQuery = '';//  insert1 + insert2 + '\n\n' + defaultc;
     for ( l = 0; l < alltables.length; l++)
     {
        insertQuery += inserts1[l].replace(/,$/, ") ") + inserts2[l].replace(/,$/, ")");
        if (l < alltables.length - 1) insertQuery +=' # ';
     }
     insertQuery += '\n\n'  ;
     var deleteQuery = "DELETE FROM " + tablename + " WHERE " + where;
    
     if (document.form1.whereclause.value!='')
     {   
         if (where=="")
         { query  =  query.replace(/ WHERE $/,'') + " WHERE " + document.form1.whereclause.value;
           updateQuery  =  updateQuery.replace(/ WHERE $/i,'') + " WHERE " + document.form1.whereclause.value;
           deleteQuery  =  deleteQuery.replace(/ WHERE $/i,'') + " WHERE " + document.form1.whereclause.value;
         }
         else
          { 
           query  = query.replace(/ AND $/,'') + " AND " + document.form1.whereclause.value;
           updateQuery = updateQuery.replace(/ AND $/,'') + " AND " + document.form1.whereclause.value;
           deleteQuery = deleteQuery.replace(/ AND $/,'') +" AND " + document.form1.whereclause.value;
         }
     }
     
     if (where == "" && document.form1.whereclause.value=='')
     { 
         myprompt(textmsg[103]);
         updateQuery = '';
         deleteQuery = '';
     }

     query =  query.replace(/ AND $/,'').replace(/ WHERE $/,'');
     updateQuery =  updateQuery.replace(/ AND $/,'').replace(/ WHERE $/,'');
     deleteQuery =  deleteQuery.replace(/ AND $/,'').replace(/ WHERE $/,'');

     var rdapname11 =  tablename +" Data View/Update";
     if (queryname!=null && queryname!='')
         rdapname11 = queryname;
     var format = "Table";
     var rdapname22 =  tablename.replace(/'/g,"''") +" Data Search";
     var help = defaultc;
     var  rl = fromSelect(document.form1.rolesel,true);
     if (needselectonly){insertQuery = updateQuery = deleteQuery ='';}
     var sql  = "UPDATE Task SET query='" + query.replace(/'/g, "''")
          + (needselectonly?"": ("', insertQuery='"
          + insertQuery.replace(/'/g, "''") + "', updateQuery='" 
          + updateQuery.replace(/'/g, "''") + "', deleteQuery='" 
          + deleteQuery.replace(/'/g, "''") + "', format = '" + format ))
          + "' WHERE name='" + rdapname11
          + "'|"
          + "INSERT INTO Task(name, title, query, insertQuery, updateQuery, deleteQuery, webService, format, help, roles, insertroles, updateroles, deleteroles,permits,options) VALUES ('" + rdapname11 + "','" + rdapname11 + "','"
          + query.replace(/'/g,"''") + "','" + insertQuery.replace(/'/g,"''")+"','" + updateQuery.replace(/'/g,"''") + "','" + deleteQuery.replace(/'/g,"''") + "','','"
          + format.replace(/'/g,"''") + "','"  + help.replace(/'/g,"''") + "'," + rl +"," + rl + "," + rl +"," + rl +",'','')" + sep;
      if (needselectonly==false)
      sql += "UPDATE Task SET  query='" + search.replace(/'/g, "''") + "', updateQuery='"
          + "DataTable" + "', deleteQuery='" 
          + "" + "', format = '" + "Search"  
          + "' WHERE name='" + rdapname22 + "'|"
          + "INSERT INTO Task(name, title, query, insertQuery,updateQuery, deleteQuery, webService, format, help,roles, insertroles, updateroles, deleteroles,permits,options) VALUES ('" +rdapname22 + "','" + rdapname22 + "','"
          + search.replace(/'/g,"''") + "','" + mandatory +"','" + "DataTable?rdap=" + "','" + "" + "','','"
          + "Search" + "','"  + help.replace(/'/g,"''") + "'," + rl +"," + rl + "," + rl +"," + rl  +",'','')" + sep;

      var tmp = query;
      if (needselectonly==false)
          tmp = "<h1>Data View/Update</h1><FONT color=red>SELECT QUERY:</FONT><br>" +query 
              + "<br><FONT color=red>UPDATE QUERY:</FONT><br>" + updateQuery +"<br><FONT color=red>INSERT QUERY:</FONT><br>"  + insertQuery.replace(/\n\n/,'<br><font color=red>DEFAULT VALUES:</font><br>') +"<br><FONT color=red>DELETE QUERY:</FONT><br>" + deleteQuery;

     if (queryname==null || queryname=='')
     {
      query = entry + more;
      updateQuery =  '';//  insert1 + insert2 + '\n\n' + defaultc;
      for ( l = 0; l < alltables.length; l++)
      {
        updateQuery += inserts1[l].replace(/,$/, ") ") + inserts2[l].replace(/,$/, ")");
        if (l < alltables.length - 1) updateQuery +=' # ';
      }
     
      rdapname11 =  tablename.replace(/'/g, "''") + " Data Entry";
      
      insertQuery = "\n\n" + mandatory;
      format = "Form";
     
      sql += "UPDATE Task SET title='" + rdapname11 + "', query='" + query.replace(/'/g, "''") + "', updateQuery='"
          + updateQuery.replace(/'/g, "''") + "', deleteQuery='" 
          + deleteQuery.replace(/'/g, "''") + "', format = '" + format  
          + "' WHERE name='" + rdapname11 + "'|"   
          + "INSERT INTO Task(name, title, query, insertQuery,updateQuery, deleteQuery, webService, format, help,roles, insertroles, updateroles, deleteroles,permits,options) VALUES ('" +rdapname11 + "','" + rdapname11 + "','"
          + query.replace(/'/g,"''") + "','" + mandatory +"','" + updateQuery.replace(/'/g,"''") + "','" + deleteQuery.replace(/'/g,"''") + "','','"
          + format + "','"  + help.replace(/'/g,"''") + "'," + rl +"," + rl + "," + rl +"," + rl  +",'','')";
     }

     var tmp1 = "<h1>Data Entry</h1><FONT color=red>SELECT QUERY:</FONT><br>"+query +"<br><FONT color=red>UPDATE QUERY:</FONT><br>" + updateQuery +"<br><FONT color=red>INSERT QUERY:</FONT><br>" + insertQuery.replace(/\n\n/,'<font color=red>MANDATORY FIELDS:</font><br>') +"<br><FONT color=red>DELETE QUERY:</FONT><br>" + deleteQuery;
     
     var tmp2 = "<h1>Data Search</h1><FONT color=red>WHERE ClAUSE:</FONT><br>"+search;

     document.thisform.wcds.value = sql; 
     whichaction = 'genaccess';
     myprompt("<div style=\"overflow:auto;width:500px;background-color:white;border:1px purple solid;font-size:15px\"><pre>"
        + tmp.replace(/,/g,',\n').replace(/ AND /g,'\nAND ') + "</pre>"
        + ((queryname!='')?"":"<br><pre>" + tmp1.replace(/,/g,',\n').replace(/ AND /g,'\nAND ') + "</pre>")
        + ((queryname!='')?"":"<br><pre>" + tmp2.replace(/,/g,',\n').replace(/ AND /g,'\nAND ') + "</pre>")
        + "</div>",
        null, "if(v)submitform()");
     setRoundedWidth(promptwin, 530);
     promptwinfit();
     promptwin.style.top = "0px";
 
}

function exclusive(z,x,k)
{
   if (x.checked)
   {
       var  elem = ele(z,k);
       elem.checked = false;
   }
}

function capitalize(wd)
{
   if (wd == null || wd == '')
      return wd;
   return wd.charAt(0).toUpperCase() + wd.substring(1);
}

syn = function(x,str,ee)
{  
   if (whichaction.indexOf('genaccess') == 0)
   {
       myprompt(str + "<br>Open Data Access Routine page to edit the routines");
   }
   else if (whichaction.indexOf('save') == 0)
   {   
      if (x.indexOf("-1") < 0)
      {
         for (var i =0; i < numRows; i++) valuechanged[i] = false;
         parent.frames[0].backdef(tablename,createtable());
         myprompt(msg71);
         return 1;
      }
      else
          myprompt(str);
   }
   else if (whichaction == 'cret' || whichaction == 'upda')
   {
      if (x.indexOf("-1") < 0) 
      {
         closeprompt();
         for (i =0; i < numRows; i++) valuechanged[i] = false;
         parent.frames[0].backdef(tablename,createtable());
         exists = true;
         //document.getElementById('bn8').style.visibility = "";
         save();
      }
      else
      {
         if (whichaction == 'cret') 
             document.thisform.wcds.value="";
          myprompt(str);
      }
   }
   else if (whichaction == 'exist')
   {
     exists = (x=='1');
   }
   return 0;
}

function removerows()
{
   var ii = 0;
   for ( ii=0; ii < NUMROWS; ii++)
   {
       if (f1.checkbox[ii].checked)
       {
           for (var j=ii+1; j < numRows; j++)
           {
                if (f1.checkbox[j].checked == false)
                {
                    for (var k = 0; k < numCols; k++)
                    {
                        mat[ii][k]  = mat[j][k];  
                        setv(ii,k,mat[ii][k]); 
                    }
                    f1.checkbox[ii].checked = false;
                    f1.checkbox[j].checked = true;
                    break;
                 }
            }
       }
   }
   var jj = -1;
   for ( ii = 0; ii < numRows; ii++)
   {
      if (f1.checkbox[ii].checked)
       {
           for (var k = 0; k < numCols; k++)
           {
              mat[ii][k] = defaultRecord[k];
              setv(ii,k,nullvalue[k])
              
           }
           if (jj!=-1) jj = ii;
           f1.checkbox[ii].checked = false;
       }
    }
    numRows = jj;
}

function fmove(j)
{
   var kk = 0;
   if (j<0)
   for (var ii=0; ii < NUMROWS; ii++)
   {
       if (f1.checkbox[ii].checked)
       {
          if (fmove1(j,ii) == false) break;
          kk = 1;
       }
   }
   else
   for (ii=NUMROWS-1; ii>=0; ii--)
   {
       if (f1.checkbox[ii].checked)
       {
          if (fmove1(j,ii) == false) break;
          kk = 1;
       }
   }
   if (kk==0) myprompt('Select rows to move');
}

function fmove1(j,ii)
{
   if (ii==NUMROWS)
   { 
       myprompt(textmsg[104]);
       return flase;
   }
   if (ii+j==NUMROWS || j+ii == -1) 
      return false;
   var held, held1;
   
   for (var k = 1; k < numCols; k++)
   {
      held  = mat[ii][k]; 
      held1 = retrv(ii,k);  
      mat[ii][k] = mat[ii+j][k]; 
      setv(ii,k, retrv(ii+j,k));
      mat[ii+j][k] = held;
      setv(ii+j,k,held1);
   }
   f1.checkbox[ii].checked = false;
   f1.checkbox[ii+j].checked = true;
    
   return true;
}

defaultControl();
 
var accessreserved = ",add,all,alphanumeric,alter,and,any,application,as,asc,assistant,autoincrement,avg,between,binary,bit,boolean,by,byte,char,character,column,compactdatabase,constraint,container,count,counter,create,createdatabase,createfield,creategroup,createindex,createobject,createproperty,createrelation,createtabledef,createuser,createworkspace,currency,currentuser,database,date,datetime,delete,desc,description,disallow,distinct,distinctrow,document,double,drop,echo,else,end,eqv,error,exists,exit,false,field,fields,fillcache,float,float4,float8,foreign,form,forms,from,full,function,general,getobject,getoption,gotopage,group,groupby,guid,having,idle,ieeedouble,ieeesingle,if,ignore,imp,in,index,index,indexes,inner,insert,inserttext,int,integer,integer1,integer2,integer4,into,is,join,key,lastmodified,left,level,like,logical,logical1,long,longbinary,longtext,macro,match,max,min,mod,memo,module,money,move,name,newpassword,no,not,note,null,number,numeric,object,oleobject,off,on,openrecordset,option,or,order,orientation,outer,owneraccess,parameter,parameters,partial,percent,pivot,primary,procedure,property,queries,query,quit,real,recalc,recordset,references,refresh,refreshlink,registerdatabase,relation,repaint,repairdatabase,report,reports,requery,right,screen,section,select,set,setfocus,setoption,short,single,smallint,some,sql,stdev,stdevp,string,sum,table,tabledef,tabledefs,tableid,text,time,timestamp,top,transform,true,type,union,unique,update,user,value,values,var,varp,varbinary,varchar,where,with,workspace,xor,year,yes,yesno,";
function notreserved(fieldbox)
{
    if ( accessreserved.indexOf(','+fieldbox.value.replace(/ /g,'').toLowerCase()+',') >= 0 )
    {
        fieldbox.focus();
        myprompt(fieldbox.value + " is reserved");
        return false;
    }
    return true;
} 
function U01(fieldbox,Z,j)
{ 
   if (notreserved(fieldbox)) 
     U(Z,j);
}

function rownum(abox,Z)
{
   if(abox.value!=''+(Z+1))
      abox.value = '' + (Z+1);
}

for (r=0;r<NUMROWS;r++)
   valuechanged[r]=false;

function refreshthis()
{
   myprompt("You will loss unsaved editing. Continue?",null,
       'if(v)parent.frames[0].refresh(tablename)');
}
var oldbutton = null;
function sinkbut(btn)
{
   if (oldbutton!=null) oldbutton.style.borderStyle = "outset";
   btn.style.borderStyle = "inset";
   oldbutton = btn;
   return true;
}
