package telaman;
import java.io.*;
import java.net.URLDecoder;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import javax.servlet.*;
import javax.servlet.annotation.*;
import javax.servlet.http.*;
import static telaman.MsgTopic.add;
import static telaman.MsgTopic.idzero;
 
@WebServlet(name = "Msgsend", urlPatterns = {"/Msgsend"},   asyncSupported = true)
public class Msgsend extends HttpServlet 
{
    static public String back(String x)
    {
        if (x==null) return null;
        StringBuffer y = new StringBuffer();
        try{
        for (int i=0; i < x.length()/4 ; i++)
        {
            int j = Integer.parseInt(x.substring(i*4,(i+1)*4), 16);
            char c = (char)(j);
            y.append(c);
        }
        return y.toString();
        }catch(Exception e){return "";}
    }
    static public AtomicInteger sn = new AtomicInteger(100000); 
     
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        service( request,  response, true);
    }
    protected void service(HttpServletRequest request, HttpServletResponse response, boolean post) throws ServletException, IOException 
    {
        HttpSession session = request.getSession(true); 
        int orgnum = Toolbox.setcharset(request,response);
        if (orgnum == -1) return;
        CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        response.setHeader("Content-Type",  "text/html");
        String app = Toolbox.defaultParam(orgnum,request, ("app"), null);
        app = Toolbox.validate(app, null, 8);
        String tidstr = Toolbox.defaultParam(orgnum,request, ("tid"), null);
        tidstr = Toolbox.validate(tidstr, null, 10);
        String topicstr = Toolbox.defaultParam(orgnum,request, ("topic"), null);
        topicstr = Toolbox.validate(topicstr, "<>-!@#$%^&*()+][{},/?:;", 60);
        String sid = Toolbox.defaultParam(orgnum,request, ("sid"), null);
        sid = Toolbox.validate(sid, null, 10);
        String sname  = Toolbox.defaultParam(orgnum,request, ("sname"), null);
        sname  = Toolbox.validate(sname, null, 120);
        String rid = Toolbox.defaultParam(orgnum,request, ("rid"), null);
        rid = Toolbox.validate(rid, ",", 2000);
        if (rid != null && rid.equals("")) 
        {
            rid = null;
        }
        String act = Toolbox.defaultParam(orgnum,request, ("code"), null);
        act = Toolbox.validate(act, null, 6);
        String msg  = Toolbox.defaultParam(orgnum,request, ("msg"), null); 
        String keeplongstr  = Toolbox.defaultParam(orgnum,request, ("keeplong"), null); 
        boolean keeplong = false;
        if (keeplongstr!=null && keeplongstr.equals("true"))
            keeplong = true;
        
        String sek = Toolbox.defaultParam(orgnum,request, ("sek"), null); 
        sek = Toolbox.validate(sek, "", 20);
        if (sek!=null && sek.equals("null"))
            sek = null;
        long ct = System.currentTimeMillis();
        int tid = -1;
        try 
        {
            tid = Integer.parseInt(tidstr);
        }
        catch (NumberFormatException e) 
        {
        }
        User user = (User)session.getAttribute("User");
        boolean needtpproc = false;
        Msg  ret = null;
        
        MsgTopic topic = MsgTopic.topics.get(tid); 
        if (topic == null && MsgTopic.idzero == -1 && app.equals("chat"))
        {
            MsgTopic.idzero = MsgTopic.add(orgnum,"chat","Updating new topics information");
        }
        Msghold me = null;
        String key = null;
        if (sek != null)
        {
            key = Msghold.keystr(orgnum, app, sek);
            me = Msghold.messagers.get(key);
        }
        
        if ((user == null || user.orgnum!=orgnum) && (act==null || !act.equals("unsubs")))
        {
            ret = new Msg(MsgTopic.idzero, sek, sname, sek, "login",  (new Encode6b(orgnum)).to6b("parent.Msg.send()"), ct, 0);
        }
        else   if ( app == null || app.equals("")) 
        {
            ret = new Msg(tid, sek, sname, rid, "error", "No action code: one of these: new, put, unsubs, move fire", ct, 0);
        } 
        else if ( tid == -1 && !act.equals("unsubs") && !act.equals("new"))
        {
            ret = new Msg(tid, sek, sname, rid, "error", "no topic", ct, 0);
        } 
        else  if (act.equals("new") || act.equals("join")  || act.equals("resume") ) 
        {
            String msg1 = Toolbox.validate(msg, "<>!@#$%^&*()+][{},/?:;", 80);
            if (act.equals("new"))
            {
                tid = MsgTopic.add(orgnum,app,msg1);
            }
            else if (act.equals("join"))
            {
                tid = MsgTopic.add(orgnum,app,msg1);
            } 
            else if (act.equals("resume"))
            {
                tid = MsgTopic.add(orgnum,app,msg1);
            }
            topic = MsgTopic.topics.get(tid);
             
            if (tid == -1 || topic == null)
            {
                if (act.equals("new"))
                    ret = new Msg(MsgTopic.idzero, sek, sname, null, "error", "Maximum number of message queues reached. Please wait for a while after some sessions ends. Title=" + msg1, ct, 0);
                else
                    ret = new Msg(MsgTopic.idzero, sek, sname, null, "error", "no session", ct, 0); 
            } 
            else //if (act.equals("resume") && topic!=null)
            {
                Msg m;
                if (sek!=null && !topic.subscribes.contains(sek))
                     topic.subscribes.add(sek);
                if (me==null && sek!=null) 
                {
                    me = new Msghold(orgnum, app, sek);
                }
                if (me!=null)
                {
                   if (!me.topicid.contains(tid) && tid>-1)
                       me.topicid.add(tid);
                   me.sname = sname;
                }
                int nummember = topic.subscribes.size();
                if (act.equals("new") && app.equals("chat")) 
                {
                    m = new Msg(MsgTopic.idzero, sek, sname, app, "new"+tid,  msg1, ct, 0);
                    MsgTopic mt = MsgTopic.topics.get(MsgTopic.idzero);
                    mt.distribute(m,true);
                    needtpproc = true;
                    if (topic!=null && me!=null)
                    {
                        for(Msg mm : topic.msg)
                          me.dropmsg(mm);
                    }
                }
                else  if (act.equals("resume") && app.equals("chat"))
                {
                    m = new Msg(tid, sek, sname, null, "resume", "" + nummember, ct, me.waiting>0?1:2);
                    if (topic!=null)
                    {
                       if (me!=null)
                       for(Msg mm : topic.msg)
                          me.dropmsg(mm);
                       topic.distribute(m,false);
                    }
                }
                else if (app.equals("chat"))
                {
                    m = new Msg(tid, sek, sname, null, "join", "" + nummember, ct, me.waiting>0?1:2);
                    if (topic!=null)
                    {
                       if (me!=null)
                       for(Msg mm : topic.msg)
                          me.dropmsg(mm);
                       topic.distribute(m,false);
                    }
                }else if (topic!=null && me!=null)
                {
                        for(Msg mm : topic.msg)
                          me.dropmsg(mm);
                }
                ret = new Msg(tid, sek, sname, topic.list(), "newd", msg, ct,  2);
            }
        } 
        else if (sek!=null && act.equals("litsen") )
        {
            if (topic!=null && !topic.subscribes.contains(sek))
                 topic.subscribes.add(sek);
            if (me == null)
                me = new Msghold(orgnum, app,sek);
            if (!me.topicid.contains(sek))
                 me.topicid.addElement(tid);
            me.sname = sname;
        }
        else if (sek!=null && act.equals("snap") )
        {
            if (tid > 0)
            {
                String x = topic.summary(sek,orgnum);
                ret = new Msg(tid, sek, sname, null, "snap", x,  ct, me.waiting>0?1:2);   
                needtpproc = true;
            }
        }
        else if (act.equals("plain") || act.equals("html") || act.equals("latex") || act.equals("status") || act.equals("draw")|| act.equals("both") )
        {
            boolean itismsg = false;
            if (act.equals("draw") && msg.equals("d"))
            {
                topic.numCurves = 0;
                topic.numLines = 0;
                topic.numShapes = 0;
            }
            else if (act.equals("draw") &&   msg.equals("s")) 
            {
                msg = msg + topic.numShapes;
                ++topic.numShapes;
                ret = new Msg(tid, sek, sname, rid, "draw", msg, ct, (me==null||me.waiting>0)?1:2);
                
            } 
            else if (act.equals("draw") &&   msg.equals("l")) 
            {
                msg = msg + topic.numLines;
                ++topic.numLines;
                ret = new Msg(tid, sek, sname, rid, "draw", msg, ct, (me==null||me.waiting>0)?1:2);
            } 
            else if (act.equals("draw") &&   msg.equals("c")) 
            {
                msg = msg + topic.numCurves;
                ++topic.numCurves;
                ret = new Msg(tid, sek, sname, rid, "draw", msg, ct, (me==null||me.waiting>0)?1:2);
            } 
            else if (act.equals("status") ) 
            {
                try{me.status = Integer.parseInt(msg);}catch(Exception e){}
                ret = new Msg(tid, sek, sname, rid, "sentstatus", msg, ct, (me==null||me.waiting>0)?1:2);
            } 
            else if (tid>-1 && topic!=null && topic.aceept==false)
            {
                ret = new Msg(tid, sek, sname, rid, "reject",  msg, ct, (me==null||me.waiting>0)?1:2); 
            }
            else if (tid>-1 && topic!=null && topic.aceept)
            {
                if (msg.length() > 20000) 
                {
                    msg = msg.substring(0, 20000);
                }
                int rcount = topic.subscribes.size();
            
                if (rid!=null && !rid.equals("")) 
                {
                    rcount = rid.replaceFirst("^,","").replaceFirst(",$","").replaceAll("[^,]","").length()+1;
                }
                Msg m= new Msg(tid, sek, sname, rid, (act.equals("both")?"plain":act), msg, ct, rcount);
                int i=0;
                if (m.msg.equals("") == false)
                {
                   if ( (act.equals("draw") || act.equals("plain") || act.equals("html") || act.equals("latex") || act.equals("both")))
                   {
                       topic.distribute(m,keeplong,rid);
                   }
                }
                if (!act.equals("draw"))
                     ret = new Msg(tid, sek, sname, rid, "sure" ,  msg, ct, (me==null||me.waiting>0)?1:2);
                else
                     ret = new Msg(tid, sek, sname, rid, "draw" ,  msg, ct, (me==null||me.waiting>0)?1:2);
                needtpproc = true;
            }
        } 
        else if (sek!=null && act.equals("unsubs")) 
        {
            if (topic!=null)
            { 
                if (topic.subscribes.contains(sek))
                topic.subscribes.remove(sek);
                if (me!=null)
                {
                    me.topicid.remove(tid);
                    if (me.topicid.size() <2)
                    {
                        me.time = 0;
                        if (me.waiting>0)
                        {
                            me.sm.release(me.waiting);
                        }
                        MsgTopic.unsubscribe(orgnum,app,sek);
                        Msghold.messagers.remove(key);
                    }
                }
                ret = new Msg(tid, sek, null, null, "unsubd", "", ct, 1);
                needtpproc = true;
            }
            else
            {
                MsgTopic.unsubscribe(orgnum,app,sek);
                if (me!=null)
                {
                     if (me.waiting>0)
                     {
                         me.sm.release(me.waiting);
                     }
                     Msghold.messagers.remove(key);
                }
                ret = new Msg(tid, sek, null, null, "unsubd", "", ct, 1);
                needtpproc = true;
            }
        } 
        else if (act.equals("move")) 
        {
            msg = Toolbox.validate(msg, null, 20);
            int rcount = 0; 
            if (topic!=null) rcount = topic.subscribes.size();
            if (rid!=null && !rid.equals("")) 
            {
                rcount = rid.replaceAll("^,","").length()+1;
            } 
            Msg m = new Msg(tid, sek,   sname, rid, "move", msg, ct, rcount);
            if (topic!=null) topic.distribute(m,false);
            needtpproc = true;
        }  
        else if (act.equals("fire") || act.equals("block")) 
        {
            msg = Toolbox.validate(msg, null, 1);
            int rcount = 0; 
            if (topic!=null) rcount = topic.subscribes.size();
            if (rid!=null && !rid.equals("")) 
            {
                rcount = rid.replaceAll("^,","").length()+1;
            } 
            Msg m = new Msg(tid, sek, sname, rid, act, msg, ct, rcount);
            if (topic!=null) topic.distribute(m,false);
            needtpproc = true;
        }
        if (ret == null) 
            ret =  new Msg(tid, sek, sname, rid, "error", "no topic", ct, (me==null||me.waiting>0)?1:2); 
        if (me!=null) 
        {
            me.lastpost = System.currentTimeMillis();
            if (me.sid == null && sid!= null)
                me.sid = sid;
            me.sname = sname;
        }
        try
        {
           PrintWriter writer = response.getWriter();
           writer.println(ret.htmlmsg(orgnum));
           writer.flush();
           writer.close();
        }
        catch(Exception e1){}
    
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        service( request,  response, false);
    }

}
