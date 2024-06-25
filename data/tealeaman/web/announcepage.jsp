<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%!
String  butwidth(String str, int font_size)
{
   int leng = (str.length() * font_size)/2 + 2;
   int upper = 4 * font_size;
       
   if (leng <  upper) 
       leng =  upper;
   return  "style=width:" + leng +"px;";
}
%>
<% 
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
String course = Toolbox.defaultParam(orgnum,request,"CourseId","", null, 30);;
String courseTitle = Toolbox.defaultParam(orgnum,request,"CourseTitle","", "!@#$%&()-_+:/", 200);
long nowtime =  System.currentTimeMillis()/1000 ;
long defaultperiod = 16000000;//26*7*24*3600; // 26 weeks
String wcds = Toolbox.defaultParam(orgnum,request,"wcds",  " AND enddate >= " + nowtime);
long tstmp = System.currentTimeMillis() % 10000000;

String searchstr = wcds;
int k;
if ((k=searchstr.indexOf("courseid like "))>0)
{
    int k1 =searchstr.indexOf("'",k);
    int k2 =searchstr.indexOf("'",k1+1);
    course = searchstr.substring(k1+1,k2);
}
 
String ecourse = Toolbox.urlencode(course);
String ecourseTitle = Toolbox.urlencode(courseTitle);

User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum,  (Systemroles.TOTAL>>1) << 1,application,session,request, response, "announcepage.jsp", true)) == null) 
    return;
orgnum = user.orgnum; 
if ( (user = User.dbauthorize(application,session,request, response, "announcepage.jsp", true)) == null)
{
       out.print("</center><font color=white><b>You don't have a database now. A instructor should have one. Ask the System Administrator to create one for you"); 
       return;
}
user.changedb(user.id);
JDBCAdapter  adapter = Toolbox.getUserAdapter(user,orgnum);
String submitSQLstr = "SELECT Announcement.title, postdate, content, format, uid, attach FROM Announcement,AppUser WHERE uid=AppUser.id AND uid='" + user.id +"' AND courseid='" + course.replaceAll("'", "''") +"' " + searchstr +" order by postdate";
out.println("<!--" + submitSQLstr +"-->");
if (courseTitle.equals("")&&!course.equals(""))
{
    boolean b = adapter.executeQuery2("SELECT title FROM Course WHERE id='" + course +"'",false);
    if (b) courseTitle = adapter.getValueAt(0,0);
}    
 
String sql = "";

String course1 = course;
course = course.replaceAll("'","''");
long l = 0;
int n =  0;
boolean b = adapter.executeQuery2(submitSQLstr,false);
 
 
if (!b) 
{
   out.println(Toolbox.emsgs(orgnum,634) + adapter.error());
   adapter.close();
   return;
}
if (courseTitle.equals("")&&course.equals(""))
{
    courseTitle = Toolbox.emsgs(orgnum,1108);
}
 
String courseTitle1 = courseTitle;
if (courseTitle.equals(Toolbox.emsgs(orgnum,450)))  
    courseTitle1 = Toolbox.emsgs(orgnum,926); 
else 
    courseTitle1 = Toolbox.emsgs(orgnum,927) + (Toolbox.locales[orgnum>>16].worddelimiter)+ courseTitle + Toolbox.emsgs(orgnum,1056); 
%>

<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%> 
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
    <script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("announcepage.jsp","f1")%>";</script>
    <script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
    <title><%=Toolbox.emsgs(orgnum,633)%></title>
        
<script type="text/javascript" >
 if (document.location.toString().indexOf("localhost") >= 0
    && typeof (handleErr) == 'undefined')
{
function handleErr(msg, url, l)
{
      var txt= "There was an error on this page.\n\n"
       + "Error: " + msg + "\n"
       + "URL:   " + url + "\n"
       + "Line:  " + l + "\n\n"
       + "Click OK to continue.\n\n";
       myprompt(txt);
      window.onerror = handleErr;
      return true;
}
window.onerror = handleErr;
}
var tstmp = <%=tstmp%>;
 </script>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<%  out.print(Toolbox.unifontstyle(cachedstyle.fontsize,orgnum));%>    
</head>
<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px" >
  
<center>
<table width=100% >
    <%=Toolbox.title( courseTitle1 ,1) %>
    
   
    <tr>   <td width=10% align=center ><input type=button class=GreenButton   onclick="javascript:openit('announcenew','','')" value="<%=Toolbox.emsgs(orgnum,1069)%>"    ></td>
    </tr> 
    <% 
    
    
    String   topic, postdate, des, format; 
    String vv = ",";  
    boolean hasxml = false;
    boolean needtranslator = false;
    for (int i = 0; ( topic= adapter.getValueAt(i,0))!=null; i++)
    { 
    n++;
    String topic1 = topic.replaceAll("'","\\\\'");
    des= adapter.getValueAt(i,2); 
    format= adapter.getValueAt(i,3);
    postdate = adapter.getValueAt(i,1);
    long due;
    try{
    due = Long.parseLong(postdate);
    }catch(Exception e){due = 11100011;}
    if (format == null) format = "0";
    
    if (des != null) des = des.trim();
    if (des == null || des.equals("") )
    des = "&nbsp;";
    else  
    des = Toolbox.formatstr(format,des);
    des = Toolbox1.todiv(orgnum,des, i); 
    String X[] = Toolbox1.attaget(adapter.getValueAt(i, 5),i, null,orgnum);
    String attach = X[0];
    if (hasxml==false)
    { 
        hasxml=true;
    }
    %>
    <tr><td  width=100% >
            <style><%= X[1]%></style>
            <table width=100%  id="msg<%=i%>" cellpadding=1 cellspacing=1 class=outset3 >
                            <tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>">
                            <td width=55%  onclick="sort(this,0)"><p style="margin:0px 0px 0px 5px"><NOBR><b><%=topic%></b></NOBR></p></td>
                                <td width=25%  onclick="sort(this,1)"><NOBR><%=Toolbox.timestr(due,cachedstyle.timeformat)%></NOBR></td>
    <td width=20% align="right">
   <table cellspacing="1" cellpadding="0">
            <tr>
                                <td   align=center ><input type=button class=GreenButton   onclick="javascript:openit('announceedit','<%=topic1%>',<%=postdate%>)" value="<%=Toolbox.emsgs(orgnum,642)%>"> </td>
                                <td   align=center ><input type=button class=RedButton     onclick="javascript:openit1('announcedelete','<%=topic1%>',<%=postdate%>)" value="<%=Toolbox.emsgs(orgnum,30)%>">   </td>
            </tr>
    </table>
    </td>
                            <tr bgcolor=<%=cachedstyle.TBGCOLOR%> > <td colspan=3 <%if (format.equals("2")){needtranslator=true; }%>>
                                    <% if (attach.equals("") == false){%><table width="100%" cellspacing="3"><tr><td><img width=28 src="image/clip.png"  > <%=attach%> </td></tr></table>  <%}%>
                                    <p style="margin:5px 5px 5px 5px"><%= (des)%> </p>
            </td></tr></table> 
             
    </td></tr>
    <%
    }
    
    adapter.close();
    %>
</table>
<table><tr><td>
<form rel=opener name=form1 method=post action=Echo target="_blank"  >
<input type=hidden name=rdap>
<input type=hidden name=numrows value=1>
<input type=hidden name=title>
<input type=hidden name=postdate>
<input type=hidden name=onsaved value="74" >
<input type=hidden name=onsave >
<input type=hidden name=cellonblur value="75">
<input type=hidden name=subdb value="<%=user.id%>">
<input type=hidden name=courseTitle value="<%=courseTitle%>">
<input type=hidden name=course  value="<%=course%>">
</form>
</td><td>
 <form rel=opener name=form2 method=post action=announcepage.jsp  >
<input type=hidden name=wcds value="<%=wcds%>">
<input type=hidden name=subdb value="<%=user.id%>">
<input type=hidden name=CourseTitle value="<%=courseTitle%>">
<input type=hidden name=CourseId  value="<%=course%>">
 </form>
</td></tr></table>
<script type="text/javascript" >
 var theurl = "<%=Toolbox1.geturl(request)%>";
 var tstmp = <%=tstmp%>;
 function refresh()
 {
    formnewaction(document.form2);
    
    visual(document.form2);
document.form2.submit();
 }
var N = <%=n%>;
var haswebfolder=<%=user.websitename != null && !user.websitename.equals("")||user.webFileFolder != null && !user.webFileFolder.equals("") %>;
 
var langcode = "<%= Toolbox.langs[orgnum>>16]%>";  
var encoding='<%=Toolbox.encodings[orgnum>>16] %>';  
var replywin = null;
function openit(str, tp, tm)
{
   formnewaction(document.form1,"DataForm");
   document.form1.target =  '_blank';
   document.form1.title.value = tp;
   document.form1.rdap.value = str;
   document.form1.postdate.value = tm;
   
   visual(document.form1);
document.form1.submit();
}

function openit1(str, tp,tm)
{
   myprompt("<b><%=Toolbox.emsgs(orgnum,1067)%>\"" + tp +"\"?",null,
   "if(v)open2('"+ str +"','"+tp.replace(/'/g,"\\'") + "'," + tm+")" );
}

function open2(str,pd,tm)
{
   formnewaction(document.form1,"DataUpdate");
   var replywin = window.open("", "w" + tstmp );
   replywin.opener = self;
   document.form1.target =  "w" + tstmp;
   document.form1.title.value = pd;
   document.form1.rdap.value = str;
   document.form1.postdate.value = tm;
   visual(document.form1);
document.form1.submit();
}
 
 
function syn(s)
{
   if (s == '1')
   { 
      formnewaction(document.form2);
      
      visual(document.form2);
document.form2.submit();
      return 1;
   }
   return 2;
}
function dim(x,y)
{
            return "toolbar=0,location=0,directories=0,status=0,menubar=0,alwaysRaised=0,scrollbars=1,resizable=1,width=" + x +",height=" + y +",top=" + ((screen.height - y)/2) + ",left=" + ((screen.width-x)/2);
}
function op(str,x,y)
{
    openopen(str, '400_500'); 
} 
var needtranslator = <%=needtranslator%>; 
<%=Toolbox.msgjspout((orgnum%65536)+user.id,true)%>
function resizehelpbut(wind, fontsize)
{

   var fntsize = 16;
   if (typeof (fontsize) != 'undefined' && fontsize!=null)
      fntsize = fontsize;
   else if (typeof (font_size) != 'undefined' && font_size!=null)
      fntsize = font_size;
   var buts = wind.document.getElementsByTagName("input");

   for (var j=0; j < buts.length; j++)
   {

      if ( typeof buts[j].type != 'undefined' &&
           buts[j].type == 'button'  &&
           buts[j].offsetWidth < fntsize * charwidthrate() )
           buts[j].style.width = "" + (fntsize*charwidthrate()) + "px";
   }
}
resizehelpbut(window);
 
</script>
<script type="text/javascript"  src=resizeframe.js></script>
<script type="text/javascript"  src=attachment.js></script>
<script type="text/javascript"    src=curve.js></script>
</center>
<iframe name="w<%=tstmp%>" width="1" height="1" scrolling="no" style="visibility:hidden" />
</body>


</html>
 
