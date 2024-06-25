<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.io.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
 if (orgnum == -1) return;
 User user = (User)(session.getAttribute("User"));
%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">

<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
    <%=Toolbox.getMeta(orgnum)%>
    <title><%=Toolbox.emsgs(orgnum,56)%></title></head>
<style type="text/css">
  .special {background-color:#8000ff;color:white}
</style> 
<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px" >
<script type="text/javascript" >
<%=Toolbox.dimloc(510,380)%>
</script>

<% 
if (!Toolbox.verifytoken(request) ) return;
String content = Toolbox.defaultParam(orgnum,request, ("source"), null);
content = content.replaceAll("\r", "");
String  command = Toolbox.defaultParam(orgnum,request, ("command"), null);
command = Toolbox.validate(command, null, 15);
String  ext = Toolbox.defaultParam(orgnum,request, ("ext"), null);
command = Toolbox.validate(command, ",", 15);
String exts [] = ext.split("|"); 
if (ext == null || ext.equals(""))
    ext = "txt|txt";
%>
<%=Toolbox.title(command)%>
<font color=teal face=courier> 
<%
Runtime r = Runtime.getRuntime();
Process proc = null;
int n = Toolbox.getCounter();
String aline; 
int exitVal = 0;
try 
{
    String source = "f" + n;
    String dr = System.getProperty("user.dir");
    out.println("Output:<br>");
    String str =  source;
    if (ext != null)
        str += "." + exts[0];
    (new File(str)).delete();
    FileWriter aWriter = new FileWriter(str, true);
    aWriter.write(content);
    aWriter.close();

    proc = r.exec(command + " " + str);
     
    InputStream stderr = proc.getInputStream();
    InputStreamReader isr = new InputStreamReader(stderr);
    BufferedReader br = new BufferedReader(isr);
    out.print ("<font color=black>"); 
    
    while ( (aline = br.readLine()) != null)
    {
        out.print( aline + "<br>");
    }
     
    exitVal = proc.waitFor();
    (new File(str)).delete();
    out.println("<font color=teal>Exit code: " + exitVal + "<br>userDir:" + dr);
    
    String [] ls = (new File(dr)).list();
    for (int j = 0; j < ls.length; j++)
       if (ls[j].indexOf(source)>=0) out.println(ls[j] + "<br>");
    out.println("</font><br>");
}catch( Exception e){}
%>

</body>
</html>

