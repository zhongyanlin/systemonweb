 
package telaman;

import java.io.PrintWriter;
import java.util.NavigableSet;
import java.util.*;
import java.util.Vector;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import javax.servlet.*;
 
 

public class MsgQueue  
{
    public String app;
    public int orgnum;
    public long lifetime = 7200000;
    public long serial = 0;
    public static final long TIMEOUT = 7200000;
    public ConcurrentHashMap<String, MsgUser> userinfo = new ConcurrentHashMap<String, MsgUser>();
    public ConcurrentHashMap<String, Msghold> asyns = new ConcurrentHashMap<String, Msghold>();
    public ConcurrentHashMap<String, Msg> msgs = new ConcurrentHashMap<String, Msg>();
    public ConcurrentHashMap<String, String> sektimes = new ConcurrentHashMap<String, String>();
    public Semaphore putlock = new Semaphore(1);
    public Semaphore asnlock = new Semaphore(1);
   
    String threads()
    {
        String  names = "";
        for (Thread t : Thread.getAllStackTraces().keySet()) 
        {
            if (t.getName().contains("pool"))
            names += t.getName() + ",";
        }
        return names;
    }
    
    public void removeMsg(long j)
    {
        Msg m = msgs.get("" + j);
        if (m !=null )  
        {
            msgs.remove("" + j);
          
        }
    }
      
    public Msg next(long mserial)
    {
        for (mserial++; mserial < serial; mserial++)
        {
            Msg m = msgs.get(""+mserial);
            if (m != null) return m;
        }
        return null;
    }
    
    public void addMsg(Msg m)
    {
       if (m ==null) return;
       m.serial = serial;
       msgs.put(""+ serial, m);
       serial++;
     
       wakeup(m.sek);
       
    }
     String delayed = null;
     public void removeAsyn(String sektime)
    {
        Msghold asyn = asyns.get(sektime);
        if (asyn!=null)
        {
             asyns.remove(sektime);
            
        }
    }
     
    public void addAsyn(String sektime,Msghold ac)
    {
        
        if (ac ==null) return;
        asyns.put(sektime,ac);
      
    }
    public MsgQueue(String app, int orgnum)
    { 
        super();
        this.app = app;
        this.orgnum = orgnum;
        //topics =  new MsgTopics(app,orgnum);
       // topics = MsgTopic.topics;
    }
    public MsgQueue(String app, int orgnum,  int life )
    { 
        super();
       // topics =  new MsgTopics(app,orgnum);
        this.orgnum = orgnum;
        if (life != -1)
        lifetime = life;
    }
     
    
    
    public void broadaway(MsgUser w, String sek)
    {
        if (w == null || w.tids == null) return;
        
        String [] tids = w.tids.split(",");
        long ct = System.currentTimeMillis();
        if (!w.tids.equals(""))
        for (int i = 0; i < tids.length; ++i) 
        {
            try
            {
                 int j = Integer.parseInt(tids[i]);
                 for (Enumeration e = msgs.elements(); e.hasMoreElements();)
                 {
                     Msg q = (Msg)e.nextElement(); 
                     if (q.sek.equals(sek) && (q.tid==j || q.tid==0))
                     {
                         msgs.remove("" + q.serial);
                     }
                      
                 }
                MsgTopic topic = MsgTopic.topics.get(j);
                if (topic == null) continue;
                if (topic.exist(sek)) 
                {
                    topic.remove(sek); 
                    Msg m = new Msg(j, sek, null, null, "leave", "" + topic.subscribes.size(), System.currentTimeMillis() - lifetime + 1500, topic.subscribes.size()-1);
                    if (topic.subscribes.size()>1)
                    putin(m);
                }
                for (Enumeration e = asyns.elements(); e.hasMoreElements();)
                {
                    Msghold x = (Msghold)e.nextElement();
                   if( x.sek.equals(sek))
                   {
                       AsyncContext ac = x.acontext;
                       if (ac!=null &&!ac.getResponse().isCommitted())
                       {
                           //x.
                           x.sm.release();
                       }
                       else removeAsyn(sek+x.time);
                    }
                }
              
        
                if (topic.subscribes.size() == 0) 
                {
                    MsgTopic.topics.remove(j);
                }
            }catch(Exception e1){}
        }
    }
   
  /*  public String buddylist(String topic)
    {
        return MsgTopic.topics.buddylist(topic); 
    }*/
     
    public void expire(String sek)
    {
          MsgUser w = userinfo.get(sek);
          if (w!=null)
          {
              broadaway(w, sek);
              userinfo.remove(sek);
          }
    }
     
    //Semaphore  inlock = new Semaphore(1);
    public void  putin(Msg m)
    {
        if (m.rcount <=0 || m.tid <0) return;
        addMsg(m);
       
        
    }
      
    
    public void wakeup(String sek)
    {
        
        
        for (Enumeration e = asyns.elements(); e.hasMoreElements();)
        {
            Msghold x = (Msghold)e.nextElement();
            if (!x.sek.equals(sek))
            x.sm.release();
        }
    }
    
    
    public boolean validate( Msghold x)
    {
        AsyncContext  ac = x.acontext;
        boolean ret = false; 
        ServletRequest request = null;
        try
        {
            request = ac.getRequest();
            if ( request == null || ac.getResponse() == null  || ac.getResponse().isCommitted())
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
        
        String sek = x.sek;
        if (sek==null || sek.equals("")) return false;
        MsgUser w =  userinfo.get(sek);
        String osid = request.getParameter("sid");
      //  String time0str = x.time;
        String timeoutstr = request.getParameter("timeout");
        
        int ii=0;
        if (w == null) 
        {
            try{ac.complete();}catch(Exception e){}
            expire(sek);
            return false;
        }
        long time0 = w.time;
        try
        {
            time0 =  (x.time) + w.diff;
            boolean timeout = (now - time0 - MsgQueue.TIMEOUT > 0);
            if (timeout )
            {
                try{ac.complete();}catch(Exception e){}
                expire(sek);
                return false;
            }
        }
        catch(Exception e){}
        return true;
    }
    
    public Msg find(String  sek )
    {
        boolean done = false;
        Msg m;
       // String sek = ac.getRequest().getParameter("sek");  
        MsgUser w =  userinfo.get(sek);
        long ct = System.currentTimeMillis(); 
        while(true)
        {
            m = next(w.serial);
            if (m==null) return null;
            if(m.tid<0  )
            {
                w.serial = m.serial;
                continue;
            }
            else if( m.tid>=MsgTopic.topics.size())
            {
                w.serial = m.serial;
                continue;
            }
            MsgTopic topic = MsgTopic.topics.get(m.tid);
            if (topic == null)
            {
                w.serial = m.serial;
                continue;
            }
            boolean failed = false;
            int jj = 0;

            int  failstep = 0;
            
            if ( sek.equals(m.sek)  )  // self's
            {
                failstep = 1;
            }
            else  if (  m.time +  lifetime <= ct )  // self's
            {
                removeMsg(m.serial);
                failstep = 3;
            }
            else if (m.tid != 0 && topic.exist(sek) == false)
            {  
               failstep = 4;
            }
            else if( m.tid == 0 && app.equals(m.rid)  == false)
            {  
                failstep = 5;
            }
            else if (m.tid > 0  &&  m.rid != null && !m.rid.equals("") &&  ("," + m.rid + ",").contains("," + sek + ",")==false)
            {   //sender says not for me
                failstep = 6;
            }
            else  if (m.tid>0 && !w.listento.equals("") && !w.listento.contains("," + m.tid + ":" + m.sek + ",") )
            {   
                failstep = 7;
            }
 
            if (failstep > 0)
            {
                w.serial = m.serial;
              
                continue;
            }
           
            return m; 
        }
        
    }
    public String summary(String mysek,String mytid, int orgnum)
    {
        String words[] = Toolbox.emsgs(orgnum,1517).split("@");
        StringBuffer bf = new StringBuffer("<table><tr>");
        for (int i=0; i < 9; i++)
            bf.append("<td><nobr>"+ words[i] + "</nobr></td>");
        bf.append("</tr>");
        long N =  serial;
         
        String myself = words[19];
        String mytopic = words[20]; 
        int K =0;
      
        int mlen = msgs.size();
        String z = ",";
        for (long j=serial-1; j >=0 && K < 7; j--,K++)
        {
             
             Msg q = msgs.get("" + j);
             if (q == null) continue;
            
            String xx = q.sname;
            if (xx.matches("[0-9|a-z]+") && xx.length()>11)
            xx = Msgsend.back(xx);
            bf.append("<tr><td align=right>" + q.serial + "</td><td align=right>" + (mlen-K) + "</td><td align=right>" + q.tid +   "</td><td align=right>" + (q.sek.equals(mysek)?myself:q.sek) +   "</td><td><nobr>" + xx.replaceFirst("\\-.*","")
            + "</nobr></td><td>" + ((q.rid==null||q.rid.equals( app))?Toolbox.emsgs(orgnum,450):(q.rid.equals(mysek)?myself:q.rid)) + "</td><td>" + q.code +  "</td><td>" + Toolbox.timestr(q.time/1000,"hh:mm:ss")  +  "</td><td>" +  q.scount + "/" + q.rcount + "</td></tr>"  );
            
        } 
        bf.append("</table>");
         
        String x1 = bf.toString();
        
        String zz = "<table><tr>";
        for (int i=9; i < 15; i++)
            zz += "<td><nobr>"+ words[i] + "</nobr></td>";
        zz += "</tr>";
         
        if ( userinfo!=null)
        { 
            K = 0;
         
            for (String s:  userinfo.keySet())
            {
                if (K++ > 7) break;
                MsgUser u =  userinfo.get(s);
                 
                String xx = u.sname;
                if (xx.matches("[0-9|a-z]+") && xx.length()>11)
                xx = Msgsend.back(xx);
                xx = xx.replaceFirst("\\-[^\\-]*","");
                zz += "<tr><td><nobr>" +  xx + "</nobr></td><td align=right>" + u.serial + "</td><td align=right>" + (""+u.num)  + "</td><td>" +  Toolbox.timestr(u.time/1000,"hh:mm:ss")  + "</td><td>" + (u.listento.equals("")?Toolbox.emsgs(orgnum,450):u.listento) + "</td><td>" + u.tids + "</td></tr>";
            }
        }
        zz += "</table>";
        StringBuffer y = new StringBuffer("<tr>");
        
        for (int i=15; i < 19; i++) 
        {
             
            y.append("<td align=");
            if(i==16) y.append("left");
            else y.append("right");
            y.append("><nobr>");
            y.append(words[i]);
            y.append("</nobr></td>");
        }
        y.append("</tr>");
        
        String allt =  MsgTopic.alltopic().replaceFirst("," + mytid + ",", "," + mytopic +",");
        
        String x6 = "";
        if (!allt.equals(""))
        {
            CSVParse parse = new CSVParse(allt,'"', new String[]{",",";"});
            x6 = parse.html();
            x6= x6.replaceAll("<td>", "<td><nobr>").replaceAll("</td>", "</nobr></td>");
        }
         
        x6 =  asyns.size()  + "|" + bf + "|" + zz +  "|" + x6.replaceFirst("(?i)<table[^>]*>" ,"<table>" + y.toString()).replaceAll("<td", "<td align=right");
     
        return x6;
    }
}
