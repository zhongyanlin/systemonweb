 
package telaman;

import java.io.IOException;
import javax.servlet.ServletException;
import java.util.*;
import java.util.regex.Matcher;
 
public abstract class DataRestore {
   
    private String overlap = "";
    private String totable = "*";
   // protected String encoding;
    DBConnectInfo c;
    private String[] fields;
    private boolean[] iskey;
    CSVParse csvparse = null;
    public String msg = "";
    int orgnum;
    public int tid = -1;
    Msgboxrun mq = null;
    public String sek = null;
    static final public String chatcourse = Toolbox.emsg(1547); 
    public void backmessage(String ms)
    {
        if (sek!=null && mq!=null)
        {
            Msg m= new Msg(tid, "DataRestore", Toolbox.emsgs(orgnum,1548), sek, "plain", ms, System.currentTimeMillis(), 1); 
            mq.dropmsg(m.toString());
        }
           
        /*
        if (mq!=null && sek!=null)
        {
            Msg m= new Msg(tid,  "DataRestore", Toolbox.emsgs(orgnum,1548), sek, "plain", str, System.currentTimeMillis(), 1); 
            mq.dropmsg(m,sek);
        }*/
    }
    public int process1(int orgnum)   {
        this.orgnum = orgnum;
        if (sek!=null )
        {
            mq = Msgboxrun.get(sek + "_" +chatcourse);  
        }  
        JDBCAdapter adapter = Toolbox.getUserAdapter(this.c,orgnum);
        if (adapter.error().length() != 0) 
        {
            this.outerr("Database error: " + adapter.error() + this.c.toString());
            this.close();
            backmessage("done");
            backmessage(null);
            adapter.close();
            return 0;
        }
        String sql;
        int j = 0, ni=0, nr = 0, nd=0, nu = 0, na = 0, nn=0, nc = 0, ne = 0, nk=0;
        //"<table width=100% cellpadding=1 cellspacing=1 border=0><tr style=\"background:" + Toolbox.dbadmin[orgnum%65536].beheading() + "\"><td  align=left width=150><b><nobr>" + Toolbox.emsgs(orgnum,398) + "</nobr></b></td><td align=left><b><nobr>" + Toolbox.emsgs(orgnum,83) + "</nobr></b></td></tr>");
        String tbl = ""; 
        char oldact = '1';
        while ((sql = this.csvparse.nextSql())!=null)
        {
            sql = sql.trim().replaceAll("\n\\-\\-[^\n]+", "").trim();
            String tt[] = null;
            int k = sql.indexOf("(");
            String currenttbl = "";
            char act = ' ';
            if (sql.startsWith("update"))
            {
               act = 'u';
               tt = sql.trim().split("[ ]+");
               currenttbl = tt[1];
            }
            else if (sql.startsWith("delete"))
            {
               act = 'd';
               tt = sql.trim().split("[ ]+");
               currenttbl = tt[2];
            }
            else if (sql.startsWith("alter"))
            {
               act = 'a';
               tt = sql.trim().split("[ ]+");
               currenttbl = tt[2];
            }
            else  if (k>0) 
            {
                tt = sql.substring(0,k).trim().split("[ ]+");
                
                if (tt.length>2)
                {
                    currenttbl = tt[2];
                    if (tt[0].toLowerCase().equals("insert"))
                        act = 'i';
                    else if (tt[0].toLowerCase().equals("create"))
                        act = 'c';
                    
                } 
            }
            if (nr == 0) tbl = currenttbl;
            if (nr>0 &&  !tbl.equals(currenttbl))
            {
                backmessage(tbl +  " " + nr + " read, " + ni + " inserted, " + nu + " updated, " + nk + " skipped, " + ne + " errors<br>"  );
               // backmessage( tbl +  " " + nr + " read, " + ni + " inserted, " + nu + "  updated, " + nd + "  deleted, " + na + " altered, " + nd + "  deleted, " + nk + "  skipped," + (ne) + " errors<br>"  );
                this.outerr( tbl +  ": " +"n=" + nr + ", i=" + ni +"<br>");
                j = nr =  nu = nd = ni = nc = nn = na = nk = 0;
                tbl = currenttbl;
            }
             
            if (k>0 && tt.length > 2 && this.totable.indexOf("*") != 0 && (tt[0].toLowerCase().equals("create") || tt[0].toLowerCase().equals("insert")) && (";"+this.totable.toLowerCase() + ";").indexOf(";"+tt[2].toLowerCase().replaceAll("`", "") +";") == -1)
            {
                nk++;
                continue;
            }
            if (k>0 && tt[0].toLowerCase().equals("create")) 
            {
                int sindex = Toolbox.begintranslate("mysql");
                String dbms = adapter.dbms;
                int tindex = Toolbox.begintranslate(dbms);
                sql = this.portto(sql, sindex, tindex);         
            }
            if (k>0 && tt[0].toLowerCase().equals("create") && this.overlap.equals("drop") )
            {
                adapter.executeUpdate("DROP TABLE " + tt[2]);
            }
            int m = adapter.executeUpdate(sql);
            nr++;
            if (m < 0) 
            {
                this.outerr(sql + ":<font color=red>" + adapter.error() + "</font><br>");
                ne++;
            }
            else if (act == 'i')
            { 
                ni++;
            }
            else if (act == 'u')
            {
                nu++;
            }
            else if (act =='d')
            {
                nd++;
            }
            else if (act =='c')
            {
                nd++;
            }
            else if (act =='a')
            {
                na++;
            }
            else 
            {
                nn++;
            }
            
        }
        backmessage(tbl +  " " + nr + " read, " + ni + " inserted, " + nu + " updated, " + nk + " skipped, " + ne + " errors<br>"  );
        this.outerr( tbl +  ": " +"n=" + nr + ", i=" + ni +"<br>");
        adapter.close();
        backmessage("done");
        return j;
    }
    public int process(int orgnum) throws ServletException, IOException {
      
        this.orgnum = orgnum;
       // String tbgcolor = cachedstyle.TBGCOLOR;
        if (sek!=null )
        {
            mq = Msgboxrun.get(sek + "_" +chatcourse);  
        }    
          
        String[] record;
        System.setProperty("file.encoding", "UTF-8");
        
        
        JDBCAdapter adapter = Toolbox.getUserAdapter(this.c,orgnum);
        String dbms = adapter.dbms;
        //if (dbms.equals("derby")) dbms = "h2";
        int tindex = Toolbox.begintranslate(dbms);
        if (adapter.error().length() != 0) 
        {
            this.outerr("Database error: " + adapter.error() + this.c.toString());
            this.close();
            backmessage("done");
            backmessage(null);
            adapter.close();
            return 0;
        }
        
        if (this.totable.indexOf("*") == 0 && this.overlap.equals("drop")) 
        {
            this.outerr("<table width=100% cellpadding=1 cellspacing=1 align=center class=outset1 > <tr style=\"background:" + Toolbox.dbadmin[orgnum%65536].beheading() + "\"><td width=150><nobr>" + Toolbox.emsgs(orgnum,22) + "</nobr></td><td  align=left ><b>" + Toolbox.emsgs(orgnum,75) + "</td></tr>");
            String[] tots = this.totable.split(";");
            for (int i = tots.length - 1; i >= 1; --i) 
            {
                if (tots[i] != null && tots[0].length() > 0) 
                {
                    adapter.executeUpdate("DROP TABLE " + tots[i]);
                }
                this.outerr( arow(tots[i], adapter.error()));
            }
            this.outerr("</table>");
        }
         
        this.outerr("<center><br><table   cellpadding=1 cellspacing=1 align=center class=outset1 > <tr style=\"background:" + Toolbox.dbadmin[orgnum%65536].beheading() + "\"><td  align=left width=150><nobr>" + Toolbox.emsgs(orgnum,866) + "</nobr></td><td  align=left > " + Toolbox.emsgs(orgnum,867) + "</td></tr>");
        String sourcedbms = this.csvparse.nextElement().trim();
        
        int sindex = Toolbox.begintranslate(sourcedbms);
        String err = "";
        if (sourcedbms == null || sourcedbms.equals("")) {
            err = "blank backup file";
        } else if (this.csvparse.separateIndex != 2) {
            err = "Invalid database backup file. Should be a table separator char " + DBAdmin.CSVseparator[2];
        } else if (sindex == -1) {
            err = " Invalid source dbms";
        }
    
        String ms = this.overlap.equals("drop") ? Toolbox.emsgs(orgnum,452) : (this.overlap.equals("backup") ? Toolbox.emsgs(orgnum,455) :(this.overlap.equals("timestamp")?Toolbox.emsgs(orgnum,454): Toolbox.emsgs(orgnum,456)));
        this.outerr( arow("Source DBMS", sourcedbms) 
                + arow("Target DBMS", dbms) 
                +  arow("Target Table", this.totable.replaceAll(";", " "))
                +  arow("Overlapped tables", ms) + "</table></td></tr></table><br>");
        if (!err.equals("")) {
            this.outerr(err);
            return 0;
        }
        
        this.outerr("<table width=100% cellpadding=1 cellspacing=1 border=0><tr style=\"background:" + Toolbox.dbadmin[orgnum%65536].beheading() + "\"><td  align=left width=150><b><nobr>" + Toolbox.emsgs(orgnum,398) + "</nobr></b></td><td align=left><b><nobr>" + Toolbox.emsgs(orgnum,83) + "</nobr></b></td></tr>");
        int nr = 0;
        int ne = 0;
        int nu = 0;
        int ni = 0;
        int ns = 0;
        int snr = 0;
        int snu = 0;
        int sne = 0;
        int sni = 0;
        int sns = 0;
        String oldtn="",tn = "";
        int count = 0;
        StringBuffer kf = new StringBuffer(200);
        StringBuffer sf = new StringBuffer(200);
        StringBuffer sb = new StringBuffer(200);
        boolean skip = true;
        boolean oldskip = true;
        boolean firstline = true;
        this.totable = this.totable.toLowerCase().replaceAll(" ","");
        
       
         
        while ((record = this.csvparse.nextRow()) != null) 
        {
            
            if (firstline) 
            {
                
                err = "";
                String tabledef = record[0];
               
                boolean exists = false;
                boolean needdef = false;
                if (tabledef.trim().toUpperCase().indexOf("CREATE TABLE") != 0) 
                {
                    tn = "Invalid";
                    err = "Unexpected found: " + tabledef + "<br>";
                    skip = true;
                } 
                else 
                {
                    
                    int jj;
                    if ((jj = tabledef.indexOf("(")) == -1) 
                    {
                        jj = tabledef.length();
                        needdef = true;
                    }
                    tn = tabledef.substring(0, jj).trim();
                    jj = tn.lastIndexOf(" ");
                    tn = tn.substring(jj + 1).trim();
                    skip = false;
                }
                
                if (skip || !this.totable.contains("*") && !this.totable.contains(";" + tn.toLowerCase() + ";") ) 
                {
                    skip = true;
                     
                } 
                else 
                {
                    if (!this.totable.contains("*") && this.totable.contains(";" + tn.toLowerCase() + ";")  )
                    {
                        this.totable = this.totable.replaceFirst(";" + tn.toLowerCase() + ";", ":");
                    }
                    skip = false;
                  
                    if (needdef) 
                    {
                        int numr = 0;
                        if ((adapter.executeQuery2("select definition from Apptables WHERE tname='" + tn + "'",false)) && adapter.getValueAt(0, 0)!=null) 
                        {
                            tabledef = adapter.getValueAt(0, 0);
                        } 
                        else if  ((tabledef = adapter.tabledef(tn, sourcedbms)).equals("")) 
                        {
                            err = "No definition nor table: " + tn;
                            skip = true;
                        } 
                        else 
                        {
                            exists = true;
                            adapter.executeUpdate("INSERT INTO Apptables(lastupdate,tname,definition,roles) VALUES (1000000000,'" + tn + "','" + tabledef + "',4095)");
                        }
                    }
                }
                if (!oldskip) 
                {
                    backmessage(oldtn +  " " + nr + " read, " + ni + " inserted, " + nu + " updated, " + ns + " skipped, " + ne + " errors<br>"  ); 
                    if (!this.outerr("" + nr + " read, " + ni + " inserted, " + nu + " updated, " + ns + " skipped, " + ne + " errors</td></tr>"))
                    Toolbox.print(0,oldtn +  " " + nr + " read, " + ni + " inserted, " + nu + " updated, " + ns + " skipped, " + ne + " errors\n"  );     
                }
                snr+=nr;
                sne+=ne;
                sni+=ni;
                snu+=nu;
                sns+=ns;
                ne = 0;
                ni = 0;
                nu = 0;
                ns = 0;
                nr = 0;
                if (!skip) 
                {
                    ++count;
                    
                    this.parseit(tabledef);
                    oldtn = tn;
                    this.outerr("<tr ><td  align=left valign=top style=background-color:var(-tbgcolor) ><b>" + tn + "</b></td><td align=left valign=top style=background-color:var(-tbgcolor) >");
                    if (this.overlap.equals("drop")) 
                    {
                        adapter.executeUpdate("DELETE FROM " + tn);
                        adapter.executeUpdate("DROP TABLE " + tn);
                        exists = false;
                    } 
                    else if (!exists) 
                    {
                        exists = ( adapter.executeQuery2("select * from " + tn + " where 1=2",false)  );
                        boolean bl = exists;
                    }
                    if (!exists) 
                    {
                        tabledef = this.portto(tabledef, sindex, tindex);
                        int nn = adapter.executeUpdate(tabledef);
                        
                        if (adapter.error().indexOf("already exists") < 0) 
                        {
                            this.outerr("<font color=red><pre>" + adapter.error() + "</pre></font>");
                        }
                    }
                } 
                else if (!err.equals("")) 
                {
                    this.outerr("<tr ><td  align=left valign=top style=background-color:var(-tbgcolor);color:red><b>" + tn + "</b></td><td align=left valign=top style=background-color:var(-tbgcolor);color:red>" + err + "</font></td></tr>");
                }
                oldskip = skip;
            } 
            else if (!skip) 
            {
                ++nr;
                if (nr%200 == 0)
                {
                    backmessage(oldtn +  " " + nr + " read, " + ni + " inserted, " + nu + " updated, " + ns + " skipped, " + ne + " errors<br>"  ); 
                }
                if (this.fields.length == this.csvparse.quoteds.length() && record.length == this.fields.length) 
                {
                    String err1= this.procRecord(tn, record, this.csvparse.quoteds.toString(), kf, sf, adapter, false);
                    if (err1.equals("i ")) 
                    {
                        ++ni;
                    } else if (err1.equals("u ")) {
                        ++nu;
                    } else if (err1.equals("s ")) {
                        ++ns;
                    } else if (++ne < 10) {
                        this.outerr(err1);
                    } else if (ne >= 10) {
                        int indexn = err1.indexOf("\n");
                    }
                } 
                else 
                {
                    ++ne;
                    this.outerr("<font color=red>Number of elements=" + record.length + ", but field length=" + this.fields.length + ".  Not match. Possibly, the back file was edited improperly: </font><br>");
                }
            } 
            else 
            {
                ++nr;
                ++ns;
            }
            firstline = (this.csvparse.separateIndex == 2);
        }
      
        if (!skip) 
        {
             backmessage(oldtn + " " + nr + " read, " + ni + " inserted, " + nu + " updated, " + ns + " skipped, " + ne + " errors<br>");
            if (!this.outerr("" + nr + " read, " + ni + " inserted, " + nu + " updated, " + ns + " skipped, " + ne + " errors</td></tr>"))
            Toolbox.println(0,oldtn + " " + nr + " read, " + ni + " inserted, " + nu + " updated, " + ns + " skipped, " + ne + " errors\n");
        }
        this.outerr("<tr ><td  align=left valign=top style=background-color:var(-tbgcolor) ><b> Total=" + count + "</b></td><td align=left valign=top style=background-color:var(-tbgcolor) >");
        this.outerr("" + (snr+=nr) + " read, " + (sni+=ni) + " inserted, " + (snu+=nu) + " updated, " + (sns+=ns) + " skipped, " + (sne+=ne) + " errors</td></tr>");
        this.outerr("</table>");
        adapter.close();
        backmessage("done");
        return nr;
    }

    
    public DataRestore(String overlap, String totable, /*String encoding, */DBConnectInfo c) {
        this.overlap = overlap;
        this.totable = totable;
        //this.encoding = encoding;
        this.c = c;
    }
    
    public   String arow(String f1, String f2) {
        return "<tr style=background-color:var(-tbgcolor) ><td  align=left valign=top >" + f1 + "</td><td  align=left valign=top >" + f2 + "</td></tr>";
    }

    public String portto(String sql, int sindex, int tindex) {
        if (tindex == 0) {
            sql = sql.replaceAll("DEFAULT[^,]+,", ",");
        }
        sql = Toolbox.translateStr(sql, sindex, tindex);
        return sql;
    }

    abstract boolean outerr(String var1);
    static java.util.regex.Pattern primarykey = java.util.regex.Pattern.compile("PRIMARY[ ]+KEY");
    public void parseit(String rec) 
    {
        int jj;
        if (rec == null || rec.equals("")) 
        {
            fields = null;
            return;
        }
        String def = rec.replaceAll("'[^']*'", "").replaceFirst("^[^\\(]*\\(\\s*", "").toUpperCase();
        
        Matcher m = primarykey.matcher((CharSequence)def.toUpperCase());
        int K = def.indexOf("PRIMARY ");
        
        int K1 = def.indexOf("FOREIGN ");
        
        int K2 = def.indexOf("CHECK ");
        
        if (K1> 0 && K1 < K) K = K1;
        if (K2 >0 && K2 < K) K = K2;
        if (K == -1) K = def.length();
        
        String [] fs = def.substring(0, K).replaceAll(",[\n|\t|\r|\\s]*$","").split(",");
        int N = fs.length;
        
        this.fields = new String[N];
        this.iskey = new boolean[N];
        for (jj = 0; jj < N; ++jj) 
        {
            fields[jj] = fs[jj].replaceFirst("^[^A-Z]+","").replaceFirst(" .*", "");
            
        }
         
        String keys = "";
        if (m.find())
        {
            String x = def.substring(m.end()).trim();
            if (x.length() == 0)
                ;
            else if (x.charAt(0) == '(')
            {
                int j = x.indexOf(")");
                if (j == -1)
                {
                    j = x.length();
                }
                if (j>1)
                keys = x.substring(1,j).trim().replaceAll("\\s", "");
            }
            else 
            {
                int j = x.indexOf(",");
                if (j == -1)
                {
                    j = x.length();
                }
                if (j>0)
                keys = x.substring(0,j).trim(); 
            }
        }
         
         keys = "," +  keys + ",";
         for (jj = 0; jj < N; ++jj) 
         {
             iskey[jj] = keys.indexOf("," + fields[jj]  + ",") >= 0;
         }
        
    }

    public String procRecord(String tn, String[] record, String quoteds, StringBuffer kf, StringBuffer sf, JDBCAdapter adapter, boolean ignorenull) {
        String err;
        String insertsql = "";
        int k = 0;
        StringBuffer recordstr = new StringBuffer("INSERT INTO " + tn + " VALUES (");
        for (k = 0; k < record.length; ++k) 
        {
            
            boolean quoted;
            String value = record[k];
            boolean bl = quoted = (quoteds.charAt(k) == '1');
            if (value == null)
                value = "NULL";
            else if (quoted) 
            {
                value = "'" + value.replaceAll("'", "''") + "'";
            } 
            else if (value.equals("")) 
            {
                value = "NULL";
            }
            recordstr.append(value);
            if (k < record.length - 1)  recordstr.append(",");
        }
        recordstr.append(')');
        insertsql = recordstr.toString();
        
        if (adapter.executeUpdate(insertsql) == 1) 
        {
            return "i ";
        }
        err = adapter.error().replaceAll("<", "&lt;");
        if (err.toLowerCase().indexOf("duplicate") < 0 && err.toLowerCase().indexOf("unique index ") <0 || this.overlap.equals("drop")) 
        {
            return "<font color=red>Wrong:" + insertsql + "</font>" + quoteds   +  "<br>" + err + "<br><br>";
        }
        if (this.overlap.equals("keep")) 
        {
            return "s ";
        }
        kf.setLength(0);
        sf.setLength(0);
        String lastupdate = "";
        for (k = 0; k < record.length; ++k) 
        {
            boolean quoted;
            String value = record[k];
            boolean bl = quoted = quoteds.charAt(k) == '1';
            if (value == null)
                 value = "NULL";
            else if (quoted) 
            {
                value = "'" + value.replaceAll("'", "''") + "'";
            } 
            else if (value.equals("")) 
            {
                value = "NULL";
            }
             
            if (k < iskey.length && iskey[k]) 
            {
                kf.append(" AND " +  fields[k] + "=" + value);
            }
            else if (overlap.equals("timestamp") && k==0) 
            {
                kf.append(" AND " +  fields[0] + "<=" + value);
            }
            if (value.equals("NULL") && ignorenull) 
                continue;
            sf.append("," +  fields[k] + "=" + value);
            if (fields[k].equals("lastupdate") && tn.equals("DomainValue"))
            {
                lastupdate = " AND lastupdate < " + value;
            }
        }
        
        if (this.fields.length > 0 && kf.length() > 0 && sf.length() > 0) 
        {
            String   updatesql = "UPDATE " + tn + " SET " + sf.toString().substring(1) + " WHERE " + kf.toString().substring(5) + lastupdate;
            int n2 = adapter.executeUpdate(updatesql);
            if (n2 > 0) 
            {
                err = "u ";
            } 
            else if (n2 < 0 && !adapter.error().equals("")) 
            {
                err = "<font color=red>" + adapter.error().replaceAll("<", "&lt;") + "</font><br>";
            }
             
        }
        return err;
    }

    public void close() {
    }
}
