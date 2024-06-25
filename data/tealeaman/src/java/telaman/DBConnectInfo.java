/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import java.io.Serializable;
import java.util.Date;
import telaman.JDBCAdapter;
import telaman.Toolbox;

public class DBConnectInfo
implements Serializable {
    public String server;
    public String driver;
    public String user;
    public String password;
    public int orgnum = Toolbox.langnum<<16;
    public boolean save2db(JDBCAdapter adapter, String id) {
        return 1 == adapter.executeUpdate("INSERT INTO DBOwner(lastupdate, id,server,driver,timeformat,msgcount,submitcount,talkcount,dbuserid,dbpassword) VALUES(" + (new Date().getTime() / 1000) + ",'" + id.replaceAll("'", "''") + "','" + this.server.replaceAll("'", "''") + "','" + this.driver.replaceAll("'", "''") + "','" + Toolbox.timeformat[orgnum>>16].replaceAll("'", "''") + "',0,0,0,'" + this.user.replaceAll("'", "''") + "','" + this.password.replaceAll("'", "''") + "')");
    }
    public DBConnectInfo() {
    }

    public DBConnectInfo(String s, String d, String u, String p, int orgnum) {
        this.server = s;
        this.driver = d;
        this.user = u;
        this.password = p;
        this.orgnum = orgnum;
    }

    public DBConnectInfo(String s, int orgnum1 ) {
        try{
        s = (new Encode6b(orgnum1)).rto6b(s);
        CSVParse p = new CSVParse(s,'\'',new String[]{",",";"} );
        String [] a = p.nextRow();
        this.server = a[0];
        this.driver = a[1];
        this.user = a[2];
        this.password = a[3];
        this.orgnum = orgnum1;
        }catch(Exception e){}
    }

    public boolean equals(DBConnectInfo x) {
        return this.server.equals(x.server);
    }

    public DBConnectInfo(DBConnectInfo x) {
        this.server = x.server;
        this.driver = x.driver;
        this.user = x.user;
        this.password = x.password;
        this.orgnum = x.orgnum;
    }
    public String toCSV(int orgnum) {
        return (new Encode6b(orgnum)).to6b("'" + this.server.replaceAll("'", "''") + "','" + this.driver.replaceAll("'", "''")+ "','" +  this.user + "','" + this.password.replaceAll("'", "''")+ "'");
    }
    
    public String toString() {
        return this.server + "," + this.driver + "," + this.user + "," + this.password;
    }
}
