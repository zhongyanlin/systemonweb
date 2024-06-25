/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package telaman;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.*;
/**
 *
 * @author zhong
 */
@WebServlet(name = "Attendance", urlPatterns = {"/Attendance"},   asyncSupported = false)  
public class Attendance extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    static HashMap<String, Integer> failed = new HashMap<>();
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String ip = request.getRemoteAddr() + request.getRemoteHost();
        
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        long l = (long)(Math.round(System.currentTimeMillis() / 30000.0));
        
        String err = "";
        if (orgnum < 0) {
            err = "orgnum";
        } else {
            //"?sessionid=" + password + "&user=" + user  + "&csname=" + session + "&ids
            JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
            String uid = Toolbox.defaultParam(orgnum, request, "user", "");
         Integer failtimes = failed.get(ip+ orgnum + uid);
        if (failtimes!=null && failtimes.intValue() > 2)
        {
            return;
        }        
            String password = Toolbox.defaultParam(orgnum, request, "sessionid", "");
            String csname = Toolbox.defaultParam(orgnum, request, "csname", "");
            String ids = Toolbox.defaultParam(orgnum, request, "ids", "");
            
            String sql = "SELECT password FROM AppUser WHERE id='" + uid + "'";
            int n = adapter.executeQuery(sql);
            if (n < 1) {
                err = "wrong user";
                adapter.close();
            } else {
                String tt = Sha1.hash(l +  uid +    csname +   adapter.getValueAt(0, 0));
               
                boolean bb = tt.equals(password);
                adapter.close();
                if (bb == false) {
                    err = "wrong pass";
                    int j = 1;
                    if (failtimes!=null) j = failtimes.intValue() + 1;
                    failed.put(ip+uid,Integer.valueOf(j));
                } else {
                    failed.remove(ip+uid);
                    User user = new User(orgnum);
                    user.id = uid;
                    user.retr();
                    user.changedb(uid);
                    adapter = Toolbox.getUserAdapter(user, orgnum);

                    String semester = Toolbox.dbadmin[orgnum % 65536].currentSemester;
                    sql = "SELECT courseid, name FROM Session WHERE semester='" + semester + "'";
                    n = adapter.executeQuery(sql);
                    if (n < 1) {
                        err = "No course or session";
                      
                        adapter.close();
                    } else {
                        String which = "";
                        int i = 0;
                        for (; i < n; i++) {
                            which = "";
                            String nm =  (adapter.getValueAt(i, 0) + adapter.getValueAt(i, 1));
                            if (nm.equals(csname)) break;
                            which = "-";
                            String nm1 =  (adapter.getValueAt(i, 0) + "-"+ adapter.getValueAt(i, 1));
                            if (nm1.equals(csname)) break;
                            which = " ";
                            String nm2 =  (adapter.getValueAt(i, 0) + " "+ adapter.getValueAt(i, 1));
                            if (nm2.equals(csname)) break;
                           
                        }
                       
                        if (i == n) {
                            err = "wrong course or session";
                            adapter.close();
                        } else if (ids.equals("")) {
                            err = "ok";
                            adapter.close();
                        } else {
                            String[] arr = ids.split("\\-");
                            long ll = System.currentTimeMillis() / 1000;
                            for (int k = 0; k < arr.length; k++) {
                                String sid = arr[k];
                                sql = "SELECT courseid, sessioname FROM Registration WHERE semester='" + semester + "' AND sid='" + sid + "'";
                                n = adapter.executeQuery(sql);
                                if (n < 1) {
                                    err += sid + ",";
                                    continue;
                                }
                                int m = 0;
                                for (; m < n; m++) {
                                    if (csname.equals(adapter.getValueAt(m, 0) + which+ adapter.getValueAt(m, 1))) {
                                        break;
                                    }
                                }
                                if (m == n) {
                                    err += sid + ",";
                                    continue;
                                }
                                String courseid = adapter.getValueAt(m, 0);
                                String sessionname = adapter.getValueAt(m, 1);
                                String q = arr[k].replaceAll("'","");
                                if (q.charAt(0) == '0')
                                    sql= "DELETE FROM Absence WHERE  courseid='" + courseid.replaceAll("'","") + "' AND sessionname='"+ sessionname.replaceAll("'","")
                                            + "' AND  sid='" + q.substring(1) + "' AND semester=" + semester + " AND (" + ll + "-atime < 3000 AND " + ll + ">atime";
                                else
                                    sql = "INSERT INTO Absence(lastupdate, courseid, sessionname, sid, semester,atime,justified) VALUES(" + ll 
                                            + ",'" + courseid.replaceAll("'","") + "','" + sessionname.replaceAll("'","") + "','" + q.substring(1) + "',"
                                        + semester + "," + ll + ",0)";
                                
                                if (1 != adapter.executeUpdate(sql)) {
                                    err += sid + ",";
                                }
                            }
                            if (err.equals("")) err="ok";
                            else err = "wrong " + err.replaceFirst(",$","");
                            adapter.close();
                        }
                        
                    }
                }
            }
        }
        
        PrintWriter out = response.getWriter();
        out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body>" + err + "</body></html>");
        out.close();
        return;
        
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
