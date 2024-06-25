<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
%>
<%!

String tolinefeed(String str1)
{
   if (str1==null) return null;
   return str1.replaceAll("([^\\\\])\\\\t","$1\t").replaceAll("([^\\\\])\\\\n","$1\n").replaceAll("\\\\\\\\t","\\t").replaceAll("\\\\\\\\n","\\n").replaceFirst("^\\\\t","\t").replaceFirst("^\\\\n","\n");
}

String bg(String img, int userfont, int orgnum,CachedStyle cachedstyle) 
{
        return  "background:url(image/" + img + ");background-color:"
        + cachedstyle.TBGCOLOR 
        +";border:1px solid grey;font-size:" 
        + userfont +";padding;2px 1px 2px 1"

        + "px;margin:0px 0px 0px 0px;font-weight:500;font-family:" + Toolbox.fontsnamestr(orgnum>>16) + ";background-size:100%;background-origin: content;background-repeat:no-repeat";
}
Pattern rdapwhere = Pattern.compile("\\$[^\\$]+\\$");
String eval(String s, int ii)
{
     
    Matcher m = rdapwhere.matcher(s);
    int i, l, k = 0;
    String ans = "";
    while (m.find(k)) { 
            i = m.start() ;
            ans += s.substring(k,i);
            k = m.end();
            try{
               String str = s.substring(i+1, k-1);
               str = str.replaceAll("r", "" + ii);
               str = "" + Evaluate.arithematic(str);
               str = str.replaceFirst("\\.([0-9]*)0+$",".$1");
               str = str.replaceFirst("\\.$","");
               ans += str;
            }
            catch (Exception e)
            {
               ans +=s.substring(i+1, k-1);
            }
        }
    if (k!=s.length()) ans += s.substring(k);
    return ans;
}
%>
<%
 
User user = null;
if (  (user = User.dbauthorize(application,session,request, response, "dbparse.jsp", false)) == null|| !Toolbox.verifytoken(request)) 
    return;
CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
String style= Toolbox.butstyle(cachedstyle.fontsize);
String mode = Toolbox.defaultParam(orgnum,request, "mode", null, null, 20);
long tstmp = System.currentTimeMillis() % 10000000;

%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head>
    <title><%=Toolbox.emsgs(orgnum,447)%></title>
<%
    if (mode!=null && mode.equals("webfile"))
{
    String webfile = Toolbox.defaultParam(orgnum,request, "path", "");
    String lines = Toolbox.defaultParam(orgnum,request, "lines", "");
    int N = 0, j=0;
    StringBuilder contents = new StringBuilder();
    try
    {  
        N = Integer.parseInt(lines);  
        String webfile1 = user.webFileFolder + File.separator + webfile.replace('/', File.separator.charAt(0));
        
        FileInputStream fin = new FileInputStream(webfile1) ;
        InputStreamReader esr = new InputStreamReader(fin);
        BufferedReader ebr = new BufferedReader(esr);
        String aline;
         
        while ((aline = ebr.readLine()) != null)
        {
            if (contents.length()>0)
                contents.append("\n");
            if (j++ <= N) 
                contents.append(aline);
        }
        ebr.close();
        esr.close();
        fin.close(); 
        }catch(Exception e){ }
        
     %>
     <script> parent.getFile20(<%= N%>,<%= j%>,"<%=Generic.handle(contents.toString())%>");</script>
</head></html>
    <%
     return; 
}
 %>
<%=Toolbox.getMeta(orgnum)%>
  
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<style type="text/css"> 
    input.nonebg{<%=bg("no",cachedstyle.fontsize, orgnum,cachedstyle)%>}
    input.withbg{<%=bg("hintbgreg.gif",cachedstyle.fontsize, orgnum,cachedstyle)%>}
    input.withlf{<%=bg("hintbglf.gif",cachedstyle.fontsize, orgnum,cachedstyle)%>}
    form table tr td table tr{font-family:inherit;}
    form table tr td table tr td {font-family:inherit;} 
    form table tr td table tr td select{font-family:inherit;} 
    form table tr td table tr td select option{font-family:inherit;}
    form table tr td table tr td input{font-family:inherit}
    input.roundc {border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;border:1px #b0b0b0 solid}
</style> 
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("dbparse.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript"  src=checkHTML.js></script>
<script type="text/javascript"  src="findrep.js"></script>
<%=Toolbox.unifontstyle(cachedstyle.fontsize,orgnum)%>

</head>
 
 
<body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 5px 5px">
<%=Toolbox.title(Toolbox.emsgs(orgnum,1240) )%>
<% 
if (mode==null)
{
    String []ts = Toolbox.emsgs(orgnum,1606).split("@");
    String []js = Toolbox.emsgs(orgnum,1607).split("@");
    String []ms = Toolbox.emsgs(orgnum,1608).split("@");
%>

<form name=form1 style="margin:5px 0px 5px 0px" 
      method=post action="dbparse.jsp" target="_blank"> 
 

<table border="0" cellspacing=0 cellpadding="3" width=96% class=outset3 style="margin:2px 0px 5px 0px">
    <tr><td style="width:0%" valign="top"> A.</td>
        <td style="width:0%" valign="top"><nobr><%=ts[0]%>:</nobr></td>
        <td style="width:0%" valign="top">
 <table  border=0 align="left"  cellspacing=1   style="border:1px #aaaaaa solid">
           <tr> 
               <td><nobr><%=ms[0]%></nobr></td>
                <td colspan="2">
                    <input type="file" style="border:1px #b0b0b0 solid;" name=localpath onchange="openfileto(this,document.form1.rawdata,afterloadlocal)" >
                </td> 
                <td  ><nobr><%=ms[1]%></nobr></td> <td style="padding:0px 0px 0px 25px" rowspan="2" align="center"><nobr><%=ms[3]%></nobr><input type="radio" name="source" value="entertxt" onclick="chooseenter()"></td>
            </tr>
             <tr> 
                 <td><nobr><%=ms[2]%></nobr></td>  
                <td  > 
                    <input class=OrangeButton style=width:70px type=button name=b1 value="<%=Toolbox.emsgs(orgnum, 206)%>" onclick="selfile(this)">
                </td><td><input type=text name=webfile class="left"  style="border:1px #b0b0b0 solid" >
                </td><td   ><nobr><%=ms[1]%>    </nobr>
                </td> 
            </tr>  
        </table> 
        </td>
        <td align="left" valign="top" width="99%"> 
            <table border="0" cellpadding=2 cellspacing=1 style="border:1px #aaaaaa solid">
                <tr><td>
                    <input type=checkbox name="iscsv" onchange="showclosure(this)">
                </td>
                <td><%=ts[7]%></td>
                <td>
                <td align="right"   ><span  style="visibility:hidden;" id="closurelbl" ><%=ts[5]%></span></td>   
                <td aling="left">
                    <input list="closurelist" type="text"  class="roundc"   style="visibility:hidden;width:60px"  name=closure   value="&quot;"   >
                    <datalist id="closurelist">
                        <select>
                        <option value="&quot;">
                        <option value="'">
                        <option value="`">
                        <option value="|">
                        <option value="$">
                        </select>
                    </datalist>
                </td>
                </tr>
               <tr>
                <td>
                    <input type=checkbox name="head" checked>
                </td>
                <td  colspan="4"><nobr>
                <%=ts[6]%></nobr>
                </td>
                
               
                </tr>
            </table>
        </td>
    </tr>
   
    <tr><td  > B. </td><td><%=ts[1]%>:</td><td colspan="2"> 
        <table   style="border:1px #aaaaaa solid">               
            <tr>
                <td><script>document.write(textmsg[1561]);</script></td>
                <td >
                    <input class="roundc" style="color:#aaaaaa"  onMouseOver="showmyhint(0,1)" id=\"XXX\"  onMouseOut="hidemyhint()" value="" onblur="verifyreg(this)" type=text name=old size=10  >
                </td>
                
                <td>
                    <input type=button class=GreenButton style="width:74px" name=search value="<%=Toolbox.emsgs(orgnum, 1113)%>" onclick="findstrintextarea(document.form1.old.value)">
                </td>
                <td>&nbsp;<%=Toolbox.emsgs(orgnum,1611)%>&nbsp;
                </td>
                <td>
                    <input type=text  class="roundc"  style="color:#aaaaaa"   name=newstr size=10  value=""  onMouseOver="showmyhint(1,1)" id=\"imglet\"  onMouseOut="hidemyhint()">
                </td>
                <td>
                    <input type=button  class=OrangeButton  style="width:72"   name=replace value="<%=Toolbox.emsgs(orgnum, 1114)%>" onclick="replacestrintextarea(document.form1.newstr.value)">
                </td>
                <td>&nbsp;</td>
                <td><input type=button  class=OrangeButton  style="width:86"   name=replall value="<%=Toolbox.emsgs(orgnum, 1248)%>" onclick="replaceall(document.form1.old.value,document.form1.newstr.value)">

                </td>
            </tr>
        </table></td></tr>
    <tr><td> </td><td colspan="3">
        <table style="display:inline" cellpadding=0 cellspacing=0 border=0 align=left width=95%  >
            <tr>
                <td id="header"> </td>
            </tr>
            <tr>
                <td valign=TOP>
                    <textarea style="border:1px #b0b0b0 solid;margin:-3px -3px -5px -3px;font-family: courier" name=rawdata rows=10 cols=60 onchange="canstart()"><%=Toolbox.emsgs(orgnum, 1245)%></textarea>
                </td>
            </tr>
        </table></td></tr>
    <tr><td >C. </td><td><%=ts[2]%>:</td><td  colspan="2">
        <table   BORDER=0 cellspacing=1 align="left"  style="border:1px #aaaaaa solid" >
            <tr> 
                <td> 
                <%= Toolbox.emsgs(orgnum, 1250) %>
                </td>
                <td>
                    <input list="rowseplist" type=text class="roundc"   style="width:<%=6 * cachedstyle.fontsize%>px"    name=rowsep size=6 value="\n"    onblur="verifyreg(this)">
                    <datalist id="rowseplist">
                        <select>
                        <option value="\n">
                        <option value="\r\n">
                        <option value="\r">
                        <option value=";">
                        <option value="/">
                        </select>
                    </datalist>
                </td>
                <td id="numrows"></td>
                <td>
                    <%= Toolbox.emsgs(orgnum, 1241) %></td> 
                <td><input list="colseplist" type=text  class="roundc" style="width:<%=6 * cachedstyle.fontsize%>px"    name=regex size=6 value="[ ]+"    onblur="verifyreg(this)">
                <datalist id="colseplist">
                        <select>
                        <option value="[ ]+">
                        <option value=" ">
                        <option value=",">
                        <option value=";">
                        <option value="-">
                        <option value="@">
                        <option value="_">
                        <option value="/">
                        <option value="*">
                        <option value="#">    
                        </select>
                    </datalist>
                </td>
                <td><input type=button  class=GreenButton    name=button value="<%=Toolbox.emsgs(orgnum, 1243)%>"  onclick="myparse()"></td><td>&nbsp;</td>
                <td>  <%= Toolbox.emsgs(orgnum, 1242) %></td>
                <td><input type=hidden name=delimiter></td>
                <td  id="delimit"></td>

                <td><input name=undo1 type=button  class=OrangeButton   value="<%=Toolbox.emsgs(orgnum, 1244)%>" onclick="undo()" ></td>
            </tr>
        </table></td></tr>
    
    <tr><td  valign="top">D. </td><td  valign="top"><%=ts[3]%>: </td><td  colspan="2">
        <table  align=left   cellspacing=0 cellpadding=0 >
            <tr>
                <td width="0%"><nobr><%=Toolbox.emsgs(orgnum, 712)%></nobr></td>
        <td width="0%"><input class="left"  style="border:1px #b0b0b0 solid;width:<%=6 * cachedstyle.fontsize%>px" size="6" name="newtable" onchange="redraw1(this)" onfocus="javascript:document.form1.init.style.visibility='visible';"></td>
          <td  width="0%" style="padding:0px 0px 0px 4px;font-size:15px;color:#af5600" align="left">
              <input name=init type=button  class=GreenButton style="visibility: hidden"   value="<%=Toolbox.emsgs(orgnum,226)%>" onclick="reinit()" >                   
                </td>      
        <td width="0%" align="center">&nbsp;&nbsp;&nbsp;<%=ms[1]%>&nbsp;&nbsp;&nbsp;</td>
               <td width="100%" align="left">
                    <select   style="border:1px #b0b0b0 solid;"  name=targettable onchange="javascript:repaint(this)">
                        <option value="" selected="true"><%=Toolbox.emsgs(orgnum, 206)%></option>
                    </select>
        <input type=button class=GreenButton style="width:74px" name=btnrepaint value="<%=Toolbox.emsgs(orgnum, 943)%>" onclick="repaint(document.form1.targettable)">
                
                </td>
                
                 
                
</tr></table></td></tr>
    
    <tr><td  ></td><td > 
            </td>                    
           <td  colspan="2"  id="blank" align="left"></td>
            </tr>
               
<tr><td>E. </td><td align="left"><%= js[0]%>: </td>
                <td colspan="2">
                    <table><tr>
                    <td> <input type="radio" checked name="override" value="no"> </td>
                    <td align="left"  ><%= js[1]%></td>
                    <td align="left"  > <input type="radio" name="override" value="yes"> </td>
                    <td align="left"  ><%= js[2]%></td>
                        </tr></table>
              </td></tr>    
    
</table> 
    <center><input type=button  class=OrangeButton   name=undo2 value="<%=Toolbox.emsgs(orgnum,51)%>" onclick="process()">
</center>
<input type="hidden" name="createsql" ><input type="hidden" name="picks" >
<input type="hidden" name="primarykey" ><input type="hidden" name="idledefault" >
<input type=hidden name=mode value=back>
</form>
</body>

<script type="text/javascript" >
var msg0 = "<%=Toolbox.emsgs(orgnum,1245)%>",msg1 = "<%=Toolbox.emsgs(orgnum,1246)%>",msg2 = "<%=Toolbox.emsgs(orgnum,1241)%>",msg3 = "<%=Toolbox.emsgs(orgnum,1250)%>";
var font_size = <%=cachedstyle.fontsize%>,DBGCOLOR = "<%=cachedstyle.DBGCOLOR%>",BBGCOLOR = "<%=cachedstyle.BBGCOLOR%>",IBGCOLOR = "<%=cachedstyle.IBGCOLOR%>",TBGCOLOR = "<%=cachedstyle.TBGCOLOR%>";
var checks = "";
var title = "<%=Toolbox.emsgs(orgnum,1240)%>";
var encoding = "<%=Toolbox.encodings[orgnum>>16]%>";
var langcode = "<%= Toolbox.langs[orgnum>>16]%>";
var bglf = "<%=bg("hintbglf.gif",cachedstyle.fontsize, orgnum, cachedstyle)%>";
var bgreg = "<%=bg("hintbgreg.gif",cachedstyle.fontsize, orgnum,cachedstyle)%>";
var bgno = "<%=bg("no",cachedstyle.fontsize, orgnum, cachedstyle)%>";
var hints = [textmsg[1299], '\\t \\n'];
var msg725 = "<%=Toolbox.emsgs(orgnum,725)%>";
var msg206 = "<%=Toolbox.emsgs(orgnum, 206)%>";
var msg1042 = "<%=Toolbox.emsgs(orgnum, 1042).replaceFirst("/.*$","")%>";
var msg1609 = "<%=Toolbox.emsgs(orgnum, 1609).replaceFirst("/.*$","")%>";
var msg1610 = "<%=Toolbox.emsgs(orgnum, 1610).replaceFirst("/.*$","")%>";
var aboutr = "<%=ts[4]%>";
var tstmp =  "<%=tstmp%>";
var thisurl = "<%=Toolbox1.geturl(request)%>";
</script>
<script type="text/javascript"  src="hints.js"></script>
<script type="text/javascript"  src="tableparse.js"></script>
<script type="text/javascript"  src="dbparse.js"></script>
<script type="text/javascript"  src=curve.js></script>     
<iframe name="w<%=tstmp%>" width="1" height="1" style="visibility:hidden" />
 
<%
} 
else 
{
  
out.print("<table><tr height=5><td></td></tr></table>");
String data = Toolbox.defaultParam(orgnum,request, "rawdata", "");
String path = null, path0="";
boolean iscsv = false;
char closure = ' '; 
if (data.equals(""))
{
   path0 = Toolbox.defaultParam(orgnum,request, "webfile", "");
   path = user.webFileFolder + File.separator + path0.replace('/', File.separator.charAt(0));
   iscsv = Toolbox.defaultParam(orgnum,request, "iscsv", null) != null;
   closure = Toolbox.defaultParam(orgnum,request, "closure", null).charAt(0);
}

String tablename = Toolbox.defaultParam(orgnum,request, "targettable", null, null, 30);
String createsql = null;
int [] picks = null;
String override = Toolbox.defaultParam(orgnum,request, "override", "no", null, 3);
String keymaps = "";
if (override.equals("yes"))
   keymaps = Toolbox.defaultParam(orgnum,request, "primarykey", "") + ",";
String idledefault = Toolbox.defaultParam(orgnum,request, "idledefault" , "") + ",";
if (tablename==null||tablename.equals(""))
{
   tablename = Toolbox.defaultParam(orgnum,request, "newtable", null, null, 30);
   createsql = Toolbox.defaultParam(orgnum,request, "createsql", null);
   
   String pickstr [] =  Toolbox.defaultParam(orgnum,request, "picks", "").split(",");
   picks = new int[pickstr.length];
   for (int i=0; i < picks.length; i++)
      picks[i] = Integer.parseInt(pickstr[i]);
}

if (tablename==null||tablename.equals(""))
{out.print(Toolbox.emsgs(orgnum,1246) +"</body></html>");  return;}
String delimiter = Toolbox.defaultParam(orgnum,request, "delimiter", null, "!@#$%^&{}[]|\\:;'\",?/", 30);
if (delimiter==null||delimiter.equals(""))
delimiter = Toolbox.defaultParam(orgnum,request, "regex", null, "!@#$%^&{}[]|\\:;'\",?/", 30);
if (delimiter==null||delimiter.equals(""))
{out.print(Toolbox.emsgs(orgnum,1241) +" missing</body></html>");  return;}
String rowsep = Toolbox.defaultParam(orgnum,request, "rowsep", "\\n", "!@#$%^&{}[]|\\:;'\",?/", 10);
rowsep = tolinefeed(rowsep);
String colsep = Toolbox.defaultParam(orgnum,request, "regex", "\\n", "!@#$%^&{}[]|\\:;'\",?/", 10);
colsep = tolinefeed(colsep); 
java.util.Vector<String> fields = new java.util.Vector(10);
 
 
int n = 0;
int [] orders ;
String [] defaultvs ;
String [] sq ;
String str;
if (picks == null)
{
while (true) 
{
   str = Toolbox.defaultParam(orgnum,request, "field" + n, null);
   if (str==null) break;
   fields.addElement(str);
   n++;         
}
orders = new int[n];
defaultvs = new String[n];
sq = new String[n];
  
for(int i=0; i < n; i++) 
{
   orders[i] = Integer.parseInt(Toolbox.defaultParam(orgnum,request, "order" + i, "0"));
   defaultvs[i] = Toolbox.defaultParam(orgnum,request, "defaultv" + i, ""); 
    
}
}
else
{
   n = picks.length;
   orders = new int[n];
   defaultvs = new String[n];
   sq = new String[n];
   for(int i=0; i < n; i++) 
{
   orders[i] = Integer.parseInt(Toolbox.defaultParam(orgnum,request, "order" + picks[i], "0"));
   defaultvs[i] = Toolbox.defaultParam(orgnum,request, "defaultv" + picks[i],""); 
    
   fields.addElement(Toolbox.defaultParam(orgnum,request, "field" + picks[i], ""));
}
}

JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (adapter.error().length() > 0)
{ 
    adapter.close();
    User.dberrorRelogin(application,session,request,response,"dbparse.jsp");
    return;
} 
if (picks != null)
{
   int q = adapter.executeUpdate(createsql);
   /*if (q == -1)
   {
       adapter.close();
       out.println( adapter.error()   + "</body></html>" ); 
       return;
   }*/
}
java.sql.ResultSetMetaData rs = adapter.tableMeta(tablename);
if (rs == null) 
{
 
             adapter.close();
             out.println( adapter.error()   + "</body></html>" );
             return;
}
CSVParse parser = null;
java.util.Scanner scan = null;
try 
{
      int kk = rs.getColumnCount();
  
      if (kk!=n) 
      {
            String ans = "";
            out.print ("Incorrect table strcture of " + tablename + ". The actual structure in the current database is <br><table class=outset1>");
            for (int i = 0; i < kk; i++) 
            {
                out.print ("<TR height=25 bgcolor="+cachedstyle.TBGCOLOR +"> <TD align=right>" +(i+1) + "</td><TD>" +
                rs.getColumnName(i+1) +"</td><TD>"+
                rs.getColumnTypeName(i+1) +"</td><TD align=right>");
                int ll =  rs.getColumnDisplaySize(i+1);
                if (ll < 10000  )
                {
                    out.println("(" + ll +")");
                }
                else
                {
                    out.println("  ");
                }
                
                out.println("</td><TD>"+
                ((rs.isNullable(i+1)==1)?"Yes":"No") +"</td></tr>");
                 
            }
           out.print("</TABLE>");
       }
       else
       {
          for (int i = 0; i < kk; i++) 
          {
                String colname = rs.getColumnName(i+1);
                int dtype =  rs.getColumnType(i+1);
                String numeric = "'";
                switch (dtype)
           {
            case Types.BIT:
            case Types.TINYINT:
            case Types.SMALLINT:
            case Types.INTEGER:
            case Types.BIGINT:
            case Types.FLOAT:
            case Types.DOUBLE:
             
            case Types.DECIMAL:
            case Types.NUMERIC:
            case Types.REAL:
            numeric = ""; 
           }                 
            int k=0; 
            for(; k < n ;k++)
           {
              if (colname.toLowerCase().equals(fields.elementAt(k).toLowerCase()))
                 break;
           }
 
            if (k==n) 
               {
                   out.println( "<b>" +  (fields.elementAt(k)) +"</b> is not in the list of fields of table " + tablename +":<b>");
                   for (int l = 0; l < kk-1; l++) 
                      out.println(rs.getColumnName(l+1)+", ");                                         
                   out.println(rs.getColumnName(kk) + "</b></body></html>");
                   adapter.close();
                   return;
               }
            else 
                sq[k] = numeric;
          }
       
       String v[] = data.split(rowsep); 
       java.util.Vector hints = new java.util.Vector();
       int jj = 0;
       int recordcount = 0, insertcount = 0, updatecount = 0, errcount = 0;
       String aline;
       Pattern pt = null;
       if (rowsep.equals("\r\n"))
          pt = Pattern.compile("[\r\n|\r|\n]");
       else 
          pt = Pattern.compile(rowsep);
       if (path != null)
       {
         if (iscsv)
            parser = new CSVParse(new File(path), closure, new String[]{colsep, rowsep});
         else
            scan = (new java.util.Scanner(new File(path))).useDelimiter(pt);
        } 
       int i=0;
       StringBuffer errs = new StringBuffer();
       out.println("<table align=center>");
       if (path!=null) 
           out.println("<tr><td align=left>" + Toolbox.emsgs(orgnum,1606).replaceFirst("@.*$","") + ":</td><td>" + path0 + "</td></tr>");
       out.println("<tr><td align=left>" + Toolbox.emsgs(orgnum,1246) + ":</td><td>" + tablename); 
       out.println("</td></tr></table><br>");
       out.println(" <table cellpadding=0 cellspacing=0 class=outset1 align=center   ><tr><td><table  id=maintable cellpadding=1 cellspacing=1 align=center  width=100% ><tr style=\"background:" + Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle) +"\">");
       StringBuffer strf = new StringBuffer("INSERT INTO " + tablename +" (");
       String upds[] = new String[n]; 
       for (int j=0; j < n; j++)
       {
           strf.append((String)(fields.elementAt(j)) );
           if (j!=n-1)
               strf.append(", ");
           else
               strf.append(") VALUES (");
           if (path==null)out.print("<td><b>" + (String)(fields.elementAt(j)) + "</b></td>");
 
       }
       if (path==null)out.print("</tr>");
       while (true)
       {
           String d[] = null;
           if (path == null)
            {
               if (i >= v.length) break;
 
               d = v[i].split(delimiter); 
            }
            else if (iscsv)
            {
               d = parser.nextRow();
               if (d == null) break;
            }
            else
            {
               if (!scan.hasNext())
                {
                   break;
                }
                d = scan.next().split(colsep); 
            }
    
            StringBuffer stru = new StringBuffer("");
            StringBuffer strv = new StringBuffer(strf);

            StringBuffer updateset = new StringBuffer("");
            StringBuffer updatekey = new StringBuffer("");
 
           for (int j=0; j < n; j++)
           {
               String edef = null;
               if (defaultvs[j]!=null) edef = eval(defaultvs[j], i);
               if (orders[j]>=0 && orders[j] < d.length) 
               {
                   stru.append("<td>" + d[orders[j]].replaceAll("<","&lt;") +"</td>");
                   strv.append(sq[j] + d[orders[j]].replaceAll("'","''") + sq[j]);
                   if (override.equals("yes"))
                   {
                       if (keymaps.contains("," + j + ","))
                        {
                            updatekey.append("AND " + fields.elementAt(j) + "=" + 
                            sq[j] + d[orders[j]].replaceAll("'","''") + sq[j]);
                        }
                        else
                        {
                            updateset.append("," + fields.elementAt(j) + "=" + 
                            sq[j] + d[orders[j]].replaceAll("'","''") + sq[j]);
                        }
                    }
               }
               else
               {
                   String temp = null;
                   if (edef != null)
                   {
                   temp = sq[j] + edef.replaceAll("'","''") + sq[j];
                   if (temp.equals("")) temp = "NULL";
                   stru.append("<td>" + edef.replaceAll("<","&lt;") +"</td>");
                   strv.append(temp);
                   }
                   else
                   {
                   temp = sq[j]   + sq[j];
                   if (temp.equals("")) temp = "NULL";
                   stru.append("<td>NULL</td>");
                   strv.append(temp);
                   }

                   if (override.equals("yes"))
                   {
                        if (keymaps.contains("," + j + ","))
                        {
                            updatekey.append("AND " + fields.elementAt(j) + "=" +   temp);
                        }
                        else if (!idledefault.contains("," + j + ","))
                        {  
                            updateset.append(", " + fields.elementAt(j) + "=" +  temp);
                        }
                    }
               } 
               if (j<n-1)
                strv.append(", ");                                                                                                            
           }
           strv.append(")");
           String sql = strv.toString().replaceAll(",([ ]+),", ",NULL,");
           int k = adapter.executeUpdate(sql);
           if (k == 1) insertcount++;
           else if (k!=1 && adapter.error().toLowerCase().contains("duplicate") && override.equals("yes"))
           {
               String updatesql = "UPDATE " + tablename + " SET "
               + updateset.toString().substring(1)   
               + updatekey.toString().replaceFirst("AND", " WHERE");
 
               k = adapter.executeUpdate(updatesql);
               if (k == 1) updatecount++;
               else if (k==-1) errcount++;
           }
           if (k!=1)
           {
               hints.addElement(adapter.error().replaceAll("<","&lt;").replaceAll(">","&gt;") );
               String event = "<td><span onMouseOver=\"showmyhint(" 
                              + (jj++)  
                              + ",1)\" onMouseOut=\"hidemyhint()\">";
               if (path==null)out.print("<tr style=\"color:purple;background-color:" + cachedstyle.TBGCOLOR +"\">" 
                       + stru.toString().replaceFirst("<td>",event
                                       ).replaceFirst("</td>","</span></td>") 
                         +"</tr>");
               else if (errs.length() < 2000)
                  errs.append(adapter.error() + "<br><br>");
           }
           else  if (path==null)out.print("<tr bgcolor=" + cachedstyle.TBGCOLOR +">" + stru +"</tr>");
           i++;
       }
       if (path!=null)
       {
           if (iscsv) 
              parser.close(); 
           else 
              scan.close();
           %>
           <td><%=Toolbox.emsgs(orgnum,876)%></td><td align="right"><%=i%></td></tr>
           <tr><td>#<%=Toolbox.emsgs(orgnum,28)%></td><td align="right"><%=insertcount%></td></tr>
           <tr><td>#<%=Toolbox.emsgs(orgnum,29)%></td><td align="right"><%=updatecount%></td></tr>
           <tr><td>#<%=Toolbox.emsgs(orgnum,75)%></td><td align="right"><%=errcount%></td></tr>
           <% 
        }
        else
        {
           recordcount = i;
        }
        out.print("</table></td></tr></table> ");
         
        if (jj>0 && path==null)
        {
             out.println("<center>*" + Toolbox.emsgs(orgnum,1249) + "</center>");
             out.print("<script type=\"text/javascript\" >var font_size =" + cachedstyle.fontsize +";var hints = [");
             for (i=0; i < jj; i++) out.print("\"" 
                   + Generic.handle( ((String)(hints.elementAt(i)))) + "\"" + ((i<jj-1)?",":"") );
            out.println("];</script>");
            out.println("<script type=\"text/javascript\"  src=hints.js></script>");
         }
         else if (path!=null && errs.length()>0)
             out.println(errs.toString());
             
%>
<script>
var onloadbeforedbp = null;
if (typeof window.onload == 'function') 
   onloadbeforedbp = window.onload;    
window.onload = function()
{
    if (onloadbeforedbp!=null) onloadbeforedbp();
    let tbl = document.getElementById('maintable');
    let badcol = new Array(); 
    let r = 0;
    for (let c=1; c < tbl.rows[0].cells.length; c++)
    {
        
        for (r = 1; r < tbl.rows.length; r++)
        {
            if (tbl.rows[r].cells[c].innerHTML != '')
            {
                break;
            }
        }
        if (r == tbl.rows.length)
        {
            badcol[badcol.length] = c;
           
        }
    }
    for (let k = badcol.length-1; k>=0; k--)
    {
        for (r = 0; r < tbl.rows.length; r++)
        {
            tbl.rows[r].deleteCell(badcol[k]);
        }
    }
}     
</script>
<%
        out.print("</body>");                          
     }     
}
catch(Exception e)
{
    if (scan!=null) scan.close();
    if (parser!=null) parser.close();
    out.print(e.toString());
    out.print("</body>");  
}      
adapter.close();
               
}%>
    

</html>


