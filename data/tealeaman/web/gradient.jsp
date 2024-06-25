<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*,java.util.regex.*" %>
<%  int orgnum = Toolbox.setcharset( request, response); %>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
        <title></title>
    </head>
    <body>
    <%
      
      long t = System.currentTimeMillis() % 10000000;
      String startc =  Toolbox.validate( Toolbox.defaultParam(orgnum,request, ("startc"), null), null, 10);
      String endc   = Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("endc"), null), null, 10);
      String leng   = Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("leng"), null), null, 10);
      String orient   = Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("orient"), null), null, 10);
      String dir = Toolbox.installpath + File.separator + "image";
      String del = Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("del"), null), null, 10);
      if (del!=null)
      {
          String files[] = del.substring(1).split(",");
          for (int i=0; i < files.length; i++)
          (new File(dir+File.separator + "gradient",files[i])).delete();
          return;
      }
      File folder = new File(dir);
      String g = "";
      String rp ="repeat-";
      g = "1x" + leng  ;
      if (orient.charAt(0) =='h')
      {     
          rp+="y";
      }
      else
      { 
          rp+="x";
      }
      String option =  "\"" + dir + File.separator + "makegradient.bat\" " + g + " " +  startc + " " + endc + "  gradient/t" + t + ".gif " + orient;
      String  url = request.getRequestURL().toString().replaceFirst("gradient.*", "image/gradient/t" + t + ".gif");
      try
      {
         Runtime r = Runtime.getRuntime();
         Process proc = r.exec(option, null, folder);
         int exitVal = proc.waitFor();
         %>
         <script type="text/javascript" >parent.deliver('<%=url%>','<%=rp%>','<%=endc%>', <%=t%>);parent.alert('<%=url%>');</script>
         <%
      } 
      catch (Exception e)
      {
         %>
         <script type="text/javascript" >parent.alert('<%=e.toString()%>');</script>
         <%
      }
    
   %>
    </body>
</html>
