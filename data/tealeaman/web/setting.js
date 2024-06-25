
let DBGCOLOR1=DBGCOLOR, IBGCOLOR1=IBGCOLOR, BBGCOLOR1=BBGCOLOR, TBGCOLOR1=TBGCOLOR, 
    fontname1, fontsize1=font_size, fontnameorer = 0, timeformat1 = "";
if (typeof timeformat != 'undefined')
    timeformat1 = timeformat;
else timeformat1 = "MM/DD/YYYY hh:mm";

if (typeof fontname != 'undefined')
   fontname1 =  fontname;
else if (typeof cachedfontname != 'undefined')
   fontname1 =  cachedfontname; 
else if (localStorage['myfontname'] != null)
   fontname1 =  localStorage['myfontname'];
else 
   fontname1 = "times";
function chgfont(sel)
{
    fontname1 = sel.options[sel.selectedIndex].value;
    localStorage['myfontname'] = fontname1; 
    unifonts(document.body, fontname1);
    let x =   IBGCOLOR1 +  "." + DBGCOLOR1 +"." + TBGCOLOR1 +"." + BBGCOLOR1 + "." +   fontnameorer + "." + fontsize1 ;
    SetCookie("colorsfont",Msg.hex(x));
    
}
function chgfontsize(sel)
{
    fontnameorder = 0;
    for (let j =0; j < allfonts.length; j++)
    {
        if (allfonts[j]==cachedfontname) 
        {
            fontnameorder = j;
            break;
        }
    }
    fontsize1 = sel.options[sel.selectedIndex].value;
    let x =   IBGCOLOR1 +  "." + DBGCOLOR1 +"." + TBGCOLOR1 +"." + BBGCOLOR1 + "." + fontnameorder + "." + fontsize1;
    SetCookie("colorsfont",Msg.hex(x));
    localStorage["colorsfont"] = x;
     
    document.location.href = document.location.toString();
}

function moresetting()
{
    let xs = textmsg[1875].split(/@/);
    let ms = textmsg[1884].split(/@/);
    let ys = textmsg[1639].split(/@/);
    let selfontsize = "";
    for (let i=8; i < 40; i++)
       selfontsize += "<option value=" + i +" " + ((i==font_size)?"selected":"") +">" + i + " px</option>";
    selfontsize += "</select>";
    let selfonts = "";
    fontnameorder = 0;
    for (let j =0; j < allfonts.length; j++)
    {
        if (allfonts[j]==cachedfontname) fontnameorder = j;
        selfonts += "<option value=\"" + allfonts[j] + "\" " + (allfonts[j]==cachedfontname?"selected":"") 
                + " >" + allfonts[j].replace(/,.*/,"") + "</option>";
    }
    selfonts += "</select>";
    
    let lists = "<datalist id=timeformats><option value=\"MM/DD/YY hh:mm\" /><option value=\"MM/DD/YY hh:mm\" /><option value=\"MM/DD/YYYY hh:mm\" /><option value=\"MM-DD-YY hh:mm\" /><option value=\"YY-MM-DD hh:mm\" /><option value=\"YYYY-MM-DD hh:mm\" /><option value=\"MM/DD hh:mm\" /></datalist>";
    
    myprompt(lists + "<table style=margin:0px ><tr><td><form rel=opener name=fn  ><table  cellpadding=5 style=\"margin:3px;padding:0px;border:1px #b0b0b0 solid;border-radius:4px\">"
    + "<tr><td style=white-space:nowrap  width=100%>" +  ms[3] + "</td><td valign=top  ><input name=dbgcolor type=color value=" + DBGCOLOR + "  size=10 onchange=\"javascript:DBGCOLOR1=this.style.backgroundColor = this.value;\"   style=background-color:" + DBGCOLOR + ";width:90px;padding:0px></td></tr>"
    + "<tr><td style=white-space:nowrap width=100%>" +  ms[0] + "</td><td valign=top ><input  name=ibgcolor  type=color value=" + IBGCOLOR + " size=10 onchange=\"javascript:IBGCOLOR1=this.style.backgroundColor = this.value;\"  style=background-color:" + IBGCOLOR + ";width:90px;padding:0px></td></tr>"
    + "<tr><td style=white-space:nowrap width=100%>" +  ms[2] + "</td><td valign=top ><input  name=tbgcolor  type=color value="+ TBGCOLOR + "  size=10  onchange=\"javascript:TBGCOLOR1=this.style.backgroundColor = this.value;\"  style=background-color:" + TBGCOLOR + ";width:90px;padding:0px></td></tr>"
    + "<tr><td style=white-space:nowrap width=100%>" +  ms[1] + "</td><td valign=top ><input  name=bbgcolor  type=color value=" + BBGCOLOR + "  size=10  onchange=\"javascript:BBGCOLOR1=this.style.backgroundColor = this.value;\"  style=background-color:" + BBGCOLOR + ";width:90px;padding:0px></td></tr>"
    + "<tr><td style=white-space:nowrap width=100%>" +  ys[4] + "</td><td valign=top ><select  name=fontname  onchange=\"javascript:fontnameorer=this.selectedIndex\" style=\"border:1px #b0b0b0 solid;font-size:"+ font_size + "px;background-color:" + TBGCOLOR + ";width:90px\" >" + selfonts + "</td></tr>"
    + "<tr><td style=white-space:nowrap width=100%>" +  ys[5] + "</td><td valign=top ><select   name=fontsize  onchange=\"javascript:fontsize1=this.options[this.selectedIndex].value\"  style=\"border:1px #b0b0b0 solid;font-size:"+ font_size + "px;background-color:" + TBGCOLOR + ";width:90px\" >" + selfontsize + "</td></tr>"
    + "<tr><td style=white-space:nowrap width=100%>" +  textmsg[659] + "</td><td valign=top ><input list=timeformats  name=timeformat value=\"" + timeformat1 + "\"  size=26  onchange=\"javascript:timeformat1=this.value;\"  style=\"border:1px #b0b0b0 solid;font-size:"+ font_size + "px;background-color:" + TBGCOLOR + ";width:200px;padding:0px\" ></td></tr>"
    
    +"</table></form></td></tr>"
    + (document.location.toString().includes("go.jsp")?"":(
    "<tr><td>"
    +"<table cellpadding=5 style=\"margin:3px;padding:0px;border:1px #b0b0b0 solid;border-radius:4px\">"
    +"<tr><td valign=top><input type=checkbox " + (localStorage['qrcodeenable']=='T'?"checked":"") 
    + " onclick=\"javascript:localStorage['qrcodeenable']=(this.checked?'T':'F')\"></td><td>" +  xs[0] +  
    "</td></tr><tr><td  valign=top><input type=checkbox " + (localStorage['logdataout']=='T'?"checked ":" ")  
    + " onclick=\"javascript:localStorage['logdataout']=(this.checked?'T':'F')\"></td><td>"+ xs[1] 
    +"</td></tr><tr><td  valign=top><input type=checkbox " + (localStorage['trackenable']=='T'?"checked":"") 
    + " onclick=\"javascript:localStorage['trackenable']=(this.checked?'T':'F')\"></td><td>" + xs[2]
    + "</td></tr></table></td></tr><tr><td align=center> <a href=\"javascript:allcookies('" + ms[4] + "')\">" +  ms[4] + "</a>&nbsp&nbsp&nbsp;<a href=\"javascript:alllocals('" + ms[5] + "')\">" +  ms[5] + "</a></td></tr>"))
    + "</table>",null, 'if(v)goahead()',textmsg[700]);
    
}

function studentsetting()
{
    let xs = textmsg[1875].split(/@/);
    let ms = textmsg[1884].split(/@/);
    let ys = textmsg[1639].split(/@/);
    let selfontsize = "";
    for (let i=8; i < 40; i++)
       selfontsize += "<option value=" + i +" " + ((i==font_size)?"selected":"") +">" + i + " px</option>";
    selfontsize += "</select>";
    let selfonts = "";
    fontnameorder = 0;
    for (let j =0; j < allfonts.length; j++)
    {
        if (allfonts[j]==cachedfontname)
        fontnameorder = j;
       selfonts += "<option value=\"" + allfonts[j] + "\" " + (allfonts[j]==cachedfontname?"selected":"") + " >" + allfonts[j].replace(/,.*/,"") + "</option>";
    }
   selfonts += "</select>";
   let lists = "<datalist id=timeformats><option value=\"MM/DD/YY hh:mm\" /><option value=\"MM/DD/YY hh:mm\" /><option value=\"MM/DD/YYYY hh:mm\" /><option value=\"MM-DD-YY hh:mm\" /><option value=\"YY-MM-DD hh:mm\" /><option value=\"YYYY-MM-DD hh:mm\" /><option value=\"MM/DD hh:mm\" /></datalist>";
     
    myprompt(lists + "<table align=center width=98% style=\"margin:4px;padding:4px;border:1px #b0b0b0 solid;border-radius:4px;\"><tr><td><form rel=opener name=ff   ><table  cellpadding=5 >"
    + "<tr><td style=white-space:nowrap  width=100%>" +  ms[3] + "</td><td valign=top  ><input name=dbgcolor type=color value=" + DBGCOLOR + " size=10 onchange=\"javascript:DBGCOLOR1=this.style.backgroundColor = this.value;\"  style=background-color:" + DBGCOLOR + ";width:90px;padding:0px></td></tr>"
    + "<tr><td style=white-space:nowrap width=100%>" +  ms[0] + "</td><td valign=top ><input  name=ibgcolor  type=color value=" + IBGCOLOR + " size=10 onchange=\"javascript:IBGCOLOR1=this.style.backgroundColor = this.value;\"  style=background-color:" + IBGCOLOR + ";width:90px;padding:0px></td></tr>"
    + "<tr><td style=white-space:nowrap width=100%>" +  ms[2] + "</td><td valign=top ><input  name=tbgcolor  type=color value="+ TBGCOLOR + "  size=10  onchange=\"javascript:TBGCOLOR1=this.style.backgroundColor = this.value;\"  style=background-color:" + TBGCOLOR + ";width:90px;padding:0px></td></tr>"
    + "<tr><td style=white-space:nowrap width=100%>" +  ms[1] + "</td><td valign=top ><input  name=bbgcolor  type=color value="+ BBGCOLOR + "  size=10  onchange=\"javascript:BBGCOLOR1=this.style.backgroundColor = this.value;\"  style=background-color:" + BBGCOLOR + ";width:90px;padding:0px></td></tr>"
    + "<tr><td style=white-space:nowrap width=100%>" +  ys[4] + "</td><td valign=top ><select  name=fontname  onchange=\"javascript:fontnameorer=this.selectedIndex\" style=\"border:1px #b0b0b0 solid;font-size:"+ font_size + "px;background-color:" + TBGCOLOR + ";width:90px\" >" + selfonts + "</td></tr>"
    + "<tr><td style=white-space:nowrap width=100%>" +  ys[5] + "</td><td valign=top ><select   name=fontsize  onchange=\"javascript:fontsize1=this.options[this.selectedIndex].value\"  style=\"border:1px #b0b0b0 solid;font-size:"+ font_size + "px;background-color:" + TBGCOLOR + ";width:90px\" >" + selfontsize + "</td></tr>"
    + "<tr><td style=white-space:nowrap width=100%>" +  textmsg[659] + "</td><td valign=top ><input list=timeformats  name=timeformat value=\"" + timeformat1 + "\"  size=26  onchange=\"javascript:timeformat1=this.value;\"  style=\"border:1px #b0b0b0 solid;font-size:"+ font_size + "px;background-color:" + TBGCOLOR + ";width:200px;padding:0px\" ></td></tr>"
    
    +"</table></form></td></tr>"
    +"<tr><td align=center> <a href=\"javascript:allcookies()\">" +  ms[4] + "</a>&nbsp&nbsp&nbsp;<a href=\"javascript:alllocals('" + ms[5] + "')\">" +  ms[5] + "</a></td></tr></table>",null,'if(v)goaheads()',textmsg[700]);
     
}

function goaheads()
{
    let x =   IBGCOLOR1 + "." 
            + DBGCOLOR1 +"." 
            + TBGCOLOR1 +"." 
            + BBGCOLOR1 + "." 
            + fontnameorer + "." 
            + fontsize1;
    localStorage["myfontname"] = allfonts[fontnameorer];
    cachedfontname = allfonts[fontnameorer];
    let y = Msg.hex(x);
    SetCookie("colorsfont",y);
    localStorage["colorsfont"] = x;
    SetCookie( "timeformat"+orgnum,Msg.hex(timeformat1));
    parent.document.location.href = 'studentpage.jsp';
    
}

function goahead()
{
    let x =   IBGCOLOR1 + "." 
            + DBGCOLOR1 +"." 
            + TBGCOLOR1 +"." 
            + BBGCOLOR1 + "." 
            + fontnameorer 
            + "." + fontsize1 ;
    localStorage["myfontname"] = allfonts[fontnameorer];
    cachedfontname = allfonts[fontnameorer];
    let y = Msg.hex(x);
    SetCookie("colorsfont", y);
    localStorage["colorsfont"] = x;
    SetCookie("timeformat"+orgnum,Msg.hex(timeformat1));
    document.location.href = document.location.toString();
}

function allcookies() 
{
    let title = textmsg[1884].split(/@/)[4];
    let clear = textmsg[1871].split(/@/)[5];
    var cookies = document.cookie.split(';');
    cookies.sort(function(a,b){
        a=a.toLowerCase().replace(/:.*/,''); 
        b=b.toLowerCase().replace(/:.*/,'');
        return a>b?1:(a==b?0:-1);});
    var ret = "<table align=center id=allcookie style=\"border:1px #b0b0b0 solid;border-radius:4px;margin:4px\"><tr style=background-color:"
           + BBGCOLOR + "><td><nobr>" 
           + textmsg[1423] + '</nobr></td><td  width=100%>' + textmsg[984].replace(/.$/,'')
           + "</td><td valign=middle  style=color:blue  onclick=download1();clearallcookies()><nobr>" 
           + textmsg[1871].split(/@/)[5]+ (textmsg[1849].indexOf('All')==0?' ':'') + textmsg[1849].split(/@/)[0]  +"</nobr><td></tr>";
    
    for(let i=0; i < cookies.length; i++)
    {
        let j = cookies[i].indexOf('=');
        let cn = cookies[i].substring(0,j);
        let va = cookies[i].substring(1+j);
        if (cn.includes('colorsfont'))
            va = Msg.fromhex(va);
        else if (cn.includes('timeformat'))
            va = Msg.fromhex(va);
        ret +=  '<tr><td  valign=top align=left>' + cn
                + '</td><td style=font-weight:700;font-family:arial  width=100%>' + va
                + "</td><td valign=top  style=color:blue  onclick=\"clearcookie(this,'" + cn
                + "')\">"  
                + clear
                +"<td></tr>";
    }
    let ds = "<div style=\"display:grid;grid-template-columns:auto auto auto;\"><input id=\"download\" type=\"button\" class=\"GreenButton\" style=\"width:"
            + (4.5*font_size) + 'px;font-size:' + font_size + 'px;margin:0px 0px 0px 5px" value="' + backup +'" onclick="download1()">';
    ds += '<input type=hidden style="float:right;" id=hidetxt><table style="float:right;margin:0px 5px 0px 0px"><tr><td><nobr>' + textmsg[118] + '</nobr></td><td><input type="file" style="float:right;border:1px #b0b0b0 solid;font-size:' + font_size + 'px" id=localpath onchange="openlfile1(this)" ></td></tr></table></div>';
    closeprompt();
    myprompt(ret + "</table>" + ds,null,null,title);
}
function download1()
{
    let x = document.location.toString();
    let i = x.indexOf('/');
    let j = x.indexOf('/',i+2);
    let allk = allCookieKeys();
    let ss = '';
    for (let k of allk)
    {
       if (ss!='') ss += '\n';
       let va = GetCookie(k);
       ss += '"' + k + '","' + va.replace(/"/g, '""')  + '"';
    }
    download(ss,null, x.substring(i+2,j) + "cookie.txt");
}
function download2()
{
   let ss = '';
    let key = Object.keys(localStorage);
   for(let i=0; i < key.length; i++) 
   {
       let va = localStorage[key[i]];
       if (i>0) ss += "\n";
       ss += '"' + key[i] + '","' + va.replace(/"/g, '""') + '"';
   }
    let x = document.location.toString();
    let i = x.indexOf('/');
    let j = x.indexOf('/',i+2);
    download(ss,null, x.substring(i+2,j) + "localstore.txt");
}
function download(contents, id,filename) 
{
        let mime_type =  "text/csv";
        if (contents == null)
        contents = document.getElementById(id).value;
        var blob = new Blob([contents], {type: mime_type});

        var dlink = document.createElement('a');
        dlink.download = filename;
        dlink.href = window.URL.createObjectURL(blob);
        dlink.onclick = function(e) {
            // revokeObjectURL needs a delay to work properly
            var that = this;
            setTimeout(function() {
                window.URL.revokeObjectURL(that.href);
            }, 1500);
        };

        dlink.click();
        dlink.remove();
    }
function afterloadlocal1()
{
    let x = document.getElementById("hidetxt").value;
    if (!x.includes(",") ) 
    {
        closeprompt();
        myprompt(textmsg[1814]);
    }
    else 
    {
        let y = (new CSVParse(x,"\"",",", "\n")).nextMatrix();
        for(let k =0; k < y.length; k++)
            SetCookie(y[k][0], y[k][1])
        closeprompt();
        allcookies(); 
    }
    
}
function openlfile1(td)
{
    let x = document.getElementById("hidetxt");
    openfileto(td, x, afterloadlocal1);
}

function afterloadlocal2()
{
    let x = document.getElementById("hidetxt").value;
    if (!x.includes(",") ) 
    {
        closeprompt();
        myprompt(textmsg[1814]);
    }
    else 
    {
        let p = (new CSVParse(x,'"', ",", "\n")).nextMatrix();
        for (let k =0; k  < p.length; k++)
        {
            localStorage[p[k][0]] = p[k][1];
        }
        closeprompt();
        alllocals(); 
    }
    
}
function openlfile2(td)
{
    let x = document.getElementById("hidetxt");
    openfileto(td, x, afterloadlocal2);
}

function clearcookie(td,name)
{
    delCookie(name);
    td.parentNode.parentNode.removeChild(td.parentNode);
}
function clearallcookies()
{
    let tbl = $('allcookie');
    for (let i = tbl.rows.length-1; i>=1;  i--)
    {
        clearcookie(tbl.rows[i].cells[0],tbl.rows[i].cells[0].innerHTML);
    }
    
}
function alllocals(title) 
{
   if (title == null) title = textmsg[1884].split(/@/)[5];
   localStorage['key'] = 'value';
   var ret =  "<table align=center id=alllocal style=\"border:1px #b0b0b0 solid;border-radius:4px;margin:4px\"><tr style=background-color:" + BBGCOLOR + "><td><nobr>" 
           + textmsg[1423] + '</nobr></td><td   width=100%><nobr>' + textmsg[984].replace(/.$/,'')
           + "</nobr></td><td valign=middle style=color:blue onclick=download2();clearalllocals() ><nobr>" 
           + textmsg[1871].split(/@/)[5]+ (textmsg[1849].indexOf('All')==0?' ':'') + textmsg[1849].split(/@/)[0] +  "</nobr><td></tr>";
   let key = Object.keys(localStorage);
   key.sort();
   for(let i=0; i < key.length; i++) 
   {
       let va = localStorage[key[i]].replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\r\n/g,'<br>').replace(/\n/g,'<br>');
       
       ret += "<tr><td  valign=top align=left><nobr>" + key[i] + '</nobr></td><td width=100%>' + va 
       + "</td><td valign=top  style=color:blue  onclick=clearlocal(this,'" + key[i] + "')>" 
       + textmsg[1871].split(/@/)[5]+"<td></tr>";
   }
   let ds = "<div style=\"display:grid;grid-template-columns:auto auto auto;\"><input id=\"download\" type=\"button\" class=\"GreenButton\" style=\"width:"
            + (4.5*font_size) + 'px;font-size:' + font_size + 'px;margin:0px 0px 0px 5px" value="' + backup +'" onclick="download2()">';
    ds += '<input type=hidden style="float:right;" id=hidetxt><table style="float:right;margin:0px 5px 0px 0px"><tr><td><nobr>' + textmsg[118] + '</nobr></td><td><input type="file" style="float:right;border:1px #b0b0b0 solid;font-size:' + font_size + 'px" id=localpath onchange="openlfile2(this)" ></td></tr></table></div>';
   
   closeprompt();
   myprompt(ret + "</table>" + ds,null,null,title);
}
function clearlocal(td,name)
{
    localStorage.removeItem(name);
    td.parentNode.parentNode.removeChild(td.parentNode);
}
function clearalllocals()
{
    let tbl = $('alllocal');
    for (let i = tbl.rows.length-1; i>=1;  i--)
    {
        clearlocal(tbl.rows[i].cells[1],tbl.rows[i].cells[0].innerHTML.replace(/;.*$/,''));
    }
    
}


