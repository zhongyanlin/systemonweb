<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR | Systemroles.TEACHINGADMIN |Systemroles.ASSESSER,application,session,request, response, "aggregate2.jsp", true)) == null|| !Toolbox.verifytoken(request)) 
    return;
orgnum = user.orgnum; 

if ( (user = User.dbauthorize(application,session,request, response, "aggregate2.jsp", true)) == null) 
{
    out.print("</center><font color=white><b>You don't have a database now. An instructor should have one. Ask the System Administrator to create one for you"); 
    return;
}
CachedStyle cachedstyle = new CachedStyle(request, orgnum); 
user.changedb(user.id);

long tstmp = System.currentTimeMillis() % 10000000;
String cid  =   Toolbox.defaultParam(orgnum,request,"cid","", null, 30);
String title =   Toolbox.defaultParam(orgnum,request,"title","", "@#$+:,()", 200);
String semester =  Toolbox.defaultParam(orgnum,request,"semester",Toolbox.dbadmin[orgnum%65536].currentSemester, null, 30);
String absentdeduct  =  (Toolbox.defaultParam(orgnum,request,"absentdeduct","", "<,;|>/", 500)).replaceAll("<nobr>","").replaceAll("<.nobr>","");
 
String sessionname =  Toolbox.defaultParam(orgnum,request,"sessionname","", null, 30);
String sessionname1 = sessionname.replaceAll("'","''");
String grouping = Toolbox.defaultParam(orgnum,request,"grouping",null,  null, 2);
 
String gradesystem = "" + Toolbox.gradeSystem; 
String course1 = cid.replaceAll("'", " ");
String semester1 = semester.replaceAll("'", "''");
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
String sql = "INSERT INTO Aggregation(semester,courseid,uid,grouping,lastupdate) VALUES('" + semester1 +"','"+course1 + "','" + user.id +"'," + grouping + "," +   System.currentTimeMillis()/1000   + ")";
String sql1 = "UPDATE  Aggregation SET grouping=" + grouping + "  WHERE courseid='" + course1 + "' AND semester='" + semester1 +"' AND uid='" + user.id +"'";
int nn=0;
if (adapter.executeUpdate(sql)==-1) 
adapter.executeUpdate(sql1);
     
 

//String str = "aggregate2.jsp?cid=" + Toolbox.urlencode(cid) + 
//"&title=" + Toolbox.urlencode(title) + 
//"&grouping=" + grouping + "&semester=" + Toolbox.urlencode(semester) +"&sessionname=" + sessionname;

String groupingstr = Toolbox.emsgs(orgnum,253);
String g = "g";
if (grouping.equals("0"))
{
   groupingstr = Toolbox.emsgs(orgnum,253);
   g = "";
}
else
   grouping = "1";

String sql0;
int numassign;
/*
sql0 = "DELETE FROM Assignment WHERE Assignment.sessionname LIKE '%" + sessionname + 
        "%' AND atype=4 and name NOT IN (SELECT assignname FROM Submission,Registration WHERE  Submission.semester=Registration.semester  AND Submission.semester='" 
        + semester1 + "' AND Submission.course=Registration.courseid AND  Submission.course='" + course1 + "' AND Registration.sessionname='" + sessionname 
        + "' AND Registration.sid=Submission.sid)";
numassign = adapter.executeUpdate(sql0);
 
*/

sql = "select Assignment.name, max(Submission.grade) as m, Assignment.scale, Assignment.assgroup"
+",Assignment.sessionname from Submission, Assignment  where (Assignment.sessionname='" + sessionname + "' OR Assignment.sessionname LIKE '%," + sessionname + "' OR Assignment.sessionname LIKE '" + sessionname + ",%' OR Assignment.sessionname LIKE '%," + sessionname + ",%') AND Submission.assignname = Assignment.name and "
+"Submission.course=Assignment.course and Assignment.course='" + course1 + "' and Submission.grade > -1 AND Assignment.semester=Submission.semester and Submission.semester='" + semester1 + "' group by "
+"Assignment.name,Assignment.sessionname"; 
numassign = 0;
boolean bn = adapter.executeQuery2(sql,false);
int height = 28*numassign + 140; 
if (bn==false)
{
   out.println(adapter.error() + "<br>" + sql);
   adapter.close();
   return;
}
else 
{
    out.println("<!--" + numassign +"-->");
    if (height>350) height = 350;
}
String scale, max, name, weightstr,group;
int weight;
java.util.ArrayList<String>  maxs = new java.util.ArrayList();
java.util.ArrayList<String>  names = new java.util.ArrayList();
java.util.ArrayList<String>  groups = new java.util.ArrayList();
java.util.ArrayList<String>  scales = new java.util.ArrayList();
java.util.ArrayList<String>  sessions = new java.util.ArrayList();
java.util.ArrayList<String>  scstr = new java.util.ArrayList();

double scs = 0;
for (int i = 0; adapter.getValueAt(i,1)!=null; i++) 
{   
     numassign++; 
     maxs.add(adapter.getValueAt(i,1));
     names.add(adapter.getValueAt(i,0)); 
     scales.add( adapter.getValueAt(i,2)); 
     groups.add(adapter.getValueAt(i,3));
     
     sessions.add( adapter.getValueAt(i,4));
}
double [] scss = new double[numassign];
for (int i=0; i < numassign; i++)
try{scss[i] = Double.parseDouble(scales.get(i));} catch(Exception e){scss[i] = 0.0; }
 
for (int i = 0; i < numassign; i++) 
{   
     max = maxs.get(i);
     name = names.get(i); 
     scale =  scales.get(i); 
     group = groups.get(i);
     scs = scss[i];
     if (scs == 0.0)
     { 
       if ( Double.parseDouble(max) > 10)
           scale = "100";
       else
           scale = "10";
       weight = 100/numassign; //out.println(name + scale + weight);  
       if (1 != adapter.executeUpdate("UPDATE Assignment SET scale=" + scale + ", weight=" + weight  + ", assgroup='" + Toolbox.emsgs(orgnum,255) + i +"' WHERE semester='" + semester1 +"' AND course='"+course1 + "' AND name='" + name +"' AND sessionname='" + sessions.get(i) + "'"))
            out.print(adapter.error());
     }
}

int kk = 0;
if (grouping.equals("1"))
{
   sql = "UPDATE Assignment SET assgroup='Ungraded', scale=100 WHERE  Assignment.semester='" + semester1 + "' AND  course='"+course1 + "' AND (assgroup=NULL or assgroup='' or assgroup='null') AND  (Assignment.sessionname='" + sessionname1 + "' OR Assignment.sessionname LIKE '%," + sessionname1 + "' OR Assignment.sessionname LIKE '" + sessionname1 + ",%' OR Assignment.sessionname LIKE '%," + sessionname1 + ",%') ";
   if (adapter.executeUpdate(sql) < 0) out.print(adapter.error());
   
   sql = "select assgroup,  count(*) as freq, sum(weight) as wt  from  Assignment where Assignment.semester='" + semester1 + "' AND  Assignment.course='" + course1 + "' AND  (Assignment.sessionname='" + sessionname1 + "' OR Assignment.sessionname LIKE '%," + sessionname1 + "' OR Assignment.sessionname LIKE '" + sessionname1 + ",%' OR Assignment.sessionname LIKE '%," + sessionname1 + ",%')  group by assgroup";
   kk = 0;
   boolean b  = adapter.executeQuery2(sql,false);
   if (b==false)
   {
      out.println(adapter.error() + "<br>" + sql);
      return;
   }
    
   int ll=0;
   java.util.ArrayList<String>  wts = new java.util.ArrayList<String>();
   maxs = new java.util.ArrayList<String>();
   names = new java.util.ArrayList<String>();
   for (int i = 0; adapter.getValueAt(i,0)!=null; i++) 
   {   
      wts.add(  adapter.getValueAt(i,2));
      maxs.add(   adapter.getValueAt(i,1));
      names.add(  adapter.getValueAt(i,0));  
      kk++; 
   }
   
 
   for (int i = 0; i < kk; i++) 
   {
       String wt=wts.get(i);
       max=maxs.get(i);
       name=names.get(i);
       if (1 != adapter.executeUpdate(
              "UPDATE Assgroup SET length=" + max 
              + "  WHERE semester='" + semester1 
              + "' AND course='"+course1 
              + "' AND name='" + name 
              + "' AND sessionname = '" 
              + sessionname +"'") &&
         1 != adapter.executeUpdate(
              "INSERT INTO Assgroup(semester,course,name,weight,droptop,dropbottom,length,lastupdate,sessionname) VALUES('" + semester 
              + "','"+course1 + "','" 
              + name +"'," 
              + wt +",0,0," 
              + max + "," 
              + System.currentTimeMillis()/1000  +",'" 
              + sessionname +"')"
         ))
         out.print(adapter.error());
         adapter.executeUpdate( 
              "UPDATE Assgroup SET weight=" + wt 
               + "  WHERE semester='"   + semester1 
               + "' AND course='"       + course1 
               + "' AND sessionname ='" + sessionname 
               + "' AND name='"         + name 
               + "' AND (weight is NULL OR weight=0)"
         );
    }
}
else
{
    sql = "UPDATE Assignment SET assgroup='Ungraded', scale=100 WHERE  Assignment.semester='" + semester1 + "' AND course='"+course1 + "' AND ( scale is NULL or scale=0) AND  (Assignment.sessionname='" + sessionname1 + "' OR Assignment.sessionname LIKE '%," + sessionname1 + "' OR Assignment.sessionname LIKE '" + sessionname1 + ",%' OR Assignment.sessionname LIKE '%," + sessionname1 + ",%')";
    if (adapter.executeUpdate(sql) < 0) 
    {
        out.print(adapter.error());
    }
}
try
{
    sql = "DELETE FROM Assgroup WHERE  semester='" + semester1 +"' AND course='"+course1 + "' AND sessionname='" + sessionname1 + "' AND name NOT IN (SELECT assgroup from Assignment WHERE Assignment.semester='" + semester1 + "' AND course='" + course1 +"' AND   (Assignment.sessionname='" + sessionname1 + "' OR Assignment.sessionname LIKE '%," + sessionname1 + "' OR Assignment.sessionname LIKE '" + sessionname1 + ",%' OR Assignment.sessionname LIKE '%," + sessionname1 + ",%'))";
    if (adapter.executeUpdate(sql) < 0) 
    {
        out.print(adapter.error());
    }
}catch(Exception ee){ }
adapter.close();
 

String style= Toolbox.butstyle(cachedstyle.fontsize).replaceFirst("background:[^\\)]*\\);","");
%> 
<!--<%=semester%> -->
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><title><%=Toolbox.emsgs(orgnum,229)%></title>
<%=Toolbox.getMeta(orgnum)%>
<style type="text/css"> 
     input.BG {background-color:<%=cachedstyle.TBGCOLOR%>; color:<%=cachedstyle.IBGCOLOR%>; border:0;text-align:right}
    input.BG1 {background-color:<%=cachedstyle.TBGCOLOR%>; border:0;text-align:right}
    input.BG2 {background-color:<%=cachedstyle.TBGCOLOR%>; border:0}
</style>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("aggregate2.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>
</head>
<body  style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 0px 5px" onload=onstart() >
<center> 
<%=Toolbox.title(title)%> 
<table><tr height="5px"><td> </td></tr></table>
   
<form  name=form1 style="margin:4px 0px 0px 0px"  method=post action=aggregate3.jsp?submittimes=1 style="margin:0px 0px 0px 0px"  rel=opener >
<font  color=<%=cachedstyle.IBGCOLOR%> >    
<% 
 int percent = 40;
 if (grouping.equals("0")) 
 {
       out.print(Toolbox.emsgs(orgnum,257));
       percent = 450;
 } 
 else 
 {
       out.print(Toolbox.emsgs(orgnum,256));
       percent = 270;
 } 
%>   
</font>   (<input name=grouping style=background-color:transparent type=checkbox  <%=grouping.equals("1")?"CHECKED":""%>  name=ee onclick=redo(this)> <%=groupingstr%>)
<input type=hidden name=cid         value="<%=cid%>"     >
<input type=hidden name=subdb       value="<%=user.id%>" >
<input type=hidden name=title       value="<%=title%>"   >
<input type=hidden name=grouping    value="<%=grouping%>" >
<input type=hidden name=sessionname value="<%=sessionname%>" >
<input type=hidden name=absentdeduct value="<%=absentdeduct%>" >
<input type=hidden name=semester    value="<%=semester%>" > 
<table width=100% align=center cellspacing=0 cellpadding=0> 
<tr><td align=center>
<iframe style="margin:0px 0px 0px 0px;padding:0 0 0 0" frameborder=0 name=summary   height=<%=percent+50%>  width=100% ></iframe> 
</td></tr>

<% if (!grouping.equals("0") ) {%>
<tr><td  align=center>
<font   color=<%=cachedstyle.IBGCOLOR%> >  <%=Toolbox.emsgs(orgnum,259)%>  </font> <br>
<iframe  style="margin:0px 0px 0px 0px;padding:0px 0px 0px 0px"  marginheight=0 marginwidth=0 frameborder=0  name=group src=""   height=<%=percent-50%>  width=100% > </iframe>
</td></tr>
<%}%>
 
 

<tr><td align=center> 
<input class=OrangeButton   name=btnsave   type=button Value=Save tabindex=2 onclick ="savenums()"   onMouseOver="showmyhint(0)"   onMouseOut="hidemyhint()"
<%if (!grouping.equals("0")) {%>
><input class=RedButton  name=btndel   type=button Value=Delete tabindex=1 onclick ="delnums()"   onMouseOver="showmyhint(1)"   onMouseOut="hidemyhint()"
<%}%>
><input class=GreenButton   name=btnproc   type=button Value=Proceed tabindex=3 onclick ="proceed()"   onMouseOver="showmyhint(2)"   onMouseOut="hidemyhint()"
><input class=RedButton   name=btnold    type=button value=ClearOld tabindex=4  onclick ="clearOld()"   onMouseOver="showmyhint(3)"   onMouseOut="hidemyhint()"
><input class=GreenButton   name=btnrefresh   type=button Value="<%=Toolbox.emsgs(orgnum,93) %>" tabindex=2 onclick ="redo(document.form1.grouping)"  ><input class=GreenButton  name=btnhelp type=button value=Help onclick="showhelp()" tabindex=5>

</td></tr></table> 
</form>
<script type="text/javascript"  >
var needtranslator = false;
var grouping = <%=grouping%>; 
 if (grouping!=0) 
 { 
    document.form1.btndel.value= textmsg[69];
 } 
var userid = '<%=user.id%>';   
var course='<%=cid%>';
var font_size = <%=cachedstyle.fontsize%>;
var tstmp = <%=tstmp%>;
var semester='<%=semester%>';
var sessionname = '<%=sessionname%>';
var hints = ["","","","","",""];
var msg1558 = "<%=Toolbox.emsgs(orgnum,1558)%>";
hints[0]=textmsg[68];
hints[1]="<%=Toolbox.emsgs(orgnum,425)%>";
hints[2]=textmsg[65];
hints[3]=textmsg[72];
 <%=Toolbox.msgjspout((orgnum%65536)+user.id, true)%>
 
</script> 
<div id="copyright"> 
<font size=-1 color=#4d5ddd ><nobr> <%= Toolbox.copyright[orgnum>>16]%> </nobr></font> 
</div>
<script type="text/javascript"     src=aggregate2.js></script>
<script type="text/javascript"     src=hints.js></script>
<script type="text/javascript"    src=helpformat.js></script>
<script type="text/javascript"     src=curve.js></script>
</center>
</body>
</html>
