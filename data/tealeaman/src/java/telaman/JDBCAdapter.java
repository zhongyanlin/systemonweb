 
package telaman;

import com.microsoft.jdbc.sqlserver.SQLServerDriver;
import java.io.*;
import java.sql.*;
import java.util.*;
import java.util.concurrent.Semaphore;
import oracle.jdbc.driver.OracleDriver;
 

class DeleteFile extends Thread
{
    ArrayList<String> att;
    int orgnum;
    public DeleteFile(ArrayList<String> x, int orgnum)
    {
        att = x;
        this.orgnum = orgnum;
    }
    public void run()
    {
        Encode6b encoder = new Encode6b(orgnum);
        for (int k=0; k < att.size(); k++)
        {
            if (att.get(k) == null || att.get(k).equals("")) continue;
            String ta[] = Toolbox1.unzip(att.get(k)).replaceFirst(",$", "").split(",");
            for (int ll=0; ll < ta.length; ll++)
            {
                try{
                String path = encoder.rto6b(ta[ll].replaceFirst("[^@]+@[0-9]+@", ""));
                (new java.io.File(path)).delete();
                }catch(Exception er){}
            }
        }
    }
}


public class JDBCAdapter {
    Connection connection = null;
    Statement statement = null;
    public ResultSet resultSet = null;
    public ResultSetMetaData metaData = null;
    DatabaseMetaData dmd = null;
    StringBuffer errormsg = new StringBuffer(150);
    boolean debug = true;
    String dburl = null;
    public String[] columnNames = new String[0];
    public String[][] rows = null;
    public boolean[] colIsNum = new boolean[0];
    public int[] colSizes = new int[0];
    public int[] colNullable = new int[0];
    private int numberOfColumns = 0;
    int numberOfRows = 0;
    PrintStream ps = null;
    PrintWriter pw = null;
    public int orgnum = -1;
    char output;
    public String dbms = "access";
    public String status = "broken";
    public int cursor = 0;
    public boolean needMetaInfo = false;
    public String server,driver,username,password;
    public static TreeSet<String> dburls = new TreeSet<String>();
    byte mode = 0;
    Semaphore mutex;
    
    public int executeQuery1(String query, PrintWriter out, Webform w, String rsakeys, int starting) 
    {
        try 
        {
            if (this.resultSet != null) 
            {
                this.resultSet.close();
                this.resultSet = null;
            }
         } catch(Exception e){}
        if (dbms.equals("mysql") || dbms.contains("maria")) {
            query = query.replaceAll("\\\\", "\\\\\\\\");
        } else if (dbms.equals("h2")) {
            query = query.replaceAll(" mod ", " % ");
        }
        mode = 1;
        errormsg.setLength(0);
        resultSet = null;
        numberOfColumns = 0;

        if (connection == null || statement == null) {
            println(Toolbox.emsg(127));
            return -1;
        }
        if (query == null || query.length() < 6) {
            println("wrong query:" + query);
            return -1;
        }
        String ss = query.substring(0, 4).toLowerCase();
        if (ss.equals("sele") == false && ss.equals("show") == false) {
            try {
               
                int i = statement.executeUpdate(Webform.mysql2c(dbms, query));
                if (i == -1) {
                    println("error");
                }
                return i;
            } catch (SQLException ex) {
                // println(query);
                println(ex.toString());
                return -1;
            }
        }
        int row = 0;
        try {
            resultSet = statement.executeQuery(Webform.mysql2c(dbms, query));
        } catch (SQLException ex) {
            println("error:");
            println(ex.toString());
            return -1;
        }
        if (resultSet == null) {
            return -1;
        }
 
        if (w.attrs == null) {
            String[] ft = new String[3];
            Task.extratAttr(resultSet, ft);
 
            w.attrs = ft[2].split(",");
            try {

                if (w.fields == null) {
                    w.fields = ft[0].split(",");
                    w.ctypes = ft[1].split(",");
                }
                if (w.defaultv == null) {
                    w.extractDefaultv(false);
                }
                if (w.labels == null) {
                    w.labels = ft[0].split(",");

                }
            } catch (Exception ex) {
            }
            Webform x = (Webform) (Generic.storedProc.get(w.name));
            if (x != null) {
                x.attrs = new String[w.fields.length];
                copy2(x.attrs, w.attrs);
                if (x.fields == null) {
                    x.fields = new String[w.fields.length];
                    copy2(x.fields, w.fields);
                    x.ctypes = new String[w.fields.length];
                    copy2(x.ctypes, w.ctypes);
                }
                if (x.defaultv == null) {
                    x.defaultv = new String[w.fields.length];
                    copy2(x.defaultv, w.fields);
                }
                if (x.labels == null) {
                    x.labels = new String[w.fields.length];
                    copy2(x.labels, w.labels);
                }
            }
        }
        if (out == null) {
            return -1;
        }

        if (w.ctypes.length > w.attrs.length) {
            out.print("<script  type=text/javascript>var pubkeys='';var mat=[];</script>");
            println("incorrect sql");
            return -1;
        } 

        numberOfColumns = w.ctypes.length;
        out.print("<script>var pubkeys='");
       
        for (int column = 0; column < numberOfColumns; column++) {
            
            if (column > 0) {
                out.print(",");
            }
            out.print(w.attrs[column]);
            out.print(w.ctypes[column]);
        }
        out.print("';var mat=[");
        int mnumrows = maxrows(w.format);
        while (row < mnumrows + starting) {
            try {
                if (resultSet.next() == false) {
                    break;
                }
            } catch (Exception ex) {
                println(ex.toString());
                break;
            }
            if (row < starting) {
                row++;
                continue;
            }

            if (row > starting) {
                out.print(",");
            }
            out.print("[");
            for (int i = 0; i < numberOfColumns; i++) {
                int j = i;
                //if (w.orders!=null) j=w.orders[i];
                String rs = null;
                try {
                    
                    rs = resultSet.getString(j + 1);
                    
                } catch (Exception ex) {
                }
                if (rsakeys == null || rsakeys.equals("")) {
                    if (rs != null) {
                        if (w.fields[j].toLowerCase().indexOf("attach")>=0)
                        out.print("\"" + Generic.handle4(rs,orgnum) + "\"");
                        else
                        out.print("\"" + Generic.handle1(rs) + "\"");
                    } else {
                        out.print("null");
                    }
                } else {
                    if (rs != null) {
                        out.print("\"" + Toolbox.encrypt(rs, rsakeys, orgnum>>16 ) + "\"");
                    } else {
                        out.print("null");
                    }
                }
                if (i == numberOfColumns - 1) {
                    out.print("]");
                } else {
                    out.print(",");
                }
            }
            row++;
        }

        if (row == starting + mnumrows) {
            out.print("];var nextpageurl='" + w.format + ":" + w.name + "';</script>");
        } else {
            out.print("];var nextpageurl='';</script>");
        }
        if (resultSet != null) {
            try {
                resultSet.close();
                resultSet = null;
            } catch (Exception e) {
            }
        }

        return row;
    }
    public static int maxrows(String format) {
        if (format.equals("Table") || format.equals("LognForm")) {
            return 150;
        }
        return 65535;
    }
    static public void main1(String [] args)
    {
      String d = "sun.jdbc.odbc.JdbcOdbcDriver";
       String s = "jdbc:odbc:Driver={Microsoft Access Driver (*.mdb)};DBQ=C:/project/gfc/dbFileFolder/tlm.mdb";
        String u = "";
        String p = "";
        JDBCAdapter adapter = new JDBCAdapter(s,d,u,p,0);
        adapter.executeQuery2("select * from AppUser",false);
        adapter.close();
    }
    public static void main(String[] args) {
        String user = "";
        String pass = "";
        String server = "jdbc:mysql://localhost:3306/test";
        user = "root";
        pass = "tomcat";
        String driver = "com.mysql.jdbc.Driver";
        String sql = "SELECT objective FROM Course";
        JDBCAdapter.testit(server, driver, user, pass, sql,0);
    }

    static void testit2(String server, String driver, String user, String pass, int orgnum) {
        JDBCAdapter adapter = new JDBCAdapter(server, driver, user, pass, System.out,  orgnum);
        String sql0 = "CREATE TABLE Student(id VARCHAR(10), name VARCHAR(30))";
        String sql1 = "INSERT INTO Student(id) VALUES('D10012345');";
        String sql = "SELECT * FROM Student";
        int x = adapter.executeUpdate(sql1);
        Toolbox.println(0, "number of records of affected = " + x);
        boolean bx = adapter.executeQuery2(sql,false);
        Toolbox.println(0, "number of records of retrived = " + bx);
        adapter.print();
        adapter.println(adapter.error());
        adapter.close();
    }

    public String dbname() {
        String tt = this.url();
        if (this.dbms.equals("sqlserver")) {
            int k = tt.indexOf("DATABASENAME");
            return tt.substring(k + 13).replaceFirst(";.*", "");
        }
        if (this.dbms.contains("maria") ||this.dbms.equals("mysql") || this.dbms.equals("access") || this.dbms.equals("h2") || this.dbms.equals("postgres")) {
            return tt.replaceFirst("(.*)[:|/]([a-z|A-Z|0-9]+$)", "$2");
        }
        if (this.dbms.equals("derby")) {
            return tt.replaceFirst(".*/([a-z|A-Z|0-9]+);.*", "$1");
        }
        return tt;
    }

    static void testit(String server, String driver, String user, String pass, String sql, int orgnum) {
        JDBCAdapter adapter = new JDBCAdapter(server, driver, user, pass, System.out, orgnum);
        boolean b = adapter.executeQuery2("select id from AppUser", true);
        int i = 0;String x;
        for (; (x = adapter.getValueAt(i, 0))!=null; i++)
            System.out.println(x);
        adapter.close();
    }

    public String error() {
        return Toolbox.removescript(this.errormsg.toString());
    }
    public boolean isDbConnected() {
    final String CHECK_SQL_QUERY = "SELECT 1";
    boolean isConnected = false;
    try {
        PreparedStatement statement =  connection.prepareStatement(CHECK_SQL_QUERY);
        isConnected = true;
    } catch (SQLException   e) {
        // handle SQL error here!
    }
    return isConnected;
}
    public String dbInfo() {
        try {
            DatabaseMetaData dm = this.connection.getMetaData();
            this.dbms = dm.getDatabaseProductName().toLowerCase();
            return dm.getDatabaseProductName() + "\n" + dm.getDriverVersion() + "\n" + dm.getURL() + "\n" + dm.getUserName();
        }
        catch (Exception e) {
            return e.toString();
        }
    }

    public JDBCAdapter(PrintWriter out) {
        String server = "jdbc:oracle:thin:@167.21.180.26:1521:oracledb";
        String user = "scott";
        String pass = "tiger";
        String driver = "oracle";
        server = "jdbc:odbc:public";
        driver = "sun.jdbc.odbc.JdbcOdbcDriver";
        this.pw = out;
        this.output = 119;
        this.init(server, driver, user, pass);
        this.orgnum = Toolbox.langnum<<16;
    }

    void print(String str) {
        if (this.debug) {
            if (this.output == 'w') {
                this.pw.print(str);
            } else if (this.output == 's') {
                this.ps.print(str);
            }
        } else {
            this.errormsg.append(str);
        }
    }

    void println(String str) {
        if (this.debug) {
            if (this.output == 'w') {
                this.pw.println(str);
            } else if (this.output == 's') {
                this.ps.println(str);
            }
        } else {
            this.errormsg.append(str + "\n");
        }
    }
    long birthtime = 0;
    static ArrayList<JDBCAdapter> R = new ArrayList(10);
    public void enq()
    {   
        if (1+1==2) return;
        birthtime = System.currentTimeMillis();
        if (birthtime%10 == 0)
        for (JDBCAdapter d:R)
        {
            if (birthtime - d.birthtime > 600000)
            {
                d.close();
            }
        }
         
        R.add(this);
    }
     
    public JDBCAdapter(DBConnectInfo d, int orgnum) {
        this.debug = false;
        this.orgnum = orgnum;
        
        if (d == null) {
            this.errormsg.append("no JDBC ConnectionInfo is null");
        } else {
            this.init(d.server, d.driver, d.user, d.password);
        }
    }

    public JDBCAdapter(DBConnectInfo d) {
        this.debug = false;
        this.orgnum = d.orgnum;
        if (d == null) {
            this.errormsg.append("no JDBC ConnectionInfo is null");
        } else {
            this.init(d.server, d.driver, d.user, d.password);
        }
    }

    public JDBCAdapter(String url, String driverName, String user, String passwd, int orgnum) {
         this.orgnum = orgnum;
        this.debug = false;
        if (url == null || driverName == null) {
            this.errormsg.append("DB url or driver is null");
        } else {
            this.init(url, driverName, user, passwd);
        }
    }

    public JDBCAdapter(String url, String driverName, String user, String passwd, PrintWriter out, int orgnum) {
        this.pw = out;
        this.output = 119;
         this.orgnum = orgnum;
        this.init(url, driverName, user, passwd);
    }

    public JDBCAdapter(String url, String driverName, String user, String passwd, PrintStream out, int orgnum) {
        this.ps = out;
        this.output = 115;
        this.orgnum =  orgnum;
        this.init(url, driverName, user, passwd);
    }

    public JDBCAdapter() 
    {
        this.debug = false;
    }

    public void init(String url, String driverName, String user, String passwd) 
    {
        this.server = url;
        this.driver = driverName;
        this.username = user;
        this.password = passwd;
        if (this.debug) 
        {
            this.println("start");
        }
        if (driverName == null) 
        {
            this.println("driver is null");
            return;
        }
        if (url == null) {
            this.println("db server is null");
            return;
        }
        if (user == null) {
            this.println("user is null");
            user = "";
        }
        
        this.dburl = url.replaceFirst(".*/([^/]*)$", "$1");
        try {
            if (driverName.indexOf("oracle") >= 0) {
                DriverManager.registerDriver((Driver)new OracleDriver());
            } else if (driverName.indexOf("microsoft") >= 0) {
                DriverManager.registerDriver((Driver)new SQLServerDriver());
            } else if (driverName.indexOf("odbc") >= 0){
                Class.forName(driverName);
            }  else {
                Class.forName(driverName).newInstance();
            }
            if (this.debug) {
                this.println("Opening db connection");
            }
            if (driverName.indexOf("microsoft") >= 0) {
                if(!url.contains("=utf8"))
                {
                      url += ";characterEncoding=utf8"; 
                }
                this.connection = DriverManager.getConnection(url + ";User=" + user + ";Password=" + passwd);
            } else if (driverName.indexOf("derby") >= 0) {
                Properties properties = new Properties();
                this.connection = DriverManager.getConnection(url + ";create=true", properties);
            } else {
                if ( (url.contains("mysql") || url.contains("maria") )&& !url.contains("characterEncoding"))
                   this.connection = DriverManager.getConnection(url + "?characterEncoding=utf8&useSSL=false", user, passwd);
                else
                {
 
                   this.connection = DriverManager.getConnection(url , user, passwd); 
                }
            }
            if (this.connection != null) {
                
                this.statement = this.connection.createStatement();
                DatabaseMetaData dm = this.connection.getMetaData();
                
                this.dbms = dm.getDatabaseProductName().toLowerCase();
                if (this.dbms.indexOf("server") >= 0) 
                {
                    this.dbms = "sqlserver";
                }  else if (this.dbms.indexOf("h2") >= 0) 
                {
                    this.dbms = "h2";
                    
                } 
                else if (this.dbms.indexOf("postgres") >= 0) 
                {
                    this.dbms = "postgres";
                }
                else if (this.dbms.indexOf("oracle") >= 0) 
                {
                    this.dbms = "oracle";
                } else if (this.dbms.indexOf("mysql") >= 0) {
                    this.dbms = "mysql";
                } else if (this.dbms.indexOf("access") >= 0) {
                    this.dbms = "access";
                    mutex = new Semaphore(1);
                }
                else if (this.dbms.indexOf("derby") >= 0) 
                {
                    this.dbms = "derby";
                } else if (this.dbms.indexOf("maria") >= 0) {
                    this.dbms = "mariadb";
                } 
                this.status = "open";
            } else if (this.debug) {
                this.println("invalid");
               
            }
            
        }
        catch (NoClassDefFoundError e)
        {
             this.println(driver + ":  class not exist");
        }
        catch (ClassNotFoundException e)
        {
             this.println(driver + ":  class not exist");
        }
        catch (SQLException e) {
            this.println(Toolbox.emsg(123) + " or " + Toolbox.emsg(124) + " or " + Toolbox.emsg(125) + driverName + " or " + e.toString());
        }
        catch (Exception e) {
            this.println(Toolbox.emsg(123) + " or " + Toolbox.emsg(124) + " or " + Toolbox.emsg(125) + driverName + " or " + e.toString());
        }
        if (this.connection == null) 
            System.out.println("No connection to url=" + url + ". Check user and password. error=" + error());
    }

    public void profile() {
        this.println(this.error());
        this.println("user:" + this.userName());
        this.println("url: " + this.url());
        this.println("driver: " + this.driverName());
        String[] tn = this.tableList();
        if (tn != null) {
            for (int i = tn.length - 1; i >= 0; --i) {
                this.println(tn[i]);
            }
        }
        this.println("");
    }

    public void print() {
        int i;
        int nr = this.getRowCount();
        if (this.metaData==null)
        try{
        this.metaData = this.resultSet.getMetaData();
        this.numberOfColumns = this.metaData.getColumnCount();
        }catch(Exception e){}
        int nc = this.getColumnCount();
        int[] width = new int[nc];
        for (i = 0; i < nc; ++i) {
            try {
                width[i] = this.metaData.getColumnDisplaySize(i + 1);
                continue;
            }
            catch (Exception e) {
                // empty catch block
            }
        }
        for (i = 0; i < nr; ++i) {
            for (int j = 0; j < nc; ++j) {
                String v;
                int k;
                if ((v = this.getValueAt(i, j)) == null) {
                    v = "";
                }
                int w = v.length();
                if (this.colIsNum[j]) {
                    for (k = 0; k < width[j] - w; ++k) {
                        this.print(" ");
                    }
                    this.print(v + " ");
                    continue;
                }
                this.print(v);
                for (k = 0; k < width[j] - w + 1; ++k) {
                    this.print(" ");
                }
            }
            this.println("");
        }
    }

    public boolean transacte1(String[] querys, int n, int m) {
        StringBuffer er = new StringBuffer();
        errormsg.setLength(0);
        boolean j = true;
        for (int i = n; i < m; ++i) {
            try {
                if (this.executeUpdate(querys[i]) >= 0) continue;
                j = false;
                er.append(this.error() + "\n");
                continue;
            }
            catch (Exception e) {
                j = false;
                er.append(e.toString());
            }
        }
        this.errormsg.append(er);
        return j;
    }
    public void rollback()
    {
      try{
		 connection.rollback();
      }catch(SQLException se2){}   
    }
    public boolean transacte(String[] querys, int n, int m) throws Exception {
        boolean tt = this.connection.getAutoCommit();
        boolean b = false;
        boolean hasstate = true;
        errormsg.setLength(0);
        try {
            this.connection.setAutoCommit(false);
            if (this.statement == null) {
                this.statement = this.connection.createStatement();
                hasstate = false;
            }
            for (int i = n; i < m; ++i) 
            {
                if ( (dbms.equals("mysql") || dbms.contains("maria"))&& querys[i].toLowerCase().startsWith("create") )
                {
                    int k = querys[i].lastIndexOf(")");
                    if (k > 0 && k < querys[i].length()-1)
                    {
                        String part = querys[i].substring(k+1);
                        if (!part.toLowerCase().contains("character set"))
                        {
                            querys[i] = querys[i] + " CHARACTER SET utf8 COLLATE utf8_general_ci";
                        }
                    }
                    else
                    {
                        querys[i] = querys[i] + " CHARACTER SET utf8 COLLATE utf8_general_ci";
                    }
                 }
                 boolean kk = this.statement.execute(querys[i]);
               
            }
            this.connection.commit();
            b = true;
        }
        catch (Exception e) {
             
            this.connection.rollback();
        }
        finally {
            this.statement.close();
           // this.connection.setAutoCommit(tt);
            if (hasstate) {
                this.statement = this.connection.createStatement();
            }
        }
        return b;
    }

    public int executeUpdate(String query) {
        
        return  executeUpdate( query, true);
    }
     
    public int executeUpdate(String query, boolean delattach) {
        
        try 
        {
            if (this.resultSet != null) 
            {
                this.resultSet.close();
                this.resultSet = null;
            }
         } catch(Exception e){}
        int i;
        if (this.dbms.equals("mysql") || this.dbms.contains("maria")) {
            query = query.replaceAll("\\\\", "\\\\\\\\");
        } else if (this.dbms.equals("h2")) {
            query = query.replaceAll(" mod ", " % ");
        }
        
        query = query.replaceFirst("^[ |\t|\n|\r]+", "").replaceFirst("[ |\t|\n|\r]+", " ");
        int j = 0;
        int N = query.length();
        if (N == 0) 
        {
            return 0;
        }
        i = query.indexOf(" ");
        if (i == -1)
        {
            Toolbox.println(1,query);
            return 0;
        }
        String act = query.substring(0,i).toLowerCase();
        boolean mody = true;
        String tablename = null;
        errormsg.setLength(0);
        ArrayList<String> att  = new ArrayList();
        i++;
        j = i;
        for (; i < N && query.charAt(i) != ' ' && query.charAt(i) != '\t' && query.charAt(i) != '\n' && query.charAt(i) != '\r'; ++i) { }
        String maybetbn = query.substring(j, i);
        if (act.indexOf("update") == 0) 
        {
            tablename = maybetbn;
        } 
        else 
        {
            
            maybetbn = maybetbn.toLowerCase().trim();
            if (!maybetbn.equals("table") && !maybetbn.equals("into")  && !maybetbn.equals("from") && !maybetbn.equals("database") ) 
            {
               
                this.println("Error: Incorrect Query:" + act + " " + tablename);
                return -1;
            }
            else if (  act.equals("create"))
            {
                 if (dbms.equals("mysql") || dbms.contains("maria") )
                 {
                    //ENGINE=InnoDB DEFAULT CHARSET=utf8;
                    int k = query.lastIndexOf(")");
                    if (k > 0 && k < query.length()-1)
                    {
                        String part = query.substring(k+1);
                        if (!part.toLowerCase().contains("character set"))
                        {
                            query = query + " CHARACTER SET utf8 COLLATE utf8_general_ci";
                        }
                    }
                    else
                    {
                        query = query + " CHARACTER SET utf8 COLLATE utf8_general_ci";
                    }
                 }
                 
            }
            String tmp = query.substring(i+1);
            tmp = tmp.replaceFirst("^[ |\t|\n|\r]+", "");
            tmp = tmp.replaceFirst("[ |\t|\n|\r]+", " ");
          
            i = tmp.indexOf(" ");
            if (i == -1) i = tmp.length();
         
            tablename = tmp.substring(0, i).toLowerCase();
           
            if (delattach && act.indexOf("delete") == 0)
            {
                String querya = query.replaceFirst("^[D|d][E|e][L|e][E|e][T|t][E|e]", "SELECT attach ");
                
                boolean na = executeQuery2(querya,false);

                if (na)
                {
                    for (int k=0; getValueAt(k,0)!=null; k++)
                    {
                        att.add(getValueAt(k,0));
                    }
                }
            }    
        }
        
        if (tablename.equals("") && query.indexOf("SET") != 0) 
        {
            this.println("Error: Query:'"  +query + "' is wrong, because it has no table");
            return -1;
        }
        this.errormsg.setLength(0);
        if (this.connection == null || this.statement == null) {
            this.println(Toolbox.emsg(127));
            return -1;
        }
        this.numberOfColumns = 0;
        int nrows = -1;
        String tb = this.dburl + "," + tablename;
        if (dbms.equals("access"))
        {
            try{mutex.acquire();
            while (dburls.contains(tb)) 
            {
                Thread.yield();
            }
            grabHandle(tb, true);
            mutex.release();
            }catch(Exception e1){}
        }
        try {
            query = Webform.mysql2c(this.dbms, query);
          
            nrows = this.statement.executeUpdate(query);
            
            if (att != null)
            {
               (new DeleteFile(att, orgnum)).start();
            }
        }
        catch (SQLException ex) {
           
            this.println("Error: " + ex.toString());
             
        }
        if (dbms.equals("access"))
        {
            try{mutex.acquire();
             grabHandle(tb, false);
             mutex.release();
            }catch(Exception e1){}
        }
       
        return nrows;
    }

    static synchronized void grabHandle(String url, boolean get) {
        if (get) {
            dburls.add(url);
        } else {
            dburls.remove(url);
        }
    }

    public int executeQuery(String query) {
         mode = 0;
        String ss;
        try 
        {
            if (this.resultSet != null) 
            {
                this.resultSet.close();
                this.resultSet = null;
            }
         } catch(Exception e){}
        
        if (this.dbms.equals("mysql") || this.dbms.contains("maria")) {
            query = query.replaceAll("\\\\", "\\\\\\\\");
        } else if (this.dbms.equals("h2")) {
            query = query.replaceAll(" mod ", " % ");
        }
         
        this.errormsg.setLength(0);
        this.cursor = 0;
        this.numberOfColumns = 0;
        this.numberOfRows = 0;
        if (this.connection == null || this.statement == null) {
            this.println(Toolbox.emsg(127)+ query);
            return -1;
        }
        
        if (query == null || query.length() < 6) {
            this.println("wrong query:" + query);
            return -1;
        }
        if (!(ss = query.substring(0, 6).toLowerCase()).equals("select")) {
            this.println("no select");
            return -1;
        }
        
        try {
            this.numberOfColumns = 0;
            this.numberOfRows = 0;
            if (this.statement == null) {
                this.statement = this.connection.createStatement();
            }
            this.resultSet = this.statement.executeQuery(Webform.mysql2c(this.dbms, query));
            this.metaData = this.resultSet.getMetaData();
            if (this.metaData == null) {
                return -1;
            }
            this.numberOfColumns = this.metaData.getColumnCount();
        
             
        }
        catch (SQLException ex) {
            this.println("Error:");
            this.println(ex.toString());
            return -1;
        }
        
        boolean hasnext = false;
        do {
            hasnext = false;
            try {
                if (this.numberOfRows==0)
                   hasnext = this.resultSet.first(); 
                else
                   hasnext = this.resultSet.next();
            }
            catch (Exception ex) {
            
                break;
            }
            
            if (!hasnext) 
            {
                
                break;
            }
            if (this.rows == null) {
                this.rows = new String[10][];
            }
            if (this.rows.length == this.numberOfRows) 
            {
                String[][] bigone = new String[this.numberOfRows + 10][];
                for (int t = 0; t < this.numberOfRows; ++t) {
                    bigone[t] = this.rows[t];
                }
                this.rows = bigone;
            }
            this.rows[this.numberOfRows] = new String[this.numberOfColumns];
            for (int i = 1; i <= this.numberOfColumns; ++i) 
            {
                try 
                {
                    this.rows[this.numberOfRows][i - 1] = this.resultSet.getString(i);
                    
                    continue;
                }
                catch (Exception ex) {
                    // empty catch block
                }
            }
            ++this.numberOfRows;
        } while (true);
        if (this.needMetaInfo) 
        {
            this.metainfo();
        }
         
        return this.numberOfRows;
    }

    public void metainfo() 
    {
        try 
        {
            this.columnNames = new String[this.numberOfColumns];
            this.colIsNum = new boolean[this.numberOfColumns];
            this.colSizes = new int[this.numberOfColumns];
            this.colNullable = new int[this.numberOfColumns];
            for (int column = 0; column < this.numberOfColumns; ++column) 
            {
                this.columnNames[column] = this.metaData.getColumnLabel(column + 1);
                this.colIsNum[column] = this.isnum(column);
                this.colSizes[column] = this.metaData.getColumnDisplaySize(column + 1);
                this.colNullable[column] = this.metaData.isNullable(column + 1);
            }
        }
        catch (Exception e) 
        {
            this.println("" + e);
        }
    }

    public boolean executeQuery2(String query, boolean mt) {
        
        int qq = 0;
        try 
        {  
            if (this.resultSet != null) 
            {  
                qq = 1;
                this.resultSet.close();
                qq=2;
                this.resultSet = null;
            }
          
        if (this.dbms.equals("mysql") || this.dbms.contains("maria")) {
            query = query.replaceAll("\\\\", "\\\\\\\\");
        } else if (this.dbms.equals("h2")) {
            qq=3;
            query = query.replaceAll(" mod ", " % ");
             
        }   
        mode = 2;
        this.errormsg.setLength(0);
        if (this.statement == null) 
        {
            this.statement = this.connection.createStatement();
        }   
        this.resultSet = this.statement.executeQuery(query);
               
            if (mt) 
            { 
                qq=5;
                this.metaData = this.resultSet.getMetaData();
                this.numberOfColumns = this.metaData.getColumnCount();
                metainfo();
            }
            this.cursor = -1;
            qq=6;
            end = false;
              
            return true;
        }
        catch (SQLException ex) 
        {
            this.println("Error:" + qq);
            this.println(ex.toString());
            
            return false;
        }
      
         
    }
    
    public String tocsv()
    {
        if (this.metaData==null)
        try{
        this.metaData = this.resultSet.getMetaData();
        this.numberOfColumns = this.metaData.getColumnCount();
        }catch(Exception e){}
        int m = getColumnCount();
        int i = 0;
        String s = "";
        while(true) 
        {
            for(int j = 0; j < m; j++)
            {
                String tv =  getValueAt(i, j);
                if (cursor < 0)
                    break;
                else if (j==0 && !s.equals(""))
                    s  += DBAdmin.CSVseparator[1];
                if (tv!=null)
                {
                    if (this.isnum(j)==false)
                    {
                         tv =  DBAdmin.CSVquote + tv.replaceAll(""+DBAdmin.CSVquote , ""+DBAdmin.CSVquote + DBAdmin.CSVquote) + DBAdmin.CSVquote;
                    }
                    s += tv;
                }
                if(j < m-1)
                {
                    s += DBAdmin.CSVseparator[0];
                }
            }
           
            if (cursor >= 0)
                i++;
            else 
                break;
        }
        return s;
    }

    public boolean nextRow() {
        if ( cursor == this.numberOfRows - 1) {
            return false;
        }
        ++this.cursor;
        return true;
    }

    public String getParameter(int i) {
        
        return this.getValueAt(this.cursor, i);
    }

    public String getParameter(String s) {
        int i;
        for (i = 0; !(i >= this.numberOfColumns || this.columnNames[i].equals(s)); ++i) {
        }
        if (i == this.numberOfColumns) {
            return "";
        }
        return this.getValueAt(0, i);
    }
     
    public boolean end = false;
    public boolean rewind()
    {
        boolean b = false;
        try{
           this.resultSet.beforeFirst();
           b = this.resultSet.first();
        }catch(Exception e1){}
        if (b) cursor = 0;
        return b;
    }
    public String getValueAt(int aRow, int aColumn) {
        if (mode == 2)
        {
            if (aRow != cursor+1 && aRow != cursor)
            {
                return "aRow=" + aRow + ", cursor=" + cursor + ", After executeQuery2, you have to read data sequentially with row=0, 1, 2 ...";
            }
            if (cursor == -2)
            {
                return null;
            }
            if (aRow==0 && cursor==-1)
            {
                try 
                {
                   if (this.resultSet.first())
                    {
                        cursor++;
                    }
                    else
                    {
                       end = true;
                       cursor= -2; 
                       return null;
                    }
                }
                catch (Exception ex) 
                {
                    cursor = -2;
                }
            }
            else if (aRow == cursor+1) 
            {
                try 
                {
                   if (this.resultSet.next())
                    {
                        cursor++;
                        
                    }
                    else
                    {
                       end = true;
                       cursor= -2; 
                       return null;
                    }
                    
                }
                catch (Exception ex) 
                {
                    cursor = -2;
                }
            }
             
            if (cursor>=0)
            {
                try
                {
                    String x =  this.resultSet.getString(aColumn+1);
                    return x;
                }catch(Exception e){}
            }
            return null;
        }
        else if (mode == 0)
        {
            if (aRow >= this.numberOfRows || aColumn >= this.numberOfColumns) 
            {
                return null;
            }
            return this.rows[aRow][aColumn];
        }
        else
            return null;
    }
    
    public void close() 
    {
        this.errormsg.setLength(0);
        String m = "resultset";
       // if (birthtime > 0)   R.remove(this);
        try {
            if (this.resultSet != null) 
            {
                this.resultSet.close();
                this.resultSet = null;
            }
             
            m = "statement";
            if (this.statement != null) {
                this.statement.close();
                this.statement = null;
            }

            m = "connection";
            if (this.connection != null) {
                this.connection.close();
            }
            this.connection = null;
           
            
            this.dmd = null;
            if (this.debug) {
                this.println("Closed db connection");
            }
        }
        catch (SQLException e) {
            this.println("Error as Closing db " + m);
        }
    }
    
    protected void finalize() throws Throwable {
        
        close();
        super.finalize();
    }

    public boolean isnum(int column) {
        int type;
        try {
            type = this.metaData.getColumnType(column + 1);
        }
        catch (SQLException e) {
            return false;
        }
        switch (type) {
        case  Types.BIGINT : 
        case  Types.BINARY : 
        case  Types.BIT:
        case  Types.BOOLEAN : case Types.DECIMAL : case  Types.DOUBLE :
        case  Types.FLOAT : case  Types.INTEGER : case  Types.NUMERIC:
        case  Types.REAL: case  Types.SMALLINT : case  Types.TIMESTAMP:
        case  Types.TINYINT: 
        {
                return true;
            }
        }
        return false;
    }

    public boolean isCellEditable(int row, int column) {
        try {
            return this.metaData.isWritable(column + 1);
        }
        catch (SQLException e) {
            return false;
        }
    }

    public int getColumnCount() {
        return this.numberOfColumns;
    }

    public int getRowCount() {
        return this.numberOfRows;
    }

    public synchronized String keyFields(String tn) {
        if (this.connection == null) {
            return null;
        }
        try {
            if (this.dmd == null) {
                this.dmd = this.connection.getMetaData();
            }
            ResultSet rs = this.dmd.getPrimaryKeys(null, null, tn);
            String fields = "";
            String str = "";
            while (rs.next()) {
                String columnName = rs.getString("COLUMN_NAME");
                if (!fields.equals("")) {
                    fields = fields + ",";
                }
                fields = fields + columnName;
            }
            return fields;
        }
        catch (Exception e) {
            return "";
        }
    }

    public synchronized String[] tableList() {
        if (this.connection == null) {
            return null;
        }
        try 
        {
            StringBuffer tblnames = new StringBuffer("");
            //if (this.dmd == null) 
            {
                this.dmd = this.connection.getMetaData();
            }
            boolean n = false;
            String[] ts = new String[]{"TABLE"};
            ResultSet rs2 = this.dmd.getTables(null, null, "%", ts);
           
            int k = 0;
            if (rs2!=null)
            while (rs2.next()) 
            {
                String tt;
                if ((tt = rs2.getString(3)) == null || tt.equals("")) continue;
                if (k > 0) 
                {
                    tblnames.append(",");
                }
                tblnames.append(tt);
                ++k;
            }
            if (rs2!=null)
            rs2.close();
             
            return tblnames.toString().split(",");
        }
        catch (Exception e) {
            this.println(e.toString());
            return null;
        }
    }

    public String userName() {
        try {
            return this.connection.getMetaData().getUserName();
        }
        catch (Exception e) {
            return "unknown";
        }
    }

    public String url() {
        try {
            return this.connection.getMetaData().getURL().replaceFirst("\\?characterEncoding.*","");
        }
        catch (Exception e) {
            return "unknown";
        }
    }

    public String driverName() {
        try {
            return this.connection.getMetaData().getDriverName();
        }
        catch (Exception e) {
            return "unknown";
        }
    }

    public synchronized ResultSetMetaData tableMeta(String tablename) {
        if (this.connection == null) {
            return null;
        }
        
        try {
            if (this.resultSet != null) {
                this.resultSet.close();
              
            } 
            this.resultSet = this.statement.executeQuery("SELECT * from " + tablename + " where 0 = 1");
            
            return this.resultSet.getMetaData();
        }
        catch (SQLException ex) {
            this.errormsg.append(Toolbox.emsg(128));
            return null;
        }
    }

    public String tabledef(String table, String targetdbms) {
        boolean trans = false;
        int sindex = -1;
        int tindex = -1;
        if (!(targetdbms == null || targetdbms.equals(this.dbms))) {
            sindex = Toolbox.begintranslate(this.dbms);
            tindex = Toolbox.begintranslate(targetdbms);
            trans = true;
        }
        String keyfields = this.keyFields(table);
        String ans = "CREATE TABLE " + table + "(\n";
        int kk = 0;
        try {
            if (this.statement==null) this.statement = this.connection.createStatement();
 
            this.resultSet = this.statement.executeQuery("SELECT * from " + table + " where 0 = 1");
            this.metaData = this.resultSet.getMetaData();
            kk = this.metaData.getColumnCount();
            if (kk < 0) { 
                return "";
            }
            for (int i = 0; i < kk; ++i) {
                ans = ans + this.metaData.getColumnName(i + 1) + " ";
                ans = !trans ? ans + this.metaData.getColumnTypeName(i + 1) : ans + Toolbox.translate(this.metaData.getColumnTypeName(i + 1), sindex, tindex);
                int ll = this.metaData.getColumnDisplaySize(i + 1);
                if (!(ll >= 10000 || this.isnum(i))) {
                    ans = ans + "(" + ll + ")";
                }
                if (this.metaData.isNullable(i + 1) != 1) {
                    ans = ans + " NOT NULL";
                }
                ans = i < kk - 1 ? ans + "," : (!keyfields.equals("") ? ans + ",PRIMARY KEY (" + keyfields + ")\n)" : ans + ")");
            }
 
            return ans;
        }
        catch (Exception e) {
 
            return "";
        }
    }

    public synchronized String[] fieldList(String tablename) {
        try {
            this.resultSet = this.statement.executeQuery("SELECT * from " + tablename + " where 0 = 1");
            this.metaData = this.resultSet.getMetaData();
            if (this.metaData != null) {
                int kk = this.metaData.getColumnCount();
                String[] a = new String[kk];
                for (int i = 0; i < kk; ++i) {
                    a[i] = this.metaData.getColumnName(i + 1);
                }
                return a;
            }
        }
        catch (Exception e) {
            // empty catch block
        }
        return null;
    }

    private void copy2(String[] x, String[] y) {
        for (int i = 0; i < y.length; ++i) {
            x[i] = y[i];
        }
    }

  
}
