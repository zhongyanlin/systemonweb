package telaman;
import java.util.*;
import java.util.zip.*;
import java.io.*;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.atomic.AtomicBoolean;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import static telaman.DataRestore.chatcourse;

 
 

public class LongFilePro  implements Runnable 
    {
        private AsyncContext asyncContext;
        User user;
        public int orgnum;
        Object forlock = new Object();
        AtomicBoolean running;
        public String operation;
        public String file;
        public String dir;
        public String userdir;
        public String des;
        public int tid = -1;
        public String samefile = null;
        Msgboxrun mq = null;
        public String sek = null;
        static final public String chatunzip = Toolbox.emsg(1546); 
        CachedStyle cachedstyle;
        public void backmessage(String str)
        {
            if (mq!=null && sek!=null)
            {
                Msg m= new Msg(tid,  "LongFilePro", Toolbox.emsgs(orgnum,1548), sek, "plain", str, System.currentTimeMillis(), 1); 
                mq.dropmsg(m.toString());
            }
        }
        
        public LongFilePro(AsyncContext asyncCtx, User user, String operation, String dir, String file, String userdir, int orgnum, String des, AtomicBoolean running,String sek,CachedStyle cachedstyle) 
       {
          this.asyncContext = asyncCtx;
          this.user = user;
          this.orgnum = orgnum;
          this.operation = operation;
          this.running = running;
          this.dir = dir;
          this.file = file;
          this.des = des;
          this.userdir = userdir;
          this.samefile = null;
          this.cachedstyle =  cachedstyle;
          if (sek!=null )
          {
            this.sek = sek;
            mq = Msgboxrun.get(sek + "_" +DataRestore.chatcourse);
          }    
        }
        void copyto(File fd, String p, String userdir)
        {
            File [] files = fd.listFiles();
            if (files == null || files.length == 0) return;
            for (int i=0; i < files.length; i++)
            {
                if (files[i].isDirectory()) 
                    copyto(files[i],p,userdir);
                else
                {
                    String ff = files[i].getAbsolutePath();
                     
                    int j = p.lastIndexOf(File.separator );
                    String f1 = userdir + ff.substring(p.length());
                    if (new File(f1).exists()) 
                    {
                             (new File(f1)).delete();
                    }
                    files[i].renameTo(new File(f1));
                } 
            } 
            fd.delete();
        }
        public void   periodicrun()
        {
            String path = user.webFileFolder;
            long end =   System.currentTimeMillis();
            long nm[] = new long[3] ; 
            nm[0] = 0;
            String zipFileName = ZipUnZip.zip(path,user.lastbackup,end, nm);  
            if (nm[0]>0 && zipFileName != null ) 
            {
                String err = Dropbox.uploadFile(orgnum, user.id, zipFileName);
                new File(zipFileName).delete();
            }  
            String sql =  "UPDATE Userkeys SET lastupdate=" +  (System.currentTimeMillis()/1000) +" lastbackup=" + end + "  WHERE uid='" + user.id.replaceAll("'","''") + "'";
           JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
           adapter.executeUpdate(sql);
           adapter.close();

           DBTableBackup.backtofile(user, orgnum);
        }
        public void run() 
        {
            if (asyncContext==null)
            {
                periodicrun();
                return;
            }
            String msg = "";
            if (operation.equals("restore")) 
            {
                String []errs  = new String[]{"tlf"};
                String fold = "dropboxf";
                boolean isdrop = false;
                samefile = this.asyncContext.getRequest().getParameter("destination");
                
                if (file==null || file.equals(""))
                {
                    isdrop = true;
                    String startstr = this.asyncContext.getRequest().getParameter("start");
                    long start = 100000000;
                    if (startstr != null) start = Long.parseLong(startstr) ;
                    String endstr = this.asyncContext.getRequest().getParameter("end");
                    long end =   System.currentTimeMillis();
                    if (endstr!=null) end = Long.parseLong(endstr);
                    Vector<String> v = new Vector<String>(10);
                    if  (new File(userdir +File.separator + "dropboxf").exists())
                    { 
                        int j=0;
                        while (new File(userdir +File.separator + "dropboxf" + j).exists()) 
                            j++;
                        fold = "dropboxf" + j;
                        new File(userdir +File.separator + fold).mkdir();
                    }
                    else
                        new File(userdir +File.separator + "dropboxf").mkdir();
                    file = Dropbox.downloadFiles( orgnum, user.id,  start,  end, userdir, fold, errs);
                   
                }
                if (file==null || file.equals(""))
                {
                      msg += ("<script  type=text/javascript>parent.syn('error','No file')</script>\n"); 
                }
                else
                {
                    String tt[] = file.split(";");
                    Arrays.sort(tt, new Comparator<String>(){public int compare(String a, String b)
                    {
                        a = a.replace('/',File.separatorChar).replace('\\',File.separatorChar);
                        b = b.replace('/',File.separatorChar).replace('\\',File.separatorChar);
                        int al = a.lastIndexOf(File.separator )+1, bl = b.lastIndexOf(File.separator )+1;
                        return a.substring(al).compareTo(b.substring(bl));
                    }  });
                    String answer = "";
                    msg = "";
                    long z[] = new long[]{0};
                    long sl=0, tl = 0;
                    for (int i = 0; i < tt.length; i++) 
                    {
                        if (tt[i] == null || tt[i].equals("")) 
                        {
                            continue;
                        }
                        tt[i] = tt[i].replace('/',File.separatorChar).replace('\\',File.separatorChar);
                        int j = tt[i].lastIndexOf(File.separator);
                        String fn = tt[i].substring(j+1);
                        if ( !fn.matches("tlf2[0-9][0-9][0-9][0|1][0-9][0|1|2|3][0-9][0-9]?.zip")) 
                        {
                            continue;
                        }
                        String fo = FileOperation.mountwebsite(userdir + File.separator + tt[i], user);
                        try 
                        {
                            sl += (new File(fo)).length();
                            backmessage(Toolbox.emsgs(orgnum,80) + " " + tt[i]);
                            String folderName = ZipUnZip.unzip(fo, userdir, z, this,orgnum ); 
                            tl += z[0];
                            if (isdrop)
                            {    
                                (new File(fo)).delete();
                              
                            }

                        } catch (Exception e) 
                        {
                           msg += e.toString().replaceAll("'", "\\'") + "; ";
                        }
                    }
                    if (!msg.equals(""))
                        msg += ("<script  type=text/javascript>parent.syn('restore','" + msg + "<br>" + Toolbox.emsgs(orgnum,100) + "')</script>\n");
                    else
                        msg += ("<script  type=text/javascript>parent.syn('restore','" +  Toolbox.emsgs(orgnum,71) + ".(f:" + tt.length + ", "+  sl + "B -> " + tl + "B) ')</script>\n");
                }
                if (isdrop)
                {
                   deldir( new File(userdir +File.separator + fold));
                }
            } 
            else if (operation.equals("backup")) 
            {
                String path = user.webFileFolder;
                String zipFileName = null;
                String startstr = this.asyncContext.getRequest().getParameter("start");
                long start = 100000000;
                if (startstr != null) start = Long.parseLong(startstr) ;
                String endstr = this.asyncContext.getRequest().getParameter("end");
                long end =   System.currentTimeMillis();
                if (endstr!=null) end = Long.parseLong(endstr);
                 String wheretogo = this.asyncContext.getRequest().getParameter("wheretogo");
                if (wheretogo==null) wheretogo = "download";
                long []nm =new long[3]; nm[0] = 0;
                zipFileName = ZipUnZip.zip(path,start,end, nm); 
               
                if (nm[0]>0 && wheretogo.equals("download")) 
                {
                    File f = new File(zipFileName);
                    ServletOutputStream stream = null;
                    BufferedInputStream buf = null;
 
                    try {
                        
                        //this.asyncContext.getResponse().addHeader("Content-Disposition", "attachment" + ";filename=" + f.getName());
                        this.asyncContext.getResponse().setContentType("application/zip");
                        stream = this.asyncContext.getResponse().getOutputStream();
                        
                        this.asyncContext.getResponse().setContentLength((int) f.length());
                        FileInputStream input = new FileInputStream(f);
                        buf = new BufferedInputStream(input);
                        int readBytes = 0;
                        while ((readBytes = buf.read()) != -1) {
                            stream.write(readBytes);
                        }
                        input.close();
                       
                    } catch (IOException ioe) {
                        
                    } finally {
                        if (stream != null) {
                          try{  stream.close();}catch(Exception e){}
                        }
                        if (buf != null) {
                          try{  buf.close();}catch(Exception e){}
                        }
                        f.delete(); 
                    } 
                    return;
                } 
                else if (nm[0]>0 && wheretogo.equals("dropbox")) 
                {
                    
                    String err = Dropbox.uploadFile(orgnum, user.id, zipFileName);
                    
                    new File(zipFileName).delete();
                    msg = ("<script  type=text/javascript> parent.syserror(\"" + err.replace('"',' ') +  "\"); </script>");
                }
                else 
                {
                    msg = ("<script  type=text/javascript> parent.syserror(\"" + Toolbox.emsgs(orgnum,664) + "\"); </script>");
                }
            }
            if (operation.equals("unzip")) 
            {
                String fd = FileOperation.mountwebsite(dir, user) + File.separator + file;
                try {
                    String folderName = ZipUnZip.unzip(fd,null,null,null,orgnum);
                    msg = ("<script  type=text/javascript>parent.syn('refresh');</script>\n");
                } catch (Exception e) {
                    msg = ("<script  type=text/javascript>parent.syn('error','" + e.toString().replaceAll("'", "\\'") + "<br>" + Toolbox.emsgs(orgnum,100) + "')</script>\n");
                }
            } 
            else if (operation.equals("zip")) 
            {
                String path = FileOperation.mountwebsite(dir, user) + File.separator + file;
                String zipFileName = null;
                if ((new File(path)).isDirectory()) {
                    zipFileName = ZipUnZip.zip(path,-1,-1,null);
                } else {
                    zipFileName = ZipUnZip.zipfile(path);
                }
                if (zipFileName != null) {
                    operation = "edit";
                    Encode6b encoder = new Encode6b(orgnum);
                    File f = new File(zipFileName);
                    long leng = 0;
                    if (f.exists()) {
                        leng = f.length();
                    }

                    msg = ("<script  type=text/javascript> parent.addedItem(\"" + f.getName() + "\",\"" + encoder.to6b((new File(zipFileName)).getAbsolutePath()) + "\"," + leng + "," + (f.lastModified() / 1000) + ");  </script>\n");
                     
                } else {
                    msg = ("<script  type=text/javascript> parent.syserror(\"Error occured in zipping\"); </script>");
                }
            }
            else if (operation.equals("delete")) 
            {
                 
                String tt[] = file.split(";");
                String answer = "";
                for (int i = 0; i < tt.length; i++) 
                {
                    if (tt[i] == null || tt[i].equals("")) 
                    {
                        continue;
                    }
                    String f1 = FileOperation.mountwebsite(userdir + File.separator + tt[i], user).replace('/', File.separatorChar);
                    File fo = new File(f1);
                    
                    msg += (Toolbox.emsgs(orgnum,30) + " " + tt[i] + "<br>");
                    boolean isf = fo.isFile();
                    if (!fo.exists())
                    {
                        Toolbox.println(0,f1 + " no such file to delete");
                    }
                    else if( !deldir(fo)) 
                    {
                        answer = answer + tt[i] + ";";
                    }
                   // if (isf)
                    {
                        int k = f1.lastIndexOf(File.separator );
                        String fnn = f1.substring(k+1);
                        if (FolderMaintain.isimage(fnn))
                        {
                             String dir = f1.substring(0, k); 
                             (new Thread(new FolderMaintain(orgnum, dir,  fnn, "delete"))).start(); 
                        }
                    }
                }
              
                msg += ("<script  type=text/javascript>parent.syn('del','" + answer.replaceAll("'", "\\'") + "');</script>\n");
            }
            else if (operation.equals("move")) 
            {
                String answer = "";
                String tt[] = file.split(";");
                String addedfiles = "", desfile="";
                String delset = "", oldfold="";
                for (int i = 0; i < tt.length; i++) {
                    String source = FileOperation.mountwebsite(userdir + File.separator + tt[i], user).replace('/',File.separatorChar);
                    File fo = new File(source);
                  
                    String fn = FileOperation.getFileName(tt[i].replace('/',File.separatorChar));
                    desfile = userdir + File.separator;
                    if (des == null || des.equals("")) {
                        desfile += fn;
                    } else {
                        desfile += des + File.separator + fn;
                    }
                    String target = FileOperation.mountwebsite(desfile, user).replace('/',File.separatorChar); 
                   
                    synchronized (forlock) 
                    {
                        int j = !fo.exists() || !fo.renameTo(new File(target)) ? 0 : 1;
                        if (j == 0) 
                        {
                         
                            answer = answer + tt[i] + ";";
                        }
                        else if (FolderMaintain.isimage(fn))
                        {
                            addedfiles += "," + fn;
                            String fd = FileOperation.mountwebsite(userdir + File.separator + tt[i], user).replace('/',File.separatorChar);
                            int jj = fd.lastIndexOf(File.separator);
                            String fold = fd.substring(0,jj);
                            if (!delset.equals("") && !fold.equals(oldfold))
                            {
                                FolderMaintain fm = new FolderMaintain(orgnum, oldfold,delset.substring(1),"delete");
                                (new Thread(fm) ).start();
                                
                                delset = "";
                            }
                            delset += "," + fn;
                            oldfold = fold;
                            
                        }
                    }
                }
                 
                if (!delset.equals(""))
                {
                    FolderMaintain fm = new FolderMaintain(orgnum, oldfold,delset.substring(1),"delete");
                    (new Thread(fm) ).start();
                    
                }
                String fd = FileOperation.mountwebsite(desfile, user).replace('/',File.separatorChar); 
                int jj = fd.lastIndexOf(File.separator);
                
                if (!addedfiles.equals("")) 
                { 
                    FolderMaintain fm = new FolderMaintain(orgnum,fd.substring(0,jj),addedfiles.substring(1),"add");
                    (new Thread(fm) ).start();
                }
                msg = (answer + "<script  type=text/javascript>parent.syn('move','" + answer.replaceAll("'", "\\'") + "');</script>\n");
            }
            else if (operation.equals("copy")) 
            {
              
                String tt[] = file.split(";");
                String answer = "";
                String addedfiles = "";
                String fd="";
                for (int i = 0; i < tt.length; i++) 
                {
                    
                    File fo = new File(FileOperation.mountwebsite(userdir + File.separator + tt[i], user));
                    String fn = FileOperation.getFileName(tt[i]);
                    String desfile = userdir + File.separator;

                    if (des == null || des.equals("")) 
                    {
                        desfile += fn;
                    } 
                    else 
                    {
                        desfile += des + File.separator + fn;
                    }
                    String sourceFile = FileOperation.mountwebsite(userdir + File.separator + tt[i], user);
                    String targetFile = FileOperation.mountwebsite(desfile, user).replace('/', File.separatorChar);
                    int jj = targetFile.indexOf(File.separatorChar);
                    fd = targetFile.substring(0,jj);
                    if (!FileOperation.copy(sourceFile, targetFile)) 
                    {
                        answer = answer + tt[i] + ";";
                    }
                    else if (FolderMaintain.isimage(targetFile.substring(jj+1)))
                    {
                        addedfiles += "," + tt[i];
                    }
                }
                
                if (!addedfiles.equals("")) 
                { 
                    FolderMaintain fm = new FolderMaintain(orgnum,fd,addedfiles.substring(1),"add");
                    (new Thread(fm) ).start();
                }
                msg = ("<script  type=text/javascript>parent.syn('copy',\"" + answer + "\")</script>\n");
            } 
            if (running.get())
            try 
            {
                
                PrintWriter out = asyncContext.getResponse().getWriter();
                out.println("<!DOCTYPE html>\n<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >" + Toolbox.getMeta(orgnum));
                out.println("<head>");
                out.println("<title>" + Toolbox.emsgs(orgnum,636) + "</title>");
                out.println("</head>");
                out.println("<body  style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5 5 0 5\">");
                out.println(msg);
               
            } 
            catch (IOException e) 
            {

            }
            try{asyncContext.complete();}catch(Exception e){}
        }
        
        public static boolean deldir(File fd)
        {
           if (fd.exists() == false) return true;
           if (fd.isFile()) 
           {
               return fd.delete(); 
           }
           File t[] = fd.listFiles();
           boolean ans = true;
           if (t!=null)
           for (int i =0; i < t.length; i++)
              ans = ans && deldir(t[i]);
           ans = ans && fd.delete();
           return ans;
        }
        
        static public void periodback(HttpServletRequest request, User user,  int orgnum)
        {
            if (user!=null && user.lastbackup >=0 && user.backupperiod>=0 && System.currentTimeMillis() - user.lastbackup >= user.backupperiod)
            {
               CachedStyle cachedstyle = new CachedStyle(request,orgnum);
               LongFilePro lp =  new LongFilePro(null,  user, "", "", "", "",  orgnum, "", null, null, cachedstyle); 
               ThreadPoolExecutor executor = (ThreadPoolExecutor) request.getServletContext().getAttribute("executor");
               executor.execute(lp);
            }
        }
}

