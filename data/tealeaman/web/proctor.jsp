<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*,java.io.*,java.util.concurrent.atomic.*" %>
<%! 
String tmsg(int orgnum, int [] a)
{
    String s = "";
    for (int i=0; i < a.length; i++)
      s += "var msg" + a[i] + "=\"" + Toolbox.emsgs(orgnum,a[i]).replaceAll("\"", "\\\"")  +"\";\n";
    return s;
}
%>

<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
 
User user = null;
if ( (user = User.authorize(orgnum,Systemroles.STUDENT |Systemroles.ASSESSER | Systemroles.INSTRUCTOR | Systemroles.TEACHINGADMIN | Systemroles.REGISTER,application,session,request, response, "proctor.jsp", true)) == null) 
    return;
orgnum=user.orgnum;
System.out.println(Toolbox1.geturl(request));
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>"> 
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
    <%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
    <title><%=Toolbox.emsgs(orgnum,1516) %> </title>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("proctor.jsp","f1") %>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script>
<script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
<script type=text/javascript  src=cookie.js></script>

<%
    
int fontsize = cachedstyle.fontsize;
int fvwidth = 200 + Math.round(fontsize/8*200);
long tstmp = System.currentTimeMillis()%10000000;
String mode = Toolbox.defaultParam(orgnum,request, "mode", "select", null, 10);
String cid = Toolbox.defaultParam(orgnum,request, "cid", null, "-_,", 200);
String title = Toolbox.defaultParam(orgnum,request, "title", null, "-_,&", 400);
String subdb = Toolbox.defaultParam(orgnum,request, "subdb", null, "-_,&", 600);
String assignname = Toolbox.defaultParam(orgnum,request, "assignname", null, "-_,", 300);
String sessionname = Toolbox.defaultParam(orgnum,request, "sessionname", null, "$-#,", 300);
String start  = Toolbox.defaultParam(orgnum,request, "start", null, ",", 200);
String due = Toolbox.defaultParam(orgnum,request, "due", null,",", 200);
 
if (mode!=null && mode.equals("answer"))
{
    user.changedb(null);
    String err = "";
    String sql = "SELECT server, driver, dbuserid,dbpassword,Session.instructor, DBOwner.id from DBOwner, Session where Session.instructor=DBOwner.id";// AND NOT server='' group by server";
    sql += " AND Session.courseid='" + cid + "' ";
    sql += " AND Session.name='" + sessionname + "' ";
    sql += " AND Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester + "'";      
    JDBCAdapter  adapter = Toolbox.getSysAdapter(orgnum);
    adapter.orgnum = orgnum; 
    int N = adapter.executeQuery(sql);
    DBConnectInfo  db = null; 
    if (N != 1)
    {
       adapter.close();
       err = sql + adapter.error();
    }
    else
    {
         db =  new DBConnectInfo(adapter.getValueAt(0, 0), adapter.getValueAt(0, 1), adapter.getValueAt(0, 2), adapter.getValueAt(0, 3),adapter.orgnum); 
         if (!adapter.server.equals(adapter.getValueAt(0, 0)))
         {
             adapter.close();
             adapter = Toolbox.getUserAdapter(db, adapter.orgnum);
         }    
         sql = "select Assignment.answer, Assignment.format,Assignment.question from Assignment where Assignment.course='" + cid + "' AND Assignment.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester + "' AND (Assignment.grader LIKE '%," + user.id
               + ",%' OR Assignment.grader LIKE '%," + user.id
               + "' OR Assignment.grader LIKE '" + user.id
               + ",%' OR Assignment.grader='" + user.id + "') AND  Assignment.name='" + assignname.replaceAll("'","''") + "' AND (Assignment.sessionname LIKE '%,"
               + sessionname + "' OR Assignment.sessionname='" + sessionname + "' OR Assignment.sessionname LIKE '" + sessionname
               + ",%' AND Assignment.sessionname LIKE '%," + sessionname + ",%')";
        N = adapter.executeQuery(sql);
        if (N!=1)
            err = sql + adapter.error();
        adapter.close(); 
    }
%>
</head>  
<body>
    <script>
        <% if (err.equals("")){%>
        parent.integrateAnswer("<%= Generic.handle(adapter.getValueAt(0,0)) %>","<%=adapter.getValueAt(0,1) %>","<%= Generic.handle(adapter.getValueAt(0,2)) %>")
        <%} else {%>
        parent.myprompt("<%= Generic.handle(err)%>");
        <%}%>
    </script>
</body>
</html> 
<%    
return;    
}
else if (mode!=null && mode.equals("absence"))
{%>
<script>
<%
    subdb = Toolbox.defaultParam(orgnum, request, "subdb", null);
    int NN = 0;
    if (subdb != null)
    {
        user.changedb(subdb); 
        JDBCAdapter  adapter = Toolbox.getUserAdapter(user, orgnum); 
        String absence = Toolbox.defaultParam(orgnum, request, "absence", null);
        String [][] p = (new CSVParse(absence, '\'', new String[]{":", ";"})).nextMatrix();
        long ll = System.currentTimeMillis()/1000;

        for (int i=0; i < p.length; i++)
        {
            String sql = "SELECT sid,atime,courseid,sessionname,semester FROM Absence WHERE courseid='" + p[i][0] + " and sessionname='" + p[i][1] + "' AND semester=" + Toolbox.dbadmin[orgnum%65536].currentSemester + " AND sid='" + p[i][3] + "' AND atime > " + (ll - 9*3600);
            int n = adapter.executeQuery(sql);
            if (n >= 1) continue; 
            
            sql = "INSERT INTO Absence(sid,courseid,sessionname,semester,askforleave,atime,excuse,attach,reply,justified) VALUES ('" + p[i][3] + "','" + p[i][0] + "','" + p[i][1] + "'," 
              + Toolbox.dbadmin[orgnum%65536].currentSemester +",0," + ll + ",'','','missing " + p[i][2] + "',0)";
            int n1 = adapter.executeUpdate(sql);  
            if (n1 == 1) out.println("parent.showresults('" +  p[i][0] +"','" + p[i][1] + "','" + p[i][2] + "','" + p[i][3] + "','" + p[i][4] + "');");
            else   out.println("parent.showresults('" +  Generic.handle(adapter.error()) + "');");
        }
        adapter.close(); 
    }
 
%>

</script>
</head>
</html> 
<%    
return;    
}
%>

<script type="text/javascript" src="findrep.js" ></script>
<script type="text/javascript" src=checkHTML.js></script>
 
<%=Toolbox.unifontstyle(cachedstyle.fontsize,orgnum) %>
<style type="text/css"> 
textarea {width:<%=Math.round(fvwidth-4.5*cachedstyle.fontsize)%>px;height:<%=Math.round(6*(6+cachedstyle.fontsize))%>px;font-size:<%=cachedstyle.fontsize%>;border:1px #b0b0b0 solid!important}
input.radio{width:15px;background-color:transparent }
input.text{background-color:<%=cachedstyle.TBGCOLOR%>;border:1px #b0b0b0 solid;border-radius:3px}
</style>
</head>
    <body>
        
<%
String dtitle = Toolbox.emsgs(orgnum,1516);
if (cid!=null) dtitle = cid + "-" + sessionname + " " + title + " " + dtitle;
String key0 = user.id;
if (mode.equals("select")) 
{
    String courseid = Toolbox.defaultParam(orgnum,request, "courseid", "", "_-", 20); 
    String sessionn = Toolbox.defaultParam(orgnum,request, "sessionn", "", "_-", 30);
    long nowtime = System.currentTimeMillis() / 1000 ;
    int n = 1;
    HashMap<String,DBConnectInfo> v = new HashMap(10);
    user.changedb(user.id);  
    v.put(user.id,user.getDBConnectInfo());
    String cusemster = Toolbox.dbadmin[orgnum%65536].currentSemester;
    JDBCAdapter adapter = null;
    boolean hascourse = false;
    if (!courseid.equals("") || !sessionn.equals(""))
    {
        hascourse = true; 
        String sql = "SELECT server, driver, dbuserid,dbpassword,DBOwner.id   from DBOwner, Session where Session.instructor=DBOwner.id";// AND NOT server='' group by server";
        if (!courseid.equals(""))
            sql += " AND Session.courseid LIKE '%" + courseid + "%' ";
        if (!sessionn.equals(""))
            sql += " AND Session.name LIKE '%" + sessionn + "%' ";
        sql += " AND NOT DBOwner.id='" + user.id + "'";
        user.changedb(null);
        adapter = Toolbox.getSysAdapter(orgnum);adapter.orgnum = orgnum; 
        
        n = adapter.executeQuery(sql);
        if (!adapter.error().equals("")) 
        {
            adapter.close();
            Toolbox.println(0, adapter.error());
            return;
        }

        if (n>0)
        for (int i = 0; i < n; i++) 
        {
            DBConnectInfo db = new DBConnectInfo(adapter.getValueAt(i, 0), adapter.getValueAt(i, 1), adapter.getValueAt(i, 2), adapter.getValueAt(i, 3),adapter.orgnum);
            v.put(adapter.getValueAt(i,4), db);
        }
        if (n>0) n++; 
        else n= 1; 
        adapter.close(); 
    }

    long tt = System.currentTimeMillis() / 1000L;
    String sql = "select Assignment.course,Course.title, Assignment.sessionname,Assignment.name, Assignment.start,  Assignment.due, DomainValue.domainValue from Assignment, Course, DomainValue  where DomainValue.language='" + Toolbox.langs[orgnum >> 16] + "' AND Assignment.atype=DomainValue.code and DomainValue.domain='Assignment Type' and  Assignment.course=Course.id AND Assignment.semester='" 
    + Toolbox.dbadmin[orgnum%65536].currentSemester 
    + "' AND (Assignment.grader='" 
    + user.id + "' OR Assignment.grader LIKE '%" 
    + user.id
            + "%' OR Assignment.grader LIKE '%" 
            + user.id
            + "' OR Assignment.grader LIKE '" + user.id
            + "%') AND (Assignment.atype=1 OR Assignment.atype=3 ) " + (hascourse?"": ("  AND Assignment.start >= " + ( tt - 10800)  + " AND Assignment.due > " + (tt) )) 
            + "  order by Assignment.course,Assignment.sessionname,Assignment.name";
    
    String old = null;
    int sindex = Toolbox.begintranslate("mysql");
    String tr = "";
    int N = 0;
    Set<String> keys = v.keySet();
    for (String key:keys)   
    {
         
        DBConnectInfo db = v.get(key);
        adapter = Toolbox.getUserAdapter(db,orgnum);
        if (!adapter.error().equals(""))
        {
           // tr +="<tr><td colspan=7>" + adapter.error() + "</td></tr>";
           // N++;
            adapter.close();
            continue;
        }

        int tindex = Toolbox.begintranslate(adapter.dbms);
        int i = adapter.executeQuery(Webform.mysql2c(adapter.dbms, sql));
         if (i <= 0 )
        {

            adapter.close();
            continue;
        }


        subdb = db.toCSV(orgnum);
        long ll = System.currentTimeMillis()/1000;
        for (i--; i >= 0; i--) 
        {
            String[] ss = adapter.getValueAt(i, 2).split(",");
            for (int k=0; k < ss.length; k++)
            {
                long l0 = Long.parseLong(adapter.getValueAt(i, 4)), l1 =  Long.parseLong(adapter.getValueAt(i, 5));
                String c = ""; if (l0 < ll && ll < l1 ) c = "&check;";
                tr += "<tr><td><!--" + key + " " +  subdb + "--><input type=checkbox name=ck"  + '_' + k + " ></td><td>" + adapter.getValueAt(i, 0) + "</td><td>" + adapter.getValueAt(i, 1) + "</td><td>" + ss[k] + "</td><td>" + adapter.getValueAt(i, 3) + "</td><td>" +  adapter.getValueAt(i, 6) + "</td>"
                        + "<td><!--" + adapter.getValueAt(i, 4) + "-->" + Toolbox.timestr(Long.parseLong(adapter.getValueAt(i, 4))) + "</td><td><!--" + adapter.getValueAt(i, 5) + "-->" + Toolbox.timestr(Long.parseLong(adapter.getValueAt(i, 5))) + "</td><td align=center>" + c +"</td></tr>";
                N++;
            }
        }
        adapter.close();
        key0 = key + " " + subdb;
    }
 
if (N == 0 || N>1) 
{
    out.println(Toolbox.title(Toolbox.emsgs(orgnum,1516)));
%>
    
<!--%=Toolbox.emsgs(orgnum,1515)%-->
    <center>
<form rel=opener name="form1" method="POST" action="proctor.jsp"  >
<table width="300" class="outset1" id="maintb0" align="center" style="margin:5px 0px 5px 0px">
<tr><td><nobr><%=Toolbox.emsgs(orgnum,982)%></nobr></td><td>  <input name="courseid" class="left" value="<%=courseid%>"></td></tr>
<tr><td><nobr><%=Toolbox.emsgs(orgnum,233)%></nobr></td><td> <input name="sessionn" class="left"  value="<%=sessionn%>"></td></tr>
<tr><td colspan="2" align="center"><input type="submit" class="GreenButton" name="btn" style="width:79px" value="<%=Toolbox.emsgs(orgnum,37)%>"></td></tr>
</table>
</form></center>
 
<% 

String ses = Toolbox.dbadmin[user.orgnum%65536].semesteropts("", orgnum);
ses = ses.replaceAll("<option style=[^ ]+ value=([0-9]+)>([^<]+)<.option>", "'$1':'$2',");
 
if (N >=  1) 
{
   //out.println(Toolbox.title(Toolbox.emsgs(orgnum, 1516)));
   
  // out.println(Toolbox.timestr(tt-9000) + " " + Toolbox.timestr(tt-600));
%>
<center>
<table class="outset1" id="maintbl" align="center" style="margin:5px 0px 5px 0px" cellpadding="4">
    <tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>">
        <td></td>
        <td><%=Toolbox.emsgs(orgnum,851)%></td><td><%=Toolbox.emsgs(orgnum,850)%></td>
        <td><%=Toolbox.emsgs(orgnum,233)%></td>
        <td><%=Toolbox.emsgs(orgnum,671)%></td> 
        <td><%=Toolbox.emsgs(orgnum,291)%></td>
        <td><nobr><%=Toolbox.emsgs(orgnum,908)%></nobr></td>
        <td><nobr><%=Toolbox.emsgs(orgnum,289)%></nobr></td>
        <td><nobr><script>document.write(textmsg[594]);</script></nobr></td>
    </tr>
<%=tr%>
</table> 

 
<form rel=opener name=f method="post" action="proctor.jsp" target="w<%= tstmp%>" >
    <input type="hidden"  name="cid" >
    <input type="hidden"  name="title" >
    <input type="hidden"  name="sessionname" >
    <input type="hidden"  name="assignname" >
    <input type="hidden"  name="start" >
    <input type="hidden"  name="due" >
    <input type="hidden"  name="subdb" >
    <input type="hidden"  name="mode" value="start">
    <input class="GreenButton"  style="width:79px" type=button name=nextbtn value="" onclick="next()" >
</form>
</center>
<%}%>
<script>
let ii=0;
<%="var semesermap = {" + ses.replaceFirst(",$","};")%>
let msg286 = "<%=Toolbox.emsgs(orgnum,286)%>";
let msg54 = "<%=Toolbox.emsgs(orgnum,1618)%>";
for (let s in localStorage)    
{
    if (s.indexOf('proctor-' + (orgnum%65536))==0)
    {
        if (ii == 0)
        {
            
            document.writeln('<center>'+ textmsg[843] 
                    + '<br><table cellspacing=1 cellpadding=4   id="maintb2" align="center" border=1 style="margin:5px 0px 5px 0px;border-collapse:collapse"><tr style=background-color:'
                    + BBGCOLOR + '><td>'
                    + textmsg[661]  
                    + '</td><td>'
                    + textmsg[152]  
                    + '</td><td>'
                    + textmsg[25]  
                    + '</td><td>'
                    + msg286  
                    + '</td><td>'
                    + msg54  
                    + '</td><td>'
                    + textmsg[69]  + '</td></tr>'       
            );
        }
        ii++;
         
        let x = JSON.parse(localStorage[s]);
         
        let starts = x.start.replace(/.*([0-9]{3}[0-9]+).*/,'$1');
        
        let duet = x.due;
        let subdb = x.subdb;
        let xs = s.substring(8).split(/\|/);
       
        document.writeln("<tr><td>" + semesermap[xs[1]] + "</td><td>" + xs[2] + "</td><td>" + xs[4] + "</td><td>" + xs[3] + "</td>" 
                + "<td align=center style=color:blue onclick=\"openthis('"
                + s.substring(8) + "','" + starts+ "','" + duet+ "','" + subdb + "')\")> >> </td><td  align=center style=color:blue onclick=deletethis('"+ s + "')> >> </td></tr>" );
    }
}
if (ii>0) document.write("</table></center>");  
function openthis(s,start,due,subdb)
{
    
    let xs = s.split(/\|/);
    document.f.cid.value = xs[2]; 
    document.f.title.value = ''; 
    document.f.sessionname.value = xs[4]; 
    document.f.assignname.value = xs[3];
    document.f.start.value = start; 
    document.f.due.value = due; 
    document.f.subdb.value = subdb;
    document.f.action = 'proctor.jsp?mode=start';
    document.f.target = '_self';
    document.f.submit();
}
function deletethis(s)
{
    delete localStorage[s];
}
  
var tstmp = "<%=tstmp%>";
var tbl = document.getElementById('maintbl');
if (tbl!=null)
{
    tbl.rows[0].cells[4].innerHTML = textmsg[317];
   // tbl.rows[0].cells[7].innerHTML = textmsg[142];
    document.f.nextbtn.value= textmsg[720];
}
else 
    document.f.nextbtn.style.visibility = false;  
   
function next()
{
    var gotone = false;
    var tbl = document.getElementById('maintbl');
    document.f.cid.value =''; 
    document.f.title.value =''; 
    document.f.sessionname.value =''; 
    document.f.assignname.value = ''; 
    document.f.start.value = ''; 
    document.f.due.value =''; 
    document.f.subdb.value = '';
    document.f.target = '_self';
    for (var i=1; i < tbl.rows.length; i++)
    {
        if (tbl.rows[i].cells[0].getElementsByTagName('input')[0].checked)
        {
            gotone = true;
            document.f.cid.value +=tbl.rows[i].cells[1].innerHTML + ','; 
            document.f.title.value +=tbl.rows[i].cells[2].innerHTML + ','; 
            document.f.sessionname.value +=tbl.rows[i].cells[3].innerHTML + ','; 
            document.f.assignname.value +=tbl.rows[i].cells[4].innerHTML + ','; 
            document.f.start.value +=tbl.rows[i].cells[6].innerHTML.replace(/<!\-\-/,'').replace(/\-\->.*/,'') + ','; 
            document.f.due.value +=tbl.rows[i].cells[7].innerHTML.replace(/<!\-\-/,'').replace(/\-\->.*/,'') + ','; 
            document.f.subdb.value +=tbl.rows[i].cells[0].innerHTML.replace(/<!\-\-/,'').replace(/\-\->.*/,'') + ','; 

        }
    }
    if (gotone==false) 
        myprompt('<%= Toolbox.emsgs(orgnum,288)%>');
    else 
    {   visual(document.f);
       document.f.submit(); 
   }
}
 
buildactmenu = function()
{
    recurainput(document.body);
}
 
</script>
</body></html>
<%
     return;
 }
else if (N == 1) 
{
    subdb  = key0 ;
    mode = "start";
    if (adapter!=null)
    {
 
    cid = adapter.getValueAt(0, 0);
    title = adapter.getValueAt(0, 1);;
    assignname = adapter.getValueAt(0, 3);
    sessionname = adapter.getValueAt(0, 2);
    start = adapter.getValueAt(0, 4);
    due = adapter.getValueAt(0, 5); 
 
    }
} 
 else
{
    if (adapter!=null)
    out.println(adapter.error() + "</body></html>");
    return;
}

}

if (cid == null) return; 
 
String sql = "";
String [] cids = cid.replaceFirst(",$","").split(",");
String titles[] = title.replaceFirst(",$","").split(",");
String subdbs[] = subdb.replaceFirst(",$","").split(",");
String assignnames[] = assignname.replaceFirst(",$","").split(",");
String sessionnames[] = sessionname.replaceFirst(",$","").split(",");
String starts[] = start.replaceFirst(",$","").split(",");
String dues[] = due.replaceFirst(",$","").split(",");
JDBCAdapter adapter = null;
String sc[] = new String[dues.length];
sc[0] = start;
String proctorrole[] = new String[cids.length];
int NS[] =  new int[dues.length];
long duen[] = new long[dues.length]; 

String butstyle = "border-radius: 4px;color:white;font-weight:700;width:" + Math.ceil(4.8*cachedstyle.fontsize) + "px;font-size:" + cachedstyle.fontsize+ "px"; 
String [] subdbids = new String[cids.length];
String [] studentname = new String[cids.length];
String [] studentemail = new String[cids.length];
String [] studentid = new String[cids.length];
String [] studentphone = new String[cids.length];
 
for (int i=0; i < cids.length; i++)
{
    out.println(Toolbox.title(cids[i] + "-" + sessionnames[i] + " " + titles[i] + ":" + assignname.replace(",","")));
   // if (i == 0)
{%><table align=center id="butcols<%=i%>"><tr><td>
<input class=OrangeButton style="<%=butstyle%>" type=button id=submit4<%=i%> value="<%= Toolbox.emsgs(orgnum,121)  %>" onclick=seeanswers(<%=i%>)>
        </td><td>            
<input class=OrangeButton style="<%=butstyle%>" type=button id=submit1<%=i%> value="<%= Toolbox.emsgs(orgnum,924)  %>" onclick=setting(<%=i%>)>
        </td>
<% boolean b =true; System.out.println(Long.parseLong(dues[i]) + " " + (System.currentTimeMillis()/1000)); try{ b=(Long.parseLong(dues[i]) > System.currentTimeMillis()/1000);}catch(Exception e){}; if(b) {%>       
<td>
<input class=OrangeButton style="<%=butstyle%>" type=button id=submit5<%=i%> value="<%= Toolbox.emsgs(orgnum,3)  %>" onclick=notify(<%=i%>)>
        </td><td>
<input class=GreenButton style="<%=butstyle%>" id="statusbtn" type=button id=submit2<%=i%> value="MessageQ" onclick=getstatus(<%=i%>) >
        </td>
<%}%>
<td>
<input class=GreenButton style="<%=butstyle%>" type=button id=submit6<%=i%> value="<%= Toolbox.emsgs(orgnum,260)  %>" onclick=report(<%=i%>)>
</td>
<%if (b){%>
<td>
<input class=RedButton style="<%=butstyle%>" type=button id=submit3<%=i%> value="<%= Toolbox.emsgs(orgnum,82)  %>" onclick=closeproc(<%=i%>)>
        </td><td style="padding:0px 0px 0px 0px"><input class=BlueButton style="<%=butstyle%>" type=text id="timer<%= i%>" >
 </td>
<%}%>    
    </tr></table>
<%}
   subdbids[i] = subdbs[i].replaceFirst(" .*",""); 
   subdbs[i] = subdbs[i].replaceFirst("[^ ]+[ ]","");
   
    sql = "SELECT instructor, ta FROM Session where name='" + sessionnames[i] +"' AND courseid='" + cids[i] + "' AND semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester + "'";
    if (adapter ==null)
        adapter = Toolbox.getUserAdapter(new DBConnectInfo(subdbs[i],orgnum), orgnum); 
    else if (!subdbs[i].equals(subdbs[i-1]))
    {
        adapter.close();
        adapter = Toolbox.getUserAdapter(new DBConnectInfo(subdbs[i], orgnum), orgnum);
    }
    int N =  adapter.executeQuery(sql);
    proctorrole[i] = "";
 
    if (N==1)
    {
         String ii = adapter.getValueAt(0,0), ta=adapter.getValueAt(0,1);
         if (ii!=null && ii.equals(user.id)) proctorrole[i] = "instructor";
         else if (ta!=null && ta.equals(user.id)) proctorrole[i] = "ta";
    }
 
    sql = "SELECT Registration.sid, AppUser.firstname, AppUser.lastname, Registration.faceinfo,AppUser.email,AppUser.phone FROM Registration, AppUser WHERE Registration.sid=AppUser.id AND "
    + " courseid='" + cids[i] + "' AND semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester + "' AND sessionname='" + sessionnames[i] + "'";
    N = adapter.executeQuery(sql); 
    NS[i] = N;
    studentname[i] = "";
    studentemail[i] = "";
    studentid[i] = "";
    studentphone[i] = "";
 
    for (int m=0; m < N; m++)
    { 
    String vv = adapter.getValueAt(m,1); if (vv==null) vv = "";
    String v1 = adapter.getValueAt(m,2); if (v1 ==null) v1 = "";
    vv = Toolbox.makeFullName(v1, "", vv);
    vv = vv.replaceAll("([a-z])([A-Z])","$1 $2"); 
    studentname[i] += "," + vv;
    String em = adapter.getValueAt(m,4);
    studentid[i] += "," + adapter.getValueAt(m,0);
    if (em == null || em.equals("") ) em = " ";
    studentemail[i] += "," + em;
    String ph = adapter.getValueAt(m,5);
    if (ph == null ||ph.equals("")) ph = " ";
    studentphone[i] += "," + ph;
    String purl = adapter.getValueAt(m,3); 
    if (purl==null || purl.equals("")) 
        purl = "image/nophoto.jpg";
    else
        purl = "FileOperation?did=" + adapter.getValueAt(m,3);
     
    out.println("<table cellspacing=0 cellpadding=0 id=s" + i + "_" + m + " style=\"background-color:" + cachedstyle.BBGCOLOR +  ";color:blue;display:inline-block;float:left;box-shadow:#a0a0a0 2px 3px;border-radius:3px;border:1px #707070 solid;margin:3px 3px 3px 3px\">"
     + "<tr><td valign=top align=center  style=\"width:90px;padding:2px 0px 0px 0px;background-color:" + cachedstyle.BBGCOLOR +  "\"><img style=\"width:90px;margin:0px 0px 0px 0px;border:0px\" title=\"" + adapter.getValueAt(m,0) + "\n"+  ph + "\n" + em + "\" src=\"" + purl
     + "\"  onclick=\"seeanswers(" + i + "," + m + ")\"></td></tr>"
     +"<tr><td width=90 style=overflow:hidden;font-size:12px onclick=chat(" + i + "," + m + ")><div style=\"width:90px;overflow:hidden;margin:0px 0px 0px 0px;white-space:nowrap\">" + vv + "</div></td></tr>"
     + "<tr><td style=\"background-color:" + cachedstyle.BBGCOLOR +  "\"><textarea style=\"width:90px;height:100px;font-size:12px;margin:0px 0px 0px 0px\" onkeypress=\"return mkstrike(this,event,'e')\" ></textarea></td></tr>"
    + "</table>");
    }
    if (studentname[i].length()==0) 
    {
       %> NO student <%
       break;
    }
    sc[i] =  cids[i] + '-' + sessionnames[i] + " " + titles[i]  ;
 
    studentname[i] = studentname[i].substring(1);
    studentemail[i] = studentemail[i].substring(1);
    studentid[i] = studentid[i].substring(1);
    studentphone[i] = studentphone[i].substring(1);
}
adapter.close();
int sek = SessionCount.enq(session.getId());
cid = cid.replace(",","");
assignname = assignname.replace(",","");
sessionname = sessionname.replace(",","");
%>
</form>
<script>
var reportw = "<%= Toolbox.emsgs(orgnum,260)  %>";
<%for (int i=0; i < cids.length; i++) {%> document.getElementById('submit4<%=i%>').value = textmsg[139]; <%}%>
<%for (int i=0; i < cids.length; i++) {%> 
  //  document.getElementById('submit2<%=i%>').value = textmsg[1736]; 
<%}%>
var needtranslator = true;
var font_size = <%=cachedstyle.fontsize%>; 
var semester = "<%=Toolbox.dbadmin[orgnum%65536].currentSemester%>";
var theurl = "<%=Toolbox1.geturl(request)%>";
var studentname = [<%for (int i=0; i < cids.length; i++) {if(i>0) out.print(",");out.print("\"" +studentname[i].replace("\"","") + "\".split(/,/)"); }%>];
var studentid = [<%for (int i=0; i < cids.length; i++) {if(i>0) out.print(",");out.print("'" +studentid[i].replace("'","") + "'.split(/,/)"); }%>];
var studentemail = [<%for (int i=0; i < cids.length; i++) {if(i>0) out.print(",");out.print("'" +studentemail[i].replace("'","") + "'.split(/,/)"); }%>];
var studentphone = [<%for (int i=0; i < cids.length; i++) {if(i>0) out.print(",");out.print("'" +studentphone[i].replace("'","") + "'.split(/,/)"); }%>];

var subdbs = [<%for (int i=0; i < cids.length; i++) {if(i>0) out.print(",");out.print("'" +subdbids[i].replace("'","") + "'"); }%>];
var instrutorid = [<%for (int i=0; i < cids.length; i++) {if(i>0) out.print(",");out.print("'" +cids[i].replace("'","") + "'"); }%>];
var cids = [<%for (int i=0; i < cids.length; i++) {if(i>0) out.print(",");out.print("'" +cids[i].replace("'","") + "'"); }%>];
var assignnames = [<%for (int i=0; i < cids.length; i++) {if(i>0) out.print(",");out.print("'" +assignnames[i].replace("'","") + "'"); }%>];
var sessionnames = [<%for (int i=0; i < cids.length; i++) {if(i>0) out.print(",");out.print("'"  + sessionnames[i].replace("'","") + "'"); }%>];
var TL = [<%for (int i=0; i < cids.length; i++) {if(i>0) out.print(",");out.print("'" +cids[i] + "-" + sessionnames[i].replace("'","") + "'"); }%>];
var NS = [<%for (int i=0; i < cids.length; i++) {if(i>0) out.print(",");out.print(NS[i]); }%>];
var proctorrole = [<%for (int i=0; i < cids.length; i++) {if(i>0) out.print(",");out.print("'" + proctorrole[i].replace("'","") + "'"); }%>];
var dues = [<%for (int i=0; i < cids.length; i++) {if(i>0) out.print(",");out.print(dues[i]); }%>];
var SC = [<% for (int i=0; i < cids.length; i++){  if(i>0) out.print(","); out.print("'" + sc[i].replace("'"," ") + "'");}%>];
var grey = '<%=cachedstyle.DBGCOLOR%>';
var white = '<%=cachedstyle.TBGCOLOR%>';
var uid = "<%=user.id%>";
var myname = "<%=user.id%>";
var mysek = "<%=sek%>";
var tstmp = <%=tstmp%>;
var starts = "<%=start%>";
var duet =  '<%=due%>';
var subdb = "<%=subdbids[0]%>";
var keystr = [<% for (int i=0; i < cids.length; i++) 
{
  if (i > 0)out.print(","); 
  String keystr =  (orgnum%65536) + "|" + Toolbox.dbadmin[orgnum%65536].currentSemester + "|" + cids[i] + "|" + assignnames[i] + "|" + sessionnames[i]; 
  out.print("'" + keystr + "'");
  if ( i == cids.length-1)out.println("];");
}
%>
document.getElementById("statusbtn").value = textmsg[1736];
</script>
<script  type="text/javascript"  src="assessform.js"></script>
<script  type="text/javascript"  src="proctor.js" ></script>
<script type="text/javascript"  src="curve.js?sn=20&dn=20"></script>
<iframe name="w<%=tstmp%>" width="1" height="1" scrolling="no" style="visibility:hidden" /> 
</body> 
</html>



