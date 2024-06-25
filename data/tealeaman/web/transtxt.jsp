<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*" %>

<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
 User user = (User)(session.getAttribute("User")); 
if ( (user = User.authorize(orgnum, Systemroles.SYSTEMANALYST|Systemroles.SYSTEMADMIN,application,session,request, response, "transtxt.jsp", true)) == null|| !Toolbox.verifytoken(request)) 
 return;
 String sl =  Toolbox.langs[Toolbox.langnum];
 String tl =  Toolbox.langs[orgnum>>16];
 int si = Toolbox.langnum, ti = (orgnum>>16); 
 String which = Toolbox.defaultParam(orgnum, request, "which", "");
 int N = 0;
%> 
<!DOCTYPE HTML >
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%> 
<%  
 if (which.indexOf("save") >= 0)
 {
     String txt = Toolbox.defaultParam(orgnum, request, "txt", null); 
     String fpath = Toolbox.installpath +  File.separator +  "WEB-INF" +  File.separator +  "conf" +  File.separator + sl + (which.equals("save")?"":"s") + ".txt";
     FileWriter fout = new FileWriter(fpath, false);
     fout.write(txt);
     fout.close(); 
%></head><body style="margin:5px 5px 5px 7px"><script>parent.myprompt("saved");</script></body></html> <%
     return;
 } 
%>
<title>Translation</title> 
<%=Toolbox.getMeta(orgnum)%> 
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("transtxt.jsp","f")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script>
<script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
<script type=text/javascript  src=cookie.js></script>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
<link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
</head><body bottommargin=0 bgcolor=<%= cachedstyle.DBGCOLOR %> >
 <%
 StringBuffer extra = new StringBuffer();
 String [] lines = null;  
 String [] tlines = null;
 String enc = Toolbox.defaultParam(orgnum, request, "enc", "UTF-8");
 if (which.equals("js"))
 { 
     String ff = Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "conf" + File.separator + sl + "s.js";
      
     String stxt = Toolbox1.filebytes("WEB-INF"+ File.separator + "conf"+ File.separator  + sl + "s.txt", "UTF-8" );
     String ttxt = Toolbox1.filebytes("WEB-INF"+ File.separator + "conf"+ File.separator  + tl + "s.txt", enc );
     
     if (stxt == null)
         out.println( "no such file");
     else 
     {
       stxt = stxt.trim().replaceAll("\n[ ]*\n+","\n");
       if (ttxt==null) ttxt = stxt;
       
        lines = stxt.split("\n[ ]*[0-9]+ "); 
       tlines =ttxt.split("\n[ ]*[0-9]+ ");
       lines[0] = lines[0].replaceFirst("^[0-9]+ ","");
       tlines[0] = tlines[0].replaceFirst("^[0-9]+ ","");
       N =  lines.length; 
     }
 }
 else 
 {
     N =  Toolbox.msgs[si].length;
 } 
out.print(  "<table align=center  cellspacing=0 cellpadding=0 >");
out.println(Toolbox.title("Translation",1)  + "<tr height=3><td></td></tr>");
out.print( "<tr><td  align=center bgcolor=#b0b0b0 ><table id=\"maintable\" style=\"border-collapse:collapse;border-color:#b0b0b0\" class=outset1 cellpadding=1 width=100% cellspacing=0 border=1>");

out.print(  "<tr ><td align=right  style=\"padding:2px 4px 2px 4px\">#</td><td  style=\"padding:2px 4px 2px 4px\">" + (sl.equals(tl)?"":("<b>/WEB-INF/conf/" + sl +  which.replaceFirst("j","") +  ".txt</b>")) +  "</td><td></td><td  style=\"padding:2px 4px 2px 4px\"><b>/WEB-INF/conf/" + tl +  which.replaceFirst("j","") + ".txt</b><input name=encoding size=7 value=\"" + enc + "\" onchange=reload(this)></td><td align=right  style=\"padding:2px 4px 2px 4px\">#</td></tr>");
for (int i=0; i < N; i++)
{
   String s = null; 
   if (which.equals("")) s = Toolbox.emsg(si,i);else s = lines[i];
   String ts = ""; 
   if (which.equals("")) ts = Toolbox.emsg(ti,i);  else ts = tlines[i];
   if (s == null){N = i; break;}
   
   out.println("<tr><td valign=top  align=right style=\"padding:2px 4px 2px 4px\">" + i + " </td><td valign=top  >");

   String [] ss = new String[]{s};
   String ty = "1";
   if (s!=null && s.length()>0 && s.indexOf("@")> 0 )
   {
       ss = s.split("@");
       ty = "@";
   }
   else if (s!=null && s.length()>0 && s.indexOf("\n")> 0 ) 
   {
       ss = s.split("\n");
       ty = "n";
   }

   String [] tss = new String[]{ts};

   if (ts!=null && ts.length()>0 && ts.indexOf("@")> 0 )
   {
       tss = ts.split("@");

   }
   else if (ts!=null && ts.length()>0 && ts.indexOf("\n")> 0 ) 
   {
       tss = ts.split("\n");

   }
   else if (ts==null || ts.length() == 0)
  {
      tss = new String[ss.length];
         for (int k=0; k < ss.length; k++)
            tss[k] = "";
   }
   for (int j=0; j < ss.length || j < tss.length; j++)
   {
       if (j>0) out.print("<br>");
       int  k = 80; if (sl.equals(tl)) k = 1;
       String ssj;
       if (j >= ss.length || ss[j]==null  ) 
           ssj = "";
       else 
           ssj= ss[j].replaceAll("^[ |\\+]+",""); 
       out.println("<input class=left " +  (sl.equals(tl)?"style=\"visibility:hidden;padding:2px 3px 2px 3px\"":"style=\"padding:2px 2px 2px 3px\"") +  " size=" + (k) + " id=s" + i + '_' + j + " value=\"" + ssj.replaceAll("\"","'") + "\" >");
   }
   if (ss.length!=tss.length) 
       out.println("</td><td valign=top><input  class=left style=\"text-align:center;padding:2px 3px 2px 3px;color:red\" size=1 id=w" + i + " value=" + ty + "></td><td>");
   else
       out.println("</td><td valign=top><input  class=left style=\"text-align:center;padding:2px 3px 2px 3px\" size=1 id=w" + i + " value=" + ty + "></td><td>");
   for (int j=0; j < ss.length || j < tss.length; j++)
   {
       if (j>0) out.print("<br>");
       int  k = 80; if (sl.equals(tl)) k=120; 
       String ssj;
       if (j >= tss.length || tss[j]==null) 
           ssj = "";
       else 
           ssj=   tss[j].replaceAll("^[ |\\+]+",""); 
       out.println("<input  class=left  style=\"padding:2px 3px 2px 3px\" onfocus=autotran(" + i + ',' + j + ") size=" + (k) + " id=t" + i + '_' + j + " value=\"" + ssj.replaceAll("\"","'") +  "\" >");
   } 
    
       out.println("</td><td valign=top  align=right style=\"padding:2px 4px 2px 4px\">" + i + " </td></tr>");
}
 
 %>
<tr><td colspan=4 align=center>
<input type=hidden class="left" size="6"  id="ij" value="<%=(which.equals("js")?0:1)%>,0">
<input type=button class="GreenButton" onclick="transl()" style="width:80px" value=Translate name=trans>
 <input type=button  class="GreenButton" onclick="save()"  style="width:80px"  value=Save name=submit>
 </td></tr></table>  </td></tr></table> 
 <%=   extra.toString()  %>
<script>
var which = "<%=which%>";
var tl = "<%=tl%>";
var sl = "<%=sl%>";
var N = <%=N%>;
var enc = <%=enc%>;
</script>
<script src="transtxt.js"></script>
</body>
</html>
