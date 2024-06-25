<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>

<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.dbauthorize(application,session,request, response, "dbappindex.jsp", false)) == null)
{
    out.print(Toolbox.emsgs(orgnum,590));
    return;
}
 
long tstmp = System.currentTimeMillis()%10000000;

%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,439)%></title> 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<%=Toolbox.unifontstyle(cachedstyle.fontsize,orgnum)%>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("dbappindex.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript"  src="formlist<%= (orgnum%65536) %>.js"></script>
<script type="text/javascript"  src="formassociated<%= (user.orgnum%65536)%>.js"></script>
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
       alert(txt);
      window.onerror = handleErr;
      return true;
}
window.onerror = handleErr;
}
var n= 0; 
if (typeof z != 'undefined') n = z.length;
var menus = ['<%=Toolbox.emsgs(orgnum,17)%>','<%=Toolbox.emsgs(orgnum,601)%>'];
var iamsystemadmin = <%= (user.roles & Systemroles.SYSTEMADMIN) > 0 %>;
var m = new Array();
<%
int nn = 0, tt=0, jj=0;
JDBCAdapter adapter = null;

for (int ii = 0; ii < 2; ii++)
{
   adapter = null;
   if (ii==0)
      adapter = Toolbox.getSysAdapter(orgnum);
   else if (user!=null)
   {
      if ( Systemroles.owndb(user.roles) == false ) continue;
      user.changedb(user.id);
      if (user.getDBConnectInfo().server.equals(Toolbox.dbadmin[orgnum%65536].sysDBConnectInfo().server))
         continue;
      adapter = Toolbox.getUserAdapter(user, orgnum);
      if (adapter.error().equals("")==false && (user.roles & Systemroles.SYSTEMADMIN) > 0) 
      {
          adapter =  Toolbox.getSysAdapter(orgnum);
          user.changedb("");
      } 
   }
   if (adapter == null) continue;
   
   String  sql = "select  Task.format, Task.name, Task.roles, TaskLang.title from  Task, TaskLang WHERE Task.name like '|%' AND TaskLang.rdapname=Task.name AND TaskLang.language='" + Toolbox.langs[orgnum>>16] + "' order by name ";
   int n = 0;
    
   boolean bb = adapter.executeQuery2(sql,false);
   for (int i = 0; bb && adapter.getValueAt(i,0)!=null; i++)
   {
       long ll = Long.parseLong(adapter.getValueAt(i,2));
       if (ll==0 ||
           ll == Systemroles.TOTAL ||
             user!=null && (user.roles & ll) > 0    )
       {
        %>
         m[<%=jj++%>]=["Data<%=adapter.getValueAt(i,0) +"?rdap=" + Generic.handle(adapter.getValueAt(i,1)) + ((ii==0)?"":("&subdb=" + user.id +"&cdrdap=1")) %>","<%=adapter.getValueAt(i,3) %>",menus[<%=ii%>],""];
        <%
       }
   }
   out.println("var N = m.length;");
   tt  = ii;
   adapter.close();
}
if (tt==0) out.print("menus[1]='';");
%>
var act = [textmsg[841],textmsg[842],textmsg[843],textmsg[846],textmsg[844],textmsg[845]];
var acs = ['','s','r','r','u','d'];

function menu(arr)
{
   
   for (var i=0; i < arr.length; i++)
   {
    if (arr[i]=='') continue;
    
      document.write("<tr id=tr + " + i +"><td width=15><a href=javascript:expandmenu(" + i +")><img  width=<%=cachedstyle.fontsize%>    style=\"border:0px\" id=menu" + i +" src=image/menuc.gif></a></td><td  width=15><img  width=<%=cachedstyle.fontsize%>    style=\"border:0px\" id=menud" + i +" src=image/menudc.gif></td><td  colspan=3 valign=center style=color:gold><nobr>" + arr[i] +"</nobr></td></tr>");
   }
}
function forms(arr)
{
   if (typeof cats=='undefined') return ;
   for (var i=0; i < arr.length; i++)
   {
      if (arr[i]=='') continue;
      document.write("<tr valign=center id=tr + " + i +"><td  width=15><a href=javascript:expand(" + i +")><img  width=<%=cachedstyle.fontsize%>   style=\"border:0px\" id=sign" + i +" src=image/menuc.gif></a></td><td  width=15><img  width=<%=cachedstyle.fontsize%>     style=\"border:0px\" id=signd" + i +" src=image/menudc.gif></td><td  colspan=3 valign=center style=color:gold><nobr>" + arr[i] +"</nobr></td></tr>");
   }
}

</script>
</head>
<body style="margin:6px 12px 6px 6px;background:<%= cachedstyle.IBGCOLOR %> right url(image/backgd.gif) repeat-y">
<Center>

<%=Toolbox.logtitle(Toolbox.emsgs(orgnum,605), 210)%>
<form rel=opener name=f1 style="margin:5px 0px 5px 0px" action="Echo"  >
<TABLE  class=outset width=100% cellpadding=0 cellspacing=0 border="0">
<tr><td valign=center  width=15>
<img  width=<%=cachedstyle.fontsize%> alt="menuf0"
style="border:0px" src=image/menuf0.gif></td><td  width=15><img  width=<%=cachedstyle.fontsize%>
 style="border:0px" src=image/menuf.gif></td>
<td colspan="3"  valign="center"><a href="javascript:openpage('wordform.jsp?mode=1','')"><nobr><%=Toolbox.emsgs(orgnum,4)%></nobr></a>
</td></tr>


 

<tr><td valign=center  width=15>
<img  width=<%=cachedstyle.fontsize%>
style="border:0px" src=image/menuf0.gif></td><td  width=15><img  width=<%=cachedstyle.fontsize%>
 style="border:0px" src=image/menuf.gif></td>
<td colspan="3"  valign="center"><a href="javascript:openpage('webwizard.jsp?mode=1','')"><nobr><%=Toolbox.emsgs(orgnum,359)%></nobr></a>
</td></tr>
<script type="text/javascript" >
var norexiststr = '<%=Toolbox.emsgs(orgnum,1531)%>';
var font_size = <%=cachedstyle.fontsize%>;
 
if (typeof cats != 'undefined')
   forms(cats);
menu(menus);
 
function getFontSize(){return <%=cachedstyle.fontsize%>;}
</script>
</TABLE>
</form>
 
<%=Toolbox.sponsor(orgnum,6, 210)%>
 
<script type="text/javascript"  src=dbappindex.js></script>
<script type="text/javascript"  src=floating.js></script>
<script type="text/javascript"  src=curve.js></script>
<script type="text/javascript" >

function writeright()
{
    
    if (typeof(parent.frames[1].document) == 'undefined' || typeof(parent.frames[1].document.all) == 'undefined' ||parent.frames[1].document.all.length <=4)
    {
     
    var inst=open("", parent.frames[1].name);
    inst.document.write('<html><head><META HTTP-EQUIV="Pragma" CONTENT="no-cache"><%=Toolbox.getMeta(orgnum).replaceAll("\n","")%><title><%=Toolbox.emsgs(orgnum,439)%></title>');
    inst.document.write( '<%=cachedstyle.toString().replaceAll("\n"," ")%>');
    inst.document.write('<link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />');
    inst.document.write('</head>');
    inst.document.write('<body style="background:<%=Toolbox.dbadmin[orgnum%65536].bgimage%> <%=cachedstyle.DBGCOLOR%>;font-family:');
    inst.document.write( myfontname + ';font-size:<%=cachedstyle.fontsize%>" ><ul><li>');
    inst.document.write(textmsg[862].replace( /\n/g,"</li><li>") +"</li></ul></body></html>");
    
    }
}
var onloadbeforedb  = null;
if (typeof window.onload == 'function')
   onloadbeforedb = window.onload;
window.onload = function()
{
    if (onloadbeforedb!=null) onloadbeforedb();
    setTimeout(writeright ,500);
}
</script>
<iframe width="1px" height="1px" name="w<%=tstmp%>" />
</body>
</html>
 

