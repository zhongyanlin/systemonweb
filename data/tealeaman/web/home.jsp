




<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>

<%!
   String title(String str, int col) {
      return "<tr align=center height=42><td colspan=" + col + "   class=outset2 align=center><div class=forcurve1 style=color:#DDCC11><font  size=+2><b><NOBR>" + str + "</NOBR></b></font></div></td></tr>";
   }

  String fields(String str, int orgnum, CachedStyle cachedstyle) 
  {
      return "<td style=\"color:gold;background-color:" + cachedstyle.IBGCOLOR +";font-weight:700;padding:0 3 0 3px\"><nobr>" + str + "</nobr></td>";
   }
%>


<%
    
int orgnum = Toolbox.setcharset(request, response);
    if (orgnum == -1) return;
User user = (User) (session.getAttribute("User"));
CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
if (user==null)
{
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>"><head>
        <% %><%=Toolbox.getMeta(orgnum)%></head><body><script type="text/javascript" >parent.document.location.href="index.jsp";</script></body></html>
<%
return;
}
orgnum = user.orgnum;
String style = "style=\"width:62px;font-size:16px\"";
long timenow = System.currentTimeMillis();
 
String err = "";
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">

<head><%=Toolbox.getMeta(orgnum)%>
   <style type="text/css">
          A:link
          {
          COLOR: <%=cachedstyle.IBGCOLOR%>;
          font-weight:700;
          TEXT-DECORATION: none
          }
          A:visited
          {
          COLOR: <%=cachedstyle.IBGCOLOR%>;
          font-weight:700;
          TEXT-DECORATION: none
          }
          A:hover
          {
          COLOR: purple;
          font-weight:700;
          TEXT-DECORATION: underline
          }
      input.box {font-size:16px;border:1px <%=cachedstyle.IBGCOLOR%>  solid;  }

</style>
   <script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>

   <script type="text/javascript" >
<%
String nummsg = "0";
String numsub = "0";
String numins = "0";
   JDBCAdapter adapter = null;
if (Systemroles.owndb(user.roles) )
{

int n = 0;
user.changedb(user.id);
adapter = Toolbox.getUserAdapter(user, orgnum);
err = adapter.error();
if (err.equals(""))
   n = adapter.executeQuery("SELECT count(*) FROM Message WHERE suppress=0 AND rid='" + user.id +"'");
else
   err = Toolbox.emsgs(orgnum,934) +"<br>Or<br>" +  Toolbox.emsgs(orgnum,117);
if (n > 0)
{
           nummsg  = adapter.getValueAt(0,0);

}
String sql= "SELECT count(*) FROM Submission, Assignment  WHERE Submission.semester=Assignment.semester AND Submission.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester +"' AND Submission.course=Assignment.course AND Submission.assignname=Assignment.name  AND (grade=-1 or grader=-2 AND Assignment.due < " + timenow/1000 +") AND Assignment.grader LIKE '%"+user.id +"%'";
if (err.equals(""))
n = adapter.executeQuery(sql);

if (n > 0)
{
           numsub  = adapter.getValueAt(0,0);

}
 

adapter.close();
adapter = Toolbox.getSysAdapter(orgnum);
if ( (user.roles & Systemroles.INSTRUCTOR)>0)
{
    n  = adapter.executeQuery("SELECT TimeSlot.timeslot,room FROM Session, TimeSlot WHERE Session.schedule=TimeSlot.num AND Session.instructor='"+user.id +"' AND Session.semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester + "';");
    if (n>0){
    out.print("var timeslots = [" );
    for (int i=0; i < n-1; i++)
        out.print("\"" + adapter.getValueAt(i,0) +"\"," );
    out.println("\"" + adapter.getValueAt(n-1,0) +"\"" + "];" );
    out.print("var rooms = [" );
    for (int i=0; i < n-1; i++)
        out.print("\"" + adapter.getValueAt(i,1) +"\"," );
    out.println("\"" + adapter.getValueAt(n-1,1) +"\"" + "];" );
    }
    adapter.close();
}
}


GregorianCalendar newCal = new GregorianCalendar( );
out.println("var timenowstr=" + newCal.get( Calendar.DAY_OF_WEEK ) +";");
out.println("var timenowsec=" + timenow  +" - (new Date()).getTime() ;");
int n1 = orgnum%65536;
int n2 = orgnum >> 16;
if (n1 >= Toolbox.dbadmin.length) n1 = 0;
if (n2 >= Toolbox.langs.length) n2 = Toolbox.langnum; 
String pagetitle= Toolbox.dbadmin[n1].unitname[n2]; 
  
if (pagetitle == null || pagetitle.equals(""))
    pagetitle =  Toolbox.emsgs(orgnum,906);
 
if (Toolbox.edition.contains("Personal"))
   pagetitle = Toolbox.emsgs(orgnum,1471);
else 
{
   int j = pagetitle.indexOf("/");
   if (j > 0)
   {
      pagetitle = "<span style=font-size:20px><nobr>" + pagetitle.replaceFirst("/.*$","") + "</nobr></span><br><nobr>" + pagetitle.replaceFirst("[^/]+/","") + "</nobr>";
   }
}
%>
      var indexpage = true;
      var font_size=<%=(user == null) ? Toolbox.defaultFontSize : cachedstyle.fontsize%>;
      var encoding = '<%=Toolbox.encodings[orgnum>>16]%>'; 
      var langcode = "<%= Toolbox.langs[orgnum>>16]%>";
      function handleError( errType, errURL, errLineNum )
      {
        myprompt( "Error: " + errType + "\non " + errURL + "\nat line " + errLineNum);
         return true;
      }
      window.onerror = handleError;
      function setcrosssite(s){crosssite=s;}
      var tmg82 = '<%=Toolbox.emsgs(orgnum,82)%>', tmg995 = '<%=Toolbox.emsgs(orgnum,995)%>';
      var IBGCOLOR = '<%=cachedstyle.IBGCOLOR%>',BBGCOLOR = '<%=cachedstyle.BBGCOLOR%>',DBGCOLOR = '<%=cachedstyle.DBGCOLOR%>';



   </script>

   <title><%=Toolbox.emsgs(orgnum,515)%></title>
   <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    
   <%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />

</head>
<body style="background:url(image/icon/bg5.png) <%=cachedstyle.DBGCOLOR%>;margin:5px 0px 0px 0px">

 <table style="background:url(image/icon/bg5.png)" width="94%" align=center cellspacing="0" cellpadding="1" id="table1" border="0" >
  <tr height=100 >
    <td  >
      <table align=center width="100%"   style="background:linear-gradient(<%=cachedstyle.IBGCOLOR%>,<%=Toolbox.headercl(cachedstyle.IBGCOLOR)%>)"  cellpadding="0" cellspacing="0">
        <tr>
           <td width=100 align=left   >
             <img src=image/logoani.gif height=100>
           </td>
           
           <td height=50px width="100%"  align=center>
             <div class="forcurve1" style="color:#DDCC11"> 
             <nobr>&nbsp;<%=pagetitle%>&nbsp;</nobr>
             </div>
           </td>
        </tr>
      </table>
    </td>
  </tr>
 </table>
 <br>

 <table align="center" width="94%" class="outset3">
  <tr>
      <td valign="top" width="50%"  style="background:url(image/bg5.jpg)" align="right"> 
          <%=Toolbox.emsgs(orgnum,281)%></td> <td align="left"><a href="javascript:openthis('DataSearch?rdap=messages0&preop=messages0&subdb=<%=user.id%>')"><%=nummsg%></a><br>
      </td></tr><tr><td  align="right"> <%=Toolbox.emsgs(orgnum,676)%></td> <td><a href="javascript:openthis('DataSearch?rdap=grading0&exbut=h&subdb=<%=user.id%>')"><%=numsub%></a><br>
       </td></tr><tr><td  align="right">   <%=Toolbox.emsgs(orgnum,58)%></td> <td><a href="javascript:openthis('talk.jsp')"> <%=numins%> </a>
      </td> 
  </tr><tr height="350"><td colspan="2" align="center" valign="bottom">
 <img src="image/tm.png" width="580">  
 </td></tr></table>
 <script type="text/javascript" >
<% if (err.equals("")){%>
if (localStorage["browsehint"]==null && (parent.frames==null || typeof(parent.frames[0].whichtar)!='undefined' && parent.frames[0].whichtar()=='_blank'))
{
   var ugentmsg  =  textmsg[868];

   if (browserstr.indexOf('MSIE') >= 0)
   {
      var  reg  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (reg.exec(navigator.userAgent) != null)
         rv = parseFloat( RegExp.$1 );
     if (rv == 6.0)
        ugentmsg  = 'Because you are using an old version of Internet Explorer browser, some of TeaLeaMan functions may not work. You are advised to update your browser.<br><br>';
     //else  ugentmsg   = textmsg[868] + textmsg[869];
   }
   else if (browserstr.indexOf('Mozilla')>=0)
   {
      //ugentmsg  += textmsg[870];
   }
   else if (browserstr.indexOf('Safari') >=0)
   {
      ugentmsg  += "<br>" + textmsg[871] +".<br>";
   }
   else
   {
      ugentmsg  += "<br>" + textmsg[873]+".<br>";
   }
   ugentmsg += "<br><input type=checkbox style=background-color:transparent onclick=\"javascript:localStorage['browsehint']='1'\"> " + textmsg[872] + "<br>";
}
<%}
else
{%>
   var ugentmsg = "<%=err.replace('"',' ').replace('\n',' ')%>";
<%
}%>
function openthis(ul)
{
   if (thispagewidth()!=parent.frames[0].thispagewidth())
       open(ul, parent.frames[0].whichtar());
   else
       document.location.href = ul;
}
</script>
<script type="text/javascript"  src=curve.js></script>
 
<script type="text/javascript"  src=clock.js></script>
</body>
</html>

