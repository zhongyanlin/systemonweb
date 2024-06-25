let sortcol;
let direction = [];
var headings = [];
var atypes = textmsg[798].split(/@/);
var accesses = textmsg[1927].split(/@/);
var f1 = document.form1;
let  tbl = document.getElementById('themaintbl');
let numRows = tbl.rows.length-1;
let cb = [];
for (let i=0; i < numRows; i++)
    cb[i] = document.getElementById('checkbox' + i);
let shiftPressed;
function checkall1()
 {
    var b = f1.check1.checked;
    for (var i = 0; i < numRows; i++)  
    {     
        let did = cb[i].id + cb[i].tagName + cb[i].type;
        document.getElementById('checkbox' + i).checked = b;
    } 
 }
 function mouseDown(e)
 {
   if (parseInt(navigator.appVersion)>3)
   {
      var evt = navigator.appName=="Netscape" ? e:event;
      if (navigator.appName=="Netscape" && parseInt(navigator.appVersion)==4)
      {
         var mString =(e.modifiers+32).toString(2).substring(3,6);
         shiftPressed=(mString.charAt(0)=="1");
      }
      else
      {
         shiftPressed=evt.shiftKey;
      }
    }
    return true;
}

 document.onmousedown = mouseDown;
 function checkseq(i)
{
   if (shiftPressed)
   {
      var j = i-1;
      while (j>=0 && document.getElementById('checkbox' + j).checked!=document.getElementById('checkbox' + i).checked) 
      {
         document.getElementById('checkbox' + j).checked = document.getElementById('checkbox' + i).checked;
         j--;
      }
   }
   
}
function buildcache(){document.location.href = "assigntest.jsp?keys=build&semester=" + semester;}
function deletecache(){ 
    let left = ';' + allkeys;
    let ks = ";";
    for (let i=0; i < numRows; i++)
        if (document.getElementById('checkbox' + i).checked   ) 
    {
        if (tbl.rows[i+1].cells[9].innerHTML.length == 1) ks += '`';
        let xx = tbl.rows[i+1].cells[1].innerHTML + "|" + tbl.rows[i+1].cells[2].innerHTML + "|" + tbl.rows[i+1].cells[3].innerHTML + ";";
        ks += xx;
        left = left.replace(";" + xx,";");
    }
    if (ks!=';')        
    postopen('assigntest.jsp',['keys','semester'],[ks + '____' + left,''+semester], parent.frames[1].name);
}

function sortc(td)
{
    
    if (td!=null)
    { let c = 0; for(; c < headings.length;c++) if (td.innerHTML.replace(/<[^>]+>/g,'') == headings[c])break;
    sortcol = c;}
    if (sortcol > 7) return;
    if (direction[sortcol] == null) direction[sortcol] = 1;
    else direction[sortcol] = - direction[sortcol];
    let rws = [];
    let r;
    for (r = 1; r < tbl.rows.length; r++)
    {
        let rw = [];
        for (let j=1; j < tbl.rows[0].cells.length; j++)
           rw[j-1] = tbl.rows[r].cells[j].innerHTML;
        rws[rws.length] = rw;
    }
    let a = [];
    for (r = 1; r < tbl.rows.length; r++)
        a[a.length] = tbl.rows[r].cells[sortcol+1].innerHTML + ' _,_' + (r-1);
    
   // for (r = 0; r < tbl.rows.length-1; r++) console.log(a[r]);
    a.sort((x,y) => { let b; let xs= x.split(/_,__/), ys=y.split(/_,__/); if (xs[0] === ys[0])   b = parseInt(xs[1]) - parseInt(ys[1]); else b = xs[0].localeCompare(ys[0]); return direction[sortcol]* b;});
    var order = [];
    for (r = 0; r < tbl.rows.length-1; r++)
        order[r] = parseInt(a[r].replace(/.* _,_/,''));
    //for (r = 0; r < tbl.rows.length-1; r++) console.log(order[r]);
    
    for (r = 0; r < tbl.rows.length-1; r++)
    {
        for (let j=1; j < tbl.rows[0].cells.length; j++)
        {
            tbl.rows[r+1].cells[j].innerHTML =   rws[order[r]][j-1];
         
        }
        
    }
     
}
function showsids(z)
{
    
    myprompt((new CSVParse(z,'|',',',";")).tohtml().replace(/<table /, '<table align=center '),null,null,textmsg[1574]);
}
let clickedlink = false;
function selwhich1(td,k)
{
    let r = 1; while (tbl.rows[r].cells[k]!=td) {r++;if(r>=tbl.rows.length) return;}
    let course = tbl.rows[r].cells[1].innerHTML;
    let as = tbl.rows[r].cells[2].innerHTML;
    let sn = tbl.rows[r].cells[3].innerHTML;
    let j = parent.frames[0].selwhich(course,as, sn);
    
}
function unselall()
{
    if( clickedlink ==false) 
       parent.frames[0].unselall();
    
}
function studentlink()
{  
    
        let key =  retrv(0,11) + "|" +   retrv(0,10)+ "|" +  retrv(0,5)+ "|" +  retrv(0,0);
        let v = subdb + "|" + 
        retrv(0,11) + "|" + 
        retrv(0,10)+ "|" + 
        retrv(0,5)+ "|" + 
        retrv(0,0);
        
        postopen('follows.jsp',  'x,c,atype,key'.split(/,/),["enforce6b", v,retrv(0,4),key],'w'+tstmp);
    
}
function openit2(td)
{
    let r = 1; while (tbl.rows[r].cells[10]!=td) {r++;if(r>=tbl.rows.length) return;}
    let course = tbl.rows[r].cells[1].innerHTML;
    let as = tbl.rows[r].cells[2].innerHTML;
    let sn = tbl.rows[r].cells[3].innerHTML;
    let j = parent.frames[0].selwhich(course,as, sn);
    parent.frames[0].subopen(j);
     document.getElementById('urlplace').parentNode.style.display = 'none';
    document.getElementById('urlplace1').parentNode.style.display = 'none';
}
function showurl(x)
{
    x = document.location.toString().replace(/assigntest.jsp.*$/, "assigntest.jsp?c=" + orgnum + "-" + x);
    document.getElementById('urlplace').innerHTML = x;
    document.getElementById('urlplace1').innerHTML = x;
    document.getElementById('urlplace').parentNode.style.display = 'block';
    document.getElementById('urlplace1').parentNode.style.display = 'block';
    document.getElementById('clipb').innerHTML = textmsg[327];
    document.getElementById('clipb1').innerHTML = textmsg[327];
    clickedlink = true;
}
function clipboard()
{
     let x = document.getElementById('urlplace').innerHTML;
    navigator.clipboard.writeText(x);
    clickedlink = false;
}
function testlink(i)
{
    let x = document.getElementById('urlplace'+i).innerHTML;
    clickedlink = false;
    window.open(x, '_blank');
}
var oldasscacheonload = window.onload;
window.onload = function()
{
    if (oldasscacheonload != null) oldasscacheonload(); 
    let head = [466,317, 453, 450,451,452, 1263,1574,594,485,385];
    headings[0] = textmsg[466];
     headings[1] = textmsg[317];
      headings[2] = textmsg[453];
       headings[3] = textmsg[450];
        headings[4] = textmsg[451];
         headings[5] = textmsg[452];
          headings[6] = textmsg[1263];
           headings[7] = textmsg[1574];
            headings[8] = textmsg[594];
             headings[9] = textmsg[485];
             headings[10] = textmsg[385];
    for (let c = 0; c < head.length; c++)
        tbl.rows[0].cells[c+1].innerHTML = headings[c].includes(' ')?('<nobr>' + headings[c] +'</nobr>'):headings[c];
    let nowt = ~~((new Date()).getTime()/1000);
    let needa = [];
    for (let c = 4; c <= 5; c++)
        for (let r = 1; r < tbl.rows.length; r++)
       {
            if (c == 5)
            {    if (parseInt(tbl.rows[r].cells[c].innerHTML) > nowt)
                    needa[r] = true;
                else
                    needa[r] = false;
            }
            tbl.rows[r].cells[c].innerHTML = timestr(parseInt(tbl.rows[r].cells[c].innerHTML));
        }
    for (let r = 1; r < tbl.rows.length; r++)
        tbl.rows[r].cells[6].innerHTML = atypes[parseInt(tbl.rows[r].cells[6].innerHTML)];
    
    for (let r = 1; r < tbl.rows.length; r++)
    {
        let y = tbl.rows[r].cells[7].innerHTML;
        if (y.indexOf('cd:') <0 || y == 'cd:') y = accesses[0];
        else if (y.indexOf('attendance')>=0) y = accesses[1];
        else if (y.indexOf('distinct') >= 0) y = accesses[3];
        else  y = accesses[2];
        tbl.rows[r].cells[7].innerHTML = y;
    }
    let verb = textmsg[1871].replace(/@.*$/,'');
    for (let r = 1; r < tbl.rows.length; r++)
        if (tbl.rows[r].cells[9].innerHTML != '')
    {
        verb = textmsg[1932]; break;
    }
    for (let r = 1; r < tbl.rows.length; r++)
        if (tbl.rows[r].cells[9].innerHTML == '' && needa[r])
    {
        tbl.rows[r].cells[9].innerHTML = '<font color=blue>' + verb + '</font>';
    }
    sortcol = 1;
    sortc();
    sortcol = 0;
    sortc();
};

function activate(td)
{
     if (td==null || td.innerHTML == '' || td.innerHTML == '&check;') return;
     let r = 1; for(; r < tbl.rows.length; r++) if (td == tbl.rows[r].cells[9]) break;
     if (r == tbl.rows.length) return;
     let v = [orgnum, semester, subdb, tbl.rows[r].cells[1].innerHTML, tbl.rows[r].cells[3].innerHTML, tbl.rows[r].cells[2].innerHTML,',' +allkeys];
     let u = "orgnum,semester,subdb,course,sessionname,assignname,keys".split(/,/);
     postopen('assigntest.jsp', u, v, '_self');
}



