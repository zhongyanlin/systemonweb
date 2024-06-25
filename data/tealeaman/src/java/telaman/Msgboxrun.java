package telaman;
import java.io.PrintWriter;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.LinkedList;
import java.util.Queue;
import java.util.TreeSet;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import javax.servlet.AsyncContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import static telaman.MsgTopic.alltopic;
 
public class Msgboxrun implements Runnable
{
    public static final HashMap<String,Msgboxrun> mbox =  new HashMap<>();
    public AsyncContext acontext = null;
    public HttpServletRequest request = null;
    public HttpServletResponse response =null;
    public String key;
    public String sek = null;
    public String uid = null;
    public long lastpost = 0;
    public int waiting = 0;
    public String time = "";
    public boolean toremove = false;
    public boolean isstudent = false;
    public int orgnum = 0;
    private Semaphore sm = new Semaphore(0);
    protected Queue<String> messagequeue = new LinkedList<String>();
    public TreeSet<String> subscribes =null;
    public Hashtable<String,Queue<String>> replyqueue = null;
    public HashMap<String,Msgboxrun> students = null; 
    public Msgboxrun(String key) 
    {
        this.key = key;
        if (key!=null)
        {
            subscribes = new TreeSet<String>();
            replyqueue = new Hashtable<String,Queue<String>>();
            students = new HashMap<String,Msgboxrun>(); 
            mbox.put(key,this);
        }
        else
        {
            isstudent = true;
        }
    }
    public static Msgboxrun get(String key)
    {
       Msgboxrun m= Msgboxrun.mbox.get(key);
       if (m!=null) return m;
       return new Msgboxrun(key);
    }
    public void release()
    {
        sm.release(waiting);
    }
    public void run()
    {
        String msg = "";
        int step = 0;
        try
        {
            waiting++;
            boolean tosend = false;
            step = 1;
            if (sm.tryAcquire(50, TimeUnit.MINUTES))
            {
                msg = messagequeue.peek();
                if (msg == null)
                {
                    step = 2;
                    toremove = true; 
                }
                else if (!acontext.getRequest().getParameter("time").equals(time))
                {
                    step = 3;
                    sm.release();
                }
                else
                {
                    step = 4;
                    tosend = true;
                    messagequeue.poll();
                }
            }
            else
            {
                step = 5;

                String oldtime = acontext.getRequest().getParameter("time");
                if (oldtime!=null && oldtime.equals(time))
                {
                    step = 6;
                    msg = "timeout()";
                    tosend = true;
                }
            }
            waiting--;
            step = 7;
            String sid1 = acontext.getRequest().getParameter("sid");
            if (isstudent &&(sid1==null || !sid1.equals("@@@"))
               ||!isstudent && sid1!=null && sid1.equals("@@@"))
                tosend = false;
            if (tosend)
            {
                step = 8;
                acontext.getResponse().setContentType("text/plain");  // Set content type of the response so that jQuery knows what it can expect.
                acontext.getResponse().setCharacterEncoding("UTF-8");
                step = 9;
                PrintWriter p = acontext.getResponse().getWriter();
                p.print(msg);
                step = 10;
                p.close();
                //lastpost = System.currentTimeMillis();
                step = 11;
            }
        }catch(Exception e)
        {
           
             toremove = true;
        }
        acontext.complete();
        
    }
    void dropmsg(String m)
    {
        try
        {
            synchronized(this)
            {
                messagequeue.add(m);
            }
        } 
        catch(Exception e)
        {
        }
        sm.release();
         
    }
    public static void dropmsg(String key, String msg)
    {
        Msgboxrun x = mbox.get(key);
        if (x==null) 
            x = new Msgboxrun(key);
        x.dropmsg(msg);
    }
    public void remove()
    {
        if (waiting>0) 
            sm.release(waiting);
        Msgboxrun.mbox.remove(key);
    }
    String list()
    {
        StringBuffer s = new StringBuffer();
        for (String sekx: subscribes) 
        {
            if(s.length()>0) s.append(",");
            s.append(sekx);
        }
        return s.toString();
    }
    public void leave(String sek, String sid)
    {
         subscribes.remove(sek + "-" + sid);
         Msgboxrun student = students.get(sek);
         if (student!=null && student.waiting>0)
         {
             student.release();
         }
         Msg m = new Msg(-1, sek, sid, sek, "leave", "", 0, 0);
         dropmsg(m.toString()); 
      
    }
    void addreply(String sid,String m)
    {
        try
        {
            if (sid!=null)
            {
                synchronized(this)
                {
                   Queue<String> q = replyqueue.get(sid);
                   if(q!=null)
                   {
                       q = new LinkedList();
                       replyqueue.put(sid,q);
                   }
                   q.add(m);
                }
            }
            else
            {
                synchronized(this)
                {
                   for (String sidx : subscribes) 
                   {
                       sidx = sidx.replaceFirst("\\-.*","");
                       Queue<String> q = replyqueue.get(sidx);
                       if(q!=null)
                       {
                           q = new LinkedList();
                           replyqueue.put(sidx,q);
                       }
                       q.add(m);
                   }
                }
            }
        } 
        catch(Exception e)
        {
        } 
    }
    public  String summary()
    {
        StringBuffer bf = new StringBuffer();
        bf.append("<table><tr><td>" + Toolbox.emsgs(orgnum, 233) +"</td><td>" 
                + Toolbox.emsgs(orgnum,190) +"</td><td>" 
                + Toolbox.emsgs(orgnum,213)
                +"</td></tr>");
        bf.append("<tr><td>" + (sek==null?"":sek) + "</td><td>" + uid + "</td><td>" + key + "</td></tr></table>");
        StringBuffer st = new StringBuffer();
        st.append("<table><tr><td>#Waiting</td><td>Remove</td><td>#Messages</td><td>#Subs</td><td>#Reply</td><td>#Students</td></tr>");
        st.append("<tr><td>" + waiting + "</td><td>" + toremove + "</td><td>" + messagequeue.size() + "</td><td>" + subscribes.size() 
                + "</td><td>" + replyqueue.size() + "</td><td>" + students.size() + "</td></tr></table>");
        StringBuffer zz = new StringBuffer("<table><tr><td>Mbox</td></tr>");
        int k=0;
        for (String key1:mbox.keySet())
        {
            zz.append("<tr><td>" + key1 + "</td></tr>");
            if (++k == 7) break;
        }
        zz.append("</td></tr></table>");
        String x7 =  mbox.size()  + "|" + bf.toString().replace("|","-") + "|" + st.toString().replace("|","-") + "|"+ zz.toString().replace("|","-") ;
        return x7;
    } 
}
 
