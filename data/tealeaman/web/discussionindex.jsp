<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
 User user = null;
if ( (user = User.authorize(orgnum,  (Systemroles.TOTAL >> 1) << 1,application,session,request, response, "discussionindex.jsp", true)) == null) 
    return;
orgnum = user.orgnum; 
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,270)%></title> 
 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("discussionindex.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>
</head>
<body style="margin:6px 12px 6px 6px;background:<%=cachedstyle.IBGCOLOR %> right url(image/backgd.gif) repeat-y">
<center>
 
<%

String semester = Toolbox.defaultParam(orgnum,request,"semester",Toolbox.dbadmin[orgnum%65536].currentSemester, "-", 40);
  
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (adapter.error().length() > 0)
{
    adapter.close();
    User.dberrorRelogin(application,session,request,response,"discussionindex.jsp");
    return;
}
String sql = "SELECT distinct id, title, 1 FROM Course, Session WHERE Course.id=Session.courseid and Session.instructor='" + user.id +"' AND Session.semester='" + semester + "' UNION "
           + "SELECT Project.id, title,  2 FROM Project, ProjectMem WHERE Project.id=ProjectMem.pid AND ProjectMem.uid='" + user.id + "' ORDER BY 3, 1, 2";

int  numcourses = 0;
boolean bb = adapter.executeQuery2(sql,false);
 
%>
<%=Toolbox.logtitle(Toolbox.emsgs(orgnum,898), 204)%>

<form rel=opener   name=form1 method=post target=rightwindis action=discussview1.jsp style="margin:5px 0px 5px 0px"  >
<select  name=semester   style="font-family:inherit"   onchange="switchs(this)"><%= Toolbox.dbadmin[user.orgnum%65536].semesteropts(semester, orgnum) %></select>
<input type=hidden name=startshow >
<input name=allids type=hidden value="" >
<input name=rdap type=hidden value="forum0" >
<input type=hidden name=course>
<input type=hidden name=onbegin>
<input type=hidden name=coursetitle>
<input type=hidden name=subdb value="">
<input type=hidden name=id value="<%=user.id%>">
<TABLE width=100% class=outset bgcolor=#DDCC11 cellpadding=1 cellspacing=0 align=center>                                                
  
<TR><TD><img src=image/tri.gif></td><td align=left><a href="javascript:invoke('','<%=Toolbox.emsgs(orgnum,1064)%>' )" ><%=Toolbox.emsgs(orgnum,1064)%></a></TD></TR>

<% 
String allids="";
int ii = Toolbox.indexframewidth(cachedstyle.fontsize);
if (bb)
for (int j = 0;   adapter.getValueAt(j,1)!=null; j++)
{
        String cid = adapter.getValueAt(j,0).trim(); 
        if (cid==null||cid.equals(""))continue;
        if (j>0) allids +=","; allids+= cid;
        String ctitle = adapter.getValueAt(j,1).trim();
%>
<tr><td><img src=image/tri.gif></td><td align=left><div id="varywidthdiv<%=j%>" style="width:<%=ii%>px;overflow:hidden"><nobr> <a href="javascript:invoke('<%=cid%>','<%=ctitle.replaceAll("'","\\'")%>' )" ><%=cid%> <%=ctitle%></a></nobr></div></td></tr>
<%
}
adapter.close();
%>

<TR><TD ><img src=image/tri.gif ></td><td align=left><a href="javascript:search()"><%=Toolbox.emsgs(orgnum,37)%></a>

</TD></TR> 
</TABLE> 
</form>  
<%=Toolbox.sponsor(orgnum,6, 210)%>
 <script type="text/javascript" >
  document.form1.allids.value = "<%=allids%>";
function search()
{

   document.form1.onbegin.value = "67";
   formnewaction(document.form1, "DataSelect");
   document.form1.target = window.name;
   
   visual(document.form1);
document.form1.submit();
}
function invoke(cid, ctitle)
{
   document.form1.coursetitle.value=ctitle;
   document.form1.course.value = cid;
   document.form1.subdb.value = (cid=='')?'':'<%=user.id%>';
   if (typeof changeFlag == 'function')
       changeFlag(cid,false);
   formnewaction(document.form1);
   visual(document.form1);
   document.form1.submit();
}

function redoit(s)
{
    document.form1.startshow.value = s;
    visual(document.form1);
document.form1.submit();
}
var ll = 0;
var f = document.form1;
for (; ll < f.semester.options.length &&
f.semester.options[ll].value!='<%=semester%>';ll++);
f.semester.selectedIndex = ll;
function switchs(sel)
{
   postopen("discussionindex.jsp",['semester'],[sel.options[sel.selectedIndex].value],"_self");
   //document.location.href = "discussionindex.jsp?semester=" + sel.options[sel.selectedIndex].value;
}
function getsemester()
{
    var sel = f.semester;
    return sel.options[sel.selectedIndex].value;
}
//parent.rightwindis.document.writeln('<html><body bgcolor=<%=cachedstyle.DBGCOLOR%> >' + textmsg[401] ); 
 </script>
<script type="text/javascript"  src=floating.js></script>  
<script type="text/javascript"  src=curve.js></script>
<script type="text/javascript" >
 
invoke('','<%=Toolbox.emsgs(orgnum,1064)%>' );

</script>
</center>
</body>
</html>
