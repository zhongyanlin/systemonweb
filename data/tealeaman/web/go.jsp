<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*,java.io.*,java.util.concurrent.atomic.*" %>
<%! 
String tmsg(int [] a)
{
    String s = "";
    for (int i=0; i < a.length; i++)
      s += "var msg" + a[i] + "=\"" + Toolbox.msg[a[i]].replaceAll("\"", "\\\"")  +"\";\n";
   
    return s;
}
String touni(String x)
{
    Pattern p = Pattern.compile("&#([0-9]+);");
    StringBuffer b = new StringBuffer();
    Matcher m = p.matcher(x);
    int e = 0;
    while (m.find(e)) 
    {
        int s = m.start();
        b.append(x.substring(e,s));
        e = m.end();
        int y = Integer.parseInt( x.substring(s+2,e-1));
        b.append("\\u" + String.format("%x", y));
    }
   return b.toString() + x.substring(e);
}

%>
         
<%
int orgnum = Toolbox.setcharset(request,response);
if (orgnum == -1) orgnum = Toolbox.langnum<<16; 
 
String gokeyword[] = Toolbox.emsgs(orgnum,1518).replaceAll("\n","").split(",");
 
//if (lang.equals("cn")) gokeyword  = c1518.replaceAll("\n","").split(",");
String username = Toolbox.defaultParam(orgnum,request, "username", null);
String password = Toolbox.defaultParam(orgnum,request, "password", null);
String email = Toolbox.defaultParam(orgnum,request, "email", null);
String err = null; 
if (username!=null && password!=null && email!=null)
{
    if (email.replaceAll("[0-9]","").equals("") && password.replaceAll("[0-9]","").equals("") )
    {
        User user = (User)session.getAttribute("User");
        if (email.equals("2") && user!=null)
        {
            String sql = "UPDATE Gogame SET result='" + user.id + "', stones='" + username + "' WHERE id=" + password;
            JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
           
            adapter.executeUpdate(sql);
             if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
} if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
            adapter.close();    
        }
        else if (email.equals("3") && user!=null)
        { 
            String sql = "SELECT id, playera, playerb, stones, result,preference FROM Gogame WHERE playera='" + user.id + "' OR playerb='" + user.id + "' ORDER BY id";
            JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
         
            int nn = adapter.executeQuery(sql);
               if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
            String s = ""; 
            
            for (int i=0; i < nn; i++)
            {
                String f = adapter.getValueAt(i,5);
                if (f.equals("1")) f = "<img src=image/whitestone.png style=margin:0px;border:0px;width:16px >";
                else f = "<img src=image/blackstone.png style=margin:0px;border:0px;width:16px >";
                String b = "<b>", c="";
                if (adapter.getValueAt(i,2).equals(""+adapter.getValueAt(i,4))){b = "";c="<b>";}
                String a = adapter.getValueAt(i,1).equals(""+adapter.getValueAt(i,4))?adapter.getValueAt(i,2):adapter.getValueAt(i,1);
                String d = adapter.getValueAt(i,1).equals(user.id)?"1":"0"; 
                s += "<nobr>" + Toolbox.timestr(Long.parseLong(adapter.getValueAt(i,0))/1000) 
                         + "</nobr>@\\\"<table cellspacing=0><tr><td>" + b + adapter.getValueAt(i,1) +  b.replaceFirst("<", "</") +"</td><td>"+ f + "</td></tr></table>\\\"@" + c + adapter.getValueAt(i,2) + c.replaceFirst("<", "</") + "@\\\"" + 
                         "<a href=javascript:openrestore(" + adapter.getValueAt(i,0) + ",'"+ a + "','" + adapter.getValueAt(i,3) + "'," + d + "," +   adapter.getValueAt(i,5) + ")><nobr>" + gokeyword[9] + "</nobr></a>\\\"@\\\"<a href=javascript:deletegame(" + adapter.getValueAt(i,0) + ")><nobr>" + gokeyword[13] + "</nobr></a>\\\";"; 
            }
            if (nn<=0) 
                out.println("<!doctype html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body><script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=text/javascript  src=" + Toolbox.getUserLang(orgnum) + "></script><script type=text/javascript  src=cookie.js></script><script>parent.myprompt('No record');</script></body></html>");
            else
                out.println("<!doctype html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body><script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=text/javascript  src=" + Toolbox.getUserLang(orgnum) + "></script><script type=text/javascript  src=cookie.js></script><script>var s = \"" + s +"\";\nvar y = new CSVParse(s.replace(/.$/,''),'\"','@',';');\n parent.myprompt('<div style=padding:4px>'+y.tohtml() + '</div>');</script></body></html>");
            adapter.close();  
            return;
        }
        else if ((email.equals("0") || email.equals("1")) && user!=null)
        {
            boolean done = false;
            JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
           
            String sql;
            int kk;
            for (int jj=0; jj < 2; jj++)
            {
                sql = "INSERT INTO  Gogame(lastupdate, id, playera, playerb, preference, stones, result) VALUES(" + (new java.util.Date()).getTime()/1000
                        + "," + password + ",'" + user.id + "','" + username + "','" + email + "','',NULL)";
                kk =  adapter.executeUpdate(sql);
                
                if (kk == 1) break;
                sql = "CREATE TABLE IF NOT EXISTS  Gogame(lastupdate BIGINT, id BIGINT, playera VARCHAR(30), playerb VARCHAR(30), preference  VARCHAR(10), stones TEXT, result  VARCHAR(30), PRIMARY KEY (id) )";
                int sindex = Toolbox.begintranslate("mysql");
                int tindex = Toolbox.begintranslate(adapter.dbms);
                kk =  adapter.executeUpdate(Toolbox.translateStr(sql,sindex,tindex));

            }
            adapter.close();
        }
        else if (email.equals("4") && user!=null)
        {
            String sql = "DELETE FROM Gogame WHERE id=" + password;
            JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
            
            int kk =  adapter.executeUpdate(sql);
           
            adapter.close();
            out.println("<!doctype html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body><script>parent.allgames();</script></body></html>");
            return;
        }
        else   out.println("<!doctype html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body><script>document.location.href='login.jsp';</script></body></html>");
    }
    else if ( CaptchaServlet.passed(request) == false)
    {
          err = gokeyword[62]; 
    }
    else  
    {
        JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
       
        if (1!=adapter.executeUpdate("INSERT INTO AppUser (lastupdate,id,password,roles,lastname,middlename,firstname,email) values (" 
                + (System.currentTimeMillis()/1000) + ",'" + username.replaceAll("'","") + "','"
                + password.replaceAll("'","''") + "',0,'go','game','player','" + email.replaceAll("'","''") + "')"))
        {
             err = gokeyword[63];  
        }
        else
        {
             User user = new User(orgnum); user.id=username; user.firstname = "Player"; 
             user.retr();
             session.setAttribute("User", user);
             adapter.close();
             err = gokeyword[64]; 
             out.println("<!doctype html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body><script>parent.myprompt('" +  err + "');</script></body></html>");
             return;   
        }
         adapter.close();
    }
   
    if (err!=null)
    out.println("<!doctype html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body><script>parent.regerror(\"" +  err + "\");</script></body></html>");
    return;    
}
else if (username==null && password==null && email==null)
{
    
}
else 
{
    err = gokeyword[65]; 
    out.println("<!doctype html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body><script>parent.myprompt('" + err + "');</script></body></html>");
    return;
}
 
int fontsize =  18;
int fvwidth = 200 + Math.round(fontsize/8*200);
long tstmp = System.currentTimeMillis()%10000000;
String charcolor = "purple"; 
String url =  Toolbox1.geturl(request).replaceFirst("\\?.*","")  ;
int sek = SessionCount.enq(session.getId());
 
int STONESIZE = 28;
int CELLSIZE = 30;
 
String playername =  gokeyword[51] + sek;
User user = (User)(session.getAttribute("User"));
if (user != null) playername = user.id;
 %>
<!DOCTYPE html>
<html  lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%><title><%=gokeyword[48]%></title>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("gradeindex.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
 
<%=Toolbox.unifontstyle(fontsize,orgnum) %>
<style type="text/css">
table tr td  form div  table tr td{white-space:nowrap}
#allgame tr td{white-space:nowrap}
h3{margin-top:2px;margin-bottom:2px}
.label2{background-image:<%="linear-gradient(" + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ")"%>;background-color:<%=cachedstyle.IBGCOLOR%>;color:#DDCC11;font-weight:bold}
textarea {width:<%=Math.round(fvwidth-4.5*fontsize)%>px;height:<%=Math.round(6*(6+fontsize))%>px;font-size:<%=fontsize%>;border:1px #b0b0b0 solid!important}
input.radio{width:15px;background-color:transparent }
input.text{background-color:<%=cachedstyle.TBGCOLOR%>;border:1px #b0b0b0 solid;border-radius:3px; }
</style>
<script type="text/javascript"  src="attachment.js"></script> 
<script type="text/javascript"  src="setting.js"></script> 
<style>
select option{background-color:<%=cachedstyle.DBGCOLOR%> }
.stone{border-radius:<%=(STONESIZE/2)%>px;width:<%=(STONESIZE)%>px;height:<%=(STONESIZE)%>px;border:0px}
.shade{background:liner-gradient(#dfabdc,#998899);font-size:16px}
</style> 
</head>
<body style="font-size:<%=fontsize%>px;background-color:<%=cachedstyle.DBGCOLOR%>;margin:6px 6px 6px 6px !important" >
<table cellspacing=0 cellpadding=0>
    <%= Toolbox.title("<table align=center style=vertical-align:middle><tr><td valign=middle>&nbsp;&nbsp;&nbsp;&nbsp;<img src=image/qu1.png height=40>&nbsp;</td><td  valign=middle style=font-size:40px >" +gokeyword[48] + "</td></tr></table>" , 2) %>
    <% for (int i=0; i < 0; i++)  out.print( i + " " + gokeyword[i]  + "<br>"); %>
    <tr>
        <td valign=top>
            <div id=a style="margin:2px 1px 1px 2px;padding:0px;background:url(image/lumber.jpg);border-radius:4px;width:660px;height:636px"></div>
        </td>
        <td valign=top align=center width="<%=CELLSIZE*10.5%>">
            <form rel=opener name=f style="margin:0px 0px 0px 0px"  >
                <div class="outset3 shade" style="margin:1px 1px 3px 1px"> 
                   
                       <input name="filesel" type="file" onchange="doupload(this)" style="width:1px;visibility:hidden">
                       <a href="javascript:help()"><%=gokeyword[11]%></a>|<a 
                           href="javascript:demo()" ><%=gokeyword[5]%></a>|<a  
                               href="javascript:rand()"><%=gokeyword[6]%></a>|<a
                  href="javascript:slow()"><%=gokeyword[10]%></a>|<!--a href="javascript:login()"><%=gokeyword[70]%></a> |
                       <a href="javascript:logout()"><%=gokeyword[71]%></a> |
                       <a href="javascript:register()"><%=gokeyword[58]%></a--><a 
                        href="javascript:gamelist()"><%=gokeyword[86]%></a>|<a 
                            href="javascript:save()"><%=gokeyword[8]%></a>|<a 
                           href="javascript:restore()"><%=gokeyword[9]%></a>
                     
               </div>      
                 
               <div id=playerdiv  style="border:0px;padding:0px 0px 0px 0px;overflow:scroll;color:<%=charcolor%>;margin:1px 1px 3px 1px;border-radius:3px;">
                      
                      <table id="players" class="outset3" width="100%" border="1" cellspacing="3" cellpadding="3" style="margin:0px 0px 0px 0px;border-radius:3px;border-collapse: collapse">
                          <tr >
                              <td align="right" colspan="1" onclick="sort(0,1)"><%=gokeyword[75]%></td>
                              <td align="left"  onclick="sort(1,0)"><%=gokeyword[76]%></td>
                              <td align="left"  onclick="sort(2,0)"><%=Toolbox.emsgs(orgnum,1517).split("@")[6]%></td>
                              <td align="left"  onclick="sort(3,1)"><%=gokeyword[77]%></td>
                              <td style="white-space: nowrap"  align="right"  onclick="sort(4,1)"><%=gokeyword[78]%></td>
                              <td  align="center" id="cord">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                          </tr>
                          <tr>
                            
                              <td  align="right" id="tdid"  ><%=gokeyword[119]%></td>
                              <td  align="left" bgcolor="white"><input id=myname style="border:0px white solid" size="6" value="Jack" onchange="changename(this)"></td>
                              <td  align="left"  bgcolor="white"><select id=type onchange="javascript:go.type=this.selectedIndex"></select></td>
                              <td  align="right"  bgcolor="white"><select id=rank><%for (int i=0; i<=9; i++)out.println("<option value=" + i + ">" + i   +  "</option>");%></select></td>
                              <td  align="right"  bgcolor="white"><select id=timecap><%for (int i=0; i<=20; i++)out.println("<option value=" + i + ">" + i   +  gokeyword[72] +  "</option>");%></select></td> 
                              <td  align="center"><input id=newbtn class=GreenButton style="width:<%=4.5*fontsize%>px" value="<%=gokeyword[27]%>" onclick="joinorquit(this)"  type=button > </td>
                          </tr>
                      </table>   
               </div> 
               <div   style="color:<%=charcolor%>;margin:1px 1px 3px 1px;border-radius:3px;">
                  <table id=scores class="outset3" width="100%" cellspacing=1 cellpadding="3" border="1" style="border-radius:3px;border-collapse: collapse">
                       <tr>
                           <td  align=center width="20%"> <%=gokeyword[82]%></td>
                           <td align=left  width="20%"><%=gokeyword[73]%></td>
                           <td  style="white-space:nowrap" align="right"  width="20%"><%=gokeyword[83]%></td>
                           <td   style="white-space:nowrap" align="right"  width="20%"><%=gokeyword[84]%></td>
                           <td   style="white-space:nowrap" align="right"  width="20%"><%=gokeyword[85]%></td>
                        </tr>
                       <tr>
                           <td  align=center width="<%=CELLSIZE%>">
                              <div id=myclr class=stone style="background-color:black;width:<%=CELLSIZE-4%>px;height:<%=CELLSIZE-4%>px" onclick="usethiscolor(this)"></div>
                           </td>
                           <td align=left id=myname1> </td>
                           <td   align="right" id="mycount">0</td>
                           <td   align="right" id="mysecond">0</td>
                           <td   align="right" id="myminute">0</td>
                        </tr>
                        
                       <tr>
                           
                           <td align=center  width="<%=CELLSIZE%>">
                                <div id=hisclr  class=stone style="background-color:white;width:<%=CELLSIZE-4%>px;height:<%=CELLSIZE-4%>px" onclick="usethiscolor(this)" ></div>
                           </td>
                           <td align="left" id=hname> </td>
                           <td   align="right" id="hcount">0</td>
                           <td   align="right" id="hsecond">0</td>
                           <td   align="right" id="hminute">0</td>       
                       </tr>
                      
                       <tr> 
                           <td align="center" onclick=usethiscolor(this)><%=gokeyword[81]%></td>
                           <td><input name=count class=OrangeButton style=width:<%=4.5*fontsize%>px  type=button value="<%=gokeyword[14]%>" onclick=countswitch(this)>
                        </td> 
                           <td  align="right" id="gcounter"> </td>
                           <td   id="result"> </td>
                           <td   align="center">  
             <input id=watch class=OrangeButton style=width:<%=4.5*fontsize%>px;float:right  type=button value="<%=gokeyword[111]%>" onclick=watchgame(this) >                          
                           </td>
                         
                       
                       </tr>
                   </table>
                
               </div>  
                           
               <div class="outset3 shade" id="plate" style="margin:1px 1px 1px 1px;">
                   <table   width=99% >
                       <tr id="mywordline">
                           
                           <td><input name=myword id=myword value=""  class=text onfocus="if(this.value='<%=gokeyword[12]%>')this.value=''"  style="width:<%=CELLSIZE*5.5%>px;" ></td>
                           <td><input name=sendbtn class=GreenButton style=width:<%=4.5*fontsize%>px; type=button value="<%=gokeyword[57]%>" onclick=sendmsg()></td>
                       </tr>
                       <tr>
                           <td  colspan=2 >
                               <div  class="outset3" style="height:150px;overflow:scroll;width:100%;color:purple;border:0px" id=resp></div>
                           </td>
                       </tr>
                   </table>
               </div>
           </form>
        </td>
    </tr>
</table>
<script>
let cachedfontname = '<%=cachedstyle.fontname%>';
if (localStorage['myfontname'] != null)
    cachedfontname = localStorage['myfontname'];

const gokeyword = "<%=Toolbox.emsgs(orgnum,1518).replaceAll("\n","")%>".split(/,/);
const gogamehelp = '<%=Toolbox.emsgs(orgnum,1519).replaceFirst("\\.$","")%>.';
const msg1520 = '<%=Toolbox.emsgs(orgnum,1520)%>';
const msg1521 = '<%=Toolbox.emsgs(orgnum,1521)%>';
const msg1522 = '<%=Toolbox.emsgs(orgnum,1522)%>';
const msg1523 = '<%=Toolbox.emsgs(orgnum,1523)%>';
const msg1614 = '<%=Toolbox.emsgs(orgnum,1614).replace("\n"," ")%>';
const msg64 = "<%=Toolbox.emsgs(orgnum,64)%>";
const theurl = "<%=url%>";
const tstmp = <%= tstmp %>;
const timeformat = 'YYYY-MM-DD hh:mm:ss';
const haswebfolder=<%=user!=null && (user.websitename != null && !user.websitename.equals("")||user.webFileFolder != null && !user.webFileFolder.equals("")) %>;
const CELLSIZE = <%= CELLSIZE %>;
const jsfollows = "<%=(new Encode6b(orgnum)).to6b("parent.setplayname();") %>";
const inf71 = "<%=gokeyword[71]%>?";
const langu = "<%=Toolbox.langs[orgnum>>16]%>"; 
const langname = "<%=  (Toolbox.locales[orgnum>>16].langname)%>";
const enlang = [<% for (int i=0; i < Toolbox.langs.length; i++){if (i>0) out.print(",");out.print("'"+Toolbox.langs[i] +"'");}%> ];
const unic = [<% for (int i=0; i < Toolbox.langs.length; i++){if (i>0) out.print(",");out.print("'"+Toolbox.locales[i].langname+"'");}%> ];
var ORGNUM = <%=orgnum%65536%>;
const msg358 = "<%=Toolbox.emsgs(orgnum,358)%>";
const allfonts = '<%=Toolbox.emsgs(orgnum,1497)%>'.split(/;/); 
 
</script>
<script src="go2.js"></script>

<script type="text/javascript"  src="curve.js?sn=30&dn=20"></script>
 <audio  id="soundalert" autostart=false src="image/sound.wma"  preload="auto"></audio>
 <audio  id="soundstone" autostart=false src="image/placestone.mp3"  preload="auto"></audio>
<iframe width="1" height="1" name="w<%=tstmp%>" style="visibility:hidden"/>
</body> 
</html>

