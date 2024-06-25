<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
    User user = (User)(session.getAttribute("User"));
%>
<%!
String fields(String x, int orgnum, CachedStyle cachedstyle)
{
         return "<TD VALIGN=top ><table cellspacing=1 cellpadding=1 width=100% ><tr height=26 width=100% ><td  width=100% style=\""
         + "background:linear-gradient(to right," + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ")\" > <b><font color=#DDCC11><nobr>"
         + x 
         + "</nobr></FONT></b></td></tr></table></TD>";
                  
} 
String fields2(String x, int orgnum)
{
    return "<TD  width=50 valign=center align=center><font color=black><nobr>"+ x + "</nobr></FONT></TD>";
} 
String fields1(String x, int orgnum, CachedStyle cachedstyle )
{
    return "<table cellspacing=1 cellpadding=1 width=100><tr  height=26  width=100><td  width=100 style=\""
    + "background:linear-gradient(to right," + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ")\" > <b><font color=#DDCC11>"
    + x 
    +"</FONT></b> </td> </tr></table> ";
} 

%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><%=Toolbox.getMeta(orgnum)%><title><%=Toolbox.emsgs(orgnum,1002)%></title>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
<style type="text/css">
ol {margin-left:-12px}
ol li{margin:4px 0px 0px -2px; padding: 2px 0px 2px 0px}
</style>
</head>
<body bgcolor=<%= cachedstyle.DBGCOLOR %>  >
<center>
<%
boolean passdue = (Toolbox.dbadmin[orgnum%65536].getAppedt(4) < System.currentTimeMillis()/1000);
String type = Toolbox.defaultParam(orgnum,request, "type","3", null, 30);
String sname = Toolbox.defaultParam(orgnum,request, "SelectionName","", null, 30);
String code = Toolbox.defaultParam(orgnum,request, "Code","", null, 30);
String uid = Toolbox.defaultParam(orgnum,request, "uid","", null, 30);
    
if (type.equals("4"))
{
    %>
    <%=Toolbox.title( Toolbox.emsgs(orgnum,1002) )%>
    <%
    
    String url = request.getRequestURL() +"?type=1&" +  Toolbox.emsgs(orgnum,997)  + "=" + Toolbox.urlencode(sname)
    +"&" +  Toolbox.emsgs(orgnum,998)  +"=" + Toolbox.urlencode(code) +"&uid=" + Toolbox.urlencode(uid);
    out.println("</center>" + Toolbox.emsgs(orgnum,999) + ": <br><br>" + "<a href=\"" + url +"\">" + url +"</a><br><br>" +  Toolbox.emsgs(orgnum,1000) + ".");
    return;
}
//out.println(sname + type + code + uid);    
String rate[] = Toolbox.dbadmin[orgnum%65536].domainValue(Toolbox.langs[orgnum>>16],  "Evaluation Rating", 0,1).split("[;|,]"); 
int R = rate.length/2;
JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
    
if (  !Toolbox.verifytoken(request))
{
    adapter.close();
    User.dberrorRelogin(application,session,request,response,"vieweval.jsp");
    return;
}

String sql;
Vector semesters = new Vector(), courseids = new Vector(), sessionnames = new Vector(), titles = new Vector();
int n = 0;
String pagetitle=Toolbox.emsgs(orgnum,1002);
String sessionname = "";
String semester = "";
String courseid = "";
String where = Toolbox.defaultParam(orgnum,request, "wcds","");;
String person = "";
int  m = 0;
if (!sname.equals("") && !code.equals(""))
{
    sql = "SELECT semester, courseid, sessionname, firstname,middlename, lastname, Course.title FROM EvalSelDetail,EvalSelection, AppUser, Course WHERE Course.id=EvalSelDetail.courseid AND " +
    "EvalSeldetail.sname=EvalSelection.sname AND code='" + code.replaceAll("'","''") + "' AND EvalSelDetail.uid='" + uid.replaceAll("'","''") +"' AND EvalSelection.sname='" + sname.replaceAll("'","''")
    +"' AND EvalSelection.uid='" + uid.replaceAll("'","''") +"' AND AppUser.id='" + uid.replaceAll("'","''") +"'";
    n = adapter.executeQuery(sql);

    if (n<=0)
    {
      %>
      <%=Toolbox.title( pagetitle )%>
      <br>
      <%
       out.print(Toolbox.emsgs(orgnum,47)); 
       //out.println(sql);
       adapter.close();
       return; 
    }
    for (int i=0; i<n; i++)
    {
       semesters.addElement(adapter.getValueAt(i,0));
       courseids.addElement(adapter.getValueAt(i,1));
       sessionnames.addElement(adapter.getValueAt(i,2));
       titles.addElement(adapter.getValueAt(i,6));
    }
    if (type.equals("1"))
    {
        pagetitle =  Toolbox.emsgs(orgnum,1094);
        person = "<tr>" + fields(Toolbox.emsgs(orgnum,18), orgnum, cachedstyle) + "<td align>" + Toolbox.makeFullName(adapter.getValueAt(0,5),adapter.getValueAt(0,4),adapter.getValueAt(0,3)) +"</td></tr>";
    }
    else if (type.equals("3"))
    {
        pagetitle =  Toolbox.emsgs(orgnum,1095);
        person = "<tr>" + fields(Toolbox.emsgs(orgnum,1096), orgnum, cachedstyle) + "<td align>" + Toolbox.makeFullName(adapter.getValueAt(0,5),adapter.getValueAt(0,4),adapter.getValueAt(0,3)) +"</td></tr>";
    }
    else if (type.equals("2"))
        pagetitle =  Toolbox.emsgs(orgnum,1003);
}
else  
{
    
    if ( (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request, response, "vieweval.jsp", true)) == null) 
    {
        adapter.close(); 
        return;
    }
orgnum=user.orgnum;
    semester = Toolbox.defaultParam(orgnum,request, "Semester","", null, 30);
    courseid = Toolbox.defaultParam(orgnum,request, "CourseId","", null, 30);
    semesters.addElement(semester);  
    courseids.addElement(courseid);
    sessionname = Toolbox.defaultParam(orgnum,request, "Session","", null, 30);
  
    sessionnames.addElement(sessionname); 
    
    uid = user.id;
    titles.addElement("");
   // out.println("session=" + where);
    if (type.equals("2"))
    {
        pagetitle =  Toolbox.emsgs(orgnum,1003);
        if ( (user.roles & Systemroles.TEACHINGADMIN ) == 0 && sessionname.equals("") || courseid.equals("") && where.equals(""))
        {
            adapter.close(); 
            return; 
        }
    }
    else if (type.equals("1"))
        pagetitle =  Toolbox.emsgs(orgnum,1094);
    else if (type.equals("3"))
        pagetitle =  Toolbox.emsgs(orgnum,1095);
    n = 1;
    
}
 
    
out.println(Toolbox.title(pagetitle)    );
boolean hasr = true; 
String quests[] = null;    
for (int i=0; i < n; i++)
{
    hasr = true;
    courseid = (String)(courseids.elementAt(i));
    sessionname = (String)(sessionnames.elementAt(i));
    semester = (String)(semesters.elementAt(i));
    
   // out.println("courseid=" + courseid +"<br>sessionname=" + sessionname +"<br>semester=" + semester+"<br>where=" + where +"<br>passdue=" + passdue+"<br>curentsemester=" + Toolbox.dbadmin[orgnum%65536].currentSemester);
    if (where.equals("") || i==0)
    {
        String sql1 = "SELECT  questionnum, questiontxt FROM EvalQuestion WHERE semester='" + semester.replaceAll("'","''") +"' AND etype=" + type.replaceAll("'","''") +" order by questionnum";
        if (semester.equals(""))
           sql1=sql1.replaceFirst("WHERE semester=''", "WHERE semester='"+Toolbox.dbadmin[orgnum%65536].currentSemester +"'");
        m = adapter.executeQuery(sql1);
        if (m < 1) 
        {
            out.println(Toolbox.emsgs(orgnum,1531) + ":"  + semester + " " + type + "  "  );
            continue;
        }

        quests  = new String[m];
        for (int ii=0; ii < m; ii++)
        {    
            quests[ii] = adapter.getValueAt(ii,1); 
        }
    }
    int N=0, freq[][] = new int[R][];
    String comments = "", com;
    
    if (!semester.equals("")&&!semester.equals(Toolbox.dbadmin[orgnum%65536].currentSemester) || passdue)
    {  
        //insavg,inssum,inscomment,courseavg,coursesum,coucomment,taavg,tasum,tacomment
        String sums[] = {"inssum","coursesum","tasum"};
        String coms[] = {"inscomment","coucomment","tacomment"};
        int etypen = Integer.parseInt(type) - 1; 
        sql = "SELECT " + sums[etypen] + "," + coms[etypen] + ",numeval FROM SessionSum WHERE  semester='" +  semester.replaceAll("'","''") 
             + "' AND courseid='" +     courseid.replaceAll("'","''") 
             + "' AND sessionname='" + sessionname.replaceAll("'","''") +"'"; 
        if (!where.equals("")) 
        {
            sql = "SELECT " + sums[etypen] + "," + coms[etypen] + ",numeval,semester,courseid,sessionname,Course.title FROM SessionSum,Course " + where.replaceFirst(" AND etype=2","") +" AND Course.id=courseid";
        }  
 
        m = adapter.executeQuery(sql); 
  
        if (m>=1 && !where.equals(""))
        {
            courseid=(adapter.getValueAt(0,4));
            semester=(adapter.getValueAt(0,3));
            sessionname=(adapter.getValueAt(0,5));
            titles.setElementAt(adapter.getValueAt(0,6),0);
        }
        if (m>1)
        {
            n+= m-1;
            for (int l=1; l < m; l++)
            {
                courseids.addElement(adapter.getValueAt(l,4));
                semesters.addElement(adapter.getValueAt(l,3));
                sessionnames.addElement(adapter.getValueAt(l,5));
                titles.addElement(adapter.getValueAt(l,6));
            }
            where = "";
        } 
        
        if (m > 0 && !adapter.getValueAt(0,0).equals("")) 
        {
            String [] nums = adapter.getValueAt(0,0).split("\n");
         
            for (int j=0; j < R && j < nums.length; j++)
           {
            String [] numsj = nums[j].split("\t");
            N = numsj.length;
            freq[j] = new int[N];
            for (int k=0; k < N; k++)
                freq[j][k] = Integer.parseInt(numsj[k]);
           } 
         
           comments = adapter.getValueAt(0,1);  
           m = Integer.parseInt(adapter.getValueAt(0,2));  
        }
        else 
        {
            hasr = false;
            
        }
    }
    else
    {    
        if (type.equals("2"))
        {
            if (where.equals("")==false)
            {
                sql = "SELECT answer , comment, 2 as type  FROM Evaluation " + where;
                int ll = where.indexOf("courseid");
                courseid = where.substring(ll+11).replaceFirst(" AND.*$","").replaceAll("'","");
            }
            else
            { 
                sql = "SELECT answer , comment, 2 as type   FROM Evaluation WHERE "
                    + "  courseid='" +    courseid.replaceAll("'","''") + "' AND etype=2 ";
                if (sessionname.equals("")==false) 
                    sql += " AND sessionname='" +  sessionname.replaceAll("'","''") +"'";
                if (semester.equals("")==false) 
                    sql += " AND semester='" +  semester.replaceAll("'","''") +"'"; 
            }
        }
        else
        {  
             sql = "SELECT answer , comment, etype as type  FROM Evaluation, Session WHERE Session.semester=Evaluation.semester AND Session.semester='" +  semester.replaceAll("'","''") 
             + "' AND Evaluation.courseid=Session.courseid AND  Evaluation.courseid='" +     courseid.replaceAll("'","''") 
             + "' AND Evaluation.sessionname=Session.name AND Evaluation.sessionname='" + sessionname.replaceAll("'","''") 
             + "' AND (etype=1  AND Session.instructor='" + uid.replaceAll("'","''") +"' OR etype=3 AND Session.ta='" + uid.replaceAll("'","''") +"')";
        }
 
        m = adapter.executeQuery(sql);   

        if (m <=0) 
        {
            hasr = false;
        }
        else
        {
           String  alla = adapter.getValueAt(0,0);
           
          
           N = alla.length();
       
           for (int j=0; j < R; j++) 
           {
             freq[j] = new int[N];
             for (int k=0; k < N; k++)
                 freq[j][k] = 0;
           }
    
           for (int j=0; j < m ; j++)
           {
             alla = adapter.getValueAt(j,0); 
              
             for (int k=0; k < N; k++)
             {
                 int r =  alla.charAt(k) - '0';
                 if (r < R)
                 freq[r][k]++;
             } 
             com = adapter.getValueAt(j,1);
             if (com!=null && com.equals("")==false)
                 comments += "<li>" + Toolbox.formatstr("0",com) +"</li>";
           }
           type = adapter.getValueAt(0,2);
        }
     }
     String semester1 = semester; int kk=0;
     
     if (semester.equals("")&& (kk=where.indexOf("semester"))>0)
     {
         semester1 = where.substring(kk+12).replaceFirst("'.*$","");
         
     }
adapter.close();     
     %>
     <br>
          <script type="text/javascript" >document.write(round1('100%'));</script>
           <TABLE BORDER=0 cellspacing=0 width=100%  class=outset3 >
              <tr><td aling=left   valign=top align=left>
                <table cellpadding=3 cellspacing=0>
                  <%=person%>
                  <tr><%=fields(Toolbox.emsgs(orgnum,430), orgnum, cachedstyle)%><td  align=left ><%=courseid%> <%= (String)(titles.elementAt(i)) %> </td></tr>
                  <tr><%=fields(Toolbox.emsgs(orgnum,233), orgnum, cachedstyle)%><td  align=left ><%=sessionname.equals("")?Toolbox.emsgs(orgnum,450):sessionname%> </td></tr>
                  <tr><%=fields(Toolbox.emsgs(orgnum,1004), orgnum, cachedstyle)%><td  align=left ><%=semester1.equals("")?Toolbox.emsgs(orgnum,450):semester1%> </td></tr>
                  <% if (hasr){%>
                  <tr><%=fields(Toolbox.emsgs(orgnum,1005), orgnum, cachedstyle)%><td  align=left >
                  
                      <script type="text/javascript" >document.write(round1('100%'));</script>
                                    <TABLE width=100% border=0 cellpadding=1 cellspacing=1 class=outset3 >
                                        <tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>">    
                                        <% 
                                        double total = 0.0;
                                        double sf[] = new double[rate.length/2];
                                        out.print("<td>" +  Toolbox.emsgs(orgnum,1099) +"</td>");
                                        for (int j=rate.length/2-1; j>=0; j--)
                                        {
                                            out.print(fields2(rate[j*2+1].replaceFirst("/",""),orgnum));
                                            sf[j] = 0;
                                        } 
                                        out.print(fields2(Toolbox.emsgs(orgnum,320), orgnum)); 
                                        %>
                                       </tr>
                                       
                                        <% 
                                        
                                        for (int k=0; k < N; k++) 
                                        {
                                        double sum=0.0;
                                        %> 
                                        <tr   bgcolor=<%=cachedstyle.TBGCOLOR%> ><td  valign=center align=left > <%=k+1%>.<%=quests[k]%> </td> 
                                        <% 
                                            for (int j=rate.length/2-1; j>=0; j--) 
                                            { 
                                                 
                                                 sum += j*freq[j][k];
                                                 sf[j]+= freq[j][k];
                                                 out.print(fields2("" + freq[j][k] + "/" + m,orgnum));
                                            }
                                            out.print(fields2(Toolbox.roundto(sum/m,2), orgnum));
                                            total += sum/m;
                                         }
                                         %>
                                         </tr>
                                         <tr  bgcolor=<%=cachedstyle.TBGCOLOR%> ><td valign=center  align=right> <%=Toolbox.emsgs(orgnum,238)%></td>
                                        <% 
                                        for (int j=rate.length/2-1; j>=0; j--) 
                                            out.print(fields2(Toolbox.roundto(100*sf[j]/m/N,1)+"%", orgnum));  
                                        out.print(fields2("<b>"+Toolbox.roundto(( total + 0.0 )/N,2),orgnum));
                                        %> 
                                        
                                        </tr>
                                    </table>
                          <script type="text/javascript" >document.write(round2);</script>
                      </td>
                    </tr>
                     
                    <tr><%=fields(Toolbox.emsgs(orgnum,1006), orgnum, cachedstyle)%>
                       <td align="left">
                                     <ol>
                                        <%=comments%>
                                    </ol>
                       </td>
                    </tr>
                    <%} else {%> <tr><%=fields(Toolbox.emsgs(orgnum,1005), orgnum, cachedstyle)%><td><%=Toolbox.emsgs(orgnum,1092)%>
                      <br><%=semester%> due: <%=Toolbox.timestr(Toolbox.dbadmin[orgnum%65536].getAppedt(4))%>  
                
                </td></tr> <%}%>
                      
                  </table>
             </TD>
          </TR>
        </TABLE>         
      <script type="text/javascript" >document.write(round2);</script>
  
<%}%>
 
</body>
</html>
