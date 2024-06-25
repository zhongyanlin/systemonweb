package telaman;
import java.io.File;
import java.io.Serializable;
import java.util.Enumeration;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import telaman.DBAdmin;
import telaman.DBConnectInfo;
import telaman.JDBCAdapter;
import telaman.Sha1;
import telaman.Toolbox;

public class User
implements Serializable {
    public int orgnum=-1;
    public String id = "";
    public String iid = null;
    public String password = Toolbox.appname;
    public String firstname = "";
    public String middlename = "";
    public String lastname = "";
    public String webFileFolder = "";
    public String department = "";
    public String keys = "";
    //public int langnum = 0;
    public int fontsize = Toolbox.defaultFontSize;
    public String websitename = null;
    public long roles = 0;
    public String subdb = null;
    public DBConnectInfo dbinfo = Toolbox.dbadmin[0].sysDBConnectInfo();
    public String timeformat = "MM/DD/YY hh:mm";
    public String err = "";
    public boolean mydb = false;
    public String sessionid = "";
    public int flags = 0; 
    public long lastbackup = -1;
    public int backupperiod = -1;
    public boolean login(int i) {
        boolean bb;
        orgnum = i;
        JDBCAdapter adapter = Toolbox.getSysAdapter(i);
         
        String ss = "SELECT roles,firstname, middlename, lastname,webFileFolder,department,password, fontsize,id,websitename,logincount  FROM AppUser WHERE id='" + this.id.replaceAll("'", "''") + "' or email='" + this.id.replaceAll("'", "''") + "'";
        int n = 0;
        boolean b = adapter.executeQuery2(ss,false);
        this.err = adapter.error();
        String rolestr = null;
        if (b) rolestr = adapter.getValueAt(0,0);
        boolean bl = bb = (rolestr!=null);
        if (!bb) {
            this.err = Toolbox.emsgs(orgnum,115);
        } 
        else 
        {
            if ( ( Systemroles.SYSTEMADMIN ) > 0 && adapter.getValueAt(0, 6).equals(""))
            {
                bb = true;
                password = "";
            }
            else
            {
                
                String tt = Sha1.hash(this.sessionid + adapter.getValueAt(0, 6));
                 
                bb = tt.equals(this.password);
            }
            if (adapter.getValueAt(0, 6).equals("")) bb = true;
        }
        if (bb) 
        {
            try 
            {
                this.roles = Long.parseLong(rolestr);
            }
            catch (Exception e) {
                this.roles = 0;
            }
            this.id = adapter.getValueAt(0, 8);
            this.firstname = adapter.getValueAt(0, 1);
            this.middlename = adapter.getValueAt(0, 2);
            this.lastname = adapter.getValueAt(0, 3);
            this.webFileFolder = adapter.getValueAt(0, 4);
            this.department = adapter.getValueAt(0, 5);
            if (this.roles == 0 || (this.roles & Systemroles.TOTAL) == 0) {
                this.fontsize = Toolbox.defaultFontSize;
            } else {
                try {
                    this.fontsize = Integer.parseInt(adapter.getValueAt(0, 7));
                }
                catch (Exception e) {
                    this.fontsize = Toolbox.defaultFontSize;
                }
            }
            if (this.webFileFolder == null) {
                this.webFileFolder = "";
            }
            int j = i%65536;
            if (this.roles != 1 && this.webFileFolder.equals("/") && Toolbox.dbadmin[j].webFileFolder != null 
                    && !Toolbox.dbadmin[j].webFileFolder.equals("")) {
                this.webFileFolder = Toolbox.dbadmin[j].webFileFolder + File.separator + this.id;
            }
            if ((this.webFileFolder.equals("/")) && (this.roles & 1) > 0
                    && Toolbox.dbadmin[j].webFileFolder1 != null && !Toolbox.dbadmin[j].webFileFolder1.equals("")) {
                this.webFileFolder = Toolbox.dbadmin[j].webFileFolder1 + File.separator + this.id;
            }
            if ( (roles & Systemroles.SYSTEMADMIN) > 0)
            {
                java.nio.file.Path path = java.nio.file.Paths.get(this.webFileFolder + File.separator + "sampleFile.txt");
                boolean  bool =  java.nio.file.Files.isWritable(path);
                if (java.nio.file.Files.exists(path) && !bool)
                {
                    webFileFolder = System.getProperty("user.home") + File.separator + "tlmtemp";
                    (new File(webFileFolder)).mkdir();
                }
            }
            this.websitename = adapter.getValueAt(0, 9);
            String logincout = adapter.getValueAt(0, 10);
            int ii = 0; try{ii = Integer.parseInt(logincout);}catch(Exception e){}
          
            if ( ii < 10 && ( (roles & Systemroles.INSTRUCTOR ) > 0 || (roles & Systemroles.SYSTEMADMIN) > 0 || (roles & Systemroles.TEACHINGADMIN ) > 0))
            {
                flags =  flags | 1;
            }
           
            //n = adapter.executeUpdate("UPDATE AppUser SET lastupdate=" + (System.currentTimeMillis() / 1000) + ",logincount=" + (ii+1) + " WHERE id='" + this.id.replaceAll("'", "''") + "'");
            //if (this.roles > 1 &&   adapter.executeQuery2("SELECT timeformat FROM DBOwner where id='" + this.id.replaceAll("'", "''") + "'",false) && adapter.getValueAt(0, 0)!=null ) {
            //    this.timeformat = adapter.getValueAt(0, 0);
            //}
        } 
        else if (this.err!=null && !this.err.equals(""))
        {
            this.err = Toolbox.emsgs(orgnum,116);
        }
        adapter.close();
        this.dbinfo = Toolbox.dbadmin[orgnum%65536].sysDBConnectInfo();
        this.mydb = false;
        this.subdb = null;
         
        return bb;
    }

    public DBConnectInfo getDBConnectInfo() {
        return this.dbinfo;
    }

    public User(int i) 
    {
        if (i<0)i=0;
        this.mydb = false;
        orgnum = i;
        this.timeformat = Toolbox.timeformat[orgnum>>16];
        this.dbinfo = Toolbox.dbadmin[i%65536].sysDBConnectInfo();
    }

    public User(int o, String i, String p, long r, DBConnectInfo d, String t) {
        this.orgnum = o;
        this.id = i;
        this.password = p;
        this.roles = r;
        this.timeformat = t;
        if (d != null) 
            this.dbinfo = new DBConnectInfo(d);
        else
            this.dbinfo = Toolbox.dbadmin[o%65536].sysDBConnectInfo(); 
        this.mydb = false;
       // langnum = Toolbox.langnum;
    }

    public boolean changedb(String dd) {
        this.mydb = false;
        this.subdb = null;
        boolean bb = true;
        if (dd == null || dd.equals("")) 
        {
            this.dbinfo = Toolbox.dbadmin[orgnum%65536].sysDBConnectInfo();
            if (this.timeformat.equals("")) 
            {
                this.timeformat = Toolbox.timeformat[orgnum>>16];
            }
        } 
        else 
        {
            dd = Toolbox.validate(dd, null, 20);
            this.dbinfo  = Toolbox.dbadmin[orgnum%65536].dbinfocache.get(dd);
            if (this.dbinfo  == null)
            {
                JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
                String sql1 = "SELECT server,driver, dbuserid, dbpassword, timeformat FROM DBOwner WHERE id='" + dd + "'";
                int nb = adapter.executeQuery(sql1);
                if (nb == 1) 
                {
                    this.dbinfo = new DBConnectInfo(adapter.getValueAt(0, 0), adapter.getValueAt(0, 1), adapter.getValueAt(0, 2), adapter.getValueAt(0, 3),adapter.orgnum);
                    if (this.dbinfo.user == null || this.dbinfo.user.equals("")) 
                    {
                        if (Toolbox.dbadmin[orgnum%65536].ownpassword) 
                        {
                            this.dbinfo.user = this.id;
                            this.dbinfo.password = this.password;
                        } else 
                        {
                            this.dbinfo.user = Toolbox.dbadmin[orgnum%65536].systemuser;
                            this.dbinfo.password = Toolbox.dbadmin[orgnum%65536].systempassword;
                        }
                    }
                    this.mydb = dd.equals(this.id) && !Toolbox.dbadmin[orgnum%65536].systemserver.equals(this.dbinfo.server);
                    this.subdb = dd;
                    synchronized(this){Toolbox.dbadmin[orgnum%65536].dbinfocache.put(dd, this.dbinfo);}
                } 
                else 
                {
                    this.dbinfo = Toolbox.dbadmin[orgnum%65536].sysDBConnectInfo();
                    this.err = adapter.error();
                    this.mydb = false;
                    this.subdb = null;
                    bb = false;
                }
                adapter.close();
                
            }
            else
            {
                this.mydb = dd.equals(this.id) && !Toolbox.dbadmin[orgnum%65536].systemserver.equals(this.dbinfo.server);
                this.subdb = dd; 
            }
        }
        return bb;
    }

    public static boolean setAttribute(int orgnum, String uid, String att, String val) {
        JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
        int n = adapter.executeUpdate("UPDATE AppUser SET " + att + "='" + val.replaceAll("'", "''") + "' WHERE id='" + uid.replaceAll("'", "''") + "'");
        adapter.close();
        return n == 1;
    }

    public static String[] getAttribute(int orgnum, String uid, String[] att) {
        int n;
        if (att == null || att.length == 0) {
            return null;
        }
        JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
        String sql = "SELECT ";
        for (int i = 0; i < att.length; ++i) 
        {
            sql = sql + att[i];
            if (i >= att.length - 1) continue;
            sql = sql + ",";
        }
        sql = sql + " FROM AppUser WHERE id='" + uid.replaceAll(",", "' OR id='") + "'";
        if ( adapter.executeQuery2(sql,false)==false ) 
        {
            adapter.close();
            return null;
        }
        
        int k = 0;
        java.util.ArrayList<String> y = new java.util.ArrayList(); 
        for (int j = 0; adapter.getValueAt(j,0)!=null; ++j) 
        {
            for (int i2 = 0; i2 < att.length; ++i2) 
            {
                y.add(adapter.getValueAt(j,i2));
            }
            
        }
        adapter.close();
        String[] ans = new String[y.size()];
        for (int j = 0; j < ans.length; ++j) 
            ans[j] = y.get(j);
        return ans;
    }

    public boolean retr() {
        boolean bb;
        if (orgnum ==-1) return false;
        JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
        boolean b = adapter.executeQuery2("SELECT  roles,firstname, middlename, lastname, password,webFileFolder,department,fontsize,id,websitename,Userkeys.lastbackup,Userkeys.backupperiod   FROM AppUser LEFT JOIN Userkeys on AppUser.id=Userkeys.uid WHERE AppUser.id='" + this.id.replaceAll("'", "''") + "'",false);
        
         
        bb = (b && adapter.getValueAt(0, 0)!=null) && adapter.getValueAt(0, 8).toLowerCase().equals(this.id.toLowerCase());
        if (bb) {
            try {
                this.roles = Long.parseLong(adapter.getValueAt(0, 0));
            }
            catch (Exception e) {
                this.roles = 0;
            }
            this.firstname = adapter.getValueAt(0, 1);
            this.middlename = adapter.getValueAt(0, 2);
            this.lastname = adapter.getValueAt(0, 3);
            this.password = adapter.getValueAt(0, 4);
            this.webFileFolder = adapter.getValueAt(0, 5);
            this.department = adapter.getValueAt(0, 6);
            this.fontsize = Toolbox.defaultFontSize;
            if (this.webFileFolder == null) {
                this.webFileFolder = "";
            }
            if (this.webFileFolder.equals("/")) 
            {
                this.webFileFolder = (this.roles > 1 && Toolbox.dbadmin[orgnum%65536].webFileFolder != null && !Toolbox.dbadmin[orgnum%65536].webFileFolder.equals("")) ? 
                        Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + this.id 
                        : ((this.roles & 1) == 1 && Toolbox.dbadmin[orgnum%65536].webFileFolder1 != null && !Toolbox.dbadmin[orgnum%65536].webFileFolder1.equals("") ? 
                         Toolbox.dbadmin[orgnum%65536].webFileFolder1 + File.separator + this.id : 
                        "");
            }
            
            try {
                this.fontsize = Integer.parseInt(adapter.getValueAt(0, 7));
            }
            catch (Exception e) {
                // empty catch block
            }
            this.websitename = adapter.getValueAt(0, 9);
            try{
            this.lastbackup = Long.parseLong(adapter.getValueAt(0, 10));
            this.backupperiod = Integer.parseInt(adapter.getValueAt(0, 10));
            }catch(Exception e){}
        }
        this.err = adapter.error();
        adapter.close();
        this.mydb = false;
        this.subdb = null;
        return bb;
    }

    

    public String error() {
        return this.err;
    }

    public void delete() {
        JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
        boolean b = adapter.executeQuery2("SELECT dbms, server  FROM DBOwner WHERE id='" + this.id + "'",false);
        if (b && adapter.getValueAt(0,0)!=null) {
            Toolbox.dbadmin[orgnum%65536].removeDB(adapter.getValueAt(0, 0), adapter.getValueAt(0, 1));
        }
        if (this.roles == 1) {
            adapter.executeUpdate("DELETE FROM Student WHERE id='" + this.id + "'");
        } else {
            adapter.executeUpdate("DELETE FROM DBOwner WHERE id='" + this.id + "'");
            adapter.executeUpdate("DELETE FROM Faculty WHERE id='" + this.id + "'");
        }
        adapter.executeUpdate("DELETE FROM AppUser WHERE id='" + this.id + "'");
        adapter.close();
    }

    public static void dberrorRelogin(ServletContext application, HttpSession session, HttpServletRequest request, HttpServletResponse response, String pagex) {
        session.setAttribute("Unfulfiled",  pagex);
        try {
            int orgnum = Toolbox.setcharset(request, response);
            if (orgnum == -1) return;
            CachedStyle cachedstyle = new CachedStyle(request, orgnum);
            RequestDispatcher dispat = application.getRequestDispatcher("/login.jsp?error=" + Toolbox.emsgs(orgnum,123) + "&follow=U");
            dispat.forward((ServletRequest)request, (ServletResponse)response);
        }
        catch (Exception e) {
            // empty catch block
        }
    }

    public static User authorize(int orgnum, long designed, ServletContext application, HttpSession session, HttpServletRequest request, HttpServletResponse response, String pagex, boolean carry) {
        Object current = session.getAttribute("User");
        String pagex0 = pagex;
        if (current != null) 
        {
            User user = (User)current;
            boolean b1 = orgnum!=-1 && (orgnum%35536)!=(user.orgnum%35536);
            boolean b2 = (user.roles & designed)==0; 
          
            if (b1 || b2) 
            {
                if(b1)session.removeAttribute("User");
                try {
                    RequestDispatcher dispat = application.getRequestDispatcher("/unauthorize.jsp?roles=" + designed);
                    dispat.forward((ServletRequest)request, (ServletResponse)response);
                }
                catch (Exception e) {
                    // empty catch block
                }
                return null;
            }
            user.orgnum = (user.orgnum%65536) + ((orgnum>>16)<<16);
             
            return user;
        }
         
        boolean isget = request.getMethod().equals("GET");
        int i = 0;
        boolean targetisself = false; 
         
         
         for (java.util.Enumeration e = request.getParameterNames() ; e.hasMoreElements() ;) 
         {
           String na = (String)(e.nextElement());
           if (na==null || na.equals("1")) continue;
           String va =  Toolbox.defaultParam(orgnum,request,na,null);
           if (va == null) { continue;}
           if (na.equals("targetisself"))targetisself=true;
           if (i==0) 
               pagex += "?" + na + "=" + Toolbox.urlencode(va);
           else
               pagex += "&" + na + "=" + Toolbox.urlencode(va);
           i++;
         }
             
 
        try 
        {
            String gotopage = "";
            if (orgnum==-1) 
                gotopage = "/index.jsp";
            else if (!isget && !targetisself)
            {
                gotopage = "/login.jsp?error=generic&orgnum=" + orgnum + "&follow=R";
            }
            else
            {
                session.setAttribute("Unfulfiled", (Object)pagex);
                gotopage = "/login.jsp?error=generic&follow=U&orgnum=" + orgnum;
            }
            RequestDispatcher dispat = application.getRequestDispatcher(gotopage);
            dispat.forward((ServletRequest)request, (ServletResponse)response);
        }
        catch (Exception e) 
        {
            // empty catch block
        }
        return null;
    }
    public static void freelogin(HttpServletRequest request)
    {
         String url;
         if  ((url = request.getRequestURL().toString()).indexOf("//localhost")>0 || url.indexOf("//127.0.0.1")>0) 
         {
            String cookieValue = Toolbox1.GetCookie(request,"oldid");
            String orgnum = Toolbox1.GetCookie(request,"orgnum");
            if (cookieValue != null){
            int kk =0;
            try{ kk = Integer.parseInt(orgnum);}catch(Exception e){}
            User user =  new User(kk); 
            user.id = cookieValue;
            if (user.retr())
            request.getSession(true).setAttribute("User", user);
         }
         }
    }
    public static User dbauthorize(ServletContext application, HttpSession session, HttpServletRequest request, HttpServletResponse response, String pagex, boolean carry) {
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum == -1) return null;
        //CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        User user = User.authorize(orgnum, -1, application, session, request, response, pagex, carry);
        if (user == null) {
            return null;
        }
         
        if ((user.roles & 8) > 0 || user.mydb || user.changedb(user.id)) {
            return user;
        }
        return null;
    }
    
    public String del()
    {
        DBAdmin dbadmin = Toolbox.dbadmin[orgnum%65536];
        if (webFileFolder.equals("/") && dbadmin.webFileFolder!=null)
        {
            String f = dbadmin.webFileFolder + File.separator + id;
            LongFilePro.deldir(new File(f));
        } 
        String ws = websitename;
        if (ws==null) ws = id;
        if (dbadmin.websiteFolder != null && !dbadmin.websiteFolder.equals(""))
        {
            String f = dbadmin.websiteFolder + File.separator + ws;
            LongFilePro.deldir(new File(f));
        } 
        JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
        String server="",driver = null;
        String err = "";
        String sql = "SELECT id,server,driver FROM DBOwner WHERE server in (SELECT server FROM DBOwner WHERE id='" + id + "'))";
        if (adapter.executeQuery(sql) == 1)
        {
            server = adapter.getValueAt(0,1);
            driver = adapter.getValueAt(0,2);
        }
        adapter.close();
        if (driver!=null)
        {
            int k = 0;
            DBHost dbhost = null;
            for (k=0; k < dbadmin.dbhost.length; k++)
            {
                dbhost = dbadmin.dbhost[k];
                if (dbhost.driver.equals(driver)) break;
            }
            if (k < dbadmin.dbhost.length)
            {
                if (dbhost.host.charAt(dbhost.host.length()-1)!= '/'
                       && dbhost.host.charAt(dbhost.host.length()-1)!= '\\')
                dbhost.host += File.separator;    
                String man = dbhost.host +  dbhost.admindb;
                int i = server.lastIndexOf("/");
                int j = server.lastIndexOf("\\");
                if (j > i) i = j;
                server = server.substring(i+1);
                j = server.indexOf("?");
                if (j> -1) server = server.substring(0,j);
                java.sql.Statement stmt= null;
                java.sql.Connection conn = null;
                try{
                    Class.forName(driver);
                     conn = java.sql.DriverManager.getConnection(man, dbhost.uid, dbhost.password);
                    stmt = conn.createStatement();
                    sql  = "DROP DATABASE " + server; 
                    stmt.executeUpdate(sql);
                }catch(java.sql.SQLException se){
                     err = se.toString();
                }catch(Exception e){
                     err = e.toString();
                }
                finally
                {
                    try{
                             if(stmt!=null)
                                conn.close();
                      }catch(java.sql.SQLException se){  err = se.toString(); } 
                    try{
                        if(conn!=null)
                            conn.close();
                    }catch(java.sql.SQLException se){ err = se.toString(); } 
                   
                }
            }
        }
        return err;
    }
    
}
