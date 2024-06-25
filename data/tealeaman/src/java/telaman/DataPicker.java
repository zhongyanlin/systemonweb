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
@WebServlet(name = "DataPicker", urlPatterns = {"/DataPicker"},   asyncSupported = false)
public class DataPicker
extends DataAccess {
    public String getformat() {
        return "DataPicker";
    }

    public int processData(User user, Webform w, PrintWriter out, HashMap saved, JDBCAdapter adapter, String subdb,CachedStyle cachedstyle) {
         int orgnum = user.orgnum;
        out.print("<script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=text/javascript  src=" + Toolbox.getUserLang(orgnum) + " ></script><script type=text/javascript  src=cookie.js></script>");
        int status = super.processData(user, w, out, saved, adapter, subdb, cachedstyle);
        if (status == 0) {
            return 0;
        }
        out.println("<script type=text/javascript>if (typeof(orgnum)=='undefined')var orgnum=" + user.orgnum+ ";");
        String item = (String)saved.get("existing");
        if (item != null) {
            out.println("var existing=\"" + item + "\";");
        } else {
            out.println("var existing=\"\";");
        }
        out.println("</script>");
        out.println("<script type=text/javascript  src=multipleselect.js></script>");
        out.println("<script type=text/javascript  src=timeformat.js></script>");
        out.println("<script type=text/javascript  src=commonused.js></script>");
        out.println("<script type=text/javascript  src=makepicker.js></script>");
        out.println("<script type=text/javascript  src=helpformat.js></script>");
        out.println("<script type=text/javascript  src=maketabledu.js></script>");
        out.println("<script type=text/javascript  src=hints.js></script>");
        return status;
    }
}
