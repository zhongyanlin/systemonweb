<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
 
User user = (User)session.getAttribute("User");
CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
if (user != null && (user.roles & Systemroles.SYSTEMADMIN) == 0 )
{
 %>
    <jsp:forward page="userindex.jsp" />
<%
return;
}
else if (  user==null && Toolbox.dbadmin[orgnum%65536].phase >=1 )
{
%> 
Setting up reached the phase 1.
<%
return;
}
String systemdbms = "";
String systempassword = "";
String systemserver = "";
String systemdriver = "";
String systemuser = "";
String err="";
String submit = Toolbox.defaultParam(orgnum,request, ("submit"), null);
if (submit != null)
{
if (request.getMethod().equals("GET"))
{
 
      systemdbms = Toolbox.c2c(Toolbox.defaultParam(orgnum,request, ("systemdbms"), null),orgnum);
     systempassword = Toolbox.c2c(Toolbox.defaultParam(orgnum,request, ("systempassword"), null),orgnum);
     systemuser = Toolbox.c2c(Toolbox.defaultParam(orgnum,request, ("systemuser"), null),orgnum);
}
else
{
         systemdbms =  (Toolbox.defaultParam(orgnum,request, ("systemdbms"), null));
         systempassword =  (Toolbox.defaultParam(orgnum,request, ("systempassword"), null));
         systemuser =  (Toolbox.defaultParam(orgnum,request, ("systemuser"), null));
}
systemdriver = Toolbox.defaultParam(orgnum,request, ("systemdriver"), null);
systemserver = Toolbox.defaultParam(orgnum,request, ("systemserver"), null);
systemdbms = Toolbox.validate(systemdbms, null, 20);
systempassword = Toolbox.validate(systempassword, null, 30);
systemuser = Toolbox.validate(systemuser,null, 20);
systemdriver = Toolbox.validate(systemdriver, null, 40);
 

if (systemdbms != null && systemserver!=null && systemdriver!=null && systemuser!=null)
{
    if (submit.equals("2"))
    {
    if (Toolbox.dbadmin[orgnum%65536].setsystemdb(systemdbms, systemserver, systemdriver, systemuser, systempassword).equals(""))
    {
        session.removeAttribute("User");
        Toolbox.dbadmin[orgnum%65536].phase = 1; out.print(Toolbox.dbadmin[orgnum%65536].error3);%>  <jsp:forward page="setup.jsp" /> <%
        return;
    }
    else
       err = Toolbox.dbadmin[orgnum%65536].error3;
    }
    else 
    {
       out.print("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body>"+ Toolbox.dbadmin[orgnum%65536].testSystemdb(systemdbms, systemserver, systemdriver, systemuser, systempassword) );
       return;
    }
}
else 
{
   //systemdbms = systemserver = systemdriver = systemuser = "";
}

}

session.setAttribute("User", new User(orgnum,"", "", Systemroles.SYSTEMADMIN, null, "") );
String slash = java.io.File.separator;
 
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<%=Toolbox.getMeta(orgnum)%>
<body bgcolor="<%=cachedstyle.DBGCOLOR%>">
<%=Toolbox.title("Connection to the System Database")%> 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
<pre><font color=red><%=err%></font></pre>

<form rel=opener name=form3    >
1. Select the one of DBMS:
  <select   name=systemdbms onchange=emptyit()></select><br><br>

2. Enter the full-qualified URL of the Database <br>(Find how to compose the URL from the documentations of the DBMS vendor):<br>
&nbsp;&nbsp;<input   name=systemserver  value="<%=systemserver%>"   size=80 ><br><br>

3. Enter the full-qualified package name of the JDBC driver <br>(Find out the name from the documentations of the driver):<br>
&nbsp;&nbsp;<input   name=systemdriver    value="<%=systemdriver%>"  size=50 ><br> <br>

</form> <form rel=opener name=form2 method=post action=UploadFile target=blank  enctype="multipart/form-data"   >
4. Locate and upload the driver package ( one or more jar files) to the TeaLeaMan folder:<br>
  <input type=hidden name=saveindir value="image"><input type=hidden name=maximumsize value=50000000>
&nbsp;&nbsp;<input type=file name=localpath size=50> <input type=submit  style=background-color:#CCCC00;color:white;font-weight:700  name=upload value=Upload ><br>
</form> <br>
 <form rel=opener name=form1 method=post action=setupother.jsp onsubmit="return validate()"   >
 <input type=hidden name=systemdbms><input type=hidden name=systemserver><input type=hidden name=systemdriver><input type=hidden name=submit>
5. Enter a user name of the database that will be used as TeaLeaMan system database:<br>
&nbsp;&nbsp;<input    name=systemuser    value="<%=systemuser%>" size=40 ><br><br>

6. Enter the password of the user above: <br>
&nbsp;&nbsp;<input     name=systempassword type=password    size=40 > <br><br>
<Center>
 <input type=submit name=submit1 style=background-color:#00CCCC;color:white;font-weight:700 value="Test Connection" onclick="javascript:setact(1)">
<input type=submit name=submit2 style=background-color:#00CCCC;color:white;font-weight:700 value="Set Connection" onclick="javascript:setact(2)"> </center>
</form>

<script type="text/javascript" >
var ff = document.form3;
var f1 = document.form1;
var ee = f1.target;
function syn(){} 
function setact(b){f1.submit.value=b; if (b==1) f1.target='aaa';else f1.target=ee;} 
function validate()
{
  if (ff.systemserver.value == '')
  {
     myprompt('Enter a valid value');
     ff.systemserver.focus();
     return false;
  }
  if (ff.systemdriver.value == '')
  {
     myprompt('Enter a valid value');
     ff.systemdriver.focus();
     return false;
  }
  f1.systemdbms.value = ff.systemdbms.options[ff.systemdbms.selectedIndex].value;
  f1.systemserver.value = ff.systemserver.value;
  f1.systemdriver.value = ff.systemdriver.value;

  
  return true;
}
 
 
function check(sel)
{
 
  <% for (int i=0; i < Toolbox.dbadmin[orgnum%65536].numHosts; i++)
  {
      out.println("sel.options["+ i + "] = new Option('" + Toolbox.dbadmin[orgnum%65536].dbhost[i].dbms + "','"+Toolbox.dbadmin[orgnum%65536].dbhost[i].dbms +"');");
      //out.println("sel.options["+ i + "].className='selectoption';");
  }
  %>
  emptyit();
}

function emptyit()
{
   var i = ff.systemdbms.selectedIndex;
   
   <%for (int i = 0; i < Toolbox.dbadmin[orgnum%65536].numHosts; i++) {%>
    if (i ==  <%=i%>)
   {
      if (   i > 0 &&  ff.systemserver.value.indexOf("<%=Toolbox.dbadmin[orgnum%65536].dbhost[i].dbms%>") < 0)
      {
          ff.systemserver.value = '<%=Toolbox.dbadmin[orgnum%65536].dbhost[i].host%>TeaLeaMansys';
      }
      if (   i == 0 &&  ff.systemserver.value.indexOf(":odbc:") < 0)
      {
          ff.systemserver.value = '<%=Toolbox.dbadmin[orgnum%65536].dbhost[i].host%>TeaLeaMansys';
      }
      ff.systemdriver.value = '<%=Toolbox.dbadmin[orgnum%65536].dbhost[i].driver%>';
   }
   <%}%>
}
check(ff.systemdbms);
</script>
</body></html>
 
