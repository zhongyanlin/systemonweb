 
package telaman;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import javax.servlet.AsyncContext;
import javax.servlet.AsyncEvent;
import javax.servlet.AsyncListener;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

class GoDelivery implements Runnable
{
    GoPlayer g;
    AsyncContext acontext;
    public GoDelivery(GoPlayer g,AsyncContext acontext)
    {
        this.acontext = acontext;
        this.g = g;
    }
    public void run()
    {
        try
        {
            //HttpServletRequest request = (HttpServletRequest)acontext.getRequest();
            String msg = "error";
          
            acontext.getResponse().setContentType("text/plain");  // Set content type of the response so that jQuery knows what it can expect.
            acontext.getResponse().setCharacterEncoding("UTF-8");
            PrintWriter p = acontext.getResponse().getWriter();
            if (g.sm.availablePermits()==0 && System.currentTimeMillis() - g.lastpost > 300000)
            {
                msg = "pausepoll()";
            }
            else
            {
                g.waiting = true;
                g.left = false;
                g.sm.acquire();
                msg = g.msg.peek();
                g.waiting = false;
                if (msg==null)
                    msg = "";
                else
                    msg = msg.trim();
                if (msg.contains("stopmsg()"))
                {
                    g.msg.poll();
                    Gosend.newmodifydel(g.id,"",-1,-1,0);
                   
                }
            }
            p.print(msg);
            p.close();
            g.msg.poll();
         
        }catch(Exception e){
          
        }
        acontext.complete();
      
    }
}
        

@WebServlet(name = "GoMessage", urlPatterns = {"/GoMessage"}, asyncSupported = true)
public class GoMessage extends HttpServlet
{
    public void doGet(HttpServletRequest request, HttpServletResponse response) 
   {
      final int id = Integer.parseInt(request.getParameter("id"));
      int timeout = Integer.parseInt(request.getParameter("timeout"));
      final GoPlayer me = Gosend.queue.get(""+id);
     
      if (me == null)
      {
          try{PrintWriter p = response.getWriter();
          p.write("newgame(-1);");
          p.close(); }catch(Exception e){}
          return;
      }
      if (me.sm == null)
      {
          try{PrintWriter p = response.getWriter();
          p.write("myprompt('sm==null')");
          p.close(); }catch(Exception e){}
          return;
      }
      
      final AsyncContext acontext = request.startAsync();
      boolean b = request.isAsyncStarted();
      try{ acontext.setTimeout(timeout*60000);} catch(Exception e1){ }
      acontext.addListener(new AsyncListener()
      {
          public void onComplete(AsyncEvent event) throws IOException 
          {
              
          }
         public void onTimeout(AsyncEvent event) throws IOException 
         {
                me.waiting = false; 
               
                ServletRequest req = acontext.getRequest();
                ServletResponse res = acontext.getResponse();
                if (req!=null && !res.isCommitted())
                {
                    PrintWriter p = res.getWriter();
                    p.write("timeout");
                    p.close();
                }
            }
           public void onError(AsyncEvent event) throws IOException 
            {
                me.waiting = false; 
            
                Gosend.newmodifydel(me.id,"",-1,-1,0);
            }
            public void onStartAsync(AsyncEvent event) throws IOException 
            {
            }
        });
        GoDelivery lp = new GoDelivery(me,acontext);
        acontext.start(lp);
        
   }
    public void doPost(HttpServletRequest request, HttpServletResponse response) 
   {
      final int id = Integer.parseInt(request.getParameter("id"));
      final GoPlayer me = Gosend.queue.get(""+id);
      response.setContentType("text/plain");  // Set content type of the response so that jQuery knows what it can expect.
      response.setCharacterEncoding("UTF-8"); 
      if (me == null)
      {
          try{PrintWriter p = response.getWriter();
          p.write("newgame(-1);");
          p.close(); }catch(Exception e){}
          return;
      }
      me.waiting = true;
       
      try{
          PrintWriter p = response.getWriter();
          String msg = me.msg.poll();
          if (msg!=null) 
              msg = msg.trim();
          else 
              msg = "";
          if (msg.equals("stopmsg()"))
          {
              Gosend.queue.remove(""+id);
          } 
          else if (msg.equals("") && System.currentTimeMillis() - me.lastpost > 300000)
          {
              msg = "pausepoll()";
              me.waiting =  false;
          }
          p.print(msg);
          p.close();
        
      }catch(Exception e){
         
      }
   }
}
