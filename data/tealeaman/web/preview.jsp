<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*, java.io.*" %>
<% 
int orgnum = Toolbox.setcharset(request,response);
if (orgnum == -1) return;
User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request, response, "preview.jsp", true)) == null)
 return;
orgnum=user.orgnum;
user.changedb(user.id);
CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
String format = Toolbox.defaultParam(orgnum,request, ("format"), null);
 
if (format == null ) 
{
 format = Toolbox.defaultParam(orgnum,request, ("Format"), null);
   
}
 
 
boolean test = false;
long tstmp = System.currentTimeMillis() % 10000000;
String des = Toolbox.defaultParam(orgnum,request, ("Content"), null);
if (des==null || des.equals("")) des = Toolbox.defaultParam(orgnum,request, ("source"), null);
if (des==null || des.equals("")) des = Toolbox.defaultParam(orgnum,request, ("content"), null);
if (des==null || des.equals("")) des = Toolbox.defaultParam(orgnum,request, ("Content"), null); 
if (des==null || des.equals("")) des = Toolbox.defaultParam(orgnum,request, ("Message"), null); 
  
 
if (des == null) des = "";
if (format == null ) 
{
   format = des.replaceAll("[^\\$]","").length() > 1?"2":"0";
    if (format.equals("0"))
    {
        String an1 = des.replaceFirst(".*<([a-z]+)[^>]*>.*","$1").toLowerCase();
        if (des.indexOf("</" + an1 + ">")>0) format = "1";

    }
}
format = Toolbox.validate( format, null, 20);


 
String attach = Toolbox.defaultParam(orgnum,request, ("Attach"), null); 
if (attach==null) attach = Toolbox.defaultParam(orgnum,request, ("attach"), null); 
if (attach==null) attach = Toolbox.defaultParam(orgnum,request, ("Attachment"), null); 
if (attach==null) attach = Toolbox.defaultParam(orgnum,request, ("Attached"), null); 
if (attach==null) attach = Toolbox.defaultParam(orgnum,request, ("attachment"), null); 
attach = Toolbox1.unzip(attach);
des = des.replaceAll("\\[" + Toolbox.emsgs(orgnum,453) + "([0-9]+)", "[Imagelet$1");
 
String course = Toolbox.defaultParam(orgnum,request, ("Subject"), null);
if (course==null) course = Toolbox.defaultParam(orgnum,request, ("CourseId"), null);
if (course==null) course = Toolbox.defaultParam(orgnum,request, ("course"), null);
if (course == null) course = Toolbox.defaultParam(orgnum,request, ("Course"), null);
if (course==null) course = Toolbox.defaultParam(orgnum,request, ("courseid"), null);
course = Toolbox.validate( course, null, 20);

String sessionname = Toolbox.defaultParam(orgnum,request, ("sessionname"), null);
if (sessionname == null) sessionname = Toolbox.defaultParam(orgnum,request, ("Sessions"), null);
sessionname = Toolbox.validate( sessionname, null, 30);

String assignname = Toolbox.defaultParam(orgnum,request, ("assignname"), null);
if (assignname == null) assignname = Toolbox.defaultParam(orgnum,request, ("Assignname"), null);
if (assignname == null) assignname = Toolbox.defaultParam(orgnum,request, ("Assignment"), null); 
if (assignname == null) assignname = Toolbox.defaultParam(orgnum,request, ("AssignTest"), null);
if (assignname == null) assignname = Toolbox.defaultParam(orgnum,request, ("Name"), null);
assignname = Toolbox.validate(assignname, "-", 50);

String atype = Toolbox.defaultParam(orgnum,request, ("Type"), null);
atype = Toolbox.validate(atype, null, 50);
String answers = "", pts = "";

String due1 = Toolbox.defaultParam(orgnum,request, ("Due"), null);
long due = Toolbox.parseTime(due1, cachedstyle.timeformat);

 
String fname = Toolbox.defaultParam(orgnum,request, ("fname"), null);
fname = Toolbox.removescript(fname );
String title = Toolbox.emsgs(orgnum,813);
String cidtitle =  course + "-" + sessionname + " " + title;
if (assignname != null) 
{
 if (course != null) 
    title  =  course + " " + assignname;
 else
    title = assignname;
}
else if (course != null) 
 title =  course;
String butstyle = "border-radius: 4px;color:white;font-weight:700;width:" + Math.ceil(4.8*cachedstyle.fontsize) + "px;font-size:" + cachedstyle.fontsize+ "px"; 
 
/*
if (format != null && format.equals("3"))
{
 String des1 = Toolbox.formatstr(format, des);
 
 if (des1 != null && (des1.indexOf("<iframe ") == 0 || des1.indexOf("<img ") == 0) && des1.indexOf(des) > 0)
 {
 out.print("<META HTTP-EQUIV=REFRESH CONTENT="0; URL=" +des+"">\n");
 return; 
 } 
 format =  "0";
}
else*/
answers = Toolbox.defaultParam(orgnum,request,"Answer","");
 
if (atype!=null && (atype.equals("1") || atype.equals("3")))
{
 String toolstr = "";
 pts = Toolbox.defaultParam(orgnum,request,"Assessment","", ",|;", 500);
 JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
 if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
int n = adapter.executeQuery("SELECT  DomainValue.domainvalue,category,DomainValue.description,name,cgi,opt,OperationCourse.forstudent from DomainValue,Operation, OperationCourse where  caption=CONCAT('',DomainValue.code) AND DomainValue.domain='Tool Caption' AND DomainValue.language='" + Toolbox.langs[orgnum>>16] + "' AND Operation.name=OperationCourse.operation and OperationCourse.course ='" + course + "' AND  OperationCourse.forstudent > 0 order by OperationCourse.forstudent");
 
for(int i=0; i < n; i++)
 for (int j=0; j < 6; j++)
 {
 String x1 = adapter.getValueAt(i,j).replaceAll(";",",");
 if (j==5 && adapter.getValueAt(i,4).equals("UploadTeaching"))
 x1 = x1 +"&course=" + course +"&subdb=" + user.id +"&sid=" + user.id;
 toolstr += ";" + x1;
 }
 toolstr += ";Rebuild;tealeaman;Tool Caption;Rebuild;installtool.js;rebuild('" + course + "','" + sessionname + "','" +  user.subdb + "')";
 adapter.close();

%><!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%> 
<head>
<title><%=Toolbox.emsgs(orgnum,515) + "-" + Toolbox.emsgs(orgnum,813) +"-" + title %></title>
<script type="text/javascript">
var haswebfolder=<%=user.websitename != null && !user.websitename.equals("")||user.webFileFolder != null && !user.webFileFolder.equals("") %>;
<%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("preview.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
<link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<%
String options =    Toolbox.defaultParam(orgnum,request, ("Options"), null) ;
 
AssOption assopt = new AssOption(options,orgnum);
des = Toolbox.defaultParam(orgnum,request, ("Question"), null);
 
des = Toolbox.removescript(des);
des = des.replaceAll(Toolbox.emsgs(orgnum, 453),"Imagelet");
butstyle = "border-radius: 4px;color:white;font-weight:700;width:" + Math.ceil(4.8*Integer.parseInt(assopt.fs)) + "px;font-size:" + Integer.parseInt(assopt.fs)+ "px"; 
String imglet[] = Toolbox1.attach( attach , user.id , course,true, orgnum); 
boolean proctored = (atype.equals("1")||atype.equals("3"));  
%>
<style type="text/css">
td,body  {font-size:<%=assopt.fs%>px;font-family:<%=assopt.ff%> !important;font-weight:<%=assopt.fw%>}
textarea {font-size:<%=assopt.fs%>px;font-family:courier;font-weight:700}
.rado{background-color:<%= cachedstyle.DBGCOLOR %>}
.outstand{border:2px inset;font-weight:800;text-align:left;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%> !important;font-size:20px;width:60px;}
#floater1Div {position:absolute;visibility:visible}
.quesans{border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;background-color:<%=cachedstyle.TBGCOLOR%>;font-size:<%=assopt.fs%>px;font-family:<%=assopt.ff%> !important;font-weight:<%=assopt.fw%>}
.blanklook{border:1px #b0b0b0 solid; white-space: pre;word-wrap: normal; overflow-x: scroll;font-size:<%=assopt.fs%>px;font-family:<%=assopt.ff%> !important;}
.noborder{border:0px}
.errorcell{background-color:white;color:red}
.warncell{background-color:white;color:purple;font-family:<%=cachedstyle.fontname%>}
td.GreenButton{background:url(image/GreenButton.gif);color:white;border:1px #00CC00 outset;width:<%=cachedstyle.fontsize%>px;height:<%=cachedstyle.fontsize%>px;font-weight:680}
td.OrangeButton{background:url(image/OrangeButton.gif);color:white;border:1px #CCCC00 outset;width:<%=cachedstyle.fontsize%>px;height:<%=cachedstyle.fontsize%>px;font-weight:680}
 
</style>
<script type="text/javascript"  src=checkHTML.js></script>
<script type="text/javascript"  src="assessform.js"></script>
<script type="text/javascript" >
var theurl = "<%=Toolbox1.geturl(request)%>";
 
var onlinetoolinitial = "<%=Generic.handle(toolstr)%>";
var ques = "<%=Generic.handle(des)%>";
var ansstr= "<%=Generic.handle(answers)%>";

 
var detailass = new Hwtake('prev', ques, ansstr, "<%=attach%>",  "<%=pts%>","<%=format%>", -1,
false,null,"<%=assopt.forceorder%>",<%=assopt.mbs%>);
 
var msg1468 = "<%=Toolbox.emsgs(orgnum,1468)%>";
</script>

</head>
<body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 5px 5px">
  
<%=Toolbox.title(title).replaceAll("\n","")%> 
<script>
     var dv = document.createElement('style');
     dv.innerHTML = detailass.divs;
     document.getElementsByTagName('head')[0].appendChild(dv);
     document.write("<center>" + detailass.header +  detailass.attachheader +"</center>" );
</script>
 
 
<%

//if (imglet!=null&&!imglet[0].equals("") && ) out.println("<center>" + imglet[0] + "</center>"); 
 

if (fname != null) out.println("<center>" + fname + "</center>");
response.setHeader("X-XSS-protection", "0");
%>
<form rel=opener name=form1 method=post    style="margin:0px 0px 0px 0px"  >
<script type="text/javascript" >
var cidtitle = "<%=cidtitle%>";
var timesplitmode = false;
detailass.assemble(false);
var jj = detailass.str.indexOf("$");
var hasactivities = false;
document.write( detailass.str );
var needregister = false;
</script>
 
 <input type=hidden name=sid     value="<%=user.id%>" >
<input type=hidden name=testing value="1">
<input type=hidden name=leas    value="">
<input type=hidden name=activities>
<input type=hidden name=format value="<%=format%>">
<input type=hidden name=subdb   value="<%=user.id%>" >
<input type=hidden name=assignname value="<%=assignname%>" >
<input type=hidden name=course     value="<%=course%>" >
<input type=hidden name=sessionname value="<%=sessionname%>" >
<input type=hidden name=semester   value="<%=Toolbox.dbadmin[orgnum%65536].currentSemester%>" >
<input type=hidden name=showimm    value=false>
<input type=hidden name=orders     value="">
<input type=hidden name=noanswer   value="">
<input type=hidden name=Question value="">
<input type=hidden name=Answer   value="">
<input type=hidden name=Content   value="">
<input type=hidden name=attach value="">
<input type=hidden name=Options  value="<%=Generic.handle(options)%>">
<input type=hidden name=Assess   value="<%=Generic.handle(pts.replaceAll(" ",""))%>">
<input type=hidden name=Format    value="<%=format%>">

<center>
<% if (atype.equals("1") || atype.equals("3") || atype.equals("4")) {%><input class=GreenButton style="<%=butstyle%>;margin-top:5px"  type=button name=submit2  value="<%=Toolbox.emsgs(orgnum,36)%>"  onclick="needblur();saveback()">
<%}%>
<input class=GreenButton style="<%=butstyle%>;margin-top:5px" type=button name=submit0 value="<%=   Toolbox.emsgs(orgnum,813)  %>" onclick="previewass()">
<input class=OrangeButton style="<%=butstyle%>;margin-top:5px"  type=button name=submit1 value="<%=Toolbox.emsgs(orgnum,51)%>"  onclick="needblur();setact(0)" >
</center>
</form>
 
<script type="text/javascript" >

var upperrightwin = parent.frames[1];
document.form1.Question.value =ques;
document.form1.Answer.value = ansstr;
var tstmp = <%=tstmp%>;
var sofar ='';
var timedif = <%=System.currentTimeMillis()/1000 %> -(new Date()).getTime()/1000;
var sid="<%=user.id%>";
var thesid=sid;
var savedanswers='';
document.form1.noanswer.value=detailass.orders;
var serial='<%=(assopt.norepeat?1:0) +"," + (assopt.openbook?1:0) +",' + detailass.quesnums.length + ',"+ (System.currentTimeMillis()/1000) + "," + due %>';
var needtranslator = true; //(<%=format%>==2);  
var qFontSize = <%=assopt.fs%>;
function showattachment(t)
{
     
    var allAttachTodel = ResizeUploaded.unzip(t);
    var xx = document.getElementById("theattach"  );
    if (xx!=null  )
    {
        xx.innerHTML = allAttachTodel.replace(/@[^,]+/g,'').replace(/,$/,'').replace(/,/g,', ') ;
    }
    if (typeof(savedQuizName) != 'undefined'  )
        localStorage[savedQuizName+'a'] = t; 
}
function provethis(v)
{
    detailass.provethis(v);
}
function myonbegore()
{
    detailass.showerror('detailass');
    var titlebar = promptwin.getElementsByTagName('table')[0].rows[1].cells[1].getElementsByTagName('table')[0].rows[0];
    if (typeof (Drag) != 'undefined')
        Drag.init(titlebar, promptwin); 
    if (parent.opener!=null && typeof(parent.opener.demokeyframen)!='undefined' && parent.opener.demokeyframen > 0)
    {
        var x = new Audio('image/clicksound.mp3');
        parent.opener.demosuspend();
        demo();
    }
}
var onloadbeforepreview = null;
if (typeof window.onload == 'function')
{
    onloadbeforepreview = window.onload;
    }
window.onload = function()
    {
       if (onloadbeforepreview!=null) onloadbeforepreview();
        myonbegore();
    }
 
    
demotasks = [
["democursorx = 220 + (thispagewidth()/2); democursory = 140;democursorsim.style.zIndex = (1+parseInt(''+promptwin.style.zIndex));var xy = findPositionnoScrolling(promptwin); xy[0] += promptwin.offsetWidth/2 - 80; xy[1] += promptwin.offsetHeight - 30; democursor2(xy[0],xy[1])", 0],
["demoheight(0.7)", 3000],
["demoheight(1); provethis(textmsg[1375])",500],
["parent.opener.demoresume();var win=window.open('','_parent','',true);  win.opener=true; win.close()", 500]
];
var proctors = "";
var proctored = true;
</script>
<script type="text/javascript"   src="attachment.js" ></script> 
<script type="text/javascript"   src="quizmaker.js" ></script>
<script type="text/javascript"   src="quizclock.js" ></script>
<script type="text/javascript"   src="sha1.js" ></script>
<script type=text/javascript > 
ResizeUploaded.attachref = document.form1.attach;
</script>
<script type="text/javascript"   src=installtool.js></script>
<script type="text/javascript"   src=curve.js?sn=30&dn=20></script>
 

<iframe name="w<%=tstmp%>" width="1" height="1" style="visibility: hidden" />
</body>


</html> 
<%
}
else // if (atype!=null && (atype.equals("2") || atype.equals("4")))
{
    if (des != null) des = des.trim();
    if (des == null || des.equals("") )
    {
        String subfolder = Toolbox.defaultParam(orgnum,request, ("subfolder"), null);
        if (subfolder!=null && subfolder.equals("assignment"))
         des = Toolbox.formatstr(format,Toolbox.defaultParam(orgnum,request, ("Question"), null) );
        else if (subfolder!=null && subfolder.equals("answer"))
         des = Toolbox.formatstr(format, format + Toolbox.defaultParam(orgnum,request, ("Answer"), null) ) ;
    }
    else
        des =  Toolbox1.addbreak1(Toolbox.formatstr(format,Toolbox1.addbreak(des,"1",orgnum)));
    if (des == null || des.equals("") )
        des = "�";
    
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head> 
<%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
<title>
<%= Toolbox.emsgs(orgnum,515) + "-" + Toolbox.emsgs(orgnum,813) +"-" + title %>
</title>

<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>

<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
<link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<%
 
String imglet[] = Toolbox1.attach(attach , user.id , course, true, orgnum) ;
 
if (!imglet[1].equals("")) imglet[0] = "<style>" + imglet[1] + "</style>" + imglet[0];

 
%>
</head>
<body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 5px 5px">
    
<%=Toolbox.title(title).replaceAll("\n","")%>  

<% 
String scale = Toolbox.defaultParam(orgnum,request, "Scale", null, null, 3);
String weight = Toolbox.defaultParam(orgnum,request, "Weight", null, null, 3);
if (scale!=null && weight!=null  ){%>
<center><span style="font-size:9px">(<%=   Toolbox.emsgs(orgnum,1145)  %>:<%=scale%> &nbsp;&nbsp;&nbsp; <%=   Toolbox.emsgs(orgnum,254)  %>: <%=weight%>%)</span></center>
<%}%><br>
<center> 
   <%=  imglet[0]%>
 </center>
 
<TABLE BORDER=0 cellspacing=1 width=100% class=outset3 bgcolor=<%=cachedstyle.DBGCOLOR%> >
<tr><td>
<% if (fname != null) out.println("<center>" + fname + "</center>"); %>
</td></tr>
<tr>
<td id="needf">  
    <%= (  Toolbox1.todiv(orgnum, Toolbox.removescript(des),-1))%> 
</td></tr></table>

<script type="text/javascript" >
 function op(x,y,str,str1)
{
    if (str1!=null) str+=encodeURI(str1);
    openopen(str, x + '_' + y);
}
var needtranslator = true;//(<%=format%>==2); 
 
</script>
<script type="text/javascript"  src=curve.js?sn=30&dn=20></script>

 
</body>
</html>
<%
}
%>











 


 