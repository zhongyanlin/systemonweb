package telaman;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*; 
import java.util.Scanner;
import javax.servlet.annotation.WebServlet;

@WebServlet(name = "Fetchasis", urlPatterns = {"/Fetchasis"},   asyncSupported = false) 
public class Fetchasis extends HttpServlet 
{
    
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
         ServletOutputStream stream = null;
            BufferedInputStream buf = null;
        String fid = request.getParameter("fid");
         
        if (fid == null)
        {
            response.addHeader("Content-Disposition",  "inline;filename=listing"  );
            PrintWriter out = response.getWriter();
            out.println( "<h1>Error</h1>File does not exist or not permitted to access");
            out.close();
            return; 
        }
        fid = Noexec.fromnum(fid);
        
        int i = fid.lastIndexOf("/");
        
        javax.servlet.ServletContext application = request.getServletContext();
        String ab =  Toolbox.installpath;
        String file = "index.html";
        boolean isfolder = false;
        if (i != fid.length()-1)
        {
            file = fid.substring(i+1);
        }
        else 
        {
            fid +=  file;
            isfolder = true;
        }
         
        int jj = Noexec.root.length() - 1;
    
        ab += fid.substring(jj).replace('/', File.separator.charAt(0));
        
       
        File f = new File(ab);
        if (isfolder && f.exists()) isfolder = false;
       
        if (isfolder)
        {
            String perm = ab.replaceFirst("index\\.html", "tmlpermi.txt");
            fid = fid.replaceFirst("index\\.html", "");
            perm = Noexec.filebytes(perm);
            StringBuffer sb = new StringBuffer();
            ab = ab.replaceFirst("index\\.html", "");
           
            f = new File(ab);
            File lp[] = f.listFiles();
            if (!fid.equals(Noexec.root))
            {
                String back = fid.replaceFirst("[^/]+/$", "");
                sb.append("<tr><td><a href=\"" + back + "\">..</td><td colspan=2></td></tr>");
            }
            if (lp!=null)
            for (int j=0; j  < lp.length; j++)
            {
                if (perm!=null && perm.contains("," + lp[j].getName() + ",")) continue;
                if (fid.equals(Noexec.root) && lp[j].getName().equals("WEB-INF")) continue;
                if (fid.equals(Noexec.root) && lp[j].getName().equals("META-INF")) continue;
                if ( lp[j].getName().equals("tmlpermi.txt")) continue;
                String fd = "<td  align=center>    </td>";
                String sl = "";
                if (!lp[j].isDirectory()) 
                     fd = "<td  align=right width=10% > " + lp[j].length() +  "bytes </td>";
                else
                    sl = "/";
                sb.append("<tr><td align=left width=%60 ><a href=\"" + fid + lp[j].getName() + sl+ "\">" + lp[j].getName() +  sl+ "</td>" 
                        + fd 
                + "<td>" 
                + (new java.util.Date(lp[j].lastModified())).toString()
                + "</td></tr>");
                       
            }
            
            response.addHeader("Content-Disposition",  "inline;filename=listing"  );
            PrintWriter out = response.getWriter();
            out.println( "<!DOCTYPE html><html><head><style>body{font-familty:arial;}\ntable tr td{font-family:arial;font-size:18px;}</style></head><body><h1>" + fid + "</h1><table width=98% >" + sb + "</table></table>");
            out.close();
            return;
        }
        
        String   des = "attachment";
        if (!f.exists())
        {
            
            PrintWriter out = response.getWriter();
            out.println(fid + " not exists or not accessible");
            out.close();
        }
        else  try 
        {
                response.setContentType("application/x-download");
                response.addHeader("Content-Disposition", des + ";filename=" + file);
                stream = response.getOutputStream();
                response.setContentLength((int) f.length());
                FileInputStream input = new FileInputStream(f);
                buf = new BufferedInputStream(input);
                int readBytes = 0;
                while ((readBytes = buf.read()) != -1) {
                    stream.write(readBytes);
                }
                input.close();
            } catch (IOException ioe) {
                throw new ServletException(ioe.getMessage());
            } finally {
                if (stream != null) {
                    stream.close();
                }
                if (buf != null) {
                    buf.close();
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
