 
package telaman;

import java.io.*;
import java.util.*;
import javax.servlet.*;
//import javax.servlet.http.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet(name = "FileSynjar", urlPatterns = {"/FileSynjar"},   asyncSupported = false)
public class FileSynjar extends HttpServlet {
   
    /** 
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected  void processRequest(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        User user = (User)( session.getAttribute("User"));
        {
            if (user == null )
            {
                 RequestDispatcher requestdispatcher1 = getServletConfig().getServletContext().getRequestDispatcher("/login.jsp?orgnum=" + orgnum);
                 requestdispatcher1.forward(request, response);
                 return;
            }
            else if ( user.webFileFolder.equals("") )
            {
                 RequestDispatcher requestdispatcher1 = getServletConfig().getServletContext().getRequestDispatcher("/unauthorize.jsp");
                 requestdispatcher1.forward(request, response);
                 return;
            }
        }
        String userdir = user.webFileFolder;
        orgnum=user.orgnum;
        String dir = Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "conf" ;
        ServletOutputStream stream = null;
        BufferedInputStream buf = null;
        String filename = "fs" + user.id +".jar";
         String filetxt= "fs" + user.id +".txt";
        try
        {
           File f = null;


           f = new File(userdir, filename);
           String w = "w";
           while ( (new File(userdir + File.separator + w)).exists())
              w += "w";
           
           File s = new File(dir,     "FileSyn.jar");
           String workdir = userdir + File.separator + w;
           (new File(workdir)).mkdir();
           String initdir = Toolbox.defaultParam(orgnum,request, "dir",  null, "@#$+:\\/",200);
           if (initdir==null) initdir="";
           else if (initdir.equals("")) initdir="/";
           FileWriter fout = new FileWriter(workdir +  File.separator + "parameter.txt",false);
           fout.write(request.getRequestURL().toString().replaceFirst("FileSynjar", "\r\n")
                +  user.id
                + "\r\n"
                +  Sha1.hash(FileSynweb.webfilekey+user.id)
                + "\r\n"
                + Toolbox.langs[orgnum>>16]
                + "\r\n"
                + initdir
                );
           fout.close();



           int jj = 0;
           byte bf[]= new byte[1024];
           FileInputStream fin = new FileInputStream(s);
           FileOutputStream fou  = new FileOutputStream(f);
           while ( (jj = fin.read(bf)) > 0)
                   fou.write(bf,0,jj);
           fin.close();
           fou.close();

           fin = new FileInputStream(new File(dir, Toolbox.langs[orgnum>>16] +"f.txt"));
           fou  = new FileOutputStream(new File(workdir,Toolbox.langs[orgnum>>16] +"f.txt"));
           while ( (jj = fin.read(bf)) > 0)
                   fou.write(bf,0,jj);
           fin.close();
           fou.close();

           boolean b = (new File(userdir, filetxt)).exists();
           if (b){
           fin = new FileInputStream(new File(userdir, filetxt));
           fou  = new FileOutputStream(new File(workdir, filetxt));
           while ( (jj = fin.read(bf)) > 0)
                   fou.write(bf,0,jj);
           fin.close();
           fou.close();
           }
            
           File folder = new File(workdir);
           Runtime r = Runtime.getRuntime();
           Process proc = r.exec("jar uf .." + File.separator + filename +" parameter.txt " +  Toolbox.langs[orgnum>>16] +"f.txt " + (b?filetxt:""), null, folder);
           int exitVal = proc.waitFor();
            
           if (exitVal==0)
           {
              f = new File(f.getAbsolutePath());
              FileSyn.del(folder);
           }
           else
           {
              PrintWriter out = response.getWriter();
              out.print("Error");
              out.close();
              return;
           }



           response.setContentType("application/java");
           response.addHeader("Content-Disposition", "attachment;filename=" + filename);
           stream = response.getOutputStream();
           response.setContentLength((int) f.length());
           FileInputStream input = new FileInputStream(f);
           buf = new BufferedInputStream(input);
           int readBytes = 0;
           while ((readBytes = buf.read()) != -1)
           {
              stream.write(readBytes);
           }
           input.close();
           
        }
        catch (Exception e)
        {
            PrintWriter out = response.getWriter();
            out.print("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body>Error:" + e.toString() +"</body></html>");
            out.close();
        }
        finally
        {
           if (stream != null) stream.close();
           if (buf != null) buf.close();
        }


    }



    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /** 
     * Handles the HTTP <code>GET</code> method.
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
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
