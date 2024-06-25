<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum,  Systemroles.INSTRUCTOR|Systemroles.TEACHINGADMIN |Systemroles.ASSESSER,application,session,request, response, "analyzedata.jsp", true)) == null) 
    return;
String mutex = (String)session.getAttribute("analymutex"); 
if (mutex != null)
{
   out.println("Now processing " + mutex + ". Please wait");
   return;
}
orgnum = user.orgnum; 
String course =  (Toolbox.defaultParam(orgnum,request,"cid",null, null, 30)); 
if (course == null) return;
String sessionname =  (Toolbox.defaultParam(orgnum,request,"sessionname","", "-._", 30));
String subdb =  (Toolbox.defaultParam(orgnum,request,"subdb",user.id, null, 30));
String semester  =   Toolbox.defaultParam(orgnum,request,"semester",Toolbox.dbadmin[orgnum%65536].currentSemester, null, 40);
//session.setAttribute("analymutex", course + "-" + sessionname + "-" + semester);  
user.changedb(subdb);
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (!adapter.error().equals(""))
{
   out.print(Toolbox.emsgs(orgnum,113) + ":" + adapter.error());
   adapter.close();
   return;
}
String way = "";
if (course!=null)
course = course.replaceAll("'","''");
String thresh = request.getParameter("thresh");
String theurl =  Toolbox1.geturl(request);
 
if (thresh!=null)
{
int gradesystem = Toolbox.dbadmin[orgnum%65536].gradeSystem;
String query = "SELECT  grade, numericvalue  FROM Gradethresh"
              + " WHERE course='" + course + "' AND system=" + gradesystem 
              + " AND semester='"+ semester +"' AND session='" 
              + sessionname + "' order by -numericvalue"; 
 
int n = adapter.executeQuery(query);
StringBuffer s = new StringBuffer("{");
for (int i=0; i < n; i++)
{
    s.append("\"" + adapter.getValueAt(i,0) + "\":" + adapter.getValueAt(i,1));
    if (i < n-1) s.append(",");
    else s.append("}");
}
adapter.close();
session.removeAttribute("analymutex");
%>
<html><script>
parent.grade2gpa = <%=s.toString()%>; 
parent.makemap();
</script></html>
<%
return;
}
adapter.executeUpdate("DROP TABLE Tempcount");
String sql = "CREATE TABLE IF NOT EXISTS Tempcount(sid VARCHAR(20),lastname  VARCHAR(50),firstname  VARCHAR(50),counttime INTEGER,countstart INTEGER,countsubmit INTEGER,countquiz INTEGER, answerorder INTEGER, grade VARCHAR(20), absence INTEGER, PRIMARY KEY (sid))";
adapter.executeUpdate(sql);
sql =  "INSERT INTO Tempcount(sid,lastname,firstname,counttime,countstart,countsubmit,countquiz,answerorder,grade,absence) SELECT  Registration.sid,AppUser.lastname,AppUser.firstname,0,0,0,0,0,Registration.grade,0 FROM AppUser, Registration WHERE  Registration.sid=AppUser.id AND " 
        + " Registration.semester='" 
        + semester.replaceAll("'","''") +"' AND Registration.courseid='" 
        + course.replaceAll("'","''") +"'  and  Registration.sessionname = '" 
        + sessionname.replaceAll("'","''")+"'"; 
int nn = adapter.executeUpdate(sql);

sql = "SELECT sid, COUNT(*) FROM Absence WHERE  courseid='"  + course.replaceAll("'","''") +"' AND semester=" + 
       semester.replaceAll("'","''") +"  GROUP BY sid"; 
nn = adapter.executeQuery(sql); 
 
HashMap<String,String> abs = new HashMap();

for (int j=0; j < nn; j++) 
{ 
   abs.put(adapter.getValueAt(j,0),adapter.getValueAt(j,1)); 
    
}

nn = adapter.executeQuery("select distinct sid,grade FROM Tempcount"); 
TreeSet<String> set = new TreeSet();
for (int j=0; j < nn; j++) 
{ 
   set.add(adapter.getValueAt(j,0)); 
 //  out.println(adapter.getValueAt(j,1) + "<br>");
}
String  query = "SELECT Submission.sid,Submission.content  FROM Submission LEFT JOIN Assignment ON Assignment.course=Submission.course AND Assignment.semester=Submission.semester AND Assignment.name=Submission.assignname WHERE Submission.semester='"
        + semester +"' AND Assignment.course='" 
        + course +"' AND  Assignment.sessionname='"  
        + sessionname + "' AND Assignment.atype=4 order by Submission.sid";
 
boolean bb = adapter.executeQuery2(query,false);
int countq = 0;
HashMap<String,Integer> map = new HashMap();
HashMap<String,Double> map1 = new HashMap();
 
int i = 0, ordercount=0, ordersum=0, count=0,max=0;
String oldsid = "";

if (bb)
while (true)
{
    String sid = adapter.getValueAt(i,0);
    if (sid != null && set.contains(sid) == false){ i++;continue;} 
    if (sid == null || !sid.equals(oldsid) && !oldsid.equals("")) 
    {
        map.put(oldsid,count); 
        if (ordercount>0) map1.put(oldsid,  ordersum/(double)(ordercount)); 
        max++;
        ordercount=ordersum=count=0;
    }
    if (sid == null) break;
   
    count++;
    String detail = adapter.getValueAt(i,1); 
    CSVParse p = new CSVParse(detail, '\'',new String[]{",","\n"});
    String [][] m = p.nextMatrix();
    for (int r=0; r < m.length; r++)
    if (m[r].length>5)
    try
    {
        int j = Integer.parseInt(m[r][2]);
        if (j>0){ ordersum += j;ordercount++;}
    }
    catch(Exception e){
       
    }
    oldsid =sid; 
    i++;
}
HashMap<String,Integer> w = new HashMap();
if (map1.size()>0)
{
  for (String s:map1.keySet())
  {
      int n1 =0;
      double d = map1.get(s).doubleValue();
      for (String t:map1.keySet())
      {
         if (d > map1.get(t).doubleValue()) n1++;
      }
      w.put(s, n1);
  }
} 
 

query =  "SELECT Tempcount.sid,Subactivity.activities  FROM Tempcount LEFT JOIN Subactivity on Tempcount.sid=Subactivity.sid AND " 
        + " Subactivity.semester='" 
        + semester.replaceAll("'","''") +"' AND Subactivity.course='" 
        + course.replaceAll("'","''") +"'  ORDER BY 1"; 
bb = adapter.executeQuery2(query,false);
 
int countt =0, counts=0, countm = 0;
oldsid = "";
String sid="";
int k = 0;
i = 0;
ArrayList<String> sqls = new ArrayList(80);
if (bb)
while (true)
{
    sid = adapter.getValueAt(i,0);
    String detail = adapter.getValueAt(i,1); 
    if ((sid==null || !sid.equals(oldsid)  ) && !oldsid.equals(""))
    {
       Integer n1 =  map.get(oldsid); 
       if (n1 == null) n1 = 0;
       Integer n2 =  w.get(oldsid);
       String abstime = abs.get(oldsid);
     
       StringBuffer sb = new StringBuffer(400);
       sb.append("UPDATE Tempcount SET ");
       if (abstime!=null){ sb.append("absence=");sb.append(abstime); sb.append(","); }
       sb.append(" counttime="); sb.append(countt/60); 
       sb.append(", countstart=");   sb.append(counts);
       sb.append(", countsubmit=");  sb.append(countm);
       sb.append(", countquiz=");    sb.append(n1==null?0:n1.toString());
       sb.append(", answerorder=");  sb.append(n2==null ? nn :(n2.intValue() + 1));
       sb.append("  WHERE sid='");  sb.append(oldsid); sb.append("'");   
       sqls.add(sb.toString());
      /* sqls.add("UPDATE Tempcount SET " + (abstime==null?"":("absence=" + abstime + " AND " )) + " counttime="  + countt/60
       + ", countstart=" + counts 
       + ", countsubmit=" + countm 
       + ", countquiz="+ (n1==null?0:n1.toString())
       + ", answerorder="+ (n2==null ? nn :(n2.intValue() + 1)) + " WHERE sid='"  +oldsid +"'"); */
       countt  = counts = countm = 0;
    }
    if (sid == null) break; 
    if (detail!=null) // && detail.contains(" st,"))
    {
       detail  = detail.trim();
       String arr[] = detail.replaceFirst("[\\s|\\n]*,[\\s|\\n]*$","").split("[\\s|\\n]*,[\\s|\\n]*");
       long s=-1,en=0;
       for (int j=0; j < arr.length; j++)
       {
           String [] a = arr[j].split("[ ]+");
           if (a.length!=2) continue;
           if (a[1].equals("st")) counts++;
           else if (a[1].equals("submit")) countm++;
           try
           {
               long tm = Long.parseLong(a[0]);
               if (s==-1) 
                   s = tm;
               else  
               {
                   en = tm - s;
                   if (en <0 || en >7*24*3600) en = 0;
               }
           }catch(Exception e){}
       }
       countt += en;
    }
    
    i++;
    oldsid = sid;
}
for (String a:sqls) 
   adapter.executeUpdate(a);  

query = "SELECT distinct name,atype FROM Assignment WHERE course='" + course + "' AND Assignment.semester='" + semester + "' AND (Assignment.sessionname='" + sessionname + "' OR Assignment.sessionname LIKE '" + sessionname + ",%' OR Assignment.sessionname LIKE '%," + sessionname + "' OR Assignment.sessionname LIKE '%," + sessionname + ",%' )";
int numass = adapter.executeQuery(query);
 
ArrayList<String> testnamel = new ArrayList(),
                  assignnamel = new ArrayList(), 
                  quiznamel =   new ArrayList(); 
int n1 = 0,n2 = 0,n3 = 0;
for( i=0; i < numass; i++)
{
    
    String atype= adapter.getValueAt(i,1);
    String name = adapter.getValueAt(i,0);
    if (atype.indexOf("2")>=0 || atype.indexOf("3")>=0)
    {  
       testnamel.add(name);
       n3++;
    }
    else if (atype.indexOf("4")>=0)
    {     n2++;quiznamel.add(name);}
    else 
    {   n1++;  assignnamel.add(name);}
   
}
adapter.close();
String [] arr;
String testnames="", assignnames = "", quiznames ="";
if (testnamel.size()>0)
{
arr = new String[testnamel.size()]; testnamel.toArray(arr);
Arrays.sort(arr);
testnames =  Arrays.toString(arr).replaceAll("[\\[|\\]]",""); 
}
if (assignnamel.size() > 0)
{
arr = new String[assignnamel.size()]; assignnamel.toArray(arr);
Arrays.sort(arr);
assignnames =  Arrays.toString(arr).replaceAll("[\\[|\\]]",""); 
}
if (quiznamel.size() > 0)
{
arr = new String[quiznamel.size()]; quiznamel.toArray(arr);
Arrays.sort(arr);
quiznames =  Arrays.toString(arr).replaceAll("[\\[|\\]]",""); 
}

%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%> 
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
    <script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("announcepage.jsp","f1")%>";</script>
    <script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script>
    <script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
    <script type=text/javascript  src=cookie.js></script>
    <title><%=Toolbox.emsgs(orgnum,633)%></title>
<%=cachedstyle.toString()%>
<link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<%  out.print(Toolbox.unifontstyle(cachedstyle.fontsize,orgnum));%>    
</head>
<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px" >
         <%=Toolbox.title(Toolbox.emsgs(orgnum,1436) + ": " + course + "-" + sessionname,1) %>
  
<center>
    <table  border="1" cellspacing="4"  cellpadding="4" style="margin: 5px;border-collapse: collapse;border-color:#666;border-radius:4px; width:600px">
    <tr  bgcolor="<%=cachedstyle.BBGCOLOR %>"><td><nobr><%=Toolbox.emsgs(orgnum,816)%></nobr></td><td align="right"> # </td><td><nobr><%=Toolbox.emsgs(orgnum,213)%></nobr></td></tr>
    <tr  bgcolor="<%=cachedstyle.TBGCOLOR %>"><td  valign="top"><nobr><%=Toolbox.emsgs(orgnum,212)%></nobr></td><td  align="right" valign="top"><%=n1%></td><td valign="top"><%=assignnames.replaceAll("'","")%></td></tr>
    <tr  bgcolor="<%=cachedstyle.TBGCOLOR %>"><td valign="top"><nobr><%=Toolbox.emsgs(orgnum,1378)%></nobr></td><td  align="right"  valign="top"><%=n2%></td><td valign="top"><%=quiznames.replaceAll("'","")%></td></tr>
    <tr  bgcolor="<%=cachedstyle.TBGCOLOR %>"><td valign="top"><nobr><%=Toolbox.emsgs(orgnum,321)%></nobr></td><td  align="right" valign="top"><%=n3%></td><td valign="top"><%=testnames.replaceAll("'","")%></td></tr>
    </table>
    
    <input type="button" class="GreenButton" style="margin-top:10px;width:<%=4.5*user.fontsize%>" value="<%=Toolbox.emsgs(orgnum,1046)%>" onclick="next()" ></center>
<script>
function next()
{
    postopen("DataTable",["rdap","exbut","subdb","semester","course","sessionname","testnames"],
    ["correlation","ud","<%=subdb%>","<%=semester%>","<%=course%>","<%=sessionname%>", "<%=testnames%>"],
    "_self");
}
</script>
</body></html>   
 
       