<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.io.*,java.util.*,java.util.regex.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
%>
<%!
class SharedInt
{
    int value = 2;
    public synchronized void done()
    {
        value--;
        if (value == 0) notify();
    }
}

class StreamThread  extends Thread
{
    InputStream is;
    String type;
    FileOutputStream fou = null;
    SharedInt shared = null;
    StreamThread(InputStream is, String fn, SharedInt s)
    {
        shared = s;
        this.is = is;

        try{
        this.fou = new FileOutputStream(new File(fn));
        }catch(Exception e){fou = null;}
    }

    public void run()
    {
        if (fou == null) return;
        try
        {
            InputStreamReader isr = new InputStreamReader(is);
            BufferedReader br = new BufferedReader(isr);
            String line=null;
            while ( (line = br.readLine()) != null)
            {
                line += "\n";
                fou.write(line.getBytes());
            }
            fou.close();
            shared.done();
        }
        catch (IOException ioe)
        {
            //fou.printStackTrace();
        }
    }
}
String filetxt(String path)
{
 File file =  new File(path);
 StringBuffer sb = new StringBuffer();
 try
 {
         FileInputStream fin = new FileInputStream(file);
         InputStreamReader esr = new InputStreamReader(fin);
         BufferedReader ebr = new BufferedReader(esr);
         String aline;
         while ((aline = ebr.readLine()) != null)
         {
            sb.append( aline + "\n");
         }
         fin.close();
 }
 catch(Exception e){ }
 return sb.toString();
}
%>

<%
  
User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.SYSTEMANALYST,application,session,request, response, "regress.jsp", true)) == null)
    return;
orgnum=user.orgnum;
long tstmp = System.currentTimeMillis() % 10000000;
//String subdb = Toolbox.defaultParam(orgnum,request,"subdb", user.id);
//user.changedb(subdb);
String query =  Toolbox.defaultParam(orgnum,request, "query",null);
  String dir = "C:\\customer0\\web\\upenndesu\\";
  String octave = "C:\\Octave\\3.2.3_gcc-4.4.0\\bin\\octave.exe";
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
 <body>
<%


if (query == null)
{
    query = filetxt(dir + "query.txt");
    if (query.length()==0)
        query = "SELECT t00100020,  race, age , count(*) ,  min(density) ,   max(density) ,   sum(density)/count(*), abs5yearrisk , abslifetimerisk  FROM DicomInfo, Risk where cn=t00100020 AND density > 0 and abs5yearrisk IS NOT  NULL group by t00100020 order by abs5yearrisk ";
    int n = 0;

%>

        <h1>
            Search for Correlations
        </h1>
            Using   [b,bint,r,rint,stats] = regress(y,X, alpha) to look for string correlations among the socialdemorgraphic
            information, density and risk estimates.
            The data set out of the following SELECT statement will be (y X).
            <br>
            <form rel=opener name="f1" method="post" action="regress.jsp"  >
            <textarea rows="10" cols="80" name="query">
           <%=query%>
          </textarea><br>
            X columns(0-based):<input name="X"><br>
            y column number:&nbsp; <input name="y"><br>
            
            <input type="submit" value="Calculate"><br><br>
            <textarea rows="20" cols="80" name="search">
<%=filetxt(dir + "search.m")%>
            </textarea><br>
            </form>


<%}
else
{

   String yn = Toolbox.defaultParam(orgnum,request, ("y"), null);

   if (yn == null  ) { out.println("no y"); return; }
   int y = -1;
   try{
       y = Integer.parseInt(yn);
   }catch(Exception e){ out.println("y is not int"); return; }

   String Xn = Toolbox.defaultParam(orgnum,request, ("X"), null);

   if (Xn == null  ) { out.println("no X"); return; }
   Xn = Xn.replaceAll(" ", "");
   if ( ("," + Xn + ",").indexOf(yn) >=0)
       { out.println("X has y"); return; }
   String xs[] = Xn.split(",");
   int X[] = new int[xs.length];
   for (int i=0; i < xs.length; i++)
   try{
      X[i] = Integer.parseInt(xs[i]);
      if (X[i] < 0) return;
   }catch(Exception e){ out.println(xs[i] + " is not int"); return; }

   
   JDBCAdapter adapter = new  JDBCAdapter(user.getDBConnectInfo(), orgnum);
   adapter.needMetaInfo = true;
   if (adapter.error().equals("") == false)
   {
       out.println(adapter.error());
       adapter.close();
       return;
   }
   for (int k =0; k < 20; k++)
   {
       query = query.replaceFirst("NULL", "NULL and abs5yearrisk < " + ((k+1)*5) + " AND abs5yearrisk >=" + (k*5) +" ");
   int n = adapter.executeQuery(query);
   if (n < 0)
   {
      adapter.close();
      out.println(adapter.error());
      return;
   }
   int N =  9;//adapter.getColumnCount();
   if (y >= N){ adapter.close(); out.println(y + " is biger than " + N + query +  adapter.server + n + adapter.driverName());  return;}
   FileWriter aWriter = new FileWriter(dir + "X.m", k>0);
   
   for (int i=0; i < n; i++)
   {
       aWriter.write("1");
       for (int j=0; j < xs.length; j++)
       {
           if (X[j] >= N){ adapter.close(); out.println(X[j] + " is too big");  return;}
           aWriter.write( " " + adapter.getValueAt(i, X[j])  );
       }
       aWriter.write("\n");
   }
   aWriter.close();
   aWriter = new FileWriter(dir + "y.m", k>0);

   for (int i=0; i < n; i++)
   {
      aWriter.write( adapter.getValueAt(i, y) + "\n");
   }
   aWriter.close();
   adapter.close();
   }

   FileWriter aWriter = new FileWriter(dir + "search.m", false);
   aWriter.write(Toolbox.defaultParam(orgnum,request, ("search"), null));
   aWriter.close();
   try{
    Runtime r = Runtime.getRuntime();
    Process proc = null;
    String line =  octave + " search.m";
    proc = r.exec( line, null,  new File(dir));
    OutputStream out1 = proc.getOutputStream();
    SharedInt ss = new SharedInt();
    String str1 = dir +   "search.err";
    String str2 = dir +   "search.out";
    StreamThread errorGobbler = new   StreamThread(proc.getErrorStream(), str1, ss);
    StreamThread outputGobbler = new   StreamThread(proc.getInputStream(), str2, ss);
    errorGobbler.start();
    outputGobbler.start();
    int exitVal = proc.waitFor();
    exitVal = proc.exitValue();
    proc.destroy();
    }catch(Exception e){}
    String str = filetxt(dir +   "search.err").replaceAll("\n", "<br>");
    out.println("Error:<br>" + str +"<br><br>");
    str = filetxt(dir +   "search.out").replaceAll("\n", "<br>");
    out.println("Error:<br>" + str +"<br><br>");
 }
%>
      </body>
</html>