<%@ page contentType="text/html; charset=utf-8" import="java.util.concurrent.*, telaman.*,java.sql.*,java.util.*,java.math.*,java.util.regex.*,java.io.*"%>

<!DOCTYPE html>
 <% int orgnum = Toolbox.setcharset(request, response);%>

<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
        <meta http-equiv="Content-Type" content="text/html; charset=GBK">
        <title>JSP Page</title>
    </head>
    <body>
       
        <% 
String tbls[] = "Aggregation,Assessmap,Assgroup,Assignment,EvalQuestion,EvalSelDetail,Evaluation,Gradethresh,Registration,Scheduler,Scherror,Schfixed,Schroom,Schtime,Schuser,Session,SessionSum,Studentgroup,Studygroup,Submission,SystemParam,TeachPlan,Transferred".split(",");
User user = null;
 
if ( (user = User.authorize(orgnum, Systemroles.TOTAL, application, session, request, response, "convertsemester.jsp", true)) == null) 
{
    return;
}
user.changedb(user.id);
JDBCAdapter adapter = Toolbox.getUserAdapter(user,orgnum);
String sems[] = " ,Fall 2005,Spring 2006,Fall 2006,Spring 2007,Fall 2007,Spring 2008,Fall 2008,Spring 2009,Summer 2009,Fall 2009,Spring 2010,Fall 2010,Spring 2011,Summer I 2011,Fall 2011,Spring 2012,Fall 2012,Fall 2013,Spring 2013,Spring 2014,Fall 2014,Spring 2015,Fall 2015,Spring 2016,Fall 2016,Spring 2017,Summer 2017,Fall 2017,Spring 2018".split(",");
String sql;
int k = 0;
for (int i=0; i < tbls.length; i++)
{
    for ( int j=1; j < 30; j++)
    {  
       sql = "UPDATE " + tbls[i] + " SET semester='" + j + "' where semester='" + sems[j] + "'"; 
        k  = adapter.executeUpdate(sql);
       if (k < 0)
           out.println(  tbls[i] + " " + sems[j] + "<br>"); 
    }
     
}
adapter.close();
    
%>
    </body>
</html>
