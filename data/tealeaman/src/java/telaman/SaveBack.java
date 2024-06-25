 
package telaman;

import java.io.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
 
@WebServlet(name = "SaveBack", urlPatterns = {"/SaveBack"},   asyncSupported = false)
public class SaveBack
extends HttpServlet {
    public static String closebutton = "<br><script  type=text/javascript>if (parent==null || parent.frames.length < 2)document.write('<center><input type=button style=background-color:#00BBBB;color:red;font-weight:700;width=70 value=Close onClick=window.close()></center>');</script>";
    private boolean isget = false;
    byte[][] cpart = new byte[][]{{0, 0, 0, 3, 1, 1, 1}, {0, 1, 1, 1, 0, 0, 3}, {2, 2, 0, 2, 2, 0, 2}};
    byte[][] cstate = new byte[][]{{1, 2, 3, 0, 1, 1, 1}, {4, 4, 4, 4, 5, 6, 0}, {0, 0, 2, 0, 0, 5, 0}};

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        try 
        {
            String rsaenccode;
            HashMap<String, String> saved;
            JDBCAdapter adapter;
            HttpSession session = request.getSession(true);
            int orgnum = Toolbox.setcharset(request, response);
            if (orgnum == -1) return;
            CachedStyle cachedstyle = new CachedStyle(request, orgnum);
            PrintWriter out = response.getWriter();
            if (!Toolbox.verifytoken(request)) 
            {
                out.println(Toolbox.emsgs(orgnum,1404));
                out.close();
                return;
            }
            Object current = session.getAttribute("User");
            User user = (User)current;
            if (!CaptchaServlet.passed(request))
            {
                String err = Toolbox.emsgs(orgnum,1464);
                response.addHeader("Content-Disposition", "inline;filename=saverror.html");
                out.println("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head><title>saveerror</title>" + Toolbox.getMeta(orgnum) +  "</head><body><script>parent.myprompt('" + err + "');parent.disablefuncbut(false);</script></body></html>") ;
                out.close();
                return;
            }
            
            if ((saved = (HashMap<String, String>)session.getAttribute("savedBackRequest")) == null) 
            {
                saved = new HashMap<String, String>();
            }
            Enumeration e = request.getParameterNames();
            while (e.hasMoreElements()) {
                String na = (String)e.nextElement();
                String va = request.getParameter(na);
                if (!Toolbox.encodings[orgnum>>16].equals("utf-8") && this.isget) {
                    na = Toolbox.c2c(na,orgnum);
                    va = Toolbox.c2c(va,orgnum);
                }
                if (saved.containsKey(na)) {
                    saved.remove(na);
                }
                va = request.getParameter(na);
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
                saved.put(na, va);
            }
            
            String rdap = (String)saved.get("rdap");
            if ((rsaenccode = (String)saved.get("rsacode")) == null) {
                rsaenccode = "0";
            }
            if (rsaenccode.equals("-1"))
            {
                String wcds = (String)saved.get("wcds");
                FileWriter aWriter = new FileWriter(user.webFileFolder +  File.separator +  "tempass.txt");
                aWriter.write(wcds);
                aWriter.close(); 
                out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body><script>parent.tempsaved();</script></body></html>");
                saved.clear();
                session.removeAttribute("savedBackRequest");
                out.close();
                return;
            }
           
            String err = null;
            if (rdap == null) 
            {
                err = Toolbox.emsgs(orgnum,105);
                response.addHeader("Content-Disposition", "inline;filename=saverror.html");
                out.println(err);
                out.close();
                saved.clear();
                session.removeAttribute("savedBackRequest");
                return;
            }
              
            String subdb = (String)saved.get("subdb");
            if (user == null) 
            {
                user = new User(orgnum);
                user.iid = subdb;
                user.roles = 0;
                if (subdb == null) {
                    subdb = "";
                }
                if (!subdb.equals("??CURRENT_USER??")) {
                    user.changedb(subdb);
                }
            } 
            else if (subdb != null) 
            {
                if (subdb.equals("??CURRENT_USER??")) {
                    subdb = user.id;
                }
                user.changedb(subdb);
            }
            else
            {
                user.changedb("");
            }
              
            if (orgnum!=user.orgnum)
            {
                err = "Incorrect orgnum";
                response.addHeader("Content-Disposition", "inline;filename=saverror.html");
                out.println(err);
                out.close();
                saved.clear();
                session.removeAttribute("savedBackRequest");
                return;
            }
              
            Webform w = null;
            if ((user.roles & 16) > 0 && (w = (Webform)session.getAttribute("TestWebform")) != null) {
                w = new Webform(w);
                session.removeAttribute("TestWebform");
                String[] x = new String[2];
                w.compile(w.updateQuery, x, false);
                w.updateQuery = x[1];
                w.compile(w.insertQuery, x, true);
                w.insertQuery = x[1];
                w.compile(w.deleteQuery, x, false);
                w.deleteQuery = x[1];
                w.help = null;
                w.webService = null;
                w.query = null;
                w.format = "Update";
            }
            if ((w = (Webform)Generic.storedProc.get(rdap + "$")) != null) 
            {
                 
                w = new Webform(w);
                  
            }
                 
            adapter = Toolbox.getUserAdapter(user, orgnum);
            
            if ((err = adapter.error()) != null && err.length() != 0) 
            {    
                if (adapter != null) 
                {
                    adapter.close();
                }
                response.addHeader("Content-Disposition", "inline;filename=saverror.html");
                out.println(err);
                session.removeAttribute("savedBackRequest");
                saved.clear();
                out.close();
                return;
            }
              
            if (w == null) 
            {
                boolean nn;
                if ((nn=adapter.executeQuery2("SELECT * FROM Task WHERE name='" + rdap + "'",false))==false || adapter.getValueAt(0,0)==null) {
                    err = "The routine named  '" + rdap + "' is   invalid";
                    if (nn == false) {
                        err = err + adapter.error();
                    }
                    response.addHeader("Content-Disposition", "inline;filename=saverror.html");
                    out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body>" + err + "</body></html>");
                    saved.clear();
                    session.removeAttribute("savedBackRequest");
                    adapter.close();
                    out.close();
                    return;
                }
                w = new Webform(adapter,0);
                w.parseQuery();
                if (!w.err.equals(""))
                {
                   w.valid = false;
                }
                String[] x = new String[2];
                if (w.valid) 
                {
                    if (w.permit(3, user)) 
                    {
                        w.compile(w.updateQuery, x, false);
                        w.updateQuery = x[1];
                    } 
                    else 
                    {
                        w.updateQuery = "";
                    }
                    if (w.permit(2, user)) 
                    {
                        w.compile(w.insertQuery, x, true);
                        w.insertQuery = x[1];
                    } 
                    else 
                    {
                        w.insertQuery = "";
                    }
                    if (w.permit(4, user)) 
                    {
                        w.compile(w.deleteQuery, x, false);
                        w.deleteQuery = x[1];
                    } 
                    else 
                    {
                        w.deleteQuery = "";
                    }
                    w.help = null;
                    w.webService = null;
                    w.query = null;
                    w.format = "Update";
                }
            }
             
            String passedstr = (String)saved.get("wcds");
           
            if ( rsaenccode.equals("2") || rsaenccode.equals("3")) 
                passedstr = Toolbox.decrypt(passedstr,orgnum);
        
            PassedData pd =new PassedData(passedstr);
            Vector<String> comp = new Vector<String>();
            String model = null;
            char c = '\u0000';
            StringBuffer ans = new StringBuffer(200);
            if (pd != null) {
                while ((c = pd.getChar()) != '\u0000') {
                    if (c == 'i') {
                        model = w.insertQuery;
                    } else if (c == 'u') {
                        model = w.updateQuery;
                    } else {
                        if (c != 'd') break;
                        model = w.deleteQuery;
                    }
                    ans.setLength(0);
                    this.subs(model, pd, user.id, ans,c);
                 
                    if (pd.alert) {
                        out.println("500 Internal server error");
                        session.removeAttribute("User");
                        Toolbox.hacker(session.getId(), request.getRemoteAddr(), user.id);
                        out.close();
                        adapter.close();
                        return;
                    }
                    
                    if ((c == 'i' && w.permit(2, user)) || (c == 'u' && w.permit(3, user)) || (c == 'd' && w.permit(4, user))) 
                    {
                        comp.addElement(ans.toString());
                    }
                }
            }
         
            if (comp.size() == 0) 
            {
                if (user.id.equals("")) 
                {
                    adapter.close();
                    session.setAttribute("savedBackRequest", saved);
                    RequestDispatcher dispat = this.getServletConfig().getServletContext().getRequestDispatcher("/login.jsp?error=generic&follow=" + (new Encode6b(orgnum)).to6b("parent.resubmitform()") );
                    dispat.forward((ServletRequest)request, (ServletResponse)response);
                    return;
                }
                if (pd == null) 
                {
                    response.addHeader("Content-Disposition", "inline;filename=saverror.html");
                    out.print("Invalid data:" + saved.get("wcds"));
                    saved.clear();
                    session.removeAttribute("savedBackRequest");
                    adapter.close();
                    out.close();
                    return;
                }
                response.addHeader("Content-Disposition", "inline;filename=saverror.html");
                err = "Not Authorized. This procedure is designed for " + new Systemroles(w.roles).toString() + "<br>";
                out.print(err);
                saved.clear();
                session.removeAttribute("savedBackRequest");
                adapter.close();
                out.close();
                return;
            }
            StringBuffer str = new StringBuffer();
            saved.put("&", request.getRequestURL().toString());
           
            String savingfile = Save.process(user, adapter, null, comp, w.postop, saved, str,cachedstyle);
            response.addHeader("Content-Disposition", savingfile);
            out.print(str.toString());
            session.removeAttribute("savedBackRequest");
            saved.clear();
            adapter.close();
            out.close();
        }
        catch (ServletException e) {
            Toolbox.println(0, e.toString());
        }
    }
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        this.isget = true;
        this.processRequest(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        this.isget = false;
        this.processRequest(request, response);
    }

    public static String height(int i) 
    {
        return "<script  type=text/javascript> theight = " + i + ";</script>";
    }

    byte cmapi(char c) {
        switch (c) {
            case '?': {
                return 0;
            }
            case '$': {
                return 1;
            }
        }
        return 2;
    }

    void subs(String s, PassedData pd, String userid, StringBuffer ans,int c) 
    {
      
        boolean sq = false;
        if (s == null) {
            return;
        }
        int state = 0;
        int NN = s.length();
        String field = "";
        String field1 = null;
        boolean meetset = false;
        for (int i = 0; i < NN; ++i) {
            byte k = this.cmapi(s.charAt(i));
            switch (this.cpart[k][state]) {
                case 3: {
                    field = field.substring(2, field.length() - 1);
                    if (s.charAt(i) == '?') 
                    {
                        field1 = field.equals("") ? "????" : (field.equals("CURRENT_TIME") ? "" + (System.currentTimeMillis() / 1000) : (field.equals("CURRENT_USER") ? userid : pd.getElement()));
                        if (field1 == null) {
                            if (ans.charAt(ans.length() - 1) == '\'') {
                                ans.deleteCharAt(ans.length() - 1);
                                ans.append("NULL");
                                ++i;
                            } else {
                                ans.append("NULL");
                            }
                        } else {
                            ans.append(field1);
                        }
                    } 
                    else 
                    {
                        field1 = field.equals("") ? "$$$$" : pd.getElement();
     
                        if (field1 == null)
                        {  
                            if (c == 'u')    
                           {
                            if (ans.charAt(ans.length() - 1) == '\'') 
                            {
                                ans.deleteCharAt(ans.length() - 1);
                                ++i;
                            }
                            int j = ans.length() - 1;
                            
                            while (ans.charAt(j) == ' ') {
                                --j;
                            }
                         
                            if (ans.charAt(j) == '=') {
                                --j;
                            }
                          
                            while (ans.charAt(j) == ' ') {
                                --j;
                            }
                              
                            while (ans.charAt(j) != ' ' && ans.charAt(j) != ',' && ans.charAt(j) != '\n') {
                                --j;
                            }
                        
                            while (ans.charAt(j) == ' ' || ans.charAt(j) == ',' || ans.charAt(j) == '\n') {
                                --j;
                            }
                              
                            ans.setLength(j + 1);
                               
                            if (ans.charAt(j) == 't' || ans.charAt(j) == 'T') 
                            {
                                int jj;
                                for (jj = i + 1; jj < NN && s.charAt(jj) == ' '; ++jj) 
                                {
                                }
                                if (jj == NN || s.charAt(jj) == ',') 
                                {
                                    i = jj;
                                }
                                ans.append(" ");
                            }
                           }
                           else
                            {
                               if (ans.charAt(ans.length() - 1) == '\'') 
                               {
                                ans.deleteCharAt(ans.length() - 1);
                                ans.append("NULL");
                                ++i;
                               }
                               else
                                  ans.append("NULL"); 
                            }
                        } else {
                            ans.append(field1);
                        }
                    }
                    field = "";
                    break;
                }
                case 2: {
                    ans.append(field + s.charAt(i));
                    field = "";
                    break;
                }
                case 1: {
                    ans.append(field);
                    field = "" + s.charAt(i);
                    break;
                }
                case 0: {
                    field = field + s.charAt(i);
                }
            }
            state = this.cstate[k][state];
        }
        ans.append(field);
    }

    public static void main(String[] args) {
        String x = "'dd''ss',1,3";
        PassedData pd = new PassedData(x);
        String t = pd.getElement();
        Toolbox.println(0, t);
        t = pd.getElement();
        Toolbox.println(0, t);
    }
}
