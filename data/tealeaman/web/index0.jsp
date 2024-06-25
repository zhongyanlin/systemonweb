<%@ page  import="telaman.*,java.sql.*,java.util.*,java.io.*,java.util.regex.*,java.net.*" contentType="text/html;charset=utf-8"%>
<%!
long getCurrentTimezoneOffset() 
{
    TimeZone tz = TimeZone.getDefault();  
    Calendar cal = GregorianCalendar.getInstance(tz);
    long offsetInMillis = tz.getOffset(cal.getTimeInMillis());
    return offsetInMillis;
} 
%><%
    int orgnum = Toolbox.setcharset(request, response);
    String orgnumstr0 = request.getParameter("orgnum0");
    CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
    int n0 = -1;
    if (orgnumstr0!=null && orgnumstr0.replaceAll("[0-9]","").equals("")) 
    {
        int m = 0; try{ m = Integer.parseInt(orgnumstr0);}catch(Exception e){}
        String orgstr = Toolbox1.GetCookie(request, "orgnum");
        if (orgstr != null)
        {
            n0 = Integer.parseInt(orgstr);
            n0 = (n0 - (n0%65536)) + m;
        }
        else 
        {
            n0 = (Toolbox.langnum<<16) + m;
        }
    }
    
    
    String orgnumstr;
    if (n0>-1)  
        orgnumstr = "" + n0;
    else  
        orgnumstr = request.getParameter("orgnum");
    
    int orgnum0 = -1;
    int ORGNUM = 0;
    if (orgnumstr != null) {
        try {
            orgnum0 = Integer.parseInt(orgnumstr);
            if (orgnum0 >= 0) {
                int o1 = orgnum0 % 65536;
                ORGNUM = o1;
                int o2 = orgnum0 >> 16;
                if (o1 >= Toolbox.dbadmin.length) {
                    orgnum0 = -1;
                } else if (o2 >= Toolbox.langs.length) {
                    orgnum0 = -1;
                }
            } else {
                orgnum0 = -1;
            }
        } catch (Exception e) {
            orgnum0 = -1;
        }
        if (orgnum0 == -1) {
            out.println("invalid orgnum");
            return;
        }
        orgnum = orgnum0;
    }
    if (orgnum==-1)
        orgnum = (Toolbox.langnum << 16);
    
    orgnum = Toolbox1.checkorgnum(orgnum);
   
    ORGNUM = orgnum % 65536;
   
    if (orgnum >= 0 && Toolbox.dbadmin != null && Toolbox.dbadmin.length > 0 && Toolbox.dbadmin[ORGNUM].phase < 3) {
        String contextPath = request.getContextPath();
        response.sendRedirect(contextPath + "/cfgdb.jsp");
        return;
    } else if (!Toolbox.filehash.equals("") && Toolbox.license.equals("")) {                                                 // '??encoding??','??platform??'
        String contextPath = Toolbox.urls[0].replaceFirst("Sboot", "DataForm?rdap=slicense&product=" + Toolbox.appname + "&version=" + Toolbox.version + "&edition=" + Toolbox.edition.replaceFirst("\\+", "%2B") + "&platform=" + System.getProperty("os.name").replaceAll(" .*$", "").toLowerCase() + "&encoding=" + Toolbox.encoding);
        response.sendRedirect(contextPath);
        return;
    }
    request.setCharacterEncoding(Toolbox.encodings[orgnum >> 16]);
    response.setCharacterEncoding(Toolbox.encodings[orgnum >> 16]);
    
    Toolbox.debuglevel = 2;

    String url = request.getRequestURL().toString();
    boolean nopass = DBAdmin.localnopass;
    if (url.indexOf("//localhost") > 0 || url.indexOf("//127.0.0.1") > 0) {
        url = Toolbox1.geturl(request);
    } else {
        nopass = false;
    }
    url = url.replaceFirst("index[0]?.jsp.*", "");
    if (!url.equals(Toolbox1.url) || Toolbox.defaultParam(orgnum, request, ("qrcode"), null) != null) {
        Toolbox1.makeqrcode(url, "qrcode.gif");
    }
    Toolbox.activeidletime = session.getMaxInactiveInterval() - 2;
    long timenow = System.currentTimeMillis();
    long tstmp = timenow % 10000000;

    int n1 = ORGNUM;
    int n2 = orgnum >> 16;

    if (n1 >= Toolbox.dbadmin.length) {
        n1 = 0;
    }
    if (n2 >= Toolbox.langs.length) { 
        n2 = Toolbox.langnum;
    }
    
    String pagetitle = Toolbox.dbadmin[n1].unitname[n2];

    if (pagetitle == null || pagetitle.equals("")) {
        pagetitle = Toolbox.emsgs(orgnum, 906);
    }

    if (Toolbox.edition.contains("Personal")) {
        pagetitle = Toolbox.emsgs(orgnum, 1471);
    } else {
        int j = pagetitle.indexOf("/");
        if (j > 0) {
            //  pagetitle = "<span style=font-size:20px><nobr>" + pagetitle.replaceFirst("/.*$","") + "</nobr></span><br><span style=\"STXinwei,Berlin Sans FB;font-size:22px\"><nobr>" + pagetitle.replaceFirst("[^/]+/","") + "</nobr></span>";
   
            pagetitle = "<span style=font-size:20px><nobr>" + pagetitle.replaceFirst("/.*$", "") + "</nobr></span><br><span style=font-size:28px><font face=\"STXinwei,Berlin Sans FB\"><nobr>" + pagetitle.replaceFirst("[^/]+/", "") + "</nobr></font></span>";
        }
    }
    boolean quickstart = false;
    boolean quickstart4 = false;
    String style = "style=\"padding:0px;margin:0px;\"";
    String ibc =  cachedstyle.IBGCOLOR;
    String bbc =  cachedstyle.BBGCOLOR;
    
%><!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head>
<%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
<style type="text/css">
 
.bbg{
    background:radial-gradient(circle at 5%,<%=bbc%>,<%=ibc%>)
}
    
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
.line {
  fill: none;
  stroke: #000;
  stroke-width: 1.5px;
  stroke:#DDCC11
}
@keyframes glimpse0
{   /*[[500,20],[450,10],[520,30],[530,70],[540,45]];*/
     0%{color:#DDCC11;opacity:0.0; top:130px; left:300px}
     50%{color:#DDCCEE;opacity:0.8; top:20px; left:600px}
     60%{color:#FFFFFF;opacity:1.0; top:20px; left:620px}
     
}
@keyframes glimpse1
{   /*[[500,20],[450,10],[520,30],[530,70],[540,45]];*/
     0%{color:#DDCC11;opacity:0.0; top:130px; left:600px}
     45%{color:#CCEEFF;opacity:0.6; top:10px; left:520px}
     55%{color:#FFFFFF;opacity:1.0; top:10px; left:560px}
     
}
@keyframes glimpse2
{   /*[[500,20],[450,10],[520,30],[530,70],[540,45]];*/
     0%{color:#DDCC11;opacity:0.0; top:130px; left:200px}
     50%{color:#EECCEE;opacity:1.0; top:30px; left:620px}
     70%{color:#FFFFFF;opacity:1.0; top:30px; left:630px}
   
}
@keyframes glimpse3
{   /*[[500,20],[450,10],[520,30],[530,70],[540,45]];*/
     0%{color:#DDCC11;opacity:0.0; top:130px; left:260px}
     30%{color:#DDCCAA;opacity:1.0; top:70px; left:530px}
     40%{color:#EEFFEE;opacity:1.0; top:80px; left:650px}
   
}
@keyframes glimpse4
{   /*[[500,20],[450,10],[520,30],[530,70],[540,45]];*/
     0%{color:#DDCC11;opacity:0.0; top:130px; left:200px}
     40%{color:#DDCCEE;opacity:0.7; top:45px; left:620px}
     60%{color:#FFEEFF;opacity:1.0; top:51px; left:660px}
    
}
  
div.triangle {
	width: 0;
	height: 0;
	border-left: 5px solid transparent;
	border-right: 5px solid transparent;
	border-top: 10px solid white;
    display:inline;
}
.forcurve1{text-shadow:#060606 -1px -1px;text-align:center;font-weight:bold;color:#DDCC11;font-size:30px} 
.forcurve2{text-shadow:#060606 -1px -1px;text-align:inherit;font-weight:bold;color:#DDCC11;font-size:20px}
A:link
{
    COLOR:#225040;
    font-weight:700;
    TEXT-DECORATION: none
}
A:visited
{
    COLOR: <%=(orgnum>-1)?Toolbox.dbadmin[ORGNUM].IBGCOLOR:"purple"%>;
    font-weight:700;
    TEXT-DECORATION: none
}
A:hover
{
    COLOR: white;
    font-weight:700;
    TEXT-DECORATION: underline
}
.withbg{background:<%=Toolbox.dbadmin[ORGNUM].bgimage%> <%=Toolbox.dbadmin[ORGNUM].DBGCOLOR%> repeat-x;}
.label{color:#DDCC11;font-weight:700}
.floatLeft{float: left;}
.floatRight{float: right;}
.image-left{float: left; vertical-align: text-top;}
.image-right{float: right; vertical-align: text-top;}
div.wrapContainer{float:left;}
.outset3{border-top-left-radius:4px;-webkit-border-top-left-radius:4px;-moz-border-top-left-radius:4px;border-top-right-radius:4px;-webkit-border-top-right-radius:4px;-moz-border-top-right-radius:4px;background:<%="linear-gradient(" + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ")"%>;border:2px #C25314 outset;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>}
.outset4{border-bottom-left-radius:4px;-webkit-border-bottom-left-radius:4px;-moz-border-bottom-left-radius:4px;border-top-right-radius:4px;-webkit-border-top-right-radius:4px;-moz-border-top-right-radius:4px;background:<%=Toolbox.dbadmin[ORGNUM].bgimage%>;border:1px #F5F5F5 outset}
.outset1{border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;background:<%=Toolbox.dbadmin[ORGNUM].bgimage%>;border:1px #F5F5F5 outset}
.outset2{border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;background:<%="linear-gradient(" + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ")"%>;border:2px #C25314 outset;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;}
input.GreenButton{border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;margin:0px;padding:0px;width:auto;overflow:visible;background:url("image/GreenButton.gif") #00BBBB;color:antiquewhite;font-weight:700;border:1px #999 outset;font-size:18px;text-shadow:-1px -1px #777}
input.OrangeButton{border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;margin:0px;padding:0px;width:auto;overflow:visible;background:url("image/OrangeButton.gif") #00BBBB;color:antiquewhite;font-weight:700;border:1px #b0b0b0 outset;font-size:18px}
.textbox{border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;border:1px #b0b0b0 solid !important;width:120px;font-size:16px}
div.circle{font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-weight:700;width:20px;height:20px;border-radius:10px;font-size:15px;color:<%=Toolbox.dbadmin[ORGNUM].IBGCOLOR%>;line-height:20px;text-align:center;background-color:white} 
#major{float: left; width: 380px; height: 312px; border-top-right-radius: 35px; border-bottom-right-radius: 35px; border: 1px solid rgb(96, 96, 96); position: relative; background:radial-gradient(ellipse at right, <%=cachedstyle.BBGCOLOR%>, transparent),radial-gradient(ellipse at left, <%=cachedstyle.DBGCOLOR%>, transparent); 
       margin: 10px 0px 30px -40px; font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>}
.I2B{color:#DDCC11;color:#DDCC11;border-bottom-left-radius:0px;border-bottom-right-radius:0px;border-top-left-radius:3px;border-top-right-radius:3px;text-shadow:-1px -1px #211411;padding:3px 3px 3px 3px;font-size:20px;background: <%="linear-gradient(" + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.BBGCOLOR) + ")"%>}
  
</style> 
<script type="text/javascript"> 
<%=(orgnum>-1?Toolbox.dbadmin[ORGNUM].colors(orgnum, cachedstyle):Toolbox.dbadmin[0].colors(orgnum, cachedstyle))%>, securitytoken="<%=Toolbox.gentoken("index.jsp","f1")%>"; 
var tzid = <%=getCurrentTimezoneOffset()%>;
var ORGNUM = <%=ORGNUM%>;
var timenowsec= <%= timenow%> - (new Date()).getTime(); 
var tstmp = <%=tstmp%>;
var timenow = <%=timenow%>;
var timenowstr0 = '<%= Toolbox.timestr(timenow/1000,"MM/DD/YYYY hh:mm:ss")%>';
var bgindex =  '<%=Toolbox.dbadmin[ORGNUM].bgimage%>';
var font_size=<%= Toolbox.defaultFontSize %>;
var charsize = <%=Toolbox.locales[orgnum>>16].charsize%>;
var systemnamestr = '<%=pagetitle.replaceFirst(".*(<span[^>]*>[^<]+</span>).*","$1")%>';
var tmg82 = '<%=Toolbox.emsgs(orgnum,82)%>';
var tmg995 = '<%=Toolbox.emsgs(orgnum,995)%>';
var msg560 = "<%=Toolbox.emsgs(orgnum,560)%>";
var msg192 = "<%=Toolbox.emsgs(orgnum,192)%>";
var msg1130 = "<%=Toolbox.emsgs(orgnum,1130)%>";  
var msg1463 = "<%=Toolbox.emsgs(orgnum,1463)%>";
var msg1464 = "<%=Toolbox.emsgs(orgnum,1464)%>";
var edition = "<%=Toolbox.edition%>";
var url = "<%=url%>";
var orgurl = "<%=url%>/index.jsp?orgnum=<%=orgnum%>";
window.title = "<%=Toolbox.emsgs(orgnum,515)%>";
var initstatus = <%=Toolbox.initstatus%>; 
var enlang = [<% for (int i=0; i < Toolbox.langs.length; i++){if (i>0) out.print(",");out.print("'"+Toolbox.langs[i] +"'");}%> ];
var unic = [<% for (int i=0; i < Toolbox.langs.length; i++){if (i>0) out.print(",");out.print("'"+ (Toolbox.locales[i].langname)+"'");}%> ];
var encoding = '<%=Toolbox.langs[orgnum>>16]%>';var langcode = "<%= Toolbox.langs[orgnum>>16]%>";
var sessionid = "<%=session.getId()%>";
var hints = ["<%=Toolbox.instruction[orgnum>>16]%>"];
var orgnumstr = <%=orgnumstr==null?"null":(""+orgnumstr)%>; 

function fillform()
{
<% if (Toolbox.signuplink[orgnum>>16].indexOf("register")>0){%>
resizebut(document.f3);
<%}%> 
resizebut(document.f1);
resizehelpbut(window);
<% 
    String eid = request.getParameter("eid");
    if ( eid!=null && eid.equals("!")) 
    {
          String str = "";
          for (int i=0; i < Toolbox.langs.length; i++) 
          {
              if (i != (orgnum>>16))
              str += "&nbsp;&nbsp;<a href=javascript:enterenames(" + i + ")><b>" + (Toolbox.locales[i].langname) + '('+Toolbox.langs[i]+')'   + "</b></a>";  
          }
      %>
       myprompt("<ul><li>" + textmsg[1830].replace(/\n/,'</li><li>') + '</li></ul><br><br><%=str%><br><iframe width=300 height=100 style=border:0px id=langname>'); 
    <%}
    
    if (eid!=null && !eid.equals("!"))
    {
    %>
     makeiframe();
     eid = '<%=eid%>';
     afterreg(eid);
    <%}
    %>
     
}
<%=(orgnum>=0?Toolbox.someconsts(orgnum):"" )%>
</script>
<script type=text/javascript   src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
<script type=text/javascript  src=cookie.js></script>
<title><%=Toolbox.emsgs(orgnum,515)%></title>
</head>  
<body style="background:linear-gradient(0deg,<%=Toolbox.dbadmin[ORGNUM].DBGCOLOR%>,<%=Toolbox.dbadmin[ORGNUM].BBGCOLOR%>);margin:0px 0px 0px 0px" >

 
<table id=maintbl cellpadding="0" cellspacing="0" align=center>
<tr><td style="background:url(image/zz1.png) repeat-y" width=5></td>
<td >   
<table width=818 align=center cellpadding="0" cellspacing="8" border="0" bgcolor=<%=Toolbox.dbadmin[ORGNUM].IBGCOLOR%>>
  <tr >
   <td colspan=2  align=center   class="bbg" style="border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;border:1px #bbb outset;">
 <table align=center cellpadding="0" style="border-radius:4px" cellspacing="0" width="100%">
 <tr  height="100">
 <td   id="plate"    align=center style="padding:0px 0px 0px 0px;background: linear-gradient(to right,<%=Toolbox.dbadmin[ORGNUM].BBGCOLOR%>,<%=cachedstyle.IBGCOLOR%>);border-top-left-radius:3px;border-bottom-left-radius:3px;border-top-right-radius:50px;border-bottom-right-radius:50px;border:0px #aaaaaa solid;border-right-width:1px" >
  <div  onclick="biggerqrcode()" style="float:left;background:radial-gradient(<%=Toolbox.dbadmin[ORGNUM].TBGCOLOR%>,<%=Toolbox.dbadmin[ORGNUM].BBGCOLOR%>);position:relative;width:76px;height:76px;border-radius:38px;border:1px <%=Toolbox.dbadmin[ORGNUM].IBGCOLOR%> inset"  >
 <!--img name="logo" height=100 width=100 src=image/progress.png style="margin:0px 0px 0px 0px;border:0px;border-radius:50px;animation:logorot 1.2s infinite" onclick="biggerqrcode()"-->
 <img id="logo1" height=70 width=70 src=image/tm2.gif style="position:absolute;border:0px;top:0px;left:0px;animation:logorot1 5s infinite;"  >
 <img id="logo2" height=70 width=70 src=image/tm1.gif style="position:absolute;border:0px;top:0px;left:2px; ">
  </div></td><td>
  <div onclick="biggerqrcode()" style="margin:20px;text-align:center;font-size:24px;color:#DDCC11;font-weight:700;text-shadow:-1px -1px #233211"  ><%=pagetitle%></div>
  </td>
   <td width=140 align=center valign="middle">
   <table cellspacing="0" cellpadding="0"><tr>
    <%  
    if (  Toolbox.edition.contains("Enterprise")  ) 
  {
   %>
   <td><span style="background-color:<%=Toolbox.dbadmin[ORGNUM].IBGCOLOR%>;color:white;border:1px #777777 solid;width:100px;" onclick="others()">  <nobr><%=Toolbox.emsgs(orgnum,1130)%> </nobr></span></td><td width="5"></td>
   <%} if (  Toolbox.langs.length>1){%>
   <td><span style="background-color:<%=Toolbox.dbadmin[ORGNUM].IBGCOLOR%>;color:white;border:1px #777777 solid;width:100px;" onclick="changeencoding(this,'<%=Toolbox.langs[orgnum>>16] %>')"> <%=  (Toolbox.locales[orgnum>>16].langname)%>&vellip;</span></td><td id="zone" style="color:#DDCC11"></td> 
   <%}%>  </tr></table>
   <div class="outset2" style="background-image:linear-gradient(-20deg,#C28976,#C25314 70%,#C25314);border-Radius:6px;color:#DDCC11;font-size:18px;font-weight:700;text-align:center;text-shadow:#707070 -1px -1px;border:1px #ccc outset;margin:0px 0px 0px 0px"><%=Toolbox.emsgs(orgnum,1442)%><br>
        <img src=image/tm.png height=33 width=140px  >
   </div> 
  
   </td></tr>
  
   </table>
        <!--svg style="margin:-140px 0px 0px -70px;z-index:2" width="595" height="140"></svg-->
   </td>
  </tr>
  
<tr height=30> 
 <td align="left">
 <script type="text/javascript" >
 document.write(round1('<%=(int)Math.ceil(7*Toolbox.defaultFontSize*Toolbox.charwidthrate()) + 30%>px'));
 </script>
 
 

 
 <form  name="f1" method="post"  
        style="margin:0px 0px 0px 0px" 
        autocomplete="off" 
        action="login.jsp"   
        onSubmit="return validate()">
  
  <table cellspacing=0 cellpadding=0 border=0>
   <tr>
   <td  class=label>
     <nobr> <%=Toolbox.emsgs(orgnum,190)%> </nobr>
   </td>
   <td><input  class="textbox"  type="text" name="id" value="" size="10" maxlength="20"     tabindex=1> <!--input name="test"  value="test" type="button" onclick="restoredim('uid')" -->
   </td>
   <td class=label>
    <%if (nopass){%> <%=Toolbox.emsgs(orgnum,1514)%> <%} else {%>    <nobr>&nbsp;<%=Toolbox.emsgs(orgnum,164)%></nobr> <%}%>
   </td>
   <td > 
   <input  name="password1" <%if (!nopass){%> class="textbox" type="password" size="20" maxlength="100"  tabindex=2 <%} else {%> type="hidden" value="any"<%}%> >
   </td>
   <td align=center>
   <input name="mobile" type="hidden">
   <input   type="hidden" name="password">
   <input type="hidden" name=pubkeys>
   <input  type="hidden" name="securitytoken">
   <input  type="submit" <%=style%> class=GreenButton     name="submit" value="<%=Toolbox.emsgs(orgnum,39)%>" >
   </td>
   <td>  <%if (!nopass){%>
   <nobr>
       <a href=javascript:forgetpass()> <font color=white><%=Toolbox.emsgs(orgnum,1125)%> </font></a>
   </nobr> <%}%>
   </td>
   </tr>
     </table>
  </form>
   
   
   
  <script type="text/javascript" >document.write(round2);</script>
  </td>
    
 <td align=right>
 <script type="text/javascript" >document.write(round1(''));</script>
 <% if (Toolbox.signuplink[orgnum>>16].indexOf("register") > 0){
  int ii = Toolbox.signuplink[orgnum>>16].indexOf("register");
  String reg = Toolbox.signuplink[orgnum>>16].substring(ii);
  String act = Toolbox.signuplink[orgnum>>16].replaceFirst("\\?.*", "");   
   
    %>
 <form  name="f3" method="post"
        style="margin:0px 0px 0px 0px;"
        action="<%=act%>"
        target="register"
        onsubmit="return validat(this)">
 <table  cellspacing=0 cellpadding=0 border=0>
  <tr>
  <% 
    
   if (Toolbox.signuplink[orgnum>>16].indexOf("registerc") >= 0){%>
    <td class=label onmouseover="showmyhint(0)" onmouseout="hidemyhint()">
    <% if (!Toolbox.edition.contains("Personal")){%> <nobr><%=Toolbox.emsgs(orgnum,1238)%></nobr> <%}%> 
    </td>
    <td><input name="semester" type="hidden" value=""><input name="courseid" type="hidden" value=""><input name="sessionname" type="hidden" value=""><input name="subdb" type="hidden" value="">
        <input name="code"   class="textbox"  
               style="width:50px;visibility:<%= Toolbox.edition.contains("Personal")? "hidden":"visible" %>"  
               type="text" value="1">
     
    </td>
  <%}%>
<td   align=center>
<input type="submit" class="GreenButton"  <%=style%>  name="submit"  value="<%=Toolbox.emsgs(orgnum,602)%>" onclick="makeiframe()"  onmouseover="showmyhint(0,true)" onmouseout="hidemyhint()" >
</td>
 </tr>
</table>
<input type="hidden" name="rdap" value="<%= reg %>">
<input type="hidden" name="exbut" value="cpd">
<input type="hidden" name="orgnum" value="<%=orgnum%>"> 
<input type="hidden" name="cellonfocus">
<input type="hidden" name="numrows" value="1">
<input type="hidden" name="onsaved">
<input type="hidden" name="onbegin"   >
<input type="hidden" name="securitytoken" value="<%=Toolbox.gentoken("index.jsp","f3")%>" > 
</form>
<%} else {%>
<div><font size=2 color=#DDCC11><%=Toolbox.instruction[orgnum>>16] %></font></div>
<%}%>
<script type="text/javascript" >document.write(round2);</script>
 </td>
 </tr>
 
<tr>
<td colspan=2 class=withbg style="border-top-left-radius:3px;border-top-right-radius:3px"  id="news">
 
 <%
    
    long  nowtime = (new java.util.Date()).getTime()/1000; 
    JDBCAdapter adapter  = Toolbox.getSysAdapter(orgnum);
    for (int z=0; z < 2; z++)
    {
        String courseid = ""; 
        if (z==1) courseid= "news & refer"; 
        String  submitSQLstr= "";
        if (z==0)
            submitSQLstr= "SELECT Announcement.title,  Announcement.content, Announcement.format, Announcement.attach, Announcement.postdate,  enddate  FROM Announcement, AppUser WHERE Announcement.courseid='' AND Announcement.uid=AppUser.id AND (AppUser.roles % "
           + (2*Systemroles.SYSTEMADMIN) + ") >= " + Systemroles.SYSTEMADMIN + " AND Announcement.roles <= 0 AND Announcement.department='' order by -postdate";
        else
            submitSQLstr= "SELECT Announcement.title,  Announcement.content, Announcement.format, Announcement.attach, Announcement.postdate,  enddate  FROM Announcement, AppUser WHERE Announcement.courseid='news & refer' AND Announcement.uid=AppUser.id AND ( (AppUser.roles % "
        + (2*Systemroles.SYSTEMADMIN) + ") >= " + Systemroles.SYSTEMADMIN + " OR (AppUser.roles % "
        + (2*Systemroles.TEACHINGADMIN) + ") >= " + Systemroles.TEACHINGADMIN + ") AND Announcement.roles <= 0 AND Announcement.department='' order by -postdate";
        boolean bb = adapter.executeQuery2(submitSQLstr,false);
        boolean firstone = true;
       
        for (int i=0; bb && adapter.getValueAt(i, 0)!=null; i++)
        {
            long endpost =  0;
            try{endpost = Long.parseLong(adapter.getValueAt(i, 5))*1000;}catch(Exception e){}
            
            String attach = adapter.getValueAt(i, 3);
            String title = adapter.getValueAt(i, 0);
            String content = adapter.getValueAt(i, 1);
            content = Toolbox.formatstr(adapter.getValueAt(i, 2), content);
            boolean haspic = false;
            String attach1 = "", attach2 = "";
            if (attach!=null && attach.equals("")==false)
            {
                attach = Toolbox1.unzip(attach);
                String [] attaches = attach.replaceFirst(",$","").split(",");
                
                for (int kk = 0; kk < attaches.length; kk++)
                {
                    String file1 = attaches[kk].toLowerCase();
                    haspic = file1.indexOf(".jpg") > 0 || file1.indexOf(".jpeg") > 0 || file1.indexOf(".png") > 0 || file1.indexOf(".gif") > 0;
                    if (haspic)
                        attach1 += attaches[kk] + ",";
                    else
                        attach2 += attaches[kk] + ",";
                
                     file1 = attaches[kk].replaceAll("([^@]+)@[0-9]+@([^,]+),", "$2,");
                
                    if (endpost >= timenow)
                    {
                        String bufferedfile = (String)(session.getAttribute("publicfiles"));
                        if (bufferedfile == null) 
                        {
                            bufferedfile = file1;
                            session.setAttribute("publicfiles", bufferedfile);
                        }
                        else if (bufferedfile.indexOf(file1) < 0 ) 
                        {
                            bufferedfile += file1 ;
                            session.setAttribute("publicfiles", bufferedfile);
                        }

                    }
                    else
                    {
                        String bufferedfile = (String)(session.getAttribute("publicfiles"));
                        if (bufferedfile != null && bufferedfile.indexOf(file1) >= 0 ) 
                        {
                            bufferedfile = bufferedfile.replaceFirst(file1,"");
                            session.setAttribute("publicfiles", bufferedfile);
                        }
                        
                    }
                }
                if (endpost < timenow) continue;
                attach1 = attach1.replaceAll("([^@]+)@[0-9]+@([^,]+),", "FileOperation?did=$2,").replaceFirst(",$","");
                attach2 = attach2.replaceAll("([^@]+)@[0-9]+@([^,]+,)", "<span style=color:blue;cursor:pointer onclick=\"openpicorfile('$2','$1',this)\" >$1</span>&nbsp;&nbsp;");
            }
            int N = 300;
            content += "\n" + (attach2.equals("")?"":("<br>" + attach2));  
            if (content.length()*Toolbox.locales[orgnum>>16].charsize>N)
            {
                N /= Toolbox.locales[orgnum>>16].charsize;
                int n = N;
                while (n+1 < content.length() &&   !(content.charAt(n)=='<' && (content.charAt(n+1)=='/'||content.charAt(n+1)=='b'))   )n++; 
                if (n+1 < content.length()) 
                {    
                     while (n < content.length() && content.charAt(n)!='>') n++;
                     if (n < content.length()) N = n+1;
                }
                content = content.substring(0,N) + "<a href=\"javascript:readall(" + z + "," + i + "," + (content.length()-N)+ ")\"><font color=blue>&gt;&gt;&gt;</font></a><!--" + content.substring(N) + "-->";
            }
           // if (endpost < timenow) continue;
            if (firstone)
            { 
                firstone = false;
             %>
            <table cellpadding="0" style="border-top-left-radius:3px;border-top-right-radius:3px"  cellspacing="0"  valign=top  width=100% align="center"> 
            <tr>
            <td  align=center width=100%  style="border-top-left-radius:3px;border-top-right-radius:3px;border:1px #ccc outset;background:linear-gradient(<%=cachedstyle.IBGCOLOR%>,<%=Toolbox.headercl(cachedstyle.IBGCOLOR)%>)"   >
             <div class="I2B" style="border-top-left-radius:3px;border-top-right-radius:3px" id=curve6><nobr><%=Toolbox.emsgs(orgnum,z==0?282:1586)%></nobr></div> 
            </td>
            </tr>
            </table>
            <%} %>
            <div id="t<%=z+"_"+i%>" class="withbg" style="margin:0px 0px 0px 0px;padding:4px 4px 4px 4px"><b><span style="margin:8px 0px 8px 0px">&#9205; <%=title%></span></b><br>
                 <% if (attach1.equals("") == false){ String [] attachs = attach1.split(",");for (int kk=0; kk < attachs.length; kk++){%>
                  <img width="150px" style="float:left;display:inline;margin:0px 6px 0px 0px" src="<%=attachs[kk]%>" />
                  <%} } %>
                  <p style="margin:5px 5px 5px 5px">
                    <%= content %>
                  </p>
         </div>
         <%
        }
if (z ==0){
    
    %>
 

<!--table  class="floatRight" style="margin:0px 0px 0px 0px" valign=top  cellpadding="0" cellspacing="0" width=380  border=0  >
<tr>
<td align=center width=100% class=outset3 style="border:1px #ccc outset;background:linear-gradient(<%=cachedstyle.IBGCOLOR%>,<%=Toolbox.headercl(cachedstyle.IBGCOLOR)%>);border:1px   outset"   id="screenhead" >
   <table>
       <tr>
           <td>
               <div class=forcurve2 style="color:#DDCC11" id=curve4><nobr><%=Toolbox.emsgs(orgnum,1257)%></nobr></div>
           </td>
       </tr>
   </table>
</td>
</tr>
  
<tr height=305><td--><div style="float:right"><div  id="screen" style="background:radial-gradient(ellipse at top, <%=cachedstyle.BBGCOLOR%>, transparent),radial-gradient(ellipse at bottom, <%=cachedstyle.DBGCOLOR%>, transparent);z-index:2;margin:0px 0px 0px 0px;width:380px;height:312px;border-left:1px  #888888 solid;border-right:0px  #888888 solid;border-top:1px  #888888 solid;border-bottom:1px #888888 solid;border-top-left-radius:30px;border-bottom-left-radius:150px"></div>
     </div>
    <!--/td>
</tr>

 
 

</table-->
    
     
<table style="border-bottom-left-radius:0px;border-bottom-right-radius:0px;border-top-left-radius:3px;border-top-right-radius:3px;" cellpadding="0" cellspacing="0"   align=left  width=400 >
<tr><td  align=center width=100%   style="border-bottom-left-radius:0px;border-bottom-right-radius:0px;border-top-left-radius:3px;border-top-right-radius:3px;background:linear-gradient(<%=cachedstyle.IBGCOLOR%>,<%=Toolbox.headercl(cachedstyle.IBGCOLOR)%>);border:1px #ccc outset"   >
     <div class="I2B"   id=curve5><b><nobr><%=Toolbox.emsgs(orgnum,1232)%></nobr></b></div> 
</td></tr>
</table><br>

<p style="padding:5x 2px 0px 2px;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>">
<%
 
String aline =  Toolbox1.filebytes(orgnum + ".html", "UTF-8");
 
if(aline == null)
{
   int kk = orgnum>>16;
   if (!Toolbox.locales[kk].hasfront)
   {
       kk = Toolbox.langnum;
       if (!Toolbox.locales[kk].hasfront)
          kk = 0;
   }
   aline =  Toolbox1.filebytes("WEB-INF" + File.separator + "conf" + File.separator + Toolbox.langs[kk] + ".html", "UTF-8");
    
}  
out.println(aline); 
%>
</p>
</div>
</div>

<% }

}
adapter.close();

%>


</td></tr>
</table>

<table cellpadding=0 cellspacing=0 align=center width=100%  style="background-color:<%=Toolbox.dbadmin[ORGNUM].IBGCOLOR%>"><tr>
<td align=center id="copyright"> 
<font size=-1 color=<%=Toolbox.dbadmin[ORGNUM].DBGCOLOR%> ><nobr> <%= Toolbox.copyright[orgnum>>16]%> </nobr></font> 
</td>
</tr></table>
</td><td style="background:top left url(image/zz3.png) repeat-y" width=5></td></tr></table>
 
 
<script type="text/javascript"  src="index0.js"></script>
<script type="text/javascript"  src=sha1.js ></script>
<script type="text/javascript"  src="hints.js"></script>
<script type="text/javascript"  src="timeformat.js"></script>
<script type="text/javascript"  src="login.js"></script>
<script type="text/javascript"  src="slidemove.js" ></script>
<script type="text/javascript"  src="curve.js" ></script>
<form rel=opener name="postform" method="POST"  ></form> 
 <style>

.line {
  fill: none;
  stroke: #000;
  stroke-width: 1.5px;
  stroke:#DDCC11
}
 
</style>
 
<iframe name="w<%=tstmp%>" width="1" height="1"  style="visibility:hidden" src="" />
</body>
</html>

