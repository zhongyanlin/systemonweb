<%@ page contentType="text/html; charset=utf-8" import="java.util.concurrent.*, telaman.*,java.sql.*,java.util.*,java.math.*,java.util.regex.*,java.io.*"%>
<%
int orgnum = Toolbox.setcharset(request, response);
if (orgnum == -1)
{
    return;
}
User user = null;
if (  (user = User.authorize(orgnum, Systemroles.TA | Systemroles.INSTRUCTOR | Systemroles.TEACHINGADMIN,application,session,request, response, "gradebyta.jsp", true)) == null|| !Toolbox.verifytoken(request))
{
    return;
}
 
int numoftries = 0, MAXTRIES = 2;
try{numoftries = Integer.parseInt((String)session.getAttribute("numoftries"));}catch(Exception e){}  
String courseid = Toolbox.defaultParam(orgnum, request, "courseid", null, null, 20);
String sessionname = Toolbox.defaultParam(orgnum, request, "sessionname", null, null, 20);
String subdb = Toolbox.defaultParam(orgnum, request, "subdb", "", null, 20);
String errorstr = Toolbox.defaultParam(orgnum, request, "error", "", null, 20);
int error = 0; try{error = Integer.parseInt(errorstr);}catch(Exception e){} 
boolean passed = true;

String[] err = new String[]{"", (Toolbox.emsgs(orgnum,211) + " "+ Toolbox.emsgs(orgnum,233)),Toolbox.emsgs(orgnum,681),Toolbox.emsgs(orgnum,869),Toolbox.emsgs(orgnum,1464)};
if (numoftries >= MAXTRIES) 
{
     passed = CaptchaServlet.passed(request);
    if (passed == false) 
    {
        error = 4;
    }
    
}

if (passed && sessionname != null && courseid != null)
{
    JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
    if (subdb.equals("")  )
    {
        String sql = "SELECT instructor  FROM Session WHERE courseid='" + courseid + "' AND name='" + sessionname + "' and semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester + "'";
        
        int n = adapter.executeQuery(sql);

        if (n == -1) 
        {
             out.println("</head><body>" + adapter.error() + "</body></html>");
             adapter.close(); 
             return;
        } 
        else if (n==0)
        {
             error = 1;
        } 
        else
        {
             subdb = adapter.getValueAt(0,0);
        }

    }
    if (!subdb.equals("")) 
    {
         subdb = subdb.trim();
         String sql = "SELECT server, driver, dbuserid,dbpassword  from DBOwner where id='" + subdb + "'";// AND NOT server='' group by server";
         int n = adapter.executeQuery(sql);
         if (n != 1)
         { 
             subdb=null;  
             error = 2;
         
         }
    }
    adapter.close();
    
}

boolean b1 = (error != 4);
boolean b2 = (!subdb.equals(""));
boolean b3 = (courseid != null);
boolean b4 = (sessionname != null);
boolean b5 = b1 && b2 && b3 && b4;
 
if (b5) 
{
  
%>
<jsp:forward  page="DataSearch">
<jsp:param name="orgnum"    value="<%=orgnum%>" /> 
<jsp:param name="subdb"     value="<%=subdb%>" />
<jsp:param name="Semester"  value="<%=Toolbox.dbadmin[orgnum%65536].currentSemester%>" />
<jsp:param name="rdap"      value="grading11" />
<jsp:param name="CourseId"  value="<%=courseid%>" />
<jsp:param name="Session"   value="<%=sessionname%>" />
</jsp:forward>
<%
}
else 
{
     numoftries++;
     session.setAttribute("numoftries", "" + numoftries);
     String style = Toolbox.butstyle(Toolbox.defaultFontSize).replaceFirst("background:[^\\)]+\\);", "border:0px;");
    
%>
<!DOCTYPE html>
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,669)%></title> 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
<style>div.circle{text-align:center;vertical-align:middle;display:block;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-weight:700;width:<%=(cachedstyle.fontsize+3) %>px !important;height:<%=(cachedstyle.fontsize+3) %>px;border-radius:<%=(cachedstyle.fontsize+3)/2%>px;font-size:<%=cachedstyle.fontsize%>px;color:<%=cachedstyle.IBGCOLOR%>;line-height:<%=cachedstyle.fontsize+2%>px;text-align:center;background-color:white} 
</style>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("studentmonitor.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>
</head>
<body style="margin:6px 12px 6px 6px  ">

 
<br>
<form rel=opener  name="f1" method=post  action=gradebyta.jsp  onsubmit="return validate()"   >
<input type="hidden" name="securitytoken" value="<%=Toolbox.gentoken("gradebyta.jsp","f1")%>" >
<input type="hidden" name="subdb" value="<%= subdb %>" >
 

<table cellpadding="1"  border="0" align=center id="main">
            <%=Toolbox.title(Toolbox.emsgs(orgnum,1582),1)%>
            <tr><td>
<script type="text/javascript" >document.write(round1('100%'));</script>
<table cellpadding="1" id="entries" border="0"  cellspacing="3" class=outset3 width=290 align=center>
 
<%  
    
    if (error!=0) {%>
    <tr><td colspan="3" style="color:red" align="center"> <%= err[error]%> </td></tr>
    <%}
%>
<tr> <td colspan=3> &nbsp; <td> </tr> 
<tr>   <%=Toolbox.fields(Toolbox.emsgs(orgnum,982),orgnum, cachedstyle)%>  <td align="center"> = </td><td>
<input name="courseid" style="border:1px #b0b0b0 solid !important;width:120px;font-size:16px" type="text" name="id"  onload="javascript:if(localStorage['courseidcook']!=null)this.value=localStorage['courseidcook']" size="20" maxlength="20" tabindex=1> 
    </td>
</tr>
<tr>  
<%=Toolbox.fields(Toolbox.emsgs(orgnum,233),orgnum, cachedstyle)%> <td  align="center"> &supe; </td><td> 
 
<input name="sessionname" style="border:1px #b0b0b0 solid !important;width:120px;font-size:16px" type="text" value="" onload="javascript:if(localStorage['sessioncook']!=null)this.value=localStorage['sessioncook']" size="20" maxlength="100" tabindex=2> 
</td>
</tr>

<% if (numoftries >= MAXTRIES) { %>
<tr> 
 <td colspan=1 style="padding:0px 0px 0px 15px"> 
 <img src="patchca.png" alt="<%=Toolbox.emsgs(orgnum,1463)%>"  style="cursor:pointer;vertical-align:text-bottom;height:22px;line-height:22px;" onclick="this.src=this.src+'?'+Math.random();">
 </td> <td align="center"> => </td>
 <td><input type="text" name="patchcafield"   style="border:1px #b0b0b0 solid !important;width:120px;font-size:16px" ></td>
</tr>
<% } %>

<tr> <td align=center colspan=3>
<input type="submit" class=BlueButton <%=style%>  name="submitbtn" value="<%=Toolbox.emsgs(orgnum,1046)%>" size="8" >
<input type="reset" class=OrangeButton <%=style%>  name="resetbtn" value="<%=Toolbox.emsgs(orgnum,192)%>" size="8" >
  
</td>
</tr> 
 
</table>
<script type="text/javascript" >document.write(round2);</script>
</td>
</tr> 
</table> 
</form> 
 
 <script type="text/javascript"  src=curve.js></script>
 <script>
 if (document.f1.courseid.value == '')
 {
     var xx = localStorage["TAgradecourse"];
     if (xx!=null && xx!='') document.f1.courseid.value = xx;
 }
 if (document.f1.sessionname.value == '')
 {
     var xx = localStorage["TAgradesession"];
     if (xx!=null && xx!='') document.f1.sessionname.value = xx;
 }
   
 function validate()
 {
     if (document.f1.courseid.value == '')
     {
         myprompt(textmsg[1634] + ' <%=Toolbox.emsgs(orgnum,982)%>');
         document.f1.courseid.focus();
         return false;
     }
     else
     {
         localStorage["TAgradecourse"] = document.f1.courseid.value;
     }
     if (document.f1.sessionname.value == '')
     {
         myprompt(textmsg[1634] + ' <%=Toolbox.emsgs(orgnum,233) %>');
         document.f1.sessionname.focus();
         return false;
     }
     else
     {
         localStorage["TAgradesession"] = document.f1.sessionname.value;
     }
     
     return true;
 }
if (opener!=null && typeof(opener.justopened) =='function')
    opener.justopened(window,false);
else if (parent!=window && typeof(parent.justopened) == 'function')
    parent.justopened(window,false);
     </script>
</body></html>
<% 
}
%>
