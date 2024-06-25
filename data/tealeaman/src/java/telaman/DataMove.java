 
package telaman;

import java.util.HashMap;
import java.util.Vector;
import telaman.DBAdmin;
import telaman.DBConnectInfo;
import telaman.DataRestore;
import telaman.DbTable;
import telaman.JDBCAdapter;
import telaman.Toolbox;
import telaman.User;


public class DataMove extends DataRestore 
{
    String sql = "";
    //public String err = "";
   int orgnum=0;
   public String move(boolean server2User, boolean ignorenull) 
    {
        JDBCAdapter adapter = null;
        JDBCAdapter rec = null;
        String err = "";
        HashMap<String, String> tabledefs = new HashMap<String, String>();
        int nn;
        if (server2User) 
        {
            adapter = Toolbox.getUserAdapter(dbadmin.sysDBConnectInfo(),orgnum);
            
            rec = Toolbox.getUserAdapter(c,orgnum);
            adapter.needMetaInfo = true;
            nn=0;
            boolean bn = adapter.executeQuery2("SELECT tname, definition FROM Apptables",false);
            for (int i = 0; bn&&adapter.getValueAt(i, 0)!=null; ++i) 
            {
                tabledefs.put(adapter.getValueAt(i, 0).toLowerCase(), adapter.getValueAt(i, 1));
            }
        } 
        else 
        {
            rec = Toolbox.getUserAdapter(dbadmin.sysDBConnectInfo(),orgnum);
            
            adapter = Toolbox.getUserAdapter(this.c, orgnum); 
            rec.needMetaInfo = true;
            
            boolean bn = rec.executeQuery2("SELECT tname, definition FROM Apptables",false); 
            nn = 0;
            for (int i = 0; bn && rec.getValueAt(i, 0)!=null; ++i) 
            {
                tabledefs.put(rec.getValueAt(i, 0).toLowerCase(), rec.getValueAt(i, 1));
                nn++;
            }
        }
       
        
        
        int sindex = Toolbox.begintranslate(adapter);
        int tindex = Toolbox.begintranslate(rec);
        String sourcedbms = adapter.dbms;
        String dbms = rec.dbms;
        Vector<String> comp = new Vector<String>();
        boolean states = true;
        int k = 0;
        boolean nr = false;
        int ne = -1;
        String tn = null;
        Object tn1 = null;
        StringBuffer kf = new StringBuffer(200);
        StringBuffer sf = new StringBuffer(200);
        StringBuffer sb = new StringBuffer(200);
        int strleng = this.sql.length();
        for (int ii = 0; ii < strleng; ++ii) 
        {
            if (this.sql.charAt(ii) == '\'')
            {
                boolean bl = states = !states;
            }
            if (!states || this.sql.charAt(ii) != ';') continue;
            if (ii > k) 
            {
                String xx = this.sql.substring(k, ii);
                comp.addElement(xx);
            } 
            else 
            {
                comp.addElement("");
            }
            k = ii + 1;
        }
        if (k < strleng) 
        {
            comp.addElement(this.sql.substring(k));
        }
 
        int K = comp.size() / 2;
        String sub = "";
        err = err + "<tr style=background-color:var(-tbgcolor) ><td>#Tables</td><td   >" + K + "</td><td> </td></tr>";
        for (k = 0; k < K; ++k) 
        {
            String def;
            tn = (String)comp.elementAt(2 * k);
            tn = tn.trim().replaceFirst(" .*", "");
            
            if ((def = (String)tabledefs.get(tn.toLowerCase())) == null) 
            {
                err = err + "<tr style=background-color:var(-tbgcolor) ><td>" + tn + "</td><td colspan=2 > definition not exits </td><td> 0</td></tr>";
                continue;
            }
              
            def = this.portto(def, sindex, tindex);
            
            this.parseit(def);
            adapter.needMetaInfo = true;
            String datadef = (String)comp.elementAt(1 + 2 * k);
            String allfirsts = datadef.replaceAll("'[^']*'","''").toUpperCase().replaceFirst("\\WFROM\\W.*$","").replaceFirst("[ ]*SELECT[ ]*","").replaceFirst("\\WDISTINCT\\W","").trim();
            
            String findnull[] = allfirsts.split(",");
 
            boolean bn = adapter.executeQuery2(datadef,true);
           // int n = 0;
            if (bn==false || adapter.getValueAt(0, 0)==null) 
            {
                int n1 = adapter.executeQuery(datadef);
                if (n1 == -1)
                    err = err + "<tr style=background-color:var(-tbgcolor) ><td>" + tn + "</td><td colspan=2 >" + datadef + " is wrong</td><td> 0</td></tr>";
                else
                    err = err + "<tr style=background-color:var(-tbgcolor) ><td>" + tn + "</td><td colspan=2 >0</td><td> 0</td></tr>";
                 
                continue;
            }
            //adapter.metainfo();
            int m = adapter.getColumnCount();
            if (m != findnull.length && !allfirsts.equals("*"))
            {
                err = err + "<tr style=background-color:var(-tbgcolor) ><td>" + tn + "</td><td colspan=2 >" + allfirsts + ", but m=" + m + "</td><td> 0</td></tr>";
                continue;
            }
            ne = 0;
            int n = 0;
            for (int i2 = 0; adapter.getValueAt(i2, 0)!=null; ++i2) 
            {
                n++;
              
                String err1;
                String[] record = new String[m];
                StringBuffer quoteds = new StringBuffer(m);
                for (int j = 0; j < m; ++j) 
                {
                    String tv = adapter.getValueAt(i2, j);
                    if (  adapter.colIsNum[j]) 
                    {
                        quoteds.append('0');
                    } 
                    else 
                    {
                        quoteds.append('1');
                    }
                    if (!allfirsts.equals("*") && findnull[j].equals("NULL")) 
                        record[j] = null; 
                    else
                        record[j] = tv;
                }
                err1 = this.procRecord(tn, record, quoteds.toString(), kf, sf, rec, ignorenull);
                
                if (err1.equals("i ") || err1.equals("u ")) 
                {
                    ++ne;
                    continue;
                }
                else
                {    
                    err =  err + "<tr style=background-color:var(-tbgcolor) ><td>" + tn + "</td><td colspan=2 >" + err1  + "</td><td> 0</td></tr>";
                }
            }
            
             
            err =  err + "<tr style=background-color:var(-tbgcolor) ><td>" + tn + "</td><td  align=right>" + n + "</td><td>" + ne + "</td></tr>";
        }
        adapter.close();
        rec.close();
        return err;
    }

    public static String intisubdb(User user) 
    {
       
        JDBCAdapter adapter =  Toolbox.getSysAdapter(user.orgnum);
        adapter.orgnum = user.orgnum;
        
        DbTable dbtable = new DbTable(adapter, user, "");
        dbtable.table2def = false;
        dbtable.init();
        adapter.close();
        user.changedb(user.id);
        JDBCAdapter rec = Toolbox.getUserAdapter(user, user.orgnum);
        
        if (!rec.error().equals("")) {
            return "intisubdb2:" + rec.error();
        }
        int sindex = Toolbox.begintranslate(adapter);
        int tindex = Toolbox.begintranslate(rec);
        if (rec.dburl.equals(adapter.dburl)) {
            rec.close();
            return "intisubdb3:no need";
        }
         
        String or = "";
        String err = "intisubdb4:";
        boolean movedt = false;
        if (dbtable.numTables == 0) {
            return "";
        }
        
        for (int i = 0; i < dbtable.numTables; ++i) 
        {
            if (i == 0) 
                or = " WHERE  tname='" + dbtable.tables[i] + "' " ;
            else 
                or = or + "OR tname='" + dbtable.tables[i] + "' ";
            String def = dbtable.defs[i];
            if (tindex == 0) {
                def = def.replaceAll("DEFAULT[^,]+,", ",");
            }
            def = Toolbox.translateStr(def, sindex, tindex);
            rec.executeUpdate("DROP table " + dbtable.tables[i]);
            if (0 != rec.executeUpdate(def)) {
                err = err + rec.error() + "\n";
            }
            if (!dbtable.tables[i].equalsIgnoreCase("domainvalue") && !dbtable.tables[i].equalsIgnoreCase("apptables") && !dbtable.tables[i].equalsIgnoreCase("operation") && !dbtable.tables[i].equalsIgnoreCase("role") && !dbtable.tables[i].equalsIgnoreCase("department") && !dbtable.tables[i].equalsIgnoreCase("course")) continue;
            movedt = true;
        }
        String sql = "INSERT INTO Apptables (lastupdate,tname,definition,roles) values(" + (System.currentTimeMillis() / 1000) + ",'Apptables','CREATE TABLE Apptables(lastupdate BIGINT, tname VARCHAR(30), definition TEXT, roles BIGINT, PRIMARY KEY(tname))', 4095)";
        sql = Toolbox.translateStr(sql, 1, tindex);
        int nn = rec.executeUpdate(sql);
         
        rec.close();
        if (!movedt) {
            return err;
        }
        sql = "Apptables;SELECT * FROM Apptables " + or + ";";
        
        err = err + DataMove.importdata(user, sql, "backup", true);
        sql = "Course;SELECT * FROM Course WHERE id='20-101';Department;Select * FROM Department;Role;SELECT * FROM Role;DomainValue;SELECT * from DomainValue;Operation;SELECT * FROM Operation";
        err = err + DataMove.importdata(user, sql, "backup", true);
        return err;
    }

    public static String importdata(User user, String sql, String overlap, boolean ignorenull) 
    {
        user.changedb(user.id);
       
        if (!user.mydb || user.dbinfo.server.equals(Toolbox.dbadmin[user.orgnum%65536].sysDBConnectInfo().server)) 
        {
            return "";
        }
        DataMove mover = new DataMove(sql, overlap, user.getDBConnectInfo(),user.orgnum);
        String err = mover.move(true, ignorenull);
        
        return err;
    }

    public static String exportdata(User user, String sql, String overlap, boolean ignorenull) 
    {
        user.changedb(user.id);
        if (!user.mydb || user.dbinfo.server.equals(Toolbox.dbadmin[user.orgnum%65536].sysDBConnectInfo().server)) 
        {
            return "";
        }
        DataMove mover = new DataMove(sql, overlap, user.getDBConnectInfo(),user.orgnum);
        String err = mover.move(false, ignorenull);
        return err;
    }
    DBAdmin dbadmin;
    public DataMove(String sql, String overlap, DBConnectInfo c,int orgnum) {
        super(overlap, "*",c);// Toolbox.encodings[orgnum>>16], c);
        this.orgnum = orgnum;
        dbadmin = Toolbox.dbadmin[orgnum%65536];
        this.sql = sql;
    }

    

    public static void main1(String[] args) {
        String sql = "Session;SELECT * FROM  Session  WHERE   Session.semester='" + Toolbox.dbadmin[0].currentSemester + "' AND Session.instructor='D10059906';";
        String server = "jdbc:microsoft:sqlserver://localhost:5560;DatabaseName=master";
        String user = "sa";
        String pass = "sqlserver";
        String driver = "com.microsoft.jdbc.sqlsrever.SQLServerDriver";
        DBConnectInfo dc = new DBConnectInfo(server, driver, user, pass,0);
        String overlap = "backup";
        DataMove mover = new DataMove(sql, overlap, dc,0);
        String err = mover.move(true, false);
         
    }
    
     String readLine(byte[] abyte0, int[] ai) {
        return "";
    }

    @Override
    boolean outerr(String err) 
    {
        return false;
    }
}
