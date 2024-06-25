<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>"> 
<%
User user = null;
if (  (user = User.authorize(orgnum, Systemroles.ASSESSER | Systemroles.REGISTER |Systemroles.INSTRUCTOR | Systemroles.TEACHINGADMIN ,application,session,request, response, "studentmonitor.jsp", true)) == null|| !Toolbox.verifytoken(request)) 
    return;
orgnum=user.orgnum;
String myname = user.firstname + " " + user.lastname;
String semester = Toolbox.defaultParam(orgnum,request, "semestercode", "-1", null, 40);
 
 if (semester.equals("-1"))
 {
     semester = Toolbox.dbadmin[orgnum%65536].currentSemester;
 }
 
String courseid = Toolbox.defaultParam(orgnum,request, "courseid", null, null, 40); 
String sid  =   Toolbox.defaultParam(orgnum,request,"sid",null); 
if (sid==null){ out.print("<body>" + Toolbox.emsgs(orgnum,232) + " not specified");return ;}
String majorprogram = "", minorprogram = "", department = "", advisor="", advisorname="", websitename = "";
String sql =   "SELECT AppUser.webFileFolder,       AppUser.websitename, '1' as which, Student.advisor , AppUser.firstname, AppUser.lastname,1 FROM  Student, AppUser WHERE  AppUser.id=Student.id AND  Student.id='" + sid.replaceAll("'","''") + "'   UNION "  
             + "SELECT Acaprogram.department, Student.majorprogram , '1' as which, Student.advisor , AppUser.firstname, AppUser.lastname,2 FROM Acaprogram, Student, AppUser WHERE  AppUser.id=Student.advisor AND  Student.id='" + sid.replaceAll("'","''") + "' AND Acaprogram.id=Student.majorprogram UNION "  
             +"SELECT Acaprogram.department, Student.minorprogram , '0' as which, Student.advisor,  AppUser.firstname, AppUser.lastname,3 from Acaprogram, Student, AppUser WHERE  AppUser.id=Student.advisor AND Student.id='" + sid.replaceAll("'","''") +"' AND Acaprogram.id=Student.minorprogram UNION " 
             +"SELECT Acaprogram.department, Student.majorprogram , '1' as which, '' as advisor ,  '' as firstname, '' as lastname,4 FROM Acaprogram, Student  WHERE   (Student.advisor='' or Student.advisor=NULL ) AND  Student.id='" + sid.replaceAll("'","''") + "' AND Acaprogram.id=Student.majorprogram UNION "  
             +"SELECT Acaprogram.department, Student.minorprogram , '0' as which, '' as advisor,   '' as firstname, '' as lastname,5  from Acaprogram, Student  WHERE  (NULL=Student.advisor or ''=Student.advisor) AND Student.id='" + sid.replaceAll("'","''") +"' AND Acaprogram.id=Student.minorprogram ORDER BY 7";
String sql0 = sql;  
JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
String firstname="",lastname = "", fullname=""; 
int kk = adapter.executeQuery(sql);
if (kk > 0) 
{     
        firstname=adapter.getValueAt(0, 4);
        lastname = adapter.getValueAt(0, 5); 
        fullname = Toolbox.makeFullName(lastname, "", firstname);
        websitename = adapter.getValueAt(0, 1);
        if (kk > 1) 
        {
            advisor = adapter.getValueAt(1, 3);
            advisorname = Toolbox.makeFullName(adapter.getValueAt(1, 5), "", adapter.getValueAt(1, 4));
            if (adapter.getValueAt(1, 2).equals("1")) 
            {
                department += adapter.getValueAt(1, 0);
                majorprogram = adapter.getValueAt(1, 1);
                if (kk > 2) 
                {
                    minorprogram = adapter.getValueAt(2, 1);
                    department += "," + adapter.getValueAt(2, 0);
                }

            } else {
                department += adapter.getValueAt(1, 0);
                minorprogram = adapter.getValueAt(1, 1);
                if (kk > 1) {
                    majorprogram = adapter.getValueAt(2, 1);
                    department += "," + adapter.getValueAt(2, 0);
                }
            }
        }
    }
// else if (kk < 0) out.print(sql);
 int kc=1; 
%>
 
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,669)%></title> 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
<style>div.circle{text-align:center;vertical-align:middle;display:block;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-weight:700;width:<%=(cachedstyle.fontsize+3) %>px !important;height:<%=(cachedstyle.fontsize+3) %>px;border-radius:<%=(cachedstyle.fontsize+3)/2%>px;font-size:<%=cachedstyle.fontsize%>px;color:<%=cachedstyle.IBGCOLOR%>;line-height:<%=cachedstyle.fontsize+2%>px;text-align:center;background-color:white} 
</style>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("studentmonitor.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script></head>
<body style="margin:6px 12px 6px 6px;background:<%= cachedstyle.IBGCOLOR %> right url(image/backgd.gif) repeat-y;color:white">
 
<center>
<%=Toolbox.logtitle(Toolbox.emsgs(orgnum,692), 210)%>

<form rel=opener name=form1 method=post style="margin:5px 0px 5px 0px" target=rightwinmoniter  >
<input type=hidden name=subdb  value="">
<input type=hidden name=iid>
<input type=hidden name=rdap>
<input type=hidden name=sid value="<%=sid%>">
<input type=hidden name=fullname value="<%=fullname%>"> 
<input type=hidden name=majorprogram  value="<%=majorprogram%>" >
<input type=hidden name=minorprogram value="<%=minorprogram%>" >
<input type=hidden name=department value="<%=department%>" >
<input type=hidden name=studentname value="<%=Toolbox.emsgs(orgnum,19)%>">
<input type=hidden name=accessible value="true">
<input type=hidden name=onsaved value="">
<input type="hidden" name="semester" value="<%= semester %>" >
<input type=hidden name=onsave ><input type=hidden name=absentdeduct value=""> <!-- value="valuechanged[1]=true;validating='';var fm=window.frames[0];setv(0,2,'');c=fm.passoverNumRows();for(j=c-1;j>=0;j--){r=c-j;cc=fm.retrv(r-1,3);x=fm.retrv(r-1,2);if(x==''){validating=textmsg[417].concat(fm.retrv(r-1,0));break;}setv(0,cc,retrv(0,cc).concat(fm.retrv(r-1,4)).concat(',').concat(fm.retrv(r-1,2)).concat(','));}">  -->
<TABLE width=100% class=outset bgcolor=#DDCC11 cellpadding=1 cellspacing=0 align=center>  
<tr><td colspan="2" align="center"><nobr><font color="#DDCC11"><b><%=sid + " " + fullname%></b></font></nobr>
</td></tr>
<tr><td colspan="2"><nobr><font color="#DDCC11"><b><%=Toolbox.emsgs(orgnum,1004)%></b></font></nobr>
<select name=semestercode  class=selectsel style="width:140px;overflow: hidden;font-size: inherit;font-family: inherit" onchange="switchs(this)">
<%= Toolbox.dbadmin[user.orgnum%65536].semesteropts(semester, orgnum) %></select>
</td></tr>
<tr><td width="<%=(cachedstyle.fontsize+4)%>"><div class=circle ><%=kc++%></div></td><td><nobr><a href=javascript:openit("DataFormHTML?rdap=studentbasic&uid=<%=sid%>")><%=Toolbox.emsgs(orgnum,671)%></a></nobr></td></tr>
<tr><td  width="<%=(cachedstyle.fontsize+4)%>"><div class=circle><%=kc++%></div></td><td><nobr><a href=javascript:openit("studentannounce.jsp")><%=Toolbox.emsgs(orgnum,670)%></a></nobr></td></tr>
<%  if ( (user.roles & Systemroles.REGISTER) > 0 ||(user.roles & Systemroles.ASSESSER)>0){%>　
<tr><td  width="<%=(cachedstyle.fontsize+4)%>"><div class=circle><%=kc++%></div></td><td><nobr><a href="javascript:openit('DataHTML?rdap=account&sid=<%=sid%>&<%=Toolbox.emsgs(orgnum,163)%>=<%=sid%>')"><%=Toolbox.emsgs(orgnum,1104)%></a></nobr></td></tr>
<%}%>
<tr><td  width="<%=(cachedstyle.fontsize+4)%>"><div class=circle><%=kc++%></div></td><td><nobr><a href="javascript:openit6()"><%=Toolbox.emsgs(orgnum,599)%></a></nobr></td></tr>
<% if (advisor.equals(user.id)|| (user.roles & Systemroles.TEACHINGADMIN) > 0 || (user.roles & Systemroles.REGISTER) > 0) {%>
<tr><td  width="<%=(cachedstyle.fontsize+4)%>"><div class=circle><%=kc++%></div></td><td><nobr><a href="javascript:openit4('studentprogress.jsp')"><%=Toolbox.emsgs(orgnum,917)%></a></nobr></td></tr>
<%} if (advisor.equals("") ==false && !advisor.equals(user.id)) {%>
<tr><td  width="<%=(cachedstyle.fontsize+4)%>"><div class=circle><%=kc++%></div></td><td><nobr><a href="javascript:openit('DataFormHTML?rdap=userinfo&uid=<%=advisor%>')"><%=Toolbox.emsgs(orgnum,918)%></a></nobr></td></tr>
<%}%>
<% if ( websitename!=null&& !websitename.equals("") && !websitename.toLowerCase().equals("null") ){%>
<tr><td  width="<%=(cachedstyle.fontsize+4)%>"><div class=circle><%=kc++%></div></td><td><nobr><a href=javascript:openit("../<%=Toolbox.dbadmin[orgnum%65536].subsitename + '/' + websitename%>")><%=Toolbox.emsgs(orgnum,267)%></a></nobr></td></tr>
<%} 

String courses = "";

int nt = 0;
String asso = "if (cid==''){f.course.value='';f.iname.value='';f.iid.value='';f.ta.value='';f.sessionname.value='';f.coursetitle.value='';}";
String iids = "";
String inames = "";
  //     "SELECT distinct Course.id, Course.title, Registration.sessionname, Session.instructor, AppUser.firstname, AppUser.lastname, Registration.evaluation, Registration.grade, Session.ta, TimeSlot.timeslot, Session.room,Faculty.officehour,Session.absentdeduct
sql = "SELECT distinct Course.id, Course.title, Registration.sessionname, Session.instructor, AppUser.firstname, AppUser.lastname, Registration.evaluation, Registration.grade, Session.ta, TimeSlot.timeslot,Session.absentdeduct   FROM Course, Registration, Session, AppUser,TimeSlot WHERE  Session.schedule=TimeSlot.num  AND AppUser.id = Session.instructor AND Registration.sessionname=Session.name AND Registration.courseid = Course.id AND Registration.sid='" + sid.replaceAll("'","''") +"' AND Session.courseid=Course.id AND Registration.semester='" 
    + semester + "' AND Session.semester='" + semester + "' ";
 
if (!advisor.equals(user.id) && (user.roles & Systemroles.ASSESSER) == 0)
{
    sql += " AND Session.instructor='" + user.id + "'";
}
int nn  = adapter.executeQuery(sql);
 
int nk = 0;
String opt = ""; 
String forpass="";
String old = "";
String timeslots = "";
StringBuffer sallsession = new StringBuffer();
StringBuffer schbysession = new StringBuffer();
if (nn > 0) 
{
  String ta = "";
  int k1 = 0;
  if ( nn > 1) opt = "<option value=\"\">" + Toolbox.emsgs(orgnum,288) +"</option>";
  for (int k = 0;k < nn; k++) 
  {
        String cid = adapter.getValueAt(k,0).trim(); 
        String ctitle = adapter.getValueAt(k,1).trim();
        String sessionname = adapter.getValueAt(k,2).trim(); 
        String instructor = adapter.getValueAt(k,3).trim();
        //if (!instructor.equals(user.id))  continue;
        nk++;
        String fulln = Toolbox.makeFullName(adapter.getValueAt(k,5), "" , adapter.getValueAt(k,4));
        courses += ";" + cid;
        forpass += cid + "|" + sessionname +"|" + instructor;
        if ( k < nn-1) forpass +=",";
        timeslots += ",'" + adapter.getValueAt(k,9) + "'";
        iids += ";" + instructor;
        inames += ";" + fulln;
        if (k==0) 
         {
             sallsession.append("var allcourseschs=[");
             schbysession.append("var schbysession=[];");
         }
         else 
             sallsession.append(",");
sallsession.append("['" + adapter.getValueAt(k,9) + "','" + cid + "-" + sessionname + "',null,null," + ((k1 + ((nn == 1) ? 0 : 1))) + "]");
        if (k==nn-1) 
             sallsession.append("];"); 
       // if (ctitle.length() > 27) ctitle= ctitle.substring(0,27);
        opt += "<option value=\"" + cid + "\" class=selectopt  " + (courseid==null||!courseid.equals(cid)? "":" selected ") + ">" + ctitle + " " + sessionname + "</option>";
        if (adapter.getValueAt(k,8)!=null && adapter.getValueAt(k,8).equals("")==false)
            ta = "ta";
        else ta = "";
        asso +="\nelse if (f.course.selectedIndex == "+(k1+ ( nn==1?0:1 )  )+" ) { f.coursetitle.value=\"" + Generic.handle(ctitle)
        + "\";f.iname.value=\"" + Generic.handle(fulln) 
        + "\";f.iid.value=\"" + instructor                  
        + "\";f.ta.value=\"" + Generic.handle(ta)
        + "\";f.sessionname.value=\"" + Generic.handle(sessionname)  
        + "\";f.subdb.value=\"" + instructor + "\";f.absentdeduct.value=\"" + adapter.getValueAt(k,10) + "\";}";
        k1 = k1 + 1;
  }
 } 
 Set<String> e = Generic.storedProc.keySet();
 for (String rdap: e) 
{
      
      if (rdap.charAt(0)=='#')
      {
          Webform w = (Webform)(Generic.storedProc.get(rdap));
          String format = w.format;
          if (format.equals("Update")==false)
          {
              String title = w.title;
     %>
<tr><td  width="<%=(cachedstyle.fontsize+4)%>"><div class=circle><%=kc++%></div></td><td><a href="javascript:openit3('Data<%=format%>','<%=rdap.replaceAll("'","\\'")%>','')"><nobr><%=title%></nobr></a></td></tr>
     <% 
          }
      }
} 
adapter.close(); 
 
if (nk>0)
{
kc = 1;
%>
     <tr><td colspan="2">
<input type=hidden name=sessionname>
<input type=hidden name=coursetitle>
<input type=hidden name=iname>
<input type=hidden name=ta>
<input type=hidden name=courses value="<%=courses.substring(1)%>" >
<input type=hidden name=iids value="<%=iids.substring(1)%>" >
<input type=hidden name=semester value="<%=semester%>" >
<input type=hidden name=inames value="<%=inames.substring(1)%>">
<select name=course class="selectoption" style="overflow:hidden"><%=opt%></select>
</td></tr>
<tr><td  width="<%=(cachedstyle.fontsize+4)%>"><div class=circle style="width:24px"><%=kc++%></div></td><td><nobr><a href=javascript:openit1("studentannounce.jsp")><%=Toolbox.emsgs(orgnum,670)%></a></nobr></td></tr> 
<tr><td  width="<%=(cachedstyle.fontsize+4)%>"><div class=circle><%=kc++%></div></td><td><nobr><a href=javascript:openit1("DataFormHTML?rdap=lectnoteview")><%=Toolbox.emsgs(orgnum,1231)%></a></nobr></td></tr>  

<%if (iids.indexOf(user.id) >= 0) {%>
<tr><td  width="<%=(cachedstyle.fontsize+4)%>"><div class=circle><%=kc++%></div></td><td><nobr><a href=javascript:openit1("studentassign.jsp")><%=Toolbox.emsgs(orgnum,675)%></a></nobr></td></tr> 
<tr><td  width="<%=(cachedstyle.fontsize+4)%>"><div class=circle><%=kc++%></div></td><td><nobr><a href=javascript:openit1("DataForm?rdap=studentsubmissionins&assignname=&makescript=makesubmission&extension=0")><%=Toolbox.emsgs(orgnum,676)%></a></nobr></td></tr>  
<%}%> 
<tr><td  width="<%=(cachedstyle.fontsize+4)%>"><div class=circle><%=kc++%></div></td><td><nobr><a href=javascript:openit1("checkgrades.jsp")><%=Toolbox.emsgs(orgnum,413)%></a></nobr></td></tr>
<tr><td  width="<%=(cachedstyle.fontsize+4)%>"><div class=circle><%=kc++%></div></td><td><nobr><a href=javascript:openit1("visualwa.jsp")><%=Toolbox.emsgs(orgnum,1583)%></a></nobr></td></tr>

<tr><td  width="<%=(cachedstyle.fontsize+4)%>"><div class=circle><%=kc++%></div></td><td><nobr><a href=javascript:openit1("DataFormHTML?rdap=Syllabusii")><%=Toolbox.emsgs(orgnum,993)%></a></nobr></td></tr>
<tr>
<td  width="<%=(cachedstyle.fontsize+4)%>"><div class=circle><%=kc++%></div></td><td  id="ins0"> 
<a href="javascript:openit1('insservice.jsp')"> More Services</a>
</td>
</tr>   
<%
}

%>
</TABLE>
</form>
<%=Toolbox.sponsor(orgnum,11+nt, 0)%> 
</center>

<script type="text/javascript">
  
var url = "<%=request.getRequestURL().toString()%>"; 
var savedurl =  "openit(\"DataFormHTML?rdap=studentbasic&uid=<%=sid%>&onbegin=8\")";
var coursesession= "<%=forpass%>";
var timeslots = [<%= timeslots.replaceFirst(",", "") %>];
var timenowstr = <%=(new GregorianCalendar()).get( Calendar.DAY_OF_WEEK )%>;
var timenowsec = <%=System.currentTimeMillis()%> - (new Date()).getTime() ;
var studentdriven = false;//<%=Toolbox.dbadmin[orgnum%65536].studentdriven%>;
var numcourses = <%=nn%>;
var msg288 = "<%=Toolbox.emsgs(orgnum,288)%>";
var sid = "<%=sid%>";
var uid = "<%=user.id%>";
var semester =  "<%=semester%>";
function resetassociate()
{
    var f = document.form1;
    if (typeof (f.course)=='undefined')return;
    var i = f.course.selectedIndex;
    if (i <0) return;
    var cid = f.course.options[i].value;
    <%=asso%>
}
function getName(){return "<%=Toolbox.makeFullName(user.lastname,"", user.firstname)%>";}
function getIds(){return distinct("<%=advisor%><%=iids%>");}
function getInames(){return distinct("<%=advisorname%><%=inames%>");}
function advisorid(){return '<%=advisor%>';} 
<%=  sallsession.toString()%>
   
<%  if (sallsession.length() > 0) out.print((sallsession.charAt(sallsession.length()-1)==';')?"":"];"); %>
    
</script>
<script  type="text/javascript" src="studentindex.js"></script>
<script  type="text/javascript" src="floating.js"></script>
<script  type="text/javascript" src="curve.js"></script>
</body>
</html>

