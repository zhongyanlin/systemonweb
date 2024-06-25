var f1 = null;
if (typeof(document.form1) != 'undefined')
    f1 = document.form1;
datapresentformat = 'DataTable';
var alldatatypesarr = alldatatypes.split(",");
function map2type(s, w, h)
{
   switch(s)
   {
      case 'm': return 2;
      case 'n': if (h==''||h=='0') return 2; return 5;
      case 't': if (parseInt(w) < 256) return 7; return 8;
      case 'a': case 'b': return 8;
      case 's': case 'r': case 'l': case 'i': case 'u': case 'k': case 'h': return 7;
      case 'c':  return 0;
   }
   return 1;
   //'n','m','t','a','s','r','c','b','l','i','u','k','h'
   //"SMALLINT", "INT", "LONG", "INTEGER", "FLOAT", "DOUBLE", "CHAR", "VARCHAR", "MEMO", "LONGCHAR"},
}



function genaccess()
{
    var createtable =   alldatatypesarr[2] +" NOT NULL,";
    var addcolumn = "";
    var modifycolumn = "";
    var primarykey = "";
    var query = "";//n AS " + textmsg[542] + "_h,";
    var entry = "";
    var search = "";
    var updateQuery = "";
    var where  = "";
    var inserts1  = "";
    var inserts2  = " SELECT 1 + MAX(n),";
    var more = '';
    var defaultc = "";  //label=value
    var defaultfv = ""; //field=value
    var mandatory = "";
    var help = "";
    var tail = '';
    var boundstail = '\r\n\r\n\r\n';

    for (var i = 0; i < NUMROWS; i++)
    {
        var format = retrv(i,4);
        if (format == null || format == '')
        {
            if ( i < NUMROWS-1)
            {
                mypromtp('Format can not be blank at ' + i +"-th row");
                return;
            }
            else
            {
                NUMROWS = i;
                break;
            }
        }
        var label = retrv(i,2).replace(/ /g,'');
        
        if (label=='') label = "nolabel" + i;
        var fieldname = retrv(i,1);
        var format = retrv(i,4);
        if (fieldname == 'lastupdate') continue;
        if (fieldname=='')
        {
            var ii = 1;
            while(ii < NUMROWS)
            {
               var kk =0;
               for (kk=0; kk < NUMROWS && retrv(kk,1).replace(/[a-z]/,'')!=''+ii; kk++);
               if (kk < NUMROWS) ii++;
               else break;
            }
            fieldname = format + ii;
            setv(i,1,fieldname);
        }
        var length = retrv(i,5);
        var ht = retrv(i,6);
        var datatypei = map2type(format, length, ht);
        if (fieldname=='n')datatypei = 2;
        var datatype = alldatatypesarr[datatypei];
        var em = ele(i,7);
        var nulliable = !(em.checked);
        
        var innerlen = (2*parseInt(length));
        if (''+innerlen == 'NaN')
           innerlen = 20;
        else if (innerlen > 255) innerlen = 255;
        if (format=='i'||format=='l'||format=='u'||format=='k')
           innerlen = 100;
        //if (newmoditrans=='new')
        {
        createtable += fieldname + " " + datatype;
        if (datatypei==7)createtable += "(" + innerlen +")";
        if (nulliable == false) createtable += " NOT NULL";
        createtable += ",";
        }
        if (newmoditrans=='modify' && i >= numRows)
        {
           addcolumn +=  fieldname + " " + datatype;
           if (datatypei==7)addcolumn+= "(" + innerlen +")";
           if (nulliable == false) addcolumn += " NOT NULL";
           addcolumn += ",";
        }
        if (newmoditrans!='new' && i < numRows &&
           (format!=mat[i][4] ||length!=mat[i][5]
           || em.checked==false&&mat[i][7]=='1' || em.checked&&mat[i][7]!='1' ))
        {
           if (fieldname!='n' && fieldname!='lastupdate')
           {
           modifycolumn += fieldname + " " + datatype;
           if (datatypei==7)modifycolumn+= "(" + innerlen +")";
           if (nulliable == false) modifycolumn += " NOT NULL";
           modifycolumn += ",";
           }
        }

        var sq = (datatypei < 6)? "":"'";
        var defaultv = retrv(i,9);
        
        if (format=='s'||format=='r')
        {
           var jjj = defaultv.indexOf(";");
           more += "\n\n" + defaultv;
           if (jjj==-1)
           {
              if (defaultv.charAt(0)==' ')
                defaultv = '';
              else
                defaultv = defaultv.replace(/^ /,'').replace(/,.*$/,'');
           }
           else
           {
              if (defaultv.charAt(0)==' ')
                defaultv = '';
              else
                defaultv = defaultv.substring(jjj+1).replace(/^ /,'').replace(/,.*$/,'');
           }
        }

        var aaa = defaultv;
        var excliam = '';
        if (nulliable==false) excliam = '!';

        if (defaultv == nullvalue[9])
        {
           if (sq == "'")
              defaultv = '';
           else
              defaultv = "'             '";
           defaultc += label + '=' +  excliam +"\n";
        }
        else   defaultc += label + '=' +  excliam + defaultv +"\n";
        defaultfv += fieldname + '=' + defaultv + "\n";


        em = ele(i,8);
        var pk = (i==0);//em.checked;
        var ctl = label+ "_" + format;
        if (length!='') ctl += "_" + length;
        if (ht!='') ctl += "_" + ht;
        query +=   fieldname + " AS " + ctl +",";
        //if (defaultv=='' && sq=='') defaultv='0';
        var iniv = defaultv;
        if (datatype=='VARCHAR')
        while (iniv.length < innerlen+2) iniv = iniv + ' ';
        if (fieldname!='n') entry += sq +  iniv + sq + " AS " + ctl + ",";
        

        if (ctl != '' && label.indexOf("nolabel") != 0)
        {
           updateQuery += fieldname + "=" + sq + "$$" + label + "$$" + sq + ",";
           if (format == "s" ||format == "r")
           {
              search += "(((" + fieldname + " = "  + sq  + "??" + label +   "_s_10??"  + sq +"))) AND ";
              tail += "\n\n" + retrv(i,9);
           }
           else if (format == "c")
           {      
              search += "(((" + fieldname + " = "  + sq  + "??" +  label +   "_s_10??"  + sq +"))) AND ";
              tail += "\n\n" + textmsg[848] + "," + textmsg[849] + ";1,0";
           }
           else if (format == 'm' )
           {
              search += fieldname + " >= "   + "??" +   label +   "_m_10??  AND "
                     +  fieldname + " <= "   + "??" +   label +  "1_m_10??  AND ";
              boundstail += "\n" + label + "=0\n" + label +"1=??CURRENT_TIME??";
           }
           else if (sq == '' )
           {
              search += fieldname + " >= "   + "??" +   label +   "_n_5??  AND "
                     +  fieldname + " <= "   + "??" +   label +  "1_n_5??  AND ";
              boundstail += "\n" + label + "=0\n" + label +"1=10000";
           }
           else
           {
              search += fieldname + " LIKE " + sq + "%??" +  label + "_t_10??%" + sq +" AND ";
           }
        }
        if (pk)
        {
           where += fieldname + "=" + sq + "||" + label + "||" + sq + " AND ";
           primarykey += fieldname + ",";
        }
        var tt = (defaultv.replace(/'/g,"''"));
        if (tt.indexOf("'")>=0) tt = "'" + tt + "'";
        var yy = retrv(i,3).replace(/'/g,"''");
        if (yy.indexOf("'")>=0) yy = "'" + yy + "'";
        if (retrv(i,3)!='' && label!='' && i>0 )
           help += label + "," + (nulliable?0:1) + "," + tt + ",,"+ yy + "\r\n";
        inserts1  += fieldname  + ",";
        if(fieldname!='n') inserts2 += sq + "@@" + label + "@@" + sq + ",";
     }
     if (primarykey=='')
     {
        where = " n=||n||";
        primarykey = 'lastupdate,';
     }
     if (createtable.length > 3) createtable = createtable + "PRIMARY KEY(" + primarykey.replace(/,$/, "))");
     search = search.substring(0, search.length-5) + tail + boundstail;
     where = where.substring(0, where.length - 4);
     entry = entry.substring(0, entry.length - 1) + " FROM userform where formname='" + tablename +"'" + more;
     help = help.substring(0, help.length - 1) ;
     query = query.substring(0, query.length - 1) + " FROM " + tablename + " ??wcds?? " + more;
     updateQuery = updateQuery.substring(0, updateQuery.length - 1) + " WHERE " + where;
     var insertQuery = inserts1.replace(/,$/, ") ") + inserts2.replace(/,$/, " ");
     insertQuery += ' FROM ' + tablename +'\n\n' + defaultc;
     var deleteQuery = "DELETE FROM " + tablename + " WHERE " + where;

     query =  query.replace(/ AND $/,'').replace(/ WHERE $/,'');
     updateQuery =  updateQuery.replace(/ AND $/,'').replace(/ WHERE $/,'');
     deleteQuery =  deleteQuery.replace(/ AND $/,'').replace(/ WHERE $/,'');
     if (addcolumn!='') document.thisform.addcolumn.value = addcolumn;
     if (modifycolumn!='' && document.thisform.addcolumn.value !='-')
        document.thisform.modifycolumn.value = modifycolumn;
     document.thisform.title.value = document.form0.title.value;
     document.thisform.help.value = help;
     document.thisform.query.value = query;
     document.thisform.insertQuery.value = insertQuery;
     document.thisform.deleteQuery.value = deleteQuery;
     document.thisform.updateQuery.value = updateQuery;
     document.thisform.wcds.value = search;
     document.thisform.defaultfv.value = defaultfv;
     document.thisform.entry.value = entry;
     document.thisform.createtable.value = createtable;
     document.thisform.mode.value="13";
     document.thisform.target=  "w" + tstmp;
     window.onbeforeunload = null;
     formnewaction(document.thisform);// , "Echo");
     visual(document.thisform);
document.thisform.submit();
}
function removerows()
{
   var ii = 0;
   for ( ii=0; ii < NUMROWS; ii++)
   {
        if (f1.checkbox[ii].checked)
        {
            if (retrv(ii,1)=='n')
            {    
               myprompt(textmsg[542] + " " + textmsg[722]);
               f1.checkbox[ii].focus();
               return;
            }
            else if (retrv(ii,4)=='')
            {
               myprompt(textmsg[905]);
               f1.checkbox[ii].checked = false;
            }
        }
   }

   if (newmoditrans=='new')
   {
      goremoverows();
   }
   else
   {
   
   for ( ii=0; ii < NUMROWS; ii++)
   {
        if (f1.checkbox[ii].checked)
        {
            break;
        }
   }
   if (ii == NUMROWS)
      myprompt(textmsg[247]);
   else
      myprompt(textmsg[809]+"?",null,"if(v)goremoverows1()")
   }
}
function goremoverows1()
{
   var ii = 0;
   var ss = "";
   for ( ii=0; ii < NUMROWS; ii++)
   {
       if (f1.checkbox[ii].checked )
       {
           ss += retrv(ii,1) + ",";
       }
   }
   if (ss=='') return;
   goremoverows();
   document.thisform.modifycolumn.value = ss.replace(/,$/,'');
   document.thisform.addcolumn.value = '-';
   newmoditrans ='del';
   genaccess();
}
function goremoverows()
{
   var ii = 0; 
   for ( ii=0; ii < NUMROWS; ii++)
   {
       if (f1.checkbox[ii].checked )
       {
           
           for (var j=ii+1; (newmoditrans=='new'||j < numRows) && j < NUMROWS; j++)
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
   var nd = 0;

   for ( ii = 0;  (newmoditrans=='new'||ii < numRows)  && ii < NUMROWS; ii++)
   {
      if (f1.checkbox[ii].checked)
       {
           nd++;
           for (k = 0; k < numCols; k++)
           {
              mat[ii][k] = nullvalue[k];
              setv(ii,k,nullvalue[k])
           }
           f1.checkbox[ii].checked = false;
       }
    }
     
    NUMROWS -= nd;

    var tb =  f1.check1.parentNode.parentNode.parentNode;
    if (typeof (tb.rows) == 'undefined')
        tb = tb.parentNode;
    var Z = tb.rows.length -1;
    for (jj=0; jj < nd; jj++)
       tb.deleteRow(Z--);
    
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
   if (kk==0) myprompt(textmsg[885]);
}

function fmove1(j,ii)
{
   if (ii==NUMROWS)
   {
       myprompt(textmsg[885]);
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
      var xx = retrv(ii+j,k);
      setv(ii,k, xx);
      mat[ii+j][k] = held;
      setv(ii+j,k,held1);

   }
   f1.checkbox[ii].checked = false;
   f1.checkbox[ii+j].checked = true;

   return true;
}

function test()
{
   document.thisform.title.value = document.form0.title.value;
   document.thisform.mode.value="15";
   window.open("", "savewin", dim(600,680));
   formnewaction(document.thisform);
   visual(document.thisform);
document.thisform.submit();
}

function FS(Z,c)
{
   S(Z,c);
   if (document.form0.showguide.checked)
      guideme(Z,c);
}
function showgui(t)
{
   if (t.checked)
   {
      if (rr>0 && rr < NUMROWS && cc>=2 && cc!=8)
      guideme(rr,cc);
   }
   else
      closeprompt();
}
//if (typeof document.thisform.btnremove !='undefined')
//   document.thisform.btnremove.value = "X " + textmsg[128];
resizebut(document.thisform);
function totrans(t)
{
   var tb =  f1.check1.parentNode.parentNode.parentNode;
   if (typeof (tb.rows) == 'undefined')
       tb = tb.parentNode;
   var lbl = document.getElementById("autostr");
   if (t.checked)
   {
       var Z = tb.rows.length -1;
       tb.deleteRow(Z);
       NUMROWS--;numRows--; extra--;
       if (typeof document.thisform.btnremove !='undefined')
       document.thisform.btnremove.style.visibility = "hidden";
       if (lbl!=null)lbl.style.visibility = "hidden";
       newmoditrans = "trans";
   }
   else
   {
       addarow(tb);
       NUMROWS++;numRows++; extra++;
       //if (typeof document.thisform.btnremove !='undefined')
       //document.thisform.btnremove.style.visibility = "visible";
       newmoditrans = "modify";
       if (lbl!=null)lbl.style.visibility = "visible";
       if (initialtrans)myprompt(textmsg[319]);
   }
}

function UB(t,j, r)
{
   if (j==2)
   {
      t.value = t.value.replace(/,/g,'').replace(/'/g,'').replace(/"/g,'').replace(/\./g,'').replace(/#/g,'').replace(/@/g,'').replace(/%/g,'').replace(/&/g,'').replace(/\*/g,'').replace(/\(/g,'').replace(/!/g,'').replace(/\-/g,'').replace(/\+/g,'').replace(/\?/g,'').replace(/\^/g,'').replace(/_/g,'').replace(/=/g,'').replace(/\|/g,'').replace(/\[/g,'').replace(/\//g,'').replace(/{/g,'');
      var s = t.value.charAt(0);
      for (var i=1; i < t.value.length; i++)
      if (t.value.charAt(i-1)==' ')
         s += t.value.charAt(i).toUpperCase();
      else
         s += t.value.charAt(i);
      s = s.replace(/[ ][ ]+/, ' ');
      if (s!='')
      {
         for (var j = 0; j < NUMROWS; j++)
         {
            if (r!=j && s == retrv(j,2))
            {
               myprompt(s + " " + textmsg[3]);
               s += "1";
               t.focus();
               break;
            }
         }
      }
      t.value = s;
   }
   U(r,j);

}

function keyc(evt)
{
   if (evt==null)
      evt = window.event;
   var key = 0;
   if (evt.keyCode) { key = evt.keyCode; }
   else if (typeof(evt.which)!= 'undefined')
   { key = evt.which; }
   return key;
}
function allowenter11(Z,evt)
{
   var key = keyc(evt);

   var b = isDigitKey(key);
   if (!b && key!=8 && key!=50 && key!=9)
   {
      myprompt('Enter digits only' + key);
      return false;
   }
   return true;
}
function gotocell11(evt)
{
   var key = keyc(evt);

   if (key == 13 || key == 9)
   { 
     FS(1,2);
     ele(1,2).focus();
     return false;
   } 
   return true;
}
function allowenter02(Z, evt)
{
   var key = keyc(evt);
   return true;
}
function nodel()
{
   if (newmoditrans=='modify' && typeof document.thisform.btnremove != 'undefined')
      document.thisform.btnremove.style.visibility = "hidden";
}

var savedinitv9 = new Array();
function setvalue9(z, zerovalue)
{
   var v9 = retrv(z,9).replace(/\s/g,'');
   if (v9 =='') setv(z,9,zerovalue);
}
var tempsel = null;
function V(sel,z)
{
   if (sel.selectedIndex <= 0) return;
   var ii=1;
   while (ii<=z && retrv(ii,4)!='')
   {
       ii++; // 13970888691 15879250316)

   }

   tempsel = sel;
   var v4 = sel.options[sel.selectedIndex].value;
   if(newmoditrans != 'new' && (mat[z][4]!='n' && mat[z][4]!='m' && mat[z][4]!='c') && (v4=='n' || v4=='m' || v4 == 'c'))
   {
       myprompt("The existing non-numeric data in this field will disallow the change of this data type to numeric type, unless you discard the non-numeric data in this field. Do you want to do that?", null, "if(v)VVl(" + z +"); else setv(" + z + ",4,'" + x + "')", "To Numeric");
   }
   else
      VVl(z);
}

function VVl(z)
{
   var sel = tempsel;
   var v4 = sel.options[sel.selectedIndex].value;
   switch(v4)
   {
      case 'n': setv(z,5,'5'); warntype(retrv(z,1));  setv(z,6,'0');                  setvalue9(z, '0');  break;
      case 'm': setv(z,5, ''); warntype(retrv(z,1));  setv(z,6,'');   setv(z,7,'1');  setvalue9(z, '??CURRENT_TIME??');  break;
      case 't': setv(z,5, '10'); setv(z,6,'');                   setvalue9(z, ''); break;
      case 'a': setv(z,5, '70'); setv(z,6,'4');  setv(z,8,'0');  setvalue9(z, ''); break;
      case 's': setv(z,5, '10'); setv(z,6,'');                   setvalue9(z, 'Face1,Face2;1,2'); break;
      case 'r': setv(z,5, '10'); setv(z,6,'');   setv(z,7,'1');  setvalue9(z, 'Choice1,Choice2;a,b'); break;
      case 'c': setv(z,5, '1');  setv(z,6,'');   setv(z,7,'1');  setvalue9(z, '0'); warntype(retrv(z,1)); break;
      case 'b': setv(z,5, '400');setv(z,6,'40'); setv(z,8,'0');  setvalue9(z, '3x5'); break;
      case 'l': setv(z,5, '100');setv(z,6,'');                   setvalue9(z, 'http://www.'); break;
      case 'i': setv(z,5, '600');setv(z,6,'300');                setvalue9(z, 'http://www.'); break;
      case 'u': setv(z,5, '');   setv(z,6,'');                   setvalue9(z, 'http://www.'); break;
      case 'k': setv(z,5, '50'); setv(z,6,'');                   setvalue9(z, 'http://www.'); break;
      case 'h': setv(z,5, '15'); setv(z,6,'');    break;
   }
   closeprompt();
   if (document.form0.showguide.checked)
      guideme1(sel.selectedIndex-1,sel);
   if (z==NUMROWS-1)
   {
          var n = sel.parentNode.parentNode.parentNode;
           if (typeof (n.rows) == 'undefined')
             n = n.parentNode;
          addarow(n);
          mat[NUMROWS] = new Array(numCols);
          NUMROWS++;
   }
   nodel();
}
function warntype(fn)
{
   if (x!='n' && x!='c' && x != 'm')
   {
       myprompt("The existing non-numeric data in this field will disallow the change of this data type to numeric type, unless you discard the non-numeric data in this field. Do you want to do that?", null, "if(v)godump(" + fn +")", "To Numeric");
   }
}
function godump(fn)
{
   open("weswizrd.jsp?rdap=" + rdap + "?feild=" + fn, "w" + tstmp);
}
function addarow(n)
{
    var Z = n.rows.length;
           var rs = n.insertRow(Z--);
           rs.setAttribute("bgcolor", TBGCOLOR);
           rs.setAttribute("valign","center");
           var htm =   
('<INPUT type=checkbox NAME=checkbox value='+ Z +'></td><td align="right">' + Z +
'<INPUT type="hidden" class=right size=2  NAME='+Z+'_0 onfocus=FS('+Z+',0) onblur=U('+Z+',0) >' +
'<INPUT type="hidden" class=right size=2  NAME='+Z+'_1 onfocus=FS('+Z+',1) onblur=U('+Z+',1)></td><td>' +
'<INPUT class=left  size=13 NAME='+Z+'_2 onfocus=FS('+Z+',2)  onblur="UB(this,2,' + Z +')" onkeypress="return allowenter02('+Z+',event)"></td><td>' +
'<INPUT class=left  size=15 NAME='+Z+'_3 onfocus=FS('+Z+',3)  onblur=UB(this,3) onkeypress="return allowenter02('+Z+',event)"></td><td>' +
'<select NAME='+Z+'_4 onfocus="FS('+Z+',4);fillopts(this,'+Z+',4,true)"  onblur="U('+Z+',4)" onchange="V(this,'+Z+')">' +
'</select></td><td width=40  align=right>' +
'<INPUT class=right style="width:30px"  NAME='+Z+'_5 onfocus=FS('+Z+',5)  onblur="U('+Z+',5)"  onchange="nodel()"   onkeypress="return allowenter11('+Z+',event)"></td><td align=center>' +
'<INPUT class=right style="width:30px"  NAME='+Z+'_6 onfocus=FS('+Z+',6)  onblur=U('+Z+',6)  onchange="nodel()" onkeypress="return allowenter11('+Z+',event)"></td><td align=center>' +
'<INPUT type=checkbox    NAME='+Z+'_7 onfocus=FS('+Z+',7) onblur="U('+Z+',7)"   onchange="nodel()" >' +
'<input type="hidden"    NAME='+Z+'_8 onfocus=FS('+Z+',8) onblur=U('+Z+',8) value=0 ></td><td>' +
'<input class=left size=15 name=' +Z + '_9 onfocus=FS('+Z+',9)  size=8>').split(/<.td><td[^>]*>/);
   for (var k =0; k < htm.length; k++)
   {
      var tdele = rs.insertCell(k);
      if (k==0 || k==6 || k==7) tdele.align="center";
      else if (k==1) tdele.align="right";
      if (k==0) tdele.width = "25";
      tdele.innerHTML = htm[k];
      tdele.style.backgroundColor = TBGCOLOR;
   }
}
if (typeof (document.form0.intern) != 'undefined' && document.form0.intern.checked)
{
   var lbl = document.getElementById("autostr");
   lbl.style.visibility = 'hidden';
}
var oldonclose15 = window.onunload;
onunload = function() 
{
    if (oldonclose15!=null)
        oldonclose15();
    parent.frames[0].closeprompt();
}

function getFieldstr()
{
   var str = '';
   for (var i=1; i < NUMROWS-1; i++)
   {
      for (j=2; j < numCols; j++)
      {
         str += retrv(i,j);
         if (j < numCols-1)
            str += "\t";
         else if (i < NUMROWS-2) str += "\n";
      }
   }
   return str;
}
function getTitle()
{
   return document.form0.title.value;
}
var guidence = textmsg[266].split("\n");
var formatguide = textmsg[267].split("\n");
formatguide[27] = formatguide[27].replace(/@/, timeformat);
function guideme(Z,c)
{

      var str = guidence[4];
      if (c >= 0)
      {
      var j = parent.frames[1].ele(Z,4).selectedIndex;

      if (c>=2 && c <=4)
         str =  guidence[c-2] + ".<br>" + textmsg[190];
      else if (c==7)
         str =  guidence[3] + ".<br>" + textmsg[190];
      else if (j==null || j <= 0)
         str = guidence[2];
      else if (c==5)
      {
         str =  formatguide[--j] ;
         while (str=='#') str =  formatguide[--j] ;
         str += ".<br>" + textmsg[190];
      }
      else if (c==6)
      {
         str =  formatguide[12+j] ;
         while (str=='#') str =  formatguide[12+(--j)] ;
         str += ".<br>" + textmsg[190];
      }
      else if (c==9)
      {
         str =  formatguide[25+j] ;
         while (str=='#') str =  formatguide[25+(--j)] ;
         if (j==5) str += ".<br>" + textmsg[866] + ". <a href=\"domainvalue.jsp?Domain=0&dim=600600'\" target=\"domvl\">" + textmsg[189] +"</a>";
         else str += ".<br>" + textmsg[867];
      }
      }
      str = "<div style=\"float:left\"><img src=image/guide1.gif height=60></div>" + str;
      myprompt(  str  + "<input type=hidden>",null,null,textmsg[191]);
      var xy = null;
      if (c==-1)
      {
         xy = [45,56];
      }
      else
      {
         var el  = ele(Z,c);
         xy = positionit(el);
      }
      promptwin.style.top =   xy[1] + 'px';
      promptwin.style.left =  xy[0] + "px";
}
function positionit(el)
{
     var xy = parent.frames[0].findPositionnoScrolling(el,self);
     var xy0 = thispagewidth() - promptwin.offsetWidth - 6;
     if (xy[0] > xy0) xy[0] = xy0;
     if (xy[1] + promptwin.offsetHeight + el.offsetHeight> thispageheight())
         xy[1] = xy[1] - promptwin.offsetHeight;
     else xy[1] += el.offsetHeight+10;

     return xy;
}
var guidediv = null; //['n','m','t', 'a','s','r', 'c','b','l', 'i','u','k','h']
var yz = [9,  8,  13,  0,  12,11,  2,  1,  7,   5,  14, 6,  4];
var msg860 = textmsg[860].split("\n");
for (var i=0; i < msg860.length; i++)
   msg860[i] = msg860[i].replace(/[^ ]+ /,'').replace(/X/,'').replace(/;$/,'');
function guideme1(j,sel)
{
   guideme2(textmsg[863] + " " + msg860[yz[j]] + ".<br><br>" + textmsg[864],sel);
}
function guideme2(s,sel )
{
   s = "<div style=\"float:left\"><img src=image/guide1.gif height=60></div>" + s  ;
   myprompt(s,null,null,textmsg[191]);
   if (sel!=null)
   {
      var xy = positionit(sel);
      promptwin.style.top =   (xy[1]-5) + 'px';
      promptwin.style.left =  xy[0] + "px";
   }
}


 


