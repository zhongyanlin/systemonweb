<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request, response);
    if (orgnum == -1) return;
boolean student = false;
long tstmp = (new Random()).nextInt()%10000000;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR | Systemroles.TEACHINGADMIN |Systemroles.ASSESSER,application,session,request, response, "alerta.jsp", true)) == null) 
    return;
//12345 - ABCD 123 - 01 
String semester = Toolbox.defaultParam(orgnum,request,"semester",  Toolbox.dbadmin[orgnum%65536].currentSemester, "", 100);
String mode = Toolbox.defaultParam(orgnum,request,"mode",null);
String cid="", assignname="", sessions="",sql="";
%>
<!DOCTYPE html> 
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,246)%></title> 
  
<%
 
if (mode!=null && mode.equals("attend"))
{
 %>
 </head>
 <body>
<%
     cid =  Toolbox.defaultParam(orgnum,request,"cid",null);
     sessions =  Toolbox.defaultParam(orgnum,request,"session",null);
     String ii =  Toolbox.defaultParam(orgnum,request,"ii",null); 
    if (cid!=null  && sessions!=null)
    {
        sql = "SELECT sid, count(*) as absence, max(atime) as matime  FROM Absence WHERE courseid='" + cid.replaceAll("'","") + "' AND semester=" +
                semester + " AND sessionname='" + sessions + "' AND askforleave=0 AND justified=0 GROUP BY sid";
       
       JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
       if (!adapter.error().equals(""))
       {
             adapter.close();
             out.println(adapter.server + Toolbox.emsgs(orgnum,1550) + "</body></html>");
             return;
       }
       int n = adapter.executeQuery(sql); 
       StringBuffer s = new StringBuffer(32*n); 
       for (int i=0; i < n; i++)
       { 
          s.append("mp['");
          s.append( adapter.getValueAt(i,0));
          s.append("']=[");
          s.append( adapter.getValueAt(i,1));
          s.append(",");
          s.append( adapter.getValueAt(i,2));
          s.append("];");
       }
       adapter.close();
        
%>
  <script>
      var timeformat= '<%=cachedstyle.timeformat%>';
  </script>
  <script type="text/javascript"  src=timeformat.js></script>
  <script>
       var mp = []; <%=s.toString()%>
       
       var ii = <%=ii%>;
       var q = parent.document.getElementById('maintable' + ii);
       var r = q.rows[0];
       var c = r.insertCell(-1); c.innerHTML = '<nobr><%=Toolbox.emsgs(orgnum,1605)%></nobr>'; c.align = 'right';
       c = r.insertCell(-1); c.innerHTML = '<%=Toolbox.emsgs(orgnum,1604)%>';
       for (var  i=1; i < q.rows.length; i++)
       {  
           var sid = q.rows[i].cells[1].innerHTML.replace(/ /g,'');
           var ab = mp[sid];
           r = q.rows[i];
           c = r.insertCell(-1);
           c.align = 'right';
           if (ab!=null)
           {
                c.innerHTML = ab[0];
                c = r.insertCell(-1);
                c.innerHTML = '<nobr>'+ timestr(ab[1])+'</nobr>';
            }
            else
            {
                c.innerHTML = '0'
                c = r.insertCell(-1);
                c.innerHTML = '<%=cachedstyle.timeformat.replaceAll(".","&nbsp;")%>';
            }
         }
         parent.mergeattend();
    </script>
<%
   }
%> 
</body></html>
<%
   return;
}
else if (mode!=null && mode.equals("toauto") || mode!=null && mode.equals("ingrading"))
{
%>
 </head>
 <body>
<%     
    cid =  Toolbox.defaultParam(orgnum,request,"cid",null);
    assignname  =  Toolbox.defaultParam(orgnum,request,"assignname",null );
    sessions =  Toolbox.defaultParam(orgnum,request,"sessions",null );
    int nn = -1;
   if (cid!=null && assignname!=null && sessions!=null)
   {
        sql = "UPDATE Assignment SET status=" + (mode.equals("toauto")?2:3) + " WHERE Assignment.course='" + cid.replaceAll("'","''")  
               + "'  AND Assignment.semester='"   + semester.replaceAll("'","''") 
               + "'  AND   Assignment.sessionname='" + sessions.replaceAll("'","''") 
               + "'  AND   Assignment.name='" + assignname + "'";
       JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
       if (!adapter.error().equals(""))
        {
            adapter.close();
            out.println(adapter.server + Toolbox.emsgs(orgnum,1550) + "</body></html>");
            return;
        }
       nn = adapter.executeUpdate(sql);
       adapter.close();
   }

%>
<script>
     parent.removeone("<%=cid + "-" + assignname + "<!--" + sessions  + "-->"%>");     
</script>
</body>
</html>
<%
return;
}
%>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle) %>, securitytoken="<%=Toolbox.gentoken("alert.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >
document.write(unifontstyle(<%=cachedstyle.fontsize%>)); 
if (document.location.toString().indexOf("localhost") >= 0
    && typeof (handleErr) == 'undefined')
{
function handleErr(msg, url, l)
{
      var txt= "There was an error on this page.\n\n"
       + "Error: " + msg + "\n"
       + "URL:   " + url + "\n"
       + "Line:  " + l + "\n\n"
       + "Click OK to continue.\n\n";
       
      window.onerror = handleErr;
      return true;
}
window.onerror = handleErr;
}
var flag = 0;
<%
cid =  Toolbox.defaultParam(orgnum,request,"coursesessiontimes","");
 
if (cid==null) return;
String title = "";
 
String msg = Toolbox.emsgs(orgnum,315) + "  "+Toolbox.emsgs(orgnum,316);
String style=    "width:" + Math.round(cachedstyle.fontsize*5) + "px;font-size:" + cachedstyle.fontsize +"px";
%>
var course = '<%=cid%>';
var title=' ';
 
var font_size = <%=cachedstyle.fontsize%>;
</script> 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />  
</head>

<body  >

<% 
String txt = Toolbox.defaultParam(orgnum,request, "txt", null, "&-_@#$%!+{}[]\";';,/", 1000);
   
if (txt==null) 
{
String cidstr =   (cid) ;
if (cidstr == null || cidstr.equals("")) 
{%>
<script>
function dodemo()
{
    parent.frames[0].demo();
}
myprompt(textmsg[351] + "<br>" + textmsg[1836].replace(/@.*/,''),null,"if(v)dodemo();");

</script>
</body></html>   
<%return;}

 
String cids[] = cidstr.split(";");
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
} 
String alln = ""; 
String allc = "";
String alle = "";
String assignquiz = "Assignment.atype < 4";
String about = Toolbox.emsgs(orgnum,296);
String threshold = Toolbox.defaultParam(orgnum, request, "threshold",null); 
 
HashMap<String,Integer> pert = new HashMap();
if (threshold!=null)
{
    String [] percent = threshold.split("\\|");
    for (int i=0; i < percent.length; i++)
    {
       String [] temp = percent[i].split(":");
       if (temp.length == 2)
       try{pert.put(temp[0],Integer.parseInt(temp[1]));}catch(Exception e){}
    }
}  
if (Toolbox.defaultParam(orgnum,request,"x",null) !=null)
{
    assignquiz = "Assignment.atype = 4";
    about = Toolbox.emsgs(orgnum,1378);
} 
out.println("<center>"  + Toolbox.title(   about + ": " + Toolbox.emsgs(orgnum,1541)) + "</center>");
int nn =0;
boolean donehead = false;
for (int i=0; i < cids.length; i++)
{
   
   String y[] = cids[i].split(","); 
   if (y.length < 2) break;
   int m = Integer.parseInt(y[2]);
   if (m < 0) continue; 
   
   String lastdue = y[3];  
   allc += y[0] + ",";
   String query = "select Submission.sid, AppUser.lastname, AppUser.firstname, count(*), Registration.evaltime,email FROM AppUser, Submission, Registration,Assignment  WHERE Assignment.name=Submission.assignname AND Assignment.semester=Submission.semester AND "+ assignquiz + " AND  Assignment.course=Submission.course AND"
           +"(Assignment.sessionname='" + y[1] + "' OR Assignment.sessionname LIKE '%," + y[1] + ",%' OR Assignment.sessionname LIKE '%," + y[1] + "'  OR Assignment.sessionname LIKE '" + y[1] + ",%')"
           +" and Submission.course='"+ y[0].replaceAll("'","''")  + "' and Registration.semester=Submission.semester and Submission.semester='" + semester.replaceAll("'","''")
           + "' and Submission.course=Registration.courseid and Submission.sid=Registration.sid and Registration.sessionname='" 
           +  y[1].replaceAll("'","''")  + "' and AppUser.id = Submission.sid and Submission.sid NOT IN (select   sid FROM Submission where course='"
           + y[0].replaceAll("'","''") + "' and semester='" + semester.replaceAll("'","''") + "' and assignname='" + y[3] + "') group by Submission.sid " 
           + "UNION SELECT Registration.sid, AppUser.lastname, AppUser.firstname, 0, Registration.evaltime,email  FROM AppUser, Registration  WHERE Registration.courseid='"
           + y[0].replaceAll("'","''") + "' and AppUser.id=Registration.sid and Registration.semester='" + semester.replaceAll("'","''")+ "' and Registration.sessionname='" 
           + y[1].replaceAll("'","''") + "' and Registration.sid NOT IN (select distinct sid FROM Submission,Assignment where  Assignment.name=Submission.assignname AND Assignment.semester=Submission.semester AND  "+ assignquiz + "  and  Assignment.course=Submission.course AND "
           + "(Assignment.sessionname='" + y[1] + "' OR Assignment.sessionname LIKE '%," + y[1] + ",%' OR Assignment.sessionname LIKE '%," + y[1] + "'  OR Assignment.sessionname LIKE '" + y[1] + ",%')"
           +" and Submission.course='" + y[0].replaceAll("'","''") + "' and Assignment.semester='" + semester.replaceAll("'","''") + "')  order by 4" ;  
    
   int n = 0;
   boolean b = adapter.executeQuery2(query,false);
   if (!b)
       out.println(adapter.error());
   else if (adapter.getValueAt(0,0)==null ) 
   {
       continue;
   }
    
   
   long nowt = System.currentTimeMillis()/1000;
   int jj = 0;
   for (int j=0; adapter.getValueAt(j, 0)!=null; j++)
   {
       if (adapter.getValueAt(j, 0).trim().equals("")) continue;
       n++;
        
       alle += "emailm['" + adapter.getValueAt(j, 0)  + "']='" + adapter.getValueAt(j, 5) + "';";
       long t = 0; try{t = Long.parseLong(adapter.getValueAt(j, 4));}catch(Exception e){ }
       int ns = 0; try{ns = Integer.parseInt(adapter.getValueAt(j, 3));}catch(Exception e){}
       String ts = "";
       if (t != 0) ts = Toolbox.timestr(t, cachedstyle.timeformat);
       int rate = 33;
       try{ rate = pert.get(y[0] + "-"+ y[1] ).intValue();
       }catch(Exception e){}
       if (ns > m*(100-rate)/100) continue;
if (donehead == false)
{%>
     <div id="instr0"><%=Toolbox.emsgs(orgnum,1525)%></div>
      <center>
   <%
   donehead = true;
}
if(jj == 0)
{
       out.println("<div  style=\"margin:20px 0px 0px 0px;font-size:20px;font-weight:bold\" >" + y[0] + "-" + y[1] + ":" + y[4] +"</div><div style=\"color:#CC0000;font-size:14px\">(" + Toolbox.emsgs(orgnum,631) + " " + (y[3].replaceAll("[0-9]","").equals("")?Toolbox.timestr(Long.parseLong(y[3]),cachedstyle.timeformat):y[3])  +  " & " + Toolbox.emsgs(orgnum,1527) + " &ge; <a href=javascript:changeper('"+ y[0] + "-"+ y[1] + "',"+ rate + ")>"+ rate + "</a>% )&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href=\"javascript:mergeattend()\">"+Toolbox.emsgs(orgnum,1593) +"</a> </div>");
   %>
<table width=100% cellpadding=0 cellspacing=0 class=outset3 >   
<tr><td bgcolor="<%=cachedstyle.IBGCOLOR%>"> 
<TABLE cellpadding=3 cellspacing=0 border=1 style="border-collapse:collapse"  width=100% id="maintable<%=i%>"> 
<tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>">
 <td width=25 align=center  valign=middle ><input type=checkbox name=check1   onclick=checkall(this)  style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>" ></td>
 
 <td align=left><nobr><%=Toolbox.emsgs(orgnum,163)%></nobr></td>
 <td align=left width="200"><nobr><%=Toolbox.emsgs(orgnum,273)%></nobr></td>
 <td align=right><nobr><%=Toolbox.emsgs(orgnum,1526).replaceFirst("/.*","")%></nobr></td>
 <td align=right><nobr><%=Toolbox.emsgs(orgnum,1526).replaceFirst("[^/]+/","")%></nobr></td>
 <td align=right><nobr><%=Toolbox.emsgs(orgnum,1527)%></nobr></td>
 <td align=left><nobr><%=Toolbox.emsgs(orgnum,1528)%></nobr></td> 
</tr>
   <%
}
jj++;
       String checked = (nowt - t > 5*24*3600)? "checked":""; 
       alln += adapter.getValueAt(j, 0) + "," + y[0] + "\n";
       out.println("<tr  bgcolor=" + cachedstyle.TBGCOLOR + " valign=middle ><td  align=center width=25px ><input  " + checked + " onclick=alln() type=checkbox></td>");
       out.println("<td  align=left>"+ adapter.getValueAt(j, 0) + "</td>");
       out.println("<td align=left width=200 style=color:blue onclick=studentinfo('"+ adapter.getValueAt(j, 0) + "')><nobr>"+ Toolbox.makeFullName(adapter.getValueAt(j, 1), "  ", adapter.getValueAt(j, 2)) + "</nobr></td>");
       out.println("<td align=right>"+ adapter.getValueAt(j, 3)  +  "</td>");
       out.println("<td align=right>"+    m +  "</td>");
       out.println("<td align=right>"+ Math.round(100*(m-Integer.parseInt(adapter.getValueAt(j, 3)))/m) + "% </td>");
       out.println("<td  align=left><nobr>"+ ts + "</nobr></td>");
       out.println("</tr>"); 
   }
    out.println( "</table></td></tr></table>");
    nn += jj;
}
String sql3 = "SELECT DISTINCT Assignment.course, Assignment.name,Assignment.sessionname,Assignment.semester FROM Assignment,Session WHERE Assignment.status=3 AND Assignment.course=Session.courseid AND Assignment.semester=Session.semester AND ("
+ " Assignment.sessionname=Session.name OR Assignment.sessionname LIKE CONCAT('%,',Session.name) OR Assignment.sessionname LIKE CONCAT(Session.name,',%') OR Assignment.sessionname LIKE CONCAT('%,',Session.name, ',%') ) AND  Assignment.semester='" + semester + "' AND Session.instructor='" + user.id +"'";
//out.println("<!--" + sql3 + "-->");
int n1 = 0;
boolean b = adapter.executeQuery2(sql3,false);
String xx = "";
if (b && adapter.getValueAt(0,0)!=null)
{
    for (int j=0; adapter.getValueAt(j,0)!=null; j++)
    {
        n1++;
        if (!xx.equals("")) xx += ", ";
        xx += "<a href=\"javascript:gochange('" + adapter.getValueAt(j,0).replaceAll("'","\\'") + "','" + 
           adapter.getValueAt(j,1).replaceAll("'","\\'") + "','"  + adapter.getValueAt(j,2).replaceAll("'","\\'") + "','" + 
           semester.replaceAll("'","\\'") + "')\">" + adapter.getValueAt(j,0) + "-" + adapter.getValueAt(j,1) + "<!--" + adapter.getValueAt(j,2) + "--></a> ";
    }
}
 
if (nn == 0) 
{
     out.println("</center>" +  Toolbox.emsgs(orgnum,1535)  );
    if (n1 > 0)
    out.println(  "<div id=listd3 style=text-align:left;font-size:10px;color:#990000>&#9787;" +   Toolbox.emsgs(orgnum,1539) + ": " + xx + "</div>");
   %>   <script> function gochange(cid,ass,ses,sem)
{
   postopen("alerta.jsp", ['cid', 'assignname','sessions','semester','mode'],[cid,ass,ses,sem,'toauto'],'w<%=tstmp%>');
}</script> 
   <iframe name="w<%=tstmp%>" height="1" width="1" style="visibility:hidden" />
    <%
    out.println(  "</body></html>");
    adapter.close();  
    return;
}
adapter.close();  
 
%>

<form name="thisform" method="POST" action="alerta.jsp" style="margin:15px 0px 0px 0px" onsubmit="return submitform()" 
   target="w<%=tstmp%>"   
>
 
<table id="root" width=100% cellpadding=0 cellspacing=0 class=outset3 >   
<tr><td bgcolor="#b0b0b0">
<TABLE cellpadding=0 cellspacing=1 border=1 style="border-collapse:collapse"  width=100% >
<tr  style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>">
 <td align=left valign=top  ><%=Toolbox.emsgs(orgnum,306)%></td> 
<td rowspan="2"   style="width:80%;background-color:<%=cachedstyle.TBGCOLOR %>" valign="top"><textarea name=txt style="width:99%;margin-top:0px;border:0px" rows=3 tabindex=2><%=Toolbox.emsgs(orgnum,1529)%></textarea></td>
<td align=center valign=middle style="width:22px;border-right-width:0px;background-color:<%=cachedstyle.TBGCOLOR %>;"><input   type="checkbox" name=advisor value="1"  tabindex=3 checked="true"></td>
<td style="border-left-width:0px;" ><nobr><%=Toolbox.emsgs(orgnum,1564)%></nobr></td></tr>

<tr><td style="background-color:<%=cachedstyle.TBGCOLOR %>;border-radius:3px"><textarea name=ids rows=2 cols=6  style="visibility:hidden"></textarea></td>
<td colspan="2" align="center" style="background-color:<%=cachedstyle.TBGCOLOR %>"><input class=RedButton  style="<%=style%>" type="submit" name=submit value="<%=Toolbox.emsgs(orgnum,317)%>"  tabindex=4></td>
</tr>
</table></td></tr>
</table>
</form>
<form rel=opener name="foremail" method="post" action="Email" target="w<%=tstmp%>" > 
    <input type="hidden" name="email" value="">
    <input type="hidden" name="Subject" value="<%= Toolbox.emsgs(orgnum,246) %>" > 
    <input type="hidden" name="Content" value="<%= Toolbox.emsgs(orgnum,1530) + "\n"+ Toolbox1.geturl(request).replaceFirst("alerta\\.jsp.*","")  %>">  
</form>
<% if (n1 > 0)
    out.println(  "</center><div id=listd3 style=text-align:left;font-size:10px;color:#990000>&#9787;" +   Toolbox.emsgs(orgnum,1539) + ": " + xx +  "</div>");
%>
<script type="text/javascript" > 
var tstmp = <%=tstmp%>;
var allc = "<%=allc.replaceFirst(",$","")%>".split(/,/);
var emailm = new Array();<%=alle %>
var msg1566 = "<%= Toolbox.emsgs(orgnum,1566)+ "\\n"+ Toolbox1.geturl(request).replaceFirst("alerta\\.jsp.*","")%>";
var alle='';
var msg246 = "<%= Toolbox.emsgs(orgnum,246)%>"; 
var alleadvisor='';
var thisurl = "<%=Toolbox1.geturl(request)%>";
function changeper(cs,f)
{
    myprompt("Enter Threshold(%) for " + cs + ":",""+f,"changethresh('"+cs + "',v)");
}
function changethresh(cs,v)
{
    v = v.replace(/[^0-9]/g,'');
    let p = parseFloat(v);
    if (''+ p == 'NaN' || p <= 0 || p>=100)
        myprompt("Enter integer 0<x<100:","" + v,"changethresh('"+cs + "',v)");
    else
    {
        let p = localStorage['threshold'];
        if (p == null || p == '') 
            p = cs + ":" + v;
        else
        {
            let j = p.indexOf(cs + ":");
            if (j>-1)
                p = p.substring(0,j + cs.length()+1) + p.substring(cs.length()+1).replace(/[0-9]+/,''+v);
            else
                p = p + "|" + cs + ":" + v;
        }
        localStorage['threshold'] = p;
        
    }
    parent.frames[0].openalert();
   
}
function fetchemail(mp)
{
    alleadvisor = mp;
}
function studentinfo(sid)
{
    var str = "studentpage.jsp?mode=instructor&sid=" + sid;
    window.open(str, '_blank' );
}
var cidss = [['<%=cidstr.replaceAll("'","").replaceFirst(";$","").replaceFirst(",$","").replaceAll(",","','").replaceAll(";","'],['")%>']];
 
var ii = -1;
function mergeattend()
{ 
    ii++;
    if (ii == cidss.length) return; 
    var cid = cidss[ii][0];
    var ses = cidss[ii][1];
    
    postopen("alerta.jsp", 
     ['cid', 'session','semester','mode','ii'],
     [cid,ses,'<%=semester%>','attend',ii],
     'w' + tstmp ); 
    
}
function removeone(y)
{
    var x = document.getElementById('listd3');
    var j = x.innerHTML.indexOf(y);
    
    var z = x.innerHTML.substring(0,j).replace(/[ ]*<[^>]+>[ ]*$/,"").replace(/, $/,"") + x.innerHTML.substring(j+y.length).replace(/^[ ]*<[^>]+>[ ]*/,"");
    
    x.innerHTML = z;
    
    if (z.indexOf('<') < 0)
    {
        x.innerHTML = '';
    }
    else
        x.innerHTML = z;
}


function alln()
{
    var i=0;
    var al = '';var tbl;
    alle ='';
    while ((tbl=document.getElementById('maintable' + i))!= null)
    {
        for (var j=1; j < tbl.rows.length; j++)
        {
        if (tbl.rows[j].cells[0].getElementsByTagName('input')[0].checked)
        { 
            //sid, courseid, submittimes, timesshould, rate,courseorder,studentname
            al += tbl.rows[j].cells[1].innerHTML + ","+ allc[i] + "," +  tbl.rows[j].cells[3].innerHTML + "," + tbl.rows[j].cells[4].innerHTML+ "," + tbl.rows[j].cells[5].innerHTML+ "," + i + "," + tbl.rows[j].cells[1].innerHTML.replace(",",".") + "\n";
            alle += emailm[tbl.rows[j].cells[1].innerHTML] + ",";
        }
        }
        i++;
        
    }
    document.thisform.ids.value = al;
    
    document.foremail.email.value = alle;
}
function checkall(ck)
{
   var tbl = ck.parentNode.parentNode.parentNode;
   if (tbl.tagName.toLowerCase()!='table') 
       tbl = tbl.parentNode;
   for (var i=1; i < tbl.rows.length; i++)
   {
       tbl.rows[i].cells[0].getElementsByTagName('input')[0].checked = ck.checked;
   }
   alln();
}
 
  
var nav1 = null;
var popstr;
function submitform()
{ 
    formnewaction(document.thisform);
    if (document.thisform.txt.value.length < 2)
    {
        document.thisform.txt.value = "<%=Toolbox.emsgs(orgnum,1529)%>";
    }
    alln();
   // return document.getElementById("ids").value.replace(/[\n| |\t|\r]/g,'') !='';
}
 function syn( result)
 {
 myprompt(result + textmsg[778],null, "if(v)email()");
}
 
function email()
{
    var f1 = document.foremail;
    if (alle!='')
    {
        f1.email.value = alle;
        formnewaction(f1);
        f1.target='w' + tstmp;
        visual(f1);
        f1.submit(); 
        alle = '';
    }
    if (alleadvisor!='')
    {
        f1.email.value = alleadvisor;
        f1.Content.value = msg1566;
        visual(f1);
        f1.submit();
        alleadvisor = '';
    }
}

function gochange(cid,ass,ses,sem)
{
   postopen("alerta.jsp", ['cid', 'assignname','sessions','semester','mode'],[cid,ass,ses,sem,'toauto'],'w' + tstmp );
}
  
</script>
<script type="text/javascript"     src=curve.js></script>
<script>
   if (promptwin == null && parent.frames[0].promptwin!=null)
   {
       let s = parent.frames[0].getpromptmsg();
       myprompt(s,null,null,msg246);
       parent.frames[0].closeprompt();
   }
</script>
 <div id="copyright" style="text-align:center;color:#4d5ddd;font-size:12px"> 
<%= Toolbox.copyright[orgnum>>16]%> 
</div>
<iframe name="w<%=tstmp%>" height="1" width="1" style="visibility:hidden" />
<% } else {
StringBuffer err = new StringBuffer("<table width=99% border=1 align=center style=\"border-collapse:collapse;border-color:#aaaaaa;margin:6px 0px 0px 5px\" >");
 
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
String ida[] = Toolbox.defaultParam(orgnum,request, "ids", "", ",\n%", 5000).split("\n");
boolean toadvisor = Toolbox.defaultParam(orgnum,request,"advisor","0",null,1).equals("1"); 
HashMap<String, String> advisor2student = new HashMap();
HashMap<String, String> advisor2sql = new HashMap();
long pd =  System.currentTimeMillis()/1000; 
String alle = "";
for (int i = 0; i < ida.length; i++)
{
    ida[i] = ida[i].replaceAll("\n","").replaceAll("\r","").replaceAll(" ","");
    if (ida[i].equals("")) continue;
     
    String nc[] = ida[i].split(",");
    String subject =  nc[1] + ":" + Toolbox.emsgs(orgnum,246) ;
 
    String content = txt + "\n" 
 +  Toolbox.emsgs(orgnum,1526).replaceFirst("/.*","") + ":"+ nc[2] + "\n"
 +  Toolbox.emsgs(orgnum,1526).replaceFirst("[^/]+/","") + ":"+ nc[3] + "\n"
 +  Toolbox.emsgs(orgnum,1527) + ":"+ nc[4]; 
    Long pdi = (pd + Integer.parseInt(nc[5])); 
    sql = 
    "INSERT INTO Message(lastupdate,rid, postdate,subject, content,suppress,sid,format,subdb) VALUES(" +pdi +",'" 
    + nc[0]
    +"', " 
    + pdi
    + ", '" 
    + subject.replaceAll("'","''") 
    
    +"', '" + content.replaceAll("'", "''") +      "',0,'" + user.id +"','0','" + user.id +"');";
//sid, courseid, submittimes, timesshould, rate,courseorder,studentname
    String advisorcontent = "<tr><td><a href=studentpage.jsp?mode=instructor&sid=" + nc[0] + " target=_blank>" + nc[0] + "</a></td><td>" + nc[6] + "</td><td>"
+ nc[1] + "</td><td><a href=DataForm?rdap=userinfo&uid=" +user.id + ">" + user.id+ "</a></td><td>" + nc[2] + "</td><td>" + nc[3] + "</td><td>" + nc[4] + "</td></tr>";   
    String advisorsql = 
    "INSERT INTO Message(lastupdate,rid, postdate,subject, content,suppress,sid,format,subdb) VALUES(" +pdi +",'" 
    + "ADVISOR"
    +"', " 
    + pdi
    + ", '" 
    + Toolbox.emsgs(orgnum,1565).replaceAll("'","''")
    +"', 'CONTENT',0,'" + user.id +"','1','ADVISOR');";

    String sql1 = "UPDATE Registration SET evaltime=" + Math.round(System.currentTimeMillis()/1000) + " WHERE sid='"
+ nc[0].replaceAll("'", "''") + "' AND courseid='" + nc[1].replaceAll("'", "''") + "' AND semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester + "'";
 
    
    if (1==adapter.executeUpdate(sql)&& 1==adapter.executeUpdate(sql1))
        err.append("<tr><td>" + nc[0] + "</td><td><img src=image/answerright.gif></td></tr>");
    else 
        err.append("<tr><td>" + nc[0] + "</td><td valign=top>   " + adapter.error() + "</td></tr>");
    if (toadvisor)
    {
         String sql2 = "SELECT advisor,AppUser.email FROM Student,AppUser where Student.advisor=AppUser.id and Student.id='" + nc[0] + "'";
         if ( adapter.executeQuery2(sql2,false) && adapter.getValueAt(0,0)!=null)
         {  
            String advisor = adapter.getValueAt(0,0);
            if (advisor!=null && !advisor.equals(""))
            {
                String advisoremail = adapter.getValueAt(0,1);
                alle += advisoremail + ",";
                String student1 = advisor2student.get(advisor); 
                if (student1==null) 
                {
                    advisor2student.put(advisor, advisorcontent);
                    advisor2sql.put(advisor, advisorsql);
                }
                else 
                { 
                     advisor2student.put(advisor, student1 + advisorcontent);
                }
            }
        } 
    }
}
if (toadvisor)
{
    err.append("<tr><td colspan=2 align=center ><b>" +  Toolbox.emsgs(orgnum,1564)  + "</b></td></tr>");
    for (String advisor : advisor2student.keySet())
    {
       if (advisor.equals(user.id)) continue; 
       String content = "<table border=1 style=border-collapse:collapse;border-color:#aaaaaa><tr style=background-image:linear-gradient("
      + cachedstyle.BBGCOLOR +"," + cachedstyle.TBGCOLOR + ")>"
      + "<td align=left><nobr>" + Toolbox.emsgs(orgnum,163) + "</nobr></td>"
     + "<td align=left><nobr>" + Toolbox.emsgs(orgnum,273) + "</nobr></td>"
     + "<td align=left><nobr>" + Toolbox.emsgs(orgnum,741) + "</nobr></td>"
     + "<td align=left><nobr>" + Toolbox.emsgs(orgnum,18) + "</nobr></td>"
     + "<td align=left><nobr>" + Toolbox.emsgs(orgnum,1526).replaceFirst("/.*","") + "</nobr></td>"
     + "<td align=right><nobr>" + Toolbox.emsgs(orgnum,1526).replaceFirst("[^/]+/","") + "</nobr></td>"
     + "<td align=right><nobr>" + Toolbox.emsgs(orgnum,1527) + "</nobr></td></tr>" + advisor2student.get(advisor)
     + "</table>";
      sql = advisor2sql.get(advisor).replaceAll("ADVISOR", advisor).replaceFirst("CONTENT",content.replaceAll("'","''")); 
      if (1==adapter.executeUpdate(sql))
          err.append("<tr><td>" + advisor + "</td><td><img src=image/answerright.gif></td></tr>");
        else 
          err.append("<tr><td  valign=top>" + advisor + "</td><td  valign=top>   " + adapter.error() + "<br><br>" +sql + "</td></tr>");
    }
}
 err.append("</table>");   
    adapter.close();
    %>
    <script >var alle = "<%=alle%>";parent.fetchemail(alle.replace(/,$/,'')); parent.syn("<%=Generic.handle(err.toString())%>");</script>

<%
}


%>


 
</center>

</body>
</html>

 



