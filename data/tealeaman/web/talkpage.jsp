<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*,java.io.*,java.util.concurrent.atomic.*" %>
<%! 
String tmsg(int orgnum,int [] a)
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
if ( (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request, response, "talkpage.jsp", true)) == null) 
    return;
orgnum=user.orgnum;
CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
int fontsize = cachedstyle.fontsize;
int fvwidth = 200 + Math.round(fontsize/8*200);
long tstmp = System.currentTimeMillis()%10000000;
String inittopic = Toolbox.defaultParam(orgnum,request,  "inittopic", "", "!@#$%&()-_+:<>/,", 400);
String alltopicstr = Toolbox.defaultParam(orgnum,request,  "alltopics", "", "!@#$%&()-_+:<>/,", 400); 
 
 

String iid =   Toolbox.defaultParam(orgnum,request, "iid", null, null, 20);
if (iid == null) 
    user.iid = user.id;
else 
    user.iid = iid;
session.setAttribute("User", user); 
 %>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>"> 
<%=Toolbox.getMeta(orgnum)%>
<head> 
<%
String cid = Toolbox.defaultParam(orgnum,request, "courseid", null, "-_", 20);
String subdb = Toolbox.defaultParam(orgnum,request, "subdb", null, null, 20);
String sid = Toolbox.defaultParam(orgnum,request, "sid", null, null, 20);
String starttime = Toolbox.defaultParam(orgnum,request, "starttime", null, null, 20);
String endtime = Toolbox.defaultParam(orgnum,request, "endtime", null,  null, 20);
String toolstr = "";
int n;
String sql; 
 
if (cid!=null && subdb!=null && sid!=null)
{
    user.changedb(subdb);
    JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
    if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
    String purpose = Toolbox.defaultParam(orgnum,request, "purpose", null,  null, 20);
    if (purpose == null)
    {
        sql = "SELECT endtime, content FROM Chatmsg where sid='" + sid + "' and courseid='" + cid + "' and endtime >= " + starttime + " and endtime <= " + endtime + " order by endtime";
        
        n = adapter.executeQuery(sql);
        StringBuffer s = new StringBuffer();
        for (int i=0; i < n; i++)
        {
            //s.append(Toolbox.timestr(Long.parseLong(adapter.getValueAt(i,0))) + ":<br>" );
            s.append(adapter.getValueAt(i,1) + "\n" );
        }
        adapter.close(); 
        %>
     <%=Toolbox.getMeta(orgnum)%>
    </head>
    <body>
        <script>
            parent.Chat.insertHistory("<%=Generic.handle( s.toString())%>");
         </script>
    </body>
    </html>
    <%
    }
    else
    {  
       sql = "SELECT DomainValue.domainValue,Operation.category,Operation.description,Operation.name,cgi,opt,-1 from Operation,DomainValue where DomainValue.domain='Tool Caption' AND  CONCAT('',DomainValue.code)=Operation.caption AND DomainValue.language='" + Toolbox.langs[orgnum>>16] + "' AND  (name='LaTex' OR name='Edit' OR name='Preview')" 
       + " UNION SELECT DomainValue.domainValue,Operation.category,Operation.description,name,cgi,opt,forstudent from Operation, OperationCourse ,DomainValue where  DomainValue.domain='Tool Caption' AND CONCAT('',DomainValue.code)=Operation.caption AND DomainValue.language='" + Toolbox.langs[orgnum>>16] + "' AND  Operation.name=OperationCourse.operation and OperationCourse.course ='" + cid + "' AND  OperationCourse.forstudent > 0 AND NOT cgi='preview.jsp'";
       sql += " order by 7";
 
        n = adapter.executeQuery(sql);
 
        String alls = ",";
         
        int jj = 0; 
        for (int i = 0; i < n; i++) 
        {
            String url = adapter.getValueAt(i, 4).trim();
            String name = adapter.getValueAt(i, 3).trim();
            if (url.indexOf("Upload") >= 0 || alls.indexOf("," + name + ",") >= 0) 
            {
                continue;
            }
            alls += name + ",";
            jj++;
            if (jj > 10) break;
            for (int j = 0; j < 6; j++) 
            {
                String x  = adapter.getValueAt(i, j);
 
                if (name.equals("Preview") && j==5)
                    x = x.replaceFirst("format_t", "format_h");
                toolstr += ";" + x.replaceAll(";", ",");
            }
        }
        adapter.close(); 
      
        %>
     <%=Toolbox.getMeta(orgnum)%>
    </head>
    <body>
        <script>
            parent.Chat.setToolstr("<%=cid%>","<%=Generic.handle(toolstr.toString())%>");
         </script>
    </body>
    </html>
    <%
        
    }
return;
}
%>
  
    
<%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("talkpage.jsp","f1")%>";</script>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" src=checkHTML.js></script>
<title><%=Toolbox.emsgs(orgnum,60)%></title>
<%=Toolbox.unifontstyle(cachedstyle.fontsize,orgnum) %>
<style type="text/css"> 
textarea {width:<%=Math.round(fvwidth-4.5*cachedstyle.fontsize)%>px;height:<%=Math.round(6*(6+cachedstyle.fontsize))%>px;font-size:<%=cachedstyle.fontsize%>;border:1px #b0b0b0 solid!important}
input.radio{width:15px;background-color:transparent }
input.text{background-color:<%=cachedstyle.TBGCOLOR%>;border:1px #b0b0b0 solid;border-radius:3px}
</style>
<script  type="text/javascript" >
<%= tmsg(orgnum,new int[]{1119,64,1313}) %> 
var onlinetoolinitial =  "";
var theurl = "<%=Toolbox1.geturl(request)%>";  
var initialtopics = "<%=alltopicstr %>";
var inittopic = "<%=inittopic%>";
var timeformat = "<%=cachedstyle.timeformat%>" ;var haswebfolder=<%=user.websitename != null && !user.websitename.equals("")||user.webFileFolder != null && !user.webFileFolder.equals("") %>;
var userid = "<%=user.id%>";
var iid = "<%=user.iid%>";
var isadmin = <%=(user.roles & Systemroles.SYSTEMADMIN ) >0 || (user.roles & Systemroles.TEACHINGADMIN ) > 0 %>;   
var username = "<%=Toolbox.makeFullName(user.lastname, " ", user.firstname)%>";
var fontsize = <%=cachedstyle.fontsize%>;
var fvwidth = <%=fvwidth%>;
  
var TIMEOUT = "2000";
<%
    int sek = SessionCount.enq(session.getId());
    
%>
var mysek =  "<%= sek %>";
var cansave = <%=user.webFileFolder!=null && user.webFileFolder.equals("") == false%>;
var tstmp = <%=tstmp%>;
var needtranslator = true; 
var chatfolder = "<%=UploadFile.pfolders[7].replace(File.separatorChar,'/')%>"; 
var encoding = "<%=Toolbox.encodings[orgnum>>16]%>";
var langcode = "<%= Toolbox.langs[orgnum>>16]%>";
</script> 
 
</head>
<body style="font-size:<%=cachedstyle.fontsize%>px;background-color:<%=cachedstyle.DBGCOLOR%>;margin:0px 0px 0px 0px !important" >
 
<table  border=0 cellpadding=2 cellspacing=0 valign="top" style="margin:0px 0px 0px 0px"  id="maintbl" align="left">
<tr valign="top"></tr>
</table>
<script type="text/javascript"  src=timeformat.js></script>
<script type="text/javascript"  src="curve.js?sn=30&dn=20"></script>
<script type="text/javascript"  src=installtool.js></script>
<script type="text/javascript"  src=attachment.js></script>
<script type="text/javascript"  src=chat.js></script>
 
 <audio  id="soundalert" autostart=false src="image/sound.wma"  preload="auto"></audio>
 
<div id="copyright" style="float:left;text-align:left;color:#4d5ddd;font-size:12px"> 
<%= Toolbox.copyright[orgnum>>16]%> 
</div>   
</body> 
</html>

