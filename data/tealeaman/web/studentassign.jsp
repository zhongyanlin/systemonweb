<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*,java.io.*" %>
<%!
public String[] split(String ans, int orgnum)
{
    String sep = Assignment.separator(orgnum);
    String [] x = ans.split("((?=" + sep + "))");
    return x;
}
  String [] atta(String x, int i, int orgnum) 
  {
      return Toolbox1.attaget(x, i, File.separator +  Toolbox.emsgs(orgnum,1398).split(",")[1]+  File.separator, orgnum);
  }
  class EmailFile extends Thread
{
    
    String email,subject, msg, fromemailaddr;
    int orgnum;
    public EmailFile(String email, String subject, String msg, String fromemailaddr, int orgnum)
    {
         this.email = email;
         this.subject = subject;
         this.msg = msg;
         this.fromemailaddr = fromemailaddr;
         this.orgnum = orgnum;
    }
    public void run()
    {
        telaman.Email.postMail(email.split(","), subject, msg, fromemailaddr,null, orgnum);
    }
}
%>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html lang="<%=Toolbox.langs[orgnum>>16]%>">

<%
String url1 = Toolbox1.geturl(request);
User user = null;
if (  (user = User.authorize(orgnum,Systemroles.TA| Systemroles.STUDENT|Systemroles.INSTRUCTOR|Systemroles.TEACHINGADMIN | Systemroles.ASSESSER,application,session,request, response, "studentassign.jsp", true)) == null|| !Toolbox.verifytoken(request))
 return;
orgnum=user.orgnum;
String addr = request.getRemoteAddr();
String course =  Toolbox.defaultParam(orgnum,request,"course","",null,20);
String coursetitle =  Toolbox.defaultParam(orgnum,request,"coursetitle","", "!@#$%&()-_+:/",200);
String subdb =  Toolbox.defaultParam(orgnum,request,"subdb","", null,20);
String sid = Toolbox.defaultParam(orgnum,request,"sid",user.id, null, 20);
if (!user.id.equals(sid) && (Systemroles.TEACHINGADMIN | user.roles ) == 0 && (Systemroles.INSTRUCTOR | user.roles ) == 0 )
 return;
long tstmp = System.currentTimeMillis()%10000000;
String sessionname =  Toolbox.defaultParam(orgnum,request,"sessionname","", null, 40);
user.changedb(subdb);
char thisrole = 's';
if (!sid.equals(user.id))
    thisrole = 'i'; 
String semester =  Toolbox.defaultParam(orgnum,request,"semester",Toolbox.dbadmin[orgnum%65536].currentSemester, null, 40);
 
String accessible = Toolbox.defaultParam(orgnum,request, "accessible", "", null, 30); 
String assignname = Toolbox.defaultParam(orgnum,request, "assignname", null, null, 10);
 CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
%>
<head> <%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
  <script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("studentassign.jsp","document.form1.")%>";</script>
  
 <script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
 <title><%=Toolbox.emsgs(orgnum,515)   %></title>
 <%
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
//adapter.executeUpdate("delete from Assignment where options like '%" + user.id + "%'");
if (adapter.error().length()!=0)
{
 adapter.close();
 out.print("<tr><td align=left>Datebase error</td></tr></table><script type=text/javascript  src=curve.js></script>  </body></html>");
 return;
}     
if (assignname!=null && !assignname.equals("") && assignname.replaceFirst("[0-9][0-9][0-9][0-9].[0-9][0-9][0-9][0-9]","").equals(""))
{
   String ff = Toolbox.defaultParam(orgnum,request, "ff", null, null, 10);
   
   String sql; int n;
   if (ff!=null && ff.equals("deleteass"))
   {
       assignname = Toolbox.emsgs(orgnum,1574) + assignname;
       sql = "DELETE FROM Assignment WHERE course='" + course + "' AND name='" +   assignname
    + "' and options LIKE '%" +  user.id + "%' AND semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester
 +"' AND '" + course + "' NOT IN (select course FROM Submission where course='" + course + "' AND assignname='"
+   assignname + "' AND semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester + "')" ;
 
       n = adapter.executeUpdate(sql);
       if (n == 1)
       {
            String email = null;
            sql = "SELECT email FROM AppUser where id='" + subdb + "'";
            if (adapter.executeQuery(sql)==1)
            {  
                email = adapter.getValueAt(0,0);         
                String subject = Toolbox.emsgs(orgnum,30) + " " + course +"-" + sessionname + ":" + assignname;  
                String msg = Toolbox.emsgs(orgnum,1603).replaceFirst("@",user.id).replaceFirst("@",  course + " " + sessionname)
                        .replaceFirst("@", assignname);  
                String fromemailaddr = Toolbox.dbadmin[orgnum%65536].stmpuser + "@" + Toolbox.dbadmin[orgnum%65536].stmphost.replaceFirst(".*\\.([^\\.]+\\.[^\\.]+)", "$1"); 
                new EmailFile(email, subject, msg, fromemailaddr, orgnum).start();
            } 
         %>
           </head><body>
                <script> 
                    parent.myprompt('<%= Toolbox.emsgs(orgnum,71) + "<br><br><center><input type=button style=width:68px class=GreenButton value=\"" +Toolbox.emsgs(orgnum,82) + "\" onclick=parent.close() ></center>"%>');
                    parent.parent.opener.parent.frames[0].openit1('studentassign.jsp');
               </script>
           </body></html>    
                <%
        }
        else
        {
 
         %>
         </head><body>
                <script> 
                    parent.myprompt("<%= Toolbox.emsgs(orgnum,72)%>" );
                </script>
           </body></html>
                <%
        }
        adapter.close();
        return;
   }
   else
   {
       int y = 1900 + (new java.util.Date()).getYear();
       String x01[] = assignname.split("[^0-9]");
       String ss = x01[0] + "/" + y;
       String ds = x01[1] +"/"+ y + " 23:59";
       long sd = Toolbox.parseTime(ss, "MMDD/YYYY");
       long dd = Toolbox.parseTime(ds, "MMDD/YYYY hh:mm");
       String options = "sd:" + user.id + ";ff:" + ff + ";fs:18;f:S";
       sql = "INSERT INTO Assignment(lastupdate,name,course,semester,sessionname,start,due,question,answer,"
+ "format,atype,options,status,scale,weight,assgroup,grader,assess,attach,latepermit,timesplit)  VALUES(" + (System.currentTimeMillis()/1000)
+ ",'" +Toolbox.emsgs(orgnum,1574) + assignname + "','" + course + "','" + Toolbox.dbadmin[orgnum%65536].currentSemester + "','"
+ sessionname + "'," +  sd + "," + dd + ",'" + Toolbox.emsgs(orgnum,1573) + "','" +   Toolbox.emsgs(orgnum,2)
+ "',0,1,'" + options + "',2,10,1,'hw','" + subdb  + "','','','','')";
        n =  adapter.executeUpdate(sql);
        String keystr =  (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + sessionname; 
         synchronized (this){ if (Toolbox.dbadmin[orgnum%65536].cache.containsKey(keystr))
         Toolbox.dbadmin[orgnum%65536].cache.put(keystr,  sd + ","+ dd +",2,'" + options.replace("'","''") + "',''");}
     
        if (n==1)
        {
            String email = null;
            sql = "SELECT email FROM AppUser where id='" + subdb + "'";
            if (adapter.executeQuery(sql)==1)
            {  
                email = adapter.getValueAt(0,0);         
                String url = url1.replaceFirst("studentassign.jsp.*","");
                url +=  "index.jsp?orgnum=" + orgnum + "&id=" + subdb; 
                String subject = course +"-" + sessionname + ":" + assignname;  
                String msg = Toolbox.emsgs(orgnum,1575).replaceFirst("@",user.id).replaceFirst("@",  course + " " + sessionname)
                        .replaceFirst("@", assignname)  + "\n"   + url;  
                String fromemailaddr = Toolbox.dbadmin[orgnum%65536].stmpuser + "@" + Toolbox.dbadmin[orgnum%65536].stmphost.replaceFirst(".*\\.([^\\.]+\\.[^\\.]+)", "$1"); 
                new EmailFile(email, subject, msg, fromemailaddr, orgnum).start();
            }
        }
        else if ( adapter.error().toLowerCase().indexOf("duplicate")>=0)
        {%>
        <script>var oldonload=null; if (typeof(window.onload)=='function')oldonload=window.onload;
            window.onload=function(){if (oldonload!=null) oldonload();undocumented("<%=assignname%> " + textmsg[3]);}</script>  
        <%
        } 
        else
        {%>
        <script>var oldonload=null; if (typeof(window.onload)=='function')oldonload=window.onload;
            window.onload=function(){if (oldonload!=null) oldonload();myprompt("<%=Generic.handle(adapter.error())%>");}</script>  
        <%
        } 
    }
}
String timeformat = cachedstyle.timeformat.replaceFirst("hh:mm:ss","").replaceFirst("hh:mm","").replaceFirst("[ ]+$","");
%>

<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script>var timeformat = "<%=timeformat%>";</script>
<script type="text/javascript"  src=timeformat.js></script>
<style type="text/css">
input {font-size:<%=cachedstyle.fontsize%>px}
span.fresh0{font-weight:600;color:black}
span.fresh1{font-weight:700;color:red}
</style>
 
</head>
<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px" >
 
<center>
<table width="100%" cellpadding="0" cellspacing="0">
<%=Toolbox.title( coursetitle + ": " + Toolbox.emsgs(orgnum,632), 1) %>
<tr height=4><td align=left></td></tr>
<%
 
String statusstr = "";
if (!accessible.equals("true"))
{

 statusstr = RegStatus.goodstatus(adapter,  user,  course,  sid,  subdb);
 if (!statusstr.equals(""))
 {
    out.print("<tr><td align=left>" + statusstr + "</td></tr></table><script type=text/javascript  src=curve.js></script></body></html>");
    return;
 }
 else
    statusstr = "parent.frames[0].setaccessible(\"" + course +"\");";
}

char userrole = 's';
if (!user.id.equals(sid)) userrole = 'i';
if ((user.iid==null||user.iid.equals("")) && !user.id.equals(subdb) )
  user.iid = subdb;
session.setAttribute("User",user);
String course1 = course;
course = course.replaceAll("'","''");
HashMap ass = new HashMap(10);

long l = System.currentTimeMillis()/1000;
String submitSQLstr = "select  assignname, grade FROM Submission where sid='"
 + sid    +   "' AND Submission.course='"
 + course +   "' AND Submission.semester='"
 + semester + "' AND grade>-2";
String procedure = "studentsubmission";
if (!user.id.equals(sid))
 procedure += "ins";

int n = 0;
boolean bb = adapter.executeQuery2(submitSQLstr,false);
 
for (int i = 0; bb && adapter.getValueAt(i,0)!=null ; i++)
{
 ass.put(adapter.getValueAt(i,0),adapter.getValueAt(i,1));
}
String sen = sessionname.replaceAll("'","''");
ArrayList<String []> data = new ArrayList();

String assignSQLstr = "SELECT  Assignment.name, Assignment.due, Assignment.question, Assignment.format, "
 + "Assignment.atype, Assignment.attach, Assignment.status, Assignment.start,  Assignment.options, Assignment.latepermit,Assignment.lastupdate,Assignment.sessionname    FROM Assignment  WHERE  atype < 4 AND course='"
 + course + "' \nAND Assignment.start <= "
 + l + " AND Assignment.semester='"
 + semester + "' \nAND (Assignment.sessionname='" + sen + "' OR Assignment.sessionname LIKE '"
 + sen  + ",%' OR Assignment.sessionname LIKE '%," + sen + ",%' OR Assignment.sessionname LIKE '%," + sen + "' )";
if (!user.id.equals(sid))
 assignSQLstr += "  AND Assignment.grader LIKE '%" + user.id + "%'" ;
assignSQLstr += "  AND Assignment.weight>0 AND NOT Assignment.name=''  ORDER BY -Assignment.start";
out.println("<!--" + assignSQLstr +"-->");
n = 0;
bb = adapter.executeQuery2(assignSQLstr,false);
String stylestr = " style=width:" + (int)(Math.ceil(Toolbox.charwidthrate()*cachedstyle.fontsize)) +"px ";
 
boolean goon = true;
if (!bb || adapter.getValueAt(0,0)==null) 
{
 adapter.close();
 if (Toolbox.dbadmin[orgnum%65536].studentdriven == false)
 {
    out.println("<tr><td align=left>"+coursetitle + Toolbox.emsgs(orgnum,634) + adapter.error() +"</td></tr>"  );
    goon = false; 
 }
}
if (goon && Toolbox.dbadmin[orgnum%65536].studentdriven )
{
    String labs0[] = Toolbox.emsgs(orgnum,1572).split("@");
   // out.println("<tr valign=middle><td   style=\"padding:5px 5px 5px 5px\">"+  labs0[0] + "<a href=javascript:undocumented()>" + labs0[1]  +"</a></td></tr>"  );
    
}
boolean needgrading = false;
String openable ="";
boolean hasit = false;
boolean needtranslator=true;
long due,start;
String name, subm = "", des = "";
boolean hasattach;
String attachment = "";
String label, latepermit;
String atype;
StringBuffer removecookie = new StringBuffer(); 
StringBuffer imagelet = new StringBuffer(); 
boolean openfirst = false;
Pattern separator1 = Pattern.compile(Assignment.separator(orgnum));
StringBuffer assnames = new StringBuffer();
HashMap<Integer,String> changeclick = new HashMap();
 
for (int i = 0; adapter.getValueAt(i, 0)!=null; i++)
{
    n++;
    boolean submititem = false;
    if (i==0)
    {
        try{ 
            if (  System.currentTimeMillis()/1000 -Long.parseLong(adapter.getValueAt(i, 10)) < 6
            && adapter.getValueAt(i,8).indexOf(user.id)>0)
            openfirst = true;
        }catch(Exception e){break;} 
        
    }
    if (assnames.length()>0) assnames.append(","); 
    assnames.append( adapter.getValueAt(i,0) ); 
    String zipfname = null;
     latepermit = adapter.getValueAt(i, 9); 
     atype = adapter.getValueAt(i, 4); 
     if (latepermit==null) latepermit = "";
     des = "";
     name = adapter.getValueAt(i, 0).trim();
     try 
     {
         due = Long.parseLong(adapter.getValueAt(i, 1));
     } catch (Exception e) 
     {
         due = l + 3600 * 72;
     }
     try {
         start = Long.parseLong(adapter.getValueAt(i, 7));

     } catch (Exception e) {
         start = 0;
     }
     String options = adapter.getValueAt(i, 8);
     AssOption assopt = new AssOption(options, orgnum);
     String score = (String) (ass.get(name));
     hasit = (score != null && !score.equals("-2")); //submitted.indexOf("@" + name + "#"+start)>=0;
     
     if (hasit && !score.equals("-1"))
     {
         removecookie.append("document.cookie = \"T" + course + "@" + name +"@" + sid + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/\";\n"); 
         
     }
     String codehash = "";
     if (assopt.code == null || assopt.code.equals(""))
     {
         codehash = "";
     }
     else if ( !assopt.code.contains("distinct") && !assopt.code.contains("attendance")) 
     {
         codehash = Sha1.hash(Toolbox.apphashgene + assopt.code);

     }
     else if (assopt.code.contains("distinct") ) 
     {
         codehash = "distinct";
     }
     else if (assopt.code.contains("attendance") ) 
     {
         codehash = "attendance";
     }
     hasattach = (adapter.getValueAt(i, 5) != null && !adapter.getValueAt(i, 5).equals(""));
     String xs[] = atta(adapter.getValueAt(i, 5), i, orgnum);
     attachment = xs[0];
     //imagelet.append(xs[1]);
     String format = adapter.getValueAt(i, 3);
     if (format == null) 
     {
         format = "0";
     }
     int type = 0;
     int extend = 0;
     float f = 0;
     long dues[] = new long[]{due};
     Toolbox1.extent(latepermit, sid, dues);
     due = dues[0];
     int kk = latepermit.indexOf(sid);
     try 
     {
         type = Integer.parseInt(adapter.getValueAt(i, 4));
         //0: written hw
         //1: multiple-choice hw
         //2: written test
         //3: multiple-choice test
     } catch (Exception e) {
     }
     int status = 2;
     try {
         status = Integer.parseInt(adapter.getValueAt(i, 6));
     } catch (Exception e) {
     }
     if (status >= 2 || kk>=0) 
     {
         status = (l <= due) ? 1 : 0;
     }
     if (status != 0) 
     {
         status = 1;
     }
     
     String code = ""; 
        
     
     String statusshow = (status == 0) ? Toolbox.emsgs(orgnum,147) : Toolbox.emsgs(orgnum,218); //statustr[status].substring(2);

     //out.print(addr +"|"+format +"|" + type +"|" + status +"|" + name + "|" + options +"<br>");
     if (hasit) 
     {
         if (score.equals("-1")) {
             label = Toolbox.emsgs(orgnum,627);
         } else {
             label = Toolbox.emsgs(orgnum,498);
         }
         subm = "<input class=GreenButton " + stylestr + " type=button onclick=javascript:openSubmitted(this," + i + ") value=\"" + label + "\">";

         if ((type > 0)) 
         {
             if (!assopt.reviewable) 
             {
                 des = Toolbox.emsgs(orgnum,628);
             }
             if (subdb.equals(sid) == false && (status == 1 || l <= due + 1000)) 
             {
                //subm = "<font color=green>" + label + "</font>";
             }
         }
     } 
     else 
     {
         if (status == 1) 
         {
            submititem = true;
            String fileprefix = "hmwk"; 
            if (atype!=null && (atype.equals("2") || atype.equals("3"))) fileprefix = "test";
            int foldernum = 1;
            if (atype!=null && (atype.equals("3") || atype.equals("2") || atype.equals("4")))
            {
                foldernum = 2;
            }
            else if (atype!=null && (atype.equals("0") || atype.equals("1")))
            {
                foldernum = 1;
            }
            if (type == 0 || type == 2 || assopt.openbook) 
            {
            Encode6b encoder =  new Encode6b(orgnum);
        
            String fnm = encoder.to6b(name);
            if (fnm.length() > 10) 
                fnm = fnm.substring(fnm.length()-10);
            fileprefix += fnm;
            zipfname = Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + subdb +   File.separator + course + File.separator + UploadFile.pfolders[foldernum] + File.separator + fileprefix + ".zip";
            code = encoder.to6b(zipfname);
            code = "<a href=FileOperation?did=" + code + ">" + Toolbox.emsgs(orgnum,1228) +  "</a>";
            }
           
            if (type == 3 || type == 2) 
             {
                 
                 if (assopt.ip.equals("") == false && addr.indexOf(assopt.ip) < 0) 
                 {
                     subm = "In Lab";
                     des += "<br>" + Toolbox.emsgs(orgnum,1088) + ".";
                 } 
                 else 
                 {
                     
                     des = Toolbox.emsgs(orgnum,630);
                     if (type == 2) {
                         des = Toolbox.emsgs(orgnum,295);
                     }
                     if (score == null) {
                         label = Toolbox.emsgs(orgnum,629);
                     } else {
                         label = Toolbox.emsgs(orgnum,629);
                     }
                     if (assopt.code.equals("") == false) {
                         des += " <br>" + Toolbox.emsgs(orgnum,1088) + ".";
                     }
                     
                     subm = "<input type=button class=OrangeButton " + stylestr + " onclick=\"javascript:openit(this,"
                             + type
                             + ",'" + codehash + "',"
                             + assopt.openbook
                             + ","
                             + assopt.norepeat
                             + "," + i + "," + hasattach + ","+ f + ")\" value=\"" + Toolbox.emsgs(orgnum,629) + "\">";

                 }
             } 
            else 
            {
                
                if (assopt.ip.equals("") == false && addr.indexOf(assopt.ip) < 0) 
                 {
                     subm = "In Lab";
                     des += "<br>" + Toolbox.emsgs(orgnum,1088) + ".";
                 } 
                 else 
                 {
                      
                     if (assopt.code.equals("") == false) {
                             des += " <br>" + Toolbox.emsgs(orgnum,1088) + ".";
                         }
                     subm = "<input class=GreenButton type=button id=but" +i + " " +   stylestr + " onclick=\"openit(this,"
                             + type + ",'" + codehash + "',true,false," + i + "," + hasattach + ","+ f + ")\" value=\"" + Toolbox.emsgs(orgnum,51)+ "\">";
                     if (type == 1 && type==3)  
                     {
                         if (!name.replaceFirst("[0-9][0-9][0-9][0-9].[0-9][0-9][0-9][0-9]","").equals(name)  && Assignment.parse(des,separator1) == null  )
                             des = Toolbox.emsgs(orgnum,1576);
                         else
                             des = Toolbox.emsgs(orgnum,294);
                     }
                 }
             }
         } 
         else 
         {
              
             if (thisrole == 's')
             {
                 if (score == null) 
                 {   //savedQuizName = "T" +    document.form1..course.value + "@" + document.form1..assignname.value + '@' + document.form1..sid.value ;
                     subm = "<input id=but" + i + " class=RedButton " + stylestr + ";background-color:red type=button onclick=\"javascript:retrvsaved('" + (orgnum%65536) + "-" + semester + "-" +  course + "-" + name + "-" + sid + "'," + i + ")\" value=\"" + Toolbox.emsgs(orgnum,631) + "\" >";
                 } 
                 else 
                 {
                     needgrading = true;
                     subm = "<input  id=but" + i + " class=GreenButton " + stylestr + " type=button onclick=javascript:openSubmitted2(this," + i + ") value=\"" + Toolbox.emsgs(orgnum,498) + "\">";
                 }
             }
             else
             {
                 String sessions = adapter.getValueAt(i, 11);
                 changeclick.put(i, "openit(this," + type + ",'" + codehash + "',true,false," + i + "," + hasattach + ",");
                 subm = "<input  id=but" + i + " class=OrangeButton " + stylestr + " type=button onclick=javascript:extenddue(this," + i + ",'" + sessions.replaceAll("'","\\'") + "') value=\"LatePermit\" onload=\"this.value=textmsg[1574]\" >";
             }
             
         }
     }

     if ((type == 3 || type == 2) && !assopt.reviewable && status == 0) {
         des = Toolbox.emsgs(orgnum,628);
     } else if ((type == 3 || type == 2) && assopt.reviewable && status == 0) {
         des = "";
     }

     if (des.equals("")) 
     {
         des = adapter.getValueAt(i, 2);
         if (des != null) {
             des = des.trim();
         }
         if (des == null || des.equals("")) {
             des = "&nbsp;";
         } else {
         
            String [] ps = split(des,  orgnum);  
            StringBuffer s = new StringBuffer();
            for (String ss: ps)
             try 
             {
                 int kl =0,kj;
                 if ( format.equals("0") && (kl=ss.indexOf("\n\t")) >=0 && (kj = ss.indexOf("\n\t",kl))>0)
                 {
                     kj = ss.lastIndexOf("\n\t");
                     kj = ss.indexOf("\n", kj+2);
                     
                     ss =  Toolbox.formatstr(format, ss.substring(0,kl))+
                       "<pre style=\"margin:0px 0px 0px 0px\">" + ss.substring(kl,kj).replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\t", "   ") + "</pre>"
                       +Toolbox.formatstr(format, ss.substring (kj)); 
                 }
                 else
                      ss = Toolbox.formatstr(format, ss);
                 s.append(ss); 
             } catch (Exception e) {
             }
           des = s.toString();
         }

     }
     if (type == 3 || type == 1) 
     {
         des = des.replaceAll("\n([a-i]\\.)", "<br>&nbsp;$1").replaceAll("\n", "<br>");
         if (status < 1 && !attachment.equals(""))
             des =  "<table width=100% ><tr><td><img width=28 src=\"image/clip.png\"  >"+ attachment + "</td></tr></table>" + des;
         else if ( name.replaceFirst( Toolbox.emsgs(orgnum,1574) +  "[0-9]{4}\\-[0-9]{4}", "").equals(""))
         {
             des = "<font color=purple>" + Toolbox.emsgs(orgnum,1591) + "</font>";
         }
     }
     else if ((type == 0 || type == 2) && !attachment.equals("") ) 
     {
         des =  "<table width=100% ><tr><td><img width=28 src=\"image/clip.png\"  >"+ attachment + "</td></tr></table>" + des;
     }
     des = Toolbox1.todiv(orgnum,des,i); 
     if (format.equals("2")) {
        needtranslator = true;   
    }
if (submititem){ 

%>
 <tr><td  width=100% >
         <style><%= xs[1]%></style>
<script  type="text/javascript" >document.write(round1('100%'));</script>
<table width=100% cellpadding=2 cellspacing=1 class=outset3  style="-webkit-transition: -webkit-transform 0ms;transition: -webkit-transform 0ms;-webkit-transform-origin: 0px 0px;-webkit-transform: translate(0px, 0px) scale(1) translateZ(0px);">
    <tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>" ><td align=left width=45% style="font-weight:700"><nobr> <%=name %></nobr></td>
<td align=left width=28%><NOBR><script>document.write(timestr(<%=start%>,'<%=cachedstyle.timeformat%>').replace(/ /g, "&nbsp;") + '&nbsp;~&nbsp;' + timestr(<%=due%>,'<%=cachedstyle.timeformat%>').replace(/ /g, "&nbsp;"));</script></NOBR></td>
<td align=center width=12%><nobr><%=code%></nobr></td>
<td align=right><%=subm%></td></tr>
<!--tr bgcolor=<%=cachedstyle.TBGCOLOR%> ><td colspan=4><%=format.equals(Toolbox.emsgs(orgnum,214))%><%out.print(addr + "|" + format + "|" + type + "|" + status + "|" + name + "|" + options + "<br>");%></td></tr-->
<tr bgcolor=<%=cachedstyle.TBGCOLOR%> >
<td align=left colspan=4  > <%=des%>  
 
</td></tr></table>
<script type="text/javascript" >
document.write(round2);
<% if (openfirst){openfirst = false;%> 
function openfirst()
{ 
   <%= "openit(this," + type + ",'" + codehash + "',true,false," + 0 + "," + hasattach + ","+ f + ");"%>
}
<%}%>

</script>

</td></tr>
<%
}
else
{
  data.add(new String[]{ 
  xs[1],  //0
  name,   //1
  ""+start,  //2
  ""+due,   //3
  code, //4
  subm, //5
  format, //6
  des});   //7
  
}
    
}
adapter.close();

for (String[] x : data)
{ %>
 <tr><td  width=100% > <style><%= x[0]%></style>
<script  type="text/javascript" >document.write(round1('100%'));</script>
<table width=100% cellpadding=2 cellspacing=1 class=outset3  style="-webkit-transition: -webkit-transform 0ms;transition: -webkit-transform 0ms;-webkit-transform-origin: 0px 0px;-webkit-transform: translate(0px, 0px) scale(1) translateZ(0px);">
    <tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>" ><td align=left width=45% style="font-weight:700"><nobr> <%=x[1]%></nobr></td>
<td align=left width=28%> <NOBR><script>document.write(timestr(<%=x[2]%>,'<%=cachedstyle.timeformat%>') + '&nbsp;~&nbsp;' + timestr(<%=x[3]%>,'<%=cachedstyle.timeformat%>'));</script></NOBR></td>
<td align=center width=12%><nobr><%=x[4]%></nobr></td>
<td align=right><%=x[5]%></td></tr>
<tr bgcolor=<%=cachedstyle.TBGCOLOR%> >
<td align=left colspan=4 > <%= x[7]  %>  
 
</td></tr></table>
<script type="text/javascript" >document.write(round2);</script>

</td></tr>   
<%
  
}


%>
</table>

<form rel=opener  name="form3"  method="POST"   >
<input name="assignname"  type="hidden"  value="" >
<input name="course"      type="hidden"  value="<%=course%>">
<input name="option"      type="hidden"  value="destest" >
<input name="semester"    type="hidden"  value="<%=semester%>" >
<input name="sessionname" type="hidden"  value="<%=sessionname%>" >
<input name="subdb"       type="hidden"  value="<%=subdb%>">
<input name="coursetitle" type="hidden"  value="<%=coursetitle%>">
<input name="sid"         type="hidden"  value="<%=sid%>">
<input name="rdap"        type="hidden"  value="" >
<input name="code"        type="hidden"  value="" >
<input name="extension"   type="hidden"  value="0" >
<input name="makescript"  type="hidden"  value="makesubmission" >
</form>
</script>
<script type="text/javascript" >
var theurl = "<%=url1%>";
var coursetitle = "<%=coursetitle%>", sid="<%=sid%>", semester="<%=semester%>";
<% if (accessible==null) 
      out.println( "var accessible=true;"); 
   else
      out.println( "var accessible=" + accessible + ";"); 
%>
var encoding = "<%=Toolbox.encodings[orgnum>>16]%>";var langcode = "<%= Toolbox.langs[orgnum>>16]%>";
var tstmp = <%=tstmp%>;
var assignarr = "<%=assnames%>".split(/,/);
var msg301 = "<%=Toolbox.emsgs(orgnum,301)%>";
var msg631 = "<%=Toolbox.emsgs(orgnum,631)%>";
var msg3 = "<%=Toolbox.emsgs(orgnum,1534)%>";
var msg5 = "<%=Toolbox.emsgs(orgnum,5)%>";
var msg6 = "<%=Toolbox.emsgs(orgnum,6)%>";
var msg998 = "<%=Toolbox.emsgs(orgnum,998)%>";
var msg1256 = "<%=Toolbox.emsgs(orgnum,1256)%>";
var msg1574 = "<%=Toolbox.emsgs(orgnum,1574)%>";
var msg931 = "<%=Toolbox.emsgs(orgnum,931)%>";
var procedure  = "<%=procedure%>";
var needtranslator = <%=needtranslator%>;
var msg627 = "<%=Toolbox.emsgs(orgnum,627)%>";
var msg71 = "<%=Toolbox.emsgs(orgnum,71)%>";
var msg72 = "<%=Toolbox.emsgs(orgnum,72)%>";
var msg498 = "<%=Toolbox.emsgs(orgnum,498)%>";
var cnoren = "<!DOCTYPE html>";
var font_size = <%=cachedstyle.fontsize%>;
var subdb = "<%=subdb%>";
var course = "<%=course%>";
var sessionname = "<%=sessionname%>";
var N = <%=n%>;
var userid = "<%=user.id%>";
function getSid(){return '<%=sid%>';}
<%=statusstr%>;
<%if (goon){ %>
if (initialhintneed(6))
{
 var ugentmsg = initialhint(6,textmsg[914]);
}
<%} 
if (needgrading){%>
var autogradedbut = null;
var autogradeedi = -1;
var autogradeddone = false;
<%}%>
var timestrnow = "<%=Toolbox.timestr(System.currentTimeMillis()/1000,timeformat)%>";

<%if (changeclick.size()>0)
{ 
   out.print("var changeclick = [];\n");
   for(Integer i : changeclick.keySet())
       out.println("changeclick[" + i + "] = \"" + changeclick.get(i) + "\";");
}
%>
      
<%=removecookie%> 
<%=imagelet%> 

</script>
<script type="text/javascript"   src="checkHTML.js"> </script>

<script type="text/javascript"  src=sha1.js></script>
<script type="text/javascript"  src=curve.js></script>
<script type="text/javascript"  src=attachment.js></script>
<script type="text/javascript"  src=studentassign.js></script>

 
<iframe name="w<%=tstmp%>" width=1 height=1  style="visibility:hidden"/>
 
</body>

</html>
