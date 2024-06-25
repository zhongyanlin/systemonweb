<%@ page  import="telaman.*,java.sql.*,java.util.*,java.io.*,java.util.regex.*,java.net.*" contentType="text/html;charset=utf-8"%>
<%!
 
String title(String str, int col, int orgnum, CachedStyle cachedstyle) 
{
    return "<tr align=center height=42  ><td colspan=" + col + "   class=outset2 style=\"background:linear-gradient(" + Toolbox.headercl(cachedstyle.IBGCOLOR) + "," + Toolbox.headercl(cachedstyle.BBGCOLOR) + ");border:1px #bbb outset\" align=center><div class=\"forcurve1\" ><NOBR>" + str + "</NOBR></div></td></tr>";
}
%><%
  
int orgnum = Toolbox.setcharset(request,response);
 
String orgnumstr = request.getParameter("orgnum");
 
int orgnum0 = -1;
int ORGNUM = 0;
if (orgnumstr!=null)
{
    
   try
   {
       orgnum0 = Integer.parseInt(orgnumstr);
       if (orgnum0 >= 0)
       {
           int o1 = orgnum0%65536;
           ORGNUM = o1;
           int o2 = orgnum0>>16;
           if (o1 >= Toolbox.dbadmin.length) 
           {
               orgnum0 = -1;
           }
           else
           {
               if (o2 >= Toolbox.langs.length)
                   orgnum0 = -1;
           }
       }
       else
           orgnum0 = -1;
   } catch(Exception e){orgnum0 = -1;}
   if (orgnum0 == -1)
    {
        out.println("invalid orgnum");
        return;
    }
    orgnum = orgnum0;
}
if (orgnum < 0)
{
    orgnum = (Toolbox.langnum<<16); 
}
 
User  user = (User)(session.getAttribute("User"));
if (user == null || (orgnum%65536) != (user.orgnum)%65536)
{
    if (user!=null) session.removeAttribute("User");
    String path = "";///index0.jsp";
    String eid = request.getParameter("eid");
    if (eid!=null) path += "&eid=" + eid;
    if (orgnumstr!=null) path += "&orgnum=" + orgnumstr; 
    String qrcode = request.getParameter("qrcode");
    if (qrcode!=null) path += "&qrcode=" + qrcode;
    if (path.equals("")) path = "/index0.jsp";
    else path = "/index0.jsp?" + path.substring(1); 
 
    RequestDispatcher dispat = getServletConfig().getServletContext().getRequestDispatcher( path);
    dispat.forward(request, response);
    
     return; 
}
else if(user.roles == Systemroles.TA || user.roles == Systemroles.STUDENT || user.roles == Systemroles.STUDENT + Systemroles.TA) 
{
    String s = ((String)request.getAttribute("javax.servlet.forward.request_uri"));
    if (s == null) s = "";
    else 
    s = s.replaceFirst("[^\\?]+\\?","&").replaceFirst("&orgnum=[0-9]+", "");
    
    orgnum = Toolbox1.checkorgnum(orgnum);
    orgnum = user.orgnum;
    RequestDispatcher dispat = getServletConfig().getServletContext().getRequestDispatcher("/studentpage.jsp?orgnum=" + (orgnum) + "&sid=" + user.id );
    dispat.forward(request, response);
    return;
}
/*else if (user.roles == Systemroles.TA) 
{
    orgnum = Toolbox1.checkorgnum(orgnum);
    orgnum = user.orgnum;
    String s = ((String)request.getAttribute("javax.servlet.forward.request_uri")).replaceFirst("[^\\?]+\\?","&").replaceFirst("&orgnum=[0-9]+", "");
    
    RequestDispatcher dispat = getServletConfig().getServletContext().getRequestDispatcher("/gradebyta.jsp?orgnum=" + (orgnum) + s);
    dispat.forward(request, response);
    return;
}*/ 
if (orgnumstr!=null && orgnumstr.equals("" + orgnum))
{
    Cookie ck = new Cookie("orgnum", orgnumstr);
    ck.setMaxAge(60*60*24*1800);
    response.addCookie(ck);
     
}
orgnum = Toolbox1.checkorgnum(orgnum);
request.setCharacterEncoding(Toolbox.encodings[orgnum>>16]);
response.setCharacterEncoding(Toolbox.encodings[orgnum>>16]);
ORGNUM = orgnum%65536;
Toolbox.debuglevel =2;
String url1 = Toolbox1.geturl(request); 
String url = request.getRequestURL().toString();
boolean  nopass =DBAdmin.localnopass;
if (url.indexOf("//localhost")>0 || url.indexOf("//127.0.0.1")>0)
{
   url = url1;
}
else
{
    nopass = false; 
}
url = url.replaceFirst("index.jsp.*","");
if (!url.equals(Toolbox1.url) || Toolbox.defaultParam(orgnum,request, ("qrcode"), null)!=null)
{
    Toolbox1.makeqrcode(url,"qrcode.gif");
}
Toolbox.activeidletime =  session.getMaxInactiveInterval()-2;
long timenow = System.currentTimeMillis(); 
long tstmp = timenow % 10000000;
int n1 = ORGNUM;
int n2 = orgnum >> 16;
if (n1 >= Toolbox.dbadmin.length) n1 = 0;
if (n2 >= Toolbox.langs.length) n2 = Toolbox.langnum; 
String pagetitle= Toolbox.dbadmin[n1].unitname[n2]; 
  
if (pagetitle == null || pagetitle.equals(""))
    pagetitle =  Toolbox.emsgs(orgnum,906);
 
if (Toolbox.edition.contains("Personal"))
   pagetitle = Toolbox.emsgs(orgnum,1471);
else 
{
   int j = pagetitle.indexOf("/");
   if (j > 0)
   {
      pagetitle = "<span style=font-size:20px id=clientname><nobr>" + pagetitle.replaceFirst("/.*$","") + "</nobr></span><br><font face=\"STXinwei,Berlin Sans FB\" size=6><nobr>" + pagetitle.replaceFirst("[^/]+/","") + "</nobr></font>";
   }
}
boolean quickstart =  false; 
boolean quickstart4 =   false;
String style ="style=\"padding:0px;margin:0px;\"";
String currentSemester = Toolbox.dbadmin[ORGNUM].currentSemester;

GregorianCalendar newCal = new GregorianCalendar( );
CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
String DBGCOLOR = cachedstyle.DBGCOLOR;
String BBGCOLOR = cachedstyle.BBGCOLOR;
String IBGCOLOR = cachedstyle.IBGCOLOR;
String TBGCOLOR = cachedstyle.TBGCOLOR;
%><!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head>
<%=Toolbox.getMeta(orgnum)%>
<style type="text/css">
@keyframes  logorot
{
    0% {transform:rotate(0deg)}
    8% {transform:rotate(30deg)}
    16% {transform:rotate(60deg)}
    24% {transform:rotate(90deg)}
    33% {transform:rotate(120deg)}
    41% {transform:rotate(150deg)}
    50% {transform:rotate(180deg)}
    58% {transform:rotate(210deg)}
    66% {transform:rotate(240deg)}
    75% {transform:rotate(270deg)}
    83% {transform:rotate(300deg)}
    91% {transform:rotate(330deg)}
    100% {transform:rotate(360deg)}
}
@keyframes logorot1
{
    0% {transform:rotate(0)}
    10% {transform:rotate(2deg)}
    100% { transform:rotate(-360deg)}
}
@keyframes logorot2
{
    0% {transform:rotate(0)}
    10% {transform:rotate(2deg)}
    100% { transform:rotate(360deg)}
}

div.triangle {
	width: 0;
	height: 0;
	border-left: 5px solid transparent;
	border-right: 5px solid transparent;
	border-top: 10px solid white;
    display:inline;
}
.forcurve1{text-shadow:#060606 -1px -1px;text-align:center;font-weight:bold;color:#DDCC11;font-size:24px} 
.forcurve2{text-shadow:#060606 -1px -1px;text-align:inherit;font-weight:bold;color:#DDCC11;font-size:20px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;}
A:link
{
    COLOR:#225040;
    font-weight:700;
    TEXT-DECORATION: none
}
A:visited
{
    COLOR: <%=(orgnum>-1)?IBGCOLOR:"purple"%>;
    font-weight:700;
    TEXT-DECORATION: none
}
A:hover
{
    COLOR: white;
    font-weight:700;
    TEXT-DECORATION: underline
}
 
.withbg{background:<%=Toolbox.dbadmin[ORGNUM].bgimage%> <%=DBGCOLOR%> repeat-x;}
.label{color:#DDCC11;font-weight:700}
.floatLeft{float: left;}
.floatRight{float: right;}
.image-left{float: left; vertical-align: text-top;}
.image-right{float: right; vertical-align: text-top;}
div.wrapContainer{float:left;}
.I2B{color:#DDCC11;color:#DDCC11;border-bottom-left-radius:0px;border-bottom-right-radius:0px;border-top-left-radius:3px;border-top-right-radius:3px;text-shadow:-1px -1px #211411;padding:3px 3px 3px 3px;font-size:20px;background: <%="linear-gradient(" + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.BBGCOLOR) + ")"%>}
.outset3{border-top-left-radius:4px;-webkit-border-top-left-radius:4px;-moz-border-top-left-radius:4px;border-top-right-radius:4px;-webkit-border-top-right-radius:4px;-moz-border-top-right-radius:4px;background:<%="linear-gradient(" + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.BBGCOLOR) + ")" %>;border:2px #C25314 outset;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>}
.outset4{border-bottom-left-radius:4px;-webkit-border-bottom-left-radius:4px;-moz-border-bottom-left-radius:4px;border-top-right-radius:4px;-webkit-border-top-right-radius:4px;-moz-border-top-right-radius:4px;background:<%=Toolbox.dbadmin[ORGNUM].bgimage%>;border:1px #F5F5F5 outset}
.outset1{border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;background:<%=Toolbox.dbadmin[ORGNUM].bgimage%>;border:1px #F5F5F5 outset}
.outset2{border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;background:<%="linear-gradient(to right," + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ")"%>;border:2px #C25314 outset;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;}
input.BlueButton{padding-top:3px;padding-bottom:2px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;margin:0px;width:70px;overflow:visible;background:url("image/BlueButton.gif") #00BBBB;color:antiquewhite;font-weight:700;border:1px #b0b0b0 outset;text-shadow:-1px -px #999}
input.GreenButton{padding-top:3px;padding-bottom:2px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;margin:0px;width:auto;overflow:visible;background:url("image/GreenButton.gif") #00BBBB;color:antiquewhite;font-weight:700;border:1px #b0b0b0 outset;text-shadow:-1px -px #999}
input.OrangeButton{padding-top:3px;padding-bottom:2px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;margin:0px;width:70px;overflow:visible;background:url("image/OrangeButton.gif") orange;color:antiquewhite;font-weight:700;border:1px #b0b0b0 outset;text-shadow:-1px -px #999}
.textbox{border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;border:1px #b0b0b0 solid !important;width:120px;font-size:16px}
div.circle{font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-weight:700;width:20px;height:20px;border-radius:10px;font-size:15px;color:<%=IBGCOLOR%>;line-height:20px;text-align:center;background-color:white} 
.bbg{
    background:radial-gradient(circle at 5%,<%=cachedstyle.BBGCOLOR%>,<%=cachedstyle.IBGCOLOR%>)
}
</style> 
<script type=text/javascript>
var ORGNUM = <%=ORGNUM%>;
var timenowstr="<%=newCal.get( Calendar.DAY_OF_WEEK )%>";; 
var timenowsec= <%= timenow%> - (new Date()).getTime(); 


var tstmp = <%=tstmp%>;
var bgindex =  '<%=Toolbox.dbadmin[ORGNUM].bgimage%>';
var font_size= <%=(user==null)?Toolbox.defaultFontSize:cachedstyle.fontsize%>;
var encoding = '<%=Toolbox.encodings[orgnum>>16]%>';
var langcode = "<%= Toolbox.langs[orgnum>>16]%>";
var charsize = <%=Toolbox.locales[orgnum>>16].charsize%>;
var systemnamestr = '<%=pagetitle.replaceFirst(".*(<span[^>]*>[^<]+</span>).*","$1")%>';
var tmg82 = '<%=Toolbox.emsgs(orgnum,82)%>';
var tmg995 = '<%=Toolbox.emsgs(orgnum,995)%>';
var userroles = <%=user.roles%>;
var userid = "<%=user.id%>";
var timeformat = "<%=cachedstyle.timeformat%>";
var currentSemester = "<%=currentSemester%>";
var edition = "<%=Toolbox.edition%>";
var url = "<%=url%>";
window.title = "<%=Toolbox.emsgs(orgnum,515)%>";
var demostr = "<%=Toolbox.emsgs(orgnum,1584)%>";
<%

if (!url1.contains("orgnum=")) 
{
    if (url1.contains("?"))
        url1 += "&orgnum=" + orgnum;
    else 
        url1 += "?orgnum=" + orgnum;
}
if (user!=null) out.println("let theurl = '" + url1 + "';");
String err = "";
JDBCAdapter adapter = null;
String nummsg = "", numsub = "", numins = "";
if (Systemroles.owndb(user.roles)) 
{
    int n = 0;
    if (user.changedb(user.id)) 
    {
        adapter = Toolbox.getUserAdapter(user, orgnum);
        

        err = adapter.error();
        if (n > 0) 
        {
            String nummsg1 = adapter.getValueAt(0, 0);
            if (!nummsg1.equals("0")) 
            {
                nummsg = "<font color=#AA0000>(" + nummsg1 + ")</font>";
            }
        }
        n = 0;
        String sql = "SELECT count(*) FROM Submission, Assignment  WHERE Submission.semester=Assignment.semester AND Assignment.grader LIKE '%" + user.id + "%' AND Submission.semester='" + currentSemester + "' AND Submission.course=Assignment.course AND Submission.assignname=Assignment.name  AND (grade=-1 or grader=-2 AND Assignment.due < " + timenow / 1000 + ") ";
        if (err.equals("")) 
        {
            // n = adapter.executeQuery(sql);
        } 
        else 
        {
            err = Toolbox.emsgs(orgnum, 934) + "<br>Or<br>" + Toolbox.emsgs(orgnum, 117);
        }

        if (n > 0) 
        {
            String numsub1 = adapter.getValueAt(0, 0);
            if (!numsub1.equals("0")) 
            {
                numsub = "<font color=#AA0000>(" + numsub1 + ")</font>";
            }
        }

        MsgTopic mq = MsgTopic.search(orgnum,"chat","");
        if (mq != null && (n = mq.topics.size()) > 1) 
        {
            numins = "<font color=#AA0000>(" + n + ")</font>";
        }
        
        if ((user.roles & Systemroles.SYSTEMADMIN) > 0 || (user.roles & Systemroles.TEACHINGADMIN) > 0) 
        {
            if (!Toolbox.edition.contains("Personal") && (user.flags & 1) > 0) 
            {
                quickstart4 = true;
            }
        }

        if ((user.roles & Systemroles.INSTRUCTOR) > 0) 
        {
            int ii = 0;
            if ((user.flags & 1) > 0) 
            {
                quickstart = true;
            }

            n = adapter.executeQuery("SELECT TimeSlot.timeslot,room,0,NULL FROM Session, TimeSlot WHERE Session.schedule=TimeSlot.num AND Session.instructor='" + user.id + "' AND Session.semester='" + currentSemester + "' UNION "
                    + " SELECT Schman.timeslot, event, startdate, enddate FROM Schman where owner='" + user.id + "' OR owner=''"
            );

            if (n > 0) 
            {
                out.print("var timeslots = [");
                for (int i = 0; i < n; i++) 
                {
                    out.print("[\"" + adapter.getValueAt(i, 0) + "\",\"" + adapter.getValueAt(i, 1) + "\",\"" + adapter.getValueAt(i, 2) + "\",\"" + adapter.getValueAt(i, 3) + "\"]");
                    if (i < n - 1) 
                    {
                        out.println(",");
                    } 
                    else 
                    {
                        out.println("];");
                    }
                }

            } 
            else 
            {
                out.print("var timeslots = [];");
            }
        }
        
    }
    adapter.close();
}
quickstart = (user.roles & Systemroles.INSTRUCTOR)>0 ; 
quickstart4 = (user.roles & Systemroles.TEACHINGADMIN) > 0; 
 
if (quickstart)
{%>
   var quickstartarr = ['<%=Toolbox.emsgs(orgnum,1441).replaceAll("'","\\'").replaceAll("\n", "','") %>'];
<%}
 
if (quickstart4)
{%>
   var quickstart4arr = ['<%=Toolbox.emsgs(orgnum,1445).replaceAll("'","\\'").replaceAll("\n", "','") %>'];
<%}
%>
var err = "<%=err.replace('"',' ')%>";
var initstatus = <%=Toolbox.initstatus%>; 
var cachedfontname = '<%=cachedstyle.fontname%>';
localStorage['myfontname'] = cachedfontname;
var backup = '<%=Toolbox.emsgs(orgnum,839)%>';
function execmjp(browserhint)
{
  if (browserhint == null)
  {
    <%=Toolbox.msgjspout((orgnum%65536)+user.id, true).replaceFirst("var ugentmsg=", "ugentmsg +=")%>
  }
  else
  {
   <%=Toolbox.msgjspout((orgnum%65536)+user.id, true)%>
  }
}
var enlang = [<% for (int i=0; i < Toolbox.langs.length; i++){if (i>0) out.print(",");out.print("'"+Toolbox.langs[i] +"'");}%> ];
var unic = [<% for (int i=0; i < Toolbox.langs.length; i++){if (i>0) out.print(",");out.print("'"+Toolbox.locales[i].langname+"'");}%> ];
var nummsg = '<%=nummsg%>', numsub = '<%=numsub %>', numins = '<%= numins %>';
<%=(orgnum>-1?Toolbox.dbadmin[ORGNUM].colors(orgnum, cachedstyle):"var orgnum=0")%>, securitytoken="<%=Toolbox.gentoken("index.jsp","f1")%>"; 
<%=(orgnum>=0?Toolbox.someconsts(orgnum):"" )%>
var allfonts = '<%=Toolbox.emsgs(orgnum,1497)%>'.split(/;/);    
</script>
<script type=text/javascript   src="<%=Toolbox.getUserLang(orgnum)%>" ></script>

<script type="text/javascript" src=funblock<%=ORGNUM%>.js></script>
 <script type=text/javascript  src=cookie.js></script>
<script src="index.js" ></script>

<title><%=Toolbox.emsgs(orgnum,515)%></title>
</head>  
<body style="background:linear-gradient(0deg,<%=DBGCOLOR%>,<%=BBGCOLOR%>);margin:0px 0px 0px 0px" >
<table id=maintbl cellpadding="0" cellspacing="0" align=center>
<tr><td style="background:url(image/zz1.png) repeat-y" width=5></td>
<td >   
<table width=818 align=center cellpadding="0" cellspacing="8" border="0" bgcolor=<%=IBGCOLOR%>>
  <tr >
   <td colspan=2  align=center   class=bbg style="border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;background:radial-gradient(close to 5%, <%=cachedstyle.BBGCOLOR%>,<%=Toolbox.headercl(cachedstyle.IBGCOLOR)%>)
    ;border:1px #bbb outset">
 <table align=center style="border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;" cellpadding="0" cellspacing="0" width="100%">
 <tr  height="100">
 <td  width=100 align=left  >
  <div  style="background:radial-gradient(<%=cachedstyle.TBGCOLOR%>,<%=cachedstyle.BBGCOLOR%>);position:relative;width:76px;height:76px;border-radius:38px;border:1px <%=IBGCOLOR%> inset"   onclick="biggerqrcode()">
 <!--img name="logo" height=100 width=100 src=image/progress.png style="margin:0px 0px 0px 0px;border:0px;border-radius:50px;animation:logorot 1.2s infinite" onclick="biggerqrcode()"-->
 <img id="logo1" height=70 width=70 src=image/tm2.gif style="position:absolute;border:0px;top:0px;left:0px;animation:logorot1 5s infinite"  >
 <img id="logo2" height=70 width=70 src=image/tm1.gif style="position:absolute;border:0px;top:0px;left:2px; ">
  </div>
 </td>
 <td  id="plate"    align=center valign="top">  <div  onclick="<%= (user!=null)?("qrlink(false)"):("biggerqrcode()") %>"   class="forcurve1" style="margin:20px;text-align:center;" ><%=pagetitle%></div>
      
  </td>
   <td width=140 align=center valign="middle">
       <table  cellspacing=0 cellpadding="0" style="margin:0px 0px 0px 0px"><tr>
               <td><span style="font-size:14px;background-color:<%=IBGCOLOR%>;color:#ddcc11;border:1px #777777 solid;width:100px;"  >  <nobr><%=user.id%> </nobr></span></td><td width="5"></td>
               <td><span style="font-size:14px;background-color:<%=IBGCOLOR%>;color:white;border:1px #777777 solid;width:100px;" onclick="javascript:openlink(logouti)">  <nobr><%=Toolbox.emsgs(orgnum,534)%> </nobr></span></td><td width="5"></td>
               <td>
   <% if (  Toolbox.langs.length>1){%>
   <span style="background-color:<%=IBGCOLOR%>;color:white;font-size:14px;border:1px #777777 solid;width:100px;" onclick="changeencoding(this,'<%=Toolbox.langs[orgnum>>16] %>')"> <%=  (Toolbox.locales[orgnum>>16].langname)%>&vellip; </span>
   <%}%> </td></tr></table> 
   <div class=outset2 style="background-image:linear-gradient(-60deg,#C25314,#C28976 30%,#C25314);border-Radius:6px;color:#DDCC11;font-size:18px;font-weight:700;text-align:center;text-shadow:#707070 -1px -1px;border:1px #ccc outset;margin:0px 0px 0px 0px"><%=Toolbox.emsgs(orgnum,1442)%><br>
        <img src=image/tm.png height=33 width=140px  >
   </div> 
   <table cellspacing=0 cellpadding="0" style="margin:0px 0px 0px 0px"><tr>
              <td width="100" align="right"  >
                <input id="pat" class="box" size="8" name="pat"  >
              </td><td align="left"  >
                  <input type="button" w="" class="GreenButton" style="width: 68px; cursor: pointer;text-shadow:-1px -1px #999" name="patbut" value="<%=Toolbox.emsgs(orgnum, 37)%>" onmouseout="removeline()" onclick="javascript:search()">
              </td>
            </tr></table> 
   </td></tr>
  
   </table>
   </td>
  </tr> 
   <%  
    int w1 = 40, w2=20, w3=40, w4=0,  w6=160;
     
    if ( (Systemroles.INSTRUCTOR & user.roles)>0 || (Systemroles.TEACHINGADMIN & user.roles)>0)
    {
        w1 = 27; w2=20;w3=27;w4=26; 
    }
 %>       
<tr height="30">
    <td valign="middle" style="height:30px" align=center colspan=2>
<table width="70%" style="margin:0px 0px 0px 0px" cellspacing="4" cellpadding=0 align=center >
         <tr height="30">
 <%if ( (Systemroles.INSTRUCTOR & user.roles)>0 || (Systemroles.TEACHINGADMIN & user.roles)>0){%>
<td align=center  width="<%=w4%>%"><div class="outset1" style="text-align:center;width:160px;padding:2px 2px 2px 2px;background-position:-30px 0px;border:1px #bbb outset"><a href="javascript:showquickstart()" ><span  style="font-weight:bold"><nobr><%=Toolbox.emsgs(orgnum,1585)  %></nobr></span></a></div></td> <%}%> 


 <td align=center  width="<%=w1%>%" ><div  class=outset1 style="width:<%=w6%>px;padding:2px 2px 2px 2px;background-position:-30px 0px;border:1px #bbb outset"><a href="index.html"><span  style="font-weight:bold"><nobr><%=Toolbox.emsgs(orgnum,266)%></nobr></span></a></div></td>
 

<td width="<%=w3%>%" align="center"><div  class=outset1 style="width:<%=w6%>px;padding:2px 2px 2px 2px;overflow:display;background-position:-230px 0px;border:1px #bbb outset;text-align: center"><a href="javascript:openit('studentpage.jsp',this)"><span  style="font-weight:bold"><nobr><%=Toolbox.emsgs(orgnum,1229)%></nobr></span></a></div></td>
 
<td align=center  width="<%=w2%>%" >
   <form rel=opener name=ff style="margin:0px 0px 0px 0px" method=post action=follows.jsp  >
   <table style="margin:0px 0px 0px 0px" cellspacing="0">
   <tr>
   <td> <input type="hidden" name="securitytoken=" value="<%=Toolbox.gentoken("index.jsp","ff")%>" >
   <input type="hidden" name=x value=fontsize>
   </td><td>
   <font color=#DDCC11><nobr><%=Toolbox.emsgs(orgnum,358)%></nobr></font>
   </td><td><select name=fontsize class="outset1" style="color:#225580" onchange="javascript:chgfontsize(this)">
   <% for (int i=8; i < 40; i++)
      out.println("<option value=" + i +" " + ((i==cachedstyle.fontsize)?"selected":"") +">" + i + "</option>");
   %>
   </select >
   </td>        
   <td>
    
   <td style=color:white onclick="moresetting()"  align="right">&vellip;</td>
   </tr></table>
   </form>
   </td>

</tr></table>
    
    
    </td>
  </tr>
 
  <% 
if ( (user.roles & Systemroles.INSTRUCTOR)>0 ||  (user.roles & Systemroles.ASSESSER)>0) { 
%>
<%=title(Toolbox.emsgs(orgnum,516),2,orgnum,cachedstyle)%>  


   <tr id="insrow">
     <td valign=top width="50%">
      <script type="text/javascript"  > blnum = 0;   document.write(block(1));</script>
     </td> <td  valign=top width="50%">
      <script type="text/javascript"  >  document.write(block(2));</script>
     </td>
   </tr>   
<%

}%> 


<% if ( ((user.roles & Systemroles.TEACHINGADMIN) > 0 ||  (user.roles & Systemroles.ASSESSER)>0)
        && (Toolbox.edition.contains("Institution") 
         || Toolbox.edition.contains("Enterprise") ) ) {%>
<%=title(Toolbox.emsgs(orgnum,882),2,orgnum,cachedstyle)%> 


   
  <tr  id="tearow">
  <td  valign=top width=50%>
  <script type="text/javascript"  > blnum = 0;  document.write(block(3));</script>
  </td> 
  <td  valign=top width=50%>
  <script type="text/javascript"  >             document.write(block(4));</script>
  </td> 
  </tr>

  <tr>
  <td  valign=top width=50%>
  <script type="text/javascript"  >    document.write(block(5));</script>
  </td> 
  <td  valign=top width=50%>
  <script type="text/javascript"  >             document.write(block(6));</script>
  </td> 
  </tr>
 <%
  

 }%>  

 <% if ( ( (user.roles & Systemroles.REGISTER) > 0 ||  (user.roles & Systemroles.ASSESSER)>0) && (Toolbox.edition.contains("Institution") 
        || Toolbox.edition.contains("Enterprise"))) {%>
  <%=title(Toolbox.emsgs(orgnum,1103),2,orgnum,cachedstyle)%>    
  <tr>
  <td  valign=top width=50%>
  <script type="text/javascript"  > blnum = 0;  document.write(block(7));</script>
  </td> 
  <td  valign=top width=50%>
  <script type="text/javascript"  >   document.write(block(8));</script>
  </td> 
  </tr>
<%}%>

<% if ( ( (user.roles & Systemroles.SYSTEMADMIN) > 0 ||  (user.roles & Systemroles.ASSESSER )>0)    ) {%>
  <%=title(Toolbox.emsgs(orgnum,883),2,orgnum,cachedstyle)%>    
  <tr>
  <td  valign=top width=50%>
  <script type="text/javascript"  > blnum = 0;  document.write(block(9));</script>
  </td> 
  <td  valign=top width=50%>
  <script type="text/javascript"  >   document.write(block(10));</script>
  </td> 
  </tr>
<%}%>
 
<% 
if (  (user.roles & Systemroles.SYSTEMANALYST) > 0 && !Toolbox.edition.contains("Personal")  ) {
 
%>
  <%=title(Toolbox.emsgs(orgnum,884),2,orgnum,cachedstyle)%> 
  <tr><td  valign=top width=50%>
  <script type="text/javascript"  > blnum = 0;  document.write(block(11));</script>
  </td>  
    <td  valign=top width="50%" >
  <script type="text/javascript"  >   document.write(block(12));</script>
  </td></tr>
  <%}%> 
 
 <%  if (  user.roles   > 1 ) {%>   
   <%=title(Toolbox.emsgs(orgnum,1230),2,orgnum,cachedstyle)%>
 <tr>
     <td  valign=top width="50%">
        <script type="text/javascript"  > blnum = 0;   document.write(block(13));</script>
     </td>
     <td  valign=top width="50%">
       <script type="text/javascript"  >  document.write(block(14));</script>
     </td>
   </tr> 
<% }%>
  
   <tr>
     <td  valign=top width="50%">
       <script type="text/javascript"  >  document.write(block(15)); </script>
     </td>
     <td  valign=top width="50%">
      <script type="text/javascript"  >  document.write(block(16));</script>
     </td>
   </tr>  







   <% if (Toolbox.edition.contains("Institution")   || Toolbox.edition.contains("Enterprise"))
   {%>
   
<!--script>
if ( funblocks.length>16)
    document.write('<%=title(Toolbox.emsgs(orgnum,1444),2,orgnum,cachedstyle).replaceAll("[\r|\n]","")%>');
blnum = 0;  
for (var fbi=16; fbi < funblocks.length; fbi+=2)
{
    var d1 = (block(fbi+1));
    var d2 = (block(fbi+2));
    if (d1!='' || d2!='')  
    document.write('<tr><td  valign=top width="50%">' + d1+ '</td><td  valign=top width="50%">' + d2 + '</td></tr>');  
        
}
</script-->
<% }%>
 
 
</table>
<table cellpadding=0 cellspacing=0 align=center width=100%  style="background-color:<%=IBGCOLOR%>"><tr>
<td align=center id="copyright"> 
<font size=-1 color=<%=DBGCOLOR%> ><nobr> <%= Toolbox.copyright[orgnum>>16]%> </nobr></font> 
</td>
</tr></table>
</td><td style="background:top left url(image/zz3.png) repeat-y" width=5></td></tr></table> 
<script type="text/javascript"  src="curve.js" ></script>
<script type="text/javascript"  src="clock.js" ></script> 
<script type="text/javascript"  src="setting.js" ></script> 
<form rel=opener name="postform" method="POST"  ></form> 

<iframe name="w<%=tstmp%>" width="1" height="1"  style="visibility:hidden" src="" /> 
</body>
</html>
 
 


