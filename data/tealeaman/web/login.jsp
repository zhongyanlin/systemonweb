 
<%@ page import="telaman.*,java.sql.*,java.util.*,java.util.regex.*,java.io.*" %> 
<%!
long getCurrentTimezoneOffset() 
{
    TimeZone tz = TimeZone.getDefault();  
    Calendar cal = GregorianCalendar.getInstance(tz);
    long offsetInMillis = tz.getOffset(cal.getTimeInMillis());
    return offsetInMillis;
} 
%>
<%
    int orgnum =  Toolbox.setcharset(request,response);
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>"> 
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%
    if (orgnum == -1) 
    {
        return;
    }
  
 
   

String error =  Toolbox.defaultParam(orgnum,request,"error",null, ",():,\"'", 100 );
String follow  = Toolbox.defaultParam(orgnum,request,"follow","", "@#?/+", 500);
 
String id = Toolbox.defaultParam(orgnum,request,"id","", "_@", 30);
String id1 = id;
if (id1.equals(""))
{
   id1 = Toolbox1.GetCookie(request, (orgnum%65536)+ "uid");
   if (id1 == null) id1 = ""; 
}
String password =  Toolbox.defaultParam(orgnum,request,"password",null);
String pubkeys =  Toolbox.defaultParam(orgnum,request,"pubkeys",null, "$", 200);
String fromself = Toolbox.defaultParam(orgnum,request,"fromself", null, null, 20);
String subdb = Toolbox.defaultParam(orgnum,request,"subdb",null, null, 30);
String zpcrpt =  Toolbox.defaultParam(orgnum,request, ("zpcrpt"), null);
String ismobile =  Toolbox.defaultParam(orgnum,request, ("mobile"), null); 
boolean logindone = false;
String contextPath = request.getContextPath();
  
int status = 0;
if (error == null) 
    error ="";//"purple:" +Toolbox.emsgs(orgnum,9) + "<a href=DataForm?rdap=register>" + Toolbox.emsgs(orgnum,10) + "</a>";
else if (error.equals("generic"))
    error=  Toolbox.emsgs(orgnum,11);
String style = Toolbox.butstyle(Toolbox.defaultFontSize).replaceFirst("background:[^\\)]+\\);", "border:0px;");
Webform w= null;
String rdap="";
long timenow = System.currentTimeMillis();
long tstmp = timenow % 10000000;
String mode = "frontend";
int numoftries = 0, MAXTRIES = 2;
try{numoftries = Integer.parseInt((String)session.getAttribute("numoftries"));}catch(Exception e){} 
if (follow.equals("logout")) 
{
    mode = "logout";
}
 
if (password!=null && !password.equals(""))
{
    mode = "backend";
    
}
 
if (mode.equals("logout"))
{ 
    User user = (User)(session.getAttribute("User"));
    out.println(Toolbox.getMeta(orgnum));
    User copyuser = null;
    if (user!=null  && user.lastbackup >=0 && user.backupperiod>=0 && timenow - user.lastbackup >= user.backupperiod)
    {
         
        copyuser = new User(orgnum, user.id, "", user.roles, user.dbinfo, user.timeformat);
        copyuser.changedb(user.id); 
        copyuser.webFileFolder = user.webFileFolder;
        copyuser.lastbackup = user.lastbackup;
        copyuser.backupperiod = user.backupperiod;
    }
  String numoftriestr = Toolbox.defaultParam(orgnum, request, "numoftries", null);
  if (numoftriestr!=null)session.setAttribute("numoftries",numoftriestr);
    
  for (Enumeration e = request.getAttributeNames(); e.hasMoreElements();)
  {
      String nm = (String)(e.nextElement());
      session.removeAttribute(nm);
  }
  session.removeAttribute("User");
  session.invalidate();
 
if (id.equals(""))
  {
      
%>
</head><body><script type="text/javascript" > if (parent==self) {document.location.href="index.jsp?1"; } else if (parent!=null) parent.document.location.href="index.jsp?1";</script></body></html>
<%
  }

 else
  {
%>
 </head><body><script type="text/javascript" > parent.document.location.href="index.jsp?0"; </script></body></head>
<%      
  }
  if (copyuser!=null) 
  {
      LongFilePro.periodback(request,copyuser, orgnum);
  }
  
  return ;
}
  
    if (mode.equals("backend")) {
        if (numoftries >= MAXTRIES) {
            boolean passed = true;
            String remoteAddr = request.getRemoteAddr();
            passed = CaptchaServlet.passed(request);

            if (passed == false) {
                mode = "frontend";
                error = Toolbox.emsgs(orgnum,1464);
            }

        }
    }

  
    if (mode.equals("backend")) {
        boolean sessionactive = false;
        User user1 = (User) (session.getAttribute("User"));
        out.println(Toolbox.getMeta(orgnum));
        if (user1 != null && user1.id.equals(id)) {
            sessionactive = true;
        }
        User user = new User(orgnum);
        boolean b = true;

     

        if (!Toolbox.verifytoken(request)) {
            return;
        }
     
        user.id = id;
        user.password = password;
        user.sessionid = session.getId();
        b = sessionactive;
        user.subdb = subdb;
        user.orgnum = orgnum;

        if (b == false) {

            String url;
            if (false
                    && // Toolbox.dbadmin[orgnum%65536].localnopass   && 
                    ((url = request.getRequestURL().toString()).indexOf("//localhost") > 0 || url.indexOf("//127.0.0.1") > 0)) {
                b = user.retr();
            } else {
                b = user.login(orgnum);
            }
            logindone = true;
            user.orgnum = orgnum;
            user.timeformat = Toolbox.defaultParam(orgnum, request, "zonedif", "0 0", " ", 20);
            // if (!b) b = user.id.equals("admin") && request.getRequestURL().toString().indexOf("//localhost")>=0  && user.retr();
        }
        
        if (b == false) {
            error = user.error();
            numoftries++;
            if (numoftries < 8) {
                error = Toolbox.emsgs(orgnum,794);
                session.setAttribute("numoftries", "" + numoftries);
                mode = "frontend";
            } else {
                response.sendRedirect(contextPath + "/" + "forgetpass.jsp?id=" + id);

                return;
            }
        } else {
            session.removeAttribute("numoftries");

            if (sessionactive == false) 
            {
                if ((user.roles
                        & (Systemroles.INSTRUCTOR | Systemroles.SYSTEMADMIN
                        | Systemroles.SYSTEMANALYST | Systemroles.REGISTER)) > 0) {
                    user.roles = user.roles | Systemroles.STUDENT;
                }
                user.keys = pubkeys;
                
                session.setAttribute("User", user);
             /*   String log = request.getRemoteHost() + " "
                        + request.getRemoteAddr() + " "
                        + request.getRemoteUser() + ":"
                        + Toolbox.makeFullName(user.lastname, "", user.firstname) + ":"
                        + user.id + " "
                        + Toolbox.timestr(System.currentTimeMillis() / 1000) + " "
                        + user.keys + "\r\n";
                FileWriter wri = new FileWriter(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "log.txt", true);
                wri.write(log);
                wri.close();*/
            }
          
            if (follow.equals("Q")) {
                String query = (String) (session.getAttribute("wcds"));
                if (query != null) {
                    int kk = query.indexOf(" ");
                    user.changedb(query.substring(0, kk));
                    StringBuffer str = new StringBuffer();
                    Save.process(user, null, query.substring(kk + 1), null, null, null, str,cachedstyle);
                    out.println(str);
                    session.removeAttribute("wcds");

                    return;
                }
            } 
else if (follow.equals("R1")) {
%>
</head>
<body>
<script type="text/javascript" > 
   onunload = null;
   opener.parent.redoexpired();
    
</script>
</body>
</html>
<%
    return;
}
else if (follow.equals("R")) {
%>
</head>
<body>
<script type="text/javascript" > 
   onunload = null;
   var jj = 1;
   if(opener!=null&&typeof(opener.redoexpired)=='function')
   {
       jj =2;
       opener.redoexpired(window);
       if (parent == window)
       {  
          var win=window.open("","_top","","true");
          win.opener=true;
          win.close(); 
       }
   }
   else if(window!=parent&&typeof(parent.redoexpired)=='function')
   {   
       jj =3;
       parent.redoexpired();
   }
   else if(parent.frames!=null&&parent.frames.length>1&&typeof(parent.frames[0].redoexpired)=='function')
   {
       jj = 4;
       parent.frames[0].redoexpired();
   }
   else
   {
       jj = 5;
       if (parent == window) 
           document.location.href = "index.jsp";
        
   }
    
</script>
 <%= Toolbox.emsgs(orgnum,1599)%>
</body>
</html>
<%
    return;
             }
else if (follow.equals("U")) {

                String ff = (String) (session.getAttribute("Unfulfiled"));
                session.removeAttribute("Unfulfiled");
                if (ff != null) 
                {
                    response.sendRedirect(contextPath + "/" + ff);
                    return;
                }
            } else if (follow.equals("SYN")) {
%>
         <title><%=Toolbox.emsgs(orgnum,175)%></title> 
         <script type="text/javascript" > 
         if (window.name.replace(/[w[0-9]+/,'') == '')
             parent.syn();
         else
             opener.syn(); 
         </script>
         <%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
         </head>
         <body bgcolor=<%= cachedstyle.DBGCOLOR%> >
         <center>
<%=Toolbox.title(Toolbox.emsgs(orgnum,39))%>
         <br><br><%=Toolbox.emsgs(orgnum,812)%>.  
         <br>
         </body></html>
<%

    return;
} else if (follow.equals("") == false) {
    String jcode = null;
       
    try {
        jcode = (new Encode6b(orgnum)).rto6b(follow);
 
        if (jcode.indexOf("(") < 0) {
            jcode = null;
        }
    } catch (Exception e) {
 
    }
 
    if (jcode == null) 
    {
        if (zpcrpt != null) 
        {
            follow += "?zpcrpt=" + zpcrpt;
        }
        
        response.sendRedirect(contextPath + "/" + follow);
        
        return;
    } else {
%>
</head><body>
<script type="text/javascript" > 
<%=jcode%>; 
</script>
</body>
</html>
<%

        return;
    }
} else if (user.roles == 0 && user.lastname.equals("go") && user.firstname.equals("player") && user.middlename.equals("game")) {%>
         <title><%=Toolbox.emsgs(orgnum,175)%></title> 
         <script type="text/javascript" > 
         if (window.name.replace(/[w[0-9]+/,'') == '')
             parent.document.location.href="go.jsp";
        </script>
<%

               return;
           }
     
     follow  = "index.jsp" ;
     if (  user.roles == Systemroles.STUDENT)
     {
            if (subdb != null) 
                subdb = "?subdb=" + Toolbox.urlencode(subdb);
            else
                subdb="";
            if (Toolbox.dfserver!=null)
            {
                NotifyFsever nf = new NotifyFsever(Toolbox.dfserver,user.id);
                nf.start();
            }
            follow  ="studentpage.jsp?orgnum=" + orgnum + "&sid=" + user.id; 
            if (ismobile!=null && ismobile.equals("1")) 
{
    if (follow.contains("?")) 
       follow += "&mobile=1";
    else 
       follow += "?mobile=1";  
} 
            out.println(follow);
            response.sendRedirect(contextPath + "/" + follow);
 
     }
     else 
     {

            if (Toolbox.dfserver!=null)
            {
                NotifyFsever nf = new NotifyFsever(Toolbox.dfserver,user.id);
                nf.start();
            }
            follow = Toolbox1.GetCookie(request,"myindexway");
            if (follow ==null) follow = "index.jsp";  
           // follow = follow.replaceFirst("index.jsp[\\?]?[0-9]?$", "index.jsp?2");
            response.sendRedirect(contextPath + "/" + follow);
               
     }
 
    
	 //  response.sendRedirect(contextPath + "/" + follow);
      
      return; 
   }
}

error = Generic.handle(error);
follow = Generic.handle(follow);
String securitytoken = Toolbox.gentoken("login.jsp","f1");

out.println(Toolbox.getMeta(orgnum)); 
String tstr = Toolbox.timestr(timenow/1000,"MM/DD/YYYY hh:mm:ss"); 
%>
 

<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=securitytoken%>";var sessionid = "<%=session.getId()%>";</script>
<title><%=Toolbox.emsgs(orgnum,175)%></title>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >
var tzid = <%=getCurrentTimezoneOffset()%>;
var timenow = <%=timenow%>;
var timenowstr0 = '<%= tstr%>';
document.write(unifontstyle(<%=Toolbox.defaultFontSize%>));
</script>
<script type="text/javascript"  src=sha1.js ></script>
<style type="text/css">
A:visited
{
    COLOR: blue;
    TEXT-DECORATION: none
}
A:hover
{
    COLOR: purple;
    TEXT-DECORATION: underline
}
</style>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
</head>
<body  bgcolor=<%= cachedstyle.DBGCOLOR %> >
<%=Toolbox.title(Toolbox.emsgs(orgnum,778))%>
 
<br>
<form rel=opener  name="f1" method=post  action=login.jsp autocomplete="off" onsubmit="return validate()"   >
<input type="hidden" name="securitytoken" value="<%=Toolbox.gentoken("login.jsp","f1")%>" >
<input name=follow type=hidden value="<%=follow%>">
<input name=error type=hidden value="<%=error%>">
<input type=hidden name=pubkeys>
<input type=hidden name=fromself value=1>
<%if (subdb!=null) {%>
<input name=subdb type=hidden value="<%=subdb%>" >
<%}

%>
<input name="timedif" type="hidden" onload="javacript:this.value=''+(<%=tstmp/1000%>-parseTime('<%=tstr%>','MM/DD/YYYY hh:mm:ss'));alert(this.value)"  >
<table cellpadding="1"  border="0" align=center id="mainlogin"><tr><td>
<script type="text/javascript" >document.write(round1('100%'));</script>
<table cellpadding="1" id="entries" border="0"  cellspacing="3" class=outset3 width=290 align=center>
      
<tr> <td colspan=3 align=center id="loginhtr" style="color:red"> <%= (numoftries>0)?(""+(numoftries+1)):"" %>  <%= error%>  <td> </tr>

 
<tr> <td colspan=3> &nbsp; <td> </tr> 
<tr> <td width=10></td> <%=Toolbox.fields(Toolbox.emsgs(orgnum,190),orgnum, cachedstyle)%>
<td > 
<% if (zpcrpt!=null){%><input type="hidden" name="zpcrpt" value="<%=zpcrpt%>" > <%}%>
<input name="id" style="border:1px #b0b0b0 solid !important;width:120px;font-size:16px" type="text" name="id" value="<%= id1 %>" size="20" maxlength="20" tabindex=1> </td>
</tr>
<tr> <td width=10></td>
<%=Toolbox.fields(Toolbox.emsgs(orgnum,164),orgnum, cachedstyle)%>  
<input name="mobile" type="hidden">
<td > <input type="hidden" name="password">
<input name="password1" style="border:1px #b0b0b0 solid !important;width:120px;font-size:16px" type="password"   size="20" maxlength="100" tabindex=2> 
 </td>
</tr>
<% if (numoftries >= MAXTRIES) { %>
<tr> 
 <td colspan=2 style="padding:0px 0px 0px 15px"> 
 <img src="patchca.png" alt="<%=Toolbox.emsgs(orgnum,1463)%>"  style="cursor:pointer;vertical-align:text-bottom;height:22px;line-height:22px;" onclick="this.src=this.src+'?'+Math.random();">
 </td>
 <td><input type="text" name="patchcafield"   style="border:1px #b0b0b0 solid !important;width:120px;font-size:16px" ></td>
</tr>
<% } %>

<tr> <td align=center colspan=3>
<input type="submit" class=BlueButton <%=style%>  name="submitbtn" value="<%=Toolbox.emsgs(orgnum,39)%>" size="8" >
<font size=2> <a href=javascript:forgetpass()><%=Toolbox.emsgs(orgnum,1125)%> </a> </font> 
 
</td>
</tr> 
 
</table>
<script type="text/javascript" >document.write(round2);</script>
</td>
</tr> 
</table> 
<input type="hidden" name="securitytoken" value="<%=securitytoken%>" >
</form> 
<script type="text/javascript"  src="timeformat.js"></script>
<script type="text/javascript"  src="login.js"></script>
 <script type="text/javascript"  src=curve.js></script>
 <script>
 var thisislogin = true;
 if (opener!=null && typeof(opener.justopened) =='function')
 {
     opener.justopened(window,false);
 }
 else if (parent!=window && typeof(parent.justopened) == 'function')
 { 
     parent.justopened(window,false);
 }
 
</script>
</body>

</html>

