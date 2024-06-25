package telaman;

import java.io.PrintWriter;
import java.util.HashMap;
import javax.servlet.annotation.WebServlet;
import telaman.DataAccess;
import telaman.JDBCAdapter;
import telaman.User;
import telaman.Webform;
@WebServlet(name = "DataPrint", urlPatterns = {"/DataPrint"},   asyncSupported = false)
public class DataPrint extends DataAccess {
    
    public int processData(User user, Webform w, PrintWriter out, HashMap saved, JDBCAdapter adapter, String subdb,CachedStyle cachedstyle) {
        w.format = "Form";
        int orgnum = user.orgnum;
        out.println("<script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=\"text/javascript\"  src=" + Toolbox.getUserLang(orgnum) + "></script><script type=text/javascript  src=cookie.js></script>");
        int status = super.processData(user, w, out, saved, adapter, subdb, cachedstyle);
        
        if (status == 0) {
            return 0;
        }
        out.println("<script type=\"text/javascript\"  src=timeformat.js></script>");
        out.println("<script type=\"text/javascript\"  src=commonused.js></script>");
        out.println("<script type=\"text/javascript\"  src=multipleselect.js></script>");
        out.println("<script type=\"text/javascript\"  src=checkHTML.js></script>");
        out.println("<script type=\"text/javascript\"  src=helpformatf.js></script>");
        out.println("<script type=\"text/javascript\" >"
                + "datapresentformat = 'DataHTML';"
                + "var oldonload12=null;if (typeof window.onload == 'function')oldonload12=window.onload;"
                + "window.onload = function(){"
                + "if (oldonload12!=null)oldonload12();"
                + "eval(onbegin);"
                + "}</script>");
        return status;
    }
    public String getformat() {
        return "DataPrint";
    }

}
