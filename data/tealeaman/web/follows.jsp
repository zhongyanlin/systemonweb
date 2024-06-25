<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
    User user = (User)(session.getAttribute("User"));
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,718)%></title>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>

</head>
<body style="background:<%=cachedstyle.DBGCOLOR%>; margin:6px 6px 6px 6px" >
<% 
String x = Toolbox.defaultParam(orgnum,request,"x","", null, 20);
if (x.equals("sign1"))
{
    if ( (user = User.authorize(orgnum, Systemroles.SYSTEMADMIN,application,session,request, response, "follows.jsp", false)) == null) 
    return;
    orgnum = user.orgnum; 
    out.println("This will reset the public key and private key for digital signiture. Please notice that after setting, all documents previously signed will not be able to get varified. Do not make this change until you have resigning service in place.");
}
else if (x.equals("reloadg"))
{
    orgnum = user.orgnum; 
    String semester = Toolbox.defaultParam(orgnum, request, "semester", Toolbox.dbadmin[orgnum%65536].currentSemester);
    String query = "SELECT Assignment.name, Assignment.course,Assignment.sessionname  FROM Assignment WHERE  Assignment.semester='"
            + semester + "' AND Assignment.grader LIKE '%" + user.id + "%' AND NOT Assignment.sessionname=''  ORDER BY 2,1";
    JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
    adapter.orgnum = orgnum;
    int n  =  adapter.executeQuery(query); 
    StringBuffer b = new StringBuffer();
    out.println("<script>var option = new Array(),caption = new Array();option[0]='';caption[0]='" + Toolbox.emsgs(orgnum,499) + "';");
    if (n <= 0)
    {
        query = "SELECT distinct courseid, name  FROM Session WHERE  semester='"
            + semester + "' AND (instructor = '" + user.id + "' OR ta LIKE '%" + user.id + "%') ORDER BY 1,2";
        n = adapter.executeQuery(query);
         
        String old = "";
        int j = 0;
        //out.println("option[0]='" + Toolbox.emsgs(orgnum,499) + "';"); 
        for (int i=0; i <= n; i++)
        {
            String y = null;
            if (i < n) y = adapter.getValueAt(i,0).replaceAll("'","\\'");
            if (i==n || !y.equals(old))
            out.println("option[" + (j++) +"]='" + old + "';");
            if (y == null) break; 
            old = y;
        }
        for (int i=0; i < n; i++)
        {
            out.println("caption[" +(i)+ "]='" + adapter.getValueAt(i,0).replaceAll("'","\\'") + "~"+  adapter.getValueAt(i,1).replaceAll("'","\\'") + "';");
        }
        adapter.close(); 
        out.println("parent.frames[0].options[1]=parent.frames[0].copyarr(option);parent.frames[0].captions[1]=parent.frames[0].copyarr(option);parent.frames[0].options[2] = parent.frames[0].copyarr(caption); parent.frames[0].captions[2] = parent.frames[0].copyarr(caption);parent.frames[0].setoptions();</script>");
    }
    else
    {
        for (int i=0; i < n; i++)
        {
            out.println("option[" + (i+1) +"]='" + adapter.getValueAt(i,0).replaceAll("'","\\'") + "';");
            out.println("caption[" +(i+1)+ "]='" + adapter.getValueAt(i,1).replaceAll("'","\\'") + "^~"+ adapter.getValueAt(i,2).replaceAll("'","\\'")+ "';");
        }
        adapter.close(); 
        out.println("parent.frames[0].options[2]=parent.frames[0].copyarr(option); parent.frames[0].captions[2] = parent.frames[0].copyarr(caption);parent.frames[0].makeoptions();parent.frames[0].firstload();parent.frames[0].resel();parent.frames[0].usedbefore();</script>");
    }
}
else if ( x.equals("repository")) 
{
 
 if ( (user = User.authorize(orgnum,Systemroles.TA | Systemroles.SYSTEMADMIN | Systemroles.SYSTEMANALYST,application,session,request, response, "follows.jsp", false)) == null) 
 return;
  
 orgnum = user.orgnum; 
 String rdap = Toolbox.defaultParam(orgnum,request,"rdap",null, "#", 30);
 String mode = Toolbox.defaultParam(orgnum,request, ("mode"), null);
  
 mode = Toolbox.validate(mode, null, 30); 
 String err = "";
 if (mode!=null&& mode.equals("delete"))
     Generic.storedProc.remove(rdap);
 else if (mode!=null)
 {
     err = Generic.genStoredProc(rdap,null,orgnum); 
     Webform w =  Generic.storedProc.get(rdap); 
     JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum); adapter.orgnum = orgnum;
     Task t = new Task(adapter);
     int j=0; 
      
     for ( ; j < Toolbox.langs.length;j++)
     { 
         try
         {
                if (j == Toolbox.langnum)
                {
                    if (!Toolbox.langs[j].equals("en")) 
                    err += t.applyLang(w,j << 16);
                }
                else 
                {
                    t.cacheLang(rdap, Toolbox.langs[j]);
                }
         }catch(Exception e2){ }
     }
     t.close(); 
     adapter.close();
 } 
 out.println(Toolbox.title(Toolbox.emsgs(orgnum,777)));
 out.print("<script type=text/javascript >");
  
 if (err.equals(""))
 {
     err =  rdap   + Toolbox.emsgs(orgnum,1076)  ; 
 }
 out.print("parent.myprompt('" + err.replaceAll("\n","\\n").replaceAll("'"," ") + "');</script>");
  
 //out.print(((Webform)(Generic.storedProc.get(rdap))).toString1());
}
else if ( x.equals("makehimta"))
{
  if ( (user = User.authorize(orgnum, Systemroles.SYSTEMADMIN | Systemroles.SYSTEMANALYST| Systemroles.INSTRUCTOR,application,session,request, response, "follows.jsp", false)) == null) 
 return;
 String allta = Toolbox.defaultParam(orgnum,request,"allta",null, ",", 120);
 String alldid = "";
 if (allta!= null)
 {
    String alltas[] = allta.split(",");
    JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum); 
    adapter.orgnum = orgnum;
    
    for (int i=0; i < alltas.length; i++)
    {
        String uid = alltas[i];
        String sql = "select roles FROM AppUser where id='" + uid + "'";
        int n = adapter.executeQuery(sql); 
        if (n == 1)
        {
            long j = 0;
            try{ j = Long.parseLong(adapter.getValueAt(0,0));}catch(Exception e){} 
            if ( (j & Systemroles.INSTRUCTOR) == 0 && (j & Systemroles.TA) == 0)
            {
                j += Systemroles.TA;
                sql = "UPDATE AppUser SET roles=" + j + " WHERE id='" + uid+ "'";
                adapter.executeUpdate(sql);  
                alldid += "," + uid;
            }
        }
    }
    adapter.close();
 }
  if (alldid.length() > 0)
      out.print("<script>parent.myprompt2('" + alldid.substring(1) + "');</script></body>");
  else
      out.print("<script>parent.myprompt2('');</script></body>");
    
}
else if ( x.equals("currentsemester"))
{
 if ( (user = User.authorize(orgnum, Systemroles.TEACHINGADMIN | Systemroles.SYSTEMADMIN | Systemroles.SYSTEMANALYST| Systemroles.INSTRUCTOR,application,session,request, response, "follows.jsp", false)) == null) 
 return;
 String un = Toolbox.defaultParam(orgnum,request,"semester",null, null, 30);
 if (un != null)
 {
  Toolbox.dbadmin[orgnum%65536].currentSemester  =  un ; 
 JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum); adapter.orgnum = orgnum;
 
 int n = adapter.executeUpdate("UPDATE Course SET Course.current=0");
 if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
 n = adapter.executeUpdate("UPDATE Course, Session SET Course.current=1 WHERE Session.courseid=Course.id AND Session.semester='" + un.replaceAll("'","''") +"'");
 adapter.close();
 if (adapter.error().length()==0 && n >=0) 
 out.println("<script type=text/javascript > var win=window.open('','_top','',true);win.opener=true;win.close();</script>");
 else
 out.print("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body><font color=red>" + adapter.error() +"</font>");
 }
 else out.print("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body><font color=red> unit/client name not provided</font>");
}
else if (x.equals("newsemester"))
{
    if ( (user = User.authorize(orgnum, Systemroles.TEACHINGADMIN | Systemroles.SYSTEMADMIN | Systemroles.SYSTEMANALYST| Systemroles.INSTRUCTOR,application,session,request, response, "follows.jsp", false)) == null) 
 return;
    String newsemester = Toolbox.defaultParam(orgnum, request, "newsemester", null, null, 25);
    String orgnum1 = Toolbox.defaultParam(orgnum, request, "orgnum1", null, null, 25);
    String news = "-1";
    if (newsemester!=null && orgnum1!=null)
    {
        orgnum = Integer.parseInt(orgnum1);
        news = Toolbox.dbadmin[orgnum%65536].newSemester(newsemester, orgnum);
         
    }
    out.print("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body><script>parent.synsemester('" + news + "');</script>");
}
else if (x.equals("setsystemparam"))
{
 if ( (user = User.authorize(orgnum, Systemroles.TEACHINGADMIN | Systemroles.SYSTEMADMIN | Systemroles.SYSTEMANALYST ,application,session,request, response, "follows.jsp", false)) == null) 
 return;
 orgnum = user.orgnum; 
 JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
 Toolbox.dbadmin[orgnum%65536].setSystemParameter(adapter); 
 Toolbox.changecss("none","none","none","none",orgnum);
 if (adapter.executeQuery("SELECT option2 from SystemParam")>0)
{
    Toolbox.dbadmin[orgnum%65536].error2 =  adapter.getValueAt(0, 0);
 }
 adapter.close();
 out.println("<script type=text/javascript >var win=window.open('','_top','',true);win.opener=true;win.close();</script>");
} 
else if ( x.equals("changepolicy")) 
{
 
 if ( (user = User.authorize(orgnum, Systemroles.SYSTEMADMIN,application,session,request,response,"follows.jsp", false)) == null) 
 return;
 orgnum = user.orgnum; 
 out.print( Toolbox.title(Toolbox.emsgs(orgnum,1100)));
 JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum); adapter.orgnum = orgnum;

boolean b = adapter.executeQuery2("SELECT userlink,Docslang.docs,language FROM SigninPolicy,Docslang where SigninPolicy.instruction=Docslang.domain and active=1",false);
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
else  if(b && (orgnum%65536)==0 && adapter.getValueAt(0,0)!=null)
{
    for (int i=0; adapter.getValueAt(i, 0)!=null; i++)
    { 
        int k=0; for(; k < Toolbox.signuplink.length; k++)
            if (adapter.getValueAt(i, 2).equals(Toolbox.langs[k])) break;
        if (k < Toolbox.signuplink.length)
        {
        Toolbox.signuplink[k] = adapter.getValueAt(i, 0);
        Toolbox.instruction[k] = adapter.getValueAt(i, 1);
        }
    }
           
 }
  
 %>
 <script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>
 <br><%=Toolbox.emsgs(orgnum,956)%>:<br><table>
 <tr><td>  <%=Toolbox.emsgs(orgnum,957)%></td><td>: <%= Toolbox.signuplink[orgnum>>16]%></td></tr>
 <tr><td><%=Toolbox.emsgs(orgnum,958)%></td><td>: <%=Toolbox.instruction[orgnum>>16]%></td></tr>
 </table>
<%
 adapter.close();
} 
else if (  x.equals("quittalk"))
{
 
 String id = Toolbox.defaultParam(orgnum,request,"id",null, null, 30);
 String uid = Toolbox.defaultParam(orgnum,request,"uid",null, null, 30);
  
}
else if (  x.equals("turnondebug"))
{
if ( (user = User.authorize(orgnum, Systemroles.TEACHINGADMIN | Systemroles.SYSTEMADMIN | Systemroles.SYSTEMANALYST| Systemroles.INSTRUCTOR,application,session,request, response, "follows.jsp", false)) == null) 
 return;
 Toolbox.sessiondebug = true;
 //out.println("<script type=text/javascript > realClose()</script>");
} 
else if (  x.equals("turnoffdebug"))
{
if ( (user = User.authorize(orgnum, Systemroles.TEACHINGADMIN | Systemroles.SYSTEMADMIN | Systemroles.SYSTEMANALYST| Systemroles.INSTRUCTOR,application,session,request, response, "follows.jsp", false)) == null) 
 return;
 Toolbox.sessiondebug = false;
 
} 
else if (  x.equals("shortmsg"))
{
    if ( (user = User.authorize(orgnum, Systemroles.TEACHINGADMIN | Systemroles.SYSTEMADMIN | Systemroles.SYSTEMANALYST| Systemroles.INSTRUCTOR,application,session,request, response, "follows.jsp", false)) == null) 
 return;
    String pin =  Toolbox.defaultParam(orgnum,request,"pin","1234", null, 4);  
    String orgnumstr =  Toolbox.defaultParam(orgnum,request,"orgnum","0", null, 4);
    orgnum = Integer.parseInt(orgnumstr); 
    String uid = Toolbox.defaultParam(orgnum,request,"uid",null, null, 20);
    JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum); adapter.orgnum = orgnum;
    
    int n;
    String oldpin = Toolbox.defaultParam(orgnum,request,"oldpin",null, null, 4);  

    if (oldpin!=null)
    {
        String sql = "UPDATE ChatMsg SET attach='" + pin + "' WHERE  sid='" + uid + "' AND courseid='shortmsg' AND attach='" + oldpin + "'";
        n = adapter.executeUpdate(sql);
        if (!adapter.error().equals(""))
    {
        adapter.close();
        out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
       
    }
        if (n < 1) out.println("Wrong");
        
    }
    else 
    {
     String sql = "SELECT content,lastupdate FROM ChatMsg WHERE  sid='" + uid + "' AND courseid='shortmsg' AND attach='" + pin + "' order by lastupdate";

     n = adapter.executeQuery(sql);
     if (!adapter.error().equals(""))
    {
        adapter.close();
        out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
         
    }
     if (n >= 1)
     {
          out.println(""+Toolbox.locales[Toolbox.langnum].charsize + MyRSA.encryptString0(adapter.getValueAt(n-1,0),orgnum>>16));  
           
     }
     else 
     {
         out.println("user name or pin is Wrong");
        
     } 
    }
     adapter.close();
     return; 
}
 
else if (  x.equals("appedt"))
{
  
 if ( (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request, response, "follows.jsp", true)) == null) 
 return;
orgnum = user.orgnum; 
 JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum); adapter.orgnum = orgnum;

 int n = adapter.executeQuery("select num, cdate from Acalender order by num");
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
 for (int i=0; i < n; i++)
 {
    Toolbox.dbadmin[orgnum%65536].setAppedt(adapter.getValueAt(i,0),adapter.getValueAt(i,1));
 }
 adapter.close();
 out.print(Toolbox.emsgs(orgnum,1070) + Toolbox.emsgs(orgnum,1076));
}

else if ( x.equals("mycourse"))
{
 if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR | Systemroles.TEACHINGADMIN,application,session,request,response,"follows.jsp", true)) == null) 
 return;
 orgnum = user.orgnum; 
 long lg = (System.currentTimeMillis()/1000);
 String sql0= "TimeSlot;SELECT * FROM TimeSlot;"
 + "DomainValue;SELECT lastupdate,domain,domainValue,code,description,language FROM DomainValue  WHERE " + lg + "-lastupdate < 360*3600*24;"
 + "Student;SELECT * FROM Student WHERE advisor='" + user.id +"';"
 + "Course;SELECT * FROM Course WHERE id IN (SELECT courseid FROM Session WHERE Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester+"' AND Session.instructor='" + user.id + "');"
 + "OperationCourse;SELECT " + lg + ",'Preview',courseid,2,2,2 FROM Session WHERE Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester+"' AND Session.instructor='" + user.id + "' "
 + "UNION SELECT " + lg + ",'Attacht',courseid,1,1,1 FROM Session WHERE Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester+"' AND Session.instructor='" + user.id + "' "
 + "UNION SELECT " + lg + ",'Edit',courseid,3,3,3 FROM Session WHERE Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester+"' AND Session.instructor='" + user.id + "' "
 + "UNION SELECT " + lg + ",'Plagiarism',courseid,0,4,0 FROM Session WHERE Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester+"' AND Session.instructor='" + user.id + "';"
 + "Session;SELECT * FROM  Session  WHERE   Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester+"' AND Session.instructor='" + user.id +"';"
 + "AppUser;SELECT DISTINCT AppUser.lastupdate, AppUser.id, AppUser.password, '', '', AppUser.roles, AppUser.firstname, AppUser.middlename, AppUser.lastname, AppUser.title, AppUser.department, '', '', '', '', '', '', email, '', AppUser.photourl,'', '', '', '', '', '', '', '', '', 0,15,NULL,NULL, 0,''  FROM AppUser, Registration, Session WHERE Registration.sid=AppUser.id AND Session.name=Registration.sessionname AND Registration.courseid=Session.courseid AND Registration.semester=Session.semester AND Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester+"' AND Session.instructor='" + user.id +"' "
 + "UNION SELECT AppUser.lastupdate, AppUser.id, AppUser.password, '', '', AppUser.roles, AppUser.firstname, AppUser.middlename, AppUser.lastname, AppUser.title, AppUser.department, '', '', '', '', '', '', email, '', AppUser.photourl,'', '', '', '', '', '', '', '', '', 0,15,NULL,NULL, 0,''  FROM AppUser WHERE AppUser.id='" +  user.id +"' "
 + "UNION SELECT Student.lastupdate, Student.id,  AppUser.password, NULL, NULL, roles, firstname, middlename, lastname, title, department, NULL, NULL, NULL, NULL, NULL, phone, email, website, photourl, NULL, NULL, NULL, NULL, NULL, NULL, NULL, mobilephone, NULL, 0,15,NULL,NULL,0,websitename  FROM AppUser,Student WHERE AppUser.id=Student.id AND Student.advisor='" + user.id +"';"
 + "Registration;SELECT Registration.lastupdate, Registration.sid, Registration.sessionname,Registration.courseid,Registration.semester,NULL, Registration.status, NULL, NULL, NULL,Registration.target, Registration.decision,rstatus,whosehand,faceinfo  FROM Registration, Session WHERE Registration.semester=Session.semester And Registration.courseid=Session.courseid And Registration.sessionname=Session.name AND Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester +"' AND Session.instructor = '"+ user.id +"';";
 JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
 if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
 String sel = "SELECT courseid, name FROM Session WHERE Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester+"' AND Session.instructor='" + user.id +"'";
 int nn = adapter.executeQuery(sel);
 if (nn > 0)
{
 StringBuffer ss = new StringBuffer();
 ss.append("UPDATE Registration SET lastupdate=0 WHERE semester='");
 ss.append(Toolbox.dbadmin[orgnum%65536].currentSemester);
 
 for (int k=0; k < nn; k++)
{
   if (k==0)ss.append("' AND (");
   else ss.append(" OR ");
   ss.append("courseid='");
   ss.append(adapter.getValueAt(k,0));
   ss.append("' AND sessionname='");
   ss.append(adapter.getValueAt(k,1));
   ss.append("' ");
}
 ss.append(")");
  
 nn = adapter.executeUpdate(ss.toString());
  
 String sess = "UPDATE Session SET lastupdate=0 WHERE   Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester+"' AND Session.instructor='" + user.id +"'";
 nn = adapter.executeUpdate(sess);
  
} 
  
 adapter.close();
 String err = DataMove.importdata(user, sql0, "backup", true);
 String rows[] = err.split("<.tr>"); 
 err = "";
 String tnames[] = new String[]{ null,null,null,
 Toolbox.emsgs(orgnum,19),
 Toolbox.emsgs(orgnum,430),
 null, Toolbox.emsgs(orgnum,233),Toolbox.emsgs(orgnum,823),
 Toolbox.emsgs(orgnum,1103)}; 
 for (int i=0; i < rows.length; i++)
{
    String ys[] = rows[i].trim().split("<.td>");
    if (tnames[i]!=null)
    err += "<tr><td>" + tnames[i] + "</td><td align=right>" +  ys[2].replaceAll("<[^>]*>","") + "</td></tr>";
}
 String sql = "DELETE FROM Session WHERE lastupdate=0;DELETE FROM Registration WHERE lastupdate=0;"
 + "UPDATE Course SET curr=1 WHERE Course.id IN (SELECT courseid FROM Session WHERE Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester +"' AND  Session.instructor='" + user.id +"');"
 + "UPDATE Course SET curr=0 WHERE Course.id NOT IN (SELECT courseid FROM Session WHERE Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester +"' AND  Session.instructor='" + user.id +"');" 
 + "UPDATE Registration SET attendance=0 WHERE attendance is NULL or attendance < 0";
   
 adapter = Toolbox.getUserAdapter(user, orgnum);
 try{adapter.transacte(sql.split(";"),0,5); }catch(Exception e){ out.println(e.toString()); }
 String words = Toolbox.emsgs(orgnum,1399);
 String cs0 = "SELECT courseid FROM Session WHERE Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester +"' AND  Session.instructor='" + user.id +"'";
 if (adapter.executeQuery(cs0) == 0)
 {
     int n = adapter.executeQuery("SELECT count(*) FROM Course");
     if (  n <=0 ||   adapter.getValueAt(0,0).equals("0") )
     {
         words = Toolbox.emsgs(orgnum,1427);
     }
     else
         words = Toolbox.emsgs(orgnum,1428);
     //if (!err.equals("")) words = err;
 }
 adapter.close();
  
 out.println(Toolbox.title(Toolbox.emsgs(orgnum,940),3));
  
 
 if ( (user.roles & Systemroles.SYSTEMADMIN) + (user.roles & Systemroles.SYSTEMANALYST) ==  0) 
 {
     //err = err.replaceAll("<[^>]*>", "An error");
     out.println("<br>" + words + "<script>if (typeof(parent.myprompt)!='undefined')parent.myprompt('"  +  words + "<br><div onclick=\"this.visibility=visible;\" style=visibility:hidden><table>" + err + "</table><div>');</script>");
 }
 else 
 {
     if (err.equals(""))
       out.println("<br>" + words +  "<script>if (typeof(parent.myprompt)!='undefined')parent.myprompt('" + words.replace("'","\\'") + "');</script>");
     else
       out.println("<br>" + words +  "<script>if (typeof(parent.myprompt)!='undefined')parent.myprompt('" + words.replace("'"," ") + "<br><table border=1 style=border-collapse:collapse align=center>" + err.replace("'","\\'") + "</table>');</script>");

 }
  
}
 
else if (x.equals("changeid") || x.equals("changecid") || x.equals("changesess") ||  x.equals("changeassn") ||  x.equals("changedept"))
{
    if ( (user = User.authorize(orgnum, Systemroles.TEACHINGADMIN | Systemroles.SYSTEMADMIN | Systemroles.SYSTEMANALYST| Systemroles.INSTRUCTOR,application,session,request, response, "follows.jsp", false)) == null) 
 return;
    String oldid = Toolbox.defaultParam(orgnum,request,"OldId", null, null,20);
    String newid = Toolbox.defaultParam(orgnum,request,"NewId", null, null,20);
    String Session = Toolbox.defaultParam(orgnum,request,"Session", null, ",",500);
    String courseid = Toolbox.defaultParam(orgnum,request,"CourseId", null, null,20);
    String semester = Toolbox.defaultParam(orgnum,request,"Semester", null, ",",50);
    
    if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR | Systemroles.SYSTEMADMIN | Systemroles.TEACHINGADMIN | Systemroles.REGISTER,application,session,request,response,"follows.jsp", true)) == null)
        return; 
    orgnum = user.orgnum; 
    Webform w = (Webform)(Generic.storedProc.get(x));
    String query =  "";
    if (w!=null) query = w.query;
    String s = "empty ids";
    boolean bb = true;
    if (oldid != null)
        query = query.replaceAll("\\?\\?OldId\\?\\?", oldid).replaceAll("\\?\\?NewId\\?\\?", newid).replaceAll("\\?\\?CourseId\\?\\?", courseid).replaceAll("\\?\\?Semester\\?\\?",semester).replaceAll("\\?\\?Session\\?\\?",Session); 
    
    if (x.equals("changeassn")) 
    {
        user.changedb(user.id);
        JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
        String querys[] = query.split(";");
        try{bb = adapter.transacte(querys, 0, querys.length);}catch(Exception e1){ }
        adapter.close(); 
    }
    else
        s = Toolbox.dbadmin[orgnum%65536].doforalldb(query, true,true); 
    if (bb == false)
    { 
     %>
     <script type="text/javascript" >parent.rollback();</script>
     <%
    }
    %>
    <script type="text/javascript" > 
     parent.old2new(); 
     <%  if (user.roles == 16 &&  s.length()> 0) 
     {%> 
         parent.myprompt("<%=Generic.handle(s)%>");
    <%}%>
    </script>
    <%
}
 
else if (x.equals("fontsize"))
{
 String s =  Toolbox.defaultParam(orgnum,request, "fontsize", null, null, 3);

 if (s!=null )
 {
 
 if ( (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request,response,"follows.jsp", true)) == null)
 return;
orgnum = user.orgnum; 
 int i = user.fontsize;
 try{ i = Integer.parseInt(s);}catch(Exception e){return;}
 if (i <8 || i > 50) return;
 JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum); adapter.orgnum = orgnum;

 int n = adapter.executeUpdate("update AppUser set fontsize=" + s +" where id='" + user.id +"'");
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
 adapter.close();
 if (n!=1) return;
  
 user.fontsize = i;
 session.setAttribute("User", user);
 String whocalls = Toolbox.defaultParam(orgnum,request, ("follow"), null);
 if (whocalls==null) whocalls = "index.jsp";
 %>

 <script type="text/javascript" > 
 document.location.href="<%=whocalls%>";
 </script>
 <%

 }
}
else if (x.equals("doforall"))
{ 
 String s = "need to be admin";
  
 if ( (user = User.authorize(orgnum, Systemroles.SYSTEMADMIN,application,session,request, response, "follows.jsp", false)) == null) 
 return;
orgnum = user.orgnum; 
 {
 String i = Toolbox.defaultParam(orgnum,request, "include", "", null, 10);
 String sql = Toolbox.defaultParam(orgnum,request, "t", "");
 s = Toolbox.dbadmin[orgnum%65536].doforalldb(sql, !i.equals(""),false);
 s = Toolbox.removescript(s);
 
 if (orgnum%65536 == 0)
{
    for (int ll=1; ll < Toolbox.dbadmin.length; ll++)
        {
            String sl = Toolbox.dbadmin[ll].doforalldb(sql, !i.equals(""),false);
            s += Toolbox.removescript(sl);
        }
}
 
 }
 out.println("<script type=text/javascript >parent.myprompt(\"<table border=1 style=border-collapse:collapse;border-color:#444;width:\"  + (parent.thispagewidth()-100) +  \"px>" + Generic.handle(s) +"</table>\")</script>");
}
else if (x.equals("remind"))
{
 if (!request.getRemoteAddr().equals(request.getLocalAddr())) return;
 JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum); adapter.orgnum = orgnum;
 
 Vector<DBConnectInfo> v = new Vector(10);
 int n = 0;
 String cusemster = Toolbox.dbadmin[orgnum%65536].currentSemester;
 n = adapter.executeQuery("SELECT  server, driver, dbuserid,dbpassword  from DBOwner group by server");
 if(!adapter.error().equals(""))
 {
 adapter.close();
 Toolbox.println(0, adapter.error());
 return;
 }
 for(int i = 0; i < n; i++)
 v.addElement(new DBConnectInfo(adapter.getValueAt(i, 0), adapter.getValueAt(i, 1), adapter.getValueAt(i, 2), adapter.getValueAt(i, 3),adapter.orgnum));

 adapter.close();
 long tt = System.currentTimeMillis() / 1000L;
 String sql = "select Assignment.course, Assignment.name,  Assignment.due, AppUser.email,Assignment.sessionname  from Assignment, Registration,AppUser,Submission where AppUser.id=Registration.sid AND Registration.sessionname=Assignment.sessionname AND Registration.courseid=Assignment.course AND Registration.semester='"
         + cusemster + "' AND  Assignment.semester ='" + cusemster + "' AND  Assignment.atype < 2 and Assignment.due >=" + (tt + 0x1fa400L) + " and Assignment.due <  " + 
         (tt + 0x2f7600L) + " AND CONCAT(Assignment.course,' ',Assignment.name,' ',Registration.sid) NOT IN (select CONCAT(Submission.course,' ',Submission.assignname,' ',Submission.sid) from Submission where semester='" + cusemster + "') order by Assignment.course, Assignment.name,Assignment.sessionname";
 String old = null;
 int sindex = Toolbox.begintranslate("mysql");
 
 for(int i = 0; i < n; i++)
 {
 adapter = Toolbox.getUserAdapter(v.elementAt(i),orgnum);
 int tindex = Toolbox.begintranslate(adapter.dbms);
 int m = adapter.executeQuery(Webform.mysql2c(adapter.dbms,  sql));
 old = null;
 StringBuffer addr = new StringBuffer();
 for(int j = 0; j < m; j++)
 {
 if(addr.length() > 0)
 addr.append(",");
 addr.append(adapter.getValueAt(j, 3));
 if(j != m - 1 && (new StringBuilder()).append(adapter.getValueAt(j, 0)).append(" ").append(adapter.getValueAt(j, 1)).append(" ").append(adapter.getValueAt(j, 4)).toString().equals((new StringBuilder()).append(adapter.getValueAt(j + 1, 0)).append(" ").append(adapter.getValueAt(j + 1, 1)).append(" ").append(adapter.getValueAt(j + 1, 4)).toString()))
 continue;
   try
 {
     String subject = Toolbox.emsgs(orgnum,500) +  "(" + adapter.getValueAt(j, 0) + " " + adapter.getValueAt(j, 1) + ")" + Toolbox.emsgs(orgnum,289);
     String msg = Toolbox.emsgs(orgnum,500) +  "(" + adapter.getValueAt(j, 0) + " " + adapter.getValueAt(j, 1) + ")" + Toolbox.emsgs(orgnum,289) + ": " + Toolbox.timestr(Long.parseLong(adapter.getValueAt(j, 0))) + "\n(" + Toolbox.emsgs(orgnum,1494) + ")";
     String fromemailaddr = Toolbox.dbadmin[orgnum%65536].stmpuser + "@" + Toolbox.dbadmin[orgnum%65536].stmphost.replaceFirst(".*\\.([^\\.]+\\.[^\\.]+)", "$1"); 
     telaman.Email.postMail(addr.toString().split(","), subject, msg, fromemailaddr,null, orgnum);  
 }
 catch(Exception e)
 {
 Toolbox.println(0, e.toString());
 }
 addr.setLength(0);
 }
 

 adapter.close();
 }

}

else if (x.equals("assignemail"))
{
    if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR | Systemroles.SYSTEMADMIN | Systemroles.TEACHINGADMIN,application,session,request, response, "follows.jsp?x=assignemail", true)) == null) 
    {
        out.println("<script>parent.myprompt('" + Toolbox.emsgs(orgnum,11) + "');</script>");
        return;
    }
    orgnum = user.orgnum; 
    String semester = Toolbox.defaultParam(orgnum,request, "Semester", null);
    if (semester == null || !semester.equals(Toolbox.dbadmin[orgnum%65536].currentSemester))
    {
        out.println("<script>parent.myprompt('" + Toolbox.emsgs(orgnum,1474) + "??');</script>");
        return;
    }
    String atype = Toolbox.defaultParam(orgnum,request, "Type", null,null,20);
    String url = Toolbox.defaultParam(orgnum,request, "source", null);
    
    boolean needattach = (url.charAt(0) == '1');
    url = url.substring(1);
    if (url.indexOf("http://localhost") == 0 || url.indexOf("http://127.0.0.1") == 0|| url.indexOf("http://192.168.") == 0)
        url = "";
    
    String emsg = "";
    int jj = url.indexOf("\n");
    if (jj > 0) 
    {
        emsg = url.substring(jj+1);
        url = url.substring(0,jj);
    }
    String phonens = "";
    String course = Toolbox.defaultParam(orgnum,request, "course", null,null,20);
    String coursetitle =  Toolbox.defaultParam(orgnum,request, "coursetitle", course);
    String assignname = Toolbox.defaultParam(orgnum,request, "Name", null);
    String sessions = Toolbox.defaultParam(orgnum,request, "Sessions", null);
    String start  = Toolbox.defaultParam(orgnum,request, "Start", null);
    String options =  Toolbox.defaultParam(orgnum,request, "Options", "");
    String []ss = sessions.replaceFirst("^,","").replaceFirst(",$","").split(",");
    String ids = "";
    String sql = "SELECT AppUser.email,0, id,phone FROM AppUser WHERE id='" + user.id + "'";
    for (int j = 0; j < ss.length; j++)
    {
        sql += " UNION SELECT AppUser.email," + (j+1) + ",AppUser.id,phone FROM AppUser, Session, Registration WHERE Registration.semester='" + semester + "' and Registration.courseid='" + course + "' AND Registration.sessionname='" + ss[j] + "' and Registration.sid=AppUser.id AND Session.courseid='" + course + "' AND Session.name='" + ss[j] + "' and Session.semester='" + semester + "'";
    }
    sql += " order by 2";
    user.changedb(user.id);
    
    JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
    if (!adapter.error().equals(""))
    {
        adapter.close();
        out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
        return;
    }
    int m = adapter.executeQuery(sql);
    String err = ""; 
    String hisown = adapter.getValueAt(0,0);
    String addr = "";
    for (int j=0; j < m; j++)
    {
        String z = adapter.getValueAt(j,0);
        if (z == null || z.equals("") || !z.matches("[a-z|A-Z|0-9|\\-|\\.|]+@[a-z|A-Z|0-9|\\-|\\.|]+"))
        {
            err += adapter.getValueAt(j,2) + " bad " + Toolbox.emsgs(orgnum,553) + ": " + z + "<br>"; 
            continue;
        }
        addr += "," + adapter.getValueAt(j,0) ;
        if (j> 0)
        {
            if (!phonens.equals("")) ids += " ";
            String yy = adapter.getValueAt(j,3); 
            if (yy==null) yy = "";else yy = yy.replaceAll(" ","");
            phonens +=  yy;
        }
    }
    long l = 0; 
    if(!addr.equals(""))
    {     
   
        String zipfname = null;
        String msg = "";
        String subject = "";
        l = System.currentTimeMillis()/1000; 

        if (atype!=null && (atype.equals("0") || atype.equals("1")))
        {
            if (needattach)
            {
                String fileprefix = "hmwk"; 
                Encode6b encoder =  new Encode6b(orgnum);
                String fnm = encoder.to6b(assignname);
                if (fnm.length() > 10) 
                    fnm = fnm.substring(fnm.length()-10);
                fileprefix += fnm;
                zipfname =user.webFileFolder + File.separator + course + File.separator + UploadFile.pfolders[1] + File.separator + fileprefix + ".zip";

                if ( (new File(zipfname)).exists() == false)
                {
                    zipfname = null;
                    needattach = false;
                }
            }
            if (needattach)
            {
                msg = coursetitle + "\n" +  Toolbox.emsgs(orgnum,500) +   " \"" + assignname + "\" " + Toolbox.emsgs(orgnum,1496) + ":" +   start + "\n\n" + Toolbox.emsgs(orgnum,1495) + "\n\n" + Toolbox.emsgs(orgnum,1494)  + "\n\n" +  url;
            }
            else
            {
                msg = coursetitle + " " +  Toolbox.emsgs(orgnum,500) +   " \"" + assignname + "\" " + Toolbox.emsgs(orgnum,1496)  + " " +   start + "\n\n" +Toolbox.emsgs(orgnum,1494)  + "\n\n"  + url;
            }
            subject = coursetitle + " " +  Toolbox.emsgs(orgnum,500) +   " " + assignname;
        }
        else
        {
            msg =     coursetitle + " " +  Toolbox.emsgs(orgnum,469) +  " \"" +  assignname + "\" " + Toolbox.emsgs(orgnum,1496) + " " +  start  + "\n\n" + Toolbox.emsgs(orgnum,1494)+ "\n\n" + url;
            subject = coursetitle + " " +  Toolbox.emsgs(orgnum,469) +  "  " +  assignname + "";
        }
        if (!emsg.equals(""))
        {
            msg = emsg;
            subject += " " + Toolbox.emsgs(orgnum,29);
        }
        phonens  += ";;" + msg.replaceFirst("\n\n.*","");
        try
        {
            err += telaman.Email.postMail(addr.substring(1).split(","), subject, msg, hisown, zipfname, orgnum);
            options = options.replaceFirst("^et:0", "et:" + l ); 
            sql = "UPDATE Assignment SET options='" + options + "' WHERE semester='" + semester + "' and atype=" + atype + " and  course='" + course + "' and  name='" + assignname + "' and  sessionname='" + sessions + "'";
            String keystr =  (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + sessions; 
            String   info = Toolbox.dbadmin[orgnum%65536].cache.get(keystr);
            if (info != null)
            {
                synchronized(this){Toolbox.dbadmin[orgnum%65536].cache.put(keystr, info.replaceFirst("([0-9]+,[0-9]+,[0-9],').*(','[^']*')$","$1" + options.replaceAll("'","''") + "$2" ));  }  
             }
      
            adapter.executeUpdate(sql);
        }
        catch(Exception e){err += Generic.handle(e.toString().replaceAll("\n","<br>"));}
        if (err.equals("")) err = Toolbox.emsgs(orgnum,71); 
    }
    adapter.close();
    
    adapter = Toolbox.getSysAdapter(user.orgnum); adapter.orgnum = orgnum;
    int mm = adapter.executeQuery(sql);
    if (err.equals("")) err = Toolbox.emsgs(orgnum,553) + " " + Toolbox.emsgs(orgnum,1531); 
    url = Toolbox1.url;
    if (url==null || url.equals(""))
        url = Toolbox1.geturl(request).replaceFirst("follows\\.jsp.*","");
    err += telaman.Email.hintforSMS( adapter,  l,  user,  phonens,  url,  orgnum);
    err = Generic.handle(err);
    adapter.close();
    out.println("<script>parent.setemailtime(" + l +",\"" + err + "\");</script>");
}  
else if (x.equals("assignsms"))
{
    
    if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR | Systemroles.SYSTEMADMIN | Systemroles.TEACHINGADMIN,application,session,request, response, "follows.jsp?x=assignemail", true)) == null) 
    {
        out.println("<script>parent.myprompt('" + Toolbox.emsgs(orgnum,11) + "');</script>");
        return;
    }
    orgnum = user.orgnum; 
    String semester = Toolbox.defaultParam(orgnum,request, "Semester", null);
    if (semester == null || !semester.equals(Toolbox.dbadmin[orgnum%65536].currentSemester))
    {
        out.println("<script>parent.myprompt('" + Toolbox.emsgs(orgnum,1474) + "??');</script>");
        return;
    }
    String atype = Toolbox.defaultParam(orgnum,request, "Type", null,null,20);
    String url = Toolbox.defaultParam(orgnum,request, "source", null);
    
    boolean needattach = (url.charAt(0) == '1');
    url = url.substring(1);
    if (url.indexOf("http://localhost") == 0 || url.indexOf("http://127.0.0.1") == 0|| url.indexOf("http://192.168.") == 0)
        url = "";
    
    String emsg = "";
    int jj = url.indexOf("\n");
    if (jj > 0) 
    {
        emsg = url.substring(jj+1);
        url = url.substring(0,jj);
    }
    String phonens = "";
    String course = Toolbox.defaultParam(orgnum,request, "course", null,null,20);
    String coursetitle =  Toolbox.defaultParam(orgnum,request, "coursetitle", course);
    String assignname = Toolbox.defaultParam(orgnum,request, "Name", null);
    String sessions = Toolbox.defaultParam(orgnum,request, "Sessions", null);
    String start  = Toolbox.defaultParam(orgnum,request, "Start", null);
    String options =  Toolbox.defaultParam(orgnum,request, "Options", "");
    String []ss = sessions.replaceFirst("^,","").replaceFirst(",$","").split(",");
    String ids = "";
    String sql = "SELECT AppUser.email,0, id,phone FROM AppUser WHERE id='" + user.id + "'";
    for (int j = 0; j < ss.length; j++)
    {
        sql += " UNION SELECT AppUser.email," + (j+1) + ",AppUser.id,phone FROM AppUser, Session, Registration WHERE Registration.semester='" + semester + "' and Registration.courseid='" + course + "' AND Registration.sessionname='" + ss[j] + "' and Registration.sid=AppUser.id AND Session.courseid='" + course + "' AND Session.name='" + ss[j] + "' and Session.semester='" + semester + "'";
    }
    sql += " order by 2";
    user.changedb(user.id);
    
    JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
    int m = adapter.executeQuery(sql);
    String err = ""; 
 
    
    String hisown = adapter.getValueAt(0,0);
    String addr = "";
    for (int j=0; j < m; j++)
    {
        String z = adapter.getValueAt(j,0);
        if (z == null || z.equals("") || !z.matches("[a-z|A-Z|0-9|\\-|\\.|]+@[a-z|A-Z|0-9|\\-|\\.|]+"))
        {
            err += adapter.getValueAt(j,2) + " bad " + Toolbox.emsgs(orgnum,553) + ": " + z + "<br>"; 
            continue;
        }
        addr += "," + adapter.getValueAt(j,0) ;
        if (j> 0)
        {
            if (!phonens.equals("")) ids += " ";
            String yy = adapter.getValueAt(j,3); 
            if (yy==null) yy = "";else yy = yy.replaceAll(" ","");
            phonens +=  yy;
        }
    }
    long l = 0; 
    if(!addr.equals(""))
    {     
   
        String zipfname = null;
        String msg = "";
        String subject = "";
        l = System.currentTimeMillis()/1000; 

        if (atype!=null && (atype.equals("0") || atype.equals("1")))
        {
            if (needattach)
            {
                String fileprefix = "hmwk"; 
                Encode6b encoder =  new Encode6b(orgnum);
                String fnm = encoder.to6b(assignname);
                if (fnm.length() > 10) 
                    fnm = fnm.substring(fnm.length()-10);
                fileprefix += fnm;
                zipfname =user.webFileFolder + File.separator + course + File.separator + UploadFile.pfolders[1] + File.separator + fileprefix + ".zip";

                if ( (new File(zipfname)).exists() == false)
                {
                    zipfname = null;
                    needattach = false;
                }
            }
            if (needattach)
            {
                msg = coursetitle + "\n" +  Toolbox.emsgs(orgnum,500) +   " \"" + assignname + "\" " + Toolbox.emsgs(orgnum,1496) + ":" +   start + "\n\n" + Toolbox.emsgs(orgnum,1495) + "\n\n" + Toolbox.emsgs(orgnum,1494)  + "\n\n" +  url;
            }
            else
            {
                msg = coursetitle + " " +  Toolbox.emsgs(orgnum,500) +   " \"" + assignname + "\" " + Toolbox.emsgs(orgnum,1496)  + " " +   start + "\n\n" +Toolbox.emsgs(orgnum,1494)  + "\n\n"  + url;
            }
            subject = coursetitle + " " +  Toolbox.emsgs(orgnum,500) +   " " + assignname;
        }
        else
        {

            msg =     coursetitle + " " +  Toolbox.emsgs(orgnum,469) +  " \"" +  assignname + "\" " + Toolbox.emsgs(orgnum,1496) + " " +  start  + "\n\n" + Toolbox.emsgs(orgnum,1494)+ "\n\n" + url;
            subject = coursetitle + " " +  Toolbox.emsgs(orgnum,469) +  "  " +  assignname + "";
        }
        if (!emsg.equals(""))
        {
            msg = emsg;
            subject += " " + Toolbox.emsgs(orgnum,29);
        }
        phonens  += ";;" + msg.replaceFirst("\n\n.*","");
        
        if (err.equals("")) err = Toolbox.emsgs(orgnum,71); 
    }
    adapter.close();
    
    adapter =Toolbox.getSysAdapter(user.orgnum); adapter.orgnum = orgnum;
   // int mm = adapter.executeQuery(sql);
    if (err.equals("")) err = Toolbox.emsgs(orgnum,553) + " " + Toolbox.emsgs(orgnum,1531); 
    url = Toolbox1.url;
    if (url==null || url.equals(""))
        url = Toolbox1.geturl(request).replaceFirst("follows\\.jsp.*","");
    err += telaman.Email.hintforSMS( adapter,  l,  user,  phonens,  url,  orgnum);
    err = Generic.handle(err);
    adapter.close();
    out.println("<script>parent.setemailtime(-1,\"" + err + "\");</script>");
}    
else if (x.equals("memory")) 
{
    
}
else if ( x.equals("latepermit"))
{
    String cid = Toolbox.defaultParam(orgnum,request, "course", null);
    String sid = Toolbox.defaultParam(orgnum,request, "sid", null);
    String sessions = Toolbox.defaultParam(orgnum,request, "sessions", null);
    String grade = Toolbox.defaultParam(orgnum,request, "grade", null);
   
    if (cid !=null && !cid.equals(""))
    {
        if ( (user = User.authorize(orgnum, Systemroles.SYSTEMADMIN | Systemroles.INSTRUCTOR, application,session,request, response, "follows.jsp", false)) == null) 
        {out.println("<script>parent.setlateinfo('');</script></body></html>");return;}
        JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
        if (!adapter.error().equals(""))
        {
            adapter.close();
            out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
            out.println("<script>parent.setlateinfo('');</script></body></html>");
            return;
        }
       
        String sql = "SELECT latepermit,name,due FROM Assignment WHERE course='" + cid  + "' AND semester='"   + Toolbox.dbadmin[orgnum%65536].currentSemester + "'";
        if (sessions!=null)
               sql += " AND sessionname='" + sessions + "' ";
        else if (sid!= null)
               sql += " AND (latepermit LIKE '" + sid + ",%' OR latepermit LIKE '%;" + sid + ",%' )"  ;
        long t = 0;
       
        int n = adapter.executeQuery(sql);
       
        String str = "";
        if (sid == null)
        {
            HashMap<String,Integer> counts = new HashMap();
            HashMap<String,Float> total = new HashMap();
            for (int i=0; i < n; i++)
           {
            String latepermit = adapter.getValueAt(i,0);
            if (latepermit == null || latepermit.equals("")) continue;
            
        
            CSVParse p = new CSVParse(latepermit, '|', new String[]{",",";"});
            String [][] m = p.nextMatrix();
            
            
            for (String [] x01:m)
            {
                 if (x01.length != 2) continue;
                 sid = x01[0]; float f = 0;
                 try{ f = Float.parseFloat(x01[1]);}catch(Exception e1){continue;}
                 if (f <= 0) continue;
                 if (counts.get(sid) == null)
                 {
                      counts.put(sid, 1); 
                      total.put(sid, f);
                 }
                 else
                 {
                      counts.put(sid, counts.get(sid).intValue() + 1); 
                      total.put(sid, f + total.get(sid).floatValue() + f);
                 }
            }
            
            }
           
            str = ""; 
            Set<String> s = counts.keySet();
            TreeSet<String> z = new TreeSet();
            for(String sd: s) z.add(sd);
            
            for(String sd: z) 
            {
                str +=  ";" +   sd + "," + counts.get(sd) + "," +  String.valueOf((int)(total.get(sd).floatValue()*10)).replaceFirst("(.)$", ".$1") ; 
            }
        }
        else if (sid!=null)
        {
            for (int i=0; i < n; i++)
            {
                String latepermit = adapter.getValueAt(i,0);
                String duestr = adapter.getValueAt(i,2);
                long dues[] = new long[1];
                dues[0] = Long.parseLong(duestr);
                long f = Toolbox1.extent(latepermit + ";$", sid, dues);
                
                t += (f );
                if (grade == null) 
                   str += ";" + adapter.getValueAt(i,1) + ":" + String.valueOf(f/360/24).replaceFirst("(.)$", ".$1"); 
                else
                   str += ";" + adapter.getValueAt(i,1) + ":" + dues[0] + ":" + String.valueOf(f/360/24).replaceFirst("(.)$", ".$1"); 
            }
        }
        adapter.close();
      
        if (sessions!=null)
            out.println("<script>parent.setlateinfo(\"" + str + "\");</script>");
        else  
            out.println("<script>parent.setlateinfo('" + str   + "'," + n +"," + String.valueOf(t/360/24).replaceFirst("(.)$", ".$1") + ");</script>");
         // out.println("<script>parent.alert(\"" +  str + "\");</script>");
    }
}
else if ( x.equals("extenddue"))
{
    // subdb,semester,course,sessions,assignname,sid,newdue
    String subdb = Toolbox.defaultParam(orgnum,request, "subdb", null, null,40);
    String semester = Toolbox.defaultParam(orgnum,request, "semester", Toolbox.dbadmin[orgnum%65536].currentSemester, null, 10);
    String cid = Toolbox.defaultParam(orgnum,request, "course", null, "_-", 40);
    String sessions = Toolbox.defaultParam(orgnum,request, "sessions", null, "-_,", 60);
    
    String assignname = Toolbox.defaultParam(orgnum,request, "assignname", null,"-_.*@~+", 60);
 
    String sid = Toolbox.defaultParam(orgnum,request, "sid", ""); 
 
    String newdue = Toolbox.defaultParam(orgnum,request, "newdue", null);
   
    if (cid!=null  && newdue!=null && !cid.equals(""))
    {
        if ( (user = User.authorize(orgnum, Systemroles.SYSTEMADMIN | Systemroles.INSTRUCTOR, application,session,request, response, "follows.jsp", false)) == null) 
        {
            out.println("</body></html>");return;
        }
        JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
        if (!adapter.error().equals(""))
        {
               adapter.close();
               out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
               return;
        }
        String strv = "";
        String whereclause = "  WHERE course='" + cid  + "' AND  semester='" + semester + "' AND (sessionname='" + sessions + "' OR sessionname LIKE '%" + sessions + "%') AND name='"
                     + assignname + "'";
        if (!sid.equals(""))
        {
            String sql = "SELECT due, latepermit FROM Assignment " + whereclause;
            int t = 0;
            int n = adapter.executeQuery(sql);
  
            if (n == 1)
            {
                String y = adapter.getValueAt(0,0);
                try{
                   long due = Long.parseLong(y);
                   long v = Math.round((Long.parseLong(newdue) - due)/360/24);
 
                   if (v > 0)
                   {
                      strv = ("" + v).replaceFirst("(.)$", ".$1");
                      String latepermit = adapter.getValueAt(0,1);
                      if (latepermit == null) latepermit = "";
                      else latepermit = latepermit.replaceFirst("^[\\||;|,]","").replaceFirst("[\\||;|,]$","");
                      CSVParse p = new CSVParse(latepermit, '|', new String[]{",", ";"});
                      String [] row = null;
                      String back = "";
                      boolean hit = false; 
                      while ( (row = p.nextRow())!=null && row.length==2)
                      {
                         if (!back.equals(""))
                            back += ";";
                         back += row[0] + ",";
                         if (!row[0].equals(sid))
                            back += row[1].replaceFirst("^\\-","");
                         else
                         {back += strv; hit = true;}
                       }
                      if (!hit) 
                      {
                           if (back.equals("")) back = sid + "," + strv;
                           else back += ";" + sid +  ","+ strv;
                      }
                      sql = "UPDATE Assignment SET latepermit='" + back + "' " +whereclause;
 
                      if (1==adapter.executeUpdate(sql))
                      {
                          String keystr =  (orgnum%65536) + "|" + semester + "|" + cid + "|" + assignname + "|" + sessions;
                          String   info = Toolbox.dbadmin[orgnum%65536].cache.get(keystr);
                          if (info != null)
                          {
                              synchronized(this){ Toolbox.dbadmin[orgnum%65536].cache.put(keystr, info.replaceFirst("(.*')[^']+'$","$1" + back + "'" ));}     
                          }
                      }
                      else
                      {
                           strv = adapter.error();
                      }
                   }
                }catch(Exception e){}

            }
        }
        else
        {
            String sql = "UPDATE Assignment SET latepermit='" + newdue + "' " +whereclause;
            if (adapter.executeUpdate(sql) == 1) 
            {
                strv = "'" + newdue + "'";
                String keystr =  (orgnum%65536) + "|" + semester + "|" + cid + "|" + assignname + "|" + sessions;
                String   info = Toolbox.dbadmin[orgnum%65536].cache.get(keystr);
                if (info != null)
                {
                    synchronized(this){  Toolbox.dbadmin[orgnum%65536].cache.put(keystr, info.replaceFirst("(.*')[^']+'$","$1" + newdue + "'" )); }    
                }
            }
        }
        adapter.close(); 
        out.println("<script>parent.doneextend(" + strv + ");</script>");
    }
}
else if (x.equals("askquestion"))
{   
 
    if ( (user = User.authorize(orgnum, Systemroles.STUDENT | Systemroles.INSTRUCTOR, application,session,request, response, "follows.jsp", false)) == null) 
        {out.println("</body></html>");return;}
    String course = Toolbox.defaultParam(orgnum,request,"course",null);
    String askee = Toolbox.defaultParam(orgnum,request,"askee",null);
    String subdb = Toolbox.defaultParam(orgnum,request,"subdb",null);
    String posttime = Toolbox.defaultParam(orgnum,request,"posttime",null);
    String ftime = posttime; 
    try{
    long l = Long.parseLong(posttime);
  //  ftime = Toolbox.timestr(l, "MM/DD hh:mm"); 
    }catch(Exception e){}
    String assignname = Toolbox.defaultParam(orgnum,request,"assignname",null);
    String msg = "!!" + subdb + ":" + course+":"+ assignname; 
    Toolbox.msgqueueput((orgnum%65536) + askee, msg);
 
    String forme =  Toolbox.msgqueueget((orgnum%65536) + user.id, course+":"+ assignname);
    out.println("<script>try{");
    if (!forme.equals(""))
        out.println("parent.appendmsg(\""  +  Generic.handle(forme) + "\");");
    out.println("parent.appendmsg(timestr(" + posttime + ",'" + cachedstyle.timeformat + "') + parent.textmsg[1895]);\n}catch(e){alert(''+e);}</script></body></html>");return;
}
else if (x.equals("retrivequestion"))
{   
 
    if ( (user = User.authorize(orgnum,Systemroles.TA | Systemroles.STUDENT | Systemroles.INSTRUCTOR, application,session,request, response, "follows.jsp", false)) == null) 
        {out.println("</body></html>");return;}
    String sca = Toolbox.defaultParam(orgnum,request,"sca","");
    
    String order = Toolbox.defaultParam(orgnum,request,"order","");
    String scas[] =(sca).split(":");
    String subdb = scas[0], course =  scas[1], assignname = scas[2];
    String subject = course + ":" + assignname + ":" +  Toolbox.dbadmin[orgnum%65536].currentSemester + ":";  
    user.changedb(subdb);
    JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
    String sql = "SELECT sid,subject,content,format,subdb,firstname, lastname,postdate FROM Message,AppUser WHERE Message.sid=AppUser.id AND  subject LIKE '" + subject + "%' AND rid='" + user.id + "' AND suppress=0 ORDER BY sid, postdate";
    int nn =adapter.executeQuery(sql); 
     
    StringBuffer b = new StringBuffer("<table cellspacing=1 cellpadding=3>");
    String msg = "";
    
    for (int i=0; i < nn; i++)
    {
        String sid = adapter.getValueAt(i,0);
        subject = adapter.getValueAt(i,1);
        String content = adapter.getValueAt(i,2);
        String format = adapter.getValueAt(i,3);
        String id = "t" + order + "_" + i;
        String fname = Toolbox.makeFullName(adapter.getValueAt(i,6), "", adapter.getValueAt(i,5));
        String posttime = adapter.getValueAt(i,7);
        String ftime = posttime; 
        try{
            long l = Long.parseLong(posttime);
          //  ftime = Toolbox.timestr(l, "MM/DD hh:mm"); 
        }catch(Exception e){}
        String fcontent =  Toolbox.formatstr(format, "(" + ftime + ") "+ content );
        msg += fcontent;
        String saveto = "<tr><td  id=" + id + " class=outset1 style=\"border:1px #888 solid;border-radius:4px\" align=center><span style=float:left;white-space:nowrap><a href=studentpage.jsp?sid="+
        sid +  "&mode=instructor target=_blank>"+ fname + "</a> " 
        + Toolbox.emsgs(orgnum,618).toLowerCase() + " <b>"+ course+"-"+ assignname + "</b>:</span><br><div style=float:left;text-align:left >" + fcontent
        + "</div><br><textarea rows=3 cols=40></textarea><input style=width:76px  type=button id=replybutton class=GreenButton value=Reply onload=\"javascript:this.value=textmsg[1486];\"  onclick=replyaskquestion(this,'" + subdb + "','" + sid + "','" + user.id + "'," + posttime + ",'" + course+":"+ assignname + "') "
        + " ><input style=width:76px  type=button id=replybutton class=OrangeButton value=Ignore onload=\"javascript:this.value=textmsg[1570];\"  onclick=replyaskquestion(this,'" + subdb + "','" + sid + "','" + user.id + "'," + posttime + ") "
        + " ></td></tr>";
        msg = ""; 
        b.append(saveto);
    }
    b.append("</table>");
    adapter.close(); 
    %>
    <script>parent.displayquestion(<%=order%>,
     "<%= Generic.handle(b.toString()) %>");</script></body></html>
   <% return;

} 
else if (x.equals("replyquestion"))
{   
 
    if ( (user = User.authorize(orgnum, Systemroles.TA | Systemroles.INSTRUCTOR, application,session,request, response, "follows.jsp", false)) == null) 
        {out.println("</body></html>");return;}
    String subdb = Toolbox.defaultParam(orgnum,request,"subdb",null);
    String rid = Toolbox.defaultParam(orgnum,request,"rid",null);
    String posttime = Toolbox.defaultParam(orgnum,request,"posttime",null);
    String asker = Toolbox.defaultParam(orgnum,request,"sid",null);
    String topic = Toolbox.defaultParam(orgnum,request,"topic",null);
    String msg =  Toolbox.defaultParam(orgnum,request,"msg","");
    if (asker!=null)
    {
        asker = asker.trim(); 
        if (!msg.equals(""))
        {
            if (request.getParameter("hex") != null)
               msg = Msgsend.back(msg);
            String ftime = posttime; 
            try{
            long l = Long.parseLong(posttime);
            //ftime = Toolbox.timestr(l, "MM/DD hh:mm"); 
            }catch(Exception e){}
            Toolbox.msgqueueput((orgnum%65536) + asker,topic + "(" + ftime + ")" + msg);
 
        }
    }
    if (topic != null && !msg.equals(""))
    {
        user.changedb(subdb);
        JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
        String sql = "UPDATE Message SET suppress=1 WHERE sid='" + asker + "' AND rid='" + user.id+ "' AND postdate=" + posttime;  
        int nn = adapter.executeUpdate(sql);
 
        long nowt = System.currentTimeMillis()/1000;
        sql = "INSERT INTO Message(lastupdate,sid,rid,postdate,subject,content,suppress,format,subdb,attach) VALUES(" 
        + nowt + ",'" + user.id 
        + "','" + asker 
        + "'," + nowt
        + ",'Re: " + topic
        + "','" + msg.replace("'","''")
        + "',0,'0','" + subdb
        + "','')";
        nn =adapter.executeUpdate(sql);
 
       adapter.close();  
    }
    
    out.println("</body></html>");
    return;
}
else if (x.equals("checkquestion"))
{ 
 
    if ( (user = User.authorize(orgnum, Systemroles.STUDENT | Systemroles.INSTRUCTOR, application,session,request, response, "follows.jsp", false)) == null) 
        {out.println("</body></html>");return;}
    String course = Toolbox.defaultParam(orgnum,request,"course",null);
    String assignname = Toolbox.defaultParam(orgnum,request,"assignname",null);
    
    String forme = Toolbox.msgqueueget((orgnum%65536)+ user.id, course + ":" + assignname);
    if (!forme.equals(""))
    {
        out.println("<script>");
        out.println("parent.questionasked = false;\nlet ugentmsg=\"" 
                   +  Generic.handle(forme) + "\";");
        out.println("parent.appendmsg(ugentmsg);\nparent.myprompt(ugentmsg,null,null,'" + Toolbox.emsgs(orgnum,612) +  "');");
        out.println("</script>");
    }
     
    out.println("</body></html>");return;
}
else if (x.equals("savetempg"))
{
    String course = Toolbox.defaultParam(orgnum,request,"course","", null, 30);
    String  semester = Toolbox.defaultParam(orgnum,request,"semester","", null, 10);
    String sessionname = Toolbox.defaultParam(orgnum,request,"sessionname","", null, 30);
    String grades[] = Toolbox.defaultParam(orgnum,request,"grades","", ":;", 4000).split(";"); 
    String subdb =  Toolbox.defaultParam(orgnum,request,"subdb","", null, 30);
    if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR | Systemroles.SYSTEMANALYST | Systemroles.TEACHINGADMIN,application,session,request, response, "follows.jsp", false)) == null) 
        return;
    user.changedb(subdb);
    JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
    for (int i=0; i < grades.length; i++)
    {
       String sql1 = "UPDATE Registration SET grade='" + grades[i].replaceFirst(":","' WHERE sid='") + "' AND courseid='" + course + "' AND semester='" + semester + "' AND sessionname='" + sessionname + "'";
       int nn =adapter.executeUpdate(sql1); 
    } 
    adapter.close();
    out.println("<script>parent.savedtempgrade();</script>");
    out.println("</body></html>");return;
}
else if (x.equals("gradethresh"))
{
    String thresh = Toolbox.defaultParam(orgnum,request,"xxx","", null, 200);
    String [] gradearr = thresh.split("@");
    String course = Toolbox.defaultParam(orgnum,request,"course","", null, 30);
    String  semester = Toolbox.defaultParam(orgnum,request,"semester","", null, 10);
    String sessionname = Toolbox.defaultParam(orgnum,request,"sessionname","", null, 30);
    String subdb =  Toolbox.defaultParam(orgnum,request,"subdb","", null, 30);
    
    if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR | Systemroles.SYSTEMANALYST | Systemroles.TEACHINGADMIN,application,session,request, response, "follows.jsp", false)) == null) 
        return;
    user.changedb(subdb);
    JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
     for (int i=0; i < gradearr.length/2; i++)
   {
       
     String sql = "INSERT INTO Gradethresh(semester,course,system, grade,threshhold,numericvalue,session) VALUES('" 
    + semester + "','" + course + "'," +   Toolbox.dbadmin[orgnum%65536].gradeSystem  + ",'" + gradearr[2*i] + "'," + gradearr[2*i+1] + ",4,'" + sessionname + "')";
     String sql1 = "UPDATE Gradethresh SET threshhold=" + gradearr[2*i+1] + " WHERE  system=" + Toolbox.dbadmin[orgnum%65536].gradeSystem + " and grade='" + gradearr[2*i] + "' AND course='" + course + "' AND   semester='" + semester + "' AND session='" + sessionname + "'";
     int nn =adapter.executeUpdate(sql1); 
     
     if (nn!=1) nn = adapter.executeUpdate(sql); 
     
    } 
    out.println(thresh + "........<script>parent.closeprompt();</script>");
}
else if (x.equals("sessionadd"))
{
    String courseid = Toolbox.defaultParam(orgnum,request,"courseid","", null, 20);
    String coursetitle = Toolbox.defaultParam(orgnum,request,"coursetitle","/_,+\":", null, 120);
    String email = Toolbox.defaultParam(orgnum,request,"email","", "_@", 80);
    String sessionname = Toolbox.defaultParam(orgnum,request,"sessionname","", null, 60);
    String deptstr = Toolbox.defaultParam(orgnum,request,"depts","","_:",60);
    String url = Toolbox.defaultParam(orgnum,request, "url", null);
    String newdept = Toolbox.defaultParam(orgnum,request,"anewsemester","/_,+\":", null, 120);
     
    if ( (user = User.authorize(orgnum,Systemroles.STUDENT  | Systemroles.INSTRUCTOR | Systemroles.SYSTEMANALYST | Systemroles.TEACHINGADMIN,application,session,request, response, "follows.jsp", false)) == null) 
        return;
    String uid = user.id;
    user.changedb(null);
    JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
    String sql = "select id, name FROM Department where id='" + deptstr + "'";
    String allsql[] = new String[14];
    int numsql = 0;
    long ll = System.currentTimeMillis()/1000-120;
    if (adapter.executeQuery(sql) == 0)
    {
        sql = "select id  FROM Department";

        if (adapter.executeQuery2(sql,false))
        {
            int M = 0, q = 0;
            for (int k=0; adapter.getValueAt(k,0)!=null; k++)
            {
               try
               { 
                   q = Integer.parseInt(adapter.getValueAt(k,0).replaceFirst("^[0]+","")); 
                   if (q>M) M = q;
               }catch(Exception e){}
            }
            M++;
            deptstr = "" + M;
            if (M < 10) 
               deptstr = "0" + M;
            allsql[numsql++] = "INSERT INTO Department(lastupdate,id,name,college,location,telephone,director,notes)values(" + ll +  ",'" + deptstr + "','" + newdept + "','','','',NULL,'')";
        }
    }
  
    sql = "select firstname, lastname, email from AppUser where id='" + uid + "'";
    int nn = adapter.executeQuery(sql);
    
    String sname = "", semail="";
    if (nn==1)
    {    
        sname = adapter.getValueAt(0,0) + " " + adapter.getValueAt(0,1);
        semail = adapter.getValueAt(0,2);
    }
    String sname1 = "01"; 
    sql = "SELECT name  from Session WHERE semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester + "' AND courseid='20-101'";
    nn = adapter.executeQuery(sql);
    
    if (nn==1)
    {
        int kk = 0;
        if (adapter.getValueAt(0,0)!=null)
        try
        { 
            kk = Integer.parseInt(adapter.getValueAt(0,0).replaceFirst("^[0]+","")); 
        }catch(Exception e){} 
        kk += 1; 
        sname1 = "" + kk;
        if (sname1.length()==1) 
            sname1 = "0" + sname1;
    }
    sql = "select id from AppUser where email='" + email + "'";
    nn = adapter.executeQuery(sql);
    boolean hasu = false;
    String eid = ""; 
    String tbd2 = Toolbox.emsgs(orgnum, 2);
    String tbd3 = Toolbox.emsgs(orgnum, 3);
    boolean newu = false; 
    if (nn > 0)
    {
       eid = adapter.getValueAt(0,0);
       hasu = true;
    }   
    else
    {
       String eid0 = email.replaceFirst("@.*","");
       eid = eid0.replaceFirst(".",""); int n=0;
       
       while (true) 
      {
           sql = "select id from AppUser where id='" + eid + "'";
           nn = adapter.executeQuery(sql);
           if (nn == 0) 
           {
               newu = true;
               allsql[numsql++] = "INSERT INTO Faculty(lastupdate,id,title,degree,institution,school,position,hiredate) VALUES(" + ll + ",'" + eid + "','Dr.','" + tbd3 + "','" + tbd3 + "','" + tbd3 + "','" + tbd3 + "'," + (ll-20000) + ")";
               allsql[numsql++] = "INSERT INTO AppUser(lastupdate,id,roles,email,lastname,firstname,password,department,logincount,fontsize) VALUES(" + ll + ",'" + eid + "',2,'" + email + "','"+ eid0 + "','" + eid0 + "','" +ll + "','" + tbd2 + "',0,15)";
               allsql[numsql++] = "INSERT INTO Session(lastupdate,name,courseid,semester,allowadd,allowdrop,schedule,room,notes,textbook,evaluationrule,seats,instructor,ta,progress,analysis,improve,assess,policy) VALUES(" +ll + ",'" + sname1 + "','20-101','" + Toolbox.dbadmin[orgnum%65536].currentSemester + "',1,1,'" + tbd3 + "','" + tbd3 + "','" + tbd3 + "','" + tbd3 + "','" + tbd3 +  "',25,'" + eid + "','" + tbd3 + "','" + tbd3 + "','','','" + tbd3 + "','" + tbd2 + "')";
               break;
          }
          eid = eid0 + (n++);
      }
    }
     
    allsql[numsql++] = "INSERT INTO OperationCourse(lastupdate,course,operation,forstudent, forgrading, forediting) VALUES (" + ll + ",'" + courseid + "','Preview',1, 1,1)";
    allsql[numsql++] = "INSERT INTO OperationCourse (lastupdate,course,operation,forstudent, forgrading, forediting) VALUES (" + ll + ",'" + courseid + "','Attacht',2, 2,2)";
    allsql[numsql++] = "INSERT INTO OperationCourse (lastupdate,course,operation,forstudent, forgrading, forediting) VALUES (" + ll + ",'" + courseid + "','Edit',3, 3, 3)";
    allsql[numsql++] = "INSERT INTO OperationCourse (lastupdate,course,operation,forstudent, forgrading, forediting) VALUES (" + ll + ",'" + courseid + "','Plagiarism',0, 4,0)"; 
    allsql[numsql++] = "INSERT INTO Course (lastupdate, id,title,objective,description,textbook,evaluationRule,prerequisite,notes,curr,credit,category,department,editable,goal,assessment,tuition)  VALUES(" + ll + ",'" + courseid + "','" + coursetitle + "','" + tbd3 + "','" + tbd3 + "','" + tbd3 + "','" + tbd3 + "','" + tbd3 + "','"  + tbd3  + "',1,3,'" + tbd3 + "','" + deptstr  + "',1,'" + tbd3 + "','" + tbd3  + "',1)";
    allsql[numsql++] = "INSERT INTO Session(lastupdate,name,courseid,semester,allowadd,allowdrop,schedule,room,notes,textbook,evaluationrule,seats,instructor,ta,progress,analysis,improve,assess,policy) VALUES(" +ll + ",'" + sessionname + "','" + courseid + "','" + Toolbox.dbadmin[orgnum%65536].currentSemester + "',1,1,NULL,'" + tbd3 + "','" + tbd3 + "','" + tbd3 + "','" + tbd3 +  "',25,'" + eid + "','" + tbd3 + "','" + tbd3 + "','" + tbd3 + "','" + tbd3 + "','" + tbd3 + "','" + tbd3 + "')";
    allsql[numsql++] = "INSERT INTO Registration(lastupdate,sid,courseid,sessionname,semester, status, grade,evaluation,attendance,target,decision) VALUES(" +  ll + ",'" + uid + "','" + courseid + "','" + sessionname + "','" + Toolbox.dbadmin[orgnum%65536].currentSemester + "',311,'','',0,'" + courseid + "',1)";
    allsql[numsql++] = "INSERT INTO Registration(lastupdate,sid,courseid,sessionname,semester, status, grade,evaluation,attendance,target,decision) VALUES(" +  ll + ",'" + uid + "','20-101','" + sname1 + "','" + Toolbox.dbadmin[orgnum%65536].currentSemester + "',311,'','',0,'20-101',1)";
     
     for (int k=0; k < numsql; k++)
     {
         nn = adapter.executeUpdate(allsql[k]);
         
     } 
   
    if (1==2) //url.indexOf("http://localhost") == 0 || url.indexOf("http://127.0.0.1") == 0|| url.indexOf("http://192.168.") == 0)
    {
        url = "";
    }
    else
    {
        if (newu) 
        {
            url +=  "follows.jsp?x=quicklogin&orgnum=" + orgnum + "&uid=" + eid; 
            url +=  "&temppass=" + ll;
            url +=  "&courseid=" + courseid +  "&sessionname=" + Toolbox.urlencode(sessionname);
        }
        else
           url +=  "index.jsp?orgnum=" + orgnum + "&id=" + eid; 
        String subject = courseid +"-" + sessionname + ":" + sname;  
        String msg = Toolbox.emsgs(orgnum,1571).replaceFirst("@",  uid + " " + sname + " (email: " + semail + ")")
                     .replaceFirst("@", courseid + " " + coursetitle + " " + sessionname ) + "\n" 
                     + url;  
        String fromemailaddr = Toolbox.dbadmin[orgnum%65536].stmpuser + "@" + Toolbox.dbadmin[orgnum%65536].stmphost.replaceFirst(".*\\.([^\\.]+\\.[^\\.]+)", "$1"); 
        String bad = telaman.Email.postMail(email.split(","), subject, msg, fromemailaddr,null, orgnum);
        if (bad.equals(""))
        {
        %>
        <script> 
            parent.parent.frames[0].openit6('<%=deptstr%>');
        </script>
        <%
        }
        else  
        { 
            if (!hasu) 
            {
                adapter.rollback();
            }
           %>
           <script> 
                parent.myprompt("<%=Generic.handle(bad)%>"); 
           </script>
           <%
        }
        adapter.close(); 
    }  
     
}
else if (x.equals("deleteass"))
{
   if ( (user = User.authorize(orgnum,  Systemroles.SYSTEMANALYST| Systemroles.INSTRUCTOR,application,session,request, response, "follows.jsp", false)) == null) 
 return;
    String courseid = Toolbox.defaultParam(orgnum,request,"course","", null, 20);
    String assignname = Toolbox.defaultParam(orgnum,request,"assignname","", null, 60);
    String subdb = Toolbox.defaultParam(orgnum,request,"subdb","", null, 60);
    String uid = user.id;
    user.changedb(subdb);
    JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
    String sql = "DELETE FROM Assignment WHERE course='" + courseid + "' AND name='" + assignname
    + "' and options LIKE '%" +  user.id + "%' AND semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester
 +"' AND '" + courseid + "' NOT IN (select course FROM Submission where course='" + courseid + "' AND assignname='"
+ assignname + "' AND semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester + "')" ;
    int n = adapter.executeUpdate(sql);
    adapter.close();
    if (n == 1)
{
 %>
        <script> 
            parent.myprompt('<%= Toolbox.emsgs(orgnum,71) + "<br><br><center><input type=button style=width:68px class=GreenButton value=\"" +Toolbox.emsgs(orgnum,82) + "\" onclick=parent.close() ></center>"%>');
            parent.parent.opener.parent.frames[0].openit1('studentassign.jsp');
            
        </script>
        <%
}
else
{
 %>
        <script> 
            parent.myprompt("<%= Toolbox.emsgs(orgnum,72)%>" );
        </script>
        <%
}
   
}
else if (x.equals("quicklogin"))
{
    String orgnum1 = Toolbox.defaultParam(orgnum,request,"orgnum","", null, 60);
    orgnum = Integer.parseInt(orgnum1);
    String uid = Toolbox.defaultParam(orgnum,request,"uid","", "@-_", 60);
    String pass = Toolbox.defaultParam(orgnum,request,"temppass","", null, 60);
    String courseid = Toolbox.defaultParam(orgnum,request,"courseid","", null, 20);
    String sessionname = Toolbox.defaultParam(orgnum,request,"sessionname","", ",-_+", 80);
    user = new User(orgnum);
    user.id = uid;
    user.retr();
    if (!user.password.equals(pass))
    {
        RequestDispatcher dispat = getServletConfig().getServletContext().getRequestDispatcher("/index.jsp?orgnum=" +orgnum); 
        dispat.forward(request, response);
         
    }
    else
   {
       RequestDispatcher dispat = getServletConfig().getServletContext().getRequestDispatcher("/index.jsp?orgnum=" +orgnum + "&eid=" + uid ); 
       dispat.forward(request, response);
       
   }
   return;
}
else if (x.equals("encode6b"))
{ 
    String link = Toolbox1.geturl(request);
    String course = Toolbox.defaultParam(orgnum,request,"course","", null, 20);
    String sessionname = Toolbox.defaultParam(orgnum,request,"sessionname","", ",-_+", 60);
    String atype = Toolbox.defaultParam(orgnum,request,"atype","",null,2);
    String subdb = Toolbox.defaultParam(orgnum,request,"subdb","",null,20);
    String semester = Toolbox.defaultParam(orgnum,request,"semester","",null,20);
    String assignname  = Toolbox.defaultParam(orgnum,request,"assignname","");
    String keystr = (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + sessionname;
    String info = null; 
    if (orgnum >= 0)
    try{ info = Toolbox.dbadmin[orgnum%65536].cache.get(keystr);}catch(Exception e){}
    if (info != null)
    {
        info = info.replaceFirst("([0-9]+,[0-9]+,)[0-9](.*)$","$1" + atype + "$2");
        synchronized(this){Toolbox.dbadmin[orgnum%65536].cache.put(keystr,info);}
    }
    %>
    <script>
        parent.safelink("<%=link.replaceFirst("x=[^&]+&","")%>");
    </script>
    <%
    return;
}
else if (x.equals("enforce6b"))
{ 
    String  z = request.getParameter("c");
    String atype = Toolbox.defaultParam(orgnum,request,"atype","",null,2);
    String key = Toolbox.defaultParam(orgnum,request,"key",null);
    String keystr = (orgnum%65536) + "|" + key;
    String info = Toolbox.dbadmin[orgnum%65536].cache.get(keystr);
    if (info != null)
    {
        info = info.replaceFirst("([0-9]+,[0-9]+,)[0-9](.*)$","$1" + atype + "$2");
        synchronized(this){Toolbox.dbadmin[orgnum%65536].cache.put(keystr,info);}
    }
    String link = Toolbox1.geturl(request);
    link = link.replaceFirst("follows\\.jsp.*","follows.jsp?code6b=" + Unicode6b.encode(z));
    %>
    <script>
        parent.safelink("<%=link%>");
    </script>
    <%
    return;
} 
else if (x.equals("rebuildtool"))
{
    String course = Toolbox.defaultParam(orgnum,request,"course",null);
    String sessionname = Toolbox.defaultParam(orgnum,request,"sessionname",null);
    String subdb = Toolbox.defaultParam(orgnum,request,"subdb",null);
    user.changedb(subdb);
    orgnum = user.orgnum; 
    JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
    adapter.orgnum = orgnum;
    int n = adapter.executeQuery("SELECT  DomainValue.domainvalue,category,DomainValue.description,name,cgi,opt,OperationCourse.forstudent from DomainValue,Operation, OperationCourse where  caption=CONCAT('',DomainValue.code) AND DomainValue.domain='Tool Caption' AND DomainValue.language='" + Toolbox.langs[orgnum>>16] + "' AND Operation.name=OperationCourse.operation and OperationCourse.course ='" + course + "' AND  OperationCourse.forstudent > 0 order by OperationCourse.forstudent");
    String toolstr = "";
   for(int i=0; i < n; i++)
 for (int j=0; j < 6; j++)
 {
 String x1 = adapter.getValueAt(i,j).replaceAll(";",",");
 if (j==5 && adapter.getValueAt(i,4).equals("UploadTeaching"))
 x1 = x1 +"&course=" + course +"&subdb=" + user.id +"&sid=" + user.id;
 toolstr += ";" + x1;
 }
  AssignCache assigncache = Toolbox.dbadmin[orgnum%65536].assigncache.get( course + "|" + sessionname.replaceFirst(",.*$","")); 
  if (assigncache!=null) assigncache.toolstr = toolstr;
  toolstr += ";Rebuild;tealeaman;Tool Caption;Rebuild;installtool.js;rebuild('" + course + "','" + sessionname + "','" +  subdb + "')";
 adapter.close();
  
 %>
    <script>
        parent.rebuildcallback("<%=toolstr.replaceAll("\"","\\\"")%>");
    </script>
    <%
    return;        
}
%>
</body></html>
 
