<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
%>
<%!
class Schfyn extends TimerTask
    {
        int orgnum;
        String uid;
        public Schfyn(int orgnum, String uid)
        {
            super();
            this.orgnum = orgnum;
        }
        public void run()
        {
            (new Synf(uid,null,null,orgnum)).run(); 
        }
    } 
class Synf implements Runnable
{
    String b,f,uid;
    int orgnum;
    Synf(String uid, String f, String b,int orgnum)
    {
        this.f = f; 
        this.b = b; 
        this.uid = uid;   
        this.orgnum = orgnum;
    }
    synchronized public void run()
    {
        if (f==null && b==null)
        {
            int j = FileSyn.synfolders(orgnum);
            Toolbox.msgqueueput((orgnum%65536) + uid, "Number of files copied:" + j);
        }
        else if (f!=null && b!= null)
        {
            int j = FileSyn.syn(f, b,"",3000, false);
            Toolbox.msgqueueput((orgnum%65536) + uid, f + " -> " + b + ": " + j);
        }
    }
}

Vector<Timer> timers = new Vector();

%>

<%
 
User user = null;
if (  (user = User.authorize(orgnum, Systemroles.SYSTEMADMIN,application,session,request, response, "synfolder.jsp", true)) == null|| !Toolbox.verifytoken(request)) 
    return;
orgnum=user.orgnum;
String which = Toolbox.defaultParam(orgnum,request, ("which"), null);
which = Toolbox.validate(which, null, 20);

%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%><title><%=Toolbox.emsgs(orgnum,448)%></title>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("synfolder.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>
</head>
<body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:6px 6px 0 6px">

<%
String str = "";
int ts = 2500;
if (which==null)
{
   String times = Toolbox.defaultParam(orgnum,request, "time", null, ":", 30);
   String days = Toolbox.defaultParam(orgnum,request, "days", null, ",", 30);

   str = FileSyn.schedulerun(times, days);
   ts = 100000;
   out.println(Toolbox.title(Toolbox.emsgs(orgnum,448)) + str);
  %>
  <script type="text/javascript" >setTimeout("realClose()",<%=ts%>);</script>
  <%
}
else if (which!=null && which.equals("backup"))
{
   String folder = Toolbox.defaultParam(orgnum,request, "FolderPath", null, "/\\:@#$-_", 200);
   String backup = Toolbox.defaultParam(orgnum,request, "BackupPath", null, "/\\:@#$-_", 200);
   Thread synf = new Thread(new Synf(user.id,folder,backup,orgnum));
   synf.setPriority(1);
   synf.start();
   str = Toolbox.emsgs(orgnum,1233);
   out.println(Toolbox.title(Toolbox.emsgs(orgnum,448)) + str);
    %>
  <script type="text/javascript" >setTimeout("realClose()",<%=ts%>);</script>
  <%
 /*
{
Schfyn timerrun  = new Schfyn(orgnum, user.id);
Timer   timer =  new Timer();
timer.scheduleAtFixedRate(timerrun, Remind.getTomorrowMorning(time1), 3600000*24);
for (int i= timers.size(); i <= orgnum; i++)
   timers.addElement(null);
timers.setElementAt(timer, orgnum);
}*/
}
else if (which!=null && which.indexOf("remind")>=0)
{
    JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
    
   String sql = "SELECT chaptpubkey FROM SystemParam";
   int n = adapter.executeQuery(sql);
   String time = ""; 
   if (n>=1) time = adapter.getValueAt(0,0); 
   

   String time1 = Toolbox.defaultParam(orgnum,request, ("time1"), "").trim();
   
   time1 = Toolbox.validate(time1, ":/",  20);
   out.println(Toolbox.title(Toolbox.emsgs(orgnum,1352)));
   out.println("<br>" + Toolbox.emsgs(orgnum,1353));
   
   String x = (time1.equals(""))?time:time1;
   
   if (which.equals("remindbk"))
   {
         
        if ( !time1.equals(""))
        {
             Toolbox.dbadmin[orgnum%65536].remind.set(time1);
             sql = "UPDATE SystemParam SET chaptpubkey='" + time1 + "'"; 
        }
        else
        {
             Toolbox.dbadmin[orgnum%65536].remind.cancel();
             sql = "UPDATE SystemParam SET chaptpubkey=''";
             x = "";
        }
        adapter.executeUpdate(sql);
            
   }
   adapter.close();
   %>
   <form rel=opener name="f4" method="post" action="synfolder.jsp"  >
      <input type="hidden" name="which" value="remindbk">
      <input name="time1" value="<%=x%>" onfocus="if(this.value=='')this.value='02:30';" style="border:1px #b0b0b0 solid"><br>
      <center>
      <input type="button" name="b1" class="GreenButton" style="width:70px" value="Set" onclick="set()">
     <% if ( Toolbox.dbadmin[orgnum%65536].remind.haveset  ) {%> 
      <input type="button" name="b2" class="RedButton" style="width:70px" value="<%=Toolbox.emsgs(orgnum,169)%>" onclick="cancelset()">
      <%}%>
      </center>
   </form>
   <script type="text/javascript" >
      document.f4.b1.value=textmsg[829];
      function set()
      {
          if (document.f4.time1.value == '')
          {
              myprompt("Enter time as hh:mm");
              return;
          }
          if (document.f4.time1.value.replace(/[ ]*[0-9]+:[0-9]+[ ]*/,'')!='')
          {
              myprompt("Enter time as hh:mm");
              return;
          }
          document.f4.time1.disabled=false; 
          formnewaction(document.f4);
          visual(document.f4);
document.f4.submit();
      }
      function cancelset()
      {
          document.f4.time1.disabled=true;
          formnewaction(document.f4);
          visual(document.f4);
document.f4.submit();
      }
 </script>
   <%
    if (which.equals("remindbk"))
    {
       
     }
     
}
%>
 
</body>
</html>
