/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import java.io.PrintWriter;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.annotation.WebServlet;
 
@WebServlet(name = "DataAccess", urlPatterns = {"/DataAccess"},   asyncSupported = false)
public class DataAccess extends Generic 
{
    static Pattern anchor = Pattern.compile("<a.*<.a>");
    static Pattern inputbut = Pattern.compile("<input[^>]+>");
    static Pattern selectname = Pattern.compile("select[ ]+[d|n]");
    static final String[] events = new String[]{"cellonblur", "cellonfocus", "onsave", "onsaved", "onbegin", "onclose", "exbut"};
    CachedStyle cachedstyle; 
    public int processData(User user, Webform w, PrintWriter out, HashMap saved, JDBCAdapter adapter, String subdb, CachedStyle cachedstyle) 
    {
        
        String err;
        int numCols;
        Object x;
        int numRows;
        boolean hasdelete = false;
        boolean hasupdate = false;
        boolean hasnew = false;
        boolean status = true;
        int extra = 6;
        int NUMROWS = 0;
        int orgnum = Toolbox.langnum<<16;
        if (user!=null) 
            orgnum = user.orgnum;
        else 
        {
          try{   
              
              orgnum  = (Integer.parseInt((String)saved.get("orgnum"))%65536) + (Toolbox.langnum<<16);
            
           }catch(Exception e){}
        }
        
       // String encoding = Toolbox.encodings[orgnum>>16];
        try {
            extra = Integer.parseInt((String)saved.get("extraline"));
        }
        catch (Exception e) {
            extra = 6;
        }
        
        try {
            NUMROWS = Integer.parseInt((String)saved.get("numrows"));
        }
        catch (Exception e) {
            NUMROWS = 0;
        }
        this.cachedstyle = cachedstyle;

        status = false;
        Object rsaencenc = saved.get("rsacode");
        int rsaencencnum = 0;
        String rsaencencstr = "";
        if (rsaencenc != null) 
        {
            try 
            {
                rsaencencnum = Integer.parseInt((String)rsaencenc);
            }
            catch (Exception e) 
            {
                // empty catch block
            }
            
            if (rsaencencnum > 1) {
                rsaencencstr = Toolbox.decrsa[Toolbox.locales[orgnum>>16].charsize-1].publickey();
            }
        }
         
        hasdelete = w.permit(4, user) && w.deleteQuery != null && w.deleteQuery.length() > 0;
        boolean bl = w.permit(3, user);
        out.println("<!--bl=" + bl + ", w.updateQuery=" + (w.updateQuery!=null && w.updateQuery.length() > 0) + "-->");
        bl = hasupdate = bl && w.updateQuery != null && w.updateQuery.length() > 0;
        if (w.query == null || w.query.length() < 5) {
            out.println(Toolbox.emsgs(orgnum,88));
            return 0;
        }
        w.query = Webform.trim(w.query);
      
        String[] optionquerys = w.query.split(Webform.separator);
        for (int ll = 0; ll < optionquerys.length; ++ll) 
        {
            optionquerys[ll] = optionquerys[ll].trim();
            optionquerys[ll] = Generic.getStoredOpts(optionquerys[ll],orgnum);
        }
        int jjj = 1;
        int numoptionquery = optionquerys.length;
        boolean nodb = (adapter == null);
        if (nodb)
        {
            adapter = Toolbox.getUserAdapter(user,orgnum);
            if ((err = adapter.error()) != null && err.length() != 0) 
            {
                adapter.close();
                out.println(err + DataAccess.height((int)err.length()));
                return 0;
            }
        }
        if (user.keys == null || user.keys.equals("")) {
            user.keys = "10001,30db31542ace0f7d37a629ee5eba28cb,7";
        }
        int startingrow = 0;
        if ((x = saved.get("$sr$")) != null) {
            try {
                startingrow = Integer.parseInt((String)x);
            }
            catch (Exception e) {
                // empty catch block
            }
        }
        
        
        if (rsaencencnum == 1 || rsaencencnum == 3) {
            if (user.keys.equals("")) {
                --rsaencencnum;
            }
            numRows = adapter.executeQuery1(optionquerys[0], out, w, user.keys, startingrow);
        } else {
            numRows = adapter.executeQuery1(optionquerys[0], out, w, null, startingrow);
        }
        if (numRows == -1) 
        {
           
            err = "<table width=600><tr><td width=600>" + adapter.dburl + ":" +  adapter.error();
            if ((user.roles & 16) > 0) 
            {
                err = err + "<br><font color=red>" +   adapter.dbms + ":" + Toolbox.removescript(Webform.mysql2c(adapter.dbms, optionquerys[0])) + "</font><br>";
            }
            err = err + "</td></tr></table>";
            out.print(err);
            adapter.close();
            return 0;
        }
       
        numRows-=startingrow;
        if ((numCols = adapter.getColumnCount()) == 0) {
            String phs = "";
            if (numRows > 1) {
                phs = "s";
            }
            out.println("" + numRows + " row" + phs + " affected");
            adapter.close();
            return 1;
        }
        String[] options = new String[numCols];
        out.print("<script>");
        out.print("var labels=[");
        for (int j = 0; j < w.labels.length; ++j) {
            out.print("'");
            out.print(w.labels[j]);
            out.print("'");
            if (j >= w.labels.length - 1) continue;
            out.print(",");
        }
        out.print("],positionstr='" + (w.positions != null ? w.positions : "") + "',");
        out.print("regexs=[");
        if (w.regexs == null || numCols >  w.regexs.length)
         {
             w.regexs = new String[numCols];
             for (int q=0; q < numCols; q++) w.regexs[q] = "";
         }
         if ( w.defaultv == null || numCols >  w.defaultv.length)
         {
             w.defaultv = new String[numCols];
             for (int q=0; q < numCols; q++) w.defaultv[q] = "";
         }
        for (int j2=0; j2 < numCols; j2++)
        {
            out.print("\"" + Generic.handle(w.regexs[j2]) + "\",");
        }
        out.print("''];H='" + w.fieldstr() + "',");
        String[] types = w.ctypes;
        boolean needsha1 = false;
        
        for (int j2 = 0; j2 < numCols; ++j2) {
            types[j2] = types[j2].substring(0, 1);
            if (types[j2].equals("s") || types[j2].equals("S") || types[j2].equals("r") || types[j2].equals("R") || types[j2].equals("w") || types[j2].equals("W")) {
                if (numoptionquery > jjj) {
                    options[j2] = optionquerys[jjj++];
                } else {
                    types[j2] = types[j2].equals("s") || types[j2].equals("r") || types[j2].equals("w") ? "t" : "T";
                }
            }
            if (needsha1 || !types[j2].equals("p")) continue;
            needsha1 = true;
        }
        out.print("ZQ = [\"" + Generic.handle(w.name) + "\",\"" + Generic.handle(w.title) + "\",");
        String yy = "";
        try
        {
            yy = MyRSA.encryptString0(w.updateQuery,orgnum>>16);
        }
        catch(Exception e)
        {
            
        }
        out.print("\"" + yy + "\",");
         
        if (w.insertQuery != null) {
            hasnew = w.permit(2, user) && w.insertQuery.length() > 0;
            out.print("\"" + MyRSA.encryptString0(w.insertQuery,orgnum>>16) + "\",");
        } else {
            out.print("'',");
            hasnew = false;
        }
        
         
        out.print("\"" + MyRSA.encryptString0(w.deleteQuery,orgnum>>16) + "\",");
        String[] helpstrings = null;
        if (!(w.help == null || w.help.equals(""))) {
            helpstrings = w.help.split(Webform.separator);
            out.print("\"" + Generic.handle(helpstrings[0]) + "\\n\\n<!---->\",");
        } else {
            out.print("'',");
        }
        String key4 = "";
        if (!(rsaencencnum != 1 && rsaencencnum != 3 || user.keys.equals(""))) {
            key4 = user.keys.split(",")[1].substring(0, 4);
        }
        out.print("\"" + subdb + "\",\"" + rsaencencnum + "\",\"" + rsaencencstr + "\",\"" + key4 + "\",\"" + Toolbox.locales[orgnum>>16].charsize + "\"],");
        if (extra == 0 && numRows > 0) {
            hasnew = false;
        }
        if (hasnew && numRows == 0 && extra == 0) {
            extra = 1;
        }
        if (!hasnew && !getformat().equals("DataPicker")) {
            extra = 0;
        }
        if (NUMROWS == 0 || numRows > NUMROWS) {
            NUMROWS = numRows + extra;
        }
 
        out.print("MS='" + (Toolbox.sessiondebug ? 1 : 0) + "," + (hasupdate ? 1 : 0) + "," + (hasdelete ? 1 : 0) + "," + (hasnew ? 1 : 0) + "," + extra + "," + numRows + "," + NUMROWS + "," + numCols + "',");
        out.print("options = new Array( " + numCols + " ),");
        out.print("captions = new Array( " + numCols + " ),");
        out.print("defaultRecord=[");
        for (int j3 = 0; j3 < numCols; ++j3) {
            out.print("\"" + DataAccess.handle((String)w.defaultv[j3]) + "\",");
        }
        out.print("''];\n");
        for (int i = 0; i < numCols; ++i) {
            if (options[i] != null)  
            out.print(this.getOptions(adapter, options[i], i, types[i], orgnum));
        }
        boolean did = false;
        WebService webservice = null;
        String alinks = "";
         
        if (w.webService != null && w.webService.length() > 0) 
        {
            int jj;
            
            alinks = this.patternstr(DataAccess.anchor, w.webService) + this.patternstr(DataAccess.inputbut, w.webService);
            w.webService = w.webService.replaceAll("<input[^>]+>", "").replaceAll("<a.*</a>", "");
            Matcher mt = DataAccess.selectname.matcher((CharSequence)w.webService.toLowerCase());
            String sql = "SELECT name,description,cgi, button,opt,caption from Operation  where  name='" + w.webService.replaceFirst("\\s+$", "").replaceAll("[\n| |,]+", "' or name='") + "'  order by button";
            String toolsql = mt.find()? w.webService : sql;
           
            for (jj = 0; !(jj >= numCols || types[jj].equals("f") || types[jj].equals("a") || types[jj].equals("A")); ++jj) {
            }
            String contentarea = "null";
            if (jj < numCols) {
                if (w.format.equals("Form")) {
                    contentarea = "ele(0," + jj + ")";
                } else if (w.format.equals("Table") || w.format.equals("LongForm")) {
                    contentarea = "ele(Z," + jj + ")";
                }
            } else if (w.format.equals("Table") || w.format.equals("LongForm")) {
                contentarea = "contentarea";
            }
            webservice = new WebService(adapter, toolsql, w.fields, "fsnd", contentarea, cachedstyle.fontsize, orgnum);
            if (webservice.m == -1) {
                out.print("var fsnd = null,mm = 0,helpbuttons = '';");
            } else {
                out.print("var fsnd = null,mm = " + webservice.m + ",helpbuttons = '';");
            }
            if (webservice.m > 0) 
            {
                int indexsc = webservice.asso.indexOf(";");
                out.print(webservice.asso.substring(0, indexsc + 1) + "function makeasso(){if (fsnd==null) return;" + webservice.asso.substring(indexsc + 1) + "}");
                out.print("helpbuttons = \"" + Generic.handle(webservice.helpbuts) + "\";");
                out.print("var tt1='';if (typeof textmsg!='undefined') tt1=textmsg[8];ZQ[5] += '<tr><td colspan=2><font color=purple><b>' + tt1 +'</b></font></td></tr>' + helpbuttons;");
                if (helpstrings != null && helpstrings.length > 1) {
                    out.print("ZQ[5] +=\"" + Generic.handle1(this.formathelp(helpstrings[1])) + "\";");
                }
                did = true;
                out.print("var webserviceAllbuts = \"" + Generic.handle(webservice.allbuts) + "\",");
                out.print("webserviceAlloptions = \"" + Generic.handle(alinks) + Generic.handle(webservice.alloptions) + "\";");
            } else {
                out.print("var webserviceAllbuts = '',webserviceAlloptions = \"" + Generic.handle(alinks) + "\";");
            }
        } 
        else 
        {
            out.print("var fsnd = null, mm = 0,helpbuttons='',webserviceAllbuts = '',webserviceAlloptions = '';");
        }
        
        out.print("var allotherlinks=\""+  Generic.handle(alinks) + "\";var onlinetoolinitial= '" + (webservice!=null?webservice.onlinetoolstr:"") + "';");
        adapter.close();
        if (!(did || helpstrings == null || helpstrings.length <= 1)) {
            out.print("var tt1='';if (typeof textmsg!='undefined') tt1=textmsg[8];ZQ[5] +='<tr><td colspan=2><font color=purple><b>' + tt1 +\"</b></font></td></tr>" + Generic.handle1(this.formathelp(helpstrings[1])) + "\";");
        }
        out.print("var STNEVE=[");
        for (int j4 = 0; j4 < DataAccess.events.length; ++j4) {
            String item = (String)saved.get(DataAccess.events[j4]);
          
            if (j4 == DataAccess.events.length - 1 && ((user.roles & 511) == 0 || user.roles == 0) && (item == null || item.indexOf("c") < 0)) {
                item = item == null ? "c" : item + "c";
            }
            if (item != null) {
                if (!(DataAccess.iscoded(item) || DataAccess.events[j4].equals("exbut"))) {
                    item = MyRSA.encryptString0(item,orgnum>>16);
                }
                out.print("\"" + item + "\"");
            } else {
                out.print("''");
            }
            if (j4 == DataAccess.events.length - 1) {
                out.print("];");
                continue;
            }
            out.print(",");
        }
        
        out.print("</script>");
        out.println("<script type=text/javascript  src=encryption.js></script>");
        if (needsha1) {
            out.println("<script type=text/javascript  src=sha1.js></script>");
        }
        out.println("<script type=text/javascript  src=decrypt.js></script>");
        if (!(w.jscript == null || w.jscript.equals("") || webservice != null && webservice.includejs.indexOf(w.jscript) >= 0)) {
            out.println("<script type=text/javascript  src=" + w.jscript + "></script>");
        }
        if (webservice != null) {
            out.println(webservice.includejs);
        }
        if (numRows == JDBCAdapter.maxrows(w.format)) {
            saved.put("$sr$", "" + (startingrow + numRows));
            adapter.close();
            return 2;
        }
        adapter.close();
        return 1;
    }
    
    public String getformat() {
        return "DataAccess";
    }


    String patternstr(Pattern p, String str) {
        Matcher m = p.matcher((CharSequence)str);
        int k = 0;
        String bf = "";
        while (m.find(k)) {
            int i = m.start();
            k = m.end();
            bf = bf + str.substring(i, k);
        }
        return bf;
    }

    void outevents(PrintWriter out) {
    }

    private String formathelp(String hp) {
        hp = hp.replaceFirst("\\n$", "");
        return "<tr><td valign=top><input style=background-color:blue;color:antiquewhite;width:65px;font-weight:700 type=button  value=" + hp.replaceAll(":", "></td><td>").replaceAll("\\n", "</td></tr><tr><td valign=top><input style=background-color:blue;color:antiquewhite;width:65px;font-weight:700 type=button  value=") + "</td></tr>";
    }
    /*
    String getOptions(JDBCAdapter a, String s, int f, String ctype) 
    {
        int n = -1;
        if (s.trim().length() >= 7 && s.trim().substring(0, 7).toLowerCase().indexOf("select ") == 0) 
        {
            String tt = Webform.mysql2c(a.dbms, s);
            
            n = a.executeQuery( tt );
            if (n == -1) s = "0;";
        }
        String str = "";
        String str1 = "";
        if (n < 0) {
            String[] sa;
            if (s.indexOf(";") < 0) {
                str = "options[" + f + "] = [\"" + s.trim().replaceAll(",", "\",\"") + "\"];";
                str = str + "captions[" + f + "] = options[" + f + "];\n";
                return str;
            }
            if ((sa = s.split(";")).length > 1) {
                str = "options[" + f + "] = [\"" + sa[1].trim().replaceAll(",", "\",\"") + "\"];";
                str = str + "captions[" + f + "] = [\"" + sa[0].trim().replaceAll(",", "\",\"") + "\"];";
            } else {
                str = "options[" + f + "] = [\"" + s.trim().replaceAll(",", "\",\"") + "\"];";
                str = str + "captions[" + f + "] = options[" + f + "];\n";
            }
            return str;
        }
        str = "options[" + f + "] = [";
        str1 = "captions[" + f + "] = [";
        for (int i = 0; n > i; ++i) {
            String tmp = a.getValueAt(i, 0);
            if (i > 0) {
                str = str + ",";
                str1 = str1 + ",";
            }
            str = str + "\"" + DataAccess.handle((String)tmp.trim()) + "\"";
            str1 = a.getColumnCount() >= 2 ? str1 + "\"" + DataAccess.handle((String)a.getValueAt(i, 1).trim()) + "\"" : (ctype.equals("s") || ctype.equals("S") || ctype.equals("r") || ctype.equals("R") || ctype.equals("w") || ctype.equals("W") ? str1 + "\"" + DataAccess.handle((String)tmp.trim()) + "\"" : str1 + "''");
        }
        return str + "];" + str1 + "];";
    }
 
     String getOptions(JDBCAdapter a, String s, int f, String ctype) {
        int n = -1;
      
        if (s.trim().length() >= 7 && s.trim().substring(0, 7).toLowerCase().indexOf("select ") == 0) {
            
            s = Webform.mysql2c(a.dbms, s);
          
            n = a.executeQuery(s);
            
        }
       
        String str = "";
        String str1 = "";
        if (n < 0) {
            String[] sa;
            if (s.indexOf(";") < 0) {
                str = "options[" + f + "] = [\"" + s.trim().replaceAll(",", "\",\"") + "\"];";
                str = str + "captions[" + f + "] = options[" + f + "];\n";
                return str;
            }
            if ((sa = s.split(";")).length > 1) {
                str = "options[" + f + "] = [\"" + sa[1].trim().replaceAll(",", "\",\"") + "\"];";
                str = str + "captions[" + f + "] = [\"" + sa[0].trim().replaceAll(",", "\",\"") + "\"];";
            } else {
                str = "options[" + f + "] = [\"" + s.trim().replaceAll(",", "\",\"") + "\"];";
                str = str + "captions[" + f + "] = options[" + f + "];\n";
            }
            return str;
        }
        str = "options[" + f + "] = [";
        str1 = "captions[" + f + "] = [";
        for (int i = 0; n > i; ++i) {
            String tmp = a.getValueAt(i, 0);
            if (i > 0) {
                str = str + ",";
                str1 = str1 + ",";
            }
            str = str + "\"" + DataAccess.handle((String)tmp.trim()) + "\"";
            str1 = a.getColumnCount() >= 2 ? str1 + "\"" + DataAccess.handle((String)a.getValueAt(i, 1).trim()) + "\"" : (ctype.equals("s") || ctype.equals("S") || ctype.equals("r") || ctype.equals("R") || ctype.equals("w") || ctype.equals("W") ? str1 + "\"" + DataAccess.handle((String)tmp.trim()) + "\"" : str1 + "''");
        }
        return str + "];" + str1 + "];";
    }*/
    public static boolean iscoded(String code) {
        int i;
        try {
            i = Integer.parseInt(code);
            if (i < 9999) {
                return true;
            }
        }
        catch (Exception e) {
            // empty catch block
        }
        if (code.length() < 12) {
            return false;
        }
        for (i = 0; i < code.length(); ++i) {
            char c;
            if ((c = code.charAt(i)) >= '0' && c <= '9' || c >= 'a' && c <= 'z') continue;
            return false;
        }
        return true;
    }

    public String bool2str(boolean b) {
        if (b) {
            return "true";
        }
        return "false";
    }
}
