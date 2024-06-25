<%@ page contentType="text/html; charset=utf-8"  import="telaman.*,java.sql.*,java.util.concurrent.*,java.util.*,java.util.regex.*"  %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
    java.util.Scanner s = new Scanner(System.in);
    
%>
<%!
boolean thesame(String x, String y)
{
    String [] xs = x.split("\\|"); String [] ys = y.split("\\|");
    int j = 0;
    for( ; j < xs.length-1; j++)
        if (!xs[j].equals(ys[j])) return false;
    xs[j] = "," + xs[j].replaceAll(" ","") + ",";
    ys[j] = "," + ys[j].replaceAll(" ","") + ","; 
    return xs[j].contains(ys[j]) || ys[j].contains(xs[j]);
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
 
String Generichandle(String s)
{
   if (s==null) return "";
   return s.replaceAll("<", "<");
}
 
 
String pad2(int i)
{
  if (i < 10) return "0" + i;
  return "" + i;
}

%>

<%
User user = null;
if ( (user = User.authorize(orgnum,Systemroles.TA | Systemroles.SYSTEMADMIN | Systemroles.SYSTEMANALYST| Systemroles.INSTRUCTOR | Systemroles.SYSTEMANALYST,application,session,request, response, "follows.jsp", false)) == null) 
 return;

user.changedb(user.id);
String mode = Toolbox.defaultParam(orgnum,request,"mode","take");
String thisurl1 = Toolbox1.geturl(request); 
 
orgnum = user.orgnum; 
String subdb =  Toolbox.defaultParam(orgnum,request,"subdb",null,null,30);

String course =  Toolbox.defaultParam(orgnum,request,"course", "","-",30);
String sessionname =  Toolbox.defaultParam(orgnum,request,"sessionname","","-,",70);
 
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
 
deb += ("semester=|" + semester +"|");
deb += ("mode=|" + mode +"|");
 
long tstmp = System.currentTimeMillis() % 10000000;
String course1 = course.replaceAll("'","''");
long nowinsecond =  System.currentTimeMillis()/1000; 
String SQLstr = "";
String contentstr =  "";
String gradestr = "";
boolean quiz = true;
String pts =  Toolbox.defaultParam(orgnum,request,"Assessment","");
response.setHeader("X-XSS-protection", "0"); 
String keystr =   (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + sessionname; 
JDBCAdapter adapter = null;  
AssignCache assigncache = Toolbox.dbadmin[orgnum%65536].assigncache.get( course + "|" + sessionname);

if (mode.equals("code"))
{
   String info = Toolbox.dbadmin[orgnum%65536].cache.get(keystr);
   String code = Toolbox.defaultParam(orgnum,request, "code", "", null, 20);
   if (info!=null)
   {
       synchronized(this){Toolbox.dbadmin[orgnum%65536].cache.put(keystr,info.replaceFirst("cd:[^;]*',","cd:"+code + "',"));}
   }
   user.changedb(user.id);
   adapter = Toolbox.getUserAdapter(user, orgnum);
   String ss [] =sessionname.split(",");
   String sexits = "";
   for (String sa : ss)  
   {
        assigncache = Toolbox.dbadmin[orgnum%65536].assigncache.get( course + "|" + sa);
        keystr =   (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + sessionname;
        if (assigncache == null || !thesame(assigncache.keystr,keystr)) continue;
        sexits +=   sa + ",";
        int kk = assigncache.options.indexOf(";cd:");
        if (kk >=0)
            assigncache.options = assigncache.options.substring(0,kk+4) + code;
        else 
            assigncache.options = assigncache.options  + ";cd:"+code;
        
        if (code.indexOf("distinct") >= 0) 
        {
            String sqls  = "SELECT code,sid FROM DistinctCode WHERE iid='" + user.id + "'";                        
            boolean bn = adapter.executeQuery2(sqls, true);
            StringBuffer sb = new StringBuffer(";");
            String x2 = "";  
            for (int i = 0; bn && (x2=adapter.getValueAt(i, 0))!=null; i++) 
            {
                sb.append(x2);
                String yy = adapter.getValueAt(i,1);
                if (yy!=null && yy.length()>2) 
                     sb.append(":" + yy);
                sb.append(";");
             }
            assigncache.options += sb.toString();
        }
        else if (code.indexOf("attendance") >= 0)
       {
            String sqls  = "SELECT sid FROM Absence WHERE courseid='" + course +"' AND sessionname in ('" + sessionname.replaceAll(",","','") + "') AND semester=" + semester +" AND atime > (" + assigncache.start + "-2700)";
            boolean bn = adapter.executeQuery2(sqls, true);
            StringBuffer sb = new StringBuffer(";");
            String x2 = ""; 
            for (int i = 0; bn && (x2=adapter.getValueAt(i, 0))!=null; i++) 
            {
                sb.append(x2);
                sb.append(";");
             }
            assigncache.options += sb.toString();
        }
        synchronized (this){Toolbox.dbadmin[orgnum%65536].assigncache.put(course + "|" + sa, assigncache);}    
   }
   adapter.close();  
   %>
   <!DOCTYPE html>
   <html lang="<%=Toolbox.langs[orgnum>>16]%>">
   <head></head>
   <body>
    <script>parent.confirmset('<%=sexits.replaceFirst(",$","")%>');</script>
   </body></html> 
<%
}
else if (mode.equals("dcodes") || mode.equals("ddcode"))
{
   user.changedb(user.id);
   adapter = Toolbox.getUserAdapter(user, orgnum);
   String ss [] =sessionname.split(",");
   String sexists = "";
   keystr =   (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + sessionname; 
   HashMap<String,String> h = (HashMap)(application.getAttribute(keystr));
   if (mode.equals("ddcode")) 
   {
       String x = null;
       String code = Toolbox.defaultParam(orgnum, request, "code", "");
       String codes[] = code.split(";");
       if (h!=null)
        {
            for (String k : codes)
            h.remove(k);
        }
        
       for (int i = 0; i < codes.length; i++) 
       {
           String sqla = "DELETE FROM DistinctCode WHERE iid='" + user.id + "' AND code='" + codes[i] + "'";
           if (1 != adapter.executeUpdate(sqla)) {
               ;
           }
       }
   }
   String x = null;
   boolean active = true;
   int i = 0;
   String sqls = "SELECT code,sid,lastupdate FROM DistinctCode WHERE iid='" + user.id + "' ORDER BY code";
   boolean bn = adapter.executeQuery2(sqls, true);
   StringBuffer sb = new StringBuffer();
   String x2 = "";
 
   for (int j = 0; bn && (x2 = adapter.getValueAt(j, 0)) != null; j++) 
   {
       sb.append(x2);
       String yy = adapter.getValueAt(j, 1);
       if (yy != null && yy.length() > 2) {
           sb.append(":" + yy);
       }
       else if (h!=null && (yy = h.get(x2))!=null) sb.append(":" + yy);
       else sb.append(": ");
       String zz = adapter.getValueAt(j, 2);
       if (yy != null && yy.length() > 2 && zz != null && zz.length() > 2) {
           sb.append(":" + zz);
       }
       else sb.append(": ");
       sb.append(";");
   }
   x = sb.toString();
   
   if (mode.equals("dcodes"))
   for (String sa : ss)  
   {
        assigncache = Toolbox.dbadmin[orgnum%65536].assigncache.get( course + "|" + sa);
        keystr =   (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + sessionname;
        if (assigncache == null || !thesame(assigncache.keystr,keystr)) continue;
        sexists += sa + ",";
    } 
   adapter.close();
   %>
   <!DOCTYPE html>
   <html lang="<%=Toolbox.langs[orgnum>>16]%>">
   <head></head>
   <body><script>parent.managecode1('<%=x%>','<%=sexists.replaceFirst(",$","")%>');
   </script>
   </body></html> 
<%
}
else if (mode.equals("absence"))
{
   String sessions = Toolbox.defaultParam(orgnum, request, "sessions", sessionname);
   keystr = (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + sessions; 
   HashMap<String,String> h = (HashMap)application.getAttribute(keystr);
   Set<String> set =  h.keySet();
   String codes = "";
   for (String xx : set) codes += "'" + xx + "',";
   String ss = "('" + sessionname.replaceFirst(" ","").replaceAll("[ ]*,[ ]*", "','") + "')";
   codes = "(" + codes.replaceFirst(",$", ")");
   String sql = "SELECT Registration.sid, AppUser.lastname, AppUser.firstname,Registration.sessionname FROM Registration LEFT JOIN AppUser ON AppUser.id=Registration.sid WHERE Registration.courseid='"
            + course1 + "'  AND semester='" + semester.replaceAll("'","''")
            + "' AND sessionname IN " + ss + ((codes!=null && codes.equals(""))?("  AND NOT sid IN " + codes ):"") + " AND NOT sid IN (SELECT sid FROM Submission WHERE semester='" + semester + "' AND course='" + course + "' AND assignname='" + assignname + "') ORDER by 4, 2, 1";
   user.changedb(user.id);
  
   adapter = Toolbox.getUserAdapter(user, orgnum);
   int n = adapter.executeQuery(sql);  
   StringBuffer b = new StringBuffer();
   if (n < 0) b.append(adapter.error().replaceAll("'",""));
   for (int i = 0; i < n; i++) 
   {
      for (int j = 0; j < 4; j++)
     {  
       String xx =  adapter.getValueAt(i,j);
       if (xx == null) xx = " ";
       else xx = xx.replaceAll(",",""); 
          b.append(xx);
       if(j < 3) 
          b.append(",");
       else if (i < n-1) 
          b.append(";");
      }
    }
   adapter.close(); 
%>
   <!DOCTYPE html>
   <html lang="<%=Toolbox.langs[orgnum>>16]%>">
   <head></head>
   <body><script>parent.absence('<%=b.toString()%>','<%=sessionname%>');
   </script>
   </body></html> 
<%
}
else if (mode.equals("absencerecord"))
{
user.changedb(user.id);
   adapter = Toolbox.getUserAdapter(user, orgnum);
   String code = Toolbox.defaultParam(orgnum,request, "code", "");
   String ss = "('" + sessionname.replaceFirst(" ","").replaceAll("[ ]*,[ ]*", "','") + "')";
   String m[][] = (new CSVParse(code, '|', new String[]{",", ";"})).nextMatrix();
   long ll = System.currentTimeMillis();
   String nows = (new java.sql.Date(ll )).toString();
    ll /= 1000; 
   int N = 0;
   for (int i=0; i < m.length; i++)
  {
       String sql  = "INSERT INTO Absence (lastupdate,sid,courseid,sessionname,semester,askforleave,atime,excuse,attach,reply,justified)  VALUES( " + (ll)
                          + ",'" + m[i][0] + "','" + course + "','" + m[i][1] + "'," + semester + ",0," + (ll  ) + ",0,'','',0)";
       int n = adapter.executeUpdate(sql); if (n> 0) N++; 
       sql = "INSERT INTO Message(lastupdate,rid, postdate,subject, content,suppress,sid,format,subdb) VALUES(" +
               ll + 
               ",'"  + m[i][0] + 
               "'," + ll + 
               ",'"   + Toolbox.emsgs(orgnum,1600) + 
               "','"  + Toolbox.emsgs(orgnum,577) + ' ' +  Toolbox.emsgs(orgnum,1600) + " @ " + nows  +  
               "',0,'" + user.id + 
               "','0','" + user.id + "')" ;
        n = adapter.executeUpdate(sql); if (n> 0) N++; 
   }
  
   adapter.close(); 
%>
   <!DOCTYPE html>
   <html lang="<%=Toolbox.langs[orgnum>>16]%>">
   <head></head>
   <body><script>parent.myprompt(<%=N%> + ' records<br>' +  '<%=adapter.error().replaceAll("\n"," ")%>');
   </script>
   </body></html> 
<%
}
else if (mode.equals("svcode"))
{
   String x = null; 
   String code = Toolbox.defaultParam(orgnum,request, "code", "");
   String ss [] =sessionname.split(",");
   String sexists = "";
   for (String sa : ss)  
   {
        assigncache = Toolbox.dbadmin[orgnum%65536].assigncache.get( course + "|" + sa);
        keystr =   (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + sessionname;
        if (assigncache == null || !assigncache.keystr.equals(keystr)) continue; 
        sexists += sa + ",";
       int i = assigncache.options.indexOf(";cd:distinct");
       if (i > 0) assigncache.options = assigncache.options.substring(0,i) + ";cd:distinct;" + code;
   }
    
   String [] arr = code.replaceFirst(";$","").split(";");
   user.changedb(user.id);
   adapter = Toolbox.getUserAdapter(user, orgnum);
   int NN = 0;long ll = System.currentTimeMillis()/1000;
   for (int i = 0; i < arr.length; i++) 
   {
        String ar[] = {arr[i], ""};
        if (arr[i].contains(":"))
        ar = arr[i].split(":");
        String sqla = "INSERT INTO  DistinctCode(lastupdate,code,sid,iid) VALUES(" +ll + ","  + ar[0] + ",'" + ar[1] + "','" + user.id + "')";
        if (1!=adapter.executeUpdate(sqla))
        {    
            sqla = "UPDATE DistinctCode SET lastupdate=" +ll + ",sid='" + ar[1] + "',iid='" + user.id + "' WHERE code="  + ar[0] ;
            if (1==adapter.executeUpdate(sqla)) NN++;
        }
        else
            NN++;
 
   }
   adapter.close(); 
   
   %>
   <!DOCTYPE html>
   <html lang="<%=Toolbox.langs[orgnum>>16]%>">
   <head></head>
   <body><script>
       parent.managecode2(<%=NN%>,'<%=sexists%>');
    </script>
   </body></html> 
<%
}

else if (mode.equals("attend"))
{
    String x = null;
    adapter =  Toolbox.getUserAdapter(user, orgnum);
    if (assigncache == null || !thesame(assigncache.keystr,keystr)) 
    {
        if (!adapter.error().equals(""))
       {
        adapter.close();
        out.println(adapter.server + Toolbox.emsgs(orgnum,1550) + "\n" + adapter.error());
        return;
        }
       SQLstr = "SELECT name,due,question,format,atype,answer, start,status,Course.title,options,assess,attach,timesplit,latepermit,scale,weight,grader,sessionname  FROM Assignment, Course WHERE Assignment.course=Course.id AND Course.id = '" 
            + course1 + "' AND name='" + assignname.replaceAll("'","''") 
            +"' AND semester='" + semester.replaceAll("'","''")
            +"' AND (sessionname LIKE '%," + sessionname.replaceAll("'","''") 
            + ",%' OR sessionname LIKE '%," + sessionname.replaceAll("'","''") 
            + "' OR sessionname LIKE '" + sessionname.replaceAll("'","''") 
            + ",%' OR sessionname='" + sessionname.replaceAll("'","''") + "')"  ;

        int n = 0;
        boolean bb = adapter.executeQuery2(SQLstr,false);
        if (!bb || adapter.getValueAt(0,0)==null )
        {
         out.println( Toolbox.getMeta(orgnum) + "</head><body>" 
                 + ((user.roles|Systemroles.SYSTEMADMIN|Systemroles.SYSTEMANALYST)>0?SQLstr:"") + "<br>" + course + "  " + assignname + " " + semester + " " + sessionname + " " + Toolbox.emsgs(orgnum,1531) + adapter.error() +"</body></html>");
         adapter.close();
         return;
        }
        assigncache = new AssignCache(adapter);
        if (!assigncache.options.contains(";cd:")) assigncache.options += ";cd:";
        synchronized (this){Toolbox.dbadmin[orgnum%65536].assigncache.put(course + "|" + sessionname, assigncache);}
        //keystr =   (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + assigncache.sessions;
        assigncache.keystr = keystr.replaceFirst("[^\\|]+$", assigncache.sessions);
        if (Toolbox.dbadmin[orgnum%65536].cache.get(keystr) != null) 
        {  String info = assigncache.start + "," +  assigncache.due + "," +  assigncache.atype + ",'" +  (new AssOption(assigncache.options.replaceFirst(";cd:.*$",";cd:attndance"),orgnum)).shorter().replace("'","''") + "','" +  assigncache.latepermit + "'";
           
           synchronized(this){Toolbox.dbadmin[orgnum%65536].cache.put(keystr,info);}
        }
    }
   String minutestr = Toolbox.defaultParam(orgnum, request, "minutes", "");
   String ids = Toolbox.defaultParam(orgnum, request, "ids", "");
   int min = 45;
   try {
       min = Integer.parseInt(minutestr);
   } catch (Exception e) {
   }
   
   String sqls;
   if (!ids.equals("")) 
   {
       ids = ids.replaceFirst("^;","");
       String[] arr = ids.split(";");
       sqls = "SELECT sid   FROM  Absence WHERE   courseid='" + course + "' AND sessionname IN ('" + sessionname.replaceAll(",","','") + "') AND semester=" + semester + "  AND atime > " + (System.currentTimeMillis() / 1000 - min * 60);
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
   sqls = "SELECT AppUser.id, AppUser.lastname, AppUser.firstname FROM AppUser, Absence WHERE AppUser.id=Absence.sid AND courseid='" + course + "' AND sessionname IN ('" + sessionname.replaceAll(",","','") + "') AND semester=" + semester + "  AND atime > " + (System.currentTimeMillis() / 1000 - min * 60);
   boolean bn = adapter.executeQuery2(sqls, true);
   StringBuffer sb = new StringBuffer();
   StringBuffer sb1 = new StringBuffer();
   String x2 = "";
   for (int i = 0; bn && (x2 = adapter.getValueAt(i, 0)) != null; i++) {
       sb.append(x2);
       sb1.append(x2 + ";");
       String yy = adapter.getValueAt(i, 1);
       sb.append(":" + yy);
       yy = adapter.getValueAt(i, 2);
       sb.append(":" + yy + ";");
   }
   try{x = sb.toString();
   int i = assigncache.options.indexOf(";cd:");
   assigncache.options = assigncache.options.substring(0,i) + ";cd:attendance;" + sb1.toString();}catch(Exception e){ }
   adapter.close();
        
  %>
   <!DOCTYPE html>
   <html lang="<%=Toolbox.langs[orgnum>>16]%>">
   <head></head>
   <body><script>parent.manageattend1('<%= x %>',true);</script>
   </body></html> 
<%
}


%>
