<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%!
public class CreateTableThread extends Thread 
{
    public CreateTableThread(JDBCAdapter adapter,String sql) 
    { 
         this.adapter = adapter;
         this.sql = sql;
    }
    JDBCAdapter adapter;
    String sql;
    public void run()
    {
         String [] sqls = sql.split(";");
         for (int i=0; i < 2; i++)
            adapter.executeUpdate(sqls[i]);
         adapter.close();
    }
}
%>
<%
long tstmp = System.currentTimeMillis()%10000000;    
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.TEACHINGADMIN | Systemroles.ASSESSER | Systemroles.SYSTEMADMIN,application,session,request, response, "schedulerindex.jsp", true)) == null) 
    return;
orgnum=user.orgnum;
boolean admin = true;//user.department.equals("");
%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("schedulerindex.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >
document.write(unifontstyle(<%=cachedstyle.fontsize%>));
</script>
<style type="text/css"> input.BG2{background-color:<%=cachedstyle.IBGCOLOR%>}</style> 
</head>
<body style="margin:6px 12px 6px 6px;background:<%= cachedstyle.IBGCOLOR %> right url(image/backgd.gif) repeat-y">
<Center>
<%=Toolbox.logtitle( Toolbox.emsgs(orgnum,911) , 210)%>
<%
String initsemester = Toolbox.defaultParam(orgnum,request,"semester", null, "@", 30); // 
String currentsemester = Toolbox.dbadmin[orgnum%65536].currentSemester;
int currentsemesterindex = 0;
String currentsemestername="";

JDBCAdapter adapter = null;

int nt;

if (initsemester!=null && initsemester.equals("@"))
{  
%> 
<form rel=opener name=f method=post action=schedulerindex.jsp style="margin:5px 0px 0px 0px" onsubmit="return test()"  > 
<table class=outset align=center width=100% cellpadding=2 cellspacing=1 > 
<tr><td style="text-shadow:-1px -1px #060606;color:#DDCC11" width=100% >
  <script type="text/javascript" > document.write(textmsg[770].replace(/2008/, (new Date()).getYear()+1901));</script>
:</td></tr>
<tr><td align=center  width=100% > 
 <input name=semester class="left" size=20>
</td></tr>
<tr><td  style="text-shadow:-1px -1px #060606;color:#DDCC11"><%=Toolbox.emsgs(orgnum,1327)%>:
</td></tr>
<tr><td align=center  width=100% style="color:#DDCC11;text-shadow:-1px -1px #060606;"><b><%=Toolbox.emsgs(orgnum,1004)%></b> 
 <select name="semesterold"><%= Toolbox.dbadmin[user.orgnum%65536].semesteropts(null, orgnum) %></select>
</td></tr>
<tr height=5><td align=center > 
</td></tr>
</table>
<br>
      <input name=bt type=submit class=GreenButton style="width:<%=(int)(Math.ceil(cachedstyle.fontsize*Toolbox.charwidthrate()))%>" value="<%=Toolbox.emsgs(orgnum,51)%>" >
       <% if ( Toolbox.defaultParam(orgnum,request, ("forindex"), null) != null) 
       {
        %>
        <input name=forindex type=hidden value="1" >
        <%
         }
        %>
      <!--input name=cl type=button class=GreenButton  style="width:<%=cachedstyle.fontsize*4%>" value="<%=Toolbox.emsgs(orgnum,169)%>" onclick="javascript:close1()"-->
      </form>
      <script type="text/javascript" >
   var nt = document.f.semesterold.options.length;
   var scodes= new Array(nt), sns= new Array(nt);
   for (var i=0; i < nt; i++)
   {
      scodes[i] = document.f.semesterold.options[i].value;
      sns[i] = document.f.semesterold.options[i].text;
   }



       function test()
       {
           if (document.f.semester.value=='')
           {
               myprompt(textmsg[770]);
               return false;
           }
           for (var i=0; i < sns.length;i++)
               if (document.f.semester.value==sns[i])
               {
                   document.f.semester.focus();
                   myprompt(document.f.semester.value+' <%=Toolbox.emsgs(orgnum,446)%>');
                   return false;
               } 
           return true;
       } 
      </script></body></html>
  <%   

   return;
}
else if (initsemester!=null)
{
    
   String semesterold = Toolbox.defaultParam(orgnum,request, "semesterold", "", null,30);
   String semesternew = Toolbox.dbadmin[orgnum%65536].newSemester(initsemester, orgnum);
   adapter = Toolbox.getSysAdapter(orgnum); adapter.orgnum = orgnum ;
   nt = -1;  try{ nt = Integer.parseInt(semesternew);}catch(Exception e1){} 
   if (nt >=1)
   {
      BackRoutine.postproc(user,adapter,"commondata",null,null, cachedstyle );
      String sqls [] = new String[8];
      int sindex = Toolbox.begintranslate("mysql");
      int tindex = Toolbox.begintranslate(adapter.dbms);
      sqls[0] = "CREATE TABLE Scheduler(lastupdate BIGINT, num1 VARCHAR(20), num2 VARCHAR(10), preference INTEGER, which CHAR(1), dept varchar(20),,semester INTEGER, PRIMARY KEY(num1, num2, which,dept,semester))";
      sqls[0] = Toolbox.translateStr(sqls[0],sindex,tindex);
      sqls[1] = "INSERT INTO Apptables(lastupdate,tname,definition,roles) VALUES("
              + (System.currentTimeMillis()/1000) +",'Scheduler','" + sqls[0] +"', 30)";
      
      String err = "";
      boolean b = false;
      if (semesterold.equals(""))
         b = adapter.transacte1(sqls, 0, 2);
      else
      {
	     sqls[2]="INSERT INTO Scheduler(lastupdate,num1,num2,preference,which, dept,semester) SELECT lastupdate,num1,num2,preference,which, dept, semester FROM Scheduler WHERE semester=" + semesterold;
         sqls[3]="INSERT INTO Schroom(lastupdate,num,semester,preference,dept) SELECT lastupdate,num, " + nt +",preference,dept FROM Schroom WHERE semester=" + semesterold;
         sqls[4]="INSERT INTO Schtime(lastupdate,num,semester,preference,dept) SELECT lastupdate,num, " + nt +",preference,dept FROM Schtime WHERE semester=" + semesterold;
         sqls[5]="INSERT INTO Schuser(lastupdate,id, semester,maxload,preference,realload,dept) SELECT lastupdate,id," + nt +",maxload,preference,realload,dept FROM Schuser WHERE semester=" + semesterold;
         sqls[6]="INSERT INTO Session(lastupdate,name,courseid,semester,allowadd,allowdrop,schedule,room,notes,textbook,evaluationrule,seats,instructor,ta,progress,policy)"
         + "SELECT Session.lastupdate,name,courseid,'" + nt  +"',1,1,schedule,room,notes,textbook,evaluationrule,seats,instructor,ta,progress,policy FROM Session where semester='" + semesterold + "'";
         sqls[7]="INSERT INTO EvalQuestion(semester,etype,questionnum,questiontxt) SELECT '" + nt + "',etype,questionnum,questiontxt FROM EvalQuestion WHRERE semester='"  + semesterold + "'";
 
         b = adapter.transacte1(sqls, 0, 8);
         BackRoutine.updateselects(adapter,orgnum);
      } 
      currentsemester = "" + nt;
      currentsemestername = initsemester;
   }
   else
{
     
}
   if (Toolbox.defaultParam(orgnum,request, ("forindex"), null)!=null ) 
   {
       adapter.close();
       %>
<script>
      parent.setv(0,1, '<%=nt%>');
      parent.closeprompt(); 
</script>
</body></html>
      <%
       return;
       
   }
    
}
if(adapter==null)
   adapter = Toolbox.getSysAdapter(orgnum); 
 adapter.orgnum = orgnum;

nt = adapter.executeQuery("select code, domainValue from  DomainValue WHERE  domain='Semester' AND language='" + Toolbox.langs[orgnum>>16] + "'  order  by code");
%>
<script type="text/javascript" >

<%
out.print("var sns=[\"" + Toolbox.emsgs(orgnum,963) +"\",");
if (nt > 0)
{

  for (int i= 0; i < nt; i++)
  {
     if (adapter.getValueAt(i,0).equals(currentsemester))
     {    
         currentsemesterindex = i+1; 
         currentsemestername = adapter.getValueAt(i,1);
     }
     out.print("\"" +  adapter.getValueAt(i,1).trim()+ "\",");
    // String sn = adapter.getValueAt(i,0);

  }
  out.print("\"\"];\nvar scodes= [0,");
  for (int i= 0; i < nt; i++)
  {
      String x = adapter.getValueAt(i,0) ;
      if (x!=null)
        out.print( x + ",");
      else
        out.println( "0,");
  }
  out.println("0];");
}
else
   out.print("\"\"];\nvar scodes= [0,0];");
//String semesterthis=semester;
//if (semester==null) semesterthis = "" + currentsemester;
 
%>



</script>
 
<form rel=opener name=form1 method=post target="righwsch"  action=DataSearch style="margin:5px 0px 5px 0px" onsubmit="return hassemester()"  >
 
<TABLE width=100% class=outset bgcolor="#DDCC11" cellpadding=1 cellspacing=0>                                                
<tr height=28> <TD colspan=2   ><table><tr><td  style="color:#DDCC11;text-shadow:-1px -1px #060606;"><b><%=Toolbox.emsgs(orgnum,1004)%></b> </td><td>
<select name=semester class=selectsel  style="font-family:inherit"    onchange=csemester(this)></SELECT></td></tr><tr>
<td  style="color:#DDCC11;text-shadow:-1px -1px #060606;"><b><%=Toolbox.emsgs(orgnum,798)%></b> </td><td>
<select name=department  class=selectsel onchange="chgdept(this)">
<option value=""  "<%=user.department.equals("")?"selected":""%>" ><%=Toolbox.emsgs(orgnum,450)%></option>
<% int n = adapter.executeQuery("SELECT id, name FROM Department order by name");
   for (int i=0; i < n; i++)
   {
      String xx = adapter.getValueAt(i, 1);
      if (xx!=null&& xx.length()>30) xx = xx.substring(0,25);
      String yy = adapter.getValueAt(i, 0);
       out.println("<option value=\"" 
               + yy +
               "\"  \"" + (yy.equals(user.department)?"selected":"") + "\">"
               + xx + "</option>");
   }

%>
</SELECT>
</td></tr></table>
<%
  
adapter.close();
%>
</td></tr>
<tr><TD align=center width=15><img src=image/goal.gif width=14></td><td style="text-shadow:-1px -1px #060606"><a href="javascript:opensession()" ><%=Toolbox.emsgs(orgnum,965)%></a></td></tr>
<tr><TD align=center width=15><img src=image/tri.gif ></td><td style="text-shadow:-1px -1px #060606"><a href=javascript:opentime()><%=Toolbox.emsgs(orgnum,1036)%></a></td></tr>
<tr><TD align=center width=15><img src=image/tri.gif ></td><td style="text-shadow:-1px -1px #060606"><a href=javascript:opennotify()><%=Toolbox.emsgs(orgnum,1129)%></a></td></tr>
<tr><TD align=center width=15><img src=image/tri.gif ></td><td style="text-shadow:-1px -1px #060606"><a href="javascript:openfaculty()" > <%=Toolbox.emsgs(orgnum,966)%></a></td></tr>
<tr><TD align=center width=15><img src=image/tri.gif ></td><td style="text-shadow:-1px -1px #060606"><a href="javascript:openOthers()" > <%=Toolbox.emsgs(orgnum,967)%></a></td></tr>
<tr><TD align=center width=15><img src=image/tri.gif ></td><td style="text-shadow:-1px -1px #060606"><a href="javascript:openroom()" > <%=Toolbox.emsgs(orgnum,968)%></a></td></tr>
<tr><TD align=center width=15><input name=fix       type=checkbox  style="margin:0 -3 0 -3;background-color:<%=cachedstyle.IBGCOLOR%>"  checked></td><td style="text-shadow:-1px -1px #060606"><a href="javascript:openfix(600)"><nobr><%=Toolbox.emsgs(orgnum,969)%></nobr></a></td></tr>
<tr><TD align=center width=15><input name=candidate type=checkbox  style="margin:0 -3 0 -3;background-color:<%=cachedstyle.IBGCOLOR%>"  checked></td><td style="text-shadow:-1px -1px #060606"><a href="javascript:openit('DataTable?rdap=schrequire&exbut=cp',540)" ><%=Toolbox.emsgs(orgnum,970)%></a></td></tr>
<tr><TD align=center width=15><input name=goodtime  type=checkbox  style="margin:0 -3 0 -3;background-color:<%=cachedstyle.IBGCOLOR%>"  checked></td><td style="text-shadow:-1px -1px #060606"><a href="javascript:openit('DataHTML?rdap=schteachertime&exbut=cp',440)"><%=Toolbox.emsgs(orgnum,971)%></a></td></tr>
<tr><TD align=center width=15><input name=exclusion type=checkbox  style="margin:0 -3 0 -3;background-color:<%=cachedstyle.IBGCOLOR%>"  checked></td><td style="text-shadow:-1px -1px #060606"><a href="javascript:openit('DataTable?rdap=schexclusion&exbut=cp',440)"><%=Toolbox.emsgs(orgnum,972)%></a></td></tr>
<tr><TD align=center width=15><input name=timeshare type=checkbox  style="margin:0 -3 0 -3;background-color:<%=cachedstyle.IBGCOLOR%>"  checked></td><td style="text-shadow:-1px -1px #060606"><a href="javascript:openit('DataTable?rdap=schtimeshare&exbut=cp',440)"><%=Toolbox.emsgs(orgnum,973)%></a></td></tr>
<tr height="50"><TD colspan=2 align=center valign="middle">
 <input type=button class=OrangeButton name=submit2 value="<%=Toolbox.emsgs(orgnum,974)%>"  onclick=set(0)>
 <input type=button class=GreenButton   name=submit1 value="<%=Toolbox.emsgs(orgnum,975)%>"   onclick=set(1)>
</td></tr>
<tr><TD align=center width=15><img src=image/file.jpg  width=12></td><td style="text-shadow:-1px -1px #060606"><a href="javascript:openerror()"><%=Toolbox.emsgs(orgnum,1234)%></a></td></tr> 
<tr><TD align=center width=15><img src=image/file.jpg  width=12></td><td style="text-shadow:-1px -1px #060606"><a href="javascript:open2right('DataHTML?rdap=schprint')"><%=Toolbox.emsgs(orgnum,976)%></a></td></tr> 
<tr><TD align=center width=15><img src=image/file.jpg  width=12></td><td style="text-shadow:-1px -1px #060606"><a href="javascript:open2right('instructoruse.jsp?x=1')"><%=Toolbox.emsgs(orgnum,959)%></a></td></tr>
<tr><TD align=center width=15><img src=image/file.jpg  width=12></td><td style="text-shadow:-1px -1px #060606"><a href="javascript:open2right('roomuse.jsp?x=1')"><%=Toolbox.emsgs(orgnum,962)%></a></td></tr> 
<tr><TD align=center width=15><img src=image/file.jpg  width=12></td><td style="text-shadow:-1px -1px #060606"><a href="javascript:opendelete()"><%=Toolbox.emsgs(orgnum,1387)%></a></td></tr> 
</TABLE>                                                
<input type=hidden name="semesterName" >
<input type=hidden name=dept value="<%=user.department%>" >
<input type=hidden name=subdb value="">
<input type=hidden name=act>
<input type=hidden name=rdap>
   <input type="hidden" name="onsaved">
   <input type="hidden" name="onclose">
   <input type="hidden" name="onbegin">
   <input type="hidden" name="onsave">
   <input type="hidden" name="cellonblur">
   <input type="hidden" name="cellonfocus">
  <input  type="hidden" name=extraline  >
  <input  type="hidden" name=exbut  >
</form>

<%=Toolbox.sponsor(orgnum,5, 210)%>
<script type="text/javascript" >
SetCookie('<%=user.id%>acinfo','');
localStorage.removeItem('<%=user.id%>mss'); 
resizebut(document.form1,<%=cachedstyle.fontsize%>);
document.form1.department.style.width = <%=6*cachedstyle.fontsize%> + "px";
document.form1.semester.style.width = <%=6*cachedstyle.fontsize%> +"px";
parent.resizeTo(screen.width,screen.height);
var tstmp = <%=tstmp%>;
var msg1067 = "<%=Toolbox.emsgs(orgnum,1067)%>";
var semester = 0;
var f1 = document.form1;
var sel = null;
var semesterName = "";
var sm = "";
var semesterprev = 0;
function restoreold()
{
   semester = semesterprev;
   if (semester!=-1)
   {
     semesterName = sns[semester];
     for (var jj=0; jj < sel.options.length; jj++)
     if (sel.options[jj].value==semester + '')
     {
         sel.selectedIndex = jj;
         break;
     }
   }
}
function csemester(cs)
{
   semesterprev = semester;
   sel = cs;
   var str = cs.options[cs.selectedIndex].value;
   semester = parseInt(str);

   if (semester == 0)
   ;
   else if  (str =='-1')
   {
       open('schedulerindex.jsp?semester=@',window.name);
   }
   else
   {
       semesterName = sns[semester];
       if (f1.semester.selectedIndex>=0)
       {
          f1.semesterName.value = f1.semester.options[f1.semester.selectedIndex].text;
          sns[semester] = f1.semester.options[f1.semester.selectedIndex].text;
       }
       f1.semesterName.value = semesterName;
       openit('DataTable?rdap=schresult',610);
       for (var jj=0; jj < sel.options.length; jj++)
       if (sel.options[jj]==semester + '')
       {
         sel.selectedIndex = jj;
         break;
       }
   }

}

var nav1 = null;

function opendelete()
{
    myprompt(msg1067, null, "if(v)godelete()",textmsg[678]);
}

function godelete()
{
   clear();
   formnewaction(f1,'schexecute.jsp');
   f1.act.value = "3";
  visual(f1);
 f1.submit();
}
 
function setframes(w)
{
   var b = parent.frames[1].frames!=null && parent.frames[1].frames.length > 1 && parent.frames[1].document.getElementById("framesch")!=null;
   if (b==false)
   {

      nav1 = window.open("", parent.frames[1].name );
      nav1.document.write("<html><frameset id=\"framesch\" cols=\"" + w +",*\">"
        +"<frame name=\"tlmlsch\"  scrolling=\"auto\"   /><frame name=\"tlmrsch\"  scrolling=\"auto\"   /></frameset></html>");
   }
   else
   {
       parent.frames[1].document.getElementById("framesch").setAttribute('cols', w + ",*");
       parent.frames[1].frames[1].document.getElementsByTagName("body")[0].innerHTML = "";
   }
   clear();
   f1.target = "tlmlsch";
   
}

function opensession()
{
    openit('DataTable?extraline=6&rdap=schpickcourse',560);
}
function openit(x,w)
{
   
    f1.rdap.disabled = true;
    f1.exbut.disabled = true;
    f1.extraline.disabled = true;
    f1.onbegin.value = "";
    f1.onsave.value = "";
    f1.onsaved.value = "";
    f1.cellonblur.value = "";
    f1.cellonfocus.value = "";
    var xs = x.replace(/[^\?]+\?/,'').split(/&/);
    x = x.replace(/\?.*/,'');
    for (var i=0; i < xs.length; i++)
    {
        var ys = xs[i].split(/=/);
        var ele = formselementbyname(f1, xs[i].replace(/=.*/,''));
        if (ele == null) continue;
        ele.disabled = false;
        ele.value = xs[i].replace(/.*=/,'');
    }
    if (semester < 1){myprompt(textmsg[719]); return;}
    setframes(w);
    if (x.indexOf("fix")>0)
    {
       f1.onsaved.value ="81";
    }
    f1.onbegin.value = "69";
    formnewaction(f1, x);
   visual(f1);
 f1.submit();
}

function hassemester()
{

    if (semester < 1){myprompt(textmsg[719]); return false;}
    return true;
}


function open2right(x)
{
    if (semester < 1){myprompt(textmsg[719]); return;}
    clear();
    formnewaction(f1, x);
    f1.target = parent.frames[1].name;
   visual(f1);
 f1.submit();
}

 

function openfix(wd)
{
    if (semester < 1){myprompt(textmsg[719]); return;}
    clear();
    formnewaction(f1,"DataTable");
    f1.rdap.value="schedulefix";
    if (f1.semester.selectedIndex>=0)
    {
        f1.semesterName.value = f1.semester.options[f1.semester.selectedIndex].text;
    }
    if(wd==null)
    {
        f1.target.value= parent.frames[1].name;
        f1.onsaved.value="70"
    }
    else
    {
       setframes(wd);
       f1.onbegin.value = "69";
       f1.onsaved.value="71"
    }
   visual(f1);
 f1.submit();
}

function openresult()
{
    if (semester < 1){myprompt(textmsg[719]); return;}
    clear();
    formnewaction(f1,"DataTable");
    f1.rdap.value="schresult";
    f1.target.value=parent.frames[1].name;;
    f1.onsaved.value="70"
   visual(f1);
 f1.submit();
}


function openerror()
{
   formnewaction(f1,'schexecute.jsp');
   f1.act.value = "2";
   var b = (parent.frames[1].frames!=null) && (parent.frames[1].frames.length > 1);
   if (b)
       f1.target=  'tlmrsch';
   else
       f1.target= parent.frames[1].name; 
  visual(f1);
 f1.submit();
}


function test()
{
  
}

function set(c)
{
   f1.act.value = c;
   formnewaction(f1,'schexecute.jsp');
   f1.target = parent.frames[1].name;
   if (c==1) f1.fix.checked = true;
   
   if (c==0 && f1.dept.value=='')
   {
      myprompt('Only specific department can run scheduling. Select a department');
      return;
   }
    
  visual(f1);
 f1.submit();
}

function check(a, c)
{
     if ( a!=null && goodf(a)==false)
    {
        myprompt(a + " " + textmsg[907]);
        return;
    }
}
function check1(a, c)
{
    if ( a!=null )
    {
       var t = (a.replace(/([A-Z][0-9]+)-/g,'$1:00-').replace(/(-[0-9]+)$/g,'$1:00'));
       if (typeof parent.frames[1].setMat != 'undefined')
          parent.frames[1].setMat(c,1,t);
       else parent.frames[1].frames[0].setMat(c,1,t);
    }
}


function goodf(x)
{
   var y = x.replace(/[0-9]+:[0-9]+/g,'');
   var z = y.replace(/[0-9]/g,'');
   return (y == z);
}


function clear()
{
   f1.onclose.value='';
   f1.onbegin.value='';
   f1.cellonfocus.value='';
   f1.cellonblur.value='';
   f1.onsave.value = '';
   f1.onsaved.value='';
}

function opentime()
{
   if (semester < 1){myprompt(textmsg[719]); return;}
   clear();
   f1.cellonfocus.value = "82";
   setframes(480);
   if (f1.dept.value=='')
   {
      f1.cellonblur.value = "83";
      f1.rdap.value = "schtimeslot0";
   }
   else
   {
      f1.cellonblur.value = "84";
      f1.rdap.value = "schtimeslot";
   }
   f1.onbegin.value ="69";
   formnewaction(f1,"DataTable?extraline=6");
  visual(f1);
 f1.submit();
}

function opennotify()
{
    if (f1.dept.value=='')
    {
        myprompt(textmsg[1273]);
        return;
    }
    if (semester < 1)
    {
       myprompt(textmsg[719]);
       return;
    }
    
    setframes(550);
    f1.rdap.value = "schaskinput";
    clear();
    f1.onbegin.value = "72";
    formnewaction(f1,"DataForm?numrows=1&extraline=0&exbut=p");
   visual(f1);
 f1.submit();
}

function openfaculty(x)
{
    if (f1.dept.value=='')
    {  
       myprompt(textmsg[1273]);
       return;
    }
    clear();
    f1.rdap.value= 'schselectfaculty0';
    formnewaction(f1, "DataSearch");
    f1.target= parent.frames[1].name;
   visual(f1);
 f1.submit();
}

 
function openOthers()
{
    if (semester < 1){myprompt(textmsg[719]); return;}
    clear();
    setframes(500);
    formnewaction(f1, 'DataTable?extraline=2');
    f1.rdap.value= 'schotherteacher';
    f1.onbegin.value = "69";
   visual(f1);
 f1.submit();
}

function openroom()
{
    setframes(550);
    if (f1.dept.value=='')
       f1.rdap.value= 'schselectroom0';
    else
       f1.rdap.value= 'schselectroom';
    formnewaction(f1, 'DataTable?extraline=2');
    clear();
    f1.onbegin.value = "69";
   visual(f1);
 f1.submit();
}



function chgdept(x)
{
   f1.dept.value=x.value;
}



for (i=0; i < f1.department.options.length; i++)
{
    f1.department.options[i].className = 'selectoption';
}
    
for (i=0; i < f1.department.options.length; i++)
    if (f1.dept.value == f1.department.options[i].value)
        break;
f1.department.selectedIndex = i;
for (i = 0; i <= <%=nt%>; i++)
{   
    f1.semester.options[i] = new Option(sns[i], scodes[i]);
    f1.semester.options[i].className = 'selectoption';
}
f1.semester.style.width = "120px";
f1.department.style.width = "120px";
f1.semester.options[<%=nt+1%>] = new Option("<%=Toolbox.emsgs(orgnum,964)%>", "-1");
f1.semester.options[<%=nt+1%>].className = 'selectoption';
f1.semester.selectedIndex = <%=currentsemesterindex%>;
semester = '<%=currentsemester%>';
semesterName = f1.semester.options[<%=currentsemester%>].text;
f1.semesterName.value = semesterName;
openresult();
for (i=0; i < f1.semester.options.length; i++)
{
    f1.semester.options[i].className = 'selectoption';
}
function getWtstmp()
{
    return "w" + tstmp;
}
</script> 

<script type="text/javascript"  src=floating.js></script>
<script type="text/javascript"  src=curve.js></script>
<iframe name="w<%=tstmp%>" width="1" height="1" />  
</body>
</html>
 

