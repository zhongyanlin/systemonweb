 
package telaman;

import cern.colt.Arrays;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.HashMap;
import java.util.Vector;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
 
import static telaman.Generic.storedProcLang;

public class Task 
{
    FileWriter cout = null;
    HashMap<String,String> js = new HashMap<>();
    Vector<String> missed = new Vector();
    JDBCAdapter adapter = null;
    Vector<String> jsw = new Vector();
    String[] savedkeywords = null;
    static final Pattern aswhere = Pattern.compile("[\n| ][a|A][s|S][\n| ]+");
    static Pattern questmark = Pattern.compile("\\?\\?[^\\?]+\\?\\?");
    static final Pattern rdapwhere = Pattern.compile("[&|\\?]rdap=[\\w]+");
    int rdapNo = 0;
    static String wn = "";
    static Pattern atat = Pattern.compile("@[0-9]+@");
    static Pattern dodo = Pattern.compile("\\$[0-9]+\\$");
    static Pattern pp = Pattern.compile("\\|[0-9]+\\|");
    static Pattern qp = Pattern.compile("[1|2][0-9]{1,4}");
    static final Pattern textmsg = Pattern.compile("textmsg\\[[0-9]+\\]");
    static final Pattern msg = Pattern.compile("box\\.emsgs\\([^,]+,[ ]*[0-9]+");
    static final Pattern msg1 = Pattern.compile("box\\.msgs\\[[^\\]]+\\]\\[[0-9]+"); 
    
    public synchronized String Listing(JDBCAdapter jd, int orgnum) {
        int en;
        int G = Generic.storedProc.size();
        int k = 0;
        int n = 0;
        System.setProperty("file.encoding", "UTF-8");
        String language = Toolbox.langs[orgnum>>16];
        boolean genattr = false;
        String er = this.makejs(true,language); 
        if (er != null) {
            return er;
        }
        FileWriter out = null;
        if (this.adapter == null) {
            this.adapter = jd;
        }
        if ((en = this.makekeywords()) < 0) {
            this.adapter.close();
            return "1: " + this.adapter.error();
        }
        er = "";
        Webform w = null;
        int step = 0;
        (new File(Toolbox.installpath + File.separator +  "maintain" + Toolbox.langs[orgnum>>16] + ".js")).delete();
        
        try 
        {
            out = new FileWriter(Toolbox.installpath + File.separator +  "maintain" + Toolbox.langs[orgnum>>16] + ".js", false);
        }
        catch (Exception e) {}
        java.util.Set<String> e = Generic.storedProc.keySet();
        for (String nm:e) 
        {
            w = (Webform)(Generic.storedProc.get(nm));
            if (w.query == null  || w.format.equals("Web")) continue; 
            if (Toolbox.langnum!=(orgnum>>16))
            {   
                w = new Webform(w);
                 
                WebformLang ws = storedProcLang.get(w.name + "," + Toolbox.langs[orgnum>>16]);
                 
                if (ws!=null)  applyStoredLang(orgnum,w,ws);
                
            }
            
            if (w.title == null) {
                w.title = "";
            }
            step = 0;
            String[] back = new String[1];
            int ii = 0;
            try 
            {
                int i;
                String xx = ("h[" + k + "]=[\"" + w.name + "\",\"" + Generic.handle1(w.title) + "\",\"" + w.format + "\",\"" + Task.parameters(w).replaceFirst(",$", "").replaceAll("\n","").replaceAll("\"","") + "\",\"" + Generic.handle1(Task.findlink(w.query)).replaceFirst(",$", "") + "\",\"" + Generic.handle1(this.selectstr(w, back)) + "\",\"" + Generic.handle1(back[0]) + "\"];\r\n");
                out.append(xx);
                
                if (!(this.adapter == null || back[0] == null || back[0].equals(""))) 
                {
                    this.adapter.executeUpdate("UPDATE TaskLang SET keywords='" + back[0] + "' WHERE name='" + w.name + "' AND keywords='' AND language='"  + language + "'");
                }
                ii = 1;
                xx =("hp[" + k + "]=\"" + Generic.handle1(w.help) + "\";\r\n");
                out.append(xx);
                String[] attrs = w.attrs;
                if (w.attrs == null && w.fields != null) {
                    attrs = new String[w.fields.length];
                    for (i = 0; i < w.fields.length; ++i) {
                        attrs[i] = "   ";
                    }
                }
                ii = 2;
                if (w.fields != null && w.labels == null) {
                    w.labels = w.fields;
                }
                ii = 3;
                if (!w.validate()) {
                    Toolbox.println(1, " null field in " + w.name + ": " + w.fieldstr());
                }
                ii = 4;
                if (w.fields != null) {
                    String[] orders = (w.positions == null || w.positions.trim().equals("") ? "0" : w.positions.trim()).split("[ ]*,[ ]*");
                    String[] positions = new String[w.fields.length];
                    for (i = 0; i < w.fields.length; ++i) {
                        positions[i] = i < orders.length ? orders[i] : "" + i;
                    }
   ii = 5;           
                    if (w.fields!=null)
                    for (i = 0; i < w.fields.length; ++i) 
                    {
                        String tt;
                        if ((tt = w.labels[i]) == null || tt.equals("")) 
                        {
                            tt = " ";
                        }
                        step = 200 + i;
                        boolean one = false;
                        if (tt.charAt(tt.length() - 1) == '1') 
                        {
                            tt = tt.replaceFirst("1$", "");
                            one = true;
                        }
ii = 6; 
                        step = 300 + i;
                        if (w.labels[i]!=null && (tt = this.wordorder(tt,orgnum)).equals("")) 
                        {
                            if (w.labels[i].matches("[a-z|0-9|A-Z]+")) 
                            {
                                tt = w.labels[i];
                            } 
                            else 
                            {
                                int j = 0;
                                int KK = 0;
                                if (this.savedkeywords != null) {
                                    KK = this.savedkeywords.length;
                                }
                                for (; !(j >= this.missed.size() || w.labels[i].equals((String)this.missed.elementAt(j))); ++j) {
                                }
                                if (j < this.missed.size()) {
                                    tt = "3" + (j + KK);
                                } else {
                                    tt = "3" + (this.missed.size() + KK);
                                    this.missed.addElement(w.labels[i]);
                                }
                            }
                            step = 400 + i;
                        }
 ii = 7; 
                        step = 500 + i;
                        if (tt.equals("")) 
                        {
                            tt = " ";
                        }
                        if (one) 
                        {
                            tt = tt + "_1";
                        }
                        xx =("m[" + n + "]=['" + (w.labels[i] != null ? w.labels[i].trim() : "") + "','" + (w.ctypes!=null?w.ctypes[i]:"") + "','" + attrs[i] + "'," + k + ",'" + tt + "','" + positions[i] + "','" + (w.fields!=null?w.fields[i]:"") + "',\"" + (w.defaultv!=null?Generic.handle1(w.defaultv[i]):"") + "\"];\r\n");
                        out.append(xx ); 
                        ++n;
 ii = 8; 
                    }
                }
 
                ++k;
            }
            catch (Exception ex) {
                er = er + w.name + ": " + ex.toString() + " " + ii +  "<br>";
            }
        }
        this.js.clear();
        this.jsw.clear();
        if (this.adapter != null) {
            this.adapter.close();
        }
        try {
            out.close();
        }
        catch (Exception e1) {
            // empty catch block
        }
        
        return er;
    }

    void out(String s) {
        if (this.cout != null) {
            try {
                this.cout.write(s);
            }
            catch (Exception e) {
                // empty catch block
            }
        }
    }

    void outln(String s) {
        if (this.cout != null) {
            try {
                this.cout.write(s + "\n");
            }
            catch (Exception e) {
                // empty catch block
            }
        }
    }

    String padd(String n) {
        if (n.length() == 1) {
            return "000" + n;
        }
        if (n.length() == 2) {
            return "00" + n;
        }
        if (n.length() == 3) {
            return "0" + n;
        }
        return n;
    }

    String wordorder(String s,int orgnum) {
        int i;
        String s1 = s.replaceAll("([a-z])([A-Z])", "$1 $2");
        for (i = 0; !(i >= Toolbox.msgs[0].length || Toolbox.emsgs(orgnum,i) != null && (s.equals(Toolbox.emsgs(orgnum,i)) || s1.equals(Toolbox.emsgs(orgnum,i)))); ++i) {
        }
        if (i < Toolbox.msg.length) {
            return "1" + this.padd(new StringBuilder().append("").append(i).toString());
        }
        if (this.js != null) {
            String n;
            if ((n = (String)this.js.get(s)) == null) {
                n = (String)this.js.get(s1);
            }
            if (n != null) {
                return "2" + this.padd(n);
            }
        }
        return s;
    }

    public synchronized String makejs(boolean hash, String language) 
    {
        String str = Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "conf" + File.separator +  language + "s.txt";
        if ((new File(str)).exists()==false) 
            str = str.replaceFirst("([^a-z])[\\-|a-z|A-Z]+s\\.txt$","$1ens.txt");
        String j = "";
        String jline = "";
        int jj;
        try 
        {
            FileInputStream fin = new FileInputStream(new File(str));
            InputStreamReader esr = new InputStreamReader(fin);
            BufferedReader ebr = new BufferedReader(esr);
            String aline = null;
            while ((aline = ebr.readLine()) != null) 
            {
                if ((aline = aline.trim()).length() < 2) continue;
                int l = aline.indexOf(" ");
                
                String num = aline;
                if ( l > 0)
                {
                  if (aline.charAt(0) == '+') continue;
                  num = aline.substring(0, l).trim();
                  
                  jline = aline.substring(l + 1).trim();
                }
                
                j = num;
                if (hash && jline.length() < 50) 
                {
                    js.put(jline, num);
                }
                jj = Integer.parseInt(j);
                if (jj == jsw.size())
                {
                    jsw.addElement(jline);
                }
                else  
                {
                    Toolbox.println(0, "Error in Js file: " + aline);
                }
            }
            fin.close();
        }
        catch (Exception e) 
        {
            return "User Interface File " + str + " Callpsed " + j + "\n" + e.toString();
        }
        jslength = jsw.size();
        return null;
    }
    int jslength = 0;

    void writemissed(int K, String language) 
    {
        int i;
        boolean needclose = false;
        if (this.adapter == null) 
        {
          //  this.adapter = new JDBCAdapter(DBAdmin.sysDBConnectInfo());
            needclose = true;
        }
        long l = System.currentTimeMillis() / 1000;
        String[] tmp = new String[K];
        for (i = 0; i < K; ++i) {
            tmp[i] = this.savedkeywords[i];
        }
        this.savedkeywords = new String[K + this.missed.size()];
        for (i = 0; i < K; ++i) {
            this.savedkeywords[i] = tmp[i];
        }
        for (i = 0; i < this.missed.size(); ++i) {
            this.savedkeywords[i + K] = (String)this.missed.elementAt(i);
            this.adapter.executeUpdate("INSERT INTO DomainValue(lastupdate,domain,domainValue,code,language) SELECT  " + l + ",'Keywords','" + this.savedkeywords[i + K].replaceAll("'", "''") + "', 1+max(code),'" + language + "' from DomainValue WHERE domain='Keywords'");
        }
        if (needclose) {
            this.adapter.close();
        }
    }


    public static void extratAttr(ResultSet resultSet, String[] ft) {
        ft[0] = "";
        ft[1] = "";
        ft[2] = "";
        StringBuffer a = new StringBuffer("");
        try {
            ResultSetMetaData metaData = resultSet.getMetaData();
            int numberOfColumns = metaData.getColumnCount();
            for (int column = 0; column < numberOfColumns; ++column) {
                int k;
                if (column > 0) {
                    String[] arrstring = ft;
                    arrstring[0] = arrstring[0] + ",";
                    String[] arrstring2 = ft;
                    arrstring2[1] = arrstring2[1] + ",";
                    a.append(",");
                }
                a.append(metaData.isNullable(column + 1) == 1 ? "1" : "0");
                int type = metaData.getColumnType(column + 1);
                switch (type) {
                    case -7: 
                    case -6: 
                    case -5: 
                    case 1: 
                    case 2: 
                    case 3: 
                    case 4: 
                    case 5: 
                    case 6: 
                    case 7: 
                    case 8: {
                        a.append("1");
                    }
                }
                a.append("0");
                int maxs = 0;
                try {
                    maxs = metaData.getColumnDisplaySize(column + 1);
                    if (maxs > Toolbox.maximumAreaSize) {
                        maxs = Toolbox.maximumAreaSize;
                    }
                }
                catch (Exception e) {
                    maxs = 100;
                }
                String tt = String.valueOf(maxs);
                a.append(tt);
                String dn = metaData.getColumnLabel(column + 1);
                if (dn.equals("")) {
                    dn = "exp" + column;
                }
                if ((k = dn.indexOf("_")) == -1) {
                    String[] arrstring = ft;
                    arrstring[0] = arrstring[0] + dn;
                    String[] arrstring3 = ft;
                    arrstring3[1] = arrstring3[1] + "T";
                } else {
                    String[] arrstring = ft;
                    arrstring[0] = arrstring[0] + dn.substring(0, k);
                    String[] arrstring4 = ft;
                    arrstring4[1] = arrstring4[1] + dn.substring(k + 1);
                }
                ft[2] = a.toString();
            }
        }
        catch (Exception e) {
            Toolbox.println(1, "Fail to get meta" + e.toString());
        }
    }

    public static String findlink(String str) {
        int i;
        StringBuffer bf = new StringBuffer();
        Matcher m = Task.rdapwhere.matcher((CharSequence)str);
        int k = 0;
        while (m.find(k)) {
            if (bf.length() != 0) {
                bf.append(",");
            }
            i = m.start() + 6;
            k = m.end();
            bf.append(str.substring(i, k));
        }
        m = Pattern.compile("[\\w]+\\.jsp").matcher((CharSequence)str);
        k = 0;
        while (m.find(k)) 
        {
            if (bf.length() != 0) 
            {
                bf.append(",");
            }
            i = m.start();
            k = m.end();
            bf.append(str.substring(i, k));
        }
        return bf.toString();
    }

    public static void findquestmark(String s, StringBuffer bf) {
        if (s == null) {
            return;
        }
         
        Matcher m = Task.questmark.matcher(s);
        int k = 0;
        while (m.find(k)) 
        {
            int l = m.start();
            k = m.end();
            if (k < l+4) continue;
            String t = s.substring(l + 2, k - 2);
            if (k - l > 25
                || t.equals("wcds") 
                || t.equals("CURRENT_USER") 
                || t.equals("CURRENT_TIME")
                || t.equals("Langcode") 
                || bf.indexOf("," + t + ",") >= 0 
                || bf.indexOf(t + ",") == 0
                || !t.replaceAll("[a-z|0-9|A-Z]","").equals(""))
            {
 
                if (k-l>25) k -= 2;
                continue;
            }
            bf.append(t + ",");
        }
       
    }

    public static String parameters(Webform w) {
        StringBuffer bf = new StringBuffer("");
        Task.findquestmark(w.title, bf);
        
        Task.findquestmark(w.query, bf);
        Task.findquestmark(w.insertQuery, bf);
        Task.findquestmark(w.updateQuery, bf);
        Task.findquestmark(w.deleteQuery, bf);
        Task.findquestmark(w.webService, bf);
        Task.findquestmark(w.help, bf);
        return bf.toString();
    }

    int countdel(String x, char c) 
    {
        if (x == null) 
        {
            return -1;
        }
        if (x.equals("")) 
        {
            return 0;
        }
        int n = 0;
        for (int i = x.length() - 1; i >= 0; --i) 
        {
            if (x.charAt(i) != c) continue;
            ++n;
        }
        return n;
    }
    String rdapname;
    int thisii;
    
    public String getlang(Webform w, int orgnum)
    {
          String language = Toolbox.langs[orgnum>>16]; 
          String ct; String keywords; String x;
          String fd; String tl; String help; String def;
          String [] y = encodelang.get(language+w.name);
          if (y == null) return "";
          for (int i=0; i < y.length; i++)
          {
              if (y[i]!=null) y[i] = trim(y[i]);
          }
          return  this.memmodify(orgnum,w, y[0], y[1], y[2], y[5], y[3], y[4], y[6]);
    }
    
    public String applyLang(Webform w, int orgnum) 
    {
       
        int k;
        String language = Toolbox.langs[orgnum>>16];
        String sq;
        String rdap =  w.name;
        String err = "##format=" + w.format ;
        if (w == null || w.query == null ) 
        {
            return err;
        }
        if (w.format!=null && !w.format.equals("Update")) 
        {
            String sq1 = "SELECT fieldlabels, ctypes, orders,title,help,keywords,defaultv FROM TaskLang WHERE rdapname='" + w.name.replaceAll("'", "''") + "' AND language='" + language + "'";
 
            if ( this.adapter.executeQuery2(sq1,false) && this.adapter.getValueAt(0, 0)!=null) 
            {
                String fieldlabels = trim(this.adapter.getValueAt(0, 0));
                String ctypes = trim(this.adapter.getValueAt(0, 1));
                String orders = trim(this.adapter.getValueAt(0, 2));
                String title = trim(this.adapter.getValueAt(0, 3));;
                String help = trim(this.adapter.getValueAt(0, 4)); 
                String keywords = trim(this.adapter.getValueAt(0, 5)); 
                String defaultv = trim(this.adapter.getValueAt(0, 6));
     
                err = this.memmodify(orgnum,w, fieldlabels, ctypes, orders, keywords,title,help,defaultv);
            
            } 
            else   
            {
                
                String xx = w.positions;
                
                if (xx!=null) xx = "'" + xx + "'";
                else xx = "NULL";
                
                for (int j=0; j < Toolbox.langs.length;j++)
                {
                sq = "INSERT INTO TaskLang(lastupdate,rdapname,fieldlabels,ctypes,orders,title,help,keywords,defaultv,language) VALUES(" + (System.currentTimeMillis() / 1000) + ",'" + rdap + "','" + w.formstr(w.labels) + "','" + w.formstr(w.ctypes) + "'," + xx + ",'" + w.title.replaceAll("'","''")  + "','','','','" + Toolbox.langs[j] + "')";
                 
                if ((k = this.adapter.executeUpdate(sq)) != 1) 
                {    
                    // Toolbox.println(0, this.adapter.error() + sq  );
                }
                
                }
             
            }
             
        } 
        else 
        {
            String sq1 = "SELECT fieldlabels, ctypes, orders,title,help,keywords,defaultv FROM TaskLang WHERE rdapname='" + w.name.replaceAll("'", "''") + "' AND language='" + language + "'";
            
            if (this.adapter.executeQuery2(sq1,false) && adapter.getValueAt(0, 0)!=null) 
            {
                String x00 = adapter.getValueAt(0, 0);
                if (x00 == null) x00 = "";
                w.labels = x00.split(",");
                if (!x00.equals("")) 
                {
                    for (int ii = 0; ii < w.labels.length; ii++) 
                    {
                        thisii = ii;
                        w.labels[ii] = c2w(w.labels[ii],orgnum);
                    }
                }
                w.title = adapter.getValueAt(0, 3);
                if (w.title==null) w.title = "";  
                               // Generic.storedProcLang.put(w.name +","+ language, new WebformLang(adapter.getValueAt(0, 0),null,null,w.title,null,null,null));
                
            } 
            else 
            {
                Pattern p = Pattern.compile("\\?\\?[a-z|A-Z]+\\?\\?");
                Matcher m = p.matcher(w.query);
                int k1 = 0;
                String lb = "";
                String or = "";
                String ct = "";
                int ii = 0;
                while (m.find(k1)) 
                {
                    int i = m.start();
                    k1 = m.end();
                    String xx = w.query.substring(i + 2, k1 - 2);
                    if (("," + lb + ",").indexOf("," + xx + ",") < 0) {
                        if (!lb.equals("")) {
                            lb += ",";
                            or += ",";
                            ct += ",";
                        }
                        lb += xx;
                        or += (ii++);
                        ct += (w.query.charAt(i - 1) == '\'') ? "T" : "N";

                    }
                }
                if (or!=null) 
                    or = "'" + or + "'";
                else
                    or = "NULL";
                for (int l=0; l < Toolbox.langs.length;l++)
                {
                    sq = "INSERT INTO TaskLang(lastupdate,rdapname,fieldlabels,ctypes,orders,title,help,keywords,defaultv,language) VALUES(" + (System.currentTimeMillis() / 1000) + ",'" + rdap + "','" + lb + "','" + ct + "'," + or + ",'" + w.title.replaceAll("'","''") + "','','','','" + Toolbox.langs[l] + "')";
                    if ((k = this.adapter.executeUpdate(sq)) != 1) 
                    {
                        // Toolbox.println(0, this.adapter.error() + sq  );
                    }
                }
            }
        }
        thisii = -1;
         
        return err;
    }
    public void applyStoredLang(int orgnum, Webform w, WebformLang x)
    {
         String language = Toolbox.langs[orgnum>>16];
         if (!w.format.equals("Update"))
            memmodify(orgnum,w, x.fieldlabels, x.ctypes, x.orders, x.keywords,x.title,x.help,x.defaultv);
         else
         {
                w.labels = x.fieldlabels.split(",");
                w.title = x.title;
         }
    }
    public void cacheLang( String rdap, String language) 
    {
        if ( adapter == null) 
        {
             adapter =Toolbox.getSysAdapter(0);
        }
        if (rdap == null)
        {
             return;
        }
         
        String err = "";
        String [] langs = new String[]{language};//, Toolbox.langs[Toolbox.langnum],Toolbox.langs[0]};
        for (int i=0; i < langs.length; i++)
        {
           String  sq = "SELECT fieldlabels, ctypes, orders,title,help,keywords,defaultv FROM TaskLang WHERE rdapname='" + rdap.replaceAll("'", "''") + "' AND language='"  + langs[i] + "'";
           int k;   
           
            if ( this.adapter.executeQuery2(sq,false) && this.adapter.getValueAt(0, 0)!=null) 
            {
                String fieldlabels = trim(this.adapter.getValueAt(0, 0));
                String ctypes = trim(this.adapter.getValueAt(0, 1));
                String orders = trim(this.adapter.getValueAt(0, 2));
                String title = trim(this.adapter.getValueAt(0, 3));;
                String help = trim(this.adapter.getValueAt(0, 4)); 
                String keywords = trim(this.adapter.getValueAt(0, 5)); 
                String defaultv = trim(this.adapter.getValueAt(0, 6));
                Webform y = Generic.storedProc.get(rdap); 
                if (!y.format.equals("Update") && y.fields.length!=fieldlabels.split(",").length)
                {
                    Toolbox.println(1,langs[i] + ":" + rdap + ": " + Arrays.toString(y.fields) + " != " + fieldlabels);
                }
                Generic.storedProcLang.put(rdap + "," + language, new WebformLang(fieldlabels,ctypes,orders,title,help,keywords,defaultv));
                break;
            }
             
        }    
    }


    String trim(String s) {
        if (s == null) {
            return null;
        }
        return s.trim().replaceFirst("[ ]*\n$", "");
    }
    HashMap<String, String[]> encodelang = new HashMap<>();
    public void buildlang(String language)
    {
        if (this.adapter == null) 
        {
            this.adapter = Toolbox.getSysAdapter(0);
        }
        boolean b = adapter.executeQuery2("SELECT fieldlabels, ctypes, orders,title,help,keywords,defaultv, rdapname from TaskLang WHERE language='" + language + "'" , false);
        int i=0;
        for (; b && adapter.getValueAt(i, 7)!=null; i++)
        {
            String rdap = adapter.getValueAt(i, 7);
            encodelang.put(language+rdap, new String[]{adapter.getValueAt(i, 0),adapter.getValueAt(i,1),adapter.getValueAt(i,2),adapter.getValueAt(i,3),adapter.getValueAt(i, 4),adapter.getValueAt(i,5),adapter.getValueAt(i,6)});
        }
        adapter.close();
        adapter = null;
    }
    private Vector<String> misseddefaults = new Vector();
    public void applyAllLang(int orgnum) 
    {
        String language = Toolbox.langs[orgnum>>16];
        java.util.Set<String> e = Generic.storedProc.keySet();
         for (String name : e) 
         {
             Webform w = (Webform)(Generic.storedProc.get(name));
             applyLang(w, orgnum);
         }
    }

    public Task() {
    }

    public Task(JDBCAdapter a) {
        this.adapter = a;
    }

    public int makekeywords() {
        return 0;
        /*
        int k;
        boolean needclose = false;
        if (this.adapter == null) {
            this.adapter = new JDBCAdapter(DBAdmin.sysDBConnectInfo());
            needclose = true;
        }
        if ((k = this.adapter.executeQuery("select domainValue, code from DomainValue WHERE domain='Keywords' order by code")) > 0) {
            this.savedkeywords = new String[k];
            for (int i = 0; i < k; ++i) {
                try {
                    int j = Integer.parseInt(this.adapter.getValueAt(i, 1));
                    this.savedkeywords[j] = this.adapter.getValueAt(i, 0);
                    continue;
                }
                catch (Exception e) {
                    // empty catch block
                }
            }
        }
        if (needclose) {
            this.adapter.close();
        }
        return k;*/
    }

    public void close() {
        if (this.adapter != null) 
        {
            this.adapter.close();
        }
        this.jsw.clear();
    }

    public String forstr(String[] x) {
        StringBuffer bf = new StringBuffer();
        if (x != null) {
            for (int i = 0; i < x.length; ++i) {
                if (i > 0) {
                    bf.append(";");
                }
                bf.append(x[i]);
            }
        }
        return bf.toString();
    }

    public String modifyone(int orgnum,Webform w, String lbs, String ct, String orders, String keywords, String tl, String help, String defaultv, boolean needjs) {
        if (needjs) {
            //this.makejs(false);
        }
        String language = Toolbox.langs[orgnum>>16];
        int l = this.makekeywords();
        return this.memmodify(orgnum,w, lbs, ct, orders, keywords, tl, help, defaultv);
    }
    
    public String memmodify(int orgnum, Webform w, String labelstr, String ct, String ord, String keywords, String tl, String help, String defaultv) {
        if (w.format.equals("Merge")) {
            return "";
        }
        String language = Toolbox.langs[orgnum>>16];
        boolean goon = false;
        String[] ctypes = null;
        String[] labels = null;
        int N = 0;
        String err = "";
        String alink = "<a href=DataForm?rdap=tasklang&TaskName=" + w.name + " target=_blank>Meta data</a>";
        if (!(ct == null || ct.equals("") || labelstr == null || labelstr.equals("") || w.format.equals("Update"))) {
            if ((N = (ctypes = ct.split(",")).length) == (labels = labelstr.split(",")).length) {
                goon = true;
                 
                if (!(defaultv == null || defaultv.equals(""))) {
                    w.str2def(defaultv);
                } else {
                    String str = "";
                    boolean has = false;
                     
                    if (w.ctypes != null && w.defaultv != null && w.fields != null) {
                        for (int j = 0; j < w.ctypes.length; j++) {
                            if (w.defaultv[j] == null) {
                                w.defaultv[j] = "";
                            }
                            if (!w.defaultv[j].equals("")) {
                                has = true;
                                str += w.fields[j] + "=" + w.defaultv[j] + "\n";
                            }
                        }
                    }
                    if (has) {
                        String mised = "UPDATE TaskLang SET defaultv='" + str.replaceAll("=!", "=").replaceAll("'", "''") + "' WHERE rdapname='" + w.name.replaceAll("'", "''") + "' AND language='" + language + "'";
                        misseddefaults.addElement(mised);
                    }
                }
                
            } else {
                err = w.name + ": " + ct + " length differs from " + labelstr;
            }
        }
        if (goon) {
            try {
                if (w.labels != null && N != w.labels.length) {
                    err = w.name + ": w.labels.length=" + w.labels.length + ", but labelstr s length=" + N;
                    return "<script  type=text/javascript>function passfieldname(){return '" + w.fieldstr() + "';}</script>" + err + alink;
                }
                if (w.ctypes != null && N != w.ctypes.length) {
                    err = w.name + ": w.ctypes.length=" + w.ctypes.length + ", but labelstr s length=" + N;
                    return "<script  type=text/javascript>function passfieldname(){return '" + w.fieldstr() + "';}</script>" + err + alink;
                }
                if (w.labels == null) {
                    w.labels = new String[N];
                }
                if (w.ctypes == null) {
                    w.ctypes = new String[N];
                }
                for (int i = 0; i < N && i < w.ctypes.length; ++i) {
                    w.labels[i] = this.c2w(labels[i],orgnum);
                    thisii = i;
                    w.ctypes[i] = ctypes[i];
                }
                w.positions = ord;
                
            } catch (Exception ex) {
                err = w.name + ":\nformat=" + w.format + "\nct=" + ct + "\nlabelstr=" + labelstr + "\nct.length=" + (ctypes == null ? 0 : ctypes.length) + "\nlabel.length=" + (labels == null ? 0 : labels.length) + "\n" + ex.toString() + labelstr + ct + ord;
            }
        }
        thisii = -1;
        try {
          
            w.title = this.c2w1(tl,orgnum);
           
            if (!(help == null || help.equals(""))) {
                String qq = w.str2help(help);
                
                err += "unmatched fields in help:" + qq;
            }
            if (!(keywords == null || keywords.equals(""))) {
                this.captionsub(w, keywords);
            }
        } catch (Exception ex) {
            err += w.name + ex.toString();
        }
        if (err.equals("")) {
            return "";
        }
        return err.replaceAll("'", " ").replaceAll("\n", "<br>") + alink;
    }

    String subs(String s, String h) {
        int l;
        if (s == null) {
            return null;
        }
        if (!((l = s.indexOf(":")) <= 0 || l >= 15 || h == null || h.equals(""))) {
            s = h + s.substring(l);
        }
        return s;
    }

    void captionsub(Webform w, String captions) {
        if (captions == null || captions.equals("")) {
            return;
        }
        captions = captions.replaceAll(",", " ,");
        String[] caps = captions.split(",");
        for (int i = 0; i < caps.length; ++i) {
            caps[i] = caps[i].trim();
        }
        w.insertQuery = this.subs(w.insertQuery, caps[0]);
        w.updateQuery = caps.length > 1 ? this.subs(w.updateQuery, caps[1]) : this.subs(w.updateQuery, caps[0]);
        if (caps.length > 2) {
            w.deleteQuery = this.subs(w.deleteQuery, caps[2]);
        }
    }

    String selectstr(Webform w, String[] back) {
        String s = "";
        String cur = "";
        StringBuffer bf = new StringBuffer();
        int i = 0;
        while (i++ < 3) {
            if (i == 0) {
                s = w.insertQuery;
            } else if (i == 1) {
                s = w.updateQuery;
            } else if (i == 2) {
                s = w.deleteQuery;
            }
            if (s == null) continue;
            s = s.replaceFirst("^[\n| |\r]+", "");
            int l = s.indexOf(":");
            String aw = "";
            if (l > 0 && l < 15) {
                aw = s.substring(0, l);
            }
            if (!cur.equals("")) {
                cur = cur + ",";
            }
            cur = cur + aw;
            if (bf.length() > 0) {
                bf.append(",");
            }
            bf.append(aw);
        }
        back[0] = cur;
        return bf.toString();
    }

    String selectstrsub(String s, String words) {
        if (s == null || words == null) {
            return s;
        }
        Matcher m = Pattern.compile("\n[\r]*\n+").matcher((CharSequence)s);
        String[] wd = words.split(",");
        int x = 0;
        if (!m.find()) {
            return s;
        }
        int l = m.start();
        String s1 = s.substring(0, l);
        String s2 = s.substring(l);
        m = Pattern.compile("'[^']*'").matcher((CharSequence)s2);
        int e = 0;
        StringBuffer bf = new StringBuffer();
        while (m.find(e)) {
            int n = m.start();
            bf.append(s2.substring(e, n));
            e = m.end();
            String aw = s2.substring(n, e);
            if (aw.length() < 2 || aw.indexOf("?") >= 0 || aw.indexOf("&") > 0 || aw.indexOf("=") > 0) {
                bf.append(aw);
                continue;
            }
            if (x == wd.length) {
                bf.append(aw);
                break;
            }
            if ((aw = wd[x++]).matches("[0-9]+")) {
                int kk = Integer.parseInt(aw.substring(1));
                if (aw.charAt(0) == '1' && kk < Toolbox.msg.length) {
                    aw = Toolbox.emsg(kk);
                } else if (aw.charAt(0) == '2' && kk < this.jsw.size()) {
                    aw = (String)this.jsw.elementAt(kk);
                } else if (aw.charAt(0) == '3' && this.savedkeywords != null && kk < this.savedkeywords.length) {
                    aw = this.savedkeywords[kk];
                }
            }
            bf.append("'" + aw + "'");
        }
        bf.append(s2.substring(e));
        return s1 + bf.toString();
    }

    boolean verify(int[] orders) {
        int i;
        boolean[] t = new boolean[orders.length];
        for (i = 0; i < t.length; ++i) {
            if (orders[i] >= orders.length || orders[i] < 0) {
                return false;
            }
            t[orders[i]] = true;
        }
        for (i = 0; i < t.length; ++i) {
            if (t[i]) continue;
            return false;
        }
        return true;
    }
    
    String c2w(String tt, int orgnum) {
        boolean detailone = false;
        if (tt.indexOf("_1") >= 0 && tt.charAt(0)!='2') {
            detailone = true;
            tt = tt.replaceFirst("_1$", "");
        }
        
        if (tt.matches("[0-9]+")) 
        {
            try 
            {
                int j = Integer.parseInt(tt.substring(1));
             
                char c = tt.charAt(0);
                if (c == '1' && j < Toolbox.msg.length) {
                    tt = Toolbox.emsgs(orgnum,j);
                } else if (c == '2' && j < this.jsw.size()) {
                    
                    tt = (String)this.jsw.elementAt(j);
                    
                }
            }
            catch (Exception e) 
            {
                Toolbox.println(1, "tt=" + tt);
            }
        }
        
        if (detailone) {
            tt = tt + "1";
        }
        return tt;
    }
    
    Vector<String> sqlv = new Vector();
    
    
    String c2w2(String s, int orgnum) {
        if (s == null || s.equals("")) {
            return s;
        }
        int n = -1;
        try {
            n = Integer.parseInt(s);
            s = this.c2w(s,orgnum);
        }
        catch (Exception e) {
            // empty catch block
        }
        return s;
    }

    String c2w1(String s, int orgnum) {
        String x;
        if (s == null || s.equals("")) {
            return s;
        }
        StringBuffer bf = new StringBuffer();
        Matcher m = Task.qp.matcher((CharSequence)s);
        int k = 0;
        while (m.find(k)) {
            int i = m.start();
            String n = s.substring(k, i);
            bf.append(n);
            k = m.end();
            n = s.substring(i, k);
          
            if (n.length() < 2) {
                bf.append(n);
                continue;
            }
            String v = this.c2w(n,orgnum);
           
            bf.append(v);
        }
        if (k < s.length()) {
            bf.append(s.substring(k));
        }
        if ((x = bf.toString()).matches("[0-9]+")) {
            return this.c2w(x,orgnum);
        }
        return x;
    }

    static String change1(String x, int[] ord, Pattern p, String c) {
        if (x == null || x.equals("")) {
            return "";
        }
        Matcher m = p.matcher((CharSequence)x);
        int e = 0;
        StringBuffer bf = new StringBuffer(x.length());
        while (m.find(e)) {
            int s = m.start();
            bf.append(x.substring(e, s));
            bf.append(c);
            e = m.end();
            String pnu = x.substring(s + 1, e - 1);
            int j = -1;
            try {
                j = Integer.parseInt(pnu);
            }
            catch (Exception ex) {
                // empty catch block
            }
            if (j < 0 || j >= ord.length) {
                Toolbox.println(1, "j=" + j + ", x=" + x + ", p=" + p.toString() + ", ord.length=" + ord.length);
                for (int i = 0; i < ord.length; ++i) {
                    Toolbox.println(1, "     " + i + ":" + ord[i]);
                }
                Toolbox.println(1, "TROUBLED rdapname=" + Task.wn);
                return null;
            }
            bf.append(ord[j]);
            bf.append(c);
        }
        bf.append(x.substring(e));
        return bf.toString();
    }

    public static String changeoneinother(String s, String original, String newone, char c) {
        if (s == null) {
            return null;
        }
        String t = "" + c + c;
        if (c == '?') {
            t = "\\?\\?";
        } else if (c == '$') {
            t = "\\$\\$";
        }
        String x = "" + c + c;
        if (c == '$') {
            x = "\\$\\$";
        }
        return s.replaceAll(t + original + t, x + newone + x);
    }

    private void addto(String line, Pattern p, int[] num) throws Exception {
        Matcher m = p.matcher((CharSequence)line);
        int l = 0;
        int k = 0;
        boolean err = false;
        while (m.find(k)) {
            int i = m.start();
            k = m.end();
            String str = line.substring(i, k);
            str = str.replaceFirst(".*[^0-9]([0-9]+)$","$1");
            
            if ((l = Integer.parseInt(str = str.replaceAll("[^0-9]", ""))) < 0 || l >= num.length) {
                err = true;
                continue;
            }
            num[l] = num[l] + 1;
        }
        if (err) {
            throw new Exception("Too big: " + l);
        }
    }

    void output(StringBuffer out, int[] num) throws Exception {
        for (int i = 0; i < num.length; ++i) {
            if (i % 40 == 0) {
                out.append("<td valign=top><table>");
            }
            out.append("<tr><td><b>" + i + "</td><td><font color=red>" + num[i] + "</td></tr>\n");
            if ((i <= 0 || i % 40 != 39) && i != num.length - 1) continue;
            out.append("</table></td>");
        }
    }

    private void addboth(String line, int[] msgnum, int[] jsnum) {
        String[] ns = line.split("\\s*,\\s*");
        for (int i = 0; i < ns.length; ++i) {
            int j = -1;
            try {
                j = Integer.parseInt(ns[i]);
                j = Integer.parseInt(ns[i].substring(1));
                if (ns[i].charAt(0) == '1') {
                    int[] arrn = msgnum;
                    int n = j;
                    arrn[n] = arrn[n] + 1;
                    continue;
                }
                if (ns[i].charAt(0) != '2') continue;
                int[] arrn = jsnum;
                int n = j;
                arrn[n] = arrn[n] + 1;
                continue;
            }
            catch (Exception e) {
                // empty catch block
            }
        }
    }

    public void reference(StringBuffer out) 
    {
        String[] dirs = new String[]{"C:\\project\\tealeaman\\src\\java\\telaman", "C:\\project\\tealeaman\\web", "C:\\project\\tealeaman\\web\\crypt"};
        int[] msgnum = new int[Toolbox.msgs[0].length];
        int[] jsnum = new int[2000];
        StringBuffer jspname = new StringBuffer();
        StringBuffer jsnames = new StringBuffer();
        StringBuffer javaname = new StringBuffer();
        int jsn = 0;
        int javanum = 0;
        int jspnum = 0;
        for (int i = 0; i < 3; ++i) 
        {
            File dir = new File(dirs[i]);
            File[] fs = dir.listFiles();
            String err = "";
            if (fs!=null)
            for (int j = 0; j < fs.length; ++j) 
            {
                String fn;
                if (!fs[j].isFile()) continue;
                if ((fn = fs[j].getName()).indexOf(".jsp") > 0) 
                {
                    ++jspnum;
                    jspname.append(fn + ", ");
                } else if (fn.indexOf(".js") > 0) 
                {
                    ++jsn;
                    jsnames.append(fn + ", ");
                } else 
                {
                    if (fn.indexOf(".java") <= 0) continue;
                    ++javanum;
                    javaname.append(fn + ", ");
                }
                try 
                {
                    out.append(err);
                    BufferedReader br = new BufferedReader(new FileReader(fs[j]));
                    String line = br.readLine();
                    while (line != null) 
                    {
                        this.addto(line, Task.textmsg, jsnum);
                        this.addto(line, Task.msg1, msgnum); 
                        this.addto(line, Task.msg, msgnum);
                        line = br.readLine();
                    }
                    continue;
                }
                catch (Exception e) {
                    err = e.toString();
                }
            }
        }
        this.adapter = Toolbox.getSysAdapter(0);
        boolean bb =this.adapter.executeQuery2("SELECT fieldlabels FROM gb2312",false);
        int n=0;
        for (int i2 = 0; bb && this.adapter.getValueAt(i2, 0)!=null; ++i2) 
        {
            this.addboth(this.adapter.getValueAt(i2, 0), msgnum, jsnum);
            n++;
        }
        this.adapter.close();
        try {
            out.append("Toolbox.msg<br><table border=1><tr>");
            this.output(out, msgnum);
            out.append("</tr></table><br>Textmsg<br><table border=1><tr>");
            this.output(out, jsnum);
            out.append("</tr></table><br>" + jsn + " js Files:");
            out.append(jsnames.toString() + "<br><br>" + javanum + " java Files:" + javaname.toString() + "<br><br>" + jspnum + " jsp Files:" + jspname.toString());
            out.append("<br><br>" + n + " records");
        }
        catch (Exception e) {
            // empty catch block
        }
    }

    public static void replaceAll(String regex, String target) 
    {
        String[] dirs = new String[]{"C:\\copytealeaman\\src\\java\\telaman", "C:\\copytealeaman\\web"};
        for (int i = 0; i < 2; ++i) 
        {
            File[] fs;
            File dir;
            if ((fs = (dir = new File(dirs[i])).listFiles()) == null) continue;
            Object f = null;
            Object g = null;
            String err = "";
            for (int j = 0; j < fs.length; ++j) 
            {
                String fn;
                if (!fs[j].isFile()) continue;
                if ((fn = fs[j].getName()).indexOf(".jsp") < 0 && fn.indexOf(".java") < 0) continue;
                try 
                {
                    BufferedReader br = new BufferedReader(new FileReader(fs[j]));
                    String line = br.readLine();
                    while (line != null) 
                    {
                        if (line.matches(".*<String[^>]*>.*")) 
                        {
                            Toolbox.println(1, line);
                        }
                        line = br.readLine();
                    }
                    br.close();
                    continue;
                }
                catch (Exception e) 
                {
                    // empty catch block
                }
            }
        }
    }

    public void dolabel(String language)
    {
        String str =  "C:\\project\\zz.txt";
        
        String jline = "";
        HashMap<String,String> q = new HashMap<>();
        int jj;
        try 
        {
            FileInputStream fin = new FileInputStream(new File(str));
            InputStreamReader esr = new InputStreamReader(fin);
            BufferedReader ebr = new BufferedReader(esr);
            String aline = null;
            while ((aline = ebr.readLine()) != null) 
            {
                q.put(aline.replaceFirst(",.*",""), aline.replaceFirst("[^,]+,","") );
            }
            fin.close();
        }
        catch(Exception e){}
        //makejs(false);
         
        Vector<String> sqlv = new Vector();
        str = Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "conf" + File.separator +  language + "s.txt";
        StringBuffer s = new StringBuffer(); 
        boolean b = this.adapter.executeQuery2("SELECT fieldlabels, rdapname from TaskLang WHERE language='" +  language + "'",false );
        for (int i=0; b&&this.adapter.getValueAt(i, 0)!=null; i++)
        {
            String yy = adapter.getValueAt(i,0).trim();
            String rdap = adapter.getValueAt(i,1);
            String ww[] = null;
            if (q.get(rdap)!=null) ww = q.get(rdap).split(",");
            String label[] = yy.split("[ ]*,[ ]*");
           
            String xx = "";
            for (int j=0; j < label.length; j++)
            {
                 if (!label[j].replaceFirst("[a-z|A-Z|0-9|_]","").equals(label[j]))
                 {
                     xx += "," + label[j];       
                 }
                 else
                 {
                    int l = 0;
                    for (; l < jsw.size(); l++)
                        if (jsw.elementAt(l).equals(label[j]))
                        {
                            break;
                        }
                    if (l < jsw.size())
                    {
                        xx += ",2" + l;
                    }
                    else
                    {
                        xx += ",2" + jsw.size();
                        s.append(jsw.size() + " " + label[j] + "\r\n");
                        jsw.addElement(label[j]);

                    }
                 }
            }
            xx = xx.substring(1);
            if (!xx.equals(yy))
            {
                sqlv.addElement("UPDATE TaskLang SET fieldlabels='" + xx  + "' WHERE rdapname='" + adapter.getValueAt(i,1) + "' AND language='" + language + "'") ;
            }
        }
        for (int k=0; k < sqlv.size(); k++)
        {
          int l = adapter.executeUpdate(sqlv.elementAt(k));
          
        }
        try
        {
         
            FileWriter f = new FileWriter(str, true);  f.append(s);  f.close();
        }
        catch(IOException e){}
         
    }
      
    public static void main(String[] s) 
    {
        Task.replaceAll("<String]*>", "");
    }
}
