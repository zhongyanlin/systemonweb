<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
String rdap = "eval"; 
String title =  Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("My Evaluation"), null), null, 40);

if(title == null) title= "TeaLeaMan";
String dim = Toolbox.defaultParam(orgnum,request, ("dim"), null);
dim =  Toolbox.validate(dim, null, 10);
User user = (User)(session.getAttribute("User"));
int width = 800;
int height = 600;
try{ width=Integer.parseInt(dim.substring(0,3)); height = Integer.parseInt(dim.substring(3));} catch(Exception e){}
String onbegin = MyRSA.encryptString0("popwin1=parent.frames[1].name;window.open('DataTable?subdb=&exbut=cph&rdap=evalselall',popwin1)",orgnum>>16);
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
 
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><%=Toolbox.getMeta(orgnum)%>
<title><%= Toolbox.emsgs(orgnum,1002)%></title>
<script type="text/javascript" >moveTo(0,0); resizeTo(screen.width,screen.height);</script> 
</head>

 
<frameset cols="54%,*" border=3px>
<frame name="tlmleval"  scrolling="auto"   src="DataTable?exbut=cph&subdb=&rdap=evalselection&onbegin=<%=onbegin%>" />
<frame name="tlmreval"  scrolling="auto"      />
</frameset>
</html>
