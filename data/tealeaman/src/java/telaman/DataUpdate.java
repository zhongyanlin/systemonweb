/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import java.io.PrintWriter;
import java.util.HashMap;
import javax.servlet.annotation.WebServlet;
import telaman.Generic;
import telaman.JDBCAdapter;
import telaman.Save;
import telaman.User;
import telaman.Webform;
@WebServlet(name = "DataUpdate", urlPatterns = {"/DataUpdate"},   asyncSupported = false)
public class DataUpdate extends Generic 
{
    public int processData(User c, Webform w, PrintWriter out, HashMap saved, JDBCAdapter adapter, String subdb, CachedStyle cachedstyle) 
    {    
        String v = w.query;
        
        StringBuffer str = new StringBuffer();
        String ret = Save.process(c, adapter, v, null, w.postop, saved, str, cachedstyle);
        out.println(str.toString());
        String item = (String)saved.get("onsaved");
        if (!(ret.indexOf("opener.syn('0") >= 0 || item == null || item.equals(""))) 
        {
            out.print("<script  type=text/javascript>eval(\"" + Generic.handle1(item) + "\");</script>");
        }
        
        return 1;
    }
    public String getformat() {
        return "DataUpdate";
    }
}
