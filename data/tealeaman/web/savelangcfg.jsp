<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*" %>

<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.SYSTEMADMIN|Systemroles.SYSTEMANALYST,application,session,request, response, "customize.jsp", true)) == null) 
    return;
String language = Toolbox.langs[orgnum>>16];
String encoding = Toolbox.encodings[orgnum>>16];
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>
</head>
<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px" > 
<%
 String Nstr =Toolbox.defaultParam(orgnum,request,"N","0"); 
 String tmp= Toolbox.defaultParam(orgnum,request,"temp","0");
 int N = 0; try{N = Integer.parseInt(Nstr);}catch(Exception e){}
 String rdap = Toolbox.defaultParam(orgnum,request,"rdapname",null);
 if (tmp.equals("2"))
 {
     Webform w = (Webform) Generic.storedProc.get(rdap);
     if (w!=null) 
         out.println("<body>"+ w.toString1().replaceAll("\n","<br><hr>") +"</body></html>" );
     return;
 }
 String keywords = Toolbox.defaultParam(orgnum,request,"keywords","");
 String help = Toolbox.defaultParam(orgnum,request,"text","");
 String title = Toolbox.defaultParam(orgnum,request,"title","");
 int k = 0;
 String sql="", sql1="", retv = "";
 String lbs = "", ctypes="", orders="", lbs2="";
 String fds = "";
 String defaultv = "";
 for (int i=0; i < N; i++)
 {
     if ( i > 0 ) 
     {
         lbs2+=",";
         lbs +=",";
         orders+=",";
         ctypes+=",";
         fds += ",";
     }
     String tt= Toolbox.defaultParam(orgnum,request,"t"+i+"_3" ," ");
     lbs += tt;
    // if(tt.charAt(0)=='2')
    //     lbs2 += Toolbox.defaultParam(orgnum,request,"t"+i+"_2" ," ");
    // else
     lbs2 += tt;
     orders += Toolbox.defaultParam(orgnum,request,"t"+i+"_1" ," ");
     ctypes += Toolbox.defaultParam(orgnum,request,"t"+i+"_4" ," ");
     String afield = Toolbox.defaultParam(orgnum,request,"t"+i+"_7" ," ");
     fds += afield;
     String dv = Toolbox.defaultParam(orgnum,request,"t"+i+"_8" ,"");
     if (!dv.equals(""))
        defaultv += afield  +"=" + dv + "\n";
 } 
  
  
 JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
 if (tmp.equals("0"))
 {
 long l = System.currentTimeMillis()/1000;
  
 
 //String db = "gb2312";
 
 
 sql = "INSERT INTO TaskLang(lastupdate,rdapname,fieldlabels,ctypes,orders,title,keywords,help,defaultv,language) VALUES("
         + l+",'" 
         + rdap.replaceAll("'", "''") 
         + "','" 
         + lbs.replaceAll("'","''")  
         + "','" 
         + ctypes.replaceAll("'","''")  
         + "','" 
         + orders.replaceAll("'","''") 
         + "','" 
         + title.replaceAll("'","''") 
         + "','" 
         + keywords.replaceAll("'","''") 
         + "','" 
         + help.replaceAll("'","''") 
         + "','" 
         + defaultv.replaceAll("'","''") 
         + "','"
         + Toolbox.langs[orgnum>>16]  
         + "')";
          
 sql1 = "UPDATE TaskLang SET lastupdate=" 
             + l 
             +",fieldlabels='" 
             +  lbs.replaceAll("'","''")  
             + "',ctypes='" 
             + ctypes.replaceAll("'","''")  
             + "',orders='" 
             + orders.replaceAll("'","''") 
             + "',help='" 
             + help.replaceAll("'","''") 
             + "',keywords='" 
             + keywords.replaceAll("'","''")
             + "',title='" 
             +  title.replaceAll("'","''") 
              + "',defaultv='" 
             +  defaultv.replaceAll("'","''") 
             + "' WHERE rdapname='"
             + rdap.replaceAll("'", "''") 
             + "' AND language='" + Toolbox.langs[orgnum>>16] + "'";
 
 k = adapter.executeUpdate(sql1);
  
 if (k!=1) k = adapter.executeUpdate(sql);
 if (k!=1)
 {
    k = adapter.executeUpdate("CREATE TABLE IF NOT EXISTS  TaskLang(lastupdate BIGINT,rdapname VARCHAR(30),fieldlabels  TEXT,ctypes TEXT,orders  VARCHAR(200),title  VARCHAR(80),help TEXT,keywords  VARCHAR(255), defaultv TEXT, language VARCHAR(20), PRIMARY KEY(rdapname,language))");
    k = adapter.executeUpdate(sql);
 }
 else
 {
    int n = adapter.executeQuery("select fieldlabels, title FROM TaskLang where rdapname='" + rdap + "' AND language='" + language + "'");
    if (n == 1)
        retv = adapter.getValueAt(0,0) + ", " + adapter.getValueAt(0,1);
 }
 }

 Webform w = (Webform)Generic.storedProc.get(rdap);
 
 String err = "";
 if (w!=null)
 {
    Task tk = new Task(adapter);
    err = tk.modifyone(orgnum,w, lbs2, ctypes,  orders,  keywords, title,  help, defaultv,false);
    tk.applyLang(w,orgnum);
    Generic.storedProc.put(w.name,w);
    tk.close(); 
 }
 
 adapter.close();
 if (!err.equals("")) 
     out.println(  err);
 else { 
%>
 
    <center>
        <%=Toolbox.title("Confirmation of Modification of " + rdap )%> <br>
    <style>  td.tt {background-color:<%=cachedstyle.TBGCOLOR%> }</style>
    <table border=1>
            <tr> <%=Toolbox.fields("k",orgnum, cachedstyle)%> <td class=tt align=left><%=k%> records updated to the database.</td></tr>
            <tr><%=Toolbox.fields("Labels",orgnum, cachedstyle)%> <td class=tt ><%=lbs%> </td></tr>
            <tr><%=Toolbox.fields("Storage",orgnum, cachedstyle)%> <td class=tt ><%=tmp.equals("0")?"Database":"Memory"%> </td></tr>
            <tr><%=Toolbox.fields("Sent Labels",orgnum, cachedstyle)%> <td class=tt ><%=lbs2%></td></tr>
            <tr><%=Toolbox.fields("Field Types",orgnum, cachedstyle)%> <td class=tt ><%=ctypes%></td></tr>
            <tr><%=Toolbox.fields("Orders ",orgnum, cachedstyle)%> <td class=tt ><%=orders%></td></tr>
            <tr><%=Toolbox.fields("SQL",orgnum, cachedstyle).replaceFirst("<td ","<td rowspan=3 ")%> <td class=tt ><%=sql%></td></tr>
            <tr><td class=tt ><%=sql1%></td></tr>
            <tr><td class=tt ><%=retv %></td></tr>
            <tr><%=Toolbox.fields("Task",orgnum, cachedstyle)%> <td class=tt ><%=w.toString().replaceAll("\n","<br><br>")%></td></tr>
            <tr><%=Toolbox.fields("Keywords",orgnum, cachedstyle)%> <td class=tt ><%=keywords%></td></tr>
            <tr><%=Toolbox.fields("Help",orgnum, cachedstyle)%> <td class=tt ><%=help.replaceAll("\n","<br><br>")%></td></tr>
    </table> 
 <%}%>
  <script type="text/javascript"  src=curve.js></script>     

</body>
</html>

