 
package telaman;

import java.io.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
 
@WebServlet(name = "Form", urlPatterns = {"/Form"},   asyncSupported = false)
public class Form extends HttpServlet {
    
    

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String formname;
        String act;
        String o;
        String subdb;
        String cdrdap;
        String ifvr;
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum < 0) return;
        if (!Toolbox.verifytoken(request)) {
            PrintWriter out = response.getWriter();
            out.println(Toolbox.emsgs(orgnum,1404));
            out.close();
            return;
        }
        
        if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        String zpcrpt = Toolbox.defaultParam(orgnum,request, ("zpcrpt"), null);
    
        
        if (zpcrpt == null) 
        {
            formname = Toolbox.defaultParam(orgnum,request, "rdap", "", null, 30);
            cdrdap = (cdrdap = Toolbox.defaultParam(orgnum,request, "cdrdap", null, null, 3)) == null ? "" : "&cdrdap=1";
            act = Toolbox.defaultParam(orgnum,request, "orgnum", "", null, 20);
            try{ orgnum = Integer.parseInt(act); }catch(Exception e){}
            act = Toolbox.defaultParam(orgnum,request, "ac", "", null, 20);
            subdb = Toolbox.defaultParam(orgnum,request, "subdb", "", null, 30);
            o = Toolbox.defaultParam(orgnum,request, ("df"), null);
            ifvr = Toolbox.defaultParam(orgnum,request, "ifvr", ""+(orgnum>>16), null, 20);
        } 
        else 
        {
            HashMap<String,String> saved = new HashMap<>();
            Toolbox.unpack(saved, zpcrpt);
            formname = (String)saved.get("rdap");
            if (formname == null) {
                formname = "";
            }
            cdrdap = (cdrdap = (String)saved.get("cdrdap")) == null ? "" : "&cdrdap=1";
            if ((act = (String)saved.get("ac")) == null) {
                act = "";
            }
            try{ orgnum = Integer.parseInt(saved.get("orgnum")); }catch(Exception e){}
            if ((subdb = (String)saved.get("subdb")) == null) {
                subdb = "";
            }
            if ((ifvr = (String)saved.get("ifvr")) == null) {
                ifvr = "";
            }
            if (!ifvr.equals("")) {
                ifvr = "_" + ifvr;
            }
            o = (String)saved.get("df");
        }
        formname = Toolbox.validate(formname, null, 40);
        act = Toolbox.validate(act, null, 10);
        subdb = Toolbox.validate(subdb, null, 30);
        ifvr = Toolbox.validate(ifvr, null, 20);
        o = Toolbox.validate(o, null, 10);
        File f = this.path(formname + ifvr, orgnum);
        if (f.exists() == false)
        {
            f = this.path(formname, orgnum);
        }
        if (o == null && f.exists()) {
            String permits;
            User user;
            String sql;
            int n;
            if (act.matches("u[0-9]+") || act.matches("r[0-9]+")) 
            {
                RequestDispatcher requestdispatcher1 = this.getServletConfig().getServletContext().getRequestDispatcher("/DataManager?rdap=" + formname + "&orgnum=" + orgnum + "&ac=" + act + (subdb.equals("") ? "" : "&subdb=") + subdb + cdrdap);
                requestdispatcher1.forward((ServletRequest)request, (ServletResponse)response);
                return;
            }
            if ((user = (User)session.getAttribute("User")) == null) {
                user = new User(orgnum);
            }
            else if (user.orgnum!=orgnum && orgnum!=-1)
            {
                return;
            }
            orgnum=user.orgnum;
            JDBCAdapter adapter = null;
            if (subdb.equals("")) {
                adapter = Toolbox.getSysAdapter(orgnum);
            } else {
                user.changedb(subdb);
                adapter = Toolbox.getUserAdapter(user, orgnum);
             
                if (!(adapter != null && adapter.error().equals(""))) {
                    PrintWriter out = response.getWriter();
                    adapter.close();
                    out.println("Database not available");
                    out.close();
                    return;
                }
            }
            if (( adapter.executeQuery2(sql = "SELECT roles, permits FROM UserForm WHERE formname='" + formname.replaceAll("'", "''") + "'",false))==false || adapter.getValueAt(0,0)==null) {
                PrintWriter out = response.getWriter();
                if (formname.equals("")) {
                    out.println("Usage: Form?rdap=formname&ac=[,s,r,u,d,v,m]&subdb=?&cdrdap=[,1]");
                } else {
                    out.println(formname + " " + Toolbox.emsgs(orgnum,1531));
                }
                adapter.close();
                out.close();
                return;
            }
            long roles = Integer.parseInt(adapter.getParameter(0));
            if (!(roles == -1 || this.permit(roles, user, permits = adapter.getParameter(1)))) {
                adapter.close();
                RequestDispatcher requestdispatcher1 = this.getServletConfig().getServletContext().getRequestDispatcher("/unauthorize.jsp");
                requestdispatcher1.forward((ServletRequest)request, (ServletResponse)response);
                return;
            }
            adapter.close();
            ServletOutputStream stream = null;
            FileInputStream input = null;
            String url = request.getRequestURL().toString();
            url = url.indexOf("localhost") >= 0 ? "databind.js" : url.replaceFirst("/Form.*", "/databind.js");
            String securitytoken = Toolbox.gentoken("Form", "f1");
            String xx = "<script type=\"text/javascript\">var orgnum=" + orgnum + ", securitytoken='" + securitytoken + "';</script>\n<script type=\"text/javascript\" src=" + url + "></script>\n<script type=\"text/javascript\" src=" + url.replaceFirst("databind.js", "installtool.js") + "></script></html>";
            int xxl = xx.getBytes().length;
            PrintWriter out = null; 
            Scanner s = new Scanner(f);
            try {   
                int[] hasmath = new int[1];
                String aline = s.useDelimiter("\\Z").next();
                aline = DataManager.addMath(aline, hasmath);
                if (hasmath[0] == 1) 
                {
                    xx = xx.replaceFirst("<.html>$", "\n<script type=text/javascript  src=curve.js?dn=1&sn=25></script>\n</html>");
                }
                aline = DataManager.replace(aline, orgnum) + xx;  
                int ll = aline.length();
                response.setContentType("text/HTML");
                response.addHeader("Content-Disposition", "inline;filename=" + formname + ".htm");
                out = response.getWriter();
                out.print(aline);
             
            }
            catch(IOException e){ }
         
            finally 
            {
                if (out != null) 
                {
                    out.close();
                }
                if (s != null) 
                {
                    s.close();
                }
            }
            return;
            
               /*
            try {
                response.setContentType("text/HTML");
                response.addHeader("Content-Disposition", "inline;filename=" + formname + ".htm");
                stream = response.getOutputStream();
                response.setContentLength((int)(f.length() + (long)xxl));
                input = new FileInputStream(f);
                BufferedInputStream buf = new BufferedInputStream(input);
                int readBytes = 0;
                int i = 0;
                int N = (int)f.length();
                for (i = 0; i < N; ++i) {
                    readBytes = buf.read();
                    stream.write(readBytes);
                }
                stream.println(xx);
            }
            finally {
                if (stream != null) {
                    stream.close();
                }
                if (input != null) {
                    input.close();
                }
            }
             */
        }
         
        String url = "";
        if (act.equals("")) 
        {
            url = "/DataForm?orgnum=" + orgnum + "&rdap=" + formname + "i" + (subdb.equals("") ? "" : "&subdb=") + subdb + cdrdap;
        } 
        else if (act.matches("u[0-9]+") || act.matches("d[0-9]+")) 
        {
            session.setAttribute("wcds",  ("WHERE n=" + act.substring(1)));
            url = "/DataForm?orgnum=" + orgnum + "&rdap=" + formname + "r" + (subdb.equals("") ? "" : "&subdb=") + subdb + cdrdap;
        } else if (act.equals("r")) {
            url = "/DataFormHTML?orgnum=" + orgnum + "&rdap=" + formname + "r" + (subdb.equals("") ? "" : "&subdb=") + subdb + cdrdap;
        } else if (act.equals("rd")) {
            url = "/DataHTML?orgnum=" + orgnum + "&rdap=" + formname + "r" + (subdb.equals("") ? "" : "&subdb=") + subdb + cdrdap;
        } else if (act.equals("rc")) {
            url = "/DataCSV?orgnum=" + orgnum + "&rdap=" + formname + "r" + (subdb.equals("") ? "" : "&subdb=") + subdb + cdrdap;
        } else if (act.matches("r[0-9]+")) {
            url = "/DataFormHTML?orgnum=" + orgnum + "&rdap=" + formname + "r&wcds=" + Toolbox.urlencode(new StringBuilder().append("WHERE n=").append(act.substring(1)).toString()) + (subdb.equals("") ? "" : "&subdb=") + subdb + cdrdap;
        } else if (act.matches("s")) {
            url = "/DataSearch?orgnum=" + orgnum + "&rdap=" + formname + "s" + (subdb.equals("") ? "" : "&subdb=") + subdb + cdrdap;
        } else {
            //PrintWriter out = response.getWriter();
            //out.println("Usage: Form?rdap=formname&ac=[,s,r,u,d]&subdb=?&cdrdap=[,1]");
            return;
        }
     
        RequestDispatcher requestdispatcher1 = this.getServletConfig().getServletContext().getRequestDispatcher(url);
        requestdispatcher1.forward((ServletRequest)request, (ServletResponse)response);
    }
    
    public static String[] userforms(JDBCAdapter adapter, User user) {
        String[] usertables = null;
        if ((user.roles & 8) != 0) return adapter.tableList();
        int numTables = 0;
        boolean bn = adapter.executeQuery2("SELECT formname FROM UserForm WHERE uid='" + user.id + "'",false);
        if (bn==false) return null;
        ArrayList<String> a = new ArrayList();
        for (int i = 0;  adapter.getValueAt(i, 0)!=null; ++i) {
            a.add( adapter.getValueAt(i, 0));
            numTables++;
        }
        usertables =  new String[numTables];
        for (int i = 0; i < numTables; ++i) {
            usertables[i] = a.get(i);
        }
        return usertables;
    }

    File path(String filename, int orgnum) {
        return new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator +   "forms" + File.separator + filename + ".htm");
    }

    boolean permit(long which, User user, String permits) {
        return (which & user.roles) > 0 && ("," + permits + ",").indexOf(",-" + user.id + ",") < 0 || ("," + permits + ",").indexOf(",+" + user.id + ",") >= 0;
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest(request, response);
    }
}
