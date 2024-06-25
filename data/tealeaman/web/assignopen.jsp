<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
    User user = (User)(session.getAttribute("User"));
%>
<%! 
  String unescape(String x){return x.replaceAll("\\+"," ").replaceAll("%.."," ");}
%> 
<% 
 
String url=  Toolbox.defaultParam(orgnum,request,"url","", "@#$%+?-_", 300);
String atype=  Toolbox.defaultParam(orgnum,request,"atype","", null, 10);
String ob=  Toolbox.defaultParam(orgnum,request,"ob","",null, 5);
String code=  Toolbox.defaultParam(orgnum,request,"code","", "!@#$%^&*|+;:\"',/", 20);
String norepeat=  Toolbox.defaultParam(orgnum,request,"norepeat","", null, 20);
String bigscreen=  Toolbox.defaultParam(orgnum,request,"bigscreen","0", null, 20);
%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">

<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,286)%></title>
</head>
<%
if (Toolbox.defaultParam(orgnum,request, ("step"), null)==null)
{
  if (atype.equals("2")) 
  {
      url = "assignopen.jsp?step=1&ob=" + ob +"&code=" + code +"&url=" + Toolbox.urlencode(url);
  }
  else
  {
      url = "assigndoc.jsp?" + url;
  }

  %>
  <frameset rows="40%,*"> 
  <frameset cols="75%,*" > 
   <frame name="upperleft"  src="<%=url%>" /> 
   <frame name="upperrig" /> 
  </frameset>
  <frame name="lowerwin" /> 
  </frameset>
  <%
   
}
else
{
   int titleindex = url.indexOf("&coursetitle=");
   int titleindex1 = url.indexOf("&", titleindex + 14);
   String title = unescape(url.substring(titleindex + 13,titleindex1));

   titleindex = url.indexOf("assignname=");
   titleindex1 = url.indexOf("&", titleindex + 12);
   String name = unescape(url.substring(titleindex + 11,titleindex1));
%>

 <%=Toolbox.title(title + ": " + name)%>
 <body bgcolor=<%=cachedstyle.DBGCOLOR%> style="margin:5px 5px 0px 5px">
 <%=cachedstyle.toString()%><link rel=stylesheet  type="text/css" href=styleb<%=orgnum%>.css /> 
 <script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("assignopen.jsp","f1")%>";</script>
 <center> 
 <form rel=opener name=form1 method=post action="assigndoc.jsp?<%=url%>" 
      onsubmit="return parent.opener.checkedc(this)" style="margin:5px 0px 0px 0px">
 <table  class=outset1> 
 <tr><td>&bull; <%=Toolbox.emsgs(orgnum,5)%><%=Toolbox.emsgs(orgnum,1256)%>
    <input type=checkbox style=background-color:transparent name=confirm  >
 </td></tr>
 
 <% if ( ob.equals("false")) 
 {%>
    <tr><td>&bull; <%=Toolbox.emsgs(orgnum,1534)%><%=Toolbox.emsgs(orgnum,1256)%>
    <input type=checkbox style="background-color:transparent" name=confirm   >
    </td></tr> 
 <%}%>
    
 <% if ( code.equals("true")) 
 {%>
     <tr><td align=center><%=Toolbox.emsgs(orgnum,998)%> <input name=code></td></tr>  
 <%}%>
  <tr height=5px><td> </td></tr> 
  </table>
  <input class=OrangeButton  style=background-color:orange   type=submit name=submit value="<%=Toolbox.emsgs(orgnum,6)%>" >
  <input class=GreenButton    style=background-color:#00BBBB  type=button name=cancel value="<%=Toolbox.emsgs(orgnum,169)%>" 
          onclick="parent.close()"> 
  </form>  
             
  <script type="text/javascript" > 
        
        <% 
           if ( code.equals("true")) 
        {%> 
               document.form1.code.focus();
       <%} 
          else 
       {%>
              document.form1.confirm[0].focus();
       <%}
       %> 
  </script>
 
 <script type="text/javascript"  src=curve.js></script>

</body>
<%}%>
</html> 