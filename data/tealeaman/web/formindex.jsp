<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>

<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.dbauthorize(application,session,request, response, "formindex.jsp", false)) == null)
{
    out.print(Toolbox.emsgs(orgnum,590));
    return;
}



%> 
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%><title><%=Toolbox.emsgs(orgnum,439)%></title> 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<%=Toolbox.unifontstyle(cachedstyle.fontsize,orgnum)%>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("formindex.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript"  src="formlist<%=(orgnum%65536)%>.js"></script>
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
      myprompt(txt);
      window.onerror = handleErr;
      return true;
}
window.onerror = handleErr;
}
var n= 0; 
if (typeof z != 'undefined') n = z.length;
var menus = ['<%=Toolbox.emsgs(orgnum,17)%>','<%=Toolbox.emsgs(orgnum,601)%>'];
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

   }
   if (adapter == null) continue;
   
   int n = adapter.executeQuery("select  format, name, roles, title from  Task WHERE name like '|%'  order by name ");
    if ( adapter.error().length() > 0)
   {
       adapter.close(); continue;
   }

   for (int i = 0; i < n; i++)
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
    
      document.write("<tr id=tr + " + i +" height=22><td width=15><a href=javascript:expandmenu(" + i +")><img   style=\"border:0px\" id=menu" + i +" src=image/menuc.gif></a></td><td  width=15><img   style=\"border:0px\" id=menud" + i +" src=image/menudc.gif></td><td  colspan=3 valign=center style=color:gold><nobr>" + arr[i] +"</nobr></td></tr>");
   }
}
function forms(arr)
{
   if (typeof cats=='undefined') return ;
   for (var i=0; i < arr.length; i++)
   {
      if (arr[i]=='') continue;
      document.write("<tr valign=center id=tr + " + i +"  height=22><td  width=15><a href=javascript:expand(" + i +")><img  style=\"border:0px\" id=sign" + i +" src=image/menuc.gif></a></td><td  width=15><img    style=\"border:0px\" id=signd" + i +" src=image/menudc.gif></td><td  colspan=3 valign=center style=color:gold><nobr>" + arr[i] +"</nobr></td></tr>");
   }
}

</script>
</head>
<body style="margin:6px 12px 6px 6px;background:<%= cachedstyle.IBGCOLOR %> right url(image/backgd.gif) repeat-y">
<center>

<%=Toolbox.logtitle(Toolbox.emsgs(orgnum,891), 210)%>
<form rel=opener name=f1 style="margin:5px 0px 5px 0px"  >
<TABLE  class=outset width=100% cellpadding=0 cellspacing=0 border="0">
<tr><td valign=center  width=15>
<img
style="border:0px" src=image/menuf0.gif></td><td  width=15><img
 style="border:0px" src=image/menuf.gif></td>
<td colspan="3"  valign="center"><a href=wordform.jsp?mode=1 target="rightwinta"><nobr><%=Toolbox.emsgs(orgnum,359)%></nobr></a>
</td></tr>
<script type="text/javascript" >
if (typeof cats != 'undefined')
forms(cats);
menu(menus);
</script>
<tr><td valign=center  width=15><img
 style="border:0px" src=image/menuf0.gif></td><td  width=15><img
 style="border:0px" src=image/menuf.gif></td>
<td valign="center" colspan="3"><a href="login.jsp?submit=Logout"><nobr><%=Toolbox.emsgs(orgnum,870)%></nobr></a>
</td></tr>
</TABLE>
</form>
 
<%=Toolbox.sponsor(orgnum,6, 210)%>
 
<script type="text/javascript"  src=formindex.js></script>
<script type="text/javascript"  src=floating.js></script>
<script type="text/javascript"  src=curve.js></script>
</body>
</html>
 

