<%@ page  import="telaman.*,java.sql.*,java.util.*,java.io.*,java.util.regex.*,java.net.*" contentType="text/html;charset=utf-8"%>
<%
int orgnum = Toolbox.setcharset(request,response);%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
</head>
<body>
<%
String nowunit = Toolbox.defaultParam(orgnum, request, "nowunit", null);
if (nowunit!=null && nowunit.equals("@"))
{
    try{   
    out.println(Toolbox.emsgs(orgnum,1130));
    out.println(Toolbox.emsgs(orgnum,67)); 
    out.println("<br><form rel=opener name=f" + (orgnum  >>16) );
    out.println(" method=post action=newschool.jsp><input name=orgnum type=hidden value=\"" + orgnum + "\"><input name=nowunit style=\"border:1px #505050 solid;width:200px\"><input type=submit value=\"");
    out.println(Toolbox.emsgs(orgnum,36));
    out.println( "\" style=\"background:url(image/OrangeButton.gif);width:78px;color:white;border:1px #808080 outset\"></form>") ;
    }catch(Exception e){out.println(e.toString()+ " orgnum=" + orgnum );}
}
else if (nowunit!=null )
{
   if (nowunit.equals(""))
   {
       String str = "";
       for (int j=0; j < Toolbox.dbadmin.length; j++)
       {
           str += j + "," + Toolbox.dbadmin[j].unitname[orgnum>>16] + ";";
       }
    %><script>parent.showunitchoice('<%=str%>');</script> 
   <%}
   else if ( request.getParameter("patchcafield")!=null) 
   {
      boolean passed = CaptchaServlet.passed(request);
      if (passed)
      {
          int i = Toolbox.addDBAdmin(nowunit);
 
          %><script> parent.switchto1(<%=i%>);</script><%
      }
      else
      {
         %><script> parent.newunit("<%=nowunit%>",1);</script><%
      }
   }
   else
   {
        String orgnumstr = Toolbox.defaultParam(orgnum, request, "orgnum", ""+orgnum, null, 20);
        try{   
        orgnum = Integer.parseInt(orgnumstr);
        Toolbox.dbadmin[orgnum%65536].unitname[orgnum>>16] = Toolbox.dbadmin[orgnum%65536].unitname[orgnum>>16].replaceFirst("[^/]+",nowunit);
        String z = "Update DomainValue SET domainValue='" + nowunit.replaceAll("'","''") + "' WHERE domain='Site Name' and code=0 AND encoding='" + Toolbox.langs[orgnum>>16] + "'";
      
        Toolbox.dbadmin[orgnum%65536].exesql(z);
        out.println(Toolbox.dbadmin[orgnum%65536].error3 + " " + Toolbox.dbadmin[orgnum%65536].unitname[orgnum>>16]); 
        }catch(Exception e){out.println(e.toString());} 
   }
  
}
%>
</body>
</html>
