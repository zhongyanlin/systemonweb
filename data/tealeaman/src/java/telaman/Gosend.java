package telaman;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Vector;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Semaphore;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

class GoPlayer
{
    final static int WAITING = 0;
    final static int COMPLETE = 1;
    final static int MYTURN = 2;
    final static int OPPTUNR = 3;
    int id = 0;
    String name = " ";
    int color = 0;
    int status = WAITING;
    int opponent = -1;
    int rank = 0;
    int timecap = 0;
    int type = 0;
    long lastpost = 0;
    boolean left = false;
    public Queue<String> msg = null;//new LinkedList<>();
    public Semaphore sm = null;//new Semaphore(0);
    public boolean waiting = false;
    public GoPlayer(String x)
    {
        String xs[] = x.split(";");
        if (xs.length>5)
        {
        id = Integer.parseInt(xs[0]);
        name = xs[1];
        status = Integer.parseInt(xs[2]);
        opponent = Integer.parseInt(xs[3]);
        rank = Integer.parseInt(xs[4]);
        timecap = Integer.parseInt(xs[5]);
        type = Integer.parseInt(xs[6]);
        lastpost = Long.parseLong(xs[7]);
        }
        if (xs.length>8)
        {
            msg = new LinkedList();
            for (int k=8; k < xs.length; k++)
            msg.add(xs[k]);
            sm = new Semaphore(msg.size()); 
        }
        
    }
    public String toString()
    {
        StringBuffer s = new StringBuffer();
        s.append(id);
        s.append(";");
        s.append(name);
        s.append(";");
        s.append(status);
        s.append(";");
        s.append(opponent);
        s.append(";");
        s.append(rank);
        s.append(";");
        s.append(timecap);
        s.append(";");
        s.append(type);
        s.append(";");
        s.append(lastpost);
        if (msg!=null)
        for (String t : msg)  
            s.append(";" + t);
        return s.toString();
    }
    void dropmsg(String m)
    {
         if (msg == null)
          {
             msg = new LinkedList();
             sm = new Semaphore(0);
          }
         msg.add(m);
         sm.release();
    }
}
 
public class Gosend extends HttpServlet
{
    public static HashMap<String,GoPlayer> queue  = new HashMap(10);
    static int maxid = 0; 
    static Queue<Integer> recycledid = new LinkedList<Integer>(); 
    synchronized public static String newmodifydel(int id, String name,int rank, int timecap, int type)
    {
        if ( rank == -1 && timecap==-1 && id >-1)
        {
            queue.remove(""+id);
            if (queue.get(""+id).status==GoPlayer.WAITING)
            {
                if (maxid == id)
                {
                   maxid = id-1;
                   //Toolbox1.writebytes(  "go.txt",""+maxid);
                }
                else
                {
                    recycledid.add(id);
                }
            }
            return "";
        }
        if (id == -1)
        {
            int m = 0;
            if (recycledid.size()>0)
            {
                id = recycledid.poll();
            }
            else
            {
               /* String x = Toolbox1.filebytes( "go.txt","utf-8");
                if (x!=null && x.matches("[0-9]+"))
                    maxid = Integer.parseInt(x);*/
                id = maxid+1;
                maxid = id;
                try{
                //Toolbox1.writebytes(  "go.txt",""+id);
                }catch(Exception e){}
            }
        }
   
        GoPlayer player = queue.get(""+id);
      
        if (player == null)
        {
            player = new GoPlayer(id + ";" + name + ";" +(GoPlayer.WAITING) + ";-1;" + rank + ";" + timecap+ ";" +type+ ";" + System.currentTimeMillis() );
            player.msg = new LinkedList();
            player.sm = new Semaphore(0);
            queue.put(""+id,player);
        }
        else
        {
            player.rank = rank;
            player.name = name;
            player.timecap = timecap;
            player.type = type;
            player.lastpost = System.currentTimeMillis(); 
            
            if (player.sm==null) 
            {
               player.msg = new LinkedList();
               player.sm = new Semaphore(0);
            }
        }
        
        StringBuffer s = new StringBuffer();
        s.append(id);
        for (GoPlayer p : queue.values())
        {
            if (p.status == GoPlayer.WAITING &&p.id !=id && !p.waiting)
            {
                if (p.left)
                {
                    Gosend.newmodifydel(p.id,"",-1,-1,0);
                    continue;
                }
                else
                    p.left = true;
            }
            if (p.status == GoPlayer.WAITING &&p.id !=id && p.waiting)
            {
                if (p.id == -1 || p.name == null || p.name.equals(""))
                {
                    Gosend.newmodifydel(p.id,"",-1,-1,0);
                    continue;
                }
                s.append("\n");
                s.append(p.id + ";" + p.name + ";" + p.rank + ";" + p.timecap + ";" + p.type);   
                p.dropmsg("addplayer('" + id + ";" + name + ";" + rank + ";" + timecap+";" + type +"')"); 
            }
        }
        return s.toString(); 
    }
    synchronized public static int pairup(int myid, int oppid)
    {
        GoPlayer me = queue.get(""+myid);
        GoPlayer you = queue.get(""+oppid);
        int color = -1;
        if (you.status == GoPlayer.WAITING)
        {
            color = (int)(System.currentTimeMillis()%2); 
            for (GoPlayer g : queue.values())
            {
               if (g.status == GoPlayer.WAITING && g.id!=myid && g.id!=oppid && g.waiting)
               {
                g.dropmsg("gone('" + myid + ";" + oppid + "')"); 
               }
            }
            you.dropmsg("agree('" + me.id  + ";" + me.name + ";" + me.rank + ";" +color + "')");
            you.opponent = myid;
            me.type = you.type;
            me.opponent = oppid;
            me.color = 1-color;
            you.color = color;
            you.status = color==0?GoPlayer.MYTURN:GoPlayer.OPPTUNR;
            me.status = color==1?GoPlayer.MYTURN:GoPlayer.OPPTUNR; 
        }
        
        return color;
    }
     
   protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }
    public void processRequest(HttpServletRequest request, HttpServletResponse response) 
   {
      response.setContentType("text/plain;charset=UTF-8");
      
      String act = request.getParameter("act");
      int  id = Integer.parseInt(request.getParameter("id"));
      
      try
      {
      PrintWriter  p = response.getWriter();
      if (act == null)
      {
          p.write("act === null");
      }
      else if (act.equals("list"))
      {
          String name = request.getParameter("name");
          int rank = Integer.parseInt(request.getParameter("rank")); 
          int timecap = Integer.parseInt(request.getParameter("timecap"));
          int type = Integer.parseInt(request.getParameter("type"));
         
          String s = newmodifydel(id,name,rank,timecap,type);
          p.write(s);
      }
      else if (act.equals("quit"))
      {
          GoPlayer me = queue.get(""+id); 
          if (me!=null)
          {
              me.dropmsg("stopmsg();reinit();");
              p.println("appendmg('ok')");
          }
          else
          {
              p.println("appendmg('error')");
          }
          for (GoPlayer g : queue.values())
          {
            if (g.status == GoPlayer.WAITING && g.id!=id && g.waiting)
            {
                g.dropmsg("gone('" + id +"')"); 
            }
          }
      }
      else  if (act.equals("ask"))
      {
          int oppid = Integer.parseInt(request.getParameter("oppid"));
          int timecap = Integer.parseInt(request.getParameter("timecap"));
          int type = Integer.parseInt(request.getParameter("type"));
          GoPlayer me = queue.get(""+id);
          GoPlayer you = queue.get(""+oppid);
          
          if (me==null)
          {
              p.println("appendmsg('Need to start over');reinit();");
          }
          else if (you==null)
          {
              me.dropmsg("gone('" + oppid + "')");
              me.lastpost = System.currentTimeMillis();
              p.println("appendmsg('" + oppid + " never exists');");
          }
          else if (you.status == GoPlayer.WAITING)
          {
              me.timecap = timecap;
              me.type = type;
             
              you.dropmsg("asked('" + me.id  + ";" + me.name + ";" + me.rank+ ";" + me.timecap+ ";" + me.type +"')");
              if (me.waiting == false)
                p.println("resumenow()");
              else
                p.println("appendmsg('OK')");
              me.lastpost = System.currentTimeMillis();
          } 
          else
          {
              me.lastpost = System.currentTimeMillis();
              p.write("gone('" + oppid + "');appendmsg('" + oppid + " is not available any longer')");
          }
      }
      else if (act.equals("reject"))
      {
          int oppid = Integer.parseInt(request.getParameter("oppid"));
          GoPlayer you = queue.get(""+oppid); 
          GoPlayer me = queue.get(""+id);
          if(me == null)
              p.println("appendmsg('Need to start over');reinit();");
          else if (you!=null)
          {
              me.lastpost = System.currentTimeMillis();
              you.dropmsg("reject('" + me.id  + ";" + me.name + ";" + me.rank +"')" );
              p.println("appendmsg('Rejected " + oppid + "');");
          }
          else  
          {
              me.lastpost = System.currentTimeMillis();
              p.println("gone('" + oppid + "');");
          }
      }
     
      else if (act.equals("agree"))
      {
          int oppid = Integer.parseInt(request.getParameter("oppid"));
          int color = pairup(id,oppid);
          GoPlayer me = queue.get(""+id);
          if (color<0) 
          {
              if (me!=null)
              me.lastpost = System.currentTimeMillis();
              p.print("appendmsg('" + oppid + " pairs with other');");
              p.print("gone('" + oppid + "');");    
          }
          else
          {
              if (me!=null)
              me.lastpost = System.currentTimeMillis();
              color = 1-color;
              GoPlayer you = queue.get(""+oppid);
              String s =  you.id  + ";" + you.name + ";" + you.rank + ";" +color;
              p.print("startgame('" + s + "')");
          }
          
      }
       else if (act.equals("giveup"))
      {
          int oppid = Integer.parseInt(request.getParameter("oppid"));
          GoPlayer you = queue.get(""+oppid);
          GoPlayer me = queue.get(""+id); 
          if (me != null)
          {
              me.dropmsg("stopmsg()");
              p.println("ok");
          }
          else
              p.println("appendmg('error')");
          if (you!=null)
              you.dropmsg("stopmsg()");
      }
      else if (act.equals("move"))
      {
          int oppid = Integer.parseInt(request.getParameter("oppid"));
          String xy =  (request.getParameter("xy"));
          GoPlayer you = queue.get(""+oppid);
          GoPlayer me = queue.get(""+id);
          if(me == null)
          {
              if (you == null || you.opponent!=id || you.waiting == false)
                  p.println("appendmsg('Need to start over');reinit();");
              else
              {
                  me = new GoPlayer(id + ";" + id + ";" +(GoPlayer.MYTURN) + ";" + you.id + ";0;" + you.timecap + ";" + System.currentTimeMillis());
                  me.msg = new LinkedList();
                  me.sm = new Semaphore(0);
                  queue.put(""+id,me);
                  me.waiting =  true;
              }
          }
          if (me!=null)
              me.lastpost = System.currentTimeMillis();
          if (you==null)
              p.println("gone('" + oppid + "');");
          else
          {
              you.dropmsg("move('" + xy + "');");
              if (me.waiting == false)
                 p.println("resumenow();appendmsg(go.mycolor + '(" + xy.replace("_",",") + ")')");
              else
                 p.println("appendmsg(go.mycolor + '(" + xy.replace("_",",") + ")')");
          }
      }
      else if (act.equals("gameover"))
      {
          int oppid = Integer.parseInt(request.getParameter("oppid"));
          String result =  (request.getParameter("result"));
          GoPlayer you = queue.get(""+oppid);
          you.dropmsg("gameover("+ result +")");
       
          GoPlayer me = queue.get(""+id);
          if(me == null)
              p.println("appendmsg('Need to start over');reinit();");
          else
          {
              if (me.waiting == false)
                  p.println("resumenow()");
              else
                  p.println("appendmsg('gameover')");
          }
      }
      else if (act.equals("msg"))
      {
          int oppid = Integer.parseInt(request.getParameter("oppid"));
          String msg =  (request.getParameter("msg"));
          GoPlayer you = queue.get(""+oppid);
          GoPlayer me = queue.get(""+id);
          if(me == null)
          {
              if (you == null || you.opponent!=id || you.waiting == false)
                  p.println("appendmsg('Need to start over');reinit();");
              else
              {
                  me = new GoPlayer(id + ";" + id + ";" +(GoPlayer.MYTURN) + ";" + you.id + ";0;" + you.timecap );
                  me.msg = new LinkedList();
                  me.sm = new Semaphore(0);
                  queue.put(""+id,me);
                  me.waiting =  true;
              }
          }
          if (you==null)
              p.println("gone('" + oppid + "');");
          else
          {
              if (msg.startsWith("gokeyword"))
              you.dropmsg("appendmsg('"+ me.name + ": <b>'+" + msg + "+'</b>')");
              else
              you.dropmsg("appendmsg('"+me.name + ": <b>" + msg + "</b>')");
             
              if (me.waiting == false)
                p.println("resumenow();fm.myword.value = '';appendmsg('"+ me.name + ":" + msg + "')");
              else
                p.println("fm.myword.value = '';appendmsg('"+ me.name + ":" + msg + "')");
          }
      }
      p.close();
      }catch(Exception e){}
   }
    
}
