<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%!
String   caldeduct(String absentdeduct)
{
    if (absentdeduct == null) return "null";
    CSVParse p = new CSVParse(absentdeduct,'|',new String[]{",", ";"});
    
    String [][] q = p.nextMatrix();
    int z = 0;
    StringBuffer a = new StringBuffer("[");
    int k = 1; 
    while (k < q.length && q[k].length>1) 
    {
        try
        {
           String y = q[k][1].replaceAll("<[^>]+>","").replaceAll(";","").replaceAll("[a-z]","").replaceAll("&","");
           a.append(y + ",");
        }catch(Exception e){}
        k++;
    }
    return a.toString().replaceFirst("[,]+$","") + "]";
}
%>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR | Systemroles.ASSESSER | Systemroles.TEACHINGADMIN,application,session,request, response, "gradeindex.jsp", true)) == null)
    return;
orgnum = user.orgnum; 
if ( (user = User.dbauthorize(application,session,request, response, "gradeindex.jsp", true)) == null)
{
    out.print("</center><font color=white><b>You don't have a database now. A instructor should have one. Ask the System Administrator to create one for you");
    return;
}
String subdb = user.id;
long tstmp = System.currentTimeMillis()%10000000;
user.changedb(subdb);
String errstr = "";
 
String  semester =  Toolbox.defaultParam(orgnum,request, ("semester"), null, null, 25);
String whichcoursenow =  Toolbox.defaultParam(orgnum,request, ("whichcoursenow"), "null", null, 25);
String whichitem = Toolbox.defaultParam(orgnum,request, ("whichitem"), null, null, 25);
String bynametime = Toolbox.defaultParam(orgnum,request, ("bynametime"), "name", null, 25);



if (semester==null) semester = Toolbox.dbadmin[orgnum%65536].currentSemester;
String assignname="";
String course = "";
String sessionname = "";
String courseTitle = "";
String hidden = "T";
if (Toolbox.encodings[orgnum>>16].equals("zh-cn")) hidden = "h";  

String mode =  Toolbox.validate( Toolbox.defaultParam(orgnum,request, ("mode"), null), null, 2);
errstr +=(""+mode);
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (adapter.error().length() > 0)
{
    adapter.close();
    User.dberrorRelogin(application,session,request,response,"gradeindex.jsp");
    return;
}
long ct = System.currentTimeMillis()/1000;
 
 
if (mode==null)
{
String gradeSQLstr = "select distinct course, session, grade, threshhold from Gradethresh WHERE system=" + Toolbox.dbadmin[orgnum%65536].gradeSystem + " and semester='" + semester  +"' order by course, session,-threshhold";
String courseSQLstr = "select distinct Course.id, Course.title,Session.name,Session.schedule, Session.absentdeduct from Course, Session  WHERE   Session.courseid=Course.id AND Session.instructor='" + user.id +"' AND  Session.semester='" + semester  +"' order by id, Session.name";
String assignSQLstr = "select distinct Assignment.course, Assignment.name,Session.name,Assignment.sessionname,Assignment.scale,Assignment.weight,Assignment.atype from Assignment, Course,Session where Course.id=Assignment.course AND Session.courseid=Course.id AND Session.instructor='" + user.id +"' AND Session.semester=Assignment.semester AND  Session.semester='" + semester.replaceAll("'","''") +"'  AND (Assignment.sessionname=Session.name OR Assignment.sessionname LIKE CONCAT('%,',Session.name) OR Assignment.sessionname LIKE CONCAT(Session.name,',%')  OR Assignment.sessionname LIKE CONCAT('%,',Session.name,',%')) AND Assignment.due <= " + ct + "  order by Assignment.course,Session.name, Assignment." + bynametime;
out.println("<!--" + courseSQLstr +"-->");
out.println("<!--" + assignSQLstr +"-->");
int numrecords = adapter.executeQuery(gradeSQLstr);
HashMap<String,String> hm = new HashMap<String,String>();
String gradelets = "";
for (int i=0; i < numrecords; i++)
{
    String x = adapter.getValueAt(i,0) + "-" + adapter.getValueAt(i,1);
    String z = adapter.getValueAt(i,2) + ":" + adapter.getValueAt(i,3);
    String y = hm.get(x);
    if (y == null) 
        hm.put(x, z);
    else
        hm.put(x, y + ";" + z); 
    gradelets = adapter.getValueAt(i,2) + ',' + gradelets;
}
        
int numcourses = adapter.executeQuery(courseSQLstr);
out.println("<!--" + errstr +"-->");
 
%>
<!DOCTYPE html>
<html  lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%><title><%=Toolbox.emsgs(orgnum,461)%></title>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<style>
A:link {  COLOR: #FFFFFF;TEXT-DECORATION: none}
A:visited {COLOR: #FFFFFF;TEXT-DECORATION: none}
A:hover{COLOR: #DDCC11;TEXT-DECORATION: underline}
BODY {background-color:<%=cachedstyle.IBGCOLOR%>;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-weight:680}
select {margin:0px;padding:0px;background-color:<%=cachedstyle.TBGCOLOR%>;color:black;border-width:0px;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>}
input{margin:0px;padding:0px;background-color:<%=cachedstyle.TBGCOLOR%>;color:black;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;vertical-align:middle;}
</style>
 

<%
if (numcourses < 0)
{
adapter.close();
out.println("<body bgcolor=" + cachedstyle.DBGCOLOR+"><br> There is no courses:" + errstr + adapter.error());
return;
}
String [] sessa = new String[numcourses];
String [] cid =   new String[numcourses];
String [] title = new String[numcourses];
String [] tslots = new String[numcourses];
String [] grades = new String[numcourses];
String [] deducts = new String[numcourses];
int j = 0;
String sess = "";
for (int i = 0; i < numcourses; i++)
{
     String sa = adapter.getValueAt(i,0).trim();
     String value  = adapter.getValueAt(i,1);
     sess += "," + adapter.getValueAt(i,2);
     if (value == null)
     {
        value="";
     }
    // if (i==numcourses-1 || !adapter.getValueAt(i+1,0).trim().equals(sa))
     {
         cid[j] = sa;
         title[j] = value.trim();
         sessa[j] =  adapter.getValueAt(i,2); //sess.substring(1);
         tslots[j] =  adapter.getValueAt(i,3);
         grades[j] =  hm.get(sa + "-" + adapter.getValueAt(i,2));
         deducts[j] = caldeduct( adapter.getValueAt(i,4));
         j++;
     }
}
numcourses = j;
%>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("gradeindex.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
 <script type="text/javascript" >
 var theurl = "<%=Toolbox1.geturl(request)%>";
 document.write(unifontstyle(<%=cachedstyle.fontsize%>));
 var semester = '<%=semester%>';
 var subdb = '<%=subdb%>';
 var tstmp = <%=tstmp%>;
 var numcourses = <%= numcourses %>;
 var AN = new Array(numcourses);
 var orderways = '<%=bynametime%>'.charAt(0);
 var userid='<%=user.id%>';
 var cid =   [<%for(j=0;j<numcourses;j++)out.print("\""+ Generic.handle(cid[j])+"\",");%>''];
 var ctitle= [<%for(j=0;j<numcourses;j++)out.print("\""+ Generic.handle(title[j])+"\",");%>''];
 var sess=   [<%for(j=0;j<numcourses;j++)out.print("\""+ Generic.handle(sessa[j])+"\",");%>''];
 var tslots=   [<%for(j=0;j<numcourses;j++)out.print("\""+ Generic.handle(tslots[j])+"\",");%>''];
 var grades=   [<%for(j=0;j<numcourses;j++)out.print("\""+ Generic.handle(grades[j])+"\",");%>''];
 var deducts=   [<%for(j=0;j<numcourses;j++)out.print(  Generic.handle(deducts[j])+ ",");%>null];
 
 var numassigns = new Array(numcourses);
 var assgn = new Array(numcourses);
 var sindex = new Array(numcourses);
 var scsarr =[];
 var wtsarr = [];
 var assname = [];
 var sesname = [];
 var atypes = [];
 var clicked = false;
 var whichcoursenow =  <%=whichcoursenow%>;
 var whichitem =  <%=whichitem%>;
 var  msg254 = function(){return '<%=Toolbox.emsgs(orgnum,254)%>'};
 var  msg320 = function(){return '<%=Toolbox.emsgs(orgnum,320)%>'};
 var  msg1145 = function(){ return '<%=Toolbox.emsgs(orgnum,1145)%>'};
 
<%
String gradeletters   = Toolbox.dbadmin[orgnum%65536].domainValue(Toolbox.langs[orgnum>>16], "Grade",1,2).replaceFirst("[^,]+,[^,]+,", "").replaceFirst(",$", "");
if (gradeletters == null || gradeletters.equals("")) gradeletters = "F,D,C,B,A";
int allassigns = adapter.executeQuery(assignSQLstr);
int  kk = 0,    jj= 0;
String cr, as, ss,sc, wt, at, ass="", scs="", wts="", assn="", sss="", atype="", oldcr="";
for( j = 0; j < allassigns; j++ )
{
    cr  = adapter.getValueAt(j,0).trim() + '-' + adapter.getValueAt(j,2).trim();
    as  = adapter.getValueAt(j,1).trim();
    ss = adapter.getValueAt(j,3).trim();
    sc = adapter.getValueAt(j,4).trim();
    wt = adapter.getValueAt(j,5).trim();
    at = adapter.getValueAt(j,6).trim();
    for (; jj < numcourses && !( cid[jj] + '-' + sessa[jj] ).equals(cr); jj++);

    if ( j == 0 || !cr.equals(oldcr))
    {
         ass +="AN[" + jj + "]=[";
         scs += "scsarr[" + jj + "]=[";
         wts += "wtsarr[" + jj + "]=[";
         assn += "assname[" + jj + "]=[";
         sss += "sesname[" + jj + "]=[";
         atype += "atypes[" + jj + "]=[";
         kk = 0;
    }
    boolean bb =   (j == allassigns -1 || !cr.equals( adapter.getValueAt(j+1,0).trim() + '-' + adapter.getValueAt(j+1,2).trim() ));
    if (("," + ss + ",").indexOf("," + sessa[jj] +",") >=0)
   {
        String cm = ","; 
        if (bb) cm = "];\n";
        ass += "'"+as.replaceAll("'","\\'")+"'" + cm;
        scs +=   sc +  cm;
        wts +=   wt  + cm;
        assn += "'" +  as.replaceAll("'","\\'") + "'"  + cm;
        sss +="'" + ss + "'"  + cm;
        atype += at +   cm;
        kk++;
   }
   if (bb)
   {
      
      out.print("numassigns["+jj+"] = " + kk + ";\n");
      kk = 0;
     
   }
   oldcr = cr; 
}
adapter.close();
long y = (new java.util.Date()).getTime()/1000;

%>
<%=ass %>
<%=scs %>
<%=wts %>
<%=assn %>
<%=sss %>
<%=atype %>
    
for (var k=0; k < numassigns.length; k++)    
{
    if (scsarr[k]==null) scsarr[k] = new Array();
    if (wtsarr[k]==null) wtsarr[k] = new Array();
    if (assname[k]==null) assname[k] = new Array();
    if (sesname[k]==null) sesname[k] = new Array();
    if (atypes[k]==null) atypes[k] = new Array();
    
    scsarr[k][scsarr[k].length] = 100;
    wtsarr[k][wtsarr[k].length] = -2;
    assname[k][assname[k].length] = '<%=Toolbox.emsgs(orgnum,1600)%>';
    sesname[k][sesname[k].length] = sesname[k][0];
    atypes[k][atypes[k].length] = 0;
} 
var gradeletters = "<%=gradeletters%>";
function msg1600(){return '<%=Toolbox.emsgs(orgnum,1600)%>';}
function msg1601(){return '<%=Toolbox.emsgs(orgnum,1601)%>';}
function getwhichitem(){return whichitem;}
function getwhichcourse(){return whichcoursenow;}
function getCids(){ return cid[whichcoursenow];}
function getCtitle(){ return ctitle[whichcoursenow];}
function getSns(){ return sess[whichcoursenow];}
function getTslots(){ return tslots[whichcoursenow];}
function getGrades(){ return grades[whichcoursenow];}
function getdeducts(){return deducts[whichcoursenow];}
function gradeletter(i)
{
   let y = getGrades();
   if (y == '' || y == null || y =='null') 
      return gradeletters.split(/,/)[i];
   let t = y.split(/;/);
   let q =  t[t.length - i-1];
   let p = q.replace(/:.*$/,'');
   return p;
}

var gradeorder = 0; 
//syn = function(){if (gradeorder >= 0) setGrades();}
function setGrades(x)
{  
    grades[whichcoursenow] = x;
} 
 
function getScs(){ return scsarr[whichcoursenow];}
function getWts(){ return wtsarr[whichcoursenow];}
function getAssn(){ return assname[whichcoursenow];}
function getSes(){ return sesname[whichcoursenow];}
function getAtype(){ return atypes[whichcoursenow];}

</script>
 <%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
 <style> 
     center form table tr td table tr td select option{background-color:<%=cachedstyle.IBGCOLOR %>;color:white;}
     center form table tr td table tr td select{background-color:transparent;color:white;border:1px #c0c0c0 solid}
     center form table tr td select{background-color:transparent;color:white;border:1px #c0c0c0 solid}
     center form table tr td select option{background-color:<%=cachedstyle.IBGCOLOR %>;color:white;}
 </style>
</head>

<body style="margin:6px 12px 6px 6px;background:<%= cachedstyle.IBGCOLOR %> right url(image/backgd.gif) repeat-y">
<Center>
<%=Toolbox.logtitle(Toolbox.emsgs(orgnum,466), 200)%>
 
<form rel=opener   name=form1 method=post target=rightwingrades action=DataTable style="margin:5px 0px 5px 0px"  >
<input type=hidden name=rdap value="assignmentgrade">
<input type=hidden name=course>
<input type=hidden name=wcds>
<input type=hidden name=assignname>
<input type=hidden name=sessionname>
<input type=hidden name=courseTitle>
<input type="hidden" name="xxx" >
<input type="hidden" name="weight" value="4">
<input type="hidden" name="mode" value="1">
<input type=hidden name=subdb value="<%=subdb%>">
<TABLE width=100% class=outset bgcolor=#DDCC11 cellpadding=1 cellspacing=0>
<tr height=28><td  colspan=2 align="center" >
<table  align="center" cellpadding="0" cellspacing="0"><tr><td style="color:#DDCC11;font-weight:700"><nobr><%=Toolbox.emsgs(orgnum,1004)%></nobr>
</td><td><select name=semester  style="font-family:inherit"   onchange="switchs(this)"><%= Toolbox.dbadmin[user.orgnum%65536].semesteropts(semester, orgnum) %>
</select> </td></tr></table></td></tr>

<%
int ii = Toolbox.indexframewidth(cachedstyle.fontsize);
for (j = 0; j < numcourses; j++)
{
%>
<TR><TD><img src=image/tri.gif></td><td><div id="varywidthdiv<%=j%>" style="width:<%=ii%>px;overflow:hidden"><nobr><a href="javascript:submitform(document.form1.assignname<%=j%>,<%=j%>)"><%=cid[j] +'-' + sessa[j] + ' ' + title[j]%></a></nobr></div></td></tr>
<TR><TD>&nbsp;</td><td><select style="width:208px" name=assignname<%=j%>   onClick ="javascript:clicked=true"  onChange="javascript:submitform(this,<%=j%>)"></select>
</TD></TR>
<%
}
if (numcourses==0)
{
%>
<tr><td colspan="2" style=color:#DDCC11> <%=Toolbox.emsgs(orgnum,300)%>
<% 
    

if (null == DBAdmin.server2admin(user.dbinfo.server))
{
%>     
<center>
<input class=GreenButton
 style="background-color:#00BBBB;color:white;font-weight:700;width:<%=cachedstyle.fontsize*4%>px;height:<%=cachedstyle.fontsize+6%>px"
 type=button name=submit2 
 value="<%=Toolbox.emsgs(orgnum,1429) %>"
 onclick=debg()>
</center>
</td></tr>
<%
}
}
else
{
%>
  <TR> <TD width="12" colspan="2" align="center"> <input type="button" class="GreenButton" style="width:<%=Math.round(4.5*cachedstyle.fontsize)%>px;text-align:center" 
              onclick="refresh()" value="<%=Toolbox.emsgs(orgnum,93)%>" >
           
        </TD>
        </TR>
<%}
 
 
%>

</TABLE>
</form>
  
<%=Toolbox.sponsor(orgnum,numcourses*9/5, 210)%>
 
</body>

<script type="text/javascript" >
function getTstmp()
{
    return <%=tstmp%>;
}
 
function debg()
{
    open('follows.jsp?x=mycourse',parent.frames[1].name);
}
<% for (j = 0; j < numcourses; j++)
{
%>   assgn[<%=j%>] = document.form1.assignname<%=j%>;
    sindex[<%=j%>] = -1;
<%
}
%>
function getSubdb(){return '<%=subdb%>';}
var textmsg496 = '<%=Toolbox.emsgs(orgnum,496)%>';
</script>
 <script type="text/javascript"  src=gradeindexfunc.js></script>
 <script type="text/javascript"  src=floating.js></script>
 <script type="text/javascript"  src=curve.js></script>
 <script type="text/javascript" >
     
for (j = 0; j < <%=numcourses%>; j++)
{
   var dd = document.getElementById("course" + j);
   if (dd!=null)
      dd.style.width = (dd.parentNode.offsetWidth-2) + "px";
}
var onloadbeforegradeind  = null;
if (typeof window.onload == 'function')
onloadbeforegradeind= window.onload;

window.onload = function()
{
    if (onloadbeforegradeind != null) onloadbeforegradeind();
 <% if (whichitem==null){%>   
    
    var x = parent.frames[1].document.createElement('div');
    x.innerHTML = "<ul><li><%=Toolbox.emsgs(orgnum,463)%></li><li><%=Toolbox.emsgs(orgnum,464)%></li>  </ul> <br><br><%=Toolbox.emsgs(orgnum,468)%>";
    parent.frames[1].document.body.appendChild(x);
   <%} else {%>
       
       var sel = document.form1.assignname<%=whichcoursenow%>;
       sel.selectedIndex = <%=whichitem%>;  
       submitform(sel,<%=whichcoursenow%>);
       
   <%}%>
}

</script>
 
</html>
<%
}
else if (mode.equals("1"))
{
    String assignnames[] = Toolbox.defaultParam(orgnum,request,"assignname","","!@#$%&()-_+:/", 2000).split("@#@");
    course = Toolbox.defaultParam(orgnum,request,"course","", null, 30);
    sessionname = Toolbox.defaultParam(orgnum,request,"sessionname","", null, 90);
    courseTitle = Toolbox.defaultParam(orgnum,request,"courseTitle","", "!@#$%&()-_+:/", 200);
    subdb = Toolbox.defaultParam(orgnum,request,"subdb","", null, 30);
  
    String sql0 = "SELECT  AppUser.id,CONCAT(AppUser.firstname,',',AppUser.email) as firstname, AppUser.lastname, Registration.grade, Registration.evaluation  FROM Registration, AppUser WHERE  AppUser.id=Registration.sid AND Registration.semester ='" + semester + "'   AND Registration.courseid = '" + course + "' AND Registration.sessionname='" + sessionname + "'";
    sql0 = "(" + sql0 +") AS TXTQ";
    //String [] headers = new String[sessionnames.length];
    String cs = "~!@#$%^&*()-_+={[}]|\\;:\"'<,>.?/";
    String sql = "";
    String subsql = "";
    String helparr = "";
if (adapter.dbms.contains("maria") == false)
{
    sql = "SELECT   TXTQ.id as " + Toolbox.emsgs(orgnum,232).replaceAll(" ","") +"_T_count, TXTQ.lastname as " + Toolbox.emsgs(orgnum,234).replaceAll(" ","") +"_T_9,  TXTQ.firstname as " + Toolbox.emsgs(orgnum,235).replaceAll(" ","") +"_" + hidden + "_9,TXTQ.grade AS " + Toolbox.emsgs(orgnum,241).replaceAll(" ","") +"_T_2, '' AS " + Toolbox.emsgs(orgnum,1390).replaceAll(" ","") +"_N_3_1_mean ";
   
    for (int i=0; i < assignnames.length; i++)
    {
       String header = assignnames[i];
       for (int j=0; j < cs.length(); j++)
         header = header.replace(cs.charAt(j),' ');
       header = header.replaceAll(" ","");
       if (header.length()>20) header = header.substring(0,20);
       String sqli = "SELECT Submission.sid, Submission.grade From Submission, Registration  WHERE  Submission.course=Registration.courseid AND Submission.semester=Registration.semester AND Submission.semester='" +semester + "' AND Submission.course = '" +course + "' AND Submission.assignname='" +assignnames[i].replaceAll("'","''")  + "' AND  Registration.sessionname='" +sessionname + "' AND Submission.sid=Registration.sid ";
       subsql += "   LEFT JOIN (" + sqli + ") AS TXTX" + i +" ON TXTQ.id=TXTX" + i +".sid";
       sql += ", TXTX" + i +".grade AS " + header +"_N_4_1_mean ";
       helparr += header + ",0,,," + assignnames[i];
       //if (i == assignnames.length-1) helparr += "\n"; 
    }

   String header = Toolbox.emsgs(orgnum,1600);
       for (int j=0; j < cs.length(); j++)
         header = header.replace(cs.charAt(j),' ');
       header = header.replaceAll(" ","");
       if (header.length()>20) header = header.substring(0,20);
       String sqli = "SELECT Absence.sid, count(*) as n From Absence WHERE  Absence.semester=" +semester + " AND Absence.courseid = '" +course + "' AND Absence.sessionname='" + sessionname + "' AND Absence.justified=0 GROUP BY sid ";
       subsql += "   LEFT JOIN (" + sqli + ") AS TXTXi ON TXTQ.id=TXTXi.sid";
       sql += ", TXTXi.n AS " + header +"_N_2_0_mean ";
       helparr += header + ",0,,," + Toolbox.emsgs(orgnum,1600);
       helparr += "\n"; 
 
    sql += ",  TXTQ.evaluation AS q_h FROM " + sql0 + subsql;
}
else
{
      adapter.executeUpdate("DROP TABLE IF EXISTS TXTQ");
      sql0 = "CREATE TABLE  TXTQ (id VARCHAR(20), firstname VARCHAR(200),lastname VARCHAR(100), grade VARCHAR(2), evaluation TEXT, PRIMARY KEY(id))";
      adapter.executeUpdate(sql0);
      sql0 = "INSERT INTO TXTQ (id, firstname,lastname,grade, evaluation) SELECT AppUser.id,CONCAT(AppUser.firstname,',',AppUser.email) as firstname, AppUser.lastname,Registration.grade, Registration.evaluation  FROM Registration LEFT JOIN AppUser ON AppUser.id=Registration.sid  WHERE Registration.semester ='" + semester + "'   AND Registration.courseid = '" + course + "' AND Registration.sessionname='" + sessionname + "';\n";
      int ni = adapter.executeUpdate(sql0);
       if (ni == -1) System.out.println(adapter.error());
      sql =  "SELECT   TXTQ.id as " + Toolbox.emsgs(orgnum,232).replaceAll(" ","") +"_T_count, TXTQ.lastname as " + Toolbox.emsgs(orgnum,234).replaceAll(" ","") +"_T_9,  TXTQ.firstname as " + Toolbox.emsgs(orgnum,235).replaceAll(" ","") +"_" + hidden + "_9,TXTQ.grade AS " + Toolbox.emsgs(orgnum,241).replaceAll(" ","") +"_T_2, '' AS " + Toolbox.emsgs(orgnum,1390).replaceAll(" ","") +"_N_3_1_mean";
      String drop = "DROP TABLE TXTQ;\n"; 
     for (int i=0; i < assignnames.length; i++)
    {
       String header = assignnames[i];
       for (int j=0; j < cs.length(); j++)
         header = header.replace(cs.charAt(j),' ');
       header = header.replaceAll(" ","");
       if (header.length()>20) header = header.substring(0,20);
       sql0 = "DROP TABLE IF EXISTS  TXTX" + i;adapter.executeUpdate(sql0);
       sql0 = "CREATE TABLE TXTX" + i +" (sid VARCHAR(20),grade FLOAT,PRIMARY KEY(sid))";adapter.executeUpdate(sql0);
       sql0 = "INSERT INTO TXTX" + i +"(sid,grade) SELECT Submission.sid, Submission.grade From Submission, Registration  WHERE  Submission.course=Registration.courseid AND Submission.semester=Registration.semester AND Submission.semester='" +semester + "' AND Submission.course = '" +course + "' AND Submission.assignname='" +assignnames[i].replaceAll("'","''")  + "' AND  Registration.sessionname='" +sessionname + "' AND Submission.sid=Registration.sid;\n";
        ni = adapter.executeUpdate(sql0);
       if (ni == -1) System.out.println(adapter.error());
       subsql += "   LEFT JOIN TXTX" + i +" ON TXTQ.id=TXTX" + i +".sid";
       sql += ", TXTX" + i +".grade AS " + header +"_N_4_1_mean ";
       helparr += header + ",0,,," + assignnames[i];
       drop +=  "DROP TABLE TXTX" + i +";\n"; 
       //if (i == assignnames.length-1) helparr += "\n"; 
    }
    sql0 = "DROP TABLE IF EXISTS  TXTXi"; adapter.executeUpdate(sql0);
    sql0 = "CREATE TABLE  TXTXi (sid VARCHAR(20), n INTEGER,PRIMARY KEY(sid))";adapter.executeUpdate(sql0);
    sql0 = "INSERT INTO TXTXi(sid,n) SELECT Absence.sid, count(*)   From Absence WHERE  Absence.semester=" +semester + " AND Absence.courseid = '" +course + "' AND Absence.sessionname='" + sessionname + "' AND Absence.justified=0 GROUP BY sid;\n";
    ni = adapter.executeUpdate(sql0);
       if (ni == -1) System.out.println(adapter.error());
String header = Toolbox.emsgs(orgnum,1600);
       for (int j=0; j < cs.length(); j++)
         header = header.replace(cs.charAt(j),' ');
       header = header.replaceAll(" ","");
       if (header.length()>20) header = header.substring(0,20);
       subsql += "   LEFT JOIN  TXTXi ON TXTQ.id=TXTXi.sid";
       sql += ", TXTXi.n AS " + header +"_N_2_0_mean ";
       helparr += header + ",0,,," + Toolbox.emsgs(orgnum,1600);
       helparr += "\n"; 
       drop +=  "DROP TABLE TXTXi;\n"; 
    sql += ",  TXTQ.evaluation AS q_h FROM TXTQ " +  subsql;
   // sql = sql0 + sql  ;
}
     
    String sq11 = "UPDATE Task SET jscript='gradebook.js',help='" + helparr.replaceAll("'","''") +"', title='" + course +"-" + sessionname +" " + courseTitle.replaceAll("'","''")  +"', query='" + sql.replaceAll("'","''") +"' WHERE name='assigngrades'";
    int n = adapter.executeUpdate(sq11);
    if (n!=1)
    {
       sq11 = "INSERT INTO Task(lastupdate,name, title, query, insertQuery, updateQuery, deleteQuery, webService, format, help, roles, insertroles, updateroles, deleteroles, jscript, preop, postop, permits, options) VALUES ("
          + "1, 'assigngrades', '" + course +"-" + sessionname +" " + courseTitle.replaceAll("'","''")  +":" + assignname +"', '" + sql.replaceAll("'","''")+ "','', '', '', '', 'HTML', '" + helparr.replaceAll("'","") +"', 2, 0, 0, 0, 'gradebook.js', '', '', '', '')";
       n = adapter.executeUpdate(sq11);
       if (n!=1)  out.print(adapter.error());
    }
    adapter.close();
 
    if (n==1)
    {
        String xx = "/DataHTML?rdap=assigngrades&cdrdap=1&subdb=" + subdb + "&onbegin=59"  ;
        try{
                 javax.servlet.RequestDispatcher dispat =  application.getRequestDispatcher(xx);
                 dispat.forward(request,response);
        }catch(Exception e){ }
        
   }
   else
   {
       out.print("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" > " + Toolbox.getMeta(orgnum) + "<body>" + sql + "</body></html>");
   }
}

else 
{
    assignname = Toolbox.defaultParam(orgnum,request,"assignname","", null, 30);
    course = Toolbox.defaultParam(orgnum,request,"course","", null, 30);
    sessionname = Toolbox.defaultParam(orgnum,request,"sessionname","", null, 30);
    courseTitle = Toolbox.defaultParam(orgnum,request,"courseTitle","", "!@#$%&()-_+:/", 200);
    subdb = Toolbox.defaultParam(orgnum,request,"subdb","", null, 30);

    String query = "select R.sid as sid_h, CONCAT(R.sid, '>>studentpage.jsp?mode=instructor') AS SID_L_9_count,R.lastname as LastName_T_10, R.firstname AS FirstName_" + hidden + "_10, R.attendance AS Attendance_N_2_0_mean,L.ct as NotesCount_N_2_0_mean,S.grade as Score_n_3_1_mean  FROM ( SELECT sid,  lastname, firstname, attendance FROM AppUser, Registration where sid=id and semester='" + semester + "' AND courseid='" + course + "' AND sessionname='" + sessionname + "') as R LEFT JOIN ( SELECT Registration.sid, count(stime) as ct FROM Registration,Lecturenotes where Registration.courseid=Lecturenotes.courseid AND Registration.sid = Lecturenotes.sid AND Registration.courseid='" + course +"'  AND semester='" + semester + "' AND Registration.sessionname='" + sessionname +"' group by Registration.sid  ) as L on R.sid = L.sid LEFT JOIN (  SELECT sid, grade FROM Submission where semester='" + semester + "' AND course='" + course + "' AND assignname='" + assignname + "') AS S on S.sid = R.sid";
    //String update="INSERT INTO Assignment(courseid, name, semester, sessionname,scale,weight,question,answer,atype,format,grader,start,due,status,group) VALUE('" + course + "','" + assignname + "','" + semester + "','" + sessionname + "',10,10,'Attenance, class, classroom, notes','', 0,0,'??CURRENT_USER??',0, 0,1,'')#" +
    String update="INSERT INTO Submission(sid, course, semester, submtime, assignname, grade, content, comment) VALUES ('||sid||','" + course + "','" + semester + "',??CURRENT_TIME??,'" + assignname + "',@@Score@@,'based on attenance, class room, notes','') #UPDATE Submission SET grade=$$Score$$ WHERE sid='||sid||' AND course='" + course + "' AND semester='" + semester + "' AND assignname='" + assignname + "'";
 
    String sq2 = "UPDATE Task SET jscript='',help='', title='" + course +"-" + sessionname +" " + courseTitle.replaceAll("'","''")  +":" + assignname + "', query='" + query.replaceAll("'","''") +"',updateQuery='" + update.replaceAll("'","''") +"' WHERE name='particip'";
    int m = adapter.executeUpdate(sq2);
    if (m!=1)
    {
       sq2 = "INSERT INTO Task(lastupdate,name, title, query, insertQuery, updateQuery, deleteQuery, webService, format, help, roles, insertroles, updateroles, deleteroles, jscript, preop, postop, permits, options) VALUES ("
          + "1, 'particip', '" + course +"-" + sessionname +" " + courseTitle.replaceAll("'","''")  +":" + assignname +"', '" + query.replaceAll("'","''")+ "','', '" + update.replaceAll("'","''") + "', '', '', 'Table', '', 2, 0, 2, 0, '', '', '', '', '')";
       m = adapter.executeUpdate(sq2);
    }

  adapter.close();
    %>
    <jsp:forward page="DataTable" > 
     <jsp:param name="orgnum"  value="<%=orgnum%>" /> 
     <jsp:param name="rdap" value="particip" />
     <jsp:param name="subdb" value="<%=subdb%>" />
     </jsp:forward> 
    <%

}
%>