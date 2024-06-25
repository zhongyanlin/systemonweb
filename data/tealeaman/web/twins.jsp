<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
String rdap = Toolbox.defaultParam(orgnum,request,"url",null);
if (rdap == null)
{
   out.print("need rdap");
   return;
}
  
String title = Toolbox.defaultParam(orgnum,request,"title","TeaLeaMan");
String dim = Toolbox.defaultParam(orgnum,request,"dim","800600");
int width = 800;
int height = 600;
String leftwidth = Toolbox.defaultParam(orgnum,request,"leftw","220");
try{ 
    width=Integer.parseInt(dim.substring(0,3)); 
    height = Integer.parseInt(dim.substring(3,6)); 
} catch(Exception e){}
int j = rdap.indexOf("rdap=");

String left = "tlml" +  rdap.substring(j+5,j+8);
String  right = "tlmr" + rdap.substring(j+5,j+8);
 
if(title == null) title= "TeaLeaMan";
%>

<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<title><%=title%></title>
<% if (rdap.indexOf("rdap=sch")<0) {%>
<script type="text/javascript" ><%=Toolbox.dimloc(width, height)%></script> 
<%}%>
</head>

 
<frameset cols="<%=leftwidth%>,*" border=3px>
<frame name="<%=left%>"  scrolling="auto"   src="<%=rdap%>" />
<frame name="<%=right%>"  scrolling="auto"  />
 
</html>
