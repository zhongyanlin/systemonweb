/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import java.io.PrintStream;
import java.util.Date;
import telaman.JDBCAdapter;
import telaman.Toolbox;

public class Systemroles {
    private long code = 0;
    static public String roles[][]=null;
    static public boolean owndbs[] = new boolean[32];
    static public final long STUDENT = 1;
    static public final long INSTRUCTOR = 2;
    static public final long TEACHINGADMIN = 4;
    static public final long SYSTEMADMIN = 8;
    static public final long SYSTEMANALYST = 16;
    static public final long REGISTER = 32;
    static public final long ASSESSER = 2048;
    static public final long TA = 1024;
    static public final long INTERNAL = 511;
    static public long TOTAL = 31;
    static public int numRoles = 0;
    
    static public String readRoles(JDBCAdapter adapter)
    {
        if (roles==null)
        {
            roles = new String[Toolbox.langs.length][];
            for (int i=0; i < roles.length; i++)
               roles[i] = new String[32];
        }
        String err = "";
        for (int k=0; k < Toolbox.langs.length; k++)
        {
            String sql1 = "SELECT bitorder, DomainValue.domainValue, owndb FROM Role, DomainValue where DomainValue.code=Role.bitorder AND DomainValue.domain='Role Name' AND  DomainValue.language='" + Toolbox.langs[k] + "' order by bitorder";
            int n = 0;
            boolean bn = adapter.executeQuery2(sql1,false);
            if (bn==false) 
                n = -1;
            else 
                n = adapter.getValueAt(0,0) != null? 1:0;
            if (n <= 0) 
            {
                 String xx = "CREATE TABLE IF NOT EXISTS Role( lastupdate BIGINT NOT NULL ,bitorder INTEGER NOT NULL,owndb SMALLINT NOT NULL ,signincode VARCHAR(10),rolecode BIGINT NOT NULL,PRIMARY KEY(bitorder))";
                 int sindex = Toolbox.begintranslate("mysql");
                 int tindex = Toolbox.begintranslate(adapter.dbms);
                 xx = Toolbox.translateStr(xx, sindex, tindex);
                long ll = (new java.util.Date()).getTime()/1000;
                if (n < 0)
                    n = adapter.executeUpdate(xx);

                //if (n >= 0)
                {
                    n = adapter.executeUpdate("INSERT INTO Role(lastupdate, bitorder,  owndb, rolecode,signincode) VALUES(" + ll +",0, 0,0,'')"); 
                    int v = 1;
                    for (int p = 1; p <= 12; p++)
                    {
                        int kk= adapter.executeUpdate("INSERT INTO Role(lastupdate, bitorder,  owndb, rolecode,signincode) VALUES(" + ll +"," +p + "," + (p>1?1:0) + "," + v + ",'')"); 
                        if (kk>0) n+= kk;
                        
                        v *= 2;
                    }
                }
                if (n <= 1)
                {
                    //err += k + ":" + adapter.error();
                }
                adapter.executeQuery2(sql1,false);
            }


            TOTAL = -1;
            int i = 0, j = 0,m=0;

            while (i < roles[k].length && adapter.getValueAt(j,0)!=null)
            {
                if (adapter.getValueAt(j,0).equals("" + i) == false)
                {
                   if (k < roles.length && i < roles[k].length)
                       roles[k][i] = "MNR " + (m++);
                   if (i < owndbs.length) owndbs[i] = false;
                   j++;
                }
                else
                {
                   roles[k][i] = adapter.getValueAt(j,1);
                   owndbs[i] = (adapter.getValueAt(j,2) != null && adapter.getValueAt(j,2).equals("1"));
                   j++;
                }
 
                 
                i++;
            }
            numRoles = i;
            
             
        }
        return err;
    }
    
    static public String init(String langcode)
    {
        JDBCAdapter adapter = new JDBCAdapter("jdbc:odbc:" + Toolbox.appname + "sys","sun.jdbc.odbc.JdbcOdbcDriver", "","",0);
        int n = 0;
        boolean b = adapter.executeQuery2("SELECT bitorder, DomainValue.domainValue, owndb FROM Role, DomainValue where DomainValue.code=Role.bitorder AND DomainValue.domain='Role Name' AND  DomainValue.language='" + langcode + "' order by bitorder",false);
       
        if ( b == false || adapter.getValueAt(0,0) ==null  ) 
        {
            long ll = (new java.util.Date()).getTime()/1000;
            if (!b)
                n = adapter.executeUpdate("CREATE TABLE Role (lastupdate BIGINT, bitorder INTEGER, rolename VARCHAR(30), owndb SMALLINT, PRIMARY KEY(bitorder))");
            else
            {
                n = adapter.executeUpdate("INSERT INTO Role(lastupdate, bitorder,  owndb, rolecode) VALUES(" + ll +",0,  0,0)") 
                  + adapter.executeUpdate("INSERT INTO Role(lastupdate, bitorder,   owndb, rolecode) VALUES(" + ll +",1, 0,1)") 
                  + adapter.executeUpdate("INSERT INTO Role(lastupdate, bitorder,   owndb, rolecode) VALUES(" + ll +",2, 1,2)") 
                  + adapter.executeUpdate("INSERT INTO Role(lastupdate, bitorder,   owndb, rolecode) VALUES(" + ll +",3, 1,4)") 
                  + adapter.executeUpdate("INSERT INTO Role(lastupdate, bitorder,   owndb, rolecode) VALUES(" + ll +",4, 1,8)")
                  + adapter.executeUpdate("INSERT INTO Role(lastupdate, bitorder,   owndb, rolecode) VALUES(" + ll +",5, 1,16)");
            }
            if (n <= 1)
            {
                adapter.close();
                return adapter.error();
            }
            adapter.executeQuery2("SELECT bitorder, DomainValue.domainValue, owndb FROM Role, DomainValue where DomainValue.code=Role.bitorder AND DomainValue.domain='Role Name' AND  DomainValue.language='" + langcode + "' order by bitorder",false);
        }
        numRoles = 0;
        
        for (int i =0; adapter.getValueAt(0,1)!=null; i++)
        {
            numRoles++;
            roles[0][i] = adapter.getValueAt(i,1);
            owndbs[i] = (adapter.getValueAt(i,2) != null && adapter.getValueAt(i,2).equals("1"));
            
           
        }    
        TOTAL /= 2;
        TOTAL -= 1;
        adapter.close();
        return null;
    }
    static public boolean owndb(long codes)
    {
        if (codes==0) return false;
        long k = 1; // 2 = 0100  0 1 2 3  0 1 2 4
        for (int i = 1; i <  numRoles; i++)
        {
            if (owndbs[i] && (codes & k)> 0) return true;
            k <<= 1;
        }
        return false;
    }
    static public long toCode(String [] rls, int encnum)
    {
        long codes = 0;
        for (int i = 0; i < rls.length; i++)
        {
            long k = 1;
            int j = 0; for (; j < numRoles; j++) 
            {
                if (   rls[i].equals(roles[encnum][j+1]) ) 
                {
                    codes |= k;
                    break;
                }
                else
                {
                    k <<= 1;
                }
            }
        }
        return codes;
    }
    public static long toCode(String  rls,int encnum)
    {
        if (rls == null) return 0;
        long k = 0;
        try {
           k = Integer.parseInt(rls);
           return k;
        } catch(Exception e){}
        return toCode(rls.split(","),encnum);
    }
    public Systemroles(String [] rls, int encnum)
    {
        roles = new String[Toolbox.langs.length][];
        for (int i=0; i < roles.length; i++)
            roles[i] = new String[32];
        code = toCode(rls,encnum);
    }
    public Systemroles(long [] cs)
    {
        roles = new String[Toolbox.langs.length][];
        for (int i=0; i < roles.length; i++)
            roles[i] = new String[32];
        code = 0; 
        long k = 1;
        for (int i = 0; i < cs.length; i++)
        {
            if (cs[i] >= 0)
               code |= (k << cs[i]);
        }
    }
    public Systemroles(String ad, int encnum)
    {
        roles = new String[Toolbox.langs.length][];
        for (int i=0; i < roles.length; i++)
            roles[i] = new String[32];
        try
        { 
            code = Long.parseLong(ad);
        }catch(Exception e)
        { 
            code  = toCode(ad,encnum);
        }
    }
    public boolean owndb()
    {
        return owndb(code);
    }
    public Systemroles(long j) 
    {
        roles = new String[Toolbox.langs.length][];
        for (int i=0; i < roles.length; i++)
            roles[i] = new String[32];
        code= j;
    }
    public long getCode(){return code;}
    
    public String [] toStrings(int encnum)
    {
        int j = 0,  l=0;
        long k = 1;
        
        for (; j < numRoles; j++)
        {
            if ( (code & k) > 0) l++;
            k <<= 1;
        }
        if ( l == 0) return null;
        String [] rls = new String[l];
        l = 0;
        k = 1;
        for (j = 0; j < numRoles; j++)
        {
            if ( (code & k) > 0) 
              rls[l++] = roles[encnum][j+1];
            k <<= 1;
        }
        return rls;         
    }
    
    public String toString(int encnum)
    {
        int j,   l = 0;
        long k = 1;
        String str = "";
        if (numRoles == 0) return "public";
        for (j = 0; j < numRoles; j++)
        {
            if ( (code & k) > 0) 
            {
                str += "," + roles[encnum][j+1];
            }
            k <<= 1;
        }
        if (str.length() > 0)
           return str.substring(1); 
        return "";
            
    }
    
    public boolean common(Systemroles sr)
    {
       return  (code & sr.getCode()) > 0;   
    }
    
    public boolean has(long c)
    {
        if (c < 0 || c>31) return false;
        return ( (1 << c) & code ) > 0;
    }
    
    static public void main(String [] s)
    {
         init("en");
         Systemroles r1 = new Systemroles(3);
         Systemroles r2 = new Systemroles(2);
        Toolbox.println(0,r1.toString());
         Toolbox.println(0, "" + r1.has(2));
         Toolbox.println(0, "" + r1.common(r2));
         String ss[] = {"System Administrator"};
        long x =  Systemroles.toCode(ss,0);
        Systemroles c = new Systemroles(x);
        boolean b = c.owndb();
        Toolbox.print(1,"" + x);
    }
}
