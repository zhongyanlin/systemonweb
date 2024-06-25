package telaman;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.LinkedList;
import javax.servlet.AsyncContext;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.concurrent.*;
import javax.servlet.AsyncEvent;
import javax.servlet.AsyncListener;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
@WebServlet(name = "QuizResponse", urlPatterns = {"/QuizResponse"},asyncSupported = true)
public class QuizResponse extends HttpServlet 
{
   @Override
   public void doPost(HttpServletRequest request, HttpServletResponse response) 
   {
      final String key = Msgsend.back(request.getParameter("key"));
      Msgboxrun x = Msgboxrun.mbox.get(key);
      if (x!=null)
      {
          x.remove();
      }
   }
   
   @Override
   public void doGet(HttpServletRequest request, HttpServletResponse response) 
   {
      final AsyncContext acontext = request.startAsync();
      final String key = Msgsend.back(request.getParameter("key"));
      
      Msgboxrun m = Msgboxrun.mbox.get(key);
      if (m==null)
      {
          
          m = new Msgboxrun(key);  
      }
      boolean b = request.isAsyncStarted();
      try{ acontext.setTimeout(0);} catch(Exception e1){}
      acontext.addListener(new AsyncListener()
      {
         public void onComplete(AsyncEvent event) throws IOException 
         {
              
         }
         public void onTimeout(AsyncEvent event) throws IOException 
         {
             Msgboxrun.dropmsg(key,"timeout()"); 
         }
         public void onError(AsyncEvent event) throws IOException 
         {
                 
         }
         public void onStartAsync(AsyncEvent event) throws IOException 
         {
         }
        });
        
        m.acontext = acontext;
        acontext.start(m);
   }
     
}  
 
