<%@ page isThreadSafe="true"  contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*,java.io.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
    long tstmp = System.currentTimeMillis()%10000000;
%>
 
<%!
void out2File(JDBCAdapter adapter,  Scheduler sch, boolean partial, String err, int fontsize, int orgnum, CachedStyle cachedstyle)
{
     StringBuffer buf = new StringBuffer();
     printout(buf,  sch, partial, err, orgnum, cachedstyle); 
     buf.append("</body></html>");
     long stmp = (long) (   (new java.util.Date()).getTime()/1000);
     err = buf.toString().replaceAll("'","''");
     String sql0 = "INSERT INTO Scherror(lastupdate, dept, semester, message) values (" + stmp  + ",'" + sch.dept + "'," + sch.semester + ",'" + err + "')";
     int n = adapter.executeUpdate(sql0); 
     if (n != 1)
     {
         sql0 = "Update Scherror SET lastupdate=" +    stmp  + ", message='" + err  + "' WHERE dept='"  + sch.dept + "' AND semester=" + sch.semester;
         n = adapter.executeUpdate(sql0); 
     }
}
 
 public void printout(StringBuffer buf,  Scheduler sch, boolean partial, String err, int orgnum,CachedStyle cachedstyle )  
 { 
    String semester = sch.semester;
    String semesterName = sch.semesterName;
    buf.append((new java.util.Date()).toString() + "<br><br>");
    if (partial)
    {
      buf.append("\n");
      buf.append(Toolbox.emsgs(orgnum,978));
      buf.append(" ");
      buf.append("<b>");
      buf.append(Toolbox.emsgs(orgnum,959));
      buf.append("</b> ");
      buf.append(Toolbox.emsgs(orgnum,260));
      buf.append(Toolbox.emsgs(orgnum,352));
      buf.append("<b>");
      buf.append(Toolbox.emsgs(orgnum,962));
      buf.append("</b> ");
      buf.append(Toolbox.emsgs(orgnum,979));
      buf.append("\n");
      buf.append("<center>\n");
      buf.append("<h1>");
      buf.append(Toolbox.emsgs(orgnum,980));
      buf.append("</h1>\n");
      buf.append("<style type=text/css>\n table.tr.td.table.tr.td{background-color:");
      buf.append( cachedstyle.TBGCOLOR);
      buf.append("}   \n");
      buf.append("</style>\n");
      if (sch.orders != null){
      buf.append("<TABLE cellpadding=1 cellspacing=0 border=0 bgcolor=#999999>");
      buf.append("<tr>");
      buf.append("<td>\n");
      buf.append("<table align=center cellpadding=1 cellspacing=1 border=0 >\n ");
      buf.append("<tr style=\"background:" + Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle) +"\">");
      buf.append("<td>");
      buf.append(Toolbox.emsgs(orgnum,982));
      buf.append("</td>");
      buf.append("<td>");
      buf.append(Toolbox.emsgs(orgnum,233));
      buf.append("</td>");
      buf.append("<td>");
      buf.append(Toolbox.emsgs(orgnum,983));
      buf.append("</td>");
      buf.append("<td>");
      buf.append(Toolbox.emsgs(orgnum,18));
      buf.append("</td>");
      buf.append("<td>");
      buf.append(Toolbox.emsgs(orgnum,985));
      buf.append("</td>");
      buf.append("<td>");
      buf.append(Toolbox.emsgs(orgnum,986));
      buf.append("</td>");
      buf.append("<td>");
      buf.append(Toolbox.emsgs(orgnum,987));
      buf.append("</tr> \n");

   int k = sch.firstNull1();
   
   for (int m = 0; m < sch.orders.length; m++)
   {
       int i = sch.orders[m];
       if (i !=k)
       buf.append("<tr><td  bgcolor=" + cachedstyle.TBGCOLOR +">" + sch.items(i,0).replaceFirst(" ","</td><td>").replaceFirst(" ","</td><td>").replaceAll("</td><td>","</td><td bgcolor=" + cachedstyle.TBGCOLOR +">") + "</td><td  bgcolor=" + cachedstyle.TBGCOLOR +">" 
               + sch.items(i, 1).replaceFirst("^$","&nbsp;") + "</td><td bgcolor=" + cachedstyle.TBGCOLOR +">" + sch.items(i, 2).replaceFirst("^$","&nbsp;") + "</td><td bgcolor=" + cachedstyle.TBGCOLOR +">" + sch.items(i, 3).replaceFirst("^$","&nbsp;") +"</td><td   bgcolor=" + cachedstyle.TBGCOLOR +">" + sch.vk[i] +"</td></tr>");
       else
           buf.append("<tr><td  bgcolor=red>" + sch.items(i,0).replaceFirst(" ","</td><td>").replaceFirst(" ","</td><td>").replaceAll("</td><td>","</td><td bgcolor=red>") + "</td><td  bgcolor=" + cachedstyle.TBGCOLOR +">" 
               + sch.items(i, 1).replaceFirst("^$","&nbsp;") + "</td><td bgcolor=" + cachedstyle.TBGCOLOR +">" + sch.items(i, 2).replaceFirst("^$","&nbsp;") + "</td><td bgcolor=" + cachedstyle.TBGCOLOR +">" + sch.items(i, 3).replaceFirst("^$","&nbsp;") +"</td><td   bgcolor=" + cachedstyle.TBGCOLOR +">" + sch.vk[i] +"</td></tr>");
       
   }

   if (k>=0) 
    {
        err = sch.error();
        err = err.replaceFirst("\n$","");
        err = err.replaceAll("\n","<br>&bull; ");
        err += "<b>";
        if (sch!=null && sch.sessions!=null && k < sch.sessions.length)
        {
            err += sch.sessions[k];
        }
        else
        {
            err += k;
        }
 
        err += "</b>";
        err += Toolbox.emsgs(orgnum,989) +". "; 
    }
      buf.append("\n");
      buf.append("</td>");
      buf.append("</tr>");
      buf.append("</table> ");
      buf.append("</td>");
      buf.append("</tr>");
      buf.append("</table>");
      }
      buf.append("</center>\n ");
      buf.append("<br>");
 
      buf.append("<script>var url='DataTable?subdb=&rdap=schresult&dept=" + sch.dept
                + "&semester=");
      buf.append("" + semester);
      buf.append("&semesterName='+encodeURIComponent('");
      buf.append((semesterName));
      buf.append("');</script> <a href=\"javascript:postopen(url,'_self')\">");
      buf.append(Toolbox.emsgs(orgnum,988));
      buf.append("</a>");
      buf.append("<br>\n \n");
      buf.append(Toolbox.emsgs(orgnum,990));
      buf.append(":");
      buf.append("<br>\n");
      buf.append("&bull; " + err);
      buf.append("\n\n");

    } 
    else 
    {

      buf.append("\n");
     // buf.append(Toolbox.emsgs(orgnum,990));
     // buf.append(":");
     // buf.append("<br>\n");
      buf.append(err);
      buf.append("\n");

    }
  }
 
%>
<%
  
User user = null;
if (!Toolbox.verifytoken(request) || (user = User.authorize(orgnum, Systemroles.TEACHINGADMIN | Systemroles.ASSESSER | Systemroles.SYSTEMADMIN, application, session, request, response, "schexecute.jsp", false)) == null) {
    return;
}
orgnum=user.orgnum;
String dept = Toolbox.defaultParam(orgnum,request, ("dept"), null);
dept = Toolbox.validate(dept, null, 20);
String action = Toolbox.defaultParam(orgnum,request, ("act"), null);
if (action == null) 
{
    action = "0";
}
String semester = Toolbox.defaultParam(orgnum,request, ("semester"), null);
semester = Toolbox.validate(semester, null, 3);
if (semester == null) 
{
    out.println("semester not specified");
    return;
}
String semesterName = Toolbox.defaultParam(orgnum,request, ("semesterName"), null);
semesterName = Toolbox.validate(semesterName, null, 30);
if (semesterName == null && !action.equals("2")) 
{
    out.println("semester not specified");
    return;
}
String err = "";
String fix = Toolbox.defaultParam(orgnum,request, ("fix"), null);
fix = Toolbox.validate(fix, null, 15);
String candidate = Toolbox.defaultParam(orgnum,request, ("candidate"), null);
candidate = Toolbox.validate(candidate, null, 15);
String goodtime = Toolbox.defaultParam(orgnum,request, ("goodtime"), null);
goodtime = Toolbox.validate(goodtime, null, 15);
String exclusion = Toolbox.defaultParam(orgnum,request, ("exclusion"), null);
exclusion = Toolbox.validate(exclusion, null, 15);
String timeshare = Toolbox.defaultParam(orgnum,request, ("timeshare"), null);
timeshare = Toolbox.validate(timeshare, null, 15);
JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum); adapter.orgnum = orgnum;
Scheduler sch = null;
boolean partial = true;
 
if (action.equals("2")) 
{
    String sql = "SELECT dept,message FROM Scherror WHERE (dept='" + dept + "' OR '" + dept + "'='') AND semester=" + semester;
    int n = adapter.executeQuery(sql);
    if (adapter.error().length() > 0) 
{
    err = (adapter.error());
} 
else  
    if (n > 0) err += "<table cellpadding=4 border=0><tr valign=top><td align=left><nobr>" + Toolbox.emsgs(orgnum,798) + "</nobr></td><td align=left>" + Toolbox.emsgs(orgnum,276) + "</td></tr>";
    for (int i=0; i < n; i++)
    {
        err +="<tr  valign=top><td align=left>" + adapter.getValueAt(i,0) + "</td><td align=left>" + adapter.getValueAt(i,1) + "</td></tr>";
    }
     if (n > 0) err += "</table>";
    adapter.close();
}
else  if (action.equals("3")) 
{
    String sql = "UPDATE Session, Course SET Session.schedule=NULL,Session.room=NULL,Session.instructor=NULL WHERE Course.id=Session.courseid AND  Course.department='" + dept + "'  AND semester='" + semester + "'";
    if (dept.equals(""))
         sql = "UPDATE Session SET Session.schedule=NULL,Session.room=NULL,Session.instructor=NULL WHERE semester='" + semester + "'";
    int n = adapter.executeUpdate(sql);
     
    if (n < 0) 
    {
        err += adapter.error();
         adapter.close();
    }
    else
    {
       sql = "Update  Scherror set message = '' WHERE (dept='" + dept + "' OR '" + dept + "'='') AND semester=" + semester;
       adapter.executeUpdate(sql);
       sql = "UPDATE  Schuser SET realload=0 where (dept='" + dept + "' OR '" + dept + "'='')    and Schuser.semester=" + semester;
       adapter.executeUpdate(sql);
       sql = "DELETE FROM Scheduler  WHERE semester=" + semester + " and (which='i' or  which='j' or which='k') and (dept='" + dept + "' OR '" + dept + "'='')";
       adapter.executeUpdate(sql);
       adapter.close();
%>   
<jsp:include page="DataTable">
<jsp:param name="rdap"  value="schresult" />
<jsp:param name="subdb" value="" />
<jsp:param name="semester"  value="<%= semester%>" />
<jsp:param name="semesterName"  value="<%=semesterName%>" />
<jsp:param name="dept"  value="<%= dept%>" />
</jsp:include>   
        
   <% }
    
}
else 
{
     
    sch = new Scheduler(dept, orgnum);
    CachedStyle cachedstyle = new CachedStyle(request, orgnum);
    boolean hasfix =  null != fix;
    boolean hascan = null != candidate;
    boolean hasgoodtime = null != goodtime;
    boolean hasexclusion = null != exclusion;
    boolean hastimeshare = null != timeshare;
    if (sch.initfromdb(semester, semesterName, hasfix, hascan, hasgoodtime, hasexclusion, hastimeshare, adapter) == false ) 
    {
        err = (adapter.error()) + sch.error();
        
    }
    else
    {
                int b = sch.init();
        if (b!=1)
        {
            if (action.equals("0")) 
            {
                err += Toolbox.emsgs(orgnum,990) + "<br>";
                err += "&bull; " + sch.error().replaceFirst("\n$", "").replaceAll("\n", "<br>&bull; ");
                out2File(adapter, sch, partial, err, cachedstyle.fontsize, orgnum,cachedstyle);
            }
            else if (action.equals("1") && b==0) 
            {
                 
                boolean tt = sch.verify();
                if (tt == false) 
                {
                    err = "&bull; " + sch.error().replaceFirst("\n$", "").replaceAll("\n", "<br>&bull; ");
                } 
                else 
                {
                    err = Toolbox.emsgs(orgnum,991);
                }
            }
            else if (action.equals("1") && b==-1)
            {   
                  
                 err = "<pre>" + sch.error() + "</pre>";
            }
            adapter.close();
        }
        else
        {
            adapter.close();
            if (action.equals("0")) 
            {
               err = "1";
            }
            else  // verify
            {
               
                boolean tt = sch.verify();
                if (tt == false) 
                {
                    err = "&bull; " + sch.error().replaceFirst("\n$", "").replaceAll("\n", "<br>&bull; ");
                } 
                else 
                {
                    err = Toolbox.emsgs(orgnum,991);
                }
            }
        }
    }
     
}
       
adapter.close();
%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">      
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%> 
<%=Toolbox.getMeta(orgnum)%>
<style type="text/css"> 
     
    input.BG {background-color:<%=cachedstyle.TBGCOLOR%>; color:<%=cachedstyle.IBGCOLOR%>; border:0;text-align:right}
    input.BG1 {background-color:<%=cachedstyle.TBGCOLOR%>; border:0;text-align:right}
    input.BG2 {background-color:<%=cachedstyle.DBGCOLOR%>; border:0}
     
</style>

<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("schexecute.jsp","f3")%>";var tstmp=<%=tstmp%>;</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script> 
<script type="text/javascript" >
document.write(unifontstyle(<%=cachedstyle.fontsize%>));
</script>
</head>
<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px" >
 <center>

<%=Toolbox.title(Toolbox.emsgs(orgnum,1043))%> 
 </center>
 <br>
  <%
        if (!err.equals("1"))
  {
            out.println(err);
      if (action.equals("2"))out.println("<script>");
  }
  else
  {
     int sek = SessionCount.enq(session.getId());
      
 %>
<form rel=opener name=f3 action=Schedule method=post target=tiny   >
<input type="hidden" name="dept" value="<%=dept%>" > 
<input type="hidden" name="semester"  value="<%=semester%>" >
<input type="hidden" name="semesterName"  value="<%=semesterName%>" >
<input type="hidden" name="fix"           value="<%=fix==null?0:1%>" >
<input type="hidden" name="candidate"  value="<%=candidate==null?0:1%>" >
<input type="hidden" name="goodtime"  value="<%=goodtime==null?0:1%>" >
<input type="hidden" name="exclusion"  value="<%=exclusion==null?0:1%>" >
<input type="hidden" name="timeshare"  value="<%=timeshare==null?0:1%>" > 
<input type="hidden" name="sek"  value="<%=sek%>" >
<input type="hidden" name="orgnum"  value="<%=orgnum%>" >
 </form>
 
 <script>
 function puterr1(s)
 {
     document.getElementById('hint1').innerHTML =   s;
     Msg.send({code:"quit"});
 }    
 function puterr(s )
 {
      document.getElementById('errmsg').innerHTML = document.getElementById('errmsg').innerHTML + s;
 }
 Msg.handlepost = function(s)
{
    var m = new Message(s);
    if (m.code == "newd")
    {
        Msg.tid = m.tid;
        Msg.listen();
    } 
    else if (m.code == 'snap')
    {
        var seg = m.msg.split(/\|/);
        var x = textmsg[1646].split(/,/);
        for (var i=1; i < 4; i++)
        seg[i] = seg[i].replace(/<table/, '<table width=100% border=1 style=border-collapse:collapse;border-radius:3px;background-color:white');
        myprompt("<table width=98%><tr><td>" + x[0] +seg[1]+ "</td></tr> <tr><td>" + x[1] +seg[2]+ "</td></tr><tr><td>" + x[2] +seg[3]+ "</td></tr></table>",null,null,x[0]);
        
    }
}
Msg.handleget = function(s)
{
    if (s == '')  return  ;
    var m = new Message(s);
    Msg.needmore = true;
    if (m.code == 'login')
    {
        window.open('login.jsp?follow=' + m.msg, 'w' + Msg.tstmp);
        Msg.needmore = false;
    }
    else  if (m.code == "plain")
    {
        puterr(m.msg );
    }
   
}
window.onunload = function()
{
    Msg.send({code:'quit'});
}
var onloadbeforeresche = null;
if (typeof  window.onload == 'function')
    onloadbeforeresche = window.onload;
window.onload = function()
{
 if (onloadbeforeresche!=null) 
     onloadbeforeresche();
 Msg.init({stoken:securitytoken,
    app:"chat",
    tid:'',
    sid:"<%=user.id%>",
    sname:"<%=user.id%>",
    rid:'',
    code:'',
    msg:'',
    key:"<%=sek%>scheduler",
    sendhandle:"Msgretrive",
    sek:"<%=sek%>"});
    Msg.recevhandle = "Msgretrive"; 
    Msg.send({code:'new',msg:'<%=Scheduler.runscheduling(orgnum)%>'});
   document.f3.target = parent.frames[0].getWtstmp();
   visual(document.f3);
   document.f3.submit();
 }
  
 function status1()
 {
     Msg.send({code:'snap'});
 }
 <%}
 if (action.equals("2") || err.equals("1")) {%>
 function postopen1()
 {
     postopen(url,'_self');
 }
 var url='DataTable?rdap=schresult&semester=<%=semester%>&subdb=<%=user.id%>&semesterName='+ encodeURIComponent("<%=semesterName%>") + '&dept=<%=dept%>';
 </script>  
<%}
%> 
<script type="text/javascript"  src=curve.js></script>  
 <%
  if (err.equals("1"))
  {
   out.println("<div id=hint1>" + Toolbox.emsgs(orgnum,1233) + "</div>");
   
   %> 
   <a href="javascript:status1()"><%=Toolbox.emsgs(orgnum,290)%></a>
  <div id="errmsg"></div>
  <iframe name="w<%=tstmp%>" width="1" height="1" /> 
  <%} %>
</body>
</html>
