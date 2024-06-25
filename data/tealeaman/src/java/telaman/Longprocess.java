 
package telaman;
import facerec.*;
import java.io.*;
import java.util.HashMap;
import java.util.concurrent.atomic.AtomicBoolean;

import javax.servlet.AsyncContext; 
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.io.FileUtils;
import org.opencv.core.Core;
import org.opencv.objdetect.CascadeClassifier;
 


public class Longprocess   implements Runnable 
{
    private AsyncContext asyncContext;
    User user;
    Object renamefilelock = new Object();
    AtomicBoolean running;
    public String pathcode=null,cid=null,sessionname=null;
    static long lastclean = 0;
    public void run() 
    {
        int orgnum = user.orgnum;
        String msg = "";
        int j = -1;
        String tstmps = "1";
        long tstmp = 0L;
        String dir = "";
        String filename = null;
        long tt = 0;
        boolean timeout = false;
        String decoded = "", file0 = null;
        long fhc = new java.util.Date().getTime();
        
        try 
        {
            Encode6b encoder = new Encode6b(orgnum);
            
            file0 = encoder.rto6b(pathcode);
           
            j = file0.lastIndexOf(File.separator );
            if (new File(file0).exists() == false)
            {
                msg = "myprompt('" + file0 + " not exist')";
                
            }
            else if (j >0 && cid!=null && sessionname!=null) 
            {
                decoded = file0;
                dir = file0.substring(0, j);
                filename = file0.substring(j+1);
             
                String lp = (user.webFileFolder + File.separator + cid + File.separator + "attendance" + File.separator + filename);
                
                if (!lp.equals(file0))
                {
                    msg = "myprompt('" + file0.replace(File.separatorChar,'/') +  "')";
                     
                }
            }
            else if (j>0)
            {
                msg = "myprompt('" + file0.replace(File.separatorChar,'/') + " illegal')";
                synchronized ( renamefilelock) 
                {  
                    dir = file0.substring(0, j);
                    filename = file0.substring(j+1);
                    fhc = (new java.util.Date().getTime()) % 100000000; 
                    int k = dir.indexOf(user.webFileFolder + File.separator);
                    if (k != 0)
                    {
                         
                         msg = "myprompt('user.webFileFolder=" + user.webFileFolder + "'<br>";
                         msg += "dir=" + dir + "')";
                    }
                    else 
                    {  
                        int i = (user.webFileFolder + File.separator).length();
                        
                        if (i >= dir.length()) 
                        {
                            msg = "myprompt('" + i + " > " + dir.length() + "')";
                              
                        }
                        else 
                        {   
                            cid = dir.substring(i);
                            int p = cid.indexOf(File.separator);
                               
                            if (p < 0)
                            {
                                msg = "myprompt('p < 0')";
                                
                            }
                            else 
                            { 
                                cid = cid.substring(0,p);
                                int l = filename.lastIndexOf("."); 
                                    
                                if (l <= 0)
                                {     msg = "myprompt('" + filename + " not good')";
                                       
                                }
                                else 
                                { 
                                    String newfile = user.webFileFolder + File.separator + cid + File.separator + "attendance";
                                    if (new File(newfile).exists() == false)
                                    {
                                        new File(newfile).mkdir();
                                    }
                                    if (new File(newfile).exists())
                                    { 
                                        decoded = newfile + File.separator + (fhc % 100000000)  + filename.substring(l);
                                        
                                        if (!(new File(decoded).delete()))  FileUtils.deleteQuietly(new File(decoded));
                                        if ( ( new File(file0)).renameTo(new File(decoded))  || UploadFace.moveFile(new File(file0),new File(decoded) ) )
                                            msg = "";
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else 
            {
                msg = "myprompt('not image file')";
            }
        } 
        catch (Exception e)
        {
            msg = "myprompt('" + e.toString() + "')"; 
        }
        boolean reload = false;
        if (msg.equals(""))
        {

            String fp = null;
            if (sessionname!=null)
            {
                int hc = sessionname.hashCode() %100;
                fp = user.webFileFolder + File.separator + cid +  File.separator + "f" + Toolbox.dbadmin[orgnum%65536].currentSemester+  hc;
            }
            
            Face f = new Face(fp,decoded, sessionname!=null, running, orgnum);
            
            if ( sessionname==null)
            {  
                j = f.detect();
                
                if (j==-1) msg = "-1";
                msg = f.msg;
             
                synchronized (renamefilelock)
                {
                    if (!(new File(decoded)).renameTo(new File(file0)) && !UploadFace.moveFile(new File(decoded),new File(file0) ) )
                        msg = "myprompt('" + decoded + " can not rename to" + file0 + "')" ; 
                }
                
            }
            else
            {
                if (new File(decoded).exists())
                     msg = f.proc();
                else 
                    Toolbox.println(0,decoded + " not exits");
            } 
             
            if (msg==null || msg.equals("-1")  )
            {
                msg = "myprompt('opencv error')";
            }
    
             
        }

        if (running.get())
        try 
        {
            PrintWriter out = asyncContext.getResponse().getWriter();
            out.println(msg);
        } 
        catch (IOException e) 
        {
 
        }
        synchronized (this)
        {
            if (cid !=null && fhc - lastclean > 7200000)
            {
               //  ServerAgent.clean(user.webFileFolder + File.separator + cid + File.separator + "attendance");
                 lastclean = fhc;
            }
        }
        try{asyncContext.complete();}catch(Exception e){}
         
    }
    public Longprocess() {  }
 
    public Longprocess(AsyncContext asyncCtx, User user, String p, String c, String s,  AtomicBoolean running) 
    {
          this.asyncContext = asyncCtx;
          this.user = user;
          pathcode = p; 
          cid  = c; 
          sessionname = s;
          this.running = running;
    }
    
 
}
