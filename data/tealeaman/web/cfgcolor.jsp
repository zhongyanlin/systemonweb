<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (  (user = User.authorize(orgnum, Systemroles.SYSTEMADMIN,application,session,request, response, "cfgcolor.jsp", true)) == null )
    return;
orgnum = user.orgnum; 

    String dc =  Toolbox.defaultParam(orgnum,request,"MainBackground",null, null, 20);
    if (dc==null) {out.print("MainBackground not passed");return;}
    if (dc.charAt(0) !='#') dc = '#'+dc;
    String ic =  Toolbox.defaultParam(orgnum,request,"MenuBackground",null,null, 20);
    if (ic==null) {out.print("MenuBackground not passed");return;}
    if (ic.charAt(0) !='#') ic = '#'+ic;
    String bc =  Toolbox.defaultParam(orgnum,request,"TableLineColor",null,null,20);
    
    if (bc==null) {out.print("TableLineColor not passed");return;}
    if (bc.charAt(0) !='#') bc = '#'+bc;
    String tc =  Toolbox.defaultParam(orgnum,request,"TableCellColor",null,null,20);
     if (tc==null)tc =  Toolbox.defaultParam(orgnum,request,"TableCellColor",null,null,20);
    if (tc==null) {out.print("TableCellColor not passed");return;}
    if (tc.charAt(0) !='#') tc = '#'+tc;
        

%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
   <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
    <%=Toolbox.unifontstyle(cachedstyle.fontsize,orgnum)%>
   
    <%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
    <script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
</head>
<body   >
<table width=100% height=100% cellpadding=0 cellspacing=0 border=0>
    <tr><td bgcolor=<%=ic%> width=222 valign=top align=center>
           
            <font color=#DDCC11 size=+2>Index Color=<%=ic%> </font><br><br>
            <TABLE width=210 border=0 class="outset" cellpadding=1 cellspacing=0>                                                
                <TR><TD valign=TOP> 
                        <TABLE width=100% border=0 cellpadding=3 cellspacing=1 bgcolor=<%= ic %>>
                            <TR><TD>
                            <% for (int i=1; i < 7; i++){%>
                                  <img src=image/tri.gif ><font color=white><%=Toolbox.emsgs(orgnum,326)%> <%= i%> </font><br>
                            <% } %> 
        <%for (java.util.Enumeration e=request.getParameterNames(); 
            e.hasMoreElements();    )
        {
           Object x = e.nextElement();
           String pname = (String)x;
          // out.println(pname + "=" + Toolbox.defaultParam(orgnum,request, (pname), null) +"<br>" );
        } 
        
           %>
           
                                    </TD></TR></TABLE>
            </TD></TR></TABLE>
        </td><td bgcolor=<%=dc%>  valign=top align=center>
            <br> 
            <TABLE width=92% border=0    cellpadding=3 cellspacing=1 bgcolor=<%= ic %> >
                <TR><TD align=center>
                        <font color=#DDCC11 size=+2> <%=Toolbox.emsgs(orgnum,15)%> </font> <br>
            </TD></TR></TABLE> <br><br>
            
            <%=Toolbox.emsgs(orgnum,302)%> = <%=dc%>  <br><br>
            <div style="background-color:<%=bc%>" > <%=Toolbox.emsgs(orgnum,303)%> = <%=bc%> </div> <br>
            <script type="text/javascript" >document.write(round1('100%'));</script>
            <TABLE width=100% border=0 class=outset3 bgcolor=<%=bc%> cellpadding=1 cellspacing=0>
                <TR><TD valign=TOP width="100% "> 
                        <TABLE width=100% border=0 cellpadding=3 cellspacing=1 >
                            <TR><TD bgcolor=<%=bc%> > <%=Toolbox.emsgs(orgnum,719)%> 1 <%=bc%></td><td bgcolor=<%=bc%>><%=Toolbox.emsgs(orgnum,719)%> 2 <%=bc%></td></tr>
                            <TR><TD bgcolor=<%= tc %>> <%=Toolbox.emsgs(orgnum,325)%>=<%=tc%> </td><td bgcolor=<%= tc %>> <%=Toolbox.emsgs(orgnum,325)%>=<%=tc%> </td></tr>  
                        </TABLE>
            </TD></TR></TABLE>    
            <script type="text/javascript" >document.write(round2);</script>
</td></tr></table>
<center>
     <nobr><font style="font-size:12px" color=<%=cachedstyle.IBGCOLOR%> > <%= Toolbox.copyright[orgnum>>16]%></font> </nobr>
 </center>
<script type="text/javascript" >
 <%= Toolbox.msgjspout((orgnum%65536)+user.id, true)%>
</script>
<script type="text/javascript"  src=curve.js></script>     

</html>


