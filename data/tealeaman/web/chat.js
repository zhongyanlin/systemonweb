function $(x) {return document.getElementById(x);}
const xmlhttp = new XMLHttpRequest();
var Chat = 
{
    securitytoken: '',
    fsnd: null,
    maintbl: null,
    tstmp: null,
    sid: null,
    sek:null,
    sname: null,
    befired: ",",
    inittopics: null,
    timeorder: 0,
    sessions: new Array(),
    updatemenu: true,
    supressnew: false,
    startedListen: false,
    current: null,
    allTopics:new Array(),
    butstyle: "type=button style=\"text-align:center;width:" + (Math.round(4.5 * fontsize)) + "px;text-valign:middle\" ",
    sentimg:null,
    swich: 0,
    changingid:'',
    changedcode: '',
    lastlisten: 0,
    formats: ['plain', 'html', 'latex'],
    activek: 0, 
    toolstr:new Array(),
    needmore:true,
    data:[],
    tt2i: function(t)
    {
        var session = Chat.bytopic(Chat.trim(t));
        if (session != null)
        {
            return session.tid;
        }
        return null;
    },
    init: function(sek, sid1, sname1, token, init0)
    {
        Chat.securitytoken = token;
        Chat.sek = sek;
        Chat.sid = sid1;
        var device = "windows";
        try{
            device = navigator.userAgentData.platform;
        }catch(e){}
        Chat.sname = sname1 + "-" + device;
        Chat.inittopics = (init0 == null || init0 == '') ? [] : Chat.trim(init0).split(/[ ]*,[ ]*/);
        var tbl = document.getElementById("maintbl");
        if (tbl == null)
        {
            tbl = document.createElement("table");
            tbl.id = "maintbl";
            tbl.border = '0';
            var r = tbl.insertRow(-1);
            var c = r.insertCell(-1);
            c.width = 200;
            var s = "<div class=titlecell>Topics of Online Meeting</div><br><table id=menu>";
            for (var i = 0; i < this.inittopics.length; i++)
                s += "<tr><td> </td><td onclick=Chat.start(this) style=\"border:1px #b0b0b0 outset; background-color:#00BBBB;color:white;overflow:hidden\"><nobr>" + Chat.inittopics[i] + "</nobr></td><td >(0)</td></tr>";
            s += "<tr><td></td><td><input name=newt size=25 value=\" Enter New Topic \"></td><td style=\"border:1px;background-color:#00BBBB;color:white;outset\" onclick=Chat.start(this)>Go</td></tr>";
            s += "</table><br><br><div class=titlecell>Myself: " + Chat.sek + " " + Chat.sname + "</div>";
            document.body.appendChild(tbl);
            c.vAlign = 'top';
            c.innerHTML = s;
        }
        Chat.maintbl = tbl;
    },
    infired: function(topic)
    {
        var i = Chat.tt2i(topic);
        if (i == null)
            return false;
        return Chat.befired.indexOf("," + i + ",") >= 0;
    },
    ismycourse: function(topic)
    {
        if (Chat.inittopics != null)
            for (var i = 0; i < Chat.inittopics.length; i++)
            {
                if (Chat.inittopics[i] == topic || 
                        Chat.inittopics[i].includes(topic) || 
                        topic.includes(Chat.inittopics[i]))
                {
                    return true;
                }
            }

        return false;
    },
    trim: function(x)
    {
        if (x == null || x == '' || typeof x != 'string')
            return x;
        var i = 0;
        while (i < x.length && (x.charAt(i) == '\n' || x.charAt(i) == ' ' || x.charAt(i) == '\r'))
            i++;
        var j = x.length - 1;
        if (i > j)
            return '';
        while (j > i && (x.charAt(j) == '\n' || x.charAt(j) == ' ' || x.charAt(j) == '\r'))
            j--;
        if (i >= j + 1)
            return '';
        
        x = x.substring(i, j + 1);
        x = x.replace(/<[^>]+>/g, '');
        x = x.replace(/&amp;/g,'&');
        return x;
    },
    viewinfo: function(td)
    {
        var s = td.innerHTML;
        var j = s.indexOf("<" + "!--");
        var n = s.substring(0, j).replace(/[^0-9]/g, '');
        s = s.substring(j + 4, s.length - 3);
        var m = new Message(s);
        parent.frames[1].myprompt("Topic/Session:" + m.msg + "<br>" + "Order:" + m.tid + "<br>Initiative:" + m.sname + "<br>Members:" + n);
    },
    updatetopicnp: function(topic, n, s)
    {
        
        if (Chat.updatemenu == false)
        {
            if (parent != self && typeof(parent.frames[0].updatechatnums) != 'undefined')
                parent.frames[0].updatechatnums(topic, n);
            return;
        }
        var tbl = parent.frames[0].document.getElementById("menu");
        if (tbl == null || tbl.tagName.toLowerCase() != 'table')
            return;
        topic = Chat.trim(topic);
        let i = 0;
        for (i = 0; i < tbl.rows.length; i++)
        {
            var ts = tbl.rows[i].cells[1].innerHTML;
            ts = Chat.trim(ts);
            
            if (ts == topic || topic.length>20&&ts.includes(topic) || ts.length>20&&topic.includes(ts))
            {
                break;
            }
        }
        let notcourse = !Chat.ismycourse(topic);
        if (i < tbl.rows.length && typeof parent.frames[0].modifycell == 'function')
            parent.frames[0].modifycell(i,n,s,notcourse); 
        if (i == tbl.rows.length && (Chat.supressnew == false || parent.frames[0].lastnew() == topic))
        {
            var r = tbl.insertRow(-1);
            var c = r.insertCell(-1);
            c.aLign = 'center';
            c.vAlign = 'middle';
            if (parent.frames[0].lastnew() != topic)
                c.innerHTML = '<img src=image/delete.png width="' + (20) + "\" height=\"" + (20) + "\" style=cursor:pointer; onclick=\"this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode)\">";
            else
                c.innerHTML = "<img src=image/tri.gif >";
            var c1 = r.insertCell(-1);
            c1.aLign = 'left';
            c1.vAlign = 'middle';
            c1.innerHTML = "<div  style=\"text-align:left;width:" + (parent.frames[0].thispagewidth() - 90) + "px;overflow:hidden;color:white\" onclick=javascript:starttalk1(this)><nobr>" + topic + "</nobr></div>";
            let c2 = r.insertCell(-1);
            c2.style.cssText = "color:white";
            c2.aLign = 'left';
            c2.vAlign = 'middle';
            c2.id = 'count'+ i;
            if (s != null)
            {
                c2.innerHTML = "(" + n + ")<!--" + s + "-->";
                c2.onclick = function()
                {
                    parent.frames[1].Chat.viewinfo(this);
                }
            }
            else
            {
                c2.innerHTML = "(" + n + ")";
            }

        }
    },
    setSupress: function(a)
    {
        Chat.supressnew = a.checked;
       
    },
    setfmt: function()
    {
        Chat.current.setformat(editingfmt);
    },
    getElementByNameId: function(td, nm)
    {
        if (td.name == nm || td.id != null && td.id.indexOf(nm) == 0)
        {
            return td;
        }
        for (var j = 0; j < td.childNodes.length; j++)
        {
            var e = td.childNodes[j];
            var t = Chat.getElementByNameId(e, nm);
            if (t != null)
                return t;
             
        }
        return null;
    },
    resizedo: function(td, dx, dy)
    {
         
        var r = Chat.getElementByNameId(td, 'recev');
        var k = parseInt(r.id.replace(/[^0-9]+/, ''));
         
        var t = Chat.getElementByNameId(td, 'localpath');
        if (t == null)
        {
           if (dy != 0) r.style.height = (r.offsetHeight + dy) + 'px';
           if (dx != 0) r.style.width = (r.offsetWidth  + dx) + 'px';
           return;
        }
        
        if (dx != 0  )
        {
             
            r.style.width = "71px";
            //t.style.width = '1px';
           // t.size = "1";

            t = Chat.getElementByNameId(td, 'msg');
            if (t != null)
            {
                t.style.width = (t.offsetWidth + dx) + 'px';
            }
        }

        if (r == null)
            return;
        if (dy != 0)
        {
            r.style.height = (r.offsetHeight + dy) + 'px';
        }
       
        Chat.byorder(k).fit();
        r.style.width = "100%";
         
    },
    resizeiframe: function(td, dx, dy)
    {
        var p = td.parentNode.parentNode;
        if (p.tagName.toLowerCase() != 'table')
        {
            p = p.parentNode;
        }
        p = p.parentNode;

        var r = Chat.getElementByNameId(td, 'ifr');

        if (dx != 0)
        {
            var x = parseInt('' + r.width) + dx;
            r.width = x;
            td.getElementsByTagName('table')[0].rows[0].cells[1].style.width = (x - 22) + 'px';
            td.getElementsByTagName('table')[0].rows[0].cells[1].width = x - 22;
            td.getElementsByTagName('table')[0].rows[1].cells[0].width = x + 2;
            td.getElementsByTagName('table')[0].width = x + 2;
            td.width = x + 2;
            p.style.width = (x + 2) + 'px';
        }
        if (dy != 0)
        {
            var y = parseInt('' + r.height) + dy;
            r.height = y;
            td.getElementsByTagName('table')[0].rows[1].height = y + 2;
            p.style.height = (y + 32) + 'px'
        }
    },
    makecell: function(topic, subdb, k)
    {
        var tbl = Chat.maintbl;
        if (tbl == null) {
            return -1;
        }
        var c;

        if (k != null)
        {
            c = document.getElementById("c" + k);
        }
        else
        {
            c = tbl.rows[0].insertCell(-1);
            k = (Chat.timeorder++);
            c.id = "c" + k;
            c.aLign = 'enter';
            c.vAlign = "top";
        }

        var v = "";
        for (var j = 8; j < 42; j += 2)
        {
            if (Math.floor(fontsize / 2 - j / 2) == 0)
                v += "<option value=" + j + " selected>" + j + "</option>";
            else
                v += "<option value=" + j + ">" + j + "</option>";
        }


        var statstr = textmsg[1304].split(/@/);
        var statoption = '';
        for (var q=0; q < 3; q++)
            statoption += "<option value=\"" + statstr[q] + "\">" + statstr[q] + "</option>";
        var fs = Math.round(4.5 * fontsize);  
        
        c.innerHTML = round1('') + "<table   border=0  class=outset1><tr><td class=titlecell align=center>" + unititle(topic, 'outset2').replace(/style="/, "style=\"text-shadow:#707070 1px -1px;") + "</td></tr>"
                + "<tr><td><form rel=opener name=\"t" + k + "\" style=\"margin:0px 0px -2px 0px\"  > "
                + "<TABLE   border=0 class=outset1  align=center width=100% cellpadding=0 cellspacing=0>"
                + "<TR><TD   valign=TOP aling=center>"
                + "<textarea id=tmsg" + k + "  name=msg onfocus=\"Chat.setcurrent(" + k + ");onlinetoolbarfollow(this)\" onkeypress=\"return mkstrike1(this,event)\"  onblur=Chat.setfmt()>"
                + "</textarea> </td> <td valign=top align=center id=act" + k + "><table align=center border=0  width=100% cellpadding=0   style=\"margin:0px 0px 0px 0px;display:block;background:white;border:1px #b0b0b0 outset;border-radius:4px;border-collapse:collapse\" cellspacing=0 cellpadding=0 valign=top >"
                + "<tr><td colspan=2   width=100%  align=center id=timeout" + k + "  >0h0':0\"</td></tr>"
                + "<tr><td colspan=2   width=100%  align=right><select  style=\"width:" + Math.round(4.5*fontsize-10) + "px;background-color:white;border:0px\" name=status onchange=Chat.changestatus(" +   k + ",this)>" + statoption + "</select></td></tr>"
                + "<tr><td align=left valign=middle  id=cls" + k + " style=\"width:" + (fontsize+4) + "px;color:blue;cursor:pointer;font-family:arial;font-weight:bold;font-size:" + (fontsize-1) + "px;text-align:center;border:0px\" onclick=Chat.selColor(" + k +",this)>A<!--5--></td><td align=right valign=middle><select name=fontsize style=\"background-color:white;border:0px\"  onclick=Chat.setfs(" + k + ",this)>" + v + "</select></td></tr>"
  /*            
   * 
   * 
   * 
                + "<tr><td valign=middle><input class=radio type=radio name=fmt value=0></td><td align=left><div style=width:" + (Math.round(4.5 * fontsize - 15)) + "px;overflow:hidden>" + textmsg[83] + "</div></td></tr>"
                + "<tr><td valign=middle><input  class=radio  type=radio name=fmt value=1> </td><td align=left>HTML</td></tr>"
                + "<tr><td valign=middle><input  class=radio  type=radio name=fmt value=2> </td><td align=left>LaTex</td></tr>"
*/      
                         
                
                + "</table><div style=height:5px;width:40px;display:block></div><table cellpadding=0 cellspacing=0><tr><td valign=top><input   type=hidden name=fmt value=0><input name=keeplong type=checkbox onclick=\"javascript:Chat.fsnd.keeplong.value=this.checked;\"></td><td style=font-size:" + (fontsize>9?9:fontsize) + "px;width:" + Math.round(4.5*fontsize-15) + "px>" + textmsg[1740] + "</td></tr><tr><td colspan=2><input   " + Chat.butstyle.replace(/"/,'"height:' + Math.round(2.5*fontsize) + 'px;border-radius:4px;') + "  class=OrangeButton  align=right  onclick=Chat.send(" + k + ") value=\"" + textmsg[223] + "\"></td></tr></table>"
                + "</td></tr></TABLE></form></td></tr>"
                + "<tr><td><form style=\"margin:0px 0px 0px 0px\" name=\"f" + k + "\" method=post target=\"" + self.frames[0].name 
                + "\" enctype=multipart/form-data action=\"UploadComm\" >"
                + "<input type=hidden name=subfolder value=\"chat\">"
                + "<input type=hidden name=sek value=\"" + Chat.sek + "\">"
                + "<input type=hidden name=securitytoken value=\"" + Chat.securitytoken + "\">"
                + "<input type=hidden name=MaxUploadSize value=4>"
                + "<input type=hidden name=subdb  value=\"" + subdb + "\" >"
                + "<table align=left width=100% border=0 cellpadding=0 class=outset3 style=\"border:1px #b0b0b0 outset;border-radius:2px;\" cellspacing=0 valign=top ><tr>"
                + "<td  align=left><table width=200 border=0  cellpadding=0 cellspacing=0 ><tr><td><input  " + Chat.butstyle + "   class=RedButton  name=b" + k 
                + " onclick=\"Chat.savetodb("+k+");Chat.endsession(" + k + ")\" value=\"" + textmsg[1270] + "\"></td>"
                + "<td align=right><input  name=memberbtn  " + Chat.butstyle + "   class=GreenButton    onclick=Chat.particip(" + k + ",this) value=\"" + textmsg[1271] + "\"></td>"  
                + "<td align=right><input  name=history  " + Chat.butstyle + "   class=GreenButton     onclick=Chat.loadfromdb(" + k + ") value=\"" + textmsg[988] + "\"></td>"        
                + "<td  colspan=2  align=right><input  " + Chat.butstyle + "   class=GreenButton   name=help" + k + "  onclick=Chat.status(" + k + ") value=\"" + textmsg[455] + "\"></td>"
               // + "<td align=right><input  " + Chat.butstyle + "   class=GreenButton    onclick=Chat.startuml(" + k + ") value=\"" + textmsg[1269] + "\"></td>"
                + "<td align=right><input  name=attachf  " + Chat.butstyle + "   class=GreenButton     onclick=\"this.form.localpath.click()\" value=\"" + textmsg[779] + "\"></td>"
                + "</tr></table></td><td id=localpat" + k + " align=right><input name=localpath type=file onchange=\"clickedhere(this);Chat.sendFileNow(" + k + ")\"  style=\"width:1px;visibility:hidden\" >    </td>"
                
                + "</tr></table></form></td></tr>"

                + "<tr><td align=left><div   id=\"recev" + k + "\" style=\"text-align:left;overflow:scroll;width:100%;height:" + fvwidth + "px;font-size:" + fontsize + "px;border:1px #b0b0b0 solid;border-radius:3px\"></div></td></tr></table>" + round2;
        unifonts(c,myfontname);
        return k;
    },
     
    expire : function()
    {
        var session = Chat.byorder(Chat.activek);
        var xx = session.msg.value;
        session.msg.value = "";
        Chat.sendfm(">>>expire1"); 
        session.msg.value = xx;
    },
    status : function(k)
    {
        var session = Chat.byorder(Chat.activek);
        if (session!=null)
        {
            var xx = session.msg.value;
            session.msg.value = "";
            Chat.post(new Message(session.tid, Chat.sek, Chat.sname, null, "snap", ""));
            session.msg.value = xx;
        }
    },
    loadfromdb : function (k, err, l0, l1)
    {
       Chat.activek = k;
       if (l1 ==null) l1 =   ~~( (new Date()).getTime()/1000);
       if (l0 == null) l0 = '' + (l1 - 30*24*3600);
       
       document.form3.starttime.value =  ''+  l0;
       document.form3.endtime.value =  ''+ l1;
       if (err==null) err =    textmsg[246] + " " + timeformat ;
       myprompt(err ,  timestr(document.form3.starttime.value) + " ~ " + timestr(document.form3.endtime.value), "Chat.loadfromdb1(v)", textmsg[36]);
       var f = Chat.formbyname("f" + k);
       var xy = findPositionnoScrolling(f.history);
       promptwin.style.top = (xy[1] + 30) + 'px';
       promptwin.style.left = (xy[0] - Math.round(promptwin.offsetWidth/2-35)  ) + 'px';
   },
   loadfromdb1 : function (v)
   {
        
       var k = Chat.activek;
       var xs = v.replace(/[ ]+/g,' ').split(/[ ]*~[ ]*/);
     
       if (xs.length != 2)
       {
          Chat.loadfromdb(k, textmsg[75] + " " +  timeformat  , document.form3.starttime.value, document.form3.endtime.value);
          return;
       }
       var l0 = parseTime(xs[0]);
       var l1 = parseTime(xs[1]);
       var good = false;
       if (l0 == invalidtimevalue && l1 != invalidtimevalue)
       {
          Chat.loadfromdb(k, textmsg[75] + " " +  timeformat  , document.form3.starttime.value, l1);
       }
       else if (l0 != invalidtimevalue && l1 == invalidtimevalue)
       {
          Chat.loadfromdb(k,textmsg[75] + " " +  timeformat  , l0, document.form3.endtime.value);
          
       }
       else if (l0 == invalidtimevalue && l1 == invalidtimevalue)
       {
          Chat.loadfromdb(k, textmsg[75] + " " +  timeformat  , document.form3.starttime.value, document.form3.endtime.value);
       }
       else
       {
           good = true;
       }
       if (!good)
       {
           return;
       }
       let starttime = l0;
       let endtime = l1;
       var session = Chat.byorder(k);
       if (session!=null)
       for (let s of Chat.data[session.tid])
       {
           let m = new Message(s);
           if (m.time <= l1 && m.time >= l0)
           {
              let cd = m.code == 'plain'? 0 :(m.code == 'html'?1:2);
              Chat.write(m, session, cd);
           }
       }
    },
    changeTime : function(tv, ele)
    {
        var xx = parseTime(tv);
        if (xx == invalidtimevalue)
        ele.value = xx;
    },
    insertHistory : function (str)
    {
        if (str.replace(/ /g, '') =='') return;
        var session = Chat.byorder(Chat.activek);
        var d = session.recev;
        var oldr = document.getElementById("oldrecords" + Chat.activek);
        if (oldr!=null)
        {
            oldr.parentNode.removeChild(oldr);
        }
        var v = document.createElement("div");
        v.id = "oldrecords" + Chat.activek;
        v.innerHTML = str + "<!-- -->";
        if (d.innerHTML.replace(/ /g, '') == '')
        {
            d.appendChild(v);
            displaylatex(d);
        }
        else
        {
            d.insertBefore(v, d.childNodes[0]);
            displaylatex(v);
        }
    },
    deletepics : function(dv, vt)
    {
        if (dv == null || typeof(dv.tagName) == 'undefined'||dv.tagName == null ) 
            return;
       
        if (dv.tagName.toLowerCase() == 'img')
        {
            vt[vt.length] = dv.alt + '@' + dv.src.replace(/.*&t=/, '') + "@" + dv.id;
            dv.src = '';
            return;
        }
        
        for (var i=0; i <  dv.childNodes.length; i++)
            Chat.deletepics(dv.childNodes[i],vt);
    },
    
    savetodb : function(k)
    {
        var mtb = document.getElementById('mobiletoolbar');
        if (mtb!=null) mtb.parentNode.removeChild(mtb);
        var session = Chat.byorder(k);
        if (session!=null)
        localStorage[session.topic] = JSON.stringify(Chat.data[session.tid]); 
    },
    sendFileNow : function(k)
    {
        if (ResizeUploaded.active == false)
        {
            var session = Chat.byorder( k);
            Chat.changingid = '';
            ResizeUploaded.alluploaded = '';
            ResizeUploaded.attachref.value = "";
            var f = Chat.formbyname("f" + k);
            formnewaction(f);
            f.subdb.value = session.iid;
            
           visual(f);
 f.submit();
        }
        else 
        {
            ResizeUploaded.active =false;
            myprompt('Complete resize before sending another one');
        }
    },
    getThisColor : function(k, j, cl)
    {
        document.getElementById("cls" + k).innerHTML = "A<!--" + j + "-->";
        document.getElementById("cls" + k).style.color = cl;
        document.body.removeChild(document.getElementById("selcolor" + k));
        Chat.activek = k;
        var session = Chat.byorder(Chat.activek);
        if (session.msg.value == '')
           Chat.sendfm("!mycolor:" + cl);
    },
    selColor: function(k, div)
    {
        var h = div.offsetHeight;  
        var xy = findPositionnoScrolling(div);
        var w = document.createElement('div');
        var y = div.innerHTML.replace(/[^0-9]/g,'');
        var alcs = "red,orange,yellow,green,black,blue,purple".split(/,/);
        w.id = "selcolor" + k;
        var x = '<table cellpadding=0 cellspacing=0>';
        var i = 0;
        for (var j=0; j < alcs.length; j++)
        {   
            if (y == ''+j) i = j;
            x += "<tr height=" + h + "><td onclick=Chat.getThisColor(" + k + "," + j + ",'" + alcs[j] + "') bgcolor=" + alcs[j]  + " width=" + div.offsetWidth + ">&nbsp;</td></tr>";
            
        }
        w.style.cssText = 'position:absolute;z-index:10;border:1px #b0b0b0 outset;top:' + (xy[1] - i*h) + 'px;left:' + xy[0] + 'px';
        w.innerHTML = x + '</table>';
        document.body.appendChild(w);
        
    },
    setfs: function(k, sel)
    {
        var session = Chat.byorder(k);
        if (session!=null && session.recev!=null)
        {
            session.recev.style.fontSize = sel.options[sel.selectedIndex].value + 'px';
            for (let v of session.recev.getElementsByTagName('div'))
            {
                v.style.fontSize = sel.options[sel.selectedIndex].value + 'px';
            }
        }
    } ,
     tailaction: function(s)
    {
        let t = (new Date()).getTime();
        if (s.includes("?time="))
            return s.replace(/[0-9]+$/,''+t);
        return s + "?time=" + t;
    },
    startuml: function(k)
    {
        var bar = document.getElementById('tosmall');
        if (bar!=null) onlinetoolmini(bar);
        var session = Chat.byorder(k);
        session.startuml(true);
        var r = document.getElementById('mobiletoolbar');
        if (r!=null) 
            r.style.visibility = 'hidden';
    },
    start: function(td)
    {
        var topic = null;
        if (td == null)
            return;
        if (typeof(td.innerHTML) == 'undefined')
        {
            topic =td;
        }
        else if (td.innerHTML == 'Go' || td.innerHTML == 'Init' || td.innerHTML == 'Start')
        {
            topic = td.parentNode.childNodes[1].getElementsByTagName("input")[0].value;
            td.parentNode.childNodes[1].getElementsByTagName("input")[0].value = 'Enter New Topic';

        }
        else
        {
            topic = td.innerHTML;
        }
        topic = Chat.trim(topic);
        if (Chat.infired(topic))
            myprompt("You probably can not join  this topic meeting until the organizer of this net meeting gives a permission. But you can go ahead to try anyway");
        Chat.post(new Message(null, null, null, null, 'new', topic));
    },
    //newtopic:'',
    elebyname: function(f, nm)
    {
        for (var i = 0; i < f.elements.length; i++)
        {
            if (f.elements[i].name == nm)
                return f.elements[i];
        }
        return null;
    },
    fele: function(nmk, nm)
    {
        var f = Chat.formbyname(nmk);
        if (f == null)
            return null;
        return Chat.elebyname(f, nm);
    },
    formbyname: function(nm)
    {
        for (var i = 0; i < document.forms.length; i++)
        {
            if (document.forms[i].name == nm)
                return document.forms[i];
        }
        return null;
    },
    clearfile: function(k)
    {
        var fl = document.getElementById('localpat' + k);
        if (fl != null)
        {
            var len = fl.offsetWidth;
            fl.innerHTML = "<input name=localpath type=file  onchange=\"clickedhere(this);Chat.sendFileNow(" + k + ")\"  style=\"width:1px;visibility:hidden\" >";
         }
    },
   
    sendfm: function(msg)
    {
        var session = Chat.byorder(Chat.activek);
        session.setformat(1);
        session.msg.value += msg;
        Chat.send(Chat.activek);
    },
    
    send: function(k)
    {
        Chat.activek = k;
        var v = (new Date()).getTime();
        var session = Chat.byorder(k);
        session.msg = $('tmsg' + k);
        var t = session.getformat();
        
        t = guessFormat(session.msg.value);
        if (t == 2)
        {
            session.msg.value = session.msg.value.replace(/\$\$([^\$]+)\$\$/g, "$$$$ $1 $$$$")
                  .replace(/\$\$([^\\]+\\$[^\$]+)\$\$/g, "$$$$ $1 $$$$")
                  .replace(/\$([^\$]+)\$/g, "$$ $1 $$")
                  .replace(/\$([^\\]+\\$[^\$]+)\$/g, "$$ $1 $$");  
        }
        if (session.msg.value.indexOf('<img ')>=0)
            t = 1;
        session.printfmt = t;
        var mycl = document.getElementById("cls" + k).style.color;
        if (session.msg.value != '')
        {
            if (session.msg.value.indexOf('!mycolor:')==0 ||  session.msg.value.indexOf('!updatepic:')==0 || session.msg.value.indexOf('!deletepic:')==0) 
            {
                t = 0;
            }
            
            var m = new Message(session.tid, Chat.sek, Chat.sname, session.tosends(), Chat.formats[t], session.msg.value);
            session.msg.value = '';
            editingfmt = 0;
            session.setformat(0);
            closeprompt();
            Chat.post(m);
        }
    },
    
    changestatus: function(k, sl)
    {
        var session = Chat.byorder(k);
        Chat.post(new Message(session.tid, Chat.sek, Chat.sname, null, 'status', sl.selectedIndex));
    },
    endsession: function(k)
    {
        var session = Chat.byorder(k);
        if (session == null)
            return;
        if (session.state == 'normal')
            Chat.post(new Message(session.tid, Chat.sek, Chat.sname, null, "unsubs", ""));
        else
        {
            session.state = 'closed';
            session.delanchor();
            Chat.delsbytid(k);
            var c = session.cell;
            c.parentNode.removeChild(c);
            delete Chat.allTopics[session.tid];
        }
    },
    checkall: function(td)
    {
        var tbl = td.parentNode.parentNode.parentNode;
        if (tbl.tagName.toLowerCase() != 'table')
            tbl = tbl.parentNode;
        var chk = td.checked;
        for (var i = 0; i < tbl.rows.length - 1; i++)
            tbl.rows[i].cells[0].childNodes[0].checked = chk;
    },
    add: function(s)
    {
        for (var i = 0; i < Chat.sessions.length; i++)
            if (Chat.sessions[i] == null)
            {
                Chat.sessions[i] = s;
                return;
            }
        Chat.sessions[ Chat.sessions.length] = s;
    },
    lookup: function(s)
    {
        for (var i = 0; i < Chat.sessions.length; i++)
            if (Chat.sessions[i] == s)
                return i;
        return -1;
    },
    byorder: function(k)
    {
        for (var i = 0; i < Chat.sessions.length; i++)
            if (Chat.sessions[i] != null && Chat.sessions[i].order == k)
            {
                return Chat.sessions[i];
            }
        return null;
    },
    delsbytid: function(k)
    {
        for (var i = 0; i < Chat.sessions.length; i++)
            if (Chat.sessions[i] != null && Chat.sessions[i].order == k)
            {
                Chat.sessions[i] = null;
                break;
            }
    },
    bytopic: function(t)
    {
        for (var i = 0; i < Chat.sessions.length; i++)
            if (Chat.sessions[i] != null && Chat.sessions[i].topic == t)
                return Chat.sessions[i];
        return null;
    },
    bytid: function(t)
    {
        for (var i = 0; i < Chat.sessions.length; i++)
            if (Chat.sessions[i] != null && ''+Chat.sessions[i].tid == ''+t)
                return Chat.sessions[i];
        return null;
    },
    moveto: function(btn, k)
    {
        var xy = findPositionnoScrolling(btn);
        var sel = Chat.byorder(k).tosends();
        if (sel == '')
            return;
        for (var j = 0; j < Chat.timeorder; j++)
        {
            var z = document.getElementById("c" + j);
            if (z == null)
                continue;
            var p = findPositionnoScrolling(z);
            var x = p[0];
            var y = p[1];
            var w = z.offsetWidth;
            var h = z.offsetHeight;
            if (j != k && xy[0] >= x && xy[1] >= y && xy[0] <= x + w && xy[1] <= y + h)
            {

                myprompt(textmsg[1348] + Chat.byorder(j).topic + "?", null, "Chat.move(" + k + ",'" + sel + "'," + j + ")", "Join Meeting");
                return;
            }
        }
        myprompt(textmsg[1349]);

    },
    move: function(k, s, j)
    {
        var session = Chat.byorder(k);
        var ttid = Chat.byorder(j).tid;
        Chat.post(new Message(session.tid, Chat.sek, Chat.sname, s, "move", ttid));
    },
    particip: function(k, btn)
    {
        var xy = findPositionnoScrolling(btn);
        Chat.byorder(k).panel([xy[0] - 240, 50],k);
        promptwin.style.top = (xy[1] + 30) + 'px';
        promptwin.style.left = (xy[0] - Math.round(promptwin.offsetWidth/2-35)  ) + 'px';
    },
    delpanel: function(td)
    {
        var v = document.getElementById("p" + td);
        if (v != null)
            document.body.removeChild(v);
    },
    updatebuddy: function(m)
    {
        var y = Chat.bytid(m.tid).member;
        var j = -1;
        for (var i = 0; i < y.length; i++)
            if (y[i][0] == m.sid)
            {
                j = i;
                y[i][2] = msg1119;
                y[i][1] = m.sname;
                 
                if (m.msg.indexOf('!mycolor:') == 0)
                {
                    y[i][4] = m.msg.substring(9);
                }
                break;
            }
        Chat.timer(m);
        if (j>=0) 
        return y[j][4];
        return 'blue';
    },
    pad: function(i)
    {
        //if (i < 10)   return "0" + i;
        return "" + i;
    },
    ifallset : function(tid,j) 
    {
        var session = Chat.bytid(tid);
        var i = 0;
        for (var k=0; k < session.member.length; k++)
            if  (session.member[k][j] == 'checked') i++;
        if (i == session.member.length) return 'checked';
        return '';
    },
    mark:function (tid, ck, k, j)
    {
        var session = Chat.bytid(tid);
        if (k == -1)
        {   
            var tbl = document.getElementById('p' +  tid);
           
            for (k=0; k < session.member.length; k++)
            { 
               session.member[k][j] = ck.checked?'checked': '';
               for (var i = 1; i < tbl.rows.length; i++)
               {
                   tbl.rows[i].cells[j-4].childNodes[0].checked = ck.checked;
               }
            }
        }
        else session.member[k][j] = ck.checked?'checked': '';
    },
    fire: function(td, tid)
    {
        var sel = Chat.bytid(tid).tosends();
        if (sel != '')
        {
            Chat.bytid(tid).fired(sel[0]);
            Chat.post(new Message(tid, Chat.sek, Chat.sname, sel, "fire", ""));
        }
        
    },
    updateb: function(td, tid)
    {
        var sel = Chat.bytid(tid).tolistens();
        Chat.post(new Message(tid, Chat.sek, Chat.sname, sel, "listen", ""));
    },
    block: function(td, tid)
    {
        var sel = Chat.bytid(tid).tosends();
        Chat.bytid(tid).blocked(sel);
        Chat.post(new Message(tid, Chat.sek, Chat.sname, sel, "block", ""));
    },
    timer: function(m)
    {
        var s = Chat.bytid(m.tid);
        if (s == null)
            return;

        var v = document.getElementById("timeout" + s.order);
        if (v != null)
        {   
            v.innerHTML = Chat.timeform("t", s.time);
        }
    },
    timeform: function(c, x)
    {
        var d = new Date();
        if (c == 't')
        {
            var c1 = 'h', c2 = "'", c3 = "\"";
            var n = Math.round((d.getTime() - x) / 1000);
            var s = Chat.pad(Math.round(n / 3600)) + c1
                    + Chat.pad(Math.round((n % 3600) / 60)) + c2
                    + Chat.pad(Math.round(n % 60)) + c3;
        }
        else
        {
            s = Chat.pad(d.getMonth() + 1) + "/" + Chat.pad(d.getDate()) + " "
              + Chat.pad(d.getHours()) + ":" + Chat.pad(d.getMinutes()) + ":" + Chat.pad(d.getSeconds());
        }
        return s;

    },
    write: function(m, session, fmt)
    {
        if (session == null)
            return;
        if (m.sid == Chat.sek)
            return;
        if (session.state != 'normal' || session.isblocked(m.sid))
            return;
        var cl = Chat.updatebuddy(m);
        //aler(m.msg.indexOf('!mycolor:') + "         write") 
        
        if (m.msg.indexOf('!updatepic:') == 0)
        {
            var xs = m.msg.split(/:/);
            var pic = document.getElementById(xs[1]);
            if (pic!=null)
            {
               
                var xx = pic.alt;
                pic.parentNode.removeChild(pic);
                session.recev.innerHTML += //"<font color="+cl+">" + textmsg[1296] +   ":</font><br>"
                        "<font color=blue><img  src=\"\" id=\"" + xs[1] + "\" alt=" + xx + " onclick=\"Chat.recall(this," + xs[2] + ")\" ></font>";
                 
            }
        }
        else if (m.msg.indexOf('!deletepic:') == 0)
        {
            var xs = m.msg.split(/:/);
            var pic = document.getElementById(xs[1]);
            if (pic!=null)
            {
                var xx = pic.alt;
                pic.parentNode.removeChild(pic);
                session.append(textmsg[69] + xx, 0, cl);
            }
             
        }
        else if (!m.msg.indexOf('!mycolor:') == 0)
        {
            
             var session = Chat.bytid(m.tid);
            session.append("<font size=2 color=#119922>[" + (++session.serial) + "]" + m.sname.replace(/[^\-]+\-/,'') + " at " + Chat.timeform('c') + ":</font>", 1);
            session.append(m.msg, fmt, cl);
        }

    },
   
    listen: function(timeoutInMin)
    {
        Chat.lastlisten = (new Date()).getTime();
        var url = "Msgrecev?sek=" + Chat.sek + "&sid=" + Chat.sid + "&app=chat&time=" + Chat.lastlisten + "&orgnum=" + orgnum;
        if (timeoutInMin != null)
            url += "&timeout=" + timeoutInMin;
        xmlhttp.open("GET", url, true);
        xmlhttp.send(); 
    },
   
    setcurrent: function(k)
    {
        Chat.current = Chat.byorder(k);
        if (Chat.current.wh == null)
            Chat.current.fit();
    },
    clearout: function()
    {
        var s = '';
        var t = '';
        for (var i = 0; i < Chat.sessions.length; i++)
        {
            s += Chat.sessions[i].firedlist;
            t += Chat.sessions[i].topic + "  ";
        }
        if (s.replace(/[,| ]/g, '') != '')
            Chat.post(new Message('0', null, 'chat', s, 'fire', t));
        Chat.post(new Message(null, null, null, null, 'unsubs', null));
    },
    makeformiframe: function()
    {
        var fsnd = document.createElement("form");
        fsnd.name = "f";
        fsnd.action = "Msgsend";
        fsnd.method = 'post';
        fsnd.target = "w" + tstmp;
        fsnd.innerHTML = "<input type=\"hidden\" name=\"stoken\" value=\"" + Chat.securitytoken + "\">"
                + "<input type=\"hidden\" name=\"app\" value=\"chat\">"
                + "<input type=\"hidden\" name=\"tid\">"
                + "<input type=\"hidden\" name=\"topic\">"
                + "<input type=\"hidden\" name=\"keeplong\">"
                + "<input type=\"hidden\" name=\"sid\">"
                + "<input type=\"hidden\" name=\"sname\">"
                + "<input type=\"hidden\" name=\"rid\">"
                + "<input type=\"hidden\" name=\"code\">"
                + "<input type=\"hidden\" name=\"msg\">"
                + "<input type=\"hidden\" name=\"sek\" value=\"" + Chat.sek + "\">";
        document.body.appendChild(fsnd);
        Chat.fsnd = fsnd;
         
        
        var fsnd1 = document.createElement("form");
        fsnd1.name = "form2";
        fsnd1.action = "FileOperation";
        fsnd1.method = 'post';
        fsnd1.target = "w" + tstmp;
        fsnd1.innerHTML = "<input type=hidden name=filedir><input type=hidden name=folder><input type=hidden name=destination><input type=hidden name=operation>";
        document.body.appendChild(fsnd1);

        fsnd1 = document.createElement("form");
        fsnd1.name = "form3";
        fsnd1.action = "DataUpdate";
        fsnd1.method = 'post';
        fsnd1.target = "w" + tstmp;
        
        fsnd1.innerHTML = "<input type=hidden name=purpose value=\"\"><input type=hidden name=starttime value=\"\"><input type=hidden name=endtime value=\"\"><input type=hidden name=courseid value=\"\"><input type=hidden name=subdb value=\"\"><input type=hidden name=attach><input type=hidden name=rdap value=savechat><input type=hidden name=content><input type=hidden name=sid value=" + userid +">";
        document.body.appendChild(fsnd1);
        var fr = document.createElement("div");
        fr.style.cssText = "width:1px;height:1px";
        fr.innerHTML = "<iframe name=\"w" + tstmp + "\" width=1 height=1 border=0  style=visibility:visible />";
        ResizeUploaded.attachref = fsnd1.attach;
        document.body.appendChild(fr);
    },
    post: function(m)
    {
         Chat.fsnd.sek.value = Chat.sek;
         
        if (m.tid != null)
        {
            Chat.fsnd.tid.disabled = false;
            Chat.fsnd.tid.value = m.tid;
            Chat.fsnd.topic.value = Chat.allTopics[m.tid];
            Chat.timer(m);
        }
        else
            Chat.fsnd.tid.disabled = true;

        Chat.fsnd.sid.value = Chat.sid;
        if (m.sname != 'chat')
            Chat.fsnd.sname.value = Chat.sid + "-" + Chat.sname;
        else
            Chat.fsnd.sname.value = 'chat';

        if (m.rid != null && m.rid != '')
        {
            Chat.fsnd.rid.disabled = false;
            Chat.fsnd.rid.value = m.rid.replace(/ /g,'').replace(/^[,]+/,"").replace(/[,]+$/,"").replace(new RegExp(","+ Chat.sek + ","), ",");
        }
        else
            Chat.fsnd.rid.disabled = true;
         
        Chat.fsnd.msg.value = m.msg;
        Chat.fsnd.code.value = m.code;
        if (m.code=='new')
        {
            Chat.fsnd.topic.value = m.msg;
        }
        Chat.fsnd.action = Chat.tailaction(Chat.fsnd.action);
        //formnewaction(Chat.fsnd);
        visual(Chat.fsnd);
        Chat.fsnd.submit();
         
    },
    
    deletepic : function(pathcode, tm)
    {
        savedredourl = "UploadChangePic?pathcode=" + pathcode + "&tcode=" + tm;
        window.open(savedredourl, 'w' + tstmp);
        closeprompt();
    },
    
    sendchanged: function()
    {
        eval(Chat.changedcode);
    },
    
    recall: function(pic,j)
    {
        if (pic.src.indexOf("FileOperation") < 0)
        {
            pic.id = pic.id.replace(/,.*$/,'');
            pic.src = 'FileOperation?did=' + pic.id + "&t=" + j;
           
        }
        else
        {
            var a = pic.src.replace(/^[^=]+=/,'').replace(/&.*/,''); 
            var b = pic.src.replace(/[^&]+&t=/,''); 
            
            if (pic.style.cssText.indexOf('3px')>=0)
            {
                ResizeUploaded.attachref.value =  "";
                ResizeUploaded.uploaded('web/' + a, pic.alt + "@" + b);
                Chat.changingid = pic.id;
                promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].onclick
                = function() {
                    ResizeUploaded.changingid = '';
                    closeprompt();
                }
            }
       }
    },
   
    setToolstr: function(cid, str)
    {
        Chat.toolstr[cid] = str;
        onlinetoolbarfollow(Chat.current.msg);
    }
}

var start = function(t, ts)
{
    
    if (ts == null)
    {
        Chat.updatemenu = false;
    }
    else
    {
        Chat.inittopics = ts;
    }
    if (userid!=iid)
    {
       tempiid = iid; 
    }
     
    Chat.start(t);
};



function Session()
{
    this.topic = "";
    this.courseid = '';
    this.iid = '';
    this.tid = "";
    this.sid = "";
    this.order = 0;
    this.time = 0;
    this.firedlist = ",";
    this.blocklist = "";
    this.member = null;
    this.size = 0;
    this.state = "";
    this.cell = null;
    this.ttype = 'plain';
    this.usefolder = Chat.sid;
    Chat.add(this);
    this.top = 0;
    this.left = 0;
    this.wh = null;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.msg = null;
    this.recev = null;
    this.serial = 0;
    this.printfmt= 0;
    this.hastoolbar = false;
    this.drawstrs = [];
    this.toString = function()
    {
        return "this.topic=" + this.topic +
                "\nthis.tid=" + this.tid +
                "this.sid=" + this.sid +
                "\nthis.order=" + this.order +
                "\nthis.time=" + this.time +
                "\nthis.firedlist=" + this.firedlist +
                "\nthis.blocklist=" + this.blocklist +
                "\nthis.member=" + this.member +
                "\nthis.size=" + this.size +
                "\nthis.state=" + this.state +
                "\nthis.cell=" + this.cell +
                "\nthis.ttype=" + this.ttype +
                "\nthis.usefolder=" + this.usefolder +
                "\nthis.top=" + this.top +
                "\nthis.left=" + this.left +
                "\nthis.wh=" + this.wh +
                "\nthis.x=" + this.x +
                "\nthis.y=" + this.y +
                "\nthis.width=" + this.width +
                "\nthis.msg=" + this.msg +
                "\nthis.recev=" + this.recev +
                "\nthis.serial=" + this.serial;
    }
    
    this.requesttoolbar = function()
    {
       document.form3.purpose.disabled = false;
       document.form3.target = "w" + tstmp;
       document.form3.courseid.value = this.courseid;
       document.form3.subdb.value = this.iid;
       formnewaction(document.form3,"talkpage.jsp");
       
       visual(document.form3);
document.form3.submit();
    }

    this.init = function(s)
    {
        var m = new Message(s);
        //m.display("init");
        this.sid = m.sid;
        this.tid = m.tid;
        this.topic = m.msg;
        
        this.courseid = this.topic.replace(/:.*/,'').replace( /\-[^\-]+$/,'');
        if (tempiid != '')
            this.iid = tempiid;
        else
            this.iid = userid;
        this.time = (new Date()).getTime();
        this.firedlist = ",";
        this.blocklist = ",";
        this.member = new Array();
        this.size = 0;
        if (this.state == '')
        {
            this.order = Chat.makecell(this.topic, this.usefolder);
        }
        else if (this.state == 'ended')
        {
            this.order = Chat.makecell(this.topic, this.usefolder, this.order);
        }
         
        this.cell = document.getElementById("c" + this.order);
        if (this.state == '')
            this.showanchor();
        this.state = "normal";

        if (m.rid != '')
        {
            this.memberlist(m.rid);
            var arr = Chat.trim(m.rid).split(/[ ]*,[ ]*/);
            Chat.updatetopicnp(this.topic, "" + arr.length, m.toString());
        }
        else
        {
            Chat.updatetopicnp(this.topic, "0", m.toString());
        }
        this.msg =  document.getElementById("tmsg"+this.order);
        this.recev = document.getElementById('recev' + this.order);
    }

    this.delanchor = function()
    {
        var t = document.getElementById("A" + this.order);
        if (t != null)
            t.parentNode.removeChild(t);
    }
    this.setTimeout = function()
    {
        document.getElementById("timeout" + this.order).innerHTML = "timeout";
        this.state = 'timeout'
    }
    this.memberlist = function(t)
    {
       var ss = t.split(/,/);
       var tt = '' + (new Date()).getTime() % 10000000;
       var allids = ",";
       for (var i = 0; i < ss.length; i++)
       {
          var j = ss[i].indexOf("-");
          var aa = ss[i].substring(0,j); 
          var bb = ss[i].substring(j+1).replace(/_/g,' ');
          if (allids.indexOf("," + aa + ",") == -1)
          {
              this.member[this.size++] = [aa, bb, textmsg[1304].replace(/@.*$/,''), tt, 'blue', 'checked', 'checked'];
              allids += aa + ",";
          }
        } 
    }

    this.updatename = function(sid, sname)
    {
        for (var i = 0; i < this.size; i++)
            if (this.member[i][0] == sid)
            {
                this.member[i][1] = sname;
                break;
            }
    }
    this.flash = function(n)
    {
        if (n<0) return;
        var k = Chat.lookup(this);
        var f = Chat.formbyname("f" + k); 
        f.memberbtn.style.color = (n%2 == 1)? "red" :"white";
        setTimeout("Chat.sessions[" + k + "].flash(" + (n-1) + ")", 400);
    }
    this.lasttimering = 0;
    this.add = function(sid, sname)
    {
        if (sname == null)
            sname = sid;
        var tt = '' + (new Date()).getTime() % 10000000;
        for (var j=0; j < this.size; j++)
            if (sid == this.member[j][0]) return;
        this.member[this.size++] = [sid, sname, textmsg[1304].replace(/@.*/,''),tt, 'blue', 'checked', 'checked'];
        if (tt - this.lasttimering > 2000 && "Audio" in window) 
        {
            var a = null;
            try
            {
                a = new Audio();
                if (!!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, '')))
                   a.src = "image/doorbell.mp3";
                a.autoplay = true;
             }catch(ee){}
            this.flash(7);
        } 
        this.lasttimering = tt;
        
    }
    this.del = function(sid)
    {
        if (sid == null || this.size == 0)
            return;
        var isfire = this.isfired(sid);
        for (var i = 0; i < this.size; i++)
            if (this.member[i][0] == sid)
            {
                break;
            }
        if (isfire)
            this.member[i][2] = textmsg[1570];
        if (this.size > 1 && i != this.size - 1)
        {
            var tt = this.member[i];
            this.member[i] = this.member[this.size - 1];
            this.member[this.size - 1] = tt;
        }
        if (isfire == false)
            this.size--;
    }
    this.printsent = function(m)
    {
        ResizeUploaded.changingid = '';
        if (m.msg==null || m.msg.indexOf('!mycolor:') == 0)
            return;
        else if (m.msg.indexOf('!updatepic:') == 0)
        {
            var xs = m.msg.split(/:/);
            var pic = document.getElementById(xs[1]);
            if (pic!=null)
            {
                pic.src = "FileOperation?did="  + xs[1] + "&t=" +  xs[2];
                ResizeUploaded.attachref.value = pic.alt + "@" + xs[2] + "@" + xs[1];
                pic.onclick= function(){Chat.recall(this,xs[2]);}
            }
            return;
        }
        else if (m.msg.indexOf('!deletepic:') == 0)
        {
            var xs = m.msg.split(/:/);
            var pic = document.getElementById(xs[1]);
            if (pic!=null)
            {
                pic.parentNode.removeChild(pic);
                ResizeUploaded.attachref.value = pic.alt + "@" + xs[2] + "@" + xs[1];
            }
            return;
        }
        else
        {
            var mycl = document.getElementById("cls" + this.order).style.color;
            var session = Chat.bytid(m.tid);
            
            this.append("<font size=2 color=#773322>[" +  (++session.serial) + "]" + Chat.sname + " at " + Chat.timeform('c') + ":</font>", 1);
            if (this.printfmt == 1)
            {    
                m.msg = m.msg.replace(/<br>$/i,'').replace(/^<br>/i,'');
            }
            else  
            {
                 m.msg = m.msg.replace(/[\n]+$/,'').replace(/^[\n]+/,'');
            }
            this.append( m.msg.replace(/<img src="" /, '<img style=border-radius:3px src="" '), this.printfmt, mycl);
        }
    } 
    this.panel = function(xy,k)
    {
        var firable = Chat.updatemenu;
        var s = "<table  cellspacing=1 cellpadding=3 id=p" + this.tid + " style=margin:3px;border-collapse:collapse border=1><tr style=background-color:"+ BBGCOLOR + "><td style=white-space:nowrap>" + textmsg[15] + "</td><td align=center  style=white-space:nowrap><input type=checkbox  onclick=Chat.mark(" + this.tid + ",this,-1,5) name=cklisall " + Chat.ifallset(this.tid,5) + " >" + textmsg[1365] + "</td><td  align=center  style=white-space:nowrap><input type=checkbox name=cksendall  onclick=Chat.mark(" + this.tid + ",this,-1,6) " + Chat.ifallset(this.tid,6) + ">" + textmsg[223] + "</td><td  style=white-space:nowrap>" + textmsg[455] + "</td></tr>";
        for (var i = 0; i < this.size; i++)
        {

            s += "<tr><td width=150><a href=DataFormHTML?subdb=&rdap=userinfo&uid=" + this.member[i][1].replace(/\-.*/,'') + " target=_blank><nobr>" + this.member[i][1].replace(/[^\-]+\-/,'') + "</nobr></a></td>"
                    + "<td align=center><input type=checkbox  value=\"" + this.member[i][0] + "\" " + this.member[i][5] + " onclick=Chat.mark(" + this.tid + ",this," + i + ",5) " + (this.member[i][5]) +"></td><td align=center><input type=checkbox value=\"" + this.member[i][0] + "\" " +  this.member[i][6] + " onclick=Chat.mark(" + this.tid + ",this," + i + ",6) " + (this.member[i][6]) +"></td><td width=90><nobr>" + this.member[i][2] + "</nobr></td></tr>";
        }
        s += "<tr>";
       // if (firable)  //<table align=center><tr><td>
        s += "<td></td><td align=center><input  class=RedButton  " + Chat.butstyle + " style=height:" + (fontsize + 6) + "px  onclick=Chat.updateb(this,'" + this.tid + "') value=\"" + textmsg[225]+ "\"></td>";//<td><input id=anchor" + this.order + " class=RedButton " + Chat.butstyle + " onmouseup=Chat.moveto(this," + this.order + ") value=\""+ textmsg[1315]+ "\"></td></tr></table></td>";
        s += "<td  align=center><input class=OrangeButton " + Chat.butstyle + "  style=height:" + (fontsize + 6) + "px  onclick=\"Chat.send(" + k + ")\" value=\""+ textmsg[223] + "\" ></td><td></td>";
        s += "</tr></table>";
        myprompt(s, null, null, textmsg[1271]);
        promptwin.style.left = (xy[0]+10) + 'px';
        promptwin.style.top = xy[1];
        if (typeof (Drag) != 'undefined')
            Drag.init(document.getElementById('anchor' + this.order), promptwin);
        setRoundedWidth(promptwin, 240);
    }

    this.point = function()
    {
        var xy = findPositionnoScrolling(this.cell);
        return "position:absolute;left:" + (xy[0] + this.cell.offsetWidth - 10) + "px;top:" + (xy[1] + this.cell.offsetHeight - 12)
                + "px;width:12px;height:12px;z-index:" + 10 + ";cursor:se-resize;";
    }
    this.resizewin = null;
    
    this.showanchor = function()
    {
        var c = document.getElementById("c" + this.order);
        if (c!=null)
        this.resizewin = new ResizeRounded(c, Chat.resizedo);
    }

    this.setformat = function(v)
    {
        var f = Chat.formbyname("t" + this.order);
        if (f!=null)
            f.fmt.value = '' + v;
    }

    this.getformat = function()
    {
        var f = Chat.formbyname("t" + this.order);
        if (f!=null)
        return f.fmt.value;
        return '0';
    }
     
    this.mathdivstr = [];
    this.deletemath = function(dv)
    {
        if (dv == null || typeof(dv.id) == 'undefined'||dv.id == null ) 
            return;
       
        if (dv.id.indexOf('mathdiv') == 0)
        {
            var j = parseInt(dv.id.substring(7));
            dv.innerHTML = this.mathdivstr[j];
            return;
        }
        
        for (var i=0; i <  dv.childNodes.length; i++)
           this.deletemath(dv.childNodes[i]);
    },
    this.append = function(str, fmt, cl)
    {
        let sel = Chat.fele("t" + this.order, "fontsize");
        let fs = "font-size:" +  sel.options[sel.selectedIndex].text + 'px;';
        if (this.recev.offsetHeight <  this.recev.scrollHeight + 50)
           this.recev.style.height =  (this.recev.scrollHeight + 50) + 'px';
        if (fmt == 0)
        {
            if (cl==null || cl=='') cl = document.getElementById("cls" + Chat.activek).style.color;
            this.recev.innerHTML  =  this.recev.innerHTML  
             +"<div style=" + fs + "color:" + cl + ";font-family:inherit;display:block>" + str.replace(/^[\n|\t|\r| ]+/,'').replace(/[\n|\t|\r| ]+$/,'').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, '<br>') 
             +  "</div>" ;
        }
        else
        {
            str = str.replace(new RegExp("<" + "script", "gi"), "&lt;script").replace(new RegExp("</" + "script", "gi"), "&lt;/script");
            str = str.replace(new RegExp("<" + "embed", "gi"), "&lt;embed").replace(new RegExp("</" + "embed", "gi"), "&lt;/embed");
            str = str.replace(new RegExp("<" + "object", "gi"), "&lt;object").replace(new RegExp("</" + "object", "gi"), "&lt;/object");
            if (fmt == 1)
            {
                if (cl==null || cl=='') cl = document.getElementById("cls" + Chat.activek).style.color;;
                this.recev.innerHTML  = this.recev.innerHTML  
                        + "<div style=" + fs + "color:" + cl + ";font-family:inherit;display:block>"
                        + str.replace(/^<br>/,'').replace(/<br>$/,'') 
                        +  "</div>" ;
            }
            else
            {
                var dv = document.createElement("div");
                dv.id = "mathdiv" + (this.mathdivstr.length);
                this.mathdivstr[this.mathdivstr.length] = str;
                dv.innerHTML =   str  ;
                if (cl!=null && cl!='')
                dv.style.cssText = fs + "color:" + cl;
                this.recev.appendChild(dv);
                displaylatex(dv);
            }
        }

    }

    this.sel = function()
    {
        var s0='',  s = '', s1 = '';
        for (var i = 1; i <= this.member.length; i++)
        {
            if (s0!='') s0+=','; s0+=this.member[i-1][0];
           // if (tbl.rows[i].cells[1].childNodes[0].checked)
            {
                if (this.member[i-1][5] == 'checked')
                {
                    if (s != '')
                        s += ",";
                    s += this.member[i-1][0];
                }
            }
            //if (tbl.rows[i].cells[2].childNodes[0].checked)
            {     
                if (this.member[i-1][6] == 'checked')
                {
                    if (s1 != '')
                        s1 += ",";
                    s1 += this.member[i-1][0];
                }
            }
        }

        return [s0, s, s1];
    }
    this.tosends = function()
    {
        var y = this.sel();
        
        if (y[0] != y[2])
            return  y[2];
        return '';
    }
    this.tolistens = function()
    {
        var y = this.sel();
      
        if (y[0] != y[1])
            return  y[1];
        return '';
    }
    this.isfired = function(s)
    {
        return this.firedlist.indexOf("," + s + ",") >= 0;
    }
    this.isblocked = function(s)
    {
        return this.blocklist.indexOf("," + s + ",") >= 0;
    }
    this.fired = function(sl)
    {
        var ss = Chat.trim(sl).split(/[ ]*,[ ]*/);
        for (var i = 0; i < ss.length; i++)
        {
            if (ss[j] == '')
                continue;
            this.firedlist += ss[i] + ",";
            for (var j = 0; j < this.size; j++)
                if (this.member[j][0] == ss[i])
                    this.member[j][2] = 'Fired';
        }
    }
    this.unfired = function(sl)
    {
        var ss = sl.replace(/^[ ]+/, '').replace(/[ ]+$/, '').split(/[ ]*,[ ]*/);
        for (var i = 0; i < ss.length; i++)
        {
            this.firedlist = this.firedlist.replace("," + ss[i] + ",", ",");
            for (var j = 0; j < this.size; j++)
                if (this.member[j][0] == ss[i])
                    this.member[j][2] = 'UnFired';
        }
    }
    this.blocked = function(sl)
    {
        var ss = sl.replace(/^[ ]+/, '').replace(/[ ]+$/, '').split(/[ ]*,[ ]*/);
        for (var i = 0; i < ss.length; i++)
        {
            if (ss[i] != '')
                this.blocklist += ss[i] + ',';
        }
    }
    this.fit = function()
    {
        var w = this.cell.offsetWidth;
        var ch = this.cell.offsetHeight;
        if (this.recev == null) return;
        var wd = this.recev.offsetWidth;
        if (Math.abs(wd - w + 1) > 3)
            this.recev.style.width = (w - 1) + 'px';

        if (this.state != 'ended')
        {
            var xy = findPositionnoScrolling(this.cell);
            if (this.wh == null)
            {
                var h = document.getElementById("act" + this.order);
                this.wh = [h.offsetWidth, h.offsetHeight];
                this.msg.style.height = this.wh[1] + "px";
                this.top = findPositionnoScrolling(this.msg)[1] - xy[1];
            }
            this.left = xy[0] + 3;
            this.width = w - 0 - this.wh[0];
            if (Math.abs(this.msg.offsetWidth - this.width) > 5)
                this.msg.style.width = this.width + 'px';
            var z = ch - this.top - this.wh[1] - 2;
            if (Math.round(this.recev.offsetHeight - z) > 4)
                this.recev.style.height = z + 'px';
            var xx = document.getElementById("ifr" + this.order);
            if (xx != null)
                xx.width = (w - 8) + "px";
            //Chat.fele('f' + this.order, "localpath").style.width = (w - 180 - this.wh[0]) + "px";
        }
        else
            this.recev.style.height = (ch - this.top) + 'px';
        var a = document.getElementById("A" + this.order);
        if (a != null)
            a.style.cssText = this.point();
    }

    this.iframe = null;
    this.getIframe = function()
    {
        var win = null;

        if (typeof(self.frames) != 'undefined')
            for (var j = 0; j < self.frames.length; j++)
            {
                if (self.frames[j].id == "ifr" + this.order || self.frames[j].name == "ifrnam" + this.order)
                {
                    win = self.frames[j];
                    break;
                }
            }

        if (win == null)
        {
            for (j = 0; j < window.frames.length; j++)
            {
                if (window.frames[j].id == "ifr" + this.order || window.frames[j].name == "ifrnam" + this.order)
                {

                    win = window.frames[j];
                    break;
                }
            }
        }
        if (win == null)
        {
            this.startuml(false);
            return this.iframe; 
        }
        return win; 
    }
     
    this.startuml = function(initial)
    {
        var encoding = 'utf-8';
        var headsec = document.getElementsByTagName('head')[0];
        var metas = headsec.getElementsByTagName('meta');
        for (var j=0; j < metas.length; j++)
            if (metas[j].content && metas[j].content.toLowerCase().indexOf('charset'))
        {
            encoding = metas[j].content.replace(/^text.html;[ ]*charset=(.*)$/i,"$1");
            break;
        }
        
        var win = document.getElementById("ifr" + this.order);
        if (win == null)
        {
            win = myprompt("<iframe  name=\"ifrnam" + this.order + "\"  id=\"ifr" + this.order + "\" src=umltool.html?sn=" + this.order + "&en="+ encoding + "&lang=" + langcode +  "&orgnum=" + orgnum + " width=560 height=600 frameborder=0 style=\"border:0px;margin:0px 0px 0px 0px\" on></iframe>",null,null,this.topic,"chatdraw" + this.tid);
            win.style.left = (this.left ) + 'px';
            win.style.top = '0px';
            win.style.zIndex = '5';
            win.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0].cells[0].getElementsByTagName('img')[0].onclick
                    = function()
            {
                var x = this;
                while (x.tagName.toLowerCase() != 'div' && x.tagName.toLowerCase() != 'body')
                {
                    x = x.parentNode;
                }
                document.body.removeChild(x);
                this.iframe = null;
            }
            var td = win.getElementsByTagName('table')[0].rows[1].cells[1];
            var zz = Chat.getElementByNameId(td, "ifr");
            zz.parentNode.style.padding = "1px 0px 1px 0px";
            var x = 560;
            td.getElementsByTagName('table')[0].rows[0].cells[1].style.width = (x - 22) + 'px';
            td.getElementsByTagName('table')[0].rows[0].cells[1].width = x - 22;
            td.getElementsByTagName('table')[0].rows[1].cells[0].width = x + 2;
            td.getElementsByTagName('table')[0].width = x + 2;
            td.width = x + 2;
            win.style.width = (x + 2) + 'px';
            var rs = new ResizeRounded(win, Chat.resizeiframe);


            promptwin = null;

            if (initial) // send invitation
            {
                var m = new Message(this.tid, Chat.sek, Chat.sname, this.tosends(), 'draw', '');
                Chat.post(m);
            }
            this.iframe = this.getIframe();
            for (var j=0; j < this.drawstrs.length; j++)
            {
               if (typeof this.iframe!= 'undefined')
               this.iframe.createupdate(this.drawstrs[j]);
            } 
        }

    }
}

xmlhttp.onreadystatechange = function()
{
    if ( xmlhttp.readyState == 4 &&  xmlhttp.status == 200 )
    {
         
        if (xmlhttp.responseText.length>10)  
        {
           Msg.handleget(xmlhttp.responseText);
           if (Chat.needmore)
               Chat.listen();
        }
    }
} 

failupload = function(err,len)
{
    if (err==null) return;
    else if (typeof(err) == 'number')
    {
        if (Chat.changingid != '')
        {
            var x = document.getElementById(Chat.changingid);
            if (x!=null) 
            {
                x.src = x.src.replace(/[0-9]+$/, ''+err);
                Chat.sendfm('!updatepic:' + Chat.changingid + ':' +  err);
            }
            Chat.changingid = '';
        }
        else
        {
            var x = ResizeUploaded.alluploaded;
            if (x=='') x = ResizeUploaded.alluploaded = ResizeUploaded.attachref.value;
            ResizeUploaded.alluploaded = ResizeUploaded.alluploaded.replace(/@[0-9]+@/, '@' + err + '@');
            
            var xs = ResizeUploaded.alluploaded.replace(/,$/,'').split(/@/);
            var fen = xs[0].replace(/[^\.]+\./, '').toLowerCase();
         
            if (fen == 'jpg' || fen == 'jpeg' || fen == 'gif' || fen == 'png') 
            {
                x[2] = x[2].replace(/,.*$/,'');
                Chat.sentimg = xs;
                Chat.sendfm('<img src=""   alt="' + xs[0]  + '" onclick="Chat.recall(this,' + xs[1] + ")\" id=\"" + xs[2] + "\" >" );
            }
        }
    }
    else 
        myprompt(err);
}
function syn(z, explicit)
{
   
    if (z == 'del' && explicit.replace(/[0-9|a-z]/ig,'').replace(/[\-|_|\.|\$]/g,'') == '')
    {
        if (Chat.changingid!='')
        {
            var x = document.getElementById(Chat.changingid);
            if (x!=null)x.parentNode.removeChild(x);
            Chat.sendfm('!deletepic:' + Chat.changingid);
            Chat.changingid = '';
            ResizeUploaded.attachref.value = "";
        }
        ResizeUploaded.active = false;
        closeprompt();
    }
    else if (z.indexOf('web') == 0)
    {
         Chat.clearfile(Chat.activek);
         ResizeUploaded.uploaded(z, explicit);
    }
    else
    {
       // Chat.endsession(Chat.activek);
    }
} 

function showattachment(t)
{
   
    //if (Char.changeid == '')
    {
        var xs = t.replace(/,$/,'').split(/@/);
        xs[2] = xs[2].replace(/,.*$/,'');
        var loc = "FileOperation?did=" + xs[2];
        var fen = xs[0].replace(/[^\.]+\./, '').toLowerCase();
        if (fen == 'jpg' || fen == 'jpeg' || fen == 'gif' || fen == 'png') 
        {
            var x = document.getElementById(xs[2]);
            Chat.sentimg = xs;
            if (Chat.changingid == '')
            {
                Chat.sendfm('<br><img src="" alt=\"' + xs[0]  + '" style=cursor:pointer onclick="Chat.recall(this,' + xs[1] + ")\" id=\"" + xs[2] + "\" >" );
            }
            else
            {
                Chat.sendfm('!updatepic:' + Chat.changingid + ':' +  xs[1]);
            }
        }
        else
        {
            Chat.sendfm('<a href="' + loc + '" target="_blank" >' + xs[0] + '</a>. ' + textmsg[1312]); 
        }
     }
}

ResizeUploaded.docuse = function()
{
    
    var xs = ResizeUploaded.alluploaded.replace(/,$/,'').split(/@/);
    xs[2] = xs[2].replace(/,.*$/,'');
    var loc = "FileOperation?did=" + xs[2];
    var fen = xs[0].replace(/[^\.]+\./, '').toLowerCase();
    if (fen == 'jpg' || fen == 'jpeg' || fen == 'gif' || fen == 'png') 
    {
        Chat.sentimg = xs;
        Chat.sendfm('<img src="" alt=\"' + xs[0]  + '" onclick="Chat.recall(this,' + xs[1] + ")\" id=\"" + xs[2] + "\" >" );
        document.getElementById(xs[2]).src = "FileOperation?did=" + xs[2] + "&t=" + xs[1];
    }
    else
    {
        Chat.sendfm('<a href="' + loc + '" target="_blank" >' + xs[0] + '</a>. ' + textmsg[1312]); 
    }
}
Msg.listent = function()
{
    Chat.listen();
}
 
Msg.handlepost = function(s)
{
    var m = new Message(s);
    if (m.valid == false)
    {
        myprompt("Invalid message "+ s);
        return;
    }
    var session  = Chat.bytid(m.tid);
    if (m.code == 'login')
    {
        window.open( "login.jsp?error=generic&follow=" + m.msg, 'w' + tstmp);
    }
    else if (m.code == 'error')
    {
        myprompt(m.msg,null,null,"Error");
        if (m.num==2) Chat.listen();
    }
    else if (m.code == "newd")
    {
       
        for (let x in Chat.allTopics)
        {
           if (m.tid == x)
           return;
        }
        Chat.allTopics[m.tid] = m.msg;
        
        Chat.fsnd.topic.value = m.msg;
        session = Chat.bytopic(Chat.trim(m.msg));
        if (session == null)
        {
            session = new Session();
        }
        session.init(s);
        
        if (localStorage[m.msg]!=null)
        try{
            Chat.data[m.tid] = JSON.parse(localStorage[m.msg]);
        }catch(e){Chat.data[m.tid] = new Array();}
        else
           Chat.data[m.tid] = new Array();
       
        if (m.num==2) Chat.listen(); 
    }
    else if (m.code == "unsubd")
    {
        if (session != null) 
        {
            var c = session.cell;  
            if (c == null)
                return 0;
            c = c.getElementsByTagName("table")[0].rows[1].cells[1];
            var h = c.offsetHeight;
            var w = c.offsetWidth;
            var d = null;
            c = c.getElementsByTagName("table")[0];
            if (c.rows.length < 4) return 0;
            c.deleteRow(2);
            c.deleteRow(1);
            var bc = c.rows[0].insertCell(-1);
            bc.innerHTML = "<img width=42 style=\"border-radius:21px\" src=image/icon/smalls00.png name=bb" + session.order + "  onclick=Chat.endsession(" + session.order + ") >";
            c.rows[1].cells[0].colSpan = "2";
            d = c.rows[1].cells[0].getElementsByTagName("div")[0];
            d.style.height = (h - 30) + 'px';
            d.style.width = (w - 1) + 'px'
            session.state = 'ended';
            Chat.updatetopicnp(session.topic, m.msg);
            session.fit();
        }
    }
    else if (m.code == "timeout")
    {
        if (m.tid == 'chat')
        {    
            for (var i = 0; i < Chat.sessions.length; i++)
            {
                if (Chat.sessions[i].state == 'normal')
                {
                    Chat.sessions[i].setTimeout();
                    Chat.sessions[i].state = 'timeout';
                }
            }
        }
        myprompt(textmsg[1313]);
    }
    else if (m.code == "sure")
    {
        session.printsent(m);
        Chat.data[m.tid].push(s);
        Queue.sending = false;
        if (Queue.size>0)
        {
            Queue.sendnow();
        }
        if (m.num==2) Chat.listen();
    }
    else if (m.code == "draw")
    {
        Queue.sending = false;
        
        if (session.iframe == null || m.msg == null || m.msg.replace(/[ |\t|\r|\s]/g,'') == '')
        {
            session.iframe = session.getIframe();
        }
        var isACK = true;
        if (session.iframe == null) 
        {
            myprompt("Please start drawing board");
            isACK = false;
        }
        else if (m.msg == 'd')
        {
            session.iframe.clearall(1);
             isACK = false;
        }
        else if (m.msg!='' && m.msg.replace(/[0-9]+/, '') == '')
        {
            session.iframe.holdtomodify(parseInt(m.msg));
            isACK = false;
        }
        else if (m.msg!='' && m.msg.replace(/s[0-9]+/, '') == '')
        {
            session.iframe.newshape(null, parseInt(m.msg.substring(1)));
        }
        else if (m.msg!='' && m.msg.replace(/l[0-9]/, '') == '')
        {
            session.iframe.select(null, null, null, parseInt(m.msg.substring(1)));
        }
        else if (m.msg!='' && m.msg.replace(/c[0-9]/, '') == '')
        {
            session.iframe.selcurve(null, null,parseInt(m.msg.substring(1)));
        }
        
        else if (m.msg!='')
        {
            if (typeof session.iframe!= 'undefined')
                session.iframe.createupdate(m.msg);
            session.drawstrs[session.drawstrs.length] = m.msg;
            isACK = false;
        }
        
        if ( isACK)
        {
            Queue.sending = false;
            if (Queue.size>0)
            {
                Queue.sendnow();

            }
        }
        if (m.num==2) Chat.listen();
    }
    else if (m.code == "snap")
    {
        var seg = m.msg.split(/\|/);
        seg[2] = seg[2].replace(/Status<.td><.tr>/,textmsg[455] + "</td></tr>")
                .replace(/0<.td><.tr>/g,document.t0.status.options[0].text + "</td></tr>")
                .replace(/1<.td><.tr>/g,document.t0.status.options[0].text + "</td></tr>")
                .replace(/2<.td><.tr>/g,document.t0.status.options[0].text + "</td></tr>");
        var x = textmsg[1646].split(/@/);
        for (var i=1; i < 4; i++)
        seg[i] = seg[i].replace(/<table/, '<table width=100% border=1 style=border-collapse:collapse;border-radius:3px;background-color:white');
        myprompt("<table width=98%><tr><td>" + x[0] +seg[1]+ "</td></tr> <tr><td>" + x[1] +seg[2]+ "</td></tr><tr><td>" + x[2] 
                +seg[3].replace(/<td/g,'<td style=white-space:nowrap ')+ "</td></tr></table>",null,null,textmsg[455]);
        if (m.num==2) Chat.listen();
    }
     
    else if (m.code == "info" && m.msg!='')
    {
        myprompt(m.msg);
        if (m.num==2) Chat.listen();
    }
     
}

Msg.handleget = function(s)
{
    if (s == '')
        return  true;
    var m = new Message(s);
    if (m.valid == false)
    {
        myprompt('Invalid message received' + s);
        return true;
    }
    //m.display("receive");
    Chat.needmore = (m.msg!='stopmsg()');
    var session =  Chat.bytid(m.tid);
    
    if (  m.code.indexOf("new")==0)
    {
        /*m.tid = m.code.substring(3);
        session =  Chat.bytid(m.tid);
        var topic = m.msg;
        if (Chat.allTopics[m.tid] == null)
        {
            m.msg = topic.substring(m.j);
            topic = m.msg;
          
            Chat.fsnd.topic.value = topic;
            Chat.allTopics[m.tid] = topic;
        }  
        session = Chat.bytopic(Chat.trim(m.msg));
        if (session == null)
        {
            session = new Session();
            session.init(s);
        }
        */
         
        var topic = m.msg;
        if (Chat.inittopics == null)
        {
            if (typeof(parent.frames[0].passtitle) != 'undefined')
                Chat.inittopics = parent.frames[0].passtitle();
        }
        if (!topic.includes("-") || Chat.ismycourse(topic))  
           Chat.updatetopicnp(topic, "1", m.toString());
    }
    else if (m.code == "join")
    {
        if (session != null)
        {
            if (session.state == 'normal' && session.isfired(m.sid))
            {
                Chat.post(new Message(m.tid, null, null, m.sid, "fire", ""));
                 
            }
            else
            {
                if (m.sid != Chat.sek)
                    session.add(m.sid, m.sname);
                Chat.updatetopicnp(session.topic, m.msg);
            }
        }
        
    }
    else if (m.code == "fire")
    {
        if (m.sid != Chat.sek)
        {
            if (session != null && session.state == 'normal')
            {
                Chat.post(new Message(m.tid, Chat.sek, Chat.sname, null, "unsubs", ""));
                Chat.befired += m.tid + ",";
            }
            else if (m.tid == '0' && m.sname == 'chat')
            {
                Chat.befired += Chat.befired.replace("," + m.tid + ",", ",");
                myprompt(m.msg + ": " + textmsg[1350]);
            }
        }
        
    }
    else if (m.code == "block")
    {
        if (session != null && m.sid != Chat.sek)
            session.del(m.sid);
    }
    else if (m.code == "leave")
    {
        if (session != null) 
        {
            session.del(m.sid);
            Chat.updatetopicnp(session.topic, m.msg);
        }
    }
    else if (m.code == "move")
    {
        Chat.post(new Message(m.tid, Chat.sek, Chat.sname, null, "unsubs", ""));
        var se = Chat.bytopic(Chat.trim(m.msg));
        if (se == null || se.state != 'normal')
            Chat.post(new Message(m.msg, '', '', '', 'new'));
        
    }
    else if (m.code == 'login')
    {
        window.open( "login.jsp?error=generic&follow=" + m.msg, 'w' + tstmp);
        Chat.needmore = false;
    }
    else if (m.code == "plain")
    {
        let accepts = "";
        if (session != null) accepts = session.tolistens();
        if (accepts!='') accepts = "," + accepts + ",";
        if (accepts!='' && !accepts.incliudes("," + m.num + ","))
            return true;
        if (session != null)
            Chat.write(m, session, 0);
        if (Chat.data[m.tid] == null)
            Chat.data[m.tid] = new Array();
        Chat.data[m.tid].push(s);
    }
    else if (m.code == "html")
    {
        if (session != null)
            Chat.write(m, session, 1);
        Chat.data[m.tid].push(s);
    }
    else if (m.code == "latex")
    {
        if (session != null)
            Chat.write(m, session, 2);
        Chat.data[m.tid].push(s);
    }
    else if (m.code == "timeout")
    {
        //if (m.tid == 'chat')
        {    
            for (var i = 0; i < Chat.sessions.length; i++)
            {
                if (Chat.sessions[i].state == 'normal')
                {
                    Chat.sessions[i].setTimeout();
                    Chat.sessions[i].state = 'timeout';
                }
            }
        }
        myprompt(textmsg[1313]);
    }
    else if (m.code == "status")
    {
        if (session != null) 
        {
            var y = session.member;
            for (var j = 0; j < y.length; j++)
                if (y[j][0] == m.sid)
                {
                    y[j][2] = m.msg;
                    break;
                }
        }
    }
     else if (m.code == "draw")
    {
        Queue.sending = false;
        if (session.iframe == null || m.msg == null || m.msg.replace(/[ |\t|\r|\s]/g,'') == '')
        {
            var t = document.getElementById('mobiletoolbar');
            if (t!=null) t.style.visibility = 'hidden';
            session.iframe = session.getIframe();
        }
        var isACK = true;
        if (session.iframe == null) 
        {
            myprompt("Please start drawing board");
            isACK = false;
        }
        else if (m.msg == 'd')
        {
            session.iframe.clearall(1);
             isACK = false;
        }
        else if (m.msg!='' && m.msg.replace(/[0-9]+/, '') == '')
        {
            session.iframe.holdtomodify(parseInt(m.msg));
            isACK = false;
        }
        else if (m.msg!='' && m.msg.replace(/s[0-9]+/, '') == '')
        {
            session.iframe.newshape(null, parseInt(m.msg.substring(1)));
        }
        else if (m.msg!='' && m.msg.replace(/l[0-9]/, '') == '')
        {
            session.iframe.select(null, null, null, parseInt(m.msg.substring(1)));
        }
        else if (m.msg!='' && m.msg.replace(/c[0-9]/, '') == '')
        {
            session.iframe.selcurve(null, null,parseInt(m.msg.substring(1)));
        }
        else if (m.msg.indexOf("Play.")==0)
        {
            session.iframe.playcomm(m.msg);
            isACK = false;
        }
        else if (m.msg!='')
        {
            if (typeof session.iframe!= 'undefined')
            session.iframe.createupdate(m.msg);
            session.drawstrs[session.drawstrs.length] = m.msg;
            isACK = false;
        }
        
        if ( isACK)
        {
            Queue.sending = false;
            if (Queue.size>0)
            {
                Queue.sendnow();

            }
        }
    }
    return true;
}
 
var onloadbeforechat = null;
if (typeof window.onload == 'function')
   onloadbeforechat = window.onload;
var helpcloser = null;
  
window.onload = function()
{
    if (onloadbeforechat!=null) 
        onloadbeforechat(); 
    Chat.makeformiframe();
    
    Chat.init(mysek, userid, username, securitytoken, initialtopics);
    if (inittopic != "")
    {
       start(inittopic);
    }
    Chat.listen();
};
 
var oldonunload2 = window.onunload;
window.onunload = function()
{
    if (parent.opener!=null && typeof parent.opener.postopen == 'function')
         parent.opener.postopen("Msgsend","app,sek,code".split(","),["chat",Chat.sek,"unsubs"],"w"+tstmp);
    else if (parent!=window && parent.frames!=null && typeof parent.frames[0].postopen == 'function')
        parent.frames[0].postopen("Msgsend","app,sek,code".split(","),["chat",Chat.sek,"unsubs"],"w"+tstmp);
    else postopen("Msgsend","app,sek,code".split(","),["chat",Chat.sek,"unsubs"],"w"+tstmp);
    if (oldonunload2!=null)
    oldonunload2();
} 
var tempiid = '';
var studentstart = function (t, iid)
{
    Chat.updatemenu = false;
    tempiid = iid;
    Chat.start(t);
}

function mkstrike1(ta, evt, orientation)
{

    if (orientation == null)
    {
        orientation = 's';
    }
    var e = evt ? evt : window.event;
    if (!e)
        return true;
    var key = 0;
    if (e.keyCode) {
        key = e.keyCode;
    }  
    else if (typeof(e.which) != 'undefined')
    {
        key = e.which;
    }
    if (key == 36 || key == 62)
    {
        var fmt = editingfmt;
        if (editingfmt < 2)
        {

            fmt = guessFormat(ta.value + String.fromCharCode(key));

            editingfmt = fmt;
        }
        if (fmt == 1 || fmt == 2)
        {
            tabeingedited = ta;
            showlatexonfly(orientation, fmt, key);
        }
        var fms = document.forms;
        for (var i=0; i < fms.length; i++)
            if (fms[i].action.indexOf("/preview.jsp") >0)
            {
                fms[i].format.value = editingfmt;
                break;
            }
    }
    return true;
}
var Queue = 
{
    sending : false,
    sendingq : new Array(20),
    putend : -1,
    takeend : -1,
    size : 0,
    counts:0,
    sendObject :  function(k, s)
    {
        if (Queue.size==10) return;
        Queue.putend = (Queue.putend + 1)%20;
        Queue.sendingq[Queue.putend] = {k:k, s:s};
        Queue.size++;
        if (Queue.sending == false)
        {
            Queue.sendnow();
        }
    },
    sendnow : function()
    {
        if (Queue.size == 0 || Queue.counts > 10000 ) return;
        Queue.counts++;
        Queue.takeend = (Queue.takeend + 1)%20;
        var x = Queue.sendingq[Queue.takeend];
        var k = x.k;
        var s = x.s;
        var session = Chat.byorder(k);
        
        var m = new Message(session.tid, Chat.sek, Chat.sname,  session.tosends(), 'draw', s);
        session.printsent(m + Queue.size);
        Queue.sending = true;
        Queue.size--;
        Chat.post(m);
    }
}
var sendObject = function(k, s)
{
    Queue.sendObject(k,s);
}

 
function helpsave(wn, nm, vl)
{
    callingwindow = wn;
    document.form2.destination.value = vl;
    document.form2.target = "w" + tstmp;
    document.form2.operation.value = "save";
    document.form2.filedir.value = nm;
    
    document.form2.folder.value = chatfolder;
    formnewaction(document.form2,"FileOperation");
    
    visual(document.form2);
document.form2.submit();
    return nm;
} 

function fntobesaved()
{
    if (cansave)
    {
        var d = new Date();
        var s = "c";
        if (d.getMonth() > 8)
            s += d.getMonth() + 1;
        else
            s += "0" + (d.getMonth() + 1);
        if (d.getDate() > 9)
            s += d.getDate();
        else
            s += "0" + d.getDate();
        if (d.getHours() > 9)
            s += d.getHours();
        else
            s += "0" + d.getHours();
        return s + ".html";
    }
    return null;
}

//onlinetoolbarhas = true;
//onlinetoolbarinit(); 
function renull(fn, len, code,ltime)
{
    myprompt("<a href=FileOperation?did=" + code + " target=_blank>" + fn + "</a>:<br>" + 
            document.location.toString().replace(/[a-z|\.]+$/, "FileOperation?did=" + code) );
}
savedredourl = '';
dochangepic = function()
{
    window.open(savedredourl, 'w' + tstmp);
}
function resubmit()
{
     
     visual(Chat.fsnd);
Chat.fsnd.submit();
}
 
onlinetoolbarfollow = function(ta)
{
    var session = Chat.current;
    if (!session.hastoolbar)
    {
        var str = Chat.toolstr[session.courseid];
        if (str == null)
        {
            Chat.current.requesttoolbar();
            return;
        }
        else
        {
            session.hastoolbar = true;
            onlinetoolinitial = str;
            onlinetoolbarhas = true;
            var oid = document.getElementById("mobiletoolbar");
            if (oid!=null)
                document.body.removeChild(oid);
            onlinetoolbarinit();
            for (var i = 0; i < Chat.sessions.length; i++)
            if (Chat.sessions[i] != null &&  Chat.sessions[i] != session) 
                Chat.sessions[i].hastoolbar = false;
        }
    }
    if (onlinetoolbase!=null)
    {
        var xy = onlinetoolposition(ta);
        onlinetoolbase.style.left = (xy[0]) + "px";
        onlinetoolbase.style.top = (xy[1] - onlinetoolbase.offsetHeight) + "px";
        onlinetoolbase.style.visibility = "visible";
        onlinetooltextarea = ta;
    }
}

function helpsave(wn, nm, vl)
{
    var nms = ['securitytoken', 'orgnum','destination','operation','filedir'];
    var vls = [securitytoken, orgnum,vl,"save",nm];
    postopen('FileOperation',nms,vls,    "w" + tstmp);
    return nm;
}

 
 
  
