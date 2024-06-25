 
<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
long orderi = (System.currentTimeMillis()/1000)%100000;
//Toolbox.defaultParam(orgnum,request, "orderi", "20", null, 3);
String  title =  Toolbox.emsgs(orgnum,813); 
String  way = Toolbox.defaultParam(orgnum,request, "way", "", null, 2);
User user = null;
if ( (user = User.authorize(orgnum,Systemroles.TOTAL,application,session,request, response, "splitwin.jsp", true)) == null|| !Toolbox.verifytoken(request)) 
 return; 

%>
<!DOCTYPE HTML>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><%= Toolbox.getMeta(orgnum)%> 
    <title><%=title%></title>
</head> 
<% if (way.equals("1")) { %>
  
  <frameset rows="*,1" border="3" >
             <frameset cols="70%,*" >
             <frame   scrolling="auto"  name="upleft<%=orderi%>"  src="splitwin.jsp" />
             <frame   scrolling="auto"  name="uprig<%=orderi%>"   scr="blank.html" />
             
   </frameset>
   <frame name="lowerwin<%=orderi%>"  scrolling="no"   />
   </frameset></html>
<%} else if (way.equals("2")) { %>
   
   <frameset cols="550,*">
            <frameset rows="75%,*" >
            <frame  scrolling="auto"   name="upleft<%=orderi%>"  src="blank.html" />
            <frame  scrolling="auto"    name="uprig<%=orderi%>" src="blank.html" />
            </frameset>
   <frame name="lowerwin<%=orderi%>" scrolling="no" src="splitwin.jsp?orderi=<%=orderi%>"  />
  </frameset>
</html>

 <%} else if (way.equals("3")) { %>
 
      <frameset rows="40%,*">
            <frameset cols="75%,*" >
                <frame   scrolling="auto"  name="upleft<%=orderi%>"  src="blank.html" />
                <frame   scrolling="auto"  name="uprig<%=orderi%>" src="blank.html"/>
            </frameset>
            <frame name="lowerwin<%=orderi%>" src="blank.html" />
      </frameset>
   </html>
  <%} else if (way.equals("")) { %>
   
  <body>
      <form rel=opener  name="f"  method="POST" action="preview.jsp"  ></form>
 <script type="text/javascript" >
    <%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken = "<%=Toolbox.gentoken("splitwin.jsp","f")%>";
    var s = parent.parent.opener.document.form1.elements;
    var N = s.length;
    for (var i=0; i < N; i++)
    {
        var f = document.createElement('input');
        f.type = 'hidden';
        f.name = s[i].name;
        if (s[i].tagName.toLowerCase()=='select')
            f.value = s[i].options[s[i].selectedIndex].value;
        else
            f.value = s[i].value;
        document.f.appendChild(f);
    }
    
document.f.submit();
  </script>
  </body>
  </html>
  <%}%>



 
