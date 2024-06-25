<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%!
String fields(int userfontsize, String str, int orgnum,CachedStyle cachedstyle) 
{
     String  ps= Toolbox.butstyle(userfontsize).replaceFirst(".*height:([0-9]+).*","$1");
     return "<td valign=middle><table valign=middle><tr height="
     + (Integer.parseInt(ps) - 1)
     + " style=\"background:linear-gradient(to right," + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ")\" ><td valign=middle><font color=#DDCC11><nobr><b>" 
     + str 
     + "</b></nobr></font></td></tr></table></td>";
}
%>
<% 
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request, response, "grading.jsp", true)) == null) 
    return;
orgnum = user.orgnum; 
if ( (user = User.dbauthorize(application,session,request, response, "grading.jsp", true)) == null) 
{
    out.print("</center><font color=white><b>You don't have a database now. A instructor should have one. Ask the System Administrator to create one for you"); 
    return;
}
String subdb = Toolbox.defaultParam(orgnum,request,"subdb","");
user.changedb(subdb);
String query =  Toolbox.defaultParam(orgnum,request,"query","");
if (!user.id.equals(subdb))
{
    query += " AND (Session.ta='" + user.id +"' OR Assignment.grader='" + user.id +"')";
}
String allcourses = Toolbox.defaultParam(orgnum,request,"allcourses","").replaceFirst(";$",""); 
String semester =  Toolbox.defaultParam(orgnum,request,"semester",Toolbox.dbadmin[orgnum%65536].currentSemester) ;
String maxnum1 = Toolbox.defaultParam(orgnum,request,"maxnum","100");
int maxnum = 100;
try { maxnum = Integer.parseInt(maxnum1) ;}catch(Exception e){}
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (adapter.error().length() > 0)
{ 
%>
<jsp:forward page="login.jsp">
<jsp:param name="submit" value="ToLogin" />
<jsp:param name="error" value="Database%20connection%20failed" />
</jsp:forward> 
<%
return;
}
%>

<!-- <%=query%> -->
<!DOCTYPE html> 
 <html lang="<%=Toolbox.langs[orgnum>>16]%>">
 <%=Toolbox.getMeta(orgnum)%>
 <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
 <title><%=Toolbox.emsgs(orgnum,490)%></title> 
 <%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
 <script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("grading.jsp","f1")%>";</script>
 <script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>
 <style type="text/css">
 input.box  {border:1px #b0b0b0 solid !important;background-color:<%=cachedstyle.TBGCOLOR%>;color:black;}
 select  {border:1px #b0b0b0 solid !important;background-color:<%=cachedstyle.TBGCOLOR%>;color:black;}
 input.right{background-color:<%=cachedstyle.DBGCOLOR%>;color:black;border:0;text-align:right;vertical-align:middle;}
 A:link
{
    COLOR: #0000AA;
    FONT-WEIGHT:700;
    TEXT-DECORATION: none
}
A:visited
{
    COLOR: #0000AA;
    FONT-WEIGHT:700;
    TEXT-DECORATION: none
}
A:hover
{
    COLOR: #CC0000;
    FONT-WEIGHT:700;
    TEXT-DECORATION: underline
}
 </style>
 
</head> 
 <script type="text/javascript"  > 
<%
boolean b = adapter.executeQuery2(query,false);
int numRows = 0;

if (!b)
{
   adapter.close();
   out.println("</script></head><body bgcolor=" +cachedstyle.DBGCOLOR + ">"  + adapter.error()  +"</body></html>");
   return;
}
int numCols = 12;// fields.length-1;
int j;
String value, lastn;
out.println("var M =[");
try{
while (adapter.resultSet.next())
{
   numRows++;
   if (numRows>1) out.print(",");
   out.print("["); 
   for (j = 0; j < numCols; j++)
   {
         try{value = adapter.resultSet.getString(j+1);}catch(Exception e){value="";}
         value = Generic.handle1(value);
          
         if (j == 3)
         {
             if (value==null)value="-1"; out.print(value);
         }
         else
         {
             if (value==null)value = "";
             out.print( "\""+value+"\"");
         }
         if (j < numCols-1) out.print(",");
   }
   out.print("]");
}

}catch(Exception e)
{

}
out.print("];");

if (numRows == 0)
{
   adapter.close();
   out.println("</script></head><body bgcolor=" +cachedstyle.DBGCOLOR + ">"  +Toolbox.emsgs(orgnum,491) +"</body></html>");
   return;
} 
   
if (numRows == -1) out.print("var sl=\"" + query + "\"");
if (numRows > maxnum) numRows = maxnum;
//String [] fields = adapter.columnNames;

%>
 
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
 
var encoding = '<%=Toolbox.encodings[orgnum>>16]%>';
var langcode = "<%= Toolbox.langs[orgnum>>16]%>";
var numRows = <%= numRows %>;
var numCols = <%= numCols %>;
 
for (var j=0; j < numRows; j++)
   if (M[j][8]=='')M[j][8] = M[j][10];
   else M[j][8] += ' ' + M[j][10];
<%
String operationSQL ="SELECT DISTINCT name, description, cgi, button, opt, caption,course,OperationCourse.forgrading FROM Operation, OperationCourse WHERE Operation.name = OperationCourse.operation and OperationCourse.forgrading > 0 and (OperationCourse.course = '" + allcourses.replaceAll(";", "' OR OperationCourse.course='") + "') ORDER BY OperationCourse.course,OperationCourse.forgrading";   
int m = adapter.executeQuery(operationSQL);
%>

var wsname  = Array(<%=m%>);
var wsdes = Array(<%=m%>);
var wscgi = Array(<%=m%>);
var wsbc = Array(<%=m%>);
var wsopt = Array(<%=m%>);
var buts = Array(<%=m%>);
var bing = Array(<%=m%>);
var numactive = <%=m%>;
var asso = new Array(<%=m%>); 
var associate = new Array(<%=m%>);
var associatelab = new Array(<%=m%>);
var optionref = new Array(<%=7*m%>);
var optionref1 = new Array(<%=6*m%>);
var wcaption = new Array(<%=m%>);
var semester = '<%=semester%>';
var font_size = <%=cachedstyle.fontsize%>;
<%
String buthelps = "<tr><td valign=top><input type=button style=background-color:#00BBBB;color:white;width:65px;font-weight:650  value=\"" + Toolbox.emsgs(orgnum,496)+"\"></td><td>"
+Toolbox.emsgs(orgnum,492)+"</td></tr>";
String allbuts = "";
String allbutname = "";
String includejs = "";
String alloptions = "";
Vector ext = new Vector(10);
ext.addElement("attach");
ext.addElement("course");
ext.addElement("content");
ext.addElement("assignname");
ext.addElement("Format");
if (Toolbox.emsgs(orgnum,849).equals("format"))
    ext.addElement("format");
else
    ext.addElement(Toolbox.emsgs(orgnum,849));
int navw = Integer.parseInt(Toolbox.butstyle(cachedstyle.fontsize).replaceFirst(".*height:([0-9]+).*", "$1"));

String jsfunction = "function jsfunction(i) {\n";
String optionrefs = "", optionrefs1 = "";
String asso = "";
int refcount = 0, refcount1= 0, maxn=0, running=0; 
for ( j = 0; j < m; j++)
{ 
   running++; 
   if (j==m-1||!adapter.getValueAt(j,6).equals(adapter.getValueAt(j+1,6)))
   {
       if (running>maxn)
           maxn = running;
       running = 0;    
   }
   String optstr = "", optstr1="";
   out.println("wcaption[" + j + "]  = \"" + adapter.getValueAt(j,5).trim() + "\"");
   out.println("wsname[" + j + "]  = \"" + adapter.getValueAt(j,0).trim() + "\"");
   String ds = Generic.handle(adapter.getValueAt(j,1)); 
   if (ds == null) ds = Toolbox.emsgs(orgnum,493);
   String ds1 = ds;
   out.println("wsdes[" + j + "]  = \"" + ds.trim() + "\"");
   ds = adapter.getValueAt(j,3); if (ds == null) ds = "#008080";
   buthelps +="<tr><td valign=top><input style=background-color:" + ds.trim() +";color:white;width:65px;font-weight:650 type=button value=\"" +adapter.getValueAt(j,5).trim() +"\"></td><td>" + Generic.handle(adapter.getValueAt(j,1))+"</td></tr>"; 
   out.println("wsbc[" + j + "]  = \"" + ds.trim() + "\"");
   String option = adapter.getValueAt(j,4);
   if (option == null) option = "";
   option = option.trim();
   
   if ( Generic.isFunctionStr(option))
    {
        String newentry = "<script type=text/javascript  src=\""+adapter.getValueAt(j,2) + "\"></script>\n";
        if (includejs.indexOf(newentry) < 0)
           includejs += newentry;

        String argu =  option.replaceFirst( "[^\\(]+\\(", "").replaceFirst("\\)[ ]*$",""); 
        String calls = option.replaceFirst ("\\(.*", "("); 
        String seq = "";
        String [] args = argu.split(",");
        
        for (int ll = 0; ll < args.length; ll++)
        {
            args[ll] = args[ll].trim();
            double dd = 0;
            try
            { 
                 dd = Double.parseDouble(args[ll]);
                 if (!seq.equals("")) seq += ",";
                 seq += args[ll];
            } 
            catch(Exception e)
            {
                if (args[ll].charAt(0) == '\'' || args[ll].charAt(0) == '"')
                {
                   if (!seq.equals("")) seq += ",";
                   seq += args[ll];
                }
                else
                {
                   int zz = args[ll].indexOf("_"); if (zz == -1) {zz = args[ll].length(); args[ll] += "_a";}
                   String dtype = "text";
                   String dname = args[ll].substring(0,zz) ;
                   dtype = args[ll].substring(zz+1);
                   int vv = ext.size() - 1;
                   for (; vv>=0 && !dname.toLowerCase().equals((String)(ext.elementAt(vv))) ; vv--);
                   if (dtype.toLowerCase().indexOf("a") == 0)
                   { 
                              if (!seq.equals("")) seq += ",";   
                              seq += "document.form.content";
                   }
                   else
                   {
                       optstr += dname + "|";
                       optstr1 += dname + "_lab|";
                       if (vv == -1)
                       {
                             if (dtype == null) dtype = "text";
                             else if (dtype.toLowerCase().indexOf("h") == 0)  dtype="hidden";
                             else if (dtype.toLowerCase().indexOf("p") == 0)  dtype="password";
                             else if (dtype.toLowerCase().indexOf("r") == 0)  dtype="radio";
                             else if (dtype.toLowerCase().indexOf("c") == 0)  dtype="checkbox";
                             else if (dtype.toLowerCase().indexOf("f") == 0)  dtype="file";
                             if  (!dtype.equals("hidden"))
                             {
                                 String tt = dname.substring(0,1).toUpperCase() + dname.substring(1);
                                 alloptions += "<input class=right name=\"" + dname + "_lab\" value=\"" + tt + "\" size=" + (tt.length() )+ " onkeypress=\"return false\">\n";
                                 optionrefs1 += "for (var jj=0; jj < Ff.elements.length; jj++)if (Ff.elements[jj].name=='" + dname +"_lab'){optionref1[" + (refcount1++) + "] = Ff.elements[jj];break;}\n";
                             }
                             alloptions +=  "<input type=" + dtype + " name=\"" + dname +"\">";
                             optionrefs += "for (var jj=0; jj < Ff.elements.length; jj++)if (Ff.elements[jj].name=='" + dname +"'){optionref[" + (refcount++) + "] = Ff.elements[jj];break;}\n";
                             ext.addElement(dname.toLowerCase());
                       }
                             if (!seq.equals("")) seq += ",";   
                             if (dtype.toLowerCase().indexOf("n") == 0)
                                  seq += "parseFloat(document.form."+ dname + ".value)";
                             else if (dtype.toLowerCase().indexOf("s") == 0)
                                  seq  += "document.form."+ dname + ".value";
                             else   
                                  seq += "document.form."+ dname ;
                        
                   }
                }
            }
        }
        
        jsfunction += "    if (i == " + j + ") " + calls + seq + ");\n";
        out.println("wsopt[" + j + "]  = \"JSFUNCTIONS\";");
    }
    else 
    {
        String [] opts = option.split("&");
        String tail = "?"; int ll;
        for (  ll = 0; ll < opts.length; ll++)
        {
            if (opts[ll].indexOf("=") == -1)
            {
                int zz = opts[ll].indexOf("_");
                if (zz == -1) {zz = opts[ll].length(); opts[ll] += "_a";}
                String dtype = "hidden";
                String dname = opts[ll].substring(0,zz) ;
                dtype = opts[ll].substring(zz+1);
                optstr += dname + "|";
                optstr1 += dname + "_lab|";
                int vv = ext.size() - 1;
                for (; vv>=0 && !dname.toLowerCase().equals((String)(ext.elementAt(vv))) ; vv--);
                if ( vv != -1)
                {
                     if (dtype.toLowerCase().indexOf("a") == 0)
                     {
                           asso += "for (var jj=0; jj < Ff.elements.length;jj++)if (Ff.elements[jj].name=='" + dname +"') { asso[" + j + "] = Ff.elements[jj];break;}\n";
                     } 
                }
                else
                {
                     if (dtype.toLowerCase().indexOf("a") == 0)
                     {
                           asso += "for (var jj=0; jj < Ff.elements.length;jj++)if (Ff.elements[jj].name=='" + dname +"') { asso[" + j + "] = Ff.elements[jj];break;}\n";
                           dtype = "hidden";
                     }
                     else
                     {
                           if (dtype == null) dtype = "hidden";
                           else if (dtype.toLowerCase().indexOf("h") == 0)  dtype="hidden";
                           else if (dtype.toLowerCase().indexOf("t") == 0)  dtype="text";
                           else if (dtype.toLowerCase().indexOf("p") == 0)  dtype="password";
                           else if (dtype.toLowerCase().indexOf("r") == 0)  dtype="radio";
                           else if (dtype.toLowerCase().indexOf("c") == 0)  dtype="checkbox";
                           else if (dtype.toLowerCase().indexOf("f") == 0)  dtype="file";
                     }
                     if  (!dtype.equals("hidden"))
                     {
                         String tt = dname.substring(0,1).toUpperCase() + dname.substring(1);
                         alloptions += "<input class=right name=\"" + dname + "_lab\" value=\"" + tt + "\" size=" + (tt.length() )+ " onkeypress=\"return false\">\n";
                         optionrefs1 += "for (var jj=0; jj < Ff.elements.length; jj++)if (Ff.elements[jj].name=='" + dname +"_lab'){optionref1[" + (refcount1++) + "] = Ff.elements[jj];break;}\n";
                     }
                     optionrefs += "for (var jj=0; jj < Ff.elements.length; jj++)if (Ff.elements[jj].name=='" + dname +"'){optionref[" + (refcount++) + "] = Ff.elements[jj];break;}\n";
                     alloptions += "<input type=" + dtype + " name=\"" + dname +"\" size=6>";
                     ext.addElement(dname.toLowerCase());
                }
                out.println("wsopt[" + j + "]  = \"" + opts[ll]+ "\"");
            }
            else
               tail += opts[ll] + "&";
        }
        ll = tail.length();
        if (tail.charAt(ll-1) == '&' || tail.charAt(ll-1) == '?')
           tail = tail.substring(0,ll-1);
        out.println("wscgi[" + j + "]  = \"" + adapter.getValueAt(j,2) + tail + "\";");
       
    }
    out.println("associate[" + j + "]  = \"" + optstr + "\";");
    out.println("associatelab[" + j + "]  = \"" + optstr1 + "\";");
}
buthelps +="</table>";
 
for (j = 0; j < maxn ; j++)
{
    allbuts += "<input style=\"color:antiquewhite;font-weight:700;width:60px\" type=button name=webservice"+j+ " onclick=webservice(" + j + ")>"; 
    allbutname += "buts[" + j + "] = Ff.webservice" + j + ";\n";
}
 
out.println(jsfunction + "}");
 
int mm = m; 
adapter.close();
%>
var numbuts = <%=maxn%>; 
var refcount = <%=refcount%>;
var K = <%=mm%>;
var X = [<%
for ( j = 0; j < mm; j++)
{  
    out.print("'"+adapter.getValueAt(j,0).trim()+"'");
    if (j<mm-1)out.print(",");
} 
%>];
var Y = [<%
for ( j = 0; j < mm; j++)
{  
     out.print("'"+adapter.getValueAt(j,6).trim()+"'");
    if (j<mm-1)out.print(",");
} 
%>];
</script>
<%=includejs%>
<body bgcolor=<%= cachedstyle.DBGCOLOR %> leftmargin=3 rightmargin=0 bottommargin=0 topmargin=3>
    <center>
    <form rel=opener   name=form method=post style="margin-bottom: 0pt;margin-top:0pt;"   >
    <input  type=hidden name=sid>
    <input  type=hidden name=option>
    <input  type=hidden name=submtime>
    <input  type=hidden name=fname>
    <input  type=hidden name=attach>
    <input  type=hidden name=subdb value="<%=subdb%>" >
    <input  type=hidden name=wcds> 
    <input  type=hidden name=semester value="<%=semester%>">
    <input  type=HIDDEN name=rdap value=grading>
    <input  type=HIDDEN name=rsacode value=0> 
    <input  type=HIDDEN name=id>  
    <TABLE width=100% border=0 bgcolor=<%=cachedstyle.IBGCOLOR%> cellpadding=1 cellspacing=0 align=left>
        <%=Toolbox.title( Toolbox.emsgs(orgnum,538),1) %> 
    <TR><TD valign=TOP> 
    <TABLE BORDER=0 cellspacing=1 width=100% bgcolor=<%=cachedstyle.DBGCOLOR%> name="mytable">
    
            <tr > 
                <td   align=center valign=bottom ><img name=pic src="image/hint.gif" height="<%=(cachedstyle.fontsize>15)?4*cachedstyle.fontsize:60%>" alt="Click: show or hide" onclick="javascript:showswitch()"> </td>
                <td>
                <table cellspacing=1 cellpadding=2>
                    <tr  height=23>
                        <%=fields(cachedstyle.fontsize,Toolbox.emsgs(orgnum,19), orgnum, cachedstyle)%> <td>full name </td>
                        <%=fields(cachedstyle.fontsize,Toolbox.emsgs(orgnum,289), orgnum, cachedstyle)%> <td>due</td>
                        <%=fields(cachedstyle.fontsize,Toolbox.emsgs(orgnum,494), orgnum, cachedstyle)%> <td>submit time</td>  
                        <%=fields(cachedstyle.fontsize,Toolbox.emsgs(orgnum,355), orgnum, cachedstyle)%> <td>attachment</td>
                    </tr>
                    <tr  height=23>
                        <%=fields(cachedstyle.fontsize,Toolbox.emsgs(orgnum,223), orgnum, cachedstyle)%> <td><select  name=assignname  ONCHANGE=onchangeass() style=width:100px></select></td>
                        <%=fields(cachedstyle.fontsize,Toolbox.emsgs(orgnum,430), orgnum, cachedstyle)%> <td><select name=course onClick="clicked=true;" onChange=changecourse()></select></td>
                        <%=fields(cachedstyle.fontsize,Toolbox.emsgs(orgnum,495), orgnum, cachedstyle)%> <td><input class=box name=comment size=16> </td>
                        <%=fields(cachedstyle.fontsize,Toolbox.emsgs(orgnum,21), orgnum, cachedstyle)%>  <td><select name="Format" tabindex=4 ><option value="0"><%=Toolbox.emsgs(orgnum,214)%></option><option value=1>HTML</option><option value=2>LaTeXML</option></select></td>
                    </tr>
                </table>
            </td>
        </tr>
        
       <tr>
       <td colspan=2   valign=top align=left> <textarea class=VV NAME=content cols=60 rows=20> </textarea> 
      
      </td>
       </tr>
       <tr>
           <td colspan=2> 
               <table cellspacing=0 cellpadding="0"> 
                   <tr><td><input type=button class=GreenButton style="width:<%= navw%>px;height:<%= navw%>px;font-weight:740" name=submi24       value="&lt;&lt;"  ONCLICK= "javascript:navigate0()" 
                       ></td><td><input type=button class=GreenButton  style="width:<%=navw%>px;height:<%=navw%>px;font-weight:740"   name=submi25           value="&lt;"  ONCLICK="javascript:navigatel()" 
                       ></td><td><input class=box type=text style="text-align:right" size=2  name=counter onkeypress= "return numbersonly1()"
                       ></td><td>/<%=numRows%></td><td><input type=button class=GreenButton  style="width:<%=navw%>px;height:<%=navw%>px;font-weight:740"    name=submi26         value= "&gt;"    ONCLICK="javascript:navigater()" tabindex=3 
                       ></td><td><input type=button class=GreenButton  style="width:<%=navw%>px;height:<%=navw%>px;font-weight:740"   name=submi27          value= "&gt;&gt;"  ONCLICK="javascript:navigatee()"  
                       ></td><td>&nbsp;<%=fields(cachedstyle.fontsize,Toolbox.emsgs(orgnum,236), orgnum, cachedstyle)%></td><td><input class=box name=grade size=3 tabindex=1 onkeypress= "return numbersonly()"  
                       > </td><td><input class=OrangeButton    type=button name=submit22     value="<%=Toolbox.emsgs(orgnum,36)%>" ONCLICK = "javascript:saveupdate('correct');" tabindex=2  
                       ></td><td><input class=GreenButton    type=button name=submit20      value="<%=Toolbox.emsgs(orgnum,50)%>" ONCLICK = "javascript:showanswer('des')"   
                       ></td><td><input class=GreenButton    type=button name=submit21      value="<%=Toolbox.emsgs(orgnum,53)%>" ONCLICK = "javascript:showanswer('answer')"  
                       ></td><td><input class=GreenButton    type=button name=webservice00 style=color:white;width:60px   value="<%=Toolbox.emsgs(orgnum,496)%>" onClick=review(document.form)
                       ></td><td><input class=OrangeButton     type=button  name=submit29 value="<%=Toolbox.emsgs(orgnum,497)%>" onclick="saveoffline(false);switchoffline()" 
                       ></td><td><input class=RedButton    type=button name=submit23     value="<%=Toolbox.emsgs(orgnum,30)%>" ONCLICK = "javascript:saveupdate('deleteit');" tabindex=11  
                       ></td><td><input class=GreenButton    type=button  name=submit30 value="<%=Toolbox.emsgs(orgnum,345)%>" onclick="unigrade()" 
                       ></td><td><input class=GreenButton  type=button  name=submithelp   value="<%=Toolbox.emsgs(orgnum,32)%>" onClick="showhelp()">
                       </td>
                   </tr>
               </table>
        </td> 
       </tr>
       <tr>
        <td colspan=2>
          <table cellspacing=0 cellpadding="0"> <tr>
          <td>
           <a href=javascript:openit1()><%=Toolbox.emsgs(orgnum,292)%></a>
       </td><td>
       <%=allbuts%> <%=alloptions%> </td>
        
        
         <td align=right> 
          <script type="text/javascript" >document.write("<input  class=GreenButton  name=submit30  type=button value=\"" + textmsg[407] +"\"   ONCLICK=customize()>");</script>
      </td>
         </tr>  </table>
        </td>
       </tr>  
     </table> 
     </td>
       </tr>  
     </table> 
   </form>
<script type="text/javascript" >
var pagemeta = '<meta http-equiv="Content-Type" content="text/html; charset=<%=Toolbox.encodings[orgnum>>16]%>">';
var iid = "<%=user.id%>";
var colorstr = 'bgcolor=<%=cachedstyle.DBGCOLOR%>';

var Ff = document.form;
var iscurrent = <%=semester.equals(Toolbox.dbadmin[orgnum%65536].currentSemester)%>;
<%long timenow=(new java.util.Date()).getTime()/1000;%>
var timenow =<%=timenow%>;
<%=allbutname%>
var buthelps = "<%=buthelps%>";
var refcount1 = <%=refcount1%>;
<%=optionrefs1%>
<%=optionrefs%> 
<%=asso%> 
var timeformat = "<%=cachedstyle.timeformat%>";
var meta = '<%=Toolbox.getMeta(orgnum).replaceAll("\\n","").replaceFirst("<script>.*script>","")%>';
var formatword = '<%=Toolbox.emsgs(orgnum,849)%>';
var subdb = "<%=subdb%>";
</script> 
</center>
</body>
 <script  type="text/javascript"  src=timeformat.js></script>
 
<script  type="text/javascript"  src=gradingform.js></script> 
 
</html>
