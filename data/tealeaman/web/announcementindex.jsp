
<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
int orgnum = Toolbox.setcharset(request,response); 
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum,  (Systemroles.TOTAL >> 1) << 1,application,session,request, response, "announcementindex.jsp", true)) == null) 
    return;

orgnum = user.orgnum; 
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%><title><%=Toolbox.emsgs(orgnum,270)%></title> 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("announcementindex.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript"  >
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
document.write(unifontstyle(<%=cachedstyle.fontsize%>));
</script>
</head>
<body style="margin:6px 12px 6px 6px;background:<%= cachedstyle.IBGCOLOR %> right url(image/backgd.gif) repeat-y">

<%

 
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (adapter.error().length() > 0)
{ 
    adapter.close();
    User.dberrorRelogin(application,session,request,response,"announcementindex.jsp");
    return;
}
String sql = "SELECT distinct id, title FROM Course, Session WHERE Course.id=Session.courseid and Session.instructor='" + user.id +"' AND Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester + "'";
int numcourses  = 0;
boolean b = adapter.executeQuery2(sql,false);
int ii = Toolbox.indexframewidth(cachedstyle.fontsize);
%><!--<%=sql%> -->
<%=Toolbox.logtitle(Toolbox.emsgs(orgnum,282), 204)%>
                                               
                            
<form rel=opener   name=form1 method=post   action=announcepage.jsp style="margin:5px 0px 5px 0px"  >
<input type=hidden name=CourseId>
<input type=hidden name=CourseTitle>
<input type=hidden name=rdap value="announcement0">
<input name=allids type=hidden value="" >
<input type=hidden name=subdb value="" >
 
<TABLE width=100% class=outset border=0 bgcolor=#DDCC11 cellpadding=2 cellspacing=0 align=center>

<tr><td><img src=image/tri.gif ></td><td align=left><div id="varywidthdiv<%=00%>" style="width:<%=ii%>px;overflow:hidden"><nobr><a href="javascript:openlink('announcepageother.jsp')" ><%=Toolbox.emsgs(orgnum,925)%></a>
</nobr></div></td></tr>

<% String allids="";
if ( (user.roles & Systemroles.INSTRUCTOR) > 0){%>
<TR><TD><img src=image/tri.gif ></td><td align=left><div id="varywidthdiv<%=01%>" style="width:<%=ii%>px;overflow:hidden"><nobr><a href="javascript:invoke('','<%=Toolbox.emsgs(orgnum,450)%>')" ><%=Toolbox.emsgs(orgnum,926)%></a>
</nobr></div></TD></TR>
 
<% 
for (int j = 0; b && adapter.getValueAt(j,0)!=null; j++)
{       numcourses++;
        String cid = adapter.getValueAt(j,0).trim();
        if (j>0) allids +=","; allids+= cid;
        String ctitle = adapter.getValueAt(j,1).trim();
        if (ctitle.length()>40) ctitle=ctitle.substring(0,40);
%>
<TR><TD><img src=image/tri.gif ></td><td align=left><div id="varywidthdiv<%=j%>" style="width:<%=ii%>px;overflow:hidden"><nobr><a href="javascript:invoke('<%=cid%>','<%=ctitle.replaceAll("'","\\'")%>' )" ><%=cid%>&nbsp;<%=ctitle%></a>
</nobr></div></TD></TR>
<%
}
} 
adapter.close();
%>

<TR><TD ><img src=image/tri.gif ></td><td align=left><div id="varywidthdiv<%=numcourses%>" style="width:<%=ii%>px;overflow:hidden"><nobr><a href="javascript:search()"><%=Toolbox.emsgs(orgnum,1136)%></a>
</nobr></div>
</TD></TR>
<% if ( (user.roles & Systemroles.SYSTEMADMIN) > 0) {%>
<TR><TD ><img src=image/tri.gif ></td><td align=left><div id="varywidthdiv<%=numcourses+1%>" style="width:<%=ii%>px;overflow:hidden"><nobr><a href="javascript:remind()"><%=Toolbox.emsgs(orgnum,1352)%></a>
</nobr></div>
</TD></TR>
<%}%>
</TABLE>
</form>  
<%=Toolbox.sponsor(orgnum, numcourses*9/5, 210)%>
<script type="text/javascript" >
function remind()
{
   openlink("synfolder.jsp?which=remind");
}
document.form1.allids.value = "<%=allids%>";
function openlink(str)
{
   postopen(str,parent.frames[1].name);
}
function search()
{
   formnewaction(document.form1, 'DataSelect?onbegin=111&cellonblur=111');
   document.form1.target = self.name;
   visual(document.form1);
   document.form1.submit();
   //parent.close();
}
function invoke(cid, ctitle)
{
   document.form1.CourseTitle.value=ctitle;
   document.form1.CourseId.value = cid;
   document.form1.target = parent.frames[1].name;
   formnewaction(document.form1,  "announcepage.jsp");
   
   visual(document.form1);
document.form1.submit();
   //if (typeof changeFlag == 'function')
   //    changeFalg(cid,false);
}
openlink("announcepageother.jsp");
</script>
<script type="text/javascript"  src=floating.js></script> 
<script type="text/javascript"  src=curve.js></script>
</body>
</html>
