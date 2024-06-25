/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
var temp,which,format,valid = true,ss = "newTask",nav1=null;
var f = document.thisform;

function helpbuts(color, caption, explain)
{
   var str =  "<tr><td valign=top><input class=" + color +" style=\"width:" + Math.ceil(charwidthrate()*font_size) +"px\" type=button value=\""+caption+"\"> </td><td>"+explain +"</td></tr>";
   return str;
}
var butts = document.thisform.elements;
var msgmaps = [916,917,918,11,919,920];
function showhelp()
{
  var helpstr = "<table>";
 var butts = document.thisform.elements;
  for (var m=0; m < 6; m++)
   helpstr += helpbuts(butts[m].className,butts[m].value, textmsg[msgmaps[m]]);
  helpstr += ("</table>");
  
  for (m=921; m < 923; m++)
  {
   var m1 = textmsg[m].indexOf(":");
   helpstr += ("<br><b><font color=purple>" + textmsg[m].substring(0,m1) + "</font></b><br>");
   helpstr += textmsg[m].substring(m1+1) + "<br>";
  }
  myprompt(helpstr);
  setRoundedWidth(promptwin, 400);
}

function dim(x,y)
{
   return "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width="+ x +",height="+ y +",top="+ (screen.height-y)/2 +",left="+ (screen.width-x)/2;
}

function openit(url, winname)
{
   nav1 = window.open(url,winname, dim(500,500));
}

function getstring(str)
{
   f.query.value += '\n'+str;
}

function defaultupdate()
{
   if (f.updateQuery.value!= '')
      return;
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
            sc = "UPDATE "+ y[0] + "\nSET "+ field + "='@@"+ value+"@@'";ns=1;
         }
         else
         {
            sc += ",\n    "+ field + "='@@"+ value+"@@'";
         }
      }
      else
      {
         if (nw == 0)
         {
            wc = "\nWHERE "+ field + "='@@"+value+"@@'\n"; nw = 1;
         }
         else
            wc +="AND   "+ field + "='@@"+ value+"@@'\n";
      }
      
   }
   
   f.updateQuery.value = sc +" "+ wc;
   
   if ( y.length > 1)
      f.updateQuery.value += " AND "+ y[1];
   myprompt(textmsg[0]);
}

function showurl()
{
   if (f.title.value!='')
      window.open(f.title.value, "tempshow");
}

function example()
{
   f.query.value= "SELECT \n  ssn,  \n  lastname as LastName_t_20,\n  email as Email_t_30\nFROM  Student where lastname='Lin'";
   f.updateQuery.value="";
   f.deleteQuery.value="";
   f.insertQuery.value="";
   f.webService.value="";
}

var intest=false;
function exec()
{
   
   if (f.query.value == null || f.query.value == '')
   {
      f.query.focus();
      myprompt('Enter query');
      valid = false;
      return;
   }
   else
   {
      f.target = "_blank";
      formnewaction(f, "Data"+f.format.value);
      ss = "ss";
      if (f.rdap.selectedIndex >= 0)
      ss = f.rdap.options[f.rdap.selectedIndex].value;
      
   }
   
   visual(document.thisform);
document.thisform.submit();
   
}

function contain(a,e)
{
   var m = e.exec(a);
   return (m!=null && ''+m!='');
}
var searchstate = 0;
function search()
{
   if (searchstate == 0)
   {
      
      myprompt(testmsg[882]);
      return;
   }
   
   var qr = new RegExp(f.query.value);
   
   var tr = new RegExp(f.title.value);
   /*
   var rr = fromAccess1(f.rolesel);
   if (rr==maxroles) 
   {
       fillAccess1(f.rolesel, 0);
       rr = 0;
   }
   */
   for (var i = f.rdap.options.length-1; i>=1; i--)
      f.rdap.options[i] = null;
   
   var ii = 0; var k=0;
   for (i = 1; i <  numrdaps; i++)
   {
      
      if (
         f.query.value!=''&& !contain(querys[i],qr)  
      
          || f.title.value!=''&& !contain(titles[i],tr)  
      
           
      
      )
      {
          f.rdap.options[i] = new Option(" ", " ");
          
      }
      else
      {
         k++; f.rdap.options[i] = new Option(names[i], names[i]);
      }
   }
   f.submit1.value= textmsg[721];
   myprompt(""+ k + " rdaps were found. They are listed in the Name drop down menu. You may refine this search, view the found records or click the " + textmsg[721] + " to end the search");
   
   f.rdap.selectedIndex = 0;
   fill();
   
}

function tables()
{
   formnewaction(f,"tables.jsp");
   valid = true;
   ss = "tableList";
  visual(f);
 f.submit();
}

 
 
resizebut(f,font_size);

function new1()
{
   if (searchstate==0)
   {
      f.rdap.selectedIndex = 0;
      f.title.value = '';
      f.query.value = '';
      
      //fillAccess1(f.rolesel, maxroles);
      
      searchstate=1;
   }
   else
   {
      var seli = f.rdap.selectedIndex; var selstr = f.rdap.options[seli].value;
      for (var i=f.rdap.options.length-1; i>0; i--)
         f.rdap.options[i] = null;
      seli = -1;
      for (i=1; i < numrdaps; i++)
      {
         if (names[i]==selstr) seli=i; f.rdap.options[i] = new Option(names[i], names[i]);
      }
      if (seli != -1) f.rdap.selectedIndex = seli;
         searchstate = 0;
      f.submit1.value=textmsg[406];
   }
}

function fill()
{
   
   var j = f.rdap.selectedIndex;
   if (j==-1)
   {
      resizeCont(); return;
   }
   var nm = f.rdap.options[j].value;
   
   j=0; for(; j < numrdaps && names[j] != nm; j++);
   if (j==numrdaps)
   {
      resizeCont(); return;
   }
   
   f.rdap.value = names[j];
   f.title.value = titles[j];
   f.query.value = querys[j];
   
   //fillAccess1(f.rolesel, roles[j]);
   f.roles.value = roles[j];
   resizeCont();
}

function validate()
{
   if (valid == false) return false;
      if (ss != null)
         ss = ss.replace(/\W/g,'_');
      else ss = 'resulwin';
         
      var aa = window.open("savefirst.html",ss, dim(340,300));
      
      f.target = ss;
      //return false; 
      return (true);
}

function openWindow(url, winname, style)
{
   window.open(url, winname, dim(340,300));
}
function resizeCont()
{
      var rate = charwidthrate();
      var butwith = Math.ceil(rate*font_size);
      var wd = thispagewidth();
      var het = thispageheight();
      wd -= 40;
      wd /= 2;
      het -= 135 + butwith;
      //f.btn1.style.width = "73px";
      //f.btn2.style.width = "73px";
      f.rdap.style.width = (wd - 3*butwith - 8) + 'px';
      f.query.style.width= "" + wd + "px";
      f.query.style.height= "" + het + "px";
      f.title.style.width = "" + (wd - butwith) + "px";

      f.old.style.width= butwith + "px";
      f.newone.style.width= butwith + "px";
      var fm = document.getElementsByTagName("iframe")[0];
      fm.height = "" + het + "px";
      fm.width = "" + wd +"px";
}

function buts(color, caption, explain)
{
   return "<tr><td valign=top> <input style=background-color:"+ color + ";color:white;width:60 type=button value=\""+caption+"\"> </td><td>"+explain +"</td></tr>";
}
function trans(sel, hinput)
{
   hinput.value = fromAccess1(sel);
}
function fillAccess1(sel, code )
{
   sel.options[0].selected =(code == 0);
   //f.roles.value = code; 
   for (var i = 1; i < sel.options.length ; i++)
      sel.options[i].selected = ( (code & (1<<(i-1)) ) > 0);
}
function fromAccess1(sel)
{
   if ( sel.options[0].selected )
      return 0;
   var code = 0;
   for (var i = 1; i < sel.options.length ; i++)
      if ( sel.options[i].selected)
         code |= (1<<(i-1));
      //f.roles.value = code; 
      return code;
}
function test1()
{
   formnewaction(f,"userrdapcompile.jsp");
   ss = 'convertwin';
   window.open("",ss, dim(340,300));
   f.target = ss;
  visual(f);
 f.submit();
}

function findstrintextarea1(str1)
{
   textareatobesearch = f.query;
   if (findstrintextarea(str1) == false)
   {
      
   }
}

function rdapURL()
{

     if (numrdaps==1) return;

     var j = f.rdap.selectedIndex;
     
     if (j==0 || j==-1)
     {
        myprompt(textmsg[885]);
        f.rdap.focus();
        return;
     }

     if (nav2!=null) nav2.close();
     var url = "userrdapopt.jsp?j=" + j + "&format=Merge"
        +"&rdap="
        + encodeURIComponent(f.rdap.options[j].value)
        + ((options[j]==null)? '':options[j]);
 
     nav2 = postopen(url, '800_600');

}

function setting()
{
   window.open("DataForm?rdap=fontsize&exbut=p&subdb=&onsaved=0" ,"customiz", dim(300,280));
}
function setting1(fn,fs)
{
   var loct = ''+ document.location;
   loct = loct.replace(/tastyle.*/,'');
   if (loct.indexOf("?") > 0)
      loct += "&";
   else loct +="?";
      loct += "tastyle="+ fn +';'+ fs;
   
   document.location.href = loct;
   
}
function aftersave()
{
   var j = f.rdap.selectedIndex;
   names[j] = f.rdap.options[j].value;
   querys[j] = f.query.value;
   titles[j] = f.title.value;
  /* jscripts[j] = f.jscript.value;
   preops[j] = f.preop.value;
   postops[j] = f.postop.value;
   insertQuerys[j] = f.insertQuery.value;
   updateQuerys[j] = f.updateQuery.value;
   deleteQuerys[j] = f.deleteQuery.value;
   webServices[j] = f.webService.value;
   formats[j] = f.format.options[f.format.selectedIndex].value;
   helps[j] = f.help.value; */
   roles[j] = f.roles.value; /*
   insertroles[j] = f.insertroles.value;
   updateroles[j] = f.updateroles.value;
   deleteroles[j] = f.deleteroles.value; */
   if (j==numrdaps) numrdaps++;
}
function save()
{
   valid = true;
   if (  f.rdap.selectedIndex == 0)
   {
      saveAs();
      return;
   }
   formnewaction(f,"datamerge.jsp");
   f.mode.value="update";
   ss = "savemsg";

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

function godelete()
{
         formnewaction(f,"datamerge.jsp");
         f.mode.value="delete";
         valid = true;
         ss = "savemsg";
         window.open("",ss, dim0);
         f.target = ss;
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
}

function saveAs()
{
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
                 gosaveit(nt);
          }
}

function gosaveit(nt)
{
   f.mode.value="insert";
   formnewaction(f,"datamerge.jsp");
   f.rdap.options[numrdaps] = new Option(nt,nt);
   f.rdap.selectedIndex = numrdaps;
   ss = "savemsg";
   valid = true;
   if (validate())
  visual(f);
 f.submit();
}

window.onresize = resizeCont;
//window.moveTo(0,0);
//window.resizeTo(screen.width,screen.height);
fill();
 
function userlevel()
{
   if (f.rdap.selectedIndex > 0)
   {
     var rdapname = f.rdap.options[f.rdap.selectedIndex].value;
       postopen("DataForm?x=0&rdap=permits&rdapname=" + encodeURIComponent(rdapname)
     + "&onbegin=57"  
     + "&onsave=58" ,
       '500_400');
   }
}

function assemble()
{
   var s='',tt;
   for (var i=0; i < 1; i++)
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

   for (i=0; i < 1; i++)
      justopenedwindowhandle.setv(i, 3, s);
}

function redo(mat)
{
   if (mat==null || mat.length==0 || mat[0].length < 5)
   {
      if (f.rdap.selectedIndex>=0)
      myprompt(f.rdap.options[f.rdap.selectedIndex].value + " not exist");
      else
          closeprompt();
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
      v[i*2 + j] += "," + arr[k].substring(2);

   }
   for ( i=0; i < 8; i++)
   {
      var x = v[i]; if (v[i]!='') v[i] = v[i].substring(1);
      if (Math.floor(i/2) == 0 )
      mat[Math.floor(i/2)][4+(i%2)] = v[i];
   }
}
function syn(x)
{

   if (x==1)
   {
     if (f.mode.value=='delete')
       afterdelete();
     else
       aftersave();
 
   }
   return 0;
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
