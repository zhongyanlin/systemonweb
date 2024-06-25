<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.STUDENT|Systemroles.INSTRUCTOR |Systemroles.ASSESSER |Systemroles.TEACHINGADMIN,application,session,request, response, "courseindex.jsp", true)) == null) 
    return; 
orgnum = user.orgnum; 
String course =   Toolbox.defaultParam(orgnum,request,"course","", null, 30);
String coursetitle =   Toolbox.defaultParam(orgnum,request,"coursetitle","", "&@#$%+:", 200);
String subdb =   Toolbox.defaultParam(orgnum,request,"subdb","", null, 30);
if (!user.id.equals(subdb) && (user.roles == Systemroles.STUDENT)  )
{
    user.iid = subdb;
    session.setAttribute("User", user);
}
String sid =   Toolbox.defaultParam(orgnum,request,"sid", user.id, null, 30);
String str = "discussview.jsp?course=" + Toolbox.urlencode(course) + "&coursetitle=" 
            + Toolbox.urlencode(coursetitle) + "&subdb="  
            + Toolbox.urlencode(subdb) + "&sid="   
            + Toolbox.urlencode(sid);
user.changedb(subdb);
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
String sql = "";
String course1 = course;
course = course.replaceAll("'","''");
long l = 0;
String submitSQLstr = "select  id, fid, topic, content, author, format, lastupdate from  Forum  WHERE courseid='" + course.replaceAll("'","''") +"' order by id";
int n = 0;
boolean bb = adapter.executeQuery2(submitSQLstr,false);
 
 
if (!bb) 
{
   out.println(Toolbox.emsgs(orgnum,634) + adapter.error());
   adapter.close();
   return;
}
else if (adapter.getValueAt(0,0)==null)
{
    sql = "INSERT INTO Forum(id, fid, topic, content, author, format ) VALUES("
                                + "0,-1,'" + Toolbox.emsgs(orgnum,985) + "','" + Toolbox.emsgs(orgnum,1502) +"', 'TeaLeaMan',0)";
    adapter.executeUpdate(sql);
    bb =   adapter.executeQuery2(submitSQLstr,false);
}
%>

<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
    <script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("discussview.jsp","f1")%>";</script>
   
	</script>
	<title><%=Toolbox.emsgs(orgnum,898)%></title>
         <%=Toolbox.unifontstyle(cachedstyle.fontsize,orgnum)%>
</head>
<script type="text/javascript" >
 
var content=new Array(20); var l = 0;
</script>
 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<style type="text/css">
a.visited {color:blue}
</style>
 
<body bgcolor=<%= cachedstyle.DBGCOLOR %> leftmargin=6 rightmargin=6 bottommargin=0 topmargin=6>
<center> 
    
<table width=100% >
<%=Toolbox.title( coursetitle + ": " + Toolbox.emsgs(orgnum,898), 1) %> 
<tr><td>&nbsp;</td></tr> 
<% 
if (adapter.getValueAt(0,0)==null)
{%>
    <tr><td><a href="javascript:openit('forumnew',-1,0,'')">  &nbsp;New&nbsp;  </a>  
 <%
}


 
 
String  pid="0", fid, topic, des, author, format, lastupdate; 
boolean needtranslator = false; 
for (int i = 0; adapter.getValueAt(i,0)!=null; i++)
{
  n++; 
  pid = adapter.getValueAt(i,0).trim();
  fid = adapter.getValueAt(i,1);
  
  topic= adapter.getValueAt(i,2);
  des= adapter.getValueAt(i,3);
  author= adapter.getValueAt(i,4);
  format= adapter.getValueAt(i,5);
  lastupdate = adapter.getValueAt(i,6);
  long due;
  try{
    due = Long.parseLong(lastupdate);
  }catch(Exception e){due = 11100011;}
  if (format == null) format = "0";
  
   
  if (author.equals(sid))
  {
      out.print("<script type=text/javascript >content["+(l++)+"] = '" + Generic.handle(des.replaceAll("</script>","< /script>")) +"';</script>\n"); 
  }
 
  if (des != null) des = des.trim();
  if (des == null || des.equals("") )
     des = "&nbsp;";
  else  
     des = Toolbox.formatstr(format,des);
      
   
%>
<tr><td  width=100% >
<script type="text/javascript" >document.write(round1('100%'));</script>
<table width=100% cellpadding=1 cellspacing=1 class=outset3 >
<tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>" >
  <td width=45% ><b><NOBR><a name=<%=pid%> ><%=topic%></NOBR></b></td> 
  <td width=15% ><NOBR><%=Toolbox.timestr(due,cachedstyle.timeformat)%> </NOBR> </td>
  <td width=10% align=center > <% if (fid.equals("0")==false){%><a href=#<%=fid%> ><b><NOBR><%=Toolbox.emsgs(orgnum,902)%></NOBR></b></a><%}%></td>
  <td width=10% align=center > <% if (author.equals(sid) ){%><a href="javascript:openit('forumedit',<%=l-1%>,<%=pid%>,'<%=topic%>','<%=Toolbox.emsgs(orgnum,905)%>')"><b><NOBR><%=Toolbox.emsgs(orgnum,905)%></NOBR></b></a><%}%> </td>
  <td width=10% align=center ><a href="javascript:openit('forumnew',-1,<%=pid%>,'Re: <%=topic%>','<%=Toolbox.emsgs(orgnum,903)%>')"><b><NOBR><%=Toolbox.emsgs(orgnum,903)%></NOBR></b></a></td>
  <td width=10% align=center ><a href="javascript:openit('forumnew',-1,0,'','<%=Toolbox.emsgs(orgnum,904)%>')"><b><NOBR><%=Toolbox.emsgs(orgnum,904)%></NOBR></b></a></td>
</tr>
  <tr bgcolor=<%=cachedstyle.TBGCOLOR%> > <td colspan=6 <% if (format.equals("2")){needtranslator=true;out.print("latexml=1");} %> >
<%=des%> 
</td></tr></table>
<script type="text/javascript" > document.write(round2);</script>
<br>
</td></tr>
<%
}
int jj = 1;
try{ jj = Integer.parseInt(pid)+1;}catch(Exception e){} 
adapter.close();
%>
</table>
<form rel=opener name=form1 method=post action=Echo target=postmsg  >
<input type=hidden name=id value=<%=jj%> >
<input type=hidden name=rdap>
<input type=hidden name=fid>
<input type=hidden name=courseid value="<%=course1%>">
<input type=hidden name=author value="<%=sid%>">
<input type=hidden name=title>
<input type=hidden name=courseTitle value="<%=coursetitle%>">
</form> 
<script type="text/javascript" >
var replywin = null;
var mpd = <%=jj%>; 
var ll = -1;
var topic = '';
function openit(str,l, pd, tp, newt)
{
   ll = l; topic = tp;
   if (replywin != null) replywin.close();
   replywin  = window.open("", "postmsg", "toolbar=0,location=0,directories=0,status=0,menubar=0,alwaysRaised=0,scrollbars=1,resizable=1,width=640,height=480,top="+(screen.height-480)/2+",left="+(screen.width-640)/2); 
   document.form1.title.value = newt;
  // document.form1.action = "DataUpdate";
   formnewaction(document.form1, "DataForm");
   if (str.indexOf("edit") > 0  )
      document.form1.id.value = pd;
   else
      document.form1.id.value = mpd;
   document.form1.fid.value = pd;
   document.form1.rdap.value = str;
   visual(document.form1);
document.form1.submit();
}
function getInit()
{  
    var tt = ''; 
    if (ll>=0) tt = content[ll]; 
    return new Array(topic, tt, '1');
  // replywin.document.form1.Topic_t_30.value=topic;
  // if (ll>=0) replywin.document.form1.Content_a_20_60.value=content[ll];
}
function killsp(ta)
{
   if (ta.value=='') ta.value='deleted';
}
function syn(s)
{
   if (s == '1')
   {
      replywin.close();
      mpd++;
      window.open('<%=str%>','rightwinmoniter');
    }
    return 1;
}
var needtranslator = <%=needtranslator%>;
 
</script>
</body>
<script type="text/javascript"  src=curve.js></script>     

</html>
 
