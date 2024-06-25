 
package telaman;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
 
@WebServlet(name = "UploadComm", urlPatterns = {"/UploadComm"},   asyncSupported = false) 
public class UploadComm extends UploadFile
{

    static public long MaxUploadSize = 8000000;
    private Object sessionlock = new Object();

    @Override
    public void doPost(HttpServletRequest  request, HttpServletResponse  response)
        throws ServletException, IOException
    {
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
       if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        response.setContentType("text/html;charset=" + Toolbox.encodings[orgnum>>16]);
        User user = (User) (session.getAttribute("User"));
        String msg = "";
        if (user == null )
        {
            try 
                {
                    RequestDispatcher dispat = request.getServletContext().getRequestDispatcher("/login.jsp?error=generic&orgnum=" + orgnum + "&follow=R");
                    dispat.forward( request,  response);
                }
                catch (Exception e) 
                {
                }
            return;
        }
        else if  (user.orgnum!=orgnum || Systemroles.owndb(user.roles) == false && (user.iid == null || user.iid.equals("")) && (user.roles & Systemroles.INTERNAL) == 0)  
        {
            msg =  errmsg("No permission");
        }
        else
        {
            HashMap params = new HashMap(10);
            ServletInputStream servletinputstream = request.getInputStream();
            String encoding = request.getCharacterEncoding();
            String conttype = UploadFile.getConttype(request);
            UploadFile.readParameters(params, servletinputstream, encoding, conttype);
            String langcode = (String)params.get("langcode");
            String longFileName = Toolbox.validate((String) (params.get("filename")), "@#$-+/\\:", 150);
            String shortFileName = FileOperation.getFileName(longFileName);
            File tempfile = null;
            try
            {
                String tempuploadfolder = Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + "tempupload";
                tempfile = Uploadfile(params, tempuploadfolder, conttype, servletinputstream, langcode, MaxUploadSize);
 
                if (tempfile == null ||  params.get("subdb") == null) 
                {
                    msg =  errmsg( (String)params.get("uploaderrors"));
                }
                else
                {
                     
                    String  subdb = (String) (params.get("subdb")); 
                    subdb = Toolbox.validate(subdb, null, 20);
                    if (subdb==null || subdb.equals("")) 
                    {
                        if ( user.iid !=null && !user.iid.equals(""))
                            subdb = user.iid;
                        else
                            subdb = user.id;
                    }
       
                    String dir = Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + subdb + File.separator ;
                    if (Systemroles.owndb(user.roles) && !user.webFileFolder.equals(""))
                        dir = user.webFileFolder + File.separator;
                    String subfolder = Toolbox.validate((String)(params.get("subfolder")), null, 20);
                     int N = pfolders.length;
                     String [] pfs = new String[]{pfolders[N-5],pfolders[N-4],pfolders[N-3],pfolders[N-2]};
                    if (subfolder == null || subfolder.equals(""))
                    {
                       subfolder = pfolders[N-1]; 
                    }
                    else if (subfolder.replaceFirst("[0-9]", "").equals(""))
                    {
                        int   k = Integer.parseInt(subfolder);
                        subfolder = pfs[k]; 
                    } 
                    else if (subfolder.equals("email") )
                    {
                        subfolder = pfs[0];
                    }
                     else if (subfolder.equals("announce") )
                    {
                        subfolder =  pfs[1];
                    }
                    else if (subfolder.equals("chat")  )
                    {
                        subfolder =  pfs[2];
                    }
                    else if (subfolder.equals("discussion") )
                    {
                        subfolder =  pfs[3];
                    }
                  
                    dir +=   subfolder;
                  
                    if ( (new File(dir)).exists()==false) makedir(dir);
                     
                     File file1 = new File(dir, shortFileName);
                     boolean ren = true;
 
                     if ( file1.exists() && file1.length() == tempfile.length())
                     {
                            tempfile.delete();
                            msg =  encodefilepath(file1, "/", orgnum);
                     }
                     else
                     {

                            boolean b = false;
                            synchronized (renamefilelock)
                            {
                                shortFileName = mkfn(dir, shortFileName);
                                file1 = new File(dir, shortFileName);
                                b = renameTo(tempfile, file1);
                            }
                            if (b && file1.exists()  )
                            {
                                msg = encodefilepath(file1,"/", orgnum);
                            }
                            else  
                            {
                                tempfile.delete();
                                tempfile = null;
                                msg = errmsg("Failed to upload file. You may try it again");
                            }
                        }
                    }
                
            }
            catch (Exception exception)
            {
                
                servletinputstream.close();
                if ( tempfile != null)tempfile.delete(); 
                msg =  errmsg( shortFileName + " " + Toolbox.emsgs(orgnum,158) + " " + exception.toString() );
            } 
        } 
        
        printout(response, msg, orgnum); 
        
    }

    
}
