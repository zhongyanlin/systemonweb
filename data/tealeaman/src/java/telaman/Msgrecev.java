package telaman;

import java.io.*;
import java.net.URLDecoder;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import javax.servlet.*;
import javax.servlet.annotation.*;
import javax.servlet.http.*;
 

@WebServlet(name = "Msgrecev", urlPatterns = {"/Msgrecev"},   asyncSupported = true)
public class Msgrecev extends HttpServlet 
{
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
         
        final int orgnum = Integer.parseInt(request.getParameter("orgnum"));
        final String app = request.getParameter("app");
        final String sek = request.getParameter("sek");
        final String timeouts = request.getParameter("timeout"); 
            
        if (sek == null || app == null  ) 
        {
            return;
        }
        final String key = Msghold.keystr(orgnum, app, sek);
        Msghold lp = Msghold.messagers.get(key);
        if (lp == null)  
        {
            lp = new Msghold(orgnum, app,sek);
        }
         
        lp.timeout = -1;
        try{
           lp.timeout = Integer.parseInt(timeouts);
        }catch(Exception e){}
        
        String times= request.getParameter("time");
        lp.time = Long.parseLong(times);
        final AsyncContext acontext = request.startAsync();
        boolean b = request.isAsyncStarted();
        try{ acontext.setTimeout(0);} catch(Exception e1){}
        acontext.addListener(new AsyncListener()
        {
            public void onComplete(AsyncEvent event) throws IOException 
            {
            }

            public void onTimeout(AsyncEvent event) throws IOException 
            {
                
            }

            public void onError(AsyncEvent event) throws IOException 
            {
                // System.out.println("On Error:" + app + sek + key);
            }

            public void onStartAsync(AsyncEvent event) throws IOException 
            {
            }
        });
        lp.acontext = acontext;
        acontext.start(lp);
    }
     public String tos(String x)
    {
        if (x == null) return null;
        StringBuffer s = new StringBuffer();
        for (int i=0; i< x.length(); i+=4)
        {   
            s.append((char)(Integer.parseInt(x.substring(i,i+4),16)));
        }
        return s.toString();
    }
    static public boolean detect(HttpServletRequest request, int orgnum)
    {
        if (Toolbox.dbadmin[orgnum%65536].distributor ==null || !Toolbox.dbadmin[orgnum%65536].distributor.isAlive())
        {
            String names = ",";
            for (Thread t : Thread.getAllStackTraces().keySet()) 
             {
                 names += t.getName() + ",";
             }
            
          
            for (Thread t : Thread.getAllStackTraces().keySet()) 
             {
                 if (names.indexOf("," + t.getName()+"," ) <0) 
                 {
                     Toolbox.dbadmin[orgnum%65536].distributor = t; 
                     break;
                 }
            }
            return true;
        }
        return false;
    }
    public String getServletInfo() {
        return "Short description";
    }

    

}

