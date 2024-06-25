<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%!
String fields(String str, int orgnum, CachedStyle cachedstyle){return "<table  cellspacing=0 cellpadding=0 width=100% ><tr height=22 width=100% ><td width=100% style=\"background:linear-gradient(" + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ")\" ><font color=#DDCC11><b><NOBR>" + str +"</NOBR></b></font></td></tr></table>";}
%>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
 User user = (User)(session.getAttribute("User"));
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
<link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<title>compile</title></head>
<body> 
<%
 
if (   (user = User.authorize(orgnum, Systemroles.SYSTEMANALYST,application,session,request, response, "userrdapcompile.jsp", true)) == null|| !Toolbox.verifytoken(request)) 
    return;
orgnum=user.orgnum;

String query = Toolbox.defaultParam(orgnum,request,"query","").replaceAll("\r","");
String updateQuery = Toolbox.defaultParam(orgnum,request,"updateQuery","");
String insertQuery = Toolbox.defaultParam(orgnum,request,"insertQuery","").replaceAll("\r","");
String deleteQuery = Toolbox.defaultParam(orgnum,request,"deleteQuery","");
String webservice = Toolbox.defaultParam(orgnum,request,"webService","");
String help = Toolbox.defaultParam(orgnum,request,"help","");


String x[] =new String[2];
 
String format = Toolbox.defaultParam(orgnum,request,"format","Table");
Webform wf = new Webform("zzz","zzz",query,insertQuery,updateQuery,deleteQuery,webservice,help,format,1,1,1,1,"","","","");
wf.parseQuery();

if (wf.err.equals("")==false)
    out.print("<br><br><font color=red>Warning:</font> Default values not used:<br>" + wf.err);
if (wf.ctypes!=null)
for (int i=0; i < wf.ctypes.length; i++)
    if (wf.ctypes[i].indexOf("k")>=0 && wf.defaultv[i].equals("") )
         out.print("<br><br><font color=red>Warning:</font> Picker <b>" + wf.fields[i] + "</b> does not have a default values "); 

if ( wf.valid )
{
    boolean b = true;
    if (wf.fieldstr()!=null)
    out.print("<br><br>" + Toolbox.emsgs(orgnum,1078) +":<br>" + wf.fieldstr().replaceAll(";","<br>").replaceAll(",",", "));
    
    if (format.equals("LongForm") == false && format.equals("Form") == false && format.equals("Table") == false)
    {
       %>
    <script type="text/javascript" >
     if (typeof (parent.passfieldname)!='undefined')
        parent.passfieldname('<%=wf.fieldstr()%>');
    </script>
    </body></html>
    <%
       return;
    }
    
    if (wf.compile(updateQuery,x,false) == false)
    {
         out.print("<br><br>" + Toolbox.emsgs(orgnum,1080) +":" + updateQuery+";  <font color=red>" + wf.error() + "</font>" );
         b = false;
         
    }
    if (wf.compile( insertQuery,x, true) == false)
    {
        out.print("<br><br>" + Toolbox.emsgs(orgnum,1081) +":" + insertQuery+";  <font color=red>" + wf.error()+ "</font>" );
          b = false;
    }
    if ( wf.compile( deleteQuery,x, false) == false)
    {
        out.print("<br><br>" + Toolbox.emsgs(orgnum,1082) +":" + deleteQuery+";  <font color=red>" + wf.error()+ "</font>" );
           b = false;
    }
  
    if (b) out.print("<br>" + Toolbox.emsgs(orgnum,1083) +"");
    JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
    if (adapter.error().length()>0)
    out.print("<br>" + Toolbox.emsgs(orgnum,113)+": " + adapter.error() );
    adapter.close();
    %>
    <script type="text/javascript" >
     if (typeof (parent.passfieldname)!='undefined')
        parent.passfieldname('<%=wf.fieldstr()%>');
     var xx =  document.body.innerHTML ;
     
     xx = removejs(xx);
     
     parent.myprompt(xx);
    </script>
    <%
}
 
%>
 
</body>
</html>
