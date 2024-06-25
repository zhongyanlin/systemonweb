 
package telaman;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Vector;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.atomic.AtomicBoolean;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import static telaman.DataRestore.chatcourse;
 
@WebServlet(name = "DBTableRestore", urlPatterns = {"/DBTableRestore"},   asyncSupported = true) 
public class DBTableRestore
extends UploadFile {
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
      
        User user;
        String webfile;
        HttpSession session = request.getSession(true);
        HashMap<String, String> params;
        PrintWriter out;
        String browser;
        final int orgnum = Toolbox.setcharset(request, response);
        if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        String encoding = Toolbox.encodings[orgnum>>16]; 
      
        user = (User)session.getAttribute("User");
        if (user == null) {
            RequestDispatcher requestdispatcher1 = this.getServletConfig().getServletContext().getRequestDispatcher("/login.jsp?follow=SYN&orgnum="+orgnum);
            requestdispatcher1.forward((ServletRequest)request, (ServletResponse)response);
            return;
        }
        if (orgnum!=user.orgnum || !(((user.roles & Systemroles.SYSTEMADMIN) != 0 || user.changedb(user.id) && user.mydb) && user.webFileFolder != null)) 
        {
            out = response.getWriter();
            out.print("Not authorized.");
            out.flush();
            out.close();
            return;
        
        }
        
        boolean issafari = (browser = request.getHeader("User-Agent")).indexOf("Safari") > 0;
        ServletInputStream servletinputstream = request.getInputStream();
        String encoding1;
        if (( encoding1 = request.getCharacterEncoding()) != null) {
            encoding =  encoding1;
        }
        params = new HashMap<String, String>(10);
        String conttype = this.getConttype(request);
        this.readParameters(params, servletinputstream, encoding, conttype);
        String langcode = (String)params.get("lancode");
        String isupload = (String)params.get("isupload");
        String longFileName = FileOperation.stdfn((String)params.get("filename"));
        String shortFileName = FileOperation.getFileName(longFileName);
        if (isupload != null && isupload.equals("2")) 
        {
            String startstr = params.get("start");
            long start = 100000000;
            if (startstr != null) start = Long.parseLong(startstr) ;
            String endstr = params.get("end");
            long end =   System.currentTimeMillis();
            if (endstr!=null) end = Long.parseLong(endstr);
            Vector<String> v = new Vector<String>(10);
            String userdir = user.webFileFolder; 
            String []errs = new String[]{"tlm"};
            String fold = "dropbox";
            if  (new File(userdir +File.separator + fold).exists())
            { 
                int j=0;
                while (new File(userdir +File.separator + "dropboxf" + j).exists()) 
                    j++;
                fold = "dropboxf" + j;

            }
            new File(userdir +File.separator + fold).mkdir();
            String file = Dropbox.downloadFiles( orgnum, user.id,  start,  end, userdir, fold, errs);
                        params.put("webfile", file); 
        }
        else if ((isupload == null || isupload.equals("1")) && longFileName != null) 
        {
            if (isupload == null) isupload = "1"; 
            File tempfile = null;
             
            try 
            {
                String tempuploadfolder = Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + "tempupload";
                tempfile = this.Uploadfile(params,  tempuploadfolder, conttype, servletinputstream, langcode, this.MaxUploadSize);
                if (!new File(user.webFileFolder).exists()) 
                   user.webFileFolder = System.getProperty("user.home");
                String dir = user.webFileFolder + File.separator + "dbroutine";
                if (!new File(dir).exists()) 
                {
                    DBTableRestore.makedir((String)dir);
                }
          
                File file1 = null;
                if (!new File(dir).exists()) 
                {
                    out = response.getWriter();
                    out.print("dbroutine folder is not writable.");
                    out.flush();
                    out.close();
                    return;
                }
                 
                synchronized (DBTableRestore.renamefilelock) 
                {
                    file1 = new File(dir, shortFileName);
                    if (file1.exists() && file1.length() == tempfile.length()) 
                    {
                        if (tempfile != null) 
                        {
                            tempfile.delete();
                        }
                        tempfile = null;
                        params.put("webfile", "dbroutine/" + shortFileName);
                    } 
                    else 
                    {
                        shortFileName = this.mkfn(dir, shortFileName);
                        if (DBTableRestore.renameTo((File)tempfile, (File)file1)) {
                            params.put("webfile", "dbroutine/" + shortFileName);
                        }
                        else
                        {
                            out = response.getWriter();
                            out.print("Fail to Rename " +tempfile.toString() + " to " +  file1.toString());
                            out.flush();
                            out.close();
                            return;
                        }
                    }
                }
            }
            catch (Exception e2) 
            {
                if (tempfile != null) 
                {
                    tempfile.delete();
                }
                tempfile = null;
                out = response.getWriter();
                out.print(e2.toString());
                out.flush();
                out.close();
                return;
            }
        }
        if ((webfile = (String)params.get("webfile")) == null) 
        {
            out = response.getWriter();
            out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\">" + Toolbox.emsgs(orgnum,102));
            out.flush();
            out.close();
        } 
        else 
        {
             
            webfile =  webfile.replace('/', File.separator.charAt(0));
            String overlap = (String)params.get("overlap");
            String totable = (String)params.get("totable");
            final String sek = (String)params.get("sek"); 
           
            final AtomicBoolean running = new AtomicBoolean(true);
           request.setAttribute("org.apache.catalina.ASYNC_SUPPORTED", true);
           AsyncContext asyncCtx = request.startAsync();
           asyncCtx.addListener(new AsyncListener()
        {
            public void onComplete(AsyncEvent asyncEvent) throws IOException 
            {
                running.set(false);
            }
            void backmsg(String ms)
            {
                int tid = -1;
                if (sek!=null )
                {
                    Msg m= new Msg(tid,  "DBTableRe.", Toolbox.emsgs(orgnum,1548), sek, "plain", ms, System.currentTimeMillis(), 1); 
                    Msgboxrun.dropmsg(sek + "_" +DataRestore.chatcourse,m.toString());
                }
            }
            public void onError(AsyncEvent asyncEvent) throws IOException
            {
                backmsg(" ");
                ServletResponse response = asyncEvent.getAsyncContext().getResponse();
                PrintWriter out = response.getWriter();
                out.println("error occured");
                out.close();
                running.set(false); 
            }

            public void onStartAsync(AsyncEvent asyncEvent) throws IOException 
            {
                backmsg(Toolbox.emsgs(orgnum,1472));
                running.set(true);
            }


            public void onTimeout(AsyncEvent asyncEvent) throws IOException {

                ServletResponse response = asyncEvent.getAsyncContext().getResponse();
                PrintWriter out = response.getWriter();
                out.write("myprompt('Taking too long. Quited')");
                running.set(false);
            }
         }
        );
      
        asyncCtx.setTimeout(0);
        ThreadPoolExecutor executor = (ThreadPoolExecutor) request.getServletContext().getAttribute("executor");
        DBTableRun lp =new  DBTableRun(asyncCtx, user, orgnum, isupload + webfile, encoding, totable, overlap,  running, sek, cachedstyle) ;
        executor.execute(lp);
        }
        
    }
    long MaxUploadSize = 80000000;

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }

}
