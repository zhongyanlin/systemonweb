<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*"%>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (  (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request, response, "usewebservice.jsp", true)) == null|| !Toolbox.verifytoken(request)) 
    return;
orgnum=user.orgnum;
String  name =      (Toolbox.defaultParam(orgnum,request, ("Name"), null)) ; name = Toolbox.validate(name, null, 20);

String  caption =   (Toolbox.defaultParam(orgnum,request, ("Caption"), null)) ;   caption = Toolbox.validate(caption, null, 20);
String  des =       (Toolbox.defaultParam(orgnum,request, ("Description"), null)) ;   des = Toolbox.validate(des, "!@#$%^&*()+{}][;'\":,?/", 1000);
String  category =  (Toolbox.defaultParam(orgnum,request, ("Category"), null)) ;   category = Toolbox.validate(category, null, 20);
String  handler =   (Toolbox.defaultParam(orgnum,request, ("Handler"), null)) ;    handler = Toolbox.validate(handler, "./:-+", 20);
String  opt =       (Toolbox.defaultParam(orgnum,request, ("Option"), null)) ;   // opt = Toolbox.validate(opt, "!@#$%^&*()-+{}[]\\|:;\"',/=", 20);
String  butcolor =  (Toolbox.defaultParam(orgnum,request, ("ButtonColor"), null));  butcolor = Toolbox.validate(butcolor, null, 20);
String  example =   (Toolbox.defaultParam(orgnum,request, ("example"), null));    // example = Toolbox.validate(example, "!@#$%^&*()-+{}[]\\|:;\"',/<>", 20);
long tstmp = System.currentTimeMillis() % 10000000; 

if (request.getMethod().equals("GET"))
{
    name =  Toolbox.c2c(name,orgnum); 
    des =  Toolbox.c2c(des,orgnum); 
    category =  Toolbox.c2c(category,orgnum); 
handler =  Toolbox.c2c(handler,orgnum); 
opt =  Toolbox.c2c(opt,orgnum); 
butcolor =  Toolbox.c2c(butcolor,orgnum); 
}
if (example != null)
{
 String sql = "INSERT INTO Operation (name, caption, category,  description,cgi, opt, button, example) values ('" + name.trim()
+"','"  + caption.trim()
+"','"  + category.trim()
+"','"  + des.replaceAll("'", "''").trim()
+"','"  + handler.trim()
+"','"  + opt.replaceAll("'", "''").trim()
+"','"  + butcolor.trim()
+"','"  + example.trim() +"')"; 
Toolbox.dbadmin[orgnum%65536].doforalldb(sql,true,false);
%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>"><head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><script type="text/javascript" >
    parent.myprompt("<%=Toolbox.emsgs(orgnum,71)%>");
</script></head></html>
<%
return;
}
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
example = " ";

int n = adapter.executeQuery("select example, description, category, cgi, opt, button from Operation WHERE name='" + name.trim().replaceAll("'","''") +"'" );
String sql =   "";
if (n == 1)
{
  if (adapter.getValueAt(0,0) != null)
    example = Generic.handle(adapter.getValueAt(0,0));
  
  if (butcolor == null)
  {
     des = adapter.getValueAt(0,1);
     category = adapter.getValueAt(0,2);
     handler = adapter.getValueAt(0, 3);
     opt = adapter.getValueAt(0, 4);
     butcolor = adapter.getValueAt(0, 5);
  }

}
else
{ 
   if (butcolor == null)
      des =   category =  handler =  opt =  butcolor = "";
   sql +=  "')";
}
adapter.close();
 
String [] comp = example.split("_@_&%_#_@_");

%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
  <%=Toolbox.getMeta(orgnum)%>
  <title>
   <%=Toolbox.emsgs(orgnum,761)%>
  </title>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("usewebservice.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>

<script type="text/javascript" src="checkHTML.js"></script>
 
<%=cachedstyle.toString()%><link   rel="stylesheet" type="text/css" href="stylea.css" />
<link   rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
 
<style type=text/css>.box{border:1px #b0b0b0 solid}</style>
</head>
 
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));
var encoding = '<%=Toolbox.encodings[orgnum>>16]%>';
var langcode = "<%= Toolbox.langs[orgnum>>16]%>";
var handler = '<%=handler%>';
var ncomp = 0;
var comp = new Array(<%=comp.length%>);
<% for (int p = 0; p < comp.length; p++) {%>
comp[<%=p%>] = "<%=comp[p].replaceFirst("^ $","")%>";
<% } %>
<%=Toolbox.dimloc(600,500)%>
var asname = new Array(10);

</script> 
<% if (Generic.isFunctionStr(opt)){ %>
<script type="text/javascript"  src="<%=handler%>"></script>
<%}  
out.println("<style type=\"text/css\">");
            int minfs = 70, fontsizeind=0;
            for (int i=12; i <= 70; i +=2)
            {
                if (minfs >= Math.abs(cachedstyle.fontsize - i))
                {
                    minfs = Math.abs(cachedstyle.fontsize - i); fontsizeind = i;
                }
                out.println("textarea.class" + (i-10)/2 + "{font-size:" + i +"px;border:1px #b0b0b0 solid}");
            }
            out.println("</style>");
 %>
<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px" >
<!-- <%= (user.roles & Systemroles.SYSTEMADMIN) %> -->
<center>
<%=Toolbox.title(Toolbox.emsgs(orgnum,12))%>
<img src="image/blank.gif" name=rule width=100% height=1 style="margin:0px 0px 0px 0px" />
<form rel=opener  name=form1 method=POST   target=blank style="margin:-1px 0 0 0"  >
 <input type=hidden name="saveindir" value=""><font color=<%=cachedstyle.IBGCOLOR%>> <b><%=Toolbox.emsgs(orgnum,220)%>:</b> <%=des%></font>
 <script type="text/javascript" >document.write(round1('100%'));</script>
 <table class=outset3 cellspacing=1 cellpadding=1>
<% 
int j , na = 0, nb=0, asn = 0;
n = 0;
int elecount = 1;
String eletype=" ";
String  xx =  opt.replaceFirst( "[^\\(]+", "").replaceFirst("[ ]+$","");
int  ll = xx.length();
boolean scriptcase = false; 
String [] allname = null;
String style= Toolbox.butstyle(cachedstyle.fontsize);
int  kk = 0;
boolean needupload = false;
String args = "";    
Pattern FUNCTIONREP = Pattern.compile("^[\\w|\\d|_|\\.]+\\(.*\\)$");
Matcher md = WebService.FUNCTIONREP.matcher((CharSequence)opt.trim());
 
if (md.replaceAll("").trim().equals("")) // javascript case
{ 
    scriptcase = true;
    xx = xx.substring(1, xx.length() - 1).trim();

    String [] paras = xx.split(",");
    int len = paras.length;
    allname = new String[len];


    for (int i = 0;  xx.length() > 0 &&  i < len; i++)
    {
       String leng = "";
       if ( Toolbox.isParam(paras[i]) &&   !paras[i].equals("this") ) 
       {
          j = paras[i].indexOf('_');
          char t = 't';
          if (j >= 0 && j + 1 < paras[i].length()) 
          t = paras[i].toLowerCase().charAt(j+1);
          
          String type = "text";
          if (  t == 'p')
          {
               type="password";
                
          }
          else if ( t == 'c')
          {
               type = "checkbox";
               
          }
          else if ( t == 'r')
          {
               type = "radio";
          }
          else if ( t == 'f')
          {
              type= "file";
          }
          if (j == -1) 
              j = paras[i].length();
          paras[i] = paras[i].substring(0,j);
          out.println("<tr>" + Toolbox.fields( paras[i],orgnum, cachedstyle)  + "<td>");
          eletype += t;
          elecount++;
          if ( t == 'a' || t == 's') 
          {
             out.println("<textarea  " + (name.equals("LaTex")?"onkeypress=mkstrike(this,event)":"") +"   name=" + paras[i]   + " class=class" + ((fontsizeind-12)/2) +" cols=60 rows=23></textarea></td></tr>");
             na++;
             out.println("<script type=text/javascript > asname[" + (asn++) + "] = \"" + paras[i] + "\";</script>");
          }
          else
          {
             out.println("<input type="+ type + " name="+ paras[i] 
             + "  class=box style=\"background-color:" + cachedstyle.TBGCOLOR +";color:#aaaaaa\"  onblur=\"textboxhint(this,1)\" onfocus=\"textboxhint(this,0)\"  >");
              if (user.mydb || (user.roles & Systemroles.SYSTEMADMIN) >0 )
              { 
                 eletype += ' ';
                 elecount++;
              }
              out.println("</td></tr>");

              if (t == 'f') 
              {
                 out.println("<tr><td></td><td id=\"uploaded\">&nbsp;</td></tr>");  
              }                              
             nb++;
          }
          allname[kk++] = paras[i];
          if ( t == 'n')
          {
             paras[i] =  "parseFloat(f." + paras[i]  + ".value)";
          }
          else if ( t == 's')
          {
             paras[i] =  "f." + paras[i]  + ".value";
          }
          else  
          {
             paras[i] =  "f." + paras[i]  ; 
          }
       }
       if ( !args.equals("")) args += ",";
       {
            args += paras[i];
       }
    }
 
    String tt1 = opt.replaceFirst("\\(.*", "(")  + args + ")";

    out.println("</table><script type=text/javascript >document.write(round2);</script><table><tr><td id=\"thetoolbar\"  align=center><input type=hidden name=\"example\" value=\"\">"
    +"<input type=hidden name=\"wname\" value=\"" + name + "\" >");
    if (na>0)
    {
    %>

<nobr><%=Toolbox.emsgs(orgnum,358)%></nobr>
</td><td>
<select name=fontsize onchange="chnfontsize(this)"> 
<% for (int i=12; i <= 70; i+=2)
            {
                out.print("<option value=" + i);
                if (fontsizeind == i) out.println(" selected");
                out.println(">" + i +"px</option>"); 
            }%>
</select>
</td><td>
<!--input type=text name=old size=10 > </td><td>
<input type=button class=GreenButton   name=search value=FindNext onclick="findstrintextarea(document.form1.old.value)"></td><td>
<input type=text name=newstr size=10></td><td>
<input type=button  class=GreenButton   name=replace value=Replace onclick="replacestrintextarea(document.form1.newstr.value)"--></td><td>
  <%
     }
    
    out.println("<input class=GreenButton  type=button name=proceed  value=\"" + name + "\" onClick =\"" + tt1 + "\"></td>");
    if ( (user.roles & Systemroles.SYSTEMADMIN)>0 ||  user.mydb)
   {  
       out.println("<td><input  class=OrangeButton  type=button name=FDdvbew34  value=\""+Toolbox.emsgs(orgnum,36)+"\"   onClick =saveexample()></td>");
   } 
   if ( (user.roles & Systemroles.SYSTEMADMIN) > 0)
{
%>
<td><input class=OrangeButton   type=button name="FDdvbew6"  value="Send2All" onClick=send2all()> </td> 
<%
}
   out.println("</tr>");
}
else
{
    
   String [] paras = opt.split("&");
   int len = paras.length;
   allname = new String [ len ];
   if ( len > 0 )
   for (int i = 0; i < len; i++)
   {
     if ( paras[i] == null || paras[i].equals("")  )
        continue;
     if ( paras[i].indexOf("=") >= 0)
     {
        out.println("<input type=hidden name=\"" + paras[i].replaceFirst("=", "\" value=\"") + "\">");
     }
     else 
     {
          j = paras[i].indexOf('_');
          char t = 't';
          if (j >= 0 && j + 1 < paras[i].length()) 
             t = paras[i].toLowerCase().charAt(j+1);
          String type = "text";
          if (  t == 'p')
          {
               type= "password";
          }
          else if ( t == 'c')
          {
               type = "checkbox";
          }
          else if ( t == 'r')
          {
               type = "radio";
          }
          else if ( t == 'f')
          {
               type= "file";
               needupload = true;
          }
           eletype += t;
          elecount++;
          if (j == -1) 
              j = paras[i].length();
          paras[i] = paras[i].substring(0,j);
          if ( t == 'a') 
          {
              out.println("<tr>" + Toolbox.fields( paras[i],orgnum, cachedstyle) + "<td> <textarea name="+ paras[i]   + "  class=class" + ((fontsizeind-12)/2) +"  cols=60 rows=23></textarea></td></tr>");
              na++;
              out.println("<script type=text/javascript > asname[" + (asn++) + "] = \"" + paras[i] + "\";</script>");
          }
          else
          {
              out.println("<tr>" + Toolbox.fields( paras[i],orgnum, cachedstyle) +  " <td><input type="+ type + " name="+ paras[i]   + 
                      "   >");
              if (user.mydb || (user.roles & Systemroles.SYSTEMADMIN)>0)
              {
                eletype += ' ';
                elecount++;
              }
              out.println("</td></tr>"); 

              if (t == 'f') 
              {
                 out.println("<tr><td></td><td id=\"uploaded\">&nbsp;</td></tr>");  
              }     
              nb++;
          }
          allname[kk++] = paras[i];
     }
  }
 
%> 
<tr height=5><td colspan=2></td></tr> 
</table> <script type="text/javascript" >document.write(round2);</script>
<table cellpadding=0 cellpadding=0> 
<tr><td>
<input type=hidden name="example" value=""> 

<% 
 int colspan = 2; 
 if (na>0)
 {
     colspan+=4;
%>

<nobr><%=Toolbox.emsgs(orgnum,358)%></nobr> </td><td>
<select name=fontsize onchange="chnfontsize(this)"> 
<% for (int i=12; i <= 70; i+=2)
            {
                out.print("<option value=" + i);
                if (fontsizeind == i) out.println(" selected");
                out.println(">" + i +"px</option>"); 
            }%>
</select>
</td><td>
<!--input type=text name=old size=10 ></td><td>
<input type=button class=GreenButton   name=search value=FindNext onclick="findstrintextarea(document.form1.old.value)"></td><td>
<input type=text name=newstr size=10></td><td>
<input type=button  class=GreenButton   name=replace value=Replace onclick="replacestrintextarea(document.form1.newstr.value)"--></td><td>
<%}
 %>
 <input type=hidden name="wname" value="<%=name%>" >
 <% 
 if (needupload)
 {
     colspan+=1;
 %>
 <input class=OrangeButton    type=submit name="uploadbtn"  value="<%=Toolbox.emsgs(orgnum,647)%>" onClick="upload()" ></td><td>
 <%
 }
 %>
 <input class=GreenButton    type=button name="proceed"  value="<%=caption%>" onClick="go()" ></td><td>
<% 
if (user.mydb || (user.roles & Systemroles.SYSTEMADMIN) > 0)
{
%>
<input class=OrangeButton   type=button name="FDdvbew34"  value="<%=Toolbox.emsgs(orgnum,36)%>" onClick=saveexample()> </td><td>

<%
}
if ( (user.roles & Systemroles.SYSTEMADMIN) > 0)
{
%>
<input class=OrangeButton   type=button name="FDdvbew6"  value="Send2All" onClick=send2all()> </td><td>
<%
}
%>
</td>
</tr>

</table> 
<%}%> 

</form>

<% if (na > 0) {%>
    

<script   type="text/javascript"       src="findrep.js"></script>

<script type="text/javascript" >
    textareatobesearch=document.getElementsByTagName("textarea")[0];
</script>
<% } %>
<script type="text/javascript" >
var kk = <%=kk%>;
var allname = new Array(kk);
<% for (j = 0; j < kk; j++) {%>
allname[<%=j%>] = '<%=allname[j]%>';
<%}%>
var na = <%=na%>, nb = <%=nb%>;
var asn = <%=asn%>;
var font_size = <%=cachedstyle.fontsize%>;
var userid = "<%=user.id%>";
var eletype = "<%=eletype%>";
var name = '<%= name %>';
var tstmp = <%=tstmp%>;
<%= Toolbox.msgjspout((orgnum%65536)+user.id, true) %>

 
resizebut(document.form1,<%=cachedstyle.fontsize%>,false);
</script>
<script type="text/javascript"  src=usewebservice.js></script>
<script type="text/javascript"  src=curve.js></script>
</center>
<form rel=opener name="f3" method="post" action="usewebservice.jsp"  >
    <input type="hidden" name="Name" value="<%=name %>">
    <input  type="hidden" name="Caption"  value="<%=caption%>">
    <input type="hidden" name="Category" value="<%=category%>">
    <input  type="hidden" name="Description"  value="<%=des%>" >
    <input type="hidden" name="Handler" value="<%=handler%>">
    <input  type="hidden" name="Option"  value="<%=opt%>" >
    <input type="hidden" name="example" value="">
    <input  type="hidden" name="ButtonColor"  value="<%=butcolor%>">
</form>
<iframe name="w<%=tstmp%>" height="1" width="1" style="visibility:hidden" />
</body>
</html>
  