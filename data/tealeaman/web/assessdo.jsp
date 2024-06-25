<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%!
float addFloat(String v)
{
    float f = 0;
    if (v==null) return f;
    if( !v.contains("+")&&!v.contains("!"))
       try{ f = Float.parseFloat(v);}catch(Exception e){}
    else
    {
       String [] u = v.replaceAll("\\s","").replaceAll("\n","").split("[!|\\+]");
    
       for (String y: u)
       {
          f += Float.parseFloat(y);
       }
    }
    return f;
} 
%>
<%
int orgnum = Toolbox.setcharset(request,response);
if (orgnum == -1) return;
User user = null;
if (  (user = User.authorize(orgnum, Systemroles.INSTRUCTOR | Systemroles.TEACHINGADMIN |Systemroles.ASSESSER,application,session,request, response, "assessdo.jsp", true)) == null )
   return;
orgnum = user.orgnum; 
 user.changedb(user.id);
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
String sql = "select  assess, course,  assignname, sid,  semester  FROM Submission where assess LIKE '%`!%'";
boolean b = adapter.executeQuery2(sql, false); 
ArrayList<String> x = new ArrayList<>();
String a;
for (int i=0; b && (a = adapter.getValueAt(i,0))!=null; i++)
{
   String [][] p = (new CSVParse(a,'|',new String[]{",",";"})).nextMatrix();
   StringBuffer buf =  new StringBuffer();
   int j = 0;
   for ( j=0; j < p.length-1; j++)
   {
       if (p[j][3] == null) p[j][3] = "";
       if (p[j].length >4) break;
       if (p[j][3].contains("`!"))
       {
           String  q = p[j][3].replaceFirst(".*`!","");
           if (!q.replaceAll("[0-9]", "").replaceAll("!", "").replaceAll("\\.", "").replaceAll("\\+", "").equals("") || q.equals(""))
           {
              System.out.println("***********************************Error=" + a);
              continue;
           }
           float q2 = addFloat(q);
           float q1 = Float.parseFloat(p[j][1]);
           if (q2 > q1) 
              p[j][2] = p[j][1];
           else
              p[j][2] = q.replaceAll("!","+");
           p[j][3] = p[j][3].replaceFirst("`!.*$","");
       }
       buf.append(p[j][0]);buf.append(",");buf.append(p[j][1]);buf.append(",");buf.append(p[j][2]);buf.append(",");
       if (p[j][3].contains(",") || p[j][3].contains("|") || p[j][3].contains(";"))
           buf.append("|");
       buf.append(p[j][3].replaceAll("\\|","||")); 
       if (p[j][3].contains(",") || p[j][3].contains("|") || p[j][3].contains(";"))
           buf.append("|");
       //if (j < p.length-1) 
       buf.append(";"); 
   }
   for (int k=0; k < p[j].length; k++)
   {
       if (k > 5 && (p[j][k].contains(",") || p[j][k].contains(";") || p[j][k].contains("|")))
           buf.append("|");
       buf.append(p[j][k]);
       if (k > 5 && (p[j][k].contains(",") || p[j][k].contains(";") || p[j][k].contains("|")))
           buf.append("|");
       if (k < p[j].length-1) buf.append(",");
   }
   String s = "UPDATE Submission SET assess='" + buf.toString().replaceAll("'", "''") 
   + "' WHERE course='" + adapter.getValueAt(i,1) 
   + "' AND assignname='" + adapter.getValueAt(i,2)
   + "' AND sid='" + adapter.getValueAt(i,3)
   + "' AND semester='" + adapter.getValueAt(i,4)
   + "'";
   out.println(s+";<br>"); 
   x.add(s);
}
System.out.println("xsize=" + x.size());
if (1+1==2){adapter.close();return; }
int n, S= 0; 
for (String s : x)
{
   //n = adapter.executeUpdate(s);
   //if (n < 1) System.out.println(s);
   //else S++;
}
System.out.println("S=" + S); 
adapter.close();
%>
