<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
String normalstatus = "4";
User user = (User)(session.getAttribute("User"));
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,270)%></title> 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<style type="text/css">
ol {margin-left:0px}
ol li{margin:0px; padding: 2px 0px 2px 0px}
</style>
</head>
<body bgcolor=<%= cachedstyle.DBGCOLOR %> leftmargin=6 rightmargin=6 bottommargin=6 topmargin=6>
<center>
    
<%
boolean passdue = Toolbox.verifytoken(request);//(Toolbox.getAppedt(4) < System.currentTimeMillis()/1000);
if (passdue==false) return;
 
String rate[] = Toolbox.dbadmin[orgnum%65536].domainValue(Toolbox.langs[orgnum>>16], "Evaluation Rating", 0, 1 ).split("[;|,]"); 
int R = rate.length/2;
JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
    


String sql = "select courseid, name from Session where semester='" +  Toolbox.dbadmin[orgnum%65536].currentSemester  +"'";

String pagetitle = Toolbox.emsgs(orgnum,1098);
String semester = Toolbox.dbadmin[orgnum%65536].currentSemester ;
String com = "";
int m, N, n  = adapter.executeQuery(sql);
if (adapter.error().length() > 0)
{
    adapter.close();
    User.dberrorRelogin(application,session,request,response,"evalsummary.jsp");
    return;
}
if (n <=0) 
{
    out.println("<br>error:<br><br>" + sql ); 
    adapter.close();
    return;
}
    
String courses[] = new String[n];
String sessions[] = new String[n];
for (int j=0; j < n ; j++)
{
    courses[j] = adapter.getValueAt(j, 0); 
    sessions[j] = adapter.getValueAt(j, 1);
}
out.println(Toolbox.title(pagetitle)   );
%>
<TABLE width=100% border=0 bgcolor=#b0b0b0 cellpadding=1 cellspacing=0 >                                                
<TR><TD valign=TOP> 
<TABLE width=100% border=1 cellpadding=1 cellspacing=1 bgcolor=<%= cachedstyle.DBGCOLOR %>>
<%
StringBuffer sqlstr = new StringBuffer(200);
StringBuffer sb = new StringBuffer(R*30);
StringBuffer cm = new StringBuffer(300);
for (int i=0; i < n; i++)
{
   sqlstr.setLength(0);
   sqlstr.append("INSERT INTO SessionSum(");
   if (DBAdmin.sysonwebdb)
      sqlstr.append("lastupdate,");
   sqlstr.append("semester,courseid,sessionname,insavg,inssum,inscomment,courseavg,coursesum,coucomment,taavg,tasum,tacomment,numstudent,numnormal,numeval,gradeavg,attendance)  VALUES(");
   if (DBAdmin.sysonwebdb)
   {
       sqlstr.append(System.currentTimeMillis()/1000);
       sqlstr.append(",'");
   }
   else
       sqlstr.append("'");       
   sqlstr.append(Toolbox.dbadmin[orgnum%65536].currentSemester);
   sqlstr.append("','");
   sqlstr.append(courses[i]);
   sqlstr.append("','");
   sqlstr.append(sessions[i]);
   sqlstr.append("',");
%>
<tr bgcolor=<%=cachedstyle.TBGCOLOR%> >
<td  valign=center align=left ><nobr><%=courses[i]%></nobr></td> 
<td  valign=center align=left ><nobr><%=sessions[i]%></nobr></td>
<%
int ne= 0; 
for (int z=1; z <=3; z++)
{
    sql = "SELECT answer , comment   FROM Evaluation  WHERE  Evaluation.semester='" +  semester  
             + "' AND  Evaluation.courseid='" + courses[i].replaceAll("'","''") 
             + "' AND  Evaluation.sessionname='" + sessions[i].replaceAll("'","''")  
             + "' AND etype=" + z;
    m = adapter.executeQuery(sql);
    if (m <= 0) 
    {
        sqlstr.append("0,'','',");
        continue;
     }
    String  alla = adapter.getValueAt(0,0);
    N = alla.length();
    int freq[][] = new int[R][];
    for (int j=0; j < R; j++) 
    {
             freq[j] = new int[N];
             for (int k=0; k < N; k++)
                 freq[j][k] = 0;
    }
    cm.setLength(0);
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
                 cm.append("<li>" + Toolbox.formatstr("0",com) +"</li>");
     }
    ne = m;
    
    double total = 0.0;
    for (int k=0; k < N; k++) 
    {
        double sum=0.0;
        for (int j=0; j < R; j++) 
           sum += j*freq[j][k];
        total += sum/m;
    }                                              
    
    sb.setLength(0);
    for (int j=0; j < R; j++) 
    {
        for (int k=0; k < N; k++)
        {
            sb.append(freq[j][k]);
            if (k<N-1)sb.append("\t");
           
        }
        if (j < R-1)sb.append("\n");
    }
    sqlstr.append(Toolbox.roundto(total/N,2)); 
    sqlstr.append(",'");
    sqlstr.append(sb.toString());
    sqlstr.append("','");
    sqlstr.append(cm.toString());
    sqlstr.append("',");
}
if (Toolbox.dbadmin[orgnum%65536].gradeSystem==1)
sql = "SELECT grade,status,attendance FROM Registration, Session WHERE Session.semester=Registration.semester AND Session.semester='" +  semester 
             + "' AND Registration.courseid=Session.courseid AND  Registration.courseid='" + courses[i].replaceAll("'","''") 
             + "' AND Registration.sessionname=Session.name AND Registration.sessionname='" + sessions[i].replaceAll("'","''")  
             + "'";
else
    sql = "SELECT DomainValue.code,status,attendance FROM Registration, Session, DomainValue WHERE Session.semester=Registration.semester AND Session.semester='" +  semester
             + "' AND Registration.courseid=Session.courseid AND  Registration.courseid='" + courses[i].replaceAll("'","''") 
             + "' AND Registration.sessionname=Session.name AND Registration.sessionname='" + sessions[i].replaceAll("'","''")  
             + "' AND (DomainValue.domain='" + Toolbox.emsgs(orgnum,241) +"' or DomainValue.domain='Semester') AND DomainValue.language='" + Toolbox.langs[orgnum>>16] + "'"
             + "' AND Registration.grade=DomainValue.domainValue";
m = adapter.executeQuery(sql);
if (m > 0)
    out.println("<td>OK</td>"); 
else
    out.println("<td>" + sql  + "</td>");
int nn = 0;
int tt = 0;
int na = 0;
for (int j=0; j < m ; j++)
{
     if(adapter.getValueAt(j,1).equals(normalstatus)&& adapter.getValueAt(j,0).indexOf("-")<0)
     {
             nn++;
             tt+=Integer.parseInt(adapter.getValueAt(j,0));
             na+=Integer.parseInt(adapter.getValueAt(j,2));
     }
}  //numstudent,numnormal,gradeavg,attendance
sqlstr.append(m);
sqlstr.append(",");
sqlstr.append(nn);
sqlstr.append(",");
sqlstr.append(ne);
sqlstr.append(",");
if (nn>0)
     sqlstr.append(Toolbox.roundto(tt/nn,2));
else
     sqlstr.append(0);
sqlstr.append(",");
if (nn>0)
   sqlstr.append(na/nn);
else
     sqlstr.append(0); 

sqlstr.append(")");
 
m = adapter.executeUpdate(sqlstr.toString());
sql=""; 
if (m==1)
{
     sql = "DELETE FROM Evaluation  WHERE  Evaluation.semester='" + semester
             + "' AND  Evaluation.courseid='" + courses[i].replaceAll("'","''") 
             + "' AND  Evaluation.sessionname='" + sessions[i].replaceAll("'","''")
             +"'";
     out.println("<td>OK</td></tr>");
     int m1 = adapter.executeUpdate(sql); 
}
else 
    out.println("<td>" +  sqlstr.toString() + "</td></tr>");
}
adapter.close();
%>
</td></tr></table>
</TD></TR></TABLE>         
 
</body>
</html>
