<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%!
String scalef(String scale, float p, float n)
{
 if (p == 0.0) return "";
 p = 100*n/p;

 String scales[] = scale.split(",");
 for (int i=3; i >=0; i--)
 {
 try{ float l = Float.parseFloat(scales[i]);
 if (p >= l) return "" + (i+2);
 }catch(Exception e){}
 }
 return "1";
}
String add(String v)
{
    if (v==null || !v.contains("+"))
        return v;
    else
    {
       String [] u = v.replaceAll("\\s","").replaceAll("\n","").split("\\+");
       float x = 0;
       for (String y: u)
       {
          x += Float.parseFloat(y);
       }
       return "" + x;
    }
    
}
float addFloat(String v)
{
    float f = 0;
    if (v==null) return f;
    if( !v.contains("+"))
    try{ f = Float.parseFloat(v);}catch(Exception e){}
    String [] u = v.replaceAll("\\s","").replaceAll("\n","").split("\\+");
    
       for (String y: u)
       {
          f += Float.parseFloat(y);
       }
       return f;
}
void trim(String [] x)
{
    for (int i=0; i < x.length; i++)
       if (x[i]!=null)
           x[i] = x[i].trim();
       else
           x[i] = "";
}
String tostr(String [] row)
{
    
     String  y = row[0]  ;
        for (int j=1; j < row.length; j++)
        {
            String x = row[j];
            if (x.indexOf("|")>=0 || x.indexOf(",") >=0 || x.indexOf(";") >= 0)
                y += ",|" + x.replaceAll("\\|","||") + "|";
            else
                y += "," + x;
        }
        return y;
}
int  parseobjective(String obj, String [] X, String [] Y)
{
   Pattern p = Pattern.compile("[>|\n| |\r|\t][0-9]+[\\.| |<|\n|\r|\t]");
   obj = " " +obj;
   Matcher m = p.matcher(obj);
   
   int k=0, ii = -1;
   while ( m.find(k))
   {
       int s = m.start();
       int e = m.end();
       if (ii>=0 && ii < 40)
       {
           X[ii] = obj.substring(k,s);
           
       } 
       try
       {
           ii = Integer.parseInt(obj.substring(s,e).replaceAll("[^0-9]",""));
       }
       catch(Exception e1){ii=-1;}   
       
       k = e;
   }
   if (ii == -1)
   {
      String xxs[] = obj.split("\n");
      for (int i=0; i < xxs.length; i++)
          X[i+1] = xxs[i];
      ii = xxs.length;
   }
   else
   {
       if (k < obj.length()-1)
       {
           if (ii>=0 && ii < 40)
           X[ii] = obj.substring(k);
       }
       else
           ii--;
   }
   int ans = ii  ;
   for (k=0; k <= ii; k++)
   {
       if (X[k] == null) continue;
       
       int i = X[k].indexOf("[");
       int j = X[k].indexOf("]", i);
       
       if (i >0 && j>0)
           Y[k] = X[k].substring(i+1,j).replaceAll("(?i)abet","").replaceAll(" ","");
       else
           Y[k] = "";
       X[k] = X[k].replaceAll("\\[[^\\]]+\\]","");
   }
   return ans;
}
%>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (  (user = User.authorize(orgnum, Systemroles.INSTRUCTOR | Systemroles.TEACHINGADMIN |Systemroles.ASSESSER,application,session,request, response, "assessdata.jsp", true)) == null|| !Toolbox.verifytoken(request))
 return;
orgnum = user.orgnum; 
if ( (user = User.dbauthorize(application,session,request, response, "assessdata.jsp", true)) == null)
{
 out.print("</center><font color=white><b>You don't have a database now. A instructor should have one. Ask the System Administrator to create one for you");
 return;
}


user.changedb(user.id);
long tstmp = System.currentTimeMillis()%10000000;

String cid  =   Toolbox.defaultParam(orgnum,request,"cid","", null, 30);
String title =   Toolbox.defaultParam(orgnum,request,"title","", "&@#$+-_():", 200);
String semester =  Toolbox.defaultParam(orgnum,request,"semester",Toolbox.dbadmin[orgnum%65536].currentSemester, null, 40);
String sessionname =  Toolbox.defaultParam(orgnum,request,"sessionname","", null, 40);
String sessionname1 = sessionname.replaceAll("'","''");
String scale = Toolbox.defaultParam(orgnum,request,"scale","20,40,60,80", ",", 50);
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
<title>Assessment Data Aggregation</title>
 <script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle) %>, securitytoken="<%=Toolbox.gentoken("assessdata.jsp","f1")%>";</script>
 <script type="text/javascript" src="checkHTML.js"></script>
  
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>
</head>
<body  style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 0px 5px"   >

 <%= Toolbox.title(title)%>
 
<table align="center" cellspacing="3" cellpadding="3">
    <tr>
        <td align="left"><%=Toolbox.emsgs(orgnum,1004)%></td>
        <td align="left"><%=semester%></td>
    </tr>    
    <tr>
        <td align="left"><%=Toolbox.emsgs(orgnum,982)%></td>
        <td align="left"><%=cid%></td>
    </tr>  
    <tr>
        <td align="left"><%=Toolbox.emsgs(orgnum,983)%></td>
        <td align="left"><%=title.replaceFirst("[^:]+:","")%></td>
    </tr>    
    <tr>
        <td align="left"><%=Toolbox.emsgs(orgnum,18)%></td>
        <td align="left"><%=Toolbox.makeFullName(user.lastname,"", user.firstname)%></td>
    </tr>  
    
</table>
<%
user.changedb(user.id);
String gradesystem = "" + Toolbox.gradeSystem;
String course1 = cid.replaceAll("'", "''");
String semester1 = semester.replaceAll("'", "''");      
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
String err = adapter.error();
if (!adapter.error().equals("") && adapter.error().length() > 0)
{
    
    out.println(adapter.server +    " :"  + err  );
    adapter.close();
    return;
}
String nj = Toolbox.defaultParam(orgnum,request, "n", null);
if (nj != null)
{
    String sqln = (String)(session.getAttribute("updateass" + nj));
    
    session.removeAttribute("updateass" + nj);
    int nn = adapter.executeUpdate(sqln);
    adapter.close();
    if (nn==1)
        out.println("<script>parent.myprompt('OK');</script></body></html>");
    else
        out.println("<script>parent.myprompt('" + adapter.error() + "');</script></body></html>");
    
    return;
}
String analysis = Toolbox.defaultParam(orgnum,request, ("analysis"), null); 
analysis = Toolbox.removescript( analysis );
String improve = Toolbox.defaultParam(orgnum,request, ("improve"), null);    
improve = Toolbox.removescript(improve);
String assess = Toolbox.defaultParam(orgnum,request, ("assess"), null);    

String sql = "";
if ( analysis!=null)
{
   sql = "UPDATE Session SET assess='" + assess.replaceAll("'", "''")
       + "',  improve='" + improve.replaceAll("'", "''")
       + "', analysis='" + analysis.replaceAll("'", "''") + "' WHERE courseid='"
           + course1 +"' AND semester='"
           + semester1 +"' AND name='"
           + sessionname1 +"'";
   int n = adapter.executeUpdate(sql);
   if (n==-1)
   {%>
   <script type="text/javascript" >parent.myprompt("<%=Generic.handle(adapter.error())%>");</script>
    </body></html>
   <%
   }
   else
   {%>
   <script type="text/javascript" >parent.myprompt("<%=Toolbox.emsgs(orgnum,71)%>");</script>
    </body></html>
   <%
   }
   adapter.close();
   return;
}


int n, k = 0, i;

JDBCAdapter adapter1 = Toolbox.getSysAdapter(user.orgnum); adapter1.orgnum = orgnum;

sql = "select objective  FROM  Acaprogram  where  id= 'cis'";
String pobj = "";
n  = 0;
boolean bb = adapter1.executeQuery2(sql,false);
err = adapter1.error();
if (!err.equals("") && err.length()>0)
{
    adapter1.close();
    out.println(adapter1.server + " " +   Toolbox.emsgs(orgnum,1550) + " |"  + err + "|" +  err.length() );
    return;
}
if (bb && adapter1.getValueAt(0,0)!=null)
{
   pobj = adapter1.getValueAt(0,0).replaceAll("([\n|\r])((?i)\\([a-z|\\.]+\\))","$1<br>$2");
}
adapter1.close();



String ans = "";
int nn=-1;
int N = 40;
sql = "select Session.analysis,Session.improve,Course.objective  FROM Session,Course  where  Course.id=Session.courseid AND Session.name='"
        + sessionname1 +"' AND Session.semester='"
        + semester1 +"' AND Session.courseid='"
        + course1 + "' AND Session.instructor='"
        + user.id.replaceAll("'", "''") +"'";
n  = 0;
boolean b = adapter.executeQuery2(sql,false);
if (!b)
{
 out.println(adapter.error() );
 adapter.close();
 return;
}
analysis = adapter.getValueAt(0,0);
improve = adapter.getValueAt(0,1);
ans =  adapter.getValueAt(0,2).trim();
 
if (analysis==null || analysis.length() < 2) analysis = "";
if (improve == null || improve.length() < 2) improve = "";
if (analysis !=null)
analysis = analysis.replaceAll("(?i)<[\\/]?script[^>]*>","");
    
if (improve !=null)
improve = improve.replaceAll("(?i)<[\\/]?script[^>]*>","");

sql = "select Submission.sid, Submission.assignname, Submission.assess, Assignment.assess, Assignment.scale, Submission.grade, Assignment.start FROM Submission,  Assignment, Registration where   Registration.courseid=Assignment.course AND Registration.sessionname='" 
        + sessionname1 +"' AND Registration.semester=Assignment.semester AND Assignment.name=Submission.assignname and Assignment.course=Submission.course and Registration.sid=Submission.sid "
        + " and Submission.semester=Assignment.semester AND Assignment.semester='"
        + semester1 +"' AND (Assignment.sessionname = '"   + sessionname1 +"' OR Assignment.sessionname LIKE '"   + sessionname1 +",%' OR Assignment.sessionname LIKE '%,"   + sessionname1 +"' OR Assignment.sessionname LIKE '%,"   + sessionname1 +",%') and Submission.course ='"
        + course1 +"' and Submission.grade > -1 order by 7,2,1";
//+  "select Submission.sid, Submission.assignname, Submission.assess, Assignment.assess, Assignment.scale, Submission.grade FROM Submission, Assignment where Assignment.name=Submission.assignname and Assignment.course=Submission.course and Submission.semester=Assignment.semester AND Assignment.semester='Fall 2010' AND Assignment.sessionname LIKE '%01%' and Submission.course ='20-360' and Submission.grade > -1 order by Submission.assignname,Submission.sid AND Submission.sid='D10030303' ";
String sqlme =  "select Submission.sid, Submission.assignname, Submission.assess, Assignment.assess, Assignment.scale, Submission.grade, Assignment.start  FROM Submission, Assignment where  Assignment.name=Submission.assignname and Assignment.course=Submission.course and Submission.semester=Assignment.semester  AND Assignment.semester='"
        + semester1 +"' AND Assignment.sessionname LIKE '%"
        + sessionname1 +"%' and Submission.course ='"
        + course1  + "' and Submission.grade > -1  AND Submission.sid='"
        + user.id +"'  order by 7,2,1";
 
boolean b1  = adapter.executeQuery2(sql,false);
if (!b1)
{
 out.println(adapter.error());
 adapter.close();
 return;
}
if (adapter.getValueAt(0,0) == null)
    b1  = adapter.executeQuery2(sqlme,false);

int nq[]  =  new int[N];
int nt[]  =  new int[N];
float np[] = new float[N];
float ns[] = new float[N];
String sqla[] = new String[N];
int sqlsn = 0;
String sqlb[] = new String[N];
int sqlbn = 0;
String sqlc[] = new String[N*15];
int sqlcn = 0;

String oldass = "";
StringBuffer error = new StringBuffer();
String obs = ",";
HashMap<String,String> mapn = new HashMap();
HashMap<String,String> mapf = new HashMap();
boolean needupdate = false; 
String aa = ""; 
String aname = ""; 
String [] row = null;
int asn = 0;
String sas = "";
float maxg = 0;
StringBuffer needcare = new StringBuffer(); 
for (  i=0;  ; i++)
{
String assname  = adapter.getValueAt(i, 1);    
if ( assname==null ||i>0 && !assname.equals(oldass))
{
    if (sas.equals("") == false)
    {
        String san[] = sas.replaceFirst("@$","").split("@");
        for (int q=0; q < san.length; q++)
        {
            String maxgs = "100";
            if (maxg<=10) maxgs = "10";
            else if (maxg < 50) maxgs = "50";
            
            sqlc[sqlcn] = "UPDATE Submission SET assess=" + san[q].replaceFirst("N",  maxgs) + " AND assignname='" + aname.replaceAll("'", "''") + "' AND course ='"
       + course1 +"' and semester='"  + semester1 +"' AND (assess='' or assess is NULL)";
            sqlcn++;
           // out.println(sqlc[sqlcn-1] + "<br>");
        }
        
    }
    int [] nums = new int[mapf.size()];
    int K=0;
    boolean allnum = true;
    for (String z : mapf.keySet())
        try{nums[K++] = Integer.parseInt(z);}catch(Exception e){ allnum = false;}
    if (allnum)
    {
        Arrays.sort(nums);
    }

    String numstr[] = new String[mapf.size()];
    if (allnum == false)
    {
        K = 0;
        for (String z : mapf.keySet())
           numstr[K++] =  (z);
        Arrays.sort(numstr);
    }
    else
    {
        for (K=0; K < mapf.size(); K++)
            numstr[K] = ""+ nums[K];
    }
    CSVParse parse = new CSVParse(aa, '|', new String[]{",",";"} );
    String y = "";
    String [][] m = parse.nextMatrix(true);
    for (int j=0; j < mapf.size(); j++)
    {
        String x =   numstr[j];
        String zz = mapf.get(x).replaceFirst("\\.[0]+$","");
        if (!zz.replaceAll("[0-9|.]","").equals(""))
        {
            continue;
        }
        K = 0;
         
        while (K < m.length)
        {
            trim(m[K]);
            if (m[K].length>2 && x.equals(m[K][0])) break;
            K++;
        }
        if (K < m.length)
        {
            row = new String[m[K].length];
            row[0] = x;
            row[1] =  zz;
            row[2] = add(m[K][2]);
            if (row[2]==null || row[2].equals(""))
                row[2] = "" + (asn/3 + 1);
            for (int kk=3; kk < m[K].length; kk++)
                row[kk] = m[K][kk];
        }
        else
            row = new String[]{x, zz, "" +(asn/3 + 1)};
        
        if (y.equals("") == false)
            y += ";";
         trim(row);
         if (zz.equals("Question")==false) 
         y += tostr(row);
    }
    K = aa.indexOf("#");
    if (K > -1 && K < 5)
        y = aa.replaceFirst(";.*$",";") + y; 
    else
    {
        K = aa.indexOf("Question");
        if (K > -1 && K < 11)
        y = aa.replaceFirst(";.*$",";") + y; 
    }
    y = y.replaceFirst("[^0-9]+$","");
    if (y.equals(aa) == false)
    {
       sqla[sqlsn] = "UPDATE Assignment SET assess='" + y.replaceAll("'", "''") + "' WHERE name='" + aname.replaceAll("'", "''") + "' AND course ='"
       + course1 +"' and semester='"  + semester1 +"' AND (sessionname = '"   + sessionname1 +"' OR sessionname LIKE '"   + sessionname1 +",%' OR  sessionname LIKE '%,"   + sessionname1 +"' OR  sessionname LIKE '%,"   + sessionname1 +",%')"; 
       // out.println(sqla[sqlsn-1] + "<br>");
     
        session.setAttribute("updateass"+(sqlsn),sqla[sqlsn] );
        needcare.append("<span onclick=\"javascript:openiti" + sqlsn + "()\">" + aname + "</span>&nbsp;&nbsp;\n"); 
       
        CSVParse p = new CSVParse(y, '|', new String[]{",", ";"}); 
        CSVParse pp = new CSVParse(aa, '|', new String[]{",", ";"}); 
      /*  needcare.append("<script>function openiti" + sqlsn + "(){myprompt('<br><center><table><tr><td valign=top>" + Toolbox.emsgs(orgnum,956) + "<br>"
+ pp.html().replaceAll("'"," ").replaceFirst("<table>", "<table><tr><td colspan=3 align=center style=background:" + cachedstyle.BBGCOLOR + ">' + textmsg[469] + '</td></tr>") 
+ "</td><td valign=center>-></td><td  valign=top>" + Toolbox.emsgs(orgnum,797) + "<br>"
+ p.html().replaceAll("'"," ").replaceFirst("<table>", "<table><tr><td colspan=3 align=center style=background:" + Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle) + " >' + textmsg[744] + '</td></tr>") 
+ "</td></tr></table><br><input type=button style=width:70px class=GreenButton name=update1 value=' + textmsg[225] + ' onclick=updateass(" + sqlsn + ")></center>',null,null,'" + aname + "'+textmsg[1012]);\npromptwin.style.width='500px';}</script>"); 
  */      sqlsn++;
    }
    if (assname == null) 
    {
       try{
       adapter.transacte(sqlc, 0, sqlcn);
       }catch(Exception e1){}
       break;
    }
}
boolean newass = !assname.equals(oldass);
aname = assname;
oldass = assname;
String sa = adapter.getValueAt(i, 2); if (sa == null) sa = "";

int pos = -1, poa=-1;
nn=0;
int  scales=0, score, mapto;
String qa = "", qs="",  ps="";
float ka = 0;
Vector qv = new Vector();
int maxn = 0;
boolean validone = false;

if (newass)
{
    maxg = 0;
    sas = "";
    asn++;
    mapn = new HashMap();
    mapf = new HashMap();
    aa = adapter.getValueAt(i, 3);
    if (aa==null) aa = "";
    String [] aas = aa.split(";");
    String aaa = "";
    for (int q=0; q < aas.length; q++)
    {
        if (q>0) aaa +=";";
        aas[q] = aas[q].replaceFirst("^([^,]+),[ ]*,","$1,");
        aaa += aas[q];
    }
    if (aaa.equals(aa)==false)
    {
         sqlb[sqlbn] = "UPDATE Assignment SET assess='" + aaa.replaceAll("'", "''") + "' WHERE name='" + aname.replaceAll("'", "''") + "' AND course ='"
        + course1 +"' and semester='"  + semester1 +"' AND (sessionname = '"   + sessionname1 +"' OR sessionname LIKE '"   + sessionname1 +",%' OR  sessionname LIKE '%,"   + sessionname1 +"' OR  sessionname LIKE '%,"   + sessionname1 +",%')"; 
        //out.println("bad assessment:" + aname);
        session.setAttribute("updateass"+sqlbn,sqlb[sqlbn] );
       // out.println("<span onclick=\"javascript:openita" + sqlbn + "()\"><b>" + aname + "</b></span>"); 
        CSVParse p = new CSVParse(aaa, '|', new String[]{",", ";"}); 
        out.println("<script>function openita" + sqlbn + "(){myprompt('<br><center>" + p.html().replaceAll("'"," ").replaceAll("\"","").replaceFirst("<table", "<table border=1   ") + "<br><input type=button style=width:70px class=GreenButton name=update1 value=' + textmsg[225] + ' onclick=updateass(" + sqlbn + ")></center>',null,null,'" + aname + "'+textmsg[1012]);}</script>"); 
        sqlbn++;
    }
    CSVParse parse = new CSVParse(aa, '|', new String[]{",",";"} );

    needupdate = false;
    
    while ( (row = parse.nextRow()) != null )
    {
        if (row.length < 2)continue;
        trim(row);
        if (row[0].equals("#") || row[0].equals("Question") || row[0].equals(""))
        {
            continue;
        }
        mapf.put(row[0],row[1]);
        
        if (row.length > 2)
        {
            if (row[2].length()!= 0)
            {
                mapn.put(row[0], row[2]);
                String xs[] = row[2].split("[ ]*[,|\\.|;|\\|| ][ ]*");
                for (int l=0; l < xs.length; l++)
                   if (!obs.contains("," + xs[l] + ",") )
                       obs += xs[l] + ",";
            }
        }
    }
}
HashMap<String,String> scalen = new HashMap();
HashMap<String,String> scoren = new HashMap();



CSVParse parse = new CSVParse(sa, '|', new String[]{",",";"} );
float t1, t2; 
int nqs = 0; 
while ( (row = parse.nextRow()) != null )
{
    if (row.length < 2)continue;
    trim(row);
    if (row[0].equals("#")|| row[0].equals("Question") || row[0].equals(""))
      continue;
    try{ 
        t1 = Float.parseFloat(row[1]);
        t2 = addFloat(row[2]); 
        if (t2 > t1)
        {
            t2 = t1;
            row[2] = "" + t1; 
        }
        nqs++;
        qv.addElement(row[0]);
        scoren.put(row[0], row[2]);
        scalen.put(row[0], row[1]);
        
    }catch(Exception e){}
    
      
    String xx = mapf.get(row[0]); 
    float f1 = 0;
    try{ f1 = Float.parseFloat(xx);}catch(Exception e){}
    float f2 = 0;
    try{ f2 = Float.parseFloat(row[1]);}catch(Exception e){}
    if (f2 > f1)
    {
        mapf.put(row[0], row[1]);
    }
}
float cg = 0.0f; 
try{cg = Float.parseFloat(adapter.getValueAt(i, 5));}catch(Exception e){}
if (maxg < cg) maxg = cg; 
if (nqs == 0 && !aa.equals(""))
{
    sas += "'#,Scale,Points;1,N," + adapter.getValueAt(i, 5) + "' WHERE sid='" + adapter.getValueAt(i, 0) + "'@";
} 



    

 
boolean counted[] = new boolean[N];
for ( int j=0; j < qv.size(); j++)
{
 String question = (String)(qv.elementAt(j));
 String goals = (String)mapn.get(question);
 if (goals == null || goals.equals("")) continue;
 String [] gs = goals.trim().split("[ ]*[,|\\.|;|\\|| ][ ]*");
 for (int l=0; l < gs.length; l++)
 {
     int r = 0;
     try{ r= Integer.parseInt(gs[l]);}catch(Exception e){continue;}
     if (r >=  N) continue;
     String pt = (String)(scalen.get(question));
     String st = (String)(scoren.get(question));
     try
     {
         np[r] += Float.parseFloat(pt);
         ns[r] += Float.parseFloat(st);
         if (newass)
         {
             nq[r]++;
         }
         if (counted[r]==false)
         {
             nt[r]++;
             counted[r]=true;
         }
     }
     catch(Exception e){}
 }
}

}

//adapter.transacte(sqlb, 0, sqlbn);

adapter.close();
 
String ob[] = obs.replaceFirst(" ,","").replaceFirst(",$","").split(",");
N = ob.length;
title = semester + " " + cid + "-" + sessionname + " " + Toolbox.emsgs(orgnum,1372);
String instr =  Toolbox.emsgs(orgnum,1438);
 
%>

<style type="text/css">
td.header {background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>}
input {text-align:center;border:1px #aaa solid}
td.zz{background-color:<%=cachedstyle.TBGCOLOR%>}
</style>
<div style="margin:5px 0px 0px 0px">
<script type="text/javascript" >
    document.write(round1());
     var hints = [];
     var datapresentformat = "";
</script>
<div class="outset3" style="background-color: #808080">
<table align="center" cellpadding="3" cellspacing="1" border="1" style="border-collapse:collapse;border:1px #808080 solid;border-radius:4px" id="matable0">
<!--tr style="background:<%=cachedstyle.BBGCOLOR%> url(image/bheading.gif) repeat;"><td align="right"  class="header"  >#</td><td align="center"  class="header" ><%=Toolbox.emsgs(orgnum,1439)%></td>
<td colspan="3"><div  class="header" align=left    ><nobr><%=Toolbox.emsgs(orgnum,1459)%></nobr></div></td>
<td colspan="3"><div  class="header" align=right   ><nobr><%=Toolbox.emsgs(orgnum,1460)%></nobr></div></td>
</tr-->

<%
String pg[] = new String[40];
String lg[] = new String[40];
for (  i = 1; i <= N; i++)
    lg[i] = pg[i] = "";

int N1 = parseobjective(ans,lg, pg); 
if (lg[N].equals(""))N--;
if (N1 > N) N = N1;
 
for (  i = 1; i <= 0; i++)
{
 out.println("<tr>");
 //if (i==1) out.println("<td rowspan=" + N + " aling=left class=zz valign=top>" + ans.replaceAll("\n","<br>") + "</td>");  
 out.println("<td class=zz  valign=top   align=right>" 
         + i + "</td><td align=left  valign=top  class=zz onclick=editcell(this)>" 
         + lg[i] + "</td><td align=left  valign=top  colspan=3 class=zz onclick=editcell(this)>"
         + Toolbox.emsgs(orgnum,1461) + "</td><td align=right  colspan=3 valign=top  class=zz  onclick=editcell(this)>"
         + Toolbox.emsgs(orgnum,1462) +  "</td></tr>");
}
 
%>
<!--tr height="30"><td colspan="8" style="border-width:0px;background-color:white" > </td></tr--> 
<tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>"><td align="right"  class="header"  >#</td><td align="center"  class="header" ><%=Toolbox.emsgs(orgnum,1439)%></td>
<td><div  class="header" align=left onMouseOver="showmyhint1(this,5,1,5)"    onMouseOut="hidemyhint()" ><nobr><%=Toolbox.emsgs(orgnum,1457)%></nobr></div></td>
<td><div  class="header" align=right onMouseOver="showmyhint1(this,0,1,0)"    onMouseOut="hidemyhint()" ><nobr><%=Toolbox.emsgs(orgnum,1373)%></nobr></div></td>
<td><div  class="header" align=right onMouseOver="showmyhint1(this,1,1,1)"    onMouseOut="hidemyhint()" ><nobr><%=Toolbox.emsgs(orgnum,1374)%></nobr></div></td>
<td><div  class="header" align=right onMouseOver="showmyhint1(this,2,1,2)"    onMouseOut="hidemyhint()" ><nobr><%=Toolbox.emsgs(orgnum,1375)%></nobr></div></td>
<td><div  class="header" align=right onMouseOver="showmyhint1(this,3,1,3)"    onMouseOut="hidemyhint()" ><nobr><%=Toolbox.emsgs(orgnum,1376)%></nobr></div></td>
<td><div  class="header" align=right onMouseOver="showmyhint1(this,4,1,4)"    onMouseOut="hidemyhint()" style="color:blue;cursor:pointer" onclick="cust()" ><nobr><%=Toolbox.emsgs(orgnum,1377)%></nobr></div>
</td></tr>

<%
 
for (  i = 1; i <= N; i++)
{
 out.println("<tr>");
 if (lg[i].equals("") && pg[i].equals("")) break;
 //if (i==1) out.println("<td rowspan=" + N + " aling=left class=zz valign=top>" + ans.replaceAll("\n","<br>") + "</td>");  
 out.println("<td class=zz  valign=top   align=right>" 
         + i + "</td><td align=left  valign=top  class=zz onclick=editcell(this)>" 
         + lg[i] + "</td><td align=left  valign=top  class=zz onclick=editcell(this)>"
         + pg[i] + "</td><td align=right  valign=top style=color:blue class=zz onclick=openquestion(" + i +")>"
         + nq[i] + "</td><td align=right  valign=top  class=zz>" 
         + nt[i] + "</td><td align=right valign=top class=zz>" 
         + np[i] + "</td><td align=right  valign=top  class=zz>" 
         + ns[i] + "</td><td align=right  valign=top  class=zz>" 
         + scalef(scale, np[i], ns[i]) + "</td></tr>");
}
String scales[] = scale.trim().split("[ ]*,[ ]*");

String fmt = analysis.replaceAll("[^\\$]","").length() > 1?"2":"0";
if (fmt.equals("0"))
{
    String an1 = analysis.replaceFirst(".*<([a-z]+)[^>]*>.*","$1").toLowerCase();
    if (analysis.indexOf("</" + an1 + ">")>0) fmt = "1";
 
}
String fmt1 = improve.replaceAll("[^\\$]","").length() > 1?"2":"0";
if (fmt1.equals("0"))
{
    String an1 = improve.replaceFirst(".*<([a-z]+)[^>]*>.*","$1").toLowerCase();
    if (improve.indexOf("</" + an1 + ">")>0) fmt1 = "1";
 
}
 
%>
<tr  height="30"><td colspan="8" style="border-width:0px;background-color:white" > </td></tr> 

<tr height="24px"><td class="zz" colspan="6"  style="padding:3px 3px 3px 3px;border:0px;border-bottom-width:1px;background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>" align="center" ><%= Toolbox.emsgs(orgnum,1457)%></td><td colspan="2" valign="top" rowspan="2" id="pscore" style="padding:0px 0px 0px 0px;border-width:0px;background-color:white" ></td></tr>
<tr><td class="zz" colspan="6"  style="padding:3px 3px 3px 3px;border:0px;border-top-width:1px;"  ><%=pobj%> </td></tr>

<tr  height="30"><td colspan="8" style="border-width:0px;background-color:white" > </td></tr> 

<tr><td class="zz" colspan="8" align="center" style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>"><%=Toolbox.emsgs(orgnum,1436)%></td></tr>

<tr  ><td  class="zz" colspan="8" id="datatd0" valign="top" align="left" width="100%" onclick="goedit(this,0)"><%= analysis.equals("")?instr:Toolbox1.addbreak1(Toolbox.formatstr(fmt,Toolbox1.addbreak(analysis,"1",orgnum)))%></td></tr>

<tr  height="30"><td colspan="8" style="border-width:0px;background-color:white" > </td></tr> 

<tr><td  class="zz" colspan="8"  align="center"  style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>"><%=Toolbox.emsgs(orgnum,1437)%></td></tr>

<tr   ><td  class="zz" colspan="8" id="datatd1" valign="top"  align="left" width="100%" onclick="goedit(this,1)"><%= improve.equals("")?instr:Toolbox1.addbreak1( Toolbox.formatstr(fmt1,Toolbox1.addbreak(improve,"1",orgnum)))%></td></tr>


</table></div>
<script type="text/javascript" >document.write(round2);</script>
</div>

<% if (error.length()>0){%>
<script type="text/javascript" >myprompt(
"<table align=center  cellpadding=1 cellspadding=1 border=0 style=background-color:#b0b0b0>"+
"<tr><td  class=header>SID</td><td class=header>Assignment</td><td class=header>Question</td><td class=header>Scale</td><td class=header>Score</td></tr>"+
"<%=error.toString().replaceAll("\"","'").replaceAll("<td", "<td class=zz")%>"+
"</table>",null,null,"Attention! Error");
</script>
<% } %>
<script type="text/javascript" >

function openquestion(i)
{
     
    var nms = ['subdb','securitytoken', 'orgnum',  'sessionname','course', 'Semester','outcome' ];
    var vls = [ '<%=user.id%>',  securitytoken,  orgnum, '<%=sessionname%>', '<%=cid%>', '<%=semester%>',''+i ];
    postopen('gradingQuestion.jsp', nms, vls, "_blank" );
 
}
function cust()
{
 var str = "<div style=\\\"background-image:<%=Toolbox.dbadmin[orgnum%65536].bgimage%>;background-color:white\\\"><center><div style=\\\"border:1 #b0b0b0 outset;background-image:<%=Toolbox.dbadmin[orgnum%65536].bgimage%>\\\"><table border=0 bgcolor=white><tr><td><nobr><%=Toolbox.emsgs(orgnum,1433)%></nobr></td><td align=center>|</td><td>1</td><td  align=center>|</td><td>2</td><td align=center>|</td><td>3</td><td align=center>|</td><td>4</td><td align=center>|</td><td>5</td><td align=center>|</td></tr>"
 + "<tr><td><nobr><%=Toolbox.emsgs(orgnum,1434)%></nobr></td><td>0</td><td></td><td><input size=2 name=s0 value=<%=scales[0]%> ></td><td> </td><td><input size=2 name=s1 value=<%=scales[1]%> ></td><td> </td><td><input size=2 name=s2 value=<%=scales[2]%> ></td><td></td><td><input size=2 name=s3 value=<%=scales[3]%> ></td><td></td><td>100</td></tr><tr><td colspan=12 id=\\\"error\\\" style=color:red align=center></td></tr></table></div>";
 myprompt("<form rel=opener name=f1  >"  + str +"<br><input class=GreenButton style=width:80px type=button value=\"" + textmsg[407] + "\" name=b1 onclick=\"redo()\"></form></center></div>", null,null,'Scaling');
 resizebut(document.f1);
}
function redo()
{
 updatecell();
 var s = '';
 for (var i=0; i < 4; i++)
 {
 if (isNaN(document.f1.elements[i].value))
 {
 document.getElementById("error").innerHTML = "Enter a number > 0.0 and < 100 ";
 document.f1.elements[i].focus();
 return;
 }
 var j = parseFloat(document.f1.elements[i].value);
 if (j <= 0 || j >=100)
 {
 document.getElementById("error").innerHTML = "Enter a number > 0.0 and < 100 ";
 document.f1.elements[i].focus();
 return;
 }
 if (s!='') s += ",";
 s += document.f1.elements[i].value;
 }
 parent.frames[0].cust(s);
}
var datatd = ["<%=Generic.handle(analysis)%>", "<%=Generic.handle(improve)%>"];

var tds = new Array(2);

function goedit(td, j)
{
 updatecell();
 var x = td.offsetWidth;
 var y = td.offsetHeight;
 if (x < 400) x= 400;
 if (y < 100) y =100;
 tds[j] = td;

 var pos = findPositionnoScrolling(td);
 var div = document.createElement("div");
 div.id="movingdiv" + j;
 var nl = 4;

 for (var i=0; i < datatd[j].length; i++)
 if (datatd[j].charAt(i) == '\n')
     nl++;
 div.style.cssText="z-index:20;position:absolute;margin:0px 0px 0px 0px;border:0px #404040 solid;padding:0px 0px 0px 0px;top:"
 + (pos[1]+0) + 'px;left:'+ (pos[0]+0) + 'px';
  
 var zz = '';for (var i=0; i < nl; i++) zz += "<br>";
 if (nl*<%=cachedstyle.fontsize+4%> > td.offsetHeight)    td.innerHTML = zz;
 var edt  = "<textarea id=txt" + j +" rows=" + nl +"   style=\"margin:0 px 0px 0px 0px;width:" + (x-4) +"px;background-color:font-size:20px;white;border:1px orange solid\" "
 + " onblur=\"copyvalue(this," + j +")\""
 + " onkeypress=\"return displaytxt(this,event," + j +")\""
 + ">"  + datatd[j]+  "</textarea>";

 div.innerHTML = edt;
 document.body.appendChild(div);
 div.childNodes[0].focus();
}
function displaytxt(ta, evt, j)
{
    updatecell();
    var e = evt? evt : window.event;
    if(!e) return true;
    var key = 0;
    if (e.keyCode) { key = e.keyCode; } // for moz/fb, if keyCode==0 use 'which'
    else if (typeof(e.which)!= 'undefined') { key = e.which; }
    if (key == 13)
    {
        if (ta.rows>4)
        ta.rows = ta.rows + 1;
    }
    return true;
}
 
function copyvalue( thenewtextbox, j)
{
 updatecell();
 var edt  = thenewtextbox.value;
 var fmt = guessFormat(thenewtextbox.value);
 if (fmt == 2)
     edt = checkh(edt, true);
  edt = edt.replace(/<[\/]?script[^>]*>/ig,'');
 parent.frames[0].setm('<%=course1%>','<%=sessionname%>',j,edt);  
 datatd[j] = edt;
 tds[j].innerHTML = (edt.length < 3)? "<%=instr%>": addbreak1(formatstr(addbreak(edt,1),fmt,orgnum));
 document.body.removeChild(document.getElementById("movingdiv" + j));
if (fmt == 2) LaTexHTML.reformat(tds[j]);
 onbeforeunload = nosaved;
}
function saveit()
{
     updatecell();
 onbeforeunload = null;
 document.f2.analysis.value = datatd[0];
 document.f2.improve.value = datatd[1];
 var matable = document.getElementById('matable0');
 var str = '';
 for (var i=0; i < matable.rows.length && matable.rows[i].cells.length >= 7; i++)
 {
     if (i>0)  
     {
             str +=";";
     }
     for (var j=0; j < 7; j++)
     {
          
         var xx = matable.rows[i].cells[j + ((i==1)?1:0)].innerHTML;
         
         if (i == 0)
         {
             xx = xx.replace(/<[^>]+>/g,'');
         }
          
         str += "|" + xx + "|";
         if ( j<6 ) 
         {
             str += ",";
         }
         
     }
 } 
 document.f2.assess.value = str;
 formnewaction(f2);
 
 visual(document.f2);
document.f2.submit();
}

function nosaved()
{
   return textmsg[791];
}
</script>
<center>



<form rel=opener name="f2" method="post" action="assessdata.jsp" target="w<%=tstmp%>" >
<input type="hidden" name="cid" value="<%=cid%>">
<input type="hidden" name="semester"  value="<%=semester%>">
<input type="hidden" name="sessionname"  value="<%=sessionname%>">
<input type="hidden" name="assess">
<input type="hidden" name="analysis">
<input type="hidden" name="improve">
<input name="b1" type="button" class="OrangeButton"
style="width:<%= cachedstyle.fontsize * Toolbox.charwidthrate() %>px;height:<%=cachedstyle.fontsize+6%>px"
value="<%=Toolbox.emsgs(orgnum,36)%>" onclick="saveit()">
</form>

</center>
<script type="text/javascript"  src="hints.js"></script>
<script type="text/javascript" >
    
function showmyhint1(dv, i, j, k)
{
    hints[i] = dv.innerHTML;
    showmyhint(i, j, k);
}
function updateass(j)
{
    open('assessdata.jsp?n='+j,'w<%=tstmp%>');
} 
var currenttd = null;    
function editcell(td)
{
    updatecell();
    var y = td.innerHTML;
    td.innerHTML = '';
    td.onclick = null;
    var xx = document.getElementById("moveinp");
    xx.style.cssText = 'width:80px;border:1px grey outset';
    xx.value = y;
    td.appendChild(xx);
    xx.focus();
    currenttd = td;
}
function updatecell()
{
    if (currenttd == null) return;
    var xx = document.getElementById("moveinp");
    var y = xx.value;
    document.body.appendChild(xx);
    xx.style.width = '0px';
    currenttd.innerHTML = y;
    currenttd.onclick = function(){ editcell(this);}
    calculate()
    currenttd =null;
}
function doenter(inp,evt)
{
   var e = evt? evt : window.event;
    if(!e) return true;
    var key = 0;
    if (e.keyCode) {key = e.keyCode;} // for moz/fb, if keyCode==0 use 'which'
    else if (typeof(e.which)!= 'undefined') {key = e.which;}
    if (key == 13)
    {
        updatecell(inp);
    }
    return true;
}
 
function calculate()
{ 
    
    var g = [];
    var c = [];
    var matable = document.getElementById('matable0');
    var m = [];
    for (var i=1; i < matable.rows.length; i++)
    {
        
        var obj = matable.rows[i].cells[2];
        if (obj==null || matable.rows[i].cells.length<8 || matable.rows[i].cells[0].innerHTML =='')
            continue;
        var s = matable.rows[i].cells[7];
        if (s == null )
        { 
            continue;
        }
        var b = s.innerHTML.replace(/<[^>]+>/g,'').replace(/ /g,'');
        if (isNaN(b))continue;
        m[m.length] = [obj.innerHTML, b];
      
    }
    for (var i=0; i < m.length; i++)
    {
        var obj = m[i][0].replace(/ /g,'');
        if (obj == '')continue;
        var arr = obj.split(/,/);
        for (var j=0; j < arr.length; j++)
        {
            if (arr[j]==null || arr[j]=='') 
                continue;
            for (var kk=0; kk < g.length; kk++)
                if (g[kk] == arr[j]) break;
            if (kk == g.length)
            {
                g[kk] = arr[j];
                c[kk] = m[i][1];
            }
            else
            {
                c[kk] = c[kk] + "," + m[i][1];
            }
        }
            
    }
    
    var h1 = "<%= Toolbox.emsgs(orgnum,1458)%>";
    
    var h2 = "<%=Toolbox.emsgs(orgnum,1377)%>";
    var x = "<table width=100% border=1 style=\"background-color:<%=cachedstyle.TBGCOLOR%>;border-collapse:collapse;margin:0px 0px 0px 0px;border-width:0px\" ><tr  height=\"24px\" style=\"background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>\" ><td align=left><nobr>" + h1 + "</nobr></td><td align=right><nobr>" + h2 + "</nobr></td></tr>";
    
    for (var k=0; k < c.length; k++)
    {
        x += "<tr><td align=left  style=\"background-color:<%=cachedstyle.TBGCOLOR%>\">" + g[k] + "</td><td align=right   style=\"background-color:<%=cachedstyle.TBGCOLOR%>\">" +  av(c[k]) + "</td></tr>";
    }
    document.getElementById("pscore").innerHTML = (x + "</table>");
}
function av(s)
{
    var arr = s.split(",");
    var x = 0;
    for (var i=0; i < arr.length; i++)
    {
        x += parseFloat(arr[i]);
    }
    x = Math.round(x/arr.length*10)/10;
    return y = "" + x;
}
var onloadbeforeass = null;
if (typeof window.onload == 'function') 
   onloadbeforeass = window.onload;
window.onload = function()
{
   onloadbeforeass();
   calculate();
}
var needtranslator = true;
buildactmenu = function()
{  
    recurainput(document.f2);
}
for (var j=0; j < 2; j++)
if (datatd[j] == null || datatd[j] == '')
{
   var xx = parent.frames[0].getm('<%=course1%>','<%=sessionname%>',j);
   if (xx!=null && xx!='')
   {
       datatd[j] = xx;
       document.getElementById('datatd' + j).innerHTML = xx;
       myprompt(textmsg[1650] + ":<br>" + xx);
   }
}    
</script>
<script type="text/javascript"  src="curve.js?sn=30&dn=10"></script>
<input size=10 style="width:0px" id=moveinp onkeypress="return doenter(this,event)"  >
<%  
  
%>
<div id="copyright" style="text-align:center;color:#4d5ddd;font-size:12px"> 
<%= Toolbox.copyright[orgnum>>16]%> 
</div>
<iframe name="w<%=tstmp%>" width="1" height="1" scrolling="no"  style="visibility:hidden" />

</body>
</html>


