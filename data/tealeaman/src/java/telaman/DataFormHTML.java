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
@WebServlet(name = "DataFormHTML", urlPatterns = {"/DataFormHTML"},   asyncSupported = false)
public class DataFormHTML
extends DataAccess {
    
    public int processData(User user, Webform w, PrintWriter out, HashMap saved, JDBCAdapter adapter, String subdb,CachedStyle cachedstyle) {
        out.print("<link rel=\"stylesheet\" href=\"display-mathml.css?r=stable\" />");
        out.print("<script src=\"display-mathml.js?r=stable\"></script>");
        int orgnum = user.orgnum;
        out.print("<script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=text/javascript  src=" + Toolbox.getUserLang(orgnum) + " ></script><script type=text/javascript  src=cookie.js></script>");
        int status = super.processData(user, w, out, saved, adapter, subdb, cachedstyle);
        if (status == 0) {
            return 0;
        }
        out.print("\n<script type=text/javascript  src=checkHTML.js></script>\n");
        out.print("<script type=text/javascript  src=totext.js></script>\n");
        out.print("<script type=text/javascript  src=multipleselect.js></script>\n");
        out.print("<script type=text/javascript  src=commonused.js></script>\n");
        out.print("<script type=text/javascript  src=timeformat.js></script>\n"); 
        
        out.print("<script type=text/javascript  src=helpformatf.js></script>\n");
        out.print("\n<script type=text/javascript  src=assessform.js></script>\n");
        out.print("\n<script type=text/javascript  src=makeformhtml.js></script>\n");
        out.println("<script type=text/javascript  src=hints.js></script>");
        return status;
    }
    public String getformat() {
        return "DataFormHTML";
    }

}
