package telaman;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.TimeUnit;
import javax.servlet.AsyncContext;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.AsyncEvent;
import javax.servlet.AsyncListener;
import static telaman.Msgboxrun.mbox;
 
@WebServlet(name = "Msgretrive", urlPatterns = {"/Msgretrive"},asyncSupported = true)
public class Msgretrive extends HttpServlet 
{
   @Override
   public void doPost(HttpServletRequest request, HttpServletResponse response) 
   {
      
      String key = (request.getParameter("key"));
      String key1 = Msgsend.back(key);
      if (!key1.equals(""))key = key1;
      
      int orgnum = Toolbox.setcharset(request,response);
      
        if (orgnum == -1) return;
      String act = null;
      Msgboxrun x = Msgboxrun.mbox.get(key);
      if (x!=null)x.orgnum = orgnum;
      Msg ret = null;
      
      long ct = System.currentTimeMillis();
      if (x!=null&&request.getParameter("remove")!=null)
         x.remove();
      else if (x!=null&&(act = request.getParameter("reply"))!=null)
      {
          String sek = request.getParameter("sek");
          x.addreply(sek,act);
      }
      else if (x!=null&&(act = request.getParameter("drop"))!=null)
      {
         x.dropmsg(act);
      }
      else if ((act = request.getParameter("code"))!=null)
      {
         if (x==null && !act.equals("levave") && !act.equals("remove")  ) 
             x = new Msgboxrun(key);
       
         if (act.equals("new"))
         {
             String sid = request.getParameter("sid");
             String sek = request.getParameter("sek");
             String msg = Msgsend.back(request.getParameter("msg"));
             x.uid = sid;
             if (msg!=null)
             for (Queue<String> q : x.replyqueue.values())
             {
                 q.add(msg);
             }
             ret = new Msg(-1, "", "", x.list(), "newd", x.key,ct,  2);
         }
         else if (act.equals("seting"))
         {
             String sid = request.getParameter("sid");
             if (sid!=null) x.uid = sid;
             String sek = request.getParameter("sek");
             String msg = Msgsend.back(request.getParameter("msg"));
             if (msg!=null)
             for (Queue<String> q : x.replyqueue.values())
             {
                 q.add("seting:"+msg);
             }    
             ret = new Msg(-1, sek, sid, null, "sure", "", ct,  x.waiting>0?1:2);
         }
         else if (act.equals("quit"))
         {
             if (x.waiting>0) 
                 x.release();
             x.remove();
             ret = new Msg(-1, "", "", x.uid, "quit", "", ct, 1);
         }
         else if (act.equals("reply"))
         {
             String sid = request.getParameter("sid");
             if (x.uid == null && sid!=null) x.uid = sid;
             String rid = request.getParameter("rid");
             String msg = Msgsend.back(request.getParameter("msg"));
             String to = "own";
             if (rid!=null && !rid.equals("null")&& !rid.equals("undefined"))
             {
                 Msgboxrun student = x.students.get(rid);
                 if (student!=null && student.waiting>0)
                 {
                     to = "student";
                     student.dropmsg(msg);
                 }
                 else
                 {
                     x.addreply(rid, msg);
                 }
             }
             else
                x.addreply(null, msg);
             ret = new Msg(-1, "", "", x.uid, "sure", to, ct, x.waiting>0?1:2);
         }
         else if (act.equals("join"))
         {
             String sid = request.getParameter("sid");
             String sek = request.getParameter("sek");
             x.subscribes.add(sek + "-" + sid);
             Msg m= new Msg(-1, sek, sid, sek, "join", "", ct, 0);
             x.dropmsg(m.toString());
             String msg = "";
             if (x.replyqueue.get(sek)==null) 
             {
                 x.replyqueue.put(sek,new LinkedList<String>());
             }
             else 
                 msg = x.replyqueue.get(sek).poll();
             if (msg==null) msg = "";
             ret = new Msg(-1, "", "", x.uid, "newd", msg, ct, 1);
         }
         else if (act.equals("snap"))
         {
             ret = new Msg(-1, "", "", x.uid, "snap", x.summary(), ct, x.waiting>0?1:2);
         }
         else if (act.equals("leave"))
         {
             String sek = request.getParameter("sek");
             String sid = request.getParameter("sid");
             x.subscribes.remove(sek + "-" + sid);
             Msgboxrun student = x.students.get(sek);
             if (student!=null && student.waiting>0)
             {
                 student.release();
             }
             Msg m= new Msg(-1, sek, sid, sek, "leave", "", ct, 0);
             x.dropmsg(m.toString());
             
         }
         else if (act.equals("send"))
         {
             String sid = request.getParameter("sid");
             String sek = request.getParameter("sek");
             String msg = Msgsend.back(request.getParameter("msg"));
          
             Msg m= new Msg(-1, sek, sid, null, "plain", msg, ct, 0);
             msg = "";
             if (!x.isstudent) 
             {
                 x.dropmsg(m.toString());
                 Msgboxrun student = x.students.get(sek);
                 if (student!=null)
                 {
                     if (student.waiting==0)
                        x.students.remove(sek);
                     else
                        student.release();
                 }
                 if (x.replyqueue.get(sek) != null) 
                     msg = x.replyqueue.get(sek).poll();
                 else
                    x.replyqueue.put(sek, new LinkedList<String>());
             }
             
             if (msg==null) msg = "";
             ret = new Msg(-1, "", "", x.uid, "plain", msg, ct, 1);
         }
      }
      if (ret!=null)
      try
      {
           PrintWriter writer = response.getWriter();
           writer.println(ret.htmlmsg(orgnum));
           writer.flush();
           writer.close();
      }
      catch(Exception e1){}
   }
   
   @Override
   public void doGet(HttpServletRequest request, HttpServletResponse response) 
   {
      final AsyncContext acontext = request.startAsync();
      final String key = Msgsend.back(request.getParameter("key"));
      final String sid = request.getParameter("sid");
      final String sek = request.getParameter("sek");
      final boolean isstudent = (sid != null && sid.equals("@@@"));
      Msgboxrun box = Msgboxrun.mbox.get(key);
      if (isstudent && box == null) 
      {
         try
          {
               PrintWriter writer = response.getWriter();
               writer.print("nokey!");
               writer.flush();
               writer.close();
          }
          catch(Exception e1){}
         return;
      }
      final Msgboxrun m = isstudent? 
                     (box.students.keySet().contains(sek)? box.students.get(sek):new Msgboxrun(null))
                    :(box!=null ?box:(new Msgboxrun(key)));
      m.time = request.getParameter("time");
       
      if (isstudent)
      {
          Msgboxrun.mbox.get(key).students.put(sek,m); 
          m.isstudent = true;
      }
       
      boolean b = request.isAsyncStarted();
      try{ acontext.setTimeout(0);} catch(Exception e1){}
      acontext.addListener(new AsyncListener()
      {
         public void onComplete(AsyncEvent event) throws IOException 
         {
             if (m.isstudent)
                Msgboxrun.mbox.get(key).students.remove(sek); 
             else if (m.toremove && m.waiting == 0)
                Msgboxrun.mbox.remove(key);   
         }
         public void onTimeout(AsyncEvent event) throws IOException 
         {
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
 
