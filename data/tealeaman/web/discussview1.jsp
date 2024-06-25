<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
 
 
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (  (user = User.authorize(orgnum,   Systemroles.TOTAL  ,application,session,request, response, "discussview1.jsp", true)) == null|| !Toolbox.verifytoken(request)) 
    return;
orgnum = user.orgnum; 
int kk=0;
String gruopname = ""; 
String course =   Toolbox.defaultParam(orgnum,request,"course","", "#", 30);
if (course.equals("")) 
       course =   Toolbox.defaultParam(orgnum,request,"CourseId","", null, 30);
else if ( (kk = course.indexOf("#")) >0)
{
    gruopname = course.substring(kk+1);
}
String coursetitle =   Toolbox.defaultParam(orgnum,request,"coursetitle",null, "&@#$+:_-()/:![]", 200);
if (kk>0 && coursetitle.indexOf("[")<0) coursetitle = coursetitle + "[" + gruopname + "]";
String courseonly = course.replaceFirst("@#.*","").replaceAll("'","''");
String semester = Toolbox.defaultParam(orgnum,request,"semester",Toolbox.dbadmin[orgnum%65536].currentSemester, null, 40);
 
if (coursetitle==null)
{
   if (courseonly.equals("")) 
       coursetitle = Toolbox.emsgs(orgnum,1064);
   else
       coursetitle = course;         
}
long startshow = Toolbox.dbadmin[orgnum%65536].getAppedt(0);
boolean old = false;
if (!semester.equals(Toolbox.dbadmin[orgnum%65536].currentSemester))
{
    int a = Integer.parseInt(semester.replaceFirst(".*([0-9][0-9][0-9][0-9]).*","$1"));
     
    java.util.Date d = new java.util.Date();
    d.setDate(15);
    d.setMonth(0);
    d.setYear(a - 1900);
    d.setHours(1);
    d.setMinutes(1);
    startshow = d.getTime()/1000;
    old = true;
}
String sd = Toolbox.defaultParam(orgnum,request, "startshow", ""+startshow, null, 20);
 
try{
startshow = Long.parseLong(sd);
}catch(Exception e){}
long timenow = System.currentTimeMillis()/1000;
if (timenow - startshow < 100) startshow -= 10000000;

String searchstr0 = Toolbox.defaultParam(orgnum,request,"wcds", "");
String searchstr = searchstr0;
if (searchstr0.equals(""))
{    
    searchstr =  " AND Forum.lastupdate >= " + startshow;
    if (old) searchstr +=  " AND Forum.lastupdate <= " + startshow + 3600*425*24;
}

String ecourse = Toolbox.urlencode(course);
String ecourseTitle = Toolbox.urlencode(coursetitle);
String subdb =  Toolbox.defaultParam(orgnum,request,"subdb","", null, 30);
/*String str = "discussview1.jsp?coursetitle="  + ecourseTitle  
            + "&subdb="  + Toolbox.urlencode(subdb) +"&wcds=" + Toolbox.urlencode(searchstr0); 
 */
long tstmp = System.currentTimeMillis()%10000000;
 
JDBCAdapter adapter = null;
 
if (course.equals("")||course.equals("TeaLeaMan")) 
{
    adapter = Toolbox.getSysAdapter(orgnum);
}
else 
{
    user.changedb(subdb);
    adapter = Toolbox.getUserAdapter(user, orgnum);
}
 
String sql = "";
String ssn = user.id; 
 
java.util.TreeSet<String> groups = new java.util.TreeSet<String>();
String sql1 = "SELECT distinct gname FROM Studentgroup WHERE  semester='" + semester +"' AND courseid='" + courseonly +"' AND iid='" + subdb +"' and (uid='" + user.id +"'  OR  '" + user.id +"' IN (SELECT instructor FROM Session WHERE  semester='" + semester +"' AND courseid='" + courseonly +"' UNION SELECT ta FROM Session WHERE  semester='" + semester +"' AND courseid='" + courseonly +"'))";
 
int mn = 0;
boolean bb = adapter.executeQuery2(sql1,false);
groups.add("");
if (bb)
for (int k=0; adapter.getValueAt(k,0)!=null; k++)
{
   mn++; 
   String grstr = adapter.getValueAt(k,0);
   if (grstr==null)continue;
   grstr = grstr.trim();
   if (grstr.equals(""))continue;
   String [] grstrs = grstr.split("[ ]*,[ ]*");
   for (int ll =0; ll < grstrs.length; ll++)
      groups.add(grstrs[ll]);       
}
String grouparr[] = new String[groups.size()]; 
int ll = 0;
 
for (java.util.Iterator<String> e=groups.iterator(); e.hasNext();)
   grouparr[ll++] = (String)(e.next());


String course1 = course;
course = course.replaceAll("'","''");
long l = 0;

String submitSQLstr = "select Forum.id, fid, topic, content, author, format, Forum.lastupdate, AppUser.firstname, AppUser.lastname, Forum.attach from  Forum, AppUser  WHERE Forum.author=AppUser.id AND courseid='" + course  +"' " + searchstr +" order by Forum.id";
int n = 0;
bb = adapter.executeQuery2(submitSQLstr,false);
String dtitle =  coursetitle;

if ( !course.equals("TeaLeaMan") && (user.roles & Systemroles.STUDENT ) != 0)
    dtitle +=   ": " + Toolbox.emsgs(orgnum,898); 
dtitle = dtitle.replaceFirst("([^\\[]+)(\\[[^\\]]+\\])(.*)", "$1$3 $2");
if (!bb) 
{
   out.println(Toolbox.emsgs(orgnum,634) + adapter.error());
   adapter.close();
   return;
}
else if (adapter.getValueAt(0,0)==null)
{
    sql = "INSERT INTO Forum(id, fid, topic, content, author, format) VALUES(0,-1,'" + Toolbox.emsgs(orgnum,985) + "','" + Toolbox.emsgs(orgnum,1502) +"', 'TeaLeaMan',0)";
    adapter.executeUpdate(sql);
    bb =   adapter.executeQuery2(submitSQLstr,false);
} 
%>

<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
   <script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("discussview1.jsp","f1")%>";
   var haswebfolder=<%=user.websitename != null && !user.websitename.equals("")||user.webFileFolder != null && !user.webFileFolder.equals("") %>;

   </script>
   <script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
	<title><%=Toolbox.emsgs(orgnum,547)%></title>
     <%=Toolbox.unifontstyle(cachedstyle.fontsize,orgnum)%>

<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
 

 </head> 

<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px"  >
   
 
<table  width="100%" align="center"  cellpadding="0" cellspacing="0">

<%=Toolbox.title(dtitle, 1) %> 
 
<tr height="3"><td align=left></td></tr>
<%
String statusstr = "";
if (!course.equals("") && !course.equals("TeaLeaMan"))
{
     String accessible = Toolbox.defaultParam(orgnum,request, "accessible", "", null, 30);
     if (!accessible.equals("true"))
     {
         statusstr = RegStatus.goodstatus(adapter,user,course,user.id,subdb);
         if (!statusstr.equals(""))
         {
             out.print("</table></center>" + statusstr + "<script type=text/javascript   src=curve.js></script></body></html>");
             adapter.close();
             return;
         }
         else
         {
             statusstr = "if (typeof(parent.frames[0].setaccessible)=='function')parent.frames[0].setaccessible(\"" + course +"\");";
         }
     }
}


boolean did = false;
if (groups.size()>1 || (user.roles & Systemroles.INSTRUCTOR) > 0)
{
out.println("<tr><td align=center  >");

if (groups.size()>1)
{
   out.println(Toolbox.emsgs(orgnum,255)+":");
   for (int k=0; k < groups.size(); k++)
   {
   String group = grouparr[k];
   String seegroup = group;
   String group0 = "";
   if (group.equals("")&&!courseonly.equals(course))  
       seegroup = Toolbox.emsgs(orgnum,430); 
   else 
       group0 =  "@#" + group;
   if (!group.equals("") && course.indexOf("@#" + group)>0 || 
        group.equals("") && courseonly.equals(course)) 
       out.println("<font color=" + cachedstyle.IBGCOLOR +"><b>" + seegroup + "</b></font>  ");
   else
       out.println("<b><a href=\"javascript:opengroup('" + (courseonly +  group0)  +"')\">[" + seegroup +"]</a></b>&nbsp; ");
   }
}

if (!course.equals("TeaLeaMan") && (user.roles & Systemroles.INSTRUCTOR) > 0)
{
    if (course.indexOf("#") < 0)
    out.println("<input type=button class=GreenButton style=\""  
   + "width:" + Math.round(Toolbox.charwidthrate()*cachedstyle.fontsize) + "px;overflow:hidden\" value=\"" + Toolbox.emsgs(orgnum,255)
            + "\" onclick=\"javascript:openman()\">");
    if (n == 0 && old==false)
    {%>
     <input type=button class=GreenButton  style="width:<%= Math.round(Toolbox.charwidthrate()*cachedstyle.fontsize)%>px;overflow:hidden" 
            onclick="javascript:openit('forumnewi',-1,'')" value="<%=Toolbox.emsgs(orgnum,904)%>">  
    <% 
    did = true;
    }
    if (old)
    { 
           out.println("(" +  Toolbox.timestr(startshow) + "  -  " + Toolbox.timestr(startshow+3600*24*425) + ")"  ); 
    }
    {
         %><a    href="javascript:setdate('<%=startshow%>')" ><%=Toolbox.emsgs(orgnum,583)%></a>  <%
    
    }
   
     if (course.indexOf("#") > 0)
    {
    %>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a    href="javascript:window.history.back()" ><%=Toolbox.emsgs(orgnum,1340)  %></a> <%
    }
    
}
out.println("</td></tr>");
}

if (n == 0 && did==false)
{   if (old==false)
   {%>
    <tr><td align=center><input type=button class=GreenButton  
   onclick="javascript:openit('forumnewi',-1,'')" value="<%=Toolbox.emsgs(orgnum,904)%>" ><a    href="javascript:setdate('<%=startshow%>')" ><%=Toolbox.emsgs(orgnum,583)%></a>
   <% 
    }
    if (course.indexOf("#") > 0)
    {
    %>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a    href="javascript:window.history.back()" ><%=Toolbox.emsgs(orgnum,1340)   %></a> <%
    }        
    
}
%>

<%
String  pid="0", fid, topic, des, author, format, lastupdate,aname, attach; 
boolean needtranslator = false;
String vv = ","; 
String bad = "";
StringBuffer allimagelets = new StringBuffer(); 
for (int i = 0; adapter.getValueAt(i,0)!=null; i++)
{
  n++;
  aname = Toolbox.makeFullName(adapter.getValueAt(i,8), " ", adapter.getValueAt(i,7)) ;
  pid = adapter.getValueAt(i,0).trim();
  vv += pid +",";
  fid = adapter.getValueAt(i,1);
  
  topic= adapter.getValueAt(i,2);
  if (topic!=null) 
      topic = topic.replaceFirst("\n","").replaceFirst("\r","").trim();
  des=  adapter.getValueAt(i,3);
  author= adapter.getValueAt(i,4);
  if (author==null) author = "";
  format=  adapter.getValueAt(i,5);
  lastupdate = adapter.getValueAt(i,6);
  long due;
  try{
    due = Long.parseLong(lastupdate);
  }catch(Exception e){due = 11100011;}
  if (format == null) format = "0";
   
  if (des != null) des = des.trim();
  if (des == null || des.equals("") )
     des = "&nbsp;";
  else  
     des = Toolbox.formatstr(format,des).replaceAll("&nbsp;", " ").replaceAll("\r", " "); 
  des = Toolbox1.todiv(orgnum, des, i);
  attach = adapter.getValueAt(i, 9);
  String code = "";
  if (attach!=null)
  try{
  code = attach.replaceFirst(".*@([A-Z|a-z|0-9|\\-|\\.]+),$","$1");
  code = (new Encode6b(orgnum)).rto6b(code);
  }catch(Exception e){}
  String [] X = Toolbox1.attaget(attach, i, null, orgnum);
  attach = X[0];
  //allimagelets.append(X[1]);
  //Toolbox1.unzip(adapter.getValueAt(i, 9)).replaceAll("([^@]+)@[0-9]+@([^,]+,)", "<span style=color:blue onclick=\"openpicorfile('$2','$1',this)\" >$1</span>&nbsp;&nbsp;");
%>
    <tr><td  width=100% > <style><%= X[1] %></style>
<script type="text/javascript" >document.write(round1('100% '));</script>
<table id="msg<%=i%>"  width="100%"  cellpadding=1 cellspacing=1 class=outset3 >
<tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>" >
  
  <td <%if(i==0){%>  onclick="sort(this,0)"  <%}%> align=left  width=30%>
     <p style="margin:0px 0px 0px 2px"><a name="<%=pid%>" /><b><%=topic%></b></p>
  </td>
  <td <%if(i==0){%>  onclick="sort(this,1)"  <%}%> align=left  width=20% > <NOBR><b><%=aname%></b></NOBR></td>
  <td <%if(i==0){%>  onclick="sort(this,2)"  <%}%> align=left  width=20% ><NOBR><%=Toolbox.timestr(due,cachedstyle.timeformat)%></NOBR></td>
  <td align=left  width=30%> 
   <table align=right cellpadding=0 cellspacing=1><tr>
  
  <td  align="center"> <% if (vv.indexOf("," + fid + ",") >=0 ){%>
  <a href=#<%=fid%> /><b><NOBR><%=Toolbox.emsgs(orgnum,902)%></NOBR></b> <%}%></td>
  <td  align=center > <% if (author.equals(ssn) ){%><input type=button class=GreenButton    onclick="javascript:openit('forumediti',<%=pid%>,'<%=topic.replaceAll("'","\\\\'")%>','<%=Toolbox.emsgs(orgnum,905)%>')" value="<%=Toolbox.emsgs(orgnum,905)%>"><%}%> </td>
  
  <td  align=center > <% if (author.equals(ssn) || subdb.equals(ssn) ){%><input type=button class=RedButton     onclick="javascript:openit1('forumdelete',<%=pid%>,'<%=topic%>',this)" value="<%=Toolbox.emsgs(orgnum,30)%>">  <%}%> </td>
  <% if (!old) {%>
  <td  align=center ><input type=button class=GreenButton     onclick="javascript:openit('forumnewi',<%=pid%>,'<%=Toolbox.emsgs(orgnum,151)%>: <%=topic%>','<%=Toolbox.emsgs(orgnum,903)%>')" value="<%=Toolbox.emsgs(orgnum,903)%>"></td>
  <td  align=center ><input type=button class=GreenButton     onclick="javascript:openit('forumnewi',0,'','<%=Toolbox.emsgs(orgnum,904)%>')" value="<%=Toolbox.emsgs(orgnum,904)%>"></td>
  <%}%>
  </tr></table></td></tr>
  
  <tr bgcolor=<%=cachedstyle.TBGCOLOR%> > 
   <td align=left style="padding:4px;" colspan=4 >
       <% if (attach.equals("") == false){ %><p style="margin:5px 5px 5px 5px"><img src="image/clip.png" width="28" > <%=attach%>   </p> <% } %>
       <div id="para<%=i%>" style="width:400px"><% if(!format.equals("0")) out.println( des.replaceAll("(?i)<iframe[ ]+src=([^>]+)>","<a href=$1 target=_blank>******</a>").replaceFirst("(?i)<.iframe>","")); else out.println(des); %> </div>
  </td>
  </tr>
  
</table>
<script type="text/javascript" >document.write(round2);
    <% if (format.equals("2")){%> needtranslator=true; <%}%>
</script>
  
</td></tr>
<%
}

int jj = 1;
try{ jj = Integer.parseInt(pid)+1;}catch(Exception e){} 
adapter.close();
String  allbad = ""; bad = " " + bad;
for (int i=0; i < bad.length(); i++)
   if (bad.charAt(i)<='Z' && bad.charAt(i)>='A' || bad.charAt(i)<='z' && bad.charAt(i)>='a')
       ;
   else
   allbad += ((int)bad.charAt(i)) + ",";
%>
</table>
<table><tr><td>
<form rel=opener name=form1 method=post action=Echo target="_blank"  >
<input type=hidden name=id value=<%=jj%> >
<input type=hidden name=numrows value=1>
<input type=hidden name=rdap>
<input type=hidden name=fid >
<input type=hidden name=courseid value="<%=course%>">
<input type=hidden name=author value="<%=ssn%>">
<input type=hidden name=topic  >
<input type=hidden name=title  >
<input type=hidden name=coursetitle value="<%=coursetitle%>">
<input type=hidden name=subdb value="<%=subdb%>"  >
<input type=hidden name=onsaved value="78"  >
<input type=hidden name=cellonblur value="14">
</form>
</td><td>
<form rel=opener name=form2 method=post action=discussview1.jsp  >
<input type=hidden name=wcds value="<%=searchstr0.replaceAll("\"","\\\"")%>" >
<input type=hidden name=course value="<%=course%>">
<input type=hidden name=coursetitle value="<%=coursetitle%>">
<input type=hidden name=subdb value="<%=subdb%>"  >
</form>
<form rel=opener name=form3 method=post action=DataTable  target="_blank"  >
<input type=hidden name=rdap value="studentgroup" >
<input type=hidden name=course value="<%=course%>">
<input type=hidden name=coursetitle value="<%=coursetitle%>">
<input type=hidden name=subdb value="<%=subdb%>"  >
<input type="hidden" name="semester" value="<%=semester%>"  >
</form>
</td></tr></table>

<script type="text/javascript" >  
<%=allimagelets%> 
var theurl = "<%=Toolbox1.geturl(request)%>";
var N = <%=n%>;
var encoding='<%=Toolbox.encoding%>';
var mpd = <%=jj%>;
var tstmp = <%=tstmp%>;
function openit(str, pd, tp, title)
{
   document.form1.topic.value = tp;
   formnewaction(document.form1, "DataForm");
   document.form1.title.value = title;
   if (str.indexOf("edit") > 0  )
      document.form1.id.value = pd;
   else
      document.form1.id.value = mpd;
   document.form1.fid.value = pd;
   document.form1.rdap.value = str;
   visual(document.form1);
document.form1.submit();
}

function openit1(str, pd, tp, btn)
{
   myprompt("<%=Toolbox.emsgs(orgnum,1067)%>" + tp, null,"open2(v,'" + pd +"')");
   promptwin.style.left = (thispagewidth()-24-parseInt(promptwin.style.width.replace(/px/,''))) + "px";
   var xy = findPositionnoScrolling(btn, window);
   promptwin.style.top  = (xy[1]-40) + "px";
}
var nav1 = null;
function open2(v,pd)
{
   if (v)
   {
   formnewaction(document.form1, "DataUpdate");
   document.form1.id.value = pd;
   nav1 = open("", "w" + tstmp, "menbar=0");
   nav1.opener = self;
   document.form1.target = "w" + tstmp;
   document.form1.rdap.value = "forumdelete";
   visual(document.form1);
document.form1.submit();
   }
}
 
function killsp(ta)
{
   if (ta.value=='') ta.value='deleted';
}
function syn(s)
{
   if (s == '1')
   {
      var str = document.form1.rdap.value;
      if (str.indexOf("edit") < 0)   
          mpd++;
      opengroup('<%=course%>');
    }
}

if (parent==window)
{
   // window.moveTo((screen.width-600)/2,5);
   // window.resizeTo(600,screen.height-10);
}
function openman()
{
   formnewaction(document.form3);
   visual(document.form3);
document.form3.submit();   
}
function opengroup(course)
{
   formnewaction(document.form2);
   document.form2.course.value=course;
   visual(document.form2);
document.form2.submit();
}
function openagain()
{
   opengroup('<%=course%>');
}
 
<%= Toolbox.msgjspout((orgnum%65536)+user.id, true)%>
resizehelpbut(window,<%=cachedstyle.fontsize%>);
var font_size = <%=cachedstyle.fontsize%>;
<%=statusstr%>
function resizeinputs()
{
   var inputs = document.getElementsByTagName("input");
   for (var i=0; i < inputs.length; i++)
   {
      if (browserstr.indexOf('MSIE') >= 0
         && (inputs[i].type=='button' || inputs[i].type=='submit'))
         ;//inputs[i].style.height = (font_size + 6) + 'px';
   }
}
resizeinputs();
function rewidth(n)
{
    for (var i=0; i < N; i++)
      document.getElementById("para" + i).style.width = n + 'px';  
}
var olddisconload=self.onload;
self.onload = function()
{
    var n= thispagewidth() - 80;
    rewidth(n);
    if (olddisconload!=null) olddisconload();
}
var olddisconresize = self.onresize;
self.onresize = function()
{
    rewidth(400);
    var n= thispagewidth() - 80;
    rewidth(n);
    if (olddisconresize!=null) olddisconresize();
}

function setdate(d)
{
    var str = timestr(d);
    myprompt('<%=Toolbox.emsgs(orgnum,583)%>('+timeformat + ")",str, "restart(v)",null);
}

function restart(v)
{
    var a = parseTime(v);
    if (a == invalidtimevalue)
    {
        myprompt(textmsg[75]  + ':<br>'+timeformat ,v, "restart(v)",null);
        //document.getElementById('promptinput').type='date';
        return;
    }
    if (typeof(parent.frames[0].redoit) == 'undefined')
    {
        parent.frames[0].openit1('discussview1.jsp?startshow=' + a);
    }
    else
    {
        parent.frames[0].redoit(a);
    }
}
var timeformat = "<%= cachedstyle.timeformat.replaceFirst("hh:mm","").trim() %>";
var haswebfolder=<%=user.websitename != null && !user.websitename.equals("")||user.webFileFolder != null && !user.webFileFolder.equals("") %>;

var C = [1,1,1,1];
   
   var order = 1;
   function sort(td, j)
   {
       var tr = td.parentNode;
       var tbl = tr.parentNode; 
       if (tbl.tagName.toLowerCase()!='table') tbl = tbl.parentNode;
       
       var x = [];
        
       order = C[j]; 
       C[j] *= -1;
       var xx = "";
       for (var i=0; i < N; i++)
       {
           x[i] = document.getElementById('msg'+i).rows[0].cells[j].innerHTML.replace(/<[^>]+>/g,'');
           if (j==0) 
               x[i] = x[i].replace(/(.*):([^:]+)$/,"$2:$1").replace(/[\r|\n]/,'');
           xx += x[i] + "\n";
       }
       
       var y = []; for (var i=0; i<x.length; i++) y[i] = i;
       y.sort(function(p,q){ if (j==0) if (x[p] > x[q]) return order; if (x[p] < x[q]) return -order; return order*(p - q);});
        
       for (var k=0; k < 6; k++)
       {
           var m =0, n = k; if (k>4) {m=1; n = 0;}
           for (var i=0; i < N; i++)
           {
               x[i] = document.getElementById('msg'+i).rows[m].cells[n].innerHTML;
           }
           for (var i=0; i < N; i++)
           {
               document.getElementById('msg'+i).rows[m].cells[n].innerHTML = x[y[i]];
           }
       }
         
   }
buildactmenu = function()
{
    recurainput(document.getElementsByTagName('table')[0]);
}        
</script>
 
<!--script src=resizeframe.js></script-->
<script type="text/javascript"   src="attachment.js"></script>
<script type="text/javascript"   src="curve.js"></script>
<script type="text/javascript"   src="timeformat.js"></script>
 <!-- <%=allbad%> -->
 <div id="copyright" style="text-align:center;color:#4d5ddd;font-size:12px"> 
<%= Toolbox.copyright[orgnum>>16]%> 
</div>
<iframe name="w<%=tstmp%>" width="1" height="1" scrolling="no"  style="visibility:hidden" />

</body>
</html>
 
