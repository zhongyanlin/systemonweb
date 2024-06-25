var Sch =   
{
    
    schedulewindow : null,
    printbycid : false,
    allblocks : [],
    countblocks : 0,
    myHintx:0,
    myHinty:0,
    drawslot : false,
    drawingdiv : null,
    tblxy:[0,0],
    startx:0, 
    starty:0, 
    tblx:0, 
    tbly:0,
    tblcelli:0,
    tblcellj:0,
    err:'',
    alarm:null,
    news:'',
    findPositionnoScrolling: function(oElement, win)
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
    },
    printsch1 : function()
    {
        var tbl = document.getElementById('schblock');
        if (tbl!=null)
        {
            document.body.removeChild(tbl.parentNode);
        }
        var schtbl = document.createElement('div');
        document.body.appendChild(schtbl);
        schtbl.innerHTML = Sch.drawbase();
        Sch.schedulewindow = window;
        var arr = [];
        for (var i=0; i < numRows; i++)
        {
            arr[arr.length] = [mat[i][0], mat[i][1],mat[i][2],mat[i][3]];
        }
        Sch.marr = arr;
        Sch.printline(0);
       
    },
    
    printsch : function()
    {
        Sch.schedulewindow = window.open("", "_blank");
        //Sch.printschname( mat[0][4] + " " + textmsg[1738] );
        Sch.printschname( title.replace(textmsg[362],textmsg[1738]));
      
        var arr = [];
         
        for (var i=0; i < numRows; i++)
        {
           if (mat[i][10]==null)continue;
            
            var tslot = mat[i][10].split(/,/);
            
            for (var k=0; k < tslot.length; k++)
            { 
                arr[arr.length] = [tslot[k], mat[i][0] + "-" + mat[0][2] + '<br>' + mat[i][11]];
             
            }
        }
       
       arr[arr.length] = [mat[0][12],textmsg[554]];
       
       Sch.marr = arr;
        Sch.printline(0);
    },
    printline: function(i)
    {
        var brr = [];
        brr[0] = Sch.marr[i];
        Sch.drawblock(brr, "#FFFFFF");
        if (i+1 < Sch.marr.length)
           setTimeout("Sch.printline(" + (i+1) + ")",50); 
    },
    marr:null,
    cord: function()
    {
        var tbl = Sch.schedulewindow.document.getElementById('schblock');
        if (tbl!=null)
        {
            var h =  Sch.myHinty - Sch.starty+1;
            if (h <=0) 
            {
                if (Sch.drawingdiv!=null)
                Sch.schedulewindow.document.body.removeChild(Sch.drawingdiv);
                Sch.drawingdiv = null;
            }   
            if (Sch.drawingdiv!=null && h>0) 
                Sch.drawingdiv.style.height = h + 'px';
            if (Sch.drawingdiv!=null && Sch.drawingdiv.innerHTML=='')
            {
                var y = Math.round((Sch.myHinty - Sch.tbly)*5/3);
                var y1 = Math.floor(y/60);
                var y2 = y%60;
                tbl.rows[0].cells[0].innerHTML = (Sch.tblcelli+7+y1)+ ":" + y2;
            }
            else
            {
               var hr = Math.floor((Sch.myHinty-Sch.tblxy[1])/36);
               var mn = Sch.myHinty-Sch.tblxy[1] - hr*36;
               if (hr>=0)
                  tbl.rows[0].cells[0].innerHTML = (hr+7)+ ":" + Math.round(mn*5/3); 
               else
                  tbl.rows[0].cells[0].innerHTML = '';
            }
        }
    },
    
    onmouseover0 :(browserstr.indexOf('MSIE') > - 1)?
    function ()
    {
        Sch.myHintx = Sch.schedulewindow.event.clientX + Sch.schedulewindow.document.body.scrollLeft;
        Sch.myHinty = Sch.schedulewindow.event.clientY + Sch.schedulewindow.document.body.scrollTop;
        Sch.cord();
    }
    : function (e)
    {
        Sch.myHintx = e.pageX;
        Sch.myHinty = e.pageY;
        Sch.cord();
    },
   
    startdraw : function(td)
    {
        if (Sch.drawingdiv !=null) return;
        Sch.drawslot = true;
        var tbl = Sch.schedulewindow.document.getElementById('schblock');
        //var xy = findPositionWithScrolling(tbl, schedulewindow);
        for (var i=1; i < tbl.rows.length; i++)
        {   
            for (var j=0;j < tbl.rows[i].cells.length; j++)
                if (tbl.rows[i].cells[j] == td)
                {
                    break;
                }
            if (j < tbl.rows[i].cells.length) break;
        }
        Sch.tblcelli = i;
        Sch.tblcellj = j;
        var xy = Sch.findPositionnoScrolling(td, Sch.schedulewindow);
        Sch.starty = Sch.myHinty;
        Sch.startx = Sch.myHintx;
        Sch.tbly = xy[1];
        Sch.news = (i+7)+ ":" + Math.round((Sch.myHinty - Sch.tbly)*5/3);
        tbl.rows[0].cells[0].innerHTML = Sch.news;
       
        Sch.drawingdiv = Sch.schedulewindow.document.createElement('div');
        Sch.drawingdiv.style.cssText = "background-color:orange;border:1px #a0a020 outset;position:absolute;width:98px;height:1px;left:" 
                + (xy[0]) + "px;top:" + (Sch.myHinty) + 'px';
        Sch.schedulewindow.document.body.appendChild(Sch.drawingdiv);
        Sch.schedulewindow.document.onmouseup		=  Sch.enddrag;
    },
    saveaevent:function (evt,t)
    {
         var e = evt ? evt : Sch.schedulewindow.event;
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
          
            var x = Math.round( (new Date()).getTime()/1000);
           
            Sch.alarm.update([Sch.news,t.value,''+x, ''+x]);
            var nid = Sch.schedulewindow.document.getElementById('nextring');
            if (nid!=null) nid.innerHTML = Sch.alarm.timeat;
            Sch.schedulewindow.document.onmousemove = Sch.onmouseover0;
        }
        return true;
    },
    enddrag : function()
    {
        Sch.schedulewindow.document.onmousemove = null;
        Sch.drawingdiv.innerHTML = "<input type=text style=border:0px;width:97px;height:25px;background-color:orange onkeypress=\"return parent.frames[0].Sch.saveaevent(event,this)\">";
        Sch.drawingdiv.getElementsByTagName('input')[0].focus();
        Sch.schedulewindow.document.onmouseup = null;
        Sch.drawingdiv = null;
         
    },
    printschstudent : function ( )
    {
        var semestercode = document.form1.semestercode;
        var semestername = semestercode.options[semestercode.selectedIndex].text;
        Sch.printbycid = (typeof(coursesession) != 'undefined');
        if (Sch.schedulewindow==null || typeof(Sch.schedulewindow.document)=='undefined'
                || Sch.schedulewindow.document.getElementById('schblock')==null)
        {
            Sch.schedulewindow = window.open("", parent.frames[1].name);
            Sch.printschname( semestername + " " + textmsg[1053]);
             
            var x = [];
            for (var j=0; j < allcourseschs.length; j++)
            {
                x[x.length] = allcourseschs[j];
            }
            for (var j=0; j < schbysession.length; j++)
            {
                x[x.length] = schbysession[j];
            }
            Sch.marr = x;
            Sch.printline(0);
            Sch.schedulewindow.document.onmousemove = Sch.onmouseover0;
            var tbl = Sch.schedulewindow.document.getElementById('schblock');
            for (var i=1; i < tbl.rows.length; i++)
                for (var j=0; j < tbl.rows[i].cells.length; j++)
                    tbl.rows[i].cells[j].onmousedown = function(){Sch.startdraw(this);}
            Sch.tblxy = Sch.findPositionnoScrolling(tbl, Sch.schedulewindow);
        }
        else
        {
            for (var i=0; i < Sch.countblocks; i++)
            {
               if(Sch.allblocks[i]!=null && Sch.allblocks[i].parentNode == Sch.schedulewindow.document.body)
               Sch.schedulewindow.document.body.removeChild(Sch.allblocks[i]);
            }
           Sch.countblocks = 0;
           var x = [];
        
            for (var j=0; j < allcourseschs.length; j++)
            {
                x[x.length] = allcourseschs[j];
            }
            for (var j=0; j < schbysession.length; j++)
            {
                x[x.length] = schbysession[j];
            }
            Sch.marr = x;
            Sch.printline(0);
        }
        
        Sch.alarm = new Alarm(allcourseschs,timediff);
       
        Sch.alarm.nextone();
       
        var nid = Sch.schedulewindow.document.getElementById('nextring');
        if (nid!=null) nid.innerHTML = Sch.alarm.timeat;
        
    },
   
    printschbycid : (typeof(coursesession) == 'undefined')?null:
    function (index)       
    {
        
        var j = 0;
        var cid;
        for (; j < allcourseschs.length; j++)
        {
            if (allcourseschs[j][4] == index) 
                cid = allcourseschs[j][1].replace(/<br>.*/,'');
        }
        for (var i=0; i < Sch.countblocks; i++)
        {
            if(Sch.allblocks[i]!=null && Sch.allblocks[i].parentNode == Sch.schedulewindow.document.body)
            Sch.schedulewindow.document.body.removeChild(Sch.allblocks[i]);
        }
        Sch.countblocks = 0;
        var x = [];
        if (cid == null || cid == '')
        {
             
            
            for (var j=0; j < allcourseschs.length; j++)
            {
                x[x.length] = allcourseschs[j];
            }
            for (var j=0; j < schbysession.length; j++)
            {
                x[x.length] = schbysession[j];
            }
             
        }
        else
        {
         
            for (var j=0; j < allcourseschs.length; j++)
            {
                if (allcourseschs[j][1].indexOf(cid)==0)
                    x[x.length] = allcourseschs[j];
            }
            var iname =  mapping[cid];
 
          //  var y = [];
            for (var j=0; j < schbysession.length; j++)
            {
                if (schbysession[j][1].indexOf(iname)==0)
                    x[x.length] = schbysession[j];
            }
            
        }
        Sch.marr = x;
        Sch.printline(0);

    },
    drawbase:function ()
    {
        var ln = textmsg[1739].split(/@/);
        var str = "";
        var tod = (new Date()).getDay();
        str += ("<table  style=\"border-collapse:collapse;margin:0px 3px 0px 3px\" border=1 id=\"schblock\" >");
        str += ("<tr height=36><td width=60 ></td>");
        for (var j = 0; j < 7; j++)
        {
            if (tod==j) ln[j]= "<b>" + ln[j] + "</b>";
            str += ("<td class=bar width=100 align=center>" + ln[j] + "</td>");
        }
        for (var i = 0; i < 14; i++)
        {
            str += ("<tr height=36>");
            str += ("<td valign=top   class=bar>" + (8 + i) + ":00</td>");
            for (var j = 0; j < 7; j++)
            {
                str += ("<td clas=bar></td>");
            }
            str += ("</tr>");
        }
        str += ("</table>");
        return str;
    },
    printschname:function (str )
    {

        if (typeof (encoding) == 'undefined')
        {
            var x = document.getElementsByTagName('head')[0].innerHTML.toLowerCase();
            var ii = x.indexOf('charset=');
            if (ii > 0)
            {
                var jj = x.indexOf('"', ii + 8);
                var encoding = x.substring(ii + 8, jj);
            } else
                var encoding = "iso-5559-1";
        }
        Sch.schedulewindow.document.write("<!doctype html><html><head><title>" + textmsg[1738] + "</title><meta http-equiv=\"content-type\" content=\"text/html; charset=" + encoding + "\">");
        Sch.schedulewindow.document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\" /><style>div.block{background:" + gradientbg  + ";color:purple}\ntb.bar{background-color:yellow}</style><scr" + "ipt src=" + langcode + ".js ></scr" + "ipt></head><body>");
        Sch.schedulewindow.document.write("<table align=left width=776 cellspacing=4 cellpadding=4 ><tr><td style=\"padding:0px 0px 0px 0x\">" + unititle(str, 'outset2') + "</td></tr>");

        if ( Sch.printbycid && allcourseschs.length > 1)
        {
            Sch.schedulewindow.document.write("<tr><td align=center><select name=cid onchange=\"javascript:parent.frames[0].Sch.printschbycid(this.selectedIndex)\" >" + document.form1.course.innerHTML  + "</select><span id=nextring></span></td></tr>");
        }
         
        
         Sch.schedulewindow.document.write("<tr><td>" +  Sch.drawbase());

         Sch.schedulewindow.document.write("</td></tr></table>");
        // schedulewindow.document.write("<scr" + "ipt src=printschedule.js></scr" + "ipt><scr" + "ipt>drawblock();</scr" + "ipt>");
         Sch.schedulewindow.document.write("</body></html>");
          
    },

    drawblock : function ( arr, clr)
    {
         
        var dd = new Date();
        var sun0 = dd.getTime();
        sun0 -= dd.getDay()*24*3600000;
        sun0 -= dd.getHours()*3600000;
        sun0 -= dd.getMinutes()*60000;
        sun0 -= dd.getSeconds()*1000;

        var mp = new Array(), emp = new Array();
        var sn = textmsg[830].split(/|/);
        var esn = "UMTWRFS".split(/|/);
        for (var k = 0; k < 7; k++)
        {
            mp[sn[k]] = '' + k;
            emp[esn[k]] = '' + k;
        }

        var tbl = Sch.schedulewindow.document.getElementById('schblock');
        if (tbl == null)
        {
            return;
        }
        var L = [], W = [];
        for (var l = 0; l < 7; l++)
        {
            var xy = Sch.findPositionnoScrolling(tbl.rows[0].cells[l + 1], Sch.schedulewindow);
            
            if ( typeof(beheading)!='undefined')
            {
                
                tbl.rows[0].cells[0].style.backgroundImage = beheading;
                tbl.rows[0].cells[l + 1].style.backgroundImage = beheading;
            }
            else
            {
                tbl.rows[0].cells[0].style.backgroundColor = 'lightyellow';
                tbl.rows[0].cells[l + 1].style.backgroundColor = 'lightyellow';
            }
            L[l] = xy[0];
            W[l] = tbl.rows[0].cells[l + 1].offsetWidth - 1;
        }
        for (var l = 0; l < 14; l++)
            tbl.rows[1 + l].cells[0].style.backgroundColor = 'lightyellow';
        var X = xy[0] + 60;
        var Y = xy[1] + 30;

        for (var i = 0; i < arr.length; i++)
        {
            var  y0 = Sch.toMinute(arr[i][0]);
            if (y0 == null) continue;
            var endd = 1500000000000;
            var startd = -1;
            if (arr[i].length>2)
            {
                if (arr[i][2]!=null)
                try 
                {
                var ds = parseInt(arr[i][2])*1000;
                var x = new Date(ds );
                x.setHours(0);
                x.setMinutes(0);
                x.setSeconds(0);
                startd = x.getTime();
                if (startd<0) startd = 0;
                }catch(e){}
                if (arr[i][3]!=null)
                try{
                var de = parseInt(arr[i][3])*1000;
                x = new Date(de );
                x.setHours(23);
                x.setMinutes(59);
                x.setSeconds(59);
                endd = x.getTime();
                if (endd>=1500000000000) endd = 1500000000000;
                }catch(e){}
            }
            var w = y0.replace(/,$/, '').split(/,/);
            for (var j = 0; j < w.length; j++)
            {
                var c = w[j].charAt(0);

                var tt = mp[c];
                if (tt == null)
                    tt = emp[c];
                var n = parseInt(tt);
                if ('' + n == 'NaN')
                    continue;

                var z = w[j].substring(1).split(/:/);
                var x = n * 100 + X;
                var y = parseInt(z[0]);
                if ( y < 0) y += 12*36;
                var  y11 = parseInt(z[1]);
                if (y11 < 0) y11 +=  12*36;

                if (arr[i].length>2)
                {
                    var tm = sun0 + n*24*3600000;
                    var lm = tm + y*5/3*60000 +   8*3600000;
                    var um = tm + y11*5/3*60000 + 8*3600000;
                    if (''+startd!='NaN' && lm < startd || ''+endd!='NaN' &&  um > endd)
                    {
                        continue;
                    }
                }
                var h = y11 - y - 1;
                if (h < 25) h = 25;
                y += Y;

                var b = Sch.schedulewindow.document.createElement('div');
                b.style.color = "#DDCC11";
                b.style.backgroundImage = "linear-gradient(" + IBGCOLOR + "," + BBGCOLOR + ")";
                b.style.position = 'absolute';
                b.style.border = '1px #050505 solid';
                b.style.textAlign = 'center';
                if(h < 32)
                b.style.lineHeight = '85%';
                b.style.verticalAlign = 'middle';
                b.style.display = 'flex';
                b.style.alignItems = 'center';
                b.style.fontSize = '14px';
                b.style.fontWeight = '700';
                b.style.zIndex = 2;
                b.style.top = (y+5) + 'px';
                b.style.left = L[n] + 'px';
                b.innerHTML = '<div style="width:100%;text-align:center">' + arr[i][1] + '</div>';
                b.style.width = (W[n]) + 'px';
                b.style.height = h + 'px';
                Sch.schedulewindow.document.body.appendChild(b);
                Sch.allblocks[Sch.countblocks++] = b;
            }

        }
    },
     
    toMinute : function  (slot) // MWF 11:00am - 11:50 
    {
        if (slot.charAt(0).replace(/[0-9]/,'') == '') 
            slot = 'A' + slot;
        var r = new RegExp(/[0-9][0-9]?[ ]*:[ ]*[0-9][0-9]?/);
        var k = 0;
        var b = 0;
        if (slot.replace(/[0-9][0-9]/,'')==slot) return '';
        if (slot.replace(/[0-9][0-9]/,'').replace(/[0-9][0-9]/,'').replace(/[0-9][0-9]/,'') == slot.replace(/[0-9][0-9]/,'').replace(/[0-9][0-9]/,''))
        {
            slot = slot + "-" + slot.replace(/.*[^0-9]([0-9][0-9]?[ ]*:[ ]*[0-9][0-9]?).*/,"$1");

        }
        var digits1, digits2,digits3, digits, dstr, ans = "", before1, after1, days="",day0, letters; 
        while (true)
        {
            var m = r.exec(slot.substring(k));
            if (m == null)
            {
                before1 = slot.substring(k);
                digits3= digits1;
                day0 = days;
                digits1 = "";
                b++;
            } else
            {
                b++;
                var i = m.index + k;

                if (b % 2 == 1)
                {
                    digits3= digits1;
                    day0 = days;
                    digits1 = m.toString();
                    before1 = slot.substring(k, i);
                } else
                {
                    digits2 = m.toString();
                    after1 = slot.substring(k, i);
                }
                k += m.index + m.toString().length;
            }
            if (b % 2 == 1)
            {
                 before1 = before1.replace(/^[ ]+/,'');
                var apm2 = before1.toLowerCase();
                if (apm2.indexOf('pm') !=0 && apm2.indexOf('am') !=0)
                {
                    apm2 = '';
                    days = before1;
                } else
                {
                    days = before1.substring(2);
                }
            } 
            else
            {
                var apm1 = after1.toLowerCase();
            }
            if (b % 2 == 1 && b>1)
            {
                var digits = (digits3 + " " + digits2).replace(/([0-9][0-9]?)[ ]*:[ ]*([0-9][0-9]?)[^0-9]+([0-9][0-9]?)[ ]*:[ ]*([0-9][0-9]?).*/, "$1:$2:$3:$4").split(":");
                letters = day0;
                var apm = [apm1, apm2];
                var ln = textmsg[1739].split(/@/);
                var sn = textmsg[830].split(/|/);
                for (var l = 0; l < 7; l++)
                {
                    letters = letters.replace( ln[i] , sn[i]);
                }
                letters = letters.replace(/sunday/i, sn[0]).replace(/monday/i, sn[1]).replace(/tuesday/i, sn[2]).replace(/wednesday/i, sn[3])
                        .replace(/thursday/i, sn[4]).replace(/Friday/i, sn[5]).replace(/saturday/i, sn[6]).replace(/,/g, '').replace(/ /g, '');
                for (var i = 0; i < letters.length; i++) 
                {
                    var c = letters.charAt(i);
                    if (textmsg[830].indexOf(c)<0 && "AUMTWRFS".indexOf(c) < 0) continue;
                    //var  x = c == 'M' ? 1 : c == 'T' ? 2 : c == 'W' ? 3 : c == 'R' ? 4 : c == 'F' ? 5 : c == 'S' ? 6 : c == 'U' ? 0 : 7;
                    var x = 0;
                    if (digits.length != 4) {
                        Sch.err = "Invalid time format:" + slot + ". Use [UMTWRFS]hh:mm[am|pm]-hh:mm[am|pm]";
                        return null;
                    }
                    if (x == 7) {
                        Sch.err = "Invalid letter for day of a week:" + c;
                        return null;
                    }


                    var t = parseInt(digits[0].replace(/^0/, ""));
                    if (t > 23 ||  t < 0) {
                        Sch.err = "Invalid time format:" + slot + ". Use [UMTWRFS]hh:mm[am|pm]-hh:mm[am|pm]";
                        return null;
                    }
                    t -= 8;
                    if (t < 0) {
                        t += 12 ;
                    }
                    x += t * 60;

                    t = parseInt(digits[1].replace(/^0/, ""));
                    if (t >= 60) 
                    {
                        Sch.err = "Invalid time format:" + slot + ". Use [UMTWRFS]hh:mm[am|pm]-hh:mm[am|pm]";
                        return null;
                    }
                    x += t;

                    t = parseInt(digits[2].replace(/^0/, ""));
                    if (t > 23   || t < 0) {
                        Sch.err = "Invalid time format:" + slot + ". Use [UMTWRFS]hh:mm[am|pm]-hh:mm[am|pm]";
                        return null;
                    }
                    t -= 8;
                    if (t<0) {
                        t += 12 ;
                    }
                    var y = t * 60;
                    t = parseInt(digits[3].replace(/^0/, ""));
                    if (t >= 60) {
                        Sch.err = "Invalid time format:" + slot + ". Use [UMTWRFS]hh:mm[am|pm]-hh:mm[am|pm]";
                        return null;
                    }
                    y += t;

                    x *= 3 / 5;
                    y *= 3 / 5;
                    if (c=='A')
                    {
                        for (var j=0; j < 7; j++)
                        ans += "UMTWRFS".charAt(j) + Math.round(x) + ":" + Math.round(y) + ",";
                    }
                    else
                        ans += c + Math.round(x) + ":" + Math.round(y) + ",";
                }
            }

            if (digits1 == "")
                break;
        }

        return ans;    // 121203,34343,343435
    }
}
 var onloadbeforeprintsch = null;
 if (typeof window.onload == 'function')
   onloadbeforeprintsch = window.onload;
 var oldU = null;
 if (typeof(rdapname)!='undefined' && rdapname=='mysessionold')
 {
     captions[1][captions[1].length] =  textmsg[925];
     options[1][options[1].length] = "newsemester";
     
     window.onload = function()
     {
         if (onloadbeforeprintsch != null) 
             onloadbeforeprintsch();
         oldU = U;
         U = function(i,j)
         {
             for (var i=0; i < numRows; i++)
             {
                 var e = ele(i,1);
                 if (e.options[e.options.length-1].value == 'newsemester')
                     e.options[e.options.length-1] = null;
             }
             var e = ele(i,j);
             if (j==1 && e.options[e.options.length-1].value=='newsemester')
                 popfornew(i);
             else
                 oldU(i,j);
         }
     }
 } 
 var newsemestercode = 0;
 var newsemestername = 0;
 var newsemesteri = -1;
 function popfornew(i)
 {
     newsemesteri = i;
     var newse =  captions[1][1];
     var dn = new Date();
     newse = newse.replace(/[0-9]{4}/,''+(1901+dn.getYear()));
     myprompt(textmsg[1804] + ' ' + newse, newse,"takenewse(v)",textmsg[114]+" " + labels[1]);
 }
 function synsemester(v)
 {
     newsemestercode = v;
     if (newsemestercode==-1) 
     {
         popfornew(newsemesteri);
         return;
     }
     
     for (var i=numRows; i < NUMROWS; i++)
     {
         var e = ele(i,1);
         e.options[e.options.length-1].value = '' + v;
         e.options[e.options.length-1].text = newsemestername;
         if (newsemesteri==i)
             e.options.selectedIndex = e.options.length-1;
         else
             e.options.selectedIndex = 0;
                
     }
 }
 function takenewse(v)
 {
     postopen('follows.jsp',['orgnum1','x','newsemester'],[''+orgnum,'newsemester',v],'w'+tstmp);
     newsemestername = v;
 }
 
 


 


