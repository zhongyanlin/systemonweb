/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package telaman;

import javax.servlet.AsyncContext;

import java.io.PrintWriter;
import java.util.NavigableSet;
import java.util.*;
import java.util.Vector;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import javax.servlet.AsyncContext;
import javax.servlet.*;
import static telaman.MsgTopic.add;
import static telaman.MsgTopic.idzero;
public class Msghold implements Runnable
{
    final static int ONLINE = 0;
    final static int LEFT = 2;
    final static int BUSY = 1;
     
    public static HashMap<String,Msghold> messagers = new HashMap<>();
    public int orgnum;
    public long time;
    public String sek;
    public String sid;
    public String app;
    public String key;
    public String sname = "";
    public AsyncContext acontext = null;
    long lastpost = 0;
    public int status  = ONLINE;
    public int waiting  =  0;
    public int timeout = -1;
    public boolean toremove = false;
    long lastserial = 0;
    Queue<Msg> messagequeue = new LinkedList<>();
    public Vector<Integer> topicid = new Vector<>();
    public Vector<String> replyqueue = new Vector<>();
    public Semaphore sm = new Semaphore(0);
    static public Msghold get(int orgnum, String app,String sek)
    {
        String key =  keystr(orgnum, app,sek);
        return messagers.get(key);
    }
    public Msghold(int orgnum, String app,String sek)
    {
        this.orgnum = orgnum;
        this.sek =sek;
        this.app = app;
        this.sid = sek;
        if (MsgTopic.idzero == -1)
           MsgTopic.idzero = MsgTopic.add(orgnum,"chat","Updating new topics information");
        topicid.add(MsgTopic.idzero);
        key = keystr(orgnum, app,sek);
        messagers.put(key,this);
        MsgTopic topic = MsgTopic.topics.get(MsgTopic.idzero);
        if (!topic.subscribes.contains(sek))
        topic.subscribes.add(sek);
        if (topic!=null)
        for (Msg m: topic.msg)
               dropmsg(m);
    }
    public static void expire(int orgnum,String sek)
    {
        for (String key : messagers.keySet()) 
        {
            if (key.startsWith(orgnum%65536 + "|"+  sek + "|"))
            {
                Msghold x = messagers.get(key);
                x.remove();
            }    
        }
    }
    static public String keystr(int orgnum, String app,String sek)
    {
        return orgnum%65536 + "|"+  sek + "|" + app;
    }
    public String toString()
    {
         return   app  + "-" + sek + "-" + time;
    }
    public boolean validate()
    {
        boolean ret = false; 
        ServletRequest request = acontext.getRequest();
        try
        {
            if (  acontext.getResponse() == null  || acontext.getResponse().isCommitted())
            {
                return false;
            }
        }
        catch(IllegalStateException e)
        {
            ret = true;
            return false;
        }
        long now = System.currentTimeMillis();  
        if (request == null) return false; 
        
        String timeoutstr = request.getParameter("timeout");
        int ii=0;
        return true;
    }
   
    public static void dropmsg(int orgnum, String app,String sek,  Msg msg)
    {
        String k = keystr(orgnum,app,sek);
        Msghold x = messagers.get(sek);
        if (x!=null) x.dropmsg(msg);
    }
    public void remove()
    {
        if (waiting>0) 
            sm.release(waiting);
        Msghold.messagers.remove(key);
        MsgTopic.unsubscribe(sek);
    }
     
    public void run()
    {
        Msg msg = null;
        int tid;
        try
        {
            waiting++;
            if (timeout == -1)
            {
               sm.acquire();
               waiting--;
               synchronized(this)
               {
                  msg = messagequeue.peek();
               }
               if (msg==null)
               {
                  
                  acontext.complete();
                  return;
               }
               if (!acontext.getRequest().getParameter("time").equals(""+time))
               {
                   sm.release();
                   acontext.complete();
                   return;
               }
               else
               {
                   messagequeue.poll();
                   
               }
            } 
            else
            {
                if (sm.tryAcquire(timeout, TimeUnit.MINUTES))
                {
                    synchronized(this)
                    {
                        msg = messagequeue.peek();
                    }
                    if (msg==null)
                    {
                      acontext.complete();
                      return;
                    }
                    if (!acontext.getRequest().getParameter("time").equals(""+time))
                   {
                       sm.release();
                       acontext.complete();
                       return;
                   }
                   else 
                   {
                       messagequeue.poll();
                   }
                }
                else
                {
                   if (!acontext.getRequest().getParameter("time").equals(""+time))
                   {
                       acontext.complete();
                       return;
                   }
                    msg = new Msg(-1, sek, sname, null, "timeout", "", 0, 1);
                }
            } 
            lastserial = msg.serial;
            acontext.getResponse().setContentType("text/plain");  // Set content type of the response so that jQuery knows what it can expect.
            acontext.getResponse().setCharacterEncoding("UTF-8");
            PrintWriter p = acontext.getResponse().getWriter();
            if (msg!=null) p.print(msg.toString());
                p.close();
            
        }catch(Exception e)
        {
            if (msg!=null)
            {
                MsgTopic t = MsgTopic.topics.get(msg.tid);
                if (t!=null)
                {
                    t.subscribes.remove(sek);
                    topicid.remove(msg.tid);
                    if (topicid.size() == 0)
                        messagers.remove(key);
                }
            }
        }
        acontext.complete();
    }
    
    void dropmsg(Msg m)
    {
        try
        {
            synchronized(this)
            {
               lastpost = System.currentTimeMillis();
               messagequeue.add(m);
            }
        } 
        catch(Exception e)
        {
        } 
        sm.release();
    }
    void addreply(String m)
    {
        try
        {
            synchronized(this)
            {
               replyqueue.add(m);
            }
        } 
        catch(Exception e)
        {
        } 
    }
     
}
