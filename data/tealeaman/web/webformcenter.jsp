<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.io.*,java.util.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
    User user = (User)(session.getAttribute("User"));
%>

<%!
 
String title(String str, int col)
{
      return "<tr align=center height=42><td colspan=" + col + "   class=outset2 align=center><div class=forcurve1 style=color:#DDCC11><font  size=+2><b><NOBR>" + str + "</NOBR></b></font></div></td></tr>";
}
String fields(String str)
{
  return "<td><font color=#DDCC11><b><nobr>"  + str + "</nobr></b></font></td>";
}
 Object forlock = new Object();
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
  
<%
long tstmp = System.currentTimeMillis() % 10000000;
if ( Toolbox.dbadmin[orgnum%65536].phase < 3)
{
%></head><%
Toolbox.println(1, Toolbox.langs[orgnum>>16]);
%>
 <jsp:forward page="cfgdb.jsp"  />
<%
return;
}
String filename = Toolbox.installpath + File.separator + "formlist" + (orgnum%65536) + ".js";
      if (   (new File(filename)).exists() == false)
      {
         File f = new File(filename.replaceFirst(".js$", "1.js"));
         if (f.exists())
         {
              synchronized(forlock){  f.renameTo(new File(filename)); }
         }
         else
         try
         {
             FileWriter fw = new FileWriter(filename);
             fw.write("var z = new Array();\n");
             fw.close();
         }
         catch(Exception e){}
      }
 
 
if ( user == null|| !Toolbox.verifytoken(request))
{
String style =Toolbox.butstyle(16).replaceFirst("background:[^\\)]+\\);", "");

%>
 
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("webformcenter.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript"  src=sha1.js ></script>
<script type="text/javascript" >
var encoding = '<%=Toolbox.encodings[orgnum>>16]%>';var langcode = "<%= Toolbox.langs[orgnum>>16]%>";
var blnum = 0, blnum0=0;
var tmg82 = '<%=Toolbox.emsgs(orgnum,82)%>', tmg995 = '<%=Toolbox.emsgs(orgnum,995)%>';
var sessionid = "<%=session.getId()%>";
function updateSessionid(newsid){sessionid = newsid;}
var oldid = '';
document.write(unifontstyle(16));
var indexpage = true;
function block(title,width)
{
   if (width!=null) width = " width=" + width;
   else width= "";
   var str = '<table ' + width + '   cellpadding=1 cellspacing=0 >';
   str += '<tr height=30><td align=center width=100% class=outset2 style="background:linear-gradient(<%=cachedstyle.IBGCOLOR%>,<%=Toolbox.headercl(cachedstyle.IBGCOLOR)%>);border:1px   outset" ><table align=center 100% cellpadding=0 cellspacing=0><tr><td  align=center ><div class=forcurve2 style="color:#DDCC11;" ><b><nobr>'+ title +'</nobr></b></div></td></tr></table></td></tr>';
   str+='<tr><td class="outset1" style="border:1px #DDDDDD outset">';
   return str;
}
var blockclose = '</td></tr></Table>';

</script>

<title><%=Toolbox.emsgs(orgnum,43)%></title>
<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<style type="text/css"> 
 
@keyframes  logorot
{
    0% {transform:rotate(0deg)}
    8% {transform:rotate(30deg)}
    16% {transform:rotate(60deg)}
    24% {transform:rotate(90deg)}
    33% {transform:rotate(120deg)}
    41% {transform:rotate(150deg)}
    50% {transform:rotate(180deg)}
    58% {transform:rotate(210deg)}
    66% {transform:rotate(240deg)}
    75% {transform:rotate(270deg)}
    83% {transform:rotate(300deg)}
    91% {transform:rotate(330deg)}
    100% {transform:rotate(360deg)}
}
@keyframes logorot1
{
    0% {transform:rotate(0)}
    10% {transform:rotate(2deg)}
    100% { transform:rotate(-360deg)}
}
@keyframes logorot2
{
    0% {transform:rotate(0)}
    10% {transform:rotate(2deg)}
    100% { transform:rotate(360deg)}
}
    
A:link
{
    COLOR: blue;
    font-weight:800;
    TEXT-DECORATION: none
}
A:visited
{
    COLOR: purple;
    font-weight:800;
    TEXT-DECORATION: none
}
A:hover
{
    COLOR: blue;
    font-weight:800;
    TEXT-DECORATION: underline
}
.outset2{border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;background:linear-gradient(<%=cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR)%>);border:2px #C25314 outset;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;}
input.box {border:1px #b0b0b0 solid!important;font-size:16px;padding:2 2 2 2}
.withbg{background:<%=Toolbox.dbadmin[orgnum%65536].bgimage%>  <%=cachedstyle.DBGCOLOR%>}
.label{color:#DDCC11;font-weight:700}
.floatLeft{float: left;}
.floatRight{float: right;}
.image-left{float: left; vertical-align: text-top;}
.image-right{float: right; vertical-align: text-top;}
div.wrapContainer{float:left;}
.colhead{background-color:lightyellow;font-weight:700}
</style>

</head>
<body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:0px 0px 0px 0px">

<table  cellpadding="0" cellspacing="0" align=center><tr>
<td style="background:url(image/zz1.png) repeat-y" width=5></td>
<td>
<table width=800 align=center cellpadding="0" cellspacing="8" border="0" bgcolor=<%=cachedstyle.IBGCOLOR%> >
  <tr height=100 >
    <td colspan=2 class=outset2 style="background:linear-gradient(<%=cachedstyle.IBGCOLOR%>,<%=Toolbox.headercl(cachedstyle.IBGCOLOR)%>);border:1px   outset  ">
      <table align=center cellpadding="0" cellspacing="0">
        <tr height=100>
          <td width=100 align=left>
            <div  style="background-color:<%=cachedstyle.BBGCOLOR%>;position:relative;width:76px;height:76px;border-radius:38px;border:1px <%=cachedstyle.IBGCOLOR%> inset"   onclick="biggerqrcode()">
 <img id="logo1" height=70 width=70 src=image/tm2.gif style="position:absolute;border:0px;top:0px;left:0px;animation:logorot1 5s infinite"  >
 <img id="logo2" height=70 width=70 src=image/tm1.gif style="position:absolute;border:0px;top:0px;left:2px; ">
  </div>
          </td>
          <td width=580 align=center>
            <div class="forcurve1" style="color:#DDCC11"><nobr>
              <%= ((Toolbox.dbadmin[orgnum%65536].unitname[orgnum>>16]!=null && Toolbox.dbadmin[orgnum%65536].unitname[orgnum>>16].equals("")==false)?
              ("<nobr>" + Toolbox.dbadmin[orgnum%65536].unitname[orgnum>>16].replaceFirst("/.*","")  + "</nobr>"):"")
              %></nobr><br><nobr> <%=Toolbox.emsgs(orgnum,43)%></nobr>
            </div>
            <div style="color:lightyellow;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%>;font-size:16px;font-weight:700;margin:5px">
            <%=Toolbox.emsgs(orgnum,265)%>
            </div>
          </td>
          <td  width=120 align=center>
            <table  cellspacing=0 cellpadding="0" style="margin:0px 0px 0px 0px"><tr> 
               <td>
   <% if (  Toolbox.langs.length>1){%>
   <span style="background-color:<%=cachedstyle.IBGCOLOR%>;color:white;font-size:16px;border:1px #777777 solid;width:100px;" onclick="changeencoding(this,'<%=Toolbox.langs[orgnum>>16] %>')"> <%=  (Toolbox.locales[orgnum>>16].langname)%>&vellip; </span>
   <%}%> </td></tr></table> 
   <div class="outset2" style="border-Radius:6px;color:#DDCC11;font-size:18px;font-weight:700;text-align:center;text-shadow:#707070 -1px -1px;border:2px #555 inset;margin:0px 0px 0px 0px"><%=Toolbox.emsgs(orgnum,1442)%><br>
        <img src=image/tm.png height=33 width=140px  >
   </div> 
         </td>
       </tr>
     </table>
   </td>
 </tr>
 <tr><td colspan=2><table cellpadding=0 cellspacing=0 width=100% >

 <tr height=30>
   <td align=left>
   <script type="text/javascript" >document.write(round1(''));</script>
   <form rel=opener  name="f1" method=post  style="margin:0px 0px 0px 0px;" autocomplete="off" action=login.jsp  target="w<%=tstmp%>" onsubmit="return validate()">
   <table  align=left cellspacing=0 cellpadding=0 border=0>
     <tr>
       <td  class=label>
         <nobr> <%=Toolbox.emsgs(orgnum,190)%> </nobr>
       </td>
       <td>
         <input  style="border:1px #b0b0b0 solid!important;width:80px;font-size:16px"   type="text" name="id" value="" size="1" maxlength="20" tabindex=1>
       </td>
       <td class=label>
         <nobr>&nbsp;<%=Toolbox.emsgs(orgnum,164)%></nobr>
       </td>
       <td >
         <input  style="border:1px #b0b0b0 solid!important;width:120px;font-size:16px"   type="password" name="password1" size="20" maxlength="100" onfocus="stopmodelshow()" tabindex=2>
       </td>
       <td align=center>
         <input   type="hidden" name="follow" value="webformcenter.jsp"><input   type="hidden" name="password"><input type=hidden name=pubkeys><input  type="submit" <%=style%> class=GreenButton     name="submit" value="<%=Toolbox.emsgs(orgnum,39)%>" >
       </td>
       <td>
         <nobr>
           <a href=javascript:forgetpass()> <font color=white><%=Toolbox.emsgs(orgnum,1125)%> </font></a>
         </nobr>
       </td>
    </tr>
  </table>
  </form>
  <script type="text/javascript" >document.write(round2);</script>
  </td>
  <td align=right> <script type="text/javascript" >document.write(round1('100%'));</script>
  <form rel=opener  name="f3" method=post   style="margin:0px 0px 0px 0px;"  action="<%=Toolbox.signuplink[orgnum  >>16]%>"   target="register" onsubmit="return validat(this)">
  <table  align=right cellspacing=0 cellpadding=0 border=0>
  <tr>
  <% if (Toolbox.signuplink[orgnum>>16].indexOf("registerc")>=0){%>
   <td class=label onMouseOver=showmyhint(0) onMouseOut=hidemyhint()>
     <nobr>
     <%=Toolbox.emsgs(orgnum,1238)%></nobr>
   </td>
   <td>
    <input  style="border:1px #b0b0b0 solid!important;width:80px;font-size:16px"   name=code   size="1"  value="1" maxlength="20" tabindex=2>
   </td>
   <%}%>
   <td   align=center>
<input type=hidden name=cellonfocus value=1>
<input type=hidden name=numrows value=1>
<input type=hidden name=onbegin value=21>

 <input  type="submit" <%=style%> class=GreenButton    name="submit" value="<%=Toolbox.emsgs(orgnum,602)%>" >
   </td>
 </tr>
</table>
</form> <script type="text/javascript" >document.write(round2);</script>
</td>
</tr>

</table></td></tr>

<tr>
  <td colspan=2 >
     <script type="text/javascript" >document.write(block('<%=Toolbox.emsgs(orgnum,1232)%>'));</script>
     <table width=100% valign=bottom align=left id="what1" valign=top>
       <tr>
         <td>
<%
 int kk = orgnum>>16;
   if (!Toolbox.locales[kk].hasform)
   {
       kk = Toolbox.langnum;
       if (!Toolbox.locales[kk].hasform)
          kk = 0;
   }   
 String str = Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "conf" + File.separator + Toolbox.langs[kk] + "w.txt";
 File file =  new File(str);
 String aline;
 FileInputStream fin =null;
 InputStreamReader esr = null;
 BufferedReader ebr = null;
 try
 {
     fin = new FileInputStream(file);
     esr = new InputStreamReader(fin);
     ebr = new BufferedReader(esr);
     aline = ebr.readLine();
     out.print("" + aline);
 }catch(Exception e){ }
 %>

         </td>
       </tr>
     </table>
     <script type="text/javascript" >document.write(blockclose);</script>
  </td>
</tr>
<tr>
  <td align=right  width=500px>
    <script type="text/javascript" >document.write(block('<%=Toolbox.emsgs(orgnum,178)%>','100%'));</script>
          <table width=100% style="background-color:<%=cachedstyle.IBGCOLOR%>" cellpadding="1" cellspacing="1">
<%
try{
    int count = 0;
    if (ebr!=null)
    while ((aline = ebr.readLine()) != null)
    {
        count++;
        if (count == 1)
        out.println("<tr height=30><td class=colhead>" + aline.replaceFirst("\\|","</td><td class=colhead ><nobr>").replaceFirst("\\|","</td><td class=colhead><nobr>")  + "</nobr></td></tr>");
        else if(aline.indexOf("|")>0)
        {
           out.println("<tr height=30><td class=colhead><nobr>" +
           aline.replaceAll("\\|", "</td><td class=withbg ><nobr>") + "</nobr></td></tr>");
        }
        else
        {   out.println("<tr height=30><td class=colhead colspan=3><nobr>" + aline + "</nobr></td></tr>");
            break;
        }
    }
    if (fin!=null) fin.close();
 }
 catch(Exception e){out.println(str);}
%>
  </table>
  <script type="text/javascript" >document.write(blockclose);</script>
  </td>

  <td width="300px" align=right valign=top>
    <script type="text/javascript" >document.write(block('<%=Toolbox.emsgs(orgnum,44)%>','100%'));</script>
    <div id="screen" style="background:url(image/index.gif);height:342px;width:300px">
    </div>
    <script type="text/javascript" >document.write(blockclose);</script>
  </td>

</tr>
 

<tr><td colspan=2>
    <table  width=100% valign=top   cellpadding="1" cellspacing=0>
      <tr  height=30>
        <td width=100% class=outset2 style="background:linear-gradient(<%=cachedstyle.IBGCOLOR%>,<%=Toolbox.headercl(cachedstyle.IBGCOLOR)%>);border:1px   outset"  >
          <table align=right cellpadding=0 cellspacing=0>
            <tr>
              <td >
                 <div class=forcurve2 style="color:#DDCC11" id=curve3><nobr><%=Toolbox.emsgs(orgnum,1269)%></nobr></div>
              </td><td width=100 align=right>
                 <nobr><font color="#DDCC11">Order by</font></nobr>
              </td><td>
                <select name="by"  class=box  onchange="orderby(this)">
                 <option value=cat selected>Category</option>
                 <option value=id>ID</option>
                 <option value=title>Title</option>
                </select>
              </td><td  width=100 align=right>
                <input id="pat"  class=box  size=8 name=pat>
              </td><td>
                <input type=button w class=GreenButton style="width:68px" name=patbut value="<%=Toolbox.emsgs(orgnum,37)%>" onclick="javascript:search()">
              </td>
            </tr>
          </table>
          </td>
 </tr>
 <tr >
 <td width=100% class="outset1" style="border:1px #DDDDDD outset"  id="overv0" >
 <table width=100% valign=bottom align=left id="overv" valign=top>
 <tr><td></td></tr>
 </table>
 </td>
 </tr>
 </table>

</td>
</tr>

<tr><td colspan=2>
<table cellpadding=0 cellspacing=0 align=center width=100%  style="background-color:<%=cachedstyle.IBGCOLOR%>">
  <tr>
   <td width=2> <% if (user==null){%>
<script type="text/javascript"  src="login.js"></script><%}%></td>
   <td align=center id="copyright">
   <font size=-1 color=<%=cachedstyle.DBGCOLOR%> ><nobr> <%= Toolbox.copyright[orgnum>>16]%> </nobr></font>
   </td>
  </tr>
</table>
</td></tr></table>
</td><td style="background:url(image/zz3.png) repeat-y" width=5></td></tr></table>

<script type="text/javascript"  src=formlist<%=(orgnum%65536)%>.js></script>
<script type="text/javascript"  src="webformindex0.js" ></script>
<script type="text/javascript"  src="curve.js" ></script>
<script type="text/javascript" >
function changeencoding(spn,encoding)
{
    var enlang = [<% for (int i=0; i < Toolbox.langs.length; i++){if (i>0) out.print(",");out.print("'"+Toolbox.langs[i] +"'");}%> ];
    var unic = [<% for (int i=0; i < Toolbox.langs.length; i++){if (i>0) out.print(",");out.print("'"+ (Toolbox.locales[i].langname)+"'");}%> ];
    var str = "<table width=100 >";
    for (var i=0; i < enlang.length; i++)
        str += "<tr><td onclick=\"choosethislang(this,'" +enlang[i] + "','" + encoding + "'," + i + ")\">" + unic[i] + "</td></tr>";
    str += "</table>";
    var xy = findPositionnoScrolling(spn);
    var dv = document.createElement("div");
    dv.id = 'changecode';
    //dv.className = 'outset2';
    dv.style.cssText = "background-color:<%=cachedstyle.IBGCOLOR%>;color:white;width:100px;position:absolute;top:" + xy[1] + "px;left:" + (xy[0]-20) 
    +"px;border:1px #666666 solid";
    dv.innerHTML = str;
    document.body.appendChild(dv);
}
 
function choosethislang(td, encoding, encoding0,i)
{
    
    if (encoding==encoding0) 
    {
        document.body.removeChild(document.getElementById('changecode'));
        return;
    }
    else
    {
        var newnum = (i<<16) + <%=orgnum%65536%>;
        SetCookie("orgnum", ""+newnum);
        
        if (typeof(eid)=='undefined' || eid==null)
            document.location.href='webformcenter.jsp?orgnum=' + newnum;
        else
            document.location.href='webformcenter.jsp?orgnum=' + newnum + '&eid=' + eid;
    }
}                    
    
var modelp = new Array(20);
for (var i=0; i < 20; i++)  modelp[i] = "image/models/f" + (i+1) +".jpg";
</script>
<script type="text/javascript"  src="slidemove0.js" ></script>
</body>
<%
}
else
{
%>
</head> 
<frameset cols="228,*" border=0px>
<frame name=leftwinta scrolling="no"  src="webformindex.jsp" />
<frame name=rightwinta scrolling="yes"    />
</frameset>
<%
}
%>
</html>
