package telaman;

import java.io.*;
import java.util.*;
class MyTimer extends TimerTask
    {
        int orgnum;
        public MyTimer(int orgnum)
        {
            super();
            this.orgnum = orgnum;
            
        }
         public void run()
            {
               Remind.emailto(orgnum); 
            }
    } 
public class Remind  
{
    private final static long fONCE_PER_DAY = 3600000*24;
    public String settime  = "2:30";
    private Timer  timer = null;
    public boolean haveset = false;
    public static String url = "";
    public int orgnum;
    public Remind(int orgnum)
    {
        this.orgnum = orgnum;
         
    }
    static public String emailto(int orgnum)
    {
        JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
        
        String err = "";
        Vector<DBConnectInfo> v = new Vector(10);
        int n = 0;
        String cusemster = Toolbox.dbadmin[orgnum%65536].currentSemester;
        boolean b = adapter.executeQuery2("SELECT  server, driver, dbuserid,dbpassword, count(*)  from DBOwner where NOT server='' group by server",false);
        if (b)
        for(int i = 0; adapter.getValueAt(i, 0)!=null; i++)
        {
            v.addElement(new DBConnectInfo(adapter.getValueAt(i, 0), adapter.getValueAt(i, 1), adapter.getValueAt(i, 2), adapter.getValueAt(i, 3), adapter.orgnum));
        }

        adapter.close();
        long tt = System.currentTimeMillis() / 1000L;
        String sql = (new StringBuilder()).append("select Assignment.course, Assignment.name,  Assignment.due, AppUser.email,Assignment.sessionname from Assignment, Registration,AppUser where AppUser.id=Registration.sid AND Assignment.sessionname like CONCAT('%',Registration.sessionname,'%') AND Registration.courseid=Assignment.course AND Registration.semester='")
                .append(cusemster).append("' AND Assignment.semester ='")
                .append(cusemster).append("' AND  Assignment.atype < 2 and Assignment.start >=  ")
                .append(tt - 24*3600).append("  and Assignment.due >= ")
                .append(tt + 48000).append(" and Assignment.due <  ")
                .append(tt + 96000).append(" AND CONCAT(Assignment.course,' ',Assignment.name,' ',Registration.sid) NOT IN (select CONCAT(Submission.course,' ',Submission.assignname,' ',Submission.sid) from Submission where semester='")
                .append(cusemster).append("') ").toString();
        String old = null;
        int sindex = Toolbox.begintranslate("mysql");
        //int m = adapter.executeQuery(Webform.mysql2c(adapter.dbms,  sql));
        String sql2 = (new StringBuilder()).append(" UNION select Assignment.course, Assignment.name,  Assignment.due, AppUser.email,Assignment.sessionname from Assignment, AppUser where Assignment.grader LIKE CONCAT('%',AppUser.id,'%') AND semester='")
                .append(cusemster).append("' AND  Assignment.atype < 2 and Assignment.start >=  ")
                .append(tt - 24*3600).append("  and Assignment.due >= ")
                .append(tt + 48000).append(" and Assignment.due <  ")
                .append(tt + 96000).append("   order by 1, 2,5").toString();
        sql += sql2;
        for(int i = 0; i < n; i++)
        {
            adapter = Toolbox.getUserAdapter( v.elementAt(i), orgnum);
            
            if (!adapter.error().equals(""))
            {
                err += "For " + adapter.url()+":\n";
                err += adapter.error() + "\n\n";
                adapter.close();
                continue;
            }
            int tindex = Toolbox.begintranslate(adapter.dbms);
            b = adapter.executeQuery2(Webform.mysql2c(adapter.dbms,  sql),false); 
            if (!b)
            {
                err += adapter.error() + "\n\n";
                continue;
            }
            else if (b && adapter.getValueAt(0, 0)==null)
            {
                continue;
            }
            old = null;
            StringBuffer addr = new StringBuffer();
            String fromemailaddr = Toolbox.dbadmin[orgnum%65536].stmpuser +  "@" + Toolbox.dbadmin[orgnum%65536].stmphost.replaceFirst(".*\\.([^\\.]+\\.[^\\.]+)", "$1");
            String yy = "",oldyy="";
            for(int j = 0; adapter.getValueAt(j, 0)!=null; j++)
            {
                if(addr.length() > 0)
                    addr.append(",");
                if (adapter.getValueAt(j, 3)!=null &&
                    adapter.getValueAt(j, 3).equals("")==false)
                addr.append(adapter.getValueAt(j, 3));
                yy = (new StringBuilder()).append(adapter.getValueAt(j, 0)).append(" ").append(adapter.getValueAt(j, 1)).append(" ").append(adapter.getValueAt(j, 4)).toString();
                if( oldyy.equals(yy))
                    continue;
                oldyy = yy;
                try
                {
                    String subj = adapter.getValueAt(j, 0) + " " + Toolbox.emsgs(orgnum,500) + " " + adapter.getValueAt(j, 1) + " "+Toolbox.emsgs(orgnum,289);
                    String msg = subj + ": "  + Toolbox.timestr(Long.parseLong(adapter.getValueAt(j, 2))) + "\n\n"  + Toolbox.emsgs(orgnum,1494)+ "\n\n"  + url;
                    err += addr + "\n" + subj +"\n" + msg;
                    Email.postMail(addr.toString().split(","), subj, msg, fromemailaddr,null,orgnum);
                }
                catch(Exception e)
                {
                    err += "Error in sending email: " + e.toString() + "\n\n" ;
                }
                addr.setLength(0);
            }

        adapter.close();
        }
        return err;
    }
    public  void cancel()
    {
        
        if (haveset)
        {
            if (timer!=null)
            try
            {
                timer.cancel();
            }
            catch(Exception e){}
            haveset  = false;
        }
        
    }

     
    public  void set( String  time)
    {
        settime  = time; 
        JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
        String sql = "UPDATE SystemParam SET chaptpubkey='" + time + "'";
        adapter.executeUpdate(sql);
        adapter.close();
        cancel();
        MyTimer x  = new MyTimer(orgnum);
        timer =  new Timer();
        timer.scheduleAtFixedRate(x, getTomorrowMorning(time), fONCE_PER_DAY);
        haveset  = true;
    } 
    
    
    public static Date getTomorrowMorning(String time )
   {
        String s[] = time.trim().split("[^0-9]+");
        int h = 2;
        int m = 0;
        try
        {
            h = Integer.parseInt(s[0].replaceFirst("^0",""));
            if (s.length>1)
                m = Integer.parseInt(s[1].replaceFirst("^0",""));
        }catch(Exception e){}

        //settime  = h + ":" + m;

        Calendar tomorrow = new GregorianCalendar();
        int i = tomorrow.get(Calendar.HOUR_OF_DAY);
        
        if (i*60 + tomorrow.get(Calendar.MINUTE) > h*60+m)
        {
            tomorrow.add(Calendar.DATE, 1);
        }
        Calendar result = new GregorianCalendar
        (
          tomorrow.get(Calendar.YEAR),
          tomorrow.get(Calendar.MONTH),
          tomorrow.get(Calendar.DATE),
          h,
          m
        );
        return result.getTime();
  }
  
}
