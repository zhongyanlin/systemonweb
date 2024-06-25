
<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*,java.lang.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
%>
<%!
 class CSVsql extends CSVParse
 {
     String webfile;
     String stringquote;
     String table;
     String fields[];
      int [] datatype ;
     int [] datatype0 ;
     int [] datatype1 ;
     String [] datatypes;
     String datatypes0[];
     String datatypes1[];
     int [] datalength;
     int [] datalength0 ;
     int [] datalength1 ;
     int numrecords = 0;
     int numfields = 0;
     int numfields0 = 0;
     int numfields1 = 0;
     boolean newtable = false;
     String inserttable ;
     String word = null;
     String createsql = null;
     StringBuffer err = new StringBuffer();
     JDBCAdapter adapter = null;
     int errc = 1;
     short COLEND = 7;
     short ROWEND = 8;
     String data3 = null;
     boolean firstlineishead = true;
     String tblstr  = ""; 
     int goodn = 0;
     int orgnum = Toolbox.langnum<<16;
    public CSVsql( String webfile1, String table1,   JDBCAdapter adapter1, char quote, String field, String row) throws  Exception
    {
         super(new File(webfile1), quote, new String[]{field, row} );
         adapter = adapter1;
        
         stringquote = "";
         table = table1;
         inserttable = "INSERT INTO " + table + " VALUES(";
    }
    
    int   getDatatype(String w, int m )   // -1 undetermine, 0 int, 1 double, 2 string
    {
         if ( m == -1)
         {
             if (w==null || w.length() == 0)
                 m = 0;
             else
             try
             {
                 double d = Double.parseDouble(w);
                 m =  (w.indexOf(".")>=0)?1:0;
             }
             catch(Exception e)
             {
                 m = 2; 
             }
           
         }
         else if (w==null || w.length() == 0)
             return m;
         else   if (m == 0)
         {
                 
                 try
                {
                   double d = Double.parseDouble(w);
                   if (w.indexOf(".")>=0)
                   {
                       m = 1;
                   }
                }
                catch(Exception e)
                {
                   m = 2;
                }
          } 
         else if ( m == 1)
         {
                
                try
                {
                   double d = Double.parseDouble(w);
                }
                catch(Exception e)
                {
                    m = 2;
                }
          }
         return m;
    } 
     public String mapstr = "";
     public String parsedef(String createsql, int M)
     {
         
         String f = createsql.replaceAll("'[^']*'", "");
         int k = f.indexOf("(");
         int l = f.toUpperCase().indexOf("PRIMARY KEY");
         if (l == -1) l = f.length();
         String [] s = f.substring(k+1,l).split(",");
         datatype  = new int[s.length];
         datatypes = new String [s.length];
         datalength = new int [s.length];
         fields = new String [s.length];
         StringBuffer sb = new StringBuffer("var map = new Array();");
         for (int i=0; i < s.length; i++)
         {
             fields[i] = s[i].trim().replaceFirst("[ ].*", "");
             String x = s[i].trim().replaceFirst("^[^ ]+[ ]+", "").replaceFirst("[ ].*", "");
             datatypes[i] = x.replaceAll("[^a-zA-Z]", "").toUpperCase();
             sb.append("map['" + fields[i] + "']='" + datatypes[i]);
             if (datatypes[i].equals("SHORT") || datatypes[i].equals("INTEGER") || datatypes[i].equals("LONG") ||  datatypes[i].equals("BIGINT") )
                 datatype[i] = 0;
             else if (datatypes[i].equals("FLOAT") || datatypes[i].equals("DOUBLE")  )
                 datatype[i] = 1;
             else if (datatypes[i].equals("VARCHAR") || datatypes[i].equals("CHAR"))
                 datatype[i] = 2;
             else if (datatypes[i].equals("TEXT"))
                 datatype[i] = 3;
                 
             x = x.replaceFirst(".*\\([ ]*([0-9]+)[ ]*\\).*", "$1");
             try{
                 datalength[i] = Integer.parseInt(x);sb.append("(" + x + ")';\n");
             }catch(Exception e)
             {
                 datalength[i] = 0;
                 sb.append("';\n");
             }
         }
         mapstr = sb.toString(); 
         return  makestrs(datatypes,  datalength, fields,  M);  
     }
     public String option(String [] fields , int j)
     {
         int i = 0;
         String x = ""; 
         if (fields!=null)
         for (; i < fields.length; i++)
         {
             x += "<option value=\"" + fields[i] + "\" "+ ((i==j)?"selected":"") +">" + fields[i] + "</option>";
         }
         if (j < i)
             return "<option value=\"\"></option>" + x;
         return "<option value=\"\" selected></option>" + x;
     }
     public String makestrs(String [] datatypes, int [] datalength, String [] fields, int M)
     {
         String str = "<tr><td style=\"background-color:#ccc\"><nobr>" + Toolbox.emsgs(orgnum,719) + "</nobr></td>"; 
         int i = 0;
         if (fields!=null)
         for (; i < fields.length; i++)
         {
              str += "<td bgcolor=white  style=\"background-color:white !important\"><select name=f" + i + " onchange=chs(this,"+ i +")>" + option(fields,i) + "</select></td>";
         }
         for (; i < M; i++)
         {
              str += "<td bgcolor=white  style=\"background-color:white !important\"><select name=f" + i + " onchange=chs(this,"+ i +")>" + option(fields,i) + "</select></td>";
         }
          str += "</tr><tr><td style=\"background-color:#ccc\"><nobr>" + Toolbox.emsgs(orgnum,720) + "</nobr></td>"; 
         i = 0;
         if (fields!=null)
         for (; i < datatypes.length; i++)
         {
              String xx = datatypes[i];
              if (xx.equals("VARCHAR"))  
                  xx += "(" + datalength[i] + ")";
              str += "<td bgcolor=white style=\"background-color:white !important\"><input name=t" + i + " size=" + (xx.length()+2) + " value=\"" + xx +   "\" onblur=nojs(this)></td>";
         }
         for (; i < M; i++)
         {
              String xx = " ";
              str += "<td bgcolor=white style=\"background-color:white !important\"><input name=t" + i + " size=2 value=\"" + xx +   "\"  onblur=nojs(this)></td>";
         }
          return str + "</tr>";
     }
     public String makestr(String [] datatypes, int [] datalength, String [] fields, int M)
     {
         String str = "<tr><td style=\"background-color:#ccc\">Fields</td>"; 
         int i = 0;
         if (fields!=null)
         for (; i < datatypes.length; i++)
         {
              str += "<td bgcolor=white  style=\"background-color:white !important\"><input name=f" + i + " size=" + (fields[i].length()) + " value=\"" +  fields[i] + "\"  onblur=nojs(this)></td>";
         }
         for (; i < M; i++)
         {
              str += "<td bgcolor=white  style=\"background-color:white !important\"><input name=f" + i + " size=8 value=\"\"  onblur=nojs(this)></td>";
         }
          str += "</tr><tr><td style=\"background-color:#ccc\">DataType</td>"; 
         i = 0;
         if (fields!=null)
         for (; i < datatypes.length; i++)
         {
              String xx = datatypes[i];
              if (xx.equals("VARCHAR"))  
                  xx += "(" + datalength[i] + ")";
              int z = (xx.length()+2);
              if (z > datalength[i])
                  z = datalength[i];
              if (z < (fields[i].length())) z = (fields[i].length());
              str += "<td bgcolor=white style=\"background-color:white !important\"><input name=t" + i + " size=" + z + " value=\"" + xx +   "\"  onblur=nojs(this)></td>";
         }
         for (; i < M; i++)
         {
              String xx = " ";
              str += "<td bgcolor=white style=\"background-color:white !important\"><input name=t" + i + " size=3 value=\"\"  onblur=nojs(this)></td>";
         }
          str += "</tr><tr><td style=\"background-color:#ccc\">Is Key</td>";
          
          i = 0;
         for (; i < M; i++)
         {
              String xx = " ";
              str += "<td bgcolor=white style=\"background-color:white !important\"><input type=checkbox name=c" + i + "></td>";
         }
          return str + "</tr>";
     }
     public String makesql(int [] datatype, int [] datalength, String [] fields)
     {
         String sql = "";
         if (datatype.length > 0)
         {
            sql = "CREATE TABLE IF NOT EXISTS  " + table + "(";  
            for (int i=0; i < datatype.length; i++)
            {
                String x = "";
                if (fields==null || fields[i].replaceAll(" ","").equals("")) 
                    x = "t" + i;
                else
                    x= fields[i];
                if (datatype[i] == 1)
                {    
                    sql += x + " FLOAT";
                }
                else if (datatype[i] == 0)
                {    
                    sql += x + " INTEGER";
                }
                else
                {
                    sql += x + " VARCHAR(" + datalength[i] +")";
                }
                if ( i < datatype.length-1) 
                    sql += ",\n"; 
                else
                    sql += ")";
            }
         }
         return sql;
     }
     
     String i2s (int i, int j)
     {
         return  i == 0? (j<9?"INTEGER":"BIGINT") : ( i == 1? "DOUBLE":( (j > 255 )? "TEXT": "VARCHAR(" + j +")") );
     }
      
     public void analyze()
     {

         String sql  = null;
         Vector<Integer> datalength = new Vector();
         Vector<Integer> datatype = new Vector();
          
         int N = 0;
          
         int m = 0;
         String row[];
         
         
         String d = "";
         data3 = ""; 
         while ((row = nextRow()) != null) 
         {
             if (row.length == 1 && row[0].replaceAll("\n", "").replaceAll("\r", "").equals("")) 
             {
                 continue;
             }
             
             
             
             if (N == 0)  
             {    
                 firstlineishead = true;
                 for (int i=0; i < row.length; i++)
                 if ( row[i].replaceAll(" ", "").equals("") 
                   || row[i].replaceAll("[0-9]", "").replaceAll("\\.", "").equals(""))
                 {
                     firstlineishead = false;
                     break;
                 }
                 fields = new String[row.length];
                 for (int i=0; i < row.length; i++)
                     fields[i] = (row[i]==null)?"":row[i];
             }
             else
             {
                  
                 for (int i=0; i < row.length; i++)
                 {
                     if (row[i] == null) row[i] = "";
                      
                     if (i>= datalength.size())
                     {
                         datalength.addElement(new Integer(row[i].length()));
                     }
                     else 
                     {
                         
                         if (datalength.elementAt(i).intValue() < row[i].length()) 
                         {
                            
                             datalength.set(i, new Integer(row[i].length()));
                            
                         }
                        
                     }
                     
                 }
 
                 for (int i=0; i < row.length; i++)
                 {
                     if (i < datatype.size())
                     {
                         m = getDatatype(row[i], datatype.elementAt(i).intValue());
                         datatype.setElementAt(new Integer(m), i);
                     }
                     else
                     {
                         m = getDatatype(row[i], -1);
                         datatype.addElement(new Integer(m));
                     }

                 }
               
                 d  = "<tr><td style=\"background-color:#ccc\" align=right>" + (N+1) + "</td>" ;
                 for (int i = 0; i < row.length; i++)
                 {
                     String x = row[i];
                     if (x == null) x = ""; 
                     d += "<td>" + x.replaceAll("<", "&lt;").replaceAll(">", "&gt;") + "</td>";
                 }
                 d += "</tr>";
                if (N < 3)
                {
                    data3 += d;
                }
             }
             N++;
         }
 
         if (N > 3)
         {
                 data3 += "<tr><td style=\"background-color:#ccc\"  align=right >...</td><td  align=left valign=middle colspan=" + (datalength.size()) +">...</td></tr>";
                 data3 += d;
         }
         numrecords = N;
         numfields1 = datalength.size();
         numfields0 = datalength.size();
         if (numfields0 < fields.length) numfields0 = fields.length;
         M =  (numfields0>numfields1)?numfields0:numfields1;
         if (N > 0) 
         {
              
             
             data3 += "<tr height=40><td style=\"background-color:#ccc\"></td>";
             for (int i = 0; i < M; i++)
                 data3 += "<td align=center style=\"font-size:30px\">&darr;</td>"; 
             data3 += "</tr>";
             d = data3;
             data3  = "<tr><td style=\"background-color:#ccc\" align=right><nobr>" + Toolbox.emsgs(orgnum,1418) + "</nobr></td><td colspan=" + fields.length + "><input name=firstline type=checkbox onclick=chf(this)>"+Toolbox.emsgs(orgnum,1417)+ "</td></tr><tr><td style=\"background-color:#ccc\"  align=right>1</td>";
          
             if (firstlineishead)  
             {

                  for (int i = 0; i < fields.length; i++)
                      data3  += "<td align=" + ((datatype1==null || i >= datatype1.length || datatype1[i] == 2)?"left":"right") + ">" + fields[i] + "</td>";
             }
             else
             {

                  for (int i = 0; i < fields.length; i++)
                      data3  += "<td align=" + ((datatype0 ==null || i >= datatype0.length || datatype0[i] == 2)?"left":"right") 
                              + ">" + fields[i] + "</td>";
             }    
             data3 += "</tr>" + d;
          
         } 
         if (numfields0 > 0)
         {
             datalength0 = new int[numfields0];
             datatype0 = new int[numfields0];
         }
         if (numfields1 > 0)
         {
             datatype1 = new int[numfields1];
             datalength1 = new int[numfields1];
         }
 
  
         for (int i = 0; i < numfields1; i++)
         {
             datalength1[i] = datalength.elementAt(i).intValue();
             
             datatype1[i] = datatype.elementAt(i).intValue();
             
         }
      
         for (int i = 0; i < numfields0; i++)
         {
             if (i >= fields.length)
             {
                 datalength0[i] = 1;
                 datatype0[i] = 2;
                 
                 continue;
             }
             m = fields[i].length();
             if (i < numfields1)
             {
                 
                 if (datalength1[i] > m) 
                    datalength0[i] = datalength1[i];
                 else
                    datalength0[i] = m;
                 datatype0[i] = getDatatype(fields[i], datatype1[i]);
             }
             else
             {
                 
                 datalength0[i] = m;
                 datatype0[i] = getDatatype(fields[i], -1);
             }
         }
         if (numfields0 > 0)
         datatypes0 = new String[numfields0];
         for (int i = 0; i < numfields0; i++)
         {
             datatypes0[i] = i2s(datatype0[i],datalength0[i]);
         }
         if (numfields1 > 0)
         datatypes1 = new String[numfields1];
  
         for (int i = 0; i < numfields1; i++)
         {
             datatypes1[i] = i2s(datatype1[i],datalength1[i]);
         }
   
         
         if (!firstlineishead)
         {
             
             String xx[] = new String[numfields0]; 
             for (int i = 0; i < numfields0; i++)
             {
                 xx[i] = "t" + i;
             }
             
             tblstr = makestr(datatypes0, datalength0, xx, M);
         }
         else 
         {
             if (M < fields.length) M = fields.length;
             
             tblstr = makestr(datatypes1, datalength1, fields, M);
             
         }
           
     }
     int M;
     public int  processdata(String orders, String fieldstr,String quotes)
     {
         int m = 0;
         int datalength [] = null;
         int headstate = 0;
         int N = 0;
         StringBuffer linebuf = new StringBuffer();
          
         String [] row; 
         
         while ( (row = nextRow()) !=null )
         {
     
             if (row.length == 1 && row[0].replaceAll("\n", "").replaceAll("\r", "").equals("")) 
             {
                 continue;
             }
             if (N == 0 && firstlineishead){N++; continue;}
             
             int k = 0; 
             int j = 0;
             for (; j < row.length  ; j++)
             {
                  
                  if (orders.indexOf("," + j + ",")<0) continue;
                  String x = row[j];
                  
                  if (k > 0) 
                  {
                      linebuf.append(",");
                  } 
                  else 
                  {
                      linebuf.append("INSERT INTO " + table +   "(" + fieldstr + ") VALUES (" );
                  }
                  if (x==null || quotes.charAt(k) == ' ')  
                  {
                      if (x==null || x.replaceAll(" ", "").equals(""))
                         linebuf.append("NULL");
                      else
                         linebuf.append(x);
                  }
                  else
                      linebuf.append("'" +  x.replaceAll("'", "''") +"'"  );
                  k++;
             }
              for (; k < quotes.length(); k++)
                  linebuf.append(",NULL");
              linebuf.append(")");
              
              if (-1 == adapter.executeUpdate(linebuf.toString())) 
              {
                   if (adapter.error().indexOf("uplicate") < 0)
                   err.append("<tr><td>" + (errc++) + "</td><td>" + linebuf.toString() + "</td></tr>");
                    
              }
              else goodn++;
              linebuf.setLength(0);
              N++; 
              
          } 
           
          return N;
    }
    public String error(){ return "<table>" + Toolbox.removescript(err.toString()) + "</table>";}
    public String arr2str(String []x) 
    {
         if (x == null) return "";
        String xs = "";
        for (int i=0; i < x.length; i++)
        { 
            if (i>0) xs+=",";
            String y =  x[i];
            if (y == null) y = "";
            y = y.replaceAll("[^\\w]","");
            if (y.replaceFirst("VARCHAR[0-9]+","").equals(""))
                y = y.replaceFirst("VARCHAR([0-9]+)","VARCHAR($1)");
            if (y.replaceFirst("CHAR[0-9]+","").equals(""))
                y = y.replaceFirst("CHAR([0-9]+)","CHAR($1)");
            if (y.length() > 20) y = y.substring(0,20);
            xs += ("'" + y + "'"); 
        }
        return xs;
    }
    public String arr2str(int []x) 
    {
        if (x == null) return "";
        String xs = "";
        for (int i=0; i < x.length; i++)
        { 
            if (i>0) xs+=",";
            xs += (  x[i]  );
        }
        return xs;
    }
        
}
 
String doslash(String row)
{
    if (row == null) return null;
    int i = row.indexOf("\\r");
    if (i >= 0) row = row.substring(0,i) + "\r" +  row.substring(i+2); 
    i = row.indexOf("\\n");
    if (i >= 0) row = row.substring(0,i) + "\n" +  row.substring(i+2); 
    i = row.indexOf("\\t");
    if (i >= 0) row = row.substring(0,i) + "\t" +  row.substring(i+2); 
    return row;
}
%>

<%
User user = null;
if ( (user = User.dbauthorize(application,session,request, response, "csvtodb.jsp", false)) == null) 
    return;
CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
String style= Toolbox.butstyle(cachedstyle.fontsize);
long tstmp = System.currentTimeMillis() % 10000000;
String table = Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("table"), null), null, 30);

 
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><title><%=Toolbox.emsgs(orgnum,447)%></title>
<%=Toolbox.getMeta(orgnum)%>
<style type="text/css"> 
    
    input.BG {background-color:<%=cachedstyle.DBGCOLOR%>}
    input.BG1 {background-color:<%=cachedstyle.TBGCOLOR%>; border:0;text-align:right}
    
</style>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("csvtodb.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>

<%=Toolbox.unifontstyle(cachedstyle.fontsize,orgnum)%>
</head>
 
 
<body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:6px 6px 6px 6px">
    <%=Toolbox.title(Toolbox.emsgs(orgnum,1410)) %>
<%
 
if (table != null)
{
 if (table.equals(""))  
     table = Toolbox.validate( Toolbox.defaultParam(orgnum,request, ("newtable"), null), null, 30); 
 String webfile =  Toolbox.defaultParam(orgnum,request, ("webfile"), null); 
 String quote =  Toolbox.defaultParam(orgnum,request,"quote", "'", "!@#$%^&*()_-+={[}]|\\:;\"'<,>.?/~`", 6);
 if (quote.equals("")) quote = "\""; 
 String row = Toolbox.defaultParam(orgnum,request,"row", "\r\n", "!@#$%^&*()_-+={[}]|\\:;\"'<,>.?/~`",  20); 
 if (row.equals("")) row = "\r\n";
 row = doslash(row);
 
 String field =  Toolbox.defaultParam(orgnum,request,"field", ",", "!@#$%^&*()_-+={[}]|\\:;\"'<,>.?/~`", 20); 
 if (field.equals("")) field = ",";
 field = doslash(field);
 String webfile1 = user.webFileFolder + File.separator + webfile.replace('/', File.separator.charAt(0));
  JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
  if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
  
 try{
  String orders = Toolbox.defaultParam(orgnum,request,"orders", null, ",", 1000);    
  
 CSVsql parser = new CSVsql(webfile1, table,   adapter, quote.charAt(0), field, row);
 parser.orgnum = orgnum; 
 

if (orders == null) 
{
    %>
    <style>
        div>table>tr>td {background-color:<%=Toolbox.dbadmin[orgnum % 65536].TBGCOLOR%>}
        input {border:0px #b0b0b0 solid;background-color:white }
    </style>
    <form rel=opener name="f" style="margin:5px 2px 5px 2px" method="post" action="Echo"  >
    <%
    parser.analyze();
    if (parser.numrecords == 0)
        out.println("No records");
    else 
    {
     %>
     <center><div style="background:<%=Toolbox.dbadmin[orgnum % 65536].beheading(cachedstyle)%>;border:1px #b0b0b0 outset;border-radius:3px; margin:3px 0px 4px 0px;width:350px;text-align:center;overflow:display" >
<%=Toolbox.emsgs(orgnum, 661)%>: <%=webfile%>&nbsp;&nbsp;&nbsp;&nbsp;<%=Toolbox.emsgs(orgnum, 398)%>: <%=table%>
     </div></center> 
     <div> <table border="1" align="center" style="border-collapse:collapse;border-radius:3px;" >
<%
    out.println(parser.data3);
    String def = adapter.tabledef(table, adapter.dbms);
    if (def.equals("")) 
    {
        out.println(parser.tblstr);
        %></table></div> <input type="hidden" name="table"   value="<%=table%>" > <%
    } 
    else 
    {
       out.println(parser.parsedef(def, parser.M));
       %></table></div> <input type="hidden" name="table"   value="<%=table%>"> 
       <%
    }
    %>
    </form>
    <form rel=opener name="form1"  method="post" action="csvtodb.jsp"  >
   <input type="hidden" name="firstline"  value="<%=parser.firstlineishead%>" > 
   <input type="hidden" name="table"  value="<%=table%>" > 
   <input type="hidden" name="webfile"  value="<%=webfile%>" >
   <input type="hidden" name="quote"  value="<%=quote.replace(" ", "").replace("\"", "")%>" > 
   <input type="hidden" name="row"  value="<%=row.replaceAll("\n", "\\\\n").replaceAll("\r", "\\\\r")%>" >
   <input type="hidden" name="field"  value="<%=field.replaceAll("\n", "\\\\n").replaceAll("\r", "\\\\r")%>" >
   <input type="hidden" name="orders"   >
   <input type="hidden" name="quotes"   >
   <input type="hidden" name="fields"  >
   <% if (def.equals("")) { %>
    <input type="hidden" name="createsql" > 
   <% }%>
    </form> 
    <br>    
   <center>
    <input type=button name=submit <%=style%> class=OrangeButton value="<%=Toolbox.emsgs(orgnum, 1419)%>" onclick="submitform2()">
    <input type=button name=submit <%=style%> class=GreenButton value="<%=Toolbox.emsgs(orgnum, 169)%>" onclick="window.history.back()">
</center>
<script>
   
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
var theurl = "<%=Toolbox1.geturl(request)%>";
var M = <%=parser.M%>; 
var firstlineishead = <%=parser.firstlineishead%>; 
var fields= [<%=parser.arr2str(parser.fields)%>];
var datatype0 = [<%=parser.arr2str(parser.datatype0)%>];  
var datatype1= [<%=parser.arr2str(parser.datatype1)%>]; 
var datatypes0= [<%=parser.arr2str(parser.datatypes0)%>];  
var datatypes1= [<%= parser.arr2str(parser.datatypes1)%>]; 
var datatypes= [<%=parser.arr2str(parser.datatypes)%>]; 
var datalength= [<%= parser.arr2str(parser.datalength)%>];  
var datalength0= [<%= parser.arr2str(parser.datalength0)%>];
var datalength1= [<%=parser.arr2str(parser.datalength1)%>];
var newtable = <%=def.equals("")%>;  
var tstmp =  "w<%=tstmp%>";
<%= parser.mapstr%>; 
  
</script>
<script  type="text/javascript"  src="csvtodb.js"></script>
<script type="text/javascript"  src=curve.js></script>
<iframe name="w<%=tstmp%>" width="1" height="1" style="visibility: hidden" />
 
<%
    }

}
else
{

    String tabledef = Toolbox.defaultParam(orgnum,request,"createsql", null, ",()", 10000); 
    String fields  = Toolbox.defaultParam(orgnum,request,"fields", null, ",", 10000);
    String quotes  = Toolbox.defaultParam(orgnum,request,"quotes", null, ",'", 10000);
    parser.firstlineishead = (Toolbox.defaultParam(orgnum,request,"firstline", null, null, 10).equals("true")); 
  
    int n = 0;
    if (tabledef  != null)
    {
         long nowt = System.currentTimeMillis()/1000; 
         String createsql = "CREATE TABLE IF NOT EXISTS  " + table + "(lastupdate BIGINT DEFAULT " + nowt + ","+  tabledef + ")";
         if (-1 == adapter.executeUpdate(createsql))
         {
             createsql = createsql.replaceFirst("BIGINT","LONG");
             adapter.executeUpdate(createsql);
         }
         adapter.executeUpdate("INSERT INTO Apptables values (" + (System.currentTimeMillis()/1000) + ", '" + table +"','"
                           + createsql.replaceAll("'", "''") +"', " + user.roles +")" );
    }
 
    n =  parser.processdata(orders,fields,quotes);
 
    out.print("<script type=\"text/javascript\" > parent.myprompt(\"" + n + " records processed, " + parser.goodn + " inserted ");
    if (parser.err.length() > 0)
      {
          out.print("<table>" +  parser.err.toString().replace("\"", "\\\"").replaceAll("\n", " ") + "</table>"); 
      }
    
       out.println("\");</script>");
 }
   }catch(Exception e){}
 adapter.close();
}
 
else 
{        
%>


<table>
 <tr height=5>
  <td valign="TOP"> </td>
 </tr>
</table>
<script type="text/javascript" >document.write(round1('100%'));</script>
<table border="0" cellspacing=1 width=100% class=outset3 align="right">
<TR><TD valign=TOP>
 

 <form rel=opener name=form1 style="margin:0px 0px 0px 0px" method=post action="csvtodb.jsp"    >
 <table border="0">
  
 <tr> 
 <td  align="left" valign="top"><nobr><%=Toolbox.emsgs(orgnum,1411)%></nobr></td>
 <td align="left" colspan=5 >
     <input type=text name=webfile size=40 class="left" style="border:1px #a0a0a0 solid" onblur=nojs(this)>
     <input type=button name=b1 class=GreenButton style="width:80px" value="<%=Toolbox.emsgs(orgnum,1422)%>" onclick="selfile()"><br>(<%=Toolbox.emsgs(orgnum,1412)%>)
  </td>
</tr>
<tr> <td  align="left"><nobr><%=Toolbox.emsgs(orgnum,1413)%></nobr></td><td  align="left" colspan="5">
<table  cellspacing="0"  cellpadding="0"><tr>
        <td  align="left" ><input type=text size="4" class="left" style="border:1px #a0a0a0 solid;font-size:<%= cachedstyle.fontsize+4  %>px"   name=field value=","  ></td>
<td  align="left"><nobr>&nbsp;&nbsp;&nbsp;<%=Toolbox.emsgs(orgnum,1414)%></nobr></td>
<td  align="left"><input type=text name=row  class="left" style="border:1px #a0a0a0 solid;font-size:<%= cachedstyle.fontsize+4  %>px" size=4 value="\r\n"  ></td>
<td  align="left"><nobr>&nbsp;&nbsp;&nbsp;<%=Toolbox.emsgs(orgnum,1423)%></nobr></td>
<td  align="left"><input type=text name=quote   class="left" style="border:1px #a0a0a0 solid;font-size:<%= cachedstyle.fontsize+4  %>px"   size=4 value="&quot;"  ></td>
</tr>
</table></td></tr>
<tr>
 <td align="left"  colspan="1">
     &nbsp;<input type=radio  class=radchk  onclick="getdef()" name=table value="" checked><nobr><%=Toolbox.emsgs(orgnum,712)%></nobr>
 </td> 
 <td align="left"  colspan="5"> <input  class="left" style="border:1px #a0a0a0 solid;font-size:<%= cachedstyle.fontsize+4  %>px" name=newtable  onblur=nojs(this)> <nobr><%=Toolbox.emsgs(orgnum,1415)%></nobr>
</td>
</tr>
<tr>
    <td  colspan="6" align="left">
<table border=0 width=100% > <tr>    
<script type="text/javascript" >
var font_size = <%=cachedstyle.fontsize%>;
var wd = thispagewidth();
var het = thispageheight();
var cls = Math.floor(wd/10/font_size); 
var numtables = parent.frames[0].passNumtables();
var  tables = new Array(numtables);
parent.frames[0].passTables(tables);
tables.sort();
for (var i = 0; i < numtables; i++)
{ 
       if ((i % cls) == cls-1 )
          document.write("</tr><tr>");
       document.write("<td align=left> <table><tr><td><input type=radio class=radchk  name=table onclick=\"getdef('" +   tables[i] + "')\" value=\"" + tables[i] + '"></td><td>&nbsp;<nobr>' + parent.frames[0].name2label(tables[i]) + '</td></tr></table></td>');
}   
</script>
</tr></table>
</td></tr>
<tr><td></td><td>  </td></tr>
</table>
 </form>
<script type="text/javascript" >

var msg460 = "<%=Toolbox.emsgs(orgnum,460)%>";
 
function getdef(tn)
{
    if (tn==null) 
    {
        if (typeof (document.form1.createsql) != 'undefined')
        document.form1.createsql.value = "";
        document.form1.newtable.style.visibility = "visible";
        return;
    }
    document.form1.newtable.style.visibility = "hidden";
   
    var df = parent.frames[0].passdef(tn);
   
    var i = df.indexOf("|");
    if (typeof (document.form1.createsql) != 'undefined')
    document.form1.createsql.value = df.substring(i+1);
}
function selfile()
{
   window.open("webfolder.jsp?selfile=1","webfile", dim(600,500));
} 
function getselfile(x)
{
   document.form1.webfile.value = x; 
   var i = x.lastIndexOf("/");
   
   if (i>=0) x = x.substring(i+1);
   i = x.lastIndexOf(".");
   if (i>=0) x = x.substring(0,i)
   if (document.form1.newtable.value== '')
   document.form1.newtable.value = x;
}

function submitform1()
{
    if (document.form1.webfile.value=='')
    {
        myprompt("Select a CSV file from you web folder");
        document.form1.webfile.focus();
        return;
    }
    if (document.form1.table[0].checked)
    { 
    if (document.form1.newtable.value=='')
    {
        myprompt("Enter the name of the new table ");
        document.form1.newtable.focus();
        return;
    }
    else
    {
        for (var i=0; i < tables.length; i++)
        {
            if (tables[i] == document.form1.newtable.value)
            {
                 myprompt("Entered new table name exists already");
                 document.form1.newtable.focus();
                 return;
            }
        }
    }
    }
   // document.form1.target = "w<%=tstmp%>";
    formnewaction(document.form1 );
    visual(document.form1);
document.form1.submit(); 
}
onunload = function()
{
    var x = document.form1.table; var y = '';
    for (var i=0; i < x.length; i++)
       if (x[i].checked)
           y = x[i].value;
    parent.frames[0].settmp(document.form1.field.value + "," + document.form1.row.value + "," + y )
}
var onloadbeforecsv = null;
if (typeof window.onload == 'function') 
   onloadbeforecsv = window.onload;
window.onload = function ()
{
    if (onloadbeforecsv!=null) 
        onloadbeforecsv();
    var t = parent.frames[0].gettmp().split(/,/);
    if (t.length < 3) return;
    //document.form1.field.value = t[0];
    //document.form1.row.value = t[1]; 
    var x = document.form1.table;
    for (var i=0; i < x.length; i++)
       if (x[i].value == t[2]) x[i].checked =true;
    document.body.style.marginLeft = '1px';  
    
}
function nojs(txt){txt.value  = removejs(txt.value);}
</script>
</td></tr></table>
<script type="text/javascript" >document.write(round2);</script>

<table><tr height=5><td></td></tr></table>
<center><input type=button name=submit <%=style%> class=GreenButton value="<%=Toolbox.emsgs(orgnum,1416)%>" onclick="submitform1()">
</center>
<br>
 
<script type="text/javascript"  src=curve.js></script>
<%
      
}
%>
</body>

 
     
 
</html>

