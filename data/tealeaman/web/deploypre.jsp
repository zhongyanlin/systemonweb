<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.zip.*,java.io.*,java.util.regex.*" %>
<%!
Pattern p = Pattern.compile("Toolbox\\.msg\\[[0-9]+\\]");
void mark1(String s, boolean y[])
{
    if (s == null || s.equals("")) return; 
    String z[] = s.split(",");   
    int j;
    for (int i=0; i < z.length; i++) 
    {
        String w = z[i].trim(); 
        if (w.length() == 0) continue;
         if (w.indexOf("1") == 0)   
         {
            try{j = Integer.parseInt(w.substring(1));
            y[j] = true;
            }catch(Exception e){}
         }
        }
} 
void mark(String s, boolean y[])
{
    if (s == null) return;
    Matcher m = p.matcher(s);
    int k = 0, e = 0;
    while (m.find(e))
    {
        k = m.start();
        e = m.end();
        int i = Integer.parseInt(s.substring(k+12,e-1));
        y[i] = true;
    }
}
%>

<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
%>
<!DOCTYPE html>


<%!

  
int max = 0;
int max0 = 0;
String savewebf(Webform w, JDBCAdapter adapter, Vector js, int orgnum)
{
    for (int i=0; i < Toolbox.langs.length; i++)
    {
    String sq =  "INSERT INTO TaskLang(lastupdate,rdapname,fieldlabels,ctypes,orders,title,help,keywords,defaultv,language) VALUES("
    + System.currentTimeMillis()/1000 +",'" + w.name  +"','"
    + w.formstr(worder(w, js,orgnum ))
    +"','" + w.formstr(w.ctypes) +"','','"
    + w2c(w.title, js, orgnum).replaceAll("'","''")  +"','" + hp(w).replaceAll("'","''") +"','','" + z(w).replaceAll("'","''") +"'," + Toolbox.langs[i] + "')" ;
    int  k = adapter.executeUpdate(sq);
    }
    //if (k < 1) return adapter.error();
    return "";
}

String hp(Webform w)
{
   if (w.help==null) return "";
   return w.help.replaceAll("'", "''");
}
String z(Webform w)
{
    String ans = "";
    for (int i=0; i < w.fields.length; i++)
    {  
       if (w.defaultv[i]!=null && !w.defaultv[i].equals("")) 
       {
          ans += w.fields[i] + "=" +  w.defaultv[i] +"\n";
       }
    }
    return ans.replaceAll("'", "''");
}

String [] worder(Webform w, Vector js,int orgnumn )
{
    String [] y = new String[w.fields.length];
    for (int i=0; i < w.fields.length; i++)
    {
         String x  = w.labels[i];
         if (x == null) x = w.fields[i];
         if (x == null) x = "";
         y[i] = wordorder(x,js,orgnumn ) ;
    }   
    return y;                   
}

Pattern qp = Pattern.compile("[A-Z|a-z][A-Z|a-z| |_]+[a-z]");
String w2c(String tt, Vector js, int orgnum )
{
        if (tt==null || tt.equals("")) return tt;
        tt = tt.trim();
        StringBuffer bf = new StringBuffer();
        Matcher m = qp.matcher(tt);
        int i, l, k = 0;
        String xx = tt;
        while (m.find(k))
        {
            i = m.start() ;
            bf.append(tt.substring(k, i));
            k = m.end();
            String n = tt.substring(i, k);
            if (i>0 && xx.charAt(i-1)=='?')
            {
                 bf.append(n);
                 xx = xx.replaceFirst("\\?\\?","  ").replaceFirst("\\?\\?","  ");

            }
            else
            {
               n = wordorder(n, js,orgnum );

               bf.append(n);
            }
        }
        if (k < tt.length())
        bf.append(tt.substring(k));
        return bf.toString();
}

String wordorder(String s, Vector js,int orgnumn )
{
        if (s==null && s.equals("")) return "";
        int i=0;
        try{ i = Integer.parseInt(s); return s;}catch(Exception e){}
        if (s.length() < 3) return s;
        if ( s.charAt(i)<'A' || s.charAt(i)>'Z'&& s.charAt(i)<'a' || s.charAt(i)>'z')
           return s;
        i = 0;
        int j = -1;
        try
        {
           j = Integer.parseInt(s.substring(s.length()-1));
           s = s.substring(0,s.length()-1);
        }
        catch(Exception e){}
        String s1 = s.replaceAll("([a-z])([A-Z])", "$1 $2");
        String s2 = s.substring(0,1).toUpperCase() + s.substring(1);
        while (i < Toolbox.msg.length && (Toolbox.emsgs(orgnumn,i) == null || (!s.equals(Toolbox.emsgs(orgnumn,i)) && !s1.equals(Toolbox.emsgs(orgnumn,i)) && !s2.equals(Toolbox.emsg(orgnumn,i)))))
        {
            i++;
        }
        if (i < Toolbox.msg.length)
        {
            if (j>-1) return "1" + i +"_" + j;
            return "1" + i;
        }
        int n = 0; for(; n < js.size(); n++)
            if (((String)js.elementAt(n)).equals(s) || ((String)js.elementAt(n)).equals(s1) ||   ((String)js.elementAt(n)).equals(s2))
                break;
        s  = "2" + n;
        if (j > -1) s  += "_" + j;
        if (n==js.size())
            js.addElement(s1);
        return s;

}
synchronized public void more2js(Vector js, StringBuffer out)
{
    for (int jj=0; jj < Toolbox.langs.length; jj++){
        String str = Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "conf" + File.separator + Toolbox.langs[jj] + "s.txt";
        try
        {
        FileWriter f = new FileWriter(str,true);
        for (int n=max0+1; n < js.size(); n++)
        {
            f.append("\n" + n + " " + js.elementAt(n));
            out.append(n + " " + js.elementAt(n) +"<br>");
        }
        f.close();
        }catch(Exception e){}
    }
}


synchronized  public static String makejs(String folder,  String dest) 
    {
        File file  = new File(folder + File.separator +   "languages.txt");
        if (file.exists() == false) 
        {
            return file.getAbsolutePath() + " does not exist";
        }
        String [] languages = null;
        StringBuffer str = new StringBuffer();
        try {
            FileInputStream fin = new FileInputStream(file);
            InputStreamReader esr = new InputStreamReader(fin);
            BufferedReader ebr = new BufferedReader(esr);
            String aline = ebr.readLine();
            while (true){ 
                aline = ebr.readLine();
                if (aline == null) break;
                if (str.length() > 0) str.append(",");
                str.append(aline.replaceFirst(",.*",""));
            }
            languages = str.toString().split(",");
            fin.close();
        }catch(Exception e){}
        for (int i=0; i < languages.length; i++)
        {
        String language = languages[i];
        file  = new File(folder + File.separator + language + "s.txt");
        String j = "";
        if (file.exists() == false) 
        {
            continue;//file  = new File(folder + File.separator +  "ens.txt");
        }
        try {
            FileInputStream fin = new FileInputStream(file);
            InputStreamReader esr = new InputStreamReader(fin);
            BufferedReader ebr = new BufferedReader(esr);
            String masterFile = dest + File.separator + language + ".js";
            String rmasterFile = null;
            if (  language.equals("en")) rmasterFile =dest + File.separator +   "textmsgr.js";
            FileWriter fout = new FileWriter(masterFile, false);
            FileWriter rfout = null;
            if ( language.equals("en")) rfout = new FileWriter(rmasterFile, false);
            
           if (  language.equals("en")) rfout.write("var c1to1 = new Array();\n");
            
            fout.write("var textmsg = [\n");
            String aline = null;
            int oldnum = -1;
            while ((aline = ebr.readLine()) != null) {
                if ((aline = aline.trim()).length() < 2) continue;
                aline = aline.replaceFirst("^[ |\t|\n|\r]+", "");
                int l = aline.indexOf(" ");
                String num = aline;
                if (l > 0) {
                    num = aline.substring(0, l).trim();
                    aline = aline.substring(l + 1);
                } else {
                    aline = "";
                }
                if (num.equals("+")) {
                    fout.write("+\"\\n" + Generic.handle(aline) + "\"");
                    continue;
                }
                if (num.matches("[0-9]+")) {
                    if (!( j = num).equals("0")) {
                        fout.write(",\n");
                    }
                    if (!num.equals("" + (oldnum+1)))
                
                    oldnum = Integer.parseInt(num);
                    fout.write("/*" + num + "*/\"" + Generic.handle(aline) + "\"");
                    if (  language.equals("en") && aline.length() < 30)  
                    {
                        rfout.write("c1to1[\"" + Generic.handle(aline).toLowerCase().replaceAll(" ", "") + "\"]=" + num + ";\n");
                    }
                    continue;
                }
                fout.write("+\"\\n" + Generic.handle(num) + Generic.handle(aline) + "\"");
            }
            fin.close();
            fout.write("];\nfunction getTextmsg(i){return textmsg[i];}");
            fout.close();
            if (  language.equals("en")) rfout.close();
        }catch(Exception e){}
        
        }
        return "";
    }
static public String backuproutines(String ip, int orgnum)
{
      String str = "";
      for (int k=0; k < 3; k++)
      {
         String object = "msg";
         if (k==1) object = "rou";
         else if (k==2) object = "tbl";
         try {
         String   folder = Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "routine" + File.separator;
         File file = new File(folder +  Toolbox.appname + Toolbox.version +  object + ".crp");
         // Create the necessary output streams to save the scribble. 
         FileOutputStream fos = new FileOutputStream(file);
         // Save to file 
         GZIPOutputStream gzos = new GZIPOutputStream(fos);
         // Compressed 
         ObjectOutputStream out = new ObjectOutputStream(gzos);
         // Save objects
         if (object.equals("msg"))
         {
          /* Vector<String> v = new Vector<String>();
           for (int i=0; i < Toolbox.msg.length ; i++)
           {
              if(Toolbox.emsgs(orgnum,i)!=null)
                  v.addElement(Toolbox.emsgs(orgnum,i));
              else
              {
                  v.addElement("");
              }
           }*/
            
           out.writeObject(Toolbox.msgs); 
         }
         else  if (object.equals("tbl"))
         {
           HashMap<String,String> v = new HashMap();
           JDBCAdapter adapter =  Toolbox.getSysAdapter(orgnum);
           int n = 0;
           boolean bb = adapter.executeQuery2("SELECT tname,definition,roles FROM Apptables ORDER BY tname",false);  
           String ss; 
           for (int i=0; bb && adapter.getValueAt(i,0)!=null; i++)
           {
              n++;
              if (adapter.getValueAt(i,0).length() > 2 )
              {
                  ss = adapter.getValueAt(i,1).trim(); 
                  
                  v.put(adapter.getValueAt(i,0),ss);
              }
           }
           adapter.close();
           out.writeObject(v);
           
         }
         else
         {
            out.writeObject(Generic.storedProc);
         }
         out.flush(); // Always flush the output. 
         out.close(); // And close the stream. 
         str +=   file.getAbsolutePath() +"<br>";
          
      } // Print out exceptions. We should really display them in a dialog... 
      catch (IOException e) {
        return "<font color=red>" + e.toString() + "</font>";
      }
     }
      return str;
}


public String reduced(String ip, int orgnum)
{
      String str = "";
      for (int k=0; k < 3; k++)
      {
         String object = "msg";
         if (k==1) object = "rou";
         else if (k==2) object = "tbl";
         try {
         String   folder =   "C:\\project\\tealeaman\\web\\WEB-INF\\conf\\";
         File file = new File(folder + object + ".crp");
         // Create the necessary output streams to save the scribble. 
         FileOutputStream fos = new FileOutputStream(file);
         // Save to file 
         GZIPOutputStream gzos = new GZIPOutputStream(fos);
         // Compressed 
         ObjectOutputStream out = new ObjectOutputStream(gzos);
         // Save objects
         if (object.equals("msg"))
         {
            boolean b[] = new boolean[Toolbox.msg.length];
            String fns[] = Toolbox1.filebytes("WEB-INF\\conf\\keepw.txt","UTF-8").split("[\r|\n]+"); 
            for (int j=0; j < fns.length; j++) 
            {
                if (fns[j].indexOf(".jsp") > 0)
                {
                    String w = Toolbox1.filebytes(fns[j],"UTF-8");
                    if (w!=null) 
                        mark(w,b);
                     
                } 
                else
                {
                    String w = Toolbox1.filebytes("..\\..\\src\\java\\telaman\\" + fns[j], "UTF-8");
                    if (w!=null)
                        mark(w,b);
                     
                } 
            }
            JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
            int n = adapter.executeQuery("SELECT Fieldlabels FROM gbk");
            for (int j=0; j < n; j++)
                mark1(adapter.getValueAt(j, 0), b);
            adapter.close(); 
           Vector<String> v = new Vector<String>();
           for (int i=0; i < Toolbox.msg.length ; i++)
           {
              if( b[i])
                  v.addElement(Toolbox.emsgs(orgnum,i));
              else
              {
                 
                  v.addElement("");
              }
           }
           out.writeObject(v);
         }
         else if (object.equals("rou"))
         {
            HashMap<String,Webform> x = new HashMap();
            java.util.Set<String> e = Generic.storedProc.keySet();
            for (String key:e)
            {
                
                if (key.indexOf("announce") >= 0 || key.indexOf("assign") >= 0 || key.indexOf("grading")>=0 || key.indexOf("submi") >=0 || key.indexOf("user") >=0)
                     x.put(key, Generic.storedProc.get(key));
            }
            out.writeObject(x);
         }
         // Write the entire Vector of scribbles 
         out.flush(); // Always flush the output. 
         out.close(); // And close the stream. 
         str +=   file.getAbsolutePath() +"<br>";
          
      } // Print out exceptions. We should really display them in a dialog... 
      catch (IOException e) {
        return "<font color=red>" + e.toString() + "</font>";
      }
     }
      return str;
}
static void restartWindows() {
        String shutdownCommand = "shutdown.exe /r /t 0";
        try {
            Process process = Runtime.getRuntime().exec(shutdownCommand);
            int exitCode = process.waitFor();
            
            if (exitCode == 0) {
                System.out.println("System restart initiated successfully.");
            } else {
                System.err.println("Failed to initiate system restart. Exit code: " + exitCode);
            }

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }    
   
%>

<%

String se =  Toolbox.gentoken("deploypre.jsp","f");
User user = null;

if (  (user = User.authorize(orgnum, Systemroles.SYSTEMANALYST|Systemroles.SYSTEMADMIN,application,session,request, response, "deploypre.jsp", true)) == null|| !Toolbox.verifytoken(request)) 
    return;
orgnum = user.orgnum; 
JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
            if (adapter.executeQuery("SELECT option2 from SystemParam")>0)
            {
                Toolbox.dbadmin[orgnum%65536].error2 =  adapter.getValueAt(0, 0);
             }
            adapter.close();  
String  act = Toolbox.defaultParam(orgnum,request, "act", "", null, 20); 
   if (!Toolbox.verifytoken(request)) return;
   String err = "";
   if (act.equals("restart") )
      restartWindows();
   else if (act.equals("routine") )
      err = backuproutines(request.getRemoteAddr(), orgnum);
   else if (act.equals("reduced") )
      err = reduced(request.getRemoteAddr(),orgnum);
   else if (act.equals("msg") )
       err = Toolbox.openuif(Toolbox.installpath,null);
    else if (act.equals("jif"))
      makejs("C:\\project\\tealeaman\\web\\WEB-INF\\conf", "C:\\project\\tealeaman\\web");
   else if (act.equals("sto"))
   {
       adapter = Toolbox.getSysAdapter(orgnum);
      Generic.storedProc.clear();
      Generic.genStoredProc(null,adapter,orgnum);
      adapter.close();
   }
   
  %>
        

<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=se%>";</script>
        <script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
        <title>Deployment Preparation</title>
    </head>
    <body>  <center>
        <h2>Deployment Preparation</h2>
        <%=err%>
        <form rel=opener name=f method=post action=deploypre.jsp  >
         <input type=hidden name=securitytoken  value="<%=se%>">
        <input type=hidden name=act >
        <input name=rou type=submit class="OrangeButton" value="Generate Routine File" onclick="document.f.act.value='routine'">  
        <input name=rou type=submit class="OrangeButton"value="Reduced Routine File" onclick="document.f.act.value='reduced'"> 
        <input name=ref1 type=submit class="OrangeButton" value="Update Interface Arrays" onclick="document.f.act.value='upd'">
        <br>
        <input name=jif type=submit class="OrangeButton" value="Generate Javascript Interface" onclick="document.f.act.value='jif'">
        <input name=ref type=submit class="OrangeButton" value="Generate Reference Counter" onclick="document.f.act.value='ref'">
        <input name=reg type=submit class="OrangeButton" value="Generate Stored Procedure" onclick="document.f.act.value='sto'">
        
        <br>
        <% if (Toolbox.lang.equals("zh-cn")){%>
        <input name=tif type=submit  class="RedButton" value="Generate Table Heading Word" onclick="document.f.act.value='wrd'">
        <%}%>
        <input name=css type=submit class="OrangeButton" value="Update Style Sheets" onclick="document.f.act.value='css'">
        <input name=css1 type=submit class="OrangeButton" value="Show Cache" onclick="document.f.act.value='cache'">
        <input name=css2 type=submit class="OrangeButton" value="Clear Cache" onclick="document.f.act.value='clear'"> 
        </form>
    </center>   
      <script type="text/javascript"  src=curve.js></script>
       <% if(act.equals("css"))
       {   
           adapter = Toolbox.getSysAdapter(orgnum);
           StringBuffer str = null;
           BackRoutine.postproc(user, adapter, "systemparameter", null, str, cachedstyle); 
          
           adapter.close();  
       }
       else  if(act.equals("ref"))
       {   
           StringBuffer outs = new StringBuffer(); 
           (new Task()).reference(outs);
           out.print(outs.toString());
           
       }
         else if(act.equals("upd"))
         {
            Toolbox.uifopen=false;
            Toolbox.openuif(Toolbox.installpath, null);
            //Toolbox.makejs(Toolbox.installpath);
            int i=0;for(; i <Toolbox.msg.length && Toolbox.emsgs(orgnum,i)!=null;i++);
            out.println("length=" + i  );
         }
         else if (act.equals("wrd"))
         {
            String encoding = Toolbox.encodings[orgnum>>16];
            if (!encoding.equals("utf-8"))
               out.println("not iso");
            else
            {
            //Vector h = new Vector();
            makejs("C:\\project\\tealeaman\\web\\WEB-INF\\conf", "C:\\project\\tealeaman\\web");
           /* if (m.equals("")==false)
               out.println("Wrong " + m);
            else
            {
            out.println(act);
            JDBCAdapter adapter = new JDBCAdapter(Toolbox.dbadmin[orgnum%65536].sysDBConnectInfo());
            adapter.executeUpdate("delete from TaskLang where encoding='utf-8'");
            java.util.Set<String> e = Generic.storedProc.keySet();
            for (String nm:e)
            {
               Webform w = (Webform) (Generic.storedProc.get(nm)); 
               if (w != null &&  w.query != null && !w.format.equals("Update"))
               {
                  String xx =  savewebf(w, adapter, h, orgnum  );
                  if (!xx.equals(""))
                      out.println("<br><br>" + xx);
               }
            }
            out.println("<form rel=opener name=f1 method=post action=deploypre.jsp  ><input type=hidden name=act value=enc>New Encoding<input name=newenc><input type=submit name=s1 value=Create></form>");
            StringBuffer outs = new StringBuffer();
            more2js(h,outs);
            out.println(outs);
            adapter.close();
            }*/
            }
         }
         else if (act.equals("enc"))
         {
            String newenc = Toolbox.defaultParam(orgnum,request, "newenc", null, null, 30);
            if (newenc==null || !Toolbox.encoding.equals("utf-8"))
               out.println("not iso");
            else
            {
            newenc = newenc.replaceAll("\\W","");
            adapter = Toolbox.getSysAdapter(orgnum);
            String sql = "insert into Apptables select "
                    + (System.currentTimeMillis()/1000)
                    + ",'"
                    + newenc
                    + "',replace(definition,'iso88591','"
                    + newenc
                    + "'),roles FROM Apptables where tname='iso88591'";
            int n = adapter.executeUpdate( sql);
            out.println(n + adapter.error());
            sql = "alter table iso88591 rename to " + newenc;
            n = adapter.executeUpdate( sql);
            out.println(n + adapter.error());
            adapter.close();
          }
          
       }
       else if (act.equals("rep"))
           {
              adapter = Toolbox.getSysAdapter(orgnum);
               Task t = new Task(adapter);
              // t.dolabel();
               adapter.close();
           }
       else if (act.equals("cache"))
       {
            out.println(Toolbox.dbadmin[orgnum%65536].cache.toString() + "<br>" ); 
            for (String cs : Toolbox.dbadmin[orgnum%65536].assigncache.keySet())
            {
                AssignCache x =  Toolbox.dbadmin[orgnum%65536].assigncache.get(cs);
                out.println(cs + "->" +x.toString() +"<br>"); 
            }
             out.println(Toolbox.dbadmin[orgnum%65536].dbinfocache.toString() ); 
        }
        else if (act.equals("clear"))
       {
            Toolbox.dbadmin[orgnum%65536].cache.clear() ; 
            Toolbox.dbadmin[orgnum%65536].assigncache.clear();
            Toolbox.dbadmin[orgnum%65536].dbinfocache.clear();
            out.println("OK");
        }
   %>

    </body>
</html>