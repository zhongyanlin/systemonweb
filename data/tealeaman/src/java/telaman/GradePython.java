package telaman;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import static jdk.nashorn.internal.codegen.CompilerConstants.className;

@WebServlet(name = "GradePython", urlPatterns = {"/GradePython"},   asyncSupported = true)
public class GradePython extends HttpServlet {
    protected String read(String path) {
        try {
            FileInputStream fin = new FileInputStream(path);
            InputStreamReader esr = new InputStreamReader(fin, "utf-8");
            BufferedReader ebr = new BufferedReader(esr);
            StringBuffer contents = new StringBuffer();
            String aline;
            while ((aline = ebr.readLine()) != null) {
                contents.append(aline + "\n");
            }
            ebr.close();
            esr.close();
            fin.close();
            return contents.toString();
        } catch (Exception e) {
            return "";
        }
    }

    
 
    String removecomments(String codes)
    {
        int i, k,j = 0,p,q, r,N = codes.length();
        StringBuffer s = new StringBuffer();
        String [] pq = new String[]{"#","\n","'''","'''","\"\"\"","\"\"\""};
         
        while (j < N)
        {
            q = -1; r = 0;
            for ( i = 0; i < 3; i++)
            {   
                k = codes.indexOf(pq[i*2], j); 
                if (k >=0 && (k < q || q < 0))
                {q = k; r = i;}
            }
            if (q < 0) break;
            p = codes.indexOf(pq[2*r+1],q); 
            s.append(codes.substring(j, q));
            int L = p==-1?N:(r==0?(p+1):(p+3));
            for (k=q; k < L; k++)
                if (codes.charAt(k) == '\t' || codes.charAt(k)=='\n') 
                          s.append(codes.charAt(k));
                else 
                          s.append(" ");
            if (p==-1) 
                    return s.toString();
            j = L;
        }
        s.append(codes.substring(j));        
        return s.toString();
    }
    String antiinfinite(String s)
    {
        if (s.contains("open(" ) && s.contains("'w'") ) return "!";
        s = removecomments(s);
       return s.replaceAll("\n([\t]+)while([^:]+):\n", "\n$1ert332fs=0;\n$1while ert332fs < 100000 and ($2):\n$1\tert332fs = ert332fs + 1\n");
    }

    public String replace(String original, String newp) {
        int i = newp.indexOf("void main");
        int j = original.indexOf("void main");
        if (j == -1) {
            j = original.indexOf("void  main");
        }
        if (j == -1) {
            j = original.indexOf("void   main");
        }
        return original.substring(0, j) + newp.substring(i);

    }

   
    static int closing(String s, boolean inconst[], char open, char close, int start)
    {
        int count = 1;
        for(start++; start < s.length(); start++)
        {
            if (!inconst[start])
            {
                if (s.charAt(start) == close){ count--; if (count == 0) return start;}
                else if (s.charAt(start) == open) count++;
            }
        }
        return start;
    }

  
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum == -1) 
        {
            return;
        }
        User user = (User) session.getAttribute("User");
        if (user == null || orgnum != user.orgnum || (Systemroles.INSTRUCTOR & user.roles) == 0 && (Systemroles.ASSESSER & user.roles) == 0 && (Systemroles.SYSTEMANALYST& user.roles) == 0 && (Systemroles.ASSESSER & user.roles) == 0) 
        {
            try {
                RequestDispatcher dispat = request.getServletContext().getRequestDispatcher("/login.jsp?orgnum=" + orgnum + "&error=genericfollow=R");
                dispat.forward(request, response);
            } catch (Exception e) {
            }
            return;
        }
       
        String course = request.getParameter("course");
        String sid = request.getParameter("sid");
        String subdb = request.getParameter("subdb"); if (subdb!=null) subdb = user.id;
        String assignname = request.getParameter("assignname");
        String content = request.getParameter("content");
        String questionnum = request.getParameter("questionnum");
        String dir, javacpath, pythonBin;
        if (File.separator.equals("/")) {
            pythonBin = "/usr/bin/python";
           
        } else {
            pythonBin = "python";
        }
        user.subdb = subdb;
     
        String javahome, aline;
        try (PrintWriter out = response.getWriter();) 
        {
            response.setContentType("text/html;charset=UTF-8");
            response.setContentType("text/plain");  // Set content type of the response so that jQuery knows what it can expect.
            response.setCharacterEncoding("UTF-8");
            if (content==null || content.contains("java.awt.") || content.contains("javax.swing.")) {
                out.println("Error: can not exec GUI");
                out.close();
                return;
            }
            if (course==null || course.equals("") || sid == null || sid.equals("")  || assignname == null ||assignname.equals("") ||  content.equals("")) {
                out.println("Error: can not exec GUI");
                out.close();
                return;
            }
            try {
                dir = Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + user.id + File.separator + course.replaceAll(" ", "") + File.separator + "submission";//+ File.separator + user.id;
                if ( (new File(dir)).exists() == false) {
                out.println("Incorrect course id");
                out.close();
                }
                dir += File.separator + "working";
                if ( (new File(dir)).exists() == false)
                   UploadTeaching.makedir(dir);
                String inputmsg = "\ncourse=" + course + "\nassignname=" + assignname + "\nsubdb=" + user.subdb + "\nquestionnum=" + questionnum + "\nlength=" + content.length();
                
                String datapath =  Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + user.id + File.separator +  course + File.separator + "assignment" + File.separator + assignname;
                inputmsg += ("\ndatapath =" + datapath);
                if (questionnum != null) {
                    datapath += questionnum;
                }
                datapath += "data.txt";
                
                if (new File(datapath).exists() == false) {
                    datapath = null;
                }

                String programname = "D" + sid + ".py";
                String codes = antiinfinite(content);
                
                if (codes.equals("!")) 
                {
                    try {
                        out.println("Error: No file write is allowed. Need to Output using System.out.print. Failed  requirements. Not read project specification");
                    } catch (Exception e) {
                    }
                    out.close();
                    return;
                }
                
                if (datapath == null && codes.contains("sys.argv")) {
                    try {
                        out.println("Error: Your program contains args[0] but <br>" + assignname + questionnum + "data.txt has not been prepared.<br>Report this error message  to your instructor");
                    } catch (Exception e) {
                    }
                    out.close();
                    return;
                }
                FileWriter aWriter = new FileWriter(dir + File.separator + programname  , false);
                aWriter.write(codes);
                aWriter.close();
                int exitVal = -1;
                StringBuffer sb = new StringBuffer();;
                ProcessBuilder probuilder;
                Process proc;
                InputStreamReader isr;
                BufferedReader br;
     
                if (datapath == null) {
                    probuilder = new ProcessBuilder(pythonBin, programname);
                } else {
                    probuilder = new ProcessBuilder(pythonBin, programname, datapath);
                }
                probuilder.directory(new File(dir));
                probuilder.redirectErrorStream(true);
                proc = probuilder.start();
                InputStream is = proc.getInputStream();
                isr = new InputStreamReader(is);
                br = new BufferedReader(isr);
                String line;
                int cc = 0;

                while ((line = br.readLine()) != null) {
                    line = line.trim();
                    if (!line.equals("")  ) {
                        out.println(line);
                        cc++;
                    }
                }
                if (cc == 0) {
                    out.println("no output");
                }
                
                exitVal = proc.exitValue();
                proc.destroy();
                File f = new File(dir,programname);
                f.delete();

            } catch (Exception e) {

                out.println(e.toString());
            }

        }
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
