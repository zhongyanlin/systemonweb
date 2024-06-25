<%@ page contentType="text/html; charset=utf-8" import="telaman.*, java.sql.*, java.util.*, java.io.*" %>
<%
    
    
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
    CachedStyle cachedstyle = new CachedStyle(request, orgnum);
    (new  File(Toolbox.installpath + File.separator + "sent.html")).delete();
    StringBuilder sb = new StringBuilder();
    sb.append("<table><tr><td>&nbsp;</td></tr><tr><td><table align=center  style=\"border-radius:4px;border:1px #b0b0b0 outset;background-color:" + cachedstyle.DBGCOLOR + ";\" cellspacing=1 cellpadding=3 >");
        sb.append("<tr><td valign=top style=\"background-color:" + cachedstyle.BBGCOLOR + ";font-size:16px;font-family:" + Toolbox.fontsnamestr(orgnum>>16) + "\">" + Toolbox.emsgs(orgnum,14) 
                + "</td><td bgcolor=white  style=\"background-color:" + cachedstyle.BBGCOLOR + ";font-size:16px;font-family:" + Toolbox.fontsnamestr(orgnum>>16) + "\">" + Toolbox.emsgs(orgnum,867) + "</td></tr>");
        
        Enumeration e1 = request.getParameterNames();
        while (e1.hasMoreElements()) {
            String na = (String)e1.nextElement();
           
            String va = Toolbox.defaultParam(orgnum,request, (na), null);
            //va = Toolbox.c2c(va);
             
            sb.append("<tr><td valign=top style=\"background-color:" + cachedstyle.BBGCOLOR + ";font-size:16px;font-family:" + Toolbox.fontsnamestr(orgnum>>16) + "\">" + na + "</td><td bgcolor=white>" + va + "</td></tr>");
        }    
    sb.append("</table>");

if (orgnum == -1) orgnum = Toolbox.langnum<<16;
User user = null;
  
if ( Toolbox.msg == null || Toolbox.msg.length < 100)
{
    if (orgnum>=0)
    Toolbox.dbadmin[orgnum%65536].phase = - 1;
}
if (Toolbox.dbadmin[orgnum%65536].phase == 3)
{
   if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.SYSTEMADMIN,application,session,request, response, "cfgdb.jsp", true)) == null)
   {
        sb.append("no authorized");
        Toolbox1.writebytes("sent.html", "<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body>" + sb + "</body></html>"); 
        return;
   }
   orgnum = user.orgnum;
}

user = User.authorize(orgnum, Systemroles.SYSTEMADMIN,application,session,request, response, "cfgdb.jsp", true);

String UserId = Toolbox.defaultParam(orgnum,request,"UserId",null, null, 20);
      
if (UserId!=null && !UserId.equals("") )
{
    String ServerURL = Toolbox.defaultParam(orgnum,request,"ServerURL","", ",/\\;=?:-_", 100);
    String JDBCDriver = Toolbox.defaultParam(orgnum,request,"JDBCDriver","", null, 60);
    String DBUserid = Toolbox.defaultParam(orgnum,request,"DBUserid","", null, 20);
    String DBPassword = Toolbox.defaultParam(orgnum,request,"DBPassword","", "!@#$%^&*()-_+={}{[]|\\;:\"'<,>.?/", 40);
    JDBCAdapter adapter = null; 
    
    if (DBPassword.equals(""))
    {
        adapter =  Toolbox.getSysAdapter(user.orgnum);
        int n = 0;
        boolean bb = adapter.executeQuery2("SELECT dbpassword FROM DBOwner WHERE id='"+ UserId + "'",false);
        String err = ""; 
        if (!bb || adapter.getValueAt(0,0)==null)
        {
            err = adapter.error();
            adapter.close();
        }
        else
        {
            DBPassword = adapter.getValueAt(0,0); 
            adapter.close();
            adapter = new JDBCAdapter(ServerURL,JDBCDriver, DBUserid,DBPassword, orgnum);
            err = adapter.error();
            
            if (err.equals("")) 
            {
                String query = "SELECT id  FROM AppUser WHERE (roles mod " + (2*Systemroles.SYSTEMADMIN) + ") >= " + Systemroles.SYSTEMADMIN;
                n = adapter.executeQuery(query);
                //user.id = "admin";
                //user.dbinfo = new DBConnectInfo(ServerURL, JDBCDriver, DBUserid,DBPassword, orgnum);
                //session.setAttribute("User",user);
                err = "OK(admin:" + adapter.getValueAt(0,0) + ")";
                adapter.close();
            }
            else if (JDBCDriver.indexOf("h2")>=0)
            {
               adapter.close();
               try{ Class.forName("org.h2.Driver");
                Connection conn = DriverManager.
                getConnection(ServerURL,DBUserid,DBPassword);
                err = "Created One.";
               }catch(Exception e){}
            }
            else adapter.close();
        }
        %>
    <!DOCTYPE html>
    <html lang="<%=Toolbox.langs[orgnum>>16]%>"><head> 
    <META HTTP-EQUIV="Pragma" CONTENT="no-cache">
    <%=Toolbox.getMeta(orgnum)%>
    <script type="text/javascript">parent.myprompt('<%=err.replaceAll("'"," ").replaceAll("\n"," ") %>');</script>
    </head><body></body></html>
        <%
    }
    else 
    {
         adapter = new JDBCAdapter(ServerURL,JDBCDriver, DBUserid,DBPassword,orgnum);
         String err = adapter.error();
         adapter.close();
         if (err.equals("")) 
             err = "OK";
    %>
   <!DOCTYPE html>
    <html lang="<%=Toolbox.langs[orgnum>>16]%>"><head> 
    <META HTTP-EQUIV="Pragma" CONTENT="no-cache"> 
    <%=Toolbox.getMeta(orgnum)%>
    <script type="text/javascript">parent.myprompt('<%=err.replaceAll("'"," ").replaceAll("\n"," ")%>');</script>
    </head><body></body></html> 
   <% 
    }

   sb.append("Test Connection");
   Toolbox1.writebytes("sent.html", "<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body>" + sb + "</body></html>");   
   return;
  
}
if (user!=null)
sb.append("user=" + user.toString());         
      
String which = Toolbox.defaultParam(orgnum,request,"which","", null, 10);
 
//reverse: reverse to factory setting
//encoding at Toolbox.dbadmin[user.orgnum%65536]=-1 selected an encoding, set phase=0
//registered at Toolbox.dbadmin[user.orgnum%65536]=2: set phase=3 reload index.jsp
//blank at phase=-1: select encoding
//blnak at phase=0: initial setting, choose db
//blank at phase=1: fill out db
//blank at phase=2: register admin
//blank at phase=3: login
//i: fill out db
//1,2,..3: set i-th db
//N:
//N+1:
//N+2:
if (which.equals("reverse"))
{
   File delf = new File(Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "conf" + File.separator + "dbhost" + user.orgnum + ".crp");
   delf.delete();
   Toolbox.dbadmin[orgnum%65536].dbFileFolder = null;
   Toolbox.dbadmin[orgnum%65536].phase  = -1;
   which = "";
}
String doctype = "";
if (Toolbox.msg !=null && Toolbox.emsgs(orgnum,287)!=null)
    doctype = "  PUBLIC " + Toolbox.emsgs(orgnum,287);

if ( Toolbox.dbadmin[orgnum%65536].phase == -1)
{
   if (which.equals(""))
   {%>
    <!DOCTYPE html"<%=doctype%>">
    <html lang="<%=Toolbox.langs[orgnum>>16]%>"><head> 
    <META HTTP-EQUIV="Pragma" CONTENT="no-cache">
    <%=Toolbox.getMeta(orgnum)%>
    <script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("cfgdb.jsp","f1")%>";</script>
    <style type="text/css"> 
     td{background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>}
    .td{background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>;font-weight:700}
    </style>
    </head>
    <body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 0px 5px"  >
     Enter the path to a folder which can be used to store database file (make sure the folder is writable)  
        
<form rel=opener name="f1" method="post" action="cfgdb.jsp"   >
 <input value="<%=Toolbox.installpath.replaceFirst("[a-b|A-Z|0-9]+$","dbFileFolder") %>" name=dbfolder > 
 <input type="submit"  value="Submit" name=which value="dbfolder" onclick="document.f1.submit()" >   
</form>

     
    </body>
</html>

<% }  
else if (which.equals("dbfolder"))
{
%>
      <!DOCTYPE html"<%=doctype%>">
    <html lang="<%=Toolbox.langs[orgnum>>16]%>"><head> 
    <META HTTP-EQUIV="Pragma" CONTENT="no-cache">
    <%=Toolbox.getMeta(orgnum)%>
    <script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("cfgdb.jsp","f1")%>";</script>
    <style type="text/css"> 
     td{background-color:<%=cachedstyle.TBGCOLOR%>}
    .td{background-color:<%=cachedstyle.BBGCOLOR%>;font-weight:700}
    </style>
    </head>
    <body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 0px 5px"  >
 <%   
  
      String dbfolder = Toolbox.defaultParam(orgnum,request, "dbfolder", null);
      File f = new File(dbfolder);
      if ( f.exists() == false)
      {
          if (f.mkdir())
          {
              Toolbox.dbadmin[orgnum%65536].dbFileFolder = dbfolder;
              AppContextListener.initit(Toolbox.langs[orgnum>>16]); 
          }
          else
          { 
              %>
             System can not create <%=dbfolder %> because of lack of permission. Make another one.
        
<form rel=opener name="f1" method="post" action="cfgdb.jsp"   >
 <input value="<%=Toolbox.installpath.replaceFirst("[a-b|A-Z|0-9]+$","dbFileFolder") %>" name=dbfolder > 
 <input type="submit"  value="Submit" name=which value="dbfolder" onclick="document.f1.submit()" >   
</form>  
          <%}
      }
      else
    {
        Toolbox.dbadmin[orgnum%65536].dbFileFolder = dbfolder;
        AppContextListener.initit(Toolbox.langs[orgnum>>16]); 
    }
    if (f.exists())  out.println("Good now. <a href=index.jsp>Index</a>");
%>
    </body></html>
<% 
   
   }
   else if (which.equals("") == false && !which.equals("Submit"))
   {
      
      Toolbox.dbadmin[orgnum%65536].phase = 0;
      String str = Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "conf" + File.separator + "encoding.txt";
      FileWriter fw = new FileWriter(str,false);
      fw.write(which);
      fw.close();
      
      AppContextListener.initit(which);
       
      %>
      <script type="text/javascript" > document.location.href="index.jsp";</script>
      <%
   }
   
   return;
}
else if (Toolbox.dbadmin[orgnum%65536].phase == 2 )
{
   if (which.equals("registered")  )
   {
      session.removeAttribute("User");
      Toolbox.dbadmin[orgnum%65536].phase = 3;
      
      %>
      <!DOCTYPE html>
      <html lang="<%=Toolbox.langs[orgnum>>16]%>">
      <head><%=Toolbox.getMeta(orgnum)%><title></title>
       
      <script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("cfgdb.jsp","f1")%>";</script>
      <script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
      </head>
      <body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 0px 5px"  >
      <script type="text/javascript" >
      
      document.location.href="index.jsp";
      </script>
      </body></html>
      <%
      return;
   }
}

 
int N = Toolbox.dbadmin[orgnum%65536].numHosts + 1;
 
Toolbox.dbadmin[orgnum%65536].dbphase(null);
String systemdbms = "";
String systempassword = "";
String systemserver = "";
String systemdriver = "";
String systemuser = "";
String localaddr = request.getLocalAddr();
 
boolean islocal = true;
if (localaddr!=null && request.getRemoteAddr()!=null) 
     islocal = localaddr.equals(request.getRemoteAddr());
String style= "width:70px;";//margin:0px 0px 0px 0px";

boolean logedin = false;

 

long tstmp = System.currentTimeMillis()%10000000;


int whichnum = -1;
if (which !=null)
   try{ whichnum = Integer.parseInt(which);}catch(Exception e){}
 

String dbmsg = "";
 
if (which.equals(""))
{
String err = Toolbox.dbadmin[orgnum%65536].dbphase(null);
if (  Toolbox.dbadmin[orgnum%65536].phase == 0)
{
    user = new User(orgnum);
    user.roles = Systemroles.SYSTEMADMIN;

    dbmsg = "<tr><td width=800 >(<b><a href=\"javascript:myprompt('" + err.replaceAll("'"," ").replaceAll("\n"," ") + "')\" >No db</a></b>)" + Toolbox.emsgs(orgnum,1262) +"</td></tr>";
    String os = System.getProperty("os.name");
    if (os.indexOf("Windows") >= 0 && Toolbox.dbadmin[orgnum%65536].odbc(null).equals("") )
        dbmsg += " <tr  ><td  width=800 ><br>Microsoft Access " + Toolbox.emsgs(orgnum,173) +" (<span style=background-color:" + cachedstyle.BBGCOLOR +">" + Toolbox.emsgs(orgnum,291) + "</span>:access <span style=background-color:" + cachedstyle.BBGCOLOR +">"
          + Toolbox.emsgs(orgnum,174) + "</span>: jdbc:odbc:" + Toolbox.appname + "sys <span style=background-color:" + cachedstyle.BBGCOLOR +">"
          + Toolbox.emsgs(orgnum,338) + "</span>: sun.jdbc.odbc.JdbcOdbcDriver <span style=background-color:" + cachedstyle.BBGCOLOR +">"
          + Toolbox.emsgs(orgnum,339) + "</span>: systemadmin <span style=background-color:" + cachedstyle.BBGCOLOR  + ">"
          + Toolbox.emsgs(orgnum,164) + "</span>: "+Toolbox.appname + " ) " + Toolbox.emsgs(orgnum,954)  
          + "<input name=but1 value=\"" + Toolbox.emsgs(orgnum,1267)  + "\" type=button onclick=adapt() " + style + " class=OrangeButton style=width:70px >"
          + ". " +  Toolbox.emsgs(orgnum,1263) + ". "
          + Toolbox.emsgs(orgnum,1557)  + "</td></tr>";
    else
        dbmsg += "<tr><td  width=800 >"+ Toolbox.emsgs(orgnum,1557)  + "</td></tr>";
}
else if (  Toolbox.dbadmin[orgnum%65536].phase == 1)
{
    user = new User(orgnum);
    user.roles = Systemroles.SYSTEMADMIN;
    //session.setAttribute("User", user);
    dbmsg = "<tr  height=50 ><td align=center width=800  ><script type=\"text/javascript\" >if (document.location.search=='?1') document.write('" + Toolbox.emsgs(orgnum,71)
            +". ');else document.write('(blank db)');</script><form rel=opener name=f3 style=\"margin:5px 0px 0px 0px\" method=post action=cfgdb.jsp?which=i target=w" + tstmp +" onsubmit=\"return careful();\"   >" + Toolbox.emsgs(orgnum,1259)
            +"<input name=but value=\"" + Toolbox.emsgs(orgnum,1268)  + "\" type=submit  " + style +" class=RedButton ></form></td></tr>";
}
else if (  Toolbox.dbadmin[orgnum%65536].phase == 2)
{
    //if(Generic.storedProc.size()==0)
    Toolbox.dbadmin[orgnum%65536].hasSysDB();
    user = new User(orgnum);
    user.roles = Systemroles.SYSTEMADMIN;
    //session.setAttribute("User", user);
    dbmsg += "<tr height=50 ><td align=center  width=800 ><script type=\"text/javascript\" >if (document.location.search=='?1') document.write('" + Toolbox.emsgs(orgnum,71)
            +". ');else document.write('(No admin)');</script>" + Toolbox.emsgs(orgnum,1261)
            +"<input name=but value=\"" + Toolbox.emsgs(orgnum,602)
            +"\" type=button " + style +" class=GreenButton onclick=\"window.open('DataForm?numrows=1&subdb=&rdap=register1&exbut=ph&role="
          + Systemroles.SYSTEMADMIN + "&cellonfocus=1&onsaved=2')\"> </td></tr>";
}
else if ( (user = User.authorize(orgnum, Systemroles.SYSTEMADMIN,application,session,request, response, "cfgdb.jsp", true)) == null)
{
   
    return;
}
else
{
    style=Toolbox.butstyle(Toolbox.defaultFontSize);
    logedin = true;
}

} // end of which==''
else
   logedin = true;
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><%=Toolbox.getMeta(orgnum)%>
    <title><%=Toolbox.emsgs(orgnum,336)%></title>
 

<%
if (which!=null && which.equals("i"))
{//initialization
    if (islocal || logedin)
    {
        Toolbox.dbadmin[orgnum%65536].fillSysDB(null,cachedstyle);
        int i = Toolbox.dbadmin[orgnum%65536].hasSysDB(); 
        String str = Toolbox.dbadmin[orgnum%65536].error().replace('\\', '/').replaceFirst(">", " target=_blank>");
        str += "<br><br><a href=\"cfgdb.jsp\">Refresh this page</a><br><a href=\"index.jsp\">" + Toolbox.emsgs(orgnum,1334) + "</a>";

        %>
        </head>
        <body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 0px 5px"  >
        <script type=\"text/javascript\" >
            parent.myprompt('<%=str%>'); 
        </script>
        </body></html>
       <%
    }
    else
    { %>
       </head>
        <body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 0px 5px"  >
         <script type=\"text/javascript\" >parent.myprompt('" + Toolbox.emsgs(orgnum,1265) +"');</script>
        </body></html> 
      <%
    }
   sb.append("Test has db" );
   Toolbox1.writebytes("sent.html", "<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body>" + sb + "</body></html>");   
   return;
     
}
else if ( whichnum == N+1 ||  whichnum == N+2 )
{ 
    
   if(islocal || logedin  )
   {
      out.print(Toolbox.title(Toolbox.emsgs(orgnum,328)));
      int j = 0, k = 0, u=0;
      try{ j = Integer.parseInt(Toolbox.defaultParam(orgnum,request,"active","")); }catch(Exception e){}
      try{ u = Integer.parseInt(Toolbox.defaultParam(orgnum,request,"asmain","")); }catch(Exception e){}
      for (int i=0; i < N; i++)
      {
       
           if (Toolbox.defaultParam(orgnum,request,"dbms" + i,"").equals("")==false &&
              (whichnum == N+1 ||  Toolbox.defaultParam(orgnum,request,"del" + i,"").equals("")))
          {
          Toolbox.dbadmin[orgnum%65536].dbhost[k].dbms = Toolbox.defaultParam(orgnum,request,"dbms" + i,"", null, 20);
 
          Toolbox.dbadmin[orgnum%65536].dbhost[k].host = Toolbox.defaultParam(orgnum,request,"host" + i,"", "\\/@#$+:?~;=-_", 150);
 
          Toolbox.dbadmin[orgnum%65536].dbhost[k].driver = Toolbox.defaultParam(orgnum,request,"driver" + i,"", null, 50);
 
          Toolbox.dbadmin[orgnum%65536].dbhost[k].admindb =  (Toolbox.defaultParam(orgnum,request,"admindb" + i,"",null, 20));
 
          Toolbox.dbadmin[orgnum%65536].dbhost[k].uid =  (Toolbox.defaultParam(orgnum,request,"user" + i,"", null,20));
 
          String tt =  Toolbox.defaultParam(orgnum,request, ("password" + i), null);
          if (tt!=null) Toolbox.dbadmin[orgnum%65536].dbhost[k].password = Toolbox.decrypt(tt,orgnum);
          Toolbox.dbadmin[orgnum%65536].dbhost[k].asmain = (u == i)?"1":"0";
          Toolbox.dbadmin[orgnum%65536].dbhost[k].active = (j == i)?"1":"0";
          if (u == i)
          {
              systemdbms = Toolbox.dbadmin[orgnum%65536].dbhost[k].dbms; 
              systemserver = Toolbox.dbadmin[orgnum%65536].dbhost[k].host + Toolbox.dbadmin[orgnum%65536].dbhost[k].admindb;
              sb.append("systemserver=" + systemserver);
              systemdriver = Toolbox.dbadmin[orgnum%65536].dbhost[k].driver;
              systemuser = Toolbox.dbadmin[orgnum%65536].dbhost[k].uid;
              systempassword = Toolbox.dbadmin[orgnum%65536].dbhost[k].password;
          }
          k++;
          }
      }
 
      Toolbox.dbadmin[orgnum%65536].defaultdbms = Toolbox.dbadmin[orgnum%65536].dbhost[j].dbms;
      Toolbox.dbadmin[orgnum%65536].numHosts = k;
      String err0 = Toolbox.dbadmin[orgnum%65536].setsystemdb(systemdbms, systemserver, systemdriver, systemuser, systempassword);
      sb.append(err0);
        if (err0.equals(""))
        {
           
          out.print(Toolbox.emsgs(orgnum,328));
          if (whichnum == N+1)  
          {
               Toolbox.dbadmin[orgnum%65536].hasSysDB();
               
          }
          if (user!=null)
          {
                String sql = "UPDATE DBOwner SET server='" + systemserver + "', driver='" + systemdriver + "', dbuserid='" + systemuser + "', dbpassword='" +
          systempassword + "' where id='" + user.id + "'";
                user.dbinfo = Toolbox.dbadmin[orgnum%65536].sysDBConnectInfo();
                JDBCAdapter adapter =  Toolbox.getSysAdapter(orgnum);
                adapter.executeUpdate(sql);
                err0 = adapter.error();
                if (!err0.equals(""))
                {
                    adapter.close();
                    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
                    sb.append(err0);
                    Toolbox1.writebytes("sent.html", "<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body>" + sb + "</body></html>");   
                    return;
                }
                err0 = adapter.error() + Toolbox.dbadmin[orgnum%65536].writedbs();
                adapter.close(); 
                sb.append("err=" +  err0);
                 
          }
          else
          {
              sb.append("user==null" );
          }
           %>
          </head>
          <body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 0px 5px"  >
          <script type=\"text/javascript\" >
              parent.alert('<%=Toolbox.emsgs(orgnum,71) + systemserver %>');
              parent.document.location.href=('cfgdb.jsp?1');
          </script>
          </body></html>
          <%
            
        }
        else
        {
            sb.append(err0); 
             Toolbox.dbadmin[orgnum%65536].error3 = "";
           %>
           </head>
          <body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 0px 5px"  >
          <script type="text/javascript" >
              parent.myprompt('<%=Toolbox.dbadmin[orgnum%65536].error3  + err0%>');
          </script></body></html> 
          <% 
        }
   }
   else
   {
        %>
          </head>
          <body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 0px 5px"  >
          <script type="text/javascript" >parent.myprompt('<%=Toolbox.emsgs(orgnum,1265)%>');</script>
          </body></html>
       <%
   }
    
   Toolbox1.writebytes("sent.html", "<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body>" + sb + "</body></html>");   
   return;
   

}
 
else if (  whichnum < N && whichnum >=0 )
{
   if ( islocal || logedin )
   {
     
    String admindb = Toolbox.defaultParam(orgnum,request,"admindb"+which,"", null, 20); 
    systemdbms = Toolbox.defaultParam(orgnum,request,"dbms"+which,"", null, 20);
    String tt =  Toolbox.defaultParam(orgnum,request,"password"+which,null,null, 200);
 
    if (tt!=null) systempassword = Toolbox.decrypt(tt,orgnum);
    else systempassword = Toolbox.dbadmin[orgnum%65536].dbhost[whichnum].password;
    systemserver = Toolbox.defaultParam(orgnum,request,"host"+which,"", ",/\\;=?:-_", 100) + admindb;
    systemdriver = Toolbox.defaultParam(orgnum,request,"driver"+which,"",null,50);
    systemuser = Toolbox.defaultParam(orgnum,request,"user"+which,"",null,20);
    String msg = null;
    try
    {
         sb.append("systempassword=" + systempassword);
         sb.append("systemserver=" + systemserver);
         msg = Toolbox.dbadmin[orgnum%65536].testSystemdb(systemdbms, systemserver , systemdriver,systemuser, systempassword);
    }
    catch(Exception e)
    {
           msg = e.toString();
    } 
    msg = msg.replaceFirst("\\s$", "");%>
      
    </head>
          <body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 0px 5px"  >
           <script type="text/javascript" >
               parent.myprompt("<%=Generic.handle(msg)%>");
           </script>
          </body></html>
      <%
   }
   else
   {   %>
      
    </head>
          <body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 0px 5px"  >
           <script type="text/javascript" >
              parent.myprompt('<%=Toolbox.emsgs(orgnum,1265) %>');
           </script></body></html> 
      <%
   }
   sb.append("change some host's info" );
   Toolbox1.writebytes("sent.html", "<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body>" + sb + "</body></html>");   
   return;
}
else
{
   sb.append("front page" );
   Toolbox1.writebytes("sent.html", "<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body>" + sb + "</body></html>");   
   
%>
<style type="text/css">

    A:link
    {
    COLOR: blue;
    TEXT-DECORATION: none
    }
    A:visited
    {
    COLOR: blue;
    TEXT-DECORATION: none
    }
    A:hover
    {
    COLOR: #ff0000;
    TEXT-DECORATION: underline
    }
    input.BG {background-color:<%=cachedstyle.TBGCOLOR%>;border:0}
    input.BG1 {background-color:<%=cachedstyle.TBGCOLOR%>; border:0;text-align:right}

</style>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("cfgdb.jsp","form1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
<script type=text/javascript  src=cookie.js></script>
<%   out.print(Toolbox.unifontstyle(cachedstyle.fontsize,orgnum));%>
</head>
 <body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 0px 5px"  >
           
<center>


<table   align=center cellpadding=0 cellspacing=0 >
<%=Toolbox.title(Toolbox.emsgs(orgnum,328),1)%>


<%=dbmsg %>

<tr><td>
<form rel=opener name=form1 method=post action=cfgdb.jsp  style="margin:5px 0 0 0" onsubmit="return validate()"   >
<input   type="hidden" name=systemserver  value="<%=Toolbox.dbadmin[orgnum%65536].systemserver%>"  >
<input   type="hidden"  name=systemdriver  value="<%=Toolbox.dbadmin[orgnum%65536].systemdriver%>" >
<input    type="hidden"  name=systemuser  value="<%=Toolbox.dbadmin[orgnum%65536].systemuser%>"   >
<input  type="hidden"  name=systempassword  value=""   disabled> 
<input  type="hidden"  name=dummy  value=""  >  

       
<div    style="border:2px #696969 solid; background-color:#b0b0b0;border-radius:4px;margin:2px 0px 5px 0px">     
<table  align="center" cellspacing=1 cellpadding=1  class="outset3"  id="dbtable">


<tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>"> 
    <td  align="center" ></td>
<td  ><%=Toolbox.emsgs(orgnum,291)%></td>
<td  ><%=Toolbox.emsgs(orgnum,341)%></td>
<td  ><nobr><%=Toolbox.emsgs(orgnum,342)%></nobr></td>
<td   ><nobr><%=Toolbox.emsgs(orgnum,343)%></nobr></td>
 
<td  ><nobr><%=Toolbox.emsgs(orgnum,344)%></nobr></td>

<td  ><nobr><%=Toolbox.emsgs(orgnum,164)%></nobr></td>
<td  align=center><nobr><%=Toolbox.emsgs(orgnum,321)%></nobr></td>
<td  align=center><nobr><%=Toolbox.emsgs(orgnum,1425)%></nobr></td>
<td  align=center><nobr><%=Toolbox.emsgs(orgnum,1426)%></nobr></td>
<%
StringBuffer a = new StringBuffer();
for (int i = 0 ; i < N && Toolbox.dbadmin[orgnum%65536].dbhost[i]!=null; i++)
{
     
    if (Toolbox.dbadmin[orgnum%65536].dbhost[i].host.contains(":h2:") && (new File(Toolbox.dbadmin[orgnum%65536].dbhost[i].host.substring(8))).exists()==false )
    {
     if (Toolbox.dbadmin[orgnum%65536].dbFileFolder!=null )
        Toolbox.dbadmin[orgnum%65536].dbhost[i].host = "jdbc:h2:" + Toolbox.dbadmin[orgnum%65536].dbFileFolder + File.separator;
     else
        Toolbox.dbadmin[orgnum%65536].dbhost[i].host = "jdbc:h2:~" + File.separator;
    }
    DBHost x = Toolbox.dbadmin[orgnum%65536].dbhost[i];
     
    x.totablerow(a,orgnum,cachedstyle.TBGCOLOR);
    String b = a.toString().replaceAll("_N",""+i) +"\n";
  
    out.print(b);
    a.setLength(0);
}
JDBCAdapter adapter =  Toolbox.getSysAdapter(orgnum); 
String alluserids = ""; 

{
int n = 0;
boolean bb = adapter.executeQuery2("SELECT id FROM AppUser where password=''",false);
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
}

for (int i=0; bb && adapter.getValueAt(i,0)!=null; i++)
{
    n++;
    if (!alluserids.equals("")) alluserids += ", ";
    alluserids += adapter.getValueAt(i,0);
}
 
adapter.close();
}
%>


</table></div>
 
<table id=butpane align="center" class="outset1" width="100%" style="padding:3px 3px 3px 3px"><tr  ><td    align=center valign=middle>
            
<input name=submit2 type=submit value=<%=Toolbox.emsgs(orgnum,36)%> style=width:70px class=OrangeButton   onclick="setback(<%=N+1%>)">
<input name=submit4 type=submit value=<%=Toolbox.emsgs(orgnum,30)%>   style=width:70px class=RedButton    onclick="setback(<%=N+2%>)">
 </td></tr></table>
 <input name=which type=hidden>
</form> 
 <br>
    </td></tr>
<tr><td>
<div id=nopass class="outset1" style="margin:5px 0px 0px 0xp;width:800px">
<%
if (!alluserids.equals("")) out.println(Toolbox.emsgs(orgnum,1513).replaceFirst("#",alluserids));
%> 
</div>
    </td></tr>
        <tr><td>
    <a href="javascript:reverse()"><%=Toolbox.emsgs(orgnum,1350)%></a>
    </td></tr>
<tr><td> <center>
     <nobr><font style="font-size:12px" color=<%=cachedstyle.IBGCOLOR%> > <%= Toolbox.copyright[orgnum>>16]%></font> </nobr>
 </center> 
</td></tr>
</table>
 
<img name=tstimg src="image/blank.gif" width=100% height=1>
<script type="text/javascript"  src=encryption.js></script>
<script type="text/javascript" >
buildactmenu = function()
{
    recurainput(document.getElementById('butpane'));
}
var theurl = "<%=Toolbox1.geturl(request)%>"; 
var tbl  = document.getElementById("dbtable");
for (var i=1; i < tbl.rows.length; i++)
{
    tbl.rows[i].cells[2].childNodes[0].style.height = tbl.rows[i].cells[0].offsetHeight + 'px';
    tbl.rows[i].cells[4].childNodes[0].style.height = tbl.rows[i].cells[0].offsetHeight + 'px';
}
document.getElementById('nopass').style.width = tbl.offsetWidth + 'px'; 
 
function failupload(s)
{
    if (s!=null) myprompt(s);
    document.form2.upload.disabled = false;
    document.form2.upload.style.cursor = "normal";
     
}
function goupload()
{
    
    if (document.form2.localpath.value == '')
    {
        document.form2.localpath.focus();
        myprompt('Enter path');
        return;  
    }
    
    formnewaction(document.form2);
    document.form2.upload.style.cursor = "wait";
    
    visual(document.form2);
document.form2.submit(); 
}
function syn(z,explicit)
{
   myprompt(explicit);
}
 
var tstmp = <%=tstmp%>;
function reverse()
{
   myprompt("<%=Toolbox.emsgs(orgnum,1351)%>", null, "if(v)reversedo()","");
}
function reversedo()
{
   document.location.href="cfgdb.jsp?which=reverse";
}
if (document.location.toString().indexOf("localhost") >= 0
    && typeof (handleErr) == 'undefined')
{
function handleErr(msg, url, l)
{
      var txt= "There was an error on this page.\n\n"
       + "Error: " + msg + "\n"
       + "URL:   " + url + "\n"
       + "Line:  " + l + "\n\n"
       + "Click OK to continue.\n\n";
       alert(txt);
      window.onerror = handleErr;
      return true;
}
window.onerror = handleErr;
}
 
serCharSize(<%=Toolbox.locales[orgnum>>16].charsize%>);
<%
   if (Toolbox.decrsa[0] == null)
   {
    Toolbox.decrsa[0] = new MyRSA(128,(byte)1);
            Toolbox.decrsa[0].init();
            Esign.signrsastr =  Toolbox.decrsa[0].toString();
            Toolbox.decrsa[1] = new MyRSA(Esign.signrsastr,(byte)2);
          //  Toolbox.decrsa[1].csize = Toolbox.decrsa[1].csize/2; 
}
    %>
setServerkeys('<%=Toolbox.decrsa[Toolbox.locales[orgnum>>16].charsize-1].publickey()%>');
var font_size = <%=cachedstyle.fontsize%>;
var ff = document.form1;
var tbl = document.getElementById("tbl1");
var server = '<%=Toolbox.dbadmin[orgnum%65536].systemserver%>';
var N = <%=N%>;
 
 
function careful()
{
    var tt = confirm('<%=Toolbox.emsgs(orgnum,1260)%>');
    if (tt == false) return false;
    var nav = window.open("","w<%=tstmp%>");
    return true;
}

 

function validate()
{
    var i = parseInt(ff.which.value);
    if (i == N+2 && confirm(textmsg[252]) == false)
       return false;
     
    ff.target =  "w<%=tstmp%>";
    return true;
}

 

function adapt()
{
   ff.active.value = "0";
   ff.asmain.value = "0";
   ff.which.value="<%=N+1%>";
   ff.target = "w<%=tstmp%>"
   formnewaction(ff);
   
  visual(ff);
 ff.submit();
}

 
function searchit(j)
{
    var alldbms = new Array(N+1);
    <% for (int i=0; i < N-1; i++)
       {
           out.print("alldbms[" + i  +"] = '" + Toolbox.dbadmin[orgnum%65536].dbhost[i].dbms + "';");
       }
    %>
    alldbms[N-1] = document.form1.dbms<%=N-1%>.value;
    alldbms[N] = '<%=Toolbox.dbadmin[orgnum%65536].systemdbms%>';
    if (alldbms[j]=='access')
        myprompt('Use only sun.jdbc.odbc.JdbcOdbcDriver');
    else
        window.open("http://www.google.com/search?q=" + alldbms[j] + "+JDBC+Driver", "seacwi", dim(600,600));
}
  
var dynameiccell = null;
var dynameichn = '';

function allbull(i)
{
   var z = '';
   for (var j=0; j < i; j++) 
       z += "&bull;";
}
function editbox(hn, td)
{
   setback();
   td.id = hn;
   dynameiccell = td;
   dynameichn = hn;
   var x = document.createElement("input");
   if (hn.indexOf("password")>=0)
       x.type = "password";
   else
       x.type='text';
   var w = '';
   if( td.tagName.toLowerCase() == 'td')
       w = td.offsetWidth;
   else
       w = 250;
   x.style.cssText = "width:"  + w +"px;font-size:<%=cachedstyle.fontsize%>px;border:1px #b0b0b0 solid";
   if (hn.indexOf("password")<0)
   {
       x.value = td.innerHTML;
   }
   else
   {
       x.value = '';
   }
   td.innerHTML = '';
   td.appendChild(x);
   td.onclick = null;
   x.id = 'dynamicbx';
   x.onblur = function(){this.value = removejs(this.value);}
   x.focus();
}
function setback(NN)
{
   if (dynameiccell!=null)
   dynameiccell.onclick = function(){editbox(this.id,this);}
   if (NN!=null) document.form1.which.value=NN;
   if (dynameichn=='' )return;
   var bx = document.getElementById('dynamicbx');
   if (bx == null) return;
   bx.value = bx.value.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
   for (var i=0; i < ff.elements.length; i++)
   {
       if (ff.elements[i].name == dynameichn ) 
         break; 
   }
   if (i < ff.elements.length) 
   {
       
       if (dynameichn.indexOf("password")>=0)
       {
           passwords[i] = ff.elements[i].value;
          // if (bx.value!='')
           {
           ff.elements[i].disabled = false;
           ff.elements[i].value = encryptString(bx.value);
           } 
            
       }    
       else
          ff.elements[i].value = bx.value;  
   }
    
   if (dynameichn.indexOf("password")>=0) 
   {
      
       var z = '';
      // if (bx.value!='')
       {
           for (var i=0; i < bx.value.length; i++)
               z += '&bull;';
       }
      // else
       {
         //  z = "&bull;&bull;&bull;&bull;&bull;&bull;";
       }
       dynameiccell.removeChild(bx);
       dynameiccell.innerHTML = z;
   }    
   else
   { 
       dynameiccell.removeChild(bx);
       dynameiccell.innerHTML = ff.elements[i].value;
   }
   var j = parseInt(dynameichn.replace(/[^0-9]/g,''));
   
   dynameichn = '';
}
var passwords = [];

resizebut(document.form1,font_size);
resizebut(document.form2,font_size);
 
<%=Toolbox.msgjspout((orgnum%65536)+user.id,true)%>

</script>
<%}%>
<script type="text/javascript"  src=curve.js></script>
<iframe name="w<%=tstmp%>" width="500" height="300" style="visibility:hidden"/>

</body>
</html>
