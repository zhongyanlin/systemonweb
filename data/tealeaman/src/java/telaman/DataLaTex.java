/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import java.io.PrintWriter;
import java.util.HashMap;
import javax.servlet.annotation.WebServlet;
import telaman.DataAccess;
import telaman.JDBCAdapter;
import telaman.User;
import telaman.Webform;
@WebServlet(name = "DataLaTex", urlPatterns = {"/DataLaTex"},   asyncSupported = false)
public class DataLaTex
extends DataAccess {
    
    public int processData(User user, Webform w, PrintWriter out, HashMap saved, JDBCAdapter adapter, String subdb,CachedStyle cachedstyle) {
         int orgnum = user.orgnum;
        out.print("<script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=text/javascript  src=" + Toolbox.getUserLang(orgnum) + " ></script><script type=text/javascript  src=cookie.js></script>");
        int status = super.processData(user, w, out, saved, adapter, subdb, cachedstyle);
        if (status == 0) {
            return 0;
        }
        out.print("<script type=text/javascript  src=timeformat.js></script>");
        out.print("<script type=text/javascript  src=totext.js></script>");
        out.println("<script type=text/javascript  src=makelatex.js></script>");
        return status;
    }
    public String getformat() {
        return "DataLaTex";
    }

}
