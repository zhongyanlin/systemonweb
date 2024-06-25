<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
    CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
%>
<%!
String dim(String s, int j)
{
   int i = s.indexOf("_");
   if (i==-1) return "";
   int k = s.indexOf("_", i+2);
   if (j==2 && k==-1) return "";
   if (j==1 && k==-1) return s.substring(i+1);
   if (j==1) return s.substring(i+1, k);
   if (j==2) return s.substring(k+1);
   return "";
}
String extrct(String h, String b, int orgnum)
{
   if (b.equals("n")) return Toolbox.emsgs(orgnum,262);
   int i = h.indexOf(b + ":");
   if (i == -1) return "";
   int k = h.indexOf(":",i+1);
   int j = h.indexOf("\n", k);
   if (j==-1) return h.substring(k+1);
   return h.substring(k+1,j);
}
String merge(String opt, String def)
{
   if (opt.equals("")) return def;
   if (def.equals("")) return opt;
   
   if (opt.indexOf(";")==-1)
   {
      int j = ("," + opt +",").indexOf("," + def +",");
      if (j==-1)
         return def + "," + opt;
      return def + ("," + opt +",").replaceFirst(def +",", "").replaceFirst(",$","");
   }
   else
   {
      return opt;
   }
}
String fields2(String str, int fontsize,  int orgnum, CachedStyle cachedstyle){return "<table  cellspacing=0 cellpadding=0><tr height=" + (fontsize+6) +"><td  style=\"background:linear-gradient(to right," + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ")\" ><font color=#DDCC11><b><nobr>" + str +"</nobr></b></font></td></tr></table>";}
void rename(String filename, String discard, JDBCAdapter adapter)
{
   try{

   int n = adapter.executeUpdate("UPDATE Task SET  name='" + discard.replaceAll("'","''") +"' WHERE  name='" + filename.replaceAll("'","''") + "'");
   n = adapter.executeUpdate("UPDATE TApptables SET  tname='" + discard.replaceAll("'","''") +"' WHERE  tname='" + filename.replaceAll("'","''") + "'");
   }catch(Exception e){}
}
/*void delete(String discard, JDBCAdapter adapter)
{
   try{
   int n = adapter.executeUpdate("DELETE FROM Apptables   WHERE tname='" + discard.replaceAll("'","''") + "'");
   n = adapter.executeUpdate("DELETE FROM Task  WHERE  name='" + discard.replaceAll("'","''") + "'");
   }catch(Exception e){}
} 
File  path(String filename,int orgnum)
{
   return new File(Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "forms" + File.separator + orgnum + File.separator + filename + ".htm");
}
*/
boolean deldir(File fd)
{
   try
   {
       if (!fd.exists()) return true;
       if (fd.isFile())
       {
           return fd.delete();
       }
       File t[] = fd.listFiles();
       boolean ans = true;
       for (int i =0; i < t.length; i++)
          ans = ans && deldir(t[i]);
       ans = ans && fd.delete();
       return ans;

   }catch(Exception e){return false;}
}
synchronized boolean uniquename(String name,JDBCAdapter adapter)
{
   String [] sqls = new String[5];
   sqls[0] = "SELECT formname from userform where formaname='" + name +"'";
   sqls[1] = "SELECT tname from Apptables where tname='" + name +"'";
   sqls[2] = "SELECT name FROM Task WHERE name='"  + name +"r'";
   sqls[3] = "SELECT name FROM Task WHERE name='"  + name +"s'";
   sqls[4] = "SELECT name FROM Task WHERE name='"  + name +"i'";
   for (int i=0; i < 5; i++)
      if (adapter.executeQuery(sqls[i]) > 0)
         return false;
   return true;
}



synchronized String renameTask(String rdap, String newrdap, String uid, User user,int orgnum)
{
   Formr c=null;
   String title = null,cat = null;
   Vector cats = new Vector(20);
   Vector nums = new Vector(20);
   int i = 0;
   FileInputStream fin = null;
   long rls = 0;
   String ans = "<center>" + Toolbox.emsgs(orgnum,71) + "</center>";
   try
   {
            File f = new File(Toolbox.installpath + File.separator + "formlist" +  (user.orgnum%65536)  + ".js");
            fin = new FileInputStream(f);
            InputStreamReader esr = new InputStreamReader(fin);
            BufferedReader ebr = new BufferedReader(esr);
            String aline = null;

            boolean done = false;
            boolean valid = true;
            boolean doner = false;

            while ((aline = ebr.readLine()) != null)
            {
              c = new Formr(aline);
              if (c.i == -1) continue;
              if (rdap.equals(c.rdap))
              {
                 cat = c.cat;
                 title = c.title;
                 rls = c.roles;
              }
            }
            i = 1;
     }
     catch(Exception e){}
     finally
     {
         try
         {
            if (fin!=null)
                fin.close();
         }
         catch(Exception e){}
     }
     if (i > 0)
     {
        Formr.modifyFile(rdap, null, null, uid, -1,user,1);
        ans = Formr.modifyFile(newrdap, title, cat, uid, rls,user,1);
     }
     return ans;
}
 
%>
<%
 
User user = null;

if ( !Toolbox.verifytoken(request) || (user = User.authorize(orgnum, -1,application,session,request, response, "webwizard.jsp", true)) == null)
    return;
orgnum=user.orgnum;
if ( (user = User.dbauthorize(application,session,request, response, "webwizard.jsp", true)) == null)
    return;
 
String style= Toolbox.butstyle(cachedstyle.fontsize);
boolean bb = user.changedb(user.id);
String securitytoken = Toolbox.gentoken("webwizard.jsp", "form1");
String uid1 = user.id;
String subdb = "&subdb=" + user.id + "&cdrdap=1";
long tstmp = System.currentTimeMillis() % 10000000;
if (user.getDBConnectInfo().equals(Toolbox.dbadmin[orgnum%65536].sysDBConnectInfo()))
{
     subdb = "";
     uid1 = "";
}
String mode = Toolbox.defaultParam(orgnum,request, ("mode"), null);
mode = Toolbox.validate(mode, null, 20);

String rdap = Toolbox.defaultParam(orgnum,request, ("rdap"), null);
rdap = Toolbox.validate(rdap, null, 30);

if (rdap!=null) rdap = rdap.replaceAll("'","");
 
String modifyinstr = "";
String srcs = "";
JDBCAdapter adapter = null;
if (mode!=null&& mode.equals("16"))
   adapter = Toolbox.getSysAdapter(orgnum);
else
   adapter = Toolbox.getUserAdapter(user, orgnum);
int topmargin = 6;
if (mode != null && (mode.equals("15") || mode.equals("2") || mode.equals("3") || mode.equals("4")) )
    topmargin = 0;
%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head> 
<%=Toolbox.getMeta(orgnum)%>

<%  if (mode != null && mode.equals("15") )out.println(Toolbox.jaxhead);  %>
<title><%=Toolbox.emsgs(orgnum,447)%></title>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<style type="text/css">
td.fieldhead{background-color:<%=cachedstyle.BBGCOLOR%>;font-weight:700}
td.fieldlbl{background-color:<%=cachedstyle.TBGCOLOR%>;}
.tdbutton{padding:-1px 0px -1px 0px;width:<%=Math.round(4.4*cachedstyle.fontsize)%>px;border:1px green outset;color:white;font-family:<%=Toolbox.fontsnamestr(orgnum>>16) %>;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#606060 -1px -1px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:3px;margin:3px 3px 3px 3px;}
           
.buttong {border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;background:url(image/GreenButton.gif);width:<%=4*cachedstyle.fontsize%>px;text-alignment:center;color:white;border:1px #EEEEEE outset;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#707070 -1px -1px}
.buttonr {border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;background:url(image/RedButton.gif);width:<%=4*cachedstyle.fontsize%>px;text-alignment:center;color:white;border:1px #EEEEEE outset;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#707070 -1px -1px}
.buttono {border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;background:url(image/OrangeButton.gif);width:<%=4*cachedstyle.fontsize%>px;text-alignment:center;color:white;border:1px #EEEEEE outset;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#707070 -1px -1px}
.buttonb {border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;background:url(image/BlueButton.gif);width:<%=4*cachedstyle.fontsize%>px;text-alignment:center;color:white;border:1px #EEEEEE outset;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#707070 -1px -1px}
</style>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle) %>, securitytoken="<%=Toolbox.gentoken("webwizard.jsp","f1")%>"; <%if (mode != null && mode.equals("15") ){%>  var needtranslator = true; <%}%></script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<%=Toolbox.unifontstyle(cachedstyle.fontsize,orgnum)%>
</head>
<body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:<%=topmargin%> 4px 4px 4px;<%=(mode!=null&&(mode.equals("1")||mode.equals("9")||mode.equals("19")))?"":("background-position:0px -100px") %>" >

<%


if (mode!=null)
{ 
   
if (mode.equals("1"))  //
{
 /*  File fd = new File(Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "forms" + File.separator + orgnum);
   if (fd.exists()==false)
       fd.mkdir();
*/ 
   String designleft = Formr.incomplete(user, adapter, "design");
   // null means no table, '' means no
   String sql; int n = 0;
   int sindex = Toolbox.begintranslate("mysql");
   int tindex = Toolbox.begintranslate(adapter.dbms);
 
   if (designleft ==null)
   {
       
       sql = "Create Table userform(lastupdate BIGINT,formname varchar(20),uid varchar(20),roles BIGINT, permits varchar(255),primary key(formname))";
       int m = adapter.executeUpdate(Toolbox.translateStr(sql,sindex,tindex));
       sql = "CREATE TABLE Apptables (lastupdate BIGINT  NOT NULL ,tname VARCHAR (20)   NOT NULL ,definition TEXT  NOT NULL ,roles BIGINT  NOT NULL,PRIMARY KEY (tname) )";
       m = adapter.executeUpdate(Toolbox.translateStr(sql,sindex,tindex));
       sql = "CREATE TABLE Task (lastupdate BIGINT  NOT NULL ,name VARCHAR (50)    NOT NULL,title VARCHAR (80),query TEXT  NOT NULL ,insertQuery TEXT ,updateQuery TEXT ,deleteQuery TEXT ,webService TEXT ,format VARCHAR (25) NOT NULL,help TEXT ,roles BIGINT  NOT NULL ,insertroles BIGINT  NOT NULL ,updateroles BIGINT  NOT NULL ,deleteroles BIGINT  NOT NULL ,jscript VARCHAR (20),preop VARCHAR (20),postop VARCHAR (20),permits VARCHAR (200), options TEXT,PRIMARY KEY (name))";
       m = adapter.executeUpdate(Toolbox.translateStr(sql,sindex,tindex));
   }
   else if (!designleft.equals(""))
   {
       adapter.close();

       %>
   <script type="text/javascript" >
      var thismode = <%=mode%>;
    
      parent.frames[1].document.location.href= "webwizard.jsp?mode=2&rdap=<%=designleft%>";
      document.location.href= "webwizard.jsp?mode=9&rdap=<%=designleft%>&fromm=2";
   </script>

       <% return;
   }
   else
   {
       sql = "SELECT Apptables.tname,Task.name,userform.formname FROM Task, Apptables, userform WHERE userform.uid='" + user.id +"' AND userform.formname=Apptables.tname AND CONCAT(userform.formname,'r')=Task.name";
       sql = Webform.mysql2c(adapter.dbms, sql);
       n = adapter.executeQuery(sql);
       {
         // sql = "SELECT Apptables.tname, userform.formname FROM Apptables,  userform  WHERE   userform.formname=Apptables.tname AND userform.uid='" + user.id +"' AND userform.formname NOT IN (SELECT name FROM Task)";
         //   n = adapter.executeQuery(sql);
       }
   }
%>
 
<center>
<%=Toolbox.title(Toolbox.emsgs(orgnum,359) )%>

<table><tr height=3><td valign=TOP></td></tr></table>

<table BORDER=0 cellspacing=0 cellpadding="0" align="center" >
<tr><td>
<form rel=opener style="margin:0px 0px 0px 0px" name="form1" onsubmit="return validate()" target="subwin" method="post" action="webwizard.jsp"  >
<table  align="center" cellspacing="2" cellpadding="0">
<tr><td id="newbtn" class="tdbutton GreenButton" align="center" onclick="newform();sinkbut(this)"> <%=Toolbox.emsgs(orgnum,34)%>
</td><td><input name="mode"    type="hidden" value="" ><input name="sql"     type="hidden" value=""></td>
<td id="lbl" style="margin:1px 1px 1px 1px"></td><td align="right"><nobr><%=Toolbox.emsgs(orgnum,1396)%></nobr></td><td>
<select style="height:<%=cachedstyle.fontsize+4%>px;margin:0px 0px 0px 0px;border:1px #b0b0b0 outset !important"
name="rdap" align="left" onchange="show()">
<option value=""> <%=  Toolbox.emsgs(orgnum,1271) %></option>
<%
String initrdap = Toolbox.defaultParam(orgnum,request, "initrdap", "", null, 30).replaceAll("'", "");
for (int i=0; i < n; i++)
{
   String x = adapter.getValueAt(i,0);

   out.println("<option value=\"" + x +"\" " + (initrdap.equals(x)?"selected":"") +" >"+ x +"</option>");
}
%>
</select>
</td>

<td id=defbtn class="tdbutton GreenButton"  align="center"  onclick="sinkbut(this);def()"><%=Toolbox.emsgs(orgnum,187)%>
</td><td id=showbtn class="tdbutton GreenButton"   align="center"  onclick="sinkbut(this);show()"><%=Toolbox.emsgs(orgnum,923)%>
    </td><td id=renamebtn class="tdbutton OrangeButton"   align="center"    onclick="ren();sinkbut(this)"> <%=Toolbox.emsgs(orgnum,89)%>
    </td><td id=permitbtn class="tdbutton BlueButton"  align="center"    onclick="permit();sinkbut(this)" >  <%=Toolbox.emsgs(orgnum,1283)%>
    </td><td id=deletebtn class="tdbutton RedButton"   align="center"   onclick="delete1();sinkbut(this)"> <%=Toolbox.emsgs(orgnum,30)%>

</td>
 
</tr>

</table>
</form>

</td></tr>
 
</table>
</center>

<script type="text/javascript" >
var theurl = "<%=Toolbox1.geturl(request)%>";
var thismode = <%=mode%>,userid = '<%=user.id%>',notexist = "<%=Toolbox.emsgs(orgnum,1531)%>",
msg206="<%=Toolbox.emsgs(orgnum,206)%>",msg160="<%= Toolbox.emsgs(orgnum,160)%>",
msg1283="<%=Toolbox.emsgs(orgnum,1283)%>",msg1278="<%=Toolbox.emsgs(orgnum,1278)%>",msg923="<%=Toolbox.emsgs(orgnum,923)%>",
msg1285="<%=Toolbox.emsgs(orgnum,1285)%>",msg1286="<%=Generic.handle(Toolbox.emsgs(orgnum,1286))%>",
hasone=<%=(n>0)%>,uid='<%=user.id%>',subdb='<%=subdb%>',
supportfile = "<%=Toolbox.emsgs(orgnum,1290)%>",
lblupload = "<%=Toolbox.emsgs(orgnum,1291)%>",
capupload = "<%=Toolbox.emsgs(orgnum,647)%>", capsave="<%=Toolbox.emsgs(orgnum,36)%>",
IBGCOLOR = "<%=cachedstyle.IBGCOLOR%>", enterone="<%=Toolbox.emsgs(orgnum,231)%>",
msg1292="<%=Toolbox.emsgs(orgnum,1292)%>",
instr="<%=Toolbox.emsgs(orgnum,958)%>",font_size=<%=cachedstyle.fontsize%>;
resizebut(document.form1,<%=cachedstyle.fontsize%>, <%=(cachedstyle.fontsize>20)?"''":"'0'"%> );
parent.document.body.rows = '<%=85 + cachedstyle.fontsize%>,*';
timeformat = '<%=Toolbox.timeformat%>',
tstmp = <%=tstmp%>;
var buttonhints = ";New:Create new a form;Design:Design the new created or redesign the selected form;URL:Show all URLs of the form;Rename:Rename the form;Permit:Set the permissions of the form;Delete:Delete the form;"
+"Modify:Modify the form, change the wording or fields;Transform:Transform the form to the standard form;";
  
</script>
<script type="text/javascript"  src=hints.js></script>
<script type="text/javascript"  src=webwizard.js></script>
<script type="text/javascript"  src=curve.js></script>

<script type="text/javascript" >
<%
if (Toolbox.defaultParam(orgnum,request, ("stay"), null)!=null)
{
   ;
}
else if (initrdap.equals(""))
{
   out.println("setTimeout(\"if(parent.frames[1]) parent.frames[1].document.location.href='webwizard.jsp?mode=15';else open('webwizard.jsp?mode=15',parent.frames[1].name);\",500)");
   
}
else 
{
   out.println("if(parent.frames[1])parent.frames[1].document.location.href='webwizard.jsp?mode=10&rdap=" + initrdap +"'; else open('webwizard.jsp?mode=10&rdap=" + initrdap +"',parent.frames[1].name);");
}
%>
</script>

<%
}
else if ( mode.equals("2") ||  mode.equals("3") || mode.equals("4"))
{
%>
<table  width=100% cellspacing=0 cellpadding=0>
<tr><td>
<script type="text/javascript" >
 
var langcode = "<%= Toolbox.langs[orgnum>>16]%>"; 
var  thismode = <%=mode%>,tstmp=<%=tstmp%>,theight=150,encoding='<%=Toolbox.encodings[orgnum>>16]%>',iid = '',timeformat = 'MM/DD/YY hh:mm',font_size=17,isRegistered=true;
 
var pubkeys='012n_2_0_count,004h,0050t_20,00400t_40,001s,01n_2_0,01n_2_0,011c,011c,00255t_30';
document.body.topMargin = 0;
<%
String wtitle = "";
int numRows = 0;
if ( mode.equals("3") || mode.equals("4")) // from existing design, from conversion
{
   String rdapfields = "name,title, query, insertQuery, updateQuery, deleteQuery,webService, format, help,   roles, insertroles, updateroles, deleteroles,jscript,preop,postop,permits,options";
   String sql = "SELECT * FROM Task WHERE name='" + rdap + "r'";
   if (mode.equals("4") )
      sql = "SELECT * FROM Task WHERE name='" + rdap + "'";
   int n = adapter.executeQuery(sql);
   if (n!=1)
   {
      mode="2";
   }
   else
   {
   Webform w = new Webform(adapter,0); 
   w.parseQuery();
   wtitle = w.title;

   String [] optionquerys = w.query.split("\n[\r]*\n+");

   for (int ll=0; ll < optionquerys.length; ll++)
             optionquerys[ll] = optionquerys[ll].trim();

   int jjj = 1, numoptionquery = optionquerys.length;

   String keys = "," + adapter.keyFields(rdap) +",";
   
   out.println("var mat=[");
   numRows = w.fields.length;
   String optvalue = "";
   for (int i=0; i < w.fields.length; i++)
   {
      if ((w.ctypes[i].charAt(0)=='r'||w.ctypes[i].charAt(0)=='s')
          && jjj<numoptionquery)
         optvalue = optionquerys[jjj++];
      else
         optvalue = "";

      String labels = w.labels[i].replaceAll("([a-z])([A-Z])", "$1 $2").replaceFirst("^nolabel[0-9]+$", "");
      String helps=  Generic.handle1(extrct(w.help,w.labels[i], orgnum));
      if (i>0 && mode.equals("4") && !helps.equals("")&& helps.length()>2) 
      {
         labels = "";
         for (int k=0; labels.length() < 24/Toolbox.locales[orgnum>>16].charsize && k < helps.length(); k++)
         {
            char c = helps.charAt(k);
            if (c==32 || c>=33 && c<=47 || c>=58 && c<=64 || c>=91 && c<=96 || c>=123 && c<=127)
            { 
               if (!labels.equals("") && labels.charAt(labels.length()-1)!=' ')
                   labels += ' ';
            }
            else labels += c;
         }
      }
      String datacontrol = w.ctypes[i].substring(0,1);
      if (mode.equals("4") && w.quanty[i].charAt(0)=='b') datacontrol = "b";
      out.print("['" + (i+1) + "','" + w.quanty[i] + "',\"" +  labels
      + "\",\"" + helps
      + "\",'" + w.ctypes[i].charAt(0) + "','"
      + dim(w.ctypes[i],1) + "','"
      + dim(w.ctypes[i],2) + "','"
      + ((w.defaultv[i].length() > 0 && w.defaultv[i].charAt(0)=='!')?1:0) + "','"
      + ((keys.indexOf("," + w.quanty[i] +",")>=0)?1:0) + "',\""
      + Generic.handle1(merge(optvalue,w.defaultv[i].replaceFirst("^!","")))
      +"\"],");
   }
   out.print("['" + (w.fields.length+1) + "','','"
      + "',\""
      + "\",'"
      + "','"
      + "','"
      + "','"
      + 0 + "','"
      + 0 + "',\""
      +"\"]");

   out.println("];");
   }
}

if (mode.equals("4") ) // from from conversion
{
   out.println("var newmoditrans = 'trans';\n//parent.frames[0].addone('" + rdap +"');");
}
else if (mode.equals("3"))
{
   out.println("var newmoditrans = 'modify';");
}
else if (mode.equals("2")) // from template
{
   out.println("var newmoditrans = 'new';\n//parent.frames[0].addone('" + rdap +"');");
   wtitle = Toolbox.defaultParam(orgnum,request, ("template"), null);
   wtitle = Toolbox.validate(wtitle, ",", 40);
   numRows = 1;
   if (wtitle!=null && wtitle.equals(""))
   {
      out.print("var mat = [['0','n','" + Toolbox.emsgs(orgnum,231) +"','" + Toolbox.emsgs(orgnum,262) +"','n','5','0','1','1','1']");
      String fields = Toolbox.defaultParam(orgnum,request, ("field"), null);
      fields = Toolbox.validate(fields, null, 40);
      if (fields!=null && !fields.equals(""))
      {
         String[] fieldarr = fields.split("\n");
         numRows += fieldarr.length;
         for (int i=0; i < fieldarr.length; i++)
            out.print(",\n['" + (i+1) + "','t" + (i+1) + "','"
                    + fieldarr[i].replaceAll("\r","") + "','"
                    + fieldarr[i].replaceAll("\r","") 
                    + ( (i%2==0)?"_":"") 
                    + "','t','20','','0','0','']");
      }
      out.println("];");
      
   }
   else
   {
      adapter.close();
      adapter = Toolbox.getSysAdapter(orgnum);
      String sql = null;

      if (wtitle!=null )
      {
          sql = "SELECT fields, topic FROM Formmodel where topic='" + wtitle.replaceAll("'","''") +"'";
      }
      else
      {
          sql = "SELECT fields, topic FROM Formmodel where uid='" + user.id +"'";
      }

      if (0==adapter.executeQuery(sql) || adapter.getValueAt(0,0)==null)
      {
          wtitle = "";
          out.println("var mat = [['0','n','" + Toolbox.emsgs(orgnum,231) +"','" + Toolbox.emsgs(orgnum,262) +"','n','5','0','1','1','1']];");
          out.println("myprompt('Template " + wtitle +" " + Toolbox.emsgs(orgnum,1531) +"');");
      }
      else
      {
          wtitle = adapter.getValueAt(0,1);
          String allfields[] = adapter.getValueAt(0,0).trim().split("\n");
          numRows += allfields.length;
          out.println( "var mat = [['0','n','" + Toolbox.emsgs(orgnum,231) +"','" + Toolbox.emsgs(orgnum,262) +"','n','5','0','1','1','1']");
          for (int i=0; i < allfields.length; i++)
          {
             out.println(",['" + (i+1) + "','',\""  + Generic.handle(allfields[i]).replaceAll("\t", "\",\"") +"\"]");
          }
          out.println( "];");
      }
   }
}

%>
var tablename = '<%=rdap%>';
var alldatatypes = '<%=Toolbox.allDatatypes(adapter.dbms)%>';
var nextpageurl='',positionstr='';
var labels=['<%=Toolbox.emsgs(orgnum,231)%>','Field','<%=Toolbox.emsgs(orgnum,719).replaceFirst(" ","")%>','<%=Toolbox.emsgs(orgnum,41)%>','<%=Toolbox.emsgs(orgnum,21)%>','<%=Toolbox.emsgs(orgnum,42)%>1','<%=Toolbox.emsgs(orgnum,42)%>2','<%=Toolbox.emsgs(orgnum,13)%>','<%=Toolbox.emsgs(orgnum,725)%>','<%=Toolbox.emsgs(orgnum,604)%>'],H='Order,Field,FieldName,Help,Format,Width,Height,MustFill,IsKey,DefaultValue',ZQ = ["webwizard","<%=rdap%>","","","",
   "<%=Generic.handle1(Toolbox.emsgs(orgnum,188))%>\n\n<!---->",
   "<%=user.id%>","0","","","1"],
MS='0,1,0,0,<%=mode.equals("4")?0:1%>,<%=numRows%>,<%=numRows+(mode.equals("4")?0:1)%>,10',options = new Array( 10 ),captions = new Array( 10 ),defaultRecord=["0","","","","","0","",'1','0',''];
var fsnd = null,helpbuttons = '',mm = 0;
options[4]=['n','m','t', 'a','s','r', 'c','b','l', 'i','u','k','h'];
captions[4] = ['<%=Toolbox.emsgs(orgnum,1214)%>','<%=Toolbox.emsgs(orgnum,986)%>','<%=Toolbox.emsgs(orgnum,179)%>',
               '<%=Toolbox.emsgs(orgnum,180)%>','<%=Toolbox.emsgs(orgnum,206)%>','<%=Toolbox.emsgs(orgnum,181)%>',
               '<%=Toolbox.emsgs(orgnum,182)%>','<%=Toolbox.emsgs(orgnum,22)%>','<%=Toolbox.emsgs(orgnum,890)%>',
               '<%=Toolbox.emsgs(orgnum,184)%>','<%=Toolbox.emsgs(orgnum,185)%>','<%=Toolbox.emsgs(orgnum,25)%>',
               '<%=Toolbox.emsgs(orgnum,186)%>'];
var asso = new Array(1);
function makeasso(){}
var helpbuttons = "";
var tt1='';
if (typeof textmsg!='undefined')
   tt1=textmsg[8];
ZQ[5] += '<tr><td colspan=2><font color=purple><b>' + tt1 +'</b></font></td></tr>';
var webserviceAllbuts = "",webserviceAlloptions = "";
var STNEVE=['','','','','','',''];

</script>
<script type="text/javascript"   src=encryption.js></script>
<script type="text/javascript"   src=decrypt.js></script>
<script type="text/javascript"   src=multipleselect.js></script>
<script type="text/javascript"   src=timeformat.js></script>

<script type="text/javascript"   src=commonused.js></script>
<table width=100%   cellpadding=0 cellspacing=0>
<tr><td   ALIGN=center colspan=2><form rel=opener name="form0" style="margin:0px 0px 0px 0px"  ><table  width=100% cellpadding=0 cellspacing=0><tr><td >
<table   cellpadding=3 ><tr><td><%=fields2(Toolbox.emsgs(orgnum,15),cachedstyle.fontsize, orgnum, cachedstyle)%></td><td>
<input size="30" value="<%=wtitle%>" name="title" style="border:1px #b0b0b0 solid"  onkeypress="return gotocell11(event)"></td></tr></table></td>
<% if (!mode.equals("2") ) {%>
<td>&nbsp;</td>
<td  ><input type="checkbox" style="background-color:transparent" <%=(mode.equals("4"))?"checked":""%>  name="intern"  onclick="totrans(this)">
 <%=Toolbox.emsgs(orgnum,504)%></td>
<%}%>
<td>&nbsp</td>
<td  ><input type="checkbox" style="background-color:transparent" <%= (mode.equals("2")||mode.equals("4"))?"checked":""%> onclick="showgui(this)" name="showguide">
 <%=Toolbox.emsgs(orgnum,263)%></td>

</tr></table></form>
</td></tr>
<tr><td ALIGN=center colspan=2>

<form rel=opener name="form1"   >
<script type="text/javascript" >document.write(round1(''));</script>
<table cellpadding=0 width="100%" cellspacing=0 class=outset3 height=23>
<tr><td  width="100%"  >
<table width="100%" cellpadding=1 cellspacing=1 border=0   id="maintable" >
<TR style="background:<%=cachedstyle.BBGCOLOR%>" >
 <td width=25 align="center"><input type=checkbox name=check1 onclick=checkall()  style="background-color:<%=cachedstyle.BBGCOLOR%>"></td>
 <td onMouseOver="showmyhint(0)" onMouseOut="hidemyhint()"><nobr><%=Toolbox.emsgs(orgnum,231)%></nobr></td>
 <td align=left  onMouseOver="showmyhint(2)" onMouseOut="hidemyhint()"><nobr><%=Toolbox.emsgs(orgnum,719)%></nobr></td>
 <td align=left  onMouseOver="showmyhint(3)" onMouseOut="hidemyhint()"><nobr><%=Toolbox.emsgs(orgnum,41)%></nobr></td>
 <td align=left  onMouseOver="showmyhint(4)" onMouseOut="hidemyhint()"><nobr><%=Toolbox.emsgs(orgnum,21)%></nobr></td>
 <td align=right colspan=1  onMouseOver="showmyhint(5)" onMouseOut="hidemyhint()"><nobr><%=Toolbox.emsgs(orgnum,371)%>1</nobr></td>
 <td align=right colspan=1  onMouseOver="showmyhint(6)" onMouseOut="hidemyhint()"><nobr><%=Toolbox.emsgs(orgnum,371)%>2</nobr></td>
 <td align=left  align="center"  onMouseOver="showmyhint(7)" onMouseOut="hidemyhint()"><nobr><%=Toolbox.emsgs(orgnum,13)%></nobr></td>
 <!--td align=left  align="center"  onMouseOver="showmyhint(8)" onMouseOut="hidemyhint()"><nobr><%=Toolbox.emsgs(orgnum,725)%></nobr></td-->
 <td align=left  onMouseOver="showmyhint(9)" onMouseOut="hidemyhint()"><nobr><%=Toolbox.emsgs(orgnum,604)%></nobr></td>

</TR>
<script type="text/javascript" >

hasfoot = false;
var selectedTypeIndex = 0;
for (var Z = 0; Z < NUMROWS; Z++)
{
document.write('<TR bgcolor=<%=cachedstyle.TBGCOLOR%> valign=center><td align=center width=25>'+
'<INPUT type=checkbox NAME=checkbox value='+(Z)+'></td><td align="right">' + Z +
'<INPUT type="hidden" class=right size=2  NAME='+Z+'_0 onfocus=FS('+Z+',0) onblur=U('+Z+',0) >' +
'<INPUT type="hidden" class=right size=2  NAME='+Z+'_1 onfocus=FS('+Z+',1) onblur=U('+Z+',1)></td><td>' +
'<INPUT class=left  size=13 NAME='+Z+'_2 onfocus=FS('+Z+',2)  onblur=UB(this,2,' + Z + ') onkeypress="return allowenter02('+Z+',event)" value="' + mat[Z][2].replace(/"/g,'\\"') + '"></td><td>' +
'<INPUT class=left  size=15 NAME='+Z+'_3 onfocus=FS('+Z+',3)  onblur=UB(this,3) onkeypress="return allowenter02('+Z+',event)"  value="' + mat[Z][3].replace(/"/g,'\\"') + '"></td><td>' +
'<select NAME='+Z+'_4 onfocus="FS('+Z+',4);fillopts(this,'+Z+',4,true)"  onblur="U('+Z+',4)" onchange="V(this,'+Z+')">');
for (var jj=0; jj < options[4].length; jj++)
if (mat[Z][4].toLowerCase()==options[4][jj])
{
   document.write("<option value=\""+ options[4][jj] + "\" selected=true>"+ captions[4][jj] +"</option>");
   break;
}
document.write('</select></td><td width=40  align=right>' +
'<INPUT class=right style="width:30px"  NAME='+Z+'_5 onfocus=FS('+Z+',5)  onblur=U('+Z+',5) onchange="nodel()" value="' + ((mat[Z][5]==null)?"":mat[Z][5]) +'"  onkeypress="return allowenter11('+Z+',event)"></td><td align=center>' +
'<INPUT class=right style="width:30px"  NAME='+Z+'_6 onfocus=FS('+Z+',6)  onblur=U('+Z+',6)  onchange="nodel()" value="' + ((mat[Z][6]==null)?"":mat[Z][6]) +'"   onkeypress="return allowenter11('+Z+',event)"></td><td align=center>' +
'<INPUT type=checkbox    NAME='+Z+'_7 onfocus=FS('+Z+',7) onblur=U('+Z+',7)   onchange="nodel()" ' + ((Z < numRows && mat[Z][7]=='1')?'checked':'') + '>' +
'<input type="hidden"    NAME='+Z+'_8 onfocus=FS('+Z+',8) onblur=U('+Z+',8) value=' + mat[Z][8] +'></td><td>' +
'<input class=left size=15 name=' +Z + '_9 onfocus=FS('+Z+',9)  size=8  value="' + mat[Z][9].replace(/"/g,'\\"') + '"></td></TR>'
 );

}

</script>
</table>
</td></tr>
</table>
<script type="text/javascript" >document.write(round2);</script>
<input type="hidden"   name=total  value=14>

<!--tr>
<td>Check Clause</td>
<td>Option Values</td>
</tr>
<tr>
<td><textarea name="check" cols="30" rows="5"></textarea></td>
<td><textarea name="option" cols="30" rows="5"></textarea></td>
</tr-->
</form>

</td></tr>
<tr><td  ALIGN=left valign="top"><span id="autostr" style="color:#808080;font-size:12px;visibility:visible">* <%=Toolbox.emsgs(orgnum,606)%></span></td><td>
<form rel=opener name=thisform  method=POST  target=savewin  action=webwizard.jsp  >
<input type="hidden"   name=subdb>
<input type="hidden"   name=createtable>
<input type="hidden"   name=rdap value="<%=rdap%>" >
<input type="hidden"   name=entry>
<input type="hidden"   name=query>
<input type="hidden"   name=title value="<%=wtitle%>">
<input type="hidden"   name=insertQuery>
<input type="hidden"   name=updateQuery>
<input type="hidden"   name=deleteQuery>
<input type="hidden"   name=addcolumn>
<input type="hidden"   name=modifycolumn>
<input type="hidden"   name=id>
<input type="hidden"   name=wcds>
<input type="hidden"   name=defaultfv>
<input type="hidden"   name=help>
<input type="hidden"   name=mode >
<input name="bn1" class=GreenButton  style="visibility:hidden"   type=button  ONCLICK=fmove(-1) value="<%=Toolbox.emsgs(orgnum,1053)%>"
 onMouseOver="showbuthint(this,event,10)"   onMouseOut="hidemyhint()"
><input name="bn2"  class=GreenButton    style="visibility:hidden"    type=button ONCLICK=fmove(1) value="<%=Toolbox.emsgs(orgnum,1054)%>"
 onMouseOver="showbuthint(this,event,11)"  onMouseOut="hidemyhint()"
<% if (!mode.equals("4") ) {%>
><input name="btnremove" class=RedButton   style="visibility:hidden"    type=button value="X <%=Toolbox.emsgs(orgnum,943)%>" ONCLICK="removerows()"
onMouseOver="showbuthint(this,event,12)"  onMouseOut="hidemyhint()"
<%}%>
 ><input name="btntest" class=GreenButton   style="visibility:hidden"
 type=button value="<%=Toolbox.emsgs(orgnum,321)%>"  ONCLICK="test()"  onMouseOver="showbuthint(this,event,13)"  onMouseOut="hidemyhint()"
><input name="btnsave" class=OrangeButton   style="visibility:hidden"    type=button value="<%=Toolbox.emsgs(orgnum,36)%>"  ONCLICK="genaccess()"
 onMouseOver="showbuthint(this,event,14)"  onMouseOut="hidemyhint()" >
</form></td></tr>
</table>
<script type="text/javascript" >
   for (var ll=0; ll<5; ll++)
  hints[10+ll] = textmsg[875+ll];
hints[15] = "<%=Toolbox.emsgs(orgnum,1342)%>";
hints[16] = "<%=Toolbox.emsgs(orgnum,1343)%>";
function showbuthint(but,e,j)
{
   if (typeof showmyhint=='function')
       showmyhint(j);
}
var initialtrans = <%= mode.equals("4")%>;
function passactualrows()
{
   var nc = 0;
   for (var i=0; i < NUMROWS && retrv(i,4)!=''; i++);

   return i;
}
</script>
<script type="text/javascript"   src=helpformat.js></script>
<script type="text/javascript"   src=maketabledu.js></script>
<script type="text/javascript"  src=webwdesign.js></script>
<script type="text/javascript"  src=hints.js></script>
<script type="text/javascript" >
<% if ( mode.equals("2")) {%> document.form0.title.focus();setTimeout("guideme(0,-1)",100);<%}else if(mode.equals("4")){%>
setTimeout("guideme2('<%=Toolbox.emsgs(orgnum,507)%>')", 100); <%}%>
</script>
<script type="text/javascript" src=curve.js?sn=30&dn=1></script>
<iframe name="w<%=tstmp%>" width="1" height="1" style="visibility:hidden"/>
<%
}
else if ( mode.equals("5"))
{
   out.println("<script type=text/javascript >var thismode =" + mode +";</script>" + Toolbox.emsgs(orgnum,506));
}
else if (mode.equals("6"))
{
    String newname = Toolbox.defaultParam(orgnum,request, ("newname"), null);
    newname = Toolbox.validate(newname, null, 30);
    String newname1 = Formr.unifilename(user, newname, adapter);
   if (newname1!=null)
   { adapter.close();
    %>
    <jsp:forward page="webwizard.jsp" >
   <jsp:param name="mode"  value="7" />
   <jsp:param name="badrdap"  value="<%=newname%>" />
   <jsp:param name="goodrdap"  value="<%=newname1%>" />
   </jsp:forward>
   <%
    return;
   }
   String title1 = Toolbox.emsgs(orgnum,34) +": " + Toolbox.emsgs(orgnum,1341);
   rdap = newname;
%>
   
   <script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
 
   <table  align=center   class=outset2 style="background:linear-gradient(<%=cachedstyle.IBGCOLOR%>,<%=Toolbox.headercl(cachedstyle.IBGCOLOR)%>);border:1px   outset"   >
   <tr><td><div class=forcurve2 style="color:#DDCC11" id=curve3><nobr><%=title1%></nobr></div>
</td></tr></table></td></tr> </table>


   <form rel=opener name="form1" method="post" style="margin:5px 0px 0px 0px" action="webwizard.jsp" onsubmit="return notrivial()"  >
   
   <table align="center" width="<%=24*cachedstyle.fontsize%>" >
   <tr>
   <td colspan="2">
       <input name="rdap" value="<%=newname%>" type="hidden">
       <input type="hidden" name="mode" value="2" >
   </td></tr>

   <tr>
   <td colspan="2"><%=Toolbox.emsgs(orgnum,1331)%></td>
   </tr>
    
   <tr>
       <td class=forcurve2 style="color:#DDCC11;background:<%="linear-gradient(to right," + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ")"%>" id=curve4> <%= Toolbox.emsgs(orgnum,914)  %> </td>
       <td class=forcurve2 style="color:#DDCC11;background:<%="linear-gradient(to right," + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ")"%>" id=curve5> <%= Toolbox.emsgs(orgnum,943)  %> </td>
   </tr>

   <tr>
   <td   valign="top"> <select name="template"  multiple size="12"   style="width:<%=8*cachedstyle.fontsize%>px;font-size:<%=cachedstyle.fontsize%>px;border:1px #b0b0b0 solid" onchange="javascript:filloutfield(this)"><option value="" selected><%=Toolbox.emsgs(orgnum,1337)%></option></select></td>

   <td   valign="top"> <textarea name="field" rows="12"  style="font-size:<%=cachedstyle.fontsize%>px;width:<%=16*cachedstyle.fontsize%>px;border:1px #b0b0b0 solid"></textarea></td>
   </tr>
   
   <tr><td align="center" colspan="2">
           <table cellpadding="0" cellspacing="2"><tr>
                   <td   class="tdbutton GreenButton" id="sb2" align="center"  onclick="goback()"><nobr><%=Toolbox.emsgs(orgnum,1340)%></nobr></td>
   <td  class="tdbutton OrangeButton"  id="sb" align="center" onclick="next()"><nobr><%=Toolbox.emsgs(orgnum,1046)%></nobr></td>
   <td  class="tdbutton RedButton"  id="sb1" align="center" onclick="cancel()"><nobr> <%=Toolbox.emsgs(orgnum,169)%> </nobr></td>
   </tr></table>
   </td></tr>
 </table>
   
   </form> 
   <script type="text/javascript" >
   var thismode = <%=mode%>;   
    
   var templates = new Array(), fields = new Array(); document.form1.rdap.focus();
<%
   String sql = "SELECT topic, fields  FROM Formmodel where uid is NULL or uid=''";
   if (subdb.equals("")==false)
   {
      adapter.close();
      adapter = Toolbox.getSysAdapter(orgnum);
   }
   int nq = adapter.executeQuery(sql);

   long timenow = System.currentTimeMillis()/1000;
   if (nq <= 0)
   {
      sql = "CREATE TABLE Formmodel(lastupdate BIGINT,topic VARCHAR(100),fields TEXT, uid varchar(20) PRIMARY KEY (topic,uid))";

      adapter.executeUpdate("INSERT INTO Apptables (lastupdate,tname,definition,roles) VALUES(" + timenow
      +",'Formmodel','" + sql.replaceAll("'", "''") +"',-1)");
      int sindex = Toolbox.begintranslate("mysql");
      int tindex = Toolbox.begintranslate(adapter.dbms);
      nq = adapter.executeUpdate(Toolbox.translateStr(sql,sindex,tindex));

      nq = 0;
   }
   for (int i=0; i < nq; i++)
   {
       //out.println("<option value=\"" +adapter.getValueAt(i,0) +"\">" + adapter.getValueAt(i,0) +"</option>");
       String [] tt = adapter.getValueAt(i,1).split("\n");
       String fds = "";
       for (int jj=0; jj < tt.length; jj++)
          fds += tt[jj].replaceFirst("\t.*","\n");
       out.println("templates[" + i +"]=\"" + Generic.handle(adapter.getValueAt(i,0)) +"\";");
       out.println("fields[" + i +"]=\"" + Generic.handle(fds)+"\";");
   }
   %>
   var holdfield = "";
   for (var jj=0; jj < templates.length; jj++)
   document.form1.template.options[jj+1]= new Option(templates[jj], templates[jj]);
   function  filloutfield(sel)
   {

       if (document.form1.template.selectedIndex > 0)
       {
          holdfield = document.form1.field.value;
          document.form1.field.value = fields[document.form1.template.selectedIndex-1];
          document.form1.field.disabled = true;
       }
       else
       {
          document.form1.field.value = holdfield;
          document.form1.field.disabled = false;
       }
   }
   function notrivial()
   {
      if (document.form1.rdap.value == '')
      {
         myprompt("<%=Toolbox.emsgs(orgnum,662)%>");
         return false;
      }
      if (document.form1.field.value=='<%=Toolbox.emsgs(orgnum,1338)%>')
          document.form1.field.value='';
      parent.frames[0].document.location.href="webwizard.jsp?mode=9&rdap=<%=rdap%>&fromm=2";
      return true;
   }
   function goback()
   {
      document.location.href="webwizard.jsp?mode=7&goodrdap=<%=rdap%>&redo=1";
   }
   function cancel()
   {
       document.location.href="webwizard.jsp?mode=18&rdap=<%=rdap%>";
   }
   function next()
   {
      formnewaction(document.form1);
      if (notrivial())
      {
         visual(document.form1);
         document.form1.submit();
      }
   }
   parent.frames[0].document.location.href="webwizard.jsp?mode=19&rdap=<%=newname%>";

   document.form1.field.focus();
   
   </script>
   <script type="text/javascript"  src="curve.js"></script>
   <%

}
else if (mode.equals("7")  )
{
   String redo = Toolbox.defaultParam(orgnum,request, ("redo"), null);
   String goodrdap = Toolbox.defaultParam(orgnum,request,"goodrdap", "", null, 30);
   rdap = Toolbox.defaultParam(orgnum,request, ("rdap"), null);
   if (redo!= null)
   {
       String sqll = "DELETE FROM  Formmodel WHERE uid='" + user.id +"'";
       int j = adapter.executeUpdate( sqll);
       sqll = "DELETE FROM userform WHERE uid='" + user.id +"' AND lastupdate=-1 AND formname='" + goodrdap +"'";
       j = adapter.executeUpdate( sqll);
       rdap = "";
   }
   
   rdap = Toolbox.validate(rdap, null, 30);
   int fcode = 8;
   String title1 = Toolbox.emsgs(orgnum,89) +": ";
   if (rdap == null || rdap.equals(""))
   {
      title1 = "";
      fcode = 6;
      rdap = "";
   }
   title1 +=   Toolbox.emsgs(orgnum,899);
   
   
   String badrdap = Toolbox.defaultParam(orgnum,request, ("badrdap"), null);
   badrdap =  Toolbox.validate(badrdap, null, 30);
   TreeSet tree = Formr.nameTree(user,adapter);
   Iterator iter = tree.iterator();
   out.print("<script type=text/javascript >var thismode = " + mode +"; allrdaps = [");
   while (iter.hasNext())
   {
      out.print("'" + iter.next() +"',");
   }
   out.println("''];</script>"); 
%>
<table cellpadding="0" cellspacing="0"    align="center">
<tr><td  align=center   class=outset2 style="background:linear-gradient(<%=cachedstyle.IBGCOLOR%>,<%=Toolbox.headercl(cachedstyle.IBGCOLOR)%>);border:1px   outset"   >
<table><tr><td><div class=forcurve2 style="color:#DDCC11" id=curve3><nobr><%=title1%></nobr></div>
</td></tr></table></td></tr>
   </table>
   <br>
  <script type="text/javascript" >document.write(round1(''));</script>
   <table align="center" class="outset3"><tr>
   <td colspan="9" align="left">
   <% if (badrdap != null ) {%><font color="red>"><%=badrdap%> <script type="text/javascript" >document.write(textmsg[98]);</script></font><br> <%}%>

   <%=Toolbox.emsgs(orgnum,886)%>
   <br></td> </tr>
   <tr>
   <%

   for (int i=0; i < 26; i++)
   {
      if (i%3 == 0)
         out.println("<td width=60px valign=top>");

      int jj=0; int kk=0;
      while (kk < 2)
      {
         String tt = "" + ((char)('A' + i)) + (jj++);
         if (!tree.contains(tt))
         {
            kk++;
            out.print("<span  onclick=\"getthis(this)\">" + tt +"</span><br>");

         }
      }
      if (i%3==2)
         out.println("</td>");
      else out.println("<br>");
   }

   %></tr>
   </table>
   <script type="text/javascript" >document.write(round2);</script>

<center>
   <form rel=opener style="margin:20px 0px 0px 0px" name="form1"   method="post" action="webwizard.jsp" onsubmit="return surenew()"  >
      <input name="mode" value="<%=fcode%>" type="hidden">
      <input name="rdap" value="<%=rdap%>"  type="hidden">
      <table cellspacing="2" cellpadding="0">

         <tr>
            <td> <%= fields2(Toolbox.emsgs(orgnum,662), cachedstyle.fontsize, orgnum, cachedstyle)%> </td>
            <td> <input name="newname" style="border:1px #b0b0b0 solid" size="10" value="<%=goodrdap%>">  </td>
            <td  class="tdbutton OrangeButton" id="sb" align="center" onclick="if (surenew())document.form1.submit()" > <%=Toolbox.emsgs(orgnum,1046)%> </td>
            <td  class="tdbutton RedButton" id="cb" align="center" onclick="cancel()">  <%=Toolbox.emsgs(orgnum,169)%>
            </td>

      </tr></table>
      <input type="hidden" name="securitytoken" value="<%=securitytoken %>" >
</form></center>

<script type="text/javascript" >
   resizebut(document.form1,<%=cachedstyle.fontsize%>, <%=(cachedstyle.fontsize>20)?"''":"'0'"%> );
   function getthis(td)
{
   document.form1.newname.value=td.innerHTML;
}
   function surenew()
   {

      var anewname = document.form1.newname.value;
      anewname = anewname.replace(/^\s*/,'').replace(/\s*$/,'');
      anewname = anewname.toUpperCase();
      document.form1.newname.value = anewname;

      if (anewname=='')
      {
         myprompt('<%=Toolbox.emsgs(orgnum,662)%>');
         return false;
      }
      if (anewname.length > 10)
      {
         myprompt('The length is too long. Use less than 10');
         return false;
      }

      if (anewname.charAt(0)>'Z' || anewname.charAt(0)<'A' || anewname.replace(/[A-Z|0-9]/g,'')!='')
      {
          myprompt( " <%=Toolbox.emsgs(orgnum,886)%>");
          return false;
      }

      for (var i=0; i < allrdaps.length; i++)
      if (allrdaps[i]==anewname)
      {
            myprompt(anewname + " <%=Toolbox.emsgs(orgnum,446)%>");
            return false;
      }
      return true;
   }
   <%
   if (fcode==6){
   %>
      parent.frames[0].document.location.href="webwizard.jsp?mode=19";
   <%}%>
   function next()
   {
      if (surenew())
      { 
          visual(document.form1);
          document.form1.submit();
      }

   }
   function cancel()
   {
      parent.parent.frames[0].openpage("webwizard.jsp?mode=1","");
   }
</script>
<script type="text/javascript"  src="curve.js"></script>
</body>
<%
}


else if ( mode.equals("8"))
{
   if (rdap==null)
   {
       adapter.close();
       return;
   }
   String newname = Toolbox.defaultParam(orgnum,request, ("newname"), null);
   newname = Toolbox.validate(newname, null, 30);
   if (newname==null || newname.equals("") || uniquename(newname,adapter)==false)
    {
    %>
    <br><br><table align=center>
    <%
      if (newname!=null && !newname.equals(""))
      {
            out.println("<tr><td>" + newname + " " + Toolbox.emsgs(orgnum,446) +".</td></tr>");
            int i=1;
            try{ i = Integer.parseInt(rdap.replaceFirst(".*([0-9]+)$","$1"));}
            catch(Exception e){}
            while(true)
            {newname = newname.replaceFirst("[0-9]+$","");
            newname = newname + (i++);
            if (uniquename(newname,adapter)) break;
            }
      }
      else newname = rdap+"1";
%>
   <tr><td>
   <form rel=opener name="form1" method="post" action="webwizard.jsp"  >
   <input type="hidden" name="mode" value="8">
   <input type="hidden"  name="rdap" value="<%=rdap%>" >
   <%=Toolbox.emsgs(orgnum,662)%> <input name="newname" style="border:1px #b0b0b0 solid"  value="<%=newname%>" onblur="toolong(this)">
   <input type="submit" class="OrangeButton"  <%=style.replaceFirst("GreenButton","OrangeButton")%> name="sb" value="<%=Toolbox.emsgs(orgnum,1046)%>" >
   </form>
   </td></tr></table>
   <script type="text/javascript" >
       function toolong(t)
       {
           var str = t.value.replace(/ /g, '');
           if (str.length > 10){myprompt('The name is too long'); t.focus(); return;}
           if (str.charAt(0).replace(/[a-z]/i,'')!=''){myprompt('The first letter has to be an English alphabet'); t.focus(); return;}
           if (str.replace(/[a-z]/ig,'').replace(/[0-1]/g,'') != ''){myprompt('All letters have to be either English letter or digits'); t.focus(); return;}
       }
   </script>
<%
   }else
   {

      int sindex = Toolbox.begintranslate("mysql");
      int tindex = Toolbox.begintranslate(adapter.dbms);
   String sql[] = new String[6];
   sql[3] = "ALTER TABLE " + rdap + " RENAME TO " + newname;
   char [] wh = {'r','s','i'};
   for (int j=0; j < 3; j++)
   {
   String retrv = "SELECT title, query,insertQuery,updateQuery,deleteQuery FROM Task WHERE name='" +rdap  + wh[j] + "'";
   int m = adapter.executeQuery(retrv);
   if (m==1)
   {
   String newv[] = new String[5];
   newv[0]=adapter.getValueAt(0,0).replaceFirst( rdap,  newname).replaceAll("'","''");
   newv[1]=adapter.getValueAt(0,1).replaceFirst(" FROM " +  rdap + " ", " FROM " + newname + " ").replaceAll("'","''");
   newv[2]=adapter.getValueAt(0,2).replaceFirst("([ |=])" + rdap, "$1" + newname).replaceFirst(" FROM " +  rdap + "$", " FROM " + newname  ).replaceAll("'","''");
   newv[3]=adapter.getValueAt(0,3).replaceFirst("([ |=])" + rdap, "$1" + newname).replaceFirst(" FROM " +  rdap + "$", " FROM " + newname  ).replaceAll("'","''");
   newv[4]=adapter.getValueAt(0,4).replaceFirst("([ |=])" + rdap, "$1" + newname).replaceAll("'","''");
   sql[j] = "UPDATE Task SET name='" + newname+ wh[j]
   + "', title='" + newv[0]
   + "', query='" + newv[1]
   + "', insertQuery='" + newv[2]
   + "', updateQuery='" + newv[3]
   + "', deleteQuery='" + newv[4]
   + "' where name='" + rdap+ wh[j] +"'";
   } 
   else sql[j] = "UPDATE Task SET name='" + newname + wh[j]+ "' where name='" + rdap + wh[j] +"'";

   }

   String retrv = "SELECT definition FROM Apptables where tname='" +rdap +"'";
   int m = adapter.executeQuery(retrv);
   if (m==1)
   sql[4] = "UPDATE Apptables SET tname='" + newname + "', definition='"
           + adapter.getValueAt(0,0).replaceFirst(" " + rdap, " " + newname).replaceAll("'","''") +"'  where tname='" + rdap +"'";
   else
   sql[4] = "UPDATE Apptables SET tname='" + newname + "'  where tname='" + rdap +"'";

   sql[5] = "UPDATE userform  SET lastupdate=" + (System.currentTimeMillis()/1000) +", formname='" + newname + "' where formname='" + rdap +"'";
   
   try{
   boolean b  = adapter.transacte(sql,0,6);
   }catch(Exception e){}
   renameTask(rdap, newname, uid1, user, orgnum);
   Formr.updateassociate(newname, rdap, user);
   if (subdb.equals(""))
   {
      for (int j=0; j < 3; j++){
      Generic.storedProc.remove(rdap+ wh[j]);
      Generic.genStoredProc(newname+ wh[j], adapter, orgnum);}
   }
   if (adapter.error().equals("")==false)
   {
      for (int i=0; i < 3; i++)
         out.println(sql[i] + " <br><br>");
      out.println(adapter.error());
      //(new File(Toolbox.installpath + File.separator + "forms" + File.separator + s[1] +".htm")).delete();
   }
   
   %>
     <center>
     <%=Toolbox.emsgs(orgnum,71)%>
     </center>
     <script type="text/javascript" >
         var thismode = <%=mode%>;
         
         parent.frames[0].rename('<%=rdap%>','<%=newname%>');
         parent.parent.frames[0].location.reaload();//setTimeout('close()',2000);
</script>
   <%

   }
}
else if (mode.equals("9"))
{
String fromm = Toolbox.defaultParam(orgnum,request, ("fromm"), null);
fromm = Toolbox.validate(fromm, null, 30);
%>
<center>
<%=Toolbox.title(Toolbox.emsgs(orgnum,359) )%>


<form rel=opener name="form1" style="margin:5px 0px 5px 0px" method="post" action="webwizard.jsp"  >

<table BORDER=0   cellspacing=1 cellpadding="0" align="center" > <!-- class=outset1 -->
<tr>
<td><input type="hidden" name="mode"  value=""><%=fields2(Toolbox.emsgs(orgnum,1271), cachedstyle.fontsize, orgnum, cachedstyle)%></td>
<td><input type="hidden" name="fieldstr"  value="">
   <input type="hidden" name="title"  value="">
   <input type="hidden" name="fromm"  value="<%=fromm%>">
   <input  name="rdap" type="text" style="margin:0px 0px 0px 0px;border:1px #b0b0b0 outset !important;width:70px"  readonly="true"  value="<%=rdap%>" >
</td>

<td id="bn1" class="tdbutton GreenButton"   align="center" width="<%=4*cachedstyle.fontsize%>"  ONCLICK="parent.frames[1].fmove(-1);sinkbut(this)">
<%=Toolbox.emsgs(orgnum,1053)%> </td>

<td id="bn2" class="tdbutton GreenButton"   align="center" width="<%=4*cachedstyle.fontsize%>"  ONCLICK="parent.frames[1].fmove(1)" >
<%=Toolbox.emsgs(orgnum,1054)%> </td>

<% if ( !fromm.equals("4") && !fromm.equals("0")) {%>
<td id="btnremove"  class="tdbutton RedButton"   align="center" width="<%=4*cachedstyle.fontsize%>"   ONCLICK="parent.frames[1].removerows();sinkbut(this)"  >
<%=Toolbox.emsgs(orgnum,30)%> </td>
<%}%>

<td id="btntest"  class="tdbutton GreenButton"   align="center" width="<%=4*cachedstyle.fontsize%>"   ONCLICK="parent.frames[1].test()"  >
<%=Toolbox.emsgs(orgnum,321)%>
</td>

<% if ( !fromm.equals("3")) {%>
<td id="btnsave" class="tdbutton GreenButton"   align="center" width="<%=4*cachedstyle.fontsize%>"   ONCLICK="savetemp();sinkbut(this)" >
<%=Toolbox.emsgs(orgnum,36)%> </td><%}%>

<td id="btngen" class="tdbutton OrangeButton"     align="center" width="<%=4*cachedstyle.fontsize%>"    ONCLICK="parent.frames[1].genaccess();sinkbut(this)" >
<%=Toolbox.emsgs(orgnum,727)%></td>

<td id=deletebtn1 class="tdbutton RedButton"     align="center" width="<%=4*cachedstyle.fontsize%>"   onclick="delete2();sinkbut(this)"  >
<%=Toolbox.emsgs(orgnum,169)%> </td>

</tr>
</table>
</form>  
</center>
<script type="text/javascript" >
function gethint(obj, evt, j)
{
   if ( typeof(parent.frames[1].showbuthint) != 'undefined')
   parent.frames[1].showbuthint(obj, evt, j);
}
var thismode = <%=mode%>,userid = '<%=user.id%>',notexist = "<%=Toolbox.emsgs(orgnum,1531)%>",
msg206="<%=Toolbox.emsgs(orgnum,206)%>",msg160="<%= Toolbox.emsgs(orgnum,160)%>",
msg1283="<%=Toolbox.emsgs(orgnum,1283)%>",msg1278="<%=Toolbox.emsgs(orgnum,1278)%>",msg923="<%=Toolbox.emsgs(orgnum,923)%>",
msg1285="<%=Toolbox.emsgs(orgnum,1285)%>",msg1286="<%=Generic.handle(Toolbox.emsgs(orgnum,1286))%>",
hasone=true,uid='<%=user.id%>',subdb='<%=subdb%>',
supportfile = "<%=Toolbox.emsgs(orgnum,1290)%>",
lblupload = "<%=Toolbox.emsgs(orgnum,1291)%>",
capupload = "<%=Toolbox.emsgs(orgnum,647)%>", capsave="<%=Toolbox.emsgs(orgnum,36)%>",
IBGCOLOR = "<%=cachedstyle.IBGCOLOR%>", enterone="<%=Toolbox.emsgs(orgnum,231)%>",
msg1292="<%=Toolbox.emsgs(orgnum,1292)%>",
instr="<%=Toolbox.emsgs(orgnum,958)%>",
fromm = '<%=fromm%>',
timeformat = '<%=Toolbox.timeformat%>',
font_size = <%=cachedstyle.fontsize%>;

 
function delete2()
{
   if (selectone() == false)
      return;
   <% if (fromm.equals("2")) {%>
   myprompt(msg1278  + "?", null, "if(v)godelete2()");
   setRoundedHeight(  promptwin, 80);
   <%} else if (fromm.equals("0")) {%>
   parent.frames[1].onbeforeunload = null;
   parent.frames[0].document.location.href="wordform.jsp?mode=1&initrdap=<%=rdap%>";
   <%} else {%>
   //document.location.href="webwizard.jsp?mode=1&initrdap=<%=rdap%>";
   parent.frames[1].onbeforeunload = null;
   parent.parent.frames[0].openpage("webwizard.jsp?mode=1","");
   <%}%>
}

function godelete2()
{
   document.location.href="webwizard.jsp?mode=18&rdap=<%=rdap%>";
}
var buttonhints = ";Moveup:Move the selelcted rows up;Mvdown:Move the selected rows down;Delete:Delete the selected rows;Test:Test the design that has been done so far;Save:Save the design that has been done so far;Commit:Carry out the design, create tables and data access routines;"
+"Cancel:Undo the changes that have been done since last time starting this page;";
</script>
<script type="text/javascript"  src=hints.js></script>
<script type="text/javascript"  src=webwizard.js></script>
<script type="text/javascript"   src=curve.js></script>

<%
if (fromm.equals("0")) out.println("<script type=text/javascript >open(\"webwizard.jsp?mode=4&rdap=" + rdap + "\", parent.frames[1].name);</script>");
}
else if ( mode.equals("10"))
{
    %>
 <table cellpadding="0" cellspacing="0"  valign=top  align="center">
    <tr><td  align=center width=100% class=outset2 style="background:linear-gradient(<%=cachedstyle.IBGCOLOR%>,<%=Toolbox.headercl(cachedstyle.IBGCOLOR)%>);border:1px   outset"   >
            <table><tr><td><div class=forcurve2 style="color:#DDCC11" id=curve3><nobr><%=Toolbox.emsgs(orgnum,1383)%></nobr></div>
                    </td></tr>
            </table></td>
    </tr>
</table>   
    
    <%
   if (uniquename(rdap, adapter))
      out.println(rdap + " " + Toolbox.emsgs(orgnum,1531));
   else {
   %>
   
   <form rel=opener name="f" action="wordform.jsp" method="post" target="tt"   >
         <input name="mode" value="11" type="hidden">
         <input name="rdap" value="<%=rdap%>" type="hidden">
         <input name="uid" value="<%=uid1%>" type="hidden">
         <input name="roles" value="-1" type="hidden">
         <input name="extra" value="" type="hidden">
         <input name="df" value="1" type="hidden">
   <table align="center" cellspacing="5" cellpadding="5" width=100% >
   <tr>
      <td width=100% >
         <table cellpadding=0 cellspacing=0 class=outset1 width=100% >
            <tr>
               <td width=100% >
                  <table cellpadding=1 cellspacing=1 border=0 width=100% id="tb0" >
                     <script type="text/javascript" >
                         document.write(parent.frames[0].url());
                     </script>
                  </table>
               </td>
            </tr>
         </table>
      </td>
   </tr>
   <tr>
      <td width="100%" >
         <table cellpadding=0 width=100% cellspacing=0 class=outset1 align="center" >
            <tr>
               <td align="center" >
                  <b>
                     <nobr>
                        <%=Toolbox.emsgs(orgnum,195)%>
                     </nobr>
                  </b>
               </td>
            </tr>
            <tr>
               <td width=100% >
                  <table cellpadding=1 cellspacing=1 border=0 width=100% id="urllink">
                     <tr>
                        <td class=fieldhead>
                           <%=(Toolbox.emsgs(orgnum,15))%>
                        </td>
                        <td class=fieldhead>
                           <%=Toolbox.emsgs(orgnum,923)%>
                        </td>
                        <td class=fieldhead>
                        </td>
                     </tr>
                  </table>
               </td>
            </tr>
         </table>
      </td>
   </tr>
   <tr>
      <td align="center">
         <table cellpadding=0 cellspacing=0 class=outset1 align="center"   >
            <tr>
               <td align="center" >
                  <b>
                     <nobr>
                        <%= Toolbox.emsgs(orgnum,1288)%>
                     </nobr>
                  </b>
               </td>
            </tr>
            <tr>
               <td width=100% >
                  <table cellpadding=1 cellspacing=1 border=0 width=100% align="center"  id="tb1" >
                     <tr>
                        <td class=fieldhead>
                           <%=Toolbox.emsgs(orgnum,816)%>
                        </td>
                        <td class=fieldhead>
                           <%=(Toolbox.emsgs(orgnum,15))%>
                        </td>
                     </tr>
                     <tr>
                        <td class=fieldlbl style=background-color:white >
                           <select name="cat" onchange="addone()" >
                              <option value="">
                                 <%=Toolbox.emsgs(orgnum,206)%>
                              </option>
                           </select>
                        </td>
                        <td class=fieldlbl style=background-color:white >
                           <input style="border:0px #b0b0b0 solid"  name="title" size="45" value="">
                        </td>
                     </tr>
                  </table>
               </td>
            </tr>
         </table>
      </td>
   </tr>
   <tr>
      <td align="center">
         <center>
            <input type=button name=savebtn class="OrangeButton" <%=style.replaceFirst("GreenButton", "OrangeButton")%>
             value="<%=Toolbox.emsgs(orgnum,36)%>" onclick="savecat(1)" >
         </center>
      </td>
   </tr>
</table>
</form>
<script type="text/javascript" >
var thismode = <%=mode%>, msg816="<%=Generic.handle(Toolbox.emsgs(orgnum,816))%>",msg34="<%=Toolbox.emsgs(orgnum,34)%>",msg206="<%=Toolbox.emsgs(orgnum,206)%>",msg231="<%=Toolbox.emsgs(orgnum,231)%>",
msg1289="<%=Generic.handle(Toolbox.emsgs(orgnum,1289))%>",msg1282="<%=Generic.handle(Toolbox.emsgs(orgnum,1282))%>";
var tb0 = document.getElementById("tb0");
var tb1 = document.getElementById("tb1");
var tb2 = document.getElementById("urllink");
var font_size = <%=cachedstyle.fontsize%>;

var tstmp = <%=tstmp%>;
tb2.width = tb0.offsetWidth;
tb1.width = tb0.offsetWidth;

function forcereload(jsid)
{
   document.getElementById(jsid).src = jsid;

}
</script>
<script type="text/javascript"  id="formlist<%=orgnum%>.js" src="formlist<%=(orgnum%65536)%>.js" ></script>
<script type="text/javascript"  id="formassociated<%=orgnum%>.js" src="formassociated<%=(orgnum%65536)%>.js" ></script>
<script type="text/javascript"  src="wordformurl.js" ></script>

<iframe name="w<%=tstmp%>" width="1" height="1" style="visibility:hidden"/>
<%
}
}
else if ( mode.equals("11"))
{
   
   String cat = Toolbox.defaultParam(orgnum,request, ("cat"), null);
   cat = Toolbox.validate(cat, null, 30);
   String title = Toolbox.defaultParam(orgnum,request, "title","");
   String uid = Toolbox.defaultParam(orgnum,request, "uid","", null, 30);
   String rolest = Toolbox.defaultParam(orgnum,request, "roles","-1", null, 20);
   long roles = -1;
   try{ roles = Long.parseLong(rolest);}catch(Exception e){}
   String ans = Formr.modifyFile(rdap, title, cat, uid, roles,user, 1);;
   if (ans.equals("")|| ans.indexOf(Toolbox.emsgs(orgnum,71))>=0)
   {
      if (subdb.equals(""))
         Generic.genStoredProc(rdap, adapter, orgnum);
      out.println(Toolbox.emsgs(orgnum,71));
%>
<script type="text/javascript" >
      if (typeof (opener.forcetoreload)!='undefined') opener.forcetoreload('formlist<%=(orgnum%65536)%>.js');
      if (typeof (opener.forcetoreload)!='undefined') opener.forcetoreload('formassociated<%=orgnum%>.js');
      parent.parent.parent.frames[0].document.location.reload();
      setTimeout( close ,2000);
</script>
<%
   }
   else
   {
        out.println(ans);
   }
}
else if (mode.equals("12"))
{
  out.println(modifyinstr);
  %><script type="text/javascript" >parent.parent.frames[0].location.reload();setTimeout('close()',2000);</script>
  <%
}
else if ( mode.equals("13"))
{
    if (request.getMethod().equals("GET")) 
{
    adapter.close();
    return;
} 
    
    long timenow = (System.currentTimeMillis()/1000);
    String createtable = Toolbox.defaultParam(orgnum,request, "createtable", "");
    if (!createtable.equals("")) createtable =    "CREATE TABLE "+ rdap + "(lastupdate " + createtable;
   
    String wcds = "WHERE " + Toolbox.defaultParam(orgnum,request, "wcds", "").replaceAll("'", "''");
    String entry =  "SELECT " + Toolbox.defaultParam(orgnum,request, "entry", "").replaceAll("'", "''");
    String help = Toolbox.defaultParam(orgnum,request, "help", "").replaceAll("'", "''");
    String title = Toolbox.defaultParam(orgnum,request, "title", "").replaceAll("'", "''");
    String query = "SELECT " + Toolbox.defaultParam(orgnum,request, "query", "").replaceAll("'", "''");
    String insertQuery = "INSERT INTO " + rdap + "(" + Toolbox.defaultParam(orgnum,request, "insertQuery", "").replaceAll("'", "''");
    String updateQuery = "UPDATE " + rdap + " SET " + Toolbox.defaultParam(orgnum,request, "updateQuery", "").replaceAll("'", "''");
    String deleteQuery = Toolbox.defaultParam(orgnum,request, "deleteQuery", "").replaceAll("'", "''");
    String addcolumn  =  Toolbox.defaultParam(orgnum,request, "addcolumn", "").replaceAll(",$", "");
    String modifycolumn  =  Toolbox.defaultParam(orgnum,request, "modifycolumn", "").replaceAll(",$", "");
     String delsqls[] = new String[10];
    int n = 0;
    StringBuffer msg = new StringBuffer("<ul>");

    if (!addcolumn.equals(""))
    {
        if (addcolumn.equals("-"))
        {
           String addcolumns[] = ("ALTER TABLE " + rdap +" DROP COLUMN " + modifycolumn.replaceAll(",", ",ALTER TABLE " + rdap +" DROP COLUMN ")).split(",");
           
           n = -1;
           try{
           n = adapter.transacte(addcolumns, 0, addcolumns.length)?0:-1;
           }catch(Exception e){}
           if (n!=-1) msg.append("<li>" +Toolbox.emsgs(orgnum,605) + " <b>" + rdap + "</b> " + Toolbox.emsgs(orgnum,1076));
           else
           {
               adapter.close();
               out.println("<script type=text/javascript >parent.myprompt('" + adapter.error().replaceAll("'", "\\'") +"');</script></body></html>");
               return;
           }
        }
        else
        {
           String addcolumns[] = ("ALTER TABLE " + rdap +" ADD COLUMN " + addcolumn.replaceAll(",", ",ALTER TABLE " + rdap +" ADD COLUMN ")).split(",");
           n = -1;
           try{
           n = adapter.transacte(addcolumns, 0, addcolumns.length)?0:-1;
           }catch(Exception e){}
           if (n!=-1) msg.append("<li>" +Toolbox.emsgs(orgnum,605) + " <b>" + rdap + "</b> " + Toolbox.emsgs(orgnum,1076));
           else
           {
               adapter.close();
               out.println("<script type=text/javascript >parent.myprompt('" + adapter.error().replaceAll("'", "\\'") +"');</script></body></html>");
               return;
           }
        }
    }
    if (!modifycolumn.equals("")&& !addcolumn.equals("-"))
    {
        String defaultfv = (request.getMethod().equals("POST"))?"": Toolbox.defaultParam(orgnum,request, "defaultfv", "");
         
        
        boolean b1 = Toolbox.dbadmin[orgnum%65536].toNumeric(adapter, rdap, modifycolumn, defaultfv);
        int m = 0;
        if (b1 == false)
        {
            adapter.close();
            out.println("<script type=text/javascript >parent.myprompt('Modification failed, possibly because the  text data in some fields can not  be converted to numeric. " + adapter.error().replaceAll("'", "\\'") +"');</script></body></html>");
            return;
        }
        else
        {
            out.println("<li>" +Toolbox.emsgs(orgnum,605) + " <b>" + rdap + "</b> " + Toolbox.emsgs(orgnum,1076));
        }

    }
    boolean  notrealcreate = false;
    if ( addcolumn.equals("") &&  modifycolumn.equals(""))
    {

       n = adapter.executeUpdate(createtable);
       
       if (n==-1)
       {
          String xy = adapter.error();
          if(xy.indexOf("already exists")>=0)
             msg.append("<li>Table " + rdap +" exists already" );
          else
             msg.append("<li>" + xy );
       }
       else
          msg.append("<li>" +Toolbox.emsgs(orgnum,605) + " <b>" + rdap + "</b> " + Toolbox.emsgs(orgnum,954));
    }
    String sql = "INSERT INTO Apptables (lastupdate,tname,definition,roles) VALUES(" + timenow
    +",'" + rdap +"','" + createtable.replaceAll("'", "''") +"',-1)";
    n = adapter.executeUpdate(sql);
    if (n==-1)
    {
       sql = "UPDATE Apptables SET lastupdate=" + timenow +", definition='" +
             createtable.replaceAll("'", "''") + "' WHERE tname='" + rdap +"'";
       n = adapter.executeUpdate(sql);
    }

    if (n==1)
       msg.append("<li>" +Toolbox.emsgs(orgnum,605) + " <b>" + rdap + "</b> " +Toolbox.emsgs(orgnum,703) + " " +  Toolbox.emsgs(orgnum,1076));
    else
       msg.append("<li>" +adapter.error());
    sql = "INSERT INTO userform(lastupdate,formname,uid,roles,permits) VALUES(" + timenow
    +",'" + rdap +"','" + user.id +"',-1,'')";
    n = adapter.executeUpdate(sql);
    if (n<=0)
    {
       sql = "UPDATE userform SET lastupdate=" + timenow + " WHERE  formname='"
               + rdap +"' AND lastupdate=-1";
       n = adapter.executeUpdate(sql);
    }

    boolean candonate = false;
    String rdapfields = "name,title, query, insertQuery, updateQuery, deleteQuery,webService, format, help,   roles, insertroles, updateroles, deleteroles,jscript,preop,postop,permits,options";
    String newtask = "INSERT INTO Task (lastupdate," + rdapfields + ") VALUES ("  + timenow +",'"
    + rdap +"r','"  + title +"','" + query
    + "','" + insertQuery + "','" + updateQuery + "','"
    + deleteQuery + "','<a href=\"javascript:document.location.href=document.location.toString().replace(/Form\\?rdap=([^&]+)&/,''DataTable?rdap=$1r&'')\">" + Toolbox.emsgs(orgnum,22) +"</a>&nbsp;','Form','" + help +"',0,-1,0,0,'','','','1+" + user.id +",3+" + user.id +",4+" + user.id +"','')";
    String oldtask = "UPDATE Task SET lastupdate=" + timenow + ", query='"
    + query  +"', title='" + title +"', updateQuery='" + updateQuery
    + "',insertQuery='" + insertQuery +"', deleteQuery='"
    + deleteQuery +"', help='" + help + "' WHERE name='" + rdap +"r'";
    if ( (n = adapter.executeUpdate(newtask)) < 1)
       n = adapter.executeUpdate(oldtask);
    else
    {
       candonate = true;
    }
    if (n==1)
       msg.append("<li>" +Toolbox.emsgs(orgnum,167) + " <b>" + rdap + "r</b> " + " " +  Toolbox.emsgs(orgnum,1076));
    else
       msg.append("<li><font color=red>" +adapter.error()  +"</font>" + newtask);
   
    if (n == 1)
    {
       int kk = wcds.indexOf("\r\n\r\n\r\n");
      
    if (title == null || title.replaceAll(" ","").equals("")) title = rdap;
    if (title.length() > 255)
        title = title.substring(0,255);
    String whereclause = wcds.substring(0,kk);
    String defaults = wcds.substring(kk+4);
    newtask = "INSERT INTO Task (lastupdate," + rdapfields + ") VALUES ("  + timenow +",'"
    + rdap +"s','"  + title +"','" + whereclause
    + "','" + defaults + "','DataFormHTML?rdap=" + rdap + "r" + subdb +"','DataForm?rdap=" + rdap + "i" +  subdb
    + "','','Search','" + help +"',-1,-1,-1,-1,'','','','','')";
    oldtask = "UPDATE Task SET lastupdate=" + timenow + ", query='"
    + whereclause  +  "', insertQuery='" + defaults
    +"', title='" + title +"',  help='" + help + "' WHERE name='" + rdap +"s'";

    if ( (n = adapter.executeUpdate(newtask)) < 1)
       n = adapter.executeUpdate(oldtask);
    if (n==1)
       msg.append("<li>" +Toolbox.emsgs(orgnum,167) + " <b>" + rdap + "s</b> " + " " +  Toolbox.emsgs(orgnum,1076));
    else
       msg.append("<li><font color=red>" +adapter.error()  +"</font>" + newtask);
    String entryinsert = insertQuery.replaceAll("\n.*","");
    String entryinsert1 = entryinsert.replaceFirst("SELECT 1 \\+ MAX\\(n\\)", "VALUES(1").replaceFirst(" FROM " + rdap, ")");
    newtask = "INSERT INTO Task (lastupdate," + rdapfields + ") VALUES ("  + timenow +",'"
    + rdap +"i','"  + title +"','" + entry
    //+ "','\n\n" + insertQuery.replaceAll("[^\n]+","") + "','" + entryinsert + "|" + entryinsert1 +"','"
    + "','\n\n" + insertQuery  + "','" + entryinsert + "|" + entryinsert1 +"','"
    + "" + "','','Form','" + help +"',-1,0,-1,0,'','','','','')";
    oldtask = "UPDATE Task SET lastupdate=" + timenow + ", query='"
    + entry   +"', title='" + title +"', updateQuery='" + entryinsert + "|" + entryinsert1
    + "',insertQuery='\n\n" + insertQuery.replaceAll("[^\n]+","") +"',  help='" + help + "' WHERE name='" + rdap +"i'";

    if ( (n = adapter.executeUpdate(newtask)) < 1)
       n = adapter.executeUpdate(oldtask);
    else candonate = true;
    if (n==1)
       msg.append("<li>" +Toolbox.emsgs(orgnum,167) + " <b>" + rdap + "i</b> " + " " +  Toolbox.emsgs(orgnum,1076));
    else
       msg.append("<li><font color=red>" +adapter.error()  +"</font>" + newtask);
    if (subdb.equals(""))
    {
       Generic.genStoredProc(rdap + "r", adapter, orgnum);
       Generic.genStoredProc(rdap + "i", adapter, orgnum);
       Generic.genStoredProc(rdap + "s", adapter, orgnum);
    }
    }
    msg.append("</ul>" + Toolbox.emsgs(orgnum,264));
    if (candonate)
        msg.append("<br><br>" + Toolbox.emsgs(orgnum,1330)  +" <a href=\"webwizard.jsp?mode=16&rdap=" + rdap +"\" ><b>" + Toolbox.emsgs(orgnum,1105) +"</b></a>");
    %>
    <script type="text/javascript" >
    var thismode = <%=mode%>;
    
    parent.parent.frames[0].document.location.href="webwizard.jsp?mode=1&initrdap=<%=rdap%>&stay=";
    parent.document.body.innerHTML = "<tr><td><%=Generic.handle(msg.toString())%></td></tr>";
    </script>
    <%
}
else if ( mode.equals("14"))
{
   String err = "";
   boolean b = false;

   if (rdap!=null && !rdap.equals(""))
   {
     String sqls = "SELECT * FROM userform where formname='" + rdap + "' AND uid='" + user.id +"'";
     int m = adapter.executeQuery(sqls);

     if (m == 1)
     {
        String sql[] = new String[6];
        sql[0] = "DELETE FROM Task where name='" + rdap + "r'";
        sql[1] = "DELETE FROM Task where name='" + rdap + "s'";
        sql[2] = "DELETE FROM Task where name='" + rdap + "i'";
        m = adapter.executeQuery("SELECT * FROM Task where name='" + rdap + "'");

        if (m == 0)
        {
        sql[3] = "DELETE FROM userform where formname='" + rdap + "' AND uid='" + user.id +"'";
        sql[4] = "DELETE FROM Apptables where tname='" + rdap + "'";
        sql[5] = "DROP  TABLE  " + rdap;
        b = false;
        try{
        b =  adapter.transacte(sql,0,6);
        }catch(Exception e){}
        err = adapter.error().trim();
        Generic.storedProc.remove(rdap);
        Formr.modifyFile(rdap, null, null, uid1, -1, user,1);
        }
        else
        {
         try{
            b =  adapter.transacte(sql,0,3);
            }catch(Exception e){}
         err = adapter.error().trim();
        
        }
      }
   }
   if (b)  
       out.println("<script type=text/javascript >var thismode = " + mode +"; parent.parent.frames[0].openpage('webwizard.jsp?mode=1',''); </script>");
   else
       out.println("<script type=text/javascript >var thismode = " + mode +";</script> " + err );
 
}

else if ( mode.equals("15"))
{
   String title = Toolbox.defaultParam(orgnum,request, "title", "");
   long timenow = System.currentTimeMillis()/1000;
%>
<img name=testimg src=image/blank.gif width=100% height=1>
<table  width=100% cellspacing=0 cellpadding=0>
<tr><td>
<script type="text/javascript" >
if (typeof(needtranslator) == 'undefined') 
   var needtranslator=true;    
var thismode = <%=mode%>;
var langcode = "<%= Toolbox.langs[orgnum>>16]%>";
var theight=150, encoding='<%=Toolbox.encodings[orgnum>>16]%>',iid = '',timeformat = '<%=Toolbox.timeformat%>',font_size=<%=cachedstyle.fontsize%>,isRegistered = true;
if (window.name=='subwin')
{
var openerrows = 8;
var pubkeys='012n_3.1,0050t_20,0010s,0010r,011c,00200a_60_2,00500b_400_30,00100u';
var mat = new Array(1);
var nextpageurl='';
var positionstr = '';
var labels= new Array(8);

var hhs =  ['<%=Toolbox.emsgs(orgnum,1214)%>','<%=Toolbox.emsgs(orgnum,179)%>','<%=Toolbox.emsgs(orgnum,206)%>','<%=Toolbox.emsgs(orgnum,181)%>',
        '<%=Toolbox.emsgs(orgnum,182)%>','<%=Toolbox.emsgs(orgnum,180)%>','<%=Toolbox.emsgs(orgnum,183)%>','<%=Toolbox.emsgs(orgnum,185)%>'];
var H='';
for (var i=0; i < 8; i++)
{
   labels[i] = textmsg[128] + " " + (i+1);
   H += textmsg[128].replace(/ /g,'') +  (i+1) +","; 
}
H = H.replace(/,$/,'');
mat[0] =['1','','','','','','',''];
mat[0][2] = "1";
mat[0][3] = '';
mat[0][6]="|H1|,|H2|;||,|Auto grow|";
mat[0][7]=(''+document.location).replace(/webwizard.jsp.*$/,'image/tm.gif');
var  
ZQ = ["r","<%=Toolbox.emsgs(orgnum,412)%>","","","","","<%=user.id%>","0","","","1"],
MS='0,1,0,0,6,1,1,' + openerrows,
options = new Array( openerrows ),
captions = new Array( openerrows ),
defaultRecord=new Array(openerrows),
fsnd = null,
helpbuttons = '',
mm = 0;
for (var i=0; i < 8; i++)
{
   ZQ[5] += labels[i] +":" + hhs[i] +"\n";
}
options[2] = ['1','2'];
captions[2] = ["S1","S2"];
options[3] = ['1','2'];
captions[3] = ["C1","C2"];

}
else  
{
var openerrows = opener.passactualrows();
var pubkeys='';
var mat = new Array(1);
var nextpageurl='',positionstr='';
var labels=new Array();
mat[0] = new Array(openerrows);
var H='',
ZQ = ["<%=rdap%>r","<%=title%>","","","","","<%=user.id%>","0","","","1"],
MS='0,1,0,0,6,1,1,' + openerrows,
options = new Array( openerrows ),
captions = new Array( openerrows ),
defaultRecord=new Array(openerrows),
fsnd = null,
helpbuttons = '',
mm = 0;

for (var i=0; i < openerrows; i++)
{
   if (pubkeys!='')pubkeys += ",";
   pubkeys += opener.retrv(i,7) + (opener.retrv(i,4)=='n'?1:0)+ opener.retrv(i,4);
   var xx = opener.retrv(i,5); if (xx!='') pubkeys += '_' + xx;
   xx = opener.retrv(i,6); if (xx!='') pubkeys += '_' + xx;
   xx = opener.retrv(i,2);
   labels[labels.length]=xx.replace(/ /g,'');
   if (xx=='') xx = "nolabel" + i;
   if (H=='') H = xx;
   else H += "," + xx;
   
   
   
   xx = opener.retrv(i,3);  
   if (xx!='') 
   ZQ[5] += opener.retrv(i,2).replace(/ /g,'') + ":" + xx + "\n";
   
   defaultRecord[i] = opener.retrv(i,9);
   xx = opener.retrv(i,9).replace(/\?\?CURRENT_TIME\?\?/g,'<%=timenow%>').replace(/\?\?CURRENT_USER\?\?/g,'<%=user.id%>');
   if (opener.retrv(i,4)=='s' || opener.retrv(i,4)=='r')
   {
      var jjj = xx.indexOf(";");
      if (jjj==-1)
      {
           options[i] = xx.replace(/^ /,'').split(",");
           captions[i] = options[i];
           if (xx.charAt(0)==' ')
             mat[0][i]= '';
           else
             mat[0][i]=options[i][0];
      }
      else
      {
           captions[i] = xx.substring(0,jjj).replace(/^ /,'').split(",");
           options[i] = xx.substring(1+jjj).split(",");
           if (xx.charAt(0)==' ')
             mat[0][i]= '';
           else
             mat[0][i]=options[i][0];
      }
   }
   else mat[0][i] = xx;
   
}

}
var tstmp = <%=tstmp%>;
var asso = new Array(1);
function makeasso(){}
var helpbuttons = "";
var tt1='';
ZQ[5] += '\n\n<!----><tr><td colspan=2><font color=purple><b>' + tt1 +'</b></font></td></tr>';
var webserviceAllbuts = "",webserviceAlloptions = "";
var STNEVE=['','','','','','',''];
 
</script>
<script type="text/javascript"   src=encryption.js></script>
<script type="text/javascript"   src=decrypt.js></script>
<script type="text/javascript"   src=multipleselect.js></script>
<script type="text/javascript"   src=timeformat.js></script>
<script type="text/javascript"   src=commonused.js></script>
<script type="text/javascript"   src=makeform.js></script>
<script type="text/javascript"   src=helpformatf.js></script>
<script type="text/javascript"   src=makeformdu.js></script>
<script type="text/javascript"   src=checkHTML.js></script>
<script type="text/javascript"   src=hints.js></script>
</td></tr></table>
<script type="text/javascript" >



setaction = function(n)
{
  // myprompt('<%=Toolbox.emsgs(orgnum,264)%>');
  for (var i=0; i < numCols; i++)
  {
     if (ctype[i]=='b')
     {
        ele(0,i).value = retrv(0,i);
     }
  }
  formnewaction(document.form1, "Echo");
  document.form1.target = "_blank";
  visual(document.form1);
document.form1.submit();
}
</script>

<script type="text/javascript" >
var myini = function()
{
     
if (browserstr.indexOf('MSIE') >= 0)
{
   var xx = findPositionnoScrolling;
   findPositionnoScrolling = function(vv, w)
   {
      var xy = xx(vv,w);
      xy[1] += 12;
      return xy;
   }
}
 
if (window.name!='subwin')
{
  var het = findPositionnoScrolling(document.thisform.savebutn,window);
  var diff =  document.body.offsetHeight - 60 - het[1];
  if (het[1] < screen.height && diff>0 && diff <300) window.resizeBy(0, -diff);
  
}
else 
{
  var s = "<%=Generic.handle(Toolbox.emsgs(orgnum,506).replaceFirst("\n\n","<br><br>"))%><input type=hidden>";
  s = "<div style=\"float:left\"><img src=image/guide1.gif height=60></div>" + s;
  myprompt(s,null,null,textmsg[191]);
  var xy = findPositionnoScrolling(ele(0,0), window); 
  setRoundedWidth(promptwin, 360);
  promptwin.style.top = xy[1] + 'px';
  promptwin.style.left = 360 + 'px';
   
}
 
}
</script>
<script type="text/javascript"  src=curve.js?sn=30&dn=1></script>
<%
}


else if ( mode.equals("16"))
{
   String rdapfields = "name,title, query, insertQuery, updateQuery, deleteQuery,webService, format, help,   roles, insertroles, updateroles, deleteroles,jscript,preop,postop,permits,options";
   String sql = "SELECT * FROM Task WHERE name='" + rdap + "r'";
   adapter.executeQuery(sql);
   Webform w = new Webform(adapter,0);
   w.parseQuery();

   String [] optionquerys = w.query.split("\n[\r]*\n+");

   for (int ll=0; ll < optionquerys.length; ll++)
             optionquerys[ll] = optionquerys[ll].trim();

   int jjj = 1, numoptionquery = optionquerys.length;

   String keys = "," + adapter.keyFields(rdap) +",";

   String fieldstr = "";
   String optvalue = "";
   for (int i=1; i < w.fields.length; i++)
   {
      if ((w.ctypes[i].charAt(0)=='r'||w.ctypes[i].charAt(0)=='s')
          && jjj<numoptionquery)
         optvalue = optionquerys[jjj++];
      else
         optvalue = "";
     // if (i>0) out.println(",");
      String labels = w.labels[i].replaceAll("([a-z])([A-Z])", "$1 $2").replaceFirst("^nolabel[0-9]+$", "");
      String helps=  Generic.handle1(extrct(w.help,w.labels[i],orgnum ));
      if (i>0   && !helps.equals("")&& helps.length()>2)
      {
         labels = "";
         for (int k=0; labels.length() < 24/Toolbox.locales[orgnum>>16].charsize && k < helps.length(); k++)
         {
            char c = helps.charAt(k);
            if (c==32 || c>=33 && c<=47 || c>=58 && c<=64 || c>=91 && c<=96 || c>=123 && c<=127)
            {
               if (!labels.equals("") && labels.charAt(labels.length()-1)!=' ')
                   labels += ' ';
            }
            else labels += c;
         }
      }
      fieldstr += labels + "\t" + helps
      + "\t" + w.ctypes[i].charAt(0) + "\t"
      + dim(w.ctypes[i],1) + "\t"
      + dim(w.ctypes[i],2) + "\t"
      + ((w.defaultv[i].length() > 0 && w.defaultv[i].charAt(0)=='!')?1:0) + "\t"
      + ((keys.indexOf("," + w.quanty[i] +",")>=0)?1:0) + "\t"
      + Generic.handle1(merge(optvalue,w.defaultv[i].replaceFirst("^!","")));
      if (i < w.fields.length-1)
         fieldstr +="\n";
   }
   String sufix = "";
   int j=1;
   long timenow = System.currentTimeMillis()/1000;
   while (j < 10 )
   {
      String sqll = "INSERT INTO  Formmodel(lastupdate, topic, fields,uid) VALUES (" + timenow + ", '"
          + w.title.replaceAll("'", "''") + " " + sufix + "','" +
          fieldstr.replaceAll("'", "''") +"',NULL)";

      if (1== adapter.executeUpdate( sqll)) break;
      
      sufix = "" + (j++);
   }
out.println("<script type=text/javascript >var thismode = " + mode +";</script>");
   if (j < 10) out.println("Thank you for your comtribution");
   else out.println("Such a template exists already");
}
else if ( mode.equals("17"))
{
   String title = Toolbox.defaultParam(orgnum,request, ("title"), null);
   title = Toolbox.validate(title, ",", 40);
   String fieldstr = Toolbox.defaultParam(orgnum,request, ("fieldstr"), null);
   fieldstr = Toolbox.validate(fieldstr,",", 30);
   String fromm = Toolbox.defaultParam(orgnum,request, ("fromm"), null);
   fromm = Toolbox.validate(fromm, null, 30);
    long timenow = System.currentTimeMillis()/1000;
    String err = "";
   String sqll = "UPDATE Formmodel SET topic='" + title.replaceAll("'", "''") + "', fields='"
         + fieldstr.replaceAll("'", "''") +"', lastupdate=" + timenow
         + " WHERE uid='" + user.id +"'";
   int j = adapter.executeUpdate( sqll);
   if (j<0)
       err += adapter.error() + sqll;
   else if (j==0)
   {
      sqll = "INSERT INTO  Formmodel(lastupdate, topic, fields,uid) VALUES (" + timenow + ", '"
          +   title.replaceAll("'", "''") +    "','" +
          fieldstr.replaceAll("'", "''") +"','" + user.id +"')";
      j = adapter.executeUpdate( sqll);
      
   }
   adapter.close();
   if (j == 1)
       out.println("<script type=text/javascript >parent.myprompt('" + Toolbox.emsgs(orgnum,71) + "');</script>");
   else
       out.println("<script type=text/javascript >parent.myprompt(\""  + Generic.handle(err)  + "\");</script>");
}

else if ( mode.equals("18"))
{

   String sqll = "DELETE FROM  Formmodel WHERE uid='" + user.id +"'";
   int j = adapter.executeUpdate( sqll);
   sqll = "DELETE FROM userform WHERE uid='" + user.id +"' AND lastupdate=-1 AND formname='" + rdap +"'";
   j = adapter.executeUpdate( sqll);
   %>
   <script type="text/javascript" > var thismode = <%=mode%>;  parent.parent.frames[0].openpage("webwizard.jsp?mode=1","");</script>
   <%
}
else if (mode.equals("19"))
{

%>

<%=Toolbox.title(Toolbox.emsgs(orgnum,359) )%>
<% if (1==2) {%>
<form rel=opener name="form1" style="margin:5px 0px 0px 0px" method="post" action="webwizard.jsp"  >

<table BORDER=0 cellspacing=0 cellpadding="0" align="center" > <!-- class=outset1 -->
<tr>
 <td> <%=fields2(Toolbox.emsgs(orgnum,1271), cachedstyle.fontsize, orgnum, cachedstyle)%></td>
  <td><input  name="rdap" type="text" style="margin:0px 0px 0px 0px;border:1px #b0b0b0 outset !important;width:70px"  readonly="true"  value="<%=rdap%>" >
  </td><td><input name="btngen" class=OrangeButton     type=button value="<%=Toolbox.emsgs(orgnum,1046)%>"  ONCLICK="parent.frames[1].next()"></td>
  <td><input type=button name=deletebtn class="RedButton"   value="<%=Toolbox.emsgs(orgnum,30)%>" onclick="parent.frames[1].cancel()">
</td>
</tr>
</table>

</form>
<%}%>

<script type="text/javascript"   src=curve.js></script>
 
<%
}

 




}


adapter.close();

%>
</body>
</html>

