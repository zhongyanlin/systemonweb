/*
 * Decompiled with CFR 0_87.
 * 
 * Could not load the following classes:
 *  javax.servlet.ServletConfig
 *  javax.servlet.ServletContext
 *  javax.servlet.ServletException
 *  javax.servlet.http.HttpServlet
 *  javax.servlet.http.HttpServletRequest
 *  javax.servlet.http.HttpServletResponse
 *  javax.servlet.http.HttpSession
 */
package telaman;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import telaman.Generic;
import telaman.Systemroles;
import telaman.Toolbox;
import telaman.User;
import telaman.Webform;

@WebServlet(name = "DataSearch", urlPatterns = {"/DataSearch"},   asyncSupported = false)
public class DataSearch extends HttpServlet {
    

    protected void processRequest1(HttpServletRequest request, HttpServletResponse response, boolean isget) throws ServletException, IOException {
        HashMap<String,String> saved;
        String onbegin;
        String rdap;
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum == -1) return;
        CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        
        PrintWriter out = response.getWriter();
        User user = User.authorize(orgnum, Systemroles.TOTAL, this.getServletConfig().getServletContext(), session, request, response, "DataSearch", true);
        if (user == null) {
            return;
        }
        
        Webform w = null;
        session.removeAttribute("savedDBRequest");
        saved = Generic.saveParameters(session, request, isget);
       
        rdap = (String)(saved.get("rdap"));
         
        if (rdap == null) 
        {
            String err = "$" + Toolbox.emsgs(orgnum,105) + saved.toString();
            out.println(err);
            out.close();
            saved.clear();
            return;
        }
       
        w = (Webform)Generic.storedProc.get(rdap);
        String rdapstr = rdap;
        if (rdap.length() > 20) {
            rdapstr = rdap.substring(0, 20);
        }
        long ll = System.currentTimeMillis() % 10000000;
        String left = "l" + ll;
        String right = "r" + ll;
        if ((onbegin = (String)saved.get("onbegin")) == null) {
            saved.put("onbegin", "parent.document.title=title;");
        } else {
            saved.remove("onbegin");
            saved.put("onbegin", "parent.document.title=title;" + onbegin);
        }
        String title = (String)saved.get("titlebar");
        if (title == null) {
            title = Toolbox.emsgs(orgnum,515);
        }
        String dim = (String)saved.get("dim");
        int width = 800;
        int height = 600;
        try {
            if (dim == null || dim.length() < 3) {
                dim = "800600";
            }
            width = Integer.parseInt(dim.substring(0, 3));
            height = Integer.parseInt(dim.substring(3));
        }
        catch (Exception e) {
            // empty catch block
        }
        
        session.setAttribute("savedDBRequest", (Object)saved);
      
        out.println("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "<title>" + title + "</title><script  type=text/javascript>" + "</script></head>");
        out.println("<frameset cols=\"228,*\" border=0px>\n<frame name=" + left + " scrolling=\"no\"   src=\"DataSelect\"   />");
        out.println("<frame name=" + right + " scrolling=\"auto\"  src=\"searchHint.jsp\"  />\n</frameset></html>");
        out.flush();
        out.close();
    }
/*
    public static String subs1(Webform w, HashMap saved) {
        String s = w.query;
        s = s.replaceFirst("^[ ]+", "");
        boolean go = false;
        boolean halt = false;
        if (s == null) {
            return null;
        }
        int state = 0;
        boolean sq = false;
        int i = 0;
        int j = -1;
        int N = s.length();
        String num = "";
        int numCols = w.fields.length;
        StringBuffer ans = new StringBuffer();
        boolean kk = false;
        boolean inquo = false;
        block20 : for (i = 0; i < N; ++i) {
            if (s.charAt(i) == '@') {
                switch (state) {
                    case 1: {
                        try {
                            j = Integer.parseInt(num);
                        }
                        catch (Exception e) {
                            j = -1;
                        }
                        String sendvalue = "";
                        if (j < 0) {
                            ans.append("@" + num + '@');
                            state = 0;
                            num = "";
                            break;
                        }
                        sendvalue = (String)saved.get(w.fields[j]);
                        if (sendvalue == null) {
                            sendvalue = "";
                        }
                        if (sendvalue.equals("") && (w.ctypes[j].equals("c") || w.ctypes[j].equals("s"))) {
                            int k;
                            for (k = ans.length() - 3; !(k <= 0 || ans.substring(k, k + 3).equals("(((")); --k) {
                            }
                            ans.setLength(k);
                            ans.append(" 1=1 ");
                            while (!(i + 4 >= s.length() || s.substring(i + 1, i + 4).equals(")))"))) {
                                ++i;
                            }
                            i+=4;
                        } else if (!sendvalue.equals("")) {
                            ans.append(sendvalue.replaceAll("'", "''"));
                        } else {
                            ans.append(sendvalue);
                        }
                        num = "";
                        state = 0;
                        break;
                    }
                    case 0: {
                        state = 1;
                        num = "";
                    }
                }
                continue;
            }
            switch (state) {
                case 0: {
                    ans.append(s.charAt(i));
                    continue block20;
                }
                case 1: {
                    num = num + s.charAt(i);
                }
            }
        }
        s = ans.toString();
        String word = "";
        String ans1 = "";
        N = s.length();
        state = 0;
        block23 : for (i = 0; i < N; ++i) {
            if (s.charAt(i) == '\'') {
                switch (state) {
                    case 0: {
                        word = word.replaceAll("[A-Z|a-z|0-9|\\.|_]+[ ]*[>|<]*=[ ]*[a|A][n|N][d|D][\\s]", "1=1 AND ");
                        word = word.replaceAll("[A-Z|a-z|0-9|\\.|_]+[ ]*[>|<]*=[ ]*[o|O][r|R][\\s]", "1=1 OR ");
                        word = word.replaceAll("[A-Z|a-z|0-9|\\.|_]+[ ]*[>|<]*=[ ]*[)]", "1=1 )");
                        ans1 = ans1 + word.replaceAll("1=1[ |\n|\r]+[a|A][n|N][d|D]", "") + "'";
                        state = 1;
                        word = "";
                        break;
                    }
                    case 21: {
                        ans1 = ans1 + "'";
                        state = 1;
                        break;
                    }
                    case 1: {
                        ans1 = ans1 + "'";
                        ans1 = ans1.toString().replaceAll("[A-Z|a-z|0-9|\\.|_]+[ ]*[L|l][I|i][K|k][E|e][ ]*'%%'$", " 1=1 ");
                        ans1 = ans1.toString().replaceAll("[A-Z|a-z|0-9|\\.|_]+[ ]*[L|l][I|i][K|k][E|e][ ]*'%'$", " 1=1 ");
                        state = 21;
                    }
                }
                continue;
            }
            switch (state) {
                case 0: {
                    word = word + s.charAt(i);
                    continue block23;
                }
                case 1: {
                    ans1 = ans1 + s.charAt(i);
                    continue block23;
                }
                case 21: {
                    ans1 = ans1 + s.charAt(i);
                    state = 0;
                }
            }
        }
        if (state == 0) {
            ans1 = ans1 + word;
        }
        if ((ans1 = ans1.replaceAll("1=1[ ]+[a|A][n|N][d|D]", "")).replaceAll("[ ]*1=1[ ]*", "").equals("")) {
            ans1 = "";
        }
        return ans1.replaceAll(Webform.separator, "");
    }
 */   
    public String getformat() 
    {
        return "DataSearch";
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest1(request, response, true);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest1(request, response, false);
    }
}
