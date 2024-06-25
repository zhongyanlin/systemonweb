<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%!
String  butwidth(String str, int font_size)
{
   int leng = (str.length() * font_size)/2 + 2;
   int upper = 4 * font_size;
       
   if (leng <  upper) 
       leng =  upper;
   return  "style=width:" + leng +"px";
}
%>
<% 

int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (  (user = User.authorize(orgnum,  (Systemroles.TOTAL>>1) << 1,application,session,request, response, "announcepageother.jsp", true)) == null || !Toolbox.verifytoken(request)) 
    return;
String subdb = "";
orgnum = user.orgnum; 
CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
String style=Toolbox.butstyle(cachedstyle.fontsize).replaceAll("\"","");
JDBCAdapter   adapter = Toolbox.getSysAdapter(user.orgnum);
adapter.orgnum = orgnum;
 

%>

<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head> 
<%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
<% 
String browse = request.getHeader("User-Agent");
 
%>
    <script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("announcepageother.jsp","f1")%>"; 
    </script>
    <script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
     <title><%=Toolbox.emsgs(orgnum,633)%></title>
        <%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
         <%=Toolbox.unifontstyle(cachedstyle.fontsize,orgnum)%>
         <style type="text/css"> p{margin:5px 5px 5px 5px}</style>
</head>

<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px"  >
   
<table width="100%" >
<%=Toolbox.title(Toolbox.emsgs(orgnum,925) ,1) %> 
<tr>
<td  align=center ><input type=button class=GreenButton style="overflow:visible;height:<%=cachedstyle.fontsize+4%>px"   onclick="javascript:openit('announcenewother','','<%=Systemroles.TOTAL%>','<%=user.department%>')" value="<%=Toolbox.emsgs(orgnum,1069)%>"
  >&nbsp;<input type=button class=GreenButton style="overflow:visible;height:<%=cachedstyle.fontsize+4%>px"   onclick="javascript:openit('annnews','','0','')" value="<%=Toolbox.emsgs(orgnum,1586)%>"
  ></td>

</tr>
<%
String rolesql = "";
int m = 1;
for(; user.roles >= m; m *= 2)
{
    if ((user.roles & m) == 0) continue;
    if (rolesql.equals("")==false) rolesql += " OR ";
    rolesql += " (roles mod  " + (2 * m) + ") >= " + m;
}
if (rolesql.equals("")==false) 
    rolesql = " AND (" + rolesql + ")";
long nowtime =  System.currentTimeMillis()/1000 ;
long defaultperiod = 16000000; // two weeks
String wcds = Toolbox.defaultParam(orgnum,request,"wcds",  " AND enddate >= " + nowtime);
String searchstr = wcds;
 
 
long roles;
String submitSQLstr0= " WHERE  (department='' or  department='" + user.department +"')"   + rolesql;
java.util.Date dd = new java.util.Date();
 
String submitSQLstr = "SELECT  cdate, event  FROM Acalender  " + submitSQLstr0 + " AND cdate >" + nowtime + " AND cdate < " +(nowtime+defaultperiod); 
int n =  0;
boolean bb = adapter.executeQuery2(submitSQLstr,false);
boolean needtranslator = false;
if ( bb )
{
StringBuffer buf = new StringBuffer(100);
for (int j=0; adapter.getValueAt(j,0)!=null; j++)
{   n++;
    long kk = Long.parseLong(adapter.getValueAt(j,0));
    java.util.Date td = new java.util.Date(1000*kk);
   
    if (td.getDay()==dd.getDay())
        buf.append(Toolbox.emsgs(orgnum,1073));
    else
        buf.append(Toolbox.emsgs(orgnum,1074));
     buf.append(" ");
        buf.append(Toolbox.timestr(kk,"hh:mm"));//td.getHours() + ":" + td.getMinutes());
    buf.append(" ");
    buf.append(adapter.getValueAt(j,1).replaceAll("<","&lt;").replaceAll(">","&gt;"));
    buf.append("<br>");
}
dd.setDate(1); int tm =(int)( dd.getTime()/1000);
//String sql1 = submitSQLstr0 + " AND cdate >= " + (dd.getTime()/1000);
dd.setMonth(1); int ty = (int)(dd.getTime()/1000);
String dept = user.department;
//String sql2 = submitSQLstr0 + " AND cdate >= " + (dd.getTime()/1000);
%>
<tr><td  width=100% ><script type="text/javascript" >document.write(round1('100%'));</script>
<table width=100% cellpadding=1 cellspacing=1 class=outset3 >
<tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>">
  <td width=55%   ><p style="margin:0px 0px 0px 5px"><NOBR><b><%=Toolbox.emsgs(orgnum,1070)%></b></NOBR></p></td>
  <td width=25% ><NOBR><%=Toolbox.emsgs(orgnum,17)%></NOBR></td> 
<td width=20% align="right">
   <table cellspacing="1" cellpadding="0">
  <tr>
  <td  width="<%=4.5*cachedstyle.fontsize%>" align=center ><a href="calendertime.jsp?time=<%=tm%>"><b><NOBR><%=Toolbox.emsgs(orgnum,1072)%></NOBR></b></a></td>
  <td  width="<%=4.5*cachedstyle.fontsize%>"  align=center ><a href="calendertime.jsp?time=<%=ty%>"><b><NOBR><%=Toolbox.emsgs(orgnum,1071)%></NOBR></b></a></td>
 </tr></table></td>
</tr>
<tr bgcolor=<%=cachedstyle.TBGCOLOR%> > <td colspan=3><p><%=buf.toString()%></p></td></tr>
</table>
<script type="text/javascript" >document.write(round2);</script>
</td></tr>
<%
}

String direction = Toolbox.defaultParam(orgnum,request,"Direction",  "0");
 
if (direction.equals("0"))
{
    adapter.close();
    user.changedb(user.id);
    adapter = Toolbox.getUserAdapter(user,orgnum);
    subdb = user.id;
}
else 
{
    subdb = ""; 
}
 
if (searchstr.equals("") )
    searchstr = " AND enddate <=" +   nowtime ; 
else if (searchstr.toLowerCase().trim().indexOf("and ")!=0)
    searchstr += " and " + searchstr; 
if (direction.equals("2"))
{
    submitSQLstr = "SELECT Announcement.title, postdate, content, format, Announcement.roles, AppUser.lastname, AppUser.firstname, uid, Announcement.department, attach,courseid FROM Announcement, AppUser  WHERE "
    + "Announcement.uid = AppUser.id AND (courseid='' OR courseid='news & refer') AND  (Announcement.department='' or Announcement.department LIKE '%"  
    + user.department + "%') " 
    + rolesql.replaceAll("roles","Announcement.roles")  
    + searchstr + " order by postdate";
}
else
{
    submitSQLstr = "SELECT Announcement.title, postdate, content, format, Announcement.roles, '" + user.lastname + "','" +  user.firstname + "','" + user.id + "',Announcement.department, attach,courseid FROM Announcement  "
    +   searchstr.replaceFirst("AND ", "WHERE ") + "  AND (courseid='' OR courseid='news & refer') order by postdate";
     
}
String sql = "";
 
long l = 0;
bb =   adapter.executeQuery2(submitSQLstr,false);
 
if (!bb) 
{
   adapter.close();
   out.println(searchstr + "\n" + Toolbox.emsgs(orgnum,634) + submitSQLstr + adapter.error());
   return;
} 
 
String   topic, postdate, des, format,   fullname, uid,department,courseid; 

String vv = ","; 
for (int i = 0; (topic= adapter.getValueAt(i,0))!=null; i++)
{
  n++;
  roles = Long.parseLong(adapter.getValueAt(i,4)); 
  courseid = adapter.getValueAt(i,10);
  topic= adapter.getValueAt(i,0);
  des= adapter.getValueAt(i,2); 
  format= adapter.getValueAt(i,3);
  if (format == null) format = "0";
  format = format.trim();
   
  postdate = adapter.getValueAt(i,1);
   
  fullname = Toolbox.makeFullName(adapter.getValueAt(i,5),"",adapter.getValueAt(i,6));
  uid = adapter.getValueAt(i,7);
  department = adapter.getValueAt(i,8);
  String X[] = Toolbox1.attaget(adapter.getValueAt(i, 9), i, null, orgnum);
  String attach = X[0];// Toolbox1.unzip(adapter.getValueAt(i, 9)).replaceAll("([^@]+)@[0-9]+@([^,]+,)", "<span style=color:blue onclick=\"openpicorfile('$2','$1',this)\" >$1</span>&nbsp;&nbsp;"); 
  long due;
  try{
    due = Long.parseLong(postdate);
  }catch(Exception e){due = 11100011;}
  

  if (des != null) des = des.trim();
  if (des == null || des.equals("") )
     des = "&nbsp;";
  else  
     des = Toolbox.formatstr(format,des);
  des = Toolbox1.todiv(orgnum,des, i);
  String topic1 = topic.replaceAll("'","\\\\'");
%>
 
<tr><td  width=100% > <style><%=X[1]%> </style><script type="text/javascript" >document.write(round1('100%'));</script>
<table   id="msg<%=i%>"  width=100% cellpadding=1 cellspacing=1 class=outset3 >
<tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>" >
   <% if (uid.equals(user.id)) {%> 
<td width=55%  onclick="sort(this,0)" ><p style="margin:0px 0px 0px 5px"><NOBR><b><%=topic%></b></NOBR></p></td> 
  <td width=25%  onclick="sort(this,1)"><NOBR><%=Toolbox.timestr(due,cachedstyle.timeformat)%></NOBR></td> 
<td width=20% align="right">
   <table cellspacing="1" cellpadding="0">
   <tr>
  <% 
  if (courseid.equals("news & refer") && department.equals("") && uid.equals(user.id)){%>
  <td  align=center ><input type=button class=GreenButton  style="width:<%=cachedstyle.fontsize*Toolbox.charwidthrate()%>px;overflow:visible;height:<%=cachedstyle.fontsize+4%>px"   onclick="javascript:openit('annnews','<%=topic1%>',<%=postdate%>,'')" value="<%=Toolbox.emsgs(orgnum,642)%>"    >   </td>
<%} else {%>      
  <td  align=center ><input type=button class=GreenButton  style="width:<%=cachedstyle.fontsize*Toolbox.charwidthrate()%>px;overflow:visible;height:<%=cachedstyle.fontsize+4%>px"   onclick="javascript:openit('announceeditother','<%=topic1%>',<%=postdate%>,'')" value="<%=Toolbox.emsgs(orgnum,642)%>"    >   </td>
<%}%>
  <td   align=center ><input type=button class=RedButton   style="width:<%=cachedstyle.fontsize*Toolbox.charwidthrate()%>px;overflow:visible;height:<%=cachedstyle.fontsize+4%>px"   onclick="javascript:openit1('announcedeleteother','<%=topic1%>',<%=postdate%>)" value="<%=Toolbox.emsgs(orgnum,30)%>"   >    </td>
 
 </tr></table></td> <%} 
   else {%>
  <td width=50%  onclick="sort(this,0)"><NOBR><b><%=topic%></b></NOBR> </td>
  <td width=25%  onclick="sort(this,1)"><NOBR><%=Toolbox.timestr(due,cachedstyle.timeformat)%></NOBR></td> 
<td width=25% align="right">
 <table cellspacing="1" cellpadding="0">
  <tr>
  <td  align=center > <NOBR><%=fullname%></NOBR> </td>

  <td   align=center ><input type=button class=GreenButton  style="overflow:visible;height:<%=cachedstyle.fontsize+4%>px"   onclick="javascript:openit('announcequestion','<%=topic1%>','<%=uid%>','<%=fullname.replaceAll("'","\\'")%>')" value="<%=Toolbox.emsgs(orgnum,618)%>"   >   </td>
 
</tr>
</table>
</td>
  <%}%>
  </tr>
  <tr bgcolor=<%=cachedstyle.TBGCOLOR%> >
  <td colspan=3 <%if (format.equals("2")){ needtranslator=true;out.println("latexml");}%> >
      
      <% if (attach.equals("") == false){%><table width="100%" cellspacing="3"><tr><td><img width=28 src="image/clip.png"  > <%=attach%> </td></tr></table>  <%}%>
  <p style="margin:5px 5px 5px 5px"><%=des%> </p>
  </td>
  </tr>
  </table><script type="text/javascript" >document.write(round2);</script>
  </td></tr>
<%
}
  
adapter.close();
long tstmp = System.currentTimeMillis() % 10000000;
%>
</table>
<table><tr><td>
          
<form rel=opener name=form1 method=post action=Echo target="_blank"  >
<input type=hidden name=rdap>

<input type=hidden name=uid value="<%=user.id%>">
<input type=hidden name=title>
<input type=hidden name=postdate>
<input type=hidden name=cellonblur value="75">
<input type=hidden name=onsaved value="76">
<input type=hidden name=onsave >
<input type=hidden name=onbegin>
<input type=hidden name=subdb value="<%=subdb%>" >
<input type=hidden name=receiver value="">
</form>
</td><td>
 <form rel=opener name=form2 method=post action=announcepageother.jsp  >
<input type=hidden name=wcds value="<%=wcds%>">
 </form>
</td></tr></table>
<script type="text/javascript" >
var theurl = "<%=Toolbox1.geturl(request)%>";
var langcode = "<%= Toolbox.langs[orgnum>>16]%>";
var encoding='<%=Toolbox.encodings[orgnum>>16] %>';
var tstmp = <%=tstmp%>;
var replywin = null;
var submittimes = 1;
var tstmp = <%=tstmp%>;
var N = <%=n%>;
var haswebfolder=<%=user.websitename != null && !user.websitename.equals("")||user.webFileFolder != null && !user.webFileFolder.equals("") %>;
function reopen()
 {
   formnewaction(document.form2);
   
   visual(document.form2);
document.form2.submit();
 }
 
function  openit(str, tp, tm, nm)
{
   //document.form1.submittimes.value = parseInt(document.form1.submittimes.value) + 1;
   document.form1.title.value = tp;
   document.form1.target =  '_blank';
   document.form1.rdap.value = str;
   if (str.indexOf("acalen")>=0)
   {
      formnewaction(document.form1,  "DataHTML");
   }
   else
   {
      formnewaction(document.form1,  "DataForm");
   }
   if (str.indexOf('new')>0 ) 
   {
     // document.form1.onbegin.value  =  'ele(0,1).options[0]=new Option("<%=Toolbox.emsgs(orgnum,1068)%>","");ele(0,1).selectedIndex=0;mat[0][0]="<%=Systemroles.TOTAL%>";setv(0,0,mat[0][0]);valuechanged[0]=false;';
      document.form1.onsave.value = '77';
   }
   else
   {
      document.form1.onbegin.value  = "";
      document.form1.onsave.value  = "";
   }
   document.form1.postdate.value = tm;
   document.form1.receiver.value = nm;
   
   visual(document.form1);
document.form1.submit();
}

function openit1(str, tp,tm)
{
   myprompt("<%=Toolbox.emsgs(orgnum,1067)%>" + tp +"?", null, "if(v)open2(\""
      + str +"\",\"" + tp +"\",\"" + tm +"\")" );
}
 
          
function open2(str,pd,tm)
{
   formnewaction(document.form1,  "DataUpdate");
   var replywin = open("", "w" + tstmp, dim(280,350));
   replywin.opener = self;
   document.form1.target =  "w" + tstmp;
   document.form1.title.value = pd;
   document.form1.rdap.value = str;
   document.form1.postdate.value = tm;
   visual(document.form1);
document.form1.submit();
}
function op(x,y,str)
{
   postopen(str, x + '_' + y);
}
function syn(s)
{
   if (s == '1')
   {
      visual(document.form1);
      document.form2.submit() ;
      return 1;
   }
   return 2;
}

function dim(x,y)
{
    return "toolbar=0,location=0,directories=0,status=0,menubar=0,alwaysRaised=0,scrollbars=1,resizable=1,width=" + x +",height=" + y +",top=" + ((screen.height - y)/2) + ",left=" + ((screen.width-x)/2);
}
 
var needtranslator = <%=needtranslator%>;
<%= Toolbox.msgjspout((orgnum%65536)+user.id,true)%>
debugger;
resizehelpbut(window);
 
</script>
<script type="text/javascript"  src=attachment.js></script>
<script type="text/javascript"  src=resizeframe.js></script>
<script type="text/javascript" src=curve.js></script>
<iframe name="w<%=tstmp%>" width="1" height="1" scrolling="no" style="visibility:hidden" />
</body>
   

</html>
 

