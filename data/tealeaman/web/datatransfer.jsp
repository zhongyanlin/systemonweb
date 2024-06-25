<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
%>
<%!  void sort(int [] a, String t[], String d[], int N)
      {
           bsort(a, t, d, N); 
           swap(a, t, d, N); 
      }
     void swap(String [] t, int i , int j)
     {
         String tmp = t[i]; t[i] = t[j]; t[j] = tmp;
     }
     void  swap(int [] a, String t[], String d[], int N)
     { 
           String [] b = new String[N];
           for (int i = 0; i < N; i++) 
              b[i] = t[i];
            for (int i = 0; i < N; i++) 
              t[i] = b[a[i]];
             for (int i = 0; i < N; i++) 
              b[i] = d[i];
            for (int i = 0; i < N; i++) 
              d[i] = b[a[i]];
     }
      
        
     void  bsort(int [] a, String t[], String d[], int N)
     {  
           for (int p = 1; p <  N; p++) 
           for (int j = 0; j <  N  - p; j++) 
              if (d[a[j]].indexOf("REFERENCES " + t[a[j+1]]) >= 0) 
              {
                 
                  int tmp = a[j];a[j] = a[j+1];a[j+1] = tmp;
              }
     } 
     String pad(String str, int n)
     {
        int i=str.length(); 
        if ( n < i ) return str.substring(0,n);
        for ( ; i < n; i++)
           str +="&nbsp;";
        return str;
     }
    
     String allfields(String [] fs)
     {
         String str = ""; for (int i=0; i< fs.length; i++){ str += fs[i].replaceFirst(" .*",""); if (i < fs.length-1) str +=",";}
         return str;
     }
     String[] quote(String [] fs, String dbms)
     {
         String []ans = new String[fs.length];
         for (int i=0; i < fs.length; i++)
         {
             int j = fs[i].indexOf(" "); 
            
             ans[i] = (Toolbox.isnumeric(fs[i].substring(j+1),dbms))?"":"'";

         }
         return ans;
     }
     
     String [] findfds(String x)
     {
          Pattern ab= Pattern.compile("[a-z|A-Z][^,]*");
          x = DbTable.findfds0(x, ab);
          String [] fds = x.split(","); 
          for (int  i = 0; i < fds.length ; i++)
          {
              fds[i] = fds[i].replaceFirst("[ ]*NOT NULL","").trim();
          }
          return fds;
     }
     String translate(String csql, JDBCAdapter source, JDBCAdapter destin)
     {
           int sindex = Toolbox.begintranslate(source);
           int tindex = Toolbox.begintranslate(destin);
           return Toolbox.translateStr(csql,sindex,tindex);
     }
 
%>
<%
 
User user = null;
if (  (user = User.authorize(orgnum, Systemroles.SYSTEMANALYST,application,session,request, response, "datatransfer.jsp", false)) == null || !Toolbox.verifytoken(request)) 
    return;
orgnum = user.orgnum; 
long tstmp = System.currentTimeMillis()%10000000;
String title= Toolbox.emsgs(orgnum,857);

%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
    
<%=Toolbox.getMeta(orgnum)%><title><%=title%></title>
<%
String style="style=width:" + (cachedstyle.fontsize*8) + "px;padding:0px";
String which= Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("which"), null), null,3);
if (which==null)
{%>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
<style type="text/css">
input.enter {background-color:<%=cachedstyle.TBGCOLOR%>;border:1px #b0b0b0 solid }
</style>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("datatransfer.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>

</head>
<body bgcolor=<%= cachedstyle.DBGCOLOR %>  >
 


<form rel=opener name=form1 stype="margin:0px 0px 0px 0px" target="w<%=tstmp%>" action=datatransfer.jsp >  
 
<table align=center class=outset3  border=0  cellpadding=1 cellspacing=0>
  <%=Toolbox.title(Toolbox.emsgs(orgnum,940),1)%>  
    <tr><td>
    <table BORDER=0 cellspacing=1 width=100%   bgcolor=<%=cachedstyle.DBGCOLOR%> >
    <tr><td>
            <table>
                    <tr>
                        <td >
                            <table width=100% class=outset border=0 bgcolor="<%= cachedstyle.IBGCOLOR %>" cellpadding=1 cellspacing=0>
                                <tr>
                                    <td colspan=2 align=center>
                                        <font color=#DDCC11> <%=Toolbox.emsgs(orgnum,173)%> <b>A</b> </font>
                                    </td>
                                </tr>
                                <TR>
                                    <td  valign=top> 
                                        <table width=100% height=23 border=0 cellpadding=0 cellspacing=1 bgcolor=<%= cachedstyle.DBGCOLOR %>>
                                            <TR>
                                                <TD valign=TOP > 
                                                    <table>
                                                        <tr><%=Toolbox.fields(Toolbox.emsgs(orgnum,941),orgnum, cachedstyle)%><td><input name=servera class="enter" value="<%=Toolbox.dbadmin[orgnum%65536].sysDBConnectInfo().server%>"  style=width:250px></td></tr>
                                                        <tr><%=Toolbox.fields(Toolbox.emsgs(orgnum,942),orgnum, cachedstyle)%>
                                                        <td><SELECT name=drivera style="width:250px;border:1px #b0b0b0 solid !important;" >
                                                                    <% for (int i = 0; i < Toolbox.dbadmin[orgnum%65536].numHosts; i++)
                                                                    out.print("<OPTION value=\"" + Toolbox.dbadmin[orgnum%65536].dbhost[i].driver +"\">" + Toolbox.dbadmin[orgnum%65536].dbhost[i].driver +"</OPTION>");
                                                        %> </SELECT></td>
                                                        </tr>
                                                        <tr><%=Toolbox.fields(Toolbox.emsgs(orgnum,823),orgnum, cachedstyle)%><td><input name=usera   class="enter" size=15></td></tr>
                                                        <tr><%=Toolbox.fields(Toolbox.emsgs(orgnum,164),orgnum, cachedstyle)%><td><input name=passworda  class="enter" type=password  size=15><input name=passworda1 type=hidden></td></tr>
                                                        <tr>
                                                            <td colspan=2 align=center>
                                                                <input  class=GreenButton   type=button name=btna value="<%=Toolbox.emsgs(orgnum,38)%>" onclick=showtable(0)> <br>
                                                                <select name=tablelista   
                                                                style="font-family:courier;font-weight:680;width:200px;border:1px #b0b0b0 solid  !important;"
                                                                    size=10   ondblclick=fill(0)>
                                                                   <option value="">                         </option>
                                                                   </select>
                                                            </td>
                                                        </tr>
                                                        
                                                        <tr>
                                                            <td colspan=2 align=center>
                                                                <input  class=GreenButton   type=button name=btna1 value="<%=Toolbox.emsgs(orgnum,943)%>" onclick=fill(0)><br>
                                                                <select name=tablea  style="font-family:courier;font-weight:700;width:200px;border:1px #b0b0b0 solid !important;"   size=10  onchange=choose(0)  ><option value="">                         </option></select>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td> 
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table> 
                            
                        </td>
                        <td align=center >
                            <input class=GreenButton name=l2r1  <%=style%> type=button value=" <%=Toolbox.emsgs(orgnum,944)%> >" onClick="partial(0)"> 
                            <input class=GreenButton name=r2l1  <%=style%> type=button value="< <%=Toolbox.emsgs(orgnum,944)%>" onClick="partial(1)"><br> 
                            <input class=GreenButton name=l2r   <%=style%> type=button value="<%=Toolbox.emsgs(orgnum,945)%> >>" onClick="direct(0,'>>')"> 
                            <input class=GreenButton name=r2l   <%=style%> type=button value="<< <%=Toolbox.emsgs(orgnum,945)%> " onClick="direct(1,'>>')"><br> 
                            <input class=GreenButton name=l2r2 <%=style%> type=button value="<%=Toolbox.emsgs(orgnum,946)%> ->" onClick="direct(0,'->')"> 
                            <input class=GreenButton name=r2l2 <%=style%> type=button value="<- <%=Toolbox.emsgs(orgnum,946)%>" onClick="direct(1,'->')"><br><br>
                            <textarea name=scripts style="border:1px #b0b0b0 solid" rows=29 cols=50  class="enter" ></textarea><br><br>
                            <input type=hidden name=which>
                            <input class=OrangeButton type=button name=commit    value="<%=Toolbox.emsgs(orgnum,727)%>" onClick="showtable(2)">
                        </td> 
                        <td  >
                            <table width=100% class=outset border=0 bgcolor="<%= cachedstyle.IBGCOLOR %>" cellpadding=1 cellspacing=0>
                                <tr>
                                    <td colspan=2 align=center valign=top>
                                        <font color=#DDCC11> <%=Toolbox.emsgs(orgnum,173)%> <b>B</b> </font>
                                    </td>
                                </tr>
                                <TR>
                                    <TD valign=TOP > 
                                        
                                        <table width=100% height=23 border=0 cellpadding=2 cellspacing=1 bgcolor="<%= cachedstyle.DBGCOLOR %>" >  <% user.changedb(user.id);%>
                                                                                                                                           <TR>
                                                <td width=160  valign=top>
                                                    <table>
                                                        <tr><%=Toolbox.fields(Toolbox.emsgs(orgnum,941),orgnum, cachedstyle)%><td><input name=serverb  class="enter" value="<%=user.getDBConnectInfo().server%>"  style="width:250px"></td></tr>
                                                        <tr><%=Toolbox.fields(Toolbox.emsgs(orgnum,942),orgnum, cachedstyle)%><td> <select name=driverb  class="enter"  style="width:250px;border:1px #b0b0b0 solid !important;">
                                                                    <% for (int i = 0; i < Toolbox.dbadmin[orgnum%65536].numHosts; i++)
                                                                    out.print("<OPTION value=\"" + Toolbox.dbadmin[orgnum%65536].dbhost[i].driver +"\">" + Toolbox.dbadmin[orgnum%65536].dbhost[i].driver +"</OPTION>");
                                                        %> </SELECT></td></tr>
                                                        <tr><%=Toolbox.fields(Toolbox.emsgs(orgnum,823),orgnum, cachedstyle)%><td><input name=userb  class="enter"  size=15></td></tr>
                                                        <tr><%=Toolbox.fields(Toolbox.emsgs(orgnum,164),orgnum, cachedstyle)%><td><input name=passwordb  class="enter" type=password   size=15><input name=passwordb1 type=hidden></td></tr>
                                                        
                                                        <tr>
                                                            <td colspan=2 align=center valign=top> 
                                                                <input  class=GreenButton   type=button  name=btnb value="<%=Toolbox.emsgs(orgnum,38)%>" onclick=showtable(1)><br>
                                                                <select name=tablelistb 
                                                                style="font-family:courier;font-weight:680;width:200px;border:1px #b0b0b0 solid !important;"  size=10  ondblclick="fill(1)">
                                                                    <option value="">                         </option></select>
                                                            </td>
                                                        </tr>
                                                        
                                                        <tr>
                                                            <td colspan=2 align=center valign=top> 
                                                                <input  class=GreenButton   type=button  name=btnb1 value="<%=Toolbox.emsgs(orgnum,943)%>" onclick="fill(1)"><br>
                                                                <select name=tableb  style="font-family:courier;font-weight:680;width:200px;border:1px #b0b0b0 solid !important;" size=10  onchange=choose(1)><option value="">                         </option></select>
                                                            </td> 
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table> 
                         </td>
                    </tr>
                </table>
</td></tr>
</table>
</td></tr></table>
 
<table align=center> <tr><td aliagn=center> 
   <nobr><font style="font-size:12px" color=<%=cachedstyle.IBGCOLOR%> > <%= Toolbox.copyright[orgnum>>16]%></font></nobr>
</td></tr> </table>
</form> 
<script type="text/javascript"  src=encryption.js></script> 
<script type="text/javascript" >
var encoding='<%=Toolbox.encodings[orgnum>>16]%>'; 
var langcode = "<%= Toolbox.langs[orgnum>>16]%>";
var font_size = <%=cachedstyle.fontsize%>;
serCharSize(<%=Toolbox.locales[orgnum>>16].charsize%>);
setServerkeys('<%=Toolbox.decrsa[Toolbox.locales[orgnum>>16].charsize-1].publickey()%>'); 
resizebut(document.form1,font_size);
</script>
<script  type="text/javascript"  src=datatransfer.js></script> 
<script type="text/javascript"  src="curve.js"></script>
<iframe name="w<%=tstmp%>" height="1px" width="1px" style="visibility:visible" /> 
 
</body>
</html>
<%
   
} 
else 
{
    String severa = Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("servera"), null), ":\\/@#$%~?=&", 80);
    String drivera = Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("drivera"), null), ".", 60);
    String usera = Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("usera"), null), null, 30);
    String passworda0 =  Toolbox.defaultParam(orgnum,request, "passworda1", null) ;
    String passworda = Toolbox.decrypt(passworda0,orgnum);
    String severb = Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("serverb"), null), ":\\/@#$%~?=&", 80);
    String driverb = Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("driverb"), null), ".", 60);
    String userb = Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("userb"), null), null, 40);
    String passwordb0 = Toolbox.defaultParam(orgnum,request, ("passwordb1"), null);
    String passwordb = Toolbox.decrypt(passwordb0,orgnum);
     
    if (which.equals("1") || which.equals("0"))
    {
      JDBCAdapter adapter = null;
      if (which.equals("0"))
      {
           adapter = new JDBCAdapter(severa, drivera, usera, passworda,orgnum);
      }
      else
      {
            adapter = new JDBCAdapter(severb, driverb, userb, passwordb, orgnum);
      }
      String err = adapter.error();
 
      if (err.length() > 0)
      { 
          adapter.close();
          out.print("</head><body><script>parent.myprompt('" + err.replaceAll("'","\\'").replaceAll("\n"," ") + "');</script></body></html>");
          return;
      }
 
      String [] usertables = adapter.tableList();
      if (usertables == null || usertables.length == 0)
      { 
          adapter.close();
 
          out.print("</head><body><script>parent.myprompt('Empty DB');</script></body></html>");
          return;
      }
      int numTables = usertables.length;
      String [][] fields = new String[numTables][];
      int j = 0; 
      int i = 0;
      for ( i = 0; i < numTables; i++) 
      {
          String def = adapter.tabledef(usertables[i],null);
          if (def!=null && !def.equals(""))
            fields[i] = findfds(def);
          else
            fields[i] = null;
          if (fields[i]==null)
          {
             for(int k=i; k < numTables-1; k++)
                usertables[k] = usertables[k+1];
             i--;numTables--;
          }
      }
      adapter.close();
%>
      </head><body>
      <script type="text/javascript" >
      
      var usertables = new Array(<%=numTables%>);
      var fields = new Array(<%=numTables%>);
<%
      for (i = 0; i < numTables; i++) 
      {
%>
         usertables[<%=i%>] = "<%=usertables[i]%>";

         fields[<%=i%>] = new Array(<%=fields.length%>);

<%       if (fields[i]!=null)
          for (j=0; j < fields[i].length; j++)
{
%>          
           fields[<%=i%>][<%=j%>] = "<%=fields[i][j]%>";
<%
}
      }
%>
      if (usertables.length == 0 || fields.length == 0)
      {
          parent.myprompt('Empty db');
      }
      else 
      {  
          parent.getThem(<%=which%>,usertables,fields);
         // var win=window.open('','_top','',true);
         // win.opener=true;
         // win.close();
      }
      </script></body></html>
<%
      
     }
     else // transfer
     {
       out.println("</head><body>"); 
       
       String  scripts =  Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("scripts"), null), ":-><", -1);
       out.print(scripts.replaceAll("\n","<br>") +"<br>"); 
       JDBCAdapter adaptera = new JDBCAdapter(severa, drivera, usera, passworda, orgnum);
       if (!adaptera.error().equals("") )
       {
           out.println("<script type=\"text/javascript\" >alert('A is not good');</script>");
           return;
       }
       JDBCAdapter  adapterb = new JDBCAdapter(severb, driverb, userb, passwordb, orgnum);
       if ( !adapterb.error().equals(""))
       {
            adaptera.close();
            out.println("<script type=\"text/javascript\" >alert('B is not good');</script>");
            return;
        }
       JDBCAdapter source,destin;
       String fieldstr="", dfieldstr="";
       String [] rdaps = scripts.split("\n");
       int i=0, j;
       while (i < rdaps.length)
       {
           if (rdaps[i].indexOf(">>")==-1 &&rdaps[i].indexOf("->")==-1&& rdaps[i].indexOf(">") > 0)
           {
                while (i < rdaps.length-1 && rdaps[i+1].indexOf(" AS ") > 0 ) 
                {    
                    swap(rdaps, i, i+1); 
                    i++;
                }
           }
           i++;
       }
       String went = ""; int ii = 0;
       out.println("<script type=\"text/javascript\" >var err = new Array( );\nfunction geterr(x){return err[x];}</script>");
       for ( int l =0; l < rdaps.length; l++)
       {
            String str = rdaps[l];
          
            if ( (j = str.indexOf("->")) > 0)
            {
               if (str.charAt(0) == 'A') source = adaptera;
               else source = adapterb;
               if (str.charAt(j+2) == 'A') destin = adaptera;
               else destin = adapterb;
              
               String createsql = source.tabledef(str.substring(2,j),destin.dbms);
               //out.println("create=" + createsql);
               String create1 = createsql.replaceFirst(str.substring(2,j),str.substring(j+4));
               create1 = translate(create1,source,destin);
               //out.println("create=" + create1);
               int N= 1;
               if (destin.executeUpdate(create1) < 0 && destin.error().length()>0)
               {
                   //adaptera.close();adapterb.close(); 
                   //out.print(":\nCan not create table " +str.substring(j+4) + ":<br><font color=red>" + create1 +"</font><br>" );
 out.println("<script type=\"text/javascript\" > err[" + ii + "]=\"" + Generic.handle( create1) +
"\";</script> <a  href=javascript:debug(" + (ii ) +") >" + str.substring(j+4) + " " + Toolbox.emsgs(orgnum,990) + "</a><div   id=erranchor" + (ii++) +" ></div>");
                   N = 0;
               }
               if (N > 0)
                     went += "," + str.substring(j+4);
            }
           else if ( (j = str.indexOf(">>")) > 0)
           {
               
               if (str.charAt(0) == 'A') source = adaptera;
               else source = adapterb;
               if (str.charAt(j+2) == 'A') destin = adaptera;
               else destin = adapterb;
             
               String createsql = source.tabledef(str.substring(2,j),destin.dbms);
 
               String create1 = createsql.replaceFirst(str.substring(2,j),str.substring(j+4));
               
               if (destin.executeUpdate(create1)  < 0 && destin.error().length()>0)
               {
                   out.println("<script type=\"text/javascript\" > err[" + ii + "]=\"" + Generic.handle(destin.error()) +
"\";</script> <a  href=javascript:debug(" + (ii) +") >" + str.substring(j+4) + " " + Toolbox.emsgs(orgnum,990) + "</a><div  id=erranchor" + (ii++) +"></div>");
                   //out.print("Can not create table " +str.substring(j+4) + ":" + destin.error() +"<br>" );
               }
               if (1+1==2)
               {
 
                String [] fields = findfds(createsql);
                fieldstr = allfields(fields); 
              
                String []sq = quote(fields, destin.dbms);
                String retr = "SELECT " + fieldstr + " FROM " + str.substring(2,j);
                
                int m = 0;
            
                boolean bb = source.executeQuery2(retr,false);
                
                String sql;
                int N=0;  
               
                for (i=0; bb && source.getValueAt(i,0)!=null; i++) 
                {
                   m++;
                   sql = "INSERT INTO " + str.substring(j+4) +"(" + fieldstr + ") VALUES (";

                   for (int k =0; k < fields.length; k++)
                   {    
                        String tv = source.getValueAt(i,k);
                        if (tv==null)
                            sql += "NULL";
                        else
                            sql += sq[k] + tv.replaceAll("'","''") + sq[k];
                        if (k == fields.length-1) 
                            sql +=")"; 
                        else sql += ",";
                   }
                  
                   int v = destin.executeUpdate(sql);
                   if (v > 0) 
                       N++; 
                   else
                   {
                       out.println("<script type=\"text/javascript\" > err[" + ii + "]=\"" + Generic.handle(destin.error()) +
"\";</script> <a href=javascript:debug(" + (ii) +") >" + str.substring(j+4) + " " + Toolbox.emsgs(orgnum,990) + "</a><div   id=erranchor" + (ii++) +" ></div>");

                       
                   }
                 }
                 
                 out.print(str +":" + N + " " +  Toolbox.emsgs(orgnum,948));
                 if (N > 0)
                     went += "," + str.substring(j+4);
               }
                
                fieldstr="";
                dfieldstr = "";
           }
           else if ( (j = str.indexOf(">")) > 0)
           {
               if (str.charAt(0) == 'A') source = adaptera;
               else source = adapterb;
               if (str.charAt(j+1) == 'A') destin = adaptera;
               else destin = adapterb;
               
               String createsql = destin.tabledef(str.substring(j+3).trim(),destin.dbms);
               out.println(createsql+ "<br>");
               //out.println(dfieldstr);
               if (fieldstr==null || fieldstr.equals(""))
                   out.println(Toolbox.emsgs(orgnum,949) + rdaps[i] + "<br>");
               else
               {
               String [] fields = findfds(createsql);
              // for (i=0; i < fields.length; i++) 
              //    out.println("fields["+i+"]=" + fields[i]+"<br>");
               String [] dfieldarr = dfieldstr.split(",");
               // for (i=0; i < dfieldarr.length; i++) 
               //    out.println("dfieldarr["+i+"]=" + dfieldarr[i]+"|<br>");
               String [] fieldarr = fieldstr.split(",");
               //for (i=0; i <  fieldarr.length; i++) 
               //    out.println(" fieldarr["+i+"]=" +  fieldarr[i]+"<br>");
               String [] sq = quote(fields,destin.dbms);
               //for (i=0; i <  sq.length; i++) 
               //    out.println( fields[i] +"=" +  sq[i]+"<br>");
               int m = 0;
               boolean bb = source.executeQuery2("SELECT  " +  fieldstr + "  FROM " + str.substring(2,j),false);
               if (!bb){ out.println(" source field:" + fieldstr); m=0;}
               out.println("<script type=\"text/javascript\" >var err = new Array( );\n");
               int N= 0;
               String nums="";
               String sqt, sql;  
               boolean good=true;
               for (i=0; source.getValueAt(i,0)!=null;  i++) 
               {
                   m++;
                   good = true;
                   sql = "INSERT INTO " + str.substring(j+3) +"(" + dfieldstr + ") VALUES (";
                   for (int k =0; k < fieldarr.length; k++)
                   {   
                       int z = 0; 
                       while (z < fields.length && fields[z].indexOf(dfieldarr[k]+" ") < 0 )z++; 
                       if (z==fields.length)
                       {   
                           good = false; 
                         //  out.println("err[" + i + "]=\"|"+dfieldarr[k]  + "| is an incorrect\";");
                           nums +="" + i +",";
                           break;
                       }     
                      // if (dfieldarr[k].equals("title"))out.println("err[" + i + "]=\"" + fields[z]+ " contains " + dfieldarr[k] + " sq=" + sq[z] +"\n\n\";");
                       
                       String vl = source.getValueAt(i,k);
                       if (vl==null)
                       {
                           if (sq[z].equals("'")) 
                               vl="";
                           else 
                               vl="NULL";
                       }
                       else
                       {
                           vl = vl.replaceAll("'","''");
                       }

                       sql += sq[z] + vl + sq[z];
                       if (k == fieldarr.length-1) 
                          sql +=")"; 
                       else 
                          sql += ",";
                   }
                   if (good==false) continue;
                   int v = destin.executeUpdate(sql);
                   if (v < 1) 
                   {         
                       out.println("err[" + (ii++) + "]=\"" + Generic.handle1(/*sql + "\n" +*/ destin.error()) +"\";");
                       nums +="" + i +",";
                   }
                   else N++;
                 }
                 out.println("\nfunction gets(x){return err[x];}\nfunction debug(x){parent.alert(gets(x));}</script><br>" + str +":"+ m +" records processed, " + N + " records transferred<br>");
                 if (N > 0)
                     went += "," + str.substring(j+3);
                 if (m!=N)
                 {
                   String numarr[] = nums.split(",");
                   for ( i=0; i < numarr.length; i++)
                       out.println("<input onclick=\"frames[0].debug(" + numarr[i] +")\" type=button value=Debug" + i +"><br>");
                 }
               }
               fieldstr="";
               dfieldstr = "";
               
           }
           else if ((j = str.toUpperCase().indexOf(" AS ")) >0)
           {
               if (fieldstr.equals("")==false) fieldstr +=","; fieldstr += str.substring(0,j);
               if (dfieldstr.equals("") == false) dfieldstr +=","; 
               dfieldstr += str.substring(j+4).trim();
           }
       }
       adaptera.close();
       adapterb.close();
       out.print("<script type=\"text/javascript\" >parent.syn('" + went.replaceAll("\n", "\\n") +"',window);parent.myprompt(document.body.innerHTML.replace(/<script [^<]+<.script>/g,''));</script>");
       
       out.print("</head></body>");
     }
} 
%>
 

 
