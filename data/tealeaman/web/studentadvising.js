/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/

var nav4 = null;
function dim(x,y)
{
  return 'menubar=0,toolbar=0,location=0,resizable=1,scrollbars=1,width=' + x +',height=' + y +',top=' + (screen.height-y)/2 +',left=' + (screen.width-x)/2;
}
function check()
{
   if (nav4==null) return "";
    
   var ms = "";
   var NR = nav4.passoverNumRows()+1;
   var timeconflict = new Array(NR);
   var nopre = new Array(NR);
   var reasons = new Array(NR);
   for (var i=0; i < NR-1; i++) 
      reasons[i] = parseInt(nav4.retrv(i,13));
   if (nav4.retrv(NR-1,0)!='' && nav4.retrv(NR-1,6)!='')
      reasons[NR-1] = 1; //nav4.setv(i, 13, '1'); 
   else
      reasons[NR-1] = 0;
      
    
   for (var i=0; i < NR; i++)
   for (var j=0; j < i; j++)
   {
      var stri = nav4.retrv(i,9);
      var strj = nav4.retrv(j,9);
      if (i!=j && stri!='' && strj!='' && isjiao2(stri, strj))
      {
         ms += textmsg[764]+":\n " + nav4.retrv(i,0) +' ' + nav4.retrv(i,1) + ' ' + tmsg402 + ' '
         + nav4.retrv(j,0) +' ' + nav4.retrv(j,1) +"\n";
         timeconflict[i]=true;
         timeconflict[j]=true; 
         reasons[i] = reasons[i] | 8;
         reasons[j] = reasons[j] | 8;
         //nav4.setv(i,13,'11');
         //nav4.setv(j,13, '11');
      }
   } 
    
   var numRows1 = parent.z22.passoverNumRows();
   for (var i=0; i < NR; i++)
   { 
      var stri = nav4.retrv(i,12); 
      if (stri!='' && nav4.retrv(i,6)!='')
      {
          var ss = stri.split(","); var ck = true;
          for (var k=0; k < ss.length && ck; k++)
          {
            var j=0; 
            for (; j < numRows1 && ss[k]!=parent.z22.retrv(j,5); j++);
            if (j==numRows1)
            {
               ck=false; 
               ms += textmsg[781]+": " + nav4.retrv(i,0) +    ' '+textmsg[782]+' ' + stri +"\n"; 
            }
          }
          if (ck == false)
          { 
             nopre[i] = true; 
             reasons[i] = reasons[i] | 16; 
          }
         // nav4.setv(i, 13, '5');
      }
   }  
   
   if (ms!='' && confirm(ms + " " + textmsg[765] +"?") == false) return ' ';
   
   for (var i=0; i < NR ; i++)  
       if (nav4.retrv(i,9)!='')  
          nav4.setv(i, 13, reasons[i]); 
   return '';
}
    var nav3 =null; 
   
var ii = 0;
function oneitem(nm,vl)
{
   var str = "";
   if ( (ii%2)==0)
      str += "<tr>";
   if (vl=='null') 
       vl = '&nbsp;';
   str +="<td><nobr><font face=arial>" + nm +"</font></nobr></td><td><nobr><b>" + vl +"</b></nobr></td>";
   if ( (ii%2) ==1 )
      str += "</tr>";
   else str += "<td>&nbsp;</td>";
   ii++;
   return str;
}
function heading(arr)
{
       var tt=  "<table align=center cellpadding=3 cellspacing=1>"
       + oneitem(textmsg[1308], fname ); 
       tt+= oneitem(textmsg[673], sid ); 
       tt+= oneitem(tmsg570,  major); 
       
       if ( minor !='')
       tt += oneitem(tmsg1050, minor );
       tt += oneitem(tmsg816,  category )
            + oneitem(textmsg[769],  degree )
            + oneitem(textmsg[759],  startdate )
            + oneitem(textmsg[455],  status  ); 
             
       if (arr[2]>0) 
           tt+= oneitem(textmsg[760], prevschool );
       tt+= oneitem(textmsg[761],arr[0])
            +oneitem(textmsg[762],parent.z22.numberstr(''+ ((arr[0]==0)?0:arr[1]/arr[0]),'2')); 
       if (arr[2]>0)
           tt+= oneitem(textmsg[763], arr[2]) 
             + oneitem(textmsg[762], parent.z22.numberstr(''+ arr[3]/arr[2],'2'))
             +oneitem(textmsg[194],(arr[0]  + arr[2]))
             +oneitem(textmsg[762], parent.z22.numberstr(''+ ((arr[3]+arr[1])/(arr[0]+arr[2])),'2')); 
       if (ii%2==1)
           tt+=oneitem('&nbsp;','&nbsp;');
       tt+="</table>";
       return tt;
}
 
function add(n)
{
   
   if (n == 1)
   var ln = "studentadvising.jsp?mode=pickcourse&majorprogram=" 
           +  encodeURIComponent(majorprogram) + "&minorprogram=" 
           +  encodeURIComponent(minorprogram) + "&seme=" +  encodeURIComponent(semes) + "&sid=" + sid;
    
   else
       ln = "studentadvising.jsp?mode=schedule&seme=" +  encodeURIComponent(semes) + "&sid=" + sid; 
   
   postopen(ln, "_blank");
}


function go(sel,n)
{
      if (sel.selectedIndex <0) return;
      semester = sel.options[sel.selectedIndex].value;
      if (nav4!=null) nav4.close();
      if (semester=='') return;
      //28 = for(r=numRows-1;r>=0;r--)if(parseInt(mat[r][11])>0){mat[r][8]="";ele(r,8,"");}
      //29 = opener.log1(rr,cc,x,v)
      if (n==1)
        postopen('DataTable',['subdb','onbegin','cellonblur','rdap','extraline','sid','major','minor','semester','onsaved','onsave'],
                              ['','28','29','coursepick','1',  sid, majorprogram,minorprogram,semester,'3','5'],'tlmrstatus');  
        /* nav4 = window.open('DataTable?subdb=&onbegin=28&cellonblur=29&rdap=coursepick&extraline=1&sid='
          + sid + '&major='+ majorprogram +'&minor='+ minorprogram +'&semester=' + semester 
          + '&onsaved=3'
          + '&onsave=5', '_blank',
         dim(screen.width,screen.height)
         );*/
      else if (n==2)
          postopen('DataHTML',['subdb','rdap', 'sid','semester'],
                              ['','myschedule',  sid, semester],'schedule'); 
          //window.open('DataHTML?subdb=&rdap=myschedule&sid=' + sid + '&semester=' + semester, 'schedule',dim(600,400));
     closeprompt();
}
function countwrite(str)
{
   
}

var htmltranscript = null;
function transcript()
{

   var numRows2 = parent.z22.passoverNumRows();
   if (numRows2 == 0){myprompt(textmsg[351]); return;}
   var min=1000, max=0;
   for (var i=0; i < numRows2; i++)
   {
      var yy = parent.z22.getMat(i,4);
      if (yy==null || yy=='' ) continue;
       
      var j = allsemes.indexOf(";" + yy +";");
      if (j + yy.length + 1 > max)
         max = j + yy.length+1;
      if (j < min) min = j;
   }
   
    
   var scpt = "script";
   var semes = allsemes.substring(min+1,max); 
   var xx = '';
   var semestr = semes.split(";");
   var NS = semestr.length;
    // xx +=  '<!DOCTYPE html>\n<html>' + meta + '<head><title>'+ tmsg1052 + '</title><style>td{font-size:12px}</style></head><body bgcolor='+DBGCOLOR+'>' ;
    xx +=  "<center><table BORDER=0 COLS=1 WIDTH=100%  BGCOLOR=" + IBGCOLOR + "    height=42><tr ALIGN=CENTER><td><font color=#DDCC11 size=+2><b>"+title+"</font></td></tr></table><br></center>" ; 

      var nt = new Array(5);
      var str = new Array(NS);
      for (i = 0; i < 5; i++) 
         nt[i] = 0;
      for (i = 0; i < NS; i++)
      {
         str[i] = block(semestr[i],nt);
      }
      xx += heading(nt);  
      xx += "<table cellspacing=1 cellpadding=3 align=center>";

      i = 0;
      var ri = 0;
      for (i=0; i < NS; i++)
      {
         if (str[i] == null || str[i] == '' || '' + str[i] == 'undefined')
            continue;
         if (ri%2==0) xx += '<tr>';
         xx +=  '<td wisth=50% valign=top>' +  str[i]  + '</td>';
         if (ri%2==1) xx += '</tr>';
         ri++;
      }
      if (ri%2==1)
         xx +=  '<td>&nbsp;</td></tr>';
      
      xx +=   '</table>';//</body></html>' ;

      htmltranscript = xx;
      if (isstudent )
      {
         myprompt(textmsg[775], null, "if(v)official()", textmsg[16]);
         
      }
      else
         unofficial();
}

function official(v)
{
   formnewaction(document.form1, "Esign");
   document.form1.target = "_blank";
   var x =  '<!DOCTYPE html>\n<html>' + meta + '<body bgcolor='+DBGCOLOR+'>' ;
   document.form1.content.value = x + htmltranscript + '</body></html>';
   document.form1.feeid.value = "10";
   visual(document.form1);
document.form1.submit();
}
takeuserinputyn = function(v)
{
    if (v)
        official(v);
    else
       unofficial() 
}
function unofficial()
{
    nav3 = window.open("","_blank");
    var rootstyle = document.getElementsByTagName("head")[0].innerHTML;
   let jj = rootstyle.indexOf(":root");
   if (jj == -1)rootstyle = '';
   else 
   {
      let kk = rootstyle.indexOf("}",jj);
      rootstyle = "<style>" + rootstyle.substring(jj,kk+1) + "</style>";
   }
         nav3.document.getElementsByTagName("body")[0].innerHTML = "";
         nav3.document.write('<!DOCTYPE html><html>'+ meta + '<head><title>' + tmsg1052 + '</title></head>' + rootstyle + '<link rel=stylesheet href=styleb' + (orgnum%65536) + '.css /><body bgcolor='
      + DBGCOLOR
      + '></body></html>');
    nav3.document.body.innerHTML = htmltranscript;
    nav3.focus();
    //nav3.moveTo(1,1);
    //nav3.resizeTo(screen.width-5, screen.height-5);
}
function extractfromm(url)
{
   if (url == null || url=='') return ""; 
   var hh = url.indexOf(">>");
   if (hh != -1)
   {
       return url.substring(0,hh );
   }
   return '';
}
function match()
{
      // lger: left better than right
      //parent.z22.fillcolsels(3);

      var numRows = parent.z21.passoverNumRows();  
      var numRows1 = parent.z22.passoverNumRows();
      var NUMROWS = parent.z22.passoverNUMROWS();
      var notdone = "";
      for (var i = 0; i < numRows; i++)
      {
         
         var j = 0;
         for (; j < numRows1; j++)
         {
            if (extractfromm(parent.z21.getMat(i,0)) ==  parent.z22.retrv(j,5)
               && (parent.z22.getMat(j,2)=='' ||
               lger(parent.z22.getMat(j,2),parent.z21.getMat(i,4))) )
               break;
         }
         // equivalent?

         if (j == numRows1)
         {
           for (j=0; j < numRows1; j++)
            if (extractfromm(parent.z21.getMat(i,0)) == extractfromm(parent.z22.getMat(j,0)) 
            && parent.z22.getMat(j,6)=='1'
            && (parent.z22.getMat(j,2)==''|| lger(parent.z22.getMat(j,2),parent.z21.getMat(i,4))))
            {
               parent.z22.setMat(j,5,extractfromm(parent.z22.getMat(j,0)));
               parent.z22.setv(j,5,extractfromm(parent.z22.getMat(j,0)));
               break;
            }
         }
         /*
         if (j == numRows1)
         {
            numRows1++;
            parent.z22.setNumRows(numRows1);
            if (numRows1 > NUMROWS)
            {
               parent.z22.growaRow();
               var tbl = parent.z22.ele(0,0).parentNode.parentNode.parentNode;
               if (tbl.tagName=='TBODY')
                  tbl = tbl.parentNode;

               var arow = tbl.insertRow(NUMROWS+1);

               var ii=0;
               for(; ii<NUMROWS && extractfromm(parent.z22.getMat(ii,0))!='';ii++);
               for (var k=0; k < tbl.rows[ii+1].cells.length; k++)
               {
                   var acell = arow.insertCell(k);
                   acell.innerHTML = tbl.rows[ii+1].cells[k].innerHTML.replace(ii + "_",NUMROWS + "_").replace("(" +ii+ ",","(" +NUMROWS+ ",");
               }
               parent.z22.setNUMROWS(++NUMROWS);
            }
         }

         if (j!=i)  parent.z22.swaprow(i,j);
         */
         if (j == numRows1 )
            notdone += extractfromm(parent.z21.getMat(i,0)) +  " " + parent.z21.getMat(i,1) +"<br>";
         else
            parent.z22.document.form1.checkbox[j].checked = true;
      }
      var extra = "";
      for (var i = 0; i < numRows1; i++)
      {
         if (parent.z22.document.form1.checkbox[i].checked == false)
         {
            extra += extractfromm(parent.z22.getMat(i,0)) +  " " + parent.z22.getMat(i,1) +"<br>";
         }
      }
      if (extra!='')
         parent.z22.myprompt(textmsg[889] +"<br>" + extra );
      if (notdone=='')
         parent.z21.myprompt(textmsg[101]);
      else
         parent.z21.myprompt(textmsg[102] + "<br>" + notdone);
}
/* var str = "DataTable?rdap=curriculumview&subdb=&wcds=" + sql +"&onbegin=" + onbegin1;
    var subwin = parent.frames['z21'];
    if (subwin==null) subwin = parent.parent.frames['left'].frames['z21'];
    subwin.location.href = str;
    */
     
 

function syn5()
{
    syn4();
    syn2();
} 
function syn1()
{
    var str = "studentadvising.jsp?mode=openz12&majorprogram=" + majorprogram + "&minorprogram=" + minorprogram;
    var subwin = parent.frames['z21'];
    if (subwin==null) subwin = parent.parent.frames['left'].frames['z21'];
    subwin.location.href = str;
}
 function syn2()
{
    var nrs = parent.z21.passoverNumRows() + 5;
    str = "DataTable?onclose=" + onclose1 +"&subdb=&rdap=coursetaken" + codes +"&sid=" + sid + "&numrows="  +nrs;
    window.open(str, "z22");
}
function syn4()
 {
      var ss=0.0;
      var tt=0.0;
      var xx=0.0;
      var numRows = parent.z21.passoverNumRows();  
      for(var r=0;r < numRows; r++)
      {
         var sl = parent.z21.getMat(r,3);   
         xx= parseFloat(sl.charAt(0))/(0.0+parseFloat(sl.charAt(2)));
         sl = parent.z21.getMat(r,5); 
         var yy = parseFloat(sl); 
         ss += xx;  
         tt += xx*yy; 
      }
      xx = parent.z21.numberstr(''+ss,'0');
      parent.z21.setv(numRows,3, xx);
      xx = parent.z21.numberstr(''+tt,'0');
      parent.z21.setv(numRows,5, xx);
 }
    
function block(sem,nt)
{ 
   var numRows2 = parent.z22.passoverNumRows();  
   var str = '<table width="100%" cellpadding=0 cellspacing=1 border=0 bgcolor=' + IBGCOLOR + '><tr><td>';
   
   if (sem!= '')
   {
      str += '<table   width="100%" cellpadding="0" cellspacing="0" border="0" align="center">'
      +'<tr><td bgcolor='+IBGCOLOR+'  align=center> <font color="#DDCC11" size=4><b>' 
      + sem 
      +'</b></font> </td></tr>'
      +'</table>';
   } 
    
   str+='<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="white" class="yhmnwbd">'
   +'<tr><td align=left valign=center>'
   +'<table width="100%" cellspacing="1" cellpadding="3" border="2" style=\"border-collapse:collapse\">' 
   +'<tr ><td width=50><nobr>' + textmsg[152]  +'</td><td><nobr>' + textmsg[604]   
   + "</td><td align=right width=60><nobr>" + textmsg[470]
   + "</td><td align=right width=60><nobr>" + textmsg[29] + '</td></tr>';
   
   var total=0,num=0,cunt=0;
   for (var i = 0; i < numRows2; i++)
   {

      if (parent.z22.getMat(i,4)==sem && parent.z22.getMat(i,6)=='1')
      {
          cunt++;
          str +='<tr  bgcolor=#EDEEEE><td width=50><nobr>' +  parent.z22.getMat(i,7)  +'</td><td><nobr>' + parent.z22.getMat(i,1) +"</td><td align=right width=60><nobr>" + parent.z22.getMat(i,8)+ "</td><td align=right width=60><nobr>&nbsp;" +
          parent.z22.getMat(i,2) +'</td></tr>';
          var credit = parseInt(parent.z22.getMat(i,8)); 
         if (parent.z22.getMat(i,2)!='')
         {
           var numgrade = numeric(parent.z22.getMat(i,2));
           if (numgrade>=0)
           { 
               nt[0]+=credit;
               nt[1]+=numgrade*credit;
               total += numgrade*credit;
           }
           
         }
         num+=credit;
      }
      else if (parent.z22.getMat(i,4)==sem && parent.z22.getMat(i,6)=='0')
      {
         cunt++;
         str +='<tr><td width=50><nobr>' +  parent.z22.getMat(i,7)  +'</td><td><nobr>' + parent.z22.getMat(i,1) +"</td><td align=right width=60>" + parent.z22.getMat(i,8)+ "</td><td align=right width=60>&nbsp;" + 
         parent.z22.getMat(i,2) +'</td></tr>';
         var credit = parseInt(parent.z22.getMat(i,8));

         if (parent.z22.getMat(i,2)!='')
         {
           var numgrade = numeric(parent.z22.getMat(i,2));

           if (numgrade>=0)
           { 
               nt[2]+=credit;
               nt[3]+=numgrade*credit;
               total += numgrade*credit;
           }
         }
         num+=credit;
      }
       
   }
   if (cunt==0) return "";
   var gpa = '&nbsp;';
   str += "<tr><td colspan=2 align=right><nobr>" + textmsg[194]+ "</td><td align=right width=60>" + num + '</td><td>&nbsp;</td></tr>';
   if (total>0)
   { 
      gpa =   parent.z22.numberstr(''+(total/num),'2');
      str += "<tr><td colspan=3 align=right><nobr>" + textmsg[625]+ "</td><td align=right width=60>" + gpa + '</td></tr>';
   }
   str +='</table></td></tr></table></td></tr></Table>';
   return str;
}
 
 
 
function log1(rr,cc,x,v)
{ 
  var cid = nav4.retrv(rr,0);
  var ctitle = nav4.retrv(rr,1);
  
  if   (cc==7)
  {  
     if (v=='')
     {
        if (nav4.retrv(rr,6)!='')
        {nav4.setv(rr,6,'');
        nav4.setv(rr,9,'');
        nav4.setv(rr,11,'0');
        }
        else  nav4.setvaluechanged(rr,false);
     }
     else
     {
        var zz=v.split(",");
        var bx = false;
        if (zz[0]!=nav4.retrv(rr,6))
        {
           nav4.setv(rr,6,zz[0]);
           nav4.setv(rr,9,zz[1]);
           bx= true;
        }
        
        var bb = nav4.retrv(rr,11);
        bx = (bx || (bb!=nav4.retrv(rr,11)));
        nav4.setvaluechanged(rr, bx);
        nav4.focus();
        if (bb=='1')
        { 
           if (!confirm( textmsg[771] + nav4.retrv(rr,1) + textmsg[772]) ) 
              nav4.setv(rr,11,'13');
        }
        else if (bb=='13')
        { 
           if (confirm(textmsg[771] + nav4.retrv(rr,1) + textmsg[772]) ) 
              nav4.setv(rr,11,'1');
        }
        
     }  
  }
 
}
  
postopen("DataSelect?rdap=curriculumsearch&subdb=&nobg=1&majorprogram=" 
           + encodeURIComponent(majorprogram) + "&minorprogram=" 
           + encodeURIComponent(minorprogram) + "&makescript=curriculumsearch&onbegin=7"

           ,"z11");
  
var helpstr = textmsg[756] + "\n" + textmsg[757] +"<!---->";
var popwin1 = "pophelp";