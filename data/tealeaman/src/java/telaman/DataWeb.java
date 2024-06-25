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
@WebServlet(name = "DataWeb", urlPatterns = {"/DataWeb"},   asyncSupported = false)
public class DataWeb
extends Generic {
    

    void modifysaved(HashMap saved, Webform w, User user) {
        String which;
        if (w.permits == null) {
            w.permits = "";
        }
        if ((which = (String)saved.get("which")) != null) 
        {
            w.permits = w.permits.replaceAll("1\\+[^,]+,", "");
        }
        if (which != null && which.equals("insert")) 
        {
            w.query = w.insertQuery;
            w.permits = w.permits.replaceAll("2\\+", "1+");
            w.roles = w.insertroles;
        } 
        else if (which != null && which.equals("update")) 
        {
            w.query = w.updateQuery;
            w.permits = w.permits.replaceAll("3\\+", "1+");
            w.roles = w.updateroles;
        } 
        else if (which != null && which.equals("delete")) 
        {
            w.query = w.deleteQuery;
            w.roles = w.deleteroles;
            w.permits = w.permits.replaceAll("4\\+", "1+");
        }
        w.deleteQuery = "";
        w.updateQuery = "";
        w.insertQuery = "";
        if (!w.permit(1, user)) 
        {
            String tid = null;
            if ((tid = w.idpermit(1)) != null) 
            {
                String tt = "t";
                if (w.fields != null) 
                {
                    tt = w.fields[Integer.parseInt(tid)].substring(0, 1);
                }
                w.query = w.query.replaceFirst(" WHERE ", " WHERE " + tt + tid + "='" + user.id + "' AND ");
                w.permits = w.permits.replaceFirst("1\\+#[0-9]+", "1+" + user.id);
            }
        }
         
    }

    public int processData(User c, Webform w, PrintWriter out, HashMap saved, JDBCAdapter adapter, String subdb, CachedStyle cachedstyle) 
    {
         
        String v = w.query;
      
        StringBuffer str = new StringBuffer();
        String ret = Save.process(c, adapter, v, null, w.postop, saved, str, cachedstyle);
        out.print(str.toString());
        return 1;
    }
    public String getformat() {
        return "DataWeb";
    }
}
