<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.net.*,java.util.*,java.io.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
%>
<%!
static Pattern anchor = Pattern.compile("<[A|a][^<]+<");
String full(String addr, String sname)
{
   String [] a = addr.split("/");
   String [] b = sname.split("/");
   String ans = "";
   int j=0; while (b[j++]=="..")j++;
   for (int i=0; i < a.length - j - 1; i++)
      if (i==0) ans = a[i];
      else ans += "/" + a[i];
   for (; j < b.length; j++)
      ans += "/" + b[j];
   return ans;
}
boolean samedomain(String a, String b)
{
   int i = a.indexOf("//");
   int j = a.indexOf("/",i+2);
   if (j==0) return b.indexOf(a)==0;
   return b.indexOf(a.substring(0,j)) ==0;
}

TreeSet build (String init, String addr, TreeSet linked)
{

   TreeSet r = new TreeSet();
   try{
   URL url = new URL(addr);
   String content = (String)(url.getContent());
   Matcher m = anchor.matcher(content);
   int e = 0;
   while (m.find(e))
   {
       int s = m.start();
       e = m.end();
       String href = content.substring(s,e-1);
       int j = href.toLowerCase().indexOf("href=") + 5;
       int k;
       if (href.charAt(j)=='"')
       {
          j++;
          k = href.indexOf("\"", j+1)-1;
       }
       else
       {
         k = href.indexOf(" ");
       }
       href = href.substring(j,k);
       if (href.indexOf("(")<0)
       {
          r.add(full(addr,href));
       }
    }
    for (Iterator t=r.iterator(); t.hasNext();)
    {
      String urli = (String)(t.next());
      if (urli.equals(init))
         linked.add(addr);
      if (samedomain(urli, init))
          build(init, urli, linked);
     }


   }catch(Exception ex){};
   return r;
}
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Cross Reference</title>
    </head>
    <body>
        <h1>Cross Reference</h1>

   <%
      String url = Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("url"), null), "%/#?@+", 100); 
   %>
   <form rel=opener name="f" method="get" action="crossref.jsp?mode=1"  > Address <input name="url" size="30" value="<%=url==null?"":url%>" ><input type="submit" name="sub" value="go"></form>
   <%
   if (url!=null && !url.equals(""))
   {
   TreeSet linkdedfrom = new TreeSet();
   TreeSet linksto = build(url, url, linkdedfrom);

   %>
   Links to <br>
   <%
   for (Iterator t=linksto.iterator(); t.hasNext(); )
   {
      out.println((String)(t.next()) + "<br>");
   }
   %>
   <br>
   Linked from <br>
   <%
   for (Iterator t=linkdedfrom.iterator(); t.hasNext(); )
   {
      out.println((String)(t.next()) + "<br>");
   }
   }
   %>
   </body>
</html>
