function saveit2(v)
{
    if (!v) 
        saveit();
    else if (picfile(document.form3))
    { 
        formnewaction(document.form3);
        visual(document.form3);
        document.form3.submit();
    }
}
let maintbl = document.getElementById("maintbl");
let infotbl = document.getElementById("infotbl");
let fontSizeSel = document.form1.fontsizepx; 
let lblwinner = document.ff.proctor.value;
let lblmonitor = textmsg[635];
let lblhide = textmsg[732];
let cd = new Array(d.length);
let oldvalue;
let states = new Array(d.length);
let headerstates = new Array(3);
let anchor = document.getElementById("anchor");
let didass = false;
let larningoutcome = null;
let assesscol=-1;
let whofirstcol = -1;
let K=-1, J; 
let sid2row = [];
let sidsolution = [];
let sidassess = [];
let sidgrade = [];
let allmsgs = [];
let anchorstate = 0;
let dolatex = false;
let thelink = null;
let questionnum = 0;
let bufferedaction = new Array();
let filepathfrom = null;
let buttonhints = textmsg[1275];
var cas = new Array(3);
var nses = [0,0,0,0];
let latexswap = 1;
let lastdid = 0;
var timerhandler = new Array(4);
let timerstate = [0,0,0,0];
let maxqn = 0;
let totalsaved = 0;
let allsids = [];
let allroster = []; 
let isadmin = false;
let settingstr = "";
let xpos = 0, width1, width2;
let hasdone = false; 
let proctor = -1;
var caps = new Array();
var hints = new Array();
let sidQQ = [];
let sidRR = [];
let missingsid =  ',';
let allpost = true;
 
let needcode = false;
var oldonunload = window.onunload;

if (initialhintneed(7))
{
    var ugentmsg = initialhint(7, textmsg[88]);
}
function copyd()
{
    for (let i=1; i < cd.length; i++)
    {
        if (cd[i]==null)
            cd[i] = new Array(8);
        for (let j=0; j < 7; j++)
            cd[i][j] = d[i][j];
    }
}
function setnow1()
{
    document,form1.startstr.value = timestr(~~((new Date()).getTime()/1000)-10);
    document,form1.duestr.value = timestr(~~((new Date()).getTime()/1000)+7200);
    
    needsave(2);
    document,form1.duestr.style.color = "red";
    setTimeout(function() {
               document,form1.duestr.style.color = "black";
            }, 1000);
    document.form1.status.selectedIndex = 2;
    fontSizeSel.selectedIndex = 10;
    ongoing();
    if (headerstates[2]==1)
        switchall(2);
}
function tense()
{
    let correctnow = ~~((new Date()).getTime()/1000) + timedif;
    if (correctnow > parseTime(document.form1.duestr.value))
    {
         document.form1.status.selectedIndex = 3;
         enabling();
    }
    else if (correctnow >=  parseTime(document.form1.startstr.value))
    {
         document.form1.status.selectedIndex = 2;
         fontSizeSel.selectedIndex = 10;
         ongoing();
    }
    else  
    {
        document.form1.status.selectedIndex = 1;
        enabling();
    }  
}

function counts(i)
{
    let s = 0;
    for (let j=1; j < d.length; j++) if (d[j][i]!='') s++;
    return s;
}
function aven(i)
{
    let s = 0, n=0;
    for (let j=1; j < d.length; j++)
    {
        if (d[j][1]!=null && d[j][1]!= '')  
        {
            n++;
        }
    }
    for (let j=1; j < d.length; j++)
    {
        if (d[j][i]==null) continue;
        let z = d[j][i].replace(/[^0-9]/,'');
        if (z!='' && !isNaN(z))
        s +=   parseFloat(z);
    }
    if (n==0 || s==0) return '0' + (i==5?'.0%':'');
    if (i < 5) return s;
    let y =  Math.round(s/n);
    return y + '%'
}

function calculsum()
{
    maintbl.rows[maintbl.rows.length-1].cells[1].innerHTML = counts(1);
    maintbl.rows[maintbl.rows.length-1].cells[2].innerHTML = counts(2);
    maintbl.rows[maintbl.rows.length-1].cells[3].innerHTML = aven(3);
    maintbl.rows[maintbl.rows.length-1].cells[4].innerHTML = aven(4);
    
    let a = maintbl.rows[maintbl.rows.length-1].cells[3].innerHTML;
    let x = maintbl.rows[maintbl.rows.length-1].cells[4].innerHTML;
    let y = infotbl.rows[0].cells[9].innerHTML;
    let z = 0;
    if (isNaN(a) == false && isNaN(x) == false && isNaN(y) == false)
    {   
        let na = parseInt(a);
        let nx = parseInt(x);
        let ny = parseInt(y);
        
        if (ny >0 && na >0)
            z = Math.round(100*nx/na);
    }
    maintbl.rows[maintbl.rows.length-1].cells[5].innerHTML = (z == 0)? '' : (z + '%');
}
 

function iscurrent()
{
    return (document.form1.status.selectedIndex==2);
}

function enabling()
{
    document.ff.copyd.style.visibility = 'visible';
    document.ff.delbtn.style.visibility = 'visible';
    document.ff.submit1.style.visibility = 'visible';
    document.ff.alltext.style.visibility ='visible';
     
}
 
function ongoing()
{
    document.ff.delbtn.style.visibility = 'hidden';
    //document.form1.submit1.style.visibility = 'hidden';
    //document.form1.alltext.style.visibility = 'hidden';
     
}
function   verifyname(tb)
{
    tense();
    let x = tb.value;
    if (x==document.form1.assignname.value) return;
    if ( iscurrent())
    {
        myprompt(textmsg[1620]);
        tb.value = document.form1.assignname.value;
        return;
    }
    let j = x.indexOf("-");
    if (j>0 
        && document.form1.assignname.value.substring(0,j) != x.substring(0,j) 
        && document.form1.assignname.value.charAt(j) == '-')
    {
        myprompt(textmsg[1621]);
        tb.value = document.form1.assignname.value;
        return;
    }
   
    if (window==parent) return;
    
    let g = parent.frames[0].getActivesel();
    let i=0;
    for (; i < g.options.length; i++)
        if (g.options[i].value == x) break;
    if (i == g.options.length)
    {
        if (document.form1.newrecord.value == 'yes' )
           document.form1.assignname.value = x;
        g.options[g.selectedIndex] = new Option(x,x);
    }
    else
    {
        myprompt(x + " " + textmsg[3]);
        tb.value = document.form1.assignname.value;
    }
}

function holdit(t)
{
   needcopy();
   oldvalue = t.value;
}
function   verifydate(tb,k)
{
    let tn = parseTime(tb.value);
    if (tn == invalidtimevalue)
    {
        myprompt(textmsg[245] + "." + textmsg[246] +" " + timeformat);
        tb.focus();
        return;
    }
    if (k==2)
    {
        if ( parseTime(document.form1.startstr.value) >=  tn)
        {
           //  myprompt( textmsg[450] + ' >  ' + textmsg[451]); 
           //  tb.value = oldvalue;
        }
        //else 
            document.form1.quizdue.value = tn;
    }
    else if (k==1)
    {
        document.form1.start.value = tn;
        return;
        if ( tn >=  parseTime(document.form1.duestr.value) )
        {
             myprompt( textmsg[450] + ' >  ' + textmsg[451]);
             tb.value = oldvalue;
        } 
        else 
        {
            document.form1.start.value = tn;
            let x = document.form1.assignname.value.replace(/[0-9][0-9][0-9][0-9]$/,timestr1(tn, "MMDD"));
            if (parent!=window && x!=document.form1.assignname.value)
            {
                let g = parent.frames[0].getActivesel();
                let i=0;
                for (; i < g.options.length; i++)
                    if (g.options[i].value == x) break;
                if (i == g.options.length)
                {
                    myprompt(msg89 + " " + x);
                    if (document.form1.newrecord.value == 'yes' )
                       document.form1.assignname.value = x;
                    document.form1.newaname.value = x;
                    let j = g.selectedIndex;
                    g.options[j] = new Option(x,x);
                    g.selectedIndex = j;
                }
            }
        } 
    }
    tense();

}
var dragingk;
var holdhd = new Array(8);
var diff = [0,0];
function enabledrag(dv)
{
    Drag.init(dv);
    dv.onDragStart = function(x,y)
    {
       dragingk  = parseInt(this.innerHTML);
       let xy = findPositionnoScrolling(this);
       document.body.appendChild(this);
       this.style.position = 'absolute';
       this.style.left = xy[0] + 'px';
       this.style.top = xy[1] + 'px';
       for (let j=0; j < 7; j++)
       {     
           holdd[j] = d[dragingk][j];
           if (j < maintbl.rows[dragingk].cells.length)
               holdhd[j] =  maintbl.rows[dragingk].cells[j].innerHTML;
       }
       
    }
    dv.onDragEnd = function(x,y)
    {
        let k = 1;
        while (true)
        {
            let cir = document.getElementById('headimg' + k);
            if (cir == null) 
            {
                k=0; break;
            }
            let xy = findPositionnoScrolling(cir);
            let w = cir.offsetWidth;
            let h = cir.offsetHeight;
            let XY = findPositionnoScrolling(this);
            XY[0] += this.offsetWidth/2;
            XY[1] += this.offsetHeight/2;
             
            if (xy[0] < XY[0]  && XY[0]  < xy[0] + w && xy[1] < XY[1] && XY[1] < xy[1] + h)
                break;
            else k++;
        }
        
        if (k!=0 && k!=dragingk) 
        {
            let ss = document.form1.status.selectedIndex;
            if (ss == 1)
            {
                doswap(k);
            }
            else if (ss == 2)
                myprompt('Quiz started. Both questions can swap only when they are not done. Sure?',null,"if(v)doswap(" + k + ")");
            else
                myprompt("Quiz is done. Swapping is not allowed: (" + ragingk + ',' + k +")" ); 
        }
        let cir = document.getElementById('headimg' + dragingk);
        cir.appendChild(this);
        this.style.position = 'static';
    }
    copyd();
}
let holdd = new Array(8);
function doswap(k)
{
    let ll = k>dragingk?1:-1;
    for (let l=dragingk; l != k; l += ll)
    {
        for (let j=1; j < 7; j++) 
        {
            d[l][j] = d[l+ll][j];
            if (j < maintbl.rows[l].cells.length)
            maintbl.rows[l].cells[j].innerHTML = maintbl.rows[l+ll].cells[j].innerHTML;
        }
    }
    for (let j=1; j < 7; j++) 
    {
        d[k][j] = holdd[j];
        if (j < maintbl.rows[k].cells.length)
            maintbl.rows[k].cells[j].innerHTML = holdhd[j];
    }
    updateit(0);
}
function circlebg(n,k)
{
    let m = Math.round(n/2 + 3) ;
    return "<div style=\"font-family:arial;font-weight:700;width:" + (2*m) + "px;height:" + (2*m)
        + "px;border-radius:" + m + "px;font-size:" + n + "px;color:#ddcc11;line-height:" + (2*m) + "px;text-align:center;background-color:" + IBGCOLOR + "\">" 
        + k + "</div>";
}
function imgfont()
{
   let n = parseInt(fontSizeSel.options[fontSizeSel.selectedIndex].text.replace('px',''));
   let td =  null;
   let k = 1;
   while ( (td = document.getElementById("headimg" + k)) != null)
   {
       td.innerHTML = circlebg(n,k);
       enabledrag(td.childNodes[0]);
       k++;
   }
}
function changefont()
{
    let zz = fontSizeSel.options[fontSizeSel.selectedIndex].text;
    let m = parseInt(zz.replace(/px/,''));
    maintbl.rows[0].cells[0].width = m + 2;
    for (let i=1; i < maintbl.rows.length -1 ; i++)
    {
        for (let j=0; j < 2; j++)
            maintbl.rows[i].cells[j].style.fontSize = zz;
        maintbl.rows[i].cells[0].width = m + 2;
    }
    placeit();
    imgfont();
}

function ready2grade()
{
    let b = (maintbl.rows[maintbl.rows.length-1].cells[1].innerHTML ==  maintbl.rows[maintbl.rows.length-1].cells[2].innerHTML)
    && maintbl.rows[maintbl.rows.length-1].cells[2].innerHTML!= '0';
    if (!b)
    {
        myprompt(textmsg[1623]);
        return 0;
    }
    for (let i=1; i < maintbl.rows.length-1; i++)
    {
        if (maintbl.rows[i].cells[1].innerHTML.replace(/ /g,'') ==''
            && maintbl.rows[i].cells[2].innerHTML.replace(/ /g,'') !='')
        {
            myprompt(textmsg[456] + i + "=?");
            return 0;
        }
    }
    for (i=1; i < maintbl.rows.length-1; i++)
    {
         if (maintbl.rows[i].cells[2].innerHTML.replace(/ /g,'') ==''
            && maintbl.rows[i].cells[1].innerHTML.replace(/ /g,'') !='')
         {
            myprompt(textmsg[457] + i + "=?");
            return 0;
         }
    } 
    if (document.form1.status.selectedIndex!=3)
    {
        for (i=1; i < maintbl.rows.length-1; i++)
        {
            if (maintbl.rows[i].cells[1].innerHTML.replace(/ /g,'') !=''
                && isNaN(maintbl.rows[i].cells[3].innerHTML) == false
                && parseInt(infotbl.rows[0].cells[9].innerHTML) > parseInt(maintbl.rows[i].cells[3].innerHTML) )
            {
                myprompt("Not due yet.");
                return 0;
            }
        }
    }
    return 1;
}
function gradeit()
{
    if (document.ff.proctor.value != lblmonitor)
    {    
        bufferedaction[bufferedaction.length] = "gradeit()";
        myprompt(textmsg[242]);
        return;
    }
    if ( ready2grade() == 0) return;
    document.form1.target =  'w' + tstmp;
    formnewaction(document.form1,   'gradeQuiz.jsp');
    document.form1.question.value =   together(1);
    if (document.form1.question.value !='')
    {   
        visual(document.form1);
        submitbyajax(document.form1);
        //document.form1.submit();
    }
    else myprompt(textmsg[1355]);
    
    enabling();
}

function dogradequiz()
{
    if (document.ff.proctor.value != lblmonitor)
    {    
        bufferedaction[bufferedaction.length] = "dogradequiz()";
        myprompt(textmsg[242]);
        return;
    }
    document.form1.target =  'w' + tstmp;
    formnewaction(document.form1,   'gradeQuiz.jsp');
    
    if (document.form1.question.value !='')
    {
        visual(document.form1);
        submitbyajax(document.form1);
        //document.form1.submit();
    }
    else myprompt(textmsg[1355]);
    enabling();
}

function copyfornew()
{
     
     if (parent == window ) return;
    
     if (textmsg[327] == document.ff.copyd.value)
     {
         parent.frames[0].setCopied([together(1), together(2), together(6)]);
        // document.ff.copyd.disabled = true;
         parent.frames[0].enlargeit();
         myprompt(textmsg[1718]);
     }
     else
     {
         let a =  parent.frames[0].getCopied();
         if (a != null) 
         {
             pastez(a[0], a[1]);
            
             let x = a[2].replace(/^\n\n/,'').split(/\n\n/);
             for (let i=0; i < x.length; i++)
             {
                if (x[i]=='') continue;
                let y = "d[" + x[i].replace(/\.[ ]+/,'][6]="') + '"';
            
                try{eval(y);} catch( e){}
            }
             parent.frames[0].nullCopied();
         }
         document.ff.copyd.value = textmsg[327];
         document.ff.copyd.disabled = false;
     }
}
function deleteit()
{
   // if (document.form1.status.selectedIndex==1  || document.form1.status.selectedIndex==3 && infotbl.rows[0].cells[9].innerHTML == '0')
    {
        myprompt(textmsg[122], null, "if(v)deletegoahead()");
    }
   // else    myprompt(textmsg[1690]);
}

function deletegoahead()
{
    if (document.ff.proctor.value != lblmonitor)
    {    
        bufferedaction[bufferedaction.length] = "deletegoahead()";
        myprompt(textmsg[242]);
        return;
    }
    hasdone = false;
    document.form1.mode.value = 'delete';
    document.form1.target = 'w' + tstmp;
    formnewaction(document.form1,'embedquiz.jsp');
    visual(document.form1);
    //if (document.form1.question.value !='')
    document.form1.submit();
    
}
function setready(c)
{
    if ( onmydomain(parent.parent.opener) && typeof(parent.parent.opener.closeallchat)!='undefined')
    {
        parent.parent.opener.closeallchat(sek,'exam');
        parent.parent.opener.removeembed(f1.subdb.value,f1.course.value, f1.sessionname.value);
    }
    myprompt(c);
}
function resetmode(x)
{
    document.form1.mode.value = x;
}
function delcontent()
{
    document.body.innerHTML = msg71 + ". Refresh the window";
}
 
function setstates(b)
{
    for (let i=0; i < d.length; i++)
    {
        for (let j=0; j < 3; j++)
            states[i][j] = b;
    }
}

function needupdate()
{
    for (let i=0; i < d.length; i++)
        for (let j=1; j < 3; j++)
            if (d[i][j] != cd[i][j])
                return true;
    return false;
}
function together(j,notreplace)
{
    if (notreplace == null) 
        notreplace = false;
    let q = '';
    let m = d.length-1;
    while (m >= 1 && d[m][1] == '' && d[m][2] == '')
       m --;
    for (let i=1; i <= m; i++)
       if (j==1 && !notreplace)
        q += '\n\n' + i + ". " + d[i][1];
       else
        q += '\n\n' + i + ". " + d[i][j];
    if (q.replace(/\s/g,'') == '1.2.3.4.5.6.7.8.9.10.') return ''; 
    return q;
}

function change2(sel)
{
    if (sel.selectedIndex == 0) return;
    if (document.ff.proctor.value != lblmonitor)
    {    
        bufferedaction[bufferedaction.length] = "change2(document." + sel.form.name + "." + sel.name + ")";
        myprompt(textmsg[242]);
        return;
    }
    
    let qtxt = document.getElementById("allquest").value;
    let atxt = document.getElementById("allans").value;
    pastez(qtxt, atxt);
    
    document.form1.question.value =   (qtxt);
    document.form1.answer.value = atxt;
    assembeass();
    document.form1.target =  'w' + tstmp;
     
    document.form1.format.value = guessFormat(qtxt);
    formnewaction(document.form1, 'embedquiz.jsp?');
    document.form1.mode.value = "change";
    document.form1.appendChild(sel);
    
    if (document.form1.question.value !='')
    {
        visual(document.form1);
       // document.form1.submit();
        submitbyajax(document.form1);
    }
    else myprompt(textmsg[1355]);
    window.onbeforeunload = null;
}
function preview()
{
    if (document.ff.proctor.value != lblmonitor)
    {    
        bufferedaction[bufferedaction.length] = "preview()";
        myprompt(textmsg[242]);
        return;
    }
    document.form1.question.value =   together(1);
    document.form1.mode.value = "prev";
    myprompt("<iframe style=border:0px name=prevwwin width=600 height=700 src=\"\" />",null,null,document.ff.prevbut.value);
    document.form1.target =  'prevwwin';
    formnewaction(document.form1, 'embedquiz.jsp');
    
    if (document.form1.question.value !='')  
    { visual(document.form1);
    document.form1.submit();
    }
    else myprompt(textmsg[1355]);
}
function updateans(qn,ans)
{
    if (document.ff.proctor.value != lblmonitor)
    {    
        bufferedaction[bufferedaction.length] = "updateans(" + qn + ",'" + ans.replace(/'/g,"\\'").replace(/"/g,'\\"') + "')";
        myprompt(textmsg[242]);
        return;
    }
    postopen('embedquiz.jsp',['orgnum','course','sessionname','questionnum','answer','mode'],
             [orgnum, document.form1.course.value,
             document.form1.sessionname.value,
             qn, ans,'answer'], 'w' + tstmp);
     
}
function updateit(sendqu)
{
    if (document.ff.proctor.value != lblmonitor)
    {    
        bufferedaction[bufferedaction.length] = "updateit("+ sendqu + ")";
        myprompt(textmsg[242]);
        return;
    }
    verifydate(document.form1.duestr,2);
    verifydate(document.form1.startstr,1);
    let cn = counts(1); 
    if (sendqu==0 && cn == 0) return; 
    document.form1.question.value =   together(1);
    document.form1.answer.value = together(2);
    document.form1.scale.value = cn;
    document.form1.format.value = guessFormat(document.form1.question.value);
    assembeass();
     
    document.form1.target =  'w' + tstmp;
    formnewaction(document.form1, 'embedquiz.jsp');
    let mode = "update";
    if (sendqu > 0) mode += sendqu;  
    document.form1.mode.value = mode;
    if (sendqu!=null && sendqu==-1)
    {
        document.form1.status.options[4] = new Option("Close", "4");
        document.form1.status.selectedIndex = 4;
    }
    
    
    if (document.form1.question.value !='')
    {
        visual(document.form1);
        //document.form1.submit();
        submitbyajax(document.form1);
    }
    else myprompt(textmsg[1355]);
    window.onbeforeunload = null;
}
function switchall(j)
{
    
    if (headerstates[j] == null )
        headerstates[j] == initalshow?1:0;
    let span = document.getElementById('swlab' + j);
    let label = textmsg[1926].split(/@/);
    span.innerHTML =   label[headerstates[j]];
   
    if (headerstates[j] == null || headerstates[j] == 0)
    {
        headerstates[j] = 1;
        setstates(0);
    }
    else
    {
        headerstates[j] = 0;
        setstates(1);
    }
    for (let k=1; k < maintbl.rows.length-1; k++)
        switchsh(maintbl.rows[k].cells[j],k, j, true);
    displaylatex(maintbl);
    if (j == 1)
    {
        if (headerstates[2] == 1)
            switchall(2);
    }
}
function switchsh(td, i, j,notall)
{ 
    tense();
     
    if (states[i][j] == null || states[i][j] == 0)
    {
        td.innerHTML = addbreak(combine(d[i][j]));
        if (notall == null)displaylatex(td);
        states[i][j] = 1;
        //if (d[i][0]!='' && iscurrent()) initproc();
    }
    else
    {
       // if (iscurrent())
        {
           if (j ==1) LaTexHTML.deformat(td);
           td.innerHTML = (j==2)?manystars(d[i][2].length):
           ((d[i][1]=='')?'':msg1393);
           states[i][j] = 0;
        }
    }
}

function   placeit()
{
    imgfont();
    let c =  document.getElementById("anchorhold");; 
     
    if (c.childNodes.length < 1 )
    {
        c.appendChild(anchor);
        anchor.style.position = 'static';
        anchor.width = 3;
    }
}

function openassess1(outcome)
{
 larningoutcome = outcome;
 let outcomes = outcome.replace(/\n[ ]+\n/g, '\n\n').replace(/^[\s]+/,'').split(/[\n]+/);
 let outv = "";
 let ii=0;
 for (let i=0; i < outcomes.length; i++)
 {
 let z = outcomes[i].replace(/^[ ]+/,'');
 if (z=='') continue;
 ii++;
 let z1 = z.replace(/^[0-9]/, '');
 if (z==z1) z = (ii) + ". " + z;
 outv +=   z  ;
 if (i < outcomes.length-1) outv +="<br>";
 }
 myprompt(outv,null,null,textmsg[1014]);
 let xy = findPositionnoScrolling(maintbl.rows[0].cells[6]);
 let ww = findPositionnoScrolling(maintbl.rows[0].cells[2]);
 let xx = xy[0] - ww[0];
 
 promptwin.style.left = ww[0]  ;
 promptwin.style.top = (xy[1]) + 'px';
 setRoundedWidth(promptwin, xx);
}


function shassess()
{
    if (assesscol==-1)
    {
        let n = font_size;
       
    let cir =  
          "<div style=\"margin:0px 0px 0px 0px;padding:2px 2px 2px 2px;width:" + (n) + "px;height:" + (n)
        + "px;border-radius:" + (Math.round(n/2)+2) + "px;text-align:center;line-height:" + (n) + "px;vertical-align:middle;background-color:#DDCC11\">"
        + "<div style=\"margin:0px 0px 0px 0px;width:" + (n-1) + "px;line-height:" + (n-1) + "px;height:" + (n-1)
        + "px;border-radius:" + (Math.round((n-1)/2)+2) + "px;text-align:center;vertical-align:middle;background-color:"  + IBGCOLOR 
        +";font-size:" + (n+2) + "px;font-weight:700;color:#ddcc11\" class=headsty onmouseover=showhelphint1(this) onmouseout=hidemyhint() >&deg;</div></div>";

        assesscol = maintbl.rows[0].cells.length; 
        let cl = maintbl.rows[0].insertCell(-1); 
        cl.align="center";
        
        cl.style.cssText ="color:#ddcc11;background-color:" + IBGCOLOR + " !important";
        cl.innerHTML = "<nobr>" + goallbl + "</nobr>";//   "<img src=image/goal.gif  height=" + (4+font_size) + ">"; 
         
        
        for (let k=1; k < maintbl.rows.length-1; k++)
        {
            cl = maintbl.rows[k].insertCell(-1);
            cl.align="center";
            cl.vAlign = "top";
            let nums = "";
            for (let l=1; l < 16; l++) 
            nums += "<option  " + (''+d[k][6]==''+l?'selected':'') + " value=" + l + ">" + l + "</option>";
            cl.innerHTML = "<select  class=infoinput style=\"width:" + (3*font_size) + "px\" onblur=copycell(this," + k + ") onchange=\"didass=true;needsave()\">" + nums + "</select>";// value=\"" + d[k][6] + "\">";
        }
        cl = maintbl.rows[maintbl.rows.length-1].insertCell(-1);
        cl.align='center';
        cl.innerHTML = "<input size=4 class=infoinput  style=\"width:" + (2*font_size) + "px\"  onchange=\"didass=true;needsave()\" onblur=copycellall(this) value=\"\">";
        
        if (larningoutcome == null)
           open("DataText?rdap=assignass&subdb=&CourseId=" + document.form1.course.value + "&onbegin=44", "w"+tstmp);
        else
           openassess1(larningoutcome);
         
    }
    else
    {
        for (k=0; k < maintbl.rows.length; k++)
            maintbl.rows[k].deleteCell(assesscol);
        if (assesscol < whofirstcol) whofirstcol--;
        assesscol=-1;
        closeprompt();
    }
    if (didass==true && document.form1.status.selectedIndex == 3) 
        myprompt('You need to re-grade');
    
    placeit();
}
function roster(followfunc)
{
    if (keycount(allroster) > 0)
    {
        eval(followfunc);
        return;
    }
    let f1 = document.form1;
    let course=f1.course.value; 
    let sem = f1.semester.value; 
    let sessionname = f1.sessionname.value;
    let subdb = f1.subdb.value; 
    postopen('embedquiz.jsp',
       ['mode','orgnum','subdb','course','sessionname','semester', 'followfunc'],
       ['roster',''+orgnum, subdb,  course,   sessionname, sem, followfunc],
       'w' + tstmp);
    
}
function getkey()
{
   let f1 = document.form1;
   let key0 = (orgnum%65536) + "-" + f1.semester.value + "-" + f1.course.value + "-" +  f1.sessionname.value + "-" + f1.assignname.value; 
   return key0;
}
function fromcache()
{
    let str = localStorage[getkey()];
    if (str == null || str == '' || str.replace(/[^,]/g,'').length < 16) return;
    let x = (new CSVParse(str,"'",",")).nextRow();
    let qtxt = x[8];
    let atxt = x[9];
    pastez(qtxt, atxt);
    copypaste();
    document.ff.copyd.disabled = false;
}
function sendqa(k,j)
{
   let f1 = document.form1;
   f1.question.value = together(1);
   f1.answer.value = together(2);
   let str = "'" + f1.assignname.value + "',"
   + parseTime(f1.startstr.value) + "," + parseTime(f1.duestr.value) + ","
   + f1.format.value + ",4,'" + f1.sessionname.value + "'," + userid
   + ",2,'" + f1.question.value.replace(/'/g,"''") + "','" + f1.answer.value.replace(/'/g,"''")
   + "'," + f1.course.value + ",'" + f1.sessionname.value + "',"
   + (maintbl.rows.length-2) + "," + f1.weight.value
   + ",'" + document.form1.optionstr.value + "','" 
   + cidtitle.substring(f1.course.value.length+f1.sessionname.value+1).replace(/'/g,"''")
   + "','" + timeformat + "','" + f1.assess.value + "','" + f1.attach.value
   + "','',''";
   let key0 = getkey();
   localStorage[key0] = str; 
}
function emailmissed()
{
    let missedsid = "";
    for (let sid in allroster)
    {
        if (allsids[sid] == null)
        {
            if (missedsid != "")missedsid += ",";
            missedsid += sid;
        }
    }
    let f1 = document.form1;
    let course=f1.course.value; 
    let sem = f1.semester.value; 
    let sessionname = f1.sessionname.value;
    let subdb = f1.subdb.value; 
    postopen('embedquiz.jsp',
       ['mode','orgnum','subdb','coursetitle','sids'],
       ['missed',''+orgnum, subdb,  cidtitle.replace(/^[^ ]* /,''),    missedsid],
       'w' + tstmp);
    
}
function showwho()
{
    let nm2n = new Array();
    let mn = 1;
    for (let k=1; k < maintbl.rows.length-1; k++)
    {
        cl = maintbl.rows[k].cells[whofirstcol];
        if (d[k][7]!=null && d[k][7]!='')
        {
           cl.innerHTML =   d[k][7]; 
           cl.vAlign='top';
           cl.align='left';
           if (nm2n[d[k][7]] == null)
              nm2n[d[k][7]] = 1;
           else
           {   
               let j = nm2n[d[k][7]]+1;
               if (j > mn) mn = j;
               nm2n[d[k][7]] = j;
           }
        }
    }
    let who1 = '';
    for (let k=1; k < maintbl.rows.length-1; k++)
    {
        if (d[k][7]!=null && d[k][7]!='' && nm2n[d[k][7]] == mn && who1.indexOf("," + d[k][7])<0)
            who1 += "," + d[k][7];
    }
    cl = maintbl.rows[maintbl.rows.length-1].cells[whofirstcol];
    if (who1!='' )
    who1 =  who1.substring(1);
    if (who1.indexOf(",") < 0)
        cl.innerHTML = who1;
    else
         cl.innerHTML = '';
}

function showwho0()
{   
    if (document.ff.proctor.value == lblmonitor)
    {    
        initproc();
    }
    else  if (whofirstcol==-1)
    {
        whofirstcol = maintbl.rows[0].cells.length; 
        let cl = maintbl.rows[0].insertCell(-1); 
        cl.innerHTML = "<nobr>" + firstlbl + "</nobr>";
        cl.className = "headsty";
        cl.style.cssText ="color:#DDCC11;background-color:" + IBGCOLOR + " !important";
        cl.align="left";
        cl.vAlign = "top";
        for (let k=1; k < maintbl.rows.length; k++)
        {
            cl = maintbl.rows[k].insertCell(-1);
        }
        document.ff.proctor.value == lblhide;
    }
    else
    {
        for (k=0; k < maintbl.rows.length; k++)
            maintbl.rows[k].deleteCell(whofirstcol);
        if (assesscol > whofirstcol) assesscol--;
        whofirstcol=-1;
        closeprompt();
        document.ff.proctor.value == lblwinner;
    }
     
    placeit();
}


function needsave(c)
{
   window.onbeforeunload = nosaved;
}
function copycellall(td)
{
    let vl = '';
    if (td.tagName.toLowerCase() == 'input')
        vl = td.value.replace(/ /g, '');
    else
        vl = td.options[td.selectedIndex].value;
    if (assesscol < 0) return;
   
    for (let k=1; k < maintbl.rows.length; k++)
    {
        maintbl.rows[k].cells[assesscol].childNodes[0].value = vl;
        if (d[k]!=null) d[k][6] = vl;
    }
}
function copycell(td,k)
{
    let vl = '';
    if (td.tagName.toLowerCase() == 'input')
        vl = td.value.replace(/ /g, '');
    else
        vl = td.options[td.selectedIndex].value;
    d[k][6] = vl;
    document.ff.copyd.disabled = false;
}

 
function assembeass()
{
    let m = d.length-1;
    while (m >= 0 && d[m][1] == '' && d[m][2] == '')
       m --;
    let x =  "|#|,|pts|,|Objective|,|Answered|,|Correct|,|" + infotbl.rows[0].cells[9].innerHTML + "|";
    for (let i=1; i <= m; i++)
    {
        x += ";|" + i +"|,|1|,|" + d[i][6] +"|,|"+ d[i][3] +"|,|"+ d[i][4] +"|";
    }
    document.form1.assess.value = x;
    didass = false;
}
function pastez(qtxt, atxt)
{
    let z = new Hwtake('take', qtxt, atxt,'',    '', '2',-1,true);
    z.assemble(false);
    let l = z.answqrr.length;
    
    while  (l > maintbl.rows.length - 2)
        growrow();
    for (let i=1; i < d.length; i++)
    {
        if (z.answqrr[i]!=null)
        {
            d[i][2] = z.answqrr[i];
            maintbl.rows[i].cells[2].innerHTML = d[i][2];
        }
        else
        {
            d[i][2] = '';
            maintbl.rows[i].cells[2].innerHTML = d[i][2];
        }
        if (z.questarr[i]!=null)
        {
            d[i][1] = z.questarr[i];
             
            
            let fmt = guessFormat(d[i][1]);
            if (fmt == 0)
            {
                maintbl.rows[i].cells[1].innerHTML =  addbreak(combine(d[i][1]),true) ;
            }
            else
            {
                maintbl.rows[i].cells[1].innerHTML =  addbreak(combine(d[i][1]), true) ;
                displaylatex(maintbl.rows[i].cells[1]);
            }
            
        }
        else
        {
            d[i][1] = '';
            maintbl.rows[i].cells[1].innerHTML = d[i][1];
        }
    }
    let cn = counts(1);
    document.form1.scale.value = cn;
    maintbl.rows[maintbl.rows.length-1].cells[1].innerHTML = cn;
    maintbl.rows[maintbl.rows.length-1].cells[2].innerHTML = counts(2);
}
 
function parseall()
{
    let qtxt = document.getElementById("allquest").value;
    let atxt = document.getElementById("allans").value;
    pastez(qtxt, atxt);
    let div = document.getElementById("movingdiv");
    document.body.removeChild(div);
    copypaste();
    document.ff.copyd.disabled = false;
}
function cancelparseall()
{
    let div = document.getElementById("movingdiv") ;
    document.body.removeChild(div);
}
function falltext()
{
 
    let x = maintbl.offsetWidth-16;
    let y = maintbl.offsetHeight-30;
 
    let pos = findPositionnoScrolling(maintbl);
    let div = document.createElement("div");
    div.id="movingdiv";
    div.style.cssText="z-index:20;position:absolute;margin:1px 1px 1px 1px;border:1px #404040 outset;padding:0px 0px 0px 0px;top:"
    + (pos[1]+0) + 'px;left:'+ (pos[0]+0) + 'px;background-color:' + DBGCOLOR;
    div.className="outset3";
    let xx = document.ff.alltext.style.cssText;
    div.innerHTML = "<table border=0><tr bgcolor=" + IBGCOLOR +"><td style=color:#DDCC11>" + textmsg[178] +"</td><td style=color:#DDCC11>" + textmsg[457] +"</td></tr>"
    +"<tr><td><textarea id=allquest   style=\"margin:0 px 0px 0px 0px;height:" + y +"px;width:" +
    (x/2) +"px;background-color:font-size:20px;white;border:1px orange solid\" >"
    + together(1,true) + "</textarea></td><td><textarea id=allans   style=\"margin:0 px 0px 0px 0px;height:" + y +"px;width:" +
    (x/2) +"px;background-color:font-size:20px;white;border:1px orange solid\" >"
    + together(2,true) + "</textarea></td></tr><tr><td colspan=2><table align=center><tr><td  align=center>"
    +"<input name=helptxt class=GreenButton style=\"" + xx  +";text-align:center\" value=\"" + textmsg[17] + "\" onclick=\"formathelp()\">"
    +"</td><td><input name=cencels class=OrangeButton style=\"" + document.ff.submit0.style.cssText  +";text-align:center\" value=\"" + textmsg[18] + "\" onclick=\"cancelparseall()\">"
    +"</td><td><input name=parsetxt class=GreenButton style=\"" + xx  +";text-align:center\" value=\"" + msg1243 + "\" onclick=\"parseall()\">"
    +"</td><td width=5% align=right><nobr>"+  msg1219 + "</nobr></td><td width=10% align=left><select id=convert name=atype onchange=change2(this)><option value=0></option><option value=1>"+ textmsg[126] + "</option><option value=3>"+ textmsg[667] + "</option></select></td></tr></table></td></tr></table>";
 
    document.body.appendChild(div);
}
 
function formathelp()
{
    myprompt(textmsg[1368] + "<br><br>" +  textmsg[1276],null,null,textmsg[17]);
}
function contains(xy, x, y)
{
    let xbar = x-xy[0];
    let ybar = y-xy[1]
    
    return (0 <= xbar 
            && xbar <= xy[2] 
            && 0 <= ybar  
            && ybar <= xy[3]);
}

function showcontent(td,  k, j)
{
    let fmt = guessFormat(d[k][j]);
    let y = combine(d[k][1]);
    if (fmt==0)
    {
        td.innerHTML =  addbreak(y,true);
    }
    else
    {
    td.innerHTML =  addbreak(checkh(y, true));
    displaylatex(td);
    }
}

function needcopy()
{
    if (K!=-1)
    {
        copyvalue(K,J);
    }
}
function makedonebtn(td,k,j)
{
    let xy = findPositionnoScrolling(td);
    xy[0] += td.offsetWidth;
    xy[1] += td.offsetHeight-24;
    let btn = document.createElement('div');
    btn.id = 'donebtn' + k + '_' + j;
    btn.style.cssText = 'position:absolute;width:24px;height:24px;line-height:24px;border-radius:12px;background-color:orange;color:white;text-align:center;vertical-align:middle;font-size:15px;z-index:8;left:' + xy[0] +'px;top:' + xy[1] + 'px;border:1px #b0b0b0 outset;padding:5px 3px 0px 3px';
    btn.innerHTML = 'OK'
    btn.onclick=function()
    {
        let kj = this.id.substring(7).split(/_/);
        let k = parseInt(kj[0]);
        let j = parseInt(kj[1]);
        copyvalue(k,j);
        sendqa(k,j); 
    }
    document.body.appendChild(btn);
}

function reset1()
{
    latexswap = 1;
}
function insertlatexhints1(i) 
{
    let j = (new Date()).getTime();
    if (j - lastdid > 500)
    {
        if (latexswap == 1)
        {
            if (i == -1)
                showlatexsymbols();
            else
                insertlatexhints(i);
            latexswap = 0;
        }
    }
    lastdid = j;
}
function mask(s, k, j)
{
    let txt = document.getElementById("txt" + k + '_' + j);
    if (txt.style.color.toLowerCase() == 'white')
    {
        txt.style.color = 'black';
        s.innerHTML = 'Move cursor here to mask editing';
    }
    else
    {
        txt.style.color = 'white';
        s.innerHTML = 'Move cursor here to show editing';
    }
}
function manystars(n)
{
    return  "(" + n + ")";
}
function displaytxt(ta, evt, k, j)
{
    let e = evt? evt : window.event;
    if(!e) return true;
    let key = 0;
    if (e.keyCode) 
    {
        key = e.keyCode;
    } // for moz/fb, if keyCode==0 use 'which'
    else if (typeof(e.which)!= 'undefined') {
        key = e.which;
    }
    
    if (key == 13)
    {
        if (ta.rows>4)
            ta.rows = ta.rows + 1;
    }
    if (key==19)
        mask();
    return true;
}
function passto()
{
    if (K == -1) return;
    let k = K;
    let j = J;
    copyvalue(K,J);
    if (j==1) j=2;
    else {k++; j= 1;}
  
    if (k != maintbl.rows.length-1) 
        goedit(maintbl.rows[k].cells[j]);
    /*else if (key == 14)
    {
        copyvalue(k, j);
        passto();
    }
    */ 
     
}
function addbreak(str)
{
    str = str.replace(/\$[\s|\n]+\$/g, '$$');
    let s = 0;
    let x = '';
    let j = 0;
    for (let i=0; i < str.length; i++)
    {
        if (str.charAt(i) == '$')
        {
            if (i != j+1 && !(i>0&&str.charAt(i-1)=='\\') )
                s = 1 - s;
            j = i;
        }
        if (str.charAt(i) == '\n')
        {
            if (s == 0)
                x += '<br>';
            else
                x += '\n';
        }
        else
            x += str.charAt(i);
    }
    return x;
}
function post(k,j)
{
    if (allpost == false) return;
    if (document.ff.proctor.value != lblmonitor)
    {    
        bufferedaction[bufferedaction.length] = "post(" + k + "," + j + ")";
        myprompt(textmsg[242]);
        return;
    }
    let f1 = document.form1;
    if (allpost)
    postopen('embedquiz.jsp',
    'mode,orgnum,subdb,course,sessionname,questionnum,text,ableview'.split(/,/),
    ['post',''+orgnum,f1.subdb.value, f1.course.value,f1.sessionname.value,''+k,d[k][j],
        allpost?'1':'0'], 
     'w' + tstmp);
}
function confirmpost()
{
    let x = document.getElementById('lblpost');
    if (x!=null) x.style.color = 'green';
}
/*
function confirmset()
{
    document.getElementById('titlediv').innerHTML = 
    document.getElementById('titlediv').innerHTML.replace(/<.nobr>/i,"&nbsp;&nbsp;"+textmsg[532]+":"+code + "</nobr>");
}*/
function goedit(td)
{
    tense();
    needcopy();
    let tbl = td.parentNode.parentNode;
    if (tbl.tagName.toLowerCase()!='table')
    {
        tbl = tbl.parentNode;
    }
    let k  = 0;
    for (; k  < tbl.rows.length; k++)
    {
        if (tbl.rows[k] == td.parentNode)
            break;
    }
    let j = 1;
    for (; j  < 7; j++)
    {
        if (tbl.rows[k].cells[j] == td)
            break;
    }
    if (td.innerHTML.indexOf("textarea")>=0) return;
    let inht = td.innerHTML.replace(/^[\n|\s]+/,'').replace(/[\s|\n]+$/,'');
    LaTexHTML.deformat(td);
    if (  inht == msg1393)
    {
        showcontent(td,  k, j);
        placeit();
        post(k,j);
        return;
    }
    if (d==null) d = new Array();
    if (d[k] == null) d[k] = new Array(8);
    if (d[k][j] == null) d[k][j] = '';
    let y = td.offsetHeight  ;
    if (y < 100) y =100;
    let x = td.offsetWidth ;
    let fsl = fontSizeSel.selectedIndex;
    let fsstr =  fontSizeSel.options[fsl].value;
    if (j==2) fsstr = font_size;
    let str = "";
    let edt;
    if (iscurrent()&&j==2)
    {
         
        edt  =  "<input id=txt" + k + '_' + j +"  type=password style=\"border:0px;background-color:white;color:black;margin:0px 0px 0px 0px;width:" + x +"px;font-size:10"
        +   "px\" value=\""  + d[k][j] +  "\" >";
    }
    else
    {
        str = d[k][j].replace(/</g, "&lt;");
        edt  =  "<textarea id=txt" + k + '_' + j +"   style=\"border:0px;background-color:white;color:" + ((j==2 && iscurrent())?'black':'black') +";margin:0px 0px 0px 0px;height:" + (y) +"px;width:" + x +"px;font-size:"
        + fsstr + "px\" "
        + " onkeypress=\"return displaytxt(this,event," + k +',' + j +")\""
        + ">"  +  str +  "</textarea>";
    }
    td.style.border = "1px #c0c0c0 solid";
    td.style.padding = "0px 0px 0px 0px";
    td.innerHTML = edt;
    let txt = document.getElementById("txt" + k + '_' + j);
    associatedtxt = txt;
    textareatobesearch = txt;
    txt.focus();
    placeit();
    makedonebtn(td,k,j);
    onlinetoolbarfollow(txt)
    K = k;
    J = j;
    td.onclick = null;
     
} 

function copyvalue(k, j)
{
    let thenewtextbox = document.getElementById("txt" + k + '_' + j);
    standardize(thenewtextbox);
    savedk = k;
    let edt  = thenewtextbox.value.replace(/^[ ]+/, '').replace(/[ ]+$/,'');
    let fmt = guessFormat(edt);
    if (''+fmt!='0')
    {
        d[k][j] = checkh(edt);
        thenewtextbox.value = d[k][j]; 
    }
    else
        d[k][j] = edt;
   
    let td = maintbl.rows[k].cells[j];
    if (document.form1.status.selectedIndex == 2 && j==2)
        td.innerHTML =   manystars(edt.length);
    else
        td.innerHTML = combine(addbreak(d[k][j]));
    td.style.padding = "5px 5px 5px 5px";
    td.style.border = "0px";
    displaylatex(td);
    needsave();
    if (j==1) 
    {
        let cn = counts(1);
        document.form1.scale.value = cn;
        maintbl.rows[maintbl.rows.length-1].cells[1].innerHTML = cn;
    }
    if (j==2) maintbl.rows[maintbl.rows.length-1].cells[2].innerHTML = counts(2);

    states[k][j] = 1;
    
    if (k == maintbl.rows.length-2 && edt!='')
    {    
        growrow();
    }
    placeit(); 
    
    document.ff.copyd.disabled = false;
    let btn = document.getElementById( 'donebtn' + k + '_' + j);
    if  (btn != null) 
        document.body.removeChild(btn);
    K = -1;
    td.onclick = function()
    {
        goedit(this); 
    }
    if (iscurrent())
    {
        if (j==2)
        {
            updateans(k,edt);
        }
        else if (j == 1)
        {
            post(k,j);
        }
    }
    
}
function delrow(im)
{
    let f1 = document.form1;
    let course=f1.course.value;
    let subdb = f1.subdb.value;
    let sessionname = f1.sessionname.value;
    let assignname = f1.assignname.value;
    let sem = f1.semester.value;
    maintbl.deleteRow(maintbl.rows.length-2);
    postopen('embedquiz.jsp',
       ['mode','orgnum','subdb','course','sessionname','semester','assignname','numq'],
       ['numq',''+orgnum,subdb, course,  sessionname, sem, assignname,''+(maintbl.rows.length-2)],
       'w' + tstmp);
}
function growrow()
{
    let i = d.length;
    d[i] = new Array(8);
    cd[i] =  new Array(8);
    cd[i][6] = d[i][6] = '';
    cd[i][7] = d[i][7] = "";
    cd[i][0] = d[i][0] = "" + i;
    cd[i][1] = d[i][1] = "";
    cd[i][2] = d[i][2] = "";
    cd[i][3] =  d[i][3] = "0";
    cd[i][4] = d[i][4] = "0";
    cd[i][5] = d[i][5] = "";
    states[i] = new Array(3);
    states[i][1] = states[i][2] = 1;
    //let br = maintbl.rows[maintbl.rows.length-2];
    let rw = maintbl.insertRow(maintbl.rows.length-1);
   
    
    for (let j=0; j < maintbl.rows[0].cells.length; j++)
    {
        let cl = rw.insertCell(-1);
        cl.vAlign = "top";
        if (j==3 || j==4 || j==5) 
        {
            cl.align = 'right';
        }
        else if (j==0) 
        {
            cl.align = "center";
            cl.id = "headimg"  + (i);
        }
        else 
        {
            cl.align = 'left';
        }
        cl.style.cssText = maintbl.rows[i-1].cells[j].style.cssText;
    
        if (j==0) 
        {
             
            let n = parseInt(fontSizeSel.options[fontSizeSel.selectedIndex].text.replace('px',''));
            cl.innerHTML = circlebg(n,i);
            enabledrag(cl.childNodes[0]);
        }
        else if (j == assesscol)
        {
             let nums = "";
             for (let k=1; k < 16; k++) 
             nums += "<option value=" + k + ">" + k + "</option>";
             cl.innerHTML = "<select size=4 class=infoinput onblur=copycell(this," + i + ") onchange=\"didass=true;needsave()\" >" + nums + "</select>";
        }
        else
        {    
            cl.innerHTML =  addbreak(combine(d[i][j]));
            cl.id="t" + i +"_" + j;
        }
        
        if (j==1) cl.className = "heavyfont";
        if (j == 1 || j == 2)
        {
            cl.onclick = function()
            {
                let z = this.id.substring(1).split(/_/);
                let i = parseInt(z[0]);
                let j = parseInt(z[1]);
                goedit(this,i, j);
            }
             
        }
      
    }
    gridaddcol();
}
function changeweight(btn)
{
    needsave();
}
function nosaved()
{
    return textmsg[791];
}
 
function numbertests()
{
    if (document.form1.status.selectedIndex >= 2)
    {
        let y = 0;
        for (let i=1; i < maintbl.rows.length-1; i++)
        {
            let yy = parseInt(maintbl.rows[i].cells[3].innerHTML);
            if (yy  > y)
                y = yy;
        }
        infotbl.rows[0].cells[9].innerHTML = y;
    }
}

function showhelp()
{
    let p = (new CSVParse(buttonhints, "|",":", "\n")).nextMatrix();
    let x = "<table width=600 border=1 style=\"border-collapse:collapse;border-color:#c0c0c0\">"; 
    for (let i=0; i < p.length; i++) 
    { 
        if (p[i].length != 2) continue;
        x += "<tr>";
        if (p[i][0] == 'V') p[i][0] = "<div class=outer-div><div class=inner-div>V</div></div>";
        x += "<td align=left valign=top align=left><nobr>" + p[i][0] + "</nobr></td><td align=left valign=top align=left>" + p[i][1] + "</td>";
        x +="</tr>";
    }
    x += "</table>";
    myprompt(x,null,null,textmsg[17]);
    
}


function recordpos(x)
{
    xpos = x;
    width1 = maintbl.rows[0].cells[1].offsetWidth;
    width2 = maintbl.rows[0].cells[2].offsetWidth;
}
function reposition(x)
{
    x -= xpos;
    for (let i=maintbl.rows.length-1; i>=0; i--)
    {
        maintbl.rows[i].cells[2].style.width = (width2 - x) + 'px';
    }
    for ( i=maintbl.rows.length-1; i>=0; i--)
    {
        maintbl.rows[i].cells[1].style.width = (width1 + x) + 'px';
    }
    if (K != -1)
    {
       let txt = document.getElementById("txt" + K + "_" + J);
       if (txt==null) return;
       if (J == 1)
       {
           txt.style.width = (parseInt(txt.style.width.replace(/px/,'')) + x ) + 'px';
       }
       else
       {
           txt.style.width = (parseInt(txt.style.width.replace(/px/,'')) - x) + 'px';
       }
   }
}

function initanchor()
{ 
     if (anchorstate == 0 )
    {
        anchorstate = 1;
        let xy = findPositionnoScrolling(anchor);
        document.body.appendChild(anchor);
        anchor.style.position = "absolute";
        anchor.style.left = xy[0] + 'px';
        anchor.style.top = xy[1] + 'px';
        Drag.init(anchor);
        anchor.onDragStart = function(x,y)
        {
            recordpos(x);
        }
        anchor.onDragEnd =   function(x,y)
        {
            reposition(x);
            placeit();
            anchorstate = 2;
        }
    } 
}

function endanchor()
{
    if (anchorstate == 2)
        anchorstate = 0;
    else if (anchorstate == 1)
        placeit();
}

function copypaste()
{
    if (parent==window ) return;
    let a = parent.frames[0].getCopied();
    if (a == null || d[1][1] != '')
    {
        document.ff.copyd.value = textmsg[327];
    }
    else
    {
        document.ff.copyd.value = textmsg[1274];
    }
}
function dontchange(err)
{
    document.form1.removeChild(document.form1.atype);
    myprompt(err);
}

function openthis(s1, c1, a1, se ) 
{
   if (parent == window) return;
  
   cas[0] = c1;
   cas[1] = a1;
   cas[2] = se;
   sendsemster(s1);
}
function sendsemster(s1)
{
     if (document.ff.proctor.value != lblmonitor)
    {    
        bufferedaction[bufferedaction.length] = "sendsemster('" + s1 + "')";
        myprompt(textmsg[242]);
        return;
    }
    postopen('assignmentindex.jsp',['semester'],[s1],parent.frames[0].name);
}
function getinitdata()
{
    return cas;
}
 
function showhelphint1(lbl)
{
    let nm = lbl.innerHTML.replace(/<[^>]+>/g,'').replace(/^[ ]+/,'').replace(/[ ]+$/,'');
    if (nm == textmsg[1274]) nm = textmsg[327];
    nm = nm.replace(/%/,'');
    let j = caps[nm];
    showmyhint(j);
}
function showhelphint(lbl)
{
    let nm = lbl.value.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
    if (nm == textmsg[1274]) nm = textmsg[327];       
    nm = nm.replace(/%/,'');
    let j = caps[nm];
    showmyhint(j);
}
function enablelatex(btn)
{
    dolatex = !dolatex;
    btn.style.color = !dolatex?"#665566":"white";
}

 
function combine(x)
{
     
    let tt = ResizeUploaded.unzip(document.form1.attach.value);
    let hw = new Hwtake('rev', '', '', '', '', '', -1);
    hw.parseAttach(tt);
    addcss2head(0, hw.divs);
    return hw.merge(x);
}



function initproc()
{
    if (hasdone)
        myprompt(textmsg[3]);
    else if (document.form1.status.selectedIndex != 2)
    {
        myprompt(textmsg[455] + " &ne; " + document.form1.status.options[2].text);
    }
    else
    {
        showresponse([null]);
        roster("newqueuetopic()");
        hasdone = true;
    }
}
 

function newqueuetopic()
{
    passresponse();
}
 
function testreponse()
{
    let t = (new Date()).getTime();
    let x = 'D' + (t%7);
    let y = [x, String.fromCharCode('A'.charCodeAt(0) + (t%26)) + String.fromCharCode('A'.charCodeAt(0) + (t%20)), '' +(t%10+1), '' +(t%2)];
    showresponse(y)
}
function hidestudent(but)
{
    let tbl = but.parentNode.parentNode.parentNode.parentNode;
    if (but.value == textmsg[732])
    {
       let t = textmsg[1773].split(/@/);
       but.value = t[t.length-2]; 
       for (let row=1; row < tbl.rows.length;row++)
          if (tbl.rows[row].cells[0].innerHTML != '')
             tbl.rows[row].cells[0].style.visibility 
             = tbl.rows[row].cells[1].style.visibility = 'hidden';
    }
    else
    {
       but.value = textmsg[732];
       for (let row=1; row < tbl.rows.length;row++)
          if (tbl.rows[row].cells[0].innerHTML != '')
             tbl.rows[row].cells[0].style.visibility 
             = tbl.rows[row].cells[1].style.visibility = 'visible';
   }
}


function grade(qnum, solution) 
{
    let totalqnum = maintbl.rows.length-1;
    if (qnum > totalqnum) 
    {
            return -1;
    }
    let answer = "";
    if (qnum < d.length)
       answer = d[qnum][2];
    let score;
    if (answer == null || answer=="") 
    {
        return -1;
    }
    else
    {
        score =  gradehelp(solution, answer);
        return score;
    }
}   
 
function gradehelp(s,   answer)
{
    if (s==null || s == ("")) return 0;
    if (answer==null || answer==("")) return -1;
    s = s.toLowerCase();
    let v = answer.split(/ /);
    let score = -1;

    if (s==("")) 
    {
        score = 0;
    } 
    else 
    {
        let hits = 0;
        for (let i = 0; i <  v.length; ++i) 
        {
            if (s.indexOf(v[i]) < 0) continue;
            hits += 1;
        }
        score = (hits >= 0.6 * v.length) ? 1 : 0;
    }
    return score;
}

function gridaddcol()
{
   let grid = document.getElementById('grid');
   if (grid == null) return;
   let ct = 0;
   for (let r = 0; r < grid.rows.length; r++)
   {
      let old = grid.rows[r].cells[grid.rows[r].cells.length-1];
      let old1 = grid.rows[r].cells[grid.rows[r].cells.length-2];
      let c =  grid.rows[r].insertCell(-1);
      c.align = old.align;
      c.style.cssText = old.style.cssText;
      c.innerHTML = old.innerHTML;
      if (r==0)
      {
         let num = old1.innerHTML.replace(/<div[^>]+>/,'').replace(/<.div>/,'').replace(/[ |\r|\n]/g,"");
         old.innerHTML = old1.innerHTML.replace(/(<div[^>]+>)[0-9]+/, "$1" + (parseInt(num) + 1));
      }
      else if (grid.rows[r].cells[0].innerHTML=='')
      {
         ct++;
         if (ct < 3)
         old.innerHTML = "0";
      }
      else
      {
         old.innerHTML = ""; 
      }
      old.align=old1.align;
      old.style.cssText = old1.style.cssText;
   }
}
let keystr = null;

const xmlhttp = new XMLHttpRequest();
let polling = false;
xmlhttp.onreadystatechange = function()
{
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
    {
        var y = xmlhttp.responseText.replace(/^[ |\t|\n|\r]+/,'').replace(/[ |\t|\n|\r]+$/,'');
        if (y=='')
        {    
            passresponse();
        }
        else if (y!='stopmsg()')
        {
            showmessage(y);
            passresponse();
        }
        else  
        {
            myprompt(textmsg[1894],null,"if(v)passresponse()");
        }
    }
}    
function passresponse()
{
    let key1 = (orgnum%65536) + "|" + document.form1.semester.value + "|" + document.form1.course.value + "|" + document.form1.assignname.value + "|" + document.form1.sessionname.value; 
    keystr = Msg.hex(key1);  
    xmlhttp.open('GET', "Msgretrive?sek="+ sek + "&time="+ (new Date()).getTime() + "&key=" + keystr, true);
    xmlhttp.send();
}
function fetch(asyn)
{
    if (asyn==null)asyn = true;
    let f1 = document.form1;
    let course=f1.course.value; 
    let assname=f1.assignname.value; 
    let sem = f1.semester.value; 
    let sessionname = f1.sessionname.value;
    let subdb = f1.subdb.value; 
     
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var y = xmlhttp.responseText.replace(/^[ |\t|\n|\r]+/,'').replace(/[ |\t|\n|\r]+$/,''); 
            if (y!='')try{eval(y);}catch(e){myprompt(y);}
        }
    }
    if (keystr == null)
    {
        keystr = (orgnum%65536) + "|" + f1.semester.value + "|" + f1.course.value + "|" + f1.assignname.value + "|" + f1.sessionname.value; 
    }
    xmlhttp.open('GET', "embedquiz.jsp?key=" + Msg.hex(keystr), asyn);
    xmlhttp.send();
}
function asynsend(url)
{
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
                var x = xmlhttp.responseText;
                if (x!='')
                {
                    showmessage(x);
                    fetch();
                }
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
} 
function showmessage(msg)
{
    let p = new CSVParse(msg,'\'',",", ";");
    let idnmqs = p.nextRow();
    allmsgs[idnmqs[0] +'_'+ idnmqs[2]] = idnmqs;
    showresponse(idnmqs);
}
function showresponse(idnmqs)
{
      needsave();
      let C1 = 2; 
      if (idnmqs != null)
      {
            let sid = idnmqs[0];
            let N = parseInt(fontSizeSel.options[fontSizeSel.selectedIndex].text.replace('px',''));
            let ff = document.ff.helpbtn.style.fontFamily;
            let grid = document.getElementById('grid');
            if (grid == null)
            {
                if (typeof normaltimedelay != 'undefined')normaltimedelay = 10;
                maxqn = 0;
                grid = document.createElement('table');
                grid.id = 'grid';
                grid.align = 'center';
                grid.border = 1; 
                grid.cellSpacing = "1";
                grid.cellPadding = "3";
                grid.style.cssText = 'border-collapse:collapse;border-color:#999;margin-top:10px;alignment:center';
                document.body.insertBefore(grid,document.getElementById('copyright'));
                let row = grid.insertRow(0); 
                row.style.cssText =  "font-family:" + ff +  ";font-size:" + N + ";color:#DDCC11";
                let c1 = row.insertCell(-1); 
                c1.innerHTML = '<span   style="padding:3px 3px 3px 3px;float:left;background-color:'+ IBGCOLOR + ';font-family:' + ff +  ";font-size:" + N + ';color:#DDCC11">'
                             + textmsg[154]  + '</span>' ;
                c1.align = 'left'; 
                c1.style.borderRight = '0px'; 
                let c2 = row.insertCell(-1); 
                 
                c2.align = 'center'; 
                c2.style.cssText =  "border-left:0px;font-family:" + ff +  ";font-size:" + N + ";color:#DDCC11";
                c2.innerHTML =   document.ff.slink.outerHTML.replace(/value="[^"]+"/,"value=\""+ textmsg[732] + "\"")
                              .replace(/onclick="[^"]+"/,"onclick=\"hidestudent(this)\" ")
                              .replace(/style="/,"style=\"float:right;");
                for (let  cl=2; cl <  maintbl.rows.length; cl++)
                {
                   let cn = row.insertCell(-1); 
                   cn.innerHTML = circlebg(font_size,cl-1); 
                   cn.align = 'center';  
                   cn.onclick = passresponse;
                }
                let cn = row.insertCell(-1); 
                cn.innerHTML = document.ff.helpbtn.outerHTML.replace(/value="[^"]+"/i, 'value="' +  textmsg[1873].replace(/@.*$/,'')  +'"').replace(/onclick="[^"]+"/i, 'onclick="conclude()"'); 
                cn.align = 'right'; 
                
                cn.onclick = function()
                {  
                    deletefoot(grid);deletefoot(grid);deletefoot(grid);
                    let temp;
                    let counts = new Array(),counts1 = new Array();
                    for (let  kk=0; kk < 3; kk++)
                    {
                        let row = grid.insertRow(-1); 
                        row.style.cssText =  "font-family:" + ff +    ";font-size:" + N + ";color:purple";
                        row.bgColor = BBGCOLOR;
                        let c2 = row.insertCell(-1); 
                        c2.innerHTML = "";
                        c2.align = 'left'; 
                        c2 = row.insertCell(-1); 
                        c2.innerHTML = maintbl.rows[0].cells[3+kk].innerHTML;
                        c2.align = 'left';
                        c2.style.cssText =  "font-family:" + ff +    ";font-size:" + N + ";color:purple";
                        
                        for (let  col=2; col <  maintbl.rows.length + 1; col++)
                        {
                           let thecell = row.insertCell(-1);
                           if (col <  maintbl.rows.length )
                               thecell.align = 'center'; 
                           else
                               thecell.align = 'right';
                           let count = 0,count1=0;
                           if (col < maintbl.rows.length )
                           for (let z=1; z < grid.rows.length; z++)
                           {
                               if (grid.rows[z].cells[0].innerHTML == '')continue;
                               if (kk == 0 && grid.rows[z].cells[col].innerHTML != '')
                                   count++;
                               else if (kk==1 && grid.rows[z].cells[col].innerHTML != ''  
                                  && grid.rows[z].cells[col].innerHTML.charCodeAt(0) != 10007)
                                     count1++;
                           }
                           if (kk==0) 
                           {
                               if (col < maintbl.rows.length )
                               { 
                                   counts[col] = count;
                                   thecell.innerHTML = count;
                               }
                               else
                               {
                                   counts[col]=0;
                                   for (let l=2; l < col; l++)
                                       counts[col]+=counts[l];
                                   thecell.innerHTML = counts[col];
                               }
                           }
                           else if (kk==1) 
                           {
                               if (col < maintbl.rows.length)
                               { 
                                   counts1[col] = count1;
                                   thecell.innerHTML = count1;
                               }
                               else
                               {
                                   counts1[col]=0;
                                   for (let l=2; l < col; l++)
                                       counts1[col]+=counts1[l];
                                   thecell.innerHTML = counts1[col];
                               }
                           }
                           else if (kk==2) 
                           {
                              if (counts[col]!=0)
                                  thecell.innerHTML =  (100*counts1[col]/counts[col]).toFixed(0) + '%';
                              else
                                  thecell.innerHTML = ''; 
                           }
                        }
                    }
                    conclude();
                }
            }
            if (sid == null) return;
            let rowi = sid2row[sid];
            let sname = idnmqs[1];
            let qnum = idnmqs[2];
            if (rowi != null && qnum == '') return;
            let solution = idnmqs[3];  
            let order = idnmqs[4];
            let fmt = idnmqs[5];
            let numtester = 1;
            if (solution!='roster' && allsids[sid]==null)
            {
                allsids[sid] = 1;
                numtester = keycount(allsids);
                infotbl.rows[0].cells[9].innerHTML = numtester;
            }
            else if (solution=='roster' && allroster[sid]==null)
            {
                numtester = keycount(allsids);
                allroster[sid] = 1;
            }
            if (numtester<1) numtester = 1;
            let score = -1;
            let j = -3;
            if (qnum!='')
            {
                j = parseInt(qnum);
                if (j>=1) score = grade(j,solution);//idnmqs[6];
                
            }
            let row;
            if (j > maxqn) maxqn = j;
            j++;
            if (rowi == null && (j >=2 || solution == 'roster'))
            {
                if (solution != 'roster')
                {
                    deletefoot(grid);deletefoot(grid);deletefoot(grid);
                }
                sid2row[sid] = grid.rows.length;
                row = grid.insertRow(-1);
                row.style.cssText =   "font-family:" + ff +    ";background-color:" + TBGCOLOR + ";font-size:" + N + ";color:black";
                let c1 = row.insertCell(-1); c1.innerHTML = sid;c1.align = 'left';
                c1.style.cssText =   "font-family:" + ff +    ";background-color:" + TBGCOLOR + ";font-size:" + N + ";color:black";
                let c2 = row.insertCell(-1); c2.innerHTML = sname;c2.align = 'left';
                c2.style.cssText =   "font-family:" + ff +    ";background-color:" + TBGCOLOR + ";font-size:" + N + ";color:black";
                let nn = maintbl.rows.length-2;
                if (grid.rows.length > 1 && nn < maintbl.rows.length + 1-3)
                    nn = maintbl.rows.length + 1-3;
                for (let  cl=1; cl <= nn; cl++)
                {
                   let  cn = row.insertCell(-1); cn.align = 'center'; 
                   cn.style.cssText =   "font-family:" + ff +    ";background-color:" + TBGCOLOR + ";font-size:" + N + ";color:black";
                }
                let  cn = row.insertCell(-1);
                cn.align = 'center'; 
                cn.innerHTML = '0';
                cn.style.cssText =   "font-family:" + ff +    ";background-color:" + TBGCOLOR + ";font-size:" + N + ";color:black";
            }
            else if (rowi!=null && rowi>=0)
            {    
                row = grid.rows[rowi];
            }
            if (row == null ) return; //roster 
            if (j == 0)
            {
                if (solution == "roster")//submitted
                {
                    row.cells[row.cells.length-1].style.color = 'red';
                    row.cells[row.cells.length-1].align = 'right';
                }
                else if (solution == "submit")//submitted
                {
                    row.cells[row.cells.length-1].style.color = 'green';
                    calculsum();
                    savelocal();
                    computegrade(sid);
                    row.cells[row.cells.length-1].innerHTML = sidgrade[sid]==""?sidRR[sid]:sidgrade[sid];
                }
                else if (solution == 'take')
                {
                    row.cells[row.cells.length-1].style.color = 'black';
                    sidgrade[sid] = null;
                    let count = 0;
                    for(let col=2; col < row.cells.length-1;col++)
                        if (row.cells[col].innerHTML == '?'
                          ||row.cells[col].innerHTML == ''
                          ||row.cells[col].innerHTML.charCodeAt(0)==10003)
                            count++;
                    row.cells[row.cells.length-1].innerHTML = "" + count;
                }
                else
                {
                    myprompt(sid + " "+ sname + ":<br>" + solution);
                }
            }
            else if (j == 1)
            {
                 
            }
            else 
                row.cells[row.cells.length-1].style.backgroundColor = 'white';
            if (j >= row.cells.length-1)
            {
                for (let k=row.cells.length-1; k <= j; k++)
                {
                    grid.rows[0].insertCell(k).innerHTML = circlebg(font_size,j); //idnmqs[2];
                    grid.rows[0].cells[k].align = 'center';
                }
                for (let k=row.cells.length-1; k <= j; k++)
                {
                    for (let z=1; z < grid.rows.length; z++)
                    {
                        let cel = grid.rows[z].insertCell(k);
                        cel.align = 'center';
                    }
                }
            }
            if (j >= 2 && row.cells[j].innerHTML == '')
            {
               let N1 = maintbl.rows.length -1;
               //0:sid, 1:name, 2:qn, 3:solution, 4:time, 5:fmt, 6:score 
               row.cells[j].innerHTML = score==-1?'?':(''+score=='1'?'&check;':'&cross;');
               row.cells[j].onmouseover =function()
               {
                   eval('showmyhintstr("' + solution.replace(/"/g,'\\"') + '")');
               }
               if ( typeof(d[j-1])=='undefined' || d[j-1] == null)
               {    
                   d[j-1] = new Array();
                   d[j-1][3] = 1;
                   d[j-1][4] = (''+score=='1')?1:0;
                   d[j-1][5] = (100*d[j-1][4]/numtester).toFixed(0) +'%';
               } 
               else
               {
                   let count = 0,count1=0, bottom = grid.rows.length;
                   for (let z=1; z < bottom; z++)
                   {
                       if (grid.rows[z].cells[0].innerHTML == '')
                       {
                           bottom = z;
                           break;
                       }
                       if (grid.rows[z].cells[j].innerHTML != '')
                       {  
                           count++;
                           if (grid.rows[z].cells[j].innerHTML.charCodeAt(0) != 10007)
                              count1++;
                       }
                   }
                   
                   d[j-1][3] = count;
                   d[j-1][4] = count1;
                   d[j-1][5] = count==0?'':((100*count1/count).toFixed(0) +'%');
                   if (bottom < grid.rows.length)
                   {
                      grid.rows[bottom].cells[j].innerHTML = count;
                      grid.rows[bottom+1].cells[j].innerHTML = count1;
                      grid.rows[bottom+2].cells[j].innerHTML = d[j-1][5];
                   }
               }
               if( (d[j-1][7]==null || d[j-1][7]=='') &&''+score=='1') 
                    d[j-1][7] = sname;
                
               if (cd[j-1]==null)  
                   cd[j-1] = new Array(8);
               for (let l=0; l < 8; l++)  
                   cd[j-1][l] = d[j-1][l]; 
               maintbl.rows[j-1].cells[3].innerHTML = d[j-1][3];
               maintbl.rows[j-1].cells[4].innerHTML = d[j-1][4];
               maintbl.rows[j-1].cells[5].innerHTML = d[j-1][5];
                
               row.cells[j].onmouseout = hidemyhint;
               if (sidsolution[sid] == null) 
                   sidsolution[sid] = new Array(N1);
              
               sidsolution[sid][j-1] = (j-1) + ",'" + solution.replace(/'/g,"''") + "',"
               + order + "," + fmt + "," + (j-1) + "," + score;
               
               if (sidassess[sid] == null) 
                   sidassess[sid] = new Array(N1);
               sidassess[sid][j-1] = (j-1) + ",1," + (''+score).replace(/\\-/,'');
               if (score == 1 || score == -1 )
               row.cells[row.cells.length-1].innerHTML = '' + (parseInt(row.cells[row.cells.length-1].innerHTML) + 1);
               row.cells[row.cells.length-1].style.color = 'black';
            }
        }
}
function download_file(name) 
{
        let mime_type =  "text/csv";
        let grid = document.getElementById('grid');
        let contents = "";
        let N = grid.rows.length;
        let answered = grid.rows[N-3].cells[1].innerHTML.replace(/<[^>]+>/g,'').replace(/[\r|\n|\t]/g,'').replace(/^[ ]+/,'').replace(/[ ]+$/,'');
        let right = grid.rows[N-2].cells[1].innerHTML.replace(/<[^>]+>/g,'').replace(/[\r|\n|\t]/g,'').replace(/^[ ]+/,'').replace(/[ ]+$/,'');
        let score = textmsg[28];
        let totalQ = 0;
        let totalR = 0;
        let totalS = 0;
        let Q,R,S;
        let graded = true;
        for (let i = 0; i < N; i++)
        {
            if (i > 0) contents += '\n';
            let sid;
            for (let j =0; j < maxqn+2; j++)
            {
                let x =   grid.rows[i].cells[j].innerHTML.replace(/<[^>]+>/g,'').replace(/[\r|\n|\t]/g,'').replace(/^[ ]+/,'').replace(/[ ]+$/,'') ;
                if (x.charCodeAt(0) == 10007) x = "0";
                else if (x.charCodeAt(0) == 10003) x= "1";
                contents += '"' + x + '",';
                if (j==0) sid = x;
            }
            if (i==0)
                  contents += '"' + answered + '","' + right + '","' + score + '"';
            else if (i< N-3 && sid!='')
            {
                Q = sidQQ[sid]; R = sidRR[sid]; S = sidgrade[sid];
                contents += '"' + Q + '","' + R + '","' + S + '"';
                totalQ += Q;
                totalR += R;
                if (S!='' && !isNaN(S))
                    totalS += parseFloat(S);
                else
                    graded = false;
            }
            else if (i == N-3)
            {
                contents += '"' + totalQ + '","'+(100*totalR/totalQ).toFixed(0)+'%","'+ (graded?(totalS/(N-4)).toFixed(2):'') + '"';
            }
            else if (i == N-2)
            {
                contents += '"","' + totalR + '",""';
            }
            else  
            {
                let tm = grid.rows[grid.rows.length-1].cells[grid.rows[grid.rows.length-1].cells.length-1].innerHTML;
                contents += '"' + tm + '","","'+ (graded?(100*totalS/(N-4)/maxqn).toFixed(0):'') + '%"';
            }
        }    
        let blob = new Blob([contents], {type: mime_type});

        let dlink = document.createElement('a');
        dlink.download = name;
        dlink.href = window.URL.createObjectURL(blob);
        dlink.onclick = function(e) {
            // revokeObjectURL needs a delay to work properly
            let that = this;
            setTimeout(function() {
                window.URL.revokeObjectURL(that.href);
            }, 1500);
        };

        dlink.click();
        dlink.remove();
        window.onbeforeunload = null;
    }

 
function conclude()
{
   postopen("embedquiz.jsp",["mode","key"],["done",keystr],"w" + tstmp);
   if (filepathfrom==null)
   {
       filepathfrom = document.form1.course.value + "-" + document.form1.assignname.value + ".csv";
   }
   let lbl = textmsg[1873].split(/@/);
   let c = keycount(allsids);
   let d = keycount(allroster);
   let a = keycount(sid2row);
   let b = keycount(sidgrade);
   let title = lbl[0];
   let instr = "";
   
   if (a > b)
   {    
       instr = lbl[1] + "<br><center>"+ document.ff.slink.outerHTML
               .replace(/name="slink"/, 'id="submitfor"')
               .replace(/value="[^"]+"/i, 'value="' +  textmsg[61]  +'"')
               .replace(/onclick="[^"]+"/i, 'onclick="submitforstudent(1)"')  
               + "</center><hr>"; 
   }
   else 
   {
       instr  = lbl[2] + '<br><center>' +  document.ff.slink.outerHTML
               .replace(/name="slink"/, 'id="deletecache"')
               .replace(/value="[^"]+"/i, 'value="' +  textmsg[69]  +'"')
               .replace(/onclick="[^"]+"/i, 'onclick="deleteeq(1)"')  
               + "</center><hr>";
       window.onbeforeunload = null;
   }
   if (d > c)
   {
       instr = lbl[4] + "<br><center>"+ document.ff.slink.outerHTML
               .replace(/name="slink"/, 'id="emailfor"')
               .replace(/value="[^"]+"/i, 'value="' +  textmsg[516]  +'"')
               .replace(/onclick="[^"]+"/i, 'onclick="emailmissed()"')  
               + "</center><hr>"; 
   }
   instr  += lbl[3];   
   myprompt(instr, filepathfrom, 'download_file(v)', title); 
}
function keycount(x)
{
    let c = 0;
    for (let y in x) c++;
    return c;
}
function deletedeq()
{
    let  but = document.getElementById("deletecache");
    if (but!=null)
    {
            let p = but.parentNode;
            let dv = document.createElement('span');
            dv.id = 'deletedeqs';
            dv.innerHTML =  textmsg[1351];
            p.insertBefore(dv,but);
            p.removeChild(but);
    }
    else 
        closeprompt();
}

function submitforstudent(first)
{
    if (first !=null)
    {    
        totalsaved = 0;
        missingsid = ',';
        let but = document.getElementById('submitfor');
        if (but!=null)
        {
            let p = but.parentNode;
            let dv = document.createElement('span');
            dv.id = 'savedn';
            dv.innerHTML = '0 ' + textmsg[1866].split(/@/)[1];
            p.insertBefore(dv,but);
            p.removeChild(but);
        }
    } 
    let grid = document.getElementById('grid');
    let sid;
     
    for (sid in sid2row)
    {
        if (sidgrade[sid] == null && !missingsid.includes(','+ sid + ','))
        {
            let aline = computegrade(sid);
            if (aline!=null) 
                sendgrade(sid,aline);
            return;
        }
    }
    deleteeq(1);
    window.onbeforeunload = null;
}

function computegrade(sid)
{
    let n = sid2row[sid];
    let grid = document.getElementById('grid');
    if (grid == null) { return null;}
    let row = grid.rows[n];
    let S = 0, Q = 0;
    for (let col=2; col < row.cells.length-1 && col <= maxqn+1; col++)
    {
       let value = row.cells[col].innerHTML;
       let nv = 0; if (value.length>0) nv = value.charCodeAt(0);
       if (value == '?'||value == '')
       {
           sidgrade[sid]=''; 
           Q++; 
           S++;
       }
       else if (value.charCodeAt(0) == 10003)
       {
           Q++;  
           S++;
       }
       else Q++;
    }
    if (Q == 0)
    {
        missingsid +=  sid + ',';
        return null;
    }
    sidQQ[sid] = Q;
    sidRR[sid] = S;
    if (sidgrade[sid]=='') return "";
    let formula = extrformula();
    let fomu = formula.replace(/Q/g,''+Q).replace(/S/g,''+S);
    sidgrade[sid] = eval(fomu).toFixed(2);
    return Q + ",0," + S + ",|" + formula + "|,0," + sidgrade[sid] + ","
}
function packit(arr,separator)
{
    let sum = '';
    for (let i=1; i < arr.length  && i <= maxqn; i++)
    {
        if (sum != '') 
            sum += separator;
        if (arr[i] == null)
          if (separator == ';')
             sum += i + ",1,0";
          else
             sum += i + ",'',"+ (maxqn+1) + ",0," + i + ",0";
        else
          sum += arr[i];
    }
    
    return sum;
}

function deleteeq(notupdate)
{
    if (document.ff.proctor.value != lblmonitor)
    {   
        let ss = '1';
        if (notupdate == null) ss = '';
        bufferedaction[bufferedaction.length] = "deleteeq(" + ss + ")";
        myprompt(textmsg[242]);
        return;
    }
    let f1 = document.form1;
    let course=f1.course.value; 
    let sem = f1.semester.value; 
    let sessionname = f1.sessionname.value;
    let subdb = f1.subdb.value; 
    if (notupdate!=null)
    {
       postopen('embedquiz.jsp',
       ['mode','orgnum','subdb','notupdate','course','sessionname','semester'],
       ['remove',''+orgnum,subdb,  "1",course,   sessionname,      sem],
       'w' + tstmp);
       
    }
    else
    {
        postopen('embedquiz.jsp',
       ['mode','orgnum','subdb','course','sessionname','semester'],
       ['remove',''+orgnum,subdb, course,   sessionname,      sem],
       'w' + tstmp);
    }
    //if (document.ff.proctor.value != lblmonitor)  Msg.send({code:'unsubs'});
}
function sendgrade(sid,aline)
{
    if (document.ff.proctor.value != lblmonitor)
    {   
        let ss = 'sendgrade("' + sid + "',";
        if (aline == null) ss += "null)";
        else ss += "'" + aline + "')";
        if (notupdate == null) ss = '';
        bufferedaction[bufferedaction.length] = ss;
        myprompt(textmsg[242]);
        return;
    }
    let cont = packit(sidsolution[sid],'\n');
    let f1 = document.form1;
    let course=f1.course.value; 
    let assign = f1.assignname.value; 
    let sessionname = f1.sessionname.value;
    let sem = f1.semester.value;  
    let grade = sidgrade[sid]; 
    let subdb = f1.subdb.value; 
    if (aline!='')
    {
       let ass = packit(sidassess[sid],';');
       ass += ';' + aline;
       postopen('embedquiz.jsp',
       ['mode','orgnum','subdb','sid','course','sessionname',  'assignname','semester','Content','assess','grade'],
       ['save',''+orgnum,subdb,   sid,course, sessionname,  assign,      sem,        cont,    ass,      grade],
       'w' + tstmp);
    }
    else
    {
        postopen('embedquiz.jsp',
        ['mode','orgnum','subdb','sid','course','assignname','semester','Content'],
        ['save',''+orgnum,subdb,   sid,course,   assign,      sem,        cont],
        'w' + tstmp);
    }
    
}
function savedgrade(sid,success)
{
   let n = sid2row[sid];
   if (n == null)
   {
       return;
   }
   
   let grid = document.getElementById('grid');
   if (n >= grid.rows.length) return;
   let row = grid.rows[n];
   if (sidgrade[sid]!='')
   row.cells[row.cells.length-1].innerHTML = sidgrade[sid];
   row.cells[row.cells.length-1].style.color = success? 'green':'red';
   if (success)
   { 
       totalsaved ++;
       let but = document.getElementById('savedn');
       but.innerHTML = but.innerHTML.replace(/[0-9]+/,'' + totalsaved);
   }
   submitforstudent();
}
function deletefoot(grid)
{
    let r = grid.rows[grid.rows.length-1];
    if (r.cells[0].innerHTML == '') 
        grid.deleteRow(grid.rows.length-1);
}
let withcode = false;
let shorten = false;
function studentlink(code1)
{  
    let f1 = document.form1;
    if (document.ff.proctor.value != lblmonitor)
    {   
        let ss = 'studentlink(code)';
        bufferedaction[bufferedaction.length] = ss;
        myprompt(textmsg[242]);
        return;
    }
     
    if (!shorten)
    {
        let u = 'x,orgnum,subdb,semester,course,sessionname,assignname,coursetitle';
        if (withcode) u += ",code";
        let v = ['encode6b',''+orgnum ,f1.subdb.value,f1.semester.value,f1.course.value,
            f1.sessionname.value,f1.assignname.value,cidtitle.replace(/^[^ ]* /,'')];
        if (withcode) v[v.length] = code1;
        postopen('follows.jsp',u.split(/,/), v, 'w'+tstmp);
    }
    else
    {
        let v = f1.subdb.value + "|" + 
        f1.semester.value + "|" + 
        f1.course.value+ "|" + 
        f1.sessionname.value+ "|" + 
        f1.assignname.value;
        
        if(withcode) v += '|'+ code1;
        postopen('follows.jsp',  'x,c'.split(/,/),["enforce6b", v],'w'+tstmp);
    }
}
function safelink(code6b) 
{
    let ms = textmsg[1888].split(/@/);
    let explicit = code6b.includes("orgnum=");
    if (explicit)
    {
        safelink0(code6b,"assigntest.jsp",1, document.form1.newname);
    }
    else
    {
       code6b = code6b.replace(/code6b=/,"c=" + orgnum + "-");
       safelink0(code6b,"assigntest.jsp",1, document.form1.newname); 
    }
    let copybut = document.getElementById('copybutt');
        let tbl = copybut.parentNode.parentNode.parentNode;
        if (tbl.tagName.toLowerCase()!='table')
            tbl = tbl.parentNode;
     
    let tr = tbl.insertRow(1);
    let td = tr.insertCell(-1);
    let y = code6b.includes("orgnum=");
    td.style.fontFamily = "var(--fontname)";
    td.style.fontSize = "var(--fontsize)";
    td.innerHTML = '<input id=chkshorten type=checkbox onclick="javascript:shorten=!shorten;studentlink(code);" ' + (shorten?'checked':'') + ' > ' + ms[0];
    
    document.getElementById('myprompthead').innerHTML = textmsg[1872];
}
 
 
function setnologin(checked)
{
    nologin = checked;
    if (checked==true && !document.form1.optionstr.value.includes(";n:")
            && document.form1.optionstr.value.indexOf("n:")!=0)
        document.form1.optionstr.value = ";n:" + document.form1.optionstr.value;
    else if (!checked  && (document.form1.optionstr.value.includes(";n:")
            || document.form1.optionstr.value.indexOf("n:")==0))
        document.form1.optionstr.value = document.form1.optionstr.value.replace(/^n:/,'').replace(/;n:/,'');
}
 

function setpost(vchecked)
{
    if (document.ff.proctor.value != lblmonitor)
    {   
        let ss = 'setpost(' + vchecked + ")";
        bufferedaction[bufferedaction.length] = ss;
        myprompt(textmsg[242]);
        return;
    }
    allpost = vchecked;
    let f1 = document.form1;
    if (allpost == false)
    {
        postopen('embedquiz.jsp',
        'mode,orgnum,subdb,course,sessionname,ableview'.split(/,/),
        ['post',''+orgnum,f1.subdb.value, f1.course.value,f1.sessionname.value,"0"],
        'w' + tstmp);
        return;
    }
    let allt = ""; 
    for (let i = 1; i < maintbl.rows.length-1; i++)
    {
        if (allt!='') allt += ';';
        let td = maintbl.rows[i].cells[1];
        if (td.innerHTML.replace(/^[\n|\s]+/,'').replace(/[\s|\n]+$/,'') != msg1393
            && d[i][1] != null && d[i][1] != '')    
            allt += i + ",'" + d[i][1].replace(/'/g, "''") + "'";
        else if (td.innerHTML.replace(/^[\n|\s]+/,'').replace(/[\s|\n]+$/,'') == msg1393
            && d[i][1] != null && d[i][1] != '')
            allt += i + ",";
        else if (d[i][1] == null || d[i][1] == '')
            allt += i + ",''";
    }
    postopen('embedquiz.jsp',
    'mode,orgnum,subdb,course,sessionname,text,ableview'.split(/,/),
    ['post',''+orgnum,f1.subdb.value, f1.course.value,f1.sessionname.value,allt,allpost?'1':'0'],
    'w' + tstmp);
}
function enlarge()
{
    let b = document.getElementById('lblcode');
    let x = b.style.fontSize;
    x = x.replace(/[^0-9]/g,'');
    let y = parseInt(x);
    b.style.fontSize = (y + 2) + 'px';
    let bb = document.getElementById('code');
    y = parseInt(bb.style.fontSize.replace(/[^0-9]/g,''));
    bb.style.fontSize = (y + 2) + 'px';
    bb.style.width = (3*(y+2)) + 'px';
}

 
function setformula()
{
    let qs =  textmsg[1799].split(/@/);
    let str ='<input type=checkbox ' + (allpost?'checked':'') + ' onchange="setpost(this.checked)"><span id=lblpost> ' + textmsg[1874].replace(/@.*$/,'') + "</span><hr>";
    str +='<input type=checkbox ' + (nologin?'checked':'') + ' onchange="setnologin(this.checked)"><span id=lblnologin> ' + textmsg[1886]  + "</span><hr>";
    str +='<table width=100% style="margin:0px 0px 0px 0px"><tr><td width=50% >' + makecontrols(document.form1.optionstr.value);
    str += "</td></tr></table><hr>" +qs[2] + ":&nbsp;&nbsp;<a href=\"javascript:showfhint()\">(?)</a>"; 
    str += '<table id=formulahint cellpadding=3 width=300 cellspacing=1 style=border-collapse:collapse;border-color:#999999;display:none;border-radius:3px border=1 align=center>';
    str +='<tr><td class=cellbg  align=center style=background-image:linear-gradient(var(--bbgcolor),var(--tbgcolor));font-weight:600 colspan=2>'+textmsg[865+373] + '</td></tr>';
    str +='<tr><td class=cellbg  width=50  align=left > <nobr><b>'+textmsg[865+374] +'</b></nobr></td> <td class=cellbg width=100% >'+textmsg[865+375] +'</td></tr>';
    str +='<tr><td class=cellbg  width=50  align=left > <b> Q </td> <td class=cellbg >'+qs[0] +'</td></tr>';
    str +='<tr><td class=cellbg  width=50  align=left > <b> S </td> <td class=cellbg >'+qs[1] +'</td></tr>';
    str +='</table><br>';
    str +='<table  id=formulahint2   cellspacing=1 width=300 cellpadding=3  style=border-collapse:collapse;border-color:#999999;display:none;border-radius:3px border=1 align=center >';
    str +='<tr><td class=cellbg  colspan=4  style=background-image:linear-gradient(var(--bbgcolor),var(--tbgcolor));font-weight:600 align=center>'+textmsg[865+378] +'</td></tr>';
    str +='<tr><td class=cellbg  width=50  align=center > <b>  <font size=2>&nbsp;+&nbsp;</font></b> </td><td class=cellbg  width=50% >'+textmsg[865+379] +'</td>';
    str +='<td class=cellbg  width=50  align=center > <b> <font size=3> - </font></b> </td><td class=cellbg  width=50% >'+textmsg[865+380] +'</td></tr>';
    str +='<tr><td class=cellbg  width=50  align=center > <b> <font size=2> * </font></b>   </td><td class=cellbg >'+textmsg[865+381] +'</td>';
    str +='<td class=cellbg  width=50  align=center > <b>  <font size=2> / </font></b>  </td><td class=cellbg >'+textmsg[865+382] +'</td></tr>';
    str +='<tr><td class=cellbg  width=50  align=center > <b>  <font size=2> ^ </font></b>  </td><td class=cellbg >'+textmsg[865+383] +'</td>';
    str +='<td class=cellbg  width=50  align=center > <b>  <font size=2> (&nbsp;&nbsp;) </font></b>  </td><td class=cellbg >'+textmsg[1260] +'</td></tr>';
    str +='</table>';
    myprompt(str, extrformula(), "saveformula(v)", msg842);
     
}

 
function snapshot1()
{
    let f1 = document.form1;
    postopen('embedquiz.jsp',['orgnum','subdb','course','sessionname','assignname','mode'],
             [orgnum, 
             f1.subdb.value, 
             f1.course.value,
             f1.sessionname.value,
             f1.assignname.value,
             'snapshot'], 'w' + tstmp);
}
function showobj(s)
{
    if (s == null)
    {
        myprompt(textmsg[1896]);
        return;
    }
    let t = '';
    let r = new Array(s.NumberQuestion+1);
    r[0] = "<tr><td>#</td>";
    for (let i=1; i < s.NumberQuestion + 1; i++)
        r[i] = "<tr><td>" + i + "</td>";
    for (let x in s)
    {
       let y = s[x];
       if (Array.isArray(y))
       {
          r[0] += "<td>"+ x  + "</td>";
          for (let k=1; k < s.NumberQuestion + 1; k++)
          {
              let z = ((y==null|| y.length==0 || y[k]==null)?"":(y[k].length>15?(y[k].substring(0,15)+"..."):y[k]));
              r[k] += "<td>" + z + "</td>";
          }
       }
       else if (typeof(y) == 'string' || typeof(y) == 'number')
       {
          x = x.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
          if (x == 'Code' && y.indexOf('distinct')==0)
               t += '<tr><td  colspan=2>' + x + '</td><td colspan=7>' + textmsg[1927].split(/@/)[3] + '&nbsp;&nbsp;&nbsp;<a href=javascript:managecode()>' + textmsg[1927].split(/@/)[4] + '</a></td></tr>';
          else if (x == 'Code' && y.indexOf('attendance')==0)
               t += '<tr><td  colspan=2>' + x + '</td><td colspan=7>' + textmsg[1927].split(/@/)[1] + '&nbsp;&nbsp;&nbsp;<a href=javascript:manageattend()>' + msg1600 + '</a></td></tr>';
          else    
          t += '<tr><td  colspan=2>' + x + '</td><td colspan=7>' + y + '</td></tr>';
       }
       else 
          t += '<tr><td  colspan=2>' + x + '</td><td colspan=7>' + JSON.stringify(y) + '</td></tr>';
    }
     
    for (let i=0; i < s.NumberQuestion + 1; i++)
        r[i] += "</tr>";
    let a = ''; 
    for (let i=0; i < s.NumberQuestion + 1; i++)
        a += r[i];
    let tt = '<table style=border-collapse:collapse border=1>' + t+ a+ '</table>';
    let due = parseTime(document.form1.duestr.value);
    let start = parseTime(document.form1.startstr.value);
    let now =~~((new Date()).getTime()/1000);
    if (now > due || now < start)
    {
        tt = "<center>" + textmsg[1899] + "<input type=button class=RedButton style=width:80px value=\"" + textmsg[69]
           + "\" onclick=deleteeq(1) ></center>" + tt; 
    }
    myprompt(tt,null,null,textmsg[1897]);
}
function showfhint()
{
    let hint1 = document.getElementById('formulahint');
    if (hint1.style.display == 'none')
       hint1.style.display =  'block';
    else 
        hint1.style.display = 'none';
    let hint2 = document.getElementById('formulahint2');
    if (hint2.style.display == 'none')
        hint2.style.display =  'block';
    else 
        hint2.style.display = 'none';
}
buildactmenu = function()
{
    if (typeof(document.ff)!= 'undefined')
    recurainput(document.ff);
}
function extrformula()
{
    let v = document.form1.optionstr.value;
    let j = v.indexOf(";f:");
    if (j==-1) return "0.4*Q + 0.6*S";
    let x = v.substring(j+5).replace(/;[a-z]+:.*$/,'').length;
    return v.substring(j+5,j+5+x);
}
function saveformula(v)
{
    let qs =  textmsg[1799].split(/@/);
    try{
        eval(v.replace(/S/,'8').replace(/Q/,'10').replace(/\^/,'*'));
    }catch(e){myprompt(qs[3]); return;}
    let q = document.form1.optionstr.value;
    let j = q.indexOf(";f:");
    if (j==-1)
    {
        document.form1.optionstr.value = document.form1.optionstr.value + ";f:0|" + v;
        return;
    }
    let x = q.substring(j+5).replace(/;[a-z]+:.*$/,'').length;
    document.form1.optionstr.value = q.substring(0,j+5) + v + q.substring(j+5+x);
}

 
function showans(qn)
{
    let N = keycount(sidsolution);
    let arr = "tt".split(/\n/);
    let a = new Array();
    let b = new Array();
    for (let sid in sidsolution)
    {
        let w = (new CSVParse(sidsolution[sid],"'",",")).nextRow()[1];
        let y = w.toLowerCase().replace(/[ ]+/,' ');
        b[y] = '' + i;
        let z = a[y];
        if (z == null)
            a[y] = '1';
        else
        {
            a[y] = '' + (parseInt(z) + 1);
        }
    }
    let q = [];
    for (let key in a)
        q[q.length] = [key, a[key]];
    q.sort(function(b,a){return parseInt(a[1]) - parseInt(b[1])});
    a = new Array();
    for (let i=0; i < q.length; i++)
        a[q[i][0]] = q[i][1];
    let ss = "<table border=1 cellpadding=5 style=border-collapse:collapse ><tr style=\"background-image:linear-gradient(to bottom," + BBGCOLOR + "," + TBGCOLOR + ")\"><td align=right>#</td><td align=left>" + textmsg[139]
    +'</td><td align=right><nobr>' + textmsg[1790] + '</nobr></td><td><nobr>' + textmsg[1706].replace(/([a-z])([A-Z])/,"$1 $2") +  '</nobr></td></tr>'; 
    i = 0; let j = null, M = 0;
    for (let key in a)
    {
        let n = parseInt(a[key]);
        if (n > M){ M = n; j = key;}
        ss += '<tr bgcolor=' + TBGCOLOR + '><td align=right valign=top>' + (++i) +  " </td><td  align=left> " + arr[parseInt(b[key])] + '</td><td align=right  valign=top> ' + a[key] + '</td><td onclick=\"usethis(this)\" align=center  valign=top style=\"color:blue\"> &gt;&gt; </td></tr>';
    }
    let tbl = document.getElementById('maintbl');
    if (tbl.rows[questionnum].cells[2].innerHTML == '')
        tbl.rows[questionnum].cells[2].innerHTML = j;
    myprompt(ss + '</table>',null,null,textmsg[139]);
    LaTexHTML.reformat(promptwin);
}
function refresh()
{
    if (document.ff.proctor.value != lblmonitor)
    {   
        let ss = 'refresh()';
        bufferedaction[bufferedaction.length] = ss;
        myprompt(textmsg[242]);
        return;
    }
    let f1 = document.form1;
    postopen('embedquiz.jsp',
    'mode,orgnum,subdb,course,sessionname'.split(/,/),
    ['poll',''+orgnum,f1.subdb.value, f1.course.value,f1.sessionname.value],
        'w' + tstmp);
}
function savelocal()
{
    let f1 = document.form1;
    let key = orgnum%65536  +'-' +  f1.semester.value  +'-' +  f1.course.value  +'-' +  f1.sessionname.value;
    localStorage[key] = JSON.stringify(allmsgs);
    window.onbeforeunload = null;
}

window.onunload = function()
{
    savelocal();
    postopen("embedquiz.jsp",["mode","key"],["done",keystr],"w" + tstmp);
    if (oldonunload!=null)
    oldonunload();
    setready('');
} 
 
function loadold()
{
    document.ff.proctor.value = lblmonitor;
    let f1 = document.form1;
    let key = orgnum%65536 +'-' + f1.semester.value  +'-' +  f1.course.value  +'-' +  f1.sessionname.value;
    let oldrecords = localStorage[key];
    if (oldrecords!=null)
    {
     showresponse([null]);   
     allmsgs = JSON.parse(oldrecords);
     for (let s in allmsgs)
     {
        let m = allmsgs[s];
        showresponse(m);
     }
     }
}

function usethis(td)
{
    let tbl = document.getElementById('maintbl');
    d[questionnum][2] = tbl.rows[questionnum].cells[2].innerHTML = td.previousSibling.previousSibling.innerHTML;
    updateans(questionnum,d[questionnum][2]);
}

function syn(n,ss,em1)
{
     ss = ss.replace(/pop/g, 'frames[0].pop').replace(/es\[/g, 'frames[0].es[');
     var orderi = parseInt(window.name.replace(/[a-z]/g,''));
     if (n==null && ss==null)
     return;
     if (n=='del')
     {
         if (ss=='')
         ResizeUploaded.refreshatt();
     }
     else if (n.indexOf("web")==0)
     {
         ResizeUploaded.uploaded(n, ss, document.form1.attach);
     } 
}

function showattachment(t)
{
    var allAttachTodel = ResizeUploaded.unzip(t).replace(/@[^,]+/g,'').replace(/,$/,'').replace(/,/g,', ');
    if (allAttachTodel == '') 
        allAttachTodel = textmsg[787];
    
    var xx = document.getElementById("theattach");
    if (xx!=null  )
    {
        xx.innerHTML = "<span style=background-color:#dddddd>" + allAttachTodel + "</span>";
    }
}
function beforeclose()
{
   return "Save file";
}

function snapshot(s)
{
    var d =  document.getElementById("snap");
    if (d!=null)
        d.innerHTML = s;
}
function goupload()
{
    formnewaction(document.ff);
    visual(document.ff);
    document.ff.submit();
}

function onbegin()
{
    if (isNaN(document.form1.startstr.value) == false)
    {
    document.form1.startstr.value = timestr(document.form1.startstr.value,timeformat);
    document.form1.duestr.value = timestr(document.form1.duestr.value,timeformat);
    }
    showattachment(attachedstr);
    ResizeUploaded.attachref = document.form1.attach;
    resizebut(document.form1); 
    if (navigator.appName.indexOf("Internet Explorer") < 0)
    {
        var xx = document.getElementById("browserhold");
        if (xx!=null)
        {
            xx.style.float = "left";
        }
    }
    window.onresize = placeit;
    for (let i=0; i < d.length; i++)
    {
        states[i] = new Array(3);
    }
    copyd();
    calculsum();
    for (let i = 0; i < 20; i++)
    {
        fontSizeSel.options[i] = new Option((20+i*2)+"px", "" + (20+i*2) );
        if ( Math.abs(20+i*2 - assopfs)< 2)
            fontSizeSel.options[i].selected = true;
    }
    if (initalshow)
    {
        setstates(1);
        for (let i=0; i < 3; i++)
            headerstates[i] = 1;
        for (let k=1; k < d.length; k++)
        {
            maintbl.rows[k].cells[1].innerHTML = addbreak(combine(d[k][1]));
            maintbl.rows[k].cells[2].innerHTML = addbreak(combine(d[k][2]));
        }
    }
    else
    {
        ongoing();
        setstates(0);
        for (let i=0; i < 3; i++)
            headerstates[i] = 0;
    }
    if (infuture > 0)
    {
        timerhande0 = setTimeout(ongoing, infuture *1000 );
    }
    numbertests();

    copypaste();
    let helpcount = 0;
    let helpparse = new CSVParse(buttonhints, "|", ":", "\n");
    let linep;
    while ( (linep = helpparse.nextRow()) != null)
    {
        if (linep.length != 2) break;
        hints[helpcount] = linep[1];
        caps[linep[0]] = helpcount;
        helpcount++;
    }
    changefont();
    tense();
    if (window!=parent)
    {
       parent.frames[0].minimizeit();
       window.parent.document.title= textmsg[1291];
    }
    loadold();
}
demotasks = [
    [ 'democursory = 200; closeprompt();tblele = document.getElementById("writetable");democursor2(tblele.rows[0].cells[0],2)', 0],
    ['democursor2(tblele.rows[0].cells[2],2)',500],
    ['closeprompt();democursor2(tblele.rows[0].cells[4],2)',2000],
    ['democursor2(tblele.rows[0].cells[6],2)', 2000],
    ['democursor2(tblele.rows[1].cells[6],2)', 2000],
    ['democursor2(tblele.rows[1].cells[7],2)', 2000],
    ['demoheight(0.7);showattpic()',2000],
    ['demoheight(1);let xy=findPositionnoScrolling(promptwin);democursor2(xy[0]+10,xy[1]+10);democursorsim.style.zIndex=\'500\'',500],
    ['demoheight(0.7);closeprompt()',4000],
    ['demoheight(1);democursor2(tblele.rows[1].cells[4],2)',500],
    ['democursor2(tblele.rows[1].cells[2],5)',3000],
    ['democursor2(tblele.rows[1].cells[1],10)',2000],
    ['myHintx=90;myHinty=100;showmyhintstr(textmsg[361]+" " +textmsg[1505],1)',1000],
    ['closeprompt();tblele = getImageByName("image5").parentNode.parentNode.parentNode;democursor2(tblele.rows[0].cells[0])', 1000],
    ['hidemyhint();tblele.rows[0].cells[0].style.backgroundColor = "#0000aa";tblele.rows[0].cells[0].style.color = "white";myHintx=80;myHinty=100;showmyhintstr(labels[2],1)',1000],
    ['tblele.rows[0].cells[0].style.backgroundColor = "inherit";tblele.rows[0].cells[0].style.color = "black"',2500],
    ['democursor2(getImageByName("image5"),2);showmyhintstr(hintxs[4],1)',1000],
    ['demoheight(0.7);showswitch()',4000],
    [ 'demoheight()',500],
    ['demoheight(0.7);showswitch()',2000],
    [ 'demoheight(1)',500],
    ['democursor2(tblele.rows[2].cells[0],3)',2000],
    ['hidemyhint();myHintx=80;myHinty=200;showmyhintstr(hintxs[0],1)',2000],
    ['democursor2(tblele.rows[3].cells[0],3)',3000],
    ['hidemyhint();myHintx=80;myHinty=240;showmyhintstr(hintxs[1],1)',800],
    ['democursor2(tblele.rows[4].cells[0],3)',3000],
    ['hidemyhint();myHintx=80;myHinty=280;showmyhintstr(hintxs[2],1)',800],
    ['democursor2(tblele.rows[5].cells[0],3)',3000],
    ['hidemyhint();myHintx=80;myHinty=320;showmyhintstr(hintxs[3],1)',1000],
    ['democursor2(document.getElementById("comments0"),10)',3000],
    ['hidemyhint();window.scrollTo(0,200);demoheight(0.7);document.getElementById("comments0").click()',3000],
    ['demoheight();tblele=document.form1.txt0.parentNode.nextSibling.getElementsByTagName("table")[0];democursor2(tblele.rows[0].cells[0],2)',500],
    ['demoheight(0.7);testsheet.copysubmittedtext(0)',2000], 
    ["demoheight(1);democursor2(document.getElementById('enlargebut'),4)",500], 
    ["demoheight(0.7);document.getElementById('enlargebut').click();document.form1.txt0.value=hintxs[5]",5000],
    ["demoheight(1)",500],
    ["demoheight(0.7);onlinetoolmini()",4000],
    ["demoheight(1);democursor2(document.form1.txt0,10)",500],
    ["demoheight(0.7);document.form1.txt0.value=hintxs[6]",2000],
    ["document.form1.txt0.value=hintxs[6] + ':$y=x^2$'",100],
    ['democursor2(tblele.rows[2].cells[0],2)',1000],
    ['democursor2(tblele.rows[1].cells[0],2)',4000],
    ['demoheight(0.7);',3000],
    ['demoheight(1);testsheet.passto(0)',500],
    ['democursor2(document.form1.scorebox0,2)',2000],
    ['demoheight(0.7)',3000],
    ['demoheight(1);document.form1.scorebox0.value = "1";testsheet.updateatd(document.form1.scorebox0,0,3)',500],
    ['window.scrollTo(0,document.body.scrollHeight);democursorx=500;democursory=document.body.scrollHeight-500;democursor2(document.form1.dropn,2)',3000],
    ['democursor2(document.form1.formula,2)',4000],
    ['demoheight(0.7);document.form1.formula.value="S"',3000],
    ['demoheight(1)',500],
    ['democursor2(document.form1.docalc,2)',2000],
    ['demoheight(0.7)',2000],
    ['demoheight(1)',500],
    ['window.scrollTo(0,100)',1000],
    ['democursorx=500;democursory=500;democursor2(getImageByName("image5").parentNode.parentNode.parentNode.rows[3].cells[0],1.5)', 1000],
    ['democursorx=500;democursory=500;democursor2(document.getElementById("savebut"),2)',4000],
    ['demoheight(0.7)',2000],
    ['demoheight(1)',500],
    ['demoremovesim();parent.frames[0].demokeyframen=0;parent.frames[0].type1()',3000]
    
];

var onloadbeforeemb = null;
if (typeof window.onload == 'function') 
    onloadbeforeemb = window.onload;
window.onload = function()
{
    onbegin();
    if (onloadbeforeemb!=null) 
    onloadbeforeemb();
    
    if (parent==window)
    {
        document.ff.copyd.style.visibility = 'hidden';
    }
}
function placedown(sp)
{
   if (sp.innerHTML.charCodeAt(0) == 8595)
   {
       let toolarea = document.getElementById('toolarea');
       toolarea.appendChild(document.ff);
       let tbl = document.getElementById('foottbl');
       if( sp == tbl.rows[0].cells[tbl.rows[0].cells.length-2]) 
          tbl.rows[0].deleteCell(tbl.rows[0].cells.length-1);
       for (let i=tbl.rows[0].cells.length-1; i>0; i--)
       {
           let tr = tbl.insertRow(1);
           tr.appendChild(tbl.rows[0].cells[i])
       }
       document.ff.style.marginTop = "30px";
       sp.innerHTML = '&uarr;';
   }
   else
   {
       document.ff.style.marginTop = "3px";
       let toolarea = document.getElementById('toolarea');
       let tbl = toolarea.parentNode.parentNode;
       if (tbl.tagName.toLowerCase()!='table') tbl = tbl.parentNode;
       //document.body.append(document.ff);
       document.body.insertBefore(document.ff, tbl);
       tbl = document.getElementById('foottbl');
       
       tbl.style.position = 'static';
       for (let i=tbl.rows.length-1; i > 0; i--)
       {
           tbl.rows[0].appendChild(tbl.rows[1].cells[0]);
           tbl.deleteRow(1);
       }
       sp.innerHTML = '&darr;';
       
        let td = tbl.rows[0].insertCell(-1);
        td.innerHTML = '&rarr;';
        td.style.color = 'blue';
        td.onclick = removetoolbar;
   }
}

function showtootbar()
{
   let cont = document.getElementById('foottbl');
   cont.style.display = 'block';
   let p = allainputeles.lastIndexOf("<tr>");
   allainputeles = allainputeles.substring(0,p);
    
}
function removetoolbar()
{
    let cont = document.getElementById('foottbl');
    cont.style.display = 'none';
    allainputeles += "<tr><td class=BlackButton style=\"background-image:linear-gradient(var(--ibgcolor),var(--hibgcolor));color:white;font-family:" + defaultfontfamily + "\" onclick=\"showtootbar()\"><nobr>" + textmsg[1889] +"</nobr></td></tr>";
}

function loadScript(src) {
    let script = document.createElement('script');
    script.src = src;
    document.body.append(script);
}
if (d[1][1] == '') fromcache();
loadScript('assigncontrol.js');


    


