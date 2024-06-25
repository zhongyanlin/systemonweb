<%@  page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*,java.io.*" %>

<%!
class DeleteFile extends Thread
{
    String att;
    int orgnum;
    public DeleteFile(String x, int orgnum)
    {
        att = x;
        this.orgnum = orgnum;
    }
    public void run()
    {
        Encode6b encoder = new Encode6b(orgnum);
            String ta[] = Toolbox1.unzip(att).replaceFirst(",$", "").split(",");
            for (int ll=0; ll < ta.length; ll++)
            {
                try{
                String path = encoder.rto6b(ta[ll].replaceFirst("[^@]+@[0-9]+@", ""));
                (new java.io.File(path)).delete();
                }catch(Exception er){}
            }
        
    }
}

double  caldeduct(int total, CSVParse p,String [] y)
{
    String [][] q = p.nextMatrix();
    int v = 0; 
    int z = 0;
    String a = "";
    int k =0; 
    double arr[] =new double[20];
    for (k=0; k< 20; k++)
        arr[k]= 0;
    k=0;
  
    while (k < q.length && q[k].length>1) 
    {
        try{
            q[k][1] = q[k][1].replaceAll("<[^>]+>","").replaceAll(";","").replaceAll("[a-z]","").replaceAll("&","");
         
           arr[Integer.parseInt(q[k][0])] =  Double.parseDouble(q[k][1]) ;
           a += q[k][0] + "," + q[k][1] + ";";
        }catch(Exception e){}
          k++;
    }
    for (int i=1; i <=total; i++) 
    {
       v += arr[i];
    }
    if (a.equals("")) a = "1,0";
    y[0] = a.replaceFirst(";$","");
    
    return v;
}
String attach(String x,  int orgnum, String [] y)
{
     
     if (  x == null || x.equals("") ) return "";
     Encode6b encoder = new Encode6b(orgnum);
     String str = Toolbox1.unzip(x).replaceFirst(",$",""); 
     CSVParse parse = new CSVParse(str,'\'',new String[]{"@",","});
     
     String [][] ats = parse.nextMatrix();
     String atstr = "";
     
     String q = "";
     String z = "";
     for (int i=0;  i < ats.length; i++)
     {
         String xs[] = ats[i];
         if (xs.length>2) 
         {
             atstr +=  xs[0] + "  ";
             z +=  xs[0] + "@" + xs[1] + "@" + xs[2] + ",";
         }   
     } 
     y[0] = Toolbox1.zip(z); 
     return  atstr;
}

%>
<% 
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.STUDENT|Systemroles.INSTRUCTOR|Systemroles.TEACHINGADMIN |Systemroles.ASSESSER,application,session,request, response, "checkgrades.jsp", true)) == null) 
    return;
orgnum = user.orgnum; 
String course =  (Toolbox.defaultParam(orgnum,request,"course","", null, 30));
String sessionname =  (Toolbox.defaultParam(orgnum,request,"sessionname","", "-._,", 30));
String assignname =  (Toolbox.defaultParam(orgnum,request,"assignname","", "-._", 50));
String coursetitle =  (Toolbox.defaultParam(orgnum,request,"coursetitle","","&@#$+:", 200));
String subdb =  (Toolbox.defaultParam(orgnum,request,"subdb","", null, 30));
String sid  =  (Toolbox.defaultParam(orgnum,request,"sid",user.id, null, 30));
String myscore  =  (Toolbox.defaultParam(orgnum,request,"myscore","", null, 30));
String absentdeduct  =  (Toolbox.defaultParam(orgnum,request,"absentdeduct","", "<,;|>/", 500)).replaceAll("<nobr>","").replaceAll("<.nobr>","");
out.println("<!--" + absentdeduct + "-->");
CSVParse par = new CSVParse(absentdeduct,'|',new String[]{",", ";"});
String semester  =   Toolbox.defaultParam(orgnum,request,"semester",Toolbox.dbadmin[orgnum%65536].currentSemester, null, 40);
out.println("<!--"+semester+"-->");
out.println("<!--"+subdb+"-->");
out.println("<!--"+course+"-->");
out.println("<!--"+sid+"-->");
user.changedb(subdb);

String gradeletters[]  = Toolbox.dbadmin[orgnum%65536].domainValue(Toolbox.langs[orgnum>>16], "Grade",1,2).replaceFirst("[^,]+,[^,]+,", "").split(","); 

String str = "checkgrades.jsp?subdb="+Toolbox.urlencode(subdb)  + "&course=" +  Toolbox.urlencode(course) +"&sid=" + sid +"&coursetitle=" + Toolbox.urlencode(coursetitle);
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);

if (request.getParameter("updateded") != null)
{
    String sql0 = "UPDATE Session SET absentdeduct='" + absentdeduct + "' WHERE courseid='" + course + "' AND name='" + sessionname + "' AND semester='" + semester + "' AND  instructor='" + user.id +"'";
    int nn0 = adapter.executeUpdate(sql0); 
     
}
if (!adapter.error().equals(""))
{
   out.print(Toolbox.emsgs(orgnum,113) + ":" + adapter.error());
   adapter.close();
   return;
}
 
if (Toolbox.defaultParam(orgnum,request, ("histogram"), null) == null)
{
long ll = System.currentTimeMillis()/1000;
course = course.replaceAll("'","''");
  
%>
<!DOCTYPE html> 
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>

<title><%=Toolbox.emsgs(orgnum,413)%></title>
<% 
    String excuse = Toolbox.defaultParam(orgnum,request, ("excuse"), null);
    if (excuse!= null)
    {
        String sql = "";
        if (excuse.equals("")) 
        {
            sql = "select attach  FROM Absence WHERE atime=" + myscore + " AND  courseid='" + course.replaceAll("'","") + "' AND sid='" + sid.replaceAll("'","") + "' AND semester=" + semester;
            int m0 = adapter.executeQuery(sql);
            if (m0==1) 
            {
                sql =  adapter.getValueAt(0,0);
                if (sql!=null && !sql.equals(""))
                {
                    new DeleteFile(sql, orgnum).start();
                }
            }
            sql = "DELETE FROM Absence WHERE atime=" + myscore + " AND  courseid='" + course.replaceAll("'","") + "' AND sid='" + sid.replaceAll("'","") + "' AND semester=" + semester;
        }
        else
            sql = "UPDATE Absence SET excuse= '" + excuse.replaceAll("'","''") + "',justified=-1 WHERE atime=" + myscore + " AND  courseid='" + course.replaceAll("'","") + "' AND sid='" + sid.replaceAll("'","") + "' AND semester=" + semester;
        int m1 = adapter.executeUpdate(sql);
        
        if (m1 <= 0){
           sql = "INSERT INTO Absence(lastupdate,askforleave,atime,attach,excuse,justified,courseid,sid,semester,reply) VALUES(" + ll + ",1,"
                 + myscore +",'" +  Toolbox.emsgs(orgnum,1597)  + "','" +  excuse.replaceAll("'","''") + "',-1,'" + course.replaceAll("'","") + "','" + sid.replaceAll("'","") + "'," + semester + ",'')"; 
            m1 = adapter.executeUpdate(sql); 
        }
      
%></head><body><script>if (<%=m1%>==1){if ('<%=excuse%>'=='') parent.parent.frames[0].openit1('checkgrades.jsp'); else parent.closeprompt();} else parent.reshow('<%=adapter.error().replaceAll("'"," ").replaceAll("\n"," ")%>');</script></body><% 
    adapter.close();
    return;
    }
    else
{
    String attach = Toolbox.defaultParam(orgnum,request, ("attach"), null);
    if (attach!= null)
    {
        String sql = "UPDATE Absence SET attach='" + attach.replaceAll("'","''") + "',justified=-1 WHERE atime=" + myscore + " AND  courseid='" + course.replaceAll("'","") + "' AND sid='" + sid.replaceAll("'","") + "' AND semester=" + semester;
        int m1 = adapter.executeUpdate(sql);
       
        if (m1 <= 0){
           sql = "INSERT INTO Absence(lastupdate,askforleave,atime,excuse,attach,justified,courseid,sid,semester,reply) VALUES(" + ll + ",1,"
                 + myscore + ",'" +  Toolbox.emsgs(orgnum,1596) + "','"  + attach.replaceAll("'","''") + "',-1'" + course.replaceAll("'","") + "','" + sid.replaceAll("'","") + "'," + semester + ",'')"; 
            m1 = adapter.executeUpdate(sql); 
        }
    
%></head><body><script>if (<%=m1%>!=1)  parent.myprompt('<%=adapter.error().replaceAll("'"," ").replaceAll("\n"," ")%>');</script></body><% 
    adapter.close();
    return;
    }
}
%>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
 <script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("assessdata.jsp","f1")%>";</script>

<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
<link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<style> .label1{padding:4px 4px 4px 4px;background:linear-gradient(<%=cachedstyle.IBGCOLOR%>,<%=Toolbox.headercl(cachedstyle.IBGCOLOR)%>) <%=cachedstyle.IBGCOLOR%> repeat-x;font-size:20px;color:#DDCC11;text-shadow:#707070 -1px -1px;margin:0px 0px 5px 0px;border-radius:3px;width:100%}</style>
</head> 
<body style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px" >
<%=Toolbox.title( coursetitle +": " +Toolbox.emsgs(orgnum,413) )%>  

<%
int numcourses = 0;
String courseSQLstr = "SELECT Registration.grade, Registration.evaluation, Registration.evaltime, Registration.attendance   FROM  Registration,AppUser WHERE Registration.sid = AppUser.id AND AppUser.id='"+sid.replaceAll("'","''")+"' and Registration.courseid = '"+course.replaceAll("'","''")+ "' AND Registration.semester='" + semester.replaceAll("'","''") +"'";
boolean bb = adapter.executeQuery2(courseSQLstr,false);
String middlegrade = adapter.getValueAt(0,0);
if (!bb ||adapter.cursor==-2 && !subdb.equals(user.id) )
{
   out.println("There is no registration record of " + sid + " of  " + course + " in " + semester + "<br>\n");
   adapter.close();
   return;
}
boolean hasmiddle = false;
String middleeval="";
long   evaldatetime = 0;
String evaltime = "";
String abs = "";
String loginc = ""; 
String evals = ""; 
if (adapter.cursor!=-2)
{
    evals = adapter.getValueAt(0,1);
    evaltime = adapter.getValueAt(0,2);
    abs = adapter.getValueAt(0,3);
    loginc = "";//adapter.getValueAt(0,4);
    try{hasmiddle =  (evals != null && System.currentTimeMillis()/1000- Integer.parseInt(evaltime)< 7*24*3600);
    }catch(Exception e){hasmiddle = false;}
}
if (hasmiddle)
{
    middlegrade = adapter.getValueAt(0,0);
    middleeval  = adapter.getValueAt(0,1);
    try
    {
        evaldatetime = Long.parseLong(adapter.getValueAt(0,2));
    }catch(Exception e){};
}
String accessible = Toolbox.defaultParam(orgnum,request, "accessible", "",null,20);
String statusstr = "";
if (!accessible.equals("true"))
{
   statusstr = RegStatus.goodstatus(adapter,  user,  course,  sid,  subdb);
   if (!statusstr.equals(""))
   {
       out.print(statusstr + "<script type=\"text/javascript\"   src=curve.js></script></body></html>");
       adapter.close();
       return;
   }
   else
   {
      statusstr = "<script type=\"text/javascript\" >if (parent.frames.length>1) parent.frames[0].setaccessible(\"" + course +"\");</script>";
   }
}
%>
<br><center><table border=0 cellpadding=5 cellspacing=5 >
<tr ><td colspan="2" align="center"><span class="label1" style=font-color:purple ><%=Toolbox.emsgs(orgnum,1593)%></span><br><br>
<TABLE cellpadding=1 cellspacing=1 border=0 width=100% class=outset3 id="absencetbl">
    <tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>" >
        <td  align="right" >#</td>
        <td align="center"><%=Toolbox.emsgs(orgnum,1595)%> </td>
        <td><%=Toolbox.emsgs(orgnum,986)%> </td>
        <td><%=Toolbox.emsgs(orgnum,1590)%></td>
        <td colspan="2"><%=Toolbox.emsgs(orgnum,1594)%></td>
        <td align="left"><nobr><%=Toolbox.emsgs(orgnum,612)%></nobr></td>
        <td align="center"><nobr><%=Toolbox.emsgs(orgnum,1589)%></nobr></td>
</tr>
    <script> var excuses = [], attachments=[], timemoments=[];</script>        
<% 
String absentquery = "SELECT  atime,excuse,attach,justified,askforleave,reply FROM Absence WHERE sid='" + sid.replaceAll("'","''")+"' AND  courseid='"+course.replaceAll("'","''")+ "' AND semester=" + semester.replaceAll("'","''") +" ORDER BY atime";  
bb = adapter.executeQuery2(absentquery,true);
 
int nn = 0,tl=0;
String yyy[] = new String[1];
String reply;
int total = 0; 
for (int i=0; bb && adapter.getValueAt(i,0)!=null; i++)
{  
   nn++;
   String w = attach(adapter.getValueAt(i,2),orgnum,yyy);
   String exc = adapter.getValueAt(i,1); 
   if (exc == null || exc.equals("")) exc = Toolbox.emsgs(orgnum,480);
   else exc = exc.trim();
   String ded = adapter.getValueAt(i,3);
   int dn = 0; try{dn = Integer.parseInt(ded);}catch(Exception e){}
   if (dn == 0) total ++;
   ded = ded.equals("1")?("<font color=green>&check;</font>"):(ded.equals("0")?("<font color=red>&cross;</font>"):("<script>document.write(textmsg[236]);</script>"));
   tl += dn;
   %>
   <script> excuses[<%=i%>] = "<%=Generic.handle(exc)%>";
       attachments[<%=i%>] = "<%=(yyy[0]==null)?"":yyy[0]%>";  
       timemoments[<%=i%>] = "<%= adapter.getValueAt(i,0)%>";
       var none = "<%= Toolbox.emsgs(orgnum,480)%>";
   </script>
   <tr style="background:<%=cachedstyle.TBGCOLOR %>"
       ><td  align="right" ><%=i+1%></td>
       <td align="center"><%=adapter.getValueAt(i,4).equals("1")?"<font color=green>&check;</font>":"<font color=red>&cross;</font>" %></td>
       <td><nobr><%=Toolbox.timestr(Long.parseLong(adapter.getValueAt(i,0)))%> </nobr></td>
       <td style="color:blue" onclick="modify(<%=i%>,this,'<%= Toolbox.emsgs(orgnum,1590)%>')">
           <span style="width:200px;overflow: hidden"><%=  Toolbox.formatstr("0",exc).replaceFirst("<br>.*","")%></span>
       </td>
       <td style="color:blue;border-right-width:0px" onclick="attach(<%=i%>,this)"><%=w%></td>
       <td style="color:blue;border-left-width:0px;border-right-width:0px" onclick="attachmore(<%=i%>,this)">[+] 
        <input type="hidden" value="<%=(yyy[0]==null)?"":yyy[0]%>" id="att<%=i%>" ></td>
       <td align="left" ><%=adapter.getValueAt(i,5)%></td>
       <td align="center"><%=ded%></td>
</tr>
       
   <%
       
}
String yr[] = new String[1];
double deductpoint = caldeduct(total,par,yr); 
 
absentdeduct = yr[0];
//if (nn>0)
{
   %>
  <tr  style="background:<%=cachedstyle.TBGCOLOR %>"><td></td><td></td><td></td><td></td><td colspan="1" align="right"><%= Toolbox.emsgs(orgnum,1600)%></td><td><%=total%></td>
     <td align="right" style="color:blue" onclick="whydeduct('<%= Toolbox.emsgs(orgnum,1602)%>;<%=absentdeduct%>')"><%= Toolbox.emsgs(orgnum,1601)%></td><td  style="color:red" align="center"><%=deductpoint%></td>
 </tr>
 <tr><td colspan="8" align="center"><input class="GreenButton"  id="newask" value="<%=Toolbox.emsgs(orgnum,1595)%>" type="button" onclick="newa(<%=nn%>,this)" ></td></tr>
 <!--tr style="background:<%=cachedstyle.TBGCOLOR %>">
     <td  align="right"  style="color:blue" onclick="newa(<%=nn%>,this)"><%= Toolbox.emsgs(orgnum,34)%></td>
     <td align="center"><font color=green>&check;</font></td>
     <td ><select id="leavetime" style=color:blue;font-size:16px;font-weight:700 onchange="goodtime(this)"><option><%= Toolbox.emsgs(orgnum,206)%> <%=Toolbox.emsgs(orgnum,986)%></option></select></td>
       <td style="color:blue" onclick="modify(<%=nn%>,this,'<%= Toolbox.emsgs(orgnum,1590)%>')"><span style="width:200px;overflow: hidden"><%= Toolbox.emsgs(orgnum,1596)%></span></td>
       <td style="color:blue" onclick="attach(<%=nn%>,this)"><%= Toolbox.emsgs(orgnum,1597)%></td>
       <td style="color:blue" onclick="attachmore(<%=nn%>,this)">[+] 
        <input type="hidden" value="" id="att<%=nn%>" ></td>
     <td align="left"></td>
     <td align="center"  ></td>
 </tr--> 
</table>
<form rel=opener name=ff enctype="multipart/form-data" method="post" action="UploadTeaching"    >
    <input onchange=uploadf() name="localpath" type="file"   style="visibility:hidden">
    <input name="subdb" value="<%=subdb%>" type="hidden">
    <input name="subfolder" value="submission" type="hidden">
    <input name="iid" value="<%=subdb%>" type="hidden">
    <input name="course" value="<%=course%>" type="hidden">
    <input name="sid" value="<%=sid%>" type="hidden">
</form>
<script src="attachment.js"></script> 
 </td></tr>
   <%
}
 
String header = "<tr style=\"background:" + Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle) +"\"><td><b>" + Toolbox.emsgs(orgnum,223) +"</td><td align=center><b>"+Toolbox.emsgs(orgnum,236)+"</td><td align=right><b>" + Toolbox.emsgs(orgnum,254) +"</td><td align=right><b>" +Toolbox.emsgs(orgnum,320) +"</td></tr>";

int j = 40;
 
%>
<tr>
<%
if (hasmiddle) 
{ 
%>
 <td   valign=top width="50%"   align=center > 
<span class="label1" style=font-color:purple ><%=Toolbox.emsgs(orgnum,228)%></span><br><br>

 <%=Toolbox.emsgs(orgnum,416)%>: <%=Toolbox.timestr(evaldatetime)%><br>
  
<TABLE cellpadding=1 cellspacing=1 border=0 width=100% class=outset3 >
<%=header%>
<%
String [] st =  middleeval.split("\n");
for (int i = 1; i < st.length; i++)
{ 
    String [] x = st[i].trim().split("\\s+");
    int l = x.length;
    out.println("<tr bgcolor=" + cachedstyle.TBGCOLOR + ">");
    if (l >= 3)
    {
        out.print("<td>");
        for (int m = 0; m < l-3; m++)
           out.print(x[m] + " ");
        out.print("</td><td align=center>" + x[l-3] + "</td><td align=right>" + x[l-2] + "</td><td align=right>" + x[l-1] + "</td></tr>"); 
    }
    //else
    //   out.print("<td colspan=4>" + st[i] +"</td></tr>");
}
%>
</TABLE>
 
<%=Toolbox.emsgs(orgnum,241)%><b> <%=middlegrade%> </b>
</td>
<% 
} 
%>

 
<td align=center width=%50 valign=top>
<span class="label1" style=font-color:purple ><%=Toolbox.emsgs(orgnum,921)%></span><br><br>
 <% if (semester.equals(Toolbox.dbadmin[orgnum%65536].currentSemester)) {%>
 <%=Toolbox.emsgs(orgnum,416)%>: <%=Toolbox.timestr()%><br>
 <%}else out.println(semester); %>
 <div class="outset1">
<table cellpadding=3 cellspacing=1  id="maintbl" width=100% class=outset3 >
<tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>" >
<td><nobr><b><%=Toolbox.emsgs(orgnum,223)%></b></nobr></td>
<td align=center><nobr> <b><%=Toolbox.emsgs(orgnum,236)%>/<%=Toolbox.emsgs(orgnum,1145)%></b></nobr></td>
<td align=right><nobr><b><%=Toolbox.emsgs(orgnum,254)%>%</b></td>
<td align=left><nobr><b><%=Toolbox.emsgs(orgnum,1452)%></b></td> 
<td align=center style="font-weight:bold;width:100px"><nobr><b><%=Toolbox.emsgs(orgnum,627)%></b></nobr></td>

<td align=center style="font-weight:bold"><nobr><b><%=Toolbox.emsgs(orgnum,240)%></b></nobr></td>
</tr>
<%
String gradeSQLstr = "select distinct   grade, threshhold from Gradethresh WHERE  system=" + Toolbox.dbadmin[orgnum%65536].gradeSystem + " and course='" + course + "' AND session='" + sessionname + "' AND  semester='" + semester.replaceAll("'","''") +"' order by  -threshhold";
int numrecords = 0;
bb = adapter.executeQuery2(gradeSQLstr,false);
float threshs[] = new float[gradeletters.length];
for (int i=0; bb &&   adapter.getValueAt(i,0)!=null; i++) 
{
    numrecords++;
    String x = adapter.getValueAt(i,0).trim();
    for (int k=0; k < gradeletters.length; k++)
    {
        if (x.equals(gradeletters[k]))
        {
           try{ threshs[k] = Float.parseFloat(adapter.getValueAt(i,1).trim()); }
           catch(Exception e){ }
        }
    }
}
for (int k=0; k <  gradeletters.length; k++)
{
    if (threshs[k] == 0.0 )
    {
        if (k==5) threshs[5] = 90;
        else if (k==4) threshs[4] = 85;
        else if (k==3) threshs[3] = 75;
        else if (k==2) threshs[2] = 65;
        else if (k==1) threshs[1] = 45;
        
    }
 
}
int numgrades = 0;
String query =  "SELECT Assignment.name, Submission.grade, Assignment.scale, Assignment.weight, Assignment.start, '0', Assignment.due, Submission.submtime,0 from Assignment LEFT join Submission on Assignment.name=Submission.assignname AND Assignment.course=Submission.course  AND Assignment.semester=Submission.semester where (Assignment.sessionname='" 
        + sessionname + "' OR Assignment.sessionname LIKE '%," 
        + sessionname + "' OR Assignment.sessionname LIKE '" 
        + sessionname + ",%' OR Assignment.sessionname LIKE '%," 
        + sessionname + ",%'  )  and Assignment.course = '" 
        + course.replaceAll("'","''")+"' AND Assignment.semester='" 
        + semester.replaceAll("'","''") +"' AND (NOT Assignment.question='') AND (NOT Assignment.status=3 OR (" + ll + "-Assignment.lastupdate)>24*60)   AND Submission.sid='" 
        + sid.replaceAll("'","''")+"' and  Submission.grade >= -1   UNION ";
query += "SELECT  Assignment.name, 0, Assignment.scale, Assignment.weight, Assignment.start, '1',Assignment.due,0,Assignment.latepermit from Assignment  where Assignment.due < " 
        + System.currentTimeMillis()/1000 + " AND  (Assignment.sessionname='" 
        + sessionname + "' OR Assignment.sessionname LIKE '%," 
        + sessionname + "' OR Assignment.sessionname LIKE '" 
        + sessionname + ",%' OR Assignment.sessionname LIKE '%," 
        + sessionname + ",%'  ) AND Assignment.semester='" 
        + semester + "'  and Assignment.course = '" 
        + course.replaceAll("'","''")+"'  AND (NOT Assignment.question='')  AND (NOT Assignment.status=3 OR (" + ll + "-Assignment.lastupdate)>24*60) AND  Assignment.name NOT IN (SELECT assignname FROM Submission WHERE  sid='"
        + sid.replaceAll("'","''")+"' AND course='" 
        + course.replaceAll("'","''")+"' and  Submission.semester='" 
        + semester.replaceAll("'","''") +"')  ORDER BY 5;";
       
 bb = adapter.executeQuery2(query,false); 
if (bb == false)
{
   
}
float scoresum = 0.0f; 
float scalesum = 0.0f; 
float weightsum = 0.0f;
int countd = 0, countm=0;
float extrapoint = 0;

for (int i = 0; bb && adapter.getValueAt(i, 0)!=null; i++)
{
   numgrades++;
   str = adapter.getValueAt(i, 0);
   String score = adapter.getValueAt(i,1);
   String scale = adapter.getValueAt(i,2);
   String weight = adapter.getValueAt(i,3);
   String missed = adapter.getValueAt(i,5); 
   String due = adapter.getValueAt(i,6);
   String subm = adapter.getValueAt(i,7); 
   String latepermit =  adapter.getValueAt(i,8);
   long delay = 0; 
   String timestr = ""; 
   if (missed.equals("1")) 
   {
       if (latepermit.indexOf(sid)>=0)
       {
          long [] dues = new long[1];
          dues[0] = Long.parseLong(due);
          float ff = Toolbox1.extent(latepermit, sid, dues);
          missed = "<font color=red>" + Toolbox.emsgs(orgnum,631) + " ex " + Toolbox.timestr(dues[0], cachedstyle.timeformat) + " </font>";
       }
       else
          missed = "<font color=red>" + Toolbox.emsgs(orgnum,631) + "</font>";
       score = "0";
       try{float zz = Float.parseFloat(weight);
       if (zz >=0 && zz<=100)countm++;}catch(Exception e){}
       
   }
   else 
   {
       missed = "";
       try{ delay = Long.parseLong(subm) -  Long.parseLong(due);
       if (delay <= 0) 
           delay = 0;
       else
       {
           
           delay = delay/3600;
             
           if (delay>=24)
           {
               timestr += (delay/24) + " days ";
               delay = delay%24;
               
           }
           if (delay > 0)
               timestr = timestr + delay + " hours";
           
           if (!timestr.equals("")) 
               countd++;
       }
      }catch(Exception e){}
   } 
   float xx = -1;
   try{
       xx = Float.parseFloat(score);
       float yy = Float.parseFloat(scale);
       float zz = Float.parseFloat(weight); 
       if (xx >=0 && yy > 0 && zz<=100 && zz>=0)
       {
           if (xx > yy){ xx = yy; score = ""+ yy;}
           
           scoresum += xx*zz/yy ;
      // scalesum += yy*zz ;
       weightsum += zz;
       }
       else if (yy == 0 && zz <= 100 && zz>= 0)
       {
          scoresum += xx ; 
          yy = xx;
          weightsum += zz;
       }
       else if (zz > 100 || zz < 0) 
       {
          extrapoint += xx>yy?yy:xx ; 
          if (xx>yy) xx = yy;
       }
       
   }catch(Exception e){}
   float w = Float.parseFloat(weight);
   
   String dl = timestr; 
   if (!missed.equals("") && (w < 0 || w > 100))
       ;
   else
   out.println("<tr bgcolor=" + cachedstyle.TBGCOLOR + "><td ><a href=\"javascript:openass('" + str + "'," + (!missed.equals("")) + ")\"><nobr>"   + str.replaceAll(" ","&nbsp;") +  "</nobr></a></td><td  align=center>" 
           + (xx >=0?(score   + "/" + scale):Toolbox.emsgs(orgnum,505))  + " </td><td  align=right>" +   ((w<0||w>100)?Toolbox.emsgs(orgnum,1558):weight)   + "</td>"
           + "<td style=white-space:nowrap>" + (!missed.equals("")?missed: dl) + "</td>"
           + (missed.equals("")? ("<td align=center onclick=\"graded('" + str + "')\">&gt;&gt;</td>"):("<td align=center>"+ (sid.equals(user.id)?"":"<span style=color:blue onload=\"this.innerHTML=textmsg[1574]\" onclick=\"extenddue('" + str + "'," + (i+1) + ")\"  >Late Permit</span>")+ "</td>")) 
           + (xx < 0? ("<td align></td>"):("<td align=center  onclick=\"histogram('" + str + "'," + score + "," + scale + ")\"> &gt;&gt; </td>")) + "</tr>");
}
String estimategrade = "";

float normalized = 0.0f; 
 
if (weightsum!=0.0f) 
{
    normalized = scoresum/weightsum*100.0f - (float)(deductpoint);
    int kk = threshs.length-1; 
    while (kk>0) 
    if (normalized>=threshs[kk]) 
    {
        
         estimategrade = gradeletters[kk];
         break;
    }
    else
    {
         kk--;
         estimategrade = gradeletters[0];
    }
        

out.println("<tr bgcolor=" + cachedstyle.TBGCOLOR + "><td style=color:blue onclick=\"animateinit();animate1()\">"   + Toolbox.emsgs(orgnum,225) +  "</td><td  align=center><b>" + Math.round(10*scoresum)/10.0f     
   + "</b></td><td  align=right><b>" + Math.round(weightsum*10)/10.0 
   + "</b></td><td >" + (countd==0?"":("<font color=black>" + countd +"</font>")) + (countm==0?"":(" <font color=red>" + countm + "</font>")) 
        +  "</td><td  onclick=\"graded('')\" align=center><span > &gt;&gt;</span></td><td align=center    onclick=\"histogram(''," + scoresum  + "," + weightsum  + ")\"> &gt;&gt; </td></tr>");
} 


%>
</table>
</div>
<br>
<div class="outset3"
     <% if (estimategrade.equals("") == false){ if (weightsum!=100){%><%=Toolbox.emsgs(orgnum,1537)%><b><%=Math.round(100*scoresum)/100.0f%>/<%=Math.round(100*weightsum)/100.00%>  <%= deductpoint == 0.0?"":(" - <font color=red>" + (Math.round(10*deductpoint)/10.0) + "</font>") %> <%= extrapoint>0?(" + " + (Math.round(10*extrapoint)/10.0)+"(" + Toolbox.emsgs(orgnum,1558) +")") :""%> = <%=Math.round((normalized + extrapoint-deductpoint)*10)/10.0%>/100  <%} else {%> <%=Math.round(normalized*10)/10.0%>/100 <%} %></b>  <%=Toolbox.emsgs(orgnum,1538)%>:<b><%=estimategrade%></b><br><%}%>
 
 

<%
long tstmp = System.currentTimeMillis()%10000000;
 
JDBCAdapter madapter = Toolbox.getSysAdapter(orgnum);
madapter.executeQuery2("SELECT logincount FROM AppUser WHERE id='" + sid.replaceAll("'","''") +"'",false); 
loginc =  madapter.getValueAt(0,0);
if (loginc==null || loginc.equals(""))
{
    madapter.executeUpdate("Update User SET logincount=1 WHERE id='" + sid.replaceAll("'","''") +"'");
    loginc="1"; 
}
//out.println(Toolbox.emsgs(orgnum,1122) +" <b>" + abs + "</b> " + Toolbox.emsgs(orgnum,1123) + " &nbsp;&nbsp;&nbsp;");
out.println(Toolbox.emsgs(orgnum,39) +" <b>" + loginc + "  " + Toolbox.emsgs(orgnum,1123) + "</b> &nbsp;&nbsp;&nbsp;");
 
madapter.close();
%>
 
</div>



</td></tr>
<tr> 
        <td colspan="2" id="histogram" align="center" style="background-color:white;border-radius:4px">
            
        </td>     
    </tr>

</table>
<%=statusstr%> 

<script type="text/javascript"  src=curve.js></script>
<script type="text/javascript">

var msg1600 = "<%= Toolbox.emsgs(orgnum,1600)%>";  
var msg1601 = "<%= Toolbox.emsgs(orgnum,1601)%>";
var userissid = <%=(sid.equals(user.id))%>;    
var tstmp = <%=tstmp%>;
var sid= '<%=sid%>';
var courseid= "<%=course%>";
var semester = "<%=semester%>";
var subdb = "<%= subdb%>";
var pending = "<%=Toolbox.emsgs(orgnum,814)%>";
var timeformat = "<%= cachedstyle.timeformat%>";
var N = excuses.length;
excuses[N] = "";
var params = [courseid, "<%=sessionname%>","<%=coursetitle%>",subdb, sid, "<%=myscore%>", "","1"];
attachments[N] = "";
timemoments[N] = ""; N++;
var deductpoint = <%= deductpoint%>;
var sessionname = '<%=sessionname%>';
var missed = "<%=Toolbox.emsgs(orgnum,631)%>";
var option0 = "<%= Toolbox.emsgs(orgnum,206)%> <%=Toolbox.emsgs(orgnum,986)%>";
</script>
<script type="text/javascript" src="timeformat.js"></script>
<script type="text/javascript" src="printschedule.js"></script>
<script type="text/javascript" src="checkgrades.js"></script>
<form rel=opener  name="h" action="checkgrades.jsp" target="w<%=tstmp%>" method="post">
<input type="hidden" name="option"    value="des" >    
   
<input type="hidden" name="course"    value="<%=course%>" >
<input type="hidden" name="semester"  value="<%=semester%>" >
<input type="hidden" name="sessionname"   value="<%=sessionname%>" >
<input type="hidden" name="assignname"  value="" >
<input type="hidden" name="sid"         value="<%=sid%>" >
<input type="hidden" name="histogram"   value="1" >
<input type="hidden" name="myscore"   value="<%= myscore %>" >
<input type="hidden" name="subdb"   value="<%=subdb%>" >
<input type="hidden" name="makescript"  value="makesubmission" >
<input type="hidden" name="extension"  value="0" >
<input type="hidden" name="total"  value="0" >
<input type="hidden" name="rdap"        value="studentsubmission<%=(sid.equals(user.id))?"":"ins"%>"  >
<input type="hidden" name="coursetitle"        value="<%=Toolbox.defaultParam(orgnum,request,"coursetitle","", "_#&$-+=|[]:\"';/",200)%>" >
</form>
</center>
<iframe frameborder=2 name="w<%=tstmp%>"  width=1 height="1" style="visibility: hidden" ></iframe>
<div id="copyright" style="text-align:center;color:#4d5ddd;font-size:12px"> 
<%= Toolbox.copyright[orgnum>>16]%> 
</div>

</body>
</html>


<%} else{ 
String query = "";
String totalweight = Toolbox.defaultParam(orgnum,request, "total", "100");
if (assignname.equals("")==false) 
{
   query = "SELECT  Submission.grade," + totalweight + ", Registration.sid FROM"

+ " Registration LEFT JOIN (Submission LEFT JOIN Assignment on Submission.course=Assignment.course AND Submission.semester=Assignment.semester AND Submission.assignname=Assignment.name) ON Registration.courseid=Submission.course AND Registration.semester=Submission.semester AND Registration.sid=Submission.sid "
                + " WHERE (NOT Assignment.question='') AND Submission.grade >= 0  And Submission.course ='" + course +"'"
                + " AND Assignment.semester='" + semester.replaceAll("'", "''") + "'"
                + " AND (Assignment.sessionname = '" + sessionname +"' OR Assignment.sessionname LIKE '%" + sessionname +"' OR  Assignment.sessionname LIKE '" + sessionname +"%' OR  Assignment.sessionname LIKE '%" + sessionname +"%') AND Registration.sessionname='" + sessionname +"' AND Assignment.name='" + assignname + "'";
 
}
else 
{
   
   query =   "SELECT SUM( Submission.grade*Assignment.weight/Assignment.scale)," + totalweight + ", Submission.sid FROM Assignment, Submission  "
                + " WHERE   (NOT Assignment.question='') AND Submission.grade>=0 AND (NOT Assignment.scale=0) AND Assignment.due < " + (System.currentTimeMillis()/1000) + "  AND   Assignment.course=Submission.course  and Submission.course ='" 
+ course +"'"
                + " AND   Submission.semester=Assignment.semester  AND Assignment.semester='" 
+ semester.replaceAll("'", "''") + "'"
                + " AND (Assignment.sessionname = '" 
+ sessionname +"' OR Assignment.sessionname LIKE '%" 
+ sessionname +"' OR  Assignment.sessionname LIKE '" 
+ sessionname +"%' OR  Assignment.sessionname LIKE '%" 
+ sessionname +"%')   AND Assignment.name=Submission.assignname GROUP BY Submission.sid UNION "
                + " SELECT 0, " 
+ totalweight + ", Registration.sid FROM Registration WHERE Registration.courseid='" 
+ course + "' AND sessionname='" 
+ sessionname + "' AND semester='" 
+ semester + "' AND  Registration.sid NOT IN (SELECT Submission.sid FROM Assignment, Submission WHERE  (NOT Assignment.question='') AND  Assignment.course=Submission.course  AND Submission.course='"   
+ course + "'  AND (Assignment.sessionname = '" 
+ sessionname +"' OR Assignment.sessionname LIKE '%" 
+ sessionname +"' OR  Assignment.sessionname LIKE '" 
+ sessionname +"%' OR  Assignment.sessionname LIKE '%" 
+ sessionname +"%') AND Submission.semester=Assignment.semester AND Assignment.semester='" 
+ semester + "' AND Assignment.name=Submission.assignname  AND Assignment.due < " + (System.currentTimeMillis()/1000) + "  )";  
 
}

%>
<!DOCTYPE html> 
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<script>

var scores = [<%
if(  adapter.executeQuery2(query,false) )
{
String sc;
int i=0;
while ( (sc=adapter.getValueAt(i,0)) != null)
{
   if (i>0) out.print(",");
   out.print(sc);
   i++; 
}
}
 
adapter.close();
%>];
</script>        
</head><body onload="parent.drawfig(scores)"> </body></html>        
<%}%>
