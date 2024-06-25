 
package telaman;

import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import static telaman.Webform.ss;
 

public class BackRoutine 
{
    
    public static String postproc(User user, JDBCAdapter adapter, String rname, HashMap saved, StringBuffer str, CachedStyle cachedstyle) {
       
        int orgnum =  adapter.orgnum; 
        DBAdmin admin = Toolbox.dbadmin[orgnum%65536];
        String savingname = "";
        AssignCache assigncache = null;
        if (rname != null &&  rname.equals("webservices") && (  (user.roles & Systemroles.INSTRUCTOR )>0 
                || (user.roles & Systemroles.SYSTEMADMIN )>0 && adapter.server.equals(admin.systemserver))) 
        {
            for (String cs : admin.assigncache.keySet())
               try{admin.assigncache.get(cs).toolstr = "";}catch(Exception e){}
        }
        else if (rname != null && rname.equals("courseservices"))
        {
            String wcds = (String)saved.get("wcds");
            PassedData pd = new PassedData(wcds);
            pd.init();
            char c = pd.getChar();
            String course = pd.getElement();
            for (String cs : admin.assigncache.keySet())
                if (cs.startsWith(course + "|"))
                     try{admin.assigncache.get(cs).toolstr = "";}catch(Exception e){}
        }
        else if (rname != null && rname.equals("license")) 
        {
             if (str == null) 
            {
                str = new StringBuffer();
            }
            
            String rsaenccode = (String)saved.get("rsacode");
            String wcds = (String)saved.get("wcds");
            if (rsaenccode.equals("2") || rsaenccode.equals("3")) 
            {
                wcds = Toolbox.decrypt(wcds,orgnum);
            }
           
            PassedData pd = new PassedData(wcds);
            pd.init();
            
            char c = pd.getChar();
            String email = pd.getElement();
            
            boolean b = adapter.executeQuery2("SELECT cid,product,edition,version,language,platform from Slicense where cid='" + email + "' and id=''",false);
            String x = "";
            if (b && adapter.getValueAt(0,0)!=null)
            {  x = Sha1.hash(adapter.getValueAt(0,0) + "," + adapter.getValueAt(0,1) + ","  + adapter.getValueAt(0,2) + "," + adapter.getValueAt(0,3) + "," + adapter.getValueAt(0,4) + ","
             + adapter.getValueAt(0,5) + ",");
             int n = adapter.executeUpdate("Update Slicense set id='" + x + "' where cid='" + email + "' and id=''");
             str.append("</td></tr></table><script type=text/javascript>" + Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle) + ";var tbl = parent.document.getElementById('maintbl');tbl.rows[2].cells[0].align='left';tbl.rows[2].cells[0].innerHTML=\"");
             str.append(Toolbox.emsgs(orgnum,1536)+"<br>");
             str.append(x);
             
             str.append("\";tbl.deleteRow(3); parent.closeprompt(); </script></body></html>");
            }
        }
        else if (rname != null && rname.equals("assigndb")) 
        {
            if (str == null) 
           {
                str = new StringBuffer();
            }
            
            String rsaenccode = (String)saved.get("rsacode");
            String wcds = (String)saved.get("wcds");
            if (rsaenccode.equals("2") || rsaenccode.equals("3")) 
            {
                wcds = Toolbox.decrypt(wcds,orgnum);
            }
           
            PassedData pd = new PassedData(wcds);
            pd.init();
            
            char c = pd.getChar();
            if (user == null) user = new User(admin.orgnum);
            else user.orgnum = admin.orgnum;
            user.id = pd.getElement();
            
            boolean n = adapter.executeQuery2("SELECT roles, email from AppUser where id='" + user.id + "'",false);
            if (!n || adapter.getValueAt(0,0)==null) 
            {
                str.append("</td></tr></table>");
            } 
            else 
            {
                user.roles = 0;
                try 
                {
                    user.roles = Long.parseLong(adapter.getValueAt(0, 0));
                }
                catch (Exception e) 
                {
                }
                String email = adapter.getValueAt(0, 1);
                String sqi = "SELECT id FROM AppUser WHERE (NOT id='" + user.id + "') and email='" +   email + "'";
                boolean b = adapter.executeQuery2(sqi,false);
                 
                if (b && adapter.getValueAt(0, 0)!=null) 
                {
                    String oid = adapter.getValueAt(0, 0);
                    sqi = "DELETE FROM AppUser WHERE id='" + user.id + "' AND email='" + email + "'";
                    int m = adapter.executeUpdate(sqi,false);
                   
                    sqi = "DELETE FROM Student WHERE id='" + user.id + "'";
                    m = adapter.executeUpdate(sqi);
                 
                    str.append("</td></tr></table><script type=text/javascript>" + Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle) + ";parent.myprompt('");
                    str.append(Toolbox.emsgs(orgnum,553) + email + " " + Toolbox.emsgs(orgnum,1492) + " "  + oid + ".<br>"+ Toolbox.emsgs(orgnum,1493) + "');parent.setv(0,14,'');if (typeof (parent.disablefuncbut) == 'function')parent.disablefuncbut(false);</script></body></html>");
                }
                else
                {
                    sqi= "UPDATE AppUser  SET webFilefolder='/' WHERE  AppUser.id='" + user.id + "' AND roles IN (SELECT  rolecode FROM Role WHERE owndb=1)";
                    int m = adapter.executeUpdate(sqi);
                    long nu = (System.currentTimeMillis()/1000)  - 3660*24 - 265;
                    sqi= "INSERT INTO Student (lastupdate, id, majorprogram, minorprogram, advisor, entrytime, entryscore, prevschool, prevdegree, notes, balance, status,experience,family,reference )  SELECT  10000000, id, '', '', ''," + nu + ",'', '','', '', 0.0,'Active','','','' from AppUser where id='" + user.id + "' AND (roles mod 2) = 1";
                    if ((user.roles & Systemroles.STUDENT) > 0) m = adapter.executeUpdate(sqi);
                    str.append("</td></tr></table><script type=text/javascript>" + Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle) + ";var tbl = parent.document.getElementById('maintbl');tbl.rows[2].cells[0].align='left';tbl.rows[2].cells[0].innerHTML=\"");
                    str.append(Toolbox.emsgs(orgnum,952).replaceAll("\\n", ""));
                    str.append(":");
                    str.append(user.id);
                    str.append(")");
                    str.append(Toolbox.emsgs(orgnum,954).replaceAll("\\n", ""));
               
                    if (Systemroles.owndb(user.roles)) 
                    {
                        String sql;
                        
                        if (admin!=null)
                        {
                        String dbms = admin.defaultdbms;
                        int i=0;
                        for ( i = 0; !(i >= admin.numHosts || admin.dbhost[i].dbms.equals(dbms)); ++i) 
                        {
                        }
                        if ( dbms.equals("h2") )
                        {
                             if (admin.dbFileFolder!=null)
                                admin.dbhost[i].host = "jdbc:h2:" + admin.dbFileFolder.replace('\\', '/') + "/";
                             else
                                admin.dbhost[i].host = "jdbc:h2:~/";
                        }
                        int n1 = adapter.executeUpdate(sql = "INSERT INTO DBOwner(lastupdate,id,server,driver,timeformat,msgcount,submitcount,talkcount,dbuserid,dbpassword) values(" 
                                + (System.currentTimeMillis() / 1000) + ",'" + user.id + "','" + admin.dbhost[i].host + admin.dbhost[i].admindb + "','" + admin.dbhost[i].driver + "','" + Toolbox.timeformat + "',0,0,0,'" + admin.dbhost[i].uid + "','" + admin.dbhost[i].password + "')");
                        if (n1 != 1) 
                        {
                            str.append(Generic.handle1(adapter.error()));
                            //str.append(adapter.error() + "Please report this to the System Administration<br>");
                        } else 
                        {
                            str.append(Toolbox.emsgs(orgnum,955));
                            str.append(":" + admin.dbhost[i].host + admin.dbhost[i].admindb);
                        }
                        
                        }
                    }
                    else 
                    {
                        str.append("<br>" + Toolbox.emsgs(orgnum,953).replaceAll("\\n", ""));
                       
                    }

                    str.append("\";tbl.deleteRow(3); parent.parent.restoredim('" + user.id + "');</script></body></html>"); 
                }
                
            }
            savingname = "inline;filename=account.html";
           
             
        } else if (rname != null && rname.equals("createdb")) 
        {
            if (Toolbox.edition.contains("Personal"))
            {
                return postproc(user, adapter, "assigndb", saved, str, cachedstyle);
            }
            if (str == null) 
            {
                str = new StringBuffer();
            }
            String rsaenccode = (String)saved.get("rsacode");
            String wcds = (String)saved.get("wcds");
            if (rsaenccode.equals("2") || rsaenccode.equals("3")) {
                wcds = Toolbox.decrypt(wcds,orgnum);
            }
           
            PassedData pd = new PassedData(wcds);
            pd.init();
            
            char c = pd.getChar();
            if (user == null) 
                user = new User(admin.orgnum);
            else
                user.orgnum = admin.orgnum;
           
            user.id = pd.getElement();
           
            boolean b = adapter.executeQuery2("SELECT roles, email from AppUser where id='" + user.id + "'",false);
            if (!b || adapter.getValueAt(0, 0)==null) 
            {
                str.append("</td></tr></table>");
            } 
            else 
            {
                user.roles = 0;
                try 
                {
                    user.roles = Long.parseLong(adapter.getValueAt(0, 0));
                }
                catch (Exception e) 
                {
                }
                String email = adapter.getValueAt(0, 1);
                String sqi = "SELECT id FROM AppUser WHERE (NOT id='" + user.id + "') and email='" +   email + "'";
                b = adapter.executeQuery2(sqi,false); 
                 
                if (b && adapter.getValueAt(0, 0)!=null) 
                {
                    String oid = adapter.getValueAt(0, 0);
                    sqi = "DELETE FROM AppUser WHERE id='" + user.id + "' AND email='" + email + "'";
                    int m = adapter.executeUpdate(sqi);
                   
                    sqi = "DELETE FROM Student WHERE id='" + user.id + "'";
                    m = adapter.executeUpdate(sqi);
                 
                    str.append("</td></tr></table><script type=text/javascript>" + Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle) + ";parent.myprompt('");
                    str.append(Toolbox.emsgs(orgnum,553) + email + " " + Toolbox.emsgs(orgnum,1492) + " "  + oid + ".<br>"+ Toolbox.emsgs(orgnum,1493) + "');parent.setv(0,14,'');if (typeof (parent.disablefuncbut) == 'function')parent.disablefuncbut(false);</script></body></html>");
                }
                else
                {
                    sqi= "UPDATE AppUser  SET webFilefolder='/' WHERE  AppUser.id='" + user.id + "' AND roles IN (SELECT  rolecode FROM Role WHERE owndb=1)";
                    int m = adapter.executeUpdate(sqi);
                    long nu = (System.currentTimeMillis()/1000)  - 3660*24 - 265;
                    sqi= "INSERT INTO Student (lastupdate, id, majorprogram, minorprogram, advisor, entrytime, entryscore, prevschool, prevdegree, notes, balance, status,experience,family,reference )  SELECT  10000000, id, '', '', ''," + nu + ",'', '','', '', 0.0,'Active','','','' from AppUser where id='" + user.id + "' AND (roles mod 2) = 1";
                    //if ((user.roles & Systemroles.STUDENT) > 0) m = adapter.executeUpdate(sqi);
                    str.append("</td></tr></table><script type=text/javascript>" + Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle) + ";var tbl = parent.document.getElementById('maintbl');tbl.rows[2].cells[0].align='left';tbl.rows[2].cells[0].innerHTML=\"");
                    str.append(Toolbox.emsgs(orgnum,952).replaceAll("\\n", ""));
                    str.append(":");
                    str.append(user.id);
                    str.append(")");
   
                    str.append(Toolbox.emsgs(orgnum,954).replaceAll("\\n", ""));
                    if (Systemroles.owndb(user.roles)) 
                    {
                        adapter.close();
                        user.retr();
                        StringBuffer qq = new StringBuffer();
                        DBConnectInfo dc = admin.createDB(user, qq);
                        if (dc == null) 
                        {
                            str.append("<font color=red>" + Generic.handle(qq.toString()) + "</font>");
                        } 
                        else 
                        {
                            str.append(Toolbox.emsgs(orgnum,955).replaceAll("\\n", ""));
                            str.append(":" + dc.server);
                            str.append(" <br>" + Toolbox.emsgs(orgnum,953).replaceAll("\\n", ""));
                        }
                    } 
                    else if (user.roles == 1)
                    {
                        String courseid = (String)(saved.get("courseid"));
                        String sessionname = (String)(saved.get("sessionname"));
 
                        if (courseid!=null)
                        {
                            long ll = (System.currentTimeMillis()/1000);
                            String sql = "INSERT INTO Registration(lastupdate,sid,courseid,sessionname,semester, status, grade,evaluation,attendance,target,decision) VALUES(" +  ll + ",'" + user.id + "','" + courseid + "','" + sessionname + "','" + Toolbox.dbadmin[orgnum%65536].currentSemester + "',311,'','',0,'" + courseid + "',1)";
                            adapter.executeUpdate(sql);
                  
                            String subdb = (String)(saved.get("subdb"));
                            if (subdb!=null)
                            {
                                user.subdb = subdb;
                                String sql1 = "AppUser;SELECT  lastupdate, id,  AppUser.password, NULL, NULL,  roles, firstname, middlename, lastname, title, department, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, photourl,NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0,16,NULL,NULL,0,websitename   FROM AppUser WHERE id='" + user.id + "';"   
                                + "Registration;SELECT Registration.lastupdate,sid,courseid,sessionname,Registration.semester,evaltime,Registration.status,grade,evaluation,attendance,target,decision,rstatus,whosehand FROM Registration  WHERE   Registration.courseid='" + courseid + "' And sessionname='" + sessionname + "' AND semester='" + Toolbox.dbadmin[user.orgnum%65536].currentSemester  + "' AND sid='" + user.id + "';"  
                                + "Student;SELECT * FROM Student WHERE id='" + user.id + "'";
                               
                                sql1 = DataMove.importdata(user, sql1, "backup", true);
                            }
                        }
                        str.append("<br>" + Toolbox.emsgs(orgnum,953).replaceAll("\\n", ""));
                    }

                    str.append("\";tbl.deleteRow(3); parent.parent.restoredim('" + user.id + "');</script></body></html>"); 
                }
                
            }
            savingname = "inline;filename=account.html";
        } 
        else if (rname != null && rname.equals("dbowner") ) 
        {
            String wcds = (String)saved.get("wcds");
            CSVParse p = new CSVParse(wcds,'\'', new String[]{",",":"});
            String [][] ps = p.nextMatrix();
            for (int i = 0; i < ps.length; i++)
            {
                String id = ps[i][ps[i].length-1];
                if (id!=null)
                Toolbox.dbadmin[orgnum%65536].dbinfocache.remove(id);
            }
             
        }
        else if (rname != null && rname.equals("deltempass") ) 
        {
           String Assessment,Name,Start,Due,Format,Status,Question,Answer;
           String   Type,Sessions,Grader,Options,Scale,Weight,LatePermit,TimeSplit;
           String   course,Semester,Attach;
           String wcds = (String)saved.get("wcds");
            PassedData pd = new PassedData(wcds);
            pd.init();
            char c = pd.getChar();
      
            if (c == 'i')
            {
                Name= pd.getElement();
                Start= pd.getElement();
                Due= pd.getElement();
                Format= pd.getElement();
                Status= pd.getElement();
                Question= pd.getElement();
                Answer= pd.getElement();
                Type= pd.getElement();
                Options= pd.getElement();
                Sessions= pd.getElement();
                Grader= pd.getElement();
                course= pd.getElement();
                Semester= pd.getElement();
                if (Semester.equals(Toolbox.dbadmin[orgnum%65536].currentSemester))
                {
                    Scale= pd.getElement();
                    Weight= pd.getElement();
                    Name= pd.getElement();
                    Assessment= pd.getElement();
                    Attach= pd.getElement();
                    LatePermit= pd.getElement();
                    String keystr = (orgnum%65536) + "|" + Semester + "|" + course + "|" + Name + "|" + Sessions;
                    String   info = Start + "," +  Due + "," +  Type + ",'" +  (new AssOption(Options,orgnum)).shorter().replace("'","''") + "','" +  LatePermit + "'";
                    if (Semester.equals(Toolbox.dbadmin[orgnum%65536].currentSemester))
                    synchronized(user)
                    { 
                        Toolbox.dbadmin[orgnum%65536].cache.put(keystr,info);
                        if ( (assigncache = Toolbox.dbadmin[orgnum%65536].assigncache.get(course + "|" + Sessions))!=null && assigncache.keystr.equals(keystr))
                        Toolbox.dbadmin[orgnum%65536].assigncache.remove(course + "|" + Sessions);
                    } 
                }
            }
            else if (c=='u')
            {
                Attach = pd.getElement();
                Assessment = pd.getElement();
                Name = pd.getElement();
                Start = pd.getElement();
                Due = pd.getElement();
                Format = pd.getElement();
                Status = pd.getElement();
                Question = pd.getElement();
                Answer = pd.getElement();
                Type = pd.getElement();
                Sessions = pd.getElement();
                Grader = pd.getElement();
                Options = pd.getElement();
                Scale = pd.getElement();
                Weight = pd.getElement();
                LatePermit = pd.getElement();
                TimeSplit = pd.getElement();
                Name = pd.getElement();
                Sessions = pd.getElement();
                course = pd.getElement();
                Semester = pd.getElement();
                if (Semester.equals(Toolbox.dbadmin[orgnum%65536].currentSemester))
                {
                    String keystr = (orgnum%65536) + "|" + Semester + "|" + course + "|" + Name + "|" + Sessions;
                    String info = null; try{ info = Toolbox.dbadmin[orgnum%65536].cache.get(keystr);}catch(Exception e){}
 
                    if (info!=null)
                    {
                        CSVParse p = new CSVParse(info,'\'', new String[]{","});
                        String [] z = p.nextRow();
                        if (Start!=null && !Start.equals(""))z[0] = Start;
                        if (Due!=null && !Due.equals(""))z[1] = Due;
                        if (Type!=null && !Type.equals(""))z[2] = Type;
                        if (Options!=null && !Options.equals("")) z[3] = (new AssOption(Options,orgnum)).shorter();
                        if (LatePermit!=null && !LatePermit.equals(""))z[4] = LatePermit;
                        info = p.toString(z);
                        synchronized(user)
                        { 
                            Toolbox.dbadmin[orgnum%65536].cache.put(keystr,info); 
                           if ( (assigncache = Toolbox.dbadmin[orgnum%65536].assigncache.get(course + "|"   + Sessions))!=null && assigncache.keystr.equals(keystr))
                                Toolbox.dbadmin[orgnum%65536].assigncache.remove(course + "|"   + Sessions);  
                         }
                    }
                    else
                    {
                        String query = "SELECT  start, due, atype, options, latepermit FROM Assignment  WHERE Assignment.course= '" + course + "' AND name='" + Name.replaceAll("'","''") +"' AND semester='" + Semester.replaceAll("'","''") +"' AND (sessionname LIKE '%," + Sessions.replaceAll("'","''") + ",%' OR sessionname LIKE '%," + Sessions.replaceAll("'","''") + "' OR sessionname LIKE '" + Sessions.replaceAll("'","''") + ",%' OR sessionname='" + Sessions.replaceAll("'","''") + "')"  ;
                        int n = adapter.executeQuery(query);
                        
                        if (n > 0)
                        {
                            String infostr = adapter.getValueAt(0,0) + "," +
                            adapter.getValueAt(0,1)+ "," + 
                            adapter.getValueAt(0,2)+ ",'" +
                            (new AssOption(adapter.getValueAt(0,3),orgnum)).shorter().replace("'","''")+ "','" +
                            adapter.getValueAt(0,4) + "'";
                            synchronized(user)
                            {
                            Toolbox.dbadmin[orgnum%65536].cache.put(keystr, infostr); 
                            if ( (assigncache = Toolbox.dbadmin[orgnum%65536].assigncache.get(course + "|"   + Sessions))!=null && assigncache.keystr.equals(keystr))
                            {
                                Toolbox.dbadmin[orgnum%65536].assigncache.remove(course + "|"   + Sessions);
                            } 
                        
                            }
                        }
                    }
                }
            }
            else
            {
                Name = pd.getElement();
                Sessions = pd.getElement();
                course = pd.getElement();
                Semester = pd.getElement();
                String keystr = (orgnum%65536) + "-" + Semester + "-" + course + "-" + Name + "-" + Sessions;
                synchronized(user){
                Toolbox.dbadmin[orgnum%65536].cache.remove(keystr);
                if ( (assigncache = Toolbox.dbadmin[orgnum%65536].assigncache.get(course + "|"   + Sessions))!=null && assigncache.keystr.equals(keystr))
                    Toolbox.dbadmin[orgnum%65536].assigncache.remove(course + "|"   + Sessions); }
            }
         }
         else if (rname != null && rname.equals("submitasstest")) {
            if (str == null) {
                str = new StringBuffer();
            }
            String url = (String)saved.get("&");
            PassedData pd = new PassedData((String)saved.get("wcds"));
            pd.init();
            char c = pd.getChar();
            String content = pd.getElement();
            if (content != null) {
                content = content.replaceAll("''", "'");
            }
            String dummy = pd.getElement();
            String attach = pd.getElement();
            dummy = pd.getElement();
            String courseid = pd.getElement();
            String assignname = pd.getElement().replaceAll("''", "'");
            String semester = pd.getElement();
            if (c == 'i' || c == 'u') {
                String tt = "";
                long k1 = System.currentTimeMillis() / 1000;
                if (!(attach == null || attach.equals(""))) {
                    String[] vv = attach.replaceFirst(",$", "").split(",");
                    for (int i = 0; i < vv.length; ++i) {
                        if (vv[i].indexOf("@") < 0) continue;
                        long k = 0;
                        try {
                            k = Integer.parseInt(vv[i].replaceFirst("[^@]+@", ""));
                        }
                        catch (Exception e) {
                            k = k1;
                        }
                        tt = tt + vv[i].replaceFirst("@.*", "") + " (" + Toolbox.timestr(k) + ")  ";
                    }
                }
                if (c == 'u' && (attach == null || attach.equals(""))) {
                    attach = "no change";
                }
                if (c == 'u' && (content == null || content.equals(""))) {
                    content = "no change";
                }
                String file = FileOperation.getFileName(courseid + assignname);
                str.setLength(0);
                str.append(Toolbox.formatstr("0", content));
                Esign.submitReceipt(str, user , c, semester, courseid, assignname, k1, content, tt, url, user.orgnum,cachedstyle);
                savingname = "inline;filename=" + file + ".html";
            }
        } else if (rname != null && rname.equals("commondata")) 
        {
            Systemroles.readRoles(adapter);
            for (int k=0; k < Toolbox.langs.length; k++)
            {
                String[] sql = new String[]{"select id, name FROM Department order by name", "select code, domainValue from DomainValue WHERE domain='Semester' and language='" + Toolbox.langs[k] + "' order by code", "select rolecode, DomainValue.domainValue from Role,DomainValue where Role.bitorder=DomainValue.code AND DomainValue.domain='Role Name' AND DomainValue.language='" + Toolbox.langs[k] + "'"};
                String[] vars = new String[]{"var depts=[ ", "var sms=[ ", "var sroles=[ "};
                StringBuffer sb = new StringBuffer();
                for (int j = 0; j < 3; ++j) 
                {
                    int b = adapter.executeQuery(sql[j]);
                    if (b == 0)
                    {
                        sql[j] = sql[j].replaceFirst("language='[^']+", "language='" + Toolbox.langs[Toolbox.langnum]);
                        b = adapter.executeQuery(sql[j]);
                        if (b == 0)
                        {
                            sql[j] = sql[j].replaceFirst("language='[^']+", "language='" + Toolbox.langs[0]);
                            b = adapter.executeQuery(sql[j]);
                        }    
                    }
                    sb.append(vars[j]);
                    int kk=0; 
                    for (int i = 0; i < b; ++i) 
                    {
                        kk++;
                        sb.append("'" + adapter.getValueAt(i, 0) + "','" + adapter.getValueAt(i, 1).replaceAll("'", "\\'") + "'");
                        sb.append(",");
                    }
                    if (kk>0) sb.deleteCharAt(sb.length()-1);
                    sb.append("];");
                    
                }

                Toolbox.writeToFile(sb.toString(), "comentity" + ((k<<16) + (orgnum%65536)) + ".js");

                if (str != null) 
                {
                    str.append(Toolbox.emsgs(orgnum,777) + " comentity" + ((k<<16) + (orgnum%65536)) + ".js, ");
                }
            }
            Toolbox.dbadmin[orgnum%65536].buildSemesterMap(adapter);
            for (int k=0; k < Toolbox.langs.length; k++) 
            {
                String sql = "SELECT domainValue FROM DomainValue WHERE domain='Site Name' AND language='" + Toolbox.langs[k] + "' ORDER BY code";
                if (adapter.executeQuery(sql) > 0)
                {
                    Toolbox.dbadmin[orgnum%65536].unitname[k] = adapter.getValueAt(0,0)+ "/" + adapter.getValueAt(1,0);
                }
                else
                {
                    Toolbox.dbadmin[orgnum%65536].unitname[k] = Toolbox.dbadmin[orgnum%65536].unitname[Toolbox.langnum];
                    if (k>0 && Toolbox.dbadmin[orgnum%65536].unitname[k] == null)
                        Toolbox.dbadmin[orgnum%65536].unitname[k] = Toolbox.dbadmin[orgnum%65536].unitname[0];
                }
            }
            BackRoutine.updateselects(adapter,orgnum);
            
        } else if (rname.equals("fontsize")) {
            int n;
            String sql = "SELECT AppUser.fontsize, DBOwner.timeformat FROM AppUser,DBOwner WHERE AppUser.id=DBOwner.id AND DBOwner.id='" + user.id + "'";
            if ((adapter.executeQuery2(sql,false) && adapter.getValueAt(0, 0)!=null)) {
                user.fontsize = Integer.parseInt(adapter.getValueAt(0, 0));
                user.timeformat = adapter.getValueAt(0, 1);
            }
            if (str != null) {
                str.append(Toolbox.emsgs(orgnum,825) + " fontsize, timeformat");
            }
        } else if (rname.equals("systemparameter")) 
        {
            String oldsemester = admin.currentSemester;
            boolean b = adapter.executeQuery2("select safecolor, cautioncolor, dangercolor, longtimecolor,stmphost,stmpuser,stmppass  from SystemParam",false);
            String safe = "green", caution = "orange", danger="red", longtime="blue";
            if (b && adapter.getValueAt(0, 0)!=null)
            {
               safe = adapter.getValueAt(0,0);
               caution = adapter.getValueAt(0,1); 
               danger  = adapter.getValueAt(0,2); 
               longtime = adapter.getValueAt(0,3);
               Toolbox.dbadmin[orgnum%65536].stmphost = adapter.getValueAt(0,4);
               Toolbox.dbadmin[orgnum%65536].stmpuser = adapter.getValueAt(0,5);
               Toolbox.dbadmin[orgnum%65536].stmppass = adapter.getValueAt(0,6);
            }
            
            if (admin!=null) admin.setSystemParameter(adapter); 
            Toolbox.changecss(safe,caution,danger,longtime,orgnum);
            admin.buildSemesterMap(adapter);
            if (!admin.currentSemester.equals(oldsemester))
            {
                for (String key:admin.cache.keySet())
                {
                    String sem = key.split("\\|")[1];
                    if (!sem.equals(admin.currentSemester))
                       admin.cache.remove(key);
                }
            }
            if (str != null) 
            {
                str.append(Toolbox.emsgs(orgnum,777) + " style.css, styleb" + (orgnum) + ".css, alarm, background.gif." + admin.cache.size() + " cached assignments");
            }
            if (!admin.currentSemester.equals(oldsemester))
            {
                for (String key:admin.cache.keySet())
                {
                    String sem = key.split("\\|")[1];
                    if (!sem.equals(admin.currentSemester))
                       admin.cache.remove(key);
                }
            }
        } 
        else if (rname.equals("changepolicy")) 
        {
            int n;
            if (( adapter.executeQuery2("SELECT userlink,Docslang.docs,language FROM SigninPolicy,Docslang where SigninPolicy.instruction=Docslang.domain and active=1",false))) 
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
             
            if (str != null) 
            {
                str.append(Toolbox.emsgs(orgnum,825) + " sign up policy");
            }
        } else if (rname.equals("updatecommand")) {
            ServerAgent.loaddb(user.orgnum);
            if (str != null) {
                str.append(Toolbox.emsgs(orgnum,825) + " sysmtem service");
            }
            
        } else if (rname != null && rname.equals("convert1")) 
        {
            String subdb = (String)saved.get("subdb");
            String sid = (String)saved.get("SID");
            String course = (String)saved.get("CourseId");
            String assignname = (String)saved.get("Assignment");
            String semester = (String)saved.get("semester");
            String sql = "SELECT content  FROM Submission WHERE sid='" + sid + "' AND course='"
                    + course + "' AND assignname='" + assignname + "' AND semester='" +
                    semester + "'";
            
            int n = adapter.executeQuery(sql);
            int N1 = 0;
            if (n > 0)
            {
                String content = adapter.getValueAt(0,0).trim();
                
                content = content.replaceFirst("[0-9]{5}[0-9]*[\r|\n]+","");
                 
                CSVParse parse = new CSVParse(content,'\'',new String[]{",","\n"});
                String [][] pp = parse.nextMatrix(true);
                boolean good = true;
                N1 = pp.length;
                for(int i=0; i < N1; i++)
                {
                   if (pp[i].length != 6) 
                   {
                       good = false;
                       break;
                   }
                }
                
                if (!good)
                { 
                    content = "\n" + content;
                    Pattern r = Pattern.compile("[\r|\n][0-9]+[\\.| |:|,|\t|\\)]");
                    int k = 0;
                    Matcher m = r.matcher(content);
                    String num = null;
                    HashMap<String,String> ss = new HashMap<>();
                    ArrayList<int []> ns = new ArrayList();
                    int or = 0;
                    ArrayList<Integer> nums = new ArrayList();
                    
                    while (m.find(k)) 
                    {
                        int i = m.start();
                        k = m.end();
                        num = content.substring(i,k).replaceAll("[^0-9]","");
                        int order = Integer.parseInt(num);
                        if (order<1000)
                        {
                            ns.add(new int[]{i,k});
                            nums.add(order);
                        }
                    }
                    N1 = ns.size();
                    num = null; String ans;
                    for(int i=0; i < ns.size(); i++)
                    {
                       int z[] = ns.get(i); 
                       int w[] = null; 
                       if (i<ns.size()-1)w=ns.get(i+1);
                       num = content.substring(z[0],z[1]).replaceAll("[^0-9]","");
                       if (i<ns.size()-1)
                           ans = content.substring(z[1],w[0]).trim();
                       else
                           ans = content.substring(z[1]).trim();
                       ss.put(num.trim(), ans);

                    }
                    nums.sort(new Comparator<Integer>()
                    {
                        public int compare(Integer x, Integer y)
                        { return x.intValue()-y.intValue();}
                    });
                    
                    StringBuffer s = new StringBuffer();
                    for (Integer nu : nums)
                    {
                        if (s.length()>0) s.append("\n");
                        String z = ss.get(""+nu.intValue());
                        z = "'" + z.replace("'","''") + "'";
                        s.append(nu + "," + z+ ",0,5," + nu + ",-1");
                    }
                    N1 = ss.size();
                    content = s.toString();
                    
                } 
                sql = "SELECT answer,assess,options,question,atype FROM Assignment,Registration WHERE Registration.sid='" 
                        + sid + "' AND Assignment.course=Registration.courseid and Registration.semester=Assignment.semester AND Assignment.semester='" 
                        + semester + "' AND Assignment.name='" + assignname + "' AND  courseid='" + course 
                        + "' AND (Assignment.sessionname LIKE CONCAT('%',Registration.sessionname) OR Assignment.sessionname LIKE CONCAT(Registration.sessionname,'%'))";
                int n2 = adapter.executeQuery(sql);
                if (n2==1)
                {
                   AssOption ap = new AssOption(adapter.getValueAt(0,2),orgnum);
                   Assignment assign = new Assignment(assignname, adapter.getValueAt(0,0), adapter.getValueAt(0,1), adapter.getValueAt(0,4),ap.f , N1, "@", adapter.getValueAt(0,3),orgnum);
                   Submission  submission = new Submission("", content, "0", false,adapter.getValueAt(0,4).equals("4"),orgnum); 
                   try
                   {
                       assign.grade(submission); 
                      
                       sql = "UPDATE Submission SET grade=" + submission.curved
                           + ", assess='" + submission.assess.replaceAll("'", "''") 
                           + "', content='" + content.replace("'", "''") 
                           + "' WHERE sid='" + sid 
                           + "' AND course='"  + course 
                           + "' AND assignname='" + assignname 
                           + "' AND semester='"   + semester + "'";
                       n2=  adapter.executeUpdate(sql);
                       long timenow = System.currentTimeMillis()/1000;
                       sql = "INSERT INTO Message(sid, rid,postdate, subject,content,suppress,format,subdb) VALUES('"
                           + user.id + "','"  + sid +"'," + timenow + "," +
                       "'" + assignname + "','" + Toolbox.emsgs(orgnum,1429) + "',0,'0','" +subdb + "')";
                       n2=  adapter.executeUpdate(sql);
                   }catch(Exception e1){  }
                }
            } 
        }
        else if (rname.equals("updatelinks")) {
            try {
                java.util.ArrayList<String> v = new java.util.ArrayList<String>();
                if (Generic.storedProc != null && adapter.executeQuery("SELECT name FROM Task")<10) 
                {
                    java.util.Set<String> e = Generic.storedProc.keySet();
                    for(String nm:e) 
                    {
                        Webform w = (Webform)Generic.storedProc.get(nm);
                        String sql = "INSERT INTO Task (name, title, roles, permits, query, format) VALUES('" + w.name + "','" + w.title + "'," + w.roles + ",'" + w.permits + "',' ',' ')";
                        if (w.name.indexOf("$") < 0  &&  adapter.executeUpdate(sql) == 1)  
                        v.add(w.name);
                    }
                }
                 
                boolean b = adapter.executeQuery2("SELECT Funblock.id, Funblock.icon, Funblock.title, Funblock.ordernum FROM Funblock WHERE id>0 ORDER BY id",false);
                StringBuffer s = new StringBuffer();
                StringBuffer ss = new StringBuffer();
                String path = Toolbox.installpath + File.separator + "funblock" + (adapter.orgnum%65536) + ".js";
                 
                FileWriter awriter =   new FileWriter(path, false);
                if (b && adapter.getValueAt(0, 0)!=null) 
                {
                    s.append("var funblocks = [");
                    String url;
                    for (int i = 0;  (url=adapter.getValueAt(i, 0)) != null && url.equals("")==false; ++i) 
                    {
                        if (i > 0) 
                        {
                            s.append(",\n");
                        }
                        s.append("[" + url+ ",\"" + adapter.getValueAt(i, 1).trim() + "\",");
                        if (adapter.getValueAt(i, 2).indexOf("textmsg[") >= 0) {
                            s.append(adapter.getValueAt(i, 2).trim() + ",");
                        } else {
                            s.append("\"" + adapter.getValueAt(i, 2).trim() + "\",");
                        }
                        s.append(adapter.getValueAt(i, 3).trim() + "]");
                    }
                    s.append("];\n");
                    if (s.length() > 200)
                       awriter.write(s.toString());
                     
                } else   {
                    Toolbox.println(0, adapter.error());
                }
                b = adapter.executeQuery2("SELECT Funlink.url, Funlink.caption, Task.title, Funlink.blockid, Funlink.ordernum,Funlink.roles, Task.roles,Funlink.permits, Task.permits  FROM Funlink LEFT JOIN Task on Funlink.rdapname=Task.name    ORDER BY 4,5 ",false);
               
                if (b && adapter.getValueAt(0, 0)!=null ) 
                {
                    
                    ss.append("var funlinks = [");
                    String url = null;
                    for (int i = 0;  (url=adapter.getValueAt(i, 0)) != null && url.equals("")==false; ++i) {
                        if (i > 0) {
                            ss.append(",\n");
                        }
                         
                        ss.append("[" + adapter.getValueAt(i, 3).trim() + "," + adapter.getValueAt(i, 4).trim() + ",\"" + url.trim().replace("??Language??",Toolbox.langs[orgnum>>16]));
                        if (adapter.getValueAt(i, 1) == null || adapter.getValueAt(i, 1).equals("")) {
                            ss.append("\",\"" + adapter.getValueAt(i, 2).trim() + "\",");
                        } else if (adapter.getValueAt(i, 1).indexOf("textmsg[") == 0) {
                            ss.append("\"," + adapter.getValueAt(i, 1).trim() + ",");
                        } else {
                            ss.append("\",\"" + adapter.getValueAt(i, 1).trim() + "\",");
                        }    
                        if (adapter.getValueAt(i, 6) == null || adapter.getValueAt(i, 6).equals("")) {
                            ss.append(adapter.getValueAt(i, 5) + ",\"");
                        } else {
                            ss.append(adapter.getValueAt(i, 6) + ",\"");
                        }    
                        if (adapter.getValueAt(i, 7) == null || adapter.getValueAt(i, 7).equals("")) {
                            String tt = adapter.getValueAt(i, 8) + ",";
                            tt = tt.replaceAll("2[\\+|-][^,]*,", "").replaceAll("3[\\+|-][^,]*,", "").replaceAll("4[\\+|-][^,]*,", "").replaceAll("1([\\+|-])", "$1");
                            ss.append(tt.replaceFirst(",$", "") + "\"]");
                            continue;
                        }  
                        ss.append(adapter.getValueAt(i, 7) + "\"]");
                    }
                    ss.append("];\n");
                    if (ss.length() > 1200)
                       awriter.write(ss.toString());
                     
                    for (int k = 0; k < v.size(); ++k) {
                        String sql = "DELETE FROM Task WHERE name='" +  v.get(k) + "'";
                        int m = adapter.executeUpdate(sql);
                    }
                }
                
                awriter.close(); 
            }
            catch (Exception e1) {
                
            }
            if (str != null) {
                str.append(Toolbox.emsgs(orgnum,825) + " function links");
            }
        } else if (rname.equals("phase3")) {
            admin.phase = 3;
        }
        return savingname;
    }
    
    public static void updateselects(JDBCAdapter adapter,int orgnum) 
    {
        if (Generic.storedProc == null) 
        {
            return;
        }
        java.util.Set<String> e = Generic.storedProc.keySet();
        for (String nm:e)
        {
            Webform w = (Webform)Generic.storedProc.get(nm);
            if (w.query == null || w.format.equals("Update") || w.format.equals("Web")) continue;
            w.simplify(adapter,orgnum);
        }
        
    }
  
    public static boolean preproc(User user, HashMap saved, Webform w, CachedStyle cachedstyle) 
    {
        String rname = w.preop;
        DBAdmin admin = Toolbox.dbadmin[user.orgnum%65536];
        if (rname != null && rname.equals("messages0")) 
        {
            if (user == null) 
            {
                return false;
            }
            String onbegin = (String)saved.get("onbegin");
            onbegin = onbegin + ";window.open('DataLongForm?rdap=MessageReceived3day&cellonblur=35&subdb=" + user.id + "&onbegin=36',popwin);";
            saved.put("onbegin", onbegin);
            String sql = "AppUser;SELECT DISTINCT AppUser.lastupdate, AppUser.id, AppUser.password, NULL, NULL, roles, firstname, middlename, lastname, title, department, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, photourl,NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0,16,sex,NULL,ustatus,websitename    FROM AppUser, Message where AppUser.id=Message.sid AND rid='" + user.id + "' OR AppUser.id='" + user.id + "';" 
                       + "Message;SELECT * from Message where rid='" + user.id + "';";
            sql = DataMove.importdata(user, sql, "backup", true);
             
            if (sql.equals("") == false && !user.dbinfo.server.equals(admin.systemserver)) 
            {
                JDBCAdapter adapter = Toolbox.getSysAdapter(user.orgnum);
                int numc = adapter.executeUpdate("DELETE FROM Message where rid='" + user.id + "'",false);
                adapter.close();
                
            }
            return true;
        } 
        else if ((rname == null || !rname.equals("mystudent0")) && rname.equals("mycourse")) 
        {
            String sql = "Course;SELECT * FROM Course,  Session  WHERE Course.id=Session.courseid AND Session.semester='" + Toolbox.dbadmin[user.orgnum%65536].currentSemester + "' AND Session.instructor='" + user.id + "';" 
                    + "Session;SELECT * FROM  Session  WHERE   Session.semester='" + Toolbox.dbadmin[user.orgnum%65536].currentSemester + "' AND Session.instructor='" + user.id + "';" 
                    + "AppUser;SELECT  lastupdate, id,  AppUser.password, NULL, NULL,  roles, firstname, middlename, lastname, title, department, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, photourl,NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0,16,NULL,NULL,0,websitename   FROM AppUser WHERE AppUser.id='" + user.id + "';" 
                    + "AppUser;SELECT DISTINCT AppUser.lastupdate, id,  AppUser.password, NULL, NULL,  roles, firstname, middlename, lastname, title, department, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, photourl,NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0,16,NULL,NULL,0,websitename   FROM AppUser, Registration, Session WHERE Registration.sid=AppUser.id AND Session.name=Registration.sessionname AND Registration.courseid=Session.courseid AND Registration.semester=Session.semester AND Session.semester='" + Toolbox.dbadmin[user.orgnum%65536].currentSemester + "' AND Session.instructor='" + user.id + "';" 
                    + "AppUser;SELECT DISTINCT AppUser.lastupdate, id,  AppUser.password, NULL, NULL,  roles, firstname, middlename, lastname, title, department, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, photourl,NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0,16,NULL,NULL,0,websitename   FROM AppUser, Session WHERE Session.ta LIKE CONCAT('%',AppUser.id,'%') AND  Session.semester='" + Toolbox.dbadmin[user.orgnum%65536].currentSemester + "' AND Session.instructor='" + user.id + "';" 
                    + "Registration;SELECT Registration.lastupdate,sid,courseid,sessionname,Registration.semester,evaltime,Registration.status,grade,evaluation,attendance,target,decision,rstatus,whosehand FROM Registration, Session WHERE Registration.semester=Session.semester And Registration.courseid=Session.courseid And Registration.sessionname=Session.name AND Session.semester='" + Toolbox.dbadmin[user.orgnum%65536].currentSemester  + "' AND Session.instructor = '" + user.id + "';" 
                    + "AppUser;SELECT DISTINCT AppUser.lastupdate, Student.id,  AppUser.password, NULL, NULL, roles, firstname, middlename, lastname, title, department, NULL, NULL, NULL, NULL, NULL, phone, email, website, photourl, NULL, NULL, NULL, NULL, NULL, NULL, NULL,  mobilephone, NULL, 0,16,NULL,NULL,0,websitename   FROM AppUser,Student WHERE AppUser.id=Student.id AND Student.advisor='" + user.id + "';" 
                    + "DomainValue;SELECT * FROM DomainValue;" 
                    + "Faculty;SELECT * FROM Faculty WHERE  id='" + user.id + "';" 
                    + "OperationCourse;SELECT * FROM OperationCourse;" 
                    + "TimeSlot;SELECT * FROM TimeSlot;" 
                    + "Student;SELECT * FROM Student WHERE advisor='" + user.id + "'";
            sql = DataMove.importdata(user, sql, "backup", true);
        }
        return true;
    }
   
}
