<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
int orgnum = Toolbox.setcharset( request,response);
if (orgnum == -1) return;

User user = null;
if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR,application,session,request, response, "assignment.jsp", false)) == null) 
    return;
 
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
 

</head>
<%!
    
String [] semestername = "Fall 2006,Spring 2007,Fall 2005,Fall 2007,Winter 2007,Spring 2008,Fall 2008,Spring 2009,Summer 2009,Fall 2009,Spring 2010,Fall 2010,Spring 2011,Summer I 2011,Fall 2011,Spring 2012,Fall 2013,SummerI 2012,Fall 2012,Spring 2013,Spring 2014,Fall 2014,Summer 2015,Spring 2015,Fall 2015,Spring 2016,Fall 2016,Spring 2017,Summer 2017,Fall 2017,Spring 2018".split(",");
String [] semestercode= "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,17,18,19,20,21,22,22,23,24,25,26,27,28,29".split(",");
String n2c(String s)
{
    int i=0; for (; i < semestername.length; i++)
        if (s.equals(semestername[i])) return semestercode[i];
    return "0"; 
}
String tns[] = "SystemParam,Aggregation,Assessmap,Assgroup,Assignment,EvalQuestion,EvalSelDetail,Evaluation,Gradethresh,Registration,SessionSum,Studentgroup,Studygroup,Submission,TeachPlan,Transferred".split(",");
%>
<%
user.changedb(user.id);
JDBCAdapter adapter = Toolbox.getUserAdapter(user,orgnum);
for (int i=0; i < tns.length; i++)
{
    for (int j=0; j < semestername.length; j++)
    {
        String sql = "update " + tns[i] + " set semester='" + n2c(semestername[j]) + "' WHERE semester='" + semestername[j] + "'";
        if (i==0) sql=sql.replaceAll("semester", "currentSemester");
        adapter.executeUpdate(sql);
    }
}

adapter.close();
%>
