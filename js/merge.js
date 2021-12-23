function $(x)
{
   return document.getElementById(x);
}
 
let b=0, g=0;
let bl = [0,0,0];
let maintbl = null;
let source0 = new Array();
let mergebtn, matchbtn, swapbtn, headingset;
let courselistobj = [];
onload = function()
{
    maintbl =   document.getElementsByTagName('table')[1];
    source0[0]  = $('bbsource').value;
    source0[1] = $('googlesource').value;
    mergebtn = $('merge');
    matchbtn = $('match'); 
    swapbtn =  $("swapbt");
    headingset =  $("heading");
    matchbtn.style.display = 'none';
    mergebtn.style.display = 'none';
    swapbtn.style.display = 'none';
    headingset.style.display = 'none';
    let course = localStorage["course"];
    let courseliststr = localStorage["courselist"];
     
    var regl = $("reglist");
    var regarrstr = localStorage["reglist"];
    if (regarrstr!=null)
    {
       var regarr = JSON.parse(regarrstr);
       for (let l = 0;l < regarr.length && l < 25; l++)
        {
            let option = document.createElement('option');
            option.value = regarr[l][0];
           regl.appendChild(option);
        }
    }
    if (courseliststr!=null)
    {
        courselistobj = JSON.parse(courseliststr);
        let dl = $('courselist');
        for (let l = 0;l < courselistobj.length; l++)
        {
            let option = document.createElement('option');
            option.value = courselistobj[l];
            dl.appendChild(option);
        }
    }
    let dl = $('course');
    if (course != null)
    {
        dl.value = course;
        loadcoursesource(course);
    }
   
}

function buildcourselist(t)
{
    let c = t.value;
    if (c == '') return;
    let dl = $('courselist');
    let l=0;
    for (l = 0;l < dl.options.length; l++)
    {
        if (dl.options[l].value == c) break;
    }
    if (l == dl.options.length)
    {
        let option = document.createElement('option');
        option.value = c;
        dl.appendChild(option);
        courselistobj[courselistobj.length] = c;
        localStorage["courselist"] = JSON.stringify(courselistobj);  
    }
    loadcoursesource(c);
}
function changedsource(t)
{
    var v = t.value;
    var alls = localStorage['reglist'];
    if (alls!=null)
    {
        var x = JSON.parse(alls);
        for (var i=0; i < x.length; i++)
            if (v == x[i][0])
        {
            $('targetchar').value = x[i][1];
            $('regex').checked = x[i][2];
        }
    }
}
function loadcoursesource(course)
{
    for(let cl=0; cl < 3; cl+=2)
    {
        let s0 = localStorage["source_"+course+ "_" + cl];
        if (s0==null || s0=='null' || s0.length < 10) s0 = source0[cl/2];
        maintbl.rows[1].cells[cl].getElementsByTagName('textarea')[0].value = s0;
            
    }
}
let maxcol = 0;
function parse(cl)
{
    if (cl==2)
    {
        let b1 = $('view');
        if (b1.value == 'Back') view(b1);
        maxcol = 0;
    }
     
    let delimiter = ',';
    if (cl==2)
    {
        let sel = $('delimiter');
        delimiter = sel.options[sel.selectedIndex].value;
    }
    
    let source = maintbl.rows[1].cells[cl].childNodes[0].value;
    localStorage["source_"+ $('course').value + "_" +  cl] = source;
    if (delimiter == '  ')
    {    
       source = source.replace(/[ ][ ]+/g,'\t');
       delimiter = "\t";
    }
    else if (delimiter == ' ')
    {
       source = source.replace(/[ ]+/g,' '); 
        delimiter = " ";
    }
        
    let m = (new CSVParse(source,'"',delimiter,'\n')).nextMatrix();
    let s = '<table border=1 id=tbl' + cl + ' bgcolor=#f9f9f9 style=border-collapse:collpase>';
    if (m.length <2) return;
    let l = 0; while (  l < m[1].length && 
            (m[1][l]==null || m[1][l].replace(/ /,'')=='' || ''+ parseFloat(m[1][l].replace(/ /,'')) == 'NaN')) l++;
    bl[cl] = l;
    
    for (let i=0; i <m.length; i++)
    {
        if (m[i].length < 2) 
        {
            m.splice(i, 1);
            i--;
            continue;
        }
        if (cl == 2 && maxcol < m[i].length)
        {
            maxcol = m[i].length;
        }
        s += '<tr height=28 bgcolor=' + (i==0?'lightgray':'white') + '>';
        for (let j=0; j <  m[i].length ; j++)
        {
            s += '<td align=' + (j<l?'left':'right width=85 ') + '><div style="' + (j<l?"":"width:80px;overflow:hidden") + '" ' + (cl>0||i>0?'':' onmouseover=showfull(this) onmouseexit=showless(this) ') + '><nobr>' + m[i][j] + '</nobr></div></td>';
        }
        s += '</tr>'
    }
      
    let t = maintbl.rows[3].cells[cl];
    if (cl == 0) b = m;else g = m;
    t.innerHTML = s + '</table>';
    
    if ($('tbl0')!=null
        && $('tbl2')!=null)
    matchbtn.style.display = 'inline';
    if ($('tbl0')!=null)
        swapbtn.style.display = 'inline';
}
let pairb = -1, pairg = -1;
let clickedcellb = null, clickedcellg = null;
function findPositionnoScrolling(oElement, win)
{        
    if (win == null)
        win = self;
    if (oElement == null)
        return [0, 0];
    if (typeof (oElement.offsetParent) != 'undefined')
    {
        var ii = 0;
        var originalElement = oElement;
        for (var posY = 0, posX = 0; ii++ < 20 && oElement != null; oElement = oElement.offsetParent)
        {
            posY += oElement.offsetTop;
            posX += oElement.offsetLeft;
            if (oElement != originalElement && oElement != win.document.body && oElement != win.document.documentElement)
            {
                posY -= oElement.scrollTop;
                posX -= oElement.scrollLeft;
            }
        }
        return  [posX, posY];
    }
    else
    {
        return  [oElement.x, oElement.y];
    }
}
function showfull(dv)
{
   if ($('popdv') != null) showless(); 
   var xy = findPositionnoScrolling(dv);
   var hint = document.createElement('span');
   hint.style.cssText = 'box-shadow:1px 1px gray;height:28px;z-index:10;position:absolute;left:' + (xy[0]-10) + 'px;top:'
   + (xy[1]-4) + 'px;background:lightyellow;font-weight:700;color:purple';
   hint.innerHTML = dv.innerHTML;
   hint.id = 'popdv';
   document.body.appendChild(hint);
   setTimeout("showless()", 2000);
}
 
function showless()
{
   if ($('popdv') != null) 
   document.body.removeChild($('popdv'));
}
function copy(f, t)
{
    let temp = g[f];
    g[f] = g[t];
    g[t] = temp;
    let tbl = $('tbl2'); 
    let l;
    for (l=0; l < tbl.rows[t].cells.length; l++)
    {     
        tbl.rows[t].cells[l].innerHTML = g[t][l]==null?"":g[t][l];
    }
    for (l=0; l < tbl.rows[f].cells.length; l++)
         tbl.rows[f].cells[l].innerHTML = '&nbsp;';    
}
let rowb, rowg;
function pair(td,m,r0)
{
   if (pairg >= 0)
   {
      copy(pairg,m);
      let tr = td.parentNode;
      tr.parentNode.removeChild(tr);
      tr = clickedcellg.parentNode;
      tr.parentNode.removeChild(tr);
      clickedcellb = clickedcellg = null;
      pairb = -1;
      pairg = -1;
   }
   else
   {
      pairb = m; 
      clickedcellb = td;
   }
}
function pair1(td,m)
{
   if (pairb >= 0)
   {
      copy(m,pairb);
      let tr = td.parentNode;
      tr.parentNode.removeChild(tr);
      tr = clickedcellb.parentNode;
      tr.parentNode.removeChild(tr);
      clickedcellg = clickedcellb = null;
      pairb = -1;
      pairg = -1;
   }
   else
   {
      pairg = m;
      clickedcellg = td;
   }
}
function stat(arr,k)
{
    let brr = new Array();
    for (let j=0; j < arr.length; j++)
    {
       let f = parseFloat(arr[j]);
       if ('' + f != 'NaN')
           brr[brr.length] = f;
    }
    if (brr.length == 0) return 0;
    brr.sort((a, b) => a - b);
    if (k==0) return brr[0];
    else if (k==2) 
        return brr[brr.length-1];
    let s = 0;
    for (let j=0; j < brr.length; j++)
        s += brr[j];
    return (s/brr.length).toFixed(2);
}
let duplicate = [];
let oldg = [];

function dup(k)
{
    let bi = bl[0], gi = bl[2];
    let tbl = $('tbl2');
    for (let y in duplicate)
    {
        //alert('y=' + y + ',l=' +  g[y].length);
        if (oldg[y]==null) 
            oldg[y] = new Array(maxcol);
        let s = duplicate[y];
        if (k==3)
        {
           for (let j=gi;  j < maxcol; j++)
           {
              if (oldg[y][j]!=null)
              g[y][j] = oldg[y][j];
              tbl.rows[y].cells[j].innerHTML = g[y][j];
           }
        }
        else if (k==4)
        {
           let ll = s[s.length-1];
           for (let j=gi; j < maxcol; j++)
           {
              if (oldg[y][j]==null)
                  oldg[y][j] = g[y][j];
              if (oldg[ll]!=null && oldg[ll][j]!=null)  
                  g[y][j] = oldg[ll][j];
              else
                  g[y][j] = g[ll][j];
              
              tbl.rows[y].cells[j].innerHTML = g[y][j];
           }
        }
        else
        for (let j=gi; j < maxcol; j++)
        {
           
           let arr = new Array();
           let xx = oldg[y][j]==null?g[y][j]:oldg[y][j];
           if (xx!=null) arr[0] = xx;
           for (let z=0; z < s.length; z++)
           {
               let ll = parseInt(s[z]);
               let xx = (oldg[ll]==null || oldg[ll][j]==null)?g[ll][j]:oldg[ll][j];
               if (xx!=null) arr[arr.length] = xx;
           }
           let q = stat(arr,k);
           
           if (oldg[y][j]==null)
               oldg[y][j] = g[y][j];
           g[y][j] = q;
           if (y >= tbl.rows.length)
               alert('tbl2.rows[' +y + '] not exist');        
           else if(j < tbl.rows[y].cells.length)
                tbl.rows[y].cells[j].innerHTML = q;
           else 
               alert('tbl2.rows[' +y + '].cells[' + j + '] not exist');
        }
    }
}
function copyc(i, mark)
{
   let v= new Array();
   for (let j=0; j < g[i].length; j++)
   {
       v[j] = g[i][j];
   }
   v[v.length] = mark;
   return v;
}
var matchstrength = 1;// email, two name, 1 name
function redomatch(sel)
{
    matchstrength = sel.options[sel.selectedIndex].value;
    closethis();
    parse(2);
    match();
}
function match()
{
    duplicate = [];
    oldg = [];
    mid = 0;
    pairb =  pairg = -1;
    clickedcellb = clickedcellg = null;
    if (b == null || g == null || b.length <2 || g.length<2)
    {
        alert('Enter source and Parse first');
        return;
    }
    
    let bi = bl[0], gi = bl[2];
     
    let newg = new Array(b.length); 
    for (let m=0; m < b.length; m++)
        for (let j=0; j < b[m].length; j++)
           if (b[m][j]==null) b[m][j] ='';
           else b[m][j] = b[m][j].replace(/^[ ]+/,'').replace(/[ ]+$/,'');
     let mism = new Array();
    let maxm = 0;
    let mts = '';
    let dup = new Array();
    for (let i=0; i < g.length; i++)
    {
        if (g[i] == null) continue;
        for (let j=0; j < g[i].length; j++)
            if (g[i][j] == null)
                g[i][j] = "";
            else g[i][j] = g[i][j].replace(/^[ ]+/,'').replace(/[ ]+$/,''); 
        let m;
        let arr = new Array();
        for (m=0; m < b.length; m++)
        {
             let count = 0; 
             let isemail = false;
             for (let j=0; j < bi; j++)
             {
                for (let k=0; k < gi; k++)
                {
                   if (b[m][j].toLowerCase() == g[i][k].toLowerCase())
                   {    
                       count++;
                       if (b[m][j].indexOf("@")>0 && b[m][j].indexOf(".")>0)
                           isemail = true;
                   }
                }
             }
             if (isemail)
             {
                 arr[m] = 1000000 + m;
             }
             else
                 arr[m] = count*1000 + m;
         }
         arr.sort((a, b) => a - b);
         //document.writeln("i=" +i + ", m=" + arr[m-1] + ", count=" + (arr[m-1]%1000) + "<br>");
             
         let ss = '';
         //for (let ll=0; ll < arr.length; ll++) ss +=    arr[ll] + "\n"
         
         //maintbl.rows[6].cells[0].getElementsByTagName('textarea')[0].value  += '\n' + arr[arr.length-1];
         m = arr[arr.length-1];
         //document.writeln("i=" +i + ", m=" + m + ", m%1000=" + m%1000 + "<br>");
         if (m < matchstrength*1000)
         {
             mism[mism.length] = i;
         }
         else
         {
             m = m%1000;
             mts += "," + i + "<->" + m;
             if (maxm < g[i].length) 
                 maxm = g[i].length;
             if (dup[m]==null)
                 dup[m] = [i];
             else
                 dup[m][dup[m].length] = i;
             
         }
    }
    if (dup[0]== null)
    {
        let j=0;
        for (j=0; j < g[0].length; j++)
        {
           let f = parseFloat(g[0][j]);
           if (''+f != 'NaN') break;
        }
        //let cm = confirm("Does the 3rd-party grade book has a heading?");
        if (j == g[0].length) 
        {
           dup[0] = [0];
        }
    }
    let m = 0;
    let mn = 1;
    let msg =  "<" + "li>";
    msg += "Some mismatches were found. If a manual match is found, just click the matched pair.";
    msg += "<" + "table bgcoloe=white border=1 style=border-collapse:collapse  cellspacing=3><tr><td valign=top><div  style=background-color:blue;color:white>Left Records without Matching</div>";
    msg += "<" + "table>";
    let  missleft = false;
    let rw0=0, rw1=0;
    for (m=0; m < b.length; m++)
    {
        if (dup[m] == null)
        {
            //newg[m] = new Array(g[0].length);
            missleft = true;
            if (m>0){
            msg +='<tr height=28>';
            for (let l=0; l < bi; l++)
            {
               msg += '<td bgcolor=white onclick="pair(this,' + m + ',' + (rw0++) +  ')">' + b[m][l] + '</td>';
            }
            msg += '<' + '/tr>'
           }
        }
        else
        {
            let i = dup[m][0];
            newg[m] = copyc(i);
            dup[m].splice(0,1);
        }
    }
    msg += '<' + '/table><'+ '/td><td valign=top><div style=background-color:red>Right Records without Matching</div><table>'
    let  missright = mism.length>0;
     
    for (let j=0; j < mism.length; j++)
    {
        let i = mism[j];
        newg[newg.length] = copyc(i, 'missed');
        msg +='<tr height=28>';
        for (let l=0; l < gi; l++)
        {
             msg += '<td bgcolor=white onclick="pair1(this,' + (newg.length-1) + ',' + (rw1++) +   ')">' + g[i][l] + '</td>';
        }
        msg += '</tr>'
    }
    msg += "</table></td></tr></table><br>";
    if (!missright && !missleft)  msg = '';
    let hasd = false;
    let dcount = 0;
    for (m=0; m < b.length; m++)
    {
        if (dup[m] == null || dup[m].length == 0)
        {
            continue;
        }
        hasd = true;
        let x = new Array();
        for(let j=0; j < dup[m].length; j++)
        {
            let i = dup[m][j];
            newg[newg.length] = copyc(i,'duplicate' + m);
            dcount++;
            x[x.length] = newg.length-1;
        }
        duplicate[m] = x;
    }
    if (hasd)
        msg += '<li>What do you want to do with the <span style=background-color:orange;color:black>' + dcount + ' duplicates</span>?<br><input name=dup value=l  type=radio  onclick=dup(0)>Take the lowest<input name=dup value=h type=radio onclick=dup(2)>Take the highest<input name=dup value=a  type=radio  onclick=dup(1)>Take the average  <input name=dup value=h type=radio onclick=dup(3) checked > Take the first  <input name=dup value=h type=radio onclick=dup(4)> Take the last<br>';
    msg += '<br><li>Next, you need to decide which column on the right is going to merge to which column on the left. Please note that the red boxes on heading area are editable: typing or keeping as is, selecting, or clearing, correspoding to merging as a new column in the gradebook, overriding an existing column, or discarding that data column, respectively. The Null Heading button clears all headings'; 
    
    if (msg!='')
    {
        msg += "<br><br><li>The curved box allows you to enter a fomula to convert raw score x to blackboard score as full-point scale you declared on Blackboard may be different from that in the other systems. Using + for plus, - for minus as usual, but * from multiplication, and / for division, e.g, x/10 means the raw score will be converted to one tenth of the score to Blackboard"
        let dv = document.createElement('div');
        dv.style.cssText = 'padding:4px;position: absolute;top:200px;left: 50%;-webkit-transform: translate(-50%, 0);transform: translate(-50%, 0);z-index:20;background-color:#f0f0f0;border:1px gray outset;border-radius:4px';
        dv.innerHTML = '<center><a href=javascript:closethis()>[close]</a><br><br>Match strength:<select name=sel onchange=redomatch(this)><option value=1 " + (matchstrength==1?"selected":"") + ">At least one name part</option><option value=2 " + (matchstrength==2?"selected":"") + ">At least two name parts</option><option value=3 " + (matchstrength==3?"selected":"") + ">require email matching</option></select></center><ul>' +msg   + "</ul><center><a href=javascript:closethis()>[close]</a></center>";
        dv.id = 'pop';
        document.body.appendChild(dv);
    }
     
    g = newg;
    
    let s = makelist(b[0],bi) + '<table border=1 id=tbl2 bgcolor=#f9f9f9 style=border-collapse:collpase><tr height=28 bgcolor=lightgray>';
    if (g[0] == null)
    {
        g[0] = new Array(maxm);
    }
    for (let j=0; j < gi; j++)
    {
        s += '<td align=left><nobr>' + (g[0][j]==null?"":g[0][j]) + '</nobr></td>';
    }
    for (let j=gi; j < maxm; j++)
    {
        s += '<td align=right style="padding:0px 0px 0px 0px"><input style="margin:-1px -1px -1px -1px;border:0px;color:red;border:1px red solid" id="field' + j + '" list="existing" value="' + (g[0][j]==null?(""):g[0][j])+ '"</td>';
    }
    s += "</tr>";
    for (let i=1; i <g.length; i++)
    {
        let bgcolor = 'lightgray';
        let mark = null;
        if (i >0 &&  i < b.length) 
        {
            if (g[i] == null) 
                bgcolor = 'blue'
            else
                bgcolor = 'white';
        }
        else if (g[i].length>=maxcol && g[i][maxcol].indexOf('duplicate') == 0)
        {
            bgcolor = 'orange';
            let kk = parseInt(g[i][maxcol].substring(9));
            mark = b[kk][0];
            for (let k1 = 1; k1 < bi; k1++)
                mark += " " + b[kk][k1];
        } 
        else if (g[i].length>=maxcol && g[i][maxcol].indexOf('miss') == 0)
        {   
            bgcolor = 'red'; 
            
        }
        s += '<tr height=28 bgcolor=' +  bgcolor + '>';
        if (g[i] == null)
        {  
             g[i] = new Array(maxcol);
             for (let j=0; j < maxcol; j++)
            {
               g[i][j] = '';
               s += '<td ' + (j==0?'onclick=accept(' + i + ',this.parentNode)':'') + ' align=' + (j<gi?'left':'right   width=85  ') + '>&nbsp;&nbsp;</td>';
            }
            //s += '<td colspan=' + maxm +'>&nbsp&nbsp;</td>';
        }
        else 
        for (let j=0; j < maxcol; j++)
        {
            if (g[i][j]==null)
                g[i][j] = '';
            s += '<td ';
            if (j ==0 && mark!=null)
                s += ' onmouseover="showdup(\'' + mark + '\','+ i +')" onmouseexit=cleardup('+ i +') ';
            s +=   (j==0 && i>=b.length ?'onclick=moveto('+i+',this.parentNode)':'') + ' align=' + (j<gi?'left':'right   width=85  ') + '><div style="' + (j<bi?"":"width:80px;overflow:hidden") + '"><nobr>' + (g[i][j]==null?"":g[i][j]) + '</nobr></div></td>';
        }
        s += '</tr>';
    }
    maintbl.rows[3].cells[2].innerHTML = s + '</table>';
    matchbtn.style.display = 'none'; 
    mergebtn.style.display = 'inline';
    headingset.style.display = 'inline';
    //$('merge').enabled = true;
    //$('discard').enabled = true;
    
}
function showdup(mark, i)
{
    var tbl0 = $('tbl0');
    let N = tbl0.rows.length;
    for(var k=N; k <= i; k++)
    {
        tbl0.insertRow(-1);
        tbl0.rows[k].outerHTML = '<tr height=28><td colspan=' + b[0].length + ' align=right>&nbsp;</td></tr>';
       /* tbl0.rows[k].cells[0].colSpan = b[0].length;
        tbl0.rows[k].cells[0].align = 'right';
        tbl0.rows[k].cells[0].innerHTML = '&nbsp;'
        tbl0.rows[k].height = '28';*/
    }
    for(var k=N; k <= i; k++)
        tbl0.rows[k].height = '28';
    tbl0.rows[i].cells[0].innerHTML = mark;
   
}
function cleardup(i)
{
    
}
function closethis()
{
   let dv = $('pop');
   document.body.removeChild(dv);
}
let mid = 0;
function moveto(i,tr)
{
    tr.bgColor = '#ffff22';
    mid = i;
}
function accept(i,tr)
{
    if (confirm('Move that line to fill out this blank line because of match?')  )
    {    
        g[i] = new Array();
    for (let j=0; j < g[0].length; j++)
    {   
        if (j==0 && tr.cells[j].innerHTML.replace(/&nbsp;/g,'') != '') return;
        tr.cells[j].innerHTML = tr.parentNode.rows[mid].cells[j].innerHTML;
        tr.parentNode.rows[mid].cells[j].innerHTML = '&nbsp;&nbsp;';
        
        g[i][j] = g[mid][j];
        g[mid][j] = '';
    }
    tr.bgColor = '#fafafa';
    }
}
function makelist(b,l)
{
    let s = "<datalist id=\"existing\">\n<option></option>\n"
    for (;l < b.length; l++)
    {
        s += "<option>" + b[l] + "</option>\n"
    }
    return s + "</datalist>";
}

let merged = null;
function merge()
{
    let bi = bl[0], gi = bl[2];
    let fail = false;
    let allf = ',';
    for (let j=gi; j < maxcol; j++)
    {
        let field = $('field' + j);
        if (field==null) 
        {
            //alert('field' + j + " is null");
            continue;
        }
        let x=field.value.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
        if (x!='' && allf.indexOf(',' + x+ ',')>=0)
        {
            alert('Repeated');
            field.focus(); fail =true;
        }
        else
        {
            g[0][j] = field;
            allf += field + ',';
        }
    }
    if ( fail) return;
    merged = new Array();
    let ms = new Array();
    for (let i=0; i < b.length; i++)
    {
            merged[i] = new Array(b[i].length)
            for (let l=0; l < merged[i].length; l++)
                merged[i][l] = b[i][l];
    }
    let num = 0;
    let curve = $('curve').value;
    for (let j=gi; j < maxcol; j++)
    {
        
        let field = $('field' + j);
        if (field == null) 
            continue;
        let x = field.value.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
            if (x == '') 
              continue;
        g[0][j] = x;
        let m = bi;
        for (; m < merged[0].length; m++)
        {
            if (merged[0][m] == x)
                break;
             
        }
         
        num++;
         
        ms[ms.length] = m;
        
        for (let i=0; i < b.length; i++)
        {
            if (g[i] == null || g[i][j] == null) 
               merged[i][m] = "";
            else
            {
               let f = parseFloat(g[i][j]);
               if ('' + f == 'NaN')
                   merged[i][m] = g[i][j];
               else
               {
                   try
                   {
                   var se = curve.replace(/x/g,g[i][j]);
                   var sc = eval(se);
                   merged[i][m] = '' + sc.toFixed(2);
                   }catch(e){alert(se + " seems not a good expression. extra%?");}
               }
           }
        }
        
    }
    if (num == 0) 
    {
        alert('No merge is done since all fields are blank');
        return;
    }
    let s = '<table border=1 id=tbl3 bgcolor=#f9f9f9 style=border-collapse:collpase>';
     
    for (let i=0; i < b.length; i++)
    {
        s += '<tr bgcolor=' + (i==0?'lightgray':'white') + '>';
        for (let j=0; j < merged[i].length; j++)
        {
            s += '<td ' + (ms.indexOf(j)>=0&&i>0?' bgcolor=#f0f090 ':'') + ' align=' + (j<bi?'left':'right  width=85 ') + '><div style="' + (j<gi?"":"width:80px;overflow:hidden") + '"><nobr>' + merged[i][j] + '</nobr></div></td>';
        }
        s += '</tr>';
    }
    maintbl.rows[4].cells[0].innerHTML = s + '</table><input class=button id="swapb1" type="button"  style=float:left;width:100px  value="Swap Column"   onclick="swap(1)"><input class=button  type="button" style=float:left id="csv0" value="CSV" onclick="csv()"><input class=button  type="button" style=float:center id="csv" value="CSV" onclick="csv()">'; 
    //$('merge').enabled = false;
    //$('discard').enabled = false;
}
function nullall()
{
    for (let i=bl[2]; i < maxcol; i++)
    {   
        let field = $('field' + i);
        if (field != null)
        field.value = '';
    } 
}
 

function csv()
{
    let s = '';
    for (let i=0; i < b.length; i++)
    {
        if (i>0) s += '\n';
        for (let j=0; j < merged[i].length; j++)
        {    
            if (j>0) s += ',';
            s += '"' + merged[i][j].replace(/"/g,"") + '"';
             
        }
    }
    
    let td = maintbl.rows[5].cells[0];
    td.innerHTML = '<textarea style="width:100%" id="result" rows="' + (b.length+1) + '">' + s + '</textarea>'  
     + '<center><a id="da" download="' + course.value + '.csv" type="text/csv"><span class=button style="display:inline;width:70px;padding:2px 2px 2px 2px !important">Download</span></a> &nbsp; <a href="javascript:toclip()"><span class=button  style="display:inline;width:70px;padding:2px 2px 2px 2px !important">&nbsp;&nbsp;&nbsp;&nbsp;Copy&nbsp;&nbsp;&nbsp;</span></a></center>';
    var data = new Blob([s]);
    var a = document.getElementById('da');
    a.href = URL.createObjectURL(data);
}
function download()
{

}
function toclip() {
  var copyText = document.getElementById("result");
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */
  document.execCommand("copy");
  alert("Text has been copied to clipboard. Now you start a window's text editor or notepad and invoke the Paste inside the editor");
}
function swap(row)
{
    let s = prompt("What number of column is your final score column? It's better to swap it with the email (3rd) column. Enter a pair of columns:", "3 10");
    if (s == null) return;
    let ss = s.replace(/^[ ]+/,'').replace(/[ ]+$/,'').replace(/[ ][ ]+/,' ').split(/[ |,]/);
    if (ss.length!=2) return;
    let c1 = parseInt(ss[0]);
    let c2 = parseInt(ss[1]);
    if (''+c1 == 'NaN' || ''+c2 == 'NaN')return;
    c1--;c2--;
    let tbl = $('tbl' + (3*row));
    for (let j=0; j < b.length; j++)
    {
        let t = tbl.rows[j].cells[c1].innerHTML;//b[j][c1];
        tbl.rows[j].cells[c1].innerHTML = tbl.rows[j].cells[c2].innerHTML;
        tbl.rows[j].cells[c2].innerHTML = t;
    }
    
}
let temp;
function view(btn)
{
   let t = $('googlesource');
   if (btn.value == 'View Tab')
   {
      temp = t.value;
      btn.value  = 'Back';
      t.value = t.value.replace(/\t/g,'\\t   ').replace(/\n/g,'\\n\n').replace(/\r/g,'\\r');
   }
   else
   {
       t.value = temp;
       btn.value = 'View Tab';
   }
}
let oldt = new Array();
let allregs = [];
function replace()
{
   let t = $('googlesource');
   let b = $('view');
   let undo = $('undo');
   if (b.value == 'Back') view(b);
   let s =  $('sourcechar');
   let c =  $('targetchar');
   let a = $('regex');
   var rs = localStorage['reglist']; // search a piece of data named relist in cache/ harddrive
   if (rs == null)
       allregs = []; 
   else
       allregs = JSON.parse(rs);
   for (var i =0; i< allregs.length; i++)
       if (allregs[i][0] == s.value) 
           break;
   if ( i == allregs.length)
   {
       allregs.splice(0,0,[s.value, c.value, ($('regex').checked)]);
       if (allregs.length > 25)
           allregs.splice(allregs.length-1,1);
       localStorage['reglist'] = JSON.stringify(allregs);
       var newitem = document.createElement('option');
       newitem.value = s.value;
       var lt = $('reglist').childNodes;
       if (lt ==null || lt.length == 0)
           $('reglist').append(newitem);
       else
           $('reglist').insertBefore(lt[0],newitem);
       $('sourcechar').list = 'reglist';
       
   }
   if (a.checked)
   try
   {
     let r = new RegExp(s.value, "gi");
     
     oldt[oldt.length] = t.value;
     t.value = t.value.replace(r, c.value);
     undo.style.visibility = 'visible'; 
   }
   catch(e){}
   else
   {
     oldt[oldt.length] = t.value;
     t.value = replaceAll(t.value, s.value, c.value, true);
     undo.style.visibility = 'visible';  
   }
}
function replaceAll(str, find, newToken, ignoreCase)
{
    let i = -1;

    if (!str)
    {
        // Instead of throwing, act as COALESCE if find == null/empty and str == null
        if ((str == null) && (find == null))
            return newToken;

        return str;
    }

    if (!find) // sanity check 
        return str;

    ignoreCase = ignoreCase || false;
    find = ignoreCase ? find.toLowerCase() : find;

    while ((
        i = (ignoreCase ? str.toLowerCase() : str).indexOf(
            find, i >= 0 ? i + newToken.length : 0
        )) !== -1
    )
    {
        str = str.substring(0, i) +
            newToken +
            str.substring(i + find.length);
    } // Whend 

    return str;
}
function undo(btn)
{
   let t = $('googlesource');
   if (oldt.length>=1)
   {
   t.value = oldt[oldt.length-1];
   oldt.splice(oldt.length-1,1);
   if (oldt.length == 0)
      btn.style.visibility = 'hidden'; 
   }
}

let ii;
function loadfile(i)
{
 var file = document.getElementById("myFile" + i).files[0];
 ii = i;
 var reader = new FileReader();
 reader.onload = function (e) 
 {
    var textArea;
    if(ii==0) textArea = document.getElementById("bbsource");
    else textArea = document.getElementById("googlesource");
    textArea.value = e.target.result;
 };
reader.readAsText(file); 
}




