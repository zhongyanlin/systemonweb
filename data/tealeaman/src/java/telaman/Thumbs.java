/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package telaman;
import java.util.*;
import java.io.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;


@WebServlet(name = "Thumbs", urlPatterns = {"/Thumbs"},   asyncSupported = false)
public class Thumbs extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        User user = User.authorize(orgnum, Systemroles.TOTAL, 
                getServletConfig().getServletContext(), 
                session, 
                request,
                response,
                "Thumbs",
                true);
  
        if (user == null ||  user.webFileFolder==null || user.webFileFolder.equals("")  )
        {
              try 
                {
                    RequestDispatcher dispat = request.getServletContext().getRequestDispatcher("/login.jsp?error=generic&orgnum=" +orgnum +"&follow=R");
                    dispat.forward( request,  response);
                }
                catch (Exception e) 
                {
                }
            return;
        }
        String folder,folder0 = Toolbox.defaultParam(orgnum, request, "folder", "").replace('/', File.separatorChar).replace('\\', File.separatorChar);
        if (folder0.length()>0 && (folder0.charAt(0)=='/' || folder0.charAt(0)=='\\'))
            folder0 = folder0.substring(1);
        if (folder0.length()>0 && (folder0.charAt(folder0.length()-1)=='/' || folder0.charAt(folder0.length()-1)=='\\'))
            folder0 = folder0.substring(0,folder0.length()-1);    
        if (folder0.equals(""))
            folder = Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + user.id;
        else if (user.webFileFolder.equals("/"))
        {
            folder = Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + user.id + File.separator + folder0;
        }
        else if (user.webFileFolder!=null && !user.webFileFolder.equals(""))
        {
            folder = user.webFileFolder + File.separator + folder0;
        }
        else
        {
            folder = "";
        }
        while (!(new File(folder)).exists())
        {
            int j = folder.lastIndexOf(File.separator );
            if (j==-1) break;
            folder = folder.substring(0,j);
            j = folder0.lastIndexOf(File.separator );
            if (j>0)
               folder0 = folder0.substring(0,j);
            else
            {
                folder0 = "";
                break;
            }
            
        }
         
        //folder = folder.replaceAll("[/|\\\\]+","/").replaceAll("/$","").replace('/',File.separatorChar);
        PrintWriter out = null;
        try 
        {
            out = response.getWriter();
            out.println("<!DOCTYPE html>");
            out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >");
            out.println("<head>");
            out.print(Toolbox.getMeta(orgnum));
            out.println("<title>Thumbs</title>");    
            out.write("<script type=\"text/javascript\">");
            out.print(Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle) );
            out.write(", securitytoken=\"");
            out.print(Toolbox.gentoken("Thumbs","f1"));
            out.write("\";");
            out.print(Toolbox.someconsts(orgnum));
            out.write("</script><script type=text/javascript  src=\"");
            out.print(Toolbox.getUserLang(orgnum));
            out.write("\" ></script><script type=text/javascript  src=cookie.js></script>\n");
            out.println("</head>");
            out.println("<body style=\"margin:0px 0px 0px 0px;background-color:white\">");
            if ( (new File(folder)).exists() == false)
            {
                if (folder.equals(""))
                out.println("<script>parent.ResizeUploaded.initfolder=null;</script>");
                out.println("Invalid folder or no privillige to browse</body>");
                return;
            }
            File fall = new File(folder,FolderMaintain.imgindex);
            boolean bb = fall.exists(); 
            fall = new File(folder);
            File [] fes = fall.listFiles();
            ArrayList<String> narr = new ArrayList();
            ArrayList<String> carr = new ArrayList();
            Encode6b enc = new Encode6b(orgnum);
            ArrayList<String> dirs = new ArrayList();
            ArrayList<String> ofiles = new ArrayList();
            ArrayList<String> osize = new ArrayList();
            ArrayList<String> cfiles = new ArrayList();
            ArrayList<String> otm = new ArrayList();
            int NG = 0;
            for (int i=0; i < fes.length; i++)
            {
                if (!fes[i].isFile())
                {
                    dirs.add(fes[i].getName());
                    continue;
                }
                String fn = fes[i].getName();
                if (FolderMaintain.isimage(fn))
                    NG++;
                else  
                {
                    if (!fn.startsWith(FolderMaintain.imgindex))
                    {
                        ofiles.add(fes[i].getName());
                        osize.add(""+(fes[i].length()/1000)); 
                        cfiles.add(enc.to6b(fes[i].getAbsolutePath()));
                        otm.add("" + (fes[i].lastModified()/1000));
                    }
                   
                }
                
            }
            String xx = "";
            if (bb)
            {
                xx = enc.to6b(folder + File.separator + FolderMaintain.imgindex + ".jpg");
                out.println("<style>.icon{margin:0px;width:80px;height:80px;background:url(FileOperation?operation=open&did=" + xx + ");border-radius:3px}</style>" );
            }
            out.print("<script>");
            if (bb)
            {
                String str = FolderMaintain.filebytes(folder + File.separator + FolderMaintain.imgindex).replaceAll("\n","");
                String[] xs = str.replace("';.*","").split(",");
                if (xs.length!=NG)
                {
                    (new FolderMaintain(orgnum,folder,"","init")).run();
                     str = FolderMaintain.filebytes(folder + File.separator + FolderMaintain.imgindex).replaceAll("\n","");
                     xs = str.replace("';.*","").split(",");
                }
                StringBuffer y = new StringBuffer();
                StringBuffer z = new StringBuffer();
                for (int i=0; i < xs.length; i++)
                {
                    if (i>0){ y.append(",");z.append(",");}
                    y.append(enc.to6b(folder + File.separator +xs[i]));
                    z.append("" + ((new File(folder + File.separator, xs[i])).lastModified()/1000));
                }   
                out.print("var thumbs='" + xx + "',imgs='" + str + "',cimgs='" + y + "',tms='" + z + "';\n");
            }
            else
               (new Thread(new FolderMaintain( orgnum, folder,  "", "init"))).start();
            out.print("var folders='");
            for (int i=0; i < dirs.size(); i++)
            { 
                if (i>0)    out.print(","); out.print(dirs.get(i));
            }
            out.print("',\nothers='");
            for (int i=0; i < ofiles.size(); i++)
            { 
                if (i>0)    out.print(","); out.print(ofiles.get(i));
            }
            out.print("',\ncthers='");
            for (int i=0; i < ofiles.size(); i++)
            { 
                if (i>0)    out.print(","); out.print(cfiles.get(i));
            }
            out.print("',\notms='");
            for (int i=0; i < ofiles.size(); i++)
            { 
                if (i>0)    out.print(","); out.print(otm.get(i));
            }
            out.print("',\nosizes='");
            for (int i=0; i < ofiles.size(); i++)
            { 
                if (i>0)    out.print(","); out.print(osize.get(i));
            }
            out.println("';var path='" + user.id + "/" + folder0.replace('\\', '/') + "';</script>\n<script src=curve.js></script><script src=thumbnails.js></script>");
            out.println("</body>");
            out.println("</html>");
        }catch(Exception e){}
    }
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }
}
