<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%!
    String fields2(String str,int orgnum, CachedStyle cachedstyle){return "<table cellspacing=0 cellpadding=0><tr ><td style=\"background-image:linear-gradient(to right," + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ");color:#DDCC11;text-shadow:-1px -1px #060606\"><b><NOBR>" + str +"</NOBR></b></td></tr></table>";}
    String fields(StringBuffer labelbuf, int i, String str, int orgnum, CachedStyle cachedstyle)
    {
        labelbuf.append(str + "','");
        return "<table  cellspacing=0 cellpadding=0 width=100% ><tr   width=100% ><td width=100%   style=\"padding:1px 3px 1px 3px;background:linear-gradient(to right," 
            + cachedstyle.IBGCOLOR 
            + "," 
            +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ");height:" 
            + (i+4) 
            + "px;width:" + Toolbox.charwidthrate()*i +"px\"    bgcolor=" 
            + cachedstyle.IBGCOLOR + " valign=middle ><div style=\"text-shadow:-1px -1px #060606;color:#DDCC11\" id=\"" 
            + str.replaceAll(" ","") + "\"><b><NOBR>" 
            + str.replaceFirst("<br>", "</nobr><br><nobr>")  
            +"</NOBR></b></div></td></tr></table>";
   }
   String disk(int i, CachedStyle cachedstyle)
   {
       return "<div style=\"font-family:arial;font-weight:700;width:"
               +  (cachedstyle.fontsize*1.5)  
               +  "px;border-radius:" + (cachedstyle.fontsize*0.75)  
               + "px;font-size:" + 
               + cachedstyle.fontsize + "px;color:#ddcc11;line-height:" 
               + (1.5*cachedstyle.fontsize) + "px;text-align:center;background-color:" + cachedstyle.IBGCOLOR +
               "\" >" + (i+1) + "</div><a href=\"#" +  i + "\"  />";
   }
   String fd(String fd, String sp)
   {
       sp = sp.trim();
       return " and ("  + fd  + " LIKE '%" + sp  + "' OR "  + fd  + " LIKE '" + sp  + "%' OR "  + fd  + " LIKE '%" + sp  + "%' OR " + fd + " = '" + sp + "')"  ;
   }
   
   String fd1( String sp)
   {
       sp = sp.trim();
       if (sp.contains(">") || sp.contains("<"))
       return " and Submission.grade " + sp;
       return " and Submission.grade=" + sp;
        
   }
    
   // DBConnectInfo d= new DBConnectInfo("jdbc:mysql://localhost:3306/test","com.mysql.jdbc.Driver","root","tomcat00",orgnum); 
   // JDBCAdapter adapter =new JDBCAdapter("jdbc:mysql://localhost:3306/test","com.mysql.cj.jdbc.Driver","root","tomcat00",orgnum);
    
   // int nn = adapter.executeQuery("SELECT * FROM AppUser where id='D10030303'");
    
   // adapter.close();
   // User user = new User(orgnum,"D10059906", "", 63, d,"");
//if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.INSTRUCTOR|Systemroles.TEACHINGADMIN,application,session,request, response, "gradeproj.jsp", true)) == null)
// return;
%>

<%
int orgnum = Toolbox.setcharset(request,response);
if (orgnum == -1) return;
User user = null;
if (  (user = User.authorize(orgnum, Systemroles.ASSESSER | Systemroles.INSTRUCTOR | Systemroles.SYSTEMANALYST ,application,session,request, response, "gradeproj.jsp", false)) == null|| !Toolbox.verifytoken(request)) 
    return;    
user.changedb(user.id);

String grade =  Toolbox.defaultParam(orgnum, request, "grade", "").trim();
String sid =  Toolbox.defaultParam(orgnum, request, "sid", "").trim();
String assess =  Toolbox.defaultParam(orgnum, request, "assess", "").trim();
String comment =  Toolbox.defaultParam(orgnum, request, "comment", "").trim();
String course =  Toolbox.defaultParam(orgnum, request, "course", "").trim();
String assignname =  Toolbox.defaultParam(orgnum, request, "assignname", "").trim();
String questionnum =  Toolbox.defaultParam(orgnum, request, "questionnum", "0").trim();
if (questionnum.equals(""))questionnum ="0";
String sessionname =  Toolbox.defaultParam(orgnum, request, "sessionname", "").trim().replaceAll(" ","");
String sessionnames =  Toolbox.defaultParam(orgnum, request, "sessionnames", "").trim().replaceAll(" ","");
String semester =  Toolbox.defaultParam(orgnum, request, "semester", Toolbox.dbadmin[orgnum%65536].currentSemester);
String content =  Toolbox.defaultParam(orgnum, request, "content", "").trim();
String attach =  Toolbox.defaultParam(orgnum, request, "attach", "").trim(); 
String tester =  Toolbox.defaultParam(orgnum, request, "tester", "").trim(); 
String way = Toolbox.defaultParam(orgnum, request, "way", "select");

JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (way.equals("save"))
{
   if (course.equals("") || assignname.equals("")) 
    {
       out.println("No course or assign name ");
       return;
    } 
   long l = ~~(System.currentTimeMillis() / 1000);
   String sql = "UPDATE Submission SET lastupdate=" + l + ", grade=" + grade + ",assess='" + assess.replaceAll("'","''") + "',comment='" + comment.replaceAll("'","''") + "'  where course='" + course + "' and assignname='" + assignname + "' and semester='" + semester + "' and sid='" + sid + "'";
   
   int n = adapter.executeUpdate(sql);
   adapter.close();
   if (n >= 0)
      out.println(Toolbox.emsgs(orgnum,71));
   else
      out.println("Failed:" + adapter.error() + sql);
   return;
}
else if (way.equals("save2"))
{
   if (course.equals("") || assignname.equals("")) 
    {
       out.println("No course or assign name ");
       return;
    } 
   long l = ~~(System.currentTimeMillis() / 1000);
   CSVParse p  =  new CSVParse(content, '"', new String[]{",", ";"}); 
   String [] x;
   int K = 0; 
   int m = 0;
   StringBuffer sb = new StringBuffer();
   while (( x = p.nextRow())!= null )
   {
      String sql = "UPDATE Submission SET lastupdate=" + l + ", grade=" + x[1] + ",assess='" + x[3].replaceAll("'","''") + "',comment='" + x[2].replaceAll("'","''") + "'  where course='" + course + "' and assignname='" + assignname + "' and semester='" + semester + "' and sid='" + x[0] + "'";
      int n = adapter.executeUpdate(sql);
      if (n < 0) sb.append(sql + adapter.error());
      //System.out.println(semester);
      m++;
      if (n > 0) K += 1;
   }
   adapter.close();
   if (K > 0)
      out.println(Toolbox.emsgs(orgnum,71) + "; " + K);
   else
      out.println("Failed:" + sb.toString());
   return;
}
else if (way.equals("save0") )
{
   if (course.equals("") || assignname.equals("")) 
    {
       out.println("No course or assign name ");
       return;
    } 
   long l = ~~(System.currentTimeMillis() / 1000);
   String answer ="";
   int nn = 0; 
   String sql0 = "";
   if (!questionnum.equals("0"))
   {
       sql0 = "SELECT answer  FROM Assignment WHERE course='" + course.replaceAll("'", "''") + "' AND name='"
                  + assignname.replaceAll("'", "''") + "' AND semester='" + semester.replaceAll("'", "''")
                  + "'  AND  sessionname ='" + sessionnames + "'";
       nn = adapter.executeQuery(sql0);
       if (nn == 1)
       {
           String [] xx = adapter.getValueAt(0,0).split("((?=\n[0-9]+[\\.|:| |\\)]))");
           StringBuffer sb = new StringBuffer("");
           for (int j=0; j < xx.length; j++)
           {
               if (xx[j].replaceFirst("\n","").startsWith(questionnum))
               {
                   sb.append("\n" + questionnum + ". " + content);
               }
               else
                   sb.append(xx[j]);
           }
           answer = sb.toString();
       }
   }
   else 
       answer = content; 
   String sql = "UPDATE Assignment SET lastupdate=" + l + ",  answer='" + answer.replaceAll("'","''") + "'  where course='" + course + "' and  name='" + assignname + "' and semester='" + semester + "' and sessionname='" + sessionnames + "'";
   
   int n = adapter.executeUpdate(sql);
   adapter.close();
   if (n == 1)
      out.println(Toolbox.emsgs(orgnum,71));
   else
      out.println("Failed:" + adapter.error());
   return;
}
else  if (way.equals("save1") )
{
   if (course.equals("") || assignname.equals("")) 
   {
       out.println("No course or assign name ");
       return;
   } 
   String status =  Toolbox.defaultParam(orgnum, request, "status", "3").trim();
   String sql = "UPDATE Assignment SET   status=" + status + " where course='" + course + "' and  name='" + assignname + "' and semester='" + semester + "' and sessionname='" + sessionnames + "'";
   
   int n = adapter.executeUpdate(sql);
   adapter.close();
   if (n == 1)
      out.println(Toolbox.emsgs(orgnum,71));
   else
      out.println("Failed:" + adapter.error());
   return;
}
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%> 
<% 
CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
//String title = Toolbox.defaultParam(orgnum,request, ("Comment"), null);
%>
<head> 
   <%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
   <script type=text/javascript><%= Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("gradeproj.jsp","f1")%>"; 
<%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
   <script type=text/javascript  src=cookie.js></script>
   <script>
    var ss = {"semester":"<%=semester%>",
    "course":"<%=course%>",
    "sessionname":"<%=sessionname%>",
    "assignname":"<%=assignname%>",
    "questionnum":"<%=questionnum%>",
    "sid":"<%=sid%>",
    "grade":"<%=grade%>",
    "comment":"<%=comment%>",
    "content":"<%=content%>",
    "attach":"<%=attach%>",
    "tester":"<%=tester%>",
    "basedon":"0"
    };
    
   </script> 
   <title><%=Toolbox.emsgs(orgnum,484)%></title>
  
   <style>
       input.txtfield{background-color:white;color:black;border:1px #666666 solid;border-radius:3px}
       textarea{background-color:white;color:black;border:1px #666666 solid;border-radius:3px;font-family:courier!important}
       table.c{backgroud-color:<%=cachedstyle.DBGCOLOR %>}
       option{ font-weight:700 }
   </style>
  

</head>
<% 
    
   String lbls[] =  Toolbox.emsgs(orgnum ,1619).split("@"); 
   StringBuffer labelbuf = new StringBuffer(); 
//0:Grading Tool for Programing Project/Questions
//1:Student ID LIKE
//2 Grade LIKE
//3 Comment LIKE
//4 Content LIKE
//5 Attach LIKE
//6 Testing Service
//7 Select
//8 Grade All
//9 Test Run@Save
  %>
  <body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px"  >
      
<center>
   
 
<table align="center" cellspacing="3" cellpadding="3"  > 
    <%=Toolbox.title(lbls[0],1)%>
  <tr><td  width="100%" >   
    <form name="f00" method="post" action="gradeproj.jsp" target="_self">                
         <table class="outset3" border="0" id="sel" width="100%">
             <tr><td  width="35%" rowspan="6" valign="top" align="left"  style="width:87px !important"> 
                          <input type="button" class=GreenButton  style=width:78px value="<%=lbls[7]%>" onclick='choose()'>
                          <input  class=GreenButton  name="gradeall" style=width:78px type="button" value="<%=lbls[8]%>" onclick="doall()" > 
                          <center><span id=order></span><span id=order1></span></center>
                          <input  class=OrangeButton  name="saveall1" style=width:78px type="button" value="SaveAll" onclick="javascript:saveall()" >
                          <input  class=OrangeButton  name="publish1" style=width:78px type="button" value="<%=lbls[21]%>"  onclick="javascript:save('p')" >
                   </td>
                 
                 <td  width=85><%=fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,1004)+"<span style=float:right>=</span>", orgnum, cachedstyle)%></td>
                 <td width="30%"><select name=semester  style="font-family:inherit"   onchange="switchs(this)"><%= Toolbox.dbadmin[user.orgnum%65536].semesteropts(semester, orgnum) %></select></td>
                 <td width="5%"></td>
                 <td  width=85><%=fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,430)+"<span style=float:right>=</span>", orgnum, cachedstyle)%></td>
                 <td  width="30%"><input name="course" value="<%=course%>" class="txtfield" style="color:#666666" value="35-121" onfocus="clearhint(this)" onblur="puthint(this)"></td>
             </tr>
            <tr>
                <td  width=85><%=fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,233)+"<span style=float:right>&supe;</span>", orgnum, cachedstyle)%></td>
                <td width="30%"><input name="sessionname" value="<%=sessionname%>"  class="txtfield"  style="color:#666666" value="N1,N2"  onfocus="clearhint(this)" onblur="puthint(this)"></td>
                <td width="5%"> </td>
                <td width=85><%=fields(labelbuf,cachedstyle.fontsize,"<table cellpadding=0 cellspacing=0  width=100% ><tr><td>" +lbls[1]+"</td><td align=right>&supe;</td></tr></table>", orgnum, cachedstyle)%></td>
                <td width="30%"><input name="sid" value="<%=sid%>"  class="txtfield"  style="color:#666666" value="12345678"  onfocus="clearhint(this)" onblur="puthint(this)"></td> 
             </tr>
            <tr>
                <td  width=85><%=fields(labelbuf,cachedstyle.fontsize,"<nobr>"+Toolbox.emsgs(orgnum,213)+" <span style=float:right>=</span></nobr>", orgnum, cachedstyle)%></td>
                <td  width="30%"><input name="assignname" value="<%=assignname%>"  class="txtfield"  style="color:#666666" value="Homework1"  onfocus="clearhint(this)" onblur="puthint(this)"></td>  
                <td width="5%"></td>
                <td width="78"><%=fields(labelbuf,cachedstyle.fontsize, Toolbox.emsgs(orgnum,50)+" # " + "<span style=float:right>=</span></nobr>", orgnum, cachedstyle)%></td>
                <td  width="30%"><select name="questionnum"><option style=fontWeight:700 value=""></option><option style=fontWeight:700 value="1">1</option><option style=fontWeight:700 value="2">2</option>
                  <option style=fontWeight:700 value="3">3</option><option style=fontWeight:700 value="4">4</option><option style=fontWeight:700 value="5">5</option>
                  <option style=fontWeight:700 value="6">6</option><option style=fontWeight:700 value="7">7</option><option style=fontWeight:700 value="8">8</option>
                  <option style=fontWeight:700 value="9">9</option><option style=fontWeight:700 value="10">10</option></select></td>
            </tr>
            <tr> 
                <td width=85> <%=fields(labelbuf,cachedstyle.fontsize,lbls[4]+"<span style=float:right>&supe;</span>", orgnum, cachedstyle)%></td>
                <td  width="30%"><input name="content"  value="<%=content%>"  class="txtfield"  style="color:#666666" value="class"  onfocus="clearhint(this)" onblur="puthint(this)"></td>
                <td  width="5%"></td>
                <td width=85> <%=fields(labelbuf,cachedstyle.fontsize,lbls[3]+"<span style=float:right>&supe;</span>", orgnum, cachedstyle)%></td>
                <td width="30%"><input name="comment"  value="<%=comment%>"  class="txtfield"  style="color:#666666" value="Error"  onfocus="clearhint(this)" onblur="puthint(this)"></td></tr>
             <tr>
                 <td width=85> <%=fields(labelbuf,cachedstyle.fontsize,lbls[2], orgnum, cachedstyle)%></td>
                 <td  width="30%"><input name="grade"  value="<%=grade%>"  class="txtfield"  style="color:#666666" value="<=60"  onfocus="clearhint(this)" onblur="puthint(this)"></td>
                 <td  width="5%"></td>
                 <td width=85> <%=fields(labelbuf,cachedstyle.fontsize,lbls[5], orgnum, cachedstyle)%></td>
                 <td width="30%"><select name="attach"  style=fontWeight:700><option style=fontWeight:700 value="0"><%=lbls[18]%></option><option style=fontWeight:700 value="1"><script>document.write(textmsg[848])</script></option><option style=fontWeight:700 value="2"><script>document.write(textmsg[849])</script></option></select></td>
             </tr>
             <tr>
                 <td width=85> <%=fields(labelbuf,cachedstyle.fontsize,"<nobr>" + lbls[6]+"  =</nobr>", orgnum, cachedstyle)%></td>
                 <td colspan="2"  width="35%"><input name="tester"  value="" size="30" class="txtfield"  style="font-weight:700" value="GradeJava"></td>
                 <td width=85> <%=fields(labelbuf,cachedstyle.fontsize,"<nobr>" + lbls[19]+"  </nobr>", orgnum, cachedstyle)%></td>
                 <td   width="30%"><select name="basedon"  style=fontWeight:700 onchange="changebased(this)"><option style=fontWeight:700 value="0" selected><%=lbls[13].replaceFirst("<br>"," ")%></option><option style=fontWeight:700 value="1"><%=lbls[20]%></option></select>
                 </td>
              </tr>
           </table> 
    </form>
</td></tr>
<%
    
int i = 0,k1,k2;    
String ans = "";
String scale = "", asassess="", fullscore = "0", score = "0", subfull="0"; 
int qn = 0;
if (!questionnum.equals("")) 
try{
     qn = Integer.parseInt(questionnum);
}catch(Exception e){}
if (!course.equals("") && !assignname.equals("")) 
{
  String uid = user.id;
  String sql = "SELECT answer,assess,scale,sessionname  FROM Assignment WHERE course='" + course.replaceAll("'", "''") + "' AND name='"
                        + assignname.replaceAll("'", "''") + "' AND semester='" + semester.replaceAll("'", "''")
                        + "' AND (sessionname LIKE '" + sessionname + ",%' OR sessionname LIKE '%," + sessionname + ",%' OR sessionname LIKE '%," 
                        + sessionname + "' OR sessionname ='" + sessionname + "')";
  String  sql0 = "UPDATE Assignment SET status=3 WHERE course='" + course.replaceAll("'", "''") + "' AND name='"
                        + assignname.replaceAll("'", "''") + "' AND semester='" + semester.replaceAll("'", "''")
                        + "' AND (sessionname LIKE '" + sessionname + ",%' OR sessionname LIKE '%," + sessionname + ",%' OR sessionname LIKE '%," 
                        + sessionname + "' OR sessionname ='" + sessionname + "')"; 
  int nn  = adapter.executeUpdate(sql0);
  nn = adapter.executeQuery(sql);
  if (nn < 0)
  {
      adapter.close();
      out.println(sql + "<br>" + adapter.error());
       return;
  }
  else if (nn == 0)
  {
      adapter.close();
      out.println("You are not authorizied to grade this set of assignments");
      return;
  }
  ans = adapter.getValueAt(0,0);
  if (qn!=0)
  {
     String [] xx = ("0\n" +ans.trim() ).split("((?=\n[0-9]+[\\.|:| |\\)]))");
     
     for (String z: xx)
     {
         if (z.equals("0")) continue;
         z = z.replaceFirst("\n","").trim();
         int jj = 0; char c;
         while ( (c = z.charAt(jj)) >= '0' && c <= '9') jj++;
         String num = z.substring(0,jj);
         if (num.equals(questionnum)) 
         {
             ans = z.substring(jj+1).trim();
             break;
         }
     } 
  }
  fullscore = adapter.getValueAt(0,2);
  subfull = fullscore;
  asassess = adapter.getValueAt(0,1);
  sessionnames = adapter.getValueAt(0,3);
  if (qn!=0)
  {
         CSVParse p = new CSVParse(asassess,'|',new String[]{",",";"});
         String [][] xx = p.nextMatrix();
         for (int kk=0; kk < xx.length; kk++)
         {
            if (xx[kk][0].equals(questionnum)) 
            {
                subfull = xx[kk][1]; 
                break;
            }
         }
  }
  String sidstr = "", gradestr = "", commentstr= "", contentstr= "",  attachstr="";
  if (sid!=null && !sid.equals("")) sidstr = fd("Submission.sid", sid);  
  if (grade!=null && !grade.equals("")) gradestr = fd1( grade);
  if (comment!=null && !comment.equals("")) commentstr = fd("Submission.comment", comment); 
   
  if (content!=null && !content.equals("")) contentstr = fd("content", content);
   
  if (attach!=null &&  attach.equals("1")) 
      attachstr = " and (NOT attach='' )"; 
  else  if (attach!=null &&  attach.equals("2")) 
      attachstr = " and ( attach='')";
  else attachstr = "";
  sql = "SELECT Submission.sid, Submission.content, Submission.grade, Submission.assess,Submission.attach,Submission.comment FROM Submission LEFT JOIN Registration on Submission.sid=Registration.sid AND  Submission.semester=Registration.semester and  Submission.course=Registration.courseid  WHERE  Registration.sessionname IN  ('" + sessionname.replaceAll(",", "','") + "')  AND Submission.course='" + course + "' and Submission.assignname='" + assignname + "' and Submission.semester='" + semester + "' " + sidstr + gradestr + commentstr + contentstr + attachstr + " order by sid";
  sql = sql.replaceAll(" and  \\([ ]*\\)","");
%>
<tr><td  width="100%" >
     <form name=fm id=fm method=post action=gradeproj.jsp >
         <table border=0 class=outset3 width=100% id="ans0"><tr><td valign=top width=85><%= fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,53), orgnum, cachedstyle)%>
                     <br><input  class=GreenButton type=button name=comp  style=width:78px 
                       onclick="javascript:test('')" value="<%= lbls[9]%>" > <br>
                  <input  class=OrangeButton type=button name=save1  style=width:78px onclick="javascript:loop=false;save('')" value="<%= lbls[10]%>" > 
               <input name=sessionnames type=hidden value="<%= sessionnames%>" ><input name=sid type=hidden value="<%=user.id%>"></td>
                 <td  valign=top><textarea rows=10 cols=70 name=content onchange="javascript:ansarr=null;" ><%=ans%></textarea></td>
                 <td valign=top><div  id=msg  style="overflow-y:auto;width:100%"></div></td></tr>
         </table>
     </form>
</td></tr>
<%  
  boolean b = adapter.executeQuery2(sql,false);
  java.util.ArrayList <String> lt = new ArrayList<>();
  
  if (!b)
  {
      out.println(sql + adapter.error());
  }
  else
  for (i=0; i < 210;i++)
  {
      sid = adapter.getValueAt(i,0);
      if (sid == null) break;
      out.println("<tr><td  width=100%  ><form name=f" + i + " id=\"fm" + i + "\"  method=post action=gradeproj.jsp style=\"margin:3px 0px 3px 0px\"><table class=outset3 width=100% style=\"margin:0px px 0px 0px 0px\" id=maintbl" + i + " >");
      content = adapter.getValueAt(i,1);
      if (content == null) content = ""; 
      if (qn != 0)
      {
         CSVParse p = new CSVParse(content,'\'',new String[]{",","\n"});
         String [][] xx = p.nextMatrix();
         for (int kk=0; kk < xx.length; kk++)
         {
            if (xx[kk][0].equals(questionnum)) 
            {
                content = xx[kk][1];
                break;
            }
         }
         
      }
      grade = adapter.getValueAt(i,2);
      String subgrade = grade;
      assess = adapter.getValueAt(i,3);
      attach = adapter.getValueAt(i,4);
      comment = adapter.getValueAt(i,5);
      if (qn!=0)
      {
         CSVParse p = new CSVParse(assess,'|',new String[]{",",";"});
         String xx[][] = p.nextMatrix();
         score = "0";
         for (int jj=0; jj < xx.length; jj++)
         {
            if (xx[jj][0].equals(questionnum)) 
            {
                //subfull = xx[jj][1];
                score = xx[jj][2];
                break;
            }
         } 
      }
      if (attach == null) attach = "";
      if (questionnum.equals("") && !content.contains("public class") && attach!=null && attach.length() > 4)
      {
          String [] ss = attach.split(",");
          for (int k=0; k < ss.length; k++)
          {
              if (ss[k] == null || !ss[k].contains("@")) continue;
              String [] qs = ss[k].split("@");
              if (qs[0].contains(".java") && qs.length>2)
              {
                 
                 try{
                    qs[2] = (new Encode6b(orgnum)).rto6b(qs[2]); 
                    content = new Scanner(new java.io.File(qs[2])).useDelimiter("\\Z").next();
                    if (content.contains("public class")) lt.add("UPDATE Submission set content='" + content.replaceAll("'","''") +"' where course='" + course + "' and assignname='" + assignname + "' and semester='" + semester + "' and sid='" + sid + "'");
                 }catch(Exception e){ }
              }
              
          }
          if (!content.contains("public class"))
          for (int k=0; k < ss.length; k++)
          {
              if (ss[k] == null || !ss[k].contains("@")) continue;
              String [] qs = ss[k].split("@");
              if (qs[0].contains(".txt") && qs.length>2)
              {
                 
                 try{
                    qs[2] = (new Encode6b(orgnum)).rto6b(qs[2]); 
                    content = new Scanner(new java.io.File(qs[2])).useDelimiter("\\Z").next();
                    if (content.contains("public class")) lt.add("UPDATE Submission set content='" + content.replaceAll("'","''") +"' where course='" + course + "' and assignname='" + assignname + "' and semester='" + semester + "' and sid='" + sid + "'");
                 }catch(Exception e){}
              }
              
          }
          if (!content.contains("public class"))
          for (int k=0; k < ss.length; k++)
          {
              if (ss[k] == null || !ss[k].contains("@")) continue;
              String [] qs = ss[k].split("@");
              if (qs[0].contains(".doc") && qs.length>2)
              {
                 
                 try{
                    qs[2] = (new Encode6b(orgnum)).rto6b(qs[2]); 
                     
                 }catch(Exception e){}
              }
              
          }
          
      }
      
      content = content.trim(); 
      int kk =  content.indexOf("package");
      if (kk >= 0)
      {
        int kkk = content.indexOf("import ",kk);
        if (0 < kkk)
        { 
           content = content.substring(kkk);
         }
      }
      out.println("<tr><td  width=85>" + disk(i,cachedstyle) + "</td>"
              +"<td  width=0% ><table widgth=0% ><tr><td  width=0% >" +    fields(labelbuf,cachedstyle.fontsize, lbls[11], orgnum, cachedstyle).replaceAll("100%", "70")  + "</td>"
              + "<td valign=center align=left width=0% ><input name=sid  value="+ sid + "  class=txtfield size=9></td><td width=5% ></td>"
              +"<td width=0% >"  +  fields(labelbuf,cachedstyle.fontsize,lbls[12], orgnum, cachedstyle).replaceAll("100%", "70") +  "</td>"
              +  (qn != 0?( "<td  valign=center  align=left width=0%  ><input name=score value="+ score +"   class=txtfield size=4   ></td><td>/" + subfull  
              +"</td><td width=5% ></td><td>" + fields(labelbuf,cachedstyle.fontsize,Toolbox.emsgs(orgnum,225), orgnum, cachedstyle)  +  "</td><td  align=left width=0% ><input name=grade  value="+ grade + "  class=txtfield size=4  ></td><td>" + fullscore +"</td></tr></table></td>"):
                 ("<td  valign=center  align=left width=0%  ><input name=grade   value="+ grade + "  class=txtfield size=4  ></td><td>/" +  fullscore + "</td></tr></table></td>" ))
              + "<td valign=top   width=50% >" +    fields(labelbuf,cachedstyle.fontsize, lbls[20], orgnum, cachedstyle).replaceAll("100%", "70")  + "</td></tr>"); 
      out.println("<tr><td valign=top>" +  fields(labelbuf,cachedstyle.fontsize,lbls[13], orgnum, cachedstyle) + "<br><input  class=GreenButton  style=width:78px name=test1 id=test" + i + "  type=button onclick=\"javascript:loop=false;grade1(" 
              + i + ")\" value=\"" +   lbls[9]  
              + "\" > <br><input  class=OrangeButton type=button name=save1 type=Orange style=width:78px onclick=\"javascript:loop=false;save(" + i 
              + ")\" value=\"" +   lbls[10]  + "\"></td><td  ><textarea rows=15 cols=70 name=content  style=font-family:courier!important>"+ content + "</textarea></td><td valign=top rowspan=" + (attach.length()> 10? 4:3) + " width=50% ><div  id=msg" + i + " style=\"overflow-y:auto;width:100%\"></div></td></tr>");
      out.println("<tr><td valign=top>" +  fields(labelbuf,cachedstyle.fontsize,lbls[14], orgnum, cachedstyle) + "</td><td ><input name=comment size=75 value=\"" + comment + "\"   class=txtfield ></td></tr>");
      
      out.println("<tr><td valign=top>" +  fields(labelbuf,cachedstyle.fontsize,lbls[15], orgnum, cachedstyle) + "</td><td  ><textarea name=assess   cols=70 rows=15>" + assess + "</textarea></td></tr>");
     
      if (attach.length()> 10)
      {
          out.println("<tr><td valign=top>" +  fields(labelbuf,cachedstyle.fontsize,lbls[16], orgnum, cachedstyle) + "</td><td  ><table>");
          String [] ss = attach.split(",");
          for (int l=0; l < ss.length; l++)
          {
              if (ss[l]==null || ss[l].length() < 10) continue;
              String xx[] = ss[l].split("@"); 
              if (xx.length < 3) continue;
              try{
              out.println("<tr><td>" + (new Encode6b(orgnum)).rto6b(xx[2]).replaceFirst(".*(" + user.id + ".*$)", "$1") + "</td><td><a href=\"FileOperation?did=" + xx[2] + "\" >"+ lbls[17] + " </a></td></tr>");
              }catch(Exception e){ out.println("<tr><td >" + xx[0] + "</td></tr>");}
          }
          out.println("</table></td></tr>");
      }
      out.println("</table></form></td></tr>");
  }
  for (String xx:lt) adapter.executeUpdate(xx);
  adapter.close();
}

%>
        </table> 
        
<script>
var N = <%=i%>; 
var ans = "<%= Generic.handle(ans) %>"; 
var fullscore = <%= fullscore%>;
var subfull = <%=subfull%>;
var asassess = "<%= Generic.handle(asassess) %>"; 
var qn = <%=qn%>;
var att = ['<%=lbls[18]%>', textmsg[848], textmsg[849]]; 
var testrun = "<%=lbls[9] %>"; 
var gall = "<%=lbls[8] %>";    
var closet = "<%=Toolbox.emsgs(orgnum,82)%>";    
var lbls = "<%=Toolbox.emsgs(orgnum,1619)%>".split(/@/);  
 
</script> 
<script type="text/javascript" src=gradeproj.js ></script> 
<script type="text/javascript" src=curve.js ></script> 
</body>
</html>

