  
var isembedquiz = false;
var qstates = new Array();
Hwtake.notall = (typeof(assformat) == 'undefined');

function borderstyle(t,r,b,l)
{
    return "border-color:#b0b0b0;border-style:solid;border-top-width:" + t + "px;border-left-width:" + l + "px;border-bottom-width:" + b + "px;border-right-width:" + r + "px";
}
Hwtake.attaf2code = new Array();
        //  new Hwtake('prev', mat[i][8], mat[i][9], attstr,  mat[i][17],  mat[i][4], i, true ); 
function Hwtake(stage, qtxt, atxt, atta, pts, fmt, nn, courseonly,freef,forceorder,mbs)
{
    
    this.rorn =   (qtxt!=null && qtxt.indexOf("\n") < 0  &&  qtxt.indexOf("\r") >= 0
                   || atxt!=null && atxt.indexOf("\n") < 0  &&  atxt.indexOf("\r") >= 0) ? '\r':'\n'; 
    this.langsep = textmsg[1332].replace(/\./,'').replace(/\]/,'').replace(/\)/,'').replace(/:/,'').replace(/\[/,'').replace(/\(/,'').replace(/\\/,'').replace(/(.)/g, "|$1") + "]";
    this.fmt = fmt;
    this.stage = stage;
    this.forceorder = forceorder;
    this.mbs = mbs;
    this.err = "";
    this.atta = atta;
    this.warn = "";
    this.header = '';
    this.header0 = '';
    this.str = "";
    this.nummult = 0;
    this.quesnums = null;
    this.questarr = null;
    this.biggesti = -1;
    this.warnq = "";
    this.answnums = null;
    this.warna = "";
    this.answqrr = null;
    this.ptlist = null;
    this.timequota = new Array();
    this.graderbyquestion = new Array();
    this.qtypes = new Array();
    this.outcome = null;
    this.numAnswered = null;
    this.numright = null;
    this.unknwonnum = false;
    this.hints = textmsg[1369];
    this.name;
    this.orders = "";
    this.callingwin = null;
    this.nn = (nn==null)?-1:nn;
    this.courseonly = courseonly;
    this.usedot = true;
    this.delimiter = "[0-9]+[ |:|\\.|\\)|\\]";
    this.divs = "";
    this.maximagelet = 0;
    this.attachheader = '';
    this.duringclass = false;
    this.freef = freef;
    this.loadwhich = 0;
    this.fontFamily = typeof(someconsts)=='undefined'?'inherit':someconsts[1];
    if (stage =='prev'  )
    {
        if (parent.parent.parent==parent.parent   && parent.parent.opener!=null && onmydomain(parent.parent.opener)
               && typeof(parent.parent.opener.setneedproof) != 'undefined' )
        {
            this.callingwin = parent.parent.opener;
            
        }
        if (typeof(parent.parent.opener) != null && onmydomain(parent.parent.opener) && typeof(parent.parent.opener.duringopen) != 'undefined'  &&  parent.parent.opener.duringopen())
        {
            this.duringclass = true;
        }
    }
    this.clearsel = function (ab, i,sel )
    {
        if (this.callingwin == null) return;
       
        if (!sel.checked)
        {
           var xxx = new RegExp("([" + this.rorn + "]+)" + i + "(" +  this.delimiter.substring(6) + this.langsep + ")");
          
           if (ab == 1 || ab == 3)
           {
               this.callingwin.setv(0,8, this.callingwin.retrv(0,8).replace(xxx, "$1  " + i + "$2"));
           }
           if (ab == 2 || ab == 3)
           {
               this.callingwin.setv(0,9, this.callingwin.retrv(0,9).replace(xxx, "$1  " + i + "$2"));
           }
        }  
        else 
        {
           var xxx = new RegExp("([" + this.rorn + "]+)[ ]+" + i + "(" +  this.delimiter.substring(6) + this.langsep + ")");
           if (ab.indexOf('1')>=0)
           {
               this.callingwin.setv(0,8, this.callingwin.retrv(0,8).replace(xxx, "$1" + i + "$2"));
           }
           if (ab.indexOf('2')>=0)
           {
               this.callingwin.setv(0,9, this.callingwin.retrv(0,9).replace(xxx, "$1" + i + "$2"));
           }
        } 
        
    }
   
   this.provethis  = function(nm)
   {
        if (this.callingwin!=null && this.stage == 'prev')
        {
           
           // this.callingwin.setv(0, 9, this.normalizedatxt);
            this.stage = 'take';
            this.assemble(false);
            
            this.stage = 'prev';
            
            var j1 = this.str.length;
            var j2 = this.str.lastIndexOf("<table"); 
            if (j2 != -1) j1 = j2;
            var x = this.header + this.str.substring(0,j1).replace(/onclick=ponf\(\)/g,'');
            
            this.callingwin.giveyouformatedtxt(x);
          
            this.callingwin.proveFormat(nm,  parent.parent);
             
            if (nm == textmsg[67])  
                window.parent.close();  
            else   
                closeprompt();
        }
   }
    
    this.contains1 = function(ii)
    {
        if (this.answnums != null)
            for (var i = 0; i < this.answnums.length; i++)
            {
                if (this.answnums[i] == ii)
                {
                    return true;
                }
            }
        return false;
    };
    this.contains = function(ii)
    {
        if (this.quesnums != null)
            for (var i = 0; i < this.quesnums.length; i++)
            {
                if (this.quesnums[i] == ii)
                {
                    return true;
                }
            }
        return false;
    };

    this.circlebg = function(n, k)
    {
        var m = Math.round(n / 2 + 3);
        let x = "<div style=\"font-family:arial;font-weight:700;width:" + (2 * m) + "px;height:" + (2 * m)
               + "px;border-radius:" + m + "px;font-size:" + n + "px;color:#ddcc11;line-height:" + (2 * m) + "px;text-align:center;background-color:" + IBGCOLOR + "\"";
        if (isembedquiz)
            x += "  onclick=\"pollquestion(" + k + ")\"";
        return x +  ">"  + k + "</div>";
    }
   
    
    this.isMulti = function(x)
    {
        var r = new RegExp( "[\r|\n][ |\\(]*[a-z][:|\\.|\\)|\\]" + this.langsep  , "i");
        var m = r.exec(x);
        if (m == null)
            return "Answer";
        var k = m.index + m.toString().length;
        m = r.exec(x.substring(k));
        return (m != null) ? "multi-choice" : "Answer";
    }

     
    
    this.showerror = function(nam)
    {
        this.name = nam;
        var ways = this.callingwin.getpreviewforsave();
        this.callingwin.setpreviewforsave(false);
        var v = ways?textmsg[67]:textmsg[1375];
        var ss = "<table   align=center style=\"border-radius:3px;font-familt:" + someconsts[1] + " !important\"><tr><td id=savebtn2 align=center  class=OrangeButton style=\"white-space:nowrap;width:80px;overflow:visible;color:white;background-color:orange;border:1px #c0c0c0 outset;font-size:17px;\"   onclick=\"provethis('" + v + "')\" ><span  style=\"font-familt:" + this.fontFamily + " !important\">" +    v + "</span></td>";
        ss += "<td  id=closebtn2  align=center   class=OrangeButton style=\"white-space:nowrap;width:80px;overflow:visible;color:white;background-color:orange;border:1px #c0c0c0 outset;font-size:17px;\"   onclick=\"parent.close()\"><span  style=\"font-familt:" + this.fontFamily + " !important\">" + textmsg[1376] + "</span></td>";
        
        ss += "<td  id=qiotabtn2  align=center   class=GreenButton style=\"white-space:nowrap;width:80px;overflow:visible;color:white;background-color:orange;border:1px #c0c0c0 outset;font-size:17px;\"  onclick=\"runtimequota()\"><span  style=\"font-familt:" + this.fontFamily + " !important\">" + textmsg[1693] + "</span></td></tr></table><div id=fortimequota class=outset3 style=\"text-align:left;color:#BB0000;background:" + TBGCOLOR +";margin:5px 5px 5px 5px\"></div>";
       
        var s =  "<table cellspacing=1  border=1 align=center width=X cellpadding=3 style=\"border:1px #999 solid;border-radius:3px;font-family:var(--fontname);border-collapse:collapse;margin:3px 0px 3px 0px\" ><tr><td valign=top  class=warncell colspan=N><div><div  style=\"font-family:var(--fontname) !important\">" + this.hints + "</div></div></td></tr><tr>", s1= '<tr>';
        var ll=0;
        for (var i=0; i <= this.biggesti; i++)
        {
            var ab = 0;
            if (this.contains(i)) ab = 1;
            if (this.contains1(i)) ab += 2;
            if (ab!=0)
            {
                ll++;
                s += "<td valign=top align=center >" + i + "</td>";
                s1 += "<td valign=top align=center><input type=checkbox id=\"ck + " + i + "\" style=background-color:transparent value=" + i + " checked  onclick=\"" + nam + ".clearsel(" + ab + "," + i + ",this)\"  ></td>";
            }
        }
        var tw = ll * 30;
        if (tw < 530) 
            tw = 530;
            s = s.replace(/X/, '' + tw ).replace(/N/, '' + ll);
        s += "</tr>" + s1 + "</tr></table>";
        if (this.err != '' || this.warn != '')
           s += ("<div style=\"margin:5px 0px 0px 0px;border:1px #999 solid;border-radius:3px;border-collapse:collapse;background-color:white;margin:2px 0px 4px 0px;font-family:var(--fontname)\" ><table cellspacing=1 cellpadding=3  style=\"\" width=" + tw + ">" + this.err + this.warnq + this.warna + this.warn + "</table></div>");
        s += ss ;
        if (this.err == '' )
        {
            var ms = textmsg[1935].split(/@/);
            var chk = 1;
            if (typeof(parent.parent.opener.duringopen)!='undefined')
            {
                chk = parent.parent.opener.duringopen()?0:1;
                if (chk==1 && this.answnums.length < 2)
                    chk = 2;
            }
            this.loadwhich = chk;
            
            s = "<table style=\"border:1px #999 solid;border-radius:3px;font-family:var(--fontname);margin-bottom:4px;background-color:" + TBGCOLOR+ "\"><tr>"
            +"<td valign=middle ><input type=radio onclick=showanswers(1) name=loadwhich value=ans " + (chk==1?"checked":"") +"></td><td valign=middle style=\"border-right-width:1px;border-right-color:#999;border-right-style:solid\"><span><nobr>" +  ms[0]  + "&nbsp;</nobr></span></td>"
            +"<td  valign=middle ><input type=radio onclick=showanswers(2)  name=loadwhich value=cache" + (chk==2?"checked":"") +"></td><td  valign=middle  style=\"border-right-width:1px;border-right-color:#999;border-right-style:solid\"><span><nobr>" +  ms[1]  + "&nbsp;</nobr></span></td>"
            +"<td  valign=middle ><input type=radio onclick=showanswers(0) name=loadwhich value=none  " + (chk==0?"checked":"") +"></td><td  valign=middle style=\"border-right-width:1px;border-right-color:#999;border-right-style:solid\"><span><nobr>" +  ms[2] + "&nbsp;</nobr></span></td>"
            +"<td  valign=middle  ><input id=syncheckbox type=checkbox onclick=synanswers(this.checked) " + (this.answnums.length<=1?'checked':'') + "></td><td  valign=middle ><span><nobr>" +  ms[3] + "</nobr></span></td></tr></table>" + s;
            if (this.answnums.length < 1) 
                this.loadwhich += 10;
        }
         
        myprompt(s,null,null,"<span style=\"font-family:" + this.fontFamily + "\">" +  textmsg[1596] + "</span>");
        if (promptwin.offsetWidth > 700)
            promptwin.style.left = '0px';
        if (promptwin.offsetHeight > 600)
            promptwin.style.top = '0px';
         
        promptwin.style.width = null;
        
    };

    this.trim = function(s)
    {
        s =  s.replace(/^[ |\n|\r]+/, '').replace(/[ |\n|\r]+$/, '');
         
        return s;
    }
    
    this.goodopenurl = function(codepath,tail)
    {
        if (codepath.indexOf('http://') == 0 || codepath.indexOf('https://') == 0)
        {
            return codepath;
        }
        else
        {
            var st= "FileOperation?did=" + codepath;
            if (tail==null||tail==true) st = "&tcode=" + (new Date()).getTime()%1000000000;
            return st;
        }   
    } 
    
    this.parseAttach = function(atta)
    {
        
        if (atta == null) 
        {
            this.divs = "";
            this.maximagelet = 0;
            this.attachheader = '';
            return;
        }
        atta = atta.replace(/,$/,'');
        if (atta == '')
        {
            this.divs = "";
            this.maximagelet = 0;
            this.attachheader = '';
            return;
        }
       
        var z = (new CSVParse(atta, '\'','@',',')).nextMatrix(true);
        var at = '', q=''; 
        var k=0;
        var iis = ''; 
        if (this.nn != -1) 
        {
            iis = "_" + this.nn;
        }
        for (var i=0; i < z.length; i++)
        {
            var len = z[i].length - 1;
            if ( this.courseonly!=null && z[i][len].charAt(0) == '_') continue;
            if ( z[i][0].replace(/[0-9]/g,"")==""  && z[i][len].replace(/[0-9]+/g, "")=="___")
            {
                var xx = Hwtake.attaf2code[z[i][1]];
                if (xx == null) continue;
                if (parseInt(z[i][0]) > this.maximagelet)
                {
                    this.maximagelet = parseInt(z[i][0]); 
                }
                var  ns = z[i][len].split(/_/);   
                q += "div.imagelet" +  z[i][0] + iis 
                + "\n{\nbackground-image:url(" 
                + this.goodopenurl(xx,false) + ");\nbackground-position:-" + ns[0] + "px -" + ns[1] + "px;\nwidth:" + ns[2] + "px !important;\nheight:" + ns[3] + "px !important;\n}\n\n"; 
                k = at.indexOf('>' + z[i][1] + '<');
                if (k >=0) 
                {
                    at = at.substring(0,k).replace(/ <[^<]+$/,'') + at.substring(k+z[i][1].length+8);
                } 
            }
            else
            {
                 
                var cd = Hwtake.attaf2code[z[i][0]];
                if (cd == null)
                   Hwtake.attaf2code[z[i][0]] = z[i][len];
                at += " <span style=color:blue;cursor:pointer onclick=\"openproper('" + z[i][len] + "','" + z[i][0] + "',this)\" >" + z[i][0] + "</span> ";
            }
        }
        this.divs = q  ;
       
        at = at.replace(/^[ ]+/g, '').replace(/[ ]+$/g, '');
        if (at.length > 1)
        {
            this.attachheader  =  at;
        }
        
    }
     this.navi = 0;
    this.parseQuestion = function(qtxt)
    {
        if (qtxt == null) qtxt = '';
        if (this.rorn == '\r')
           qtxt = "\r" + qtxt.replace(/\r[ ]+\r/g, '\r\r').replace(/^[ |\r]+/, '');
        else
           qtxt = "\n" + qtxt.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n[ ]+\n/g, '\n\n').replace(/^[ |\n]+/, '');
        var valid = true;
        var spt;
       
        spt = new RegExp( "[" + this.rorn + "]+" + this.delimiter + this.langsep  );
        
        var k = 0, j = 0, l = 0, kn = 0;
        var m = null;
        this.questarr = new Array();
        this.quesnums = new Array();
        this.warnq = "";
        var i = -1;
        var biggesti = -1;
        var num = null;
        
        while (k < qtxt.length)
        {
            try
            {
                m = spt.exec(qtxt.substring(k));
            }catch(ex)
            {
                m = null;
            }
           
            var toben = '';
            var q = '';
            if (m != null)
            {
                j = k + m.index;
                toben = m.toString();
                kn = j + toben.length;
                q = this.trim(  qtxt.substring(k, j) );
                
            }
            else
            {
                j = qtxt.length;
                kn = j;
                q = this.trim(  qtxt.substring(k) );
          
            }
           
            if (i == -1)
            {
                this.header0 = mqtxt = this.trim(qtxt.substring(0, j) );
                
                var xx = Hwtake.tohtml(this.trim(qtxt.substring(0, j)), this.fmt);//.replace(new RegExp("\\[" + textmsg[1303] + "([0-9]+)\\]","ig"), '<table  style="display:inline"><tr><td><div class="imagelet$1"></div></td></tr></table>');
                
                xx = this.merge(xx);  
                 
                if (xx!='')
                    this.header = "<center><div  class=quesans style=\"width:99%;margin:7px 0px 7px 0px;padding:4px 4px 4px 4px;text-align:left\" >" + xx + "</div></center>";
                else
                    this.header = "";
                
            }
            else if (i >= 0)
            {
                this.questarr[i] = q;
              
            }
            if (m == null)
                break;
            
            num = toben.replace(/[^0-9]/g, ''); 
            i = parseInt(num);

            if (i > biggesti)
                biggesti = i;
            if (this.contains(i))
            {
                this.warnq += "<tr class=warncell><td width=0% valign=top  align=left ><span style=white-space:nowrap>" + textmsg[178] + " " + num + "</span></td><td valign=top width=100% ><span style=white-space:nowrap>" + textmsg[1372] + "</span></td></tr>";
                i = -2;
            }
            else
                this.quesnums[this.quesnums.length] = i;
            k = kn;
           
        }
        
        this.biggesti = biggesti;
         
        if (this.unknwonnum == false)
            this.unknwonnum = (this.biggesti == -1);
        
    }
    this.normalizedqtxt = '';
    this.normalizedatxt = '';
    this.matcherror = '';
    this.parseAnswer = function(atxt)
    { 
        var k = 0, l = 0, j = 0, i = -1, n=0;
        this.normalizedatxt = '';
        this.matcherror = '';
        Hwtake.answers = new Array();
        var tanswers = new Array();
        this.answnums = new Array();
        this.warna = '';
        var m = null;
        var spt = null;
        var toben = '';
        var kn;
        var matxt = '';
        if (atxt != null)
            {
            if (this.rorn == '\r')
               atxt = "\r" + atxt.replace(/\r[ ]+\r/g, '\r\r').replace(/^[ |\r]+/, '');
            else
               atxt = "\n" + atxt.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n[ ]+\n/g, '\n\n').replace(/^[ |\n]+/, '');

            spt = new RegExp( "["+ this.rorn + "]+" + this.delimiter + this.langsep );
         
            while (k < atxt.length)
            {
                var k1 = k;
                while (true) 
                {
                    m = spt.exec(atxt.substring(k1));
                    if (m==null) break;
                    var jj =  parseInt(m.toString().replace(/[^0-9]/g,''));
                    if (jj < 1000) break;
                    k1 += m.index + m.toString().length;
                }
                toben = '';
                if (m != null)
                {
                    j = k1 + m.index;
                    toben = m.toString();
                    kn = j + toben.length;
                }
                else
                {
                    j = atxt.length;
                    kn = j;
                }
                if (i != -1)
                {
                    tanswers[i] = this.trim(  atxt.substring(k, j) );
                    if (this.questarr[i]!=null && this.questarr[i].includes('___') && tanswers[i]!=null && tanswers[i].length>0)
                    {
                        let alines = tanswers[i].replace(/why:.*/,'').replace(/^[\s|\n]+/,'').replace(/[\s|\n]+$/,'').split(/\n+/);
                        let kk = 0;
                        let ll = 0;
                        let qtxt = this.questarr[i];
                        let r = new RegExp(/__[_]+/);
                        let nn = 0;
                        let mqtxt = '';
                        while (kk < qtxt.length)
                        {
                            let m = r.exec(qtxt.substring(kk));
                            if (m == null)
                            {
                                mqtxt += qtxt.substring(kk);
                                break;
                            }
                            mqtxt += qtxt.substring(kk,kk+m.index);
                            let utext = m.toString(); 
                            if (alines[nn]!=null)
                            {
                                let lt = alines[nn].length;
                                while(utext.length < lt) 
                                   utext = utext + '_';
                            }
                            mqtxt += utext;
                            kk += m.index + m.toString().length;
                            nn++;
                        }
                        if (alines.length!=nn)
                        {
                            this.warn  += "<tr  class=warncell ><td valign=top width=0% align=left><span style=white-space:nowrap>" + textmsg[178] + " " +  i +"</span></td><td align=right width=100%  >#_____: " + nn + "&nbsp;&nbsp;&nbsp;&nbsp; #" + textmsg[84] + ": " + alines.length +"</td></tr>";
                        }
                        
                        if (mqtxt.length > qtxt.length) this.questarr[i] = mqtxt; 
                    }
                    matxt += this.rorn + this.rorn + i + (this.usedot? "." : ")") + " " + tanswers[i];
                }
                else
                {
                    matxt =  this.trim( atxt.substring(0, j) );
                }
                if (m == null)
                    break;
                
                var num = toben.replace(/[^0-9]/g, '');
                
                var i  = parseInt(num);
                this.answnums[this.answnums.length] = i;
                var bb = this.contains(i);
                if (bb == false)
                {
                    this.warna += "<tr  class=warncell><td valign=top  width=0%  align=left ><span style=white-space:nowrap>" + textmsg[457] +  " " + i + "</span></td><td valign=top  width=100% ><span style=white-space:nowrap> " + textmsg[1373] + "</span></td></tr>";
                }
                else if (tanswers[i] != null)
                {
                    this.warna += "<tr  class=warncell><td valign=top  width=0%  align=left ><span style=white-space:nowrap>" + textmsg[457] + " " + i +   "</span></td><td valign=top  width=100% ><span style=white-space:nowrap> " + textmsg[1372] + "</span></td></tr>";
                    i = -1;
                }
                k = kn;
            }
           // if (this.matcherror!='') this.matcherror = '<table cellspacing=4 cellpadding=4><tr><td>' + textmsg[78] + "</td><td align=right># _______</td><td align=right>#" + labels[9] + "</td></tr>"
           //  + this.matcherror + "</table>";
        }
        this.normalizedatxt = matxt;
        
        this.answqrr = tanswers;
    }
    
    this.parseTimequota = function(pts)
    {
        var j = 0;
        this.timequota = new Array();
        this.graderbyquestion = new Array();
        if (pts != null && pts != '')
            {
                var as = (new CSVParse(pts, "|", ",", ";")).nextMatrix();
                 
                for (var i = 0; i < as.length; i++)
                {
                    if (as[i] == null || as[i][0] == null)
                        continue;
                    var rs = as[i];
                    
                    var num = rs[0].replace(/ /g, '');
                    if (num == '' || isNaN(num))
                    {
                        continue;
                    }

                    j = parseInt(num);
                    if (this.timequota[j] == null)
                    {
                        if (this.contains(j) == false)
                        {
                            this.warn += "<tr  class=warncell><td valign=top  align=left width=0% ><span style=white-space:nowrap>" + textmsg[178] + " " + j + "</span></td><td width=100% valign=top ><span style=white-space:nowrap> " + textmsg[99] + "</span></td></tr>";
                        }
                        this.timequota[j] = rs[1];
                    }
                    if (this.graderbyquestion[j] == null)
                    {
                        if (this.contains(j) == false)
                        {
                            this.warn += "<tr  class=warncell><td valign=top  align=left width=0%><span style=white-space:nowrap>" + textmsg[178] + " " + j + " </span></td><td valign=top width=100% ><span style=white-space:nowrap>" + textmsg[99] + "</span></td></tr>";
                        }
                        this.graderbyquestion[j] = rs[2];
                    }
                }
            
        }
    }
 

    this.parsePoints = function(pts)
    {
        var j = 0;
        this.ptlist = new Array();
        this.outcome =  new Array();
        if (pts != null)
        {
            var header = pts.replace(/;.*/,'');
            if (header == textmsg[1305])
                pts = pts.replace(/[^;]+[$|;]/, '');
            
            if (pts != '')
            {
                var as = (new CSVParse(pts, "|", ",", ";")).nextMatrix();
                
                for (var i = 0; i < as.length; i++)
                {
                    if (as[i] == null || as[i][0] == null)
                        continue;
                    var rs = as[i];
                    
                    var num = rs[0].replace(/ /g, '');
                    if (num == '' || isNaN(num))
                    {
                        continue;
                    }

                    j = parseInt(num);
                    if (this.ptlist[j] == null)
                    {
                        if (this.contains(j) == false)
                        {
                            this.warn += "<tr  class=warncell><td valign=top width=0% align=left ><span style=white-space:nowrap>" + textmsg[178] + " " + j + "</span></td><td valign=top  width=100% ><span style=white-space:nowrap>" + textmsg[99] + "</span></td></tr>";
                        }
                        this.ptlist[j] = rs[1];
                        this.outcome[j] = rs[2];
                    }
                }
            }
        }
    }
    
    this.merge = function(s)
    {
         
        var iis = ""; if (this.nn >= 0) iis = "_" + this.nn;
        if (s==null) return '';
  return s
  .replace(new RegExp("\\[Imagelet([0-9]+):1\\]","ig"),"<table style=display:inline;float:left><tr><td><div  class=\"imagelet$1" + iis + "\"></div></td></tr></table>") 
  .replace(new RegExp("\\[Imagelet([0-9]+):2\\]","ig"),"<table style=display:inline;float:right><tr><td><div class=\"imagelet$1" + iis + "\"></div></td></tr></table>")   
  .replace(new RegExp("\\[Imagelet([0-9]+)\\]", "ig"), "<table align=center><tr><td><div class=\"imagelet$1" + iis + "\"></div></td></tr></table>"); 
  
   
    }
    this.yy = null;
    this.asis = false;
    this.assemble = function(doshuffle,asis)
    {
        var N = this.quesnums.length; 
        if (asis!=null) this.asis = asis;
        Hwtake.notall = (typeof(assformat) == 'undefined');
        this.str = "<table id=\"maintbl\"   class=outset3 style=\"margin:0px 0px 0px 0px\" cellspacing=0 cellpadding=3 width=100% border=0  >";
        if (this.header!='')
        {
          //    this.str += "<tr ><td  colspan=2 valign=top   style=\"" + borderstyle(1, 1, 0, 1) + "\">" + this.header + "</td></tr>";
                
        }
        this.z = new Array(N);
        for (var ii = 0; ii < this.z.length; ii++)
        {
            this.z[ii] = ii;
        }
        var shuff = (doshuffle && this.stage == 'take' && !isembedquiz);
        if (shuff)
        {
            if (this.forceorder == null || this.forceorder == '')
                this.z = Hwtake.shuffle(this.z);
            else 
                this.z = Hwtake.shuffle1(this.z,this.forceorder);
        }
        var mqtxt = this.header0;
        var orders = "";
        this.yy = new Array(N);
        this.qtypes = new Array(N);
        this.maxorder = 0;
       // var tanswers = this.answqrr;
        var r2 = new RegExp("[a-z|A-Z][ |:|\\.|\\)" + this.langsep );
        for (var i = 0; i < N; i++)
        {

            var j = this.quesnums[this.z[i]];
            if (j > this.maxorder)
                this.maxorder = j;
            var vans = ' ';
            
            if (this.answqrr[j] != null && this.answqrr[j] != '')
            {
                this.answqrr[j] = this.trim(this.answqrr[j]);
                if (this.answqrr[j].length == 1 && this.answqrr[j].replace(/[a-z|A-Z]/, '') == ''
                        || this.answqrr[j].substring(0, 2).replace(r2, '') == '')
                    vans = this.answqrr[j].charAt(0).toLowerCase();
                else
                    vans = '  ';
            }

            this.qtypes[j] = 's';
            var opts = new Array();
            var sarr = Hwtake.multi(j, this.questarr[j], this.fmt, shuff, opts, this.langsep, this);
            
            var ss = sarr[0];  
            if (this.fmt == 1 || this.fmt == 2)
            ss = checkh(ss);
            this.questarr[j] = sarr[1];
            
            if (this.freef==null && (vans.length == 1 || this.questarr[j].indexOf("____") >= 0 ))
            {
                if (ss == '')
                {
                    //if (opts.length > 1)   this.err += "<tr><td valign=top  align=left style=color:red;background-color:#fff >" + opts[0] + "</td></tr>";
                }
                else if (opts.length < 2 && this.questarr[j].indexOf("____") >= 0)
                {
                    this.yy[j] = ss;
                    this.qtypes[j] = 'b';
                }
                else if (opts.length > 1)
                {
                    if (vans != ' ' && opts.toString().indexOf(vans) == -1)
                        this.err += "<tr  class=errorcell ><td valign=top width=0% align=left><span style=white-space:nowrap>" + textmsg[178] + " " + j + "</span></td><td valign=top  width=100% ><span style=white-space:nowrap> " + textmsg[1334]  + ": " + vans + " &nsub; " + opts.toString() + "</span></td></tr>";
                    if (this.stage == 'prev' && "abcdefghijklmnopqrstuvwxyz".indexOf(opts.toString().toLowerCase().replace(/[^a-z]/g,''))!=0)
                    {
                        this.warn += "<tr  class=warncell><td valign=top   width=0%   align=left ><span style=white-space:nowrap>" + textmsg[178] + " " + j + "</span></td><td valign=top  width=100% ><span style=white-space:nowrap>"  + textmsg[1374] + ": " + opts.toString() + "</span></td></tr>";
                    }
                    this.yy[j] = ss;
                    this.qtypes[j] = 'm';
                }
            }
            if (opts.length > 1 && vans == '  ')
            {
                this.warn = "<tr  class=warncell><td valign=top  align=left  width=0%  ><span style=white-space:nowrap>"  + textmsg[178] + " " + j  + "</span></td><td valign=top  width=100% ><span style=white-space:nowrap>"  + textmsg[1335] + "</span></td></tr>";
            }
            mqtxt += this.rorn + this.rorn + j + (this.usedot?".":")") +  " " + this.questarr[j];
        }
        this.normalizedqtxt  = mqtxt;
        if (this.stage == 'prev' && this.callingwin!=null ) this.callingwin.setv(0, 8, this.normalizedqtxt);
        ii = 1;
        this.mapnm2or = new Array();
        this.mapor2nm = new Array(); 
        
        if (isembedquiz)
        {
            for (i = 0; i < N; i++)
            {
                j = this.quesnums[this.z[i]];

                if (this.qtypes[j] == 'm')
                {
                    this.mapnm2or[j] = ii;
                     this.mapor2nm[ii] = j;
                    orders += j + "@";
                    this.nummult++;
                    this.str += "<tr height=22><td    width=22 valign=top align=center style=\"" + borderstyle(1, 1, 0, 1) + "\">" +   this.circlebg(20, ii) ; ii++;
                    this.str += "<!--" + j + "-->  </td><td   align=left  style=\"" + borderstyle(1, 1, 0, 0) + "\" class=noborder   valign=top>";
                    this.str += "<span class=cellbg id=qx"+j + "></span>" + this.yy[j] + "</td></tr>";
                    this.str += "<tr><td    style=\"" + borderstyle(0, 1, 0, 1) + "\"></td><td valign=top    style=\"" + borderstyle(0, 1, 0, 0) + "\" align=left><div  id=\"showarea" + j + "\"></div></td></tr>";
                }
                else if (this.qtypes[j] == 'b')
                {
                    orders += j + "@";
                    this.mapnm2or[j] = ii;
                    this.mapor2nm[ii] = j;
                    this.str += "<tr height=22><td   style=\"" + borderstyle(1, 1, 0, 1) + "\" width=22  valign=top align=center>" + this.circlebg(20, ii++);
                    this.str += "<!--" + j + "--></td><td    align=left  style=\"" + borderstyle(1, 1, 0, 0) + "\"  class=noborder  valign=top>";
                    this.str += "<span class=cellbg id=qx"+j + "></span>" + this.yy[j]+ "</td></tr>";
                    this.str += "<tr ><td    align=left  style=\"" + borderstyle(0, 1, 0, 1) + "\" class=noborder  valign=top>   <input type=hidden name=q" + j + " >   </td>";
                    this.str += "<td    align=left  style=\"" + borderstyle(0, 1, 0, 0) + "\"><div  id=\"showarea" + j + "\"></div></td></tr>";
                }
            }
        }
        else if (this.mbs) // not embedquiz
        {
            // do multiple choice first
            var pts = textmsg[1254].replace(/^.*30/,'').replace(/ /g,'');
            if (this.freef == null)
            for (i = 0; i < N; i++)
            {
                j = this.quesnums[this.z[i]];

                if (this.qtypes[j] != 'm')
                    continue;
                this.mapnm2or[j] = ii;
                this.mapor2nm[ii] = j;
                orders += j + "@";
                this.nummult++;
                this.str += "<tr><td valign=top   onclick=ponf()  width=100% >" + round1('100%') + "<table   width=100% class=quesans><tr><td onclick=ponf()  valign=top  align=left width=0% ><!--" + j + "--><b>" + (ii<10?"&nbsp;":"") +ii + ".</b>"; ii++;

                if (this.ptlist != null && this.ptlist[j] != null)
                {
                    this.str += "<br>(<nobr>" + this.ptlist[j]  + pts+ "</nobr>)";
                }
                else
                {
                    this.warn += "<tr  class=warncell><td valign=top   width=0%   align=left ><span style=white-space:nowrap>" + textmsg[456] + " " + j +  "</span></td><td valign=top  width=100% ><span style=white-space:nowrap>" + textmsg[1370] + " 1</span></td></tr>";
                }
                this.str += " </td><td onclick=ponf()  width=100% align=left   class=quesans valign=top>";
                this.str +=  (this.yy[j]) + "</td></tr>";
                
                if (1==2 && this.stage == 'prev')
                {
                    this.str += "<tr><td valign=top  align=left class=quesans style=\"overflow:display\"><span style=white-space:nowrap><b>" + textmsg[144] + "</b></span></td><td valign=top  " + (this.duringclass?'style=color:#999999;font-size:8px':'') + " align=left class=quesans>";
                    if (this.answqrr[j] == null || this.answqrr[j] == '')
                    {
                        this.str += "No answer provided"
                        this.warn += "<tr  class=warncell><td valign=top  align=left  width=0% ><span style=white-space:nowrap>" + textmsg[456] + " " + j  + "</span></td><td valign=top  width=100% ><span style=white-space:nowrap>" + textmsg[1371] + "</span></td></tr>";
                    }
                    else
                    {
                         
                        this.str += Hwtake.tohtml(this.answqrr[j], this.fmt);
                        
                    }
                    Hwtake.answers[i] = this.answqrr[j];
                    this.str += "</td></tr>";
                }
                else
                {
                    // this.str += "<tr><td align=left class=quesans></td><td align=left class=quesans> </td></tr>";
                }
                 
                this.str += "</table>" + round2 + "</td></tr>";
            }
 
            // fill out blank answers go second
            if (this.freef == null)
            for (i = 0; i < N; i++)
            {
                j = this.quesnums[this.z[i]];
                if (this.qtypes[j] != 'b')
                    continue;
                orders += j + "@";
                this.mapnm2or[j] = ii;
                this.mapor2nm[ii] = j;
                this.str += "<tr><td valign=top  onclick=ponf()  width=100% >" + round1('100%') + "<table   width=100%  class=quesans><tr><td onclick=ponf()     valign=top  width=0%  ><!--" + j + "--><b>" + (ii<10?"&nbsp;":"") +ii + "." + (ii<10?"&nbsp;":"") + "</b>";
                ii++;
                if (this.ptlist != null && this.ptlist[j] != null)
                {
                    this.str += "<br>(<nobr>" + this.ptlist[j] + pts + "</nobr>)";
                }
                else
                {
                    if (this.stage == 'prev')
                        this.str += '<br>( )';
                    this.warn += "<tr  class=warncell><td valign=top  align=left  width=0% ><span style=white-space:nowrap>" + textmsg[456] + " " + j + "</span></td><td valign=top  width=100% ><span style=white-space:nowrap>" + textmsg[1371] + " 10</span></td></tr>";
                }
                this.str += "</td><td onclick=ponf()  align=left  class=quesans valign=top  width=100% >";
                 
                this.str +=  (this.yy[j]) + "</td></tr>";
                this.str += "<tr ><td onclick=ponf()  align=left  class=quesans valign=top> <input type=hidden name=q" + j + " >  </td>";
                this.str += "<td valign=top  onclick=ponf()  align=left class=quesans ><div  id=\"showarea" + j + "\"></div></td></tr>";

                if (1==2 && this.stage == 'prev')
                {
                    this.str += "<tr><td valign=top  align=left class=quesans  style=\"overflow:display\"><span style=white-space:nowrap><b>" + textmsg[144] + "</b></span></td><td valign=top  align=left class=quesans>";
                    if (this.answqrr[j] == null || this.answqrr[j] == '')
                    {
                        this.str += "<font color=orange>" + textmsg[456] + " " + j + " " + textmsg[1371] + " </font>";
                        this.warn += "<tr  class=warncell><td valign=top  align=left  width=0% ><span style=white-space:nowrap>" + textmsg[456] + " " + j + "</span></td><td valign=top  width=100% ><span style=white-space:nowrap>" + textmsg[1371] + "</span></td></tr>";
                    }
                    else
                    {
                        var YY = this.answqrr[j].replace(/^[\n| |\r]+/,'').replace(/[\n| |\r]+$/,'').split(/\n/);
                        var XX = ''; 
                        for (var l=0; l < YY.length; l++)
                            XX += Hwtake.tohtml(YY[l], this.fmt) + "<br>";
                        this.str += XX;
                    }
                    Hwtake.answers[i] = this.answqrr[j];
                    this.str += "</td></tr>";
                }
                this.str += "</table>" + round2 + "</td></tr>";
            }


            // short answers go third
            var numshort = 0;
            
            for (i = 0; i < (this.freef == null?N:1); i++)
            {
                j = this.quesnums[this.z[i]];
               
                if (this.qtypes[j] != 's')
                    continue;
                this.mapnm2or[j] = ii;
                this.mapor2nm[ii] = j;
  
                orders += j + "@";
                this.str += "<tr><td valign=top  width=100% >" + round1('100%') + "<table width=100%    class=quesans ><tr><td  width=30 valign=top   ><!--" + j + "-->" + (this.freef==null?("<b>" + (ii<10?"&nbsp;":"") +ii + "." + (ii<10?"&nbsp;":"") + "</b>"):"");
                ii++;
 
                if (this.questarr[j] !=null && this.questarr[j] != '')
                {
                    if (this.ptlist != null && this.ptlist[j] != null)
                    {
                        this.str += "<br>(<nobr>" + this.ptlist[j] + pts + "</nobr>)";
                    }
                    else
                    {
                        if (this.stage == 'prev')
                            this.str += '<br>( )';
                        this.warn += "<tr  class=warncell><td valign=top  align=left  width=0%  ><span style=white-space:nowrap>" + textmsg[456] + " " + j + "</span></td><td valign=top  width=100% ><span style=white-space:nowrap>" + textmsg[1370] + " 10</span></td></tr>";
                    }
                }

                this.str += "</td><td align=left width=100% class=quesans valign=top>";
                this.str += Hwtake.tohtml(this.questarr[j], this.fmt) + "</td></tr>";
                this.str += "<tr >";
                this.str += "<td align=left  class=quesans valign=top  rowspan=2 >";

                this.str += "</td><td valign=top  class=quesans class=noborder align=left>";
               
                if (this.asis == false)
                {
                    this.str += "<textarea    name=q" + j + " cols=10 class=blanklook rows=" + (this.freef==null?3:7) + "  style=\"width:100%\" ";
                    if (Hwtake.notall)
                    {
                        this.str += " onkeydown=\"if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}\" ";
                        this.str += " onfocus=\"doonfocus(f1.q" + j + "," + j + ");larger(f1.q" + j + ");\" ";
                        this.str += " onblur=doonblur(this," + j + ") ";
                        this.str += " onchange=doonchange(this," + j + ") ";
                        this.str += " onkeyup=\"if(event.keyCode===9){showemtable(this," + j + ")}\" "
                        this.str += " onkeypress=\"return displaytxt(this,event," + j + ")\" ";
                    }
                    this.str += " ></textarea>";
                }
                else
                {
                    this.str += "<div style=height:200px;width:500px></div>";
                }
                this.str += "</td>";
                this.str += "</tr><tr><td valign=top  align=left class=quesans><div style=\"border:1px\" id=\"showarea" + j + "\"></div></td></tr>";


                if (1==2 && this.stage == 'prev')
                {
                    this.str += "<tr><td valign=top  align=left class=quesans><span style=white-space:nowrap><b>" + textmsg[144] + "</b></span></td><td valign=top  align=left class=quesans>";
                    if (this.answqrr[j] == null || this.answqrr[j] == '')
                    {
                        this.str += "<font color=orange>" + textmsg[456] + " " + j + " " + textmsg[1371] + "</font>";
                        this.warn += "<tr  class=warncell><td valign=top  align=left  width=0%  ><span style=white-space:nowrap>" + textmsg[456] + " " + j + "</span></td><td valign=top  width=100% ><span style=white-space:nowrap>" + textmsg[1371] + "</span></td></tr>";
                    }
                    else
                    {
                        this.str += Hwtake.tohtml(this.answqrr[j], this.fmt);
                    }
                    Hwtake.answers[i] = this.answqrr[j];
                    this.str += "</td></tr>";
                }
                this.str += "</table>" + round2 + "</td></tr>";
                numshort++;
                
            }
            
        } //end not embed
        else  
        {
            var numshort = 0;
            var pts = textmsg[1254].replace(/^.*30/,'').replace(/ /g,'');
            for (i = 0; i < N; i++)
            {
                j = this.quesnums[this.z[i]];
                if (this.freef == null && this.qtypes[j] == 'm')
                {    
                    this.mapnm2or[j] = ii;
                    this.mapor2nm[ii] = j;
                    orders += j + "@";
                    this.nummult++;
                    this.str += "<tr><td valign=top   onclick=ponf()  width=100% >" + round1('100%') + "<table   width=100% class=quesans><tr><td onclick=ponf()  valign=top  align=left  width=0% ><!--" + j + "--><b>" + (ii<10?"&nbsp;":"") +ii + ".</b>"; ii++;

                    if (this.ptlist != null && this.ptlist[j] != null)
                    {
                        this.str += "<br>(<nobr>" + this.ptlist[j] + pts + "</nobr>)";
                    }
                    else
                    {
                        this.warn += "<tr  class=warncell><td valign=top   width=0%   align=left ><span style=white-space:nowrap>" + textmsg[456] + " " + j +  "</span></td><td valign=top  width=100% ><span style=white-space:nowrap>" + textmsg[1370] + " 1</span></td></tr>";
                    }
                    this.str += " </td><td onclick=ponf()  width=100% align=left   class=quesans valign=top>";
                    this.str +=  (this.yy[j]) + "</td></tr>";

                    if (1==2 && this.stage == 'prev')
                    {
                        this.str += "<tr><td valign=top  align=left class=quesans style=\"overflow:display\"><span style=white-space:nowrap><b>" + textmsg[144] + "</b></span></td><td valign=top  " + (this.duringclass?'style=color:#999999;font-size:8px':'') + " align=left class=quesans>";
                        if (this.answqrr[j] == null || this.answqrr[j] == '')
                        {
                            this.str += "No answer provided"
                            this.warn += "<tr  class=warncell><td valign=top  align=left  width=0% ><span style=white-space:nowrap>" + textmsg[456] + " " + j  + "</span></td><td valign=top  width=100% ><span style=white-space:nowrap>" + textmsg[1371] + "</span></td></tr>";
                        }
                        else
                        {

                            this.str += Hwtake.tohtml(this.answqrr[j], this.fmt);

                        }
                        Hwtake.answers[i] = this.answqrr[j];
                        this.str += "</td></tr>";
                    }
                    else
                    {
                        // this.str += "<tr><td align=left class=quesans></td><td align=left class=quesans> </td></tr>";
                    }

                    this.str += "</table>" + round2 + "</td></tr>";
                }
                else  if (this.freef == null && this.qtypes[j] == 'b')
                {    
                    orders += j + "@";
                    this.mapnm2or[j] = ii;
                    this.mapor2nm[ii] = j;
                    this.str += "<tr><td valign=top  onclick=ponf()  width=100% >" + round1('100%') + "<table   width=100%  class=quesans><tr><td onclick=ponf()     valign=top   width=0% ><!--" + j + "--><b>" + (ii<10?"&nbsp;":"") +ii + "." + (ii<10?"&nbsp;":"") + "</b>";
                    ii++;
                    if (this.ptlist != null && this.ptlist[j] != null)
                    {
                        this.str += "<br>(<nobr>" + this.ptlist[j] + pts + "</nobr>)";
                    }
                    else
                    {
                        if (this.stage == 'prev')
                            this.str += '<br>( )';
                        this.warn += "<tr  class=warncell><td valign=top  align=left  width=0% ><span style=white-space:nowrap>" + textmsg[456] + " " + j + "</span></td><td valign=top  width=100% ><span style=white-space:nowrap>" + textmsg[1371] + " 10</span></td></tr>";
                    }
                    this.str += "</td><td onclick=ponf()  align=left  class=quesans valign=top  width=100% >";

                    this.str +=  (this.yy[j]) + "</td></tr>";
                    this.str += "<tr ><td onclick=ponf()  align=left  class=quesans valign=top> <input type=hidden name=q" + j + " >  </td>";
                    this.str += "<td valign=top  onclick=ponf()  align=left class=quesans ><div  id=\"showarea" + j + "\"></div></td></tr>";

                    if (1==2&&  this.stage == 'prev')
                    {
                        this.str += "<tr><td valign=top  align=left class=quesans  style=\"overflow:display\"><span style=white-space:nowrap><b>" + textmsg[144] + "</b></span></td><td valign=top  align=left class=quesans>";
                        if (this.answqrr[j] == null || this.answqrr[j] == '')
                        {
                            this.str += "<font color=orange>" + textmsg[456] + " " + j + " " + textmsg[1371] + " </font>";
                            this.warn += "<tr  class=warncell><td valign=top  align=left  width=0% ><span style=white-space:nowrap>" + textmsg[456] + " " + j + "</span></td><td valign=top  width=100% ><span style=white-space:nowrap>" + textmsg[1371] + "</span></td></tr>";
                        }
                        else
                        {
                            var YY = this.answqrr[j].replace(/^[\n| |\r]+/,'').replace(/[\n| |\r]+$/,'').split(/\n/);
                            var XX = ''; 
                            for (var l=0; l < YY.length; l++)
                                XX += Hwtake.tohtml(YY[l], this.fmt) + "<br>";
                            this.str += XX;
                        }
                        Hwtake.answers[i] = this.answqrr[j];
                        this.str += "</td></tr>";
                    }
                    this.str += "</table>" + round2 + "</td></tr>";
                } 
                else if (this.qtypes[j] == 's')
                {       
                    this.mapnm2or[j] = ii;
                    this.mapor2nm[ii] = j;

                    orders += j + "@";
                    this.str += "<tr><td valign=top  width=100% >" + round1('100%') + "<table width=100%    class=quesans ><tr><td  width=30 valign=top   ><!--" + j + "-->" + (this.freef==null?("<b>" + (ii<10?"&nbsp;":"") +ii + "." + (ii<10?"&nbsp;":"") + "</b>"):"");
                    ii++;

                    if (this.questarr[j] !=null && this.questarr[j] != '')
                    {
                        if (this.ptlist != null && this.ptlist[j] != null)
                        {
                            this.str += "<br>(<nobr>" + this.ptlist[j] + pts + "</nobr>)";
                        }
                        else
                        {
                            if (this.stage == 'prev')
                                this.str += '<br>( )';
                            this.warn += "<tr  class=warncell><td valign=top  align=left  width=0%  ><span style=white-space:nowrap>" + textmsg[456] + " " + j + "</span></td><td valign=top  width=100% ><span style=white-space:nowrap>" + textmsg[1370] + " 10</span></td></tr>";
                        }
                    }

                    this.str += "</td><td align=left width=100% class=quesans valign=top>";
                    this.str += Hwtake.tohtml(this.questarr[j], this.fmt) + "</td></tr>";
                    this.str += "<tr >";
                    this.str += "<td align=left  class=quesans valign=top  rowspan=2 >";

                    this.str += "</td><td valign=top  class=quesans class=noborder align=left>";
                    if (this.asis == false)
                   {   
                       this.str += "<textarea    name=q" + j + " cols=10 class=blanklook rows=" + (this.freef==null?3:7) + "  style=\"width:100%\" ";
                   
                        if (Hwtake.notall)
                        {
                            this.str += " onkeydown=\"if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}\" ";
                            this.str += " onfocus=\"doonfocus(f1.q" + j + "," + j + ");larger(f1.q" + j + ");\" ";
                            this.str += " onblur=doonblur(this," + j + ") ";
                            this.str += " onchange=doonchange(this," + j + ") ";
                            this.str += " onkeyup=\"if(event.keyCode===9){showemtable(this," + j + ")}\" ";
                            this.str += " onkeypress=\"return displaytxt(this,event," + j + ")\" ";
                        }
                        this.str += " ></textarea>";
                    }
                    else
                    {
                        this.str += "<div style=height:200px;width:500px></div>";
                    }
                    this.str += "</td>";
                    this.str += "</tr><tr><td valign=top  align=left class=quesans><div style=\"border:1px\" id=\"showarea" + j + "\"></div></td></tr>";


                    if (1==2 && this.stage == 'prev')
                    {
                        this.str += "<tr><td valign=top  align=left class=quesans><span style=white-space:nowrap><b>" + textmsg[144] + "</b></span></td><td valign=top  align=left class=quesans>";
                        if (this.answqrr[j] == null || this.answqrr[j] == '')
                        {
                            this.str += "<font color=orange>" + textmsg[456] + " " + j + " " + textmsg[1371] + "</font>";
                            this.warn += "<tr  class=warncell><td valign=top  align=left   width=0% ><span style=white-space:nowrap>" + textmsg[456] + " " + j + "</span></td><td valign=top  width=100% ><span style=white-space:nowrap>" + textmsg[1371] + "</span></td></tr>";
                        }
                        else
                        {
                            this.str += Hwtake.tohtml(this.answqrr[j], this.fmt);
                        }
                        Hwtake.answers[i] = this.answqrr[j];
                        this.str += "</td></tr>";
                    }
                    this.str += "</table>" + round2 + "</td></tr>";
                    numshort++;
                    if (this.freef != null)break;
                }
            }
        } //end not embed

        
        this.str += "</table>";
        
        if (isembedquiz)
        {
             this.str += "<table width=100% class=outset3 ><tr><td valign=top   width=100% align=left><img src=\"image/addopt.png\"  style=cursor:pointer  onclick=\"growrow()\"></td></tr></table>";
        }
        else
        {
             this.str += "<table width=100% id=tooltbl class=outset3 style=\"table-layout:fixed;margin:4px 0px 0px 0px\"><tr>" + (this.freef==null?("<td width=20 valign=middle><img src=\"image/addopt.png\"  style=cursor:pointer  onclick=\"growrow1()\">"):"<td width=1>") + "</td>";
             this.str += "<td valign=middle style=\"font-weight:bold;width:100px;font-size:var(--fontsize);font-family:var(--fontname)\">" + textmsg[787] + "</td><td style=color:blue;cursor:pointer;font-size:var(--fontsize);font-family:var(--fontname);width:28px onclick=\"attachmore()\" >[+]</td><td valign=middle align=left id=\"theattach\" style=\"color:blue;cursor:pointer;text-align:left\" onclick=\"ResizeUploaded.attachman(document.form1.attach)\"></td></tr></table>";
        }
        
        //this.str = this.str.replace(new RegExp("\\[" + textmsg[1303] + "([0-9]+)\\]","ig"), '<table  style="display:inline"><tr><td><div class="imagelet$1"></div></td></tr></table>');
         this.str = this.merge(this.str);
         
        
        this.orders = orders + this.nummult;
       
    }
    
     
     
    if (freef == null)
    {
        this.parseQuestion(qtxt);
        this.parseAnswer(atxt);
        this.parsePoints(pts);
    }
    else
    {
        this.quesnums = [1];
        this.questarr = ['',qtxt];
        this.biggesti = 1;
        this.answnums = [1];
        this.answqrr = [null,null];
        this.ptlist = [10]; 
    }
    this.parseAttach(atta);
     
    if (this.biggesti == -1)
    {
        if (this.answnums.length > 0)
        {
            
            for (var j = 0; j < this.answnums.length; j++)
                qtxt += "\n\n" + this.answnums[j] + ".  ";
            this.parseQuestion(qtxt);
        }
        else
        {
            
            this.hints = textmsg[1377];
            for (var j = 1; j < 11; j++)
                qtxt += "\n\n" + j + ".  ";
            
            this.parseQuestion(qtxt);
             
            this.parseAnswer(atxt);
            if (atxt!=null && atxt.length>0 && this.stage == 'take') this.fitlength(); 
            this.parsePoints(pts);
        }
    }
     
}    
needtranslator = true;
var growrow = function()
 {
   var t = document.getElementById("maintbl");
   var rn = t.rows.length;
  
   var i3 = rn - 2;
   var si = t.rows[i3].cells[0].innerHTML;
   var sj = si.replace(/[^!]+!([^>]+)>.*/, '$1').replace(/[^0-9]+/, '');
   var j = parseInt(sj)+1;
  
   detailass.mapnm2or[j] = j;
   var r = t.insertRow(-1);
   r.height = "22";
   var d = r.insertCell(-1);
   d.className = "quesans";
   d.width = '22';
   d.vAlign = 'top'; 
   d.style.cssText =   borderstyle(1,1,0,1);
    
   si = si.replace(/\-\-[0-9]+\-\-/, "--" + j + "--");  
   si = si.replace(/>[0-9]+</, ">" + j + "<"); 
   si = si.replace(/q[0-9]+/g,  "q" + j); 
   si = si.replace(/showarea[0-9]+/g,  "showarea" + j); 
   si = si.replace(/ [0-9]+ /g,  " " + j + " "); 
   si = si.replace(/,[0-9]+\)/g,  "," + j + ")"); 
   d.innerHTML = si;
   var d = r.insertCell(-1);
   d.style.cssText =   borderstyle(1,1,0,0);
   d.className = "noborder";
   d.vAlign = 'top'; 
   var opts = new Array();
   var rs =  Hwtake.multi(j, "___________________________", '0', false, opts,']');
   d.innerHTML = rs[0].replace(/<br>/,'');
   r = t.insertRow(-1);
   var d = r.insertCell(-1);
   d.style.cssText =   borderstyle(0,1,0,1);
   d.align = 'left';
   d.vAlign = 'top';
   d.className = "noborder";
   d.innerHTML = "<input type=hidden name=q" + j + " >";
   var d = r.insertCell(-1);
   d.style.cssText =   borderstyle(0,1,0,0);
   d.align = 'left';
   d.innerHTML = "<div  id=\"showarea" + j +"\"></div>";
   needresize=true;
} 
 
function extrarow(j)
{
    var str  =  round1('100%') + "<table width=100%    class=quesans ><tr><td  width=30 valign=top   ><!--" + j + "--><b>" + (j) + ".</b> ";
    str += "</td><td align=left width=100% class=quesans valign=top>";
    str += "<span class=cellbg id=qx"+ j +" ></span>";
    str +=  "</td></tr><tr ><td align=left  class=quesans valign=top  rowspan=2 >";
    str += "</td><td valign=top  class=quesans class=noborder align=left><textarea   name=q" + j + " cols=10 class=blanklook rows=3  style=\"width:99%\" ";
    if (Hwtake.notall)
    {
    str += " onkeydown=\"if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}\" onfocus=\"doonfocus(f1.q" + j + "," + j + ");resz();"+ ((typeof(onlinetoolbarfollow)!='undefined')?'onlinetoolbarfollow(this)':'') 
            + "\" onblur=doonblur(this," + j + ") ";
    str += " onchange=doonchange(this," + j + ") ";
    str += " onkeypress=\"return displaytxt(this,event," + j + ")\" ";
    str += " onkeyup=\"if(event.keyCode===9){showemtable(this," + j + ")}\" "
    }
    str += "></textarea></td>";
    str += "</tr><tr><td valign=top  align=left class=quesans><div style=\"border:1px\" id=\"showarea" + j + "\"></div></td></tr>";
    str += "</table>" + round2 ;
    return str;
}

var growrow1 = function()
 {
   var t = document.getElementById("maintbl");
   var rn = t.rows.length;
   var i3 = rn - 1;
   var si = t.rows[i3].cells[0].innerHTML;
   var sj = si.replace(/[^!]+!([^>]+)>.*/, '$1').replace(/[^0-9]+/g, '').replace(/\-/g, '');
   var j = ++detailass.biggesti;
   //detailass.orders = detailass.orders.replace(/.*@([0-9]+)$/g, "@" +j + "@$1");
   detailass.mapnm2or[j] = j;
   detailass.answnums[j] = j;
   detailass.quesnums[j] = j;
   detailass.questarr[j] = '';
   detailass.maxorder = j;
   var r = t.insertRow(-1);
   r.height = "22";
   var d = r.insertCell(-1);
   d.innerHTML = extrarow(j);
   var fj = null;
   eval("fj = document.form1.q" +j );
   doonfocus(fj,j);
   if(typeof(onlinetoolbarfollow)!='undefined')
   onlinetoolbarfollow(fj);
    
} 

Hwtake.answers = null;

Hwtake.tohtml = function(s, fmt)
{
   s = formatstr(s, fmt)  ; 
 
 if ('' +fmt=='0')
 {
     s = s.replace(/(http[\S]+)/ig,  '<a href="$1" target="_blank">$1</a> ');
 }
 if (''+fmt != '2')
     s = s.replace(/\$/g, '<span>$</span>'); 
 return s;
}
Hwtake.shuffle1 = function(o,forceorder)
{
   var j, x; 
   let pairs = forceorder.split(/,/);
   let seq = new Array();
   for (let i=0; i < pairs.length; i++)
   {
      let len = pairs[i].split(/[ ]*<[ ]*/);
      let jj = parseInt(len[0]) - 1;
      if (seq[jj] == null|| seq[jj] < len.length)
          seq[jj] = len.length;
      for (let k=1; k < len.length; k++)
      {
          let j = jj+k;
          o[j] += 1000;
      }
   }
   let newo = new Array();
   let k = 0;
   for (; k < o.length; k++)
       if (o[k] < 1000)
           newo[newo.length] = o[k];
   
   Hwtake.shuffle(newo);
   k = -1;
   while (newo[++k]!=null)
   {
       let j = newo[k];
       if (seq[j]!=null)
       {
          for (let r=seq[j]-1; r >=1; r--)
          {
              o[j + r] -= 1000;
              if (k+1 < newo.length)
                  newo.splice(k+1,0, j+r);
              else
                  newo.push(j+r);
          }
       }
   }
   let s1=0, s2=0;
   for (let j =0; j < o.length; j++)
   {
       s1 += o[j];s2+= newo[j];
   }
   if (s1 === s2) return newo;
   return o;
}
Hwtake.shuffle = function(o)
{
 for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
 return o;
}


Hwtake.findPositionnoScrolling = function( oElement, win)
{
 if (win==null) win = window;
 if (oElement==null) return [0,0];
 if( typeof( oElement.offsetParent ) != 'undefined' )
 {
 var originalElement = oElement;
 for( var  posY = 0,posX=0; oElement; oElement = oElement.offsetParent )
 {
 posY += oElement.offsetTop;
 posX += oElement.offsetLeft;
 if( oElement != originalElement && oElement != win.document.body && oElement != win.document.documentElement )
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



Hwtake.lander = function(id)
{
 return "<input class=noborder id=\"" + id +"\" type=button style=\"border:0px!important;margin:0px 0px 0px 0px;width:1px;height:1px;background-color:transparent\" onfocus=\"Hwtake.passfocus()\" >";
}

Hwtake.passfocus = function()
{
 var j = (Hwtake.divn.col + 1)  % Hwtake.answers.length;
 Hwtake.divn.copyValue();
 Hwtake.divn.asso(Hwtake.divn.cell, j);
}

Hwtake.outcellclick = function()
{
 if (Hwtake.divn!=null)
 {
 Hwtake.divn.copyValue();
 Hwtake.divn.col = -1;
 if (this.col==-1)
 {
 this.div.style.visibility = 'hidden';
 this.obj.style.visibility = 'hidden';
 }
 }
}

Hwtake.stroke = function(area,evt)
{
 var e = evt? evt : window.event;
 if(!e) return true;
 var key = 0;
 if (e.keyCode) { key = e.keyCode; } // for moz/fb, if keyCode==0 use 'which'
 else if (typeof(e.which)!= 'undefined') { key = e.which; }

 if (key==26)//undo editing
 {
 area.value = Hwtake.answers[Hwtake.divn.col];
 }
 else if (key==13)
 {
 area.style.height = (20 + area.offsetHeight) + "px";
 Hwtake.divn.cell.style.height = area.style.height;
 }
 return true;
}
 
 
this.tabeingedited = null;
Hwtake.quizrule = function(txt,evt,k,l,N)
{
 var e = evt? evt : window.event;
 if(!e) return true;
 var key = 0;
 if (e.keyCode) { key = e.keyCode; } // for moz/fb, if keyCode==0 use 'which'
 else if (typeof(e.which)!= 'undefined') { key = e.which; }
  
 if (key == 36 || key==62)
 {
  
 var fmt=guessFormat(txt.value );
 
 if (fmt==1 || fmt==2)
 {
       
      tabeingedited = txt;
      displayit(k, fmt, c);
 }

 }
 if ( isembedquiz )
 {
    
    if (qstates[k][l] == null)
    {
        if (timerhandle!=null)
        {
            return false;
        }
        starttimer(60,k,txt);
        //partialsendtimer = setTimeout("doonblurb(f1.q" + k +"_" + l + "," + k + ',' + N + ")", 60000); //;f1.q" + k +"_" + l +".style.visibility='hidden';}
    }
    qstates[k][l] = 1;
 }
 return true;
}


document.write("<div id=mobilediv style=\"position:absolute;border:0px;visibility:hidden\"><input id=mobiletxt  class=editcontrol  style=\"width:1px;height:1px;border:1px #b0b0b0 inset;vertical-align:middle;\"    onkeypress=\"return Hwtake.keystroke(this,event,'t')\">"
    +  Hwtake.lander('land1') +"</div>");
document.write("<div id=mobilediva style=\"position:absolute;border:0px;visibility:hidden\"><textarea  onkeydown=\"if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}\"    id=mobilearea  class=editcontrol style=\"width:1px;height:2px;border:1px #b0b0b0 inset;\" onkeypress=\"return Hwtake.stroke(this,event)\"></textarea>" +  Hwtake.lander('land4') +"</div>");
 

function Mydaodiv(div)
{
 if (div == null) return;
 this.fmt = '0';
 this.div = div;
 this.obj = div.childNodes[0];
 this.anchor = div.childNodes[1];
 this.ctype = 't';
 var xx = this.obj.tagName.toLowerCase();
 if (xx == 'textarea')
 this.ctype = 'a';

 this.cell = null;
 this.col = -1;



 this.comefit = function()
 {
 var s = 2;
 if (this.cell==null) return;
 this.div.style.width =  (this.cell.offsetWidth-s) + "px";
 this.div.style.height = (this.cell.offsetHeight-s) + "px";
 this.div.style.visibility = "visible";
 this.obj.style.visibility = "visible";
 var loc =  Hwtake.findPositionnoScrolling(this.cell,window);
 this.div.style.left =   (loc[0]) + "px";
 this.div.style.top =    loc[1] + "px";
 this.obj.style.width =  (this.cell.offsetWidth-s) + "px";
 this.obj.style.height = (this.cell.offsetHeight-s) + "px";
 this.obj.focus();

 }
 this.fixE = function(e)
 {
 if (typeof e == 'undefined') e = window.event;
 if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
 if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
 return e;
 }


 this.moveHere = function(j)
 {
 this.comefit();
 if (Hwtake.answers[j]!=null)
 this.obj.value = Hwtake.answers[j];
 else
 this.obj.value = '';
 if (this.col==-1)
 {
 this.div.style.visibility = 'visible';
 this.obj.style.visibility = 'visible';
 }
 this.obj.focus();
 }

 this.asso = function(cell,j,fmt)
 {
 this.cell = cell;
 this.col = j;
 this.moveHere(j);

 if (fmt != null)
 this.fmt = fmt;
 }

 this.copyValue = function()
 {
 if (this.col < 0) return;

 var x = this.obj.value;
 Hwtake.answers[this.col] = x;

 if (x != null && this.cell!= null)
 {
 this.cell.innerHTML = Hwtake.tohtml(x, this.fmt);
 if (this.fmt=='2' && typeof(latexmlefect)!='undefined' && latexmlefect)
 {
 AMtranslated = false;
 translate(null);
 }
 }
 //this.div.style.visibility = 'hidden';
 //this.obj.style.visibility = 'hidden';
 }
}

Hwtake.divn  = new Mydaodiv( document.getElementById("mobilediva"));

Hwtake.edit = function(td, j, fmt)
{
 Hwtake.divn.copyValue();
 myprompt("Hwtake.divn.col = " + Hwtake.divn.col);
 if (Hwtake.divn.col >= 0)
 myprompt(Hwtake.answers[Hwtake.divn.col] + "\n");
 Hwtake.divn.asso(td, j, fmt);

}

 

Hwtake.multi = function(num, qtxt, fmt, shuff, arr, langsep, hwtake)
{
  
    let answer = hwtake.answqrr[num]; 
    if (qtxt == null) qtxt = '';
    var rorn = (qtxt.indexOf("\n") < 0 && qtxt.indexOf("\r") >= 0)?'\r':'\n';
    var m = null;
    var k = 0, l = 0, j;
    var spt = null;
    if (rorn == '\n')
        spt = new RegExp("\n[a-z][ |:|\\.|\\)|\\" + langsep, "i");
    else
        spt = new RegExp("\r[a-z][ |:|\\.|\\)|\\" + langsep, "i");
    var str = "";
    var optstrold = new Array();
    var optstr = new Array();
    if (isembedquiz)
        qtxt = rorn + qtxt;
    var mqtxt = '';
    var qqs = '';
    while (k < qtxt.length)
    {
        m = spt.exec(qtxt.substring(k));

        if (m != null)
        {
            j = k + m.index;

        }
        else
        {
            j = qtxt.length;
        }
        var s1 = qtxt.substring(k, j).replace(/^[ |\r|\n]+/,'').replace(/[\n|\r| ]+$/g,'');
        if (arr.length == 0)
        {
            if (!isembedquiz)
                str = Hwtake.tohtml(s1, fmt) + "<br>";
            mqtxt = s1;
        }
        else
        {
            optstrold[arr.length - 1] = s1.replace(/"/g, '\\"');
            optstr[arr.length - 1] = Hwtake.tohtml(s1, fmt);
            mqtxt += "\n" + arr[arr.length - 1] + ". " + s1;
        }
        if (hasHTMLerror)
        {
            if  (hwtake!=null)   hwtake.err += "<tr class=errorcell><td valign=top  width=0% ><span style=white-space:nowrap>" + textmsg[178] + " " + num + "</span></td><td valign=top  width=100% ><span style=white-space:nowrap>HTML " + textmsg[1358] + ":</span><br> " + Hwtake.tohtml(s1,'0') + "</td></tr>";
        }
        if (m == null) break;

        var q = m.toString().toLowerCase();
        k = j + q.length;
        var N = q.length;
        for (var ll=0; ll < N; ll++)
        {
            if (q.charAt(ll) <= 'z' && q.charAt(ll) >= 'a')
            {
                q = q.charAt(ll);
                break;
            }
        }
        if (ll < N)
        {
            arr[arr.length] = q;
            if (qqs.indexOf(q)==-1)
            {
                qqs+=q;
            } 
            else
            {
                if (hwtake != null)
                hwtake.err  += "<tr  class=errorcell><td valign=top  align=lef width=0% t><span style=white-space:nowrap>" + textmsg[178] + " " + num + "</span></td><td valign=top  width=100% ><span style=white-space:nowrap>"+ q + " " + textmsg[1356] +  ":" + qqs + q + "</span></td></tr>";
            }
        }
         
    }
    
    var ismultiple = (qqs.replace(/[a|b|c]/ig,'').length < qqs.length-1);
    
    
    if (isembedquiz && optstr.length < 2 && qtxt.indexOf("___") < 0)
        qtxt = "___________________________";
    if (ismultiple == false)
    {
        mqtxt = qtxt;
        k = 0;
        l = 0;
        var r = new RegExp(/__[_]+/);
        if (qtxt.indexOf('___') < 0) 
            return  ['',   (qtxt)];
        var lens = [];
        while (k < qtxt.length)
        {
            var m = r.exec(qtxt.substring(k));
            if (m == null) break;
            lens[lens.length] = m.toString().length;
            k += m.index + m.toString().length;
        }
        
        var ss = Hwtake.tohtml(qtxt, fmt);
        for (l=0; l < lens.length; l++)
        {
            var sss = '';
            if (isembedquiz)
                {
                   // ss += "<table cellpadding=0 cellspacing=0 width=100% ><tr><td valign=top >";
                    sss +="<textarea   name=q" + num + '_' + l + " class=blanklook   style=\"width:99%;height:25px\"    onkeydown=\"if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}\"  onkeyup=\"if(event.keyCode===9){showemtable(this," + num + ")}\"  onkeypress=\"return displaytxt(this,event," + num + ")\"  onfocus=doonfocus(f1.q" + num + '_' + l + "," + num + "," +   l + ") onblur=doonblurb(this," + num + ",@#@@#@," +   l + ")   ></textarea>";
                    //ss += "</td><td valign=top  width=66 ><input  id=race" + num + " type=button class=OrangeButton style=\"font-weight:700;width:60px;font-size:16px\" onclick=\"sendpartial(" + num + ")\"   value=\"" + textmsg[1277] + "\" /></td></tr></table>";
                }
                else if (hwtake.asis == false)
                {
                    sss += "<input name=q" + num + '_' + l + " class=blanklook  type=text maxlength=\"" +  (''+Math.round(lens[l]*1.8)).replace(/\..*/,'')  + "\"   size=\"" +  (lens[l]+1) + "\" ";
                    if (Hwtake.notall)
                        sss += "onkeypress=\"return displaytxt(this,event," + num + ")\"  onfocus=doonfocus(f1.q" + num + '_' + l + "," + num + "," +   l + ") onblur=doonblurb(this," + num + ",@#@@#@," +   l + ")  onchange=doonchangeb(this," + num + ",@#@@#@) ";
                    sss += " >";
                }
                else 
                {
                    let xx ='';for (let i=0; i < lens[l]*1.8; i++) xx += '_'; 
                    sss +=  xx;
                }
            ss = ss.replace(/__[_]+/,sss);
        }
         
        if (isembedquiz)
        {
            qstates[num] = new Array(l);
        }
        return  [ss.replace(/@#@@#@/g, '' + l), mqtxt];

    }
    var r = new Array(arr.length);
    for (ii = 0; ii < r.length; ii++)
        r[ii] = ii;
    if (!isembedquiz && shuff)
        r = Hwtake.shuffle(r);
    if (isembedquiz)
    {
        qstates[num] = new Array(arr.length);
        str += "<table width=100% cellpadding=0 cellspacing=0><tr><td valign=top  id=\"choice" + num + "\" >";
             
    }
    for (j = 0; j < arr.length; j++)
    {
        str += "<div style=display:inline;color:#333333;width:16px;font-size:16px;border-radius:8px;visibility:hidden>" + arr[r[j]] + "</div><input  type=radio  style=background-color:transparent name=q" + num + " value=\"" + arr[r[j]] + (isembedquiz?'':(' ' + optstrold[r[j]].replace(/"/g,'\''))) + "\" ";
        if (Hwtake.notall)
            str += "onmouseover=hintopt(this) onmouseout=hideopt(this) onclick=onradioclick(this," + num + "," + arr.length + ")";
        if (hwtake.stage == 'prev' && arr[r[j]] == answer)
            str += " checked ";
        str += ">" + optstr[r[j]] + ((isembedquiz) ? "&nbsp;&nbsp" : "<br>");
    }
    if (isembedquiz)
    {
        str += "</td><td valign=top  width=56 ><input  id=\"race" + num + "\" type=button class=OrangeButton style=\"font-weight:700;width:56px;font-size:16px;visibility:hidden\"    value=\"race" + num + "\" /></td></tr></table>";
    }
    return [str, mqtxt];
}
var fsnd;
function hintopt(r)
{
   r.previousSibling.style.visibility = 'visible'   
}
function hideopt(r)
{
   r.previousSibling.style.visibility = 'hidden'   
}
var  attachmore = function(r,c)
{
     
    ResizeUploaded.attachref = document.form1.attach;
     
    var fs = document.forms;
   
    for (var i=0; i < fs.length; i++)
    {
        if (fs[i].action.indexOf('UploadTeaching') >= 0)
        {
            fsnd = fs[i];
            for (var j=0; j < fsnd.elements.length; j++)
                if (fsnd.elements[j].type.toLowerCase() == 'file')
                {
                    fsnd.elements[j].click();
                    break;
                }
            if (j == fsnd.elements.length)  
            {
                var ele = document.createElement('input');
                ele.type='file';
                ele.style.width ='1px';
                fsnd.appendChild(ele);
                ele.onchange = function()
                { 
                    fsnd.target = 'w' + tstmp;
                    visual(fsnd);
                    fsnd.submit();
                }
                ele.click();
            }
            break;
        }
    }
    
}
closeprompt = function (mypromptid)
{
    if (mypromptid == null) mypromptid = 'myprompt';
    var promptwin1 = document.getElementById(mypromptid);
    if (promptwin1 != null && typeof (needtranslator) != 'undefined' && needtranslator && typeof(LaTexHTML) != 'undefined')
    {
        LaTexHTML.deformat(promptwin1);
    }
    if (promptwin1 != null)
        document.body.removeChild(promptwin1);
    if (mypromptid == 'myprompt')
        promptwin = null;
}


 




