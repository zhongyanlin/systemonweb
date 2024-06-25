<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<!DOCTYPE html>
 <% int orgnum = Toolbox.setcharset(request, response);%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><title>TeaLeaMan Overview</title>
   
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb0.css" />
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >
document.write(unifontstyle(17));
</script>
</head>
<body style="color:black;">
<table  width="100%" height="42" align=center class="outset2"><tr valign=middle><td align=center><div class=forcurve1 id=titlediv style="color:#DC1111;font-size:24px;text-align:center"><b><NOBR>Overview of TeaLeaMan</NOBR></b></div></td></tr></table><table><tr height=5><td></td></tr></table>
<script type="text/javascript" >document.write(round1('100%'));</script>
<table class="outset3"><tr><td>
<% 
int kk = orgnum>>16;
   if (!Toolbox.locales[kk].hasfront)
   {
       kk = Toolbox.langnum;
       if (!Toolbox.locales[kk].hasfront)
          kk = 0;
   }
%>            
<jsp:include page='<%=Toolbox.langs[kk] + ".html" %>'  />
</td>
</tr>
</table>
<script type="text/javascript" >document.write(round2);</script>
<script type="text/javascript"  src="curve.js"></script>
</body>
</html>
