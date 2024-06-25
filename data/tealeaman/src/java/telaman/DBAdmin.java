package telaman;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;
import org.h2.tools.Server;
import java.util.concurrent.*; 

class FF implements  FileFilter  
{
         public boolean accept(File file)
         {
             return   (file.getName().toLowerCase().endsWith(".bak") 
                     && file.getName().indexOf("sys") != 0
                     && !file.getName().equals("addr.bak"));

         }
}
public class DBAdmin  implements Serializable
{
    public static  boolean localnopass = false;
    public static boolean sysonwebdb = true;
    public static char CSVquote = '\'';
    public HashMap<String,String> cache = new HashMap();
    public HashMap<String,DBConnectInfo> dbinfocache = new HashMap();
    public HashMap<String,String>[] code2caption = null;
    public HashMap<String, AssignCache> assigncache = new HashMap();
    public int nouser = 0;  
    public static final String CSVseparator[] = {   ",", "\n", "/"  };
    public String error3 = "";
    public int orgnum = Toolbox.langnum<<16;
    public  String unitname[] = null;
    public  String websiteFolder = null;
    public  String webFileFolder = null;
    public String webFileFolder1 = null;
    public  long webFileLength = 0xc845880L;
    public  long webFileLength1 = 0x989680L;
    public  String dbFileFolder = null;
    public static int CyberLength = 128;
    public   String defaultdbms = "access";
    public   String systemdbms = null;
    public  String systempassword = "";
    public   String systemserver = null;
    public   String systemdriver = null;
    public  String systemuser = "root";
    public   int numHosts = 0;
    public   DBHost dbhost[] = null;
    public   boolean ownpassword = false;
    public   String adminid = "";
    public  int phase = 0;
    static SharedBool onoff = new SharedBool();
    String operation = "";
    public String subsitename = "subsites";
    private String error1 = "";
    public  String error2 = "";
    public int adminornumber = 0;
    private   int h2order = 0; 
    private  int accessorder = 0; 
    private   int defaultorder = 0;
    private   boolean hasdbfolder = true;
    public   int semesternum = 0;
    public int port = 587;
    public  ArrayList<String>[] semestermap= null;
    
    public  String DBGCOLOR = "#FFFFCC";
    public  String IBGCOLOR = "#2F4034";
    public  String BBGCOLOR = "#b0b0b0";
    public  String TBGCOLOR = "#FFFFFF";
    public  String bgimage = "linear-gradient(10deg,#FFFFCC,#FFFFED 10%, #FFFFFF)";
    public  String stmphost  = "gmail-smtp.l.google.com";
    public  String stmpuser  = "tealeaman@gmail.com";
    public  String stmppass  = "";
    public  String encoding = "utf-8";
    public  byte charsize = 1;
    public  String timeformat = "MM/DD/YY hh:mm";
    public String currentSemester  =  "1";
    public  int gradeSystem  =   1;
    static HashMap appedt = new HashMap(50);
    public static String fontsname = "Times";
    public static String dfserver = null;
    public static String webserver = null;
    public static HashMap tabledef = null;
    public boolean studentdriven = true;
    public  Thread distributor  = null;
    //public  Msgbase msgbase = null;
    public  Remind  remind = null;
    
    public DBAdmin(int i )
    {
       orgnum = (Toolbox.langnum<<16) + i;
 
       currentSemester  = "0";
       subsitename = "" + i;
      
       remind = new Remind(orgnum);
        
       unitname = new String[Toolbox.langs.length];
        for (int j=0; j < Toolbox.langs.length; j++)
        {
            unitname[j] = Toolbox.emsgs(orgnum, 1471);
        }
       
    }
    
    public synchronized long getAppedt(int i) {
        Object x =  appedt.get("" + i);
        if (x == null) {
            return System.currentTimeMillis() / 1000;
        }
        return (Long)x;
    }
    public  String meta(String enc) { return   "<meta  http-equiv=\"content-type\" content=\"text/html; charset=" + enc + "\">\n<meta http-equiv=\"Cache-Control\" content=\"no-cache, no-store, must-revalidate\">\n<link rel=\"shortcut icon\" href=\"image/favicon.ico\" type=\"image/x-icon\">\n";} 
    
    public  synchronized void setAppedt(String s, String v) {
        appedt.put(s, Long.valueOf(v));
    }
    public void  checklang()
    {
        JDBCAdapter adapter = Toolbox.getUserAdapter(sysDBConnectInfo(),orgnum);
        for (int i=Toolbox.langnum+1; i < Toolbox.langs.length; i++)
        {
            String sql = "select code, domainValue from DomainValue WHERE domain='Semester' and language='" + Toolbox.langs[i] + "'";
            if (adapter.executeQuery(sql) <= 0)
            {
                sql = "INSERT INTO DomainValue(lastupdate,domain,domainValue,code,description,language) SELECT lastupdate,domain, domainValue,code,description,'" +Toolbox.langs[i] + "' FROM DomainValue WHERE language='"  + Toolbox.langs[Toolbox.langnum] + "'";
                adapter.executeUpdate(sql);
                
                sql = "INSERT INTO Docslang(lastupdate,domain,docs,language) SELECT lastupdate,domain, docs,'" +Toolbox.langs[i] + "' FROM Docslang WHERE language='"  + Toolbox.langs[Toolbox.langnum] + "'";
                adapter.executeUpdate(sql);
            }    
        }
        adapter.close();
    }
    public String newSemester(String newname, int orgnum)
    {
        String season = newname.replaceAll("[0-9]", "");
        int n = -1;
        int K = (orgnum>>16);
        
        for (int k=0; k < Toolbox.langs.length; k++)
        {
            if (k == K)
            {
                for (int j=0; j < semestermap[k].size(); j++)
                {
                    if (semestermap[k].get(j).indexOf(season)>=0)
                    {
                        if(semestermap[k].get(j).indexOf(newname.replaceAll("[^0-9]",""))>=0)
                        {
                            return "-1";
                        }
                        n = j; 
                        break;
                    }    
                }
                break;
            }
        }
        String mc = "0";
        long ll = System.currentTimeMillis()/1000;
        JDBCAdapter adapter = Toolbox.getUserAdapter(sysDBConnectInfo(),orgnum);
        for (int k=0; k < Toolbox.langs.length; k++)
        {
            String nm = newname;
            if (n!=-1 && k!= (orgnum>>16)) 
            {
                nm = semestermap[k].get(n);
                nm = nm.replaceFirst("[0-9]+", newname.replaceAll("[^0-9]",""));
            }
            
            mc = "" + semestermap[k].size();
            
            String sql = "insert into DomainValue(lastupdate,code,description,domain,domainvalue,language) select " + ll + "," +  mc + " ,description,'Semester','" + nm + "',language FROM DomainValue WHERE domain='Semester' AND code=" + (semestermap[k].size()-1) + "  AND language='" + Toolbox.langs[k] + "'";
            int kk =adapter.executeUpdate(sql);
            semestermap[k].add(nm);
        }
        BackRoutine.updateselects(adapter,orgnum);
        adapter.close();
        return mc;
    }
    
    
    public void buildSemesterMap(JDBCAdapter adapter)
    {
        semestermap = new ArrayList[Toolbox.langs.length];
        code2caption = new  HashMap[Toolbox.langs.length]; 
       
        for (int k=0; k < Toolbox.langs.length; k++)
        {
            code2caption[k] = new  HashMap<String, String>();
            String sql1 = "SELECT code,domainValue FROM DomainValue WHERE DomainValue.domain='Tool Caption' AND DomainValue.language='" + Toolbox.langs[k] + "'"; 
            int m0 = 0;
            int nn = adapter.executeQuery(sql1 );
            if (nn <= 0) continue; 
            for (int jj=0;   jj < nn; jj++)
            {
                code2caption[k].put(adapter.getValueAt(jj,0),adapter.getValueAt(jj,1));
            } 
           
        }
        for (int k=0; k < Toolbox.langs.length; k++)
        {
            int m = 0;
            try
            {
                semestermap[k] = new ArrayList();
                m = 1;
                 
                
                {
                    String sql = "SELECT code, domainValue FROM DomainValue WHERE domain='Semester' and language='" + Toolbox.langs[k] + "'";
                    int  b=adapter.executeQuery(sql );
                    m = 2;
                    if (b > 0)
                    {
                        for (int i=0; i < b; i++)
                        {
                            int c = -1; 
                            m = 3;
                            try
                            {
                                c = Integer.parseInt(adapter.getValueAt(i,0));
                                m = 4;
                            }catch(Exception e1){continue;}
                            if (c==-1) continue;
                            try
                            {
                                m = 5;
                                for (int l=semestermap[k].size(); l <= c; l++)
                                   semestermap[k].add("");
                                m = 6;
                                semestermap[k].set(c,adapter.getValueAt(i,1) );
                            }catch(Exception e1){continue;}
                        } 
                       
                    }
                }
            }catch(Exception e){
               
            }
        }
     
    }
    
    public String semesteropts(String selsemester, int orgnum)
    {
        if (selsemester==null) selsemester = currentSemester;
        StringBuilder b = new StringBuilder();
        for (int i=0; i < semestermap[orgnum>>16].size(); i++)
        {
            String s = semestermap[orgnum>>16].get(i);
            if (s.equals("")) continue;
            b.append("<option style=\"background-color:" + IBGCOLOR + ";color:white;font-family:inherit;font-size:inherit\" value=" + i  );
            if (selsemester.equals("" + i)) b.append(" selected ");
            b.append(">" + s + "</option>" );
        }
        return b.toString();
    }
    public String beheading(CachedStyle cachedstyle) {return  "linear-gradient(" + cachedstyle.BBGCOLOR + "," + cachedstyle.TBGCOLOR + ")";}
    public String beheading() {return  "linear-gradient(var(-bbgcolor),var(-tbgcolor))";}
    
    public String saveback()
    {
        StringBuilder sql = new StringBuilder("UPDATE SystemParam SET ");
        sql.append("lastupdate=");
        sql.append((System.currentTimeMillis()/1000));
        sql.append(",currentSemester='");
        sql.append(currentSemester);
        sql.append("',DBGCOLOR='");
        sql.append(DBGCOLOR);
        sql.append("',IBGCOLOR='");
        sql.append(IBGCOLOR);
        sql.append("',BBGCOLOR='");
        sql.append(BBGCOLOR);
        sql.append("',TBGCOLOR='");
        sql.append(TBGCOLOR);
        sql.append("',timeformat='");
        sql.append(timeformat.replaceAll("'","''"));
        sql.append("',gradeSystem=");
        sql.append(gradeSystem);
        sql.append(",stmphost='");
        sql.append(stmphost.replaceAll("'","''"));
        sql.append("',stmpuser='");
        sql.append(stmpuser.replaceAll("'","''"));
        sql.append("',stmppass='");
        sql.append(stmppass.replaceAll("'","''")); 
        sql.append("',apphashgene='");
        sql.append(Toolbox.apphashgene.replaceAll("'","''"));
        
        sql.append("', signrsastr='");
        sql.append(Esign.signrsastr.replaceAll("'","''"));
        
        sql.append("',webFolder='");
        sql.append(webFileFolder.replaceAll("'","''"));
        sql.append("',webFolder1='");
        sql.append(webFileFolder1.replaceAll("'","''"));
        sql.append("',folderLength=");
        sql.append(webFileLength);
        sql.append(",folderLength1=");
        sql.append(webFileLength1);
        sql.append(",maxlength=");
        sql.append(UploadFile.MaxUploadSize);    
        sql.append(",dbFileFolder='");
        sql.append(dbFileFolder);
        sql.append("',workingFileFolder='");
        sql.append(ServerAgent.workingFolder);
        sql.append("',websitefolder='");
        sql.append(websiteFolder);
        sql.append("',localnopass='");
         sql.append(localnopass);
        sql.append("'");
        JDBCAdapter adapter = Toolbox.getUserAdapter(sysDBConnectInfo(),orgnum);
        int n = adapter.executeUpdate(sql.toString());
        adapter.close();
        return adapter.error();
    }
    
    public int setSystemParameter(JDBCAdapter adapter)
    {
        String sql1 = "SELECT clientName,currentSemester,DBGCOLOR,IBGCOLOR,BBGCOLOR,TBGCOLOR,timeformat,gradeSystem,stmphost,stmpuser,stmppass, apphashgene,chaptpubkey,chaptprikey,signrsastr,bgimage,webFolder,webFolder1,folderLength,folderLength1,maxlength,dbFileFolder,workingFileFolder,websitefolder,localnopass,safecolor,cautioncolor,dangercolor,longtimecolor FROM SystemParam";
        boolean b = adapter.executeQuery2(sql1,false);
       
        if (b && adapter.getValueAt(0, 0)==null)
        {
             
            int m = -1;
           
            {
                String sql = "SELECT max(code)  FROM DomainValue WHERE domain='Semester' AND (NOT domainValue='') AND  language='" + Toolbox.langs[orgnum>>16] + "'" ;
                m = adapter.executeQuery(sql );
                if (m > 0 )
                {
                    currentSemester = adapter.getValueAt(0,0); 
                }
            }
            if (m <= 0)
            {
             
                String newSemesterstr = initsemester();
                currentSemester  = "0";
                for (String xx: Toolbox.langs)
                { 
                    String sql = "INSERT INTO DomainValue (lastupdate,domain,domainValue,code,description,language) VALUES("
                    + (System.currentTimeMillis()/1000) + ",'Semester','" +newSemesterstr + "',0,'"
                    + Toolbox.emsg(1004) + "','" + xx + "')";
                    adapter.executeUpdate(sql);
                } 
            }
          
            int dy = (new java.util.Date()).getYear() + 1900; 
             
            stmphost = "smtp.att.yahoo.com";
            stmpuser= "tealeaman";
            stmppass= "US.DE.19709"; 
            
            //Esign.signrsastr =  (new MyRSA(128,(byte)1)).toString();
            Toolbox.decrsa[0] = new MyRSA(128,(byte)1);
            Toolbox.decrsa[0].init();
            Esign.signrsastr =  Toolbox.decrsa[0].toString();
            Toolbox.decrsa[1] = new MyRSA(Esign.signrsastr,(byte)2);
            Toolbox.decrsa[1].csize = Toolbox.decrsa[1].csize/2;
            String sql = (new StringBuilder()).append("INSERT INTO SystemParam(lastupdate,clientName,currentSemester,DBGCOLOR,IBGCOLOR,BBGCOLOR,TBGCOLOR,safecolor,cautioncolor,dangercolor,longtimecolor,timeformat,gradeSystem,stmphost,stmpuser,stmppass, apphashgene,chaptpubkey,chaptprikey,signrsastr,bgimage,webFolder,webFolder1,folderLength,folderLength1,maxlength,dbFileFolder,workingFileFolder,websitefolder,localnopass)  VALUES(0,'1").append("','" +currentSemester + "','").append(DBGCOLOR).append("','").append(IBGCOLOR).append("','").append(BBGCOLOR).append("','").append(TBGCOLOR).append("','#00BBBB','#F79819','#CC0000','#0000BB','MM/DD/YYYY hh:mm:ss',").append(gradeSystem).append(",'").append(stmphost).append("','").append(stmpuser).append("','").append(stmppass).append("','").append(Toolbox.apphashgene).append("','2:30','','").append(Esign.signrsastr).append("','bgindex.jpg,','"
                    + webFileFolder + "','" + webFileFolder1  + "'," +  webFileLength + "," + webFileLength1  + "," + UploadFile.MaxUploadSize + ",'" + dbFileFolder  + "','" + ServerAgent.workingFolder  + "','" +  websiteFolder
                    + "',0)").toString();
            int n = adapter.executeUpdate(sql);
            return n;
             
        }
        if (b==false) return -1;
        if (adapter.getValueAt(0, 0) == null)
            return -1;
        studentdriven = adapter.getValueAt(0, 0).equals("1");
   
        int ans = 1;
        sql1 = "";
        String tobe = adapter.getValueAt(0, 15);
         
        if (tobe.indexOf("@")>0)
        {
           
            tobe = Toolbox1.unzip(tobe);
            int jj = tobe.indexOf(",");
            String x = "", y = "";
            if (jj > 0 && jj < tobe.length()-5) 
            {
                x = tobe.substring(0,jj+1);
                y = tobe.substring(jj+1).trim();
            }
            else
            {
                y = tobe.trim(); 
                x = y;
            }    
            String tobe1 = "bgimage" + "/" + y.replaceFirst("@.*", "");
      
            if (   (new File(Toolbox.installpath + File.separator + "image" + File.separator + tobe1.replace('/',File.separatorChar))).exists() )
            {
                Toolbox.dbadmin[orgnum%65536].bgimage = "url(image/" + tobe1 + ")";
                sql1 =  sql1+ ", bgimage='" + y + "'";
            }  
            else 
            {
                tobe1 = "bgimage" + "/" + x.replaceFirst("@.*", ""); 
                if (   (new File(Toolbox.installpath + File.separator + "image" + File.separator + tobe1.replace('/',File.separatorChar))).exists() )
                {
                    Toolbox.dbadmin[orgnum%65536].bgimage = "url(image/" + tobe1 + ")";
                    sql1 =  sql1+ ", bgimage='" + x + "'";
                } 
                else 
                {
                    tobe = "";
                    sql1 =  sql1+ ", bgimage=''";
                } 
            } 
        
        }
   
        if(tobe == null || tobe.equals(""))
        {
            String c1 = Toolbox.headerc2(DBGCOLOR);
            //String c2 = Toolbox.headerc2(c1);
            Toolbox.dbadmin[orgnum%65536].bgimage = "linear-gradient(90deg,"+DBGCOLOR+ "," + c1 +    ")";
        } 
         
        
        if(adapter.getValueAt(0, 11) == null || adapter.getValueAt(0, 11).equals(""))
            sql1 = (new StringBuilder()).append(sql1).append(", apphashgene = '").append(Toolbox.apphashgene).append("'").toString() + "'";
        else
            Toolbox.apphashgene = adapter.getValueAt(0, 11);
        if ((orgnum%65536)==0)
        {
             Esign.signrsastr = adapter.getValueAt(0, 14); 
             
            if(Esign.signrsastr == null || Esign.signrsastr.equals("")  )
            {
                Toolbox.decrsa[0] = new MyRSA(128,(byte)1);
                Toolbox.decrsa[0].init();
                Esign.signrsastr =  Toolbox.decrsa[0].toString();
                Toolbox.decrsa[1] = new MyRSA(Esign.signrsastr,(byte)2);
                Toolbox.decrsa[1].csize = Toolbox.decrsa[0].csize/2;
                sql1 = (new StringBuilder()).append(sql1).append(",  signrsastr='").append(Esign.signrsastr).append("'").toString() ;
            }
            else
            {
                Toolbox.decrsa[0] = new MyRSA(Esign.signrsastr,(byte)1);
                Toolbox.decrsa[1] = new MyRSA(Esign.signrsastr,(byte)2);
                Toolbox.decrsa[1].csize = Toolbox.decrsa[0].csize/2;
            }
        }
        if(adapter.getValueAt(0, 12) == null || adapter.getValueAt(0, 12).equals(""))
        {
            sql1 = sql1 + ", chaptpubkey = '"+remind.settime+ "'";
            remind.settime = "";
        }
        else
           remind.settime = adapter.getValueAt(0, 12);
         
        currentSemester = notnull(adapter.getValueAt(0, 1),currentSemester);
       
        String cl = notnull(adapter.getValueAt(0, 4), BBGCOLOR);
        if(!cl.equals(BBGCOLOR))
        {
            BBGCOLOR = cl;
            ans = 2;
        }  
        cl = notnull(adapter.getValueAt(0, 5), TBGCOLOR);
        if(!cl.equals(TBGCOLOR))
        {
            TBGCOLOR = cl;
            ans = 2;
        }  
 
        cl = notnull(adapter.getValueAt(0, 2), DBGCOLOR);
        if(!cl.equals(DBGCOLOR))
        {
            DBGCOLOR = cl;
            ans = 2;
        } 
        cl = notnull(adapter.getValueAt(0, 3), IBGCOLOR);
        if(!cl.equals(IBGCOLOR))
        {
            IBGCOLOR = cl;
            ans = 2;
        }
  
        Toolbox.timeformat[0] = notnull(adapter.getValueAt(0, 6), Toolbox.timeformat[0]);
        try
        {
             gradeSystem  = Integer.parseInt(adapter.getValueAt(0, 7));
        }
        catch(Exception e)
        {
            gradeSystem  = 2;
        }
        
        stmphost = notnull(adapter.getValueAt(0, 8), stmphost);
        stmpuser = notnull(adapter.getValueAt(0, 9), stmpuser);
        stmppass = notnull(adapter.getValueAt(0, 10), stmppass);
        webFileFolder = notnull(adapter.getValueAt(0, 16), webFileFolder);
        webFileFolder1 = notnull(adapter.getValueAt(0, 17), webFileFolder1);
        webFileLength = Long.parseLong(notnull(adapter.getValueAt(0, 18), (new StringBuilder()).append("").append(webFileLength).toString()));
        webFileLength1 = Long.parseLong(notnull(adapter.getValueAt(0, 19), (new StringBuilder()).append("").append(webFileLength1).toString()));
             
        dbFileFolder = notnull(adapter.getValueAt(0, 21),dbFileFolder);  
        ServerAgent.workingFolder = notnull(adapter.getValueAt(0, 22), ServerAgent.workingFolder);
        websiteFolder = notnull(adapter.getValueAt(0, 23), websiteFolder);
        localnopass = notnull(adapter.getValueAt(0, 24), localnopass?"1":"0").equals("1") && Toolbox.edition.contains("Institution");
        UploadFile.MaxUploadSize = Long.parseLong(notnull(adapter.getValueAt(0, 20), (new StringBuilder()).append("").append(UploadFile.MaxUploadSize).toString()));
       
        if (new File(Toolbox.installpath + File.separator + "styleb" + (orgnum) + ".css").exists() == false) 
        {
             String safe = "green", caution = "orange", danger="red", longtime="blue";
             safe = adapter.getValueAt(0,25);
             caution = adapter.getValueAt(0,26); 
             danger= adapter.getValueAt(0,27); 
             longtime= adapter.getValueAt(0,28);
             Toolbox.changecss(safe,caution,danger,longtime,orgnum);
        }
          
        if(!sql1.equals(""))
        {
            String sql =  "UPDATE SystemParam SET " + sql1.substring(1) ;
             
            int ll = adapter.executeUpdate(sql);
             
        }
         
        String sql = "SELECT * FROM DomainValue WHERE domain='Semester' AND language='" + Toolbox.langs[orgnum>>16] + "' AND code=" +  currentSemester;
 
        b = adapter.executeQuery2(sql,false);
         
        if (!b || adapter.getValueAt(0, 0)==null)
        {
            String newSemesterstr = initsemester();
            for (String xx: Toolbox.langs)
            {
                    sql = "INSERT INTO DomainValue (lastupdate,domain,domainValue,code,description,language) VALUES("
                    + (System.currentTimeMillis()/1000) + ",'Semester','" +newSemesterstr + "'," + currentSemester + ",'" + Toolbox.emsg(1004) + "','" + xx + "')";
                    int ll = adapter.executeUpdate(sql);
                     
            } 
        }
          
        
        initFolder();
        return ans;
    }
    
    void initnames(JDBCAdapter adapter)
    {
        unitname = new String[Toolbox.langs.length];
        for (int i=0; i < Toolbox.langs.length; i++)
        {
            String sql = "SELECT domainValue,code FROM DomainValue WHERE domain='Site Name' AND language='" + Toolbox.langs[i] + "' order by code";
            int b1 = adapter.executeQuery(sql);
            String n = null; 
            String n1 = null; 
            if (b1 > 0 )
            {
                n = adapter.getValueAt(0, 0);
                if (b1>1) n1 = adapter.getValueAt(1, 0);
                if ( n==null) 
                    unitname[i] = Toolbox.emsgs(orgnum, 1471);
                else if (  n!=null && n1==null )
                    unitname[i] = n;//+ "/" + Toolbox.emsgs(orgnum, 1471);
                else if ( n!=null && n1!=null)
                    unitname[i] = n + "/" + n1;

            }
            if (unitname[i]==null) unitname[i] = unitname[Toolbox.langnum];
            if (unitname[i]==null) unitname[i] = unitname[0];
        }
    }
     
    public static String initsemester()
    {
       Date d = new Date();
       int y = d.getYear()+100;
       int m = d.getMonth();
       if (m > 6) return "Fall " + y;
       return "Spring " + y;
    }
     
    public void run()
    {
       starttimer();
    }
    public void starttimer()
    {
        if (remind.settime  != null && !remind.settime.equals("")  )
        {
            remind.set(remind.settime);
            remind.haveset  = true;
        }
        else
        {
            remind.haveset  = false;
            remind.settime  = "";
        }
       
    }
    public static DBAdmin server2admin(String s)
    {
        if (s==null) return null;
        int i=0; 
        for (;i < Toolbox.dbadmin.length;i++)
        {
            if (Toolbox.dbadmin[i].systemserver!=null && s.equals( Toolbox.dbadmin[i].systemserver)) return  Toolbox.dbadmin[i];
        }
        return null;
    }
    
    public String colors(int orgnum,CachedStyle cachedstyle)
    {
        return "var orgnum=" + orgnum + ", DBGCOLOR='" + cachedstyle.DBGCOLOR +"', BBGCOLOR='" + cachedstyle.BBGCOLOR +"',beheading='" +  beheading(cachedstyle) + "',IBGCOLOR='" + cachedstyle.IBGCOLOR 
                + "', TBGCOLOR='" + cachedstyle.TBGCOLOR +"',subsitename='" + subsitename + "'";
    }
    
    public DBConnectInfo sysDBConnectInfo()
    {
        return new DBConnectInfo(systemserver, systemdriver, systemuser, systempassword, orgnum);
    }
 
     
    public   void setunitname(String un, int orgnum)
    {
        unitname[orgnum>>16] = un;
    }

    public String setxml(String website, String web, String web1, String leng, String leng1, String maxlen, String working, String db)
    {
        JDBCAdapter adapter = Toolbox.getUserAdapter(sysDBConnectInfo(),orgnum);
        websiteFolder = website;
        dbFileFolder = db;
        webFileFolder = web;
        webFileFolder1 = web1;
        ServerAgent.workingFolder = working;
        webFileLength = Long.parseLong(leng);
        webFileLength1 = Long.parseLong(leng1);
        UploadFile.MaxUploadSize = Integer.parseInt(maxlen);
        String sql = (new StringBuilder()).append("update SystemParam set websitefolder='").append(website).append("',webFolder='").append(web).append("', webFolder1='").append(web1).append("', folderLength=").append(leng).append(", folderLength1=").append(leng1).append(", maxlength=").append(maxlen).append(", workingFileFolder='").append(working).append("', dbFileFolder='").append(db).append("'").toString();
        adapter.executeUpdate(sql);
        adapter.close();
        return adapter.error();
    }

    public  synchronized String  writedbs()
    {
        String err = "";
        if(Toolbox.installpath == null || Toolbox.installpath.equals(""))
        {
            err = (new StringBuilder()).append(err ).append("installFolder is null").toString();
            return err;
        }
        String str =  Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "conf" + File.separator + "dbhost" + (orgnum%65536) + ".crp" ;
        
        try
        {
            File file = new File(str);
            FileOutputStream fos = new FileOutputStream(file);
            GZIPOutputStream gzos = new GZIPOutputStream(fos);
            ObjectOutputStream out = new ObjectOutputStream(gzos);
            Vector v = new Vector();
            for(int ll = 0; ll < numHosts; ll++)
                v.addElement(dbhost[ll]);
            out.writeObject(v);
            out.close();
            fos.close();
            
        }
        catch(Exception e)
        {
            err =  err + e.toString();
            return err;
        }
        return "";
    }
    static public int numdbhosts()
    {
         if (!Toolbox.edition.contains("Enterprise") ) return 1;
         int k = 1;
         while (true)
         {
             String str =  Toolbox.installpath +  File.separator +  "WEB-INF" +  File.separator +  "conf" +  File.separator +  "dbhost" + k +".crp";
             String str1 =  Toolbox.installpath +  File.separator +  "WEB-INF" +  File.separator +  "conf" +  File.separator +  "dbhost" + k +".csv";
             if (new File(str).exists() || new File(str1).exists())  k++;
             else break;
         }
         return k; 
    }
    public  synchronized boolean readdbs()
    {
        int num = orgnum % 65536;
        boolean ans = true;
        boolean hasfile = false;
        String str =  Toolbox.installpath +  File.separator +  "WEB-INF" +  File.separator +  "conf" +  File.separator +  "dbhost" + num +".crp";
        try
        {
            File file = new File(str);
            FileInputStream sin = new FileInputStream(file);
            GZIPInputStream gzis = new GZIPInputStream(sin);
            ObjectInputStream in = new ObjectInputStream(gzis);
            hasfile = true;
            Vector v = (Vector)in.readObject();
            numHosts = v.size();
            dbhost = new DBHost[numHosts+1];
            dbhost[numHosts] = new DBHost();
          
            for(int i = 0; i < numHosts; i++)
            {
                dbhost[i] = (DBHost)v.elementAt(i);
            }
            in.close();
            sin.close();
        }
        catch(Exception e)
        {
            str = "WEB-INF"+ File.separator+ "conf"+ File.separator + "dbhost" + num + ".csv";
            str =  Toolbox1.filebytes("WEB-INF"+ File.separator+ "conf"+ File.separator + "dbhost" + num + ".csv","UTF-8");
            if (str == null)
            {
                str =  Toolbox1.filebytes("WEB-INF"+ File.separator+ "conf"+ File.separator + "dbhost.csv","UTF-8");
                if (str!=null) str = str.replaceAll("telaman", "telaman" + num);
            }
            if (str == null)
            {
                str =  "h2";
                if (dbFileFolder!=null && !dbFileFolder.equals(""))
                    str += ",jdbc:h2:" + dbFileFolder + File.separator + "telaman" + num;
                else
                    str += ",jdbc:h2:~" + File.separator + "telaman" + num;
                str += ",org.h2.Driver,sa,,1,1";
            }
             
            CSVParse parse = new CSVParse(str, '"',new String[]{",", "\r\n"});
            String [][] x = parse.nextMatrix(true);
            numHosts = x.length;
            dbhost = new DBHost[numHosts+1];
            dbhost[numHosts] = new DBHost();
            for (int i=0; i < numHosts; i++)
            {
                dbhost[i] = new DBHost();
                dbhost[i].getLine(x[i]);
            } 
            
        }
 
        for (int i=0; i < numHosts; i++)
        {
            int k = 0;
            if ( (k=dbhost[i].host.indexOf(":h2:")) >0)
            {
                 String dbf = dbhost[i].host.substring(k+4);
                 if (dbf.charAt(dbf.length()-1) == '\\' || dbf.charAt(dbf.length()-1) == '/')
                     dbf = dbf.substring(0,dbf.length()-1);
                 if ( (new File(dbf)).exists() == false)
                 {
                      
                     if (dbFileFolder==null || dbFileFolder.equals(""))
                     {
                         ans = initFolder();
                     }
                     if (dbFileFolder!=null && !dbFileFolder.equals(""))
                         dbhost[i].host = "jdbc:h2:" + dbFileFolder  + File.separator;
                     else 
                         ans = false;
                 }
                 else  if (dbFileFolder==null || dbFileFolder.equals(""))
                 {
                     dbFileFolder = dbf;
                 }

                 h2order = i; 
            }
            else if (dbhost[i].host.indexOf(":odbc:") >0)
            {
                 k = dbhost[i].host.indexOf(";DBQ=");
                 String dbf = dbhost[i].host.substring(k+5);
                 if (dbf.charAt(dbf.length()-1) == '\\' || dbf.charAt(dbf.length()-1) == '/')
                     dbf = dbf.substring(0,dbf.length()-1);
                 if ( (new File(dbf)).exists() == false)
                 {
                     if (dbFileFolder==null  || dbFileFolder.equals(""))
                     {
                         ans = initFolder();
                     }
                     if (dbFileFolder!=null && !dbFileFolder.equals(""))
                         dbhost[i].host = "jdbc:odbc:Driver={Microsoft Access Driver (*.mdb)};DBQ=" + dbFileFolder  + File.separator;
                     else
                         ans = false;
                 }
                 else  if (dbFileFolder==null || dbFileFolder.equals(""))
                 {
                     dbFileFolder = dbf;
                 }
                 accessorder = i; 
            }
             
            
            if(dbhost[i].active.equals("1"))
                defaultdbms = dbhost[i].dbms;
            if (dbhost[i].asmain.equals("1"))
            {
                systemdbms = dbhost[i].dbms;
                systemserver = dbhost[i].host+ dbhost[i].admindb;
                systemdriver = dbhost[i].driver;
                systemuser = dbhost[i].uid;
                systempassword = dbhost[i].password;
            }
        }
        if (ans == false) phase = -1;
        if (hasfile==false) writedbs();
        return ans;
    }

    static String notnull(String x1, String x2)
    {
        if(x1 == null || x1.equals(""))
            return x2;
        else
            return x1;
    }
    public static String removetwodots(String x)
    {
        String y =  x.trim().replaceAll("[^/]+/\\.\\./","").replaceFirst("[^/]+/\\.\\.","").replaceAll("[^\\\\]+\\\\\\.\\.\\\\","").replaceFirst("[^\\\\]+\\\\\\.\\.","");
        int i = y.indexOf("\\\\");
        if (i > 0)
            return y.substring(0,i) + y.substring(i+1);
        return y;
    }
    public  synchronized boolean initFolder()
    {
        String install = Toolbox.installpath;
        if(install == null || install.equals(""))
            install = (new File("a")).getAbsolutePath().replaceFirst("/WEB-INF.*", "");
        install = removetwodots(install);
        if(install.substring(install.length() - 1).equals(File.separator))
            install = install.substring(0, install.length() - 1);
   
        String x = Toolbox.installpath;
        if(x.charAt(x.length() - 1) == File.separatorChar)
            x = x.substring(0, x.length() - 1);
        int j = x.lastIndexOf(File.separator );
        if (x.charAt(j-1) == File.separatorChar)
            j--;
        x = x.substring(0, j + 1);
        int N = numdbhosts();
        boolean ans = true; 
        if(dbFileFolder == null)
        {
            if (N <= 1 && Toolbox.edition.contains("Enterprise")==false)
                dbFileFolder = x + "database";
            else 
                dbFileFolder = x + "database" + File.separator + (orgnum%65536);
        }
        if(webFileFolder == null)
        {
            if (N <= 1 && Toolbox.edition.contains("Enterprise")==false)
                webFileFolder = x + "teachers";
            else 
            webFileFolder = x + "teachers"+ File.separator + (orgnum%65536);
        }
        if(webFileFolder1 == null)
        {
            if (N <= 1 && Toolbox.edition.contains("Enterprise")==false)
                webFileFolder1 = x + "students";
            else
                webFileFolder1 = x + "students"+ File.separator + (orgnum%65536);
        }
           
        if(websiteFolder == null)
        {
            if (N <= 1 && Toolbox.edition.contains("Enterprise")==false)
                websiteFolder = x + "website";
            else 
                websiteFolder = x + "website"+ File.separator + (orgnum%65536);
        }
        if ((orgnum%65536) == 0)
        {
            String website = websiteFolder.replaceFirst("[^0-9][0-9]+$","");
            if ( new File( website ).exists() == false)
            {
                mkdir( website );
            }
            if (  new File( website+ File.separator +"WEB-INF").exists() == false)
            {
                String  f =   (Toolbox.installpath + File.separator  + "WEB-INF"+ File.separator + "conf" 
                        + File.separator + "WEB-INF.zip"); 
                try{ 
                ZipUnZip.unzip(f,null,null,null,(orgnum%65536)); 
                (new File(f.replaceFirst(".zip$", ""))).renameTo(new File(website+ File.separator +"WEB-INF"));
                
                }catch(Exception e){}
            }
        } 
        if (new File(websiteFolder).exists() == false)
        {
            mkdir(websiteFolder);
        }
        if(ServerAgent.workingFolder == null)
            ServerAgent.workingFolder = x + "working";
        if(dbFileFolder != null && !dbFileFolder.equals(""))
        {
            File f = new File(dbFileFolder);
            if(!f.exists())
            {
                ans =  mkdir(dbFileFolder);
                if (ans == false)
                   dbFileFolder = ""; 
            }
             
        }
        if(webFileFolder != null && !webFileFolder.equals(""))
        {
            File f = new File(webFileFolder);
            if(!f.exists())
                mkdir(webFileFolder);
            if(!f.exists())
                webFileFolder = "";
        }
        if(webFileFolder1 != null && !webFileFolder1.equals(""))
        {
            File f = new File(webFileFolder1);
            if(!f.exists())
                mkdir(webFileFolder1);
            if(!f.exists())
                webFileFolder1 = "";
        }
        if(ServerAgent.workingFolder != null && !ServerAgent.workingFolder.equals(""))
        {
            File f = new File(ServerAgent.workingFolder);
            if(!f.exists())
                mkdir(ServerAgent.workingFolder);
            if(!f.exists())
                ServerAgent.workingFolder = "";
        }
        return ans;
    }

    public String dbphase(JDBCAdapter adapter)
    {
        String err = ""; 
        boolean nullada = false;
         if (adapter == null)
        {
 
            adapter = Toolbox.getUserAdapter(sysDBConnectInfo(),orgnum);
            nullada = true;
        }
        try
        {
            String sql1 = "SELECT id  FROM AppUser WHERE (roles mod " + (2*Systemroles.SYSTEMADMIN) + ") >= " + Systemroles.SYSTEMADMIN;
            boolean b = adapter.executeQuery2(sql1,false);
            phase = 2 + ((b&&adapter.getValueAt(0,0)!=null)?1:0);
            if (phase < 3)
               err = adapter.error();
        }catch(Exception e){}
        //if (nullada)   adapter.close();
        return err;
    }

    public static void stopwaiting()
    {
        onoff.access(false, false);
    }
   
    public  int hasSysDB()
    {
        CachedStyle cachedstyle = new CachedStyle(null,orgnum);
        File [] files  = (new File(Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "conf")).listFiles(new FF());
        if (files !=null && files.length>0)
        {
            String ll[] = new String[files.length];
            File fs[] = new File[files.length]; 
            for (int i=0; i < ll.length; i++)
            {
                ll[i] = files[i].lastModified() + " " + i;
            }
            java.util.Arrays.sort(ll);
            for (int i=0; i < ll.length; i++)
            {
                ll[i] = ll[i].replaceFirst("[^ ]+ ", "");
            }
            for (int i=0; i < files.length; i++)
            {
                fs[i] = files[Integer.parseInt(ll[i])];
            }
            try
                {   
                     String masterRoot =  Toolbox.installpath+ File.separator + "WEB-INF" + File.separator + "conf";
                      
                     for (int i=0; i < ll.length; i++)
                     {
                        DataRestoreFromFile df = new DataRestoreFromFile(masterRoot+ File.separator + fs[i].getName(), 
                                null,"backup",  "*", /* Toolbox.encoding,*/ sysDBConnectInfo(), null);
                        
                        df.process(orgnum,new CachedStyle(null, orgnum));
                        error1 = df.msg;
                     }
                                                      
                }
                catch(Exception e){}
            for (int i=0; i < ll.length; i++)
            {
                fs[i].delete();
            }
        }
        
        JDBCAdapter adapter = Toolbox.getUserAdapter(sysDBConnectInfo(),orgnum);
        String err = "";
        if(!adapter.error().equals("") && systemdbms!=null &&  !systemdbms.equals("h2") && dbFileFolder!=null && !dbFileFolder.equals(""))
        {
            adapter.close();
            dbhost[defaultorder].asmain = "0";
            dbhost[defaultorder].active = "0";
            Toolbox.msgqueueput((orgnum%65536) + "admin", systemdbms + Toolbox.msg [1]);
            defaultorder = h2order;
            dbhost[h2order].asmain = "1";
            dbhost[h2order].active = "1";
            systemdbms = dbhost[h2order].dbms;
            systemserver = dbhost[h2order].host + dbhost[h2order].admindb;
            systemdriver = dbhost[h2order].driver;
            systemuser = dbhost[h2order].uid;
            systempassword = dbhost[h2order].password;
            writedbs();
            adapter = Toolbox.getUserAdapter(sysDBConnectInfo(),orgnum);
            err = adapter.error(); 
        }
 
        if(!err.equals("") && systemdbms!=null && !systemdbms.equals("access") && dbFileFolder!=null && !dbFileFolder.equals(""))
        {
            adapter.close();
            dbhost[defaultorder].asmain = "0";
            dbhost[defaultorder].active = "0";
            Toolbox.msgqueueput((orgnum%65536) + "admin",   systemdbms + Toolbox.msg [1]);
            defaultorder = h2order;
            dbhost[accessorder].asmain = "1";
            dbhost[accessorder].active = "1";
            systemdbms = dbhost[accessorder].dbms;
            systemserver = dbhost[accessorder].host + dbhost[accessorder].admindb;
            systemdriver = dbhost[accessorder].driver;
            systemuser = dbhost[accessorder].uid;
            systempassword = dbhost[accessorder].password;
            writedbs();
            adapter = Toolbox.getUserAdapter(sysDBConnectInfo(),orgnum);
            err = adapter.error(); 
        }
 
        if(!err.equals(""))
        {
            phase = 0;
            error1 = err + ' ' + sysDBConnectInfo().toString();
           
        } else
        {
            phase = 1;
          
            Toolbox.println(0,  "Connected to System Database   " + systemdbms + " "+ systemserver );
            initnames(adapter);
            String [] tbs = adapter.tableList();
            
            if ((tbs==null || tbs.length < 50 ) )
            {
               fillSysDB(null,cachedstyle); 
               if (1 != adapter.executeUpdate("UPDATE DBOwner SET server='" + systemserver + "', driver='" + systemdriver + "',dbuserid='" + systemuser + "',dbpassword='" + systempassword + "' where id='admin'"))
               {}
               if (1 != adapter.executeUpdate("UPDATE AppUser SET password='',roles=47 where id='admin'"))
               {} 
            }
            Toolbox.println(0,  "# tables = " + (tbs==null?0:tbs.length )); 
            boolean b = adapter.executeQuery2("SELECT userlink,Docslang.docs,Docslang.language FROM SigninPolicy,Docslang where SigninPolicy.instruction=Docslang.domain and active=1",false);
            
            if(b && (orgnum%65536)==0 && adapter.getValueAt(0,0)!=null)
            {
                
                for (int i=0; adapter.getValueAt(i, 0)!=null; i++)
                { 
                    
                    int k=0; for(; k < Toolbox.langs.length; k++)
                        if (adapter.getValueAt(i, 2).equals(Toolbox.langs[k])) break;
 
                    if (k < Toolbox.signuplink.length)
                    {
                    Toolbox.signuplink[k] = adapter.getValueAt(i, 0);
                    Toolbox.instruction[k] = adapter.getValueAt(i, 1);
                    }
     
                }
            }
               
            if(setSystemParameter(adapter) >= 0)
                   Toolbox.println(0, "Set System parameters.");
            else
                   Toolbox.println(0, "There was an error when Setting system parameters.");
              
            String sql = "select num, cdate from Acalender order by num";
            b = adapter.executeQuery2(sql,false);
            int n = 0;
            if (b)
            {
                for(int i = 0; adapter.getValueAt(i, 0)!=null; i++)
                { 
                    n++;   
                    setAppedt(adapter.getValueAt(i, 0), adapter.getValueAt(i, 1));
                }
            }
               
            Toolbox.println(0, (new StringBuilder()).append("Number of events: ").append(n).toString());
            if( (orgnum%65536) == 0 || Systemroles.roles==null || Systemroles.roles[0] == null || Systemroles.roles[0][0] == null || Systemroles.roles[Systemroles.roles.length-1] == null || Systemroles.roles[Systemroles.roles.length-1][0] == null)
            {
                err = Systemroles.readRoles(adapter);
                if(err == null || err.equals(""))
                    Toolbox.println(0, (new StringBuilder()).append("Number of System Roles: ").append(Systemroles.numRoles).toString());
                else
                    Toolbox.println(0, (new StringBuilder()).append("There was an error in Making System Roles: ").append(err).append(systemserver).toString());
            }
            sql = "SELECT id  FROM AppUser WHERE (roles mod (" + (2*Systemroles.SYSTEMADMIN) + ")) >= " + Systemroles.SYSTEMADMIN;
             
            try{
            b= adapter.executeQuery2(sql,false );
            }catch(Exception e){b = false; }
             
            if(b && adapter.getValueAt(0, 0)!=null)
            {
                adminid = adapter.getValueAt(0, 0);
                phase = 3;
            } 
            else  if(b)
            {
                phase = 2;
                error1 = "There is no System Adminstrator User Account";
            } 
            
            if (b==false || adapter.getValueAt(0, 0)== null)
            {
                fillSysDB(null,cachedstyle);
                if (1 != adapter.executeUpdate("UPDATE DBOwner SET server='" + systemserver + "', driver='" + systemdriver + "',dbuserid='" + systemuser + "',dbpassword='" + systempassword + "' where id='admin'"))
                {}
                if (1 != adapter.executeUpdate("UPDATE AppUser SET password='',roles=47 where id='admin'"))
                {} 
                dbphase(adapter);
                if(phase >= 3)
                {
                    if ((orgnum%65536)==0)
                    {
                        err = Systemroles.readRoles(adapter);
                    }
                     
                    if(setSystemParameter(adapter) >= 0)
                       Toolbox.println(0, "Set System parameters.");
                    else
                       Toolbox.println(0, "There was an error when Setting system parameters.");
                    
                }
            }
     
            Toolbox.println(0,  "Phase " + phase + ": "+ error1 );
            if(phase >= 3   )
            {
                BackRoutine.postproc(null, adapter, "commondata", null, null,cachedstyle);
                if( (orgnum%65536) == 0 ){
                Toolbox.println(1, "common data"  );
                if(Generic.storedProc == null || Generic.storedProc.size() < 10)
                {
                    Generic.genStoredProc(null, adapter, orgnum);
                    adapter.close();
                } 
                else
                {
                    Task tk = new Task(adapter);
                    tk.applyAllLang(Toolbox.langnum<<16);
                    tk.close();
                    adapter.close();
                } 
                adapter = Toolbox.getUserAdapter(sysDBConnectInfo(),orgnum);
                }
            }
           
            if(phase >= 3 && (orgnum%65536) > 0 )
            {
               Set<String> e =  Generic.storedProc.keySet();
               for (String rdapn : e)
               {
                   if (rdapn.indexOf("$") > 0) continue;
                   Webform w = (Webform)(Generic.storedProc.get(rdapn));
                   w.simplify(adapter, orgnum);
               }
            }
            
            Toolbox.println(0, "stored procedure");
            buildSemesterMap(adapter);
            Toolbox.println(0, "built semester");
            BackRoutine.postproc(null, adapter, "updatelinks", null, null,cachedstyle);
            
            Toolbox.println(1, "updatelinks");
            
        }
         
        adapter.close();
        Toolbox.println(1, "complete init for " + orgnum);
        return phase;
    }

     
    public static synchronized boolean mkdir(String path)
    {
        int j = 0;
        File f = null;
        while(true)
        {
            if((j = path.indexOf(File.separator, j + 1)) <= 0)
                break;
            if(!(f = new File(path.substring(0, j))).exists())
            {
                if (f.mkdir() == false) return false;
            }
        }  
        if(!(f = new File(path)).exists())
        {
             if (f.mkdir() == false) return false;
        }
         
        return true;
    }

    public   String toString1()
    {
        return (new StringBuilder()).append("webFileFolder=").append(webFileFolder).append("\n").append("webFileFolder1=").append(webFileFolder1).append("\n").append("dbFileFolder=").append(dbFileFolder).append("\n").toString();
//.append("Toolbox.installpath=").append(Toolbox.installpath);//.append("\n").append("permit=").append(permit).append("\n").append("permitedFile=").append(permittedFile).append("\n").append("systemdbms=").append(systemdbms).append("\n").append("systemserver=").append(systemserver).append("\n").append("systempassword=").append(systempassword).append("\n").append("defaultdbms=").append(defaultdbms).toString();
    }

    private void writestr(RandomAccessFile f, String s, int l)
        throws IOException
    {
        if(s == null)
            s = "";
        for(int ln = s.length(); ln < l - 1; ln++)
            s = (new StringBuilder()).append(s).append(' ').toString();

        s = s.substring(0, l - 1);
        s = (new StringBuilder()).append(s).append('\n').toString();
        f.writeChars(s);
    }

    public  String error()
    {
        return error1;
    }

    private static String read(RandomAccessFile f, int l)
        throws IOException
    {
        char name[] = new char[l];
        int i = 0;
        for(i = 0; i < l; i++)
            name[i] = f.readChar();

        String s = new String(name);
        return s.trim();
    }

     
    public  synchronized String setsystemdb(String dbms, String db, String d, String uid, String pass)
    {
        String err = "";
        if(dbms == null)
            return "null dbms";
        if(dbms.equals("mysql") && !testSystemdb(dbms, db, d, uid, pass).equals("OK"))
        {
            err = (new StringBuilder()).append(Toolbox.emsg(117)).append("<br>").toString();
            return err;
        }
        if(dbms.equals("access"))
        {
            if(pass == null || pass.equals(""))
                pass = Toolbox.appname;
            if(phase == 0)
                phase = 1;
        }
        JDBCAdapter  adapter = new JDBCAdapter(db,d,uid,pass,orgnum);
        if ( adapter.error().equals("")==false)
        {
             adapter.close();
            error3 = (new StringBuilder()).append(error3).append("<br>Not connective db").append(db).append(",").append(d).append(",").append(uid).append(",").append(pass).toString();
            return error3;
        }
        adapter.close(); 
        systemdbms = dbms;
        systempassword = pass;
        systemserver = db;
        systemdriver = d;
        systemuser = uid;
        error3 = (new StringBuilder()).append(error3).append("<br>After set:  <br>  sysdbms=").append(systemdbms).append("<br>systemserver=").append(systemserver).append("<br>systemdriver=").append(systemdriver).append("<br>systemuser=").append(systemuser).append("<br>").toString();
        return  writedbs();
         
    }

    public static String testSystemdb(String dbms, String db, String d, String uid, String password)
    {
        if(d == null && dbms.equals("access"))
            d = "sun.jdbc.odbc.JdbcOdbcDriver";
        else
        if(d == null && dbms.equals("mysql"))
            d = "com.mysql.jdbc.Driver";
        else
        if(d == null && dbms.equals("oracle"))
            d = "";
        else
        if(d == null && dbms.equals("postgres"))
            d = "org.postgresql.Diver";
        else
        if(d == null && dbms.equals("sqlserver"))
            d = "com.microsoft.jdbc.sqlsrever.SQLServerDriver";
        int orgnum = Toolbox.langnum<<16; 
        DBAdmin admin = server2admin(db);
        if (admin!=null) orgnum = admin.orgnum;
        JDBCAdapter adapter = new JDBCAdapter(db, d, uid, password, orgnum);
        String msg = adapter.error();
        adapter.close();
        if(!msg.equals(""))
        {
            msg = (new StringBuilder()).append(msg).append("Used:  <br>  dbms=").append(dbms).append("<br> server=").append(db).append("<br> driver=").append(d).append("<br> user=").append(uid).append("<br>").toString();
            return msg;
        } else
        {
            return "OK";
        }
    }

    static String createAccess(String path, String masterFile, String svname, String id, String password)
    {
        Runtime r;
        Process proc;
        String err = "";
        if(path == null || path.equals(""))
        {
            err = "path is null";
            return err;
        }
        if(masterFile == null || masterFile.equals(""))
        {
            err = "masterFile is null";
            return err;
        }
        if(svname == null || svname.equals(""))
        {
            err = "svname is null";
            return err;
        }
        if(id == null || id.equals(""))
        {
            err = "id is null";
            return err;
        }
        if(password == null || password.equals(""))
        {
            err = "password is null";
            return err;
        }
        if(Toolbox.installpath == null || Toolbox.installpath.equals(""))
        {
            err = "Toolbox.installpath is null";
            return err;
        }
        r = Runtime.getRuntime();
        proc = null;
        File f;
        if(!masterFile.equals(path))
            if((f = new File(masterFile)).exists())
            {
                if(!(new File(path)).exists())
                {
                    try{
                    FileInputStream fin = new FileInputStream(f);
                    FileOutputStream fout = new FileOutputStream(new File(path));
                    byte buf[] = new byte[4096];
                    for(int len = 0; (len = fin.read(buf)) > 0;)
                        fout.write(buf, 0, len);

                    fin.close();
                    fout.close();
                    }catch(Exception e){}
                }
            } else
            {
                err  = (new StringBuilder()).append(err ).append("Master access file ").append(masterFile).append(" does not exist<br>").toString();
                return err;
            }
         
        String com = Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "conf" + File.separator + "odbcaccess " + svname + " " + id + " " + password + " " + path;
        try
        {
            proc = r.exec(com);
            if (0 != proc.waitFor())
            {
                err  = (new StringBuilder()).append(err ).append(com).append(" ").append(Toolbox.emsg(119)).append("<br>").toString();
                return err;
            }
            return "";
        }
        catch(Exception e)
        {
            err = (new StringBuilder()).append(err ).append(e.toString()).toString();
        }
        return err;
    }

    public String odbc(String dbFolder)
    {
        error3 = "";
        error1 = "";
        String dir =  Toolbox.installpath + File.separator + "WEB-INF" + File.separator+ "conf" + File.separator;
        String path = (new StringBuilder()).append(dbFileFolder).append(File.separator).append(Toolbox.appname).append("sys.mdb").toString();
        String blank = (new StringBuilder()).append(dir).append("blank.mdb").toString();
        return createAccess(path, blank,  Toolbox.appname + "sys", "systemadmin", Toolbox.appname);
    }

    public  synchronized DBConnectInfo createDB(User user, StringBuffer err)
    {
        if(!Systemroles.owndb(user.roles))
            return null;
        String svname = (new StringBuilder()).append((orgnum%65536)).append("_").append(user.id).toString();
        String dbms = defaultdbms;
        int i = 0;
        for(i = 0; i < numHosts && !dbhost[i].dbms.equals(dbms); i++);
       
        String server =(new StringBuilder()).append(dbhost[i].host).append(svname).toString();
         String driver = dbhost[i].driver;
        JDBCAdapter adapter = Toolbox.getUserAdapter(sysDBConnectInfo(),orgnum);  
         DBConnectInfo dc = new DBConnectInfo(server , driver, "", "", orgnum);
       
        if( false == dc.save2db(adapter,user.id))
        {
            err.append((new StringBuilder()).append(dc.toString()).append(" ").append(Toolbox.emsg(446)).toString());
            adapter.close();
            return null;
        }
        adapter.close();
        String masterFile = "";
        String masterRoot = (new StringBuilder()).append(Toolbox.installpath).append(File.separator).append("WEB-INF").append(File.separator).append("conf").append(File.separator).toString();
        String bb = "";
        if(dbms.equals("access"))
        {
            if(dbFileFolder == null)
            {
                err.append((new StringBuilder()).append("dbFileFolder=null, ").append(Toolbox.emsg(118)).append("<br>").toString());
                exesql((new StringBuilder()).append("delete from DBOwner where id='").append(user.id).append("'").toString(), systemserver, systemdriver, systemuser, systempassword);
                return null;
            }
            if(Toolbox.installpath == null)
            {
                err.append((new StringBuilder()).append("installFolder=null, ").append(Toolbox.emsg(118)).append("<br>").toString());
                exesql((new StringBuilder()).append("delete from DBOwner where id='").append(user.id).append("'").toString(), systemserver, systemdriver, systemuser, systempassword);
                return null;
            }
            String path = (new StringBuilder()).append(dbFileFolder).append(File.separator).append("tlm").append(user.id).append(".mdb").toString();
            if(ownpassword)
            {
                dc.user= user.id;
                dc.password = user.password;
            } else
            {
                dc.user = dbhost[i].uid;
                dc.password = dbhost[i].password;
            }
            String err1 = createAccess(path, (new StringBuilder()).append(masterRoot).append(Toolbox.appname).append("user.mdb").toString(), svname, dc.user, dc.password);
            if( err1.equals("") == false)
            {
                err.append(err1);
                exesql((new StringBuilder()).append("delete from DBOwner where id='").append(user.id).append("'").toString(), systemserver, systemdriver, systemuser, systempassword);
                return null;
            }
        } else
        {
           
            if (dbms.equals("mysql"))
               bb =  exesql( "CREATE database IF NOT EXISTS" + svname,  dbhost[i].host + dbhost[i].admindb, driver, dbhost[i].uid, dbhost[i].password);
            else if (dbms.equals("oracle"))
               bb = exesql("CREATE database " + svname,  dbhost[i].host + dbhost[i].admindb, driver, dbhost[i].uid, dbhost[i].password);
            else if (dbms.equals("postgres") )
               bb = exesql( "CREATE database " + svname,  dbhost[i].host + dbhost[i].admindb, driver, dbhost[i].uid, dbhost[i].password);
            else if (dbms.equals("sqlserver") )
               bb = exesql( "CREATE database  " + svname,  dbhost[i].host + dbhost[i].admindb , driver, dbhost[i].uid, dbhost[i].password);
            else if ( dbms.equals("h2") )
            {
                
                     if (dbFileFolder==null)
                         initFolder();
                     dbhost[i].host = "jdbc:h2:" + dbFileFolder  + File.separator;
                    
                   
                bb = exesql(null,  dbhost[i].host + svname, driver, dbhost[i].uid, dbhost[i].password);
            }
            else if ( dbms.equals("access") )
            {
                
                     if (dbFileFolder==null)
                         initFolder();
                     dbhost[i].host = "jdbc:odbc:Driver={Microsoft Access Driver (*.mdb)};DBQ=" + dbFileFolder  + File.separator;
                    
                   
                bb = exesql(null,  dbhost[i].host + svname, driver, dbhost[i].uid, dbhost[i].password);
            }
            else bb = "error";
        }
        err.append(bb);
        if(!bb.equals(""))
        {
            bb = exesql( "delete from DBOwner where id='"+user.id + "'", systemserver, systemdriver, systemuser, systempassword);
            return null;
        }
        masterFile = (new StringBuilder()).append("user").append(Toolbox.lang).append(".bak").toString();
        if(ownpassword)
        {
            dc.user = user.id;
            dc.password = user.password;
        } else
        {
            dc.user = dbhost[i].uid;
            dc.password = dbhost[i].password;
        }
        if(dc.password.length() > 39)
            dc.password = Toolbox.decrypt(dc.password,orgnum);
        String sql = (new StringBuilder()).append("UPDATE DBOwner SET dbuserid='").append(dc.user.replaceAll("'", "''")).append("', dbpassword='").append(dc.password.replaceAll("'", "''")).append("' WHERE id='").append(user.id).append("'").toString();
        bb = exesql(sql, systemserver, systemdriver, systemuser, systempassword);
        err.append(error3);
        user.dbinfo = dc;
        String er = DataMove.intisubdb(user);
        err.append(er);
        return dc;
    }

    public boolean fillSysDB(String uid,CachedStyle cachedstyle)
    {
        error1 = "";
        error3 = "";
         
        String masterRoot =  Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "conf" + File.separator;
        String masterFile = "sysadmin.zip"; 
        if (new File(masterRoot+masterFile).exists() == false) masterFile = "sysadmin.bak";
        if (new File(masterRoot+masterFile).exists() == false) masterFile = "sysadmin.sql";
        if (new File(masterRoot+masterFile).exists() == false)
             Toolbox.print(0, masterRoot+"sysadmin.zip/bak/sql not exists");
        else
        try{
           Toolbox.print(0, "inital data: " + masterRoot + masterFile);
           DataRestoreFromFile df =   
           new DataRestoreFromFile(masterRoot + masterFile, null,"keep", "*", /*Toolbox.language,*/ sysDBConnectInfo(),null);
           df.process(orgnum,cachedstyle);
           
        }
        catch(Exception e){
            return false;
        }
        return true;
    }

    public String exesql(String sql)
    {
        return exesql(sql, systemserver, systemdriver, systemuser, systempassword );
    }

    static String exesql(String sql, String systemserver1, String systemdriver1, String user1, String systempassword1 )
    {
        String err = "";
        int orgnum1 = Toolbox.langnum<<16;
        DBAdmin admin = server2admin(systemserver1);
        if (admin!=null) orgnum1 = admin.orgnum;
        JDBCAdapter adapter = new JDBCAdapter(systemserver1, systemdriver1, user1, systempassword1, orgnum1);
        if(!adapter.error().equals(""))
        {
            err  = (new StringBuilder()).append(adapter.error()).append("<br>").toString();
            adapter.close();
            return err;
        }
        int n = 0;
        if(null != sql)
        {
            n = adapter.executeUpdate(sql);
            if(!adapter.error().equals(""))
            {
                err  = (new StringBuilder()).append(adapter.error()).append("<br>").append(sql).toString();
                adapter.close();
                return err;
            }
        }
        adapter.close();
        return n >= 0?"":err;
    }

    public static boolean deleteAccess(String path, String dbname)
    {
        return true;
    }

    public  boolean removeDB(String dbms, String svname)
    {
        int j;
        for(j = svname.length() - 1; j >= 0 && svname.charAt(j) != ':' && svname.charAt(j) != '/'; j--);
        String dbname = svname.substring(j + 1);
        int i = 0;
        for(i = 0; i < numHosts && !dbhost[i].dbms.equals(dbms); i++);
        String bb = "";
        if(dbms.equals("access"))
        {
            String path = (new StringBuilder()).append(dbFileFolder).append(File.separator).append(dbname).append(".mdb").toString();
            if(!deleteAccess(path, dbname))
            {
                error1 = "error in deleting Access";
                return false;
            }
            bb = "";
        } else
        if(dbms.equals("mysql"))
            bb = exesql( "DROP database " + dbname, dbhost[i].host + dbhost[i].admindb, dbhost[i].driver, dbhost[i].uid, dbhost[i].password);
        else
        if(dbms.equals("oracle"))
            bb = exesql("DROP database " + svname,  dbhost[i].host + dbhost[i].admindb, dbhost[i].driver, dbhost[i].uid, dbhost[i].password);
        else
        if(dbms.equals("postgres"))
            bb = exesql( "DROP database " + svname ,  dbhost[i].host + dbhost[i].admindb , dbhost[i].driver, dbhost[i].uid, dbhost[i].password);
        else  if(dbms.equals("sqlserver"))
            bb = exesql( "DROP database " + svname,  dbhost[i].host + dbhost[i].admindb, dbhost[i].driver, dbhost[i].uid, dbhost[i].password);
        else  if(dbms.equals("h2"))
        {
            if (dbFileFolder!=null){
            dbhost[i].host = dbhost[i].host.replaceFirst("~", dbFileFolder);
            bb = exesql( "DROP database " + svname,  dbhost[i].host + dbhost[i].admindb, dbhost[i].driver, dbhost[i].uid, dbhost[i].password);
            }
        }
        else  if(dbms.equals("access"))
        {
            dbhost[i].host = "jdbc:odbc:Driver={Microsoft Access Driver (*.mdb)};DBQ=" + dbFileFolder + File.separator;
            bb = exesql( "DROP database " + svname,  dbhost[i].host + dbhost[i].admindb, dbhost[i].driver, dbhost[i].uid, dbhost[i].password);
        }
       
        String sql = "DELETE FROM DBOwner WHERE server='" + svname + "'";
        return bb.equals("") && exesql(sql, systemserver, systemdriver, systemuser, systempassword).equals("");
    }

    public  void main1(String s[])
    {
        DBAdmin i = new DBAdmin(0);
        systemdbms = "mysql";
        systemserver = "jdbc:mysql://localhost:3306/test";
        systemdriver = "com.mysql.jdbc.Driver";
        systempassword = "tomcat";
        defaultdbms = "access";
        systemdbms = "file";
        systempassword = "";
        systemserver = "";
    }

    public  int getDomainValueCode(String domain, String dv)
    {
        JDBCAdapter adapter = Toolbox.getUserAdapter(sysDBConnectInfo(),orgnum);  
        String s = "";
        boolean b = adapter.executeQuery2((new StringBuilder()).append("SELECT code  FROM DomainValue WHERE domain='").append(domain).append("' AND domainValue='").append(dv).append("'").toString(),false);
        adapter.close();
        if(b==false || adapter.getValueAt(0, 0)==null)
            return -1;
        else
            return Integer.parseInt(adapter.getValueAt(0, 0));
    }

    public  String getDomainValueByCode(String domain, int c, String language)
    {
        String s = "";
        JDBCAdapter adapter = Toolbox.getUserAdapter(sysDBConnectInfo(),orgnum);  
        boolean b = adapter.executeQuery2((new StringBuilder()).append("SELECT domainValue FROM DomainValue WHERE domain='").append(domain).append("' AND code=").append(c).append(" AND language='" + language + "'").toString(),false);
        adapter.close();
        if(b || adapter.getValueAt(0, 0)==null)
            return null;
        else
            return adapter.getValueAt(0, 0);
    }
    public  String domainDocs(String language, String domain)
    {
        String s = "";
        JDBCAdapter adapter = Toolbox.getUserAdapter(sysDBConnectInfo(),orgnum);  
        boolean b = adapter.executeQuery2( "SELECT docs FROM Docslang WHERE domain='" + domain + "' AND language='" + language + "' ",false);
        String ans = adapter.getValueAt(0,0);
        adapter.close();
        return ans;
    }
    public  String domainValue(String langcode, String domain, int first, int second)
    {
        String s = "";
        JDBCAdapter adapter = Toolbox.getUserAdapter(sysDBConnectInfo(),orgnum);  
        boolean b = adapter.executeQuery2((new StringBuilder()).append("SELECT code, domainValue FROM DomainValue WHERE domain='" + domain + "' AND language='" + langcode + "' order by code").toString(),false);
        if (b)
        for(int j = 0; adapter.getValueAt(j, 0)!=null; j++)
        {
            if(first >= 0 && first <= 1)
                s = (new StringBuilder()).append(s).append(adapter.getValueAt(j, first)).append(",").toString();
            if(second >= 0 && second <= 1)
                s = (new StringBuilder()).append(s).append(adapter.getValueAt(j, second)).append(";").toString();
        }

        adapter.close();
        return s;
    }

    public  String doforalldb(String sqlstr, boolean include, boolean quitif1wrong)
    {
        if(sqlstr == null || sqlstr.equals(""))
            return "";
        boolean dbwise;
        boolean bl = dbwise = sqlstr.indexOf("??UserId??") < 0;
        if(!dbwise)
            return "";
        sqlstr = sqlstr.replaceAll("\\\\?\\\\?CURRENT_TIME\\\\?\\\\?", (new StringBuilder()).append("").append(System.currentTimeMillis() / 1000L).toString());
        String sqls[] = sqlstr.split(";");
        int nn = 0;
         
        String olddb = "";
        JDBCAdapter oldada = null;
        JDBCAdapter newadapter = null;
        StringBuffer sb = new StringBuffer("");
        JDBCAdapter adapter = Toolbox.getUserAdapter(sysDBConnectInfo(),this.orgnum);  
        boolean b = adapter.executeQuery2((new StringBuilder()).append("SELECT distinct '',server,driver, dbuserid,dbpassword from DBOwner where   (not server='").append(adapter.server.trim()).append("')  order by server").toString(),false);
        ArrayList<DBConnectInfo> arr = new ArrayList();
        if (b)
        for(int i = 0; adapter.getValueAt(i, 0)!=null; i++)
        {
            arr.add(new DBConnectInfo(adapter.getValueAt(i, 1), adapter.getValueAt(i, 2), adapter.getValueAt(i, 3), adapter.getValueAt(i, 4),orgnum));
        }    
        if(include)
        {
            for(int j = 0; j < sqls.length; j++)
            {
                int m;
                if((m = adapter.executeUpdate(sqls[j])) < 0)
                sb.append("<tr><td>" + systemserver + "</td><td>" + sqls[j]+ "</td><td>" + m + "</td><td>" +  adapter.error()+ "</td></tr>");
            }

        }
        adapter.close();
        for (DBConnectInfo d: arr)
        {
            try{
            newadapter = Toolbox.getUserAdapter(d, this.orgnum); 
            if(newadapter != null && !newadapter.error().equals(""))
            {
                    sb.append("<tr><td>" + d.server + "</td><td>sql</td><td>-1</td><td>" +   newadapter.error() + "</td></tr>");
                    newadapter.close();
                    continue;
             }
                for(int j = 0; j < sqls.length; j++)
                {
                    int m;
                    String str = sqls[j];
                    if((m = newadapter.executeUpdate(str)) < 0)
                    {
                        sb.append("<tr><td>" + d.server + "</td><td>" + str + "</td><td>" + m + "</td><td>" + newadapter.error()+ "</td></tr>");
                        if (j == 0 && quitif1wrong)
                            break;
                    }
                }
                if(newadapter != null)
                newadapter.close();
             }
            catch(Exception e)
            {
                if(newadapter != null)
                newadapter.close();
                continue;
            }
            nn++;
        }
        return ( "<tr><td>orgnum</td><td>" + (orgnum%65536) + "</td><td>n</td><td>" +nn +  "</td></tr>" + sb);
    }

    static int countnewline(String str)
    {
        int x = 0;
        for(int i = 0; i < str.length(); i++)
            if(str.charAt(i) == '\n')
                x++;

        return x;
    }

    static void zipout(GZIPOutputStream gout, String s)
        throws IOException
    {
        if(s != null && !s.equals(""))
        {
            byte b[] = s.getBytes();
            gout.write(b, 0, b.length);
        }
    }

    public static String dbdataout(JDBCAdapter adapter, String sql, PrintWriter out, GZIPOutputStream zout, boolean needdef, boolean sqlscript)
    {
        boolean needzip = false;
        if(zout != null)
            needzip = true;
        try
        {
            if (sqlscript);
            else if(!needzip)
                out.print(adapter.dbms);
            else
                zipout(zout, adapter.dbms);
            Vector comp = new Vector();
            boolean states = true;
            int k = 0;
            int strleng = sql.length();
            for(int ii = 0; ii < strleng; ii++)
            {
                boolean bl;
                if(sql.charAt(ii) == '\'')
                    bl = states = !states;
                if(!states || sql.charAt(ii) != ';')
                    continue;
                if(ii > k)
                    comp.addElement(sql.substring(k, ii));
                k = ii + 1;
            }

            if(k < strleng)
                comp.addElement(sql.substring(k));
            int K = comp.size() / 2;
            StringBuffer fb = new StringBuffer(200);
 
            for(k = 0; k < K; k++)
            {
                if (sqlscript);
                else if(!needzip)
                    out.print(CSVseparator[2]);
                else
                    zipout(zout, CSVseparator[2]);
                String def = (String)comp.elementAt(2 * k + 1);
                def = (new StringBuilder()).append(def.trim().replaceAll("DISTINCT", "UNIQUE")).append("\n").toString();
                //String tn = ((String)comp.elementAt(2 * k)).replaceFirst(" .*", "");
                String str, tblname="";
                if (sqlscript)
                {
                    str = def;
                    int len  = def.indexOf("(");
                    tblname = def.substring(0,len).trim();
                    len = tblname.lastIndexOf(" ");
                    tblname = tblname.substring(len+1).trim();
                  
                }
                else if(needdef)
                {
                    str = (new StringBuilder()).append(CSVquote).append(def.replaceAll("'", "''")).append(CSVquote).toString();
                } 
                else
                {
                    int len = def.indexOf("("); 
                    str = def; 
                    if (len > 0) 
                    str = def.substring(0, len).replaceAll("'", "''");
                }
                if(!needzip)
                {
                    out.print(str);
                    if (sqlscript)
                        out.println(";");
                }
                else
                    zipout(zout, str);
               //adapter.needMetaInfo = true;
                String t = (String)comp.elementAt(2 * k); 
                if ( t.toLowerCase().trim().indexOf("select ")!=0 )
                    t = "SELECT * FROM " + t;  
               
                boolean b = adapter.executeQuery2(t, true); 
                
                if(b == false)
                    continue;
                int m = adapter.getColumnCount();
               
                int i = 0, q;
                boolean keepdoing = true;
                while( keepdoing )
                {
                    
                    for(int j = 0; j < m; j++)
                    {
                        String tv = adapter.getValueAt(i, j);
                        if(tv == null && j == 0 && adapter.cursor == -2)
                        {
                            keepdoing = false;
                            break;
                        }
                        if( j == 0 && tv!=null && tv.equals("NULL"))
                        {
                            break;
                        } 
                        if(tv != null && j == 0 & sqlscript)
                            out.print("INSERT INTO " + tblname  + " VALUES(");
                        q = (j==0)?1:0;
                        if(!needzip)
                        {
                            if (sqlscript)
                            {
                                if (j > 0)
                                    out.print(",");
                            }
                            else
                                out.print(CSVseparator[q]);
                        }
                        else
                            zipout(zout, CSVseparator[q]);
                        
                        if(tv == null)
                        {
                            if (sqlscript)
                                tv = "NULL";
                            else 
                                continue;
                        }
                        else if(!adapter.colIsNum[j] )
                        {
                            if (adapter.dbms.equals("mysql"))
                                    tv = new String(tv.getBytes(StandardCharsets.UTF_8),StandardCharsets.UTF_8);
                            tv =  CSVquote + tv.replaceAll(""+CSVquote , ""+CSVquote + CSVquote) + CSVquote;
                        }
                        
                        if(!needzip)
                        {
                            out.print(tv);
                        }
                        else
                            zipout(zout, tv);
                    }
                    if (sqlscript && keepdoing)
                    {
                        out.println(");");
                    }
                    if (keepdoing)
                    i++;
                }
            }

            return "";
        }
        catch(Exception e)
        {
            return e.toString();
        }
    }

    public static void cleardata(JDBCAdapter adapter)
    {
        boolean b = adapter.executeQuery2("select tname from Apptables",false);
        if(b == false || adapter.getValueAt(0, 0)==null)
            return;
        int NN = 0;
        ArrayList<String> xx = new ArrayList();
        for(int i = 0; adapter.getValueAt(i, 0)!=null; i++)
        {  
            xx.add( adapter.getValueAt(i, 0));
            NN++;
        }
        
        for(int i = 0; i < NN; i++)
        {
            if(!xx.get(i).equalsIgnoreCase("apptables"))
                adapter.executeUpdate((new StringBuilder()).append("drop table ").append(xx.get(i)).toString());
            adapter.executeUpdate((new StringBuilder()).append("delete from apptables where tname='").append(xx.get(i)).append("'").toString());
        }

    }

    public static boolean toNumeric(JDBCAdapter adapter, String tbl, String modifycolumn, String defaultstr)
    {
        if(tbl == null || tbl.equals(""))
            return false;
        if(modifycolumn == null || modifycolumn.equals(""))
            return false;
        if(defaultstr == null)
            defaultstr = "";
        String partsql = null;
        StringBuffer allnumsqls1 = new StringBuffer();
        StringBuffer allnumsqls2 = new StringBuffer();
        String mysqlv = modifycolumn;
        int sindex;
        int tindex;
        if((sindex = Toolbox.begintranslate(adapter.dbms)) != (tindex = Toolbox.begintranslate("mysql")))
            mysqlv = Toolbox.translate(mysqlv, sindex, tindex);
        String fields[] = mysqlv.trim().replaceFirst(",$", "").split("\\s*,\\s*");
        String def = adapter.tabledef(tbl, "mysql");
        int l;
        int m;
        for(int k = 0; k < fields.length; k++)
        {
            String parts[];
            if((parts = fields[k].split("[\\s]+")).length < 2)
                continue;
            int j = def.indexOf((new StringBuilder()).append(parts[0]).append(" ").toString());
            partsql = def.substring(j + parts[0].length() + 1).replaceFirst("\\s+", "").toUpperCase();
            String defaultv;
            if((j = defaultstr.lastIndexOf((new StringBuilder()).append("\n").append(parts[0]).append("=").toString())) > 0)
            {
                if((l = defaultstr.indexOf("\n", j + 2)) == -1)
                    l = defaultstr.length();
                if((defaultv = defaultstr.substring(j + 2 + parts[0].length(), l).trim()).indexOf("??CURRENT_TIME??") >= 0)
                    defaultv = defaultv.replaceFirst("\\?\\?CURRENT_TIME\\?\\?", (new StringBuilder()).append("").append(System.currentTimeMillis() / 1000L).toString());
            } else
            {
                defaultv = "0";
            }
            if(partsql.indexOf("TEXT") != 0 && partsql.indexOf("VARCHAR") != 0 && partsql.indexOf("CHAR") != 0 || !parts[1].equals("BIGINT") && !parts[1].equals("DOUBLE") && !parts[1].equals("SMALL"))
                continue;
            boolean b = adapter.executeQuery2((new StringBuilder()).append("SELECT n, ").append(parts[0]).append(" FROM ").append(tbl).toString(),false);
           
            for(m = 0; b && adapter.getValueAt(m, 1)!=null; m++)
            {
                try
                {
                    double dump = Double.parseDouble(adapter.getValueAt(m, 1));
                    continue;
                }
                catch(Exception e) { }
                if(allnumsqls1.length() > 0)
                    allnumsqls1.append(",");
                if(defaultv.replaceAll("[0-9|\\.]", "").trim().equals(""))
                {
                    allnumsqls1.append((new StringBuilder()).append("UPDATE ").append(tbl).append(" SET ").append(parts[0]).append("='").append(defaultv).append("' WHERE n=").append(adapter.getValueAt(m, 0)).toString());
                    continue;
                }
                allnumsqls1.append((new StringBuilder()).append("UPDATE ").append(tbl).append(" SET ").append(parts[0]).append("='0' WHERE n=").append(adapter.getValueAt(m, 0)).toString());
                if(allnumsqls2.length() > 0)
                    allnumsqls2.append(",");
                allnumsqls2.append((new StringBuilder()).append("UPDATE ").append(tbl).append(" SET ").append(parts[0]).append("=").append(defaultv).append(" WHERE n=").append(adapter.getValueAt(m, 0)).toString());
            }

        }

        String allnumsqls1s[] = null;
        String allnumsqls2s[] = null;
        if(allnumsqls1.length() > 0)
            allnumsqls1s = allnumsqls1.toString().split(",");
        if(allnumsqls2.length() > 0)
            allnumsqls2s = allnumsqls2.toString().split(",");
        boolean b = false;
        l = 0;
        do
        {
            if(l >= 2)
                break;
            String modifycolumns[] = null;
            modifycolumns = l != 0 ? (new StringBuilder()).append("ALTER TABLE ").append(tbl).append(" ALTER COLUMN ").append(modifycolumn.replaceAll(",", (new StringBuilder()).append(",ALTER TABLE ").append(tbl).append(" ALTER COLUMN ").toString())).toString().split(",") : (new StringBuilder()).append("ALTER TABLE ").append(tbl).append(" MODIFY COLUMN ").append(modifycolumn.replaceAll(",", (new StringBuilder()).append(",ALTER TABLE ").append(tbl).append(" MODIFY COLUMN ").toString())).toString().split(",");
            m = modifycolumns.length;
            if(allnumsqls1s != null)
                m += allnumsqls1s.length;
            if(allnumsqls2s != null)
                m += allnumsqls2s.length;
            String alltrans[] = new String[m];
            if(allnumsqls1s != null)
            {
                m = allnumsqls1s.length;
                for(int j = 0; j < m; j++)
                    alltrans[j] = allnumsqls1s[j];

            } else
            {
                m = 0;
            }
            for(int j = 0; j < modifycolumns.length; j++)
                alltrans[j + m] = modifycolumns[j];

            if(allnumsqls2s != null)
            {
                for(int j = 0; j < allnumsqls2s.length; j++)
                    alltrans[j + m + modifycolumns.length] = allnumsqls2s[j];

            }
            for(int j = 0; j < alltrans.length; j++)
                Toolbox.println(0, alltrans[j]);

            try
            {
                b = adapter.transacte(alltrans, 0, m);
            }
            catch(Exception e) { }
            if(b)
                break;
            l++;
        } while(true);
        if(!b)
            return false;
        String sql1 = (new StringBuilder()).append("SELECT insertQuery,updateQuery FROM Task where name='").append(tbl).append("'").toString(); 
        if(adapter.executeQuery2(sql1,false) && adapter.getValueAt(0, 0) != null)
        {
            String insertQ = adapter.getValueAt(0, 0);
            String updateQ = adapter.getValueAt(0, 1);
            String fl[] = adapter.fieldList(tbl);
            adapter.needMetaInfo = true;
            b = adapter.executeQuery2((new StringBuilder()).append("SELECT * FROM ").append(tbl).append(" where n=0").toString(),true);
            if (b)
            for(int k = 2;  k < adapter.getColumnCount(); k++)
                if(adapter.colIsNum[k])
                {
                    insertQ = insertQ.replaceFirst((new StringBuilder()).append("'\\?\\?").append(fl[k]).append("\\?\\?'").toString(), (new StringBuilder()).append("??").append(fl[k]).append("??").toString());
                    updateQ = updateQ.replaceFirst((new StringBuilder()).append("'\\?\\?").append(fl[k]).append("\\?\\?'").toString(), (new StringBuilder()).append("??").append(fl[k]).append("??").toString());
                } else
                {
                    insertQ = insertQ.replaceFirst((new StringBuilder()).append("([^'])\\?\\?").append(fl[k]).append("\\?\\?").toString(), (new StringBuilder()).append("$1'??").append(fl[k]).append("??'").toString());
                    updateQ = updateQ.replaceFirst((new StringBuilder()).append("([^'])\\?\\?").append(fl[k]).append("\\?\\?").toString(), (new StringBuilder()).append("$1'??").append(fl[k]).append("??'").toString());
                }

            m = adapter.executeUpdate((new StringBuilder()).append("UPDATE Task SET  insertQuery = '").append(insertQ.replaceAll("'", "''")).append("', updateQuery='").append(updateQ.replaceAll("'", "''")).append("' WHERE name='").append(tbl).append("'").toString());
        }
        return b;
    }

    private static void starth2() throws  Exception {
        Class.forName("org.h2.Driver");
        Server.createTcpServer("-tcpPort", "9092", "-tcpAllowOthers").start();
         
    }

    private static void stoph2() throws  Exception {
        Class.forName("org.h2.Driver");
        Server.shutdownTcpServer("tcp://localhost:9092", "", true, true);
    }

 

}

