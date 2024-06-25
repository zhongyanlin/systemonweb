 
package telaman;

import java.util.List;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import telaman.JDBCAdapter;
import telaman.Systemroles;
import telaman.User;

import java.util.*;

 

public class DbTable {
    JDBCAdapter adapter = null;
    public int numTables = 0;
    public String[] tables = null;
    public String[] defs = null;
    public long[] owner = null;
    public boolean[] exists = null;
    public long[] times = null;
    String sortway = "alphabet";
    User user = null;
    public int nerr = 0;
    public String err = "";
    public String errjs = "";
    public boolean table2def = false;//true;
    static Pattern ab = Pattern.compile("[a-z|A-Z][^ ]*[ ]");

    public void init() 
    {
        int kk=0;
        String[] tbs = this.adapter.tableList();
        if (tbs == null) 
        {
            err = "empty db";
            return;
        }
        //adapter.close();
        for(; kk < tbs.length && !tbs[kk].equals("Apptables");kk++);
        if (kk == tbs.length)
        {
            String sql = "CREATE TABLE Apptables(lastupdate BIGINT, tname VARCHAR(30), definition TEXT, roles BIGINT, PRIMARY KEY(tname))";
            adapter.executeUpdate(sql);
            tbs = this.adapter.tableList();
        }
        
        boolean[] indef = new boolean[tbs.length];
        adapter.init(adapter.server, adapter.driver, adapter.username, adapter.password);
        kk = this.adapter.executeQuery("SELECT tname,definition,roles FROM Apptables ORDER BY tname"); 
           
        this.tables = new String[tbs.length + kk];
        this.defs = new String[tbs.length + kk];
        this.owner = new long[tbs.length + kk];
        this.exists = new boolean[tbs.length + kk];
        int[] a = new int[tbs.length + kk];
        int j = 0;
        int i = 0;
        boolean[] need = new boolean[kk];
        for (i = 0; this.adapter.getValueAt(i,0)!=null; ++i) 
        {
            int k;
            this.tables[j] = this.adapter.getValueAt(i, 0);
            try {
                this.owner[j] = Long.parseLong(this.adapter.getValueAt(i, 2));
            }
            catch (Exception e) {
                this.owner[j] = Systemroles.TOTAL;
            }
            if (this.tables[j].equals("") || this.tables[j].indexOf("~") == 0) continue;
            
            if (this.exclude(this.adapter.dbms, this.tables[j], this.owner[j])) continue;
            for (k = 0; !(k >= tbs.length || tbs[k].toLowerCase().equals(this.tables[j].toLowerCase())); ++k) {
            }
            this.defs[j] = this.adapter.getValueAt(i, 1);
            
            if (k < tbs.length) {
                String realkey;
                this.exists[j] = true;
                indef[k] = true;
                String fields = this.findfds(this.defs[j]).replaceAll(" ", "").replaceAll("\n", "");
                String realf = this.adapter.tabledef(this.tables[j], null);
                realf = this.findfds(realf).replaceAll(" ", "").replaceAll("\n", "");
                boolean t = false;
                if (!fields.toLowerCase().equals(realf.toLowerCase())) {
                    need[j] = true;
                    t = true;
                    ++this.nerr;
                    this.err = this.err + "<a href=javascript:showme('" + this.tables[j] + "')>" + this.tables[j] + "</a><br>";
                    this.errjs = this.errjs + "errtable['" + this.tables[j] + "']='<b>Real:</b>" + realf + "<br><b>Defi:</b><font color=#001122>" + fields + "</font>';\n";
                }
                String defkey = this.findkeys(this.defs[j]);
                if (!((realkey = this.adapter.keyFields(this.tables[j])).equals("") || this.thesame(defkey, realkey))) {
                    if (!t) {
                        ++this.nerr;
                        this.err = this.err + "<a href=javascript:showme('" + this.tables[j] + "')>" + this.tables[j] + "</a><br>";
                        this.errjs = this.errjs + "errtable['" + this.tables[j] + "']='";
                    } else {
                        this.errjs = this.errjs + "errtable['" + this.tables[j] + "']+='<br>";
                    }
                    this.errjs = this.errjs + "<b>Real PRIMARY KEY:</b>" + realkey + "<br><b>Def PRIMARY KEY:</b><font color=#001122>" + defkey + "</font>';\n";
                }
            } else {
                this.exists[j] = false;
                this.err = this.err + "<nobr>" + this.tables[j] + "does not exist</nobr><br>";
                ++this.nerr;
            }
            int n = j;
            a[n] = j++;
        }
        for (i = 0; i < kk; ++i) {
            if (!need[i]) continue;
            this.syntabledef(this.adapter, this.tables[i], this.defs[i]);
        }
        if (this.table2def) {
            for (i = 0; i < tbs.length; ++i) {
                if (indef[i]) continue;
                if (tbs[i] == null) continue;
                this.tables[j] = tbs[i];
                if (this.tables[j].equals("") || this.tables[j].indexOf("~") == 0) continue;
                if (this.exclude(this.adapter.dbms, this.tables[j], this.user.roles)) continue;
                this.defs[j] = this.adapter.tabledef(this.tables[j], this.adapter.dbms);
                if (this.defs[j] == null) continue;
                if (this.defs[j].equals("")) continue;
                this.adapter.executeUpdate("INSERT INTO Apptables(lastupdate,tname,definition,roles)values(120000000,'" + this.tables[j] + "','" + this.defs[j].replaceAll("'", "''") + "'," + this.user.roles + ")");
                this.owner[j] = this.user.roles;
                this.exists[j] = true;
                int n = j;
                a[n] = j++;
            }
        }
        this.numTables = j;
      
        if (this.sortway.equals("alphabet")) {
            this.asort(a, this.tables, j);
        } else {
            this.bsort(a, this.tables, this.defs, j);
        }
        this.swap(a, this.tables, j);
        this.swap(a, this.defs, j);
        this.swap(a, this.owner, j);
        this.swap(a, this.exists, j);
    }
    public DbTable(JDBCAdapter adapter, User user, String sortway) {
        this.adapter = adapter;
        this.user = user;
        this.sortway = sortway;
        
    }

    int reftimes(String str) {
        int i = -2;
        int j = 0;
        while ((i = str.indexOf("REFERENCES", i + 2)) > 0) {
            ++j;
        }
        return j;
    }

    void swap(int[] a, String[] t, int N) {
        int i;
        String[] b = new String[N];
        for (i = 0; i < N; ++i) {
            b[i] = t[i];
        }
        for (i = 0; i < N; ++i) {
            t[i] = b[a[i]];
        }
    }

    void swap(int[] a, long[] t, int N) {
        int i;
        long[] b = new long[N];
        for (i = 0; i < N; ++i) {
            b[i] = t[i];
        }
        for (i = 0; i < N; ++i) {
            t[i] = b[a[i]];
        }
    }

    void swap(int[] a, boolean[] t, int N) {
        int i;
        boolean[] b = new boolean[N];
        for (i = 0; i < N; ++i) {
            b[i] = t[i];
        }
        for (i = 0; i < N; ++i) {
            t[i] = b[a[i]];
        }
    }
    static void dfs(List<Integer>[] graph, boolean[] used, List<Integer> res, int u) {
    used[u] = true;
    for (int v : graph[u])
      if (!used[v])
        dfs(graph, used, res, v);
    res.add(u);
  }

  static List<Integer> topologicalSort(List<Integer>[] graph) 
  {
    int n = graph.length;
    boolean[] used = new boolean[n];
    List<Integer> res = new ArrayList(); 
    for (int i = 0; i < n; i++)
      if (!used[i])
        dfs(graph, used, res, i);
    Collections.reverse(res);
    return res;
  }
    void bsort(int[] a, String[] t, String[] d, int N) 
    {
        
        List<Integer>[] g = new List[N];
        for (int i = 0; i < N; i++) 
        {
           g[i] = new ArrayList();
        }
        int q[] = new  int[N]; 
        for (int p = 0; p < N; ++p) 
        {
            for (int j = 0; j < N; ++j) 
            {
                 
                if (  d[a[j]].toLowerCase().indexOf("references "   + t[a[p]].toLowerCase()) > 0
                   || d[a[j]].toLowerCase().indexOf("references  "  + t[a[p]].toLowerCase()) > 0
                   || d[a[j]].toLowerCase().indexOf("references   " + t[a[p]].toLowerCase()) > 0) 
                {
                    g[p].add(j);
                    q[a[p]] = 1;
                    q[a[j]] = 1;
                } 
                    //g[j].add(p); 
            }
        }
        List<Integer> res = topologicalSort(g);
        int [] xx = new int[N]; 
        int j = 0;
        for (int i = 0; i < N; i++) 
        {
            a[i] = res.get(i).intValue();
            if (q[a[i]] == 0)
            {
                xx[j++] = a[i];
                a[i] = -1;
                
            }
            
        }
        int i=0, k=0;
        for (i = 0; i < N; i++) 
        {
            if (k == N) break;
            while (k < N && a[k] == -1)k++;
            if (k == N) break;
            a[i] = a[k];
          
            if (k < N && k > i) a[k] = -1;
        }
        
        j=0;
        while (i < N)
        {
            a[i++] = xx[j++];
        }
    }

    void asort(int[] a, String[] t, int N) {
        for (int p = 1; p < N; ++p) {
            for (int j = 0; j < N - p; ++j) {
                if (t[a[j]].compareTo(t[a[j + 1]]) < 0) continue;
                int tmp = a[j];
                a[j] = a[j + 1];
                a[j + 1] = tmp;
            }
        }
    }

    boolean exclude(String dbms, String tbs, long roles) {
        return dbms.equals("sqlserver") && tbs.indexOf("spt_") == 0 || (this.user.roles & Systemroles.SYSTEMADMIN) == 0 && (this.user.roles & roles) == 0;
    }

    String findkeys(String def) {
        def = def.replaceAll("'[^']*'", "");
        int l = def.toLowerCase().indexOf("primary ");
        if (l == -1) {
            return "";
        }
        l = def.indexOf("(", l);
        int j = def.indexOf(")", l);
        return def.substring(l + 1, j).trim().replaceAll("\\s", "");
    }

    String findfds(String def) {
        return DbTable.findfds0(def, DbTable.ab);
    }
    
      

    public static String findfds0(String def, Pattern ab) {
        def = def.replaceFirst("[^\\(]*\\(", "");
        def = def.replaceAll("DEFAULT '[^']*'", "");
        Matcher m = ab.matcher((CharSequence)def);
        int k = 0;
        String fds = "";
        while (m.find(k)) {
            String fd;
            String lfd;
            if ((lfd = (fd = def.substring(m.start(), m.end())).toLowerCase()).indexOf("primary ") == 0 || lfd.indexOf("foreign ") == 0 || lfd.indexOf("check ") == 0) {
                return fds;
            }
            if (!fds.equals("")) {
                fds = fds + ",";
            }
            fds = fds + fd;
            k = m.end();
            if ((k = def.indexOf(",", k)) != -1) continue;
            return fds;
        }
        return fds;
    }

    boolean thesame0(String x, String y) {
        boolean j = false;
        int k = 0;
        x = "," + x + ",";
        y = "," + y + ",";
        for (int i = 1; i < x.length(); ++i) {
            if (x.charAt(i) != ',') continue;
            if (y.indexOf(x.substring(k, i + 1)) < 0) {
                return false;
            }
            k = i;
        }
        return true;
    }

    boolean thesame(String x, String y) {
        return this.thesame0(x, y) && this.thesame0(y, x);
    }

    public String syntabledef(JDBCAdapter adapter, String tablename, String def) {
        String err = "";
        String[] fs = this.findfds(def).split(",");
        String[] x = adapter.fieldList(tablename);
        for (int i = 0; i < fs.length; ++i) {
            int k;
            String z = fs[i].trim().toLowerCase();
            for (k = 0; k < x.length; ++k) {
                if (z.compareToIgnoreCase(x[k]) == 0) break;
            }
            if (k < x.length) continue;
            int j = def.toLowerCase().indexOf(z);
            while (j > 0 && def.substring(j - 1, j).matches("[a-z|A-Z]")) {
                j = def.toLowerCase().indexOf(z, j + 2);
            }
            int state = 0;
            for (k = j; k < def.length(); ++k) {
                if (def.charAt(k) == '\'') {
                    state = 1 - state;
                }
                if (def.charAt(k) == ',' && state == 0) break;
            }
            String addcol = "ALTER TABLE " + tablename + " ADD COLUMN " + def.substring(j, k);
             
            int sindex = Toolbox.begintranslate("mysql");
            int tindex = Toolbox.begintranslate(adapter.dbms);
            addcol =  Toolbox.translateStr(addcol,sindex,tindex);
            j = adapter.executeUpdate(addcol);
            err = err + adapter.error() + "\n\n";
        }
        return err;
    }

    public static void syntable(DBAdmin dbadmin,HashMap<String,String> tbl)
    {
        JDBCAdapter adapter = Toolbox.getUserAdapter(dbadmin.sysDBConnectInfo(),dbadmin.orgnum);
        int n = 0;
        boolean b =  adapter.executeQuery2("SELECT tname,definition,roles FROM Apptables ORDER BY tname",false);
        HashMap<String,String> oldtbl = new HashMap<>();
        for (int i=0; b && adapter.getValueAt(i, 1)!=null; i++)
        {
            String def = adapter.getValueAt(i, 1).trim();
            String tn = adapter.getValueAt(i, 0);
            if (tn.length() < 2) continue;
            String v = tbl.get(tn);
            if (v == null) continue;
            if (v.replaceAll("[\r|\n]+"," ").trim().equals(def.replaceAll("[\r|\n]+"," "))) 
            {
                tbl.remove(tn);
               
            }
            else oldtbl.put(tn, def);
            n++;
        }
        
        adapter.close();
        
        if (tbl==null || tbl.size() == 0) return;
        String w = "";
        java.util.Set<String> e = tbl.keySet();
        for (String tn: e)
        {
             
            String def = (String)(tbl.get(tn));
             
            String olddef = (String)(oldtbl.get(tn));
            if (olddef == null)
            {
                if (!w.equals("")) w += ";";
                w += def + ";INSERT INTO Apptables (lastupdate,tname,definition,roles) VALUES (1111111,'"  + tn + "','" + def.replaceAll("'", "''") + "'," + Systemroles.TOTAL + ")";
                continue;
            }
            
            String []x = parsefields(def);
            
            boolean has = false;
            for (int k=0; k < x.length; k++)
            {
                if (olddef.indexOf(x[k]) < 0)
                {
                    
                    if (!w.equals("")) w += ";";
                    
                    w += "ALTER TABLE " + tn + " ADD COLUMN " + x[k] ;
                    has = true;
                }
            }
            if (has)
            {
                w +=  ";UPDATE Apptables SET definition='" + def.replaceAll("'", "''") + "' WHERE tname='" + tn + "'";
            }
        }
        if (!w.equals(""))  dbadmin.doforalldb(w, true, false);
        tbl.clear(); 
    }
    static public String [] parsefields(String def)
    {
        Vector<String> x = new Vector<>();
        int l = def.indexOf("(") + 1;
        int k = l;
        int state = 0;
        while (k <  def.length() ) 
        {
            if ( def.charAt(k) == '\'') 
            {
                    state = 1 - state;
            }
            if ( (state == 0 && def.charAt(k) == ',') || k == def.length()-1)
            {
                String z = def.substring(l,k).trim();
                String y = z.toLowerCase();
                if (y.indexOf("primary ") == 0 || y.indexOf("check ") == 0 || y.indexOf("foreign ") == 0) break;
                x.addElement(z);
                l = k+1;
            }
            k++;
        }
        String w[] = new String[x.size()];
        for (k=0; k < w.length; k++)
           w[k] = x.elementAt(k);
        return w;
    }
}
