/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package telaman;
import java.io.*;
import java.util.HashMap;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import static telaman.UploadFile.getConttype;
import static telaman.UploadFile.pfolders;
import static telaman.UploadFile.readParameters;
 

 
@WebServlet(name = "AttachProgram", urlPatterns = {"/AttachProgram"},   asyncSupported = false) 
public class AttachProgram extends UploadFile 
{
    public static long MaxUploadSize = 8000000;
    private Object sessionlock = new Object();

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String msg;
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
    if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        response.setContentType("text/html;charset=" + Toolbox.encodings[orgnum>>16]);
        User user = (User)session.getAttribute("User");
        msg = "";
        if (user == null || orgnum!=user.orgnum) {
            msg = errmsg("Please relogin");
             try 
            {
                RequestDispatcher dispat = request.getServletContext().getRequestDispatcher("/login.jsp?orgnum=" + orgnum + "&error=genericfollow=R") ;
                dispat.forward( request,  response);
            }
            catch (Exception e) 
            {
            }
        return;
        } else if (user.orgnum!=orgnum || !Systemroles.owndb(user.roles) && (user.iid == null || user.iid.equals("")) && (user.roles & 511) == 0) {
            msg = errmsg("No permission");
        } else {
            HashMap<String,String> params = new HashMap<>(10);
            orgnum=user.orgnum;
            ServletInputStream servletinputstream = request.getInputStream();
            String encoding = request.getCharacterEncoding();
            String conttype = getConttype(request);
            readParameters(params, servletinputstream, encoding, conttype);
            String langcode = (String)(params.get("langcode"));
            String longFileName = Toolbox.validate((String)params.get("filename"), "@#$-+/\\:", 150);
            String shortFileName = FileOperation.getFileName(longFileName);
            File tempfile = null;
            try 
            {
                String tempuploadfolder = Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + "tempupload";
       
                tempfile = Uploadfile(params, tempuploadfolder, conttype, servletinputstream, langcode, UploadTeaching.MaxUploadSize);
                if (tempfile == null) 
                {
                    msg = errmsg((String)params.get("uploaderrors"));
                }
                else 
                {
                    String assignname = Toolbox.validate((String)params.get("assignname"), null, 20);
                   
                    String iid = Toolbox.validate((String)params.get("iid"), null, 20);
                    String subdb = Toolbox.validate((String)params.get("subdb"), null, 20);
                    String course = Toolbox.validate((String)params.get("course"), null, 20);
                    if (course == null)
                        course = Toolbox.validate((String)params.get("CourseId"), null, 20);
 
                    String sid = Toolbox.validate((String)params.get("sid"), null, 30);
                    String subfolder = Toolbox.validate((String)params.get("subfolder"), null, 30);
                 
                    if ( subfolder== null || subfolder.equals("")) 
                    {
                        subfolder = pfolders[3];
                    }
                    else if (subfolder.replaceFirst("[0-9]", "").equals(""))
                    { 
                        
                        int kk = 3; 
                        try{ 
                            kk =  Integer.parseInt(subfolder);
                        }
                        catch(Exception e2){}
                        subfolder = pfolders[kk];
                    }
                    else if (subfolder.equals("lecture") && !Toolbox.lang.equals("en"))
                    {
                        subfolder = pfolders[0];
                    }
                     else if (subfolder.equals("assignment") && !Toolbox.lang.equals("en"))
                    {
                        subfolder = pfolders[1];
                    }
                    else if (subfolder.equals("answer") && !Toolbox.lang.equals("en"))
                    {
                        subfolder = pfolders[2];
                    }
                    else if (subfolder.equals("submission") && !Toolbox.lang.equals("en"))
                    {
                        subfolder = pfolders[3];
                    }
                    else if (subfolder.equals("notes") && !Toolbox.lang.equals("en"))
                    {
                        subfolder = pfolders[4];
                    }

                    if ( (subfolder.equals(pfolders[3])) && sid == null) 
                    {
                        sid = user.id;
                    }
                    if (course == null || course.equals("")) 
                    {
                        course = pfolders[pfolders.length-1];
                    }
                    if (subdb == null || subdb.equals("")) 
                    {
                        subdb =  (subfolder.equals(pfolders[1]) || subfolder.equals(pfolders[2]) ) ? user.id :
                                (iid != null ? iid : user.id);
                    }
                     
                    String dir = Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + subdb + File.separator + course.replaceAll(" ", "") + File.separator + subfolder;
 
                    if (subfolder.equals(pfolders[3]))
                    {
                        dir = dir + File.separator + sid;
                    }
 
                    if (!new File(dir).exists()) 
                    {
                        UploadTeaching.makedir((String)dir);
                    }
                     
                    boolean b = false;
                    File file1 = null;
                    Object object = UploadTeaching.renamefilelock;
                    synchronized (object) 
                    {  
                        shortFileName = mkfn(dir, shortFileName);
                        file1 = new File(dir, shortFileName);
                        b = UploadTeaching.renameTo((File)tempfile, (File)file1);
                        String s = compileExec(file1,assignname); 
                    }
 
                    if (b && file1.exists()) 
                    {
                        msg = encodefilepath(file1, "/", orgnum);  
                    } 
                    else 
                    {
                        tempfile.delete();  
                        tempfile = null;
                        msg = errmsg("Failed to attach file. You may try it again later");
                    }
                }
            }
            catch (Exception exception) {  
                servletinputstream.close();
                if (tempfile != null) {
                    tempfile.delete();
                }
                msg = errmsg(shortFileName + " " + Toolbox.emsgs(orgnum,158) + " " + exception.toString());
            }
        }
        
        printout(response, msg, orgnum);
    }
    static String compileExec(File file1,String assign)
    {
         
        return "";
    }
}
