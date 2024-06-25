<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
int orgnum = Toolbox.setcharset(request,response);
 
User user = null;
%>
<!DOCTYPE html>
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
    <%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript">var orgnum=<%=orgnum%>,beheading='<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>', securitytoken="<%=Toolbox.gentoken("tablemake.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>

</head>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head> 
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>translate </title>
    </head>
    <body>
        <table border="1">
            <tr>
                <td colspan="1"  width="300"> Front-End Phrases</td>
            </tr>  
            <tr>
                <td>Chinese</td>
             </tr> 
            <%
            for (int i=0; i < Toolbox.msgs[0].length; i++)
               out.println("<tr><td>" + Toolbox.emsgs(orgnum,i)+ "</td></tr>");
            %>
            
            <tr>
                 <td colspan="1" width="300"> Back-End  Phrases</td>
            </tr>  
            <tr>
                <td>Chinese</td>
            </tr>  
            <script> 
             for (var  i=0; i < textmsg.length; i++)
               document.write("<tr><td>" + textmsg[i] + "</td></tr>");
            </script>
        </table>
    </body>
</html>