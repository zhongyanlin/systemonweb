 
package telaman;

import java.io.PrintWriter;
import java.util.HashMap;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import telaman.DBConnectInfo;
import telaman.Generic;
import telaman.JDBCAdapter;
import telaman.Toolbox;
import telaman.User;
import telaman.Webform;
@WebServlet(name = "DataCSV", urlPatterns = {"/DataCSV"},   asyncSupported = false)
public class DataCSV
extends Generic {
    
    public void processCSV(User user, Webform w, HttpServletResponse response, JDBCAdapter adapter, HttpServletRequest request) {
        int numRows;
        String err;
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum==-1) return;
        String needdoublequotes = Toolbox.defaultParam(orgnum, request, "quotes", "", null,1);
        String encoding = Toolbox.encodings[orgnum>>16];
        if (w.query == null || w.query.length() < 5) {
            response.setContentType("text/html;charset=" +  encoding );
            try {
                PrintWriter out = response.getWriter();
                out.println(Toolbox.emsgs(user.orgnum,88));
                out.close();
            }
            catch (Exception e1) {
                // empty catch block
            }
            return;
        }
        w.query = w.query.trim();
        String[] querys = w.query.split("\n[\r]*\n+");
        for (int ll = 0; ll < querys.length; ++ll) {
            querys[ll] = querys[ll].trim();
        }
        int numquery = querys.length;
        adapter = Toolbox.getUserAdapter(user,orgnum);
        err = adapter.error();
        if ( err != null && err.length() != 0) {
            adapter.close();
             
            try {
                PrintWriter out = response.getWriter();
                out.println(err + DataCSV.height((int)err.length()));
                out.close();
            }
            catch (Exception e1) {
                // empty catch block
            }
            return;
        }
        adapter.needMetaInfo = true;
        
        boolean b = adapter.executeQuery2(querys[0],true);
        if (b==false || adapter.getValueAt(0,0)==null) 
        {
            err = adapter.error();
            response.setContentType("text/html;charset=" +  encoding);
            try {
                PrintWriter out = response.getWriter();
                out.println(err + DataCSV.height((int)err.length()));
                out.close();
            }
            catch (Exception e1) {
                // empty catch block
            }
            return;
        }
        try {
            response.setContentType("application/x-download");
            response.setHeader("Content-Disposition", "attachment;filename=" + w.name + ".csv");
            ServletOutputStream biout = response.getOutputStream();
            StringBuffer headline = new StringBuffer();
            int C = adapter.getColumnCount();
            for (int j = 0; j < C; ++j) 
            {
                headline.append(adapter.columnNames[j].replaceFirst("_.*", ""));
                if (j < C - 1) 
                {
                    headline.append(",");
                }
                
            }
            if (b && adapter.getValueAt(0,0)!=null) 
                headline.append("\n");
            biout.write(headline.toString().getBytes());
            for (int i = 0;  adapter.getValueAt(i, 0)!=null; ++i) 
            {
                headline.setLength(0);
                if (i>0)headline.append("\n");
                for (int j2 = 0; j2 < C; ++j2) 
                {
                    String x = adapter.getValueAt(i, j2);
                    
                    if (x == null) {
                        x = "";
                    } 
                    if (needdoublequotes.equals("1") || x.indexOf(",") >= 0 || x.indexOf("\n") >= 0 || x.indexOf("\"") >= 0) {
                        headline.append("\"");
                        headline.append(x.replaceAll("\"", "\"\""));
                        headline.append("\"");
                    } 
                    else 
                    {
                        headline.append(x);
                    }
                    
                    if (j2 < adapter.getColumnCount() - 1) {
                        headline.append(",");
                    }
                    
                }
                biout.write(headline.toString().getBytes());
            }
            biout.close();
        }
        catch (Exception e) {
            // empty catch block
        }
        adapter.close();
    }
    
    void modifysaved(HashMap saved, Webform w, User user) {
        w.deleteQuery = "";
        w.updateQuery = "";
        w.insertQuery = "";
    }

    public String getformat() {
        return "DataCSV";
    }

    public void init(ServletConfig config) throws ServletException {
        super.init(config);
    }

    public void destroy() {
    }

    public String getServletInfo() {
        return "Short description";
    }
}
