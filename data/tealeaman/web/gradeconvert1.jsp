
<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*" %>
<%
    int orgnum = Toolbox.setcharset(request, response);
    if (orgnum == -1) return;
        
        User user = null;
        if ( (user = User.authorize(orgnum, Systemroles.TOTAL, application, session, request, response, "gradequizconvert1.jsp", true)) == null) 
        {
            return;
        } 
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />        
</head>  
<body style="background: <%=Toolbox.dbadmin[orgnum%65536].bgimage%>" >
<center>
<%=Toolbox.title("Search Results")%> 
 
<%
        String semester = Toolbox.defaultParam(orgnum,request, ("semester"), null);
        JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);

        String sql = sql = "SELECT sid,lastupdate,content FROM Submission ";
        if (semester != null) 
        {
            sql += " where Submission.semester='" + semester + "'";
        }
        int n = adapter.executeQuery(sql);
        Vector<String> v = new Vector<String>();
        for (int i = 0; i < n; i++) 
        {
            String x = adapter.getValueAt(i, 2);
            CSVParse parse = new CSVParse(x, '\'', new String[]{"\r", "\n"});
            QuestAnswer sol;
            String[] str;
            boolean goodrecord = true;
            StringBuffer c = new StringBuffer();
            StringBuffer a = new StringBuffer();
            while ((str = parse.nextRow()) != null) 
            {
                int[] js = new int[]{0, 1, 2, 3, 5, 6};
                if (str.length != 11 && str.length != 7) 
                {
                    goodrecord = false;
                    break;
                }
                if (str.length == 11) 
                {
                    for (int k = 0; k < 6; k++) 
                    {
                        try 
                        {
                            float f = Float.parseFloat(str[js[k]]);
                        } catch (Exception e)
                        {
                            goodrecord = false;
                            break;
                        }
                    }
                }
                if (!goodrecord) {
                    break;
                }
                sol = new QuestAnswer(str,orgnum);
                if (str.length == 11)
                {
                    if (c.length() > 0) 
                    {
                        c.append("\n");
                    }
                    sol.tocsv2(c);
                }
                if (a.length() > 0) 
                {
                    a.append(";");
                }
                sol.tocsv1(a);

            }
            if (goodrecord) 
            {
                v.addElement("Update Submission SET content='"
                        + c.toString().replaceAll("'", "''")
                        + "', assess='"
                        + a.toString().replaceAll("'", "''")
                        + "' where  sid='"
                        + adapter.getValueAt(i, 0)
                        + "' AND lastupdate=" + adapter.getValueAt(i, 1));
            }
        }
        for (int i = 0; i < v.size(); i++) 
        {
            adapter.executeUpdate(v.elementAt(i));
        }
        adapter.close();
 
%>
    </body>
</html>
