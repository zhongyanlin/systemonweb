/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import telaman.JDBCAdapter;
import telaman.Toolbox;

public class WebService {
    public int m = 0;
    public String asso = "";
    public String helpbuts = "";
    public String allbuts = "";
    public String includejs = "";
    public String alloptions = "";
    public boolean hasoption = false;
    public String handlers = "";
    public String onlinetoolstr = "";
    public int encnum = Toolbox.langnum;
    public static final Pattern FUNCTIONREP = Pattern.compile("^[\\w|\\d|_|\\.]+\\(.*\\)$");
    int orgnum = Toolbox.langnum<<16;
    
    public WebService(JDBCAdapter adapter, String sql, String[] exists, String formname, String textarea, int buttonwidth, int orgnum) 
    {
        Vector<String> ext = new Vector<String>(10);
        this.orgnum = orgnum;
        
        String filestr = "";
        if (exists != null) 
        {
            for (int i = 0; i < exists.length; ++i) 
            {
                ext.addElement(exists[i].toLowerCase());
            }
        }
        
        this.asso = "var asso = new Array();";
        this.m = 0;
        boolean b = adapter.executeQuery2(sql,false);
        boolean shrinck = false;
        StringBuilder allbutstr = new StringBuilder();
        for (int j = 0; adapter.getValueAt(j,0)!=null; ++j) 
        {
            this.m++;
            String option;
            String caption;
            
            String name = adapter.getValueAt(j, 0);
            if (name.equals("Import") && DBAdmin.server2admin(adapter.server) != null)
            {
                shrinck = true;
                continue;
            }
            String des = adapter.getValueAt(j, 1);
            String cgi = adapter.getValueAt(j, 2);
            String cp1;
            if ((caption = adapter.getValueAt(j, 5)) == null || caption.equals("") ) 
            {
                caption = name;
            }
            else
            {
                cp1 = Toolbox.dbadmin[orgnum%65536].code2caption[orgnum>>16].get(caption);
                if (cp1!=null)
                caption = cp1;
                else caption = name;
            }
           
            String style = "style=background-color:" + adapter.getValueAt(j, 3);
            this.helpbuts = this.helpbuts + "<tr><td valign=top><input  class=BlueButton " + style + " type=button  value=\"" + caption + "\" ></td><td>" + des + "</td></tr>";
            option = adapter.getValueAt(j, 4);
            if (option == null) 
            {
                option = "";
            }
            
            //if (name.indexOf("Attach")!=0 && name.indexOf("Upload")!=0)
            //onlinetoolstr += ";" + Webform.trim(caption) + ";tealeaman;" + Webform.trim(des) + ";" + Webform.trim(name) + ";" + Webform.trim(cgi)  +";" + Webform.trim(option);
            int ll;
            if (WebService.isFunctionStr(option)) 
            {
                String newentry;
                String argu = option.replaceFirst("[^\\(]+\\([ ]*", "").replaceFirst("[ ]*\\)[ ]*$", "");
                String calls = option.replaceFirst("\\(.*", "(");
                String seq = "";
                String[] args = argu.split(",");
                if (!cgi.equals("") && this.includejs.indexOf(newentry = "<script type=text/javascript  src=" + cgi + "></script>\n") < 0) 
                {
                    this.includejs = this.includejs + newentry;
                }
                
                if (!argu.equals("")) 
                {
                    for ( ll = 0; ll < args.length; ++ll) 
                    {
                        double dd = 0.0;
                        if (!seq.equals("")) 
                        {
                            seq = seq + ",";
                        }
                        try 
                        {
                            dd = Double.parseDouble(args[ll]);
                            seq = seq + args[ll];
                            continue;
                        }
                        catch (Exception e) 
                        {
                            int zz;
                            int vv;
                            if (args[ll].equals("this")) 
                            {
                                seq = seq + "this";
                                continue;
                            }
                            if (args[ll].charAt(0) == '\'' || args[ll].charAt(0) == '\"') 
                            {
                                seq = seq + args[ll];
                                continue;
                            }
                            if ((zz = args[ll].indexOf("_")) == -1) 
                            {
                                zz = args[ll].length();
                                String[] arrstring = args;
                                int n = ll;
                                arrstring[n] = arrstring[n] + "_a";
                            }
                            String dtype = "text";
                            String dname = args[ll].substring(0, zz);
                            seq = (dtype = args[ll].substring(zz + 1)).toLowerCase().indexOf("a") == 0 ? seq + textarea : (dtype.toLowerCase().indexOf("n") == 0 ? seq + "parseFloat(formselementbyname(" + formname + ",'" + dname + "').value)" : (dtype.toLowerCase().indexOf("s") == 0 ? seq + "formselementbyname(" + formname + ",'" + dname + "').value" : seq + "formselementbyname(" + formname + ",'" + dname + "')"));
                            for (vv = ext.size() - 1; !(vv < 0 || dname.toLowerCase().equals((String)ext.elementAt(vv))); --vv) 
                            {
                            }
                            if (vv != -1 || dtype.toLowerCase().indexOf("a") == 0) continue;
                            if (dtype == null || dtype.toLowerCase().indexOf("t") == 0) 
                            {
                                dtype = "text";
                            } else if (dtype.toLowerCase().indexOf("h") == 0) 
                            {
                                dtype = "hidden";
                            } else if (dtype.toLowerCase().indexOf("p") == 0) 
                            {
                                dtype = "password";
                            } else if (dtype.toLowerCase().indexOf("r") == 0) 
                            {
                                dtype = "radio";
                            } else if (dtype.toLowerCase().indexOf("c") == 0) 
                            {
                                dtype = "checkbox";
                            } else if (dtype.toLowerCase().indexOf("f") == 0) 
                            {
                                dtype = "file";
                            }
                             
                            String sty = this.stylestr(dtype);
                            if (dtype.equals("radio") || dtype.equals("checkbox")) 
                            {
                                this.alloptions += "<td><nobr>" + dname.substring(0, 1).toUpperCase() + dname.substring(1) + "</nobr></td>";
                                this.hasoption = true;
                            }
                            else if (dtype.equals("file"))
                            {
                                this.alloptions += "<td><input type=file value=\"" + dname + "\" name=\"" + dname + "\" style=\"width:1px;visibility:hidden\"></td>";
                                allbutstr.append("<input class=BlueButton    ");
                                allbutstr.append(style);
                                allbutstr.append("   type=button   name=webservice");
                                allbutstr.append(j );
                                allbutstr.append("   value=\"" );
                                allbutstr.append(Toolbox.emsgs(orgnum,1507) );
                                allbutstr.append("\" onclick=\"javascript:this.form" );
                                allbutstr.append(dname );
                                allbutstr.append(".onclick()\" onMouseOver=\"showhintcap(this)\"  onMouseOut=\"hidemyhint()\" ><br>");
                            }
                            else
                            {
                                this.alloptions += "<td><input type=" + dtype + " name=\"" + dname + "\" value=\"" + dname + "\" " + sty + " ></td>";
                            }
                            ext.addElement(dname.toLowerCase());
                        }
                    }
                }
               
                allbutstr.append("<input class=BlueButton    " );
                allbutstr.append( style );
                allbutstr.append("  type=button   name=webservice"); 
                allbutstr.append( j );
                allbutstr.append("  value=\"" );
                allbutstr.append( caption );
                allbutstr.append( "\" onclick=\"javascript:" );
                allbutstr.append(calls );
                allbutstr.append(seq );
                allbutstr.append(")\" onMouseOver=\"showhintcap(this)\"  onMouseOut=\"hidemyhint()\" ><br>");
                if (this.handlers.equals("")) 
                {
                    this.handlers = "var handler = ['" + calls + ")'";
                }
                else
                {
                    this.handlers = this.handlers + ",'" + calls + ")'";
                }
                 
            }
            else 
            {
                 
                String[] opts = option.split("&");
                String tail = "?";
                boolean isatta = false;
                for (ll = 0; ll < opts.length; ++ll) 
                {
                    int zz;
                    int vv;
                    String dfv = "";
                    if (opts[ll].indexOf("=") > 0) 
                    {
                        dfv = opts[ll].replaceFirst("[^=]+=", "");
                        opts[ll] = opts[ll].replaceFirst("=.*", "");
                    }
                    if ((zz = opts[ll].indexOf("_")) == -1) 
                    {
                        zz = opts[ll].length();
                        String[] arrstring = opts;
                        int n = ll;
                        arrstring[n] = arrstring[n] + "_a";
                    }
                    String dtype = opts[ll].substring(zz + 1);
                    String dname = "";
                    if (zz > 0) {
                        dname = opts[ll].substring(0, zz);
                    }
                    for (vv = ext.size() - 1; !(vv < 0 || dname.toLowerCase().equals((String)ext.elementAt(vv))); --vv) {
                    }
                    if (vv != -1) {
                        if (dtype.toLowerCase().indexOf("a") != 0) continue;
                        
                        this.asso = this.asso + "for (var jj=0;jj<" + formname + ".elements.length;jj++) if (" + formname + ".elements[jj].name == '" + dname + "') {asso[" + j + "] = " + formname + ".elements[jj]; break;}";
                        continue;
                    }
                    if (dtype.toLowerCase().indexOf("a") == 0) {
                        
                        this.asso = this.asso + "for (var jj=0;jj<" + formname + ".elements.length;jj++) if (" + formname + ".elements[jj].name == '" + dname + "') {asso[" + j + "] = " + formname + ".elements[jj]; break;}";
                        dtype = "hidden";
                    } else if (dtype == null) {
                        dtype = "hidden";
                    } else if (dtype.toLowerCase().indexOf("h") == 0) {
                        dtype = "hidden";
                    } else if (dtype.toLowerCase().indexOf("t") == 0) {
                        dtype = "text";
                    } else if (dtype.toLowerCase().indexOf("p") == 0) {
                        dtype = "password";
                    } else if (dtype.toLowerCase().indexOf("r") == 0) {
                        dtype = "radio";
                    } else if (dtype.toLowerCase().indexOf("c") == 0) {
                        dtype = "checkbox";
                    } else if (dtype.toLowerCase().indexOf("f") == 0) {
                        dtype = "file";
                    }
                     
                    if (dtype != null && dtype.equals("file")) {
                        this.hasoption = true;
                    } else if (dtype.equals("radio") || dtype.equals("checkbox")) {
                        this.alloptions += "<td><nobr>" + dname.substring(0, 1).toUpperCase() + dname.substring(1) + "</nobr></td>";
                        this.hasoption = true;
                    }
                    
                    String sty = this.stylestr(dtype);
                    if (dtype != null && dtype.equals("file")) 
                    {
                        if (filestr.indexOf("type=file") < 0) 
                        {
                            filestr +=   "<td>";
                            if (!dfv.equals("")) 
                            {
                                filestr +=  "<input type=hidden name=\"MaxUploadSize\" value=" + dfv + ">";
                            }
                            allbutstr.append( "<input class=BlueButton   "); 
                            allbutstr.append( style ); 
                            allbutstr.append( "   type=button\n name=webservice" ); 
                            allbutstr.append( j ); 
                            allbutstr.append( "   value=\"" ); 
                            allbutstr.append( Toolbox.emsgs(orgnum,1507) ); 
                            allbutstr.append( "\" onclick=\"this.form.localpathtoupload.click()\" onMouseOver=\"showhintcap(this)\"  onMouseOut=\"hidemyhint()\" ><br>");

                            filestr += "<input type=file style=width:1px;visibility:hidden name=\"localpathtoupload\"   onchange=\"clickedhere(this);webservice(" + textarea + ",'" + cgi + tail + "'," + j + ",null)\"></td>" ;
                            isatta = true;
                        }
                    } 
                    else if (dtype != null && dtype.equals("radio")) 
                    {
                        String[] labels = dfv.split(",");
                        for (int l = 0; l < labels.length; ++l) 
                        {
                            this.alloptions +=  "<td>" + labels[l] + "</td><td><input type=" + dtype  + " name=\"" + dname + "\" value=\"" + labels[l] + "\" " + sty + "></td>";
                        }
                    } 
                    else if (dtype != null && dtype.equals("checkbox")) 
                    {
                        if (!dfv.equals("")) 
                        {
                            dfv = " checked ";
                        }
                        this.alloptions += "<td><input type=" + dtype + " name=\"" + dname + "\" " + dfv + "\" " +  sty + "></td>";
                    } 
                    else 
                    {
                        this.alloptions += "<td><input type=" + dtype + " name=\"" + dname + "\" value=\"" + dfv + "\" " + sty +   "></td>";
                    }
                    ext.addElement(dname.toLowerCase());
                }
                ll = tail.length();
                if (tail.charAt(ll - 1) == '&' || tail.charAt(ll - 1) == '?') 
                {
                    tail = tail.substring(0, ll - 1);
                }
                isatta = (name.indexOf("Attach") == 0 || name.indexOf("Upload") == 0 ) && isatta;
                if (!isatta)
                {
                allbutstr.append( "<input class=BlueButton   " );
                allbutstr.append( style );
                allbutstr.append( "   type=button\n name=webservice" );
                allbutstr.append( j );
                allbutstr.append( "  value=\"" );
                allbutstr.append( caption );
                allbutstr.append( "\" onclick=\"webservice(" );
                allbutstr.append( textarea );
                allbutstr.append( ",'" );
                allbutstr.append( cgi );
                allbutstr.append( tail); 
                allbutstr.append( "'," );
                allbutstr.append( j );
                allbutstr.append( ",this)\" onMouseOver=\"showhintcap(this)\"  onMouseOut=\"hidemyhint()\" ><br>");
                }
                if (this.handlers.equals("")) 
                {
                    this.handlers = "var handler = ['" + cgi + tail + "'";
                }
                else
                {
                    this.handlers = this.handlers + ",'" + cgi + tail + "'";
                }
                 
            }
        }
        if (shrinck) m--;
        if (!this.handlers.equals("")) 
        {
            this.handlers = this.handlers + "];";
        }
        if (!this.alloptions.equals("") || !filestr.equals("")) 
        {
             this.alloptions = "<table cellpadding=0 ellspacing=0><tr>"   + filestr +  this.alloptions + "</tr></table>";
        }
        this.allbuts = allbutstr.toString();
    }
    
    public static boolean isFunctionStr(String str) {
        if (str == null) {
            return false;
        }
        Matcher md = WebService.FUNCTIONREP.matcher((CharSequence)str);
        return md.replaceAll("").equals("");
    }

    public String stylestr(String dtype) {
        switch (dtype.charAt(0)) {
            case 't': {
                return " style=\"border:1px #b0b0b0 solid;background-color:var(--tbgcolor);color:#aaaaaa\"  onblur=\"textboxhint(this,1)\" onfocus=\"textboxhint(this,0)\" size=6 ";
            }
            case 'f': {
                return " style=\"border:1px #b0b0b0 solid;background-color:var(--tbgcolor);width:90px;\" size=2 ";
            }
            case 'p': {
                return " style=\"border:1px #b0b0b0 solid;background-color:var(--tbgcolor);\" size=6 ";
            }
            case 'c': 
            case 'r': {
                return " style=\"border:0;background-color:transparent\" ";
            }
            case 'h': {
                return "";
            }
        }
        return "";
    }

    public static void main(String[] str) {
        String wwebService = "Preview,LaTexML";
        String toolsql = "SELECT name,description,cgi, button,opt,caption from Operation  where  name='" + wwebService.replaceFirst("\\s+$", "").replaceAll("[\n| |,]+", "' or name='") + "'  order by button";
        String contentarea = "textarea";
        String[] fields = new String[]{"Title", "DateTime", "Format", "Content"};
        JDBCAdapter adapter = new JDBCAdapter("jdbc:odbc:" + Toolbox.appname + "sys", "sun.jdbc.odbc.JdbcOdbcDriver", "", "",0);
        WebService webservice = new WebService(adapter, toolsql, fields, "fsnd", contentarea, 65,0);
        adapter.close();
    }
}
