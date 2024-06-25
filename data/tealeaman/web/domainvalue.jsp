<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
String rdap = "domain"; 
String title = Toolbox.emsgs(orgnum,1440);
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR|Systemroles.STUDENT,application,session,request, response, "domainvalue.jsp", true)) == null|| !Toolbox.verifytoken(request)) 
 return;
CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
String dim = Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("dim"), null), null, 10);

int width = 800;
int height = 600;
try{ width=Integer.parseInt(dim.substring(0,3)); height = Integer.parseInt(dim.substring(3));} catch(Exception e){}
String left = "tlml" +  rdap;
String  right = "tlmr" + rdap;
String onbegin = Toolbox.urlencode("119");
String x;
String opt = "DataTable?exbut=cph";
String err="";
if (!Toolbox.verifytoken(request) ) return;
String y;
if ((x=Toolbox.defaultParam(orgnum,request, ("Domain"), null))!=null)
{
   if ((y=Toolbox.defaultParam(orgnum,request, ("y"), null))!=null)
   {
       String sql0 = "DomainValue;SELECT lastupdate,domain,domainValue,code,description,language FROM DomainValue;Docslang;SELECT lastupdate,domain,language,docs FROM Docslang";
       err = DataMove.importdata(user, sql0, "backup", true); 
   }
   
   if (!x.equals("0"))
   {
      String des = Toolbox.defaultParam(orgnum,request, ("Description"), null);
      if (des.toLowerCase().equals("document"))
      {
          out.println("<!DOCTYPE html>\n<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + cachedstyle.toString() + "<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum % 65536) + ".css\" />" +
                  "<script type=\"text/javascript\"   src=\"" + Toolbox.getUserLang(orgnum) + "\"><script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=\"text/javascript\"   src=cookie.js></script></head><body bgcolor="
              + cachedstyle.DBGCOLOR +">" + Toolbox.title(Toolbox.defaultParam(orgnum,request, ("Domain"), null)));
          String w = Toolbox.dbadmin[orgnum%65536].domainDocs(Toolbox.langs[orgnum>>16],x);
          if (w==null) w = "";
          out.println(w + "</body></html>");
          
      }
      else
      {
      out.println("<!DOCTYPE html>\n<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + cachedstyle.toString() + "<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum % 65536) + ".css\" />" +
                  "<script type=\"text/javascript\"   src=\"" + Toolbox.getUserLang(orgnum) + "\"><script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=\"text/javascript\"   src=cookie.js></script></head><body bgcolor="
              + cachedstyle.DBGCOLOR +">" + Toolbox.title(Toolbox.defaultParam(orgnum,request, ("Description"), null))
              + Toolbox.dbadmin[orgnum%65536].domainValue( Toolbox.langs[orgnum>>16], x, -1, 1).replaceAll(";",",").replaceFirst(",$","")
              +"<br>;<br>"
              + Toolbox.dbadmin[orgnum%65536].domainValue( Toolbox.langs[orgnum>>16], x, 0, -1).replaceFirst(",$","")); 
      if ((user.roles & Systemroles.SYSTEMADMIN) == 0 && y==null)    
          out.println("<br><center><input type=button class=GreenButton style=width:70px value=\"" + Toolbox.emsgs(orgnum, 29) + "\" onclick=\"updatei()\" ></center>");
      else
          out.println("<br><table border=1 style=border-collapse:collapse>" + err +"</table>");
      
          out.println("<script type=\"text/javascript\">parent.title=textmsg[696];\nfunction updatei(){open('domainvalue.jsp?Domain=" + x + "&y=1','_self');}</script>"
              +"<script type=\"text/javascript\"    src=curve.js></script></body></html>"
              );
      }
      return;
   }
}

%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">

<head><%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,1440)%></title>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("studentquizfrm.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>

<script>
function modify23(f,N)
{
   
   var NUMROWS = frames[0].passoverNUMROWS();
    
   for (var i=0; i < NUMROWS; i++)
       {
           var e = formselementbyname(f, i + "_3" );
           e.onclick = function()
           {
               var nm = this.name.split(/_/);
               var i = parseInt(nm[0]);
               var j = parseInt(nm[1]);
               var numRows = frames[0].passoverNumRows();
               if (i>=numRows)
               {
                   if (frames[0].retrv(i,1).toLowerCase() == 'document')
                      frames[0].defaultRecord[3] = "DataForm?rdap=domaindocs&exbut=cp&extraline=0&Serverlang=" + escape('<%=Toolbox.langs[Toolbox.langnum]%>';
                   else
                      frames[0].defaultRecord[3] = "DataTable?rdap=domainvalue&exbut=cp&Serverlang=" + escape('<%=Toolbox.langs[Toolbox.langnum]%>');  
               } 
               else
               {
                   if (frames[0].retrv(i,1).toLowerCase() == 'document')
                   {
                       frames[0].setv(i, 3,"DataForm?rdap=domaindocs&exbut=cp&extraline=0&Serverlang=" + escape('<%=Toolbox.langs[Toolbox.langnum]%>');
                       frames[0].mat[i][3] = "DataForm?rdap=domaindocs&exbut=cp&extraline=0&Serverlang=" + escape('<%=Toolbox.langs[Toolbox.langnum]%>';
                   }
                   else
                   {
                       frames[0].setv(i, 3, "DataTable?rdap=domainvalue&exbut=cp&Serverlang=" + escape('<%=Toolbox.langs[Toolbox.langnum]%>')); 
                       frames[0].mat[i][3] = "DataTable?rdap=domainvalue&exbut=cp&Serverlang=" + escape('<%=Toolbox.langs[Toolbox.langnum]%>');
                   }
               }    
               frames[0].openit2(i,3);
           }
       }
}
</script>
</head>

 
<frameset cols="55%,*"  border=0px >
<frame name="tlmldomain"  scrolling="auto"   src="<%=opt%>&rdap=domain&Serverlang=<%=Toolbox.urlencode(Toolbox.langs[Toolbox.langnum])%>&onbegin=<%=onbegin%>&subdb=" />
<frame name="tlmrdomain"  scrolling="auto"     />
</frameset>

</html>
