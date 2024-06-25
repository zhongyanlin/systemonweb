<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
%>
<% 
String encode1 = Toolbox.defaultParam(orgnum,request,"encoding",null,null, 30);
User user = (User)(session.getAttribute("User"));
if (encode1 == null)
{
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
 
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,718)%></title>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("encoding.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>

</head>
<body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 0px 5px" >
<center>
     <%=Toolbox.title("Encoding")%> 
<TABLE cellpadding=0 cellspacing=0><tr height=5><td></td></tr></table>
<script type="text/javascript" >document.write(round1());</script>
<TABLE cellpadding=1 cellspacing=0 border=0 class=outset3 >
<tr><td>
<form rel=opener name=f method=post action=encoding.jsp  >

<table align=center cellpadding=1 cellspacing=1 border=0 >
<tr height=5><td></td></tr>

<tr>
<td bgcolor=<%=cachedstyle.DBGCOLOR%> > Encoding </td>

<td>
<select name="encoding">
<option value="big5">big5</option>
<option value="euc-kr">euc-kr</option>
<option value="gbk">gbk</option>
<option value="utf-8">utf-8</option>
<option value="shift-jis">shift-jis</option>
</select>
<script type="text/javascript" >
var s = document.getElementsByTagName("select")[0];
var i=0; while (i < s.options.length &&
                    s.options[i].value != '<%=Toolbox.encoding%>')i++;
s.selectedIndex = i;

</script>
</td>



<td   align=center>
<input type=submit name=t class=GreenButton style="width:70px;text-align:center" value="<%=Toolbox.emsgs(orgnum,51)%>" >
</td>
</tr>

</table>
</form>

</td>

</tr>
<tr>

<td>

<a href="encoding.jsp?encoding=graphics"> Graphics </a>
<% String [] fs = Toolbox.emsgs(orgnum,1497).split(";"); 
 
String opts = "";
for (int j =0; j < fs.length; j++)
  opts += "<option value=\"" + fs[j] + "\" " + (fs[j].equals(Toolbox.fontsnamestr(orgnum>>16))?"selected":"") + " >" + fs[j] + "</option>";
%>
<select name="fontfamily" onchange="chgfont(this)"><%=opts%></select>

</td></tr>

</table>
<script type="text/javascript" >document.write(round2);</script>
</center>
<script type="text/javascript"  src=curve.js></script>
<script>
function chgfont(td)
{
    open("encoding.jsp?encoding=fontname" + td.options[td.selectedIndex].value);
}
</script>
<table>
<%/*
try 
{
    String str = Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "conf" + File.separator + Toolbox.encoding + ".txt";

    FileInputStream fin = new FileInputStream(new File(str));
    InputStreamReader esr = new InputStreamReader(fin);
    BufferedReader ebr = new BufferedReader(esr);
    String aline = null;
    while ((aline = ebr.readLine()) != null) 
    {
        aline = aline.trim();
        out.println("<tr><td>" + aline.replaceFirst(" .*","")
                + "</td><td>" + aline.replaceFirst("[^ ]+[ ]+","")
                + "</td></tr>");
    }
    fin.close();
}
catch(Exception e){}
try 
{
    String str = Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "conf" + File.separator + Toolbox.encoding + "s.txt";

    FileInputStream fin = new FileInputStream(new File(str));
    InputStreamReader esr = new InputStreamReader(fin);
    BufferedReader ebr = new BufferedReader(esr);
    String aline = null;
    while ((aline = ebr.readLine()) != null) 
    {
        aline = aline.trim();
        out.println("<tr><td>" + aline.replaceFirst(" .*","")
                + "</td><td>" + aline.replaceFirst("[^ ]+[ ]+","")
                + "</td></tr>");
    }
    fin.close();
}
catch(Exception e){}
*/
%>

</body>
</html>
<%
}
else if (encode1.equals("graphics"))
{
    JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);

   int m1 = adapter.executeQuery("select safecolor, cautioncolor, dangercolor, longtimecolor  from SystemParam");
   if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
String safe = "green", caution = "orange", danger="red", longtime="blue";
            if (m1 > 0)
            {
               safe = adapter.getValueAt(0,0);
               caution = adapter.getValueAt(0,1); 
               danger= adapter.getValueAt(0,2); 
               longtime= adapter.getValueAt(0,3);
             }    
            Toolbox.changecss(safe,caution,danger,longtime,orgnum);
    adapter.close(); 
   %>
   <script type="text/javascript" >
   document.location.href = "index.jsp";
   </script>
   <%
}
else if (encode1.indexOf("fontname")==0)
{
     Toolbox.fontsname[orgnum>>16] = encode1.substring(8);
     //Toolbox.makejs(null); 
     JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);

   int m1 = adapter.executeQuery("select safecolor, cautioncolor, dangercolor, longtimecolor  from SystemParam");
   if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
   String safe = "green", caution = "orange", danger="red", longtime="blue";
            if (m1 > 0)
            {
               safe = adapter.getValueAt(0,0);
               caution = adapter.getValueAt(0,1); 
               danger= adapter.getValueAt(0,2); 
               longtime= adapter.getValueAt(0,3);
             }    
            Toolbox.changecss(safe,caution,danger,longtime,orgnum);
    adapter.close(); 
    %>
   <script type="text/javascript" >
   document.location.href = "index.jsp";
   </script>
   <%
}
else
{
    String err = Toolbox.setCoding(encode1, Toolbox.installpath);
    Toolbox.openuif(Toolbox.installpath, null); 
    UploadFile.makepfolder(); 
    Toolbox.dbadmin[orgnum%65536].initFolder();
    int p = Toolbox.dbadmin[orgnum%65536].hasSysDB();
    if (Toolbox.encoding.equals("utf-8"))
    {
        JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);

        Generic.genStoredProc(null,adapter,orgnum);

        adapter.close();

    }
    if (err!=null && err.replaceAll("\\S","").equals("")==false)
    {
        request.setCharacterEncoding(Toolbox.encoding);
        out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body>"+err + encode1+"</body></html>");
        return;
    }
    
    %>
    <script type="text/javascript" >
       document.location.href = "index.jsp";
    </script>
    <%
}
%>
