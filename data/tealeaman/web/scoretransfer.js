function transfer()
{
    let ms = textmsg[1883].split(/@/);
    let str = '<nobr>' + textmsg[1428] + '&nbsp;</nobr><input type=hidden id=hidetxt><input type="file" style="border:1px #b0b0b0 solid;" id=localpath onchange="openlfile(this)" >'
    +'<span id=bbhint style=visibility:hidden;margina-right:40px><span style="color:orange;border:1px orange solid">&darr;</span>' + ms[1] +
            '&nbsp;&nbsp;&nbsp;&nbsp;<span id=spanscale style=visibility:hidden;>' + textmsg[1760] + '<input id=newscale value=10 size=6 style="border:1px orange solid">&nbsp;&nbsp;</span><input id="download" type="button" class="GreenButton" style="visibility:hidden;width:'
            + (4.5 * font_size) + 'px;" value="' + ms[2] + '" onclick="bbmerge(this)"  >'
            + '<div id=bbsheet></div>';
    myprompt(str, null, null, "CSV " + textmsg[703]);
    window.scrollTo(0, 10);
    promptwin.style.width = null;
    promptwin.style.left = "5px";
    promptwin.style.top = "120px";
}
function openlfile(td)
{
    let x = document.getElementById("hidetxt");
    openfileto(td, x, afterloadlocal);
}
let dparse;
let N1;
function afterloadlocal()
{
    let str = document.getElementById('hidetxt').value;
    let comma = str.includes('\t') ? "\t" : ",";
    dparse = new CSVParse(str, '"', comma, "\r\n");
    document.getElementById('bbhint').style.visibility = 'visible';
    document.getElementById('download').style.visibility = 'visible';
    document.getElementById('bbsheet').innerHTML = dparse.tohtml();

    let head = new Array();
    let tbl = document.getElementById('bbsheet').getElementsByTagName('table')[0];
    for (let i = 0; i < tbl.rows.length; i++)
        if (tbl.rows[i] != null && tbl.rows[i].cells.length >= 5)
            for (let k = 0; k < 5; k++)
                if (tbl.rows[i].cells[k] != null)
                    tbl.rows[i].cells[k].style.whiteSpace = "nowrap";
    let N = tbl.rows[0].cells.length;

    for (let i = 6; i < N; i++)
    {
        let jj = tbl.rows[0].cells[i].innerHTML.indexOf('[');
        if (jj > 0)
            tbl.rows[0].cells[i].innerHTML = tbl.rows[0].cells[i].innerHTML.substring(0, jj).replace(/ $/, '');
        head[head.length] = tbl.rows[0].cells[i].innerHTML;
        
        for (let k = 0; k < tbl.rows.length; k++)
            if (tbl.rows[k] != null && tbl.rows[k].cells[i] != null)
                tbl.rows[k].cells[i].align = 'right';
    }
    let bestm = new Array();
    N1 = tbl.rows[0].cells.length;

    for (let c = 0; c < N1; c++)
    {
        let j = 0;
        for (; j < 5; j++)
            if (j != 1 && tbl.rows[0].cells[c].innerHTML.replace(/ /g, '').toLowerCase() == fields[j].toLowerCase() || tbl.rows[0].cells[c].innerHTML.replace(/ /g, '').toLowerCase() == labels[j].replace(/ /g, '').toLowerCase()
                    || tbl.rows[0].cells[c].innerHTML.replace(/ /g, '').toLowerCase().includes(fields[j].toLowerCase())
                    || fields[j].includes(tbl.rows[0].cells[c].innerHTML.replace(/ /g, '').toLowerCase())
                    || tbl.rows[0].cells[c].innerHTML.replace(/ /g, '').toLowerCase().includes(labels[j].replace(/ /g, '').toLowerCase())
                    || labels[j].replace(/ /g, '').toLowerCase().includes(tbl.rows[0].cells[c].innerHTML.replace(/ /g, '').toLowerCase())
                    )
                break;

        let sel = document.createElement('select');
        sel.id = 'sel' + c;
        sel.style.cssText = 'display:block;border:1px orange solid';
        let ss = '';
        sel.onchange = function()
        {
            if (this.options[this.selectedIndex].value=='5')
            {
                let col = parseInt(this.id.substring(3));
                let tbl = this.parentNode.parentNode.parentNode.parentNode;
                 
                let mx = 0;
                for (let j=1; j < tbl.rows.length; j++)
                {
                    if (tbl.rows[j].cells.length < col)continue;
                    let cel = tbl.rows[j].cells[col];
                    if (cel.tagName.toLowerCase() == 'td')
                    {
                        let sc = parseFloat(cel.innerHTML);
                        if (''+sc !='NaN' && sc > mx) mx = sc;
                    }
                    
                }
                if (mx>90) mx=100;
                else if (mx>=9 && mx <=10) mx=10;
                else mx = Math.ceil(mx);
                $('spanscale').style.visibility = 'visible';
                $('newscale').value = ''+mx;
            }
        }
        for (let k = 0; k < 6; k++)
            if (k != 1)
                ss += '<option value=' + k + (j < 5 && j == k ? ' selected' : '') + '>' + labels[k] + '</option>';
        sel.innerHTML = ss + '<option value=-1' + (ss.includes('selected') ? "" : ' selected') + '>';

        tbl.rows[0].cells[c].appendChild(sel);
    }
    tbl.rows[0].height = 60;
}
if (typeof $ != 'function')
    $ = function (x) {
        return document.getElementById(x);
    }
let missedrow, head;
let nscale = 10;
function updatescale()
{
    let uid = ZQ[ZQ.length-5];
    let title = ZQ[1];
    let lj = title.lastIndexOf(":");
    let assignname = title.substring(lj+1);
    lj = title.indexOf(" ");
    let cid = title.substring(0,lj);
    lj = title.lastIndexOf("-");
    let session = cid.substring(lj+1);
    cid = cid.substring(0,lj);
    lj = mat[0][1].indexOf("Semester=");
    let semester = mat[0][1].substring(lj+9);
    let end = Math.floor((new Date()).getTime()/1000);
    let start = end -7*24*3600;
    let wcds = "u,,,"+start +","+ end +",,2,,,0,,'" 
            + uid +"',," 
            + nscale + ",,'',,'"
            + assignname + "','"
            + session +"','" 
            + cid +"','" 
            + semester + "'";
      
     postopen("SaveBack", ['rdap','rsacode','subdb','wcds','securitytoken'],
            ['assignedit','0',
                f2.subdb.value,  
                wcds,
                f2.securitytoken.value], 
            'w' +tstmp );
}
function bbmerge()
{
    nscale = $('newscale').value;
    
    missedrow = new Array();
    let str = document.getElementById('hidetxt').value;
    let comma = str.includes('\t') ? "\t" : ",";
    dparse = new CSVParse(str, '"', comma, "\r\n");
    let tbl = document.getElementById('bbsheet').getElementsByTagName('table')[0];
    let p2t = [];
    let t2p = [];
    let emailf = -1;
    let scoref = -1;
    let sidf = -1;
    for (let i = 0; i < N1; i++)
    {
        if ($('sel' + i).selectedIndex >= 0)
        {
            p2t[i] = $('sel' + i).selectedIndex;
            p2t[i] = $('sel' + i).options[p2t[i]].value;
            if (p2t[i] == 0) {
                sidf = i;
                p2t[i] = -1;
                t2p[0] = i;
            } else if (p2t[i] == 4) {
                emailf = i;
                p2t[i] = -1;
                t2p[4] = i;
            } else if (p2t[i] == 5) {
                scoref = i;
                p2t[i] = -1;
                t2p[5] = i;
            }
        } else
            p2t[i] = -1;
        if (p2t[i] > -1)
        {
            t2p[p2t[i]] = i;
        }
    }
    if (scoref == -1) 
    {
        myprompt('specify score column');
        return;
    }
    let missed = '';
    let matched = new Array();
    head = dparse.nextRow();
    maxsize[7] = 20000;
    while (true)
    {
        let row = dparse.nextRow();
        
        if (row == null || row[scoref] == null || row[scoref] == '')
            break;
        row[scoref] = row[scoref].replace(/%/,'');
        if (row[scoref].replace(/[0-9|\.]/g,'') != '')
            row[scoref] = '0';
        if (row.length < N1)
            continue;

        let done = false;
        if (emailf > -1)
        {
            let r = 0;
            for (; r < numRows; r++)
            {
                if (row[emailf].toLowerCase() == mat[r][4].toLowerCase())
                {
                    setv(r, 5, row[scoref]);
                    holdvalues[r + '_' + 5] = row[scoref];
                    ele(r, 4).style.color = 'green';
                    setv(r, 7, html2record(row));
                    setv(r, 6, '4'); 
                    done = true;
                    matched[r] = true;
                    valuechanged[r] = true;
                    break;
                }
            }
        }
        if (done)
            continue;
        let f = t2p[0];
        if (f != null)
        {
            let r = 0;
            for (; r < numRows; r++)
            {
                if (row[f].toLowerCase() == mat[r][0].toLowerCase())
                {
                    setv(r, 5, row[scoref]);
                    setv(r, 7, html2record(row));
                    ele(r, 1).style.color = 'green';
                    setv(r, 6, '4'); 
                    matched[r] = true;
                    done = true;
                    valuechanged[r] = true;
                    break;
                }
            }
        }
        if (done)
            continue;
        f = t2p[2];
        let ff = t2p[3];
        
        if (f != null && ff!=null)
        {
            let r = 0;
            for (; r < numRows; r++)
            {
                if (row[f].toLowerCase() == mat[r][2].toLowerCase()
                && row[ff].toLowerCase() == mat[r][3].toLowerCase())
                {
                    setv(r, 5, row[scoref]);
                    setv(r, 7, html2record(row));
                    ele(r, 2).style.color = 'green';
                    ele(r, 3).style.color = 'green';
                    setv(r, 6, '4'); 
                    matched[r] = true;
                    done = true;
                    valuechanged[r] = true;
                    break;
                }
            }

        }
        if (!done)
        {
            if (missed == '')
            {
                missed += "<tr style=background-color:" + BBGCOLOR + ">";
                missed += "<td>" + labels[1] + "</td>";
                for (let k = 0; k < N1 && k < 7; k++)
                    missed += "<td style=white-space:nowrap>" + head[k] + "</td>";
                missed += "</tr>";
            }
            missed += "<tr>";
            missed += "<td><input class=left id=missedr" + missedrow.length + " size=12 onchange=passdto(this," + missedrow.length + "," + scoref + ")></td>";
            missedrow[missedrow.length] = row;
            for (let k = 0; k < N1 && k < 7; k++)
                missed += "<td style=white-space:nowrap>" + row[k] + "</td>";
            missed += "</tr>";
        }
    }
    if (missed != '')
        myprompt("<center>" + textmsg[460] + '</center><table border=1 style=border-collapse:collapse;border-radius:3px cellpadding=3 >'
                + missed + '</table>', null, "if(v)setaction(1)");
    else
    {    
        setaction(1);
    }
    let r = 0; for (; r < numRows; r++)
    {
        valuechanged[r] = true;
        setv(r, 5, retrv(r,5));
        holdvalues[r + '_' + 5] = retrv(r,5);
        setv(r, 6, '4');
        holdvalues[r + '_6'] = '4';
        document.thisform.btnfunc3.disabled = false;
    }
}
onsaved = "updatescale()";
function passdto(box, k, scoref)
{
    let r = 0;
    let row = missedrow[k];
    for (; r < numRows; r++)
        if (mat[r][0] == box.value.replace(/ /g, ''))
        {
            setv(r, 5, row[scoref]);
            setv(r, 7, html2record(row));
            setv(r, 6, '4');  
            ele(r, 1).style.color = 'green';
            valuechanged[r] = true;
        }
        
       
}
function html2record(row)
{
    let v = '<table border=1 style=border-collapse:collapse  cellpadding=3 >'; 
     
    for (let j = 0; j < row.length ; j++)
    {
        v += '<tr><td>' + head[j] + '</td><td>' + row[j] + '</td></tr>';
    }
    if (v.length > 500) return ' ';
    return v + '</table>';
}


