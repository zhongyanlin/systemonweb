<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*" %>

<%!
void forbackup(String [] folders, int orgnum)
{
    long timenow = (new java.util.Date()).getTime()/1000;
     String[] sqls = {
            "update Backupfolder set folder='" + folders[0]  +"',lastupdate=" + timenow +" WHERE fname ='websiteFolder'",
            "update Backupfolder set folder='" + folders[3]  +"',lastupdate=" + timenow +" WHERE fname ='dbFileFolder'",
            "update Backupfolder set folder='" + folders[1]  +"',lastupdate=" + timenow +" WHERE fname ='webFileFolder'",
            "update Backupfolder set folder='" + folders[2]  +"' AND lastupdate=" + timenow +" WHERE fname ='webFileFolder1'",
            "INSERT INTO Backupfolder(lastupdate,fname,folder,backup) values(" + timenow +",'webFileFolder','" + folders[1] +"','" + folders[1].replaceFirst(".", "F")  +"1')",
            "INSERT INTO Backupfolder(lastupdate,fname,folder,backup) values(" + timenow +",'webFileFolder1','" + folders[2]  +"','" + folders[2].replaceFirst(".", "F") +"1')",
            "INSERT INTO Backupfolder(lastupdate,fname,folder,backup) values(" + timenow +",'websiteFolder','" + folders[0] +"','" + folders[1].replaceFirst(".", "F") +"1')",
            "INSERT INTO Backupfolder(lastupdate,fname,folder,backup) values(" + timenow +",'dbFileFolder','" + folders[3]  +"','" + folders[3].replaceFirst(".", "F") +"1')",
        };
        int j =0 ;
        JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
         
       for (int i=0; i < 8; i++)
       {
          j += adapter.executeUpdate(sqls[i]);
         // Toolbox.println(0,""+sqls[i] + j + adapter.error());           
       }
         
        adapter.close();  
}

%>

<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.SYSTEMADMIN,application,session,request, response, "studentfolder.jsp", true)) == null) 
    return;
orgnum = user.orgnum; 
String title =  Toolbox.emsgs(orgnum,171);
String [] ffs = new String[]{Toolbox.dbadmin[orgnum%65536].websiteFolder, Toolbox.dbadmin[orgnum%65536].webFileFolder,Toolbox.dbadmin[orgnum%65536].webFileFolder1,Toolbox.dbadmin[orgnum%65536].dbFileFolder };
forbackup(ffs, orgnum);

%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%><title><%=title%></title>
<%=Toolbox.getMeta(orgnum)%>
<style type="text/css"> 
input.enter {border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;background-color:<%=cachedstyle.TBGCOLOR%>;border:1px grey solid }
</style>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<%   out.print(Toolbox.unifontstyle(cachedstyle.fontsize,orgnum));%>
<script type="text/javascript"> <%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("cfgfolders.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>     
</head>
<body bgcolor=<%=cachedstyle.DBGCOLOR%>  >
<center> 
<%
long tstmp  = System.currentTimeMillis()%10000000;
String submit = Toolbox.defaultParam(orgnum,request,"submit",null);
if (submit != null && submit.equals(Toolbox.emsgs(orgnum,46)))  
{
    String folders[] = new String[8];
    folders[0] = Toolbox.defaultParam(orgnum,request,"websiteFolder","");
    String str = "";
    folders[1]  = Toolbox.defaultParam(orgnum,request,"webFileFolder","");
    folders[2]  = Toolbox.defaultParam(orgnum,request,"webFileFolder1","");
    folders[3]  = Toolbox.defaultParam(orgnum,request,"dbFileFolder","");
    folders[4]  = Toolbox.defaultParam(orgnum,request,"workingFolder","");
    folders[5]  = Toolbox.defaultParam(orgnum,request,"MaxUploadSize","1000000");
    folders[6]  = Toolbox.defaultParam(orgnum,request,"quota","");
    folders[7]  = Toolbox.defaultParam(orgnum,request,"quota1","");

    String nms[] =  new String[8];
   //{Toolbox.emsgs(orgnum,346), Toolbox.emsgs(orgnum,347), Toolbox.emsgs(orgnum,348), Toolbox.emsgs(orgnum,349), Toolbox.emsgs(orgnum,350), Toolbox.emsgs(orgnum,351)};
    for (int i=1; i < 6; i++)
    {
          nms[i-1] = Toolbox.emsgs(orgnum,345+i);
          if (folders[i] == null) folders[i] = "";      
          folders[i] = folders[i].trim();
          if (folders[i].equals("") == false && folders[i].substring(folders[i].length()-1).equals(File.separator)) 
              folders[i] = folders[i].substring(0, folders[i].length()-1);
    }
    nms[6] = Toolbox.emsgs(orgnum,357);
    nms[7] = Toolbox.emsgs(orgnum,356);
    boolean b = true;
    for (int i=0; i < 5; i++)
       for (int j = 0; j < i; j++)
       {
           if  ( i == 2 && j == 1 || folders[i].equals("") || folders[j].equals("")) 
               continue;
           if (folders[i].toLowerCase().equals(folders[j].toLowerCase()))
           {     
               out.print(nms[i] + Toolbox.emsgs(orgnum,352) + nms[j] + Toolbox.emsgs(orgnum,353));
               return;
           }
       }
    
    long ll = 20000000;
    if(!folders[4].equals("")) ServerAgent.workingFolder = folders[4];
    if (folders[5] != null)
    try{ ll = Long.parseLong(folders[5].replaceAll(",",""));}catch(Exception e){ll=20000000;}
    UploadFile.MaxUploadSize = ll;
    try{
        Toolbox.dbadmin[orgnum%65536].webFileLength = Long.parseLong(folders[6]);
    } catch(Exception e)
    {
       folders[6]="1000000000";Toolbox.dbadmin[orgnum%65536].webFileLength = 1000000000;
    }
    try{
        Toolbox.dbadmin[orgnum%65536].webFileLength1 = Long.parseLong(folders[7]);
    } catch(Exception e)
    {
     folders[7]="1000000";
     Toolbox.dbadmin[orgnum%65536].webFileLength1 = 1000000;
    }
    if (folders[1] != null  &&   folders[2]  != null)
    {
        long timenow = System.currentTimeMillis()/1000;
        for (int i=1; i < 4; i++) 
            folders[i] = folders[i].replaceAll("'","''").replaceAll("\\\\","\\\\");
        forbackup(folders,orgnum);
        str = Toolbox.dbadmin[orgnum%65536].setxml(folders[0],folders[1], folders[2], folders[6], folders[7], folders[5], folders[4], folders[3]); 

        (new File(folders[1] + File.separator + "attach")).mkdir();
         %>
         <div>
        <%=Toolbox.title(Toolbox.emsgs(orgnum,171))%>  <br>
       <table >
           <tr> <td><nobr><%=Toolbox.emsgs(orgnum,1405)%><td> = <td> <%=Toolbox.dbadmin[orgnum%65536].websiteFolder%> </td></tr>
           <tr> <td><nobr><%=Toolbox.emsgs(orgnum,349)%><td> = <td> <%=Toolbox.dbadmin[orgnum%65536].dbFileFolder%> </td></tr>
       <tr> <td><nobr><%=Toolbox.emsgs(orgnum,347)%><td> = <td> <%=Toolbox.dbadmin[orgnum%65536].webFileFolder%> </td></tr>
        <tr> <td><nobr><%=Toolbox.emsgs(orgnum,348)%><td> = <td> <%=Toolbox.dbadmin[orgnum%65536].webFileFolder1%> </td></tr>
        <tr> <td><nobr><%=Toolbox.emsgs(orgnum,351)%><td> = <td> <%=UploadFile.MaxUploadSize%></td></tr>
       <tr> <td><nobr><%=Toolbox.emsgs(orgnum,350)%><td> = <td> <%=ServerAgent.workingFolder%> </td></tr>
       <tr> <td><nobr><%=Toolbox.emsgs(orgnum,356)%><td> = <td> <%=Toolbox.dbadmin[orgnum%65536].webFileLength1%></td></tr>
       <tr> <td><nobr><%=Toolbox.emsgs(orgnum,357)%><td> = <td> <%=Toolbox.dbadmin[orgnum%65536].webFileLength%> </td></tr>
       </table>
         </div>
       <script > 

       parent.myprompt(  document.getElementsByTagName('div')[0].innerHTML  );    

        </script>   

        <%
     }
     else
     {
        // if ( folders[3].equals("")) out.print(Toolbox.emsgs(orgnum,354));
         %>
         <script > 

       parent.myprompt("<br><%=Toolbox.emsgs(orgnum,360)%><br>  <%=str%>");    

        </script>   

             
         <%
     }
%>
<br>
<input class=GreenButton type=button value=Close onClick="var win=window.open('','_top','',true);win.opener=true;win.close();"> 
<%
return;
}

String style = Toolbox.butstyle(cachedstyle.fontsize); 
int i = 1;
%>


<form rel=opener name=form1 method=post action=cfgfolders.jsp onsubmit="return check()"  > 
    
<table>
    <%=Toolbox.title(Toolbox.emsgs(orgnum,171),1)%> 
<tr><td>

<script type="text/javascript" >document.write(round1('100%'));</script>
<TABLE width=100% border=0 cellpadding=3 cellspacing=1  class=outset3  >
<tr><td> <%= i++%>. </td><td> <%=Toolbox.emsgs(orgnum,1405)%>  
<tr><td>   </td> <td>
<input name=websiteFolder class="enter"   value="<%=Toolbox.dbadmin[orgnum%65536].websiteFolder%>" onkeypress="return chcolor()" onblur=nojs(this)  size=55>
</td></tr>
    
    
<tr><td> <%= i++%>. </td><td> <%=Toolbox.emsgs(orgnum,349)%> (<%=Toolbox.emsgs(orgnum,361)%>) 
<tr><td>   </td> <td>
<input name=dbFileFolder class="enter"   value="<%=Toolbox.dbadmin[orgnum%65536].dbFileFolder%>" onkeypress="return chcolor()" onblur=nojs(this)  size=55>
</td></tr>

<tr><td><%= i++%>. </td><td> <%=Toolbox.emsgs(orgnum,347)%> (<%=Toolbox.emsgs(orgnum,362)%>)<tr><td>   </td> <td>
<input name=webFileFolder class="enter"  value="<%=Toolbox.dbadmin[orgnum%65536].webFileFolder%>" onkeypress="return chcolor()" onblur=nojs(this)  size=55>
</td></tr>

<tr><td><%= i++%>. </td><td> <%=Toolbox.emsgs(orgnum,357)%>  <tr><td>   </td> <td>
<input name=quota class="enter"   value="<%=Toolbox.dbadmin[orgnum%65536].webFileLength%>" onkeypress="return chcolor()" onblur=nojs(this)  size=55>
</td></tr>

<tr><td> <%= i++%>. </td><td> <%=Toolbox.emsgs(orgnum,348)%> (<%=Toolbox.emsgs(orgnum,363)%>)<input name="btn" type="button" class="OrangeButton" style="width:<%=cachedstyle.fontsize*4.2%>" value="<%=Toolbox.emsgs(orgnum,1551)%>" onclick="open('studentfolder.jsp','_self')">  </td></tr><tr><td>   </td> <td>
<input name=webFileFolder1 class="enter"   value="<%=Toolbox.dbadmin[orgnum%65536].webFileFolder1%>" onkeypress="return chcolor()" onblur=nojs(this)  size=55>
</td></tr>

                        <tr><td> <%= i++%> </td><td><%=Toolbox.emsgs(orgnum,356)%><tr><td>   </td> <td>
                                <input name=quota1  class="enter" value="<%=Toolbox.dbadmin[orgnum%65536].webFileLength1%>" onkeypress="return chcolor()" onblur=nojs(this)  size=55>
                        </td></tr>
                        
                        <tr><td> <%= i++%> </td><td><%=Toolbox.emsgs(orgnum,351)%><tr><td>   </td> <td>
                                <input name=MaxUploadSize class="enter"  value="<%=UploadFile.MaxUploadSize%>" onkeypress="return chcolor()" onblur=nojs(this)  size=55>
                        </td></tr>
                        
                        
                        
                        
                        
                        <tr><td> <%= i++%>. </td><td> <%=Toolbox.emsgs(orgnum,350)%> (<%=Toolbox.emsgs(orgnum,365)%>)<tr><td>   </td> <td>
                                        
                                        <input name=workingFolder  class="enter"  value="<%=ServerAgent.workingFolder%>" onkeypress="return chcolor()" onblur=nojs(this)  size=55>
                                </td></tr>
                                
                        </td></tr>
                    </table><script type="text/javascript" >document.write(round2);</script>
             
</td></tr>

<tr><td   align=center> <input name=submit type=submit value=<%=Toolbox.emsgs(orgnum,46)%> onclick=setact(1) class=OrangeButton <%=style%> > 

 <input name=backup type=submit value=<%=Toolbox.emsgs(orgnum,839)%> onclick=setact(2) class=GreenButton <%=style%> > 
</td></tr>
</table>

</form>
</center>
<center>
     <nobr><font style="font-size:12px" color=<%=cachedstyle.IBGCOLOR%> > <%= Toolbox.copyright[orgnum>>16]%></font> </nobr>
 </center> 

<script type="text/javascript" >

function setact(a)
{
    if (a==1)
    {
        document.form1.target = "w<%=tstmp%>";
        formnewaction(document.form1,"cfgfolders.jsp");
    }
    else  
    { 
        
        document.form1.target = "backupwf"; 
        formnewaction(document.form1,"DataTable?rdap=backupfolder&subdb=");
    }
}

function check()
{
   var  folders = new Array(5);
    folders[0] = document.form1.websiteFolder.value;
    folders[1] = document.form1.webFileFolder.value;
    folders[2] = document.form1.webFileFolder1.value;
     folders[3] = document.form1.dbFileFolder.value;
    if (folders[3] == null || folders[3] == '')
    {
        myprompt('<%=Toolbox.emsgs(orgnum,354)%>');
        document.form1.dbFileFolder.focus();
        return false;
    }
    var sl = '<%=File.separator%><%=File.separator%>';
    if (sl == '//') sl = '/';
    
     folders[4] = document.form1.workingFolder.value;
     var nms  = new Array('<%=Toolbox.emsgs(orgnum,346)%>', '<%=Toolbox.emsgs(orgnum,347)%>', 
'<%=Toolbox.emsgs(orgnum,348)%>', '<%=Toolbox.emsgs(orgnum,349)%>', '<%=Toolbox.emsgs(orgnum,350)%>');
    for (var i=0; i < 5; i++)
    {
           if ( folders[i] == null) folders[i] = '';
           if ( folders[i] != ''  && folders[i].substring(folders[i].length-1) == sl) 
              folders[i] = folders[i].substring(0, folders[i].length-1);
    }

    
     
    for (var  i = 0; i < 5; i++)
    for (var  j = 0; j < i; j++)
    {
           if  ( i == 2 && j == 1 || folders[i]=="" || folders[j]=="") 
               continue;
           if (folders[i].toLowerCase()==folders[j].toLowerCase())
           {     
               myprompt(nms[i] + ' <%=Toolbox.emsgs(orgnum,352)%> ' + nms[j] + '<%=Toolbox.emsgs(orgnum,353)%>');
               return false;
           }
   } 
   document.form1.websiteFolder.value = folders[0];
   document.form1.webFileFolder.value = folders[1];
   document.form1.webFileFolder1.value = folders[2];
   document.form1.dbFileFolder.value = folders[3];
    document.form1.workingFolder.value = folders[4];
   formnewaction(document.form1) ;
  // document.form1.target='w<%=tstmp%>';
   return true;
}
function nojs(t)
{
    t.value = removejs(t.value);
  }
function chcolor( )
{
   return true;
}

<%=Toolbox.msgjspout((orgnum%65536)+user.id,true)%>
</script>
<script type="text/javascript"  src=curve.js></script>     
<script type="text/javascript" >resizebut(document.form1,<%=cachedstyle.fontsize%>);</script>
<iframe name="w<%=tstmp%>" width="1" height="1" style="visibility: hidden"/>
</body>

</html>
