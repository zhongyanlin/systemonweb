<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
 
User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.TEACHINGADMIN | Systemroles.ASSESSER |Systemroles.INSTRUCTOR,application,session,request, response, "schexecute.jsp", false)) == null)
return;
orgnum=user.orgnum;
String dept = Toolbox.defaultParam(orgnum,request,"dept","");
String semester = Toolbox.defaultParam(orgnum,request, ("semester"), null);
semester = Toolbox.validate(semester, null, 3);
if (semester == null){ out.print("semester not specified");return;}
String semesterName = Toolbox.defaultParam(orgnum,request, ("semesterName"), null);
semesterName = Toolbox.validate(semesterName, null, 30); 
JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
Scheduler sch = null;
 
String hasdept = "";
if (!dept.equals("")) 
    hasdept = " WHERE Classroom.dept is NULL OR Classroom.dept='' OR Classroom.dept LIKE '%" + dept +"%'";
int n = adapter.executeQuery("SELECT  seats, num FROM Classroom " + hasdept +" order by num ");
String [] rooms = null;
int seats[] = null;
if (n < 0) 
{
    out.println("\n\n" + adapter.error() +"\n\n");
}                  
else if (n >= 1)
{     
 rooms = new String[n];
 seats  = new int[n];
}
HashMap mapr = new HashMap();
for (int i = 0; i < n; i++)
{
    rooms[i] = adapter.getValueAt(i,1);
    seats[i] = Integer.parseInt(adapter.getValueAt(i,0));
    mapr.put(rooms[i], ""+i);
}
hasdept = "";
if (dept!=null && !dept.equals(""))
    hasdept = " WHERE dept='' OR dept='" + dept.replaceAll("'","''") +"' ";
int m = adapter.executeQuery("SELECT timeSlot, num FROM TimeSlot " + hasdept +" ORDER BY num");
String [] slots = null;
if (m < 0) 
{
    out.println(adapter.error());
}                  
else   if (m >= 1)
 {     
 slots = new String[m];
 }
HashMap maps = new HashMap();
for (int i = 0; i < m; i++)
{
    slots[i] = adapter.getValueAt(i,0);
    maps.put(adapter.getValueAt(i,1), ""+i);
}
hasdept = "";
if (!dept.equals("")) 
    hasdept = " AND dept='" + dept +"' ";
String sql = "SELECT DISTINCT num1 FROM Scheduler  WHERE semester=" + semester + " and (which='i' or  which='j' or which='k') " + hasdept +" order by num1";
int k = adapter.executeQuery(sql);

HashMap maph = new HashMap();
String [][] y = null;
if (k < 0) 
{
    out.println(adapter.error());
}                  
else  if (k >= 1)
    y = new String[k][];
for (int l = 0; l < k; l++)
{
    y[l] = new String[5];
    y[l][0] = adapter.getValueAt(l,0);
    maph.put(y[l][0],""+l);
}

sql = "SELECT num1,num2 FROM Scheduler WHERE which='i' " + hasdept +"  and semester=" + semester + "  order by num1";
k = adapter.executeQuery(sql);

Object t = null;
if (k < 0) 
{
    out.println(adapter.error());
}                  

int ll;
for (int l = 0; l < k; l++)
{
    if ( (t=maph.get(adapter.getValueAt(l,0)))!=null)
        y[Integer.parseInt((String)(t))][1] = adapter.getValueAt(l,1);
}
sql = "SELECT num1,num2,preference FROM Scheduler  WHERE which='j' " + hasdept +"  and semester=" + semester + "  order by num1";
k = adapter.executeQuery(sql);

if (k < 0) 
{
    out.println(adapter.error());
}                  

for (int l = 0; l < k; l++)
{
      if ( (t=maph.get(adapter.getValueAt(l,0)))!=null)
      {   
          y[Integer.parseInt((String)(t))][2] = adapter.getValueAt(l,1);
          y[Integer.parseInt((String)(t))][4] = adapter.getValueAt(l,2);
      }
}
sql = "SELECT num1,num2 FROM Scheduler  WHERE which='k' " + hasdept +"  and semester=" + semester + "  order by num1";
k = adapter.executeQuery(sql);
if (k < 0) 
{
    out.println(adapter.error());
}                  


for (int l = 0; l < k; l++)
{
     if ( (t=maph.get(adapter.getValueAt(l,0)))!=null)
         y[Integer.parseInt((String)(t))][3] = adapter.getValueAt(l,1);
}

String [][] x = new String[n][];
for (int i=0; i < n; i++)
{
    x[i] = new String[m];
    for (int j = 0; j < m; j++)
    {
       x[i][j] = ""; 
    }
}
for (int l = 0; l < k; l++)
{
     String z = y[l][3];
     if (z == null) continue;
     t =  (maps.get(z));
     if (t==null) continue;
     int j = Integer.parseInt((String)(t));
     z = y[l][2];
     if (z==null) continue;
     t =  (mapr.get(z));
     if (t==null) continue;
     int i = Integer.parseInt((String)(t));
     x[i][j] = y[l][0]+"</nobr><br>"+ y[l][4] + "/" + seats[i];
}
adapter.close();
%>
   
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <%=Toolbox.getMeta(orgnum)%> 
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
    <%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
    <link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
    <script type=text/javascript><%= Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("index.jsp","f1")%>"; 
<%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >
document.write(unifontstyle(<%=cachedstyle.fontsize%>)); 
 
function open1(x,i)
{
    var y = x.lastIndexOf("-");
    postopen('DataFormHTML',['rdap','Semester','Session','CourseId','subdb'],['Syllabusi','<%=semesterName%>',x.substring(y+1),x.substring(0,y),''],'_blank');
   // window.open("DataFormHTML?subdb=&rdap=Syllabusi&Session=" + x.substring(y+1)
   // +"&CourseId=" + x.substring(0,y) + "&Semester=<%=semesterName%>&courseTitle=", 'ss', 
   // dim(700,600) );
}
</script>
</head>
<body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 5px 5px">
 <center>
     <%=Toolbox.title(Toolbox.emsgs(orgnum,962))%> 
<TABLE cellpadding=0 cellspacing=0><tr height=5><td></td></tr></table>
<script type="text/javascript" >document.write(round1('100%'));</script>
<TABLE cellpadding=1 cellspacing=0 border=0 class=outset3 ><tr><td>
<table align=center cellpadding=1 cellspacing=1 border=0 >
<tr><td style="background:url(image/bheading.gif)"></td>
<%  for (int i = 0; i < m; i++)
 out.print("<td style=\"background:" + Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle) +"\"><b>" + slots[i].replaceAll("([A-Z])([0-9])","$1<br>$2") + "</td>");
 out.print("</tr>");
 for (int i = 0 ; i < n; i++)
 {
      out.print("<tr><td style=\"background:" + Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle) +"\"><b>" + rooms[i] +"</td>");
      for (int j = 0; j < m; j++)
         if (x[i][j].equals("")) 
             out.print("<td bgcolor=white valign=center align=center> </td>");
         else
             out.print("<td bgcolor=silver  valign=center align=center><font color=white><A href=javascript:open1('" + x[i][j].replaceFirst("<.*","") +  "')><b><nobr>" + x[i][j] +"</b></font></td>");
      out.print("</tr>");
 }
 out.print("</table>");
 
%>
</td></tr></table>
<script type="text/javascript" >document.write(round2);</script>
</center>
 <script type="text/javascript"  src=curve.js></script>     

</body></html>
        
            
