<%@ page contentType="text/html; charset=utf-8"  import="telaman.*,java.sql.*,java.util.concurrent.*,java.util.*,java.util.regex.*"  %>
<%
int orgnum = Toolbox.setcharset(request,response);
if (orgnum == -1) return;
   // java.util.Scanner s = new Scanner(System.in);

%>
<%!
void submitReceipt(StringBuffer q, User user , char operation, String semester, String courseid, String assignname, long timesec, String content, String attach, String x, int orgnum,CachedStyle cachedstyle) {
        String file = FileOperation.getFileName(courseid + assignname);
        String formattedcontent = q.toString(); 
        StringBuffer needsign = new StringBuffer();
        q.setLength(0);
        q.append("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >");
        q.append(Toolbox.getMeta(orgnum).replaceFirst("<sc.*", ""));
        q.append("<head><title>");
        q.append(file);
        q.append("</title></head><body bgcolor=");
        q.append(cachedstyle.DBGCOLOR);
        q.append("><center><h3>");
        String un = Toolbox.dbadmin[orgnum%65536].unitname[orgnum>>16].replaceFirst("/.*$", "");
        q.append(un);
        needsign.append(un);
        q.append("</h3><h2>");
        q.append(Toolbox.emsgs(orgnum,1329));  
        needsign.append(Toolbox.emsgs(orgnum,1329));
        q.append("</h2><table><tr><td align=left colspan=2><b>");
        q.append(Toolbox.emsgs(orgnum,1328));
        needsign.append(Toolbox.emsgs(orgnum,1328));
        q.append("</b></td></tr><tr><td align=left><nobr>");
        q.append(Toolbox.emsgs(orgnum,163));
        needsign.append(Toolbox.emsgs(orgnum,163));
        q.append("</nobr></td><td align=left><b>");
        q.append(user.id);
        needsign.append(user.id);
        q.append("</b></td></tr><tr><td align=left><nobr>");
        q.append(Toolbox.emsgs(orgnum,637));
        needsign.append(Toolbox.emsgs(orgnum,637));
        q.append("</nobr></td><td align=left><b>");
        x = operation == 'u' ? Toolbox.emsgs(orgnum,29) : Toolbox.emsgs(orgnum,51);
        q.append(x);
        needsign.append(x);
        q.append("</b></td></tr><tr><td align=left><nobr>");
        q.append(Toolbox.emsgs(orgnum,1004));                 
        needsign.append(Toolbox.emsgs(orgnum,1004));
        q.append("</nobr></td><td align=left><b>");
        q.append(semester);                         
        needsign.append(semester);  
        q.append("</b></td></tr><tr><td align=left><nobr>");
        q.append(Toolbox.emsgs(orgnum,982)); 
        needsign.append(Toolbox.emsgs(orgnum,982));
        q.append("</nobr></td><td align=left><b>");
        q.append(courseid);  
        needsign.append(courseid);
        q.append("</b></td></tr><tr><td align=left><nobr>");
        q.append(Toolbox.emsgs(orgnum,500)); 
        needsign.append(Toolbox.emsgs(orgnum,500)); 
        q.append("</nobr></td><td align=left><b>");
        q.append(assignname);  
        needsign.append(assignname); 
        q.append("</b></td></tr><tr><td align=left><nobr>");
        q.append(Toolbox.emsgs(orgnum,986));  
        needsign.append(Toolbox.emsgs(orgnum,986));
        q.append("</nobr></td><td align=left><b>");
        q.append(Toolbox.timestr(timesec));   
        needsign.append(Toolbox.timestr(timesec)); 
        q.append("</b></td></tr><tr><td align=left valign=top><nobr>");
        q.append(Toolbox.emsgs(orgnum,53));   
        needsign.append(Toolbox.emsgs(orgnum,53)); 
        q.append("</nobr></td><td align=left>");
        needsign.append(content.replaceAll("<[^>]+>", ""));
        if (formattedcontent.equals("")) 
        {
            q.append("<pre>" + Toolbox.formatstr("0", content) + "</pre>"); 
        }
        else
        {
            q.append(formattedcontent);
        }
        q.append("</td></tr><tr><td align=left><nobr>");
        q.append(Toolbox.emsgs(orgnum,355));    
        needsign.append(Toolbox.emsgs(orgnum,355));
        q.append("</nobr></td><td align=left>");
        if (attach == null) 
        {
            attach = "";
        }
        q.append(attach);    
        needsign.append(  attach); 
        q.append("</td></tr><tr><td align=left><nobr>");
        q.append(Toolbox.emsgs(orgnum,1401));    
        needsign.append(Toolbox.emsgs(orgnum,1401));
        q.append("</nobr></td><td align=left>");
         x = "";
         try
        {
            String pure =  needsign.toString().replaceAll("<[a-z][^>]+>", "").replaceAll("<\\/[a-z][^>]*>", "").replaceAll("\r","").replaceAll("\n","").replaceAll(" ","").replaceAll("\t",  "");
            x = Sha1.hash1( Esign.signrsastr  + pure ) ;
            
        }catch(Exception e){}
        
        q.append(x);
         
        q.append("</td></tr></table><script  type=text/javascript>if (typeof(orgnum)=='undefined')var orgnum=" +  orgnum+ ";if(parent.opener!=null&&typeof(parent.opener.syn)!='undefined')parent.opener.syn('1');</script></body></html>");
        
       
    }
String arrstr(int a[])
{
    String x = "";
    if (a==null || a.length==0) return "";
    for (int i=0; i < a.length; i++)
        x += "," + a[i] ;
    return x.substring(1);
}
String arrstr(String a[])
{
    String x = "";
    if (a==null || a.length==0) return "";
    for (int i=0; i < a.length; i++)
        x += ",\"" + a[i] + "\"" ;
    return x.substring(1);
}
 
String formatemb(String x,int orgnumn )
{
    CSVParse embf = new CSVParse(x,'\'',new String[]{",","\r\n"});
    String y = "<table border=1 style=border-collapse:collapse><tr><td align=right>#</td><td>" + Toolbox.emsgs(orgnumn,53) + "</td><td align=right>" + Toolbox.emsgs(orgnumn,873) + "</td><td align=right>" + Toolbox.emsgs(orgnumn,231) + "</td></tr>";
    String [] row;
    while ( (row = embf.nextRow() ) != null)
    {
        if (row.length<6) continue;
        
        y += "<tr><td align=right>" 
        + row[0] + "</td><td>" 
        + row[1] + "</td><td  align=right>" 
        + (row[5].equals("-1")?"?":row[5]) 
        + "</td><td  align=right>" 
        + row[2] + "</td></tr>";
    }
    return y + "</table>";
}
boolean goodip(javax.servlet.http.HttpServletRequest request, String ip)
{
    if (ip.equals("")) return true;
    String addr = request.getRemoteAddr();
    return (addr.indexOf(ip) >=0 );
}
 
String Generichandle(String s)
{
   if (s==null) return "";
   return s.replaceAll("<", "<");
}
 
synchronized Eq addcs(String key, String q, String ans, String opt,long du, int orgnum )
{
    Eq x = Eq.eqs.get(key);
    if (x!=null)
    {
        x.due = du;
        x.assoptions = opt;
        x.code = (new AssOption(opt,orgnum)).code;
        return x;
    }
    x = new Eq(key, q, ans,opt, du,orgnum);
    return x;
} 
   
synchronized void delcs(Eq embedqz, int orgnum)
{
    if (embedqz !=null)
    {
       embedqz.savedata(orgnum);
       Eq.eqs.remove(embedqz.key);
    }
}
 

 
 
synchronized int updatent(Eq embedqz, int orgnum,int k)
{
    embedqz.numtester += k;
    if (embedqz.numtester == 0)
        delcs(embedqz,orgnum);
    return embedqz.numtester;
}
 
String pad2(int i)
{
  if (i < 10) return "0" + i;
  return "" + i;
}

boolean checkPass(String code, Eq embedqz, User user)
{
     boolean checkpass = false; 
       if (embedqz.code==null || embedqz.code.equals(""))
       {
            checkpass = true; 
       }
       else if (embedqz.code.indexOf("attendance;")==0)
       {
             if(embedqz.code.indexOf(";" + user.id + ";") < 0) 
                  checkpass = true;
       }
       else if (embedqz.code.indexOf("distinct;") == 0)
       {
             int jj = embedqz.code.indexOf(";" + code + ";");
             if (jj >= 0 || embedqz.code.indexOf(";" + code + ":" + user.id + ";")>=0)
                  checkpass = true;
             else if (jj>=0)
             {
                 synchronized(this)
                 {  
                      embedqz.code = embedqz.code.substring(0,jj+ code.length()+1) + ":" + user.id + embedqz.code.substring(jj+ code.length()+1);
                 }
             }
       }
       else if (!embedqz.code.equals(""))
       {
             checkpass = code!=null && embedqz.code.equals(code);
       }
       return checkpass;
}
%>

<%
User user = null;
String mode = Toolbox.defaultParam(orgnum,request,"mode","take");
String thisurl1 = Toolbox1.geturl(request); 
boolean backupset = true;
String backupinfo0 = Toolbox.dbadmin[orgnum%65536].error2;
//take: take quiz for student, load quiz info if need,
//send: for student,send answer to individual question, return ifcorrent
//make: make tabluar quiz for lecturer, number,question,answer,answered, right, percent: show, hide, edit
//update: save updated question,answer if need, return answered, right, percent
//save:
//1, 2, 3
long roles = 0;
if (mode.equals("take") || mode.equals("send")|| mode.equals("submit") || mode.equals("pull") )
{   
    roles = Systemroles.STUDENT | Systemroles.TA;
    if (mode.equals("take"))
    {
        if (backupinfo0!=null && !backupinfo0.equals("")) 
        {   
          try{String xx = Sha1.hash(user.firstname + user.lastname + user.id);
          backupinfo0 = backupinfo0+ "?id=" + user.id + "&passcode=" + xx;
          Toolbox1.SetCookie(response, "backupinfo", backupinfo0); }catch(Exception e){backupset = false;}
        } 
     }
}
else if (mode.equals("dcodes") ||mode.equals("code")  ||mode.equals("svcode") ||mode.equals("ddcode")   ||mode.equals("roster") ||mode.equals("save") ||  mode.equals("attend") || 
      mode.equals("answer") ||mode.equals("prev") || mode.equals("make") 
       || mode.equals("update")||mode.equals("poll")|| mode.equals("delete")
       || mode.equals("post")  || mode.equals("remove")|| mode.equals("change") 
       || mode.equals("fetch") || mode.equals("snapshot") || mode.equals("numq")|| mode.equals("swap")
        ||mode.replaceAll("[0-9]","").equals("")) {
    roles = Systemroles.INSTRUCTOR;
    
}

if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, roles,application,session,request, response, "embedquiz.jsp", true)) == null)
    return;
orgnum = user.orgnum; 
String subdb =  Toolbox.defaultParam(orgnum,request,"subdb",null,null,30);
user.changedb(subdb);  
String sid =  Toolbox.defaultParam(orgnum,request,"sid", user.id,null,30);
String course =  Toolbox.defaultParam(orgnum,request,"course", "","-",30);
String coursetitle =  Toolbox.defaultParam(orgnum,request,"coursetitle","");
String sessionname =  Toolbox.defaultParam(orgnum,request,"sessionname","",null,30);
String cidtitle = course + "-" + sessionname + " " + coursetitle;
String coursesession = course + "-" + sessionname;
Calendar now = GregorianCalendar.getInstance();
String defname = sessionname.replaceAll(",","") + "-"+ pad2(1 + now.get(Calendar.MONTH))+  pad2(now.get(Calendar.DAY_OF_MONTH));
String countstr =  Toolbox.defaultParam(orgnum,request,"count", "",null,2);
defname += countstr;
String assignname =   Toolbox.defaultParam(orgnum,request,"assignname",  defname, "@!#$%&*()-+=[]|:'", 40); 
String quizdue =  Toolbox.defaultParam(orgnum,request,"quizdue", "" + Math.round(now.getTimeInMillis()/1000+7200), null, 20);
String attachat = "";
String attach = "";
String semester =  Toolbox.defaultParam(orgnum,request,"semester", Toolbox.dbadmin[orgnum%65536].currentSemester, null, 30).replaceAll("'","''");
String weight =  Toolbox.defaultParam(orgnum,request,"weight", "1", ".", 5);
String scale =  Toolbox.defaultParam(orgnum,request,"scale", "10", null, 5);
user.changedb(subdb);
  
String deb = ("<!--assignname=|" + assignname +"|");
deb += ("sessionname=|" + sessionname +"|");
deb += ("option=|" + mode +"|");
deb += ("course=|" + course +"|");
deb += ("subdb=|" + subdb +"|");
deb += ("sid=|" + sid +"|");
deb += ("semester=|" + semester +"|");
deb += ("mode=|" + mode +"|");
 
String des = "";
String answer = "";
String assess = "|# |,|pts|,|Objective|,|numanswered|,|numright|,|0|;|1|,|1|,|0|,0,0;|2|,|1|,0,0,0;|3|,|1|,|0|,0,0;|4|,|1|,|0|,0,0;|5|,|1|,|0|,0,0;|6|,|1|,|0|,0,0;|7|,|1|,|0|,0,0;|8|,|1|,|0|,0,0;|9|,|1|,|0|,0,0;|10|,|1|,|0|,0,0";
String toolstr = "";
String name = "";
long due = 0;
long start = 0;
String startstr = Toolbox.defaultParam(orgnum,request,"start", "",null,14);
 
try{start = Long.parseLong(startstr);}catch(Exception e){}
try{due = Long.parseLong(quizdue);}catch(Exception e){}
String xx = "";
String format = "";
int type = 0;
String options = "ff:" + Toolbox.fontsnamestr(orgnum>>16) +";fs:20;fw:700;f:0|0.6*S+0.4*Q;cd:";
AssOption assopt = new AssOption(options,orgnum);
int status  = 2;
int statusold = 2;
String statusshow = "";
String title = "";
String saved = "";
boolean doc = true;
boolean qonly = false;
String txt = "";
String addr;
int nn,n;
boolean goodtogo = false;
boolean hasanswer = false;
long tstmp = System.currentTimeMillis() % 10000000;
String course1 = course.replaceAll("'","''");
long nowinsecond =  System.currentTimeMillis()/1000; 
String SQLstr = "";
String contentstr =  "";
String gradestr = "";
boolean quiz = true;
String pts =  Toolbox.defaultParam(orgnum,request,"Assessment","");
response.setHeader("X-XSS-protection", "0"); 
String keystr = Toolbox.defaultParam(orgnum, request,"key", null);
if (keystr == null)
    keystr =  (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + sessionname; 
else
{
    keystr = Msgsend.back(keystr);
    mode = "fetch";
}
Eq embedqz = Eq.eqs.get(orgnum%65536+"-" + course + "-" + sessionname); 
if (mode.equals("take") || mode.equals("prev"))
{
    String eqnotext = "";
    boolean needdistinctcode = false; 
    
   if (mode.equals("take")) 
   {
       JDBCAdapter adapter = null;
       
       synchronized (this) 
      {
           if (embedqz == null && (embedqz = Eq.eqs.get(orgnum%65536+"-" + course + "-" + sessionname)) == null ) 
           {
               boolean hasq = false;
               course1 = course.replaceAll("'", "''");
               AssignCache assigncache = null;
               boolean bb = false;
               SQLstr = "SELECT name,due,question,format,atype,answer,Assignment.start,status,Course.title,options,assess,attach,timesplit,latepermit,scale,weight,grader,sessionname FROM Assignment, Course WHERE "
                           + "Assignment.course=Course.id AND Course.id = '" + course.replaceAll("'", "''")
                           + "' AND Assignment.name='" + assignname.replaceAll("'", "''")
                           + "' AND Assignment.semester='" + semester.replaceAll("'", "''")
                           + "' AND Assignment.sessionname='" + sessionname.replaceAll("'", "''")
                           + "' AND Assignment.atype=4  AND Assignment.start <=" + nowinsecond;
                adapter = Toolbox.getUserAdapter(user, orgnum);
               if (!adapter.error().equals("")) {
               adapter.close();
               out.println(adapter.server + Toolbox.emsgs(orgnum, 1550));
               return;
               }
               bb = adapter.executeQuery2(SQLstr, false); 
               if (bb == true &&  adapter.getValueAt(0, 0) != null)
               { 
                   assigncache = new AssignCache(adapter);
                   assigncache.keystr = keystr.replaceFirst("[^\\|]+$", assigncache.sessions); 

               } 

               deb += ("sql=|" + SQLstr + "-->");
               n = 0;
              // boolean bb = adapter.executeQuery2(SQLstr, false);

               if ( assigncache == null ) // no quiz made yet
               {
                   assigncache = new AssignCache();
                   hasq = false;
                   assigncache.name = name = assignname;
                   assigncache.format = format = "2";
                   assigncache.options = options;
                   assopt = new AssOption(options, orgnum);
                   status = 1;
                   assigncache.status = "1";
                   assigncache.courseTitle = title = coursetitle; 
                   assigncache.question =  des = "";
                   assigncache.answer = answer = "";
                   hasanswer = false;
                   assigncache.attach = attachat = ""; 
                   assigncache.keystr = keystr; 
               } 
               else 
               {   
                    hasq = true;
                    long duetime = -1;
                    try
                    {
                        duetime = Long.parseLong(assigncache.due);
                    }
                    catch(Exception e ){} 
                    coursetitle = assigncache.courseTitle;
                    String latepermit =  assigncache.latepermit;


                   name = assigncache.name;
                   if (name == null) {
                       name = "";
                   }
                   else name = name.trim();
                   due = nowinsecond + 3600 * 72;
                   try {
                           due = Long.parseLong(assigncache.due);
                           if (due + 120 < nowinsecond) 
                           {
                               due = nowinsecond + 4000;
                           }
                   } catch (Exception e) { }
                   try 
                   {
                        start = Long.parseLong(assigncache.start);
                   } catch (Exception e) { }

                   format = assigncache.format;
                   if (format == null) {
                       format = "2";
                   }
                   try {
                           type = Integer.parseInt(assigncache.atype);
                   } catch (Exception e) { }

                   options = assigncache.options;
                   if (options == null) {
                       options = "";
                   }
                   assopt = new AssOption(options, orgnum);
                   try {
                           status = Integer.parseInt(assigncache.status);
                       } catch (Exception e) { }

                   if (status >= 2) {
                       status = (nowinsecond <= due) ? 1 : 0;
                   }
                   statusold = status;
                   if (status != 0) {
                       status = 1;
                   }
                   statusshow = (status == 0) ? Toolbox.emsgs(orgnum, 299) : Toolbox.emsgs(orgnum, 218);
                   title = assigncache.courseTitle;

                   if (title == null) {
                       title = course;
                   } else {
                       title = title.trim();
                   }

                   des = assigncache.question; 
                   answer = assigncache.answer;
                   if (answer != null && answer.replaceAll("\\s", "").equals("") == false) {
                       hasanswer = true;
                   } else {
                       answer = "";
                   }
                   attachat = assigncache.attach;
               }
               embedqz = addcs(orgnum%65536 + "-" + course + "-" + sessionname, des, answer, options, due,orgnum);
               embedqz.hasindb = hasq;
               embedqz.assignname = name;
               embedqz.start = start;
               embedqz.dbinfo = user.getDBConnectInfo();
               embedqz.iid = subdb;
               embedqz.attach = attachat;
               embedqz.numtester = 1;
               embedqz.monitored = false;
                
               //embedqz.code = assopt.code == null ? "" : assopt.code;
               if (assopt.code.equals("distinct")) 
               {
                   String sqls = "SELECT code,sid FROM DistinctCode WHERE iid='" + embedqz.iid + "'";
                   boolean bn = adapter.executeQuery2(sqls, true);
                   StringBuffer sb = new StringBuffer("distinct;");
                   String x2 = "";
                   String code = Toolbox.defaultParam(orgnum,request, "code", "",",!@#$%^&*.,:_-+=",20);
                   for (int i = 0; bn && (x2 = adapter.getValueAt(i, 0)) != null; i++) 
                   {
                       sb.append(x2);

                       String yy = adapter.getValueAt(i, 1);
                       if (yy != null && x2.equals(code) && yy.equals(sid)) 
                       {
                           sb.append(":" + sid);
                       }
                       sb.append(";");
                   }
                   embedqz.code = sb.toString();

               } 
               else if (assopt.code.indexOf("attendance") == 0)
              {
                   String sqls = "SELECT  sid FROM Absence WHERE atime >" + (embedqz.start - 2700) + " AND courseid='" + course + "' AND sessionname='" + sessionname + "' AND semester=" + semester;
                    boolean bn = adapter.executeQuery2(sqls, true);
                    StringBuffer sb = new StringBuffer("attendance;");
                    String x2 = "";
                    for (int i = 0; bn && (x2 = adapter.getValueAt(i, 0)) != null; i++) 
                    {
                        sb.append(x2);
                        sb.append(";");
                    }
                    embedqz.code = sb.toString();

              } 
              else 
              {
                   embedqz.code = assopt.code == null ? "" : assopt.code;

              }
           }
        } // now we have embedqz 
 
        long duetime = embedqz.due;
        if (duetime > 0 && duetime < nowinsecond)
        {
            if (adapter != null)adapter.close();
        %>
<jsp:forward  page="DataForm">
<jsp:param name="course"  value="<%=course%>" />
<jsp:param name="semester"  value="<%=semester%>" />
<jsp:param name="sessionname"   value="<%= sessionname%>" />
<jsp:param name="assignname"  value="<%= assignname%>" />
<jsp:param name="sid"  value="<%=sid%>" />
<jsp:param name="extension"  value="<%=0%>" />
<jsp:param name="subdb"   value="<%=subdb%>" />
<jsp:param name="coursetitle"   value="<%=subdb%>" />
<jsp:param name="rdap"  value="studentsubmission" />
<jsp:param name="orgnum"  value="<%=orgnum%>" />
<jsp:param name="makescript"   value="makesubmission" />
</jsp:forward>
    <%
              return;
        }
             
        name = assignname;
        start = embedqz.start;
        if (start == 0) 
       {
           start = nowinsecond;
       }
        options = embedqz.assoptions;
        assopt = new AssOption(options, orgnum);
        format = "2";
        type = 1;
        status = (nowinsecond <= due) ? 1 : 0;
       statusold = status;
       if (status != 0) 
       {
           status = 1;
       }
       statusshow = (status == 0) ? Toolbox.emsgs(orgnum, 299) : Toolbox.emsgs(orgnum, 218);
       title = coursetitle;
       answer = "";
       attachat = embedqz.attach;
       String needinc = Toolbox.defaultParam(orgnum, request, "numtester", null, null, 1);
       if (needinc != null) 
       {
           updatent(embedqz, orgnum,1); 
       }
       String sn = Toolbox.defaultParam(orgnum,request, "sname", user.id, null, 50);
       String msg = (user.id + "," + sn.replace(","," ") + ",-1,'take'");
       Msgboxrun.dropmsg(keystr,msg); 
       
       goodtogo = true;
       if (  System.currentTimeMillis()/1000 -  start > 400)
       {
           String sqls = "SELECT  content,grade,lastupdate,attach FROM Submission WHERE sid='"
               + user.id.replaceAll("'", "''") + "' AND course='"
               + course.replaceAll("'", "''") + "' AND assignname='"
               + assignname.replaceAll("'", "''") + "' AND semester='"
               + semester.replaceAll("'", "''") + "'";
            if (adapter==null) adapter =  adapter = Toolbox.getUserAdapter(user, orgnum);
            boolean bn = adapter.executeQuery2(sqls, true);
            if (bn && adapter.getValueAt(0, 0) != null) 
            {
               contentstr = adapter.getValueAt(0, 0);
               gradestr = adapter.getValueAt(0, 1);
               attach = adapter.getValueAt(0, 3);
               if (attach == null) 
               {
                   attach = "";
               }
               if (gradestr == null) 
               {
                   adapter.close();
                   out.println(sqls + adapter.getColumnCount() + adapter.getValueAt(0, 0) + gradestr);
                   return;
               }
               goodtogo = true;

               if (gradestr.equals("-2")) {
                   if (adapter.getValueAt(0, 0) != null) {
                       answer += "|" + adapter.getValueAt(0, 0);
                   }
                   saved = adapter.getValueAt(0, 2) + "," + adapter.getValueAt(0, 0);

               } else {
                   goodtogo = false;
                   txt = Toolbox.emsgs(orgnum, 7) + assignname;
               }
            }
       }
       doc = false;
       if (adapter !=null) adapter.close();
       if (embedqz != null) {
           eqnotext = embedqz.notext;
       }
       if (goodtogo == false) {
           out.println("<body>");
           out.println(Toolbox.emsgs(orgnum, 7));
           out.println("</body>");
           adapter.close();
           return;
       }
   } else {
       eqnotext = Toolbox.defaultParam(orgnum, request, "question", "");
       attachat = Toolbox.defaultParam(orgnum, request, "attach", "");
       if (embedqz!=null)
       {
            embedqz.monitored = true;
       }
   }
   String imglet[] = Toolbox1.attach( attachat , user.iid , course, true, orgnum) ;
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
 
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
<title><%=Toolbox.emsgs(orgnum,1378)%></title>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("embedquiz.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script>
<script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
<script type=text/javascript  src=encryption.js></script>
<script type=text/javascript  src=cookie.js></script>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
<link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<style type="text/css">
#myHintdiv{background-color:lightyellow}     
.rado{background-color:<%=cachedstyle.DBGCOLOR%>}
td,body  {font-size:<%=assopt.fs%>px;font-family:<%=assopt.ff%>;font-weight:<%=assopt.fw%>}
textarea {font-size:<%=assopt.fs%>px;font-family:courier;font-weight:700}
input.blanklook{border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;border:1px #b0b0b0 solid;font-size:<%=assopt.fs%>px;font-family:courier;font-weight:700}
.racebutton{overflow:show;border:1px green outset;color:white;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:<%=assopt.fs%>px;font-weight:650;padding:3px 3px 3px 3px}
.quesans1{border:1px #b0b0b0 solid}
.noborder{border:0px} 
.outstand{width:60px;border:1px #CCCCCC inset;font-weight:800;text-align:center;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:20px;}
#floater1Div {position:absolute;visibility:visible;width:100px}
.helpcell{font-size:16px;font-weight:500;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;color:<%=cachedstyle.IBGCOLOR%>}

</style>
<%= Toolbox.unifontstyle(cachedstyle.fontsize,orgnum) %>
<script type="text/javascript"  src=checkHTML.js></script>
<script type="text/javascript"  src="assessform.js"></script>
<script type="text/javascript">
  theurl = "<%=thisurl1%>";
  <% if(backupset == false){%>   var backupinfo = '<%=backupinfo0%>';<%}%>
  var cidtitle = "<%= cidtitle %>";
  isembedquiz = true;
  var onlinetoolinitial = "<%=Generic.handle(toolstr)%>";
  var timelastsec = <%= (assopt==null || assopt.maxtime==null || assopt.maxtime.equals(""))? "-1":assopt.maxtime %>*60;
  var timedif=<%=nowinsecond%> - (new Date()).getTime()/1000;
  var detailass = new Hwtake('take',
  "<%= Generic.handle(eqnotext)%>",
  null,
  "<%= attachat%>",
  "<%= pts %>",
  '<%=format%>',-1,true
  );
  
</script>

</head>
<body style="margin:5px 5px 0px 5px" >
    <%=Toolbox.title( Toolbox.emsgs(orgnum,1378) + ": " +   assignname  )  %>
<script>
     var dv = document.createElement('style');
     dv.innerHTML = detailass.divs;
     document.getElementsByTagName('head')[0].appendChild(dv);
     //document.write(detailass.header + detailass.attachheader );
</script>
<% String ins[] = Toolbox.emsgs(orgnum,1391).split("\n"); %>   
<table style="margin-top:4px" width="100%" cellspacing="2" cellpadding="2">
    <tr><td  valign="top" align="center" style="font-size:16px;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>">
<table cellspacing="0" cellpadding="0" border="0" class="outset1" style="border:1px #b0b0b0 outset;border-radius:4px"  align="center" >
   
<tr><td colspan="2" class="helpcell" align="center"><b><%= ins[0] %></b></td></tr>
<tr  height="20">
<td  class="helpcell" colspan="2"><nobr>&nbsp;&bull; <%= ins[1] %></nobr></td>
</tr>
<tr  height="20">
<td  class="helpcell" colspan="2"><nobr>&nbsp;&bull; <%= ins[2] %> </nobr></td>
</tr>
<tr> <td class="helpcell" ><nobr>&nbsp;&bull; <%= ins[3] %></nobr></td>
<td class="helpcell" >
<form rel=opener name="form3" method="post" action="UploadTeaching" target = "w<%=tstmp%>"  style="margin:0px 0px 0px 0px" onsubmit="return picfile(this)" enctype="multipart/form-data">
<input type=hidden name=iid   value="<%= subdb %>" >
<input type=hidden name=sid   value="<%=  sid %>" >
<input type=hidden name=subdb value="<%= subdb %>">
<input type=hidden name=course     value="<%= course %>"> 
<input type=hidden name=operation     value="save">
<input type=hidden name=securitytoken     value="">
<input type=hidden name=subfolder value="submission"> 
<input type=file name=localpath style="width:1px;visibility:hidden"  onChange="doupload()" />  
<input type="button" class="GreenButton" style="width:<%=Math.round(4.5*cachedstyle.fontsize)%>px;font-size:<%=cachedstyle.fontsize+1%>px"  onclick="this.form.localpath.click()" value="<%= Toolbox.emsgs(orgnum,1507)%>" >
<!--input class=OrangeButton  style="background-color:#00BBBB;color:white;font-weight:700;width:60px;font-size:16px"  type=submit name=upload value="<%= ins[3] %>"-->
        
</form></td></tr>
<tr><td style="font-weight:500;color:blue;cursor:pointer;font-size:16px"><%=imglet[0]%></td><td  id="theattach" style="font-weight:500;color:blue;cursor:pointer;font-size:16px" onclick="ResizeUploaded.attachman(document.form1.attach)" ><%=attach.replaceAll("@[^,]+", "").replaceFirst(",$","").replaceFirst(",",", ")%>    
    </td></tr>
</table>
   
</td></tr>
    <tr><td >
<script type="text/javascript"> 

function doupload()
{
    clickedhere(document.form3.localpath);
    submitform3();
}
function showattachment(t)
{
    var allAttachTodel = ResizeUploaded.unzip(t);
    var xx = document.getElementById("theattach"  );
    if (xx!=null  )
    {
        xx.innerHTML = allAttachTodel.replace(/@[^,]+/g,'').replace(/,$/,'').replace(/,/g,', ');
    }
     
    if (typeof(savedQuizName) != 'undefined'  )
    {    
        localStorage[savedQuizName+'a'] = t; 
    }
}
</script>
<form rel=opener name=form1 method=post action="Echo"  style="margin:0px 0px 0px 0px"  >
<div  class="outset3" id=roundmain style="border-radius:4px;background-color:#b0b0b0">
<script type="text/javascript"> 
    detailass.assemble(<%= (type==3) %>);
    document.write(detailass.str);
</script>
</div>
<script type="text/javascript">
    var theattachbtn = null;
    function submitform3()
    {
        if ( picfile(document.form3))
        visual(document.form3);
document.form3.submit();
    }
    function picfile(f)
    {
        if (f.localpath.value=='')
        {
            myprompt('Click "Browse" to select a file');
            return false;
        } 
        f.securitytoken.value = securitytoken;
        formnewaction(f);
      //  f.upload.disabled = true;
        return true;
    }
</script>
<input type=hidden name=rdap   value="submissionsave" >
<input type=hidden name=format   value="<%= format%>" >
<input type=hidden name=sid   value="<%=  sid %>" >
<input type=hidden name=subdb value="<%= subdb %>">
<input type=hidden name=assignname value="<%= assignname %>">
<input type=hidden name=course     value="<%= course %>">
<input type=hidden name=sessionname value="<%= sessionname %>">
<input type=hidden name=semester value="<%= semester %>">
<input type=hidden name=sname value="<%= Toolbox.makeFullName(user.lastname, "", user.firstname)%>">
<input type=hidden name=leas value="" >
<input type=hidden name=attach value="<%=attach%>" >
<input type=hidden name=Content>
<input type=hidden name=noanswer>
<input type=hidden name=mode>
<input type=hidden name=code value="">
<input type=hidden name=questionnum  value="" >
<input type=hidden name=quizdue value="<%=quizdue%>">
 
<input type=hidden name=ismult value="">
 <center>
  
<input class=OrangeButton style="width:<%=Math.round(4.5*cachedstyle.fontsize)%>px;font-size:<%=cachedstyle.fontsize+1%>px;margin:5px" type=button   name=submit2 value="<%=  Toolbox.emsgs(orgnum,51) %>" onclick=saveit(false)>
<!--input class=OrangeButton style="background-color:orange;color:white;font-weight:700;width:68px" type=button onmouseover=showhelphint(this) onmouseout=hidemyhint() name=submit1 value="<%=   Toolbox.emsgs(orgnum,51)  %>" onclick=setact(0)!-->
           
</center>

</form>
</td></tr></table>
<script type="text/javascript">
var tstmp=<%= tstmp %>;
var sofar="<%=  Generic.handle(saved) %>";
document.form1.noanswer.value=detailass.orders;
 
var serial='<%= (assopt.norepeat?1:0)%>,<%=(assopt.openbook?1:0)%>,' + detailass.quesnums.length + ',<%=(System.currentTimeMillis()/1000)%>,<%=due %>';
var subdb='<%= subdb %>';
var thesid='<%= user.id %>';
var msg71 = "<%=Toolbox.emsgs(orgnum,71)%>";
var msg231 = "<%=Toolbox.emsgs(orgnum,231)%>";
var msg873 = "<%=Toolbox.emsgs(orgnum,873)%>";

onbeforeunload = "Answers have not been submitted"; 
/*function failupload(s) 
{
    if (s!=null) myprompt(s);
    document.form3.upload.disabled = false;
}*/
function snapshot(s)
{
    var d =  document.getElementById("snap");
    if (d!=null)
        d.innerHTML = s;
}
var proctors = "";
var proctored = false;

var hasactivities = <%=assopt.recordactivity%>;
var modes = "<%=mode%>";
var  needregister = <%= user.id.matches("[0-9]+") && (user.lastname == null || user.lastname.equals("")) && (user.firstname== null || user.firstname.equals(""))%>;
<% if (embedqz.code.equals("")){;} else if (embedqz.code.indexOf("distinct;") == 0){%>
    let xx = prompt(textmsg[1927].split(/@/)[9]);
    if (xx !=null) xx = xx.replace(/ /g,'');
    document.form1.code.value = xx;
<%} else   if (embedqz.code.indexOf("attendance;") == 0){ if (embedqz.code.contains(";" + sid + ";")){%>
   myprompt(textmsg[1929].split(/@/)[2]);
<%}} else  {%>
    let xx = prompt(textnsg[1927].split(/@/)[9]);
    if (xx !=null) xx = xx.replace(/ /g,'');
     document.form1.code.value = xx;
<%}%>
</script>
<script  type="text/javascript" src="hints.js"></script>
<script type="text/javascript"   src="attachment.js" ></script>
<script type="text/javascript"   src="quizmaker.js" ></script>
<script type="text/javascript"   src="quizclock.js" ></script>
<!--script>floater.div.style.visibility='hidden';</script-->
<script type="text/javascript"   src=curve.js?sn=30&dn=5></script>
<iframe name="w<%=tstmp%>" width="1" height="1" style="visibility:hidden"/>
</body>
</html>
<%} 
else if (mode.equals("roster"))
{
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<body>
<script type="text/javascript"> 
<%
       JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
       if (!adapter.error().equals("")) {
           adapter.close();
           out.println("parent.myprompt('Db Error');</script></body></html>"); 
           return;
       }
       String s0 = "SELECT AppUser.id, AppUser.lastname,  AppUser.firstname FROM AppUser,Registration WHERE "
                   + "AppUser.id=Registration.sid AND Registration.courseid = '" + course.replaceAll("'", "''")
                   + "'AND Registration.semester='" + semester.replaceAll("'", "''")
                   + "' AND Registration.sessionname='" + sessionname.replaceAll("'", "''")
                   + "'";
        boolean bb = adapter.executeQuery2(s0,false);
       
        for (int i = 0; bb && adapter.getValueAt(i, 0)!=null; i++) 
        {
               String id = adapter.getValueAt(i, 0);
               String fname = adapter.getValueAt(i, 1)  + ' ' + adapter.getValueAt(i, 2);
               %>
                 parent.showresponse(['<%=id%>',"<%=fname.replace("\"","'")%>",'-1','roster','','']);
               <%
       }
       adapter.close();
       String followfunc =  Toolbox.defaultParam(orgnum,request, "followfunc", "");
       if (!followfunc.equals(""))
            out.println("parent."+followfunc +";");
       %>
     
</script></body></html>
<%} 
else if (mode.equals("missed"))
{
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<body>
<script type="text/javascript"> 
<%
    String missedsid =  Toolbox.defaultParam(orgnum,request, "missedsid", "");
    String ids = "";
    String sql = "SELECT AppUser.email,0, id,phone FROM AppUser WHERE id='" + user.id + "' or id in ('" + missedsid.replace(",","','") + "')";
    user.changedb(user.id);
    JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (!adapter.error().equals(""))
{
    adapter.close();
    
    out.println("myprompt('db err');</script></body></html>");
    return;
}
    int m = adapter.executeQuery(sql);
    String err = ""; 
    String hisown = adapter.getValueAt(0,0);
    String emailaddr = "";
    for (int j=0; j < m; j++)
    {
        String z = adapter.getValueAt(j,0);
        if (z == null || z.equals("") || !z.matches("[a-z|A-Z|0-9|\\-|\\.|]+@[a-z|A-Z|0-9|\\-|\\.|]+"))
        {
            err += adapter.getValueAt(j,2) + " bad " + Toolbox.emsgs(orgnum,553) + ": " + z + "<br>"; 
            continue;
        }
        emailaddr += "," + adapter.getValueAt(j,0) ;
        
    }
    long l = 0; 
    if(!emailaddr.equals(""))
    {     
        String zipfname = null;
        String msg = "";
        String subject = "You missed today's "+ coursetitle;
        msg = subject + ".\nThere was a class quiz. \n"+  (new java.util.Date()).toString();
        try
        {
            err += telaman.Email.postMail(emailaddr.substring(1).split(","), subject, msg, hisown, zipfname, orgnum); 
        }
        catch(Exception e){err += Generic.handle(e.toString().replaceAll("\n","<br>"));}
        if (err.equals("")) err = Toolbox.emsgs(orgnum,71); 
    }
    adapter.close();
    out.println("<script>parent.myprompt(\"" + err + "\");</script></body></html>"); 
} 
else if (mode.equals("pull"))
{
   if (embedqz == null) return; 
   String questionnum = Toolbox.defaultParam(orgnum,request, "questionnum", "0", null, 4);
   String qtxt = "";
   String ans = "";
   try{
      int j = Integer.parseInt(questionnum);
      if (j>0) 
      {
          qtxt =  embedqz.questiontxt.get(j);
          ans = embedqz.ansv.get(j); 
      }
   }catch(Exception e){} 
   if (qtxt.equals("")|| embedqz.ableviewques == false )
      qtxt = "Listen to instructor";
   %>
   <!DOCTYPE html>
   <html lang="<%=Toolbox.langs[orgnum>>16]%>">
   <head></head>
   <body><script> parent.setquestion(<%=questionnum%>,'<%=qtxt==null?"":qtxt.replace("'", "\\'")%>','<%=ans==null?"":ans.replace("'", "\\'")%>');</script></body></html> 
<%
}
else if (mode.equals("send")) 
{%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<body>  
<script type="text/javascript">
<%
String questionnum = Toolbox.defaultParam(orgnum,request, "questionnum", "-1", null, 4);
int j = Integer.parseInt(questionnum);
String solution =  Toolbox.defaultParam(orgnum,request, "q"+questionnum, "","~!@$%^&*()-+={[}]|\\:;\"'<,>?/",1000);

if (embedqz!=null)
{ 
   if (!embedqz.dynanswer.keySet().contains(sid))
   {
      embedqz.dynanswer.put(sid, new LinkedList<Integer>());  
   }
   
   if (embedqz.code!=null && !embedqz.code.equals(""))
   {
       String code = Toolbox.defaultParam(orgnum,request, "code", "",",!@#$%^&*.,:_-+=",20); 
       if (!user.password.equals("1"))
       {
           boolean checkpass =  checkPass(code,embedqz,user);  
           if (checkpass == false)// && !embedqz.iid.equals(user.id))
           {
                if (embedqz.code.indexOf("distinct;") == 0) {%>
                    parent.response("","","",<%=questionnum%>);
                    if (<%=questionnum%> > 2) parent.document.body.innerHTML = '';
               <%} else if (embedqz.code.indexOf("attendance") == 0) {%>
                    alert('Go to the classroom to meet the instrictor to request to delete your absence record that was taken before the test');if (<%=questionnum%> > 2) parent.document.body.innerHTML = '';
               <%} if (!embedqz.code.equals("")) {%>
                    parent.response("","","",<%=questionnum%>);
                    if (<%=questionnum%> > 2) parent.document.body.innerHTML = '';
               <%}
               %>
               </script></body></html>
               <%
               return; 
            }
            else 
            {
                 user.password = "1";
                 session.setAttribute("User", user);
            }
        }     
   }
    String ans = embedqz.getanswer(j);
 
    String sn = Toolbox.defaultParam(orgnum,request, "sname", user.id, null, 50);
   int kk = 1+embedqz.numanswered.set(j, embedqz.numanswered.get(j)+1);  
   String fmt = Toolbox.defaultParam(orgnum,request, "fmt", "1", null, 1);
   String msg =  user.id + ",'" + sn.replace(","," ").replace("'","''") 
   + "'," + j +  ",'" + solution.replace("'","''") + "'," + kk + "," + fmt + ",-1";
   Msgboxrun.dropmsg(keystr,msg);
   if (embedqz.whofirst.get(j).equals("")) embedqz.whofirst.set(j,Toolbox.makeFullName(user.lastname, "", user.firstname));
   if (solution!=null) solution = solution.replaceAll("\"","\\\"");
   if (ans!=null) ans  = ans.replaceAll("\"","\\\"");
   String qx =   embedqz.questiontxt.get(j);
  %>
      parent.response("<%=Generic.handle(qx)%>", "<%=Generic.handle(solution)%>","<%=Generic.handle(ans)%>",<%=questionnum%>, <%=kk%>, <%=embedqz.due%>);
  <% 
   Queue<Integer> q = embedqz.dynanswer.get(sid);
   while (q.size()>0)
   {
      Integer pp = q.poll();
      int k = pp.intValue();
      if(k < j)
      {
          ans = embedqz.getanswer(k);
          if (ans!=null) ans  = ans.replaceAll("\"","\\\"");
      %>
            parent.response("", "","<%=Generic.handle(ans)%>",<%=k%>, -1, <%=embedqz.due%>);
      <%  
      }
   }
}
else
{
  %>
    parent.myprompt("<%=solution%>","",<%=questionnum%>, 1, 0 );
  <% 
}
%>
</script></body></html>
<%} else if (mode.equals("save") || mode.equals("submit")) 
{
    String code = Toolbox.defaultParam(orgnum,request, "code", "",",!@#$%^&*.,:_-+=",20);
    boolean checkpass = user.password.equals("1") || checkPass(code,embedqz,user);
    if (checkpass == false) 
    {
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<body>  Invalid test location or incorrect pass code. 
<% return;
    }
    String content = Toolbox.defaultParam(orgnum,request, "Content", "");
    content = Toolbox.removescript(content);
    String attachments = Toolbox.defaultParam(orgnum,request, "attach", "");
    String sn = Toolbox.defaultParam(orgnum,request, "sname", user.id, null, 50);
    JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
    if (!adapter.error().equals(""))
    {
        adapter.close();
        out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
        return;
    }    
     
    if (embedqz==null || embedqz.hasindb == false)
    {
        String SQLstr0 = "INSERT INTO Assignment(course, lastupdate,name, semester, sessionname,scale,weight,question,answer,atype,format,options,start,due,status,assgroup,assess,grader,attach,latepermit) VALUES ('"
                   + course.replaceAll("'","''") +  "'," + nowinsecond +",'"
                   + assignname.replaceAll("'","''") + "','"
                   + semester.replaceAll("'","''") + "','"
                   + sessionname + "',10,1,'','',4,'2','"
                   + options
                   + "'," + nowinsecond + ","
                   + quizdue + ",2,'"
                   + Toolbox.emsgs(orgnum,1378)
                   + "','" + assess + "','" + subdb.replaceAll("'","''") + "','" + assignname.replaceAll("'","''")  + "','')";
        adapter.executeUpdate(SQLstr0);
        
        synchronized (this){if(Toolbox.dbadmin[orgnum%65536].cache.containsKey(keystr)) Toolbox.dbadmin[orgnum%65536].cache.put(keystr,  start + ","+ quizdue +",4,'" + options.replace("'","''") + "',''"); }
        synchronized (this){Toolbox.dbadmin[orgnum%65536].assigncache.remove(course + "|" + sessionname);}  
        if (embedqz != null) 
        {
            synchronized(this)
            {
               embedqz.hasindb = true;
            } 
        }
    }
    
    String grade = Toolbox.defaultParam(orgnum, request,"grade", null,null,5);
    try{Float gd = Float.parseFloat(grade);}catch(Exception e){grade = null;}
    assess = Toolbox.defaultParam(orgnum, request,"assess", "");
    boolean isstudent =  (mode.equals("submit"));
    if (assess.equals("") && grade == null )
    {
       String [] xs = content.split("\n");
       StringBuffer ss = new StringBuffer();
       int sc = 0; 
       for (String y : xs)
       {
           String z = y.replaceFirst(".*,([0|1|\\-]+)$","$1");
           if (z.equals("-1"))
           { sc = -1;ss.setLength(0);break;}
           else if (z.equals("1")) sc++;
           
       }
       if (sc >= 0)
      {
           for (String y : xs)
           {
               ss .append( y.replaceFirst("^([0-9]+).*([0|1|\\-]+)$","$1,1,$2"));
               ss.append(";");
           }
           
           AssOption  opt = new AssOption(options,orgnum);
           String expression = opt.f.replace("S",""+sc).replace("Q",""+xs.length).replaceFirst("^[0-9]\\|", "");
           try{
              grade = String.format("%.2f",  (float) ( Evaluate.arithematic(expression)));
              ss.append(xs.length + ",0," + sc + ",|" + opt.f.replaceFirst("[^\\|]*\\|", "") + "|,0," + grade + ",");
           }
           catch(Exception e){
              ss.append(xs.length + ",0," + sc + ",|" + opt.f.replaceFirst("[^\\|]*\\|", "") + "|,0," + sc + ",");
           }
           assess = ss.toString();
       }
    }
    String sql = "";
    if (isstudent) sql = "UPDATE Submission SET content='" +    content.replaceAll("'", "''") 
        + "', grade=" + (grade == null?"-2":grade)
        + ",assess='" + assess.replaceAll("'","''") + "', submtime="
        + nowinsecond +",attach='"
        + attachments.replaceAll("'", "''")
        +"', lastupdate=" + nowinsecond
        + " where sid='" + user.id
        + "' AND course='" + course.replaceAll("'", "''")
        + "' AND assignname ='" + assignname.replaceAll("'","''")
        + "' AND semester='"   + semester.replaceAll("'","''") + "'";
    String sql1 = "INSERT INTO Submission(sid,course,assignname,content,comment,grade,submtime,format,lastupdate,semester,attach,assess) values('"
         + user.id
         + "','" + course.replaceAll("'", "''")
         + "','" + assignname.replaceAll("'","''")
         + "','" + content.replaceAll("'", "''")
         + "','" + Toolbox.emsgs(orgnum,393).replaceAll("'","''")
         + "',"+ (grade == null?"-2":grade) + "," + nowinsecond + ",'1'," + nowinsecond +",'"
         + semester.replaceAll("'","''") +"','"
         + attachments.replaceAll("'", "''") +"','"+ assess.replaceAll("'","''") + "')";
    boolean success = false;
    
    if (isstudent) 
         success = !content.equals("") && (1 == adapter.executeUpdate(sql) || 1 == adapter.executeUpdate(sql1));
    else
         success = !content.equals("") && ( 1 == adapter.executeUpdate(sql1)|| adapter.error().toLowerCase().contains("duplicate"));
    if (!success)
    {
        
        if (isstudent)
        {
           String msg = user.id + ","+ sn + ",-1, " + adapter.error();
           Msgboxrun.dropmsg(keystr,msg);
           out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+ "\" ><head>" 
          + Toolbox.getMeta(orgnum) + "</head><body><font color=red>" +Toolbox.emsgs(orgnum,483) +"</font><br>" + content + "</body></html>");
       }
       else
        {
            out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body><script>parent.savedgrade('"+ sid + "',false);</script></body></html>");
        }
        
    }
    else if (isstudent) // student success submit
    {
        if (embedqz.code.startsWith("distinct;"))
        {
             int j = embedqz.code.indexOf(":" + user.id);
             if (j>0)
            {
                int k = embedqz.code.substring(0,j).lastIndexOf(";");
                String code1 = embedqz.code.substring(k+1,j);
                int l = embedqz.code.indexOf(";", j);
                if (l == embedqz.code.length()-1) embedqz.code = embedqz.code.substring(0,k+1);
                else embedqz.code = embedqz.code.substring(0,k) + embedqz.code.substring(l); 
                 adapter.executeUpdate("DELETE FROM DistinctCode WHERE  code=" + code1 + " AND iid='" + embedqz.iid + "'");
             }
           
        }
        CSVParse embf = new CSVParse(content,'\'',new String[]{",","\r\n"});
        StringBuffer qq = new StringBuffer();
        qq.append("#");
        qq.append(Toolbox.emsgs(orgnum,53));
        qq.append(Toolbox.emsgs(orgnum,873));
        qq.append(Toolbox.emsgs(orgnum,231));
        String y = "<table border=1 style=border-collapse:collapse ><tr><td align=right>#</td><td>" + Toolbox.emsgs(orgnum,53) + "</td><td align=right>" + Toolbox.emsgs(orgnum,873) + "</td><td align=right>" + Toolbox.emsgs(orgnum,231) + "</td></tr>";
        String [] row;
        while ( (row = embf.nextRow() ) != null)
        {
            if (row.length<6) continue;

            if (row[2].equals("0") && embedqz!=null)
            {
                try
                {
                    int i = Integer.parseInt(row[0]);
                    row[5] = "" + embedqz.grade(i, row[1]);
                    row[2] = "" + embedqz.numanswered.get(i); 
                }
                catch(Exception e){}
            }
            y += "<tr><td align=right>" 
              + row[0] + "</td><td>" 
              + row[1].replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;") + "</td><td  align=right>" 
              + (row[5].equals("-1")?"?":row[5]) 
              + "</td><td  align=right>" 
              + row[2] + "</td></tr>";
            qq.append(row[0]);
            qq.append(row[1]);
            qq.append((row[5].equals("-1")?"?":row[5]));
            qq.append(row[2]);
        }
        y += "</table>";
        CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
        StringBuffer q = new StringBuffer(y);
        submitReceipt(q,  user, 'i', semester,   course,
        assignname, nowinsecond, qq.toString(),   attachments, request.getRequestURL().toString(),orgnum, cachedstyle);
        String file =FileOperation.getFileName(course+ (now.get(Calendar.MONTH) + 1) +"-"+now.get(Calendar.DAY_OF_MONTH));
        response.setCharacterEncoding("utf8");//Toolbox.encoding);
        response.addHeader("Content-Disposition", "inline;filename=" + file +".html");
        out.print(q.toString() );
     }
     else // instructor success
     {
        out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >"
         + "<body><script>parent.savedgrade('"+ sid + "',true);");
       
       out.println("</script></body></html>");
     }
     adapter.close();
     if (embedqz != null)
     {
        updatent(embedqz,orgnum,-1);
        String msg = (user.id + "," + sn.replace(","," ") + ",-1,'submit'");
        Msgboxrun.dropmsg(keystr,msg);
         
   }
 } 
//
//
//
//
else if (mode.equals("make")) 
{ 
    String statustr =  "1"  ;
   if (startstr.equals(""))
   {
        JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
        if (!adapter.error().equals(""))
        {
            adapter.close();
            out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
            return;
        }       
        n = 0;
        boolean bb = adapter.executeQuery2("SELECT DomainValue.domainValue,category,Operation.description,name,cgi,opt,OperationCourse.forstudent from Operation, OperationCourse,DomainValue where DomainValue.domain='Tool Caption' AND  CONCAT('',DomainValue.code)=Operation.caption AND DomainValue.language='" + Toolbox.langs[orgnum>>16] + "' AND  Operation.name=OperationCourse.operation and OperationCourse.course ='" + course + "' AND  OperationCourse.forstudent > 0 order by OperationCourse.forstudent",false);
        for (int i = 0; bb && adapter.getValueAt(i, 0)!=null; i++) 
        {
            n++;
            for (int j = 0; j < 6; j++) 
            {
                String x1 = adapter.getValueAt(i, j).replaceAll(";", ",");
                if (j == 5 && adapter.getValueAt(i, 4).equals("UploadTeaching")) { 
                    x1 = x1 + "&course=" + course + "&subdb=" + subdb + "&sid=" + sid;
                }
  
                toolstr += ";" + x1;
            }
        }
       SQLstr = "SELECT name,due,question,format,atype,answer,Assignment.start,status,Course.title,options,assess,attach,timesplit,latepermit,scale,weight,grader,sessionname  FROM Assignment, Course WHERE Assignment.course=Course.id AND Course.id = '" 
               + course.replaceAll("'","''") + "' AND name='" 
               + assignname.replaceAll("'","''") +"' AND semester='" 
               + semester.replaceAll("'","''") +"' AND sessionname = '" 
               + sessionname.replaceAll("'","''") + "'"  ;
       n = 0;
       bb = adapter.executeQuery2(SQLstr,false);
       if (!bb || adapter.getValueAt(0,0)==null)
       {
         
           out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + Toolbox.jaxhead + "</head><body><script type=text/javascript >parent.frames[0].refreshIndex();</script>Try again</body></html>");
           adapter.close();
           return;
       }
       scale = adapter.getValueAt(0,13).trim(); 
       weight = adapter.getValueAt(0,15).trim(); 
       name = adapter.getValueAt(0,0).trim();
       if (name == null) name="";
       if (name.equals("")) name = defname;
       assignname = name;
        
       due = nowinsecond+3600*72;
       xx = adapter.getValueAt(0,1);
       if (xx!=null) try{ due = Long.parseLong(xx); } catch(Exception e){}
       xx = adapter.getValueAt(0,6);
 
       if (xx!=null) try{ start = Long.parseLong(xx);}catch(Exception e){}
       format = adapter.getValueAt(0,3);
       if (format == null) format = "0";
       xx = adapter.getValueAt(0,4);
       if (xx!=null) try{ type = Integer.parseInt(xx);}catch(Exception e){}
       options=adapter.getValueAt(0,9);
       if (options==null) options = "";
       assopt = new AssOption(options,orgnum);
       xx = adapter.getValueAt(0, 7);
       if (xx!=null) try{  status  = Integer.parseInt(xx);} catch(Exception e){}
       if (status>=2)
       {
           status = (nowinsecond <= due)?1:0;
       }
       statusold = status;
       if (status!=0) status = 1;
       statusshow = (status==0)?Toolbox.emsgs(orgnum,299):Toolbox.emsgs(orgnum,218);
       title = adapter.getValueAt(0,8);
       assess = adapter.getValueAt(0,10);
       attachat = adapter.getValueAt(0,11);
       if (attachat == null || attachat.equals("null"))
           attachat = "";
       if (title == null)
           title = course;
       else
           title = title.trim();
       statustr = (nowinsecond<start)?"1":(nowinsecond<=due?"2":"3");

       des = adapter.getValueAt(0,2);
       answer = adapter.getValueAt(0,5);
 
       adapter.close();
    }
    else
    {
       format = "2";
       type = 4;
       options="fs:20;ff:" + Toolbox.fontsnamestr(orgnum>>16)  + ";fw:700;f:0|0.6*S+0.4*Q";
       due = Long.parseLong(quizdue);
       assopt = new AssOption(options,orgnum);
       status = 1;
       statusold = status;
       statusshow = (status==0)?Toolbox.emsgs(orgnum,299):Toolbox.emsgs(orgnum,218);
       title = coursetitle;
       statustr = (nowinsecond<start)?"1":(nowinsecond<=due?"2":"3");
       assess  = "|#|,|pts|,|Objective|,|Answered|,|Correct|,0;|1|,|1|,|0|,|0|,|0|;|2|,|1|,|0|,|0|,|0|;|3|,|1|,|0|,|0|,|0|;|4|,|1|,|0|,|0|,|0|;|5|,|1|,|0|,|0|,|0|;|6|,|1|,|0|,|0|,|0|;|7|,|1|,|0|,|0|,|0|;|8|,|1|,|0|,|0|,|0|;|9|,|1|,|0|,|0|,|0|;|10|,|1|,|0|,|0|,|0|";
       des = "";
       answer = "";
       attachat = ""; 
       weight = "1";
       scale = "10";
    }
   if (answer!=null && answer.replaceAll("\\s","").equals("") == false)
   {
       hasanswer = true;
   }
   else
   {
       answer = "";
   }
   if (embedqz == null)
   {
       embedqz =  new Eq(course +"-" + sessionname, des, answer, options, due,orgnum);
       embedqz.assignname = assignname; 
       embedqz.iid = user.id; 
       embedqz.assess(assess,true); 
   }     
   else
   {
       embedqz.set(options, due);
       embedqz.setQuesAnswer(des, answer);
   }
   embedqz.attach = attachat;
   embedqz.monitored = true; 
   CachedStyle cachedstyle = new  CachedStyle(request, orgnum);  
   String butstyle= "background-color:#00BBBB;color:white;font-size:" +
    cachedstyle.fontsize
    + "px;font-weight:700;width:"
    + Math.round(cachedstyle.fontsize * Toolbox.charwidthrate()*0.9)
    + "px;padding-top:3px;padding-bottom:3px;"
    + "overflow:visible";
   String headings[] = Toolbox.emsgs(orgnum,1392).split("[ ]+");
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>"> 
<head><%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
<title><%=Toolbox.emsgs(orgnum,1378)%></title>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("embedquiz.jsp","f1")%>";
var haswebfolder=<%=user.websitename != null && !user.websitename.equals("")||user.webFileFolder != null && !user.webFileFolder.equals("") %>;
</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script>
<script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
<script type=text/javascript  src=cookie.js></script>
<script  type="text/javascript"  src="findrep.js"></script>
<script  type="text/javascript"  src="attachment.js"></script>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
<link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<style type="text/css">
.cellbg{background-color:<%=cachedstyle.DBGCOLOR%>}
.rado{background-color:<%=cachedstyle.DBGCOLOR%>}
.label{background-color:<%=cachedstyle.IBGCOLOR%>;color:#DDCC11;font-size:<%=cachedstyle.fontsize%>px;font-weight:<%=assopt.fw%>;padding:3px 3px 3px 3px}
.infoinput {background-color:<%=cachedstyle.TBGCOLOR%>;border:0px #b0b0b0 solid;font-size:<%=cachedstyle.fontsize%>px;font-family:<%=assopt.ff%>;padding:3px 3px 3px 3px;line-height:<%=cachedstyle.fontsize+4%>px;margin:0px 0px 0px 0px;text-align:left;vertical-align:middle;overflow:visible}
td,body  {font-size:<%=cachedstyle.fontsize%>px}
textarea {font-size:<%=cachedstyle.fontsize%>px;font-family:courier;font-weight:700}
input.blanklook{border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;border:1px #b0b0b0 solid;font-size:<%=cachedstyle.fontsize%>px;font-family:courier;font-weight:700};
.outstand{border:2px inset;font-weight:800;text-align:center;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:20px;}
#roundmain table tr td {background-color:white;color:black;font-size:<%=cachedstyle.fontsize%>px;font-weight:<%=assopt.fw%>}
.heavyfont{background-color:white;color:black;font-size:<%=cachedstyle.fontsize%>px;font-family:<%=assopt.ff%>;font-weight:<%=assopt.fw%>}
.headsty {background-color:<%=cachedstyle.IBGCOLOR%>;color:#DDCC11;font-size:<%=cachedstyle.fontsize+4%>px;font-weight:<%=assopt.fw%>  !important}
body{margin:3px 3px 0px 3px;background-image:linear-gradient(<%=cachedstyle.BBGCOLOR%>,<%=cachedstyle.DBGCOLOR%>);}
</style>
<%= Toolbox.unifontstyle(cachedstyle.fontsize,orgnum) %>
<script  type="text/javascript"  src=checkHTML.js></script>
<script  type="text/javascript" src="assessform.js"></script>
<script  type="text/javascript" src="timeformat.js"></script>
<script type="text/javascript">
var theurl = "<%=thisurl1.replace("embedquiz.jsp","embedquizmake.jsp")%>";
var cidtitle = "<%=cidtitle %>";
var code = "<%=assopt.code%>";
var nologin = <%=assopt.allowNoLogin%>;
var coursesession = "<%=coursesession%>";
qrlink = function()
{
    safelink0(theurl);
}
 
var tstmp=<%= tstmp %>;
var msg89="<%=Toolbox.emsgs(orgnum,89)%>",firstlbl="<%=headings[4]%>",goallbl="<%=headings[3]%>",msg93="<%=Toolbox.emsgs(orgnum,93)%>";
var d = new Array();d[0] = null;
var savedk = 1;
var font_size = <%=cachedstyle.fontsize%>;
<%
boolean initalshow = !(due>=nowinsecond && nowinsecond >=start);  // no current
int max = embedqz.questiontxt.size();
 
if (max > 0)
for (int i=1; i < max; i++) 
{
    String xy = embedqz.ansv.get(i);
    String zz = Generic.handle(xy); 
%>
    
    d[<%=i%>] = new Array(8);
    d[<%=i%>][0] = "<%=i%>";
    d[<%=i%>][1] =  "<%=Generic.handle(embedqz.questiontxt.get(i))%>";
    
    d[<%=i%>][2] = "<%=(xx==null?"":zz)%>";
    if (d[<%=i%>][2] == 'null') d[<%=i%>][2] = '';
    d[<%=i%>][3] = "<%=embedqz.numanswered.get(i) %>";
    d[<%=i%>][4] = "<%= ( (embedqz.numright.get(i) > -1) ?(""+ embedqz.numright.get(i)):("")) %>";
    d[<%=i%>][5] = "<%= ( (embedqz.numright.get(i) > -1 && embedqz.numtester>0) ?(""+ Math.round(100*embedqz.numright.get(i)/embedqz.numtester) +"%"):("")) %>";
    d[<%=i%>][6] = "<%=embedqz.objective.get(i) %>";
    d[<%=i%>][7] = "<%=embedqz.whofirst.get(i) %>"; 
    if (d[<%=i%>][1]=='undefined') d[<%=i%>][1] = ""; 
    if (d[<%=i%>][2]=='undefined') d[<%=i%>][2] = "";
    if (d[<%=i%>][6]=='undefined') d[<%=i%>][6] = "";
<%}%>
 
var numtester = <%=embedqz.numtester%>;
var timedif =  <%=nowinsecond%> - (new Date()).getTime()/1000 ;
var timeformat = "<%=cachedstyle.timeformat%>";var haswebfolder=<%=user.websitename != null && !user.websitename.equals("")||user.webFileFolder != null && !user.webFileFolder.equals("") %>;
var initalshow = <%= initalshow %>; // not ongoing 
var usstr = '_________';
var msg0 = "<%=Toolbox.emsgs(orgnum,1531) %>", msg71 = "<%=Toolbox.emsgs(orgnum,71)%>", msg233 = "<%=Toolbox.emsgs(orgnum,233) %>",msg1219 = "<%=Toolbox.emsgs(orgnum,1219) %>",msg1243 = "<%=Toolbox.emsgs(orgnum,1243)%>",msg1393 = "<%=Toolbox.emsgs(orgnum,1393)%>";
var statustr = <%= statustr%>;
var assopfs = <%=assopt.fs%>;
var infuture = <%= start - nowinsecond %>;
var onlinetoolinitial = "<%=Generic.handle(toolstr)%>";
// lblcode = "<%=Toolbox.emsgs(orgnum,1580).split("#")[11] %>"; 
</script>
</head>
<body >
 
<%= Toolbox.title(coursetitle+":" +  course + "-" + sessionname)%>

<form rel=opener name="ff" target="w<%=tstmp %>" method="post" style="margin:3px 0px 0px 0px" 
      action="UploadTeaching" enctype="multipart/form-data"> 
    <table id="foottbl" align="center" cellspacing="1" cellpadding="0"><tr><td align="center"><input style="background-color:<%=cachedstyle.DBGCOLOR%>;width:1px;height:1px;border:0px" onfocus=passto()> 
<input name="iid" type="hidden" value="<%=user.id %>" >
<input name="subdb" type="hidden" value="<%= user.id%>" >
<input name="course" type="hidden" value="<%= course%>"> 
<input name="subfolder" type="hidden" value="assignment">
<!--input class=GreenButton  style="<%=butstyle%>" type=button onmouseover=showhelphint(this) onmouseout=hidemyhint()  name=test1   onclick="testreponse()"  value="TestRes"  -->
<input type=file style="width:1px;visibility:hidden" name=localpath   onclick="needcopy();" onchange="clickedhere(this);goupload()"  >
<input type="button" class="GreenButton" style="<%=butstyle%>" value="<%= Toolbox.emsgs(orgnum,1507)%>" onclick="this.form.localpath.click()" >
<td><input class=GreenButton  style="<%=butstyle%>" type=button   name=submit2 value="<%=  Toolbox.emsgs(orgnum,1372)%>" onclick="needcopy();shassess()" ></td>

</td> 
<td><input class=GreenButton style="<%=butstyle%>" type=button onmouseover=showhelphint(this) onmouseout=hidemyhint() name=copyd value="Copy" onclick="needcopy();copyfornew()" ></td>
<td><input class=GreenButton style="<%=butstyle%>" type=button onmouseover=showhelphint(this) onmouseout=hidemyhint() name=alltext value="<%=  Toolbox.emsgs(orgnum,180) %>" onclick="needcopy();falltext()" ></td>
<td><input class=GreenButton style="<%=butstyle%>" type=button onmouseover=showhelphint(this) onmouseout=hidemyhint() name=btnformula value="<%=  Toolbox.emsgs(orgnum,842) %>" onclick="needcopy();setformula()" ></td>
<td><input class=GreenButton style="<%=butstyle%>" type=button onmouseover=showhelphint(this) onmouseout=hidemyhint() name=prevbut value="<%=  Toolbox.emsgs(orgnum,813) %>" onclick="needcopy();preview()" ></td>
<td><input class=OrangeButton style="<%=butstyle%>" type=button onmouseover=showhelphint(this) onmouseout=hidemyhint() name=submit0 value="<%=  Toolbox.emsgs(orgnum,36) %>" onclick="needcopy();updateit(0)" ></td>
<td><input class=GreenButton style="<%=butstyle%>" type=button onmouseover=showhelphint(this) onmouseout=hidemyhint() name="slink" value="Do Link"  onclick="needcopy();studentlink()" ></td>
<td><input class=GreenButton  style="<%=butstyle%>" type=button onmouseover=showhelphint(this) onmouseout=hidemyhint() name=proctor value="<%=Toolbox.emsgs(orgnum,1388)%>" onclick="needcopy();showwho0()" ></td>

<td><input class=OrangeButton style="<%=butstyle%>" type=button onmouseover=showhelphint(this) onmouseout=hidemyhint() name=submit1 value="<%=  Toolbox.emsgs(orgnum,1390)%>" onclick="needcopy();gradeit()" ></td>

<td><input class=RedButton style="<%=butstyle%>"   type=button onmouseover=showhelphint(this) onmouseout=hidemyhint() name=delbtn value="<%=  Toolbox.emsgs(orgnum,30)%>" onclick="needcopy();deleteit()" ></td>
<td><input class=GreenButton style="<%=butstyle%>"  type=button onmouseover=showhelphint(this) onmouseout=hidemyhint() name=snapbtn value="<%=  Toolbox.emsgs(orgnum,1617)%>" onclick="needcopy();snapshot1()" ></td>

<td><input class=GreenButton style="<%=butstyle%>"  type=button onmouseover=showhelphint(this) onmouseout=hidemyhint() name=helpbtn value="<%=  Toolbox.emsgs(orgnum,32)%>" onclick="needcopy();showhelp()" ></td>

<td  onclick="placedown(this)" align="center">&darr;</td></tr></table>
</form>
<table><tr><td id="toolarea" valign="top"></td><td width="100%">
 <form rel=opener name=form1 method=post   style="margin:2px 0px -2px 0px"  >
 <input type=hidden name=subdb value="<%= subdb %>">
 <input type=hidden name=semester value="<%=semester%>">
 <input type=hidden name=course value="<%=course%>">
 <input  type=hidden   name=regradenum value="1">
 <input  type=hidden   name=assignname value="<%=assignname%>">
 <input  type="hidden"  name=sessionname value="<%=sessionname%>"> 
 <input  type=hidden   name=newrecord value="<%=startstr.equals("")?"no":"yes"%>">
 <input type=hidden name=start value="<%=start%>">
 <input type=hidden name=quizdue value="<%=due%>">
<input type=hidden name=mode value="update">
<input type=hidden name=question   value="" >
<input type=hidden name=gradeall value="1">
<input type=hidden name=answer value="">
<input type=hidden name=assess value="<%=assess%>">
<input type=hidden name=attach value="<%=attachat%>">
<!--input type=hidden name=scale value="<%=scale%>" --> 
<input type=hidden name=format value="<%=format%>">
<input type=hidden name=optionstr value="<%=options%>">
<input type=hidden value="<%=scale%>" name="scale">
<table style="margin:4px 0px 4px 0px" width="100%">
<tr><td  valign="top" align="center" style="font-size:16px;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>">
<table id="infotbl" cellspacing="0" cellpadding="0" border="0" class="outset1" style="border:1px #b0b0b0 outset;border-radius:4px"  align="center" >
 <tr>
 <td align="left" class="label" onmouseover=showhelphint1(this) onmouseout=hidemyhint()><nobr><%=Toolbox.emsgs(orgnum,14)%></nobr></td>
<td align="left" valign="middle"  style="padding:0px 0px 0px 0px"><input  class="infoinput" onblur="verifyname(this)"  onchange="resetkey();needsave(1)"  onfocus="holdit(this)"  size="<%=assignname.length()%>"  name=newaname value="<%=assignname%>"></td>
<td class="label" onmouseover=showhelphint1(this) onmouseout=hidemyhint()><nobr><%=Toolbox.emsgs(orgnum,6)%><span style=background-color:white;color:blue;font-weight:700 onclick="setnow1()"> <script>document.write(textmsg[1050])</script> </span></nobr></td><td  valign="middle" style="padding:0px 0px 0px 0px">
    <input  class="infoinput"  name=startstr onfocus="holdit(this)"  onchange="needsave(2)"  onblur="verifydate(this,1)" 
            value="<%=start%>" style="width:<%=7*cachedstyle.fontsize%>px"></td> 
 <td class="label" onmouseover=showhelphint1(this) onmouseout=hidemyhint()><nobr><%=Toolbox.emsgs(orgnum,289)%></nobr></td><td   valign="middle" style="padding:0px 0px 0px 0px">
    <input  onfocus="holdit(this)"  class="infoinput"   onchange="needsave(3)"  onblur="verifydate(this,2)" name=duestr  
            value="<%=due%>" style="width:<%=7*cachedstyle.fontsize%>px"></td> 
 <td class="label" onmouseover=showhelphint1(this) style="display:none;" onmouseout=hidemyhint()><nobr><% String [] tense = Toolbox.emsgs(orgnum,1389).split("[ ]+"); %><%=tense[0]%></nobr></td><td   valign="middle" style="padding:0px 0px 0px 0px" align="right" ><select class="infoinput"  style="display:none;color:<%=cachedstyle.IBGCOLOR%>"  name="status"><option value="0"></option><option value="1"><%=tense[1]%></option><option value="2"><%=tense[2]%></option><option value="3"><%=tense[3]%></option></select></td> 
<td class="label" onmouseover=showhelphint1(this) onmouseout=hidemyhint()><nobr><%=Toolbox.emsgs(orgnum,1089)%></nobr></td><td  class="infoinput"  valign="middle"  style="color:<%=cachedstyle.IBGCOLOR%>;padding:3px 3px 3px 3px" width="0%" align="left" aling="center" ><%= embedqz.numtester %></td>
<td  class="label" onmouseover=showhelphint1(this) onmouseout=hidemyhint()><nobr><%=Toolbox.emsgs(orgnum,358)%></nobr></td><td   valign="middle" align="right"  style="padding:0px 0px 0px 0px"><select class="infoinput" name="fontsizepx" onchange="changefont()"></select></td>
<td  class="label" onmouseover=showhelphint1(this) onmouseout=hidemyhint()><nobr><%=Toolbox.emsgs(orgnum,254)%>(%)</nobr></td><td  width="0%" valign="middle" align="right"  style="padding:0px 0px 0px 0px"><input class="infoinput" style="width:30px;margin:0px 0px 0px 0px" value="<%=weight%>" name="weight" onchange="changeweight(this)"></td>
 
</tr></table>
</td></tr></table>
 


<style>
.outer-div 
{
  width:<%= Math.round((cachedstyle.fontsize+6)*3/7 ) %>px;
  text-align:right;
  margin:auto 10 auto auto;
  padding:0px 5px 0px 0px;
  overflow:hidden;
  border:1px #b0b0b0 outset
}
.inner-div 
{
  float:right;
  font-family:"Comic Sans MS", cursive, sans-serif;
  font-size:<%=cachedstyle.fontsize+6 %>px;
  font-weight:300
}
.outer-file 
{
  width:<%=Math.round(cachedstyle.fontsize * Toolbox.charwidthrate())+2%>px;
  height:<%=cachedstyle.fontsize+5 %>px; 
  text-align:right;
  margin:auto auto auto auto;
  padding:0px 0px 0px 0px;
  overflow:hidden;
  border:1px #b0b0b0 outset;
  border-radius:3px
}
.inner-file 
{
  float:right;/*<%= request.getHeader("User-Agent").indexOf("MSIE") >= 0? "left":"left"%>;*/
  font-size:<%=cachedstyle.fontsize-2%>px;
  font-weight:300;
  border:1px #b0b0b0 outset;
  border-radius:3px;
  font-family:times;
}
    
</style>

<div  class="outset3" id=roundmain style="border-radius:4px;background-color:#b0b0b0">
<table id="maintbl" align="center"  cellpadding=5 cellspacing=1 border=0 width="100%"   style="border-radius:4px">
<tr height="30">
    <td  class=headsty onmouseover=showhelphint1(this) onmouseout=hidemyhint() width="1%"   valign="middle" align="center"  style="padding:0px 0px 0px 5px;background-color:<%=cachedstyle.IBGCOLOR%>;color:#DDCC11 !important">#</td>
    <td  width="57%" style="padding:0px 0px 0px 0px;background-color:<%=cachedstyle.IBGCOLOR%> !important" >
        <table width="100%"  cellpadding=0 cellspacing=0 border=0 >
            <tr>
                <td  width="25%" class=headsty onmouseover=showhelphint1(this) onmouseout=hidemyhint()  valign="middle" align="left"  style="padding:0px 0px 0px 5px;background-color:<%=cachedstyle.IBGCOLOR%>;color:#DDCC11 !important"><%=Toolbox.emsgs(orgnum,1394)%> <span id=swlab1 style="background-color:white;color:blue;font-weight:700" onclick="switchall(1)"> <script>document.write(textmsg[1926].split(/@/)[initalshow?0:1])</script> </span></td>
                
                <td width="50%"  style="padding:0px 0px 0px 5px;background-color:<%=cachedstyle.IBGCOLOR%>;color:blue;cursor:pointer !important" id="theattach" onclick="needcopy();ResizeUploaded.attachman()"></td>
            </tr>
        </table>
    </td>
    <td  width="30%"    valign="middle" align="left" style="padding:0px 0px 0px 0px;background-color:<%=cachedstyle.IBGCOLOR%>;color:#DDCC11 !important">
        <table cellspacing="0" cellpadding="0"><tr><td  id="anchorhold" style=";background-color:<%=cachedstyle.IBGCOLOR%>;color:#DDCC11 !important"><img  src="image/vertbar.jpg" width="3" height="<%=cachedstyle.fontsize+6%>" id="anchor" onmouseout="endanchor()" onmouseover="initanchor()" style="position:relative;cursor:w-resize;padding:0px 0px 0px 0px;border:0px;margin:0px 0px 0px 0px" alt="" /></td>
                <td  class=headsty onmouseover=showhelphint1(this) onmouseout=hidemyhint()   style="padding:0px 0px 0px 5px;background-color:<%=cachedstyle.IBGCOLOR%>;color:#DDCC11 !important"  valign="middle" align="left" ><nobr><%=Toolbox.emsgs(orgnum,53)%> <span style="background-color:white;color:blue;font-weight:700"  id=swlab2 onclick="switchall(2)"> <script>document.write(textmsg[1926].split(/@/)[initalshow?0:1])</script> </span></nobr></td></tr></table></td>
    <td  class=headsty onmouseover=showhelphint1(this) onmouseout=hidemyhint() width="4%"  onclick="refresh()"  valign="middle" align="right"   style="padding:0px 0px 0px 5px;background-color:<%=cachedstyle.IBGCOLOR%>;color:#DDCC11 !important"><nobr><%=headings[0]%></nobr></td>
    <td  class=headsty onmouseover=showhelphint1(this) onmouseout=hidemyhint() width="4%"  onclick="refresh()"   valign="middle" align="right"   style="padding:0px 0px 0px 5px;background-color:<%=cachedstyle.IBGCOLOR%>;color:#DDCC11 !important"><nobr><%=headings[1]%></nobr></td>
    <td  class=headsty onmouseover=showhelphint1(this) onmouseout=hidemyhint() width="4%"  onclick="refresh()"    valign="middle" align="right"   style="padding:0px 0px 0px 5px;background-color:<%=cachedstyle.IBGCOLOR%>;color:#DDCC11 !important"><nobr><%=headings[2]%></nobr></td>
</tr>
<%
int k = 1;
for (int i=1; i < max; i++)
 {
     String quest =  embedqz.questiontxt.get(i);
     String  xy = embedqz.ansv.get(i);
     String zz = Generic.handle(xy);  
     {
     %>
     <tr >
         <td width="1%" valign="top" align="center" id="headimg<%=i%>" ><%=i%></td>
         <td width="57%" valign="top"  align="left" class="heavyfont"  onclick="goedit(this)" >
         <% if (initalshow) {%>
            <%=( quest==null)?"": Generichandle(quest)%>
         <%} else if (!quest.equals("")){%>
            <%=Toolbox.emsgs(orgnum,1393)%>
         <%}%>
         </td>
         <td  width="30%" valign="top"  align="left"  onclick="goedit(this)" >
         <% if (initalshow) {%>
         <%=Generichandle(xy)%>
         <%} else  {%>
         <%= embedqz.ansv.get(i).replaceAll(".","*") %> 
        <%}%>
        </td>
        <td valign="top" onclick="javascript:showans(<%=i%>)" width="4%" align=right>
        <%=embedqz.numanswered.get(i)  %>
        </td>
        <td valign="top"  width="4%" align=right>
         <%=(embedqz.numright.get(i) ) %>
        </td>
        <td valign="top"  width="4%"  align=right>
        <%= ( (embedqz.numtester >0) ?(""+ Math.round(100*embedqz.numright.get(i)/embedqz.numtester) +"%"):("")) %>
        </td>
     </tr>
     <%
     }
 }
%>
    <tr  >
        <td width="1%"   align=center><table><tr><td><img src="image/addopt.png"  style=cursor:pointer  onclick="growrow()"></td><td><img width=20 src="image/delete.png"  style=cursor:pointer  onclick="delrow(this)"></td></tr></table></td>
      <td  width="57%"   align=right> </td>
      <td  width="30%"   align=right> </td>
      <td align=right width="4%"> </td>
      <td align=right width="4%"> </td>
      <td align=right width="4%"> </td>
    </tr>
</table></div>
</form>
        </td></tr></table> 
<% int sek = SessionCount.enq(session.getId());
 
%>
<script> document.ff.slink.value = textmsg[1872];
     let msg842 = "<%=  Toolbox.emsgs(orgnum,842) %>";
     let msg1088 = "<%=  Toolbox.emsgs(orgnum,1088) %>";
     var sek = "<%=sek%>";
     var userid = "<%=user.id%>";
     var timeformat = "<%=cachedstyle.timeformat%>";
     var attachedstr = '<%= attachat%>';
     var msg1600 =  "<%=  Toolbox.emsgs(orgnum,1600) %>";
</script>
<script  type="text/javascript" src="hints.js"></script>
<script  type="text/javascript" src="installtool.js"></script> 
<script  type="text/javascript" src="embedquiz.js"></script>
 
<script  type="text/javascript" src="curve.js?sn=20&dn=5"></script>

 <div id="copyright" style="text-align:center;color:#4d5ddd;font-size:12px"> 
<%= Toolbox.copyright[orgnum>>16]%> 
</div>
<iframe name="w<%=tstmp%>" width="1" height="1" style="visibility:visible"/>
</body>
</html>
<%} else if (mode.equals("poll")) {  
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<body>
<%
if (embedqz != null)
{
   String timej =  Toolbox.defaultParam(orgnum,request,"question", "0",null,1); 
 
%>

<script type="text/javascript">
  
  <% if (timej.equals("4") || timej.equals("1") ||  timej.equals("2") || timej.equals("3")) {%>
      parent.nulltimerstate( <%= timej%>);
  <%}%>
  //parent.snapshot("<%=Generic.handle(embedqz.toString()) %>");

<%
}
else 
{
    out.println("parent.myprompt('tense != present')");
}
%>
 
</script></body></html>
<%
}
else if (mode.equals("change")) {   
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<body><script type="text/javascript">
<%
if (embedqz != null)
{
%>
    parent.dontchange("<%=Toolbox.emsgs(orgnum,1378) %>");
<%
}
else
{
    String questionstr = Toolbox.defaultParam(orgnum,request,"question", "");
    questionstr = Toolbox.removescript(questionstr);
    String answerstr = Toolbox.defaultParam(orgnum,request,"answer","");
    answerstr = Toolbox.removescript(answerstr);
    assess = Toolbox.defaultParam(orgnum,request,"assess","", ",;|", 4000);
    attachat = Toolbox.defaultParam(orgnum,request,"attach","");
    scale = Toolbox.defaultParam(orgnum,request,"scale","10");
    format = Toolbox.defaultParam(orgnum,request,"format","2");
    String atype = Toolbox.defaultParam(orgnum,request,"atype","4", null, 1);
    String err = "";

    JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
    if (!adapter.error().equals(""))
    {
        adapter.close();
        out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
        return;
    }
    String sql = "UPDATE Assignment SET lastupdate=" + nowinsecond +",question='" +   questionstr.replaceAll("'", "''")
            + "', atype=" + atype +  ",answer='" + answerstr.replaceAll("'", "''")
            + "', assess='" + assess.replaceAll("'","''")
            + "', attach='" + attachat.replaceAll("'","''")
            +"', format='" + format
            + "', due=" + quizdue
            +", start=" + start
            +", weight=" + weight
            +", scale=" + scale
            +", options='" + options.replaceAll("'","''")  
            + "' where  course='" + course.replaceAll("'", "''")
            + "' AND  name ='" + assignname.replaceAll("'","''")
            + "'  AND  sessionname='" + sessionname.replaceAll("'","''") + "'   AND semester='"
            + semester.replaceAll("'","''") + "'";

    String sql1 = "INSERT INTO Assignment( course, lastupdate, name, semester, sessionname,scale,weight,question,answer,atype,format,options,start,due,status,assgroup,assess, grader,attach, latepermit) VALUES ('"
                   + course + "'," + nowinsecond +",'"
                   + assignname.replaceAll("'","''") + "','"
                   + semester.replaceAll("'","''") + "','"
                   + sessionname.replaceAll("'","''") + "'," + scale + "," + weight + ",'"
                   + questionstr.replaceAll("'", "''").trim()+ "','"
                   + answerstr.replaceAll("'", "''") + "'," + atype +  ",'" + format  + "','"
                   + options.replaceAll("'","''")  + "',"  + start + ","
                   + quizdue + ",2,'"
                   + Toolbox.emsgs(orgnum,1378)
                   + "','" + assess.replaceAll("'","''") + "','"  + user.id  + "','" + attachat.replaceAll("'","''") + "','')";
   
    boolean didnew = false;
    
    if (1 != adapter.executeUpdate(sql) &&  1 != adapter.executeUpdate(sql1))
    {
             err = "<font color=red>" + adapter.error()    +"</font>";
             %>
              parent.dontchange("<%= Generic.handle(err)%>");
             <%
    }
    else
    {
         synchronized(this){Toolbox.dbadmin[orgnum%65536].assigncache.remove(course + ""+ sessionname);}
         if (atype==null) atype = "4";
         String   info = Toolbox.dbadmin[orgnum%65536].cache.get(keystr);
    if (info == null)
    {     
          ;
          //synchronized(this){Toolbox.dbadmin[orgnum%65536].cache.put(keystr,  start + ","+ quizdue + ","+ atype + ",'" + options.replace("'","''") + "',''");}
    }
    else
    {
       synchronized(this){Toolbox.dbadmin[orgnum%65536].cache.put(keystr, info.replaceFirst("[0-9]+,[0-9]+,[0-9]",start + ","+ quizdue +"," + atype));}     
    }
         %>
              parent.openthis("<%=semester%>","<%=course%>", "<%=assignname%>", "<%=sessionname%>");
         <% 
    }
    adapter.close();
}%>
 
</script>
</body>
</html>
<%}

else if (mode.equals("update") ) {   
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<body><script type="text/javascript">
<%
String result = "";
String questionstr = Toolbox.defaultParam(orgnum,request,"question", "");
questionstr = Toolbox.removescript(questionstr);
String answerstr = Toolbox.defaultParam(orgnum,request,"answer","");
answerstr = Toolbox.removescript(answerstr);
assess = Toolbox.defaultParam(orgnum,request,"assess","", ",;|", 4000);
attachat = Toolbox.defaultParam(orgnum,request,"attach","");
scale = Toolbox.defaultParam(orgnum,request,"scale","10");
format = Toolbox.defaultParam(orgnum,request,"format","2");
options = Toolbox.defaultParam(orgnum,request,"optionstr","90");
String err = "";
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (!adapter.error().equals(""))
{
    adapter.close();
    %>
     parent.myprompt("<%=adapter.server + Toolbox.emsgs(orgnum,1550) %>");
       </script></body></html>
    <%
    return;
}
String sql = "UPDATE Assignment SET lastupdate=" + nowinsecond +",question='" +   questionstr.replaceAll("'", "''")
            + "', atype=4,answer='" + answerstr.replaceAll("'", "''")
            + "', assess='" + assess.replaceAll("'","''")
            + "', attach='" + attachat.replaceAll("'","''")
            + "',format='" + format 
            + "', due=" + quizdue
            +", start=" + start
            +", scale=" + scale
            +", weight=" + ((weight==null||weight.equals(""))?"1":weight)
            + ",options='" + options.replaceAll("'","''") + "'"; 
           
   String newaname = Toolbox.defaultParam(orgnum,request, "newaname", "", "@!#$%&*()-+=[]|:'", 40); 
   if (!newaname.equals(assignname)) 
       sql += ", name='" + newaname.replaceAll("'","''") + "'";
   sql += " where  course='" + course.replaceAll("'", "''")
       + "' AND  name ='" + assignname.replaceAll("'","''")
       + "'  AND  sessionname='" + sessionname.replaceAll("'","''") + "'   AND semester='"
       + semester.replaceAll("'","''") + "'";
  
    String sql1 = "INSERT INTO Assignment( course, lastupdate, name, semester, sessionname,scale,weight,question,answer,atype,format,options,start,due,status,assgroup,assess, grader, attach, latepermit) VALUES ('"
                   + course + "'," + nowinsecond +",'"
                   + assignname.replaceAll("'","''") + "','"
                   + semester.replaceAll("'","''") + "','"
                   + sessionname.replaceAll("'","''") + "'," + scale + "," + weight + ",'"
                   + questionstr.replaceAll("'", "''").trim()+ "','"
                   + answerstr.replaceAll("'", "''") + "',4,'" + format + "','"
                   + options.replaceAll("'","''")  + "',"  + start + ","
                   + quizdue + ",2,'"
                   + Toolbox.emsgs(orgnum,1378)
                   + "','" + assess.replaceAll("'","''") + "','"  + user.id + "','" + attachat.replaceAll("'","''") + "','')";
     
    boolean didnew = false;
    if (1 != adapter.executeUpdate(sql)  )
    {
         err =  adapter.error();
 
 
         if ( 1 != adapter.executeUpdate(sql1))
         {
             err +=("<font color=red>" + adapter.error()    +"</font>");
         }
         else didnew = true;
    }
    synchronized(this){Toolbox.dbadmin[orgnum%65536].assigncache.remove(course +"|" + sessionname);} 
    synchronized(this)
    { 
         if (Toolbox.dbadmin[orgnum%65536].cache.containsKey(keystr)) 
                      Toolbox.dbadmin[orgnum%65536].cache.put(keystr,  start + ","+ quizdue +",4,'" + options.replace("'","''") + "',''");
    }
    adapter.close();
    if (embedqz != null)
    {
        synchronized(this) 
        {
        embedqz.set(embedqz.assoptions, due);
        embedqz.setQuesAnswer(questionstr,answerstr);
        embedqz.assess(assess,false); 
        embedqz.hasindb = true;
        embedqz.due = due;
        }
    }
    if (embedqz!=null)
    {
        synchronized(this)
        {
            embedqz.monitored = true; 
            embedqz.assess(assess,false); 
            int mn = embedqz.mnb();
            assess = embedqz.sumass(mn);
        }
    }
String forcestatus = Toolbox.defaultParam(orgnum,request, "status", "", null, 10);
if (forcestatus.equals("4") == false)
{
if (err.equals("") == false)
{%>
     parent.myprompt("<%= Generic.handle(err)%>");
<%
}
else if (embedqz!=null)
{
  if (didnew) out.print("parent.parent.frames[0].didnew()");

%>
   /*<%=sql %>*/  
  parent.document.form1.newrecord.value = "no";
  parent.document.form1.assignname.value = parent.document.form1.newaname.value;
  
<%
} 
else 
{
    if (didnew) out.print("parent.parent.frames[0].didnew()");  
%>
    if (parent.parent == parent && parent.opener!=null && parent.opener.parent!=parent.opener && parent.opener.parent.frames.length>0 && typeof(parent.opener.parent.frames[0].refresh)=='function')
    {
       parent.opener.parent.frames[0].refresh();
    }
    parent.copyd();
    parent.document.form1.assignname.value = parent.document.form1.newaname.value;
    parent.document.form1.newrecord.value = "no";
    parent.myprompt("<%= Toolbox.emsgs(orgnum,71)%>"); 
    
<%
}
}
%> 
</script>
</body>
</html>
<%}
else if (mode.equals("answer"))
{
   String questionnum = Toolbox.defaultParam(orgnum,request, "questionnum", "0", null, 4);
   String answerstr = Toolbox.defaultParam(orgnum,request,"answer",null);
   if (embedqz!=null && !questionnum.equals("0") && answerstr!=null)
   {
      int j = Integer.parseInt(questionnum);
      embedqz.ansv.set(j,answerstr);
      for (Queue<Integer> q: embedqz.dynanswer.values())
         q.add(j);
      %> <!DOCTYPE html><html lang="<%=Toolbox.langs[orgnum>>16]%>">
          <script>
             parent.confirmpost(1);     
          </script></html>  
      <%
     
}
else if (embedqz!=null)
   {
      String err = (questionnum.equals("0")?"qn=0":"null ans");
      err = (embedqz ==null)? "null eq":err;
      %><!DOCTYPE html><html lang="<%=Toolbox.langs[orgnum>>16]%>"><head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><%=Toolbox.getMeta(orgnum)%></head><body>
     <script type="text/javascript">  
      parent.myprompt('invalid: <%= err  %>');
      </script>
      </body></html>
      <%
   }
}
else if (mode.equals("remove")) 
{
  %><!DOCTYPE html><html lang="<%=Toolbox.langs[orgnum>>16]%>"><head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><%=Toolbox.getMeta(orgnum)%></head><body>
  <%
   if (course.equals("") && sessionname.equals(""))
   {
     
      Msgboxrun.mbox.clear();
      Eq.eqs.clear();
      out.println("<script>parent.addpromptmsg('All cleared');</script></body></html>"); 
      return;
  }
   if (embedqz!=null  ) 
      delcs(embedqz,orgnum);
   Set<String> mss = Msgboxrun.mbox.keySet(); 
   for (String key : mss)
   {   
       key = key.replaceFirst("\\|[0-9]+\\|", "-").replaceFirst("\\|[^\\|]+\\|", "-");
       if (key.equals((orgnum%65536) + "-" + course + "-" + sessionname ))
           Msgboxrun.mbox.remove(key);
    }
   if (request.getParameter("clearmem")!=null) 
   {
        out.println("<script>parent.addpromptmsg('Queues for " + course +"-" + sessionname + " has been removed. <br>Eq Queue=" 
        + Eq.eqs.keySet().toString() + "<br>MsgQ.size=" + Msgboxrun.mbox.keySet().toString() + "<br><a href=javascript:removemem() >del all</a>');</script></body></html>");
        return;
   }
  if (request.getParameter("notupdate") == null)
  {
      JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
      long nd =  (System.currentTimeMillis()/1000+24*3600);
      String sql = "UPDATE  Assignment SET due=" + nd + " WHERE atype=4 AND due < " + (System.currentTimeMillis()/1000) + " AND name NOT in (SELECT DISTINCT assignname FROM Sumission WHERE Submission.course=Assignment.course AND Submission.semester=Assignment.semester)";
      adapter.executeUpdate(sql);
      
      String  info = Toolbox.dbadmin[orgnum%65536].cache.get(keystr);
      if (info != null)
      {
         synchronized(this){ if (Toolbox.dbadmin[orgnum%65536].cache.containsKey(keystr))
           Toolbox.dbadmin[orgnum%65536].cache.put(keystr, info.replaceFirst("([0-9]+,)[0-9]+","$1" + nd));
        }
      } 
      adapter.close();
     %> <script type="text/javascript">  
      parent.resetmode('update');
      
</script>
<%
  }
else{
   %> <script type="text/javascript">  
      parent.deletedeq();
       </script>
   <%
}
  
 %> 
 </body></html><%

  } 
  else if (mode.equals("delete")) 
{
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><%=Toolbox.getMeta(orgnum) %></head>
<body><script type="text/javascript">
<%
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
String err = "";
String sql1 = "DELETE FROM Assignment WHERE course='"  
           + course.replaceAll("'", "''") + "' AND name='"
           + assignname.replaceAll("'", "''") + "' AND semester='"
           + semester.replaceAll("'","''") + "' AND sessionname='"
           + sessionname.replaceAll("'","''") + "'";
if ( 1 != adapter.executeUpdate(sql1))
{
     err = "Other records depend on this";//("<font color=red>" + adapter.error()    +"</font>");
}
else
{
     Toolbox.dbadmin[orgnum%65536].cache.remove(keystr);
     if (embedqz !=null) delcs(embedqz,orgnum);
}
adapter.close();

if (err.equals("")) 
{
%>
   parent.parent.frames[0].refreshIndex();
   parent.delcontent();
<% 
}
else
{
%>
   parent.myprompt(parent.getTextmsg(1690));
<%
}
%><%Msgboxrun.dropmsg(keystr,"");%>
                
</script> </body></html>
<%}
else if (mode.equals("snapshot"))
{
   String s1 = "null";
if (embedqz!=null)
{
s1 = embedqz.snapshot();
}
 
%>
<!DOCTYPE html>
   <html lang="<%=Toolbox.langs[orgnum>>16]%>">
   <body>
       <script>
           let s = <%=s1%>;
           parent.showobj(s);
       </script>                
   </body></html>
<%
}
else if (mode.equals("numq"))
{
   String questionnum = Toolbox.defaultParam(orgnum,request, "numq", null, null, 4);
   try
   {
       int nq = Integer.parseInt(questionnum);
       if (embedqz!=null)
       {
          embedqz.setnumq(nq);   
       }
   }catch(Exception e){} 
   JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
    if (!adapter.error().equals(""))
    {
        adapter.close();
        out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
        return;
    }    
    String SQLstr0 = "UPDATE Assignment SET scale=" + questionnum + " WHERE course='"
                   + course.replaceAll("'","''") +  "' AND name='"
                   + assignname.replaceAll("'","''") + "' AND semester='"
                   + semester.replaceAll("'","''") + "' AND sessionname='"
                   + sessionname + "'";
    nn = adapter.executeUpdate(SQLstr0);
     synchronized(this){Toolbox.dbadmin[orgnum%65536].assigncache.remove(course + "|" + sessionname);}
    adapter.close();
%>
<!DOCTYPE html>
   <html lang="<%=Toolbox.langs[orgnum>>16]%>">
   <body> <%= nn + SQLstr0 + adapter.error()%> 
   </body></html>
<%
}
 
else if (mode.equals("post"))
{
 
   String questionnum = Toolbox.defaultParam(orgnum,request, "questionnum", null, null, 4);
   String textstr = Toolbox.defaultParam(orgnum,request,"text",null);
   String ableview  = Toolbox.defaultParam(orgnum,request,"ableview","0");
   if (embedqz!=null)
   { 
      embedqz.ableviewques = ableview.equals("1");
      if (textstr!=null)
     {
      if ( questionnum !=null)
       {
          int j = Integer.parseInt(questionnum);
          embedqz.questiontxt.set(j,textstr); 
          embedqz.numquestion++;  
       }
       else 
       {
            if (!textstr.equals(""))
            {
                embedqz.setQuesAnswer(textstr, null);
            }
            embedqz.numquestion = embedqz.questiontxt.size() + 1;
        }
      }
    }
   %>
   <!DOCTYPE html>
   <html lang="<%=Toolbox.langs[orgnum>>16]%>">
           <body>
               <script>
                    parent.confirmpost(1);
                    
               </script>                
       </body></html>
<%
} 

else if (mode.equals("done"))
{
    Msgboxrun.dropmsg(keystr, null);
    Msgboxrun.mbox.remove(keystr);
}
else if (mode.equals("code"))
{
   String info = Toolbox.dbadmin[orgnum%65536].cache.get(keystr);
   String code = Toolbox.defaultParam(orgnum,request, "code", "", null, 20);
    
   if (embedqz!=null  )
   {
       embedqz.assoptions = embedqz.assoptions.replaceFirst(";cd:[^;]*",";cd:"+code);
           if (code.indexOf("distinct") >= 0) 
           {
                 if (embedqz.code == null || embedqz.code.length() < 11)
                 {
                        String sqls  = "SELECT code,sid FROM DistinctCode WHERE iid='" + embedqz.iid + "'";                        
                        JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
                        boolean bn = adapter.executeQuery2(sqls, true);
                        StringBuffer sb = new StringBuffer("distinct;");
                        String x2 = "";  
                        for (int i = 0; bn && (x2=adapter.getValueAt(i, 0))!=null; i++) 
                        {
                            sb.append(x2);
                            String yy = adapter.getValueAt(i,1);
                            if (yy!=null && yy.length()>2) 
                                 sb.append(":" + yy);
                            sb.append(";");
                         }
                        embedqz.code = sb.toString();
                        adapter.close(); 
                   }
           }
           else if (code.indexOf("attendance") >= 0)
           {
                JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
                String sqls  = "SELECT sid FROM Absence WHERE courseid='" + course +"' AND sessionname='" + sessionname + "' AND semester=" + semester +" AND atime > " + (embedqz.start-2700);
                boolean bn = adapter.executeQuery2(sqls, true);
                StringBuffer sb = new StringBuffer("attendance;");
                String x2 = "";  
                for (int i = 0; bn && (x2=adapter.getValueAt(i, 0))!=null; i++) 
                {
                    sb.append(x2);
                    sb.append(";");
                 }
                embedqz.code = sb.toString();
                adapter.close(); 
           }
           else embedqz.code = code;
   }
   if (info!=null)
   {
       synchronized(this){Toolbox.dbadmin[orgnum%65536].cache.put(keystr,info.replaceFirst(";cd:[^;]*',",";cd:"+code + "',"));}
   }
   %>
   <!DOCTYPE html>
   <html lang="<%=Toolbox.langs[orgnum>>16]%>">
   <head></head>
   <body><script>parent.confirmset('<%=embedqz==null?"":sessionname%>');</script>
   </body></html> 
<%
}
else if (mode.equals("dcodes") || mode.equals("ddcode"))
{
  JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
  if (mode.equals("ddcode"))
  {
   String x = null; 
   String code = Toolbox.defaultParam(orgnum,request, "code", "");
   String codes [] = code.split(";");
   if (embedqz!=null  )
   {
       int i = embedqz.code.indexOf("distinct");
       if (i == 0) 
        {

            for (i=0; i < codes.length; i++) 
                embedqz.code = embedqz.code.replaceFirst(";" + codes[i] + ";", ";");
        }
   }
    
   //String [] arr = code.replaceFirst(";$","").split(";");
   
   
   for (int i = 0; i < codes.length; i++)  
   {
        
        String sqla = "DELETE FROM DistinctCode WHERE iid='" + user.id + "' AND code='" + codes[i] + "'";
        adapter.executeUpdate(sqla);
            
   }
   
   }
   String x = null; 
   boolean active = true;
   if (embedqz!=null  )
   {
       int i = embedqz.code.indexOf("distinct");
       if ( i >= 0) 
       {
           x = embedqz.code.substring(i + 9);
       }
   }
   if (x == null || x.equals("")) 
   { 
       active = false;
       String sqls  = "SELECT code,sid FROM DistinctCode WHERE iid='" + user.id + "'";                        
      
       boolean bn = adapter.executeQuery2(sqls, true);
       StringBuffer sb = new StringBuffer();
       String x2 = "";  
      
       for (int i = 0; bn && (x2=adapter.getValueAt(i, 0))!=null; i++) 
       {
            sb.append(x2);
            String yy = adapter.getValueAt(i,1);
            if (yy!=null && yy.length()>2) 
                 sb.append(":" + yy);
            sb.append(";");
       }
       x = sb.toString();
       if (embedqz!=null) embedqz.code = "distinct;" + x; 
    }
    adapter.close(); 
   %>
   <!DOCTYPE html>
   <html lang="<%=Toolbox.langs[orgnum>>16]%>">
   <head></head>
   <body><script>parent.managecode1('<%=x%>','<%=embedqz!=null?"1":"" %>');
   </script>
   </body></html> 
<%
}
else if (mode.equals("svcode"))
{
   String x = null; 
   String code = Toolbox.defaultParam(orgnum,request, "code", "");
 
   if (embedqz!=null  )
   {
       int i = embedqz.code.indexOf("distinct");
       if (i == 0) embedqz.code = "distinct" + code;
   }
    
   String [] arr = code.replaceFirst(";$","").split(";");
   JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
   int NN = 0;long ll = System.currentTimeMillis()/1000;
   for (int i = 0; i < arr.length; i++) 
   {
        String ar[] = {arr[i], ""};
        if (arr[i].contains(":"))
        ar = arr[i].split(":");  
        String sqla = "INSERT INTO  DistinctCode(lastupdate, code,sid,iid) VALUES("+ ll + "," + ar[0] + ",'" + ar[1] + "','" + user.id + "')";
        if (1!=adapter.executeUpdate(sqla))
           ;
        else
            NN++;
   }
   adapter.close(); 
   
   %>
   <!DOCTYPE html>
   <html lang="<%=Toolbox.langs[orgnum>>16]%>">
   <head></head>
   <body><script>parent.managecode2(<%=NN%>,,<%=embedqz!=null?"1":"" %>);
   
    </script>
   </body></html> 
<%
}

else if (mode.equals("attend"))
{
       String x = null;
       if (embedqz != null);
       {
           String minutestr = Toolbox.defaultParam(orgnum, request, "minutes", "");
           String ids = Toolbox.defaultParam(orgnum, request, "ids", "");
           int min = 45;
           try {
               min = Integer.parseInt(minutestr);
           } catch (Exception e) {
           }
           JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
           String sqls;
           if (!ids.equals("")) 
           {
               ids = ids.replaceFirst("^;","");
               String[] arr = ids.split(";");
               sqls = "SELECT sid   FROM  Absence WHERE   courseid='" + course + "' AND sessionname='" + sessionname + "' AND semester=" + semester + "  AND atime > " + (System.currentTimeMillis() / 1000 - min * 60);
               boolean bn = adapter.executeQuery2(sqls, true);
               StringBuffer sb = new StringBuffer(";");
               String x2 = "";
               for (int i = 0; bn && (x2 = adapter.getValueAt(i, 0)) != null; i++) {
                   sb.append(x2 + ";");
               }
               String y = sb.toString();
               if (!ids.equals(""))
               for (int i = 0; i < arr.length; i++) {
                   if (!y.contains(";" + arr[i] + ";")) {
                       sqls = "INSERT INTO Absence (lastupdate,sid,courseid,sessionname,semester,askforleave,atime,excuse,attach,reply,justified)  VALUES (" + (System.currentTimeMillis() / 1000)
                                
                               + ",'" + arr[i] + "','" + course + "','" + sessionname + "'," + semester + ",0," + (System.currentTimeMillis() / 1000 - 200) + ",0,'','',0)";
                       if (1!=adapter.executeUpdate(sqls)){ 
                             ; 
                       }
                   } else {
                       y = y.replaceFirst(";" + arr[i] + ";", ";");
                   }
               }
               if (y.length() > 2) {
                   y = y.replaceFirst("^;", "'").replaceFirst(";$", "'").replaceAll(";", "','");
                   sqls = "DELETE FROM Absence WHERE sid in (" + y + ") AND courseid='" + course + "' AND sessionname='" + sessionname + "' AND semester=" + semester + "  AND atime > " + (System.currentTimeMillis() / 1000 - min * 60);
                   adapter.executeUpdate(sqls);
               }
           }
           sqls = "SELECT AppUser.id, AppUser.lastname, AppUser.firstname FROM AppUser, Absence WHERE AppUser.id=Absence.sid AND courseid='" + course + "' AND sessionname='" + sessionname + "' AND semester=" + semester + "  AND atime > " + (System.currentTimeMillis() / 1000 - min * 60);
           boolean bn = adapter.executeQuery2(sqls, true);
           StringBuffer sb = new StringBuffer(1000);
           StringBuffer sb1 = new StringBuffer(1000);
           String x2 = "";
           for (int i = 0; bn && (x2 = adapter.getValueAt(i, 0)) != null; i++) {
               sb.append(x2);
               sb1.append(x2 + ";");
               String yy = adapter.getValueAt(i, 1);
               sb.append(":" + yy);
               yy = adapter.getValueAt(i, 2);
               sb.append(":" + yy + ";");
           }
           x = sb.toString();
           embedqz.code = "attendance;" + sb1.toString(); 
           adapter.close();
       }
  %>
   <!DOCTYPE html>
   <html lang="<%=Toolbox.langs[orgnum>>16]%>">
   <head></head>
   <body><script><%= (embedqz!=null)? ("parent.manageattend1('"+ x + "')"):("parent.myprompt('Manage absence when class is going on');") %>
   
    </script>
   </body></html> 
<%
}


%>