/************************************************************************** 
 * (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
 * Author: Zhongyan Lin                                                   *
 ***************l***********************************************************/
//0)Course,  1) AssignTest, 2) StudentId, 3) SubmitAt, 4) Score,  5)PhotoUrl,
//6)Content, 7) Comment, 8) due, 9) Format, 10) StudName, 11) Attachment
//12. atype, 13 assess
//14, AsAssess,15, question, 16, Answer, 17Attachat,18 Scale, 19 Weight, 20 Sessions
//21 Aformat
if (numRows < 1)
{
    document.write("<br>" + textmsg[351]);
    window.onload = function ()
    {
        let copyr = document.getElementById('copyrights');
        if (copyr != null)
            copyr.parentNode.removeChild(copyr);
    }
} else
{
    var oldretrv = retrv;
    fsize[7] = '20';
    var modifiedanswer = new Array();
    ctype[18] = ctype[19] = 'h';
    retrv = function (r, c)
    {
        if (r == counter)
        {
            var z = formselementbyname(f1, fields[c]);
            if (ctype[c] == 's' || ctype[c] == 'S')
            {
                return z.options[z.selectedIndex].value;
            }
            if (z != null && typeof (z.value) != 'undefined')
                return z.value;

            return mat[r][c];
        } else
            return oldretrv(r, c);
    }
    
    var semester = (parent.frames.length > 1) ? parent.frames[0].retrv(0, 0) : opener.getSemester();
    var needcheck = false;
    var cellvalue = "";
    var numIframes = 0;
    var hc = 0;
    var buttons = "";
    var rsstr = "";
    var hides = '';
    var Lstr = "";
    var borderstr;
    var imagecount = 0;
    var pictureindex = -1;
    var fmt;
    var timenowseconds = (new Date()).getTime() / 1000;
    var rr = null;
    var asstxt = null;
    let topmenu = false;

    function oneplace(x)
    {
        var y = '' + Math.round(x * 100);
        if (y.length == 1)
            y = '00' + y;
        else if (y.length == 2)
            y = '0' + y;
        return y.replace(/(..)$/, '.$1');
    }
    var setN = 0;
    var originalscore = new Array();
    document.body.style.margin = "0px 0px 0px 0px";
    document.body.style.backgroundColor = IBGCOLOR;
    var meanlength = 0;
    var keywords = '';
    var gradingformulas = ["K*(1-Min(2,P)*0.2)", "(0.3*Min(L,M)/M + 0.7*K)*(1-Min(2,P)*0.2)", "(0.4*Min(L,1)+0.6*K)*(1+0.1*(N-R)/N)"];

    function baseheight()
    { 
        return (new Viewport()).windowY - 4 * (font_size + 14);
    }

    function getformula(t, a)
    {
        if (parent != window && parent.frames.length == 2)
            return parent.frames[0].getformula(t, a)
        if ('' + a == '4')
            return gradingformulas[2];
        if (t == 4)
            return gradingformulas[0];
        return   gradingformulas[1];
    }
    function setformulas(t, f, a)
    {
        if (parent != window && parent.frames.length == 2)
            parent.frames[0].setformulas(t, f, a);
        if ('' + a == '4')
            gradingformulas[2] = f;
        else if (t == 4)
            gradingformulas[0] = f;
        else
            gradingformulas[1] = f;
    }
    function roundall()
    {
        for (var j = 0; j < allis.length; j++)
        {
            var i = allis[j];
            var v = parseFloat(document.getElementById('quickscore' + j).value);
            document.getElementById('quickscore' + j).value = Math.round(v);
            setv(i, 4, '' + Math.round(v));
        }
    }
    for (let n3=0;n3 < numRows;n3++)
    {
        if (mat[n3][12] !='0' && mat[n3][12]!='2')
            mat[n3][6] = mat[n3][6].replace(/^[0-9][0-9][0-9][0-9]*\n/,'');
    }
//0)Course,  1) AssignTest, 2) StudentId, 3) SubmitAt, 4) Score,  5)PhotoUrl,
//6)Content, 7) Comment, 8) due, 9) Format, 10) StudName, 11) Attachment
//12. atype, 13 assess
//14, AsAssess,15, question, 16, Answer, 17Attachat,18 Scale, 19 Weight, 20 Sessions
//21 Aformat
    var labs0 = textmsg[1799].split(/@/);
    var allis = null;
    var keywordmap = [];

    function quickgrade(btn)
    {
        if (keywordmap[mat[counter][0] + '_' + mat[counter][1]] == null)
        {
            var words = mat[counter][16].replace(/,[ ]*$/, '').replace(/^[ ]+/, '').split(/[\n|\r| ]+why:/)[0].split(/[ ]*,[ ]*/);
            keywords = ',';
            for (var j = 0; j < words.length; j++)
            {
                if ((keywords).indexOf("," + words[j] + ",") < 0)
                    keywords += words[j] + ",";
            }
            keywords = keywords.replace(/^,/, '').replace(/,$/, '');

        } else
            keywords = keywordmap[mat[counter][0] + '_' + mat[counter][1]];
        allis = new Array();
        var labs = [textmsg[542], labs0[4], labs0[5], labs0[6], labels[4]];
        var tt = "<tr style=\"background:" + beheading + "\">";//<td width=" + (font_size + 3) + " align=center><input type=checkbox onclick=controlallquickchecks(this) checked></td>
        tt += "<td align=right valign=top><nobr><b>" + labs[0] + "</b></nobr></td>";
        tt += "<td align=right valign=top><nobr><b>" + labs[1] + "<br>(P)</b></nobr></td>";
        tt += "<td align=right valign=top><nobr><b>" + labs[2] + "<br>(L)</b></nobr></td>";
        tt += "<td align=right valign=top><nobr><b>" + labs[3] + "<br>(K)</b></nobr></td>";
        tt += "<td align=right valign=top><nobr><b>" + textmsg[787] + "<br>(A)</b></nobr></td>";
        tt += "<td align=right valign=top><nobr><b>" + labs[4] + "<br>(S)</b></nobr></td>";
        tt += "</tr>";
//course,Assigntest,sid,SubmitAt,Score,
//PhotoUrl,content,Comment,Due,Format,
//Student,attach,atype,Assess,AsAssess,
//question,Answer,Attachat,Scale,Weight,
//Sessionname,Aformat
        var M = 0;
        var sp = 0, sl = 0, sk = 0, st = 0, sa = 0;
        setN = 0;
        for (var i = 0; i < numRows; i++)
        {
            if (mat[i][12] != '0' && mat[i][12] != '2' || mat[i][1] != mat[counter][1] || mat[i][4] == '-2' || mat[i][4] == '-3')
                continue;
            allis[allis.length] = i;
            tt += "<tr  bgcolor=" + TBGCOLOR + " ><td align=right><a href=javascript:populate(" + i + ")>" + (i + 1) + "</a></td>";
            var jj = 0, ll = 0;
            var vv = Math.round((parseFloat(mat[i][3]) - mat[i][8]) / 360.0 / 24.0);
            if (vv <= 0)
                vv = 0;
            sp += vv;
            var iv = '' + vv;
            if (iv.length == 1)
                iv = "0" + vv;
            iv = iv.replace(/(.)$/, '.$1');
            tt += "<td align=right>" + iv + "</td>";
            tt += "<td align=right>" + mat[i][6].length + "</td>";
            sl += mat[i][6].length;
            // if (mat[i][6].length > M) M = mat[i][6].length;
            tt += "<td align=right></td>";
            originalscore[setN] = mat[i][4];
            var numa = genAttachnum(mat[i][11]);
            sa += numa;
            tt += "<td align=right " + (numa == 0 ? '' : ("style=color:blue onclick=\"ResizeUploaded.attachman(ele(" + i + "," + "11))\"")) + ">" + (numa) + "</td>";
            tt += '<td align=right><input style=color:red id=quickscore' + setN + ' class=right size=3 value=' + originalscore[setN] + ' onchange=synscore2(this,' + i + ')></td>';
            tt += "</tr>";
            setN++;
        }
        meanlength = M = Math.round(sl / setN);

        tt += "<tr  bgcolor=" + TBGCOLOR + " ><td  align=right>" + labs0[10] + "</td><td align=right>" + oneplace(sp / 10.0 / setN) + "</td>";
        tt += "<td align=right>M=" + M + "</td>";
        tt += "<td align=right></td><td align=right>" + Math.round(sa / setN) + "</td><td align=right></td></tr>";
        tt += "<tr  bgcolor=" + TBGCOLOR + " ><td ></td><td align=right>P</td>";
        tt += "<td align=right>L</td>";
        tt += "<td align=right>K</td>";

        tt += "<td align=right>A</td>";
        tt += "<td align=right>S<a href=\"javascript:roundall()\">" + labs0[11] + "</a></td></tr>";
        //var tmp = "<nobr>" + textmsg[1789] + "</nobr>";// + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href=javascript:quick1()>" +textmsg[923] + "</a>";
        var tmp = "<div style=\"margin:3px 3px 3px 3px;background-color:grey;border-radius:3px\"><table width=100% id=delconfirmtbl  class=outset1 align=center cellspacing=1 cellpadding=3 border=0>"
                + tt + "</table>";
        tmp += "<table width=100% style=\"margin:5px 0px 0px 0px\" class=outset3 align=left><tr><td valign=top align=left><nobr>"
                + labs0[7] + '</nobr><br><br><div id=error>' + textmsg[1760]
                + "=" + mat[counter][18] + "</div></td><td><textarea id=keywords rows=4 style=\"padding:2px 3px 2px 4px;width:400px\">"
                + keywords.replace(/,$/, '') + "</textarea></td></tr><tr><td><table cellpacing=0 cellpadding=0><tr><td><nobr>"

        tmp += textmsg[1286] + ":</nobr></td><td align=right>S=" + mat[counter][18] + "*</td></tr></table></td><td><input id=formula onfocus=\"this.style.color='black';\" onchange=setformulas(3,this.value,mat[counter][12]) style=width:400px;text-align:left value=\""
                + getformula(3, mat[counter][12]) + "\" /></td></tr>"


        tmp += '<tr><td align=center colspan=2><input type=button class=OrangeButton style=width:'
                + (font_size * charwidthrate()) + 'px  value="' + textmsg[923]
                + '" onclick=quick1() ><input id=btnundo type=button class=OrangeButton  style=width:'
        tmp += (font_size * charwidthrate()) + 'px;visibility:hidden   value="'
                + labs0[13] + '" onclick=undoquick() ></td></tr>';
        tmp += '<tr><td colspan=2   >' + labs0[8] + '</td></tr>'
        tmp += '</table></div>';
        myprompt(tmp, null, null, textmsg[1788], 'quickest');
        //setRoundedWidth(promptwin, 600);
        promptwin = document.getElementById('quickest');
        promptwin.style.left = '110px';
        promptwin.style.top = '110px';
        if (keywordmap[mat[counter][0] + '_' + mat[counter][1]] != null)
            quick1();
        else
            keywordmap[mat[counter][0] + '_' + mat[counter][1]] = keywords;
    }
    function quick1()
    {
        var words = null;
        var wordele = document.getElementById('keywords');
        if (wordele != null)
        {
            keywords = wordele.value.replace(/,[ ]*$/, '').replace(/^[ ]+/, '');
            keywordmap[mat[counter][0] + '_' + mat[counter][1]] = keywords;
            if (keywords.length > 0)
                words = keywords.split(/[ ]*,[ ]*/);
        }
        var tbl = document.getElementById('delconfirmtbl');
        var numcols = tbl.rows[0].cells.length;
        var sk = 0;
        var sg = 0;

        var kk = 3;
        for (var kj = 0; kj < allis.length; kj++)
        {
            var i = allis[kj];
            var n = 0;
            var y = 0;
            if (words != null)
            {
                for (var j = 0; j < words.length; j++)
                {
                    if (mat[i][6].toLowerCase().indexOf(words[j].toLowerCase()) >= 0)
                        n++;
                }
                y = Math.round(n * 100.0 / words.length);
                sk += y;
                tbl.rows[kj + 1].cells[kk].innerHTML = y + '%';
            }
            var l = tbl.rows[kj + 1].cells[2].innerHTML;
            var p = tbl.rows[kj + 1].cells[1].innerHTML;
            var numa = tbl.rows[kj + 1].cells[numcols - 2].innerHTML;
            var f = document.getElementById('formula').value;
            f = f.replace(/max/ig, '@#').replace(/min/ig, '#@');
            if (words != null)
                f = f.replace(/K/ig, '' + (y / 100.0));
            else
                f = f.replace(/K/ig, '1');

            f = f.replace(/x/g, '*').replace(/L/ig, '' + l).replace(/P/ig, '' + p).replace(/M/ig, '' + meanlength).replace(/N/ig, '' + setN).replace(/A/ig, '' + numa);

            f = f.replace(/@#/ig, 'Math.max').replace(/#@/ig, 'Math.min');

            f = mat[counter][18] + "*(" + f + ")";
            try {
                var zz = eval(f);
                sg += zz;
                setv(i, 4, oneplace(zz));
                
                document.getElementById('quickscore' + kj).value = oneplace(zz);
            } catch (e1) {
                document.getElementById('formula').style.color = 'red';
                document.getElementById('error').style.color = labs0[9];
            }

        }

        tbl.rows[setN + 1].cells[kk].innerHTML = Math.round(sk / setN) + '%';
        tbl.rows[setN + 1].cells[numcols - 1].innerHTML = oneplace(sg / setN);
        document.getElementById('btnundo').style.visibility = 'visible';
    }

    function undoquick()
    {
        for (var j = 0; j < allis.length; j++)
        {
            var i = allis[j];
            setv(i, 4, originalscore[j]);
            document.getElementById('quickscore' + j).value = originalscore[j];
        }
        document.getElementById('btnundo').style.visibility = 'hidden';
    }
    function synscore2(td, i)
    {
        var t = td.value;
        if (t == '')
            return;
        if (isNaN(t)) {
            td.focus();
            return;
        }
        setv(i, 4, t);
        document.getElementById('btnundo').style.visibility = 'visible';
    }
    function genAttachnum(str)
    {
        return ResizeUploaded.unzip(str).replace(/[^,]/g, '').length;

    }
    for (let i1= 0; i1 < numRows; i1++)
    {
        var asg = (new CSVParse(mat[i1][13], "|", ",", ";")).nextMatrix();
        for (let k =0; k < asg.length; k++)
            {
               try{
                  let cc=  eval(asg[k][2]);
                }catch(e){alert(i1);}
            }
    }

    if (labels[0] == 'course')
    {
        labels[0] = 'Course Id';
        labels[6] = 'Content';
        labels[11] = 'Attached';
    }
    ctype[0] = 'h';
    ctype[1] = 'h';
    ctype[2] = 'h';
    ctype[3] = 'h';
    ctype[8] = 'h';
    ctype[9] = 'h';
    ctype[10] = 'h';
    ctype[11] = 'h';
    ctype[12] = 'h';
    ctype[13] = 'h';
    ctype[14] = 'h';

    var accparse;
    var contentparse;

    defaultRecord[0] = (parent.frames.length > 1) ? parent.frames[0].retrv(0, 1) : opener.getCourse();


    for (var kk = 0; kk < captions[0].length; kk++)
    {
        if (defaultRecord[0] == options[0][kk])
        {
            title = captions[0][kk];
            break;
        }
    }
    if (kk == captions[0].length)
    {
        title = textmsg[152] + ": " + defaultRecord[0];
    }
    captions[0] = options[0];
    var heightratio = font_size + 4;//parseInt(butstyle(font_size).replace(/.*height:([0-9]+).*/,'$1')) - 2;
    var leftbutwidth = (font_size * charwidthrate()) - 6;
    var timenow = Math.floor((new Date()).getTime() / 1000);
    datapresentformat = 'DataForm';
    for (var j = 0; j < numCols; j++)
    {
        if (ctype[j] == 'u' || ctype[j] == 'U')
        {
            pictureindex = j;
            // break;
        }


        if (ctype[j] == null || ctype[j] == '')
            ctype[j] = "T";
        x = ctype[j].toLowerCase();

        if (x == 'a' || x == 'i' || x == 'n' || x == 'u' || x == 'w')
        {

            if (fsize[j] == null || fsize[j] == '')
            {
                if (x == 'n')
                {
                    fsize[j] = "10";
                    ffsize[j] = "0";
                } else if (x == 'u')
                {
                    fsize[j] = "";
                    ffsize[j] = "";
                } else if (x == 'w')
                {
                    fsize[j] = "4";
                    ffsize[j] = "";
                } else
                {
                    fsize[j] = "30";
                    ffsize[j] = "5";
                }
            } else
            {
                var sa = fsize[j].indexOf("_");
                if (sa > 0)
                {

                    ffsize[j] = fsize[j].substring(sa + 1);
                    fsize[j] = fsize[j].substring(0, sa);
                    if ('' + parseInt(ffsize[j]) == 'NaN')
                    {
                        if (x == 'n')
                            ffsize[j] = "0";
                        else if (x == 'u')
                            ffsize[j] = "";
                        else
                            ffsize[j] = "30";
                    }
                } else
                {
                    if (x == 'n')
                        ffsize[j] = "0";
                    else if (x == 'u')
                        ffsize[j] = "";
                    else
                        ffsize[j] = "5";
                }
            }
        } else if (x == 'm' && (fsize[j] == null || fsize[j] == ""))
            fsize[j] = timeformat.length;
        else if (x == 'l' && (fsize[j] == null || fsize[j] == ""))
            fsize[j] = '2';

        if ((ctype[j] == 't' || ctype[j] == 'u' || ctype[j] == 'p') && maxsize[j] < parseInt(fsize[j]))
            maxsize[j] = parseInt(fsize[j]);
    }


    function makelabel(j, wd)
    {
        if (wd == null)
        {
            wd = Math.ceil(font_size * charwidthrate());
        }
        let str = "<td width=0%  valign=middle   style=\"white-space:nowrap;max-width:" + wd + "px;min-width:" + wd + "px !important;background:" + gradientbg + ";color:#DDCC11;overflow:hidden;padding-top:3px;padding-bottom:3px;"
                + "border-bottom:1px " + IBGCOLOR + " outset;border-left:1px " + IBGCOLOR + " outset;font-weight:bold;white-space:nowrap\" "
        if (j < numCols && j >= 0)
            str += " onMouseOver=\"showmyhint("
                    + j
                    + ")\"    onMouseOut=\"hidemyhint()\" ";
        if (j == 4)
            str += ' id=calbut onclick=docalculate()';
        str += ">";
        if (j >= numCols)
            str += textmsg[182];
        else if (j < 0)
            str += "&nbsp;/ " + numRows;
        else
            str += labels[j];

        document.write(str);
    }
    function docalculate()
    {
        if (testsheet != null)
            testsheet.normalize();
        valuechanged[counter] = true;
    }
    var lk = 0;

    var makingorder = 0;
    function makecontrol(j)
    {
        positionr[makingorder] = j;
        positions[j] = makingorder++;
        lookup[j] = (lk++);
        if (dtype[j])
            classrl = "right";
        else
            classrl = "left";
        var het = font_size + 4;
        if (ctype[j] == 's' && browserstr.indexOf('MSIE') >= 0)
            het = font_size + 2;
        if (ctype[j] == ctype[j].toUpperCase())
        {
            readonly = "margin:0px 0px 0px 0px;height:" + het + "px;border:1px #b0b0b0 solid;background-color:transparent;color:white";
        } else
        {
            readonly = "margin:0px 0px 0px 0px;height:" + het + "px;border:" + ((j == 4) ? '0px #b0b0b0 solid' : ('1px ' + BBGCOLOR + ' solid')) + ";background-color:" + TBGCOLOR + ";color:black;";
        }
        if (j == 4)
            readonly = "width:" + Math.round(font_size * 1.8) + "px;" + readonly + "color:red;text-align:right";
        var ctrl = "";
        switch (ctype[j])
        {

            case 'a':
            case 'A':

                document.write("<textarea  wrap=soft style=\"padding:2px 3px 2px 4px;width:100%;" + readonly + "\" cols=" + fsize[j] + " rows=" + (rdapname == 'gradingsub' ? '20' : ffsize[j]) + " name=" + fields[j]);
                document.write(" onkeydown=\"if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}\" ");
                document.write(" onfocus=S(counter," + j + ")");
                document.write(" onblur=U(counter," + j + ")");
                document.write(" onkeypress=mkstrike(this,event)");
                document.write(" onchange=\"UT(counter," + j + ");if (freeformat!=null)freeformat.updatemergesubmitted()\"  ></textarea>\n");
                break;


            case "m":
            case "M":
                maxsize[j] = timeformat.length + 2;
                document.write("<INPUT style=\"" + readonly + "\" MAXSIZE=" + maxsize[j] + " SIZE=" + fsize[j] + " name=" + fields[j]);
                document.write(" onfocus=S(counter," + j + ")");
                document.write(" onblur=U(counter," + j + ")");
                document.write(" onchange=UT(counter," + j + ") >\n");
                break;

            case "t":
            case "n":
            case "T":
            case "N":
                document.write("<INPUT  style=\"" + readonly + ((j == 4) ? 'border:0px;padding:2px;text-align:center' : '') + "\" MAXSIZE=" + maxsize[j] + " SIZE=" + fsize[j] + " name=" + fields[j]);

                if (j == 4)
                {
                    document.write(" onMouseOut=\"hidemyhint()\"  onMouseOver=\"showmyhint(" + (hintscount) + ")\" ");
                    document.write(" onfocus=S(counter," + j + ")");
                    document.write(" onblur=U(counter," + j + ")");
                    document.write(" onchange=\"UT(counter," + j + ");synscore1()\" ");
                    document.write(" onkeypress=\"return numericgrade(event,this)\" style=\"text-align:right;width:" + Math.round(font_size * 1.8) + "px\"");
                } else
                {
                    document.write(" onfocus=S(counter," + j + ")");
                    document.write(" onblur=U(counter," + j + ")");
                    document.write(" onchange=\"UT(counter," + j + ")\" ");
                }
                document.write(">");
                break;

            case 's':
            case 'S':
                document.write("<SELECT style=\"" + readonly + ";border:0px\"  name=\"" + fields[j]);
                document.write("\" onfocus=S(counter," + j + ")");
                document.write(" onblur=U(counter," + j + ")");
                document.write(" onchange=\"UT(counter," + j + ")\" >");
                for (var jj = 0; jj < options[j].length; jj++)
                    document.write("<option value=\"" + options[j][jj].replace(/"/g, '\\"') + "\">" + captions[j][jj] + "</option>");
                document.write("</SELECT>");
                break;

            case 'h':
            case 'H':
                document.write("<INPUT  type=hidden  NAME=" + fields[j] + ">");
                break;

            case 'L':
                if (mat[0][j] != null && mat[0][j].indexOf(">>") >= 0)
                    document.write("<input  class=left style=color:#0000AA size=" + fsize[j] + "  NAME=" + fields[j] + "  onClick=openit2(counter," + j + ")>");
                else
                {
                    //document.write( " <input type=hidden NAME=" + fields[j] + ">" );
                    Lstr += "<tr><td   style=background-color:blue;cursor:pointer  NAME=\"" + fields[j] + "\" onClick=openit2(counter," + j + ")>" + fields[j] + "</td></tr>";
                }
                break;

            case "U":
                document.write("<input name=" + fields[j] + " type=hidden><img  onerror=\"javascript:this.src='image/hint.gif';\" style=\"background-color:" + TBGCOLOR + ";width:" + (leftbutwidth + 6) + "px;padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;border:0px !important;\"   name=image" + j + " ");
                document.write(" height=100% ");
                document.write(" onMouseOver=\"showmyhint("
                        + j + ")\"   onMouseOut=\"hidemyhint()\"  onclick=showswitch() >");

                break;
        }
    }
//0)Course,  1) AssignTest, 2) StudentId, 3) SubmitAt, 4) Score,  5)PhotoUrl,
//6)Content, 7) Comment, 8) due, 9) Format, 10) StudName, 11) Attachment
//12. atype, 13 assess
//14, AsAssess,15, question, 16, Answer, 17Attachat,18 Scale, 19 Weight, 20 Sessions


    hints[numCols] = textmsg[11];
    hints[numCols + 1] = textmsg[809]; //delete
    hints[numCols + 2] = textmsg[745];  //customi
    hints[numCols + 3] = textmsg[735];  //
    hints[numCols + 4] = textmsg[795];
    var hintscount = hints.length;

    hints[hintscount] = textmsg[180];  //error score
    hints[hintscount + 1] = textmsg[181] + " " + textmsg[130] + " " + textmsg[182] + textmsg[183];//about mark
    hints[hintscount + 2] = textmsg[185]; //default
    hints[hintscount + 3] = textmsg[171]; // previous
    hints[hintscount + 4] = ">: " + textmsg[172] + "<br><: " + textmsg[171];  //next
    hints[hintscount + 5] = textmsg[1889]; //unsubmit

    document.write(unifontstyle(font_size));
    var tit = unititle(title, 'outset2');
    if (parent.frames[1] == window)
        tit = tit.replace(/<img[^>]*>/, "").replace(/<td[^>]*><.td>/, "");


    document.write(tit);
    document.write("<style> table tr td form table tr td table tr td{background-color:white}\n");
    document.write("table tr td form table tr td {background-color:" + DBGCOLOR + "}\n");
    document.write(".borderbox {border-bottom:1px " + IBGCOLOR + " outset}</style>");

//0)Course,  1) AssignTest, 2) StudentId, 3) SubmitAt, 4) Score,  5)Photorl,
//6)Content, 7) Comment, 8) due, 9) Format, 10) StudName, 11) Attachment
//12. atype, 13 assessh
    document.write("<div id=\"maindiv\" style=\"margin:3px 3px 0px 0px;padding:0px;border-left-color:#aaa;border-left-width:1px;border-left-style:solid;overflow-x:auto;background-color:" + IBGCOLOR + ";border-radius:3px\" >");
//document.write( round10('100%').replace(/5/g,'0').replace(/3/g,'0').replace(/2/g,'0') );
    document.write("<form rel=opener name=form1 style=\"margin:0px 0px 0px 0px\"  >");
    document.write("<table border=0 bgcolor=" + IBGCOLOR + " cellspacing=0 cellpadding=3   style=\"width:100%;margin:0px;border:1px #b0b0b0 solid\" id=writetable>");
    document.write('<tr height="' + (font_size + 4) + '">');
    makelabel(1, leftbutwidth);
    for (var jj = 0; jj < 14; jj++)
        if (ctype[jj] == 'h')
            makecontrol(jj);
    for (jj = 14; jj < numCols; jj++)
        document.write("<input type=hidden name=\"" + fields[jj] + "\" value=\"\">");
    document.write('</td><td class=borderbox style=\"min-width:200px !important;max-width:200px !important\" >name');

    document.write('</td>');
    makelabel(8);
    document.write('</td><td class=borderbox style=\"min-width:150px;max-width:150px;\" >due');

    document.write('</td>');
    makelabel(18);
    document.write('</td><td  class=borderbox  style=\"min-width:70px;max-width:70px;\"  align=center>sccale</td>');
    makelabel(7);
    document.write('</td><td style=width:50% colspan=1 class=borderbox>');
    makecontrol(7);
    document.write('</td><td  width=0% style=width:0px;padding:0px>');
    document.write('</td></tr><tr height="' + (font_size + 4) + 'px">');

    if (numRows > 0)
    {
        makelabel(10);
        document.write('</td><td  class=borderbox  style=\"min-width:200px;max-width:200px;\"  >&nbsp;</td>');
    } else
    {
        labels[10] = textmsg[673];
        ctype[2] = 't';
        fsize[2] = 8;
        makelabel(10);
        document.write('</td><td  class=borderbox  style=\"min-width:150px;max-width:150px;\"  >');
        document.write('&nbsp;</td>');
    }

    makelabel(3);

    document.write('</td><td  class=borderbox  style=\"min-width:150px;max-width:150px;\"  > </td>');

    makelabel(19);
    document.write('</td><td  class=borderbox align=center  style=\"min-width:70px;max-width:70px;\"  >weight</td>');
    makelabel(11);
    document.write('</td><td  class=borderbox  style="color:blue;cursor:pointer;width:50%" onclick="ResizeUploaded.attachman(ele(0,11))"> </td>');

    document.write("<td  width=0% style=width:0px;padding:0px><input type=HIDDEN   name=subdb value=\"" + subdb + "\"></td></tr><tr><td style=\"margin:0px 0px 0px 0px;background-color:" + IBGCOLOR + "\"  valign=top align=center >");
    document.write("<table style=\"background-color:" + IBGCOLOR + ";margin:0px 0px 0px 0px;border:0px\" border=0  id=contbutt cellspacing=1 cellpadding=3 align=left valign=top>");

    document.write("<!--tr><td width=100%  align=center  style=\"border:0px;background-color:" + DBGCOLOR + ";color:#111\" id=sids>");
    document.write("</td></tr-->");
    document.write("<tr><td width=100%  align=center style=border:0px;padding:0px;background-color:" + IBGCOLOR + "\"  >");
    makecontrol(5);
    document.write("</td></tr>");
    document.write("<tr><td  width=\"100%\"  style=\"padding:0px 0px 0px 0px;background-color:" + IBGCOLOR + "\" >");
    document.write("<table align=center id=scoredetailtbl cellspacing=0  cellpadding=0 width=\"100%\" style=\"margin:0px 0px 0px 0px;background-color:" + IBGCOLOR + "\"  border=0 >");
    document.write("<tr><td colspan=2 id=\"scoredetail\" width=\"100%\" align=center ></td></tr>");
    var butborderstyle = 'padding-top:3px;padding-bottom:3px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:3px;font-weight:bold;text-shadow:#606060 -1px 1px;border:1px #b0b0b0 outset;';
    document.write("<tr>");
    document.write("<td id=calbut onclick=docalculate() align=center class=GreenButton style=\"" + butborderstyle.replace(/margin:[^;]+;/, 'margin:0px 0px 0px 0px;') + "width:" + Math.floor(leftbutwidth / 2) + "px;overflow:visible;color:white;white-space:nowrap;\"   onMouseOver=\"showmyhint(4)\"   onMouseOut=\"hidemyhint()\"  >" + labels[4]+ "</td>");
    //makelabel(4, '60%');
    document.write('<td align=right width=40% style="background-color:white;border:1px ' + IBGCOLOR + ' outset">');
    makecontrol(4);
    document.write("</td></tr></table>");
    
   
    document.write("</td></tr>");
    document.write("<tr><td width=100%  style=\"padding:0px 0px 0px 0px;background-color:" + IBGCOLOR + "\">");
    document.write('<table width="100%" style="margin:0px 0px 0px 0px;background-color:' + IBGCOLOR + '"  cellpadding=3 cellspacing=0><tr height=100%>');
    document.write("<td  align=center class=GreenButton style=\"" + butborderstyle.replace(/margin:[^;]+;/, 'margin:0px 0px 0px 0px;') + "width:" + Math.floor(leftbutwidth / 2) + "px;overflow:hidden;border:1px #b0b0b0 outset;color:white;\" ONCLICK=\"navigaterall(-1)\"    onMouseOver=\"showmyhint(" + (hintscount + 3) + ")\"  onMouseOut=\"hidemyhint()\" >&lt;</td>");
    document.write("<td  align=center style=\"width:1px;padding:0px;background-color:" + IBGCOLOR + "\"></TD>");
    document.write("<td  align=center  class=GreenButton style=\"" + butborderstyle.replace(/margin:[^;]+;/, 'margin:0px 0px 0px 0px;') + "width:" + (Math.ceil(leftbutwidth / 2) - 1) + "px;overflow:hidden;border:1px #b0b0b0 outset;color:white;\" ONCLICK=\"navigaterall(1)\"  onMouseOver=\"showmyhint(" + (hintscount + 4) + ")\"  onMouseOut=\"hidemyhint()\" >&gt;</TD>");
    document.write('</tr></table></td></tr><tr><td width=100%  style=\"padding:0px 0px 0px 0px;background-color:' + IBGCOLOR + '">');

    document.write("<table width=\"100%\" style=\"margin:0px 0px 0px 0px;background-color:" + IBGCOLOR + "\" cellspacing=0 cellpadding=0 ><tr><td width=" + Math.ceil(leftbutwidth / 2) + " >");
    let styl = "padding:2px;margin:0px 0px 0px 0px;height:" + (font_size + 7) + "px;border:0px #0b0b0b solid;background-color:" + TBGCOLOR + ";color:black;"
            + "width:" + (leftbutwidth / 2) + "px;color:black;text-align:center;font-weight:700";
    document.write("<input style=\"" + styl + "\"  type=text  name=count  ONKEYPRESS=\"return jumpto(this,event)\">");
    document.write("</td>");
    //makelabel(-1, (leftbutwidth / 2));
    document.write("<td  style=background-color:" + IBGCOLOR + ";color:#DDCC11;font-weight:700;white-space:nowrap >&nbsp;/" + numRows);
//<td style=\"padding:0px;height:100%;color:#DDCC11;background-image:" + gradientbg + "\" width=" + Math.ceil(leftbutwidth/2) +"  onclick=navigaterall(0)>/"+ numRows+
    document.write("<input type=hidden name=total value=\"" + numRows + "\"></td></tr></table>");
    document.write("</td></tr><tr><td width=100% style=\"padding:0px 0px 0px 0px;background-color:" + IBGCOLOR + "\">");
    document.write("<table  width=\"100%\" style=\"margin:0px 0px 0px 0px;overflow:hidden;border:0px;background-color:" + IBGCOLOR + ";\"  cellspacing=0 cellpadding=3 ><tr valign=middle height=" + (font_size + 7) + ">");
    document.write("<td width=0% style=background-color:" + IBGCOLOR + "; valign=middle align=center>");
    document.write("<input type=checkbox style=\"font-weight:700;background-color:transparent\"  name=statusmarkbox onclick=\"javascript:markers[counter]=this.checked\"></td>");
    document.write("<td width=100%   valign=middle align=left style=background-color:" + IBGCOLOR + ";color:#ddcc11;font-size:" + font_size + "px;font-weight:700 valign=middle align=center  onMouseOut=\"hidemyhint()\"  onMouseOver=\"showmyhint(" + (hintscount + 1) + ")\" >");
    document.write(textmsg[182]);
    document.write("</td></tr></table>");
    
    

    document.write('</td></tr>');

//if (font_size<17) 
    //  document.write('<tr><td style=background-color:' + DBGCOLOR + ' >&nbsp;</td></tr>');

    document.write("<!--tr><td   align=center  class=GreenButton   style=\"" + butborderstyle + "width:" + leftbutwidth
            + "px;overflow:hidden;color:white;font-family:" + defaultfontfamily + ";font-wight:700;white-space:nowrap;visibility:hidden\"  "
            + "onclick=\"javascript:showanswer()\"  onMouseOver=\"showmyhint("
            + hintscount + ")\"  onMouseOut=\"hidemyhint()\"   >" + textmsg[457] + "</td></tr-->");

    if (rdapname != 'gradingsub')
        document.write("<tr><td id=unigradebut  align=center  class=OrangeButton   style=\"" + butborderstyle + "width:" + leftbutwidth
                + "px;overflow:hidden;color:white;font-family:" + defaultfontfamily + ";font-wight:700;white-space:nowrap\"  "
                + " onclick=\"quickgrade(this)\"   onMouseOver=\"showmyhint(" + (hintscount + 2) + ")\"  onMouseOut=\"hidemyhint()\" >" + textmsg[923] + "</td></tr>");
    
    document.write("<tr><td id=distinctbtn  align=center class=OrangeButton  style=\"" + butborderstyle + "width:" + leftbutwidth
                + "px;overflow:hidden;color:white;font-family:" + defaultfontfamily + ";font-wight:700;white-space:nowrap\"  "
                + " ONCLICK =\"javascript:gradedistinct()\" tabindex=12  onMouseOver=\"showmyhint("
                + (hintscount + 5) + ")\"  onMouseOut=\"hidemyhint()\">" + textmsg[1943].split(/@/)[0] + "</td></tr>");
    document.write("<tr><td id=savebut  align=center class=OrangeButton  style=\"" + butborderstyle + "width:" + leftbutwidth
            + "px;overflow:hidden;color:white;font-family:" + defaultfontfamily + ";font-wight:700;white-space:nowrap\"  "
            + " ONCLICK =\"javascript:saveupdate('correct')\" tabindex=2  onMouseOver=\"showmyhint("
            + numCols + ")\"  onMouseOut=\"hidemyhint()\" >" + textmsg[67] + "</td></tr>");
    
    if (rdapname != 'gradingsub')
        document.write("<tr><td id=deletebut  align=center class=RedButton  style=\"" + butborderstyle + "width:" + leftbutwidth
                + "px;overflow:hidden;color:white;font-family:" + defaultfontfamily + ";font-wight:700;white-space:nowrap\"  "
                + " ONCLICK =\"javascript:saveupdate('delete',this)\" tabindex=11  onMouseOver=\"showmyhint("
                + (numCols + 1) + ")\"  onMouseOut=\"hidemyhint()\">" + textmsg[69] + "</td></tr>");

    if (rdapname != 'gradingsub')
        document.write("<tr><td id=unsubmitbut  align=center class=RedButton  style=\"" + butborderstyle + "width:" + leftbutwidth
                + "px;overflow:hidden;color:white;font-family:" + defaultfontfamily + ";font-wight:700;white-space:nowrap\"  "
                + " ONCLICK =\"javascript:saveupdate('delete',this,'unsubmit')\" tabindex=12  onMouseOver=\"showmyhint("
                + (hintscount + 5) + ")\"  onMouseOut=\"hidemyhint()\">" + textmsg[1278] + "</td></tr>");

    if (rdapname != 'gradingsub')
        document.write("<tr><td id=gradeallbut  align=center   style=\"" + butborderstyle + "font-weight:700;background-color:#2020B0;width:" + leftbutwidth
                + "px;overflow:hidden;color:white;font-family:" + defaultfontfamily + ";font-wight:700;white-space:nowrap\"  "
                + " ONCLICK =\"javascript:gradealli(this)\" tabindex=13  onMouseOver=\"showmyhint("
                + (hintscount + 5) + ")\"  onMouseOut=\"hidemyhint()\">" + textmsg[1279] + "</td></tr>");

    document.write("<tr><td id=printbut  align=center  class=GreenButton   style=\"" + butborderstyle + "width:" + leftbutwidth
            + "px;overflow:hidden;color:white;font-family:" + defaultfontfamily + ";font-wight:700;white-space:nowrap\"  "
            + "  onClick=\"review(document.form1)\"  onMouseOver=\"showmyhint("
            + (numCols + 3) + ")\"  onMouseOut=\"hidemyhint()\">" + textmsg[409] + "</td></tr>");
    document.write("<tr><td id=analyticbut  align=center  class=GreenButton   style=\"" + butborderstyle + "width:" + leftbutwidth
            + "px;overflow:hidden;color:white;font-family:" + defaultfontfamily + ";font-wight:700;white-space:nowrap\"  "
            + "  onClick=\"byquestion(0,1)\"  onMouseOver=\"showmyhint("
            + (numCols + 3) + ")\"  onMouseOut=\"hidemyhint()\">" + textmsg[1900] + "</td></tr>");

    if (rdapname != 'gradingsub')
    {    
         document.write("<tr><td id=csvsourcebut  align=center  class=GreenButton   style=\"" + butborderstyle + "width:" + leftbutwidth
                + "px;overflow:hidden;color:white;font-family:" + defaultfontfamily + ";font-wight:700;white-space:nowrap\"  "
                + "   ONCLICK=showcsvsource(this)>" + textmsg[1710] + "</td></tr>");
         document.write("<tr><td id=cachedbut  align=center  class=BlueButton   style=\"" + butborderstyle + "width:" + leftbutwidth
                + "px;overflow:hidden;color:white;font-family:" + defaultfontfamily + ";font-wight:700;white-space:nowrap\"  "
                + "   ONCLICK=showcached(this)>" + textmsg[1866].split(/@/)[3]  + "</td></tr>");
    }
    document.write("<tr><td   align=center  class=GreenButton   style=\"" + butborderstyle + "width:" + leftbutwidth
            + "px;overflow:hidden;color:white;font-family:" + defaultfontfamily + ";font-wight:700;white-space:nowrap\"  "
            + "   ONCLICK=\"closeprompt();showhelp()\">" + textmsg[17] + "</td></tr>");

    if (nextpageurl != '')
        document.write("<tr><td  id=nextpagebut class=GreenButton   style=\"" + butborderstyle + "width:" + leftbutwidth
                + "px;overflow:hidden;color:white;font-family:" + defaultfontfamily + ";font-wight:700;white-space:nowrap\"  "
                + "  onclick=\"nextpage()\"></td>" + textmsg[795] + "</td></tr>");

    if (Lstr != "")
        document.write(Lstr);
    document.write("<tr><td width=100%  align=center  style=\"border:0px;background-color:" + IBGCOLOR + ";color:white\" align=center onclick=placedown(this)>&uarr;");
    document.write("</td></tr>");
    document.write('</table>');
    document.write('</td><td colspan=8  height=2px style="background-color:' + IBGCOLOR + ';padding:0 0 0 0px;\" valign=top align=left id=\"content\">');
    makecontrol(6);
    document.write('</td></tr>');
//document.write("<tr><td  id=nextpagebut1 class=GreenButton   style=\"height:25px;" + butborderstyle +"width:" + leftbutwidth + "px;overflow:hidden;border:1px green outset;color:white;font-family:" + defaultfontfamily + ";font-wight:700;text-align:center;\"  onclick=\"testsheet.updateatd(form1.formula,16,3)\" >" + textmsg[1619] + "</td></tr>");        
//document.write('<tr><td colspan=7  id=\"assdiv\" valign=top ></td></tr>');
//document.write( "<tr height=1><td style=\"background-color:" + IBGCOLOR+"\" colspan=2><input type=HIDDEN   name=subdb value=\"" + subdb + "\"></td></tr>");

    document.write("</table>");
//document.write("<input type=file style=width:200px name=\"localpathtoupload\"   onchange=\"clickedhere(this);webservice(null,'UploadTeaching',0,null)\" >");
    document.write("</form>");
//document.write(round20.replace(/5/g, '0').replace(/width:[^;]+/g,'width:0px').replace(/height:[^;]+/g,'height:0px').replace(/width=[^ ]+/g,'width=0'));
    document.write("</div>");

//document.write( round1('100%').replace(/5/g,'0') );
    document.write("<table border=0 cellspacing=0 cellpadding=0 width=100% class=outset1 id=foottable>");
    document.write("<tr height=" + (8 + font_size) + "><td align=left width=" + (charwidthrate() * font_size) + " valign=middle>");
    document.write('<nobr><a href="javascript:tobottom()">&darr;</a>');
    document.write('<a href="javascript:picktools()"><b>' + textmsg[188] + '</b></nobr></a>  ');
//document.write('');
    document.write("<form rel=opener  name=thisform  method=POST action=SaveBack target=savewindow style=\"margin:0px 0px 0px 0px\"  > \n");
    document.write("<input type=HIDDEN   name=rdap value=\"" + rdapname + "\">");
    document.write("<input type=HIDDEN   name=rsacode value=\"" + rsaenccode + "\">");
    document.write("<input type=HIDDEN   name=subdb value=\"" + subdb + "\">");
    document.write("<input type=HIDDEN   name=wcds>");
    document.write("<input type=HIDDEN   name=id>");
    document.write("<input  type=hidden size=3  name=count >");
    document.write("<input type=hidden name=total value=" + numRows + ">");
    document.write("<input  type=hidden size=3  name=unsubmit value=no >");
    document.write("</form></td><td   align=left><div class=outset1  id=\"toolbarbase\"><table align=center style=\"margin:0px 0px 0px 0px\" cellpadding=0 cellspacing=0><tr>");

    document.write("<td id=\"allbuts\">");

    var tmpmm = mm;
    if (mm == 0)
        mm = 1;
    webserviceAlloptions = webserviceAlloptions + "<input name=coursetitle type=hidden><input name=semester type=hidden><input name=subfolder type=hidden value=submission >";

    if (typeof (mm) != 'undefined' && mm > 0)
    {
        document.write(webserviceAllbuts.replace(/this\.form\./, 'fsnd.').replace(/fsnd,'attach'/, "f1,'" + fields[11] + "'").replace(/<br>$/g, '').replace(/<br>/g, '').replace(/style=/g, "style=width:" + (leftbutwidth+2) + "px;overflow:show;").replace(/webservice\(ele\(0,6\),/g, "mwebservice(").replace(/ele\(0,6\)/g, "thecurrenttxtarea"));
    }
    document.write("</td>");

    document.write("<td>");
    var fsnd = null;
    var hasopttable = makesend();

    newformele('rdap', '', true);
    newformele('extraline', '', true);
    newformele('makescript', '', true);
    newformele('exbut', '', true);
    newformele('wording', '', true);


    document.write("</td>");

    document.write("<td  id=\"allwsopts\">");
    mm = tmpmm;

    if (webserviceAlloptions != null && webserviceAlloptions != '')
        document.write(webserviceAlloptions);
    document.write("</td></tr>");

    document.write("</table></div>");
    document.write("</td></tr>");
    document.write("</table>");
//document.write(round2.replace(/width:[^;]+/g,'width:0px').replace(/height:[^;]+/g,'height:0px').replace(/width=[^ ]+/g,'width=0'));

    var contenttd = document.getElementById("content");
    var writetbl = document.getElementById("writetable");
    var studentimage = getImageByName('image5');

    for (let j = 1; j < 6; j += 2)
    {
        writetbl.rows[0].cells[j].style.borderBottomColor = '#b0b0b0';
        writetbl.rows[0].cells[j].style.borderBottomWidth = '1px';
    }

    for (let j = 0; j < 9; j += 2)
    {
        writetbl.rows[0].cells[j].style.borderTopColor = TBGCOLOR;
        writetbl.rows[0].cells[j].style.borderTopWidth = '1px';
    }
    f1 = document.form1;
    if (mm > 0)
    {
        makeasso();
        writetbl.rows[1].cells[8].appendChild(f1.PhotoUrl);
    }

//fsnd = document.getElementById('frmsnd'); 
    ele = function (r, c)
    {
        return formselementbyname(f1, fields[c]);
    }


    var oldsetv = setv;
    setv = function (r, c, v)
    {
        if (numRows == 0)
            return;
        if (c == 4 && r == counter)
        {
            var z = parseFloat('' + v);
            if (z == -1 || z == -2)
            {
                f1.Score.style.color = f1.Score.style.backgroundColor;
            } else
                f1.Score.style.color = "red";
        }
        oldsetv(r, c, v);
    }

    ffsize[4] = "1";


    function mytimestr(s)
    {
        //var holdtime = timeformat;
        //timeformat = "YY/MM/DD hh:mm";
        var xx = timestr(s);
        //timeformat = holdtime;
        return xx.replace(/ /, '&nbsp;');

    }
    function butwdth(str) {
        return butwidth(str) - 1;
    }

    var thecurrenttxtarea = ele(0, 6);
    var thecurrenttxtarea1;
    var thecurrentpos = null;
    function switchbut(g)
    {
        var b = document.getElementById("gradeallbut");
        if (!b)
            return;
        if (g == 'g')
        {
            b.style.backgroundImage = null;
        } else
        {
            b.className = "OrangeButton";
        }
    }

    function mwebservice(s, jj, button)
    {
        var temp = ele(0, 6).value;
        var tid = null;
        if (thecurrenttxtarea.id != null && thecurrenttxtarea.id.length > 3)
        {
            tid = parseInt(thecurrenttxtarea.id.substring(3));
        }
        ele(0, 6).value = thecurrenttxtarea.value;
        thecurrenttxtarea = ele(0, 6);
        webservice(thecurrenttxtarea, s, jj, button);
        ele(0, 6).value = temp;
        if (tid != null)
            thecurrenttxtarea = document.getElementById('txt' + tid);
    }

    function onlinetoolbar(txt, c)
    {
        if (typeof (mm) == 'undefined' || mm == 0)
            return;
        var toolbar = document.getElementById("toolbarbase");
        var xx = document.getElementById("enlargebut");

        if (txt == null)
        {
            thecurrenttxtarea = ele(counter, 6);
            toolbar.style.cssText = "position:static;z-index:auto;top:0;left:0;background-color:" + DBGCOLOR;
            if (toolbar.getElementsByTagName('table')[0].rows[0].cells[0].innerHTML.indexOf('onlinetoolmini') > 0)
            {
                toolbar.getElementsByTagName('table')[0].rows[0].deleteCell(0);
                //if (toolbar.getElementsByTagName('table')[0].rows[0].cells[0].innerHTML.indexOf( 'copysubmittedtext') > 0)
                //   toolbar.getElementsByTagName('table')[0].rows[0].deleteCell(0);
            }
            if (xx != null)
                document.body.removeChild(xx);
        } else
        {
            if (thecurrentpos == null)
            {
                thecurrentpos = toolbar.parentNode;
            }
            thecurrenttxtarea = txt;

            var xy = findPositionnoScrolling(txt);
            if (xx != null)
            {
                xx.style.top = (xy[1] - 20) + "px";
                thecurrenttxtarea1 = txt;

                if (c == null)
                    return;
            }
            var ww = toolbar.getElementsByTagName('table');
            if (ww != null && ww.length > 0 && ww[0].rows[0].cells[0].offsetWidth > 30)
            {
                var zz = ww[0].rows[0].insertCell(0);
                //zz.style.cssText = "padding:0px 0px 3px 0px";
                zz.align = "center"
                zz.innerHTML = "<input type=button value=\"&middot;\" class=OrangeButton  style=\"text-align:center;width:" + (font_size + 6) + "px;height:" + (font_size + 6) + "px;font-size:" + (font_size) + "px;font-weight:bold\" onclick=\"onlinetoolmini()\">";
                ;
                //zz.onclick =   onlinetoolmini;
                // zz.style.cssText = "width:24px;background:url(image/tosmall.png)  no-repeat;background-position:2px  5px";
                //zz.style.cssText = "width:" + (font_size + 6) + "px;font-size:24px;font-weight:bold";  
                /*var yy= ww[0].rows[0].insertCell(1);
                 yy.innerHTML = "<input type=button value=\"&darr;\" class=GreenButton  style=\"text-align:center;width:" + (font_size + 6) + "px;height:" + (font_size + 6) + "px;font-size:" + (font_size) + "px;font-weight:bold\" onclick=\"copysubmittedtext()\">";
                 yy.style.cssText = "padding:0px 0px 0px 0px";
                 yy.align="center";
                 var zz= ww[0].rows[0].insertCell(2);
                 zz.innerHTML = "<input type=button value=\"" +textmsg[1628] + "\" class=GreenButton  style=\"text-align:center;width:" + Math.round(charwidthrate()*font_size) + "px;height:" + (font_size + 6) + "px;font-size:" + (font_size) + "px;font-weight:bold\" onclick=\"toclass()\">";
                 zz.style.cssText = "padding:0px 0px 0px 0px";
                 zz.align="center"*/
            }
            toolbar.style.cssText = "position:absolute;z-index:2;top:" + (xy[1] - toolbar.offsetHeight) + "px;left:" + xy[0] + "px;background-color:" + DBGCOLOR;
            // thecurrentpos.innerHTML = '';
            if (c == 1) {
                document.body.removeChild(xx);
            }
            if (ministate)
                onlinetoolmini();
        }
        unifonts(toolbar);
    }

    var rg = new RegExp("'", "g");
    function toclassasanswer(nn, vl)
    {
        if (vl == null)
            return;
        for (var n = 0; n < numRows; n++)
        {
            if (mat[n][1] == mat[nn][1] && mat[n][0] == mat[nn][0] && mat[n][20] == mat[nn][20])
            {
                mat[n][16] = vl;
            }
        }
        var key = mat[nn][0] + "@@@" + mat[nn][1] + "@@@" + mat[nn][20];

        var y = "u'" + mat[nn][16].replace(rg, "''") + "','" + mat[nn][1].replace(rg, "''") + "','" + mat[nn][20].replace(rg, "''") + "','" + mat[nn][0].replace(rg, "''") + "','" + semester.replace(rg, "''") + "'";
        modifiedanswer[key] = y;

    }

    function gradedistinct()
    {
        if (testsheet!=null)
        {
            if (testsheet.scorematrix[0] !== null)
                testsheet.byanswer(0,0);
            else if (testsheet.atd[0][6] === '4')
                testsheet.byanswer(0,-2);
            else 
                testsheet.byanswer(0,-3);
        }
    }

    function toclass(k)
    {
        var tid = testsheet.atd[k][0];
        var v = document.getElementById('txt' + k).value;
        //for (var kk=0; kk < 2; kk++)
        for (var n = 0; n < numRows; n++)
        {
            if (n == counter || mat[n][1] != mat[counter][1] || mat[n][0] != mat[counter][0] || mat[n][20] != mat[counter][20])
                continue;
            var tt;
            tt = (new CSVParse(retrv(n, 13), "|", ",", ";")).nextMatrix(true);

            var i = 0;
            if (tt != null && tt.length > 0)
                for (i = 0; i < tt.length; i++)
                {
                    if (tt[i][0] == tid)
                    {
                        if (tt[i][3] == null)
                        {
                           tt[i][3] = v; 
                        }
                        else if (tt[i][3].indexOf(v) < 0)
                        {
                            
                            if (tt[i][3] == null || tt[i][3] == '')
                                tt[i][3] = v;
                            else
                                tt[i][3] += "\n" + v;
                            
                        }
                        break;
                    }
                }
            if (i == tt.length)
            {
                if (tt.length == 0)
                {
                    tt = new Array();
                    tt[0] = [tid, '1', '0', v];
                } else if (tt.length == 1 && tt[0].length != 4)
                {
                    tt[1] = tt[0];
                    tt[0] = [tid, '1', '0', v];
                } else if (tt.length == 1 && tt[0].length == 4)
                {
                    tt[1] = [tid, '1', '0', v];
                } else
                {
                    tt[i] = tt[i - 1];
                    tt[i - 1] = [tid, '1', '0', v];
                }
            }
            var str = "";
            for (var i = 0; i < tt.length; i++)
            {
                for (var j = 0; j < tt[i].length; j++)
                {
                    if (tt[i][j] == null || tt[i][j] == '')
                    {

                    } else if (tt[i][j].indexOf(',') >= 0 || tt[i][j].indexOf(';') >= 0 || tt[i][j].indexOf('|') >= 0)
                    {
                        str += "|" + tt[i][j].replace(/\|/g, '||') + "|";
                    } else
                    {
                        str += tt[i][j];
                    }
                    if (j < tt[i].length - 1)
                    {
                        str += ",";
                    } else if (i < tt.length - 1)
                    {
                        str += ";";
                    }
                }

            }
            setv(n, 13, str);
            valuechanged[n] = true;
            TestSheet.cacheentered(n);
        }

    }


    var ministate = true;
    function onlinetoolmini()
    {
        var xy = findPositionnoScrolling(thecurrenttxtarea);
        thecurrenttxtarea1 = thecurrenttxtarea;
        onlinetoolbar();

        var d = document.createElement("div");
        d.className = 'OrangeButton';
        d.style.cssText = "position:absolute;z-index:13;background-color:orange;border-radius:10px;width:20px;height:20px;top:" + (xy[1] - 22) + "px;left:" + xy[0] + "px";
        d.innerHTML = "&nbsp";
        d.id = "enlargebut";
        d.onclick = function ()
        {
            ministate = false;
            onlinetoolbar(thecurrenttxtarea1, 1);

        }
        document.body.appendChild(d);
        ministate = true;
    }


    function numericgrade(event, t)
    {
        var code = 49;
        if (!event)
            var event = window.event;
        if (event.keyCode)
            code = event.keyCode;
        else if (event.which)
            code = event.which;

        if (code == 13)
        {
            var xv = (t.value).replace(/\.0+$/, '');
            if (xv != mat[counter][4])
            {
                setv(counter, 4, xv);
                TestSheet.cachEentered(counter);
                valuechanged[counter] = true;
            }
            goesto((counter + 1) % numRows);
            return true;
        } else if (code == 8 || code == 46)
            return true;
        if (code < 48 || code > 57)
            return false;
        return true;
    }

    function resizeCont()
    {
        lookarea();
        var wd = 200;//thispagewidth() -   48 - leftbutwidth;
        var het = 60 + 15 * font_size;
        if (wd < 200)
            wd = 200;
        if (het < 300)
            het = 300;
//0)Course,  1) AssignTest, 2) StudentId, 3) SubmitAt, 4) Score,  5)PhotoUrl,
//6)Content, 7) Comment, 8) due, 9) Format, 10) StudName, 11) Attachment
//12. atype, 13 assess, 14
        var xx = ele(0, 6);
        if (!istest)
        {
            let xy = findPositionnoScrolling(xx);
            let vy = (new Viewport());
            het = vy.windowY - xy[1] - 3 * font_size - 40;
            if (het > 1000)
                het = 1000;
            xx.parentNode.style.backgroundColor = TBGCOLOR;
            xx.style.height = "" + het + "px";
            xx.style.width = '100%';

        } else if (testsheet != null)
        {
            var nmq = testsheet.numq;
            for (var i = 0; i < nmq; i++)
            {
                var cbox = document.getElementById("commentbox" + i);
                if (cbox != null)
                {
                    cbox.style.width = "100px";
                }
            }
        }
    }


    function rewrite(tmptxt, i, j)
    {
        var tablecells = writetbl.rows[i].cells;
        if (tmptxt.indexOf('<table') >= 0)
            tablecells[j].width = '201px';
        tablecells[j].innerHTML = (tmptxt.length < 35 ? ("<nobr>" + tmptxt + "</nobr>") : ("<div style=width:200px;overflow:hidden><nobr>" + tmptxt + "</nobr></div>"));
    }

    var picarray = null;
    function genattpic(str)
    {
        var tmptxt = "";
        if (str == null || str == '')
            return "";
        var attarr0 = ResizeUploaded.unzip(str);
        var attarr = attarr0.split(/,/);
        for (var i = 0; i < attarr.length; i++)
        {
            var xs = attarr[i].split(/@/);
            if (xs.length == 3 && xs[2].indexOf('_') < 0 && attarr0.indexOf("@" + xs[0] + "@") < 0)
            {
                picarray[picarray.length] = xs[2];
                if (xs[0].toLowerCase().indexOf('.jpg') >= 0 || xs[0].toLowerCase().indexOf('.png') >= 0 || xs[0].toLowerCase().indexOf('.gif') >= 0)
                    tmptxt += "<img  id=\"imgiframe" + (picarray.length - 1) + "\" onload=loadpic(" + picarray.length + ") />";
                else
                    tmptxt += "<iframe  id=\"imgiframe" + (picarray.length - 1) + "\" width=800 height=1200  onload=loadpic(" + picarray.length + ") />";
            }
        }

        return tmptxt;
    }
    var questionnums = [];

    function genAttach(str)
    {
        return ResizeUploaded.unzip(str).replace(/@[^,]+/g, '').replace(/,$/, '').replace(/,/g, ', ')
    }

    openit3 = function (str)
    {
        var x = ("FileOperation?folder="
                + encodeURIComponent(subdb + "/" + retrv(counter, 0) + "/submission/" + retrv(counter, 2))
                + "&filedir=" + str + "&operation=open&securitytoken=" + securitytoken);
        postopen(x, '_blank');
    }

    function doattach(str)
    {
        rewrite(genAttach(str), 1, 7);
    }

    function subtimestr(n)
    {
        if (mat[n][3] == '0')
            rewrite(textmsg[397], 1, 3);
        else
        {
            rewrite(mytimestr(mat[n][3]), 1, 3);
        }
    }

    function timestrstr(n)
    {
        rewrite(mytimestr(mat[n][8]), 0, 3);


        var tt = parseInt(mat[n][8]) - parseInt(mat[n][3]);

        var ss = "";
        if (tt <= -60)
        {
            tt = -tt;
            ss = textmsg[396];

        } else if (timenow < parseInt(mat[n][8]))
        {
            tt = parseInt(mat[n][8]) - timenow;
        } else
        {

            subtimestr(n);

            return;
        }

        var fen = (tt - tt % 60) / 60;
        var yufen = fen % 60;
        var shi = (fen - yufen) / 60;
        var tmp = "";
        //Ff.timestate.value= "";
        if (shi != 0)
            tmp += shi + textmsg[393];
        if (yufen != 0)
            tmp += yufen + textmsg[394];

        if (ss != '')
            rewrite("<font color=#CC0000>" + tmp + textmsg[141] + "</font>", 1, 3);
        else
        {
            rewrite(mytimestr(mat[n][3]), 1, 3);
        }
    }


    function studentinfo(n)
    {
        var count = parseInt(document.thisform.count.value) - 1;
        if (n == null) n = count;
        var str = "studentpage.jsp?mode=instructor&sid=" + mat[n][2];
        window.open(str, '_blank');
    }

    showattachment = function (t, r)
    {
        doattach(ResizeUploaded.unzip(t));
    }

    var needtolock = false;
    function swtichstatus(b, n)
    {
        var nms = ['rdap', 'rsacode', 'subdb', 'wcds', 'securitytoken', 'orgnum'];
        var vls = ['assignedit', '0', f1.subdb.value, '', '', orgnum];
        vls[3] = "u,,,,,," + b + ",,,,,,,,,,,'" + mat[counter][1].replace(rg, "''") + "','" + mat[counter][20].replace(rg, "''") + "','" + mat[counter][0].replace(rg, "''") + "','" + semester.replace(rg, "''") + "'";
        if (b == -1)
            vls[3] = "u,,,,,,,,,,,,," + n + ",,,,'" + mat[counter][1].replace(rg, "''") + "','" + mat[counter][20].replace(rg, "''") + "','" + mat[counter][0].replace(rg, "''") + "','" + semester.replace(rg, "''") + "'";
        postopen('SaveBack', nms, vls, "w" + tstmp);
    }
    function  populatemore(n)
    {
        document.getElementById('contbutt').style.marginTop = '0px';
        if (n < 0)
        {
            myprompt(textmsg[117]);
        } else
        {
           
            var i, j;
            if (allass.indexOf(',') > 0)
                rewrite('<table width=100% style=background-color:transparent><tr  style=background-color:transparent><td align=left  style=background-color:transparent;color:blue onclick="javascript:showanswer()">' + mat[n][1] + '</td><td width=10 style=color:blue;background-color:transparent;font-size:20px;padding:0px  onclick=selass(this)>&#9662;</td></tr></table>', 0, 1);
            else 
                rewrite('<a href="javascript:showanswer()">' + mat[n][1] + '</a>', 0, 1);

            rewrite(mat[n][2] + ' <a href="javascript:studentinfo()">' + mat[n][10] + '</a>', 1, 1);
            // document.getElementById("sids").innerHTML = mat[n][2];

            doattach(retrv(counter, 11));

            // i = f1.elements[lookup[0]].selectedIndex;
            i = 0;

            if (i <= options[0].length)
            {
                timestrstr(n);
            } else
            {
                rewrite("", 0, 3);
                subtimestr(n);
            }

            rewrite(mat[n][18], 0, 5);
            if (parseFloat(mat[n][19]) < 0 || parseFloat(mat[n][19]) >= 100)
                rewrite(textmsg[1858], 1, 5);
            else
                rewrite(mat[n][19] + '%', 1, 5);
            ele(0, 4).value = ele(0, 4).value.replace(/\.0+$/, '');
            if (writetbl.rows[0].cells[8].innerHTML.length < 20 && rdapname != 'gradingsub')
                writetbl.rows[0].cells[8].appendChild(f1.content);
            removeimagediv();
            removeassdiv();
            removefreediv();
            needcheck = true;
            showass(n);
            onlinetoolbar();
            ele(0, 4).focus();

            if (mat[n][7].indexOf('#') == 0 && valuechanged[n] == false)
            {
                f1.elements[lookup[7]].value = mat[n][7].replace(/^#/, "");
                myprompt(mat[n][7].replace(/^#/, ""), null, null, textmsg[400]);
            }
            valuechanged[n] = false;
            if (n == 0)
            {
                needtolock = (parent != window && numRows > 1 && parent.frames[0].retrv(0, 3).selectedIndex != 0 &&
                        parseFloat(mat[n][19]) >= 5 && parseFloat(mat[n][18]) >= 10
                        && parent.frames[0].retrv(0, 4) == '' && parent.frames[0].retrv(0, 5) == ''
                        && parent.frames[0].retrv(0, 9) == '' && parent.frames[0].retrv(0, 10) == ''
                        && parent.frames[0].ele(0, 6).selectedIndex == 2);
                if (needtolock)
                {
                    swtichstatus(3);
                } else if (mat[n][12] == '4' && rdapname != 'gradingsub')
                {

                    var m = testsheet.atd.length - 1;
                    if (testsheet.atd[m].length < 7)
                        m++;
                    if ('' + m != mat[n][18])
                    {
                        swtichstatus(-1, m);
                        for (var k = 0; k < numRows; k++)
                            if (mat[k][0] == mat[0][0] && mat[k][1] == mat[0][1] && mat[k][20] == mat[0][20])
                                mat[k][18] = '' + m;
                        rewrite('' + m, 0, 5);
                    }
                }
            }
            var needbut = ((mat[n][12] == '1' || mat[n][12] == '3' || mat[n][12] == '4') && rdapname != 'gradingsub');
            var calbut = document.getElementById('calbut');
            if (needbut)
            {
                calbut.className = "GreenButton";
                //calbut.style.backgroundImage = "url(image/GreenButton.gif)";
                calbut.style.color = "white";
            } else
            {
                calbut.className = null;
                calbut.style.backgroundImage = gradientbg;
                calbut.style.color = "#DDCC11";
            }
        }
        completehelpstr(n);
        thisheight = thispageheight();
      /*  if (testsheet!=null && testsheet.atd!=null)   {
        var xx = '<table style=border-collapse:collapse border=1 cellpadding=3>';
 xx += '<tr><td>0#</td><td>0shuffle</td><td>2pts</td><td>3score</td><td>4outcome</td><td>5time</td><td>6sformat</td><td>7question</td><td>8submit</td><td>9answer</td><td>comment</td></tr>';
             
for (let i=0; i < testsheet.atd.length; i++)
{
    xx+='<tr>';
    for (let j =0; j < testsheet.atd[i].length; j++)
        if (j !== 7)
        xx +='<td>' + testsheet.atd[i][j] + '</td>'; 
        else xx +='<td>' + testsheet.atd[i][j].substring(0,20) + '</td>'; 
    xx+='</tr>';
}
myprompt(xx +'</table>');

} */
            
            
            
    }
    var thisheight = 0;
    function pickthis(spn)
    {
        if (spn.style.color == 'black' || spn.style.color == 'rgb(0,0,0)')
        {
            var x = spn.innerHTML;
            for (var j = 0; j < numRows; j++)
            {
                if (mat[j][1] == x)
                    break;
            }
            goesto(j);
        }
        var t = document.getElementById('allass');
        document.body.removeChild(t);
    }
    function selass(td)
    {
        var td = td.parentNode.cells[0];
        var xys = findPositionnoScrolling(td, window);
        var tbl = document.createElement('table');
        tbl.id = "allass";
        tbl.style.border = "1px #b0b0b0 outset";
       
        var asses = allass.split(/,/);
        tbl.style.backgroundColor = DBGCOLOR;
        for (var i = 0; i < asses.length; i++)
        {
            var row = tbl.insertRow(i);
            var cell = row.insertCell(0);
            var y = td.innerHTML.replace(/<[^>]*>/g, '');
            cell.style.color = (asses[i] == y ? 'blue' : 'black');
            cell.onclick = function () {
                pickthis(this);
            }
            cell.innerHTML = asses[i];
            //cell.innerHTML = "<span style=\"color:" + (asses[i]==y?'blue':'black') + "\" onclick=\"pickthis(this)\">" + asses[i] +"</span>";
        }
        tbl.style.zIndex = '30';
        tbl.style.position = 'absolute';
        tbl.style.top = xys[1] + 'px';
        tbl.style.left = xys[0] + 'px';
        tbl.style.width = (td.parentNode.parentNode.offsetWidth) + 'px';
        document.body.appendChild(tbl);
    }
    
   

    function removefreediv()
    {
        if (freetxt != null)
        {
            LaTexHTML.reset();
            //contenttd.appendChild(f1.content);
            contenttd.removeChild(freetxt);
            freetxt = null;
        }
        closeprompt();
    }
    var imagetxt = null;
    function removeimagediv()
    {
        clearcommentdv();
        if (imagetxt != null)
        {
            LaTexHTML.reset();
            contenttd.removeChild(imagetxt);
            imagetxt = null;
        }
        closeprompt();
    }

    function removeassdiv()
    {
        if (asstxt != null)
        {
            LaTexHTML.reset();
            contenttd.removeChild(asstxt);
            asstxt = null;
        }
        closeprompt();
    }

    function goeditthiscell()
    {
        editthiscell(this);
        var txt = document.getElementById("movingdiv");
        if (txt != null)
            onlinetoolbar(txt.childNodes[0]);
    }



    function makeback()
    {
        if (testsheet != null)
            testsheet.makeback();

        if (f1.content.value.length > 20)
            mat[counter][6] = f1.content.value;
        onlinetoolbar();
    }
    function doaftersave()
    {
        var zz = "";
        for (var x in modifiedanswer)
        {
            var y = modifiedanswer[x];

            if (y == null || y == '')
                continue;
            if (zz != '')
                zz += ';';
            zz += y;

            modifiedanswer[x] = null;
        }
        var nms = ['rdap', 'rsacode', 'subdb', 'wcds', 'securitytoken', 'orgnum']
        var vls = ['assignupdateanswer', '0', f1.subdb.value, zz, securitytoken, orgnum];
        postopen('SaveBack', nms, vls, "w" + tstmp);

    }
    function displaytxt(ta, evt, j)
    {
        var tbl1 = ta.parentNode.parentNode.parentNode;
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

        if (key == 13)
        {
            var fmt1 = guessFormat(ta.value);
            /*
             if (fmt1==1 || fmt1==2)
             tbl1.rows[j*6+5].cells[0].innerHTML = ta.value;
             else
             tbl1.rows[j*6+5].cells[0].innerHTML = ta.value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace('\n','<br>');
             if (fmt1==2  )
             {
             AMtranslated = false;
             translate(null);
             }
             ta.rows = ta.rows + 1;
             */
        }

        return true;
    }

    var uniformula = new Array();


    var assessinfo = new Array();


    function setready(str)
    {
        myprompt(str.replace(/\n/g, '<br>') + textmsg[1325]);
    }
    function gradealli()
    {
        let assignname = mat[0][1];
        let sessionname = mat[0][20];
        window.open('gradeQuiz.jsp?gradeall=1&subdb=' + subdb + '&course=' + mat[0][0]+ '&sessionname=' + sessionname + '&assignname=' + assignname, "w" + tstmp);//"_blank");// 
        switchbut('g');
    }

    var testsheet = null;
    var istest = false;
    
    function reconstruct(t)
    {
       let r = new RegExp(/\n[0-9]+[\.|,| |\-]/);
       let rs = [];
       let k = 0, j;
       let m;
       let i = 0;
       while((m = r.exec(t.substring(k)))!==null)
       {
        if (i>0) rs[i] = t.substring(k,m.index + k).replace(/^[ ]+/,'').replace(/[ ]+$/,'');
        let ss = m.toString();
        i = parseInt(ss.replace(/[^0-9]/g,''));
        rs[i] = t.substring(m.index + k + ss.length);
        r = new RegExp("\n" + (i+1) + '[\.|,| |\-]');
        k += m.index + ss.length;
       }
       t= ''; k=0;
       for (let i in rs)
       {
          let atype = 0;
          if (rs[i].length==1 && rs[i].replace(/[a-z]/i,'')=='' || rs[i].length>1 && rs[i].replace(/[a-z] /i,'')=='')
               atype = 4;
          if (t!=='') t += '\n';
          t += i + ",'" + rs[i].replace(/'/g,"''")  + "',0," + atype + "," + i + ",-1";
       }
       return t;
    }
    function showcsvsource(t)
    {
        let tooltd = null;
        let tbl = document.getElementById('scoredetailtbl');
        let toolbar = document.getElementById('contbutt');
        if (writetbl.rows[2].cells.length == 1)
        {
            tooltd = writetbl.rows[2].insertCell(0);
            tooltd.vAlign = 'top';
            tooltd.style.padding = '0px';
            tooltd.style.backgroundColor = IBGCOLOR;
            contenttd.colspan = 8;

            tooltd.appendChild(studentimage);
            studentimage.style.position = 'static';
            tooltd.appendChild(tbl);
        } else
        {
            tooltd = contenttd.previousSibling;
            if (topmenu && tooltd == studentimage.parentNode)
            {
                document.body.appendChild(studentimage);
                writetbl.rows[0].cells[0].style.minWidth = leftbutwidth + 'px';
                writetbl.rows[1].cells[0].style.minWidth = leftbutwidth + 'px';
                studentimage.style.position = 'absolute';
                toolbar.rows[0].cells[1].appendChild(tbl);
                writetbl.rows[2].deleteCell(0);
                writetbl.rows[2].cells[0].colSpan = '9';
            }

        }
        if (t.innerHTML == textmsg[1710])
        {
            t.innerHTML = textmsg[1709];
        } else
            t.innerHTML = textmsg[1710];
        makeback();
        populate(counter);
        let btn = document.getElementById('csvsourcebut');
        if (btn!=null && btn.innerHTML!==textmsg[1706])
        {
            btn = document.getElementById('updatebtn');
            if (btn!=null)
            {
                btn.value = textmsg[156];
                var nf = false;
                var correctedt;
                var parsecsv = function()
                {
                    let str = "<table  cellpadding=3 border=1 style=border-color:#ddcc99;border-collapse:collapse;background-color:" + TBGCOLOR +" ><tr style=\"white-space:nowrap;background-image:linear-gradient("+ BBGCOLOR +',' + TBGCOLOR+")\" ><td style=\"padding-left:4px;padding-right:4px;white-space:nowrap;background-image:linear-gradient("+ BBGCOLOR +',' + TBGCOLOR+")\"  align=right > # </td><td style=\"white-space:nowrap;background-image:linear-gradient("+ BBGCOLOR +',' + TBGCOLOR+")\"  align=left>" + textmsg[1629] + "</td><td style=\"white-space:nowrap;background-image:linear-gradient("+ BBGCOLOR +',' + TBGCOLOR+")\"  align=center>" +
                    textmsg[494] + "</td><td style=\"white-space:nowrap;background-image:linear-gradient("+ BBGCOLOR +',' + TBGCOLOR+")\"  align=left>" + textmsg[156] + "</td><td style=\"white-space:nowrap;background-image:linear-gradient("+ BBGCOLOR +',' + TBGCOLOR+")\"  align=center>" +
                    textmsg[1867].replace(/@.*$/,'') + "</td><td style=\"white-space:nowrap;background-image:linear-gradient("+ BBGCOLOR +',' + TBGCOLOR+")\"  align=center>" +textmsg[1867].split(/@/)[1] + "</td></tr>";
                    let t = document.form1.content.value;
                    let csv = (new CSVParse(t.replace(/^[0-9][0-9][0-9][0-9]*\n/,''), "'", ",", "\r\n")).nextMatrix();
                    nf = false;
                    if (csv[0].length < 2)
                    {
                        nf = true;
                        correctedt = reconstruct('\n' + t.replace(/^[0-9][0-9][0-9][0-9]*\n/,''));
                        csv = (new CSVParse(correctedt, "'", ",", "\r\n")).nextMatrix();
                    }
                    
                    for (let k=0; k < csv.length; k++)
                    {
                        let fmt = '0'; if (csv[k].length>3) fmt = (csv[k][3]);
                        let f = textmsg[83];//csv[k][3];
                        //if (fmt =='0') f =  textmsg[83];
                         if (fmt =='1') f = "HTML";
                        else if (fmt =='2') f = "LaTeXML";
                        else if (fmt =='3') f =  textmsg[1847];
                        else if (fmt =='4') f = textmsg[69] + "Tab";  
                        let es = '-1'; if (csv[k].length>5) es = csv[k][5];
                        if (es == '-1') es = textmsg[801];
                        str += "<tr><td align=right valign=top >" +  csv[k][0]+ "</td><td align=left valign=top >" + csv[k][1] + "</td>"
                        + "<td align=right valign=top >" + (csv[k].length>2 ?csv[k][2]:'not measured') + "s</td><td align=left valign=top >" + f + "</td>"
                       + "<td align=right valign=top >" + (csv[k].length>4?csv[k][4]:csv[k][0]) + "</td><td align=right valign=top >" + es + "</td>";
                    }
                    return str +  "</table>";
                }
                btn.onclick = function()
                {
                    if (thisfmtnow == '2')LaTexHTML.deformat(tb.rows[2].cells[1]);
                    let str = parsecsv();
                    if (nf)
                    {
                        document.form1.content.value = correctedt;
                    }
                    let jj = tb.rows[2].cells[1].innerHTML.indexOf('</select>');
                    tb.rows[2].cells[1].innerHTML = tb.rows[2].cells[1].innerHTML.substring(0,jj+9) +  str;
                    if (thisfmtnow == '2')LaTexHTML.reformat(tb.rows[2].cells[1]);
                }
                let tb = document.getElementById('gradetab');
                tb.rows[1].cells[0].innerHTML=tb.rows[1].cells[1].innerHTML = '';
                tb.rows[1].height = '1';
                tb.rows[3].cells[0].innerHTML=tb.rows[3].cells[0].innerHTML.replace(/<nobr>.*<.nobr>/,tb.rows[2].cells[0].innerHTML);
                tb.rows[2].cells[0].innerHTML = textmsg[1867].split(/@/)[2];
                let str = parsecsv();
                let jj = tb.rows[2].cells[1].innerHTML.indexOf('</select>');
                tb.rows[2].cells[1].innerHTML = tb.rows[2].cells[1].innerHTML.substring(0,jj+9) +  str;
                thisfmtnow = mat[counter][9];
                if (thisfmtnow == '2')LaTexHTML.reformat(tb.rows[2].cells[1]);
                let tb1 = btn.parentNode.parentNode.parentNode; 
                if (tb1.tagName.toLowerCase()!='table') tb1 = tb1.parentNode;
                tb1.deleteRow(2);tb1.deleteRow(1);
                document.form1.fmtbox.onchange = function()
                {
                    let sel = this;
                    let i = sel.options[sel.selectedIndex].value;
                    if(thisfmtnow == ''+i) return;
                    if (thisfmtnow == '2')
                        LaTexHTML.deformat(tb.rows[2].cells[1]);
                   thisfmtnow = ''+i;
                   setv(counter,9,thisfmtnow);
                   valuechanged[counter] = true; 
                   if (thisfmtnow=='2')
                     LaTexHTML.reformat(tb.rows[2].cells[1]);
                }
            }
        }
        showphoto();
        if (document.body == studentimage.parentNode)
        {
            writetbl.rows[0].cells[0].style.minWidth = (2 * leftbutwidth + 6) + 'px';
            writetbl.rows[1].cells[0].style.minWidth = (2 * leftbutwidth + 6) + 'px';
            writetbl.rows[0].cells[0].align = 'right';
            writetbl.rows[1].cells[0].align = 'right';
        } else
        {
            writetbl.rows[0].cells[0].style.minWidth = leftbutwidth + 'px';
            writetbl.rows[1].cells[0].style.minWidth = leftbutwidth + 'px';
            writetbl.rows[0].cells[0].align = 'left';
            writetbl.rows[1].cells[0].align = 'left';
        }
    }
//0)Course,  1) AssignTest, 2) StudentId, 3) SubmitAt, 4) Score,  5)PhotoUrl,
//6)Content, 7) Comment, 8) due, 9) Format, 10) StudName, 11) Attachment
//12. atype, 13 assess
//14, AsAssess,15, question, 16, Answer, 17Attachat,18 Scale, 19 Weight, 20 Sessions
//21 Aformat
    var summary = null;
    var freetxt = null;


    var showquestionanswer = false;
    function showqa()
    {
        showquestionanswer = !showquestionanswer;
        var tt = document.getElementById('gradetab');
        var lbl = document.getElementById('copyscorelbl');
        var txt = document.getElementById('copyscore');
        var btn = document.getElementById('copysavebtn');
        if (showquestionanswer)
        {
            lbl.style.visibility = 'visible';
            txt.style.visibility = 'visible';
            btn.style.visibility = 'visible';
            var zw = freeformat.makequestionanswers();
            var r = tt.rows[0];

            var c = r.cells[0];
            c.vAlign = 'top';
            c.align = 'left';
            c.colSpan = 1;
            c.innerHTML = "<nobr><b>" + textmsg[456] + "</b></nobr>";

            c = r.insertCell(1);
            c.vAlign = 'top';
            c.colSpan = 2;
            c.innerHTML = "<div style=text-align:center;display:block;color:blue onclick=showqa()>" + textmsg[732] + textmsg[456] + "</div>" + zw[0];

            r = tt.insertRow(1);
            c = r.insertCell(0);
            c.vAlign = 'top';
            c.align = 'left';
            c.innerHTML = "<nobr><b>" + textmsg[457] + "</b></nobr>";


            c = r.insertCell(-1);
            c.colSpan = 2;
            c.vAlign = 'top';
            c.align = 'left';
            c.innerHTML = zw[1];
        } else
        {
            tt.deleteRow(1);
            //tt.cells[0].innerHTML = "XXXX";
            var r = tt.rows[0];
            r.deleteCell(1);
            var c = r.cells[0];
            c.colSpan = 3;
            c.align = 'center';
            c.innerHTML = '<div style=color:blue onclick=showqa()>' + textmsg[178] + '/' + textmsg[144] + '</div>';
            lbl.style.visibility = 'hidden';
            txt.style.visibility = 'hidden';
            btn.style.visibility = 'hidden';
            
        }
    }


    var synscore1 = function ()
    {
        var e = document.getElementById('copyscore');
        if (e != null)
            e.value = retrv(freeformat.n, freeformat.scoreindex);
    }

    var freeformat;
    var imagesub = false;
    var markend = 0;

    function showass(n)
    {
        var asstxt0 = document.getElementById("scoredetail");
        asstxt0.innerHTML = '';
        freepicture = false;
        if (rdapname == 'gradingsub')
        {
            if (mat[n][12] == '1' || mat[n][12] == '3' || mat[n][12] == '4')
                myprompt(textmsg[1719]);
            return;
        }

        istest = (mat[n][12] == '1' || mat[n][12] == '3' || mat[n][12] == '4');
        document.getElementById('unigradebut').style.visibility = istest ? 'hidden' : 'visible';
        //var isdelay = istest;//(mat[n][13].indexOf(" " + textmsg[141] + "|") >=14);
        if (istest)
        {
            document.getElementById('csvsourcebut').style.visibility = 'visible';
            istest = (document.getElementById('csvsourcebut').innerHTML == textmsg[1710]);
        } else
        {
            document.getElementById('csvsourcebut').style.visibility = 'hidden';
        }

        var tmpx = mat[n][14];
        tmpx = tmpx.replace(/^;/, '');
        if (isNaN(tmpx.replace(/,.*$/, '').replace(/\|/g, '')))
            tmpx = tmpx.replace(/[^;]+;/, '').replace(/[^0-9]/g, '');

        if (istest || mat[n][14] != '' && tmpx != '')
        {
            doattach(mat[n][11]);
            let sheet = retrv(n, 13); if (sheet ==null || sheet =='') sheet = mat[n][13];
            if (sheet =="")
            {
                 let key = 'grading'+semester + '_' + mat[n][0]  + '_' + mat[n][1] + '_' + mat[n][2];
                 if (localStorage[key] != null)
                    sheet = JSON.parse(localStorage[key])[1];
            }
            testsheet = new TestSheet(n, mat[n][6], mat[n][14], sheet, mat[n][21], istest, mat[n][15], mat[n][16], mat[n][17], mat[n][11], 4, 13);
        } else
            testsheet = null;

        var tableformated = false;

        if (istest && testsheet.numq > 0)
        {
            var ww = testsheet.makequestanswer();
            
            
            if (ww != mat[counter][6])
            {
                if (mat[n][9] == '6')
                {
                    removefreediv();
                    removeassdiv();
                    tableformated = true;
                    asstxt0.parentNode.parentNode.rows[1].cells[0].innerHTML = labels[4];
                    f1.content.style.height = '0px';
                    f1.content.style.width = '0px';
                    f1.content.style.visibility = 'hidden';
                    f1.content.style.borderWidth = "0px";
                    f1.content.style.margin = '0px';
                    imagetxt = document.createElement("div");
                    imagetxt.style.cssText = "margin:0px;font-family:inherit";
                    var hh = [800, 700, 4];
                    imagetxt.innerHTML = makeimgs(n, hh, mat[n][11], mat[n][13]) + testsheet.makecomments(hh);
                    // fromjson();

                    if (f1.content.parentNode == contenttd)
                    {
                        contenttd.insertBefore(imagetxt, f1.content);
                        if (rdapname != 'gradingsub')
                            writetbl.rows[0].cells[8].appendChild(f1.content);
                    } else
                        contenttd.appendChild(imagetxt);
                    asstxt0.parentNode.parentNode.rows[1].cells[0].innerHTML = textmsg[463];
                    if (testsheet != null)
                        asstxt0.innerHTML = testsheet.makesheet();
                    document.getElementById('sumptr').innerHTML = retrv(n, 18);
                } else
                {
                    removefreediv();
                    removeimagediv();
                    tableformated = true;
                    asstxt0.parentNode.parentNode.rows[1].cells[0].innerHTML = labels[4];
                    f1.content.style.height = '0px';
                    f1.content.style.width = '0px';
                    f1.content.style.visibility = 'hidden';
                    f1.content.style.borderWidth = "0px";
                    f1.content.style.margin = '0px';

                    let y = baseheight() - (topmenu ? 0 : (font_size + 20));
                    asstxt = document.createElement("div");
                    asstxt.style.cssText = "background-color:" + TBGCOLOR + ";margin:0px;padding:0px;width:100%;font-family:inherit;height:" + y + 'px;overflow:scroll';
                    asstxt.innerHTML = ww;//testsheet.makequestanswer();
                    if (f1.content.parentNode == contenttd)
                    {
                        contenttd.insertBefore(asstxt, f1.content);
                        if (rdapname != 'gradingsub')
                            writetbl.rows[0].cells[8].appendChild(f1.content);
                    } else
                        contenttd.appendChild(asstxt);
                    contenttd.style.backgroundColor = TBGCOLOR;
                    if (n > 0)
                        testsheet.latex();
                }
            }
            
        }

        if (!istest && mat[n][9] == '6')
        {
            freepicture = true;
            removefreediv();
            removeassdiv();
            tableformated = true;
            asstxt0.parentNode.parentNode.rows[1].cells[0].innerHTML = labels[4];
            f1.content.style.height = '0px';
            f1.content.style.width = '0px';
            f1.content.style.visibility = 'hidden';
            f1.content.style.borderWidth = "0px";
            f1.content.style.margin = '0px';
            imagetxt = document.createElement("div");
            imagetxt.style.cssText = "margin:2px 2px 2px 2px;font-family:inherit";
            var hh = [800, 700, 4];
            imagetxt.innerHTML = makeimgs(n, hh, mat[n][11], mat[n][13]);
            //fromjson();
            if (f1.content.parentNode == contenttd)
            {
                contenttd.insertBefore(imagetxt, f1.content);
                if (rdapname != 'gradingsub')
                    writetbl.rows[0][8].appendChild(f1.content);
            } else
            {
                contenttd.appendChild(imagetxt);
            }
            asstxt0.parentNode.parentNode.rows[1].cells[0].innerHTML = textmsg[463];
            if (testsheet != null)
                asstxt0.innerHTML = testsheet.makesheet();
        } else if (tableformated == false)
        {
            if (mat[n][14] != null && mat[n][14] != '')
            {
                asstxt0.parentNode.parentNode.rows[1].cells[0].innerHTML = textmsg[463];
                if (testsheet != null)
                    asstxt0.innerHTML = testsheet.makesheet();
                onlinetoolbar();
                removeassdiv();
                removeimagediv();
            }

            var len = Math.ceil(mat[n][13].length / 60);
            if (len == 0)
                len = 1;

            freetxt = document.createElement("div");
            freetxt.id = "solid";
            freetxt.style.cssText = "margin:0px 0px 0px 0px;font-family:inherit;width:100%";
            //0)Course,  1) AssignTest, 2) StudentId, 3) SubmitAt, 4) Score,  5)PhotoUrl,
//6)Content, 7) Comment, 8) due, 9) Format, 10) StudName, 11) Attachment
//12. atype, 13 assess
//14, AsAssess,15, question, 16, Answer, 17Attachat,18 Scale, 19 Weight, 20 Sessions
//21 Aformat

            freeformat = new FreeFormat(n, 6, 9, 4, 11, 15, 16, 17, 21);

            freetxt.innerHTML = freeformat.makefreetxt();
            if (f1.content.parentNode == contenttd)
                contenttd.insertBefore(freetxt, f1.content);
            else
                contenttd.appendChild(freetxt);
            // var t = document.getElementById('tquestanswer');
            if (n > 0)
                LaTexHTML.reformat(freetxt);
            document.getElementById('contentcomment').appendChild(f1.content);
            f1.content.style.borderWidth = "1px";
            f1.content.style.borderColor = "#b0b0b0";
            f1.content.style.width = '100%';
            f1.content.style.visibility = 'visible';
            f1.content.style.height = "500px";

            if (!ismobile())
            {
                var div = document.createElement('div');
                div.id = "barfather6";
                div.innerHTML = '<div id=horbar6 style="background:url(image/horbar.jpg);cursor:s-resize;height:2px;width:90%;margin:0px 0px 0px 0px;border:0px"></div>';
                document.getElementById('contentcomment').appendChild(div);
                initmovebar();
            }
            let tb = document.getElementById('gradetab');
            tb.rows[1].cells[0].innerHTML=tb.rows[1].cells[1].innerHTML = '';
            tb.rows[1].height = '1';
        }
        if (istest == false && (mat[n][12] == '1' || mat[n][12] == '3' || mat[n][12] == '4'))
        {

            var asg = (new CSVParse(retrv(n, 13), "|", ",", ";")).nextMatrix(false);
            var i = asg.length - 1;
            summary = asg[i];

            if (summary.length != 7)
            {
                i = asg.length;
                summary = [asg.length - 1, '0', '0', 'S', '0', '0.0', ''];
            }
            var sum = 0;
            for (var j = 0; j < asg.length - 1; j++)
            {
                if (!isNaN(asg[j][2]))
                    sum += parseFloat(asg[j][2]);
            }

            summary[2] = '' + sum;
            var str = "<div class=outset3><table width=100% cellspacing=1 cellpadding=3 >"
                    + "<tr><td align=right bgcolor=" + BBGCOLOR + ">" + textmsg[560] + " Q=</td><td  bgcolor=" + TBGCOLOR + ">" + summary[0] + "</td></tr>"
                    + "<tr><td   align=right  bgcolor=" + BBGCOLOR + " >" + textmsg[1285] + " </td><td   bgcolor=" + TBGCOLOR + "  ><input class=gradetxt style=text-align:left name=dropn value=\"" + summary[1] + "\" onchange=\"updateasg(this," + i + ",1)\" size=4></td></tr>"
                    + "<tr><td   align=right  bgcolor=" + BBGCOLOR + ">" + textmsg[1288] + " S=</td><td    bgcolor=" + TBGCOLOR + " id=sumtd style=\"color:red;font-weight:700;white-space:nowrap\" align=left>" + summary[2] + "</td></tr>"
                    + "<tr><td   align=right   bgcolor=" + BBGCOLOR + ">" + (mat[n][12]=='4'?textmsg[1309]:textmsg[1287]) + " T=</td><td   bgcolor=" + TBGCOLOR + " >" + summary[4] + "</td></tr>"
                    + "<tr><td   align=right   bgcolor=" + BBGCOLOR + ">" + textmsg[1286] + "</td><td   bgcolor=" + TBGCOLOR + " ><input class=gradetxt name=formula style=width:100px;text-align:left value=\"" + summary[3] + "\" onchange=\"updateasg(this," + i + ",3)\" ></td></tr>"
                    + "<tr><td colspan=2 align=center><input type=button class=GreenButton style=\"width:70px;text-align:center;\" name=docalc value=\"" + textmsg[225] + "\" onclick=\"updateasg(this," + i + ",3)\" ></td></tr>"
                    + "<tr><td colspan=2  >" + summary[6] + "</td></tr></table></div>";
            if (document.getElementById('csvsourcebut') != null && testsheet != null && testsheet.goodformat == false)
            {
                resumetodo = "";
                confirmformat(counter);
            } else
                myprompt(str);

        }
        if (testsheet != null && testsheet.goodformat == false)
        {
            myprompt(textmsg[1568], null, "if(v)showcsvsource1()");
            setpromptbutlabel(textmsg[1569], textmsg[1570]);
            document.getElementById('csvsourcebut').style.visibility = 'visible';
        }
      /* if (testsheet!=null && testsheet.hasfillblank)
        {
            var zzz = '';
            for (let zz in testsheet.lscores)
                if (testsheet.lscores[zz]!=null)
                    zzz +=", " + testsheet.atd[zz][0];
            if (zzz == '') return;
            var ys = textmsg[1937].split(/@/);
            myprompt(ys[2] + "?" + zzz.replace(/, /, ' (' + textmsg[456] + ': ') +')',null,"if(v)doreplace()");
        }*/
    }

    function movebarhere(anchor)
    {
        if (anchor == null)
            return;
        Drag.init(anchor);
        anchor.onDragStart = function (x, y)
        {
            var xy = findPositionnoScrolling(anchor);
            var wd = anchor.offsetWidth;
            document.body.appendChild(this);
            this.style.position = "absolute";
            this.style.left = xy[0] + 'px';
            this.style.top = xy[1] + 'px';
            this.style.width = (wd - 4) + 'px';
            // currenthoedgey = y;
        };
        anchor.onDragEnd = function (x, y)
        {
            var xy = findPositionnoScrolling(anchor);
            var i = parseInt(this.id.replace(/horbar/, ''));
            y = xy[1];
            var barassociate = ele(0, i);
            xy = findPositionnoScrolling(barassociate);
            y = y - xy[1];
            barassociate.style.height = y + 'px';
            var father = document.getElementById("barfather" + i);
            if (father != null)
            {
                father.appendChild(this);
                this.style.position = "";
                this.style.width = '98%';
            }
        }
    }
    function initmovebar()
    {
        movebarhere(document.getElementById("horbar6"));
    }
    function showcsvsource1()
    {
        showcsvsource(document.getElementById('csvsourcebut'));
    }
    function updateasg(but, i, j)
    {
        if (testsheet != null)
            testsheet.updateatd(but, i, j)
    }

    var holdpictures = new Array(numRows + 1);
    var showflag = true;
    function holdpicture(x)
    {
        for (var i = 0; i < numRows; i++)
        {
            if (x == false)
            {
                holdpictures[i] = mat[i][5];
                mat[i][5] = 'image/hint.gif';
            } else if (holdpictures[i] != null)
                mat[i][5] = holdpictures[i];
        }
    }


    function showphoto()
    {
        var count = parseInt(document.thisform.count.value) - 1;
        if (count < 0)
            return;
        if (showflag == false)
        {
            studentimage.src = "image/hint.gif";
        } 
        else
        {
            if (mat[count]!=null && mat[count][5] != null && mat[count][5].length > 4)
            {
                studentimage.src = mat[count][5];
            } 
            else
                studentimage.src = "image/hint.gif";

        }

    }

    function showswitch()
    {
        showflag = !showflag;
        holdpicture(showflag);
        showphoto();
    }

    var act = '';

    function normailizegrade(toblank)
    {
        for (var i = 0; i < numRows; i++)
        {
            if (!valuechanged[i])
                continue;

            var gradestr = '' + retrv(i, 4);
            if (gradestr != '' && isNaN(gradestr))
            {
                myprompt(textmsg[123]);
                goesto(i);
                return false;
            } else if (gradestr == '')
            {
                holdvalues[i + '_4'] = '-1';
                setv(i, 4, '-1');
            }
        }
        return true;
    }
    var noconfirmdel = true;
    var activesavingi = -1;
    var formattedtxt = '';
    function confirmformat(i)
    {
        var xx = "\n" + mat[i][6].value;//.replace(/[\.| |:|,|\t|\)]+/g, ' ');
        if (counter == i)
            xx = "\n" + ele(0, 6).value;
        var r = new RegExp(/[\r|\n][0-9]+[\.| |:|,|\t|\)]/);
        var k = 0, j = 0;
        var nn = null, zz, ww = "", w5 = '';
        var rg = new RegExp(/,[0-9]+,[0-9]+,[0-9]+,[\-|0-9]+$/);
        let expected = 1;
        while (true)
        {
            var m = r.exec(xx.substring(k));
            if (m == null)
            {
                if (expected==1)
                {
                    let solarr = xx.replace(/^[\s]+/,'').replace(/[\s]+$/,'').split(/[\s]*\n[\s]*/);
                    for (let nn=1;nn <= solarr.length; nn++)
                    {  
                        ww += "\n" + nn + "," + solarr[nn-1];
                        w5 += "\n" + nn + "," + solarr[nn-1] + ",0,5," + nn + ",-1";
                    }
                }
                else
                {
                    zz = xx.substring(k).replace(/^[ |\n|\r|\t]+/, '').replace(/[ |\n|\r|\t]+$/, '');
                    if (zz.indexOf('\n') >= 0 || zz.indexOf('\r') >= 0 || zz.indexOf(',') >= 0)
                       zz = "'" + zz.replace(rg, "''") + "'";
                    ww += "\n" + nn + "," + zz;
                    w5 += "\n" + nn + "," + zz + ",0,5," + nn + ",-1";
                }
                break;
            } else
            {
                j = m.index + k;
                if (nn != null)
                {
                    zz = xx.substring(k, j).replace(/^[ |\n|\r|\t]+/, '').replace(/[ |\n|\r|\t]+$/, '');
                    if (zz.indexOf('\n') >= 0 || zz.indexOf('\r') >= 0 || zz.indexOf(',') >= 0)
                        zz = "'" + zz.replace(rg, "''") + "'";

                    if (rg.test(zz))
                    {
                        w5 += "\n" + nn + "," + zz;
                        ww += "\n" + nn + "," + zz.replace(rg, '');
                    } else
                    {
                        w5 += "\n" + nn + "," + zz + ",0,5," + nn + ",-1";
                        ww += "\n" + nn + "," + zz;
                    }

                }
                nn = m.toString().replace(/[^0-9]/g, '');
                if (nn!=''+expected)
                {
                    myprompt("Unexpected number: " + nn);
                }
                expected = parseInt(nn) + 1;
                k = j + m.toString().length;
            }
        }
        formattedtxt = w5.substring(1);

        myprompt("<table  cellpadding=3 ><tr><td valign=top ><div class=outset3  style=\"padding:3px 3px 3px 3px;background-color:#c0b0b0\">" + (new CSVParse(ww.substring(1), "'", ",", "\r\n")).tohtml().replace(/<table border=1 style=.border-collapse:collapse. /i, '<table border=1 class=outset3 cellpadding=3 cellspacing=1 style=border:0px;background-color:white;border-collapse:collapse ')
                + "</div></td><td valign=top width=200 ><div class=outset3  style=\"padding:3px 3px 3px 3px;background-color:" + TBGCOLOR + "\">" + textmsg[1330] + "</div></td></tr></table>",
                null, "if(v)gosaveit(" + i + "); else resumenext()", textmsg[1331]);

        promptwin.style.width = '600px';
    }
    function resumenext()
    {
        eval(resumetodo);
    }

    function controlallquickchecks(ck)
    {
        for (var i = 0; i < numRows; i++)
        {
            var c = document.getElementById('quickcheck' + i);
            if (c != null)
                c.checked = ck.checked;
        }
    }
    function resetallquickscore(edit, evt)
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
        if (key == 13)
        {
            for (var i = 0; i < numRows; i++)
            {
                var quickscore = document.getElementById('quickscore' + i);
                if (quickscore != null)
                {
                    quickscore.value = edit.value;
                }
            }
        } else if ((key < 48 || key > 57) && key != 8)
            return false;
        return true;
    }

    /*function quick1()
     {
     var words = null,ans = null; 
     if (encoding=='gb2312') 
     {
     ans = mat[counter][16].toLowerCase().split(/|/);
     }
     else
     {
     ans = mat[counter][16].toLowerCase().split(/[ ]+/); 
     }
     for (var j=0; j <= allis.length; j++)
     {
     var i = allis[j];
     if (mat[i][6] == '' || mat[i][16] == '')
     {
     continue;
     }
     
     if (encoding=='gb2312') 
     {
     words = mat[i][6].toLowerCase().split(/|/);
     }
     else
     {
     words = mat[i][6].toLowerCase().split(/[ ]+/);
     }
     var n = 0;
     for (var j=0; j < words.length; j++)
     {
     if (mat[i][16].indexOf(words[j])>=0) n++;
     }
     for (var j=0; j < ans.length; j++)
     {
     if (mat[i][6].indexOf(ans[j])>=0) n++;
     }
     var y = Math.round(n/(words.length + ans.length)*parseInt(mat[i][18])*10);
     document.getElementById('quickscore' + i).value = (''+ y).replace(/(.)$/,".$1");
     
     }
     }
     */
    function quickgrade1(btn)
    {
        allis = new Array();
        //0)Course,  1) AssignTest, 2) StudentId, 3) SubmitAt, 4) Score,  5)PhotoUrl,
//6)Content, 7) Comment, 8) due, 9) Format, 10) StudName, 11) Attachment
//12. atype, 13 assess
//14, AsAssess,15, question, 16, Answer, 17Attachat,18 Scale, 19 Weight, 20 Sessions
//21 Aformat
        var curass = mat[counter][1];
        var tt = "<tr style=\"background:" + beheading + "\"><td width=" + (font_size + 3) + " align=center><input type=checkbox onclick=controlallquickchecks(this) checked></td><td><nobr>" + textmsg[542] + "</nobr></td>";
        var i = 0;
        var allkeyfieldarr = [2, 10, 3, 6, 11, 4];
        for (ll = 0; ll < allkeyfieldarr.length - 1; ll++)
            tt += "<td align=left><nobr>" + labels[allkeyfieldarr[ll]] + "</nobr></td>";
        tt += '<td align=right  ><nobr>' + labels[allkeyfieldarr[ll]] + '<input id=quickscore  class=right size=3 value="' + (mat[counter][18]) + '"  onkeypress=resetallquickscore(this,event)></td>';
        tt += "</tr>";
        for (i = 0; i < numRows; i++)
        {
            if (mat[i][12] != '0' && mat[i][12] != '2' || mat[i][1] != curass || mat[i][4] == '-2' || mat[i][4] == '-3')
                continue;
            tt += "<tr  bgcolor=" + DBGCOLOR + " ><td width=" + (font_size + 3) + " align=center><input type=checkbox id=quickcheck" + i + "   checked></td><td align=right><a href=javascript:populate(" + i + ")>" + (i + 1) + "</a></td>";
            var jj = 0, ll = 0;
            allis[allis.length] = i;
            for (ll = 0; ll < allkeyfieldarr.length; ll++)
            {
                var vv = mat[i][allkeyfieldarr[ll]];
                var ct = ctype[allkeyfieldarr[ll]];
                if (ll == allkeyfieldarr.length - 1)
                {
                    vv = '<input id=quickscore' + i + ' class=right size=3 value=' + ((mat[i][4] != '' && mat[i][4] != '-1') ? mat[i][4] : mat[i][18]) + '>';
                } else if (allkeyfieldarr[ll] == 11)
                {
                    vv = genAttach(vv);
                } else if (allkeyfieldarr[ll] == 3)
                    vv = timestr(vv);
                else if (ct == 'A' || ct == 'a')
                {
                    vv = "";
                    for (var k = 0; k < mat[i][allkeyfieldarr[ll]].length && k < 10; k++)
                        vv += mat[i][allkeyfieldarr[ll]].charAt(k);
                    vv += "...(" + mat[i][allkeyfieldarr[ll]].length + ")";
                }
                tt += "<td " + ((allkeyfieldarr.length != ll + 1 ? "align=left" : "align=right")) + "><nobr>" + vv + "</nobr></td>";
            }
            tt += "</tr>";
        }

        var tmp = "<nobr>" + textmsg[1789] + "</nobr>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href=javascript:quick1()>" + textmsg[923] + "</a>";
        tmp += "<br><div style=background-color:" + DBGCOLOR + "><table width=100% id=delconfirmtbl bgcolor=DBGCOLOR class=outset1 align=center border=0>"
//<tr  background=\"image/bheading.gif\"><nobr>" + textmsg[542] + "</nobr></td><td colspan=" + allkeyfieldarr.length + "><nobr>" + textmsg[908] + "</nobr></td><td>" + textmsg[543] + "</td></tr>" 
                + tt + "</table></div>";
        myprompt(tmp, null, "if(v)quickgradeselected();else nogradeselected();", textmsg[1788] + ":" + mat[counter][1]);
        //setRoundedWidth(promptwin, 600);
        promptwin.style.left = '110px';
        if (promptwin.offsetHeight < 500)
        {
            var xy = findPositionnoScrolling(btn);
            xy[1] = xy[1] - promptwin.offsetHeight / 2;
            if (xy[1] < 100)
                xy[1] = 100;
            promptwin.style.top = xy[1] + 'px';
        } else
        {
            promptwin.style.top = '150px';
        }

        var btn = promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[2].cells[0].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('input')[0];
        btn.onclick = quickgradeselected;
        var btn1 = promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[2].cells[0].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('input')[1];
        btn1.onclick = notgradeselected;
    }

    function quickgradeselected()
    {
        for (var i = 0; i < numRows; i++)
        {
            if (mat[i][12] != '0' || mat[i][1] != mat[counter][1])
                continue;
            var quickscore = document.getElementById('quickscore' + i);
            if (quickscore == null)
                continue;
            var quickcheck = document.getElementById('quickcheck' + i);
            if (quickcheck == null || quickcheck.checked == false)
                continue;
            var defaultgrade = quickscore.value.trim();
            if (defaultgrade == '' || isNaN(defaultgrade))
                defaultgrade = "-1";
            if ((mat[i][4] == "-1" || mat[i][4] == "") && defaultgrade != '-1' || mat[i][4] != "" && mat[i][4] != "-1" && mat[i][4] != "-2" && defaultgrade == '-1')
            {
                setv(i, 4, defaultgrade);
                valuechanged[i] = true;
            }
        }
        closeprompt();
        setaction(1);

        if (f1.Score.value != '' && defaultgrade == '-1')
            f1.Score.value = '';
        else if (f1.Score.value == '' && defaultgrade != '-1')
            f1.Score.value = defaultgrade;
    }

    function notgradeselected()
    {
        closeprompt();
    }

    function saveupdate(whichact, btn, unsubmitflag)
    {
        if (numRows == 0 && whichact == 'delete')
        {
            return;
        }
        if ( whichact != 'delete' && (//(rdapname != 'gradingsub' && (mat[counter][12] == '1' || mat[counter][12] == '3' || mat[counter][12] == '4')) ||
                (rdapname == 'gradingsub' && convertedcsv[counter] == null && (mat[counter][12] == '1' || mat[counter][12] == '3' || mat[counter][12] == '4') && (ele(counter, 6).value != copypaste || ele(counter, 11).value != '' || '' + holdvalues[counter + '_6'] == '1'))))
        {
            istest = true;
            var testsheet1 = new TestSheet(counter, retrv(counter, 6), retrv(counter, 14), retrv(counter, 13), retrv(counter, 9), istest, mat[counter][15], mat[counter][16], mat[counter][17], mat[counter][11], 4, 13);
            doattach(retrv(counter, 11));
            if (testsheet1.goodformat == false)
            {
                confirmformat(counter);
                resumetodo = "saveupdate('correct')";
                return;
            }
        }

        
        if (numRows > 0)
        {
            counter = parseInt(document.thisform.count.value) - 1;
        } 
        else
        {
            whichact = 'submit';
        }

        if (whichact == 'submit' || whichact == 'grade' || whichact == 'correct')
        {
            
            if (normailizegrade(false) == false)
                return;
        }
        if (whichact == 'delete')
        {
            allkeyfields = "1,10";
            setaction(3);
            let tbl = document.getElementById('delconfirmtbl');
            tbl.rows[0].insertCell(3);
            cell = tbl.rows[0].cells[3];
            cell.style.float = 'right';
            cell.style.whiteSpace = 'nowrap';
            cell.innerHTML = labels[4];
            let sum = 0, np=0;
            for (let j=1; j < tbl.rows.length; j++)
            {
                tbl.rows[j].insertCell(4);
                cell = tbl.rows[j].cells[4];
                cell.style.float = 'right';
                let sc = parseFloat(retrv(j-1,4));
                if (sc>=0)
                {
                    sum += sc;
                    np++;
                }
                if (sc>=0)
                   cell.innerHTML = sc.toFixed(1);
                else
                   cell.innerHTML = textmsg[397];
            }
             
            if (np>0)
            {
            let r = tbl.insertRow(-1);
            cell = r.insertCell(-1);
            cell.style.backgroundColor = TBGCOLOR;
            cell.colSpan = 3;
            cell = r.insertCell(-1);
            cell.style.backgroundColor = TBGCOLOR;
            cell.align = 'left';
            cell.innerHTML = textmsg[648];
            cell = r.insertCell(-1);
            cell.align = 'right';
            cell.style.backgroundColor = TBGCOLOR;
            cell.innerHTML = (sum/np).toFixed(1);
            cell = r.insertCell(-1);
            cell.style.backgroundColor = TBGCOLOR; 
            }
            var xy = findPositionnoScrolling(btn);
            xy[1] = xy[1] - promptwin.offsetHeight / 2;
            if (xy[1] < 100)
                xy[1] = 100;
            promptwin.style.top = xy[1] + 'px';
            var btn = promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[2].cells[0].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('input')[0];

            if (unsubmitflag != null)
            {
                var txt = promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[1].cells[0].getElementsByTagName('div')[0];
                txt.innerHTML = txt.innerHTML.replace(/<nobr>[^<]*/, textmsg[1343]);
                btn.onclick = function ()
                {
                    for (var i = 0; i < numRows; i++)
                    {
                        forerase(i);
                        if (markers[i])
                        {
                            if (mat[i][12] == '0' || mat[i][12] == '2')
                            {
                                holdvalues[i + "_" + 4] = '-2';
                                if (counter == i)
                                    setv(counter, 4, '-2');
                            } else
                            {
                                holdvalues[i + "_" + 4] = '-2';
                                if (counter == i)
                                    setv(counter, 4, '-2');
                            }
                            valuechanged[i] == true;

                        }
                    }
                    takeuserinputyn(true);
                }
            } else
            {
                btn.onclick = function ()
                {
                    for (var i = 0; i < numRows; i++)
                    {
                        forerase(i);
                        if (markers[i])
                        {
                            holdvalues[i + "_" + 4] = '-3';
                            if (counter == i)
                                setv(counter, 4, '-3');
                            valuechanged[i] == true;
                        }
                    }
                    takeuserinputyn(true);
                }
            }
        } else
        {
           
            var tbpv = parseFloat(retrv(counter, 4));
            if ('' + tbpv == 'NaN')
            {
                setv(counter, 4, '-1');
                holdvalues[counter + '_4'] = '-1';
            }
            if (rdapname == 'gradingsub')
            {
                for (var i = 0; i < numRows; i++)
                {
                    if ((holdvalues[i + '_6'] == null || mat[i][6] == copypaste) && holdvalues[i + '_11'] == null)
                    {
                        valuechanged[i] = false;
                    }
                }
            }
             if (testsheet != null)
            {
                if (mat[counter][9] == '6')
                    tojson();
                //makeback();
                if ( whichact == 'correct' && testsheet!=null)
                   testsheet.propagate();
                else{
                   makeback();
                   setaction(1); 
               }
            } 
            else
                setaction(1);
        }

    }
    function nextstep(s)
    {
        if (numRows == 1)
        {
            gradeitnow();
            return;
        }
        var as = textmsg[1617].split(/@/);
        s += "<br><input name=donow type=radio value=0 onclick=\"navigaterall(1)\" >" + as[0] + "<br>"
                + "<input name=donow type=radio value=1 onclick=\"gradeitnow()\" >" + as[1];
        myprompt(s);
    }
    function gradeitnow()
    {
        parent.frames[0].setv(0, 4, retrv(counter, 2));
        parent.frames[0].setv(0, 6, '');
        parent.frames[0].dosearch();
    }

    var onsaved1 = null;

    function gosaveit(i)
    {
        setv(i, 4, '-1');
        setv(i, 6, formattedtxt);
        if (rdapname == 'gradingsub')
            rowInvolves = "i";
        else
            rowInvolves = "u";
        rowInvolves += i;
        onsaved1 = onsaved;
        onsaved = "f1.action='" + f1.action + "';valuechanged[" + i + "]=false;onsaved='" + onsaved1.replace(rg, "\\'") + "';eval(resumetodo);";
        formnewaction(f1, 'gradeQuiz.jsp');
        f1.target = "w" + tstmp;
        convertedcsv[i] = true;

        visual(f1);
        f1.submit();

    }
    function updatesheet(str)
    {
        mat[counter][13] = str;
        setv(counter, 13, str);
    }
    var defaultgrade = "-2";

//0)Course,  1) AssignTest, 2) StudentId, 3) SubmitAt, 4) Score,  5)PhotoUrl,
//6)Content, 7) Comment, 8) due, 9) Format, 10) StudName, 11) Attachment
//12. atype, 13 assess
    function openquizedit(n)
    {
        if (mat[n][12] != '4')
        {
            var assg = f1.elements[lookup[1]].value;
            var nms = ['course', 'coursetitle', 'sessionname', 'AssignTest', 'securitytoken', 'orgnum', 'semester', 'makescript', 'extraline', 'rdap'];
            var vls = [mat[n][0], title + ": " + assg, mat[n][20], mat[n][1], '', orgnum, semester, 'makeass', '0', 'assignbyname'];
            postopen('DataForm', nms, vls, "_blank");
        } else
        {

            var nms = ['course', 'coursetitle', 'sessionname', 'assignname', 'securitytoken', 'orgnum', 'semester', 'rdap', 'mode', 'subdb'];
            var vls = [mat[n][0], title, mat[n][20], mat[n][1], '', orgnum, semester, "allembedquiz", "make", subdb];
            postopen('embedquiz.jsp', nms, vls, "_blank");
        }

    }
    function showanswer()
    {
        openquizedit(counter);
    }

    function commit()
    {
        if (valuechanged[counter])
            myprompt(textmsg[768], null, "if(v)saveupdate('correct')");
    }

    function caption()
    {
        if (offline)
            return textmsg[130];
        return textmsg[131];
    }

    function fresh()
    {
        myprompt(textmsg[132]);
    }

    function picktools()
    {
        fsnd.rdap.disabled = false;
        fsnd.rdap.value = 'serviceforgrade';
        fsnd.exbut.disabled = false;
        fsnd.exbut.value = 'cp';
        fsnd.wording.disabled = false;
        fsnd.wording.value = '';
        fsnd.course.value = (defaultRecord[0]);
        webservice(null, "DataTable", -1);
        fsnd.rdap.disabled = true;
        fsnd.exbut.disabled = true;
        fsnd.wording.disabled = true;
    }

    function jumpto(tbox, event)
    {
        var code = 49;
        if (!event)
            var event = window.event;
        if (event.keyCode)
            code = event.keyCode;
        else if (event.which)
            code = event.which;

        if (code == 13)
        {
            goesto(parseInt(tbox.value) - 1);
            return true;
        } else if ((code < 48 || code > 57) && code != 8)
            return false;
        return true;
    }



    function unigrade(btn)
    {
        myprompt(textmsg[133], "10", "gradeall(v)");
        setRoundedWidth(promptwin, 400);
        var xy = findPositionnoScrolling(btn);
        xy[1] = xy[1] - promptwin.offsetHeight / 2;
        if (xy[1] < 100)
            xy[1] = 100;
        promptwin.style.top = xy[1] + 'px';
    }
    function gradeall(dg)
    {

        if (dg != '' && (isNaN(dg) || parseFloat(dg) < 0))
        {
            myprompt(dg + " " + textmsg[134] + "<br>" + textmsg[133], "10", "gradeall(v)");
            setRoundedWidth(promptwin, 400);
            return;
        }

        if (dg != '')
            defaultgrade = dg;
        else
            defaultgrade = "-1";

        for (var i = 0; i < numRows; i++)
        {
            if ((mat[i][4] == "-1" || mat[i][4] == "") && defaultgrade != '-1' || mat[i][4] != "" && mat[i][4] != "-1" && mat[i][4] != "-2" && defaultgrade == '-1')
            {
                setv(i, 4, defaultgrade);
                valuechanged[i] = true;
            }
        }
        setaction(1);

        if (f1.Score.value != '' && defaultgrade == '-1')
            f1.Score.value = '';
        else if (f1.Score.value == '' && defaultgrade != '-1')
            f1.Score.value = defaultgrade;

    }

    customize = function ()
    {
        myprompt('<iframe style=border:0px width=' + (340 * font_size / 15) + ' height=' + (360 * font_size / 15) + ' src="DataForm?rdap=fontsize&exbut=p&subdb=&onsaved=0" />', null, null, labels[16]);
    }




    function goesto(n)
    {
        if (counter == n)
            return;

        if (numRows == 0 && n == 0)
        {
            removeassdiv();
            removefreediv();
            removeimagediv();
        } else
        {
            LaTexHTML.reset();
            needcheck = false;
            populate(n);
            showphoto();
        }
        if (rdapname == 'gradingsub' && (mat[n][6] == copypaste || holdvalues[n + '_6'] == null || mat[n][6] == '') && retrv(n, 11) == '')
        {
            valuechanged[n] = false;
        }
    }

    function aftersaved(z)
    {
        var xs = z.split(",");
        if (rowInvolves == null || rowInvolves == '')
            return 0;

        var ys = rowInvolves.replace(/,$/, '').split(",");
        var tt = "";
        for (var i = 0; i < xs.length; i++)
        {
            if (xs[i] != "1")
            {
                if (act != 'submit')
                    tt += "<a href=javascript:goesto(" + ys[i] + ")>(" + mat[ys[i]][10] + ","
                            + mat[ys[i]][0] + "," + mat[ys[i]][1] + ")</a><br>";
                else
                    tt += textmsg[800];
            }
        }

        if (tt != '')
        {
            myprompt(tt);
            return 3;
        }
        return 1;
    }
    /*
     function existwarning(nn)
     {
     if (nn ==1)
     {
     var cell = nav1.document.getElementsByTagName("table")[0].rows[0].cells[0].getElementsByTagName("table")[1].rows[0].cells[0].getElementsByTagName("table")[0].rows[0].cells[0];
     cell.innerHTML =
     textmsg[800]
     +"<br><br><center><input type=button value=OK onclick=\"realClose()\">";
     nav1.resizeTo(300,280);
     nav1.onunload = changeback;
     }
     else nav1.close();
     }
     */


    var convertedcsv = [];
    var resumetodo = "";
    function navigaterall(j)
    {
        if (rdapname == 'gradingsub' && convertedcsv[counter] == null && (mat[counter][12] == '1' || mat[counter][12] == '3' || mat[counter][12] == '4') && ele(0, 6).value != mat[counter][6])
        {

            confirmformat(counter);
            resumetodo = 'navigaterall(' + j + ')';
            return;
        } else
        {
            if (document.getElementById('csvsourcebut') != null)
                document.getElementById('csvsourcebut').innerHTML = document.getElementById('csvsourcebut').innerHTML.replace(/HTM/, "CSV");
            makeback();
            if (domandatory(counter) == false)
                return;
            var count = parseInt(f1.count.value) - 1;
            if (j != 0)
                count = counter + j;
            if (count == numRows)
                count = 0;
            else if (count == -1)
                count = numRows - 1;
            goesto(count);
        }
    }



    function fieldline(str)
    {
        return "<table cellspacing=1 cellpadding=3 width=100% ><tr><td style=\"background:" + gradientbg.replace(/\(/, '(to right,') + "\"><font color=#DDCC11><b><NOBR>" + str + "</NOBR></b></font></td></tr></table>";
    }
      
    var printingw;
    function review(fm)
    {
        if (numRows == 0)
        {
            webservice(ele(0, 6), 'preview.jsp', 2);
            return;
        }
         
        picarray = new Array();
        printingw = window.open("gradeprint.jsp", "_blank");
    }
    function getpicarray() {
        return picarray;
    }
    function hasmore(i) {
        return i < numRows;
    }
    var needspic = false;
    function reviewstr(i)
    {  // if (i == 0) str = "<table border=0 cellpadding=3 cellspacing=1 style=\"margin:0px 0px 0px 0px\" align=center>";  
        //0)Course,  1) AssignTest, 2) StudentId, 3) SubmitAt, 4) Score,  5)PhotoUrl,
        //6)Content, 7) Comment, 8) due, 9) Format, 10) StudName, 11) Attachment
        //12. atype, 13 assess, AsAssess question answer
        //for (var i = 0; i < numRows; i++)
        // str += ('<tr><td><table class=outset cellspacing=0 cellpadding=0 width=100%><tbody><tr><td>
        var str = "<table width=100% cellspacing=1 cellpadding=3 >";
        var gradestr = mat[i][4];
        if (gradestr == "-1")
            gradestr = "&nbsp;";
        else if (gradestr == "-2")
            gradestr = textmsg[397];
        var timestate1 = timestr4(i);
        var duestate = '';
        if (timestate1.charAt(0) == '-')
            timestate1 = "(" + timestate1.substring(1) + " " + textmsg[141] + ")";
        else if (timestate1.charAt(0) == '+')
        {
            duestate = "(" + timestate1.substring(1) + " " + textmsg[140] + ")";
            timestate1 = "";
        }
        duestate = '';
        str += ('<tr><td bgcolor=' + TBGCOLOR + '><table  cellspacing=1 cellpadding=3  WIDTH=100% height=50 align=center><tr ALIGN=CENTER><td style="background:' + gradientbg.replace(/\(/, '(to right,') + '" ><div class=forcurve1>' +(i==0?'<img src=image/hint.gif width=20 onclick=loadimgtoo() style=float:left>':'') + '<font color=#DDCC11 size=+3>'
                + /*mat[i][0] + ' ' +*/ title
                + "</font></div></td></tr></table></td></tr>\n"
                + '<tr><td  bgcolor=' + TBGCOLOR + '><table id=title' + i + ' border=0  cellpadding=3 cellspacing=1    align=left> <tr><td >'
                + fieldline(textmsg[1022]) + '</nobr></td><td ><nobr><b>' + mat[i][1] + '</b></td><td ><nobr>'
                + fieldline(textmsg[142]) + '</nobr></td><td ><nobr>' + timestr2(mat[i][8]) + duestate + '</nobr></td><td ><nobr>'
                + fieldline(labels[18]) + '</nobr></td><td ><nobr>' + (mat[i][18]) + '</nobr></td><td  ><nobr>'
                + fieldline(textmsg[787]) + '</nobr></td><td >' + genAttach(mat[i][11]) + '</td></tr><tr><td  ><nobr>'
                + fieldline(textmsg[154]) + '</nobr></td><td ><b>' + mat[i][2] + "</b> " + mat[i][10] + '</td><td><nobr>'
                + fieldline(textmsg[1023]) + '</nobr></td><td><nobr>' + timestr2(mat[i][3]) + timestate1 + '</nobr></td><td ><nobr>'
                + fieldline(labels[4]) + '</nobr></td><td ><nobr>' + (mat[i][4]) + '</nobr></td><td><nobr>'
                + fieldline(textmsg[143]) + '</nobr></td><td ><nobr>' + mat[i][7] + '</nobr></td></tr>'
                //+ '<tr><td valign=top><nobr>'
                //+ fieldline(textmsg[144]) + '</nobr></td><td valign=top   colspan=7>' + ((mat[i][12] == '0' || mat[i][12] == '2') ? mat[i][16] : '') + '</td></tr>'
                + '</table>');

        var x = mat[i][6];
        if (i == counter)
            x = retrv(i, 6);

        if (mat[i][12] == '0' || mat[i][12] == '2')
        {
            if (mat[i][9] == "" || mat[i][9] == '0' || mat[i][9].toLowerCase() == 'plaintext')
            {

                x = x.replace(/>/g, "&gt;");
                x = x.replace(/</g, "&lt;");
                x = x.replace(/\/\/\/\/([^\n]+)/g, "<font color=red>//$1</font>");
                x = x.replace(/\n/g, "<br>");
                x = ">" + x;
            } else if (mat[i][9] == '2')
            {
                x = checkh(x, true);
                x = x.replace(/\/\/\/\/([^\n]+)/g, "<font color=red>//$1</font><br>");
                x = ">" + x.replace(/<scrip/ig, "&lt;scrip").replace(/<\/scrip/ig, "&lt;/scrip");

            } else
            {
                x = x.replace(/\/\/\/\/([^\n]+)/g, "<font color=red>//$1</font><br>");
                x = ">" + x.replace(/<scrip/ig, "&lt;scrip").replace(/<\/scrip/ig, "&lt;/scrip");
            }

        } else
        {
            //n,content, assess, sheet, fmt, istest,question, answer, scorebox, subassessbox)
            // retrv(counter,6), retrv(counter,14), retrv(counter,13)
            var s17 = ResizeUploaded.unzip(mat[i][17]);
            var s11 = ResizeUploaded.unzip(mat[i][11]);

            var ts = new TestSheet(i, x, mat[i][14], mat[i][13], mat[i][21], true, mat[i][15], mat[i][16], s17, s11, 4, 13, true);
            //      n,content, assess, sheet, fmt, istest,question, answer, attachat, attachsub, scorebox, subassessbox
            // doattach(mat[i][11]);
            x = ts.print(mat[i][2].substring(4));
        }
        str += (x);

        str += ('</td></tr></table>');
        str += ('</td></tr><tr><td>');
        str += genattpic(mat[i][11]);
        str += ('</td></tr></table>');

        return str;

    }


    function makebtn(cl, wt, vl)
    {
        return "<tr><td valign=top><input type=button class=" + cl + " style=color:white;font-weight:700;width:" + leftbutwidth + "  value=\"" + vl + "\" > </td><td>";
    }
    function makebtn1(cl, wt, vl)
    {
        return "<input type=button class=" + cl + " style=color:white;font-weight:700;width:" + leftbutwidth + "  value=\"" + vl + "\" > ";
    }
    helpstr = helpstr.replace(/style=/g, "style=width:" + leftbutwidth + "px;");
    var helpstr00 = helpstr;
    function completehelpstr(n)
    {
        helpstr = helpstr00;
        helpstr += "<tr><td colspan=2><b><font color=purple>" + textmsg[161] + "</font></b><br>" + textmsg[162] + "</td></tr>";
        if (mat[n][12] == '0' || mat[n][12] == '2')
            helpstr += "<tr><td colspan=2><b><font color=purple>" + textmsg[163] + "</font></b><br>" + textmsg[164] + "</td></tr>";
        helpstr += "<tr><td colspan=2><b><font color=purple>" + textmsg[165] + "</font></b><br>" + textmsg[166] + "</td></tr>";
        helpstr += "<tr><td colspan=2><b><font color=purple>" + textmsg[167] + "</font></b><br>" + textmsg[168] + "</td></tr>";
        helpstr += "<tr><td colspan=2><b><font color=purple>" + textmsg[180].replace(/:.*/, '') + "</font></b><br>" + textmsg[180].replace(/[^:]+:/, '') + "</td></tr>";

    }



    function timestr4(n)
    {
        var str = "";
        var tt = parseInt(mat[n][8]) - parseInt(mat[n][3]);
        if (tt <= -60)
        {
            tt = -tt;
            str = "-";
        } else if (timenow < parseInt(mat[n][8]))
        {
            tt = parseInt(mat[n][8]) - timenow;
            str = "+";
        } else
            return " ";

        var fen = (tt - tt % 60) / 60;
        var yufen = fen % 60;
        var shi = (fen - yufen) / 60;
        if (shi != 0)
            str += shi + textmsg[393];
        if (yufen != 0)
            str += yufen + textmsg[394];

        return str;
    }




    UT = function ()
    {
        if (cc == 4 && mat[counter][4] == '-2')
            myprompt(textmsg[833]);
        if (cc == 4)
        {
            var y = parseFloat(retrv(counter, 4));
            if ('' + y == 'NaN' || y > parseFloat(mat[counter][18]))
            {
                setv(counter, c, x);
                if ('' + y == 'NaN')
                    myprompt(v + ' NaN');
                else
                    myprompt(labels[4] + " > " + labels[18]);
                ele(counter, 4).focus();
            }
        }
    }

    holdpicture(true);

     
    var copypaste = '';
    function lookarea()
    {
        if (f1 != null && typeof (f1.elements) != 'undefined')
        {
            var ff = f1.elements;
            var i = 0;
            for (; i < ff.length; i++)
            {
                if (ff[i].name.toLowerCase() != 'content' || ff[i].tagName.toUpperCase() != 'TEXTAREA')
                    break;
            }
            lookup[6] = i;
        }
        if (numRows > 0)
        {
            valuechanged[0] = false;
            holdvalues['0_6'] = null;
            if (rdapname == 'gradingsub')
            {
                copypaste = mat[0][6];
            }
        }
    }


    function whitecolor()
    {

        if (numRows < 1)
            return;
        ele(0, 4).style.color = "red";
        ele(0, 4).style.width = Math.round(font_size * 1.8) + "px";

    }
    resizebut(document.form1, font_size, '1');
    window.onbeforeunload = null;

    onclose = "setaction(1);";
    onbegin = "whitecolor();resizeCont();resizebut(f1);"; //if(numRows==0) {setv(0,0,defaultRecord[0]);x=parent.frames[0].retrv(0,2);if (x!='')setv(0,1,x);} valuechanged[0]=false;";
    onsaved = " ret=aftersaved(z);" + onsaved + ";remind1();doaftersave();TestSheet.did={}";

    if (typeof (ondeleted) == 'undefined')
        ondeleted = "ret=aftersaved(z);goesto(counter);";
    else
        ondeleted += "ret=aftersaved(z);goesto(counter);";

    function showexcept()
    {
        var docloc = document.location.toString();
        if (numRows == 0 && docloc.indexOf("gradingsub") >= 0)
        {
            myprompt(textmsg[890] + ".");
        } else if (numRows == 0 && docloc.indexOf("grading&") >= 0)
        {
            myprompt(textmsg[891] + ".");
        }

    }



    var currenthoedgey = 0;
    function recordpos(y)
    {
        currenthoedgey = y;
    }
    function reposition(y)
    {
        y -= currenthoedgey;
        var h = thecurrenttxtarea.offsetHeight + y;
        thecurrenttxtarea.style.height = h + 'px';
    }

    if (initialhintneed(2))
    {
        if (promptwin != null)
            var ugentmsg = initialhint(2);
    } else
    {
        setTimeout(showexcept, 1000);
    }

    var resizetxt = function (td, dx, dy)
    {
        window.resize = null;
        document.form1.content.style.height = (dy + document.form1.content.offsetHeight) + 'px';
    }


    function changecolor40()
    {
        if (ele(0, 4).value.indexOf('-1') >= 0 || ele(0, 4).value.indexOf('-2') >= 0)
        {
            x = ele(0, 4).value;
            ele(0, 4).style.color = 'red';
            ele(0, 4).value = '';
        }
    }
    function changecolor41()
    {
        if (ele(0, 4).value.replace(/ /g, '') == '')
        {
            ele(0, 4).style.color = ele(0, 4).style.backgroundColor;
            ele(0, 4).value = '-1';
        }
    }
//0)Course,  1) AssignTest, 2) StudentId, 3) SubmitAt, 4) Score,  5)PhotoUrl,
//6)Content, 7) Comment, 8) due, 9) Format, 10) StudName, 11) Attachment
//12. atype, 13 assess
    function allcomplains()
    {
        var tt = "";
        var allkeyfieldarr = [10, 1];
        var dued = false;
        for (var i = 0; i < numRows; i++)
        {
            if (mat[i][7].indexOf("#") == 0)
            {
                tt += "<tr   >";
                var jj = 0, ll = 0;
                for (ll = 0; ll < allkeyfieldarr.length; ll++)
                {
                    var vv = mat[i][allkeyfieldarr[ll]];
                    var ct = ctype[allkeyfieldarr[ll]];
                    if (ct == 'M' || ct == 'm')
                        vv = timestr(vv);
                    tt += "<td><a href=javascript:parent.frames[1].populate(" + i + ")><nobr>" + vv + "</nobr></a></td>";
                }
                tt += "<td align=left><a href=javascript:parent.frames[1].populate(" + i + ")><nobr>  >></nobr></a></td></tr>";
                var xx = mat[i][7].substring(1);
                if (xx.length > 30)
                    xx = xx.substring(0, 30) + '...';
                tt += "<tr  ><td colspan=3><a href=javascript:parent.frames[1].populate(" + i + ")>" + xx + "</a></td></tr><tr height=1px><td  colspan=5></td></tr>";
            }
            if (dued == false && mat[i][4] == '-2')
            {
                dued = true;
            }
        }
        if (dued)
        {
            switchbut('o');
            if (promptwin == null)
                myprompt(textmsg[1317], null, "if(v)gradealli()");
        }
        if (tt != '')
        {
            parent.frames[0].myprompt("<table width=200px border=0 style=border-collapse:collapse;border-color:#808080;background-color:" + IBGCOLOR + ">" + tt + "</table>", null, null, textmsg[400]);
            parent.frames[0].promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[1].cells[0].getElementsByTagName('div')[0].style.backgroundColor = IBGCOLOR;
            parent.frames[0].promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].bgcolor = IBGCOLOR;
            parent.frames[0].promptwin.getElementsByTagName('table')[0].rows[1].cells[2].getElementsByTagName('div')[0].style.height = '70px';
            parent.frames[0].setRoundedWidth(parent.frames[0].promptwin, parent.frames[0].thispagewidth() - 10);
        }
    }

    function notdelsubmit()
    {
        var t = retrv(counter, 11).replace(/,$/, '');
        var tm = parseInt(mat[counter][3]);
        var p = (new CSVParse(t, '\'', '@', ',')).nextMatrix(true);
        var pp = ',';
        for (var i = 0; i < p.length; i++)
        {
            if (p[i][0].replace(/[0-9]/g, '') == '' && p[i][2].replace(/[0-9]/g, '') == '___')
            {
                if (pp.indexOf("," + p[i][1] + ",") >= 0)
                    pp += textmsg[1303] + p[i][0] + ",";
            } else
            {
                if (parseInt(p[i][1]) < tm)
                    pp += p[i][0] + ",";
            }
        }

        var tbl = document.getElementById('attachaction');
        if (tbl != null)
            for (i = 0; i < tbl.rows.length; i++)
            {
                var x = tbl.rows[i].cells[0].innerHTML.replace(/<[^>]+>/g, '').replace(/^[ ]*/g, '').replace(/[ ]*$/g, '');

                if (pp.indexOf("," + x + ",") < 0)
                    continue;
                for (var j = 0; j < tbl.rows[i].cells.length; j++)
                    if (tbl.rows[i].cells[j].innerHTML.indexOf(textmsg[69]) >= 0)
                    {
                        tbl.rows[i].deleteCell(j);
                        break;
                    }
            }
    }
    var oldResizeUploadedattachman = ResizeUploaded.attachman;
    ResizeUploaded.attachman = function (t)
    {
        oldResizeUploadedattachman(t);
        notdelsubmit();
    }

    function ungradedass()
    {
        if (parent.frames != null && parent.frames.length == 2)
        {
            var ass = (parent.frames[0].document.form1.Assigntest.selectedIndex == 0);
            var sts = (parent.frames[0].document.form1.Status.selectedIndex == 2);
            if (sts && ass)
            {
                var x = ",";
                for (var i = 0; i < numRows; i++)
                    if (x.indexOf("," + mat[i][1] + ",") < 0)
                        x += mat[i][1] + ",";
                parent.frames[0].setisallungraded(true);
                var y = parent.frames[0].document.form1.Assigntest;
                for (var k = 1; k < y.options.length; k++)
                {
                    if (x.indexOf("," + y.options[k].value + ",") < 0)
                    {
                        y.options[k].text = '';
                    }
                }
            } else
            {
                parent.frames[0].setisallungraded(false);
                var y = parent.frames[0].document.form1.Assigntest;
                for (var k = 1; k < y.options.length; k++)
                {
                    y.options[k].text = y.options[k].value;
                }
            }
        }
    }
    var allass = ",";
    function filter()
    {
        if (parent == window)
            return;

        allass = ",";
        for (var j = 0; j < numRows; j++)
        {
            if (allass.indexOf(',' + mat[j][1] + ',') < 0)
                allass += mat[j][1] + ",";
        }
        allass = allass.replace(/^,/, '').replace(/,$/, '');
        if (allass.indexOf(',') > 0)
            rewrite('<table width=100% style=background-color:transparent><tr  style=background-color:transparent><td align=left  style=background-color:transparent;color:blue onclick="javascript:showanswer()">' + mat[0][1] + '</td><td width=10 style=color:blue;background-color:transparent;font-size:20px;padding:0px  onclick=selass(this)>&#9662;</td></tr></table>', 0, 1);

    }

    onbegin += ";resize=null;allcomplains();filter();";

    cellonfocus += "if(cc==4)changecolor40()";
    cellonblur += "if(cc==4)changecolor41()";
    onsave = "for(i=0;i<numRows;i++){if (rdapname='gradingsub' && (mat[i][6]==''||mat[i][6]==defaultRecord[6])) valuechanged[i]=false;if (valuechanged[i] && holdvalues[i+'_7']==null && mat[i][7].replace(/^#/,'')!=mat[i][7])holdvalues[i+'_7']=mat[i][7].replace(/^#/,'')};";
    document.write("<scr" + "ipt id=\"moregjs\" src=\"gradingsheet.js\"></scri" + "pt>");
    document.write("<scr" + "ipt id=\"moregjs1\" src=\"assessform.js\"></scr" + "ipt>");
    if (numRows == 0)
        onbegin = "";
    function remind1()
    {
        if (needtolock)
        {
            for (var j = 0; j < numRows; j++)
                if (retrv(j, 4) == '-1' || retrv(j, 4) == '' || retrv(0, 4) == '-2')
                    return;
            myprompt(textmsg[1708], null, "if(v)swtichstatus(2)");
        }
    }
    function showattpic()
    {
        demoheight(0.7);
        var e = ele(0, 11);
        try {
            ResizeUploaded.attachman(e);
        } catch (e) {
        }
        writetbl.rows[0].cells[7].click();
    }
    var onloadbeforegrading = null;
    if (typeof window.onload == 'function')
        onloadbeforegrading = window.onload;
    window.onload = function ()
    {
        onloadbeforegrading();
        if (parent != window && parent.frames[0].demokeyframen > 0)
        {
            demospeedup = parent.frames[0].demospeedup;
            demo();
        }
        showphoto();
        let copyr = document.getElementById('copyrights');
        let td = document.getElementById('toolbarbase').parentNode;
        let tr =td.parentNode;
        let nd = tr.insertCell(-1);
        nd.align = 'center';
        nd.appendChild(copyr);
        document.body.style.marginBottom = '-5px';
        cachemissed();
    };
    function cachemissed()
    {
       let tm = (''+(new Date()).getTime()).replace(/.....$/,'');
       for (let n =0; n < numRows; n++)
       {
           let key = 'grading'+semester + '_' + mat[n][0]  + '_' + mat[n][1] + '_' + mat[n][2];
           if (localStorage[key] == null)
               localStorage[key] = JSON.stringify([mat[n][4], mat[n][13],mat[n][7], tm]);
       }     
    };
    var tblele;
    var hintxs = textmsg[1840].split(/@/);
    demotasks = [
        ['democursory = 200; closeprompt();tblele = writetbl;democursor2(tblele.rows[0].cells[0],2)', 0],
        ['democursor2(tblele.rows[0].cells[2],2)', 500],
        ['closeprompt();democursor2(tblele.rows[0].cells[4],2)', 2000],
        ['democursor2(tblele.rows[0].cells[6],2)', 2000],
        ['democursor2(tblele.rows[1].cells[6],2)', 2000],
        ['democursor2(tblele.rows[1].cells[7],2)', 2000],
        ['demoheight(0.7);showattpic()', 2000],
        ['demoheight(1);var xy=findPositionnoScrolling(promptwin);democursor2(xy[0]+10,xy[1]+10);democursorsim.style.zIndex=\'500\'', 500],
        ['demoheight(0.7);closeprompt()', 4000],
        ['demoheight(1);democursor2(tblele.rows[1].cells[4],2)', 500],
        ['democursor2(tblele.rows[1].cells[2],5)', 3000],
        ['democursor2(tblele.rows[1].cells[1],10)', 2000],
        ['myHintx=90;myHinty=100;showmyhintstr(textmsg[361]+" " +textmsg[1505],1)', 1000],
        ['closeprompt();tblele = studentimage.parentNode.parentNode.parentNode.parentNode;democursor2(tblele.rows[0].cells[0])', 1000],
        ['hidemyhint();tblele.rows[0].cells[0].style.backgroundColor = "#0000aa";tblele.rows[0].cells[0].style.color = "white";myHintx=80;myHinty=100;showmyhintstr(labels[2],1)', 1000],
        ['tblele.rows[0].cells[0].style.backgroundColor = "inherit";tblele.rows[0].cells[0].style.color = "black"', 2500],
        ['democursor2(studentimage,2);showmyhintstr(hintxs[4],1)', 1000],
        ['demoheight(0.7);showswitch()', 4000],
        ['demoheight()', 500],
        ['demoheight(0.7);showswitch()', 2000],
        ['demoheight(1)', 500],
        ['democursor2(tblele.rows[2].cells[0],3)', 2000],
        ['hidemyhint();myHintx=80;myHinty=200;showmyhintstr(hintxs[0],1)', 2000],
        ['democursor2(tblele.rows[3].cells[0],3)', 3000],
        ['hidemyhint();myHintx=80;myHinty=240;showmyhintstr(hintxs[1],1)', 800],
        ['democursor2(tblele.rows[4].cells[0],3)', 3000],
        ['hidemyhint();myHintx=80;myHinty=280;showmyhintstr(hintxs[2],1)', 800],
        ['democursor2(tblele.rows[5].cells[0],3)', 3000],
        ['hidemyhint();myHintx=80;myHinty=320;showmyhintstr(hintxs[3],1)', 1000],
        ['democursor2(document.getElementById("comments0"),10)', 3000],
        ['hidemyhint();window.scrollTo(0,200);demoheight(0.7);document.getElementById("comments0").click()', 3000],
        ['demoheight();tblele=document.form1.txt0.parentNode.nextSibling.getElementsByTagName("table")[0];democursor2(tblele.rows[0].cells[0],2)', 500],
        ['demoheight(0.7);testsheet.copysubmittedtext(0)', 2000],
        ["demoheight(1);democursor2(document.getElementById('enlargebut'),4)", 500],
        ["demoheight(0.7);document.getElementById('enlargebut').click();document.form1.txt0.value=hintxs[5]", 5000],
        ["demoheight(1)", 500],
        ["demoheight(0.7);onlinetoolmini()", 4000],
        ["demoheight(1);democursor2(document.form1.txt0,10)", 500],
        ["demoheight(0.7);document.form1.txt0.value=hintxs[6]", 2000],
        ["document.form1.txt0.value=hintxs[6] + ':$y=x^2$'", 100],
        ['democursor2(tblele.rows[2].cells[0],2)', 1000],
        ['democursor2(tblele.rows[1].cells[0],2)', 4000],
        ['demoheight(0.7);', 3000],
        ['demoheight(1);testsheet.passto(0)', 500],
        ['democursor2(document.form1.scorebox0,2)', 2000],
        ['demoheight(0.7)', 3000],
        ['demoheight(1);document.form1.scorebox0.value = "1";testsheet.updateatd(document.form1.scorebox0,0,3)', 500],
        ['window.scrollTo(0,document.body.scrollHeight);democursorx=500;democursory=document.body.scrollHeight-500;democursor2(document.form1.dropn,2)', 3000],
        ['democursor2(document.form1.formula,2)', 4000],
        ['demoheight(0.7);document.form1.formula.value="S"', 3000],
        ['demoheight(1)', 500],
        ['democursor2(document.form1.docalc,2)', 2000],
        ['demoheight(0.7)', 2000],
        ['demoheight(1)', 500],
        ['window.scrollTo(0,100)', 1000],
        ['democursorx=500;democursory=500;democursor2(studentimage.parentNode.parentNode.parentNode.parentNode.rows[3].cells[0],1.5)', 1000],
        ['democursorx=500;democursory=500;democursor2(document.getElementById("savebut"),2)', 4000],
        ['demoheight(0.7)', 2000],
        ['demoheight(1)', 500],
        ['demoremovesim();parent.frames[0].demokeyframen=0;parent.frames[0].type1()', 3000]

    ];

    

    function placedown(sp)
    {
        let tbl = document.getElementById('contbutt');
        if (sp == null)
        {
            if (tbl.rows.length==1)
                sp = tbl.rows[0].cells[tbl.rows[0].cells.length - 1];
            else
                sp = tbl.rows[tbl.rows.length - 1].cells[0];
        }
        let scoretd = document.getElementById('scoredetail');
        let scoretbl = document.getElementById('scoredetailtbl');
        
        if (sp.innerHTML.charCodeAt(0) == 8593)
        {
            let content = document.getElementById('content').getElementsByTagName('div');
            if (content != null && content.length > 0)
            {
                content = content[0];
                if (content != null && content.tagName.toLowerCase() == 'div')
                    content.style.height = (baseheight() - font_size - 30) + 'px';
            }
            localStorage['topmenugrade'] = "T";
            topmenu = true;
            f1.insertBefore(tbl, writetbl);

            if (scoretd.innerHTML.length < 20)
            {
                writetbl.rows[2].deleteCell(0);
                document.getElementById('content').colSpan = "9";
                studentimage.style.position = 'absolute';
                studentimage.style.left = '3px';
                tbl.rows[0].cells[0].width = (charwidthrate() * font_size);
                studentimage.width = tbl.rows[0].cells[0].offsetWidth + 2;
                writetbl.rows[0].cells[0].style.minWidth = (2 * leftbutwidth + 10) + 'px';
                writetbl.rows[1].cells[0].style.minWidth = (2 * leftbutwidth + 10) + 'px';
                writetbl.rows[0].cells[0].align = 'right';
                writetbl.rows[1].cells[0].align = 'right';
                document.body.appendChild(studentimage);
            } else
            {
                writetbl.rows[2].cells[0].appendChild(studentimage);
                writetbl.rows[2].cells[0].appendChild(scoredetailtbl);
                tbl.rows[0].cells[0].width = '0%';
                tbl.rows[1].cells[0].width = leftbutwidth;
            }
            tbl.rows[tbl.rows.length - 1].cells[0].width = 20;
            for (let i = tbl.rows.length - 1; i > 0; i--)
            {
                let t = tbl.rows[1].cells[0];
                t.style.whiteSpace = 'nowrap';
                t.width = (charwidthrate() * font_size);
                t.style.width = (charwidthrate() * font_size) + 'px';
                tbl.rows[0].appendChild(t);
                tbl.deleteRow(1);
            }
            tbl.style.margin = "3px 0px 3px 0px";
            sp.innerHTML = '&darr;';
            studentimage.height = 100;
            studentimage.style.border = "1px #b0b0b0 solid";
            studentimage.style.borderRadius = "3px";
            studentimage.style.top = (findPositionnoScrolling(document.getElementById('content'))[1] - 100) + 'px';
            let q = document.getElementById('scoredetailtbl');
            if (q.parentNode != tbl.rows[0].cells[1] && q.rows.length == 1)
                tbl.rows[0].cells[1].appendChild(q);
        } else
        {
            topmenu = false;
            localStorage.removeItem('topmenugrade');
            tbl.rows[0].cells[0].appendChild(studentimage);
            studentimage.style.position = 'static';
            let tooltd;
            if (writetbl.rows[2].cells.length == 1)
            {
                tooltd = writetbl.rows[2].insertCell(0);
                tooltd.style.backgroundColor = IBGCOLOR;
                contenttd.colSpan = "8";
            } else
            {
                tooltd = writetbl.rows[2].cells[0];
                tbl.rows[0].cells[1].appendChild(scoretbl);
            }
            for (let i = tbl.rows[0].cells.length - 1; i > 0; i--)
            {
                let tr = tbl.insertRow(1);
                let t = tbl.rows[0].cells[i];
                t.style.width = null;
                tr.appendChild(t)
            }
            tooltd.vAlign = 'top';
            tooltd.style.padding = '0px';
            tooltd.appendChild(tbl);
            writetbl.rows[0].cells[0].style.minWidth = (leftbutwidth) + 'px';
            writetbl.rows[1].cells[0].style.minWidth = (leftbutwidth) + 'px';
            writetbl.rows[0].cells[0].align = 'left';
            writetbl.rows[1].cells[0].align = 'left';
            let content = document.getElementById('content').parentNode;
            if (content.tagName.toLowerCase() == 'div')
                content.style.height = (baseheight() - font_size - 30) + 'px';
            tbl.style.margin = "0px 0px 0px 0px";
            studentimage.style.borderWidth = "0px";
            studentimage.style.borderRadius = "0px";
            sp.innerHTML = '&uarr;';
        }
    }
}
function tobottom()
{
    let tbl = document.getElementById('contbutt');
    let sp = null;
    if (tbl.rows.length==1)
        sp = tbl.rows[0].cells[tbl.rows[0].cells.length - 1];
    else
        sp = tbl.rows[tbl.rows.length - 1].cells[0];
    if (sp.innerHTML.charCodeAt(0) == 8593)
    {
            let content = document.getElementById('content').getElementsByTagName('div');
            if (content != null && content.length > 0)
            {
                content = content[0];
                if (content != null && content.tagName.toLowerCase() == 'div')
                    content.style.height = (baseheight() - font_size - 30) + 'px';
            }
     }
     else
     {
         let content = document.getElementById('content').parentNode;
         if (content.tagName.toLowerCase() == 'div')
                content.style.height = (baseheight() - font_size - 30) + 'px';
     }
}
function checkall(ck)
{
    let marks = document.f4.checkbox;
    for (let i=0; i < marks.length; i++)
        marks[i].checked = ck.checked;
}
function analytics(f,K)
{
   let arr = new Array();
   let key0 = mat[0][0] + '-' + mat[0][1];
   let atype=mat[0][12];
   for (let i=0; i < numRows; i++)
   {
      let key = mat[i][0] + '-' + mat[i][1];
      if (key==key0)
      {
           arr[arr.length] = [mat[i][2],mat[i][10],retrv(i,4),timebystudent[mat[i][2]]];
      }
   }
   
   if (arr.length == 0) return;
   sortordera[sortordera.length] = f;
   rearrange(sortordera,4);
   quicksort(arr, 0, arr.length-1,function(a,b){ 
       let t;
       for (let j=sortordera.length-1; j >= 0; j--)
       {
           let jj = sortordera[j];
           if (jj>=2)
              t = parseFloat(a[jj]) - parseFloat(b[jj]);
           else
              t = a[jj].localeCompare(b[jj]); 
           if (K==-1) t *= -1;
           if (t!=0)
               return t;
        }
        return 0;
     } ); 
   
   let str = "<form rel=opener name=f4  ><table align=center class=outset1 style=border-radius:3px  id=analtbl>";
   str += "<tr style=background-color:" + BBGCOLOR + ">";
   str +=( "<td   style=white-space:nowrap;background-color:" + BBGCOLOR + " style=\"border:0px\" width=" +  (5 + font_size) + " align=center> <input type=checkbox name=check1 value=all onclick=checkall(this) style=\"background-color:transparent\"> </TD>");
   str += "<td align=left  style=white-space:nowrap;background-color:" + BBGCOLOR + "  onclick=sortcol(0," + j + ',' + K + ")>" + textmsg[673] 
          + "&nbsp;&nbsp;</td><td  style=white-space:nowrap;background-color:" + BBGCOLOR + "  align=left  onclick=sortcol(1," + j + ',' + K + ")>" + labels[10] 
          + "</td><td align=right  style=white-space:nowrap;background-color:" + BBGCOLOR + " onclick=sortcol(2," + j + ',' + K + ")>" + labels[4]  + "</td>"
          + "</td><td align=right  style=white-space:nowrap;background-color:" + BBGCOLOR + " onclick=sortcol(3," + j + ',' + K + ")>" + (atype=='4'?textmsg[542]:textmsg[1310])  + "</td></tr>";
   let sum = 0;
   for (let j=0; j < arr.length; j++)
   {
     sum += parseFloat(arr[j][2]);
     let tm = arr[j][3];
     
     str += "<tr  style=background-color:" + TBGCOLOR + ">";
     str += "<TD  valign=top  style=background-color:" + TBGCOLOR + "  align=center  width=" +  (5+ font_size) + "> <INPUT  type=checkbox name=checkbox value=" + j + "  > </TD>";
     str +="<td align=left style=background-color:" + TBGCOLOR + ">" + arr[j][0] 
          + "</td><td align=left style=white-space:nowrap;background-color:" + TBGCOLOR + ">" + arr[j][1] 
          + "</td><td align=right style=background-color:" + TBGCOLOR + ">" + arr[j][2]   + "</td>"
          +"<td align=right style=background-color:" + TBGCOLOR + ">" + (tm==0?'*':tm) + "</td></tr>";
   }  
   let mean = sum/arr.length;
   sum = 0;
   let tt = 0;
   let ns = 0;
   for (let j=0; j < arr.length; j++)
   {
     let f = parseFloat(arr[j][2]);
     sum += (f-mean)*(f-mean);
     let tt1 =  timebystudent[arr[j][0]];
     if (tt1 > 0) 
     {
         ns++; tt+=tt1;
     }
   }
   sum = Math.sqrt(sum/arr.length); 
   str += "<tr><td align=center>" + arr.length + "</td><td align=right>" + textmsg[648] 
          + "</td><td align=left>" + mean.toFixed(2) + '<span style=float:right>STD</span>' 
          + "</td><td align=right>" + sum.toFixed(2)  + "</td><td align=right>" + (tt/ns).toFixed(0)  + "</td></tr></table>";
   str += " * " + textmsg[708];
   str += "<center><a href=javascript:quickmessage()>" + textmsg[1903]  + "</a>&nbsp;&nbsp;&nbsp;<a href=javascript:byquestion(0,1)>" + textmsg[1901] + "</a>&nbsp;&nbsp;&nbsp;<a href=javascript:regression(1)>" + textmsg[1907] + "</a>&nbsp;&nbsp;&nbsp;<a href=javascript:distribute1()>" + textmsg[1898] + "</a></center><div id=errmsg></div></form>";
   myprompt(str,null,null,textmsg[1900] + ": " + key0); 
   
}
function distribute1()
{
    param[0] = 4;
    distribute(600,400);
    let y = document.getElementById('whichfield');
    let tr = y.parentNode.parentNode;
    tr.deleteCell(0);
    tr.deleteCell(0);
    y = document.getElementById('insertimg');
    y.parentNode.removeChild(y);
}
function partition( a,  lo, hi, f)
    {
        let done = hi <= lo;
        let hi0 = hi;
        let m = lo;
        let pivot = a[m];
        while (!done)
        {
            while( f(a[lo], pivot)<0) lo++;
            while( f(pivot,a[hi]) <0 ) hi--;
            if (lo >= hi) {
                 done = true;
            }
            else
            {
                let temp = a[lo];
                a[lo] = a[hi];
                a[hi] = temp;
                hi--; lo++;
                if (lo > hi) done = true;
            }
        }
        if (hi == hi0) hi--;
        return hi;
    }
    function quicksort( a, lo, hi,f)
    {
        if(lo >= hi) return;
        let m = partition(a,lo,hi,f);
        quicksort(a, lo, m,f);
        quicksort( a, m+1, hi,f);
    }
    
function sortbyquestion(f, f1, k)
{
    if (f == f1)
    {
        byquestion(f,-k);
    }
    else 
        byquestion(f1,k); 
}
let timebystudent = [];
let sortorder = new Array();
let sortordera = new Array();
function rearrange(x,l)
{
    let y = new Array();
    let t = [];
    for (let j=x.length-1; j>=0; j--)
    {
       let z = x[j];
       if (t[z] == null)
       {    
           y[y.length] = z;
           t[z] = 1;
       }
    }
    x.splice(0,x.length);
    for (let j=y.length-1; j >=0; j--)
       x[x.length] = y[j];
}
function byquestion(f,K)
{
   let arr = new Array();
   let key0 = mat[counter][0] + '-' + mat[counter][1];
   let atype = mat[counter][12];
   let numItem = 0; 
   for (let i=0; i < numRows; i++)
   {
      let key = mat[i][0] + '-' + mat[i][1];
      if (key==key0)
      {
          let zz = retrv(i,13);
          if (zz==null) zz = mat[i][13];
          if (zz != null && zz!='' && zz.length>4)
          arr[arr.length] = zz;
          numItem++;
      }
    }
    let Q = new Array();
    let S = new Array();
    let C = new Array();
    let T = new Array();
    let TN = new Array();
    let N =0;
    let count = true;
    for (let j=0; j < numRows; j++)
    {
        let key = mat[j][0] + '-' + mat[j][1];
        if (key != key0) continue;
        let csv = (new CSVParse(retrv(j,6),"'",",","\r\n")).nextMatrix();
        let totaltime = 0;
        for (let k=0; k < csv.length; k++)
        {
            if (csv[k].length > 5) try
            {
                let i = parseInt(csv[k][0]);
                let t = parseInt(csv[k][2]);
                totaltime += t;
                if (T[i] == null) 
                    T[i] = t;
                else 
                    T[i] += t;
                if (t>0)
                {
                    if (TN[i] == null) 
                       TN[i] = 1;
                    else 
                       TN[i]++; 
                }
            }catch(e){}
        }
        timebystudent[mat[j][2]] =  totaltime;
    }
    if (atype=='4') 
    {
        let v = new Array();
        for (let u in timebystudent)
           if (timebystudent[u] > 0) 
               v[v.length] =  timebystudent[u];
           
        quicksort(v,0,v.length-1,function(a,b){return a-b;});
        let w = [];
        for (let t=0; t < v.length; t++)
        { 
            if (w[''+v[t]]==null)
            w[''+v[t]] = ''+(t+1);
           
        }
        let tt = [];
        for (let a in timebystudent)
        {
           if (timebystudent[a] != 0)
               tt[a] = parseInt(''+ w[''+timebystudent[a]]);
           else timebystudent[a] = numItem;
        }
        for (let a in tt)
            timebystudent[a] = tt[a];
    }
    for (let st of arr)
    {
       let  ps = new CSVParse(st,'|',',',";");
       let y = ps.nextMatrix(); 
        
       for (let j =0; j < y.length-1; j++)
       {
          let z = y[j];
          if (z.length <3 || isNaN(z[0]) || isNaN(z[1]) ) continue;
          let qn = parseInt(z[0]);
          if (qn > N) N = qn; 
          if (S[qn] == null)
          {    
              S[qn] = eval(z[2]);
              C[qn] = 1;
          }
          else 
          {
              S[qn] += eval(z[2]);
              C[qn] += 1;
          }
           
          if (Q[qn] == null)
              Q[qn] = parseFloat(z[1]);
           
        }
    }
    
    let str = "<table class=outset1 width=350 id=analtbl  style=border-radius:3px  ><tr   style=background-color:" + BBGCOLOR + "><td align=right onclick=sortbyquestion("+f + ",0,"+K + ")>" +textmsg[178] 
            + "</td><td align=right  onclick=sortbyquestion("+f + ",1,"+K + ")>" 
            +textmsg[1725].split(/@/)[1]  + "</td><td align=right  onclick=sortbyquestion("+f + ",2,"+K + ")>"
            + textmsg[1760] + "</td><td align=right  onclick=sortbyquestion("+f + ",3,"+K + ")>"
            + textmsg[28] + "</td>" + (atype=='4'?"":("<td align=right  onclick=sortbyquestion("+f + ",4,"+K + ")>"
            + (atype=='4'?textmsg[542]:textmsg[1310]) + "</td>")) + "</tr>";
    let sum = 0, sum1 = 0,na = 0, timesum = 0, TNN=0;
    let row = new Array();
    for (let i=1; i <= N; i++)
    {
        if (typeof (TN[i]) == 'undefined' || TN[i]==null || TN[i] == 0 )
        {
            N = i-1; break;
        }
        S[i] /= C[i];
        row[i] = [i,C[i],Q[i],S[i],(T[i]/TN[i])];
        sum += Q[i];
        sum1 += S[i];
        na += C[i];
        timesum += T[i]/TN[i];
        TNN += TN[i];
     }
    sortorder[sortorder.length] = f;
    rearrange(sortorder,5);
    quicksort(row, 1, row.length-1,function(a,b)
    {
        let t;
        for (let j = sortorder.length-1; j >=0; j--)
        {   
            t= parseFloat(a[sortorder[j]]) - parseFloat(b[sortorder[j]]);
            if (K==-1) t *= -1;
            if (t != 0) return t;
        }
    } );
     
    for (let i=1; i <= N; i++)
    {
        
        str += "<tr   style=background-color:" + TBGCOLOR + "><td align=right>" + row[i][0] 
            + "</td><td align=right>" 
            + row[i][1].toFixed(0) + "</td><td align=right>"
            + row[i][2].toFixed(0) + "</td><td align=right>"
            + row[i][3].toFixed(2) + "</td>" + (atype=='4'?'':("<td align=right>"
            + row[i][4].toFixed(0) + "</td>")) + "</tr>";
     }
     str += "<tr style=background-color:lightyellow><td align=right  style=background-color:lightyellow>" + textmsg[194] 
            + "</td><td align=right  style=background-color:lightyellow>" 
            + na + "</td><td align=right  style=background-color:lightyellow>"
            + sum.toFixed(0) + "</td><td align=right  style=background-color:lightyellow>"
            + sum1.toFixed(2) + "</td>" + (atype=='4'?'':("<td align=right  style=background-color:lightyellow>"
            + (timesum).toFixed(0) + "</td>")) + "</tr>";
     str += "</table><center><nobr>" + sum1.toFixed(2) + "/" + sum.toFixed(0) +  (sum=='100'?'':(" = " + (100*sum1/sum).toFixed(2)+'/100')) + "&nbsp;<a href=javascript:analytics(2,1)>" + textmsg[690] + "</a>" + (atype=='4'?'':("&nbsp;&nbsp;&nbsp;<a href=javascript:regression(0)>" + textmsg[1907] + "</a>")) + "&nbsp;&nbsp;&nbsp;<a href=javascript:distribute1()>" + textmsg[1898] + "</a></nobr></center><div id=errmsg></div>";
     myprompt(str,null,null,textmsg[1900] + ": " + key0);
     if (loadedgoweb == false)
     {
        loadedgoweb = true;
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "goweb.js";
        document.getElementsByTagName("head")[0].appendChild(script);
     }
}
let loadedgoweb = false;
function sortcol(i,j,k)
{
   if (i == j)
   {
       analytics(j,-k);
   }
   else
   {
       analytics(i,k);
   }
}

function regression(k)
{
    let tbl = document.getElementById('analtbl');
    let x = new Array(),y = new Array();
    let atype = mat[counter][12];
    let sumx =0, sumy = 0, xbar, ybar;
    if (k==1)
    {
    for (let i=1; i < tbl.rows.length-1; i++)
    {
       if (tbl.rows[i].cells[3].innerHTML == '*')continue;
       try{
       let x0 = parseFloat(tbl.rows[i].cells[4].innerHTML);
       if (''+x0 == 'NaN') continue;
       let y0 = parseFloat(tbl.rows[i].cells[3].innerHTML);
       if (''+y0 == 'NaN') continue;
       x[x.length] = x0;
       y[y.length] = y0;
       sumx += x0;
       sumy += y0;
       }catch(e){}
    }
    if (x.length == 0) return;
    xbar = sumx/x.length;
    ybar = sumy/y.length;
    }
    else if (k==0)
    {
        for (let i=1; i < tbl.rows.length-1; i++)
    {
       let x0 = parseFloat(tbl.rows[i].cells[4].innerHTML);
       let y0 = parseFloat(tbl.rows[i].cells[3].innerHTML)*100/parseFloat(tbl.rows[i].cells[2].innerHTML);
       x[x.length] = x0;
       y[y.length] = y0;
       sumx += x0;
       sumy += y0;
    }
    xbar = sumx/x.length;
    ybar = sumy/y.length;
    }
    let n =0, d = 0;
    for (let j = 0; j < x.length; j++)
    {
        n+= (x[j] - xbar)*(y[j] - ybar);
        d+= (x[j] - xbar)*(x[j] - xbar);
    }
    let beta = n/d;
    let alpha = ybar - beta*xbar;
    textmsg[1760] + "</td><td align=right>"
            + textmsg[28] + "</td><td align=right>"
            + (atype=='4'?textmsg[542]:textmsg[1310])
    document.getElementById('errmsg').innerHTML = 
     "s = " + alpha.toFixed(2) + " " + (beta>0?'+':'')  + beta.toFixed(2) + "t<br>s ----- "
     + (k==0?("100&times;" + textmsg[28] + "/" + textmsg[1760]):textmsg[28])
     + "<br> t ----- " + (atype=='4'?textmsg[542]:textmsg[1310]);
     
    
}
function quickmessage()
{
    let markers = document.f4.checkbox;
    let sids = '';
    for (let r = 0; r < markers.length; r++)
    {
        if (markers[r].checked)
        {
            sids += "," + markers[r].parentNode.nextSibling.innerHTML;
        }
    }
    if (sids == '') 
   {
       document.getElementById('errmsg').innerHTML = (textmsg[247]);
       return;
   }
   allsids = sids.substring(1);
   alertmessage();
}
let allsids;
function alertmessage()
{
    let str = '<table class=outset1 ><tr><td  style="white-space:nowrap">' + textmsg[1902] 
            + '</td><td><input id=subject class=left style="border:1px #808080 solid;border-radius:3px" value=alert></td></tr><tr><td valign=top  style="white-space:nowrap">'
            +textmsg[449]  + '</td><td><textarea id=msg rows=5 cols=40></textarea></td></tr><tr><td colspan=2 align=center>'
    + '<input class=GreenButton type=button style=width:' + (4.5*font_size) + 'px onclick=sendmsg() value="' +textmsg[223]+ '">'
    + '<input class=OrangeButton  type=button style=width:' + (4.5*font_size) + 'px onclick=cancelmsg() value="' +textmsg[18]+ '"></td></tr></table>';
    myprompt(str,null,null,textmsg[1903]);
}
function cancelmsg()
{
   closeprompt();
}
function sendmsg()
{
   let subject = document.getElementById('subject').value;
   let msg = document.getElementById('msg').value;
   let wcds = "u'" + subject + "','" + msg.replace(/'/g,"''") + "','0','" + subdb + "','','"
            + allsids + "'";
   postopen('SaveBack',['rdap','subdb','securitytoken','wcds','orgnum','rsacode'],
   ['messagenew',subdb,'',wcds,orgnum,'0'],'w' + tstmp);
   closeprompt();
}

 function gradeothers()
{
    if (testsheet != null)
    {
        testsheet.propagate();
    }
    else if (freeformat != null)
    {
        freeformat.propagate(); 
    }
}
 function doreplace()
{
    for (let i=0; i < testsheet.atd.length; i++)
    {
        if (testsheet.lscores[i] == null) continue;
        var x = formselementbyname(document.form1,'scorebox'+i);
        if (x.value != ''+testsheet.lscores[i])
        {
            x.value = testsheet.lscores[i];
            testsheet.updateatd(x,i,3);
        }
    }
}
function checkallothers(ck)
{
    let j = 0; let v;
    while ( (v = document.getElementById('c'+j)) !== null)
    {
        v.checked = ck.checked;
        j++;
    }
}
function recover()
{
    let n = 0; let v;
    while ( (v = document.getElementById('c'+n)) !== null)
    {
        if (v.checked)
        {
            let key = mat[n][0] + '_' + mat[n][1] + '_' + mat[n][2];
            let u = (localStorage['grading'+semester +'_'+ key]);
            if (u!=null)
            {
               let v = JSON.parse(u); 
               setv(n, 4, v[0]); setv(n, 13, v[1]); setv(n, 7, v[2]); 
            }
        }
        n++;
    }
}
function clearcache()
{
    let n = 0; let v;
    let tbl = document.getElementById('cachetbl');
    while ( (v = document.getElementById('c'+n)) !== null)
    {
        if (v.checked)
        {
            let key = mat[n][0] + '_' + mat[n][1] + '_' + mat[n][2];
            let v =  localStorage['grading'+semester +'_'+ key];
            if (v!=null)
            {
               delete localStorage['grading'+semester +'_'+ key];
               for(let j=2; j < 6; j++)
               tbl.rows[n+1].cells[j].innerHTML =  '';
            }
        }
        n++;
    }
}
function showcached(td)
{   
    let cached = textmsg[1866].split(/@/)[3];
    let words = textmsg[1944].split(/@/);
    let current = textmsg[469] ;
    let ss = '<table align=center style=padding:2px;font-size:10px;background-color:'+ BBGCOLOR+ ';border-radius:3px;margin-bottom:4px;color:green  cellpadding=3><tr><td  style=font-size:12px;>' + words[9] +'</td><td width=10></td><td  style=font-size:12px>' + words[11] + '</td></tr><tr><td  style=font-size:12px>' + words[10] +'</td><td width=11></td><td  style=font-size:12px>' + words[12] + '</td></tr></table><table width=' + (thispagewidth()-20) + ' style=border-collapse:collapse;border-color:#999 border=1 cellspacing=1 cellpadding=3 id=cachetbl>';
    ss +='<tr bgcolor=' + BBGCOLOR +'><td   align=center valign=top><input  type=checkbox width=0% id=call onclick=checkallothers(this)><td valign=top  width=0% >' 
    + words[0] +  '</td><td  valign=top width=0% >' 
    + words[2] + '</td></td><td align=right  valign=top><nobr>' 
    + words[3] + '</nobr></td><td valign=top width=30% >' 
    + words[4]+   '<input type=button name=reoverbtn class=OrangeButton style=width:78px onclick=clearcache() value="' 
    + textmsg[1663] + '"></td><td  valign=top   width=20% >'   
    + words[5] +  '</td>'  + '<td width=3 rowspan=' + (numRows+1) +'> </td><td align=right  valign=top><nobr>' 
    + words[6] + '</nobr></td><td valign=top width=30% >' 
    + words[7] +   '<input type=button name=reoverbtn class=OrangeButton style=width:78px onclick=recover() value="' 
    + words[1] + '"></td><td  valign=top   width=20% >' 
    + words[8] +  '</td></tr>';
   
    for (let n=0; n < numRows; n++)
    {
        let key = mat[n][0] + '_' + mat[n][1] + '_' + mat[n][2];
        let b = counter == n;
        let u = localStorage['grading'+semester +'_'+ key];
        let v = ['','','',''];
        if (u != null) 
           v = JSON.parse(u);
        if (v[0]!=='') v[0] = parseFloat(''+ v[0]).toFixed(1);
        ss += '<tr><td   align=center valign=top><input  type=checkbox width=0% id=c' + n + '></td><td valign=top   width=0% >' + (b?'<b>':'') + key.replace(/_/g,' ')+ (b?'</b>':'') + '</td><td  valign=top width=0% >' + (v[3]===''?'':(new Date(parseInt(v[3])*100000)).toString()).replace(/\(.*$/,'') + '</td><td align=right  valign=top>' + v[0] + '</td><td  width=30% valign=top >' + (b?'<b>':'')+  (b?v[1].replace(/;/g,'<br>'):v[1].replace(/;/g,' '))+ (b?'</b>':'') + '</td><td  valign=top   width=20% >' + v[2] +'</td>'
        +'<td align=right  valign=top   width=0% >' + parseFloat(retrv(n,4)).toFixed(1) + '</td><td  valign=top    width=30% >' +  retrv(n,13).replace(/;/g,' ')  + '</td><td   valign=top   width=30% >' +  retrv(n,7) +'</td></tr>';
    }
    ss += '</table>';
    myprompt(ss,null,null,textmsg[1866].split(/@/)[3]);
    promptwin.style.left = '0px';
}

