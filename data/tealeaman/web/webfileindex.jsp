<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%! 
 void swap(String [][] row, int i, int j)
 {
     String x;
     for (int k=0; k < row[i].length; k++)
     {
         x = row[i][k];
         row[i][k] = row[j][k];
         row[j][k] = x;
     }
 }
 
 
%>
 
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
 long tstmp = System.currentTimeMillis()%10000000;
 User user = null;
if (  (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request, response, "webfileindex.jsp", true)) == null) 
    return;
orgnum=user.orgnum;
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%><title><%=Toolbox.emsgs(orgnum,65)%></title> 
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("webfileindex.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
</head>
<body  style="margin:6px 12px 6px 6px;background:<%= cachedstyle.IBGCOLOR %> right url(image/backgd.gif) repeat-y">
<center>
<%=Toolbox.logtitle(Toolbox.emsgs(orgnum,66), 204)%>
 

<%

user.changedb(user.id); 
if ( user.webFileFolder == null ||   user.webFileFolder.equals(""))
{
%>
 
<%=Toolbox.emsgs(orgnum,763)%>
<%
return;
}
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (adapter.error().length() > 0)
{ 
%>
<jsp:forward page="login.jsp">
<jsp:param name="error"  value="databse%20error" />
<jsp:param name="follow" value="webfileindex.jsp" />
</jsp:forward>
<%
adapter.close();
return;
}

 
String cachestr = Toolbox1.GetCookie(request, user.id + "tcmt");
if (cachestr != null && !cachestr.equals(""))
{
    try{
    cachestr =  (new Encode6b(orgnum)).rto6b(cachestr);
 
    }catch(Exception e){cachestr = null;}
}
 
int numcourses = 0;
String [][]rows = null; 
CSVParse parse = null;

 

if (cachestr == null || cachestr.equals(""))
{
    String sql1 = "SELECT   distinct  Course.id, title  FROM Course, Session  WHERE Course.id=Session.courseid AND Session.instructor='" + user.id +"' and semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester + "' ORDER by Course.id";
 
    if (adapter.executeQuery2(sql1,true))
    {
        cachestr = adapter.tocsv().trim().replaceFirst("^,$","");
    }
 
    if (cachestr!=null && cachestr.equals("") == false)
        cachestr += DBAdmin.CSVseparator[1];
    
    String sql2 = "SELECT distinct  Course.id, title  FROM Course, Session  WHERE Course.id=Session.courseid AND Session.instructor='" + user.id +"' AND Course.id NOT IN (select courseid FROM Session WHERE instructor='" + user.id +"' and semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester + "')  ORDER BY title";
    
    if (adapter.executeQuery2(sql2,true))
    {
        cachestr += adapter.tocsv().replaceFirst("^,$","");
       
    }
 
    adapter.close();
    
    if (cachestr!=null && !cachestr.equals(""))
    {
        Cookie cookie = new Cookie (user.id + "tcmt",(new Encode6b(orgnum)).to6b(cachestr));
        cookie.setMaxAge(183 * 24 * 60 * 60);
        response.addCookie(cookie);
    }
 
}

if (cachestr != null && !cachestr.equals("")) 
{
     
    parse = new CSVParse(cachestr, DBAdmin.CSVquote,  DBAdmin.CSVseparator);
    rows = parse.nextMatrix();
    numcourses = rows.length;
   
}    

%>
<form rel=opener name=form3 method=post action=webfolder.jsp target=rightwinw style="margin:5px 0px 5px 0px"  >
<input type=hidden name=iscourse value="yes">
<input type=hidden name=allcourse value="">
<input type=hidden name=folder>                                               
<TABLE width="100%"  border=0 cellpadding=2 cellspacing=0 class=outset  >    
 
<%
int ii = Toolbox.indexframewidth(cachedstyle.fontsize);
String allcourse = "";
int i = 0; 
 
for (int j = 0; j < numcourses; j++)
{
    if (rows[j].length!=2) 
    {
        numcourses = j;
        break; 
    }
    String cid = rows[j][0]; 
    
    String ctitle = rows[j][1];
    if (cid ==null || ctitle==null) continue;
    ctitle = ctitle.trim();
    cid = cid.trim();
    allcourse += "," + cid;
    %>
    <TR>
    <TD width="12">
       <img src=image/tri.gif>
    </td>
    <td align="left">
    <div id="varywidthdiv<%=i++%>" style="text-shadow:-1px -1px #060606;width:<%=ii%>px;overflow:hidden">
       <nobr>
          <a href="javascript:invoke('<%=cid%>')" ><%=cid +" "+ctitle%></a>
       </nobr>
    </div>
    </TD>
    </TR>
    <%
}
 
 
 
if (numcourses==0)
{
    if (Toolbox.dbadmin[orgnum%65536].systemserver.equals(user.dbinfo.server))
    {
        out.print(Toolbox.emsgs(orgnum,566));
    }
    else
    {
    %>
    <tr><td colspan="2" style=color:#DDCC11>
    <%=Toolbox.emsgs(orgnum,300)%><center><input class=GreenButton style="background-color:#00BBBB;color:white;font-weight:700;width:<%=cachedstyle.fontsize*4%>px;height:<%=cachedstyle.fontsize+4%>" type=button name=submit2 value="<%=  Toolbox.emsgs(orgnum,1429) %>" 
                                                                                onclick="debg()"> </center>
    </td></tr>
    <%
    }
}
else
{%>

 
<TR><TD  colspan="2" align="center"> <input id="refresh" type="button" class="GreenButton" style="width:<%=Math.round(4.5*cachedstyle.fontsize)%>px;text-align:center" 
              onclick="refresh1()" value="<%=Toolbox.emsgs(orgnum,93)%>" >
        <input type=button class=BlueButton  style="width:<%= 4.5*cachedstyle.fontsize%>px"  onclick=demo() value="<%=Toolbox.emsgs(orgnum,1584)%>" >
</TD></TR>
<%}

%>

</TABLE>                                                

</form>
  
<%=Toolbox.sponsor(orgnum,1+numcourses, 210)%>

<script type="text/javascript" >
function invoke(cid)
{
   document.form3.allcourse.value= '<%=allcourse %>';
   document.form3.iscourse.value= 'yes';
   document.form3.folder.value = cid  + "/" + '<%=UploadFile.pfolders[0]%>';
   formnewaction(document.form3);
   if (typeof (changeFlag)=='function')
       changeFlag(cid,false);
   visual(document.form3);
document.form3.submit();
   
}

function refresh1()
{
    SetCookie("<%=user.id%>tcmt","");
    document.location.href = document.location.toString();
}

//function syn(x,c){invoke(document.form3.folder.value);}

//parent.frames[1].document.writeln('<html><body background="image/<%=Toolbox.dbadmin[orgnum%65536].bgimage%>" bgcolor=<%=cachedstyle.DBGCOLOR%>>Click a course title');
function debg()
{
   open("follows.jsp?x=mycourse", parent.frames[1].name);
} 
parent.document.title = "<%= Toolbox.emsgs(orgnum,66) %>";
var onloadbeforewebi = null;
if (typeof window.onload == 'function')
onloadbeforewebi = window.onload;
window.onload = function()
{
    if (onloadbeforewebi!=null) 
       onloadbeforewebi();
    Msg.init({stoken:securitytoken,
    app:"chat",
    tid:'',
    sid:"<%=user.id%>",
    sname:"<%=user.id%>",
    rid:'',
    code:'',
    msg:'',
    sek:"<%=SessionCount.enq(session.getId())%>"}); 
}     
function quitm(td)
{
    if (td!='')
    Msg.send({code:'unsubs',tid:td, msg:td});
}
 
demotasks = [
    ["democursorx=myHintx;democursory=myHinty;democursor2(document.getElementById('refresh'),2)", 0],
    ["democursor2(document.getElementById('varywidthdiv0'),4);", 1000],
    ['demoheight(0.7)',3000],    
    ['demoheight(1);eval( document.getElementById("varywidthdiv0").innerHTML.replace(/<nobr>/,"").replace(/<.nobr>/,"").replace(/.*javascript:([^"]+).*/,"$1"))', 500],
    ['demoremovesim()',2000]
];

</script>

<script type="text/javascript"  src="floating.js"></script>
<script type="text/javascript"  src=curve.js></script>
<script type="text/javascript"  src=hints.js></script>
<iframe name="w<%=tstmp%>" width="1" height="1" scrolling="no" style="visibility:hidden" />
</body>
</html>
<%
 final HttpSession ss  = session;
 final User uu = user; 
 new Thread(){ public void run(){
   long filesize = FileOperation.getFileOrDirectorySize(new java.io.File(uu.webFileFolder));
   ss.setAttribute("totalwebfoldsize", new Long(filesize));
   ss.setAttribute("folderandsize", ""+filesize +";|");  
  }}.start();
%>
