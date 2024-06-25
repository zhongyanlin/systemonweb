<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
    CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
%>
<%!
    boolean donehint = false;
    boolean donesearchm = false;
    boolean donesearcha = false;
    boolean donewrite = false;
    String headwrite = "";
    void writelet1(String clc, String cap, int fs)
    {
        headwrite = writelet(clc,cap, fs);
    }

String  butwidth(String str, int font_size, int orgnum)
{
   int leng = (str.length() * font_size)/2 + 4;
   int upper = (int)Math.ceil(Toolbox.charwidthrate() * font_size);
       
   if (leng <  upper) 
       leng =  upper;
   return  "style=width:" + leng +"px";
}
 
    String title1(String str,boolean hassearch, int j, String subd, int font_size, int orgnum,CachedStyle cachedstyle)
    {
       String hstyle="overflow:visible;text-align:center";

       String ans = "<tr><td width=100% ><table border=0 width=100% style=\"margin:0px 0px 0px 0px\" cellspacing=0 cellpadding=0><tr><td width=2></td><td  ><table cellpadding=0 cellspacing=0 width=100><tr>"
             + Toolbox.fields(str,orgnum, cachedstyle);
       
       ans += "</tr></table></td><td  align=left><nobr>";
       if (donehint==false && subd.equals(""))
       { 
           // ans += "<font size=2>(" + Toolbox.emsgs(orgnum,1047)  +")</font>";
           donehint = true;
       } 
       ans += "</nobr></td><td  align=\"right\"><table border=0 align=\"right\" cellspacing=0 cellpadding=0><tr><td align=\"right\">";
       if (1==2) //hassearch == true)
       {    
           ans += "<input type=button  style=\"" + hstyle + "\"  class=GreenButton  onclick=\"javascript:search("
             + j 
             + ")\" value=\"" 
             + Toolbox.emsgs(orgnum,1134+j)
             + "\"   >";
       }
       if (!headwrite.equals(""))
       {
           ans += "</td><td align=\"right\" width=\"" + (int)(6*Toolbox.defaultFontSize) +"\">" + headwrite;
           headwrite = "";
       }           
       ans += "</td></tr></table></td><td width=3></td></tr></table></td></tr>";
       return ans;
     }

     String writelet(String clc, String cap, int font_size)
     {
         String hstyle="overflow:visible";
    
           return 
             "<input type=button  class=GreenButton   style=\"" + hstyle + "\"   onclick=\""
             + clc + "\" value=\""  + cap + "\" >";
     }
%>
<%
  
    User user = null;
    if (  (user = User.authorize(orgnum,  Systemroles.TEACHINGADMIN | Systemroles.INSTRUCTOR | Systemroles.STUDENT|Systemroles.TA |Systemroles.ASSESSER,application,session,request, response, "studentannounce.jsp", true)) == null|| !Toolbox.verifytoken(request))
        return;
    orgnum=user.orgnum;
    String sid =  Toolbox.defaultParam(orgnum,request,"sid", user.id, null,20);
    if (!user.id.equals(sid) && (Systemroles.TEACHINGADMIN | user.roles ) == 0 && (Systemroles.INSTRUCTOR | user.roles ) == 0 )
    return;
    String iids =  Toolbox.defaultParam(orgnum,request,"iids","", ",;-", 170); 
    String iid =  Toolbox.defaultParam(orgnum,request,"iid","", ",;-", 170);
    String fullname =  Toolbox.defaultParam(orgnum,request,"fullname",null);
    String tas = Toolbox.defaultParam(orgnum,request,"ta","", ",;-", 170);
    String department =  Toolbox.defaultParam(orgnum,request,"department","", null, 30);
    String courses = Toolbox.defaultParam(orgnum,request,"courses","", ",-_;",160);
    String inames =   Toolbox.defaultParam(orgnum,request,"inames","",  ",-;", 320); 
    String iname =   Toolbox.defaultParam(orgnum,request,"iname","",  ",-;", 60); 
    String courseid  = ""; 
    String str1, str, subdb =   Toolbox.defaultParam(orgnum,request,"subdb","", null,30);
    if (user.iid==null && !user.id.equals(subdb))user.iid = subdb;
    if (!subdb.equals("")) 
    {
       courseid = Toolbox.defaultParam(orgnum,request,"course","","-",30);
    }
    String courseTitle = Toolbox.defaultParam(orgnum,request,"coursetitle","", "!@#$%&()-_+:/", 400); 
    String startdate =   Toolbox.defaultParam(orgnum,request,"startdate", "" + (!courseid.equals("")?((System.currentTimeMillis()/1000)-180*24*3600 ): ((System.currentTimeMillis()/1000)-8*180*24*3600 )) );
    String enddate = Toolbox.defaultParam(orgnum,request,"enddate", "" + ( (System.currentTimeMillis()/1000)) );
    char thisrole = tas.contains(user.id)?'t':(iid.equals(user.id)?'i':'s');
    
    session.setAttribute("User",user);
   
    HashMap<String, String> id2name = new HashMap();
    int tai = 1;
    if (tas!=null && !tas.equals(""))
    {
       for (String taid : tas.split(","))
          id2name.put(taid, Toolbox.emsgs(orgnum,1096) + " " + (tai++));
    }
    String ecourses = Toolbox.urlencode(courses);
    String cus []  = courses.split(";");
    
    String iida [] = iids.split(";");
    String thisiid = ""; 
    String ins [] = inames.split(";");
    String searchstr = Toolbox.defaultParam(orgnum,request,"wcds",null);
 
    String searchrange =   "  AND enddate >= " + enddate;
    String searchrange1 =  "AND suppress=0 AND postdate >=" + startdate.replaceAll("'","''") ;
    char dowhich = 'b';
    String searchrdap = Toolbox.defaultParam(orgnum,request,"rdap",null, null,40);
    long tstmp = System.currentTimeMillis() % 10000000;
 
    if ( searchstr!=null && searchrdap!=null && !searchstr.equals("") && !searchrdap.equals(""))
    {
 
        if (searchrdap.indexOf("message")==0)
        {
          searchrange1 = searchstr;
          dowhich = 'm';
        }
        else
        {
          searchrange = searchstr;
          dowhich = 'a';
        }
    }
       
    
    
    user.changedb(subdb);
    String pagetitle = "";
    if (dowhich=='b')
        pagetitle = Toolbox.emsgs(orgnum,282) + Toolbox.emsgs(orgnum,352) + Toolbox.emsgs(orgnum,281);
    else if (dowhich=='a')
        pagetitle = Toolbox.emsgs(orgnum,282);
    else if (dowhich=='m')
        pagetitle = Toolbox.emsgs(orgnum,281);
    user.iid = subdb;
    if (subdb.equals(""))
    {;
         courseTitle = Toolbox.emsgs(orgnum,1505);
         pagetitle = courseTitle +": " +pagetitle;
    } 
    else
    {
        //out.println(courses);out.println(iids);out.println(inames);

        int k = 0;
        for (; k < iida.length && !iida[k].equals(subdb); k++);
        if (k < iida.length && k < cus.length && k < ins.length)
        {
            String tmp = cus[k]; cus = new String[1]; cus[0] = tmp;
            tmp = iida[k]; iida = new String[1];     iida[0] = tmp;
            tmp = ins[k];  ins = new String[1];       ins[0] = tmp;
            thisiid = subdb; 
            pagetitle = courseTitle +": " +pagetitle;
        }
        else
        {
            
            return;
        }
    }
    
    String sql = "";
    boolean needtranslator = false; 
    String assignSQLstr = "";
    int n=-1;
    String opts = "";
    String sepa = "";//<tr height=0><td></td></tr>";
    String hstyle="padding:0px 0px 0px 0px;vertical-align:middle;width:" + Math.round(Toolbox.charwidthrate()*cachedstyle.fontsize) + "px;overflow:visible";
    %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
 
<head> <%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("studentannounce.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<title><%=Toolbox.emsgs(orgnum,515)  %></title>
<% out.print(Toolbox.unifontstyle(cachedstyle.fontsize,orgnum));%>
</head>
<script type="text/javascript" >
var theurl = "<%=Toolbox1.geturl(request)%>";
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
       myprompt(txt);
      window.onerror = handleErr;
      return true;
}
window.onerror = handleErr;
}
</script>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<style type="text/css"> p{margin:5px 5px 5px 5px}</style>
 
<body style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:4px 4px 4px 4px">
    
    <table width="100%" cellspacing="0" cellpadding="0">
    <%=Toolbox.title(pagetitle,1)%>
    
      <tr height=3><td align="center"><% 
       if (courseid.equals("") && dowhich == 'b'){%>
       
       <script>
       var ss = null;
       if ( typeof(parent.frames[0].document.form1.course) != 'undefined')
       {
           document.write("<table class=\"outset3\" style=\"margin:5px 5px 5px 5px\"><tr><td>");
            ss = parent.frames[0].document.form1.course; 
        } 
        else
          document.write("<div   style=\"margin:5px 5px 5px 5px;padding:5px 5px 5px 5px;width:480px;background-color:transparent\" ></div>");
       function leftsel (sel)
       {
           if (ss!=null && sel!=null)
           {
               ss.selectedIndex = sel.selectedIndex;
               parent.frames[0].resetassociate();
           }
           parent.frames[0].openit1('studentannounce.jsp');
       }
       if (ss!=null && ss.options.length>1)
       {
           document.write("<nobr><%=Toolbox.emsgs(orgnum,1047)%><select name=\"course\" onchange=\"leftsel(this)\">" + ss.innerHTML  + "</select></nobr></td></tr></table>");
           
       }
       else if (ss!=null)
       {
           document.write("<nobr><a href=javascript:leftsel()><%=Toolbox.emsgs(orgnum,1048)%>:" + ss.options[0].text + "</a></nobr></td></tr></table>");
       }
       
       </script>
       
       <%}else if (dowhich=='m')
       {%>
         <script>
            document.getElementById('titlediv').innerHTML = document.getElementById('titlediv').innerHTML.replace(/:[^<]+/,':' + textmsg[1161]);
            if (<%=sid.equals(user.id)%> &&  typeof(parent.frames[0].document.thisform )!='undefined'
            && typeof(parent.frames[0].document.thisform.savebtn1)!='undefined') 
            {
                parent.frames[0].document.thisform.savebtn1.onclick = function(){compose('','<%=iid%>','<%=iid%>');}
            }
         </script>
       <%
       }
       %></td></tr>
    <tr><td align="center">
     <%  
     if (sid.equals(user.id)) 
     {
                       out.print( writelet("javascript:compose('','" + iid + "',null)",Toolbox.emsgs(orgnum,610),cachedstyle.fontsize) ) ; 

     } 
     else 
     {
                       out.print( writelet("javascript:compose('','" + sid + "',null)",Toolbox.emsgs(orgnum,610),cachedstyle.fontsize)) ;  
     }

  if (dowhich!='m')
   out.print(" " + writelet("javascript:search(1)",Toolbox.emsgs(orgnum,1135),cachedstyle.fontsize)); %>
 <% if (dowhich != 'a') {   if(thisrole == 't'){%>
<input class=GreenButton type=button   style="overflow:visible;"  onclick="javascript:makeann(this)" value="<%=Toolbox.emsgs(orgnum,1133)%>"   >   
<%}else{%>  
<input class=GreenButton type=button   style="overflow:visible;"  onclick="javascript:search(2)" value="<%=Toolbox.emsgs(orgnum,1136)%>"   >   
 <%}}%>       
        </td></tr>
<%
String statusstr = "";
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
if (user.id.equals(sid) && !courseid.equals("") && !courseid.equals("tealeaman"))
{
     String accessible = Toolbox.defaultParam(orgnum,request, "accessible", "");

     if (!accessible.equals("true"))
     {
         statusstr = RegStatus.goodstatus(adapter,  user,  courseid,  sid,  subdb);
         if (!statusstr.equals(""))
         {
             out.print("</table></center><br>" + statusstr + "<script type=text/javascript   src=curve.js></script></body></html>");
             adapter.close(); 
             return;
         }
         else
         {
             statusstr = "parent.frames[0].setaccessible(\"" + courseid +"\");";
         }
     }
}
int N0 = 0;    
if(dowhich=='m'||dowhich=='b')
{
    String direction = Toolbox.defaultParam(orgnum,request, "Direction", ""); 
 
    if (direction.equals("0"))
    { %>
        <script>
        var tbl = document.getElementById('titlediv');
        tbl.innerHTML =tbl.innerHTML.replace(/:[^<]+/, ':' + textmsg[1161]);
        </script>
     <%
        assignSQLstr = "SELECT postdate, subject, format, content, firstname, lastname,subdb,suppress, attach,Message.sid, Message.rid,0  FROM Message, AppUser WHERE  AppUser.id=Message.sid AND AppUser.roles > 1 " + searchrange1.replaceFirst("WHERE ", " AND ") + " AND (rid='" + user.id + "' OR rid LIKE '%" + user.id + "' OR rid LIKE '" + user.id + "%' OR rid LIKE '%" + user.id + "%')" ; 
    }
    else if (direction.equals("1"))
    {
       %>
    <script>
        var tbl = document.getElementById('titlediv');
        tbl.innerHTML =tbl.innerHTML.replace(/:[^<]+/, ':' + textmsg[1062]);
    </script>
       <%
        if (!iid.equals(user.id))
        assignSQLstr = "SELECT postdate, subject, format, content,   lastname,firstname, subdb,suppress, attach,Message.sid,  Message.rid,1 FROM Message, AppUser WHERE AppUser.id=Message.rid  " + searchrange1.replaceFirst("WHERE ", " AND ")  + " AND sid='" + user.id + "'" ;
    }
    else
    {
        assignSQLstr = "SELECT postdate, subject, format, content,  lastname,firstname, subdb,suppress, attach,Message.sid, Message.rid,0  FROM Message, AppUser WHERE AppUser.id=Message.sid AND AppUser.roles>1 " + searchrange1.replaceFirst("WHERE ", " AND ") + " AND  (rid='" + user.id + "' OR rid LIKE '%" + user.id + "' OR rid LIKE '" + user.id + "%' OR rid LIKE '%" + user.id + "%')";
        if (!iid.equals(user.id))
              assignSQLstr += "\nUNION\n SELECT postdate, subject, format, content, lastname,firstname, subdb,suppress, attach, Message.sid, Message.rid,1 FROM Message, AppUser WHERE AppUser.id=Message.rid  " + searchrange1.replaceFirst("WHERE ", " AND ")  + " AND sid='" + user.id + "'" ;
        
    }
 
    boolean bb = adapter.executeQuery2(assignSQLstr + " order by postdate  DESC",false); 
    String format = "0";
    String divs  = ""; 
    String subj="", datetime="",attach="", body="", diret="", from="", senderid="", recv="", sup="";  
    int i = 0;
     
    while (bb)
    { 
        subj=""; datetime="";attach=""; body="";diret="";from="";senderid="";recv="";  sup="";
        for (int j =0; j < 12; j++)
        {
            String x = adapter.getValueAt(i,j); 
            if (x == null)
            {
                if (adapter.cursor == -2 && j==0)
                {
                    bb = false;
                    break;
                }   
                else  if (j==0)  
                    x = "11111111111"; 
                else 
                    x = "";
            } 
            if (j == 0)
            {
                datetime = x; 
            }
            else if (j==1)
            {
                subj = x;
            }
            else if (j ==2) 
            {
                format = x;
            }
            else if (j == 3) 
            {
                body = Toolbox1.todiv(orgnum,Toolbox.formatstr(format, x),i);
            } 
            else if (j == 4) 
            {
                from = x;
            }
            else if (j == 5) 
            {
                from  = Toolbox.makeFullName(from, "",x); 
            }
            else if (j == 7) 
            {
                sup = x;
            } 
            else if (j == 8)
            {
                String X[] = Toolbox1.attaget(x,i,null, orgnum);
                if (X[0]!=null) attach = X[0]; 
                if (X[1]!=null)divs = X[1] + "\n"; 
            }
            else if (j == 9)
            {
                 senderid = x;
                 id2name.put(x,from);
            }
            else if (j == 10)
            {
                recv = x;
            }
            else if (j == 11)
            {
                diret = x;
            }
           
        }
        if (!bb) break;
        %>
        
        <tr><td width=100%> 
        <% out.print("<table>" + sepa +"</table>");
        if (divs.equals("")==false) out.println("<style type=text/css>" + divs + "</style>"); %>
        <%
        if (dowhich=='m' && i==0 && direction.equals("0"))
        { 
          %>  
           <%= title1( Toolbox.emsgs(orgnum,623),true,1,subdb,cachedstyle.fontsize, orgnum, cachedstyle) %>
          <%
         }
        else if (dowhich=='m' && i==0 && direction.equals("1"))
        { 
          %>  
           <%= title1( Toolbox.emsgs(orgnum,860),true,1,subdb,cachedstyle.fontsize, orgnum, cachedstyle) %>
          <%
         }
        else if ( (dowhich=='b' ||direction.equals("")) && i==0)
        { 
          %>  
           <%= title1( Toolbox.emsgs(orgnum,281),true,1,subdb,cachedstyle.fontsize, orgnum, cachedstyle) %>
          <%
         }
        %>  
        
        <script type="text/javascript" >document.write(round1('100%'));</script>
        <table id="msg<%=i%>" width=100% cellpadding=1 cellspacing=1 class=outset3 >
        <tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>" >
            <td width=40% <%{%>  onclick="sort(this,0)"  <%}%> ><p style="margin:0px 0px 0px 5px"><nobr><b><%=subj%></b></nobr></td>
            <td width=20% <%{%>  onclick="sort(this,1)"  <%}%> ><nobr><%=Toolbox.timestr(Integer.parseInt(datetime),cachedstyle.timeformat).replaceAll(" ","&nbsp;")%></nobr></td> 
            <td width=4%  <%{%>  onclick="sort(this,2)"  <%}%> ><nobr> <% 
            if (diret.equals("0")) out.print(Toolbox.emsgs(orgnum,1506).replaceFirst(":.*", ""));
            else out.print(Toolbox.emsgs(orgnum,1506).replaceFirst("[^:]+:", "")); %>
            </nobr></td>
            <td width=16%  <%{%>  onclick="sort(this,3)"  <%}%> ><nobr>
             <%= from  %></nobr></td>
            <td width=20%  align=right > 
            <table   align="right" cellpadding="0" cellspacing="0"><tr >
             <%  if (diret.equals("1")) 
             {%>       
               <td  align="right"> <input type=button class=OrangeButton style="<%=hstyle%>" onclick="javascript:openit3('<%=subdb%>','<%=datetime%>','<%=Toolbox.urlencode(recv)%>')" value="<%=(sup.equals("0")  ?Toolbox.emsgs(orgnum,613):Toolbox.emsgs(orgnum,960))%>"></td>
               <td  align="right"> <input type=button class=GreenButton   style="<%=hstyle%>" onclick="javascript:compose('<%=Toolbox.emsgs(orgnum,1504)%>:<%=subj.replaceAll("'","\\\\'").replaceAll("\"","")%>','<%=recv%>','<%=from.replaceAll("'","")%>','<%=adapter.getValueAt(i,6)%>')" value="<%=Toolbox.emsgs(orgnum,1504)%>" ></td>
            <%} 
             else 
            {%>
               <td  align="right"> <input type=button class=OrangeButton style="<%=hstyle%>" onclick="javascript:openit3('<%=subdb%>','<%=datetime%>','<%=Toolbox.urlencode(senderid)%>')" value="<%=(sup.equals("0")  ?Toolbox.emsgs(orgnum,613):Toolbox.emsgs(orgnum,960))%>"></td>
               
               <td> <input type=button class=GreenButton   style="<%=hstyle%>" onclick="javascript:compose('<%=Toolbox.emsgs(orgnum,151)%>:<%=subj.replaceAll("'","\\\\'").replaceAll("\"","")%>','<%=senderid%>','<%=from.replaceAll("'","")%>','<%=adapter.getValueAt(i,6)%>')" value="<%=Toolbox.emsgs(orgnum,612)%>" ></td>
            <%}%>
              </tr></table>
            </td>
            </tr>
            <tr bgcolor=<%=cachedstyle.TBGCOLOR%>><td colspan=5 
            <%
            
          
            if (subj.equals(Toolbox.emsgs(orgnum,624)) && body.equals(Toolbox.emsgs(orgnum,624))) 
            {
            %>
               <p> <font size=+1 color=#CC0000><%=Toolbox.emsgs(orgnum,614)%></font> <br>
                    <%=Toolbox.emsgs(orgnum,615)%><br> 
                &bull; <%=Toolbox.emsgs(orgnum,616)%><br> 
                &bull; <%=Toolbox.emsgs(orgnum,617)%><br>
                &bull; <%=Toolbox.emsgs(orgnum,619)%></p>
            <%
            }  
            else
            {
                 out.print(">" + (attach==null|| attach.equals("")? "" : ("<table width=100% ><tr><td><img src=\"image/clip.png\" width=28 >" + attach + "</td></tr></table>")) +     body ); 
            }         
            %>  
         </td></tr>
        </table><script type="text/javascript" >document.write(round2); </script>
        </td></tr>
    <%
         i++;   
    }
    N0 = n = i;
    if (n < 1) 
    { 
     if (dowhich == 'm') 
         out.println("<table><tr><td colspan=2 style=color:purple>"+  Toolbox.emsgs(orgnum,869)  + "</td></tr></table>");
     else if( dowhich=='b')
     {
    %>
        <tr><td align=center width=100%> 
         <NOBR>
           <table  align="right" cellpadding="0" cellpadding="0"><tr>
          <%  
          {  
            out.println("<td  align=\"right\"></td><td align=\"right\"></td><td width=4>&nbsp;</td>");
          } 
           %>
         
         </tr></table>
         </NOBR>    
        </td></tr>
    <% 
    }
  }
  out.println("<script>var mn=" + n + ";</script>");  
}//end dowhich
if(dowhich=='a'||dowhich=='b')
{
    assignSQLstr=""; 
    int numcourses; 
    String course, courseSQLstr, tt; 
    assignSQLstr = "";
    opts = "";
    String optc="",optv="";
    String heading =  Toolbox.emsgs(orgnum,625);
    if (courseid.equals(""))
    {
      for ( int j =0; j < iida.length && j < ins.length; j++) 
     {
        //out.print(iida[j] + ins[j]);
        if ( (","+optv).indexOf("," + iida[j] + ",") < 0)
        {    
            optv +=  iida[j] +","; 
            optc +=  ins[j] + ","; 
        }
        if (j < cus.length)
        { 
            if (!assignSQLstr.equals(""))assignSQLstr +="\nUNION\n";
            assignSQLstr += "SELECT  Announcement.postdate, Announcement.title,  Announcement.content,  Announcement.format, AppUser.firstname, Course.title as courseTitle, Announcement.courseid, Announcement.uid, AppUser.lastname as mid, attach  FROM Announcement, AppUser, Course WHERE AppUser.id = Announcement.uid AND Announcement.courseid=Course.id AND uid='" + iida[j].replaceAll("'","''") + "' AND Course.id='" + cus[j].replaceAll("'","''") +"' " +  searchrange ;
        }
     }
     if (!assignSQLstr.equals(""))assignSQLstr +="\nUNION\n";
     assignSQLstr += "SELECT   Announcement.postdate, Announcement.title, Announcement.content, Announcement.format, AppUser.firstname, '" + heading +"' as courseTitle, Announcement.courseid, Announcement.uid,  AppUser.lastname as mid , attach   FROM Announcement, AppUser WHERE AppUser.id = Announcement.uid AND  Announcement.courseid='' AND (Announcement.uid='" + iids.replaceAll(";", "' OR Announcement.uid='") + "') " +  searchrange ;
     assignSQLstr +="\nUNION\n";
     assignSQLstr += "SELECT  Announcement.postdate, Announcement.title, Announcement.content, Announcement.format, AppUser.firstname, '" + Toolbox.emsgs(orgnum,1109) +"' as coursetTitle,Announcement.courseid, Announcement.uid, AppUser.lastname as mid , attach  FROM Announcement, AppUser WHERE AppUser.id = Announcement.uid AND (Announcement.department ='' OR Announcement.department ='" +  department.replaceAll(",","' OR Announcement.department='")
            +"') AND (Announcement.roles mod (2 * " + Systemroles.STUDENT + "))  >= " + Systemroles.STUDENT + " AND Announcement.courseid='' " + searchrange ;
     assignSQLstr +=" ORDER BY  6,7,1";    
    }
    else
    {
       for ( int j =0; j < iida.length && j < ins.length; j++) 
       {
         if ( (","+optv).indexOf("," + iida[j] + ",") < 0)
         {    
            optv +=  iida[j] +","; 
            optc +=  ins[j] + ","; 
         }
       }
       String iidstas = optv + "," + tas;
       assignSQLstr  = "SELECT   Announcement.postdate, Announcement.title, Announcement.content, Announcement.format, AppUser.firstname, '" + courseTitle +"' as courseTitle, Announcement.courseid, Announcement.uid,  AppUser.lastname as mid , attach   FROM Announcement, AppUser WHERE AppUser.id = Announcement.uid AND (Announcement.courseid='' " + (courseid.equals("")?"":" or Announcement.courseid='" + courseid +"'") +") AND (Announcement.uid='" + iidstas.replaceAll(",", "' OR Announcement.uid='") + "') " +  searchrange ;
       assignSQLstr +=" ORDER BY courseid, postdate";
 
    }
    opts = optc.replaceFirst(",$","") + ";" + optv.replaceFirst(",$",""); 
        
     
        n = adapter.executeQuery(assignSQLstr);
      
        if (n<1)
        {
              if (dowhich == 'a') 
             { 
                 out.println("<tr><td colspan=2 style=color:purple>" + Toolbox.emsgs(orgnum,869) +  "</td></tr>");
             }
             else 
             { 
                 out.println("<tr><td align=right> <!-- SEARCH --></td><td width=4>" +   "&nbsp;</td></tr>");
             }
        }
        String oldcis = "";
        
        Vector v = new Vector();
        for (int i = n-1; i >= 0; i--) {
            String atitle =  adapter.getValueAt(i, 5); if (atitle==null) atitle="";
            String format =  adapter.getValueAt(i, 3); if (format==null) format="1";
            String topic =   adapter.getValueAt(i, 1); if (topic==null) topic="";
            String ptime =   adapter.getValueAt(i, 0); if (ptime==null) ptime="" + (System.currentTimeMillis()/1000-200000);
            String from = Toolbox.makeFullName(adapter.getValueAt(i,8),"", adapter.getValueAt(i, 4));
            String uid = adapter.getValueAt(i, 7);
            id2name.put(uid, from);
            String X[] = Toolbox1.attaget(adapter.getValueAt(i, 9), i + N0, null, orgnum);
            String attach = X[0] ;//Toolbox1.unzip(adapter.getValueAt(i, 9)).replaceAll("([^@]+)@[0-9]+@([^,]+,)", "<span style=color:blue onclick=\"openpicorfile('$2','$1',this)\" >$1</span>&nbsp;&nbsp;");
            if (v.contains(uid+ptime)) continue;
            v.add(uid+ptime);
            if (uid==null) uid="";
            else uid = uid.replaceAll("'","\\'").replaceAll("\"","\\\"");
            if (!atitle.equals(oldcis) && subdb.equals("")) 
            {
                out.print(title1(atitle,i==n-1,2,subdb,cachedstyle.fontsize, orgnum, cachedstyle));
            }
            else out.print(sepa);
            oldcis = atitle;
            if (i==n-1&&!subdb.equals(""))out.println(title1( Toolbox.emsgs(orgnum,1237),true,2,subdb,cachedstyle.fontsize, orgnum, cachedstyle));
            %>
            
            <tr><td> 
            <% if (X[1]!=null && !X[1].equals("")){%>       
                    <style type="text/css"><%=X[1]%></style>
               <%}%>
             
            <script type="text/javascript" >document.write(round1('100%'));</script>
            <table  id="ann<%=n-1-i%>" width=100% cellpadding=1 cellspacing=1 class=outset3 >
            <tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>" >
            <td width=40%  <%{%>  onclick="sort(this,0)"  <%}%> ><p style="margin:0px 0px 0px 5px"><b><NOBR><%=topic%></NOBR></b></td>
            <td width=20%  <%{%>  onclick="sort(this,1)"  <%}%> ><NOBR><%=Toolbox.timestr(Integer.parseInt(ptime), cachedstyle.timeformat).replaceAll(" ","&nbsp;")%></NOBR></td>
            <td width=4%><NOBR><%=Toolbox.emsgs(orgnum,1506).replaceFirst(":.*", "")%></nobr></td>
                <td width=16%  <%{%>  onclick="sort(this,3)"  <%}%> > <NOBR><%=from%></NOBR></td>
                <td width=20% align=right><b>
                 <% if (sid.equals(user.id)){%>   <input type=button class=GreenButton  style="overflow:visible" onclick="javascript:compose('<%=Toolbox.emsgs(orgnum,626)%>'+ ' <%=topic.replaceAll("'","\\\\'").replaceAll("\"","")%>','<%=uid%>','<%=from.replaceAll("'"," ")%>')" value="<%=Toolbox.emsgs(orgnum,618)%>"  > <%}%>
           </b></td>
        </tr>
        <tr bgcolor=<%=cachedstyle.TBGCOLOR%>><td colspan=5<%
            if (format.equals("LaTeXML") || format.equals("2"))
            {
               needtranslator = true;
            }
            out.print("><table width=100% ><tr><td><img src=\"image/clip.png\" width=28 >" + attach + "</td></tr></table>" + Toolbox1.todiv(orgnum,Toolbox.formatstr(format,adapter.getValueAt(i,2)), i+N0)  );
             
            %>

            </td></tr>
            </table><script type="text/javascript" >document.write(round2);</script>
            </td></tr>
    <%
             
     } //end for  %> <script type="text/javascript" >var an = <%=n%>;</script> <%
}//end dowhich
adapter.close();
 
     String allids[] =  ( iids).replaceFirst("^;","").replaceFirst(";$","").split(";");
  String allnames[] = ( inames).replaceFirst("^;","").replaceFirst(";$","").split(";");
  int dindex[] = new int[allids.length]; 
  dindex[0] = 1; 
  for (int i = 1; i < allids.length ; i++)
  {
      dindex[i] = 1; 
      for (int j=0; j < i; j++) 
      if (allids[j].equals(allids[i]))
      {
          dindex[i] = 2;
          break;
      }
  }
  String dis = "", din = "";
  for (int i = 0; i < allids.length ; i++)
  {
      if (dindex[i] == 1)
      {
          dis += "," + allids[i] ;
          din += "," + allnames[i] ;
      }
  }
  if (dis.length()>0) 
  {
      dis = dis.substring(1);
      din = din.substring(1);
  }
  
    %>
</table>
    <table cellpadding="0" cellpadding="1"><tr><td>
    <form rel=opener name=form2 method=post target=searchwn action=DataSelect  >
        <input name=rdap type=hidden value="messagesS0" >
        <input name=sid type=hidden value="<%=sid%>">
        <input name=fullname type=hidden value="<%=fullname%>">
        <input name=ta type=hidden value="<%=tas%>">
        <input name=iids type=hidden value="<%=dis.replaceAll(",",";")%>">
        <input name=iid type=hidden value="<%=iid.replaceAll(",",";")%>">
        <input name=department type=hidden value="<%=department%>">
        <input name=courses type=hidden value="<%=courses%>">
        <input name=iname type=hidden value="<%=iname.replaceAll(",",";")%>">
         <input name=inames type=hidden value="<%=din.replaceAll(",",";")%>">
        <input name=subdb type=hidden value="<%=subdb%>">
        <input name=coursetitle type=hidden value="<%=courseTitle%>">
        <input name=courseid type=hidden value="<%=courseid%>"> 
    </form>
    </td><td>
    <form rel=opener name=form3 method=post  target=_blank action=DataForm  >
        <input name=rdap type=hidden value="messageTo" >
        <input name=numrows type=hidden value="1">
        <input type=hidden name=from >
        <input type=hidden name=sid >
        <input type=hidden name=postdate >
        <input type=hidden name=subdb>
        <input type=hidden name=subject>
        <input type=hidden name=ids value="">
        <input type=hidden name=idn value="<%=thisiid%>">
        <input type=hidden name=onsaved>
        <input type=hidden name=onbegin>
        <input type=hidden name=cellonblur>
    </form>
    </td></tr></table>
    <script type="text/javascript" >
    var msg1407 = "<%=Toolbox.emsgs(orgnum,1407)%>";
    var msg1135 = "<%=Toolbox.emsgs(orgnum,1135)%>";
    var msg1136 = "<%=Toolbox.emsgs(orgnum,1136)%>";
    var tstmp = <%=tstmp%>;
    var thisrole = '<%=thisrole%>';
    var uid = "<%=user.id%>"; 
    var studentid = "<%= sid!=null?sid:""%>"; 
    var iid = "<%= iid!=null?iid:""%>"; 
    var ta = "<%=tas%>";
    var courseid = "<%=courseid%>";
    var courseTitle = '<%=courseTitle%>';
    var optionslist = ( "<%=dis%>".replace(/;/,',') + ";" + "<%=din%>".replace(/;/,',') ).replace(/^;/,"").replace(/;$/,"");
     
        <%if (!sid.equals(user.id)) {%>
       
        var email = "myprompt(textmsg[778],null,\"if(v){f1.action='Email';f1.target='w'+tstmp;visual(f1);f1.submit();}\")";

        <%} else {%>
        var email = "";
        <%}%>
        function getSname(iid)
        {
          <%if (sid.equals(user.id))
            {%> 
                return nameto(iid);
            <%}else{%> 
                return parent.leftwinmoniter.getname();
            <%}
          %>
        }
        var allopts =   "<%=opts%>";
        var subdb = '<%=subdb%>';
     var id2name = [];
     <% 
         for (String tid : id2name.keySet()) 
         out.println("id2name['" + tid + "'] = \"" + id2name.get(tid) + "\";"); 
     %>
     var needtranslator = true;
     var font_size = <%=cachedstyle.fontsize%>;
     var msg610 = "<%=Toolbox.emsgs(orgnum,610)%>";
     <% if (statusstr.indexOf("setaccessible") >=  0) {%> 
     if (typeof(parent.frames[0].setaccessible) != 'undefined')
     <%=statusstr%>
    <%}%>
   
     var msg1504 = "<%=Toolbox.emsgs(orgnum,1504)%>";   
     var msg151 = "<%=Toolbox.emsgs(orgnum,151)%>";
     
buildactmenu = function()
{
    recurainput(document.getElementsByTagName('table')[0]);
}     
    </script>    

<script type="text/javascript"  src=resizeframe.js></script>
<script type="text/javascript"  src=curve.js></script>
<script type="text/javascript"  src=attachment.js></script>
<script type="text/javascript"  src=studentannounce.js></script>
<iframe name="w<%=tstmp%>" style="visibility:hidden" width="1" height="1" />
</body>
</html>
