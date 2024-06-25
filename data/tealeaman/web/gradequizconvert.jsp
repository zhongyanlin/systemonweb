<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*" %>
<%
    int orgnum = Toolbox.setcharset(request, response);
    if (orgnum == -1) return;
        
        User user = null;
        if ( (user = User.authorize(orgnum, Systemroles.TOTAL, application, session, request, response, "gradequizconvert.jsp", true)) == null) 
        {
            return;
        } 
orgnum = user.orgnum; 
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />        
</head>  
<body style="background:<%=Toolbox.dbadmin[orgnum%65536].bgimage%>" >
<center>
<%=Toolbox.title("Search Results")%> 
    
   
    <%!
     
       int labelw = 70;
       
  
       int retrv(String [] spliterstr, int []spliterlen, String str, int j, String [] x )
       {
           x[12] = "0";
            
           int k = str.indexOf(spliterstr[0], j);
           if (k < 0) 
           {
               return j;
           } 
           int l ;
           for (int i=0; i < 12; i++)
           {
              
              l = str.indexOf(spliterstr[i+1], k + spliterlen[i]);
              
              if (l < 0)
              {
                  return k + spliterlen[i];
              }
              x[i] = str.substring(k + spliterlen[i], l).trim().replaceFirst("<.tr>$", "").replaceFirst("<.td>$", "");
              k = l;
           }
           x[12] = "1";
           return k + spliterlen[12];
           
       }
        
       public int parse(String [] spliterstr, int []spliterlen, String html, int j, QuestAnswer q)
       {
           String [] x = new String [13];
           j = retrv( spliterstr,  spliterlen, html,   j,   x );
           
           if (x[12].equals("1") )
           {
           try{
           q.valid = true;
           q.num = Integer.parseInt(x[0]); 
           q.shuffled  = Integer.parseInt(x[1]); 
           q.pts   = Integer.parseInt(x[2]); 
           q.score  = Integer.parseInt(x[3]);  
           q.outcome   =  x[4]; 
           q.timestay  = Integer.parseInt(x[5]); 
           //q.ismult = (x[6]!=null && x[6].equals("1"));  
           q.fmt   = Integer.parseInt(x[7]); 
           q.question  = x[8];  
           q.solution  = x[9]; 
           q.answer= x[10];
           q.comments =  x[11];
           }catch(Exception e)
           {
              q.valid = false; 
           }
           }
           else
               q.valid = false;  
           return j;
       }
 
String convert(String [] spliterstr, int []spliterlen, String html,int orgnum)
{
    StringBuffer sans = new StringBuffer(400);
    int j = 0;
    QuestAnswer qa = new QuestAnswer(0,orgnum);
    String assess = ""; 
    while (true)
    {
        int k = parse ( spliterstr, spliterlen, html, j, qa);
        if (k == j || qa.valid == false) break;
        j = k;
        String str = qa.tocsv();
        sans.append(str);
        sans.append("\n");
        
    }
    if (sans.length() == 0) return null;
    /*
    <TD align=left>Total</TD>
<TD align=left>Q=18, S=4.0</TD>
<TD align=left>The Formula of Score:</TD>
<TD align=left>0|S</TD></TR></TBODY></TABLE></TD></tr></table> 
     */
    
    j = html.indexOf("Q=",j);
    if (j>0) {
    int k = html.indexOf(",",j);
    if (k>0) {
    String Q = html.substring(j+2, k);
      
    j = html.indexOf("S=",k);
    if (j>0) {
    k = html.indexOf("</TD>",j);
    if (k>0) {
    String S = html.substring(j+2, k);
      
    j = html.indexOf("|",k);
    if (j >0) {
    k = html.indexOf("</TD>",j);
    if (k > 0){
    String formula = html.substring(j+1, k);
    String dropn = html.substring(j-3, j).replaceAll("[^0-9]","");
    sans.append("\n" + Q + "," + dropn +  "," + S  +"," + formula  );
    sans.append(",0," +  S + ",");
    return sans.toString();
    }}}}}}
    
    return null; 
}
 
%>
<%
 String[] spliterstr = { 
                   "<td>" + Toolbox.emsgs(orgnum,231) + "</td><td>", 
                   "<td>" + Toolbox.emsgs(orgnum,478) + "</td><td>",
                   "<td>" + Toolbox.emsgs(orgnum,1145) + "</td><td>",
                   "<td>" + Toolbox.emsgs(orgnum,224) + "</td><td>",
                   "<td>" + Toolbox.emsgs(orgnum,1182) + "</td><td>",
                   "<td>" + Toolbox.emsgs(orgnum,986) + "</td><td>",
                   "<td>" + Toolbox.emsgs(orgnum,206) + "</td><td>",
                   "<td>" + Toolbox.emsgs(orgnum,21) + "</td><td>",
                   "<tr><td>" + Toolbox.emsgs(orgnum,50) +"</td><td colspan=11>",
                   "<tr><td>" + Toolbox.emsgs(orgnum,627) +"</td><td colspan=11>",
                   "<tr><td>" + Toolbox.emsgs(orgnum,53) +"</td><td colspan=11>",
                   "<tr><td>" + Toolbox.emsgs(orgnum,1006) +"</td><td colspan=11>",
                   "<tr><td colspan=12> </td></tr>"};
       int [] spliterlen  =  {
       spliterstr[0].length(),
       spliterstr[1].length(),spliterstr[2].length(),
       spliterstr[3].length(),spliterstr[4].length(),
       spliterstr[5].length(),spliterstr[6].length(),
       spliterstr[7].length(),spliterstr[8].length(),
       spliterstr[9].length(),spliterstr[10].length(),
       spliterstr[11].length(),spliterstr[12].length()
       };  
        
        JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
        if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
        {
    String sql = null; 
    String userid= user.id;
    
    if (sql == null) 
        sql  = "SELECT sid,lastupdate FROM Submission where  content like '<table %'";
    int n = adapter.executeQuery(sql);
    
    Vector v = new Vector();
    for (int i=0; i < n; i++)
    {
        v.addElement("where sid='" +adapter.getValueAt(i,0) + "' and lastupdate=" + adapter.getValueAt(i,1));
       
    }
    
    String path = Toolbox.dbadmin[orgnum%65536].webFileFolder + java.io.File.separator +   userid +  java.io.File.separator +  "CONVERT.bak";
    try
    {
      
        java.io.FileWriter w = new java.io.FileWriter(path, false);
        w.write("mysql\fCREATE TABLE Submission");
        for (int i=0; i < n; i++)
        {
            sql = "select * from Submission " + v.elementAt(i);
            if (adapter.executeQuery2(sql,true)==false)
            {
                continue;
            } 
            int c = adapter.getColumnCount();
            StringBuffer b = new StringBuffer();
            String html = adapter.getValueAt(0,5);  
            html = convert( spliterstr, spliterlen, html,orgnum);
            if (html == null) continue;
            out.println(html);
            for (int j=0; j < c; j++)
            if ( j == 5)
                b.append("'" + html.replaceAll("'", "''") + "',");
            else if (j == c-1)
                b.append( "'" + adapter.getValueAt(0,c-1) + "'");
            else if (j == 7 || j == 0)
                b.append(  adapter.getValueAt(0,j) + ",");
            else 
                b.append( "'" + adapter.getValueAt(0,j) + "',");
            w.write("\n" + b );
        }
        w.close(); 
    }
    catch(Exception e){}
}
        adapter.close();
%>
    </body>
</html>
