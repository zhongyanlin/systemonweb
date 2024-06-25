 
package telaman;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.zip.GZIPOutputStream;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import telaman.DBAdmin;
import telaman.DBConnectInfo;
import telaman.JDBCAdapter;
import telaman.Toolbox;
import telaman.User;
@WebServlet(name = "DBTableBackup", urlPatterns = {"/DBTableBackup"},   asyncSupported = false) 
public class DBTableBackup
extends HttpServlet {
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
    }

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String ext;
        HttpSession session = request.getSession(true);
        User user = User.dbauthorize(this.getServletConfig().getServletContext(), session, request, response, "DBTableBackup", true);
        if (user == null) {
            return;
        }
        int orgnum = Toolbox.setcharset(request, response);
        String encoding = Toolbox.encodings[orgnum>>16];
        
        if (orgnum == -1) return;
        CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        
        String sql = Toolbox.defaultParam(orgnum,request, "selectsql", null);
        String needdef = Toolbox.defaultParam(orgnum,request, "needdef", null, null, 2);
        String needzip = Toolbox.defaultParam(orgnum,request, "needzip", null, null, 3);
        String saveweb = Toolbox.defaultParam(orgnum,request, "saveweb", null, null, 2);
        String filename = "tlm" + Toolbox.timestr("YYYYMMDD");
        filename = Toolbox.defaultParam(orgnum,request, "filename", filename, null, 20);
        if (!(sql != null && Toolbox.verifytoken(request))) {
           
            PrintWriter out = response.getWriter();
            out.print("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body style=\"background-color:" + Toolbox.dbadmin[orgnum%65536].DBGCOLOR + ";margin:5px 5px 0px 5px\"> " + Toolbox.emsgs(orgnum,77));
            out.close();
            return;
        }
        JDBCAdapter adapter = Toolbox.getUserAdapter(user,orgnum);
        
        ext = (needzip == null ? "bak" : needzip);
        ext = "." + ext;
        if (saveweb == null) 
        {
           
            response.setCharacterEncoding( encoding);
            response. setContentType("text/html;charset=" + encoding);
            response.setHeader("Content-Disposition", "attachment; filename=" + filename + ext);
            if (!needzip.equals("zip")) 
            {
                PrintWriter out = response.getWriter();
                String err = DBAdmin.dbdataout(adapter, sql, out, null, needdef != null, needzip.equals("sql"));
                out.close();
            } 
            else 
            {
                ServletOutputStream sout = response.getOutputStream();
                GZIPOutputStream gout = new GZIPOutputStream((OutputStream)sout);
                String err = DBAdmin.dbdataout(adapter, sql, null, gout, needdef != null,false);
                gout.close();
                sout.close();
            }
        } 
        else 
        {
            String filepath;
            if (new File(filepath = user.webFileFolder + File.separator + filename + ext).exists()) {
                int j = 1;
                while (new File(user.webFileFolder + File.separator + filename + j + ext).exists()) {
                    ++j;
                }
                filename = filename + j;
                filepath = user.webFileFolder + File.separator + filename + ext;
            }
            if (needzip == null) {
                PrintWriter fout = new PrintWriter(new File(filepath));
                String err = DBAdmin.dbdataout(adapter, sql, fout, null, needdef != null,needzip.equals("sql"));
                fout.close();
                if (err.equals("")) {
                    err = Toolbox.emsgs(orgnum,661) + Toolbox.emsgs(orgnum,67) + ":" + filename + ".bak(" + new File(filepath).length() + "bytes) in " + Toolbox.emsgs(orgnum,636);
                } else {
                    new File(filepath).delete();
                    err = err.replaceAll("'", "\\'");
                }
                PrintWriter out = response.getWriter();
                out.print("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\"><script>parent.myprompt('" + err + "');</script></body></html> ");
                out.close();
            } else {
                FileOutputStream fout = new FileOutputStream(new File(filepath));
                GZIPOutputStream gout = new GZIPOutputStream(fout);
                String err = DBAdmin.dbdataout(adapter, sql, null, gout, needdef != null,needzip.equals("sql"));
                gout.close();
                fout.close();
                if (err.equals("")) {
                    err = Toolbox.emsgs(orgnum,661) + Toolbox.emsgs(orgnum,67) + ":" + filename + ".zip(" + new File(filepath).length() + "bytes) in " + Toolbox.emsgs(orgnum,636);
                } else {
                    new File(filepath).delete();
                    err = err.replaceAll("'", "\\'");
                }
                PrintWriter out = response.getWriter();
                out.print("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\"><script>parent.myprompt('" + err + "');</script></body></html> ");
                out.close();
            }
        }
        adapter.close();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest(request, response);
    }

    public String getServletInfo() {
        return "Short description";
    }
    
    
    static public void backtofile(final User user, final int orgnum) 
    {
         
        boolean sysadmin = (user.roles & Systemroles.SYSTEMADMIN) > 0;
        boolean teachadmin = (user.roles & Systemroles.TEACHINGADMIN) > 0;
        String uid = user.id;
        String filename = "tlm" + Toolbox.timestr("YYYYMMDD");
        String filepath;
        String ext = ".zip";
        if (new File(filepath = user.webFileFolder + File.separator + filename + ext).exists()) {
            int j = 1;
            while (new File(user.webFileFolder + File.separator + filename + j + ext).exists()) {
                ++j;
            }
            filename = filename + j;
            filepath = user.webFileFolder + File.separator + filename + ext;
        }
        try 
        {
            JDBCAdapter adapter = Toolbox.getUserAdapter(user,orgnum);
            String tbls[] = adapter.tableList();
            int numtables = tbls.length;
            String[] res = new String[numtables];
            long ll = System.currentTimeMillis()/1000;
            for (int j = 0; j < numtables; j++) 
            {
                res[j] = " lastupdate > " + (user.lastbackup/1000) + " AND lastupdate < " + ll;
            }

            for (int j = 0; j < numtables; j++) 
            {
                String x = tbls[j];

                if (x.equals("Session") && !sysadmin && !teachadmin) 
                {
                    res[j] += " AND Session.instructor='" + uid + "'";
                } else if (x.equals("Course") && !sysadmin && !teachadmin) {
                    res[j] += " AND  id IN (SELECT courseid FROM Session where instructor='" + uid + "')";
                } else if (x.equals("Message") && !sysadmin) {
                    res[j] += " AND (Message.rid='" + uid + "' OR Message.sid='" + uid + "')";
                } else if (x.equals("Assignment") && !sysadmin) {
                     res[j] += " AND Assignment.grader LIKE '%" + uid + "%'";
                } else if (x.equals("Submission") && !sysadmin) {
                    res[j] += " AND  CONCAT(Submission.assignname, ',',Submission.cource) IN (SELECT CONCAT(Assignment.name,',',Assignment.course) FROM Assignment WHERE grader LIKE '%" + uid + "%')";
                } else if (x.equals("Lecturenotes") && !sysadmin) {
                    res[j] += " AND courseid IN (SELECT courseid FROM Session WHEERE instructor='" + uid + "')";
                } else if (x.equals("Chatmsg") && !sysadmin) {
                    res[j] += " AND courseid IN (SELECT courseid FROM Session WHEERE instructor='" + uid + "')";
                } else if (x.equals("Registration") && !sysadmin && !teachadmin) {
                    res[j] += " AND  CONCAT(courseid,',',sessionname) IN (SELECT CONCAT(courseid,',',name) FROM Session WHEERE instructor='" + uid + "')";
                } else if (x.equals("Announcement") && !sysadmin && !teachadmin) {
                    res[j] += " AND uid='" + uid + "'";
                }

            }

            StringBuffer sql = new StringBuffer();
            for (int j = 0; j < numtables; j++) {
                if (tbls[j].equals("")) {
                    sql.append(tbls[j]);
                    if (res[j].equals("")) {
                        sql.append(" WHERE " + res[j]);
                    }
                    sql.append(";CREATE TABLE " + tbls[j] + ";");

                }
            }

            FileOutputStream fout = new FileOutputStream(new File(filepath));
            GZIPOutputStream gout = new GZIPOutputStream(fout);
            String err = DBAdmin.dbdataout(adapter, sql.toString(), null, gout, false,false);
            gout.close();
            fout.close();
            adapter.close();
            if (filepath != null) {
                err = Dropbox.uploadFile(orgnum, user.id, filepath);
                new File(filepath).delete();
            }

        } catch (Exception e) { }


    }
}

 
