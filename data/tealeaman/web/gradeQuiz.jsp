
<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.math.*,java.util.regex.*,java.io.*"%>
<%!
void removeDistinctCode(ServletContext app,String key, User user)
{
   synchronized(this)
   {
       HashMap<String,String> asids = (HashMap)app.getAttribute(key); 
       if (asids == null) return;
       if (asids.size() == 0) {app.removeAttribute(key); return;}
       for (String  code : asids.keySet()) 
       {
           String vl = asids.get(code);
           if (vl.equals("1")) { asids.clear();app.removeAttribute(key); return; }
           if (asids.get(code).equals(user.id))
           {
               app.removeAttribute(code);
               return;
           }
        }
    }
}
int levenshteinDist(char [] word1, char [] word2) {
    int size1 = word1.length;
    int size2 = word2.length;
    int verif[][] = new int[size1 + 1][size2 + 1]; // Verification matrix i.e. 2D array which will store the calculated distance.
    // If one of the words has zero length, the distance is equal to the size of the other word.
    if (size1 == 0)
        return size2;
    if (size2 == 0)
        return size1;

    // Sets the first row and the first column of the verification matrix with the numerical order from 0 to the length of each word.
    for (int i = 0; i <= size1; i++)
        verif[i][0] = i;
    for (int j = 0; j <= size2; j++)
        verif[0][j] = j;

    // Verification step / matrix filling.
    for (int i = 1; i <= size1; i++) {
        for (int j = 1; j <= size2; j++) {
            // Sets the modification cost.
            // 0 means no modification (i.e. equal letters) and 1 means that a modification is needed (i.e. unequal letters).
            int cost = (word2[j - 1] == word1[i - 1]) ? 0 : 1;

            // Sets the current position of the matrix as the minimum value between a (deletion), b (insertion) and c (substitution).
            // a = the upper adjacent value plus 1: verif[i - 1][j] + 1
            // b = the left adjacent value plus 1: verif[i][j - 1] + 1
            // c = the upper left adjacent value plus the modification cost: verif[i - 1][j - 1] + cost
            int q = (verif[i - 1][j]< verif[i][j - 1]? verif[i - 1][j]:verif[i][j - 1]) + 1;
            int p = verif[i - 1][j - 1] + cost;
            verif[i][j] = q < p? q: p;
            
        }
    }

    // The last position of the matrix will contain the Levenshtein distance.
    return verif[size1][size2];
}
public String removewhy(String ans, int orgnum)
{
  
    String sep = Assignment.separator(orgnum);
   
    String [] x = ans.split("((?=" + sep + "))");
    StringBuffer sb = new StringBuffer();
    for (int i=0; i < x.length; i++)
    {
        sb.append(x[i].replaceFirst("[\\s|\r|\n]+why:.*$", ""));
    }
    
    return sb.toString();
}
public static void submitReceipt(StringBuffer q, User user , char operation, String semester, String courseid, String assignname, long timesec, String content, String attach, String x, int orgnum,CachedStyle cachedstyle) {
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
%>
<% 
     
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum == -1) return;
        CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
        // five usages: testing, submission, grading, gradeall, regrade
        String way = "submission";
        String ans = Toolbox.defaultParam(orgnum,request, "testing", null, null, 10);
        if (ans != null && ans.equals("1")) way = "testing";
        String regradenum = Toolbox.defaultParam(orgnum,request, "regradenum", null, "@", 300);
        
        if (regradenum!=null && regradenum.equals("u"))   way = "ungrade";
        else if (regradenum!=null && !regradenum.equals(""))   way = "regrade";
         
        User user = null;
        if (!way.equals("testing")) 
        {
            if (!Toolbox.verifytoken(request) || (user = User.authorize(orgnum, Systemroles.TOTAL, application, session, request, response, "gradeQuiz.jsp", true)) == null) 
            {
                return;
            }
            orgnum = user.orgnum; 
        } 
        else 
        {
            if (!Toolbox.verifytoken(request) || (user = User.authorize(orgnum, Systemroles.INSTRUCTOR, application, session, request, response, "gradeQuiz.jsp", true)) == null) 
            {
                return;
            }
            orgnum = user.orgnum; 
        }
        long l = System.currentTimeMillis() / 1000;
        String msg = "";
        String sid = Toolbox.defaultParam(orgnum,request,"sid", null, null, 20);
        String gradeallstr = Toolbox.defaultParam(orgnum,request, ("gradeall"), null);
        if (sid!=null && Toolbox.defaultParam(orgnum,request, ("Student"), null)!=null && Toolbox.defaultParam(orgnum,request, ("SubmitAt"), null)!=null) 
            way = "grading"; 
        if (!way.equals("regrade") && gradeallstr!=null && gradeallstr.equals("1")) 
            way = "gradeall";
         
        String sentsolution = Toolbox.defaultParam(orgnum,request, "Content", "");
        if (sentsolution.equals(""))
            sentsolution = Toolbox.defaultParam(orgnum,request, "content", "");
         
        String leas = Toolbox.defaultParam(orgnum,request, "leas", "", null, 4);
        String course = Toolbox.defaultParam(orgnum,request, "course", "",  "-_.", 30);
        String assignname = Toolbox.defaultParam(orgnum,request, "assignname", "", ",-_.'", 50);
        String activities = Toolbox.defaultParam(orgnum,request, "activities", "", ",", 3000).trim();
        if (assignname.equals(""))  
            assignname = Toolbox.defaultParam(orgnum,request, "Assigntest", "", ",-_.'", 50);
        
        if ( assignname.equals("")) assignname = Toolbox.defaultParam(orgnum,request, "Name", "", null, 60);
        String sessionname = Toolbox.defaultParam(orgnum,request, "sessionname", "", ",-.", 80);
        if (sessionname.equals("")) sessionname = Toolbox.defaultParam(orgnum,request, "Sessions", "", ",-.", 60);
       
        String formula = Toolbox.defaultParam(orgnum,request, "formula", "0|S", "*()+/^-|", 30) ;
        String semester = Toolbox.defaultParam(orgnum,request, "semester", Toolbox.dbadmin[orgnum%65536].currentSemester, null, 30);
      
        String subdb = Toolbox.defaultParam(orgnum,request, "subdb", user.id, null, 30);
        user.changedb(subdb);
        String showimm = Toolbox.defaultParam(orgnum,request, "showimm", "true", null, 5);
        String attachments = Toolbox.defaultParam(orgnum,request, "attach", "");
        java.util.Date d = new java.util.Date();
        if (way.equals("regrade")) 
        {
            sentsolution = "";
        } 
        String subassess = Toolbox.defaultParam(orgnum,request, "assess", null);
        boolean hasresult = (subassess != null); 
        FileWriter aWriter = null;
        JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
        if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
        double ascale = 100;
        Vector<String[]> coursesessions = new Vector(4);
        String sql0 = "";
        if (way.equals("gradeall") || way.equals("regrade") || way.equals("ungrade"))
        {
            if (sessionname.equals("")) 
            {
                sql0 = "SELECT DISTINCT courseid, name FROM Session Where (instructor='" + user.id.replaceAll("'", "''") +"' or ta='" + user.id.replaceAll("'", "''") +"') AND semester='" + semester.replaceAll("'", "''") +"'";
                if (course.equals("") == false)
                    sql0 += " AND courseid='" + course.replaceAll("'", "''") + "'";
                int n0 = adapter.executeQuery(sql0);
                for (int i=0; i < n0; i++)
                {
                    coursesessions.addElement(new String[]{adapter.getValueAt(i,0),adapter.getValueAt(i,1)});
                }
            }
            else 
            {
                String xx[] = sessionname.split(",");
                for (int i = 0; i < xx.length; i++)
                {
                    coursesessions.addElement(new String[]{course,xx[i]});
                }
            }
        }
     
        String sql = "";
        boolean bb = true;
       // int n = 0;
        String atypestr = "1";
        String optionstr = "";
        String assessstr = "";
        String formatstr = "", sformat =Toolbox.defaultParam(orgnum,request, "format", "", null, 5);
        boolean submissionhasanswer = false;
        String questionstr = "";
        StringBuffer ssql = new StringBuffer(); 
        //int numanswered[] = null;
        //int numright[] = null;
        if (way.equals("testing")) 
        {
            ans = Toolbox.defaultParam(orgnum,request, "Answer", "");
            optionstr = Toolbox.defaultParam(orgnum,request, "Options", "");
            optionstr = Toolbox.removescript(optionstr);
            assessstr = Toolbox.defaultParam(orgnum,request, "Assess", "", ",|;", 1000);
            formatstr = Toolbox.defaultParam(orgnum,request, "Format", "", null, 20);
            questionstr = Toolbox.defaultParam(orgnum,request, "Question", "");
            if (questionstr.equals("")) 
            {
                out.print("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body>");
                out.print(Toolbox.emsgs(orgnum,471));
                adapter.close();
                return;
            }
        } 
        else   if (way.equals("ungrade") )
        {
              String xx = "";
              for (int i = 0; i < coursesessions.size(); i++)
              {
                    xx += " Registration.sessionname='" + coursesessions.elementAt(i)[1] + "' OR"; 
              }
              
                sql  = "UPDATE  Submission SET grade=-1, assess='' "
                + " WHERE assignname='" + assignname + "' AND Submission.course ='" + course +"' AND Submission.semester='" + semester.replaceAll("'", "''") + "' AND Submission.sid IN (SELECT sid FROM Registration WHERE Registration.courseid='" 
                      + course +"'  AND Registration.semester='"+ semester.replaceAll("'", "''") + "' AND (" 
                      + xx.replaceFirst(" OR$", "") + "))";
                 
                int nn = adapter.executeUpdate(sql);
                 
                out.print("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body>");
                out.print("<script>parent.myprompt('" + nn + " " +  Toolbox.emsgs(orgnum,676) + adapter.error() + "');</script>");
                adapter.close();
                return;
        }
        else   if (way.equals("regrade") )
        {
              String xx = "(";
              for (int i = 0; i < coursesessions.size(); i++)
              {
                    xx += " Registration.sessionname='" + coursesessions.elementAt(i)[1] + "' OR"; 
              }
              xx = xx.replaceFirst("OR$",") AND ");
              sql = "SELECT Assignment.answer, Assignment.options, Assignment.assess, Assignment.question, Assignment.format, Submission.content, Submission.sid, Submission.course, Submission.assignname, Assignment.sessionname, Assignment.atype, Submission.assess,Submission.comment,Assignment.scale  FROM Assignment, Submission, Registration "
                + " WHERE " + xx + " Registration.sid = Submission.sid AND  Registration.courseid=Assignment.course AND Assignment.course=Submission.course  and Submission.course ='" + course +"'"
                + " AND Registration.semester=Assignment.semester  and Submission.semester=Assignment.semester  AND Assignment.semester='" + semester.replaceAll("'", "''") + "'"
                + " AND (Assignment.sessionname = '" + sessionname +"' OR Assignment.sessionname LIKE '" + sessionname +",%' OR Assignment.sessionname LIKE '%," + sessionname +",%' OR Assignment.sessionname LIKE '%," + sessionname +"')"
                    + " AND Assignment.name=Submission.assignname  AND Assignment.name='" + assignname + "' ";  //
             sql += "UNION SELECT Assignment.answer, Assignment.options, Assignment.assess, Assignment.question, Assignment.format, Submission.content, Submission.sid, Submission.course, Submission.assignname, Assignment.sessionname, Assignment.atype, Submission.assess,Submission.comment,Assignment.scale  FROM Assignment, Submission "
                + " WHERE Submission.sid='" + user.id +"' AND Assignment.course=Submission.course  and Submission.course ='" + course +"'"
                + " AND  Submission.semester=Assignment.semester  AND Assignment.semester='" + semester.replaceAll("'", "''") + "'"
                + " AND (Assignment.sessionname = '" + sessionname +"' OR Assignment.sessionname LIKE '" + sessionname +",%' OR Assignment.sessionname LIKE '%," + sessionname +",%' OR Assignment.sessionname LIKE '%," + sessionname +"')"
                + " AND Assignment.name=Submission.assignname  AND Assignment.name='" + assignname + "'  order by  8, 10, 9, 6";  //  AND submission.sid='D10662509'   
          
        }
        else if (way.equals("gradeall")) 
        {
            sql =  "SELECT Assignment.answer, Assignment.options, Assignment.assess, Assignment.question, Assignment.format, Submission.content, Submission.sid, Submission.course, Submission.assignname, Assignment.sessionname, Assignment.atype, Submission.assess,Submission.comment,Assignment.scale  FROM Assignment, Submission  "
                + " WHERE  Assignment.course=Submission.course  "
                + " AND  Submission.semester=Assignment.semester  AND Assignment.semester='" + semester.replaceAll("'", "''") + "'"
                + " AND Assignment.name=Submission.assignname  AND Submission.sid='" + user.id.replaceAll("'", "''") +"' "  
                + " AND (Assignment.atype=1 OR Assignment.atype=3 OR Assignment.atype=4)  "
                + " AND (Assignment.status=0  or Assignment.status>=2 AND Assignment.due <= " + (l+2000) + ") "; 
             
            for (int i=coursesessions.size()-1; i>=0; i--)
            {
             if (sql.equals("") == false)
                sql += "\nUNION ";
             sessionname = coursesessions.elementAt(i)[1];
             course = coursesessions.elementAt(i)[0];

             sql += "SELECT Assignment.answer, Assignment.options, Assignment.assess, Assignment.question, Assignment.format, Submission.content, Submission.sid, Submission.course, Submission.assignname, Assignment.sessionname, Assignment.atype, Submission.assess,Submission.comment,Assignment.scale  FROM Assignment, Submission, Registration "
                + " WHERE Registration.sid = Submission.sid AND  Registration.courseid=Assignment.course AND Assignment.course=Submission.course  and Submission.course ='" + course +"'"
                + " AND Registration.semester=Assignment.semester  and Submission.semester=Assignment.semester  AND Assignment.semester='" + semester.replaceAll("'", "''") + "'"
                + " AND (Assignment.sessionname = '" + sessionname +"' OR Assignment.sessionname LIKE '" + sessionname +",%' OR Assignment.sessionname LIKE '%," + sessionname +",%' OR Assignment.sessionname LIKE '%," + sessionname +"')"
                + " AND Assignment.name=Submission.assignname  " 
                + " AND (Assignment.atype=1 OR Assignment.atype=3 OR Assignment.atype=4)  "
                + " AND (Assignment.status=0    or Assignment.status >=2 AND due <= " + (l+2000) + ")  "
                + " AND Submission.grade <= 0 ";
                if (assignname!=null) sql += " AND Submission.assignname='" + assignname.replaceAll("',","''") + "'";
            }
            sql += "order by  8, 10, 9, 6";
            
            
        } 
        else if (way.equals("grading") || way.equals("submission"))
        {
            boolean hassession = (sessionname!=null && !sessionname.trim().equals("") && sessionname.indexOf(",")==-1);
            if (!hassession)
            {
                String sql1 = "SELECT sessionname FROM Registration where sid='" + sid + "' and semester='" + semester + "' and  courseid='" + course + "';"; 
                int nn = adapter.executeQuery(sql1);
                if (nn == 1)
                {
                   sessionname = adapter.getValueAt(0,0);
                   hassession = true;
                }
            }
            
            if (hassession)
            {
               sessionname = sessionname.trim();
               sql = "SELECT answer,options,assess,question,format,'','" + sid + "','" + course.replaceAll("'", "''") + "','" + assignname + "','"
                        + sessionname + "',atype, assess,due,scale,sessionname  FROM Assignment WHERE course='" + course.replaceAll("'", "''") + "' AND name='"
                        + assignname.replaceAll("'", "''") + "' AND semester='" + semester.replaceAll("'", "''")
                        + "' AND (sessionname LIKE '" + sessionname + ",%' OR sessionname LIKE '%," + sessionname + ",%' OR sessionname LIKE '%," + sessionname + "' OR sessionname ='" + sessionname + "')";
               if (way.equals("submission"))
                   sql += " AND ( status=1 or  status >=2 AND start <= " + l +  " AND (due >= " + (l-20) +  "  OR Assignment.latepermit like '%" + sid +"%'))"; 
            }
            else    
            {
                sql = "SELECT answer,options,assess,question,format,'','" + sid + "','" + course.replaceAll("'", "''") + "','" + assignname + "',sessionname,atype, assess,due,scale,sessionname  FROM Assignment WHERE course='" + course.replaceAll("'", "''") + "' AND name='"
                        + assignname.replaceAll("'", "''") + "' AND semester='" + semester.replaceAll("'", "''")
                        + "' AND (grader LIKE '" + user.id + ",%' OR grader LIKE '%," + user.id + ",%' OR grader LIKE '%," + user.id + "' OR grader ='" + user.id + "')";
                
            } 
            /*else  
            {
                out.print("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body>");
                out.print("Submission rejected");
                adapter.close();
                return;
               
            }*/
        }
        else  
        {
            out.print("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body>");
                out.print("Invalid way");
                adapter.close();
                return;
            
        }
 
 
        bb = adapter.executeQuery2(sql,false); 
   
        if (bb == false)
        {
            String yy = Toolbox.dbadmin[orgnum%65536].webFileFolder +  File.separator + subdb +  File.separator + "dbroutine";
            if ( (new java.io.File(yy)).exists() == false ) 
            {
                (new File(yy)).mkdir();
            } 
            String xx = "";
            for (java.util.Enumeration e=request.getParameterNames(); e.hasMoreElements();    )
            {
               Object x = e.nextElement();
               String pname = (String)x;
               xx += pname + "=" + Toolbox.defaultParam(orgnum,request, (pname), null) +"\n";
            } 
        
            aWriter = new FileWriter(yy + File.separator + "debug" + d.getMonth() + d.getDate() + ".sql", false);
            aWriter.write(sql + "\n" + xx);
            aWriter.write(adapter.error());
            aWriter.close(); 
        }
        String v00 = adapter.getValueAt(0,0);
        if (way.equals("submission") && v00 != null && sentsolution.equals("?"))
        {
            long duet = Long.parseLong(adapter.getValueAt(0,12));
            String keystr = (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + adapter.getValueAt(0,14); 
            removeDistinctCode(application,keystr,user);
            adapter.close();
            msg = "<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body>";
            out.println(msg);
            if ( Math.abs(duet - l) > 59)
            {
                out.println("<script>parent.extenddue(" + duet + "," + l + ");</script>");  
            }
            out.println("</body></html>"); 
            return; 
        }
        if (way.equals("submission") && v00 == null && adapter.cursor < -1 ) 
        {
            String keystr = (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + adapter.getValueAt(0,14); 
            removeDistinctCode(application, keystr, user);
            adapter.close();
            msg = "<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body>" + Toolbox.emsgs(orgnum,469) + " " + course + " " + assignname + " " + Toolbox.emsgs(orgnum,470) + ".<br>" + adapter.error() + "<br>"  ;
            out.println(msg + "<br><br><textarea rows=20 cols=70>" + sentsolution.replaceAll("(?i)</textarea>","< textarea>") + "</textarea></body></html>");
            return;
        } 
        else if (way.equals("gradeall") && v00 == null && adapter.cursor < -1) 
        {
            adapter.close();       
            out.println("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body><script>parent.myprompt(parent.textmsg[913]);</script>no submission to grade all</body></html>");
            return;
        }
        if (way.equals("gradeall") || way.equals("regrade")   || way.equals("grading"))
        {
            out.println("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body><script type=\"text/javascript\" >var err=[];\n");
        }
        StringBuffer notsaved = new StringBuffer(); 
        StringBuffer sans = new StringBuffer(400);
        Vector<String> doallsql  = new Vector();
        //Vector<String> sqlq  = new Vector();
        boolean embedquiz = false;
        boolean startanew = true;
        Vector<QuestAnswer> ht = null;
        String noanswer = "";
        StringBuffer errmsg = new StringBuffer(); 
        String olderr = ""; 
        int maxn = 0;
        int Q = 0;
        int EN = 0;
        float S = 0;
        float M = 0;
        int C = 0;
        int fmt = 0;
        boolean doallmul = true;
        int nzn = 1;
        int epts = 0;
        int numstudents = 0; 
        float averagepoint = 0;
        String quitassign = "";
        String sep[] = {",", "\r\n"};
        Assignment assign = null;
 
        String oldsessionname = "";
        String oldassignname = "";
        String oldcourse = "";
        boolean oldembedquiz = false; 
        StringBuffer coursesa = new StringBuffer();
        String fullgrade =null;
        boolean distinct = false;
       
        for (int u = 0; way.equals("gradeall") || way.equals("regrade") || u < 1; u++) //main loop 
        {
            boolean valid = true;
            String content = "";
            String rankstr = "";
            String oldcomment = "";    
            if (way.equals("testing") == false) 
            {
                ans = adapter.getValueAt(u, 0);
                String ans1 = "";
                optionstr = adapter.getValueAt(u, 1);
                formatstr = adapter.getValueAt(u, 4);
                sid = adapter.getValueAt(u, 6);
              
                course = adapter.getValueAt(u, 7);
                assignname = adapter.getValueAt(u, 8);
                sessionname = adapter.getValueAt(u, 9);
                atypestr = adapter.getValueAt(u, 10);
                if (atypestr!=null ) 
                {
                    embedquiz = atypestr.equals("4");
                }
                if (!way.equals("submission") || subassess == null)
                {
                   subassess =  adapter.getValueAt(u, 11);
                   int ll = subassess.length(); 
                   if (ll>15)
                   {
                      String xx = subassess.substring(ll-15);  
                      hasresult = xx.contains("test results");
                   }
                }
                oldcomment = adapter.getValueAt(u, 12);
            }
            else 
            {
                sid = "";
                if (way.equals("submission") || way.equals("grading"))
                {
                     ans = adapter.getValueAt(u, 0);
                     submissionhasanswer = ans!=null && ans.length()>2;
                     distinct = adapter.getValueAt(u, 1).contains(";cd:distinct");
                 }
            } 
            
            if (way.equals("testing") == true || way.equals("submission") || way.equals("grading")) 
            {
                content = sentsolution;
              
                if (content.equals("")) 
                {
                    msg =  Toolbox.emsgs(orgnum,51) + Toolbox.emsgs(orgnum,1531);
                    valid = false;
                }
            } 
            else 
            {
                content = adapter.getValueAt(u, 5);
            }
            startanew = (adapter.cursor< 0 || u == 0  || 
                    (sessionname==null || assignname==null || course ==null) ||   /* on the end*/
                    !(course.equals(oldcourse) && sessionname.equals(oldsessionname)  && assignname.equals(oldassignname)));
System.out.println(startanew + " "+ (adapter.cursor) );                     
            AssOption assopt = null;
            if (optionstr != null)
            {
                assopt = new AssOption(optionstr,orgnum);
                formula = (assopt).f;
            }
            
            if (startanew) 
            {
                if (u>0)
                    coursesa.append("<tr><td bgcolor=white><nobr>" + oldcourse + "</nobr></td><td bgcolor=white><nobr>" + oldsessionname + "</nobr></td><td bgcolor=white><nobr>" + oldassignname + "</nobr></td><td width=200 align=right bgcolor=white>" + numstudents  + "</td><td   align=right bgcolor=white style=color:red >" + Assignment.n2s(averagepoint/numstudents) + "</td><td  align=right bgcolor=white style=color:black >" + fullgrade + "</td></tr>");
                if (way.equals("gradeall") && (regradenum == null || !regradenum.endsWith("@z")) && oldembedquiz && u > 0) 
                {  
                    String assessstr1 = "#,pts,obj,numa,numr," + numstudents + ";" + assign.makeaccess();
                    String temp = "UPDATE Assignment SET assess='" + assessstr1 
                            + "' WHERE semester='" + semester.replaceAll("'", "''") + "' AND course='" + oldcourse.replaceAll("'", "''") + "' AND name='" + oldassignname.replaceAll("'", "''") + "' AND sessionname='"
                            + oldsessionname.replaceAll("'", "''") + "'";
                    doallsql.addElement(temp);
                     
                }
                
                if (adapter.cursor< 0 || sessionname==null || assignname==null || course ==null)
                {
                    break;
                }
                if (way.equals("testing")) 
                {
                    questionstr = ("\n" + questionstr);//.replaceAll("\n[\r]?[ ]*[\r]?\n", "\n\n").replaceAll("\n[ ]+\n", "\n\n").replaceFirst("^[ |\n]+", "");
                } 
                else 
                {
                    questionstr = ("\n" + adapter.getValueAt(u, 3));
                }
             
                if (way.equals("testing") == false) 
                {
                    assessstr = adapter.getValueAt(u, 2);
                }
                if (assessstr == null) 
                {
                    assessstr = "";
                }
               
                int N1 = 0;
                Pattern pa = Pattern.compile(Assignment.separator(orgnum));
                /*  if ( pa.matcher(questionstr).find(0) == false)
                {
                    CSVParse p = new CSVParse(content,'\'', new String[]{",", "\r\n"});
                    String [][] Mr = p.nextMatrix(true); 
                    int N = Mr.length;
                    N1 = N+1;
                }*/
                fullgrade = adapter.getValueAt(u,13); 
                assign = new Assignment(assignname,  removewhy(ans,orgnum), assessstr, atypestr,formula, N1, regradenum,questionstr,orgnum);
                if (embedquiz && (way.equals("gradeall") || way.equals("regrade")) )
                {
                    assign.resetcount();
                    numstudents = 0;
                    averagepoint = 0;
                }
            }
            if (ans == null || ans.equals("null")) 
            {
                    msg = course + " " + assignname + " " + Toolbox.emsgs(orgnum,472);
                    ans = "";
                    valid = false;
            }
            
          
            
            if (sformat.equals("6"))
                fmt = 6;
            else  try 
            {
                fmt = Integer.parseInt(formatstr);
            } catch (Exception e) 
            {
                fmt = 0;
            }

            String formula1 = formula;
            if (content == null) content ="";
           
            content = content.trim().replaceFirst("^[0-9][0-9][0-9][0-9]*\n","");
 
            Submission  submission = new Submission(subassess, content, leas, way.equals("testing"), embedquiz,orgnum); 
           
            String sql2 = "";
            if (way.equals("submission"))
            {

                 try{ ascale = Double.parseDouble(adapter.getValueAt(0,13));}catch(Exception e){} 
                              
                if (!activities.equals(""))
                {
                    long timespan = 0; try{Long.parseLong(activities.replaceFirst(" .*$",""));
                    timespan = Long.parseLong(activities.replaceFirst(".*,([0-9]+) [a-z|0-9]+,$","$1"))-timespan;
                    }catch(Exception e){  }
                    String sql3 = "INSERT INTO Subactivity(lastupdate,sid,semester,course,assignname,activities,timespan) VALUES (" + l + ",'"
                    + user.id + "','" + semester + "','" + course.replaceAll("'", "''") + "','" + assignname.replaceAll("'", "''")
                        + "','" + activities.replaceAll("'", "''")
                        + "'," + timespan + ")";
                    int n1 = adapter.executeUpdate(sql3);
                    if (n1 == -1)
                    {
                        sql3 = "UPDATE Subactivity SET lastupdate=" + l + ",activities=CONCAT(activities,'" + activities.replaceAll("'","") + "'), timespan=" + timespan + " WHERE sid='" + user.id + "' AND semester='"
                                + semester.replaceAll("'","") + "' AND course='" + course.replaceAll("'", "''")  + "' AND  assignname='"
                                + assignname.replaceAll("'", "''") + "'";
                        n1 = adapter.executeUpdate(sql3);
                    }
                }
                String MM = "-1";
                if (hasresult)
                { 
                     StringBuffer sb = new StringBuffer();
                     String ans1 = removewhy(ans,orgnum); 
                     String [][] p = (new CSVParse(subassess.trim(),'|', new String[]{",","\n"})).nextMatrix();
                     String xx[] = ("\n" + ans1).split("(?=\n[0-9]+[ |\\.|:|_|\\-|`|,])");
                     String yy[] = new String[p.length+1];
                     for (int i=1; i < xx.length; i++)
                     {
                         String nstr = xx[i].substring(1).replaceFirst("[ |\\.|:|_|\\-|`|,].*$",""); 
                         int n = -1; try{ n = Integer.parseInt(nstr);}catch(Exception e){} 
                         int n3 = 2 + nstr.length();
                         if(n>0 && n < yy.length ){ 
                            if (n3 < xx[i].length()) 
                               yy[n] =   xx[i].substring(n3).trim();
                            else
                               yy[n] = ""; 
                         } 
                     }
                     double [] scores = new double[p.length];
                     double score = 0;
                     boolean numbered = (p.length>1 && Character.isDigit(p[0][0].charAt(0))  && Character.isDigit(p[1][0].charAt(0)) );
                     if (!numbered)
                     {
                         score = levenshteinDist(ans1.toCharArray(),subassess.toCharArray());
                         int ll = ans1.length();
                         M = (float)(ascale * (ll - score)/ll);
                         MM =  String.format("%4.1f",score);
                     }
                     else 
                     { 
                        String [] tt = null;
                        if (p[0].length !=4 || p[1].length!=4)
                        {
                            tt =  (new CSVParse(subassess.trim(),'|', new String[]{"\n"})).nextRow();
                        }
                     for (int i = 0; i < p.length;i++)
                     {
                      
                         if (tt!=null)
                         {
                            String a = tt[i].trim().replaceFirst("[^0-9].*$","");
                            String b = tt[i].trim().replaceFirst("^[0-9]+[,| |\\.|:|\\)]+","");
                             
                            p[i] = new String[]{a,String.format("%4.1f",ascale/p.length), "-1", b};
                          
                         }
                         try
                         {    int n = Integer.parseInt(p[i][0]);
                              double scale = Double.parseDouble(p[i][1]);
                              scores[i] = scale;
                              if (yy[n] != null && yy[n].length() > 0) 
                              {
                                  int  score0 = levenshteinDist(yy[n].toCharArray(),p[i][3].toCharArray());
                                  scores[i] = (yy[n].length() -  score0 )*scale/yy[n].length(); 
                                  p[i][2] = String.format("%5.1f",scores[i]);
                              }
                              else p[i][2] = p[i][1];
                         }catch(Exception e){  p[i][2] = p[i][1]; }
                         if (i > 0) sb.append("\n");
                           
                         sb.append(p[i][0] + "," + p[i][1] + "," + p[i][2] + ",|" + p[i][3].replaceAll("\\|","||") +"|");
                     }
                     if (!formula.contains("|")) formula = "0|" + formula;
                     String [] parts = formula.split("\\|");
                     int N = 0;try{N = Integer.parseInt(parts[0]);}catch(Exception e){};
                     Arrays.sort(scores);
                
                     int dropn = N;
                     for(; N < p.length; N++)
                        score += scores[N];
                       
                     String expression = parts[1].replaceAll("T", "" + leas).replaceAll("S", "" + score).replaceAll("Q", "" + p.length);
 
                    try 
                    {
                        M = (float) ( Evaluate.arithematic(expression));
                        MM =  String.format("%4.1f",M);
   
                        String tail = p.length + "," + dropn + "," + String.format("%3.0f",score) + "," + parts[1] + "," + (leas) + ","   + MM  + ",|test results|";
                        subassess = sb.toString() + "\n" + tail;  
                    } catch(Exception e){}      
                  }
                    
                }
                
                String cmm = "'raw'"; if (subassess!=null) cmm = "'exec result'";
                sql2 = "INSERT INTO Submission(lastupdate,sid,course,assignname,content,comment,grade,submtime,format,semester,attach,assess) values("
                        + l + ",'"
                        + user.id
                        + "','" + course.replaceAll("'", "''")
                        + "','" + assignname.replaceAll("'", "''")
                        + "','" + content.replaceAll("'", "''")
                        + "',"  + cmm 
                        + "," + MM + "," + l + ",'" + fmt + "','"
                        + semester + "','"
                        + attachments + "','" + (subassess==null?"":subassess.replaceAll("'","''")) + "')"; 
                 String key = (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + sessionname;
                 String sek = ""+SessionCount.enq(session.getId()); 
                 Msgboxrun mbox = Msgboxrun.mbox.get(key);
                 if (mbox!=null)
                 {
                     mbox.leave(sek,sid);
                 }
                 
            } 
            boolean ismult = false;
            boolean contentchanged = false;
            if (!hasresult)
            {
                try{assign.grade(submission); }catch(Exception e1){submission.error = e1.toString(); }
  
                if (submission.error.indexOf("#")==0 )
                {
                    contentchanged = true; 
                    submission.error = submission.error.substring(1);
                }

                if (!submission.error.equals(""))
                {
                    errmsg.append("<tr><td  bgcolor=white><nobr>" + course 
                            +"</nobr></td><td bgcolor=white>" + sid 
                            +"</td><td bgcolor=white><nobr>" + assignname 
                            + "</nobr></td><td style=\"background-color:white;color:blue\" onclick=window.frames[0].showerrdetail(" + u + ") >" + submission.error 
                            +"</td><td  bgcolor=white align=right>" + Assignment.n2s(submission.curved)  + "</td><td  bgcolor=white align=right>" +  (fullgrade)  + "</td></tr>");
                    if (way.equals("gradeall") || way.equals("regrade") )out.println("err[" + u + "]=[\"" + Generic.handle(submission.sol) + "\",\"" + Generic.handle(ans) + "\"];");
                }
                numstudents++;
                M = submission.curved;
                S = submission.score; 
                averagepoint += M;
            }
            if (way.equals("submission") || way.equals("grading")) 
            {
                int nn;
                String comment = "";
                if (hasresult)
                {
                    submission.assess = subassess;
                }
                else
                {
                    if (!submissionhasanswer || submission.error!=null && submission.error.equals("") == false) 
                    {
                        M = -1;
                    }
                    
                    if (submission.error == null ) 
                    {
                        comment = Toolbox.emsgs(orgnum,393)  ;
                    } 
                    else 
                    {
                        comment =    request.getRemoteHost();
                    }
                    if (way.equals("grading") && submission.assess.indexOf(" " + Toolbox.emsgs(orgnum,1452) + "|")<10)
                        submission.assess = submission.assess.replaceFirst(".$", " " + Toolbox.emsgs(orgnum,1452) + "|");
                 }
                StringBuffer temp = new StringBuffer(200);
                temp.append("UPDATE Submission SET ");
                if (contentchanged)
                   temp.append("content='" + submission.content.replaceAll("'","''") + "',");
                temp.append("comment='" + comment.replaceAll("'", "''"));
                temp.append("',content='" + content.replaceAll("'", "''"));
                temp.append("',grade=" + M);
                temp.append(", assess='" + submission.assess.replaceAll("'", "''"));
                temp.append("', format='" + fmt + "', submtime=");
                temp.append( l + ",attach='");
                temp.append(attachments.replaceAll("'", "''"));
                temp.append("', lastupdate=" + l);
                temp.append("  where sid='" + sid);
                temp.append("' AND course='" + course.replaceAll("'", "''"));
                temp.append("' AND assignname ='" + assignname.replaceAll("'", "''"));
                temp.append("' AND semester='" + semester.replaceAll("'", "''") + "' and grade <= 0");

                String s3 =   l 
                        + ",'"  +  sid 
                        + "','" + semester.replaceAll("'", "''") 
                        + "','"  + course.replaceAll("'", "''")
                        + "','" + assignname.replaceAll("'", "''")
                        + "','" + content.replaceAll("'", "''")
                        + "','" + comment.replaceAll("'", "''")
                        + "'," + M 
                        + ","  + l 
                        + ",'"  + fmt 
                        + "','"  + attachments.replaceAll("'", "''") 
                        + "','" + submission.assess.replaceAll("'", "''") + "'";
                String sql1 = "INSERT INTO Submission(lastupdate,sid,semester,course,assignname,content,comment,grade,submtime,format,attach,assess) values(" + s3 + ")";

                ssql.append(temp.toString() + "\n" + sql1 + "\n");
                nn  = adapter.executeUpdate(sql1);
                if (1 != nn ) 
                {
                    nn = adapter.executeUpdate(temp.toString());
                    if (nn != 1)
                    {
                        nn = adapter.executeUpdate(sql2);
                        submission.receipt = content;
                    }
                }
                 
                if (way.equals("submission") && distinct)
                {
                    String code = Toolbox.defaultParam(orgnum, request, "code", "", null, 20);
                    adapter.executeUpdate("DELETE FROM DistinctCode WHERE  code=" + code + " AND iid='" + subdb + "'"); 
                 }
                
                if (nn == 1)
                {
                    User user1 = new User(orgnum);
                    user1.id = sid;  
                    user1.orgnum = user.orgnum;
                    if (way.equals("submission")) 
                    {
                        String file = FileOperation.getFileName(course + assignname);
                        response.addHeader("Content-Disposition", "inline;filename=" + file + ".html");
                        StringBuffer q = new StringBuffer(submission.receipt + "<br>" + submission.leas); 
                        if (hasresult){q = new StringBuffer("<pre style=font-family:courier>" + sentsolution + "</pre><br>" + leas);  submission.text = sentsolution;}
                        submitReceipt(q, user1, 'i', semester, course,  assignname, l,  submission.text + submission.leas, attachments, request.getRequestURI(),orgnum,cachedstyle);
                        out.print(q.toString());
                    }
                    else
                    {
                        out.print("parent.updatesheet(\"" + Generic.handle(submission.assess) + "\");parent.syn('1');parent.nextstep('" + Toolbox.emsgs(orgnum,71) + "');</script></body></html>");
                    }
                }
                else
                {
                    
                    aWriter = new FileWriter(user.webFileFolder +  File.separator + course + assignname + d.getMonth() + d.getDate() + ".sql", false);
                    aWriter.write(sql);
                    aWriter.write(adapter.error());
                    aWriter.close(); 
                    if (way.equals("submission")) 
                    {
                        out.println("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + Toolbox.jaxhead + "</head><body>");
                        out.println(Toolbox.emsgs(orgnum,1409) + ".<br>"
                                + user.id + "<br>" 
                                + course + "<br>"
                                + assignname + "<br>"
                                + content   + "<br>"
                                + attachments ); 
                        out.println("</body></html>");
                    }
                    else
                    {
                        out.println("parent.myprompt('Not saved');</script></body></html>");
                    }
                }
                adapter.close();
                
            } 
            else if (way.equals("regrade") || way.equals("gradeall")) 
            {
              
               StringBuffer temp = new StringBuffer(200);
               temp.append("UPDATE Submission SET ");
               if (contentchanged)
                    temp.append(" content='" + submission.content.replaceAll("'","''") + "',");
               temp.append("comment='" + (oldcomment.equals("")?Toolbox.emsgs(orgnum,393):oldcomment.replaceAll("'","''")));
               temp.append("', grade=" + M);
               temp.append(",assess='" + submission.assess);
               temp.append( "', submtime=");
               temp.append(l + ", format='");
               temp.append(fmt + "', lastupdate=" + l);
               temp.append(" where sid='");
               temp.append(sid);
               temp.append("' AND course='");
               temp.append(course.replaceAll("'", "''"));
               temp.append("' AND assignname ='" + assignname.replaceAll("'", "''"));
               temp.append("'  AND semester='" + semester.replaceAll("'", "''") + "'");
               doallsql.addElement(temp.toString());
               
            }
            oldsessionname = sessionname;
            oldassignname = assignname;
            oldcourse = course;
            oldembedquiz = embedquiz;
        } // ends for u loop
        
        if (way.equals("gradeall") || way.equals("regrade")) 
        {
            boolean good = true;           
            for (int k = 0; k < doallsql.size(); k++) 
            {
                String temp = doallsql.elementAt(k);
                if (temp != null && 0 >  adapter.executeUpdate(temp)) 
                {
                    msg += "<br>" + temp + "<br>" + adapter.error();
                    ssql.append(temp + "\n");
                    good = false;
                }
                 
                 
            }
            adapter.close();
            String header1 = "<tr style=\"background:" + Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle) +"\"><td><nobr>" + Toolbox.emsgs(orgnum,430) + "</nobr></td><td><nobr>" +  Toolbox.emsgs(orgnum,233) + "</nobr></td><td><nobr>" + Toolbox.emsgs(orgnum,213) + "</nobr></td><td align=right><nobr>" + Toolbox.emsgs(orgnum,1196) + "</nobr></td><td align=right><nobr>" + Toolbox.emsgs(orgnum,238) + "</nobr></td><td align=right><nobr>" + Toolbox.emsgs(orgnum,1145) + "</nobr></td></tr>";
            String header2 = "<tr><td colspan=6> </td></tr><tr style=\"background:" + Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle) +"\"><td><nobr>" + Toolbox.emsgs(orgnum,430) + "</nobr></td><td><nobr>" +  Toolbox.emsgs(orgnum,19) + "</nobr></td><td><nobr>" + Toolbox.emsgs(orgnum,213) + "</nobr></td><td><nobr>" + Toolbox.emsgs(orgnum,75) + "</nobr></td><td align=right><nobr>" + Toolbox.emsgs(orgnum,224) + "</nobr><td align=right><nobr>" + Toolbox.emsgs(orgnum,1145) + "</nobr></td></td></tr>";
            String tail = "<tr><td id=errsolution colspan=6 bgcolor=lightblue></td></tr><tr><td id=erranswer  colspan=6  bgcolor=lightyellow></td></tr>";
            boolean haserror = (errmsg.length() > 0);
            if (haserror == false) 
            {
                header2 = "";
                tail = ""; 
            }
            if (coursesa.equals(""))
                header1 = ""; 
            if ( !good && (user.roles & Systemroles.SYSTEMANALYST) > 0 ) 
           { 
               if (header1.equals(""))
                   out.println("parent.myprompt('" + Toolbox.emsgs(orgnum,1454) + "');");
               else 
               out.println("parent.myprompt(\"<div  class=outset3  style=\\\"background-color:#b0b0b0;margin:3px 3px 3px 3px\\\" ><table border=0 align=center class=outset3 cellspacing=1 cellpadding=3>"
              + header1.replaceAll("\"","\\\\\"") + coursesa + header2.replaceAll("\"","\\\\\"") +  Generic.handle( errmsg.toString()) + tail + "<tr><td colspan=4>"  + Generic.handle(ssql.toString()).replaceAll("<img", "&lt;img") + "</td></tr></table></div>\");");
           }
           if (embedquiz || good) 
           { 
               String keybase = (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" ; 
               String a = "", b=""; 
               Set<String> css = Eq.eqs.keySet();
               
               for (String [] cs1 :  coursesessions)
               {
                    String key = keybase + cs1[1];
                    Msgboxrun.mbox.remove(key);
                    String keystr = orgnum%65536  + "-" + cs1[0] + "-" + cs1[1];
                    
                    if (css.contains(keystr) ) 
                    {
                   a +="<a href=\"javascript:removememobj(\\'"
                    + cs1[0] + "\\',\\'" + cs1[1]
                    + "\\')\">" + cs1[0] + "-" + cs1[1] + "</a>  "; 
                    }
               }
               Set<String> mss = Msgboxrun.mbox.keySet();
               for (String key : mss)
               {
                    for (String [] cs1 :  coursesessions)
                    {
                    String keystr = orgnum%65536  + "|" + semester +"|" + cs1[0] +"|";
                    if (key.indexOf(keystr) == 0 && key.substring(key.lastIndexOf("|")+1).equals(cs1[1]) && a.indexOf(">" + cs1[0] + "-" + cs1[1] +"<") < 0)
                     a +="<a href=\"javascript:removememobj(\\'"
                    + cs1[0] + "\\',\\'" + cs1[1]
                    + "\\')\">" + cs1[0] + "-" + cs1[1] + "</a>  "; 
                    }    
                }
               
               if (header1.equals(""))
                   out.println("parent.myprompt('" + Toolbox.emsgs(orgnum,1454) + "');");
               else out.println("parent.setready('<div class=outset3 style=\\\"background-color:#b0b0b0;margin:3px 3px 3px 3px\\\" ><table   align=center border=0  class=outset3  cellspacing=1 cellpadding=3>" + header1 +  coursesa + header2 + Generic.handle( errmsg.toString()) + 
                   tail  + "</table></div> " + a +  "');");  
           } 
           out.println("function showerrdetail(u){var fm = '0';if (typeof(parent.retrv)!='undefined')fm = parent.retrv(0,3);var x=parent.document.getElementById('errsolution');if (x!=null){x.innerHTML=parent.formatstr(err[u][0],fm);if (fm=='2')parent.LaTexHTML.reformat(x);}x=parent.document.getElementById('erranswer'); if (x!=null) { x.innerHTML=parent.formatstr(err[u][1],fm);if (fm=='2')parent.LaTexHTML.reformat(x);}}</script></body></html>");
        }
        else if (way.equals("testing"))
        {
            %>
            <!DOCTYPE html><html lang="<%=Toolbox.langs[orgnum>>16]%>">
            <head><%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%><title><%=Toolbox.emsgs(orgnum,484)%></title>
            <%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
            <link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
            <script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
            </head>
            <body style="margin:0px 0px 0px 0px"  >
            <center>
            <%= Toolbox.title(Toolbox.emsgs(orgnum,488)) %>
            <script type="text/javascript" >document.write(round1(''));</script>
            <table border=0  class="outset3" >
            <tr><td  align=right><b><nobr><%=Toolbox.emsgs(orgnum,430)%></b></td><td><nobr><%=course%></td></tr>
            <tr><td  align=right><b><nobr><%=Toolbox.emsgs(orgnum,321)%></b></td><td><nobr><%=assignname%></td></tr>
            </table>
            <script type="text/javascript" >document.write(round2);</script>
            <% if (msg.equals("")==false)
            {
             %>
                <div><%=msg%></div>
             <%
            }
            else
            {
                %>
                <style>
                    table>tr>td>div>table>tr>td {background-color:white}
                </style>
                <script type="text/javascript" >document.write(round1(''));</script>
                <div  class="outset3"   ><table border="1" cellspacing="1" cellpadding="3" class="outset3" style="border-collapse:collapse">
                <%=
                        assign.makehtml(fmt) + "<tr><td colspan=14><table width=100% ><tr><td>" 
                        + Toolbox.emsgs(orgnum,225) + "</td><td>Q="+ EN + ", S=" + S + ", M =" + M +"</td><td>" + Toolbox.emsgs(orgnum,485) + "</td><td>" 
                        + formula +"</td><td>Leaving Time</td><td>" +  leas + "</td></tr></table></td></tr>"
                %>
                    </table>
                </div>
                <script type="text/javascript" >document.write(round2);
                var needtranslator = true;
                </script>

                <%
            }
            %>
            <script type="text/javascript"  src="curve.js"></script>
            </body>
            </html>
            <%
        }
        
%>
 


 