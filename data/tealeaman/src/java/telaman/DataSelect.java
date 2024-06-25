/*
 * Decompiled with CFR 0_87.
 * 
 * Could not load the following classes:
 *  javax.servlet.ServletException
 *  javax.servlet.http.HttpServletRequest
 *  javax.servlet.http.HttpServletResponse
 */
package telaman;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import telaman.DBConnectInfo;
import telaman.DataAccess;
import telaman.Generic;
import telaman.JDBCAdapter;
import telaman.MyRSA;
import telaman.Toolbox;
import telaman.User;
import telaman.Webform;
@WebServlet(name = "DataSelect", urlPatterns = {"/DataSelect"},   asyncSupported = false)
public class DataSelect
extends Generic {
    static final String[] events = new String[]{"cellonblur", "cellonfocus", "onsave", "onsaved", "onbegin", "onclose", "exbut"};
    
    public int processData(User user, Webform w, PrintWriter out, HashMap saved, JDBCAdapter adapter, String subdb, CachedStyle cachedstyle) {
        
        int numCols;
        int j;
        int j2;
        int i;
        int numRows = 1;
        int orgnum = Toolbox.langnum<<16;
        if (user!=null) 
            orgnum = user.orgnum;
        else 
        {
           try{ orgnum = (Integer.parseInt((String)saved.get("orgnum"))%65536) + (Toolbox.langnum<<16);}catch(Exception e){}
        }
        String encoding = Toolbox.encodings[orgnum>>16];
        String[] fields = new String[32];
        boolean hasdelete = false;
        boolean hasupdate = true;
        boolean status = false;
        out.println("<script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=text/javascript  src=" + Toolbox.getUserLang(orgnum) + " ></script><script type=text/javascript  src=cookie.js></script>");
        Object rsaencenc = saved.get("rsacode");
        int rsaencencnum = 0;
        String rsaencencstr = "";
        if (rsaencenc != null) {
            try {
                rsaencencnum = Integer.parseInt((String)rsaencenc);
            }
            catch (Exception e) {
                // empty catch block
            }
            if (rsaencencnum > 1) {
                rsaencencstr = Toolbox.decrsa[Toolbox.locales[orgnum>>16].charsize-1].publickey();
            }
        }
        hasdelete = (w.deleteroles & user.roles) > 0;
        w.query = Webform.trim(w.query);
        
        int NN = w.query.length();
        int NNN = Toolbox.locatefrom(w.query, NN, "from");
        boolean needdb = NNN < NN - 4;
        String[] optionquerys = w.query.split(Webform.separator);
        int jjj = 2;
        int numoptionquery = optionquerys.length;
        
        String tmp = optionquerys[0];
        if ((numCols = this.output(optionquerys[1], w, out)) == 0) 
        {
            return 0;
        }
       
        boolean[] hassqlz = new boolean[numCols];
        String[] options = new String[numCols];
        String[] types = new String[w.ctypes.length];
        for (j = 0; j < numCols; ++j) 
        {
            types[j] = w.ctypes[j].substring(0, 1);
            if (types[j].equals("r"))
                types[j] = "s";
            else if( types[j].equals("R"))
                types[j] = "S";
            hassqlz[j] = false;
            if (!types[j].equals("s") && !types[j].equals("S") && !types[j].equals("w") && !types[j].equals("W")) 
            {
                continue;
            }
            if (numoptionquery > jjj) 
            {
                optionquerys[jjj] = Webform.trim(optionquerys[jjj]);
                optionquerys[jjj] = Generic.getStoredOpts(optionquerys[jjj], orgnum); 
              
                hassqlz[j] = (optionquerys[jjj].toLowerCase().indexOf("select ") == 0);
                options[j] =  optionquerys[jjj];
                jjj++;
            }
            else
            {
                types[j] = types[j].equals("s") || types[j].equals("r") || types[j].equals("w") ? "t" : "T";
            }
           
        }
        
        out.print("<script>");
        out.print("var labels=[");
        for (j = 0; j < w.labels.length; ++j) {
            out.print("'");
            out.print(w.labels[j]);
            out.print("'");
            if (j >= w.labels.length - 1) continue;
            out.print(",");
        }
        out.print("],\npositionstr=\"" + w.positions + "\";");
        out.print("var ZQ = [\"" + Generic.handle(w.name) + "\",\"" + Generic.handle(w.title) + "\",\n");
        out.print("\"" + MyRSA.encryptString0(tmp,orgnum>>16) + "\",\n");
        String[] sa = new String[]{""};
        if (w.insertQuery != null) {
            sa = w.insertQuery.trim().split("\n");
            out.print("\"" + MyRSA.encryptString0(w.insertQuery,orgnum>>16) + "\",\n");
        } else {
            out.print("'',");
        }
        if (hasdelete && w.deleteQuery != null) {
            out.print("\"" + MyRSA.encryptString0(w.deleteQuery,orgnum>>16) + "\",\n");
        } else {
            out.print("'',");
        }
        if (w.help != null) {
            out.print("\"" + Generic.handle(w.help) + "\",\n");
        } else {
            out.print("'',");
        }
        String key4 = "";
        if (!(rsaencencnum != 1 && rsaencencnum != 3 || user.keys.equals(""))) {
            key4 = user.keys.split(",")[1].substring(0, 4);
        }
        out.print("\"" + subdb + "\",\"" + rsaencencnum + "\",\"" + rsaencencstr + "\",\"" + key4 + "\",\"" + Toolbox.locales[orgnum>>16].charsize + "\"];");
        boolean extra = false;
        int NUMROWS = 1;
        out.print("var MS='" + (Toolbox.sessiondebug ? 1 : 0) + "," + 1 + "," + 0 + "," + 0 + "," + 0 + "," + numRows + "," + NUMROWS + "," + numCols);
        if (w.updateQuery != null && w.updateQuery.length() > 0) {
            out.print("," + this.subs1(w.updateQuery, w.fields) + "';");
        } else {
            out.print(",DataTable';");
        }
        out.println("var options = new Array( " + numCols + " ),");
        out.println("captions = new Array( " + numCols + " );");
        out.print("var defaultRecord=[");
        
        boolean[] hasdefault = new boolean[numCols];
        for (j2 = 0; j2 < numCols; ++j2) 
        {
           
            hasdefault[j2] = w.defaultv[j2]!=null && w.defaultv[j2].length()>1 && w.defaultv[j2].charAt(0) == '!'; 
           out.print("\"" + Generic.handle(w.defaultv[j2])  + "\",");
        }
        out.print("''];\n");
  
        if (needdb) 
        {
            adapter = Toolbox.getUserAdapter(user, orgnum);
            for (i = 0; i < numCols; ++i) 
            {
                if (options[i] == null) 
                    continue;
                
                if (hassqlz[i])
                {
                   String ss = this.getOptions(adapter, options[i], i, types[i], hasdefault[i],orgnum);
                   out.print(ss);
                }
                else
                {
                    out.print(this.getOptions1(options[i], i, hasdefault[i],orgnum));
                }
            }
           
        } else {
            for (i = 0; i < numCols; ++i) {
                if (options[i] != null)  
                out.print(this.getOptions1(options[i], i, hasdefault[i],orgnum));
            }
        }
        out.print("var hsnd=null; var mm = 0; var webserviceAllbuts= \"" + Generic.handle(w.webService) + "\"; \nvar STNEVE=[");
        for (j2 = 0; j2 < DataSelect.events.length; ++j2) {
            String item;
            if ((item = (String)saved.get(DataSelect.events[j2])) != null) {
                if (!(DataAccess.iscoded(item) || DataSelect.events[j2].equals("exbut"))) {
                    item = MyRSA.encryptString0(Generic.handle(item),orgnum>>16);
                }
                out.print("\"" + item + "\"");
            } else {
                out.print("''");
            }
            if (j2 == DataSelect.events.length - 1) {
                out.println("];");
                continue;
            }
            out.print(",");
        }
       
        out.println("var switchstr ='';");
        out.println("</script>");
        out.println("<script type=text/javascript  src=encryption.js></script>");
        out.println("<script type=text/javascript  src=decrypt.js></script>");
        if (!(w.jscript == null || w.jscript.equals(""))) {
            out.println("<script  type=text/javascript src=" + w.jscript + "></script>");
        }
        out.println("<script type=text/javascript  src=timeformat.js></script>");
        out.println("<script type=text/javascript  src=commonused.js></script>");
        out.println("<script type=text/javascript  src=multipleselect.js></script>");
        String makescript = (String)saved.get("makescript");
        if (makescript == null) {
            out.println("<script type=text/javascript  src=makeSearch.js></script>");
        } else {
            out.println("<script type=text/javascript  src=" + makescript + ".js></script>");
        }
        out.println("<script type=text/javascript  src=makeSearchdu.js></script>");
        out.println("<script type=text/javascript  src=helpformatf.js></script>");
        out.println("<script type=text/javascript src=floating.js></script>");
        out.println("<script type=text/javascript  src=hints.js></script>");
        adapter.close();
        return 1;
    }
    
    public String getformat() 
    {
        return "DataSelect";
    }

    String subs1(String s, String[] fields) {
        for (int i = 0; i < fields.length; ++i) {
            s = s.replaceAll("@@" + fields[i] + "@@", "@" + i + "@");
        }
        return s;
    }
    
    
    String getOptions(JDBCAdapter a, String s, int f, String ctype, boolean hasdefault, int orgnum) {
        if (s.toLowerCase().indexOf(" from domainvalue ")> 0)
        {
            s  = s.replaceFirst("(?i) where ", " WHERE language='" +  Toolbox.langs[orgnum>>16] + "' AND ")  ;
        }
        boolean b = a.executeQuery2(s,false);
        String str = "";
        String str1 = "";
        if (!b) 
        {
            return this.getOptions1(s, f, hasdefault,orgnum);
        }
        str = "options[" + f + "] = [";
        if (!hasdefault) {
            str = str + "''";
        }
        str1 = "captions[" + f + "] = [";
        if (!hasdefault) {
            str1 = str1 + "'" + Toolbox.emsgs(orgnum,499) + "'";
        } 
        String tmp;
        for (int i = 0; (tmp = a.getValueAt(i, 0)) != null; ++i) 
        {
             
            if (!(i <= 0 && hasdefault)) {
                str = str + ",";
                str1 = str1 + ",";
            }
            int nc = 2; try{ nc = a.resultSet.getMetaData().getColumnCount();}catch(Exception e){}
            if( nc == 3 && rdap.startsWith("grading"))
            {   
                if ( a.getValueAt(i, 2).trim().indexOf("g:")>=0)
                     str = str + "\"--" + DataSelect.handle(tmp.trim()) + "\"";
                else
                     str = str + "\"" + DataSelect.handle(tmp.trim()) + "\""; 
            }
           
            if (nc >= 2)
                str1 += "\"" + DataSelect.handle(a.getValueAt(i, 1).trim()) + "\"";
            else if (ctype.equals("s") || ctype.equals("S") || ctype.equals("r") || ctype.equals("R") || ctype.equals("w") || ctype.equals("W"))
                str1 +=   "\"" + DataSelect.handle((String)tmp.trim()) + "\"";
            else 
                str1 +=  "''";
            
            
        }
       
        return str + "];\n" + str1 + "];\n";
    }

     
    String getOptions1(String s, int f, boolean hasdefault, int orgnum) {
        if (s.indexOf(";") < 0) {
            String str = "options[" + f + "] = [";
            if (!hasdefault) {
                str = str + "'',";
            }
            str = str + "\"" + s.trim().replaceAll(",", "\",\"") + "\"];";
            String str1 = "captions[" + f + "] = [";
            if (!hasdefault) {
                str1 = str1 + "'" + Toolbox.emsgs(orgnum,499) + "',";
            }
            str1 = str1 + "\"" + s.trim().replaceAll(",", "\",\"") + "\"];";
            return str + str1;
        }
        String[] ss = s.split(";");
        String str = "options[" + f + "] = [";
        if (!hasdefault) {
            str = str + "'',";
        }
        str = str + "\"" + ss[1].trim().replaceAll(",", "\",\"") + "\"];\n";
        String str1 = "captions[" + f + "] =[";
        if (!hasdefault) {
            str1 = str1 + "'" + Toolbox.emsgs(orgnum,499) + "',";
        }
        str1 = str1 + "\"" + ss[0].trim().replaceAll(",", "\",\"") + "\"];\n";
        return str + str1;
    }

    public String bool2str(boolean b) {
        if (b) {
            return "true";
        }
        return "false";
    }

    int output(String query, Webform w, PrintWriter out) {
        out.print("<script type=text/javascript>var H='" + w.fieldstr() + "';");
        if (w.ctypes.length != w.attrs.length) {
            out.print("var pubkeys='';var mat=[];</script>");
            return 0;
        }
        int numberOfColumns = w.attrs.length;
        out.print("var pubkeys='");
        for (int j = 0; j < numberOfColumns; ++j) {
            if (j > 0) {
                out.print(",");
            }
            out.print(w.attrs[j]);
            
            out.print(w.ctypes[j].replaceFirst("^r", "s"));
        }
        out.println("';" + query + "</script>");
        return numberOfColumns;
    }
}
