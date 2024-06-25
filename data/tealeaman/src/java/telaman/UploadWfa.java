/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
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

@WebServlet(name = "UploadWfa", urlPatterns = {"/UploadWfa"},   asyncSupported = false) 
public class UploadWfa extends UploadFile 
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
        String msg = "";
        boolean welldone = false;
        User user = (User)( session.getAttribute("User"));
        if (user == null || user.orgnum!=orgnum)
        {
            msg = "Please relogin";
        }
        else
        {  
            orgnum=user.orgnum;
            HashMap<String,String> params = new HashMap(10);
            ServletInputStream servletinputstream = request.getInputStream();
            String encoding = request.getCharacterEncoding();
            String conttype = getConttype(request);
            readParameters(params, servletinputstream, encoding, conttype);
            String langcode = (String)(params.get("langcode"));
            String longFileName = Toolbox.validate((String) (params.get("filename")), "@#$-+/\\_:", 150);
            String shortFileName = FileOperation.getFileName(longFileName);
            
            try
            {
                String tempdir  = Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator +  "wfattach"; 
                File tempfile = Uploadfile(params, tempdir, conttype, servletinputstream, langcode, MaxUploadSize);
 
                if (tempfile == null) 
                {
                    msg =  errmsg( (String)params.get("uploaderrors"));
                }
                else
                {
 
                    String rdap= Toolbox.validate((String)(params.get("rdap")), null, 20);


                    if (rdap == null || rdap.equals(""))
                    {
                        msg = "Form name is missing";
                    }
                    else
                    {
                        String dir  = Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator +  "wfattach" + File.separator + rdap;
                        if ( (new File(dir)).exists()==false) makedir(dir);
                        String fn = tempfile.getName();
                        fn = fn.substring(fn.length()-8, fn.length() - 5);
                        fn = shortFileName.replaceFirst("\\.", "-" + fn + ".");
                        File file1 = new File(dir, fn);
                        synchronized (renamefilelock)
                        { 
                            if (file1.exists() )
                            {
                                if (file1.length() == tempfile.length())
                                {
                                    tempfile.delete();
                                    welldone = true;
                                }
                                else
                                {
                                    do {
                                    fn = addone( fn);
                                    file1 = new File(dir, fn);
                                    }while (file1.exists());
                                }
                            }
                            if ( welldone == false)
                            {
                                welldone = renameTo(tempfile, file1);
                            }
                        }
                        if (welldone)
                        {
                            msg = encodefilepath(file1, "/", orgnum);
                        }
                        else  
                        {
                            tempfile.delete();
                            msg =  "Failed to upload file. You may try it again ";
                        }
                    }      
                }
            }
            catch (Exception exception)
            {
                servletinputstream.close();
                msg =  shortFileName + " " + Toolbox.emsgs(orgnum,158) + " " + exception.toString() ;
            } 
        
        }
         if (!welldone)
              msg = errmsg(msg);
          
         printout(response, msg, orgnum);
        
    }
    
    @Override
    public void doGet(HttpServletRequest  request, HttpServletResponse  response)
        throws ServletException, IOException
    {
        // don't do get
    }
    
   
    
}
