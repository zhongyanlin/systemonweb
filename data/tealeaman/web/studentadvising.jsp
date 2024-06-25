
<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
int orgnum = Toolbox.setcharset(request,response); 
    if (orgnum == -1) return;
User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request, response, "studentadvising.jsp", true)) == null) 
  return;
orgnum=user.orgnum;
String mode=Toolbox.defaultParam(orgnum,request, "mode", null, null, 12);
if (mode != null && mode.equals("openz12"))
{
    String majorprogram =  Toolbox.defaultParam(orgnum,request,"majorprogram","");
    String minorprogram =  Toolbox.defaultParam(orgnum,request,"minorprogram","");
    String wcds = " WHERE Course.id=Curriculum.cid AND (Curriculum.aid='"   + majorprogram +  "' OR Curriculum.aid='"  + minorprogram +  "')";
    HashMap saved = new HashMap();
    saved.put("wcds", wcds);
    saved.put("rdap", "curriculumview");
    saved.put("subdb", "");
    saved.put("onbegin", "93");
    session.setAttribute("savedDBRequest", (Object)saved); 
     //"DataTable?rdap=curriculumview&subdb=&wcds=" + sql +"&onbegin=" + onbegin1;
    RequestDispatcher dispat = this.getServletConfig().getServletContext().getRequestDispatcher("/DataTable");
    dispat.forward((ServletRequest)request, (ServletResponse)response); 
    return;
}
%>
<!DOCTYPE html>
<html >
 <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title> <%=Toolbox.emsgs(orgnum,1166)%> </title>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("studentadvising.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=Toolbox.defaultFontSize%>));</script>
 </head> 

<body bgcolor=<%=cachedstyle.DBGCOLOR%> leftmargin=0  rightmargin=0 topmargin=2 bottommargin=0> 
<%

if (mode == null)
{
   String majorprogram = "";// Toolbox.defaultParam(orgnum,request,"majorprogram","");
   String minorprogram = "";//Toolbox.defaultParam(orgnum,request,"minorprogram","");
   String sid = Toolbox.defaultParam(orgnum,request,"sid","", null,30);
   
   String tt = "27"; //for(r=numRows-1;r>=0;r--)valuechanged[r]=false;";
   if ( (user.roles & Systemroles.TEACHINGADMIN) > 0) tt = "";
    
   JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
   adapter.orgnum = orgnum ;
 
   String semes="";
   String allsemes = ";";
   boolean start = false;
   int n = adapter.executeQuery("SELECT code, domainValue FROM DomainValue WHERE domain='Semester'  AND language='" + Toolbox.langs[orgnum>>16] + "'  order by code");  
     if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
   for (int j = 0; j < n; j++)
   {
      if (adapter.getValueAt(j,1).equals(Toolbox.dbadmin[orgnum%65536].currentSemester))
          start = true;
      allsemes += adapter.getValueAt(j,1) + ";";
      if (start)
      {
           semes += adapter.getValueAt(j,1) + "," + adapter.getValueAt(j, 1);
           if (j < n-1) semes+= ";";
      }
   }
    
   String gradestr = ";";
   if (Toolbox.dbadmin[orgnum%65536].gradeSystem!=1) 
   {
       n = adapter.executeQuery("SELECT code, domainValue FROM DomainValue WHERE domain='Grade'  AND language='" + Toolbox.langs[orgnum>>16] + "'  order by code");
       for (int j = 0; j < n; j++)
       {
             gradestr +=adapter.getValueAt(j,0) + ";" + adapter.getValueAt(j,1) + ";";
       }
   }
   String statustr = "var statustr=[\"\"";
   n = adapter.executeQuery("SELECT code, domainValue FROM DomainValue WHERE domain='" + Toolbox.emsgs(orgnum,1101) +"' or domain='Registration Status'  AND language='" + Toolbox.langs[orgnum>>16] + "'  order by code");
   for (int j = 0; j < n; j++)
   {
       statustr += ",\""+ adapter.getValueAt(j,1) + "\"";
   }
   statustr += "]";
   String fname = "",prevschool="",startdate="0";
   String status = "";
   long grader = 0;
    
   n = adapter.executeQuery("SELECT advisor,firstname,middlename, lastname, prevschool,entrytime,majorprogram,minorprogram,status FROM Student,AppUser WHERE Student.id='" + sid.replaceAll("'","''") +"' AND AppUser.id='" + sid.replaceAll("'","''") +"'"); 
   if (n>0) 
   {
       long stdt = 0;
       statustr +=";\nvar advisor='" + adapter.getValueAt(0,0) +"';";
       prevschool = adapter.getValueAt(0,4);
       try{startdate  = adapter.getValueAt(0,5);}catch(Exception e){}
       try{ stdt = Long.parseLong(startdate);}catch(Exception e){}
       grader = ( System.currentTimeMillis()/1000 -  stdt )/24/3600/365 + 1; 
       fname = Toolbox.makeFullName(adapter.getValueAt(0,3),adapter.getValueAt(0,2),adapter.getValueAt(0,1));
       majorprogram = adapter.getValueAt(0,6); 
       minorprogram =  adapter.getValueAt(0,7); 
       if (majorprogram==null)majorprogram = "";
       if (minorprogram==null)minorprogram = "";
       status = adapter.getValueAt(0,8);
   }
   else statustr +=";\nvar advisor='';";
   
   String sql = "";
   if (majorprogram.equals("")==false)
       sql += "SELECT  '" + Toolbox.emsgs(orgnum,570) + "', Acaprogram.major, Acaprogram.category, Acaprogram.degree FROM Acaprogram WHERE id='" + majorprogram.replaceAll("'","''") +"'";
   if (minorprogram.equals("")==false)
       sql += " UNION SELECT  '" + Toolbox.emsgs(orgnum,1050) + "', Acaprogram.major, Acaprogram.category, Acaprogram.degree FROM Acaprogram WHERE id='" + minorprogram.replaceAll("'","''") +"'"; 
   n = 0;
   if (sql.equals("")==false) 
       n = adapter.executeQuery(sql);
        
   String major,minor,category,degree;
   if (n<=0)
   {
       major=Toolbox.emsgs(orgnum,480); minor = major; category = "";degree="";
   }
   else if (n==1)
   {
       if (adapter.getValueAt(0,0).equals(Toolbox.emsgs(orgnum,570)))
       {
           major = adapter.getValueAt(0,1); minor=""; 
       }
       else 
       {
           minor = adapter.getValueAt(0,1); major="";
       }
       category=adapter.getValueAt(0,2);
       degree = adapter.getValueAt(0,3); 
   }
   else 
   {
       if (adapter.getValueAt(0,0).equals(Toolbox.emsgs(orgnum,570)))
       {
           category=adapter.getValueAt(0,2);
           degree = adapter.getValueAt(0,3); 
           major = adapter.getValueAt(0,1);
           minor = adapter.getValueAt(1,1);
       }
       else
       {
           category=adapter.getValueAt(1,2);
           degree = adapter.getValueAt(1,3); 
           major = adapter.getValueAt(1,1);
           minor = adapter.getValueAt(0,1);
       }
   }
   adapter.close();
   String style="style=\"margin:0px 0px 0px 0px;width:70px\"";
   %>
   <center>
   <%=Toolbox.title(Toolbox.emsgs(orgnum,1049))%> 
   <table  align=center cellspacing=0 cellpadding=0> <tr height=3><td></td></tr> 
               <table  align=center cellspacing=0 cellpadding=0>
                   <tr><td><input class=GreenButton <%=style%> name=match type=button value="<%=Toolbox.emsgs(orgnum,994)%>" onclick=match()>
                   </td><td><input class=GreenButton  <%=style%>  name=Register type=button value="<%=Toolbox.emsgs(orgnum,996)%>" onclick=add(1)>
                   </td><td><input class=GreenButton <%=style%>  name=schedule type=button value="<%=Toolbox.emsgs(orgnum,1051)%>" onclick=add(2)>
                   </td><td><input class=GreenButton  <%=style%>  name=transcript type=button value="<%=Toolbox.emsgs(orgnum,1052)%>" onclick=transcript()>
                   </td><td><input class=OrangeButton  <%=style%>  name=save type=button value="<%=Toolbox.emsgs(orgnum,36)%>" onclick="parent.z22.setaction(1)">  
                   </td><td><input class=RedButton  <%=style%>  name=del type=button value="<%=Toolbox.emsgs(orgnum,30)%>" onclick="parent.z22.setaction(3)"> 
                   </td><td><input class=GreenButton  <%=style%>  name=help type=button value="<%=Toolbox.emsgs(orgnum,32)%>" onclick="parent.z22.showhelp()">
   </td></tr></table>
   <form rel=opener name=form1 action="Esign" method=post style="margin-top:0;margin-bottom:0"   >
       <input name=feeid type=hidden value=10>
       <input name=content type=hidden>
       <input name=uid type=hidden value="<%=sid%>" >
       <input type=hidden name=securitytoken value="<%=Toolbox.gentoken("studentadvising.jsp","form1")%>">
   </form>  
   <form rel=opener name=form2 action="DataTable" method=post style="margin-top:0;margin-bottom:0"   >
       <input name=rdap type=hidden value=curriculumview>
       <input name=subdb type=hidden value="">
       <input name=wcds type=hidden value="" >
       <input name=onbegin type=hidden value="" >
       <input type=hidden name=securitytoken value="<%=Toolbox.gentoken("studentadvising.jsp","form2")%>">
   </form>  
    
    <script type="text/javascript"  src="isjiao.js"></script>
   <script type="text/javascript" >var timeformat = "<%=Toolbox.timeformat%>"; timeformat=timeformat.replace(/hh/,'').replace(/mm/,'').replace(/ss/,'').replace(/:/g,'');</script>
   <script type="text/javascript"  src=timeformat.js></script> 
   <script type="text/javascript" >
   var font_size = <%=cachedstyle.fontsize%>,
   grader = <%=grader%>,tmsg402='<%=Toolbox.emsgs(orgnum,402)%>',tmsg209 = "<%=Toolbox.emsgs(orgnum,209)%>",
   tmsg570 = "<%=Toolbox.emsgs(orgnum,570)%>", major="<%=major%>",minor= '<%=minor%>',
   tmsg1050='<%=Toolbox.emsgs(orgnum,1050)%>', tmsg1052='<%=Toolbox.emsgs(orgnum,1052)%>',tmsg816 = "<%=Toolbox.emsgs(orgnum,816)%>", 
   category = "<%=category%>",degree="<%=degree%>",startdate=timestr (<%=startdate%>),status='<%=status%>',
   prevschool = "<%=prevschool%>",meta='<meta http-equiv="Content-Type" content="text/html; charset=<%=Toolbox.encodings[orgnum>>16]%>" >',
   semester = '<%=Toolbox.dbadmin[orgnum%65536].currentSemester%>',isstudent=<%=sid.equals(user.id)%>;
   <%=statustr%>;
   //statustr[0] = statustr[8]; 
   var scpt = 'script',BBGCOLOR = '<%=cachedstyle.BBGCOLOR%>',DBGCOLOR = '<%=cachedstyle.DBGCOLOR%>',IBGCOLOR = '<%=cachedstyle.IBGCOLOR%>',
   semesterw = '<%=Toolbox.emsgs(orgnum,1004)%>',semes = '<%=semes.replaceAll(",","\">").replaceAll(";","</option><option value=\"")%>',
   allsemes = "<%=allsemes%>",sid = "<%=sid%>",sql = "<%=(" WHERE Course.id=Curriculum.cid AND (Curriculum.aid='")  + majorprogram +  ("' OR Curriculum.aid='") + minorprogram +  ("')")%>";
   majorprogram  = '<%=majorprogram%>',minorprogram  = '<%=minorprogram%>',
   /*eventcodes[25] = "parent.z12.syn5()";
eventcodes[26] = "if(cc==3){parent.z12.showlabel(rr);if(mat[rr][2]!='')setv(rr,cc,x);}";
eventcodes[27] = "for(r=numRows-1;r>=0;r--)valuechanged[r]=false;";
eventcodes[28] = "for(r=numRows-1;r>=0;r--)if(parseInt(mat[r][11])>0){mat[r][8]='';ele(r,8,'');}";
eventcodes[29] = "opener.log1(rr,cc,x,v)";*/
   onbegin1 = "25",
   onblur = "26",
   onclose1 = "27",title = "<%=Toolbox.dbadmin[orgnum%65536].unitname[orgnum>>16]%><br><%=Toolbox.emsgs(orgnum,1052)%>",
   fname = "<%=fname%>";
   <%if (user.id.equals(sid)) {%>
   var codes = "";
   <%} else if ((user.roles & Systemroles.TEACHINGADMIN ) > 0 || (user.roles & 32 ) > 0) {%>
   var codes = "r";
   <%} else {%>
   var codes = "a";
   <%}%>
       
   <% if (Toolbox.dbadmin[orgnum%65536].gradeSystem!=1) 
   {%>
   var series = '<%=gradestr%>';
   function lger(A,B)
   {
      var i1 = series.indexOf(";" + A +";");
      var i2 = series.indexOf(";" + B +";");
      return (i1 >= i2);
   }
   function numeric(A)
   {
      var i  = series.indexOf(";" + A +";");
      if (i >1 && series.charAt(i-2) =='-')
        return -parseInt(series.charAt(i-1));
      else if (i>0)
        return  parseInt(series.charAt(i-1));
      return -1;
   }
<%} else {%>
    function numeric(A)
    {
       var tt = parseInt(A);
       if (''+tt=='NaN') return -1;
       return tt;
    }
   function lger(A,B)
   {
      var a = parseInt(A);
      var b = parseInt(B);
      if (""+a == 'NaN') return false;
      if (""+b == 'NaN') return true;
      return (a>=b);
   }
   <%}    %>
   </script>
<script type="text/javascript"  src="studentadvising.js"></script>
 
<script type="text/javascript"  src="helpformat.js"></script>
<script type="text/javascript" >
    
helpstr +="<font color=purple><b>" + textmsg[51] + "</b></font><br><table>";
helpstr +="<tr><td><input type=button style=background:url(image/GreenButton.gif);background-color:#00BBBB;width:65px;color:white;font-weight:700;vertical-align:middle;font-size:14px value=\"<%=Toolbox.emsgs(orgnum,994)%>\" ></td><td>" + textmsg[758] +"</td></tr>";
helpstr +="</table>"; 
</script>
 <%
}
 
else if (mode.equals("pickcourse"))
{
String majorprogram =  Toolbox.defaultParam(orgnum,request,"majorprogram","");
String minorprogram =  Toolbox.defaultParam(orgnum,request,"minorprogram","");
String seme = "\"" +  Toolbox.defaultParam(orgnum,request,"seme",""); 
String sid =  Toolbox.defaultParam(orgnum,request,"sid","");
 
%>
<center>
    <table>
   <%=Toolbox.title(Toolbox.emsgs(orgnum,1049),1)%> 
   
   <tr><td> </td></tr>
   <tr><td>
<form rel=opener name=f1 method="post" action="DataTable"  >
    <input type="hidden" name="subdb" value="">
    <input type="hidden" name="onbegin" value="28">
    <input type="hidden" name="cellonblur" value="29">
    <input type="hidden" name="onsaved" value="3">
    <input type="hidden" name="onsave" value="5">
    <input type="hidden" name="rdap" value="coursepick">
    <input type="hidden" name="extraline" value="1">
    <input type="hidden" name="sid" value="<%=sid%>">
    
    <input type="hidden"  name="major" value="<%=majorprogram%>" >
    <input type="hidden" name="minor" value="<%=minorprogram%>">
    <select name=semester  style="font-family:inherit"   onchange=go(this)><%= Toolbox.dbadmin[user.orgnum%65536].semesteropts(null, orgnum) %></select>
    </td></tr>
   </table>
</form>
</center>    
<script> 
    window.title =   "<%=Toolbox.emsgs(orgnum,1049)%>"; 
function go(sel,n)
{
      if (sel.selectedIndex <0) 
          return;
      formnewaction(document.f1);
      visual(document.f1);
document.f1.submit();
}
</script>  
<% 
} 
else  if (mode.equals("schedule"))
{
String seme =  "\"" + Toolbox.defaultParam(orgnum,request,"seme","");
String sid =  Toolbox.defaultParam(orgnum,request,"sid",""); 
%> 
<center>
    <table>
   <%=Toolbox.title(Toolbox.emsgs(orgnum,1051),1)%> 
   
   <tr><td> </td></tr>
   <tr><td>
 <form rel=opener name=f1 method="post" action="DataHTML"  >
<input type="hidden" name="subdb" value="">
<input type="hidden" name="rdap" value="myschedule">
<input type="hidden" name="sid" value="<%=sid%>">
<select name=semester  style="font-family:inherit"   onchange=go(this)><%= Toolbox.dbadmin[user.orgnum%65536].semesteropts(null, orgnum) %>
</select>
</td></tr>
   </table>
</form>
</center>
<script>
window.title =   "<%=Toolbox.emsgs(orgnum,1051)%>"; 
function go(sel,n)
{
      if (sel.selectedIndex <0) 
          return;
      formnewaction(document.f1);
      visual(document.f1);
document.f1.submit();
}
</script>  

<% }%>    
  
<script type="text/javascript"  src=curve.js></script>     
</body>
</html>
