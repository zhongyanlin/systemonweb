<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%!
   static HashMap<String,String> sessionids = new HashMap();  
%> 
<%
long tstmp = System.currentTimeMillis()%10000000;
int orgnum = Toolbox.setcharset(request,response);
 
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<meta http-equiv="Content-Type" content="text/html; charset=<%=Toolbox.encodings[orgnum>>16]%>"> 
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<%=Toolbox.getMeta(orgnum)%><title> </title>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle) %>, securitytoken="<%=Toolbox.gentoken("remote.jsp","f1")%>";</script>
<%
if (orgnum == -1) return;
String scheduleinfo = Toolbox.defaultParam(orgnum,request, "schedule",null);
 
String timestamp = Toolbox.defaultParam(orgnum,request, "t", null);

if (timestamp == null)
{ 
    String sort = request.getParameter("sort"); if (sort==null) sort="1";
   User user = (User)session.getAttribute("User"); 
   if (  (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request, response, "remote.jsp", true)) == null)
  return;
    String sql = "SELECT DomainValue.domainvalue,category,Operation.description,name,cgi,opt,forstudent from DomainValue,Operation, OperationCourse where  caption=CONCAT('',DomainValue.code) AND DomainValue.domain='Tool Caption' AND  DomainValue.language='" + Toolbox.langs[orgnum >> 16] + "' AND Operation.name=OperationCourse.operation   order by " + sort;
    JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
    if (!adapter.error().equals("")){return;}
    int n = 0;
    boolean bb = adapter.executeQuery2(sql,false); 
    String alls =  "<table bgcolor=white style=border-collapse:collapse border=1><tr bgcolor=lightblue><td bgcolor=transparent></td><td onclick=sort(1)>" + Toolbox.emsgs(orgnum,67)+ "</td><td  onclick=sort(2)>" +  Toolbox.emsgs(orgnum,816)+ "</td><td  onclick=sort(3)>" +  Toolbox.emsgs(orgnum,220) + "</td></tr>";
    String toolstr = "var xx = [];var ns = [];\n";            
    String v = ";"; 
    String sname = null;
    for (int i = 0; (sname = adapter.getValueAt(i, 0))!=null; i++) 
    {
        n++;
        String url = adapter.getValueAt(i, 4).trim();
        String name = adapter.getValueAt(i, 3).trim();
        if (v.contains(";"+name+";"))continue;
        v += name + ";";
        if (name.indexOf("RichEdit") >= 0 || url.indexOf("Upload") >= 0 || alls.indexOf("," + name + ",") >= 0) {
            continue;
        }
       
        toolstr += "ns[" + i + "]='" + name + "';xx[" + i + "]=\"";      
        alls +=   "<tr><td ><input type=checkbox id=ck" + i + " value=" + name + " "
                + (scheduleinfo.contains("@"+name + "@")?"checked":"") 
                + "  onclick=selradio('" + name + "'," + i + ")></td><td><nobr>" 
                +  sname.trim() + "</nobr></td><td><nobr>" 
                +  adapter.getValueAt(i, 1).trim() + "</nobr></td><td><nobr>"
                +  adapter.getValueAt(i, 2).trim() + "</nobr></td></tr>";
        for (int j = 0; j < 6; j++) {
            String x = adapter.getValueAt(i, j);
            if (name.equals("Preview") && j == 5) {
                x = x.replaceFirst("format_t", "format_h");
            }
            toolstr +=   x.replaceAll(";", ",") + ";";
        }
        toolstr += "\";\n";  
    }
    
    adapter.close(); %>
    <script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
    <%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<%
    out.println("</head><body>" + alls +  "</table><script>" + toolstr + " function selradio(n,i){parent.setTool(n,xx[i]);}\nfunction sort(i){open('remote.jsp?schedule=" + scheduleinfo +"&sort='+ i,'_self');}</script></body></html>"); 
}
else  if (scheduleinfo != null)
{
    int sek =  SessionCount.enq(session.getId());
    String x = request.getParameter("current");
     if (x != null && x.equals("-1"))
    {
        session.removeAttribute("User");
        sessionids.remove(timestamp);
        {
            out.println("</head><body>Remote control logout.</body></html>"); 
            return;
        }
    }
    else if (x == null || scheduleinfo.equals(""))
    {
        sessionids.remove(timestamp);
      
        %>
        </head><body></body></html>
        <% 
        return;
    }
     
    sessionids.put(timestamp, x + "," + scheduleinfo); 
    %>
</head><body>
<script type="text/javascript"> 
        parent.Play.initRemote(securitytoken,"<%=timestamp%>","<%=sek%>");
</script> 
</body></html>
<% 
    
} 
else if ((scheduleinfo = sessionids.get(timestamp)) == null)   
{
 %>
</head><body>
Invalid session!
</body></html>
<%
}
 
else
{
sessionids.remove(timestamp);
User user = new User(orgnum);
user.id = timestamp;
user.lastname = timestamp;
user.firstname = timestamp;
user.roles = 3;
session.setAttribute("User", user);
  
%>
<script type="text/javascript"><%=Toolbox.someconsts(orgnum)%></script>
<script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" >
</script><script type=text/javascript  src=cookie.js></script>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
</head>
<body>
 
<script>
 var tstmp = <%=tstmp%>;  
 var title = <%=timestamp%>;
 
 var times = new CSVParse('<%=scheduleinfo.replaceFirst("[^,]+,","").replaceFirst(";$","")%>','"',',',';').nextMatrix();
 var sek = "<%=SessionCount.enq(session.getId())%>";
 var m721 = "<%=Toolbox.emsgs(orgnum,721)%>";
 var m82 = "<%=Toolbox.emsgs(orgnum,82)%>";
 var current = '<%=scheduleinfo.replaceFirst(",.*","")%>';
 if (current == '') current = 'stop';
 var labels = textmsg[1771].split(/@/);
 
 var topagelabel = labels[10];  
 labels[6] =  labels[8];
 labels[7] =  labels[11];
 labels[8] =  labels[12];
 labels[9] =  textmsg[36];
 labels[10] =  textmsg[455];
 labels[11] =  m82;
function d1(m)
{
    var mstr = ''+Math.round(m*10);
    mstr = mstr.replace(/\..*$/,'');
    mstr = mstr.replace(/(.)$/,'.$1');
    mstr = mstr.replace(/\.0$/,'');
    return mstr;
}
var ismobile = function()
{
    return navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/BlackBerry/i)||
    navigator.userAgent.match(/iPhone|iPad|iPod/i)
    || navigator.userAgent.match(/Opera Mini/i)
   ||  navigator.userAgent.match(/IEMobile/i);
}
 var radius = 50;
 if (  ismobile()) radius = 100;

 var act =  "start,pause,resume,forward,backward,stop,pageicon,pagedown,pageup,time,status,close".split(/,/);
 document.write("<center>"+ title + "<table id=but cellspacing=1 ><tr height=" + (2*radius) + ">");
 for (var i=0; i < 12; i++)
 {
     if (i == 3 || i==6|| i==9)document.write("</tr><tr>");
     document.write("<td width=" + (2*radius) + " align=center valign=middle><div style=\"border-radius:" + (radius) + "px;width:" + (2*radius) + "px;height:" + (2*radius) + "px;background:radial-gradient(" + IBGCOLOR + "," + BBGCOLOR + ");color:#DDCC11;text-align:center;line-height:" + (2*radius) + "px;vertical-align:middle;font-size:" + Math.round(radius/2) + "px\" onclick=comm('" + act[i] + "',this)>" + labels[i] + "</div></td>");
 }
 document.write("</tr></table> "); 
 document.write("<div id=snap border=1 style=width:" + (600) + "px></div></center>");
var nopath = ";start,resume;stop,pause;stop,forward;stop,backward;stop,resume;resume,resume;start,start;start,resume;pause,start;pause,forward;pause,backward;pause,pause;forward,resume;backward,resume;";     
var tdaredoing;
var numaredoing;
var itemaredoing = 0; 
function selectget(td)
{
    var z = parseFloat(td.innerHTML);
    if (z < 0) z = 0;
    tdaredoing.innerHTML = d1(z).substring(0,3);
    times[ibeing][itemaredoing] = z; var fn = ['start','time','zindex'];
    var str = '';
    if (cdbeing==1) str = 'allShapes['+numaredoing+"]." + fn[itemaredoing-3] + "=" + z;
    else if (cdbeing==2) str = 'allLines['+numaredoing+"]." + fn[itemaredoing-3] + "=" + z;
    else if (cdbeing==4) str = 'allCurves['+numaredoing+"]." + fn[itemaredoing-3] + "=" + z;
    Msg.send({code:'send',msg:str});
    var tbl = td.parentNode.parentNode;
    if (tbl.tagName.toLowerCase()!='table') tbl = tbl.parentNode;
    tbl = tbl.parentNode;
    document.body.removeChild(tbl);
}
function selectnum(td,arr,z)
{
    tdaredoing = td;
    var x = document.createElement('div');
    var n = parseFloat(td.innerHTML);
    var xy = findPositionnoScrolling(td);
    x.style.cssText = 'position:absolute;left:' + xy[0] + 'px;z-index:103;border:1px grey solid;background-color:white';
    
    
    var str = '<table>';
    var j = 0;
    for (var i=0; i < arr.length; i++)
    {
        str += '<tr><td align=right onclick=selectget(this) style=font-weight:' + ((arr[0]>=0 && arr[i]==n)?7:4) + '00 >' +   d1(arr[i]) + '</td></tr>';
        if (arr[0]>=0 && arr[i] == n) j = i;
    }
    str += '</table>';
    x.innerHTML = str;
    document.body.appendChild(x);
    var y1 = x.offsetHeight/arr.length;
    if (arr[0] < 0) j = arr.length/2;
    var y = xy[1] - y1*j;
    
    x.style.top = y + 'px';
}
var cdbeing = '';
var ibeing = 0;
function changetm(td,num,k,cd,i)
{
    cdbeing = cd;
    ibeing = i;
    numaredoing = num;
    itemaredoing = k;
    var q = parseFloat(td.innerHTML);
    var q1 = q;
    if (q1 <= 1) q1 = 1;
     var arr = [];
     var m = Math.ceil(q1/10.0);
     var f = q - 10*m;
     if (f < 0) f += 1;
    for (var i=0; i < 20; i++) 
        arr[arr.length] = f+i*m;
    selectnum(td,arr); 
}

function color(s)
{
    var tbl = document.getElementById('but');
        for (var i=0; i < 3; i ++)
            for (var j=0; j < 3; j++)
            {
                var y = tbl.rows[i].cells[j].innerHTML;
                var l = y.indexOf('comm(');
                var k = y.indexOf(')',l)
                var q = y.substring(l+5,k).replace(/[^a-z]/g,'');
                
                var w = ";" + s + ',' + q + ";";
                
                    
                l = nopath.indexOf(w);
               
                if ( l >= 0)
                    tbl.rows[i].cells[j].getElementsByTagName('div')[0].style.backgroundColor = '#eeeeee';
                else
                    tbl.rows[i].cells[j].getElementsByTagName('div')[0].style.backgroundColor = 'silver';
            }
}
color('stop');
function comm(s,but)
{
    if ( nopath.indexOf(";" + current + "," + s + ";") >= 0)
    {
        return;
    }
    else 
    {
        current = s;
        color(s);
    }
    if (s == 'time')
    {
         var xs = textmsg[1772].split(/@/);
         xs[1] = m721;
         var xss   = "<table align=center border=1 style=border-collapse:collapse><tr bgcolor=lightblue><td><nobr><b>" + xs[0] + "</b></nobr></td><td><nobr><b>" + xs[6] + "</b></nobr></td><td><nobr><b>" + xs[1] + "</b></nobr></td><td align=right><nobr><b>" + xs[2] + "</b></nobr></td><td align=right><nobr><b>" + xs[3] + "</b></nobr></td><td align=right><nobr><b>" + textmsg[1772].split(/@/)[4] + "</b></nobr></td></tr>";
         
         for (var i=0; i < times.length; i++)
         {
                if (times[i].length <3) continue;
                var bgc = "";
                var shapename = times[i][1];
                if (shapename == null) continue;
                var cl = shapename.split(/\./)[1];
                shapename = shapename.replace(/\..*/,'').replace(/@/,'&');
                
                if (cl==null||cl=='') bgc = ";background-image:url(image/pic.jpg)";
                else if (cl!='transparent')
                    bgc = ";background-color:#" + cl;
                var str;
                var type = 2;
                if (shapename == 'circle'){type=1;
                    str ='<div   style="width:15px;height:15px' + bgc + ';border-radius: 50%"></div>';
                }else if (shapename == 'egg'){type=1;
                    str = '<div   style="width:15px;height:12px' + bgc + ';border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;"></div>';
                }else if (shapename == 'hexgon'){type=1;
                    str = '<div   style="font-size:15px' + bgc.replace(/background./,'') + '">&#11041;</div>';
                }else if (shapename == 'clouds'){type=1;
                    str = '<div   style="font-size:15px' + bgc.replace(/background./,'') + '">&#x2601;</div>';
                }else  if (shapename == 'ellipse'){type=1;
                   str = '<div   style="width:15px;height:13px' + bgc + ';border-radius: 50%/50%;"></div>';
               }else if (shapename == 'diamond'){type=1;
                    str =  '<div  style="font-size:15px' + bgc.replace(/background./,'') + '" >&diams;</div>';
                }else if (shapename == 'roundrect'){type=1;
                    str = "<div   style=\"width:14px;height:10px" + bgc + ";border-radius:3px;border:1px black solid\"><!----></div>";
                }else if (shapename == 'rightrect'){type=1;
                    str = "<div  style=\"width:14px;height:10px" + bgc + ";border:1px black solid;\"><!----></div>";
                }
                else
                {  
                    type= shapename.indexOf('c')==0?4:2; 
                    if (type==4)shapename = textmsg[1850].split(/@/)[5] + shapename.substring(1);  
                    str = "<div   style=\"" + bgc.replace(/background-/,'') + "\"><nobr>" + shapename + (shapename.indexOf('&')>=0?';':'') + "</nobr></div>";
                }
                
                xss += "<tr  bgcolor=lightyellow><td align=right style=color:#113344 >" + times[i][0] + "</td><td align=center  >" + str + "</td><td align=right style=color:#113344 >" + times[i][2] + "</td><td align=right bgcolor=white  onclick=changetm(this," + times[i][0].replace(/:.*/,'') +",3," + type + "," + i + ")>"+ times[i][3] + "</td><td align=right  bgcolor=white onclick=changetm(this," + times[i][0].replace(/:.*/,'') +",4," + type +"," + i + ")>"+ times[i][4] + "</td><td align=right  bgcolor=white onclick=changetm(this," + times[i][0].replace(/:.*/,'') +",5," + type + "," + i + ")>"+ times[i][5] + "</td></tr>";
               
         }
        
        var tbl =  document.getElementById('snap');
        tbl.innerHTML = xss + '</table>';
       
        Msg.send({code:"send",msg:'Play.sendnewsch()'});
    }
    else if (s == 'status')
    {
        Msg.send({code:'snap',msg:''});
    }
    else if (s == 'close')
    {
        Msg.send({code:'quit',msg:title});
        open("remote.jsp?t=<%=timestamp%>&current=-1&schedule=","_self");
    }
    else
    {
        
        if (s == 'pageicon')
        {
            if (but.innerHTML==labels[6])
            {
                but.innerHTML = topagelabel;
                Msg.send({code:"send",msg:'Play.pageicon()'});
            }
            else
            {
                but.innerHTML = labels[6];
                Msg.send({code:"send",msg:'Play.select()'});
            }
        }
        else
            Msg.send({code:"send",msg:'Play.'+s +'()'});
    }
}
var onloadbeforeremote = null;
if (typeof window.onload == 'function')
   onloadbeforeremote =  window.onload;
window.onload = function()
{
    if (onloadbeforeremote!=null) 
        onloadbeforeremote(); 
    Msg.init({stoken:securitytoken,
    app:"chat",
    tid:'',
    sid: tstmp ,
    sname: tstmp ,
    rid:'',
    code:'',
    key:  "remote<%=timestamp%>",
    sendhandle:"Msgretrive",
    sek:sek}); 
    Msg.recevhandle = "Msgretrive";
    Msg.send({code:"send",msg:'closeprompt()'});
}
 
Msg.handlepost = function(s)
{
    var m = new Message(s);
    //m.display("send return")
    if (m.code == 'snap')
    {
        var x = textmsg[1646].split(/@/);
        x[0] = x[0].replace(/s$/i,'');
        var seg = m.msg.split(/\|/);
        for (var i=1; i < seg.length; i++)
        seg[i] = seg[i].replace(/<table/, '<table width=100% border=1 style=border-collapse:collapse;border-radius:3px;background-color:white');
        var tbl =  document.getElementById('snap');
        tbl.innerHTML =  ("<table width=600  bgcolor=lightblue><tr><td  >" +x[0]+ seg[1]+ "</td></tr> <tr><td >" +x[1]+ seg[2]+ "</td></tr><tr><td >" +x[2]+ seg[3]+ "</td></tr></table>");
    }
    else if (m.code == "plain")
    {
        if (m.msg!='')// && m.rid==Msg.sek ) 
        { 
            var times1 = new CSVParse(m.msg,'"',',',';').nextMatrix();
            if (times1[0].length>4)
                times = times1;
        }
    }
}
function onunload()
{
    Msg.send({code:'quit'});
}
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
</script>
 
<iframe name="w<%=tstmp%>" width="1" height="1" />
</body>
</html>
<%
}          
%>

