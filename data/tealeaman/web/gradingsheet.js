var borderstyle = function (t,r,b,l)
{
    var x =  "background-color:#ffffed;margin:0px 0px 0px 0px;padding: " + (7*t+4) + "px 5px " + (7*b+4) + "px 5px;font-family:inherit;border-color:" + BBGCOLOR +";border-top-width:" + t + "px;border-left-width:" + l + "px;border-bottom-width:" + b + "px;border-right-width:" + r + "px";
    if (b >= 1 && r >= 1 && l>=1)
        x += ";border-bottom-right-radius:5px;-webkit-border-bottom-right-radius:5px;-moz-border-bottom-right-radius:5px;border-bottom-left-radius:5px;-webkit-border-bottom-left-radius:5px;-moz-border-bottom-left-radius:5px";
    else if (t >0 && l > 0)
        x += ";border-top-left-radius:5px;-webkit-border-top-left-radius:5px;-moz-border-top-left-radius:5px";
    else if (t > 0 && r >= 1)
        x += ";border-top-right-radius:5px;-webkit-border-top-right-radius:5px;-moz-border-top-right-radius:5px";
    else if (l >= 1 && b >= 1)
        x += ";border-bottom-left-radius:5px;-webkit-border-bottom-left-radius:5px;-moz-border-bottom-left-radius:5px";
    else if (b >= 1 && r >= 1)
        x += ";border-bottom-right-radius:5px;-webkit-border-bottom-right-radius:5px;-moz-border-bottom-right-radius:5px";
    
    return x;
} 
document.body.style.backgroundColor = IBGCOLOR;
document.write("<style>td.tblhead{padding-left:4px;padding-right:3px;white-space:nowrap;background-image:linear-gradient(" + BBGCOLOR+','+TBGCOLOR + ")}\n input.human{text-align:right;border:1px red solid;border-radius:2px;color:red;margin:0px 0px 0px 0px;padding:1px 3px 1px 2px}\ninput.gradetxt{background-color:" + TBGCOLOR + ";margin:0px 0px 0px 0px;text-align:right;font-family:courier;border:1px #ddcc99 solid;font-weight:700;width:" + Math.round(font_size*1.5) +"px;padding:1px 3px 1px 2px}");
document.write("div table tr td  table tr td {background-color:#b0b0b}");
document.write("td.s1001{" + borderstyle(1,0,0,1) +"}\n");
document.write("td.s1000{" + borderstyle(1,0,0,0) +"}\n");
document.write("td.s1100{" + borderstyle(1,1,0,0) +"}\n");
document.write("td.s0100{" + borderstyle(0,1,0,0) +"}\n");
document.write("td.s0110{" + borderstyle(0,1,1,0) +"}\n");
document.write("td.s0010{" + borderstyle(0,0,1,0) +"}\n");
document.write("td.s0011{" + borderstyle(0,0,1,1) +"}\n");
document.write("td.s0001{" + borderstyle(0,0,0,1) +"}\n");
document.write("td.s0001{" + borderstyle(0,0,0,1) +"}\n");
document.write("td.s0111{" + borderstyle(0,1,1,1) +"}\n");
document.write("td.s0000{" + borderstyle(0,0,0,0) +"}\n</style>");
var dropnum = new Array();
var formulaa = new Array();
function cachethis(tx, j)
{
    var key = mat[counter][0] + '_' + mat[counter][1];
    if (j==1)
    {
        dropnum[key] = tx.value.trim();
    }
    else
    {
        formulaa[key] = tx.value.trim();
    }
}
function maybeenter(y, j)
{
    var key = mat[counter][0] + '_' + mat[counter][1];
    if (j==1)
    {
        var x = dropnum[key];
    }
    else
    {
        x = formulaa[key];
    }
    if (x != null)
    {
        return x;
    }
    else
    {
        return y;
    }
}

function openlogall()
{
     postopen('visualwa.jsp',['course','assignname','semester','subdb','normal','questionnum','sessionname'],
                             [mat[counter][0],mat[counter][1],semester,subdb,'true',mat[counter][2], mat[counter][20]],'_blank' );
}
 
function openlog(i)
{
     postopen('visualwa.jsp',['course','assignname','semester','subdb','normal','sid','questionnum','sessionname'],
                             [mat[counter][0],mat[counter][1],semester,subdb,'true',mat[counter][2],i,mat[counter][20]],'_blank' );
}
TestSheet.did = []; 
TestSheet.affect = []; 
           
TestSheet.cacheentered = function(n)
{
       localStorage['grading'+semester + '_' + mat[n][0]  + '_' + mat[n][1] + '_' + mat[n][2]] = 
       JSON.stringify([retrv(n,4), retrv(n,13),retrv(n,7), (''+(new Date()).getTime()).replace(/.....$/,'')]);
  
};
function TestSheet(n,content,assess, sheet, fmt, istest,question, answer, attachat, attachsub, scorebox, subassessbox, purpose)
{
  
    this.count = n;
    this.content = content;
    this.trim = function(assess)
    {
        if (assess==null) assess = '';
        assess = assess.replace(/^;/,'');
        if (isNaN1(assess.replace(/,.*$/,'').replace(/\|/g,'')))
        assess = assess.replace(/[^;]+;/, '');
        assess = assess.replace(/;[ ]*,[ ]*,[ ]*,[ ]*,[ ]*/g,'').replace(/;[ ]*,[ ]*,[ ]*/g,'');
        return assess;
    };
    this.purpose = purpose;
    this.assess = this.trim(assess);
    this.sheet = sheet;
    this.fmt = fmt;
    this.istest = istest;
    this.scorebox = scorebox;
    this.goodformat = true;
    this.subassessbox = subassessbox; 
    this.attachat = attachat;
    this.attachsub = attachsub.replace(/,([0-9]+)@/g, ',100$1@' );
    this.thescorebox = ele(this.count,scorebox);
    this.atd = null;
    this.numismult = 0;
    this.atdtbl = null;
    this.numq = 0;
    this.tablename = null;
    this.complete = (parseFloat(retrv(n,scorebox) + '')!= -2);
    this.question = question;
    
    this.answer = answer;
    if (this.sheet == null)
        this.sheet = '';
    this.formula = "S";
    this.dropn = 0;
    this.header = '';
    this.attachheader = "";
    this.integrity = function(s, t)
    {
        let n = 0;
        if (typeof t === 'number') 
        {
            n = t;
        }
        else
        {
            n = t.length-1;
            for (let j=0; j < t.length; j++)
            {
                let i = parseInt(t[j]);
                if (i > n) n = i;
            }
            if (n < s.length) n = s.length;
        }
        let od = [];
        for (let j=0; j < s.length; j++ ) 
            if (od.indexOf(s[j][4]) < 0) 
               od.push(s[j][4]);
        let q = [];
        for (let j = 1; j <=  n; j++)  
           if (od.indexOf('' + j) < 0) q.push(''+j);
        let i =0;
        while(true)
        {
            if ( (i < s.length && s[i] !== null && s[i][0] !== '' + (i+1)) || (s[i] ===null|| typeof s[i] === 'undefined'))
            {
                s.splice(i, 0, [''+(i+1), '', '0',  '0', ''+ q.pop(), '-1']);
            }
            i++;
            if ( i === n ) break;
        }
    };
    this.integritys = function(s,n)
    {
        let i =0;
        let w =  (new CSVParse((mat[0][14].replace(/^[^;]+;/,'') +';').replace(/,[^;]*;/,',0,| |;')+this.numq +','+ this.dropn + ",0," + this.formula + ",,0,||", '|', ',', ';')).nextMatrix();
        while(true)
        {
            if ( (i < s.length && s[i] !== null && s[i][0] !== '' + (i+1)) || (s[i] ===null|| typeof s[i] === 'undefined'))
            {
                s.splice(i, 0, w[i]);
            }
            i++;
            if ( i === n ) break;
        }
    };
    this.showwhole = function(n)
    {
        document.getElementById('showerr').innerHTML = retrv(n, 13).replace(/;/g,'<br>');
    };
    this.propagate = function()
    {
        let affected =[];
        let dn = parseInt(document.form1.dropn.value);
        if (''+ dn!=='NaN')  this.dropn = dn;
        try{
           let fs = document.form1.formula.value;
           eval(fs.replace(/S/g,'1').replace(/T/g,'1').replace(/Q/g,'10'));
           this.formula = fs;
        }catch(e1){}
        let oldsum = 0, oldcount = 0, nowsum = 0, nowcount = 0, nn=0, nr=0;
        for (var n = 0; n < numRows; n++)
        {
            if (mat[n][1] !== mat[this.count][1] || mat[n][0] !== mat[this.count][0] || mat[n][20] !== mat[this.count][20])
                continue;
            if (valuechanged[n] === false) continue;
            let graded = mat[n][4];
            let assess = retrv(n, 13);
           
            if (assess === null || assess === '')
            {
                continue;
            }
             
            
            nn++;
            let oldscore = parseFloat(mat[n][4]);
            if (oldscore + '' !== 'NaN' && oldscore>=0)
            {
               oldsum += oldscore;oldcount++;
            }
            let tt = (new CSVParse(assess, "|", ",", ";")).nextMatrix(true);
            let qq = (new CSVParse(this.assess, "|", ",", ";")).nextMatrix(true);
            
            let tarr = [];
            let ss = 0;
            let err = '';
            for (let k=0; k < this.numq; k++)
            {
                if (tt[k] != null &&qq[k]!=null ) tt[k][1] = qq[k][1];
                if (tt[k] === null || tt[k][1] === '')
                {
                    tt[k] = [ this.atd[k][0], this.atd[k][2], '0',''];
                }
                if (tt[k].length > 2 && tt[k].length <5 ) 
                {
                    let t2 = this.eval1(tt[k][2],tt[k][1]);
                    let t1 =  parseFloat(tt[k][1]);
                     
                    if (tt[k][2].replace(/\./g,'').replace(/\+/g,'').replace(/[0-9]/g,'').replace(/\s/g,'') !== '')
                    {
                            err += tt[k][0] + '&nbsp;' + tt[k][1] + '&nbsp;' + tt[k][2] +'&nbsp;' + tt[k][3] +';';
                            tarr.push(t1);
                            tt[k][2] =t1;
                            ss += t1;
                    }
                    else 
                    {
                        tarr.push(t2);
                        ss += t2;
                    }
                }
                else
                    tarr.push(parseFloat(tt[k][1]));
                    
            }
            console.log("tarr.size=" + tarr.length + ", size=" + this.numq);
            tarr.sort(function(a,b){return a-b;});
            var S = 0;
            for (var jj = this.dropn ; tarr[jj]!=null ; jj++)
            {   
                if (typeof tarr[jj] != 'number')
                    alert(tarr[jj] + ' is NaN');
                S += tarr[jj];
            }
            
            let sum = 0;
            var fomu1 = this.formula.replace(/S/g, '' + S).replace(/Q/g, '' + tarr.length ).replace(/\s/g, '');
            let T = '0';
            if (tt[tt.length-1].length > 4 && tt[tt.length-1][4]!=null && !isNaN1(tt[tt.length-1][4]))
            {    
                T = tt[tt.length-1][4];
                fomu1 = fomu1.replace(/T/g, T);
            }
            let M = this.evalhat(fomu1);
            console.log(fomu1 + ' --> ' + M);
            if (isNaN1(''+M)) M = S;
            if (err==='')
            {
                nowcount++;
                nowsum += M;
            }
            
           tt[this.numq] = [this.numq, this.dropn,''+ss, this.formula, ''+T,''+S,tt[tt.length-1][6]];
           let str = '';
           let i=0;
           for (; i <  this.numq; i++)
           {
               str += tt[i][0] + ',' + tt[i][1] + ',' + tt[i][2] + ',';
               if (tt[i][3]!=null && (tt[i][3].includes(',') || tt[i][3].includes(';') || tt[i][3].includes('\n')))
                   str += '|'+ tt[i][3] + '|;'
               else if (tt[i][3]!=null && tt[i][3]!='')
                   str += tt[i][3] + ';';
               else
                   str += ';';
           }
           for(let j=0; j < 6; j++)
           {
               str += tt[i][j] + ',';
           }
           if (tt[i][6]!=null && (tt[i][6].includes(',') || tt[i][6].includes(';') || tt[i][6].includes('\n')))
               str += '|'+ tt[i][6] + '|';
           else if (tt[i][6]!=null && tt[i][6]!='')
               str += tt[i][6] ;
           setv(n, 13, str);
           holdvalues[n+'_13'] = str;
          
           let mn = M.toFixed(1).replace(/([0-9])\.[0]+$/,'$1').replace(/^[0]*\.[0]*$/,'0');
           setv(n, 4, mn);
           let cv = '<tr style=background-color:'+TBGCOLOR+'><td align=center><input type=checkbox onclick="javascript:valuechanged[' + n + '] =this.checked" ' + (err==''?'checked':'') + ' ></td><td><a href=javascript:populate('+ n + ')>' +  mat[n][2] + '</a></td><td><a href=javascript:parent.frames[1].populate('+n + ')><nobr>' +  mat[n][10] + '</nobr></a></td>' 
                  +'<td align=right style=color:#777 > ' + (graded < 0? '':(''+graded)) + '</td><td align=right> ' +  mn + '</td><td style=color:blue onclick=testsheet.showwhole(' + n + ')>' + err + '</td></tr>';
           affected.push(cv);
           valuechanged[n] = (err ==='');
           if (err !=='') nr++;
           this.cacheentered(n);
        }
        
        if (affected.length>1 && affected.length < 30)
        {
            let ht =  '<tr><td class=tblhead align=center></td><td class=tblhead>' + labels[2] + '</td><td class=tblhead>' + labels[10] + '</td><td class=tblhead align=center colspan=2>' 
                     + labels[4] + '</td><td class=tblhead >' + textmsg[1358] + '</td></tr>';
            let tb = "<table cellpadding=4 width=100% border=1 style=\"border-collapse:collapse;border-color:#ddcc99;\">" 
            + ht;
            for (let j=0; j < affected.length; j++)
              tb+= affected[j];
            tb += '<tr style=background-color:lightyellow ><td colspan=3 align=center >' + nn + '</td><td  align=right>' 
            + (oldcount===0?'':(''+ (oldsum/oldcount).toFixed(1))) + '</td><td  align=right>' 
            + (nowcount===0?'':(''+ (nowsum/nowcount).toFixed(1))) + '</td><td>' + nr + '</td></tr>'
            + "</table><div id=showerr></div>";
            myprompt(tb, null, 'if(v)setaction(1)', mat[this.count][0] +'-' + mat[this.count][20] + ': ' + mat[this.count][1]);
        }
        else if (affected.length>=30)
        {
            let ht =  '<tr><td class=tblhead align=center></td><td class=tblhead>' + labels[2] + '</td><td class=tblhead>' + labels[10] + '</td><td class=tblhead colspan=2>' 
                     + labels[4] + '</td><td class=tblhead >' + textmsg[1358] + '</td></tr>';
            let tb = "<table cellpadding=4 width=100% border=1 style=\"border-collapse:collapse;border-color:#ddcc99;\">" 
                  + ht.replace(/<.tr>$/,'<td width=2 rowspan=' + (2 + ~~(affected.length/2) ) + '>') 
                  + ht.replace(/^<tr>/,'');
            let h = ~~((1+affected.length)/2);
            for (let j=0; j < h; j++)
            {
                tb += affected[j].replace(/<.tr>$/,'');
                if (h+j < affected.length && affected[h+j]!=null ) tb += affected[h+j].replace(/^<tr[^>]+>/,'') +'\n';
            }
            let tl =  '<tr style=background-color:lightyellow ><td colspan=3 align=center >' + nn + '</td><td  align=right>' 
            + (oldcount===0?'':(''+ (oldsum/oldcount).toFixed(1))) + '</td><td  align=right>' 
            + (nowcount===0?'':(''+ (nowsum/nowcount).toFixed(1))) + '</td><td>' + nr + '</td></tr>';
            if (affected.length%2==0)
                tb += tl.replace(/colspan=3/,'colspan=10')  + "</table><div id=showerr></div>";
            else
                tb += tl.replace(/^<tr[^>]+>/,'') + '</table><div id=showerr></div>';
            myprompt(tb, null, 'if(v)setaction(1)', mat[this.count][0] +'-' + mat[this.count][20] + ': ' + mat[this.count][1]);
        }
        else setaction(1);
    };
 
    
    this.hw = null;
    this.toarray = function(str, q, x, y)
    {
        var p = new CSVParse(str.trim().replace(/^[0-9][0-9][0-9][0-9]*\n/,''), q, x, y);
        return p.nextMatrix(true);
    };
    this.blanktail = function(i)
    {
        let j = 0; let v = ''; let xx; 
        while ( ( xx = document.getElementById('h' + i + '_' + j))!==null)
        {
            v += '+' + xx.value;
            j++;
        }
         
        return  v.replace(/^\+/,'');
    };
    this.distinct = (parent.frames.length === 2 && parent.frames[0].ele && (parent.frames[0].ele(0,4).value === '' && parent.frames[0].ele(0,5).value === ''));
    if (!this.distinct)
    {
        let btnd = document.getElementById('distinctbtn');
        if (btnd !== null)
        {
            btnd.style.background = 'url() #aaaaaa';
            btnd.onclick = function(){myprompt('This function is available for multiple student\'s submissions  to  a specific assignment/test item. Remove entries in Student Id and Name to Select again');};
        }
    }
    this.scorematrix = [];
    this.multiplechoice = [];
    this.arrtoString = function(q, x, y)
    {
        if (typeof(tojson) == 'function')
            tojson();
        
        var str = '';
        if (this.atd == null || this.atd[0] == null) 
        {
            this.numq = 0;
            return '1,0,'+ retrv(this.count,4) + ",S,0," + retrv(this.count,4) + ",No question.Any Attchment?";
        }
        for (var i = 0; i <  this.atd.length  && this.atd[i]!=null && this.atd[i].length == 11; i++)
        {
            if (this.atd[i][10] == null) this.atd[i][10] = '';
            let b = this.blanktail(i);
            if (b == '') b = this.atd[i][3];
            str += this.atd[i][0] + "," + this.atd[i][2] + "," + b + ",";
            if (this.atd[i][10].indexOf(",") >=0 || this.atd[i][10].indexOf(";") >=0 || this.atd[i][10].indexOf("|") >=0)
                str += "|" + this.atd[i][10].replace(/\|/g, '||')+ "|";
            else
                str += this.atd[i][10]  ;
            str +=";";
        }
        var X = this.atd[this.atd.length-1];
        if (X == null)
            return str.replace(/;$/,'');
        var N = X.length - 1;
        if (N < 6) return str + this.atd.length + ',0,'+ retrv(this.count,4) + ",S,0," + retrv(this.count,4) + ",";
        for (var i = 0; i < 6; i++)
            str += X[i] + ",";
       
        return str +  "|" + X[6] + "|";
    }
    this.p = new CSVParse("", "'", ",", "\r\n");
    
    this.ungrade = function()
    {
        setv(this.count,this.scorebox, "-2");
    }
    this.currentcommenting = -1;
    this.map2 = function()
    {
        
    }
    this.updateatd = function(txt, i, j)
    {
        if (j == 10)
        {
            onlinetoolbar();
            checkHTML(txt);
            var edt  = txt.value.replace(/^[ ]+/, '').replace(/[ ]+$/,'');
            var gs = guessFormat(edt);
            this.atd[i][10] = edt;
            var p = txt.parentNode;
            if (p.tagName.toLowerCase()!='td') p = p.parentNode;
            p.style.padding = "4px 4px 4px 4px";
            this.hw.divs = '';
            this.hw.attachheader = '';
            var updateattach = retrv(this.count,7);
            if (fields[7].indexOf('Attach')!=0)
                updateattach = retrv(this.count,11);
             
            this.attachsub = updateattach.replace(/,([0-9]+)@/g, ',100$1@' );
            this.hw.parseAttach(this.attachsub);
            
            var sid = document.getElementById('style1_' + this.count);
            if (sid==null)
            {
                sid = document.createElement('style');
                sid.id = 'style1_' + this.count;
                sid.type = 'text/css';
                //document.getElementsByTagName('head')[0].appendChild(sid);
                var list = document.body;
                list.insertBefore(sid, list.childNodes[0]); 
            }
            sid.innerHTML = this.hw.divs;
             
            if (  gs == 1)
            {
                p.innerHTML =  addbreak1(  this.hw.merge(formatstr(addbreak(edt,1),1)).replace(/imagelet([0-9]+)/g, 'imagelet100$1'));
            }
            else if (  gs == 0)
            {
                p.innerHTML  = addbreak1(  this.hw.merge(formatstr(addbreak(edt,1),0)).replace(/imagelet([0-9]+)/g, 'imagelet100$1'));   
            }
            else if (  gs == 2)
            {
                 p.innerHTML = addbreak1(  this.hw.merge(formatstr(addbreak(edt,1),2)).replace(/imagelet([0-9]+)/g, 'imagelet100$1'));  
                 displaylatex(p);
            }
            
            valuechanged[this.count] = true;
            let dv = document.getElementById('comments' + i); 
            dv.onclick = function(){testsheet.goedit(this.id.substring(8));} ;
            this.currentcommenting = -1;
            dv.style.color = "red";
            LaTexHTML.reformat(dv);
            dv = document.getElementById('commentbut' + i);
            dv.innerHTML = '<a href="javascript:testsheet.goedit(' + i + ')">&#9998;</a>';
            return;
        }
        else if (j == 3 && i < this.numq)
        {
            var td = txt.parentNode;
            var tr = td.parentNode;
            
            var tb = tr.parentNode;
            if (tb.tagName.toLowerCase() != 'table')
                tb = tb.parentNode;
            var k = 0;
            for (; k < tb.rows.length; k++)
            {
                if (tb.rows[k] == tr) break;
            }
            var tt = tb.rows[k];
            if (tt.cells.length > 3)
            {
                tt = tt.cells[3];
                var fullscore = tt.getElementsByTagName('input')[0].value;
                if (txt.value == fullscore)
                {
                    tb.rows[k-1].cells[1].innerHTML = "<span style=\"color:green;font-size:24px\">&check;</span>";
                }
                else if (txt.value == '0')
                {
                    tb.rows[k-1].cells[1].innerHTML = "<span style=\"color:red;font-size:24px\">&cross;</span>";
                }
                else
                {
                    tb.rows[k-1].cells[1].innerHTML = "<span style=\"color:green;font-size:24px\">&check;</span><span style=\"margin:0px 0px 0px -12px;color:red;font-size:24px;font-weight:700\">&bsol;</span>";;
                }
            }
            else
            {
                tt = tt.cells[2];
                if (isNaN1(txt.value) || parseFloat(tt.value) < parseFloat(txt.value))
                {
                    txt.focus();
                    return;
                }
                
            }
             
        }
        else if (j == 2 && i < this.numq)
        {
            var dif = parseInt(txt.value.replace(/ /g, '')) - parseInt(this.atd[i][2]);
            if (''+dif == 'NaN') 
            {
                txt.focus();
                txt.value = this.atd[i][2];
            }
            else
            {
                this.atd[this.numq][2] = '' + (parseInt(this.atd[this.numq][2]) + dif);
                if (document.getElementById('sumptr')!=null) 
                    document.getElementById('sumptr').value = this.atd[this.numq][2];
            }
        }
        if (i < this.numq && txt.value.replace(/[ |,|0-9|\\.]/g, '') != '' && j < 10)
        {
            myprompt("Invalid entry");
            return;
        }
        if(i < this.atd.length)
        this.atd[i][j] = txt.value.replace(/ /g, '');
         
        if (i == this.numq)
        {
           if (this.numq<this.atd)
           {
               this.formula = this.atd[this.numq][3];
               if (this.formula == null)
                   this.formula = 'S';
               this.dropn   = this.atd[this.numq][1];
               uniformula[retrv(this.count,0)+'_' + retrv(this.count,1)] = this.dropn + "|" + this.formula;
           }
           else
           {
               if (j==1)
               {
                    this.dropn   = txt.value;
               }
               else if (j == 3 && txt.value!=textmsg[225])
               {
                   this.formula = txt.value;
                   if (this.formula==null || this.formula == '') 
                       this.formula = 'S';
               }
               this.normalize();
               valuechanged[this.count] = true;
               uniformula[retrv(this.count,0)+'_' + retrv(this.count,1)] = this.dropn + "|" + this.formula;
               return;
           }
        }
        if (i == this.numq || j == 2 && this.atd[0].length==3 || j==3 && this.atd[0].length>3)
        {
            this.normalize();
        }
        valuechanged[this.count] = true;
        if (j == 6)
        {
            var bb = true;
            let ans;
            if ( txt.selectedIndex == 4)
            {
                bb = false;
                //ans = formatstr(this.atd[i][8].replace(/\t/g,'   '), this.atd[i][6]);
            }
            else 
            {
               this.atd[i][6] = '' + txt.selectedIndex;
               //ans = formatstr(this.atd[i][8], this.atd[i][6]);
            }
            ans = this.formatSubmitted(i);
            var td = txt.parentNode;
            var cel = td.previousElementSibling;
            cel.innerHTML = ans;
            var sol = this.toarray(this.content, "'", ",", "\r\n"); 
            if (bb) 
            {
                sol[i][3] = this.atd[i][6];
            }
            else 
            {   
                this.atd[i][6] = sol[i][3];
                sol[i][1] = this.atd[i][8];
            }
            this.content = '';
            for (var k=0; k < sol.length; k++)
            {
               for (var l=0; l < sol[k].length; l++)
               {
                   if (l == 1 )
                   {
                      if (sol[k][1].indexOf(",")>=0 || sol[k][1].indexOf("\n")>=0 || sol[k][1].indexOf("\r")>=0)
                         this.content += "'" + sol[k][1].replace(/'/g, "''") + "',"; 
                      else 
                         this.content +=  sol[k][1]  + ","; 
                   }
                   else if ( l < sol[k].length-1)
                   {
                       this.content += sol[k][l] + ",";  
                   }
                   else if ( k < sol.length-1)
                   {
                       this.content += sol[k][l] + "\n"; 
                   }
               }   
            }
            setv(this.count,6, this.content);
            
            txt.selectedIndex = parseInt(this.atd[i][6]); 
           
        }
    };
    this.lscores = new Array();
    this.makeenter = function(i,j,v)
    {
        let key = this.count + '_' + i + '_' + j;
        let ck = TestSheet.did[key]===1? 0 : 255;
        let c1 = 'rgb(' + ck + ',0,0)';
        if (ck === 0) c1 = '#bbbb99';
         return '<input name=fh' + i + '_' + j + ' id=h' + i + '_' + j + ' size=5 onfocus="javascript:this.select();"   value="' + (''+parseFloat(v).toFixed(2)).replace(/([0-9])\.[0]+$/,'$1').replace(/^[0]*\.[0]*$/,'0').replace(/(\.[0-9])0$/,'$1') + '" class=human  style="margin:0px 0px 0px 0px;padding:1px 3px 1px 2px;border-color:' + c1 +';color:rgb(' + ck + ',0,0)"  onblur="testsheet.markdid(this,' + i + ',' + j + ');testsheet.sumup(this)">';
    };
    this.enterrecord = function(evt, i, j)
    {
         var e = evt? evt : window.event;
         if(!e) return true;
         var key = 0;
         if (e.keyCode)
         {
             key = e.keyCode;
         }  
         else if (typeof(e.which)!== 'undefined')
         {
             key = e.which;
         }
          
         return key === 46 || key >=48 && key <=57;
    };
  
    this.makelscore = function(i)
    {
         if (!this.atd[i][7].includes('____')) return '';
         var submitted = this.atd[i][8];
        if (submitted==null || submitted.length == 0 || submitted == textmsg[1865])
        {
            //this.lscores[i] = 0;
            //return '';
            submitted = this.atd[i][9].replace(/[^\n]/g,'');
        }
        let hums = this.scorematrix[i];
        
        var originalanswer = this.atd[i][9];
        var scale = parseFloat(this.atd[i][2]);
        var rfmt = ( this.atd[i][6] !=''? this.atd[i][6] : this,fmt);
        let lscore = 0;
        let oarr = originalanswer.split(/[\n|\r| ]+why:/)[0].replace(/\n/g, ' \n').split(/\n/);
        for (let j = 0; j < oarr.length; j++)
        {
            oarr[j] = oarr[j].replace(/^[ ]+/, '').replace(/[ ]+$/, '');
        }
        var ys = textmsg[1937].split(/@/);
        let s = '<table style=border-collapse:collapse;border-color:#cccc88; border=1  cellpadding=4><tr  ><td style="background-image:linear-gradient('+ BBGCOLOR +',' + TBGCOLOR+');color:black">' + textmsg[1629] + '</td><td  style="background-image:linear-gradient('+ BBGCOLOR +',' + TBGCOLOR+');color:black">' + textmsg[457] + '</td><td  style="background-image:linear-gradient('+ BBGCOLOR +',' + TBGCOLOR+');color:black"  align=center>' + textmsg[1943].split(/@/)[5] + '</td>';
        if (this.distinct) s += '<td  style="background-image:linear-gradient('+ BBGCOLOR +',' + TBGCOLOR+');color:black" >' + textmsg[1943].split(/@/)[8] + '</td>';
        s += '</tr>';
        let arr = null;
        if (submitted.includes('<br>')) arr = submitted.replace(/<br>$/,'').split(/<br>/);
        else arr = submitted.replace(/\n/g, ' \n').split(/\n/);
        let sm = 0;
        
        for (let j = 0; j < this.scorematrix[i].length; j++)
        {
            let v = 0;
            if (hums[j]!=null && hums[j]!=='' && !isNaN1(hums[j]) )
            {
                v = parseFloat(hums[j]);
            }
            else if (arr[j] != null && (arr[j] = arr[j].replace(/^[ ]+/, '').replace(/[ ]+$/, '')) != '' ) 
            {
                if (oarr[j] == null || (oarr[j] = oarr[j].replace(/^[ ]+/, '').replace(/[ ]+$/, '')) === '')
                {
                    v = 1;
                    sm += v;
                }
                else
                {
                    let tmp = similarnum(arr[j], oarr[j]);
                    if (tmp <= 1)
                        v = tmp;
                    else {
                    try {
                        if (oarr[j] != null && oarr[j].length > 0)
                            v = similarity(arr[j], oarr[j]) / oarr[j].length;
                    } catch (e) {
                    }
                    if (v > 1)
                        v = 1;
                    v = Math.pow(1 - v, 2 / 3.0);
                    if (v > 0.9 && oarr[j]!=null && arr[j]!=null && arr[j]!='' && oarr[j].length < 25 && isNaN1(oarr[j])) v = 1;
                    }
                    sm += v;
                }
                v = (v*this.atd[i][2]/this.scorematrix[i].length).toFixed(1);
                this.scorematrix[i][j] = hums[j] = v;
               // console.log(arr[j] + '===' +  oarr[j] + '=====' + v);
            } 
            else
            {   
                arr[j] = ''; this.scorematrix[i][j] = '0';
            }
            let p1 = '', p2 = '';
            if (j < arr.length && arr[j]!=null)
            {
                if (''+rfmt === '0' || ''+ rfmt === '2')
                {
                   arr[j] = arr[j].replace(/<([a-z])/ig,'< $1');
                }
                p1 = formatstr(arr[j],rfmt);
            }
            if (j < oarr.length && oarr[j]!=null)
            {
                if (''+this.fmt === '0' || ''+this.fmt === '2')
                {
                   oarr[j] = oarr[j].replace(/<([a-z])/ig,'< $1');
                }
                p2 = formatstr(oarr[j],this.fmt);
            }
            s += '<tr bgcolor=' +TBGCOLOR +'><td valign=top style="white-space:nowrap;color:purple">' + p1 + '</td><td  style="color:green">' + p2 + "</td><td  align=right style=\"padding:2px 2px 2px 2px\">" + this.makeenter(i,j,v) + "</td>";
            if (this.distinct)
                s += "<td   bgcolor=" +TBGCOLOR + "  align=center valign=top style=color:blue onclick=testsheet.byanswer(" + i + "," + j + ")> " + textmsg[1943].split(/@/)[0] + " </td>";
            s += "</tr>\n";
        }
        sm /= arr.length;
        lscore = Math.round(sm * scale*10)/10;
        if (scale == 1 && lscore>0.5) lscore = 1;
        this.lscores[i] = lscore;
        //s += "<tr><td colspan=3 bgcolor=lightyellow align=center style=color:blue  onclick=\"testsheet.transfer(this,"+i+")\" >&darr;</td></tr>";
        s += "</table>";
        return s;

    };
    this.updateddistinct = true;
    this.holdmyanswer = '';
    this.convert2 = function(a,j) 
    {
       if (a == null || a == '') return '';
       if (j === -2)
       {
          a = a.replace(/^[ ]+/,'');
          if (a.length === 0) return '';
          return  a.replace(/^[ ]+/,'').charAt(0).toLowerCase(); 
       }
      // try{
       a = a.toLowerCase().replace(/^[ ]+/,'').replace(/[ ]+$/,'');
       let s = {'half':2,'third':3, 'fourth':4,'fifth':5, 'sixth':6, 'seventh':7, 'eighth':8, 'ninth':9, 'tenth':10, 'eleventh':11, 'twelfth':12};
       let b = s[a];
       if (b != null) return '1/' + b;
       if (a.replace(/[,|\.|0-9]/g,'') === '' )
       {
           return a.replace(/,/g,'');
       }
       let a1=a;
       if (a.includes('$') || a.includes('\\frac')) 
       {
           a1 = a.replace(/\$/g, '').replace(/([\^|_])([0-9|a-z|A-Z])/g, '$1{$2}'); 
           return this.trimlatex(this.toover(a1)).replace(/ /g,'');
       }
       return a.replace(/ /g,'');
      // }catch(e){ alert(e.toString()); return a;}
    };
    
    this.thesame = function(a,b)
    {
        let a1 = a.replace(/[0-9|\.|\/]/g,'') ;
        if (a1=== ''  && b.replace(/[0-9|\.|\/]/g,'') ==='' && a!=='' && b!== null)
        {
            if ((a.indexOf('.') >= 0 || b.indexOf('.') >= 0) && (a.indexOf(b) === 0 || b.indexOf(a) === 0))
               return true;
            return (eval(a.replace(/,/g,'')) === eval(b.replace(/,/g,'')));
        }
        return a === b;
    };
    this.fracpair = function(x)
    {
        let k = x.indexOf('\\frac');
        if (k === -1) return null;
        let i = x.indexOf('{',k+4),j;
        let count = 1;
        if (i ===-1) return null;
        let f = x.substring(0,k);
        for (j = i+1; j < x.length; j++)
            if (x.charAt(j) === '{') count++;
            else if (x.charAt(j) === '}') { count--; if (count === 0) break;}
        if (j === x.length || x.charAt(j) != '}') return null;    
        let nu = x.substring(i+1,j);
        while ( j <   x.length && (x.charAt(j) === ' '|| x.charAt(j) === '\t' || x.charAt(j) === '\n'))j++;
        if (j === x.length || x.charAt(j) != '{') return null;
        i = j;
        count = 1;
        for (j = i+1; j < x.length; j++)
            if (x.charAt(j) === '{') count++;
            else if (x.charAt(j) === '}') { count--; if (count === 0) break;}
        if (j === x.length || x.charAt(j) != '{') return null;    
        let de = x.substring(i+1,j);
        let r = '';
        if (j + 1< x.length) r = x.substring(j+1);
        return [f, nu,de,r];
    };
    this.toover = function(x)
    {
        let p4 = this.fracpair(x);
        if (p4 == null) return x; 
        let t = p4[0] + '{' + this.toover(p4[1]) + '\over ' + this.toover(p4[2]) + '}' + this.toover(p4[3]);
        return t;
    };
    this.trimlatex = function(x,p)
    {
        if (p ==  null || typeof p === 'undefined')
        {
            return this.trimlatex(this.trimlatex(x,'_'),'^');
        }
        let i=x.indexOf(p);//, j = x.indexOf('^');
        if (i > 0 && x.charAt(i-1) == '}')
        {
           let j = i-2; let count = 1;
           for (; j >=0; j--)
             if (x.charAt(j) == '}') count++;
             else if (x.charAt(j) == '{') {count--; if (count === 0) break;}
           if (j === -1) return x;
           let r = '';
           if (j > 0) r = x.substring(0,j);
           return  r + this.trimlatex(x.substring(j+1,i-1)) + this.trimlatex(x.substring(i));
        }
       return x;
    };
    this.editcap = function(i,j,u)
    {
        let v = (''+u).replace(/\.0$/,'');
        return '<input class=human  type=text id=cap'+i+'_' + j + ' onchange="javascript:testsheet.capvalue=this.value" style=width:40px;margin-left:-3px;text-align:right;margin-top:-2px;margin-bottom:-2px; value="'+ v + '">';
    };
    this.editanswer = function(i,j,v)
    {
        return '<input class=human onblur="testsheet.toblack(this)" type=text id=ans'+i+'_' + j + '  onkeypress="return testsheet.displaytxt2(this,event,' + i + "," + j + ')"   style=width:200px;margin-left:-3px;text-align:left;margin-top:-2px;margin-bottom:-2px; value="'+ v + '">';
    };
    this.correctreference = function(i, j, td)
    {
       let v = this.atd[i][9];
       if (j>=0) v = v.replace(/\n/g,' \n').split(/\n/)[j].replace(/[ ]+$/,'');
       td.previousSibling.innerHTML = this.editanswer(i,j,v); 
       td.nextSibling.nextSibling.innerHTML = this.editcap(i,j,this.capvalue);
       td.style.visibility = 'hidden';
       let t = document.getElementById('ans'+i+'_' + j);
       t.style.width = (td.previousSibling.offsetWidth) + 'px';
       t.style.marginLeft = '-3px';t.style.marginRight = '-3px';
    };
    this.capvalue = 1;
    this.showquestion = function(i,j)
    {
        let qq ;
        if(j>=0 && ( this.fmt =='1' ||  this.fmt=='2'))  
            qq = this.atd[i][7].replace(/@#@,@@,#/g,'\n').replace(/\n/g,'<br>');
        else
            qq = this.atd[i][7].replace(/@#@,@@,#/g,'\n');
         
        qq = formatstr(qq, this.fmt );
        if (j < 0)
        {
            let k = thispagewidth()-6;
            promptwin.style.width = k + 'px';
            document.getElementById('details').style.width = '100%';
            document.getElementById('details').innerHTML =  qq;
        }
        else
        {
            let qs = qq.split(/___[_]*/);
            qs[j] += '<font color=red>';
            qs[j+1] = '</font>' + (qs[j+1]==null?'':qs[j+1]);
            
            document.getElementById('details').innerHTML = '<br>' + qs.join('____');
        }
    };
    this.byanswer = function(i,j)  //i :question num, j = part number
    {
        var rep = {}, fre={}, scr={}, hfmt = {};
        let currentsol,currentscore = 0;
        ans = this.atd[i][9].split(/[\n|\r| ]+why:/)[0];
        if (j>=0)
        {
            let anss = ans.replace(/\n/g,' \n').split(/\n/);
            if (j < anss.length) ans = anss[j];
            else ans = '';
        }
         
        for (let n=0; n < numRows; n++)
        {
            if (mat[n][1] !== mat[this.count][1] || mat[n][0] !== mat[this.count][0] || mat[n][20] !== mat[this.count][20])
                continue;
            let xx = retrv(n,13);
            if (xx == null|| xx === '') xx = mat[n][13];
            let r = (new CSVParse(xx, '|',',',';')).nextMatrix();
            this.integritys(r,this.numq+1);
            let score = 0, sol;
            if (j >= 0)
            {
                sol = r[i][2]; 
                if (sol!=='')
                {
                    let y = sol.replace(/\+/g,' +').split(/\+/)[j];
                    if  (y!=null && isNaN1(y.replace(/[ ]+$/,'')) === false)
                        score = parseFloat(y.replace(/[ ]+$/,''));
                }
            }
            else if (r[i]!=null)
            {
                if (r[i][2]!=null) r[i][2] = r[i][2].replace(/ /g,'');
                if (  isNaN1(r[i][2]) === false )
                   score = parseFloat(r[i][2]);
               else
                   score = 0;
                //else console.log("n=" + i + ", " + r[i][0] + r[i][1] + r[i][2] + mat[i][2] + mat[i][10]);
            }
            r = (new CSVParse(mat[n][6].trim().replace(/^[0-9][0-9][0-9][0-9]*\n/,''), '\'',',','\n')).nextMatrix();
            this.integrity(r,this.numq);
            sol = j < 0?r[i][1]:r[i][1].replace(/\n/g,' \n').split(/\n/)[j];
            if (j === -2 && ans.length===1 && ans.toLowerCase() === sol.replace(/ .*$/,'').toLowerCase() &&  sol.length > 2 )
                ans = sol;
            if (sol == null) sol = '';
            else sol = sol.replace(/[ ]+$/,'');
            let sol1 =  this.convert2(sol,j);
            let hj = rep[sol1];
            if (hj ===  'undefined' || hj ==  null)
            {
                let keys = Object.keys(rep);
                for (let key of keys)
                {
                    if (this.thesame(key,sol1))
                    {
                        hj =  rep[key]; 
                        sol1 = key;
                        break;
                    }
                }
            }
            if (hj ===  'undefined' || hj ==  null)
            {
                rep[sol1] = sol;
                fre[sol1] = [n];
                scr[sol1] = [score];
                hfmt[sol1] = [j===-2?this.fmt:r[i][3]];
                if (n === this.count)
                {
                     let xx;  
                    if (j >= 0)
                    {   
                        xx = document.getElementById('h'+i + '_' + j).value;
                    }
                    else
                    {
                        xx = formselementbyname(document.form3?document.form3:document.form1, 'scorebox' + i).value;
                    }
                    if (xx!==null && (xx=xx.replace(/ /g,''))!=='' && !isNaN1(xx)) 
                        currentscore = parseFloat(xx);
                    currentsol = sol1; 
                 }
            }
            else
            {
                fre[sol1].push(n);
                scr[sol1].push(score);
                hfmt[sol1].push(j===-2?this.fmt:r[i][3]);
            }
            
        }
        let str ='';
        let s = Object.keys(rep);
        for (let a=0; a < s.length; a++)
            s[a] = fre[s[a]].length + " " + s[a];
        s.sort(function(x,y){let g = parseInt(y.replace(/ .*$/,'')) - parseInt(x.replace(/ .*$/,'')); if (g!==0) return g;  if (y.replace(/[0-9]+[ |\r|\t|\n]+/,'')===''){return -1;} if (x.replace(/[0-9]+[ |\r|\t|\n]+/,'')===''){return 1;} return y<x?1:-1;});
        
        for (let a=0; a < s.length; a++)
            s[a] = s[a].replace(/^[0-9]+ /,'');
        let words = textmsg[1943].split(/@/);
        if (ans ==null || ans === null) ans ='';else ans = ans.trim();
        str += '<Table cellspacing=0 border=0><tr><td valign=top ><table border=1 id=distincttbl style=border-color:#ddcc99;border-collapse:collapse cellpadding=4 >';
        let numOfparts = (' '+this.atd[i][7] + ' ').split(/___[_]*/).length - 1;
        this.capvalue = parseFloat(this.atd[i][2]); let va = 0;
        if (numOfparts>1) 
        {
            this.capvalue = Math.ceil(this.capvalue/numOfparts*10)/10;
            //va = parseFloat(this.atd[i][2]) / numOfparts;
        }
        str += '<tr style=height:0%><td style=color:green;border-top-color:transparent;border-left-color:transparent;border-right-color:transparent id=mystandard>' 
                +  (ans.length>0?this.formatans(ans,this.fmt,j>=0):this.editanswer(i,j,rep[s[0]])) 
                +'</td><td align=center style=color:blue;font-size:'+ (font_size-2) +'px;border-top-color:transparent;border-left-color:transparent;border-right-color:transparent;visibility:' + ((ans !== null && ans !=='')?'visible':'hidden') +' onclick=testsheet.correctreference('+i+','+j +',this)   >&#9998;</td><td style=border-top-color:transparent;border-left-color:transparent;border-right-color:transparent;white-space:nowrap  align=right>'+ textmsg[1760]+ ':</td><td align=center style=border-top-color:transparent;border-left-color:transparent;border-right-color:transparent;white-space:nowrap>' 
                  +  (ans.length>0?(this.atd[i][2] + (numOfparts<=1?'':('/'+numOfparts +' = ' + this.capvalue.toFixed(1)))):this.editcap(i,j,this.capvalue))  + '</td><td colspan=1 style=white-space:nowrap;border-top-color:transparent;border-left-color:transparent;border-right-color:transparent;text-align:right;color:blue onclick="testsheet.showquestion(' + i +',' + j +')" >  ' + textmsg[178] + '</td></tr>';
        str += '<tr   style=height:0% ><td  style="background-image:linear-gradient('+ BBGCOLOR +',' + TBGCOLOR+')"><nobr>' 
                + words[8] + '</nobr></td><td  style="background-image:linear-gradient('+ BBGCOLOR +',' + TBGCOLOR+')" align=center colspan=2>' + textmsg[1790] + '</td><td  style="background-image:linear-gradient('+ BBGCOLOR +',' + TBGCOLOR+')" align=center>' + words[5] + '</td><td  style="background-image:linear-gradient('+ BBGCOLOR +',' + TBGCOLOR+')"  align=center>' + words[6] + '</td></tr>';
        let n = 0, nr = 0;
        this.temp = []; let ts = 0;
        let hit = false;
        let ans0 = j===-2? ans.replace(/ .*$/g,'').toLowerCase() : ans.replace(/ /g,'').toLowerCase();
        let mx = 0;
        
        for (let y of s)
        {
            let su =   currentscore ;
            if( currentsol !== y) su = this.mode(scr[y]); 
            let dif = this.diff(scr[y]); 
            let ans = rep[y].replace(/^[ ]+/,'').replace(/[ ]+$/,'');
            nr += scr[y].length; 
            ts += scr[y].length*su;
            this.temp.push(fre[y]);
            let good = this.thesame(ans0,y);
            if (good) 
            {
                su = (Math.ceil(this.capvalue*10)/10);
            }
            if (hit===false && good) hit = true;
            if (ans==='') su = 0;
            else 
            {
                let lx = ans.length;
                if (lx > mx) mx = lx;
            }
            str += '<tr  ><td  valign=top  style=background-color:' + TBGCOLOR+';color:purple>' + (ans===''?('<font color=red>' + textmsg[1865] + '</font>'):this.formatDistinct(ans,hfmt[y])) + '</td><td valign=top align=right   style=background-color:' + TBGCOLOR+';padding-top:5px ><nobr>'
                    +   (good?'<span style=color:green>&check;  </span>':' ')  
                    + scr[y].length + '</nobr></td><td  valign=top align=right style=background-color:' + TBGCOLOR+';padding-top:5px >' + (100*scr[y].length/numRows).toFixed(0) +  '%</td><td  valign=top align=center style="background-color:' + (dif===0?TBGCOLOR:BBGCOLOR)+';padding:3px 3px 3px 3px"><input onkeypress="return testsheet.displaytxt1(this,event,' + i + "," + j + ')" class=human size=4 id=e' 
                    +  n + " value=\""+ (''+su).replace(/([0-9])\.[0]+$/,'$1').replace(/^[0]*\.[0]*$/,'0').replace(/(\.[0-9])0$/,'$1') + '" onfocus="this.select()" onchange=testsheet.benumeric(this)></td><td align=center  valign=top   style=background-color:' + TBGCOLOR+';color:blue  valign=top ><a  href="javascript:testsheet.distinctCommentg(' + n +',' + i + ");testsheet.activerow("+n+")\">&#9998;</a>&nbsp;&nbsp;&nbsp;<a href=\"javascript:testsheet.whois(" + n +"," + i + ");testsheet.activerow("+n+")\">" +   this.expandsign +  "</a></td>"  
                    + "</tr>";
            n++;   
        } 
        str += "<tr bgcolor=lightyellow style=height:100% ><td align=right valign=top >" + (n) + "</td><td align=right  valign=top ><nobr>" +  (hit?'':'<span style=color:red>&cross;  </span>' )
                    + nr + "</nobr></td><td  valign=top >100%</td><td colspan=2  valign=top ><nobr><span onclick=testsheet.doavg(this) id=doavg style=color:black align=right>" + words[7] + "  </span><span>" + (''+(ts/nr).toFixed(2)).replace(/([0-9])\.[0]+$/,'$1').replace(/^[0]*\.[0]*$/,'0').replace(/(\.[0-9])0$/,'$1') + "</span></nobr></td></tr>";
        str += "<tr style=height:0% ><td colspan=5 align=center style=border-color:transparent>"
        + "<table cellpadding=3><tr><td width=60% ></td><td width=0%><input type=button class=OrangeButton style=width:78px; value=\"" + textmsg[225] + "\" onclick=testsheet.spread(" + i + "," + j +")></td></td><td width=0% ><input  type=button class=GreenButton style=width:78px value=\"" + textmsg[67] + "\" onclick=\"testsheet.spread(" + i + "," + j +");testsheet.savedistinct()\"></td><td width=0% ><input  type=button class=OrangeButton style=width:78px value=\"" + textmsg[18] + "\" onclick=closeprompt()></td><td width=0% ><span style=float:right;color:purplewidth:40px id=numupdated></span></td><td width=0% ><input  type=button class=GreenButton  value=\" &nbsp;<&nbsp; \" onclick=\"testsheet.previousone(" + i + "," + j +")\"></td><td  width=0% ><input  type=button class=GreenButton   value=\" &nbsp;>&nbsp; \" onclick=testsheet.nextone(" + i + "," + j +")></td><td width=40%></td></tr></table></td></tr>";
        str += "</table></td>"; 
        str += '<td valign=top id=details  width=250px>'+ this.instruction +'</td></tr>'; 
        str += "</table>";
        let wd = thispagewidth() - 20;
        myprompt(str, null, null, words[8] +': ' + mat[0][1] + " " + textmsg[178] + " " + (i+1) + (j>=0?("." + (j+1)):'') );
        LaTexHTML.reformat(document.getElementById('distincttbl'));
        promptwin.style.left = '0px';
        promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].onclick = function()
        {
            if (testsheet.updateddistinct)
            {
               LaTexHTML.deformat(promptwin);
               closeprompt();
            }
            else
            {    
               testsheet.updateddistinct = true;
               testsheet.putalert(testsheet.words[9]);
            }
        };
        document.getElementById('e0').focus();
        if (promptwin.offsetWidth > wd || mx > 50 )
           promptwin.style.width = wd + 'px'; 
        let d = document.getElementById('ans'+ i+'_' + j);
        if (d!=null) d.focus();
    };
    this.diff = function(arr)
    {
       let mx = -1,mn=-1;
       for (let x of arr)
       {
           let f = parseFloat(x);
           if ('' +f === 'NaN') continue;
           if (mx===-1) mx = mn = f;
           else if (f > mx) mx = f;
           else if (f < mn) mn = f;
       }
       return mx - mn; 
    };
    this.mode = function(arr)
    {
        let a = {};
        for (let x of arr)
        {
            if (a[x] == null) 
                a[x] = 1;
            else
                a[x] = a[x] + 1;
        }
        let k = Object.keys(a);
        let kf = [];
        for (let x of k)
        {
            kf.push([parseFloat(''+x),a[x]]);
        }
        kf.sort(function(x,y){ if (y[1] === x[1]) return y[0] - x[0]; return y[1] - x[1];});
     
        return kf[0][0];
    }; 
    this.toblack = function(td)
    {
        td.style.color= "black";
        td.style.borderColor="black";
    };
    this.handle = null;
    this.putalert = function(x)
    {
       let xy = document.getElementById('mystandard'); 
       this.holdmyanswer = xy.innerHTML;
       xy.innerHTML =  x ;
       xy.style.color = 'red';
       this.handle = setTimeout(function()
       {
           let x = document.getElementById('mystandard');
           if (x!==null) 
           {
               x.innerHTML = testsheet.holdmyanswer;
               x.style.color='green';
           }
       },3000);
    };
    this.previousone = function(i,j)
    {  
       this.spread(i,j);
       if (j <= 0) 
       {
           i--; 
           if (i < 0) 
           {
               this.putalert(textmsg[1771].split(/@/)[15]);
               return;
           }
           if (document.getElementById('h' + i + '_0') != null)
           {
               let k = 0;
               while (document.getElementById('h' + i + '_' + k) != null)
                   k++;
               this.byanswer(i,k-1); 
           }
           else if (this.atd[i][6] === '4')
           {
               this.byanswer(i,-2); 
           }
           else this.byanswer(i,-3);
       }
       else 
       {
           this.byanswer(i,j-1);
       }
    };
    this.nextone = function(i,j)
    {  
       this.spread(i,j);
       if (document.getElementById('h' + i + '_' +(j+1)) != null)
            this.byanswer(i,j+1);
       else
       {
           i++; 
           if (i === this.atd.length-1) 
           {
               this.putalert(textmsg[1771].split(/@/)[16]);
               return;
           }
           if (document.getElementById('h' + i + '_0') != null)
           {
               this.byanswer(i,0); 
           }
           else if (this.atd[i][6] === '4')
           {
               this.byanswer(i,-2); 
           }
           else this.byanswer(i,-3);
       }
    };
    this.displaytxt1 = function(ta,evt,i,j)
    {
        var e = evt ? evt : window.event;
        if (!e)
            return true;
        var key = 0;
        if (e.keyCode) {
            key = e.keyCode;
        } // for moz/fb, if keyCode==0 use 'which'
        else if (typeof (e.which) != 'undefined') {
            key = e.which;
        }

        if (key === 13)
        {
            this.setcolor(ta, 'black');
            let id = parseInt(ta.id.substring(1)) + 1;
            let tt  =document.getElementById('e' + id);
            if (tt!= null) 
                tt.focus();
            else
                this.nextone(i,j);
            ta.parentNode.style.backgroundColor = TBGCOLOR;
        }
        return true;
    };
    this.setcolor = function(tx,cl)
    {
        tx.style.borderColor = cl;
        tx.style.color = cl;
    };
    this.savedistinct = function()
    {
       for (let i in this.temp) 
       {
           for (let n of this.temp[i])
           {
               if (valuechanged[n] == false) continue;
               this.calcul(n); 
            }
        }
        setaction(1);
    };
    this.calcul = function(n)
    {
        if (valuechanged[n] == false)   return;
       let r = (new CSVParse(retrv(n,13),'|',',',';')).nextMatrix();
       let sum = 0;
       let arr = [];
       for (let k = 0; k < r.length; k++)
       {
          if (r[k][2]!=null ) 
          {
              let rr = r[k][2];
              let sm = this.eval1(rr,r[k][1]); 
              sum += sm;
              
              r[k][2] = (''+sm.toFixed(2)).replace(/([0-9])\.[0]+$/,'$1').replace(/^[0]*\.[0]*$/,'0').replace(/(\.[0-9])0$/,'$1');
              if (n === this.count)
              {
                  let sb = formselementbyname(document.form1,'scorebox' + n);
                  if (sb!=null) sb.value = r[k][2];
              }
              arr.push(sm);
          }
          else if (  !isNaN1(r[k][2]) && r[k].length < 5)
          {   
              let y = parseFloat(r[k][2]);
              sum += y;
              arr.push(y);
              if (n === this.count)
              {
                  let sb = formselementbyname(document.form1,'scorebox' + n);
                  if (sb!=null) sb.value = r[k][2];
              }
          }
          else if (n === this.count)
          {
                  let sb = formselementbyname(document.form1,'scorebox' + n);
                  if (sb!=null) sb.value = '0';
          }
       }
       
       arr.sort(function(a,b){return a-b;});
       let S = 0;
       
            for (var jj = this.dropn ; arr[jj]!=null ; jj++)
            {   
                if (typeof arr[jj] != 'number')
                    alert(arr[jj] + ' is NaN');
                S += arr[jj];
            }
           
       if (r[r.length-1].length === 7)
        {
            for (let k = parseInt(''+r[r.length-1][1]); k < arr.length; k++)
               S += arr[k];
            r[r.length-1][2] = sum;
            r[r.length-1][5] = S;
        }
        else
        {
            r.push([''+r.length, 0, sum, 'S',0, S,'']);
            S = sum;
        }
        setv(n,13, this.arr2str(r)); 
        try
        {
            var fomu1 = r[r.length-1][3];
            fomu1 = fomu1.replace(/S/g, '' + S).replace(/Q/g, '' + r.length-1).replace(/\s/g, '').replace(/T/g,r[r.length-1][4]);
            let M = this.evalhat(fomu1);
            if (isNaN1(''+M)) M = S;
           
            let mn = M.toFixed(1).replace(/([0-9])\.[0]+$/,'$1').replace(/^[0]*\.[0]*$/,'0');
            setv(n, 4, mn);
        }catch(e) 
        {
           setv(n, 4, (''+S.toFiexed(1)).replace(/([0-9])\.[0]+$/,'$1').replace(/^[0]*\.[0]*$/,'0'));
        }
        valuechanged[n] = true;
        this.cacheentered(n);
    };
    this.whois = function(n,ii){  //ii : question number, n: group #
        this.group = n;
        let ss ='<table  border=1 id=distincttbl1 style=border-color:#ddcc99;border-collapse:collapse cellpadding=4 ><tr><td colspan=4 align=center  style=border-top-color:transparent;border-left-color:transparent;border-right-color:transparent;padding-top:4px;padding-bottom:3px >' +textmsg[55] + ' ' + (n+1) + '</td></tr>';
        ss += '<tr><td  style="background-image:linear-gradient('+ BBGCOLOR +',' + TBGCOLOR+')"  align=center >#</td><td  style="background-image:linear-gradient('+ BBGCOLOR +',' + TBGCOLOR+')" >' + textmsg[154] +'</td><td    style="background-image:linear-gradient('+ BBGCOLOR +',' + TBGCOLOR+')" >' + textmsg[1629] + '</td><td  style="background-image:linear-gradient('+ BBGCOLOR +',' + TBGCOLOR+');font-size:' + (font_size-3) + 'px"   >&#9998;</td></tr>';
        for (let i of this.temp[n])  //i =  record number 
           ss += '<tr><td style="color:blue;background-color:' + TBGCOLOR+'" align=right onclick="testsheet.moveto('+i+')">' +  (i+1)  + '</td><td style="color:blue;background-color:' + TBGCOLOR+';white-space:nowrap" onclick="studentinfo(' + i  +',' + ii+ ')" >' + mat[i][2] + '</td><td style="background-color:' + TBGCOLOR+';color:blue;white-space:nowrap" onclick="testsheet.whosub(' + i + ","+ ii +")\">" + mat[i][10] + '</td><td style="color:blue;background-color:' + TBGCOLOR+'" onclick=testsheet.distinctComment(' + i +',' + ii + ")>&#9998;</td></tr>";
        document.getElementById('details').innerHTML = ss + '</table>';
        
        /*let ss = '<table  border=1 id=distincttbl style=border-color:#ddcc99;border-collapse:collapse cellpadding=4  ><tr><td colspan=3 align=center  style=border-top-color:transparent;border-left-color:transparent;border-right-color:transparent >' +textmsg[55] + ' ' + (n+1) + '</td></tr>';
        for (let i of this.temp[n])
           ss += "<tr><td style=color:blue onclick=testsheet.whosub(" + i + ","+ ii + ")>" + mat[i][2] + "</td><td><nobr style=color:blue onclick=testsheet.whosub(" + i + ")>" + mat[i][10] + "</nobr></td><td style=color:blue onclick=testsheet.distinctComment("  + i +',' + ii + ")>&#9998;</td></tr>";
        document.getElementById('details').innerHTML = ss + '</table>';*/
    };
    this.moveto = function(n)
    {
        goesto(n); 
    };
    
    this.activerow = function(n)
    {
        let tbl = document.getElementById('distincttbl');
       let set = false, clear = false;
       for (let r=2; r < tbl.rows.length-2; r++)
       {
           let cl = (''+tbl.rows[r].bgColor);
           if (r-2!==n && (cl.replace(/ /g,'') === 'rgb(230,230,180)' )|| cl ==='#E6E6B4')
           {    
               tbl.rows[r].bgColor = null;clear = true;
           } 
           if (r-2===n )//&& cl.replace(/ /g,'') !== 'rgb(230,230,180)' && cl!=='#E6E6B4') 
           {
               tbl.rows[r].bgColor = '#E6E6B4'; set = true;
           } 
           if (set && clear) break;
       } 
    };
    this.distinctComment = function(n,i) //i = question numner
    {
        let xx = retrv(n,13);
        if (xx == null|| xx === '') xx = mat[n][13];
        let r = (new CSVParse(xx, '|',',',';')).nextMatrix();
        this.integritys(r,this.numq+1);
        if (r[i] == null ){ r[i] = [i+1,1,0,''];}
        let comm = r[i][3]; 
        let s = '<div style="white-space:nowrap;padding:4px 4px 4px 4px" >' + textmsg[447] + ' ' +  mat[n][2] + ' ' + mat[n][10] + "</div>" 
         + '<textarea id="commentds" style="border: 1px solid rgb(192, 192, 192); background-color: white; color: black; height: 200px; width:99%;padding:2px 3px 2px 4px" onkeypress="return displaytxt(this,event,' + n +',' + i + ')">' + comm +'</textarea>';
        s += '<table cellpadding=0 align=center><tr><td><input type=button class=GreenButton style=width:78px value="' + textmsg[1357] + '" onclick=testsheet.insertComment(' + n +',' + i + ')></td><td><input type=button class=OrangeButton style=width:78px value="' + textmsg[18] + '" onclick=testsheet.cancelComment(' + n  +',' + i + ')></td></tr></table>'
        + '<div id=notsaveerror></div>';
        document.getElementById('details').innerHTML =  s  ;
        document.getElementById('commentds').focus();
    };
    this.insertComment = function(n,i)
    {
        let v = document.getElementById("commentds" ).value;
        let xx = retrv(n,13);
        if (xx == null|| xx === '') xx = mat[n][13];
        let r = (new CSVParse(xx, '|',',',';')).nextMatrix();
        this.integritys(r,this.numq+1);
        if (i==null || r[i] == null ){  r[i] = [i+1,1,0,''];}
        r[i][3] = v ; 
        setv(n,13,this.arr2str(r));
        TestSheet.did[n + '_' +i  ] = 1;
        valuechanged[n] = true;
    };
    this.commentSaved = true;
    this.group = 0;
    this.cancelComment = function(n,ii)
    {
        let dt = document.getElementById('details');
        let err = document.getElementById('notsaveerror');
        let v = document.getElementById("commentds" ).value;
        if (this.commentSaved === false && v.replace(/ /g,'').length>0)
        {    
            err.innerHTML = '<font color=red>' + this.words[10] + '</font>';
            this.commentSaved = true;
        }
        else
        {
            this.whois(this.group,ii);
        }
    };
    this.insertCommentg = function(g,i)
    {
        let v = document.getElementById("commentds" ).value;
        for (let n of this.temp[g])
        {
            let xx = retrv(n,13);
            if (xx == null|| xx === '') xx = mat[n][13];
            let r = (new CSVParse(xx, '|',',',';')).nextMatrix();
            this.integritys(r,numq+1);
            if (r[i][3] == null || r[i][3] == '')
                r[i][3] = '';
            else 
                r[i][3] += '\n' + v;
            setv(n,13,this.arr2str(r));
            TestSheet.did[n + '_' +i  ] = 1;
            this.tempcomment[g] = v;
            valuechanged[n] = true;
        }
        document.getElementById('details').innerHTML =  '<div style="white-space:nowrap;padding:4px 4px 4px 4px" >' +textmsg[447] + ' ' + textmsg[55] + ' ' + (g+1) + '</div>' + v ;
        var fmt=guessFormat(v);
         if ( fmt  +''=='2')
         {
             LaTexHTML.formatele(document.getElementById('details'));
          }
    };
    this.tempcomment = [];
    this.distinctCommentg = function(n,i)
    {
        let es = this.tempcomment[n];
        if (es == null || es === null) es = '';
        if (es !== '')
        for (let nn of this.temp[n])
        {
            let xx = retrv(nn,13);
            if (xx == null|| xx === '') xx = mat[nn][13];
            let r = (new CSVParse(xx, '|',',',';')).nextMatrix();
            this.integritys(r,this.atd.length);
            let j  =  r[i][3].indexOf(es);
            if (j >= 0)
                r[i][3] = r[i][3].substring(0,j).replace(/\n$/,'') +   r[i][3].substring(j + es.length);
            setv(nn,13,this.arr2str(r));
            TestSheet.did[nn + '_' +i  ] = 1;
        }
        let s = '<div style="white-space:nowrap;padding:4px 4px 4px 4px" >' + textmsg[447] + ' ' + textmsg[55] + ' ' + (n+1) + '</div><textarea id="commentds" style="border: 1px solid rgb(192, 192, 192); background-color: white; color: black; height: 200px; width:99%;padding:2px 3px 2px 4px" onkeypress="return displaytxt(this,event,' + n +',' + i + ')">' + es + '</textarea>';
        s += '<table align=center cellpadding=0 ><tr><td><input type=button class=GreenButton style=width:78px value="' + textmsg[310] + '" onclick=testsheet.insertCommentg(' + n +',' + i + ')></td><td><input type=button class=OrangeButton style=width:78px value="' + textmsg[18] + '" onclick=testsheet.cancelCommentg(' + n +',' + i + ')></td></tr></table>'
        + '<br><div id=notsaveerror></div>';
        document.getElementById('details').innerHTML =  s  ;
        document.getElementById('commentds').focus();
    };
    this.cancelCommentg = function(n, i)
    {
        let dt = document.getElementById('details');
        let err = document.getElementById('notsaveerror');
        if (this.commentSaved === false)
        {    
            err.innerHTML = '<font color=red>' + this.words[10] + '</font>';
            
            this.commentSaved = true;
        }
        else
        {
            dt.innerHTML = this.instruction;
        }
    };
    this.temp = [];
    this.whosub = function(n, ii)  // ii 
    {
        let s = mat[n][6].trim().replace(/^[0-9][0-9][0-9][0-9]*\n/,'');
        let r = (new CSVParse(s, "'", ',', '\n')).nextMatrix();
        this.integrity(r,this.numq);
        let fm = r[ii][1].replace(/<([a-z])/ig,'< $1');
        fm = formatstr(fm,r[ii][3]);
       document.getElementById('details').innerHTML = 
        '<div style="white-space:nowrap;padding:4px 4px 4px 4px;float:center;width:250px" >' +   mat[n][10] + ' ' + textmsg[1629] + ': </div>'
        + '<div style="color:purple;border-radius:3px;border:1px #ccdd99 solid; padding:3px 3px 3px 3px;width:250px">' + fm + '</div>'
        + '<Center><a href="javascript:testsheet.distinctComment('  + n +',' + ii + ')">&#9998;</a></center>';
    };
    this.benumeric = function(tx)
    {
       if (  isNaN1(tx.value))
       {
           tx.focus();
           tx.style.borderColor = 'red'; 
           tx.style.color = 'red';
       }
       else
       {
           let vl = parseFloat(tx.value);
           if (vl > this.capvalue) 
           {
               tx.focus();
               tx.style.borderColor = 'red'; 
               tx.style.color = 'red';
               tx.value = '' + this.capvalue;
               document.getElementById('details').innerHTML = '<br><br><br><nobr>Exceeded maximum value. Click &#9998;</nobr><br>on  the top to edit the maximum value';
               return;
           }
           document.getElementById('doavg').style.color = 'blue';
           document.getElementById('doavg').nextSibling.style.color = 'grey';
            tx.style.borderColor = 'black'; 
            tx.style.color = 'black';
            document.getElementById('numupdated').innerHTML = '';
            this.updateddistinct = false;
       }
       tx.parentNode.style.backgroundColor = TBGCOLOR;
    };
    this.displaytxt2 = function(ta, evt,i,j)
    {
        var e = evt ? evt : window.event;
        if (!e)
            return true;
        var key = 0;
        if (e.keyCode) {
            key = e.keyCode;
        } // for moz/fb, if keyCode==0 use 'which'
        else if (typeof (e.which) != 'undefined') {
            key = e.which;
        }

        if (key === 13)
        {
            this.setcolor(ta, 'black');
            let tt  =document.getElementById('e0' );
            tt.focus(); 
         
            let tans = null;
            if ((tans = document.getElementById('ans' +i + '_' + j))!== null)
            {
               let cl = (''+ tans.style.color).replace(/ /g,'').toLowerCase();
               if (cl=== 'black' || cl === '#000000' || cl === 'rgb(0,0,0)')
               {
                    let vl = tans.value; let u;
                   if (j < 0)
                   {

                       if (this.atd[i][9]!==null && this.atd[i][9].includes('\nwhy:'))
                           u = vl + this.atd[i][9].replace(/.*(\nwhy:.*)$/,'$1');
                       else
                           u = vl; 
                   }
                   else
                   {
                       let zz = this.atd[i][9].trim().replace(/\n/g, ' \n').split(/\n/);
                       zz[j] = vl;for (let k in zz)zz[k] = zz[k].trim();
                       u = zz.join('\n');
                   }
                   if (u!=''   || (this.atd[i][9]== null || this.atd[i][9] ==''))
                   {
                       let ans = '';
                       this.atd[i][9] = u;
                       for (let k=0; k < this.numq; k++)
                       {   
                          ans += (k+1) + '. ' + this.atd[k][9];
                          if (k < this.numq-1)
                              ans += '\n\n';
                       }
                       toclassasanswer(this.count, ans);
                   }
                } 
            }
        }
    };
    this.spread = function( i,j )
    {   let tans;
        
        let cn = 0;
        for (let k=0; k < this.temp.length; k++)
        {
            let u = document.getElementById('e' + k);
            let cl = (''+u.style.color).replace(/ /g,'').toLowerCase();
            if (cl=== 'red' || cl === '#ff0000' || cl === 'rgb(255,0,0)')
                continue;
            let vv = u.value;
            let ns = this.temp[k];
            for (let n of ns)
            {
                let sy = retrv(n,13);
                if (sy==='' || sy === null)
                {
                    sy = mat[n][13];
                }
                 
               let ys = (new CSVParse(sy, "|", ',', ';')).nextMatrix();
               this.integritys(ys,this.numq+1);
               let y = ys[i]; 
               if (y[3] == null || y[3] === '') y[3] = '';
               if (j <0)
               {
                   cn++;
                   ys[i][2] = vv;
                   if (n === this.count)
                   {
                       let bxi = formselementbyname(document.form1,'scorebox' + i);
                       if (bxi!=null) bxi.value = vv;
                   }
                   TestSheet.did[n + '_' + i] = 1;
               }
               else 
               {
                   
               }    
                if ( y[2]!='')
               {
                   let z = y[2].split(/\+/);
                   if (z[j] != vv) cn++;
                   z[j] = vv;
                   y[2] = z[0];
                   for (let l= 1; l < z.length; l++)
                       y[2] += "+" + z[l];
                   if (n == this.count)
                   {
                       this.scorematrix[i][j] = vv;
                       let xx = document.getElementById('h' + i + '_' + j);
                       if (xx!=null) xx.value = vv;
                       let bxi = formselementbyname(document.form1,'scorebox' + i);
                       if (bxi!=null) bxi.value = this.eval1(y[2],y[1]);
                   }
                   TestSheet.did[n + '_' + i + '_' + j] = 1;
               }
               else 
               {
                   cn++;
                   let l=0; let u; y[2]  = "";  
                   while ((u = document.getElementById('h' + i + '_' + l))!==null)
                   { 
                       y[2] += "+" + (l===j?vv:u.value);
                       l++;
                   }
                   y[2] = y[2].replace(/^\+/,'');
                   TestSheet.did[n + '_' + i + '_' + j] = 1;
                   if (n == this.count)
                   {
                       this.scorematrix[i][j] = vv;
                       let xx = document.getElementById('h' + i + '_' + j);
                       if (xx!=null) xx.value = vv;
                       let bxi = formselementbyname(document.form1,'scorebox' + i);
                       if (bxi!=null) bxi.value = this.eval1(y[2],y[1]);
                   }
               }
               ys[i][2] = y[2]; let ss = '';
               let tt = this.arr2str(ys);
               setv(n,13,tt);
               holdvalues[n + '_13'] = tt;
               if (j >= 0)
                    TestSheet.did[n + '_' +i +'_' + j ] = 1;
               else
                    TestSheet.did[n + '_' +i  ] = 1;
               this.cacheentered(n);
               valuechanged[n] = true;
            }
        }
        this.updateddistinct = true;
        document.getElementById('numupdated').innerHTML = '#'+cn;
    };
    
    
    
    
    
 
    this.arr2str = function(ys)
    {
        let ss ='';
        for (var p = 0; p < ys.length && ys[p]!=null; p++)
        {
            let ll = ys[p].length; if (ll > 7) ll = 7;
            for (let q = 0; q < ll; q++)
            {
                 if (ys[p][q]== null || typeof ys[p][q] === 'undefined' || ys[p][q] ==='')  
                    ss += '';
                 else if (q===3 && (ys[p][3].includes(",")  || ys[p][3].includes(";")  || ys[p][3].includes("|")  ))
                    ss += "|" + ys[p][3].replace(/\|/g,'||') + "|";
                 else 
                    ss += ys[p][q];
                 if (q < ll-1) ss += ",";
                 else if (p < ys.length-1) ss += ";";
            }
        }
        //parent.frames[0].myprompt((new CSVParse(ss,'|',',',';')).tohtml());
        return ss;
    };
    this.oldscores = new Array();
    this.sumup = function(td)
    {
        let i = td.id.substring(1).replace(/_.*$/,'');
        var x = formselementbyname(document.form1,'scorebox'+i);
        let t, sum = 0, j =0; 
        while ((t = document.getElementById(td.id.replace(/_[0-9]+$/, '_' + j)))!==null)
        {
            if (td === t)
            {
                sum += parseFloat(td.value);
            }
            else //if (t.style.color.replace(/ /g,'') ==='rgb(0,0,0)' || t.style.color.replace(/ /g,'') ==='black'|| t.style.color.replace(/ /g,'') ==='#000000')
                sum += parseFloat(t.value);
             
            j++;
        }
        let mx = parseFloat(this.atd[parseInt(i)][2]);
        if (sum > mx) sum  = mx;
        x.value = sum.toFixed(1).replace(/([0-9])\.[0]+$/,'$1').replace(/^[0]*\.[0]*$/,'0');
        this.updateatd(x,i,3);
        x.style.color = 'rgb(0,0,0)';
    };
    this.transfer = function(td,i)
    {
        var x = formselementbyname(document.form1,'scorebox'+i);
       
        if (td.innerHTML.charCodeAt(0) == 8595)
     {
         td.innerHTML = '&uarr;'
         this.oldscores[i] = x.value;
         x.value = this.lscores[i];
         this.updateatd(x,i,3);
         
     }
     else
     {
         x.value =   this.oldscores[i] 
        this.updateatd(x,i,3);
        td.innerHTML = '&darr;'
     }
    };
    this.normalize = function()
    {
        if (this.numq == 0) return;
         
        var j = 2;
        if (this.atd[0].length > 3) j = 3;
        var spts = 0;
        var tarr = new Array();
        var errstr = "";
        for (var kk = 0; kk < this.numq && kk < this.atd.length; kk++)
        {
            var fullscore = 0;
            if (this.atd[kk] == null)
            {
                break;
            }
            try
            {
                fullscore = parseFloat(this.atd[kk][j-1]);
            }
            catch(e)
            {
                errstr += (this.atd[kk][j-1] + " " + textmsg[123] + "<br>");
            }
            try
            {
                tarr[kk] = this.eval1(this.atd[kk][j],this.atd[kk][j-1]);
                spts += parseFloat(this.atd[kk][j-1]);
            }
            catch(e)
            {
                errstr += (this.atd[kk][j] + " " + textmsg[123] + "<br>");
                tarr[kk] = 0;
            }
            if (fullscore < tarr[kk])
            {
                errstr += (kk+1) + "-th: " + textmsg[1268] + " < " + textmsg[1311] + ":<br>" + this.atd[kk][j-1] + " < " + this.atd[kk][j];
            }
        }
        if (errstr!='')
        {
            myprompt(errstr);
            return;
        }
        console.log(tarr.length +'=?=' + this.numq);
      
        tarr.sort(function(a,b){return a-b;});
        var S = 0;
        
        for (var jj = this.dropn ;tarr[jj]!=null ; jj++)
        {  
            if (typeof tarr[jj] != 'number')
                    alert(tarr[jj] + ' is NaN');
            S += tarr[jj];
        }
        
        if (this.atdtbl == null)
        {
            this.atdtbl = document.getElementById(this.tablename);
        }
        if (this.atdtbl != null)
        {
            if (this.istest)
            {
                var scoretd = document.getElementById("sumsco");
                if (scoretd!=null) scoretd.innerHTML = "" + S  ;
                scoretd = document.getElementById("sumscore");
                if (scoretd!=null) scoretd.innerHTML = "" + S  ;
                if (this.atd[0].length > 3)
                this.atd[this.atd.length-1][2] = '' + S;
            }
            else if(datapresentformat == 'DataTable')
            {    
                this.atdtbl.rows[this.numq+1].cells[1].innerHTML = ''+ spts; 
                this.atdtbl.rows[this.numq+1].cells[2].innerHTML = ''+ S;
            }
        }
        var M = S;
        var sumtd = document.getElementById('sumtd');
        if (sumtd!=null) 
        {
            sumtd.innerHTML = ''+S;
           
        }
        if (this.formula != 'S')
        {    
            var TT = '0';
            if (  this.atd[this.atd.length-1][4] !=null)
            {
                TT = this.atd[this.atd.length-1][4];
                if (isNaN(''+TT)) TT = TT.replace(/[^0-9]/g, '');
                if (TT == '') TT = '0';
            }
            else if (typeof(summary)!='undefined')
            {
                TT = summary[4];
            }
            if (this.formula == null) this.formula = 'S';
            var fomu1 = this.formula.replace(/S/g, '' + S).replace(/Q/g, '' + this.numq).replace(/\s/g, '').replace(/T/g,TT);
           
            M = this.evalhat(fomu1);
           
            if ('' + M == 'NaN')
            {
                M = -2;
                myprompt(this.formula + " Invalid:" + fomu1);
            }
             
        }
        if (retrv(this.count,this.scorebox)!=''+M)
        {
            setv(this.count,this.scorebox, ''+M);
            valuechanged[this.count] = true;
            this.cacheentered();
            var tn5t = document.getElementById('tn5');
            if (tn5t!=null) tn5t.innerHTML = ''+M;
        }
    }

    this.evalhat = function(x)
    {
        var i = x.indexOf('^');
        if (i == -1)
        {
            var t = 0;
            try {
                t = eval(x);
            } catch (e) {
                return 'NaN';
            }
            return t;
        }
        if (i == 0 || i == x.length - 1)
            return 'NaN';
        var j = i + 1;
        var lft, rt;
        if (x.charAt(j) == '(')
        {
            var np = 1;
            for (j++; j < x.length; j++)
            {
                if (x.charAt(j) == '(')
                    np++;
                else if (x.charAt(j) == ')')
                    np--;
                if (np == 0)
                    break;
            }
            if (np > 0)
                return 'NaN';
            j++;
            rt = this.evalhat(x.substring(i + 1, j));
            if (rt == 'NaN')
                return 'NaN';
        }
        else if ("0123456789.".indexOf(x.charAt(j)) >= 0)
        {
            for (j++; j < x.length; j++)
            {
                if ("0123456789.".indexOf(x.charAt(j)) < 0)
                    break;
            }
            rt = parseFloat(x.substring(i + 1, j))
        }
        else
            return 'NaN';
        var k = i - 1;
        if (x.charAt(k) == ')')
        {
            var np = 1;
            for (k--; k >= 0; k--)
            {
                if (x.charAt(k) == ')')
                    np++;
                else if (x.charAt(k) == '(')
                    np--;
                if (np == 0)
                    break;
            }
            if (np > 0)
                return 'NaN';

            lft = this.evalhat(x.substring(k, i));
            if (lft == 'NaN')
                return 'NaN';
        }
        else if ("0123456789.".indexOf(x.charAt(k)) >= 0)
        {
            for (k--; k >= 0; k--)
            {
                if ("0123456789.".indexOf(x.charAt(k)) < 0)
                    break;
            }
            if (k > 0)
            {
                k++;
            }
            lft = parseFloat(x.substring(k, i));
        }
        else
            return 'NaN';

        var z = Math.pow(lft, rt);
        if (k == 0)
        {
            if (j == x.length)
                return z;
            return this.evalhat(z + x.substring(j));
        }
        else
        {
            if (j == x.length)
                return this.evalhat(x.substring(0, k) + z);
            return this.evalhat(x.substring(0, k) + z + x.substring(j));
        }
    }

    this.mapback = new Array();
    this.correctmess = function(sol,p,k)
    {  //some question number and shuffle numbers are messed up causing serious problems
       let j = parseInt(sol[p][k]);
       if ('' + j != 'NaN' && j >  this.numq)
       {
            let ff = new Array(this.numq+1);
            let f = 1;
            for (f=1; f <= this.numq; f++)
            {
               ff[f] = false; 
            }
            for (var q=0; q < sol.length; q++)
            {
                let jj = parseInt(sol[q][k]);
                if (''+jj!='NaN' && jj <= this.numq)
                    ff[jj] = true;
            }
            f = 0;
            for (f=1; f <= this.numq; f++)
            {
                if (ff[f]==false)
                {
                    sol[p][k] = ''+f;
                    j = f;
                    break;
                } 
            }
        }
        return j; 
    }
    this.makeatd = function(content, sheet, assess, istest)
    {
        if (istest == false)
        {
            var ptsarr = new Array();
            var objarr = new Array();
            var b = null;
            var NN = 0;
            if (sheet != '')
            {
                b = this.toarray(sheet, "|", ",", ";");
                for (var i = 0; i < b.length; i++)
                {
                    if (  isNaN1(b[i][0])) continue;
                    if (b[i].length>4)
                    {
                        break;
                    }
                    NN++;
                   
                    ptsarr[b[i][0]] = b[i][2];
                }
            }
            var a = null;
            if (assess!='')
            { 
                a = this.toarray(assess.replace(/^[^0-9][^;]+;/,''), "|", ",", ";");
            }
            else if (b!=null)
            {
                a = new Array(NN);
                for (var j=0; j < b.length; j++)
                    a[j] = [j+1, 1, 0];
            }
            else
            {
                a = new Array(10);
                for (var j=0; j < 10; j++)
                    a[j] = [j+1, 1, 0];
            }
             
            var j = -1;
            this.atd = new Array();
         
            if (a!=null)
            {
                if (mat[this.count][12]=='4')
                {
                    var sol = this.toarray(content, "'", ",", "\r\n");
                    for (var q=a.length;  q < sol.length; q++)
                    {
                        a[q]= [ q+1,'1', '1'];
                    }
                }  
                for (var i = 0; i < a.length; i++)
                {
                    if ( isNaN1(a[i][0])) continue;
                    j = this.atd.length;
                    this.atd[j] = new Array(3);
                    this.atd[j][0] = a[i][0];
                    this.atd[j][1] = a[i][1];
                    if (ptsarr[a[i][0]] != null)
                    {
                        this.atd[j][2] = ptsarr[a[i][0]];
                    }
                    else
                        this.atd[j][2] = '0';
                   
                }
               
            }
            this.numq = j + 1;
            if (b!=null)
            {
                this.atd[j+1]  = b[b.length-1];
                this.formula = this.atd[this.numq][3];
                this.dropn   = this.atd[this.numq][1];
            }
        }
        else
        {
            var sol = null;
            if (content!='')
            {
                sol = this.toarray(content, "'", ",", "\r\n");
                
            }
            var scorenow = -2;
            var scoretx = retrv(this.count,4);
            if ( !isNaN1(scoretx))
                scorenow = parseFloat(scoretx);
            var q = this.toarray(this.assess.replace(/^[^0-9][^;]+;/,''), "|", ",", ";");
            if (this.purpose==null)
            {
                this.hw = new Hwtake('grad',this.question, this.answer, this.attachat, this.assess, this.fmt,this.count);
            }
            else
            {
                this.hw = new Hwtake('grad',this.question, this.answer, this.attachat, this.assess, this.fmt,this.count);
            }
            for(let kk of this.hw.quesnums)
            if (kk > this.numq)
               this.numq = kk; 
            if (sol!=null) this.integrity(sol,this.numq);
            var asg = this.toarray(sheet, "|", ",", ";");
            for (let k =0; k < asg.length; k++)
            {
                let j =0;
                while(j < q.length && asg[k][0]!=q[j][0]){j++;}
                if (j < q.length) asg[k][1] = q[j][1]; 
                try{
                  let cc=  eval(asg[k][2])
                }catch(e){alert(asg[k]);}
            }
            let corrected = this.arr2str(asg);
            console.log(corrected);
            console.log(sheet);
            if (sheet != corrected)
            {
                setv(this.count,13, corrected);
                sheet = corrected;
                valuechanged[this.count] = true;
            }
            if (this.purpose==null)
            {
                addcss2head(this.count, this.hw.divs);
            }
            else if (printingw!=null)
            {
                sid = printingw.document.getElementById('style_' + this.count);
                if (sid==null)
                {
                    sid = document.createElement('style');
                    sid.id = 'style_' + this.count;
                    sid.type = 'text/css';
                    sid.innerHTML = this.hw.divs;
                    printingw.document.getElementsByTagName('head')[0].appendChild(sid);
                }
            }
            this.header =  this.hw.header0 ;
            this.attachheader =  this.hw.attachheader;
            //num .shuffled .pts .score .outcome .timestay .fmt . question .solution .answer .comments  
            this.numq = 0; 
            if (sol!=null) 
            {    
                this.numq =  sol.length;
                for(let kk of this.hw.quesnums)
                if (kk > this.numq)
                   this.numq = kk; 
            }
            var bb =  false;
            this.atd = new Array();
            var sum = 0;
            this.goodformat = true;
            var inside = ",";
            var shuinside = ",";
            var k1 = 1;

            if (sol!=null)
            for (var p=0; p < sol.length; p++)
            {
                var j0=-1; 
                if (asg!=null)
                {
                    j0 = 0;
                    for(; j0 < asg.length; j0++) 
                    {
                        if (sol[p][0] == asg[j0][0]) 
                            break;
                    }
                }
                bb =  (j0>=0 && j0 < asg.length && asg[j0].length>2);

                var j = this.correctmess(sol,p,0);
                if (  ('' + j == 'NaN' || j>  this.numq || sol[p].length == 1 ))
                {
                    if (p==0) 
                        this.header += ' ' + sol[0].join(' ');
                    continue;
                }
                inside += j + ",";
                let sorder = this.correctmess(sol,p,4);
                shuinside += sorder + ",";
                if (j > k1)
                {
                    for(; k1 < j; k1++)
                    {
                        this.mapback[this.atd.length] = k1;
                        var j1=-1; 
                        if (asg!=null)
                        {
                            j1 = 0;
                            for(; j1 < asg.length; j1++) 
                            {
                                if (asg[j1]!=null && ''+k1 == asg[j1][0]) 
                                    break;
                            }
                        }
                        this.atd[this.atd.length]  = 
                        [    
                            k1,    //number
                            this.atd.length+1,    //shuffle
                          ( this.hw.ptlist[k1] == null? '1': this.hw.ptlist[k1] ), //pts
                          '0',           //score
                          ( this.hw.outcome[k1] == null?'':this.hw.outcome[k1]),   // outcome
                            '0',   //time
                            '1',  //student format
                          ( this.hw.questarr[k1]!=null? this.hw.questarr[k1].replace(/___[_]+/g,'______') : ''),//question
                             textmsg[1865] , // student answetr
                          ( this.hw.answqrr[k1]!=null? this.hw.answqrr[k1] : ''),//answer
                          ( (j1>-1 && asg[j1]!=null && asg[j1].length > 3)? asg[j1][3] : '')  //course
                        ];
                    }

                }
                k1 = j+1;
                if (sol[p].length < 4) 
                {
                    this.goodformat = false;
                } 
                else if (sol[p].length == 4)
                {
                    sol[p][4] = sol[p][0];
                }
                this.mapback[this.atd.length] = j;
                let vv = '0';
                if (bb){ 
                    vv = asg[j0][2];
                    try{ eval(asg[j0][2]);}catch(e){vv='0'; alert('ddddd');}
                }
               this.atd[p] = 
                [    
                    sol[p][0],    //0, number
                    sol[p][4],    //1, shuffle
                  ( this.hw.ptlist[j] == null? '1': this.hw.ptlist[j] ), //2, pts
                  vv,           //3, score
                  ( this.hw.outcome[j] == null?'':this.hw.outcome[j]),   //4, outcome
                    sol[p][2],   //5, time
                    sol[p][3],  //6, student format
                  ( this.hw.questarr[j]!=null? this.hw.questarr[j].replace(/___[_]+/g,'______') : ''),//7, question
                    sol[p][1], //8, student answetr
                  ( this.hw.answqrr[j]!=null? this.hw.answqrr[j] : ''),//9. answer
                  ( (bb && asg[j0][3]!=null)? asg[j0][3]: '')  //10.course
                ];
                 
                let nb = this.hw.questarr[j].split(/___[_]*/).length - 1; 
                if (nb>0)
                {
                    this.scorematrix[p] = new Array(nb);
                    let tmp  = []; 
                    if (asg[j0]!=null) tmp = ( (asg[j0][2]!=null)? asg[j0][2] : '').split(/\+/);
                    if (tmp.length != nb)
                    {
                         // alert(nb + ' <---> ' + asg[j0][2]);
                          tmp = []; let zz = ''; try{if (asg[j0]!=null) zz =eval(asg[j0][2])/nb;}catch(e){zz = 0;}
                          for (let kk=0; kk < nb; kk++)
                              tmp[kk] = ''+zz;
                    }
                    for (let jj=0; jj < nb; jj++)
                    {
                        if ( jj < tmp.length && !isNaN1(tmp[jj]))
                           this.scorematrix[p][jj]  = tmp[jj];
                        else{
                           this.scorematrix[p][jj]  = null;
                       }
                    }
                }
                else
                    this.scorematrix[p] = null;


                sum += parseFloat(( bb?asg[j0][2]:'0' ));
            }
            
           
            let sumstr = ('' + sum.toFixed(1)).replace(/\.0$/,'');
            if (this.atd.length == 0) 
                this.goodformat = false;
           var N = 0;
           if (asg!=null) 
               N = asg.length-1;

           if (asg!=null && N >0 && asg[N].length >= 7)
           {  
               this.atd[this.atd.length]  = 
                [    
                    asg[N][0],
                    asg[N][1],
                    asg[N][2],
                    asg[N][3],
                    asg[N][4],
                    asg[N][5],
                    asg[N][6]
                ]; 
           }
           else
           {

                this.atd[this.atd.length]  = 
                [    
                    (sol!=null)?sol.length:0,
                    0,
                    sumstr,
                    'S',
                    '0',
                    sumstr,
                    ''
                ];
            }

        //}
            var normal = (this.atd!=null && typeof(this.atd.length)!='undefined' && this.atd.length>1 &&  this.atd[this.atd.length-1]!=null && this.atd[this.atd.length-1].length >= 7);
         
            if (normal) 
            {
                this.numq =  this.atd.length - 1;
                this.formula = this.atd[this.numq][3];
                this.dropn = this.atd[this.numq][1];
            }
            else
            {
                this.numq =  (this.atd!=null && typeof(this.atd.length)!='undefined')? this.atd.length : 0;
               
                this.formula = "S";
                this.dropn = "0";
            }
            var ss = uniformula[retrv(this.count,0)+'_' + retrv(this.count,1)];
            if ( ss != null)
            {
                var j = ss.indexOf("|");
                this.dropn = parseInt(ss.substring(0,j));
                this.formula = ss.substring(j+1);
            } 
        }
     
        
    };
    
    this.circlebg = function(n,k)
{
    var m = Math.round(n/2 + 3) ;
    return "<div style=\"font-family:arial;font-weight:700;width:" + (2*m) + "px;height:" + (2*m)
        + "px;border-radius:" + m + "px;font-size:" + n + "px;color:#ddcc11;line-height:" + (2*m) + "px;text-align:center;background-color:" + IBGCOLOR + "\">" 
        + k + "</div>";
} 
    this.label = function(x)
    {
        return  "<b><nobr>" + x + "</nobr></b>";
    }
    
    this.catchkey = function(box,i, evt)
    {
        var e = evt? evt : window.event;
        if(!e) return true;
        var key = 0;
        if (e.keyCode)
        {
             key = e.keyCode;
        }  
        else if (typeof(e.which)!= 'undefined')
        {
             key = e.which;
        }
        if (key == 13)
        {
            this.updateatd(box, i, 3);
            return false;
        }
        return true;
    };
    this.hasfillblank = false;
    this.sumptrs = 0;
    this.skipbut = function(i)
    {
        return "<input id=skipbut"+ i + " name=skipname"+ i + " type=button  style=\"margin-left:30px;margin-right:30px;width:" + (4.5*font_size) + "px;\" class=GreenButton onclick=\"testsheet.selval(0,0,-1,this)\" value=\"" + textmsg[1942].split(/@/)[0] + "\" >";
    };
    this.formatDistinct = function(t,fmt)
   {
        let ans = formatstr(t, fmt);
        if (fmt==='1')
        {
             ans = ans.replace(/^[ ]*<tr>/, '').replace(new RegExp("<.tr>[ ]*$"), '').replace(/^[ ]*<td>/, '&lt; td&gt;').replace(new RegExp("<.td>[ ]*$"), '&lt; /td&gt;') ; 
        }
        ans = this.hw.merge(ans);
        ans = ans.replace(/imagelet([0-9]+)/g, 'imagelet100$1');
        return ans;
     };
     this.displaytxt = function(ta,evt,n)
    {
        var e = evt ? evt : window.event;
        if (!e)
            return true;
        var key = 0;
        if (e.keyCode) {
            key = e.keyCode;
        }  
        else if (typeof (e.which) != 'undefined') {
            key = e.which;
        }
        
        if (key === 13)
        {
         }
        else
        {
            this.commentSaved = false;
        }
         if (key === 36 || key===62)
         {
             var p = caretPos( ta) ;
             var str = '';
             var ch = String.fromCharCode(key);
             if (p > 0)
                str   = ta.value.substring(0,p) + ch +  ta.value.substring(p);
             else
                str   =   ch +  ta.value.substring(p);
             var fmt=guessFormat(str);
             if ( fmt  +''=='2')
             {
                 document.getElementById("notsaveerror" ).innerHTML = str;
                 LaTexHTML.formatele(document.getElementById("notsaveerror" ));
              }
          }
        return true;
   
    };
    this.eval1 = function(s, u)
    {
        let y = parseFloat(u);
        try
        {
            let x =  eval(s);
            if ( x < y)  
            {
                 if ( (''+ x.toFixed(1)).includes('.0'))
                     y =  Math.round(x);
                 else
                     y  = Math.round(10*x)/10;
            }
        }catch(e) 
        { y= 0;}
        console.log(s + ' = ' + y);
        return y;
    }
    this.distinctlink = [];
    this.commentSaved = false;
    this.expandsign = '&#8853;';
    this.words = textmsg[1943].split(/@/);
    this.instruction = '<nobr>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</nobr><br><ul style="margin:0px 0px 0px 0px;padding-left:25px;">' 
                    +  '<li>'+ this.words[1]+'<li>'+ this.words[2].replace(/\+/,this.expandsign).replace(/blue/g,'black')+'<li>'+ this.words[3]+'<li>'+ this.words[4]  +'<li>'+ this.words[11]  + '</ul>';
    this.formatSubmitted = function(i)
   {
        var ans;
        let isfillblank = this.atd[i][7].includes('___'); 
        this.distinctlink[i] = '';
       if (this.atd[i][6] === '4'|| this.atd[i][8] === '' && !isfillblank) 
        {
            ans =  this.atd[i][8].replace(/^[ ]+/,'').replace(/ .*/, '');
            this.distinctlink[i] =   '<span style="color:blue;background-color:lightyellow;border-radius:3px;padding:2px 3px 2px 3px" onclick=testsheet.byanswer(' + i + ",-2)>" + textmsg[1943].split(/@/)[0] + '</span>'; 
        }
        else if (isfillblank)
        {
            ans = this.makelscore(i);
        }
        else
        {
            ans = formatstr(this.atd[i][8], this.atd[i][6]);
            if (this.atd[i][6]=='1')
            {
                 ans = ans.replace(/^[ ]*<tr>/, '').replace(new RegExp("<.tr>[ ]*$"), '').replace(/^[ ]*<td>/, '&lt; td&gt;').replace(new RegExp("<.td>[ ]*$"), '&lt; /td&gt;') ; 
            }
            if (this.distinct === false)
                this.distinctlink[i] ='';
            else
            this.distinctlink[i] = '<span style="color:blue;background-color:lightyellow;border-radius:3px;padding:2px 3px 2px 3px"  onclick=testsheet.byanswer(' + i + ",-3)>" +(textmsg[1943].replace(/@.*$/,'')) + '</span>';
        }
        ans = this.hw.merge(ans);
        ans = ans.replace(/imagelet([0-9]+)/g, 'imagelet100$1');
        return ans;
     };
     this.formatans = function(qq,fmt,isfillblank)
     {
        if(isfillblank && ( fmt =='1' ||  fmt=='2'))  
            qq = qq.replace(/\n/g,'<br>');
        qq = formatstr(qq, fmt );
        qq = this.hw.merge(qq) ;
        if (qq === 'null') qq = '';
        return qq;
     };
    this.makequestanswer = function()
    {
        var cellw = "200";
        var atype = mat[this.count][12];
        var atype = mat[this.count][datapresentformat == 'DataTable'?11:12];
        var timerace = atype == '4'?textmsg[1309]:textmsg[1310];
        if (this.atd==null || this.atd[0]==null) 
        {
           var zz = retrv(this.count,4); if (zz == '-1' || zz =='-2') zz = textmsg[236];
           this.numq = 0;
           this.atd[0] = ( '0,0,'+ zz + ",S,0," + zz + ",No question. Any attachment?" ).split(/,/);  
        };
        var txt = "";
        var ispic = (retrv(this.count,9) == '6');
        if (this.header.replace(/ /g,'')!='' || this.attachheader.replace(/ /g,'')!='')
        {
           txt +="<table  style=\"margin:3px 0px 9px 0px;border-radius:3px;background-color:" + (ispic?'transparent':'white') + "\" width=99.9%><tr><td  style=\"padding:3px  0px 3px 0px;font-family:inherit\">" + this.header   + (this.header==''?'':'<br>')  + this.attachheader + "</td></tr></table>";
        }
       txt += "<table border=0 id=\"tquestanswer\" width=100%  cellspacing=1 cellpadding=3 style=\"margin:0px;"
        + (  (this.atd[0].length < 11)? 'border-radius:4px;':'')
        + "border-color:" + DBGCOLOR + ";background-color:" + IBGCOLOR +";font-family:inherit;margin-bottom:-20px\" >";
        this.tablename = "tquestanswer";
        this.hw.divs = '';
        this.hw.attachheader = '';
        this.hw.parseAttach(this.attachsub);
        addcss2head(this.count,this.hw.divs, 1);
        var graded = false;
        var havinganswer = true;
        var nosheet = false;
        var sumtime = 0, sumptrs = 0;
        var numanswered = 0; 
        for (var i = 0; i <  this.atd.length; i++)
        {
            if (this.atd[i] == null) continue;
            if (this.atd[i].length == 7)
            {
                let timer = 0;
                if (atype=='4') 
                        timer = parseFloat(sumtime/numanswered).toFixed(2);
                else if (this.atd[i][4] !=null && this.atd[i][4]!='')
                {
                     timer = parseInt(this.atd[i][4]);
                }
                txt += "<tr style=\"background-color:"+ DBGCOLOR +";font-family:inherit\"><td width=5%  class=s1001  >" + (atype==4?"":this.label(textmsg[1857])) + "</td>"
                +  "<td  align=left width=3%  class=s1000 style=color:blue align=left onclick=\"javascript:openlogall()\">" + (4!=atype?((sumtime/60).toFixed(1) + "'"):"") + "</td>"
                + "<td   width=\"5%\"  class=s1000   align=right>" + this.label(textmsg[1760]) + " </td>"
                + "<td   width=\"5%\"   class=s1000   align=left><div id=sumptr style=\"text-align:right;font-weight:700;border:1px #888 solid;width:" + (2*font_size) + "px\">" +   sumptrs + "</div></td>"
                + "<td   width=\"5%\"   class=s1000   align=right>" + this.label(textmsg[1288] +" S=" ) +      "</td>"
                + "<td   width=\"5%\"   class=s1000   align=left><div id=sumsco style=\"text-align:right;color:red;font-weight:700;border:1px #888 solid;width:" + (4*font_size) + "px\" >" + this.atd[i][2].replace(/([0-9]+\..).*/,'$1') + "</div></td>"
                + "<td   width=\"8%\"   class=s1000   align=right>" + this.label(atype=='4'?textmsg[1309]:textmsg[1287] +"T=") +   ""
                +  timer  + (atype=='4'?'':"''") + "</td>"
                + "<td   width=\"5%\"  class=s1000   align=right>" + this.label(textmsg[1285]) + " </td>"
                + "<td   width=\"5%\"   class=s1000    align=left><input class=gradetxt    name=dropn value=\"" + maybeenter(this.atd[i][1],1) + "\" onchange=\"testsheet.updateatd(this, " + i + ", 1);cachethis(this,1)\" style=width:" + (2*font_size) + "px ></td>"
                
                + "<td   width=\"5%\"   class=s1000   align=right>" + this.label(textmsg[1286]) + "</td>"
                +"<td   width=\"33%\"    class=s0100   align=left valign=bottom><input class=gradetxt name=formula value=\"" + maybeenter(this.atd[i][3],2).replace(/^0/,'')   + "\" onchange=\"testsheet.updateatd(this, " + i + ", 3);cachethis(this,2)\" onkeypress=\"return testsheet.catchkey(this," + i + ",event)\"  style=width:" + (8*font_size) + "px;text-align:left >"
                +"</td><td    width=\"5%\"   class=s1100 align=left><input type=text class=GreenButton style=\"font-family:" + myfontname+";width:" + (4*font_size) + "px;text-align:center;\" name=docalc value=\"" + textmsg[1619] + "\" onclick=\"testsheet.updateatd(this.form.formula, " + i + ", 3)\" >"
                + "</td></tr>\n<tr><td class=s0011>" + this.label(textmsg[1358]) + "</td><td colspan=11  class=s0110 >" + this.atd[i][6] + "</td></tr>\n";
        
                this.atd[i][5] = this.thescorebox.value;
                if (this.thescorebox.value == '-1' || this.thescorebox.value =='-2')
                     this.thescorebox.style.color = TBGCOLOR;
                else if (this.atd[i][6]=='')  
                     this.thescorebox.style.color = 'red';
                else
                    this.thescorebox.style.color = 'orange';
            }
            else if (this.atd[i].length == 11)
            {
                sumtime += parseInt(this.atd[i][5]==null?"0":this.atd[i][5]);
                sumptrs += parseInt(this.atd[i][2]); 
                graded = true;
                numanswered++;
               if (  this.atd[i][6] == '4'|| this.atd[i][8] == ''  )
               {
                this.atd[i][7] =  addbreak(this.atd[i][7] );//tt.replace(/\n([a-z][ |\\.|\\)|\]|:])/ig, '<br>$1');
               } 
                var tt = formatstr(this.atd[i][7], this.hw.fmt ); 
                tt = addbreak1(tt);//.replace(/\n([a-z][ |\\.|\\)|\]|:])/ig, '<br>$1');
                tt = this.hw.merge(tt) ;
                let isfillblank = (this.atd[i][7].indexOf('____') >= 0);
                if (isfillblank)
                {  
                    this.hasfillblank = true; 
                    if (this.atd[i][8]!=null && this.atd[i][8]!='' && this.atd[i][8]!=textmsg[1865])
                    tt = mergeunderscore(tt,this.atd[i][8]);//.replace(/</g,'&lt;').replace(/>/g,'&gt;');
                    
                }
                var ans = this.formatSubmitted(i);
                if (this.atd[i][9] === null || this.atd[i][9] === 'null') this.atd[i][9] = "";
                var qq = this.formatans(this.atd[i][9],this.fmt,isfillblank);
                var fts =  this.atd[i][10]==null?'':formatstr(this.atd[i][10], this.fmt );
                if (this.fmt == 0 && fts=='') 
                    fts = '<br>';
                else 
                {
                    fts = this.hw.merge(fts);
                    fts = fts.replace(/imagelet([0-9]+)/g, 'imagelet100$1');
                }
                var fmtops = "<option value=0 " + ( this.atd[i][6]=='0'? 'selected':'') + ">" + textmsg[83] + "</option>"
                           + "<option value=1 " + ( this.atd[i][6]=='1'? 'selected':'') + ">HTML</option>"
                           + "<option value=2 " + ( this.atd[i][6]=='2'? 'selected':'') + ">LaTeXML</option>"
                           + "<option value=3 " + ( this.atd[i][6]=='3'? 'selected':'') + ">" + textmsg[1847] + "</option>"
                    + "<option value=4 " + ( fmt =='4'? 'selected':'') + ">Java</option>"
                           + "<option value=5 " + ( fmt =='5'? 'selected':'') + ">Python</option>"
                           + "<option value=6  >" + textmsg[69] + "Tab</option>";
 
                if (this.atd[i][4]=='-1')this.atd[i][4]="1";
                txt +=   "<tr  style=\"font-family:inherit\"><td  width=5% class=s1001 valign=top  align=center  >" + this.circlebg(font_size,this.atd[i][0]) + "</td>"
                +"<td     class=s1100 valign=top align=left colspan=11>" + tt + "</td></tr>"
                txt += "<tr style=\"font-family:inherit\"><td  align=left  valign=top  width=5%  class=s0001  >" + this.label(this.scorematrix[i]!=null?this.words[13]:(this.atd[i][6] == '4'?this.words[12]:textmsg[139])) + "</td>"
                +"<td   align=left colspan=" + (fmtops==''?11:10) + " style=\"color:purple\"  class=s0" + (fmtops==''?1:0) + "00 >" + ans   + "</td>";
                if (fmtops!='')    txt +=   "<td  width=100  class=s0100  valign=top align=left ><select name=fmtbox" + i + "  onchange=\"testsheet.updateatd(this," + i + ",6)\" class=gradetxt  style=\"border:1px #ddcc99 solid;float:left;background-color:" + DBGCOLOR + ";width:" + (5*font_size) + "px\" >" + fmtops + "</select></td>";
                txt += "</tr>";
                if (isfillblank)
                    txt +=  "<tr height=0 ><td   align=left  valign=top  width=5%   style=padding:0px ></td><td  align=left colspan=11  id=refer" + i + "  style=padding:0px  ></td></tr>";
                else
                    txt +=  "<tr style=\"font-family:inherit\"><td   align=left  valign=top  width=5%   class=s0001  >" +  this.label(textmsg[457]) + "</td><td  align=left colspan=10  id=refer" + i + " class=s0100 >" + qq  + "</td><td  align=center  valign=top  class=s0100 >" + this.distinctlink[i] + "</td></tr>\n";
                txt += "<tr style=\"font-family:inherit\"><td  align=left  valign=top  width=5%   class=s0001  >" +  this.label(textmsg[541]) + "</td>";
                var answerpic = "<span style=\"color:green;font-size:24px\">&check;</span><span style=\"margin:0px 0px 0px -12px;color:red;font-size:24px;font-weight:700\">&bsol;</span>";
                let yy = this.eval1(this.atd[i][3],this.atd[i][2]);
                if (parseFloat(this.atd[i][2]) == yy) 
                    answerpic = "<span style=\"color:green;font-size:24px\">&check;</span>";
                else if (yy === 0)
                    answerpic = "<span style=\"color:red;font-size:24px\">&cross;</span>";
                if (this.atd[i][6] == '4')
                { 
                    this.numismult++;
                }

                txt += "<td valign=top  class=s0000  >" + answerpic + "</td>"; 
                txt += "<td class=s0100 colspan=9 id=comments" + i + "  style=\"font-family:inherit;color:red;border:0px " + BBGCOLOR +" solid;background-color:" + TBGCOLOR+"\"   align=left   onclick=testsheet.goedit(" + i + ")>" + fts + "</td><td id=commentbut" + i + "  style=background-color:" + DBGCOLOR +" align=center><a href=javascript:testsheet.goedit(" + i + ")>&#9998;</a></td>";
                txt += "</tr>";
                txt += "<tr style=\"font-family:inherit\">";
                txt += "<td  align=left  valign=top  width=5%   class=s0011 >" + this.label(timerace) + "</td><td  style=\"text-align:left;padding:3px 7px 3px 3px;color:blue\"  class=s0010  valign=top  width=5%  onclick=\"openlog(" + this.atd[i][0] + ")\">" + (this.atd[i][5]==null?"0":this.atd[i][5])  + (atype==4?"":"''") + "</td>";
                txt += "<td  align=right  valign=top  width=5%   class=s0010 >" + this.label( textmsg[1268]) + "</td><td   align=left  valign=top  width=5%  class=s0010  > <input name=ptsbox" + i + " value=\"" +  this.atd[i][2] + "\"  onfocus=\"this.select()\" onblur=\"testsheet.updateatd(this," + i + ",2)\" class=gradetxt  style=width:" + (2*font_size) + "px ></td>";
                txt += "<td  align=right  valign=top  width=5%   class=s0010   onclick=\"testsheet.switchg(this)\" ><table ><tr><td width=20 style=font-size:12px;color:#0000AA;width:20px align=center>&olarr;</td><td>" +  this.label(textmsg[1311]) + "</td></tr></table></td><td   align=left  valign=top  colspan=5   class=s0010  >";
                if (this.scoreway == 'mouse' && this.atd[i][2].indexOf(".")<0)
                    txt += this.makeradio(i, parseInt(this.atd[i][2]));
                else
                    txt += this.makebox(i);
                   // txt += "<input name=scorebox" + i + " value=\"" +   this.atd[i][3] + "\" onfocus=\"this.select()\" onblur=\"testsheet.updateatd(this," + i + ",3)\"  onkeypress=testsheet.enternum(this,event," +i+") class=gradetxt  style=color:red;width:" + (2*font_size) + "px >";
                txt +=   "</td><td align=right  valign=top  width=5%  class=s0010 >" +  this.label(textmsg[1013]) + "</td><td   width=5% valign=top class=s0110 align=left><input name=objbox" + i + " value=\"" + this.atd[i][4] + "\" onblur=\"testsheet.updateatd(this," + i + ",4)\" class=gradetxt  style=width:" + (4*font_size) + "px ></td>";
                txt += "</tr>";                       
                txt += "<tr height=10><td colspan=12  class=s0000  style=\"background-color:transparent;height:5px\"></td></tr>\n";
            }
            else if (this.atd[i].length == 6) 
            {
                sumptrs += parseInt(this.atd[i][2]); 
                sumtime += parseInt(this.atd[i][5]==null?"0":this.atd[i][5]);
                numanswered++;
                if (i == 0)
                txt += "<tr style=\"font-family:inherit\"><td width=50 align=right  class=s1001  >" + this.label(textmsg[542]) + "</td><td  align=left>" + this.label( textmsg[139]) 
                + "</td><td width=50 align=right>" + this.label(textmsg[408]) + "</td><td width=50   class=s1100  align=right>" + this.label(textmsg[36] + "/" +  textmsg[542]) + "</td></tr>\n";

                txt += "<tr style=\"font-family:inherit\"><td  width=50 "
                + ( i ==  this.atd.length-1? (" class=s0011 "):"" )
                + " align=right>" + this.atd[i][0] + "</td><td align=left>" + formatstr(this.atd[i][1], this.atd[i][3] ) 
                + "</td><td  width=50   align=right>" + ((this.atd[i][5]!='-1')?this.atd[i][5]:'') + "</td>"
                + "</td><td  width=50 "
                + ( i ==  this.atd.length-1? (" class=s0110 "):"" )
                + "   align=right>" + this.atd[i][2] + "</td></tr>\n";
               nosheet = true;
            }
            else  if(this.atd[i].length == 2)
            {
                sumptrs += 1; 
                sumtime = 0;
                numanswered++;
                havinganswer = false;
                if (i == 0)
                    txt += "<tr style=\"font-family:inherit\"><td  width=50  align=right>" + this.label(textmsg[542]) + "</td><td  align=left>" + this.label(textmsg[139]) + "</td></tr>\n";
                var fmt = (typeof(guessFormat)!='undefined')? guessFormat(this.atd[i][1]):0;
                txt += "<tr style=\"font-family:inherit\"><td align=right>" + this.atd[i][0] + "</td><td   align=left>" + formatstr(this.atd[i][1], fmt ) + "</td></tr>\n";
            }
            else  
            {
                return this.content;
            }
        }
        txt += "</table>";
        if (havinganswer == false)
            txt += "<font size=2>*" + textmsg[1355] + "</font>";
        this.sumptrs = sumptrs;
        return  (txt);
    };
    this.doavg = function(td)
    {
        let tbl = td.parentNode.parentNode.parentNode;
        if (tbl.tagName.toLowerCase() !== 'table') tbl = tbl.parentNode;
        let R = this.temp.length; let ts = 0, nr=0;
        for (let r=0; r <  R; r++)
        {
            let s = 0; let yx = document.getElementById('e' + r).value; 
            if (  !isNaN1(yx)) s = parseFloat(yx);
            ts += this.temp[r].length * s;
            nr += this.temp[r].length;
        }
        td.nextSibling.innerHTML = (''+(ts/nr).toFixed(2)).replace(/([0-9])\.[0]+$/,'$1').replace(/(\.[0-9])0$/,'$1').replace(/^[0]*\.[0]*$/,'0');
        document.getElementById('doavg').style.color = 'black';
        document.getElementById('doavg').nextSibling.style.color = 'black';
    };
    this.makecomments = function(dims)
    {
        var het = dims[1];
        var wd = dims[0] - 2;
        var cellw = "200";
        var atype = mat[this.count][datapresentformat == 'DataTable'?11:12];
        var timerace = atype == '4'?textmsg[1309]:textmsg[1310];
        if (this.atd==null || this.atd[0]==null) 
        {
           var zz = retrv(this.count,4); if (zz == '-1' || zz =='-2') zz = textmsg[236];
           this.numq = 0;
           this.atd[0] = ( '0,0,'+ zz + ",S,0," + zz + ",No question. Any attachment?" ).split(/,/);  
        };
        var txt = "";
        var vv = this.attachheader.replace(/ /g,'')!='';
        if (this.header.replace(/ /g,'')!='' || vv)
        {
           txt +="<table  style=\"width:" + wd + "px;position:absolute;left:110px;top:105px;z-index:3;margin:" + (vv?3:0) + "px 0px 9px 0px;border-radius:" + (vv?3:0) + "px;background-color:transparent\" width=99.9%  ><tr><td  style=\"padding:" + (vv?3:0) + "px  0px " + (vv?3:0) + "px 0px;font-family:inherit\">" +   this.attachheader  + "</td></tr></table>";
        }
       
        this.tablename = "tquestanswer";
        this.hw.divs = '';
        this.hw.attachheader = '';
        this.hw.parseAttach(this.attachsub);
        addcss2head(this.count,this.hw.divs, 1);
        var hti = het/this.atd.length; 
        var graded = false;
        var havinganswer = true;
        var nosheet = false;
        var sumtime = 0, sumptrs = 0;
        for (var i = 0; i <  this.atd.length; i++)
        {
            if (this.atd[i] == null) continue;
            if (this.atd[i].length == 13)
            {
                sumtime += parseInt(this.atd[i][5]==null?"0":this.atd[i][5]);
                sumptrs += parseInt(this.atd[i][2]);
                graded = true;
                if (this.atd[i][4]=='-1')this.atd[i][4]="1";
                var fts =  formatstr(this.atd[i][10], this.fmt );
                if (this.fmt == 0 && fts=='') 
                    fts = '<br>';
                else 
                {
                    fts = this.hw.merge(fts);
                    fts = fts.replace(/imagelet([0-9]+)/g, 'imagelet100$1');
                }
               
                if (fts == '') fts = '&nbsp;';
                txt += "<div id=mov" + i + " style=width:360px;z-index:3;position:absolute;left:100px;top:" + (het*i/this.atd.length + 170) + "px><table cellspacing=0 cellpadding=0><tr><td class=s0100 colspan=5 id=comments" + i + "  style=\"font-family:inherit;color:red;border:1px " + BBGCOLOR +" solid;background-color:" + TBGCOLOR+"\"   align=left   onclick=testsheet.goedit(this,1)>" + fts + "</td>"
                +"</tr><tr><td  width=5% class=s1001 valign=top  align=center  >" + this.circlebg(font_size,this.atd[i][0]) + "</td><td  align=right  valign=top  width=5%   class=s0010 >" + this.label( textmsg[1268]) + "</td><td   align=left  valign=top  width=5%  class=s0010  > <input name=ptsbox" + i + " value=\"" +  this.atd[i][2] + "\"  onfocus=\"this.select()\" onblur=\"testsheet.updateatd(this," + i + ",2)\" class=gradetxt  style=width:" + (2*font_size) + "px ></td>";
                txt += "<td  align=right  valign=top  width=5%   class=s0010  onclick=\"testsheet.switchg(this)\">" +  this.label(textmsg[1311]) + "</td><td   align=left  valign=top    class=s0010  >";
                if (this.scoreway == 'mouse' && this.atd[i][2].indexOf(".")<0)
                    txt += this.makeradio(i, parseInt(this.atd[i][2]));
                else
                    txt += this.makebox(i);
                   // txt += "<input name=scorebox" + i + " value=\"" +   this.atd[i][3] + "\" onfocus=\"this.select()\" onblur=\"testsheet.updateatd(this," + i + ",3)\"  onkeypress=testsheet.enternum(this,event," +i+") class=gradetxt  style=color:red;width:" + (2*font_size) + "px >";
                txt +=   "</td></tr></table></div>\n";
            }
            else if (this.atd[i].length == 8) 
            {
                txt += "<div style=position:absolute;left:0px;top:" + (het*i/this.atd.length) + "px><table><tr><td  align=right  valign=top  width=5%   class=s0010 >" + this.label( textmsg[1268]) + "</td><td   align=left  valign=top  width=5%  class=s0010  > <input name=ptsbox" + i + " value=\"" +  this.atd[i][2] + "\"  onfocus=\"this.select()\" onblur=\"testsheet.updateatd(this," + i + ",2)\" class=gradetxt  style=width:" + (2*font_size) + "px ></td>";
                txt += "<td  align=right  valign=top  width=5%   class=s0010  onclick=\"testsheet.switchg(this)\">" +  this.label(textmsg[1311]) + "</td><td   align=left  valign=top    class=s0010  >";
                if (this.scoreway == 'mouse' && this.atd[i][2].indexOf(".")<0)
                    txt += this.makeradio(i, parseInt(this.atd[i][2]));
                else
                    txt += this.makebox(i);
                txt +=  "</td></tr></table></div>\n";
                nosheet = true;
            }
            else  if(this.atd[i].length == 2)
            {
                havinganswer = false;
            }
            else if (this.atd[i].length == 7)
            {
                txt += "<table style=z-index:3 cellspacing=0><tr style=\"background-color:"+ DBGCOLOR +";font-family:inherit\">"
                + "<td   width=\"5%\"  class=s1001   align=right>" + this.label(textmsg[1760]) + " </td>"
                + "<td   width=\"5%\"   class=s1000   align=left><div id=sumptr style=\"text-align:right;font-weight:700;border:1px #888 solid;width:" + (2*font_size) + "px\">" +   sumptrs + "</div></td>"
                + "<td   width=\"5%\"   class=s1001   align=right>" + this.label(textmsg[1288] +" S=" ) +      "</td>"
                + "<td   width=\"5%\"   class=s1000   align=left><div id=sumsco style=\"text-align:right;color:red;font-weight:700;border:1px #888 solid;width:" + (2*font_size) + "px\" >" + this.atd[i][2] + "</div></td>"
                + "<td   width=\"5%\"  class=s1001   align=right>" + this.label(textmsg[1285]) + " </td>"
                + "<td   width=\"5%\"   class=s1000    align=left><input class=gradetxt    name=dropn value=\"" + maybeenter(this.atd[i][1],1) + "\" onchange=\"testsheet.updateatd(this, " + i + ", 1);cachethis(this,1)\" style=width:" + (2*font_size) + "px ></td>"
                
                + "<td   width=\"5%\"   class=s1001   align=right>" + this.label(textmsg[1286]) + "</td>"
                +"<td     class=s0100   align=left><input class=gradetxt name=formula value=\"" + maybeenter(this.atd[i][3],2).replace(/^0/,'')   + "\" onchange=\"testsheet.updateatd(this, " + i + ", 3);cachethis(this,2)\" onkeypress=\"return testsheet.catchkey(this," + i + ",event)\"  style=width:" + (8*font_size) + "px;text-align:left >"
                +"</td><td   class=s1100 align=left>" + (!this.isfortable?"":("<table><tr><td>")) + "<input type=text class=GreenButton style=\"font-family:" + myfontname+";width:" + (4*font_size) + "px;text-align:center;\" name=docalc value=\"" + textmsg[1619] + "\" onclick=\"testsheet.updateatd(this.form.formula, " + i + ", 3)\" >"
                + (!this.isfortable?"":("</td><td>*</td><td id=tn5  style=\"text-align:right;font-weight:700;border:1px #888 solid;width:" + (2*font_size) + "px\">" + mat[this.count][5] + "</td></tr></table>")) 
                + "</td></tr>\n<tr><td class=s0011>" + this.label(textmsg[1358]) + "</td><td colspan=11  class=s0110 >" + this.atd[i][6] + "</td></tr></table>\n";
        
                this.atd[i][5] = this.thescorebox.value;
                if (this.thescorebox.value == '-1' || this.thescorebox.value =='-2')
                     this.thescorebox.style.color = TBGCOLOR;
                else if (this.atd[i][6]=='')  
                     this.thescorebox.style.color = 'red';
                else
                    this.thescorebox.style.color = 'orange';
            }
            
        }

        dims[2] = this.atd.length-1;
        return  (txt);
        //return this.hw.merge(txt);
    };
    this.cacheentered = function(n)
    {
       if (n == null) n = this.count;
        
       localStorage['grading'+semester + '_' + mat[n][0]  + '_' + mat[n][1] + '_' + mat[n][2]] = 
              JSON.stringify ([retrv(n,4), retrv(n,13),retrv(n,7), (''+(new Date()).getTime()).replace(/.....$/,'')]);
    };
    this.scoreway = localStorage['scoreway']; 
    this.switchg = function(td)
    {
        if (this.scoreway == null || this.scoreway == 'key')
            this.scoreway = 'mouse';
        else
            this.scoreway = 'key';
        localStorage['scoreway'] = this.scoreway; 
        var tb = td.parentNode.parentNode.parentNode;
        for (var i=0; i < this.numq; i++)
        {
            var xx = parseFloat(this.atd[i][2]);
            if (xx != Math.floor(xx))
                var able = 0;
            else
            {
                able = parseInt(this.atd[i][2]);
            }
            var td = tb.rows[6*i + 4].cells[5];
            if (this.scoreway == 'key' || able == 0) 
            {
                td.innerHTML = this.makebox(i);
            }
            else
            {
                td.innerHTML = this.makeradio(i,able);
            }
        }
    };
    this.markdid = function(txt,i,j)
    {   
       let key = this.count + '_' + i; 
       if (j!==null) key += '_' +j;
       TestSheet.did[key] = 1;
       txt.style.color='rgb(0,0,0)';
       txt.style.borderWidth= '1px';
       txt.style.borderColor= '#bbbb88'; 
       txt.style.className ='gradetxt';
    };
    this.makebox = function(i)
    {
        let key = this.count + '_' + i;
        let cl = TestSheet.did[key]===1?0:255;
        let c1 = 'rgb(' + cl + ',0,0)';
        if (cl === 0) c1 = '#bbbb99';
        let yy = this.eval1(this.atd[i][3],this.atd[i][2]);
        console.log(this.atd[i][3] + ' ####> ' + yy);
        return "<input name=scorebox" + i + " value=\"" + yy.toFixed(1).replace(/([0-9])\.[0]+$/,'$1').replace(/^[0]*\.[0]*$/,'0').replace(/(\.[0-9])0$/,'$1') + "\" onfocus=\"this.select()\" onblur=\"testsheet.updateatd(this," + i + ",3);testsheet.markdid(this," + i + ")\"  onkeypress=testsheet.enternum(this,event," +i+") class=gradetxt  style=\"border-color:" + c1 + ";color:rgb(" + cl + ",0,0);width:" + (2.5*font_size) + "px;padding:1px 3px 1px 2px\" >" + (i<this.numq-1?(this.skipbut(i)):"");
    };
    this.makeradio= function(i,ptr)
    {
            var str = '<input id=hiddenbox'  + i +' name=scorebox' + i + ' type=hidden value="' +   this.eval1(this.atd[i][3],this.atd[i][2]) + '" >';
            for (var k=0; k <= ptr; k++)
            {
                let yy = this.eval1(this.atd[i][3],this.atd[i][2]);
                var sel = (yy == "" + k? "checked":"");
                var clr = (yy == "" + k? "red":"black");
                str += "<input type=radio name=scoresel" + i + " onclick=\"testsheet.selval(" + i + "," + k + "," + ptr + ",this);document.getElementById('hiddenbox" + i + "').value='" + k +"';testsheet.updateatd(document.getElementById('hiddenbox" + i + "')," +i +",3)\" value=" + k + " " + sel + "><span id=ra" + k + "_" + i +" style=color:" + clr + ";font-weight:700 >" + k + (k < ptr?"</span>&nbsp; ":"</span>");
            }
            return  str ;
    }
    this.selval = function(i, k, ptr, ta)
    {
        for (var j=0; j <= ptr; j++)
        {
            var lbl = document.getElementById('ra' + j + '_' + i);
            if (j == k) 
            {
                lbl.style.color = 'red';
            }
            else
            {
                lbl.style.color = 'black';
            }
        }
        var tr = ta.parentNode.parentNode;
        var tb = tr.parentNode.parentNode;
        k=0; for(;tb.rows[k]!=tr; k++);
        //if (k > 3) tb.rows[k-3].cells[1].style.backgroundColor = 'white';  
        var len = 0;
        for (var j=0; j < 6 && k < tb.rows.length; j++,k++)
        {
            len += tb.rows[k].offsetHeight;
        }
           
        if (i < this.numq-1)
        {
            window.scrollBy(0, len);
            tb.rows[k-3].cells[1].style.backgroundColor = '#eeccbb'; 
            this.temptd = tb;
            setTimeout('testsheet.temptd.rows[' + k + '-3].cells[1].style.backgroundColor = null', 4000);
        }
    }
    this.temptd = null;
    this.print = function(x)
    {
        var cellw = "200";
        var atype = mat[this.count][datapresentformat == 'DataTable'?11:12];
        var timerace = atype == '4'?textmsg[1309]:textmsg[1310]; 
        var txt  = "<table id=\"tquestanswer" + x + "\"   width=100% style=\"margin:0px 0px 0px 0px;border:1px #b0b0b0 solid;border-collapse:collapse\">";
        if (this.header.replace(/ /g,'')!='' || this.attachheader.replace(/ /g,'')!='')
        {
           txt  +="<tr><td colspan=10>" + this.header   + (this.header==''?'':'<br>')  + this.attachheader + "</td></tr>";
        }
        this.tablename = x;
        var graded = false;
        this.hw.divs = '';
        this.hw.attachheader = '';
        this.hw.parseAttach(this.attachsub);
        
        var sid = printingw.document.getElementById('style1_' + this.count);
        if (sid==null)
        {
            sid = document.createElement('style');
            sid.id = 'style1_' + this.count;
            sid.type = 'text/css';
            printingw.document.getElementsByTagName('head')[0].appendChild(sid);
        }
        sid.innerHTML = this.hw.divs;
        
        let sumorder = 0, sumitem = 0;
        for (var i = 0; i < this.atd.length; i++)
        {
            if (this.atd[i] == null) continue;
            if (this.atd[i].length == 11)
            {
                graded = true;
                sumitem++;
                sumorder += parseInt(this.atd[i][5]==null?"0":this.atd[i][5]);
                txt += "<tr height=40><td colspan=5></td></tr><tr ><td  width=0% valign=top align=center>" + this.circlebg(font_size,this.atd[i][0])+ " </td>";
                var tt =  addbreak(this.atd[i][7]);
                
                var tt = formatstr(tt, this.fmt ); 
                tt = addbreak1(tt );
                tt = this.hw.merge(tt);
                if (tt.indexOf('____') >= 0)
                {  
                    
                    tt = mergeunderscore(tt,this.atd[i][8])//.replace(/</g,'&lt;').replace(/>/g,'&gt;');
                    this.atd[i][8] = this.atd[i][8].replace(/\n/g,' / ');
                }
                var ans = formatstr(this.atd[i][8], this.atd[i][6]);
                ans = this.hw.merge(ans).replace(/imagelet([0-9]+)/g, 'imagelet100$1');
                var qq =  formatstr(this.atd[i][9], this.fmt );
                qq = this.hw.merge(qq);
                var fts =  formatstr(this.atd[i][10], this.fmt );
                fts = this.hw.merge(fts).replace(/imagelet([0-9]+)/g, 'imagelet100$1');
                txt += "<td  align=left colspan=3>" + tt
                        + "</td></tr>\n<tr><td    width=0% valign=top align=left>" + this.label(textmsg[139]) + "</td><td  align=left colspan=3 style=\"color:purple\">" + ans
                        + "</td></tr>\n<tr><td    width=0% valign=top align=left>" + this.label(textmsg[457]) + "</td><td  align=left colspan=3>" + qq
                        +  "</td></tr>\n<tr><td     width=0% valign=top align=left>" + this.label(textmsg[541]) + "</td><td  align=left colspan=3  style=\"color:#FF0000\">";
                if (this.atd[i][6] != '4')
                    txt +=  fts;
                else
                {  
                  
                    txt += ((parseFloat(this.atd[i][2]) == parseFloat(this.atd[i][3]))? "<span style=\"color:green;font-size:24px\">&check;</span>":"<span style=\"color:red;font-size:24px\">&cross;</span>") + fts;
                    this.numismult++;
                }
                txt += "</td></tr>\n<tr><td    width=0% valign=top align=left>" + this.label(timerace) + ": </td><td  align=left width=10% >" + (this.atd[i][5]==null?"":this.atd[i][5])  + (atype=='4'?"":"''") 
                        + "</td><td  align=right width=0%  > " + this.label(textmsg[1311]) + ": </td><td  align=left style=color:#FF0000 width=90% ><nobr>";
                let sm = '';
                if (this.atd[i][3].includes('+'))  
                    sm = ' = ' + this.eval1(this.atd[i][3],this.atd[i][2]);
                txt +=   this.atd[i][3]  +  sm +  ' / ' + this.atd[i][2];
                txt += "</nobr></td><tr height=10px><td colspan=4> <!-- --></td></tr>\n";
            }
            else if (this.atd[i].length == 6)
            {
                sumitem++;
                sumorder += parseInt(this.atd[i][5]==null?"0":this.atd[i][5]);
                if (i == 0)
                    txt += "<tr><td  align=right>" + this.label( textmsg[542]) + "</td><td  align=left>" + this.label(textmsg[139]) + "</td><td align=right>" + this.label(textmsg[36]) + "</td></tr>\n";

                txt += "<tr><td  >" + this.atd[i][0] + "</td><td>" + formatstr(this.atd[i][1], this.atd[i][2], "black", font_size) + "</td><td>" + this.atd[i][3] + "</td></tr>\n";
            }
            else if (this.atd[i].length == 2)
            {
                sumitem++;
                sumorder =0;
                if (i == 0)
                    txt += "<tr><td  align=right>" + this.label(textmsg[542]) + "</td><td  align=left>" + this.label(textmsg[139] )+ "</td></tr>\n";
                var fmt = (typeof(guessFormat)!='undefined')? guessFormat(this.atd[i][1]):0;
                txt += "<tr><td   align=right>" + this.atd[i][0] + "</td><td   align=left>" + formatstr(this.atd[i][1], fmt ) + "</td></tr>\n";
            }
            else if (this.atd[i].length == 7)
            {
                
                txt += "<tr><td    colspan=2>" + this.label(textmsg[560]) + " Q=" + this.atd[i][0] 
                        + "</td><td  colspan=2 >" + this.label(textmsg[1285]) + " D=" + this.atd[i][1] 
                        + "</td><td    colspan=2>" + this.label(textmsg[1288]) + " S=" + this.atd[i][2] + "</td>"
                        + "<td     colspan=3 >" +  this.label(atype=='4'?textmsg[1309]:textmsg[1287]) + " <nobr> T=" + (atype!='4'?this.atd[i][4]: (sumorder/sumitem).toFixed(2)) + "</nobr></td>"
                        + "<td     colspan=1>" +  textmsg[1286]  + " F="     + this.atd[i][3] + "</td>"
                        + "</tr>\n";

            }
        }

        txt += "</table>";

        return txt;
    }
    this.isfortable = (datapresentformat == 'DataTable');
    this.makesheet = function()
    {
        var jj = 5;
        var y = ""; 
        this.tablename = "tquestanswer";
        var tpts = 0, tscore=0;
        for (var i = 0; i < this.atd.length-1; i++)
        {
            if (  isNaN1(this.atd[i][0]))
                continue;
            y += "<tr><td align=right bgcolor=" + TBGCOLOR + ">" + this.atd[i][0] + "</td><td  bgcolor=" + TBGCOLOR + " align=right><input tabindex=" + jj + " name=ptsbox" + i + " value=\"" +
                    this.atd[i][this.istest?2:1] + "\" onblur=\"testsheet.updateatd(this," + i + "," + (this.istest?2:1) + ")\"  style=\"color:black;width:30px;border:1px #ddcc99 solid;text-align:right;padding:1px 3px 1px 2px\"   ></td><td  bgcolor=" + TBGCOLOR + " align=right><input tabindex=" + (jj + 1) + " name=scrbox" + i + " value=\"" +
                    this.atd[i][this.istest?3:2] + "\" onblur=\"testsheet.updateatd(this," + i + "," + (this.istest?3:2) + ")\"  style=\"color:red;width:30px;border:0px;text-align:right\" ></td></tr>\n";
            tpts += parseFloat(this.atd[i][this.istest?2:1]);
            tscore += parseFloat(this.atd[i][this.istest?3:2]);
        }
        if (y != "")
        {
          
            y = "<table  id=\"tquestanswer\"   align=center width=\"100%\" cellspacing=1 cellpadding=3 border=1 style=\"border-color:" + IBGCOLOR + ";border-collapse:collapse;\"><tr style=background-color:" + IBGCOLOR + ";color:#DDCC11><td width=20% style=\"background:" + gradientbg.replace(/\(/,'(to right,') + ";font-size:14px\" align=right>#</td><td width=40% style=\"background:" + gradientbg.replace(/\(/,'(to right,') + ";font-size:14px\" align=right>"
                + textmsg[1268].replace(/(.....).*/,'$1') + "</td><td width=40% style=\"background:" + gradientbg.replace(/\(/,'(to right,') + ";font-size:14px;\" align=right>" + textmsg[1311] + "</td></tr>\n"
                + y;
           if(this.isfortable)
           y += "<tr style=background-image:linear-gradient("+BBGCOLOR+','+TBGCOLOR+");font-weight:700><td width=20% style=font-size:14px align=right>&Sigma;</td><td width=40% style=font-size:14px;font-weight:700 align=right>"
            + tpts + "</td><td width=40% id=sumscore style=font-size:14px;font-weight:700;color:red align=right>" + tscore.toFixed(1) + "</td></tr>\n";
        
           y += "</table>";
        }
        this.sumptrs = tpts;
        return y;
    }

    this.formatstr = function(str, format)
    {
         
        if (str != null && format == "0")
            return  str.replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\r\n/g, "<br>").replace(/\r/g, "<br>").replace(/\n/g, "<br>");
        else if (str!=null && format == "2")
            return str;// latex2html1(str, "red", font_size+3);
        return str;
    }
    this.contentparse = new CSVParse('', "|", ",", ";");
    this.makeback = function()
    {
        
        if (this.atd == null || this.atd.length == 0)
            return;
 
        //setv(this.count, this.assessbox, y);
        if (this.istest)
        {
            var str = this.arrtoString("|", ",", ";");
            setv(this.count,this.subassessbox, str);
            this.cacheentered();
        }
        else
        {
            var y = '';
            for (var i = 0; i < this.atd.length; i++)
            {
                if (this.atd[i] == null) continue;
                if (y != '')  y += ";";
                 y += this.atd[i][0] + "," + this.atd[i][1] + "," + (this.atd[i][2]);
            }
            setv(this.count,this.subassessbox, y);
            this.cacheentered();
        }
        if (this.istest == false || this.complete) 
        this.normalize();

    }
    this.enternum = function(ta,evt,j)
    {
         var e = evt? evt : window.event;
         if(!e) return true;
         var key = 0;
         if (e.keyCode)
         {
             key = e.keyCode;
         } // for moz/fb, if keyCode==0 use 'which'
         else if (typeof(e.which)!= 'undefined')
         {
             key = e.which;
         }
         if ( isNaN1(ta.value))
         {
             return false;
         } 
         if (key == 13)
         {
             this.updateatd(ta,j,3);
             if (j < this.numq-1)
             {
                 var tr = ta.parentNode.parentNode;
                 var tb = tr.parentNode.parentNode;
                 var k=0; while (tb.rows[k] != tr) k++;
                 
                 var len = 0;
                 for (var i=0; i < 6; i++,k++)
                 {
                     len += tb.rows[k].offsetHeight;
                 }
                 window.scrollBy(0, len);
                 tb.rows[k].cells[5].getElementsByTagName('input')[0].focus();
                 tb.rows[k].cells[5].getElementsByTagName('input')[0].select();
             }
         }
         return true;
    }
    this.latex = function()
    {

        var t = document.getElementById(this.tablename);
        
        if (t!=null)
        for (var i =0; i < t.rows.length; i++)
        {
            if (t.rows[i].cells.length > 1)
            {
                LaTexHTML.reformat(t);
                break;
            }
            var tt = t.rows[i].cells[0].getElementsByTagName("table");
            if (!tt || tt.length == 0) continue;
            tt = tt[0];
            for (var j=0; j < tt.rows.length; j++)
            {
                if ( (tt.rows[j].cells.length  == 2||tt.rows[j].cells.length  == 3) && (typeof(guessFormat)=='undefined' || guessFormat(tt.rows[j].cells[1].innerHTML) == 2))
                {
                    LaTexHTML.reformat(tt.rows[j].cells[1]);
                }
            }
        }
    }
    this.makeatd(this.content, this.sheet, this.assess, this.istest);

 
this.mdiv = null;
this.oldmiv = null;
this.tds = new Array();
this.copysubmittedtext = function(k)
{
    var thetxtarea = document.getElementById('txt'+k); 
    if (thetxtarea!=null)
    {
         thetxtarea.value += this.atd[k][8];
        // thetxtarea.onfocus();
    }
    
}

this.goedit = function(k,z)
{
    if (this.currentcommenting>-1)
    {
        this.updateatd(document.getElementById('txt' + this.currentcommenting), this.currentcommenting, 10);
        let x = document.getElementById('commentbut' + this.currentcommenting);
        if (x!=null)
        {
            x.innerHTML = '&#9998;';
            if (z!=null)
                x.onclick=function(){testsheet.goedit(document.getElementById(this.id.substring(10)),1);}
            else
                x.onclick=function(){testsheet.goedit(document.getElementById(this.id.substring(10)));}  
        }
    }
    let td = document.getElementById('comments' + k);
    if (td.innerHTML.toLowerCase().indexOf("<textarea")>=0)
        return;
    td.onclick = null;
    this.currentcommenting = k;
    LaTexHTML.deformat(td);
    var inht = td.innerHTML.replace(/^[\n|\s]+/,'').replace(/[\s|\n]+$/,'');
    td.innerHTML = ''; 
    var y = td.offsetHeight - 4;
    if (y < 100) y =100;
    var len = Math.round(4.5*font_size);
    td.style.padding = "0px 0px 0px 0px";
    if(this.atd[k][10]==null) this.atd[k][10] =''; 
    var x = td.offsetWidth - 60;
    var edt  =  "<textarea id=txt" + k + "   style=\"margin:0px 0px -3px 0px;font-family:inherit;display:inline;border:0px #c0c0c0 solid;background-color:white;color:black;height:" + y +"px;width:" + x +"px;font-size:"
        + font_size + "px;padding:2px 3px 2px 4px\" "
    + " onkeypress=\"return displaytxt(this,event," + k   +")\""
    + ">"  +  this.atd[k][10].replace(/</g, "&lt;") +  "</textarea>"; 
    td.innerHTML = edt;
    var txt = document.getElementById("txt" + k  );
    var buts = "<table cellpadding=0 cellspacing=0>";
    if (z==null)buts += "<tr><td><input type=button class=GreenButton onMouseOver=\"showmyhintstr(textmsg[1770])\"  onMouseOut=\"hidemyhint()\" style=\"padding-top:3px;padding-bottom:3px;width:" + len + "px\" value=\"" + textmsg[1629] + "\" onclick=\"hidemyhint();testsheet.copysubmittedtext(" + k   +")\"></td></tr>";
    buts += "<tr><td><input type=button class=GreenButton onMouseOver=\"showmyhintstr(textmsg[1767])\"  onMouseOut=\"hidemyhint()\" style=\"padding-top:3px;padding-bottom:3px;width:" + len + "px\" value=\"" + textmsg[1357] + "\" onclick=\"hidemyhint();testsheet.passto(" + k   +")\"></td></tr>";
    buts += "<tr><td><input type=button class=OrangeButton onMouseOver=\"showmyhintstr(textmsg[1769])\"  onMouseOut=\"hidemyhint()\" style=\"padding-top:3px;padding-bottom:3px;width:" + len + "px\" value=\"" + textmsg[1628] + "\"onclick=\"hidemyhint();toclass(" + k + ");testsheet.passto(" + k   +")\"></td></tr>";
    
    if (this.atd[k][9]==null || this.atd[k][9].replace(/ /g,'')=='') 
    { 
        buts += "<tr><td><input type=button class=RedButton onMouseOver=\"showmyhintstr(textmsg[1768])\"  onMouseOut=\"hidemyhint()\" style=\"padding-top:3px;padding-bottom:3px;width:" + len + "px\" value=\"" + textmsg[1706] + "\"onclick=\"testsheet.passtoasanswer(" + k   +");toclassasanswer(" + this.count + ",testsheet.answer)\"></td></tr>";
    }
    buts += "</table>";
    document.getElementById('commentbut'+ k).innerHTML = buts;
    textareatobesearch = txt;
    thecurrenttxtarea = txt;
    onlinetoolbar(txt);
    txt.focus();
     
    unifonts(td, myfontname);  
    
};


this.passto = function(k) 
{
   this.updateatd(document.getElementById('txt'+k),k,10);
   var a = document.createElement('a');
   a.href= "javascript:testsheet.goedit(" + k + ")";
   a.innerHTML = "&#9998;";
   var td = document.getElementById('commentbut'+k);
       
   td.appendChild(a);
         
   let b = td.childNodes;
   if (b!==null)
   td.removeChild(b[0]);  
 };

this.passtoasanswer = function(k) 
{
   var txt = document.getElementById('txt'+k).value;
   var edt  = txt.replace(/^[ ]+/, '').replace(/[ ]+$/,'');
   var gs = guessFormat(edt);
   if (this.atd[k][9].replace(/ /g,'').replace(/null/g,'')==''  ) 
       this.atd[k][9] = edt;
   var j = this.mapback[k];
   
   //if (this.hw.answqrr[j]==null || this.hw.answqrr[j]=='')
   {
      this.hw.answqrr[j] = edt; 
      var str = "";
      for (var i=0; i < this.hw.answqrr.length; i++)
      {
          if (this.hw.answqrr[i]!=null && this.hw.answqrr[i]!='')
          { 
              if (str!='') str += "\n\n";
              str +=  i + "." + this.hw.answqrr[i].replace(/\n([0-9]+)/g,'\n $1');
          }
      }
      this.answer = str;
      var ele = document.getElementById('refer' + k) ;
       
      ele.innerHTML = formatstr(edt,''+gs);
      if (''+gs == '2') LaTexHTML.reformat(ele);
   }
}

}

function FreeFormat(n, contentindex1, formatindex1,scoreindex1, attachindex1, questionindex1,answerindex1,qformatindex1,qattachindex1)
{
    this.n = n;
    this.contentindex = contentindex1;
    this.formatindex= formatindex1;
    this.scoreindex= scoreindex1;
    this.attachindex = attachindex1;
    this.questionindex = questionindex1;
    this.answerindex = answerindex1;
    this.qformatindex = qformatindex1;
    this.qattachindex = qattachindex1;
    this.hwattach = null; 
    this.mergesubmitted = function(fmt)
{
    
    if (fmt==null) fmt = retrv(this.n,this.formatindex);
    
    var hw = new Hwtake('grade', '', '', ResizeUploaded.unzip(retrv(this.n,this.attachindex)).replace(/,([0-9]+)@/g, ',100$1@'), '', '', this.n);
    addcss2head(this.n, hw.divs, '1');
     
    //attheader = hw.attachheader;
     
    var xx = retrv(this.n,this.contentindex);
    
    if ( fmt != '0')
    {
         xx = checkh(xx, true);
         needtranslator = true;
    }
     
    xx = formatstr(addbreak(xx, 1), fmt);
    
    xx = xx.replace(/\/\/\/\/([^<]+)/g, "<font color=red>//$1</font>");
    xx = xx.replace(/<scr.pt/ig, "&lt;script").replace(/<\/script/ig, "&lt;/scr" + "ipt");
    var y = '';
    if (hw.attachheader!='' && rdapname == 'gradingtb')
    y = "<table style=\"width:80%;margin:0px 0px 0px 0px;font-family:inherit;\" cellpadding=3 cellspacing=1><tr><td><img src=\"image/clip.png\" width=28 >" + hw.attachheader + "</td></tr></table><div style=width:100%;height:5px;background-color:transparent></div>";
    
    return y +  this.fmtopt(fmt) +  hw.merge(addbreak1(xx)).replace(/imagelet([0-9]+)/g, 'imagelet100$1');
};

this.propagate = function()
    {
        let mm0 =  mat[this.count][6].toLowerCase().replace(/ /g,'');
        let affected  =[];
        let M = retrv(this.count,4);
        let nn = 0;
        let oldcount=0,oldsum = 0,nowcount = 0, nowsum = 0;
        for (var n = 0; n < numRows; n++)
        {
            if (n===this.count ||mat[n][1] !== mat[this.count][1] || mat[n][0] !== mat[this.count][0] || mat[n][20] !== mat[this.count][20])
                continue;
            let grade = parseFloat(mat[n][4]);
            
            let mm =  mat[n][6].toLowerCase().replace(/ /g,'');
            if (valuechanged[n] === false)continue;
            let nowg = parseFloat(''+retrv(n,4));
            if (nowg < 0) continue;
            if (grade >= 0) {oldcount++; oldsum += graded;}
            nowsum += nowg;
            nn++;
            TestSheet.affect[n + "|" + mat[n][2] + "|" +  mat[n][10]] = retrv(n,4);
            this.cacheentered(n);
            let cv = '<tr style=background-color:'+TBGCOLOR+'><td align=center><input type=checkbox onclick="javascript:valuechanged[' + n + '] =this.checked"  checked  ></td><td><a href=javascript:populate('+ n + ')>' +  mat[n][2] + '</a></td><td><a href=javascript:parent.frames[1].populate('+n + ')><nobr>' +  mat[n][10] + '</nobr></a></td>' 
                  +'<td align=right style=color:#777 > ' + (graded < 0? '':(''+graded)) + '</td><td align=right> ' +  retrv(n,4) + '</td></tr>';
            
            affected.push(cv);
        }
       
        if (affected.length>1 && affected.length < 30)
        {
            let ht =  '<tr><td class=tblhead align=center></td><td class=tblhead>' + labels[2] + '</td><td class=tblhead>' + labels[10] + '</td><td class=tblhead colspan=2>' 
                     + labels[4] + '</td><td class=tblhead >' + textmsg[1358] + '</td></tr>';
            let tb = "<table cellpadding=4 width=100% border=1 style=\"border-collapse:collapse;border-color:#ddcc99;\">" 
            + ht;
            for (let j=0; j < affected.length; j++)
              tb+= affected[j];
            tb += '<tr style=background-color:lightyellow ><td colspan=3 align=center >' + nn + '</td><td  align=right>' 
            + (oldcount===0?'':(''+ (oldsum/oldcount).toFixed(1))) + '</td><td  align=right>' 
            + (nn===0?'':(''+ (nowsum/nn).toFixed(1))) + '</td></tr>'
            + "</table>";
            myprompt(tb, null, 'if(v)setaction(1)', mat[this.count][0] +'-' + mat[this.count][20] + ': ' + mat[this.count][1]);
        }
        else if (affected.length>=30)
        {
            let ht =  '<tr><td class=tblhead align=center></td><td class=tblhead>' + labels[2] + '</td><td class=tblhead>' + labels[10] + '</td><td class=tblhead colspan=2>' 
                     + labels[4] + '</td><td class=tblhead >' + textmsg[1358] + '</td></tr>';
            let tb = "<table cellpadding=4 width=100% border=1 style=\"border-collapse:collapse;border-color:#ddcc99;\">" 
                  + ht.replace(/<.tr>$/,'<td width=2 rowspan=' + (2 + ~~(affected.length/2) ) + '>') 
                  + ht.replace(/^<tr>/,'');
            let h = ~~((1+affected.length)/2);
            for (let j=0; j < h; j++)
            {
                tb += affected[j].replace(/<.tr>$/,'');
                if (h+j < affected.length) tb += affected[h+j].replace(/^<tr[^>]+>/,'') +'\n';
            }
            
            
            if (affected.length%2==0)
            {
                let t2 = '<tr><td colspan=6 style=border-left-color:transparent;border-bottom-color:transparent ></td><td colspan=3 style=background-color:lightyellow align=center >'
                        + nn + '</td><td style=background-color:lightyellow align=right>' 
                        + (oldcount===0?'':(''+ (oldsum/oldcount).toFixed(1))) + '</td><td style=background-color:lightyellow align=right>' 
                        + (nn===0?'':(''+ (nowsum/nn).toFixed(1))) + '</td></tr>';
                tb += t2 + "</table>";
            }
            else
            {
                let tl =  '<tr style=background-color:lightyellow ><td colspan=3 align=center >' + nn + '</td><td  align=right>' 
                       + (oldcount===0?'':(''+ (oldsum/oldcount).toFixed(1))) + '</td><td  align=right>' 
                       + (nn===0?'':(''+ (nowsum/nn).toFixed(1))) + '</td></tr>';
                tb += tl.replace(/^<tr[^>]+>/,'') + '</table>';
            }
            myprompt(tb, null, 'if(v)setaction(1)', mat[this.count][0] +'-' + mat[this.count][20] + ': ' + mat[this.count][1]);
        }
        else setaction(1);
    };


this.updatefmt = function(sel)
{
    var fmt = ''+sel.options[sel.selectedIndex].value;
    var mid = document.getElementById('merged');
    if (''+retrv(n,this.formatindex) == '2')
        LaTexHTML.deformat(mid);
    setv(n, this.formatindex, fmt);
    var ans = this.mergesubmitted(fmt);
    if (mid != null)
    {
        mid.innerHTML = ans;
    } 
    valuechanged[this.n] = true;
    if (''+ fmt == '2' && mid != null)
    LaTexHTML.reformat(mid);
     
}
this.updatemergesubmitted = function()
{
    var fmt = retrv(this.n,this.formatindex);
    var mid = document.getElementById('merged');
    
    if (''+ fmt == '2' && mid != null)
         LaTexHTML.deformat(mid);
    mid.innerHTML = this.mergesubmitted(fmt);
    if (''+ fmt == '2'  && mid != null)
        LaTexHTML.reformat(mid);
}
this.makequestionanswers = function()
{
    var fmt = retrv(this.n,this.qformatindex);
    var attstr = ResizeUploaded.unzip(mat[this.n][this.qattachindex]);
    this.hwattach = new Hwtake('grade', '', '', attstr, '', '', this.n);
    addcss2head(this.n, this.hwattach.divs);
    var attachheader = this.hwattach.attachheader;
  //0)Course,  1) AssignTest, 2) StudentId, 3) SubmitAt, 4) Score,  5)PhotoUrl,
//6)Content, 7) Comment, 8) due, 9) Format, 10) StudName, 11) Attachment
//12. atype, 13 assess
//14, AsAssess,15, question, 16, Answer, 17Attachat,18 Scale, 19 Weight, 20 Sessions
//21 Aformat
    this.questionfmt = this.answerfmt = fmt;
    var y = '';
    if (attachheader!='')
    y = "<table style=\"80%;margin:0px 0px 0px 0px;font-family:inherit;\" cellpadding=3 cellspacing=1><tr><td><img src=\"image/clip.png\" width=28 >" + attachheader + "</td></tr></table>";
    var z =  y + this.fmtopt1(fmt,'q') + this.hwattach.merge(addbreak1(formatstr(addbreak(mat[this.n][this.questionindex],1),fmt))) ;
    var fmts = retrv(this.n,this.formatindex);
    var w =  this.fmtopt1(fmts,'a') + this.hwattach.merge(addbreak1(formatstr(addbreak(mat[this.n][this.answerindex],1),fmt)));
    return [z, w];
 }
  
 
 this.fmtopt1 = function(fmt,qora)
 {
     var fmtops   = "<option value=0 " + ( fmt =='0'? 'selected':'') + ">" + textmsg[83] + "</option>"
                 + "<option value=1 " + ( fmt =='1'? 'selected':'') + ">HTML</option>"
                 + "<option value=2 " + ( fmt =='2'? 'selected':'') + ">LaTeXML</option>"
                 + "<option value=3 " + (fmt=='3'? 'selected':'') + ">" + textmsg[1847] + "</option>"
          + "<option value=4 " + ( fmt =='4'? 'selected':'') + ">Java</option>"
                 + "<option value=5 " + (fmt=='5'? 'selected':'') + ">Python</option>"
                + "<option value=6  >" + textmsg[69] + "Tab</option>";
     fmtops =   "<select name=fmtbox" + qora+"  onchange=\"freeformat.updatefmt1(this,'" + qora + "')\" class=gradetxt  style=\"border:1px #999999 solid;float:right;background-color:" + DBGCOLOR + ";width:" + Math.round(charwidthrate()*font_size) + "px\" >" + fmtops + "</select>";
     return  fmtops;
 }
 
 this.questionfmt = '0';
 this.answerfmt = '0';
 
 this.updatefmt1 = function(sel, qoa)
 { 
    var td = sel.parentNode;
    var fmt = '' + sel.options[sel.selectedIndex].value;
    var attachheader = this.hwattach.attachheader;
    var y = '';
    if (attachheader!='')
    y = "<table style=\"80%;margin:0px 0px 0px 0px;font-family:inherit;\" cellpadding=3 cellspacing=1><tr><td><img src=\"image/clip.png\" width=28 >" + attachheader + "</td></tr></table>";
    if (this.answerfmt == '2') LaTexHTML.deformat(td);
    if (qoa == 'q') 
    {
        td.innerHTML = '<table align=center  ><tr><td>'+ y  +  "</td><td style=float:right;color:blue onclick=showqa()>" + textmsg[732]   + textmsg[456]  +  "</td></tr></table> " +  this.fmtopt1(fmt,'q') + this.hwattach.merge(addbreak1(formatstr(addbreak(mat[this.n][this.questionindex],1),fmt)));
    }
    else
    {
        td.innerHTML =  this.fmtopt1(fmt,'a') +  this.hwattach.merge(addbreak1(formatstr(addbreak(mat[this.n][this.answerindex],1),fmt))) ;
    }
    if (fmt=='2') LaTexHTML.reformat(td);
    if (qoa == 'q')
        this.questionfmt = fmt;
    else
        this.answerfmt = fmt;
 }
 
 this.fmtopt = function(fmt)
 {
     var fmtops   = "<option value=0 " + ( fmt =='0'? 'selected':'') + ">" + textmsg[83] + "</option>"
                 + "<option value=1 " + ( fmt =='1'? 'selected':'') + ">HTML</option>"
                 + "<option value=2 " + ( fmt =='2'? 'selected':'') + ">LaTeXML</option>"
                 + "<option value=3 " + (fmt=='3'? 'selected':'') + ">" + textmsg[1847] + "</option>"
                  + "<option value=4 " + ( fmt =='4'? 'selected':'') + ">Java</option>"
                           + "<option value=5 " + ( fmt =='5'? 'selected':'') + ">Python</option>"
                           + "<option value=6  >" + textmsg[69] + "Tab</option>";
                
     fmtops =   "<select name=fmtbox  onchange=\"freeformat.updatefmt(this)\" class=gradetxt  style=\"border:1px #999999 solid;float:right;background-color:" + DBGCOLOR + ";width:" + Math.round(charwidthrate()*font_size) + "px\" >" + fmtops + "</select>";
     return  fmtops;
 }
 this.makefreetxt = function()
{    
    var fmt = retrv(this.n,this.formatindex);
   
    var xx =   "<table id=gradetab  width=100% style=\"margin:0px 0px 0px 0px;font-family:inherit\" cellpadding=3 cellspacing=0>";
    if (showquestionanswer)
    {
        var zw = this.makequestionanswers();
        xx += "<tr><td valign=top align=left width=5% class=s1001  onclick=showqa()><nobr><b>" + textmsg[456] + "</b></nobr></td><td  id=ques  class=s1100 valign=top align=left colspan=2>" + zw[0]+  "</td></tr>";
        xx += "<tr><td valign=top  class=s0001 align=left><nobr><b>" + textmsg[457] + "</b></nobr></td><td  class=s0100  id=answ valign=top align=left colspan=2 id=refanswer>" + zw[1] + "</td></tr>";
    } 
    else
    {
        xx += '<tr><td colspan=3 align=center id=answ  class=s1101  ><div style=color:blue onclick=showqa()>' + textmsg[178] + '/' + textmsg[144] + '</div></td></tr>';
        var answer = mat[this.n][16]; answer = answer.split(/[\n|\r| ]+why:/)[0];
        var assess = mat[this.n][13];
        var answerarr = answer.split(/(?=\n[0-9]+[ |\\.|,|;|:|\)])/);
        var assessarr = new CSVParse(assess, '\'', ",", "\n").nextMatrix();
        var numbered = (answerarr.length > 1 && assessarr[0].length==4 && assessarr[1].length == 4); 
        if (numbered)
        {
            for (let k =1; k < answerarr.length; k++)
                answerarr[k] = answerarr[k].replace(/\n([0-9]+)[ |\\.|,|;|:|\)]+/,'$1 ');
            answerarr[0] = answerarr[0].replace(/([0-9]+)[ |\\.|,|;|:|\)]+/,'$1 ');
            xx += "<tr><td style=font-weight:700 valign=top>" + textmsg[1012] + "</td><td colspan=2>";
            xx += '<table style=border-collapse:collapse;border-color:#999 border=1 cellspacing=4 cellpadding=3><tr ><td bgcolor='
                    +BBGCOLOR +' align=right>#</td><td bgcolor=' +BBGCOLOR +' align=right>' + textmsg[1268] + '</td><td bgcolor=' +BBGCOLOR +'  align=right>' + textmsg[1311] + '</td><td bgcolor=' +BBGCOLOR +'  align=left>' + textmsg[139] + '</td><td bgcolor=' +BBGCOLOR +'  align=left>' + textmsg[144] + '</td></tr>';
            let ji=0;for ( ; ji < assessarr.length-1; ji++)
            {
                let k = answerarr.length-1;
                for (; k>=0;k--)
                {
                    if (answerarr[k].indexOf(assessarr[ji][0] + " ") == 0) 
                        break;
                }
                let yy = '';
                if (k >=0) yy = answerarr[k].replace(/[0-9]+[ ]/,'');
                xx += '<tr ><td bgcolor='
                    +TBGCOLOR +' align=right>' +assessarr[ji][0] + '</td><td bgcolor=' +TBGCOLOR +'>' + assessarr[ji][1] + '</td><td bgcolor=' +TBGCOLOR +'><input style="border:1px #aaa solid;text-align:right" onchange="changescore(this,' + this.n +',' + ji + ')" value="' + assessarr[ji][2] + '" size=4></td><td bgcolor=' +TBGCOLOR +'>' + assessarr[ji][3] + '</td><td bgcolor=' +BBGCOLOR +'>' +yy + '</td></tr>';
            }
            xx += '<tr ><td bgcolor='
                    +TBGCOLOR +' align=right>' + textmsg[194] + '</td><td bgcolor=' +TBGCOLOR +'>' + mat[this.n][18] + '</td><td bgcolor=' +TBGCOLOR +'><input style="border:1px #aaa solid;text-align:right" value="' + assessarr[ji][2] + '" size=4></td><td bgcolor=' +TBGCOLOR +'></td><td bgcolor=' +BBGCOLOR +'></td></tr>';
            
            xx += '</table></td></tr>';
        }
        else if (assess!='')
        {
            xx += "<tr><td style=font-weight:700>" + textmsg[1012] + "</td><td colspan=2>" + assess + "</td></tr>";
        }
            
    }
    var ans = this.mergesubmitted(fmt);
    
    xx += "<tr><td valign=top align=left width=0% ><nobr><b>"  + textmsg[139] + "</b></nobr></td><td valign=top style=\"color:purple;border-right-width:0px\"  id=merged align=left colspan=2>" + ans + "</td></tr>";
    xx += "<tr><td valign=top align=left width=0% ><nobr><b>" + textmsg[541] +"</b></nobr><br><div style=\"padding:0px;white-spacce:wrap;width:" + leftbutwidth + "px;color:#ee0000;margin:8px 0px 0px 0px;font-weight:700;font-size:10px\">(" + textmsg[1764] + ")</div></td><td valign=top align=left id=contentcomment width=100%></td>";
    xx += "<td style=\"padding:0px 3px 0px 3px\" valign=top><table cellspacing=0 cellpadding=0 style=\"margin:0x 0px 0px 0px\"><tr><td colspan=2><input type=button  onMouseOver=\"showmyhint(45)\"  onMouseOut=\"hidemyhint()\"    class=GreenButton style=\"padding-top:3px;padding-bottom:3px;width:" + leftbutwidth + "px\" value=\"" + textmsg[225] + "\"  id=updatebtn ></td></tr>";
    xx += "<tr><td colspan=2><input type=button class=OrangeButton style=\"padding-top:3px;padding-bottom:3px;width:" + leftbutwidth + "px\"  onMouseOver=\"showmyhint(46)\"  onMouseOut=\"hidemyhint()\" value=\"" + textmsg[1706] + "\" onclick=\"freeformat.asnewanswer()\"></td></tr>";
    xx += "<tr><td colspan=2><input type=button class=OrangeButton style=\"padding-top:3px;padding-bottom:3px;width:" + leftbutwidth + "px\"  onMouseOver=\"showmyhint(47)\"  onMouseOut=\"hidemyhint()\"    value=\"" + textmsg[1628] + "\"   onclick=\"freeformat.commenttoclass()\"></td></tr>";
    xx += "<tr><td id=copyscorelbl width=" + Math.round(leftbutwidth*0.6) +   " valign=middle   style=\"background:" + gradientbg.replace(/\(/,'(to right,') + " "
        + ";color:#DDCC11;overflow:hidden;height:"
        + (font_size+6) +"px;border-bottom:1px " + IBGCOLOR + " outset;border-left:1px " + IBGCOLOR + " outset;font-weight:bold;visibility:" + (showquestionanswer?"visible":"hidden") + "\">" + labels[4] + "</td><td><input type=text id=copyscore class=gradetxt style=\"width:" + Math.round(font_size*1.6) + "px;color:red;text-align:right;height:"
        + (font_size+6) +"px;visibility:" + (showquestionanswer?"visible":"hidden") + "\" value=\"" + retrv(this.n,this.scoreindex) + "\" onchange=freeformat.synscore() onkeypress=\"return numericgrade(event,this)\"></td></tr>";
    
    xx += "<tr><td colspan=2><input id=copysavebtn type=button class=OrangeButton style=\"padding-top:3px;padding-bottom:3px;width:" + leftbutwidth + "px;visibility:" + (showquestionanswer?"visible":"hidden") + "\"  onMouseOver=\"showmyhint(" + numCols + ")\"  onMouseOut=\"hidemyhint()\"   value=\"" + textmsg[462] + "\" onclick=\"freeformat.synscore();saveupdate('correct')\"></td></tr></table></td>";
      
    return xx  +"</tr></table>";
}

this.asnewanswer = function()
{
     var vl =  retrv(this.n, this.contentindex) ;
     if (mat[this.n][this.answerindex]=='')
     { 
         this.asnewanswer1();
     }
     else
     {
         myprompt(textmsg[1765],null,"if(v)freeformat.asnewanswer1()");
     }
}
this.asnewanswer1 = function()
{
    var vl =  retrv(this.n,this.contentindex).trim().replace(/^[0-9][0-9][0-9][0-9]*\n/,'') ;
    var p = (new CSVParse(vl, '\'',",", "\r\n")).nextMatrix();
    let str = '';
    let i = 0;
    for(; i < p.length; i++)
    {
        if (p[i].length >1)// && !isNaN(p[i][0]) && !isNaN(p[i][2])
                         // &&!isNaN(p[i][3])&&!isNaN(p[i][4])&&!isNaN(p[i][5]))
        str += p[i][0] + ". " + p[i][1] + "\n\n";
        else
        {
            break;
        }
    }
    if (i == p.length) vl = str;
    if (typeof(toclassasanswer) == 'function')
        toclassasanswer(this.n,vl);
    else
    {
        for (var n = 0; n < numRows; n++)
        {
             if ( mat[n][1] == mat[this.n][1] && mat[n][0]==mat[this.n][0] && ( rdapname != 'gradingtb' && mat[n][20]==mat[this.n][20] ||
                rdapname == 'gradingtb' && mat[n][17]==mat[this.n][17] ))
            {
               mat[n][this.answerindex] = vl;
            }
        }
    }
    var Y = document.getElementById('refanswer');
    if (Y!==null)
    Y.innerHTML = addbreak1(formatstr(addbreak(retrv(this.n,this.answerindex),1),mat[this.n][this.qformatindex]));
};
this.commenttoclass = function()
{
    var xs = (retrv(this.n,this.contentindex)).replace(/\r\n/g,'\n').replace(/\r/g,'\n').split(/\n/);
    var xx = '', j=0;
    for (var i=0; i < xs.length; i++)
        if ((j = xs[i].indexOf('////'))>=0)
            xx += xs[i].substring(j) + '\n';
     
    if (xx ==='')
    {
        myprompt(textmsg[1766]);
        return;
    }
     for (var n = 0; n < numRows; n++)
    {
       if (n !== this.n && mat[n][1] === mat[this.n][1] && mat[n][0]===mat[this.n][0] && ( rdapname !== 'gradingtb' && mat[n][20]===mat[this.n][20] ||
            rdapname === 'gradingtb' &&mat[n][17]===mat[this.n][17] ))
        {
           mat[n][this.contentindex] = mat[n][this.contentindex] + '\n' + xx;
           holdvalues[n + '_6'] = 1;
           valuechanged[n] = true;
       }
    }
};

this.synscore = function ()
{
    var e = document.getElementById('copyscore');
    setv(this.n, this.scoreindex, e.value);
    this.cacheentered(this.n); 
};

}
function circlebg(k,cl)
{
    if (cl == null) cl = IBGCOLOR;
    var n = font_size;
    var m = Math.round(n/2 + 3) ;
    return "<div style=\"font-family:arial;font-weight:700;width:" + (2*m) + "px;height:" + (2*m)
        + "px;border-radius:" + m + "px;font-size:" + n + "px;color:#ddcc11;line-height:" + (2*m) + "px;text-align:center;background-color:" + cl + "\">" 
        + k + "</div>";
}
var commentdiv = [];
var freepicture = false;
function clearcommentdv()
{
   for (var i=0; i < commentdiv.length; i++)
    { 
        var dv = commentdiv[i].div;
        if (dv!=null)
            dv.parentNode.removeChild(dv);
    }
    commentdiv = [];
}

function fromjson()
{
    clearcommentdv();
    var comments = null;
    commentdiv = [];
    var hastest = typeof(testsheet)!='undefined'&& testsheet!=null;
    var sumptrt = document.getElementById('sumptr');
    if (hastest && sumptrt!=null)
    {
        sumptrt.innerHTML = testsheet.sumptrs;
    }
    contenttd.style.position = "relative";
    camerawidth = thispagewidth() - leftbutwidth - 50;
    if (datapresentformat == 'DataTable')
    {
        var hastest = typeof(testsheet)!='undefined'&& testsheet!=null;
        if (hastest)
            camerawidth += leftbutwidth - 30;
        else
            camerawidth += leftbutwidth +30;
    }
    if (!freepicture)
    {
        if (hastest!=null)
        for (var k=0; k < testsheet.atd.length-1; k++)
        try{
            comments = JSON.parse(testsheet.atd[k][10]);
            for (var i=0; i < comments.length; i++)
            {
                    var fmt = (typeof(guessFormat)!='undefined')? guessFormat(comments[i].c):0;
                    var dv = document.createElement('div');
                    var im = null;var fn ='';
                    var ll=0; 
                    for(; ;ll++)
                    {
                        im = document.getElementById('mg' + ll);
                        if (im == null) break;
                        if (im.alt == comments[i].f)break;
                    }
                    if (im!=null) 
                        fn = im.alt;
                    else
                        fn = document.getElementById('mg0').alt;
                    var ixy = findPositionnoScrolling(im);
                    var cxy = findPositionnoScrolling(contenttd);
                    dv.style = 'color:red;position:absolute;left:' + (ixy[0]-cxy[0] + comments[i].x*camerawidth) + 'px;top:' + (ixy[1]-cxy[1] + comments[i].y*camerawidth) + 'px';
                    dv.innerHTML = formatstr(comments[i].c,fmt);
                    
                    dv.onclick = function(){commenting(this);}
                    contenttd.appendChild(dv); 
                    if (fmt == 2)
                        LaTexHTML.formatele(dv)
                    commentdiv[commentdiv.length] = {f:fn,x:(comments[i].x*camerawidth),y:(comments[i].y*camerawidth),c:comments[i].c,div:dv,qn:(k)};  
            }
            comments = null;
        }catch(e)
        {
            
        }
    }
    else
    {    
        try{
            var  ps = new CSVParse(subassess,'|',',',";");
            ps = ps.nextRow();
            comments = JSON.parse(ps[3]);
        }
        catch(e)
        {
            
        }
    }
    if (comments!=null)
    for (var i=0; i < comments.length; i++)
    {
        var fmt = (typeof(guessFormat)!='undefined')? guessFormat(comments[i].c):0;
        var dv = document.createElement('div');
        var im = null;
        var ll=0; var fn = '';
        for(; ;ll++)
        {
            im = document.getElementById('mg' + ll);
            if (im == null) break;
            if (im.alt == comments[i].f)break;
        }
        if (im!=null) 
            fn = im.alt;
        else
            fn = document.getElementById('mg0').alt;
        var cxy = findPositionnoScrolling(contenttd);
        var ixy = findPositionnoScrolling(im);
        dv.style = 'color:red;position:absolute;left:' + (ixy[0] + comments[i].x*camerawidth-cxy[0]) + 'px;top:' + (ixy[1] + comments[i].y*camerawidth-cxy[1]) + 'px';
        dv.innerHTML = formatstr(comments[i].c,fmt);
        dv.onclick = function(){commenting(this);}
        contenttd.appendChild(dv); 
        commentdiv[commentdiv.length] = {f:fn,x:(comments[i].x*camerawidth),y:(comments[i].y*camerawidth),c:comments[i].c,div:dv,qn:0};  
} 
          
}
function tojson()
{
    if (commentdiv.length == 0) return;
   
    if (testsheet == null || freepicture || testsheet.atd.length <=1)
    {
        var comments = [];
        for (var i=0; i < commentdiv.length; i++)
        {
            comments[comments.length] = {f:commentdiv[i].f,x:(commentdiv[i].x/camerawidth).toFixed(3), y:(commentdiv[i].y/camerawidth).toFixed(3), c:commentdiv[i].c};
        }
        var str = JSON.stringify(comments);
        str = "1," + (datapresentformat == 'DataTable'?'10':mat[counter][18]) + "," +(datapresentformat == 'DataTable'?retrv(counter,5):retrv(counter,4)) + ",|"+ str.replace(/\|/g, "\|\|") + "|";
        if (datapresentformat=='DataTable')
            setv(counter,12,str);
        else
            setv(counter,13,str);
    }
    else if (testsheet!=null )
    {
        for (var k=0; k < testsheet.atd.length; k++)
        {
            var comments = [];
            for (var i=0; i < commentdiv.length; i++)
            {
                if (commentdiv[i].qn == k)
                comments[comments.length] = {f:commentdiv[i].f,x:(commentdiv[i].x/camerawidth).toFixed(3), y:(commentdiv[i].y/camerawidth).toFixed(3), c:commentdiv[i].c};
            }
            testsheet.atd[k][10] = JSON.stringify(comments);
        }
    }
    
} 
function commenting(dv)
{
    contenttd.style.position = "relative";
    var commenteditor = document.getElementById('commenteditor');
    if (commenteditor !=null)
    {
        var tas = commenteditor.getElementsByTagName('textarea');
        var ta;
        if (tas!=null) ta = tas[0];
        else ta = commenteditor.getElementsByTagName('table')[0].rows[0].cells[1].getElementsByTagName('textare')[0];
        var str = ta.outerHTML; 
        var i = str.indexOf('onblur'); 
        var j= str.indexOf(")",i);
        str = str.substring(i,j).replace(/[^,]*,/,'').replace(/ /g,'');
        var z = str.split(/,/);
        setcomment(ta,z[0],z[1],z[2],z[3]);
    }
        
    var xy = [0,0];
    if (browserstr.indexOf('MSIE')>-1)
    {
         myHintx = event.clientX + document.body.scrollLeft;
         myHinty = event.clientY + document.body.scrollTop;
    }
    else
    {
          myHintx = event.pageX;
          myHinty = event.pageY;
    }
    var i = 0;
   
    var img = null;
    var j = 0;
    if (dv.tagName.toLowerCase() == 'div')
    {
        for (i=0; i < commentdiv.length; i++)
        {
            if (commentdiv[i].div == dv)
            {
                LaTexHTML.deformat(dv);
                dv.innerHTML = '';
                break;
            }
        }
        if (commentdiv.length == i) return;
        var ims = contenttd.getElementsByTagName('img');
        
        for (; j < ims.length;j++)
        {
            var xy = findPositionnoScrolling(ims[j]);
            if (myHinty > xy[1] && myHinty - xy[1] <= ims[j].offsetHeight)
            {
                img = ims[j];
                break;
            }
        }
        if (j == ims.length) return;
    }
    else
    {
        img = dv;
        i = commentdiv.length;
        j = parseInt(img.id.replace(/[^0-9]+/,''));
       
    }
    
    if(img == null) return;
    var k = 1;
    var cxy = findPositionnoScrolling(img);
    var xy = [myHintx-cxy[0],myHinty-cxy[1]];
    var hastest = (typeof(testsheet) != 'undefined' && testsheet!=null); 
    
    if (hastest && commentdiv.length == i) 
    {
       var lg = 0;
       var ims = contenttd.getElementsByTagName('img');
       for (var jj=0; jj < ims.length; jj++)
           lg += ims[jj].offsetHeight;
       if (testsheet.atd.length-1 >0)
       {    
           lg /= (testsheet.atd.length-1);
           k = Math.ceil((myHinty-findPositionnoScrolling(ims[0])[1])/lg);
           testsheet.currentcommenting = k-1;
       }
       else k = 1;
    }
    var div = document.createElement('div');
    div.id = 'commenteditor';
    var contentxy   = findPositionnoScrolling( contenttd);
    if (  commentdiv.length == i) 
    {
        div.style.cssText = 'z-index:201;position:absolute;left:' + (myHintx - contentxy[0] - 34)  + 'px;top:' + (myHinty-2-contentxy[1]) + 'px;background-color:transparent';
        div.innerHTML = '<table><tr><td style=background-color:transparent;visibility:' + (hastest?"visible":"hidden") + ' onmouseenter=expandnum(this)>' + circlebg(k) + ' </td></td><td valign=top style=background-color:transparent ><textarea  rows=2 cols=30 style="color:red;border:1px #abababa solid;padding:2px 3px 2px 4px" keypress=growarea(event,this) onblur=setcomment(this,' + xy[0] + ',' + xy[1] + ','+ i + ',' + j + ') ></textarea></td></tr></table>';
        contenttd.appendChild(div);
        div.getElementsByTagName('table')[0].rows[0].cells[1].getElementsByTagName('textarea')[0].focus();
    }
    else
    {
        div.style.cssText = 'z-index:101;position:absolute;left:' + dv.style.left  + ';top:' + dv.style.top;
        div.innerHTML = '<textarea  rows=2 cols=30 style="color:red;border:1px #abababa solid;padding:2px 3px 2px 4px"  keypress=growarea(event,this) onblur=setcomment(this,' + xy[0] + ',' + xy[1] + ','+ i + ',' + j + ') >' + commentdiv[i].c + '</textarea>';
        contenttd.appendChild(div);
        div.getElementsByTagName('textarea')[0].focus();
      
    }
}

var numimgs = 0;
function expandnum(td)
{
    if (td.innerHTML.toLowerCase().indexOf('<table') >= 0) return;
    td.onmouseenter = null;
   
    var k = parseInt(td.innerHTML.replace(/.*>([0-9]+)<.*/,'$1'));
    
    var k1 = k - 3;
    if (k1 <= 0) k1 = 1;
    var k2 = k+3;
    //if (k2 > testsheet.atd.length) k2 =testsheet.atd.length; 
    var s = "<table>"; 
    for (; k1 <= k2; k1++)
    {
        s += "<tr><td onclick=getthis(this) >" + circlebg(k1,(k1==k?IBGCOLOR:BBGCOLOR))  + "</td></tr>";
    }
    s += "</table>";
   
    td.innerHTML = s;
}
function getthis(td)
{
    var k = td.innerHTML.replace(/.*>([0-9]+)<.*/,'$1');
    testsheet.currentcommenting = k-1;
    var tbl = td.parentNode.parentNode.parentNode.parentNode;
    tbl.innerHTML = circlebg(k);
    tbl.nextSibling.getElementsByTagName('textarea')[0].focus();
}
function growarea(evt,ta)
{
    var ts = ta.value.split(/\n/);
    var m = 0;
    for (var i=0; i < ts.length; i++)
    {
        if (ts[i].length > m) 
            m = ts[i].length; 
    }
    if (m > ta.cols - 2 && ta.cols <70) ta.cols = ta.cols + 1;
    if (ts.length > ts.rows - 1) ta.rows = ta.rows + 1;
}

function setcomment(ta,x,y,i,j)  // i order in contentdiv, j = image order
{
    if (i == commentdiv.length && ta.parentNode.previousSibling.innerHTML.indexOf('<table')>=0) return;
    var img = document.getElementById('mg' + j); 
    if (i == commentdiv.length)
    {
       if (ta.value != '')
       {
           var k = parseInt(ta.parentNode.previousSibling.innerHTML.replace(/.*>([0-9]+)<.*/,'$1'));
           if (''+k == 'NaN') k = 0;
           var f = img.alt;
           var fmt = (typeof(guessFormat)!='undefined')? guessFormat(ta.value):0;
           var dv = document.createElement('div');
           var cxy = findPositionnoScrolling(contenttd);
           var ixy = findPositionnoScrolling(img);
           dv.style = 'color:red;position:absolute;left:' + (ixy[0] + x-cxy[0]) + 'px;top:' + (ixy[1] + y-cxy[1]) + 'px';
           dv.innerHTML = formatstr(ta.value,fmt);
           dv.onclick = function(){commenting(this);}
           contenttd.appendChild(dv);
           if (fmt==2)LaTexHTML.formatele(dv);
           commentdiv[i] = {f:f,x:x,y:y,c:ta.value,div:dv,qn:(k-1)};
       }
       
    }
    else if (ta.value.replace(/ /g,'')== '')
    {
        contenttd.removeChild(commentdiv[i].div);
        commentdiv.splice(i,1);
         
    }
    else 
    {
        commentdiv[i].c = ta.value;
        var fmt = (typeof(guessFormat)!='undefined')? guessFormat(ta.value):0;
        commentdiv[i].div.innerHTML = formatstr(ta.value,fmt);
        if (fmt==2)LaTexHTML.formatele(commentdiv[i].div);
         
    }
    contenttd.removeChild(document.getElementById('commenteditor'));
    tojson();
    
}
var camerawidth = 800;
var subassess = '';
function makeimgs(n,hh,att,suba)
{
    subassess = suba;
    var str = ResizeUploaded.unzip(att);
    var x = new CSVParse(str.replace(/,$/,''), "'",'@', ',');
    var ms = x.nextMatrix();
    camerawidth = thispagewidth() - leftbutwidth - 50;
    if (datapresentformat == 'DataTable')
    {
        var hastest = typeof(testsheet)!='undefined'&& testsheet!=null;
        if (!hastest)
            camerawidth += leftbutwidth ;
    }
    var z= '';
    numimgs = ms.length; var ii = 0;
    for (var i=0; i < ms.length; i++)
    {
        var xx = ms[i][0].toLowerCase();
        if (xx.indexOf(".jpg")>0 || xx.indexOf(".gif")>0 || xx.indexOf('.png')>0)
        z += '<img id="mg' + (ii++) +'" alt="' + ms[i][0] + '" onclick=commenting(this) width='+ camerawidth +' style=display:block src=FileOperation?did=' + ms[i][2] + '>';
    }
    z = z.replace(/>$/, ' onload=fromjson() >');
    hh[0] = camerawidth;
    hh[1] = camerawidth*ii*1.4;
    return z;
}

if (typeof(hints) != 'undefined' )
{    
hints[44] = textmsg[1770];
hints[45] = textmsg[1767];
hints[46] = textmsg[1768];
hints[47] = textmsg[1769];
}
 
function changescore(t, n,  i)
{
    var v = t.value;
    if (v.replace(/ /g,'') === '' || isNaN1(v)) return;
    let X = null;
    if (holdvalues[n + '_13'] != null) X = holdvalues[n + '_13'];
            else X = mat[n][13];
    var p = new CSVParse(X,'|',',',"\n").nextMatrix();
    let tt = p[i][2]; p[i][2] = v; 
    p[p.length-1][2] = (parseFloat(p[p.length-1][2]) + parseFloat(v) - parseFloat(tt)).toFixed(1); 
    let q = t.parentNode.parentNode.parentNode;
    if (q.tagName.toLowerCase() != 'table') q = q.parentNode;
    q.rows[q.rows.length-1].cells[2].childNodes[0].value = p[p.length-1][2];
    setv(n,4,p[p.length-1][2]);    
    holdvalues[n + '_4'] = p[p.length-1][2];
    X = '';
    for (i=0; i < p.length; i++)
    {
        if (i > 0) X += '\n';
        X += p[i][0] + ',' + p[i][1] + ',' + p[i][2] + ",|"   + p[i][3].replace(/\|/g,"||") + "|";
    } 
    holdvalues[n + '_13'] = X;
    M = retrv(this.count,4);
}
 



