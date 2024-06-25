var STONESIZE = CELLSIZE - 4; 
var NL = 19;
var BLACK = 'black';
var WHITE = 'white';
var TRANSPARENT = 'transparent';
var steptimer = document.getElementById('steptimer');
var gametimer = document.getElementById('gametimer');
var wishes = document.getElementById('wishes');
var msgboard = document.getElementById('resp');
var clickable = true;
var tryingid = '';
var mycolor = BLACK;
var hcolor = WHITE;
var gamestart = 0;
var status = intfcwds[1];
var himher=null;
var second1timer = null;
var second5timer = null;
var timelimit = 120;
var stepstart=0;
var delay = 0;
var fm = document.f;
var bcounter = 0, wcounter=0, gcounter=0;
var replys = ",";
var negotiatingform = null;
fm.mydan.selectedIndex = 0;
fm.hdan.selectedIndex = 0;
fm.yield.selectedIndex = 4;
fm.clr.selectedIndex = 0;
fm.first.selectedIndex = 0;
function tolang(n)
{
    if (status == intfcwds[1] || status == intfcwds[24])
    document.location.href= "go.jsp?lang="+n;
}
function regerror(err)
{
    document.getElementById('regerror').innerHTML = err;
}

function login()
{
    //myprompt("<iframe src=login.jsp width=300 height=250 />");
    window.open("login.jsp?follow=go.jsp", "w" + tstmp);
}

function logout()
{
     window.open("login.jsp?follow=logout", "w" + tstmp);
}

function register()
{
    myprompt("<span style=color:red id=regerror></span><form name=f style=\"margin:15px 0px 10px 15px\" method=post action=go.jsp target=\"w" + tstmp + "\" onsubmit=\"return validate(this)\"><table width=300 cellpadding=0px cellspacing=1><tr><td  class=label2>" + intfcwds[59] + "</td><td><input name=username class=text></td></tr>"
    + "<tr><td class=label2>" + intfcwds[60] + "</td><td><input  name=password  class=text type=password></td></tr><tr><td class=label2>" + intfcwds[61] + "</td><td><input name=email  class=text></td></tr>"
    + '<tr><td><img src="patchca.png" alt="captcha"  style="cursor:pointer;vertical-align:text-bottom;height:22px;line-height:22px;margin:0px 0px -3px 0px" onclick="randomit(this)">'
    +'</td><td><input type="text" class=text name="patchcafield" ></td></tr><tr><td colspan=2 align=center><input class=BlueButton type=submit style=width:70px value="' + intfcwds[58] + '"></td></tr></table></form>',null,null,intfcwds[58]);
}

function randomit(im)
{
    im.src = im.src.replace(/\?.*/,'') + '?' + Math.random();
}
function validate(f)
{
    if (f.username.value.replace(/ /g,'').length < 3)
    {
        f.username.value = f.username.value.replace(/ /g,'');
        document.getElementById('regerror').innerHTML = intfcwds[66]; return false;
    }
    if ( f.password.value.length < 8)
    {
        document.getElementById('regerror').innerHTML = intfcwds[67]; return false;
    }
    if ( f.email.value.replace(/ /g,'').length < 10 ||  f.email.value.indexOf('@') < 0 ||  f.email.value.indexOf('.') < 0)
    {
        f.email.value = f.email.value.replace(/ /g,'');
        document.getElementById('regerror').innerHTML = intfcwds[68]; return false;
    } 
    if ( f.patchcafield.value.replace(/ /g,'').length !=4 )
    {
        f.patchcafield.value = f.patchcafield.value.replace(/ /g,'');
        document.getElementById('regerror').innerHTML = intfcwds[69]; return false;
    } 
}
function getstone(i, j)
{
    return document.getElementById('s' + i + "_" + j);
}
function setcolor(d,clr)
{
    if (d== null) return;
    if (clr == BLACK || clr == WHITE)
    {
        d.innerHTML = '<img class=nosel src=image/' + clr + 'stone.png style=margin:0px;border:0px;width:' + STONESIZE + 'px >';
        d.style.backgroundColor = null;
    }
    else  
    {
        d.innerHTML = '';
        d.style.backgroundColor = clr;
    }
}
function cord(i,j){ document.getElementById('cord').innerHTML = '(' + i + "," + j + ")";}
function cord1(){ document.getElementById('cord').innerHTML = '';}
function getcolor(i, j, v )
{ 
    if (v!=null &&  v.indexOf(',' + i + "_" + j + ",")>=0) 
        return 'visited';
    var y= getstone(i,j);
    if (y==null) 
        return 'outside'; 
    var p = y.innerHTML;
    if (p.indexOf(BLACK)>=0) return BLACK;
    if (p.indexOf(WHITE)>=0) return WHITE;
     
    if (y.style.backgroundColor.indexOf("#999999")>=0 
            || y.style.backgroundColor.toLowerCase().replace(/ /g,'').indexOf("rgb(153")>=0
            || y.style.backgroundColor.toLowerCase().indexOf("grey")>=0)
    {
        
        return 'grey';
    }
    return TRANSPARENT;
}
function deletemode()
{
    
    if(fm.giveup.value == intfcwds[13])
    {
        holdstatus = status;
        setstatus(intfcwds[17]);
        fm.giveup.value = intfcwds[18];
    }
    else if(fm.giveup.value == intfcwds[35])
    {
        setstatus(intfcwds[1]);
        fm.giveup.value = intfcwds[13];
        giveup2();
    }
    else 
    {
        setstatus(holdstatus);
        fm.giveup.value = intfcwds[13];
    }
}
function draw(n)
{
    var clr = TRANSPARENT;
    var marginwdith = 6;
    var bordercolor = TRANSPARENT;
    if (n == 18) 
    {     
        marginwdith = 22;
        bordercolor = '#222222';
    }
    var tbl = document.createElement('table');
    if (n == NL) tbl.id = 'board';
    tbl.style.cssText = ';border-radius:4px;border-collapse:collapse;position:absolute;left:' + marginwdith 
                        + "px;top:" + (marginwdith + 50) 
                        + 'px;border-color:' + bordercolor 
                        + ';background-color:transparent;z-index:' + (-16+n);
    tbl.border = '0';
    tbl.cellspacing = '0';
    tbl.cellpadding = '0';
    var border = ""
    var ss = ''
    for (var i=0; i < n; i++)
    {
        ss += '<tr height=' + CELLSIZE + '>';
        for (var j = 0; j < n; j++)
        {   
            var q = ''; 
            if (n==NL) q = ' id=s' + i+ '_' + j;
            ss +=  '<td width=' + CELLSIZE + ' style="border:1px ' + (n==18?'#000055':'transparent') + ' solid"><div ' + q + ' style="margin:0px 0px 0px 0px;width:' + STONESIZE 
                    + 'px;height:' + STONESIZE + 'px;border-radius:14px;background-color:transparent" onclick=clickstone(this)  onmouseover=cord(' + i + ',' + j +') onmouseout=cord1()></div></td>';
        }
        ss += "</tr>";
    } 
    tbl.innerHTML = ss;
    document.body.appendChild(tbl);
   
}
draw(NL-1);draw(NL);
var board = document.getElementById('board');
document.getElementById('a').style.width = board.offsetWidth + 'px';
document.getElementById('a').style.height = (board.offsetHeight) + 'px';
var playerq = document.getElementById('playerq');

function getcord(d)
{
    var z =  d.id.substring(1).split(/_/);
    return [parseInt(z[0]), parseInt(z[1])];
}
function changedanorname()
{
    var t = fm.me.value;
    if (fm.mydan.selectedIndex > 0) 
        t += '(' + fm.mydan.selectedIndex + ')';
  //  Msg.set('sname', Msg.hex( t));
}
fm.mydan.onchange = changedanorname;
fm.me.onchange = changedanorname;

function appendmsg(x)
{
      msgboard.innerHTML +=    "<br>" +x;
}
setcolor(document.getElementById('myclr'), BLACK);
setcolor(document.getElementById('hisclr'), WHITE );
var visited = ',';
var foundcolor = '';
var counter = 0;
var stack = [];
var stacksize=0; 
var maxstacksize = 0;
var returnsoon = true;
function isblack(l)
{
    l = l.toLowerCase().replace(/ /g,'');
    return (l == 'rgb(0,0,0)' || l == BLACK || l == '#000' || l =='#000000');
}
function isgrey(l)
{
   l = l.toLowerCase().replace(/ /g,'');
   return (l == 'rgb(153,153,153)' || l == 'grey' || l == '#999' || l =='#999999')  
}
function iswhite(l)
{
   l = l.toLowerCase().replace(/ /g,'');
   return (l == 'rgb(255,255,255)' || l == WHITE || l == '#fff' || l =='#ffffff')  
}


function alongborder(a,i,j, maincolor)
{
    if (goway == 1)
       return 0;
    if (goway == 2)
    {
        var k = Math.floor(Math.random() * a.length);
        if (k == a.length) k = a,length-1;
        return k;
    }
    
        for (var   k=0; k < a.length; k++)
        {
             
            var u = [a[k][0] - i, a[k][1]-j]; 
            var v;
            if (u[0] == -1 && u[1] == 0)
                v = [0, -1];
            else if (u[0] == 0 && u[1] == 1)
                v = [-1, 0];
            else if (u[0] == 1 && u[1] == 0)
                v = [0, 1];
            else v = [1, 0];
            var right = [i + v[0], j+v[1]];
            
            var c1 = getcolor(right[0], right[1], visited);
            if (c1!=maincolor && (c1==BLACK || c1 == WHITE || c1 ==TRANSPARENT))
            { 
                if (foundcolor=='') 
                    foundcolor = c1; 
                else if (foundcolor!=c1) 
                {
                    foundcolor = 'undecided';
                    if (returnsoon) return -1;
                }
            }
            if (c1 != maincolor)
                break;
            
        }
        return k;
}
function next(i,j, maincolor)
{
    
    var c = getcolor(i,j,visited); 
    if (c !=maincolor ) return null;
    visited += i + '_' + j + ',';
    if (returnsoon == false) setcolor(getstone(i,j), '#999999');
    stack[stacksize++] = [i,j];
    if (maxstacksize < stacksize) maxstacksize = stacksize;
    var r = [ [i,j-1], [i-1, j], [i,j+1], [i+1, j] ];
    var a = [];
    for (var k = 0; k< 4; k++)
    {
        var c1 = getcolor(r[k][0], r[k][1],visited); 
        if (c1 == maincolor)
        {
            a[a.length] = r[k];
        }
        else  if (c1==BLACK || c1 == WHITE || c1 ==TRANSPARENT) 
        { 
             if (foundcolor=='') 
                foundcolor = c1; 
            else if (foundcolor!=c1) 
            {
                foundcolor = 'undecided';
                if (returnsoon) return;
            }
        }
    }
    var nb = a.length;
    if (nb == 4)
    {
        return [i, j-1];
    }
    else if (nb==1)
    {
        return  a[0];
    }
    else if (nb==2 || nb==3)
    {
       
         var k = alongborder(a,i,j,maincolor);
         
        return a[k];
    }
    else
    {
        stacksize--; 
        while (stacksize-1 >= 0)
        {
            var b = stack[stacksize-1];
            i = b[0];
            j = b[1];
            var r = [ [i,j-1], [i-1, j], [i,j+1], [i+1, j] ];
            var a = [];
            for (var k = 0; k< 4; k++)
            {
                var c1 = getcolor(r[k][0], r[k][1],visited); 
                if (c1 == maincolor)
                {
                    a[a.length] = r[k];
                }
            }
            var nb = a.length;
            if (nb == 0)
            {
                stacksize--;
                continue;
            }
            else if (nb==1)
            {
                return  a[0];
            }
            else if (nb==2 || nb==3)
            {
                
              
               var k = alongborder(a,i,j,maincolor);
             
                return a[k];

            }
            else   if (nb==4) return null; // impossible unless error
           
        }
        return null;
    }
}

 

function pause()
{
   // var t = (new Date()).getTime();
   // while ( t + 100 > (new Date()).getTime()){}
}

function Queue()
{ 
 this.max=0;
 this.s='';
 this.l =0;
 this.dequeue=function(){
    var i = this.s.indexOf(',');
    if (i <1) return null;
    var t = this.s.substring(0,i);
    if (i == this.s.length-1) this.s = '';
    else this.s = this.s.substring(i+1);
    
    this.l--;
    return t;
 } 
 this.enqueue=function(item){
  if (("," + this.s).indexOf("," + item + ",")>=0) return;
  this.s += item + ",";
  this.l++;
  if (this.max < this.l) this.max = this.l;
 }
 this.size = function()
 {
     return this.l;
 }
}

var queue = null;

function moretodo( )
{
       for (var i=0; i < NL; i++)
       {
           for (var j=0; j < NL; j++)  
           if (getcolor(i,j,visited) == TRANSPARENT) 
               break;
           if (j != NL) break;
       }
       
       if (i < NL && j < NL) 
       {
          return [i, j];
       }
       else
       { 
           return null;
       }  
          
}

function ren(t)
{
    if (Msg.rid!='')
         Msg.send({code:'html',sname:(t.value),msg:''})
    //Msg.send({code:'html',sname:Msg.hex(t.value),msg:''})
}

function  breadth(i,j,maincolor)
{
    if (getcolor(i, j) != maincolor) return;
    visited = ',';
    queue = new Queue();
    parentv = new Array();
    foundcolor = '';
    returnsoon = false;
    queue.enqueue(i + '_' +j);
    visit(maincolor);
    
}
var parentv;
var destiny = null;
function routing()
{
    if (status == intfcwds[19]) uncount();
    var ss = document.getElementById('source');
    var ds = document.getElementById('destiny');
    if (ss==null || ds==null) return;
    destiny = ds.value.replace(/ /g,'').replace(/,/,'_');
    var source = ss.value.replace(/ /g,'');
    if (destiny.replace(/[0-9]+_[0-9]+/,'')!='' || source.replace(/[0-9]+,[0-9]+/,'')!='')
    {
        myprompt('Enter the source and destination in the format like 7,8'); return;
    }
    var  sss = source.split(/,/);
    var  des = destiny.split(/_/);
    if (getcolor( parseInt(sss[0]),parseInt(sss[1])) != TRANSPARENT) 
    {
        myprompt( intfcwds[20]); return;
    }
     if (getcolor( parseInt(des[0]),parseInt(des[1])) != TRANSPARENT) 
    {
        myprompt(intfcwds[21]); return;
    }
    maxstacksize = 0;
    dohold();
    holdcount  = [document.getElementById('mycount').innerHTML, 
                  document.getElementById('hcount').innerHTML]
   bcounter = isblack(mycolor)?parseInt(document.getElementById('mycount').innerHTML) : parseInt(document.getElementById('hcount').innerHTML);
   wcounter=  isblack(mycolor)?parseInt(document.getElementById('hcount').innerHTML) : parseInt(document.getElementById('mycount').innerHTML);
   gcounter=0;
   holdstatus = status;
   setstatus(intfcwds[22]);
   clickable = false;
   
   breadth( parseInt(sss[0]),parseInt(sss[1]),TRANSPARENT);
}
function endbreadth()
{
   var k=0; for (var ee in parentv)k++;
   appendmsg("visited:" + (visited.replace(/[^,]/g,'').length-1)  );
   appendmsg("edges:" + k);
   appendmsg("max q:" + queue.max  );
    if (parentv[destiny]!=null)
    {
        uncount();
       // dohold();
        
        var p = destiny; 
        while (p!=null)
        {
            setcolor(document.getElementById('s' + p.replace(/,/,'_')), '#999999');
            
            p = parentv[p];
        }
         
        setstatus(intfcwds[19]);
    }
    else
    {
        //uncount();
        myprompt( 'Point (' + destiny.replace(/_/,',') + ") is not reachable from Point(" + document.getElementById('source').value + "). No path");
    }
    destiny = null;
}
var neighbore;

function visit(maincolor)
{
    var e = queue.dequeue();
    if (e == null) 
    {
        if (maincolor == TRANSPARENT && destiny == null)
        {
            endeach();
            var ij = moretodo();
            if (ij==null) 
            {
               enddepth();
               return;
            }
            breadth(ij[0], ij[1], TRANSPARENT);
        }
        else if (maincolor == TRANSPARENT && destiny != null)
        {
            endbreadth();
        }
        return;
    }
    var es = e.split(/_/);
    var i = parseInt(es[0]);
    var j = parseInt(es[1]);
    visited += i + '_' + j + ',';
    if (returnsoon == false) setcolor(getstone(i,j), '#999999');
     neighbore = [ [i,j-1], [i-1, j], [i,j+1], [i+1, j] ];
     for (var k=0; k < 4; k++)
     {
        var c1 = getcolor(neighbore[k][0], neighbore[k][1],visited); 
      
        if (c1 == maincolor)
        {
             queue.enqueue( neighbore[k][0] + '_' + neighbore[k][1]);
             if (destiny!=null)
             {
                 parentv[neighbore[k][0]+'_'+neighbore[k][1]] = i + '_' + j;
                 if ( neighbore[k][0]+ '_'+neighbore[k][1] == destiny )
                 {
                     queue.s='';
                     queue.l = 0;
                     endbreadth();
                     return;
                 }
             }
        }
        else  if (c1==BLACK || c1 == WHITE || c1 ==TRANSPARENT) 
        { 
             if (foundcolor=='') 
                foundcolor = c1; 
            else if (foundcolor!=c1) 
            {
                foundcolor = 'undecided';
                if (returnsoon) return;
            }
        }
         
     }
 if (delay==0)
         visit(maincolor);
     else
         setTimeout("visit('" + maincolor + "')",delay);
  
}



function trycount(i,j)
{
    visited = ',';
    stack = [];
    stacksize = 0;
    foundcolor = '';
    returnsoon = false;
    
    var n;
    while ( true)
    {
        n = next(i, j, TRANSPARENT);
        if (n == null) break;
        i = n[0];
        j = n[1];
    }
    
    if (foundcolor == BLACK || foundcolor == WHITE)
    { 
        var a = visited.replace(/^,/,'').replace(/,$/,'').split(/,/);
        for (var i=0; i < a.length; i++)
        {
            if (foundcolor == WHITE) wcounter++;
            else if (foundcolor == BLACK) bcounter++;
            setcolor(document.getElementById('s' + a[i]), foundcolor);
            if (isblack(mycolor) && foundcolor == WHITE || iswhite(mycolor) && foundcolor == BLACK)
            increment('mycount',1);
              else
            increment('hcount',1);
        }
   }
   else
       gcounter += visited.replace(/^,/,'').replace(/,$/,'').split(/,/).length;
}

function trycountdemo(i,j)
{
    visited = ',';
    stack = [];
    stacksize = 0;
    foundcolor = '';
    returnsoon = false;
    nextdemo(i,j);
}

function enddepth()
{
       status = intfcwds[19];
       setstatus(intfcwds[19]); 
       fm.count.value = intfcwds[15];
       
       
       document.getElementById('gcounter').innerHTML = intfcwds[52]+ ':' + gcounter;
       if (gcounter + bcounter < wcounter && isblack(mycolor) || gcounter + wcounter < bcounter && iswhite(mycolor))
       {
            if (gcounter < 30) myprompt(intfcwds[23])
       }
       else if (gcounter + bcounter < wcounter && iswhite(mycolor) || gcounter + wcounter < bcounter && isblack(mycolor))
       {
            if (gcounter < 30) Msg.send({code:'plain',msg:'intfcwds[23]'});
       }   
      
}
function endeach()
{
    if (foundcolor == BLACK || foundcolor == WHITE)
    { 
       
        var a = visited.replace(/^,/,'').replace(/,$/,'').split(/,/);
        for (var i=0; i < a.length; i++)
        {
            setcolor(document.getElementById('s' + a[i]), foundcolor);
            if (isblack(mycolor) && foundcolor == WHITE || iswhite(mycolor) && foundcolor == BLACK)
            increment('mycount',1);
              else
            increment('hcount',1);
        }
   }
   else  gcounter += visited.replace(/^,/,'').replace(/,$/,'').split(/,/).length;
}
function nextdemo(i,j)
{
    var n = next(i, j, TRANSPARENT);
    
    if (n != null)
    {
        if (delay<=0)
           nextdemo(  n[0], n[1] ); 
        else setTimeout('nextdemo(' + n[0] + "," + n[1] + ")",delay);
    }
    else
    {
       endeach();
       var i,j;
       for ( i=0; i < NL; i++)
       {    for ( j=0; j < NL; j++)
               if (getcolor(i,j) == TRANSPARENT) break;
           if (j!=NL) break;
       }  

       if (i < NL && j < NL)
           trycountdemo(i,j);
       else
       { 

           enddepth();
       }
   }         
}

 
function countswitch(btn)
{
    if (btn.value == intfcwds[14] && status!=intfcwds[22])
    {
       
        countfillall();
       
    }
    else if( status == intfcwds[19])
    {
        uncount();
        btn.value = intfcwds[14];
        document.getElementById('gcounter').innerHTML = '';
    }
}
 
function second5time()
{
    if (timelimit==-1) return;
    var t0= (new Date()).getTime();
    var t = timelimit*1000 - (t0 - stepstart );
    if ( t < 5000)
    {
        if (second5timer!=null)
        {
            clearInterval(second5timer);
            second5timer = null;
        }
        if (second1timer == null)
        second1timer = setInterval('second1time()', 1000);
    }
    else
    {
        t = Math.round(t/1000); var mi = Math.floor(t/60);
        steptimer.innerHTML =  (mi>0?(mi+'\''):"") + (t%60) + '"';
        t = Math.round((t0 - gamestart )/1000);
        var s = t%60; var ss = s + '"'; if (ss==0) ss = '';
        var mi = Math.floor((t/60))%60; var ms = mi + '\''; if (mi==0) ms = '';
        var h = Math.floor(t/3600); var hs = h + '!';  if (h==0) hs = '';
        gametimer.innerHTML = hs + ms + ss; 
        
    }
}
 
 
function second1time()
{
    if (timelimit==-1) return;
    var t= (new Date()).getTime();
    t = timelimit*1000 - (t - stepstart );
    if ( t <= 0)
    {
        if (second1timer!=null)
        {
            clearInterval(second1timer);
            second1timer = null;
        }
        if (clickable)
        giveup1();
        
    }
    else
    {
        t = Math.round(t/1000); ;
        steptimer.innerHTML =   (t) + '"';
    }
}
 
var holdcolor = ',';
var holdcount  = [0,0];
var holdstatus = '';
var goway = 0;
function slow()
{
    
    var x ='<div style="width:400px;margin:3px 3px 3px 3px" class=outset1 >This function is for algorithm study only. Slow processing allows you to see how a domain  is explored. Enter the number of milliseconds of  time gap between two steps and the way for  selecting direction'
    x += '<center><br>Gap:<select name=delay onchange=getdelay(this) style=width:200px>'; 
    for (var j=0; j < 10; j++) 
        x +=  "<option value=" + j*10 + ' ' + ((j*10==delay)?'selected':'') + ">" + j*10+ " milliseconds</option>";
    x +='</select><br><br>Way:<select name=way onchange=getway(this)  style=width:200px ><option value=0 ' + (goway==0?'selected':'')
            + '>depth-first:along border</potion><option value=1 ' + (goway==1?'selected':'') + '>depth-first:1st avaiable</option><option value=2  ' 
            + (goway==2?'selected':'') + '>depth-first:random</option><option value=2  ' 
            + (goway==3?'selected':'') + '>breadth-first:Dijkstra</option></select></div> '
+ '<div  class=outset1 style="width:400px;margin:3px 3px 3px 3px;visibility:' + (goway==3?'visible':'hidden') + '" id=shortpath>' 
+ "Wonder if the point<input id=destiny size=6 value=\"1,14\"> is reachable from point<input id=source size=6 value=\"0,0\">.  " 
+ 'Try to find the shortest path connecting them <input name=go class=GreenButton width=80 type=button value=Routing onclick=routing()></div>';
    myprompt(x);
    promptwin.style.width = '406px';
}


function getway(v)
{ 
    goway =  v.selectedIndex;
    document.getElementById('shortpath').style.visibility = goway==3?'visible':'hidden';
} 
function getdelay(v)
{
    delay = parseInt(v.options[v.selectedIndex].value);
}
function dohold()
{
    holdcolor = ',';
    for (var i=0; i < NL; i++)
    { 
         for (var j=0; j < NL; j++)  
         {
            var x = getcolor(i,j);
            if (x == BLACK) holdcolor += '0_' + i + '_' + j + ',';
            else if( x == WHITE)holdcolor += '1_' + i + '_' + j + ',';
                
         }
    }
}
function countfillall()
{
    maxstacksize = 0;
    dohold();
    holdcount  = [document.getElementById('mycount').innerHTML, 
                  document.getElementById('hcount').innerHTML]
    /*
    for (var i=0; i < NL; i++)
     for (var j=0; j < NL; j++)  
      if (getcolor(i,j) == TRANSPARENT)
         trycount(i,j);//countfill(i,j);
    */
   bcounter = isblack(mycolor)?parseInt(document.getElementById('mycount').innerHTML) : parseInt(document.getElementById('hcount').innerHTML);
   wcounter=  isblack(mycolor)?parseInt(document.getElementById('hcount').innerHTML) : parseInt(document.getElementById('mycount').innerHTML);
   gcounter=0;
   holdstatus = status;
   setstatus(intfcwds[22]);
   clickable = false;
   for (var i=0; i < NL; i++)
   {
       for (var j=0; j < NL; j++)  
       if (getcolor(i,j) == TRANSPARENT) 
           break;
       if (j != NL) break;
   }
   if (i < NL && j < NL) 
   {
       if (goway < 3)
           trycountdemo(i,j);
       else 
           breadth(i,j, TRANSPARENT);
   }
   else
   { 
       enddepth();
   }          
    
    
}

function setcolors(x)
{
     var a= 0, b=0;
     for (var i=0; i < NL; i++)
    { 
         for (var j=0; j < NL; j++)  
         {
             if (x.indexOf(',0_' + i + '_' + j + ',')>=0)
             {b++; setcolor(getstone(i,j),BLACK);}
             else if (x.indexOf(',1_' + i + '_' + j + ',')>=0)
             {a++;setcolor(getstone(i,j),WHITE);}
             else if (x.indexOf(',2_' + i + '_' + j + ',')>=0)
             { setcolor(getstone(i,j),'#999999');}
             else  
             setcolor(getstone(i,j),TRANSPARENT);
         }
    }
    if (mycolor == BLACK) {
     document.getElementById('mycount').innerHTML = '' + b;
    document.getElementById('hcount').innerHTML = '' + a;
}
else
    {
     document.getElementById('mycount').innerHTML = '' + a;
    document.getElementById('hcount').innerHTML = '' + b;
}
}

function uncount()
{
    setcolors(holdcolor);
    document.getElementById('mycount').innerHTML = holdcount[0];
    document.getElementById('hcount').innerHTML = holdcount[1];
    clickable = true;
    setstatus(holdstatus);
}

function  usethiscolor(dv)
{
     if (status == intfcwds[1] || status == intfcwds[24]) 
    {
        if (dv.innerHTML.indexOf(BLACK)>=0) 
        {
            fm.me.style.fontWeight =  'bold';
            fm.me.style.color =  'red';
            mycolor = BLACK;
        }
        else
        {
            fm.himher.style.fontWeight =  'bold';
            fm.himher.style.color = 'red';
            mycolor = WHITE;
        }
        
    }
}

function containtoeat(i,j, targetcolor)
{
    visited = ',';
    stack = [];
    stacksize = 0;
    foundcolor = '';
    returnsoon = true;
    var n;
    while ( true)
    {
        n = next(i, j, targetcolor);
        if (n == null) break;
        i = n[0];
        j = n[1];
    }
    
    if (foundcolor == BLACK || foundcolor == WHITE)
    { 
       
        var a = visited.replace(/^,/,'').replace(/,$/,'').split(/,/);
        for (var i=0; i < a.length; i++)
        {
            setcolor(document.getElementById('s' + a[i]), TRANSPARENT);
            if (isblack(mycolor) && foundcolor == WHITE || iswhite(mycolor) && foundcolor == BLACK)
            increment('mycount',-1);
              else
            increment('hcount',-1);
        }
        return a.length;
   }
   return 0;
}


function increment(s, i)
{
    var y = document.getElementById(s);
    if (i == '')
    {
       y.innerHTML = '0';
       return;
    }
    var k = i + parseInt(y.innerHTML);
    y.innerHTML = ''+k;
}
 
function containtoeat4(y)
{
    var n = 0;
    var i = parseInt(y[0]);
    var j = parseInt(y[1]);
    var r = [ [i-1,j], [i+1, j], [i,j-1], [i, j+1] ];
    var thiscolor = getcolor(i, j );
    for (var k=0; k < 4; k++)
    {
        var othercolor = getcolor(r[k][0],r[k][1]);
        if (thiscolor == WHITE && othercolor ==BLACK 
           || thiscolor == BLACK && othercolor ==WHITE )
          n +=  containtoeat(r[k][0],r[k][1],othercolor);
      
    }
     
   return n;
}
function setclickable(b)
{
    if (status!=intfcwds[21] && status!=intfcwds[24])
    clickable = b;
}
function highlight(b)
{
    fm.me.style.fontWeight = (!b)?'':'bold';
    fm.himher.style.fontWeight = (b)?'':'bold';
    fm.me.style.color = (!b)?BLACK:'red';;
    fm.himher.style.color = (b)?BLACK:'red';
    setclickable(b);
}
var savedcolor = '';
function clickstone(d)  
{
     
    if (clickable == false)
    {
         if ( status==intfcwds[25])
             appendmsg('My turn!');
        return;
    }
    
    if (status == intfcwds[17])
    {
        setcolor(d, TRANSPARENT);
        return;
    }
    var z = d.id.substring(1).split(/_/);
    var clr = getcolor(z[0], z[1]);
    if ((clr == BLACK || clr == WHITE))
    {
        if (status != intfcwds[1] && status!=intfcwds[24])
            return;
        savedcolor = clr;
    }
    if (tryingid == '' )
    {
        setcolor(d,'grey'); 
        tryingid = d.id;
    }
    else if (tryingid == d.id)
    {
        setcolor(d, mycolor); 
        
        var z = d.id.substring(1).split(/_/);
        if(  containtoeat4(z) == 0)
        {
             var z = getcord(d);
            if (status==intfcwds[25] )
            {
                var q = [getcolor(z[0]-1,z[1]),  getcolor(z[0]+1,z[1]),   getcolor(z[0], z[1]-1),  getcolor(z[0],z[1]+1)];
                var goodtogo = false;
                for (var i=0; i < 4; i++) 
                {
                    if (goodtogo == false)
                    for (var j=0; j < 4; j++)
                    {
                        if (q[i]== TRANSPARENT || q[j]== TRANSPARENT || q[i] != 'outside' && q[j]!= 'outside' && q[i]!=q[j]) 
                        {
                            goodtogo = true; 
                            break;
                        }
                    }
                }
                if (goodtogo==false) 
                {
                    setcolor(d, TRANSPARENT);
                    appendmsg(intfcwds[26] );
                    
                    return;
                }
            }    

        }


        if (status == intfcwds[25])
        {
            makesound(2);
            changedanorname();
            highlight(false);
            increment('mycount',1);
            Msg.send({code:'plain',msg:tryingid, rid:himher});
            
           
        }
        else if ( status ==intfcwds[1] || status == intfcwds[24])
        {
            if (mycolor == WHITE )
                 increment('hcount',1);
            else
                 increment('mycount',1);
        }
        tryingid = ''; 
        setTimeout(desel ,100);
    }
    else 
    {
        setcolor(document.getElementById(tryingid), TRANSPARENT);
        setcolor(d,'grey'); 
        tryingid = d.id;

    }
     
     
}
function desel()
{
    document.getElementById('gcounter').click();
}
function setstatus(s)
{
    document.getElementById('status').innerHTML = s;
    status = s;
    if (s == intfcwds[19])
    {
        
    }
    if (s == intfcwds[17])
    {
      //  fm.del.style.visibility = 'visible';
        fm.giveup.value = intfcwds[18];
        fm.count.style.visibility = 'hidden';
        //fm.giveup.style.visibility = 'hidden';
    }
    else if (s == intfcwds[25])
    {
       // fm.del.value = intfcwds[13];
        fm.count.value = intfcwds[14];
       // fm.del.style.visibility = 'hidden';
        fm.count.style.visibility = 'visible';
        fm.giveup.style.visibility = 'visible'; 
       // fm.giveup.value = intfcwds[13];
        gamestart = (new Date()).getTime();
        fm.giveup.onclick = giveup0;
        fm.giveup.value =  intfcwds[16] ;
    }
    if (s == intfcwds[1])
    {
   //     fm.del.style.visibility = 'visible';
//        fm.count.value = intfcwds[14];
        fm.count.style.visibility = 'visible';
      //  fm.giveup.style.visibility = 'hidden';
        fm.giveup.value =intfcwds[13];
    }
    else if (s == intfcwds[24])
    {
     //   fm.del.style.visibility = 'visible';
     //   fm.del.value = intfcwds[13];
        fm.count.value = intfcwds[14];
        fm.count.style.visibility = 'visible';
        fm.giveup.value = intfcwds[13];
       // fm.giveup.style.visibility = 'hidden'; 
    }
    else if (s == intfcwds[22] || s== intfcwds[19])
    {
     //   fm.del.value = intfcwds[13];
        fm.count.value = intfcwds[15];
     //   fm.del.style.visibility = 'hidden';
        fm.count.style.visibility = 'visible';
       // fm.giveup.style.visibility = 'hidden'; 
        fm.giveup.value = intfcwds[13];
    }
}
var numreponses = 0;
function waiting()
{
    
    numreponses = 0;
    changedanorname();
    if (Msg.tid == '') 
    {
        Msg.send({rid:'', code:'new', msg:'go game'});
    }
    else
    {
        Msg.send({rid:'', code:'join', msg:'go game'});
    }
}
var justwait = false;
var donelisten = false;
var userinfo = new Array();
function wait(btn)
{ 
    if (btn.value==intfcwds[27])
    {
        numreponses = 0;
        Msg.needmore = true;
        changedanorname();
        if ( Msg.tid=='') 
        {
            Msg.send({ rid:'',code:'new', msg:'go game'  });
        }
        else
        {
            Msg.send({ rid:'',code:'join', msg:'go game'  });
        }
        
    }
    else
    {
        Msg.needmore = false;
        Msg.send({code:'unsubs', msg:'go game'  });
        btn.value  = intfcwds[27];
        setstatus ( intfcwds[1]);
    }
}
function clean()
{
    for (var i=0; i < NL; i++)
        for (var j=0; j < NL; j++)
            setcolor(getstone(i, j),TRANSPARENT);
    increment('mycount','');
    increment('hcount','');
}

var isadmin = false;
 
function formreq(m,needmatch)
{
    if (needmatch) var p = match(m.msg); 
    var mydan = fm.mydan.style.fontFamily, hdan=fm.hdan.style.font, yield=fm.yield.style.fontFamily,clr=fm.clr.style.fontFamily,first=fm.first.style.fontFamily,timer=fm.timer.style.fontFamily;
    fm.mydan.style.fontFamily='';fm.hdan.style.fontFamily='';fm.yield.style.fontFamily='';fm.clr.style.fontFamily='';fm.first.style.fontFamily='';fm.timer.style.fontFamily='';
    var cap = msg1520.split(/@/);
    
    var y = wishes.innerHTML.replace(/.*<.tr>/i,'').replace(/<tr[^>]*>/ig,'').replace(/selected/ig,'').replace(/[^<]+/,'').replace(/<select /ig, '<select onchange="negotiate(this)"  ').split(/<.tr>/i);
    if (needmatch==false)
    y = wishes.innerHTML.replace(/.*<.tr>/i,'').replace(/<tr[^>]*>/ig,'').replace(/selected/ig,'').replace(/[^<]+/,'').replace(/<select /ig, '<select "  ').split(/<.tr>/i);
    y[y.length-1] = '';    
    fm.mydan.style.fontFamily=mydan;fm.hdan.style.fontFamily=hdan;fm.yield.style.fontFamily=yield;fm.clr.style.fontFamily=clr;fm.first.style.fontFamily=first;fm.timer.style.fontFamily=timer;
    var u = m.msg.split(/|/);
    var s = '';
    var jj =0;
   
    for (var i=1; i < y.length- 2; i++){  
    if (i!=1 && i!=2 && u[i]!='0' || i==2 && u[i]!='4')
    {   
        jj++;
        s += y[i].replace(new RegExp('value="' + u[i] + '"'), 'value="' + u[i] + '" selected ');
    }}
    if (jj > 2)
    {
        jj = s.toLowerCase().indexOf('</select>',Math.round(s.length/2));
        if (jj>=0){ jj+=9;
         s = s.substring(0,jj ) + '<br>'+s.substring(jj );}
    } 
    if (needmatch) s += "<td>(" + intfcwds[55] + ":" + p +"/6)</td>";
    s =  s.replace(/,[ ]*$/,'') ;
   
    return s;
}

function compose(f)
{
    var s  =  '';
    if (typeof(f.mydan)!='undefined')
        s+= f.mydan.selectedIndex ;
    else s+= '0';
    if (typeof(f.hdan)!='undefined')
       s +=  f.hdan.selectedIndex ;
    else 
        s += '0';
    if (typeof(f.yield)!='undefined')
              s +=  f.yield.selectedIndex;
    else s +='4';
    if (typeof(f.clr)!='undefined')
              s +=  f.clr.selectedIndex;
    else s +='0';
    if (typeof(f.first)!='undefined')
             s +=  f.first.selectedIndex;
    else s +='0';
     if (typeof(f.timer)!='undefined')
             s +=  f.timer.selectedIndex;
    else s +='0';
   
   return s;
}

function match(m)
{
    var k = 0;
    var ms = m.split('');
   
    var t = compose(fm);
    var ts = t.split('');
    if (ms[0] == ts[1]){  k++;}
    if (ms[1] == ts[0]){ k++;}
    if (ms[2]+ts[2] == 8 || ms[2] == ts[2]) {k++;}
    if (ms[3]+ts[3] == 3 || ms[3]==0 && ts[3] ==0){  k++;}
    if (ms[4]+ts[4] == 3 || ms[4]==0 && ts[4] ==0) {  k++;}
    if (ms[5] == ts[5] ){  k++;}
    
    return k;
}
function gameroom()
{
    Msg.send({code:'snap',msg:'',rid:''});
}
Msg.handlepost = function(s)
{
     var m = new Message(s);
    
    var more = false;
    if (m.code == 'error')
    {
         
    }
    else  if (m.code == 'login')
    {
     
        window.open('login.jsp?follow=' + m.msg, 'w' + tstmp );
       setTimeout('replacewords(promptwin)', 1500);
    }
    else if (m.code =='newd')
    {
        fm.joinbtn.value  = intfcwds[28];
        if (status == intfcwds[1])
        setstatus ( intfcwds[24]);
        Msg.set('tid',m.tid);
       
        if (justwait==false)
        {
            Msg.needmore = true; 
            Msg.listen();
            justwait=true;
        }
        more = true;
    }
    else if (m.code == "snap")
    {
        
        var seg = m.msg.split(/\|/);
        //Queue,Message,Recycle,Missed,Request,Sessions,Key,Name,Num,Idle,Diff,Msg,Topic,Topics,Order,User,Delete one hour old message,Keep all messages of a topic until all users gone
         
        var x = textmsg[1646].split(/@/);
        for (var i=1; i < 4; i++)
        seg[i] = seg[i].replace(/<table/, '<table width=100% border=1 style=border-collapse:collapse;border-radius:3px;background-color:white');
        myprompt("<table width=98%><tr><td>" + x[0] +seg[1]+ "</td></tr> <tr><td>" + x[1] +seg[2]+ "</td></tr><tr><td>" + x[2] +seg[3]+ "</td></tr></table>");
        
         
    }
    else if ( m.code == 'sure1') 
    {
        more = true;
    }
    
}

function makecontest(m)
{
   if (m.msg.length != 6 && m.msg.length != 7) return '';
   var modified = false;
   if (fm.mydan.selectedIndex!=0 && m.msg.charAt(1)!='0' && m.msg.charAt(1) !=''+ fm.mydan.selectedIndex)
   {
       m.msg = m.msg.charAt(0) +  fm.mydan.selectedIndex + m.msg.substring(2);
       modified = true;
   } 
    var a = '';
    if (status == intfcwds[1] || status == intfcwds[24] || status == intfcwds[29]) 
    a = "<input name=acceptbtn class=OrangeButton type=button style=\"width:100px\" value=\"" +
   (modified? intfcwds[30]:intfcwds[31])+ "\" onclick=\"acceptornegotiate('" + m.toString() + "',this)\">";
    return '<form name=resp' + (numreponses++) +  ' id="f' + m.sid + '" style="margin:3px 1px 3px 1px"><nobr><table><tr><td>' + m.sname + " " 
    + '</td>'+  formreq(m,true) + '<td>'+ a + "</td></tr></table></form>";
}

Msg.handleget = function(s)
{
    
    var m = new Message(s);
   
    //m.sname = Msg.rtohex(m.sname);
    Msg.needmore = true;
   
    if (m.code == 'login')
    {
        window.open('login.jsp?follow=' + m.msg, 'w' + tstmp);
        Msg.needmore = false
       setTimeout('replacewords(promptwin)', 1500);
    }
    else  if (m.code == 'leave')
    {
       userinfo[m.sid] = '';
       playerq.innerHTML = '' + (parseInt(playerq.innerHTML)-1);
       Msg.needmore = true;
   }
    else  if (m.code == 'join')
    {
       var goone = false;
       for (var k in userinfo)
       if (userinfo[k] == '') {goone=true;userinfo[k] = m.toString() ;}
       if (goone==false) userinfo[m.sid] = m.toString() ; 
       else
       playerq.innerHTML = '' + (parseInt(playerq.innerHTML)+1);
      
       if (status == intfcwds[24] || status == intfcwds[1])
       {
         var x =  compose(fm);
         changedanorname();
         
        //  myprompt(m.sname + " just joined. Response with your wishes?",null,
        //  "if(v)Msg.send({rid:'" + m.sid + "', code:'latex', msg:'"+ x + "'})");
         Msg.send({tid:m.tid, rid:m.sid, code:'latex', msg:x}); 
       }
       Msg.needmore = true;
    }
    else  if (m.code == 'latex')
    {
       if (m.msg.length==6 || m.msg.length==7) userinfo[m.sid] = m.toString(); 
       if ( m.msg.indexOf('B') > 0 || m.msg.indexOf('C')<0 && m.msg.indexOf('B')<0 && m.msg.indexOf('A')<0 && match(m.msg)==6) 
       {
           acceptornegotiate(m.toString());
           makesound(1);
       }
       else if ( (status == intfcwds[24]&& m.msg.indexOf('A')<0 || status == intfcwds[1]) &&  m.msg.indexOf('C')<0)
       {
           
           var y = makecontest(m);
           makesound(1);
           if (promptwin == null)
           {
              myprompt(y,null, null, intfcwds[0]);
           }
           else
           {
              var z = getpromptmsg(); 
              var k;
              if ((k=z.indexOf(">"+m.sname + " " ))>0)
              {
                  var k1 = z.substring(0,k).lastIndexOf('<form ');
                  var k2 = z.indexOf('</form>',k);
                  z = z.substring(0,k1) + y +  z.substring(k2 + 7);
              }
              else z += y;
              myprompt(z,null, null, intfcwds[0]);
           }
            
       }
       else if (status == intfcwds[24]  && m.msg.indexOf('A')>0 )
       {
            var y = '<form name=neg'   +  ' style="margin:20px 0px 20px 0px"><nobr>' +  m.sname + ' '+ intfcwds[56] + ':<br>  <b><table><tr><td>' +  (Msg.sname) + '</td>'
            + formreq(m,false) +   ("</tr></table></b><br><center><input name=acceptbtn class=OrangeButton type=button style=\"width:100px\" value=\"" + intfcwds[31] + "\" onclick=\"acceptnegotiate('" + m.toString()+ "',this)\">"
            +"<input name=rejectbtn class=OrangeButton type=button style=\"width:100px\" value=\"" + intfcwds[49] + "\" onclick=\"reject('" + m.toString() + "')\">") + "</nobr></center></form>";
            setstatus(intfcwds[29]);
            myprompt(y,null,null,intfcwds[30]);
            makesound(1);
            promptwin.style.left = '10px';
       }
       else if (status == intfcwds[29]  && m.msg.indexOf('C')>=0 )
       {
           makesound(1);
           if (document.getElementById(negotiatingform) != null)
           {
               document.getElementById(negotiatingform).innerHTML = document.getElementById(negotiatingform).innerHTML.replace(new RegExp(intfcwds[55],"ig"), '<b>'+intfcwds[50] + '!</b> ' + intfcwds[55]);
           }
       }
       Msg.needmore = true;
    } 
    else  if (m.code == 'html')
    {
       if (m.msg=='' && m.sname!='')
       {
           himher = m.sname;
           fm.himher.value = m.sname;
       }
       else if (status == intfcwds[24] || status == intfcwds[29])
       {
           acceptme(m);
           makesound(1);
       }
       else if (status == intfcwds[25])  
       {
           if (m.msg == intfcwds[32] || m.msg == 'intfcwds[32]')
           {
                document.getElementById('gcounter').innerHTML = '<b>' + (isblack(mycolor)?intfcwds[40]:intfcwds[39]) + intfcwds[53]+ '!</b>';
                endgame();
                makesound(1);
                appendmsg(intfcwds[32]);
           }
       }
       Msg.needmore = true;
    }
    else  if (m.code == 'plain')
    {
       
        if (m.msg.indexOf('intfcwds[')==0)
        {
            m.msg = eval(  m.msg  );
        }
        
        if (status == intfcwds[25])
        {
            if (m.msg.replace(/s[0-9]+_[0-9]+/, '') == '')
            {
               makesound(2);
               if (timelimit>0 && second1timer!=null) 
               {clearInterval(second1timer);second1timer=null;}
            
               if (timelimit>0 && second5timer!=null) {clearInterval(second5timer);second5timer = null;}
           
               var x = m.msg.substring(1).split(/_/); 
           
               setcolor(document.getElementById(m.msg), hcolor);
               highlight(true);
               increment('hcount',1);
               containtoeat4(x); 
              
               steptimer.innerHTML = '0\'0"';
               stepstart = (new Date()).getTime();
            
               if (timelimit>0 && second5timer == null)
               second5timer = setInterval('second5time()', 5000);

            }
            else
            {
                appendmsg(m.msg);
            }

            fm.himher.value = m.sname;
            himher = m.sid;
            Msg.set('rid', himher);
        }
        else if (m.msg.length % 4==0 && m.msg.replace(/0-9/g,'').replace(/_/g,'') == '')
        {
            restore1(m.msg);
        }
        
        Msg.needmore = true;
    }
    else
        Msg.needmore = true;
}

function pool()
{
    var y = '';
    for (var k in userinfo)
    {
       
        y += makecontest(new Message(userinfo[k].replace(/ /g,'@')));
    }
    myprompt(y);
}

function acceptme(m)
{         
           fm.giveup.onclick = giveup0;
           fm.giveup.value =  intfcwds[16] ;
           setcolors('');
           himher = m.sid;
           Msg.set('rid', himher);
           stepstart = (new Date()).getTime();
           var x = m.msg.split( "" );
           fm.himher.value = m.sname;
           if (fm.mydan.selectedIndex!=0 && fm.me.value.indexOf('(') < 0) 
              fm.me.value  += '(' + fm.mydan.selectedIndex + "dan)"
            
           if (x[3]=='2' ) 
           {
              setcolor(document.getElementById('hisclr'), BLACK);
              setcolor(document.getElementById('myclr'),  WHITE);
              mycolor = WHITE;
              hcolor = BLACK;
              fm.clr.selectedIndex = 2;
           } 
           else  
           {
              setcolor(document.getElementById('hisclr'), WHITE);
              setcolor(document.getElementById('myclr'), BLACK);
              mycolor = BLACK; 
              fm.clr.selectedIndex = 1;
              hcolor = WHITE;
           }     
           if (x[4]=='1'  ) 
           {
               myfirst = true;
               fm.first.selectedIndex = 1;
               highlight(true);
               appendmsg(intfcwds[33]);
              // Msg.send({code:'plain',msg:"policy0", rid:''});
           }
           else 
           {
               fm.first.selectedIndex = 2;
               myfirst = false;
               highlight(false);
               Msg.send({code:'plain',msg:'intfcwds[33]',rid:himher});
           }
           var t = parseInt(x[5]);
           if (isNaN(x[5]) || t == 0) 
           {
               timelimit = -1;
               fm.timer.selectedIndex = 0;
           }
           else 
           { 
               timelimit = parseInt(fm.timer.options[t].text.replace(/[^0-9]/g,''))*60;
               if (second5timer == null)
               second5timer = setInterval('second5time()', 5000);
           }
           var N = 4 -parseInt( x[2] );
           if (N >= 1) setcolor(getstone(3, 3),mycolor);
           if (N >= 2) setcolor(getstone(3, 15),mycolor);
           if (N >= 3) setcolor(getstone(15, 3),mycolor);
           if (N >= 4) setcolor(getstone(15, 15),mycolor);
           if (N <= -1) setcolor(getstone(3, 3),hcolor);
           if (N <= -2) setcolor(getstone(3, 15),hcolor);
           if (N <= -3) setcolor(getstone(15, 3),hcolor);
           if (N <= -4) setcolor(getstone(15, 15),hcolor); 
           if (N>0)document.getElementById('mycount').innerHTML = ''+N;
           else if (N<0)document.getElementById('hcount').innerHTML = ''+(-N);
           fm.joinbtn.style.visibility = 'hidden';
           setstatus(intfcwds[25]);
           
           himher = m.sid;
           Msg.set('rid',himher);
           closeprompt();
}


function negotiate(s)
{
    s.form.acceptbtn.value = intfcwds[30];
}

function sendmsg()
{
    if (himher!=null)
       Msg.send({code:'plain',msg:fm.myword.value,rid:himher});
    else if (Msg.rid!='')
       Msg.send({code:'plain',msg:fm.myword.value,rid:Msg.rid});
    else
       appendmsg(intfcwds[34]);
}

function acceptnegotiate(s,b)
{
    var m = new Message(s.replace(/ /g,'@'));
    var y = m.msg.replace(/A/,'B').split('');
    fm.hdan.selectedIndex = parseInt(y[1]);
    fm.yield.selectedIndex = parseInt(y[2]);
    fm.clr.selectedIndex = parseInt(y[3]);
    fm.first.selectedIndex = parseInt(y[4]);
    fm.timer.selectedIndex = parseInt(y[5]);
    changedanorname();
    Msg.send({code:'latex',msg:(m.msg.replace(/A/,'B')) ,rid:m.sid});
    closeprompt();
}

function acceptornegotiate(s,btn)
{    var m = new Message(s.replace(/ /g, '@'));
    if (btn ==null || btn.value == intfcwds[31])
    {
        if (status != intfcwds[1] && status != intfcwds[24] && status != intfcwds[29]) 
            return;
       
        var s = acceptyou(m);
        fm.joinbtn.style.visibility = 'hidden';
        setstatus (intfcwds[25]); 
        himher = m.sid;
        Msg.send({rid:m.sid,code:'html',msg:s});
        closeprompt();
   }
   else
   {
       var f =  btn.form;
       negotiatingform = f.id;
       var ms =  compose(f) + 'A';
       setstatus (intfcwds[29]); 
       himher = m.sid;
       Msg.send({rid:m.sid,code:'latex',msg:ms});
       //closeprompt(); 
   }
}
function reject(s)
{
    setstatus(intfcwds[24]);
    var m = new Message(s);
    Msg.send({rid:Msg.rid,code:'latex',msg:'C'});
    Msg.set('rid','');
    closeprompt(); 
}
function acceptyou(m)
{
    fm.giveup.onclick = giveup0;
    fm.giveup.value =  intfcwds[16] ;
    setcolors('');
    var x = m.msg.split( "" );
    fm.himher.value = m.sname;
    stepstart = (new Date()).getTime();
   if (x[4]=='2' || x[4]=='0' && (new Date()).getTime()%2 == 1) 
   {
       myfirst = true;
       x[4]= '2';
       highlight(true);
      // startTimer();
   }
   else 
   {
       myfirst = false;
       highlight(false);
       x[4] = '1';
   }       
   if ( x[3]=='0' && (new Date()).getTime()%2 == 1) 
   {
      setcolor(document.getElementById('hisclr'), BLACK );
      setcolor(document.getElementById('myclr'), WHITE );
      mycolor = WHITE;
      hcolor = BLACK;
      if (x[4]=='0') myfirst = false;
      x[3] = '1';
   } 
   else if (x[3]=='1' ) 
   {
      setcolor(document.getElementById('hisclr'), BLACK );
      setcolor(document.getElementById('myclr'), WHITE );
      mycolor = WHITE;
      hcolor = BLACK;
      x[3] = '1';
   } 
   
   else  if (x[3] == '2')
   {
      setcolor(document.getElementById('hisclr'), WHITE );
      setcolor(document.getElementById('myclr'), BLACK  );
      mycolor = BLACK; 
      hcolor = WHITE;
      x[3] = '2';
   } 
   else   
   {
      setcolor(document.getElementById('hisclr'), WHITE );
      setcolor(document.getElementById('myclr'), BLACK  );
      mycolor = BLACK; 
      hcolor = WHITE;
      if (x[4]=='0') myfirst = true;
      x[3] = '2';
   }     
   
   
   var t = parseInt(x[5]);
   if (t == 0) timelimit = -1;
   else 
   { 
       timelimit = parseInt(fm.timer.options[t].value.replace(/[^0-9]/g,''))*60; 
       if (second5timer == null)
       second5timer = setInterval('second5time()', 5000);
   }
   // startTimer1();
   var N = parseInt( x[2] )-4;
   if (N >= 1) setcolor(getstone(3, 3),mycolor);
   if (N >= 2) setcolor(getstone(3, 15),mycolor);
   if (N >= 3) setcolor(getstone(15, 3),mycolor);
   if (N == 4) setcolor(getstone(15, 15),mycolor);
   if (N <= -1) setcolor(getstone(3, 3),hcolor);
   if (N <= -2) setcolor(getstone(3, 15),hcolor);
   if (N <= -3) setcolor(getstone(15, 3),hcolor);
   if (N <= -4) setcolor(getstone(15, 15),hcolor); 
   if (N>0)document.getElementById('hcount').innerHTML = ''+N;
   else if (N<0)document.getElementById('mycount').innerHTML = ''+(-N);
   var s = x[0] + '' + x[1] + '' + x[2] + '' + x[3] + '' + x[4] + '' +x[5];
   closeprompt();
   return s;
   
}

function replacewords(w)
{
    w.innerHTML = w.innerHTML.replace(/Login/g, intfcwds[70]).replace(/User ID/, intfcwds[59]).replace(/Password/, intfcwds[60]);
}
 
function appendmsg1(x)
{
    if (document.getElementById('msg')!=null)
    document.getElementById('msg').innerHTML += x + "<br>";
}

function giveup0()
{
    
    if (fm.giveup.value == intfcwds[16])
       myprompt(msg1521 + '?',null, 'if(v)giveup1()');
    else
       giveup2(); 
}

function giveup1()
{
     document.getElementById('gcounter').innerHTML = '<b>' + (iswhite(mycolor)?intfcwds[40]:intfcwds[39]) + intfcwds[53]+'!</b>';
     endgame();
     Msg.send({code:'html', msg:'intfcwds[32]'});
}
function endgame()
{
    fm.giveup.value = intfcwds[35];
    setstatus(intfcwds[36]);
   
    clickable = false;
    if (second5timer!=null)
    {
         clearInterval(second5timer);
         second5timer = null;
    }
    if (second1timer != null)
    {
         clearInterval(second1timer);
         second1timer = null;
    }
    steptimer.innerHTML = '0\'0"';
   
    //Msg.send({rid:'', code:'unsubs',msg:''});
    
}

function giveup2()
{
    
    himher=null;
    setstatus(intfcwds[1]);
    fm.giveup.value = intfcwds[13];
    document.getElementById('hcount').innerHTML = '0';
    document.getElementById('mycount').innerHTML = '0';
    clickable = true;
    fm.joinbtn.style.visibility = 'visible';
    fm.joinbtn.value = intfcwds[27];
    document.location.href = document.location.toString();
   
}
var oldonbegin = window.onload;
window.onload = function()
{
    if (oldonbegin != null) oldonbegin();
    var xy = findPositionnoScrolling(msgboard);
    msgboard.style.height = (19*CELLSIZE - xy[1] - 2) + 'px';
    fm.myword.style.width = (msgboard.offsetWidth - 80) + 'px'
    Msg.init({app:'go', sek:sek, rid:'', sname:(intfcwds[51]+sek)});    
   //  Msg.init({app:'go', sek:sek, rid:'', sname:Msg.hex(intfcwds[51]+sek)});   
}
function demo(){
    
    if(status!=intfcwds[1] && status!=intfcwds[24]) {myprompt(intfcwds[24]);return;}
    setcolors("0_1_1,1_2_1,0_3_1,0_4_1,0_10_1,0_17_1,0_18_1,0_1_2,1_2_2,0_3_2,1_4_2,0_5_2,0_6_2,0_8_2,1_9_2,0_11_2,"
    +"0_13_2,0_15_2,0_16_2,0_17_2,1_18_2,0_2_3,1_3_3,1_5_3,0_6_3,0_7_3,1_8_3,0_9_3,0_10_3,0_11_3,1_12_3,0_14_3,1_15_3,"
    +"0_16_3,1_17_3,1_18_3,0_1_4,1_3_4,1_4_4,1_5_4,0_6_4,1_8_4,1_10_4,1_11_4,1_12_4,1_16_4,1_1_5,1_2_5,0_4_5,0_5_5,"
    +"1_6_5,1_7_5,1_8_5,1_9_5,1_10_5,0_11_5,1_12_5,1_14_5,1_15_5,1_17_5,0_1_6,1_2_6,1_3_6,0_4_6,0_6_6,0_7_6,0_8_6,"
    +"0_9_6,1_10_6,0_11_6,1_12_6,0_15_6,1_16_6,0_0_7,0_2_7,1_3_7,1_4_7,0_5_7,1_10_7,0_11_7,1_12_7,0_15_7,1_16_7,"
    +"0_1_8,0_2_8,1_3_8,1_5_8,1_7_8,0_8_8,0_9_8,1_10_8,0_12_8,0_13_8,0_14_8,1_15_8,1_16_8,0_1_9,1_2_9,1_3_9,1_4_9,"
    +"1_6_9,0_7_9,1_8_9,0_9_9,0_10_9,0_11_9,0_12_9,0_15_9,1_16_9,0_2_10,1_3_10,1_4_10,0_7_10,1_8_10,1_11_10,0_12_10,"
    +"1_13_10,0_14_10,1_16_10,0_2_11,0_3_11,0_4_11,1_5_11,1_6_11,0_7_11,1_8_11,0_10_11,1_11_11,0_12_11,1_13_11,0_14_11,"
    +"1_15_11,0_1_12,1_4_12,0_5_12,0_6_12,0_7_12,0_10_12,0_11_12,1_12_12,1_13_12,0_14_12,1_15_12,0_16_12,1_3_13,0_4_13,"
    +"0_10_13,1_11_13,1_12_13,1_14_13,0_15_13,1_16_13,0_1_14,0_2_14,1_3_14,0_10_14,1_11_14,0_13_14,1_16_14,1_1_15,1_2_15,"
    +"0_3_15,0_4_15,0_5_15,0_10_15,1_11_15,1_12_15,1_15_15,1_2_16,0_3_16,1_4_16,1_5_16,0_6_16,0_7_16,0_10_16,0_11_16,"
    +"1_12_16,1_13_16,1_1_17,1_3_17,1_6_17,1_7_17,0_8_17,0_10_17,1_11_17,1_14_17,1_2_18,1_12_18,1_13_18");
}

function rand(){
    if(status!=intfcwds[1] && status!=intfcwds[24]) {myprompt(intfcwds[37]);return;}
    var s = '';
    for (var k=0; k < 150; k++)
    {
        var x = Math.round(19*Math.random());
        var y = Math.round(19*Math.random());
        if (s.indexOf('_'+x+'_'+y+',')<0)
        {
            if (Math.random()>0.5)
                s += '1_'+x+'_'+y+',';
            else
                s += '0_'+x+'_'+y+',';
        }
    }
    setcolors(s);
}
   

function save()
{
    dohold();
    
    if(mycolor == BLACK) holdcolor+='0'; else  holdcolor+='1';
    if (clickable) holdcolor+='0';  else  holdcolor +='1';
    var s=0;
    for (var k=0; k < holdcolor.length; k++)
    {
        s += holdcolor.charCodeAt(k);
    }
    myprompt(msg1523 + '<br><textarea cols=50 rows=10>' +  holdcolor  + '_' + s + "</textarea>");
}

function upload(){}

function restore()
{
     if(status!=intfcwds[1] && status!=intfcwds[24]) {myprompt(intfcwds[37]);return;}
     myprompt(msg1522 + '<br><textarea cols=50 rows=10 id=svd></textarea><br>' 
             +'<center><input class=OrangeButton type=button name=restore value="' + intfcwds[9] + '" onclick="restore1(document.getElementById(\'svd\').value)"></center>'
             
     );
}
function restore1(s)
{
    var k = s.lastIndexOf('_');
    var sum = parseInt(s.substring(k+1));
    var t = s.substring(0,k);
   
    for (var k=0; k < t.length; k++)
    {
        sum -=  t.charCodeAt(k);
    }
    if (sum!=0)
    {
        myprompt(intfcwds[54]);
        return;
    }
    var clr = t.charAt(t.length-2);
    var cl = t.charAt(t.length-1);
    t = t.substring(0,t.length-2);
    setcolors(t);
    if (clr == '0') mycolor=BLACK;   else mycolor =WHITE;
    clickable = (cl=='0');
    highlight(clickable);
    if (Msg.rid!='' && (status==intfcwds[29] || status==intfcwds[1] || status==intfcwds[24]))
    {
        Msg.send({code:'plain',msg:(t+(mycolor==BLACK?1:0)+(clickable?1:0))});
    }
}
function getidv(bx)
{
   document.f1.id.value = bx.value;
}

function getPassv(bx)
{
   document.f1.password1.value = bx.value; 
}

function doupload(fn)
  {
        if (fn.files.length==0) return;
        var xmlhttp;
        if (window.XMLHttpRequest)
        {
            xmlhttp = new XMLHttpRequest();
        }
        else
        {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function()
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            {
                var y = '';
               
                var j = xmlhttp.responseText.indexOf('syn(');
                if (j > 0)
                {
                    var k = xmlhttp.responseText.indexOf(')',j+6);
                    y = xmlhttp.responseText.substring(j,k+1);
                }
                else
                {
                    j = xmlhttp.responseText.indexOf('failupload(');
                    if (j > 0)
                    {
                        k = xmlhttp.responseText.indexOf(');',j+6);
                        y = xmlhttp.responseText.substring(j,k+1).replace(/failupload/,'myprompt');
                    }
                }
                eval(y);
            }
        }
        var f = new FormData();
        var file = fn.files[0]
        f.append('file', file);
        f.append('rdap', 'gogame');
        xmlhttp.open('POST', "UploadWfa", true);
        xmlhttp.send(f);
    
  }
  function syn(z,fn)
  {
      ResizeUploaded.uploaded(z, fn);
      var s = document.getElementById('uploadinstru');
      s.rows[0].cells[2].onclick = function(){ResizeUploaded.cropuse(4);}
      s.rows[0].deleteCell(3);s.rows[0].deleteCell(3);s.rows[0].deleteCell(4); 
  }  
  function failupload(t, fl, fn, pathcode)
  {
   
  }
  function idblackwhite(t)
  {
      
      setcolors(t);
  }
  function help()
  {
      myprompt("<ol><li>" + gogamehelp.replace(/\.$/g,"").replace(/\./g,"</li><li>") + "</li></ol>");
      promptwin.style.width = "400px";
  }
  function makesound(j)
  {
       if( "Audio" in window) 
        {
            var str = "image/doorbell.mp3";
            if (j==2)str = "image/placestone.mp3";
            var a = null;
            try
            {
                a = new Audio();
                if ( (a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, '')))
                   a.src = str;
                a.autoplay = true;
             }catch(ee){} 
         }
     }


