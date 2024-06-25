 
package telaman;
import java.io.*;
import java.util.*;
import java.util.regex.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.nio.charset.StandardCharsets;
import java.util.zip.GZIPInputStream;
import javax.servlet.annotation.WebServlet;

@WebServlet(name = "Generic", urlPatterns = {"/Generic"},   asyncSupported = false)
public  class Generic extends HttpServlet 
{
    public static final String scripthead = "<script>";
    public static final String scriptclose = "</script>";
    public static String closebutton = "<br><script  type=text/javascript>if (parent==window || parent.frames.length < 2)document.write('<center><input type=button style=background-color:#00BBBB;color:red;font-weight:700;width:68px value=Close onClick=window.close()></center>');window.focus();</script>";
    public static final Pattern ag = Pattern.compile("<");
    public static final String ag1 = "\\\\x3C";
    public static final Pattern cr = Pattern.compile("\\r");
    public static final String cr1 = "";
    public static final Pattern bs = Pattern.compile("\\\\");
    public static final String bs1 = "\\\\\\\\";
    public static final Pattern nl = Pattern.compile("\\n");
    public static final String nl1 = "\\\\n";
    public static final Pattern qu = Pattern.compile("\"");
    public static final String qu1 = "\\\\\"";
    public static final Pattern ss = Pattern.compile("^\\s+");
    public static final String ss1 = " ";
    public static final Pattern se = Pattern.compile("\\s+$");
   // public static final Pattern twoblank = Pattern.compile("\n\n+");
    public static final Pattern FUNCTIONREP = Pattern.compile("^[\\w|\\d|_|\\.]+\\(.*\\)$");
    public static long sessionnum = 0;
    public static HashMap<String,Webform> storedProc  = new HashMap(700);
    public static HashMap<String,WebformLang> storedProcLang = new HashMap(700*2);
    public static ArrayList<String>[] storedProcOpts = null;
    public static String getStoredOpts(String s, int orgnum)
    {
        if (s==null||s.indexOf("@#")!=0) return s;
        try
        {
             int i = orgnum>>16;
             int k = orgnum % 65536;
             int l = s.indexOf(";" + k + ":");
             if (l > -1) 
                s = s.replaceFirst("@#.*;" + k + ":([0-9]+).*","$1");
             else
                s = s.replaceFirst("@#;0:([0-9]+).*","$1");
                 
             int optsnum = Integer.parseInt(s);
             if (optsnum < Generic.storedProcOpts[i].size())
                return Generic.storedProcOpts[i].get(optsnum);
        }catch(Exception e1){ }
        
        return s;
    }
    static String details = "";
    String rdap = null; 
    protected void processRequest(HttpServletRequest request, HttpServletResponse response, boolean isget) throws ServletException, IOException {
        HttpSession session = request.getSession();
        PrintWriter out;
        int orgnum = Toolbox.setcharset(request, response);
         
        if (orgnum < 0) return;
        CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        String encoding = Toolbox.encoding;
        String language = Toolbox.langs[Toolbox.langnum];
        if ((orgnum>>16) < Toolbox.langs.length)
        {    
            encoding = Toolbox.encodings[orgnum>>16];
            language = Toolbox.langs[orgnum>>16];
        }  
        String urlp,url;
        url = Toolbox1.geturl(request).replaceFirst("\\?.*","")  ;
        
        Webform w = null;
        
        String timeformat = Toolbox.timeformat[orgnum>>16];
        JDBCAdapter adapter = null;
        HashMap<String, String> saved = null;
        String err = "";
        String userid = "";
        String subdb = null;
        boolean hasbg = true;
     
        if (!Toolbox.verifytoken(request)) {
            PrintWriter out2 = response.getWriter();
            out2.println(Toolbox.emsgs(orgnum,1404));
            out2.close();
            return;
        }
        urlp = "";
        err = "";
            
        saved = (HashMap<String, String>)session.getAttribute("savedDBRequest");
        
        if (saved == null ||  saved.get("$sr$") == null && !getformat().equals("DataSelect")) 
        {
            if (saved == null) 
            {
                saved = new HashMap<String, String>();
            }
            boolean haszpcrpt = false;
            int kk = 0;
            Enumeration e = request.getParameterNames();
            boolean more = true;
            
            while (more && e.hasMoreElements()) 
            {
                String na;
                if ((na = (String)e.nextElement()).equals("1")) continue;
                String va = request.getParameter(na);
                if (na.equals("code6b"))
                {
                    va = Unicode6b.decode(va);
                    String [] y = (new CSVParse(va, '\'', new String[]{"&"})).nextRow();
                    for (String z:y)
                    {
                        int q = z.indexOf("="); 
                        saved.put(z.substring(0,q),z.substring(q+1));
                    }
                    continue;
                }
                if (na.equals("extraline"))
                {
                    saved.put(na,va);
                     continue;
                } 
                if (na.equals("zpcrpt")) 
                {
                    haszpcrpt = true;
                    Toolbox.unpack(saved, va);
                    saved.remove("zpcrpt");
                    try{ 
                        int orgnum0 = Integer.parseInt(saved.get("orgnum"));
                        orgnum = ((orgnum >> 16) << 16) + orgnum0%65536;
                    }catch(Exception e1){}
                    urlp = va;
                    continue;
                }
                if (!encoding.equals("utf-8") && isget) 
                {
                    na = Toolbox.c2c(na,orgnum);
                    va = Toolbox.c2c(va,orgnum); 
                }
             
                if (saved.containsKey(na) && !haszpcrpt) 
                {
                    saved.remove(na);
                }
                
                if (na.indexOf("on") == 0 && !va.trim().matches("^[0-9]+$") || !Toolbox.isaparam(na) )
                {
                    va = "";
                }
                if (na.equals("orgnum") )
                {
                  //  try{ orgnum = Integer.parseInt(va);}catch(Exception e1){}
                }
                if (Toolbox.isaparam(na) && haszpcrpt || na.equals("qrqlpin")) continue;
                va = Toolbox.validateparam(na, va);
                if (na.equals("stoken")==false){urlp += "&" + na + "=" +   va;}
               
                saved.put(na, va);
                kk++;
                if (kk>45 && saved.get("rdap")!=null) more = false;
            }
            if (saved.get("Encoding") == null) 
            {
                saved.put("Encoding", encoding );
               
            }
            if (saved.get("encoding") == null) 
            {
                saved.put("encoding", encoding );
                
            }
            if (saved.get("Langcode") == null) 
            {
                saved.put("Langcode", language );
            }
            if (saved.get("langcode") == null) 
            {
                saved.put("langcode", language );
                
            }
            if (saved.get("semester") == null) 
            {
                saved.put("semester",  Toolbox.dbadmin[orgnum%65536].currentSemester);
                urlp += "&semester=" +  Toolbox.dbadmin[orgnum%65536].currentSemester;
            }
          
            if (urlp.indexOf("&")>=0 && urlp.indexOf("=")>=0) urlp = Encode6b.zip64(urlp);
            
            saved.put("zpcrpt", urlp);
            
        }
        else
        {
            if (saved.get("zpcrpt") != null)
            {
                Toolbox.unpack(saved, saved.get("zpcrpt"));
              
                saved.remove("zpcrpt");
            }
        }
       
        if (saved.get("semester")==null) 
            saved.put("semester", Toolbox.dbadmin[orgnum%65536].currentSemester );
         
        if (urlp.equals("")) urlp = Toolbox.defaultParam(orgnum,request, "zpcrpt", "");
       
        boolean bl = hasbg = saved == null || saved.get("nobg") == null;
        if (saved != null) {
            rdap =  saved.get("rdap");
        }
        String reconnected = "";
        if (Toolbox.initstatus == 3 && Toolbox.hasiconnection() )
        {
            AppContextListener.initit(Toolbox.encoding);
            if (Toolbox.initstatus < 3)
                reconnected = "Reconnected";
        }
       
        if ( rdap == null) 
        {
            UploadFile.readbinary(saved, request);
           if (saved.get("zpcrpt")!=null)
           {
               Toolbox.unpack(saved, saved.get("zpcrpt"));
               saved.remove("zpcrpt");
           }
            try{ 
                int orgnum0 = Integer.parseInt(saved.get("orgnum"));
                orgnum = ((orgnum>>16) << 16) + orgnum0 % 65536;
            }catch(Exception e1){}
            rdap = saved.get("rdap");
        }
       
        if (saved == null || rdap == null) 
        {    
            err = Toolbox.emsgs(orgnum,105);
            PrintWriter out3 = response.getWriter();
            out3.println("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) +   "</head><body><script>if (parent.parent.parent.opener!=null && typeof(parent.parent.parent.opener.resumeFailed)!='undefined'){parent.parent.parent.opener.resumeFailed(window);}</script>" + err + "</body></html>");
            out3.flush();
            out3.close();
            if (saved != null) {
                saved.clear();
            }
            session.removeAttribute("wcds");
            session.removeAttribute("savedDBRequest");
            return;
        }
        Object current = session.getAttribute("User");
        User user = (User)current;
        DBConnectInfo dc = null;
        subdb = (String)saved.get("subdb");
        boolean goodsubdb = true;
       
         
        if (user == null) 
        {
            user = new User(orgnum);
            user.iid = subdb;
            user.roles = 0;
            if (subdb != null) {
                goodsubdb = user.changedb(subdb);
            }
        } 
        else 
        {
            if (orgnum!=-1 && (orgnum%65536)!= (user.orgnum%65536))
            {
                return;
            }
            user.orgnum = orgnum;
            dc = new DBConnectInfo(user.dbinfo);
            if (subdb != null) 
            {
                goodsubdb = user.changedb(subdb);
            }
        }
        if (!reconnected.equals(""))
        Toolbox.msgqueueput((orgnum%65536) + user.id, Toolbox.emsgs(orgnum,1481));
         
        if (!goodsubdb) {
           
            PrintWriter out4 = response.getWriter();
            err = "Incorrect data source";
            out4.println("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + Toolbox.jaxhead + "</head><body>" + err + ":" + subdb + " has database. Open 'User Databases' to add one</body></html>");
            out4.flush();
            out4.close();
            session.removeAttribute("wcds");
            session.removeAttribute("savedDBRequest");
            saved.clear();
            return;
        }
        userid = user.id;
        boolean systemrdap = saved.get("cdrdap") == null || saved.get("cdrdap").equals("");
        int rdapsource = 105;
        Webform w0;
        if (systemrdap && Generic.storedProc != null && (w0 =  Generic.storedProc.get(rdap)) != null) 
        {
             
            w = new Webform(w0);
            rdapsource = 115;
        }
      
        if (w == null) 
        {
            int nn;
            adapter = Toolbox.getUserAdapter(user, orgnum);
            if ((err = adapter.error()) != null && err.length() != 0) 
            {
                if ( (user.roles & Systemroles.SYSTEMADMIN) > 0)
                {
                    adapter.close();
                    user.dbinfo = Toolbox.dbadmin[user.orgnum%65536].sysDBConnectInfo();
                    adapter = Toolbox.getSysAdapter(orgnum); 
                    adapter.orgnum = orgnum;
                    adapter.errormsg.setLength(0);
                }
            }
            
            if ((err = adapter.error()) != null && err.length() != 0) 
            {
                if (adapter != null) 
                {
                    adapter.close();
                }
                
                PrintWriter out5 = response.getWriter();
                String err1 = "Incorrect data source";
                out5.println("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + Toolbox.jaxhead + "</head><body>" + err + ":" + err1 + "</body></html>");
                out5.flush();
                out5.close();
                session.removeAttribute("wcds");
                session.removeAttribute("savedDBRequest");
                saved.clear();
                return;
            }
   
            String sql11 = "SELECT * FROM Task WHERE name='" + rdap.replaceFirst("\\$$", "") + "'";
            boolean b = adapter.executeQuery2(sql11,false);
 
            if (b==false ||  adapter.getValueAt(0,0)==null) 
            {
                err = Toolbox.emsgs(orgnum,1066) + " <b>" + rdap + "</b> " + Toolbox.emsgs(orgnum,1531);
                err = "Incorrect rdap.";
                if (b) 
                {
                    err = err + adapter.error();
                }
                out = response.getWriter();
                out.println("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + Toolbox.jaxhead + "</head><body>" + err + "</body></html>");
                out.flush();
                out.close();
                saved.clear();
                session.removeAttribute("wcds");
                session.removeAttribute("savedDBRequest");
                adapter.close();
                return;
            }
             
            w = new Webform(adapter,0);
            w.parseQuery( );
          
            if (!w.err.equals(""))
            {
                session.removeAttribute("wcds");
                session.removeAttribute("savedDBRequest");
                adapter.close();
                return;
            }
         
            w.name = rdap;
            rdapsource = 114;
            String[] x = new String[2];
            String zz = getformat();
            String wformat = "";
            if (zz!=null && zz.length()>=4)
            wformat = zz.substring(4);
          
            if (wformat.equals("Table") || wformat.equals("Form") || wformat.equals("LongForm")) 
            {
                 
                if (w.valid) 
                {
                    Object tid = null;
                    if (w.permit(3, user)) 
                    {
                        w.compile(w.updateQuery, x, false);
                        w.updateQuery = x[0];
                    } else 
                    {
                        w.updateQuery = "";
                    }
                       
                    
                    if (w.permit(2, user)) {
                        w.compile(w.insertQuery, x, true);
                        w.insertQuery = x[0];
                    } else {
                        w.insertQuery = "";
                    }
                    if (w.permit(4, user)) {
                        w.compile(w.deleteQuery, x, false);
                        w.deleteQuery = x[0];
                    } else {
                        w.deleteQuery = "";
                    }
                } 
                else 
                {
                    w.updateQuery = "";
                    w.insertQuery = "";
                    w.deleteQuery = "";
                }
          
            } 
            else if (!wformat.equals("Web")) 
            {
                w.updateQuery = "";
                w.insertQuery = "";
                w.deleteQuery = "";
            }
           
        }
        else
        {  
           // if (Toolbox.langnum!= (orgnum>>16))
            {
                Task task = new Task(null);
                WebformLang ws = storedProcLang.get(w.name + "," + Toolbox.langs[orgnum>>16]);
               
                if (ws!=null)
                {
                     task.applyStoredLang(orgnum,w,ws);
                }
                else
                {
                   
                }
            }
        }
        
        if (w.name.equals("lebbewr5x0")) {
            w.roles = user.roles;
        }
     
        if (w.format.equals("Web") || getformat().equals("DataManager")) {
            DataManager.searchwcds(saved, w, user);
        }
       
        this.modifysaved(saved, w, user);
        if (w.format.equals("Web")) {
            w.insertQuery = "";
            w.updateQuery = "";
            w.deleteQuery = "";
        }
        
        String zz = getformat();
        if (zz!=null && zz.length() >=4)
         w.format = zz.substring(4);
      
        if (!w.permit(1, user)) {
            if (user.id.equals("")) {
               // session.setAttribute("savedDBRequest", saved);
                session.removeAttribute("wcds");
                session.removeAttribute("savedDBRequest");
                String gotourl = null;
                if (isget || saved.get("targetisself")!=null) 
                    gotourl = "/login.jsp?follow=/" + getformat() + "&error=generic&zpcrpt=" +  urlp;
                else
                    gotourl = "/login.jsp?follow=R&orgnum=" + orgnum;
                RequestDispatcher dispat = this.getServletConfig().getServletContext().getRequestDispatcher(gotourl);
                dispat.forward((ServletRequest)request, (ServletResponse)response);
                return;
            }
            String tt1 = new Systemroles(w.roles).toString().replaceAll(",", "<br>");
            if (w.roles == 0) {
                tt1 = Toolbox.emsgs(orgnum,45);
            }
            err = !w.name.equals("lebbewr5x0") ? "<h1>Incorrect rdap</h1>" + Toolbox.emsgs(orgnum,1075) + tt1 : Toolbox.emsgs(orgnum,1098);
            err = "<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + Toolbox.jaxhead + "</head><body  style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\"><center>" + err;
           
            PrintWriter out6 = response.getWriter();
            out6.println(err + Generic.height(err.length()) + Generic.closebutton);
            out6.flush();
            out6.close();
            saved.clear();
            adapter.close();
            session.removeAttribute("wcds");
            session.removeAttribute("savedDBRequest");
            return;
        }
        //if (saved.get("langcode") == null)   saved.put("langcode", language);
        StringBuffer err1 = new StringBuffer(",");
        if (w.defaultv != null) 
        {
            for (int i = 0; i < w.defaultv.length; ++i) 
            {
                if (w.defaultv[i] == null || w.defaultv[i].equals("")) continue;
                w.defaultv[i] = this.subs(w.defaultv[i], userid, saved, w, err1, 0);
            }
        }
        if (w.title.indexOf("??semester??")>=0 || w.title.indexOf("??Semester??")>=0)
        {
            String semestercode = saved.get("Semester");
            if (semestercode==null) semestercode = saved.get("semester");
            if (semestercode!=null ) 
            {
               int scode = -1;
               try{ 
                   scode = Integer.parseInt(semestercode);
                   String str = Toolbox.dbadmin[orgnum % 65536].semestermap[orgnum>>16].get(scode);
                   if (str==null) str = semestercode;
                   w.title = w.title.replaceFirst("(?i)\\?\\?semester\\?\\?", str);
               }catch(Exception e){}
            }
        }
        w.title = this.subs(w.title, userid, saved, w, err1, 0);
        String qq = (String)(saved.get("wcds"));
        if (saved.get("wcds")==null)
            saved.put("wcds", " WHERE 1=2 ");
        w.query = this.subs(w.query, userid, saved, w, err1, 1);
        StringBuilder st = new StringBuilder();
        if (w.format.equals("Update"))
        {
             String[] optionquerys = w.query.split(Webform.separator);
             w.query = optionquerys[0];
             if (adapter==null) 
                   adapter = Toolbox.getUserAdapter(user, orgnum);
              
             for (int ll = 1; ll < optionquerys.length;  ll++) 
            {
                String y = optionquerys[ll].trim();
                y =  getOptions(adapter,y, ll-1, "s", orgnum);
                st.append(y); 
            }
        }
        w.updateQuery = this.subs(w.updateQuery, userid, saved, w, err1, w.format.equals("Search") || w.format.equals("Select") ? 0 : 1);
        w.deleteQuery = this.subs(w.deleteQuery, userid, saved, w, err1, w.format.equals("Search") || w.format.equals("Select") ? 0 : 1);
        w.insertQuery = this.subs(w.insertQuery, userid, saved, w, err1, w.format.equals("Search") || w.format.equals("Select") ? 0 : 2);
        w.webService = this.subs(w.webService, userid, saved, w, err1, 0);
        w.help = this.subs(w.help, userid, saved, w, err1, 0);
          
        if (err1.length() > 1) 
        {
            err = err1.toString().substring(1);
            out = response.getWriter();
            if (user.timeformat.equals("")) 
            {
                user.timeformat = Toolbox.timeformat[orgnum>>16];
            }
            out.print("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + Toolbox.jaxhead + "<script  type=text/javascript>" + Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle) + ",securitytoken=\"" + Toolbox.gentoken(getformat(), "f1") + "\",theight=150,font_size=" + cachedstyle.fontsize + ",encoding='" + encoding + "',format='" + getformat() + "',timeformat='" + cachedstyle.timeformat + "',beheading='" + Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle) + "',broser='" + Toolbox.browser(request) + "',title=\"" + Generic.handle(w.title) + "\",labelstr='" + w.labelstr() + "',fieldstr='" + err.replaceAll("\r"," ").replaceAll("\n"," ").replaceAll("'","\\'") + "',namevalue=[");
            int jj = 0;
            if (w.name.equals("lebbewr5x0")) 
            {
                out.println("\"rdap\",\"lebbewr5x0\",");
            } 
            else 
            {
                Set<String> e = saved.keySet();
               for(String na:e) 
                {
                    if (na.indexOf("password") == 0) continue;
                    String va = (String)saved.get(na);
                    if (!na.equals("query"))
                    out.println("\"" + na + "\",\"" + Generic.handle(va) + "\",");
                    ++jj;
                }
            }
            session.removeAttribute("wcds");
            session.removeAttribute("savedDBRequest");
            saved.clear();
            out.println("''];");
            if (w.format.equals("Update"))
            {
                out.println("var en2lang= new Array();\n");
                Pattern p = Pattern.compile("\\?\\?[a-z|A-Z]+\\?\\?");
                String xx = (Generic.storedProc.get(w.name)).query;
                //(new Task()).applyLang(w.name);
                Matcher m = p.matcher(xx);
                int k1 = 0;
                String lb = "";
                int ii=0;
                while ( m.find(k1))
                {
                     int i = m.start();
                     k1 = m.end();
                     String yy = xx.substring(i+2, k1-2);
                      
                     if ( ("," + lb + ",").indexOf("," + yy + ",") < 0)
                     {
                         if (lb.equals("")) lb += ",";
                         lb += yy;
                         String y1 = null;
                         if (w.labels!=null && ii < w.labels.length)
                         {
                             y1 = w.labels[ii++];
                         }
                         if (y1!=null)
                         out.println("en2lang['" + yy + "']='" + y1 + "';\n");
                     }
                }
            }
            out.println("var options=new Array(),captions=new Array();" + st.toString()  );
            out.println("var elecount=" + jj + ",rdap='" + w.name + "';" + "</script>");
            out.println("</head><body style=background-color:" + cachedstyle.DBGCOLOR + "><table align=center><tr><td><img name=testimg src=image/blank.gif width=100% height=1></td></tr><tr><td>");
            out.println("<script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script  type=\"text/javascript\" src=" + Toolbox.getUserLang(orgnum) + "></script><script type=text/javascript  src=cookie.js></script>");
            out.println("<script  type=\"text/javascript\" src=textmsgr.js></script>");
            out.println("<script  type=\"text/javascript\" src=timeformat.js></script>");
            out.println("<script  type=\"text/javascript\" src=comentity" +  orgnum + ".js></script>");
            out.println("<script  type=\"text/javascript\" src=makeinput.js></script>");
            out.println("<script  type=\"text/javascript\" src=hints.js></script>");
            out.println("</td></tr></table>");
            out.println("<script  type=\"text/javascript\" src=curve.js></script>");
            out.println("</body></html>");
            out.flush();
            out.close();
            adapter.close();
            return;
        }
        if (w.format.equals("Merge")) {
            this.processMerge(user, w, response, adapter,request);
            session.removeAttribute("wcds");
            session.removeAttribute("savedDBRequest");
            saved.clear();
        } else if (w.format.equals("CSV") || getformat().equals("DataCSV")) {
            this.processCSV(user, w, response, adapter,request);
            session.removeAttribute("wcds");
            session.removeAttribute("savedDBRequest");
            saved.clear();
        } else {
            out = response.getWriter();
       
            int retcode = this.process(user, w, out, hasbg, saved, adapter, subdb, url, cachedstyle);
            
            session.removeAttribute("wcds");
            session.removeAttribute("savedDBRequest");
            if (retcode == 1) 
            {
                session.removeAttribute(w.format + ":" + w.name);
                saved.clear();
            } 
            else 
            {
               session.setAttribute(w.format + ":" + w.name, saved);
            }
            out.close();
        }
        if (adapter!=null) adapter.close();
    }
    
    
    synchronized long getSessionnum() {
        return ++Generic.sessionnum;
    }

    public static boolean isFunctionStr(String str) {
        if (str == null) {
            return false;
        }
        Matcher md = Generic.FUNCTIONREP.matcher((CharSequence)str);
        return md.replaceAll("").trim().equals("");
    }

    public static String addlink(String str, String cap) {
        if (str == null) {
            return null;
        }
        str = cap == null ? str.replaceAll("(http:\\S+\\s?)", "<a href=$1 target=blank> $1 </a>") : str.replaceAll("(http:\\S+\\s?)", "<a href=$1 target=blank> " + cap + " </a>");
        return str;
    }

    public static String handle(String s) {
        if (s == null) {
            return null;
        }
        s = s.replace("\r\n", "\n");
        Matcher m = Generic.cr.matcher((CharSequence)s);
        s = m.replaceAll("\n");
        m = Generic.bs.matcher((CharSequence)s);
        s = m.replaceAll("\\\\\\\\");
        m = Generic.nl.matcher((CharSequence)s);
        s = m.replaceAll("\\\\n");
        m = Generic.qu.matcher((CharSequence)s);
        s = m.replaceAll("\\\\\"");
        m = Generic.ss.matcher((CharSequence)s);
        s = m.replaceAll(" ");
        m = Generic.se.matcher((CharSequence)s);
        s = m.replaceAll(" ");
        return s;
    }
    public static String handle4(String ss, int orgnum) 
    {
        String s = Toolbox1.unzip(ss).replaceFirst(",$", "");
        CSVParse p = new CSVParse(s, '\'',new String[]{"@", ","});
        String [][] x = p.nextMatrix(true);
        StringBuffer sb = new StringBuffer();
        int kk = 0;
        for (int i=0; i < x.length; i++)
        {
            if (x[i].length!=3) return handle1(ss); 
            
            sb.append(x[i][0]);
            sb.append("@");
            sb.append(x[i][1]);
            sb.append("@");
            if (x[i][2].replaceAll("[0-9]+", "").equals("___"))
            {
                sb.append(x[i][2]);
                kk++;
            }
            else if (x[i][1].replaceAll("[0-9]", "").equals("") && x[i][1].length()>9)
            {
                sb.append(MyRSA.encryptString0(x[i][2],orgnum>>16));
                kk++;
            }
            sb.append(",");
            
        }
        if (kk == x.length)
        return sb.toString();
        return handle1(ss); 
    }
    public static String handle1(String s) {
        if (s == null) {
            return null;
        } 
        s = s.replace("\\","\\\\"); 
        s = s.replace("\r\n","\\n");
        s = s.replace("\r","\\n");
        s = s.replace("\n","\\n");
        s = s.replace("\"","\\\"");
        s = s.replaceFirst("^[\\s]+"," ");
        s = s.replaceFirst("\\s+$"," ");
        //s = s.replace("</","< /"); 
        return s;
    }
    

    void modifysaved(HashMap saved, Webform w, User user) {
    }

    public static String genStoredProc(String rdap, JDBCAdapter adapter, int orgnum) {
       
        if (storedProcOpts==null) 
        {
            storedProcOpts = new ArrayList[Toolbox.langs.length];
            for (int k=0; k < Toolbox.langs.length; k++)
                storedProcOpts[k] = new ArrayList<String>();
        }
        
        String sql = "SELECT * FROM Task";
        if (rdap != null) {
            sql = sql + " WHERE name='" + rdap.replaceAll("'", "''") + "'";
            
        }
        else sql += " WHERE not format ='Web'";
        if(adapter==null)
            adapter = Toolbox.getUserAdapter(Toolbox.dbadmin[0].sysDBConnectInfo(), orgnum-orgnum%65536);
 
        boolean bb = adapter.executeQuery2(sql,false); 
        String err = "";
        if ((!bb || adapter.getValueAt(0,0)==null) && rdap != null) 
        {
            adapter.close();
            return "";
        }
        int m = 0;
        int nstored = 0; 
        for (int i = 0; adapter.getValueAt(i,0)!=null; ++i) 
        {
            nstored++;
            String[] x;
            String[] z;
            String[] y;
            Webform w = new Webform(adapter,i);
            w.parseQuery( );
           // ++adapter.cursor;
            if (!w.err.equals(""))
            {
                Toolbox.println(0, "Parse error:" + w.name + " " +   w.err);
                continue;
            }
            
           
            if (!(w.format.equals("Table") || w.format.equals("Form") || w.format.equals("LongForm") || w.format.equals("Picker"))) 
            {
                Generic.storedProc.put(w.name, w);
                ++m;
                continue;
            }
            
            try
            {
                x = new String[2];
                y = new String[2];
                z = new String[2];
                if (w.compile(w.updateQuery, x, false) && w.compile(w.insertQuery, y, true) && w.compile(w.deleteQuery, z, false)) 
                {
                    Webform tt;
                    ++m;
                    w.updateQuery = x[0];
                    w.insertQuery = y[0];
                    w.deleteQuery = z[0];
                    if (x[1] != null || y[1] != null || z[1] != null) 
                    {
                        Webform t1 = new Webform(w.name + "$", w.title, null, y[1], x[1], z[1], null, null, "Update", w.roles, w.insertroles, w.updateroles, w.deleteroles, "", "", w.postop, w.permits);
                        Generic.storedProc.put(w.name + "$", t1);
                        ++m;
                    }
                    if ((tt = w.getSearch()) != null) 
                    {
                        if (Generic.storedProc.containsKey(tt.name)) 
                        {
                            tt.name = tt.name + "0";
                        }
                        Generic.storedProc.put(tt.name, tt);
                        ++m;
                    }
                    Generic.storedProc.put(w.name, w);

                }
                else
                {  
                   err = err + w.error() + "\n";
                   Toolbox.println(0, "\n\n Failed to compile: Name=" + w.name + "\nQuery=" + w.query + "\n" + w.error() + "\n");
                }
             }catch(Exception e){ }
       }
       if (rdap==null && nstored < 10)
       {
           try
        {
            String   folder = Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "routine" + File.separator;
            File file = new File(folder +  Toolbox.appname + Toolbox.version +    "rou.crp");
            FileInputStream sin = new FileInputStream(file);
            GZIPInputStream gzis = new GZIPInputStream(sin);
            ObjectInputStream in = new ObjectInputStream(gzis);
            storedProc = (HashMap<String,Webform>)in.readObject();
            in.close();
            sin.close(); 
        }catch(Exception e){}
       }
        Task tk = new Task(adapter);
      
       if (rdap == null)
       {
           Set<String> e =  storedProc.keySet();
           for (String rdapn : e)
           {
               if (rdapn.indexOf("$") > 0) continue;
                
               Webform w = (Webform)(storedProc.get(rdapn));
               
               int j=0; 
               for ( ; j < Toolbox.langs.length;j++)
               { 
                       try{
                        if (j == Toolbox.langnum)
                        {
                            if (!Toolbox.langs[Toolbox.langnum].equals("en")) 
                            err += tk.applyLang(w,Toolbox.langnum << 16);
                        }
                        else 
                        {
                            tk.cacheLang(rdapn, Toolbox.langs[j]);
                        }
                   }catch(Exception e2){ }
               }

                try{
                  w.simplify( adapter,orgnum);
                }catch(Exception e1)
                {  
                 }
                Generic.storedProc.put(rdapn, w);
           }
           tk.close();
       }
       else
       {
           Webform w = (Webform)(storedProc.get(rdap));
           int j=0; 
           for ( ; j < Toolbox.langs.length;j++)
           { 
                   try{
                    if (j == Toolbox.langnum)
                    {
                       
                        if (!Toolbox.langs[j].equals("en")) 
                        err += tk.applyLang(w,j << 16);
                      
                    }
                    else 
                    {
                        tk.cacheLang(rdap, Toolbox.langs[j]);
                    }
               }catch(Exception e2){ }
           }
            try
            {
                w.simplify( adapter,orgnum);
            }catch(Exception e1){ 
                err = "ERROR in simplify " +w.name;
                err += ":" + e1.toString(); }
            Generic.storedProc.put(rdap, w);
            tk.close();
        }
        adapter.close();
        
        return err;
    }

    public static String header(String str, boolean b, User user, CachedStyle cachedstyle) {
        int tt = b ? 5 : 0;
        String s = "<!DOCTYPE html>\n<html lang=\""+Toolbox.langs[user.orgnum>>16]+"\" >\n<head>" + Toolbox.getMeta(user) + Toolbox.jaxhead + cachedstyle.toString() + "<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (user.orgnum) + ".css\" />\n<title>" + str + "</title></head>\n" + "<body style=\"margin:" + tt + "px " + tt + "px 4px " + tt + "px;background-color:var(--dbgcolor)\">\n";
        s = s + "<table   width=100% cellspacing=0 cellpadding=0>";
        s = s + "<tr><td width=100%>";
        return s;
    }

    String header0(User user,CachedStyle cachedstyle) {
        return "<!DOCTYPE html>\n<html lang=\""+Toolbox.langs[user.orgnum>>16]+"\" >\n<head>" + Toolbox.getMeta(user) + Toolbox.jaxhead + cachedstyle.toString() + "\n<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (user.orgnum) + ".css\" />\n<style type=text/css >body {background-color:var(--dbgcolor);}\n"
                +"table tr td form table tr td table tr td table tr td select{background-color:transparent;color:white;border:1px #c0c0c0 solid}\ntable tr td form table tr td table tr td table tr td select option{background-color:var(--ibgcolor);color:white;}"
                + "table tr td form table tr td table tr td select{background-color:transparent;color:white;border:1px #c0c0c0 solid}\ntable tr td form table tr td table tr td select option{background-color:var(--ibgcolor);color:white;}"
                +"</style>\n" + "</head>\n<body style=\"background-color:var(dbgcolor)\" leftmargin=2 topmargin=2 rightmargin=0>";
    }

    String header1(User user,CachedStyle cachedstyle) {
        return "<!DOCTYPE html>\n<html lang=\""+Toolbox.langs[user.orgnum>>16]+"\" >\n<head>\n" + Toolbox.getMeta(user) + Toolbox.jaxhead + cachedstyle.toString() + "<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (user.orgnum) + ".css\" />\n" + "<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\" />\n<style>"
                +"table tr td form table tr td table tr td table tr td select{background-color:transparent;color:white;border:1px #c0c0c0 solid}\ntable tr td form table tr td table tr td table tr td select option{background-color:" + cachedstyle.IBGCOLOR + ";color:white;}"
                +"table tr td form table tr td table tr td select{background-color:transparent;color:white;border:1px #c0c0c0 solid}\ntable tr td form table tr td table tr td select option{background-color:" + cachedstyle.IBGCOLOR + ";color:white;}"
                +" </style></head>\n" + "<body style=\"margin:0px 6px 0px 0px;background:" + cachedstyle.IBGCOLOR + " right url(image/backgd.gif) repeat-y\">\n<table style=border-width:0px border=0 align=center width=100% cellpadding=0 cellspacing=5><tr><td>";
    }

    public static String normal(String str) {
        if (str == null) {
            return null;
        }
        String empersand = new String("ZWQAC%%%UWZ");
        Matcher m = Generic.nl.matcher((CharSequence)str);
        str = m.replaceAll(" ");
        m = Generic.cr.matcher((CharSequence)str);
        str = m.replaceAll(" ");
        str = str.replaceAll(empersand, "&");
        return str;
    }

    public static void modify(Webform w) {
        w.query = Generic.handle(w.query);
        w.updateQuery = Generic.handle(w.updateQuery);
        w.deleteQuery = Generic.handle(w.deleteQuery);
        w.title = Generic.handle(w.title);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest(request, response, true);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest(request, response, false);
    }

    public void init(ServletConfig config) throws ServletException {
        super.init(config);
    }

    public void destroy() {
    }

    public String getformat() {
        return "Data";
    }

    public static HashMap saveParameters(HttpSession session, HttpServletRequest request, boolean isget1 ) 
    {
        HashMap<String, String> saved1 = (HashMap<String, String>)session.getAttribute("savedDBRequest");
        int orgnum = Toolbox.setcharset(request, null);
        String encoding = Toolbox.encoding;
        if ((orgnum>>16) < Toolbox.langs.length)
            encoding = Toolbox.encodings[orgnum>>16];
        if (orgnum < 0) return null;
        if (saved1 == null) {
            saved1 = new HashMap<String, String>();
        }
        String urlp = ""; 
        boolean haszpcrpt = false;
        int kk = 0;
        Enumeration e = request.getParameterNames();
        boolean more = true;
        while (more && e.hasMoreElements()) 
        {
            String na = (String)e.nextElement();
            if (na.equals("1") ) continue;
            String va =request.getParameter(  na );
            
            if (na.equals("zpcrpt")) 
            {
                haszpcrpt = true;
                Toolbox.unpack(saved1, va);
                saved1.put("zpcrpt",va);
                continue;
            }
            else if (na.equals("orgnum"))
                saved1.put("orgnum", ""+orgnum);
            if (!encoding.equals("utf-8") && isget1) 
            {
                na = Toolbox.c2c(na,orgnum);
                va = Toolbox.c2c(va,orgnum); 
            } 
            if (saved1.containsKey(na) && !haszpcrpt) 
            {
                saved1.remove(na);
            }
            if (na.indexOf("on") == 0 && !va.trim().matches("^[0-9]+$") || !Toolbox.isaparam(na) )
            {
                va = "";
            }
          
            if (haszpcrpt && Toolbox.isaparam(na) ||  na.equals("qrqlpin")) continue;
            va = Toolbox.validateparam(na, va);
            kk++;
            if (na.equals("stoken")==false){urlp += "&" + na + "=" +  va;}
            
            saved1.put(na, va);
            
            if (kk>45 && saved1.get("rdap")!=null) more = false;
        }
        if (saved1.get("semester") == null && orgnum!=-1) 
        {
            saved1.put("semester", Toolbox.dbadmin[(orgnum%65536)].currentSemester );
            urlp += "&semester=" +   Toolbox.dbadmin[(orgnum%65536)].currentSemester ;
        }
        if (saved1.get("Encoding") == null) 
        {
            saved1.put("Encoding", encoding );
        }
        if (saved1.get("encoding") == null) 
        {
            saved1.put("encoding", encoding );

        }
        if (saved1.get("Langcode") == null) 
        {
            saved1.put("Langcode", Toolbox.langs[(orgnum >> 16)] );

        }
        if (saved1.get("langcode") == null) 
        {
            saved1.put("langcode", Toolbox.langs[(orgnum >> 16)] );

        }
        if (urlp.indexOf("&")>=0 && urlp.indexOf("=")>=0) urlp = Encode6b.zip64(urlp);
        if (urlp.equals("")) urlp = Toolbox.defaultParam(orgnum,request, "zpcrpt", "");
        
        saved1.put("zpcrpt", urlp);
        
       
        return saved1;
    }

    public static String getCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        for (int i = 0; i < cookies.length; ++i) {
            if (!cookies[i].getName().equals(name)) continue;
            return cookies[i].getValue();
        }
        return null;
    }

    void modifysaved(HashMap s, Webform w) {
    }


    public void processMerge(User user, Webform w,HttpServletResponse response, JDBCAdapter adapter,HttpServletRequest request) {
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        //if (user!=null) orgnum = user.orgnum;
        try {
            PrintWriter out = response.getWriter();
            out.print("should not appear");
            out.close();
        }
        catch (Exception e) {
            // empty catch block
        }
    }

    public void processCSV(User c, Webform w, HttpServletResponse response, JDBCAdapter adapter,HttpServletRequest request) {
       HttpSession session = request.getSession(true);
       int orgnum = Toolbox.setcharset(request, response);
       if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        try {
            PrintWriter out = response.getWriter();
            out.print("should not appear");
            out.close();
        }
        catch (Exception e) {
            // empty catch block
        }
    }
  
    public int processData(User c, Webform w, PrintWriter out, HashMap saved, JDBCAdapter adapter, String subdb, CachedStyle cachedstyle) 
    {
        return 0;
    }
 
    public static String height(int i) 
    {
        return "<script type=text/javascript > theight = " + i + ";</script>";
    }

    private boolean needLatex(Webform w) 
    {
        return w.format.equals("Table") || w.format.equals("Form") || w.format.equals("LongForm") || w.format.equals("HTML") || w.format.equals("FormHTML");
    }

    public int process(User user, Webform w, PrintWriter out, boolean hasbg, HashMap saved, JDBCAdapter adapter, String subdb, String url,CachedStyle cachedstyle) {
        if (w.title == null) {
            w.title = "";
        }
    
       String urlp = (String)(saved.get("zpcrpt")); 
        if (url.indexOf("/DataSelect") > 0 ) 
        {
            url = url.replaceFirst("/DataSelect", "/DataSearch");
        }
            
        String timeformat = cachedstyle.timeformat;
        boolean emptyt = w.title.length() != 0;
        long tstmp = System.currentTimeMillis() % 10000000;
        if (!w.format.equals("Manager")) 
        {
            if (!(w.format.equals("Search") || w.format.equals("Select"))) 
            {
                out.print(Generic.header(w.title, emptyt, user,cachedstyle));
            } 
            else if (hasbg) 
            {
                out.print(this.header1(user,cachedstyle));
            } 
            else 
            {
                out.print(this.header0(user, cachedstyle));
            }
            DBConnectInfo dc = user.dbinfo;
            if (!(w.preop == null || w.preop.equals(""))) 
            {
                BackRoutine.preproc(user, saved, w,cachedstyle);
            }
            user.dbinfo = dc;
            out.print("<script type=text/javascript >");
            String encoding = Toolbox.encoding;
            if ((user.orgnum>>16) < Toolbox.langs.length)
            encoding = Toolbox.encodings[user.orgnum>>16];
            String langcode = Toolbox.langs[user.orgnum>>16];
            out.print( Toolbox.dbadmin[user.orgnum%65536].colors(user.orgnum,cachedstyle) + ", securitytoken=\"" + Toolbox.gentoken(getformat(), "f1") + "\",theurl='" + url + "?zpcrpt=" +  urlp +   "',tstmp=" + tstmp + ", theight=150,needtranslator=" + this.needLatex(w) + ",encoding='" +  encoding  + "', langcode='" +  langcode  + "',iid = '" + (user.iid == null ? "" : user.iid) + "',");
            out.print("timeformat = '" + cachedstyle.timeformat + "',font_size=" + cachedstyle.fontsize + ",isRegistered=" + (! user.lastname.equals("")) + ",haswebfolder=" + (user.websitename != null && ! user.websitename.equals("")|| user.webFileFolder != null && ! user.webFileFolder.equals("")) + ",beheading='" +  Toolbox.dbadmin[user.orgnum%65536].beheading(cachedstyle) + "';");
            if (emptyt) 
            {
                Toolbox.msgjspout((user.orgnum%65536)+ user.id, out, true);
            }
            out.println("</script>");
        }
       
        int xx =  processData(user, w, out, saved, adapter, subdb, cachedstyle);
    
        if (!w.format.equals("Manager")) 
        {
            boolean b;
            if ((w.format.equals("Search") || w.format.equals("Select")) && xx > 0 && saved.get("makescript") == null) 
            {
                out.print(Toolbox.sponsor(user.orgnum,9, 210));
            }
            out.print("</td></tr></table>");
            boolean bl = b =  w.format.equals("Picker") || w.format.equals("Form") || w.format.equals("Table") || w.format.equals("LongForm");
            if (!w.format.equals("Web")) 
            {
                out.print("<script  type=text/javascript src=curve.js" + (b ? "?dn=30&sn=30" : "") + "></script>");
            }
            if (b) 
            {
                out.print("\n<center><div id=copyrights style=font-size:12px;font-color:#DDCC11>" + Toolbox.copyright[user.orgnum>>16] + "</div></center>");
                out.print("<iframe name=\"w" + tstmp + "\" src=\"\" width=1 height=1 scrolling=no style=\"margin:0px;visibility:hidden\" />");
            }
            out.print("</body></html>");
            out.close();
        }
        return xx;
    }

    String subs(String s, String userid, HashMap saved, Webform w, StringBuffer err, int sqlinject) {
        boolean singlequote = false;
        if (s == null) {
            return "";
        }
       
        int state = 0;
        int N = s.length();
        boolean newlinecount = false;
        char sg = '=';
       
        String field = "";
        String field1 = null;
        StringBuffer ans = new StringBuffer(N + 100);
        for (int i = 0; i < N; ++i) 
        {
            if (s.charAt(i) == '\'') 
            {
                singlequote = !singlequote;
            }
            if (s.charAt(i) == '?') 
            {
                if (state == 3) 
                {
                   if (field.equals(""))
                   {
                       field1 = "????";
                   }
                   else   if (field.matches("[0-9]+"))
                   {     
                       field1 = "??" + field +"??";
                   }
                   else if (field.equals("CURRENT_TIME"))
                   {    
                       field1 = ""+((new java.util.Date()).getTime()/1000);
                   }
                   else if (field.equals("CURRENT_USER"))
                   {    
                       field1 = userid;
                   }
                   else  
                   {
                       field1 = (String)(saved.get(field)); 
                       if (field1==null && field.toLowerCase().equals("semester")) 
                           field1 = (String)(saved.get("Semester"));
                       else if(field1==null && !field.toLowerCase().replaceAll("[a-z]","").replaceAll("[0-9]","").equals(""))
                       {
                          field1="??" + field + "??";
                       }
                   } 
                   if (field1 == null) 
                    {
                        sg = '=';
                        if (i < N - 1 && s.charAt(i + 1) == '%') 
                        {
                            sg = '>';
                        }
                        if (sg == '>') 
                        {
                            int j;
                            if ((j = err.indexOf("=" + field + ",")) >= 0) 
                            {
                                err.replace(j, j + 1, ">");
                            } 
                            else if (err.indexOf(">" + field + ",") == -1) 
                            {
                                err.append("" + sg + field + ",");
                            }
                        } 
                        else if (err.indexOf("=" + field + ",") == -1 && err.indexOf(">" + field + ",") == -1) 
                        {
                            err.append("" + sg + field + ",");
                        }
                        ans.append("??" + field + "??");
                    } 
                    else 
                    {
                        if (singlequote) 
                        {
                            field1 = field1.replaceAll("'", "''");
                        } 
                        else if (!(field.equals("wcds") || sqlinject <= 0)) 
                        {
                            field1 = field1.replaceAll("[a-z|A-Z]", "");
                        }
                       
                        ans.append(field1);
                    }
                    field = "";
                }
                state = (state + 1) % 4;
                continue;
            }
            if (state == 1) 
            {
                state = 0;
                ans.append("?" + s.charAt(i));
            } else if (state == 0) {
                ans.append(s.charAt(i));
            } else if (state == 2) {
                field = field + s.charAt(i);
            } else if (state == 3) {
                ans.append("??" + field + "?" + s.charAt(i));
                field = "";
                state = 0;
            }
            if (sqlinject != 2) continue;
            if (s.charAt(i) == '\n') {
                if (!newlinecount) {
                    newlinecount = true;
                    continue;
                }
                sqlinject = 0;
                continue;
            }
            if (s.charAt(i) == '\r') continue;
            newlinecount = false;
        }
        if (state == 1) 
        {
            ans.append("?");
        } else if (state == 2) 
        {
            ans.append("??" + field);
        } else if (state == 3) 
        {
            ans.append("??" + field + "?");
        }
        
        return ans.toString();
    }

    public static String error() {
        return Generic.details;
    }
    
    public String getOptions(JDBCAdapter a, String s, int f, String ctype, int orgnum) 
    {
        String langcode = Toolbox.langs[Toolbox.langnum];
        if ((orgnum>>16) < Toolbox.langs.length)
            langcode = Toolbox.langs[orgnum>>16];
        boolean b = false;
        String tbl = "";
        if (s.length() >= 7 && s.substring(0, 7).toLowerCase().indexOf("select ") == 0) {
            
            if (s.toLowerCase().indexOf(" from domainvalue ")> 0)
            {
                s = s.replaceFirst("(?i) where ", " WHERE language='" +   langcode  + "' AND ");
            }
            else if (Toolbox.dbadmin[orgnum%65536].studentdriven)
            {
                int j  = s.toLowerCase().indexOf(" from ");
                if (j > 0)
                {
                    tbl = s.substring(j+6).trim().replaceFirst(" .*", "").replaceFirst(",.*","");
                   
                }
            }
            s = Webform.mysql2c(a.dbms, s);
        
            b = a.executeQuery2(s,true);
             
        }
        
        String str = "";
        String str1 = "";
        if (b==false) {
             
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
        for (int i = 0; a.getValueAt(i, 0)!=null; ++i) {
            String tmp = a.getValueAt(i, 0);
            if (i > 0) {
                str = str + ",";
                str1 = str1 + ",";
            }
            str = str + "\"" + DataAccess.handle((String)tmp.trim()) + "\"";
            String y = "";
            if (ctype.equals("s") || ctype.equals("S") || ctype.equals("r") || ctype.equals("R") || ctype.equals("w") || ctype.equals("W"))
                y =  str1 + "\"" + DataAccess.handle(tmp.trim()) + "\"";
            else 
                y = str1 + "''";
            if (a.getColumnCount() >= 2)
                str1 =  str1 + "\"" + DataAccess.handle(a.getValueAt(i, 1).trim()) + "\"";
            else
                str1 = y;
        }
        if (!tbl.equals("") )
        {
            if (!str.equals(""))str += ",";
            if (!str1.equals(""))str1 += ",";
            if (storedProc.get(tbl.toLowerCase())!=null)
            {
                str +=  "\"" + tbl.toLowerCase() + "\"";
                str1 += "\"...\"" ;
            }
            else
            {
                str +=  "\"00\"";
                str1 += "\"" + Toolbox.emsgs(orgnum,601) + "\"" ;
            }
        }
        return str + "];" + str1 + "];";
    }
    
}
