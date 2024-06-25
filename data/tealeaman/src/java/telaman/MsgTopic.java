package telaman;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Queue;
import java.util.TreeSet;
import java.util.concurrent.atomic.AtomicInteger;
 
public class MsgTopic  
{
    public static HashMap<Integer,MsgTopic> topics = new HashMap<>();
    public static HashMap<String,Integer> str2id = new HashMap<>();
    public int orgnum;
    public String app;
    public String title = null;
    public int id = 0;
    int numShapes = 0;
    int numLines = 0;
    int numCurves = 0;
    String starter = "";
    boolean aceept = true;
    public static int idzero = -1;
    public TreeSet<String> subscribes = new TreeSet<>();
    private static final AtomicInteger distinctInts = new AtomicInteger(0);
    ArrayList<Msg> msg = new ArrayList();
   
    public void remove(String s)
    {
        subscribes.remove(s);
    }
    static public MsgTopic search(int orgnum,String app,String title)
    {
        String key = keystr(orgnum,app,title);
        Integer x = str2id.get(key);
        if (x==null) return null;
        return topics.get(x);
    }
    static public ArrayList<MsgTopic> search(int orgnum,String app)
    {
        ArrayList<MsgTopic> y = new ArrayList<MsgTopic>();
        for (String key : str2id.keySet())
        {
            if (key.startsWith(orgnum%65536 + "|" + app))
            {
                Integer x = str2id.get(key);
                if (x!=null) 
                {
                    MsgTopic z = topics.get(x);
                    if (z!=null) y.add(z);
                }
            }
        }
       return y;
    }
    static String keystr(int orgnum,String app,String title)
    {
        if (title.length() > 33) title = title.substring(0,33);
        return orgnum%65536 + "|" + app + "|" + title.trim();
    }
    static public void unsubscribe(int orgnum,String app,String sek)
    {
        ArrayList<MsgTopic> qq = MsgTopic.search(orgnum,app);
        for (MsgTopic t : qq)
        {
            t.subscribes.remove(sek);
        }
    }
    static void unsubscribe( String sek)
    {
        for (MsgTopic t : topics.values())
            t.unsub(sek);
    }
    void delete()
    {
       if (subscribes.size() == 0)
       {
           str2id.remove(keystr(orgnum,app,title));
           topics.remove(id);
       }
    }
    static public int add(int orgnum,String app,String title )
    {
        String key = keystr(orgnum,app,title);
        Integer x = str2id.get(key);
        MsgTopic y;
        if (x!=null)
        {
            y = topics.get(x);
            if (y!=null) return y.id;
        }
        y = new MsgTopic(orgnum,app,title);
        return y.id;
    }
    public  MsgTopic(int orgnum,String app,String title ) 
    {
        this.title = title;
        this.id = distinctInts.getAndIncrement();
        this.app = app;
        this.orgnum = orgnum;
        str2id.put(keystr(orgnum,app,title), id);
        topics.put(id,this);
    }
     
    public String list() 
    {
        StringBuffer s = new StringBuffer();
        for (String sek:subscribes) 
        {
            if(s.length()>0) s.append(",");
            String key = Msghold.keystr(orgnum, app, sek);
            Msghold m = Msghold.messagers.get(key);
            s.append(sek);
            s.append("-");
            s.append(m.sname.replace(" ", "_"));
        }
        if (s.length()==0) return "";
        return s.toString();
    }
    
    @Override
    public String toString() {
        return this.title + "#" + this.id + "," + this.numShapes + "," + this.numLines + "#" + this.subscribes.toString();
    }
    
    public void add(String uid ) 
    {
        synchronized(this)
        {
            subscribes.add(uid);
        }
    }

    public boolean exist(String uid ) 
    {
        return subscribes.contains(uid);
    }
    
    public void unsub(String uid ) 
    {
        subscribes.remove(uid);
    }
    void distribute(Msg m, boolean keeplong,String rid)
    {
       if (id == MsgTopic.idzero)
       {
           for (Msg q: msg)
           {
               if (m.code.equals(q.code) || m.msg.equals(q.msg))
                   return;
           }
       }
       if (rid == null) 
           distribute(m, keeplong);
       else
       {
           String [] rids = rid.split(",");
           for (String sek : rids) 
           {
               String key = Msghold.keystr(orgnum, app, sek);
               Msghold y = Msghold.messagers.get(key);
               if (y!=null)
               {
                   y.dropmsg(m);
               }
           }
           if (keeplong)msg.add(m);
       }
    }
    void distribute(Msg m, boolean keeplong)
    {
       if (id == MsgTopic.idzero)
       {
           for (Msg q: msg)
           {
               if (m.code.equals(q.code) || m.msg.equals(q.msg))
                   return;
           }
       }
       for (String sek : subscribes) 
       {
           String key = Msghold.keystr(orgnum, app, sek);
           Msghold y = Msghold.messagers.get(key);
           if (y!=null)
           {
               y.dropmsg(m);
           }
       }
       if (keeplong)msg.add(m);
    }
    void dropmsg(Msg m, String sek)
    {
       String key = Msghold.keystr(orgnum, app, sek);
       Msghold y = Msghold.messagers.get(key);
       if (y!=null)
           y.dropmsg(m);
    }
    
    public void deletemsg(){msg.clear();}
     
    public  String summary(String mysek,int orgnum)
    {
        String words[] = Toolbox.emsgs(orgnum,1517).split("@");
        StringBuffer bf = new StringBuffer("<table><tr style=background-color:var(--bbgcolor)>");
        for (int i=0; i < 9; i++)
            bf.append("<td><nobr>"+ words[i] + "</nobr></td>");
        bf.append("</tr>");
        long N =  0;
         
        String myself = words[19];
        String mytopic = words[20]; 
        int K =0;
      
        int mlen = msg.size();
        String z = ",";
        for (int j=msg.size()-1; j >=0 && K < 7; j--,K++)
        {
             Msg q = msg.get(j); 
             if (q == null) continue;
             String xx = q.sname;
             if (xx.matches("[0-9|a-z]+") && xx.length()>11)
             xx = Msgsend.back(xx);
            bf.append("<tr><td align=right>" + j + "</td><td align=right>" + (mlen-K) + "</td><td align=right>" + q.tid +   "</td><td align=right>" + (q.sek.equals(mysek)?myself:q.sek) +   "</td><td><nobr>" + xx.replaceFirst("\\-.*","")
            + "</nobr></td><td>" + ((q.rid==null||q.rid.equals( app))?Toolbox.emsgs(orgnum,450):(q.rid.equals(mysek)?myself:q.rid)) + "</td><td>" + q.code +  "</td><td>" + Toolbox.timestr(q.time/1000,"hh:mm:ss")  +  "</td><td>" +  q.scount + "/" + q.rcount + "</td></tr>"  );
            
        } 
        bf.append("</table>");
         
        String x1 = bf.toString();
        
        String zz = "<table><tr  style=background-color:var(--bbgcolor)>";
        for (int i=9; i < 15; i++)
            zz += "<td><nobr>"+ words[i] + "</nobr></td>";
        zz += "<td>Status</td></tr>";
         
         
        { 
            K = 0;
         
            for (String sek:  subscribes)
            {
                if (K++ > 7) break;
                Msghold u =  Msghold.get(orgnum,app,sek);
                if (u == null) continue;
                String xx = u.sname;
                if (xx.matches("[0-9|a-z]+") && xx.length()>11)
                xx = Msgsend.back(xx);
                xx = xx.replaceFirst("\\-[^\\-]*","");
                zz += "<tr><td><nobr>" +  xx + "</nobr></td><td align=right>" 
                        + u.lastserial + "</td><td align=right>" 
                        + (Toolbox.emsgs(orgnum,u.waiting>0?415:418))  + "</td><td>" 
                        +  Toolbox.timestr(u.lastpost/1000,"hh:mm:ss")  
                        + "</td><td>" + Toolbox.timestr(u.time/1000,"hh:mm:ss") 
                        + "</td><td>" + u.topicid.toString().replace("[","").replace("]","").replaceAll("\\s","") + "</td><td>"+ u.status + "</td></tr>";
            }
        }
        zz += "</table>";
        StringBuffer y = new StringBuffer("<table><tr  style=background-color:var(--bbgcolor)>");
        for (int i=15; i < 19; i++) 
        {
            y.append("<td align=");
            if(i==16) 
                y.append("left");
            else 
                y.append("right");
            y.append(">");
            y.append(words[i]);
            y.append("</td>");
        }
        y.append("</tr>");
        
        String allt =  alltopic();
        if (!allt.equals(""))
        {
            CSVParse parse = new CSVParse(allt,'"', new String[]{",",";"});
            String [][] mt = parse.nextMatrix();
            for (int i=0; i < mt.length; i++)
            {
                y.append("<tr>");
                for (int j=0; j < mt[i].length; j++)
                {
                    y.append("<td align=");
                    if (j==1) y.append("left>");
                    else y.append("right>");
                    y.append(mt[i][j]);
                    y.append("</td>");
                }
                y.append("</tr>");
            }
        }
        y.append("</table>"); 
        String x7 =  Msghold.messagers.size()  + "|" + bf + "|" + zz +  "|" + y.toString();
        return x7;
    } 
    public static String alltopic()
    {
        String s = "";
        for (MsgTopic t: topics.values())
        {
           String ts = t.toString1();
           if ( s.length()>0) s += ";";
           s += t.id + "," + ts;
         }
        return s;
    }
    public String toString1() 
    {
        return title.replaceAll("[;|\\-|,|\\|]"," ") + "," + msg.size() + "," + this.subscribes.size();
    }
}
