 
package telaman;

import java.io.PrintWriter;
import java.util.HashMap;
import javax.servlet.annotation.WebServlet;
import telaman.DataAccess;
import telaman.JDBCAdapter;
import telaman.User;
import telaman.Webform;
@WebServlet(name = "DataForm", urlPatterns = {"/DataForm"},   asyncSupported = false)
public class DataForm extends DataAccess {
    
    public int processData(User user, Webform w, PrintWriter out, HashMap saved, JDBCAdapter adapter, String subdb,CachedStyle cachedstyle) {
        w.format = "Form";
        int orgnum = user.orgnum;
        out.println("<script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=\"text/javascript\"  src=" + Toolbox.getUserLang(orgnum) + "></script><script type=text/javascript  src=cookie.js></script>");
        int status = super.processData(user, w, out, saved, adapter, subdb,cachedstyle);
        if (status == 0) {
            return 0;
        }
        out.println("<script type=\"text/javascript\"  src=timeformat.js></script>");
        out.println("<script type=\"text/javascript\"  src=commonused.js></script>");
        out.println("<script type=\"text/javascript\"  src=multipleselect.js></script>");
        
        out.println("<script type=\"text/javascript\"  src=checkHTML.js></script>");
        String ms = (String)saved.get("makescript");
        if (ms == null) {
            out.println("<script type=\"text/javascript\"  src=makeform.js></script>");
        } else {
            out.println("<script type=\"text/javascript\"  src=" + ms + ".js></script>");
        }
        out.println("<script type=\"text/javascript\"  src=helpformatf.js></script>");
        out.println("<script type=\"text/javascript\"  src=makeformdu.js></script>");
        if (ms==null || ms.equals("grading") == false)
        {
            out.println("<script type=\"text/javascript\" src=\"installtool.js\"></script>");
        }
        out.println("<script type=\"text/javascript\"  src=hints.js></script>");
        return status;
    }
    public String getformat() {
        return "DataForm";
    }

}
