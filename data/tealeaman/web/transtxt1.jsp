<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
  
 String sl =  Toolbox.defaultParam(orgnum,request,"sl","");
 
%> 
<!DOCTYPE HTML >
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<title><%=Toolbox.emsgs(orgnum,175)%></title> 
<%=Toolbox.getMeta(orgnum)%> 
</head><body bottommargin=0 bgcolor=<%= cachedstyle.DBGCOLOR %> >
<% if (sl.equals("")  ) 
{%>
<form rel=opener name="f" method="post" action="transtxt1.jsp"  > 
Source Language <input name="sl">  <input type="submit" name="submit" value="submit"></form>
<%} 
else
{ 
    int si=0,ti=0; 
    for (; si < Toolbox.langs.length; si++) 
       if (Toolbox.langs[si].equalsIgnoreCase(sl)) break;
     
    if (si == Toolbox.langs.length )
{%>
<form rel=opener name="f" method="post" action="transtxt1.jsp"  > 
Source Language <input name="sl"  value="<%=sl%>" >  <input   type="submit" name="submit" value="submit"></form>
<%} else {
    int N =  Toolbox.msgs[0].length; 
    out.print(  "<table border=1>");


    for (int i=0; i < N; i++)
    {
       String s = Toolbox.emsg(si,i); 
       String ts = ""; 
       if ( ti < Toolbox.langs.length) ts = Toolbox.emsg(ti,i);
       if (s == null){N = i; break;}

       out.println("<tr><td width=60>" + i + "</td><td>");
       
       String [] ss = new String[]{s};
       String ty = "";
       if (s!=null && s.length()>0 && s.indexOf("@")> 0 )
       {
           ss = s.split("@");
           ty = "@";
       }
       else if (s!=null && s.length()>0 && s.indexOf("\n")> 0 ) 
       {
           ss = s.split("\n");
           ty = "+  ";
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
       out.println(  ss[0]  );
        
       for (int j=1; j < ss.length; j++)
       {
           out.println( "</td></tr>\n<tr><td>" + ty + "</td><td>" +  ss[j]  );
       } 
 
       out.println("</td></tr>");
    }
 %> </table>  
 
<%
}
}
%>
      
</body>
</html>
