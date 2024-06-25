<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.zip.*,java.io.*" %>
 
<% 
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request, response, "download.jsp", false)) == null)
    return;
orgnum = user.orgnum; 
String folder = Toolbox.defaultParam(orgnum,request,"folder","",":\\/@#$+", 150).trim();

String iid = Toolbox.defaultParam(orgnum,request,"iid", null, null, 20);

String course =  Toolbox.defaultParam(orgnum,request,"course","" , null, 30);
if (iid!=null)
{
    iid = iid.trim();
    folder = iid + "/" + course + "/" + UploadFile.pfolders[0];
}

if (folder == null || folder.indexOf("..") >= 0 )
{
    folder = "";
}
if (folder.indexOf(UploadFile.pfolders[0]) < 0) return;
folder = folder.replaceFirst("^/","").replaceFirst("/$","");
String courseTitle = Toolbox.defaultParam(orgnum,request,"coursetitle","","!@#$%&()-_+:/", 200);
String ontitle =   courseTitle + ":" +  folder.replaceFirst(".*" + UploadFile.pfolders[0]," " + Toolbox.emsgs(orgnum,526));

%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%><title><%=Toolbox.emsgs(orgnum,636)%></title>
<script type="text/javascript" >
var timeformat = '<%=cachedstyle.timeformat%>';var haswebfolder=<%=user.websitename != null && !user.websitename.equals("")
||user.webFileFolder != null && !user.webFileFolder.equals("") %>;
</script>
<style type="text/css">
input.BG {background-color:transparent;border:0}
input.BG1 {background-color:transparent; border:0;text-align:right}
</style>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("download.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>
</head>
<body  style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:5px 5px 5px 5px" >
<center>
<%=Toolbox.title(ontitle)%>

<%
String accessible = Toolbox.defaultParam(orgnum,request, "accessible", "", null, 30);
String statusstr = "";
if (!accessible.equals("true"))
{
   
   String subdb =  Toolbox.defaultParam(orgnum,request,"subdb","", null, 30);
   String sid  =  Toolbox.defaultParam(orgnum,request,"sid",user.id, null, 30);
   String semester  =  (Toolbox.defaultParam(orgnum,request,"semester",Toolbox.dbadmin[orgnum%65536].currentSemester, null, 40));
   user.changedb(subdb);
   if ( user.roles == Systemroles.STUDENT)  
    {
        user.iid = subdb;
        session.setAttribute("User", user);
    }
   JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
   if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
   statusstr = RegStatus.goodstatus(adapter,  user,  course,  sid,  subdb);
   if (!statusstr.equals(""))
   {
       out.print("</center><br>" + statusstr + "<script type=\"text/javascript\"   src=curve.js></script></body></html>");
       adapter.close();
       return;
   }
   else
   {
      statusstr = "parent.frames[0].setaccessible(\"" + course +"\");";
   }
   adapter.close();
}

String sortField = Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("sortField"), null), null, 30);
String esortField = "";
if (sortField!=null)
    esortField = Toolbox.urlencode(sortField);

 

String fld = folder;
if (!folder.equals("")) 
    fld  = File.separator  + folder;

String realfolder = Toolbox.dbadmin[orgnum%65536].webFileFolder  +  fld;
long filesize= 0;
out.print("<!--" + realfolder +"-->");
  
File dir0 = new File(realfolder);   

if (!dir0.exists())
{
   dir0.mkdir();
   
}
 
String [] ffn  = dir0.list();
int N = 0; if (ffn!=null) N = ffn.length;
 
String [] rfn = new String[N];
String [] fn = new String[N];
//String [] lstr = new String[N];
String  [] tstr = new String[N];
int [] isdir = new int[N];
long [] ln = new long[N];
long [] lm = new long[N];
int [] r = new int[N];

boolean [] lock = new boolean[N];

long nb= 0;
int j = 0;
long totallast = 0;

StringBuffer locked = new StringBuffer(";");
File permitFile = new File (realfolder + File.separator +"tmlpermi.txt");
try
{
           FileInputStream fin = new FileInputStream(permitFile);
           byte [] buf = new byte[256]; 
           int jb=0;
           while ( ( jb = fin.read(buf)) > 0)
           {
               locked.append(new String(buf, 0, jb));
           }
           fin.close();
}
catch(Exception e){}

//out.println("<!--" + locked.toString() +"-->");

for (int i = 0; i < N; i++)
{
   File f =   new File(realfolder + File.separator + ffn[i]);
   if (f.isDirectory() )
   {
          if (locked.indexOf(ffn[i])  >=0 ) continue;
          isdir[j] = 1;
          fn[j] = ffn[i];
          lm[j] = f.lastModified();
          if (lm[j]>totallast) totallast = lm[j];
          ln[j] =  FileOperation.getFileOrDirectorySize(f);
          filesize += ln[j];
          
          r[j] = j++;
   }
}
int nf = j;
boolean haspermit = false;
for (int i = 0; i < N; i++)
{
   File f =   new File(realfolder + File.separator + ffn[i]);
   if (f.isFile())
   {
          if (ffn[i].equals("wwwresurls.html")){ continue;  }
          if (ffn[i].equals("tmlpermi.txt")){ continue;  }
          if (locked.indexOf(ffn[i])  >=0 ) continue;
          isdir[j] = 0;
          fn[j] = ffn[i];
          lm[j] = f.lastModified();
          if (lm[j]>totallast) totallast = lm[j];
          ln[j] = f.length();
          filesize += ln[j];
           
          r[j] = j++;
    }
}
N = j;
 
 

 

 

for (j = 0; j < N; j++)
{
   tstr[j] = "" +lm[j]/1000;
   nb += ln[j];
}
 
%>
 
 
<form rel=opener  style="margin:5px 0px 0px 0px" name=form1 method=post  >
<script type="text/javascript" >
    var hasparent = <%=(!folder.replaceFirst(".*" + Toolbox.emsgs(orgnum,1398).replaceFirst(",.*",""),"").equals("")) %>; 
     document.write(round1('100%'));
</script>
<table id="maintbl" width=100% align="center" cellpadding=1 cellspacing=1 class=outset3 >
<tr style="background:<%= Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>">
  <td align="right"   width="2%" onclick="sorta(this,0)"><nobr><%=Toolbox.emsgs(orgnum,231)%></nobr></td>
 <td align="left"   width="35%" onclick=sorta(this,1) ><nobr><%=Toolbox.emsgs(orgnum,67)%></nobr></td> 
  
 <td  align=left    width="15%"onclick=sorta(this,2)><nobr><%=Toolbox.emsgs(orgnum,291)%></nobr></td> 
  
 <td align=right   width="18%"  onclick=sorta(this,3)><nobr><%=Toolbox.emsgs(orgnum,371)%></nobr></td>  
   
 <td align=right   width="30%" onclick=sorta(this,4)><nobr><%=Toolbox.emsgs(orgnum,638)%></nobr></td>
  
  </tr>  
 
  <%if (!folder.replaceFirst(".*" + Toolbox.emsgs(orgnum,1398).replaceFirst(",.*",""),"").equals("")) {%>
<tr bgcolor=<%=cachedstyle.TBGCOLOR%>>
   <td  align="right">0</td>
   <td  align="left"><a href="javascript:openFolder(-1)"><%=Toolbox.emsgs(orgnum,639)%>&bull;&bull;</a></td>
   <td  align=left ><img src="image/folder.jpg" border=0 alt="Folder" /></td>
   <td  align=right></td>
   <td  align=right></td>
</tr> 
  
<%
}

%> 
<script type="text/javascript"  src=timeformat.js></script>
<script type="text/javascript" >
 
var ln=[<%for (int i=0; i < N; i++) out.print(ln[i]+",");%>0];
var nf =<%=nf%>;
var N  =<%=N%>;
var fn = ["<% for (int i = 0; i < N; i++)  out.print(fn[i] +"\",\"");%>"]; 
 
var moveto = "<%=Toolbox.emsgs(orgnum,640)%>";
var copyto = "<%=Toolbox.emsgs(orgnum,764)%>";
var rename = "<%=Toolbox.emsgs(orgnum,89)%>";
var zip = "<%=Toolbox.emsgs(orgnum,641)%>";
var unzip = "<%=Toolbox.emsgs(orgnum,643)%>";
var chs = "<%=Toolbox.emsgs(orgnum,702)%>";
var edited = "<%=Toolbox.emsgs(orgnum,642)%>";
var downloadit = "<%=Toolbox.emsgs(orgnum,1228)%>";
var tstr = [<% for (int ii=0; ii<N; ii++) out.print(tstr[ii] + ",");%>0];
var wfdl = "web/<%=user.id +"/"+ fld.replaceFirst("^\\\\","")%>";
for (var i=0; i < nf; i++)
{
   
  document.write("<tr bgcolor=<%=cachedstyle.TBGCOLOR%> >" 
   + '<td align="right" >' + (i+1) + '</td>'
   + '<td  align="left"><a href="javascript:openFolder(' + i + ')">' + fn[i] + '</a></td>'
   + '<td  align=left><img src=image/folder.jpg border=0 alt="Folder" /></td>'
   + '<td  align=right>' + ln[i] + '</td>' 
   + '<td  align=right>' + timestr(tstr[i]) + '</td>'
   + '</tr>'); 
}
 var J;
 var ext;
 for (var i = nf; i < N; i++)
 { 
   
   J = fn[i].lastIndexOf('.'); 
   if (J == -1) 
       ext = '';
   else 
       ext = fn[i].substring(J+1).toLocaleLowerCase();
   document.write('<tr bgcolor=<%=cachedstyle.TBGCOLOR%> >' 
   + '<td align="right" >' + (i+1) + '</td>'
   + '<td  align="left"><a href="javascript:download('+ i + ')">' + fn[i].replace(" ","&nbsp;") + '</a></td>'
   + '<td  align=left><img src=image/file.jpg border=0 alt="File" /> ' + ext + '</td>' 
   + '<td  align=right>' + ln[i] + '</td>' 
   + '<td  align=right>' + timestr(tstr[i]) + '</td>'
   + '</tr>'); 
} 


</script>


</table> 
 <script type="text/javascript" >document.write(round2); var NL = 0;</script>
</form>
<br>
<%
File furl = new File(realfolder,"wwwresurls.html");
if (furl.exists())
{
    %>
    <script type=\"text/javascript\" >document.write(round1('100%'));</script>
      <table  width=100% align=center cellpadding=1 cellspacing=1 class=outset3 >
        <tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>" >
            <td align="right" onclick="sortb(this,0)"><nobr><%=Toolbox.emsgs(orgnum,231)%></nobr></td>
            <td   align=left  onclick="sortb(this,1)"><nobr><%=Toolbox.emsgs(orgnum,1368)%></nobr></td>
            <td   align=left  onclick="sortb(this,2)"><nobr><%=Toolbox.emsgs(orgnum,923)%></nobr></td>
        </tr>
    <%
    String line; int i = 0;
    java.io.BufferedReader br = new BufferedReader(new FileReader(furl));
    while ( (line = br.readLine()) !=null)
    {
        if (line.trim().length() == 0) continue; 
        int ii = line.indexOf("\"");
        int jj = line.indexOf("\"",ii+1);
        if (line.charAt(0) != 'x')
            out.println("<tr style=\"border:0px;background-color:" + cachedstyle.TBGCOLOR +"\" >"
            + "<td  width=2% align=right>" + (i+1) + "</td>"
            + "<td align=left width=49% style=\"color:blue;cursor:pointer;\" >" + line +"</td>"
            + "<td align=left width=49% style=\"color:black\" >" + line.substring(ii+1,jj) +"</td>"
            + "</tr>");
        i++;
    }
    br.close();
    %>
   </table>
    <script type=\"text/javascript\" >
        document.write(round2);
        NL = <%=i%>; 
     </script>
<%
}

%>

<form rel=opener name=form3 style="margin-bottom:0pt;margin-top:0pt;"  method=post action=download.jsp  >
<input type=hidden name=folder>
<input type=hidden name=coursetitle value="<%=courseTitle%>" > 
</form> 
 
<form rel=opener name=form2 style="margin-bottom:0pt;margin-top:0pt;"  method=post action=FileOperation target=fileop  >
<input type=hidden name=folder value=<%=folder%>>
<input type=hidden name=filedir> 
<input type=hidden name=usedfor value="download"> 
<input type=hidden name=destination>
<input type=hidden name=operation >
</form>
 
<script type="text/javascript" >
var K = -1;
var onclick='';
 
 
function syn1()
{
  if (K > -1)
  {
      K = -1;
      document.form5.content.disable = false;
      document.form5.content.value = nav1.document.f1.destination.value;
      eval(onclick);
  }
} 

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
var helpstr = "<%=Generic.handle(Toolbox.emsgs(orgnum,660))%>";
 
var numFolders = <%=nf%>;
 

var folder = '<%=folder%>';
 
 
var Ff = document.form2;
 
 
var involved = null;
var valid = true;
 
 
 
function openFolder(k)
{
    
    var fd = '';
    if (k == -1)
    {
        if (folder != null)
           fd = folder; 
        else
           fd = '';
        if (fd.length  > 0)
        {
        var j = fd.length - 1;
        while (j >  0 &&  fd.charAt(j) != '/' && fd.charAt(j) != '\\') j--;
        fd = fd.substring(0,j);
        }
    }
    else if (folder == '')
        fd = fn[k];
    else
        fd  = folder + "/" + fn[k];
    document.form3.folder.value = fd;
    formnewaction(document.form3);
    visual(document.form3);
document.form3.submit();
   }
 
  
 function count(n)
 {
    var ss = selstr.replace(/;/,'');
    return ss.indexOf(';');
 }

function alertmove()
{
   myprompt('<%=Toolbox.emsgs(orgnum,667)%>');
}
 
var jj;
var vv;

var actionname;
 
var order = 1;
var swapa = [1,1,1,1,1];
var swapb = [1, 1, 1];
function sorta(td,col)
{
   order = swapa[col];
   swapa[col] *= -1;
   if (hasparent)
  {
      sort(td, col, 2,    nf+2);
      sort(td, col, nf+2, N+2);
  }
  else
  {
      sort(td, col, 1,    nf+1);
      sort(td, col, nf+1, N+1); 
  }
}
function sortb(td,col)
{
     
    order = swapb[col];
    swapb[col] *= -1;
    sort(td, col, 1);
}
function sort(td,col, p, q)
{
  var tbl = td.parentNode.parentNode;
  if (tbl.tagName.toLowerCase()!='table') 
      tbl = tbl.parentNode;
  if (q == null) q = tbl.rows.length;
  if (q <= p+1) return;
  var isnum = true;
  var x = [];
   
  for (var i=p; i <  q; i++)
  {
     x[i-p] = tbl.rows[i].cells[col].innerHTML.replace(/<[^>]+>/g,'');
     if (col < 4 && isnum && isNaN(x[i-p])) isnum = false;
  }
   
    var y = [];
    for (var i=0; i < x.length ; i++) 
    {
        y[i] = i;
    }
    if (isnum)
    y.sort(function(i, j)
    {
        if (col < 4)
        {
        var a=parseInt(x[i]);
        var b=parseInt(x[j]); 
        }
        else
        {
           a=parseTime(x[i]);
           b=parseTime(x[j]);  
        }
        if (a > b) return  order ;
        if (a < b) return -order ;
        return (i-j)*order; 
         
    });
   else
    y.sort(function(i, j)
   {  
       if (x[i].toLowerCase() > x[j].toLowerCase()) return  order ;  
       if (x[i].toLowerCase() < x[j].toLowerCase()) return -order ; 
       if (x[i] > x[j]) return  order ;  
       if (x[i] < x[j]) return -order ; 
       return (i-j)*order;  
   });

  var C = tbl.rows[0].cells.length;
  
  for (var k=0; k < C; k++)
  {
    for (var i=p; i <  q ; i++)
      x[i-p] = tbl.rows[i].cells[k].innerHTML;
    
    for (var i=p; i <  q ; i++)
      tbl.rows[i].cells[k].innerHTML  = x[y[i-p]];
  }
}


function download(k,attachment)
{
    actionname = "";
    if (       fn[k].toLowerCase().indexOf(".htm")>0 
            || fn[k].toLowerCase().indexOf(".do")>0 
            || fn[k].toLowerCase().indexOf(".php")>0 
            || fn[k].toLowerCase().indexOf(".jsp")>0
            || fn[k].toLowerCase().indexOf(".jpg")>0 
            || fn[k].toLowerCase().indexOf(".png")>0 
            || fn[k].toLowerCase().indexOf(".gif")>0
            || fn[k].toLowerCase().indexOf(".svg")>0
            || fn[k].toLowerCase().indexOf(".tiff")>0
            || fn[k].toLowerCase().indexOf(".txt")>0)
    {
       ; 
    }
    else if (attachment==null){ attachment = 1;}
    
    if (attachment==null)
        Ff.destination.value = "inline";
    else
        Ff.destination.value = "attachment";
    Ff.target = "_blank";
    Ff.filedir.value = fn[k];
    Ff.operation.value = "open";
    formnewaction(Ff);
    visual(Ff);
 Ff.submit();
}
function getSubdb()
{
    return "<%=iid%>";
}
function getFolder()
{
    return "<%=folder%>";
}
function fresh(){ myprompt("<%=Toolbox.emsgs(orgnum,769)%>");}

</script>
 <script type="text/javascript"  src=helpformat.js></script>

<script type="text/javascript" >
 

<%=statusstr%>
</script>
</center>
<script type="text/javascript"  src=curve.js></script>
 <div id="copyright" style="text-align:center;color:#4d5ddd;font-size:12px"> 
<%= Toolbox.copyright[orgnum>>16]%> 
</div>
</body>
</html>
 
