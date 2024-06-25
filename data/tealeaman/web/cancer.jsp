<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
 
<%!
JDBCAdapter adapter = null; 
boolean open = false;
String connect(int orgnum)
{
    String x = "";
    if (open == false)
    {
        adapter = new JDBCAdapter("jdbc:mysql://localhost:3306/cancer", "com.mysql.jdbc.Driver","root", "tomcat",0);
        x = adapter.error();
       
        open = x.equals("");
        if (open == false)
        {
           adapter.close();
           adapter = new JDBCAdapter(Toolbox.dbadmin[orgnum%65536].sysDBConnectInfo());
           x = adapter.error();
           open = x.equals("");
           if (open)
           {
              int n = adapter.executeUpdate("Create database cancer");
              x = adapter.error();
              open = x.equals("");
              if (open)
              {
                 n = adapter.executeUpdate("GRANT ALL PRIVILEGES ON cancer.* TO 'root'@'localhost' IDENTIFIED BY 'tomcat'");
                 n = adapter.executeUpdate("FLUSH PRIVILEGES");
              }
           }
           adapter.close();
           if (open)
           {
              adapter = new JDBCAdapter("jdbc:mysql://localhost:3306/cancer", "com.mysql.jdbc.Driver","root", "tomcat",0);
              x = adapter.error();
              open = x.equals("");
           }
        }
    }
    if (open == false)
    {
        adapter.close();
        return x;
    }
    return "";
}
         
%>
<%

int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
String password = Toolbox.defaultParam(orgnum,request, ("password"), null); 
if (password == null || password.equals("zhongyan") == false)
{
    out.println("!@#$%^unauthorized");
    return;
}

String updatesql = Toolbox.defaultParam(orgnum,request, ("updatesql"), null);
String selectsql = Toolbox.defaultParam(orgnum,request, ("selectsql"), null);
String commandsql = Toolbox.defaultParam(orgnum,request, ("commandsql"), null);
if (updatesql != null)
{
    String err = connect(orgnum);
   
    if (open == false)
    {
        out.println("!@#$%^_" + err  );
        return;
    }
    int n = adapter.executeUpdate(updatesql);
    if (n > 0)
    {
        out.println("cancerdatapassed");
        return;
    }
    else if (n < 0)
    {
        out.println("!@#$%^Incorrect:" + adapter.error());
    }
     
    return;
}
else if (selectsql != null)
{
    String err = connect(orgnum);
    if (open == false)
    {
        out.println("!@#$%^_" + err);
        return;
    }
    int n = adapter.executeQuery(selectsql);
    if (n == -1)
    {
        out.println("!@#$%^" + adapter.error());
        return;
    }
    if (n > 0)
    for (int j=0; j < adapter.getColumnCount(); j++)
    {
        out.print(adapter.columnNames[j]);
        if (j < adapter.getColumnCount()-1)
                out.print(",");
            else
                out.print("\n");
    }
    for (int i=0; i < n; i++)
    {
        for (int j=0; j < adapter.getColumnCount(); j++)
        {
            if (adapter.colIsNum[j])
                out.print(adapter.getValueAt(i, j));
            else
                out.print("\"" + Generic.handle(adapter.getValueAt(i, j)) +"\"");
            if (j != adapter.getColumnCount()-1)
                out.print(",");
            else
                out.print("\n");
         }
    }
    return;
}
else if (commandsql!=null)
{
    if (adapter != null)adapter.close();
    open = false;
}
%>


