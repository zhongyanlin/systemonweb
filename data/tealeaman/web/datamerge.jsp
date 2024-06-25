
<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
%>
<%!
    String fields(int h, String str, int orgnum, CachedStyle cachedstyle) {
        return "<table  cellpadding=0 cellspacing=0 ><tr height=\"" + (h+6) +"px\" valign=middle><td class=fixed style=\"background:linear-gradient(to right," + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ")\" ><font color=#DDCC11><b><NOBR>" + str + "</NOBR></b></font></td></tr></table>";
    }

    String fields1(String str, int orgnum,CachedStyle cachedstyle) {
        return "<div style=background-color:" + cachedstyle.IBGCOLOR + ";color:#DDCC11;font-weight:700>" + str + "</div>";
    }
%>
<%
    
    User user = null;
    if ( (user = User.authorize(orgnum, Systemroles.SYSTEMANALYST, application, session, request, response, "datamerge.jsp", false)) == null || !Toolbox.verifytoken(request)) {
                return;
    }
    orgnum = user.orgnum; 
    if ((user = User.dbauthorize(application, session, request, response, "datamerge.jsp", false)) == null) {
                out.print("You have no database now. A system analyst  should have one. Ask the System Administrator to create one for you");
                return;
    }
    CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
    String thisdb = "";
    if (user.mydb)
    {
                thisdb = "&subdb=" + user.id;
    }
    JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
    if (adapter.error().length() > 0)
    {
                adapter.close();
                User.dberrorRelogin(application, session, request, response, "datamerge.jsp");
                return;
    }
    String rdapfields = "name,title, query, insertQuery, updateQuery, deleteQuery,webService, format, help,   roles, insertroles, updateroles, deleteroles,jscript,preop,postop,options";
    String sql = "";
    String tk =   Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("rdap"), null), null, 30);
    String mode = Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("mode"), null), null, 10);
    String style = "width:" + (4*cachedstyle.fontsize) + "px;font-size:" + cachedstyle.fontsize + "px";
if (mode == null)
{
%>

<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <%=Toolbox.getMeta(orgnum)%>
    <head> 
    <title><%=Toolbox.emsgs(orgnum,913)%></title>
     <%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
     <link rel="stylesheet" type="text/css" href="stylea.css" />
     <script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("datamerge.jsp","f1")%>";</script>
     <script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript"  src=findrep.js></script>
<% 
String tastyle= "Times New Roman;"+ cachedstyle.fontsize;  
%>
<style type="text/css">
form{margin:5px 0px 0px 0px}
.thehint{background:#DDDDAA;border:1px solid #991020;color:green;font-size:16px;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>}
td.fixed {font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:<%=cachedstyle.fontsize%>px;width:<%=(int)Math.ceil(cachedstyle.fontsize*Toolbox.charwidthrate())%>px}
td,table,tr,td.fixed {font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:<%=cachedstyle.fontsize%>px}
select {font-family:<%=tastyle.replaceFirst(";",";font-size:")%>px;border:1px #b0b0b0 solid}
textarea {font-family:<%=tastyle.replaceFirst(";",";font-size:")%>px;border:1px #b0b0b0 solid}
input.box {font-family:<%=tastyle.replaceFirst(";",";font-size:")%>px;border:1px #b0b0b0 solid}
</style>
                         
<%
    int nt = 0;
    boolean bb = adapter.executeQuery2("select lastupdate, " + rdapfields +" from  Task where format='Merge'  order by name",false);
    if (!bb) {
        out.print(adapter.error());
        nt = 0;
    }
    out.println("<script type=\"text/javascript\" >var sysrdaps = new Array(" + nt + ");");
    for (int i = 0; i < nt; i++) {
        out.println("sysrdaps[" + i + "] = \"" + adapter.getValueAt(i, 1).trim() + "\";");
    }
    out.println("</script>");
%>
</head>
<body style="background-color:<%=cachedstyle.DBGCOLOR%>"  >
<%=Toolbox.title(Toolbox.emsgs(orgnum,913)) %> 

<form rel=opener name="thisform" style="margin:0px 0px 0px 0px" METHOD="POST" action=DataTable onsubmit="return validate()" style="margin:5px 0 0 0"  > 
        <table cellspacing=4   align=center> 
        <tr><td align=center>
        <input   style="<%=style%>" class="GreenButton"  TYPE="button" NAME="submit1"    value="<%=Toolbox.emsgs(orgnum,34)%>"   onclick="javascript:new1()"
        ><input  style="<%=style%>" class="GreenButton"   TYPE="Button" NAME="submit7"     value="<%=Toolbox.emsgs(orgnum,37)%>" onclick="javascript:search()"
        ><!--input  style="<%=style%>" class="GreenButton"   TYPE="button"  name=test value="<%=Toolbox.emsgs(orgnum,975)%>" onclick=javascript:test1()
        --><input  style="<%=style%>" class="BlueButton"  TYPE="button" NAME="submit0"      value="<%=Toolbox.emsgs(orgnum,33)%>"  onclick="javascript:exec()"
        ><input  style="<%=style%>" class="GreenButton"  TYPE="Submit" NAME="submit3"     value="<%=Toolbox.emsgs(orgnum,36)%>" onclick="javascript:save()"
        ><input  style="<%=style%>" class="GreenButton"  TYPE="Button" NAME="submit2"     value="<%=Toolbox.emsgs(orgnum,35)%>" onclick="javascript:saveAs()"
        ><input  style="<%=style%>" class="GreenButton"  TYPE="Button" NAME="submit4"    value="<%=Toolbox.emsgs(orgnum,923)%>" onclick="javascript:rdapURL()"
        ><input  style="<%=style%>" class="RedButton"  TYPE="Submit" NAME="submit4"    value="<%=Toolbox.emsgs(orgnum,30)%>" onclick="javascript:deletet()"
        ><!--input  style="<%=style%>" class="GreenButton"  TYPE="Button" NAME="submit7"     value="<%=Toolbox.emsgs(orgnum,924)%>" onclick="javascript:setting()"
        --><input  style="<%=style%>" class="GreenButton"  TYPE="button" NAME="submit6"     value="<%=Toolbox.emsgs(orgnum,32)%>" onclick="javascript:showhelp()">
        </td></tr>
        </table>
        <script type="text/javascript" >document.write(round1('100%'));</script>
        <TABLE cellpadding=1 cellspacing=1 border="0" width=100% valign=top align=center class=outset3>
        <tr> 
        <td  class=fixed ><%=fields(cachedstyle.fontsize,Toolbox.emsgs(orgnum,67), orgnum,cachedstyle)%></td>
        <TD>
        <select style="height:<%=cachedstyle.fontsize+5%>px"  name=rdap onchange="javascript:fill()">
        <option value="Unnamed" selected><%=Toolbox.emsgs(orgnum,935)%></option>
    <%

            int numrdaps = nt + 1;//adapter.executeQuery("select * from  Task  order by name") + 1; 
            int hit = 0;
            String selectedstr = "";
            int maxnamelen = 8;
            for (int i = 0; i < numrdaps - 1; i++) {
                if (tk == null) {
                    selectedstr = (i == 0) ? "selected" : "";
                } else {
                    selectedstr = adapter.getValueAt(i, 1).trim().equals(tk) ? "selected" : "";
                }
                out.println("<option value=\"" + adapter.getValueAt(i, 1).trim() + "\" " + selectedstr + ">" + adapter.getValueAt(i, 1).trim() + "</option>");
                if (adapter.getValueAt(i, 1).trim().length() > maxnamelen) {
                    maxnamelen = adapter.getValueAt(i, 1).trim().length();
                }
            }
    %>
        </select>
        
        </td>
        <td  class=fixed  align="right">
        <input name=old class=box>
        </td>
        <td>
        <input type=button style="<%=style%>"  class="GreenButton"  name=btn1 value=<%=Toolbox.emsgs(orgnum,1113)%> onclick=findstrintextarea1(document.thisform.old.value)>
        </td>
        <td  class=fixed    valign=top>
        
        <%=fields(cachedstyle.fontsize,Toolbox.emsgs(orgnum,173), orgnum, cachedstyle)%>
        </td>
        <td>
           <nobr><a href="javascript:dbinfo1()"><%=user.dbinfo.server.replaceFirst("(.*)[:|/|=]([a-z|A-Z|0-9]+$)", "$2")%></a>
        <% if ((user.roles & Systemroles.SYSTEMADMIN) > 0) {%>
         | <a href=switchdb.jsp?page=datamerge.jsp> <%=Toolbox.emsgs(orgnum,936)%> </a>
        <%}%>
           </nobr>
</td>
<td><a href="javascript:tables()"> <%=Toolbox.emsgs(orgnum,38)%> </a></td>
<td  class=fixed>
           <input type=button  style="<%=style%>"   class="GreenButton"
           name=btn4 value="<%=Toolbox.emsgs(orgnum,1283)%>"
                onclick="userlevel()">

        </td>
        </tr>

        <tr> 
        <td class=fixed>
           <%=fields(cachedstyle.fontsize,Toolbox.emsgs(orgnum,27), orgnum, cachedstyle)%>
        </td>

        
        <td >
         
         </td>
         
        <td  class=fixed    align="right" >
        <input name=newone class=box>
        </td>
        <td  class=fixed>
        <input type=button  style="<%=style%>"   class="OrangeButton"     name=btn2 value="<%=Toolbox.emsgs(orgnum,1114)%>" onclick=replacestrintextarea(document.thisform.newone.value)>
        </td>


        </td>

        <td>
        <%=fields(cachedstyle.fontsize,Toolbox.emsgs(orgnum,914), orgnum, cachedstyle )%>
        </td>
        <td colspan="3">
        <input name="title" class=box size=30 onblur=showurl()>
        </td>

        
        </tr>
        
        <tr>
        <td    colspan="4"><textarea rows="9" name="query"   cols="55">select id as Id_t, concat(firstname,' ', lastname) as Name_t FROM AppUser where id='??StudentId??'

select courseid as cid, grade from Registration where sid='##Id##'</textarea></td>
        <td colspan=4 valign=top >
        <iframe style="border:1px #b0b0b0 groove !important;" name=tempshow height=485 width=400></iframe>
        </td>
        </tr>
        </table>
        <script type="text/javascript" >document.write(round2);</script>
        <table cellspacing=4   align=center> 
        <tr><td align=center style="font-size:12px;color:<%=cachedstyle.IBGCOLOR%>" > <nobr> <%= Toolbox.copyright[orgnum>>16]%> </nobr> 
        </td></tr>
        </table>
        <input type=hidden name=wcds>
        <input name="format" type=hidden value=Merge>
        <input name="mode" type=hidden value="">
        <input name=roles type=hidden>
        <input name=options type=hidden>
        </form> 
        
        </center>
        <script type="text/javascript" >
        var langcode = "<%= Toolbox.langs[orgnum>>16]%>";
        var encoding='<%=Toolbox.encodings[orgnum>>16]%>';
var fontsize = <%=tastyle.replaceAll("[^0-9]", "")%>,font_size=fontsize;
var maxnamelen = <%=maxnamelen%>;
function dbinfo1()
{
   myprompt('<nobr>Server: <%=user.dbinfo.server%></nobr><br><nobr>Driver: <%=user.dbinfo.driver%></nobr>',null,null);
}

var sysrdaps = [<%
if (!user.getDBConnectInfo().equals(Toolbox.dbadmin[orgnum%65536].sysDBConnectInfo()))
{
  java.util.Set<String> e = Generic.storedProc.keySet();
  for (String nm: e)
   out.print("\"" + (String)(nm) +"\",");
}
%>''];
thisdb = '<%=thisdb%>',popwin1=null,
numrdaps = <%=numrdaps%>,
names = new Array(<%=numrdaps + 20%>),
titles = new Array(<%=numrdaps + 20%>),
querys = new Array(<%=numrdaps + 20%>),
insertQuerys = new Array(<%=numrdaps + 20%>),
updateQuerys = new Array(<%=numrdaps + 20%>),
deleteQuerys = new Array(<%=numrdaps + 20%>),
webServices = new Array(<%=numrdaps + 20%>),
formats = new Array(<%=numrdaps + 20%>),
helps = new Array(<%=numrdaps + 20%>),
roles = new Array(<%=numrdaps + 20%>),
insertroles = new Array(<%=numrdaps + 20%>),
updateroles = new Array(<%=numrdaps + 20%>),
options = new Array(<%=numrdaps + 20%>),
deleteroles = new Array(<%=numrdaps + 20%>);
roles[0] = 4;
insertroles[0] = 4;
updateroles[0] = 4;
deleteroles[0] = 4;
names[0] = '';
titles[0] = '';
querys[0] = '';
insertQuerys[0] = '';
updateQuerys[0] = '';
deleteQuerys[0] = '';
formats[0] = '';
webServices[0] = '';
options[0] = '';
helps[0] = '';
<%
for (int i = 1; i < numrdaps; i++)
{
   String tt = adapter.getValueAt(i - 1, 1);
   out.println("names["+ i + "]=\""+ Generic.handle(tt) + "\";");
   
   tt = adapter.getValueAt(i - 1, 2);
   out.println("titles["+ i + "]=\""+ Generic.handle(tt) + "\";");
   
   tt = adapter.getValueAt(i - 1, 3);
   if (tt == null)
   {
      tt = "";
   }
   out.println("querys["+ i + "]=\""+ Generic.handle(tt) + "\";");
   
   tt = adapter.getValueAt(i - 1, 4);
   if (tt == null)
   {
      tt = "";
   }
   out.println("insertQuerys["+ i + "]=\""+ Generic.handle(tt) + "\";");
   
   tt = adapter.getValueAt(i - 1, 5);
   if (tt == null)
   {
      tt = "";
   }
   out.println("updateQuerys["+ i + "]=\""+ Generic.handle(tt) + "\";");
   
   tt = adapter.getValueAt(i - 1, 6);
   if (tt == null)
   {
      tt = "";
   }
   out.println("deleteQuerys["+ i + "]=\""+ Generic.handle(tt) + "\";");
   
   tt = adapter.getValueAt(i - 1, 7);
   if (tt == null)
   {
      tt = "";
   }
   out.println("webServices["+ i + "]=\""+ Generic.handle(tt) + "\";");
   
   tt = adapter.getValueAt(i - 1, 8);
   if (tt == null)
   {
      tt = "Table";
   }
   out.println("formats["+ i + "]=\""+ Generic.handle(tt) + "\";");
   
   tt = adapter.getValueAt(i - 1, 9);
   if (tt == null)
   {
      tt = "";
   }
   out.println("helps["+ i + "]=\""+ Generic.handle(tt) + "\";");
   
   tt = adapter.getValueAt(i - 1, 10);
   if (tt == null)
   {
      tt = "0";
   }
   out.println("roles["+ i + "]="+ tt + ";");
   
   tt = adapter.getValueAt(i - 1, 11);
   if (tt == null)
   {
      tt = "0";
   }
   out.println("insertroles["+ i + "]="+ tt + ";");
   tt = adapter.getValueAt(i - 1, 12);
   if (tt == null)
   {
      tt = "0";
   }
   out.println("updateroles["+ i + "]="+ tt + ";");
   
   tt = adapter.getValueAt(i - 1, 13);
   if (tt == null)
   {
      tt = "0";
   }
   out.println("deleteroles["+ i + "]="+ tt + ";");
}
out.println("var dbms='"+ adapter.dbInfo().substring(0, 15).replace('\n', ' ') + "';");
adapter.close();
%>
var nav2 = null;
var NT = <%=nt%>;
var tmsg937 = "<%=Toolbox.emsgs(orgnum,939)%>";
var newlabel = "<%=Toolbox.emsgs(orgnum,406)%>";
var toolmsg33 = "<%=Toolbox.emsgs(orgnum,33)%>";
var toolmsg37 = "<%=Toolbox.emsgs(orgnum,37)%>";
var toolmsg38 = "<%=Toolbox.emsgs(orgnum,38)%>";
var toolmsg36 = "<%=Toolbox.emsgs(orgnum,36)%>";
var maxroles = <%=Systemroles.TOTAL%>;
var maxroleslen = 32;
resizebut(document.thisform,fontsize);
function syn(x)
{
   <% if ((user.roles & Systemroles.SYSTEMADMIN) > 0)
   {
   %>
      if (x!='1') return 1;
         if ( ss == "savemsg")
         {
            //window.open("", ss, dim(340,300));
            f.target = "w" + tstmp;
            formnewaction(f,"follows.jsp?x=repository");
           visual(f);
 f.submit();
         }
      return 0;
   <%
   }
   %>
}
var IBGCOLOR='<%=cachedstyle.IBGCOLOR%>'; 
</script>
<script type="text/javascript"  src=datamerge.js></script>
 
<script type="text/javascript"  src=curve.js></script>     

</body>
</html>
<%
adapter.close();
return;
}
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>"><head> 
<link rel="stylesheet" type="text/css" href="stylea.css" />
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
</head>

<body style="margin:6px 6px 0px 6px;background-color:<%=cachedstyle.DBGCOLOR %>"  >
<%
String s[]  = rdapfields.split("[ ]*,[ ]*");
out.println(Toolbox.title( Toolbox.emsgs(orgnum,777)));
String rdap = Toolbox.defaultParam(orgnum,request,"rdap",null, null, 30);
if (rdap==null){return;}
if (mode.equals("exec"))
{
    
    Webform w = new Webform(user.id + "test",
            Toolbox.defaultParam(orgnum,request, "title","", "&-_@#$%+:", 200),
            Toolbox.defaultParam(orgnum,request, "query",""), 
            "",//Toolbox.defaultParam(orgnum,request, "insertQuery",""),
            "",//Toolbox.defaultParam(orgnum,request, "updateQuery",""),
            "",//Toolbox.defaultParam(orgnum,request, "deleteQuery",""),
            "",//Toolbox.defaultParam(orgnum,request, "webService",""),
            "",//Toolbox.defaultParam(orgnum,request, "help",""),
            "Merge",//Toolbox.defaultParam(orgnum,request, "format",""),
            Long.parseLong(Toolbox.defaultParam(orgnum,request, "roles","-1")),
            0,//Long.parseLong(Toolbox.defaultParam(orgnum,request, "insertroles","-1")),
            0,//Long.parseLong(Toolbox.defaultParam(orgnum,request, "updateroles","-1")),
            0,//Long.parseLong(Toolbox.defaultParam(orgnum,request, "deleteroles","-1")),
            "",//Toolbox.defaultParam(orgnum,request, "jscript",""),
            "",//Toolbox.defaultParam(orgnum,request, "preop",""),
            "",//Toolbox.defaultParam(orgnum,request, "postop",""),
            ""//Toolbox.defaultParam(orgnum,request, "permits","")

            );
            w.parseQuery();
            boolean valid = w.err.equals("");

           if (valid)
           {
           RequestDispatcher dispat = getServletConfig().getServletContext().getRequestDispatcher("/DataMerge?rdap=" + user.id + "test");
           dispat.forward(request, response);
           }
}
else if (mode.equals("insert"))
{
   String fs="lastupdate,name";
   String vs= "" + (System.currentTimeMillis()/1000)
                 + ",'" + rdap.replaceAll("'","''")+"'";
   for (int i=1; i < s.length; i++)
   {
    fs +="," + s[i];
    if (s[i].indexOf("roles")>=0)
       vs += "," + Systemroles.SYSTEMANALYST;
    else
       vs += ",'" + Toolbox.defaultParam(orgnum,request,s[i],"").replaceAll("'","''")+"'";

   }
   sql = "INSERT INTO Task(" + fs +",permits) VALUES (" + vs +",'')";

}
else if (mode.equals("update"))
{

   sql = "UPDATE Task SET lastupdate=" + (System.currentTimeMillis()/1000);
   for (int i=1; i < s.length; i++)
   {
     if (s[i].indexOf("roles")<0)
     {
        sql +=",";
        sql += (s[i] +"='" + Toolbox.defaultParam(orgnum,request,s[i],"").replaceAll("'","''")+"'");
     }
   }
   sql += (" WHERE name='" + rdap.replaceAll("'","''")+"'");


}
else if (mode.equals("delete"))
{
   sql = "DELETE FROM Task WHERE name='" + rdap.replaceAll("'","''")+"'";
}
int n = adapter.executeUpdate(sql);
if (n != 1)
{
   out.println("" + n +  adapter.error());
   
}
else
{
   out.println("<script type=\"text/javascript\" >var i=opener.syn(" + n +");if (i==0)close();");
   if ((user.roles & Systemroles.SYSTEMADMIN) > 0)
      out.println("else document.location.href='follows.jsp?x=repository&rdap='+escape('"
           + rdap +"')+'&mode="  + mode +"';");
   out.println("</script>");
}
adapter.close();
%>

