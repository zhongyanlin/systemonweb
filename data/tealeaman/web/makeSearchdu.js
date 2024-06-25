/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
function handleErr(msg, url, l)
{
      var txt= "There was an error on this page.\n\n" + 
              "Error: " + msg + "\n" + 
              "URL:   " + url + "\n" + 
              "Line:  " + l + "\n\n"  + 
              "Click OK to continue.\n\n";
     
      window.onerror = handleErr;
      return true;
}
window.onerror = handleErr;
 

 
function setrdapname(ii)
{ 
   if (ii ==1)
   {
     // document.thisform.rdap.value=rdapname.substring(0,rdapname.length-1);
      var df = document.form1.displayformat;
      if (df)
      formnewaction(document.thisform,df.options[df.selectedIndex].value);
      
      document.thisform.onbegin.value='';
   }
   else
   {
      // document.thisform.rdap.value=rdapname.substring(0,rdapname.length-1) + "1";
       
       formnewaction(document.thisform,deleteQuery);//"DataForm";
       document.thisform.onbegin.value='50';
   }
}
function allowenter1(c,evt)
{ 
     //if (r >= numRows) return true;
     if (ctype[c] ==ctype[c].toUpperCase()) return false;

     if (dtype[c] =='n' && !isDigitEvent(evt))
         return false;
     return true;
}

 
theight = 90 + numCols*30 + hc; 

var nn; 
 
var f1 = document.form1; 
var f2 = document.thisform;
function timesubmit()
{
    expiretime = activeidletime + (new Date()).getTime();
    
     visual(f2);
     f2.submit();
   
}
resumehalted = function()
{
    expiretime = activeidletime + (new Date()).getTime();
    f2.submit();
}
function newrecord()
{
    var rdapstr = rdapname;
    if (rdapname.length>9) rdapstr=rdapname.substring(0,9);
    f2.wcds.value = "";
    f2.target = parent.frames[1].name;
    for (var i=0; i < numCols; i++)
       f2.elements[i].value = retrv(0,i);
    formnewaction(f2);
    visual(f2);
    timesubmit();
}

function setaction(n)
{
   if (periodvalue ==1)
   {
       if (rr>=0 && cc>=0) 
           U(rr,cc);
   }
   for (var i=0; i < numCols; i++)
       f2.elements[i].value = retrv(0,i);
   var did = false; 
   var doit = false;
   if (n ==5) n =3;
    
   nn = n; 
   if (n  == 1)
   {
      if( formstr()  == true)
      {
         did = true;
         
        visual(f2);
 timesubmit();
      }
   }
   else if ( n  == 2)
   {
      did = formstr(); 
      for (i=0; i < self.frames.length; i++) 
      {
        if (self.frames[i].name.indexOf("iframe")  == 0 && self.frames[i].setaction(2))
           did =true;
      }
   }
   else if (n ==3)
   {
      
      for (i=0; i < self.frames.length; i++) 
     {
       if (self.frames[i].name.indexOf("iframe")  == 0 && self.frames[i].setaction(3))
          did =true;
     }
     if (did  == false)
     {
        if (deletelabel ==textmsg[69])
        {
        if (confirm(textmsg[349] + deletelabel + textmsg[350] + "?")  == false)
           return false;
        }
        did = gosetaction(did);
     }
   }
   return did;
}

function gosetaction(did)
{
    for (var i=0; i < self.frames.length; i++)
    {
        if (self.frames[i].name.indexOf("iframe")  == 0 && self.frames[i].setaction(5) )
              did = true;
    }
    if( formstr()  == true)
    {
       visual(f2);
 timesubmit();
        did = true;
    }
    return did;
}
 
function dosearch()
{
    setrdapname(1);
    setaction(1);
   
}
 
function replaceAll(a, b, c) 
{ 
   
   var d = a; 
   var cc = c.replace(/'/g,"''");   
    while (d.indexOf(b) > -1) 
   { 
      d = d.replace(b, cc); 
   } 
   return d; 
} 
  
function showNext()
{
   myprompt( query+'\n\n'+insertQuery +'\n\n'+updateQuery+'\n\n'+deleteQuery);
} 
var popwin = parent.frames[1].name;

function formstr() 
{ 
   if (nn  == 4) 
   { 
      myprompt(helpstr);
      return false; 
   } 
   f2.id.value = iid; 
   var sqlstr = ''; 
   var i = counter; 
   var setstr = updateQuery ; 
    
   if (nn  == 3) setstr = "d"+deleteQuery ; 
   if (i  == numRows ) setstr = "i"+insertQuery;
    
   if (domandatory(0) ==false){ return false; }
   
   sqlstr = subs1(setstr,i) ; 
   
   popstr = dim(300,200); 
    
   if (nn  == 2) 
   { 
      myprompt(sqlstr);
      return false; 
   } 
    
   f2.wcds.value = sqlstr; 
   formnewaction(f2,subs2(f2.action));
   if (self.name  == 'searchwn') 
      f2.target = parent.name;
   else
      f2.target = popwin; 
   return true;
} 



function subs2(s)
{    
       var newvalue;
      
       
       if (s  == null) 
           return null;
       var state = 0;
       var sq = false;
       var i = 0, j = -1;
       var N = s.length;
       var num = "";
       var ans = "";
       var kk = 0;
       var inquo = false;
       for (; i < N; i++)
       {
          if (s.charAt(i)  == '@')
          {
               switch(state)
               {
                      case 11:  
                      j = parseInt(num); 
                      if (''+j  == 'NaN' || j >= numCols)
                      {
                         ans += '@'+num+'@';
                         state=0; num="";
                         break;
                      }

                      newvalue = retrv(0,j); 
                      if (newvalue  == null) 
                          newvalue=nullvalue[j];
                      ans += newvalue;
                       
                          
                      num = "";
                      state = 0;
                      break;

                 
                  case 0:
                     state=11;
                     num="";
                     break;  
                  
               } 
          }
          else 
          {
              switch(state)
               {
                  case 0:  
                     ans += s.charAt(i);  
                     break;  

                  case 11:  
                     num += s.charAt(i);
                     break;
               
              } 
          }
     }

     return ans;   
}
function goodtoken(c)
{
   return c  == '.'||c  =='_' || c <='Z'&&c>='A' || c <='z' && c >='a' || c <='9'&& c>='0';
}


function subs1(s, K)
{   
       var newvalue;
       s = s.replace(/^[ ]+/,'');
       var go = false;
       var halt = false;
       if (s  == null) 
           return null;
       var state = 0;
       var sq = false;
       var i = 0, j = -1;
       var N = s.length;
       var num = "";
       var ans = "";
       var kk = 0;
       var inquo = false;
       var z,k;
       for (i=0; i < N; i++)
       {
          if (s.charAt(i)  == '|')
          {
               switch(state)
               {
                  case 0: 
                      state=1; 
                      num="";
                      break;
                  case 1:
                      j = parseInt(num);
                      if ( "" + j  != 'NaN' && j < numCols) 
                      {
                         if ( (   mat[K][j] == nullvalue[j]) && ( ctype[j] =='r' || ctype[j] =='s'))
                          {
                                 k = ans.length - 4; 
                                 while (k>=0 && ans.substring(k,k+3)  != "(((") k--; ans = ans.substring(0,k) + " 1=1 ";
                                 while ( i+4 < s.length && s.substring(i+1, i+4) !=")))")i++; i+=4; 
                          }
                          else 
                          if (mat[K][j] != nullvalue[j])
                               ans +=   mat[K][j].replace(/'/g,"''")  ;
                      }
                      state = 0;
                      num = "";
                      break;
              
                 case 11:
                     state = 1;
                     num="";
                     break;
                  
              } 
          } 
          else if (s.charAt(i)  == '@')
          {
               switch(state)
               {
                      case 11:
                      j = parseInt(num); 
                      if (''+j  == 'NaN' || j >= numCols)
                      {
                         ans += '@'+num+'@';
                         state=0; num="";
                         break;
                      }

                      newvalue = retrv(K,j);
                      // lert("s=" + s.substring(0,i+1) +"\n\nans=" + ans +"\n\nvalue=" + newvalue + "\n\nK=" + K + ",j=" + j);
                      if (newvalue  == null) 
                          newvalue = nullvalue[j];
                       
                      if (newvalue !=mat[K][j])
                      { 
                          
                          if (newvalue == nullvalue[j] && (ctype[j] =='r' || ctype[j] =='s'))
                          { 
                              z = ans.length-3;
                              while (z >= 0 && ans.substring(z,z+3)  != "(((") z--;
                              ans = ans.substring(0,z) + " 1=1 ";
                              while (i+4 < s.length && s.substring(i+1, i+4) !=")))")i++; i+=4; 
                          }
                          else if ((ctype[j] =='n' || ctype[j] =='m') && ele(K,j).value.replace(/ /g,'') =='')
                          {
                              ans = ans.replace(/[ ]+$/,'');
                              
                              if (ans !='')
                              {
                                 if (ans.charAt(ans.length-1) =='=' || ans.charAt(ans.length-1) =='>' || ans.charAt(ans.length-1) =='<')
                                 {
                                   ans = ans.replace(/.$/,'');
                                   ans = ans.replace(/>$/,'').replace(/<$/,'').replace(/[ ]+$/,'');
                                   if (ans !='')
                                   {
                                    z = ans.length-1;
                                    while (z>=0 && goodtoken(ans.charAt(z))){ans = ans.replace(/.$/,'');z--;}
                                    ans += " 1=1";
                                   }
                                 }
                              }
                              ans += " ";
                              while (i < s.length-1 && s.charAt(i+1) ==' ')i++;
                              i++;
                              if (i<s.length-1)
                              {
                                 if (s.charAt(i) =='=' || s.charAt(i) =='<' || s.charAt(i) =='>')
                                 {
                                    while (i< s.length-1 && (s.charAt(i+1) ==' '||s.charAt(i+1) =='='))i++;
                                    while (i< s.length-1 && goodtoken(s.charAt(i+1)))i++;
                                    ans += " 1=1 ";
                                     
                                 }
                              }
                              i--;
                          }
                          else   
                          {
                           
                             if ((''+newvalue).indexOf("'")>=0)
                                  ans +=  newvalue.replace(/'/g, "''");
                             else
                                  ans += newvalue;
                          }
                      }
                      else  
                      {
                            
                           if (mat[K][j] == nullvalue[j] && (ctype[j] =='r' || ctype[j] =='s'))
                          { 
                              k  = ans.length-3;
                              while (k > 0 && ans.substring(k,k+3)  != "(((") k--; 
                              ans = ans.substring(0,k) + " 1=1 ";
                              while (i+4 < s.length && s.substring(i+1, i+4) !=")))")
                                 i++; 
                              i+=4; 
                          }
                          else if ((ctype[j] =='n' || ctype[j] =='m') && ele(K,j).value.replace(/ /g,'') =='')
                          {
                              ans = ans.replace(/[ ]+$/,'');

                              if (ans !='')
                              {
                                 if (ans.charAt(ans.length-1) == '=' || ans.charAt(ans.length-1) =='>' || ans.charAt(ans.length-1) =='<')
                                 {
                                   ans = ans.replace(/.$/,'');
                                   ans = ans.replace(/>$/,'').replace(/<$/,'').replace(/[ ]+$/,'');
                                   if (ans !='')
                                   { 
                                    z = ans.length-1;
                                    while (z>=0 && goodtoken(ans.charAt(z))){ans = ans.replace(/.$/,'');z--;}
                                    ans += " 1=1";
                                   }
                                 }
                              }
                              ans += " ";
                              while (i < s.length-1 && s.charAt(i+1) ==' ')i++;
                              i++;
                              if (i<s.length-1)
                              {
                                 if (s.charAt(i) =='=' || s.charAt(i) =='<' || s.charAt(i) =='>')
                                 {
                                    while (i< s.length-1 && (s.charAt(i+1) ==' '||s.charAt(i+1) =='='))i++;
                                    while (i< s.length-1 && goodtoken(s.charAt(i+1)))i++;
                                    ans += " 1=1 ";
                                 }
                              }

                                i--;
                          }
                          else  
                          {
                              if ((''+mat[K][j]).indexOf("'")>=0)
                                  ans += mat[K][j].replace(/'/g,"''")  ;
                              else
                                  ans += mat[K][j];
                          }
                          
                      }
                      
                       
                      num = "";
                      state = 0;
                      break;

                 
                  case 0:
                     state=11;
                     num="";
                     break;  
                  case 1:
                     state = 11;
                     num="";
                     break;
                   
               } 
          }
          else 
          {
              switch(state)
               {
                  case 0:  
                     ans += s.charAt(i);
                     break;  

                  case  1: case 11:  
                     num += s.charAt(i);
                     break;
              } 
          }
     }
     //lert("ans=" + ans +"\n\nnum=" + num + "\n\ns=" + s);
     s = ans; 
     
     var word="";
     ans = "";
     N =  s.length;
     state = 0;
     
     for (i=0; i < N; i++)
     {
          if (s.charAt(i)  == '\'')
          {
              switch(state)
              {
                 case 0:  
                      word = word.replace(/[a-z|0-9|\.|_]+[ |\t|\n|\r]*[>|<]*=[ |\t|\n|\r]*and[ |\t|\n|\r]/ig, "1=1 AND ");
                      word = word.replace(/[a-z|0-9|\.|_]+[ |\t|\n|\r]*[>|<]*=[ |\t|\n|\r]*or[ |\t|\n|\r]/ig, "1=1 OR ");
                      word = word.replace(/[a-z|0-9|\.|_]+[ |\t|\n|\r]*[>|<]*=[ |\t|\n|\r]*\)/ig, "1=1 )");
                      ans += word.replace(/1=1[ |\t|\n|\r]+and/ig,'') + "'"; 
                      state=1;  word = ""; break;
                 case 21: ans +="'"; state=1;  break;
                 case 1:  ans +="'"; 
                      ans = ans.replace(/[[a-z|0-9|\.|_]+[ |\t|\n|\r]+like[ |\t|\n|\r]+'%[%]?'/ig, ' 1=1 ');
                      
                 state=21; break;
              }
          }
          else
          {
              switch(state)
              {
                  case 0: word += s.charAt(i); break;
                  case 1:  ans += s.charAt(i); break;
                  case 21: ans += s.charAt(i); state=0; break;
              }
          } 
      }
 
      if (state  == 0)
         ans += word;
      ans = ans.replace(/[[a-z|0-9|\.|_]+[ |\t|\n|\r]+like[ |\t|\n|\r]+'[%][%]?'/ig, ' 1=1 ').replace(/1=1[ ]+and/ig,'').replace(/and[ ]+1=1/ig,'').replace(/1=1[ ]+or/ig,'').replace(/or[ ]+1=1/ig,''); 
  
      if (ans.replace(/[ ]*1=1[ ]+/,'')  == '')
             ans = "";
      ans = ans.replace(/[ |\n|\r|\t]+$/,'');
      ans = ans.replace(/\([ ]*1=1[ ]*\)/g, ' 1=1 ');
      ans  = ans.replace(/and[ |\n|\r|\t]+1=1/gi, '');
      ans  = ans.replace(/1=1[ |\n|\r|\t]+and/gi, '');
      for(var ii=0; ii < 10; ii++)
      {
         
          var ans1 = ans.replace(/[ |\n|\r|\t]*and$/i, '');
          ans1 = ans1.replace(/and[ |\n|\r|\t]+1=1$/i, '');
          if (ans1  == ans) break;
          ans =ans1;
      }
      ans = ans.replace(/where[ |\n|\r|\t]+1=1$/i, '');
      ans = ans.replace(/[ |\n|\r|\t]*where$/i, '');
   
      return ans.replace(/\n[ |\r|\t]*\n/g, ' '); 
}
 
 
function getPassed(str)
{
   if ( passedCol < 1) return;
   if (ctype[passedCol-1]  != 'a' && ctype[passedCol-1]  != 'A')
       str = str.replace(/\n/g,',');
   setv(counter,passedCol-1,str);   
   v = str;c=passedCol-1;
   if (cellonblur !='') eval(cellonblur);
   
}
 
function doonbegin()
{ 
for (var c=0; c < numCols; c++)
setv(0,c,defaultRecord[c]);
parent.document.title = ZQ[1];

if (typeof(document.form1.displayformat) != 'undefined')
{ 
var df = document.form1.displayformat;

if (mss[8].indexOf("DataForm")>= 0 || mss[8].indexOf("DataLongForm")>= 0)
{
   df.options[0] = new Option(textmsg[1281], mss[8]); 
   df.options[1] = new Option(textmsg[1282], mss[8].replace(/Data[a-z|A-Z]+/, 'DataTable')); 
   df.options[2] = new Option("CSV:Excel", mss[8].replace(/Data[a-z|A-Z]+/, 'DataCSV'));
  // df.options[3] = new Option(textmsg[1797], "gradingQuestion.jsp");
}
else if (mss[8].indexOf("DataTable")>= 0 )
{
   df.options[0] = new Option(textmsg[1282], mss[8]); 
   df.options[1] = new Option(textmsg[1281], mss[8].replace(/Data[a-z|A-Z]+/, 'DataForm')); 
   df.options[2] = new Option("CSV:Excel", mss[8].replace(/Data[a-z|A-Z]+/, 'DataCSV'));
 //  df.options[3] = new Option(textmsg[1797], "gradingQuestion.jsp");
}
else if (mss[8].indexOf("DataHTML")>= 0 )
{
    df.options[0] = new Option(textmsg[1282], mss[8]); 
    df.options[1] = new Option(textmsg[1281], mss[8].replace(/Data[a-z|A-Z]+/, 'DataFormHTML')); 
    df.options[2] = new Option("CSV:Excel", mss[8].replace(/Data[a-z|A-Z]+/, 'DataCSV'));
  //  df.options[3] = new Option(textmsg[1797], "gradingQuestion.jsp");
}
else if (mss[8].indexOf("DataFormHTML")>= 0 )
{
    df.options[0] = new Option(textmsg[1281], mss[8]); 
    df.options[1] = new Option(textmsg[1282], mss[8].replace(/Data[a-z|A-Z]+/, 'DataHTML')); 
    df.options[2] = new Option("CSV:Excel", mss[8].replace(/Data[a-z|A-Z]+/, 'DataCSV'));
 //   df.options[3] = new Option(textmsg[1797], "gradingQuestion.jsp");
}
else
{
    df.options[0] = new Option(textmsg[1307].split(/@/)[1],  mss[8]); 
    df.options[1] = new Option("CSV:Excel", mss[8].replace(/Data[a-z|A-Z]+/, 'DataCSV'));
  //  df.options[3] = new Option(textmsg[1797], "gradingQuestion.jsp");
}
}
if (onbegin !='')
{
    eval(onbegin);
} 
 
}
function setcellonblur(str){cellonblur=str;}
function getValue(j)
{ 
    return retrv(0,j); 
}
resizebut(document.thisform);  
doonbegin();
 
function reset1()
{
   populate(counter);
}

function jumpTo(v)
{
   if (event.keyCode  == 13)
   {
      populate(parseInt(v.value)-1);
      return true;
   }
   return  (event.keyCode >= 48 &&  event.keyCode <= 57);
}
 