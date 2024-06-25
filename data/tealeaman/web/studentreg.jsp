<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*" %>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
 
if (  (user = User.authorize(orgnum, Systemroles.STUDENT| Systemroles.INSTRUCTOR | Systemroles.ASSESSER | Systemroles.TEACHINGADMIN,application,session,request, response, "studentreg.jsp", true)) == null|| !Toolbox.verifytoken(request))
    return;
orgnum=user.orgnum;
 
String sid = Toolbox.defaultParam(orgnum,request, "sid","",null, 50);
 
String coursesession = Toolbox.defaultParam(orgnum,request, "coursesession",null );
String coursesession0 = Toolbox.defaultParam(orgnum,request, "coursesession0",null );

 
if (coursesession==null||coursesession0==null) return;
String er = coursesession + "\n\n" +  coursesession0;
 
user.changedb("");
String [] old = null;
if (coursesession0!=null && !coursesession0.equals(""))
    old  = coursesession0.split(",");

String [] newc = null;
if (coursesession!=null && !coursesession.equals(""))
   newc = coursesession.split(",");

if (old!=null && newc!=null)
for (int i=0; i < old.length; i++)
for (int j=0; j < newc.length; j++)
{
    if (old[i]==null&&newc[j]==null)continue;
    if( newc[j]!=null && old[i]!=null && newc[j].equals(old[i]) )
    {
        old[i]=null;
        newc[j]=null;
    }
}
String semester = Toolbox.dbadmin[orgnum%65536].currentSemester;
if (semester==null || semester.equals("") || semester.equals("null")) 
    semester = "29"; 
JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum); 
adapter.orgnum = orgnum;

int i, nt = 0;
String buf = "";
int k1 = 0;
 
if(old!=null)
for (i=0; i < old.length; i++)
{
    if (old[i]==null) continue;

    String arr[] = old[i].split("\\|");
    String sql = "DELETE FROM Registration WHERE sid='" + sid +"' AND semester='"
            + semester +"' AND courseid='" + arr[0] +"'";
     
    er += sql + "\n\n";
    
    er += sql;
    nt = adapter.executeUpdate(sql);
     
    er += "ERROR:" + adapter.error() +"$$";
    if (nt==1)
    {
      Toolbox.msgqueueput((orgnum%65536) + arr[2], sid + " " + Toolbox.emsgs(orgnum,1252) +" " + arr[0] + "-" + arr[1]);
      buf += Toolbox.emsgs(orgnum,1253) + " <a href=\"DataFormHTML?rdap=userinfo&uid="
                   + arr[0] +"\">"
                   + arr[0] + "-" + arr[1] +" " + Toolbox.emsgs(orgnum,18) +"</a><br>";
      user.changedb(arr[2]);
      //sql = "UPDATE Registration SET rstatus=2,whosehand=1 WHERE sid='" + sid +"' AND semester='"
      //      + semester +"' AND courseid='" + arr[0] +"' AND sessionname='" + arr[1] +"'";
      JDBCAdapter adapter1 = new  JDBCAdapter(user.getDBConnectInfo(), orgnum);
      if (!adapter1.error().equals(""))
{
    adapter1.close();
    out.println(adapter1.server + Toolbox.emsgs(orgnum,1550));
    return;
}
      er +=  sql;
      adapter1.executeUpdate(sql);
       er += "ERROR:" + adapter1.error() +"$$";
      adapter1.close();
      k1++;
    }
    
}
String pid = "";
int k=0;
if (newc!=null)
for (i=0; i < newc.length; i++)
{
    if (newc[i]==null) continue;
    String arr[] = newc[i].split("\\|");
   
    String sql = "INSERT INTO Registration(lastupdate, sid,courseid,sessionname,semester, status, rstatus, whosehand, grade,evaluation,attendance,target,faceinfo) VALUES(" + (System.currentTimeMillis()/1000) + ",'"
    + sid + "','" + arr[0] +"','" + arr[1] +"','" + semester
    + "',1,1,3,'',NULL,0,'" + arr[0] + "','')";
    nt = adapter.executeUpdate(sql);
    er += sql;

    er += "ERROR:" + adapter.error() +"$$";
    if (nt==1)
    {
      Toolbox.msgqueueput((orgnum%65536) + arr[2], sid + " " + Toolbox.emsgs(orgnum,1251) +" " + arr[0] + "-" + arr[1]);
      buf += Toolbox.emsgs(orgnum,1253) + " <a href=\"DataFormHTML?rdap=userinfo&uid="
                   + arr[2] +"\">"
                   + arr[0] + "-" + arr[1] +" " + Toolbox.emsgs(orgnum,18) +"</a><br>";
      pid = arr[2];
      String fields = "lastupdate,  id,   roles,  firstname,  middlename,  lastname,  title,  department,   photourl, email,  phone, fontsize";
      String sql2= "SELECT  " + fields +"  FROM AppUser where id='" + user.id +"'";
      adapter.needMetaInfo = true;
      nt = 0;
      boolean bb = adapter.executeQuery2(sql2,false);
      er += sql2;
      er += "ERROR:" + adapter.error() +"$$";
      if (bb && adapter.getValueAt(0,0)!=null )
      {
         String sql1 = "INSERT INTO AppUser(" + fields +") VALUES(";
         for (int j= 0; j < adapter.getColumnCount(); j++)
         {
             String sq = "'";
             if (adapter.colIsNum[j])
                 sq = "";
             sql1 +=  sq +  adapter.getValueAt(0,j) + sq;
             if (j < adapter.getColumnCount() - 1)
                 sql1 += ",";
             else 
                sql1 += ")"; 
         }
         user.changedb(pid);
         JDBCAdapter adapter1 = new  JDBCAdapter(user.getDBConnectInfo(), orgnum);
         if (!adapter1.error().equals(""))
{
    adapter1.close();
    out.println(adapter1.server + Toolbox.emsgs(orgnum,1550));
    return;
}
         er += sql1;
         adapter1.executeUpdate(sql1);
         er += "ERROR:" + adapter1.error() +"$$";
         er += sql;
         adapter1.executeUpdate(sql);
         er += "ERROR:" + adapter1.error() +"$$";
         adapter1.close();
         k++;
      }

    }

}
if (k>0)Toolbox.msgqueueput((orgnum%65536) + pid, Toolbox.emsgs(orgnum,579)); 
if (k1>0)Toolbox.msgqueueput((orgnum%65536) + pid, "\n" + Toolbox.emsgs(orgnum,580));
adapter.close();
Toolbox1.SetCookie(response, user.id + "acinfo", "");
%>

<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><%=Toolbox.getMeta(orgnum)%></head>
<body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 5px 5px">
<!--<%= er + semester %> -->    
<script type="text/javascript" >
parent.frames[0].document.location.href = "studentindex.jsp?id=<%=sid%>";
</script>
<%if (k>0) {%> <%=Toolbox.emsgs(orgnum,1253)%> <%}%>
</body>
</html>