<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
User user = (User)session.getAttribute("User");
String code6b = request.getParameter("c");
int orgnum = Toolbox.setcharset(request, response);
String subdb=null,semester=null,course=null,sessionname=null,assignname=null,code=null; 
 
StringBuffer backto = new StringBuffer();

if (code6b!=null)
{
    int k = code6b.indexOf("-");
   
    if (k == -1)
    {
    out.println("<html><body>Invalid link<!--k=-1--></body></html>");
    return; 
    }
    try{orgnum = Integer.parseInt(code6b.substring(0,k));}catch(Exception e){
       out.println("<html><body>Invalid link<!--" + code6b.substring(0,k) + "--></body></html>");
       return;  
    }
    try{
    String y = Unicode6b.decode(code6b.substring(k+1));
 
    String x[] = y.split("\\|");
    if (x.length<5)
    {
       out.println("<html><body>Invalid link<!--" + y + "--></body></html>");
       return;   
    }
    //backto.append("'orgnum=" + orgnum + "'&");
    backto.append("'subdb=" + x[0] + "'&");
    backto.append("'semester=" + x[1] + "'&");
    backto.append("'course=" + x[2].replace("'", "''") + "'&");
   
    backto.append("'sessionname=" + x[3].replace("'", "''") + "'&");
    backto.append("'assignname=" + x[4].replace("'", "''") + "'");
    subdb = x[0];
    semester= x[1];
    course = x[2];
    sessionname = x[3];
    assignname = x[4];
    if (x.length>5) 
    {
        code = x[5];
        backto.append("'&code=" + x[5].replace("'", "''") + "'");
    }
    else code =  Toolbox.defaultParam(orgnum,request,"code", "","!@#$%^&*+()|\\{}[]:;\"',/",20);
     
    }catch(Exception e){
       out.println("<html><body>Invalid link<!--" + e.toString() + "--></body></html>");
       return;   
    }
    String keystr = (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + sessionname; 
   
}
else
{
    orgnum =  Toolbox.setcharset(request,response);
    if (orgnum>-1){
    subdb = Toolbox.defaultParam(orgnum,request, ("subdb"),null,null,20);
    course = Toolbox.defaultParam(orgnum,request, ("course"), null,"-_",20);
    semester = Toolbox.defaultParam(orgnum,request, ("semester"), null,null,20);
    assignname = Toolbox.defaultParam(orgnum,request, ("assignname"), null);
    sessionname = Toolbox.defaultParam(orgnum,request, ("sessionname"), null);
    code =  Toolbox.defaultParam(orgnum,request,"code", "","!@#$%^&*+()|\\{}[]:;\"',/",20);
    }
}


if (orgnum == -1)
{
    out.println("<html><body>Invalid link: invalid orgnum</body></html>");
    return; 
}

%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>" > 
<%
String keys = request.getParameter("keys");

if ( keys != null) 
{    
if ( (user = User.authorize(orgnum,  Systemroles.SYSTEMADMIN | Systemroles.SYSTEMANALYST | Systemroles.INSTRUCTOR,
application,session,request, response, "assigntest.jsp", true)) == null )  
{
     return;
}
semester = Toolbox.defaultParam(orgnum,request, ("semester"), Toolbox.dbadmin[orgnum%65536].currentSemester,null,20); 
boolean justbuilt = false; 
if (keys.equals("build"))
{
     justbuilt = true; 
     
     
     StringBuffer sb = new StringBuffer();
     String query =   "SELECT distinct Assignment.course, Assignment.name, Assignment.sessionname,Session.name, Assignment.start, Assignment.due,atype,options,latepermit  from Assignment, Session where Assignment.course=Session.courseid AND Assignment.atype < 4   AND Session.instructor='" 
     + user.id +"' AND  Session.semester='" +  semester  + "'  AND Assignment.semester='" + semester
     + "' AND (Assignment.sessionname LIKE CONCAT('%,',Session.name) OR Assignment.sessionname LIKE CONCAT(Session.name,',%') OR Assignment.sessionname LIKE CONCAT('%,',Session.name,',%') OR Assignment.sessionname=Session.name ) order by Assignment.course,Session.name, Assignment.start, Assignment.name, Assignment.sessionname"; 
     user.changedb(user.id);
     
     JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
 
     boolean bb  = adapter.executeQuery2(query,true);
     String xx;
    
     for (int j=0; bb && (xx=adapter.getValueAt(j,0))!=null; j++) 
     {
         
         String keystr =  xx + "|" +  adapter.getValueAt(j,1)+ "|" +     adapter.getValueAt(j,2);
         
         String   infostr = adapter.getValueAt(j,4) + "," +
                adapter.getValueAt(j,5)+ "," + 
                adapter.getValueAt(j,6)+ ",'" +
               (new AssOption(adapter.getValueAt(j,7),orgnum)).shorter().replace("'","''")+ "','" +
                adapter.getValueAt(j,8) + "'";
           String ckey = (orgnum%65536) + "|" + semester + "|"+ keystr;
           
           if (!Toolbox.dbadmin[orgnum%65536].cache.containsKey(ckey))  
                Toolbox.dbadmin[orgnum%65536].cache.put(ckey, infostr);
           if (sb.indexOf(keystr + ";") < 0)
               sb.append(keystr + ";"); 
     }
     adapter.close();
     keys = sb.toString();
    
}

 
CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
%>
<head><title>Cached Information</title>
<script><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, timeformat ='<%=cachedstyle.timeformat%>', securitytoken="<%=Toolbox.gentoken("assigndoc.jsp","f1")%>",subdb='<%=user.id%>', semester='<%=Toolbox.dbadmin[orgnum%65536].currentSemester%>';
    <%=Toolbox.someconsts(orgnum)%> </script> 
 <script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
<script type=text/javascript  src=cookie.js></script>
<style> #themaintbl tr td{font-size:<%=cachedstyle.fontsize-1%>px}
center.ufs{font-size:<%=cachedstyle.fontsize%>px;margin:5px 0px 5px 0px;border:1px #777 solid;border-radius:3px;display:inline; float:right;display:none}</style>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />

<link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
</head>
 <body  style="margin:5px 5px 0px 5px;font-size:20px" >
     <%=Toolbox.title(Toolbox.emsgs(orgnum,52))%>
 <center class="ufs"><span id="urlplace"></span>&nbsp;&nbsp;<a href="javascript:testlink('')" ><%= Toolbox.emsgs(orgnum,321)%> </a>&nbsp;&nbsp;<a href="javascript:clipboard()"><span id=clipb></span></a></center>
 <%  if (keys.length() > 0 && keys.charAt(0) == ';') // delete keys starting width ";"
{
    String [] parts = keys.split(";____;"); 
   
    String [] karr = parts[0].replaceFirst("^;","").replaceFirst(";$", "").split(";"); 
    String key1 = ""; 
    for (String ky : karr)
    {
         if (ky.startsWith("`"))
         {
             ky = ky.substring(1);
             key1 = ky; 
         }
         Toolbox.dbadmin[orgnum%65536].cache.remove((orgnum%65536) + "|" + semester + "|" + ky); 
    }
   
    if (parts.length>1) 
      keys = parts[1] + key1; 
    else
      keys = key1;
     
} 
else if (keys.length()>0 && keys.charAt(0) == ',')  // make the assignment active
{
    course = Toolbox.defaultParam(orgnum,request, ("course"), null,"-_",20);
    assignname = Toolbox.defaultParam(orgnum,request, ("assignname"), null, "-$#@", 40);
    sessionname = Toolbox.defaultParam(orgnum,request, ("sessionname"), null);
    String query =  "SELECT name,due,question,format,atype,answer, start,status,Course.title,options,assess,attach,timesplit,latepermit,scale,weight,grader,sessionname  FROM Assignment, Course WHERE Assignment.course=Course.id AND Course.id = '" 
            + course + "' AND name='" + assignname.replaceAll("'","''") 
            + "' AND semester='" + semester.replaceAll("'","''")
            + "' AND sessionname='" + sessionname.replaceAll("'","''") + "' AND due >  " + System.currentTimeMillis()/1000;
    user.changedb(user.id);
    
    JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
     int n  = adapter.executeQuery(query);
     String xx;
     if (n == 1) 
     {
         AssignCache assigncache = new AssignCache(adapter);
         
         synchronized (this)
         {
             for (String sa : sessionname.split(","))
             {
                  assigncache.keystr = (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + sessionname;
                  Toolbox.dbadmin[orgnum%65536].assigncache.put(course + "|" + sa, assigncache);
             }
         }
     }
    
     adapter.close();
     keys = keys.substring(1);
}
int chkwidth = 5 + cachedstyle.fontsize;

 %>
    <script type="text/javascript" >document.write(round1('100%') );</script>
    <form name="form1">
<table width=100%  cellpadding=3 cellspacing=1 class=outset3 border=0 id="themaintbl">
<tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>">
    <td  align=center  width=<%=chkwidth%> ><input type=checkbox style="background-color:<%=cachedstyle.BBGCOLOR%>"   name=check1 onclick="checkall1()"></td>
<%
     int js[] = new int[]{982,286,965,1585,289,291,728,1452,0,0,0}; 
     for (int n:js)
     out.print("<td onclick=sortc(this)>" + Toolbox.emsg(orgnum,n) + "</td>");
     out.println("</tr>");
     String keyarray[] = keys.replaceFirst(";$","").replaceFirst("^;","").split(";");
     int n = 0; 
     
     long nowt = System.currentTimeMillis()/1000;
          if (keys.length()>0)
     for (String k: keyarray)
     {
         String ckey = (orgnum%65536) + "|" + semester + "|" + k;
         
         String [] karr = k.split("\\|");
         course = karr[0];
         assignname = karr[1];
         sessionname = karr[2];  
         boolean active = false;
         AssignCache a = null;
         for (String kks : sessionname.split(","))
         {
              a = Toolbox.dbadmin[orgnum%65536].assigncache.get(course + "|" + kks);  
             if (a !=null && a.name.equals(assignname))  
             {
                  boolean dued = false;
                 if (  Long.parseLong(a.due) < nowt) dued = true;
                  if (dued)
                       Toolbox.dbadmin[orgnum%65536].assigncache.remove(course + "|" + kks);
                  else 
                  {   
                       active = true;
                  }
             }
         }
         String info = null;
         if (!Toolbox.dbadmin[orgnum%65536].cache.containsKey(ckey))
         {
             if (active == false) 
                 continue;
             else
                 info = a.start + "," + a.due + "," + a.atype + ",'"  + (new AssOption(a.options,orgnum)).shorter().replace("'","''") + "','" + a.latepermit + "'";
         }
         else
             info = Toolbox.dbadmin[orgnum%65536].cache.get(ckey);
          
         out.print("<tr style=\"background-color:" + Toolbox.dbadmin[orgnum%65536].TBGCOLOR  + "\">");
         out.print("<td align=center width=" + chkwidth + "> <input type=checkbox id=checkbox" + n + " value=\""  + k + "\" onclick=checkseq(" + n + ")> </td><td>");
         out.print(k.replaceAll("\\|","</td><td>") + "</td>");
         
         CSVParse p = new CSVParse(info, '\'', new String[]{","});
         n++;
         String z;
         boolean canopen = true;
         
         for (int j=0; j < 4; j++)
         {   
              z =  p.nextElement(); 
              out.print("<td>" + z + "</td>");
              if (j==2 && z.equals("4")) canopen = false;
              
         }
         z =  p.nextElement(); 
         int l = z.length();
         if (l > 13) 
             z = "<span onmouseover=\"showsids('" + z  +"')\" onmouseout=closeprompt() > ......</span>"; 
         out.print("<td>" +z + "</td>");
         
       
         if (active)
             out.print("<td onclick=activate(this) align=center>&check;</td>");
         else   out.print("<td  onclick=activate(this) align=center></td>");
         if (canopen) 
             out.println("<td onmouseover=selwhich1(this,10) onmouseout=unselall() style=color:blue align=center onclick=openit2(this)> >> </td>");
         else
             out.println("<td  ></td>"); 
         z = user.id + "|" +semester + "|" + course + "|" +  sessionname + "|" +  assignname;
        
         out.println("<td align=center  onmouseover=selwhich1(this,11) onmouseout=unselall()>&nbsp;<span style=color:blue onclick=showurl('" + Unicode6b.encode(z) + "') >>></span>&nbsp;</td>");
         
        out.println("</tr>");
     } 
     out.println("</table></form>");
     String stylestr = " style=width:" + (int)(Math.ceil(Toolbox.charwidthrate()*cachedstyle.fontsize)) +"px;font-size:" + cachedstyle.fontsize + "px";
%> 
<script type="text/javascript" >document.write(round2);
var allkeys = '<%=keys%>';
var msg40 = '<%=Toolbox.emsgs(orgnum,40)%>';
</script>
<center class="ufs" ><span id="urlplace1"  ></span>&nbsp;&nbsp;<a href="javascript:testlink('1')" ><%= Toolbox.emsgs(orgnum,321)%> </a>&nbsp;&nbsp;<a href="javascript:clipboard()"><span id=clipb1></span></a></center>
<center><% if (justbuilt==false){%> <input type="button" onclick="buildcache()" class=OrangeButton  <%=stylestr%> value="<%=Toolbox.emsgs(orgnum,974) %>"  > <%}%> 
<% if (n>0){%><input type="button" onclick="deletecache()" class=RedButton   <%=stylestr%>  value="<%=Toolbox.emsgs(orgnum,30) %>"  ><%}%> </center>
<script type="text/javascript" src="timeformat.js"> </script>
<script type="text/javascript" src="asscache.js"></script>
<script type="text/javascript"  src=curve.js></script>
<%
    out.println("</body></html>");
     return;
}

if (subdb==null||course==null||semester==null||assignname==null||sessionname==null)
{
    out.println("<body>Invalid link<!--"+ subdb+course+semester+assignname+sessionname + "--></body></html>");
    return; 
}
String infostr = null;
String keystr = (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + sessionname;
infostr = Toolbox.dbadmin[orgnum%65536].cache.get(keystr);
if (infostr == null)
for (String sa : sessionname.split(","))
{
String keystr1 = (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + sa;
infostr = Toolbox.dbadmin[orgnum%65536].cache.get(keystr1);
if (infostr != null) {Toolbox.dbadmin[orgnum%65536].cache.put(keystr,infostr);break;}
}
   
String info [] = null;
if (infostr != null)
{
   info = (new CSVParse(infostr, '\'', new String[]{","})).nextRow();
}
else
{
    long ll = System.currentTimeMillis()/1000;
    infostr = ll + "," + (ll+ 7200)+ ",2,'n:;cd:distinct',''"; 
    info = new String[]{""+ll, ""+(ll+7200),"2", "n:;",""};
    if ( (user = User.authorize(orgnum,Systemroles.ASSESSER|Systemroles.SYSTEMADMIN| Systemroles.INSTRUCTOR|Systemroles.STUDENT,application,session,request, response, "assigntest.jsp", true)) == null ) 
    {
         //return;
    }
    else
   {
        user.changedb(subdb);
        JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
        if (!adapter.error().equals(""))
        {
             adapter.close();
             out.println("<body>Invalid link " + subdb + "</body></html>");
             return; 
        }
        String query = "SELECT  start, due, atype, options, latepermit FROM Assignment  WHERE Assignment.course= '" + course + "' AND name='" + assignname.replaceAll("'","''") +"' AND semester='" + semester.replaceAll("'","''") +"' AND (sessionname LIKE '%," + sessionname.replaceAll("'","''") + ",%' OR sessionname LIKE '%," + sessionname.replaceAll("'","''") + "' OR sessionname LIKE '" + sessionname.replaceAll("'","''") + ",%' OR sessionname='" + sessionname.replaceAll("'","''") + "')"  ;
 
        int n = adapter.executeQuery(query);
        adapter.close();
        if (n < 1)
        {   
           ;
        }
        else
        {
            info = new String[]{
                adapter.getValueAt(0,0),
                adapter.getValueAt(0,1),
                adapter.getValueAt(0,2),
                adapter.getValueAt(0,3),
                adapter.getValueAt(0,4)
            };
            infostr = adapter.getValueAt(0,0) + "," +
                adapter.getValueAt(0,1)+ "," + 
                adapter.getValueAt(0,2)+ ",'" +
               (new AssOption(adapter.getValueAt(0,3),orgnum)).shorter().replace("'","''")+ "','" +
                adapter.getValueAt(0,4) + "'";
             
        }
         synchronized (this) {Toolbox.dbadmin[orgnum%65536].cache.put(keystr, infostr);}
    }
}
   
if (info == null || info.length < 5)
{
   out.println("<body>Invalid link<!-- no key--></body></html>");
   return;
}
  
long start = -1, due = -1, nowsecond = System.currentTimeMillis()/1000;
try{
   start = Long.parseLong(info[0]);    
   due = Long.parseLong(info[1]); 
}catch(Exception e){}
if (start > 0 && start > nowsecond)
{
   out.println("<body>"  + course + "  " + assignname + " " + semester + " " + sessionname + " "  +   Toolbox.emsgs(orgnum,6) + " " + Toolbox.timestr(start) + "</body></html>");
   return;
}

long extension = 0;
String  atype=info[2], options=info[3], latepermit=info[4];
AssOption assopt = new AssOption(options,orgnum); 
 
if (assopt.allowNoLogin && user==null)
{
    String uid = Toolbox1.GetCookie(request, (orgnum%65536) + "uid");
 
    user = new User(orgnum);
    if (uid!=null)
    {
        user.id = uid;
        if (user.retr() == false)
        {
            user.roles = 1; 
            user.changedb(subdb);
        }
    }
    else
    {
        int n;
        synchronized(Toolbox.dbadmin[orgnum%65536])
        {
            n = Toolbox.dbadmin[orgnum%65536].nouser++;
        }
        user.id = ""+n;
        user.roles = 1;
        user.changedb(subdb);  
        Cookie cookie = new Cookie((orgnum%65536) + "uid", user.id);
        response.addCookie(cookie);
    }
    session.setAttribute("User", user);
}
    
if (!assopt.allowNoLogin && user==null)
{
    if ( (user = User.authorize(orgnum,Systemroles.ASSESSER|Systemroles.SYSTEMADMIN| Systemroles.INSTRUCTOR|Systemroles.STUDENT,application,session,request, response, "assigntest.jsp", true)) == null|| !Toolbox.verifytoken(request)) 
    {
        return;
    } 
}
      
if (due > -1 && due <= nowsecond)
{
     long dues[] = new long[]{due};
     extension = Toolbox1.extent(latepermit, user.id, dues); 
     due = dues[0]; 
}
 
if (due > -1 && due <= nowsecond)
{
 CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
 %>
 <%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
 <head><title><%=course + " " + assignname%></title>
 <script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
<script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" src="checkHTML.js"> </script> 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
<link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
</head>
 <body  style="margin:5px 5px 0px 5px;font-size:20px" >
    <%=Toolbox.title(course + " " + assignname)%>  
     <script>
         
        let key0 = "<%="T" +    course  + "@" +  assignname  + '@' + user.id%>";
        let key = "<%=(orgnum%65536) + '|' + semester  + '|' +   course + "|" + assignname + '|' + user.id%>";
        let url = document.location.toString().replace(/assigntest.jsp/,'DataForm').replace(/mode=[^&]+/,'').replace(/code=[^&]+/,'')
            .replace(/c=[^&]+/,'orgnum=<%=orgnum%>&code6b=<%=Unicode6b.encode(backto.toString())%>').replace(/&&/,'&').replace(/&$/,'')
            + "&sid=<%=user.id%>&rdap=studentsubmission&makescript=makesubmission&extension=<%= extension%>&coursetitle=<%=course%>";
        
        if (localStorage[key]==null && localStorage[key0]==null)
        {
            document.write("<br> <%=assignname%> " + textmsg[1799].split(/@/)[4] + "  <%= Toolbox.timestr(due)%>"); 
            document.write("<br>If you did submit it, click to <a href=javascript:check() target=_self>check</a>"); 
        }
        else 
            document.location.href = url;
        function check()
        {
            document.location.href = url;
        }
     </script>
 </body></html>
 <%
  return;   

}
 

if (!atype.equals("4") && assopt.code!=null && !assopt.code.equals("") && assopt.code.indexOf("attendance")<0 && code.equals(""))// || !code.equals(assopt.code))
{
   CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
   String url = Toolbox1.geturl(request);
   %>
<%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
 <head><title><%=course + " " + assignname%></title>
 <script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
<script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" src="checkHTML.js"> </script> 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
<link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
</head>
<body>
    <%=Toolbox.title(course + " " + sessionname + " " + assignname )%>
 
<center><table class="outset1"  style="margin:20px 0px 0px 0px;width:300px">
  <% if (!code.equals("") && !code.equals(assopt.code)){%>
  <tr><td colspan="3" align="center" style="color:red"><nobr><%=Toolbox.emsgs(orgnum,116)%></nobr></td></tr>
        <%}%>      
  <tr><td><nobr><script>document.write(textmsg[1929].split(/@/)[4])</script></nobr></td>
<td><input id="code" style="padding:3px 3px 3px 3px;border:1px #b0b0b0 solid;border-radius:3px"></td>
<td><input id="but" 
           type="button" 
           value="<%=Toolbox.emsgs(orgnum,6)%>" 
           class=OrangeButton 
           style="width:80px;border-radius:4px;padding-top:3px;padding-bottom:3px"
           onclick="javascript:go()" >
</td>
</tr>
</table>
</center>
<script>
//document.getElementById('but').style.width = (4.5*font_size) + 'px';    
function go()
{
    document.location.href = document.location.toString().replace("&code=.*$","")   + '&code=' + encodeURIComponent((document.getElementById('code').value));
}
</script>
</body>
</html>
<%
    return;
}

 
if (atype.equals("4"))
{    
%>
<jsp:forward  page="embedquiz.jsp">
<jsp:param name="orgnum"  value="<%=orgnum%>" /> 
<jsp:param name="course"  value="<%=course%>" />
<jsp:param name="semester"  value="<%=semester%>" />
<jsp:param name="sessionname"   value="<%= sessionname%>" />
<jsp:param name="assignname"  value="<%= assignname%>" />
<jsp:param name="mode"  value="take" />
<jsp:param name="subdb"   value="<%=subdb%>" />
<jsp:param name="quizdue"  value="<%=due%>" />
<jsp:param name="start"  value="<%=start%>" />
</jsp:forward>
<%
return;
}
 
%>
<head>
    <%= Toolbox.getMeta(orgnum) %>
    <title><%=Toolbox.emsgs(orgnum,51)%></title>
</head>
<%
String ways =    "rows=\"*,1\"";
String ways2 =  "cols=\"80%,*\"";
String url = Toolbox1.geturl(request);
StringBuffer bad = new StringBuffer("assigndoc.jsp?");
bad.append("subdb=" + subdb + "&semester=" + semester);
bad.append("&option=" 
        +((atype.equals("0") || atype.equals("2"))?"destest":"take") 
        + "&extension=" + extension + "&makescript=makesubmission&sid=" + user.id);
bad.append("&course=" + java.net.URLEncoder.encode(course)  + "&");
bad.append("assignname=" + java.net.URLEncoder.encode(assignname)  + "&");
bad.append("sessionname=" + java.net.URLEncoder.encode(sessionname) + "&");
bad.append("coursetitle=" + java.net.URLEncoder.encode(course) + "&");
bad.append("from=1");
if (assopt.code!=null && !assopt.code.equals(""))
    bad.append("&code=" + java.net.URLEncoder.encode(code));

String orderi = "0";
String x =  request.getHeader("user-agent"); if (x==null) x="";  x =x.toLowerCase();
if (x.equals("ipad") || x.equals("iphone") || x.equals("android"))
x = "mobile";
%>
<frameset rows="*,1" border="3" >
 <frameset cols="<%=x.equals("mobile")?"90":"70"%>%,*" >
 <frame   scrolling="auto"  name="upleft<%=orderi%>"    src="<%=bad.toString()%>" />
 <frame   scrolling="auto"  name="uprig<%=orderi%>" />
 </frameset>
 <frame name="lowerwin"  scrolling="no"   />
</frameset>
 
</html>
