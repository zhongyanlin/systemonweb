
<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
       int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
        User user = null;
        if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.TEACHINGADMIN | Systemroles.SYSTEMADMIN | Systemroles.SYSTEMANALYST | Systemroles.ASSESSER,application,session,request, response, "schexecute.jsp", false)) == null)
        return;
        orgnum = user.orgnum; 
        String dept = Toolbox.defaultParam(orgnum,request,"dept", "", null, 30);
        String semester  = Toolbox.validate( Toolbox.defaultParam(orgnum,request, ("semester"), null), null, 30);
        if (semester == null){ out.print("semester not specified");return;}
        semester = semester.replaceAll("'","''");
        //semester = semester.replace("'", "''");
        String semesterName = Toolbox.validate( Toolbox.defaultParam(orgnum,request, ("semesterName"), null), null, 40);
        if (semesterName == null){ out.print("semester not specified");return;}
        
        JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
        Scheduler sch = null;
        
        String deptstr = "";
        if (!dept.equals(""))
            deptstr = " Schuser.dept =  '" + dept +"' AND ";
        int n = adapter.executeQuery("SELECT firstname, lastname,Schuser.maxload,Schuser.realload, AppUser.id FROM AppUser,Schuser where " + deptstr +"    AppUser.id=Schuser.id and Schuser.semester=" + semester.replaceAll("'","''") +" order by lastname");
        if (adapter.error().length() > 0) 
        {
            adapter.close(); 
            String err = (adapter.error()); out.print(err); return;
        }
        if (n<1) {adapter.close(); out.print("no instructor. n=" + n +", semester=" + semester); return;}
        String [] names = new String[n];
        String seats[] = new String[n];
        String [] iids = new String[n];
        HashMap mapr = new HashMap();
        for (int i = 0; i < n; i++)
        {
            names[i] = Toolbox.makeFullName( adapter.getValueAt(i,1),"", adapter.getValueAt(i,0));
            seats[i] = adapter.getValueAt(i,3) +"/" +adapter.getValueAt(i,2);
            mapr.put(adapter.getValueAt(i,4),""+i);
            iids[i] = adapter.getValueAt(i,4); 
        }
        deptstr = "";
        if (!dept.equals(""))
            deptstr = " Schtime.dept =  '" + dept +"' AND ";

        int m = adapter.executeQuery("SELECT TimeSlot.timeSlot, TimeSlot.num FROM TimeSlot, Schtime WHERE " + deptstr
                +"  Schtime.num=TimeSlot.num AND Schtime.semester=" + semester +" order by TimeSlot.num");
        if (m<1) {adapter.close(); out.print("no time slots");return;}
        String [] slots = new String[m];
       // int snums[] = new int[n];
        HashMap maps = new HashMap();
        for (int i = 0; i < m; i++)
        {
            slots[i] = adapter.getValueAt(i,0);
            maps.put(adapter.getValueAt(i,1), ""+i);
        }
        deptstr = "";
        if (!dept.equals(""))
            deptstr = " dept =  '" + dept +"' AND ";
        int k = adapter.executeQuery("SELECT distinct num1 FROM Scheduler  WHERE  " + deptstr +" (which='i' or  which='j' or which='k') and semester=" + semester + " order by num1");
        HashMap maph = new HashMap();
        String [][] y = null;
        if (k >= 1) 
        { 
            y = new String[k][];
            for (int l = 0; l < k; l++)
            {
                y[l] = new String[4];
                y[l][0] = adapter.getValueAt(l,0);
                maph.put(y[l][0],""+l);
            }
        }
        k = adapter.executeQuery("SELECT num1,num2 FROM Scheduler  WHERE " + deptstr +" which='i'  and semester=" + semester + "  order by num1");
        Object t = null;
        
        int ll;
        for (int l = 0; l < k; l++)
        {
            if ( (t=maph.get(adapter.getValueAt(l,0)))!=null)
                y[Integer.parseInt((String)(t))][1] = adapter.getValueAt(l,1);
        }
        k = adapter.executeQuery("SELECT num1,num2 FROM Scheduler  WHERE " + deptstr +" which='j'  and semester=" + semester + "  order by num1");
        
        for (int l = 0; l < k; l++)
        {
              if ( (t=maph.get(adapter.getValueAt(l,0)))!=null)
                 y[Integer.parseInt((String)(t))][2] = adapter.getValueAt(l,1);
        }
        k = adapter.executeQuery("SELECT num1,num2 FROM Scheduler  WHERE " + deptstr +" which='k'  and semester=" + semester + "  order by num1");
        
        for (int l = 0; l < k; l++)
        {
             if ( (t=maph.get(adapter.getValueAt(l,0)))!=null)
                 y[Integer.parseInt((String)(t))][3] = adapter.getValueAt(l,1);
        }
        
        String [][] x = new String[n][];
        for (int i=0; i < n; i++)
        {
            x[i] = new String[m];
            for (int j = 0; j < m; j++)
            {
               x[i][j] = ""; 
            }
        }
        
        
        for (int l = 0; l < k; l++)
        {
             String z = y[l][3];
             if (z == null) continue;
             t =  (maps.get(z));
             if (t==null) continue;
             int j = Integer.parseInt((String)(t));
             z = y[l][1];
             if (z==null) continue;
             t =  (mapr.get(z));
             if (t==null) continue;
             int i = Integer.parseInt((String)(t));
             String str = y[l][2]; 
             if (str==null || dept.equals("")) str = "";
             x[i][j] =  y[l][0]+"</nobr><br>"+str;
        }
        adapter.close();
        
%>

<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
  <%=Toolbox.getMeta(orgnum)%> 
 <%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
 <link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
 <script type=text/javascript><%= Toolbox.dbadmin[orgnum].colors(orgnum, cachedstyle)%>,securitytoken="<%=Toolbox.gentoken("index.jsp","f1")%>"; 
</script  type=text/javascript><script><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >
    document.write(unifontstyle(<%=cachedstyle.fontsize%>));
    function open1(x,i)
        {
          var y = x.lastIndexOf("-");
           
          var courseid = x.substring(0,y);
          var session = x.substring(y+1).replace(/ .*/,'');
           
           postopen('DataFormHTML',['rdap','Semester','Session','CourseId','subdb'],['Syllabusi','<%=semesterName%>',session,courseid,''],'_blank');
         // window.open("DataFormHTML?rdap=Syllabusi&Session=" + session
         // +"&CourseId=" + courseid + "&Semester=<%=semesterName%>&subdb=", 'ss',
         // dim(700,600) );
        }
    </script>
</head>                  
<body  >
 <center>
     <%=Toolbox.title(Toolbox.emsgs(orgnum,959))%> 
<TABLE cellpadding=0 cellspacing=0><tr height=5><td></td></tr></table>
<script type="text/javascript" >document.write(round1('100%'));</script>
<TABLE cellpadding=1 cellspacing=0 border=0 class=outset3 ><tr><td>
<table align=center cellpadding=1 cellspacing=1 border=0 >
<tr><td style="background:url(image/bheading.gif)"></td><td bgcolor=#00DDDD width=100><nobr><%=Toolbox.emsgs(orgnum,1042).replaceFirst("/","/</nobr><br><nobr>")%></nobr></td>
<%
 int nz[] = new int[m];
 int na = 0, nb = 0;
 for (int i = 0; i < m; i++)
 {
    out.print("<td style=\"background:" + Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle) +"\"><b>" + slots[i].replaceAll("([A-Z])([0-9])","$1<br>$2") + "</td>");
 }
 out.print("</tr>");
 for (int i = 0 ; i < n; i++)
 {
      na += Integer.parseInt(seats[i].replaceFirst("\\/.*", ""));
      nb += Integer.parseInt(seats[i].replaceFirst("[0-9]+\\/", ""));
      out.print("<tr><td style=\"background:" + Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle) +"\"><b><nobr>" + names[i] +"</nobr></td><td  bgcolor=#00DDDD align=center>" + seats[i]  +"</td>");
      for (int j = 0; j < m; j++)
      {
         if (x[i][j].equals(""))
             out.print("<td bgcolor=white valign=center align=center> </td>");     
         else
         {
             nz[j]++;
             out.print("<td bgcolor=silver  valign=center align=center><A href=javascript:open1('" + x[i][j].replaceFirst("<.*","") +  "')><b><nobr>" + x[i][j] +"</b></a></td>");
         }
      }
      out.print("</tr>");
 }
 
%>
<tr><td style="background:url(image/bheading.gif)"></td><td bgcolor=#00DDDD width=100  align=center><%=Toolbox.emsgs(orgnum,238)+ ((100*na)/nb) %>% </td>
<%  for (int j = 0; j < m; j++)
 out.print("<td bgcolor=" + cachedstyle.BBGCOLOR +" align=right><b>" + nz[j]  + "</td>");
%>
</tr></table></td></tr></table>
<script type="text/javascript" >document.write(round2);</script>
</center>
<script type="text/javascript"  src=curve.js></script>     

</body></html>
        
            
