<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*" %>
<% 
 int orgnum = Toolbox.setcharset(request, response);
    if (orgnum == -1) return;
 long tstmp = System.currentTimeMillis()%10000000;
 User user = null;
 if ((user = User.authorize(orgnum, Systemroles.STUDENT | Systemroles.ASSESSER | Systemroles.INSTRUCTOR | Systemroles.TEACHINGADMIN, application, session, request, response, "studentindex.jsp", true)) == null) {
     return;
 }
 orgnum=user.orgnum;
CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
 String menustr[] = Toolbox.emsgs(orgnum, 1580).split("#");
 String cmenustr[] = Toolbox.emsgs(orgnum, 1581).split("#");
 if (UploadFile.pfolders == null)  {
     UploadFile.makepfolder();
 }
 String semester = Toolbox.defaultParam(orgnum,request, "semestercode", "-1", null, 40);
 if (semester.equals("-1"))
 {
     semester = Toolbox.dbadmin[orgnum%65536].currentSemester;
 }
 
 String fname = user.firstname + " " + user.lastname;
 String majorprogram = "", minorprogram = "", department = "", advisor = "", advisorname = "";
 String sql="";
 String bs = "";
 String initbs = " ";
  
 String  acinfo = Toolbox1.GetCookie(request, user.id + "acinfo");
 boolean usedb = (acinfo==null || acinfo.equals("")); 
 boolean haschat = true;
 String cachestr = "";
 CSVParse parse = null;
 String courses = "";
 int nt = 0;
 String asso = "if (cid=='')\n{\nf.course.value='';\nf.iname.value='';\nf.iid.value='';\nf.ta.value='';\nf.sessionname.value='';\nf.coursetitle.value='';\n}\n";
 String iids = "";
 String inames = "";
 int nn = 0;
 ArrayList<String []> rows = new ArrayList();
 
 String [] rs; 
 String opt = "";
 String old = "";
 try
 {
    acinfo = (new Encode6b(orgnum)).rto6b(acinfo);
 }
 catch(Exception e){usedb = true;}
 usedb = true;
if (usedb)
{
      JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
  
      sql = "SELECT Acaprogram.department, Student.majorprogram as Speciality, '1' as which, Student.advisor , AppUser.firstname, AppUser.lastname FROM Acaprogram, Student, AppUser WHERE  AppUser.id=Student.advisor AND  Student.id='" + user.id + "' AND Acaprogram.id=Student.majorprogram UNION "
          + "SELECT Acaprogram.department, Student.minorprogram as Speciality, '0' as which, Student.advisor,  AppUser.firstname, AppUser.lastname from Acaprogram, Student, AppUser WHERE  AppUser.id=Student.advisor AND Student.id='" + user.id + "' AND Acaprogram.id=Student.minorprogram UNION "
          + "SELECT Acaprogram.department, Student.majorprogram as Speciality, '1' as which, '' as advisor , '' as firstname, '' as lastname FROM Acaprogram, Student       WHERE  (Student.advisor='' or Student.advisor=NULL ) AND  Student.id='" + user.id + "' AND Acaprogram.id=Student.majorprogram UNION "
          + "SELECT Acaprogram.department, Student.minorprogram as Speciality, '0' as which, '' as advisor, '' as firstname, '' as lastname  from Acaprogram, Student       WHERE  (NULL=Student.advisor or ''=Student.advisor) AND Student.id='" + user.id + "' AND Acaprogram.id=Student.minorprogram";
     boolean b = adapter.executeQuery2(sql,false);
     if (b && adapter.getValueAt(0,0)!=null) 
     {
         advisor = adapter.getValueAt(0, 3);
         advisorname = Toolbox.makeFullName(adapter.getValueAt(0, 5), "", adapter.getValueAt(0, 4));
         if (adapter.getValueAt(0, 2).equals("1")) 
         {
             department += adapter.getValueAt(0, 0);
             majorprogram = adapter.getValueAt(0, 1);
             if (adapter.getValueAt(1, 0)!=null) {
                 minorprogram = adapter.getValueAt(1, 1);
                 department += "," + adapter.getValueAt(1, 0);
             }
         } 
         else 
         {
             department += adapter.getValueAt(0, 0);
             minorprogram = adapter.getValueAt(0, 1);
             if (adapter.getValueAt(1, 0)!=null) 
             {
                 majorprogram = adapter.getValueAt(1, 1);
                 department += "," + adapter.getValueAt(1, 0);
             }
         }
     } 
     else if (adapter.getValueAt(0, 0)==null && (user.roles & Systemroles.INSTRUCTOR) > 0) 
     {
         department = user.department;
         advisor = user.id;
         advisorname = fname;
     }

     try 
     {
         Class cls = Class.forName("telaman.MsgQueue");
     } 
     catch (ClassNotFoundException e) 
     {
         haschat = false;
     }
     cachestr = advisor + ",'" + advisorname.replaceAll("'","''") + "','" + department + "','" + majorprogram + "','"  + minorprogram + "'," + haschat + "/";
     String    sql0 = "SELECT distinct Course.id, Course.title, Session.name, '" + user.id + "','" + user.firstname + "','" + user.lastname + "', '', -1, Session.ta, TimeSlot.timeslot,Session.room,Faculty.officehour FROM Session LEFT JOIN Faculty on Faculty.id=Session.instructor, Course,  TimeSlot WHERE Session.schedule=TimeSlot.num  AND  '" + user.id + "'= Session.instructor AND Session.courseid=Course.id AND  Session.semester='" + semester.replaceAll("'", "''") + "'";
     
     sql = "SELECT distinct Course.id, Course.title, Registration.sessionname, Session.instructor, AppUser.firstname, AppUser.lastname, Registration.evaluation, Registration.grade, Session.ta, TimeSlot.timeslot, Session.room,Faculty.officehour  FROM Session LEFT JOIN Faculty ON Faculty.id=Session.instructor, Course, Registration, AppUser, TimeSlot WHERE Session.schedule=TimeSlot.num  AND AppUser.id = Session.instructor AND Registration.sessionname=Session.name AND Registration.courseid = Course.id AND Registration.sid='" + user.id + "' AND Session.courseid=Course.id AND Registration.semester=Session.semester AND Session.semester='" + semester.replaceAll("'", "''") + "'";
     if ((user.roles & Systemroles.INSTRUCTOR) > 0) 
     {
         sql += " UNION " + sql0;
     }
     sql += " ORDER BY 1, 3";
     
     b = adapter.executeQuery2(sql,true);
     String cid = null;     
     if (b)
     if ( (cid=adapter.getValueAt(0,0))==null && (user.roles & Systemroles.INSTRUCTOR) > 0 )
     {
         adapter.close();
         DataMove.importdata(user, "TimeSlot;SELECT * FROM TimeSlot", "backup", true);
         user.changedb(user.id);
         adapter = Toolbox.getUserAdapter(user, orgnum);
         b = adapter.executeQuery2(sql0 +  " ORDER BY 1, 3",true); 
         if (b) cid=adapter.getValueAt(0,0);
     }
     rows = new ArrayList<String []>(); 
     int C =  adapter.getColumnCount();
     nn = 0;
     if (cid==null) 
     {
         opt = ("<tr><td>" + adapter.error() + sql + "</td></tr>");
     }  
     else
     { 
         old = "";
         if (b)
         for (int i=0; i < 10 ; i++)
         {
             if (i>0) cid = adapter.getValueAt(i,0);
             if (cid == null) break;
             nn++; 
             rs = new String[C]; 
             rs[0] = cid;
             for (int j=1; j < C; j++)
             {
                 rs[j] = adapter.getValueAt(i,j);
             }
             
             if ( (rs[0] + "  " + rs[2]).equals(old) )  
                 continue;
             old = rs[0] + "  " + rs[2];
             for (int j=0; j < C; j++)
             {  
                 cachestr += "'" + (rs[j]==null? "" :rs[j].replaceAll("'", "''")) + "'";
                 if (j < C-1) 
                     cachestr += ",";
                 else  
                     cachestr += "/";
             }
             rows.add(rs);
             
         }
     }
     cachestr = cachestr.replaceFirst("/$","");
     adapter.close();
    
     Toolbox1.SetCookie(response, user.id + "acinfo", (new Encode6b(orgnum)).to6b(cachestr)); 
 }
 else
 {
     //acinfo = (new Encode6b(orgnum)).rto6b(acinfo);
      
     parse = new CSVParse(acinfo, '\'', new String[]{",","/"});
     advisor = parse.nextElement();
     advisorname = parse.nextElement() ;
     department  = parse.nextElement();
     majorprogram = parse.nextElement();
     minorprogram = parse.nextElement();
      
     haschat = parse.nextElement().equals("true");
     while ((rs=parse.nextRow())!=null)
        rows.add(rs);
     nn = rows.size();
     
 }
 
  
 String ta = "";
 String forpass = "";
 
 String timeslots = "";
 String buddies = "";
 if (haschat) 
 {
     buddies = "var chatinfo=new Array();";
 }
 old = "";
 StringBuffer sallsession = new StringBuffer("");  
 StringBuffer schbysession= new StringBuffer(""); 
 StringBuffer mapping = new StringBuffer("var mapping=new Array();");
 String dins = ",";
 nn = rows.size();
if (nn > 0) 
 {
     int k1 = 0;
     if (nn > 1) 
     {
         opt = "<option value=\"\"  style=background-color:" + cachedstyle.IBGCOLOR + ";color:white;font-size:30px>" + Toolbox.emsgs(orgnum,430) + "</option>";
     }
     
     for (int k = 0; k < nn; k++) 
     {
         if (rows.get(k).length < 10) 
         {
             continue;
         }
          
         String cid =rows.get(k)[0];
         if (cid != null) 
         {
             cid = cid.trim();
         } else {
             cid = "";
         }
         
         String ctitle =  rows.get(k)[1];
         if (ctitle != null) {
             ctitle = ctitle.trim();
         } else {
             ctitle = "";
         }
          
         String sessionname = rows.get(k)[2];
         if (sessionname != null) {
             sessionname = sessionname.trim();
         } else {
             sessionname = "";
         }
         
         if ((cid + " " + sessionname).equals(old)) {
             continue;
         }
          
         old = cid + " " + sessionname;
         String instructor = rows.get(k)[3];
         if (instructor == null) {
             instructor = "";
         } else {
             instructor = instructor.trim();
         }
         String fulln = Toolbox.makeFullName(rows.get(k)[5], "", rows.get(k)[4]);
         if (courses.equals("") == false) {
             courses += ";";
             iids += ";";
             inames += ";";
             forpass += ",";
             timeslots += ",";

         }
         courses += cid;
         forpass += cid + "|" + sessionname + "|" + instructor;
         iids += instructor;
         inames += fulln;
         timeslots += "'" + rows.get(k)[9] + "'";
         
          
         if (ctitle.length() > 27) 
         {
            // ctitle  = ctitle.substring(0, 27);
         } 
         opt += "<option value=\"" + cid + "\"  style=background-color:" + cachedstyle.IBGCOLOR + ";color:white;font-size:30px>" + cid  + "-" + sessionname + "</option>";
         if (rows.get(k)[8] != null && rows.get(k)[8].equals("") == false) {
             ta = "ta";
         } else {
             ta = "";
         }
         if (k==0) 
         {
             sallsession.append("var allcourseschs=[");
             schbysession.append("var schbysession=[];");
         }
         else 
             sallsession.append(",");
         mapping.append("mapping['" + cid + "-" + sessionname + "']='" + fulln + "';");
         sallsession.append("['" + rows.get(k)[9] + "','" + cid + "-" + sessionname + "<br>" + rows.get(k)[10] + "',null,null," + ((k1 + ((nn == 1) ? 0 : 1))) + "]");
         if (!dins.contains(","+instructor + ","))
         {
         schbysession.append("schbysession[" + k + "]=['" +  rows.get(k)[11] + "','" + fulln + "<br>" + Toolbox.emsgs(orgnum,742) + "'];");
         dins += instructor + ",";
         }
         if (k==nn-1) 
             sallsession.append("];");
         asso += "else if (f.course.selectedIndex ==  " + (k1 + ((nn == 1) ? 0 : 1)) + " )\n{\nf.coursetitle.value=\"" + Generic.handle(ctitle)
                 + "\";\nf.iname.value=\"" + Generic.handle(fulln)
                 + "\";\nf.iid.value=\"" + instructor
                 + "\";\nf.ta.value=\"" + Generic.handle(ta)
                 + "\";\nf.subdb.value=\"" + instructor
                 + "\";\nf.sessionname.value=\"" + Generic.handle(sessionname) + "\";\n}\n";

         String topic = cid + "-" + sessionname + ":" + ctitle;
         if (haschat) 
         {
             bs = "";
             MsgTopic mq = MsgTopic.search(orgnum,"chat", topic);
             if (mq !=null)
                 bs = mq.subscribes.toString().replace("[", "").replace("]", ""); 
   
             if (bs != null && bs.equals("") == false) 
             {
                 bs = "(" + bs.split(",").length + ")" + (bs.indexOf(instructor) >= 0 ? "<img src=image/greenman.png style=\"border:0px;margin:3px 0px -3px 0px\" width=16>" : "");
             }
             if (nn == 1) 
             {
                 initbs = bs;
             }
             buddies += "chatinfo[" + (k1 + ((nn == 1) ? 0 : 1)) + "]='" + bs + "';";
         }
         k1 = k1 + 1;
     }
 }
 
 
if (nn>1 || nn==0) initbs = " ";



%>

<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head> 
     
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,669)%></title>

<!--link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /-->  
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("studentindex.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script>
<script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
<script type=text/javascript  src=cookie.js></script>
<style type="text/css">
a:link
{
    COLOR:#FFFFFF;
    font-weight:1000;
    TEXT-DECORATION: none
}
a:visited
{
    COLOR:#FFFFFF;
    font-weight:700;
    TEXT-DECORATION: none
}
/*
table.tr.td.table.tr.td {font-size:11pt}*/
div.circle{position:relative;left:-50px;top:0px;z-index:10;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-weight:700;font-weight:700;width:22px;height:22px;border-radius:11px;font-size:18px;color:<%=cachedstyle.IBGCOLOR%>; text-align:center;vertical-align:middle;background-color:white;box-shadow:-1px -1px #060606} 
 
.tshadow{font-size:30px;text-shadow:-1px -1px #060606;border-radius:3px;border:1px #999999 outset;width:80px;overflow:hidden;text-align:center;vertical-align:middle}
 
</style>
</head>
<body style="margin:0px 0px 0px 0px;background:<%=cachedstyle.IBGCOLOR%>">
 
<form rel=opener name="form1" method="post" style="margin:0px 0px 0px 0px" target="rightwinmoniter"  >

<input type=hidden name=subdb  value="">
<input type=hidden name=rdap>
<input type=hidden name=sid value="<%=user.id%>">
<input type=hidden name=majorprogram  value="<%=majorprogram%>" >
<input type=hidden name=minorprogram  value="<%=minorprogram%>" >
<input type=hidden name=department    value="<%=department%>" >
<input type=hidden name=onsave value="">
<input type=hidden name=onsaved value="">
<input type=hidden name=accessible value="true">
<input type=hidden name=quizdue value="">
<input type=hidden name=start value="">
<input type=hidden name=courses value="<%=courses%>" >
<input type=hidden name=assignname>
<input type=hidden name=iids value="<%=iids +";" + advisor%>">

<input type=hidden name=semester value="<%=semester%>">
<input type=hidden name=inames value="<%=inames +";" + advisorname%>">
<input type=hidden name=sessionname>
<input type=hidden name=coursetitle>
<input type=hidden name=iid>
<input type=hidden name=iname>
<input type=hidden name=ta>
<input type=hidden name=ways value="">
<input type=hidden name=inittopic value="">
<% int kc=0;%> 
<table border="0"   width="100%" cellpadding="2" cellspacing="3" align="center">
<tr height="30px" valign="middle" style="background:linear-gradient(0deg,<%= Toolbox.dbadmin[user.orgnum%65536].IBGCOLOR%>,<%= Toolbox.dbadmin[user.orgnum%65536].BBGCOLOR%>)">
<td  class=tshadow align=center valign=top > 
<select name=semestercode   style="box-shadow:-1px -1px #060606;overflow: hidden;font-size: inherit;font-family: inherit; background-color:transparent;color:white;border:1px #cccccc solid" onchange="switchs(this)">
    <%= Toolbox.dbadmin[user.orgnum%65536].semesteropts(semester, orgnum).replaceAll("<option ", "<option class=tshadow ") %></select>
</td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
<td align=center valign=middle class=tshadow><a href="javascript:openit('studentannounce.jsp')"><nobr><%=menustr[1]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%>
<td align=center valign=middle class=tshadow><a href="javascript:openit('DataForm?rdap=studentself&extraline=0&onbegin=120&&onsaved=121')"><nobr><%=menustr[2]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%>
<td align=center valign=middle class=tshadow><a href="javascript:openit6()"><nobr><%=menustr[3]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
<% if (nn>0){%> 
<td align=center valign=middle class=tshadow><a href="javascript:Sch.printschstudent()"><nobr><%=menustr[4]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
<%} if (!Toolbox.edition.contains("Personal")){ %>
<td align=center valign=middle class=tshadow><a href="javascript:openit4('studentprogress.jsp')"><nobr><%=menustr[5]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
<%}%>  
<td align=center valign=middle class=tshadow><a href="javascript:openit('DataFormHTML?rdap=userinfo&uid=<%=advisor%>')"><nobr><%=menustr[6]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
<% if (!Toolbox.edition.contains("Personal")){ %>
<td align=center valign=middle class=tshadow><a href="javascript:openit('DataHTML?rdap=account&uid=<%=user.id%>')"><nobr><%=menustr[7] %></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
<%} if (user.websitename != null && !user.websitename.equals("")) 
{
if ( (new  File(Toolbox.dbadmin[orgnum%65536].websiteFolder + File.separator + user.websitename)).exists() == false && 
     (new  File(user.webFileFolder + File.separator +  "website")).exists() == false)
{
    if (user.webFileFolder == null || user.webFileFolder.equals("") || user.webFileFolder.equals("/"))
       user.webFileFolder = Toolbox.dbadmin[orgnum%65536].webFileFolder1 + File.separator + user.id;
    UploadFile.makedir(user.webFileFolder + File.separator +  "website");
}
 
%>
<td align=center valign=middle class=tshadow><a href="javascript:openit('webfolder.jsp?folder=website')"><nobr><%=menustr[8]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
<%}else if (user.webFileFolder != null && !user.webFileFolder.equals("") ) {
 if ( user.webFileFolder.equals("/"))
{
    user.webFileFolder = Toolbox.dbadmin[orgnum%65536].webFileFolder1 + File.separator + user.id;
    UploadFile.makedir(user.webFileFolder );
} 
else if ((new File(user.webFileFolder)).exists() == false)
{
    UploadFile.makedir(user.webFileFolder );
}

%>
<td align=center valign=middle class=tshadow><a href="javascript:openit('webfolder.jsp')"><nobr><%=menustr[8]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
<%}if (haschat && advisor != null && advisor.equals("") == false) {%>
<td align=center valign=middle class=tshadow><a href="javascript:openit10()"><nobr><%=menustr[9]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
                <%
                    }
                    Set<String>  e = Generic.storedProc.keySet();
                    for ( String rdap: e) {
                        
                        if (rdap.charAt(0) == '#') {
                            Webform w = (Webform) (Generic.storedProc.get(rdap));
                            String format = w.format;
                            if (format.equals("Update") == false) {
                                if (Toolbox.langnum!= (orgnum>>16))
                                { 
                                     WebformLang ws = Generic.storedProcLang.get(w.name + "," + Toolbox.langs[orgnum>>16]);
                                     if (ws!=null) w.title = ws.title;
                                }
                                String title = w.title;
                %>
<td align=center valign=middle class=tshadow><a href="javascript:openit3('Data<%=format%>','<%=rdap.replaceAll("'", "\\'")%>','')"><nobr><%=title%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
                <%
                            }
                        }
                    }
                %>
<td align=center valign=middle class=tshadow><a href="javascript:openit('DataForm?exbut=cp&rsacode=2&rdap=userresetpass')"><nobr><%=menustr[11]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
<td align=center valign=middle class=tshadow><a href="javascript:openit('login.jsp?follow=logout&id=<%=user.id%>')"><nobr><%=menustr[12]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 

<%
if ( nn > 0 ){
//kc = 1; 
%>
 
<td align=center valign=middle ><select class=selectsel name=course  style="box-shadow:-1px -1px #060606;overflow: hidden;font-size:30px; background-color:transparent;color:white;overflow:hidden;border:1px #cccccc solid" ><%=opt%></select></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
<td align=center valign=middle class=tshadow><a href="javascript:openit1('DataFormHTML?rdap=SyllabusIndex')"><nobr><%=cmenustr[0]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
<td align=center valign=middle class=tshadow><a href="javascript:openit1('studentannounce.jsp')"><nobr><%=cmenustr[1]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
<td align=center valign=middle class=tshadow><a href="javascript:openit2()"><nobr><%=cmenustr[2]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
<td align=center valign=middle class=tshadow><a href="javascript:openit12()"><nobr><%=cmenustr[3]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
 
<td align=center valign=middle class=tshadow><a href="javascript:openit1('studentassign.jsp')"><nobr><%=cmenustr[4]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
<td align=center valign=middle class=tshadow><a href="javascript:openit1('DataForm?rdap=studentsubmission&assignname=&makescript=makesubmission&extension=0')"><nobr><%=cmenustr[5]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
<td align=center valign=middle class=tshadow><a href="javascript:openit1('checkgrades.jsp')"><nobr><%=cmenustr[6]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
<td align=center valign=middle class=tshadow><a href="javascript:openit1('discussview1.jsp')"><nobr><%=cmenustr[7]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
<% if (haschat) 
{%>
<td align=center valign=middle class=tshadow><a href="javascript:openit11()"><nobr><%=cmenustr[8]%></nobr><sup><span id="chatinfo"></span></sup></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
<%}
if (Toolbox.dbadmin[orgnum%65536].getAppedt(3) < System.currentTimeMillis() / 1000 || Toolbox.dbadmin[orgnum%65536].getAppedt(4) > System.currentTimeMillis() / 1000) 
{%>
<td align=center valign=middle class=tshadow><a href="javascript:openit1('DataForm?exbut=p&rdap=evalform'+f.ta.value)"><nobr><%=cmenustr[9]%></nobr></a></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
<%} //else out.print(Toolbox.timestr(Toolbox.getAppedt(1)));
%>
<td align=center valign=middle  class=tshadow> <a href="javascript:refresh()"  ><nobr><%=cmenustr[10]%></nobr></td><% kc++; if (kc%8==0)out.print("</tr><tr>");%> 
  
<%}%>
</tr></table>
</form>
<form rel=opener name="form3" method="post" style="margin:0px" action="Msgsend" target="w<%=tstmp%>" >
    <input type="hidden" name="code" value="unsubs" >
    <input type="hidden" name="app" value="" >
    <input type="hidden" name="sek" value="" >
</form>

<script  type="text/javascript">
var theurl = "<%=Toolbox1.geturl(request)%>";
var click = "<%=Toolbox.defaultParam(orgnum,request,"click","-1",null,2)%>";
var font_size = <%= cachedstyle.fontsize%>; 
var timeslots = <%="[" + timeslots.toUpperCase() +"]"%>; 
var encoding = "<%= Toolbox.encodings[orgnum>>16]%>"; var langcode = "<%= Toolbox.langs[orgnum>>16]%>";
var studentdriven = <%=Toolbox.dbadmin[orgnum%65536].studentdriven%>;  
var timenowstr = <%=(new GregorianCalendar()).get( Calendar.DAY_OF_WEEK )%>;
var timenowsec = <%=System.currentTimeMillis()%> - (new Date()).getTime() ;
 
var numcourses = timeslots.length;
var msg288 = "<%=Toolbox.emsgs(orgnum,288)%>";
 
var msg1407 = "<%=Toolbox.emsgs(orgnum,1407)%>";
var savedurl = (numcourses>=1)? "openit('studentannounce.jsp')" : "openit6()";
 
var coursesession= "<%=forpass%>";
var advisorname= "<%=advisorname%>";

var lecturefolder = "<%=UploadFile.pfolders[0]%>";
var sid = "<%=user.id%>";
 
var semester =  "<%=semester%>";
<%= buddies%>;
 
function resetassociate()
{
    var f = document.form1;
    if (typeof (f.course)=='undefined')return;
    var i = f.course.selectedIndex;
    if (i <0) return;
    var cid = f.course.options[i].value;
    <%=asso%> 
    
}

<%
  
  String allids[] =  (advisor + ";" + iids).replaceFirst("^;","").replaceFirst(";$","").split(";");
  String allnames[] = (advisorname+ ";" + inames).replaceFirst("^;","").replaceFirst(";$","").split(";");
  int dindex[] = new int[allids.length]; 
  dindex[0] = 1; 
  for (int i = 1; i < allids.length ; i++)
  {
      dindex[i] = 1; 
      for (int j=0; j < i; j++) 
      if (allids[j].equals(allids[i]))
      {
          dindex[i] = 2;
          break;
      }
  }
  String dis = "", din = "";
  for (int i = 0; i < allids.length ; i++)
  {
      if (dindex[i] == 1)
      {
          dis += "," + allids[i] ;
          din += "," + allnames[i] ;
      }
  }
  if (dis.length()>0) 
  {
      dis = dis.substring(1);
      din = din.substring(1);
  }
  
%>
function rewrite(s){document.getElementById('ins0').innerHTML = s;}
function getName(){return "<%=Toolbox.makeFullName(user.lastname,"", user.firstname)%>";}
function getIds(){return  ("<%=dis%>");}
function getInames(){return  ("<%=din%>");}
function advisorid(){return '<%=advisor%>';}
 
<%=  sallsession.toString()%>
   
<%  if (sallsession.length() > 0) out.print((sallsession.charAt(sallsession.length()-1)==';')?"":"];"); %>
   
<%=  schbysession.toString()%>
   
<%=mapping.toString()%>
  
var timediff=<%= System.currentTimeMillis()%> - (new Date()).getTime() ;
 
</script>
<script  type="text/javascript" src="studentindex.js"></script>
<script  type="text/javascript" src="printschedule.js"></script> 
 
<script  type="text/javascript" src=curve.js></script>
 
<iframe name="w<%=tstmp%>" width="1" height="1"  style="visibility:hidden" />
</body>
</html>