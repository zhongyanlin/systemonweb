 
package telaman;
import java.net.*;
import java.lang.*;
import java.io.*;
import java.sql.SQLException;
import java.util.*;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.regex.*;
import javax.servlet.ServletContext;
import java.util.zip.GZIPOutputStream;
//import org.opencv.core.Core;
 
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;


class ClassScope {
    private static  java.lang.reflect.Field LIBRARIES =null;
    static {
        try{
        LIBRARIES = ClassLoader.class.getDeclaredField("loadedLibraryNames");
        LIBRARIES.setAccessible(true);}catch(Exception e){}
    }
    public static String[] getLoadedClasses(final ClassLoader loader) {  
        Vector<String> libraries = null;
        try{ libraries = (Vector<String>) LIBRARIES.get(loader);}catch(Exception e){return null;}
        return libraries.toArray(new String[] {});
    }
    /*
    public static boolean hasopencv()
    { 
        try{
         ClassLoader load =  ClassLoader.getSystemClassLoader();
         String[] libraries = ClassScope.getLoadedClasses(load);
          
        if (libraries!=null)
        for (int i=0; i < libraries.length; i++) 
           if(libraries[i].indexOf(Core.NATIVE_LIBRARY_NAME) > 0) 
                return true;
        return false;
        }catch(Exception e){ return false;}
    }*/
}


public class AppContextListener
implements ServletContextListener 
{
    ServletContext application = null;
     

    public void contextInitialized(ServletContextEvent event)
   {
      Toolbox1.initsafechars();
      Toolbox.print(0,"1. Initialization:");
      application = event.getServletContext();
      Toolbox.installpath = DBAdmin.removetwodots(application.getRealPath(""));
      
      Toolbox.installpath = DBAdmin.removetwodots(Toolbox.installpath);
      Toolbox.println(0, Toolbox.installpath);
      //maintain.js,funblock.js,textmsgs.js,textmsgr.js,comentity.js
      Pattern p = Pattern.compile("function[\n|\r|\t|\\s]*\\w*[\n|\r|\t|\\s]*\\(");
      String maint;
      try{Class.forName("org.sqlite.JDBC"); }
      catch(Exception e)
      {}
      int numorgs = DBAdmin.numdbhosts();
      
      for (int i=0; i < numorgs; i++)
      {
         int j=0;
         while (true)
         {
             int orgn = i + (j<<16);
             maint = Toolbox1.filebytes( "styleb" + orgn + ".css","UTF-8");
             if (maint==null) break;
             if (  maint.length()>1 && p.matcher(maint).find()) 
             {
                 Toolbox.print(0, "Failed at 2 \n\n\n\n");
                 return;
             }
             j++;
         }  
      }
     /*
     Toolbox.print(0, "2");
      maint = Toolbox1.filebytes( "maintain.js");
      if (maint!=null && maint.length()>1 && p.matcher(maint).find()) {
          Toolbox.print(0, "Failed at 3 \n\n\n\n");
          return;
      } 
       Toolbox.print(0, "3");
      for (int kk=0; kk < numorgs; kk++){
      maint = Toolbox1.filebytes( "funblock" + kk + ".js");
      if (maint!=null && maint.length()>1 && p.matcher(maint).find()) 
      {
            Toolbox.print(0, "Failed at 4 \n\n\n\n");
           return;
      } 
      }
       Toolbox.print(0, "4");
      
      maint = Toolbox1.filebytes(  "textmsgr.js");
      if (maint!=null && maint.length()>1 && p.matcher(maint).find()) {
          Toolbox.print(0, "Failed at 5 \n\n\n\n");
          return;
      } 
      
     Toolbox.print(0, "5!");
     
     */  
      if (Toolbox.installpath.charAt(Toolbox.installpath.length()-1) == File.separatorChar)  
          Toolbox.installpath = Toolbox.installpath.substring(0,Toolbox.installpath.length()-1);
      String str =  application.getContextPath();
      Toolbox.println(0,"2. context:" + str);
      int jj = -1;
      String aline = Toolbox1.filebytes("WEB-INF" + File.separator + "web.xml","UTF-8");
      jj = (aline==null)?-1:aline.indexOf("<display-name>");
      if (jj  >= 0 )
      {
           str = aline.substring(jj + 14,jj+30).replace('\n',' ').replace('\r',' ').replaceFirst("<.*", "").trim();
           Toolbox.appname = str;
      }
      else
      {
          if (!str.equals(""))
          {
             jj = str.lastIndexOf('/');
             str = str.substring(jj+1);
             Toolbox.appname = str;
          }
          else
          { 
              Toolbox.appname = "tealeaman";
          }
       }
      
        jj = (aline==null)?-1:aline.indexOf("<session-timeout>");
        if (jj>=0)
        {
                 String nstr = aline.substring(jj + 17,jj+30).replace('\n',' ').replace('\r',' ').replaceFirst("<.*", "");
                 try{ Toolbox.activeidletime = 60*Integer.parseInt(nstr)-100;}
                 catch(Exception e){}
        }
      Toolbox.println(0,"3. appname:" + Toolbox.appname );  
      Toolbox.println(0,"4. idle time:" + Toolbox.activeidletime);
      
      try{
        StringBuffer sb = new StringBuffer();
        sb.append( System.getProperty("os.name")  + ",");
        sb.append(  System.getProperty("os.arch") + ",");
        sb.append(  System.getProperty("os.version") + "," );
        sb.append(  System.getenv("PROCESSOR_IDENTIFIER") + ",");
        sb.append(  System.getenv("PROCESSOR_ARCHITECTURE") + ",");
        sb.append(  System.getenv("PROCESSOR_ARCHITEW6432") + ",");
        sb.append(  System.getenv("NUMBER_OF_PROCESSORS") + ",");
        sb.append(  Runtime.getRuntime().availableProcessors() +",");
       // sb.append(  Runtime.getRuntime().freeMemory() +",");
      //  sb.append(   Runtime.getRuntime().maxMemory() + "," );
        InetAddress ip = InetAddress.getLocalHost();
        NetworkInterface network = NetworkInterface.getByInetAddress(ip);
        byte[] mac = network.getHardwareAddress();
        if(mac!=null)
        for (int i = 0; i < mac.length; i++) 
        {
            sb.append(String.format("%02X%s", mac[i], (i < mac.length - 1) ? "-" : ""));     
        }
        Toolbox.macs = sb.toString(); 
  
    } catch (UnknownHostException e) {
  
        e.printStackTrace();
  
    } catch (SocketException e)
    {
         e.printStackTrace();
    }
    catch (Exception e)
    {
         e.printStackTrace();
    }
    String confpath = Toolbox.installpath +  File.separator +  "WEB-INF" +  File.separator +  "conf" +  File.separator;
    Toolbox.buildnumber = Toolbox1.filebytes("WEB-INF" + File.separator + "conf" + File.separator + "buildnumber.txt","UTF-8");
    if (Toolbox.buildnumber!=null)
        Toolbox.buildnumber = Toolbox.buildnumber.replaceFirst("[^0-9]+$","").trim();
	String license = Toolbox1.filebytes("WEB-INF" + File.separator + "conf" + File.separator + "license.txt","UTF-8");
    
    if (license != null) 
          Toolbox.license = license.trim();
    
    /*else 
    {
          long l = System.currentTimeMillis();
          Toolbox.license = Toolbox.timestr(l/1000, "YYYY-MM-DD-hh-mm-ss") + "-" + (l%1000);
          Toolbox1.writebytes("WEB-INF" + File.separator + "conf" + File.separator + "license.txt", Toolbox.license);
    }*/
     
      String encode = Toolbox1.filebytes("WEB-INF" + File.separator + "conf" + File.separator + "languages.txt","UTF-8");
      if (encode == null || encode.indexOf("\n") < 0 || encode.replaceAll("[^,]","").length()<4)
      {
          encode = "en\nen,utf-8,English,1,";
          Toolbox.println(1, "WEB-INF/conf/languages.txt file is missing.");
      }
      CSVParse parse = new CSVParse(encode.trim(),'"', new String[]{",","\n"});
      String [][] ps = parse.nextMatrix();
      Toolbox.locales = new Languag[ps.length-1];
      for (int k=0; k < ps.length-1; k++)
        Toolbox.locales[k]  = new Languag(ps[k+1]); 
      int q = 0;
      for (; q < ps.length-1; q++)
          if (ps[0][0].trim().equals(ps[q+1][0].trim())) break;
      if (q == ps.length-1) 
          Toolbox.langnum=0;
      else 
          Toolbox.langnum=q;
      
      if ( Toolbox.edition.contains("Personal"))  
      {
          Toolbox.locales = new Languag[1];
          Toolbox.locales[0] = new Languag(ps[Toolbox.langnum+1]);
          Toolbox.langnum = 0; 
      }
      
      Toolbox.encodings = new String[Toolbox.locales.length];
      Toolbox.langs = new String[Toolbox.locales.length];
      for (int i=0; i < Toolbox.langs.length; i++)
      {  
          Toolbox.encodings[i] = Toolbox.locales[i].encoding;
          Toolbox.langs[i] = Toolbox.locales[i].langcode;
          Toolbox.locales[i].hasjs =  (new File(confpath + Toolbox.langs[i] + "s.txt")).exists() ||
                  (new File( Toolbox.installpath +  File.separator + Toolbox.langs[i] + ".js")).exists();
          Toolbox.locales[i].hasmsg =  (new File(confpath + Toolbox.langs[i] + ".txt")).exists();
          Toolbox.locales[i].hasfront =  (new File(confpath + Toolbox.langs[i] + ".html")).exists();
          Toolbox.locales[i].hasinstru =  (new File(confpath + Toolbox.langs[i] + "m.html")).exists();
          Toolbox.locales[i].hasform =  (new File(confpath + Toolbox.langs[i] + "w.txt")).exists();
         
      }
      
      Toolbox.encoding = Toolbox.encodings[Toolbox.langnum];
      Toolbox.msgs = new String[Toolbox.langs.length][];
      Toolbox.println(0,"5. language:" + Toolbox.lang + ", lang=" + Toolbox.langs[Toolbox.langnum]);
      initit(Toolbox.lang);
      str =  Toolbox.installpath +  File.separator +  "WEB-INF" +  File.separator +  "conf" +  File.separator +  "dwldurks.crp";
            
           try{
            File file = new File(str);
            FileOutputStream fos = new FileOutputStream(file);
            GZIPOutputStream gzos = new GZIPOutputStream(fos);
            ObjectOutputStream out = new ObjectOutputStream(gzos);
            Vector<String> v = new Vector<>();
            if (Toolbox.msg.length > 1476 && !Toolbox.emsg(1476).equals(""))
               v.addElement(Toolbox.emsg(1476));
            else
               v.addElement(Toolbox.urls[0]); 
            if (Toolbox.msg.length > 1477 && !Toolbox.emsg(1477).equals(""))
                
               v.addElement(Toolbox.emsg(1477));
            else
               v.addElement(Toolbox.urls[1]);
            v.addElement(Toolbox.filehash);
            out.writeObject(v);
          
            out.close();
            gzos.close();
        }catch(Exception e){}
      if (Toolbox.hasface)
      {
       BlockingQueue<Runnable> threadPool = new LinkedBlockingQueue<Runnable>(20);
       ThreadPoolExecutor executor = new ThreadPoolExecutor(20, 200, 50000L, TimeUnit.MILLISECONDS, threadPool,
       new ThreadPoolExecutor.CallerRunsPolicy()  );
       event.getServletContext().setAttribute("executor",  executor);
      }   
         
    }
   
    public static void initit(String language) 
    {
        int p;
        String x = Toolbox.downloadroutines(language);
        Toolbox.println(0,"6 msg.length=" + Toolbox.msgs[Toolbox.langnum].length);  
       
        int numorgs = DBAdmin.numdbhosts();
        
        if (numorgs == 0) numorgs = 1;
         
        if ( Toolbox.msgs == null || Toolbox.msgs[Toolbox.langnum].length < 100  )
        { 
             Toolbox.initstatus = 4;
             if (Toolbox.license != null && !Toolbox.license.equals(""))
             {
                 Toolbox.println(0,"6. Initialization failed. You may need Internet connection.");
             }
             else
             {
                 Toolbox.println(0,"6. Toolbox.license= ");
             }
        }
        else
        {
               
            if (Toolbox.msgs[Toolbox.langnum].length > 1497)
            {
                Toolbox.fontsname = new String[Toolbox.langs.length];
                Toolbox.instruction = new String[Toolbox.langs.length];
                Toolbox.signuplink = new String[Toolbox.langs.length];
                //Toolbox.charsize = new byte[Toolbox.langs.length];
                Toolbox.copyright = new String[Toolbox.langs.length];
                Toolbox.timeformat =  new String[Toolbox.langs.length];
               
                for (int kk=0; kk < Toolbox.langs.length; kk++)
                {
                    Toolbox.fontsname[kk] = Toolbox.emsgs(kk<<16,1497).split(";")[1];
                    Toolbox.signuplink[kk] = "DataForm?rdap=registerc";
                    Toolbox.instruction[kk] = "Click Register button";
                   // Toolbox.charsize[kk] = 1;
                    Toolbox.copyright[kk] =  "2004-- " + Toolbox.emsgs(kk<<16,1236);
                    Toolbox.timeformat[kk] = Toolbox.emsgs(kk<<16,1613);
                }
            } 
            else 
                Toolbox.println(0,"6 msg.length=" + Toolbox.msgs[Toolbox.langnum].length);
            if (UploadFile.pfolders== null && Toolbox.msgs[Toolbox.langnum]!=null) 
                UploadFile.makepfolder(); 
            else
                Toolbox.println(0,"6 pfolders=" + UploadFile.pfolders);
            
            Toolbox.setCoding(language, Toolbox.installpath);
          
            Toolbox.dbadmin = new DBAdmin[numorgs];
            
            for (int j=0; j < numorgs; j++)
            {
               Toolbox.dbadmin[j] = new DBAdmin(j);
               Toolbox.dbadmin[j].adminornumber = j;
               Toolbox.dbadmin[j].readdbs();
               Toolbox.println(0,"6 systemdbms=" + Toolbox.dbadmin[j].systemdbms);
               p = Toolbox.dbadmin[j].hasSysDB();
               Toolbox.dbadmin[j].checklang();
               
               if (!(new File(Toolbox.installpath+ File.separator + "styleb" + j + ".css")).exists())
                   Toolbox.changecss("green","orange","red","blue",j);
               
               UploadFile.createfolder(j);
               Toolbox.println(0,"6 create folders");
            }
            if (Toolbox.edition.contains("Personal") || Toolbox.edition.contains("Institution") ) 
                Toolbox.dbadmin[0].subsitename = "subsites";
            
            if (Toolbox.dbadmin[0].phase != 3)
                Toolbox.println(0,"8 error dbphase=" + Toolbox.dbadmin[0].phase);
            else
            {
                if (Toolbox.tabledef != null) 
                {
                    for (int l=0; l < Toolbox.dbadmin.length; l++)
                    DbTable.syntable(Toolbox.dbadmin[l],Toolbox.tabledef);
                }
                Toolbox.println(0,"8. edition:" + Toolbox.edition);
                if (Toolbox.initstatus == 3)
                {
                    Toolbox.println(0,"10. " + Toolbox.emsg(1478));
                    
                }
                String t = Toolbox1.filebytes(  ".." + File.separator + "addresstosee.txt","UTF-8");
                 
                if (t!=null && !t.equals(""))
                {
                    t = Toolbox.emsg(1482) + t.replaceFirst("[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]", Toolbox.emsg(1483)) + "," + Toolbox.emsg(1484) + t;
                    Toolbox.println(0, t);
                     
                } 
                for (int j=0; j < numorgs; j++)
                {
                    Toolbox.dbadmin[j].run();
                }
            }
        }
    }

    public void contextDestroyed(ServletContextEvent event) 
    {
         
       if (Toolbox.hasface)
        {
        ThreadPoolExecutor executor = (ThreadPoolExecutor) event.getServletContext().getAttribute("executor");
        executor.shutdown();
        } 
        //System.gc();  
    }
    
    
}
