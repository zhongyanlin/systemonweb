/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
window.onerror = handleError;
function handleError( errType, errURL, errLineNum ) 
{
   window.status = "Error: " + errType + " on line " +  errLineNum;
   return true;
} 

var tian = new Array(20);
var start = new Array(20); 
var end = new Array(20);
var tmpstr = "";
var ll;
function isdigit(x)
{ 
    return (x.replace(/[0-9]/,'')=='');
}
function  split() 
{
    var x = tmpstr; 
    tmpstr="";
    var i=0;
    var l = 0;
    while (true) 
    {
            start[l] = end[l] = 0;
            while ( i < x.length && (x.charAt(i) ==' '||x.charAt(i) ==','||x.charAt(i) ==';'))i++;
            if (i == x.length ) break;
            var k = i;
            while ( i < x.length && !isdigit(x.charAt(i)) && x.charAt(i) != ' ') i++;
            if (i == x.length ) break;
            tian[l] = x.substring(k,i);   
 
            if (tian[l]=="" && l>0) 
                  tian[l] = tian[l-1];
            if ( l == 0)
                tmpstr += tian[l];
            else
                tmpstr += "," + tian[l];
 
            while ( i < x.length && (x.charAt(i) ==' ' || x.charAt(i) =='0')) i++;
            k = i;
            while ( i < x.length &&  isdigit(x.charAt(i)) )i++;
            if (i == x.length ) break;
            var tmp =  parseInt(x.substring(k,i));
 
            if (tmp <8) tmp += 12;
            tmp =tmp%24;
            while ( i < x.length &&  x.charAt(i)==' ' )i++;

 
            if (x.charAt(i) == '-' || x.charAt(i) == '~') 
            {
                start[l] = tmp*60;
                if (tmp>9) tmpstr += tmp  + ":00-";
                else if (tmp!=0) tmpstr += "0" + tmp +":00-";
                else tmpstr += "00:00-";
            } 
            else if (x.charAt(i) == ':') 
            {
                while ( i < x.length &&  x.charAt(i)==' ' )i++;
                k = i;
                while ( i < x.length &&  isdigit(x.charAt(i)) )i++;
                if (k==i) 
                {
                    start[l] = tmp *(60);
                    tmpstr += tmp +":00-";
                } 
                else 
                {
                    var cc = x.substring(k,i);
                    if (i>k+2) cc = cc.substring(0,2);
                    
                    start[l] = tmp*60 + parseInt(cc);
                    if (i==k+1) cc = "0"+cc;
                    tmpstr += tmp+":"+cc+"-";
                }
                
                while ( i < x.length &&  x.charAt(i)!='-' && x.charAt(i)!='~' )i++;
            } 
            else break;
            
            while ( i < x.length &&   (!isdigit(x.charAt(i)) || x.charAt(i)=='0') )i++;
               k = i;
            while ( i < x.length &&  isdigit(x.charAt(i)) )i++;
            if (i == k) break;
            tmp =  (parseInt(x.substring(k,i)));
        
            if (tmp < 9) tmp += 12;
            tmp = tmp%24;
 
            tmpstr += tmp;
            if ( i < x.length &&  x.charAt(i) ==':' ) 
            {
                i++;
                k = i;
                while ( i < x.length &&  isdigit(x.charAt(i)) )i++;
                if (k<i) 
                {
                    var cc = x.substring(k,i);
                    if (i>2+k) cc = cc.substring(0,2);
                    var kk = parseInt(cc);
                    end[l] =  tmp*60 + kk;
                    if (kk<10&& k+2<i)
                        tmpstr += ":0" + x.substring(k,i) +"";
                    else tmpstr += ":" + cc +"";
                } else {
                    end[l] = tmp*60;
                    tmpstr += tmp + ":00";
                }
            } 
            else 
            {
                end[l] = tmp*60;
                tmpstr += tmp + ":00";
            }
            tmpstr = tmpstr.replace(/:000+/g,":00");
            
            l++;
        } 
        return l;        
}

function  jiao(  a,   b) 
{
        for (var i=0; i<a.length;i++)
            for (var j=0; j < b.length; j++)
                if (a.charAt(i)==b.charAt(j))
                    return true;
        return false;
} 

function max(xx,yy){if (xx>yy) return xx;return yy;}
function min(xx,yy){if (xx>yy) return yy;return xx;}
 
function  isjiao1( x ) 
{
        var a = x[0], b= x[1];
        tmpstr = x[0];
        
        var l1 = split();
        x[0] = tmpstr;
        var  tian1 = new Array(20);
        var  start1 = new Array(20);
        var  end1 = new Array(20);
        for (var i =0; i < l1; i++) 
        {
            tian1[i] = tian[i]; 
            start1[i]= start[i]; 
            end1[i] = end[i];
            
        }
        tmpstr = x[1];
        var l2 = split();
        x[1] = tmpstr;
        var dis = 0;
        if (l1==0 || l2==0) return (a==b);
        for (var i =0; i < l1; i++)
        for (var j=0; j < l2; j++) 
        {
            dis = min(end1[i],end[j]) - max(start1[i],start[j]);
            if ( jiao(tian[i],tian1[j]) && dis > 0 )
            {
               return true;
            }
        }  
        return false;
} 



function isjiao2(a,b)
{

       var x=new Array(2);
       x[0]=a;
       x[1]=b;
       return isjiao1(x);
 }
 
 