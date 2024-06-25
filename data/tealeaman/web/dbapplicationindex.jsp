<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.io.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%!   
   int reftimes(String str)
   {
       int i = -2, j =0;
       while ( ( i = str.indexOf("REFERENCES", i+2) ) > 0) j++;
       return j;
   }
   Object forlock = new Object();
%>
<%
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
String filename = Toolbox.installpath + File.separator + "formlist" + (orgnum%65536) + ".js";
      if (   (new File(filename)).exists() == false)
      {
         File f = new File(filename.replaceFirst(".js$", "1.js"));
         if (f.exists())
         {
             synchronized(forlock)
             {            
                 f.renameTo(new File(filename)); 
             }
         }
         else
         try
         {
             FileWriter fw = new FileWriter(filename);
             fw.write("var z = new Array();\n");
             fw.close();
         }
         catch(Exception e){}
      }
 
User user = null;
if ( (user = User.dbauthorize(application,session,request, response, "dbapplicationindex.jsp", false)) == null) 
    return;
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
 
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><%=Toolbox.getMeta(orgnum)%><title><%=Toolbox.emsgs(orgnum,439)%></title>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("dbapplicationindex.jsp","f1")%>";</script>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
<%=Toolbox.unifontstyle(cachedstyle.fontsize,orgnum)%>
</head>
<body style="margin:6px 12px 6px 6px;background:<%= cachedstyle.IBGCOLOR %> right url(image/backgd.gif) repeat-y">
<Center>
<%=Toolbox.logtitle(Toolbox.emsgs(orgnum,891), 210)%>
<script type="text/javascript" >
var N = 20; 
var rdaps = new Array( N);
var titles = new Array( N);
var formats = new Array( N);
</script>
 
<form rel=opener name=thisform method=post target=rightwinta action=Echo style="margin:5px 0px 5px 0px"  >
<input type=hidden name=rdap> 
  
<TABLE width=100%   border=0 cellpadding=2 cellspacing=0 class=outset >    
<%
int nn = 0;
JDBCAdapter adapter = null;
 
for (int ii = 0; ii < 2; ii++)
{
   adapter = null;
   if (ii==0)
      adapter =  Toolbox.getSysAdapter(orgnum);
   else if (user!=null)
   {
      if ( Systemroles.owndb(user.roles) == false    ) continue;
      user.changedb(user.id);
      if (user.getDBConnectInfo().server.equals(Toolbox.dbadmin[orgnum%65536].sysDBConnectInfo().server))
         continue;
      adapter = Toolbox.getUserAdapter(user, orgnum);
      
   }
   if (adapter == null) continue;
   else if ( adapter.error().length() > 0)
   { 
       adapter.close(); continue;
   }
   int n = 0;
   boolean bb = adapter.executeQuery2("select  format, name, roles, title from  Task WHERE name like '|%'  order by name ",false);
   
  
   for (int i = 0; bb && adapter.getValueAt(i,0)==null;  i++)
   {
       long ll = Long.parseLong(adapter.getValueAt(i,2));  
       if (ll==0 || 
           ll == Systemroles.TOTAL || 
             user!=null && (user.roles & ll) > 0    ) 
       {
        %>  
          <tr><td><img src=image/tri.gif ><a href="javascript:invoke(<%=(nn++)%>)"><%=adapter.getValueAt(i,3) %></a>
          </td></tr>
        <%
       }
   }
   %>
   <script type="text/javascript" > 
   <% for (int i = 0; i < n; i++)
   {%>
          rdaps[<%=i%>] = "<%=Generic.handle(adapter.getValueAt(i,1))%>";
          formats[<%=i%>] = "<%=adapter.getValueAt(i,0)%>"; 
    <%
   }%>
   </script>
   <%
   adapter.close();
}
%>
<tr><td><img src=image/tri.gif ><a href="javascript:invoke1()"><%=Toolbox.emsgs(orgnum,1269)%></a>
 </td></tr>
</TABLE> 
 
</form> 
<%=Toolbox.sponsor(orgnum,6, 210)%>
<script type="text/javascript" >
function getTotal(){return <%=nn%>;}
function invoke1()
{
   open("wordform.jsp?mode=1", parent.frames[1].name  );
}
function invoke(i)
{
   
   document.thisform.rdap.value=rdaps[i];
   formnewaction(document.thisform, "Data" + formats[i]);
   visual(document.thisform);
document.thisform.submit();
}
</script>

<script type="text/javascript"  src=floating.js></script>
<script type="text/javascript"  src=curve.js></script>
</body>
</html>
