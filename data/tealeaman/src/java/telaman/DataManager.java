/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import java.io.File;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.annotation.WebServlet;
import telaman.DBAdmin;
import telaman.DataAccess;
import telaman.JDBCAdapter;
import telaman.Toolbox;
import telaman.User;
import telaman.Webform;
@WebServlet(name = "DataManager", urlPatterns = {"/DataManager"},   asyncSupported = false)
public class DataManager extends DataAccess {
    
    
    void modifysaved(HashMap saved, Webform w, User user) {
        String tid = null;
        String ac = (String)saved.get("ac");
        if (ac == null) {
            ac = "";
        }
        if (ac.equals("ra")) {
            DataManager.searchwcds(saved, w, user);
        } else if (ac.indexOf("ral") >= 0) {
            String where = " WHERE n > 0";
            String tt = "t";
            if (!(w.permit(1, user) || (tid = w.idpermit(1)) == null)) {
                try {
                    if (w.fields != null) {
                        tt = w.fields[Integer.parseInt(tid)].substring(0, 1);
                    }
                    where = where + " AND " + tt + tid + "='" + user.id + "'";
                    w.permits = w.permits.replaceFirst("1\\+#[0-9]+", "1+" + user.id);
                }
                catch (Exception e) {
                    // empty catch block
                }
            }
            
            saved.put("wcds", where);
        } else if (ac.matches("r[0-9]+")) {
            String where = " WHERE n=" + ac.substring(1);
            if (!(w.permit(1, user) || (tid = w.idpermit(1)) == null)) {
                try {
                    int j = Integer.parseInt(tid);
                    String tt = "t";
                    if (w.fields != null) {
                        tt = w.fields[j].substring(0, 1);
                    }
                    where = where + " AND " + tt + j + "='" + user.id + "'";
                    w.permits = w.permits.replaceFirst("1\\+#" + tid, "1+" + user.id);
                }
                catch (Exception e) {
                    // empty catch block
                }
            }
            saved.put("wcds", where);
        } else if (ac.matches("u[0-9]+")) {
            String where = " WHERE n=" + ac.substring(1);
            if (!(w.permit(1, user) || (tid = w.idpermit(1)) == null)) {
                try {
                    int j = Integer.parseInt(tid);
                    String tt = "t";
                    if (w.fields != null) {
                        tt = w.fields[j].substring(0, 1);
                    }
                    where = where + " AND " + tt + j + "='" + user.id + "'";
                    w.permits = w.permits.replaceFirst("1\\+#" + tid, "1+" + user.id + ",3+" + user.id);
                }
                catch (Exception e) {
                    // empty catch block
                }
            }
            saved.put("wcds", where);
        } else if (ac.indexOf("d") == 0) {
            saved.put("wcds", " ");
        }
        System.err.println("wcds=" + saved.get("wcds"));
        w.insertQuery = "";
        w.updateQuery = "";
        w.deleteQuery = "";
        w.format = "Manager";
    }

    
    public static String addMath(String s, int[] hasmath) {
        Pattern anchor = Pattern.compile("\\$[^\\$]*[\\^|_|\\\\][^\\$]+\\$");
        Matcher m = anchor.matcher((CharSequence)s);
        boolean b = m.find();
        hasmath[0] = 0;
        if (b) {
            int j;
            int k;
            int i;
            hasmath[0] = 1;
            if ((i = s.toLowerCase().indexOf("<body")) == -1) {
                return "";
            }
            if ((j = s.toLowerCase().substring(0, i).indexOf("</head>")) == -1) {
                return s.substring(0, i) + Toolbox.jaxhead + "<head><script  type = \"text/javascript\">var  needtranslator=true;</script><script  type = \"text/javascript\" src  = \"mathjax/MathJax.js?config=TeX-MML-AM_CHTML\"></script></head>" + s.substring(i);
            }
            if ((k = s.toLowerCase().substring(0, j).indexOf("<head")) == -1) {
                return s;
            }
            return s.substring(0, k) + Toolbox.jaxhead + s.substring(k, j) + "<script  type = \"text/javascript\">var needtranslator=true;</script><script  type = \"text/javascript\" src  = \"mathjax/MathJax.js?config=TeX-MML-AM_CHTML\"></script>" + s.substring(j);
        }
        return s;
    }

    public static void searchwcds(HashMap saved, Webform w, User user) {
        String tid = null;
        String where = "";
        java.util.Set<Object> e = saved.keySet();
        for (Object key1:e) {
            
            String vl = (String)saved.get(key1);
            String key = (String)key1;
            if (!(w.permit(1, user) || (tid = w.idpermit(1)) == null)) {
                try {
                    String tt = "t";
                    if (w.fields != null) {
                        tt = w.fields[Integer.parseInt(tid)].substring(0, 1);
                    }
                    where = where + " AND " + tt + tid + "='" + user.id + "'";
                    w.permits = w.permits.replaceFirst("1\\+#[0-9]+", "1+" + user.id);
                }
                catch (Exception e1) {
                    // empty catch block
                }
            }
            if (!vl.equals("") && key.matches("c[0-9]+")) {
                where = where + " AND " + key + " = " + vl + " ";
                continue;
            }
            if (!vl.equals("") && key.matches("[a-z][0-9]+")) {
                where = where + " AND " + key + " LIKE '%" + vl + "%'";
                continue;
            }
            if (!vl.equals("") && key.matches("m")) {
                where = where + " AND n >= " + vl + "";
                continue;
            }
            if (vl.equals("") || !key.matches("n")) continue;
            where = where + " AND n <= " + vl + "";
        }
        if (where.length() >= 6) {
            where = " WHERE " + where.substring(5);
        }
        saved.put("wcds", where);
    }

    File path(String filename, int orgnum) {
        return new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator +   "forms" + File.separator + filename + ".htm");
    }

    public String getformat() {
        return "DataManager";
    }
    static final Pattern src = Pattern.compile("[ |\t|\n|\r]src=forms[a-z|A-Z|0-9|\\.|/]+[ |\t|\n|\r|>]"); 
    static final Pattern src1 = Pattern.compile("[ |\t|\n|\r]src=\"forms[a-z|A-Z|0-9|\\.|/]+\""); 
    static final Pattern href = Pattern.compile("[ |\t|\n|\r]href=forms[a-z|A-Z|0-9|\\.|/]+[ |\t|\n|\r|>]"); 
    static final Pattern href1 = Pattern.compile("[ |\t|\n|\r]href=\"forms[a-z|A-Z|0-9|\\.|/]+\"");  
    public static String replace(String x, int orgnum)
    {
        x = replace(x, src, "src=", orgnum);
        x = replace(x, src1, "src=", orgnum);
        x = replace(x, href, "href=", orgnum);
        x = replace(x, href1, "href=", orgnum);
        return x;
    }
    
    public static String replace(String x, Pattern p, String field, int orgnum)
    {
        Encode6b encode6b = new Encode6b(orgnum);
        int i;
        StringBuffer bf = new StringBuffer();
        Matcher m = p.matcher(x);
        int k = 0;
        while (m.find(k)) 
        {
            i = m.start();
            bf.append(x.substring(k, i));
            k = m.end();
            String y = x.substring(i, k);
          
            int j = y.indexOf(field);
            int ll = field.length();
            String z = y.substring(j+ ll , y.length()-1);
            String pt = Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + z.replace('/', File.separatorChar);
           
            z =  y.substring(0, j+ ll) + "FileOperation?did=" + encode6b.to6b(pt) + y.charAt(y.length()-1);
            bf.append(z);
        }
        if (k == 0) return x;
        bf.append(x.substring(k));
        return bf.toString();
    }
    public int processData(User c, Webform w, PrintWriter out, HashMap saved, JDBCAdapter adapter, String subdb,CachedStyle cachedstyle) {
        String aline = "";
        int[] hasmath = new int[1];
        try 
        {
            aline = new Scanner(this.path(w.name,c.orgnum)).useDelimiter("\\Z").next();
          
            aline = DataManager.addMath(aline, hasmath);
            aline = replace(aline,c.orgnum);
            out.print(aline);
        }
        catch (Exception e) {
            // empty catch block
        }
        int status = super.processData(c, w, out, saved, adapter, subdb, cachedstyle); 
        out.println("<script type=text/javascript>var orgnum=" + c.orgnum + ", securitytoken='" + Toolbox.gentoken("DataManager", "f1") + "'</script><script type=text/javascript src=databind.js></script><script  type=text/javascript src=onlinetool/installtool.js></script>");
        if (hasmath[0] == 1) {
            out.println("<script type=text/javascript  src=curve.js?dn=1&sn=25></script></script>");
        }
        out.println("</html>");
        if (status == 0) {
            return 0;
        }
        return status;
    }
}
