<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>

<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.SYSTEMANALYST,application,session,request, response, "tableindex.jsp", false)) == null)
    return;
if ( (user = User.dbauthorize(application,session,request, response, "tableindex.jsp", false)) == null) 
{
   out.print("You have no database now. A system analyst should have one. Ask the System Administrator to create one for you"); 
   return;
}
orgnum=user.orgnum;
CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
String mydb = Toolbox.defaultParam(orgnum, request, "mydb", null);
if ( (Systemroles.SYSTEMADMIN & user.roles) > 0 && mydb==null)
    user.changedb(null);
else 
    user.changedb(user.id);
String urllink = "";
 

JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (adapter.error().length() > 0)
{
    adapter.close();
    User.dberrorRelogin(application,session,request,response,"tableindex.jsp");
    return;
}
String cname = Toolbox.defaultParam(orgnum,request,"tname",null);
String act = Toolbox.defaultParam(orgnum,request,"act",null);
if (cname!=null) urllink += "&tname=" + cname;
if (act!=null) urllink += "&act=" + act;
%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,439)%></title>
<%
if (cname!=null && act!=null)
{
    String newname = Toolbox.defaultParam(orgnum,request,"newname",null); 
    if (newname!=null) urllink += "&newname=" + newname;
   String def = Toolbox.defaultParam(orgnum,request,"def",null);
   if (def!=null) urllink += "&def=" + def;
   String sql ="", sql1= null;
    if (act.equals("renametable"))
    {
       adapter.executeUpdate( "RENAME TABLE " + cname+    " TO " + newname);
        sql = "ALTER TABLE " + cname +    " RENAME TO " + newname;
        sql1 = "UPDATE Apptables SET lastupdate=" + (System.currentTimeMillis()/1000) +", tname='" + newname 
                +"', definition='" + def.replaceAll("'", "''")  +"' WHERE tname='" + cname + "'"; 
    } 
    else if (act.equals("savedef"))
    {
        sql = "INSERT INTO Apptables(lastupdate, tname, definition, roles) VALUES (" + (System.currentTimeMillis()/1000) + ",'" + cname  + "','" + def.replaceAll("'", "''") + "', 255)"; 
    }     
    else if (act.equals("renamequery"))
    {
        sql  = "UPDATE Task SET lastupdate=" + (System.currentTimeMillis()/1000) +", name='" + newname  +"'  WHERE name='" + cname + "'"; 
    }   
    else if (act.equals("dropquery"))
    {
        sql  = "DELETE FROM Task WHERE  WHERE name='" + cname + "'"; 
    }       
    else if (act.equals("droptable"))
    {
        sql = "DROP TABLE " + cname;
        sql1 = "DELETE FROM Apptables WHERE tname='" + cname + "'"; 
    } 
    int n = adapter.executeUpdate(sql);
    
    if (sql1!=null) n = adapter.executeUpdate(sql1);
    adapter.close();
    if ( n == 1)
    {
        out.println("</head><body><script type=text/javascript >parent.myprompt('"+Toolbox.emsgs(orgnum,71) + "');setTimeout('parent.refresh()',1000);</script></body></html>");
    }
    else
        out.println("</head><body><script type=text/javascript >parent.myprompt('"+ adapter.error().replaceAll("'","") + "');</script></body></html>"); 
                          
}

int i = 0;
String mode = Toolbox.defaultParam(orgnum,request,"mode","table");
if (mode!=null) urllink += "&mode=" + mode;
String tblp = Toolbox.defaultParam(orgnum,request, ("refresh"), null);
if (tblp!=null) urllink += "&refresh=" + tblp;
tblp = Toolbox.validate(tblp, null, 20);
String sortway = Toolbox.defaultParam(orgnum,request,"sortway","alphabet");
if (sortway!=null) urllink += "&sortway=" + sortway;
 

DbTable dbtable = new DbTable(adapter,user,sortway);
dbtable.init();
 
if (dbtable.tables.length < 2)
{
    adapter.close();
    DataMove.intisubdb(user);    //intisubdb(user,cachedstyle.TBGCOLOR);
    adapter = Toolbox.getUserAdapter(user, orgnum);
    dbtable = new DbTable(adapter,user,sortway);
    dbtable.init();
}
String dbn = adapter.dbname();
%>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css">  
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("tableindex.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script>
<script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>

 <style type="text/css"> 
 select.bigselect{border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;font-size:10pt;font-family:courier;width:200px}
 select.smallselect{border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;font-size:10pt;font-family:"Times New Roman"}
 input {font-size:15px}
</style>

</head>
<body  style="margin:6px 12px 6px 6px;color:#DDCC11;background:<%= cachedstyle.IBGCOLOR %> right url(image/backgd.gif) repeat-y">
    
<center>

<script type="text/javascript" > 
function  redo(sway)
{
   var xx = document.location.toString();
   if (xx.indexOf("?") > 0)
   {
      if (xx.indexOf("&sortway=") > 0)
        xx = xx.replace(/&sortway=[a-z]*/,'&sortway=' + sway);
      else
        xx += "&sortway=" + sway;
   }
   else
   {
        xx += "?sortway=" + sway;
   }
   document.location.href = xx;
}
function  passdbdatatypes()
{
    return "<%=Toolbox.allDatatypes(adapter.dbms)%>";
}
var storedprocs  = ',<%Set<String> e = Generic.storedProc.keySet();for (String nm:e){  out.print(nm +",");}%>';
    
function issystemrpoc(tn)
{
   return ( storedprocs.indexOf(','+tn+',') >= 0);
}

var i =  0;
var numtables = <%=dbtable.numTables%>;
var tables = [<%for (i = 0; i < dbtable.numTables; i++){out.print("'" + dbtable.tables[i]+"'");if (i <dbtable.numTables-1)out.print(",");}%>];
var definitions = [<%for (i = 0; i < dbtable.numTables; i++){out.print("\"" + Generic.handle(dbtable.defs[i]).replaceFirst("[^\\(]*", "") +"\"");if (i <dbtable.numTables-1)out.println(",");}%>];
var owner = [<%for (i = 0; i < dbtable.numTables; i++){out.print( dbtable.owner[i]);if (i <dbtable.numTables-1)out.print(",");}%>];
var exists = [<%for (i = 0; i < dbtable.numTables; i++){out.print( dbtable.exists[i]);if (i <dbtable.numTables-1)out.print(",");}%>];
var ab = new RegExp("[a-z|A-Z][^ ]*");
function findfds(s)
{
   s = s.replace(/'[^']*'/g,'');
   var k = s.indexOf("(");
   if (k==-1) return "";
   var fds = "";
   while (true)
   {
      var m = ab.exec(s.substring(k));
      if (m==null) return fds;
      var fd = "" + m;
      var lfd = fd.toLowerCase();
      if (lfd=='check' || lfd=='primary' || lfd=='foreign')
         return fds;
      if (fds!='')fds+=",";
      fds += fd;
     
      k += m.index + fd.length;
      k = s.indexOf(",",k);
      if (k==-1) return fds;
       
   }
   return fds;
}
var  tfields =  new Array(numtables);
var  numfields = new Array(numtables);
for (i=0; i < numtables; i++)
{
   var x = findfds(definitions[i]);
   if (x=='')
   {
      numfields[i] = 0;
      tfields[i] = null;
   }
   else
   {
      tfields[i] = x.split(",");
      numfields[i] = tfields[i].length;
   }
}
 
<%
if ( (user.roles & Systemroles.SYSTEMADMIN) > 0 && !user.id.equals(user.subdb) )
{
     out.print("var subdb='';");
}
else
{
     out.print("var subdb='" + user.id +"';");
}
out.println("var dbinfo = '" + adapter.dbInfo(). replaceAll("\n","|")+ "';\nvar errtable = new Array();");
out.println(dbtable.errjs.replaceAll("\n", ""));

if (!dbtable.err.equals(""))
{
    out.println("var err0=\"" + dbtable.err + "\",nerr=" + dbtable.nerr +";function readerr(t){return errtable[t];}\n");
}
int nn = dbtable.numTables;
if (nn > 13) nn = 13;
int numquerys = adapter.executeQuery("SELECT name,query,roles,format FROM Task WHERE (NOT format='Update') and (NOT format='Search') ORDER BY name,roles");
if (numquerys < 0) numquerys = 0;
long tstmp =  System.currentTimeMillis()%10000000;
String querys[] = new String[numquerys];
String [] defs = new String[numquerys];
String [] owner = new String[numquerys];
String [] format = new String[numquerys];
for (i = 0; i < numquerys; i++)
{
    querys[i] = adapter.getValueAt(i,0);
    defs[i] = adapter.getValueAt(i,1);
    owner[i] = adapter.getValueAt(i,2);
    format[i] = adapter.getValueAt(i,3);
}
 adapter.close();
%>
var  numquerys =  <%=numquerys%>;
var querys = [<%for (i=0; i < numquerys;i++){out.print("'"+querys[i]+"'");if (i<numquerys-1)out.print(",");}%>];
var qdefinitions = [<%for (i=0; i < numquerys;i++){out.print("\""+Generic.handle(defs[i])+"\"");if (i<numquerys-1)out.println(",");}%>];
var qowner = [<%for (i=0; i < numquerys;i++){out.print(owner[i]);if (i<numquerys-1)out.print(",");}%>];
var format = [<%for (i=0; i < numquerys;i++){out.print("'"+format[i]+"'");if (i<numquerys-1)out.print(",");}%>];
</script>
<%=Toolbox.logtitle(Toolbox.emsgs(orgnum,717), 210)%>

<form rel=opener name=form1 style="margin:5px 0 0 0" target=rightwintb  >
<TABLE width=100% class=outset cellpadding=1 cellspacing=0>
 <tr  height=28><td align=center colspan=2   ><font color=#DDCC11 size=4><%=Toolbox.emsgs(orgnum,38)%></font> <a href="tableer.jsp" target="rightwintb">ER Diagram</a></td></tr>
<tr><td align=center colspan=2><table cellspacing=0 cellpadding=0><tr><td>Sort
 </td><td><input type=radio style="background-color:transparent" name=orderby <%=sortway.equals("alphabet")?"checked":""%>  onclick=redo('alphabet')>alphabet
 </td><td><input type=radio style="background-color:transparent" name=orderby <%=sortway.equals("")?"checked":""%> onclick=redo('')>dependency
</td></tr></table></td></tr>
 <tr><td align=center colspan=2>
<select name=tablename multiple class=bigselect  size=<%=(nn<13)?13:nn%> onchange=dotable(this) ondblclick=godef(this) width=200 height=200>
</SELECT>
</td></tr>
<tr><td align=center>
<SELECT name=s1 class=smallselect onchange=start(this) ondblclick=start(this)>
<OPTION value="" selected><%=Toolbox.emsgs(orgnum,702)%></OPTION>
<OPTION value="tablemake.jsp?tablename=XX&subdb=<%=user.subdb%>"><%=Toolbox.emsgs(orgnum,703)%></OPTION>
<!--OPTION value="DataTable?rdap=XX%20Data"><%=Toolbox.emsgs(orgnum,704)%></OPTION>
<OPTION value="DataForm?rdap=XX%20Data"><%=Toolbox.emsgs(orgnum,705)%></OPTION>
<OPTION value="DataLongForm?rdap=XX%20Data">in LongForm</OPTION>
<OPTION value="DataText?rdap=XX%20Data"><%=Toolbox.emsgs(orgnum,706)%></OPTION>
<OPTION value="DataLaTex?rdap=XX%20Data"><%=Toolbox.emsgs(orgnum,707)%></OPTION>
<OPTION value="DataXML?rdap=XX%20Data"><%=Toolbox.emsgs(orgnum,708)%></OPTION>
<OPTION value="DataHTML?rdap=XX%20Data"><%=Toolbox.emsgs(orgnum,709)%></OPTION-->
<OPTION value=""><%=Toolbox.emsgs(orgnum,30)%></OPTION>
<OPTION value=""><%=Toolbox.emsgs(orgnum,89)%></OPTION>
</SELECT> </td><td>
   <input class=OrangeButton style=width:80px type=button value="<%=Toolbox.emsgs(orgnum,34)%>" onClick="newtable()"></td></tr>
</table>
</form>
<form rel=opener name=form2 style="margin:5px 0 5px 0"   >
<input type=hidden name=rdap>
<TABLE width=100% class=outset cellpadding=1 cellspacing=0>
<tr><td align=center colspan=2   ><font color=#DDCC11 size=4><%=Toolbox.emsgs(orgnum,27)%></font></td></tr>
<tr><td align=center colspan=2>
<select name=queryname class=bigselect ondblclick=godef1(this)  size=<%=(nn<13)?13:nn%> onchange=doquery(this) width=200 height=200>
</SELECT>
</td></tr>
<tr><td align=center>
<SELECT name=s2 class=smallselect onchange=start1(this) ondblclick=start1(this)>
<OPTION value="" selected><%=Toolbox.emsgs(orgnum,702)%></OPTION>
<OPTION value="querymake.jsp?queryname=XX&subdb=<%=user.subdb%>"><%=Toolbox.emsgs(orgnum,703)%></OPTION>
<!--OPTION value="DataTable?rdap=XX"><%=Toolbox.emsgs(orgnum,704)%></OPTION>
<OPTION value="DataForm?rdap=XX"><%=Toolbox.emsgs(orgnum,705)%></OPTION>
<OPTION value="DataLongForm?rdap=XX">in LongForm</OPTION>
<OPTION value="DataText?rdap=XX"><%=Toolbox.emsgs(orgnum,706)%></OPTION>
<OPTION value="DataLaTex?rdap=XX"><%=Toolbox.emsgs(orgnum,707)%></OPTION>
<OPTION value="DataXML?rdap=XX"><%=Toolbox.emsgs(orgnum,708)%></OPTION>
<OPTION value="DataHTML?rdap=XX"><%=Toolbox.emsgs(orgnum,709)%></OPTION-->
<OPTION value=""><%=Toolbox.emsgs(orgnum,30)%></OPTION>
<OPTION value=""><%=Toolbox.emsgs(orgnum,89)%></OPTION>
</SELECT> </td><td>
<input class=OrangeButton style=width:80px  type=button value="<%=Toolbox.emsgs(orgnum,34)%>" onClick="newquery()"></td></tr>
</table>
</form>
<center><nobr>
<a href="javascript:dbinfo1()"><%=dbn.length()<7?dbn:dbn.substring(0,7)%></a><% if ( (user.roles & Systemroles.SYSTEMADMIN) > 0  ) { %><font color=#DDCC11><b>|</b></font><a href=javascript:swtch()
                                                                                                         >Switch</a><%} if (!dbtable.err.equals("")) {%><font color=#DDCC11><b>|</b></font><a href=javascript:initerror() style=font-weight:700><%=Toolbox.emsgs(orgnum,75).replaceFirst(" .*","")%></a>
<%}%></nobr></center>

<%=Toolbox.sponsor(orgnum,200,1)%>

<form rel=opener name=f1 method=post action=tableindex.jsp target=w<%=tstmp%> stype="margin-bottom:0pts;margin-top:0pts;margin-right:0pts;margin-left:0pts" >
<input name="act" type="hidden">
<input name="def" type="hidden">
<input name="tname" type="hidden">
<input name="newname" type="hidden">
<input name="subdb"  type="hidden" type="<%=user.id%>">
</form>


<script type="text/javascript" >
var mode = "<%=mode%>";
var systemtotal = '<%=Systemroles.TOTAL%>';
var mydb = <%= (mydb!=null) %>;
var urllink = "<%=urllink%>"; 
function swtch()
{
    if (mydb == false) urllink += "&mydb=1";
    var url = "tableindex.jsp";
    if (urllink.length>0) url += "?" + urllink.substring(1);
    open(url, "_self");
}

function dbinfo1()
{
   myprompt('<nobr>Server: <%=user.dbinfo.server.replaceAll("\\\\","/")%></nobr><br><nobr>Driver: <%=user.dbinfo.driver%></nobr>',null,null);
}
var m716  = "<%=Toolbox.emsgs(orgnum,716)%>";
var m715="<%=Toolbox.emsgs(orgnum,715)%>";
var m22="<%=Toolbox.emsgs(orgnum,38)%>";
var m714="<%=Toolbox.emsgs(orgnum,714)%>";
var longstr = "<%=Toolbox.translate("Long", 0,Toolbox.begintranslate(adapter)) %>";
var tstmp = <%=tstmp%>;
function getSubdb(){return "<%=user.id%>";}
<% if (cname!=null) {%>
var initable ='<%=cname%>';
<%} else {%>
var initable = null;
<% 
if (tblp!=null)
{%>
 
window.open("tablemake.jsp?tablename=<%=tblp%>&mode=<%=mode%>&subdb=" + subdb, parent.frames[1].name);
<%}
else
{
%> 
parent.frames[1].document.writeln('<html><body style=\"background:<%=Toolbox.dbadmin[orgnum%65536].bgimage%> <%=cachedstyle.DBGCOLOR%>\" >Double click a table/query name to open the definition page or select a name and select an operation from the drop down menu');
<%
}
}%> 
var widthopt = null;

</script>
<script type="text/javascript"  src=tableindex.js></script>
<script type="text/javascript"  src=curve.js></script>
<script type="text/javascript"  src=floating.js></script>
<iframe name="w<%=tstmp%>" width="1" height="1"  style="visibility:hidden" src="" />

</body>
</html>
 





