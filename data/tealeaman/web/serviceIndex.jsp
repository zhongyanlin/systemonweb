<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
    User user = null;
if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR,application,session,request, response, "serviceIndex.jsp", true)) == null) 
    return;
%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">

<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><%=Toolbox.getMeta(orgnum)%><title><%=Toolbox.emsgs(orgnum,270)%></title> </head>
<body bgcolor=<%= cachedstyle.IBGCOLOR %>  leftmargin=6 rightmargin=6 bottommargin=6 topmargin=6 >
<Center>
<%=Toolbox.logtitle(Toolbox.emsgs(orgnum,578), 200)%>
 
<%
   

orgnum=user.orgnum;
if ( (user = User.dbauthorize(application,session,request, response, "assignedit.jsp", true)) == null) 
{
    out.print("</center><font color=white><b>You don't have a database now. A instructor should have one. Ask the System Administrator to create one for you"); 
    return;
}
String course = Toolbox.defaultParam(orgnum,request,"course",null);
String which = Toolbox.defaultParam(orgnum,request,"which",""); 
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (adapter.error().length() > 0)
{ 
    adapter.close();
    User.dberrorRelogin(application,session,request,response,"serviceindex.jsp");
    return;
}

int numcourses = -1;
if (course==null)
   numcourses = adapter.executeQuery("SELECT id, title FROM Course  WHERE current=1");
else
   numcourses = adapter.executeQuery("SELECT id, title FROM Course  WHERE id='" + course.replaceAll(",","' or id='") +"'");  
%>
 
<form    name=form1 method=post target=rightwinservicecourse  action=DataTable
  style="margin-bottom:0pt;margin-top:0pt;margin-left:0pt;margin-right: 0pt;" > 
<input type=hidden name=which value="<%=which%>"> 
<input type=hidden name=assignname> 
<input type=hidden name=rdap value=courseservice<%=which.equals("")?"s":""%>>
<input type=hidden name=wording value="">
<input type=hidden name=course>
<input type=hidden name=coursetitle>
<TABLE width=210 border=0 bgcolor="#DDCC11" cellpadding=1 cellspacing=0>                                                
<TR><TD valign=TOP>                                                
<TABLE width=100% border=0 cellpadding=3 cellspacing=1 bgcolor=<%= cachedstyle.IBGCOLOR %> >    

<% for (int j = 0; j < numcourses; j++)
{
        String cid = adapter.getValueAt(j,0).trim(); 
        String ctitle = adapter.getValueAt(j,1).trim();
%>
<TR><TD><img src=image/tri.gif><a href="javascript:openit('<%=cid%>','<%=ctitle.replaceAll("'","\\'")%>')"><%=ctitle%></a>
<!--a href="DataTable?rdap=courseservice&course=<%=cid%>&courseTitle=<%=ctitle%>" target=rightwinservicecourse>  <font  face="New Times"><%=ctitle%>  </font></a-->
</TD></TR>
<%
}
adapter.close();
%>
<!--TR><TD colspan=2><hr></TD></TR> 
<TR><TD valign=top align=right><font color="#ffffff">&bull;</font></TD><TD>
<a href="DataTable?rdap=Editing%20Processing" target=rightwinservicecourse>  <font  face="New Times"><%=Toolbox.emsgs(orgnum,577)%></font></a>
</TD></TR--> 
</form>  
</TD></TR>
</TABLE>                                                
</TD></TR></TABLE>
 

<%=Toolbox.sponsor(orgnum,9*numcourses/5, 210)%>
<script type="text/javascript" >
function openit(cd,ct)
{
  document.form1.course.value = cd;
  document.form1.coursetitle.value = ct;
  visual(document.form1);
document.form1.submit();
}
function fresh(){ if (parent.opener != null) parent.opener.fresh();}
window.onunload=fresh;
</script>
</body>
</html>
